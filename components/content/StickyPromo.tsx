'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'

export function StickyPromo() {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  useEffect(() => {
    const update = () => {
      const footer = document.querySelector('footer')
      const end = footer ? footer.getBoundingClientRect().top < innerHeight + 100 : false
      const inlineOffer = document.querySelector('[data-inline-bundle-offer]')?.getBoundingClientRect()
      const showingInlineOffer = inlineOffer && inlineOffer.top < innerHeight && inlineOffer.bottom > 140
      setVisible(scrollY > 650 && !end && !showingInlineOffer && !document.querySelector('[role="dialog"]'))
    }
    update()
    addEventListener('scroll', update, { passive: true })
    addEventListener('resize', update)
    return () => { removeEventListener('scroll', update); removeEventListener('resize', update) }
  }, [])
  if (!visible || dismissed) return null
  return <aside aria-label="Bundle offer" className="lg:hidden fixed bottom-3 left-3 right-3 z-40 rounded-xl bg-surface-950 text-white shadow-xl p-4 pb-[max(1rem,env(safe-area-inset-bottom))] animate-[fadeIn_.2s_ease-out]">
    <button onClick={() => setDismissed(true)} aria-label="Dismiss bundle offer" className="absolute right-1 top-1 p-2 text-white/70"><X className="w-4 h-4" /></button>
    <p className="font-bold pr-7">276 backlink opportunities. One CSV.</p>
    <div className="flex items-center justify-between gap-2 mt-3">
      <Link href="/bundle" data-conversion="bundle_mobile" className="rounded-md bg-brand-yellow text-surface-950 px-3 py-2 text-sm font-bold">Get bundle · £11.49 →</Link>
      <Link href="/#grid" data-conversion="grid_mobile" className="text-xs text-white/80 underline">Or a $1 square</Link>
    </div>
  </aside>
}
