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
  authorTitle?: string
  keywords?: string[]
  readingTime: string
  image?: string
  metaTitle?: string
  metaDescription?: string
  faqs?: FAQ[]
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
  authorTitle?: string
  authorBio?: string
  readingTime: string
  hub: string
  clusterPages?: string[]
  image?: string
}

export interface HubContent extends HubMeta {
  content: string
}

// FAQ type for structured FAQ content
export interface FAQ {
  question: string
  answer: string
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
  authorTitle?: string
  readingTime: string
  parentHub: string
  siblingPages?: string[]
  crossHubLinks?: string[]
  image?: string
  faqs?: FAQ[]
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
    authorTitle: data.authorTitle,
    keywords: data.keywords || [],
    readingTime: calculateReadingTime(content),
    image: data.image,
    metaTitle: data.metaTitle,
    metaDescription: data.metaDescription,
    faqs: data.faqs || [],
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

// Glossary term type
export interface GlossaryTermMeta {
  slug: string
  title: string
  description: string
  metaTitle?: string
  metaDescription?: string
  primaryKeyword?: string
  secondaryKeywords?: string[]
  lastUpdated: string
  author: string
  readingTime: string
  relatedTerms: string[]
}

export interface GlossaryTermContent extends GlossaryTermMeta {
  content: string
}

// Get all glossary terms
export function getAllGlossaryTerms(): GlossaryTermMeta[] {
  const glossaryDir = path.join(contentDirectory, 'glossary')

  if (!fs.existsSync(glossaryDir)) {
    return []
  }

  const files = fs.readdirSync(glossaryDir)
  const terms = files
    .filter((file) => file.endsWith('.mdx') && file !== '_index.mdx')
    .map((file) => {
      const slug = file.replace('.mdx', '')
      const fullPath = path.join(glossaryDir, file)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      // Extract clean term name from title (e.g., "What Is a Backlink? Complete Definition & Guide" -> "Backlink")
      let termName = data.title || slug
      // Try to extract just the term name if title is a full sentence
      const match = termName.match(/^What (?:Is|Are) (?:a |an |the )?(.+?)[\?:]/i)
      if (match) {
        termName = match[1].trim()
      }

      return {
        slug,
        title: termName,
        description: data.description || '',
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        primaryKeyword: data.primaryKeyword,
        secondaryKeywords: data.secondaryKeywords || [],
        lastUpdated: data.lastUpdated || data.date || new Date().toISOString(),
        author: data.author || 'SEO Backlinks Team',
        readingTime: calculateReadingTime(content),
        relatedTerms: data.relatedTerms || [],
      }
    })
    .sort((a, b) => a.title.localeCompare(b.title))

  return terms
}

// Get single glossary term
export function getGlossaryTerm(slug: string): GlossaryTermContent | null {
  const fullPath = path.join(contentDirectory, 'glossary', `${slug}.mdx`)

  if (!fs.existsSync(fullPath)) {
    return null
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  // Extract clean term name from title
  let termName = data.title || slug
  const match = termName.match(/^What (?:Is|Are) (?:a |an |the )?(.+?)[\?:]/i)
  if (match) {
    termName = match[1].trim()
  }

  return {
    slug,
    title: termName,
    description: data.description || '',
    metaTitle: data.metaTitle,
    metaDescription: data.metaDescription,
    primaryKeyword: data.primaryKeyword,
    secondaryKeywords: data.secondaryKeywords || [],
    lastUpdated: data.lastUpdated || data.date || new Date().toISOString(),
    author: data.author || 'SEO Backlinks Team',
    readingTime: calculateReadingTime(content),
    relatedTerms: data.relatedTerms || [],
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
    authorTitle: data.authorTitle,
    authorBio: data.authorBio,
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
    authorTitle: data.authorTitle,
    readingTime: calculateReadingTime(content),
    parentHub: hubSlug,
    siblingPages: data.siblingPages || [],
    crossHubLinks: data.crossHubLinks || [],
    image: data.image,
    faqs: data.faqs || [],
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
    'strategies',
    'comparisons',
    'statistics',
  ]

  return hubSlugs
    .map((slug) => getHubContent(slug))
    .filter((hub): hub is HubContent => hub !== null)
}

// Get related hubs (excluding current hub)
export function getRelatedHubs(currentHubSlug: string, limit: number = 4): HubMeta[] {
  return getAllHubs()
    .filter((hub) => hub.slug !== currentHubSlug)
    .slice(0, limit)
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

// Resolved link type for internal linking
export interface ResolvedLink {
  href: string
  title: string
  description?: string
}

// Resolve sibling page slugs to full link objects
export function resolveSiblingPages(hubSlug: string, siblingPageSlugs: string[]): ResolvedLink[] {
  const clusters = getHubClusters(hubSlug)
  const results: ResolvedLink[] = []

  for (const slug of siblingPageSlugs) {
    const cluster = clusters.find((c) => c.slug === slug)
    if (cluster) {
      results.push({
        href: `/${hubSlug}/${cluster.slug}`,
        title: cluster.title,
        description: cluster.description,
      })
    }
  }

  return results
}

// Resolve cross-hub link slugs to full link objects
// crossHubLinks can be hub slugs like "link-building" or full paths like "link-building/how-to-start"
export function resolveCrossHubLinks(crossHubLinkSlugs: string[]): ResolvedLink[] {
  const results: ResolvedLink[] = []

  for (const slug of crossHubLinkSlugs) {
    // Check if it's a hub or a cluster path
    if (slug.includes('/')) {
      // It's a cluster path like "link-building/how-to-start"
      const [hubSlug, clusterSlug] = slug.split('/')
      const cluster = getClusterContent(hubSlug, clusterSlug)
      if (cluster) {
        results.push({
          href: `/${hubSlug}/${clusterSlug}`,
          title: cluster.title,
          description: cluster.description,
        })
      }
    } else {
      // It's a hub slug like "link-building"
      const hub = getHubContent(slug)
      if (hub) {
        results.push({
          href: `/${slug}`,
          title: hub.title,
          description: hub.description,
        })
      }
    }
  }

  return results
}

// Resolve related glossary term slugs to full link objects
export function resolveRelatedTerms(termSlugs: string[]): ResolvedLink[] {
  const results: ResolvedLink[] = []

  for (const slug of termSlugs) {
    const term = getGlossaryTerm(slug)
    if (term) {
      results.push({
        href: `/glossary/${slug}`,
        title: term.title,
        description: term.description,
      })
    }
  }

  return results
}

// Resolve cluster page slugs from hub frontmatter to full link objects
export function resolveClusterPages(hubSlug: string, clusterPageSlugs: string[]): ResolvedLink[] {
  const clusters = getHubClusters(hubSlug)
  const results: ResolvedLink[] = []

  for (const slug of clusterPageSlugs) {
    const cluster = clusters.find((c) => c.slug === slug)
    if (cluster) {
      results.push({
        href: `/${hubSlug}/${cluster.slug}`,
        title: cluster.title,
        description: cluster.description,
      })
    }
  }

  return results
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
      lastModified: term.lastUpdated,
      priority: 0.6,
    })
  }

  // Add strategies
  const strategies = getAllStrategies()
  for (const strategy of strategies) {
    pages.push({
      url: `/strategies/${strategy.slug}`,
      lastModified: strategy.lastUpdated,
      priority: 0.7,
    })
  }

  // Add comparisons
  const comparisons = getAllComparisons()
  for (const comparison of comparisons) {
    pages.push({
      url: `/comparisons/${comparison.slug}`,
      lastModified: comparison.lastUpdated,
      priority: 0.7,
    })
  }

  // Add statistics
  const statistics = getAllStatistics()
  for (const statistic of statistics) {
    pages.push({
      url: `/statistics/${statistic.slug}`,
      lastModified: statistic.lastUpdated,
      priority: 0.7,
    })
  }

  return pages
}

// ============================================
// Strategy Content Functions
// ============================================

// Get all strategies
export function getAllStrategies(): ClusterMeta[] {
  const strategiesDir = path.join(contentDirectory, 'strategies')

  if (!fs.existsSync(strategiesDir)) {
    return []
  }

  const files = fs.readdirSync(strategiesDir)
  const strategies = files
    .filter((file) => file.endsWith('.mdx') && file !== '_index.mdx')
    .map((file) => {
      const slug = file.replace('.mdx', '')
      const fullPath = path.join(strategiesDir, file)
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
        author: data.author || 'SEO Backlinks Team',
        readingTime: calculateReadingTime(content),
        parentHub: 'strategies',
        siblingPages: data.siblingPages || [],
        crossHubLinks: data.crossHubLinks || [],
        image: data.image,
      }
    })
    .sort((a, b) => a.title.localeCompare(b.title))

  return strategies
}

// Get single strategy
export function getStrategy(slug: string): ClusterContent | null {
  const fullPath = path.join(contentDirectory, 'strategies', `${slug}.mdx`)

  if (!fs.existsSync(fullPath)) {
    return null
  }

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
    author: data.author || 'SEO Backlinks Team',
    readingTime: calculateReadingTime(content),
    parentHub: 'strategies',
    siblingPages: data.siblingPages || [],
    crossHubLinks: data.crossHubLinks || [],
    image: data.image,
    content,
  }
}

// ============================================
// Comparison Content Functions
// ============================================

// Get all comparisons
export function getAllComparisons(): ClusterMeta[] {
  const comparisonsDir = path.join(contentDirectory, 'comparisons')

  if (!fs.existsSync(comparisonsDir)) {
    return []
  }

  const files = fs.readdirSync(comparisonsDir)
  const comparisons = files
    .filter((file) => file.endsWith('.mdx') && file !== '_index.mdx')
    .map((file) => {
      const slug = file.replace('.mdx', '')
      const fullPath = path.join(comparisonsDir, file)
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
        searchIntent: data.searchIntent || 'commercial investigation',
        wordCount: content.split(/\s+/).length,
        lastUpdated: data.lastUpdated || data.date || new Date().toISOString(),
        author: data.author || 'SEO Backlinks Team',
        readingTime: calculateReadingTime(content),
        parentHub: 'comparisons',
        siblingPages: data.siblingPages || [],
        crossHubLinks: data.crossHubLinks || [],
        image: data.image,
      }
    })
    .sort((a, b) => a.title.localeCompare(b.title))

  return comparisons
}

// Get single comparison
export function getComparison(slug: string): ClusterContent | null {
  const fullPath = path.join(contentDirectory, 'comparisons', `${slug}.mdx`)

  if (!fs.existsSync(fullPath)) {
    return null
  }

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
    searchIntent: data.searchIntent || 'commercial investigation',
    wordCount: content.split(/\s+/).length,
    lastUpdated: data.lastUpdated || data.date || new Date().toISOString(),
    author: data.author || 'SEO Backlinks Team',
    readingTime: calculateReadingTime(content),
    parentHub: 'comparisons',
    siblingPages: data.siblingPages || [],
    crossHubLinks: data.crossHubLinks || [],
    image: data.image,
    content,
  }
}

// ============================================
// Statistics Content Functions
// ============================================

// Get all statistics
export function getAllStatistics(): ClusterMeta[] {
  const statisticsDir = path.join(contentDirectory, 'statistics')

  if (!fs.existsSync(statisticsDir)) {
    return []
  }

  const files = fs.readdirSync(statisticsDir)
  const statistics = files
    .filter((file) => file.endsWith('.mdx') && file !== '_index.mdx')
    .map((file) => {
      const slug = file.replace('.mdx', '')
      const fullPath = path.join(statisticsDir, file)
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
        author: data.author || 'SEO Backlinks Team',
        readingTime: calculateReadingTime(content),
        parentHub: 'statistics',
        siblingPages: data.siblingPages || [],
        crossHubLinks: data.crossHubLinks || [],
        image: data.image,
      }
    })
    .sort((a, b) => a.title.localeCompare(b.title))

  return statistics
}

// Get single statistic
export function getStatistic(slug: string): ClusterContent | null {
  const fullPath = path.join(contentDirectory, 'statistics', `${slug}.mdx`)

  if (!fs.existsSync(fullPath)) {
    return null
  }

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
    author: data.author || 'SEO Backlinks Team',
    readingTime: calculateReadingTime(content),
    parentHub: 'statistics',
    siblingPages: data.siblingPages || [],
    crossHubLinks: data.crossHubLinks || [],
    image: data.image,
    content,
  }
}
