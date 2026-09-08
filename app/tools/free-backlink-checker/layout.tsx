import { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = {
  ...buildMetadata({
    title: 'Free Backlink Checker: Compare Tools for Your Domain',
    description: 'Open your domain in backlink research tools, compare data limits and check known placements directly. Free launcher; provider access requirements may apply.',
    canonicalUrl: 'https://backlinkgrid.com/tools/free-backlink-checker',
    keywords: [
      'free backlink checker',
      'check backlinks free',
      'backlink checker tool',
      'free backlink checker tool',
      'check website backlinks',
      'backlink checker online',
      'free seo backlink checker',
      'check backlinks for website',
      'backlink analysis free',
    ],
    type: 'website',
  }),
}

export default function FreeBacklinkCheckerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
