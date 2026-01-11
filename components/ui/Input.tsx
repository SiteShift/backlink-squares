'use client'

import { forwardRef } from 'react'
import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-bold uppercase tracking-wider text-surface-950"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            'w-full px-4 py-3 text-base bg-white border-2 text-surface-950',
            'placeholder:text-surface-400',
            'focus:outline-none transition-all duration-150',
            error
              ? 'border-brand-red focus:shadow-[0_0_0_3px_rgba(220,38,38,0.15)]'
              : 'border-surface-300 focus:border-surface-950 focus:shadow-[0_0_0_3px_rgba(9,9,11,0.08)]',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-sm text-brand-red font-medium flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4" />
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="text-sm text-surface-500">{hint}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }
