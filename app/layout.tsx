import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { PromoBanner, PromoProvider } from '@/components/promo'
import { SITE_NAME } from '@/lib/seo'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://backlinkgrid.com'),
  title: {
    default: 'BacklinkGrid - Buy Dofollow Backlinks from $1',
    template: `%s | ${SITE_NAME}`,
  },
  description:
    'The backlink grid. Buy a square, get a permanent dofollow backlink. Join growing sites building their authority starting at just $1.',
  keywords: [
    'backlinks',
    'dofollow backlinks',
    'buy backlinks',
    'SEO backlinks',
    'link building',
    'domain authority',
    'backlink grid',
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://backlinkgrid.com',
    siteName: SITE_NAME,
    title: 'BacklinkGrid - Buy Dofollow Backlinks from $1',
    description:
      'Own your square. Get your backlink. The visual backlink marketplace starting at $1.',
    images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: 'BacklinkGrid - The Visual Backlink Marketplace',
        },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: 'Own your square. Get your backlink. From $1.',
    images: ['/og-image.png'],
    creator: '@seobacklinks',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: SITE_NAME,
              url: 'https://backlinkgrid.com',
              description: 'Buy dofollow backlinks on our visual grid. Permanent links from $1.',
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-white text-slate-900 font-body antialiased">
        <PromoProvider>
          <PromoBanner />
          {children}
        </PromoProvider>
        <Analytics />
      </body>
    </html>
  )
}
