import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const since = searchParams.get('since') // ISO timestamp for delta polling

  try {
    const supabase = createServerClient()

    // Build query - fetch all purchased squares, or just updated ones for delta polling
    // IMPORTANT: Only select public fields - never expose email (PII)
    const publicFields = 'id, row_index, col_index, purchased, purchase_group_id, site_url, site_name, logo_url, purchased_at, updated_at'
    let query = supabase
      .from('squares')
      .select(publicFields)
      .eq('purchased', true)
      .order('row_index', { ascending: true })
      .order('col_index', { ascending: true })

    // Delta polling: only fetch squares updated since timestamp
    if (since) {
      query = query.gte('updated_at', since)
    }

    const { data: squares, error } = await query

    if (error) {
      console.error('Error fetching squares:', error)
      return NextResponse.json(
        { error: 'Failed to fetch squares' },
        { status: 500 }
      )
    }

    // Get total sold count
    const { count: totalSold } = await supabase
      .from('squares')
      .select('*', { count: 'exact', head: true })
      .eq('purchased', true)

    // Include timestamp for next delta poll
    const now = new Date().toISOString()

    return NextResponse.json({
      squares: squares || [],
      totalSold: totalSold || 0,
      timestamp: now,
      isDelta: !!since,
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
