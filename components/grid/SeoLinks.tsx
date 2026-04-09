import { Square } from '@/lib/types'

interface SeoLinksProps {
  purchasedSquares: Square[]
}

/**
 * Server-rendered SEO links component.
 *
 * This component renders ALL purchased squares as real <a> tags
 * in the initial HTML for search engines to crawl.
 *
 * Key SEO requirements:
 * - Real anchor tags with href
 * - NO rel="nofollow" or rel="sponsored"
 * - Title attribute for accessibility
 * - Visible to crawlers (not display:none)
 */
export function SeoLinks({ purchasedSquares }: SeoLinksProps) {
  // Group squares by purchase_group_id to show unique sites
  const uniqueSites = new Map<string, Square>()

  purchasedSquares.forEach((square) => {
    if (square.site_url && square.purchase_group_id) {
      // Only keep one square per purchase group (they all link to same site)
      if (!uniqueSites.has(square.purchase_group_id)) {
        uniqueSites.set(square.purchase_group_id, square)
      }
    }
  })

  const sites = Array.from(uniqueSites.values())

  if (sites.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-dark border-t-3 border-white/10" id="grid-links">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-black text-2xl uppercase tracking-wide text-white">
            Sites on the Grid
          </h2>
          <p className="mt-2 text-white/50">
            {sites.length} {sites.length === 1 ? 'site' : 'sites'} with permanent dofollow backlinks
          </p>
        </div>

        {/* Grid of links - all server-rendered for SEO */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {sites.map((site) => (
            <a
              key={site.purchase_group_id}
              href={site.site_url!}
              title={site.site_name || 'Visit site'}
              target="_blank"
              rel="noopener"
              className="group flex flex-col items-center p-4 bg-white/5 border-2 border-white/10 hover:border-bauhaus-red hover:bg-white/10 transition-all"
            >
              {/* Logo or Initial */}
              <div className="w-12 h-12 bg-white/10 border-2 border-white/20 flex items-center justify-center mb-2 group-hover:border-bauhaus-red transition-colors">
                {site.logo_url ? (
                  <img
                    src={site.logo_url}
                    alt={`${site.site_name || 'Site'} logo`}
                    width={32}
                    height={32}
                    className="w-8 h-8 object-contain"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-white font-black text-lg">
                    {site.site_name?.charAt(0).toUpperCase() || '?'}
                  </span>
                )}
              </div>

              {/* Site name */}
              <span className="text-xs font-bold text-white/70 text-center truncate max-w-full group-hover:text-white transition-colors">
                {site.site_name || 'Site'}
              </span>
            </a>
          ))}
        </div>

        {/* SEO note - visible to users, reassures about link quality */}
        <p className="mt-8 text-center text-xs text-white/30 uppercase tracking-wider">
          All links are permanent dofollow backlinks
        </p>
      </div>
    </section>
  )
}
