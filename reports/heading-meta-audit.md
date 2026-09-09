# Site-wide H1, title and description audit — 9 September 2026

## Scope

Collected the rendered H1, title tag, meta description, canonical and robots metadata for all 371 sitemap URLs before editing. Every indexable page is included in `heading-meta-before.json`; the final rendered inventory is `heading-meta-audit.json`. This includes the homepage, product pages, all 107 blogs, hubs and clusters, glossary entries, industry pages, comparisons, statistics, resources and tools. Transactional success routes and missing-page screens are not SEO landing pages and were not rewritten for search traffic.

Source-level before/after edits for 142 editorial pages are recorded in `heading-meta-edits.json`. Static page changes are reflected in the rendered comparison. Preserved useful headings and descriptions instead of changing them just to reach an arbitrary character target.

## Initial findings

- 371 pages had one H1, a title and a description.
- No duplicate title tags or H1s.
- One exact duplicated description shared by the SaaS and ecommerce illustrative campaign articles.
- Several marketing-led H1s did not identify the page's actual subject, particularly the tools library, blog archive and checker launcher.
- The educational backlink checklist called itself an “Analyzer” despite not fetching a visitor's backlink profile.
- Several titles repeated “complete guide,” lengthy benefit claims or entire explanatory subtitles that reduced scanability.
- Some snippets promised safe anchor ratios, first-hand testing, proven results, an inside view of Google's algorithm or fixed outcomes without adequate support.
- The strategy guide title claimed “I Use #3 Daily.” That claim was not appropriate for the team-authored guide.
- Statistics descriptions repeated the same boilerplate with only the topic substituted. Rewrote them around their actual calculations and reporting tasks.
- Connectively metadata oversimplified the platform's relationship to HARO. Checked current official history and added a dated clarification, rather than incorrectly declaring the revived brand inactive.

## Decision criteria

A good H1 immediately identifies the subject or task, accurately reflects the page and remains readable at mobile widths. A title should be unique, concise and distinguish the page from related content. A description should tell the searcher what useful information or function is available, with important details early.

Character counts were review prompts, not pass/fail SEO laws. Google may select different title-link text or snippets. Its documentation recommends descriptive, accurate titles and notes that snippets are truncated according to the display rather than a fixed description character limit:

- [Google title-link guidance](https://developers.google.com/search/docs/appearance/title-link)
- [Google snippet guidance](https://developers.google.com/search/docs/appearance/snippet)

No keyword-volume estimates, ranking forecasts or fabricated research were added.

## Protected headings

The homepage hero source, the bundle H1, “Get Your Backlink in 3 Simple Steps” and “SEO & Link Building Glossary” were left unchanged. The current blog archive had a different marketing headline, so restored the user's requested “SEO & Link Building Insights.” The protected phrase “Complete Backlink Database Bundle” also remains the promotion's product name.

The quoted “Less spreadsheet work. More useful next steps.” was not present in the current checkout; the tools index instead had the equally vague “Your website. Your next useful finding.” That actual H1 was replaced with “Free SEO & Link Building Tools.”

## Representative improvements

| Page | Before | After | Reason |
| --- | --- | --- | --- |
| /tools H1 | Your website. Your next useful finding. | Free SEO & Link Building Tools | States the subject and free tool offering |
| /blog H1 | Build better links. Know what to check next. | SEO & Link Building Insights | Restores the user's preferred heading |
| /tools/backlink-analyzer H1 | Backlink Profile Analyzer | Backlink Audit Checklist | Matches the educational checklist's actual function |
| /pricing H1 | Simple, Transparent Pricing | Backlink Placement Pricing | Names what the price applies to |
| /guides H1 | In-Depth SEO Guides | SEO & Link Building Guides | Identifies the library's focus |
| /guides/link-building-strategies-guide title | 27 Link Building Strategies That Work in 2026 (I Use #3 Daily) | Link Building Strategies: A Practical Campaign Guide | Removes unsupported first-person proof |
| /backlinks/anchor-text-ratios title | Anchor Text Ratios: Optimal Distribution & Benchmarks [2026] | Anchor Text Ratios: Analysis Without Safe-Percentage Myths | Stops implying a universal safe ratio |
| /blog/how-google-evaluates-backlinks title | How Google Evaluates Backlinks: Inside the Algorithm | How Google Evaluates Backlinks: Signals & Limitations | Avoids claiming access to private systems |
| /tools/roi-calculator title | Link Building ROI Calculator - Calculate Your Backlink Investment Returns | Free Link Building ROI Calculator: Model Campaign Returns | Clarifies that outputs are scenario estimates |

Blog, strategy and industry headings now front-load the subject and use shorter task-specific subtitles. Existing URLs, canonical destinations and page relationships remain intact. Metadata continues to flow through the existing Next.js helpers so Open Graph and Twitter titles/descriptions use the same values as the page metadata.

## Promotion redesign

Replaced the long repeated promotional copy with a compact charcoal panel using the site's yellow accent. The layout has the exact product name, a short description of the CSV, a visual 276-opportunity count with a spreadsheet icon, the £11.49 one-time price and one button.

Removed the redundant introductory label, second marketing headline, sample link, separate grid link and paragraph of conditions from this component. Product details and purchase terms remain available on the bundle page; existing article offer components still provide a grid-placement route. No acceptance, ranking, revenue or time-saving claim was added.

The promotion is server-rendered, uses no new dependency and needs no client JavaScript. It supports compact and standard variants, wraps its price/button on small screens, retains the existing conversion marker, and gives the button a clear hover/focus treatment with reduced-motion support.

## Verification plan and completed evidence

- Compare all 371 rendered pages before and after, including protected H1 assertions, uniqueness and missing-field checks.
- Check full-site canonical/indexability/internal-link behavior after metadata and shared-component changes.
- Build and lint the complete site.
- Inspect the promotion in the actual article layout at desktop and narrow mobile widths, checking overflow and the bundle destination.
- Run the content link audit and keep the existing checkout and tool behavior unchanged.

Final measured counts and results are appended after verification. This audit improves relevance and accuracy; Google indexing, title/snippet selection, rankings and conversions remain outcomes to measure after release.

## Rendered results

The full comparison found changes on 151 pages: 110 H1s, 114 title tags and 92 meta descriptions. The before/after diff is recorded in `heading-meta-rendered-changes.json`. All 371 rendered pages have exactly one H1, a title and a description; no exact duplicate H1s, titles or descriptions remain. None triggered the audit's title-over-65 or description-outside-90–175 character review bands, though those bands are not search-engine requirements.

Protected-heading assertions passed for `/`, `/bundle`, `/how-it-works` and `/glossary`; `/blog` renders exactly “SEO & Link Building Insights.” The protected hero/component source files have no diff.

Production build, TypeScript, lint and the source content audit passed. The full 371-page crawl found no canonical/indexability/JSON-LD failures, no broken internal links and no sitemap pages unreachable from the homepage. Metadata-only changes preserve page URLs and internal destinations.

The desktop and 320px mobile promotion were inspected in a real browser. The single action points to `/bundle` and retains `data-conversion="bundle_content"`. The mobile refinement gives the product name the full panel width and suppresses the existing floating offer while the inline card is in view; the floating offer remains available elsewhere in the article. The audit checklist's structured application name and breadcrumb now match its revised H1.

Changes to lastUpdated reflect the heading/description review, not a claim that every historical body assertion was independently reverified. No paid service, dependency, API, purchase flow or homepage-hero change was introduced.
