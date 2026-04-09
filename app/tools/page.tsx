import { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { buildMetadata } from '@/lib/seo'
import {
  Calculator,
  ArrowRight,
  Wrench,
  BarChart3,
  FileSpreadsheet,
  CheckSquare,
  Sparkles,
  Search
} from 'lucide-react'

export const metadata: Metadata = {
  ...buildMetadata({
    title: 'Free SEO & Link Building Tools',
    description:
      'Free SEO and link building tools to help you build authority and rank higher. ROI calculators, audit checklists, and more.',
    canonicalUrl: 'https://backlinkgrid.com/tools',
    keywords: [
      'SEO tools',
      'link building tools',
      'free SEO tools',
      'backlink tools',
      'SEO calculators',
      'link building calculators',
    ],
    type: 'website',
  }),
}

interface Tool {
  title: string
  description: string
  href: string
  icon: React.ElementType
  color: 'red' | 'blue' | 'yellow'
  status: 'available' | 'coming-soon'
}

const tools: Tool[] = [
  {
    title: 'Free Backlink Checker',
    description:
      'Check backlinks for any website instantly. Enter a domain and get direct links to analyze it in Ahrefs, Moz, Semrush, and other free tools.',
    href: '/tools/free-backlink-checker',
    icon: Search,
    color: 'red',
    status: 'available'
  },
  {
    title: 'Link Building ROI Calculator',
    description:
      'Calculate the potential return on investment for your link building campaigns. Estimate traffic growth, conversions, and revenue.',
    href: '/tools/roi-calculator',
    icon: Calculator,
    color: 'blue',
    status: 'available'
  },
  {
    title: 'Backlink Audit Checklist',
    description:
      'Step-by-step checklist for analyzing your backlink profile. Learn what to look for in referring domains, anchor text, link velocity, and toxic links.',
    href: '/tools/backlink-analyzer',
    icon: CheckSquare,
    color: 'yellow',
    status: 'available'
  },
  {
    title: 'Link Velocity Tracker',
    description:
      'Track your link acquisition velocity over time. Compare against competitors and industry benchmarks.',
    href: '/tools/link-velocity',
    icon: BarChart3,
    color: 'blue',
    status: 'coming-soon'
  },
  {
    title: 'Outreach Email Templates',
    description:
      'Proven email templates for link building outreach. Guest posting, resource page, broken link building, and more.',
    href: '/tools/outreach-templates',
    icon: FileSpreadsheet,
    color: 'red',
    status: 'coming-soon'
  }
]

const colorClasses = {
  red: {
    bg: 'bg-brand-red',
    text: 'text-brand-red',
    border: 'border-brand-red',
    light: 'bg-brand-red/10'
  },
  blue: {
    bg: 'bg-brand-blue',
    text: 'text-brand-blue',
    border: 'border-brand-blue',
    light: 'bg-brand-blue/10'
  },
  yellow: {
    bg: 'bg-brand-yellow',
    text: 'text-yellow-600',
    border: 'border-brand-yellow',
    light: 'bg-brand-yellow/20'
  }
}

export default function ToolsPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-surface-50">
        {/* Hero Section */}
        <section className="py-16 lg:py-24 bg-white border-b-2 border-surface-200 relative overflow-hidden">
          <div className="absolute inset-0 pattern-dots opacity-30" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/10 -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-red/10 translate-y-1/2 -translate-x-1/2 rounded-full" />

          <div className="container-wide relative">
            <div className="text-center max-w-3xl mx-auto">
              <div className="section-label mx-auto mb-8">
                <span className="section-label-dot bg-brand-red" />
                <span>Free Resources</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6">
                SEO & Link Building{' '}
                <span className="text-brand-blue">Tools</span>
              </h1>

              <p className="text-lg text-surface-600 max-w-2xl mx-auto">
                Free tools to help you plan, execute, and measure your link building campaigns.
                Calculate ROI, audit your backlinks, and optimize your strategy.
              </p>
            </div>
          </div>
        </section>

        {/* Tools Grid */}
        <section className="py-16">
          <div className="container-wide">
            <div className="grid md:grid-cols-2 gap-8">
              {tools.map((tool) => {
                const colors = colorClasses[tool.color]
                const isComingSoon = tool.status === 'coming-soon'

                return (
                  <div
                    key={tool.href}
                    className={`bg-white border-2 ${isComingSoon ? 'border-surface-200' : 'border-surface-950'} p-8 relative group transition-all duration-200 ${!isComingSoon ? 'hover:translate-x-[-2px] hover:translate-y-[-2px]' : ''}`}
                    style={!isComingSoon ? { boxShadow: '4px 4px 0px 0px #09090B' } : undefined}
                  >
                    {isComingSoon && (
                      <div className="absolute top-4 right-4">
                        <span className="inline-flex items-center px-3 py-1 text-xs font-bold uppercase tracking-wider bg-surface-100 text-surface-500 border border-surface-200">
                          Coming Soon
                        </span>
                      </div>
                    )}

                    <div className={`w-14 h-14 ${isComingSoon ? 'bg-surface-100' : colors.bg} flex items-center justify-center mb-6`}>
                      <tool.icon className={`w-7 h-7 ${isComingSoon ? 'text-surface-400' : 'text-white'}`} />
                    </div>

                    <h2 className={`font-display text-2xl font-black mb-3 ${isComingSoon ? 'text-surface-400' : 'text-surface-950'}`}>
                      {tool.title}
                    </h2>

                    <p className={`mb-6 ${isComingSoon ? 'text-surface-400' : 'text-surface-600'}`}>
                      {tool.description}
                    </p>

                    {!isComingSoon ? (
                      <Link href={tool.href}>
                        <Button variant="primary" className="group/btn">
                          Use Tool
                          <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    ) : (
                      <Button variant="secondary" disabled className="opacity-50 cursor-not-allowed">
                        Coming Soon
                      </Button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Suggest a Tool */}
        <section className="py-16 bg-white border-y-2 border-surface-200">
          <div className="container-wide">
            <div className="max-w-3xl mx-auto text-center">
              <div className="w-16 h-16 bg-brand-yellow flex items-center justify-center mx-auto mb-6">
                <Wrench className="w-8 h-8 text-surface-950" />
              </div>

              <h2 className="font-display text-3xl font-black text-surface-950 mb-4">
                Have a Tool Idea?
              </h2>

              <p className="text-lg text-surface-600 mb-8">
                We are always looking to build tools that help SEOs and marketers succeed.
                Let us know what would be useful for you.
              </p>

              <Link href="/contact">
                <Button variant="secondary" size="lg" className="group">
                  Suggest a Tool
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-surface-950">
          <div className="container-wide">
            <div className="max-w-4xl mx-auto text-center text-white">
              <div className="w-16 h-16 bg-brand-red flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-white" />
              </div>

              <h2 className="font-display text-3xl sm:text-4xl font-black mb-4">
                Ready to Build Backlinks?
              </h2>

              <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
                Tools are great for planning, but action drives results.
                Get your first backlink for just $1.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/#grid">
                  <Button variant="red" size="lg" className="group">
                    Claim Your $1 Square
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>

                <Link href="/bundle">
                  <Button variant="secondary" size="lg" className="group">
                    Get 270+ Backlink Sites
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
