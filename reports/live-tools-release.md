# Live website tools release

Implemented 9 September 2026.

## Delivered

Removed the requested eyebrow, sample link and post-checkout sentence from the article sidebar bundle card. The bundle title, description and purchase button remain.

Added six website tools and promoted them on `/tools`:

| Route | Implemented behaviour |
| --- | --- |
| `/tools/backlink-opportunity-finder` | Reads the homepage and matches the selected business type/budget against an explicit 18-channel free selection. Returns up to five channels with eligibility, cost caveats and submission instructions. The paid 276-row CSV is not shipped to the client. |
| `/tools/live-backlink-checker` | Fetches a known source page and extracts target-domain links, anchors, rel attributes and redirects. Device-local saved history; optional five-minute visible-tab rechecks with change notices. Inconclusive fetches do not establish link removal. |
| `/tools/internal-link-finder` | Samples up to 12 pages using homepage and bounded sitemap discovery, prioritises relevant paths, finds existing passages, excludes existing contextual links and exports link HTML. Does not edit the scanned site. |
| `/tools/broken-link-finder` | Samples 12 pages and checks up to 40 destinations. Distinguishes confirmed 404/410 from redirects, other HTTP errors, robots blocks and timeouts. |
| `/tools/crawlability-checker` | Checks raw HTML, canonical declarations, noindex, redirects, sitemap conflicts and parsed policies for Googlebot and several AI crawlers. Does not confirm Google indexing or execute JavaScript. |
| `/tools/competitor-backlink-finder` | Discovers English Wikipedia and Hacker News references, accepts up to ten additional source URLs, checks up to 12 source candidates. Wikipedia/custom URLs are checked in HTML; HN story URLs are verified using its official public API. HN does not supply HTML rel attributes or discussion-page gap evidence. |

Competitor coverage is deliberately disclosed. This is not a replacement for a licensed web-wide backlink index, and page-level absence is not proof of a domain-level gap. No commercial backlink API was added.

## Cost and operating boundaries

No paid API, account, subscription, database service, cron service or hosting-plan upgrade was purchased or provisioned. Existing application hosting performs requests, so this release does not establish zero hosting consumption at arbitrary traffic levels. Scans are bounded, rate-limited and cancellable. Monitoring stops when the tab closes; there is no unattended email scheduler.

The scanner uses free open-source Cheerio, robots-parser and ipaddr.js. Requests allow only public HTTP(S) addresses and standard ports. DNS answers are checked and sockets pinned to validated addresses, including on redirects. Responses are limited to 1 MB and four redirects, with request deadlines. Robots policy failures are conservative; sites with crawl delays are skipped by the HTML scanner. The official HN API is used for HN story verification rather than bypassing its HTML crawl delay.

The API requires a same-origin browser request and custom header, bounds the input body, caps concurrent work per instance and limits requests per IP per instance. These in-memory controls are not a distributed billing guarantee. Page cache: five minutes. Robots cache: ten minutes. Public discovery cache: fifteen minutes. No raw page scripts execute.

## UX, SEO and conversion

Short forms, visible progress and cancellation, readable result lists, responsive layouts, CSV exports, and a contextual bundle purchase offer. CSV exports end with a bundle link. The tools hub prioritises the six live tools and groups the existing browser utilities separately. Canonical metadata, free WebApplication structured data, static explanations, relevant reading links, sitemap discovery and llms/agent documentation are included. Relevant editorial pages link to the tools. Privacy copy describes live fetching, public API queries and local monitoring history.

## Verification

- Production build and TypeScript passed.
- ESLint and scanner regressions passed. Tests cover private address encodings, IP ranges, URL constraints, robots rules, extraction, header H1 preservation, target filtering before extraction limits, inconclusive states, existing contextual links, matching and rate limits.
- Existing checkout and browser-tool/ROI regressions passed.
- Dependency audit: zero production vulnerabilities.
- Actual browser runs: opportunity matches, live backlink evidence, saved check, internal-link suggestion and competitor verification. Mobile width checks at 320 and 390 pixels, desktop at 1440 pixels.
- Full live runner exercised internal, audit, broken and competitor scans; the broken-link run checked 40 destinations. Production endpoint checks rejected a loopback address and a robots-disallowed URL and returned a real external 404 as HTTP evidence.
- Full production sitemap crawl: 368 pages, no metadata/status failures, no broken internal links and no pages unreachable from the homepage.
- Public discovery, Markdown, private-file protection and missing-page regressions passed.

No live payments were made. Deployment completion, rankings and conversion uplift are not established by local tests.
