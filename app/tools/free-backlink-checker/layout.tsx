import { Metadata } from 'next'

const BASE_URL = 'https://backlinkgrid.com'

export const metadata: Metadata = {
  title: 'Free Backlink Checker - Check Any Website\'s Backlinks Instantly',
  description: 'Check backlinks for any website for free. Enter a domain and instantly get links to check it in Ahrefs, Moz, Semrush, and Google Search Console. No signup required.',
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
  alternates: {
    canonical: `${BASE_URL}/tools/free-backlink-checker`,
  },
  openGraph: {
    title: 'Free Backlink Checker - Check Any Website\'s Backlinks',
    description: 'Check backlinks for any website for free. Enter a domain and instantly access backlink data from the top SEO tools.',
    type: 'website',
    url: `${BASE_URL}/tools/free-backlink-checker`,
    siteName: 'Backlink Grid',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Backlink Checker Tool',
    description: 'Check backlinks for any website for free. Enter a domain and instantly access backlink data from the top SEO tools.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function FreeBacklinkCheckerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
