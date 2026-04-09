import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { ClusterPage } from '@/components/content/ClusterPage'
import { HubPage } from '@/components/content/HubPage'
import { ArticleSchema, BreadcrumbSchema, FAQSchema } from '@/components/seo/JsonLd'
import {
  getClusterContent,
  getHubClusters,
  getHubContent,
  getRelatedHubs,
  resolveCrossHubLinks,
  resolveSiblingPages,
} from '@/lib/content'
import {
  absoluteUrl,
  buildArticlePageMetadata,
  pickSeoDescription,
  resolveSchemaImage,
} from '@/lib/seo'
import { useMDXComponents } from '@/mdx-components'

export function generateHubPageMetadata(hubSlug: string, fallbackTitle: string): Metadata {
  const hub = getHubContent(hubSlug)

  if (!hub) {
    return { title: fallbackTitle }
  }

  return buildArticlePageMetadata({
    pathname: `/${hubSlug}`,
    title: hub.title,
    description: hub.description,
    metaTitle: hub.metaTitle,
    metaDescription: hub.metaDescription,
    primaryKeyword: hub.primaryKeyword,
    secondaryKeywords: hub.secondaryKeywords,
    image: hub.image,
    modifiedTime: hub.lastUpdated,
    authors: [hub.author],
  })
}

export function generateClusterPageMetadata(
  hubSlug: string,
  slug: string,
  fallbackTitle = 'Page Not Found'
): Metadata {
  const cluster = getClusterContent(hubSlug, slug)

  if (!cluster) {
    return { title: fallbackTitle }
  }

  return buildArticlePageMetadata({
    pathname: `/${hubSlug}/${slug}`,
    title: cluster.title,
    description: cluster.description,
    metaTitle: cluster.metaTitle,
    metaDescription: cluster.metaDescription,
    primaryKeyword: cluster.primaryKeyword,
    secondaryKeywords: cluster.secondaryKeywords,
    image: cluster.image,
    modifiedTime: cluster.lastUpdated,
    authors: [cluster.author],
  })
}

export function HubRoutePage({ hubSlug }: { hubSlug: string }) {
  const hub = getHubContent(hubSlug)
  const clusters = getHubClusters(hubSlug)
  const relatedHubs = getRelatedHubs(hubSlug)

  if (!hub) {
    notFound()
  }

  const canonicalUrl = absoluteUrl(`/${hubSlug}`)

  return (
    <>
      <ArticleSchema
        title={hub.title}
        description={pickSeoDescription(hub)}
        url={canonicalUrl}
        datePublished={hub.lastUpdated}
        dateModified={hub.lastUpdated}
        author={hub.author}
        image={resolveSchemaImage(hub.image)}
        keywords={[hub.primaryKeyword, ...hub.secondaryKeywords]}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: absoluteUrl('/') },
          { name: hub.title, url: canonicalUrl },
        ]}
      />
      {hub.faqs && hub.faqs.length > 0 && <FAQSchema questions={hub.faqs} />}
      <HubPage
        hub={hub}
        clusters={clusters}
        relatedHubs={relatedHubs}
        content={<MDXRemote source={hub.content} components={useMDXComponents({})} />}
      />
    </>
  )
}

export function ClusterRoutePage({
  hubSlug,
  slug,
}: {
  hubSlug: string
  slug: string
}) {
  const hub = getHubContent(hubSlug)
  const cluster = getClusterContent(hubSlug, slug)
  const siblings = getHubClusters(hubSlug)

  if (!hub || !cluster) {
    notFound()
  }

  const siblingPageLinks = cluster.siblingPages
    ? resolveSiblingPages(hubSlug, cluster.siblingPages)
    : []
  const crossHubLinks = cluster.crossHubLinks
    ? resolveCrossHubLinks(cluster.crossHubLinks)
    : []
  const canonicalUrl = absoluteUrl(`/${hubSlug}/${slug}`)

  return (
    <>
      <ArticleSchema
        title={cluster.title}
        description={pickSeoDescription(cluster)}
        url={canonicalUrl}
        datePublished={cluster.lastUpdated}
        dateModified={cluster.lastUpdated}
        author={cluster.author}
        image={resolveSchemaImage(cluster.image)}
        keywords={[cluster.primaryKeyword, ...cluster.secondaryKeywords]}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: absoluteUrl('/') },
          { name: hub.title, url: absoluteUrl(`/${hubSlug}`) },
          { name: cluster.title, url: canonicalUrl },
        ]}
      />
      {cluster.faqs && cluster.faqs.length > 0 && <FAQSchema questions={cluster.faqs} />}
      <ClusterPage
        cluster={cluster}
        hub={hub}
        siblings={siblings}
        siblingPageLinks={siblingPageLinks}
        crossHubLinks={crossHubLinks}
        content={<MDXRemote source={cluster.content} components={useMDXComponents({})} />}
      />
    </>
  )
}
