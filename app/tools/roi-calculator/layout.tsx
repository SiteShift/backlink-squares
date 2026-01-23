import { Metadata } from 'next'

const BASE_URL = 'https://backlinkgrid.com'

export const metadata: Metadata = {
  title: 'Link Building ROI Calculator - Calculate Your Backlink Investment Returns',
  description:
    'Free link building ROI calculator. Estimate the return on investment for your backlink campaigns. Calculate projected traffic, conversions, and revenue from your link building efforts.',
  keywords: [
    'link building ROI calculator',
    'backlink ROI',
    'SEO ROI calculator',
    'link building investment',
    'backlink calculator',
    'SEO investment calculator',
    'link building budget calculator'
  ],
  alternates: {
    canonical: `${BASE_URL}/tools/roi-calculator`,
  },
  openGraph: {
    title: 'Link Building ROI Calculator | SEO Backlinks Grid',
    description:
      'Calculate the potential return on investment for your link building campaigns. Free tool to estimate traffic, conversions, and revenue.',
    url: `${BASE_URL}/tools/roi-calculator`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Link Building ROI Calculator',
    description: 'Calculate your backlink campaign ROI. Free SEO tool.',
  },
}

export default function ROICalculatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
