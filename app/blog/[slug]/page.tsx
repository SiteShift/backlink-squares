import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { Calendar, Clock, User, ArrowLeft } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ContentCTA } from '@/components/content/ContentCTA'
import { BlogCard } from '@/components/content/BlogCard'
import { ArticleSchema, BreadcrumbSchema } from '@/components/seo/JsonLd'
import { getBlogPost, getAllBlogPosts, getRelatedPosts } from '@/lib/content'
import { formatDate } from '@/lib/utils'

const BASE_URL = 'https://backlinkgrid.com'

type Props = {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getBlogPost(params.slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: {
      canonical: `${BASE_URL}/blog/${params.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author || 'SEO Backlinks'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  }
}

export function generateStaticParams() {
  const posts = getAllBlogPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export default function BlogPostPage({ params }: Props) {
  const post = getBlogPost(params.slug)

  if (!post) {
    notFound()
  }

  // Get related posts
  const relatedPosts = getRelatedPosts(params.slug, post.keywords || [], 3)

  // Breadcrumb data
  const breadcrumbs = [
    { name: 'Home', url: BASE_URL },
    { name: 'Blog', url: `${BASE_URL}/blog` },
    { name: post.title, url: `${BASE_URL}/blog/${params.slug}` },
  ]

  return (
    <>
      <ArticleSchema
        title={post.title}
        description={post.description}
        author={post.author || 'SEO Backlinks'}
        datePublished={post.date}
        dateModified={post.date}
        url={`${BASE_URL}/blog/${params.slug}`}
        image={post.image || `${BASE_URL}/og-image.png`}
      />
      <BreadcrumbSchema items={breadcrumbs} />

      <Header />

      <main className="min-h-screen bg-bauhaus-cream">
        {/* Article Header */}
        <header className="py-16 lg:py-24 bg-white border-b-3 border-dark">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-dark/50 hover:text-bauhaus-red mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>

            {/* Category/Keywords */}
            <div className="flex flex-wrap gap-2 mb-4">
              {post.keywords?.slice(0, 3).map((keyword) => (
                <span
                  key={keyword}
                  className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-bauhaus-red/10 text-bauhaus-red"
                >
                  {keyword}
                </span>
              ))}
            </div>

            <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-[2.75rem] leading-tight text-dark mb-6">
              {post.title}
            </h1>

            <p className="text-lg sm:text-xl text-dark/60 leading-relaxed mb-8">
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
                {formatDate(post.date)}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {post.readingTime}
              </span>
            </div>
          </div>
        </header>

        {/* Article Content */}
        <article className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="article-content">
            <MDXRemote source={post.content} />
          </div>

          {/* CTA */}
          <ContentCTA />
        </article>

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
