import type { MDXComponents } from 'mdx/types'
import Link from 'next/link'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Custom heading with anchor links
    h2: ({ children, ...props }) => (
      <h2
        className="font-bold text-2xl uppercase tracking-wide text-dark mt-12 mb-6 scroll-mt-24"
        {...props}
      >
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3
        className="font-bold text-xl uppercase tracking-wide text-dark mt-8 mb-4"
        {...props}
      >
        {children}
      </h3>
    ),
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
    ...components,
  }
}
