import json
import os

os.makedirs('pdf_templates', exist_ok=True)

with open('data/knowledge_base.json', 'r', encoding='utf-8') as f:
    kb = json.load(f)

with open('data/questions_db.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

# Common Print Styles
CSS_STYLES = """
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;700;800;900&family=JetBrains+Mono:wght@500;700;800&display=swap');

@page {
  size: A4;
  margin: 15mm 12mm 15mm 12mm;
  @bottom-right {
    content: "Trang " counter(page);
    font-size: 8pt;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: #111;
  background: #fff;
  line-height: 1.5;
  font-size: 10pt;
}

code, pre, .mono {
  font-family: 'JetBrains Mono', monospace;
}

.cover-page {
  page-break-after: always;
  height: 92vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 4px solid #000;
  padding: 40px;
  background: #FFFDF9;
  box-shadow: 8px 8px 0px #000;
  text-align: center;
}

.cover-header {
  border-bottom: 3px solid #000;
  padding-bottom: 20px;
}

.cover-title {
  font-size: 26pt;
  font-weight: 900;
  letter-spacing: -0.5px;
  margin: 20px 0 10px 0;
  text-transform: uppercase;
}

.cover-subtitle {
  font-size: 14pt;
  font-weight: 700;
  color: #333;
}

.cover-badge {
  display: inline-block;
  background: #FFE600;
  color: #000;
  border: 2px solid #000;
  padding: 6px 16px;
  font-weight: 800;
  font-size: 11pt;
  border-radius: 6px;
  box-shadow: 3px 3px 0px #000;
}

.cover-footer {
  border-top: 3px solid #000;
  padding-top: 20px;
  font-size: 10pt;
  font-weight: 700;
  display: flex;
  justify-content: space-between;
}

.chapter-block {
  page-break-before: always;
  margin-bottom: 24px;
}

.chapter-title-box {
  background: #FFE600;
  border: 3px solid #000;
  box-shadow: 4px 4px 0px #000;
  padding: 14px 18px;
  margin-bottom: 18px;
  border-radius: 6px;
}

.chapter-title-box h2 {
  font-size: 16pt;
  font-weight: 900;
}

.chapter-summary {
  font-weight: 700;
  font-size: 10pt;
  color: #333;
  margin-top: 4px;
}

.section-box {
  background: #FFFDF9;
  border: 2px solid #000;
  box-shadow: 3px 3px 0px #000;
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 16px;
  page-break-inside: avoid;
}

.section-title {
  font-size: 11pt;
  font-weight: 800;
  margin-bottom: 8px;
  border-bottom: 1.5px dashed #000;
  padding-bottom: 4px;
}

.section-content {
  font-size: 9.5pt;
  line-height: 1.55;
  color: #222;
}

.section-content p {
  margin-bottom: 6px;
}

/* Question Styling */
.q-card-pdf {
  border: 2.5px solid #000;
  box-shadow: 3px 3px 0px #000;
  border-radius: 6px;
  padding: 14px 16px;
  margin-bottom: 16px;
  page-break-inside: avoid;
  background: #fff;
}

.q-header-pdf {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  border-bottom: 1.5px solid #000;
  padding-bottom: 4px;
}

.q-title-pdf {
  font-weight: 900;
  font-size: 10.5pt;
  margin-bottom: 6px;
}

.q-code-pdf {
  background: #f4f4f4;
  border: 1.5px solid #000;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 8.5pt;
  margin: 6px 0;
  white-space: pre-wrap;
}

.q-img-pdf {
  margin: 8px 0;
  text-align: center;
}

.q-img-pdf img {
  max-width: 85%;
  max-height: 200px;
  border: 1.5px solid #000;
  border-radius: 4px;
}

.q-options-pdf {
  margin: 8px 0;
}

.opt-item-pdf {
  padding: 3px 8px;
  margin-bottom: 4px;
  font-size: 9pt;
  font-weight: 700;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.opt-item-pdf.correct {
  background: #E8FFF4;
  border: 1.5px solid #00875A;
  color: #00875A;
}

.exp-box-pdf {
  background: #FFFDF0;
  border: 1.5px solid #000;
  border-left: 5px solid #FFE600;
  border-radius: 4px;
  padding: 8px 12px;
  margin-top: 8px;
  font-size: 8.8pt;
}

.exp-title-pdf {
  font-weight: 800;
  color: #000;
  margin-bottom: 3px;
  text-transform: uppercase;
  font-size: 8pt;
}

.badge-pdf {
  display: inline-block;
  padding: 2px 6px;
  border: 1.5px solid #000;
  border-radius: 3px;
  font-weight: 800;
  font-size: 7.5pt;
  background: #FFE600;
}
"""

def format_text(t):
    return t.replace('**', '<strong>', 1).replace('**', '</strong>', 1).replace('\n', '<br/>')

# 1. BUILD HTML 1: KIẾN THỨC TRỌNG TÂM
html1 = f"""<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>Tài Liệu Kiến Thức Trọng Tâm Kỹ Thuật Vi Xử Lý</title>
  <style>{CSS_STYLES}</style>
</head>
<body>

  <!-- Cover Page -->
  <div class="cover-page">
    <div class="cover-header">
      <div class="cover-badge">HỌC VIỆN KỸ THUẬT MẬT MÃ • KHOA CNTT</div>
      <div style="font-size: 11pt; font-weight: 800; margin-top: 8px; letter-spacing: 1px;">BỘ MÔN MẠNG & AN TOÀN HỆ THỐNG</div>
    </div>

    <div>
      <div style="font-size: 50pt; margin-bottom: 10px;">⚡</div>
      <div class="cover-title">TỔNG HỢP KIẾN THỨC TRỌNG TÂM<br/>KỸ THUẬT VI XỬ LÝ</div>
      <div class="cover-subtitle">Giáo Trình Tóm Tắt, Bảng Tra Cứu SFR & Bí Kíp Casio fx-580VNX</div>
      <div style="margin-top: 24px;">
        <span class="cover-badge" style="background: #00E599;">VI ĐIỀU KHIỂN 8051 & KIẾN TRÚC ARM7</span>
      </div>
    </div>

    <div class="cover-footer">
      <div>Hà Nội, 2026</div>
      <div>Lưu Hành Nội Bộ Ôn Thi Chuyên Sâu</div>
    </div>
  </div>

  <!-- Chapters Content -->
"""

for chap in kb['chapters']:
    html1 += f"""
  <div class="chapter-block">
    <div class="chapter-title-box">
      <span class="badge-pdf">{chap['clo']}</span>
      <h2>{chap['title']}</h2>
      <div class="chapter-summary">{chap.get('summary', '')}</div>
    </div>
"""
    for sec in chap['sections']:
        html1 += f"""
    <div class="section-box">
      <div class="section-title">{sec['title']}</div>
      <div class="section-content">
"""
        if isinstance(sec['content'], list):
            for p in sec['content']:
                p_html = p.replace('**', '<strong>', 1).replace('**', '</strong>', 1).replace('\n', '<br/>')
                html1 += f"        <p>{p_html}</p>\n"
        else:
            p_html = sec['content'].replace('**', '<strong>', 1).replace('**', '</strong>', 1).replace('\n', '<br/>')
            html1 += f"        <p>{p_html}</p>\n"
            
        html1 += """
      </div>
    </div>
"""
    html1 += "  </div>\n"

html1 += """
</body>
</html>
"""

with open('pdf_templates/kien_thuc_trong_tam.html', 'w', encoding='utf-8') as f:
    f.write(html1)

print("Generated pdf_templates/kien_thuc_trong_tam.html!")

# 2. BUILD HTML 2: NGÂN HÀNG CÂU HỎI & LỜI GIẢI CHI TIẾT
# For PDF 2, we organize by 5 Official Exams (200 questions) + Supplemental Part Questions
html2 = f"""<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>Ngân Hàng Câu Hỏi, Lời Giải Chuẩn & Mẹo Casio KTVXL</title>
  <style>{CSS_STYLES}</style>
</head>
<body>

  <!-- Cover Page -->
  <div class="cover-page">
    <div class="cover-header">
      <div class="cover-badge">HỌC VIỆN KỸ THUẬT MẬT MÃ • KHOA CNTT</div>
      <div style="font-size: 11pt; font-weight: 800; margin-top: 8px;">NGÂN HÀNG ĐỀ THI & LỜI GIẢI CHI TIẾT</div>
    </div>

    <div>
      <div style="font-size: 50pt; margin-bottom: 10px;">🎯</div>
      <div class="cover-title">NGÂN HÀNG CÂU HỎI, LỜI GIẢI CHUẨN<br/>& BÍ KÍP BẤM MÁY CASIO</div>
      <div class="cover-subtitle">Đầy Đủ 5 Đề Thi Chính Thức (001 - 005) & Toàn Bộ Chuyên Đề Part 1 - 18</div>
      <div style="margin-top: 24px;">
        <span class="cover-badge" style="background: #FF5C5C; color:#fff;">100% CÂU HỎI KÈM LỜI GIẢI & MẸO NHỚ</span>
      </div>
    </div>

    <div class="cover-footer">
      <div>Hà Nội, 2026</div>
      <div>Bám Sát 100% Ma Trận Đề Thi KMA</div>
    </div>
  </div>

  <!-- Table of Contents / Intro -->
  <div class="chapter-block">
    <div class="chapter-title-box" style="background: #4D96FF; color:#fff;">
      <h2>MỤC LỤC & CẤU TRÚC NGÂN HÀNG CÂU HỎI</h2>
      <div class="chapter-summary" style="color:#eee;">Phân chia theo 5 Đề Thi Chuẩn 40 câu và Các Chuyên Đề Bổ Trợ</div>
    </div>
    <div class="section-box">
      <ul style="margin-left: 20px; font-weight: 800; line-height: 2;">
        <li>PHẦN I: ĐỀ KIỂM TRA CHÍNH THỨC 001 (40 câu - Chuẩn ma trận KMA)</li>
        <li>PHẦN II: ĐỀ KIỂM TRA CHÍNH THỨC 002 (40 câu - Chuẩn ma trận KMA)</li>
        <li>PHẦN III: ĐỀ KIỂM TRA CHÍNH THỨC 003 (40 câu - Chuẩn ma trận KMA)</li>
        <li>PHẦN IV: ĐỀ KIỂM TRA CHÍNH THỨC 004 (40 câu - Chuẩn ma trận KMA)</li>
        <li>PHẦN V: ĐỀ KIỂM TRA CHÍNH THỨC 005 (40 câu - Chuẩn ma trận KMA)</li>
        <li>PHẦN VI: BÀI TẬP BỔ TRỢ CHUYÊN ĐỀ (Part 1 đến Part 18)</li>
      </ul>
    </div>
  </div>
"""

# Group questions by Exam / Part
exams_dict = {}
for q in questions:
    grp = q.get('exam_title') or q.get('source', 'Khác')
    exams_dict.setdefault(grp, []).append(q)

for grp_name, q_list in exams_dict.items():
    html2 += f"""
  <div class="chapter-block">
    <div class="chapter-title-box">
      <h2>{grp_name.upper()} ({len(q_list)} CÂU HỎI)</h2>
      <div class="chapter-summary">Đáp án chuẩn xác • Lời giải chi tiết • Phương pháp dạng bài • Mẹo Casio</div>
    </div>
"""
    for idx, q in enumerate(q_list):
        q_num = idx + 1
        html2 += f"""
    <div class="q-card-pdf">
      <div class="q-header-pdf">
        <span style="font-weight: 900; font-size: 10pt;">Câu {q_num} (Mã gốc: {q.get('title', f'Câu {q_num}')})</span>
        <div>
          <span class="badge-pdf">{q.get('clo', 'CLO2')}</span>
          <span class="badge-pdf" style="background:#fff;">{q.get('level', 'TH')}</span>
          <span class="badge-pdf" style="background:#00E599;">Đ.ÁN: {q.get('answer', '')}</span>
        </div>
      </div>

      <div class="q-title-pdf">{q.get('prompt', '')}</div>
"""
        if q.get('extra_lines'):
            code_text = '\n'.join(q['extra_lines'])
            html2 += f"""      <pre class="q-code-pdf">{code_text}</pre>\n"""

        if q.get('images'):
            for img_path in q['images']:
                # Link image from web/ directory
                html2 += f"""      <div class="q-img-pdf"><img src="../web/{img_path}" alt="Minh họa"/></div>\n"""

        if q.get('type') == 'mcq' and q.get('options'):
            html2 += """      <div class="q-options-pdf">\n"""
            for opt_idx, opt in enumerate(q['options']):
                letter = chr(65 + opt_idx)
                is_correct = (letter == q.get('answer'))
                cls = "opt-item-pdf correct" if is_correct else "opt-item-pdf"
                html2 += f"""        <div class="{cls}">{opt}</div>\n"""
            html2 += """      </div>\n"""
        else:
            html2 += f"""      <div style="font-weight: 800; font-size: 9pt; margin: 6px 0; color: #00875A;">✍️ ĐÁP ÁN ĐIỀN KHUYẾT: {q.get('answer', '')} (Chấp nhận: {', '.join(q.get('acceptable_answers', []))})</div>\n"""

        # Explanation & Casio
        html2 += f"""
      <div class="exp-box-pdf">
        <div class="exp-title-pdf">💡 LỜI GIẢI CHI TIẾT & BẢN CHẤT:</div>
        <div>{q.get('explanation', '')}</div>
"""
        if q.get('methodology'):
            html2 += f"""
        <div class="exp-title-pdf" style="margin-top: 5px;">📐 PHƯƠNG PHÁP DẠNG BÀI:</div>
        <div>{q.get('methodology', '')}</div>
"""
        if q.get('tips_casio'):
            html2 += f"""
        <div class="exp-title-pdf" style="margin-top: 5px; color: #6C5CE7;">⚡ MẸO NHỚ & BẤM MÁY CASIO 580VNX:</div>
        <div>{q.get('tips_casio', '')}</div>
"""
        html2 += """      </div>\n    </div>\n"""

    html2 += "  </div>\n"

html2 += """
</body>
</html>
"""

with open('pdf_templates/ngan_hang_cau_hoi.html', 'w', encoding='utf-8') as f:
    f.write(html2)

print("Generated pdf_templates/ngan_hang_cau_hoi.html!")
