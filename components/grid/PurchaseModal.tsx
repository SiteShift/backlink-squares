'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion } from 'framer-motion'
import {
  Upload,
  Link as LinkIcon,
  Globe,
  Mail,
  Check,
  AlertCircle,
  Image as ImageIcon,
  X,
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
    <Modal isOpen={isModalOpen} onClose={handleClose} title="Complete Your Purchase" size="lg">
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Selection Summary */}
        <div className="flex items-center justify-between p-5 bg-surface-50 border-2 border-surface-200">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-brand-red border-2 border-surface-950 flex items-center justify-center">
              <span className="text-2xl font-black text-white">{count}</span>
            </div>
            <div>
              <p className="font-black text-lg uppercase tracking-wide text-surface-950">
                {count === 1 ? '1 Square' : `${count} Squares`}
                {count > 1 && (
                  <span className="text-surface-500 font-medium ml-2">
                    ({width}x{height})
                  </span>
                )}
              </p>
              <p className="text-sm text-surface-500">
                Permanent dofollow backlink
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-black text-brand-red">
              {formatPrice(price)}
            </p>
            <p className="text-xs text-surface-400 uppercase tracking-wider">One-time</p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <Input
            id="siteUrl"
            label="Website URL"
            placeholder="https://yoursite.com"
            value={formData.siteUrl}
            onChange={(e) =>
              setFormData({ ...formData, siteUrl: e.target.value })
            }
            error={errors.siteUrl}
            autoComplete="url"
          />

          <Input
            id="siteName"
            label="Site Name"
            placeholder="Your Site Name"
            value={formData.siteName}
            onChange={(e) =>
              setFormData({ ...formData, siteName: e.target.value })
            }
            error={errors.siteName}
            hint="Appears when users hover over your square"
          />

          <Input
            id="email"
            type="email"
            label="Email Address"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            error={errors.email}
            hint="We'll send your receipt here"
            autoComplete="email"
          />

          {/* Logo Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-bold uppercase tracking-wider text-surface-950">
              Logo (Optional)
            </label>
            <div
              {...getRootProps()}
              className={`
                relative flex flex-col items-center justify-center p-6
                border-2 cursor-pointer transition-all duration-150
                ${isDragActive
                  ? 'border-brand-blue bg-brand-blue/5'
                  : 'border-surface-300 hover:border-surface-950'
                }
              `}
            >
              <input {...getInputProps()} />

              {logoPreview ? (
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 bg-white border-2 border-surface-200 overflow-hidden">
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="w-full h-full object-contain p-1"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-surface-950">
                      {logoFile?.name}
                    </p>
                    <p className="text-xs text-surface-500">
                      Click or drag to replace
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 bg-brand-yellow border-2 border-surface-950 flex items-center justify-center mb-3">
                    {isDragActive ? (
                      <Upload className="w-6 h-6 text-surface-950" strokeWidth={2.5} />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-surface-950" strokeWidth={2} />
                    )}
                  </div>
                  <p className="text-sm text-surface-700 text-center">
                    <span className="font-bold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-surface-400 mt-1">
                    PNG or JPG, min 64x64px, max 5MB
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Terms Agreement */}
        <label className="flex items-start gap-3 cursor-pointer group">
          <div className="relative flex items-center">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="sr-only peer"
            />
            <div
              className={`
                w-6 h-6 border-2 transition-all flex items-center justify-center
                ${agreedToTerms
                  ? 'bg-brand-blue border-surface-950'
                  : 'border-surface-300 group-hover:border-brand-blue'
                }
                ${errors.terms ? 'border-brand-red' : ''}
              `}
            >
              {agreedToTerms && (
                <Check className="w-4 h-4 text-white" strokeWidth={3} />
              )}
            </div>
          </div>
          <span className="text-sm text-surface-600">
            I agree to the{' '}
            <a href="/terms" target="_blank" className="text-brand-red font-bold hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" target="_blank" className="text-brand-red font-bold hover:underline">
              Privacy Policy
            </a>
          </span>
        </label>
        {errors.terms && (
          <p className="text-sm text-brand-red font-medium flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.terms}
          </p>
        )}

        {/* Submit Error */}
        {errors.submit && (
          <div className="p-4 bg-brand-red/10 border-2 border-brand-red">
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
          className="w-full"
        >
          Purchase Backlink (Do Follow) - {formatPrice(price)}
        </Button>

        {/* Trust Indicators */}
        <div className="flex items-center justify-center gap-6 text-xs text-surface-400 uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-brand-blue border border-surface-200" />
            Secure
          </span>
          <span className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-brand-yellow border border-surface-200" />
            Instant
          </span>
          <span className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-brand-red border border-surface-200" />
            Dofollow
          </span>
        </div>
      </form>
    </Modal>
  )
}
