'use client'

import Link from 'next/link'
import { Clock, User, Calendar, ChevronRight, ArrowRight, BookOpen, CheckCircle } from 'lucide-react'
import { HubContent, ClusterMeta } from '@/lib/content'
import { formatDate } from '@/lib/utils'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { TableOfContents } from '@/components/content/TableOfContents'
import { ContentCTA } from '@/components/content/ContentCTA'

interface HubPageProps {
  hub: HubContent
  clusters: ClusterMeta[]
  content: React.ReactNode
}

export function HubPage({ hub, clusters, content }: HubPageProps) {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-bauhaus-cream">
        {/* Breadcrumbs */}
        <nav className="bg-white border-b-3 border-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <ol className="flex items-center gap-2 text-sm">
              <li>
                <Link href="/" className="text-dark/60 hover:text-bauhaus-red transition-colors">
                  Home
                </Link>
              </li>
              <ChevronRight className="w-4 h-4 text-dark/40" />
              <li>
                <span className="text-dark font-medium">{hub.title}</span>
              </li>
            </ol>
          </div>
        </nav>

        {/* Hero */}
        <section className="py-12 lg:py-20 bg-white border-b-3 border-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-bauhaus-red border-3 border-dark mb-6">
                <BookOpen className="w-4 h-4 text-white" />
                <span className="text-sm font-bold uppercase tracking-wider text-white">
                  Complete Guide
                </span>
              </div>

              <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-dark leading-tight mb-6">
                {hub.title}
              </h1>

              <p className="text-xl text-dark/70 mb-8 leading-relaxed">
                {hub.description}
              </p>

              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-dark/60">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{hub.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{hub.readingTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Updated {formatDate(hub.lastUpdated)}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Grid */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Table of Contents - Sidebar */}
              <aside className="lg:col-span-1">
                <div className="sticky top-24">
                  <TableOfContents />

                  {/* Cluster Pages Navigation */}
                  {clusters.length > 0 && (
                    <div className="mt-8 bg-white border-3 border-dark p-5">
                      <h3 className="font-bold text-dark mb-4 uppercase text-sm tracking-wider">
                        In This Guide
                      </h3>
                      <nav className="space-y-2">
                        {clusters.map((cluster) => (
                          <Link
                            key={cluster.slug}
                            href={`/${hub.slug}/${cluster.slug}`}
                            className="block text-sm text-dark/70 hover:text-bauhaus-red transition-colors py-1"
                          >
                            {cluster.title}
                          </Link>
                        ))}
                      </nav>
                    </div>
                  )}
                </div>
              </aside>

              {/* Main Content */}
              <div className="lg:col-span-3">
                <article className="prose prose-lg prose-slate max-w-none bg-white border-3 border-dark p-8 lg:p-12">
                  {content}
                </article>

                {/* Cluster Pages Grid */}
                {clusters.length > 0 && (
                  <div className="mt-12">
                    <h2 className="font-display font-black text-2xl text-dark mb-6">
                      Explore This Topic
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {clusters.map((cluster) => (
                        <Link
                          key={cluster.slug}
                          href={`/${hub.slug}/${cluster.slug}`}
                          className="group block bg-white border-3 border-dark p-6 hover:shadow-bauhaus hover:border-bauhaus-red transition-all"
                        >
                          <h3 className="font-bold text-dark group-hover:text-bauhaus-red mb-2 transition-colors">
                            {cluster.title}
                          </h3>
                          <p className="text-sm text-dark/60 mb-3 line-clamp-2">
                            {cluster.description}
                          </p>
                          <div className="flex items-center justify-between text-xs text-dark/50">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {cluster.readingTime}
                            </span>
                            <span className="flex items-center gap-1 text-bauhaus-red font-medium group-hover:gap-2 transition-all">
                              Read more
                              <ArrowRight className="w-3 h-3" />
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA */}
                <ContentCTA />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
