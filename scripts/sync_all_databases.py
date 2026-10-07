"""Publish canonical question banks without overwriting knowledge or JS aliases."""
import json
from pathlib import Path
import re
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
BANKS = (
    ('questions_db.json', 'data.js', 'QUESTIONS_DATABASE', ('questions.json', 'questions_db.json')),
    ('vldc_questions_db.json', 'vldc_data.js', 'VLDC_QUESTIONS_DATA', ('vldc_questions.json',)),
    ('xstk_questions_db.json', 'xstk_data.js', 'XSTK_QUESTIONS_DATA', ('xstk_questions.json',)),
    ('tthcm_questions_db.json', 'tthcm_data.js', 'TTHCM_QUESTIONS_DATA', ('tthcm_questions.json',)),
)


def replace_question_assignment(template, global_name, questions):
    match = re.search(r'window\.' + re.escape(global_name) + r'\s*=\s*', template)
    if not match:
        raise ValueError(f'Missing question assignment: {global_name}')
    start = match.end()
    _, length = json.JSONDecoder().raw_decode(template[start:])
    return template[:start] + json.dumps(questions, ensure_ascii=False, indent=2) + template[start + length:]


def sync_databases():
    # Validate every source/template before writing any generated file.
    generated = []
    for filename, jsname, global_name, mirrors in BANKS:
        questions = json.loads((ROOT / 'data' / filename).read_text(encoding='utf-8'))
        encoded = json.dumps(questions, ensure_ascii=False, indent=2) + '\n'
        template = (ROOT / 'web' / jsname).read_text(encoding='utf-8')
        generated.append((ROOT / 'web' / jsname, replace_question_assignment(template, global_name, questions)))
        generated.extend((ROOT / 'web/data' / mirror, encoded) for mirror in mirrors)
        print(f'Syncing {filename}: {len(questions)} questions...')
    for path, text in generated:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text, encoding='utf-8')
    subprocess.run([sys.executable, str(ROOT / 'scripts/sync_site.py')], cwd=ROOT, check=True)


if __name__ == '__main__':
    sync_databases()
