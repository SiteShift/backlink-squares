// Run with the bundled artifact-tool module path in ARTIFACT_TOOL_PATH.
// This is an offline asset generator; no runtime website dependency is required.
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
const { Workbook, SpreadsheetFile } = await import(process.env.ARTIFACT_TOOL_PATH || '@oai/artifact-tool');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const data = JSON.parse(await fs.readFile(path.join(root, 'scripts/data/bundle-sample.json'), 'utf8'));
const dest = path.join(root, 'public/samples');
const output = path.join(root, 'outputs/bundle-sample');
await fs.mkdir(output, { recursive: true });
const url = 'https://backlinkgrid.com/bundle?utm_source=free_sample&utm_medium=spreadsheet&utm_campaign=foundations';
const wb = Workbook.create();
const sheet = wb.worksheets.add('Free sample');
sheet.showGridLines = false;
sheet.tabColor = '#C92926';
sheet.getRange('A1:F23').format = { font: { name: 'Arial', size: 11, color: '#30382A' }, rowHeight: 23, verticalAlignment: 'center', fill: '#FFFFFF' };
for (const [col, width] of Object.entries({A:24,B:175,C:185,D:350,E:260,F:24})) sheet.getRange(`${col}1:${col}25`).format.columnWidthPx = width;
function line(range, text, size = 11, bold = false, color = '#30382A') {
 const r = sheet.getRange(range); r.merge();r.values=[[text]];r.format.font={name:'Arial',size,bold,color};r.format.wrapText=true;
}
line('B2:E2', 'BACKLINKGRID', 11, true, '#C92926');
line('B3:E3', 'Five foundational backlink opportunities', 20, true);
sheet.getRange('B3:E3').format.rowHeight=33;
line('B4:E4', 'Anyone serious about SEO will know these. The complete bundle includes 276 vetted, verified, relevant high DR backlinks.');
sheet.getRange('B4:E4').format.rowHeight=31;
sheet.getRange('B6:E6').values=[['Opportunity','Best for','What to do','Free option / requirements']];
sheet.getRange('B6:E6').format={fill:'#283222',font:{name:'Arial',size:11,bold:true,color:'#FFFFFF'},rowHeight:32,verticalAlignment:'center',horizontalAlignment:'left'};
for (let i=0;i<data.length;i++) {
 const r=data[i].row,n=i+7;
 sheet.getRange(`B${n}:E${n}`).values=[[r['Site Name'],r['Best For'],r.Tips,`${r.Cost}. ${r['Approval Time']}.`]];
 // Native hyperlink relationships are attached after export; values remain readable in every viewer.
 sheet.getRange(`B${n}:E${n}`).format={fill:i%2?'#FFFFFF':'#F3F5EF',wrapText:true,rowHeight:88,verticalAlignment:'center',borders:{bottom:{style:'thin',color:'#E1E5DB'}}};
 sheet.getRange(`B${n}`).format.font={name:'Arial',size:12,bold:true,color:'#B72523'};
}
line('B13:E13',"The best links are the one's relevant to your site. The complete bundle includes high DR backlinks for a wide range of industries.",16,true);
sheet.getRange('B13:E13').format.rowHeight=55;
line('B15:E16','276 opportunities across business directories, niche communities, launch platforms, review sites, developer platforms and more. Filter by category and cost.');
sheet.getRange('B15:E16').format.rowHeight=24;
line('B18:E19','',14,true,'#FFFFFF');
sheet.getRange('B18').values=[['Get the Complete Backlink Database Bundle  ·  £11.49']];
sheet.getRange('B18:E19').format.fill='#C92926';
sheet.getRange('B18:E19').format.horizontalAlignment='center';
line('B20:E20','One payment. No subscription. Download after checkout.',11,false,'#5B6551');
sheet.getRange('B20:E20').format.horizontalAlignment='center';
const raw=wb.worksheets.add('Database rows');raw.showGridLines=false;
raw.getRange('A1:J13').format={font:{name:'Arial',size:11,color:'#30382A'},verticalAlignment:'center',wrapText:true,rowHeight:30};
const headers=Object.keys(data[0].row);
raw.getRange('A1:J1').values=[[...headers.map(h => h === 'DR' ? 'DR (recorded)' : h === 'Link Type' ? 'Link type (recorded)' : h),'Submission guidance source']];
raw.getRange('A1:J1').format={fill:'#283222',font:{name:'Arial',size:11,color:'#FFFFFF',bold:true},rowHeight:35,wrapText:true};
raw.getRange('A2:J6').values=data.map(d=>[...headers.map(k=>k==='DR'?Number(d.row[k]):d.row[k]),d.source]);
for(const [i,width] of [170,190,100,160,250,330,220,240,500,330].entries())raw.getRangeByIndexes(0,i,13,1).format.columnWidthPx=width;
raw.getRange('A2:J6').format.rowHeight=88;
for(let n=2;n<=6;n++) if(n%2===0)raw.getRange(`A${n}:J${n}`).format.fill='#F3F5EF';
raw.freezePanes.freezeRows(1);raw.freezePanes.freezeColumns(1);
raw.getRange('C2:C6').setNumberFormat('0');
raw.getRange('A8:J9').merge();raw.getRange('A8').values=[['DR and link types are historical values from the paid file, not live measurements. Submission guidance in this sample has been expanded from the linked publisher sources. Recheck eligibility, costs and the actual published link before submitting.']];
raw.getRange('A11:J12').merge();raw.getRange('A11').values=[['Go beyond these five: Get the Complete Backlink Database Bundle for £11.49']];raw.getRange('A11:J12').format={fill:'#C92926',font:{name:'Arial',size:14,bold:true,color:'#FFFFFF'}};
wb.recalculate();
console.log((await wb.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#NUM!|#N/A|#NULL!',options:{useRegex:true,maxResults:20},maxChars:1200})).ndjson);
console.log((await wb.inspect({kind:'table',range:'Free sample!B7:C11',include:'values,formulas',tableMaxRows:5,tableMaxCols:2,maxChars:1800})).ndjson);
const xlsx=await SpreadsheetFile.exportXlsx(wb);await xlsx.save(path.join(output,'backlink-database-sample.xlsx'));
execFileSync(process.env.PYTHON || 'python3', [path.join(root,'scripts/sample-hyperlinks.py'), path.join(output,'backlink-database-sample.xlsx'), path.join(root,'scripts/data/bundle-sample.json'), url]);
await fs.copyFile(path.join(output,'backlink-database-sample.xlsx'),path.join(dest,'backlink-database-sample.xlsx'));
for(const [name,range,file] of [['Free sample','A1:F21','sample-preview.png'],['Database rows','A1:J12','research-preview.png']]) {
 const preview=await wb.render({sheetName:name,range,scale:1,format:'png'});
 await fs.writeFile(path.join(output,file),new Uint8Array(await preview.arrayBuffer()));
}
const csvUrl=url.replace('utm_medium=spreadsheet','utm_medium=csv');
const sales=['Get the Complete Backlink Database Bundle','Go beyond the basics','','','£11.49 one-time',csvUrl,'','276 opportunities across business directories, niche communities, launch platforms, review sites and more.','Filter by category and cost. Download after checkout.'];
const quote=v=>'"'+String(v).replaceAll('"','""')+'"';
await fs.writeFile(path.join(dest,'backlink-database-sample.csv'),'\uFEFF'+[headers.map(h => h === 'DR' ? 'DR (recorded)' : h === 'Link Type' ? 'Link Type (recorded; recheck)' : h),...data.map(d=>headers.map(k=>d.row[k])),sales].map(row=>row.map(quote).join(',')).join('\n')+'\n');
console.log('Created XLSX and CSV with five sample entries and one bundle upsell.');
