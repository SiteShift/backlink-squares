'use client'
import { useEffect, useRef, useState } from 'react'
import { ArrowRight, BadgeCheck, Check, LockKeyhole, Plus, Clock3, Target, Compass, TrendingUp } from 'lucide-react'
import { track } from '@vercel/analytics'
import { BUNDLE_PRICE_GBP, bundleFaqs } from './bundleData'
import './bundle.css'

function GrowthVisual() {
  const root = useRef<HTMLDivElement>(null)
  const route = useRef<SVGPathElement>(null)
  const number = useRef<HTMLSpanElement>(null)
  const dot = useRef<SVGCircleElement>(null)
  useEffect(() => {
    const element = root.current, path = route.current
    if (!element || !path) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const length = path.getTotalLength()
    // Cache geometry once; animation frames perform no layout reads or React renders.
    const points = Array.from({ length: 301 }, (_, i) => path.getPointAtLength(length * i / 300))
    const stops = [[0, 0], [.12, .07], [.29, .17], [.43, .38], [.59, .45], [.74, .73], [.9, .86], [1, 1]]
    let frame = 0, elapsed = 0, previous = 0, visible = false, lastNumber = -1
    function paint(progress: number, opacity = 1) {
      element!.style.setProperty('--growth-progress', String(progress))
      element!.style.setProperty('--growth-opacity', String(opacity))
      const from = progress < .45 ? [239, 112, 106] : [229, 184, 96]
      const to = progress < .45 ? [229, 184, 96] : [102, 219, 157]
      const mix = progress < .45 ? progress / .45 : (progress - .45) / .55
      element!.style.setProperty('--growth-color', `rgb(${from.map((v, i) => Math.round(v + (to[i] - v) * mix)).join(',')})`)
      const value = Math.round(12 + progress * 56)
      if (number.current && value !== lastNumber) { number.current.textContent = String(value); lastNumber = value }
      const index = progress * 300, left = Math.floor(index), right = Math.min(300, left + 1), blend = index - left
      dot.current?.setAttribute('cx', String(points[left].x + (points[right].x - points[left].x) * blend))
      dot.current?.setAttribute('cy', String(points[left].y + (points[right].y - points[left].y) * blend))
    }
    function tick(now: number) {
      if (!visible || document.hidden || reduced.matches) { frame = 0; previous = 0; return }
      if (previous) elapsed += Math.min(now - previous, 64)
      previous = now
      const cycle = elapsed % 11800, time = Math.min(cycle / 8800, 1)
      const segment = stops.findIndex((stop, i) => i < stops.length - 1 && time <= stops[i + 1][0])
      const i = Math.max(segment, 0), [t0, p0] = stops[i], [t1, p1] = stops[i + 1]
      const t = Math.min(1, Math.max(0, (time - t0) / (t1 - t0)))
      const progress = time === 1 ? 1 : p0 + (p1 - p0) * (t * t * (3 - 2 * t))
      const opacity = cycle > 11100 ? 1 - (cycle - 11100) / 700 : cycle < 450 ? cycle / 450 : 1
      paint(progress, opacity)
      frame = requestAnimationFrame(tick)
    }
    function resume() {
      cancelAnimationFrame(frame); frame = 0; previous = 0
      if (reduced.matches) paint(1)
      else if (visible && !document.hidden) frame = requestAnimationFrame(tick)
    }
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; resume() }, { threshold: .15 })
    observer.observe(element)
    reduced.addEventListener('change', resume)
    document.addEventListener('visibilitychange', resume)
    return () => { cancelAnimationFrame(frame); observer.disconnect(); reduced.removeEventListener('change', resume); document.removeEventListener('visibilitychange', resume) }
  }, [])
  return <div ref={root} className="growth-visual growth-compact" aria-label="Illustrative domain rating and traffic animation, not measured or predicted results">
    <div className="growth-dashboard-header"><div><h2>Organic traffic</h2></div>
      <div className="growth-mini-rating"><div className="growth-mini-ring"><svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="43" className="growth-mini-track"/><circle cx="50" cy="50" r="43" pathLength="100" className="growth-mini-progress"/></svg><span ref={number} aria-hidden="true">12</span></div><span>Domain Rating</span></div>
    </div>
    <div className="growth-main-chart"><svg viewBox="0 0 440 230" aria-hidden="true"><defs><linearGradient id="growth-area-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="currentColor" stopOpacity=".2"/><stop offset="100%" stopColor="currentColor" stopOpacity="0"/></linearGradient><clipPath id="growth-reveal"><rect className="growth-reveal-rect" width="440" height="230"/></clipPath></defs>
      <path className="growth-grid-lines" d="M4 35H436M4 90H436M4 145H436M4 200H436"/>
      <g className="growth-drawing"><path className="growth-fill" clipPath="url(#growth-reveal)" d="M4 205 C24 201 34 211 54 198 S80 205 101 181 S130 175 149 178 S179 139 202 150 S230 123 250 132 S275 100 291 104 S315 71 330 78 S350 42 368 50 S401 29 436 12 V230H4Z"/>
      <path ref={route} className="growth-traffic-path" pathLength="100" d="M4 205 C24 201 34 211 54 198 S80 205 101 181 S130 175 149 178 S179 139 202 150 S230 123 250 132 S275 100 291 104 S315 71 330 78 S350 42 368 50 S401 29 436 12"/>
      <circle ref={dot} className="growth-leading-dot" cx="4" cy="205" r="4"/></g>
    </svg></div>
  </div>
}

export function BundleLanding() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sticky, setSticky] = useState(false)
  const hero = useRef<HTMLElement>(null)
  const final = useRef<HTMLElement>(null)
  useEffect(() => {
    let pastHero = false, finalVisible = false
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.target === hero.current) pastHero = !entry.isIntersecting && entry.boundingClientRect.top < 0
        if (entry.target === final.current) finalVisible = entry.isIntersecting
      })
      setSticky(pastHero && !finalVisible)
    })
    if (hero.current) observer.observe(hero.current)
    if (final.current) observer.observe(final.current)
    return () => observer.disconnect()
  }, [])
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
      setError('Checkout couldn’t open. Please try again or contact hello@backlinkgrid.com. You have not been charged by this step.')
      setLoading(false)
      track('bundle_checkout_error')
    }
  }
  const buy = (label = 'Unlock the Backlinks', price = false) => <button type="button" disabled={loading} onClick={purchase} className="bundle-buy">{loading ? 'Opening checkout…' : <span>{label}{price&&<span className="button-price"> · £{BUNDLE_PRICE_GBP}</span>}</span>}<ArrowRight size={17} aria-hidden="true" /></button>
  return <div className="bundle-page">
    <section ref={hero} className="bundle-hero"><div className="bundle-wrap bundle-hero-layout"><div className="bundle-intro">
      <span className="bundle-trust-pill"><BadgeCheck size={18} aria-hidden="true" /><span>Verified Backlinks</span></span>
      <h1>Complete Backlink<br className="bundle-desktop-break" /> Database Bundle</h1>
      <p className="bundle-lead">Backlinks are hard.<br /><strong>We made this so they are not.</strong></p>
      <p className="bundle-support">Stop hunting for places to submit your website. We’ve sourced 276 opportunities so you can spend less time searching—and more time building links.</p>
      <div className="bundle-hero-action">{buy('Unlock the Backlinks', true)}</div>
      <p className="bundle-reassurance"><LockKeyhole size={12} aria-hidden="true" /> One payment · Instant download after checkout</p>

      <noscript><p>Enable JavaScript to open checkout, or contact hello@backlinkgrid.com for help.</p></noscript>
    </div><GrowthVisual /></div></section>
    <section className="bundle-benefits" aria-label="Why use the bundle"><div className="bundle-wrap">{[
      {Icon:TrendingUp,title:'Build your domain authority'},
      {Icon:Target,title:'Attract relevant traffic'},
      {Icon:Clock3,title:'Save time on link building'},
      {Icon:Compass,title:'Improve SEO'},
    ].map(({Icon,title})=><div className="bundle-benefit" key={title}><Icon size={21} strokeWidth={1.4} aria-hidden="true" /><h2>{title}</h2></div>)}</div></section>

    <section id="preview" className="bundle-wrap bundle-faq-section"><div><h2>Frequently<br className="bundle-desktop-break" /> asked questions</h2></div><div>{bundleFaqs.map(f=><details className="bundle-faq" key={f.question}><summary>{f.question}<Plus size={17} aria-hidden="true" /></summary><p>{f.answer}</p></details>)}</div></section>
    <section ref={final} id="get-bundle" className="bundle-final"><div className="bundle-wrap bundle-final-layout"><div><p className="bundle-kicker">START BUILDING BACKLINKS</p><h2>Stop searching.<br /><span>Start building links.</span></h2><p>Get 276 sourced opportunities in one download.<br />Choose your shortlist and make your next move.</p></div><div className="bundle-final-purchase"><span className="bundle-final-label">Complete Backlink Database Bundle</span><div className="bundle-final-price">£{BUNDLE_PRICE_GBP}<span>Pay once. No subscription.</span></div>{buy()}<p><Check size={13} aria-hidden="true" /> 276 opportunities. Download after payment.</p></div></div><p className="bundle-wrap bundle-fine-print">A downloadable database, not a placement service. Publisher fees are separate. Placements, traffic and rankings are not guaranteed.</p></section>
    <section id="verification" className="bundle-verification bundle-wrap"><BadgeCheck size={18} aria-hidden="true" /><p><strong>What “Verified Backlinks” means here:</strong> sourced opportunities to investigate, not links already placed for you. Recorded details can change; check current eligibility and fees before submitting.</p></section>
    {error&&<div className="bundle-error" role="alert"><p>{error}</p><button type="button" onClick={()=>setError('')}>Dismiss</button></div>}
    {sticky&&<div className="bundle-mobile-buy"><div><strong>Complete Backlink Database</strong><span>£{BUNDLE_PRICE_GBP} · One-time payment</span></div>{buy('Unlock now')}</div>}
  </div>
}
