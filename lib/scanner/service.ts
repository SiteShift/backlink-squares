import robotsParser from 'robots-parser'
import { safeFetch, scanURL, AGENT } from './fetch'
import { parsePage } from './parse'
import type { ScanPage } from './types'

const policies = new Map<string, { expires: number; text: string }>()
const cache = new Map<string, { expires: number; page: ScanPage }>()
const limits = new Map<string, { until: number; count: number }>()
let active = 0
export function rateAllowed(key: string, now = Date.now()) {
  if (limits.size > 2000) for (const [k, v] of limits) if (v.until < now) limits.delete(k)
  if (limits.size > 2000 && !limits.has(key)) return false
  let value = limits.get(key)
  if (!value || value.until < now) { value = { until: now + 60_000, count: 0 }; limits.set(key, value) }
  return ++value.count <= 90
}
async function policy(url: URL, signal?: AbortSignal) {
  const cached = policies.get(url.origin)
  if (cached && cached.expires > Date.now()) return cached.text
  const raw = await safeFetch(`${url.origin}/robots.txt`, signal)
  if (raw.status === 429 || raw.status >= 500 || raw.status === 401 || raw.status === 403) throw new Error(`Robots policy unavailable (HTTP ${raw.status}). We did not crawl this site.`)
  const text = raw.status === 200 ? raw.body : ''
  if (policies.size >= 300) policies.delete(policies.keys().next().value!)
  policies.set(url.origin, { expires: Date.now() + 600_000, text }); return text
}
async function allowed(url: URL, signal?: AbortSignal) {
  const text = await policy(url, signal)
  const robot = robotsParser(`${url.origin}/robots.txt`, text)
  if (robot.isAllowed(url.href, AGENT) === false) throw new Error('Blocked by this website’s robots.txt. We respect its crawl policy.')
  const delay = robot.getCrawlDelay(AGENT)
  if (delay && delay > 0) throw new Error(`This site requests a ${delay}-second crawl delay. The free interactive scanner skips it.`)
  return robot.getSitemaps().filter(s => { try { return new URL(s).origin === url.origin } catch { return false } }).slice(0, 4)
}
export async function inspect(value: string, signal?: AbortSignal, fresh = false, targets: string[] = []) {
  const url = scanURL(value)
  if (/\/(?:logout|signout|delete|checkout|cart|wp-admin|admin)(?:\/|$)/i.test(url.pathname)) throw new Error('Account and transaction pages are excluded from scans.')
  const cacheKey = `${url.href}|${targets.slice().sort().join(',')}`
  const existing = cache.get(cacheKey)
  if (!fresh && existing && existing.expires > Date.now()) return existing.page
  if (active >= 6) throw new Error('The scanner is busy. Please retry in a moment.')
  active++
  try {
    const sitemaps = await allowed(url, signal)
    const raw = await safeFetch(url.href, signal, async destination => { await allowed(destination, signal) })
    const finalURL = new URL(raw.url)
    const rules = robotsParser(`${finalURL.origin}/robots.txt`, await policy(finalURL, signal))
    const crawlerRules = Object.fromEntries(['Googlebot', 'GPTBot', 'ChatGPT-User', 'ClaudeBot', 'PerplexityBot'].map(agent => [agent, rules.isAllowed(finalURL.href, agent) !== false]))
    const page = { ...parsePage(raw, url.href, targets), sitemaps, crawlerRules }
    if (cache.size >= 150) cache.delete(cache.keys().next().value!)
    cache.set(cacheKey, { expires: Date.now() + 300_000, page }); return page
  } finally { active-- }
}
