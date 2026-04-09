import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Package, Search } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BlogCard } from '@/components/content/BlogCard'
import { getAllBlogPosts } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = {
  ...buildMetadata({
    title: 'SEO & Link Building Blog',
    description:
      'Expert insights on SEO, link building, and backlink strategies. Learn from in-depth articles and stay updated on the latest trends.',
    canonicalUrl: 'https://backlinkgrid.com/blog',
    type: 'website',
    keywords: ['SEO blog', 'link building blog', 'backlink guides', 'SEO insights'],
  }),
}

export default function BlogPage() {
  const posts = getAllBlogPosts()
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

        {/* Product Funnel */}
        <section className="py-16 lg:py-20 bg-dark">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="font-display font-black text-2xl sm:text-3xl text-white mb-4">
                Turn SEO Reads Into SEO Action
              </h2>
              <p className="text-white/60 max-w-2xl mx-auto">
                Use the free tools, grab the backlink database bundle, or claim a permanent dofollow backlink on the grid.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Link
                href="/#grid"
                className="group bg-white border-3 border-dark p-6 hover:-translate-y-1 transition-all"
              >
                <h3 className="font-display font-bold text-xl text-dark mb-2">
                  Buy a Backlink
                </h3>
                <p className="text-dark/60 mb-4">
                  Claim a permanent dofollow square starting at $1.
                </p>
                <span className="inline-flex items-center gap-2 font-bold text-bauhaus-red">
                  Go to the grid
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>

              <Link
                href="/bundle"
                className="group bg-bauhaus-yellow border-3 border-dark p-6 hover:-translate-y-1 transition-all"
              >
                <Package className="w-6 h-6 text-dark mb-3" />
                <h3 className="font-display font-bold text-xl text-dark mb-2">
                  Get the Bundle
                </h3>
                <p className="text-dark/70 mb-4">
                  Download 270+ verified backlink opportunities in one spreadsheet.
                </p>
                <span className="inline-flex items-center gap-2 font-bold text-dark">
                  View bundle
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>

              <Link
                href="/tools/free-backlink-checker"
                className="group bg-white border-3 border-dark p-6 hover:-translate-y-1 transition-all"
              >
                <Search className="w-6 h-6 text-bauhaus-blue mb-3" />
                <h3 className="font-display font-bold text-xl text-dark mb-2">
                  Use Free Tools
                </h3>
                <p className="text-dark/60 mb-4">
                  Check backlinks, audit your profile, and estimate ROI without paying first.
                </p>
                <span className="inline-flex items-center gap-2 font-bold text-bauhaus-blue">
                  Open tools
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
