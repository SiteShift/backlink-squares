import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ContentCTA } from '@/components/content/ContentCTA'
import { freeTools } from '@/lib/tools/catalog'
import { buildMetadata } from '@/lib/seo'
export const metadata = buildMetadata({ title: 'Free Link Building Tools: Analyse, Plan & Write', description: 'Use free outreach templates, link velocity tracking, backlink gap analysis, GSC export analysis and more. Useful browser tools with no paid APIs or signup.', canonicalUrl: 'https://backlinkgrid.com/tools' })
export default function ToolsPage() {
  return <><Header /><main className="pt-14 sm:pt-16 lg:pt-20 bg-surface-50 min-h-screen"><div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
    <p className="text-sm font-semibold text-brand-red">The BacklinkGrid toolkit</p>
    <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mt-4 max-w-3xl">Less spreadsheet work.<br />More useful next steps.</h1>
    <p className="text-lg text-surface-600 mt-6 max-w-2xl">Free link building tools for prospecting, outreach and analysis. Your data stays in your browser. No accounts, paid APIs or made-up authority scores.</p>
    <div className="grid md:grid-cols-2 gap-x-10 mt-12">{freeTools.map((tool, i) => <Link href={`/tools/${tool.slug}`} key={tool.slug} className="group border-t border-surface-300 py-7 flex gap-5"><span className="text-xs text-surface-400 mt-2 tabular-nums">{String(i + 1).padStart(2, '0')}</span><div><h2 className="font-bold text-xl group-hover:text-brand-red transition-colors">{tool.title} ↗</h2><p className="text-sm text-surface-600 mt-3 leading-relaxed">{tool.description}</p><span className="inline-block mt-4 text-sm font-semibold text-brand-red">Open tool →</span></div></Link>)}</div>
    <section className="border-t border-surface-300 py-8"><h2 className="font-bold text-2xl">More planning resources</h2><div className="flex flex-wrap gap-5 mt-4 text-sm underline"><Link href="/tools/roi-calculator">Link building ROI calculator</Link><Link href="/tools/backlink-analyzer">Backlink audit checklist</Link><Link href="/tools/free-backlink-checker">Find third-party backlink checkers</Link><Link href="/templates">Downloadable templates</Link></div></section>
    <ContentCTA />
  </div></main><Footer /></>
}
