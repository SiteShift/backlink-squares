import { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/home/Hero'
import { Grid } from '@/components/grid/Grid'
import { SeoLinks } from '@/components/grid/SeoLinks'
import { PurchaseModal } from '@/components/grid/PurchaseModal'
import { HowItWorks } from '@/components/home/HowItWorks'
import { FAQ } from '@/components/home/FAQ'
import { CTA } from '@/components/home/CTA'
import { FAQSchema } from '@/components/seo/JsonLd'
import { Square } from '@/lib/types'
import { Zap, Link as LinkIcon, Clock } from 'lucide-react'

const BASE_URL = 'https://seobacklinks.dev'

export const metadata: Metadata = {
  alternates: {
    canonical: BASE_URL,
  },
}

// FAQ data for schema
const faqData = [
  {
    question: 'What is a dofollow backlink?',
    answer:
      'A dofollow backlink is a link that passes "link equity" or "link juice" to your website. Unlike nofollow links, dofollow links tell search engines to follow the link and count it as a vote of confidence for your site, which can help improve your search rankings.',
  },
  {
    question: 'How quickly will my square appear on the grid?',
    answer:
      "Your square appears instantly after your payment is confirmed. There's no waiting period or manual approval process. As soon as Stripe confirms your payment, your logo and link go live on the grid.",
  },
  {
    question: 'Is this a permanent backlink?',
    answer:
      'Yes! When you purchase a square, you get a permanent, lifetime placement on the grid. There are no monthly fees, no renewals, and no risk of your link being removed. Your backlink stays active as long as our site exists.',
  },
  {
    question: 'Can I buy multiple squares?',
    answer:
      'Absolutely! You can select as many adjacent squares as you like. Larger selections give you more visibility on the grid - perfect for showing off your full logo or brand name. The price scales linearly: $1 per square.',
  },
  {
    question: 'How does this help my SEO?',
    answer:
      "Every square on our grid includes a real, crawlable dofollow link. As our domain authority grows through our content and links, the value of your backlink increases too. You're essentially getting in early on a growing SEO asset.",
  },
  {
    question: 'Do you offer refunds?',
    answer:
      "Due to the nature of this product (instant, permanent backlinks), we generally don't offer refunds once your square is live. However, if there's an issue with your purchase, please contact us and we'll work to make it right.",
  },
]

// Fetch purchased squares from database
async function getPurchasedSquares(): Promise<Square[]> {
  // TODO: Replace with Supabase query when database is connected
  return []
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
    value: 'Dofollow',
    label: 'Real SEO Value',
    color: 'text-brand-blue',
    bg: 'bg-brand-blue/10',
  },
  {
    icon: Clock,
    value: 'Forever',
    label: 'One Payment',
    color: 'text-brand-yellow',
    bg: 'bg-brand-yellow/10',
  },
]

export default async function HomePage() {
  const purchasedSquares = await getPurchasedSquares()
  const totalSold = purchasedSquares.length

  return (
    <>
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
                <span>Do Follow Backlinks</span>
              </div>

              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight">
                Claim Your{' '}
                <span className="text-brand-red">Backlink</span>
              </h2>

              <p className="mt-6 text-lg text-surface-600 max-w-xl mx-auto">
                Click on empty squares to select them. Select multiple adjacent squares
                for a larger presence. Each square is just $1.
              </p>
            </div>

            <Grid />
          </div>
        </section>

        {/* How It Works */}
        <HowItWorks />

        {/* FAQ */}
        <FAQ />

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
