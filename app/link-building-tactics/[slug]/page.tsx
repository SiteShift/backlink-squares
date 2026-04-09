import { Metadata } from 'next'
import { getHubClusters } from '@/lib/content'
import { ClusterRoutePage, generateClusterPageMetadata } from '@/lib/content-routes'

const HUB_SLUG = 'link-building-tactics'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  return generateClusterPageMetadata(HUB_SLUG, slug)
}

export async function generateStaticParams() {
  return getHubClusters(HUB_SLUG).map((cluster) => ({
    slug: cluster.slug,
  }))
}

export default async function TacticsClusterPage({ params }: PageProps) {
  const { slug } = await params
  return <ClusterRoutePage hubSlug={HUB_SLUG} slug={slug} />
}
