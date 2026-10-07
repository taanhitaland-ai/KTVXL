"""Conservative, repeatable fixes to IDs and formula typography; keep answer keys."""
from pathlib import Path
import json
import re
from normalize_physics import normalize_physics_metadata, normalize_physics_knowledge

ROOT = Path(__file__).resolve().parents[1]


def ensure_unique_ids(questions):
    used = set()
    for question in questions:
        original = question['id']
        candidate, suffix = original, 2
        while candidate in used:
            candidate = f'{original}_{suffix}'
            suffix += 1
        question['id'] = candidate
        used.add(candidate)
    return questions


# Explicit formulas preserve even the intentionally wrong distractors.
FORMULA_OPTIONS = {
    'vldc_nc_004': [r'e = \frac{hc(1/\lambda_2 + 1/\lambda_1)}{U_2-U_1}', r'e = \frac{hc(1/\lambda_1 - 1/\lambda_2)}{U_1-U_2}', r'e = \frac{hc(1/\lambda_1 - 1/\lambda_2)}{U_2+U_1}', r'e = \frac{hc(1/\lambda_2 - 1/\lambda_1)}{U_2-U_1}'],
    'vldc_nc_005': [r'n = 1,2,3,4,\ldots,n-1', r'n = 1,2,3,4,\ldots$ (các số nguyên dương) $', r'n = 0,1,2,3,4,\ldots', r'n = 0,\pm1,\pm2,\pm3,\ldots'],
    'vldc_nc_006': [r'0', r'\sqrt{6}\,\hbar', r'\sqrt{12}\,\hbar', r'\sqrt{2}\,\hbar'],
    'vldc_nc_007': [r'\Delta\Psi(\vec r)+\frac{2m}{\hbar^2}W\Psi(\vec r)=0', r'\Delta\Psi(\vec r)+\frac{2m}{\hbar}[W-U(\vec r)]\Psi(\vec r)=0', r'\Delta\Psi(\vec r)+\frac{2m}{\hbar}[W+U(\vec r)]\Psi(\vec r)=0', r'\Delta\Psi(\vec r)-\frac{2m}{\hbar}W\Psi(\vec r)=0'],
    'vldc_nc_008': [r'\Delta j=0,\pm1$ (trừ bước chuyển $0\to0$) $', r'\Delta j=\pm1', r'\Delta j=\pm n', r'\Delta j=0'],
    'vldc_nc_012': [r'n=2', r'n=\frac54', r'n=\frac43', r'n=\frac32'],
    'vldc_nc_017': [r'q=2{,}5\times10^{-6}\sin(2000\pi t-\pi/2)\,\mathrm C', r'q=2{,}5\times10^{-6}\cos(2000\pi t+\pi)\,\mathrm C', r'q=2{,}5\times10^{-6}\sin(2000\pi t)\,\mathrm C', r'q=2{,}5\times10^{-6}\cos(2000\pi t)\,\mathrm C'],
    'vldc_nc_018': [r'\frac T2', r'2T', r'T', r'\frac{3T}{2}'],
    'vldc_nc_022': [r'i=\frac{\lambda D}{2d(n-1)A}', r'i=\frac{2d(n-1)A}{\lambda D}', r'i=\frac{\lambda d}{2D(n-1)A}', r'i=\frac{2D(n-1)A}{\lambda d}'],
    'vldc_nc_026': [r'e^{-\beta t}', r'e^{-\beta t/2}', r'e^{-2\beta t}', r'e^{\beta t}'],
    'vldc_nc_033': [r'x=\frac a2', r'x=a', r'x=0', r'x=\frac a4$ hoặc $x=\frac{3a}{4}'],
    'vldc_nc_039': [r'n=2;\ l=0', r'n=1;\ l=0', r'n=1;\ l=1', r'n=2;\ l=1'],
    'vldc_nc_040': [r'n=\frac54', r'n=\frac43', r'n=1{,}0', r'n=1{,}5'],
    'vldc_n100_008': [r'x=\frac{5\alpha}{\lambda}', r'x=\frac{10\alpha}{\lambda}', r'x=\frac{5\lambda}{\alpha}', r'x=\frac{10\lambda}{\alpha}'],
    'vldc_n100_009': [r'i=\frac{\lambda}{aD}', r'i=\frac{\lambda a}{D}', r'i=\frac{aD}{\lambda}', r'i=\frac{\lambda D}{a}'],
    'vldc_n100_028': [r'R(T)=\sigma T^3', r'R(T)=\sigma T^4', r'R(T)=\sigma T^5', r'R(T)=\sigma^2T^4'],
}

EMBEDDED = {
    'x = a / 2': r'$x=\frac a2$',
    'x = a / 4': r'$x=\frac a4$',
    'x = 3a / 4': r'$x=\frac{3a}{4}$',
    'x = 0': r'$x=0$',
    'x = a': r'$x=a$',
    "r' = r / 1.2": r"$r'=\frac r{1.2}$",
    "r' = 1.2 * r": r"$r'=1.2r$",
    "r' = r / 1.44": r"$r'=\frac r{1.44}$",
    'n = 3': r'$n=3$', 'n = 2': r'$n=2$', 'n = 4': r'$n=4$',
    'n = 1': r'$n=1$', 'n = ∞': r'$n=\infty$',
    'Hα': r'$H_\alpha$', 'Hβ': r'$H_\beta$',
    'λ1': r'$\lambda_1$', 'λ2': r'$\lambda_2$',
    'λ/4': r'$\lambda/4$', 'π/2': r'$\pi/2$',
    'λ ≈ 1.66 × 10⁻³⁴ m': r'$\lambda\approx1.66\times10^{-34}\,\mathrm m$',
    'λ ≈ 1.66 × 10⁻¹⁰ m': r'$\lambda\approx1.66\times10^{-10}\,\mathrm m$',
    'λ ≈ 6.63 × 10⁻³⁴ m': r'$\lambda\approx6.63\times10^{-34}\,\mathrm m$',
    '|ψ|² dV = 1': r'$|\psi|^2\,dV=1$',
    't = 0': r'$t=0$',
    'p = h / λ': r'$p=\frac h\lambda$',
    'p⃗ = h k⃗': r'$\vec p=h\vec k$',
    'E = hν': r'$E=h\nu$',
    'E = ℏω': r'$E=\hbar\omega$',
    'c = 3.10⁸ m/s': r'$c=3\times10^8\,\mathrm{m/s}$',
    'ε = hν': r'$\varepsilon=h\nu$',
    'f(ν, T) = ∞ khi ν → ∞': r'$f(\nu,T)=\infty$ khi $\nu\to\infty$',
    'Giảm đi √2 lần': r'Giảm đi $\sqrt2$ lần',
    'a ≤ 1': r'$a\le1$',
    'k = ±5, ±10, ±15,...': r'$k=\pm5,\pm10,\pm15,\ldots$',
    'k = ±1, ±2, ±3,...': r'$k=\pm1,\pm2,\pm3,\ldots$',
    'k = ±2, ±4, ±6,...': r'$k=\pm2,\pm4,\pm6,\ldots$',
    'k = ±3, ±6, ±9,...': r'$k=\pm3,\pm6,\pm9,\ldots$',
    'λ = h/p': r'$\lambda=\frac hp$',
    'U₀ > E': r'$U_0>E$',
    'U₀': r'$U_0$',
    'động lượng px': r'động lượng $p_x$',
    'Ψ(r⃗, t)': r'$\Psi(\vec r,t)$',
    '|Ψ|²': r'$|\Psi|^2$',
    'r⃗ = r⃗(t)': r'$\vec r=\vec r(t)$',
    'v⃗(t)': r'$\vec v(t)$',
    'a⃗(t)': r'$\vec a(t)$',
    'phía S2': r'phía $S_2$',
    'phía S1': r'phía $S_1$',
}

UNITS = {'μm': r'\mu\mathrm{m}', 'kg·m/s': r'\mathrm{kg}\cdot\mathrm{m/s}', 'm/s': r'\mathrm{m/s}', 'MeV': r'\mathrm{MeV}', 'mm': r'\mathrm{mm}', 'cm': r'\mathrm{cm}', 'pm': r'\mathrm{pm}', 'nm': r'\mathrm{nm}', 'rad': r'\mathrm{rad}', 'Wb': r'\mathrm{Wb}', 'kg': r'\mathrm{kg}', 'Å': r'\text{Å}', 'm': r'\mathrm{m}', 's': r'\mathrm{s}', 'V': r'\mathrm{V}'}
SUPERSCRIPTS = str.maketrans('⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺', '0123456789-+')


def numeric_formula(text):
    """Only convert standalone numeric answers and their units, never prose."""
    if '$' in text:
        return text
    chunks = re.split(r' (và|hoặc) ', text)
    output = []
    for chunk in chunks:
        if chunk in ('và', 'hoặc'):
            output.append(f' {chunk} ')
            continue
        if not re.match(r'^(?:[A-Za-zαλ]+(?:max)?\s*=\s*)?[\d±]', chunk):
            return text
        expr = re.sub(r'[⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺]+', lambda m: '^{' + m[0].translate(SUPERSCRIPTS) + '}', chunk)
        expr = re.sub(r'(?<=\d)\.10', lambda _: r'\times10', expr)
        expr = re.sub(r'(?<=\d),(?=\d)', '{,}', expr)
        expr = expr.replace('λmax', r'\lambda_{\max}').replace('λ', r'\lambda').replace('α', r'\alpha').replace('°', r'^\circ')
        expr = re.sub(r"(?<=\d)'", lambda _: r"^{\prime}", expr)
        for unit in sorted(UNITS, key=len, reverse=True):
            if expr.endswith(' ' + unit):
                expr = expr[:-len(unit)].rstrip() + r'\,' + UNITS[unit]
                break
        noun = next((word for word in ('nguyên tử', 'electron', 'lần', 'vân', 'orbital') if expr.endswith(' ' + word)), '')
        if noun:
            expr = expr[:-len(noun)].rstrip()
        output.append('$' + expr + '$' + (' ' + noun if noun else ''))
    return ''.join(output)


def normalize_vldc_questions(questions):
    normalize_physics_metadata(questions)
    for q in questions:
        if q['id'] in FORMULA_OPTIONS:
            # Strip empty delimiter pairs used to close prose annotations.
            q['options'] = [f'{chr(65+i)}. ${expr}$'.replace(' $$', '').rstrip() for i, expr in enumerate(FORMULA_OPTIONS[q['id']])]
            continue
        for index, option in enumerate(q.get('options', [])):
            prefix = f'{chr(65+index)}. '
            body = option.removeprefix(prefix)
            pieces = re.split(r'(\$[^$]*\$)', body)
            for part_index in range(0, len(pieces), 2):
                for old, new in sorted(EMBEDDED.items(), key=lambda item: len(item[0]), reverse=True):
                    pieces[part_index] = pieces[part_index].replace(old, new)
            body = ''.join(pieces)
            body = body.replace(' lần$', '$ lần').replace(' vân$', '$ vân')
            q['options'][index] = prefix + numeric_formula(body)
    return questions


def write_questions(subject, questions):
    prefix = 'tthcm' if subject == 'tthcm' else 'vldc'
    text = json.dumps(questions, ensure_ascii=False, indent=2) + '\n'
    (ROOT / f'data/{prefix}_questions_db.json').write_text(text, encoding='utf-8')
    for directory in ('web', 'docs'):
        (ROOT / f'{directory}/data/{prefix}_questions.json').write_text(text, encoding='utf-8')
        global_name = 'TTHCM_QUESTIONS_DATA' if subject == 'tthcm' else 'VLDC_QUESTIONS_DATA'
        if subject == 'vldc':
            bundle = f'// VLDC Master Question Database - Exported with {len(questions)} curated questions\n'
            bundle += f'window.{global_name} = {json.dumps(questions, ensure_ascii=False, indent=2)};\n\n'
            bundle += "if (typeof module !== 'undefined' && module.exports) {\n    module.exports = { VLDC_QUESTIONS_DATA: window.VLDC_QUESTIONS_DATA };\n}\n"
        else:
            bundle = f'// TƯ TƯỞNG HỒ CHÍ MINH QUESTION DATABASE\nwindow.{global_name} = {json.dumps(questions, ensure_ascii=False)};\n'
        (ROOT / f'{directory}/{prefix}_data.js').write_text(bundle, encoding='utf-8')


def main():
    tthcm = json.loads((ROOT / 'data/tthcm_questions_db.json').read_text(encoding='utf-8'))
    vldc = json.loads((ROOT / 'data/vldc_questions_db.json').read_text(encoding='utf-8'))
    write_questions('tthcm', ensure_unique_ids(tthcm))
    write_questions('vldc', normalize_vldc_questions(vldc))
    knowledge = json.loads((ROOT / 'data/vldc_knowledge_base.json').read_text(encoding='utf-8'))
    normalize_physics_knowledge(knowledge)
    (ROOT / 'data/vldc_knowledge_base.json').write_text(json.dumps(knowledge, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    for directory in ('web', 'docs'):
        (ROOT / f'{directory}/vldc_knowledge_data.js').write_text('window.VLDC_KNOWLEDGE_DATA = ' + json.dumps(knowledge, ensure_ascii=False, indent=2) + ';\n', encoding='utf-8')
    print('Normalized duplicate IDs and physics answer formulas.')


if __name__ == '__main__':
    main()
