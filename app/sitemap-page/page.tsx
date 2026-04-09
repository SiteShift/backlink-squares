import { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getAllHubs, getHubClusters, getAllGlossaryTerms } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = {
  ...buildMetadata({
    title: 'Sitemap - All Pages',
    description: 'Complete sitemap of BacklinkGrid. Browse all pages including guides, glossary terms, tools, and content hubs.',
    canonicalUrl: 'https://backlinkgrid.com/sitemap-page',
    type: 'website',
  }),
}

export default function SitemapPage() {
  const hubs = getAllHubs()
  const glossaryTerms = getAllGlossaryTerms()

  const staticPages = [
    { href: '/', label: 'Home' },
    { href: '/how-it-works', label: 'How It Works' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/statistics', label: 'Statistics' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
    { href: '/blog', label: 'Blog' },
    { href: '/guides', label: 'Guides' },
    { href: '/glossary', label: 'Glossary' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/privacy', label: 'Privacy Policy' },
  ]

  return (
    <>
      <Header />

      <main className="min-h-screen bg-bauhaus-cream">
        {/* Hero */}
        <section className="py-16 lg:py-20 bg-white border-b-3 border-dark">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-display font-black text-4xl sm:text-5xl text-dark">
              Sitemap
            </h1>
            <p className="mt-4 text-lg text-dark/60">
              Complete directory of all pages on BacklinkGrid
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Main Pages */}
            <div className="bg-white border-3 border-dark p-8 mb-8">
              <h2 className="font-display font-bold text-xl text-dark mb-6">Main Pages</h2>
              <ul className="grid sm:grid-cols-2 gap-2">
                {staticPages.map((page) => (
                  <li key={page.href}>
                    <Link
                      href={page.href}
                      className="text-dark/70 hover:text-brand-red transition-colors"
                    >
                      {page.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Content Hubs */}
            <div className="bg-white border-3 border-dark p-8 mb-8">
              <h2 className="font-display font-bold text-xl text-dark mb-6">Content Hubs</h2>
              <div className="space-y-8">
                {hubs.map((hub) => {
                  const clusters = getHubClusters(hub.slug)
                  return (
                    <div key={hub.slug}>
                      <Link
                        href={`/${hub.slug}`}
                        className="font-bold text-dark hover:text-brand-red transition-colors"
                      >
                        {hub.title}
                      </Link>
                      {clusters.length > 0 && (
                        <ul className="mt-3 ml-4 space-y-1">
                          {clusters.map((cluster) => (
                            <li key={cluster.slug}>
                              <Link
                                href={`/${hub.slug}/${cluster.slug}`}
                                className="text-sm text-dark/60 hover:text-brand-red transition-colors"
                              >
                                {cluster.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Glossary */}
            <div className="bg-white border-3 border-dark p-8">
              <h2 className="font-display font-bold text-xl text-dark mb-6">
                Glossary ({glossaryTerms.length} terms)
              </h2>
              <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
                {glossaryTerms.map((term) => (
                  <li key={term.slug}>
                    <Link
                      href={`/glossary/${term.slug}`}
                      className="text-sm text-dark/60 hover:text-brand-red transition-colors"
                    >
                      {term.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
