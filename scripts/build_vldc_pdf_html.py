#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build_vldc_pdf_html.py
Sinh 2 file HTML in PDF cho môn Vật Lý Đại Cương 2 / A3 theo phong cách Neobrutalism chuẩn A4:
1. pdf_templates/vldc_kien_thuc_trong_tam.html
2. pdf_templates/vldc_ngan_hang_cau_hoi.html
"""

import json
import os

def generate_pdf_htmls():
    with open("data/vldc_knowledge_base.json", "r", encoding="utf-8") as f:
        kb = json.load(f)

    with open("data/vldc_questions_db.json", "r", encoding="utf-8") as f:
        questions = json.load(f)

    os.makedirs("pdf_templates", exist_ok=True)

    # -------------------------------------------------------------
    # 1. KIẾN THỨC TRỌNG TÂM HTML
    # -------------------------------------------------------------
    chapters_html = ""
    for ch in kb["chapters"]:
        formulas_html = ""
        for f in ch["core_formulas"]:
            formulas_html += f"""
            <div class="formula-box">
              <div class="formula-name">📐 {f['name']}</div>
              <div class="formula-code">{f['formula']}</div>
              <div class="formula-desc">{f['desc']}</div>
            </div>
            """

        keywords_html = ""
        for kw in ch["magic_keywords"]:
            keywords_html += f"""
            <div class="kw-row">
              <span class="kw-badge">{kw['kw']}</span>
              <span class="kw-meaning">👉 {kw['meaning']}</span>
            </div>
            """

        chapters_html += f"""
        <div class="chapter-card">
          <h2 class="chapter-title">{ch['title']}</h2>
          <p class="chapter-summary">{ch['summary']}</p>
          <div class="sub-heading">⚡ CÔNG THỨC VÀNG CỐT LÕI</div>
          {formulas_html}
          <div class="sub-heading" style="margin-top: 15px;">💡 TỪ KHÓA BẢN CHẤT & NHẬN DIỆN 3 GIÂY</div>
          <div class="kw-container">
            {keywords_html}
          </div>
        </div>
        """

    casio_html = ""
    for c in kb["casio_handbook"]:
        casio_html += f"""
        <div class="casio-card">
          <div class="casio-title">📟 {c['title']}</div>
          <pre class="casio-steps">{c['steps']}</pre>
        </div>
        """

    doc1_html = f"""<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>VẬT LÝ ĐẠI CƯƠNG 2 • KIẾN THỨC TRỌNG TÂM & SỔ TAY CÔNG THỨC</title>
  <style>
    @page {{
      size: A4;
      margin: 14mm 12mm 14mm 12mm;
      @bottom-right {{
        content: counter(page);
        font-weight: bold;
      }}
    }}
    * {{ box-sizing: border-box; }}
    body {{
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
      margin: 0;
      color: #000;
      line-height: 1.45;
      font-size: 13px;
      background: #fff;
    }}
    .header {{
      border: 3px solid #000;
      box-shadow: 5px 5px 0px #000;
      padding: 16px;
      background: #FFE600;
      text-align: center;
      margin-bottom: 20px;
    }}
    .header h1 {{
      margin: 0;
      font-size: 22px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }}
    .header p {{
      margin: 4px 0 0 0;
      font-weight: bold;
      font-size: 12px;
    }}
    .chapter-card {{
      border: 2.5px solid #000;
      box-shadow: 4px 4px 0px #000;
      background: #FFF;
      padding: 14px;
      margin-bottom: 20px;
      page-break-inside: avoid;
    }}
    .chapter-title {{
      margin: 0 0 8px 0;
      font-size: 16px;
      background: #00E599;
      display: inline-block;
      padding: 4px 10px;
      border: 2px solid #000;
      box-shadow: 2px 2px 0px #000;
    }}
    .chapter-summary {{
      margin: 0 0 12px 0;
      font-style: italic;
      color: #333;
    }}
    .sub-heading {{
      font-weight: 900;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
      color: #111;
    }}
    .formula-box {{
      border: 1.5px solid #000;
      background: #F9FAFB;
      padding: 8px 10px;
      margin-bottom: 8px;
    }}
    .formula-name {{
      font-weight: bold;
      color: #000;
    }}
    .formula-code {{
      font-family: "Courier New", monospace;
      font-weight: bold;
      font-size: 13px;
      color: #B91C1C;
      margin: 3px 0;
      background: #FEF3C7;
      display: inline-block;
      padding: 2px 6px;
      border: 1px solid #000;
    }}
    .formula-desc {{
      font-size: 11.5px;
      color: #4B5563;
    }}
    .kw-container {{
      display: flex;
      flex-direction: column;
      gap: 6px;
    }}
    .kw-row {{
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 12px;
    }}
    .kw-badge {{
      background: #D0A2FE;
      border: 1.5px solid #000;
      padding: 2px 8px;
      font-weight: bold;
      font-size: 11px;
      white-space: nowrap;
    }}
    .kw-meaning {{
      color: #111;
      font-weight: 600;
    }}
    .casio-card {{
      border: 2px solid #000;
      box-shadow: 3px 3px 0px #000;
      background: #EFF6FF;
      padding: 10px;
      margin-bottom: 12px;
      page-break-inside: avoid;
    }}
    .casio-title {{
      font-weight: 900;
      font-size: 13px;
      margin-bottom: 6px;
    }}
    .casio-steps {{
      font-family: inherit;
      margin: 0;
      white-space: pre-wrap;
      font-size: 11.5px;
      line-height: 1.4;
    }}
  </style>
</head>
<body>
  <div class="header">
    <h1>VẬT LÝ ĐẠI CƯƠNG 2 (VẬT LÝ A3)</h1>
    <p>TỔNG HỢP KIẾN THỨC TRỌNG TÂM • CÔNG THỨC VÀNG • SỔ TAY CASIO FX-580VNX</p>
    <p style="font-weight: normal; margin-top: 4px;">Quang học sóng • Quang lượng tử • Cơ học lượng tử • Vật lý nguyên tử & Hạt nhân</p>
  </div>

  {chapters_html}

  <div class="chapter-card" style="background: #FDF4FF;">
    <h2 class="chapter-title" style="background: #FF5C5C; color: #FFF;">SỔ TAY BẤM MÁY CASIO FX-580VNX PHÒNG THI</h2>
    <p class="chapter-summary">Tuyệt kỹ tra cứu hằng số vật lý tự động (CONST) và đổi đơn vị (CONV) không bao giờ nhớ nhầm số mũ 10⁻³⁴ hay 10⁻¹⁹.</p>
    {casio_html}
  </div>
</body>
</html>"""

    with open("pdf_templates/vldc_kien_thuc_trong_tam.html", "w", encoding="utf-8") as f:
        f.write(doc1_html)

    # -------------------------------------------------------------
    # 2. NGÂN HÀNG CÂU HỎI & LỜI GIẢI HTML
    # -------------------------------------------------------------
    q_cards_html = ""
    for idx, q in enumerate(questions):
        opts_html = ""
        if q["type"] == "mcq":
            for opt in q["options"]:
                is_correct = opt.startswith(q["correct_answer"] + ".")
                badge = " ✅ ĐÁP ÁN ĐÚNG" if is_correct else ""
                hl_style = "background: #DCFCE7; font-weight: bold; border-left: 4px solid #16A34A;" if is_correct else ""
                opts_html += f"""
                <div class="opt-row" style="{hl_style}">
                  <span>{opt}</span>{badge}
                </div>
                """
        else:
            opts_html = f"""
            <div class="fill-box">
              <strong>Đáp án chuẩn điền khuyết:</strong> <span style="background: #FFE600; padding: 2px 8px; border: 1.5px solid #000; font-weight: bold;">{q['correct_answer_text']}</span>
            </div>
            """

        q_cards_html += f"""
        <div class="q-item">
          <div class="q-header">
            <span class="q-badge">CÂU {idx + 1} • {q['id']}</span>
            <span class="q-chap">{q['chapter']}</span>
          </div>
          <div class="q-prompt">{q['prompt']}</div>
          <div class="q-opts">{opts_html}</div>
          <div class="q-solution">
            <div class="sol-title">💡 LỜI GIẢI CHI TIẾT TỪNG BƯỚC:</div>
            <div class="sol-body">{q['explanation'].replace(chr(10), '<br>')}</div>
            <div class="method-box"><strong>📐 Phương pháp dạng bài:</strong> {q['methodology']}</div>
            <div class="tips-box"><strong>⚡ Mẹo nhớ & Casio:</strong> {q['tips']}</div>
          </div>
        </div>
        """

    doc2_html = f"""<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>VẬT LÝ ĐẠI CƯƠNG 2 • NGÂN HÀNG CÂU HỎI, LỜI GIẢI CHI TIẾT & MẸO BẤM MÁY</title>
  <style>
    @page {{
      size: A4;
      margin: 14mm 12mm 14mm 12mm;
      @bottom-right {{
        content: counter(page);
        font-weight: bold;
      }}
    }}
    * {{ box-sizing: border-box; }}
    body {{
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
      margin: 0;
      color: #000;
      line-height: 1.45;
      font-size: 12.5px;
      background: #fff;
    }}
    .header {{
      border: 3px solid #000;
      box-shadow: 5px 5px 0px #000;
      padding: 16px;
      background: #00E599;
      text-align: center;
      margin-bottom: 20px;
    }}
    .header h1 {{
      margin: 0;
      font-size: 20px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }}
    .header p {{
      margin: 4px 0 0 0;
      font-weight: bold;
      font-size: 12px;
    }}
    .q-item {{
      border: 2px solid #000;
      box-shadow: 3.5px 3.5px 0px #000;
      background: #FFF;
      padding: 12px;
      margin-bottom: 16px;
      page-break-inside: avoid;
    }}
    .q-header {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }}
    .q-badge {{
      background: #FFE600;
      border: 1.5px solid #000;
      padding: 2px 8px;
      font-weight: 900;
      font-size: 11px;
    }}
    .q-chap {{
      font-size: 11px;
      font-weight: bold;
      color: #374151;
    }}
    .q-prompt {{
      font-weight: 700;
      font-size: 13px;
      margin-bottom: 10px;
      line-height: 1.4;
    }}
    .opt-row {{
      padding: 4px 8px;
      margin-bottom: 4px;
      border: 1px solid #E5E7EB;
      display: flex;
      justify-content: space-between;
      font-size: 12px;
    }}
    .fill-box {{
      padding: 6px 10px;
      background: #FEF9C3;
      border: 1.5px solid #000;
      margin-bottom: 8px;
    }}
    .q-solution {{
      margin-top: 10px;
      border-top: 1.5px dashed #000;
      padding-top: 8px;
    }}
    .sol-title {{
      font-weight: 900;
      color: #1E3A8A;
      font-size: 11.5px;
      margin-bottom: 4px;
    }}
    .sol-body {{
      color: #1F2937;
      font-size: 12px;
      margin-bottom: 6px;
      line-height: 1.45;
    }}
    .method-box {{
      background: #F3F4F6;
      border: 1px solid #D1D5DB;
      padding: 4px 8px;
      font-size: 11px;
      margin-bottom: 4px;
    }}
    .tips-box {{
      background: #FEF3C7;
      border: 1px solid #F59E0B;
      padding: 4px 8px;
      font-size: 11px;
      color: #92400E;
    }}
  </style>
</head>
<body>
  <div class="header">
    <h1>NGÂN HÀNG CÂU HỎI VẬT LÝ ĐẠI CƯƠNG 2 (A3)</h1>
    <p>TRỌN BỘ {len(questions)} CÂU HỎI • LỜI GIẢI CHI TIẾT TỪNG BƯỚC • PHƯƠNG PHÁP & MẸO BẤM MÁY CASIO</p>
  </div>

  {q_cards_html}
</body>
</html>"""

    with open("pdf_templates/vldc_ngan_hang_cau_hoi.html", "w", encoding="utf-8") as f:
        f.write(doc2_html)

    print("✅ Created HTML templates for VLDC PDFs successfully!")

if __name__ == "__main__":
    generate_pdf_htmls()
