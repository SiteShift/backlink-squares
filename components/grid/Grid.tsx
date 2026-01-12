'use client'

import { useEffect, useCallback, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ChevronDown, Loader2 } from 'lucide-react'
import { useGridStore } from '@/lib/store'
import { Square } from './Square'
import { SelectionBar } from './SelectionBar'
import { GRID_COLUMNS, INITIAL_ROWS, MAX_ROWS, TOTAL_SQUARES } from '@/lib/types'
import { cn } from '@/lib/utils'

const ROWS_PER_LOAD = 30

export function Grid() {
  const {
    selectedSquares,
    loadedRows,
    setLoadedRows,
    toggleSquareSelection,
    isSquareSelected,
    getSquare,
  } = useGridStore()

  const gridRef = useRef<HTMLDivElement>(null)
  const [visibleRows, setVisibleRows] = useState(INITIAL_ROWS)
  const [isLoading, setIsLoading] = useState(false)

  // Initialize rows
  useEffect(() => {
    if (loadedRows === 0) {
      setLoadedRows(INITIAL_ROWS)
    }
  }, [loadedRows, setLoadedRows])

  // Load more rows handler
  const handleLoadMore = useCallback(() => {
    if (isLoading || visibleRows >= MAX_ROWS) return

    setIsLoading(true)
    setTimeout(() => {
      setVisibleRows((prev) => Math.min(prev + ROWS_PER_LOAD, MAX_ROWS))
      setIsLoading(false)
    }, 300)
  }, [isLoading, visibleRows])

  // Render all squares in a flat grid
  const renderSquares = useCallback(() => {
    const squares = []
    for (let row = 0; row < visibleRows; row++) {
      for (let col = 0; col < GRID_COLUMNS; col++) {
        const key = `${row}-${col}`
        const squareData = getSquare(row, col)
        const isPurchased = squareData?.purchased || false

        squares.push(
          <Square
            key={key}
            row={row}
            col={col}
            square={squareData}
            isSelected={isSquareSelected(row, col)}
            isPurchased={isPurchased}
            onSelect={() => toggleSquareSelection(row, col)}
            selectedSquares={selectedSquares}
          />
        )
      }
    }
    return squares
  }, [visibleRows, getSquare, isSquareSelected, toggleSquareSelection, selectedSquares])

  const hasMoreRows = visibleRows < MAX_ROWS

  return (
    <div className="relative">
      {/* Grid Container */}
      <div
        ref={gridRef}
        className="relative max-w-4xl mx-auto px-2 sm:px-4"
      >
        {/* Grid card container */}
        <div
          className="relative bg-surface-50 border-2 border-surface-950 p-3 sm:p-4 md:p-6"
          style={{ boxShadow: '6px 6px 0 0 #09090B' }}
        >
          {/* Grid header */}
          <div className="flex items-center justify-between mb-3 sm:mb-4 pb-3 sm:pb-4 border-b-2 border-surface-200">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-brand-red" />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-surface-500">
                Do Follow Backlinks
              </span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="flex items-center gap-1 text-[10px] sm:text-xs text-surface-400">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-400 animate-pulse" />
                <span>Real-time</span>
              </div>
            </div>
          </div>

          {/* Actual Grid - Responsive columns: 5 on mobile, 10 on sm+ */}
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-0.5 sm:gap-1.5 md:gap-2">
            {renderSquares()}
          </div>

          {/* Grid footer */}
          <div className="flex flex-wrap items-center justify-between gap-2 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t-2 border-surface-200">
            <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-surface-500">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white border-2 border-surface-950" />
                <span>Available</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-1.5">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-brand-red border-2 border-surface-950" />
                <span>Selected</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-1.5">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-brand-blue border-2 border-surface-950" />
                <span>Sold</span>
              </div>
            </div>
          </div>
        </div>

        {/* Load More Button */}
        {hasMoreRows && (
          <div className="flex justify-center mt-6 sm:mt-8">
            <button
              onClick={handleLoadMore}
              disabled={isLoading}
              className={cn(
                'btn-secondary group',
                isLoading && 'opacity-50 cursor-not-allowed'
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <span>Load More Squares</span>
                  <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                </>
              )}
            </button>
          </div>
        )}

        {/* Loaded info */}
        <div className="text-center mt-4 sm:mt-6 text-xs sm:text-sm text-surface-400">
          Showing {(visibleRows * GRID_COLUMNS).toLocaleString()} of {TOTAL_SQUARES.toLocaleString()} squares
        </div>
      </div>

      {/* Selection Bar - Fixed at bottom when squares are selected */}
      <AnimatePresence>
        {selectedSquares.length > 0 && <SelectionBar />}
      </AnimatePresence>
    </div>
  )
}
