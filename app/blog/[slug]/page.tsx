import { use } from "react";
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { Calendar, Clock, User, ArrowLeft } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ContentCTA } from '@/components/content/ContentCTA'
import { StickyPromo } from '@/components/content/StickyPromo'
import { BlogCard } from '@/components/content/BlogCard'
import { ArticleOffers } from '@/components/content/ArticleOffers'
import { TableOfContents } from '@/components/content/TableOfContents'
import { ArticleSchema, BreadcrumbSchema, FAQSchema } from '@/components/seo/JsonLd'
import { getBlogPost, getAllBlogPosts, getRelatedPosts } from '@/lib/content'
import { absoluteUrl, buildArticlePageMetadata, pickSeoDescription, resolveSchemaImage } from '@/lib/seo'
import { formatDate } from '@/lib/utils'
import { getMDXComponents } from '@/mdx-components'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const post = getBlogPost(params.slug)

  if (!post) {
    return { title: 'Post Not Found' }
  }

  return buildArticlePageMetadata({
    pathname: `/blog/${params.slug}`,
    title: post.title,
    description: post.description,
    metaTitle: post.metaTitle,
    metaDescription: post.metaDescription,
    keywords: post.keywords,
    image: post.image,
    publishedTime: post.date,
    modifiedTime: post.lastUpdated || post.date,
    authors: [post.author || 'SEO Backlinks'],
  })
}

export function generateStaticParams() {
  const posts = getAllBlogPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export default async function BlogPostPage(props: Props) {
  const params = await props.params;
  const post = getBlogPost(params.slug)

  if (!post) {
    notFound()
  }

  // Get related posts
  const relatedPosts = getRelatedPosts(params.slug, post.keywords || [], 3)

  // Breadcrumb data
  const breadcrumbs = [
    { name: 'Home', url: absoluteUrl('/') },
    { name: 'Blog', url: absoluteUrl('/blog') },
    { name: post.title, url: absoluteUrl(`/blog/${params.slug}`) },
  ]

  return (
    <>
      <ArticleSchema
        title={post.title}
        description={pickSeoDescription(post)}
        author={post.author || 'SEO Backlinks'}
        datePublished={post.date}
        dateModified={post.lastUpdated || post.date}
        url={absoluteUrl(`/blog/${params.slug}`)}
        image={resolveSchemaImage(post.image)}
        keywords={post.keywords}
      />
      <BreadcrumbSchema items={breadcrumbs} />
      {post.faqs && post.faqs.length > 0 && (
        <FAQSchema questions={post.faqs} />
      )}

      <Header />
      <StickyPromo />

      <main className="pt-14 sm:pt-16 lg:pt-20 min-h-screen bg-bauhaus-cream">
        {/* Article Header */}
        <header className="py-10 lg:py-16 bg-white border-b border-surface-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-dark/50 hover:text-bauhaus-red mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>

            <p className="text-sm font-semibold text-brand-red mb-4">BacklinkGrid Journal · Tools & strategies</p>

            <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl max-w-4xl leading-tight text-dark mb-6">
              {post.title}
            </h1>

            <p className="max-w-3xl text-lg sm:text-xl text-dark/60 leading-relaxed mb-8">
              {post.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-dark/50 pt-6 border-t border-dark/10">
              <span className="flex items-center gap-2">
                <div className="w-8 h-8 bg-bauhaus-blue flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium text-dark">{post.author}</span>
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {post.lastUpdated && post.lastUpdated !== post.date ? `Updated ${formatDate(post.lastUpdated)}` : formatDate(post.date)}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {post.readingTime}
              </span>
            </div>
          </div>
        </header>

        {/* Article Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 grid lg:grid-cols-[minmax(0,1fr)_280px] gap-12">
        <article className="min-w-0">
          <TableOfContents />
          <div className="prose prose-lg prose-slate max-w-none">
            <MDXRemote options={{ mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] } }} source={post.content} components={getMDXComponents({})} />
          </div>

          {/* CTA */}
          <ContentCTA />

        </article>
        <ArticleOffers />
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="py-16 lg:py-20 bg-white border-t-3 border-dark">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="font-display font-black text-2xl sm:text-3xl text-dark mb-8">
                Continue Reading
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <BlogCard key={relatedPost.slug} post={relatedPost} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  )
}

export const dynamicParams = false
