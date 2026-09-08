import Link from 'next/link'
import sitemap from '@/app/sitemap'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { buildMetadata } from '@/lib/seo'
export const metadata = buildMetadata({title:'BacklinkGrid Sitemap: All Guides, Tools & Resources',description:'Browse every public BacklinkGrid page, including backlink guides, tool comparisons, glossary definitions, templates and the Complete Backlink Database Bundle.',canonicalUrl:'https://backlinkgrid.com/sitemap-page',type:'website'})
export default function SitemapPage(){
 const groups = new Map<string,string[]>()
 for(const page of sitemap()){
   const pathname=new URL(page.url).pathname
   const parts=pathname.split('/').filter(Boolean)
   const group=parts.length>1?parts[0]:'Main pages'
   groups.set(group,[...(groups.get(group)||[]),pathname])
 }
 return <><Header/><main className="container-wide pt-24 pb-16"><h1 className="font-display text-4xl font-black">All BacklinkGrid pages</h1><p className="mt-5 text-lg">Explore the complete library by topic. All links below lead to public canonical pages.</p><p className="mt-3"><a href="/sitemap.xml" className="underline">XML sitemap</a> · <a href="/llms.txt" className="underline">AI reading guide</a></p>{[...groups].map(([group,paths])=><section className="mt-10" key={group}><h2 className="font-bold text-2xl capitalize mb-4">{group.replaceAll('-',' ')}</h2><ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">{paths.map(p=><li key={p}><Link href={p} className="text-brand-red hover:underline break-words">{p==='/'?'Home':p.split('/').pop()?.replaceAll('-',' ')}</Link></li>)}</ul></section>)}</main><Footer/></>
}
