# 🎓 Hệ Thống Ôn Luyện & Thi Thử Trắc Nghiệm KMA (KTVXL • TTHCM • VLDC)

> Nền tảng học tập, luyện thi trắc nghiệm và mô phỏng trực quan chuẩn kiến trúc Neobrutalism dành cho sinh viên Học viện Kỹ thuật Mật mã (KMA) và các trường đại học khối kỹ thuật.

🌐 **Trang web trực tuyến (Live Demo)**: [https://taanhitaland-ai.github.io/KTVXL/](https://taanhitaland-ai.github.io/KTVXL/)

---

## 📚 1. Giới Thiệu Các Môn Học

### ⚡ Kỹ Thuật Vi Xử Lý (984 câu)
- **5 Đề thi chính thức KMA** (Đề 001 đến 005) chuẩn 40 câu theo ma trận chuẩn đầu ra (CLO1, CLO2, CLO3).
- **18 Part chuyên đề bài tập chuyên sâu**: Cấu trúc 8051, không gian nhớ RAM/ROM, tập lệnh ASM, Timer/Counter định thời, UART truyền thông nối tiếp, thanh ghi chức năng đặc biệt SFR.
- Câu hỏi tính toán trắc nghiệm và câu hỏi điền kết quả (Fill-in-the-blank).

### 📕 Tư Tưởng Hồ Chí Minh (885 câu)
- **4 Nguồn đề thi & đề cương uy tín**:
  - ⭐ Ngân Hàng Đề Gốc Full ĐA A (281 câu)
  - 📝 Mã Đề Thi 132 Chính Thức (298 câu)
  - 🎯 Đề Thi Mẫu 651 KTMM (48 câu)
  - 📑 Đề Cương Ôn Thi ATTT KMA 2019 (258 câu)
- Phân loại rõ ràng theo 6 chương giáo trình chuẩn của Bộ GD&ĐT.

### ⚛️ Vật Lý Đại Cương (142 câu)
- **Tổng hợp từ tài liệu Đề thi & Đề cương Notion**:
  - Đề Test Cuối (38 câu có công thức & hướng dẫn giải)
  - Đề Test 100 Câu (trích lục từ Google Docs)
  - Đề Thi Giữa Kỳ 2025 (Cơ học lượng tử & phương trình Schrödinger)
  - Đề Cương Bài Tập 6 Chương A2
- **Đầy đủ 100% lời giải chi tiết**, phương pháp phân tích dạng bài và mẹo bấm máy Casio fx-580VNX (`CONST`, `CONV`).
- 🔬 **Phòng Thí Nghiệm Mô Phỏng Vật Lý Trực Quan (Interactive Physics Lab)**:
  - Giao thoa khe Young (thay đổi bước sóng, bề rộng khe, chèn bản mỏng)
  - Hiện tượng quang điện ngoài & điện thế hãm
  - Tán xạ Compton góc va chạm photon
  - Giếng thế lượng tử 1 chiều & hàm sóng Schrödinger
  - Định luật phân cực ánh sáng Malus

---

## 🛠️ 2. Hướng Dẫn Cài Đặt & Chạy Cục Bộ

Hệ thống được thiết kế hoàn toàn bằng Vanilla HTML5, CSS3, JavaScript (không yêu cầu cài đặt framework phức tạp):

### Cách 1: Mở trực tiếp
Mở file `web/index.html` hoặc `docs/index.html` trực tiếp bằng trình duyệt (Chrome, Edge, Firefox).

### Cách 2: Chạy Web Server cục bộ (Khuyến nghị)
```bash
# Clone repository
git clone https://github.com/taanhitaland-ai/KTVXL.git
cd KTVXL

# Chạy server với Python
python3 -m http.server 8000

# Hoặc dùng Node.js npx serve
npx serve web/
```
Truy cập: `http://localhost:8000/web/`

---

## 📁 3. Cấu Trúc Thư Mục

```text
├── web/                     # Mã nguồn giao diện chính của ứng dụng
│   ├── index.html           # File giao diện chính
│   ├── app.js               # Logic điều khiển, chấm điểm, lọc, làm bài thi
│   ├── styles.css           # Giao diện phong cách Neobrutalism
│   ├── data.js              # Dữ liệu môn Vi xử lý
│   ├── tthcm_data.js        # Dữ liệu môn Tư tưởng Hồ Chí Minh
│   └── vldc_data.js         # Dữ liệu môn Vật lý đại cương
├── docs/                    # Thư mục build triển khai GitHub Pages
├── data/                    # Cơ sở dữ liệu gốc dạng JSON
│   ├── questions_db.json    # Database Vi xử lý
│   ├── tthcm_questions.json # Database Tư tưởng HCM
│   └── vldc_questions_db.json # Database Vật lý đại cương
├── pdf_templates/           # Template HTML để render tài liệu PDF in ấn
├── scripts/                 # Bộ công cụ tự động hóa & kiểm thử
│   ├── build_vldc_pdf_html.py  # Sinh template PDF HTML
│   ├── generate_vldc_pdfs.py # Render PDF bằng Playwright Chromium
│   ├── test_vldc_e2e.py      # E2E test tự động
│   └── merge_and_build_all_vldc.py # Chuẩn hóa và đồng bộ database
├── *.pdf                    # Các file tài liệu PDF đã biên soạn chuẩn A4
└── README.md                # Tài liệu dự án & Hướng dẫn đóng góp
```

---

## 🤝 4. Hướng Dẫn Đóng Góp (Contributing)

Mọi đóng góp nhằm hoàn thiện ngân hàng câu hỏi, bổ sung lời giải chi tiết hoặc cải tiến giao diện đều rất được hoan nghênh!

### Quy trình đóng góp:
1. **Fork** repository này về tài khoản GitHub của bạn.
2. Tạo một nhánh mới (branch) cho tính năng hoặc câu hỏi bạn muốn đóng góp:
   ```bash
   git checkout -b feature/them-cau-hoi-vldc
   ```
3. Chỉnh sửa hoặc thêm câu hỏi vào `data/` hoặc `scripts/`.
4. Nếu thêm câu hỏi cho môn Vật Lý, chạy lệnh đồng bộ:
   ```bash
   python3 scripts/merge_and_build_all_vldc.py
   ```
5. Chạy kiểm thử tự động để đảm bảo không phát sinh lỗi:
   ```bash
   python3 scripts/test_vldc_e2e.py
   ```
6. Commit thay đổi và push lên nhánh của bạn:
   ```bash
   git commit -m "feat: bổ sung lời giải chi tiết cho chuyên đề Quang sóng"
   git push origin feature/them-cau-hoi-vldc
   ```
7. Mở một **Pull Request (PR)** trên GitHub để được review và merge vào dự án!

---

## 📄 5. Giấy Phép & Tác Quyền
Dự án được xây dựng phục vụ mục đích học tập phi lợi nhuận cho cộng đồng sinh viên. Chúc các bạn ôn tập tốt và đạt kết quả cao trong các kỳ thi!
