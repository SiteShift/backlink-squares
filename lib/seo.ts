import fs from 'fs'
import path from 'path'
import type { Metadata } from 'next'

export const BASE_URL = 'https://backlinkgrid.com'
export const DEFAULT_OG_IMAGE = '/og-image.png'
export const SITE_NAME = 'BacklinkGrid'

function normalizePathname(pathname: string) {
  if (!pathname || pathname === '/') {
    return '/'
  }

  return pathname.startsWith('/') ? pathname : `/${pathname}`
}

function publicAssetExists(assetPath: string) {
  const normalized = assetPath.replace(/^\/+/, '')
  if (!normalized) {
    return false
  }

  return fs.existsSync(path.join(process.cwd(), 'public', normalized))
}

export function absoluteUrl(pathname: string) {
  const normalized = normalizePathname(pathname)
  return normalized === '/' ? BASE_URL : `${BASE_URL}${normalized}`
}

export function cleanKeywords(keywords: Array<string | null | undefined> = []) {
  return keywords
    .map((keyword) => keyword?.trim())
    .filter((keyword): keyword is string => Boolean(keyword))
}

export function resolveSeoImage(image?: string | null) {
  if (!image) {
    return DEFAULT_OG_IMAGE
  }

  if (/^https?:\/\//i.test(image)) {
    return image
  }

  return publicAssetExists(image) ? normalizePathname(image) : DEFAULT_OG_IMAGE
}

export function resolveSchemaImage(image?: string | null) {
  const resolvedImage = resolveSeoImage(image)
  return /^https?:\/\//i.test(resolvedImage) ? resolvedImage : absoluteUrl(resolvedImage)
}

interface BuildMetadataOptions {
  title: string
  description: string
  canonicalUrl: string
  keywords?: Array<string | null | undefined>
  type?: 'article' | 'website'
  publishedTime?: string
  modifiedTime?: string
  authors?: string[]
  image?: string | null
  robots?: Metadata['robots']
}

export function buildMetadata({
  title,
  description,
  canonicalUrl,
  keywords = [],
  type = 'article',
  publishedTime,
  modifiedTime,
  authors = [],
  image,
  robots,
}: BuildMetadataOptions): Metadata {
  const resolvedImage = resolveSeoImage(image)
  const cleanedKeywords = cleanKeywords(keywords)

  return {
    title,
    description,
    ...(cleanedKeywords.length > 0 ? { keywords: cleanedKeywords } : {}),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      type,
      url: canonicalUrl,
      siteName: SITE_NAME,
      images: [
        {
          url: resolvedImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
      ...(authors.length > 0 ? { authors } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [resolvedImage],
    },
    ...(robots ? { robots } : {}),
  }
}

export function pickSeoTitle<T extends { title: string; metaTitle?: string | null }>(content: T) {
  return content.metaTitle?.trim() || content.title
}

export function pickSeoDescription<
  T extends { description: string; metaDescription?: string | null }
>(content: T) {
  return content.metaDescription?.trim() || content.description
}

interface BuildArticlePageMetadataOptions {
  pathname: string
  title: string
  description: string
  metaTitle?: string | null
  metaDescription?: string | null
  primaryKeyword?: string | null
  secondaryKeywords?: Array<string | null | undefined>
  keywords?: Array<string | null | undefined>
  image?: string | null
  publishedTime?: string
  modifiedTime?: string
  authors?: string[]
  robots?: Metadata['robots']
  type?: 'article' | 'website'
}

export function buildArticlePageMetadata({
  pathname,
  title,
  description,
  metaTitle,
  metaDescription,
  primaryKeyword,
  secondaryKeywords = [],
  keywords = [],
  image,
  publishedTime,
  modifiedTime,
  authors = [],
  robots,
  type = 'article',
}: BuildArticlePageMetadataOptions): Metadata {
  return buildMetadata({
    title: metaTitle?.trim() || title,
    description: metaDescription?.trim() || description,
    canonicalUrl: absoluteUrl(pathname),
    keywords: [primaryKeyword, ...secondaryKeywords, ...keywords],
    type,
    publishedTime,
    modifiedTime,
    authors,
    image,
    robots,
  })
}
