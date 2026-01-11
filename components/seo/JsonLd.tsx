interface JsonLdProps {
  data: Record<string, unknown>
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

interface ArticleSchemaProps {
  title: string
  description: string
  url: string
  datePublished: string
  dateModified: string
  author: string
  image?: string
  keywords?: string[]
}

export function ArticleSchema({
  title,
  description,
  url,
  datePublished,
  dateModified,
  author,
  image,
  keywords,
}: ArticleSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    url: url,
    datePublished: datePublished,
    dateModified: dateModified,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'SEO Backlinks Grid',
      url: 'https://seobacklinks.dev',
      logo: {
        '@type': 'ImageObject',
        url: 'https://seobacklinks.dev/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    ...(image && {
      image: {
        '@type': 'ImageObject',
        url: image.startsWith('http') ? image : `https://seobacklinks.dev${image}`,
      },
    }),
    ...(keywords &&
      keywords.length > 0 && {
        keywords: keywords.join(', '),
      }),
  }

  return <JsonLd data={schema} />
}

interface BreadcrumbSchemaProps {
  items: Array<{
    name: string
    url: string
  }>
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return <JsonLd data={schema} />
}

interface FAQSchemaProps {
  questions: Array<{
    question: string
    answer: string
  }>
}

export function FAQSchema({ questions }: FAQSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  }

  return <JsonLd data={schema} />
}

interface HowToSchemaProps {
  name: string
  description: string
  steps: Array<{
    name: string
    text: string
  }>
  totalTime?: string
}

export function HowToSchema({ name, description, steps, totalTime }: HowToSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: name,
    description: description,
    ...(totalTime && { totalTime: totalTime }),
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  }

  return <JsonLd data={schema} />
}

interface DefinedTermSchemaProps {
  term: string
  definition: string
  url: string
}

export function DefinedTermSchema({ term, definition, url }: DefinedTermSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: term,
    description: definition,
    url: url,
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: 'SEO Glossary',
      url: 'https://seobacklinks.dev/glossary',
    },
  }

  return <JsonLd data={schema} />
}

interface OrganizationSchemaProps {
  name?: string
  url?: string
  logo?: string
  sameAs?: string[]
}

export function OrganizationSchema({
  name = 'SEO Backlinks Grid',
  url = 'https://seobacklinks.dev',
  logo = 'https://seobacklinks.dev/logo.png',
  sameAs = [],
}: OrganizationSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: name,
    url: url,
    logo: {
      '@type': 'ImageObject',
      url: logo,
    },
    ...(sameAs.length > 0 && { sameAs: sameAs }),
  }

  return <JsonLd data={schema} />
}
