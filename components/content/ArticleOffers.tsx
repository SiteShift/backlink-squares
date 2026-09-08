import Link from 'next/link'
import { ArrowUpRight, Database, Link2 } from 'lucide-react'

export function ArticleOffers() {
  return <aside className="article-offers hidden lg:block" aria-label="Link building resources">
    <div className="sticky top-36 space-y-4">
      <div className="rounded-xl bg-surface-950 p-6 text-white">
        <Database className="h-6 w-6 text-brand-yellow mb-6" aria-hidden="true" />
        <h2 className="text-xl font-bold leading-tight mt-2 text-white">Complete Backlink Database Bundle</h2>
        <p className="text-sm leading-relaxed text-white/75 mt-3">276 opportunities. Submission links, costs and practical tips in one CSV.</p>
        <Link href="/bundle" data-conversion="bundle_sidebar" className="flex justify-between items-center bg-brand-yellow text-surface-950 font-bold rounded-md px-4 py-3 mt-5">Get the bundle · £11.49 <ArrowUpRight className="w-4 h-4" /></Link>
      </div>
      <Link href="/#grid" data-conversion="grid_sidebar" className="block rounded-xl border border-surface-200 bg-white p-5 hover:border-brand-red transition-colors">
        <span className="flex items-center justify-between"><Link2 className="w-5 h-5 text-brand-red" /><ArrowUpRight className="w-4 h-4 text-surface-500" /></span>
        <span className="block font-bold text-lg mt-3">Get a backlink for $1</span>
        <span className="block text-sm text-surface-600 mt-1">Claim a sponsored directory square.</span>
      </Link>
    </div>
  </aside>
}
