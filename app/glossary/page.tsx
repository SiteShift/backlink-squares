import { Metadata } from 'next'
import Link from 'next/link'
import { Search, BookText } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'SEO Glossary - Link Building Terms Explained',
  description:
    'Essential SEO and link building glossary. Learn the meaning of important terms from anchor text to toxic backlinks.',
  openGraph: {
    title: 'SEO Glossary | SEO Backlinks Grid',
    description:
      'Essential glossary of SEO and link building terms explained simply.',
  },
}

// Glossary terms - only terms with full definitions
const glossaryTerms = [
  { slug: 'anchor-text', term: 'Anchor Text', preview: 'The clickable text in a hyperlink that users see and click on.' },
  { slug: 'backlink', term: 'Backlink', preview: 'A link from one website to another, also called an inbound link.' },
  { slug: 'dofollow', term: 'Dofollow', preview: 'A standard link that passes SEO value to the linked page.' },
  { slug: 'domain-authority', term: 'Domain Authority', preview: 'Moz\'s metric predicting how well a site will rank in search.' },
  { slug: 'link-building', term: 'Link Building', preview: 'The process of acquiring backlinks from other websites to improve SEO.' },
  { slug: 'link-equity', term: 'Link Equity', preview: 'The value and authority passed from one page to another through links.' },
  { slug: 'nofollow', term: 'Nofollow', preview: 'A link attribute telling search engines not to pass ranking signals.' },
  { slug: 'pagerank', term: 'PageRank', preview: 'Google\'s original algorithm for measuring page importance via links.' },
  { slug: 'referring-domain', term: 'Referring Domain', preview: 'A unique domain that contains at least one link to your website.' },
  { slug: 'toxic-backlink', term: 'Toxic Backlink', preview: 'A low-quality or spammy link that may harm your search rankings.' },
]

// Group terms by first letter
const groupedTerms = glossaryTerms.reduce((acc, term) => {
  const letter = term.term[0].toUpperCase()
  if (!acc[letter]) acc[letter] = []
  acc[letter].push(term)
  return acc
}, {} as Record<string, typeof glossaryTerms>)

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export default function GlossaryPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-bauhaus-cream">
        {/* Hero */}
        <section className="py-16 lg:py-24 bg-white border-b-3 border-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-bauhaus-blue border-3 border-dark mb-6">
                <BookText className="w-4 h-4 text-white" />
                <span className="text-sm font-bold uppercase tracking-wider text-white">
                  {glossaryTerms.length}+ Terms
                </span>
              </div>
              <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-dark leading-tight">
                SEO & Link Building Glossary
              </h1>
              <p className="mt-4 text-xl text-dark/60">
                The complete dictionary of SEO terminology. From anchor text to
                zero-click searches, every term explained simply.
              </p>
            </div>
          </div>
        </section>

        {/* Alphabet Navigation */}
        <nav className="sticky top-16 lg:top-20 z-30 bg-white border-b-3 border-dark py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-1">
              {alphabet.map((letter) => {
                const hasTerms = groupedTerms[letter]?.length > 0
                return (
                  <a
                    key={letter}
                    href={hasTerms ? `#${letter}` : undefined}
                    className={`w-8 h-8 flex items-center justify-center font-bold text-sm transition-colors border-2 ${
                      hasTerms
                        ? 'border-dark text-dark hover:bg-bauhaus-yellow'
                        : 'border-transparent text-dark/30 cursor-default'
                    }`}
                  >
                    {letter}
                  </a>
                )
              })}
            </div>
          </div>
        </nav>

        {/* Terms List */}
        <section className="py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {Object.entries(groupedTerms)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([letter, terms]) => (
                <div key={letter} id={letter} className="mb-12 scroll-mt-32">
                  <h2 className="font-black text-4xl text-bauhaus-red mb-6">
                    {letter}
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {terms.map((term) => (
                      <Link
                        key={term.slug}
                        href={`/glossary/${term.slug}`}
                        className="group block bg-white border-3 border-dark p-5 hover:shadow-bauhaus hover:border-bauhaus-red transition-all"
                      >
                        <h3 className="font-display font-bold text-dark group-hover:text-bauhaus-red mb-1">
                          {term.term}
                        </h3>
                        <p className="text-sm text-dark/60 line-clamp-2">
                          {term.preview}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-dark">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white mb-4">
              Put Your Knowledge into Practice
            </h2>
            <p className="text-white/60 mb-6">
              Now that you understand the terminology, get your first backlink.
            </p>
            <Link href="/#grid" className="btn-bauhaus-red">
              Buy a Square - From $1
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
