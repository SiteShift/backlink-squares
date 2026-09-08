import { matchesHost } from './url'
import { load } from 'cheerio'
import type { RawPage } from './fetch'
import type { ScanPage } from './types'

const clean = (s: string) => s.replace(/\s+/g, ' ').trim()
export function parsePage(raw: RawPage, requested: string, targets: string[] = []): ScanPage {
  const type = String(raw.headers['content-type'] || '')
  const xml = /xml/i.test(type) && !/xhtml/i.test(type)
  const $ = load(raw.body, { xmlMode: xml })
  const resolve = (value?: string, base = raw.url) => { try { if (!value) return ''; const u = new URL(value, base); if (!['http:', 'https:'].includes(u.protocol) || u.username || u.password) return ''; u.hash = ''; return u.href } catch { return '' } }
  const base = resolve($('base[href]').first().attr('href')) || raw.url
  const links = $('a[href]').toArray().map(el => ({ url: resolve($(el).attr('href'), base), anchor: clean($(el).text() || $(el).find('img').attr('alt') || '').slice(0, 200), rel: ($(el).attr('rel') || '').toLowerCase(), body: $(el).parents('nav,header,footer,aside').length === 0 })).filter(a => a.url && (!targets.length || targets.some(t => matchesHost(a.url, t))))
  const h1 = $('h1').toArray().map(el => clean($(el).text())).slice(0, 10)
  const schema = $('script[type="application/ld+json"]').length
  $('script,style,noscript,template,svg,nav,header,footer,aside').remove()
  const main = $('main').length ? $('main').first() : $('body')
  const text = clean(main.text())
  const content = main.find('article').length ? main.find('article').first() : main
  const passages = content.find('p,li').toArray().map(el => clean($(el).text())).filter(t => t.length >= 30 && t.length <= 1500)
  return { requested, url: raw.url, status: raw.status, redirects: raw.redirects, type,
    title: clean($('title').first().text()).slice(0, 250), description: $('meta[name="description" i]').attr('content') || '',
    h1,
    canonicals: $('link[rel~="canonical" i]').toArray().map(el => resolve($(el).attr('href'), base)).filter(Boolean),
    robots: [...$('meta[name="robots" i],meta[name="googlebot" i]').toArray().map(el => $(el).attr('content') || ''), ...[raw.headers['x-robots-tag'] || ''].flat()],
    links: links.slice(0, 250), passages: [...new Set(passages)].slice(0, 120), words: text ? text.split(/\s+/).length : 0, schema,
    sitemap: xml ? $('url > loc, sitemap > loc').toArray().map(el => resolve($(el).text())).filter(Boolean).slice(0, 200) : [],
    sitemaps: [], linksTruncated: links.length > 250, checked: new Date().toISOString(), truncated: links.length > 250 || passages.length > 120 || (xml && $('loc').length > 200),
  }
}
