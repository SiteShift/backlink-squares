import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

// Only explicit .md paths expose public editorial files. Never read arbitrary paths.
export async function GET(request: NextRequest) {
  const pathname = request.nextUrl.pathname.replace(/^\/markdown(?=\/)/, '')
  const match = pathname.match(/^\/([a-z0-9-]+)(?:\/([a-z0-9-]+))?\.md$/)
  const recovery = '# Page not found\n\nTry the [sitemap](https://backlinkgrid.com/sitemap-page) or [reading guide](https://backlinkgrid.com/llms.txt).\n'
  if (!match) return new NextResponse(recovery, { status: 404, headers: { 'Content-Type': 'text/markdown; charset=utf-8', 'X-Robots-Tag': 'noindex' } })
  const [, category, slug] = match
  const file = path.join(process.cwd(), 'content', category, `${slug || '_index'}.mdx`)
  if (!fs.existsSync(file)) return new NextResponse(recovery, { status: 404, headers: { 'Content-Type': 'text/markdown; charset=utf-8', 'X-Robots-Tag': 'noindex' } })
  const { data, content } = matter(fs.readFileSync(file, 'utf8'))
  const canonical = `https://backlinkgrid.com/${category}${slug ? `/${slug}` : ''}`
  const body = `# ${data.title || data.term || category}\n\n${data.description || data.definition || ''}\n\nCanonical: ${canonical}\n\n${content}\n`
  return new NextResponse(body, { headers: { 'Content-Type': 'text/markdown; charset=utf-8', 'Link': `<${canonical}>; rel="canonical"`, 'X-Robots-Tag': 'noindex', 'Cache-Control': 'public, max-age=3600' } })
}
