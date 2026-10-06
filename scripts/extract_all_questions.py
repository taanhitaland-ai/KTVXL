import json
import os
import re
import docx

os.makedirs('data', exist_ok=True)
os.makedirs('web/assets/images', exist_ok=True)

# 40 standard matrix topics from ma-tran-de-ky-thuat-vi-xu-ly.pdf
MATRIX_TOPICS = {
    1: {"clo": "CLO1", "level": "NB", "name": "Tổng quan chung về vi xử lý, vi điều khiển"},
    2: {"clo": "CLO1", "level": "NB", "name": "Cấu trúc chung của bộ vi xử lý (ALU, CU, Bus)"},
    3: {"clo": "CLO1", "level": "NB", "name": "Nguyên lý hoạt động của bộ vi xử lý (Fetch-Decode-Execute)"},
    4: {"clo": "CLO1", "level": "NB", "name": "Cấu trúc bộ nhớ (ROM, RAM, Không gian địa chỉ)"},
    5: {"clo": "CLO2", "level": "NB", "name": "Kiến trúc tổng quan của 89C51"},
    6: {"clo": "CLO2", "level": "NB", "name": "Các chân điều khiển của 89C51 (EA, ALE, PSEN, RST)"},
    7: {"clo": "CLO2", "level": "NB", "name": "Các thanh ghi chức năng đặc biệt SFR 89C51"},
    8: {"clo": "CLO2", "level": "NB", "name": "Các cờ trên vi điều khiển 89C51 (Thanh ghi PSW)"},
    9: {"clo": "CLO2", "level": "TH", "name": "Xác định không gian địa chỉ bộ nhớ mở rộng"},
    10: {"clo": "CLO2", "level": "TH", "name": "Xác định dung lượng bộ nhớ mở rộng"},
    11: {"clo": "CLO2", "level": "TH", "name": "Tổ chức bộ nhớ RAM và bộ nhớ ROM nội"},
    12: {"clo": "CLO2", "level": "TH", "name": "Mở rộng bộ nhớ RAM và ROM ngoài"},
    13: {"clo": "CLO2", "level": "TH", "name": "Các chế độ định địa chỉ (Tức thời, Trực tiếp, Gián tiếp...)"},
    14: {"clo": "CLO2", "level": "NB", "name": "Tổng quan về ASM và các chỉ dẫn khai báo"},
    15: {"clo": "CLO2", "level": "NB", "name": "Phân loại nhóm lệnh trong 89C51"},
    16: {"clo": "CLO3", "level": "TH", "name": "Xác định chức năng của lệnh (1) - Chuyển dữ liệu"},
    17: {"clo": "CLO3", "level": "VD", "name": "Xác định chức năng của lệnh (2) - Số học, Logic, Nhảy"},
    18: {"clo": "CLO3", "level": "TH", "name": "Xác định giá trị thanh ghi sau một lệnh"},
    19: {"clo": "CLO3", "level": "TH", "name": "Xác định giá trị của các cờ trạng thái (CY, AC, OV, P)"},
    20: {"clo": "CLO3", "level": "TH", "name": "Xác định giá trị thanh ghi sau một đoạn lệnh (1)"},
    21: {"clo": "CLO3", "level": "TH", "name": "Xác định giá trị thanh ghi sau một đoạn lệnh (2)"},
    22: {"clo": "CLO3", "level": "VD", "name": "Chương trình con (CALL, RET, Tra bảng MOVC)"},
    23: {"clo": "CLO3", "level": "VD", "name": "Hoàn thiện đoạn lệnh của chương trình"},
    24: {"clo": "CLO3", "level": "VD", "name": "Đọc hiểu chương trình và tính giá trị thanh ghi/ô nhớ"},
    25: {"clo": "CLO3", "level": "VD", "name": "Xác định chức năng của chương trình"},
    26: {"clo": "CLO3", "level": "TH", "name": "Nguyên lý hoạt động của bộ đếm / bộ định thời"},
    27: {"clo": "CLO3", "level": "VD", "name": "Xác định chế độ của bộ đếm / bộ định thời (TMOD)"},
    28: {"clo": "CLO3", "level": "VD", "name": "Xác định giá trị đếm / định thời của Timer"},
    29: {"clo": "CLO3", "level": "VD", "name": "Xác định giá trị khởi đầu của Timer (Nạp TH, TL)"},
    30: {"clo": "CLO3", "level": "VD", "name": "Lập trình cho bộ đếm / bộ định thời"},
    31: {"clo": "CLO3", "level": "TH", "name": "Nguyên lý hoạt động của cổng truyền thông nối tiếp UART"},
    32: {"clo": "CLO3", "level": "VD", "name": "Xác định chế độ thanh ghi truyền thông nối tiếp (SCON)"},
    33: {"clo": "CLO3", "level": "VD", "name": "Xác định tốc độ truyền Baud Rate (Timer 1 Mode 2)"},
    34: {"clo": "CLO3", "level": "VD", "name": "Lập trình trong truyền thông nối tiếp"},
    35: {"clo": "CLO3", "level": "TH", "name": "Hoạt động ngắt trong 89C51"},
    36: {"clo": "CLO3", "level": "TH", "name": "Xác định vector ngắt (Reset, INT0, TF0, INT1, TF1, UART)"},
    37: {"clo": "CLO3", "level": "TH", "name": "Thiết lập thanh ghi IE và IP cho các ngắt"},
    38: {"clo": "CLO3", "level": "VD", "name": "Lập trình ngắt cho bộ đếm / bộ định thời"},
    39: {"clo": "CLO3", "level": "VD", "name": "Lập trình ngắt cứng ngoài (INT0 / INT1)"},
    40: {"clo": "CLO3", "level": "VD", "name": "Lập trình ngắt truyền thông nối tiếp (UART ISR)"}
}

def clean_text(t):
    return ' '.join(t.split()).strip()

print("Parsing 5 DOCX exam files...")

def parse_docx_exams():
    exams = []
    for de_idx in range(1, 6):
        fname = f"De_KT_Ky_thuat_vi_xu_ly_{de_idx:03d}.docx"
        doc = docx.Document(fname)
        questions = []
        cur_q = None
        
        for child in doc.element.body:
            tag = child.tag.split('}')[-1]
            if tag == 'p':
                p = docx.text.paragraph.Paragraph(child, doc)
                text = clean_text(p.text)
                
                # Check image in run
                img_found_rids = []
                for r in p.runs:
                    if 'drawing' in r._r.xml:
                        for elem in r._r.iter():
                            if elem.tag.endswith('blip'):
                                rid = elem.attrib.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}embed')
                                if rid:
                                    img_found_rids.append(rid)

                m = re.match(r'^Câu\s+(\d+)[\.:]\s*(.*)', text)
                if m:
                    if cur_q:
                        questions.append(cur_q)
                    q_num = int(m.group(1))
                    cur_q = {
                        'exam_id': f'DE_{de_idx:03d}',
                        'exam_title': f'Đề Kiểm Tra {de_idx:03d}',
                        'de_num': de_idx,
                        'num': q_num,
                        'id': f'DE{de_idx:03d}_Q{q_num:02d}',
                        'title': f'Câu {q_num}',
                        'prompt': m.group(2),
                        'extra_lines': [],
                        'options': [],
                        'type': 'mcq',
                        'images': []
                    }
                elif cur_q:
                    for rid in img_found_rids:
                        img_path = f'assets/images/de{de_idx:03d}_{rid}.png'
                        if img_path not in cur_q['images']:
                            cur_q['images'].append(img_path)
                    
                    if text.startswith(('A.', 'B.', 'C.', 'D.')):
                        cur_q['options'].append(text)
                    elif text:
                        cur_q['extra_lines'].append(text)
                        
            elif tag == 'tbl':
                if cur_q:
                    t = docx.table.Table(child, doc)
                    for r_idx, row in enumerate(t.rows):
                        for c_idx, cell in enumerate(row.cells):
                            cell_txt = clean_text(cell.text)
                            for p in cell.paragraphs:
                                for r in p.runs:
                                    if 'drawing' in r._r.xml:
                                        for elem in r._r.iter():
                                            if elem.tag.endswith('blip'):
                                                rid = elem.attrib.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}embed')
                                                if rid:
                                                    img_path = f'assets/images/de{de_idx:03d}_{rid}.png'
                                                    if img_path not in cur_q['images']:
                                                        cur_q['images'].append(img_path)
                            if cell_txt and cell_txt not in cur_q['options']:
                                cur_q['options'].append(cell_txt)
                                
        if cur_q:
            questions.append(cur_q)
            
        for q in questions:
            if len(q['options']) == 0:
                q['type'] = 'fib'
            else:
                q['type'] = 'mcq'
            # Map topic
            q_topic = MATRIX_TOPICS.get(q['num'], {})
            q['clo'] = q_topic.get('clo', 'CLO2')
            q['level'] = q_topic.get('level', 'TH')
            q['topic_name'] = q_topic.get('name', '')
            
        exams.extend(questions)
        print(f"  Parsed Exam {de_idx:03d}: {len(questions)} questions")
    return exams

docx_questions = parse_docx_exams()

print(f"Total docx questions parsed: {len(docx_questions)}")

# Now load and enrich questions with expert verified answers, explanations, methodology and Casio tips
with open('scripts/answers_and_explanations.json', 'w', encoding='utf-8') as f:
    json.dump(docx_questions, f, ensure_ascii=False, indent=2)

print("Saved intermediate parsed questions.")
