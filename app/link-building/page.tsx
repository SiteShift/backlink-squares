import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getHubContent, getHubClusters } from '@/lib/content'
import { HubPage } from '@/components/content/HubPage'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { useMDXComponents } from '@/mdx-components'

const HUB_SLUG = 'link-building'

export async function generateMetadata(): Promise<Metadata> {
  const hub = getHubContent(HUB_SLUG)

  if (!hub) {
    return {
      title: 'Link Building: The Complete Strategy Guide',
    }
  }

  return {
    title: hub.metaTitle || hub.title,
    description: hub.metaDescription || hub.description,
    keywords: [hub.primaryKeyword, ...hub.secondaryKeywords],
    openGraph: {
      title: hub.metaTitle || hub.title,
      description: hub.metaDescription || hub.description,
      type: 'article',
      authors: [hub.author],
      modifiedTime: hub.lastUpdated,
    },
  }
}

export default function LinkBuildingHubPage() {
  const hub = getHubContent(HUB_SLUG)
  const clusters = getHubClusters(HUB_SLUG)

  if (!hub) {
    notFound()
  }

  const components = useMDXComponents({})

  return (
    <HubPage
      hub={hub}
      clusters={clusters}
      content={
        <MDXRemote
          source={hub.content}
          components={components}
        />
      }
    />
  )
}
