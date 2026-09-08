import { homeFaqs } from '@/lib/home-faq'
import { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/home/Hero'
import { Grid } from '@/components/grid/Grid'
import { GridProvider } from '@/components/grid/GridProvider'
import { SeoLinks } from '@/components/grid/SeoLinks'
import { PurchaseModal } from '@/components/grid/PurchaseModal'
import { HowItWorks } from '@/components/home/HowItWorks'
import { FAQ } from '@/components/home/FAQ'
import { CTA } from '@/components/home/CTA'
import { FAQSchema, OrganizationSchema, ProductSchema } from '@/components/seo/JsonLd'
import { BundleCard } from '@/components/promo'
import { PopularResources } from '@/components/home/PopularResources'
import { Square } from '@/lib/types'
import { buildMetadata } from '@/lib/seo'
import { createServerClient } from '@/lib/supabase'
import { Zap, Link as LinkIcon, Clock } from 'lucide-react'

export const metadata: Metadata = {
  ...buildMetadata({
    title: 'BacklinkGrid: Backlink Database & Website Directory',
    description:
      'Find backlink opportunities in our 276-site database, claim a directory square from $1, and learn with free link-building guides and practical SEO templates.',
    canonicalUrl: 'https://backlinkgrid.com',
    keywords: [
      'backlinks',
      'buy backlinks',
      'sponsored backlinks',
      'backlink marketplace',
      'link building',
    ],
    type: 'website',
  }),
}

const faqData = homeFaqs

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const revalidate = 0

// Fetch purchased squares from database
async function getPurchasedSquares(): Promise<{ squares: Square[]; totalSold: number; serverTimestamp: string }> {
  try {
    const supabase = createServerClient()

    // IMPORTANT: Only select public fields - never expose email (PII)
    const publicFields = 'id, row_index, col_index, purchased, purchase_group_id, site_url, site_name, logo_url, purchased_at'
    const { data: squares, error } = await supabase
      .from('squares')
      .select(publicFields)
      .eq('purchased', true)
      .order('row_index', { ascending: true })
      .order('col_index', { ascending: true })

    if (error) {
      console.error('Error fetching squares:', error)
      return { squares: [], totalSold: 0, serverTimestamp: new Date().toISOString() }
    }

    return {
      squares: squares || [],
      totalSold: squares?.length || 0,
      // Use server time for delta polling to avoid client clock skew
      serverTimestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error('Error fetching purchased squares:', error)
    return { squares: [], totalSold: 0, serverTimestamp: new Date().toISOString() }
  }
}

const features = [
  {
    icon: Zap,
    value: '$1',
    label: 'Per Square',
    color: 'text-brand-red',
    bg: 'bg-brand-red/10',
  },
  {
    icon: LinkIcon,
    value: 'Listed',
    label: 'Website Visibility',
    color: 'text-brand-blue',
    bg: 'bg-brand-blue/10',
  },
  {
    icon: Clock,
    value: 'Once',
    label: 'One Payment',
    color: 'text-brand-yellow',
    bg: 'bg-brand-yellow/10',
  },
]

export default async function HomePage() {
  const { squares: purchasedSquares, totalSold, serverTimestamp } = await getPurchasedSquares()

  return (
    <>
      <OrganizationSchema />
      <ProductSchema
        name="BacklinkGrid Squares"
        description="Permanent sponsored backlinks on BacklinkGrid starting at $1 per square."
        url="https://backlinkgrid.com"
        price={1}
      />
      <FAQSchema questions={faqData} />
      <Header />

      <main className="min-h-screen">
        {/* Hero Section */}
        <Hero totalSold={totalSold} />

        {/* Feature Bar - Below the fold */}
        <section className="relative bg-surface-950 border-y-2 border-white/10">
          <div className="absolute inset-0 pattern-grid-dark opacity-20" />
          <div className="relative container-wide">
            <div className="grid grid-cols-3 divide-x divide-white/10">
              {features.map((feature) => (
                <div key={feature.label} className="px-4 sm:px-8 py-6 sm:py-8 text-center group">
                  <div className={`inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 ${feature.bg} rounded-full mb-3 group-hover:scale-110 transition-transform`}>
                    <feature.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${feature.color}`} />
                  </div>
                  <p className={`text-2xl sm:text-3xl lg:text-4xl font-black ${feature.color}`}>
                    {feature.value}
                  </p>
                  <p className="text-[10px] sm:text-xs lg:text-sm text-white/50 uppercase tracking-wider mt-1">
                    {feature.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <BundleCard />

        {/* The Grid - Main Product */}
        <section id="grid" className="section-padding bg-white relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 pattern-dots opacity-30" />

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-brand-yellow/10 -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-20 left-0 w-32 h-32 bg-brand-blue/10 rounded-full -translate-x-1/2" />

          <div className="container-wide relative">
            <div className="text-center mb-16">
              <div className="section-label mx-auto mb-8">
                <span className="section-label-dot bg-brand-red" />
                <span>Website Directory</span>
              </div>

              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight">
                Claim Your{' '}
                <span className="text-brand-red">Backlink</span>
              </h2>

              <p className="mt-6 text-lg text-surface-600 max-w-xl mx-auto">
                Click on empty squares to select them. Select up to 100 squares anywhere on the grid - they don't need to be connected. Each square is just $1.
              </p>
            </div>

            <GridProvider initialSquares={purchasedSquares} initialTotalSold={totalSold} serverTimestamp={serverTimestamp}>
              <Grid />
            </GridProvider>
          </div>
        </section>

        {/* How It Works */}
        <HowItWorks />



        {/* FAQ */}
        <FAQ />

        {/* Popular Resources - Internal links to high-impression pages */}
        <PopularResources />

        {/* SEO Links Section */}
        <SeoLinks purchasedSquares={purchasedSquares} />

        {/* Final CTA */}
        <CTA />
      </main>

      <Footer />

      {/* Purchase Modal */}
      <PurchaseModal />

      {/* Noise overlay for texture */}
      <div className="noise-overlay" />
    </>
  )
}
