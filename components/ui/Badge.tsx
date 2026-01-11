import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'red' | 'blue' | 'yellow' | 'success'
  size?: 'sm' | 'md'
  className?: string
}

export function Badge({
  children,
  variant = 'default',
  size = 'sm',
  className,
}: BadgeProps) {
  const variants = {
    default: 'bg-white text-dark',
    red: 'bg-bauhaus-red text-white',
    blue: 'bg-bauhaus-blue text-white',
    yellow: 'bg-bauhaus-yellow text-dark',
    success: 'bg-green-500 text-white',
  }

  const sizes = {
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center font-bold uppercase tracking-wider border-2 border-dark',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  )
}
