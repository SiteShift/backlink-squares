'use client'

import Link from 'next/link'
import { X, Flame } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePromo } from './PromoProvider'

const BUNDLE_URL = '/bundle'

export function PromoBanner() {
  const { isBannerVisible, dismissBanner } = usePromo()

  return (
    <AnimatePresence>
      {isBannerVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="bg-brand-red text-white fixed top-0 left-0 right-0 z-[60] overflow-hidden"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center gap-2 sm:gap-4 py-2.5 sm:py-3 text-center">
              <Flame className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 animate-pulse" />

              <p className="text-xs sm:text-sm font-semibold">
                <span className="hidden sm:inline">LIMITED TIME: </span>
                <span className="font-bold">Complete Backlink Database Bundle</span>
                <span className="hidden md:inline"> — 270+ High DR Dofollow Backlinks</span>
                {' '}for{' '}
                <span className="font-black">£11.49</span>
                {' '}
                <span className="line-through opacity-75 text-[10px] sm:text-xs">(was £39)</span>
              </p>

              <Link
                href={BUNDLE_URL}
                className="flex-shrink-0 inline-flex items-center px-3 py-1 sm:px-4 sm:py-1.5
                         bg-white text-brand-red text-xs sm:text-sm font-bold
                         hover:bg-brand-yellow hover:text-surface-950
                         transition-colors duration-200"
              >
                Get It Now
              </Link>

              <button
                onClick={dismissBanner}
                className="flex-shrink-0 p-1 hover:bg-white/20 rounded transition-colors ml-1 sm:ml-2"
                aria-label="Dismiss banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
