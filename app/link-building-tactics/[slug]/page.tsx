import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getHubContent, getHubClusters, getClusterContent } from '@/lib/content'
import { ClusterPage } from '@/components/content/ClusterPage'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { useMDXComponents } from '@/mdx-components'

const HUB_SLUG = 'link-building-tactics'

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

  return {
    title: cluster.metaTitle || cluster.title,
    description: cluster.metaDescription || cluster.description,
    keywords: [cluster.primaryKeyword, ...cluster.secondaryKeywords],
    openGraph: {
      title: cluster.metaTitle || cluster.title,
      description: cluster.metaDescription || cluster.description,
      type: 'article',
      authors: [cluster.author],
      modifiedTime: cluster.lastUpdated,
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

  const components = useMDXComponents({})

  return (
    <ClusterPage
      cluster={cluster}
      hub={hub}
      siblings={siblings}
      content={
        <MDXRemote
          source={cluster.content}
          components={components}
        />
      }
    />
  )
}
