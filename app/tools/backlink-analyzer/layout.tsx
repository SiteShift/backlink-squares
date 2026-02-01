import { Metadata } from 'next'

const BASE_URL = 'https://backlinkgrid.com'

export const metadata: Metadata = {
  title: 'Backlink Audit Checklist - What to Analyze in Your Link Profile',
  description: 'Free backlink audit checklist tool. Learn what to analyze in referring domains, anchor text distribution, link velocity, and toxic links. Step-by-step guide with red flags to watch for.',
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
  alternates: {
    canonical: `${BASE_URL}/tools/backlink-analyzer`,
  },
  openGraph: {
    title: 'Backlink Audit Checklist Tool',
    description: 'Step-by-step checklist for analyzing your backlink profile. Learn what to look for in referring domains, anchor text, link velocity, and more.',
    type: 'website',
    url: `${BASE_URL}/tools/backlink-analyzer`,
    siteName: 'Backlink Grid',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Backlink Audit Checklist Tool',
    description: 'Step-by-step checklist for analyzing your backlink profile. Learn what to look for in referring domains, anchor text, link velocity, and more.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function BacklinkAnalyzerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
