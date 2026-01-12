'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion } from 'framer-motion'
import {
  Upload,
  Check,
  AlertCircle,
  Image as ImageIcon,
  ArrowRight,
  Zap,
  Link as LinkIcon,
  Shield,
  Clock,
  Lock,
  Sparkles,
} from 'lucide-react'
import { useGridStore } from '@/lib/store'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
  formatPrice,
  getSelectionDimensions,
  isValidUrl,
  isValidEmail,
} from '@/lib/utils'

export function PurchaseModal() {
  const {
    isModalOpen,
    closeModal,
    selectedSquares,
    getSelectionPrice,
    clearSelection,
  } = useGridStore()

  const [formData, setFormData] = useState({
    siteUrl: '',
    siteName: '',
    email: '',
  })
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const price = getSelectionPrice()
  const { width, height } = getSelectionDimensions(selectedSquares)
  const count = selectedSquares.length

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setLogoFile(file)
      const reader = new FileReader()
      reader.onload = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
    },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
  })

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.siteUrl) {
      newErrors.siteUrl = 'Website URL is required'
    } else if (!isValidUrl(formData.siteUrl)) {
      newErrors.siteUrl = 'Please enter a valid URL (include https://)'
    }

    if (!formData.siteName) {
      newErrors.siteName = 'Site name is required'
    } else if (formData.siteName.length > 50) {
      newErrors.siteName = 'Site name must be 50 characters or less'
    }

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!agreedToTerms) {
      newErrors.terms = 'You must agree to the terms'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const submitData = new FormData()
      submitData.append('siteUrl', formData.siteUrl)
      submitData.append('siteName', formData.siteName)
      submitData.append('email', formData.email)
      submitData.append('squares', JSON.stringify(selectedSquares))
      if (logoFile) {
        submitData.append('logo', logoFile)
      }

      const response = await fetch('/api/checkout', {
        method: 'POST',
        body: submitData,
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error(data.error || 'Failed to create checkout session')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      setErrors({ submit: 'Something went wrong. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    closeModal()
    setTimeout(() => {
      setFormData({ siteUrl: '', siteName: '', email: '' })
      setLogoFile(null)
      setLogoPreview(null)
      setErrors({})
      setAgreedToTerms(false)
    }, 300)
  }

  return (
    <Modal isOpen={isModalOpen} onClose={handleClose} title="Claim Your Backlink" size="xl">
      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-surface-200">
          {/* Left Column - Form */}
          <div className="lg:col-span-3 p-5 sm:p-6 space-y-5">
            {/* Selection Summary - Compact */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-brand-red to-rose-600 border-2 border-surface-950">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-white border-2 border-surface-950 flex items-center justify-center">
                  <span className="text-xl font-black text-brand-red">{count}</span>
                </div>
                <div>
                  <p className="font-black text-white uppercase tracking-wide">
                    {count === 1 ? '1 Square' : `${count} Squares`}
                    {count > 1 && width === height && (
                      <span className="text-white/70 font-medium ml-1.5">
                        ({width}x{height})
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-white/80">
                    Lifetime dofollow backlink
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black text-white">
                  {formatPrice(price)}
                </p>
                <p className="text-[10px] text-white/70 uppercase tracking-wider">One-time payment</p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <Input
                id="siteUrl"
                label="Backlink Destination"
                placeholder="https://yoursite.com"
                value={formData.siteUrl}
                onChange={(e) =>
                  setFormData({ ...formData, siteUrl: e.target.value })
                }
                error={errors.siteUrl}
                hint="Your permanent dofollow link will point here"
                autoComplete="url"
              />

              <Input
                id="siteName"
                label="Brand Name"
                placeholder="Your Brand"
                value={formData.siteName}
                onChange={(e) =>
                  setFormData({ ...formData, siteName: e.target.value })
                }
                error={errors.siteName}
                hint={`Shown on hover (${formData.siteName.length}/50 characters)`}
              />

              <Input
                id="email"
                type="email"
                label="Email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                error={errors.email}
                hint="Instant receipt + confirmation"
                autoComplete="email"
              />

              {/* Logo Upload - Reframed as beneficial */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-surface-950">
                  <Sparkles className="w-4 h-4 text-brand-yellow" />
                  Add Your Logo
                  <span className="text-xs font-normal normal-case text-surface-400">(recommended)</span>
                </label>
                <div
                  {...getRootProps()}
                  className={`
                    relative flex flex-col items-center justify-center p-5
                    border-2 border-dashed cursor-pointer transition-all duration-150
                    ${isDragActive
                      ? 'border-brand-blue bg-brand-blue/5'
                      : logoPreview
                        ? 'border-green-400 bg-green-50'
                        : 'border-surface-300 hover:border-brand-yellow hover:bg-brand-yellow/5'
                    }
                  `}
                >
                  <input {...getInputProps()} />

                  {logoPreview ? (
                    <div className="flex items-center gap-4">
                      <div className="relative w-14 h-14 bg-white border-2 border-surface-200 overflow-hidden">
                        <img
                          src={logoPreview}
                          alt="Logo preview"
                          className="w-full h-full object-contain p-1"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-green-700 flex items-center gap-1">
                          <Check className="w-4 h-4" />
                          Logo uploaded
                        </p>
                        <p className="text-xs text-surface-500">
                          Click to replace
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-10 h-10 bg-brand-yellow/20 rounded-full mb-2">
                        {isDragActive ? (
                          <Upload className="w-5 h-5 text-brand-yellow" strokeWidth={2} />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-surface-500" strokeWidth={2} />
                        )}
                      </div>
                      <p className="text-sm text-surface-600">
                        <span className="font-semibold text-surface-950">Drop logo here</span> or click to browse
                      </p>
                      <p className="text-xs text-surface-400 mt-1">
                        PNG/JPG, 64x64px min
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Terms Agreement */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative flex items-center mt-0.5">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="sr-only peer"
                />
                <div
                  className={`
                    w-5 h-5 border-2 transition-all flex items-center justify-center
                    ${agreedToTerms
                      ? 'bg-brand-blue border-surface-950'
                      : 'border-surface-300 group-hover:border-brand-blue'
                    }
                    ${errors.terms ? 'border-brand-red' : ''}
                  `}
                >
                  {agreedToTerms && (
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  )}
                </div>
              </div>
              <span className="text-sm text-surface-600">
                I agree to the{' '}
                <a href="/terms" target="_blank" className="text-brand-red font-semibold hover:underline">
                  Terms
                </a>{' '}
                and{' '}
                <a href="/privacy" target="_blank" className="text-brand-red font-semibold hover:underline">
                  Privacy Policy
                </a>
              </span>
            </label>
            {errors.terms && (
              <p className="text-sm text-brand-red font-medium flex items-center gap-1 -mt-2">
                <AlertCircle className="w-4 h-4" />
                {errors.terms}
              </p>
            )}

            {/* Submit Error */}
            {errors.submit && (
              <div className="p-3 bg-brand-red/10 border-2 border-brand-red">
                <p className="text-sm text-brand-red font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {errors.submit}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="red"
              size="lg"
              isLoading={isSubmitting}
              className="w-full group"
            >
              <span>Get My Backlink</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              <span className="ml-2 px-2 py-0.5 bg-white/20 rounded text-sm">{formatPrice(price)}</span>
            </Button>

            {/* Payment Security */}
            <div className="flex items-center justify-center gap-2 text-xs text-surface-400">
              <Lock className="w-3.5 h-3.5" />
              <span>Secured by</span>
              <svg className="h-4" viewBox="0 0 60 25" fill="currentColor">
                <path d="M59.64 14.28h-8.06v-1.5h8.06v1.5zm-8.06-4.7h8.06v1.5h-8.06v-1.5zm8.06 9.4h-8.06v-1.5h8.06v1.5zm-24.6-9.4h-8.06v1.5h8.06v-1.5zm-8.06 4.7h8.06v1.5h-8.06v-1.5zm8.06 4.7h-8.06v-1.5h8.06v1.5zM17.3 4.28c-5.5 0-9.96 4.46-9.96 9.96s4.46 9.96 9.96 9.96 9.96-4.46 9.96-9.96-4.46-9.96-9.96-9.96zm0 16.92c-3.84 0-6.96-3.12-6.96-6.96s3.12-6.96 6.96-6.96 6.96 3.12 6.96 6.96-3.12 6.96-6.96 6.96z"/>
              </svg>
              <span className="font-semibold text-surface-500">Stripe</span>
            </div>
          </div>

          {/* Right Column - Value Props & Preview */}
          <div className="lg:col-span-2 p-5 sm:p-6 bg-surface-50 space-y-5">
            {/* What You Get */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-surface-400 mb-3">
                What You Get
              </h3>
              <div className="space-y-2.5">
                {[
                  { icon: LinkIcon, text: 'Permanent dofollow backlink', color: 'text-brand-red' },
                  { icon: Zap, text: 'Live instantly after payment', color: 'text-brand-yellow' },
                  { icon: Shield, text: 'No monthly fees, ever', color: 'text-brand-blue' },
                  { icon: ImageIcon, text: 'Your logo on the grid', color: 'text-green-600' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className={`w-5 h-5 rounded-full bg-white border border-surface-200 flex items-center justify-center`}>
                      <item.icon className={`w-3 h-3 ${item.color}`} />
                    </div>
                    <span className="text-sm text-surface-700">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Grid Preview */}
            <div className="p-4 bg-white border-2 border-surface-200">
              <p className="text-[10px] font-bold uppercase tracking-widest text-surface-400 mb-3">
                Your Square Preview
              </p>
              <div className="flex items-center gap-3">
                <div className="relative">
                  {/* Mini grid representation */}
                  <div className="grid grid-cols-4 gap-0.5">
                    {Array.from({ length: 16 }).map((_, i) => {
                      const isSelected = i >= 5 && i <= 6
                      return (
                        <div
                          key={i}
                          className={`w-4 h-4 border ${isSelected ? 'bg-brand-red border-brand-red' : 'bg-surface-100 border-surface-200'}`}
                        >
                          {isSelected && logoPreview && (
                            <img src={logoPreview} alt="" className="w-full h-full object-cover" />
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-surface-950 truncate">
                    {formData.siteName || 'Your Brand'}
                  </p>
                  <p className="text-xs text-brand-red truncate">
                    {formData.siteUrl || 'yoursite.com'}
                  </p>
                </div>
              </div>
            </div>

            {/* What Happens Next */}
            <div className="p-4 bg-green-50 border border-green-200">
              <p className="text-[10px] font-bold uppercase tracking-widest text-green-700 mb-2">
                After Purchase
              </p>
              <div className="space-y-1.5">
                <p className="text-xs text-green-800 flex items-start gap-2">
                  <span className="w-4 h-4 bg-green-600 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                  Your square goes live instantly
                </p>
                <p className="text-xs text-green-800 flex items-start gap-2">
                  <span className="w-4 h-4 bg-green-600 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                  Confirmation sent to your email
                </p>
                <p className="text-xs text-green-800 flex items-start gap-2">
                  <span className="w-4 h-4 bg-green-600 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                  Your backlink is active forever
                </p>
              </div>
            </div>

            {/* Value Comparison */}
            <div className="text-center pt-2">
              <p className="text-xs text-surface-400">
                Typical outreach cost: <span className="line-through">$50-500/link</span>
              </p>
              <p className="text-sm font-bold text-surface-950">
                Your cost: <span className="text-brand-red">{formatPrice(price)}</span> forever
              </p>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  )
}
