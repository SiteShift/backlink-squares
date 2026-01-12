'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  CheckCircle2,
  Share2,
  Twitter,
  Linkedin,
  Copy,
  ArrowRight,
  ExternalLink,
  Grid3X3,
  Link as LinkIcon,
  Mail,
  Loader2,
  AlertCircle,
  RefreshCw,
  Clock,
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getTwitterShareUrl, getLinkedInShareUrl } from '@/lib/utils'

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionId = searchParams.get('session_id')
  const [copied, setCopied] = useState(false)
  const [verificationState, setVerificationState] = useState<'loading' | 'valid' | 'invalid' | 'processing' | 'timeout'>('loading')
  const [retryCount, setRetryCount] = useState(0)
  const maxRetries = 5
  const [purchaseInfo, setPurchaseInfo] = useState<{ siteName?: string; siteUrl?: string }>({})
  const [isManualRetrying, setIsManualRetrying] = useState(false)

  const shareText =
    "Just grabbed my spot on the Backlink Grid! Permanent dofollow backlink for $1. Check it out: backlinkgrid.com"
  const shareUrl = 'https://backlinkgrid.com'

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Manual retry function
  const handleManualRetry = () => {
    setIsManualRetrying(true)
    setRetryCount(0)
    setVerificationState('loading')
  }

  // Verify purchase with backend
  useEffect(() => {
    if (!sessionId) {
      setVerificationState('invalid')
      return
    }

    const verifyPurchase = async () => {
      try {
        const response = await fetch(`/api/verify-purchase?session_id=${sessionId}`)
        const data = await response.json()

        setIsManualRetrying(false)

        if (data.valid) {
          setVerificationState('valid')
          setPurchaseInfo({ siteName: data.siteName, siteUrl: data.siteUrl })
        } else if (data.error === 'webhook_pending') {
          // Stripe says paid but webhook hasn't completed yet
          if (retryCount < maxRetries) {
            setVerificationState('processing')
            setTimeout(() => setRetryCount(c => c + 1), 3000)
          } else {
            // Max retries exhausted - show timeout state with manual retry option
            setVerificationState('timeout')
          }
        } else {
          setVerificationState('invalid')
        }
      } catch (error) {
        console.error('Verification error:', error)
        setIsManualRetrying(false)
        // On network error, retry or timeout
        if (retryCount < maxRetries) {
          setVerificationState('processing')
          setTimeout(() => setRetryCount(c => c + 1), 3000)
        } else {
          setVerificationState('timeout')
        }
      }
    }

    verifyPurchase()
  }, [sessionId, retryCount, maxRetries])

  const steps = [
    {
      icon: Grid3X3,
      title: 'Your square is live',
      description: 'Your logo and link are now visible on the grid',
      color: 'bg-bauhaus-red',
    },
    {
      icon: LinkIcon,
      title: 'Dofollow link active',
      description: 'Search engines can now discover and crawl your backlink',
      color: 'bg-bauhaus-blue',
    },
    {
      icon: Mail,
      title: 'Receipt sent',
      description: 'Check your email for your purchase confirmation',
      color: 'bg-bauhaus-yellow',
    },
  ]

  // Loading state
  if (verificationState === 'loading') {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-bauhaus-cream flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-bauhaus-blue animate-spin mx-auto mb-4" />
            <p className="text-dark/60 font-medium">Verifying your purchase...</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  // Processing state - payment received, finalizing purchase
  if (verificationState === 'processing') {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-bauhaus-cream flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div
              className="inline-flex items-center justify-center w-20 h-20 bg-bauhaus-yellow border-4 border-dark mb-6"
              style={{ boxShadow: '6px 6px 0 0 #0A0A0A' }}
            >
              <Loader2 className="w-10 h-10 text-dark animate-spin" />
            </div>
            <h1 className="font-display font-black text-3xl text-dark mb-4">
              Finalizing Your Purchase
            </h1>
            <p className="text-dark/60 mb-4">
              Your payment was successful! We're setting up your square on the grid. This usually takes just a few seconds.
            </p>
            {retryCount > 0 && (
              <p className="text-sm text-dark/40">
                Attempt {retryCount + 1} of {maxRetries + 1}...
              </p>
            )}
          </div>
        </main>
        <Footer />
      </>
    )
  }

  // Timeout state - retries exhausted, show manual retry option
  if (verificationState === 'timeout') {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-bauhaus-cream flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div
              className="inline-flex items-center justify-center w-20 h-20 bg-bauhaus-yellow border-4 border-dark mb-6"
              style={{ boxShadow: '6px 6px 0 0 #0A0A0A' }}
            >
              <Clock className="w-10 h-10 text-dark" />
            </div>
            <h1 className="font-display font-black text-3xl text-dark mb-4">
              Still Processing
            </h1>
            <p className="text-dark/60 mb-2">
              Your payment was received, but your square is taking longer than usual to set up.
            </p>
            <p className="text-dark/60 mb-6">
              Don't worry — your email confirmation is authoritative. Check your inbox for the receipt from Stripe.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleManualRetry}
                disabled={isManualRetrying}
                className="inline-flex items-center gap-2 px-6 py-3 bg-bauhaus-blue text-white font-bold uppercase tracking-wider border-3 border-dark hover:bg-dark transition-colors disabled:opacity-50"
                style={{ boxShadow: '4px 4px 0 0 #0A0A0A' }}
              >
                {isManualRetrying ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                Check Again
              </button>
              <a
                href="mailto:hello@backlinkgrid.com"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-dark font-bold uppercase tracking-wider border-3 border-dark hover:bg-bauhaus-red hover:text-white transition-colors"
                style={{ boxShadow: '4px 4px 0 0 #0A0A0A' }}
              >
                <Mail className="w-4 h-4" />
                Contact Support
              </a>
            </div>
            <p className="mt-6 text-sm text-dark/40">
              Or return to the <Link href="/" className="underline hover:text-bauhaus-blue">homepage</Link> and check back later.
            </p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  // Invalid state
  if (verificationState === 'invalid') {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-bauhaus-cream flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div
              className="inline-flex items-center justify-center w-20 h-20 bg-bauhaus-red border-4 border-dark mb-6"
              style={{ boxShadow: '6px 6px 0 0 #0A0A0A' }}
            >
              <AlertCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="font-display font-black text-3xl text-dark mb-4">
              Purchase Not Found
            </h1>
            <p className="text-dark/60 mb-8">
              We couldn't verify your purchase. If you just completed payment, please wait a moment and refresh.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-dark text-white font-bold uppercase tracking-wider border-3 border-dark hover:bg-bauhaus-blue transition-colors"
              style={{ boxShadow: '4px 4px 0 0 #0A0A0A' }}
            >
              Return to Grid
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-bauhaus-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          {/* Success Header */}
          <div className="text-center mb-12">
            {/* Success Icon - Bauhaus style */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="inline-flex items-center justify-center w-24 h-24 bg-bauhaus-blue border-4 border-dark mb-8"
              style={{ boxShadow: '6px 6px 0 0 #0A0A0A' }}
            >
              <CheckCircle2 className="w-12 h-12 text-white" strokeWidth={2.5} />
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-dark leading-tight"
            >
              You're on the Grid!
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-4 text-lg text-dark/60 max-w-xl mx-auto"
            >
              Your square is now live with a permanent dofollow backlink. Welcome
              to the Backlink Grid community!
            </motion.p>
          </div>

          {/* What happens next - Bauhaus card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white border-4 border-dark p-8 lg:p-10 mb-8"
            style={{ boxShadow: '8px 8px 0 0 #0A0A0A' }}
          >
            <h2 className="font-display font-black text-2xl text-dark mb-8 pb-4 border-b-4 border-dark">
              What happens next?
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex flex-col items-center text-center p-4"
                >
                  <div
                    className={`w-16 h-16 ${step.color} border-3 border-dark flex items-center justify-center mb-4`}
                    style={{ boxShadow: '4px 4px 0 0 #0A0A0A' }}
                  >
                    <step.icon className="w-8 h-8 text-white" strokeWidth={2} />
                  </div>
                  <h3 className="font-display font-bold text-lg text-dark mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-dark/60">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Share Section - Bauhaus style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-bauhaus-yellow border-4 border-dark p-8"
            style={{ boxShadow: '8px 8px 0 0 #0A0A0A' }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Share2 className="w-6 h-6 text-dark" />
              <h3 className="font-display font-black text-xl text-dark">
                Share your achievement
              </h3>
            </div>

            <p className="text-center text-dark/70 mb-6">
              Let others know you're building your backlink profile
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <a
                href={getTwitterShareUrl(shareText)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 bg-dark text-white font-bold uppercase tracking-wider text-sm border-3 border-dark hover:bg-white hover:text-dark transition-colors"
                style={{ boxShadow: '4px 4px 0 0 #0A0A0A' }}
              >
                <Twitter className="w-5 h-5" />
                Tweet
              </a>

              <a
                href={getLinkedInShareUrl(shareUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 bg-dark text-white font-bold uppercase tracking-wider text-sm border-3 border-dark hover:bg-white hover:text-dark transition-colors"
                style={{ boxShadow: '4px 4px 0 0 #0A0A0A' }}
              >
                <Linkedin className="w-5 h-5" />
                Share
              </a>

              <button
                onClick={copyLink}
                className="inline-flex items-center gap-2 px-5 py-3 bg-white text-dark font-bold uppercase tracking-wider text-sm border-3 border-dark hover:bg-dark hover:text-white transition-colors"
                style={{ boxShadow: '4px 4px 0 0 #0A0A0A' }}
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    Copy Link
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/#grid"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-bauhaus-red text-white font-bold uppercase tracking-wider border-3 border-dark hover:bg-dark transition-colors"
              style={{ boxShadow: '4px 4px 0 0 #0A0A0A' }}
            >
              View Your Square
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/blog"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-dark font-bold uppercase tracking-wider border-3 border-dark hover:bg-bauhaus-blue hover:text-white transition-colors"
              style={{ boxShadow: '4px 4px 0 0 #0A0A0A' }}
            >
              Read our Blog
              <ExternalLink className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </main>

      <Footer />
    </>
  )
}
