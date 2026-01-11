import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const startRow = parseInt(searchParams.get('start') || '0')
  const endRow = parseInt(searchParams.get('end') || '50')

  try {
    const supabase = createServerClient()

    const { data: squares, error } = await supabase
      .from('squares')
      .select('*')
      .gte('row_index', startRow)
      .lt('row_index', endRow)
      .eq('purchased', true)
      .order('row_index', { ascending: true })
      .order('col_index', { ascending: true })

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

    return NextResponse.json({
      squares: squares || [],
      totalSold: totalSold || 0,
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
