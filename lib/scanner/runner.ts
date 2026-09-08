import type { LiveTool, ScanPage, ScanReport } from './types'
import type { Candidate } from './discover'
import { publicURL } from '../tools/engine'
import { host, matchesHost, normalizeURL } from './url'
import { auditRows, backlinkReport, internalRows, report } from './analysis'
import { matchOpportunities } from './opportunities'

type Progress = (message: string, done: number, total: number) => void
export async function scanRequest<T>(url: string, signal: AbortSignal, mode = 'inspect', fresh = false, targets: string[] = []): Promise<T> {
  if (signal.aborted) throw new DOMException('Cancelled', 'AbortError')
  const response = await fetch('/api/scan', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-BacklinkGrid-Scan': '1' }, body: JSON.stringify({ url, mode, fresh, targets }), signal })
  const data = await response.json()
  if (!response.ok) throw new Error(data.error || 'The scan could not finish.')
  return data
}
const message = (e: unknown) => e instanceof Error ? e.message : 'Could not inspect this page.'
const pause = (signal: AbortSignal) => new Promise<void>((resolve, reject) => {
  const abort = () => { clearTimeout(timer); reject(new DOMException('Cancelled', 'AbortError')) }
  const timer = setTimeout(() => { signal.removeEventListener('abort', abort); resolve() }, 350)
  signal.addEventListener('abort', abort, { once: true }); if (signal.aborted) abort()
})
async function crawl(website: string, signal: AbortSignal, progress: Progress, focus = '') {
  const pages: ScanPage[] = [], notes: string[] = [], listed: string[] = []
  const root = await scanRequest<ScanPage>(website, signal)
  pages.push(root)
  if (root.status !== 200 || !/html/i.test(root.type)) throw new Error(`The starting page returned HTTP ${root.status} (${root.type}). Use a readable HTML page.`)
  const same = (url: string) => { try { const u = new URL(url); return u.origin === new URL(root.url).origin && !u.search && !/\.(pdf|png|jpg|jpeg|webp|zip|mp4|svg|xml|txt|csv)$/i.test(u.pathname) } catch { return false } }
  const maps = root.sitemaps.length ? root.sitemaps : [new URL('/sitemap.xml', root.url).href]
  const seenMaps = new Set<string>()
  while (maps.length && seenMaps.size < 3) {
    const url = maps.shift()!; if (seenMaps.has(url)) continue; seenMaps.add(url)
    progress('Reading sitemap discovery', pages.length, 12)
    try {
      await pause(signal)
      const page = await scanRequest<ScanPage>(url, signal)
      if (page.status !== 200 || !page.sitemap.length) { notes.push(`No usable XML sitemap at ${url}.`); continue }
      for (const entry of page.sitemap) {
        if (new URL(entry).origin !== new URL(root.url).origin) continue
        if (/\.xml(?:\?|$)/i.test(entry)) maps.push(entry)
        else if (same(entry)) listed.push(entry)
      }
      if (page.truncated) notes.push('Sitemap discovery was limited to its first 200 entries.')
    } catch (error) { if (signal.aborted) throw error; notes.push(`Sitemap: ${message(error)}`) }
  }
  const queue = [...new Set([...root.links.filter(l => l.body).map(l => l.url), ...listed, ...root.links.map(l => l.url)].filter(same))]
  if (focus) {
    const terms = focus.toLowerCase().split(/[^a-z0-9]+/).filter(t => t.length > 3)
    const score = (url: string) => terms.reduce((n, t) => n + (new URL(url).pathname.includes(t) ? 4 : 0), 0) + new URL(url).pathname.split('/').length - (/privacy|terms|contact|pricing|about/.test(url) ? 10 : 0)
    queue.sort((a, b) => score(b) - score(a))
  }
  const visited = new Set([normalizeURL(root.url), normalizeURL(root.requested)])
  let attempted = 1
  while (queue.length && attempted < 12) {
    const url = queue.shift()!; if (visited.has(normalizeURL(url))) continue; visited.add(normalizeURL(url)); attempted++
    progress(`Reading page ${attempted} of up to 12`, attempted - 1, 12)
    try { await pause(signal); const page = await scanRequest<ScanPage>(url, signal); if (new URL(page.url).origin !== new URL(root.url).origin) { notes.push(`${url} redirected outside the scanned origin and was excluded.`); continue } pages.push(page); queue.push(...page.links.filter(l => same(l.url) && !visited.has(normalizeURL(l.url))).map(l => l.url).slice(0, 40)) }
    catch (error) { if (signal.aborted) throw error; notes.push(`${url}: ${message(error)}`) }
  }
  notes.push(`${attempted} page requests attempted; ${pages.length} responses inspected. Discovery is a bounded sample, not a complete crawl.`)
  if (pages.some(p => p.truncated)) notes.push('Some pages reached extraction limits (250 links or 120 passages).')
  return { pages, notes, listed }
}
export async function runLive(tool: LiveTool, values: Record<string, string>, signal: AbortSignal, progress: Progress): Promise<ScanReport> {
  const website = publicURL(values.website || '').href
  if (tool.kind === 'backlink') {
    publicURL(values.target || '')
    progress('Fetching the source page', 0, 1)
    return backlinkReport(await scanRequest<ScanPage>(website, signal, 'inspect', true, [values.target]), values.target)
  }
  if (tool.kind === 'opportunities') {
    progress('Reading your website', 0, 1)
    let text = '', note = ''
    try { const page = await scanRequest<ScanPage>(website, signal); if (page.status !== 200) throw new Error(`HTTP ${page.status}`); text = [page.title, page.description, ...page.h1].join(' '); note = `Homepage signals: ${text.slice(0, 240)}. Fetched ${page.checked}.` }
    catch (error) { if (signal.aborted) throw error; note = `Homepage unavailable; matches use your selected business type only. ${message(error)}` }
    const matches = matchOpportunities(values.industry, values.budget === 'Include variable fees', text)
    return report('Your backlink opportunity shortlist', `${matches.length} matches for ${values.industry}. Review eligibility before submitting.`, ['Opportunity', 'Why it fits', 'Eligibility', 'Cost notes', 'Submission steps', 'Website'], matches.map(o => [o.name, `Matches ${values.industry}${o.evidence.length ? `; homepage mentions ${o.evidence.join(', ')}` : ''}`, o.eligibility, o.fee, o.steps, o.url]), [note, 'Selected from 18 public channels. Costs are recorded research notes, not live quotes. These are submission routes, not guaranteed backlinks. The full bundle contains 276 opportunities.'])
  }
  if (tool.kind === 'gap') {
    const competitors = [...new Set((values.competitors || '').split(/[\n,]+/).map(s => s.trim()).filter(Boolean).map(s => host(publicURL(s).href)))]
    if (!competitors.length || competitors.length > 2) throw new Error('Enter one or two competitor domains.')
    if (competitors.includes(host(website))) throw new Error('Choose competitors different from your own domain.')
    const sources = (values.sources || '').split(/\n/).map(s => s.trim()).filter(Boolean)
    if (sources.length > 10) throw new Error('Add at most 10 source page URLs.')
    const candidates: Candidate[] = sources.map(s => ({ source: publicURL(s).href, target: '', provider: 'Your candidate URL' }))
    const notes: string[] = []
    for (const competitor of competitors) {
      progress(`Discovering references to ${competitor}`, 0, 12)
      const data = await scanRequest<{ candidates: Candidate[]; notes: string[] }>(competitor, signal, 'discover')
      candidates.push(...data.candidates); notes.push(...data.notes); await pause(signal)
    }
    const unique = [...new Map(candidates.map(c => [c.source, c])).values()].slice(0, 12)
    const rows: string[][] = []
    for (const [i, candidate] of unique.entries()) {
      progress(`Verifying source ${i + 1} of ${unique.length}`, i, unique.length)
      try {
        if (new URL(candidate.source).hostname === 'news.ycombinator.com' && new URL(candidate.source).pathname === '/item') {
          await pause(signal)
          const item = await scanRequest<{ url: string; title: string; checked: string }>(candidate.source, signal, 'hn-item')
          rows.push([candidate.source, 'Hacker News official API', competitors.some(c => matchesHost(item.url, c)) ? 'Current story links to competitor' : 'Current story does not link to the supplied competitors', item.url, item.title, `Verified ${item.checked}. Link attributes and discussion-page gaps are not supplied by this API.`])
          continue
        }
        await pause(signal); const page = await scanRequest<ScanPage>(candidate.source, signal, 'inspect', false, [website, ...competitors])
        if (page.status !== 200 || !/html/i.test(page.type)) throw new Error(`HTTP ${page.status}; not a readable source page.`)
        const links = page.links.filter(l => competitors.some(c => matchesHost(l.url, c)))
        const own = page.links.some(l => matchesHost(l.url, website))
        if (!links.length) rows.push([candidate.source, candidate.provider, 'Not verified in raw HTML', candidate.target, '', 'No competitor link found in the extracted sample.'])
        for (const link of links) rows.push([page.url, candidate.provider, own ? 'Both present on this page' : page.linksTruncated ? 'Competitor found; your link unknown (limit reached)' : 'Competitor found; your link not found on this page', link.url, link.anchor, link.rel || 'No rel attribute'])
      } catch (error) { if (signal.aborted) throw error; rows.push([candidate.source, candidate.provider, 'Could not verify', candidate.target, '', message(error)]) }
    }
    return report('Competitor source evidence', `${unique.length} candidate pages checked. Coverage: English Wikipedia, Hacker News and your supplied URLs.`, ['Source page', 'Discovery source', 'Result', 'Competitor target', 'Anchor', 'Attributes / evidence'], rows, [...notes, 'Page-level absence does not establish a domain-level backlink gap. Discovery is limited and may return no candidates. Wikipedia and Hacker News are editorial communities, not submission directories.'])
  }
  let target = '', phrase = values.phrase || ''
  if (tool.kind === 'internal') {
    target = publicURL(values.target || '').href
    if (host(target) !== host(website)) throw new Error('The target page must be on the website being scanned.')
    progress('Reading your target page', 0, 12)
    const page = await scanRequest<ScanPage>(target, signal)
    if (page.status !== 200 || !/html/i.test(page.type)) throw new Error('Your target page must return readable HTML with HTTP 200.')
    target = page.url
    phrase = phrase.trim() || page.h1[0] || page.title.split(/[|–—]/)[0]
    if (phrase.length < 4) throw new Error('Add a target phrase of at least four characters.')
  }
  const { pages, notes, listed } = await crawl(website, signal, progress, tool.kind === 'internal' ? phrase : '')
  if (tool.kind === 'internal') {
    const rows = internalRows(pages, target, phrase)
    return report('Internal links worth reviewing', `${rows.length} source ${rows.length === 1 ? 'page' : 'pages'} with relevant text and no existing extracted content link to your target.`, ['Source page', 'Suggested anchor', 'Existing passage', 'Target page', 'HTML snippet'], rows, [...notes, `Matching phrase: ${phrase}. Suggestions are not automatically published. Check the live page before editing.`])
  }
  if (tool.kind === 'audit') {
    const rows = auditRows(pages, listed)
    return report('Your crawlability findings', `${rows.length} findings across ${pages.length} sampled responses. Review intentional exclusions before changing them.`, ['Page', 'Priority', 'Finding', 'Evidence', 'Next step'], rows, [...notes, 'Google indexing is not checked. Robots access is tested for BacklinkGridBot; other crawlers may receive different rules. Cached pages are up to five minutes old.'])
  }
  const byURL = new Map<string, { source: string; anchor: string }[]>()
  for (const page of pages) for (const link of page.links) {
    const list = byURL.get(link.url) || []; if (list.length < 5 && !list.some(l => l.source === page.url)) list.push({ source: page.url, anchor: link.anchor }); byURL.set(link.url, list)
  }
  const destinations = [...byURL.keys()].sort((a, b) => Number(matchesHost(b, website)) - Number(matchesHost(a, website))).slice(0, 40)
  const rows: string[][] = []; let healthy = 0
  for (const [i, url] of destinations.entries()) {
    progress(`Checking destination ${i + 1} of ${destinations.length}`, i, destinations.length)
    let status = '', detail = '', final = url
    try {
      await pause(signal); const page = pages.find(p => p.requested === url) || await scanRequest<ScanPage>(url, signal)
      final = page.url
      if ([404, 410].includes(page.status)) { status = 'Confirmed broken'; detail = `HTTP ${page.status}` }
      else if (page.status >= 400) { status = 'Needs review'; detail = `HTTP ${page.status}; not confirmed missing` }
      else if (page.redirects.length) { status = 'Redirect'; detail = page.redirects.map(r => r.status).join(' → ') + ` → ${page.status}` }
      else { healthy++; continue }
    } catch (error) { if (signal.aborted) throw error; status = 'Could not verify'; detail = message(error) }
    for (const source of byURL.get(url) || []) rows.push([source.source, source.anchor, url, status, detail, final])
  }
  return report('Broken links and responses to review', `${destinations.length} destinations checked · ${healthy} returned without an error or redirect.`, ['Source page', 'Anchor text', 'Link URL', 'Result', 'Evidence', 'Final URL'], rows, [...notes, `${byURL.size} unique links discovered; only the first ${destinations.length} were checked. A timeout or access restriction is not proof of a broken link.`])
}
