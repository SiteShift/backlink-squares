'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Database,
  CheckCircle2,
  Clock,
  Zap,
  FileSpreadsheet,
  Star,
  Shield,
  Download,
  ChevronDown,
} from 'lucide-react'
import { bundleFaqs } from './bundleData'

const benefits = [
  {
    icon: Database,
    title: '270+ Verified Sites',
    description: 'Every site personally verified and tested for quality backlinks',
  },
  {
    icon: FileSpreadsheet,
    title: 'Organized CSV File',
    description: 'Ready to import into your favorite spreadsheet or SEO tool',
  },
  {
    icon: Clock,
    title: 'Save 20+ Hours',
    description: 'Skip the tedious research and start building links today',
  },
  {
    icon: Shield,
    title: 'High DR Only',
    description: 'Focused on sites with strong domain ratings for maximum SEO impact',
  },
]

const categories = [
  { name: 'Launch Platforms', count: '40+' },
  { name: 'Software Review Sites', count: '35+' },
  { name: 'Startup Directories', count: '50+' },
  { name: 'Social Bookmarking', count: '25+' },
  { name: 'Podcast Directories', count: '20+' },
  { name: 'Crowdfunding Sites', count: '15+' },
  { name: 'PR & Press Release', count: '30+' },
  { name: 'Forum Profiles', count: '25+' },
  { name: 'Web 2.0 Platforms', count: '30+' },
]

const dataPoints = [
  'Domain Rating (DR)',
  'Link Type (dofollow/nofollow)',
  'Estimated Cost (free/paid)',
  'Direct Submission URL',
  'Category Classification',
  'Monthly Traffic Estimate',
  'Turnaround Time',
  'Tips & Best Practices',
  'Last Verified Date',
]

export function BundleLanding() {
  const [isLoading, setIsLoading] = useState(false)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const handlePurchase = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/bundle-checkout', {
        method: 'POST',
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Something went wrong. Please try again.')
        setIsLoading(false)
      }
    } catch {
      alert('Something went wrong. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-surface-950 text-white py-16 sm:py-20 lg:py-24">
        <div className="absolute inset-0 pattern-grid-dark opacity-20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-red/20 blur-3xl -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-brand-yellow/10 blur-3xl translate-y-1/2" />

        <div className="container-wide relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <Zap className="w-5 h-5 text-brand-yellow" />
                <span className="text-sm font-bold uppercase tracking-wider text-brand-yellow">
                  Limited Time: 70% Off
                </span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black mb-6 leading-tight text-white">
                Complete Backlink
                <br />
                <span className="text-brand-red">Database Bundle</span>
              </h1>

              <p className="text-xl text-white/70 mb-8 max-w-lg">
                Stop wasting hours researching backlink opportunities. Get instant access to 270+ verified sites with everything you need to start building authority today.
              </p>

              <div className="flex flex-wrap items-center gap-6 mb-8">
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl sm:text-6xl font-black text-brand-yellow">£11.49</span>
                  <span className="text-2xl line-through text-white/40">£39</span>
                </div>
                <div className="flex flex-col">
                  <span className="bg-brand-red px-4 py-1.5 text-sm font-bold">
                    SAVE £27.51
                  </span>
                  <span className="text-xs text-white/50 mt-2 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Limited time offer
                  </span>
                </div>
              </div>

              <button
                onClick={handlePurchase}
                disabled={isLoading}
                className="inline-flex items-center gap-3 px-8 py-4
                         bg-brand-red text-white font-bold text-lg
                         hover:bg-brand-yellow hover:text-surface-950
                         transition-colors duration-200 group
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Get Instant Access
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <p className="mt-4 text-sm text-white/50 flex items-center gap-2">
                <Download className="w-4 h-4" />
                Instant download after purchase
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 p-8"
            >
              <h3 className="font-display text-xl font-bold mb-6 text-brand-yellow flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5" />
                What You'll Get
              </h3>

              <div className="space-y-4 mb-8">
                {benefits.map((benefit) => (
                  <div key={benefit.title} className="flex gap-4">
                    <div className="w-10 h-10 bg-brand-red/20 flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-5 h-5 text-brand-red" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{benefit.title}</h4>
                      <p className="text-sm text-white/60">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4 text-brand-yellow" />
                  <span className="text-sm font-semibold text-white/90">9 Data Points Per Site</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {dataPoints.map((point) => (
                    <div key={point} className="flex items-center gap-2 text-xs text-white/60">
                      <CheckCircle2 className="w-3 h-3 text-brand-yellow flex-shrink-0" />
                      {point}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-black mb-4">
              Categories <span className="text-brand-red">Covered</span>
            </h2>
            <p className="text-surface-600 max-w-xl mx-auto">
              Our database covers every major category of backlink opportunity, from launch platforms to directories to PR sites.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category, i) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between p-4 bg-surface-50 border-2 border-surface-200 hover:border-brand-red transition-colors"
              >
                <span className="font-semibold text-surface-900">{category.name}</span>
                <span className="text-sm font-bold text-brand-red bg-brand-red/10 px-3 py-1">
                  {category.count}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-surface-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 pattern-grid-dark opacity-20" />

        <div className="container-wide relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black mb-6">
              Ready to Build Your
              <br />
              <span className="text-brand-red">Backlink Profile?</span>
            </h2>

            <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
              Join hundreds of SEOs and marketers who have saved hours of research with our complete database.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
              <span className="text-4xl font-black text-brand-yellow">£11.49</span>
              <span className="text-xl line-through text-white/40">£39</span>
              <span className="bg-brand-red px-4 py-1.5 text-sm font-bold">70% OFF</span>
            </div>

            <button
              onClick={handlePurchase}
              disabled={isLoading}
              className="inline-flex items-center gap-3 px-10 py-5
                       bg-brand-red text-white font-bold text-xl
                       hover:bg-brand-yellow hover:text-surface-950
                       transition-colors duration-200 group
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Get the Bundle Now
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <p className="mt-6 text-sm text-white/50">
              One-time payment • Instant download • Use forever
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-white">
        <div className="container-wide max-w-3xl">
          <h2 className="font-display text-3xl sm:text-4xl font-black mb-8 text-center">
            Frequently Asked <span className="text-brand-red">Questions</span>
          </h2>

          <div className="space-y-4">
                {bundleFaqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="border-2 border-surface-200"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-surface-50 transition-colors"
                >
                  <span className="font-semibold text-surface-900">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-surface-500 transition-transform ${
                      expandedFaq === i ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {expandedFaq === i && (
                  <div className="px-4 pb-4 text-surface-600">
                    {faq.answer}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
