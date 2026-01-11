'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Plus, ExternalLink } from 'lucide-react'
import { Square as SquareType, SelectedSquare } from '@/lib/types'
import { getSelectionEdges } from '@/lib/utils'

interface SquareProps {
  row: number
  col: number
  square?: SquareType
  isSelected: boolean
  isPurchased: boolean
  onSelect: () => void
  selectedSquares: SelectedSquare[]
}

export function Square({
  row,
  col,
  square,
  isSelected,
  isPurchased,
  onSelect,
  selectedSquares,
}: SquareProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Get edge visibility for unified selection border
  const edges = isSelected ? getSelectionEdges(row, col, selectedSquares) : null

  // Empty square - available for selection
  if (!isPurchased) {
    return (
      <motion.button
        onClick={onSelect}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative aspect-square w-full transition-all duration-150 group cursor-pointer"
        whileTap={{ scale: 0.96 }}
      >
        {/* Base square */}
        {!isSelected && (
          <div
            className="absolute inset-0 bg-white border-2 border-surface-950 transition-all duration-150 group-hover:bg-brand-yellow"
            style={{
              boxShadow: isHovered ? '2px 2px 0px 0px #09090B' : 'none',
              transform: isHovered ? 'translate(-1px, -1px)' : 'none',
            }}
          />
        )}

        {/* Selected state - clean solid fill */}
        {isSelected && (
          <div
            className="absolute inset-0 bg-brand-red"
            style={{
              // Only show border on outer edges of selection group
              borderTop: edges?.top ? '2px solid #09090B' : 'none',
              borderRight: edges?.right ? '2px solid #09090B' : 'none',
              borderBottom: edges?.bottom ? '2px solid #09090B' : 'none',
              borderLeft: edges?.left ? '2px solid #09090B' : 'none',
            }}
          />
        )}

        {/* Plus icon for empty squares */}
        {!isSelected && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-surface-950" strokeWidth={2.5} />
          </div>
        )}

        {/* Coordinate tooltip */}
        {isHovered && !isSelected && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -bottom-7 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-surface-950 text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wider whitespace-nowrap z-30"
          >
            {row + 1}, {col + 1}
          </motion.div>
        )}
      </motion.button>
    )
  }

  // Purchased square with logo
  // IMPORTANT: rel="noopener" is security only - does NOT affect SEO
  // NO rel="nofollow" or rel="sponsored" - these are real dofollow backlinks
  return (
    <motion.a
      href={square?.site_url || '#'}
      target="_blank"
      rel="noopener"
      title={square?.site_name || 'Visit site'}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative aspect-square w-full transition-all duration-150 group cursor-pointer"
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-white border-2 border-surface-950 transition-all duration-150"
        style={{
          boxShadow: isHovered ? '3px 3px 0px 0px #09090B' : '1px 1px 0px 0px #09090B',
          transform: isHovered ? 'translate(-1px, -1px)' : 'none',
        }}
      />

      {/* Logo */}
      <div className="relative z-10 w-full h-full p-1">
        {square?.logo_url ? (
          <Image
            src={square.logo_url}
            alt={square.site_name || 'Site logo'}
            fill
            className="object-contain p-1"
            sizes="(max-width: 640px) 40px, (max-width: 768px) 50px, 60px"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-brand-blue border-2 border-surface-950">
            <span className="text-white font-black text-sm sm:text-base">
              {square?.site_name?.charAt(0).toUpperCase() || '?'}
            </span>
          </div>
        )}
      </div>

      {/* Hover overlay */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-20 bg-surface-950 flex flex-col items-center justify-center p-1 border-2 border-surface-950"
        >
          <span className="text-white text-[8px] sm:text-[10px] font-bold uppercase tracking-wider truncate max-w-full text-center leading-tight">
            {square?.site_name}
          </span>
          <ExternalLink className="w-3 h-3 text-brand-yellow mt-1" />
        </motion.div>
      )}
    </motion.a>
  )
}
