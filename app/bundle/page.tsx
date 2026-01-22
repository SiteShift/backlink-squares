import { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BundleLanding } from './BundleLanding'

export const metadata: Metadata = {
  title: 'Complete Backlink Database Bundle - 270+ High DR Sites',
  description: 'Get 270+ verified backlink sites with DR ratings, link types, costs, and submission URLs. Save 20+ hours of research. One-time purchase for £11.49 (70% off).',
  openGraph: {
    title: 'Complete Backlink Database Bundle',
    description: '270+ High DR Dofollow Backlinks for £11.49 (was £39)',
    images: ['/og-bundle.png'],
  },
}

export default function BundlePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 lg:pt-24">
        <BundleLanding />
      </main>
      <Footer />
    </>
  )
}
