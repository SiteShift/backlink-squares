import { NextRequest, NextResponse } from 'next/server'
import { stripe, getPaymentIntent } from '@/lib/stripe'
import { createServerClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get('session_id')

  if (!sessionId) {
    return NextResponse.json({ valid: false, error: 'Missing session_id' }, { status: 400 })
  }

  try {
    // Verify with Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ valid: false, error: 'Payment not completed' }, { status: 400 })
    }

    const purchaseGroupId = session.metadata?.purchase_group_id

    if (!purchaseGroupId) {
      return NextResponse.json({ valid: false, error: 'Invalid session' }, { status: 400 })
    }

    const supabase = createServerClient()

    // Check purchase group status
    const { data: purchaseGroup } = await supabase
      .from('purchase_groups')
      .select('status, site_name, site_url, logo_url, email')
      .eq('id', purchaseGroupId)
      .single()

    if (!purchaseGroup) {
      return NextResponse.json({ valid: false, error: 'Purchase not found' }, { status: 400 })
    }

    // SELF-HEALING: If Stripe says paid but webhook hasn't completed, complete it now
    if (purchaseGroup.status !== 'completed') {
      console.log(`Self-healing purchase ${purchaseGroupId}: Stripe paid, DB pending`)

      // Get metadata from Stripe session
      const siteUrl = session.metadata?.site_url || purchaseGroup.site_url
      const siteName = session.metadata?.site_name || purchaseGroup.site_name
      const logoUrl = session.metadata?.logo_url || purchaseGroup.logo_url
      const email = session.metadata?.email || purchaseGroup.email
      const paymentIntent = getPaymentIntent(session)

      // Update purchase group to completed
      const { error: updateGroupError } = await supabase
        .from('purchase_groups')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          stripe_payment_intent: paymentIntent,
        })
        .eq('id', purchaseGroupId)

      if (updateGroupError) {
        console.error('Self-heal: Failed to update purchase group:', updateGroupError)
        return NextResponse.json({ valid: false, error: 'webhook_pending' }, { status: 202 })
      }

      // Update squares to purchased (only those still belonging to this purchase group)
      // NOTE: email is NOT stored in squares to prevent PII exposure via RLS
      const { data: updatedSquares, error: updateSquaresError } = await supabase
        .from('squares')
        .update({
          purchased: true,
          site_url: siteUrl,
          site_name: siteName,
          logo_url: logoUrl || null,
          purchased_at: new Date().toISOString(),
        })
        .eq('purchase_group_id', purchaseGroupId)
        .select('id')

      if (updateSquaresError) {
        console.error('Self-heal: Failed to update squares:', updateSquaresError)
      }

      // If no squares were updated (they were released by TTL), try to reclaim available ones
      // Use the safe complete_purchase_squares RPC that won't overwrite others' purchases
      const updatedCount = updatedSquares?.length ?? 0
      if (updatedCount === 0 && session.metadata?.squares) {
        console.log(`Self-heal: No squares found for ${purchaseGroupId}, attempting to reclaim from Stripe metadata`)
        try {
          const squaresFromStripe = JSON.parse(session.metadata.squares) as { row: number; col: number }[]

          // Use the atomic RPC that only updates squares if:
          // 1. They don't exist (inserts new)
          // 2. They're not purchased
          // 3. They belong to this same purchase group
          const { data: completedCount, error: rpcError } = await supabase.rpc('complete_purchase_squares', {
            p_squares: squaresFromStripe,
            p_purchase_group_id: purchaseGroupId,
            p_site_url: siteUrl,
            p_site_name: siteName,
            p_logo_url: logoUrl || null,
          })

          if (rpcError) {
            console.error('Self-heal: Failed to complete squares via RPC:', rpcError)
          } else {
            const expectedCount = squaresFromStripe.length
            if (completedCount < expectedCount) {
              console.warn(`Self-heal: Only ${completedCount}/${expectedCount} squares available for ${purchaseGroupId} - others were purchased`)
              // User paid but some squares were taken by others during the race window
              // Support will need to handle refund/reassignment
            } else {
              console.log(`Self-heal: Reclaimed all ${completedCount} squares for ${purchaseGroupId}`)
            }
          }
        } catch (parseError) {
          console.error('Self-heal: Failed to parse squares from Stripe metadata:', parseError)
        }
      }

      console.log(`Self-healed purchase ${purchaseGroupId} successfully`)

      return NextResponse.json({
        valid: true,
        siteName: siteName,
        siteUrl: siteUrl,
      })
    }

    // Already completed
    return NextResponse.json({
      valid: true,
      siteName: purchaseGroup.site_name,
      siteUrl: purchaseGroup.site_url,
    })
  } catch (error) {
    console.error('Error verifying purchase:', error)
    return NextResponse.json({ valid: false, error: 'Verification failed' }, { status: 500 })
  }
}
