import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, BookText, ChevronRight, Lightbulb, Code, Link as LinkIcon } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ContentCTA } from '@/components/content/ContentCTA'

// Glossary definitions (full content for each term)
const glossaryDefinitions: Record<string, {
  term: string
  definition: string
  importance: string
  example: string
  relatedTerms: string[]
}> = {
  'anchor-text': {
    term: 'Anchor Text',
    definition: 'Anchor text is the visible, clickable text in a hyperlink. It\'s usually displayed in a different color (typically blue) and underlined to distinguish it from regular text. When users click on anchor text, they\'re taken to the linked page.',
    importance: 'Anchor text is important for SEO because it provides context to both users and search engines about the content of the linked page. Google uses anchor text as a ranking signal to understand what the destination page is about. However, over-optimized anchor text (using exact-match keywords too frequently) can trigger spam filters.',
    example: 'In the sentence "Learn more about <a href="/guides">link building strategies</a>", the anchor text is "link building strategies".',
    relatedTerms: ['backlink', 'link-equity', 'dofollow', 'internal-link'],
  },
  'backlink': {
    term: 'Backlink',
    definition: 'A backlink (also known as an inbound link or incoming link) is a link from one website to another. When Website A links to Website B, Website B has received a backlink from Website A. Backlinks are one of the foundational elements of SEO.',
    importance: 'Backlinks are one of Google\'s most important ranking factors. They act as "votes of confidence" from other websites. When authoritative sites link to your content, search engines interpret this as a signal that your content is valuable and trustworthy. The quantity, quality, and relevance of your backlinks significantly impact your search rankings.',
    example: 'If The New York Times publishes an article and links to your website as a source, you\'ve received a backlink from nytimes.com.',
    relatedTerms: ['referring-domain', 'link-building', 'domain-authority', 'dofollow'],
  },
  'dofollow': {
    term: 'Dofollow',
    definition: 'A dofollow link is a standard hyperlink that passes SEO value (link equity) from the source page to the destination page. By default, all links are dofollow unless specified otherwise. These links tell search engine crawlers to follow the link and count it as a ranking signal.',
    importance: 'Dofollow links are the type of backlinks that directly benefit your SEO. They pass PageRank and help the linked page rank higher in search results. When building backlinks for SEO purposes, dofollow links are typically the primary goal.',
    example: 'A standard HTML link like <a href="https://example.com">Example</a> is a dofollow link by default. It will pass SEO value to example.com.',
    relatedTerms: ['nofollow', 'link-equity', 'pagerank', 'backlink'],
  },
  'nofollow': {
    term: 'Nofollow',
    definition: 'A nofollow link includes a rel="nofollow" attribute in its HTML code, which instructs search engines not to pass SEO value through the link. Google introduced the nofollow attribute in 2005 as a way to combat comment spam.',
    importance: 'While nofollow links don\'t directly pass PageRank, they\'re still valuable for driving traffic and building brand awareness. Since 2020, Google treats nofollow as a "hint" rather than a directive, meaning some nofollow links may still influence rankings. A natural backlink profile includes a mix of dofollow and nofollow links.',
    example: '<a href="https://example.com" rel="nofollow">Example</a> - This link tells search engines not to pass ranking signals to example.com.',
    relatedTerms: ['dofollow', 'ugc-link', 'sponsored-link', 'link-profile'],
  },
  'domain-authority': {
    term: 'Domain Authority',
    definition: 'Domain Authority (DA) is a search engine ranking score developed by Moz that predicts how likely a website is to rank in search results. DA scores range from 1 to 100, with higher scores indicating greater ranking potential. The score is calculated based on multiple factors including linking root domains and total number of links.',
    importance: 'While DA is not a Google ranking factor, it\'s a useful metric for comparing the relative strength of different websites. Higher DA sites are generally more established and have stronger backlink profiles. However, DA should be one of many factors considered when evaluating link opportunities - relevance and context are equally important.',
    example: 'Wikipedia.org has a DA of 100, while a brand new blog might start with a DA of 1-10. A DA of 40-50 is considered good for most websites.',
    relatedTerms: ['domain-rating', 'page-authority', 'link-profile', 'trust-flow'],
  },
  'link-building': {
    term: 'Link Building',
    definition: 'Link building is the process of acquiring hyperlinks from other websites to your own. It\'s a key component of search engine optimization (SEO) and involves various strategies and tactics to earn, create, or request links from other websites.',
    importance: 'Link building remains one of the most important and challenging aspects of SEO. High-quality backlinks signal to search engines that your content is valuable and authoritative. Effective link building can dramatically improve your search rankings and organic traffic.',
    example: 'Common link building strategies include guest posting (writing articles for other sites), creating linkable content (original research, tools, guides), broken link building, and digital PR.',
    relatedTerms: ['backlink', 'outreach', 'guest-post', 'linkable-asset'],
  },
  'link-equity': {
    term: 'Link Equity',
    definition: 'Link equity (also called "link juice") refers to the value or authority passed from one page to another through hyperlinks. When a page links to another page, it passes a portion of its authority to the destination page.',
    importance: 'Understanding link equity helps you make strategic decisions about internal linking and external link building. Pages with more link equity tend to rank higher. Link equity can be diluted if a page has too many outbound links, and it only flows through dofollow links.',
    example: 'If a high-authority page like a popular news article links to your site, it passes significant link equity. If that same page links to 100 different sites, each receives less equity than if it only linked to 10.',
    relatedTerms: ['pagerank', 'dofollow', 'internal-link', 'link-profile'],
  },
  'referring-domain': {
    term: 'Referring Domain',
    definition: 'A referring domain is a unique website that links to your site. If a single website links to you multiple times from different pages, it still counts as one referring domain. This metric is often more meaningful than total backlink count.',
    importance: 'The number of referring domains is generally a stronger ranking signal than total backlinks. Having links from 100 different domains is typically more valuable than having 100 links from a single domain. Search engines see domain diversity as a sign of genuine authority.',
    example: 'If TechCrunch links to your site from 3 different articles, that\'s 3 backlinks but only 1 referring domain. If TechCrunch, Forbes, and CNN each link once, that\'s 3 referring domains.',
    relatedTerms: ['backlink', 'link-profile', 'domain-authority', 'link-building'],
  },
  'pagerank': {
    term: 'PageRank',
    definition: 'PageRank is Google\'s original algorithm for measuring the importance of web pages based on their link relationships. Named after Google co-founder Larry Page, it treats links as votes - pages with more quality links pointing to them are considered more important.',
    importance: 'While Google no longer publicly updates PageRank scores, the underlying concept remains central to how Google ranks pages. The core idea that links are votes of confidence continues to be a major ranking factor.',
    example: 'A page linked by many other important pages earns a higher PageRank. A link from a high-PageRank page passes more value than a link from a low-PageRank page.',
    relatedTerms: ['link-equity', 'backlink', 'domain-authority', 'algorithm'],
  },
  'toxic-backlink': {
    term: 'Toxic Backlink',
    definition: 'A toxic backlink is a low-quality or spammy link that could potentially harm your search rankings. These links typically come from link farms, PBNs, irrelevant foreign sites, or websites with malware or adult content.',
    importance: 'While Google claims to ignore most low-quality links, a large number of toxic backlinks could trigger a manual penalty or algorithmic filtering. Regular backlink audits help identify potentially harmful links that may need to be disavowed.',
    example: 'Links from gambling sites (when you\'re not in that niche), links from hacked sites, links from domains with gibberish names, or links from pages with thousands of outbound links are typically considered toxic.',
    relatedTerms: ['disavow', 'spam-score', 'link-profile', 'google-penalty'],
  },
}

// All terms for navigation
const allTerms = Object.keys(glossaryDefinitions).sort()

type Props = {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const term = glossaryDefinitions[params.slug]

  if (!term) {
    return { title: 'Term Not Found' }
  }

  return {
    title: `${term.term} - SEO Glossary Definition`,
    description: term.definition.slice(0, 160),
    openGraph: {
      title: `What is ${term.term}? | SEO Glossary`,
      description: term.definition.slice(0, 160),
    },
  }
}

export function generateStaticParams() {
  return Object.keys(glossaryDefinitions).map((slug) => ({ slug }))
}

export default function GlossaryTermPage({ params }: Props) {
  const term = glossaryDefinitions[params.slug]

  if (!term) {
    notFound()
  }

  // Find prev/next terms
  const currentIndex = allTerms.indexOf(params.slug)
  const prevTerm = currentIndex > 0 ? allTerms[currentIndex - 1] : null
  const nextTerm = currentIndex < allTerms.length - 1 ? allTerms[currentIndex + 1] : null

  return (
    <>
      <Header />

      <main className="min-h-screen bg-bauhaus-cream">
        {/* Header */}
        <header className="py-16 lg:py-24 bg-white border-b-3 border-dark">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm mb-8">
              <Link href="/" className="text-dark/50 hover:text-dark transition-colors">
                Home
              </Link>
              <ChevronRight className="w-4 h-4 text-dark/30" />
              <Link href="/glossary" className="text-dark/50 hover:text-dark transition-colors">
                Glossary
              </Link>
              <ChevronRight className="w-4 h-4 text-dark/30" />
              <span className="text-dark font-medium">{term.term}</span>
            </nav>

            <div className="flex items-center gap-3 mb-6">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-bauhaus-blue text-white text-xs font-bold uppercase tracking-wider border-2 border-dark">
                <BookText className="w-3.5 h-3.5" />
                SEO Term
              </span>
            </div>

            <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-dark leading-tight">
              {term.term}
            </h1>
          </div>
        </header>

        {/* Content */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="bg-white border-3 border-dark p-8 lg:p-12" style={{ boxShadow: '6px 6px 0px 0px #0A0A0A' }}>
            {/* Definition */}
            <section className="mb-10">
              <h2 className="font-display font-bold text-xl text-dark mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-bauhaus-red flex items-center justify-center border-2 border-dark">
                  <BookText className="w-4 h-4 text-white" />
                </span>
                Definition
              </h2>
              <p className="text-lg text-dark/70 leading-relaxed">
                {term.definition}
              </p>
            </section>

            {/* Why It Matters */}
            <section className="mb-10 bg-bauhaus-yellow/20 border-3 border-dark p-6 lg:p-8">
              <h2 className="font-display font-bold text-xl text-dark mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-bauhaus-yellow flex items-center justify-center border-2 border-dark">
                  <Lightbulb className="w-4 h-4 text-dark" />
                </span>
                Why It Matters
              </h2>
              <p className="text-dark/70 leading-relaxed">{term.importance}</p>
            </section>

            {/* Example */}
            <section className="mb-10">
              <h2 className="font-display font-bold text-xl text-dark mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-bauhaus-blue flex items-center justify-center border-2 border-dark">
                  <Code className="w-4 h-4 text-white" />
                </span>
                Example
              </h2>
              <div className="bg-dark text-white p-6 font-mono text-sm leading-relaxed border-l-4 border-bauhaus-red">
                {term.example}
              </div>
            </section>

            {/* Related Terms */}
            {term.relatedTerms.length > 0 && (
              <section className="mb-10">
                <h2 className="font-display font-bold text-xl text-dark mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-bauhaus-red flex items-center justify-center border-2 border-dark">
                    <LinkIcon className="w-4 h-4 text-white" />
                  </span>
                  Related Terms
                </h2>
                <div className="flex flex-wrap gap-3">
                  {term.relatedTerms.map((slug) => {
                    const relatedTerm = glossaryDefinitions[slug]
                    if (!relatedTerm) return null
                    return (
                      <Link
                        key={slug}
                        href={`/glossary/${slug}`}
                        className="px-4 py-2 bg-bauhaus-cream hover:bg-bauhaus-yellow text-dark text-sm font-bold border-2 border-dark transition-colors"
                      >
                        {relatedTerm.term}
                      </Link>
                    )
                  })}
                </div>
              </section>
            )}

            {/* Navigation */}
            <nav className="flex items-center justify-between pt-8 border-t-3 border-dark">
              {prevTerm ? (
                <Link
                  href={`/glossary/${prevTerm}`}
                  className="group flex items-center gap-2 text-dark/60 hover:text-bauhaus-red transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  <span className="text-sm font-medium">
                    {glossaryDefinitions[prevTerm]?.term}
                  </span>
                </Link>
              ) : (
                <div />
              )}
              {nextTerm && (
                <Link
                  href={`/glossary/${nextTerm}`}
                  className="group flex items-center gap-2 text-dark/60 hover:text-bauhaus-red transition-colors"
                >
                  <span className="text-sm font-medium">
                    {glossaryDefinitions[nextTerm]?.term}
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
            </nav>
          </div>

          {/* CTA */}
          <ContentCTA />
        </article>
      </main>

      <Footer />
    </>
  )
}
