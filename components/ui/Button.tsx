'use client'

import { forwardRef } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'red' | 'yellow' | 'blue'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = cn(
      'inline-flex items-center justify-center font-bold uppercase tracking-wider transition-all duration-150',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2',
      'disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none',
      'border-2 border-surface-950'
    )

    const variants = {
      primary: cn(
        'text-white bg-surface-950',
        'hover:bg-brand-yellow hover:text-surface-950',
        'active:translate-x-0.5 active:translate-y-0.5'
      ),
      secondary: cn(
        'text-surface-950 bg-white',
        'hover:bg-surface-100',
        'active:translate-x-0.5 active:translate-y-0.5'
      ),
      red: cn(
        'text-white bg-brand-red',
        'hover:bg-brand-yellow hover:text-surface-950',
        'active:translate-x-0.5 active:translate-y-0.5'
      ),
      yellow: cn(
        'text-surface-950 bg-brand-yellow',
        'hover:bg-surface-950 hover:text-white',
        'active:translate-x-0.5 active:translate-y-0.5'
      ),
      blue: cn(
        'text-white bg-brand-blue',
        'hover:bg-brand-yellow hover:text-surface-950',
        'active:translate-x-0.5 active:translate-y-0.5'
      ),
      ghost: cn(
        'text-surface-950 bg-transparent border-transparent',
        'hover:bg-surface-100 hover:border-surface-200'
      ),
      outline: cn(
        'text-surface-950 bg-transparent',
        'hover:bg-brand-yellow',
        'active:translate-x-0.5 active:translate-y-0.5'
      ),
    }

    const sizes = {
      sm: 'px-4 py-2 text-xs gap-1.5',
      md: 'px-6 py-3 text-sm gap-2',
      lg: 'px-8 py-4 text-base gap-2.5',
    }

    const getShadow = () => {
      if (variant === 'ghost') return 'none'
      return '4px 4px 0px 0px #09090B'
    }

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        style={{
          boxShadow: getShadow(),
        }}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading...</span>
          </>
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
