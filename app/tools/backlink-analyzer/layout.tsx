import { Metadata } from 'next'

const BASE_URL = 'https://backlinkgrid.com'

export const metadata: Metadata = {
  title: 'Free Backlink Analyzer Tool - Check Your Backlink Profile | Backlink Grid',
  description: 'Analyze your backlink profile with our free educational tool. Learn what to look for in referring domains, anchor text distribution, link velocity, and toxic links. Includes recommendations by profile size.',
  keywords: [
    'backlink analyzer',
    'backlink checker',
    'analyze backlinks',
    'backlink profile analysis',
    'backlink audit tool',
    'check backlinks',
    'backlink analysis',
    'referring domains checker',
    'anchor text analyzer',
    'toxic link checker',
    'free backlink tool',
  ],
  alternates: {
    canonical: `${BASE_URL}/tools/backlink-analyzer`,
  },
  openGraph: {
    title: 'Free Backlink Profile Analyzer Tool',
    description: 'Learn exactly what to analyze in your backlink profile. Comprehensive checklist for referring domains, anchor text, link velocity, and more.',
    type: 'website',
    url: `${BASE_URL}/tools/backlink-analyzer`,
    siteName: 'Backlink Grid',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Backlink Profile Analyzer Tool',
    description: 'Learn exactly what to analyze in your backlink profile. Comprehensive checklist for referring domains, anchor text, link velocity, and more.',
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
