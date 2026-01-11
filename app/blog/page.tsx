import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BlogCard } from '@/components/content/BlogCard'
import { getAllBlogPosts } from '@/lib/content'

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
