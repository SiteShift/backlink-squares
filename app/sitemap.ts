import { MetadataRoute } from 'next'
import {
  getAllHubs,
  getHubClusters,
  getAllGlossaryTerms,
  getAllBlogPosts,
  getAllGuides,
  getAllStrategies,
  getAllComparisons,
  getAllStatistics,
} from '@/lib/content'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://backlinkgrid.com'

  // Use fixed dates for static content to avoid unnecessary recrawls
  // Update these dates when content actually changes
  const SITE_LAUNCH_DATE = '2026-01-01T00:00:00.000Z'
  const LAST_CONTENT_UPDATE = '2026-01-23T00:00:00.000Z'

  // Static pages with real timestamps
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/how-it-works`,
      lastModified: SITE_LAUNCH_DATE,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: SITE_LAUNCH_DATE,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/statistics`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: SITE_LAUNCH_DATE,
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: SITE_LAUNCH_DATE,
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: SITE_LAUNCH_DATE,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: SITE_LAUNCH_DATE,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/guides`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/glossary`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sitemap-page`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    // Bundle product page
    {
      url: `${baseUrl}/bundle`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    // Tools section
    {
      url: `${baseUrl}/tools`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools/roi-calculator`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/free-backlink-checker`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools/backlink-analyzer`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    // Strategy and comparison index pages
    {
      url: `${baseUrl}/strategies`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/comparisons`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  // Hardcoded blog posts (until migrated to MDX)
  const hardcodedBlogSlugs = [
    'what-are-backlinks',
    'dofollow-vs-nofollow',
    'link-building-strategies',
    'domain-authority-explained',
    'backlink-quality-checklist',
  ]
  const hardcodedBlogPosts: MetadataRoute.Sitemap = hardcodedBlogSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: SITE_LAUNCH_DATE,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Hardcoded guides (until migrated to MDX)
  const hardcodedGuideSlugs = [
    'what-are-backlinks-complete-guide',
    'link-building-strategies-guide',
    'domain-authority-guide',
  ]
  const hardcodedGuides: MetadataRoute.Sitemap = hardcodedGuideSlugs.map((slug) => ({
    url: `${baseUrl}/guides/${slug}`,
    lastModified: SITE_LAUNCH_DATE,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // ============================================
  // Content Hub Pages (pillar pages - high priority)
  // Includes: backlinks, link-building, backlink-quality,
  // backlink-audit, link-building-tactics, digital-pr,
  // outreach, industries, resources, strategies, comparisons
  // ============================================
  const hubPages: MetadataRoute.Sitemap = []
  const clusterPages: MetadataRoute.Sitemap = []

  const hubs = getAllHubs()
  for (const hub of hubs) {
    // Add hub page (priority 0.9)
    hubPages.push({
      url: `${baseUrl}/${hub.slug}`,
      lastModified: hub.lastUpdated || LAST_CONTENT_UPDATE,
      changeFrequency: 'weekly',
      priority: 0.9,
    })

    // Add all cluster pages for this hub (priority 0.8)
    const clusters = getHubClusters(hub.slug)
    for (const cluster of clusters) {
      clusterPages.push({
        url: `${baseUrl}/${hub.slug}/${cluster.slug}`,
        lastModified: cluster.lastUpdated || LAST_CONTENT_UPDATE,
        changeFrequency: 'monthly',
        priority: 0.8,
      })
    }
  }

  // ============================================
  // Strategy Pages (if not captured via hub system)
  // Industry-specific link building strategies
  // ============================================
  const strategyPages: MetadataRoute.Sitemap = getAllStrategies().map((strategy) => ({
    url: `${baseUrl}/strategies/${strategy.slug}`,
    lastModified: strategy.lastUpdated || LAST_CONTENT_UPDATE,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // ============================================
  // Comparison Pages (if not captured via hub system)
  // Tool comparisons, service comparisons, method comparisons
  // ============================================
  const comparisonPages: MetadataRoute.Sitemap = getAllComparisons().map((comparison) => ({
    url: `${baseUrl}/comparisons/${comparison.slug}`,
    lastModified: comparison.lastUpdated || LAST_CONTENT_UPDATE,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // ============================================
  // Statistics Pages (if any exist in content/statistics)
  // ============================================
  const statisticsPages: MetadataRoute.Sitemap = getAllStatistics().map((stat) => ({
    url: `${baseUrl}/statistics/${stat.slug}`,
    lastModified: stat.lastUpdated || LAST_CONTENT_UPDATE,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // ============================================
  // Blog Posts from MDX - merged with hardcoded (priority 0.7)
  // ============================================
  const mdxBlogPosts: MetadataRoute.Sitemap = getAllBlogPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.date || LAST_CONTENT_UPDATE,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // ============================================
  // Guides from MDX - merged with hardcoded (priority 0.8)
  // ============================================
  const mdxGuides: MetadataRoute.Sitemap = getAllGuides().map((guide) => ({
    url: `${baseUrl}/guides/${guide.slug}`,
    lastModified: guide.date || LAST_CONTENT_UPDATE,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // ============================================
  // Glossary Terms (priority 0.6)
  // ============================================
  const glossaryTerms: MetadataRoute.Sitemap = getAllGlossaryTerms().map((term) => ({
    url: `${baseUrl}/glossary/${term.slug}`,
    lastModified: term.lastUpdated || LAST_CONTENT_UPDATE,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // ============================================
  // Combine and deduplicate blog posts (MDX takes precedence)
  // ============================================
  const allBlogUrls = Array.from(new Set([...mdxBlogPosts.map(p => p.url), ...hardcodedBlogPosts.map(p => p.url)]))
  const blogPosts = allBlogUrls.map(url => {
    const mdx = mdxBlogPosts.find(p => p.url === url)
    const hardcoded = hardcodedBlogPosts.find(p => p.url === url)
    return mdx || hardcoded!
  })

  // ============================================
  // Combine and deduplicate guides (MDX takes precedence)
  // ============================================
  const allGuideUrls = Array.from(new Set([...mdxGuides.map(g => g.url), ...hardcodedGuides.map(g => g.url)]))
  const guides = allGuideUrls.map(url => {
    const mdx = mdxGuides.find(g => g.url === url)
    const hardcoded = hardcodedGuides.find(g => g.url === url)
    return mdx || hardcoded!
  })

  // ============================================
  // Combine and deduplicate all pages
  // Strategy and comparison pages may be duplicated if they're also in hubs
  // ============================================
  const allUrls = new Set<string>()
  const allPages: MetadataRoute.Sitemap = []

  const addPages = (pages: MetadataRoute.Sitemap) => {
    for (const page of pages) {
      if (!allUrls.has(page.url)) {
        allUrls.add(page.url)
        allPages.push(page)
      }
    }
  }

  // Add in priority order (higher priority items first to win deduplication)
  addPages(staticPages)
  addPages(hubPages)
  addPages(clusterPages)
  addPages(strategyPages)
  addPages(comparisonPages)
  addPages(statisticsPages)
  addPages(blogPosts)
  addPages(guides)
  addPages(glossaryTerms)

  return allPages
}
