export type Result = { summary: string; columns: string[]; rows: string[][]; text?: string }

export function parseCSV(input: string): string[][] {
  const rows: string[][] = []; let row: string[] = []; let cell = ''; let quoted = false
  input = input.replace(/^\uFEFF/, '')
  for (let i = 0; i < input.length; i++) {
    const c = input[i]
    if (c === '"') {
      if (quoted && input[i + 1] === '"') { cell += '"'; i++ }
      else if (quoted) quoted = false
      else if (!cell) quoted = true
      else throw new Error('Unexpected quote. Use a valid CSV export with quoted fields.')
    } else if (c === ',' && !quoted) { row.push(cell); cell = '' }
    else if ((c === '\n' || c === '\r') && !quoted) {
      if (c === '\r' && input[i + 1] === '\n') i++
      row.push(cell); if (row.some(v => v.trim())) rows.push(row); row = []; cell = ''
    } else cell += c
  }
  if (quoted) throw new Error('A quoted CSV field is not closed.')
  row.push(cell); if (row.some(v => v.trim())) rows.push(row)
  if (rows.length > 10001) throw new Error('Use at most 10,000 data rows per analysis.')
  return rows
}
export function exportCSV(rows: string[][]) {
  return rows.map(row => row.map(value => {
    const safe = /^[=+@\-\t\r]/.test(value) && !/^-\d+(\.\d+)?$/.test(value) ? "'" + value : value
    return '"' + safe.replaceAll('"', '""') + '"'
  }).join(',')).join('\r\n')
}
export function publicURL(value: string) {
  let url: URL
  try { url = new URL(value.includes('://') ? value : 'https://' + value) } catch { throw new Error('Enter a valid website URL.') }
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || !url.hostname.includes('.')) throw new Error('Use an HTTP or HTTPS website URL without login details.')
  return url
}
function hostname(value: string) { return publicURL(value.trim()).hostname.toLowerCase().replace(/^www\./, '') }
function lines(value: string) { return value.split(/\r?\n/).map(s => s.trim()).filter(Boolean) }
function count(value: string, label: string) {
  if (!/^\d+$/.test(value.trim()) || !Number.isSafeInteger(Number(value))) throw new Error(`${label}: enter a non-negative whole number. Missing values are not zero.`)
  return Number(value)
}

export function velocity(input: string): Result {
  const [headers, ...data] = parseCSV(input)
  if (!headers || !data.length) throw new Error('Add a header and at least one month of data.')
  const required = ['month', 'new_links', 'lost_links']
  const keys = headers.map(s => s.trim().toLowerCase())
  if (required.some(k => !keys.includes(k))) throw new Error('Required columns: month, new_links, lost_links. Use the example format.')
  const seen = new Set<string>(); let total = 0
  const parsed = data.map((row, i) => {
    const month = row[keys.indexOf('month')]?.trim()
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month || '')) throw new Error(`Row ${i + 2}: month must use YYYY-MM.`)
    if (seen.has(month)) throw new Error(`Duplicate month ${month}. Combine its counts first.`)
    seen.add(month)
    const gained = count(row[keys.indexOf('new_links')] || '', `Row ${i + 2} new_links`)
    const lost = count(row[keys.indexOf('lost_links')] || '', `Row ${i + 2} lost_links`)
    return { month, gained, lost }
  }).sort((a, b) => a.month.localeCompare(b.month))
  const rows = parsed.map(p => { total += p.gained - p.lost; return [p.month, String(p.gained), String(p.lost), String(p.gained - p.lost), String(total)] })
  return { summary: `${parsed.length} supplied months · ${total} net links. Missing months are excluded, not treated as zero.`, columns: ['Month', 'New links', 'Lost links', 'Net change', 'Cumulative net change'], rows }
}
export function gap(own: string, competitors: string): Result {
  const mine = new Set(lines(own).map(hostname)); const theirs = new Set(lines(competitors).map(hostname))
  if (!mine.size || !theirs.size) throw new Error('Add at least one source website to each list.')
  const missing = [...theirs].filter(d => !mine.has(d)).sort()
  return { summary: `${missing.length} source hostnames appear only in the competitor list. Subdomains remain separate; www is normalised.`, columns: ['Prospective source', 'Reason'], rows: missing.map(d => [d, 'Absent from your supplied list']) }
}
export function anchors(input: string, brand: string, keyword: string): Result {
  if (!brand.trim() || !keyword.trim()) throw new Error('Add a brand and target phrase to classify anchors.')
  const groups = new Map<string, number>(); const terms = brand.toLowerCase().split(',').map(v => v.trim()).filter(Boolean)
  for (const text of lines(input)) groups.set(text, (groups.get(text) || 0) + 1)
  if (!groups.size) throw new Error('Paste at least one anchor, one per line.')
  const total = [...groups.values()].reduce((a, b) => a + b, 0)
  const rows = [...groups].sort((a, b) => b[1] - a[1]).map(([text, n]) => {
    const t = text.toLowerCase(); const k = keyword.toLowerCase().trim()
    const category = /^https?:\/\//i.test(text) ? 'URL' : terms.some(b => t.includes(b)) ? 'Brand' : t === k ? 'Exact phrase' : t.includes(k) ? 'Contains phrase' : /^(click here|read more|website|learn more|here)$/i.test(t) ? 'Generic' : 'Other'
    return [text, category, String(n), `${(100 * n / total).toFixed(1)}%`]
  })
  return { summary: `${total} supplied anchors · ${groups.size} distinct texts. Categories are descriptive rules, not a penalty or safety score.`, columns: ['Anchor', 'Category', 'Count', 'Share'], rows }
}
export function gsc(input: string): Result {
  const [headers, ...data] = parseCSV(input)
  if (!headers || !data.length || headers.length < 2) throw new Error('Upload a Top linking sites CSV with a website column and link-count column.')
  const keys = headers.map(s => s.toLowerCase().trim())
  const site = keys.findIndex(s => ['site', 'domain', 'top linking sites'].includes(s))
  const links = keys.findIndex(s => ['linking pages', 'external links', 'links'].includes(s))
  if (site < 0 || links < 0) throw new Error('Expected Site and Linking pages (or External links) columns. Other GSC report types are not compatible with this view.')
  const map = new Map<string, number>(); let duplicates = 0
  data.forEach((r, i) => { const host = hostname(r[site] || ''); const n = count((r[links] || '').replaceAll(',', ''), `Row ${i + 2}`); if (map.has(host)) duplicates++; map.set(host, Math.max(map.get(host) || 0, n)) })
  const total = [...map.values()].reduce((a, b) => a + b, 0)
  return { summary: `${map.size} reported websites · ${total} reported links. ${duplicates} duplicate rows consolidated using the largest count, not added twice. This is a GSC sample.`, columns: ['Website', 'Reported links', 'Share of supplied total'], rows: [...map].sort((a, b) => b[1] - a[1]).map(([d, n]) => [d, String(n), total ? `${(100 * n / total).toFixed(1)}%` : '0%']) }
}
export function pagerank(input: string, damping: number): Result {
  if (!Number.isFinite(damping) || damping < 0 || damping >= 1) throw new Error('Damping must be from 0 up to (but not including) 1.')
  const pairs = lines(input).map(line => line.split('->').map(s => s.trim()))
  if (!pairs.length || pairs.some(p => p.length !== 2 || !p[0] || !p[1])) throw new Error('Use one directed link per line, such as A -> B.')
  const names = [...new Set(pairs.flat())]; if (names.length > 100) throw new Error('Use no more than 100 pages.')
  const edges = names.map(name => new Set(pairs.filter(p => p[0] === name).map(p => names.indexOf(p[1]))))
  let ranks = names.map(() => 1 / names.length); let iterations = 0
  for (; iterations < 1000; iterations++) {
    const next = names.map(() => (1 - damping) / names.length)
    ranks.forEach((rank, i) => { const destinations = edges[i].size ? [...edges[i]] : names.map((_, j) => j); destinations.forEach(j => { next[j] += damping * rank / destinations.length }) })
    const error = ranks.reduce((sum, rank, i) => sum + Math.abs(rank - next[i]), 0); ranks = next
    if (error < 1e-10) break
  }
  return { summary: `${names.length} pages · ${Math.min(iterations + 1, 1000)} iterations. Educational graph scores, not live Google PageRank.`, columns: ['Page', 'Calculated score', 'Share'], rows: names.map((name, i) => [name, ranks[i].toFixed(8), `${(ranks[i] * 100).toFixed(2)}%`]).sort((a, b) => Number(b[1]) - Number(a[1])) }
}
export function disavow(input: string): Result {
  const output = new Set<string>()
  for (const line of lines(input)) {
    if (line.startsWith('#')) continue
    if (line.startsWith('domain:')) {
      const value = line.slice(7)
      if (/[/?#:@\s]/.test(value)) throw new Error(`Invalid domain rule: ${line}`)
      output.add('domain:' + hostname(value))
    } else {
      if (!/^https?:\/\//i.test(line)) throw new Error('Use domain:example.com for whole domains, or a full https:// URL for a specific page.')
      output.add(publicURL(line).href)
    }
  }
  if (!output.size) throw new Error('Add at least one domain rule or full URL.')
  const text = [...output].join('\n')
  return { summary: `${output.size} unique rules. Syntax validation only: this does not decide which links to disavow or submit anything to Google.`, columns: ['Rule'], rows: [...output].map(s => [s]), text }
}
