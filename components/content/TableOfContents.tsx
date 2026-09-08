'use client'
import { useEffect, useState } from 'react'
import { List } from 'lucide-react'
export function TableOfContents() {
  const [headings, setHeadings] = useState<{ id: string; text: string }[]>([])
  useEffect(() => {
    let signature = ''
    const update = () => {
      const article = document.querySelector('article')
      const items = Array.from(article?.querySelectorAll('h2[id]') || []).map(el => ({ id: el.id, text: el.textContent || '' }))
      const next = JSON.stringify(items)
      if (next !== signature) { signature = next; setHeadings(items) }
    }
    update()
    const observer = new MutationObserver(update)
    observer.observe(document.querySelector('main') || document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [])
  if (!headings.length) return null
  return <details className="not-prose mb-8 rounded-lg border border-surface-200 bg-white group">
    <summary className="cursor-pointer p-4 font-semibold text-sm flex items-center gap-3"><List className="w-4 h-4 text-brand-red" />On this page<span className="ml-auto text-xs font-normal text-surface-500">{headings.length} sections · <span className="group-open:hidden">Expand</span><span className="hidden group-open:inline">Collapse</span></span></summary>
    <nav aria-label="On this page" className="max-h-64 overflow-y-auto border-t border-surface-100 p-4">
      <ol className="grid sm:grid-cols-2 gap-x-6 gap-y-3">{headings.map((h, i) => <li key={h.id}><a className="text-sm text-surface-600 hover:text-brand-red flex gap-2" href={`#${h.id}`}><span className="text-surface-400 tabular-nums">{String(i + 1).padStart(2, '0')}</span>{h.text}</a></li>)}</ol>
    </nav>
  </details>
}
