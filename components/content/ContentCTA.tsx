import Link from 'next/link'
import { ArrowUpRight, FileSpreadsheet } from 'lucide-react'

export function ContentCTA({ variant = 'default' }: { variant?: 'default' | 'compact' }) {
  return (
    <aside className={`not-prose mt-10 overflow-hidden rounded-xl bg-surface-950 text-white ${variant === 'compact' ? 'p-6' : 'p-6 sm:p-8'}`} aria-label="Complete Backlink Database Bundle" data-inline-bundle-offer>
      <div className="grid grid-cols-[minmax(0,1fr)_72px] sm:grid-cols-[minmax(0,1fr)_100px] gap-x-5 sm:gap-x-8 gap-y-4">
        <h2 className="col-span-2 sm:col-span-1 text-white text-2xl sm:text-3xl font-bold tracking-tight leading-tight">Complete Backlink<br className="hidden sm:block" /> Database Bundle</h2>
        <p className="col-start-1 row-start-2 text-white/70 text-sm sm:text-base leading-relaxed max-w-md">Submission links, recorded costs and practical tips. Ready to shortlist in one CSV.</p>
        <div className="col-start-2 row-start-2 sm:row-start-1 sm:row-span-2 text-brand-yellow text-right pt-1" aria-label="276 backlink opportunities in a CSV">
          <FileSpreadsheet className="w-7 h-7 ml-auto mb-3 opacity-80" strokeWidth={1.5} aria-hidden="true" />
          <span className="block text-4xl sm:text-5xl font-bold tracking-tighter leading-none">276</span>
          <span className="block mt-2 text-[10px] sm:text-xs text-white/60">opportunities</span>
        </div>
      </div>
      <div className="mt-6 pt-6 border-t border-white/15 flex flex-col min-[420px]:flex-row min-[420px]:items-center gap-5 min-[420px]:justify-between">
        <p className="m-0"><span className="text-2xl font-semibold tracking-tight">£11.49</span><span className="text-white/55 text-sm ml-3">One-time payment</span></p>
        <Link href="/bundle" data-conversion="bundle_content" className="group inline-flex items-center justify-center gap-5 rounded-md bg-brand-yellow text-surface-950 px-5 py-3 font-bold text-sm transition-colors hover:bg-yellow-300 focus-visible:outline-offset-4">Get the bundle <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none" aria-hidden="true" /></Link>
      </div>
    </aside>
  )
}
