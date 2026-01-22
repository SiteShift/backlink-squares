'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Database, CheckCircle2, Clock, Zap } from 'lucide-react'

const benefits = [
  '270+ verified backlink sites',
  'High DR dofollow links',
  '9 data points per site',
  'Saves 20+ hours of research',
]

const categories = [
  'Launch platforms',
  'Software reviews',
  'Startup directories',
  'Social bookmarking',
  'Podcast directories',
  'Crowdfunding sites',
  'PR & press releases',
  'And more...',
]

interface BundleCardProps {
  variant?: 'default' | 'compact' | 'sidebar'
}

export function BundleCard({ variant = 'default' }: BundleCardProps) {
  if (variant === 'sidebar') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-surface-950 text-white p-6 border-2 border-surface-950"
        style={{ boxShadow: '4px 4px 0 0 #DC2626' }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Database className="w-5 h-5 text-brand-yellow" />
          <span className="text-xs font-bold uppercase tracking-wider text-brand-yellow">Bundle Deal</span>
        </div>

        <h3 className="font-display text-lg font-black mb-2">
          Complete Backlink Database
        </h3>

        <p className="text-sm text-white/70 mb-4">
          270+ verified sites with DR ratings, link types, and submission URLs.
        </p>

        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-2xl font-black text-brand-yellow">£11.49</span>
          <span className="text-sm line-through text-white/50">£39</span>
          <span className="text-xs bg-brand-red px-2 py-0.5 font-bold">70% OFF</span>
        </div>

        <Link
          href="/bundle"
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5
                   bg-brand-red text-white font-bold text-sm
                   hover:bg-brand-yellow hover:text-surface-950
                   transition-colors duration-200"
        >
          Get the Bundle
          <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    )
  }

  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-surface-950 to-surface-900 text-white p-6 sm:p-8 border-2 border-surface-950 relative overflow-hidden"
        style={{ boxShadow: '6px 6px 0 0 #DC2626' }}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red/10 -translate-y-1/2 translate-x-1/2" />

        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-brand-yellow" />
            <span className="text-xs font-bold uppercase tracking-wider text-brand-yellow">Limited Time Offer</span>
          </div>

          <h3 className="font-display text-xl sm:text-2xl font-black mb-3">
            Complete Backlink Database Bundle
          </h3>

          <p className="text-white/70 mb-4">
            All the backlinks you need to launch. 270+ verified sites. High DR. Dofollow links. One purchase.
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-brand-yellow">£11.49</span>
              <span className="text-lg line-through text-white/50">£39</span>
            </div>
            <span className="bg-brand-red px-3 py-1 text-sm font-bold">SAVE 70%</span>
          </div>

          <Link
            href="/bundle"
            className="inline-flex items-center gap-2 px-6 py-3
                     bg-brand-red text-white font-bold
                     hover:bg-brand-yellow hover:text-surface-950
                     transition-colors duration-200"
          >
            Get the Bundle Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </motion.div>
    )
  }

  // Default full variant
  return (
    <section className="section-padding bg-surface-50 relative overflow-hidden">
      <div className="absolute inset-0 pattern-dots opacity-30" />

      <div className="container-wide relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-surface-950 text-white p-8 sm:p-12 border-2 border-surface-950 relative overflow-hidden"
          style={{ boxShadow: '8px 8px 0 0 #DC2626' }}
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red/10 -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-yellow/10 translate-y-1/2 -translate-x-1/2 rounded-full" />

          <div className="relative grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left side - Content */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Database className="w-6 h-6 text-brand-yellow" />
                <span className="text-sm font-bold uppercase tracking-wider text-brand-yellow">
                  Complete Database Bundle
                </span>
              </div>

              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black mb-4">
                270+ High DR Backlinks
                <br />
                <span className="text-brand-red">One Purchase</span>
              </h2>

              <p className="text-lg text-white/70 mb-6">
                Stop spending hours researching backlink opportunities. Get our complete database of 270+ verified sites with DR ratings, link types, costs, and submission URLs. Everything you need to build authority and rank.
              </p>

              <ul className="space-y-3 mb-8">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3 text-white/90">
                    <CheckCircle2 className="w-5 h-5 text-brand-yellow flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap items-center gap-6 mb-8">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl sm:text-5xl font-black text-brand-yellow">£11.49</span>
                  <span className="text-xl line-through text-white/50">£39</span>
                </div>
                <div className="flex flex-col">
                  <span className="bg-brand-red px-4 py-1.5 text-sm font-bold inline-block">
                    SAVE 70%
                  </span>
                  <span className="text-xs text-white/50 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Limited time offer
                  </span>
                </div>
              </div>

              <Link
                href="/bundle"
                className="inline-flex items-center gap-3 px-8 py-4
                         bg-brand-red text-white font-bold text-lg
                         hover:bg-brand-yellow hover:text-surface-950
                         transition-colors duration-200 group"
              >
                Get the Complete Bundle
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Right side - Categories */}
            <div className="bg-white/5 backdrop-blur-sm p-6 sm:p-8 border border-white/10">
              <h3 className="font-display text-xl font-bold mb-4 text-brand-yellow">
                What's Included
              </h3>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {categories.map((category) => (
                  <div
                    key={category}
                    className="flex items-center gap-2 text-sm text-white/80"
                  >
                    <span className="w-1.5 h-1.5 bg-brand-red rounded-full flex-shrink-0" />
                    {category}
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-6">
                <h4 className="font-semibold mb-3 text-white/90">Each site includes:</h4>
                <ul className="space-y-2 text-sm text-white/70">
                  <li>• Domain Rating (DR)</li>
                  <li>• Link type (dofollow/nofollow)</li>
                  <li>• Estimated cost</li>
                  <li>• Direct submission URL</li>
                  <li>• Category classification</li>
                  <li>• Traffic estimates</li>
                  <li>• Turnaround time</li>
                  <li>• Notes & tips</li>
                  <li>• Last verified date</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
