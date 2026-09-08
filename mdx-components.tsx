import type { MDXComponents } from 'mdx/types'
import Link from 'next/link'

// Generate URL-friendly slug from text
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

// Extract text content from React children
function getTextContent(children: React.ReactNode): string {
  if (typeof children === 'string') return children
  if (typeof children === 'number') return String(children)
  if (Array.isArray(children)) return children.map(getTextContent).join('')
  if (children && typeof children === 'object' && 'props' in children) {
    return getTextContent((children as React.ReactElement<{ children?: React.ReactNode }>).props.children)
  }
  return ''
}

export function getMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Custom heading with anchor links and auto-generated IDs
    h2: ({ children, id, ...props }) => {
      const textContent = getTextContent(children)
      const headingId = id || slugify(textContent)
      return (
        <h2
          id={headingId}
          className="font-bold text-2xl text-dark mt-12 mb-6 scroll-mt-24 group"
          {...props}
        >
          {children}
        </h2>
      )
    },
    h3: ({ children, id, ...props }) => {
      const textContent = getTextContent(children)
      const headingId = id || slugify(textContent)
      return (
        <h3
          id={headingId}
          className="font-bold text-xl text-dark mt-8 mb-4 scroll-mt-24 group"
          {...props}
        >
          {children}
        </h3>
      )
    },
    // Custom link component
    a: ({ href, children, ...props }) => {
      const isInternal = href?.startsWith('/') || href?.startsWith('#')
      if (isInternal) {
        return (
          <Link
            href={href || '#'}
            className="text-bauhaus-red font-bold hover:underline"
            {...props}
          >
            {children}
          </Link>
        )
      }
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-bauhaus-red font-bold hover:underline"
          {...props}
        >
          {children}
        </a>
      )
    },
    // Custom code block
    pre: ({ children, ...props }) => (
      <pre
        className="bg-dark text-white border-3 border-dark p-4 overflow-x-auto my-6"
        {...props}
      >
        {children}
      </pre>
    ),
    code: ({ children, ...props }) => (
      <code
        className="bg-bauhaus-cream text-bauhaus-blue px-1.5 py-0.5 border-2 border-dark text-sm font-mono"
        {...props}
      >
        {children}
      </code>
    ),
    // Custom blockquote
    blockquote: ({ children, ...props }) => (
      <blockquote
        className="border-l-4 border-bauhaus-red pl-4 text-dark/70 my-6"
        {...props}
      >
        {children}
      </blockquote>
    ),
    // Custom table with overflow handling
    table: ({ children, ...props }) => (
      <div role="region" aria-label="Scrollable data table" tabIndex={0} className="overflow-x-auto my-6 max-w-full">
        <table
          className="w-full min-w-[560px] border-collapse border-2 border-dark text-sm"
          {...props}
        >
          {children}
        </table>
      </div>
    ),
    th: ({ children, ...props }) => (
      <th
        className="min-w-[140px] bg-bauhaus-cream border-2 border-dark px-4 py-2 text-left align-top font-bold text-dark"
        {...props}
      >
        {children}
      </th>
    ),
    td: ({ children, ...props }) => (
      <td
        className="min-w-[140px] border-2 border-dark px-4 py-2 align-top text-dark/80"
        {...props}
      >
        {children}
      </td>
    ),
    ...components,
  }
}

// Next MDX provider convention; the resolver itself does not use React hooks.
export const useMDXComponents = getMDXComponents
