"""Check structural integrity, static assets and exact deployed-source parity."""
import json
from pathlib import Path
import re
import sys
from html.parser import HTMLParser

ROOT = Path(__file__).resolve().parents[1]


class PageAssets(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids, self.references = [], []

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        if attrs.get('id'):
            self.ids.append(attrs['id'])
        for key in ('src', 'href'):
            value = attrs.get(key, '')
            if value and not value.startswith(('#', 'data:', 'https:', 'http:')):
                self.references.append(value.split('#')[0].split('?')[0])


def bundle_value(filename, global_name):
    text = (ROOT / 'web' / filename).read_text(encoding='utf-8')
    match = re.search(r'window\.' + global_name + r'\s*=\s*', text)
    if not match:
        raise ValueError(f'Missing {global_name} in {filename}')
    return json.JSONDecoder().raw_decode(text[match.end():])[0]


def full_audit():
    issues = []
    total = 0
    for subject, filename, global_name in [
        ('KTVXL', 'data.js', 'QUESTIONS_DATABASE'),
        ('TTHCM', 'tthcm_data.js', 'TTHCM_QUESTIONS_DATA'),
        ('VLDC', 'vldc_data.js', 'VLDC_QUESTIONS_DATA'),
        ('XSTK', 'xstk_data.js', 'XSTK_QUESTIONS_DATA')
    ]:
        name = 'questions_db.json' if subject == 'KTVXL' else subject.lower() + '_questions_db.json'
        questions = json.loads((ROOT / 'data' / name).read_text(encoding='utf-8'))
        total += len(questions)
        if questions != bundle_value(filename, global_name):
            issues.append(f'{subject}: browser bundle differs from the canonical question database')
        ids = set()
        for q in questions:
            qid = q.get('id')
            if not qid or qid in ids:
                issues.append(f'{subject}: missing/duplicate question ID {qid}')
            ids.add(qid)
            for field in ('prompt', 'explanation'):
                if not str(q.get(field, '')).strip():
                    issues.append(f'{qid}: empty {field}')
            if q.get('type') == 'mcq':
                options = q.get('options', [])
                answer = str(q.get('answer', ''))
                if len(options) < 2 or len(answer) != 1 or not ('A' <= answer <= 'D') or ord(answer)-65 >= len(options):
                    issues.append(f'{qid}: invalid options/answer key')
                if any(not isinstance(option, str) or not option.strip() for option in options):
                    issues.append(f'{qid}: empty or non-text option')
            elif q.get('type') == 'fib':
                if not q.get('acceptable_answers') and q.get('answer') in (None, ''):
                    issues.append(f'{qid}: no fill-in answer')
            else:
                issues.append(f'{qid}: invalid question type')
            if subject != 'KTVXL' and int(q.get('chapter_id') or q.get('chapter') or 0) not in range(1, 9 if subject == 'XSTK' else 7):
                issues.append(f'{qid}: invalid chapter')
            for field in ('prompt', 'options', 'explanation', 'methodology', 'tips_casio', 'tips'):
                values = q.get(field, '')
                for text in values if isinstance(values, list) else [values]:
                    if re.search(r'[\x00-\x08\x0b\x0c\x0e-\x1f]', str(text)):
                        issues.append(f'{qid}: invalid control character in {field}')
                    if str(text).replace(r'\$', '').count('$') % 2:
                        issues.append(f'{qid}: unclosed math delimiter in {field}')
            for image in set(q.get('images', []) + ([q['image']] if q.get('image') else [])):
                for directory in ('web', 'docs'):
                    if not (ROOT / directory / image).is_file():
                        issues.append(f'{qid}: missing {directory}/{image}')
        print(f'{subject}: {len(questions)} questions checked.')
    for filename, global_name, canonical in [
        ('data.js', 'KTVXL_KNOWLEDGE', 'knowledge_base.json'),
        ('tthcm_knowledge_data.js', 'TTHCM_KNOWLEDGE_DATA', 'tthcm_knowledge_base.json'),
        ('vldc_knowledge_data.js', 'VLDC_KNOWLEDGE_DATA', 'vldc_knowledge_base.json'),
    ]:
        if bundle_value(filename, global_name) != json.loads((ROOT / 'data' / canonical).read_text(encoding='utf-8')):
            issues.append(f'{filename}: knowledge bundle differs from the canonical data')
    for directory in ('web', 'docs'):
        page = PageAssets()
        page.feed((ROOT / directory / 'index.html').read_text(encoding='utf-8'))
        if len(page.ids) != len(set(page.ids)):
            issues.append(f'{directory}/index.html: duplicate DOM IDs')
        for reference in page.references:
            if not (ROOT / directory / reference).is_file():
                issues.append(f'{directory}/index.html: missing asset {reference}')
        for filename in ('app.js', 'chapter_diagrams.js', 'vldc_simulations.js', 'xstk_simulations.js'):
            script = (ROOT / directory / filename).read_text(encoding='utf-8')
            for reference in set(re.findall(r"getElementById\('([^']+)'\)", script)):
                if reference not in page.ids:
                    issues.append(f'{directory}/{filename}: missing DOM target #{reference}')
    for source in (ROOT / 'web').rglob('*'):
        if source.is_file():
            mirror = ROOT / 'docs' / source.relative_to(ROOT / 'web')
            if not mirror.is_file() or source.read_bytes() != mirror.read_bytes():
                issues.append(f'web/docs contents differ: {source.relative_to(ROOT / "web")}')
    if issues:
        print('\n'.join(issues[:50]))
        print(f'FAIL: {len(issues)} issues.')
        return 1
    print(f'PASS: {total} questions, static assets, IDs and site-copy parity. Run npm test to check formula syntax and exam selection.')
    return 0


if __name__ == '__main__':
    sys.exit(full_audit())
