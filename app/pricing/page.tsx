import { Metadata } from 'next'
import Link from 'next/link'
import { Check, Sparkles, ArrowRight, HelpCircle } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'

const BASE_URL = 'https://backlinkgrid.com'

export const metadata: Metadata = {
  title: 'Pricing - Simple, Transparent Pricing',
  description:
    'SEO Backlinks Grid pricing. $1 per square. No hidden fees, no subscriptions. One-time payment for a permanent dofollow backlink.',
  alternates: {
    canonical: `${BASE_URL}/pricing`,
  },
  openGraph: {
    title: 'Pricing | SEO Backlinks Grid',
    description:
      '$1 per square. Permanent dofollow backlinks with transparent pricing.',
  },
}

const pricingTiers = [
  {
    name: '1 Square',
    price: 1,
    dimensions: '1x1',
    description: 'Perfect for getting started',
    features: [
      'Permanent dofollow backlink',
      'Display your favicon',
      'Clickable link to your site',
      'Instant activation',
    ],
    popular: false,
    color: 'red',
  },
  {
    name: '4 Squares',
    price: 4,
    dimensions: '2x2',
    description: 'Show off your full logo',
    features: [
      'Everything in 1 Square',
      'Display your full logo',
      'More prominent placement',
      'Better visibility',
    ],
    popular: true,
    color: 'yellow',
  },
  {
    name: '9 Squares',
    price: 9,
    dimensions: '3x3',
    description: 'Maximum presence',
    features: [
      'Everything in 4 Squares',
      'Premium real estate',
      'Logo + tagline space',
      'Maximum visibility',
    ],
    popular: false,
    color: 'blue',
  },
]

const colorClasses = {
  red: 'bg-bauhaus-red',
  yellow: 'bg-bauhaus-yellow',
  blue: 'bg-bauhaus-blue',
}

const faqs = [
  {
    question: 'Is this a one-time payment?',
    answer:
      'Yes! You pay once and your square stays on the grid forever. No monthly fees, no renewals.',
  },
  {
    question: 'Are the links really dofollow?',
    answer:
      "Absolutely. Every link on our grid is a genuine dofollow link. No rel=\"nofollow\" or rel=\"sponsored\" attributes.",
  },
  {
    question: 'Can I update my link or logo later?',
    answer:
      "Yes, contact us and we'll help you update your details. Minor changes are free.",
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit cards through Stripe. Apple Pay and Google Pay are also available.',
  },
]

export default function PricingPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-bauhaus-cream">
        {/* Hero */}
        <section className="py-16 lg:py-24 bg-white border-b-3 border-dark">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-black text-4xl sm:text-5xl uppercase tracking-wide text-dark">
              Simple, Transparent Pricing
            </h1>
            <p className="mt-4 text-xl text-dark/60">
              $1 per square. No hidden fees. One-time payment for a permanent
              dofollow backlink.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              {pricingTiers.map((tier) => (
                <div
                  key={tier.name}
                  className={`relative bg-white border-3 border-dark p-8 ${
                    tier.popular ? 'mt-0 md:-mt-4' : ''
                  }`}
                  style={{ boxShadow: tier.popular ? '6px 6px 0px 0px #E53935' : '4px 4px 0px 0px #0A0A0A' }}
                >
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 px-4 py-1 bg-bauhaus-red border-2 border-dark text-white text-sm font-bold uppercase tracking-wider">
                        <Sparkles className="w-4 h-4" />
                        Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <div className={`w-12 h-12 ${colorClasses[tier.color as keyof typeof colorClasses]} border-3 border-dark mx-auto mb-4`} />
                    <h3 className="font-bold text-lg uppercase tracking-wide text-dark">
                      {tier.name}
                    </h3>
                    <p className="text-sm text-dark/50">{tier.dimensions}</p>
                  </div>

                  <div className="text-center mb-6">
                    <span className="text-5xl font-black text-dark">
                      ${tier.price}
                    </span>
                    <span className="text-dark/50 ml-2 uppercase text-sm font-bold">one-time</span>
                  </div>

                  <p className="text-center text-dark/60 mb-6">
                    {tier.description}
                  </p>

                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-bauhaus-blue flex-shrink-0" />
                        <span className="text-dark/70">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href="/#grid" className="block">
                    <Button
                      variant={tier.popular ? 'primary' : 'secondary'}
                      size="lg"
                      className="w-full"
                    >
                      Get Started
                    </Button>
                  </Link>
                </div>
              ))}
            </div>

            {/* Custom Options */}
            <div className="mt-12 text-center">
              <p className="text-dark/60">
                Need a custom size or bulk purchase?{' '}
                <Link
                  href="/contact"
                  className="font-bold text-bauhaus-red hover:underline"
                >
                  Contact us
                </Link>{' '}
                for special pricing.
              </p>
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section className="py-16 bg-white border-y-3 border-dark">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-bold text-2xl uppercase tracking-wide text-dark text-center mb-12">
              What's Included With Every Square
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                'Permanent placement on grid',
                'Real dofollow backlink',
                'Instant activation',
                'Your logo/favicon displayed',
                'Clickable link to your site',
                'Email receipt & confirmation',
                'Updates available on request',
                'Growing domain authority',
                'No monthly fees ever',
              ].map((feature, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-bauhaus-cream border-2 border-dark p-4"
                >
                  <Check className="w-5 h-5 text-bauhaus-blue flex-shrink-0" />
                  <span className="text-dark/70">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="w-14 h-14 bg-bauhaus-yellow border-3 border-dark flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="w-7 h-7 text-dark" />
              </div>
              <h2 className="font-bold text-2xl uppercase tracking-wide text-dark">
                Pricing FAQ
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white border-3 border-dark p-6">
                  <h3 className="font-bold uppercase tracking-wide text-dark mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-dark/60">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-dark">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-black text-3xl uppercase tracking-wide text-white mb-4">
              Ready to Get Your Backlink?
            </h2>
            <p className="text-xl text-white/60 mb-8">
              Join hundreds of sites already on the grid.
            </p>
            <Link href="/#grid">
              <Button
                variant="primary"
                size="lg"
                className="group"
              >
                Browse the Grid
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
