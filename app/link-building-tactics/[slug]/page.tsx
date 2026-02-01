import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getHubContent, getHubClusters, getClusterContent, resolveSiblingPages, resolveCrossHubLinks } from '@/lib/content'
import { ClusterPage } from '@/components/content/ClusterPage'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { useMDXComponents } from '@/mdx-components'
import { ArticleSchema, BreadcrumbSchema, FAQSchema } from '@/components/seo/JsonLd'

const HUB_SLUG = 'link-building-tactics'
const BASE_URL = 'https://backlinkgrid.com'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const cluster = getClusterContent(HUB_SLUG, slug)

  if (!cluster) {
    return {
      title: 'Page Not Found',
    }
  }

  const canonicalUrl = `${BASE_URL}/${HUB_SLUG}/${slug}`

  return {
    title: cluster.metaTitle || cluster.title,
    description: cluster.metaDescription || cluster.description,
    keywords: [cluster.primaryKeyword, ...cluster.secondaryKeywords],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: cluster.metaTitle || cluster.title,
      description: cluster.metaDescription || cluster.description,
      type: 'article',
      url: canonicalUrl,
      authors: [cluster.author],
      modifiedTime: cluster.lastUpdated,
      siteName: 'SEO Backlinks Grid',
    },
    twitter: {
      card: 'summary_large_image',
      title: cluster.metaTitle || cluster.title,
      description: cluster.metaDescription || cluster.description,
    },
  }
}

export async function generateStaticParams() {
  const clusters = getHubClusters(HUB_SLUG)
  return clusters.map((cluster) => ({
    slug: cluster.slug,
  }))
}

export default async function LinkBuildingTacticsClusterPage({ params }: PageProps) {
  const { slug } = await params
  const hub = getHubContent(HUB_SLUG)
  const cluster = getClusterContent(HUB_SLUG, slug)
  const siblings = getHubClusters(HUB_SLUG)

  if (!hub || !cluster) {
    notFound()
  }

  // Resolve internal links from metadata
  const siblingPageLinks = cluster.siblingPages
    ? resolveSiblingPages(HUB_SLUG, cluster.siblingPages)
    : []
  const crossHubLinks = cluster.crossHubLinks
    ? resolveCrossHubLinks(cluster.crossHubLinks)
    : []

  const components = useMDXComponents({})
  const canonicalUrl = `${BASE_URL}/${HUB_SLUG}/${slug}`

  return (
    <>
      <ArticleSchema
        title={cluster.title}
        description={cluster.description}
        url={canonicalUrl}
        datePublished={cluster.lastUpdated}
        dateModified={cluster.lastUpdated}
        author={cluster.author}
        image={cluster.image}
        keywords={[cluster.primaryKeyword, ...cluster.secondaryKeywords]}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: BASE_URL },
          { name: hub.title, url: `${BASE_URL}/${HUB_SLUG}` },
          { name: cluster.title, url: canonicalUrl },
        ]}
      />
      {cluster.faqs && cluster.faqs.length > 0 && (
        <FAQSchema questions={cluster.faqs} />
      )}
      <ClusterPage
        cluster={cluster}
        hub={hub}
        siblings={siblings}
        siblingPageLinks={siblingPageLinks}
        crossHubLinks={crossHubLinks}
        content={
          <MDXRemote
            source={cluster.content}
            components={components}
          />
        }
      />
    </>
  )
}
