'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Link as LinkIcon,
  Shield,
  BarChart3,
  ExternalLink,
  ArrowRight,
  Zap,
  Target,
  Globe,
  FileText,
  ChevronRight,
  Sparkles,
  AlertCircle,
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { BreadcrumbSchema, FAQSchema } from '@/components/seo/JsonLd'

const BASE_URL = 'https://backlinkgrid.com'

// Checklist items for analyzing a backlink profile
const analysisChecklist = [
  {
    id: 'referring-domains',
    title: 'Total Referring Domains',
    description: 'Count unique domains linking to your site. More referring domains generally correlates with higher rankings.',
    icon: Globe,
    whatToLook: [
      'Steady growth over time (not sudden spikes)',
      'Diverse mix of domains (not all from one network)',
      'Quality over quantity - 50 authoritative domains beats 500 low-quality ones',
    ],
    redFlags: [
      'Sudden massive increases (possible link spam)',
      'Most links from a single country/language unrelated to your market',
      'High percentage from known link networks',
    ],
  },
  {
    id: 'dofollow-nofollow',
    title: 'Dofollow vs Nofollow Ratio',
    description: 'Analyze the balance between dofollow links (pass authority) and nofollow links (do not pass authority).',
    icon: LinkIcon,
    whatToLook: [
      'Natural ratio: typically 60-80% dofollow, 20-40% nofollow',
      'Nofollow from social media, forums, and press releases is normal',
      'High-authority sites often use nofollow - still valuable for traffic',
    ],
    redFlags: [
      '100% dofollow links (unnatural pattern)',
      'Very high percentage from guest posts only',
      'Dofollow links from irrelevant or spammy sites',
    ],
  },
  {
    id: 'anchor-text',
    title: 'Anchor Text Distribution',
    description: 'Review the clickable text used in links pointing to your site. Over-optimization is a major red flag.',
    icon: FileText,
    whatToLook: [
      'Branded anchors (your brand name) should be 30-40%+',
      'Natural mix: branded, URL, generic ("click here"), partial match',
      'Exact-match keyword anchors should be <5% for most sites',
    ],
    redFlags: [
      'High percentage of exact-match keyword anchors',
      'Same anchor text repeated many times',
      'Unnatural phrases or keyword stuffing',
    ],
  },
  {
    id: 'link-velocity',
    title: 'Link Velocity',
    description: 'Track how quickly you acquire (or lose) backlinks over time.',
    icon: TrendingUp,
    whatToLook: [
      'Consistent, gradual growth aligned with content production',
      'Spikes that correlate with viral content or PR campaigns',
      'Stable baseline with occasional peaks from successful campaigns',
    ],
    redFlags: [
      'Sudden massive link acquisition followed by plateau',
      'Rapid loss of links without explanation',
      'Patterns that coincide with known link scheme crackdowns',
    ],
  },
  {
    id: 'top-referring',
    title: 'Top Referring Domains',
    description: 'Identify your most valuable link sources and understand where your authority comes from.',
    icon: BarChart3,
    whatToLook: [
      'Links from industry-relevant authoritative sites',
      'Editorial links from news sites, blogs, and publications',
      'Resource pages and directories in your niche',
    ],
    redFlags: [
      'Top referring domains are all link directories',
      'Most valuable links from unrelated industries',
      'Heavy reliance on PBNs (private blog networks)',
    ],
  },
  {
    id: 'toxic-links',
    title: 'Toxic Link Percentage',
    description: 'Identify potentially harmful links that could trigger algorithmic penalties or manual actions.',
    icon: AlertTriangle,
    whatToLook: [
      'Less than 5% of links flagged as potentially toxic',
      'No links from known spam networks or hacked sites',
      'Clean backlink profile with minimal risk indicators',
    ],
    redFlags: [
      'Links from sites with malware or adult content',
      'Paid links without nofollow attribute',
      'Links from link farms, PBNs, or comment spam',
    ],
  },
]

// Profile recommendations based on size
const profileRecommendations = [
  {
    type: 'new',
    title: 'New Site',
    range: '0-50 Referring Domains',
    color: 'yellow',
    icon: Sparkles,
    description: 'You\'re just getting started. Focus on building a solid foundation.',
    recommendations: [
      'Claim your business profiles on major directories (Google Business, Yelp, industry-specific)',
      'Create genuinely valuable content that naturally attracts links',
      'Reach out to industry bloggers for guest posting opportunities',
      'Get listed in relevant niche directories',
      'Build relationships before asking for links',
    ],
    priorities: [
      'Quality over quantity - each link matters more at this stage',
      'Build diverse link types: profiles, guest posts, resource links',
      'Avoid paid links or link schemes - penalties hit harder when small',
    ],
  },
  {
    type: 'growing',
    title: 'Growing Site',
    range: '50-200 Referring Domains',
    color: 'blue',
    icon: TrendingUp,
    description: 'You have momentum. Time to scale strategically.',
    recommendations: [
      'Double down on what\'s working - analyze your best links and replicate',
      'Create linkable assets: original research, tools, comprehensive guides',
      'Start digital PR campaigns for higher-authority placements',
      'Build relationships with journalists and bloggers in your space',
      'Consider broken link building for quick wins',
    ],
    priorities: [
      'Start tracking competitors\' backlinks for opportunities',
      'Audit existing links for toxic or low-quality ones',
      'Develop a consistent content + outreach cadence',
    ],
  },
  {
    type: 'established',
    title: 'Established Site',
    range: '200+ Referring Domains',
    color: 'red',
    icon: Shield,
    description: 'You have authority. Focus on protection and high-value growth.',
    recommendations: [
      'Prioritize high-DR editorial placements over volume',
      'Create newsworthy content and data studies for passive link acquisition',
      'Build HARO and journalist relationships for ongoing coverage',
      'Develop strategic partnerships for co-marketing opportunities',
      'Consider sponsoring research, events, or scholarships for .edu links',
    ],
    priorities: [
      'Regular toxic link audits and disavow file maintenance',
      'Monitor for negative SEO and link loss',
      'Focus on maintaining link velocity, not just acquiring more',
    ],
  },
]

// Recommended tools for analysis
const recommendedTools = [
  {
    name: 'Ahrefs',
    description: 'Industry-leading backlink database with comprehensive analysis tools. Best for competitive analysis.',
    features: ['Largest backlink index', 'Detailed anchor text analysis', 'Lost/new link tracking', 'Toxic link detection'],
    pricing: 'From $99/month',
    url: 'https://ahrefs.com',
    best: 'Overall backlink analysis',
  },
  {
    name: 'Semrush',
    description: 'All-in-one SEO suite with powerful backlink analytics and toxic link auditing.',
    features: ['Backlink audit tool', 'Toxic score algorithm', 'Link building opportunities', 'Competitor gap analysis'],
    pricing: 'From $129/month',
    url: 'https://semrush.com',
    best: 'Toxic link detection',
  },
  {
    name: 'Moz Link Explorer',
    description: 'User-friendly backlink checker with Domain Authority metrics and spam score.',
    features: ['Domain Authority metric', 'Spam score analysis', 'Link tracking lists', 'Competitive research'],
    pricing: 'Free tier available, Pro from $99/month',
    url: 'https://moz.com/link-explorer',
    best: 'Domain Authority tracking',
  },
  {
    name: 'Majestic',
    description: 'Specialized link intelligence with unique Trust Flow and Citation Flow metrics.',
    features: ['Trust Flow metric', 'Citation Flow metric', 'Topical Trust Flow', 'Historic Index'],
    pricing: 'From $49/month',
    url: 'https://majestic.com',
    best: 'Trust-based analysis',
  },
  {
    name: 'Google Search Console',
    description: 'Free tool from Google showing links Google has actually found and indexed.',
    features: ['Free and official', 'Shows indexed links', 'Top linking sites', 'Internal link data'],
    pricing: 'Free',
    url: 'https://search.google.com/search-console',
    best: 'Free official data',
  },
]

// FAQ data
const faqData = [
  {
    question: 'How often should I analyze my backlink profile?',
    answer: 'For most sites, a monthly review is sufficient. However, if you\'re actively building links or have experienced ranking fluctuations, weekly monitoring is recommended. Set up alerts in your preferred tool to catch sudden changes.',
  },
  {
    question: 'What is a "toxic" backlink?',
    answer: 'Toxic backlinks are links from spammy, low-quality, or manipulative sources that could potentially harm your site\'s rankings. Examples include links from link farms, hacked sites, sites with malware, or excessive paid links without proper disclosure. Most SEO tools have algorithms to flag potentially toxic links.',
  },
  {
    question: 'Should I disavow all toxic links?',
    answer: 'Not necessarily. Google has stated they\'re good at ignoring spammy links. Only disavow if you\'ve received a manual action, have a very high percentage of toxic links, or know specific links were part of a link scheme. Over-disavowing can actually hurt your rankings.',
  },
  {
    question: 'How many backlinks do I need to rank?',
    answer: 'There\'s no magic number. What matters is the quality and relevance of your links relative to your competition. A page with 10 high-quality, relevant links can outrank one with 1,000 low-quality links. Analyze your top-ranking competitors to understand what\'s needed in your specific niche.',
  },
  {
    question: 'Why do backlink counts differ between tools?',
    answer: 'Each tool has its own web crawler and database. They discover links at different times and may count them differently. Ahrefs, Semrush, and Moz will show different numbers - this is normal. Use one tool consistently for trend analysis rather than comparing absolute numbers across tools.',
  },
]

const colorClasses = {
  red: 'bg-brand-red',
  yellow: 'bg-brand-yellow',
  blue: 'bg-brand-blue',
}

export default function BacklinkAnalyzerPage() {
  const [domain, setDomain] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [checkedItems, setCheckedItems] = useState<string[]>([])

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault()
    if (!domain) return

    setIsAnalyzing(true)
    // Simulate analysis
    setTimeout(() => {
      setIsAnalyzing(false)
      setShowResults(true)
    }, 1500)
  }

  const toggleCheckItem = (id: string) => {
    setCheckedItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: BASE_URL },
          { name: 'Tools', url: `${BASE_URL}/tools` },
          { name: 'Backlink Analyzer', url: `${BASE_URL}/tools/backlink-analyzer` },
        ]}
      />
      <FAQSchema questions={faqData} />

      <Header />

      <main className="min-h-screen">
        {/* Hero */}
        <section className="relative py-16 lg:py-24 bg-white border-b-3 border-surface-950 overflow-hidden">
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-yellow/20 border-2 border-surface-950 mb-6">
              <Search className="w-4 h-4" />
              <span className="text-sm font-bold uppercase tracking-wider">Free Educational Tool</span>
            </div>

            <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-surface-950 leading-tight">
              Backlink Profile{' '}
              <span className="text-brand-red">Analyzer</span>
            </h1>
            <p className="mt-6 text-xl text-surface-600 max-w-2xl mx-auto">
              Learn what to look for when analyzing your backlink profile.
              Use this checklist with your preferred SEO tool to evaluate link quality and identify opportunities.
            </p>
          </div>
        </section>

        {/* Domain Input Form */}
        <section className="py-12 bg-surface-50 border-b-3 border-surface-950">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <form onSubmit={handleAnalyze} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="domain" className="sr-only">Enter your domain</label>
                <input
                  type="text"
                  id="domain"
                  placeholder="Enter your domain (e.g., example.com)"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full px-4 py-4 text-lg border-3 border-surface-950 bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  style={{ boxShadow: '4px 4px 0px 0px #09090B' }}
                />
              </div>
              <Button
                type="submit"
                variant="red"
                size="lg"
                isLoading={isAnalyzing}
                className="sm:w-auto"
              >
                {isAnalyzing ? 'Generating...' : 'Generate Checklist'}
              </Button>
            </form>
            <p className="mt-4 text-sm text-surface-500 text-center">
              We don't store your domain. This tool generates a personalized checklist for manual analysis.
            </p>
          </div>
        </section>

        {/* Results / Checklist Section */}
        {showResults && domain && (
          <section className="py-12 bg-brand-yellow/10 border-b-3 border-surface-950">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white border-3 border-surface-950 p-6 sm:p-8" style={{ boxShadow: '6px 6px 0px 0px #09090B' }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-brand-blue border-3 border-surface-950 flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-xl text-surface-950">Analysis Checklist for:</h2>
                    <p className="text-brand-red font-mono font-bold">{domain}</p>
                  </div>
                </div>

                <p className="text-surface-600 mb-6">
                  Use this checklist with Ahrefs, Semrush, or another backlink tool to analyze <strong>{domain}</strong>.
                  Check off each item as you review it.
                </p>

                <div className="space-y-4">
                  {analysisChecklist.map((item) => (
                    <div
                      key={item.id}
                      className={`border-2 border-surface-950 p-4 transition-colors ${
                        checkedItems.includes(item.id) ? 'bg-green-50' : 'bg-white'
                      }`}
                    >
                      <label className="flex items-start gap-4 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checkedItems.includes(item.id)}
                          onChange={() => toggleCheckItem(item.id)}
                          className="w-6 h-6 mt-1 border-2 border-surface-950 rounded-none accent-brand-blue"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <item.icon className="w-5 h-5 text-brand-blue" />
                            <span className="font-bold text-surface-950">{item.title}</span>
                          </div>
                          <p className="text-sm text-surface-600 mt-1">{item.description}</p>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t-2 border-surface-200">
                  <p className="text-sm text-surface-600">
                    <strong>Progress:</strong> {checkedItems.length} of {analysisChecklist.length} items reviewed
                  </p>
                  <div className="mt-2 h-2 bg-surface-200 border border-surface-950">
                    <div
                      className="h-full bg-brand-blue transition-all"
                      style={{ width: `${(checkedItems.length / analysisChecklist.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* What to Analyze - Educational Content */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-display font-black text-3xl sm:text-4xl text-surface-950">
                What to Analyze in Your Backlink Profile
              </h2>
              <p className="mt-4 text-lg text-surface-600 max-w-2xl mx-auto">
                A thorough backlink audit examines six key areas. Here's exactly what to look for in each.
              </p>
            </div>

            <div className="space-y-8">
              {analysisChecklist.map((item, index) => {
                const colors = ['red', 'yellow', 'blue'] as const
                const color = colors[index % 3]
                return (
                  <div
                    key={item.id}
                    className="bg-surface-50 border-3 border-surface-950 overflow-hidden"
                    style={{ boxShadow: '4px 4px 0px 0px #09090B' }}
                  >
                    <div className={`${colorClasses[color]} px-6 py-4 border-b-3 border-surface-950`}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white border-2 border-surface-950 flex items-center justify-center">
                          <item.icon className="w-5 h-5 text-surface-950" />
                        </div>
                        <h3 className={`font-bold text-xl ${color === 'yellow' ? 'text-surface-950' : 'text-white'}`}>
                          {item.title}
                        </h3>
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="text-surface-700 mb-6">{item.description}</p>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                            <span className="font-bold text-surface-950 uppercase text-sm tracking-wider">What to Look For</span>
                          </div>
                          <ul className="space-y-2">
                            {item.whatToLook.map((point, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-surface-600">
                                <ChevronRight className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                {point}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <AlertCircle className="w-5 h-5 text-red-600" />
                            <span className="font-bold text-surface-950 uppercase text-sm tracking-wider">Red Flags</span>
                          </div>
                          <ul className="space-y-2">
                            {item.redFlags.map((flag, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-surface-600">
                                <ChevronRight className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                                {flag}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Profile Size Recommendations */}
        <section className="py-16 lg:py-24 bg-surface-50 border-y-3 border-surface-950">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-display font-black text-3xl sm:text-4xl text-surface-950">
                Recommendations by Profile Size
              </h2>
              <p className="mt-4 text-lg text-surface-600 max-w-2xl mx-auto">
                Your link building strategy should match your current profile. Here's what to prioritize based on where you are.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {profileRecommendations.map((profile) => (
                <div
                  key={profile.type}
                  className="bg-white border-3 border-surface-950 overflow-hidden"
                  style={{ boxShadow: '4px 4px 0px 0px #09090B' }}
                >
                  <div className={`${colorClasses[profile.color as keyof typeof colorClasses]} px-6 py-4 border-b-3 border-surface-950`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white border-2 border-surface-950 flex items-center justify-center">
                        <profile.icon className={`w-5 h-5 ${profile.color === 'yellow' ? 'text-surface-950' : 'text-surface-950'}`} />
                      </div>
                      <div>
                        <h3 className={`font-bold text-lg ${profile.color === 'yellow' ? 'text-surface-950' : 'text-white'}`}>
                          {profile.title}
                        </h3>
                        <p className={`text-sm ${profile.color === 'yellow' ? 'text-surface-700' : 'text-white/80'}`}>
                          {profile.range}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-surface-600 mb-4">{profile.description}</p>

                    <div className="mb-6">
                      <h4 className="font-bold text-surface-950 text-sm uppercase tracking-wider mb-3">
                        Recommended Actions
                      </h4>
                      <ul className="space-y-2">
                        {profile.recommendations.map((rec, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-surface-600">
                            <CheckCircle2 className="w-4 h-4 text-brand-blue mt-0.5 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4 border-t-2 border-surface-200">
                      <h4 className="font-bold text-surface-950 text-sm uppercase tracking-wider mb-3">
                        Key Priorities
                      </h4>
                      <ul className="space-y-2">
                        {profile.priorities.map((priority, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-surface-600">
                            <Zap className="w-4 h-4 text-brand-yellow mt-0.5 flex-shrink-0" />
                            {priority}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tool Recommendations */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-display font-black text-3xl sm:text-4xl text-surface-950">
                Best Tools for Backlink Analysis
              </h2>
              <p className="mt-4 text-lg text-surface-600 max-w-2xl mx-auto">
                To actually check your backlinks, you'll need one of these professional SEO tools.
                Each has unique strengths for different use cases.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedTools.map((tool, index) => (
                <div
                  key={tool.name}
                  className="bg-surface-50 border-3 border-surface-950 p-6"
                  style={{ boxShadow: '4px 4px 0px 0px #09090B' }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-xl text-surface-950">{tool.name}</h3>
                    <span className="text-xs font-bold text-brand-red uppercase tracking-wider bg-brand-red/10 px-2 py-1">
                      {tool.best}
                    </span>
                  </div>
                  <p className="text-sm text-surface-600 mb-4">{tool.description}</p>

                  <ul className="space-y-2 mb-4">
                    {tool.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-surface-700">
                        <CheckCircle2 className="w-4 h-4 text-brand-blue flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="pt-4 border-t-2 border-surface-200 flex items-center justify-between">
                    <span className="text-sm font-bold text-surface-950">{tool.pricing}</span>
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-bold text-brand-red hover:underline"
                    >
                      Visit Site
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
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

        {/* CTA Sections */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Bundle CTA */}
              <div
                className="bg-brand-red border-3 border-surface-950 p-8"
                style={{ boxShadow: '6px 6px 0px 0px #09090B' }}
              >
                <div className="w-12 h-12 bg-white border-3 border-surface-950 flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-brand-red" />
                </div>
                <h3 className="font-display font-black text-2xl text-white mb-3">
                  Ready to Build Backlinks?
                </h3>
                <p className="text-white/80 mb-6">
                  Get our database of 270+ verified high-DR backlink opportunities.
                  Skip the research and start building links today.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-white/90 text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    270+ verified sites with DR ratings
                  </li>
                  <li className="flex items-center gap-2 text-white/90 text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    Direct submission URLs included
                  </li>
                  <li className="flex items-center gap-2 text-white/90 text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    One-time purchase, lifetime access
                  </li>
                </ul>
                <Link href="/bundle">
                  <Button variant="yellow" size="lg" className="w-full group">
                    Get the Bundle
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>

              {/* Grid CTA */}
              <div
                className="bg-brand-blue border-3 border-surface-950 p-8"
                style={{ boxShadow: '6px 6px 0px 0px #09090B' }}
              >
                <div className="w-12 h-12 bg-white border-3 border-surface-950 flex items-center justify-center mb-4">
                  <LinkIcon className="w-6 h-6 text-brand-blue" />
                </div>
                <h3 className="font-display font-black text-2xl text-white mb-3">
                  Get Your First Backlink for $1
                </h3>
                <p className="text-white/80 mb-6">
                  Start building your backlink profile today with a permanent dofollow link
                  from Backlink Grid. No outreach required.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-white/90 text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    Permanent dofollow backlink
                  </li>
                  <li className="flex items-center gap-2 text-white/90 text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    Goes live instantly
                  </li>
                  <li className="flex items-center gap-2 text-white/90 text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    No monthly fees
                  </li>
                </ul>
                <Link href="/#grid">
                  <Button variant="yellow" size="lg" className="w-full group">
                    Claim Your Square
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Learn More CTA */}
        <section className="py-16 lg:py-24 bg-surface-950">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white mb-4">
              New to Link Building?
            </h2>
            <p className="text-xl text-white/60 mb-8 max-w-2xl mx-auto">
              Learn everything you need to know about backlinks and link building with our comprehensive guides.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/backlinks">
                <Button variant="primary" size="lg" className="group bg-white text-surface-950 hover:bg-brand-yellow">
                  Backlinks Guide
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/link-building">
                <Button variant="outline" size="lg" className="group border-white text-white hover:bg-white hover:text-surface-950">
                  Link Building Strategy
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
