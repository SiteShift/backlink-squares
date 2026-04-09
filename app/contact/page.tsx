import { Metadata } from 'next'
import Link from 'next/link'
import { Mail, Twitter, HelpCircle, ArrowRight, Package, Search, ShoppingCart } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = {
  ...buildMetadata({
    title: 'Contact BacklinkGrid',
    description:
      'Need help with a purchase, your backlink square, or the bundle? Email BacklinkGrid or use the fastest product and support paths here.',
    canonicalUrl: 'https://backlinkgrid.com/contact',
    type: 'website',
    keywords: ['BacklinkGrid contact', 'backlink support', 'SEO backlink support'],
  }),
}

const contactMethods = [
  {
    icon: Mail,
    title: 'Email',
    description: 'Best for purchase support, bundle issues, and update requests',
    action: 'hello@backlinkgrid.com',
    href: 'mailto:hello@backlinkgrid.com',
    cta: 'Send Email',
    color: 'red',
  },
  {
    icon: Twitter,
    title: 'Twitter/X',
    description: 'Follow us for updates and quick questions',
    action: '@seobacklinks',
    href: 'https://twitter.com/seobacklinks',
    cta: 'Follow Us',
    color: 'blue',
  },
  {
    icon: HelpCircle,
    title: 'FAQ',
    description: 'Find instant answers to common questions',
    action: 'View FAQ',
    href: '/#faq',
    cta: 'Browse FAQ',
    color: 'yellow',
  },
]

const colorClasses = {
  red: 'bg-bauhaus-red',
  blue: 'bg-bauhaus-blue',
  yellow: 'bg-bauhaus-yellow',
}

const commonTopics = [
  {
    title: 'Purchase Support',
    description: 'Payment issues, square placement, logo uploads, or updating an existing backlink',
  },
  {
    title: 'Bundle Access',
    description: 'Questions about the backlink database bundle, downloads, or checkout confirmation',
  },
  {
    title: 'Tool Questions',
    description: 'Need help using the backlink checker, audit checklist, or ROI calculator',
  },
  {
    title: 'Partnerships',
    description: 'Feature requests, collaborations, and product partnership discussions',
  },
]

const actionCards = [
  {
    href: '/#grid',
    icon: ShoppingCart,
    title: 'Buy a Backlink',
    description: 'Claim a permanent dofollow square on the grid right now.',
    cta: 'Open the grid',
    style: 'bg-white',
  },
  {
    href: '/bundle',
    icon: Package,
    title: 'Get the Bundle',
    description: 'Buy the verified backlink opportunity spreadsheet.',
    cta: 'View the bundle',
    style: 'bg-bauhaus-yellow',
  },
  {
    href: '/tools',
    icon: Search,
    title: 'Use Free Tools',
    description: 'Check backlinks, audit your profile, and estimate ROI before buying.',
    cta: 'Browse tools',
    style: 'bg-white',
  },
]

export default function ContactPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-bauhaus-cream">
        {/* Hero */}
        <section className="py-20 lg:py-28 bg-white border-b-3 border-dark">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-black text-4xl sm:text-5xl uppercase tracking-wide text-dark">
              Contact BacklinkGrid
            </h1>
            <p className="mt-6 text-xl text-dark/60 max-w-2xl mx-auto">
              The fastest support path is email. If you're ready to buy or explore, use the direct product links below instead of waiting on a reply.
            </p>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-6">
              {contactMethods.map((method, index) => (
                <a
                  key={index}
                  href={method.href}
                  target={method.href.startsWith('http') ? '_blank' : undefined}
                  rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="group block bg-white border-3 border-dark p-8 hover:shadow-bauhaus transition-all"
                >
                  <div className={`w-14 h-14 ${colorClasses[method.color as keyof typeof colorClasses]} border-3 border-dark flex items-center justify-center mb-4`}>
                    <method.icon className="w-7 h-7 text-white" strokeWidth={2.5} />
                  </div>
                  <h3 className="font-bold text-lg uppercase tracking-wide text-dark mb-2">
                    {method.title}
                  </h3>
                  <p className="text-sm text-dark/60 mb-4">
                    {method.description}
                  </p>
                  <span className="font-bold text-bauhaus-red group-hover:underline">
                    {method.action}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Direct Paths */}
        <section className="py-16 bg-white border-y-3 border-dark">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-black text-2xl sm:text-3xl uppercase tracking-wide text-dark">
                Skip the Inbox if You Already Know What You Need
              </h2>
              <p className="mt-2 text-dark/60">
                Use the live product pages for immediate action.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {actionCards.map((card) => (
                <Link
                  key={card.href}
                  href={card.href}
                  className={`group block ${card.style} border-3 border-dark p-8 hover:shadow-bauhaus transition-all`}
                >
                  <div className="w-14 h-14 bg-bauhaus-blue border-3 border-dark flex items-center justify-center mb-4">
                    <card.icon className="w-7 h-7 text-white" strokeWidth={2.5} />
                  </div>
                  <h3 className="font-bold text-lg uppercase tracking-wide text-dark mb-2">
                    {card.title}
                  </h3>
                  <p className="text-sm text-dark/60 mb-4">
                    {card.description}
                  </p>
                  <span className="inline-flex items-center gap-2 font-bold text-bauhaus-red">
                    {card.cta}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Common Topics */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-bold text-2xl uppercase tracking-wide text-dark text-center mb-12">
              Common Topics
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {commonTopics.map((topic, index) => (
                <div
                  key={index}
                  className="bg-white border-3 border-dark p-6"
                >
                  <h3 className="font-bold uppercase tracking-wide text-dark mb-1">
                    {topic.title}
                  </h3>
                  <p className="text-sm text-dark/60">{topic.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
