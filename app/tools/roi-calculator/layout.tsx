import { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = {
  ...buildMetadata({
    title: 'Free Link Building ROI Calculator: Model Campaign Returns',
    description:
      'Model link building ROI using your costs, traffic assumptions and conversion rate. Explore estimated revenue and break-even scenarios with this free calculator.',
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
