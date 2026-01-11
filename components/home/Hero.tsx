'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Zap, Link as LinkIcon, Shield, Check } from 'lucide-react'
import { TOTAL_SQUARES } from '@/lib/types'

interface HeroProps {
  totalSold?: number
}

export function Hero({ totalSold = 0 }: HeroProps) {
  const scrollToGrid = () => {
    document.getElementById('grid')?.scrollIntoView({ behavior: 'smooth' })
  }

  const totalAvailable = TOTAL_SQUARES - totalSold
  const percentSold = Math.round((totalSold / TOTAL_SQUARES) * 100)

  return (
    <section className="relative min-h-[90vh] flex flex-col overflow-hidden bg-surface-50">
      {/* Subtle grid pattern background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-40" />

      {/* Gradient accents - subtle */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-brand-red/5 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-brand-blue/5 via-transparent to-transparent" />

      {/* Main Content Area */}
      <div className="relative flex-1 flex flex-col lg:flex-row pt-24 lg:pt-28">
        {/* Left Side - Text Content */}
        <div className="flex-1 flex flex-col justify-center px-6 sm:px-8 lg:px-16 xl:px-24 py-12 lg:py-0 order-2 lg:order-1">
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 mb-6"
            >
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white border-2 border-surface-200 rounded-full">
                <div className="flex -space-x-1">
                  <div className="w-2 h-2 rounded-full bg-brand-red" />
                  <div className="w-2 h-2 rounded-full bg-brand-yellow" />
                  <div className="w-2 h-2 rounded-full bg-brand-blue" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-surface-600">
                  The SEO Marketplace
                </span>
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-black leading-[0.9] tracking-tight text-surface-950">
                Buy a square.
                <br />
                <span className="text-brand-red">Get a backlink.</span>
              </h1>
            </motion.div>

            {/* Value Proposition */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="mt-6 text-lg sm:text-xl text-surface-600 max-w-lg leading-relaxed"
            >
              Permanent dofollow backlinks on a visual grid.
              <span className="text-surface-950 font-semibold"> No outreach required.</span>
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <motion.button
                onClick={scrollToGrid}
                className="group relative inline-flex items-center gap-3 px-7 py-4
                         bg-surface-950 text-white font-bold text-sm uppercase tracking-wider
                         border-2 border-surface-950
                         hover:bg-brand-red hover:border-brand-red
                         transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ boxShadow: '4px 4px 0 0 #DC2626' }}
              >
                <span>Claim Your Square</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <div className="flex items-center gap-2">
                <span className="text-3xl font-black text-surface-950">$1</span>
                <span className="text-sm text-surface-500 font-medium">
                  per square
                </span>
              </div>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="mt-10 flex flex-wrap gap-x-6 gap-y-3"
            >
              {[
                { icon: Zap, label: 'Instant activation' },
                { icon: LinkIcon, label: 'Real dofollow links' },
                { icon: Shield, label: 'Permanent placement' },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  className="flex items-center gap-2 text-surface-600"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 + index * 0.05 }}
                >
                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-green-100">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-sm font-medium">{item.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Right Side - Interactive Grid Preview */}
        <div className="flex-1 relative flex items-center justify-center p-6 sm:p-8 lg:p-12 order-1 lg:order-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative z-10 w-full max-w-sm lg:max-w-md"
          >
            {/* The Grid Card */}
            <div
              className="relative bg-white border-2 border-surface-950 p-5 sm:p-6"
              style={{ boxShadow: '8px 8px 0 0 #09090B' }}
            >
              {/* Grid Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-brand-red" />
                  <div className="w-3 h-3 rounded-full bg-brand-yellow" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-surface-400">
                  Live Preview
                </span>
              </div>

              {/* Grid Squares */}
              <div className="grid grid-cols-8 gap-1">
                {Array.from({ length: 64 }).map((_, i) => {
                  // Create an interesting pattern of sold squares
                  const soldPattern = [
                    0, 1, 2, 3, 8, 9, 10, 11, // top-left cluster
                    6, 7, 14, 15, // top-right cluster
                    24, 25, 32, 33, 40, 41, // left column
                    27, 28, 29, 35, 36, 37, // center cluster
                    54, 55, 62, 63, // bottom-right
                    48, 49, 56, 57, // bottom-left
                  ]
                  const isSold = soldPattern.includes(i)
                  const isHighlight = [21, 22, 29, 30].includes(i)

                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.3 + (i * 0.008) }}
                      className={`
                        aspect-square border border-surface-200 transition-all duration-200 cursor-pointer
                        ${isSold
                          ? 'bg-gradient-to-br from-brand-red to-rose-600 border-brand-red/50'
                          : isHighlight
                            ? 'bg-brand-yellow border-brand-yellow/50 hover:scale-110'
                            : 'bg-surface-50 hover:bg-brand-blue/10 hover:border-brand-blue/30 hover:scale-105'
                        }
                      `}
                      whileHover={{ zIndex: 10 }}
                    />
                  )
                })}
              </div>

              {/* Stats Row */}
              <div className="flex items-center justify-between mt-5 pt-4 border-t border-surface-200">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-black text-surface-950">{percentSold}%</div>
                    <div className="text-xs text-surface-500 font-medium">Claimed</div>
                  </div>
                  <div className="w-px h-8 bg-surface-200" />
                  <div className="text-center">
                    <div className="text-2xl font-black text-surface-950">{totalAvailable.toLocaleString()}</div>
                    <div className="text-xs text-surface-500 font-medium">Available</div>
                  </div>
                </div>
                <motion.div
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                    <span className="relative inline-flex rounded-full h-full w-full bg-green-500" />
                  </span>
                  <span className="text-xs font-semibold text-green-700">Live</span>
                </motion.div>
              </div>
            </div>

            {/* Floating Price Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
              animate={{ opacity: 1, scale: 1, rotate: -6 }}
              transition={{ duration: 0.4, delay: 0.5, type: 'spring', stiffness: 200 }}
              className="absolute -top-4 -right-4 lg:-top-6 lg:-right-6 z-20"
            >
              <div
                className="bg-brand-yellow border-2 border-surface-950 px-4 py-2"
                style={{ boxShadow: '3px 3px 0 0 #09090B' }}
              >
                <span className="text-xs font-bold uppercase tracking-wider text-surface-950/70">From</span>
                <div className="text-2xl lg:text-3xl font-black text-surface-950 -mt-1">$1</div>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-surface-300 to-transparent" />
    </section>
  )
}
