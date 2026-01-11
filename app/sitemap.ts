import { MetadataRoute } from 'next'
import {
  getAllHubs,
  getHubClusters,
  getAllGlossaryTerms,
  getAllBlogPosts,
  getAllGuides,
} from '@/lib/content'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://seobacklinks.dev'
  const currentDate = new Date().toISOString()

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/how-it-works`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/guides`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/glossary`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  // Content hub pages (pillar pages - high priority)
  const hubPages: MetadataRoute.Sitemap = []
  const clusterPages: MetadataRoute.Sitemap = []

  const hubs = getAllHubs()
  for (const hub of hubs) {
    // Add hub page
    hubPages.push({
      url: `${baseUrl}/${hub.slug}`,
      lastModified: hub.lastUpdated || currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    })

    // Add all cluster pages for this hub
    const clusters = getHubClusters(hub.slug)
    for (const cluster of clusters) {
      clusterPages.push({
        url: `${baseUrl}/${hub.slug}/${cluster.slug}`,
        lastModified: cluster.lastUpdated || currentDate,
        changeFrequency: 'monthly',
        priority: 0.8,
      })
    }
  }

  // Blog posts
  const blogPosts: MetadataRoute.Sitemap = getAllBlogPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.date || currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Guides
  const guides: MetadataRoute.Sitemap = getAllGuides().map((guide) => ({
    url: `${baseUrl}/guides/${guide.slug}`,
    lastModified: guide.date || currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // Glossary terms
  const glossaryTerms: MetadataRoute.Sitemap = getAllGlossaryTerms()
    .filter((term) => term.slug !== '_index')
    .map((term) => ({
      url: `${baseUrl}/glossary/${term.slug}`,
      lastModified: term.date || currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

  return [
    ...staticPages,
    ...hubPages,
    ...clusterPages,
    ...blogPosts,
    ...guides,
    ...glossaryTerms,
  ]
}
