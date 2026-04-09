import { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = {
  ...buildMetadata({
    title: 'SEO & Link Building Guides - In-Depth Resources',
    description:
      'Comprehensive guides on backlinks, link building strategies, and SEO. Learn from our in-depth pillar content.',
    canonicalUrl: 'https://backlinkgrid.com/guides',
    type: 'website',
  }),
}

export default function GuidesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
