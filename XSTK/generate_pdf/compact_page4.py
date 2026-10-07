with open("generate_pdf/create_cheat_sheet_pdf.py", "r", encoding="utf-8") as f:
    text = f.read()

# Cập nhật style của formula table
old_ft_style = """.formula-table {
            width: 100%;
            border-collapse: collapse;
            margin: 8px 0 12px 0;
            font-size: 11px;
            background: #ffffff;
        }
        .formula-table th, .formula-table td {
            border: 1px solid #cbd5e0;
            padding: 5px 8px;
            text-align: left;
        }"""

new_ft_style = """.formula-table {
            width: 100%;
            border-collapse: collapse;
            margin: 4px 0 6px 0;
            font-size: 10px;
            line-height: 1.35;
            background: #ffffff;
        }
        .formula-table th, .formula-table td {
            border: 1px solid #cbd5e0;
            padding: 2.5px 5px;
            text-align: left;
        }"""

text = text.replace(old_ft_style, new_ft_style)

# Điều chỉnh box-tip và box-rule nhỏ gọn hơn một chút
old_box_tip = """.box-tip {
            background-color: #f0fff4;
            border-left: 4px solid #38a169;
            padding: 8px 12px;
            margin: 8px 0;
            font-size: 11.5px;
            border-radius: 3px;
            break-inside: avoid;
        }"""

new_box_tip = """.box-tip {
            background-color: #f0fff4;
            border-left: 4px solid #38a169;
            padding: 5px 10px;
            margin: 5px 0;
            font-size: 10.5px;
            line-height: 1.4;
            border-radius: 3px;
            break-inside: avoid;
        }"""

text = text.replace(old_box_tip, new_box_tip)

old_box_rule = """.box-rule {
            background-color: #fffaf0;
            border-left: 4px solid #dd6b20;
            padding: 8px 12px;
            margin: 8px 0;
            font-size: 11.5px;
            border-radius: 3px;
            break-inside: avoid;
        }"""

new_box_rule = """.box-rule {
            background-color: #fffaf0;
            border-left: 4px solid #dd6b20;
            padding: 5px 10px;
            margin: 5px 0;
            font-size: 10.5px;
            line-height: 1.4;
            border-radius: 3px;
            break-inside: avoid;
        }"""

text = text.replace(old_box_rule, new_box_rule)

# Thêm page-break trước phần IV
old_part4 = """    <!-- PHẦN 4: MẸO BẤM MÁY CASIO KIỂM TRA ĐÁP SỐ -->
    <div class="page-break"></div>
    <div class="section-title">"""

# Đảm bảo phần IV luôn bắt đầu ở trang mới
with open("generate_pdf/create_cheat_sheet_pdf.py", "w", encoding="utf-8") as f:
    f.write(text)

print("Compacted page 4 styles!")
