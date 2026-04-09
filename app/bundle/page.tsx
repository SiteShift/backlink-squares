import { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { FAQSchema, ProductSchema } from '@/components/seo/JsonLd'
import { buildMetadata } from '@/lib/seo'
import { BundleLanding } from './BundleLanding'
import { BUNDLE_PRICE_GBP, bundleFaqs } from './bundleData'

export const metadata: Metadata = {
  ...buildMetadata({
    title: 'Complete Backlink Database Bundle - 270+ High DR Sites',
    description: 'Get 270+ verified backlink sites with DR ratings, link types, costs, and submission URLs. Save 20+ hours of research. One-time purchase for £11.49.',
    canonicalUrl: 'https://backlinkgrid.com/bundle',
    keywords: ['backlink database', 'link building database', 'SEO bundle', 'backlink opportunities'],
    type: 'website',
  }),
}

export default function BundlePage() {
  return (
    <>
      <ProductSchema
        name="Complete Backlink Database Bundle"
        description="270+ verified backlink opportunities with DR, link types, costs, and submission URLs in one downloadable CSV."
        url="https://backlinkgrid.com/bundle"
        price={BUNDLE_PRICE_GBP}
        currency="GBP"
      />
      <FAQSchema questions={bundleFaqs} />
      <Header />
      <main className="min-h-screen pt-20 lg:pt-24">
        <BundleLanding />
      </main>
      <Footer />
    </>
  )
}
