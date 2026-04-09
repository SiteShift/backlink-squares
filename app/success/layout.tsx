import { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = {
  ...buildMetadata({
    title: 'Purchase Successful',
    description: 'Your backlink purchase was successful.',
    canonicalUrl: 'https://backlinkgrid.com/success',
    robots: {
      index: false,
      follow: false,
    },
    type: 'website',
  }),
}

export default function SuccessLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
