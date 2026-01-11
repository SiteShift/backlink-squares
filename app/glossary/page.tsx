import { Metadata } from 'next'
import Link from 'next/link'
import { BookText } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getAllGlossaryTerms } from '@/lib/content'

const BASE_URL = 'https://seobacklinks.dev'

export const metadata: Metadata = {
  title: 'SEO Glossary - Link Building Terms Explained',
  description:
    'Essential SEO and link building glossary. Learn the meaning of important terms from anchor text to UGC links. 17+ terms explained simply.',
  alternates: {
    canonical: `${BASE_URL}/glossary`,
  },
  openGraph: {
    title: 'SEO Glossary | SEO Backlinks Grid',
    description:
      'Essential glossary of SEO and link building terms explained simply.',
    url: `${BASE_URL}/glossary`,
  },
}

// Group terms by first letter
function groupTermsByLetter(terms: ReturnType<typeof getAllGlossaryTerms>) {
  return terms.reduce((acc, term) => {
    const letter = term.title[0].toUpperCase()
    if (!acc[letter]) acc[letter] = []
    acc[letter].push(term)
    return acc
  }, {} as Record<string, typeof terms>)
}

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export default function GlossaryPage() {
  const glossaryTerms = getAllGlossaryTerms()
  const groupedTerms = groupTermsByLetter(glossaryTerms)

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
                UGC links, every term explained simply.
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
                          {term.title}
                        </h3>
                        <p className="text-sm text-dark/60 line-clamp-2">
                          {term.description}
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
