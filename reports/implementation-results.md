# SEO and conversion release results

Verified 2026-09-08 against the local production build.

## Delivered

- Next.js 16.3.4 / React 19 migration, compatible packages and async request APIs. `npm audit` reports zero known vulnerabilities across production and development dependencies.
- Initial grid reduced from 1,000 to 50 squares, with progressive loading and the complete purchased-site directory still server rendered. Homepage HTML fell from 1,002,993 bytes in the live baseline to approximately 293 KB (about 71% smaller). This is a response-size comparison, not a field Core Web Vitals result.
- Bundle promoted ahead of the grid and throughout content templates, with 276-entry/9-column deliverable, an actual five-row CSV sample, clear eligibility/fee limitations and no invented discounts or guaranteed outcomes.
- Existing Stripe price verified read-only: active, GBP 1149 minor units, one-time. Checkout retry messaging, non-PII interest/checkout events, bundle webhook acknowledgment and input validation regressions covered.
- Grid controls named; nested interactive CTAs removed; essential content visible without entrance animation; fixed banner dimensions; article table rendering; reduced-motion support; modal naming, focus containment and close controls.
- GSC priority articles refreshed: Moz Link Explorer, Ahrefs vs Moz, free checker roundup and PageRank. New database evaluation guide and downloadable templates index. Publisher attribution replaces unsupported staff biographies. Unverifiable statistics replaced with transparent measurement methods; illustrative campaigns labeled; duplicate statistics article consolidated with a permanent redirect.
- Accurate update-date handling, canonical titles, safe JSON-LD serialization, organization support contact, full HTML sitemap and all-public-page reachability.
- llms.txt, agents.md, index.md, editorial Markdown alternatives, explicit response types and real 404 recovery. Paid full-file downloads remain protected; serverless tracing includes the private deliverable and public editorial source files.

## Verification

- Production build: passed.
- ESLint: passed without errors or warnings.
- Checkout regression script: malformed/duplicate coordinates and unsafe URL schemes rejected before database access; signed bundle event bypasses grid fulfillment.
- Rendered crawl: 353 sitemap URLs, zero status/metadata/schema failures, zero broken internal destinations, zero pages unreachable from the homepage.
- Discovery tests: public Markdown and content type, homepage alternate Link header, robots policy, unknown routes, unknown articles, private file denial, missing download session and permanent consolidation redirect passed.
- Sample: exactly the first five records from the paid file with all nine columns.
- Browser: homepage/grid selection and loading, mobile navigation/Escape, bundle failure message, article table layout, templates page, purchase form. Tested at 320, 390 and 1440 pixel widths where relevant; no observed horizontal page overflow. Bundle content and sample link remain readable with application scripts blocked.
- Final npm audit: zero vulnerabilities. Detailed machine-readable reports accompany this file.

## Deliberate boundaries

No live charge was made and no paid customer download session was reused. Completed-payment delivery should also be exercised with a Stripe test-mode purchase in the deployment environment. Stripe is the revenue source of truth; a checkout redirect is not a sale. Analytics collection depends on the deployed analytics configuration.

Markdown uses explicit URLs, not Accept-header negotiation or user-agent switching. Therefore no `Vary: Accept` claim is made. Google does not require llms.txt or special AI schema for AI search eligibility. No fabricated postal address, authority profile, rating, autonomous API, WebMCP tool or ARD capability was added for a scanner score.

Not every statement in the historical 336-document library was independently re-researched. This release corrects identified unsupported evidence and priority search-intent problems, and applies technical fixes across the whole library. The old plan's hypothetical managed-service pages and numerical ranking targets are not implemented products or guaranteed outcomes.

## After GitHub deployment

Implementation pushed to `origin/main` on 2026-09-08, with local and remote commit verified as `25bdd32d4ed8746a6fd08d4a7ec6896e7a51b8ff`. This records GitHub delivery, not confirmation of a completed production deployment.

Verify the live bundle, /templates, /llms.txt, /index.md and /sitemap.xml before submitting the sitemap. Use URL Inspection on the bundle, Moz guide and comparison page. Compare equivalent GSC time windows and track Stripe purchases separately from CTA events. Field performance and ranking changes require post-deployment data; these tests do not establish future search positions or revenue gains.
