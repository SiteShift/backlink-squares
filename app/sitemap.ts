import { MetadataRoute } from 'next'
import {
  getAllHubs,
  getHubClusters,
  getAllGlossaryTerms,
  getAllBlogPosts,
  getAllGuides,
} from '@/lib/content'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://backlinkgrid.com'

  // Use fixed dates for static content to avoid unnecessary recrawls
  // Update these dates when content actually changes
  const SITE_LAUNCH_DATE = '2026-01-01T00:00:00.000Z'
  const LAST_CONTENT_UPDATE = '2026-01-12T00:00:00.000Z'

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

  // Content hub pages (pillar pages - high priority)
  const hubPages: MetadataRoute.Sitemap = []
  const clusterPages: MetadataRoute.Sitemap = []

  const hubs = getAllHubs()
  for (const hub of hubs) {
    // Add hub page
    hubPages.push({
      url: `${baseUrl}/${hub.slug}`,
      lastModified: hub.lastUpdated || LAST_CONTENT_UPDATE,
      changeFrequency: 'weekly',
      priority: 0.9,
    })

    // Add all cluster pages for this hub
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

  // Blog posts from MDX (when they exist) - merged with hardcoded
  const mdxBlogPosts: MetadataRoute.Sitemap = getAllBlogPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.date || LAST_CONTENT_UPDATE,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Guides from MDX (when they exist) - merged with hardcoded
  const mdxGuides: MetadataRoute.Sitemap = getAllGuides().map((guide) => ({
    url: `${baseUrl}/guides/${guide.slug}`,
    lastModified: guide.date || LAST_CONTENT_UPDATE,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // Glossary terms from MDX
  const glossaryTerms: MetadataRoute.Sitemap = getAllGlossaryTerms().map((term) => ({
    url: `${baseUrl}/glossary/${term.slug}`,
    lastModified: term.lastUpdated || LAST_CONTENT_UPDATE,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // Combine blog and guide posts (MDX takes precedence, then hardcoded)
  const allBlogUrls = Array.from(new Set([...mdxBlogPosts.map(p => p.url), ...hardcodedBlogPosts.map(p => p.url)]))
  const blogPosts = allBlogUrls.map(url => {
    const mdx = mdxBlogPosts.find(p => p.url === url)
    const hardcoded = hardcodedBlogPosts.find(p => p.url === url)
    return mdx || hardcoded!
  })

  const allGuideUrls = Array.from(new Set([...mdxGuides.map(g => g.url), ...hardcodedGuides.map(g => g.url)]))
  const guides = allGuideUrls.map(url => {
    const mdx = mdxGuides.find(g => g.url === url)
    const hardcoded = hardcodedGuides.find(g => g.url === url)
    return mdx || hardcoded!
  })

  return [
    ...staticPages,
    ...hubPages,
    ...clusterPages,
    ...blogPosts,
    ...guides,
    ...glossaryTerms,
  ]
}
