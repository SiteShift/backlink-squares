import Link from 'next/link'

export function ContentCTA({ variant = 'default' }: { variant?: 'default' | 'compact' }) {
  return (
    <aside className={`mt-10 border-2 border-surface-950 bg-surface-950 text-white ${variant === 'compact' ? 'p-6' : 'p-6 sm:p-10'}`} aria-label="Backlink database bundle">
      <p className="text-brand-yellow text-xs font-bold uppercase tracking-wider">Put your research to work</p>
      <h2 className="text-white font-display text-2xl sm:text-3xl font-black mt-3">Your next link prospect list starts here.</h2>
      <p className="text-white/80 mt-4 max-w-2xl">The Complete Backlink Database Bundle brings 276 opportunities into one CSV, with categories, recorded DR, costs, submission URLs and practical tips. Filter for your business instead of starting with an empty spreadsheet.</p>
      <div className="flex flex-wrap items-center gap-4 mt-6">
        <Link href="/bundle" data-conversion="bundle_content" className="inline-flex bg-brand-yellow text-surface-950 px-5 py-3 font-bold">Explore the bundle · £11.49 →</Link>
        <Link href="/bundle#preview" className="text-white underline underline-offset-4">See real sample rows</Link>
      </div>
      <p className="mt-4 text-sm text-white/60">One-time payment. CSV download. You choose and submit to suitable sites; placement and rankings are not guaranteed.</p>
      <Link href="/#grid" className="inline-block mt-4 text-sm text-white/80 underline">Just want a directory placement? Choose a grid square from $1.</Link>
    </aside>
  )
}
