import { Metadata } from 'next'

const BASE_URL = 'https://backlinkgrid.com'

export const metadata: Metadata = {
  title: 'SEO & Link Building Guides - In-Depth Resources',
  description:
    'Comprehensive guides on backlinks, link building strategies, and SEO. Learn from our in-depth pillar content.',
  alternates: {
    canonical: `${BASE_URL}/guides`,
  },
  openGraph: {
    title: 'SEO & Link Building Guides | SEO Backlinks Grid',
    description:
      'In-depth guides covering everything you need to know about backlinks and link building.',
  },
}

export default function GuidesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
