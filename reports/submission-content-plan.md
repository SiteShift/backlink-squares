# Submission content expansion — 9 September 2026

## Intent and publishing decisions

Build a connected, evidence-led submission workflow rather than another generic backlinks hub. Existing industry strategy pages remain canonical for broad strategy; the database guide remains canonical for choosing a research file. New articles cover distinct execution questions.

1. SaaS destination guide: Product Hunt, SaaSHub, G2 and BetaList, with stage restrictions, current free/paid distinctions and direct official routes.
2. Business-type directory guide: genuinely different choices for local customer-facing businesses, online shops, B2B software and professional services. Upgrade the existing local-citation and industry pages with contextual entry links.
3. Free versus paid submission guide: distinguish a review fee, optional promotion and purchased placement. Dated actual observed pricing, no invented gated prices.
4. Directory evaluation: extend the existing prospect qualification checklist with worked, sourced eligibility/budget examples rather than duplicate it.
5. Individual walkthroughs: SaaSHub observed form and Product Hunt documented preparation; original browser screenshots with clear observation limits.
6. Real experiment: document actual attempts and confirmations. No simulated acceptance, backlinks, traffic or revenue. Exclusions and blocked steps are evidence, not successful submissions.
7. Provide a submission evidence CSV, link from templates, connect new and existing content to the opportunity finder, verification tool and bundle through existing uncluttered CTA.
8. Validate metadata, MDX compilation, internal links, rendered sitemap routes, responsive screenshots and CSV consistency. Push reviewed changes to main.

## Research findings

- Product Hunt: free, personal account required; product eligibility and launch preparation matter.
- SaaSHub: actual form at /services/submit (not /submit, which is a promotion tracker). Observed Free and $75 one-off Priority+ choices; free queue displayed up to 32 days. These are publisher estimates, not measured results.
- BetaList: official support now says all submissions paid; exact plans behind submission form. Exclude from zero-budget campaign.
- G2: official documentation excludes B2C and alpha/beta products. Basic profile free, moderation applies.
- Google Business Profile: online-only businesses ineligible. Do not invent an address or local service.
- Trustpilot: free plan distinct from paid business plans and trials; profile requires genuine business/customer experience.

Sources are cited at point of use in each article. Search results reviewed for intent, not used as evidence of keyword volume or predicted ranking difficulty.

## Completion

In progress. Actual experiment outcomes and validation appended before commit.

## Scope correction and implemented content

The user explicitly removed the submission experiment from scope during implementation. No experiment page, acceptance-rate claim or ongoing submission work is being published. One free SaaSHub form was sent before that correction, using the site's published contact address; the flow advanced to product management. This is not a verified approval or ranking result. No payment was made and no Product Hunt account was created.

- [x] Five new distinct guides: SaaS submission destinations; business-type directory selection; free/paid submission costs; SaaSHub observed walkthrough; Product Hunt preparation checklist.
- [x] Existing prospect qualification checklist upgraded with four sourced worked decisions and page-level inspection criteria.
- [x] Seven existing pages updated with contextual connections rather than duplicate strategy pages.
- [x] Original SaaSHub screenshots inspected. Product Hunt browser challenge screenshot deliberately excluded; its preparation guide is labelled documentation-based.
- [x] Existing prospect tracker reused, avoiding another near-identical download. New guides connect to useful free tools and the bundle through contextual links and the existing offer component.
- [x] Opportunity finder corrected: SaaSHub direct form URL and current restrictions; G2 released-B2B eligibility.
- [x] AI discovery links added to llms.txt. Five new routes automatically included by blog/sitemap infrastructure.

Research result sets showed numerous large directory lists and DR-led comparisons. Our intent differentiation is practical eligibility, actual observed fees, exclusions and form steps. No search-volume or difficulty estimates were invented.

## Release verification

- Production build and ESLint passed.
- Source inventory: 344 content documents, including 112 blogs; no unresolved internal links.
- Full production crawl: 376 sitemap pages; no page-check failures, broken internal links or pages unreachable from homepage.
- Discovery checks passed for Markdown, canonical alternatives, protected files, robots, missing-page responses and consolidation redirects.
- All five new routes returned HTTP 200 with rendered descriptions matching source; title lengths 50–53 characters and descriptions 155–159 characters.
- Desktop 1440px and mobile 390px browser views inspected. No horizontal page overflow observed at 390px; both walkthrough images loaded. Existing bundle card and banner render correctly.
- No paid services, new analytics claims or fabricated experiment results added.
