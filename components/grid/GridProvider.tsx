'use client'

import { useEffect, useRef } from 'react'
import { useGridStore } from '@/lib/store'
import { Square } from '@/lib/types'

interface GridProviderProps {
  children: React.ReactNode
  initialSquares: Square[]
  initialTotalSold: number
  serverTimestamp: string // Server time to avoid client clock skew
}

export function GridProvider({ children, initialSquares, initialTotalSold, serverTimestamp }: GridProviderProps) {
  const setSquares = useGridStore((state) => state.setSquares)
  const addSquares = useGridStore((state) => state.addSquares)
  const setTotalSold = useGridStore((state) => state.setTotalSold)
  const initialized = useRef(false)
  const lastFetchTime = useRef<string | null>(null)

  // Initial hydration
  useEffect(() => {
    if (!initialized.current) {
      setSquares(initialSquares)
      setTotalSold(initialTotalSold)
      // Use SERVER timestamp for delta polling to avoid client clock skew
      // This ensures we don't miss purchases between SSR and hydration
      lastFetchTime.current = serverTimestamp
      initialized.current = true
    }
  }, [initialSquares, initialTotalSold, serverTimestamp, setSquares, setTotalSold])

  // Delta polling - only fetch squares updated since last poll
  useEffect(() => {
    const fetchSquares = async () => {
      try {
        // Use delta polling with since parameter
        const url = lastFetchTime.current
          ? `/api/squares?since=${encodeURIComponent(lastFetchTime.current)}`
          : '/api/squares'

        const response = await fetch(url)
        if (response.ok) {
          const data = await response.json()

          // Update timestamp for next poll
          if (data.timestamp) {
            lastFetchTime.current = data.timestamp
          }

          // Always update total sold count
          setTotalSold(data.totalSold)

          // Merge delta results or replace on full fetch
          if (data.isDelta && data.squares.length > 0) {
            // Merge new/updated squares into existing store
            addSquares(data.squares)
          } else if (!data.isDelta) {
            // Full fetch - replace all
            setSquares(data.squares)
          }
          // If isDelta and no squares, nothing changed - skip update
        }
      } catch (error) {
        console.error('Failed to fetch squares:', error)
      }
    }

    // Refresh every 30 seconds
    const interval = setInterval(fetchSquares, 30000)
    return () => clearInterval(interval)
  }, [setSquares, addSquares, setTotalSold])

  return <>{children}</>
}
