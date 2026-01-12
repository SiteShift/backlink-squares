'use client'

import { useEffect, useState, useCallback } from 'react'
import { ChevronDown, ChevronUp, List } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TOCItem {
  id: string
  text: string
  level: number
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<TOCItem[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    // Small delay to ensure content is rendered
    const timer = setTimeout(() => {
      const article = document.querySelector('article')
      if (!article) return

      const elements = article.querySelectorAll('h2, h3')
      const items: TOCItem[] = Array.from(elements)
        .filter((el) => el.id) // Only include elements with IDs
        .map((el) => ({
          id: el.id,
          text: el.textContent?.replace('#', '').trim() || '',
          level: el.tagName === 'H2' ? 2 : 3,
        }))

      setHeadings(items)

      // Set up intersection observer
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveId(entry.target.id)
            }
          })
        },
        { rootMargin: '-80px 0px -70% 0px', threshold: 0.1 }
      )

      elements.forEach((el) => {
        if (el.id) observer.observe(el)
      })

      return () => observer.disconnect()
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveId(id)
      // Update URL without scroll
      window.history.pushState(null, '', `#${id}`)
    }
  }, [])

  if (headings.length === 0) return null

  // Only show H2s, count nested H3s
  const h2Headings = headings.filter((h) => h.level === 2)
  const totalItems = headings.length

  return (
    <nav className="bg-white border-3 border-dark">
      {/* Header */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex items-center justify-between p-4 hover:bg-bauhaus-cream/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <List className="w-4 h-4 text-bauhaus-red" />
          <span className="font-bold text-xs uppercase tracking-wider text-dark">
            On This Page
          </span>
          <span className="text-xs text-dark/40">({totalItems})</span>
        </div>
        {isCollapsed ? (
          <ChevronDown className="w-4 h-4 text-dark/50" />
        ) : (
          <ChevronUp className="w-4 h-4 text-dark/50" />
        )}
      </button>

      {/* Links */}
      {!isCollapsed && (
        <div className="max-h-[60vh] overflow-y-auto border-t-2 border-dark/10">
          <ul className="py-2">
            {headings.map((heading, index) => {
              const isActive = activeId === heading.id
              const isH3 = heading.level === 3

              return (
                <li key={heading.id}>
                  <a
                    href={`#${heading.id}`}
                    onClick={(e) => handleClick(e, heading.id)}
                    className={cn(
                      'block py-1.5 text-xs leading-snug transition-all duration-150',
                      isH3 ? 'pl-6 pr-3' : 'pl-3 pr-3',
                      isActive
                        ? 'text-bauhaus-red font-bold bg-bauhaus-red/5 border-l-3 border-bauhaus-red -ml-[3px]'
                        : 'text-dark/60 hover:text-dark hover:bg-bauhaus-cream/30 border-l-3 border-transparent -ml-[3px]'
                    )}
                  >
                    <span className={cn(
                      'line-clamp-2',
                      isH3 && 'text-[11px]'
                    )}>
                      {heading.text}
                    </span>
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </nav>
  )
}
