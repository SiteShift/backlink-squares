import Link from 'next/link'
import { ArrowRight, GitCompare, BookOpen, FileText } from 'lucide-react'

const resourceCategories = [
  {
    title: 'Free Resources',
    icon: FileText,
    color: 'bg-brand-red',
    borderColor: 'border-brand-red',
    textColor: 'text-brand-red',
    links: [
      {
        href: '/blog/best-free-backlink-checkers',
        label: 'Best Free Backlink Checkers (2026)',
        description: 'Compare the top free tools to check any site\'s backlink profile.',
      },
      {
        href: '/blog/best-guest-posting-sites-2026',
        label: 'Best Guest Posting Sites',
        description: 'Curated list of high-authority sites that accept guest posts.',
      },
    ],
  },
  {
    title: 'Tool Comparisons',
    icon: GitCompare,
    color: 'bg-brand-blue',
    borderColor: 'border-brand-blue',
    textColor: 'text-brand-blue',
    links: [
      {
        href: '/comparisons/ahrefs-vs-moz',
        label: 'Ahrefs vs Moz',
        description: 'Side-by-side comparison of two leading backlink analysis platforms.',
      },
      {
        href: '/comparisons/semrush-vs-moz',
        label: 'Semrush vs Moz',
        description: 'Compare features, pricing, and backlink data accuracy.',
      },
      {
        href: '/comparisons/majestic-alternatives',
        label: 'Majestic Alternatives',
        description: 'Top alternatives to Majestic for backlink analysis and SEO.',
      },
    ],
  },
  {
    title: 'SEO Guides',
    icon: BookOpen,
    color: 'bg-brand-yellow',
    borderColor: 'border-brand-yellow',
    textColor: 'text-brand-yellow',
    links: [
      {
        href: '/backlink-quality/google-link-spam',
        label: 'Google Link Spam Policies Guide',
        description: 'Understand Google\'s link spam policies and how to stay compliant.',
      },
      {
        href: '/blog/moz-link-explorer-guide',
        label: 'Moz Link Explorer: Complete Guide',
        description: 'How to use Moz Link Explorer for backlink research and analysis.',
      },
      {
        href: '/glossary/page-authority',
        label: 'Page Authority: What It Is and How to Improve It',
        description: 'Learn what Page Authority measures and how to increase your score.',
      },
    ],
  },
]

export function PopularResources() {
  return (
    <section className="section-padding bg-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 pattern-dots opacity-30" />

      {/* Decorative elements */}
      <div className="absolute top-10 left-0 w-40 h-40 bg-brand-red/5 -translate-x-1/2" />
      <div className="absolute bottom-10 right-0 w-32 h-32 bg-brand-blue/5 translate-x-1/2 rounded-full" />

      <div className="container-wide relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="section-label mx-auto mb-8">
            <span className="section-label-dot bg-brand-blue" />
            <span>Popular Resources</span>
          </div>

          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight">
            Learn About{' '}
            <span className="text-brand-blue">Backlinks</span>
          </h2>

          <p className="mt-6 text-lg text-surface-600 max-w-2xl mx-auto">
            Free guides, tool comparisons, and expert resources to help you build a stronger backlink profile and improve your search rankings.
          </p>
        </div>

        {/* Resource Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {resourceCategories.map((category) => (
            <div
              key={category.title}
              className="border-2 border-surface-950 bg-white"
              style={{ boxShadow: '4px 4px 0 0 rgba(0,0,0,0.1)' }}
            >
              {/* Category Header */}
              <div className={`flex items-center gap-3 px-6 py-4 ${category.color} border-b-2 border-surface-950`}>
                <category.icon className="w-5 h-5 text-white" strokeWidth={2.5} />
                <h3 className="font-display font-bold text-sm uppercase tracking-widest text-white">
                  {category.title}
                </h3>
              </div>

              {/* Links */}
              <ul className="divide-y divide-surface-100">
                {category.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group flex items-start gap-3 px-6 py-5 hover:bg-surface-50 transition-colors"
                    >
                      <ArrowRight className={`w-4 h-4 mt-0.5 flex-shrink-0 ${category.textColor} opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all`} />
                      <div className="-ml-7 group-hover:ml-0 transition-all">
                        <span className="font-bold text-surface-950 group-hover:text-surface-700 transition-colors block leading-snug">
                          {link.label}
                        </span>
                        <span className="text-sm text-surface-500 mt-1 block leading-relaxed">
                          {link.description}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Browse All Link */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-6 flex-wrap justify-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-5 py-3 border-2 border-surface-950 font-bold text-sm uppercase tracking-wider hover:bg-surface-950 hover:text-white transition-all"
            >
              Browse All Articles
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/comparisons"
              className="inline-flex items-center gap-2 px-5 py-3 border-2 border-surface-950 font-bold text-sm uppercase tracking-wider hover:bg-surface-950 hover:text-white transition-all"
            >
              All Tool Comparisons
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/glossary"
              className="inline-flex items-center gap-2 px-5 py-3 border-2 border-surface-950 font-bold text-sm uppercase tracking-wider hover:bg-surface-950 hover:text-white transition-all"
            >
              SEO Glossary
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
