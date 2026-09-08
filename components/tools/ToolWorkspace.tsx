'use client'
import { useState } from 'react'
import type { ToolDefinition } from '@/lib/tools/catalog'
import { anchors, disavow, exportCSV, gap, gsc, pagerank, publicURL, velocity, type Result } from '@/lib/tools/engine'

function run(tool: string, values: Record<string, string>): Result {
  const v = (key: string) => (values[key] || '').trim()
  if (tool === 'link-velocity') return velocity(v('input'))
  if (tool === 'gsc-links-analyzer') return gsc(v('input'))
  if (tool === 'backlink-gap') return gap(v('own'), v('competitors'))
  if (tool === 'anchor-text-analyzer') return anchors(v('input'), v('brand'), v('keyword'))
  if (tool === 'pagerank-calculator') { if (!v('damping')) throw new Error('Enter a damping factor.'); return pagerank(v('input'), Number(v('damping'))) }
  if (tool === 'disavow-validator') return disavow(v('input'))
  if (tool === 'outreach-templates') {
    if (['name', 'topic', 'reason', 'detail'].some(k => !v(k))) throw new Error('Add your name, their page, your value proposition and the scenario evidence.')
    const url = publicURL(v('url')).href
    const intros: Record<string, string> = {
      'Resource page': `Would you consider adding this resource to ${v('topic')}?`,
      'Guest post': `I have an article idea for ${v('topic')}.`,
      'Broken link': `I noticed a link that appears to be broken on ${v('topic')}.`,
      'Unlinked mention': `Thank you for mentioning us in ${v('topic')}. Would you consider adding a link so readers can find the resource?`,
      'Link reclamation': `I'm writing about the link to our resource on ${v('topic')}. Could you check whether it can be restored or updated?`,
      'Follow-up': `A brief follow-up on my note about ${v('topic')}.`
    }
    const text = `Subject: A suggestion for ${v('topic')}\n\nHi${v('recipient') ? ' ' + v('recipient') : ''},\n\n${intros[v('scenario')] || intros['Resource page']}\n\n${v('detail')}\n\n${v('reason')}\n\nHere's the resource: ${url}\n\nIf this would be useful for your readers, I'd appreciate your consideration.\n\nThanks,\n${v('name')}`
    return { summary: 'Your draft is ready to review and edit. Nothing has been sent.', columns: [], rows: [], text }
  }
  if (tool === 'link-prospect-finder') {
    const topic = v('topic').replace(/["\r\n]/g, ' ').trim(); if (!topic) throw new Error('Enter a topic or niche.')
    const excluded = hostname(v('exclude'))
    const patterns = [['Resource pages', 'inurl:resources'], ['Useful links', '"useful links"'], ['Guest contributions', '"contributor guidelines"'], ['Guest articles', '"write for us"'], ['Directory submissions', '"submit your website"'], ['Product submissions', '"submit your product"'], ['Community resources', '"community resources"'], ['Roundups', '"weekly roundup"']]
    return { summary: 'Eight research searches. Open a search to review actual prospects; results have not been verified by this tool.', columns: ['Strategy', 'Search query', 'Search URL'], rows: patterns.map(([label, pattern]) => { const query = `"${topic}" ${pattern} -site:${excluded}`; return [label, query, 'https://www.google.com/search?q=' + encodeURIComponent(query)] }) }
  }
  if (tool === 'link-inspector') {
    if (!v('input')) throw new Error('Paste the page HTML first.')
    const base = publicURL(v('base'))
    const doc = new DOMParser().parseFromString(v('input'), 'text/html')
    const baseTag = doc.querySelector('base[href]')?.getAttribute('href')
    let resolvedBase = base.href
    if (baseTag) { try { resolvedBase = new URL(baseTag, base).href } catch { /* Use supplied base for malformed markup. */ } }
    const target = v('target') ? hostname(v('target')) : ''
    const rows: string[][] = []
    doc.querySelectorAll('a[href]').forEach(link => {
      try {
        const url = new URL(link.getAttribute('href') || '', resolvedBase)
        if (!['http:', 'https:'].includes(url.protocol)) return
        if (target && url.hostname.replace(/^www\./, '') !== target) return
        const rel = (link.getAttribute('rel') || '').toLowerCase().split(/\s+/).filter(Boolean)
        rows.push([url.href, link.textContent?.trim() || link.querySelector('img')?.getAttribute('alt') || '(empty)', rel.join(' ') || '(none)', rel.some(r => ['nofollow', 'sponsored', 'ugc'].includes(r)) ? 'Qualified link' : 'No qualifying rel token'])
      } catch { /* Invalid individual hrefs are ignored. */ }
    })
    return { summary: `${rows.length} matching HTTP(S) links in the supplied HTML. This is not a live availability or indexing check.`, columns: ['Destination', 'Anchor', 'Rel attributes', 'Classification'], rows }
  }
  throw new Error('Unknown tool.')
}
function hostname(input: string) { return publicURL(input).hostname.replace(/^www\./, '') }

export function ToolWorkspace({ tool }: { tool: ToolDefinition }) {
  const initial = Object.fromEntries(tool.fields.map(f => [f.name, f.options ? f.example : '']))
  const [values, setValues] = useState<Record<string, string>>(initial)
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)
  const update = (name: string, value: string) => { setValues(prev => ({ ...prev, [name]: value })); setResult(null); setError(''); setNotice('') }
  const output = result?.text ?? (result ? exportCSV([result.columns, ...result.rows]) : '')
  const download = () => {
    const blob = new Blob([output], { type: result?.text !== undefined ? 'text/plain;charset=utf-8' : 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `${tool.slug}.${result?.text !== undefined ? 'txt' : 'csv'}`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  return <section className="rounded-xl border border-surface-200 bg-white overflow-hidden" aria-label={tool.title}>
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-200 px-5 sm:px-7 py-4 bg-surface-50">
      <p className="text-sm font-semibold">Free · No signup · Runs in your browser</p>
      <button className="text-sm font-semibold text-brand-red underline underline-offset-4" onClick={() => { setValues(Object.fromEntries(tool.fields.map(f => [f.name, f.example]))); setResult(null); setError(''); setNotice('Example loaded. Run the tool to see the result.') }}>Try an example</button>
    </div>
    <form className="p-5 sm:p-7 space-y-5" onSubmit={e => { e.preventDefault(); setError(''); setNotice(''); setResult(null); try { const next = run(tool.slug, values); setResult(next) } catch (e) { setError(e instanceof Error ? e.message : 'Unable to process this input.') } }}>
      {tool.fields.map(field => <div key={field.name}>
        <label className="block text-sm font-semibold mb-2" htmlFor={field.name}>{field.label}</label>
        {field.options ? <select id={field.name} value={values[field.name]} onChange={e => update(field.name, e.target.value)} className="tool-input">{field.options.map(o => <option key={o}>{o}</option>)}</select>
          : field.multiline ? <textarea id={field.name} className="tool-input font-mono text-sm min-h-32" rows={field.name === 'input' ? 7 : 3} maxLength={500000} value={values[field.name]} placeholder={field.example} onChange={e => update(field.name, e.target.value)} />
          : <input id={field.name} className="tool-input" maxLength={2000} value={values[field.name]} placeholder={field.example} onChange={e => update(field.name, e.target.value)} />}
        {field.name === 'input' && <label className="inline-flex cursor-pointer text-xs text-surface-600 mt-2 underline">Or choose a text/CSV file<input aria-label="Upload input file" type="file" accept=".csv,.txt,.html" className="ml-3 max-w-[200px]" onChange={async e => {
          const file = e.target.files?.[0]; if (!file) return
          setError(''); setBusy(true)
          try { if (file.size > 500000) throw new Error('Use a file smaller than 500 KB.'); update('input', await file.text()) } catch (err) { setError(err instanceof Error ? err.message : 'Could not read this file.') } finally { setBusy(false); e.target.value = '' }
        }} /></label>}
      </div>)}
      {error && <p role="alert" className="rounded-md bg-red-50 text-red-800 p-3 text-sm">{error}</p>}
      <div className="flex gap-4 items-center"><button disabled={busy} className="bg-brand-red text-white font-bold rounded-md px-5 py-3 disabled:opacity-50">{busy ? 'Reading file…' : tool.action}</button><button type="button" className="text-sm text-surface-600 underline" onClick={() => { setValues(initial); setResult(null); setError(''); setNotice('') }}>Reset</button></div>
    </form>
    <p role="status" className="px-5 sm:px-7 text-sm text-surface-600">{notice}</p>
    {result && <div className="border-t border-surface-200 p-5 sm:p-7 bg-surface-50" aria-label="Tool results">
      <h2 className="font-bold text-xl">Your results</h2><p role="status" className="mt-2 text-sm text-surface-600">{result.summary}</p>
      {tool.slug === 'link-velocity' && <div className="mt-5 space-y-2" aria-label="Net link change chart">{result.rows.map(row => <div key={row[0]} className="flex items-center gap-3 text-xs"><span className="w-16 shrink-0">{row[0]}</span><div className="flex-1 bg-surface-200 h-5"><div className={Number(row[3]) < 0 ? 'bg-brand-red h-5' : 'bg-brand-blue h-5'} style={{ width: `${Math.abs(Number(row[3])) / Math.max(1, ...result.rows.map(r => Math.abs(Number(r[3])))) * 100}%` }} /></div><span className="w-10 text-right">{row[3]}</span></div>)}</div>}
      {result.text !== undefined ? <><label htmlFor="draft-output" className="block text-sm font-semibold mt-5 mb-2">Review and edit your output</label><textarea id="draft-output" rows={14} className="tool-input text-sm" value={result.text} onChange={e => setResult({ ...result, text: e.target.value })} /></> : <div className="overflow-x-auto mt-5"><table className="w-full text-sm text-left"><thead><tr>{result.columns.map(c => <th key={c} className="p-3 border-b border-surface-300 whitespace-nowrap">{c}</th>)}</tr></thead><tbody>{result.rows.slice(0, 200).map((row, i) => <tr key={i}>{row.map((cell, j) => <td className="p-3 border-b border-surface-200 max-w-sm break-words" key={j}>{tool.slug === 'link-prospect-finder' && j === 2 ? <a href={cell} target="_blank" rel="noopener noreferrer" className="text-brand-red underline">Search Google ↗</a> : cell}</td>)}</tr>)}</tbody></table>{!result.rows.length && <p className="py-4">No matches in the supplied data.</p>}{result.rows.length > 200 && <p className="text-xs mt-2">Showing the first 200 rows. Download includes all {result.rows.length} rows.</p>}</div>}
      <div className="flex gap-3 mt-5"><button onClick={download} className="rounded-md bg-surface-950 text-white px-4 py-2 font-semibold text-sm">Download {result.text !== undefined ? 'text' : 'CSV'}</button><button className="rounded-md border border-surface-300 px-4 py-2 font-semibold text-sm" onClick={async () => { try { await navigator.clipboard.writeText(output); setNotice('Copied to clipboard.') } catch { setNotice('Clipboard unavailable. Use Download instead.') } }}>Copy results</button></div>
    </div>}
  </section>
}
