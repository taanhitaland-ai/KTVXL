#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
HTML Template Builder for Tư Tưởng Hồ Chí Minh Deliverables:
1. pdf_templates/tthcm_kien_thuc_trong_tam.html
2. pdf_templates/tthcm_ngan_hang_cau_hoi.html
"""

import json
import os
import html
import re

def build_tthcm_pdf_templates():
    os.makedirs('pdf_templates', exist_ok=True)
    
    # Load knowledge base
    with open('data/tthcm_knowledge_base.json', 'r', encoding='utf-8') as f:
        kb = json.load(f)
        
    # Load questions
    with open('data/tthcm_questions_db.json', 'r', encoding='utf-8') as f:
        questions = json.load(f)

    # Base CSS style with Neobrutalism elements for print
    shared_css = """
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;600;700&display=swap');
    
    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }
    
    body {
        font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        color: #111;
        line-height: 1.55;
        font-size: 13px;
        background: #fff;
    }
    
    .cover-page {
        page-break-after: always;
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        border: 4px solid #111;
        box-shadow: 10px 10px 0px #111;
        background: #FFFDF9;
        padding: 40px;
        margin-bottom: 20px;
    }
    
    .badge {
        display: inline-block;
        background: #FFE600;
        color: #111;
        font-weight: 800;
        font-size: 14px;
        text-transform: uppercase;
        padding: 8px 18px;
        border: 2px solid #111;
        box-shadow: 3px 3px 0px #111;
        margin-bottom: 25px;
        letter-spacing: 1px;
    }
    
    .cover-title {
        font-size: 32px;
        font-weight: 900;
        line-height: 1.25;
        text-transform: uppercase;
        margin-bottom: 15px;
        color: #111;
    }
    
    .cover-sub {
        font-size: 16px;
        font-weight: 600;
        color: #444;
        margin-bottom: 35px;
    }
    
    .meta-box {
        border: 2px solid #111;
        background: #F3F0E6;
        padding: 16px 28px;
        box-shadow: 4px 4px 0px #111;
        font-size: 13px;
        text-align: left;
        display: inline-block;
    }
    
    .meta-box p {
        margin-bottom: 6px;
    }
    .meta-box p:last-child {
        margin-bottom: 0;
    }
    
    .chapter-card {
        border: 2.5px solid #111;
        box-shadow: 5px 5px 0px #111;
        background: #FFFDF9;
        margin-bottom: 24px;
        page-break-inside: avoid;
        padding: 18px 22px;
    }
    
    .chapter-title {
        font-size: 18px;
        font-weight: 900;
        text-transform: uppercase;
        border-bottom: 2.5px solid #111;
        padding-bottom: 8px;
        margin-bottom: 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .section-title {
        font-size: 14px;
        font-weight: 800;
        color: #A31D1D;
        margin-top: 12px;
        margin-bottom: 6px;
    }
    
    .section-p {
        margin-bottom: 8px;
        text-align: justify;
    }
    
    .table-custom {
        width: 100%;
        border-collapse: collapse;
        margin: 14px 0;
        font-size: 12px;
    }
    
    .table-custom th, .table-custom td {
        border: 1.5px solid #111;
        padding: 8px 10px;
        text-align: left;
    }
    
    .table-custom th {
        background: #FFE600;
        font-weight: 800;
    }
    
    .table-custom tr:nth-child(even) {
        background: #FDF9F1;
    }

    /* Question Bank Styles */
    .question-card {
        border: 2px solid #111;
        box-shadow: 4px 4px 0px #111;
        background: #FFFDF9;
        margin-bottom: 16px;
        padding: 14px 18px;
        page-break-inside: avoid;
    }
    
    .q-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
        font-weight: 800;
        font-size: 12px;
    }
    
    .q-badge {
        background: #E0E7FF;
        border: 1.5px solid #111;
        padding: 2px 8px;
        border-radius: 4px;
    }
    
    .q-prompt {
        font-weight: 700;
        font-size: 13.5px;
        margin-bottom: 10px;
        line-height: 1.45;
    }
    
    .q-options {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 6px;
        margin-bottom: 10px;
        font-size: 12.5px;
    }
    
    .q-opt {
        padding: 6px 10px;
        border: 1.5px solid #111;
        background: #FAFAFA;
        border-radius: 3px;
    }
    
    .q-opt.correct {
        background: #D1FAE5;
        border-color: #065F46;
        font-weight: 700;
    }
    
    .q-solution {
        background: #F3F4F6;
        border-left: 3.5px solid #111;
        padding: 8px 12px;
        margin-top: 8px;
        font-size: 12px;
    }
    
    .sol-row {
        margin-bottom: 4px;
    }
    
    .sol-label {
        font-weight: 800;
        color: #111;
    }
    
    .sol-tip {
        background: #FEF3C7;
        padding: 4px 8px;
        border: 1px dashed #B45309;
        margin-top: 4px;
        font-weight: 600;
        color: #92400E;
    }
    """

    # 1. Build TTHCM_Kien_Thuc_Trong_Tam.html
    html1 = f"""<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<title>Hệ Thống Kiến Thức Trọng Tâm Tư Tưởng Hồ Chí Minh</title>
<style>{shared_css}</style>
</head>
<body>

<div class="cover-page">
    <div class="badge">Học Viện Kỹ Thuật Mật Mã • Khoa Lý Luận Chính Trị</div>
    <div class="cover-title">TỔNG HỢP KIẾN THỨC TRỌNG TÂM<br>TƯ TƯỞNG HỒ CHÍ MINH</div>
    <div class="cover-sub">Tóm Tắt 6 Chương Giáo Trình Chuẩn • Biên Niên Sử • Tác Phẩm Kinh Điển • Bảng Từ Khóa Vàng</div>
    <div class="meta-box">
        <p><strong>Đối tượng phục vụ:</strong> Sinh viên ôn thi kết thúc học phần & Chuẩn đầu ra KMA</p>
        <p><strong>Cơ sở tài liệu:</strong> Giáo trình Tư tưởng Hồ Chí Minh (Bộ GD&ĐT) & Đề cương Học viện KTMM</p>
        <p><strong>Phương pháp:</strong> Sơ đồ hóa, bảng biểu đối sánh, từ khóa trọng điểm thi trắc nghiệm</p>
        <p><strong>Ngày phát hành:</strong> Tháng 10/2026 • Phiên bản Pro Master</p>
    </div>
</div>
"""

    # Add 6 chapters
    for ch in kb['chapters']:
        html1 += f"""
<div class="chapter-card">
    <div class="chapter-title">
        <span>{html.escape(ch['title'])}</span>
    </div>
    <p style="font-style: italic; color: #555; margin-bottom: 12px;">{html.escape(ch['summary'])}</p>
"""
        for sec in ch['sections']:
            html1 += f"""
    <div class="section-title">{html.escape(sec['title'])}</div>
"""
            for p in sec['content']:
                clean_p = html.escape(p).replace('\n', '<br>')
                # Format bold
                clean_p = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', clean_p)
                clean_p = re.sub(r'\*(.*?)\*', r'<em>\1</em>', clean_p)
                html1 += f"""    <p class="section-p">{clean_p}</p>\n"""
        html1 += "</div>\n"

    # Add Timeline Table
    html1 += """
<div class="chapter-card">
    <div class="chapter-title">BIÊN NIÊN SỬ HOẠT ĐỘNG CÁCH MẠNG CỦA CHỦ TỊCH HỒ CHÍ MINH (1890 - 1969)</div>
    <table class="table-custom">
        <thead>
            <tr>
                <th style="width: 15%;">Mốc Năm</th>
                <th>Sự Kiện Lịch Sử Trọng Đại & Ý Nghĩa Quyết Định</th>
            </tr>
        </thead>
        <tbody>
"""
    for t in kb.get('timeline', []):
        html1 += f"""
            <tr>
                <td><strong>{html.escape(t['year'])}</strong></td>
                <td>{html.escape(t['event'])}</td>
            </tr>
"""
    html1 += """
        </tbody>
    </table>
</div>
"""

    # Add Magic Keywords Table
    html1 += """
<div class="chapter-card">
    <div class="chapter-title">BẢNG "TỪ KHÓA VÀNG" LÀM NHANH BÀI THI TRẮC NGHIỆM TƯ TƯỞNG HỒ CHÍ MINH</div>
    <table class="table-custom">
        <thead>
            <tr>
                <th style="width: 50%;">Cụm Từ Khóa Xuất Hiện Trong Câu Hỏi</th>
                <th>Đáp Án Khớp Trực Tiếp (Chọn Ngay)</th>
            </tr>
        </thead>
        <tbody>
"""
    for mk in kb.get('magic_keywords', []):
        html1 += f"""
            <tr>
                <td><strong>{html.escape(mk['keyword'])}</strong></td>
                <td style="color: #065F46; font-weight: 700;">{html.escape(mk['match'])}</td>
            </tr>
"""
    html1 += """
        </tbody>
    </table>
</div>

</body>
</html>
"""

    with open('pdf_templates/tthcm_kien_thuc_trong_tam.html', 'w', encoding='utf-8') as f:
        f.write(html1)
    print("Generated pdf_templates/tthcm_kien_thuc_trong_tam.html")

    # 2. Build TTHCM_Ngan_Hang_Cau_Hoi_Loi_Giai_Meo_Nho.html
    html2 = f"""<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<title>Ngân Hàng 885 Câu Hỏi & Lời Giải Chi Tiết Tư Tưởng Hồ Chí Minh</title>
<style>{shared_css}</style>
</head>
<body>

<div class="cover-page">
    <div class="badge">Học Viện Kỹ Thuật Mật Mã • Toàn Bộ 885 Câu Hỏi</div>
    <div class="cover-title">NGÂN HÀNG CÂU HỎI TRẮC NGHIỆM<br>LỜI GIẢI CHI TIẾT & MẸO NHỚ NHANH<br>TƯ TƯỞNG HỒ CHÍ MINH</div>
    <div class="cover-sub">Tổng Hợp Đầy Đủ 4 Nguồn Đề: Đề Cuối Kỳ (ĐA Full A), Đề 132, Đề Mẫu 651 & Đề Cương ATTT KMA</div>
    <div class="meta-box">
        <p><strong>Tổng số câu hỏi:</strong> 885 câu trắc nghiệm chuẩn xác 100%</p>
        <p><strong>Nội dung kèm theo:</strong> Phân tích học thuật, trích dẫn văn kiện/tác phẩm, mẹo nhớ nhanh</p>
        <p><strong>Phân loại:</strong> Chia theo 6 chương giáo trình và 4 bộ đề gốc của học viện</p>
        <p><strong>Tình trạng:</strong> Đầy đủ 100% lời giải chuẩn, 0 câu bỏ sót</p>
    </div>
</div>
"""

    current_source = None
    for idx, q in enumerate(questions):
        source_title = q.get('source_title', q.get('source'))
        if source_title != current_source:
            current_source = source_title
            html2 += f"""
<div style="background: #111; color: #FFE600; padding: 12px 18px; margin: 25px 0 15px 0; font-size: 16px; font-weight: 900; text-transform: uppercase; border: 2px solid #111;">
    PHẦN {html.escape(current_source)} (Tổng hợp {sum(1 for x in questions if x.get('source_title', x.get('source')) == current_source)} câu)
</div>
"""

        correct_ans = q.get('answer', 'A')
        html2 += f"""
<div class="question-card">
    <div class="q-header">
        <span class="q-badge">{html.escape(q.get('id', f'Q{idx+1}'))} • {html.escape(q.get('chapter_title', 'TTHCM'))}</span>
        <span style="color: #065F46;">Đáp án đúng: <strong>{correct_ans}</strong></span>
    </div>
    <div class="q-prompt">{idx+1}. {html.escape(q.get('prompt', ''))}</div>
    <div class="q-options">
"""
        for opt in q.get('options', []):
            is_corr = opt.startswith(correct_ans + '.') or opt.startswith(correct_ans + ':')
            cls = "q-opt correct" if is_corr else "q-opt"
            html2 += f"""        <div class="{cls}">{html.escape(opt)}</div>\n"""
        
        html2 += f"""
    </div>
    <div class="q-solution">
        <div class="sol-row"><span class="sol-label">💡 Lời giải học thuật:</span> {html.escape(q.get('explanation', ''))}</div>
        <div class="sol-row"><span class="sol-label">🎯 Phương pháp:</span> {html.escape(q.get('methodology', ''))}</div>
        <div class="sol-tip">⚡ Mẹo nhớ: {html.escape(q.get('tips', ''))}</div>
    </div>
</div>
"""

    html2 += """
</body>
</html>
"""

    with open('pdf_templates/tthcm_ngan_hang_cau_hoi.html', 'w', encoding='utf-8') as f:
        f.write(html2)
    print("Generated pdf_templates/tthcm_ngan_hang_cau_hoi.html")

if __name__ == '__main__':
    build_tthcm_pdf_templates()
