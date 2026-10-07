#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Builder script for Tư Tưởng Hồ Chí Minh Master Database
Parses 4 source documents:
1. TTHCM/Bộ câu hỏi cuối kì(ĐA Full A).pdf (281 questions, Answer is A)
2. TTHCM/tthcm.pdf (298 questions, Mã đề 132)
3. TTHCM/tu-tuong-ho-chi-minh.pdf (50 questions, Đề mẫu 651)
4. TTHCM/ÔN-TẬP-TRAC-NGHIEM-TTHCM-AT-2019-1.doc (258 questions, Đề cương KMA ATTT)

Generates:
- data/tthcm_questions_db.json
- web/data/tthcm_questions.json
- docs/data/tthcm_questions.json
- web/tthcm_data.js
- docs/tthcm_data.js
"""

import os
import re
import json
import unicodedata
from difflib import SequenceMatcher
import pypdf
import pymupdf

def clean(t):
    if not t:
        return ''
    t = unicodedata.normalize('NFC', t).lower()
    t = re.sub(r'^(câu\s*\d*[\.:]|câu\s*hỏi[\.:])', '', t.strip())
    t = re.sub(r'[^\w\s]', ' ', t)
    return ' '.join(t.split())

def classify_chapter(prompt, answer_text=''):
    p = (prompt + ' ' + answer_text).lower()
    
    # Chuong 6: Van hoa, dao duc, con nguoi
    if any(k in p for k in ['đạo đức', 'cần, kiệm', 'liêm', 'chính', 'chí công vô tư', 'trung với nước', 
                           'hiếu với dân', 'văn hóa', 'thiên gia thi', 'trồng người', 'con người', 
                           'nhật ký trong tù', 'hiền dữ', 'đời sống mới', 'nói đi đôi với làm', 
                           'tu dưỡng đạo đức', 'chuẩn mực đạo đức', 'nguyên tắc xây dựng đạo đức']):
        return 6, 'Chương 6: Văn hóa, đạo đức và con người'
    
    # Chuong 5: Dai doan ket dan toc & Doan ket quoc te
    if any(k in p for k in ['đại đoàn kết', 'mặt trận', 'đoàn kết dân tộc', 'đoàn kết quốc tế', 
                           'liên minh công nông', 'sức mạnh thời đại', 'quốc tế vô sản', 
                           'bạn bè quốc tế', 'ngoại giao', 'dĩ bất biến', 'ứng vạn biến']):
        return 5, 'Chương 5: Đại đoàn kết toàn dân tộc & Đoàn kết quốc tế'
        
    # Chuong 4: Dang Cong san & Nha nuoc cua dan, do dan, vi dan
    if any(k in p for k in ['đảng cộng sản', 'xây dựng đảng', 'công tác cán bộ', 'nhà nước', 
                           'hiến pháp', 'dân chủ', 'của dân, do dân', 'vì dân', 'quốc hội', 
                           'tham ô', 'lãng phí', 'quan liêu', 'giặc nội xâm', 'pháp quyền',
                           'bản chất giai cấp công nhân', 'hành pháp', 'tư pháp', 'lập pháp']):
        return 4, 'Chương 4: Đảng Cộng sản & Nhà nước của dân, do dân, vì dân'
        
    # Chuong 3: Doc lap dan toc & Chu nghia xa hoi
    if any(k in p for k in ['độc lập dân tộc', 'chủ nghĩa xã hội', 'cách mạng giải phóng dân tộc', 
                           'thời kỳ quá độ', 'tiến lên chủ nghĩa xã hội', 'cơm no áo ấm', 
                           'chủ nghĩa tư bản', 'con đỉa hai vòi', 'cách mệnh rồi thì quyền',
                           'động lực của chủ nghĩa xã hội', 'mục tiêu của chủ nghĩa xã hội']):
        return 3, 'Chương 3: Độc lập dân tộc gắn liền với Chủ nghĩa xã hội'
        
    # Chuong 2: Co so, qua trinh hinh thanh va phat trien TTHCM
    if any(k in p for k in ['nguyễn tất thành', 'nguyễn ái quốc', '1911', '1920', '1930', '1941', 
                           '1945', 'bến nhà rồng', 'luận cương', 'lênin', 'mác', 'phật giáo', 
                           'nho giáo', 'yêu nước', 'hình thành', 'phát triển', 'đường kách mệnh', 
                           'bản án chế độ', 'hội việt nam cách mạng', 'thời kỳ']):
        return 2, 'Chương 2: Cơ sở, quá trình hình thành & phát triển TTHCM'
        
    # Chuong 1: Khai niem, doi tuong, phuong phap nghien cuu
    if any(k in p for k in ['khái niệm', 'thuật ngữ', 'đại hội vii', 'đại hội ix', 'đại hội xi', 
                           'kim chỉ nam', 'nền tảng tư tưởng', 'đối tượng nghiên cứu', 
                           'phương pháp nghiên cứu', 'ý nghĩa học tập', 'bộ môn']):
        return 1, 'Chương 1: Khái niệm, đối tượng, phương pháp nghiên cứu TTHCM'
        
    if any(k in p for k in ['chủ nghĩa']):
        return 3, 'Chương 3: Độc lập dân tộc gắn liền với Chủ nghĩa xã hội'
    if any(k in p for k in ['đảng']):
        return 4, 'Chương 4: Đảng Cộng sản & Nhà nước của dân, do dân, vì dân'
        
    return 2, 'Chương 2: Cơ sở, quá trình hình thành & phát triển TTHCM'

def generate_academic_explanation(prompt, correct_opt_text, chapter_num):
    ans_clean = correct_opt_text.strip()
    p_lower = prompt.lower()
    
    # Specific targeted explanations for frequent high-yield topics
    if 'đại hội' in p_lower and ('vii' in ans_clean.lower() or 'lần thứ vii' in ans_clean.lower()):
        return (
            "Tại Đại hội Đại biểu toàn quốc lần thứ VII (tháng 6/1991), Đảng Cộng sản Việt Nam đã chính thức ghi vào Cương lĩnh xây dựng đất nước trong thời kỳ quá độ lên CNXH luận điểm có ý nghĩa bước ngoặt: "
            "\"Đảng lấy chủ nghĩa Mác - Lênin và tư tưởng Hồ Chí Minh làm nền tảng tư tưởng, kim chỉ nam cho hành động\". Luận điểm này tiếp tục được khẳng định và làm sâu sắc tại các kỳ Đại hội IX và Đại hội XI.",
            "Nguyên tắc xác lập nền tảng tư tưởng của Đảng: Đại hội VII (1991) là mốc lịch sử đầu tiên ghi nhận Tư tưởng Hồ Chí Minh là nền tảng tư tưởng và kim chỉ nam.",
            "Mẹo nhớ: Đại hội VII (1991) -> Mốc đầu tiên ghi nhận TTHCM. Nhớ từ khóa: 'Nền tảng tư tưởng, kim chỉ nam' = Đại hội VII."
        )
        
    if 'con đỉa hai vòi' in ans_clean.lower() or 'con đỉa' in ans_clean.lower():
        return (
            "Trong tác phẩm 'Bản án chế độ thực dân Pháp' (1925), Nguyễn Ái Quốc đã ví chủ nghĩa tư bản như một 'con đỉa hai vòi': một vòi bám vào giai cấp vô sản ở chính quốc, một vòi bám vào các dân tộc thuộc địa để hút máu. "
            "Từ luận điểm thiên tài này, Người khẳng định muốn đánh bại chủ nghĩa tư bản thì phải đồng thời cắt đứt cả hai vòi, tức là kết hợp chặt chẽ giữa cách mạng vô sản ở chính quốc và cách mạng giải phóng dân tộc ở thuộc địa.",
            "Bản chất chủ nghĩa đế quốc: Bóc lột cả nhân dân chính quốc lẫn thuộc địa; cách mạng hai nơi phải phối hợp chặt chẽ.",
            "Mẹo nhớ: Hình ảnh 'con đỉa hai vòi' xuất hiện trong tác phẩm kinh điển 'Bản án chế độ thực dân Pháp' (1925)."
        )
        
    if '1987' in ans_clean:
        return (
            "Khóa họp Đại hội đồng lần thứ 24 của Tổ chức Giáo dục, Khoa học và Văn hóa Liên Hợp Quốc (UNESCO) họp tại Paris từ ngày 20/10 đến 20/11/1987 đã thông qua Nghị quyết 24C/18.65 vinh danh Chủ tịch Hồ Chí Minh là: "
            "\"Anh hùng giải phóng dân tộc và Nhà văn hóa kiệt xuất của Việt Nam\", hướng tới kỷ niệm 100 năm ngày sinh của Người vào năm 1990.",
            "Công nhận quốc tế: Nghị quyết UNESCO ban hành năm 1987, kỷ niệm 100 năm ngày sinh Bác năm 1990.",
            "Mẹo mốc năm: Nghị quyết thông qua năm 1987 (trước năm sinh 100 tuổi - 1990 đúng 3 năm)."
        )
        
    if '1911' in ans_clean and ('ra đi' in p_lower or 'tìm đường' in p_lower):
        return (
            "Ngày 5/6/1911, từ bến cảng Nhà Rồng (Sài Gòn), người thanh niên yêu nước Nguyễn Tất Thành với tên gọi Văn Ba đã lên chiếc tàu buôn Amiral Latouche-Tréville ra đi tìm đường cứu nước. "
            "Khác với các bậc tiền bối Đông du sang Nhật hay duy tân, Người quyết định sang phương Tây, đến tận mẫu quốc để tìm hiểu thực chất của 'Tự do, Bình đẳng, Bác ái' nhằm trở về giúp đồng bào.",
            "Mốc lịch sử mở đầu con đường cứu nước của Bác: Ngày 5 tháng 6 năm 1911.",
            "Mẹo nhớ: Ngày 5/6/1911 tại Bến cảng Nhà Rồng trên tàu Đô đốc Latouche-Tréville."
        )
        
    if '1920' in ans_clean and ('luận cương' in p_lower or 'lênin' in p_lower or 'quốc tế' in p_lower):
        return (
            "Tháng 7/1920, tại Paris, Nguyễn Ái Quốc đọc bản 'Sơ thảo lần thứ nhất những luận cương về vấn đề dân tộc và vấn đề thuộc địa' của V.I. Lênin đăng trên báo L'Humanité (Nhân đạo). "
            "Luận cương đã giải đáp dứt khoát con đường giải phóng dân tộc cho nhân dân Việt Nam. Tháng 12/1920, tại Đại hội Tours, Người bỏ phiếu tán thành Quốc tế III và tham gia sáng lập Đảng Cộng sản Pháp, đánh dấu bước chuyển biến quyết định từ chủ nghĩa yêu nước sang chủ nghĩa cộng sản.",
            "Bước ngoặt thế giới quan: Tháng 7/1920 đọc Luận cương Lênin; Tháng 12/1920 gia nhập Quốc tế III và sáng lập Đảng CS Pháp.",
            "Mẹo nhớ: Mốc 1920 = 'Luận cương Lênin' + 'Đại hội Tours' + 'Tìm thấy con đường cứu nước theo cách mạng vô sản'."
        )

    if 'di chúc' in ans_clean.lower():
        return (
            "Trong bản 'Di chúc' thiêng liêng để lại cho toàn Đảng, toàn dân trước lúc đi xa (1965-1969), Chủ tịch Hồ Chí Minh đã căn dặn sâu sắc về xây dựng Đảng cầm quyền: "
            "\"Đảng ta là một Đảng cầm quyền, các đồng chí từ chi bộ đến trung ương phải giữ gìn sự đoàn kết nhất trí trong Đảng như giữ gìn con ngươi của mắt mình\". Người cũng nhấn mạnh đoàn kết là truyền thống cực kỳ quý báu.",
            "Xây dựng Đảng cầm quyền: 'Giữ gìn đoàn kết nhất trí như giữ gìn con ngươi của mắt mình' là lời dặn căn cốt trong Di chúc.",
            "Mẹo từ khóa: Câu nói 'giữ gìn con ngươi của mắt mình' hoặc 'trước hết nói về Đảng' -> Chắc chắn trích từ Di chúc (1969)."
        )
        
    if 'đường kách mệnh' in ans_clean.lower():
        return (
            "Tác phẩm 'Đường Kách mệnh' xuất bản năm 1927 tập hợp các bài giảng của Nguyễn Ái Quốc tại các lớp huấn luyện cán bộ của Hội Việt Nam Cách mạng Thanh niên ở Quảng Châu (Trung Quốc). "
            "Tác phẩm vạch rõ tính chất cách mạng, lực lượng cách mạng và tư cách của người cách mệnh (\"Tự mình phải: Cần kiệm, Hòa mà không tư, Cả quyết sửa lỗi mình...\"). Đây là cuốn cẩm nang lý luận chuẩn bị trực tiếp cho việc thành lập Đảng.",
            "Tác phẩm 'Đường Kách mệnh' (1927): Chuẩn bị về chính trị, tư tưởng và tổ chức cho sự ra đời của Đảng Cộng sản Việt Nam.",
            "Mẹo nhớ: 'Đường Kách mệnh' xuất bản năm 1927 tại Quảng Châu, mở đầu bằng bài học về 'Tư cách một người cách mệnh'."
        )

    if 'cần, kiệm, liêm, chính' in ans_clean.lower() or 'cần kiệm liêm chính' in ans_clean.lower():
        return (
            "Theo Hồ Chí Minh, Cần, Kiệm, Liêm, Chính là bốn đức tính cơ bản của con người, như bốn mùa của trời (Xuân, Hạ, Thu, Đông), như bốn phương của đất (Đông, Tây, Nam, Bắc). "
            "Người viết: \"Trời có bốn mùa: Xuân, Hạ, Thu, Đông. Đất có bốn phương: Đông, Tây, Nam, Bắc. Người có bốn đức: Cần, Kiệm, Liêm, Chính. Thiếu một mùa, thì không thành trời. Thiếu một phương, thì không thành đất. Thiếu một đức, thì không thành người\".",
            "Chuẩn mực đạo đức cốt lõi: Cần kiệm liêm chính, chí công vô tư là nền tảng của đạo đức cách mạng.",
            "Mẹo ví von: Bác ví 'Cần, Kiệm, Liêm, Chính' như 4 mùa của trời, 4 phương của đất; thiếu một đức thì không thành người."
        )

    if 'công tác cán bộ' in ans_clean.lower():
        return (
            "Hồ Chí Minh khẳng định: \"Cán bộ là cái gốc của mọi công việc\", \"Muôn việc thành công hoặc thất bại, đều do cán bộ tốt hoặc kém\". "
            "Vì vậy, công tác cán bộ được Người xác định là 'công tác gốc' của Đảng, quyết định sự thành bại của đường lối cách mạng.",
            "Vị trí công tác cán bộ: Là công việc gốc của Đảng; cán bộ là gốc của mọi công việc.",
            "Mẹo từ khóa: 'Công tác gốc của Đảng' = Công tác cán bộ. 'Gốc của mọi công việc' = Cán bộ."
        )

    # Generic academic explanation structured by Chapter
    if chapter_num == 1:
        return (
            f"Phương án đúng là: \"{ans_clean}\". Theo Giáo trình Tư tưởng Hồ Chí Minh (Bộ GD&ĐT), đối tượng nghiên cứu của môn học là hệ thống các quan điểm, luận điểm của Hồ Chí Minh về cách mạng Việt Nam, cùng với quá trình hiện thực hóa các quan điểm đó vào thực tiễn. Nắm vững phương pháp luận biện chứng duy vật, kết hợp chặt chẽ giữa tính đảng và tính khoa học là yêu cầu then chốt khi tiếp cận môn học.",
            "Phương pháp nghiên cứu TTHCM: Kết hợp tính đảng và tính khoa học, lý luận gắn liền với thực tiễn lịch sử.",
            "Mẹo ghi nhớ Chương 1: Nắm chắc định nghĩa TTHCM tại Đại hội VII, IX, XI và đối tượng nghiên cứu của môn học."
        )
    elif chapter_num == 2:
        return (
            f"Phương án đúng là: \"{ans_clean}\". Luận điểm này phản ánh chính xác các quy luật trong cơ sở hình thành và quá trình phát triển Tư tưởng Hồ Chí Minh. Tư tưởng của Người là sự kết tinh giữa chủ nghĩa yêu nước truyền thống của dân tộc Việt Nam, tinh hoa văn hóa nhân loại (phương Đông và phương Tây) và đỉnh cao là Chủ nghĩa Mác - Lênin kết hợp với phẩm chất trí tuệ siêu việt của Người qua các chặng đường lịch sử.",
            "Cơ sở lý luận và thực tiễn: Chủ nghĩa Mác - Lênin giữ vai trò quyết định bản chất cách mạng và khoa học của Tư tưởng Hồ Chí Minh.",
            "Mẹo ghi nhớ Chương 2: Nhớ các mốc thời gian: 1911 (ra đi tìm đường), 1920 (tìm thấy chân lý), 1930 (thành lập Đảng), 1941 (về nước lãnh đạo)."
        )
    elif chapter_num == 3:
        return (
            f"Phương án đúng là: \"{ans_clean}\". Hồ Chí Minh chỉ rõ độc lập dân tộc là mục tiêu trực tiếp, là tiền đề tiên quyết; chủ nghĩa xã hội là bước phát triển tất yếu nhằm củng cố vững chắc nền độc lập và mang lại cuộc sống ấm no, tự do, hạnh phúc thực sự cho nhân dân. Người khẳng định: \"Nước độc lập mà dân không hưởng hạnh phúc tự do, thì độc lập cũng chẳng có nghĩa lý gì\".",
            "Mục tiêu cách mạng: Độc lập dân tộc gắn liền với Chủ nghĩa xã hội là sợi chỉ đỏ xuyên suốt đường lối cách mạng Việt Nam.",
            "Mẹo ghi nhớ Chương 3: Độc lập hoàn toàn, triệt để; CNXH là nhằm đem lại cơm no, áo ấm, tự do cho nhân dân."
        )
    elif chapter_num == 4:
        return (
            f"Phương án đúng là: \"{ans_clean}\". Trong tư tưởng Hồ Chí Minh, Đảng Cộng sản Việt Nam mang bản chất giai cấp công nhân, là đội tiên phong của giai cấp và của cả dân tộc; Nhà nước Việt Nam là Nhà nước dân chủ nhân dân, mang bản chất giai cấp công nhân, có tính nhân dân và tính dân tộc sâu sắc. Quyền lực nhà nước là thống nhất, thuộc về nhân dân, có sự phân công và phối hợp giữa các cơ quan.",
            "Bản chất Nhà nước: Thống nhất giữa bản chất giai cấp công nhân với tính nhân dân và tính dân tộc sâu sắc.",
            "Mẹo ghi nhớ Chương 4: 'Của dân, do dân, vì dân'. Việc gì lợi cho dân phải hết sức làm, hại cho dân phải hết sức tránh."
        )
    elif chapter_num == 5:
        return (
            f"Phương án đúng là: \"{ans_clean}\". Hồ Chí Minh đúc kết chân lý: \"Đoàn kết, đoàn kết, đại đoàn kết / Thành công, thành công, đại thành công\". Đại đoàn kết dân tộc là vấn đề có ý nghĩa chiến lược cơ bản, nhất quán và lâu dài, quyết định thành bại của cách mạng; nòng cốt là liên minh công - nông - trí thức đặt dưới sự lãnh đạo của Đảng.",
            "Chiến lược đại đoàn kết: Là chiến lược sống còn, không phải là thủ đoạn sách lược nhất thời.",
            "Mẹo ghi nhớ Chương 5: 'Đoàn kết là sức mạnh'. Lực lượng nòng cốt là liên minh Công - Nông - Trí thức."
        )
    else: # Chapter 6
        return (
            f"Phương án đúng là: \"{ans_clean}\". Theo Hồ Chí Minh, văn hóa, đạo đức là nền tảng tinh thần của xã hội, là 'gốc' của người cách mạng. Người yêu cầu: \"Đạo đức cách mạng không phải trên trời sa xuống. Nó do đấu tranh, rèn luyện bền bỉ hằng ngày mà phát triển và củng cố. Cũng như ngọc càng mài càng sáng, vàng càng luyện càng trong\".",
            "Chuẩn mực đạo đức cách mạng: Tu dưỡng đạo đức suốt đời, nói đi đôi với làm, kiên quyết chống chủ nghĩa cá nhân.",
            "Mẹo ghi nhớ Chương 6: Đạo đức là gốc như gốc của cây, nguồn của sông. Con người vừa là mục tiêu vừa là động lực."
        )

def parse_full_a_pdf(path):
    print(f'Parsing {path}...')
    reader = pypdf.PdfReader(path)
    full_text = '\n'.join([p.extract_text() or '' for p in reader.pages])
    matches = list(re.finditer(r'(?:^|\n)\s*Câu\s+(\d+)[\.:]\s*', full_text))
    
    questions = []
    for i in range(len(matches)):
        start = matches[i].end()
        end = matches[i+1].start() if i+1 < len(matches) else len(full_text)
        num = int(matches[i].group(1))
        content = full_text[start:end].strip()
        opt_matches = list(re.finditer(r'(?:^|\n|\s{2,})([a-dA-D])[\.:\)]\s*', content))
        if len(opt_matches) >= 4:
            prompt = ' '.join(content[:opt_matches[0].start()].strip().split())
            opts = []
            for j in range(4):
                opt_char = chr(ord('A') + j)
                o_start = opt_matches[j].end()
                o_end = opt_matches[j+1].start() if j+1 < 4 else len(content)
                o_text = ' '.join(content[o_start:o_end].strip().split())
                opts.append(f'{opt_char}. {o_text}')
            
            raw_ans_text = ' '.join(content[opt_matches[0].end(): (opt_matches[1].start() if len(opt_matches)>1 else len(content))].strip().split())
            ch_num, ch_title = classify_chapter(prompt, raw_ans_text)
            exp, meth, tip = generate_academic_explanation(prompt, raw_ans_text, ch_num)
            
            questions.append({
                'id': f'TTHCM_FA_{num:03d}',
                'source': 'TTHCM_FULL_A',
                'source_title': 'Ngân Hàng Đề Gốc (Full ĐA A)',
                'num': num,
                'prompt': prompt,
                'norm_prompt': clean(prompt),
                'options': opts,
                'answer': 'A',
                'raw_answer_text': raw_ans_text,
                'chapter': ch_num,
                'chapter_title': ch_title,
                'explanation': exp,
                'methodology': meth,
                'tips': tip
            })
    print(f'Parsed {len(questions)} questions from Full A PDF.')
    return questions

def parse_tthcm_132_pdf(path, fa_db):
    print(f'Parsing {path}...')
    reader = pypdf.PdfReader(path)
    full_text = '\n'.join([p.extract_text() or '' for p in reader.pages])
    matches = list(re.finditer(r'(?:^|\n)\s*Câu\s+(\d+)[\.:]\s*', full_text))
    
    questions = []
    for i in range(len(matches)):
        start = matches[i].end()
        end = matches[i+1].start() if i+1 < len(matches) else len(full_text)
        num = int(matches[i].group(1))
        content = full_text[start:end].strip()
        opt_matches = list(re.finditer(r'(?:^|\n|\s{2,}|\b)([A-D])[\.:\)]\s+', content))
        filtered_opts = []
        expected = 'A'
        for m in opt_matches:
            if m.group(1) == expected:
                filtered_opts.append(m)
                expected = chr(ord(expected) + 1)
                if expected > 'D':
                    break
        if len(filtered_opts) == 4:
            prompt = ' '.join(content[:filtered_opts[0].start()].strip().split())
            opts = []
            for j in range(4):
                opt_char = filtered_opts[j].group(1)
                o_start = filtered_opts[j].end()
                o_end = filtered_opts[j+1].start() if j+1 < 4 else len(content)
                o_text = content[o_start:o_end].strip()
                clean_o_text = " ".join(o_text.split())
                opts.append(f'{opt_char}. {clean_o_text}')
            
            norm_p = clean(prompt)
            # Find best match in fa_db
            best_fa = None
            best_score = 0
            for fa in fa_db:
                sc = SequenceMatcher(None, norm_p, fa['norm_prompt']).ratio()
                if sc > best_score:
                    best_score = sc
                    best_fa = fa
            
            ans_char = 'A'
            raw_ans_text = opts[0][3:]
            if best_score > 0.82 and best_fa:
                # Match which opt in opts matches best_fa['raw_answer_text']
                best_opt_idx = 0
                best_opt_sc = 0
                norm_target = clean(best_fa['raw_answer_text'])
                for o_idx, opt_str in enumerate(opts):
                    o_sc = SequenceMatcher(None, clean(opt_str[3:]), norm_target).ratio()
                    if o_sc > best_opt_sc:
                        best_opt_sc = o_sc
                        best_opt_idx = o_idx
                if best_opt_sc > 0.65:
                    ans_char = chr(ord('A') + best_opt_idx)
                    raw_ans_text = opts[best_opt_idx][3:]
            else:
                # Canonical fallbacks for unmatched questions in 132
                p_lower = prompt.lower()
                if 'lao động sản xuất' in p_lower:
                    ans_char = 'A' # Vị trí và vai trò
                elif 'con người' in p_lower and 'động lực' in p_lower:
                    for idx, o in enumerate(opts):
                        if 'vừa là mục tiêu vừa là động lực' in o.lower():
                            ans_char = chr(ord('A') + idx)
                elif 'nay ở trong thơ nên có thép' in p_lower:
                    for idx, o in enumerate(opts):
                        if 'chức năng của văn hóa' in o.lower():
                            ans_char = chr(ord('A') + idx)
                elif 'tiếng nói là thứ của cải' in p_lower:
                    for idx, o in enumerate(opts):
                        if 'xây dựng nền văn hóa mới' in o.lower():
                            ans_char = chr(ord('A') + idx)
                elif 'hiến pháp năm 1959' in p_lower and 'do …' in p_lower:
                    for idx, o in enumerate(opts):
                        if 'giai cấp công nhân lãnh đạo' in o.lower():
                            ans_char = chr(ord('A') + idx)
                raw_ans_text = opts[ord(ans_char) - ord('A')][3:]
                
            ch_num, ch_title = classify_chapter(prompt, raw_ans_text)
            exp, meth, tip = generate_academic_explanation(prompt, raw_ans_text, ch_num)
            
            questions.append({
                'id': f'TTHCM_132_{num:03d}',
                'source': 'TTHCM_DE_132',
                'source_title': 'Mã Đề Thi 132 (Thi Cuối Kỳ)',
                'num': num,
                'prompt': prompt,
                'norm_prompt': norm_p,
                'options': opts,
                'answer': ans_char,
                'raw_answer_text': raw_ans_text,
                'chapter': ch_num,
                'chapter_title': ch_title,
                'explanation': exp,
                'methodology': meth,
                'tips': tip
            })
    print(f'Parsed {len(questions)} questions from Mã đề 132 PDF.')
    return questions

def parse_tthcm_651_pdf(path, fa_db):
    print(f'Parsing {path} (Mã đề 651)...')
    doc = pymupdf.open(path)
    all_blocks = []
    for page_idx, page in enumerate(doc):
        blocks = page.get_text('blocks')
        filtered = []
        for b in blocks:
            y0, y1 = b[1], b[3]
            if page_idx == 0 and y1 < 165:
                continue
            if page_idx > 0 and y1 < 65:
                continue
            if y0 > 795:
                continue
            if '____' in b[4] or 'ĐỀ THI CHÍNH THỨC' in b[4]:
                continue
            filtered.append(b)
        filtered.sort(key=lambda b: (b[1], b[0]))
        for b in filtered:
            all_blocks.append(b[4].strip())
            
    full_text = '\n'.join(all_blocks)
    matches = list(re.finditer(r'(?:^|\n)\s*Câu\s+(\d+)[\.:]\s*', full_text))
    
    questions = []
    for i in range(len(matches)):
        start = matches[i].end()
        end = matches[i+1].start() if i+1 < len(matches) else len(full_text)
        num = int(matches[i].group(1))
        content = full_text[start:end].strip()
        
        opt_matches = list(re.finditer(r'(?:^|\n|\s{2,}|\b)([A-D])[\.:\)]\s+', content))
        filtered_opts = []
        expected = 'A'
        for m in opt_matches:
            if m.group(1) == expected:
                filtered_opts.append(m)
                expected = chr(ord(expected) + 1)
                if expected > 'D':
                    break
        if len(filtered_opts) == 4:
            prompt = ' '.join(content[:filtered_opts[0].start()].strip().split())
            opts = []
            for j in range(4):
                opt_char = filtered_opts[j].group(1)
                o_start = filtered_opts[j].end()
                o_end = filtered_opts[j+1].start() if j+1 < 4 else len(content)
                o_text = content[o_start:o_end].strip()
                clean_o_text = " ".join(o_text.split())
                opts.append(f'{opt_char}. {clean_o_text}')
            
            norm_p = clean(prompt)
            # Find best match in fa_db
            best_fa = None
            best_score = 0
            for fa in fa_db:
                sc = SequenceMatcher(None, norm_p, fa['norm_prompt']).ratio()
                if sc > best_score:
                    best_score = sc
                    best_fa = fa
                    
            ans_char = 'A'
            if best_score > 0.82 and best_fa:
                best_opt_idx = 0
                best_opt_sc = 0
                norm_target = clean(best_fa['raw_answer_text'])
                for o_idx, opt_str in enumerate(opts):
                    o_sc = SequenceMatcher(None, clean(opt_str[3:]), norm_target).ratio()
                    if o_sc > best_opt_sc:
                        best_opt_sc = o_sc
                        best_opt_idx = o_idx
                if best_opt_sc > 0.65:
                    ans_char = chr(ord('A') + best_opt_idx)
            else:
                p_lower = prompt.lower()
                if 'giữ gìn con ngươi của mắt mình' in p_lower:
                    ans_char = 'C' # Di chúc
                elif 'đường kách mệnh' in p_lower and 'tự mình phải' in p_lower:
                    ans_char = 'C' # Các chuẩn mực đạo đức cách mạng
                elif 'unesco' in p_lower:
                    ans_char = 'D' # Năm 1987
                elif 'tôn giáo giêsu' in p_lower:
                    ans_char = 'A' # Lòng nhân ái cao cả
                elif 'không đúng' in p_lower and 'công nghiệp hóa' in p_lower:
                    ans_char = 'D' # bắt đầu từ công nghiệp nặng (sai)
            
            raw_ans_text = opts[ord(ans_char) - ord('A')][3:]
            ch_num, ch_title = classify_chapter(prompt, raw_ans_text)
            exp, meth, tip = generate_academic_explanation(prompt, raw_ans_text, ch_num)
            
            questions.append({
                'id': f'TTHCM_651_{num:03d}',
                'source': 'TTHCM_DE_651',
                'source_title': 'Đề Thi Mẫu 651 (Học Viện KTMM)',
                'num': num,
                'prompt': prompt,
                'norm_prompt': norm_p,
                'options': opts,
                'answer': ans_char,
                'raw_answer_text': raw_ans_text,
                'chapter': ch_num,
                'chapter_title': ch_title,
                'explanation': exp,
                'methodology': meth,
                'tips': tip
            })
    print(f'Parsed {len(questions)} questions from Mã đề 651 PDF.')
    return questions

def parse_doc_text(path, fa_db):
    print(f'Parsing extracted doc text from {path}...')
    with open(path, encoding='utf-8') as f:
        text = f.read()
    pattern = r'(?:^|\r|\n)\s*(Câu(?:\s*hỏi|\s*\d+)?\s*[:\.])'
    matches = list(re.finditer(pattern, text))
    
    questions = []
    names = ['A', 'B', 'C', 'D']
    for i in range(len(matches)):
        start = matches[i].end()
        end = matches[i+1].start() if i+1 < len(matches) else len(text)
        content = text[start:end].strip()
        opt_matches = list(re.finditer(r'(?:^|\r|\n|\t|\s{2,})([a-dA-D])[\.:\)]\s*', content))
        filtered = []
        expected = 0
        for m in opt_matches:
            ch = m.group(1).upper()
            if expected < 4 and ch == names[expected]:
                filtered.append(m)
                expected += 1
        if len(filtered) >= 3:
            prompt = ' '.join(content[:filtered[0].start()].strip().split())
            if len(prompt) < 8:
                continue
            opts = []
            for j in range(len(filtered)):
                opt_ch = names[j]
                o_start = filtered[j].end()
                o_end = filtered[j+1].start() if j+1 < len(filtered) else len(content)
                o_text = ' '.join(content[o_start:o_end].strip().split())
                opts.append(f'{opt_ch}. {o_text}')
            
            # If 3 options, add standard 4th fallback if missing
            while len(opts) < 4:
                missing_ch = names[len(opts)]
                opts.append(f'{missing_ch}. Cả a, b, c đều đúng.')
                
            norm_p = clean(prompt)
            # Find best match in fa_db
            best_fa = None
            best_score = 0
            for fa in fa_db:
                sc = SequenceMatcher(None, norm_p, fa['norm_prompt']).ratio()
                if sc > best_score:
                    best_score = sc
                    best_fa = fa
                    
            ans_char = 'A'
            if best_score > 0.82 and best_fa:
                best_opt_idx = 0
                best_opt_sc = 0
                norm_target = clean(best_fa['raw_answer_text'])
                for o_idx, opt_str in enumerate(opts):
                    o_sc = SequenceMatcher(None, clean(opt_str[3:]), norm_target).ratio()
                    if o_sc > best_opt_sc:
                        best_opt_sc = o_sc
                        best_opt_idx = o_idx
                if best_opt_sc > 0.65:
                    ans_char = chr(ord('A') + best_opt_idx)
            else:
                p_lower = prompt.lower()
                if 'giặc nội xâm' in p_lower:
                    ans_char = 'D' # Cả a, b, c (tham ô, lãng phí, quan liêu)
                elif 'quốc hội khóa i' in p_lower and 'năm' in p_lower:
                    ans_char = 'B' # Năm 1946 (6/1/1946)
                elif 'công tác gốc của đảng' in p_lower:
                    ans_char = 'C' # Công tác cán bộ
                elif 'thành bại đều do cán bộ tốt hay' in p_lower:
                    ans_char = 'B' # Kém (do cán bộ tốt hay kém)
                elif 'trung ban dự thảo hiến pháp' in p_lower or 'trưởng ban' in p_lower:
                    ans_char = 'C' # Hồ Chí Minh
                elif 'hiến pháp nào' in p_lower:
                    ans_char = 'A' # 1946 và 1959
            
            raw_ans_text = opts[ord(ans_char) - ord('A')][3:]
            ch_num, ch_title = classify_chapter(prompt, raw_ans_text)
            exp, meth, tip = generate_academic_explanation(prompt, raw_ans_text, ch_num)
            
            questions.append({
                'id': f'TTHCM_AT_{len(questions)+1:03d}',
                'source': 'TTHCM_DE_CUONG',
                'source_title': 'Đề Cương ATTT KMA 2019',
                'num': len(questions)+1,
                'prompt': prompt,
                'norm_prompt': norm_p,
                'options': opts,
                'answer': ans_char,
                'raw_answer_text': raw_ans_text,
                'chapter': ch_num,
                'chapter_title': ch_title,
                'explanation': exp,
                'methodology': meth,
                'tips': tip
            })
    print(f'Parsed {len(questions)} questions from KMA ATTT Doc text.')
    return questions

def main():
    print('=== BUILDING TƯ TƯỞNG HỒ CHÍ MINH MASTER DATABASE ===')
    
    # 1. Full A PDF
    fa_questions = parse_full_a_pdf('TTHCM/Bộ câu hỏi cuối kì(ĐA Full A).pdf')
    
    # 2. Mã đề 132 PDF
    q132_questions = parse_tthcm_132_pdf('TTHCM/tthcm.pdf', fa_questions)
    
    # 3. Mã đề 651 PDF
    q651_questions = parse_tthcm_651_pdf('TTHCM/tu-tuong-ho-chi-minh.pdf', fa_questions)
    
    # 4. Doc text
    doc_questions = parse_doc_text('TTHCM/extracted_doc_text.txt', fa_questions)
    
    # Combine all questions
    from normalize_data import ensure_unique_ids
    all_questions = ensure_unique_ids(fa_questions + q132_questions + q651_questions + doc_questions)
    print(f'Total questions collected: {len(all_questions)}')
    
    # Clean temporary helper fields before serialization
    for q in all_questions:
        q.pop('norm_prompt', None)
        q.pop('raw_answer_text', None)
        q['type'] = 'mcq'
        q['images'] = []
    
    # Chapter stats
    ch_stats = {}
    for q in all_questions:
        ch = q['chapter']
        ch_stats[ch] = ch_stats.get(ch, 0) + 1
    print('Distribution by chapter:')
    for ch in sorted(ch_stats.keys()):
        print(f'  Chương {ch}: {ch_stats[ch]} câu')
        
    # Write JSON files
    os.makedirs('data', exist_ok=True)
    os.makedirs('web/data', exist_ok=True)
    os.makedirs('docs/data', exist_ok=True)
    
    with open('data/tthcm_questions_db.json', 'w', encoding='utf-8') as f:
        json.dump(all_questions, f, ensure_ascii=False, indent=2)
    print('Saved data/tthcm_questions_db.json')
    
    with open('web/data/tthcm_questions.json', 'w', encoding='utf-8') as f:
        json.dump(all_questions, f, ensure_ascii=False, indent=2)
    with open('docs/data/tthcm_questions.json', 'w', encoding='utf-8') as f:
        json.dump(all_questions, f, ensure_ascii=False, indent=2)
    print('Saved web/data/tthcm_questions.json and docs/data/tthcm_questions.json')
    
    # Write JS bundles for zero-CORS file:// execution
    js_content = f"// TƯ TƯỞNG HỒ CHÍ MINH QUESTION DATABASE\nwindow.TTHCM_QUESTIONS_DATA = {json.dumps(all_questions, ensure_ascii=False)};\n"
    with open('web/tthcm_data.js', 'w', encoding='utf-8') as f:
        f.write(js_content)
    with open('docs/tthcm_data.js', 'w', encoding='utf-8') as f:
        f.write(js_content)
    print('Saved web/tthcm_data.js and docs/tthcm_data.js')
    
    print('=== TTHCM DATABASE BUILD COMPLETE! ===')

if __name__ == '__main__':
    main()
