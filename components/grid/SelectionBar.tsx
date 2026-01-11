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
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
    >
      <div
        className="flex items-center gap-6 px-8 py-5 bg-white border-2 border-surface-950"
        style={{ boxShadow: '6px 6px 0px 0px #09090B' }}
      >
        {/* Selection Info */}
        <div className="flex items-center gap-4">
          {/* Color block indicator */}
          <div className="w-12 h-12 bg-brand-red border-2 border-surface-950 flex items-center justify-center">
            <span className="text-white font-black text-lg">{count}</span>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-surface-500">
              {getSizeLabel()}
            </p>
            <p className="text-2xl font-black text-surface-950">
              {formatPrice(price)}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-12 w-0.5 bg-surface-200" />

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={clearSelection}
            className="w-12 h-12 border-2 border-surface-950 bg-surface-50 flex items-center justify-center
                     hover:bg-brand-yellow transition-colors duration-150"
          >
            <X className="w-5 h-5" strokeWidth={2.5} />
          </button>

          <button
            onClick={openModal}
            className="btn-red group"
          >
            Continue
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
