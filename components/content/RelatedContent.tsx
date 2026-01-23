import Link from 'next/link'
import { ArrowRight, BookOpen, ExternalLink, Lightbulb, Layers } from 'lucide-react'
import { ClusterMeta, HubMeta, GlossaryTermMeta } from '@/lib/content'

interface RelatedContentItem {
  href: string
  title: string
  description?: string
  type?: 'sibling' | 'cross-hub' | 'hub' | 'glossary' | 'cluster'
}

interface RelatedContentProps {
  title?: string
  items: RelatedContentItem[]
  variant?: 'cards' | 'list' | 'compact'
  maxItems?: number
  showType?: boolean
}

export function RelatedContent({
  title = 'Related Content',
  items,
  variant = 'cards',
  maxItems = 6,
  showType = false,
}: RelatedContentProps) {
  if (!items || items.length === 0) return null

  const displayItems = items.slice(0, maxItems)

  const getTypeIcon = (type?: string) => {
    switch (type) {
      case 'sibling':
        return <BookOpen className="w-3.5 h-3.5" />
      case 'cross-hub':
        return <ExternalLink className="w-3.5 h-3.5" />
      case 'hub':
        return <Layers className="w-3.5 h-3.5" />
      case 'glossary':
        return <Lightbulb className="w-3.5 h-3.5" />
      default:
        return <ArrowRight className="w-3.5 h-3.5" />
    }
  }

  const getTypeLabel = (type?: string) => {
    switch (type) {
      case 'sibling':
        return 'Related Topic'
      case 'cross-hub':
        return 'Explore Further'
      case 'hub':
        return 'Complete Guide'
      case 'glossary':
        return 'Definition'
      case 'cluster':
        return 'Deep Dive'
      default:
        return 'Read More'
    }
  }

  if (variant === 'compact') {
    return (
      <div className="bg-bauhaus-cream/50 border-2 border-dark/10 p-4">
        <h3 className="font-bold text-dark text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-bauhaus-blue" />
          {title}
        </h3>
        <ul className="space-y-2">
          {displayItems.map((item, index) => (
            <li key={index}>
              <Link
                href={item.href}
                className="text-sm text-dark/70 hover:text-bauhaus-red transition-colors flex items-center gap-2"
              >
                {getTypeIcon(item.type)}
                <span>{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  if (variant === 'list') {
    return (
      <div className="border-t-2 border-dark/10 pt-6">
        <h3 className="font-display font-black text-lg text-dark mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-bauhaus-blue" />
          {title}
        </h3>
        <ul className="space-y-3">
          {displayItems.map((item, index) => (
            <li key={index}>
              <Link
                href={item.href}
                className="group flex items-start gap-3 p-3 bg-bauhaus-cream/30 hover:bg-bauhaus-cream border-l-3 border-transparent hover:border-bauhaus-red transition-all"
              >
                <span className="mt-0.5 text-bauhaus-red">
                  {getTypeIcon(item.type)}
                </span>
                <div>
                  <span className="font-medium text-dark group-hover:text-bauhaus-red transition-colors block">
                    {item.title}
                  </span>
                  {item.description && (
                    <span className="text-sm text-dark/60 line-clamp-1 mt-0.5 block">
                      {item.description}
                    </span>
                  )}
                  {showType && item.type && (
                    <span className="text-xs text-dark/40 mt-1 block">
                      {getTypeLabel(item.type)}
                    </span>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  // Default: cards variant
  return (
    <div className="mt-8">
      <h3 className="font-display font-black text-xl text-dark mb-6 flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-bauhaus-blue" />
        {title}
      </h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="group block bg-white border-3 border-dark p-5 hover:shadow-bauhaus hover:border-bauhaus-red transition-all"
          >
            {showType && item.type && (
              <span className="inline-flex items-center gap-1 text-xs font-bold uppercase text-dark/50 tracking-wider mb-2">
                {getTypeIcon(item.type)}
                {getTypeLabel(item.type)}
              </span>
            )}
            <h4 className="font-bold text-dark group-hover:text-bauhaus-red mb-2 transition-colors">
              {item.title}
            </h4>
            {item.description && (
              <p className="text-sm text-dark/60 line-clamp-2">
                {item.description}
              </p>
            )}
            <span className="flex items-center gap-1 text-sm text-bauhaus-red font-medium mt-3 group-hover:gap-2 transition-all">
              Read more
              <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}

// What to Read Next section - specifically designed for end of articles
interface WhatToReadNextProps {
  parentHub?: {
    href: string
    title: string
    description?: string
  }
  siblingPages?: RelatedContentItem[]
  crossHubLinks?: RelatedContentItem[]
  relatedTerms?: RelatedContentItem[]
}

export function WhatToReadNext({
  parentHub,
  siblingPages = [],
  crossHubLinks = [],
  relatedTerms = [],
}: WhatToReadNextProps) {
  const hasSiblings = siblingPages.length > 0
  const hasCrossHub = crossHubLinks.length > 0
  const hasRelatedTerms = relatedTerms.length > 0

  if (!parentHub && !hasSiblings && !hasCrossHub && !hasRelatedTerms) {
    return null
  }

  return (
    <div className="mt-12 bg-white border-3 border-dark p-8">
      <h2 className="font-display font-black text-xl text-dark mb-6">
        What to Read Next
      </h2>

      <div className="space-y-6">
        {/* Parent Hub Link */}
        {parentHub && (
          <div>
            <Link
              href={parentHub.href}
              className="group block p-4 bg-bauhaus-blue/10 border-2 border-bauhaus-blue/20 hover:border-bauhaus-blue transition-colors"
            >
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase text-bauhaus-blue tracking-wider mb-1">
                <Layers className="w-3.5 h-3.5" />
                Complete Guide
              </span>
              <span className="block font-bold text-dark group-hover:text-bauhaus-blue mt-1 transition-colors">
                {parentHub.title}
              </span>
              {parentHub.description && (
                <span className="block text-sm text-dark/60 mt-1 line-clamp-2">
                  {parentHub.description}
                </span>
              )}
            </Link>
          </div>
        )}

        {/* Sibling Pages */}
        {hasSiblings && (
          <div>
            <h3 className="text-sm font-bold uppercase text-dark/50 tracking-wider mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Related Topics in This Guide
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {siblingPages.slice(0, 4).map((page, index) => (
                <Link
                  key={index}
                  href={page.href}
                  className="group block p-3 bg-bauhaus-cream/50 border-2 border-dark/10 hover:border-bauhaus-red transition-colors"
                >
                  <span className="font-medium text-dark group-hover:text-bauhaus-red transition-colors text-sm">
                    {page.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Cross-Hub Links */}
        {hasCrossHub && (
          <div>
            <h3 className="text-sm font-bold uppercase text-dark/50 tracking-wider mb-3 flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              Explore Related Guides
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {crossHubLinks.slice(0, 4).map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="group block p-3 bg-bauhaus-yellow/10 border-2 border-bauhaus-yellow/20 hover:border-bauhaus-yellow transition-colors"
                >
                  <span className="font-medium text-dark group-hover:text-bauhaus-red transition-colors text-sm">
                    {link.title}
                  </span>
                  {link.description && (
                    <span className="block text-xs text-dark/50 mt-1 line-clamp-1">
                      {link.description}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Related Glossary Terms */}
        {hasRelatedTerms && (
          <div>
            <h3 className="text-sm font-bold uppercase text-dark/50 tracking-wider mb-3 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Related Definitions
            </h3>
            <div className="flex flex-wrap gap-2">
              {relatedTerms.slice(0, 6).map((term, index) => (
                <Link
                  key={index}
                  href={term.href}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-dark/5 hover:bg-bauhaus-red hover:text-white text-sm text-dark/70 transition-colors"
                >
                  {term.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Sidebar component for related content
interface SidebarRelatedProps {
  title?: string
  items: RelatedContentItem[]
  maxItems?: number
}

export function SidebarRelated({
  title = 'Related Topics',
  items,
  maxItems = 8,
}: SidebarRelatedProps) {
  if (!items || items.length === 0) return null

  return (
    <div className="bg-white border-3 border-dark">
      <div className="p-3 border-b-2 border-dark/10">
        <h3 className="font-bold text-dark uppercase text-xs tracking-wider flex items-center gap-2">
          <BookOpen className="w-3.5 h-3.5 text-bauhaus-yellow" />
          {title}
        </h3>
      </div>
      <nav className="max-h-[30vh] overflow-y-auto py-1">
        {items.slice(0, maxItems).map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="block text-xs text-dark/60 hover:text-dark hover:bg-bauhaus-cream/30 transition-colors py-1.5 px-3"
          >
            {item.title}
          </Link>
        ))}
      </nav>
    </div>
  )
}
