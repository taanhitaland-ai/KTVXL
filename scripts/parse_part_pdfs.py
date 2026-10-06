import pypdf
import glob
import re
import json
import os

pdf_files = sorted(glob.glob('KTVXL*.pdf') + glob.glob('Check/*.pdf'))

def clean_text(t):
    return ' '.join(t.split()).strip()

parsed_part_questions = []

for pf in pdf_files:
    # Identify part name
    base = os.path.basename(pf)
    part_match = re.search(r'Part\s*(\d+)', base, re.IGNORECASE)
    part_num = int(part_match.group(1)) if part_match else 0
    part_id = f"PART_{part_num:02d}"
    
    reader = pypdf.PdfReader(pf)
    full_text = '\n'.join(p.extract_text() or '' for p in reader.pages)
    
    # We look for blocks ending with (1 Point), (1 Điểm), or \d+/\d+ Điểm
    # In ms forms, question prompt is usually right above points marker
    lines = full_text.split('\n')
    
    cur_options = []
    cur_lines = []
    q_counter = 1
    
    for line in lines:
        l = line.strip()
        if not l:
            continue
        # Check if line is footer url or page number
        if 'forms.cloud.microsoft' in l or 'forms.office.com' in l or re.match(r'^\d+/\d+$', l):
            continue
        if 'When you submit this form' in l or 'Khi bạn gửi biểu mẫu' in l:
            continue
        if 'Mã sinh viên:' in l or 'Họ và tên' in l or 'Lớp học phần' in l or 'Thời gian:' in l or 'Điểm:' in l:
            continue
            
        m_score = re.search(r'(?:\(1\s*(?:Point|Điểm)\)|(?:Không chính xác|Đúng)\s+\d+/\d+\s*Điểm)', l, re.IGNORECASE)
        if m_score:
            prompt = clean_text(' '.join(cur_lines))
            # Extract question number at end if any like "lệnh gì? 4." or "nhau: 5."
            q_num_match = re.search(r'(\d+)\.\s*$', prompt)
            q_num = int(q_num_match.group(1)) if q_num_match else q_counter
            prompt = re.sub(r'\s*\d+\.\s*$', '', prompt).strip()
            
            if prompt and len(prompt) > 5:
                parsed_part_questions.append({
                    'source': f'Part {part_num}',
                    'part_num': part_num,
                    'num': q_num,
                    'id': f'{part_id}_Q{q_num:02d}',
                    'prompt': prompt,
                    'options': cur_options[:],
                    'type': 'mcq' if len(cur_options) > 0 else 'fib'
                })
                q_counter += 1
            cur_options = []
            cur_lines = []
        else:
            # Check if line looks like an option (or option block)
            # In MS Forms without letters A/B/C/D, options are lines preceding the prompt
            if len(l) > 1 and not re.match(r'^\*+\s*$', l):
                if len(cur_lines) > 3:
                    cur_options.append(clean_text(l))
                else:
                    cur_lines.append(l)

print(f"Parsed {len(parsed_part_questions)} questions from Part PDFs.")

with open('data/part_questions_raw.json', 'w', encoding='utf-8') as f:
    json.dump(parsed_part_questions, f, ensure_ascii=False, indent=2)
