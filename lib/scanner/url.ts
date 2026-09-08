export function normalizeURL(value: string) { const u = new URL(value); u.hash = ''; return u.href.replace(/\/$/, '') }
export function host(value: string) { return new URL(value.includes('://') ? value : `https://${value}`).hostname.replace(/^www\./, '').toLowerCase() }
export function matchesHost(value: string, target: string) { try { const a = host(value), b = host(target); return a === b || a.endsWith(`.${b}`) } catch { return false } }
