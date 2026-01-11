'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function Modal({
  isOpen,
  onClose,
  children,
  title,
  size = 'md',
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            ref={overlayRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-surface-950/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={cn(
              'relative w-full bg-white border-2 border-surface-950',
              'max-h-[90vh] overflow-hidden flex flex-col',
              sizes[size]
            )}
            style={{ boxShadow: '8px 8px 0 0 #09090B' }}
          >
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-6 py-4 border-b-2 border-surface-200 bg-surface-50">
                <h2 className="text-lg font-display font-black uppercase tracking-wide text-surface-950">
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  className="w-10 h-10 border-2 border-surface-300 bg-white flex items-center justify-center
                           hover:border-surface-950 hover:bg-brand-yellow transition-all duration-150"
                >
                  <X className="w-5 h-5 text-surface-600" strokeWidth={2.5} />
                </button>
              </div>
            )}

            {/* Close button (if no title) */}
            {!title && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 border-2 border-surface-300 bg-white
                         flex items-center justify-center z-10
                         hover:border-surface-950 hover:bg-brand-yellow transition-all duration-150"
              >
                <X className="w-5 h-5 text-surface-600" strokeWidth={2.5} />
              </button>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
