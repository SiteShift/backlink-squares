import { lookup } from 'node:dns/promises'
import http from 'node:http'
import https from 'node:https'
import ipaddr from 'ipaddr.js'

export const AGENT = 'BacklinkGridBot/1.0 (+https://backlinkgrid.com/tools; hello@backlinkgrid.com)'
const MAX_BYTES = 1_000_000
export function isPublicAddress(address: string) {
  try { return ipaddr.process(address).range() === 'unicast' } catch { return false }
}
export function scanURL(value: string) {
  let url: URL
  try { url = new URL(value.includes('://') ? value : `https://${value}`) } catch { throw new Error('Enter a valid public website URL.') }
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.port || value.length > 2048) throw new Error('Use a public HTTP or HTTPS URL, without credentials or a custom port.')
  const hostname = url.hostname.replace(/^\[|\]$/g, '')
  if (ipaddr.isValid(hostname) ? !isPublicAddress(hostname) : !hostname.includes('.') || /\.(localhost|local|internal|test|invalid|onion)$/.test(hostname)) throw new Error('Private networks and local addresses cannot be scanned.')
  url.hash = ''; return url
}
export type RawPage = { url: string; status: number; headers: http.IncomingHttpHeaders; body: string; redirects: { url: string; status: number }[] }
export async function safeFetch(value: string, signal?: AbortSignal, beforeRedirect?: (url: URL) => Promise<void>): Promise<RawPage> {
  let url = scanURL(value)
  const redirects: RawPage['redirects'] = []
  const deadline = Date.now() + 9000
  for (let hop = 0; hop <= 4; hop++) {
    if (signal?.aborted || Date.now() > deadline) throw new Error('The request timed out or was cancelled.')
    // Resolve once, reject mixed public/private answers, then pin the socket to that address.
    // A second DNS lookup by the HTTP client would permit DNS rebinding.
    const addresses = await Promise.race([lookup(url.hostname.replace(/^\[|\]$/g, ''), { all: true }), new Promise<never>((_, reject) => { const timer = setTimeout(() => reject(new Error('DNS lookup timed out.')), 2000); timer.unref() })])
    if (!addresses.length || addresses.some(a => !isPublicAddress(a.address))) throw new Error('This hostname resolves to a restricted network.')
    const chosen = addresses.find(a => a.family === 4) || addresses[0]
    const result = await new Promise<Omit<RawPage, 'redirects'>>((resolve, reject) => {
      const request = (url.protocol === 'https:' ? https : http).request(url, {
        method: 'GET', agent: false, family: chosen.family, signal, headers: { 'User-Agent': AGENT, Accept: 'text/html,application/xhtml+xml,application/xml,text/xml,application/json,text/plain;q=0.8', 'Accept-Encoding': 'identity' },
        lookup: (_hostname, _options, callback) => callback(null, chosen.address, chosen.family),
      }, response => {
        const status = response.statusCode || 0
        if ([301, 302, 303, 307, 308].includes(status)) { response.resume(); resolve({ url: url.href, status, headers: response.headers, body: '' }); return }
        const type = response.headers['content-type'] || ''
        if (!/text\/|json|xml/i.test(type)) { response.destroy(); resolve({ url: url.href, status, headers: response.headers, body: '' }); return }
        if (response.headers['content-encoding'] && response.headers['content-encoding'] !== 'identity') { response.destroy(); reject(new Error('The server ignored uncompressed content negotiation. This response cannot be inspected.')); return }
        let bytes = 0; const chunks: Buffer[] = []
        response.on('data', (chunk: Buffer) => { bytes += chunk.length; if (bytes > MAX_BYTES) { response.destroy(new Error('The page exceeds the 1 MB scan limit.')); return } chunks.push(chunk) })
        response.on('error', reject)
        response.on('end', () => resolve({ url: url.href, status, headers: response.headers, body: Buffer.concat(chunks).toString('utf8') }))
      })
      const timer = setTimeout(() => request.destroy(new Error('The website took too long to respond.')), Math.max(1, deadline - Date.now()))
      request.on('close', () => clearTimeout(timer)); request.on('error', reject); request.end()
    })
    if (![301, 302, 303, 307, 308].includes(result.status)) return { ...result, redirects }
    if (!result.headers.location) throw new Error('The server returned a redirect without a destination.')
    redirects.push({ url: url.href, status: result.status })
    url = scanURL(new URL(result.headers.location, url).href)
    if (beforeRedirect) await beforeRedirect(url)
  }
  throw new Error('More than four redirects. Check the redirect chain.')
}
