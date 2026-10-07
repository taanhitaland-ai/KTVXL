with open("generate_pdf/create_cheat_sheet_pdf.py", "r", encoding="utf-8") as f:
    text = f.read()

# Thêm ngắt trang trước Phần III và bổ sung box chú ý vào cuối Trang 3
old_part3_header = """    <!-- PHẦN 3: BẢNG NGUYÊN HÀM & CÔNG THỨC LƯỢNG GIÁC HAY DÙNG -->
    <div class="section-title">
        <span>III. BẢNG NGUYÊN HÀM & TÍCH PHÂN HAY DÙNG (ĐẶC BIỆT LƯỢNG GIÁC)</span>
        <span class="badge-step">TRA CỨU NHANH TRONG PHÒNG THI</span>
    </div>"""

extra_box_page3 = """    <!-- CÁC BẪY KINH ĐIỂN CẦN TRÁNH VỀ BIẾN NGẪU NHIÊN -->
    <div class="box-warning" style="margin-top: 10px;">
        <b>⚠️ 4 BẪY SAI LẦM KINH ĐIỂN VỀ BIẾN NGẪU NHIÊN KHIẾN HỌC VIÊN MẤT ĐIỂM OAN:</b>
        <ol>
            <li><b>Bẫy bất đẳng thức $X^3 > X$ trên đoạn $[0; 2]$:</b> Rất nhiều bạn giải ra $X > 1$ hoặc $X < -1$ rồi lấy tích phân cả trên miền âm. Chú ý biến $X$ chỉ nhận giá trị trên $[0; 2]$, nên miền lấy tích phân chỉ là $(1; 2]$.</li>
            <li><b>Bẫy viết thiếu miền của hàm mật độ biên $f_X(x)$ và hàm phân bố $F(x)$:</b> Khi viết hàm mật độ biên $f_X(x)$, bắt buộc phải viết dạng 2 nhánh (nhánh trong miền và nhánh bằng 0 ở ngoài miền). Tương tự hàm $F(x)$ bắt buộc phải đủ 3 khoảng ($x \\le a, a < x < b, x \\ge b$). Thiếu nhánh ngoài miền bị trừ 0,5đ.</li>
            <li><b>Bẫy phương sai của tổng/hiệu:</b> Chú ý $V(aX + bY) = a^2 V(X) + b^2 V(Y)$ khi $X, Y$ độc lập. Đặc biệt: $V(X - Y) = V(X) + V(Y)$ (DẤU CỘNG, KHÔNG PHẢI DẤU TRỪ!). Hằng số nhân vào trong biến ngẫu nhiên khi ra ngoài phương sai phải BÌNH PHƯƠNG: $V(2X) = 4V(X)$.</li>
            <li><b>Bẫy kiểm tra tổng xác suất ma trận $X+Y$ và $XY$:</b> Với biến rời rạc, sau khi lập bảng xác suất của $X+Y$ và $XY$, bước đầu tiên phải lấy máy tính cộng hàng xác suất xem có bằng $1.000$ không. Nếu khác 1 thì chắc chắn đã nhầm lẫn khi nhóm các ô có cùng tổng hoặc tích.</li>
        </ol>
    </div>

    <!-- PHẦN 3: BẢNG NGUYÊN HÀM & CÔNG THỨC LƯỢNG GIÁC HAY DÙNG -->
    <div class="page-break"></div>
    <div class="section-title">
        <span>III. BẢNG NGUYÊN HÀM & TÍCH PHÂN HAY DÙNG (ĐẶC BIỆT LƯỢNG GIÁC)</span>
        <span class="badge-step">TRA CỨU NHANH TRONG PHÒNG THI</span>
    </div>"""

text = text.replace(old_part3_header, extra_box_page3)

with open("generate_pdf/create_cheat_sheet_pdf.py", "w", encoding="utf-8") as f:
    f.write(text)

print("Modified create_cheat_sheet_pdf.py!")
