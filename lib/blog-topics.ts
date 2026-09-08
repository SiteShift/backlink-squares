export const blogTopics = [
  { id: 'fundamentals', label: 'Backlink fundamentals', hub: '/backlinks', description: 'Understand links, authority metrics and relevance before choosing tactics.' },
  { id: 'research', label: 'Research, tools & maintenance', hub: '/backlink-audit', description: 'Find evidence, verify placements and protect links you already have.' },
  { id: 'risk', label: 'Quality & search policies', hub: '/backlink-quality', description: 'Evaluate risk without invented toxicity scores or safe ratios.' },
  { id: 'outreach', label: 'Outreach & digital PR', hub: '/digital-pr', description: 'Choose relevant publications, prepare evidence and write useful pitches.' },
  { id: 'tactics', label: 'Content & link earning', hub: '/link-building-tactics', description: 'Build resources, partnerships and distribution that deserve attention.' },
  { id: 'industries', label: 'Business types & page goals', hub: '/industries', description: 'Adapt the approach to your audience, business model and destination page.' },
  { id: 'strategy', label: 'Planning & measurement', hub: '/link-building', description: 'Set priorities, manage delivery and connect activity with business outcomes.' },
] as const
export function blogTopic(slug: string) {
  if (/disavow|toxic|penalty|negative-seo|spam-update|parasite|tiered|mistakes|bad-backlink/.test(slug)) return blogTopics[2]
  if (/migration|verify-backlink|not-showing|checker|tools|ahrefs|moz|semrush|competitor|search-console|audit-your|backlink-reporting/.test(slug)) return blogTopics[1]
  if (/guest-post|haro|outreach|pitch|follow-up|response-rate|personalization|news-sites|podcasts|roundups|journalist|cited-source/.test(slug)) return blogTopics[3]
  if (/for-(affiliate|blog-posts|competitive|content-sites|landing|new-websites|personal|product|service|startups|ymyl)|boring-industries|international|case-study-(saas|ecommerce)/.test(slug)) return blogTopics[5]
  if (/what-are|101-|dofollow|domain-authority|anchor-text|how-google|e-e-a-t|quality-backlink|backlink-quality|types-of|quantity-vs|relevance|topical-authority/.test(slug)) return blogTopics[0]
  if (/infographic|data-studies|without-(content|outreach)|use-content|content-marketing|digital-assets|with-(linkedin|quora|reddit|twitter)|youtube|relationships|thought-leadership|brand-authority/.test(slug)) return blogTopics[4]
  return blogTopics[6]
}
