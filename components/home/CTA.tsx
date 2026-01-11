'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, Check, Sparkles } from 'lucide-react'

const benefits = [
  'Permanent dofollow backlink',
  'Instant activation',
  'One-time payment',
  'Growing DA value',
]

export function CTA() {
  const containerRef = useRef<HTMLElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })

  return (
    <section ref={containerRef} className="section-padding bg-surface-950 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pattern-grid-dark opacity-30" />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-surface-950 via-surface-900 to-surface-950" />

      {/* Decorative elements */}
      <motion.div
        className="absolute top-0 left-0 w-64 h-64 bg-brand-red/10"
        animate={{ rotate: [0, 5, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute top-1/2 -right-32 w-64 h-64 rounded-full bg-brand-blue/10"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-16 left-1/3 w-48 h-48 bg-brand-yellow/10 rotate-45"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white/10 rounded-full"
          style={{
            left: `${10 + i * 12}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.3,
          }}
        />
      ))}

      <div className="container-wide relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-3 px-5 py-2.5 bg-white border-2 border-white mb-12"
            style={{ boxShadow: '4px 4px 0 0 #DC2626' }}
          >
            <Sparkles className="w-4 h-4 text-brand-red" />
            <span className="text-sm font-bold uppercase tracking-widest text-surface-950">
              Limited Squares Available
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl lg:text-7xl font-black text-white tracking-tight leading-[0.9]"
          >
            Ready to Claim{' '}
            <span className="relative inline-block">
              <span className="text-brand-red">Your Spot</span>
              <motion.span
                className="absolute -bottom-2 left-0 right-0 h-2 bg-brand-red/30"
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.5 }}
                style={{ originX: 0 }}
              />
            </span>
            ?
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 text-xl text-white/60 max-w-2xl mx-auto leading-relaxed"
          >
            Join the grid. Get your permanent backlink.
            <span className="block mt-1 text-white/80">
              The earlier you claim, the better your position.
            </span>
          </motion.p>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-4"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                className="flex items-center gap-2"
              >
                <div className="w-5 h-5 bg-brand-yellow border border-white/20 flex items-center justify-center">
                  <Check className="w-3 h-3 text-surface-950" strokeWidth={3} />
                </div>
                <span className="text-sm font-semibold text-white/80">{benefit}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a href="#grid">
              <button
                className="group relative inline-flex items-center gap-3 px-10 py-5
                         bg-brand-red text-white font-bold text-lg uppercase tracking-wider
                         border-2 border-brand-red
                         hover:bg-white hover:text-surface-950 hover:border-white
                         transition-all duration-300"
                style={{ boxShadow: '4px 4px 0 0 rgba(255,255,255,0.2)' }}
              >
                <span>Claim Your Square</span>
                <span className="px-2 py-0.5 bg-white/20 text-sm group-hover:bg-surface-950/10">$1</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </a>
          </motion.div>

          {/* Trust note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-8 flex items-center justify-center gap-6 text-sm text-white/40"
          >
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              Secure payment via Stripe
            </span>
            <span>No subscription required</span>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
