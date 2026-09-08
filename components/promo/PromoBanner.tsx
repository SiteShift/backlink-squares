import Link from 'next/link'
export function PromoBanner() {
  return <div className="fixed top-0 inset-x-0 z-[60] h-12 sm:h-[52px] bg-brand-red text-white flex items-center justify-center px-3 gap-3 text-xs sm:text-sm">
    <p className="font-bold leading-tight"><span className="block sm:inline"><span aria-hidden="true">🔥 </span>Limited time<span className="hidden sm:inline"> · </span></span><span className="hidden sm:inline">Complete </span>Backlink Database Bundle<span className="hidden lg:inline"> · 276 opportunities</span> · £11.49</p>
    <Link href="/bundle" data-conversion="bundle_banner" className="shrink-0 bg-white text-brand-red px-3 py-2 font-bold">Get bundle →</Link>
  </div>
}
