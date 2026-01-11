import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://seobacklinks.dev'

  // Static pages
  const staticPages = [
    '',
    '/how-it-works',
    '/about',
    '/contact',
    '/terms',
    '/privacy',
    '/blog',
    '/guides',
    '/glossary',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' as const : 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Blog posts
  const blogPosts = [
    'what-are-backlinks',
    'dofollow-vs-nofollow',
    'link-building-strategies',
    'domain-authority-explained',
    'backlink-quality-checklist',
  ].map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Guides
  const guides = [
    'what-are-backlinks-complete-guide',
    'link-building-strategies-guide',
    'domain-authority-guide',
  ].map((slug) => ({
    url: `${baseUrl}/guides/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // Glossary terms - only terms with full definitions
  const glossaryTerms = [
    'anchor-text',
    'backlink',
    'dofollow',
    'domain-authority',
    'link-building',
    'link-equity',
    'nofollow',
    'pagerank',
    'referring-domain',
    'toxic-backlink',
  ].map((slug) => ({
    url: `${baseUrl}/glossary/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...blogPosts, ...guides, ...glossaryTerms]
}
