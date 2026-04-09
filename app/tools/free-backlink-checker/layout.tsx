import { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = {
  ...buildMetadata({
    title: 'Free Backlink Checker - Check Any Website\'s Backlinks Instantly',
    description: 'Check backlinks for any website for free. Enter a domain and instantly get links to check it in Ahrefs, Moz, Semrush, and Google Search Console. No signup required.',
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
