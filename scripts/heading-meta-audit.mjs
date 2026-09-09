import fs from 'node:fs'
import { load } from 'cheerio'
const base=process.argv[2]||'http://127.0.0.1:3014'
const output=process.argv[3]||'reports/heading-meta-audit.json'
const xml=await (await fetch(base+'/sitemap.xml')).text()
const urls=[...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);const pages=[]
let cursor=0
await Promise.all(Array.from({length:6},async()=>{while(cursor<urls.length){const url=urls[cursor++];const r=await fetch(base+new URL(url).pathname);const $=load(await r.text());pages.push({url,path:new URL(url).pathname,status:r.status,h1:$('h1').map((_,e)=>$(e).text().replace(/\s+/g,' ').trim()).get(),title:$('title').text().trim(),description:$('meta[name=description]').attr('content')||'',canonical:$('link[rel=canonical]').attr('href'),robots:$('meta[name=robots]').attr('content')||''})}}))
pages.sort((a,b)=>a.path.localeCompare(b.path));const duplicates=field=>Object.entries(pages.reduce((groups,p)=>{const key=Array.isArray(p[field])?p[field].join('|'):p[field];(groups[key] ||= []).push(p);return groups},Object.create(null))).filter(([key,items])=>key&&items.length>1).map(([value,items])=>({value,paths:items.map(p=>p.path)}))
const result={pages:pages.length,missing:pages.filter(p=>p.h1.length!==1||!p.title||!p.description||p.status!==200),duplicateTitles:duplicates('title'),duplicateDescriptions:duplicates('description'),duplicateH1s:duplicates('h1'),lengthReview:pages.filter(p=>p.title.length>65||p.description.length>175||p.description.length<90).map(p=>({path:p.path,titleLength:p.title.length,descriptionLength:p.description.length})),inventory:pages}
fs.writeFileSync(output,JSON.stringify(result,null,2));console.log(JSON.stringify({...result,inventory:undefined},null,2))
