import { Metadata } from 'next'

const BASE_URL = 'https://backlinkgrid.com'

export const metadata: Metadata = {
  title: 'SEO & Link Building Blog - Expert Guides & Tips',
  description:
    'Learn about backlinks, link building strategies, and SEO best practices. Expert guides and actionable tips to grow your organic traffic.',
  alternates: {
    canonical: `${BASE_URL}/blog`,
  },
  openGraph: {
    title: 'SEO & Link Building Blog | SEO Backlinks Grid',
    description:
      'Expert guides, strategies, and tips for building quality backlinks and improving your SEO.',
  },
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
