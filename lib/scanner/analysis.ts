import type { ScanPage, ScanReport } from './types'
import { matchesHost, normalizeURL } from './url'
export function report(title: string, summary: string, columns: string[], rows: string[][], notes: string[] = []): ScanReport { return { title, summary, columns, rows, notes, checked: new Date().toISOString() } }
export function backlinkReport(page: ScanPage, target: string) {
  const matches = page.links.filter(link => matchesHost(link.url, target))
  const usable = page.status >= 200 && page.status < 300 && /html/i.test(page.type)
  const label = !usable || (page.linksTruncated && !matches.length) ? 'Inconclusive response' : matches.length ? 'Backlink found' : 'Not found in raw HTML'
  return report(label, `${page.status} response · ${matches.length} matching links · ${page.url}`, ['Source page', 'Target URL', 'Anchor text', 'Link attributes'], matches.map(l => [page.url, l.url, l.anchor || '(empty or image without alt)', l.rel || 'No rel attribute']), [!usable ? 'This response does not establish whether your backlink exists.' : page.linksTruncated ? 'Extraction reached its limit. Absence from these results is inconclusive.' : 'A JavaScript-rendered link may not appear in raw HTML.', ...page.redirects.map(r => `Redirect: ${r.status} ${r.url}`), `Fetched: ${page.checked}. No ranking value is inferred from link attributes.`])
}
export function internalRows(pages: ScanPage[], target: string, phrase: string) {
  const words = phrase.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(w => w.length > 2 && !['the', 'and', 'for', 'with', 'your', 'from', 'free', 'guide', 'best'].includes(w)).slice(0, 8)
  const patterns = [...new Set([phrase.trim(), ...words.slice(0, -1).map((w, i) => `${w} ${words[i + 1]}`)])].filter(w => w.length >= 4).map(w => new RegExp(`(?<![\\p{L}\\p{N}])${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\p{L}\\p{N}])`, 'iu'))
  const rows: string[][] = []
  for (const page of pages) {
    if (page.status !== 200 || normalizeURL(page.url) === normalizeURL(target) || page.links.some(l => l.body && normalizeURL(l.url) === normalizeURL(target))) continue
    for (const passage of page.passages) {
      const match = patterns.map(pattern => passage.match(pattern)).find(Boolean)
      if (!match) continue
      const escape = (s: string) => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;')
      rows.push([page.url, match[0], passage, target, `<a href="${escape(target)}">${escape(match[0])}</a>`]); break
    }
  }
  return rows
}
export function auditRows(pages: ScanPage[], sitemap: string[]) {
  const rows: string[][] = []
  const add = (p: ScanPage, severity: string, issue: string, evidence: string, fix: string) => rows.push([p.requested, severity, issue, evidence, fix])
  for (const p of pages) {
    for (const [agent, allowed] of Object.entries(p.crawlerRules || {})) if (!allowed) add(p, 'Review', `robots.txt restricts ${agent}`, 'Disallowed by the parsed user-agent rules.', 'Confirm this crawler policy is intentional. Training and search crawlers serve different purposes.')
    if (p.status >= 400) { add(p, 'Review', 'HTTP error', String(p.status), 'Check the response; restore intended content or remove obsolete internal links.'); continue }
    if (!/html/i.test(p.type)) { add(p, 'Review', 'Not HTML', p.type || 'Unknown content type', 'Confirm this URL is an intended document.'); continue }
    if (/\b(noindex|none)\b/i.test(p.robots.join(' '))) add(p, 'Review', 'Indexing restricted', p.robots.join('; '), 'Remove noindex only if this page should be indexed. Check meta and response headers.')
    if (p.canonicals.length > 1) add(p, 'Fix', 'Multiple canonical declarations', p.canonicals.join(' · '), 'Keep one consistent canonical declaration.')
    else if (!p.canonicals.length) add(p, 'Review', 'No HTML canonical', 'No canonical link element found.', 'Consider a self-referencing canonical for indexable pages. An HTTP Link header may provide one instead.')
    else if (normalizeURL(p.canonicals[0]) !== normalizeURL(p.url)) add(p, 'Review', 'Canonical points elsewhere', p.canonicals[0], 'Confirm consolidation is intentional and internal links use the preferred URL.')
    if (p.redirects.length) add(p, 'Review', 'Redirected URL', p.redirects.map(r => `${r.status}: ${r.url}`).join(' → '), 'Link directly to the final preferred URL where possible.')
    if (!p.title) add(p, 'Fix', 'Missing title', 'No title text found.', 'Add a descriptive page title.')
    if (!p.h1.length) add(p, 'Review', 'No H1', 'No H1 in raw HTML.', 'Use a clear visible primary heading.')
    if (p.words < 80) add(p, 'Review', 'Little raw HTML content', `${p.words} extracted words`, 'Check whether useful content requires JavaScript. This word count is a diagnostic, not a ranking threshold.')
    if (sitemap.some(u => normalizeURL(u) === normalizeURL(p.requested)) && (/\b(noindex|none)\b/i.test(p.robots.join(' ')) || p.redirects.length)) add(p, 'Fix', 'Sitemap conflicts with page signals', 'Sampled sitemap URL redirects or restricts indexing.', 'List preferred, indexable final URLs in the sitemap.')
  }
  return rows
}
