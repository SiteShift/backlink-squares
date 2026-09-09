"""Attach native XLSX hyperlinks unsupported by the asset renderer.

The workbook's values and formatting are authored with artifact-tool.
Only hyperlink relationships are added here, using standard Open XML.
"""
import json
import sys
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
from xml.etree import ElementTree as ET

file, source, upsell = sys.argv[1:]
data = json.loads(Path(source).read_text())
ns = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'
rel = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
pkg = 'http://schemas.openxmlformats.org/package/2006/relationships'
ET.register_namespace('', ns)
ET.register_namespace('r', rel)
with ZipFile(file) as z:
    parts = {n: z.read(n) for n in z.namelist()}
links = {
    1: [(f'B{i+7}', d['row']['Submit URL']) for i, d in enumerate(data)] + [('B18', upsell)],
    2: [(f'F{i+2}', d['row']['Submit URL']) for i, d in enumerate(data)] + [(f'J{i+2}', d['source']) for i, d in enumerate(data)] + [('A11', upsell)],
}
for index, targets in links.items():
    sheet_path = f'xl/worksheets/sheet{index}.xml'
    rel_path = f'xl/worksheets/_rels/sheet{index}.xml.rels'
    sheet = ET.fromstring(parts[sheet_path])
    relationships = ET.fromstring(parts[rel_path]) if rel_path in parts else ET.Element(f'{{{pkg}}}Relationships')
    hyperlinks = ET.Element(f'{{{ns}}}hyperlinks')
    for i, (cell, target) in enumerate(targets):
        rid = f'sampleLink{i+1}'
        ET.SubElement(hyperlinks, f'{{{ns}}}hyperlink', {'ref': cell, f'{{{rel}}}id': rid})
        ET.SubElement(relationships, f'{{{pkg}}}Relationship', {'Id': rid, 'Type': f'{rel}/hyperlink', 'Target': target, 'TargetMode': 'External'})
    # OOXML orders hyperlinks after data validations and before print/page settings.
    before = {'printOptions','pageMargins','pageSetup','headerFooter','rowBreaks','colBreaks','customProperties','cellWatches','ignoredErrors','smartTags','drawing','legacyDrawing','legacyDrawingHF','picture','oleObjects','controls','webPublishItems','tableParts','extLst'}
    position = next((i for i, child in enumerate(sheet) if child.tag.split('}')[-1] in before), len(sheet))
    sheet.insert(position, hyperlinks)
    parts[sheet_path] = ET.tostring(sheet, encoding='utf-8', xml_declaration=True)
    parts[rel_path] = ET.tostring(relationships, encoding='utf-8', xml_declaration=True)
with ZipFile(file, 'w', ZIP_DEFLATED) as z:
    for name, body in parts.items():
        z.writestr(name, body)
