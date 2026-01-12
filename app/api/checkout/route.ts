import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { createCheckoutSession } from '@/lib/stripe'
import { calculatePrice } from '@/lib/utils'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const siteUrl = formData.get('siteUrl') as string
    const siteName = formData.get('siteName') as string
    const email = formData.get('email') as string
    const squaresJson = formData.get('squares') as string
    const logo = formData.get('logo') as File | null

    // Parse squares
    let squares: { row: number; col: number }[]
    try {
      squares = JSON.parse(squaresJson)
    } catch {
      return NextResponse.json(
        { error: 'Invalid squares data' },
        { status: 400 }
      )
    }

    // Validate required fields
    if (!siteUrl || !siteName || !email || !squares.length) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate URL format
    try {
      new URL(siteUrl)
    } catch {
      return NextResponse.json(
        { error: 'Invalid website URL' },
        { status: 400 }
      )
    }

    const supabase = createServerClient()

    // Check if squares are available
    const squareConditions = squares
      .map((s) => `and(row_index.eq.${s.row},col_index.eq.${s.col})`)
      .join(',')

    const { data: existingSquares } = await supabase
      .from('squares')
      .select('row_index, col_index, purchased')
      .or(squareConditions)

    const purchasedSquares = existingSquares?.filter((s) => s.purchased) || []
    if (purchasedSquares.length > 0) {
      return NextResponse.json(
        { error: 'One or more squares are already purchased' },
        { status: 400 }
      )
    }

    // Calculate price
    const amountCents = calculatePrice(squares.length)

    // Create purchase group ID
    const purchaseGroupId = uuidv4()

    // Upload logo if provided
    let logoUrl: string | null = null
    if (logo && logo.size > 0) {
      const fileExt = logo.name.split('.').pop()
      const fileName = `${purchaseGroupId}.${fileExt}`
      const filePath = `logos/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('public')
        .upload(filePath, logo, {
          cacheControl: '3600',
          upsert: true,
        })

      if (!uploadError) {
        const {
          data: { publicUrl },
        } = supabase.storage.from('public').getPublicUrl(filePath)
        logoUrl = publicUrl
      }
    }

    // Calculate dimensions
    const rows = squares.map((s) => s.row)
    const cols = squares.map((s) => s.col)
    const width = Math.max(...cols) - Math.min(...cols) + 1
    const height = Math.max(...rows) - Math.min(...rows) + 1

    // Create purchase group
    const { error: groupError } = await supabase.from('purchase_groups').insert({
      id: purchaseGroupId,
      width,
      height,
      square_count: squares.length,
      amount_cents: amountCents,
      currency: 'usd',
      site_url: siteUrl,
      site_name: siteName,
      logo_url: logoUrl,
      email,
      status: 'pending',
    })

    if (groupError) {
      console.error('Error creating purchase group:', groupError)
      return NextResponse.json(
        { error: 'Failed to create purchase' },
        { status: 500 }
      )
    }

    // Reserve squares (mark with purchase_group_id but not purchased yet)
    const squareRecords = squares.map((s) => ({
      row_index: s.row,
      col_index: s.col,
      purchased: false,
      purchase_group_id: purchaseGroupId,
    }))

    const { error: reserveError } = await supabase
      .from('squares')
      .upsert(squareRecords, {
        onConflict: 'row_index,col_index',
      })

    if (reserveError) {
      console.error('Error reserving squares:', reserveError)
      // Clean up purchase group
      await supabase.from('purchase_groups').delete().eq('id', purchaseGroupId)
      return NextResponse.json(
        { error: 'Failed to reserve squares' },
        { status: 500 }
      )
    }

    // Create Stripe checkout session
    const checkoutUrl = await createCheckoutSession({
      purchaseGroupId,
      squareCount: squares.length,
      amountCents,
      siteUrl,
      siteName,
      email,
      logoUrl,
      squares,
    })

    if (!checkoutUrl) {
      // Clean up
      await supabase.from('squares').delete().eq('purchase_group_id', purchaseGroupId)
      await supabase.from('purchase_groups').delete().eq('id', purchaseGroupId)
      return NextResponse.json(
        { error: 'Failed to create checkout session' },
        { status: 500 }
      )
    }

    // Update purchase group with Stripe session info
    await supabase
      .from('purchase_groups')
      .update({ stripe_session_id: checkoutUrl })
      .eq('id', purchaseGroupId)

    return NextResponse.json({ url: checkoutUrl })
  } catch (error) {
    console.error('Checkout API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
