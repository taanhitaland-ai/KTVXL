import json
import os
import re

subjects = [
    ('ktvxl', 'data/questions_db.json'),
    ('tthcm', 'data/tthcm_questions_db.json'),
    ('vldc', 'data/vldc_questions_db.json'),
    ('xstk', 'data/xstk_questions_db.json')
]

report = {
    'total': 0,
    'missing_fields': [],
    'missing_images': [],
    'answer_contradictions': [],
    'latex_issues': []
}

for subj, path in subjects:
    if not os.path.exists(path):
        print(f"Missing file: {path}")
        continue
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    print(f"Checking {subj.upper()}: {len(data)} questions...")
    report['total'] += len(data)

    for idx, q in enumerate(data):
        qid = q.get('id', f"{subj}_{idx}")
        prompt = q.get('prompt', '').strip()
        ans = str(q.get('answer', q.get('correct_answer', ''))).strip()
        expl = q.get('explanation', '').strip()
        options = q.get('options', [])
        images = q.get('images', [])

        # 1. Missing fields
        if not prompt or not ans or not expl:
            report['missing_fields'].append({
                'subj': subj, 'id': qid,
                'has_prompt': bool(prompt),
                'has_ans': bool(ans),
                'has_expl': bool(expl)
            })

        # 2. Missing image files
        for img in images:
            # check both web/ and web/assets/
            clean_img = img.lstrip('/')
            full_path1 = os.path.join('web', clean_img)
            full_path2 = os.path.join('.', clean_img)
            if not os.path.exists(full_path1) and not os.path.exists(full_path2):
                report['missing_images'].append({
                    'subj': subj, 'id': qid, 'img': img
                })

        # 3. Contradictions between answer letter and explanation
        if ans in ['A', 'B', 'C', 'D'] and expl:
            # Check for patterns like "Đáp án đúng là B", "Chọn đáp án C", "-> Đáp án: D", "=> A"
            patterns = [
                r'(?:đáp án đúng(?: là)?|chọn(?: đáp án)?|kết luận|phương án đúng(?: là)?)\s*[:\s\-–]\s*([A-D])\b',
                r'(?:=>|⇒|->)\s*(?:đáp án\s*)?([A-D])\b'
            ]
            for pat in patterns:
                m = re.findall(pat, expl, re.IGNORECASE)
                if m:
                    last_mention = m[-1].upper()
                    if last_mention != ans:
                        report['answer_contradictions'].append({
                            'subj': subj, 'id': qid,
                            'marked_answer': ans,
                            'expl_says': last_mention,
                            'prompt': prompt[:80],
                            'expl_snippet': expl[-150:]
                        })
                        break

        # 4. LaTeX unclosed delimiters
        if '$' in prompt and prompt.count('$') % 2 != 0:
            report['latex_issues'].append({'subj': subj, 'id': qid, 'field': 'prompt'})
        if '$' in expl and expl.count('$') % 2 != 0:
            report['latex_issues'].append({'subj': subj, 'id': qid, 'field': 'explanation'})

print("\n=== FIRST-PASS AUDIT SUMMARY ===")
print(f"Total questions scanned: {report['total']}")
print(f"Missing fields: {len(report['missing_fields'])}")
print(f"Missing images: {len(report['missing_images'])}")
print(f"Answer-Explanation Contradictions: {len(report['answer_contradictions'])}")
print(f"Unclosed LaTeX tags: {len(report['latex_issues'])}")

if report['answer_contradictions']:
    print("\n--- SAMPLE CONTRADICTIONS FOUND ---")
    for item in report['answer_contradictions'][:15]:
        print(f"[{item['subj'].upper()}] {item['id']}: Marked={item['marked_answer']} vs Expl={item['expl_says']}")
        print(f"  Prompt: {item['prompt']}")
        print(f"  Snippet: {item['expl_snippet']}\n")

with open('data/audit_first_pass_report.json', 'w', encoding='utf-8') as f:
    json.dump(report, f, ensure_ascii=False, indent=2)
print("Report saved to data/audit_first_pass_report.json")
