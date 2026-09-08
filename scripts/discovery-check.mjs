import assert from 'node:assert/strict'
const base=process.argv[2] || 'http://127.0.0.1:3010'
for(const route of ['/llms.txt','/agents.md','/index.md','/backlinks.md','/blog/moz-link-explorer-guide.md']) {
 const r=await fetch(base+route);assert.equal(r.status,200,route);const text=await r.text();assert.match(text,/^#/);if(route.endsWith('.md'))assert.match(r.headers.get('content-type'),/text\/markdown/)
}
for(const route of ['/nonexistent-seo-check','/nonexistent-seo-check.md','/backlinks/definitely-not-an-article','/private/downloads/backlink-database-bundle.csv']){const r=await fetch(base+route);assert.equal(r.status,404,route)}
assert.equal((await fetch(base+'/api/bundle-download')).status,400)
const home=await fetch(base+'/');assert.match(home.headers.get('link'),/index\.md/);const html=await home.text();assert.match(html,/Complete Backlink Database Bundle/);assert.match(html,/Frequently asked questions/)
const robots=await (await fetch(base+'/robots.txt')).text();assert.match(robots,/Allow: \//);assert.match(robots,/Sitemap:/)
const redirect=await fetch(base+'/blog/link-building-statistics-2026',{redirect:'manual'});assert.equal(redirect.status,308);assert.match(redirect.headers.get('location'),/\/statistics\/link-building-statistics-2026/)
console.log('Passed: public Markdown, canonical alternate discovery, private-file protection, missing-page statuses, robots and consolidation redirect.')
