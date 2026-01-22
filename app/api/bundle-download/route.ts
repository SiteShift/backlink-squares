import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { readFile } from 'fs/promises'
import path from 'path'

const BUNDLE_PRODUCT_ID = 'prod_TqD1I2sHtD0QCR'

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Missing session ID' },
        { status: 400 }
      )
    }

    // Verify the Stripe session
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'line_items.data.price.product'],
    })

    // Check if payment was successful
    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 403 }
      )
    }

    // Verify this is a bundle purchase
    const isBundlePurchase = session.line_items?.data.some((item) => {
      const product = item.price?.product
      if (typeof product === 'object' && product !== null && 'id' in product) {
        return product.id === BUNDLE_PRODUCT_ID
      }
      return false
    })

    if (!isBundlePurchase) {
      return NextResponse.json(
        { error: 'Invalid product' },
        { status: 403 }
      )
    }

    // Read the file from private directory
    const filePath = path.join(process.cwd(), 'private', 'downloads', 'backlink-database-bundle.csv')
    const fileBuffer = await readFile(filePath)

    // Return the file with appropriate headers
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="backlink-database-bundle.csv"',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    })
  } catch (error) {
    console.error('Bundle download error:', error)

    // Check if it's a Stripe error (invalid session)
    if (error instanceof Error && error.message.includes('No such checkout.session')) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { error: 'Download failed' },
      { status: 500 }
    )
  }
}
