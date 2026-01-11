import { Metadata } from 'next'
import Link from 'next/link'
import { Clock, ArrowRight, BookOpen } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'SEO & Link Building Guides - In-Depth Resources',
  description:
    'Comprehensive guides on backlinks, link building strategies, and SEO. Learn from our in-depth pillar content.',
  openGraph: {
    title: 'SEO & Link Building Guides | SEO Backlinks Grid',
    description:
      'In-depth guides covering everything you need to know about backlinks and link building.',
  },
}

const guides = [
  {
    slug: 'what-are-backlinks-complete-guide',
    title: 'What Are Backlinks? The Complete Guide',
    description:
      'Everything you need to know about backlinks - what they are, why they matter, types of backlinks, and how to build them effectively.',
    readingTime: '25 min read',
    chapters: [
      'Understanding Backlinks',
      'Types of Backlinks',
      'How Search Engines Evaluate Links',
      'Building Your First Backlinks',
      'Advanced Link Building Tactics',
    ],
    color: 'red',
  },
  {
    slug: 'link-building-strategies-guide',
    title: 'Link Building Strategies: The Definitive Guide',
    description:
      'Master every link building technique - from guest posting to broken link building, HARO, and more. Actionable strategies that work.',
    readingTime: '30 min read',
    chapters: [
      'Content-Based Link Building',
      'Outreach Strategies',
      'Technical Link Building',
      'Local Link Building',
      'Measuring Success',
    ],
    color: 'yellow',
  },
  {
    slug: 'domain-authority-guide',
    title: 'Domain Authority Explained: How to Improve Your DA',
    description:
      'A comprehensive guide to understanding and improving your Domain Authority. Learn what affects DA and how to grow it.',
    readingTime: '20 min read',
    chapters: [
      'What is Domain Authority?',
      'DA vs DR vs Other Metrics',
      'Factors That Affect DA',
      'Strategies to Improve DA',
      'Common DA Myths',
    ],
    color: 'blue',
  },
]

const colorClasses = {
  red: {
    bg: 'bg-bauhaus-red/10',
    icon: 'bg-bauhaus-red',
    badge: 'bg-bauhaus-red text-white',
  },
  yellow: {
    bg: 'bg-bauhaus-yellow/20',
    icon: 'bg-bauhaus-yellow',
    badge: 'bg-bauhaus-yellow text-dark',
  },
  blue: {
    bg: 'bg-bauhaus-blue/10',
    icon: 'bg-bauhaus-blue',
    badge: 'bg-bauhaus-blue text-white',
  },
}

export default function GuidesPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-bauhaus-cream">
        {/* Hero */}
        <section className="py-16 lg:py-24 bg-white border-b-3 border-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-bauhaus-yellow border-3 border-dark mb-6">
                <BookOpen className="w-4 h-4 text-dark" />
                <span className="text-sm font-bold uppercase tracking-wider text-dark">
                  Pillar Content
                </span>
              </div>
              <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-dark leading-tight">
                In-Depth SEO Guides
              </h1>
              <p className="mt-4 text-xl text-dark/60">
                Comprehensive, long-form guides covering everything you need to
                master backlinks and link building. Each guide is packed with
                actionable strategies and real-world examples.
              </p>
            </div>
          </div>
        </section>

        {/* Guides List */}
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-8">
              {guides.map((guide, index) => {
                const colors = colorClasses[guide.color as keyof typeof colorClasses]
                return (
                  <Link
                    key={guide.slug}
                    href={`/guides/${guide.slug}`}
                    className="group block bg-white border-3 border-dark hover:shadow-bauhaus-lg transition-all"
                    style={{ boxShadow: '4px 4px 0px 0px #0A0A0A' }}
                  >
                    <div className="p-8 lg:p-10">
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-4">
                            <span
                              className={`inline-flex items-center justify-center w-10 h-10 border-3 border-dark ${colors.icon}`}
                            >
                              <BookOpen className="w-5 h-5 text-white" />
                            </span>
                            <span
                              className={`text-sm font-bold uppercase tracking-wider px-3 py-1 border-2 border-dark ${colors.badge}`}
                            >
                              Guide {index + 1}
                            </span>
                            <span className="flex items-center gap-1.5 text-sm text-dark/50">
                              <Clock className="w-4 h-4" />
                              {guide.readingTime}
                            </span>
                          </div>

                          <h2 className="font-display font-black text-2xl lg:text-3xl text-dark mb-3 group-hover:text-bauhaus-red transition-colors leading-tight">
                            {guide.title}
                          </h2>

                          <p className="text-dark/60 mb-6">
                            {guide.description}
                          </p>

                          <div className="space-y-2">
                            <p className="text-sm font-bold text-dark/50 uppercase tracking-wider">
                              Chapters
                            </p>
                            <ol className="grid sm:grid-cols-2 gap-2">
                              {guide.chapters.map((chapter, i) => (
                                <li
                                  key={i}
                                  className="flex items-center gap-2 text-sm text-dark/70"
                                >
                                  <span className="flex-shrink-0 w-6 h-6 bg-bauhaus-cream border-2 border-dark flex items-center justify-center text-xs font-bold text-dark">
                                    {i + 1}
                                  </span>
                                  {chapter}
                                </li>
                              ))}
                            </ol>
                          </div>
                        </div>

                        <div className="lg:self-center">
                          <span className="inline-flex items-center gap-2 font-bold uppercase tracking-wider text-bauhaus-red group-hover:gap-3 transition-all">
                            Read Guide
                            <ArrowRight className="w-5 h-5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-dark">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white mb-4">
              Ready to Put This Knowledge into Action?
            </h2>
            <p className="text-white/60 mb-6">
              Get your first backlink today. No outreach required.
            </p>
            <Link
              href="/#grid"
              className="btn-bauhaus-yellow inline-flex items-center gap-2"
            >
              Buy a Square - From $1
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
