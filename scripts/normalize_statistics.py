"""Format statistics formulas without changing options, values or answer keys."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

# Reviewed translations of the existing core formulas; prose stays outside math.
CORE = {
    'Hoán vị, Chỉnh hợp, Tổ hợp': r'$P_n=n!;\quad A_n^k=\frac{n!}{(n-k)!};\quad C_n^k=\frac{n!}{k!(n-k)!}$',
    'Định nghĩa xác suất cổ điển': r'$P(A)=\frac mn=\frac{|A|}{|\Omega|}$',
    'Biến cố đối lập & Xung khắc': r'$P(\overline A)=1-P(A)$. Nếu $A,B$ xung khắc: $P(A\cup B)=P(A)+P(B)$',
    'Xác suất hình học': r'$P(A)=\frac{\operatorname{Mes}(g)}{\operatorname{Mes}(G)}$',
    'Công thức cộng xác suất tổng quát': r'$P(A\cup B)=P(A)+P(B)-P(AB)$',
    'Xác suất có điều kiện & Công thức nhân': r'$P(A\mid B)=\frac{P(AB)}{P(B)}\ \Rightarrow\ P(AB)=P(B)P(A\mid B)$',
    'Công thức xác suất đầy đủ': r'$P(A)=\sum_i P(H_i)P(A\mid H_i)$ với $\{H_i\}$ là hệ đầy đủ',
    'Công thức Bayes (xác suất hậu nghiệm)': r'$P(H_k\mid A)=\frac{P(H_k)P(A\mid H_k)}{P(A)}=\frac{P(H_k)P(A\mid H_k)}{\sum_i P(H_i)P(A\mid H_i)}$',
    'Công thức Bernoulli': r'$P_n(k)=C_n^k p^k q^{n-k}$ với $q=1-p$',
    'Kỳ vọng & Phương sai rời rạc': r'$E(X)=\sum_i x_i p_i;\quad V(X)=E(X^2)-[E(X)]^2=\sum_i x_i^2p_i-[E(X)]^2$',
    'Phân phối Nhị thức B(n, p)': r'$P(X=k)=C_n^k p^k(1-p)^{n-k};\quad E(X)=np;\quad V(X)=np(1-p)$',
    'Phân phối Poisson P(λ)': r'$P(X=k)=\frac{\lambda^k e^{-\lambda}}{k!};\quad E(X)=V(X)=\lambda$',
    'Phân phối Siêu bội H(N, M, n)': r'$P(X=k)=\frac{C_M^k C_{N-M}^{n-k}}{C_N^n};\quad E(X)=n\frac MN$',
    'Mối quan hệ f(x) và F(x)': r"$F(x)=\int_{-\infty}^x f(t)\,dt;\quad f(x)=F'(x);\quad \int_{-\infty}^{+\infty}f(x)\,dx=1$",
    'Kỳ vọng & Phương sai liên tục': r'$E(X)=\int_{-\infty}^{+\infty}xf(x)\,dx;\quad V(X)=\int_{-\infty}^{+\infty}x^2f(x)\,dx-[E(X)]^2$',
    'Phân phối Chuẩn N(μ, σ²)': r'$f(x)=\frac1{\sigma\sqrt{2\pi}}e^{-(x-\mu)^2/(2\sigma^2)};\quad E(X)=\mu;\quad V(X)=\sigma^2$',
    'Quy tắc 3-Sigma (3σ)': r'$P(|X-\mu|<3\sigma)=2\Phi(3)-1\approx0.9973\ (99.73\%)$',
    'Phân phối Đều U(a, b) & Phân phối Mũ Exp(λ)': r'$U(a,b):\ E(X)=\frac{a+b}2,\ V(X)=\frac{(b-a)^2}{12}$. $\operatorname{Exp}(\lambda):\ f(x)=\lambda e^{-\lambda x},\ E(X)=\frac1\lambda,\ V(X)=\frac1{\lambda^2}$',
    'Phân phối xác suất biên': r'$P(X=x_i)=p_i=\sum_j p_{ij};\quad P(Y=y_j)=q_j=\sum_i p_{ij};\quad \sum_i\sum_j p_{ij}=1$',
    'Điều kiện độc lập của X và Y': r'$P(X=x_i,Y=y_j)=P(X=x_i)P(Y=y_j)$ với mọi $i,j$',
    'Hiệp phương sai Cov(X, Y)': r'$\operatorname{Cov}(X,Y)=E(XY)-E(X)E(Y)=\sum_i\sum_j x_i y_j p_{ij}-E(X)E(Y)$',
    'Hệ số tương quan ρXY (hoặc rXY)': r'$\rho_{XY}=\frac{\operatorname{Cov}(X,Y)}{\sigma(X)\sigma(Y)};\quad -1\le\rho_{XY}\le1$',
    'Trung bình mẫu & Phương sai mẫu hiệu chỉnh': r'$\bar x=\frac1n\sum_i n_ix_i;\quad s_*^2=\frac1{n-1}\sum_i n_i(x_i-\bar x)^2=\frac n{n-1}s^2$',
    'Công thức tính nhanh phương sai mẫu': r'$s^2=\frac1n\sum_i n_ix_i^2-\bar x^2;\quad s_*^2=\frac n{n-1}\left(\frac1n\sum_i n_ix_i^2-\bar x^2\right)$',
    'Tỷ lệ mẫu F (hoặc p̂)': r'$f=\frac mn$',
    'Các định lý giới hạn trung tâm': r'Nếu $\sigma$ đã biết: $Z=\frac{\bar X-\mu}{\sigma/\sqrt n}\sim N(0,1)$. Nếu $\sigma$ chưa biết: $T=\frac{\bar X-\mu}{S_*/\sqrt n}\sim t_{n-1}$',
    'Ước lượng kỳ vọng μ (Đã biết σ²)': r'$\mu\in(\bar x-\varepsilon,\bar x+\varepsilon)$ với $\varepsilon=u_{\alpha/2}\frac\sigma{\sqrt n}$',
    'Ước lượng kỳ vọng μ (Chưa biết σ², n < 30)': r'$\mu\in(\bar x-\varepsilon,\bar x+\varepsilon)$ với $\varepsilon=t_{\alpha/2}^{n-1}\frac{s_*}{\sqrt n}$',
    'Ước lượng kỳ vọng μ (Chưa biết σ², n ≥ 30)': r'$\mu\in(\bar x-\varepsilon,\bar x+\varepsilon)$ với $\varepsilon=u_{\alpha/2}\frac{s_*}{\sqrt n}$',
    'Ước lượng tỷ lệ p của tổng thể': r'$p\in(f-\varepsilon,f+\varepsilon)$ với $\varepsilon=u_{\alpha/2}\sqrt{\frac{f(1-f)}n}$',
    'Xác định kích thước mẫu tối thiểu n': r'Cho kỳ vọng: $n\ge\left(\frac{u_{\alpha/2}s_*}\varepsilon\right)^2$. Cho tỷ lệ: $n\ge\frac{u_{\alpha/2}^2 f(1-f)}{\varepsilon^2}$',
    'Kiểm định giả thuyết về kỳ vọng μ (σ đã biết)': r'$Z_{\mathrm{qs}}=\frac{\bar x-\mu_0}{\sigma/\sqrt n};\quad H_1:\mu\ne\mu_0\ \Rightarrow\ W_\alpha=\{|Z|>u_{\alpha/2}\}$',
    'Kiểm định giả thuyết về kỳ vọng μ (σ chưa biết, n < 30)': r'$T_{\mathrm{qs}}=\frac{\bar x-\mu_0}{s_*/\sqrt n};\quad H_1:\mu\ne\mu_0\ \Rightarrow\ W_\alpha=\{|T|>t_{\alpha/2}^{n-1}\}$',
    'Kiểm định giả thuyết về tỷ lệ p': r'$Z_{\mathrm{qs}}=\frac{f-p_0}{\sqrt{p_0(1-p_0)/n}};\quad H_1:p\ne p_0\ \Rightarrow\ W_\alpha=\{|Z|>u_{\alpha/2}\}$',
    'Quy tắc ra quyết định kiểm định': r'Nếu tiêu chuẩn quan sát $\in W_\alpha$: BÁC BỎ $H_0$. Nếu tiêu chuẩn quan sát $\notin W_\alpha$: CHƯA ĐỦ CƠ SỞ BÁC BỎ $H_0$.',
}

SYMBOLS = {'μ': r'\mu', 'σ': r'\sigma', 'χ': r'\chi', '≈': r'\approx', '≤': r'\le', '≥': r'\ge', '≠': r'\ne', '∞': r'\infty'}

CHAPTER_NAMES = {
    1: 'Biến cố ngẫu nhiên & Định nghĩa xác suất',
    2: 'Các quy tắc tính xác suất cơ bản',
    3: 'Đại lượng ngẫu nhiên rời rạc & Phân phối',
    4: 'Đại lượng ngẫu nhiên liên tục & Phân phối',
    5: 'Đại lượng ngẫu nhiên hai chiều',
    6: 'Thống kê mô tả & Lý thuyết mẫu',
    7: 'Ước lượng tham số',
    8: 'Kiểm định giả thuyết thống kê',
}

# IDs remain stable for saved progress. These source groups were labelled using
# a different chapter outline from the eight-chapter knowledge hub.
CHAPTER_CORRECTIONS = {
    **{f'xstk_ch3_{i:03}': 2 for i in range(1, 15)},
    **{f'xstk_ch4_{i:03}': 2 for i in range(1, 23)},
    **{f'xstk_ch5_{i:03}': (5 if i in (12, 13, 14, 15, 17) else 3) for i in range(1, 20)},
    **{f'xstk_ch6_{i:03}': (5 if i in (13, 15, 22, 23) else 4) for i in range(1, 24)},
    'xstk_ch7_013': 6,
}


def expression(text):
    for old, new in SYMBOLS.items():
        text = text.replace(old, new + ' ')
    text = re.sub(r'(?<=\d),(?=\d)', '{,}', text)
    text = re.sub(r'(?<![\w\\])(\d+)/(\d+)', lambda m: r'\frac{' + m[1] + '}{' + m[2] + '}', text)
    text = text.replace('%', r'\%').replace('*', r'\cdot ')
    return text.replace(';', r';\quad ')


def option_math(text):
    if '$' in text:
        return text
    prefix, body = text[:3], text[3:]
    original_body = body
    # A complete expression, optionally followed by a unit or counted noun.
    suffix = ''
    for noun in ('phút', 'giờ', 'ngày', 'lít', 'tạ/ha', 'ppm', 'cm', 'g', 'm', 'con', 'điểm', 'cử tri', 'lần'):
        if body.endswith(' ' + noun):
            body, suffix = body[:-len(noun)].rstrip(), ' ' + noun
            break
    if re.fullmatch(r'[A-Za-z0-9\s.,;:=~≈±+*/^()_\[\]{}|<>%\-μσχ]+', body):
        return prefix + '$' + expression(body) + '$' + suffix
    if '; ' in original_body:
        return prefix + '; '.join(option_math('A. ' + part)[3:] for part in original_body.split('; '))
    # These four options deliberately retain the distractor formulas.
    explicit = {
        'Tiêu chuẩn Fisher F = s1^2 / s2^2': r'Tiêu chuẩn Fisher $F=\frac{s_1^2}{s_2^2}$',
        'Tiêu chuẩn Student t = (s1 - s2) / s_p': r'Tiêu chuẩn Student $t=\frac{s_1-s_2}{s_p}$',
        'Tiêu chuẩn Chi-bình phương χ^2 = s1^2 - s2^2': r'Tiêu chuẩn Chi-bình phương $\chi^2=s_1^2-s_2^2$',
        'Tiêu chuẩn chuẩn hóa Z = (s1 - s2) / √(n1 + n2)': r'Tiêu chuẩn chuẩn hóa $Z=\frac{s_1-s_2}{\sqrt{n_1+n_2}}$',
        'Var(Z) = 0,90': r'$\operatorname{Var}(Z)=0{,}90$',
        'Z = 2,5 > 1,96': r'$Z=2{,}5>1{,}96$',
        'Z ≈ 1,83 > 1,65': r'$Z\approx1{,}83>1{,}65$',
        'T = -1,58': r'$T=-1{,}58$',
        'T = -3,16 < -1,833': r'$T=-3{,}16<-1{,}833$',
        'N(0, 1)': r'$N(0,1)$',
        'ŝ^2': r'$\hat s^2$',
        'σ^2': r'$\sigma^2$',
        'χ^2': r'$\chi^2$',
        'H0': r'$H_0$',
        'H1': r'$H_1$',
    }
    pieces = re.split(r'(\$[^$]*\$)', prefix + body + suffix)
    for i in range(0, len(pieces), 2):
        for old, new in explicit.items():
            # Re-split after each replacement to protect inserted math.
            pieces[i] = ''.join(piece if j % 2 else piece.replace(old, new)
                                for j, piece in enumerate(re.split(r'(\$[^$]*\$)', pieces[i])))
    return ''.join(pieces)


def normalize_xstk_questions(questions):
    for question in questions:
        if question.get('chapter_scheme') != 'KMA_XSTK_8':
            question['chapter_id'] = CHAPTER_CORRECTIONS.get(question['id'], question['chapter_id'])
            question['chapter_scheme'] = 'KMA_XSTK_8'
        chapter = question['chapter_id']
        question['chapter'] = question['chapter_title'] = f'Chương {chapter}: {CHAPTER_NAMES[chapter]}'
        question['options'] = [option_math(option) for option in question['options']]
    return questions


def normalize_xstk_knowledge(knowledge):
    for chapter in knowledge['chapters']:
        for formula in chapter.get('core_formulas', []):
            if '$' not in formula['formula'] and formula['name'] in CORE:
                formula['formula'] = CORE[formula['name']]
    return knowledge


def write_questions(questions):
    text = json.dumps(questions, ensure_ascii=False, indent=2)
    (ROOT / 'data/xstk_questions_db.json').write_text(text + '\n', encoding='utf-8')
    for directory in ('web', 'docs'):
        (ROOT / directory / 'data/xstk_questions.json').write_text(text + '\n', encoding='utf-8')
        (ROOT / directory / 'xstk_data.js').write_text('// XSTK question database\nwindow.XSTK_QUESTIONS_DATA = ' + text + ';\n', encoding='utf-8')


def main():
    from data_xstk_knowledge import XSTK_KNOWLEDGE_DATA
    questions = json.loads((ROOT / 'data/xstk_questions_db.json').read_text(encoding='utf-8'))
    write_questions(normalize_xstk_questions(questions))
    knowledge = normalize_xstk_knowledge(XSTK_KNOWLEDGE_DATA)
    for directory in ('web', 'docs'):
        (ROOT / directory / 'xstk_knowledge_data.js').write_text('window.XSTK_KNOWLEDGE_DATA = ' + json.dumps(knowledge, ensure_ascii=False, indent=2) + ';\n', encoding='utf-8')
    print(f'Formatted {len(questions)} statistics questions and their knowledge hub.')


if __name__ == '__main__':
    main()
