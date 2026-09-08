import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { LiveWorkspace } from './LiveWorkspace'
import { liveTools } from '@/lib/scanner/catalog'
import type { LiveTool } from '@/lib/scanner/types'
export function LiveToolPage({ tool }: { tool: LiveTool }) {
  const schema = { '@context': 'https://schema.org', '@type': 'WebApplication', name: tool.title, description: tool.description, url: `https://backlinkgrid.com/tools/${tool.slug}`, applicationCategory: 'BusinessApplication', operatingSystem: 'Web browser', isAccessibleForFree: true, offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' }, publisher: { '@type': 'Organization', name: 'BacklinkGrid', url: 'https://backlinkgrid.com' } }
  return <><Header /><main className="pt-14 sm:pt-16 lg:pt-20 min-h-screen bg-surface-50"><div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
    <Link href="/tools" className="text-sm text-surface-500 hover:text-brand-red">← Free SEO tools</Link>
    <p className="text-xs font-semibold text-brand-red mt-8">BacklinkGrid · Website tools</p>
    <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mt-3 leading-tight">{tool.title}</h1>
    <p className="text-base sm:text-lg text-surface-600 mt-5 leading-relaxed max-w-2xl">{tool.description}</p>
    <LiveWorkspace key={tool.slug} tool={tool} />
    <section className="mt-14 border-t border-surface-200 pt-8"><h2 className="text-2xl font-bold">How it works</h2><ol className="mt-5 space-y-4 list-decimal pl-5 text-surface-700 leading-relaxed">{tool.steps.map(s => <li key={s}>{s}</li>)}</ol>
    <h2 className="text-2xl font-bold mt-10">What the results cover</h2><p className="mt-4 text-surface-700 leading-relaxed">{tool.scope}</p>
    <h2 className="text-2xl font-bold mt-10">Your data and scan limits</h2><p className="mt-4 text-surface-700 leading-relaxed">URLs are sent to our server to fetch public pages. We do not request website passwords or paid SEO accounts. Scans use raw responses without executing website scripts. Individual responses are capped at 1 MB, and robots restrictions, timeouts and bot protection can limit coverage. Page responses may be cached in memory for five minutes. Standard hosting request logs may contain request metadata. Do not submit private URLs or URLs containing access tokens.</p>
    <p className="mt-4 text-surface-700 leading-relaxed">Reports stay in this page until you leave or export them. Saved backlink history uses your browser’s local storage and can be cleared in the tool. No scan inputs are sent to an AI service.</p>
    {tool.kind === 'gap' && <p className="mt-4 text-sm text-surface-600">Discovery uses the <a href="https://www.mediawiki.org/wiki/API:Exturlusage" className="underline">MediaWiki external-link API</a> and <a href="https://hn.algolia.com/api" className="underline">Hacker News search by Algolia</a>. Source-page links provide attribution and let you inspect the original evidence. Hacker News story URLs are verified through its official public API; that API does not provide HTML link attributes or discussion-page gaps. These providers do not endorse this tool.</p>}
    <p className="mt-6"><Link className="underline text-brand-red" href={tool.related}>{tool.relatedLabel} →</Link></p></section>
    <nav aria-label="Related website tools" className="mt-12 border-t border-surface-200 pt-7"><h2 className="text-xl font-bold">Keep improving your website</h2><div className="grid sm:grid-cols-2 gap-4 mt-5">{liveTools.filter(t => t.slug !== tool.slug).map(t => <Link className="text-sm text-surface-600 hover:text-brand-red underline underline-offset-4" key={t.slug} href={`/tools/${t.slug}`}>{t.title}</Link>)}</div></nav>
    <p className="text-xs text-surface-500 mt-10">BacklinkGrid Editorial Team · Updated 9 September 2026</p>
  </div></main><Footer /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} /></>
}
