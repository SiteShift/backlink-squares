'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Search,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  Globe,
  Shield,
  Zap,
  Star,
  Clock,
  BarChart3,
  AlertCircle,
  Link as LinkIcon,
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { BreadcrumbSchema, FAQSchema } from '@/components/seo/JsonLd'

const BASE_URL = 'https://backlinkgrid.com'

// Free backlink checker tools with their URL patterns
const freeCheckers = [
  {
    name: 'Ahrefs Free Backlink Checker',
    description: 'Check the top 100 backlinks from the largest backlink database. Shows Domain Rating and anchor text.',
    url: (domain: string) => `https://ahrefs.com/backlink-checker?input=${encodeURIComponent(domain)}&mode=subdomains`,
    features: ['Top 100 backlinks', 'Domain Rating (DR)', 'Anchor text data', 'Dofollow/nofollow'],
    limit: 'Top 100 links only',
    bestFor: 'Most accurate data',
    color: 'blue',
    rating: 5,
  },
  {
    name: 'Moz Link Explorer',
    description: 'Get Domain Authority, Page Authority, and Spam Score. 10 free queries per month.',
    url: (domain: string) => `https://moz.com/link-explorer?site=${encodeURIComponent(domain)}&target=domain`,
    features: ['Domain Authority (DA)', 'Spam Score', 'Top linking domains', 'Anchor text'],
    limit: '10 queries/month free',
    bestFor: 'Spam detection',
    color: 'yellow',
    rating: 4,
  },
  {
    name: 'Semrush Backlink Analytics',
    description: 'View backlink overview with Authority Score. Part of Semrush\'s free tier.',
    url: (domain: string) => `https://www.semrush.com/analytics/backlinks/overview/?q=${encodeURIComponent(domain)}`,
    features: ['Authority Score', 'Referring domains', 'Follow/nofollow ratio', 'Top anchors'],
    limit: '10 requests/day free',
    bestFor: 'Comprehensive overview',
    color: 'red',
    rating: 4,
  },
  {
    name: 'Ubersuggest',
    description: 'Neil Patel\'s free backlink checker with easy-to-understand interface.',
    url: (domain: string) => `https://app.neilpatel.com/en/seo_analyzer/backlinks?domain=${encodeURIComponent(domain)}`,
    features: ['Domain score', 'Backlink count', 'New/lost links', 'Referring domains'],
    limit: '3 searches/day free',
    bestFor: 'Beginners',
    color: 'yellow',
    rating: 3,
  },
  {
    name: 'OpenLinkProfiler',
    description: 'Free backlink checker with unlimited CSV exports. Unique Link Influence Score.',
    url: (domain: string) => `https://openlinkprofiler.org/r/${encodeURIComponent(domain)}`,
    features: ['Up to 200K links', 'Free CSV export', 'Link Influence Score', 'Industry categorization'],
    limit: 'Unlimited (data may be older)',
    bestFor: 'Free exports',
    color: 'blue',
    rating: 3,
  },
  {
    name: 'Majestic',
    description: 'Unique Trust Flow and Citation Flow metrics for quality assessment.',
    url: (domain: string) => `https://majestic.com/reports/site-explorer?q=${encodeURIComponent(domain)}`,
    features: ['Trust Flow', 'Citation Flow', 'Topical Trust Flow', 'Referring domains'],
    limit: 'Summary data free',
    bestFor: 'Trust-based analysis',
    color: 'yellow',
    rating: 4,
  },
]

// FAQ data for schema
const faqData = [
  {
    question: 'What is a backlink checker?',
    answer: 'A backlink checker is an SEO tool that analyzes the inbound links pointing to a website. It shows you which websites link to you (or your competitors), the quality of those links, anchor text used, and other metrics that help evaluate a site\'s link profile strength.',
  },
  {
    question: 'Which free backlink checker is the most accurate?',
    answer: 'Ahrefs Free Backlink Checker is generally the most accurate, as it draws from the largest backlink database in the industry. However, it only shows the top 100 links in the free version. For comprehensive free data, combining multiple tools (Ahrefs + Moz + Google Search Console) gives the best picture.',
  },
  {
    question: 'How do I check my website\'s backlinks for free?',
    answer: 'Enter your domain in the tool above to get instant links to check it in multiple free backlink checkers. For the most complete view: 1) Set up Google Search Console (shows all links Google knows about), 2) Use Ahrefs Free for top 100 links, 3) Check Moz for Domain Authority and Spam Score.',
  },
  {
    question: 'Can I check competitor backlinks for free?',
    answer: 'Yes, all the free backlink checkers above work for any domain, including competitors. Enter any website URL to analyze their backlink profile, see their best linking domains, and identify link building opportunities you could pursue.',
  },
  {
    question: 'Why do different backlink checkers show different numbers?',
    answer: 'Each tool has its own web crawler that discovers links at different times and frequencies. Ahrefs, Moz, and Semrush all maintain separate databases with different coverage. This is normal—focus on trends and relative comparisons rather than exact numbers.',
  },
  {
    question: 'How often should I check my backlinks?',
    answer: 'For most websites, monthly backlink monitoring is sufficient. If you\'re actively building links, weekly checks help track progress. Set up Google Search Console for ongoing monitoring, and use other tools for periodic deeper analysis.',
  },
  {
    question: 'What metrics should I look for in a backlink checker?',
    answer: 'Key metrics include: referring domains (unique sites linking to you), domain/page authority scores, dofollow vs nofollow ratio, anchor text distribution, and spam/toxic link indicators. The number of linking domains matters more than total link count.',
  },
  {
    question: 'Is Google Search Console a backlink checker?',
    answer: 'Yes, Google Search Console includes a Links report showing external links, top linking sites, and top linked pages—directly from Google\'s index. It\'s free, unlimited, and the most authoritative source for your own site\'s backlinks, though it can\'t analyze competitor sites.',
  },
]

const colorClasses = {
  red: 'bg-brand-red text-white',
  yellow: 'bg-brand-yellow text-surface-950',
  blue: 'bg-brand-blue text-white',
}

export default function FreeBacklinkCheckerPage() {
  const [domain, setDomain] = useState('')
  const [checkedDomain, setCheckedDomain] = useState('')
  const [showResults, setShowResults] = useState(false)

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault()
    if (!domain) return

    // Clean the domain input
    let cleanDomain = domain.trim().toLowerCase()
    cleanDomain = cleanDomain.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]

    setCheckedDomain(cleanDomain)
    setShowResults(true)
  }

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: BASE_URL },
          { name: 'Tools', url: `${BASE_URL}/tools` },
          { name: 'Free Backlink Checker', url: `${BASE_URL}/tools/free-backlink-checker` },
        ]}
      />
      <FAQSchema questions={faqData} />

      <Header />

      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-16 lg:py-24 bg-white border-b-3 border-surface-950 overflow-hidden">
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-red/10 border-2 border-surface-950 mb-6">
              <Search className="w-4 h-4" />
              <span className="text-sm font-bold uppercase tracking-wider">100% Free Tool</span>
            </div>

            <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-surface-950 leading-tight">
              Free Backlink{' '}
              <span className="text-brand-red">Checker</span>
            </h1>
            <p className="mt-6 text-xl text-surface-600 max-w-2xl mx-auto">
              Check backlinks for any website instantly. Enter a domain below and get direct links to analyze it in
              Ahrefs, Moz, Semrush, and other free tools.
            </p>
          </div>
        </section>

        {/* Domain Input Form */}
        <section className="py-12 bg-surface-50 border-b-3 border-surface-950">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <form onSubmit={handleCheck} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="domain" className="sr-only">Enter domain to check</label>
                <input
                  type="text"
                  id="domain"
                  placeholder="Enter any domain (e.g., example.com)"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full px-4 py-4 text-lg border-3 border-surface-950 bg-white focus:outline-none focus:ring-2 focus:ring-brand-red"
                  style={{ boxShadow: '4px 4px 0px 0px #09090B' }}
                />
              </div>
              <Button
                type="submit"
                variant="red"
                size="lg"
                className="sm:w-auto"
              >
                Check Backlinks
                <Search className="w-5 h-5 ml-2" />
              </Button>
            </form>
            <p className="mt-4 text-sm text-surface-500 text-center">
              Works with any website. No signup required. Opens links to free tools in new tabs.
            </p>
          </div>
        </section>

        {/* Results Section */}
        {showResults && checkedDomain && (
          <section className="py-12 bg-brand-blue/5 border-b-3 border-surface-950">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8">
                <h2 className="font-display font-black text-2xl sm:text-3xl text-surface-950 mb-2">
                  Check Backlinks for <span className="text-brand-red font-mono">{checkedDomain}</span>
                </h2>
                <p className="text-surface-600">
                  Click any tool below to check this domain's backlinks. Links open in new tabs.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {freeCheckers.map((tool) => (
                  <a
                    key={tool.name}
                    href={tool.url(checkedDomain)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-white border-3 border-surface-950 overflow-hidden hover:translate-y-[-2px] transition-transform"
                    style={{ boxShadow: '4px 4px 0px 0px #09090B' }}
                  >
                    <div className={`${colorClasses[tool.color as keyof typeof colorClasses]} px-4 py-3 border-b-3 border-surface-950`}>
                      <div className="flex items-center justify-between">
                        <span className="font-bold">{tool.name}</span>
                        <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-surface-600 mb-3">{tool.description}</p>
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < tool.rating ? 'text-brand-yellow fill-brand-yellow' : 'text-surface-300'}`}
                          />
                        ))}
                        <span className="text-xs text-surface-500 ml-2">{tool.bestFor}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-surface-500">
                        <Clock className="w-3 h-3" />
                        {tool.limit}
                      </div>
                    </div>
                  </a>
                ))}
              </div>

              <div className="mt-8 text-center">
                <p className="text-sm text-surface-500 mb-4">
                  Pro tip: Check multiple tools to get the most complete picture of any domain's backlink profile.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowResults(false)
                    setDomain('')
                    setCheckedDomain('')
                  }}
                >
                  Check Another Domain
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* How It Works */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-display font-black text-3xl sm:text-4xl text-surface-950">
                How to Check Backlinks for Free
              </h2>
              <p className="mt-4 text-lg text-surface-600 max-w-2xl mx-auto">
                Follow these steps to analyze any website's backlink profile without paying for expensive tools.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-red border-3 border-surface-950 flex items-center justify-center mx-auto mb-4">
                  <span className="font-display font-black text-2xl text-white">1</span>
                </div>
                <h3 className="font-bold text-xl text-surface-950 mb-2">Enter Any Domain</h3>
                <p className="text-surface-600">
                  Type or paste any website URL in the search box above. Works for your site or any competitor.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-yellow border-3 border-surface-950 flex items-center justify-center mx-auto mb-4">
                  <span className="font-display font-black text-2xl text-surface-950">2</span>
                </div>
                <h3 className="font-bold text-xl text-surface-950 mb-2">Choose Free Tools</h3>
                <p className="text-surface-600">
                  Click on any backlink checker to open it with your domain pre-filled. We recommend starting with Ahrefs Free.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-blue border-3 border-surface-950 flex items-center justify-center mx-auto mb-4">
                  <span className="font-display font-black text-2xl text-white">3</span>
                </div>
                <h3 className="font-bold text-xl text-surface-950 mb-2">Analyze Results</h3>
                <p className="text-surface-600">
                  Review referring domains, domain authority, anchor text, and link quality across multiple tools.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Best Free Tools Comparison */}
        <section className="py-16 lg:py-24 bg-surface-50 border-y-3 border-surface-950">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-display font-black text-3xl sm:text-4xl text-surface-950">
                Best Free Backlink Checkers Compared
              </h2>
              <p className="mt-4 text-lg text-surface-600 max-w-2xl mx-auto">
                Each free tool has different strengths. Here's what each one does best.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full bg-white border-3 border-surface-950">
                <thead>
                  <tr className="bg-surface-950 text-white">
                    <th className="px-4 py-3 text-left font-bold">Tool</th>
                    <th className="px-4 py-3 text-left font-bold">Best For</th>
                    <th className="px-4 py-3 text-left font-bold">Free Limit</th>
                    <th className="px-4 py-3 text-left font-bold">Key Metric</th>
                    <th className="px-4 py-3 text-left font-bold">Exports</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t-2 border-surface-200">
                    <td className="px-4 py-3 font-bold">Ahrefs Free</td>
                    <td className="px-4 py-3">Most accurate data</td>
                    <td className="px-4 py-3">Top 100 links</td>
                    <td className="px-4 py-3">Domain Rating (DR)</td>
                    <td className="px-4 py-3"><span className="text-red-500">No</span></td>
                  </tr>
                  <tr className="border-t-2 border-surface-200 bg-surface-50">
                    <td className="px-4 py-3 font-bold">Moz Free</td>
                    <td className="px-4 py-3">Spam detection</td>
                    <td className="px-4 py-3">10/month</td>
                    <td className="px-4 py-3">Domain Authority (DA)</td>
                    <td className="px-4 py-3"><span className="text-yellow-600">50 rows</span></td>
                  </tr>
                  <tr className="border-t-2 border-surface-200">
                    <td className="px-4 py-3 font-bold">Semrush Free</td>
                    <td className="px-4 py-3">Comprehensive view</td>
                    <td className="px-4 py-3">10/day</td>
                    <td className="px-4 py-3">Authority Score</td>
                    <td className="px-4 py-3"><span className="text-red-500">No</span></td>
                  </tr>
                  <tr className="border-t-2 border-surface-200 bg-surface-50">
                    <td className="px-4 py-3 font-bold">Google Search Console</td>
                    <td className="px-4 py-3">Your own site</td>
                    <td className="px-4 py-3">Unlimited</td>
                    <td className="px-4 py-3">Google's actual index</td>
                    <td className="px-4 py-3"><span className="text-green-600">Yes</span></td>
                  </tr>
                  <tr className="border-t-2 border-surface-200">
                    <td className="px-4 py-3 font-bold">OpenLinkProfiler</td>
                    <td className="px-4 py-3">Free exports</td>
                    <td className="px-4 py-3">200K links</td>
                    <td className="px-4 py-3">Link Influence Score</td>
                    <td className="px-4 py-3"><span className="text-green-600">Unlimited CSV</span></td>
                  </tr>
                  <tr className="border-t-2 border-surface-200 bg-surface-50">
                    <td className="px-4 py-3 font-bold">Majestic Free</td>
                    <td className="px-4 py-3">Trust metrics</td>
                    <td className="px-4 py-3">Summary only</td>
                    <td className="px-4 py-3">Trust Flow / Citation Flow</td>
                    <td className="px-4 py-3"><span className="text-red-500">No</span></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-8 bg-brand-yellow/20 border-3 border-surface-950 p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-brand-yellow border-2 border-surface-950 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-surface-950 mb-2">Pro Tip: Combine Multiple Tools</h3>
                  <p className="text-surface-700">
                    For the most complete picture, use Google Search Console for your own site (authoritative data),
                    Ahrefs Free for competitor research (largest database), and Moz Free for spam detection (unique Spam Score metric).
                    Our <Link href="/blog/best-free-backlink-checkers" className="text-brand-red hover:underline font-bold">detailed comparison guide</Link> covers
                    all 11 best free tools with accuracy testing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What to Look For */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-display font-black text-3xl sm:text-4xl text-surface-950">
                What to Look For When Checking Backlinks
              </h2>
              <p className="mt-4 text-lg text-surface-600 max-w-2xl mx-auto">
                When you check a website's backlinks, focus on these key metrics and signals.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Globe,
                  title: 'Referring Domains',
                  description: 'Count of unique websites linking to you. More important than total links—100 domains with 1 link each beats 1 domain with 100 links.',
                  color: 'blue',
                },
                {
                  icon: BarChart3,
                  title: 'Domain Authority/Rating',
                  description: 'Overall site strength score (DA from Moz, DR from Ahrefs). Higher scores indicate more authoritative sites.',
                  color: 'yellow',
                },
                {
                  icon: LinkIcon,
                  title: 'Dofollow vs Nofollow',
                  description: 'Dofollow links pass SEO value; nofollow traditionally don\'t. A natural profile has 60-80% dofollow.',
                  color: 'red',
                },
                {
                  icon: Shield,
                  title: 'Spam Score',
                  description: 'Risk indicator from Moz showing percentage of similar sites penalized. High spam score (60+) is a red flag.',
                  color: 'red',
                },
                {
                  icon: CheckCircle2,
                  title: 'Anchor Text',
                  description: 'Text used in links. Look for natural variety—too many exact-match keyword anchors signals manipulation.',
                  color: 'blue',
                },
                {
                  icon: AlertCircle,
                  title: 'Toxic Links',
                  description: 'Links from spammy, irrelevant, or penalized sites that could harm your rankings. Most tools flag these.',
                  color: 'yellow',
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="bg-surface-50 border-3 border-surface-950 p-6"
                  style={{ boxShadow: '4px 4px 0px 0px #09090B' }}
                >
                  <div className={`w-12 h-12 ${colorClasses[item.color as keyof typeof colorClasses]} border-2 border-surface-950 flex items-center justify-center mb-4`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg text-surface-950 mb-2">{item.title}</h3>
                  <p className="text-surface-600 text-sm">{item.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link href="/tools/backlink-analyzer">
                <Button variant="outline" className="group">
                  Use Our Detailed Analysis Checklist
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 lg:py-24 bg-surface-50 border-y-3 border-surface-950">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-display font-black text-3xl sm:text-4xl text-surface-950">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              {faqData.map((faq, i) => (
                <div key={i} className="bg-white border-3 border-surface-950 p-6">
                  <h3 className="font-bold text-lg text-surface-950 mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-surface-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Bundle CTA */}
              <div
                className="bg-brand-red border-3 border-surface-950 p-8"
                style={{ boxShadow: '6px 6px 0px 0px #09090B' }}
              >
                <h3 className="font-display font-black text-2xl text-white mb-3">
                  Ready to Build Backlinks?
                </h3>
                <p className="text-white/80 mb-6">
                  Checking backlinks is just the first step. Start building your own backlink profile
                  with permanent dofollow links.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-white/90 text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    Permanent dofollow backlinks
                  </li>
                  <li className="flex items-center gap-2 text-white/90 text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    Links start at just $1
                  </li>
                  <li className="flex items-center gap-2 text-white/90 text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    No monthly fees
                  </li>
                </ul>
                <Link href="/pricing">
                  <Button variant="yellow" size="lg" className="w-full group">
                    See Pricing
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>

              {/* Learn More CTA */}
              <div
                className="bg-brand-blue border-3 border-surface-950 p-8"
                style={{ boxShadow: '6px 6px 0px 0px #09090B' }}
              >
                <h3 className="font-display font-black text-2xl text-white mb-3">
                  Want the Full Comparison?
                </h3>
                <p className="text-white/80 mb-6">
                  We tested 25+ backlink checkers with real websites and measured their accuracy.
                  See which tools actually work.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-white/90 text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    11 tools tested for accuracy
                  </li>
                  <li className="flex items-center gap-2 text-white/90 text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    Side-by-side comparisons
                  </li>
                  <li className="flex items-center gap-2 text-white/90 text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    Best tool for each use case
                  </li>
                </ul>
                <Link href="/blog/best-free-backlink-checkers">
                  <Button variant="yellow" size="lg" className="w-full group">
                    Read Full Comparison
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Related Resources */}
        <section className="py-16 lg:py-24 bg-surface-950">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white mb-4">
              Learn More About Backlinks
            </h2>
            <p className="text-xl text-white/60 mb-8 max-w-2xl mx-auto">
              Understanding backlinks is the first step to building them effectively.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/backlinks">
                <Button variant="primary" size="lg" className="group bg-white text-surface-950 hover:bg-brand-yellow">
                  Backlinks Guide
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/backlink-quality">
                <Button variant="outline" size="lg" className="group border-white text-white hover:bg-white hover:text-surface-950">
                  Evaluating Link Quality
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
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
