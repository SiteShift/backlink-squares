'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  CheckCircle2,
  Share2,
  Twitter,
  Linkedin,
  Link as LinkIcon,
  ArrowRight,
  Copy,
  ExternalLink,
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { getTwitterShareUrl, getLinkedInShareUrl } from '@/lib/utils'

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [copied, setCopied] = useState(false)

  const shareText =
    "Just grabbed my spot on the SEO Backlinks Grid! Instant dofollow backlink for $1. Check it out: backlinkgrid.com"
  const shareUrl = 'https://backlinkgrid.com'

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gradient-to-b from-success-50/50 to-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-success-100 rounded-full mb-8"
            >
              <CheckCircle2 className="w-10 h-10 text-success-600" />
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900"
            >
              You're on the Grid!
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-4 text-lg text-slate-600 max-w-xl mx-auto"
            >
              Your square is now live with a permanent dofollow backlink. Welcome
              to the SEO Backlinks community!
            </motion.p>

            {/* What happens next */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-10 bg-white rounded-2xl border border-slate-200 p-8 text-left"
            >
              <h2 className="font-display text-xl font-bold text-slate-900 mb-6">
                What happens next?
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-success-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-success-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">
                      Your square is live
                    </p>
                    <p className="text-sm text-slate-600">
                      Your logo and link are now visible on the grid
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-success-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-success-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">
                      Dofollow link active
                    </p>
                    <p className="text-sm text-slate-600">
                      Search engines can now discover and crawl your backlink
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-success-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-success-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">
                      Receipt sent
                    </p>
                    <p className="text-sm text-slate-600">
                      Check your email for your purchase confirmation
                    </p>
                  </div>
                </li>
              </ul>
            </motion.div>

            {/* Share Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 bg-slate-50 rounded-2xl p-8"
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                <Share2 className="w-5 h-5 text-slate-600" />
                <h3 className="font-display font-semibold text-slate-900">
                  Share your achievement
                </h3>
              </div>

              <p className="text-sm text-slate-600 mb-6">
                Let others know you're building your backlink profile
              </p>

              <div className="flex flex-wrap justify-center gap-3">
                <a
                  href={getTwitterShareUrl(shareText)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#1DA1F2] text-white rounded-lg hover:bg-[#1a8cd8] transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                  Tweet
                </a>

                <a
                  href={getLinkedInShareUrl(shareUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#0A66C2] text-white rounded-lg hover:bg-[#094d92] transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                  Share
                </a>

                <button
                  onClick={copyLink}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-success-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Link
                    </>
                  )}
                </button>
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/#grid">
                <Button variant="primary" size="lg" className="group">
                  View Your Square
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <Link href="/blog">
                <Button variant="secondary" size="lg">
                  Read Our SEO Blog
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
