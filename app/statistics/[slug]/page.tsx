import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getHubContent, getAllStatistics, getStatistic, resolveSiblingPages, resolveCrossHubLinks } from '@/lib/content'
import { ClusterPage } from '@/components/content/ClusterPage'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { useMDXComponents } from '@/mdx-components'
import { ArticleSchema, BreadcrumbSchema } from '@/components/seo/JsonLd'

const HUB_SLUG = 'statistics'
const BASE_URL = 'https://backlinkgrid.com'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const statistic = getStatistic(slug)

  if (!statistic) {
    return {
      title: 'Page Not Found',
    }
  }

  const canonicalUrl = `${BASE_URL}/${HUB_SLUG}/${slug}`

  return {
    title: statistic.metaTitle || statistic.title,
    description: statistic.metaDescription || statistic.description,
    keywords: [statistic.primaryKeyword, ...statistic.secondaryKeywords],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: statistic.metaTitle || statistic.title,
      description: statistic.metaDescription || statistic.description,
      type: 'article',
      url: canonicalUrl,
      authors: [statistic.author],
      modifiedTime: statistic.lastUpdated,
      siteName: 'SEO Backlinks Grid',
    },
    twitter: {
      card: 'summary_large_image',
      title: statistic.metaTitle || statistic.title,
      description: statistic.metaDescription || statistic.description,
    },
  }
}

export async function generateStaticParams() {
  const statistics = getAllStatistics()
  return statistics.map((statistic) => ({
    slug: statistic.slug,
  }))
}

export default async function StatisticPage({ params }: PageProps) {
  const { slug } = await params
  const hub = getHubContent(HUB_SLUG)
  const statistic = getStatistic(slug)
  const siblings = getAllStatistics()

  if (!hub || !statistic) {
    notFound()
  }

  // Resolve internal links from metadata
  const siblingPageLinks = statistic.siblingPages
    ? resolveSiblingPages(HUB_SLUG, statistic.siblingPages)
    : []
  const crossHubLinks = statistic.crossHubLinks
    ? resolveCrossHubLinks(statistic.crossHubLinks)
    : []

  const components = useMDXComponents({})
  const canonicalUrl = `${BASE_URL}/${HUB_SLUG}/${slug}`

  return (
    <>
      <ArticleSchema
        title={statistic.title}
        description={statistic.description}
        url={canonicalUrl}
        datePublished={statistic.lastUpdated}
        dateModified={statistic.lastUpdated}
        author={statistic.author}
        image={statistic.image}
        keywords={[statistic.primaryKeyword, ...statistic.secondaryKeywords]}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: BASE_URL },
          { name: hub.title, url: `${BASE_URL}/${HUB_SLUG}` },
          { name: statistic.title, url: canonicalUrl },
        ]}
      />
      <ClusterPage
        cluster={statistic}
        hub={hub}
        siblings={siblings}
        siblingPageLinks={siblingPageLinks}
        crossHubLinks={crossHubLinks}
        content={
          <MDXRemote
            source={statistic.content}
            components={components}
          />
        }
      />
    </>
  )
}
