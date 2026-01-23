import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

// This route must be dynamic as it calls Stripe API
export const dynamic = 'force-dynamic'

// Bundle product and price IDs
const BUNDLE_PRODUCT_ID = 'prod_TqD1I2sHtD0QCR'
const BUNDLE_PRICE_ID = 'price_1SsWbtGe23gJ3NQhIDjwkWmP'

export async function POST() {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      allow_promotion_codes: true,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/bundle/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/bundle?cancelled=true`,
      line_items: [
        {
          price: BUNDLE_PRICE_ID,
          quantity: 1,
        },
      ],
      metadata: {
        product_type: 'backlink_database_bundle',
        product_id: BUNDLE_PRODUCT_ID,
      },
    })

    if (!session.url) {
      return NextResponse.json(
        { error: 'Failed to create checkout session' },
        { status: 500 }
      )
    }

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Bundle checkout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
