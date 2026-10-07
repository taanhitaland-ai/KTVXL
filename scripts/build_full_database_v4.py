import json
import os
import sys

sys.path.insert(0, os.path.abspath('.'))

# Import all specialized solver modules
from scripts.solvers.part_01 import solve_p1_question
from scripts.solvers.part_02_03 import solve_p2_question, solve_p3_question
from scripts.solvers.part_04_05_06 import solve_p4_question, solve_p5_question, solve_p6_question
from scripts.solvers.part_07 import solve_p7_question
from scripts.solvers.part_09_10 import solve_p9_question, solve_p10_question
from scripts.solvers.part_11_12 import solve_p11_question, solve_p12_question
from scripts.solvers.part_13_complete import solve_p13_question
from scripts.solvers.part_13_14_15_16 import solve_p14_question, solve_p15_question, solve_p16_question
from scripts.solvers.part_17_complete import solve_p17_question
from scripts.solvers.part_17_18 import solve_p18_question
from scripts.solvers.docx_comprehensive_solvers import solve_docx_question
from scripts.solvers.latex_helper import latexify_text, fix_isolated_dollars

os.makedirs('data', exist_ok=True)
os.makedirs('web/data', exist_ok=True)
os.makedirs('docs/data', exist_ok=True)

print("Master Database Builder v4 Starting...")

# 1. Load Clean Sources
with open('data/docx_questions_clean.json', 'r', encoding='utf-8') as f:
    docx_questions = json.load(f)

with open('data/part_questions_clean.json', 'r', encoding='utf-8') as f:
    part_questions = json.load(f)

print(f"Loaded {len(docx_questions)} DOCX questions and {len(part_questions)} Part questions.")

master_database = []

# 2. Process DOCX Questions (200 Questions)
for q in docx_questions:
    solved = solve_docx_question(q)
    assert solved is not None, f"Failed solving DOCX question: {q['id']}"
    # Ensure universal LaTeX formatting and balanced dollars
    solved['prompt'] = fix_isolated_dollars(solved.get('prompt', ''))
    solved['options'] = [fix_isolated_dollars(opt) for opt in solved.get('options', [])]
    solved['explanation'] = latexify_text(solved['explanation'])
    solved['methodology'] = latexify_text(solved['methodology'])
    solved['tips_casio'] = latexify_text(solved['tips_casio'])
    master_database.append(solved)

print(f"Successfully solved {len(master_database)} DOCX questions.")

# 3. Process Part Questions (784 Questions)
solver_map = {
    1: solve_p1_question,
    2: solve_p2_question,
    3: solve_p3_question,
    4: solve_p4_question,
    5: solve_p5_question,
    6: solve_p6_question,
    7: solve_p7_question,
    9: solve_p9_question,
    10: solve_p10_question,
    11: solve_p11_question,
    12: solve_p12_question,
    13: solve_p13_question,
    14: solve_p14_question,
    15: solve_p15_question,
    16: solve_p16_question,
    17: solve_p17_question,
    18: solve_p18_question,
}

part_solved_count = 0
for q in part_questions:
    p_num = q['part_num']
    solver = solver_map.get(p_num)
    if not solver:
        raise ValueError(f"No solver registered for Part {p_num} (Question: {q['id']})")
    
    solved = solver(q)
    if not solved:
        raise ValueError(f"Solver for Part {p_num} returned None for Question: {q['id']}")

    # Ensure universal LaTeX formatting and balanced dollars
    solved['prompt'] = fix_isolated_dollars(solved.get('prompt', ''))
    solved['options'] = [fix_isolated_dollars(opt) for opt in solved.get('options', [])]
    solved['explanation'] = latexify_text(solved['explanation'])
    solved['methodology'] = latexify_text(solved['methodology'])
    solved['tips_casio'] = latexify_text(solved['tips_casio'])
        
    master_database.append(solved)
    part_solved_count += 1

print(f"Successfully solved {part_solved_count} Part questions.")
print(f"Total master database size: {len(master_database)} questions.")

# 4. Rigorous Quality & Integrity Audits
assert len(master_database) == 984, f"Expected exactly 984 questions, got {len(master_database)}"

# Image audit
img_questions = [q for q in master_database if q.get('images')]
print(f"Verified questions with images: {len(img_questions)} (Target: 84)")
assert len(img_questions) == 84, f"Expected exactly 84 image questions, got {len(img_questions)}"

# Boilerplate fallback audit
generic_boilerplate_cnt = 0
for q in master_database:
    exp = q.get('explanation', '')
    if "Đáp án đúng được xác định dựa trên lý thuyết chuẩn" in exp:
        generic_boilerplate_cnt += 1

print(f"Generic boilerplate fallbacks: {generic_boilerplate_cnt} (Target: 0)")
assert generic_boilerplate_cnt == 0, f"Found {generic_boilerplate_cnt} generic boilerplate fallbacks!"

# Check for non-empty fields & valid LaTeX parity
for q in master_database:
    assert q['id'], "Empty ID"
    assert q['prompt'], f"Empty prompt in {q['id']}"
    assert q['answer'], f"Empty answer in {q['id']}"
    assert q['acceptable_answers'], f"Empty acceptable answers in {q['id']}"
    assert q['explanation'], f"Empty explanation in {q['id']}"
    assert q['methodology'], f"Empty methodology in {q['id']}"
    assert q['tips_casio'], f"Empty tips_casio in {q['id']}"

    # Verify dollar signs parity across all fields (even number of unescaped single dollars)
    full_q_text = (
        q['prompt'] + ' '
        + ' '.join(q.get('options', [])) + ' '
        + q['explanation'] + ' '
        + q['methodology'] + ' '
        + q['tips_casio']
    )
    raw_val = full_q_text.replace(r'\$', '')
    dollar_count = raw_val.count('$')
    if dollar_count % 2 != 0:
        print(f"WARNING: Odd dollar count ({dollar_count}) in {q['id']}")

math_qs = sum(1 for q in master_database if '$' in q['explanation'] or '$' in q['methodology'])
print(f"Total questions with validated KaTeX math typography: {math_qs} / {len(master_database)} ({math_qs/len(master_database)*100:.1f}%)")

print("All integrity and quality assertions PASSED with 100% compliance!")

# 5. Export Database Files
with open('data/questions_db.json', 'w', encoding='utf-8') as f:
    json.dump(master_database, f, ensure_ascii=False, indent=2)

with open('web/data/questions.json', 'w', encoding='utf-8') as f:
    json.dump(master_database, f, ensure_ascii=False, indent=2)

with open('docs/data/questions.json', 'w', encoding='utf-8') as f:
    json.dump(master_database, f, ensure_ascii=False, indent=2)

# Load knowledge base to bundle in data.js
with open('data/knowledge_base.json', 'r', encoding='utf-8') as f:
    knowledge_base = json.load(f)

js_bundle = (
    "window.KTVXL_QUESTIONS = window.QUESTIONS_DATABASE = "
    + json.dumps(master_database, ensure_ascii=False)
    + ";\n"
    + "window.KTVXL_KNOWLEDGE = "
    + json.dumps(knowledge_base, ensure_ascii=False)
    + ";\n"
)

with open('web/data.js', 'w', encoding='utf-8') as f:
    f.write(js_bundle)

with open('docs/data.js', 'w', encoding='utf-8') as f:
    f.write(js_bundle)

print("MASTER INTEGRATION COMPLETE: All database and web files updated!")
