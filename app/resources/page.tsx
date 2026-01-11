import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getHubContent, getHubClusters, getRelatedHubs } from '@/lib/content'
import { HubPage } from '@/components/content/HubPage'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { useMDXComponents } from '@/mdx-components'
import { ArticleSchema, BreadcrumbSchema } from '@/components/seo/JsonLd'

const HUB_SLUG = 'resources'
const BASE_URL = 'https://seobacklinks.dev'

export async function generateMetadata(): Promise<Metadata> {
  const hub = getHubContent(HUB_SLUG)

  if (!hub) {
    return {
      title: 'Link Building Resources: Templates, Checklists & Tools',
    }
  }

  const canonicalUrl = `${BASE_URL}/${HUB_SLUG}`

  return {
    title: hub.metaTitle || hub.title,
    description: hub.metaDescription || hub.description,
    keywords: [hub.primaryKeyword, ...hub.secondaryKeywords],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: hub.metaTitle || hub.title,
      description: hub.metaDescription || hub.description,
      type: 'article',
      url: canonicalUrl,
      authors: [hub.author],
      modifiedTime: hub.lastUpdated,
      siteName: 'SEO Backlinks Grid',
    },
    twitter: {
      card: 'summary_large_image',
      title: hub.metaTitle || hub.title,
      description: hub.metaDescription || hub.description,
    },
  }
}

export default function ResourcesHubPage() {
  const hub = getHubContent(HUB_SLUG)
  const clusters = getHubClusters(HUB_SLUG)
  const relatedHubs = getRelatedHubs(HUB_SLUG)

  if (!hub) {
    notFound()
  }

  const components = useMDXComponents({})
  const canonicalUrl = `${BASE_URL}/${HUB_SLUG}`

  return (
    <>
      <ArticleSchema
        title={hub.title}
        description={hub.description}
        url={canonicalUrl}
        datePublished={hub.lastUpdated}
        dateModified={hub.lastUpdated}
        author={hub.author}
        image={hub.image}
        keywords={[hub.primaryKeyword, ...hub.secondaryKeywords]}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: BASE_URL },
          { name: hub.title, url: canonicalUrl },
        ]}
      />
      <HubPage
        hub={hub}
        clusters={clusters}
        relatedHubs={relatedHubs}
        content={
          <MDXRemote
            source={hub.content}
            components={components}
          />
        }
      />
    </>
  )
}
