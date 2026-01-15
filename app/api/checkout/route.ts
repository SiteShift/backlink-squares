import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { createCheckoutSession } from '@/lib/stripe'
import { calculatePrice, isValidSelectionSize } from '@/lib/utils'
import { GRID_COLUMNS, MAX_ROWS } from '@/lib/types'
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

    // Validate selection size (max 100 squares per purchase)
    if (!isValidSelectionSize(squares)) {
      return NextResponse.json(
        { error: 'Maximum 100 squares per purchase' },
        { status: 400 }
      )
    }

    // Validate squares are within grid bounds (0 <= row < MAX_ROWS, 0 <= col < GRID_COLUMNS)
    const outOfBounds = squares.some(
      s => s.row < 0 || s.row >= MAX_ROWS || s.col < 0 || s.col >= GRID_COLUMNS
    )
    if (outOfBounds) {
      return NextResponse.json(
        { error: 'One or more squares are outside the grid bounds' },
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
    const RESERVATION_TTL_MINUTES = 30

    // First, clean up any stale reservations (older than TTL)
    await supabase.rpc('cleanup_stale_reservations', { p_ttl_minutes: RESERVATION_TTL_MINUTES })

    // Check if squares are available
    const squareConditions = squares
      .map((s) => `and(row_index.eq.${s.row},col_index.eq.${s.col})`)
      .join(',')

    const { data: existingSquares } = await supabase
      .from('squares')
      .select('row_index, col_index, purchased, purchase_group_id')
      .or(squareConditions)

    // Check for already purchased squares
    const purchasedSquares = existingSquares?.filter((s) => s.purchased) || []
    if (purchasedSquares.length > 0) {
      return NextResponse.json(
        { error: 'One or more squares are already purchased' },
        { status: 400 }
      )
    }

    // Check for recent pending reservations (within TTL)
    // Get purchase group IDs for pending squares
    const pendingSquares = existingSquares?.filter(
      (s) => !s.purchased && s.purchase_group_id
    ) || []

    if (pendingSquares.length > 0) {
      // Verify these are recent reservations by checking purchase_groups.created_at
      const pendingGroupIds = Array.from(new Set(pendingSquares.map(s => s.purchase_group_id)))
      const { data: pendingGroups } = await supabase
        .from('purchase_groups')
        .select('id, created_at, email')
        .in('id', pendingGroupIds)
        .eq('status', 'pending')
        .gte('created_at', new Date(Date.now() - RESERVATION_TTL_MINUTES * 60 * 1000).toISOString())

      if (pendingGroups && pendingGroups.length > 0) {
        // Check if this is the same user retrying (same email)
        const sameUserRetrying = pendingGroups.every(
          g => g.email.toLowerCase() === email.toLowerCase()
        )

        if (sameUserRetrying) {
          // Same user is retrying - cancel their old pending reservations
          const oldGroupIds = pendingGroups.map(g => g.id)
          console.log(`User ${email} retrying checkout - cancelling old reservations:`, oldGroupIds)

          // Delete the reserved squares from old attempts
          await supabase
            .from('squares')
            .delete()
            .in('purchase_group_id', oldGroupIds)
            .eq('purchased', false)

          // Mark old purchase groups as failed (user abandoned and retried)
          await supabase
            .from('purchase_groups')
            .update({ status: 'failed' })
            .in('id', oldGroupIds)

          // Continue to create new reservation below...
        } else {
          // Different user trying to buy same squares - block them
          return NextResponse.json(
            { error: 'One or more squares are currently being purchased. Please try different squares or wait a moment.' },
            { status: 409 }
          )
        }
      }
    }

    // Calculate price and dimensions
    const amountCents = calculatePrice(squares.length)
    const purchaseGroupId = uuidv4()
    const rowIndices = squares.map((s) => s.row)
    const colIndices = squares.map((s) => s.col)
    const width = Math.max(...colIndices) - Math.min(...colIndices) + 1
    const height = Math.max(...rowIndices) - Math.min(...rowIndices) + 1

    // Upload logo if provided
    let logoUrl: string | null = null
    let logoFilePath: string | null = null
    if (logo && logo.size > 0) {
      const fileExt = logo.name.split('.').pop()
      const fileName = `${purchaseGroupId}.${fileExt}`
      logoFilePath = `logos/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('public')
        .upload(logoFilePath, logo, {
          cacheControl: '3600',
          upsert: true,
        })

      if (!uploadError) {
        const {
          data: { publicUrl },
        } = supabase.storage.from('public').getPublicUrl(logoFilePath)
        logoUrl = publicUrl
      }
    }

    // Helper to clean up orphaned logo on failure
    const cleanupLogo = async () => {
      if (logoFilePath) {
        await supabase.storage.from('public').remove([logoFilePath])
      }
    }

    // Create purchase group FIRST (needed for foreign key)
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
      await cleanupLogo()
      return NextResponse.json(
        { error: 'Failed to create purchase' },
        { status: 500 }
      )
    }

    // ATOMIC RESERVATION: Use RPC to insert squares with ON CONFLICT DO NOTHING
    // This prevents race conditions where two buyers reserve the same square
    const { data: insertedCount, error: reserveError } = await supabase.rpc('reserve_squares', {
      p_squares: squares,
      p_purchase_group_id: purchaseGroupId,
    })

    if (reserveError) {
      console.error('Error reserving squares:', reserveError)
      await supabase.from('purchase_groups').delete().eq('id', purchaseGroupId)
      await cleanupLogo()
      return NextResponse.json(
        { error: 'Failed to reserve squares' },
        { status: 500 }
      )
    }

    // If we couldn't insert all squares, someone else got them first
    if (insertedCount !== squares.length) {
      console.log(`Race condition: requested ${squares.length}, inserted ${insertedCount}`)
      // Clean up what we did insert
      await supabase.from('squares').delete().eq('purchase_group_id', purchaseGroupId)
      await supabase.from('purchase_groups').delete().eq('id', purchaseGroupId)
      await cleanupLogo()
      return NextResponse.json(
        { error: 'One or more squares were just taken. Please select different squares.' },
        { status: 409 }
      )
    }

    // Create Stripe checkout session
    const checkoutResult = await createCheckoutSession({
      purchaseGroupId,
      squareCount: squares.length,
      amountCents,
      siteUrl,
      siteName,
      email,
      logoUrl,
      squares,
    })

    if (!checkoutResult) {
      // Clean up everything including logo
      await supabase.from('squares').delete().eq('purchase_group_id', purchaseGroupId)
      await supabase.from('purchase_groups').delete().eq('id', purchaseGroupId)
      await cleanupLogo()
      return NextResponse.json(
        { error: 'Failed to create checkout session' },
        { status: 500 }
      )
    }

    // Update purchase group with Stripe session ID (not URL!)
    await supabase
      .from('purchase_groups')
      .update({ stripe_session_id: checkoutResult.sessionId })
      .eq('id', purchaseGroupId)

    return NextResponse.json({ url: checkoutResult.url })
  } catch (error) {
    console.error('Checkout API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
