import { Metadata } from 'next'
import Link from 'next/link'
import { BarChart3, TrendingUp, Link as LinkIcon, Users, ArrowRight } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

const BASE_URL = 'https://backlinkgrid.com'

export const metadata: Metadata = {
  title: 'SEO & Link Building Statistics 2026',
  description:
    'The latest statistics on backlinks, link building, and SEO. Data-driven insights to inform your strategy.',
  alternates: {
    canonical: `${BASE_URL}/statistics`,
  },
  openGraph: {
    title: 'SEO & Link Building Statistics | SEO Backlinks Grid',
    description:
      'Comprehensive SEO and link building statistics for 2026.',
  },
}

const statistics = [
  {
    category: 'Backlink Statistics',
    icon: LinkIcon,
    color: 'red',
    stats: [
      { value: '91%', label: 'of pages get no organic traffic due to no backlinks' },
      { value: '66.31%', label: 'of pages have zero backlinks' },
      { value: '3.8x', label: 'more organic traffic for pages with backlinks vs without' },
      { value: '40.7%', label: 'correlation between backlinks and rankings' },
    ],
    source: 'Ahrefs, 2024 Study',
  },
  {
    category: 'Link Building Statistics',
    icon: TrendingUp,
    color: 'yellow',
    stats: [
      { value: '65%', label: 'of marketers say link building is hardest SEO tactic' },
      { value: '$361', label: 'average cost of a guest post backlink' },
      { value: '8.5%', label: 'average response rate for link outreach emails' },
      { value: '12.29%', label: 'of top-ranking pages have no backlinks' },
    ],
    source: 'Backlinko, SEMrush, 2024',
  },
  {
    category: 'SEO Industry Statistics',
    icon: BarChart3,
    color: 'blue',
    stats: [
      { value: '68%', label: 'of online experiences begin with a search engine' },
      { value: '53.3%', label: 'of all website traffic comes from organic search' },
      { value: '0.63%', label: 'of searchers click on page 2 results' },
      { value: '$80B+', label: 'global SEO services market size' },
    ],
    source: 'BrightEdge, SparkToro, 2024',
  },
  {
    category: 'Domain Authority Statistics',
    icon: Users,
    color: 'red',
    stats: [
      { value: 'DA 50+', label: 'considered strong domain authority' },
      { value: '6-12 months', label: 'average time to see DA improvements' },
      { value: '27%', label: 'of all links are nofollow' },
      { value: '2.2%', label: 'of content gets links from multiple websites' },
    ],
    source: 'Moz, Backlinko, 2024',
  },
]

const colorClasses = {
  red: 'bg-bauhaus-red',
  yellow: 'bg-bauhaus-yellow',
  blue: 'bg-bauhaus-blue',
}

export default function StatisticsPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-bauhaus-cream">
        {/* Hero */}
        <section className="py-16 lg:py-24 bg-white border-b-3 border-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-bauhaus-red border-3 border-dark mb-6">
                <BarChart3 className="w-4 h-4 text-white" />
                <span className="text-sm font-bold uppercase tracking-wider text-white">
                  Updated for 2026
                </span>
              </div>
              <h1 className="font-black text-4xl sm:text-5xl uppercase tracking-wide text-dark">
                SEO & Link Building Statistics
              </h1>
              <p className="mt-4 text-xl text-dark/60">
                Data-driven insights to inform your backlink strategy. The latest
                statistics on what works in SEO and link building.
              </p>
            </div>
          </div>
        </section>

        {/* Statistics Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-16">
              {statistics.map((category) => (
                <div key={category.category}>
                  <div className="flex items-center gap-4 mb-8">
                    <div className={`w-14 h-14 ${colorClasses[category.color as keyof typeof colorClasses]} border-3 border-dark flex items-center justify-center`}>
                      <category.icon className="w-7 h-7 text-white" strokeWidth={2.5} />
                    </div>
                    <div>
                      <h2 className="font-bold text-2xl uppercase tracking-wide text-dark">
                        {category.category}
                      </h2>
                      <p className="text-sm text-dark/50">
                        Source: {category.source}
                      </p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {category.stats.map((stat, i) => (
                      <div
                        key={i}
                        className="bg-white border-3 border-dark p-6"
                        style={{ boxShadow: '4px 4px 0px 0px #0A0A0A' }}
                      >
                        <p className="text-4xl font-black text-bauhaus-red mb-2">
                          {stat.value}
                        </p>
                        <p className="text-dark/60">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Key Takeaways */}
        <section className="py-16 bg-white border-y-3 border-dark">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-bold text-2xl uppercase tracking-wide text-dark mb-8 text-center">
              Key Takeaways
            </h2>
            <div className="bg-bauhaus-cream border-3 border-dark p-8 space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-bauhaus-red border-3 border-dark flex items-center justify-center">
                  <span className="text-white font-black">1</span>
                </div>
                <p className="text-dark/70">
                  <strong className="text-dark">Backlinks are essential:</strong> Over 90% of pages with
                  no backlinks get zero organic traffic. Even one quality backlink
                  can make a significant difference.
                </p>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-bauhaus-yellow border-3 border-dark flex items-center justify-center">
                  <span className="text-dark font-black">2</span>
                </div>
                <p className="text-dark/70">
                  <strong className="text-dark">Quality over quantity:</strong> A few links from
                  authoritative, relevant sites are worth more than many links
                  from low-quality sources.
                </p>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-bauhaus-blue border-3 border-dark flex items-center justify-center">
                  <span className="text-white font-black">3</span>
                </div>
                <p className="text-dark/70">
                  <strong className="text-dark">Link building is challenging:</strong> With only an 8.5%
                  response rate on outreach, building links the traditional way
                  requires significant time and effort.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-dark">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-black text-2xl uppercase tracking-wide text-white mb-4">
              Skip the Outreach, Get Your Backlink Now
            </h2>
            <p className="text-white/60 mb-6">
              Why wait months for a response? Get an instant dofollow backlink
              starting at $1.
            </p>
            <Link
              href="/#grid"
              className="btn-bauhaus-red inline-flex items-center gap-2"
            >
              Buy a Square
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
