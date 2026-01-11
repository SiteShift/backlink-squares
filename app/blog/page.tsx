import { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BlogCard } from '@/components/content/BlogCard'
import { getAllBlogPosts } from '@/lib/content'

export const metadata: Metadata = {
  title: 'SEO & Link Building Blog - Expert Guides & Tips',
  description:
    'Learn about backlinks, link building strategies, and SEO best practices. Expert guides and actionable tips to grow your organic traffic.',
  openGraph: {
    title: 'SEO & Link Building Blog | SEO Backlinks Grid',
    description:
      'Expert guides, strategies, and tips for building quality backlinks and improving your SEO.',
  },
}

// Hardcoded blog posts for demo (in production, these would come from MDX files)
const demoPosts = [
  {
    slug: 'what-are-backlinks',
    title: 'What Are Backlinks? The Complete Beginner\'s Guide for 2025',
    description:
      'Learn everything about backlinks: what they are, why they matter for SEO, and how to start building quality links to your website.',
    date: '2025-01-10',
    author: 'SEO Backlinks',
    keywords: ['backlinks', 'SEO basics', 'link building'],
    readingTime: '8 min read',
  },
  {
    slug: 'dofollow-vs-nofollow',
    title: 'Dofollow vs Nofollow Links: What\'s the Difference?',
    description:
      'Understand the crucial difference between dofollow and nofollow links, how they impact your SEO, and when to use each type.',
    date: '2025-01-09',
    author: 'SEO Backlinks',
    keywords: ['dofollow', 'nofollow', 'link attributes'],
    readingTime: '6 min read',
  },
  {
    slug: 'link-building-strategies',
    title: '15 Proven Link Building Strategies That Work in 2025',
    description:
      'Discover actionable link building tactics from guest posting to broken link building. Real strategies that get results.',
    date: '2025-01-08',
    author: 'SEO Backlinks',
    keywords: ['link building', 'strategies', 'tactics'],
    readingTime: '12 min read',
  },
  {
    slug: 'domain-authority-explained',
    title: 'Domain Authority Explained: What It Is and How to Improve It',
    description:
      'A comprehensive guide to understanding Domain Authority (DA), what affects it, and practical steps to improve your site\'s DA score.',
    date: '2025-01-07',
    author: 'SEO Backlinks',
    keywords: ['domain authority', 'DA', 'Moz'],
    readingTime: '9 min read',
  },
  {
    slug: 'backlink-quality-checklist',
    title: 'How to Evaluate Backlink Quality: The Essential Checklist',
    description:
      'Not all backlinks are created equal. Learn how to identify high-quality links and avoid toxic ones that could hurt your rankings.',
    date: '2025-01-06',
    author: 'SEO Backlinks',
    keywords: ['link quality', 'toxic backlinks', 'evaluation'],
    readingTime: '7 min read',
  },
]

export default function BlogPage() {
  // In production: const posts = getAllBlogPosts()
  const posts = demoPosts
  const [featuredPost, ...otherPosts] = posts

  return (
    <>
      <Header />

      <main className="min-h-screen bg-bauhaus-cream">
        {/* Hero */}
        <section className="py-16 lg:py-24 bg-white border-b-3 border-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-bauhaus-red/10 text-bauhaus-red text-sm font-bold uppercase tracking-wider mb-6">
                Blog
              </div>
              <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-dark leading-tight">
                SEO & Link Building Insights
              </h1>
              <p className="mt-6 text-xl text-dark/60 leading-relaxed">
                Expert guides, strategies, and insights to help you master
                backlinks and grow your organic traffic.
              </p>
            </div>
          </div>
        </section>

        {/* Featured Post */}
        {featuredPost && (
          <section className="py-12 lg:py-16">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <p className="text-sm font-bold uppercase tracking-wider text-dark/40 mb-4">Featured</p>
              <BlogCard post={featuredPost} featured />
            </div>
          </section>
        )}

        {/* All Posts */}
        <section className="pb-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display font-black text-2xl text-dark mb-8">
              Latest Articles
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherPosts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-16 lg:py-20 bg-dark">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white mb-4">
              Get SEO Tips in Your Inbox
            </h2>
            <p className="text-white/60 mb-8">
              Weekly insights on link building, SEO strategies, and industry updates.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border-3 border-dark bg-white text-dark placeholder:text-dark/40 focus:outline-none focus:border-bauhaus-blue"
              />
              <button
                type="submit"
                className="btn-bauhaus-red whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
