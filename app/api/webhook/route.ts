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

      // Mark squares as purchased
      const { error: squaresError } = await supabase
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

      if (squaresError) {
        console.error('Error updating squares:', squaresError)
        return NextResponse.json(
          { error: 'Failed to update squares' },
          { status: 500 }
        )
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
