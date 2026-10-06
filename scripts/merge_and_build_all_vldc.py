"""
Merge all Notion test questions (De Cuoi, De 100, De Giua Ky 2025, Chapter 5/6 exercises)
with the existing curated database to produce a unified, master VLDC question bank.
Outputs to data/vldc_questions_db.json, web/vldc_data.js, and docs/vldc_data.js.
"""
import json, re

def normalize_key(text):
    text = re.sub(r'[^a-zA-Z0-9\sáàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđ]', '', text.lower())
    return ' '.join(text.split())[:35]

CHAPTER_NAMES = {
    1: "Dao động và sóng điện từ",
    2: "Quang học sóng",
    3: "Quang học lượng tử",
    4: "Cơ học lượng tử",
    5: "Vật lý nguyên tử",
    6: "Vật lý hạt nhân"
}

# Supplementary official questions from Chuong 5 & 6 De Cuong
EXTRA_DE_CUONG_QUESTIONS = [
    {
        "id": "vldc_dc_ch6_001",
        "chapter": "Vật lý hạt nhân",
        "chapter_id": 6,
        "type": "Bài tập tính toán",
        "source": "Đề Cương Ôn Tập A2 (Notion)",
        "prompt": "Tìm số proton $Z$ và số neutron $N$ có trong hạt nhân Silicon $^{29}_{14}\\text{Si}$ và hạt nhân Canxi $^{40}_{20}\\text{Ca}$:",
        "options": {
            "A": "Si: 14 proton, 15 neutron; Ca: 20 proton, 20 neutron",
            "B": "Si: 15 proton, 14 neutron; Ca: 20 proton, 20 neutron",
            "C": "Si: 14 proton, 29 neutron; Ca: 20 proton, 40 neutron",
            "D": "Si: 14 proton, 14 neutron; Ca: 20 proton, 10 neutron"
        },
        "answer": "A",
        "explanation": "Ký hiệu hạt nhân $^A_Z X$ có số hiệu nguyên tử $Z$ là số proton, số khối $A$ là tổng số nucleon. Số neutron là $N = A - Z$.\n- Đối với $^{29}_{14}\\text{Si}$: $Z = 14$ proton, $N = 29 - 14 = 15$ neutron.\n- Đối với $^{40}_{20}\\text{Ca}$: $Z = 20$ proton, $N = 40 - 20 = 20$ neutron.",
        "methodology": "Công thức số hạt: Số proton = $Z$, số neutron = $A - Z$.",
        "tips": "Lấy số trên trừ số dưới ra số neutron: $29 - 14 = 15$, $40 - 20 = 20$."
    },
    {
        "id": "vldc_dc_ch6_002",
        "chapter": "Vật lý hạt nhân",
        "chapter_id": 6,
        "type": "Bài tập tính toán",
        "source": "Đề Cương Ôn Tập A2 (Notion)",
        "prompt": "Năng lượng liên kết của electron với hạt nhân nguyên tử Hydro ở trạng thái cơ bản không kích thích $^1_1\\text{H}$ (năng lượng ion hóa) bằng $13{,}6\\,\\text{eV}$. Khối lượng của nguyên tử Hydro nhỏ hơn tổng khối lượng của một proton và một electron tự do một lượng $\\Delta m$ bằng bao nhiêu:",
        "options": {
            "A": "2,42.10⁻³⁵ kg",
            "B": "1,67.10⁻²⁷ kg",
            "C": "9,11.10⁻³¹ kg",
            "D": "2,42.10⁻³² kg"
        },
        "answer": "A",
        "explanation": "Theo hệ thức tương đương khối lượng - năng lượng của Einstein: $\\Delta E = \\Delta m \\cdot c^2 \\implies \\Delta m = \\frac{\\Delta E}{c^2}$. Đổi năng lượng sang Joule: $\\Delta E = 13{,}6\\,\\text{eV} = 13{,}6 \\times 1{,}602 \\times 10^{-19}\\,\\text{J} \\approx 2{,}179 \\times 10^{-18}\\,\\text{J}$. Độ hụt khối là: $\\Delta m = \\frac{2{,}179 \\times 10^{-18}}{(3 \\times 10^8)^2} = \\frac{2{,}179 \\times 10^{-18}}{9 \\times 10^{16}} \\approx 2{,}421 \\times 10^{-35}\\,\\text{kg}$.",
        "methodology": "Độ hụt khối liên kết: $\\Delta m = \\frac{\\Delta E}{c^2}$. Chú ý đổi $1\\,\\text{eV} = 1{,}602 \\times 10^{-19}\\,\\text{J}$.",
        "tips": "Casio: $13{,}6 \\times 1{,}602 \\times 10^{-19} \\div (3 \\times 10^8)^2 \\approx 2{,}42 \\times 10^{-35}\\,\\text{kg}$."
    },
    {
        "id": "vldc_dc_ch6_003",
        "chapter": "Vật lý hạt nhân",
        "chapter_id": 6,
        "type": "Bài tập tính toán",
        "source": "Đề Cương Ôn Tập A2 (Notion)",
        "prompt": "Xác định năng lượng cực tiểu cần thiết để bứt một proton ra khỏi hạt nhân $^{19}_9\\text{F}$. Biết rằng năng lượng liên kết của hạt nhân $^{19}_9\\text{F}$ là $147{,}8\\,\\text{MeV}$ và của hạt nhân $^{18}_8\\text{O}$ là $139{,}8\\,\\text{MeV}$:",
        "options": {
            "A": "8,0 MeV",
            "B": "7,78 MeV",
            "C": "14,78 MeV",
            "D": "13,98 MeV"
        },
        "answer": "A",
        "explanation": "Phản ứng bứt 1 proton: $^{19}_9\\text{F} + \\Delta E \\to ^{18}_8\\text{O} + ^1_1\\text{p}$. Năng lượng cần thiết để tách proton ra khỏi hạt nhân bằng độ chênh lệch năng lượng liên kết giữa hạt nhân ban đầu và hạt nhân còn lại: $\\Delta E = E_{\\text{lk}}(^{19}_9\\text{F}) - E_{\\text{lk}}(^{18}_8\\text{O}) = 147{,}8\\,\\text{MeV} - 139{,}8\\,\\text{MeV} = 8{,}0\\,\\text{MeV}$.",
        "methodology": "Năng lượng bứt nucleon (proton hoặc neutron): $S_p = E_{\\text{lk}}(A, Z) - E_{\\text{lk}}(A-1, Z-1)$.",
        "tips": "Lấy hiệu 2 năng lượng liên kết: $147{,}8 - 139{,}8 = 8{,}0\\,\\text{MeV}$."
    },
    {
        "id": "vldc_dc_ch5_001",
        "chapter": "Vật lý nguyên tử",
        "chapter_id": 5,
        "type": "Bài tập tính toán",
        "source": "Đề Cương Ôn Tập A2 (Notion)",
        "prompt": "Hai vạch quang phổ có bước sóng ngắn nhất và dài nhất của dãy Lyman trong quang phổ hydro tương ứng với bước sóng vạch biên $\\lambda_\\infty = 0{,}0912\\,\\mu\\text{m}$ và vạch đầu $\\lambda_{21} = 0{,}1216\\,\\mu\\text{m}$. Bước sóng vạch đỏ $H_\\alpha$ ($\\lambda_{32}$) trong dãy Balmer liên hệ với hai vạch trên và có giá trị là:",
        "options": {
            "A": "0,6563 μm",
            "B": "0,4861 μm",
            "C": "0,4340 μm",
            "D": "0,4102 μm"
        },
        "answer": "A",
        "explanation": "Theo hệ thức chuyển mức năng lượng Bohr: $E_3 - E_2 = (E_3 - E_1) - (E_2 - E_1) \\implies \\frac{1}{\\lambda_{32}} = \\frac{1}{\\lambda_{31}} - \\frac{1}{\\lambda_{21}}$. Với $\\lambda_{31} = 0{,}1026\\,\\mu\\text{m}$ và $\\lambda_{21} = 0{,}1216\\,\\mu\\text{m}$: $\\frac{1}{\\lambda_{32}} = \\frac{1}{0{,}1026} - \\frac{1}{0{,}1216} \\approx 9{,}7466 - 8{,}2237 = 1{,}5229\\,\\mu\\text{m}^{-1} \\implies \\lambda_{32} = \\frac{1}{1{,}5229} \\approx 0{,}6566\\,\\mu\\text{m} \\approx 0{,}6563\\,\\mu\\text{m}$ (vạch đỏ $H_\\alpha$).",
        "methodology": "Hệ thức cộng nghịch đảo bước sóng: $\\frac{1}{\\lambda_{32}} = \\frac{1}{\\lambda_{31}} - \\frac{1}{\\lambda_{21}}$.",
        "tips": "Vạch đỏ $H_\\alpha$ luôn có bước sóng chuẩn $0{,}6563\\,\\mu\\text{m}$ (656,3 nm)."
    },
    {
        "id": "vldc_dc_ch5_002",
        "chapter": "Vật lý nguyên tử",
        "chapter_id": 5,
        "type": "Lý thuyết",
        "source": "Đề Cương Ôn Tập A2 (Notion)",
        "prompt": "Lớp lượng tử ứng với số lượng tử chính $n = 3$ (lớp M) chứa tối đa bao nhiêu electron theo nguyên lý loại trừ Pauli?",
        "options": {
            "A": "18 electron",
            "B": "8 electron",
            "C": "32 electron",
            "D": "9 electron"
        },
        "answer": "A",
        "explanation": "Theo nguyên lý Pauli, số electron tối đa trong một lớp có số lượng tử chính $n$ là $N_{\\max} = 2n^2$. Với $n = 3$: $N_{\\max} = 2 \\times 3^2 = 2 \\times 9 = 18$ electron (gồm phân lớp $3s$ có 2e, $3p$ có 6e, $3d$ có 10e).",
        "methodology": "Công thức số electron tối đa trong lớp $n$: $2n^2$. Số orbital là $n^2$.",
        "tips": "Casio: $2 \\times 3^2 = 18$."
    }
]

def main():
    with open('data/vldc_questions_db.json') as f:
        existing = json.load(f)

    with open('data/notion_de_cuoi_questions.json') as f:
        de_cuoi = json.load(f)

    with open('data/notion_100_g25_questions.json') as f:
        notion_100 = json.load(f)

    seen = set()
    master = []

    # 1. Official De Cuoi (highest priority)
    for q in de_cuoi:
        key = normalize_key(q['prompt'])
        if key not in seen:
            seen.add(key)
            master.append(q)

    # 2. Notion 100 & Giua Ky 2025
    for q in notion_100:
        key = normalize_key(q['prompt'])
        if key not in seen:
            seen.add(key)
            master.append(q)

    # 3. Extra De Cuong questions
    for q in EXTRA_DE_CUONG_QUESTIONS:
        key = normalize_key(q['prompt'])
        if key not in seen:
            seen.add(key)
            master.append(q)

    # 4. Existing Curated Questions
    for q in existing:
        key = normalize_key(q['prompt'])
        if key not in seen:
            seen.add(key)
            master.append(q)

    # Re-index IDs cleanly by chapter and standardize fields
    chapter_counters = {ch: 0 for ch in range(1, 7)}
    for idx, q in enumerate(master):
        ch = q.get('chapter_id') or 1
        chapter_counters[ch] += 1
        q['num'] = idx + 1
        q['chapter_id'] = ch
        q['chapter'] = CHAPTER_NAMES[ch]
        q['chapter_title'] = f"Chương {ch}: {CHAPTER_NAMES[ch]}"
        q['answer'] = (q.get('answer') or q.get('correct_answer') or 'A').strip().upper()
        
        # Standardize type to mcq
        q['question_type'] = q.get('type', 'Bài tập tính toán')
        q['type'] = 'mcq'

        # Standardize source
        raw_src = q.get('source', '')
        if 'Cuối' in raw_src:
            q['source'] = 'NOTION_DE_CUOI'
            q['source_title'] = 'Đề Test Cuối (Notion)'
        elif '100' in raw_src:
            q['source'] = 'NOTION_TEST_100'
            q['source_title'] = 'Đề Test 100 Câu (Notion)'
        elif 'Giữa Kỳ' in raw_src or '2025' in raw_src:
            q['source'] = 'NOTION_GIAK_2025'
            q['source_title'] = 'Đề Giữa Kỳ 2025 (Notion)'
        elif 'Đề Cương' in raw_src:
            q['source'] = 'NOTION_DE_CUONG'
            q['source_title'] = 'Đề Cương Ôn Tập A2 (Notion)'
        else:
            q['source'] = 'VLDC_STANDARD'
            q['source_title'] = 'Ngân Hàng Giáo Trình ĐHBK'

        # Fix known legacy FIB questions to proper MCQs
        if q.get('answer') == '0.5' and 'khe Young' in q.get('prompt', ''):
            q['options'] = ['A. 0,5 mm', 'B. 0,25 mm', 'C. 1,0 mm', 'D. 0,75 mm']
            q['answer'] = 'A'
            q['chapter_id'] = 2
        elif q.get('answer') == '0.5' and 'Natri' in q.get('prompt', ''):
            q['options'] = ['A. 0,5 μm', 'B. 0,6 μm', 'C. 0,4 μm', 'D. 0,35 μm']
            q['answer'] = 'A'
            q['chapter_id'] = 3
        elif q.get('answer') == '21' and 'khe Young' in q.get('prompt', ''):
            q['options'] = ['A. 21 vân', 'B. 19 vân', 'C. 20 vân', 'D. 22 vân']
            q['answer'] = 'A'
            q['chapter_id'] = 2
        elif q.get('answer') == '2000' and 'vật đen' in q.get('prompt', ''):
            q['options'] = ['A. 2000 K', 'B. 1500 K', 'C. 2500 K', 'D. 3000 K']
            q['answer'] = 'A'
            q['chapter_id'] = 3
        elif q.get('answer') == '2.45' and 'De Broglie' in q.get('prompt', ''):
            q['options'] = ['A. 2,45 Å', 'B. 1,23 Å', 'C. 3,64 Å', 'D. 0,85 Å']
            q['answer'] = 'A'
            q['chapter_id'] = 4

        ch = q.get('chapter_id') or 1
        q['chapter_id'] = ch
        q['chapter'] = CHAPTER_NAMES[ch]
        q['chapter_title'] = f"Chương {ch}: {CHAPTER_NAMES[ch]}"

        # Ensure options is array of strings [A. ..., B. ..., C. ..., D. ...]
        opts = q.get('options')
        if isinstance(opts, dict):
            opt_list = []
            for k in ['A', 'B', 'C', 'D']:
                val = str(opts.get(k, '')).strip()
                if val.startswith(f"{k}."):
                    opt_list.append(val)
                else:
                    opt_list.append(f"{k}. {val}")
            q['options'] = opt_list
        elif isinstance(opts, list):
            opt_list = []
            for opt_idx, item in enumerate(opts):
                letter = chr(65 + opt_idx)
                val = str(item).strip()
                if val.startswith(f"{letter}."):
                    opt_list.append(val)
                else:
                    opt_list.append(f"{letter}. {val}")
            q['options'] = opt_list

    print(f"Total master questions: {len(master)}")
    for ch in range(1, 7):
        ch_qs = [q for q in master if q['chapter_id'] == ch]
        print(f"  Chương {ch} ({CHAPTER_NAMES[ch]}): {len(ch_qs)} câu")

    # Export to JSON
    with open('data/vldc_questions_db.json', 'w', encoding='utf-8') as f:
        json.dump(master, f, ensure_ascii=False, indent=2)

    # Export to web/vldc_data.js and docs/vldc_data.js
    js_content = f"// VLDC Master Question Database - Exported with {len(master)} curated questions\n"
    js_content += f"window.VLDC_QUESTIONS_DATA = {json.dumps(master, ensure_ascii=False, indent=2)};\n\n"
    js_content += "if (typeof module !== 'undefined' && module.exports) {\n    module.exports = { VLDC_QUESTIONS_DATA: window.VLDC_QUESTIONS_DATA };\n}\n"

    with open('web/vldc_data.js', 'w', encoding='utf-8') as f:
        f.write(js_content)

    with open('docs/vldc_data.js', 'w', encoding='utf-8') as f:
        f.write(js_content)

    print("Successfully synchronized data/vldc_questions_db.json, web/vldc_data.js, and docs/vldc_data.js!")

if __name__ == '__main__':
    main()
