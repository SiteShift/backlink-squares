const BASE_URL = 'https://backlinkgrid.com'

function absoluteUrl(pathname: string) {
  if (!pathname || pathname === '/') {
    return BASE_URL
  }

  return pathname.startsWith('http')
    ? pathname
    : `${BASE_URL}${pathname.startsWith('/') ? pathname : `/${pathname}`}`
}

function resolveSchemaImage(image?: string) {
  if (!image) {
    return absoluteUrl('/og-image.png')
  }

  return image.startsWith('http') ? image : absoluteUrl(image)
}

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
      name: 'BacklinkGrid',
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl('/logo.png'),
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    ...({
      image: {
        '@type': 'ImageObject',
        url: resolveSchemaImage(image),
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
      url: absoluteUrl('/glossary'),
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
  name = 'BacklinkGrid',
  url = BASE_URL,
  logo = absoluteUrl('/logo.png'),
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

interface ProductSchemaProps {
  name: string
  description: string
  url: string
  image?: string
  brand?: string
  category?: string
  price: number
  currency?: string
  availability?: string
}

export function ProductSchema({
  name,
  description,
  url,
  image = absoluteUrl('/og-image.png'),
  brand = 'BacklinkGrid',
  category = 'SEO Product',
  price,
  currency = 'USD',
  availability = 'https://schema.org/InStock',
}: ProductSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    url,
    image,
    category,
    brand: {
      '@type': 'Brand',
      name: brand,
    },
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency: currency,
      availability,
      url,
    },
  }

  return <JsonLd data={schema} />
}

interface SoftwareApplicationSchemaProps {
  name: string
  description: string
  url: string
  applicationCategory?: string
  operatingSystem?: string
  image?: string
  featureList?: string[]
  price?: number
  currency?: string
}

export function SoftwareApplicationSchema({
  name,
  description,
  url,
  applicationCategory = 'BusinessApplication',
  operatingSystem = 'Web',
  image = absoluteUrl('/og-image.png'),
  featureList = [],
  price = 0,
  currency = 'USD',
}: SoftwareApplicationSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description,
    url,
    image,
    applicationCategory,
    operatingSystem,
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency: currency,
    },
    ...(featureList.length > 0 ? { featureList } : {}),
  }

  return <JsonLd data={schema} />
}
