import { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = {
  ...buildMetadata({
    title: 'Backlink Audit Checklist - What to Analyze in Your Link Profile',
    description: 'Free backlink audit checklist tool. Learn what to analyze in referring domains, anchor text distribution, link velocity, and toxic links. Step-by-step guide with red flags to watch for.',
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
