import zipfile
import json
import re
import xml.etree.ElementTree as ET

def get_col_name(cell_ref):
    return re.match(r'([A-Z]+)', cell_ref).group(1)

with zipfile.ZipFile('resources/Master Career Tracker.xlsx', 'r') as z:
    shared_strings = []
    if 'xl/sharedStrings.xml' in z.namelist():
        tree = ET.fromstring(z.read('xl/sharedStrings.xml'))
        for si in tree.findall('.//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}si'):
            t_elems = si.findall('.//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t')
            text = ''.join([t.text or '' for t in t_elems])
            shared_strings.append(text)

    sheet1_tree = ET.fromstring(z.read('xl/worksheets/sheet1.xml'))
    rows = sheet1_tree.findall('.//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}row')
    
    questions = []
    for r in rows:
        row_dict = {}
        for c in r.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}c'):
            cell_ref = c.attrib.get('r')
            col = get_col_name(cell_ref)
            cell_type = c.attrib.get('t')
            v = c.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}v')
            val = v.text if v is not None else ''
            if cell_type == 's' and val != '':
                val = shared_strings[int(val)]
            row_dict[col] = val
            
        r_num = int(r.attrib.get('r'))
        if r_num > 1 and any(row_dict.values()):
            sl_no = int(row_dict.get('A', len(questions) + 1))
            phase = row_dict.get('B', '').strip()
            lc_no = row_dict.get('C', '').strip()
            topic = row_dict.get('D', '').strip()
            pattern = row_dict.get('E', '').strip()
            name = row_dict.get('F', '').strip()
            diff = row_dict.get('G', 'Medium').strip()
            status_raw = row_dict.get('H', 'Todo').strip()
            insight = row_dict.get('J', '').strip()
            time_comp = row_dict.get('K', '').strip()
            space_comp = row_dict.get('L', '').strip()
            mistake = row_dict.get('P', '').strip()
            
            # Map status
            status = 'NOT_STARTED'
            if status_raw.lower() in ['solved', 'done', 'completed']:
                status = 'SOLVED'
            elif status_raw.lower() in ['in progress', 'doing', 'in_progress']:
                status = 'IN_PROGRESS'
            elif status_raw.lower() in ['needs revision', 'revise', 'revision']:
                status = 'NEEDS_REVISION'
                
            # Create leetcode slug / url
            slug = re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')
            problem_url = f'https://leetcode.com/problems/{slug}/'
            
            questions.append({
                'id': f'dsa_{sl_no}',
                'number': sl_no,
                'leetcodeNumber': int(lc_no) if lc_no.isdigit() else None,
                'topic': topic,
                'subPattern': pattern,
                'phase': phase,
                'title': name,
                'difficulty': diff,
                'problemUrl': problem_url,
                'status': status,
                'solvedMyself': False,
                'approach': insight,
                'timeComplexity': time_comp,
                'spaceComplexity': space_comp,
                'mistake': mistake,
                'needsRevision': False,
                'revisionNotes': '',
            })

topics = ['Arrays', 'Strings', 'HashMap', 'Two Pointer', 'Sliding Window', 'Binary Search', 'Stack', 'Queue', 'Linked List']
topic_stats = []
for t in topics:
    t_qs = [q for q in questions if q['topic'].lower() == t.lower()]
    solved = len([q for q in t_qs if q['status'] == 'SOLVED'])
    total = len(t_qs)
    percent = round((solved / total) * 100) if total > 0 else 0
    topic_stats.append({
        'topic': t,
        'total': total,
        'solved': solved,
        'percent': percent
    })

overview = {
    'total': len(questions),
    'solved': 0,
    'inProgress': 0,
    'notStarted': len(questions),
    'needsRevisionCount': 0,
    'solvedMyselfCount': 0,
    'neededHelpCount': 0,
    'completionPercent': 0,
    'currentTopic': 'Arrays',
}

ts_content = f'''import {{ DSAQuestion, DSAOverview, DSATopicStat }} from '../types';

export const MASTER_DSA_QUESTIONS: DSAQuestion[] = {json.dumps(questions, indent=2)};

export const MASTER_DSA_TOPIC_STATS: DSATopicStat[] = {json.dumps(topic_stats, indent=2)};

export const MASTER_DSA_OVERVIEW: DSAOverview = {{
  total: {overview['total']},
  solved: {overview['solved']},
  inProgress: {overview['inProgress']},
  notStarted: {overview['notStarted']},
  needsRevisionCount: {overview['needsRevisionCount']},
  solvedMyselfCount: {overview['solvedMyselfCount']},
  neededHelpCount: {overview['neededHelpCount']},
  completionPercent: {overview['completionPercent']},
  currentTopic: "{overview['currentTopic']}",
  nextRecommended: MASTER_DSA_QUESTIONS[0],
}};
'''

with open('src/data/dsaQuestions.ts', 'w', encoding='utf-8') as f:
    f.write(ts_content)

print('Generated src/data/dsaQuestions.ts with 80 questions.')
