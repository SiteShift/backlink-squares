'use client'
import { useState } from 'react'
import Link from 'next/link'
import { track } from '@vercel/analytics'
import { BUNDLE_PRICE_GBP, bundleFaqs } from './bundleData'

export function BundleLanding() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  async function purchase() {
    if (loading) return
    setLoading(true); setError('')
    track('bundle_checkout_start')
    try {
      const response = await fetch('/api/bundle-checkout', { method: 'POST' })
      const data = await response.json()
      if (!response.ok || !data.url) throw new Error('Checkout unavailable')
      const destination = new URL(data.url)
      if (destination.protocol !== 'https:' || destination.hostname !== 'checkout.stripe.com') throw new Error('Invalid checkout URL')
      track('bundle_checkout_redirect')
      window.location.assign(destination.href)
    } catch {
      setError('Checkout could not open. Please try again, or contact hello@backlinkgrid.com for help. You have not been charged by this step.')
      setLoading(false)
      track('bundle_checkout_error')
    }
  }
  const buy = <button type="button" disabled={loading} onClick={purchase} className="bg-brand-yellow text-surface-950 font-bold px-6 py-4 disabled:opacity-60 w-full sm:w-auto">{loading ? 'Opening secure checkout…' : `Get the database · £${BUNDLE_PRICE_GBP} →`}</button>
  return <>
    <section className="bg-surface-950 text-white py-12 sm:py-20">
      <div className="container-wide grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <p className="text-brand-yellow font-bold uppercase text-sm tracking-wider">For founders, marketers and SEO teams</p>
          <h1 className="text-white font-display text-4xl sm:text-5xl lg:text-6xl font-black mt-5">Complete Backlink Database Bundle</h1>
          <p className="text-lg text-white/80 mt-6">Start with 276 backlink opportunities. Build a shortlist that fits your business.</p>
          <p className="text-white/70 mt-4">Launch platforms, directories, review sites and more—organized in a CSV you can filter, prioritize and turn into a submission plan.</p>
          <div className="mt-7">{buy}</div>
          <p className="text-sm text-white/70 mt-4">One payment · No subscription · Download after payment</p>
          <a href="#preview" className="inline-block mt-5 underline underline-offset-4">Look inside before you buy ↓</a>
          {error && <p role="alert" className="mt-4 text-white border border-brand-red p-4">{error}</p>}
          <noscript><p className="mt-4">Checkout requires JavaScript. You can still view the sample below and contact hello@backlinkgrid.com for purchase assistance.</p></noscript>
        </div>
        <div className="border-2 border-white/20 bg-white/5 p-6 sm:p-8">
          <p className="font-black text-5xl text-brand-yellow">276</p><p className="text-xl font-bold mt-2">opportunities. One organized file.</p>
          <ul className="space-y-3 mt-6 text-white/80">
            <li>✓ Find the category and audience that fit your site</li>
            <li>✓ Compare recorded DR, link type and submission cost</li>
            <li>✓ Go straight to the recorded submission URL</li>
            <li>✓ Read approval-time guidance and submission tips</li>
            <li>✓ Add your own outreach status and follow-up notes</li>
          </ul>
          <p className="mt-6 text-sm text-white/60">Research data, not a live backlink index. Recheck publishers before submitting. Placement, traffic and rankings are not guaranteed.</p>
        </div>
      </div>
    </section>
    <section id="preview" className="container-wide py-14 scroll-mt-40">
      <h2 className="font-display text-3xl font-black">See what you’re buying</h2>
      <p className="mt-4 max-w-3xl text-surface-600">The sample contains five real rows from the delivered file, with all nine columns. Recorded metrics and policies may have changed; the sample lets you judge the structure and usefulness yourself.</p>
      <div className="overflow-x-auto mt-6 border-2 border-surface-950">
        <table className="w-full text-left text-sm"><caption className="sr-only">Example entries in the backlink database</caption><thead className="bg-surface-100"><tr>{['Site','Category','Best for'].map(x=><th className="p-4" key={x}>{x}</th>)}</tr></thead><tbody>
          <tr className="border-t"><td className="p-4">Product Hunt</td><td className="p-4">Launch Platform</td><td className="p-4">All products</td></tr>
          <tr className="border-t"><td colSpan={3} className="p-4">Download the sample to inspect submission URLs, costs, recorded DR and tips.</td></tr>
        </tbody></table>
      </div>
      <a href="/samples/backlink-database-sample.csv" download data-conversion="bundle_sample" className="inline-flex mt-5 border-2 border-surface-950 px-5 py-3 font-bold">Download the free 5-row sample ↓</a>
      <div className="grid md:grid-cols-3 gap-6 mt-12">{[
        ['1. Filter for fit','Choose categories relevant to your business and audience. Remove opportunities that require a product, location or membership you do not have.'],
        ['2. Verify your shortlist','Visit the publisher. Check its current submission rules, pricing and editorial quality. Treat DR as a comparison aid, not an approval signal.'],
        ['3. Submit and track','Prepare a useful profile or pitch, submit selectively, then record acceptance, published URLs and referral outcomes in your own tracker.'],
      ].map(([title,body])=><div className="border-2 border-surface-200 p-6" key={title}><h3 className="font-bold text-xl">{title}</h3><p className="mt-3 text-surface-600">{body}</p></div>)}</div>
      <p className="mt-7">Need the workflow first? Read our <Link className="underline text-brand-red" href="/resources/backlink-database-guide">backlink database selection guide</Link> or get the <Link className="underline text-brand-red" href="/templates">free prospect tracker</Link>.</p>
    </section>
    <section className="bg-surface-50 py-14"><div className="container-wide max-w-4xl"><h2 className="font-display text-3xl font-black mb-6">Before you buy</h2>{bundleFaqs.map(f=><details className="border-b border-surface-300 py-5" key={f.question}><summary className="font-bold cursor-pointer">{f.question}</summary><p className="mt-3 text-surface-600">{f.answer}</p></details>)}</div></section>
    <section className="container-wide py-14 text-center"><h2 className="font-display text-3xl font-black">Spend less time collecting URLs.</h2><p className="mt-4 mb-6 text-surface-600">Start with the database. Spend your effort choosing worthwhile opportunities.</p>{buy}<p className="mt-4 text-sm">276 entries · 9 columns · £11.49 one-time</p>{error && <p role="alert" className="mt-4 text-brand-red">{error}</p>}</section>
  </>
}
