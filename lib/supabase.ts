import { createClient } from '@supabase/supabase-js'
import { Square, PurchaseGroup } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client with service role
export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}

// Fetch squares with pagination
export async function fetchSquares(
  startRow: number = 0,
  endRow: number = 50
): Promise<Square[]> {
  const { data, error } = await supabase
    .from('squares')
    .select('*')
    .gte('row_index', startRow)
    .lt('row_index', endRow)
    .order('row_index', { ascending: true })
    .order('col_index', { ascending: true })

  if (error) {
    console.error('Error fetching squares:', error)
    return []
  }

  return data as Square[]
}

// Fetch total sold count
export async function fetchSoldCount(): Promise<number> {
  const { count, error } = await supabase
    .from('squares')
    .select('*', { count: 'exact', head: true })
    .eq('purchased', true)

  if (error) {
    console.error('Error fetching sold count:', error)
    return 0
  }

  return count || 0
}

// Check if squares are available
export async function checkSquaresAvailable(
  squares: { row: number; col: number }[]
): Promise<boolean> {
  const conditions = squares
    .map((s) => `(row_index.eq.${s.row},col_index.eq.${s.col})`)
    .join(',')

  const { data, error } = await supabase
    .from('squares')
    .select('purchased')
    .or(conditions)

  if (error) {
    console.error('Error checking squares:', error)
    return false
  }

  // If no data returned, squares don't exist yet (available)
  if (!data || data.length === 0) return true

  // Check if any are already purchased
  return !data.some((s) => s.purchased)
}

// Reserve squares (create pending purchase)
export async function reserveSquares(
  squares: { row: number; col: number }[],
  purchaseGroupId: string
): Promise<boolean> {
  const serverClient = createServerClient()

  // Upsert squares as pending
  const squareRecords = squares.map((s) => ({
    row_index: s.row,
    col_index: s.col,
    purchased: false,
    purchase_group_id: purchaseGroupId,
  }))

  const { error } = await serverClient.from('squares').upsert(squareRecords, {
    onConflict: 'row_index,col_index',
  })

  if (error) {
    console.error('Error reserving squares:', error)
    return false
  }

  return true
}

// Complete purchase (update squares)
export async function completePurchase(
  purchaseGroupId: string,
  siteUrl: string,
  siteName: string,
  logoUrl: string | null,
  email: string
): Promise<boolean> {
  const serverClient = createServerClient()

  const { error } = await serverClient
    .from('squares')
    .update({
      purchased: true,
      site_url: siteUrl,
      site_name: siteName,
      logo_url: logoUrl,
      email: email,
      purchased_at: new Date().toISOString(),
    })
    .eq('purchase_group_id', purchaseGroupId)

  if (error) {
    console.error('Error completing purchase:', error)
    return false
  }

  return true
}

// Upload logo to Supabase Storage
export async function uploadLogo(
  file: File,
  purchaseGroupId: string
): Promise<string | null> {
  const fileExt = file.name.split('.').pop()
  const fileName = `${purchaseGroupId}.${fileExt}`
  const filePath = `logos/${fileName}`

  const { error } = await supabase.storage
    .from('public')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    })

  if (error) {
    console.error('Error uploading logo:', error)
    return null
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from('public').getPublicUrl(filePath)

  return publicUrl
}

// Create purchase group
export async function createPurchaseGroup(
  data: Omit<PurchaseGroup, 'id' | 'created_at' | 'completed_at' | 'status'>
): Promise<string | null> {
  const serverClient = createServerClient()

  const { data: result, error } = await serverClient
    .from('purchase_groups')
    .insert({
      ...data,
      status: 'pending',
    })
    .select('id')
    .single()

  if (error) {
    console.error('Error creating purchase group:', error)
    return null
  }

  return result.id
}

// Update purchase group status
export async function updatePurchaseGroupStatus(
  id: string,
  status: 'pending' | 'completed' | 'failed',
  stripePaymentIntent?: string
): Promise<boolean> {
  const serverClient = createServerClient()

  const updateData: Record<string, unknown> = { status }
  if (status === 'completed') {
    updateData.completed_at = new Date().toISOString()
  }
  if (stripePaymentIntent) {
    updateData.stripe_payment_intent = stripePaymentIntent
  }

  const { error } = await serverClient
    .from('purchase_groups')
    .update(updateData)
    .eq('id', id)

  if (error) {
    console.error('Error updating purchase group:', error)
    return false
  }

  return true
}
