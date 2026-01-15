import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { SelectedSquare, PRICE_PER_SQUARE } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Generate a unique key for a square position
export function getSquareKey(row: number, col: number): string {
  return `${row}-${col}`
}

// Parse square key back to coordinates
export function parseSquareKey(key: string): { row: number; col: number } {
  const [row, col] = key.split('-').map(Number)
  return { row, col }
}

// Calculate price based on number of squares ($1 per square)
export function calculatePrice(squareCount: number): number {
  return squareCount * PRICE_PER_SQUARE
}

// Format price in USD
export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100)
}

// Check if selected squares form a valid contiguous shape
export function isValidSelection(squares: SelectedSquare[]): boolean {
  if (squares.length === 0) return false
  if (squares.length === 1) return true

  // Check if all squares are connected (contiguous)
  return isContiguous(squares)
}

// Check if all squares form a contiguous shape
export function isContiguous(squares: SelectedSquare[]): boolean {
  if (squares.length <= 1) return true

  const visited = new Set<string>()
  const toVisit = [squares[0]]
  const squareSet = new Set(squares.map((s) => `${s.row}-${s.col}`))

  while (toVisit.length > 0) {
    const current = toVisit.pop()!
    const key = `${current.row}-${current.col}`

    if (visited.has(key)) continue
    visited.add(key)

    // Check all 4 neighbors
    const neighbors = [
      { row: current.row - 1, col: current.col },
      { row: current.row + 1, col: current.col },
      { row: current.row, col: current.col - 1 },
      { row: current.row, col: current.col + 1 },
    ]

    for (const neighbor of neighbors) {
      const neighborKey = `${neighbor.row}-${neighbor.col}`
      if (squareSet.has(neighborKey) && !visited.has(neighborKey)) {
        toVisit.push(neighbor)
      }
    }
  }

  return visited.size === squares.length
}

// Maximum selection dimensions - generous limits for bulk purchases
export const MAX_SELECTION_WIDTH = 100
export const MAX_SELECTION_HEIGHT = 100
export const MAX_SQUARES = 100

// Check if adding a square is allowed (no adjacency requirement - can select anywhere)
export function canAddSquare(
  existing: SelectedSquare[],
  newSquare: SelectedSquare
): boolean {
  if (existing.length === 0) return true

  // Check max squares limit only
  if (existing.length >= MAX_SQUARES) return false

  return true
}

// Validate selection size (for server-side validation)
export function isValidSelectionSize(squares: { row: number; col: number }[]): boolean {
  if (squares.length === 0) return false
  if (squares.length > MAX_SQUARES) return false

  return true
}

// Get edge visibility for a square in a selection (for unified border rendering)
export function getSelectionEdges(
  row: number,
  col: number,
  selectedSquares: SelectedSquare[]
): { top: boolean; right: boolean; bottom: boolean; left: boolean } {
  const isSelected = (r: number, c: number) =>
    selectedSquares.some((s) => s.row === r && s.col === c)

  return {
    top: !isSelected(row - 1, col),
    right: !isSelected(row, col + 1),
    bottom: !isSelected(row + 1, col),
    left: !isSelected(row, col - 1),
  }
}

// Check if a square is adjacent to any selected square
export function isAdjacent(
  square: SelectedSquare,
  selected: SelectedSquare[]
): boolean {
  if (selected.length === 0) return true

  return selected.some(
    (s) =>
      (Math.abs(s.row - square.row) === 1 && s.col === square.col) ||
      (Math.abs(s.col - square.col) === 1 && s.row === square.row)
  )
}

// Get selection dimensions
export function getSelectionDimensions(
  squares: SelectedSquare[]
): { width: number; height: number } {
  if (squares.length === 0) return { width: 0, height: 0 }

  const rows = squares.map((s) => s.row)
  const cols = squares.map((s) => s.col)

  return {
    width: Math.max(...cols) - Math.min(...cols) + 1,
    height: Math.max(...rows) - Math.min(...rows) + 1,
  }
}

// Validate URL format
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Generate share text
export function generateShareText(siteName: string): string {
  return `Just grabbed my spot on the @seobacklinks grid! Instant dofollow backlink for $1. Check it out: backlinkgrid.com`
}

// Generate Twitter share URL
export function getTwitterShareUrl(text: string): string {
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
}

// Generate LinkedIn share URL
export function getLinkedInShareUrl(url: string): string {
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
}

// Calculate reading time for content
export function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return `${minutes} min read`
}

// Slugify text for URLs
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim()
}

// Format date for display
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateString))
}

// Truncate text with ellipsis
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}
