'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Zap, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { usePromo } from '@/components/promo'

export function StickyPromo() {
  const [isVisible, setIsVisible] = useState(true)
  const { isBannerVisible } = usePromo()

  if (!isVisible) return null

  // Adjust top position based on banner visibility
  // Banner height: ~44px mobile, ~48px desktop
  // Header height: 64px mobile, 80px desktop
  const topClass = isBannerVisible
    ? 'top-[108px] lg:top-[128px]'
    : 'top-16 lg:top-20'

  return (
    <div className={`sticky ${topClass} z-40 border-b-3 border-dark`}>
      <div className="relative bg-bauhaus-red overflow-hidden">
        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 20px)',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2.5 sm:py-3">
            {/* Main CTA Content */}
            <Link
              href="/#grid"
              className="flex-1 flex items-center justify-center gap-2 sm:gap-3 group"
            >
              <motion.div
                animate={{
                  rotate: [0, -10, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              >
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-bauhaus-yellow fill-bauhaus-yellow" />
              </motion.div>

              <span className="text-white font-black text-sm sm:text-base uppercase tracking-wide">
                Get a{' '}
                <span className="text-bauhaus-yellow">$1</span>
                {' '}Backlink
              </span>

              <span className="hidden sm:inline text-white/70 text-sm mx-2">—</span>
              <span className="hidden sm:inline text-white/90 text-sm">
                Instant DoFollow Link
              </span>

              <motion.div
                className="flex items-center gap-1 ml-2 sm:ml-4 px-2 sm:px-3 py-1 bg-white text-bauhaus-red font-bold text-xs sm:text-sm border-2 border-dark"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Claim Now</span>
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-0.5 transition-transform" />
              </motion.div>
            </Link>

            {/* Close Button */}
            <button
              onClick={() => setIsVisible(false)}
              className="ml-2 p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
