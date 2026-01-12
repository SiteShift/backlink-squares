import { Metadata } from 'next'
import Link from 'next/link'
import { Home, Search } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'

// Prevent 404 pages from being indexed (soft-404 prevention)
export const metadata: Metadata = {
  title: 'Page Not Found',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export default function NotFound() {
  return (
    <>
      <Header />

      <main className="min-h-[70vh] flex items-center justify-center bg-bauhaus-cream">
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          {/* 404 Number - Bauhaus Style */}
          <div className="relative mb-8">
            <span className="text-[150px] font-black text-dark/10 leading-none">
              404
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="grid grid-cols-3 gap-1">
                {[...Array(9)].map((_, i) => {
                  const colors = ['bg-bauhaus-red', 'bg-bauhaus-yellow', 'bg-bauhaus-blue']
                  return (
                    <div
                      key={i}
                      className={`w-8 h-8 border-3 border-dark ${
                        i % 2 === 0
                          ? colors[i % 3]
                          : 'bg-white border-dashed'
                      }`}
                    />
                  )
                })}
              </div>
            </div>
          </div>

          {/* Message */}
          <h1 className="font-black text-3xl uppercase tracking-wide text-dark mb-4">
            Page Not Found
          </h1>
          <p className="text-lg text-dark/60 mb-8">
            Looks like this square is empty. The page you're looking for doesn't
            exist or has been moved.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/">
              <Button variant="primary" className="group">
                <Home className="w-4 h-4 mr-2" />
                Back to Grid
              </Button>
            </Link>
            <Link href="/blog">
              <Button variant="secondary">
                <Search className="w-4 h-4 mr-2" />
                Browse Blog
              </Button>
            </Link>
          </div>

          {/* Helpful Links */}
          <div className="mt-12 pt-8 border-t-3 border-dark">
            <p className="text-sm text-dark/50 uppercase tracking-wider mb-4">
              Helpful Links
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link
                href="/how-it-works"
                className="font-bold text-bauhaus-red hover:underline"
              >
                How It Works
              </Link>
              <Link href="/guides" className="font-bold text-bauhaus-blue hover:underline">
                Guides
              </Link>
              <Link href="/glossary" className="font-bold text-bauhaus-red hover:underline">
                Glossary
              </Link>
              <Link href="/contact" className="font-bold text-bauhaus-blue hover:underline">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
