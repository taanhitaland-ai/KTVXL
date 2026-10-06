import fitz
import docx
import os
import re
import json
import shutil

os.makedirs('web/assets/images', exist_ok=True)
os.makedirs('docs/assets/images', exist_ok=True)

def clean_text(t):
    if not t:
        return ""
    t = t.replace('\xa0', ' ').replace('\u200b', '').replace('\ufeff', '')
    return ' '.join(t.split()).strip()

# -------------------------------------------------------------
# STEP 1: Copy and rename images from P7, P16, P18
# -------------------------------------------------------------
def setup_part_folder_images():
    img_map = {}
    
    # P7
    p7_files = {
        14: '14 p7.png',
        21: '21.png',
        22: '22.png',
        32: '32.png',
        39: '39.png',
        41: '41.png',
        44: '44.png'
    }
    for q_num, src_name in p7_files.items():
        src_path = os.path.join('P7', src_name)
        if os.path.exists(src_path):
            dst_name = f'p07_q{q_num:02d}.png'
            shutil.copy2(src_path, os.path.join('web/assets/images', dst_name))
            shutil.copy2(src_path, os.path.join('docs/assets/images', dst_name))
            img_map[('PART_07', q_num)] = [f'assets/images/{dst_name}']

    # P16
    p16_files = {
        5: '5.png',
        6: '6.png',
        7: '7.png',
        20: '20.png',
        24: '24.png',
        25: '25.png',
        29: '29.png',
        32: '32.png',
        34: '34.png'
    }
    for q_num, src_name in p16_files.items():
        src_path = os.path.join('P16', src_name)
        if os.path.exists(src_path):
            dst_name = f'p16_q{q_num:02d}.png'
            shutil.copy2(src_path, os.path.join('web/assets/images', dst_name))
            shutil.copy2(src_path, os.path.join('docs/assets/images', dst_name))
            img_map[('PART_16', q_num)] = [f'assets/images/{dst_name}']

    # P18
    p18_files = {
        14: '14.png',
        21: '21.png',
        22: '22.png',
        27: '27.png',
        32: '32.png',
        34: '34.png'
    }
    for q_num, src_name in p18_files.items():
        src_path = os.path.join('P18', src_name)
        if os.path.exists(src_path):
            dst_name = f'p18_q{q_num:02d}.png'
            shutil.copy2(src_path, os.path.join('web/assets/images', dst_name))
            shutil.copy2(src_path, os.path.join('docs/assets/images', dst_name))
            img_map[('PART_18', q_num)] = [f'assets/images/{dst_name}']

    return img_map

# -------------------------------------------------------------
# STEP 2: Extract embedded images from Part 13 & 14
# -------------------------------------------------------------
def extract_pdf_embedded_images(pdf_path, part_prefix, part_key, img_map):
    doc = fitz.open(pdf_path)
    all_blocks = []
    for pno in range(len(doc)):
        page = doc[pno]
        for b in page.get_text('blocks'):
            if b[1] < 28 or b[3] > 762: continue
            text = b[4].strip()
            if not text or 'forms.cloud' in text or 'forms.office' in text: continue
            all_blocks.append({
                'pno': pno + 1,
                'y0': b[1],
                'text': text
            })
    
    for pno in range(len(doc)):
        page = doc[pno]
        imgs = page.get_images()
        for img_info in imgs:
            xref = img_info[0]
            rects = page.get_image_rects(xref)
            if not rects: continue
            r = rects[0]
            if r.y1 > 750 or (abs(r.width - 122.25) < 10 and abs(r.height - 45) < 10):
                continue
            
            page_blocks = [b for b in all_blocks if b['pno'] == pno + 1]
            best_q = None
            min_dist = 999999
            for b in page_blocks:
                m = re.match(r'^(\d+)\.?$', b['text'])
                if m and int(m.group(1)) >= 4:
                    q_num = int(m.group(1))
                    dist = abs((r.y0 + r.y1)/2 - b['y0'])
                    if dist < min_dist:
                        min_dist = dist
                        best_q = q_num
            
            if best_q:
                base_img = doc.extract_image(xref)
                ext = base_img['ext']
                fname = f'{part_prefix}_q{best_q:02d}.{ext}'
                web_path = os.path.join('web/assets/images', fname)
                docs_path = os.path.join('docs/assets/images', fname)
                with open(web_path, 'wb') as f:
                    f.write(base_img['image'])
                with open(docs_path, 'wb') as f:
                    f.write(base_img['image'])
                img_map[(part_key, best_q)] = [f'assets/images/{fname}']

print("Setting up image mappings...")
GLOBAL_IMG_MAP = setup_part_folder_images()
extract_pdf_embedded_images('Check/Part 13 C3.pdf', 'p13', 'PART_13', GLOBAL_IMG_MAP)
extract_pdf_embedded_images('Check/Part 14 C3.pdf', 'p14', 'PART_14', GLOBAL_IMG_MAP)
print(f"Total image mappings populated: {len(GLOBAL_IMG_MAP)}")

# -------------------------------------------------------------
# STEP 3: Parse 5 DOCX Exams with perfect image attachment
# -------------------------------------------------------------
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

def parse_docx_exams():
    all_docx_questions = []
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
                
                # Check blips in entire paragraph XML
                blips = [elem.attrib.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}embed') 
                         for elem in child.iter() if elem.tag.endswith('blip')]
                         
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
                    for rid in blips:
                        if rid:
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
                    for row in t.rows:
                        for cell in row.cells:
                            # check blips in table cell
                            for p in cell.paragraphs:
                                blips = [elem.attrib.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}embed') 
                                         for elem in p._p.iter() if elem.tag.endswith('blip')]
                                for rid in blips:
                                    if rid:
                                        img_path = f'assets/images/de{de_idx:03d}_{rid}.png'
                                        if img_path not in cur_q['images']:
                                            cur_q['images'].append(img_path)
                            cell_txt = clean_text(cell.text)
                            if cell_txt and cell_txt not in cur_q['options']:
                                cur_q['options'].append(cell_txt)
                                
        if cur_q:
            questions.append(cur_q)
            
        for q in questions:
            if len(q['options']) == 0:
                q['type'] = 'fib'
            else:
                q['type'] = 'mcq'
            q_topic = MATRIX_TOPICS.get(q['num'], {})
            q['clo'] = q_topic.get('clo', 'CLO2')
            q['level'] = q_topic.get('level', 'TH')
            q['topic_name'] = q_topic.get('name', '')
            
        print(f"Parsed DOCX Exam {de_idx:03d}: {len(questions)} questions")
        for q in questions:
            if q['images']:
                print(f"   {q['id']} has images: {q['images']}")
        all_docx_questions.extend(questions)
        
    return all_docx_questions

# -------------------------------------------------------------
# STEP 4: Parse Group A PDFs (Part 1 - 7)
# -------------------------------------------------------------
def is_page_header_footer(text, b):
    # Header timestamp / title: e.g. "16:21 28/6/26", "KTVXL..."
    if b[1] < 26 and (re.search(r'\d\d:\d\d\s+\d', text) or 'KTVXL' in text):
        return True
    # Footer url / page numbers
    if b[3] > 760 and ('forms.cloud' in text or 'forms.office' in text or re.match(r'^\d+/\d+$', text)):
        return True
    if 'forms.cloud' in text or 'forms.office' in text:
        return True
    if 'Nội dung này được tạo bởi' in text or 'Microsoft Forms |' in text or 'Chủ sở hữu của biểu mẫu' in text:
        return True
    if 'When you submit this form' in text or 'Khi bạn gửi biểu mẫu' in text:
        return True
    return False

def parse_group_a_pdf(pdf_path, part_num, part_title):
    doc = fitz.open(pdf_path)
    all_blocks = []
    
    for pno in range(len(doc)):
        page = doc[pno]
        for b in page.get_text('blocks'):
            text = b[4].strip()
            if not text or is_page_header_footer(text, b):
                continue
            all_blocks.append({
                'pno': pno + 1,
                'x0': b[0], 'y0': b[1], 'x1': b[2], 'y1': b[3],
                'global_y': pno * 1000 + b[1],
                'text': text
            })
    all_blocks.sort(key=lambda b: b['global_y'])
    
    # Split into questions by badge
    badge_indices = []
    for idx, b in enumerate(all_blocks):
        if re.search(r'^(?:Đúng|Không chính xác)\s*\n?\s*\d+/\d+\s*Điểm', b['text']):
            badge_indices.append(idx)
            
    questions = []
    part_key = f'PART_{part_num:02d}'
    
    for i, b_idx in enumerate(badge_indices):
        next_b_idx = badge_indices[i+1] if i+1 < len(badge_indices) else len(all_blocks)
        q_blocks = all_blocks[b_idx+1 : next_b_idx]
        if not q_blocks:
            continue
            
        badge_text = all_blocks[b_idx]['text']
        m_score = re.search(r'(\d+/\d+)', badge_text)
        score_val = m_score.group(1) if m_score else '0/1'
        is_correct_badge = ('Đúng' in badge_text)
        
        # Analyze blocks in q_blocks
        # Prompt blocks vs Option blocks
        # First 1-2 blocks are prompt / number
        # Options have gap >= 24
        prompt_blocks = []
        opt_blocks = []
        
        # Determine prompt
        # If block 0 is just a number (e.g. '4'), prompt is block 1
        b0_text = clean_text(q_blocks[0]['text'])
        m_num0 = re.match(r'^(\d+)\.?$', b0_text)
        if m_num0 and len(q_blocks) > 1:
            q_num = int(m_num0.group(1))
            prompt_blocks.append(clean_text(q_blocks[1]['text']))
            opt_start = 2
        else:
            m_end_num = re.search(r'(\d+)\.?$', b0_text)
            if m_end_num:
                q_num = int(m_end_num.group(1))
                prompt_blocks.append(re.sub(r'\s*\d+\.?$', '', b0_text).strip())
            else:
                q_num = i + 4
                prompt_blocks.append(b0_text)
            opt_start = 1
            
        # Group option blocks using gap >= 24
        options = []
        for blk_idx in range(opt_start, len(q_blocks)):
            cur_b = q_blocks[blk_idx]
            cur_txt = clean_text(cur_b['text'])
            if not cur_txt: continue
            
            if blk_idx == opt_start:
                options.append(cur_txt)
            else:
                prev_b = q_blocks[blk_idx - 1]
                # If on same page, check vertical gap
                if cur_b['pno'] == prev_b['pno']:
                    gap = cur_b['y0'] - prev_b['y0']
                    if gap >= 24 and len(options) < 4:
                        options.append(cur_txt)
                    else:
                        options[-1] = options[-1] + ' ' + cur_txt
                else:
                    # Crossed page
                    if len(options) < 4:
                        options.append(cur_txt)
                    else:
                        options[-1] = options[-1] + ' ' + cur_txt
                        
        prompt = clean_text(' '.join(prompt_blocks))
        imgs = GLOBAL_IMG_MAP.get((part_key, q_num), [])
        
        q_obj = {
            'source': f'Part {part_num}',
            'part_num': part_num,
            'num': q_num,
            'id': f'{part_key}_Q{q_num:02d}',
            'title': f'Part {part_num} - Câu {q_num}',
            'prompt': prompt,
            'extra_lines': [],
            'options': options,
            'type': 'mcq' if len(options) > 1 else 'fib',
            'fib_answer': options[0] if len(options) == 1 else '',
            'images': imgs,
            'is_correct_badge': is_correct_badge,
            'score_badge': score_val
        }
        questions.append(q_obj)
        
    print(f"Parsed {len(questions)} questions from {pdf_path}")
    return questions

# -------------------------------------------------------------
# STEP 5: Parse Group B & C PDFs (Part 9 - 18)
# -------------------------------------------------------------
def parse_group_b_c_pdf(pdf_path, part_num, part_key, part_title):
    doc = fitz.open(pdf_path)
    all_blocks = []
    
    for pno in range(len(doc)):
        page = doc[pno]
        for b in page.get_text('blocks'):
            text = b[4].strip()
            if b[1] < 26 and (re.search(r'\d\d:\d\d', text) or 'KTVXL' in text):
                continue
            if b[3] > 760 and ('forms.cloud' in text or 'forms.office' in text):
                continue
            if 'forms.cloud' in text or 'forms.office' in text:
                continue
            if 'Khi bạn gửi biểu mẫu' in text or 'When you submit' in text or 'Bắt buộc' in text or 'Required' in text:
                continue
            if re.match(r'^(?:Mã sinh viên|Họ và tên|Họ và Tên|Lớp học phần)', text):
                continue
            all_blocks.append({
                'pno': pno + 1, 'x0': b[0], 'y0': b[1],
                'global_y': pno * 1000 + b[1], 'text': text
            })
    all_blocks.sort(key=lambda b: b['global_y'])
    
    rows = []
    cur_row = []
    for b in all_blocks:
        if not cur_row:
            cur_row.append(b)
        else:
            if cur_row[0]['pno'] == b['pno'] and abs(cur_row[0]['y0'] - b['y0']) < 14:
                cur_row.append(b)
            else:
                rows.append(cur_row)
                cur_row = [b]
    if cur_row:
        rows.append(cur_row)
        
    lines = []
    for r in rows:
        r.sort(key=lambda x: x['x0'])
        lines.append(' '.join(item['text'] for item in r))
        
    questions = []
    cur_q = None
    expected_q = 4
    
    for l in lines:
        cl = ' '.join(l.split()).strip()
        if not cl or re.match(r'^\d+:\d+$', cl):
            continue
        if cl == 'Nhập câu trả lời của bạn' or cl == 'Enter your answer':
            continue
            
        m_start = re.match(r'^(?:\(\s*\d+\s*(?:Point|Điểm)\s*\)\s*)?(\d+)[\.:]\s*(.*)', cl, re.I)
        m_stand = re.match(r'^(\d+)\.?$', cl)
        m_end = re.search(r'(?:\(\s*\d+\s*(?:Point|Điểm)\s*\)\s*)?(\d+)[\.:]\s*$', cl, re.I)
        
        is_new_q = False
        new_prompt = ''
        
        if m_start and int(m_start.group(1)) == expected_q:
            is_new_q = True
            new_prompt = m_start.group(2).strip()
        elif m_stand and int(m_stand.group(1)) == expected_q:
            is_new_q = True
            new_prompt = ''
        elif m_end and int(m_end.group(1)) == expected_q:
            is_new_q = True
            new_prompt = re.sub(r'(?:\(\s*\d+\s*(?:Point|Điểm)\s*\)\s*)?\d+[\.:]\s*$', '', cl, flags=re.I).strip()
            
        if is_new_q:
            if cur_q:
                questions.append(cur_q)
            cur_q = {'num': expected_q, 'prompt_parts': [new_prompt] if new_prompt else [], 'options': [], 'state': 'await_prompt' if not new_prompt else 'in_prompt'}
            expected_q += 1
            continue
            
        if cur_q:
            if re.search(r'\(\s*\d+\s*(?:Point|Điểm)\s*\)', cl, re.I):
                clean_t = re.sub(r'\(\s*\d+\s*(?:Point|Điểm)\s*\)', '', cl, flags=re.I).strip()
                if clean_t and not cur_q['prompt_parts']:
                    cur_q['prompt_parts'].append(clean_t)
                cur_q['state'] = 'in_options'
                continue
                
            if cur_q['state'] in ('await_prompt', 'in_prompt'):
                cur_q['prompt_parts'].append(cl)
            else:
                cur_q['options'].append(cl)
                
    if cur_q:
        questions.append(cur_q)
        
    formatted_questions = []
    for q in questions:
        q_num = q['num']
        imgs = GLOBAL_IMG_MAP.get((part_key, q_num), [])
        
        raw_opts = q['options']
        # Filter boilerplate and consolidate wrapped options cleanly
        cleaned_opts = []
        for opt in raw_opts:
            c = clean_text(opt)
            if not c: continue
            if any(kw in c.lower() for kw in [
                'never give out your password', 'không bao giờ tiết lộ',
                'microsoft forms', 'report abuse', 'báo cáo lạm dụng',
                'privacy statement', 'tuyên bố về quyền riêng tư',
                'terms of use', 'điều khoản sử dụng',
                'this content is created', 'nội dung này được tạo'
            ]):
                continue
            cleaned_opts.append(c)

        if len(cleaned_opts) == 1 and cleaned_opts[0] == '# % $ @':
            consolidated_opts = ['#', '%', '$', '@']
        elif len(cleaned_opts) > 4 and 'Option 2' in cleaned_opts:
            consolidated_opts = [o for o in cleaned_opts if o != 'Option 2']
        elif len(cleaned_opts) <= 4:
            consolidated_opts = cleaned_opts
        else:
            merged = []
            for c in cleaned_opts:
                if not merged:
                    merged.append(c)
                else:
                    prev = merged[-1]
                    is_continuation = False
                    if len(merged) <= 4:
                        if (prev.endswith(('là', 'tại', 'ở', 'và', 'với', 'trong', 'tương ứng đặt tại', 'nội dung tại', 'xung thấp là')) or
                            c.startswith(('và ', 'trên ', 'hoặc ')) or
                            (c[0].islower() and not c.startswith(('a.', 'b.', 'c.', 'd.')))):
                            if not (c.startswith('Chương trình') or c.startswith('Lệnh') or c.startswith('Sao chép') or c.startswith('So sánh') or c.startswith('Tính tổng')):
                                is_continuation = True
                    if is_continuation:
                        merged[-1] = merged[-1] + ' ' + c
                    else:
                        merged.append(c)
            consolidated_opts = merged

        prompt_full = clean_text(' '.join(q['prompt_parts']))
        is_fib = (len(consolidated_opts) <= 1 and ('____' in prompt_full or 'chỗ trống' in prompt_full.lower() or len(raw_opts) <= 1))

        prompt = prompt_full
        prompt = re.sub(r'^(?:Câu\s+)?\d+[\.:]\s*', '', prompt).strip()

        q_obj = {
            'source': part_title,
            'part_num': part_num,
            'num': q_num,
            'id': f'{part_key}_Q{q_num:02d}',
            'title': f'{part_title} - Câu {q_num}',
            'prompt': prompt,
            'extra_lines': [],
            'options': [] if is_fib else consolidated_opts,
            'fib_answer': consolidated_opts[0] if (is_fib and len(consolidated_opts) > 0) else '',
            'type': 'fib' if is_fib else 'mcq',
            'images': imgs
        }
        formatted_questions.append(q_obj)
        
    print(f"Parsed {len(formatted_questions)} questions from {pdf_path}")
    return formatted_questions

# -------------------------------------------------------------
# STEP 6: Execute All Parsers
# -------------------------------------------------------------
if __name__ == '__main__':
    all_docx = parse_docx_exams()
    
    group_a_files = [
        (1, 'KTVXL - MM - CNTT- Part 1.pdf', 'Part 1'),
        (2, 'KTVXL\xa0- MM - CNTT-\xa0Part 2.pdf', 'Part 2'),
        (3, 'KTVXL\xa0- MM - CNTT-\xa0Part 3.pdf', 'Part 3'),
        (4, 'KTVXL\xa0- MM - CNTT-\xa0Part 4.pdf', 'Part 4'),
        (5, 'KTVXL\xa0- MM - CNTT-\xa0Part 5.pdf', 'Part 5'),
        (6, 'KTVXL\xa0- MM - CNTT-\xa0Part 6.pdf', 'Part 6'),
        (7, 'KTVXL\xa0- MM - CNTT-\xa0Part 7.pdf', 'Part 7'),
    ]
    all_part_a = []
    for pnum, fname, ptitle in group_a_files:
        qs = parse_group_a_pdf(fname, pnum, ptitle)
        all_part_a.extend(qs)
        
    group_b_c_files = [
        ('KTVXL\xa0- MM - CNTT-\xa0Part 9.pdf', 9, 'PART_09_ROOT', 'Part 9'),
        ('Check/Part 9-BT C2.pdf', 9, 'PART_09_BT', 'Part 9 (BT)'),
        ('Check/Part 10-BT C2.pdf', 10, 'PART_10', 'Part 10'),
        ('Check/Part 11 BT C2.pdf', 11, 'PART_11', 'Part 11'),
        ('Check/Part 12-Done C2.pdf', 12, 'PART_12', 'Part 12'),
        ('Check/Part 13 C3.pdf', 13, 'PART_13', 'Part 13'),
        ('Check/Part 14 C3.pdf', 14, 'PART_14', 'Part 14'),
        ('KTVXL\xa0- MM - CNTT-\xa0Part 15.pdf', 15, 'PART_15', 'Part 15'),
        ('KTVXL\xa0- MM - CNTT-\xa0Part 16.pdf', 16, 'PART_16', 'Part 16'),
        ('KTVXL\xa0- MM - CNTT-\xa0Part 17.pdf', 17, 'PART_17', 'Part 17'),
        ('KTVXL\xa0- MM - CNTT-\xa0Part 18.pdf', 18, 'PART_18', 'Part 18'),
    ]
    all_part_b_c = []
    for fname, pnum, pkey, ptitle in group_b_c_files:
        qs = parse_group_b_c_pdf(fname, pnum, pkey, ptitle)
        all_part_b_c.extend(qs)
        
    total_parts = all_part_a + all_part_b_c
    print(f"\n==========================================")
    print(f"SUMMARY OF EXTRACTION:")
    print(f"  DOCX Exam Questions:  {len(all_docx)}")
    print(f"  Part 1-7 Questions:   {len(all_part_a)}")
    print(f"  Part 9-18 Questions:  {len(all_part_b_c)}")
    print(f"  Total Part Questions: {len(total_parts)}")
    print(f"  Total All Questions:  {len(all_docx) + len(total_parts)}")
    
    with open('data/docx_questions_clean.json', 'w', encoding='utf-8') as f:
        json.dump(all_docx, f, ensure_ascii=False, indent=2)
    with open('data/part_questions_clean.json', 'w', encoding='utf-8') as f:
        json.dump(total_parts, f, ensure_ascii=False, indent=2)
    print("Saved clean parsed files to data/")



