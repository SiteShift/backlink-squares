import Link from 'next/link'
import { Clock, User, Calendar, ChevronRight, ArrowRight, ArrowLeft, BookOpen } from 'lucide-react'
import { ClusterContent, ClusterMeta, HubMeta } from '@/lib/content'
import { formatDate } from '@/lib/utils'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { TableOfContents } from '@/components/content/TableOfContents'
import { ContentCTA } from '@/components/content/ContentCTA'

interface ClusterPageProps {
  cluster: ClusterContent
  hub: HubMeta
  siblings: ClusterMeta[]
  content: React.ReactNode
}

export function ClusterPage({ cluster, hub, siblings, content }: ClusterPageProps) {
  // Find previous and next sibling pages
  const currentIndex = siblings.findIndex((s) => s.slug === cluster.slug)
  const prevSibling = currentIndex > 0 ? siblings[currentIndex - 1] : null
  const nextSibling = currentIndex < siblings.length - 1 ? siblings[currentIndex + 1] : null

  return (
    <>
      <Header />

      <main className="min-h-screen bg-bauhaus-cream">
        {/* Breadcrumbs */}
        <nav className="bg-white border-b-3 border-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <ol className="flex items-center gap-2 text-sm">
              <li>
                <Link href="/" className="text-dark/60 hover:text-bauhaus-red transition-colors">
                  Home
                </Link>
              </li>
              <ChevronRight className="w-4 h-4 text-dark/40" />
              <li>
                <Link
                  href={`/${hub.slug}`}
                  className="text-dark/60 hover:text-bauhaus-red transition-colors"
                >
                  {hub.title}
                </Link>
              </li>
              <ChevronRight className="w-4 h-4 text-dark/40" />
              <li>
                <span className="text-dark font-medium">{cluster.title}</span>
              </li>
            </ol>
          </div>
        </nav>

        {/* Hero */}
        <section className="py-12 lg:py-16 bg-white border-b-3 border-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              {/* Parent hub link */}
              <Link
                href={`/${hub.slug}`}
                className="inline-flex items-center gap-2 text-sm text-dark/60 hover:text-bauhaus-red mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to {hub.title}
              </Link>

              <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-dark leading-tight mb-6">
                {cluster.title}
              </h1>

              <p className="text-lg text-dark/70 mb-8 leading-relaxed">
                {cluster.description}
              </p>

              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-dark/60">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{cluster.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{cluster.readingTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Updated {formatDate(cluster.lastUpdated)}</span>
                </div>
                <div className="px-3 py-1 bg-bauhaus-cream border-2 border-dark text-xs font-bold uppercase tracking-wider">
                  {cluster.searchIntent}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Grid */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Table of Contents - Sidebar */}
              <aside className="lg:col-span-1 hidden lg:block">
                <div className="sticky top-24 space-y-4">
                  <TableOfContents />

                  {/* Related Pages */}
                  {siblings.length > 1 && (
                    <div className="bg-white border-3 border-dark">
                      <div className="p-3 border-b-2 border-dark/10">
                        <h3 className="font-bold text-dark uppercase text-xs tracking-wider flex items-center gap-2">
                          <BookOpen className="w-3.5 h-3.5 text-bauhaus-yellow" />
                          Related Topics
                          <span className="text-dark/40">({siblings.length - 1})</span>
                        </h3>
                      </div>
                      <nav className="max-h-[25vh] overflow-y-auto py-1">
                        {siblings
                          .filter((s) => s.slug !== cluster.slug)
                          .slice(0, 8)
                          .map((sibling) => (
                            <Link
                              key={sibling.slug}
                              href={`/${hub.slug}/${sibling.slug}`}
                              className="block text-xs text-dark/60 hover:text-dark hover:bg-bauhaus-cream/30 transition-colors py-1.5 px-3"
                            >
                              {sibling.title}
                            </Link>
                          ))}
                      </nav>
                    </div>
                  )}
                </div>
              </aside>

              {/* Main Content */}
              <div className="lg:col-span-3">
                <article className="prose prose-lg prose-slate max-w-none bg-white border-3 border-dark p-8 lg:p-12">
                  {content}
                </article>

                {/* What to Read Next */}
                <div className="mt-12 bg-white border-3 border-dark p-8">
                  <h2 className="font-display font-black text-xl text-dark mb-6">
                    What to Read Next
                  </h2>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* Back to Hub */}
                    <Link
                      href={`/${hub.slug}`}
                      className="group block p-4 bg-bauhaus-cream border-2 border-dark hover:border-bauhaus-red transition-colors"
                    >
                      <span className="text-xs font-bold uppercase text-dark/50 tracking-wider">
                        Main Guide
                      </span>
                      <span className="block font-bold text-dark group-hover:text-bauhaus-red mt-1 transition-colors">
                        {hub.title}
                      </span>
                    </Link>

                    {/* Next Sibling */}
                    {nextSibling && (
                      <Link
                        href={`/${hub.slug}/${nextSibling.slug}`}
                        className="group block p-4 bg-bauhaus-cream border-2 border-dark hover:border-bauhaus-red transition-colors"
                      >
                        <span className="text-xs font-bold uppercase text-dark/50 tracking-wider">
                          Next Topic
                        </span>
                        <span className="block font-bold text-dark group-hover:text-bauhaus-red mt-1 transition-colors">
                          {nextSibling.title}
                        </span>
                      </Link>
                    )}
                  </div>
                </div>

                {/* Prev/Next Navigation */}
                <div className="mt-8 flex justify-between gap-4">
                  {prevSibling ? (
                    <Link
                      href={`/${hub.slug}/${prevSibling.slug}`}
                      className="flex items-center gap-2 text-dark/60 hover:text-bauhaus-red transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span className="text-sm">{prevSibling.title}</span>
                    </Link>
                  ) : (
                    <div />
                  )}

                  {nextSibling && (
                    <Link
                      href={`/${hub.slug}/${nextSibling.slug}`}
                      className="flex items-center gap-2 text-dark/60 hover:text-bauhaus-red transition-colors"
                    >
                      <span className="text-sm">{nextSibling.title}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>

                {/* CTA */}
                <ContentCTA />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
