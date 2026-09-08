import { use } from "react";
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { Clock, BookOpen, ChevronRight } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ContentCTA } from '@/components/content/ContentCTA'
import { StickyPromo } from '@/components/content/StickyPromo'
import { ArticleOffers } from '@/components/content/ArticleOffers'
import { TableOfContents } from '@/components/content/TableOfContents'
import { ArticleSchema, BreadcrumbSchema, FAQSchema } from '@/components/seo/JsonLd'
import { getGuide, getAllGuides } from '@/lib/content'
import { absoluteUrl, buildArticlePageMetadata, pickSeoDescription, resolveSchemaImage } from '@/lib/seo'
import { getMDXComponents } from '@/mdx-components'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const guide = getGuide(params.slug)

  if (!guide) {
    return { title: 'Guide Not Found' }
  }

  return buildArticlePageMetadata({
    pathname: `/guides/${params.slug}`,
    title: guide.title,
    description: guide.description,
    metaTitle: guide.metaTitle,
    metaDescription: guide.metaDescription,
    keywords: guide.keywords,
    image: guide.image,
    publishedTime: guide.date,
    modifiedTime: guide.lastUpdated || guide.date,
    authors: [guide.author || 'SEO Backlinks'],
  })
}

export function generateStaticParams() {
  const guides = getAllGuides()
  return guides.map((guide) => ({ slug: guide.slug }))
}

export default async function GuidePage(props: Props) {
  const params = await props.params;
  const guide = getGuide(params.slug)

  if (!guide) {
    notFound()
  }

  // Get other guides for related section
  const otherGuides = getAllGuides().filter(g => g.slug !== params.slug)

  // Breadcrumb data
  const breadcrumbs = [
    { name: 'Home', url: absoluteUrl('/') },
    { name: 'Guides', url: absoluteUrl('/guides') },
    { name: guide.title, url: absoluteUrl(`/guides/${params.slug}`) },
  ]

  return (
    <>
      <ArticleSchema
        title={guide.title}
        description={pickSeoDescription(guide)}
        author={guide.author || 'SEO Backlinks'}
        datePublished={guide.date}
        dateModified={guide.lastUpdated || guide.date}
        url={absoluteUrl(`/guides/${params.slug}`)}
        image={resolveSchemaImage(guide.image)}
        keywords={guide.keywords}
      />
      <BreadcrumbSchema items={breadcrumbs} />
      {guide.faqs && guide.faqs.length > 0 && <FAQSchema questions={guide.faqs} />}

      <Header />
      <StickyPromo />

      <main className="pt-14 sm:pt-16 lg:pt-20 min-h-screen bg-bauhaus-cream">
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
          <div className="grid lg:grid-cols-[minmax(0,1fr)_280px] gap-12">
            {/* Main Content */}
            <article className="bg-white rounded-lg p-5 sm:p-8 lg:p-10 min-w-0">
              <TableOfContents />
              <div className="prose prose-lg prose-slate max-w-none overflow-x-auto">
                <MDXRemote options={{ mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] } }} source={guide.content} components={getMDXComponents({})} />
              </div>

              <ContentCTA />
            </article>
            <ArticleOffers />
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

export const dynamicParams = false
