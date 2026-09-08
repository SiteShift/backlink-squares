import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ContentCTA } from '@/components/content/ContentCTA'
import { buildMetadata } from '@/lib/seo'
export const metadata = buildMetadata({ title: 'Free Link Building Templates: Track, Audit & Outreach', description: 'Download free CSV templates for backlink prospecting, audit reviews and outreach tracking. Open in Excel or Google Sheets and follow practical setup guidance.', canonicalUrl: 'https://backlinkgrid.com/templates', type: 'website' })
export default function Templates() {
 return <><Header/><main className="container-wide pt-24 pb-16 max-w-5xl"><nav className="text-sm mb-6"><Link href="/resources">Resources</Link> / Templates</nav><h1 className="font-display text-4xl font-black">Free link building templates</h1><p className="mt-6 text-lg">These link building templates turn research into a trackable workflow. Download a CSV, import it into Excel or Google Sheets, and add one row per prospect or link. They contain column headings and illustrative examples, not a list of approved publishers.</p>
 <div className="grid md:grid-cols-3 gap-5 mt-8">{[
 ['prospect-tracker','Prospect tracker','Record audience fit, submission rules, source URL, cost and your next action. Prioritize relevance before domain metrics.'],
 ['backlink-audit','Backlink audit sheet','Record source and target pages, anchor text, link attributes and review notes. Keep suspicious links as review items rather than automatic disavow decisions.'],
 ['outreach-tracker','Outreach tracker','Track a useful pitch angle, contact source, first message, follow-up and outcome. Respect opt-outs and avoid repeated generic messages.'],
 ].map(([slug,title,body])=><section key={slug} className="border-2 p-6"><h2 className="font-bold text-xl">{title}</h2><p className="my-4">{body}</p><a className="text-brand-red underline font-bold" href={`/templates/${slug}.csv`} download>Download CSV</a></section>)}</div>
 <h2 className="font-bold text-2xl mt-10">How to use the templates</h2><ol className="list-decimal pl-6 space-y-3 mt-4"><li>Import the CSV using your spreadsheet application’s import function. Keep URLs as text.</li><li>Replace the illustrative example row with a real prospect or link.</li><li>Assign an owner and next-review date so research has a clear next action.</li><li>Record actual published URLs and referral results separately from submissions.</li></ol>
 <h2 className="font-bold text-2xl mt-10">What to read next</h2><ul className="list-disc pl-6 space-y-3 mt-4"><li><Link href="/resources/prospecting-spreadsheet">Prospecting spreadsheet guide</Link></li><li><Link href="/resources/outreach-email-templates">Outreach email examples</Link></li><li><Link href="/backlink-audit">Complete backlink audit guide</Link></li><li><Link href="/backlink-quality">How to evaluate backlink quality</Link></li></ul><ContentCTA/></main><Footer/></>
}
