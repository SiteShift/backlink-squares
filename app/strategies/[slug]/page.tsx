import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getHubContent, getAllStrategies, getStrategy, resolveSiblingPages, resolveCrossHubLinks } from '@/lib/content'
import { ClusterPage } from '@/components/content/ClusterPage'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { useMDXComponents } from '@/mdx-components'
import { ArticleSchema, BreadcrumbSchema } from '@/components/seo/JsonLd'

const HUB_SLUG = 'strategies'
const BASE_URL = 'https://backlinkgrid.com'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const strategy = getStrategy(slug)

  if (!strategy) {
    return {
      title: 'Page Not Found',
    }
  }

  const canonicalUrl = `${BASE_URL}/${HUB_SLUG}/${slug}`

  return {
    title: strategy.metaTitle || strategy.title,
    description: strategy.metaDescription || strategy.description,
    keywords: [strategy.primaryKeyword, ...strategy.secondaryKeywords],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: strategy.metaTitle || strategy.title,
      description: strategy.metaDescription || strategy.description,
      type: 'article',
      url: canonicalUrl,
      authors: [strategy.author],
      modifiedTime: strategy.lastUpdated,
      siteName: 'SEO Backlinks Grid',
    },
    twitter: {
      card: 'summary_large_image',
      title: strategy.metaTitle || strategy.title,
      description: strategy.metaDescription || strategy.description,
    },
  }
}

export async function generateStaticParams() {
  const strategies = getAllStrategies()
  return strategies.map((strategy) => ({
    slug: strategy.slug,
  }))
}

export default async function StrategyPage({ params }: PageProps) {
  const { slug } = await params
  const hub = getHubContent(HUB_SLUG)
  const strategy = getStrategy(slug)
  const siblings = getAllStrategies()

  if (!hub || !strategy) {
    notFound()
  }

  // Resolve internal links from metadata
  const siblingPageLinks = strategy.siblingPages
    ? resolveSiblingPages(HUB_SLUG, strategy.siblingPages)
    : []
  const crossHubLinks = strategy.crossHubLinks
    ? resolveCrossHubLinks(strategy.crossHubLinks)
    : []

  const components = useMDXComponents({})
  const canonicalUrl = `${BASE_URL}/${HUB_SLUG}/${slug}`

  return (
    <>
      <ArticleSchema
        title={strategy.title}
        description={strategy.description}
        url={canonicalUrl}
        datePublished={strategy.lastUpdated}
        dateModified={strategy.lastUpdated}
        author={strategy.author}
        image={strategy.image}
        keywords={[strategy.primaryKeyword, ...strategy.secondaryKeywords]}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: BASE_URL },
          { name: hub.title, url: `${BASE_URL}/${HUB_SLUG}` },
          { name: strategy.title, url: canonicalUrl },
        ]}
      />
      <ClusterPage
        cluster={strategy}
        hub={hub}
        siblings={siblings}
        siblingPageLinks={siblingPageLinks}
        crossHubLinks={crossHubLinks}
        content={
          <MDXRemote
            source={strategy.content}
            components={components}
          />
        }
      />
    </>
  )
}
