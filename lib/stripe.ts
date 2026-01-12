import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
})

// Backlink Square product and price IDs
export const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID || 'price_1SoQAGGe23gJ3NQhpTAJocKR'
export const STRIPE_PRODUCT_ID = process.env.STRIPE_PRODUCT_ID || 'prod_Tly6XzE01ybym8'

export interface CreateCheckoutParams {
  purchaseGroupId: string
  squareCount: number
  amountCents: number
  siteUrl: string
  siteName: string
  email: string
  logoUrl: string | null
  squares: { row: number; col: number }[]
}

export async function createCheckoutSession(
  params: CreateCheckoutParams
): Promise<string | null> {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}?cancelled=true`,
      customer_email: params.email,
      line_items: [
        {
          price: STRIPE_PRICE_ID,
          quantity: params.squareCount,
        },
      ],
      metadata: {
        purchase_group_id: params.purchaseGroupId,
        site_url: params.siteUrl,
        site_name: params.siteName,
        email: params.email,
        logo_url: params.logoUrl || '',
        squares: JSON.stringify(params.squares),
      },
    })

    return session.url
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return null
  }
}

export async function handleWebhook(
  body: string,
  signature: string
): Promise<{ success: boolean; event?: Stripe.Event }> {
  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
    return { success: true, event }
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return { success: false }
  }
}

export function getPaymentIntent(
  session: Stripe.Checkout.Session
): string | null {
  if (typeof session.payment_intent === 'string') {
    return session.payment_intent
  }
  if (session.payment_intent && 'id' in session.payment_intent) {
    return session.payment_intent.id
  }
  return null
}
