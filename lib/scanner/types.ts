export type PageLink = { url: string; anchor: string; rel: string; body: boolean }
export type ScanPage = {
  requested: string; url: string; status: number; redirects: { url: string; status: number }[];
  type: string; title: string; description: string; h1: string[]; canonicals: string[];
  robots: string[]; links: PageLink[]; passages: string[]; words: number; schema: number;
  sitemap: string[]; sitemaps: string[]; checked: string; blocked?: string; truncated: boolean; linksTruncated?: boolean; crawlerRules?: Record<string, boolean>;
}
export type ScanReport = { title: string; summary: string; columns: string[]; rows: string[][]; notes: string[]; checked: string }
export type LiveTool = { slug: string; title: string; description: string; action: string; kind: 'opportunities' | 'backlink' | 'internal' | 'broken' | 'audit' | 'gap'; steps: string[]; scope: string; related: string; relatedLabel: string }
