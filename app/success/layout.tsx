import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Purchase Successful',
  description: 'Your backlink purchase was successful.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function SuccessLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
