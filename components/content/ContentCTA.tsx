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
              Buy the Backlink, Then Scale It
            </h3>
            <p className="text-sm text-dark/60">
              Claim a square now or grab the backlink bundle for your next campaign.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/#grid">
              <Button variant="primary" size="sm" className="group whitespace-nowrap">
                <Sparkles className="w-4 h-4 mr-2" />
                Buy a Square
              </Button>
            </Link>
            <Link href="/bundle">
              <Button variant="secondary" size="sm" className="whitespace-nowrap">
                View Bundle
              </Button>
            </Link>
          </div>
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
        Turn This Research Into Links
      </h3>

      <p className="text-white/70 mb-8 max-w-2xl mx-auto">
        Claim a permanent dofollow backlink on the grid, or speed up your campaign with the verified backlink bundle.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link href="/#grid">
          <Button
            variant="secondary"
            size="lg"
            className="group"
          >
            Claim Your Square
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
        <Link href="/bundle">
          <Button variant="primary" size="lg">
            Get the Bundle
          </Button>
        </Link>
      </div>
    </div>
  )
}
