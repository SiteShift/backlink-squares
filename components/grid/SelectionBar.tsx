'use client'

import { motion } from 'framer-motion'
import { X, ArrowRight } from 'lucide-react'
import { useGridStore } from '@/lib/store'
import { formatPrice, getSelectionDimensions } from '@/lib/utils'

export function SelectionBar() {
  const {
    selectedSquares,
    getSelectionPrice,
    clearSelection,
    openModal,
  } = useGridStore()

  const price = getSelectionPrice()
  const { width, height } = getSelectionDimensions(selectedSquares)
  const count = selectedSquares.length

  const getSizeLabel = () => {
    if (count === 1) return '1 SQUARE'
    if (width === height) return `${count} SQUARES (${width}x${height})`
    return `${count} SQUARES`
  }

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 sm:bottom-6 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-50"
    >
      {/* Mobile: Full-width bar */}
      <div
        className="flex items-center justify-between gap-3 px-4 py-4 sm:gap-6 sm:px-8 sm:py-5 bg-white border-t-2 sm:border-2 border-surface-950"
        style={{ boxShadow: '0 -4px 20px rgba(0,0,0,0.15)' }}
      >
        {/* Selection Info */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Color block indicator */}
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-red border-2 border-surface-950 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-black text-base sm:text-lg">{count}</span>
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-surface-500 truncate">
              {getSizeLabel()}
            </p>
            <p className="text-xl sm:text-2xl font-black text-surface-950">
              {formatPrice(price)}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <button
            onClick={clearSelection}
            className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-surface-950 bg-surface-50 flex items-center justify-center
                     hover:bg-brand-yellow transition-colors duration-150"
            aria-label="Clear selection"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
          </button>

          <button
            onClick={openModal}
            className="flex items-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 bg-brand-red text-white font-bold text-sm uppercase tracking-wider
                     border-2 border-surface-950 hover:bg-red-600 transition-colors"
            style={{ boxShadow: '3px 3px 0 0 #09090B' }}
          >
            <span className="hidden sm:inline">Continue</span>
            <span className="sm:hidden">Buy</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
