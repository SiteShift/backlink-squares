import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { stripe, getPaymentIntent } from '@/lib/stripe'
import { createServerClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const headersList = headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  const supabase = createServerClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session

      const purchaseGroupId = session.metadata?.purchase_group_id
      const siteUrl = session.metadata?.site_url
      const siteName = session.metadata?.site_name
      const email = session.metadata?.email
      const logoUrl = session.metadata?.logo_url || null

      if (!purchaseGroupId) {
        console.error('Missing purchase_group_id in session metadata')
        return NextResponse.json(
          { error: 'Missing purchase_group_id' },
          { status: 400 }
        )
      }

      const paymentIntent = getPaymentIntent(session)

      // Update purchase group status
      const { error: groupError } = await supabase
        .from('purchase_groups')
        .update({
          status: 'completed',
          stripe_payment_intent: paymentIntent,
          completed_at: new Date().toISOString(),
        })
        .eq('id', purchaseGroupId)

      if (groupError) {
        console.error('Error updating purchase group:', groupError)
        return NextResponse.json(
          { error: 'Failed to update purchase group' },
          { status: 500 }
        )
      }

      // Mark squares as purchased (only those still belonging to this purchase group)
      // NOTE: email is NOT stored in squares to prevent PII exposure via RLS
      const { data: updatedSquares, error: squaresError } = await supabase
        .from('squares')
        .update({
          purchased: true,
          site_url: siteUrl,
          site_name: siteName,
          logo_url: logoUrl,
          purchased_at: new Date().toISOString(),
        })
        .eq('purchase_group_id', purchaseGroupId)
        .select('id')

      if (squaresError) {
        console.error('Error updating squares:', squaresError)
        return NextResponse.json(
          { error: 'Failed to update squares' },
          { status: 500 }
        )
      }

      // If no squares were updated (released by TTL), backfill from Stripe metadata
      // Use the safe complete_purchase_squares RPC that won't overwrite others' purchases
      const updatedCount = updatedSquares?.length ?? 0
      if (updatedCount === 0 && session.metadata?.squares) {
        console.log(`Webhook backfill: No squares found for ${purchaseGroupId}, reclaiming from Stripe metadata`)
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
            p_logo_url: logoUrl,
          })

          if (rpcError) {
            console.error('Webhook backfill: Failed to complete squares via RPC:', rpcError)
          } else {
            const expectedCount = squaresFromStripe.length
            if (completedCount < expectedCount) {
              console.warn(`Webhook backfill: Only ${completedCount}/${expectedCount} squares available for ${purchaseGroupId} - others were purchased`)
              // User paid but some squares were taken. Support will need to handle refund/reassignment
            } else {
              console.log(`Webhook backfill: Reclaimed all ${completedCount} squares for ${purchaseGroupId}`)
            }
          }
        } catch (parseError) {
          console.error('Webhook backfill: Failed to parse squares from Stripe metadata:', parseError)
        }
      }

      console.log(
        `Purchase completed: ${purchaseGroupId} for ${siteName} (${siteUrl})`
      )

      // TODO: Send confirmation email via Resend
      // await sendConfirmationEmail({ email, siteName, siteUrl, purchaseGroupId })

      break
    }

    case 'checkout.session.expired': {
      const session = event.data.object as Stripe.Checkout.Session
      const purchaseGroupId = session.metadata?.purchase_group_id

      if (purchaseGroupId) {
        // Clean up reserved squares
        await supabase
          .from('squares')
          .delete()
          .eq('purchase_group_id', purchaseGroupId)
          .eq('purchased', false)

        // Update purchase group status
        await supabase
          .from('purchase_groups')
          .update({ status: 'failed' })
          .eq('id', purchaseGroupId)

        console.log(`Checkout expired: ${purchaseGroupId}`)
      }
      break
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.log('Payment failed:', paymentIntent.id)
      break
    }

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
