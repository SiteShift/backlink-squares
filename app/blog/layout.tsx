import { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = {
  ...buildMetadata({
    title: 'SEO & Link Building Blog - Expert Guides & Tips',
    description:
      'Learn about backlinks, link building strategies, and SEO best practices. Expert guides and actionable tips to grow your organic traffic.',
    canonicalUrl: 'https://backlinkgrid.com/blog',
    type: 'website',
  }),
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
