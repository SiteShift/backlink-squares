import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CheckCircle2, Download, Mail, ArrowRight, AlertCircle } from 'lucide-react'
import { stripe } from '@/lib/stripe'

export const metadata: Metadata = {
  title: 'Purchase Complete - Backlink Database Bundle',
  robots: { index: false, follow: false },
}

const BUNDLE_PRODUCT_ID = 'prod_TqD1I2sHtD0QCR'

interface Props {
  searchParams: { session_id?: string }
}

async function verifyPurchase(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'line_items.data.price.product'],
    })

    // Check if payment was successful
    if (session.payment_status !== 'paid') {
      return { valid: false, error: 'Payment not completed' }
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
      return { valid: false, error: 'Invalid product' }
    }

    return {
      valid: true,
      email: session.customer_details?.email || session.customer_email,
    }
  } catch (error) {
    console.error('Session verification error:', error)
    return { valid: false, error: 'Invalid session' }
  }
}

export default async function BundleSuccessPage({ searchParams }: Props) {
  const sessionId = searchParams.session_id

  // No session ID - redirect to bundle page
  if (!sessionId) {
    redirect('/bundle')
  }

  // Verify the purchase
  const verification = await verifyPurchase(sessionId)

  // Invalid session - show error
  if (!verification.valid) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-20 lg:pt-24 bg-surface-50">
          <div className="container-wide section-padding">
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <AlertCircle className="w-10 h-10 text-red-600" />
              </div>

              <h1 className="font-display text-3xl sm:text-4xl font-black mb-4">
                Unable to Verify Purchase
              </h1>

              <p className="text-lg text-surface-600 mb-8">
                We couldn't verify your purchase. This could happen if:
              </p>

              <ul className="text-left text-surface-600 mb-8 max-w-md mx-auto space-y-2">
                <li>• The payment is still processing</li>
                <li>• The session has expired</li>
                <li>• The link was accessed incorrectly</li>
              </ul>

              <p className="text-surface-600 mb-8">
                If you completed your purchase, please check your email for the download link,
                or contact us at{' '}
                <a href="mailto:support@backlinkgrid.com" className="text-brand-red hover:underline">
                  support@backlinkgrid.com
                </a>
              </p>

              <Link
                href="/bundle"
                className="inline-flex items-center gap-2 px-6 py-3 bg-surface-950 text-white font-bold hover:bg-brand-red transition-colors"
              >
                Return to Bundle Page
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  // Valid purchase - show download
  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 lg:pt-24 bg-surface-50">
        <div className="container-wide section-padding">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-black mb-4">
              Thank You for Your Purchase!
            </h1>

            <p className="text-lg text-surface-600 mb-8">
              Your Complete Backlink Database Bundle is ready for download.
            </p>

            <div className="bg-white border-2 border-surface-200 p-8 mb-8">
              <h2 className="font-display text-xl font-bold mb-6">Your Download</h2>

              <div className="space-y-4">
                <a
                  href={`/api/bundle-download?session_id=${sessionId}`}
                  className="flex items-center justify-between p-4 bg-surface-50 border border-surface-200 hover:border-brand-red transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Download className="w-5 h-5 text-brand-red" />
                    <div className="text-left">
                      <p className="font-semibold">backlink-database-bundle.csv</p>
                      <p className="text-sm text-surface-500">270+ High DR backlink sites</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-surface-400 group-hover:text-brand-red group-hover:translate-x-1 transition-all" />
                </a>
              </div>

              <div className="mt-6 pt-6 border-t border-surface-200">
                <div className="flex items-start gap-3 text-left">
                  <Mail className="w-5 h-5 text-surface-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-surface-600">
                      {verification.email ? (
                        <>A confirmation has been sent to <strong>{verification.email}</strong>.</>
                      ) : (
                        <>A confirmation email has been sent to your email address.</>
                      )}
                      {' '}Bookmark this page to access your download later.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 text-left">
                <p className="text-sm text-amber-800">
                  <strong>Important:</strong> This download link is tied to your purchase session.
                  Please download your file now and save it to your device.
                </p>
              </div>
            </div>

            <div className="bg-surface-950 text-white p-6">
              <h3 className="font-display text-lg font-bold mb-2">Need a Backlink Right Now?</h3>
              <p className="text-white/70 mb-4">
                Get a permanent dofollow backlink on our grid starting at just $1
              </p>
              <Link
                href="/#grid"
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-red text-white font-bold hover:bg-brand-yellow hover:text-surface-950 transition-colors"
              >
                Claim Your Square
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
