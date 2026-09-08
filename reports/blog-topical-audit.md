# BacklinkGrid blog and site SEO audit — 9 September 2026

## Scope and method

Inventoried the full source of all 104 existing blog articles, their headings, metadata, internal links, source links and claim-review candidates. Added three focused guides, bringing the library to 107. The reproducible, per-article inventory is `reports/blog-map-audit.json`; run `node scripts/blog-map-audit.cjs` to refresh it. This covers every blog, rather than a sample of article URLs.

The source inventory is not independent verification of every assertion. Percentage and first-person flags are triage signals, not proof that a statement is wrong. Manually reviewed and corrected the high-risk passages described below. Whole-site validation covers all sitemap pages in rendered HTML and the internal link graph; it cannot establish Google's actual indexing decisions or independently validate every third-party publisher's current terms.

Inputs: the supplied Search Console query/page exports; repository content and templates; qualitative live searches; official Google, Ahrefs and publisher documentation. No paid keyword-volume data, invented search volumes or inferred keyword difficulty scores were used. The supplied GSC snapshot is historical, not a fresh connected report.

## What the topical map shows

| Topic | Existing blogs | After this pass | Primary hub | Editorial role |
| --- | ---: | ---: | --- | --- |
| Fundamentals | 13 | 13 | /backlinks | Definitions, attributes, authority metrics and relevance |
| Research, tools and maintenance | 10 | 13 | /backlink-audit | Investigate a real URL, interpret reports and preserve placements |
| Quality and search policies | 9 | 9 | /backlink-quality | Review acquisition practices and diagnose risk |
| Outreach and digital PR | 13 | 13 | /digital-pr | Select publishers, pitch a contribution and manage follow-up |
| Content and link earning | 14 | 14 | /link-building-tactics | Assets, relationships and distribution |
| Business types and page goals | 16 | 16 | /industries | Adapt work to a business model or destination |
| Planning and measurement | 29 | 29 | /link-building | Priorities, execution, budgets and outcomes |

The site already has considerable breadth: fundamentals, strategy, tactics, sectors, outreach and provider comparisons are covered. The main gap was the transition from general advice to source-level evidence and maintenance. Another broad “ultimate link building strategy” article would overlap the existing library rather than add a distinctive answer.

The former archive presented 104 cards without a useful topic structure. Replaced it with seven server-rendered topic sections, compact article lists, topic-hub links and three featured practical checks. Every article remains directly linked in HTML. The grouping is an editorial heuristic based on each slug; it is not a claim that Google classifies pages into these exact categories.

## GSC priorities and search intent

The supplied page export contains these useful signals:

| Page | Impressions | Clicks | Average position | Implication |
| --- | ---: | ---: | ---: | --- |
| Moz Link Explorer guide | 1,216 | 0 | 17.1 | Strengthen practical research and interpretation paths around an existing visibility signal |
| Ahrefs vs Moz | 427 | 0 | 17.8 | Keep provider metrics and report scopes clear; connect research with verification |
| Best free backlink checkers | 158 | 0 | 22.3 | Support task-specific comparison, avoid unsupported product accuracy claims |
| PageRank glossary | 826 | 0 | 94.8 | Broad interest but distant visibility; not the sole near-term content priority |
| Free checker launcher | 418 | 0 | 75 | Align the promise with the actual launcher and direct source-checking tools |
| Bundle | 45 | 0 | 8 | Preserve relevant routes from research content to the offer; the sample is too small to diagnose conversion causally |

Average position is not a fixed rank and impressions are not search volume. These numbers suggest where to focus; they do not establish that titles alone caused the missing clicks. Searches for missing Search Console links, migration preservation and placement verification supported distinct task intents. No particular traffic or ranking outcome is promised.

## Three gaps filled

### 1. A live backlink is missing from Search Console

Published `/blog/backlinks-not-showing-google-search-console`.

This is a troubleshooting page, distinct from the existing general GSC guide. It separates a live source check from report inclusion, property scope, canonical grouping and indexing evidence. Includes a decision table, a worked URL example, an evidence worksheet and a proportionate escalation process. Links to Google's report documentation, the GSC export analyser and live placement checker.

### 2. Existing links need to survive a migration

Published `/blog/preserve-backlinks-website-migration`.

Covers old-to-new URL mapping by reader intent, redirect evidence, final-page validation, ownership of old infrastructure and post-launch exceptions. Includes a downloadable migration map and avoids promising that redirects guarantee retained rankings. Connects technical maintenance to the backlink audit hub.

### 3. A publisher says a backlink is live

Published `/blog/verify-backlink-placement`.

Explains exact source and destination checks, anchor text, sponsored/nofollow attributes, inconclusive fetches, browser-only rendering and monitoring scope. Includes a downloadable placement check sheet and a consistent status vocabulary. Connects the actual live checker to a useful workflow.

Both CSV templates include an illustrative row and a final contextual bundle link. They are listed on `/templates`. The new articles are discoverable through the blog archive, related reading, established GSC/Moz articles, the audit hub, sitemap and llms.txt. They do not require JavaScript to read.

## Credibility corrections and refreshes

Preserved existing URLs to avoid unnecessary migrations and keep incoming links intact.

- **Google link spam update:** removed the unsupported January 2026 rollout, impact percentages and claimed internal detection mechanisms. Replaced with official-source diagnosis, manual-action distinctions and evidence-led remediation. Added an explicit editorial correction.
- **100 backlinks in 30 days:** replaced an undocumented first-person success story with a capacity-based campaign plan. Its arithmetic is labelled hypothetical; no invented acquisition or traffic outcomes.
- **Zero to DR 50:** removed the undocumented journey and false DR-to-ranking thresholds. Replaced with a measurement framework that distinguishes vendor metrics from business outcomes.
- **Guest posting sites:** removed the unsupported 67-site verification claim, personal-pitch claim, monthly DA updates, guaranteed link types and acceptance rates. Replaced with two official editorial routes, dated source checks and a practical qualification process. These publications are not guaranteed placements.
- **Agency roundup:** replaced an unsupported ranked review with a due diligence brief, source-page inspection, pilot acceptance criteria and case-study evaluation.
- **Most effective tactics:** removed unsourced effectiveness ratings and performance benchmarks. Reframed the page around resources, fit and measurement.
- **Manufacturing, original research, topical authority, digital assets and AI articles:** replaced unsupported embedded success stories with explicitly proposed workflows. Removed invented outcomes rather than merely adding a disclaimer below them.
- **Quality vs quantity:** removed an unsupported table equating DR bands to ranking impact and link persistence.
- **Anchor guidance:** removed universal “safe” percentage recipes from quality and mistakes articles, and a prescribed homepage/deep-link ratio from the backlink-types article.
- **SaaS scenario:** corrected text contradicting its existing hypothetical-scenario disclosure. The ecommerce scenario was already disclosed as hypothetical in the baseline; no new claim of a verified client result was introduced.
- **Future of link building:** removed the reference treating the fabricated update as established evidence.
- **Moz and GSC guides:** added contextual paths into source-level verification and report troubleshooting.

Publication dates are retained where practical and lastUpdated changes only on edited content. No new fictional author, testimonial, measurement dataset or review rating was added.

## Internal linking and overlap decisions

Related posts now prioritise explicitly selected relevant articles, then topic fit, then meaningful keyword matches. Generic “SEO,” “backlinks” and “link building” tags no longer dominate relevance by themselves. Each blog also links to its topic hub and topic section of the archive.

The lexical overlap report is deliberately a candidate list, not an automatic redirect instruction:

- General GSC report use and missing-link troubleshooting have different jobs; cross-link them and preserve both.
- SaaS and ecommerce planning scenarios share a format but address different business models.
- Generic “strategies that work” wording creates false-positive overlap between LinkedIn, affiliate and product-page articles. Their destination/audience intent differs.
- The broader strategy hub and strategy blogs should continue to have distinct roles: hub navigation versus a specific planning task. Do not mass-canonicalise distinct useful pages to the hub.

No article was deleted solely for keyword overlap, and no blanket canonical or noindex policy was introduced.

## Site-level issues addressed

- Rebuilt blog browsing with real HTML links and compact topic navigation.
- Fixed top spacing on the rebuilt pages so the fixed header does not cover the introduction.
- Kept article headings readable and existing desktop/mobile offer components intact.
- Rebuilt the older checker launcher: removed fabricated star ratings, stale hard-coded free export limits, an unsupported “most accurate” claim and a defunct-looking unlimited-export proposition. Clearly separates a provider launcher from the site's actual live checking tool.
- Corrected public “dofollow” grid sales copy to match the actual sponsored links; kept the £11.49 bundle and $1 grid paths prominent.
- Updated sitemap dates for changed static pages and kept content dates source-driven.
- Expanded llms.txt with the new maintenance workflows. This is a discovery aid, not a Google or AI ranking guarantee.
- Retained real 404s, canonical HTML references, Markdown alternates and protected paid-download boundaries; checked these during verification.

## Conversion rationale

The new guides attract visitors with concrete link-building work to do. Relevant tool links help them complete that work; contextual bundle links then offer a maintained research starting point instead of a generic advertisement unrelated to the article. Downloadable worksheets carry a useful return route to the product.

Clear statements about what the bundle contains and what the grid delivers reduce mismatched expectations. Removing invented proof makes the purchase decision more credible. These are conversion hypotheses, not observed revenue increases. No new paid infrastructure, data API or subscription was introduced.

## Measurement after release

Compare similar 28-day periods after Google has had time to recrawl. Monitor the three new URLs and refreshed research pages separately. Review query/page combinations, impressions, clicks and average position; do not confuse broad exposure with qualified traffic.

For commercial performance, compare article-to-bundle visits, template-origin visits and completed purchases using the site's available analytics and checkout records. Separate traffic growth from changes in conversion rate. Annotate the release date and later pricing/content changes so the comparisons remain interpretable.

The remaining library should be refreshed when evidence or business priorities justify it. The final inventory still flags 88 blogs without external source links; a missing source link alone is not a technical error, but numerical and time-sensitive assertions deserve continuing editorial review. This audit does not certify every assertion across the entire historical library.

## Verification

See `reports/rendered-crawl.json`, `reports/crawl-pages.json`, `reports/internal-link-candidates.json` and the verification addendum below for the completed run. The crawler checks every sitemap URL for HTTP status, one H1, canonical consistency, a description, no unintended noindex and parseable JSON-LD, then checks internal destinations and homepage reachability.

### Completed verification — 9 September 2026

- Production build and TypeScript: passed, 380 generated routes (including non-sitemap routes).
- ESLint: passed.
- Checkout, browser-tool calculation and scanner regression suites: passed.
- Source content audit: 339 MDX pages, zero unresolved internal content links.
- Full production HTML crawl: 371 sitemap URLs, zero status/H1/canonical/description/noindex/JSON-LD failures, zero broken internal destinations, zero sitemap pages unreachable from the homepage.
- Discovery checks: public Markdown, canonical alternates, real missing-page statuses, protected paid CSV and consolidation redirect passed.
- Browser verification: desktop archive at 1440px; archive, article reading and checker form at 390px. No horizontal page overflow in these checks. Verified URL normalisation, four generated provider destinations, and invalid-input recovery.
- CSV files: both parse into three rows of ten columns, including a bundle link in the final row.
- Blog archive HTML: 447,646 baseline bytes → 219,675 bytes (approximately 51% smaller). This is raw HTML payload, not a measured Core Web Vitals improvement.
- `git diff --check`: passed.

No paid checkout was performed, no private bundle data was included in the new downloads, and no paid service was added. Production deployment and search-engine recrawl are separate from the local production verification above.

Final visual refinement: shared MDX tables now keep readable minimum column widths inside a keyboard-focusable horizontal scroll region. This fixes words splitting into narrow vertical fragments on mobile without overflowing the page. Removed an unsupported fixed research-time saving from the ROI-page bundle copy.

The production browser check identified a CSS-build configuration bug: Tailwind's content paths omitted the root `mdx-components.tsx`. Added that renderer to the scan paths so its table widths and other utility classes are included in the built CSS. Verified the generated styles and contained mobile table after rebuilding.
