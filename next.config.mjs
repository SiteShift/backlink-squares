import createMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/industries/startup',
        destination: '/blog/link-building-for-startups',
        permanent: true,
      },
      {
        source: '/backlink-quality/toxic-backlinks-myth',
        destination: '/backlink-audit/toxic-links',
        permanent: true,
      },
      {
        source: '/backlink-quality/authority-metrics-explained',
        destination: '/backlink-quality/authority-metrics',
        permanent: true,
      },
      {
        source: '/backlinks/backlink-profile',
        destination: '/glossary/link-profile',
        permanent: true,
      },
      {
        source: '/link-building-tactics/original-research-link-building',
        destination: '/link-building-tactics/original-research',
        permanent: true,
      },
      {
        source: '/backlink-audit/checklist',
        destination: '/resources/audit-checklist',
        permanent: true,
      },
      {
        source: '/backlink-monitoring/alerts',
        destination: '/glossary/backlink-monitoring',
        permanent: true,
      },
      {
        source: '/link-building-tactics/scholarship-links-why-not',
        destination: '/strategies/scholarship-link-building',
        permanent: true,
      },
      {
        source: '/penalties/manual-actions-links',
        destination: '/glossary/manual-action',
        permanent: true,
      },
      {
        source: '/link-building/agencies',
        destination: '/blog/best-link-building-agencies',
        permanent: true,
      },
      {
        source: '/link-building/anchor-text',
        destination: '/backlinks/anchor-text',
        permanent: true,
      },
      {
        source: '/link-building/content-strategy',
        destination: '/link-building/content-that-earns-links',
        permanent: true,
      },
      {
        source: '/link-building/outreach',
        destination: '/link-building/outreach-strategy',
        permanent: true,
      },
      {
        source: '/templates',
        destination: '/resources',
        permanent: true,
      },
      {
        source: '/link-building/saas',
        destination: '/industries/saas',
        permanent: true,
      },
      {
        source: '/link-building/ecommerce',
        destination: '/industries/ecommerce',
        permanent: true,
      },
      {
        source: '/link-building/local-business',
        destination: '/industries/local-business',
        permanent: true,
      },
      {
        source: '/link-building/b2b',
        destination: '/industries/b2b',
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
        ],
      },
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/robots.txt',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=86400',
          },
        ],
      },
    ]
  },
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug],
  },
})

export default withMDX(nextConfig)
