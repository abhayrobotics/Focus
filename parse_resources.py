import zipfile
import xml.etree.ElementTree as ET
import os
import sys
import json

# Force UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

def parse_docx(file_path):
    print(f"\n==================================================")
    print(f"DOCX: {os.path.basename(file_path)}")
    print(f"==================================================")
    try:
        with zipfile.ZipFile(file_path, 'r') as z:
            xml_content = z.read('word/document.xml')
            tree = ET.fromstring(xml_content)
            namespaces = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
            paragraphs = []
            for p in tree.findall('.//w:p', namespaces):
                texts = [node.text for node in p.findall('.//w:t', namespaces) if node.text]
                if texts:
                    paragraphs.append(''.join(texts))
            full_text = '\n'.join(paragraphs)
            print(full_text[:4000])
            if len(full_text) > 4000:
                print(f"\n... [Total Length: {len(full_text)} chars] ...")
            return full_text
    except Exception as e:
        print(f"Error reading docx: {e}")
        return ""

def parse_xlsx(file_path):
    print(f"\n==================================================")
    print(f"XLSX: {os.path.basename(file_path)}")
    print(f"==================================================")
    try:
        with zipfile.ZipFile(file_path, 'r') as z:
            # Read shared strings
            shared_strings = []
            if 'xl/sharedStrings.xml' in z.namelist():
                ss_tree = ET.fromstring(z.read('xl/sharedStrings.xml'))
                ns = {'ns': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
                for si in ss_tree.findall('.//ns:si', ns):
                    texts = [t.text for t in si.findall('.//ns:t', ns) if t.text]
                    shared_strings.append(''.join(texts))

            wb_tree = ET.fromstring(z.read('xl/workbook.xml'))
            ns = {'ns': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
            sheets = []
            for s in wb_tree.findall('.//ns:sheet', ns):
                sheets.append(s.attrib.get('name'))
            print("Sheets found:", sheets)

            sheet_files = [f for f in z.namelist() if f.startswith('xl/worksheets/sheet') and f.endswith('.xml')]
            sheet_files.sort()
            all_sheets_data = {}
            for idx, sheet_file in enumerate(sheet_files):
                sheet_name = sheets[idx] if idx < len(sheets) else f"Sheet{idx+1}"
                print(f"\n--- Sheet: {sheet_name} ({sheet_file}) ---")
                s_tree = ET.fromstring(z.read(sheet_file))
                rows = []
                for row_node in s_tree.findall('.//ns:row', ns):
                    row_cells = []
                    for c in row_node.findall('.//ns:c', ns):
                        t_attr = c.attrib.get('t')
                        v_node = c.find('.//ns:v', ns)
                        val = ''
                        if v_node is not None and v_node.text is not None:
                            val = v_node.text
                            if t_attr == 's':
                                val = shared_strings[int(val)] if int(val) < len(shared_strings) else val
                        elif c.find('.//ns:is/ns:t', ns) is not None:
                            val = c.find('.//ns:is/ns:t', ns).text
                        row_cells.append(val)
                    if any(row_cells):
                        rows.append(row_cells)
                all_sheets_data[sheet_name] = rows
                print(f"Total rows: {len(rows)}")
                for r in rows[:15]:
                    print(r)
                if len(rows) > 15:
                    print(f"... and {len(rows)-15} more rows")
            
            # Save parsed json for processing
            with open(r"d:\Code\RoadMap 2026\Project\CareerTracker\resources\parsed_excel.json", "w", encoding="utf-8") as f:
                json.dump(all_sheets_data, f, ensure_ascii=False, indent=2)
            print("\nSaved parsed excel to resources/parsed_excel.json")
    except Exception as e:
        print(f"Error reading xlsx: {e}")

if __name__ == '__main__':
    base_res = r"d:\Code\RoadMap 2026\Project\CareerTracker\resources"
    for fname in os.listdir(base_res):
        fpath = os.path.join(base_res, fname)
        if fname.endswith('.docx'):
            text = parse_docx(fpath)
            out_txt = os.path.join(base_res, fname.replace('.docx', '.txt'))
            with open(out_txt, 'w', encoding='utf-8') as f:
                f.write(text)
        elif fname.endswith('.xlsx'):
            parse_xlsx(fpath)
