import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://seobacklinks.dev'),
  title: {
    default: 'SEO Backlinks Grid - Buy Dofollow Backlinks from $1',
    template: '%s | SEO Backlinks Grid',
  },
  description:
    'The backlink grid. Buy a square, get a permanent dofollow backlink. Join 500+ sites building their domain authority. Starting at just $1.',
  keywords: [
    'backlinks',
    'dofollow backlinks',
    'buy backlinks',
    'SEO backlinks',
    'link building',
    'domain authority',
    'backlink grid',
  ],
  authors: [{ name: 'SEO Backlinks Grid' }],
  creator: 'SEO Backlinks Grid',
  publisher: 'SEO Backlinks Grid',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://seobacklinks.dev',
    siteName: 'SEO Backlinks Grid',
    title: 'SEO Backlinks Grid - Buy Dofollow Backlinks from $1',
    description:
      'Own your square. Get your backlink. The visual backlink marketplace starting at $1.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SEO Backlinks Grid - The Visual Backlink Marketplace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SEO Backlinks Grid',
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
              name: 'SEO Backlinks Grid',
              url: 'https://seobacklinks.dev',
              description: 'Buy dofollow backlinks on our visual grid. Permanent links from $1.',
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-white text-slate-900 font-body antialiased">
        {children}
      </body>
    </html>
  )
}
