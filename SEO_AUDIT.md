# BacklinkGrid SEO Audit

Generated: 2026-04-09  
Repo audited: `/Users/max/Desktop/backlink-squares`  
Scope: full repo crawl, `npm run build`, built HTML inspection under `.next/server/app`, route manifest inspection, metadata/schema inspection, internal-link crawl, and conversion-path review.  
External context used: the April 2026 analytics, GSC, Bing Webmaster Tools, Bing AI citations, and Stripe revenue data supplied in the brief.

## Executive Summary

BacklinkGrid has enough topical surface area to win more search traffic than it currently converts, but the current implementation is leaking value at three layers:

| Layer | What is happening | Why it matters |
| --- | --- | --- |
| Discovery | The site has 351 indexable routes, but `sitemap.xml` only exposes 350 because `/tools/free-backlink-checker` is missing from `app/sitemap.ts`. | GSC's "350 indexed pages" roughly matches the sitemap, not the actual route set. |
| CTR | High-impression pages often have better `metaTitle`/`metaDescription` values in MDX frontmatter that never reach the rendered head because blog metadata uses `post.title` and `post.description` directly. | The site is leaving its best SERP copy unused on some of the pages that need it most. |
| Conversion | The site has traffic, but the funnel is weak: dead forms, almost no conversion analytics, generic content CTAs, limited trust proof, and a bundle offer that promises two CSVs while the download route serves one. | This is why ~1,550 visitors/month turns into ~£26 total revenue. |

Most important fixes:

- Wire blog pages to use `metaTitle` and `metaDescription` from content frontmatter.
- Add `/tools/free-backlink-checker` to `app/sitemap.ts`.
- Remove or revise the AI crawler blocks in `app/robots.ts` if AI citation growth matters.
- Fix the sitewide broken footer link to `/industries/startup`.
- Add page-specific `og:image` and restore FAQ schema on comparison pages.
- Fix dead newsletter/contact forms and add real funnel event tracking.
- Resolve the bundle trust mismatch: landing page says "2 CSV files", delivery route serves one CSV.

## Part 1 — Foundation Analysis

### Method

I audited the repo in four passes:

1. Source crawl: `app/`, `components/`, `content/`, `lib/`, and API routes.
2. Build audit: `npm run build`, then inspected `.next/prerender-manifest.json`, `.next/app-path-routes-manifest.json`, and generated HTML in `.next/server/app`.
3. Link audit: parsed rendered internal anchors to identify broken targets, weakly linked pages, and route mismatches.
4. Conversion/path audit: reviewed homepage, pricing, bundle, modal checkout, success states, Stripe routes, and form flows.

### Route, Sitemap, and Rendering Accounting

#### Ground truth counts

| Metric | Count | Notes |
| --- | ---: | --- |
| MDX-backed routes | 336 | Every `.mdx` file under `content/`, including `_index.mdx` hub/index pages. |
| Non-content app routes | 19 | `/`, `/about`, `/blog`, `/bundle`, `/bundle/success`, `/contact`, `/guides`, `/how-it-works`, `/pricing`, `/privacy`, `/robots.txt`, `/sitemap-page`, `/sitemap.xml`, `/success`, `/terms`, `/tools`, and 3 tool detail routes. |
| Total user-facing routes | 355 | MDX-backed routes + non-content routes, de-duplicated. |
| Indexable routes | 351 | Excludes `/success`, `/bundle/success`, `/robots.txt`, `/sitemap.xml`. |
| URLs in generated sitemap | 350 | `sitemap.xml` omits one indexable route. |
| Dynamic path patterns | 15 | All content slug patterns are compiled and statically generated. |

#### GSC discrepancy

GSC shows 350 indexed pages over three months. The actual route set contains **351 indexable routes**. The delta is explained by a real implementation bug:

- `app/sitemap.ts:102-120` lists `/tools`, `/tools/roi-calculator`, and `/tools/backlink-analyzer`.
- It does **not** include `/tools/free-backlink-checker`.
- The generated `sitemap.xml` contains 350 URLs.

This is the cleanest explanation for the 350 vs 351 mismatch.

#### Rendering modes

| Rendering mode | Routes | Notes |
| --- | --- | --- |
| Dynamic SSR | `/`, `/bundle/success` | `/` is forced dynamic via `app/page.tsx:61-63`. `/bundle/success` is dynamic because it verifies Stripe session state. |
| Static shell + heavy client dependence | `/success`, `/tools/free-backlink-checker`, `/tools/backlink-analyzer`, `/tools/roi-calculator` | Search engines get HTML, but the core interaction depends on client JS. |
| Static HTML / SSG | Everything else | All content slugs are statically generated via `generateStaticParams()`. |

#### Dynamic path patterns compiled in the app

```text
/backlink-audit/[slug]
/backlink-quality/[slug]
/backlinks/[slug]
/blog/[slug]
/comparisons/[slug]
/digital-pr/[slug]
/glossary/[slug]
/guides/[slug]
/industries/[slug]
/link-building-tactics/[slug]
/link-building/[slug]
/outreach/[slug]
/resources/[slug]
/statistics/[slug]
/strategies/[slug]
```

### Meta Tags Audit

#### Global metadata implementation

`app/layout.tsx:6-76` defines strong sitewide defaults:

- title template
- description
- keywords
- default `openGraph.images`
- default Twitter image
- global `robots`

That is good baseline coverage.

#### Actual issues found

| Check | Result | Detail |
| --- | --- | --- |
| Missing `<title>` | 0 static HTML pages | Good. |
| Missing meta description | 0 static HTML pages | Good. |
| Missing canonical | 2 static pages | `/bundle`, `/success`. |
| Missing explicit `og:title` | 0 static HTML pages | Good. |
| Missing explicit `og:description` | 0 static HTML pages | Good. |
| Missing explicit `og:image` | 346 / 352 static HTML pages | Widespread. |
| Missing JSON-LD entirely | 0 static HTML pages | Root `WebSite` schema is present everywhere, but page-specific schema is inconsistent. |
| Duplicate title pairs | 3 confirmed pairs | See below. |

#### Duplicate titles

| Duplicate title | Routes |
| --- | --- |
| `Competitor Backlink Analysis: Complete Guide [2026] | SEO Backlinks Grid` | `/backlink-audit/competitor-analysis`, `/glossary/competitor-backlink-analysis` |
| `Link Reclamation: Recover Lost Backlinks [2026] | SEO Backlinks Grid` | `/glossary/link-reclamation`, `/link-building-tactics/link-reclamation` |
| `Resource Page Link Building: Complete Guide [2026] | SEO Backlinks Grid` | `/glossary/resource-page-link-building`, `/link-building-tactics/resource-page-links` |

#### Why `og:image` is missing almost everywhere

The pattern is structural:

- `app/layout.tsx:31-47` defines a default sitewide OG image.
- Route-level metadata in files like `app/blog/[slug]/page.tsx:32-50`, `app/backlink-quality/[slug]/page.tsx:28-48`, and `app/comparisons/[slug]/page.tsx:28-48` override `openGraph` title/description but do not include `images`.
- In practice this strips page-specific OG images from the rendered head on most pages.

That hurts:

- social sharing
- Slack/Discord/Teams previews
- AI/browser surfaces that rely on OG hints
- general snippet quality consistency

#### High-value metadata bug: blog pages ignore frontmatter SERP copy

`lib/content.ts:140-152` loads `metaTitle` and `metaDescription` from blog post frontmatter:

```ts
metaTitle: data.metaTitle,
metaDescription: data.metaDescription,
```

But `app/blog/[slug]/page.tsx:32-50` renders:

```ts
title: post.title,
description: post.description,
openGraph: {
  title: post.title,
  description: post.description,
}
```

This means the stronger frontmatter SERP copy in pages like:

- `content/blog/best-free-backlink-checkers.mdx:4-5`
- `content/blog/best-guest-posting-sites-2026.mdx:4-5`
- `content/blog/moz-link-explorer-guide.mdx:4-5`

never reaches Google.

#### Hardcoded or missing metadata by route

| Route / area | File reference | Problem |
| --- | --- | --- |
| `/bundle` | `app/bundle/page.tsx:6-14` | No canonical URL. |
| `/success` | `app/success/layout.tsx:3-10` | No canonical; title/description only; noindex is correct. |
| `/bundle/success` | `app/bundle/success/page.tsx:9-12` | No canonical; noindex is correct. |
| Most content pages | `app/blog/[slug]/page.tsx:39-50`, `app/backlink-quality/[slug]/page.tsx:35-48`, `app/comparisons/[slug]/page.tsx:35-48` | No explicit `og:image`. |
| Comparison pages | `app/comparisons/[slug]/page.tsx:80-111` | No FAQ schema even when `faqs` exist in frontmatter. |

### Heading Hierarchy Audit

#### Headline structure summary

| Check | Result |
| --- | ---: |
| Pages missing H1 | 1 |
| Pages with multiple H1s | 31 |
| Pages with `h3` before first `h2` | 158 |

#### Missing H1

- `/success`

This route renders multiple client states, but the initial static shell does not provide a stable, crawlable H1. The page is noindex, so this is low SEO risk, but it is still structurally untidy.

#### Pages with multiple H1s

All 31 confirmed routes:

```text
/statistics
/statistics/anchor-text-statistics
/statistics/backlink-statistics
/statistics/content-marketing-roi-statistics
/statistics/domain-authority-statistics
/statistics/guest-posting-statistics
/statistics/link-building-pricing-statistics
/statistics/link-building-statistics-2026
/statistics/outreach-response-rate-statistics
/statistics/seo-industry-statistics
/strategies
/strategies/agency-case-study-links
/strategies/agency-tool-links
/strategies/b2b-industry-publication-links
/strategies/b2b-partnership-links
/strategies/b2b-thought-leadership-links
/strategies/ecommerce-influencer-links
/strategies/ecommerce-product-link-building
/strategies/ecommerce-supplier-links
/strategies/local-citation-building
/strategies/local-press-coverage
/strategies/local-sponsorship-links
/strategies/resource-page-link-building-guide
/strategies/saas-content-marketing-links
/strategies/saas-digital-pr
/strategies/saas-guest-posting
/strategies/scholarship-link-building
/strategies/service-business-local-links
/strategies/startup-community-links
/strategies/startup-investor-pr-links
/strategies/startup-launch-links
```

#### Root cause of the multiple-H1 problem

- `components/content/HubPage.tsx:67-69` renders a page-level `<h1>`.
- `components/content/ClusterPage.tsx:98-100` renders a page-level `<h1>`.
- The affected MDX files then begin with their own markdown `#` heading, for example:
  - `content/strategies/_index.mdx:8`
  - `content/strategies/saas-digital-pr.mdx:10`
  - `content/statistics/_index.mdx:11`
  - `content/statistics/backlink-statistics.mdx:11`

This is a template/content collision, not a one-off authoring mistake.

#### Skipped heading levels

158 pages contain an `h3` before the first `h2`. The most common cause is sidebar or utility blocks rendering `h3` headings earlier in the DOM than the main-article content headings, for example:

- `components/content/HubPage.tsx:110-114`
- `components/content/ClusterPage.tsx:150-153`

This is not as serious as missing/multiple H1s, but it does make the DOM outline messy.

### Internal Linking Audit

#### Good news

- I found **no true orphan pages** among rendered static HTML routes.
- The hub/cluster architecture is directionally strong:
  - `components/content/HubPage.tsx`
  - `components/content/ClusterPage.tsx`
  - related links, cross-hub links, glossary links, and "What to Read Next" sections are built into the system.

#### Actual linking problems

##### Sitewide broken internal targets

| Broken target | Inbound broken links | Main cause |
| --- | ---: | --- |
| `/industries/startup` | 350 | Footer links to a route that does not exist. |
| `/backlink-quality/toxic-backlinks-myth` | 3 | Content links to missing page. |
| `/backlinks/backlink-profile` | 3 | Glossary links to missing page. |
| `/link-building-tactics/original-research-link-building` | 3 | Content links to a different slug than the actual page. |
| `/backlink-audit/checklist` | 2 | Intended checklist page missing. |
| `/backlink-quality/authority-metrics-explained` | 2 | Intended quality page missing. |
| `/backlink-monitoring/alerts` | 1 | Missing monitoring section. |
| `/link-building-tactics/scholarship-links-why-not` | 1 | Missing tactic page. |
| `/link-building/agencies` | 1 | Missing supporting page. |
| `/link-building/anchor-text` | 1 | Missing supporting page. |
| `/link-building/b2b` | 1 | Missing supporting page. |
| `/link-building/content-strategy` | 1 | Missing supporting page. |
| `/link-building/ecommerce` | 1 | Missing supporting page. |
| `/link-building/local-business` | 1 | Missing supporting page. |
| `/link-building/outreach` | 1 | Missing supporting page. |
| `/link-building/saas` | 1 | Missing supporting page. |
| `/penalties/manual-actions-links` | 1 | Missing penalties page. |
| `/templates` | 1 | Planned page not implemented. |

##### Concrete source references

- Footer startup link: `components/layout/Footer.tsx:40-46`
- Sitewide footer renders on nearly every page: `components/layout/Footer.tsx:63-327`
- Broken content-route mismatches are concentrated in MDX cross-links.

##### Weakly linked pages

There are no orphans, but there is a long tail of under-surfaced blog posts:

- 44 pages have only 1 inbound internal link.
- 18 pages have only 2 inbound internal links.
- 14 pages have only 3 inbound internal links.

Examples with only 1 inbound link:

```text
/blog/annual-link-building-roadmap
/blog/best-link-building-tools-2026
/blog/branded-vs-keyword-anchor-text
/blog/building-links-without-content
/blog/building-relationships-for-links
/blog/building-thought-leadership-through-links
/blog/common-link-building-questions-answered
/blog/dealing-with-negative-seo-attacks
/blog/follow-up-emails-that-get-responses
/blog/future-of-link-building
/blog/google-search-console-backlinks
/blog/guest-posting-vs-niche-edits
/blog/how-google-evaluates-backlinks
/blog/how-links-build-brand-authority
/blog/how-to-get-backlinks-from-government-sites-gov
/blog/how-to-get-backlinks-from-universities-edu
/blog/how-we-built-100-backlinks-in-30-days
/blog/link-building-agency-vs-freelancer
/blog/link-building-case-study-ecommerce
/blog/link-building-case-study-saas
```

This is the core internal-linking weakness: the hub system is reasonably strong, but the blog archive has poor rediscovery.

#### Navigation-level discovery gaps

`components/layout/Header.tsx:17-24` only exposes six hubs in the Learn dropdown:

- `/backlinks`
- `/link-building`
- `/backlink-quality`
- `/backlink-audit`
- `/link-building-tactics`
- `/digital-pr`

It does **not** expose:

- `/outreach`
- `/industries`
- `/resources`
- `/strategies`
- `/comparisons`
- `/statistics`

That weakens discovery for several commercially useful sections.

### Page Speed and Technical Rendering Factors

#### Client-side and runtime costs

| Area | Evidence | SEO impact |
| --- | --- | --- |
| Homepage is dynamic | `app/page.tsx:61-63` sets `dynamic = 'force-dynamic'` and `revalidate = 0`. | Home cannot be fully cached as a static landing page; more server/runtime cost. |
| Homepage is client-heavy | `app/page.tsx:180-208` mounts `GridProvider`, `Grid`, and `PurchaseModal`. | More JS on the highest-traffic route. |
| Tool pages are client pages | `app/tools/free-backlink-checker/page.tsx:1`, `app/tools/backlink-analyzer/page.tsx:1`, `app/tools/roi-calculator/page.tsx:1` | Core tool interactions require JS; static HTML is mostly marketing copy. |
| Header is client-rendered | `components/layout/Header.tsx:1` | Every page pays for client nav state and motion. |
| Success page is client-rendered | `app/success/page.tsx:1` | Fine for noindex, but still JS-heavy. |

#### Largest built JS chunks

| Built file | Size |
| --- | ---: |
| `.next/static/chunks/fd9d1056-85aa734798e270e0.js` | 168.1 KB |
| `.next/static/chunks/1999-36fe5aff2c2e34f8.js` | 139.4 KB |
| `.next/static/chunks/framework-a63c59c368572696.js` | 137.6 KB |
| `.next/static/chunks/8069-82c957c106d7524e.js` | 109.2 KB |
| `.next/static/chunks/main-8a0476fe708b7aab.js` | 108.6 KB |
| `.next/static/chunks/app/page-c8b0a401209c39b6.js` | 52.7 KB |
| `.next/static/chunks/app/tools/backlink-analyzer/page-789ba1e49f6d113f.js` | 32.1 KB |
| `.next/static/chunks/app/tools/free-backlink-checker/page-8f7b6ebee7714ff6.js` | 29.1 KB |
| `.next/static/chunks/app/tools/roi-calculator/page-7f7e8e93c567f5f3.js` | 19.8 KB |

The home page's dedicated chunk is not huge in isolation, but it sits on top of a large global JS baseline and the highest-traffic route is the most interactive route.

#### Images and media

Concrete problems:

- `components/grid/SeoLinks.tsx:63-69` uses raw `<img>` with no `width` or `height`.
- `components/grid/PurchaseModal.tsx:254-257` uses raw `<img>` for logo preview.
- `components/layout/Footer.tsx:306-309` uses raw `<img>` for the Turbo0 badge with no width/height.

Asset size notes:

| Asset | Size |
| --- | ---: |
| `public/fonts/JetBrainsMono-Variable.woff2` | 290 KB |
| `public/og-image.png` | 204 KB |
| `public/Backlink-Grid-OG-Image.png` | 204 KB |
| `public/fonts/CabinetGrotesk-Variable.woff2` | 41 KB |
| `public/fonts/Satoshi-Variable.woff2` | 42 KB |

This is not an image-bloat disaster, but there are easy wins in image dimension hints and overall client rendering.

### robots.txt and sitemap.xml

#### robots.txt

`app/robots.ts:7-41` is structurally valid and references the sitemap, but it explicitly blocks:

- `GPTBot`
- `ChatGPT-User`
- `CCBot`
- `anthropic-ai`
- `Google-Extended`

That directly conflicts with the business context:

- ChatGPT is already the top referrer.
- Bing AI citations are growing sharply.
- Perplexity sends traffic.

If AI citation and referral growth is strategic, this robots policy is misaligned.

#### sitemap.xml

`app/sitemap.ts` mostly does the right thing and includes content routes programmatically. The problem is the hand-maintained static block at `app/sitemap.ts:102-120`, where:

- `/tools`
- `/tools/roi-calculator`
- `/tools/backlink-analyzer`

are included, but:

- `/tools/free-backlink-checker`

is missing.

### URL Structure Audit

#### What is working

- Most URLs are clean, lowercase, hyphenated, and keyword-led.
- The hub/cluster structure is intuitive:
  - `/backlinks/...`
  - `/backlink-quality/...`
  - `/comparisons/...`
  - `/statistics/...`
  - `/strategies/...`

#### What is not working

| Pattern | Example | Problem |
| --- | --- | --- |
| Route-intent mismatch | `/tools/backlink-analyzer` titled "Backlink Audit Checklist" | Tool slug and page promise are not fully aligned. |
| Duplicate intent across sections | `/resources/roi-calculator` and `/tools/roi-calculator` | Competing intent with no clear canonical content hierarchy. |
| Missing intended routes | `/link-building/outreach`, `/link-building/saas`, `/templates` | Internal architecture references pages that do not exist. |
| Broken sitewide route | `/industries/startup` | Footer advertises a page that has not been built. |

This is less a cleanliness issue than an information-architecture consistency issue.

### Indexability

#### Indexable and healthy

- All core content hubs, clusters, glossary, guides, blog posts, comparisons, strategies, and statistics pages are statically generated and crawlable.
- Core content does not depend on JS to expose the article body.

#### Indexability risks

| Route type | Risk | Detail |
| --- | --- | --- |
| Client-only tool experiences | Medium | Search engines see the copy, but not the result state or parameterized use cases. |
| Dynamic homepage | Medium | The most important landing page is runtime-driven and JS-heavy. |
| Success pages | Low | Correctly noindexed, but structurally thin. |

### Schema Markup Audit

#### Existing schema coverage

Implemented in `components/seo/JsonLd.tsx:25-198`:

- `Article`
- `BreadcrumbList`
- `FAQPage`
- `HowTo`
- `DefinedTerm`
- `Organization`

Used effectively on:

- blog pages
- guides
- glossary pages
- most hub/cluster pages

#### Schema gaps

| Opportunity | Best route(s) | Why it matters |
| --- | --- | --- |
| `Product` + `Offer` | `/bundle`, `/pricing`, homepage square product | Commercial pages currently look informational. |
| `SoftwareApplication` | `/tools/free-backlink-checker`, `/tools/backlink-analyzer`, `/tools/roi-calculator` | Tool pages are indexable but do not identify themselves as software/tools in schema. |
| `FAQPage` on comparisons | `/comparisons/ahrefs-vs-moz`, `/comparisons/semrush-vs-moz` | These pages have FAQ content in frontmatter but no FAQ schema is rendered. |
| `ItemList` | `/blog/best-free-backlink-checkers`, `/blog/best-guest-posting-sites-2026`, alternative/comparison listicles | Better fit for ranked lists. |
| `OfferCatalog` or `Service` | grid purchase flow | Helps explain the monetized product more clearly. |
| richer `Organization` and `Person` signals | sitewide | Author and brand credibility are underdeveloped. |

### Analytics and Tracking

Tracking is minimal:

- `app/layout.tsx:2` imports `@vercel/analytics/next`
- `app/layout.tsx:104` renders `<Analytics />`

I found **no** evidence of:

- GA4
- GTM
- PostHog
- Mixpanel
- Stripe funnel event instrumentation
- CTA click tracking
- email form submission tracking
- checkout-start / checkout-complete events
- bundle-download completion tracking

For a site with low CTR and low conversion, this is a major blind spot.

## Part 2 — CTR Crisis Analysis

### Cross-page diagnosis

The CTR problem is real and structural, not random.

Recurring causes:

1. High-impression pages are probably ranking on page 2+ or bottom-of-page-1.  
   This is inference only; average position data was not provided.
2. Blog pages often have stronger frontmatter `metaTitle` and `metaDescription` values than the rendered `<title>` and `<meta name="description">`.
3. Comparison pages miss FAQ schema despite having FAQ content.
4. Most pages lack explicit `og:image`, which does not directly change Google CTR but does weaken shareability and downstream citation behavior.
5. Freshness is not always merchandised aggressively enough in the SERP snippet.
6. Some pages are comprehensive, but they do not surface proof, testing methodology, or update cadence as strongly as they should in snippet copy.

### Priority pages

#### 1. `/blog/best-free-backlink-checkers`

| Metric | Value |
| --- | --- |
| Impressions | 109,371 |
| Clicks | 5 |
| CTR | 0.005% |
| Rendered title | `11 Best Free Backlink Checkers (I Tested Them All) - 2026 Comparison` |
| Rendered description | `After testing 25+ free backlink checkers with the same 5 websites...` |
| Word count | ~2,663 |
| FAQ count | 10 |
| Internal links in rendered page | 51 |
| Likely rank band | Page 2-4 in aggregate, inference only |

What is wrong:

- The page already has better frontmatter SERP copy at `content/blog/best-free-backlink-checkers.mdx:4-5`, but `app/blog/[slug]/page.tsx:32-50` ignores it.
- The current title is not bad, but the unused `metaTitle` is cleaner and more human:
  - current: `11 Best Free Backlink Checkers (I Tested Them All) - 2026 Comparison`
  - unused frontmatter: `11 Best Free Backlink Checkers I Actually Tested [2026]`
- This is a classic "high impressions, almost no clicks" query set where searchers are comparing listicles. The snippet needs harder differentiation:
  - tested by one author
  - number of tools tested
  - accuracy comparison
  - freshness

Content quality verdict:

- Strong enough to compete.
- Good length.
- Good FAQ support.
- Good first-paragraph keyword usage.
- Needs better SERP packaging and more visible testing proof near the top.

Specific CTR recommendations:

- Use the frontmatter `metaTitle` and `metaDescription`.
- Add an explicit "tested 25+ tools" proof block immediately under the intro with date stamps.
- Add `ItemList` schema on top of `Article` + `FAQPage`.
- Surface the methodology in the first screenful, not later in the article.
- Add "Updated [Month Year]" to visible page chrome and snippet copy.

Recommended title:

`11 Free Backlink Checkers I Tested in 2026 (Accuracy Ranked)`

Recommended meta description:

`I tested 25+ free backlink checkers on real sites. See the 11 that returned useful data, how accurate they were, and which tool won each use case.`

#### 2. `/blog/best-guest-posting-sites-2026`

| Metric | Value |
| --- | --- |
| Impressions | 17,606 |
| Clicks | 25 |
| CTR | 0.14% |
| Rendered title | `67 Best Guest Posting Sites That Actually Accept Posts in 2026 (With DA & Guidelines)` |
| Rendered description | `The definitive list of guest posting sites actively accepting submissions in 2026...` |
| Word count | ~3,055 |
| FAQ count | 8 |
| Likely rank band | Bottom of page 1 to page 2, inference only |

What is wrong:

- Again, stronger frontmatter copy exists at `content/blog/best-guest-posting-sites-2026.mdx:4-5` but is ignored.
- The current title is long and descriptive, but the missing freshness hook is costly. The unused `metaTitle` includes `[Updated Monthly]`, which is exactly what this SERP wants.
- The page is listicle-heavy and likely competing against directories, SaaS blogs, and curated "write for us" roundups. The click reason needs to be verification, freshness, and acceptance probability.

Content quality verdict:

- Strong breadth.
- Good keyword targeting.
- Good FAQ coverage.
- Needs more explicit freshness, verification method, and acceptance-rate framing above the fold.

Specific CTR recommendations:

- Use the frontmatter `metaTitle` and `metaDescription`.
- Add visible "last verified within 90 days" signals for the featured sites.
- Add an `ItemList` schema layer for the site list.
- Include a small summary table near the top: top DA, easiest acceptance, fastest response.
- Rework intro copy so the first 100 words immediately promise "verified opportunities" and "updated monthly."

Recommended title:

`67 Guest Posting Sites Accepting Posts in 2026 [Updated Monthly]`

Recommended meta description:

`Find 67 verified guest posting sites by niche, DA, and submission rules. Updated monthly with acceptance notes, outreach tips, and real submission links.`

#### 3. `/backlink-quality/google-link-spam`

| Metric | Value |
| --- | --- |
| Impressions | 13,463 |
| Clicks | 2 |
| CTR | 0.015% |
| Rendered title | `Google Link Spam Update 2026: Complete Compliance Guide | SEO Backlinks Grid` |
| Rendered description | `Everything you need to know about Google's link spam policies...` |
| Word count | ~2,016 |
| FAQ count | 8 |
| Likely rank band | Page 2-4, inference only |

What is wrong:

- The title is solid, but the snippet can work harder by surfacing the specific fear/search intent: what is allowed vs not allowed, and how to stay compliant after SpamBrain.
- The page contains broken internal links to `/backlink-quality/toxic-backlinks-myth` and `/backlink-audit/checklist`, which weakens topical coherence.
- No explicit OG image.

Content quality verdict:

- Good breadth for a policy explainer.
- FAQ schema is present via `app/backlink-quality/[slug]/page.tsx:99-101`.
- Good freshness via `lastUpdated`.
- Needs stronger policy-summary packaging and link repair.

Specific CTR recommendations:

- Reframe the title around allowed/disallowed behavior, not just "complete guide."
- Add a fast "Allowed vs Risky vs Spam" table near the top.
- Add a visible update box referencing SpamBrain / latest policy interpretation.
- Repair the broken cross-links so the page sits in a clean risk/compliance cluster.
- Add a dedicated image for the page.

Recommended title:

`Google Link Spam Update 2026: What Is Allowed, What Is Risky, What Gets Penalized`

Recommended meta description:

`Clear guide to Google's 2026 link spam rules: what counts as manipulation, what still works, and how to build links without triggering SpamBrain issues.`

#### 4. `/blog/moz-link-explorer-guide`

| Metric | Value |
| --- | --- |
| Impressions | 9,806 |
| Clicks | 1 |
| CTR | 0.010% |
| Rendered title | `Moz Link Explorer Guide: Complete Tutorial for Link Building` |
| Rendered description | `Learn to use Moz Link Explorer for backlink analysis and link building...` |
| Word count | ~1,793 |
| FAQ count | 8 |
| Likely rank band | Page 2+, inference only |

What is wrong:

- The page has a much better unused title at `content/blog/moz-link-explorer-guide.mdx:4`: `Moz Link Explorer: 7 Hidden Features Most SEOs Miss [2026]`.
- The current rendered title is generic and tutorial-like; the unused one is more differentiated and curiosity-driven.
- This page is almost certainly one of the pages getting AI citations because it answers a tool/entity query directly.

Content quality verdict:

- Good fit for entity/tutorial search.
- Good FAQ coverage.
- Word count is acceptable but not dominant for a competitive tool term.
- Needs a more unique angle in SERP presentation.

Specific CTR recommendations:

- Use the frontmatter `metaTitle` and `metaDescription`.
- Add `HowTo` schema if the article is organized as a task walkthrough.
- Add screenshots or UI-step references and surface them near the top.
- Add a quick verdict box: best use cases, limitations, who should use Moz vs Ahrefs.
- Strengthen the first 100 words with "hidden features", "Spam Score", and "competitor research".

Recommended title:

`Moz Link Explorer: 7 Hidden Features Most SEOs Miss [2026]`

Recommended meta description:

`Step-by-step Moz Link Explorer guide with hidden features, Domain Authority checks, Spam Score tips, and competitor-link workflows for 2026.`

#### 5. `/comparisons/ahrefs-vs-moz`

| Metric | Value |
| --- | --- |
| Impressions | 8,476 |
| Clicks | 0 |
| CTR | 0.000% |
| Rendered title | `Ahrefs vs Moz: I Tested Both - Here's My Honest Winner [2026] | SEO Backlinks Grid` |
| Rendered description | `Hands-on Ahrefs vs Moz comparison. I tested backlink data, features, pricing, and accuracy...` |
| Word count | ~1,664 |
| FAQs in frontmatter | 8 |
| FAQ schema rendered | No |
| Likely rank band | Page 2+, inference only |

What is wrong:

- The title is already stronger than most of the site.
- The bigger miss is implementation: `content/comparisons/ahrefs-vs-moz.mdx:18-34` includes FAQs, but `app/comparisons/[slug]/page.tsx:80-111` never renders `FAQSchema`.
- For a comparison SERP, FAQ rich results and stronger above-the-fold verdict formatting could materially improve CTR.

Content quality verdict:

- Good commercial-investigation fit.
- Slightly thin relative to the best comparison pages in the market.
- Missing rich-result support despite having FAQ content.

Specific CTR recommendations:

- Render FAQ schema for comparison pages when `faqs` exist.
- Add a visible summary comparison table above the fold.
- Lead with the decision outcome and ideal-user segmentation.
- Add more proof of hands-on testing or methodology.
- Consider adding review-like pros/cons cards for each tool.

Recommended title:

`Ahrefs vs Moz in 2026: Which Tool Wins for Backlinks, DA, and Pricing?`

Recommended meta description:

`Hands-on Ahrefs vs Moz comparison covering backlink data, Domain Rating vs Domain Authority, pricing, and which tool is better for each SEO workflow.`

#### 6. `/comparisons/semrush-vs-moz`

| Metric | Value |
| --- | --- |
| Impressions | 6,257 |
| Clicks | 0 |
| CTR | 0.000% |
| Rendered title | `Semrush vs Moz: Complete Feature & Pricing Comparison [2026] | SEO Backlinks Grid` |
| Rendered description | `Semrush vs Moz comparison: features, pricing, backlink analysis, and authority metrics compared...` |
| Word count | ~1,543 |
| FAQs in frontmatter | 8 |
| FAQ schema rendered | No |
| Likely rank band | Page 2+, inference only |

What is wrong:

- Same template issue as `ahrefs-vs-moz`: FAQ content exists but no FAQ schema is rendered.
- Title is good but still generic. It lacks a decisive differentiator such as "best for agencies" or "best value."
- The page is likely too thin for a highly commercial tool-comparison SERP.

Content quality verdict:

- Good structure.
- Needs more proof, more unique comparison depth, and richer SERP support.

Specific CTR recommendations:

- Add FAQ schema.
- Add summary cards: who should buy Semrush, who should buy Moz.
- Expand the comparison table and pricing nuance.
- Add a one-screen "winner by use case" section.
- Increase visible freshness and testing claims.

Recommended title:

`Semrush vs Moz in 2026: Better Value, Better Backlink Data, Better for Agencies?`

Recommended meta description:

`Compare Semrush and Moz on backlink data, pricing, authority metrics, agency use cases, and overall value before you buy.`

#### 7. `/comparisons/majestic-alternatives`

| Metric | Value |
| --- | --- |
| Impressions | 4,429 |
| Clicks | 0 |
| CTR | 0.000% |
| Rendered title | `6 Best Majestic Alternatives for Link Analysis [2026] | SEO Backlinks Grid` |
| Rendered description | `Compare top Majestic alternatives for backlink research and Trust Flow analysis...` |
| Word count | ~2,058 |
| FAQs in frontmatter | 0 |
| Likely rank band | Page 2+, inference only |

What is wrong:

- The title is clear but undifferentiated. Most alternatives pages use the same format.
- No FAQ support.
- No obvious testing or methodology hook in the snippet.
- Searchers here want replacement logic: better UI, better data freshness, better pricing, better all-in-one stack.

Content quality verdict:

- Reasonable length.
- Good intent fit.
- Needs a stronger "why switch" angle and clearer ranking/selection criteria.

Specific CTR recommendations:

- Rewrite title to emphasize "better than Majestic" and the use-case split.
- Add a comparison summary table directly after the intro.
- Add FAQ content and FAQ schema.
- Add explicit "best Majestic alternative for X" sections.
- Surface Trust Flow/Citation Flow replacement logic in the snippet.

Recommended title:

`Best Majestic Alternatives in 2026: Better Link Data, Better UI, Better Value`

Recommended meta description:

`Looking for a Majestic replacement? Compare Ahrefs, Semrush, Moz, and other link-analysis tools by pricing, data freshness, and Trust Flow alternatives.`

### CTR Fixes That Apply Sitewide

- Make blog metadata use `metaTitle` and `metaDescription`.
- Add explicit `og:image` to content route metadata.
- Restore FAQ schema on comparison pages.
- Add `ItemList` or `HowTo` where page format warrants it.
- Surface update dates and methodology in the first screenful.
- Use cleaner, shorter, more differentiated titles for tool/entity/list pages.

## Part 3 — Conversion Audit

### What is actually being sold

| Product | Route(s) | Price | Delivery |
| --- | --- | --- | --- |
| Grid square backlinks | homepage, `/pricing`, purchase modal | `$1` per square; up to 100 squares per purchase | Stripe checkout, then live square placement on the grid |
| Backlink database bundle | `/bundle` | `£11.49` one-time, marketed as 70% off from `£39` | Stripe checkout, then CSV download |

#### Important pricing detail

`app/pricing/page.tsx:24-67` shows three tiers:

- `1 Square`
- `10 Squares`
- `25 Squares`

But these are not distinct Stripe products. They are pricing frames that push users back to `/#grid` via `app/pricing/page.tsx:166-174`.

### Funnel map

#### Grid square product

1. User lands on `/` or a content page.
2. CTA pushes to `/#grid` or homepage.
3. User selects squares in the interactive grid.
4. `components/grid/PurchaseModal.tsx:105-141` posts to `/api/checkout`.
5. `/api/checkout` validates input, reserves squares, uploads logo, creates Stripe session.
6. User pays in Stripe.
7. Stripe returns to `/success?session_id=...`.
8. `app/success/page.tsx:55-98` verifies purchase via `/api/verify-purchase`.
9. Webhook finalizes purchase in `app/api/webhook/route.ts`.

#### Bundle product

1. User lands on `/bundle`.
2. `app/bundle/BundleLanding.tsx:96-115` posts to `/api/bundle-checkout`.
3. Stripe checkout session is created by `app/api/bundle-checkout/route.ts:11-38`.
4. Stripe returns to `/bundle/success?session_id=...`.
5. `app/bundle/success/page.tsx:62-64` verifies purchase server-side.
6. User downloads file from `/api/bundle-download?session_id=...`.

### CTA Inventory

This is the monetization CTA set that actually matters.

| Location | Copy | Destination / action | Notes |
| --- | --- | --- | --- |
| Header | `Get a Backlink` | `/#grid` | `components/layout/Header.tsx:165-177` |
| Homepage hero | `Claim Your Square` | scroll to `#grid` | `components/home/Hero.tsx:76-104` |
| Homepage CTA | `Claim Your Square` | `#grid` anchor | `components/home/CTA.tsx:138-158` |
| Content CTA | `Grab Your Square` / `Buy a Square` | `/#grid` | `components/content/ContentCTA.tsx:33-60`, `12-29` |
| Bundle cards | `Get the Bundle`, `Get the Bundle Now`, `Get the Complete Bundle` | `/bundle` | `components/promo/BundleCard.tsx` |
| Pricing cards | `Get Started` | `/#grid` | `app/pricing/page.tsx:166-174` |
| Footer CTA | `View Pricing` | `/pricing` | `components/layout/Footer.tsx:265-271` |
| Purchase modal | form submit | `/api/checkout` | `components/grid/PurchaseModal.tsx:105-141` |
| Bundle hero | `Get Instant Access` | `/api/bundle-checkout` via fetch | `app/bundle/BundleLanding.tsx:165-185` |
| Bundle success upsell | `Claim Your Square` | `/#grid` | `app/bundle/success/page.tsx:174-185` |
| Blog newsletter | `Subscribe` | dead form | `app/blog/page.tsx:83-95` |
| Contact form | `Send Message` | dead form | `app/contact/page.tsx:140-220` |

### Conversion friction points

#### 1. Dead forms = dead demand capture

- `app/blog/page.tsx:83-95` renders a newsletter form with no handler, no action, and no backend.
- `app/contact/page.tsx:140-220` renders a full contact form with no handler, no action, and no API route.

That means:

- no email capture
- no lead nurturing
- no support intake funnel
- no "soft conversion" option for visitors who are not ready to buy

#### 2. No conversion analytics

Only Vercel Analytics is installed. There is no recorded funnel instrumentation for:

- CTA click
- square selection start
- modal open
- checkout start
- checkout error
- checkout completion
- bundle CTA click
- bundle purchase
- bundle download

That makes it impossible to locate the actual drop-off point.

#### 3. Content CTAs are generic and context-blind

`components/content/ContentCTA.tsx:42-49` uses:

> Skip the outreach. Skip the waiting. Get a permanent dofollow backlink on our grid starting at just $1.

That CTA appears after informational content regardless of intent. It does not adapt to:

- commercial comparison pages
- tutorial/tool pages
- risk/compliance pages
- top-of-funnel glossary pages

It is product-first, but not intent-aware.

#### 4. The product value proposition is still abstract

The homepage hero is visually strong, but the product remains unusual:

- "Buy a square. Get a backlink." is concise.
- It does not immediately answer:
  - why this backlink matters
  - what kind of sites buy
  - what proof exists
  - whether rankings improved for any customer

#### 5. Trust proof is thin

Positive:

- clear prices
- Stripe checkout
- FAQ sections

Missing or weak:

- no customer testimonials
- no case studies
- no visible customer logos in proof format
- no authority proof beyond "growing DA value"
- no guarantee language beyond FAQ copy
- no transparent sample outputs for the bundle

#### 6. Footer trust badges actively hurt trust

`components/layout/Footer.tsx:283-309` includes badge links and alt text referencing `lifescore` / `lifescoretest`, which is a different product identity:

- `https://startupfa.me/s/lifescore?utm_source=lifescoretest.com`
- `https://turbo0.com/item/lifescoretest`
- alt text `LifeScoreTest - Featured on Startup Fame`

This is a brand-integrity problem on every page.

#### 7. Bundle offer promise is inconsistent

`app/bundle/BundleLanding.tsx:67-68` says:

> The bundle includes 2 CSV files...

But:

- `app/bundle/success/page.tsx:137-149` shows one download
- `app/api/bundle-download/route.ts:51-60` serves one file: `backlink-database-bundle.csv`

This is a direct trust and refund-risk issue.

#### 8. No post-purchase lifecycle

`app/api/webhook/route.ts:137-138` still has a TODO for confirmation emails:

```ts
// TODO: Send confirmation email via Resend
```

So even completed buyers do not get a proper owned-email handoff.

### Why 1,550 visitors/month becomes ~£26

This conversion rate is low because the site is missing the layers that usually make informational SEO traffic convert:

- segmented offers
- email capture
- proof
- analytics
- trust reinforcement
- intent-matched CTAs
- lead magnets
- a clear mid-funnel

Right now the funnel is basically:

- read content
- click generic CTA
- buy an unusual product immediately

That is too abrupt for most SEO traffic.

## Part 4 — Content and Topical Authority Map

### Current content inventory by category

| Category | Count | Avg words | Avg internal MDX links | Keyword targeting quality |
| --- | ---: | ---: | ---: | --- |
| Blog | 105 | 1,750 | 5.0 | Medium-high: 85/105 have explicit `primaryKeyword` |
| Guides | 15 | 2,211 | 4.4 | High |
| Glossary | 75 | 739 | 4.7 | High |
| Backlinks | 10 | 1,587 | 6.1 | High |
| Link Building | 9 | 1,489 | 5.2 | High |
| Backlink Quality | 8 | 1,488 | 5.9 | High |
| Backlink Audit | 7 | 1,278 | 3.9 | High |
| Link Building Tactics | 8 | 1,003 | 3.4 | High, but thin |
| Digital PR | 5 | 897 | 3.0 | High, but thin |
| Outreach | 4 | 752 | 3.3 | High, but thin |
| Industries | 11 | 2,518 | 5.1 | High |
| Resources | 18 | 1,441 | 4.2 | High |
| Strategies | 20 | 1,046 | 2.9 | Medium: titles are targeted, but 0/20 explicit `primaryKeyword` |
| Comparisons | 19 | 1,787 | 5.2 | High |
| Statistics | 9 | 1,584 | 7.0 | Medium: titles are targeted, but 0/9 explicit `primaryKeyword` |

### What the site already does well

- Topical breadth is strong.
- The architecture is not random; it already resembles a real authority site.
- There is substantial commercial-supporting content in:
  - comparisons
  - resources
  - glossary
  - statistics
  - industry strategies

### Current pillar / cluster map

#### Core authority pillars

- `/backlinks`
  - definitions, anchor text, link velocity, link equity, backlink myths, link counts
- `/link-building`
  - strategy, pricing, outreach strategy, ROI, white hat, linkable assets
- `/backlink-quality`
  - spam, trust, relevance, link quality checklist, Google link spam
- `/backlink-audit`
  - toxic links, competitor analysis, disavow, audit tools, templates
- `/link-building-tactics`
  - guest posting, broken links, skyscraper, unlinked mentions, original research
- `/digital-pr`
  - journalist outreach, data studies, press release links, newsjacking

#### Supporting authority clusters

- `/outreach`
- `/industries`
- `/strategies`
- `/comparisons`
- `/statistics`
- `/resources`
- `/glossary`
- `/guides`
- `/blog`

### Where depth is lacking

#### 1. Tactics and PR depth is thinner than the breadth suggests

These sections exist, but average word counts are low:

- Digital PR: 897 words average
- Outreach: 752 words average
- Tactics: 1,003 words average

That is enough for coverage, not enough for moat.

#### 2. Strategies and statistics have structural quality issues

- Multiple-H1 problem across the entire section.
- No explicit `primaryKeyword` fields in frontmatter.
- Strong ideas, but implementation quality is less mature than blog/guides/comparisons.

#### 3. The site has missing pages inside its own intended topical graph

The internal-link crawl shows planned but missing destinations:

- `/templates`
- `/backlink-audit/checklist`
- `/backlink-quality/authority-metrics-explained`
- `/backlink-quality/toxic-backlinks-myth`
- `/backlink-monitoring/alerts`
- `/penalties/manual-actions-links`
- `/link-building/saas`
- `/link-building/ecommerce`
- `/link-building/local-business`
- `/link-building/b2b`
- `/link-building/outreach`
- `/link-building/agencies`
- `/link-building/anchor-text`
- `/link-building/content-strategy`
- `/link-building-tactics/original-research-link-building`

These are not hypothetical keyword gaps. The codebase already tries to link to them.

### Existing pages with the best near-term ranking upside

Based on GSC/Bing impression and citation signals, these should be prioritized first:

1. `/blog/best-free-backlink-checkers`
2. `/blog/best-guest-posting-sites-2026`
3. `/backlink-quality/google-link-spam`
4. `/blog/moz-link-explorer-guide`
5. `/comparisons/ahrefs-vs-moz`
6. `/comparisons/semrush-vs-moz`
7. `/comparisons/majestic-alternatives`
8. `/comparisons/buzzstream-vs-pitchbox`
9. `/blog/google-link-spam-update-2026`
10. `/blog/types-of-backlinks-complete-list`
11. `/backlinks/link-velocity`
12. `/glossary/trust-flow`

### Keyword gaps inferred from the current codebase

These are the highest-confidence gaps because the site already gestures at them:

- Templates center: `/templates`
- Penalties/manual actions cluster
- Backlink monitoring / alert workflows
- Better authority-metrics explainer pages
- Link-building-by-industry pages under the main `/link-building` pillar
- Original research as a first-class tactic page
- Anchor-text and content-strategy child pages within `/link-building`

Additional logical gaps relative to the current authority footprint:

- author pages / editorial bios
- methodology pages for data/statistics content
- tool pages for link intersect, anchor-text analysis, and disavow helpers
- more first-party case studies tied to the backlink product
- more entity pages around tools already showing query demand

## Part 5 — AI Citation Optimisation

### Pages most likely being cited now

Based on the supplied AI citation/query data and the current content inventory, the most likely citation winners are:

- `/blog/moz-link-explorer-guide`
- `/comparisons/buzzstream-vs-pitchbox`
- `/comparisons/semrush-vs-moz`
- `/comparisons/ahrefs-vs-moz`
- `/backlinks/link-velocity`
- `/blog/types-of-backlinks-complete-list`
- `/glossary/trust-flow`

Why these pages work for AI systems:

- clear entity-first titles
- direct definitional answers
- comparison framing
- list/table-friendly structure
- FAQ support
- dense topical relevance

### What the current site does that helps AI discoverability

- Strong entity pages and comparison pages.
- Lots of direct-answer definitions in glossary and core hubs.
- Many pages already have `Article`, `BreadcrumbList`, and `FAQPage` schema.
- Titles are generally explicit and keyword-led.

### What hurts AI discoverability

#### 1. robots policy blocks major AI crawlers

`app/robots.ts:20-39` blocks the main AI crawler families that matter for citation and answer-surface inclusion.

That is the single biggest AI discoverability contradiction in the repo.

#### 2. Weak authority and trust packaging

AI systems prefer pages that make provenance clear. BacklinkGrid is thin on:

- author bios
- organizational proof
- cited methodology
- visible source discipline
- editorial update logs

#### 3. Tool and product schema are incomplete

The site has tool pages and commercial pages, but it does not expose them strongly enough as:

- `SoftwareApplication`
- `Product`
- `Offer`

#### 4. Comparison pages are missing FAQ schema

This hurts machine readability for exactly the kind of entity-comparison pages AI systems like to cite.

### How to increase AI citations

- Stop blocking AI crawlers if that aligns with the business goal.
- Add answer-first summary boxes at the top of key pages.
- Add source methodology blocks to statistics, comparison, and testing pages.
- Expand author and organization trust signals.
- Add structured tables that explicitly answer "best for", "pros", "cons", and "verdict" questions.
- Ensure page-specific OG image, update date, and schema are complete on the most-cited pages.
- Build more tool/entity pages around the exact Bing AI citation topics already appearing.

## Part 6 — Technical Issues and Fixes

### Critical

| Issue | Affected files / routes | Exact fix |
| --- | --- | --- |
| Sitemap missing `/tools/free-backlink-checker` | `app/sitemap.ts:102-120` | Add `/tools/free-backlink-checker` to the static tools list, rebuild, and resubmit sitemap. |
| Blog metadata ignores frontmatter `metaTitle` and `metaDescription` | `app/blog/[slug]/page.tsx:32-50`, `lib/content.ts:140-152`, affected blog MDX files | Change blog `generateMetadata()` to use `post.metaTitle || post.title` and `post.metaDescription || post.description`; also pass page images into OG/Twitter. |
| Major AI crawlers are blocked | `app/robots.ts:20-39` | Remove or revise the bot-specific disallow rules if AI citation/referral growth is part of distribution strategy. |
| Sitewide broken footer route | `components/layout/Footer.tsx:40-46` | Replace `/industries/startup` with an existing route or build the missing startup page. |
| Bundle offer promise mismatch | `app/bundle/BundleLanding.tsx:67-68`, `app/bundle/success/page.tsx:137-149`, `app/api/bundle-download/route.ts:51-60` | Either deliver the second CSV promised on the landing page or update landing/success copy so the promise matches the actual downloaded asset. |

### High

| Issue | Affected files / routes | Exact fix |
| --- | --- | --- |
| 346 static pages missing explicit `og:image` | content route templates across `app/` | Add `openGraph.images` and `twitter.images` in route-level metadata objects, using frontmatter image when available and fallback site image otherwise. |
| Missing canonical on `/bundle` and `/success` | `app/bundle/page.tsx:6-14`, `app/success/layout.tsx:3-10` | Add `alternates.canonical` to `/bundle`; keep `/success` noindex but still add a canonical or route-specific metadata if needed for consistency. |
| Comparison pages omit FAQ schema despite FAQ content | `app/comparisons/[slug]/page.tsx:80-111`, comparison MDX frontmatter | Render `FAQSchema` when `comparison.faqs?.length > 0`. |
| 31 pages render multiple H1s | `components/content/HubPage.tsx`, `components/content/ClusterPage.tsx`, `content/strategies/*.mdx`, `content/statistics/*.mdx` | Remove the markdown `#` heading from MDX where templates already render the H1, or change templates to suppress the outer H1 for those sections. |
| Dead newsletter and contact forms | `app/blog/page.tsx:83-95`, `app/contact/page.tsx:140-220` | Either wire these forms to a real backend/provider or remove them until they work. |
| No funnel instrumentation | `app/layout.tsx:2,104` and conversion components | Add GA4/PostHog/GTM or equivalent; track CTA clicks, modal opens, checkout starts, purchases, and downloads. |
| Broken internal content links | multiple MDX sources, `components/layout/Footer.tsx` | Fix slug mismatches and build the missing intended pages where strategic. |

### Medium

| Issue | Affected files / routes | Exact fix |
| --- | --- | --- |
| Homepage is forced dynamic and JS-heavy | `app/page.tsx:61-63`, `120-208` | Cache non-transactional homepage blocks where possible; isolate live grid updates from the entire page shell. |
| Tool pages are client-only experiences with minimal software schema | `app/tools/*` | Add `SoftwareApplication` schema and, if valuable, crawlable parameter/result states. |
| Raw images missing width/height | `components/grid/SeoLinks.tsx:63-69`, `components/layout/Footer.tsx:306-309` | Add dimensions or use `next/image` where practical. |
| Header nav hides commercially useful sections | `components/layout/Header.tsx:17-24` | Add `/comparisons`, `/resources`, `/statistics`, `/strategies`, `/industries`, `/outreach` to primary discovery paths. |
| Footer carries off-brand trust badges | `components/layout/Footer.tsx:283-309` | Remove or replace them with BacklinkGrid-relevant proof. |

### Low

| Issue | Affected files / routes | Exact fix |
| --- | --- | --- |
| `LAST_CONTENT_UPDATE` is stale | `app/sitemap.ts:18-19` | Update these constants or derive them automatically for static pages. |
| 158 pages have `h3` before first `h2` | content templates | Reorder DOM or lower sidebar headings to avoid outline pollution. |
| Title collisions across glossary and tactical pages | duplicate routes listed above | Differentiate title templates for glossary vs how-to/tactic pages. |

## Part 7 — Scaling Strategy

### Phase 1 — Critical fixes

- Fix blog metadata wiring so high-impression posts use their intended SERP copy.
- Add `/tools/free-backlink-checker` to `sitemap.xml`.
- Fix all broken sitewide/internal routes, starting with `/industries/startup`.
- Decide whether AI crawler blocks are intentional; if not, remove them.
- Repair the bundle product promise mismatch before driving more paid traffic.

### Phase 2 — Quick wins

- Rewrite title/meta pairs for the seven high-impression pages above.
- Add FAQ schema to comparison pages.
- Add explicit `og:image` and page images to content route metadata.
- Add visible update/methodology blocks to `best-free-backlink-checkers`, `best-guest-posting-sites-2026`, `moz-link-explorer-guide`, and core comparison pages.
- Strengthen internal links into weakly linked blog posts from hub pages, comparisons, and popular content widgets.

### Phase 3 — Content expansion

Build the missing pages the site already wants to have:

- `/templates`
- `/backlink-audit/checklist`
- `/backlink-quality/authority-metrics-explained`
- `/backlink-quality/toxic-backlinks-myth`
- `/backlink-monitoring/alerts`
- `/penalties/manual-actions-links`
- `/link-building/saas`
- `/link-building/ecommerce`
- `/link-building/local-business`
- `/link-building/b2b`
- `/link-building/outreach`
- `/link-building/agencies`
- `/link-building/anchor-text`
- `/link-building/content-strategy`
- `/link-building-tactics/original-research-link-building`

Then deepen:

- Digital PR
- Outreach
- Tactics
- Strategies
- Statistics methodology

### Phase 4 — Conversion optimisation

- Replace dead forms with working email capture and contact handling.
- Add event tracking end to end.
- Add proof:
  - testimonials
  - case studies
  - customer examples
  - sample bundle rows / screenshots
- Make content CTAs intent-aware:
  - product CTA on commercial pages
  - lead magnet CTA on top-of-funnel pages
  - bundle CTA on research-heavy listicles
- Add clearer trust and refund/expectation messaging around the bundle.

### Phase 5 — AI citation and distribution

- If aligned with strategy, unblock AI crawlers.
- Build more entity-first comparison/tutorial pages around tools already showing AI citation demand.
- Add source methodology and answer-first summaries.
- Expand organization and author trust signals.
- Turn statistics pages into citable data hubs with clear source lists and update histories.

## Appendix A — Full Route Inventory

### Standalone app routes

```text
/                         (dynamic SSR)
/about
/blog
/bundle
/bundle/success           (dynamic SSR, noindex)
/contact
/guides
/how-it-works
/pricing
/privacy
/robots.txt
/sitemap-page
/sitemap.xml
/success                  (static shell, client-rendered, noindex)
/terms
/tools
/tools/backlink-analyzer  (static shell, client-rendered)
/tools/free-backlink-checker (static shell, client-rendered)
/tools/roi-calculator     (static shell, client-rendered)
```

### MDX-backed routes by section

#### `backlink-audit` (8 routes)

```text
/backlink-audit
/backlink-audit/audit-template
/backlink-audit/audit-tools
/backlink-audit/competitor-analysis
/backlink-audit/disavow-guide
/backlink-audit/how-to-audit
/backlink-audit/toxic-links
/backlink-audit/using-metrics
```

#### `backlink-quality` (9 routes)

```text
/backlink-quality
/backlink-quality/authority-metrics
/backlink-quality/evaluating-link-opportunities
/backlink-quality/google-link-spam
/backlink-quality/link-quality-checklist
/backlink-quality/relevance-factors
/backlink-quality/spam-signals
/backlink-quality/trust-signals
/backlink-quality/what-makes-quality-backlink
```

#### `backlinks` (11 routes)

```text
/backlinks
/backlinks/anchor-text
/backlinks/anchor-text-ratios
/backlinks/backlink-myths
/backlinks/do-follow-vs-no-follow-vs-sponsored-vs-ugc
/backlinks/how-many-backlinks-do-i-need
/backlinks/internal-vs-external-links
/backlinks/link-equity-pagerank-explained
/backlinks/link-velocity
/backlinks/referring-domains-vs-backlinks
/backlinks/what-is-a-backlink
```

#### `blog` (105 routes)

```text
/blog/ahrefs-for-link-building-tutorial
/blog/annual-link-building-roadmap
/blog/backlink-quality-checklist
/blog/backlink-reporting-for-clients
/blog/becoming-a-cited-source-in-your-industry
/blog/best-free-backlink-checkers
/blog/best-guest-posting-sites-2026
/blog/best-link-building-agencies
/blog/best-link-building-tools-2026
/blog/branded-vs-keyword-anchor-text
/blog/building-links-to-boring-industries
/blog/building-links-without-content
/blog/building-relationships-for-links
/blog/building-thought-leadership-through-links
/blog/common-link-building-questions-answered
/blog/creating-a-link-building-strategy
/blog/dealing-with-negative-seo-attacks
/blog/dofollow-vs-nofollow
/blog/domain-authority-explained
/blog/e-e-a-t-and-link-building
/blog/first-10-backlinks-for-new-site
/blog/follow-up-emails-that-get-responses
/blog/future-of-link-building
/blog/google-link-spam-update-2026
/blog/google-search-console-backlinks
/blog/guest-posting-vs-niche-edits
/blog/how-google-evaluates-backlinks
/blog/how-links-build-brand-authority
/blog/how-to-audit-your-backlink-profile
/blog/how-to-build-backlinks-with-infographics
/blog/how-to-build-links-with-data-studies
/blog/how-to-do-competitor-backlink-analysis
/blog/how-to-find-broken-links-for-link-building
/blog/how-to-fix-a-bad-backlink-profile
/blog/how-to-get-backlinks-from-government-sites-gov
/blog/how-to-get-backlinks-from-news-sites
/blog/how-to-get-backlinks-from-podcasts
/blog/how-to-get-backlinks-from-universities-edu
/blog/how-to-get-backlinks-without-outreach
/blog/how-to-get-featured-in-roundups
/blog/how-to-recover-from-google-penalty
/blog/how-to-remove-toxic-backlinks
/blog/how-to-use-content-for-link-building
/blog/how-to-use-haro-for-link-building
/blog/how-to-write-guest-post-pitches-that-get-accepted
/blog/how-we-built-100-backlinks-in-30-days
/blog/international-link-building
/blog/link-building-101-beginners-guide
/blog/link-building-agency-vs-freelancer
/blog/link-building-at-scale
/blog/link-building-budget-allocation
/blog/link-building-campaign-planning
/blog/link-building-case-study-ecommerce
/blog/link-building-case-study-saas
/blog/link-building-dashboards-and-metrics
/blog/link-building-for-affiliate-sites
/blog/link-building-for-blog-posts
/blog/link-building-for-competitive-niches
/blog/link-building-for-content-sites
/blog/link-building-for-landing-pages
/blog/link-building-for-new-websites
/blog/link-building-for-personal-brands
/blog/link-building-for-product-pages
/blog/link-building-for-service-businesses
/blog/link-building-for-service-pages
/blog/link-building-for-startups
/blog/link-building-for-ymyl-sites
/blog/link-building-in-age-of-ai
/blog/link-building-kpis-and-metrics
/blog/link-building-mistakes-to-avoid
/blog/link-building-on-a-budget
/blog/link-building-statistics-2026
/blog/link-building-strategies
/blog/link-building-templates-and-scripts
/blog/link-building-terminology-glossary
/blog/link-building-vs-content-marketing
/blog/link-building-with-digital-assets
/blog/link-building-with-linkedin
/blog/link-building-with-quora
/blog/link-building-with-reddit
/blog/link-building-with-twitter
/blog/manual-outreach-vs-automated-tools
/blog/measuring-link-building-roi
/blog/most-effective-link-building-tactics
/blog/moz-link-explorer-guide
/blog/outreach-response-rate-optimization
/blog/paid-vs-organic-link-building
/blog/parasite-seo-and-link-building
/blog/personalization-in-link-outreach
/blog/proving-link-building-value-to-stakeholders
/blog/quantity-vs-quality-backlinks
/blog/semrush-link-building-features
/blog/tiered-link-building-strategy
/blog/top-haro-alternatives-for-link-building
/blog/topical-authority-and-backlinks
/blog/tracking-link-building-progress
/blog/types-of-backlinks-complete-list
/blog/understanding-link-relevance
/blog/what-are-backlinks
/blog/what-makes-a-high-quality-backlink
/blog/when-to-disavow-backlinks
/blog/white-label-link-building-guide
/blog/why-your-link-building-isnt-working
/blog/youtube-link-building-strategies
/blog/zero-to-dr50-link-building-journey
```

#### `comparisons` (20 routes)

```text
/comparisons
/comparisons/ahrefs-alternatives
/comparisons/ahrefs-vs-moz
/comparisons/ahrefs-vs-semrush-link-building
/comparisons/buzzstream-alternatives
/comparisons/buzzstream-vs-pitchbox
/comparisons/content-marketing-vs-link-building
/comparisons/guest-posting-services-compared
/comparisons/guest-posts-vs-niche-edits-full-comparison
/comparisons/hunter-vs-snov-io
/comparisons/in-house-vs-outsourced-link-building
/comparisons/link-building-agencies-compared
/comparisons/majestic-alternatives
/comparisons/manual-vs-automated-outreach
/comparisons/moz-alternatives
/comparisons/niche-edit-services-compared
/comparisons/outreach-vs-paid-links
/comparisons/pitchbox-alternatives
/comparisons/semrush-alternatives
/comparisons/semrush-vs-moz
```

#### `digital-pr` (6 routes)

```text
/digital-pr
/digital-pr/creative-campaigns
/digital-pr/data-studies
/digital-pr/journalist-outreach
/digital-pr/newsjacking
/digital-pr/press-release-links
```

#### `glossary` (76 routes)

```text
/glossary
/glossary/anchor-text
/glossary/backlink
/glossary/backlink-monitoring
/glossary/blogger-outreach
/glossary/broken-link-building
/glossary/business-directory
/glossary/citation-building
/glossary/competitor-backlink-analysis
/glossary/connectively
/glossary/content-syndication
/glossary/contextual-link
/glossary/contributor-post
/glossary/curated-links
/glossary/deep-link
/glossary/disavow-file
/glossary/dofollow-link
/glossary/domain-authority
/glossary/editorial-link
/glossary/ego-bait
/glossary/expert-roundup
/glossary/follow-vs-nofollow
/glossary/footer-link
/glossary/geo-targeted-links
/glossary/google-disavow-tool
/glossary/guest-blogging
/glossary/haro-link-building
/glossary/homepage-link
/glossary/influencer-outreach
/glossary/link-bait
/glossary/link-building-outreach
/glossary/link-diversity
/glossary/link-equity
/glossary/link-equity-flow
/glossary/link-farm
/glossary/link-gap-analysis
/glossary/link-growth-rate
/glossary/link-hoarding
/glossary/link-insertion
/glossary/link-juice
/glossary/link-profile
/glossary/link-reclamation
/glossary/link-roundup
/glossary/link-scheme
/glossary/link-spam
/glossary/link-velocity
/glossary/linkable-asset
/glossary/local-link-building
/glossary/lost-backlinks
/glossary/manual-action
/glossary/moving-man-method
/glossary/nap-consistency
/glossary/native-advertising
/glossary/new-backlinks
/glossary/niche-edit
/glossary/nofollow-link
/glossary/page-authority
/glossary/pagerank
/glossary/pagerank-sculpting
/glossary/pbn
/glossary/penalty-recovery
/glossary/reciprocal-link
/glossary/referring-domain
/glossary/resource-page-link-building
/glossary/sidebar-link
/glossary/sitewide-link
/glossary/skyscraper-technique
/glossary/spammy-backlinks
/glossary/sponsored-content
/glossary/sponsored-link
/glossary/three-way-link-exchange
/glossary/toxic-backlinks
/glossary/trust-flow
/glossary/ugc-link
/glossary/unlinked-mention
/glossary/web-directory
```

#### `guides` (15 routes)

```text
/guides/anchor-text-optimization-guide
/guides/backlink-analysis-guide
/guides/broken-link-building-guide
/guides/complete-guide-to-guest-posting
/guides/content-that-attracts-backlinks
/guides/digital-pr-link-building-guide
/guides/domain-authority-guide
/guides/ecommerce-link-building-guide
/guides/haro-mastery-guide
/guides/link-building-outreach-guide
/guides/link-building-strategies-guide
/guides/link-building-tools-guide
/guides/local-link-building-complete-guide
/guides/saas-link-building-playbook
/guides/what-are-backlinks-complete-guide
```

#### `industries` (12 routes)

```text
/industries
/industries/b2b
/industries/crypto
/industries/ecommerce
/industries/enterprise
/industries/fintech
/industries/healthcare
/industries/legal
/industries/local-business
/industries/real-estate
/industries/saas
/industries/travel
```

#### `link-building` (10 routes)

```text
/link-building
/link-building/agency-vs-in-house
/link-building/avoid-black-hat
/link-building/content-that-earns-links
/link-building/how-to-start
/link-building/link-building-pricing
/link-building/linkable-assets
/link-building/outreach-strategy
/link-building/roi
/link-building/white-hat
```

#### `link-building-tactics` (9 routes)

```text
/link-building-tactics
/link-building-tactics/broken-link-building
/link-building-tactics/guest-posting
/link-building-tactics/haro-alternatives
/link-building-tactics/link-reclamation
/link-building-tactics/original-research
/link-building-tactics/resource-page-links
/link-building-tactics/skyscraper-technique
/link-building-tactics/unlinked-mentions
```

#### `outreach` (5 routes)

```text
/outreach
/outreach/email-templates
/outreach/follow-up-strategy
/outreach/prospecting
/outreach/relationship-building
```

#### `resources` (19 routes)

```text
/resources
/resources/audit-checklist
/resources/backlink-audit-template
/resources/competitor-analysis-template
/resources/competitor-gap-template
/resources/content-promotion-checklist
/resources/free-seo-tools-list
/resources/guest-post-pitch-templates
/resources/link-building-checklist
/resources/link-building-spreadsheet-templates
/resources/link-building-tools-comparison
/resources/link-prospect-qualification-checklist
/resources/link-quality-checklist
/resources/link-quality-scorecard
/resources/outreach-email-templates
/resources/outreach-quality-checklist
/resources/outreach-templates
/resources/prospecting-spreadsheet
/resources/roi-calculator
```

#### `statistics` (10 routes)

```text
/statistics
/statistics/anchor-text-statistics
/statistics/backlink-statistics
/statistics/content-marketing-roi-statistics
/statistics/domain-authority-statistics
/statistics/guest-posting-statistics
/statistics/link-building-pricing-statistics
/statistics/link-building-statistics-2026
/statistics/outreach-response-rate-statistics
/statistics/seo-industry-statistics
```

#### `strategies` (21 routes)

```text
/strategies
/strategies/agency-case-study-links
/strategies/agency-tool-links
/strategies/b2b-industry-publication-links
/strategies/b2b-partnership-links
/strategies/b2b-thought-leadership-links
/strategies/ecommerce-influencer-links
/strategies/ecommerce-product-link-building
/strategies/ecommerce-supplier-links
/strategies/local-citation-building
/strategies/local-press-coverage
/strategies/local-sponsorship-links
/strategies/resource-page-link-building-guide
/strategies/saas-content-marketing-links
/strategies/saas-digital-pr
/strategies/saas-guest-posting
/strategies/scholarship-link-building
/strategies/service-business-local-links
/strategies/startup-community-links
/strategies/startup-investor-pr-links
/strategies/startup-launch-links
```
