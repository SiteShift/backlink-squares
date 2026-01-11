import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { calculateReadingTime } from './utils'

const contentDirectory = path.join(process.cwd(), 'content')

export interface ContentMeta {
  slug: string
  title: string
  description: string
  date: string
  author?: string
  keywords?: string[]
  readingTime: string
  image?: string
}

export interface ContentItem extends ContentMeta {
  content: string
}

// Hub content type for pillar pages
export interface HubMeta {
  slug: string
  title: string
  description: string
  metaTitle: string
  metaDescription: string
  primaryKeyword: string
  secondaryKeywords: string[]
  wordCount: number
  lastUpdated: string
  author: string
  readingTime: string
  hub: string
  clusterPages?: string[]
  image?: string
}

export interface HubContent extends HubMeta {
  content: string
}

// Cluster content type for supporting pages
export interface ClusterMeta {
  slug: string
  title: string
  description: string
  metaTitle: string
  metaDescription: string
  primaryKeyword: string
  secondaryKeywords: string[]
  searchIntent: string
  wordCount: number
  lastUpdated: string
  author: string
  readingTime: string
  parentHub: string
  siblingPages?: string[]
  crossHubLinks?: string[]
  image?: string
}

export interface ClusterContent extends ClusterMeta {
  content: string
}

// Internal link structure
export interface InternalLink {
  href: string
  text: string
  description?: string
}

// Navigation structure for content hubs
export interface HubNavigation {
  hub: HubMeta
  clusters: ClusterMeta[]
}

// Get all blog posts
export function getAllBlogPosts(): ContentMeta[] {
  const blogDir = path.join(contentDirectory, 'blog')

  if (!fs.existsSync(blogDir)) {
    return []
  }

  const files = fs.readdirSync(blogDir)
  const posts = files
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
      const slug = file.replace('.mdx', '')
      const fullPath = path.join(blogDir, file)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      return {
        slug,
        title: data.title || slug,
        description: data.description || '',
        date: data.date || new Date().toISOString(),
        author: data.author || 'SEO Backlinks',
        keywords: data.keywords || [],
        readingTime: calculateReadingTime(content),
        image: data.image,
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return posts
}

// Get single blog post
export function getBlogPost(slug: string): ContentItem | null {
  const fullPath = path.join(contentDirectory, 'blog', `${slug}.mdx`)

  if (!fs.existsSync(fullPath)) {
    return null
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  return {
    slug,
    title: data.title || slug,
    description: data.description || '',
    date: data.date || new Date().toISOString(),
    author: data.author || 'SEO Backlinks',
    keywords: data.keywords || [],
    readingTime: calculateReadingTime(content),
    image: data.image,
    content,
  }
}

// Get all guides
export function getAllGuides(): ContentMeta[] {
  const guidesDir = path.join(contentDirectory, 'guides')

  if (!fs.existsSync(guidesDir)) {
    return []
  }

  const files = fs.readdirSync(guidesDir)
  const guides = files
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
      const slug = file.replace('.mdx', '')
      const fullPath = path.join(guidesDir, file)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      return {
        slug,
        title: data.title || slug,
        description: data.description || '',
        date: data.date || new Date().toISOString(),
        author: data.author || 'SEO Backlinks',
        keywords: data.keywords || [],
        readingTime: calculateReadingTime(content),
        image: data.image,
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return guides
}

// Get single guide
export function getGuide(slug: string): ContentItem | null {
  const fullPath = path.join(contentDirectory, 'guides', `${slug}.mdx`)

  if (!fs.existsSync(fullPath)) {
    return null
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  return {
    slug,
    title: data.title || slug,
    description: data.description || '',
    date: data.date || new Date().toISOString(),
    author: data.author || 'SEO Backlinks',
    keywords: data.keywords || [],
    readingTime: calculateReadingTime(content),
    image: data.image,
    content,
  }
}

// Get all glossary terms
export function getAllGlossaryTerms(): ContentMeta[] {
  const glossaryDir = path.join(contentDirectory, 'glossary')

  if (!fs.existsSync(glossaryDir)) {
    return []
  }

  const files = fs.readdirSync(glossaryDir)
  const terms = files
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
      const slug = file.replace('.mdx', '')
      const fullPath = path.join(glossaryDir, file)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      return {
        slug,
        title: data.title || slug,
        description: data.description || '',
        date: data.date || new Date().toISOString(),
        keywords: data.keywords || [],
        readingTime: calculateReadingTime(content),
      }
    })
    .sort((a, b) => a.title.localeCompare(b.title))

  return terms
}

// Get single glossary term
export function getGlossaryTerm(slug: string): ContentItem | null {
  const fullPath = path.join(contentDirectory, 'glossary', `${slug}.mdx`)

  if (!fs.existsSync(fullPath)) {
    return null
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  return {
    slug,
    title: data.title || slug,
    description: data.description || '',
    date: data.date || new Date().toISOString(),
    keywords: data.keywords || [],
    readingTime: calculateReadingTime(content),
    content,
  }
}

// Get related posts for a given post
export function getRelatedPosts(
  currentSlug: string,
  keywords: string[],
  limit: number = 3
): ContentMeta[] {
  const allPosts = getAllBlogPosts()

  return allPosts
    .filter((post) => post.slug !== currentSlug)
    .map((post) => ({
      ...post,
      relevance: post.keywords?.filter((k) => keywords.includes(k)).length || 0,
    }))
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, limit)
}

// Get blog posts by keyword
export function getBlogPostsByKeyword(keyword: string): ContentMeta[] {
  const allPosts = getAllBlogPosts()
  return allPosts.filter((post) =>
    post.keywords?.some((k) => k.toLowerCase() === keyword.toLowerCase())
  )
}

// ============================================
// Hub Content Functions
// ============================================

// Get hub page content
export function getHubContent(hubSlug: string): HubContent | null {
  const hubDir = path.join(contentDirectory, hubSlug)
  const indexPath = path.join(hubDir, '_index.mdx')

  if (!fs.existsSync(indexPath)) {
    return null
  }

  const fileContents = fs.readFileSync(indexPath, 'utf8')
  const { data, content } = matter(fileContents)

  return {
    slug: hubSlug,
    title: data.title || hubSlug,
    description: data.description || '',
    metaTitle: data.metaTitle || data.title || '',
    metaDescription: data.metaDescription || data.description || '',
    primaryKeyword: data.primaryKeyword || '',
    secondaryKeywords: data.secondaryKeywords || [],
    wordCount: content.split(/\s+/).length,
    lastUpdated: data.lastUpdated || data.date || new Date().toISOString(),
    author: data.author || 'SEO Backlinks',
    readingTime: calculateReadingTime(content),
    hub: hubSlug,
    clusterPages: data.clusterPages || [],
    image: data.image,
    content,
  }
}

// Get all cluster pages for a hub
export function getHubClusters(hubSlug: string): ClusterMeta[] {
  const hubDir = path.join(contentDirectory, hubSlug)

  if (!fs.existsSync(hubDir)) {
    return []
  }

  const files = fs.readdirSync(hubDir)
  const clusters = files
    .filter((file) => file.endsWith('.mdx') && file !== '_index.mdx')
    .map((file) => {
      const slug = file.replace('.mdx', '')
      const fullPath = path.join(hubDir, file)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      return {
        slug,
        title: data.title || slug,
        description: data.description || '',
        metaTitle: data.metaTitle || data.title || '',
        metaDescription: data.metaDescription || data.description || '',
        primaryKeyword: data.primaryKeyword || '',
        secondaryKeywords: data.secondaryKeywords || [],
        searchIntent: data.searchIntent || 'informational',
        wordCount: content.split(/\s+/).length,
        lastUpdated: data.lastUpdated || data.date || new Date().toISOString(),
        author: data.author || 'SEO Backlinks',
        readingTime: calculateReadingTime(content),
        parentHub: hubSlug,
        siblingPages: data.siblingPages || [],
        crossHubLinks: data.crossHubLinks || [],
        image: data.image,
      }
    })
    .sort((a, b) => a.title.localeCompare(b.title))

  return clusters
}

// Get single cluster content
export function getClusterContent(hubSlug: string, clusterSlug: string): ClusterContent | null {
  const fullPath = path.join(contentDirectory, hubSlug, `${clusterSlug}.mdx`)

  if (!fs.existsSync(fullPath)) {
    return null
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  return {
    slug: clusterSlug,
    title: data.title || clusterSlug,
    description: data.description || '',
    metaTitle: data.metaTitle || data.title || '',
    metaDescription: data.metaDescription || data.description || '',
    primaryKeyword: data.primaryKeyword || '',
    secondaryKeywords: data.secondaryKeywords || [],
    searchIntent: data.searchIntent || 'informational',
    wordCount: content.split(/\s+/).length,
    lastUpdated: data.lastUpdated || data.date || new Date().toISOString(),
    author: data.author || 'SEO Backlinks',
    readingTime: calculateReadingTime(content),
    parentHub: hubSlug,
    siblingPages: data.siblingPages || [],
    crossHubLinks: data.crossHubLinks || [],
    image: data.image,
    content,
  }
}

// Get full hub navigation structure
export function getHubNavigation(hubSlug: string): HubNavigation | null {
  const hub = getHubContent(hubSlug)
  if (!hub) return null

  const clusters = getHubClusters(hubSlug)

  return {
    hub,
    clusters,
  }
}

// Get all available hubs
export function getAllHubs(): HubMeta[] {
  const hubSlugs = [
    'backlinks',
    'link-building',
    'backlink-quality',
    'backlink-audit',
    'link-building-tactics',
    'digital-pr',
    'outreach',
    'industries',
    'resources',
  ]

  return hubSlugs
    .map((slug) => getHubContent(slug))
    .filter((hub): hub is HubContent => hub !== null)
}

// Get related clusters across hubs
export function getRelatedClusters(
  currentHub: string,
  currentSlug: string,
  keywords: string[],
  limit: number = 3
): ClusterMeta[] {
  const allHubs = getAllHubs()
  const allClusters: (ClusterMeta & { relevance: number })[] = []

  for (const hub of allHubs) {
    const clusters = getHubClusters(hub.slug)
    for (const cluster of clusters) {
      if (cluster.parentHub === currentHub && cluster.slug === currentSlug) {
        continue
      }

      const relevance = cluster.secondaryKeywords?.filter((k) =>
        keywords.some((kw) => k.toLowerCase().includes(kw.toLowerCase()))
      ).length || 0

      allClusters.push({ ...cluster, relevance })
    }
  }

  return allClusters
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, limit)
}

// Generate breadcrumb navigation
export function generateBreadcrumbs(hubSlug: string, clusterSlug?: string): InternalLink[] {
  const breadcrumbs: InternalLink[] = [
    { href: '/', text: 'Home' },
  ]

  const hub = getHubContent(hubSlug)
  if (hub) {
    breadcrumbs.push({
      href: `/${hubSlug}`,
      text: hub.title,
    })
  }

  if (clusterSlug) {
    const cluster = getClusterContent(hubSlug, clusterSlug)
    if (cluster) {
      breadcrumbs.push({
        href: `/${hubSlug}/${clusterSlug}`,
        text: cluster.title,
      })
    }
  }

  return breadcrumbs
}

// Get all pages for sitemap generation
export function getAllContentPages(): { url: string; lastModified: string; priority: number }[] {
  const pages: { url: string; lastModified: string; priority: number }[] = []

  // Add hub pages (high priority)
  const hubs = getAllHubs()
  for (const hub of hubs) {
    pages.push({
      url: `/${hub.slug}`,
      lastModified: hub.lastUpdated,
      priority: 0.9,
    })

    // Add cluster pages
    const clusters = getHubClusters(hub.slug)
    for (const cluster of clusters) {
      pages.push({
        url: `/${hub.slug}/${cluster.slug}`,
        lastModified: cluster.lastUpdated,
        priority: 0.8,
      })
    }
  }

  // Add glossary terms
  const glossaryTerms = getAllGlossaryTerms()
  for (const term of glossaryTerms) {
    pages.push({
      url: `/glossary/${term.slug}`,
      lastModified: term.date,
      priority: 0.6,
    })
  }

  return pages
}
