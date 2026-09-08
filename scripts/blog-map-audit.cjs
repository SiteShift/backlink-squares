const fs = require('node:fs'), path = require('node:path'), matter = require('gray-matter'), ts = require('typescript');
const moduleObject = { exports: {} };
new Function('exports', 'module', ts.transpileModule(fs.readFileSync('lib/blog-topics.ts','utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText)(moduleObject.exports, moduleObject);
const { blogTopic } = moduleObject.exports;
const posts = fs.readdirSync('content/blog').filter(f=>f.endsWith('.mdx')).sort().map(file=>{
 const {data,content}=matter(fs.readFileSync(path.join('content/blog',file),'utf8'));const slug=file.replace('.mdx','');
 const claims=content.split('\n').map((text,index)=>({line:index+1,text})).filter(l=>/we (tested|built|analy[sz]ed|achieved)|personally pitched|updated monthly|\d+(?:\.\d+)?%/.test(l.text.toLowerCase()));
 return {slug,url:'/blog/'+slug,title:data.title,topic:blogTopic(slug).id,words:content.split(/\s+/).length,description:data.metaDescription||data.description,headings:[...content.matchAll(/^## (.+)/gm)].map(m=>m[1]),internalLinks:[...content.matchAll(/\]\((\/[^)\s]+)\)/g)].map(m=>m[1]),externalSources:[...content.matchAll(/\]\((https?:[^)\s]+)\)/g)].map(m=>m[1]),claimReviewCandidates:claims};
});
const tokens=s=>new Set(s.toLowerCase().replace(/\b(link|building|backlinks?|the|a|to|for|how|complete|guide|2026|your|and|of|in|with)\b/g,'').split(/[^a-z]+/).filter(w=>w.length>2));
const overlaps=[];for(let i=0;i<posts.length;i++)for(let j=i+1;j<posts.length;j++){const a=tokens(posts[i].title),b=tokens(posts[j].title);const common=[...a].filter(t=>b.has(t));const union=new Set([...a,...b]);if(common.length>=2&&common.length/union.size>=.45)overlaps.push({first:posts[i].url,second:posts[j].url,sharedIntentTerms:common});}
const report={method:'Full-source inventory of every blog. Topic and lexical claim flags are editorial triage, not fact verification or proof of cannibalisation. Page-specific factual corrections and priority decisions are documented in blog-topical-audit.md.',posts:posts.length,topics:Object.fromEntries([...new Set(posts.map(p=>p.topic))].map(t=>[t,posts.filter(p=>p.topic===t).length])),overlapCandidates:overlaps,inventory:posts};
fs.writeFileSync('reports/blog-map-audit.json',JSON.stringify(report,null,2));console.log(JSON.stringify({posts:report.posts,topics:report.topics,overlapCandidates:overlaps.length,withoutExternalSources:posts.filter(p=>!p.externalSources.length).length},null,2));
