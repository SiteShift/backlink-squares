import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Calendar, Clock, User, ArrowLeft, Share2 } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ContentCTA } from '@/components/content/ContentCTA'
import { BlogCard } from '@/components/content/BlogCard'
import { formatDate } from '@/lib/utils'

// Simple markdown parser for blog content
function parseMarkdown(content: string): string {
  return content
    // Code blocks first (before other processing)
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
    // Headings
    .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    // Bold and italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Unordered lists
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    // Ordered lists
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    // Paragraphs (lines not already wrapped)
    .split('\n\n')
    .map(block => {
      block = block.trim()
      if (!block) return ''
      if (block.startsWith('<h') || block.startsWith('<pre') || block.startsWith('<ul') || block.startsWith('<ol')) {
        return block
      }
      return `<p>${block}</p>`
    })
    .join('\n')
    // Clean up extra newlines in paragraphs
    .replace(/<p>\n/g, '<p>')
    .replace(/\n<\/p>/g, '</p>')
    // Handle line breaks within paragraphs
    .replace(/([^>])\n([^<])/g, '$1<br/>$2')
}

// Demo blog posts data (in production, this would come from MDX files)
const blogPosts: Record<string, {
  title: string
  description: string
  date: string
  author: string
  keywords: string[]
  readingTime: string
  content: string
}> = {
  'what-are-backlinks': {
    title: 'What Are Backlinks? The Complete Beginner\'s Guide for 2025',
    description:
      'Learn everything about backlinks: what they are, why they matter for SEO, and how to start building quality links to your website.',
    date: '2025-01-10',
    author: 'SEO Backlinks',
    keywords: ['backlinks', 'SEO basics', 'link building'],
    readingTime: '8 min read',
    content: `
## What Is a Backlink?

A backlink (also called an "inbound link" or "incoming link") is simply a link from one website to another. When website A links to website B, website B has received a backlink from website A.

Think of backlinks as votes of confidence. When a reputable website links to your content, they're essentially telling search engines: "This content is valuable and trustworthy."

## Why Do Backlinks Matter for SEO?

Backlinks have been one of Google's most important ranking factors since the search engine launched. Here's why they matter:

### 1. Authority and Trust

Search engines view backlinks as endorsements. The more quality backlinks your site has, the more authoritative it appears. This is the foundation of Google's PageRank algorithm.

### 2. Referral Traffic

Beyond SEO benefits, backlinks drive direct traffic. When someone clicks a link on another website that points to yours, that's referral traffic—often highly targeted visitors interested in your content.

### 3. Faster Indexing

Search engine crawlers discover new content by following links. Having backlinks helps search engines find and index your pages faster.

## What Makes a Good Backlink?

Not all backlinks are created equal. Here are the key factors that determine backlink quality:

### Relevance

A link from a website in your niche is more valuable than one from an unrelated site. A cooking blog linking to your recipe site carries more weight than a random link from a tech blog.

### Authority

Links from high-authority websites (like major news outlets, educational institutions, or industry leaders) pass more "link equity" than links from low-authority sites.

### Dofollow vs Nofollow

**Dofollow links** pass SEO value and are what you want for ranking purposes. **Nofollow links** include a rel="nofollow" attribute that tells search engines not to pass ranking signals.

### Anchor Text

The clickable text of a link (anchor text) provides context about the linked page. Natural, descriptive anchor text is ideal.

### Placement

Links within the main content of a page are typically more valuable than footer or sidebar links.

## How to Start Building Backlinks

Ready to grow your backlink profile? Here are some proven strategies:

### 1. Create Link-Worthy Content

The foundation of any link building strategy is having content worth linking to. This includes:
- Comprehensive guides and tutorials
- Original research and data
- Infographics and visual content
- Industry reports and surveys

### 2. Guest Posting

Writing articles for other websites in your niche is a classic way to earn backlinks. Focus on providing genuine value, not just getting a link.

### 3. Broken Link Building

Find broken links on relevant websites, then reach out to suggest your content as a replacement. It's a win-win—they fix their broken link, and you get a backlink.

### 4. Resource Page Link Building

Many websites have resource pages that link to helpful content in their industry. If your content is genuinely useful, reaching out can land you a spot.

### 5. HARO (Help a Reporter Out)

Journalists and bloggers constantly need expert sources. By responding to queries on platforms like HARO, you can earn high-authority backlinks from news sites.

## Common Backlink Mistakes to Avoid

### Buying Low-Quality Links

Mass purchasing cheap backlinks from link farms or PBNs can result in a Google penalty. Quality always beats quantity.

### Ignoring Anchor Text Diversity

Using the same exact-match anchor text repeatedly looks unnatural to search engines. Vary your anchor text naturally.

### Neglecting Internal Links

While building external backlinks, don't forget to link between your own pages. Internal linking helps distribute authority and improves user experience.

### Focusing Only on DA/DR

Domain Authority (Moz) and Domain Rating (Ahrefs) are useful metrics, but don't obsess over them. A relevant link from a smaller site can be more valuable than an irrelevant link from a high-DA site.

## Conclusion

Backlinks remain one of the most important SEO factors in 2025. Focus on earning quality links through great content and genuine outreach, and you'll see your search rankings improve over time.

The key is consistency. Building a strong backlink profile doesn't happen overnight, but the compounding effects of steady link building are well worth the effort.
    `,
  },
  'dofollow-vs-nofollow': {
    title: 'Dofollow vs Nofollow Links: What\'s the Difference?',
    description:
      'Understand the crucial difference between dofollow and nofollow links, how they impact your SEO, and when to use each type.',
    date: '2025-01-09',
    author: 'SEO Backlinks',
    keywords: ['dofollow', 'nofollow', 'link attributes'],
    readingTime: '6 min read',
    content: `
## Understanding Link Attributes

When a website links to another, that link can carry different attributes that tell search engines how to treat it. The two most important types are dofollow and nofollow links.

## What Is a Dofollow Link?

A dofollow link is a standard HTML link that passes SEO value (often called "link juice" or "link equity") from the linking page to the linked page.

By default, all links are dofollow unless specified otherwise. They look like this in HTML:

\`\`\`html
<a href="https://example.com">Link Text</a>
\`\`\`

When search engines crawl a dofollow link, they:
- Follow the link to discover the destination page
- Pass authority and ranking signals to that page
- Use the anchor text as a relevance signal

## What Is a Nofollow Link?

A nofollow link includes a rel="nofollow" attribute that tells search engines not to pass ranking signals through the link.

\`\`\`html
<a href="https://example.com" rel="nofollow">Link Text</a>
\`\`\`

Google introduced the nofollow attribute in 2005 to combat comment spam. Since then, it's become a standard way to indicate that a website doesn't endorse the linked content.

## When Are Nofollow Links Used?

### Paid Links and Advertisements
Google requires that paid links use nofollow (or the newer rel="sponsored" attribute) to prevent manipulation of search rankings.

### User-Generated Content
Comments, forum posts, and other user-generated content typically use nofollow to prevent spam from affecting SEO.

### Untrusted Content
When you can't vouch for the quality or reliability of a linked page, nofollow is appropriate.

## Additional Link Attributes

Google has introduced additional link attributes beyond nofollow:

### rel="sponsored"
Specifically for paid placements, ads, and sponsored content.

### rel="ugc"
For links in user-generated content like comments and forum posts.

### How Google Treats These Attributes

Since 2020, Google treats nofollow as a "hint" rather than a directive. This means Google may choose to follow these links and pass some value in certain cases, though it's not guaranteed.

## Do Nofollow Links Have Any Value?

Yes! While nofollow links don't directly pass SEO authority, they offer several benefits:

### 1. Referral Traffic
Nofollow links can still drive significant traffic if they're on high-traffic pages.

### 2. Brand Awareness
Being mentioned on authoritative sites increases your brand visibility, regardless of link type.

### 3. Natural Link Profile
A healthy backlink profile includes a mix of dofollow and nofollow links. An unnatural ratio can look suspicious.

### 4. Potential for Future Dofollow Links
Visibility from nofollow links can lead to dofollow links from other sources who discover your content.

## SEO Best Practices

### For Your Website
- Use nofollow for paid links, ads, and affiliate links
- Apply nofollow to untrusted or unverified links
- Don't overuse nofollow on internal links

### For Link Building
- Focus primarily on earning dofollow links for SEO value
- Don't ignore nofollow opportunities on high-traffic sites
- Maintain a natural mix of link types

## Conclusion

While dofollow links are the primary currency of SEO link building, nofollow links still play an important role in a complete digital marketing strategy. Focus on earning quality links of both types from relevant, authoritative sources.
    `,
  },
  'link-building-strategies': {
    title: '15 Proven Link Building Strategies That Work in 2025',
    description:
      'Discover actionable link building tactics from guest posting to broken link building. Real strategies that get results.',
    date: '2025-01-08',
    author: 'SEO Backlinks',
    keywords: ['link building', 'strategies', 'tactics'],
    readingTime: '12 min read',
    content: `
## Why Link Building Still Matters

Despite algorithm updates and changing SEO landscapes, backlinks remain one of Google's top ranking factors. The difference in 2025 is that quality matters more than ever. Here are 15 strategies that actually work.

## 1. Create Link-Worthy Content

The foundation of successful link building is having content worth linking to.

### What Works:
- Original research and data studies
- Comprehensive ultimate guides (3,000+ words)
- Free tools and calculators
- Industry surveys and reports
- Visual assets like infographics

### Pro Tip:
Before creating content, search for your topic and analyze what's already ranking. Your content needs to be significantly better to earn links.

## 2. Guest Posting

Writing articles for other websites remains one of the most reliable link building methods.

### How to Do It Right:
- Target relevant websites in your niche
- Pitch unique, valuable topics (not recycled content)
- Include a natural, contextual link to your site
- Focus on providing value, not just getting links

### Finding Opportunities:
Search for "[your niche] + write for us" or "[your niche] + guest post guidelines"

## 3. Broken Link Building

Find broken links on relevant websites and offer your content as a replacement.

### The Process:
1. Find resource pages in your niche
2. Use a tool like Check My Links to find broken links
3. Create or identify content that could replace the broken resource
4. Reach out to the webmaster with a helpful email

### Why It Works:
You're helping the site owner fix a problem while earning a link. Win-win.

## 4. Resource Page Link Building

Many websites maintain resource pages that link to helpful content in their industry.

### How to Find Them:
- "[your topic] + resources"
- "[your topic] + useful links"
- "[your topic] + recommended sites"

### Outreach Template:
Keep it short. Explain why your resource would be valuable to their readers. Don't beg for a link.

## 5. HARO (Help a Reporter Out)

Journalists and content creators constantly need expert sources. HARO connects them with people like you.

### Tips for Success:
- Respond quickly (within hours, not days)
- Provide genuine expertise, not fluff
- Include credentials that establish authority
- Keep responses concise and quotable

### Expected Results:
High-authority backlinks from news sites and major publications.

## 6. Skyscraper Technique

Find content that's earned lots of links, create something better, then reach out to the people who linked to the original.

### The Steps:
1. Find popular content with many backlinks
2. Create a significantly improved version
3. Reach out to sites linking to the original
4. Explain why your version is more valuable

## 7. Digital PR

Create newsworthy content that journalists want to cover.

### What Gets Coverage:
- Original data and statistics
- Controversial or surprising findings
- Timely content tied to current events
- Local angle stories

### Distribution:
Use services like PR Newswire, or build relationships with journalists directly.

## 8. Competitor Backlink Analysis

Study where your competitors get their links and pursue the same opportunities.

### Tools to Use:
- Ahrefs
- SEMrush
- Moz Link Explorer

### What to Look For:
- Guest post opportunities they've used
- Resource pages linking to them
- Directories they're listed in
- Mentions they've earned

## 9. Unlinked Brand Mentions

Find places where your brand is mentioned but not linked, then request the link.

### How to Find Them:
Set up Google Alerts for your brand name, or use tools like Ahrefs Content Explorer.

### Outreach Approach:
Thank them for the mention and politely ask if they'd consider adding a link.

## 10. Internal Linking

Often overlooked, but internal links help distribute authority throughout your site.

### Best Practices:
- Link from high-authority pages to important pages
- Use descriptive anchor text
- Create content hubs around key topics
- Fix orphan pages (pages with no internal links)

## 11. Create Free Tools

Free tools and calculators attract natural backlinks from people who find them useful.

### Examples:
- ROI calculators
- Assessment tools
- Generators and converters
- Templates and checklists

### Promotion:
Submit to tool directories and reach out to bloggers who write about your topic.

## 12. Expert Roundups

Compile insights from multiple experts on a topic, then leverage their networks.

### The Process:
1. Choose a compelling question
2. Reach out to experts for their input
3. Compile responses into a valuable post
4. Notify participants when published

### Why It Works:
Experts often share and link to content they're featured in.

## 13. Podcasts and Interviews

Being a guest on podcasts earns you exposure and often a backlink in show notes.

### How to Get Booked:
- Research relevant podcasts in your niche
- Listen to a few episodes to understand the format
- Pitch yourself with specific topic ideas
- Provide value, not a sales pitch

## 14. Testimonials and Case Studies

Offer testimonials to products and services you use—many companies link back to featured customers.

### How to Approach:
- Reach out to tools you genuinely use
- Offer a detailed testimonial or case study
- Ask if they'd feature you on their website

## 15. Strategic Partnerships

Partner with complementary (non-competing) businesses for mutual link opportunities.

### Partnership Ideas:
- Co-created content
- Referral pages
- Joint webinars or events
- Affiliate programs

## Conclusion

Successful link building in 2025 requires a mix of strategies. Focus on creating genuine value, building real relationships, and earning links through quality—not manipulation.

Start with 2-3 strategies that fit your resources and expertise, then expand as you see results. Consistency beats intensity every time.
    `,
  },
  'domain-authority-explained': {
    title: 'Domain Authority Explained: What It Is and How to Improve It',
    description:
      'A comprehensive guide to understanding Domain Authority (DA), what affects it, and practical steps to improve your site\'s DA score.',
    date: '2025-01-07',
    author: 'SEO Backlinks',
    keywords: ['domain authority', 'DA', 'Moz'],
    readingTime: '9 min read',
    content: `
## What Is Domain Authority?

Domain Authority (DA) is a search engine ranking score developed by Moz that predicts how likely a website is to rank in search engine result pages (SERPs).

DA scores range from 1 to 100, with higher scores indicating greater ranking potential.

## Important Clarification

**Domain Authority is NOT a Google ranking factor.** It's a third-party metric created by Moz to help SEOs estimate a site's competitive strength.

Google has confirmed they don't use DA in their algorithm. However, DA correlates with ranking ability because it's based on factors that do influence rankings.

## How Is Domain Authority Calculated?

Moz calculates DA using machine learning algorithms that consider:

### Link Profile Factors
- Total number of backlinks
- Number of unique referring domains
- Quality of linking domains
- Link diversity and relevance

### Other Factors
- Root domain age
- Overall link profile growth
- MozRank and MozTrust scores

## DA vs. Other Authority Metrics

### Domain Rating (DR) - Ahrefs
Similar concept, different calculation. Focuses heavily on the quantity and quality of backlinks.

### Authority Score - SEMrush
Combines backlink data with organic traffic and spam signals.

### Trust Flow - Majestic
Measures the quality of links pointing to a site based on how trustworthy the linking sites are.

## What's a Good Domain Authority?

DA is relative to your competition. Here's a general guide:

### DA 1-20
New websites or sites with minimal backlinks. Typical for personal blogs and small local businesses.

### DA 21-40
Established sites with some authority. Many small to medium businesses fall here.

### DA 41-60
Strong authority. Competitive for moderate-difficulty keywords.

### DA 61-80
Very high authority. Major brands, popular publications, and established industry leaders.

### DA 81-100
Exceptional authority. Reserved for sites like Google, Facebook, Wikipedia, and major news outlets.

## How to Improve Domain Authority

### 1. Build Quality Backlinks

The most impactful factor. Focus on earning links from:
- Relevant, authoritative websites
- Diverse sources (not just one or two sites)
- Editorial placements within content

### 2. Remove Toxic Backlinks

Low-quality or spammy backlinks can hurt your DA. Use Moz, Ahrefs, or Google Search Console to identify and disavow harmful links.

### 3. Improve Internal Linking

Strong internal linking helps distribute authority throughout your site. Ensure important pages are well-connected.

### 4. Create Link-Worthy Content

Content that naturally attracts links:
- Original research and data
- Comprehensive guides
- Infographics and visual content
- Free tools and resources

### 5. Be Patient

DA takes time to improve. It's calculated periodically and reflects long-term trends, not overnight changes.

## Common DA Misconceptions

### Myth: Higher DA Guarantees Better Rankings
Reality: DA predicts ranking potential but doesn't guarantee anything. Google uses many factors DA doesn't account for.

### Myth: DA Changes Daily
Reality: Moz updates DA periodically, not in real-time. Day-to-day fluctuations are normal.

### Myth: You Should Only Get Links from High-DA Sites
Reality: Relevance matters more than DA. A link from a relevant DA 30 site may outperform an irrelevant DA 70 link.

### Myth: DA Can't Decrease
Reality: DA can drop if you lose backlinks, competitors gain links, or Moz updates their algorithm.

## DA Limitations

### It's Not Universal
DA only measures what Moz can see and analyze. It doesn't reflect Google's actual assessment.

### Scores Are Relative
A DA of 40 might be excellent in one niche and mediocre in another.

### It Can Be Manipulated
Technically, DA can be artificially inflated through black-hat tactics—though this provides no real SEO benefit.

## Should You Focus on DA?

Use DA as one metric among many, not as your primary goal.

### Better Metrics to Track:
- Organic traffic growth
- Keyword rankings for target terms
- Conversion rates from organic traffic
- Number of ranking keywords

## Conclusion

Domain Authority is a useful metric for competitive analysis and tracking your site's progress over time. However, obsessing over DA is a mistake.

Focus on what actually drives results: creating valuable content, earning quality backlinks, and providing excellent user experience. Improved DA will follow as a natural byproduct of good SEO practices.
    `,
  },
  'backlink-quality-checklist': {
    title: 'How to Evaluate Backlink Quality: The Essential Checklist',
    description:
      'Not all backlinks are created equal. Learn how to identify high-quality links and avoid toxic ones that could hurt your rankings.',
    date: '2025-01-06',
    author: 'SEO Backlinks',
    keywords: ['link quality', 'toxic backlinks', 'evaluation'],
    readingTime: '7 min read',
    content: `
## Why Backlink Quality Matters

A single high-quality backlink can be worth more than hundreds of low-quality ones. Worse, toxic backlinks can actually harm your rankings.

Here's how to evaluate whether a backlink is worth pursuing—or avoiding.

## The Quality Checklist

### 1. Relevance

**The most important factor.** Is the linking site related to your niche?

#### Signs of Good Relevance:
- The linking site covers topics related to yours
- The specific page content is contextually appropriate
- The link makes sense for readers

#### Red Flags:
- Completely unrelated websites
- Links that seem forced or out of context
- Generic "link directory" sites with no topical focus

### 2. Authority of the Linking Domain

Check the overall strength of the website using tools like:
- Moz Domain Authority (DA)
- Ahrefs Domain Rating (DR)
- SEMrush Authority Score

#### What to Look For:
- Higher authority = more valuable (generally)
- But relevance often beats raw authority numbers

### 3. Traffic and Engagement

A link from a high-traffic page can drive referral visitors and signals that the page is genuinely valuable.

#### How to Check:
- Use Ahrefs or SEMrush to estimate page traffic
- Look for signs of engagement (comments, shares)
- Check if the page ranks for relevant keywords

### 4. Link Placement

Where the link appears on the page matters significantly.

#### Best Placements:
- Within the main body content (editorial links)
- Early in the article
- Surrounded by relevant text

#### Weaker Placements:
- Footer links
- Sidebar widgets
- Author bio sections
- Comment sections

### 5. Anchor Text

The clickable text of the link provides context to search engines.

#### Ideal Anchor Text:
- Natural and descriptive
- Varied across your backlink profile
- Relevant to the linked page

#### Problematic Anchor Text:
- Over-optimized exact match keywords
- Generic text like "click here" (not harmful, just not helpful)
- Unrelated or spammy text

### 6. Dofollow vs. Nofollow

Check whether the link passes SEO value.

#### Dofollow Links:
- Pass ranking signals
- The primary target for link building
- No "nofollow" attribute in HTML

#### Nofollow Links:
- Don't pass direct SEO value
- Still valuable for traffic and brand exposure
- A natural backlink profile includes both types

### 7. Linking Page Quality

Evaluate the specific page, not just the domain.

#### Quality Indicators:
- Original, well-written content
- Good user experience (fast loading, mobile-friendly)
- The page itself ranks for relevant keywords
- Other quality sites link to this page

### 8. Number of Outbound Links

Pages with excessive outbound links dilute the value passed to each one.

#### What to Check:
- How many external links are on the page?
- Is your link one of many, or is it selective?
- Are other outbound links to quality sites?

## Toxic Backlink Warning Signs

Avoid or disavow links with these characteristics:

### Obvious Red Flags:
- Link farms and PBN (Private Blog Network) sites
- Sites with no real content (just links)
- Foreign language sites unrelated to your business
- Sites with malware or hacked content
- Paid link networks

### Subtle Warning Signs:
- Sites that exist solely to sell links
- Unnatural patterns of link acquisition
- Excessive reciprocal linking
- Links from penalized domains

## How to Check Your Existing Backlinks

### Step 1: Export Your Backlink Profile
Use Google Search Console, Ahrefs, or SEMrush to get a complete list.

### Step 2: Evaluate Each Domain
Run through the checklist above for your top linking domains.

### Step 3: Identify Toxic Links
Flag any links that show warning signs.

### Step 4: Disavow if Necessary
Use Google's Disavow Tool for links you can't remove that may be harming your site.

## Quality Over Quantity

### The 80/20 Rule Applies:
Focus your link building efforts on acquiring a smaller number of highly relevant, authoritative links rather than mass quantities of low-quality links.

### One Great Link:
- From a relevant, authoritative site
- With natural anchor text
- In the body of quality content

### Beats 100 Poor Links:
- From irrelevant directories
- With spammy anchor text
- On low-quality pages

## Conclusion

Evaluating backlink quality becomes second nature with practice. Use this checklist when pursuing new link opportunities and auditing your existing profile.

Remember: the best backlinks come from genuine relationships and creating content worth linking to. Focus on quality, and your backlink profile will become a true competitive advantage.
    `,
  },
}

type Props = {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = blogPosts[params.slug]

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  }
}

export function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({ slug }))
}

export default function BlogPostPage({ params }: Props) {
  const post = blogPosts[params.slug]

  if (!post) {
    notFound()
  }

  // Get related posts (simplified for demo)
  const relatedPosts = Object.entries(blogPosts)
    .filter(([slug]) => slug !== params.slug)
    .slice(0, 3)
    .map(([slug, p]) => ({
      slug,
      title: p.title,
      description: p.description,
      date: p.date,
      readingTime: p.readingTime,
      keywords: p.keywords,
    }))

  return (
    <>
      <Header />

      <main className="min-h-screen bg-bauhaus-cream">
        {/* Article Header */}
        <header className="py-16 lg:py-24 bg-white border-b-3 border-dark">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-dark/50 hover:text-bauhaus-red mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>

            {/* Category/Keywords */}
            <div className="flex flex-wrap gap-2 mb-4">
              {post.keywords.slice(0, 3).map((keyword) => (
                <span
                  key={keyword}
                  className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-bauhaus-red/10 text-bauhaus-red"
                >
                  {keyword}
                </span>
              ))}
            </div>

            <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-[2.75rem] leading-tight text-dark mb-6">
              {post.title}
            </h1>

            <p className="text-lg sm:text-xl text-dark/60 leading-relaxed mb-8">
              {post.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-dark/50 pt-6 border-t border-dark/10">
              <span className="flex items-center gap-2">
                <div className="w-8 h-8 bg-bauhaus-blue flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium text-dark">{post.author}</span>
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formatDate(post.date)}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {post.readingTime}
              </span>
            </div>
          </div>
        </header>

        {/* Article Content */}
        <article className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div
            className="article-content"
            dangerouslySetInnerHTML={{
              __html: parseMarkdown(post.content)
            }}
          />

          {/* CTA */}
          <ContentCTA />
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="py-16 lg:py-20 bg-white border-t-3 border-dark">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="font-display font-black text-2xl sm:text-3xl text-dark mb-8">
                Continue Reading
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  )
}
