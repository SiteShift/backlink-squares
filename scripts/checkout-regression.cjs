const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')
const ts = require('typescript')
const { NextRequest } = require('next/server')
function load(file, mocks) {
  const exports = {}
  const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,esModuleInterop:true}}).outputText
  vm.runInNewContext(source, {exports,require: id => id in mocks ? mocks[id] : require(id),console,URL,process,Buffer}, {filename:file})
  return exports
}
async function main() {
 let dbCalls=0
 const checkout = load('app/api/checkout/route.ts', {
  '@/lib/supabase': {createServerClient(){dbCalls++;throw Error('Invalid input reached database')}},
  '@/lib/stripe':{}, '@/lib/utils':{isValidSelectionSize:s=>s.length>0&&s.length<=100}, '@/lib/types':{GRID_COLUMNS:10,MAX_ROWS:1000},uuid:{v4:()=> 'test'},
 })
 const cases=[null,{},[{row:0.5,col:0}],[{row:0,col:0},{row:0,col:0}],[{row:-1,col:0}]]
 for(const squares of cases){const form=new FormData();form.set('squares',JSON.stringify(squares));form.set('siteUrl','https://example.com');form.set('siteName','Example');form.set('email','example@example.com');const r=await checkout.POST(new NextRequest('http://localhost/api/checkout',{method:'POST',body:form}));assert.equal(r.status,400)}
 for(const url of ['javascript:alert(1)','data:text/html,test','https://user:pass@example.com']){const form=new FormData();form.set('squares','[{"row":0,"col":0}]');form.set('siteUrl',url);form.set('siteName','Example');form.set('email','example@example.com');const r=await checkout.POST(new NextRequest('http://localhost/api/checkout',{method:'POST',body:form}));assert.equal(r.status,400)}
 assert.equal(dbCalls,0)
 let event={type:'checkout.session.completed',data:{object:{metadata:{product_type:'backlink_database_bundle'},payment_status:'paid'}}}
 const webhook=load('app/api/webhook/route.ts',{'next/headers':{headers:()=>new Headers({'stripe-signature':'test-signature'})},'@/lib/stripe':{stripe:{webhooks:{constructEvent:()=>event}}},'@/lib/supabase':{createServerClient:()=>({from(){throw Error('Bundle touched grid data')}})}})
 const r=await webhook.POST(new NextRequest('http://localhost/api/webhook',{method:'POST',body:'test'}));assert.equal(r.status,200)
 console.log('Passed: malformed/duplicate coordinates and unsafe URLs rejected before DB access; verified bundle event bypasses grid fulfillment.')
}
main().catch(e=>{console.error(e);process.exit(1)})
