# SEO BACKLINKS GRID - MASTER BUILD DOCUMENT

## AI INSTRUCTION
You are building a grid-based backlink marketplace. The homepage IS the product - a visual grid where people buy squares to display their site and get a dofollow backlink. This is NOT a SaaS tool. This is NOT a traditional directory. Think Million Dollar Homepage meets TheMillionLines, but specifically for the SEO/backlink crowd.

---

## 1. THE CONCEPT

### What It Is
- Homepage = infinite scrolling grid (10 columns wide)
- Each square is purchasable
- Buy 1 square = small logo/favicon + dofollow link
- Buy 2 squares = wider rectangle
- Buy 4 squares (2x2) = bigger presence, more visible
- Buy 9 squares (3x3) = premium real estate
- Every purchase = permanent dofollow backlink

### Why It Works
- Visual and fun (people want to see their logo on the grid)
- Backlink value is real and understood by target audience
- Scarcity/FOMO (squares fill up, scroll position matters)
- Viral potential (people share "I'm on the grid")
- Low friction (£1-5 impulse buy)
- EMD (seobacklinks.dev) + topical content = organic traffic machine

### Revenue Model
- 1 square: £1
- 2 squares: £2
- 4 squares (2x2): £4
- 9 squares (3x3): £9
- Premium top-row placement: £20+
- Content scales domain authority → backlinks become more valuable → raise prices

---

## 2. HOMEPAGE DESIGN

### Layout
```
┌─────────────────────────────────────────────────────────────┐
│  LOGO: SEO Backlinks                    [Buy a Square - £1] │
│  "The Backlink Grid. Own Your Square. Build Your Authority."│
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──┬──┬──┬──┬──┬──┬──┬──┬──┬──┐  ← 10 columns            │
│  │▓▓│▓▓│  │▓▓▓▓▓▓│  │▓▓│  │  │  │                         │
│  ├──┼──┼──┼──────┼──┼──┼──┼──┼──┤                         │
│  │  │▓▓▓▓▓▓│  │  │▓▓│  │▓▓│  │  │  ← Filled = purchased   │
│  ├──┼──────┼──┼──┼──┼──┼──┼──┼──┤                         │
│  │▓▓│  │  │▓▓▓▓▓▓▓▓▓▓│  │  │▓▓│  │  ← Empty = available   │
│  ├──┼──┼──┼──────────┼──┼──┼──┼──┤                         │
│  │  │  │▓▓│  │  │  │▓▓│  │  │  │                          │
│  └──┴──┴──┴──┴──┴──┴──┴──┴──┴──┘                          │
│                                                             │
│  [Load More Rows...]                                        │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  Stats: 847 squares sold │ 12,453 remaining │ DA: 15       │
├─────────────────────────────────────────────────────────────┤
│  Footer: About │ Blog │ How It Works │ Terms │ Contact     │
└─────────────────────────────────────────────────────────────┘
```

### Grid Specifications
- **Columns**: 10 (fixed)
- **Rows**: Infinite (lazy load as user scrolls)
- **Square size**: ~80x80px on desktop, responsive on mobile
- **Hover state**: Shows site name + "Visit" tooltip
- **Click**: Opens site in new tab (dofollow link)
- **Empty squares**: Subtle pattern/color, clickable → opens purchase modal

### Square Display Options
- **1 square**: Favicon or small logo (32x32 scaled up)
- **2 squares (1x2 or 2x1)**: Wider logo
- **4 squares (2x2)**: Full logo with optional tagline
- **9 squares (3x3)**: Logo + tagline + description text

### Visual Design
- Clean white/light gray background
- Grid lines subtle but visible
- Filled squares have slight shadow/depth
- Empty squares have dotted border or subtle "+" icon
- Top rows more premium feel (slight gradient?)

---

## 3. PURCHASE FLOW

### Step 1: Select Squares
User clicks on empty square(s) on the grid to select.

**Selection UI:**
- Click empty square → highlights in blue
- Click adjacent squares to select multiple
- Show floating tooltip: "1 square selected - £1" / "4 squares (2x2) - £4"
- "Clear Selection" and "Buy Now" buttons appear

**Rules:**
- Must select contiguous squares
- Valid shapes: 1x1, 1x2, 2x1, 2x2, 1x3, 3x1, 2x3, 3x2, 3x3
- Cannot select already-purchased squares
- Max selection: 9 squares (3x3)

### Step 2: Customize
Modal opens with form:

```
┌─────────────────────────────────────────┐
│  YOUR SQUARE(S)                         │
│                                         │
│  Selected: 4 squares (2x2) - £4         │
│                                         │
│  Website URL: [________________________]│
│  Site Name:   [________________________]│
│  Upload Logo: [Choose File]             │
│               (PNG/JPG, min 64x64px)    │
│                                         │
│  [Preview]  ←  Shows how it will look   │
│                                         │
│  ☑ I agree to terms                     │
│                                         │
│  [Pay £4 with Stripe →]                 │
└─────────────────────────────────────────┘
```

### Step 3: Payment
- Stripe Checkout (redirect or embedded)
- Payment completes → square immediately appears on grid
- Confirmation email sent with:
  - Receipt
  - Link to their square position
  - Shareable image/social card

### Step 4: Live
- Square appears on grid instantly
- Dofollow link active immediately
- User can share: "I'm on the SEO Backlinks Grid!"

---

## 4. SITE ARCHITECTURE

```
seobacklinks.dev/
│
├── / (Homepage - THE GRID)
│   └── Interactive grid + purchase flow
│
├── /blog/
│   └── All SEO/backlink educational content
│
├── /guides/
│   └── Pillar content (long-form guides)
│
├── /glossary/
│   └── /glossary/[term]/ (200+ SEO terms)
│
├── /statistics/
│   └── /statistics/[topic]/ (link building stats)
│
├── /how-it-works/
│   └── Explains the grid, backlink value, pricing
│
├── /about/
├── /contact/
├── /terms/
├── /privacy/
│
└── /api/
    ├── /api/squares (GET grid data)
    ├── /api/purchase (POST create checkout)
    └── /api/webhook (Stripe webhook)
```

---

## 5. DATABASE SCHEMA

```sql
-- Squares table (the grid)
CREATE TABLE squares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Position on grid
  row_index INTEGER NOT NULL,
  col_index INTEGER NOT NULL, -- 0-9
  
  -- Purchase info
  purchased BOOLEAN DEFAULT FALSE,
  purchase_group_id UUID, -- Groups multi-square purchases
  
  -- Site info (null if not purchased)
  site_url TEXT,
  site_name TEXT,
  logo_url TEXT,
  
  -- Meta
  purchased_at TIMESTAMP,
  email TEXT, -- Buyer email for receipts
  
  UNIQUE(row_index, col_index)
);

-- Purchase groups (for multi-square purchases)
CREATE TABLE purchase_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Dimensions
  width INTEGER NOT NULL, -- 1, 2, or 3
  height INTEGER NOT NULL, -- 1, 2, or 3
  square_count INTEGER NOT NULL,
  
  -- Payment
  amount_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'gbp',
  stripe_session_id TEXT,
  stripe_payment_intent TEXT,
  
  -- Site info
  site_url TEXT NOT NULL,
  site_name TEXT NOT NULL,
  logo_url TEXT,
  email TEXT NOT NULL,
  
  -- Status
  status TEXT DEFAULT 'pending', -- pending, completed, failed
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- Index for fast grid loading
CREATE INDEX idx_squares_position ON squares(row_index, col_index);
CREATE INDEX idx_squares_purchased ON squares(purchased);
```

---

## 6. TECHNICAL STACK

```
Frontend:     Next.js 14 (App Router)
Styling:      Tailwind CSS
Database:     Supabase (PostgreSQL)
Payments:     Stripe Checkout
File Storage: Supabase Storage (logos)
Hosting:      Vercel
Email:        Resend (receipts)
```

### Key Technical Requirements

**Grid Rendering:**
- Virtual scrolling for performance (only render visible rows)
- Lazy load rows as user scrolls
- Cache grid state client-side
- Real-time updates (Supabase realtime) when someone purchases

**Image Handling:**
- Accept PNG/JPG uploads
- Resize/optimize on upload
- Store in Supabase Storage
- Serve via CDN

**SEO:**
- Homepage is SSR (grid rendered server-side for crawlers)
- All content pages statically generated
- Proper meta tags, schema markup
- Each square's link is a real `<a href>` tag (crawlable)

---

## 7. TOPICAL MAP (CONTENT THAT FUNNELS TO GRID)

All content exists to:
1. Rank for backlink-related keywords
2. Educate visitors on backlink value
3. Funnel them to buying a square

### Pillar Guides (10 pieces, 3000+ words each)

| Guide | Target Keywords | CTA |
|-------|-----------------|-----|
| What Are Backlinks? Complete Guide | what are backlinks, backlinks meaning | "Get your first backlink on our grid" |
| How to Get Backlinks: 50 Methods | how to get backlinks, free backlinks | "Or skip the work - grab a square" |
| Link Building Strategies That Work | link building strategies | "Start with an easy win - buy a square" |
| Domain Authority Explained | domain authority, what is DA | "Build your DA - get listed" |
| Dofollow vs Nofollow Links | dofollow vs nofollow | "We offer dofollow links - grab yours" |
| Anchor Text: The Complete Guide | anchor text SEO | "Optimized anchor text included" |
| How Many Backlinks Do You Need? | how many backlinks to rank | "Start with one - £1" |
| Guest Posting Guide | guest posting, guest blogging | "Easier than outreach - instant backlink" |
| Toxic Backlinks & How to Avoid Them | toxic backlinks, bad backlinks | "Only quality links here" |
| Link Building for Beginners | link building for beginners | "Beginner? Start here - £1 for your first link" |

### Blog Posts (50+ pieces, 1500+ words each)

**Fundamentals:**
- Do Backlinks Still Matter in [Year]?
- How Long Do Backlinks Take to Work?
- What Makes a High-Quality Backlink?
- Backlinks vs Content: What's More Important?
- How Google Evaluates Backlinks
- The History of PageRank and Backlinks
- Why Referring Domains Matter More Than Total Links
- Understanding Link Equity (Link Juice)
- Natural vs Unnatural Link Profiles
- How to Analyze Your Backlink Profile

**Tactics:**
- Broken Link Building Tutorial
- Skyscraper Technique: Step by Step
- HARO Link Building Guide
- Resource Page Link Building
- Competitor Backlink Analysis
- Unlinked Brand Mentions Strategy
- Infographic Link Building
- Podcast Guest Link Building
- Statistics-Based Link Building
- Link Reclamation: Find Lost Links

**Niche-Specific:**
- Link Building for SaaS
- Link Building for E-commerce
- Link Building for Local Business
- Link Building for Startups
- Link Building for Bloggers
- Link Building on a Budget
- Link Building for B2B
- Link Building for Agencies

**Comparisons:**
- Ahrefs vs SEMrush for Backlink Analysis
- Best Free Backlink Checkers
- Moz DA vs Ahrefs DR: Which Matters?
- Best Link Building Tools [Year]

**Every blog post ends with:**
```
---
## Get Your Backlink Today

Skip the outreach. Skip the waiting. 

**[Buy a square on our grid →]** 

Starting at just £1. Instant dofollow backlink. Permanent placement.
```

### Glossary (200+ terms)
Programmatic pages for every SEO/backlink term. Each page:
- Definition
- Why it matters
- Example
- Related terms (internal links)
- CTA to buy a square

**Terms include:** anchor text, backlink, backlink profile, broken link, citation, contextual link, DA, deep link, directory link, disavow, dofollow, domain rating, editorial link, external link, follow link, guest post, HARO, homepage link, inbound link, internal link, link bait, link building, link equity, link exchange, link farm, link juice, link profile, link velocity, linkable asset, natural link, negative SEO, niche edit, nofollow, noopener, outbound link, outreach, page authority, PageRank, paid link, PBN, reciprocal link, redirect, referral traffic, referring domain, rel attribute, resource page, sitewide link, spam score, sponsored link, tier 1 link, tier 2 link, topical relevance, toxic link, trust flow, UGC link, unlinked mention, URL rating, web 2.0 link, white hat SEO, etc.

### Statistics Pages (20+ pages)
Link-worthy data content:
- Backlink Statistics [Year]
- Link Building Statistics
- SEO Industry Statistics
- Guest Posting Statistics
- Domain Authority Statistics
- Google Ranking Factor Statistics

---

## 8. SEO IMPLEMENTATION

### Homepage SEO
```html
<title>SEO Backlinks Grid - Buy Dofollow Backlinks from £1</title>
<meta name="description" content="The backlink grid. Buy a square, get a permanent dofollow backlink. Join 500+ sites building their domain authority. Starting at just £1.">

<!-- Open Graph -->
<meta property="og:title" content="SEO Backlinks Grid">
<meta property="og:description" content="Own your square. Get your backlink.">
<meta property="og:image" content="/og-image.png"> <!-- Screenshot of grid -->

<!-- Schema -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "SEO Backlinks Grid",
  "url": "https://seobacklinks.dev",
  "description": "Buy dofollow backlinks on our visual grid"
}
</script>
```

### Grid Links (Critical for SEO Value)
Each purchased square renders as a real anchor tag:
```html
<a 
  href="https://example.com" 
  target="_blank" 
  rel="noopener"
  title="Example Site"
>
  <img src="/logos/example.png" alt="Example Site" />
</a>
```

**Important:** NO `rel="nofollow"` - these are dofollow links (the product).

### Content Pages
- Static generation (SSG) for all blog/guides/glossary
- Proper heading hierarchy (H1 → H2 → H3)
- Internal linking (every page links to 3-5 related pages)
- Schema markup (Article, FAQPage, BreadcrumbList)
- Canonical URLs
- XML sitemap auto-generated

---

## 9. PRICING STRATEGY

### Launch Pricing (Month 1-3)
| Size | Price | Price per Square |
|------|-------|------------------|
| 1 square | £1 | £1.00 |
| 2 squares | £2 | £1.00 |
| 4 squares (2x2) | £4 | £1.00 |
| 9 squares (3x3) | £9 | £1.00 |

### Growth Pricing (Month 3-6, DA 15+)
| Size | Price | Price per Square |
|------|-------|------------------|
| 1 square | £2 | £2.00 |
| 2 squares | £3 | £1.50 |
| 4 squares (2x2) | £5 | £1.25 |
| 9 squares (3x3) | £10 | £1.11 |

### Scale Pricing (Month 6+, DA 25+)
| Size | Price | Price per Square |
|------|-------|------------------|
| 1 square | £5 | £5.00 |
| 2 squares | £8 | £4.00 |
| 4 squares (2x2) | £15 | £3.75 |
| 9 squares (3x3) | £30 | £3.33 |

### Premium Placement
- **Row 1-10 (Top)**: 2x base price
- **Featured spot**: Custom pricing

---

## 10. GROWTH & VIRALITY

### Built-in Viral Mechanics

**1. Shareable Confirmation**
After purchase, show:
```
🎉 You're on the grid!

[Screenshot of their square on the grid]

Share your square:
[Twitter] [LinkedIn] [Copy Link]

"Just grabbed my spot on @seobacklinks grid! 
Instant dofollow backlink for £1 🔥 
seobacklinks.dev"
```

**2. Embed Badge**
Offer buyers a badge for their site:
```html
<a href="https://seobacklinks.dev">
  <img src="https://seobacklinks.dev/badge.svg" alt="Listed on SEO Backlinks Grid">
</a>
```
This creates MORE backlinks to you.

**3. Grid Screenshot Updates**
Weekly Twitter post: "This week's grid update - 47 new squares sold!"
Shows visual progress, creates FOMO.

**4. Leaderboard/Stats**
Public stats on homepage:
- Total squares sold
- Squares remaining
- Current DA
- Recent purchases (live feed?)

### Content Amplification
- Reddit: r/SEO, r/bigseo, r/juststart, r/SideProject
- Twitter/X: Daily SEO tips, engage with SEO community
- LinkedIn: Professional angle
- Indie Hackers: Build in public

---

## 11. TECHNICAL BUILD PROMPTS

### Prompt 1: Project Setup
```
Create a Next.js 14 project with App Router, TypeScript, Tailwind CSS, and Supabase.

Structure:
/app
  page.tsx (homepage with grid)
  /api
    /squares/route.ts (GET grid data)
    /checkout/route.ts (POST create Stripe session)
    /webhook/route.ts (POST Stripe webhook)
  /blog/[slug]/page.tsx
  /guides/[slug]/page.tsx
  /glossary/[term]/page.tsx
  /how-it-works/page.tsx
  /about/page.tsx
  /terms/page.tsx
  
/components
  Grid.tsx (main grid component)
  Square.tsx (individual square)
  PurchaseModal.tsx (selection + form)
  
/lib
  supabase.ts
  stripe.ts
  
/content (MDX files for blog/guides)
```

### Prompt 2: Grid Component
```
Build a responsive grid component:

- 10 columns fixed
- Rows load dynamically (infinite scroll)
- Each square is 80x80px on desktop
- Responsive: 10 cols on desktop, 5 on tablet, 3 on mobile

Square states:
- Empty: Subtle dotted border, clickable
- Purchased: Shows logo/favicon, has link
- Selected: Blue highlight (during purchase flow)

Performance:
- Virtual scrolling (react-window or similar)
- Only render visible rows
- Lazy load images

Interactivity:
- Click empty square to start selection
- Shift+click or drag to select multiple
- Show floating "X squares selected - £X" indicator
- "Buy Now" button when squares selected
```

### Prompt 3: Purchase Flow
```
Build purchase modal and Stripe integration:

1. Modal opens when user clicks "Buy Now" after selecting squares
2. Form fields:
   - Website URL (required, must be valid URL)
   - Site Name (required)
   - Logo upload (optional, accepts PNG/JPG, 64x64 min)
3. Preview section shows how squares will look
4. "Pay with Stripe" button creates Checkout session
5. On success:
   - Webhook marks squares as purchased
   - Stores site info
   - Sends confirmation email via Resend
   - Shows success modal with share options

Stripe:
- Use Stripe Checkout (redirect mode)
- GBP currency
- Include metadata: square positions, site URL, email
```

### Prompt 4: Supabase Setup
```
Set up Supabase:

1. Create tables (see schema in section 5)
2. Enable Row Level Security
3. Set up Storage bucket for logos
4. Create edge function for image resizing (optional)
5. Enable Realtime for squares table (live updates)

Policies:
- Anyone can read squares
- Only service role can write (via API)
```

### Prompt 5: Content System
```
Set up MDX content system:

- /content/blog/*.mdx for blog posts
- /content/guides/*.mdx for pillar guides  
- /content/glossary/*.mdx for glossary terms

Frontmatter:
---
title: "Post Title"
description: "Meta description"
date: "2025-01-10"
author: "SEO Backlinks"
keywords: ["keyword1", "keyword2"]
---

Features:
- Auto-generate sitemap.xml
- Auto-generate RSS feed
- Table of contents for long content
- Related posts component
- CTA component that links to homepage grid
```

### Prompt 6: Homepage Layout
```
Build homepage:

Header:
- Logo (left)
- Nav: How It Works, Blog, About
- CTA button: "Buy a Square - £1" (right)

Hero (above grid):
- H1: "The Backlink Grid"
- Subhead: "Own your square. Get your dofollow backlink. From £1."
- Trust indicators: "X squares sold • DA: X • Instant approval"

Grid section:
- Full width grid component
- "Load more" or infinite scroll

Stats bar:
- Squares sold
- Squares available  
- Current DA

Footer:
- Links: About, Blog, How It Works, Terms, Privacy, Contact
- Social links
- © SEO Backlinks
```

---

## 12. LAUNCH CHECKLIST

### Pre-Launch
- [ ] Domain purchased (seobacklinks.dev)
- [ ] Hosting set up (Vercel)
- [ ] Database ready (Supabase)
- [ ] Stripe connected and tested
- [ ] Grid functional (select, purchase, display)
- [ ] 5+ blog posts live
- [ ] 3+ pillar guides live
- [ ] 50+ glossary terms live
- [ ] /how-it-works page
- [ ] /about, /terms, /privacy pages
- [ ] Mobile responsive
- [ ] Page speed optimized
- [ ] Google Search Console set up
- [ ] Analytics installed

### Launch Day
- [ ] Submit sitemap to Google
- [ ] Buy your own first square (social proof)
- [ ] Post on Twitter with screenshot
- [ ] Post on LinkedIn
- [ ] Post on r/SideProject
- [ ] Post on Indie Hackers
- [ ] Submit to Product Hunt (schedule)

### Week 1
- [ ] Respond to all inquiries
- [ ] Fix any bugs
- [ ] Publish 3+ blog posts
- [ ] Add 20+ glossary terms
- [ ] Share customer squares (with permission)

---

## 13. SUCCESS METRICS

### Month 1
- 100+ squares sold (£100+ revenue)
- 1,000+ organic sessions
- 10+ pieces of content live

### Month 3  
- 500+ squares sold (£500+ revenue)
- 5,000+ organic sessions
- DA 10+
- 50+ pieces of content

### Month 6
- 2,000+ squares sold (£2,000+ revenue)
- 20,000+ organic sessions
- DA 20+
- 200+ pieces of content

### Month 12
- 10,000+ squares sold
- 100,000+ organic sessions
- DA 30+
- £10,000+/month potential

---

## 14. KEY DIFFERENTIATORS

| vs TheMillionLines | vs Directories | vs PBNs |
|--------------------|----------------|---------|
| Visual grid (cooler) | Visual (more engaging) | Legit and public |
| SEO-focused audience | SEO content drives traffic | Real site, real DA |
| Topical authority content | Not just listings | Transparent |
| Scalable pricing with DA | Fixed value | No risk |

---

## EXECUTE THIS. BUY THE DOMAIN TODAY.

`seobacklinks.dev` - $13

The EMD + grid concept + topical content = winner.