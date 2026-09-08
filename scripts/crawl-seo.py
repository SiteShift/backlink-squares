"""Read-only production crawl. Run against the local production server."""
import concurrent.futures, json, re, sys, urllib.request, urllib.error
from html.parser import HTMLParser
from pathlib import Path
base=sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:3010'
class Page(HTMLParser):
 def __init__(self):
  super().__init__();self.h1=0;self.canonical=[];self.description=[];self.links=[];self.jsons=[];self.inscript=False;self.buffer='';self.noindex=False
 def handle_starttag(self,t,attrs):
  a=dict(attrs)
  if t=='h1':self.h1+=1
  if t=='link' and a.get('rel')=='canonical':self.canonical.append(a.get('href'))
  if t=='meta' and a.get('name')=='description':self.description.append(a.get('content',''))
  if t=='meta' and a.get('name')=='robots' and 'noindex' in a.get('content',''):self.noindex=True
  if t=='a' and a.get('href','').startswith('/'):self.links.append(a['href'].split('#')[0].split('?')[0])
  if t=='script' and a.get('type')=='application/ld+json':self.inscript=True;self.buffer=''
 def handle_data(self,d):
  if self.inscript:self.buffer+=d
 def handle_endtag(self,t):
  if t=='script' and self.inscript:self.jsons.append(self.buffer);self.inscript=False
sitemap=urllib.request.urlopen(base+'/sitemap.xml').read().decode()
urls=re.findall(r'<loc>(.*?)</loc>',sitemap)
def check(url):
 route=url.replace('https://backlinkgrid.com','');errors=[]
 try:
  response=urllib.request.urlopen(base+route,timeout=60);body=response.read().decode();p=Page();p.feed(body)
  if response.status!=200:errors.append('status '+str(response.status))
  if p.h1!=1:errors.append('H1 count '+str(p.h1))
  if len(p.canonical)!=1 or p.canonical[0].rstrip('/')!=url.rstrip('/'):errors.append('canonical '+str(p.canonical))
  if not p.description or not p.description[0]:errors.append('missing description')
  if p.noindex:errors.append('noindex')
  for j in p.jsons:
   try:json.loads(j)
   except:errors.append('invalid JSON-LD')
  return {'url':url,'bytes':len(body.encode()),'errors':errors,'links':p.links}
 except Exception as e:return {'url':url,'errors':[str(e)],'links':[]}
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as ex:results=list(ex.map(check,urls))
known={u.replace('https://backlinkgrid.com','').rstrip('/') or '/' for u in urls}
missing=sorted({link for p in results for link in p['links'] if link and link.rstrip('/') not in known and link!='/'})
def linkcheck(link):
 try:
  r=urllib.request.urlopen(base+link,timeout=30)
  return (link,r.status)
 except urllib.error.HTTPError as e:return (link,e.code)
 except Exception:return (link,0)
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as ex:statuses=list(ex.map(linkcheck,missing))
broken=[x for x in statuses if x[1]>=400 or not x[1]]
report={'pages':len(results),'failures':[{'url':p['url'],'errors':p['errors']} for p in results if p['errors']],'brokenLinks':broken,'largest':sorted([{'url':p['url'],'bytes':p.get('bytes',0)} for p in results],key=lambda p:p['bytes'],reverse=True)[:10]}
graph={p['url'].replace('https://backlinkgrid.com','').rstrip('/') or '/':p['links'] for p in results}
seen=set();queue=['/']
while queue:
 current=queue.pop()
 if current in seen:continue
 seen.add(current)
 queue.extend((x.rstrip('/') or '/') for x in graph.get(current,[]) if (x.rstrip('/') or '/') in known)
report['unreachableFromHomepage']=sorted(known-seen)
Path('reports/rendered-crawl.json').write_text(json.dumps(report,indent=2));Path('reports/crawl-pages.json').write_text(json.dumps(results,indent=2));print(json.dumps(report,indent=2));sys.exit(bool(report['failures'] or broken or report['unreachableFromHomepage']))
