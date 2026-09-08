import { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { FAQSchema, ProductSchema } from '@/components/seo/JsonLd'
import { buildMetadata } from '@/lib/seo'
import { BundleLanding } from './BundleLanding'
import { BUNDLE_PRICE_GBP, bundleFaqs } from './bundleData'

export const metadata: Metadata = {
  ...buildMetadata({
    title: 'Backlink Database Bundle: 276 Opportunities for £11.49',
    description: 'Explore 276 backlink opportunities in one CSV with recorded DR, costs, submission URLs and tips. Preview real rows before buying. £11.49, no subscription.',
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
        description="276 backlink opportunities with recorded DR, link types, costs, submission URLs and tips in one downloadable CSV."
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
