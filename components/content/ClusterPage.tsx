import Link from 'next/link'
import { Clock, User, Calendar, ChevronRight, ArrowRight, ArrowLeft, BookOpen, ExternalLink, Lightbulb, Layers } from 'lucide-react'
import { ClusterContent, ClusterMeta, HubMeta } from '@/lib/content'
import { formatDate } from '@/lib/utils'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { TableOfContents } from '@/components/content/TableOfContents'
import { ContentCTA } from '@/components/content/ContentCTA'
import { SidebarRelated } from '@/components/content/RelatedContent'

interface ResolvedLink {
  href: string
  title: string
  description?: string
}

interface ClusterPageProps {
  cluster: ClusterContent
  hub: HubMeta
  siblings: ClusterMeta[]
  content: React.ReactNode
  // Resolved links from metadata
  siblingPageLinks?: ResolvedLink[]
  crossHubLinks?: ResolvedLink[]
  relatedGlossaryTerms?: ResolvedLink[]
}

export function ClusterPage({
  cluster,
  hub,
  siblings,
  content,
  siblingPageLinks = [],
  crossHubLinks = [],
  relatedGlossaryTerms = [],
}: ClusterPageProps) {
  // Find previous and next sibling pages
  const currentIndex = siblings.findIndex((s) => s.slug === cluster.slug)
  const prevSibling = currentIndex > 0 ? siblings[currentIndex - 1] : null
  const nextSibling = currentIndex < siblings.length - 1 ? siblings[currentIndex + 1] : null

  // Filter out current page from siblings for the sidebar
  const otherSiblings = siblings.filter((s) => s.slug !== cluster.slug)

  // Prepare sidebar items - prioritize explicit siblingPageLinks if available
  const sidebarItems = siblingPageLinks.length > 0
    ? siblingPageLinks
    : otherSiblings.slice(0, 8).map(s => ({
        href: `/${hub.slug}/${s.slug}`,
        title: s.title,
        description: s.description,
      }))

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

                  {/* Related Pages in Sidebar */}
                  {sidebarItems.length > 0 && (
                    <SidebarRelated
                      title={`Related Topics (${sidebarItems.length})`}
                      items={sidebarItems}
                      maxItems={8}
                    />
                  )}

                  {/* Cross-Hub Links in Sidebar */}
                  {crossHubLinks.length > 0 && (
                    <div className="bg-white border-3 border-dark">
                      <div className="p-3 border-b-2 border-dark/10">
                        <h3 className="font-bold text-dark uppercase text-xs tracking-wider flex items-center gap-2">
                          <ExternalLink className="w-3.5 h-3.5 text-bauhaus-blue" />
                          Related Guides
                        </h3>
                      </div>
                      <nav className="py-1">
                        {crossHubLinks.slice(0, 4).map((link, index) => (
                          <Link
                            key={index}
                            href={link.href}
                            className="block text-xs text-dark/60 hover:text-dark hover:bg-bauhaus-cream/30 transition-colors py-1.5 px-3"
                          >
                            {link.title}
                          </Link>
                        ))}
                      </nav>
                    </div>
                  )}
                </div>
              </aside>

              {/* Main Content */}
              <div className="lg:col-span-3 min-w-0">
                <article className="prose prose-lg prose-slate max-w-none bg-white border-3 border-dark p-8 lg:p-12 overflow-x-auto">
                  {content}
                </article>

                {/* What to Read Next - Comprehensive Section */}
                <div className="mt-12 bg-white border-3 border-dark p-8">
                  <h2 className="font-display font-black text-xl text-dark mb-6">
                    What to Read Next
                  </h2>

                  <div className="space-y-6">
                    {/* Parent Hub Link */}
                    <div>
                      <Link
                        href={`/${hub.slug}`}
                        className="group block p-4 bg-bauhaus-blue/10 border-2 border-bauhaus-blue/20 hover:border-bauhaus-blue transition-colors"
                      >
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase text-bauhaus-blue tracking-wider mb-1">
                          <Layers className="w-3.5 h-3.5" />
                          Complete Guide
                        </span>
                        <span className="block font-bold text-dark group-hover:text-bauhaus-blue mt-1 transition-colors">
                          {hub.title}
                        </span>
                        <span className="block text-sm text-dark/60 mt-1 line-clamp-2">
                          {hub.description}
                        </span>
                      </Link>
                    </div>

                    {/* Sibling Pages - from metadata or fallback to all siblings */}
                    {(siblingPageLinks.length > 0 || otherSiblings.length > 0) && (
                      <div>
                        <h3 className="text-sm font-bold uppercase text-dark/50 tracking-wider mb-3 flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          Related Topics in This Guide
                        </h3>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {(siblingPageLinks.length > 0 ? siblingPageLinks : otherSiblings.map(s => ({
                            href: `/${hub.slug}/${s.slug}`,
                            title: s.title,
                            description: s.description,
                          }))).slice(0, 4).map((page, index) => (
                            <Link
                              key={index}
                              href={page.href}
                              className="group block p-3 bg-bauhaus-cream/50 border-2 border-dark/10 hover:border-bauhaus-red transition-colors"
                            >
                              <span className="font-medium text-dark group-hover:text-bauhaus-red transition-colors text-sm">
                                {page.title}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Cross-Hub Links */}
                    {crossHubLinks.length > 0 && (
                      <div>
                        <h3 className="text-sm font-bold uppercase text-dark/50 tracking-wider mb-3 flex items-center gap-2">
                          <ExternalLink className="w-4 h-4" />
                          Explore Related Guides
                        </h3>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {crossHubLinks.slice(0, 4).map((link, index) => (
                            <Link
                              key={index}
                              href={link.href}
                              className="group block p-3 bg-bauhaus-yellow/10 border-2 border-bauhaus-yellow/20 hover:border-bauhaus-yellow transition-colors"
                            >
                              <span className="font-medium text-dark group-hover:text-bauhaus-red transition-colors text-sm">
                                {link.title}
                              </span>
                              {link.description && (
                                <span className="block text-xs text-dark/50 mt-1 line-clamp-1">
                                  {link.description}
                                </span>
                              )}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Related Glossary Terms */}
                    {relatedGlossaryTerms.length > 0 && (
                      <div>
                        <h3 className="text-sm font-bold uppercase text-dark/50 tracking-wider mb-3 flex items-center gap-2">
                          <Lightbulb className="w-4 h-4" />
                          Related Definitions
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {relatedGlossaryTerms.slice(0, 6).map((term, index) => (
                            <Link
                              key={index}
                              href={term.href}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-dark/5 hover:bg-bauhaus-red hover:text-white text-sm text-dark/70 transition-colors"
                            >
                              {term.title}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Next/Previous Quick Navigation */}
                    {(nextSibling || prevSibling) && (
                      <div className="border-t-2 border-dark/10 pt-4">
                        <div className="grid sm:grid-cols-2 gap-3">
                          {prevSibling && (
                            <Link
                              href={`/${hub.slug}/${prevSibling.slug}`}
                              className="group block p-3 bg-bauhaus-cream border-2 border-dark hover:border-bauhaus-red transition-colors"
                            >
                              <span className="text-xs font-bold uppercase text-dark/50 tracking-wider flex items-center gap-1">
                                <ArrowLeft className="w-3 h-3" />
                                Previous
                              </span>
                              <span className="block font-medium text-dark group-hover:text-bauhaus-red mt-1 transition-colors text-sm">
                                {prevSibling.title}
                              </span>
                            </Link>
                          )}
                          {nextSibling && (
                            <Link
                              href={`/${hub.slug}/${nextSibling.slug}`}
                              className="group block p-3 bg-bauhaus-cream border-2 border-dark hover:border-bauhaus-red transition-colors sm:text-right"
                            >
                              <span className="text-xs font-bold uppercase text-dark/50 tracking-wider flex items-center gap-1 sm:justify-end">
                                Next
                                <ArrowRight className="w-3 h-3" />
                              </span>
                              <span className="block font-medium text-dark group-hover:text-bauhaus-red mt-1 transition-colors text-sm">
                                {nextSibling.title}
                              </span>
                            </Link>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
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
