import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Target, Heart, Users, TrendingUp } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { OrganizationSchema } from '@/components/seo/JsonLd'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = {
  ...buildMetadata({
    title: 'About BacklinkGrid',
    description:
      'Learn about BacklinkGrid, the visual backlink marketplace making link building accessible, affordable, and transparent.',
    canonicalUrl: 'https://backlinkgrid.com/about',
    type: 'website',
  }),
}

const values = [
  {
    icon: Target,
    title: 'Transparency',
    description:
      "No hidden fees, no surprises. What you see is what you get - a real, permanent dofollow backlink for a fair, upfront price.",
    color: 'red',
  },
  {
    icon: Users,
    title: 'Accessibility',
    description:
      'Link building shouldn\'t require a massive budget or endless outreach. We\'ve made it accessible to everyone, from solo bloggers to established brands.',
    color: 'yellow',
  },
  {
    icon: Heart,
    title: 'Community',
    description:
      'The grid is more than links - it\'s a visual showcase of the SEO community. Every square represents a real site, a real person, a real business.',
    color: 'blue',
  },
  {
    icon: TrendingUp,
    title: 'Mutual Growth',
    description:
      'As our domain authority grows through quality content and engagement, every backlink on the grid becomes more valuable. We grow together.',
    color: 'red',
  },
]

const colorClasses = {
  red: 'bg-bauhaus-red',
  yellow: 'bg-bauhaus-yellow',
  blue: 'bg-bauhaus-blue',
}

export default function AboutPage() {
  return (
    <>
      <OrganizationSchema
        name="BacklinkGrid"
        url="https://backlinkgrid.com"
        logo="https://backlinkgrid.com/logo.png"
        sameAs={[
          'https://twitter.com/seobacklinks',
          'https://linkedin.com/company/seobacklinks',
        ]}
      />
      <Header />

      <main className="min-h-screen">
        {/* Hero */}
        <section className="relative py-20 lg:py-28 bg-bauhaus-cream border-b-3 border-dark overflow-hidden">
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-dark leading-tight">
              About BacklinkGrid
            </h1>
            <p className="mt-6 text-xl text-dark/60 max-w-2xl mx-auto">
              We're on a mission to make link building accessible, transparent,
              and fair for everyone in the SEO community.
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="py-20 lg:py-28 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-8">
              <div>
                <h2 className="font-display font-black text-2xl sm:text-3xl text-dark mb-6">
                  The Problem We're Solving
                </h2>

                <p className="text-dark/70 leading-relaxed mb-4">
                  If you've ever tried to build backlinks, you know the struggle.
                  Cold outreach emails that go unanswered. Guest post opportunities
                  that take months to materialize. Link building services that cost
                  hundreds or thousands of pounds with no guaranteed results.
                </p>

                <p className="text-dark/70 leading-relaxed">
                  We created BacklinkGrid because we believe there should be
                  a simpler way. A way to get a real, quality backlink without the
                  endless back-and-forth. Without the uncertainty. Without breaking
                  the bank.
                </p>
              </div>

              <div className="border-l-4 border-bauhaus-red pl-6">
                <h2 className="font-display font-black text-2xl sm:text-3xl text-dark mb-6">
                  How It Works
                </h2>

                <p className="text-dark/70 leading-relaxed mb-4">
                  The concept is beautifully simple: we've created a visual grid
                  where you can purchase a square. Each square displays your logo
                  or favicon and includes a permanent, dofollow backlink to your
                  website.
                </p>

                <p className="text-dark/70 leading-relaxed">
                  At just $1 per square, it's an impulse buy with real SEO value.
                  No negotiations, no waiting, no uncertainty. Select your square,
                  add your details, pay securely, and your link is live within seconds.
                </p>
              </div>

              <div className="border-l-4 border-bauhaus-blue pl-6">
                <h2 className="font-display font-black text-2xl sm:text-3xl text-dark mb-6">
                  Our Content Strategy
                </h2>

                <p className="text-dark/70 leading-relaxed mb-4">
                  But we're not just a grid of squares. We're building one of the
                  most comprehensive resources for SEO and link building on the web.
                  Our blog, guides, and glossary are designed to educate and provide
                  real value to the SEO community.
                </p>

                <p className="text-dark/70 leading-relaxed">
                  This content serves two purposes: it helps you learn and improve
                  your SEO game, and it builds our domain authority. As our DA grows,
                  so does the value of every backlink on the grid. It's a win-win.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 lg:py-28 bg-bauhaus-cream border-y-3 border-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-display font-black text-3xl sm:text-4xl text-dark">
                Our Values
              </h2>
              <p className="mt-4 text-lg text-dark/60">
                The principles that guide everything we do
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="bg-white border-3 border-dark p-8"
                  style={{ boxShadow: '4px 4px 0px 0px #0A0A0A' }}
                >
                  <div className={`w-14 h-14 ${colorClasses[value.color as keyof typeof colorClasses]} border-3 border-dark flex items-center justify-center mb-4`}>
                    <value.icon className="w-7 h-7 text-white" strokeWidth={2.5} />
                  </div>
                  <h3 className="font-display font-bold text-xl text-dark mb-3">
                    {value.title}
                  </h3>
                  <p className="text-dark/60 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 lg:py-28 bg-dark">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white mb-4">
              Join the Grid
            </h2>
            <p className="text-xl text-white/60 mb-8 max-w-2xl mx-auto">
              Be part of our growing community. Claim your square and get your
              permanent backlink today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/#grid">
                <Button variant="primary" size="lg" className="group">
                  Get Your Square
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="secondary" size="lg">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
