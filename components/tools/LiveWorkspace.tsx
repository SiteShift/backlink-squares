'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Download, LoaderCircle, X, Bookmark, Check } from 'lucide-react'
import type { LiveTool, ScanReport } from '@/lib/scanner/types'
import { industries } from '@/lib/scanner/opportunities'
import { runLive } from '@/lib/scanner/runner'
import { exportCSV } from '@/lib/tools/engine'

type Saved = { website: string; target: string; title: string; checked: string; signature?: string }
const STORAGE = 'backlinkgrid-live-checks-v1'
export function LiveWorkspace({ tool }: { tool: LiveTool }) {
  const [values, setValues] = useState<Record<string, string>>({ industry: industries[0], budget: 'Free basic routes only' })
  const [busy, setBusy] = useState(false), [error, setError] = useState(''), [result, setResult] = useState<ScanReport | null>(null)
  const [progress, setProgress] = useState({ message: '', done: 0, total: 1 })
  const [visible, setVisible] = useState(10), [monitor, setMonitor] = useState(false), [saved, setSaved] = useState<Saved[]>([]), [notice, setNotice] = useState('')
  const controller = useRef<AbortController | null>(null), form = useRef<HTMLFormElement>(null)
  useEffect(() => () => controller.current?.abort(), [])
  useEffect(() => {
    if (!monitor || busy) return
    const timer = setInterval(() => { if (document.visibilityState === 'visible') form.current?.requestSubmit() }, 300_000)
    return () => clearInterval(timer)
  }, [monitor, busy])
  function change(name: string, value: string) { setValues(v => ({ ...v, [name]: value })); setResult(null); setError(''); setNotice(''); setMonitor(false) }
  function saveCheck(report: ScanReport) {
    try {
      const previous: Saved[] = JSON.parse(localStorage.getItem(STORAGE) || '[]')
      const history = Array.isArray(previous) ? previous : []
      const signature = JSON.stringify(report.rows.map(row => row.slice(1)))
      const baseline = history.find(item => item.website === values.website && item.target === values.target && item.title !== 'Inconclusive response')
      const changed = report.title !== 'Inconclusive response' && baseline?.signature && baseline.signature !== signature
      const next = [{ website: values.website, target: values.target, title: report.title, checked: report.checked, signature }, ...history].slice(0, 30)
      localStorage.setItem(STORAGE, JSON.stringify(next)); setSaved(next); setNotice(changed ? 'Change detected since your last saved successful check. Review the current links and attributes below.' : report.title === 'Inconclusive response' ? 'Saved as inconclusive. This is not evidence that your backlink was removed.' : 'Check saved on this device.')
    } catch { setNotice('Browser storage is unavailable. Download your report instead.') }
  }
  async function submit(event: React.FormEvent) {
    event.preventDefault(); if (busy) return
    const abort = new AbortController(); controller.current = abort
    setBusy(true); setError(''); setNotice(''); setResult(null); setVisible(10)
    setProgress({ message: 'Starting your scan', done: 0, total: 1 })
    try {
      const data = await runLive(tool, values, abort.signal, (message, done, total) => setProgress({ message, done, total }))
      setResult(data)
      if (monitor && tool.kind === 'backlink') saveCheck(data)
    } catch (e) { setError(abort.signal.aborted ? 'Scan cancelled. You can start again when ready.' : e instanceof Error ? e.message : 'Unable to complete this scan.') }
    finally { setBusy(false); controller.current = null }
  }
  function download() {
    if (!result) return
    const csv = exportCSV([result.columns, ...result.rows, [], ['Report', result.title], ['Checked', result.checked], ...result.notes.map(n => ['Scope', n]), ['Get the Complete Backlink Database Bundle', 'https://backlinkgrid.com/bundle?utm_source=live_tool&utm_medium=csv']])
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' })); const a = document.createElement('a'); a.href = url; a.download = `${tool.slug}.csv`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  const field = (name: string, label: string, placeholder: string, optional = false, multiline = false) => <label className="block text-sm font-semibold" key={name}>{label}{optional && <span className="font-normal text-surface-500"> · optional</span>}{multiline ? <textarea rows={3} className="tool-input mt-2 font-normal" value={values[name] || ''} maxLength={5000} onChange={e => change(name, e.target.value)} placeholder={placeholder} required={!optional} /> : <input className="tool-input mt-2 font-normal" value={values[name] || ''} maxLength={2048} onChange={e => change(name, e.target.value)} placeholder={placeholder} required={!optional} autoCapitalize="none" autoCorrect="off" spellCheck={false} />}</label>
  const cell = (value: string) => /^https?:\/\/[^\s]+$/.test(value) ? <a className="underline underline-offset-4 hover:text-brand-red break-all" href={value} target="_blank" rel="noopener noreferrer">{value.replace(/^https?:\/\//, '')} ↗</a> : <span className="whitespace-pre-wrap break-words">{value}</span>
  return <div className="mt-8">
    <form ref={form} onSubmit={submit} className="bg-white border border-surface-200 rounded-xl p-5 sm:p-8 shadow-sm">
      <fieldset disabled={busy} className="space-y-5 disabled:opacity-60">
        <legend className="sr-only">{tool.title} inputs</legend>
        {field('website', tool.kind === 'backlink' ? 'Source page containing your backlink' : 'Your website', tool.kind === 'backlink' ? 'https://example.com/resources' : 'https://yourwebsite.com')}
        {(tool.kind === 'backlink' || tool.kind === 'internal') && field('target', tool.kind === 'backlink' ? 'Your target domain' : 'Page you want to link to', tool.kind === 'backlink' ? 'yourwebsite.com' : 'https://yourwebsite.com/your-guide')}
        {tool.kind === 'internal' && field('phrase', 'Target phrase', 'e.g. email marketing', true)}
        {tool.kind === 'gap' && <>{field('competitors', 'Competitor domains · up to two', 'competitor.com\nanother-competitor.com', false, true)}<details className="text-sm"><summary className="cursor-pointer text-surface-600 py-2">Add candidate source pages for wider coverage</summary><div className="mt-3">{field('sources', 'Source page URLs · up to ten', 'https://example.com/software-comparison', true, true)}</div></details></>}
        {tool.kind === 'opportunities' && <div className="grid sm:grid-cols-2 gap-5"><label className="text-sm font-semibold">Business type<select className="tool-input mt-2 font-normal" value={values.industry} onChange={e => change('industry', e.target.value)}>{industries.map(i => <option key={i}>{i}</option>)}</select></label><label className="text-sm font-semibold">Submission budget<select className="tool-input mt-2 font-normal" value={values.budget} onChange={e => change('budget', e.target.value)}><option>Free basic routes only</option><option>Include variable fees</option></select></label></div>}
        <button className="inline-flex w-full sm:w-auto items-center justify-center gap-3 bg-surface-950 text-white rounded-md px-6 py-3.5 text-sm font-semibold hover:bg-surface-800 transition-colors disabled:opacity-50" type="submit">{busy ? <LoaderCircle className="w-4 h-4 animate-spin motion-reduce:animate-none" aria-hidden="true" /> : <ArrowRight className="w-4 h-4" aria-hidden="true" />}{busy ? 'Scanning…' : tool.action}</button>
      </fieldset>
      <p className="text-xs text-surface-500 mt-4">Free scan. No account required. Public URLs are fetched by our server.</p>
      {busy && <div className="mt-5 border-t border-surface-100 pt-4"><div className="flex items-center justify-between gap-3"><p role="status" className="text-sm text-surface-600">{progress.message}</p><button type="button" onClick={() => { controller.current?.abort(); setMonitor(false) }} className="text-sm flex gap-1 items-center underline"><X className="w-4 h-4" />Cancel</button></div><progress className="w-full h-1 mt-3 accent-brand-red" aria-label="Scan progress" max={progress.total} value={progress.done} /><p className="text-xs text-surface-500 mt-2">Keep this tab open. Larger scans can take a few minutes.</p></div>}
      {error && <p role="alert" className="text-sm text-red-800 bg-red-50 rounded-md p-4 mt-5">{error}</p>}
    </form>
    {tool.kind === 'backlink' && <section className="mt-5 text-sm"><div className="flex flex-wrap gap-4 items-center"><label className="flex gap-2 items-center"><input type="checkbox" checked={monitor} disabled={busy || !values.website || !values.target} onChange={e => setMonitor(e.target.checked)} className="accent-brand-red" />Recheck every 5 minutes while open</label><button className="underline text-surface-600" onClick={() => { try { const data = JSON.parse(localStorage.getItem(STORAGE) || '[]'); setSaved(Array.isArray(data) ? data.slice(0, 30) : []); setNotice(Array.isArray(data) && data.length ? 'Saved check history loaded.' : 'No saved checks on this device yet.') } catch { setNotice('Saved history could not be read.') } }}>Show saved history</button></div>{saved.length > 0 && <details className="mt-4"><summary className="cursor-pointer">Saved history ({saved.length})</summary><ul className="divide-y divide-surface-200 mt-2">{saved.map((s, i) => <li key={i} className="py-3 flex flex-wrap justify-between gap-2"><span className="break-all">{s.website} → {s.target}<span className="block text-xs text-surface-500 mt-1">{s.title} · {new Date(s.checked).toLocaleString()}</span></span><button disabled={busy} className="underline" onClick={() => { setValues(v => ({ ...v, website: s.website, target: s.target })); setResult(null); setMonitor(false); setNotice('Saved URLs loaded. Select Check my backlink to fetch them again.') }}>Load check</button></li>)}</ul><button className="underline text-surface-500 mt-3" onClick={() => { try { localStorage.removeItem(STORAGE); setSaved([]); setNotice('History cleared.') } catch { setNotice('Could not clear browser storage.') } }}>Clear saved history</button></details>}</section>}
    {notice && <p role="status" className="text-sm text-surface-600 mt-4">{notice}</p>}
    {result && <section aria-label="Scan results" className="mt-10 animate-fadeIn motion-reduce:animate-none">
      <div className="flex flex-wrap justify-between items-start gap-4 border-b border-surface-300 pb-5"><div><p className="text-xs font-semibold text-brand-red mb-2">Your report</p><h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{result.title}</h2><p className="text-sm text-surface-600 mt-3 max-w-2xl" role="status">{result.summary}</p><p className="text-xs text-surface-400 mt-2">Completed {new Date(result.checked).toLocaleString()}</p></div><div className="flex gap-3"><button onClick={download} className="text-sm font-semibold inline-flex gap-2 items-center border border-surface-300 rounded-md px-3 py-2 hover:bg-white"><Download className="w-4 h-4" />Export CSV</button>{tool.kind === 'backlink' && <button className="text-sm inline-flex items-center gap-1 underline" onClick={() => saveCheck(result)}><Bookmark className="w-4 h-4" />Save check</button>}</div></div>
      {!result.rows.length && <p className="py-8 text-surface-600">No matching findings in this sample. Review the scan coverage below before drawing conclusions.</p>}
      <div className="divide-y divide-surface-200">{result.rows.slice(0, visible).map((row, i) => <article key={i} className="py-6"><div className="flex gap-3 items-start"><span className="text-xs text-surface-400 tabular-nums mt-1">{String(i + 1).padStart(2, '0')}</span><div className="min-w-0 flex-1"><h3 className="text-base font-semibold break-words">{cell(row[0])}</h3><dl className="grid sm:grid-cols-2 gap-x-7 gap-y-4 mt-4">{row.slice(1).map((value, j) => <div key={j} className={value.length > 160 ? 'sm:col-span-2 min-w-0' : 'min-w-0'}><dt className="text-xs text-surface-500 mb-1">{result.columns[j + 1]}</dt><dd className="text-sm leading-relaxed text-surface-800">{cell(value || '—')}</dd></div>)}</dl>{tool.kind === 'internal' && <button className="text-sm underline mt-4" onClick={async () => { try { await navigator.clipboard.writeText(row[4]); setNotice('Link HTML copied.') } catch { setNotice('Clipboard unavailable. Select the HTML snippet or use the CSV export.') } }}>Copy link HTML</button>}</div></div></article>)}</div>
      {visible < result.rows.length && <button className="underline text-sm mt-4" onClick={() => setVisible(v => v + 10)}>Show 10 more results ({result.rows.length - visible} remaining)</button>}
      <details className="border-t border-surface-200 pt-4 mt-5 text-sm" open><summary className="cursor-pointer font-semibold">Scan coverage and limitations</summary><ul className="mt-3 space-y-2 text-surface-600">{result.notes.map((note, i) => <li key={i}>{note}</li>)}</ul></details>
      <div className="mt-8 rounded-xl bg-surface-950 p-6 sm:p-8 text-white"><div className="flex gap-2 text-brand-yellow items-center text-sm"><Check className="w-4 h-4" />Ready to find your next placement?</div><h3 className="text-xl sm:text-2xl font-bold mt-3">Skip the empty prospecting spreadsheet.</h3><p className="text-sm leading-relaxed text-white/70 mt-3 max-w-xl">Get 276 opportunities with submission URLs, recorded costs and practical tips in the Complete Backlink Database Bundle.</p><Link data-conversion={`live_tool_${tool.kind}`} href="/bundle" className="inline-flex items-center gap-5 font-semibold text-sm mt-5 bg-brand-yellow text-surface-950 px-5 py-3 rounded-md">Get the bundle · £11.49 <ArrowRight className="w-4 h-4" /></Link></div>
    </section>}
  </div>
}
