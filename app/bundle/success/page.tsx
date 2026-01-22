import { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CheckCircle2, Download, Mail, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Purchase Complete - Backlink Database Bundle',
  robots: { index: false, follow: false },
}

// In production, you would verify the session and provide actual download links
// For now, this is a placeholder success page
export default function BundleSuccessPage() {
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
                  href="https://backlinkgrid.com/downloads/backlink-database-bundle.zip"
                  className="flex items-center justify-between p-4 bg-surface-50 border border-surface-200 hover:border-brand-red transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Download className="w-5 h-5 text-brand-red" />
                    <div className="text-left">
                      <p className="font-semibold">backlink-database-bundle.zip</p>
                      <p className="text-sm text-surface-500">Contains 2 CSV files (270+ sites)</p>
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
                      A copy of the download link has also been sent to your email.
                      Check your inbox (and spam folder) if you don't see it.
                    </p>
                  </div>
                </div>
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
