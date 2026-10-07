#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Master XSTK Database & Knowledge Base Builder
Compiles 139 mathematically verified questions and Knowledge Hub for Xác Suất Thống Kê (KMA)
Exports:
- data/xstk_questions_db.json
- web/data/xstk_questions.json
- docs/data/xstk_questions.json
- web/xstk_data.js
- docs/xstk_data.js
- web/xstk_knowledge_data.js
- docs/xstk_knowledge_data.js
"""

import json
import os
import sys

sys.path.insert(0, os.path.abspath('.'))
from scripts.solvers.latex_helper import latexify_text, fix_isolated_dollars
from scripts.data_xstk_part1 import RAW_QUESTIONS_PART1
from scripts.data_xstk_part2 import RAW_QUESTIONS_PART2
from scripts.data_xstk_knowledge import XSTK_KNOWLEDGE_DATA

os.makedirs('data', exist_ok=True)
os.makedirs('web/data', exist_ok=True)
os.makedirs('docs/data', exist_ok=True)

# Helper function to generate standardized MCQ questions
# Rotates target_slot across [0, 1, 2, 3] (A, B, C, D) to achieve perfect 25% balance
_slot_counter = 0

def create_q(raw_item, num):
    global _slot_counter
    target_slot = _slot_counter % 4
    _slot_counter += 1

    labels = ['A', 'B', 'C', 'D']
    distractors = raw_item['distractors']
    correct_val = raw_item['correct']
    opts_raw = list(distractors[:3])
    opts_raw.insert(target_slot, correct_val)
    formatted_opts = [f"{labels[i]}. {opts_raw[i]}" for i in range(4)]

    # Clean and latexify
    p_clean = fix_isolated_dollars(raw_item['prompt'])
    exp_clean = fix_isolated_dollars(latexify_text(raw_item['exp']))
    meth_clean = fix_isolated_dollars(latexify_text(raw_item['meth']))
    tips_clean = fix_isolated_dollars(latexify_text(raw_item['tips']))
    opts_clean = [fix_isolated_dollars(opt) for opt in formatted_opts]

    # Verify balance of dollars in all texts
    for field_name, txt in [('prompt', p_clean), ('exp', exp_clean), ('meth', meth_clean), ('tips', tips_clean)]:
        clean_txt = txt.replace(r'\$', '')
        if clean_txt.count('$') % 2 != 0:
            print(f"WARNING: Unbalanced $ in question {raw_item['id']} field {field_name}: {txt}")

    return {
        "id": raw_item['id'],
        "num": num,
        "chapter": raw_item.get('ch_title', f"Chương {raw_item['ch']}"),
        "chapter_id": raw_item['ch'],
        "chapter_title": raw_item.get('ch_title', f"Chương {raw_item['ch']}"),
        "type": "mcq",
        "source": raw_item['src'],
        "source_title": raw_item.get('src_title', raw_item['src']),
        "question_type": raw_item.get('question_type', "Bài tập tính toán"),
        "prompt": p_clean,
        "options": opts_clean,
        "answer": labels[target_slot],
        "explanation": exp_clean,
        "methodology": meth_clean,
        "tips": tips_clean
    }

def main():
    raw_all = RAW_QUESTIONS_PART1 + RAW_QUESTIONS_PART2
    print(f"Total raw questions: {len(raw_all)}")

    processed_questions = []
    for idx, raw_q in enumerate(raw_all, 1):
        processed_q = create_q(raw_q, idx)
        processed_questions.append(processed_q)

    # Validate answers distribution
    ans_dist = {'A': 0, 'B': 0, 'C': 0, 'D': 0}
    for q in processed_questions:
        ans_dist[q['answer']] += 1
    print(f"Answer distribution across {len(processed_questions)} questions: {ans_dist}")

    # 1. Write JSON files
    json_path_data = 'data/xstk_questions_db.json'
    json_path_web = 'web/data/xstk_questions.json'
    json_path_docs = 'docs/data/xstk_questions.json'

    for p in [json_path_data, json_path_web, json_path_docs]:
        with open(p, 'w', encoding='utf-8') as f:
            json.dump(processed_questions, f, ensure_ascii=False, indent=2)
        print(f"Saved: {p}")

    # 2. Write Questions JS files (window.XSTK_QUESTIONS_DATA)
    js_content_questions = "// XSTK Master Question Database - Exported with " + str(len(processed_questions)) + " curated questions\n"
    js_content_questions += "window.XSTK_QUESTIONS_DATA = " + json.dumps(processed_questions, ensure_ascii=False, indent=2) + ";\n"

    for p in ['web/xstk_data.js', 'docs/xstk_data.js']:
        with open(p, 'w', encoding='utf-8') as f:
            f.write(js_content_questions)
        print(f"Saved: {p}")

    # 3. Write Knowledge JS files (window.XSTK_KNOWLEDGE_DATA)
    js_content_knowledge = "// XSTK Knowledge Base (Auto-generated)\n"
    js_content_knowledge += "window.XSTK_KNOWLEDGE_DATA = " + json.dumps(XSTK_KNOWLEDGE_DATA, ensure_ascii=False, indent=2) + ";\n"

    for p in ['web/xstk_knowledge_data.js', 'docs/xstk_knowledge_data.js']:
        with open(p, 'w', encoding='utf-8') as f:
            f.write(js_content_knowledge)
        print(f"Saved: {p}")

    print("\nMaster XSTK Build Completed Successfully!")

if __name__ == '__main__':
    main()
