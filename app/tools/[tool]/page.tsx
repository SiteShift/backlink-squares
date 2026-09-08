import Link from 'next/link'
import { notFound } from 'next/navigation'
import { freeTools } from '@/lib/tools/catalog'
import { ToolWorkspace } from '@/components/tools/ToolWorkspace'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ContentCTA } from '@/components/content/ContentCTA'
import { buildMetadata } from '@/lib/seo'
import { liveTools } from '@/lib/scanner/catalog'
import { LiveToolPage } from '@/components/tools/LiveToolPage'

export const dynamicParams = false
export function generateStaticParams() { return [...liveTools, ...freeTools].map(t => ({ tool: t.slug })) }
export async function generateMetadata({ params }: { params: Promise<{ tool: string }> }) {
  const { tool } = await params; const entry = [...liveTools, ...freeTools].find(t => t.slug === tool)
  return entry ? buildMetadata({ title: entry.title, description: entry.description, canonicalUrl: `https://backlinkgrid.com/tools/${entry.slug}` }) : {}
}
export default async function ToolPage({ params }: { params: Promise<{ tool: string }> }) {
  const { tool } = await params
  const live = liveTools.find(t => t.slug === tool); if (live) return <LiveToolPage tool={live} />
  const entry = freeTools.find(t => t.slug === tool); if (!entry) notFound()
  const schema = { '@context': 'https://schema.org', '@type': 'WebApplication', name: entry.title, description: entry.description, url: `https://backlinkgrid.com/tools/${entry.slug}`, applicationCategory: 'BusinessApplication', operatingSystem: 'Any modern web browser', isAccessibleForFree: true, offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' }, publisher: { '@type': 'Organization', name: 'BacklinkGrid', url: 'https://backlinkgrid.com' } }
  return <><Header /><main className="pt-14 sm:pt-16 lg:pt-20 min-h-screen bg-surface-50"><div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
    <Link href="/tools" className="text-sm text-surface-500 hover:text-brand-red">← All free tools</Link>
    <h1 className="text-3xl sm:text-5xl font-display font-bold tracking-tight mt-6 max-w-3xl">{entry.title}</h1>
    <p className="text-lg text-surface-600 leading-relaxed mt-4 mb-8 max-w-3xl">{entry.description}</p>
    <ToolWorkspace key={entry.slug} tool={entry} />
    <section className="mt-12"><h2 className="font-bold text-2xl">How to use this tool</h2><ol className="list-decimal pl-5 space-y-3 mt-5 text-surface-700">{entry.steps.map(step => <li key={step}>{step}</li>)}</ol>
    <h2 className="font-bold text-2xl mt-10">Understand your results</h2><p className="mt-4 leading-relaxed text-surface-700">{entry.interpretation}</p>
    <h2 className="font-bold text-2xl mt-10">What this tool can and cannot tell you</h2><p className="mt-4 leading-relaxed text-surface-700">{entry.limitation}</p>
    <h2 className="font-bold text-2xl mt-10">Is my data uploaded?</h2><p className="mt-4 leading-relaxed text-surface-700">The tool processes your inputs in your browser. We do not upload your files or send the text to an AI service. Results disappear when you reset or leave the page, so download anything you want to keep. Search links open Google only when you choose to follow them.</p>
    <p className="mt-6"><Link href={entry.related} className="text-brand-red underline">{entry.relatedLabel} →</Link></p></section>
    <ContentCTA />
    <nav aria-label="Related free tools" className="mt-10"><h2 className="font-bold text-xl mb-4">Keep working with free tools</h2><div className="grid sm:grid-cols-2 gap-3">{freeTools.filter(t => t.slug !== tool).slice(0, 4).map(t => <Link className="text-sm text-surface-700 hover:text-brand-red underline" key={t.slug} href={`/tools/${t.slug}`}>{t.title}</Link>)}</div></nav>
    <p className="text-xs text-surface-500 mt-10">Built by BacklinkGrid Editorial Team · Updated 8 September 2026</p>
  </div></main><Footer /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} /></>
}
