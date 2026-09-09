import { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = {
  ...buildMetadata({
    title: 'Free Backlink Audit Checklist: Review Your Link Profile',
    description: 'Use a free backlink audit checklist to review referring domains, anchors and source quality. Work through the checks alongside your own backlink data.',
    canonicalUrl: 'https://backlinkgrid.com/tools/backlink-analyzer',
    keywords: [
      'backlink audit checklist',
      'backlink analysis checklist',
      'backlink profile audit',
      'link profile analysis',
      'backlink audit guide',
      'what to check in backlinks',
      'backlink quality checklist',
      'link audit tool',
      'anchor text analysis',
      'toxic link checklist',
    ],
    type: 'website',
  }),
}

export default function BacklinkAnalyzerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
