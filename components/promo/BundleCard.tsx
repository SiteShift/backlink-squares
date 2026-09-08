import { ContentCTA } from '@/components/content/ContentCTA'

export function BundleCard({ variant = 'default' }: { variant?: 'default' | 'compact' | 'sidebar' }) {
  return <div className={variant === 'default' ? 'container-wide py-8' : ''}><ContentCTA variant={variant === 'default' ? 'default' : 'compact'} /></div>
}
