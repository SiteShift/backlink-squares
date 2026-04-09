import { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = {
  ...buildMetadata({
    title: 'Link Building ROI Calculator - Calculate Your Backlink Investment Returns',
    description:
      'Free link building ROI calculator. Estimate the return on investment for your backlink campaigns. Calculate projected traffic, conversions, and revenue from your link building efforts.',
    canonicalUrl: 'https://backlinkgrid.com/tools/roi-calculator',
    keywords: [
      'link building ROI calculator',
      'backlink ROI',
      'SEO ROI calculator',
      'link building investment',
      'backlink calculator',
      'SEO investment calculator',
      'link building budget calculator',
    ],
    type: 'website',
  }),
}

export default function ROICalculatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
