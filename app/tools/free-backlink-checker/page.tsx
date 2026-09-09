'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ContentCTA } from '@/components/content/ContentCTA'
import { BreadcrumbSchema } from '@/components/seo/JsonLd'

const providers = [
  { name: 'Ahrefs', detail: 'Explore a backlink sample and Domain Rating. Check the current free access and export limits.', url: (domain: string) => `https://ahrefs.com/backlink-checker?input=${encodeURIComponent(domain)}&mode=subdomains` },
  { name: 'Moz Link Explorer', detail: 'Research linking domains and Moz metrics. Account requirements and report limits apply.', url: (domain: string) => `https://moz.com/link-explorer?site=${encodeURIComponent(domain)}&target=domain` },
  { name: 'Semrush', detail: 'Open the backlink overview for your domain. Available detail depends on the provider’s current access rules.', url: (domain: string) => `https://www.semrush.com/analytics/backlinks/overview/?q=${encodeURIComponent(domain)}` },
  { name: 'Majestic', detail: 'Explore the domain in Site Explorer. Check which reports are available to your account before relying on an export.', url: (domain: string) => `https://majestic.com/reports/site-explorer?q=${encodeURIComponent(domain)}` },
]

export default function FreeBacklinkCheckerPage() {
  const [domain, setDomain] = useState('')
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  function submit(event: FormEvent) {
    event.preventDefault()
    try {
      const url = new URL(/^https?:\/\//i.test(domain.trim()) ? domain.trim() : `https://${domain.trim()}`)
      if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || !/^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i.test(url.hostname)) throw new Error('domain')
      setResult(url.hostname.toLowerCase())
      setError('')
    } catch { setError('Enter a public domain, such as example.com.'); setResult('') }
  }
  return <><Header /><BreadcrumbSchema items={[{ name: 'Home', url: 'https://backlinkgrid.com' }, { name: 'Tools', url: 'https://backlinkgrid.com/tools' }, { name: 'Backlink checker launcher', url: 'https://backlinkgrid.com/tools/free-backlink-checker' }]} />
    <main className="pt-14 sm:pt-16 lg:pt-20 min-h-screen bg-surface-50"><div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <Link href="/tools" className="text-sm underline underline-offset-4">← All free tools</Link>
      <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mt-7">Free Backlink Checker & Research Tool Finder</h1>
      <p className="text-lg text-surface-600 max-w-3xl mt-5 leading-relaxed">Enter a domain to open it in established backlink research tools. This free launcher prepares the links; each provider controls its own data, account requirements and pricing.</p>
      <form onSubmit={submit} className="mt-8 p-5 sm:p-8 bg-white border border-surface-300">
        <label htmlFor="checker-domain" className="font-semibold block mb-3">Website domain</label><div className="flex flex-col sm:flex-row gap-3"><input id="checker-domain" value={domain} onChange={e => setDomain(e.target.value)} required autoComplete="url" spellCheck={false} placeholder="example.com" aria-invalid={Boolean(error)} aria-describedby={error ? 'checker-error' : undefined} className="min-w-0 flex-1 border border-surface-400 px-4 py-3 rounded-none" /><button type="submit" className="bg-brand-red text-white px-6 py-3 font-semibold">Show research links →</button></div>
        {error && <p id="checker-error" role="alert" className="text-brand-red mt-3">{error}</p>}<p className="text-sm text-surface-600 mt-4">Your input stays in this browser until you open a provider link. No account is needed for this launcher.</p>
      </form>
      <div aria-live="polite">{result && <section className="mt-8" aria-labelledby="research-results"><h2 id="research-results" className="text-2xl font-bold break-words">Research {result}</h2><div className="grid sm:grid-cols-2 gap-5 mt-5">{providers.map(provider => <div key={provider.name} className="bg-white border border-surface-200 p-6"><h3 className="font-bold text-xl">{provider.name}</h3><p className="text-surface-600 text-sm leading-relaxed my-4">{provider.detail}</p><a className="font-semibold underline underline-offset-4" href={provider.url(result)} target="_blank" rel="noopener noreferrer">Open {provider.name} ↗</a></div>)}</div></section>}</div>
      <section className="mt-12"><h2 className="text-2xl font-bold">Choose the check you actually need</h2><div className="mt-5 space-y-6"><div><h3 className="font-semibold text-lg">A link from a known page</h3><p className="mt-2 text-surface-600">Use our <Link className="underline" href="/tools/live-backlink-checker">live backlink checker</Link> to inspect the source, anchor and attributes. It checks the page directly and can save check history on this device.</p></div><div><h3 className="font-semibold text-lg">Links reported for your own website</h3><p className="mt-2 text-surface-600">Start with the <a className="underline" href="https://search.google.com/search-console">Google Search Console Links report</a> for your verified property. Its data is a sample, not a complete backlink inventory. The <Link className="underline" href="/tools/gsc-links-analyzer">GSC export analyser</Link> helps organise a supported export locally.</p></div><div><h3 className="font-semibold text-lg">Competitor research</h3><p className="mt-2 text-surface-600">Explore a provider sample, keeping the domain scope and collection date consistent. Our <Link className="underline" href="/tools/competitor-backlink-finder">competitor source finder</Link> also checks a limited set of public sources; it does not replace a comprehensive backlink index.</p></div></div></section>
      <section className="mt-10"><h2 className="text-2xl font-bold">Interpret the evidence carefully</h2><p className="text-surface-600 leading-relaxed mt-4">Different crawlers can discover different pages at different times. A missing row is not proof that a placement disappeared, and DA or DR is not a Google ranking score. Inspect the source page before deciding what to fix.</p><p className="mt-4">Read the <Link href="/blog/best-free-backlink-checkers" className="underline">free backlink checker comparison</Link>, <Link href="/blog/backlinks-not-showing-google-search-console" className="underline">missing Search Console links guide</Link>, and <Link href="/blog/verify-backlink-placement" className="underline">placement verification checklist</Link>.</p></section>
      <ContentCTA />
    </div></main><Footer /></>
}
