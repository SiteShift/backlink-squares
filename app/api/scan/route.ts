import { inspect, rateAllowed } from '@/lib/scanner/service'
import { host } from '@/lib/scanner/url'
import { scanURL } from '@/lib/scanner/fetch'
import { discover, hnItem } from '@/lib/scanner/discover'
export const runtime = 'nodejs'
export const maxDuration = 30
let running = 0
const headers = { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' }
export async function POST(request: Request) {
  let sameOrigin = false
  try { const origin = new URL(request.headers.get('origin') || ''); sameOrigin = ['http:', 'https:'].includes(origin.protocol) && origin.host === request.headers.get('host') } catch { /* Missing or malformed Origin is not a browser tool request. */ }
  if (!sameOrigin || request.headers.get('x-backlinkgrid-scan') !== '1') return Response.json({ error: 'Start scans from the BacklinkGrid tools page.' }, { status: 403, headers })
  if (!request.headers.get('content-type')?.startsWith('application/json')) return Response.json({ error: 'JSON input required.' }, { status: 415, headers })
  const ip = request.headers.get('x-vercel-forwarded-for') || request.headers.get('x-forwarded-for')?.split(',')[0] || 'local'
  if (!rateAllowed(ip)) return Response.json({ error: 'You reached the scan limit. Wait one minute and try again.' }, { status: 429, headers: { ...headers, 'Retry-After': '60' } })
  if (running >= 6) return Response.json({ error: 'The scanner is busy. Please retry in a moment.' }, { status: 503, headers })
  running++
  try {
    // Bound the request stream too; Content-Length alone is not trustworthy.
    const reader = request.body?.getReader(); if (!reader) throw new Error('Missing input.')
    let input = '', bytes = 0; const decoder = new TextDecoder()
    while (true) { const { done, value } = await reader.read(); if (done) break; bytes += value.byteLength; if (bytes > 4096) { await reader.cancel(); throw new Error('Input is too large.') } input += decoder.decode(value, { stream: true }) }
    input += decoder.decode()
    const body = JSON.parse(input)
    if (typeof body.url !== 'string' || body.url.length > 2048) throw new Error('Enter a public website URL.')
    if (body.mode === 'discover') return Response.json(await discover(body.url, request.signal), { headers })
    if (body.mode === 'hn-item') return Response.json(await hnItem(body.url, request.signal), { headers })
    if (body.mode && body.mode !== 'inspect') throw new Error('Unknown scan mode.')
    if (body.targets !== undefined && (!Array.isArray(body.targets) || body.targets.length > 3 || body.targets.some((t: unknown) => typeof t !== 'string' || t.length > 2048))) throw new Error('Enter at most three target domains.')
    const targets = (body.targets || []).map((t: string) => host(scanURL(t).href))
    return Response.json(await inspect(body.url, request.signal, body.fresh === true, targets), { headers })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to inspect this website.'
    // Do not expose DNS addresses, socket details or internal stack traces.
    const safe = /^(Enter |Use |Private |This |The |More |Blocked |Robots |Account |Input |Missing |Unknown )/.test(message) ? message : 'The website could not be reached. Check its URL or try again later.'
    return Response.json({ error: safe }, { status: 422, headers })
  } finally { running-- }
}
