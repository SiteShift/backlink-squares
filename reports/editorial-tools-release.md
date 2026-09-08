# Editorial design and free-tool release

Implemented 8 September 2026.

## Editorial experience

Removed the second identical bundle promotion at the end of blog articles. Added a dedicated right sidebar containing a compact bundle offer and a separate $1 sponsored-square card. Blog, guide, hub and cluster layouts share these offers. Mobile shows one dismissible card after 650 pixels of scrolling, hides it near the footer, and respects reduced-motion preferences.

Blog heroes now use a single editorial label rather than keyword badges, wider readable title/description columns and separated author/date/read-time metadata. The free-checker hero description now matches the actual editorial content, without invented product-testing claims. Added spacing for fixed navigation.

MDX headings are ordinary text while retaining fragment IDs. Table of contents shows only H2 sections, starts collapsed and bounds the expanded list. It observes streamed content so the list remains available when headings arrive after hydration. Removed the stacked left navigation columns in hubs and clusters; topic links remain in the main related-reading sections. Restored the original Lucide Flame SVG icon in the limited-time banner.

## Free tools

All nine tools are fully client-side and have no paid API or LLM calls. No new external service, account, subscription or credential is required. Existing website hosting remains in use.

| URL | Working scope |
|---|---|
| `/tools/outreach-templates` | Six scenario-specific editable drafts, copy and text download; no email sending |
| `/tools/link-prospect-finder` | Eight topic-specific manual Google searches, CSV export; not verified prospect discovery |
| `/tools/link-velocity` | Monthly CSV new/lost/net calculations, chart and export; not automatic competitor tracking |
| `/tools/gsc-links-analyzer` | English Top linking sites export analysis and duplicate consolidation; not every GSC report type |
| `/tools/backlink-gap` | Supplied hostname-list comparison with export; subdomains remain distinct |
| `/tools/anchor-text-analyzer` | Descriptive anchor classifications, counts and shares; no invented safe ratios |
| `/tools/pagerank-calculator` | Directed-graph probability calculation with damping and dangling-node handling; no live Google score |
| `/tools/link-inspector` | Pasted HTML link/anchor/rel extraction with target-hostname filtering; no live HTTP checking |
| `/tools/disavow-validator` | Explicit rule validation, deduplication and text download; no automatic selection or submission |

Each tool includes examples, input/error handling, useful result exports, a server-rendered explanation, canonical metadata, WebApplication structured data, related reading and bundle promotion. All new routes are included in XML and HTML sitemap discovery. Existing articles link to relevant tools. The tools index contains no Coming Soon entries.

The HTML inspector is intentionally named and described as a snapshot tool. No paid data or simulated authority metrics substitute for a live backlink index. Drafts and uploads are not sent to an AI service. Search queries leave the page only when the visitor follows a Google search link.

## Additional correction

The existing ROI calculator incorrectly treated month-12 additional revenue as annual additional revenue. It now sums gains across the twelve modelled months and finds the first month where cumulative gains cover cumulative spending. Its per-link growth input is explicitly an assumption, not an industry benchmark. Corrected the remaining unsupported thousands-of-campaigns claim in the outreach-template resource.

## Verification

- Production compilation and TypeScript passed.
- ESLint passed.
- Calculation regressions cover quoted CSV, formula-safe export, negative numeric preservation, missing/duplicate months, set differences, anchor shares, GSC duplicates/zero totals, PageRank normalisation and disavow syntax.
- ROI regressions check the annual sum and no-growth scenario.
- All nine tools were exercised with example inputs through actual browser buttons. Expected summaries and outputs were inspected.
- Text and CSV download controls produced files; download inspection identified and corrected numeric preservation for negative changes.
- Browser layouts inspected at 320, 390 and 1440 pixels. No page-level horizontal overflow observed on checked tool/article layouts. Mobile promotion appearance and dismissal passed.
- Full production crawl: 362 URLs, zero status/metadata/schema failures, zero broken links, zero pages unreachable from the homepage.
- Discovery regression checks passed for Markdown, missing-page status, private downloads, robots and redirects.

No live payments were made. Search rankings, conversion improvement and production deployment completion are not established by local tests. The new tools do not offer live backlink discovery, paid metrics, automated outreach sending or invented industry benchmarks.
