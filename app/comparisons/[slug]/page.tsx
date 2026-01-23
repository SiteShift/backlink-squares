import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getHubContent, getAllComparisons, getComparison, resolveSiblingPages, resolveCrossHubLinks } from '@/lib/content'
import { ClusterPage } from '@/components/content/ClusterPage'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { useMDXComponents } from '@/mdx-components'
import { ArticleSchema, BreadcrumbSchema } from '@/components/seo/JsonLd'

const HUB_SLUG = 'comparisons'
const BASE_URL = 'https://backlinkgrid.com'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const comparison = getComparison(slug)

  if (!comparison) {
    return {
      title: 'Page Not Found',
    }
  }

  const canonicalUrl = `${BASE_URL}/${HUB_SLUG}/${slug}`

  return {
    title: comparison.metaTitle || comparison.title,
    description: comparison.metaDescription || comparison.description,
    keywords: [comparison.primaryKeyword, ...comparison.secondaryKeywords],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: comparison.metaTitle || comparison.title,
      description: comparison.metaDescription || comparison.description,
      type: 'article',
      url: canonicalUrl,
      authors: [comparison.author],
      modifiedTime: comparison.lastUpdated,
      siteName: 'SEO Backlinks Grid',
    },
    twitter: {
      card: 'summary_large_image',
      title: comparison.metaTitle || comparison.title,
      description: comparison.metaDescription || comparison.description,
    },
  }
}

export async function generateStaticParams() {
  const comparisons = getAllComparisons()
  return comparisons.map((comparison) => ({
    slug: comparison.slug,
  }))
}

export default async function ComparisonPage({ params }: PageProps) {
  const { slug } = await params
  const hub = getHubContent(HUB_SLUG)
  const comparison = getComparison(slug)
  const siblings = getAllComparisons()

  if (!hub || !comparison) {
    notFound()
  }

  // Resolve internal links from metadata
  const siblingPageLinks = comparison.siblingPages
    ? resolveSiblingPages(HUB_SLUG, comparison.siblingPages)
    : []
  const crossHubLinks = comparison.crossHubLinks
    ? resolveCrossHubLinks(comparison.crossHubLinks)
    : []

  const components = useMDXComponents({})
  const canonicalUrl = `${BASE_URL}/${HUB_SLUG}/${slug}`

  return (
    <>
      <ArticleSchema
        title={comparison.title}
        description={comparison.description}
        url={canonicalUrl}
        datePublished={comparison.lastUpdated}
        dateModified={comparison.lastUpdated}
        author={comparison.author}
        image={comparison.image}
        keywords={[comparison.primaryKeyword, ...comparison.secondaryKeywords]}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: BASE_URL },
          { name: hub.title, url: `${BASE_URL}/${HUB_SLUG}` },
          { name: comparison.title, url: canonicalUrl },
        ]}
      />
      <ClusterPage
        cluster={comparison}
        hub={hub}
        siblings={siblings}
        siblingPageLinks={siblingPageLinks}
        crossHubLinks={crossHubLinks}
        content={
          <MDXRemote
            source={comparison.content}
            components={components}
          />
        }
      />
    </>
  )
}
