import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { Clock, BookOpen, ChevronRight } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ContentCTA } from '@/components/content/ContentCTA'
import { StickyPromo } from '@/components/content/StickyPromo'
import { ArticleSchema, BreadcrumbSchema } from '@/components/seo/JsonLd'
import { getGuide, getAllGuides } from '@/lib/content'
import { useMDXComponents } from '@/mdx-components'

const BASE_URL = 'https://backlinkgrid.com'

type Props = {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guide = getGuide(params.slug)

  if (!guide) {
    return { title: 'Guide Not Found' }
  }

  return {
    title: `${guide.title} | SEO Backlinks Grid`,
    description: guide.description,
    keywords: guide.keywords,
    alternates: {
      canonical: `${BASE_URL}/guides/${params.slug}`,
    },
    openGraph: {
      title: guide.title,
      description: guide.description,
      type: 'article',
      publishedTime: guide.date,
      authors: [guide.author || 'SEO Backlinks'],
    },
  }
}

export function generateStaticParams() {
  const guides = getAllGuides()
  return guides.map((guide) => ({ slug: guide.slug }))
}

export default function GuidePage({ params }: Props) {
  const guide = getGuide(params.slug)

  if (!guide) {
    notFound()
  }

  // Get other guides for related section
  const otherGuides = getAllGuides().filter(g => g.slug !== params.slug)

  // Breadcrumb data
  const breadcrumbs = [
    { name: 'Home', url: BASE_URL },
    { name: 'Guides', url: `${BASE_URL}/guides` },
    { name: guide.title, url: `${BASE_URL}/guides/${params.slug}` },
  ]

  return (
    <>
      <ArticleSchema
        title={guide.title}
        description={guide.description}
        author={guide.author || 'SEO Backlinks'}
        datePublished={guide.date}
        dateModified={guide.date}
        url={`${BASE_URL}/guides/${params.slug}`}
        image={guide.image || `${BASE_URL}/og-image.png`}
      />
      <BreadcrumbSchema items={breadcrumbs} />

      <Header />
      <StickyPromo />

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
              <Link href="/guides" className="text-dark/50 hover:text-dark transition-colors">
                Guides
              </Link>
              <ChevronRight className="w-4 h-4 text-dark/30" />
              <span className="text-dark font-medium">Guide</span>
            </nav>

            {/* Meta badges */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {guide.keywords?.map((keyword) => (
                <span
                  key={keyword}
                  className="px-3 py-1 bg-bauhaus-blue text-white text-xs font-bold uppercase tracking-wider border-2 border-dark"
                >
                  {keyword}
                </span>
              ))}
              <span className="flex items-center gap-1.5 text-sm text-dark/50 ml-2">
                <Clock className="w-4 h-4" />
                {guide.readingTime}
              </span>
            </div>

            <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-dark leading-tight mb-6">
              {guide.title}
            </h1>

            <p className="text-xl text-dark/60 leading-relaxed max-w-3xl">
              {guide.description}
            </p>

            {/* Author attribution */}
            {guide.author && (
              <div className="mt-6 pt-6 border-t border-dark/10">
                <p className="text-sm text-dark/50">
                  Written by <span className="font-semibold text-dark">{guide.author}</span>
                </p>
              </div>
            )}
          </div>
        </header>

        {/* Content Layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid lg:grid-cols-[280px_1fr] gap-12">
            {/* Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-32 space-y-4">
                {/* Related Guides */}
                {otherGuides.length > 0 && (
                  <div className="bg-white border-3 border-dark">
                    <div className="p-3 border-b-2 border-dark/10">
                      <h3 className="font-bold text-dark uppercase text-xs tracking-wider flex items-center gap-2">
                        <BookOpen className="w-3.5 h-3.5 text-bauhaus-blue" />
                        More Guides
                      </h3>
                    </div>
                    <nav className="py-1">
                      {otherGuides.map((otherGuide) => (
                        <Link
                          key={otherGuide.slug}
                          href={`/guides/${otherGuide.slug}`}
                          className="block text-xs text-dark/60 hover:text-dark hover:bg-bauhaus-cream/30 transition-colors py-1.5 px-3"
                        >
                          {otherGuide.title}
                        </Link>
                      ))}
                    </nav>
                  </div>
                )}
              </div>
            </aside>

            {/* Main Content */}
            <article className="bg-white border-3 border-dark p-8 lg:p-12" style={{ boxShadow: '6px 6px 0px 0px #0A0A0A' }}>
              <div className="prose prose-lg prose-slate max-w-none">
                <MDXRemote source={guide.content} components={useMDXComponents({})} />
              </div>

              <ContentCTA />
            </article>
          </div>
        </div>

        {/* Related Guides */}
        <section className="py-16 bg-dark">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display font-black text-2xl text-white mb-8 text-center">
              Continue Learning
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {otherGuides.slice(0, 2).map((otherGuide) => (
                <Link
                  key={otherGuide.slug}
                  href={`/guides/${otherGuide.slug}`}
                  className="group bg-white border-3 border-dark p-6 hover:-translate-y-1 transition-all"
                  style={{ boxShadow: '4px 4px 0px 0px #FDD835' }}
                >
                  <div className="flex items-center gap-2 text-xs text-dark/50 mb-2">
                    <BookOpen className="w-3.5 h-3.5" />
                    {otherGuide.readingTime}
                  </div>
                  <h3 className="font-display font-bold text-lg text-dark group-hover:text-bauhaus-red transition-colors leading-snug">
                    {otherGuide.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
