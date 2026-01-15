export interface Square {
  id: string
  row_index: number
  col_index: number
  purchased: boolean
  purchase_group_id: string | null
  site_url: string | null
  site_name: string | null
  logo_url: string | null
  purchased_at: string | null
  updated_at?: string | null
  // NOTE: email is NOT stored in squares table to prevent PII exposure via RLS
  // Email is only stored in purchase_groups (service_role access only)
}

export interface PurchaseGroup {
  id: string
  width: number
  height: number
  square_count: number
  amount_cents: number
  currency: string
  stripe_session_id: string | null
  stripe_payment_intent: string | null
  site_url: string
  site_name: string
  logo_url: string | null
  email: string
  status: 'pending' | 'completed' | 'failed' | 'expired'
  created_at: string
  completed_at: string | null
}

export interface SelectedSquare {
  row: number
  col: number
}

export interface GridState {
  squares: Map<string, Square>
  selectedSquares: SelectedSquare[]
  isSelecting: boolean
  isModalOpen: boolean
  totalSold: number
  loading: boolean
}

export interface PurchaseFormData {
  siteUrl: string
  siteName: string
  email: string
  logoFile: File | null
}

export interface PricingTier {
  squares: number
  price: number
  label: string
}

// $1 per square (100 cents)
export const PRICE_PER_SQUARE = 100

// Grid configuration
export const GRID_COLUMNS = 10
export const TOTAL_SQUARES = 10000
export const MAX_ROWS = TOTAL_SQUARES / GRID_COLUMNS // 1000 rows
export const INITIAL_ROWS = 100 // Start with 1000 squares (100 rows x 10 cols)
export const SQUARE_SIZE = 80 // px

export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  author: string
  keywords: string[]
  content: string
  readingTime: string
}

export interface GlossaryTerm {
  slug: string
  term: string
  definition: string
  relatedTerms: string[]
}

export interface GuideContent {
  slug: string
  title: string
  description: string
  date: string
  keywords: string[]
  content: string
  readingTime: string
}
