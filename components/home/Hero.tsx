'use client'

import { motion } from 'framer-motion'
import { ArrowDown, Zap, Link as LinkIcon, Shield, Sparkles } from 'lucide-react'

interface HeroProps {
  totalSold?: number
  totalAvailable?: number
}

export function Hero({ totalSold = 0, totalAvailable = 10000 }: HeroProps) {
  const scrollToGrid = () => {
    document.getElementById('grid')?.scrollIntoView({ behavior: 'smooth' })
  }

  const percentSold = Math.round((totalSold / totalAvailable) * 100)

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-surface-950">
      {/* Animated background grid pattern */}
      <div className="absolute inset-0 pattern-grid-dark opacity-50" />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-surface-950 via-surface-950/95 to-surface-900" />

      {/* Floating geometric shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large red square - top right */}
        <motion.div
          className="absolute -top-20 -right-20 w-80 h-80 bg-brand-red/10 border border-brand-red/20"
          animate={{ rotate: [0, 5, 0] }}
          transition={{ rotate: { duration: 20, repeat: Infinity, ease: 'linear' } }}
        />

        {/* Blue circle - bottom left */}
        <motion.div
          className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-brand-blue/10 border border-brand-blue/20"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Yellow triangle accent */}
        <motion.div
          className="absolute top-1/3 right-1/4 w-0 h-0 opacity-20"
          style={{
            borderLeft: '40px solid transparent',
            borderRight: '40px solid transparent',
            borderBottom: '70px solid #FACC15',
          }}
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Small floating squares */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-white/5"
            style={{ left: `${20 + i * 15}%`, top: `${30 + i * 10}%` }}
            animate={{ y: [0, -30, 0], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
          />
        ))}
      </div>

      {/* Main Content Area */}
      <div className="relative flex-1 flex flex-col lg:flex-row pt-20 lg:pt-24">
        {/* Left Side - Text Content */}
        <div className="flex-1 flex flex-col justify-center px-6 sm:px-8 lg:px-16 xl:px-24 py-12 lg:py-0 order-2 lg:order-1">
          <div className="max-w-2xl">
            {/* Live Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center gap-3 mb-8"
            >
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-full w-full bg-green-400" />
                </span>
                <span className="text-sm font-medium text-white/70">
                  {totalSold > 0 ? `${totalSold.toLocaleString()} squares claimed` : 'Now Live'}
                </span>
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="relative"
            >
              {/* Decorative line */}
              <motion.div
                className="absolute -left-4 lg:-left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-brand-red via-brand-yellow to-brand-blue"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              />

              <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.85] tracking-tighter">
                <span className="text-white">THE</span>
                <br />
                <span className="relative">
                  <span className="text-brand-red">BACKLINK</span>
                  <motion.span
                    className="absolute -bottom-2 left-0 right-0 h-2 bg-brand-red/30"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    style={{ originX: 0 }}
                  />
                </span>
                <br />
                <span className="text-white">GRID</span>
              </h1>
            </motion.div>

            {/* Value Proposition */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="mt-8 text-xl sm:text-2xl text-white/60 max-w-lg leading-relaxed font-light"
            >
              Permanent dofollow backlinks.
              <span className="block mt-1 text-white font-medium">
                No outreach. No waiting. From $1.
              </span>
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <button
                onClick={scrollToGrid}
                className="group relative inline-flex items-center gap-3 px-8 py-4
                         bg-brand-red text-white font-bold text-base uppercase tracking-wider
                         border-2 border-brand-red
                         hover:bg-white hover:text-surface-950 hover:border-white
                         transition-all duration-300"
                style={{ boxShadow: '4px 4px 0 0 rgba(255,255,255,0.2)' }}
              >
                <Sparkles className="w-5 h-5" />
                <span>Claim Your Square</span>
                <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
              </button>

              <span className="text-white/40 text-sm font-medium">
                Starting at just $1
              </span>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="mt-12 flex flex-wrap gap-6 lg:gap-8"
            >
              {[
                { icon: Zap, label: 'Instant Activation', color: 'text-brand-yellow' },
                { icon: LinkIcon, label: 'Real Dofollow Links', color: 'text-brand-blue' },
                { icon: Shield, label: 'Permanent Placement', color: 'text-brand-red' },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  className="flex items-center gap-2 text-white/50"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + index * 0.05 }}
                >
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                  <span className="text-sm font-medium">{item.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Right Side - Interactive Grid Preview */}
        <div className="flex-1 relative flex items-center justify-center p-6 sm:p-8 lg:p-12 order-1 lg:order-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="relative z-10 w-full max-w-sm lg:max-w-md"
          >
            {/* Price Tag - Floating */}
            <motion.div
              initial={{ opacity: 0, y: -10, rotate: -6 }}
              animate={{ opacity: 1, y: 0, rotate: -6 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="absolute -top-6 -right-4 lg:-top-8 lg:-right-8 z-20"
            >
              <div className="relative bg-brand-yellow border-2 border-surface-950 px-4 py-2"
                   style={{ boxShadow: '4px 4px 0 0 #09090B' }}>
                <span className="text-2xl lg:text-3xl font-black text-surface-950">$1</span>
                <span className="text-xs font-bold text-surface-950/60 ml-1">/ sq</span>
              </div>
            </motion.div>

            {/* The Grid Card */}
            <div
              className="relative bg-surface-100 border-2 border-surface-950 p-4 sm:p-6"
              style={{ boxShadow: '8px 8px 0 0 #09090B' }}
            >
              {/* Grid Header */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-surface-500">
                  Preview Grid
                </span>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-brand-red rounded-full" />
                  <div className="w-2 h-2 bg-brand-yellow rounded-full" />
                  <div className="w-2 h-2 bg-brand-blue rounded-full" />
                </div>
              </div>

              {/* Grid Squares */}
              <div className="grid grid-cols-6 gap-1.5">
                {Array.from({ length: 36 }).map((_, i) => {
                  const isSold = [0, 1, 6, 7, 4, 5, 10, 11, 12, 18, 24, 30, 31, 32, 33, 28, 29, 35].includes(i)
                  const isSelected = [14, 15, 20, 21].includes(i)
                  const isHovered = [22, 23].includes(i)

                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2, delay: 0.15 + (i * 0.01) }}
                      className={`
                        aspect-square border-2 border-surface-950 transition-all duration-200 cursor-pointer
                        ${isSold
                          ? 'bg-brand-red hover:bg-brand-red/90'
                          : isSelected
                            ? 'bg-brand-blue hover:bg-brand-blue/90'
                            : isHovered
                              ? 'bg-brand-yellow hover:bg-brand-yellow/90'
                              : 'bg-white hover:bg-surface-100'
                        }
                      `}
                      whileHover={{ scale: 1.1, zIndex: 10 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isSold && (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-2 h-2 lg:w-3 lg:h-3 bg-white/30 rounded-sm" />
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t-2 border-surface-200">
                <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 bg-brand-red border-2 border-surface-950" />
                    <span className="text-surface-500">Sold</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 bg-white border-2 border-surface-950" />
                    <span className="text-surface-500">Open</span>
                  </div>
                </div>
                <span className="text-xs font-semibold text-surface-400 hidden sm:block">
                  Click to select
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.25 }}
              className="mt-6"
            >
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-bold text-white">{percentSold}% Claimed</span>
                <span className="text-white/50">{(totalAvailable - totalSold).toLocaleString()} remaining</span>
              </div>
              <div className="h-3 bg-white/10 border-2 border-white/20 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(percentSold, 5)}%` }}
                  transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full bg-gradient-to-r from-brand-red to-brand-yellow"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-3"
      >
        <span className="text-xs font-semibold uppercase tracking-widest text-white/30">
          Scroll to explore
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5"
        >
          <motion.div
            className="w-1.5 h-3 bg-white/40 rounded-full"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
