import { Metadata } from 'next'
import Link from 'next/link'
import {
  MousePointer,
  CreditCard,
  Rocket,
  Shield,
  TrendingUp,
  Link as LinkIcon,
  CheckCircle2,
  ArrowRight,
  Zap,
  Globe,
  Clock,
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { HowToSchema } from '@/components/seo/JsonLd'

const BASE_URL = 'https://seobacklinks.dev'

export const metadata: Metadata = {
  title: 'How It Works - Get Your Backlink in 3 Simple Steps',
  description:
    'Learn how to purchase a square on the SEO Backlinks Grid and get your permanent dofollow backlink. Simple 3-step process with instant activation.',
  alternates: {
    canonical: `${BASE_URL}/how-it-works`,
  },
  openGraph: {
    title: 'How It Works | SEO Backlinks Grid',
    description:
      'Get your permanent dofollow backlink in 3 simple steps. Select, customize, and go live instantly.',
  },
}

// HowTo schema data
const howToSteps = [
  {
    name: 'Select Your Squares',
    text: 'Browse the grid and click on any empty squares to select them. You can choose a single 1x1 square for maximum affordability, or select multiple adjacent squares for greater visibility.',
  },
  {
    name: 'Add Your Details',
    text: 'Enter your website URL, site name, and optionally upload your logo. See a live preview of exactly how your square will appear on the grid.',
  },
  {
    name: 'Go Live Instantly',
    text: 'Complete your purchase securely via Stripe. The moment your payment is confirmed, your square goes live with a real, crawlable dofollow backlink pointing to your site.',
  },
]

const steps = [
  {
    number: '1',
    title: 'Select Your Squares',
    description:
      'Browse the grid and click on any empty squares to select them. You can choose a single 1x1 square for maximum affordability, or select multiple adjacent squares (up to 3x3) for greater visibility.',
    icon: MousePointer,
    details: [
      'Click any empty square to select it',
      'Select multiple adjacent squares for larger placement',
      'Preview your selection as you go',
      'Price shown in real-time based on selection',
    ],
    color: 'red',
  },
  {
    number: '2',
    title: 'Add Your Details',
    description:
      'Enter your website URL, site name, and optionally upload your logo. See a live preview of exactly how your square will appear on the grid before committing to purchase.',
    icon: CreditCard,
    details: [
      'Enter your target URL (gets the dofollow link)',
      'Add your site/brand name for hover display',
      'Upload a logo or favicon (optional)',
      'Preview your square before checkout',
    ],
    color: 'yellow',
  },
  {
    number: '3',
    title: 'Go Live Instantly',
    description:
      'Complete your purchase securely via Stripe. The moment your payment is confirmed, your square goes live on the grid with a real, crawlable dofollow backlink pointing to your site.',
    icon: Rocket,
    details: [
      'Pay securely via Stripe',
      'Square appears immediately after payment',
      'Dofollow link is active instantly',
      'Receive email confirmation with receipt',
    ],
    color: 'blue',
  },
]

const colorClasses = {
  red: 'bg-bauhaus-red',
  yellow: 'bg-bauhaus-yellow',
  blue: 'bg-bauhaus-blue',
}

const benefits = [
  {
    icon: Shield,
    title: 'Permanent Placement',
    description:
      'Your square stays on the grid forever. No monthly fees, no renewals, no risk of removal.',
  },
  {
    icon: LinkIcon,
    title: 'Real Dofollow Link',
    description:
      'Every link is a genuine dofollow backlink - no nofollow, no sponsored tags.',
  },
  {
    icon: TrendingUp,
    title: 'Growing Value',
    description:
      'As our domain authority increases through content and traffic, your backlink becomes more valuable.',
  },
  {
    icon: Zap,
    title: 'Instant Activation',
    description:
      "No waiting for approval or manual review. Your link is live the second you pay.",
  },
  {
    icon: Globe,
    title: 'Crawlable by Search Engines',
    description:
      'Links are rendered as real HTML anchor tags, fully visible to Google and other search engines.',
  },
  {
    icon: Clock,
    title: 'Early Adopter Advantage',
    description:
      'Squares at the top of the grid get more visibility. The earlier you join, the better your position.',
  },
]

const pricing = [
  { squares: 1, price: '$1', description: 'Single square - favicon or small logo' },
  { squares: 2, price: '$2', description: '1x2 or 2x1 - wider rectangle' },
  { squares: 4, price: '$4', description: '2x2 grid - full logo' },
  { squares: 9, price: '$9', description: '3x3 grid - premium real estate' },
]

export default function HowItWorksPage() {
  return (
    <>
      <HowToSchema
        name="How to Get a Dofollow Backlink on SEO Backlinks Grid"
        description="Learn how to purchase a square and get your permanent dofollow backlink in 3 simple steps."
        steps={howToSteps}
        totalTime="PT5M"
      />
      <Header />

      <main className="min-h-screen">
        {/* Hero */}
        <section className="relative py-20 lg:py-28 bg-bauhaus-cream border-b-3 border-dark overflow-hidden">
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-dark leading-tight">
              Get Your Backlink in{' '}
              <span className="text-bauhaus-red">3 Simple Steps</span>
            </h1>
            <p className="mt-6 text-xl text-dark/60 max-w-2xl mx-auto">
              No outreach. No negotiations. No waiting. Just select your square,
              add your details, and you're live with a permanent dofollow backlink.
            </p>
          </div>
        </section>

        {/* Steps */}
        <section className="py-20 lg:py-28 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-20">
              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className={`flex flex-col ${
                    index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'
                  } items-center gap-12 lg:gap-20`}
                >
                  {/* Content */}
                  <div className="flex-1">
                    <div className="inline-flex items-center gap-3 mb-4">
                      <span className={`flex items-center justify-center w-12 h-12 ${colorClasses[step.color as keyof typeof colorClasses]} border-3 border-dark text-white font-black text-xl`}>
                        {step.number}
                      </span>
                      <span className="text-sm font-bold text-dark/60 uppercase tracking-wider">
                        Step {step.number}
                      </span>
                    </div>

                    <h2 className="font-display font-black text-3xl sm:text-4xl text-dark mb-4 leading-tight">
                      {step.title}
                    </h2>

                    <p className="text-lg text-dark/60 mb-6">
                      {step.description}
                    </p>

                    <ul className="space-y-3">
                      {step.details.map((detail, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-bauhaus-blue flex-shrink-0" />
                          <span className="text-dark/70">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Visual */}
                  <div className="flex-1 w-full max-w-md">
                    <div className={`aspect-square ${colorClasses[step.color as keyof typeof colorClasses]} border-3 border-dark flex items-center justify-center`}
                      style={{ boxShadow: '6px 6px 0px 0px #0A0A0A' }}
                    >
                      <step.icon className="w-24 h-24 text-white/50" strokeWidth={1.5} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20 lg:py-28 bg-bauhaus-cream border-y-3 border-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-display font-black text-3xl sm:text-4xl text-dark">
                Why Choose Our Grid?
              </h2>
              <p className="mt-4 text-lg text-dark/60">
                Real value, real results, real simplicity
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => {
                const colors = ['red', 'yellow', 'blue'] as const
                const color = colors[index % 3]
                return (
                  <div
                    key={index}
                    className="bg-white border-3 border-dark p-6"
                    style={{ boxShadow: '4px 4px 0px 0px #0A0A0A' }}
                  >
                    <div className={`w-12 h-12 ${colorClasses[color]} border-3 border-dark flex items-center justify-center mb-4`}>
                      <benefit.icon className="w-6 h-6 text-white" strokeWidth={2.5} />
                    </div>
                    <h3 className="font-display font-bold text-lg text-dark mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-dark/60">{benefit.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-20 lg:py-28 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-display font-black text-3xl sm:text-4xl text-dark">
                Simple, Transparent Pricing
              </h2>
              <p className="mt-4 text-lg text-dark/60">
                $1 per square. No hidden fees. One-time payment.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {pricing.map((tier, index) => (
                <div
                  key={index}
                  className="bg-bauhaus-cream border-3 border-dark p-6"
                >
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-black text-dark">
                      {tier.price}
                    </span>
                    <span className="text-dark/50 uppercase text-sm font-bold tracking-wider">one-time</span>
                  </div>
                  <p className="text-sm font-bold text-bauhaus-red uppercase tracking-wider mb-2">
                    {tier.squares} Square{tier.squares > 1 ? 's' : ''}
                  </p>
                  <p className="text-dark/60">{tier.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 lg:py-28 bg-dark">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-white/60 mb-8">
              Claim your square and get your backlink today.
            </p>
            <Link href="/#grid">
              <Button variant="primary" size="lg" className="group">
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
