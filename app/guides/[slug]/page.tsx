import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Clock, BookOpen, ChevronRight } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ContentCTA } from '@/components/content/ContentCTA'

// Proper markdown parser
function parseMarkdown(content: string): string {
  return content
    // Code blocks first (to protect them from other replacements)
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
    // Headers (order matters - h4 before h3 before h2)
    .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    // Bold and italic
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    // Ordered lists (numbered)
    .replace(/^(\d+)\. (.+)$/gm, '<li data-num="$1">$2</li>')
    // Unordered lists
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    // Wrap consecutive <li> in <ul> or <ol>
    .replace(/(<li data-num="\d+">.*<\/li>\n?)+/g, (match) => `<ol>${match.replace(/ data-num="\d+"/g, '')}</ol>`)
    .replace(/(<li>.*<\/li>\n?)+/g, (match) => {
      if (match.includes('<ol>')) return match
      return `<ul>${match}</ul>`
    })
    // Paragraphs (blank lines)
    .replace(/\n\n+/g, '</p><p>')
    // Single line breaks within paragraphs
    .replace(/\n/g, '<br>')
    // Wrap in paragraph tags
    .replace(/^(.+)/, '<p>$1')
    .replace(/(.+)$/, '$1</p>')
    // Clean up empty paragraphs and fix double wrapping
    .replace(/<p><(h[234]|ul|ol|pre|blockquote)/g, '<$1')
    .replace(/<\/(h[234]|ul|ol|pre|blockquote)><\/p>/g, '</$1>')
    .replace(/<p><\/p>/g, '')
    .replace(/<br><\/p>/g, '</p>')
    .replace(/<p><br>/g, '<p>')
}

// Demo guides data
const guides: Record<string, {
  title: string
  description: string
  readingTime: string
  keywords: string[]
  content: string
}> = {
  'what-are-backlinks-complete-guide': {
    title: 'What Are Backlinks? The Complete Guide',
    description:
      'Everything you need to know about backlinks - what they are, why they matter, types of backlinks, and how to build them effectively.',
    readingTime: '25 min read',
    keywords: ['backlinks', 'link building', 'SEO'],
    content: `
## Chapter 1: Understanding Backlinks

### What Exactly Is a Backlink?

A backlink is a hyperlink from one website to another. When Site A links to Site B, Site B has received a backlink from Site A. It's that simple.

But while the concept is straightforward, the impact of backlinks on SEO is profound. They've been a core ranking factor since Google launched, and despite numerous algorithm updates, they remain crucial in 2025.

### The History of Backlinks in SEO

Before Google, search engines relied primarily on on-page factors like keyword density to rank pages. Larry Page and Sergey Brin revolutionized search with PageRank - an algorithm that treated links as votes of confidence.

The more quality links a page had, the more authoritative it appeared. This concept transformed how we think about web ranking and spawned an entire industry around link building.

### Why Backlinks Still Matter

Despite Google's algorithm becoming exponentially more sophisticated, backlinks remain one of the top ranking factors because:

1. **They're hard to manipulate at scale** - Earning genuine links requires real effort
2. **They reflect real-world endorsements** - People link to content they find valuable
3. **They create the web's structure** - Links are how search engines discover and understand the internet

## Chapter 2: Types of Backlinks

### Dofollow Links

These are the standard links that pass SEO value. They tell search engines to follow the link and count it as a ranking signal.

### Nofollow Links

Links with a rel="nofollow" attribute tell search engines not to pass ranking signals. However, Google now treats this as a "hint" rather than a directive.

### Sponsored Links

The rel="sponsored" attribute indicates paid placements. Required by Google's guidelines for advertising links.

### UGC Links

Links from user-generated content (comments, forums) should use rel="ugc" to indicate their nature.

### Editorial Links

The gold standard - links given naturally by other websites because your content is genuinely valuable.

### Self-Created Links

Links you create yourself (directories, comments, forums). Generally less valuable and can be risky if overdone.

## Chapter 3: How Search Engines Evaluate Links

### Relevance

A link from a website in your industry carries more weight than a random, unrelated link. Topic relevance matters enormously.

### Authority

Links from established, trusted websites pass more value. A single link from a major news site can be worth hundreds of links from unknown blogs.

### Context

Where a link appears on a page matters. Editorial links within content are worth more than footer or sidebar links.

### Anchor Text

The clickable text provides context about the linked page. Natural variation in anchor text is healthier than exact-match keyword targeting.

### Link Velocity

How quickly you gain links matters. A natural profile shows steady growth, not sudden spikes (unless you've had something go viral).

## Chapter 4: Building Your First Backlinks

### Content Marketing

Create content so valuable that people naturally want to link to it. This is the foundation of sustainable link building.

Types of link-worthy content:
- Original research and data
- Comprehensive guides (like this one!)
- Useful tools and calculators
- Infographics and visual content
- Industry surveys and reports

### Guest Posting

Write quality articles for other websites in your niche. Focus on providing genuine value, not just getting a link.

### Resource Page Link Building

Many websites curate lists of helpful resources. If your content is genuinely useful, you can reach out to be included.

### Broken Link Building

Find broken links on relevant websites, then offer your content as a replacement. You're helping them fix an issue while earning a link.

### Digital PR

Create newsworthy content or stories that journalists want to cover. This earns high-authority editorial links.

## Chapter 5: Advanced Link Building Tactics

### The Skyscraper Technique

1. Find popular content in your niche
2. Create something significantly better
3. Reach out to people linking to the original
4. Offer your improved version as an alternative

### HARO (Help a Reporter Out)

Respond to journalist queries to earn mentions and links in news articles. The key is being genuinely helpful and responsive.

### Unlinked Brand Mentions

Use tools to find mentions of your brand that don't include a link. Reach out and ask for the link to be added.

### Competitor Backlink Analysis

Study where your competitors get their links. Many of those opportunities are available to you too.

### Link Reclamation

Find links you've lost (due to page moves, site changes, etc.) and work to restore them.

## Key Takeaways

1. Backlinks remain essential for SEO success
2. Quality matters far more than quantity
3. Focus on earning editorial links through great content
4. Diversify your link building strategies
5. Monitor and maintain your backlink profile
6. Be patient - link building is a long-term investment

Building a strong backlink profile takes time and effort, but the rewards are substantial and long-lasting.
    `,
  },
  'link-building-strategies-guide': {
    title: 'Link Building Strategies: The Definitive Guide',
    description:
      'Master every link building technique - from guest posting to broken link building, HARO, and more.',
    readingTime: '30 min read',
    keywords: ['link building', 'strategies', 'SEO tactics'],
    content: `
## Introduction to Strategic Link Building

Link building is both an art and a science. While the concept is simple - get other websites to link to yours - executing it effectively requires strategy, creativity, and persistence.

This guide covers every major link building strategy, organized from beginner-friendly to advanced tactics.

## Content-Based Link Building

### Creating Linkable Assets

Not all content attracts links equally. The most link-worthy content types are:

**Original Research**: Data-driven content that others cite when making arguments.

**Ultimate Guides**: Comprehensive resources that become reference material in your industry.

**Tools and Calculators**: Interactive resources that solve specific problems.

**Infographics**: Visual content that presents complex information simply.

**Industry Reports**: Annual surveys or analysis that tracks trends.

### The Skyscraper Technique

Developed by Brian Dean of Backlinko:

1. Find content with lots of backlinks
2. Create something 10x better
3. Reach out to people linking to the original
4. Pitch your improved version

The key is genuinely improving on what exists - more depth, better design, updated information, better UX.

## Outreach-Based Strategies

### Guest Posting

Writing articles for other websites remains effective when done right:

- Target relevant, quality sites
- Pitch unique, valuable topics
- Write genuinely helpful content
- Don't over-optimize anchor text

### Broken Link Building

A win-win strategy:

1. Find resource pages in your niche
2. Identify broken outbound links
3. Create content that could replace what's broken
4. Reach out offering your content as a fix

### Link Reclamation

Recover links you've lost:

- 404 errors on your old URLs
- Lost links from site redesigns
- Brand mentions without links
- Stolen images without attribution

### Digital PR

Creating news-worthy stories that earn press coverage:

- Data-driven studies journalists can cite
- Expert commentary on trending topics
- Newsjacking relevant events
- Creating unique angles on popular stories

## Technical Link Building

### Internal Linking

Don't neglect your own site:

- Link from high-authority pages to important pages
- Use descriptive anchor text
- Create logical site architecture
- Fix orphan pages

### Redirect Strategies

Proper technical handling:

- 301 redirects for permanent moves
- Redirect chains and their impact
- Acquiring expired domains with links

## Measuring Link Building Success

### Key Metrics

- Number of referring domains
- Domain Authority/Rating growth
- Organic traffic increases
- Ranking improvements for target keywords
- Referral traffic from links

### Tools for Tracking

- Ahrefs for backlink analysis
- Google Search Console for link data
- SEMrush for competitive analysis
- Majestic for historical data

## Conclusion

Effective link building requires:

1. Quality content worth linking to
2. Strategic outreach to the right people
3. Patience and persistence
4. Continuous measurement and refinement

Start with the basics, master them, then expand to advanced tactics. Consistency beats intensity in link building.
    `,
  },
  'domain-authority-guide': {
    title: 'Domain Authority Explained: How to Improve Your DA',
    description:
      'A comprehensive guide to understanding and improving your Domain Authority score.',
    readingTime: '20 min read',
    keywords: ['domain authority', 'DA', 'Moz', 'metrics'],
    content: `
## What Is Domain Authority?

Domain Authority (DA) is a search engine ranking score developed by Moz. It predicts how likely a website is to rank in search engine result pages (SERPs).

DA scores range from 1 to 100, with higher scores indicating greater ranking potential. It's calculated by evaluating multiple factors including linking root domains and the total number of links.

## Understanding the DA Scale

### Score Ranges

**1-10**: New websites with minimal backlink profiles
**11-20**: Growing sites starting to build authority
**21-40**: Established sites with solid link profiles
**41-60**: Well-established sites with strong authority
**61-80**: Very authoritative sites in their niches
**81-100**: The most authoritative sites on the web (Wikipedia, Google, etc.)

### Important Notes

1. DA is logarithmic - going from 20 to 30 is easier than 70 to 80
2. It's a comparative metric, not an absolute measure
3. DA changes as Moz updates their index and algorithm

## DA vs DR vs Other Metrics

### Domain Rating (Ahrefs)

Similar concept but calculated differently. Focuses specifically on the strength of a website's backlink profile.

### Trust Flow (Majestic)

Measures quality of links based on how closely your site is linked to trustworthy "seed" sites.

### Authority Score (SEMrush)

Combines organic traffic data, backlinks, and other factors into a single score.

### Which Metric to Use?

All are useful as relative indicators. Most SEOs track multiple metrics rather than relying on any single one.

## Factors That Affect Domain Authority

### Link Profile

**Most Important Factor**

- Number of linking root domains
- Quality of linking domains
- Relevance of linking sites
- Link diversity

### Content Quality

While not directly measured, quality content earns links which boost DA.

### Technical SEO

Site structure, crawlability, and technical health affect how well search engines can evaluate and rank your site.

### Age and History

Older domains with clean histories tend to have higher DA, but new sites can catch up with strong link building.

## Strategies to Improve Domain Authority

### 1. Build High-Quality Backlinks

Focus on earning links from authoritative, relevant websites. One link from a DA 70 site is worth more than dozens from DA 10 sites.

### 2. Create Link-Worthy Content

Original research, comprehensive guides, and unique tools attract natural links.

### 3. Remove Toxic Links

Use Google's Disavow tool if you have spammy links that could hurt your profile.

### 4. Improve Internal Linking

Help PageRank flow through your site with strategic internal linking.

### 5. Be Patient

DA grows slowly. Focus on consistent, quality link building rather than quick wins.

### 6. Remove Bad Outbound Links

Linking to spammy sites can hurt your site's perceived quality.

## Common DA Myths

### Myth 1: DA Directly Affects Rankings

DA is Moz's prediction, not a Google ranking factor. Google doesn't use DA.

### Myth 2: Higher DA Always Means Better Rankings

A relevant DA 30 page can outrank an irrelevant DA 60 page. Context matters.

### Myth 3: DA Can Be Quickly Increased

Legitimate DA growth takes time. Quick increases usually indicate manipulation.

### Myth 4: All High-DA Links Are Valuable

A relevant link from a DA 30 site in your niche often beats an irrelevant DA 70 link.

## Measuring Progress

### Set Realistic Goals

- New sites: Focus on reaching DA 20-30 in year one
- Established sites: Aim for steady incremental growth
- All sites: Focus on quality over DA chasing

### Track Related Metrics

- Organic traffic growth
- Ranking improvements
- Referring domain count
- Brand mention increases

## Conclusion

Domain Authority is a useful metric for understanding your site's relative strength, but it shouldn't be your only focus. Build genuine authority through quality content and ethical link building, and the metrics will follow.
    `,
  },
}

type Props = {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guide = guides[params.slug]

  if (!guide) {
    return { title: 'Guide Not Found' }
  }

  return {
    title: `${guide.title} | SEO Backlinks Grid`,
    description: guide.description,
    keywords: guide.keywords,
  }
}

export function generateStaticParams() {
  return Object.keys(guides).map((slug) => ({ slug }))
}

export default function GuidePage({ params }: Props) {
  const guide = guides[params.slug]

  if (!guide) {
    notFound()
  }

  // Extract chapters from content for table of contents
  const chapters = guide.content.match(/^## (.+)$/gm)?.map(h => h.replace('## ', '')) || []

  return (
    <>
      <Header />

      <main className="min-h-screen bg-bauhaus-cream">
        {/* Header */}
        <header className="py-16 lg:py-24 bg-white border-b-3 border-dark">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm mb-8">
              <Link href="/" className="text-dark/50 hover:text-dark transition-colors">
                Home
              </Link>
              <ChevronRight className="w-4 h-4 text-dark/30" />
              <Link href="/guides" className="text-dark/50 hover:text-dark transition-colors">
                Guides
              </Link>
              <ChevronRight className="w-4 h-4 text-dark/30" />
              <span className="text-dark font-medium">Guide</span>
            </nav>

            {/* Meta badges */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {guide.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="px-3 py-1 bg-bauhaus-blue text-white text-xs font-bold uppercase tracking-wider border-2 border-dark"
                >
                  {keyword}
                </span>
              ))}
              <span className="flex items-center gap-1.5 text-sm text-dark/50 ml-2">
                <Clock className="w-4 h-4" />
                {guide.readingTime}
              </span>
            </div>

            <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-dark leading-tight mb-6">
              {guide.title}
            </h1>

            <p className="text-xl text-dark/60 leading-relaxed max-w-3xl">
              {guide.description}
            </p>
          </div>
        </header>

        {/* Content Layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid lg:grid-cols-[280px_1fr] gap-12">
            {/* Sidebar - Table of Contents */}
            <aside className="hidden lg:block">
              <div className="sticky top-8">
                <div className="bg-white border-3 border-dark p-6" style={{ boxShadow: '4px 4px 0px 0px #0A0A0A' }}>
                  <h3 className="font-display font-bold text-sm uppercase tracking-wider text-dark mb-4 pb-3 border-b-2 border-dark">
                    In This Guide
                  </h3>
                  <nav className="space-y-1">
                    {chapters.map((chapter, i) => (
                      <a
                        key={i}
                        href={`#chapter-${i + 1}`}
                        className="flex items-start gap-3 py-2 text-sm text-dark/60 hover:text-bauhaus-red transition-colors group"
                      >
                        <span className="flex-shrink-0 w-6 h-6 bg-bauhaus-cream border-2 border-dark flex items-center justify-center text-xs font-bold text-dark group-hover:bg-bauhaus-red group-hover:text-white group-hover:border-bauhaus-red transition-colors">
                          {i + 1}
                        </span>
                        <span className="leading-snug">{chapter}</span>
                      </a>
                    ))}
                  </nav>
                </div>

                {/* Quick CTA */}
                <div className="mt-6 bg-bauhaus-yellow border-3 border-dark p-6" style={{ boxShadow: '4px 4px 0px 0px #0A0A0A' }}>
                  <p className="font-bold text-dark text-sm mb-3">Ready to get started?</p>
                  <Link
                    href="/#grid"
                    className="inline-flex items-center gap-2 text-sm font-bold text-dark hover:text-bauhaus-red transition-colors"
                  >
                    Buy a square from $1
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </Link>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <article className="bg-white border-3 border-dark p-8 lg:p-12" style={{ boxShadow: '6px 6px 0px 0px #0A0A0A' }}>
              <div
                className="article-content"
                dangerouslySetInnerHTML={{
                  __html: parseMarkdown(guide.content.trim())
                }}
              />

              <ContentCTA />
            </article>
          </div>
        </div>

        {/* Related Guides */}
        <section className="py-16 bg-dark">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display font-black text-2xl text-white mb-8 text-center">
              Continue Learning
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {Object.entries(guides)
                .filter(([slug]) => slug !== params.slug)
                .slice(0, 2)
                .map(([slug, g]) => (
                  <Link
                    key={slug}
                    href={`/guides/${slug}`}
                    className="group bg-white border-3 border-dark p-6 hover:-translate-y-1 transition-all"
                    style={{ boxShadow: '4px 4px 0px 0px #FDD835' }}
                  >
                    <div className="flex items-center gap-2 text-xs text-dark/50 mb-2">
                      <BookOpen className="w-3.5 h-3.5" />
                      {g.readingTime}
                    </div>
                    <h3 className="font-display font-bold text-lg text-dark group-hover:text-bauhaus-red transition-colors leading-snug">
                      {g.title}
                    </h3>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
