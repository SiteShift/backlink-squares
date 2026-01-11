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
