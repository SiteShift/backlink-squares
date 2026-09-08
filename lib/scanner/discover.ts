import { safeFetch, scanURL } from './fetch'
import { host, matchesHost } from './url'
export type Candidate = { source: string; target: string; provider: string }
const cache = new Map<string, { expires: number; candidates: Candidate[]; notes: string[] }>()
export async function hnItem(source: string, signal?: AbortSignal) {
  const url = new URL(source), id = url.searchParams.get('id') || ''
  if (url.hostname !== 'news.ycombinator.com' || url.pathname !== '/item' || !/^\d{1,12}$/.test(id)) throw new Error('Enter a valid Hacker News item URL.')
  const response = await safeFetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, signal)
  if (response.status !== 200) throw new Error('The Hacker News API is unavailable.')
  const item = JSON.parse(response.body)
  if (!item || item.deleted || item.dead || item.type !== 'story' || typeof item.url !== 'string') throw new Error('This Hacker News story is missing, deleted or has no external URL.')
  return { url: scanURL(item.url).href, title: typeof item.title === 'string' ? item.title.slice(0, 250) : '', checked: new Date().toISOString() }
}
export async function discover(domain: string, signal?: AbortSignal) {
  const hostname = host(scanURL(domain).href), cached = cache.get(hostname)
  if (cached && cached.expires > Date.now()) return cached
  const candidates: Candidate[] = [], notes: string[] = []
  const wiki = `https://en.wikipedia.org/w/api.php?${new URLSearchParams({ action: 'query', format: 'json', list: 'exturlusage', euquery: `*.${hostname}`, eunamespace: '0', eulimit: '8' })}`
  const hn = `https://hn.algolia.com/api/v1/search?${new URLSearchParams({ query: hostname, restrictSearchableAttributes: 'url', tags: 'story', hitsPerPage: '8' })}`
  await Promise.all([ (async () => {
    try {
      const raw = await safeFetch(wiki, signal); if (raw.status !== 200) throw new Error()
      const data = JSON.parse(raw.body); if (!Array.isArray(data.query?.exturlusage)) throw new Error()
      for (const item of data.query.exturlusage) if (typeof item.url === 'string' && typeof item.title === 'string' && matchesHost(item.url, hostname)) candidates.push({ source: `https://en.wikipedia.org/wiki/${encodeURIComponent(item.title.replaceAll(' ', '_'))}`, target: item.url, provider: 'English Wikipedia' })
    } catch { notes.push(`Wikipedia discovery was unavailable for ${hostname}.`) }
  })(), (async () => {
    try {
      const raw = await safeFetch(hn, signal); if (raw.status !== 200) throw new Error()
      const data = JSON.parse(raw.body); if (!Array.isArray(data.hits)) throw new Error()
      for (const item of data.hits) if (typeof item.url === 'string' && /^\d+$/.test(item.objectID) && matchesHost(item.url, hostname)) candidates.push({ source: `https://news.ycombinator.com/item?id=${item.objectID}`, target: item.url, provider: 'Hacker News / Algolia' })
    } catch { notes.push(`Hacker News discovery was unavailable for ${hostname}.`) }
  })() ])
  const result = { expires: Date.now() + 900_000, candidates: [...new Map(candidates.map(c => [c.source, c])).values()], notes }
  if (cache.size >= 100) cache.delete(cache.keys().next().value!)
  cache.set(hostname, result); return result
}
