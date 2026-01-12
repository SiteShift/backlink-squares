import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, BookText, ChevronRight, Clock, User, Calendar } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ContentCTA } from '@/components/content/ContentCTA'
import { getAllGlossaryTerms, getGlossaryTerm } from '@/lib/content'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { useMDXComponents } from '@/mdx-components'
import { DefinedTermSchema, BreadcrumbSchema } from '@/components/seo/JsonLd'
import { formatDate } from '@/lib/utils'

const BASE_URL = 'https://backlinkgrid.com'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const term = getGlossaryTerm(slug)

  if (!term) {
    return { title: 'Term Not Found' }
  }

  const canonicalUrl = `${BASE_URL}/glossary/${slug}`

  return {
    title: term.metaTitle || `${term.title} - SEO Glossary Definition`,
    description: term.metaDescription || term.description.slice(0, 160),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `What is ${term.title}? | SEO Glossary`,
      description: term.metaDescription || term.description.slice(0, 160),
      url: canonicalUrl,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `What is ${term.title}?`,
      description: term.metaDescription || term.description.slice(0, 160),
    },
  }
}

export function generateStaticParams() {
  const terms = getAllGlossaryTerms()
  return terms.map((term) => ({ slug: term.slug }))
}

export default async function GlossaryTermPage({ params }: Props) {
  const { slug } = await params
  const term = getGlossaryTerm(slug)
  const allTerms = getAllGlossaryTerms()

  if (!term) {
    notFound()
  }

  // Find prev/next terms
  const currentIndex = allTerms.findIndex((t) => t.slug === slug)
  const prevTerm = currentIndex > 0 ? allTerms[currentIndex - 1] : null
  const nextTerm = currentIndex < allTerms.length - 1 ? allTerms[currentIndex + 1] : null

  // Get related terms data
  const relatedTermsData = term.relatedTerms
    .map((relatedSlug) => allTerms.find((t) => t.slug === relatedSlug))
    .filter(Boolean)

  const components = useMDXComponents({})
  const canonicalUrl = `${BASE_URL}/glossary/${slug}`

  return (
    <>
      <DefinedTermSchema
        term={term.title}
        definition={term.description}
        url={canonicalUrl}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: BASE_URL },
          { name: 'Glossary', url: `${BASE_URL}/glossary` },
          { name: term.title, url: canonicalUrl },
        ]}
      />

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
              <span className="text-dark font-medium">{term.title}</span>
            </nav>

            <div className="flex items-center gap-3 mb-6">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-bauhaus-blue text-white text-xs font-bold uppercase tracking-wider border-2 border-dark">
                <BookText className="w-3.5 h-3.5" />
                SEO Term
              </span>
            </div>

            <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-dark leading-tight">
              {term.title}
            </h1>

            <p className="mt-4 text-lg text-dark/70">{term.description}</p>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-dark/60 mt-6">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{term.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{term.readingTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Updated {formatDate(term.lastUpdated)}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="bg-white border-3 border-dark p-8 lg:p-12 prose prose-lg prose-slate max-w-none" style={{ boxShadow: '6px 6px 0px 0px #0A0A0A' }}>
            <MDXRemote source={term.content} components={components} />
          </div>

          {/* Related Terms */}
          {relatedTermsData.length > 0 && (
            <div className="mt-8 bg-white border-3 border-dark p-8" style={{ boxShadow: '6px 6px 0px 0px #0A0A0A' }}>
              <h2 className="font-display font-bold text-xl text-dark mb-4">Related Terms</h2>
              <div className="flex flex-wrap gap-3">
                {relatedTermsData.map((related) => (
                  <Link
                    key={related!.slug}
                    href={`/glossary/${related!.slug}`}
                    className="px-4 py-2 bg-bauhaus-cream hover:bg-bauhaus-yellow text-dark text-sm font-bold border-2 border-dark transition-colors"
                  >
                    {related!.title}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="mt-8 flex items-center justify-between">
            {prevTerm ? (
              <Link
                href={`/glossary/${prevTerm.slug}`}
                className="group flex items-center gap-2 text-dark/60 hover:text-bauhaus-red transition-colors"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">{prevTerm.title}</span>
              </Link>
            ) : (
              <div />
            )}
            {nextTerm && (
              <Link
                href={`/glossary/${nextTerm.slug}`}
                className="group flex items-center gap-2 text-dark/60 hover:text-bauhaus-red transition-colors"
              >
                <span className="text-sm font-medium">{nextTerm.title}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </nav>

          {/* CTA */}
          <ContentCTA />
        </article>
      </main>

      <Footer />
    </>
  )
}
