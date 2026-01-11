import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface ContentCTAProps {
  variant?: 'default' | 'compact'
}

export function ContentCTA({ variant = 'default' }: ContentCTAProps) {
  if (variant === 'compact') {
    return (
      <div className="bg-bauhaus-cream border-3 border-dark p-6 mt-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold uppercase tracking-wide text-dark">
              Get Your Backlink Today
            </h3>
            <p className="text-sm text-dark/60">
              Skip the outreach. Instant dofollow link from $1.
            </p>
          </div>
          <Link href="/#grid">
            <Button variant="primary" size="sm" className="group whitespace-nowrap">
              <Sparkles className="w-4 h-4 mr-2" />
              Buy a Square
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div
      className="bg-dark border-3 border-dark p-8 lg:p-12 text-center mt-16"
      style={{ boxShadow: '6px 6px 0px 0px #E53935' }}
    >
      <div className="inline-flex items-center justify-center w-14 h-14 bg-bauhaus-yellow border-3 border-dark mb-6">
        <Sparkles className="w-7 h-7 text-dark" />
      </div>

      <h3 className="font-black text-2xl lg:text-3xl uppercase tracking-wide text-white mb-4">
        Get Your Backlink Today
      </h3>

      <p className="text-white/70 mb-8 max-w-md mx-auto">
        Skip the outreach. Skip the waiting. Get a permanent dofollow backlink
        on our grid starting at just $1.
      </p>

      <Link href="/#grid">
        <Button
          variant="secondary"
          size="lg"
          className="group"
        >
          Grab Your Square
          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </Link>
    </div>
  )
}
