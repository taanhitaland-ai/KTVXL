import os
import sys
from playwright.sync_api import sync_playwright

html_content = """<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>HƯỚNG DẪN GIẢI CHI TIẾT & BAREM ĐIỂM BỘ ĐỀ KIỂM TRA GIỮA KỲ XÁC SUẤT THỐNG KÊ</title>
    <!-- KaTeX CSS & JS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">
    <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js"></script>
    <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/auto-render.min.js"
            onload="renderMathInElement(document.body, {
                delimiters: [
                    {left: '$$', right: '$$', display: true},
                    {left: '$', right: '$', display: false}
                ],
                throwOnError: false
            });"></script>
    <style>
        @page {
            size: A4 portrait;
            margin: 14mm 12mm 16mm 12mm;
        }
        * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
        body {
            font-family: 'Segoe UI', 'Liberation Sans', Roboto, Helvetica, Arial, sans-serif;
            font-size: 13px;
            line-height: 1.55;
            color: #1a202c;
            background-color: #ffffff;
            margin: 0;
            padding: 0;
        }

        /* Cover Page */
        .cover-page {
            height: 258mm;
            max-height: 258mm;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            text-align: center;
            padding: 30px 20px 20px 20px;
            page-break-after: always;
            border: 2.5px solid #1a365d;
            outline: 5px double #2b6cb0;
            outline-offset: 4px;
            margin: 0;
            box-sizing: border-box;
        }
        .cover-header {
            margin-top: 20px;
        }
        .cover-inst {
            font-size: 16px;
            font-weight: 700;
            text-transform: uppercase;
            color: #2b6cb0;
            letter-spacing: 1px;
        }
        .cover-dept {
            font-size: 14px;
            font-weight: 600;
            color: #4a5568;
            margin-top: 5px;
        }
        .cover-divider {
            width: 120px;
            height: 2px;
            background-color: #2b6cb0;
            margin: 15px auto;
        }
        .cover-body {
            margin: auto 0;
        }
        .cover-title {
            font-size: 26px;
            font-weight: 800;
            color: #1a365d;
            text-transform: uppercase;
            line-height: 1.35;
            margin-bottom: 15px;
        }
        .cover-subtitle {
            font-size: 16px;
            font-weight: 600;
            color: #2c5282;
            max-width: 650px;
            margin: 0 auto 25px auto;
        }
        .cover-badge {
            display: inline-block;
            background-color: #ebf8ff;
            color: #2b6cb0;
            border: 1px solid #bee3f8;
            padding: 8px 18px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 600;
        }
        .cover-footer {
            margin-bottom: 20px;
            font-size: 13px;
            color: #718096;
            line-height: 1.6;
        }

        /* Section & Headings */
        .page-break {
            page-break-before: always;
        }
        .section-header {
            border-bottom: 2px solid #2b6cb0;
            padding-bottom: 6px;
            margin-bottom: 16px;
            margin-top: 10px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
        }
        .section-title {
            font-size: 18px;
            font-weight: 700;
            color: #1a365d;
            text-transform: uppercase;
            margin: 0;
        }
        .section-tag {
            font-size: 12px;
            font-weight: 600;
            background: #e2e8f0;
            color: #4a5568;
            padding: 3px 8px;
            border-radius: 4px;
        }

        /* Exam Box (Original Problem) */
        .exam-problem-box {
            background-color: #f7fafc;
            border: 1px solid #cbd5e0;
            border-left: 4px solid #3182ce;
            padding: 12px 16px;
            border-radius: 4px;
            margin-bottom: 16px;
            break-inside: avoid;
        }
        .problem-title {
            font-weight: 700;
            color: #2b6cb0;
            font-size: 14px;
            margin-bottom: 8px;
            text-transform: uppercase;
        }
        .problem-content {
            font-size: 12.5px;
            color: #2d3748;
        }
        .problem-content ol, .problem-content ul {
            margin: 4px 0 6px 20px;
            padding: 0;
        }
        .problem-content li {
            margin-bottom: 4px;
        }

        /* Grading Table */
        .grading-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 16px;
            background-color: #ffffff;
            font-size: 12.5px;
        }
        .grading-table th, .grading-table td {
            border: 1px solid #cbd5e0;
            padding: 8px 10px;
            vertical-align: top;
        }
        .grading-table th {
            background-color: #2b6cb0;
            color: #ffffff;
            font-weight: 700;
            text-align: center;
        }
        .col-q {
            width: 85px;
            text-align: center;
            font-weight: 700;
            color: #1a365d;
            background-color: #f7fafc;
        }
        .col-sub {
            width: 45px;
            text-align: center;
            font-weight: 700;
            color: #2b6cb0;
            background-color: #f7fafc;
        }
        .col-content {
            text-align: left;
        }
        .col-score {
            width: 55px;
            text-align: center;
            font-weight: 700;
            color: #c53030;
            background-color: #fffaf0;
        }

        /* Notes Box */
        .note-box {
            background-color: #feebc8;
            border-left: 4px solid #dd6b20;
            color: #744210;
            padding: 8px 12px;
            font-size: 12px;
            margin: 8px 0;
            border-radius: 2px;
            break-inside: avoid;
        }
        .tip-box {
            background-color: #e6fffa;
            border-left: 4px solid #319795;
            color: #234e52;
            padding: 6px 10px;
            font-size: 11px;
            line-height: 1.45;
            margin: 6px 0 0 0;
            border-radius: 2px;
            break-inside: avoid;
        }

        /* Summary Table */
        .summary-table {
            width: 100%;
            border-collapse: collapse;
            margin: 6px 0 8px 0;
            font-size: 10.5px;
            line-height: 1.3;
        }
        .summary-table th, .summary-table td {
            border: 1px solid #cbd5e0;
            padding: 3px 5px;
            text-align: center;
        }
        .summary-table th {
            background-color: #2d3748;
            color: #ffffff;
            font-weight: 700;
        }
        .summary-table tr:nth-child(even) {
            background-color: #f7fafc;
        }

        .highlight {
            font-weight: 700;
            color: #2b6cb0;
        }
        .score-total {
            font-weight: 700;
            color: #9b2c2c;
            background-color: #fed7d7;
            padding: 2px 6px;
            border-radius: 4px;
        }

        /* Table of Contents */
        .toc-list {
            list-style-type: none;
            padding-left: 0;
            margin: 15px 0;
        }
        .toc-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px dashed #cbd5e0;
            font-size: 13px;
        }
        .toc-item a {
            text-decoration: none;
            color: #2b6cb0;
            font-weight: 600;
        }
        .toc-page {
            color: #718096;
            font-weight: 600;
        }
    </style>
</head>
<body>

    <!-- TRANG BÌA -->
    <div class="cover-page">
        <div class="cover-header">
            <div class="cover-inst">HỌC VIỆN KỸ THUẬT MẬT MÃ</div>
            <div class="cover-dept">KHOA CƠ BẢN &bull; BỘ MÔN TOÁN</div>
            <div class="cover-divider"></div>
        </div>
        <div class="cover-body">
            <div class="cover-title">TÀI LIỆU HƯỚNG DẪN GIẢI CHI TIẾT & BAREM CHẤM ĐIỂM TỰ LUẬN</div>
            <div class="cover-subtitle">BỘ ĐỀ THI & KIỂM TRA GIỮA KỲ MÔN XÁC SUẤT THỐNG KÊ (5 ĐỀ)</div>
            <div class="cover-badge">CHUẨN HOÁ THEO THANG ĐIỂM CHẤM THI HỌC VIỆN &bull; BƯỚC ĐIỂM 0,5Đ</div>
            <div style="margin-top: 25px; font-size: 13.5px; color: #4a5568; line-height: 1.8; max-width: 600px; margin-left: auto; margin-right: auto;">
                Tài liệu trình bày lời giải chi tiết theo đúng cấu trúc đề cương, quy chuẩn barem thi tự luận:
                <br>&bull; <b>Bước 1:</b> Gọi biến cố rõ ràng bằng lời văn &bull; Thiết lập hệ đầy đủ / biến cố độc lập
                <br>&bull; <b>Bước 2:</b> Viết công thức giải tích tổng quát trước khi thay số
                <br>&bull; <b>Bước 3:</b> Thay số chi tiết, tính toán phân số tối giản và số thập phân chuẩn xác
                <br>&bull; <b>Phần mở rộng:</b> Ghi chú các bẫy thường gặp và phương pháp tư duy ăn trọn điểm số
            </div>
        </div>
        <div class="cover-footer">
            <b>Môn học:</b> Xác suất thống kê &bull; <b>Thời gian làm bài:</b> 45 phút / đề<br>
            Hà Nội &bull; Năm học 2026
        </div>
    </div>

    <!-- MỤC LỤC & BẢNG TỔNG HỢP ĐÁP SỐ NHANH -->
    <div class="page-break"></div>
    <div class="section-header">
        <h2 class="section-title">I. BẢNG TỔNG HỢP ĐÁP SỐ NHANH TOÀN BỘ 5 ĐỀ</h2>
        <span class="section-tag">QUICK REFERENCE</span>
    </div>

    <p style="font-size: 13px; color: #4a5568; margin-bottom: 12px;">
        Bảng đối chiếu nhanh đáp số cuối cùng của từng câu hỏi trong 5 đề kiểm tra. Học viên sử dụng bảng này để tự kiểm tra kết quả trước khi đối chiếu chi tiết các bước lập luận theo barem ở các phần sau.
    </p>

    <table class="summary-table">
        <thead>
            <tr>
                <th style="width: 10%;">Đề số</th>
                <th style="width: 16%;">Câu hỏi</th>
                <th style="width: 44%;">Nội dung trọng tâm / Công thức</th>
                <th style="width: 30%;">Đáp số chuẩn</th>
            </tr>
        </thead>
        <tbody>
            <!-- Đề 1 -->
            <tr>
                <td rowspan="6"><b>Đề số 01</b><br><span style="font-size: 11px; color: #718096;">(de1.png)</span></td>
                <td>Câu 1a</td>
                <td>Rút 2 thẻ từ 10 thẻ (1..10), tích chia hết cho 6</td>
                <td>$P = \\dfrac{17}{45} \\approx 0.3778$</td>
            </tr>
            <tr>
                <td>Câu 1b</td>
                <td>3 bộ tộc mắc sốt rét (Xác suất đầy đủ)</td>
                <td>$P = 0.0495$ $(4.95\\%)$</td>
            </tr>
            <tr>
                <td>Câu 1c</td>
                <td>Lập số 5 chữ số từ $\\{0..6\\}$ có 2 số lẻ cạnh nhau</td>
                <td>$P = \\dfrac{468}{2160} = \\dfrac{13}{60} \\approx 0.2167$</td>
            </tr>
            <tr>
                <td>Câu 2a</td>
                <td>3 xạ thủ (0.5; 0.75; 0.3), đúng 1 phát trúng của người 1</td>
                <td>$P = \\dfrac{0.0875}{0.3875} = \\dfrac{7}{31} \\approx 0.2258$</td>
            </tr>
            <tr>
                <td>Câu 2b</td>
                <td>Biến ngẫu nhiên liên tục $f(x)=ax^3$, tính $P(X^3 > X)$</td>
                <td>$a = \\dfrac{1}{4}; \\quad P = \\dfrac{15}{16} = 0.9375$</td>
            </tr>
            <tr>
                <td>Câu 2c</td>
                <td>Dây chuyền kiểm tra KCS (phế phẩm $3\\%$, đúng $98\\%$, $95\\%$)</td>
                <td>$P(A) = 0.0479; \\quad P(B) = 0.0015$</td>
            </tr>

            <!-- Đề 2 -->
            <tr>
                <td rowspan="6"><b>Đề số 02</b><br><span style="font-size: 11px; color: #718096;">(de2.png)</span></td>
                <td>Câu 1.1a</td>
                <td>3 máy (60%, 70%, 80%), chọn ngẫu nhiên 1 máy, tính P(loại A)</td>
                <td>$P(A) = 0.7000$</td>
            </tr>
            <tr>
                <td>Câu 1.1b</td>
                <td>Bayes tìm máy + Tích phân Moivre-Laplace (100 sp, 60..90 loại A)</td>
                <td>$P \\approx 0.8499$ $(84.99\\%)$</td>
            </tr>
            <tr>
                <td>Câu 1.2</td>
                <td>Lập số 5 chữ số từ $\\{0..6\\}$ có 2 số lẻ cạnh nhau</td>
                <td>$P = \\dfrac{13}{60} \\approx 0.2167$</td>
            </tr>
            <tr>
                <td>Câu 2a</td>
                <td>3 xạ thủ (0.55; 0.7; 0.4), đúng 2 phát trúng, người 1 trúng</td>
                <td>$P = \\dfrac{0.297}{0.423} = \\dfrac{33}{47} \\approx 0.7021$</td>
            </tr>
            <tr>
                <td>Câu 2b</td>
                <td>Biến 2 chiều $f(x, y) = a(x^2 + y^2)$, tìm $a$ và $f_X(x)$</td>
                <td>$a = \\dfrac{3}{2}; \\quad f_X(x) = \\dfrac{3}{2}x^2 + \\dfrac{1}{2}$</td>
            </tr>
            <tr>
                <td>Câu 2c</td>
                <td>Dây chuyền KCS phế phẩm</td>
                <td>$P(A) = 0.0479; \\quad P(B) = 0.0015$</td>
            </tr>

            <!-- Đề 3 -->
            <tr>
                <td rowspan="6"><b>Đề số 03</b><br><span style="font-size: 11px; color: #718096;">(d3.png)</span></td>
                <td>Câu 1a</td>
                <td>Rút 2 thẻ từ 10 thẻ (5..14), tích chia hết cho 6</td>
                <td>$P = \\dfrac{20}{45} = \\dfrac{4}{9} \\approx 0.4444$</td>
            </tr>
            <tr>
                <td>Câu 1b</td>
                <td>3 bộ tộc A, B, C (30%, 35%, 35%), sốt rét (1%, 6%, 3%)</td>
                <td>$P = 0.0345$ $(3.45\\%)$</td>
            </tr>
            <tr>
                <td>Câu 1c</td>
                <td>Lập số 5 chữ số từ $\\{0..6\\}$ có 2 số lẻ cạnh nhau</td>
                <td>$P = \\dfrac{13}{60} \\approx 0.2167$</td>
            </tr>
            <tr>
                <td>Câu 2a</td>
                <td>3 xạ thủ (0.4; 0.65; 0.3), đúng 1 phát trúng của người 1</td>
                <td>$P = \\dfrac{0.098}{0.434} = \\dfrac{7}{31} \\approx 0.2258$</td>
            </tr>
            <tr>
                <td>Câu 2b</td>
                <td>Biến ngẫu nhiên liên tục $f(x)=ax^4$, tính $P(X^3 > X)$</td>
                <td>$a = \\dfrac{5}{32}; \\quad P = \\dfrac{31}{32} = 0.96875$</td>
            </tr>
            <tr>
                <td>Câu 2c</td>
                <td>Dây chuyền KCS phế phẩm</td>
                <td>$P(A) = 0.0479; \\quad P(B) = 0.0015$</td>
            </tr>

            <!-- Đề 4 -->
            <tr>
                <td rowspan="6"><b>Đề số 04</b><br><span style="font-size: 11px; color: #718096;">(de5.png)</span></td>
                <td>Câu 1.1a</td>
                <td>3 máy (60%, 75%, 80%), chọn ngẫu nhiên 1 máy, tính P(loại A)</td>
                <td>$P(A) = \\dfrac{43}{60} \\approx 0.7167$</td>
            </tr>
            <tr>
                <td>Câu 1.1b</td>
                <td>Bayes tìm máy + Tích phân Moivre-Laplace (100 sp, 60..90 loại A)</td>
                <td>$P \\approx 0.8579$ $(85.79\\%)$</td>
            </tr>
            <tr>
                <td>Câu 1.2</td>
                <td>Lập số 5 chữ số từ $\\{0..6\\}$ có 2 số lẻ cạnh nhau</td>
                <td>$P = \\dfrac{13}{60} \\approx 0.2167$</td>
            </tr>
            <tr>
                <td>Câu 2a</td>
                <td>3 xạ thủ (0.55; 0.7; 0.4), đúng 2 phát trúng, người 1 trúng</td>
                <td>$P = \\dfrac{33}{47} \\approx 0.7021$</td>
            </tr>
            <tr>
                <td>Câu 2b</td>
                <td>Biến 2 chiều $f(x, y) = ax^2y$, tìm $a$ và $f_X(x)$</td>
                <td>$a = 6; \\quad f_X(x) = 3x^2$</td>
            </tr>
            <tr>
                <td>Câu 2c</td>
                <td>Dây chuyền KCS phế phẩm</td>
                <td>$P(A) = 0.0479; \\quad P(B) = 0.0015$</td>
            </tr>

            <!-- Đề 5 -->
            <tr>
                <td rowspan="6"><b>Đề số 05</b><br><span style="font-size: 11px; color: #718096;">(de4.png - AT13)</span></td>
                <td>Câu 1</td>
                <td>3 xe ô tô sự cố (5%, 20%, 10%): a) Cả 3 tốt; b) Không quá 2 sự cố; c) Đúng 1 sự cố</td>
                <td>a) $0.6840$;<br>b) $0.9990$;<br>c) $0.2830$</td>
            </tr>
            <tr>
                <td>Câu 2a</td>
                <td>10 hộp bi (4 loại I, 3 loại II, 3 loại III), rút 1 bi màu trắng</td>
                <td>$P = \\dfrac{47}{75} \\approx 0.6267$</td>
            </tr>
            <tr>
                <td>Câu 2b</td>
                <td>Bi rút ra là đỏ, tính xác suất rút từ hộp loại I (Bayes)</td>
                <td>$P = \\dfrac{45}{112} \\approx 0.4018$</td>
            </tr>
            <tr>
                <td>Câu 3a</td>
                <td>Kỳ vọng biến rời rạc độc lập $X, Y$</td>
                <td>$E(X) = 1.5; \\quad E(Y) = 0.1$</td>
            </tr>
            <tr>
                <td>Câu 3b</td>
                <td>Bảng phân phối xác suất của $X+Y$ và $XY$</td>
                <td>Đã lập bảng đầy đủ ở phần chi tiết</td>
            </tr>
            <tr>
                <td>Câu 4</td>
                <td>Biến liên tục $f(x) = \\dfrac{k}{\\sqrt{4-x^2}}$ trên $(-2; 2)$: tìm $k$, $F(x)$, $P$</td>
                <td>$k = \\dfrac{1}{\\pi}; \\quad F(x) = \\dfrac{1}{2} + \\dfrac{1}{\\pi}\\arcsin\\left(\\dfrac{x}{2}\\right); \\quad P = \\dfrac{1}{3}$</td>
            </tr>
        </tbody>
    </table>

    <div class="tip-box">
        <b>💡 BÍ QUYẾT TRÌNH BÀY TỰ LUẬN ĐẠT ĐIỂM TỐI ĐA (10/10):</b>
        <br>1. <b>Luôn đặt tên biến cố trước:</b> Đặt $A = \\dots$ bằng lời văn. Không viết xác suất khi chưa gọi biến cố.
        <br>2. <b>Nhận xét mối quan hệ biến cố:</b> Bắt buộc phải có câu khẳng định <i>"Các biến cố độc lập"</i>, <i>"Các biến cố đôi một xung khắc"</i>, hoặc <i>"Tạo thành một hệ biến cố đầy đủ"</i>. Đây là bước ăn 0,5đ trong barem.
        <br>3. <b>Viết công thức giải tích tổng quát:</b> Viết rõ $P(A) = \\sum P(H_i)P(A|H_i)$ hoặc $P(A_1A_2) = P(A_1)P(A_2)$ trước khi thay số.
        <br>4. <b>Rút gọn phân số và số thập phân:</b> Ghi cả phân số tối giản và làm tròn 4 chữ số thập phân để đảm bảo khớp với mọi hướng dẫn chấm.
    </div>

    <!-- ==================== ĐỀ SỐ 01 ==================== -->
    <div class="page-break"></div>
    <div class="section-header">
        <h2 class="section-title">II. ĐÁP ÁN CHI TIẾT & BAREM ĐIỂM &bull; ĐỀ SỐ 01</h2>
        <span class="section-tag">Thời gian: 45 phút &bull; Tham chiếu: de1.png</span>
    </div>

    <!-- Đề bài gốc Đề 1 -->
    <div class="exam-problem-box">
        <div class="problem-title">NỘI DUNG ĐỀ THI SỐ 01 (NGUYÊN BẢN)</div>
        <div class="problem-content">
            <b>Câu 1:</b>
            <ol type="a">
                <li>Cho một hòm đựng 10 thẻ được đánh số từ 1 đến 10. Rút ngẫu nhiên đồng thời 2 thẻ. Tính xác suất để tích hai số ghi trên hai thẻ rút ra là một số chia hết cho 6.</li>
                <li>Cho 3 bộ tộc A, B, C sống trên một hòn đảo với tỉ lệ dân số tương ứng là 10%, 15%, 75%. Tỉ lệ mắc bệnh sốt rét của từng bộ tộc tương ứng là 3%, 6%, 5%. Chọn ngẫu nhiên một người trên đảo, tính xác suất để người đó bị mắc bệnh sốt rét.</li>
                <li>Từ các số $\{0; 1; 2; 3; 4; 5; 6\}$, lập ngẫu nhiên một số có 5 chữ số khác nhau. Tính xác suất để số được lập ra có đúng 2 chữ số lẻ và 2 chữ số lẻ đó đứng cạnh nhau.</li>
            </ol>
            <b>Câu 2:</b>
            <ol type="a">
                <li>Ba xạ thủ cùng bắn mỗi người một phát vào một tấm bia. Xác suất bắn trúng một viên của mỗi người lần lượt là: 0,5; 0,75; 0,3. Biết rằng có đúng 1 phát trúng bia. Tính xác suất để phát trúng đích là của người 1.</li>
                <li>Cho đại lượng ngẫu nhiên liên tục $X$ có hàm mật độ xác suất:
                $$f(x) = \\begin{cases} ax^3 & \\text{nếu } x \\in [0; 2] \\\\ 0 & \\text{nếu } x \\notin [0; 2] \\end{cases}$$
                Tìm $a$ để $f(x)$ là hàm mật độ xác suất. Tính xác suất $P(X^3 > X)$.</li>
                <li>Tỷ lệ phế phẩm của các sản phẩm do một dây chuyền sản xuất là 3%. Người ta đặt ở cuối dây chuyền một thiết bị kiểm tra chất lượng sản phẩm của nhà máy. Thiết bị này phát hiện chính phẩm với độ chính xác 98%, phát hiện phế phẩm với xác suất 95%. Sản phẩm tốt (theo kiểm định của thiết bị) được đưa vào kho; phế phẩm bị trả lại để sửa chữa. Gọi A là biến cố một sản phẩm bị trả lại, B là biến cố một sản phẩm hỏng được chấp nhận vào kho. Tính $P(A)$ và $P(B)$.</li>
            </ol>
        </div>
    </div>

    <!-- Bảng barem chấm điểm chi tiết Đề 1 -->
    <table class="grading-table">
        <thead>
            <tr>
                <th class="col-q">Câu</th>
                <th class="col-sub">Ý</th>
                <th class="col-content">Nội dung trình bày tự luận theo barem chuẩn</th>
                <th class="col-score">Điểm</th>
            </tr>
        </thead>
        <tbody>
            <!-- Câu 1a -->
            <tr>
                <td rowspan="3" class="col-q"><b>Câu 1</b><br>(4,0 điểm)</td>
                <td class="col-sub"><b>a</b><br>(1,5đ)</td>
                <td class="col-content">
                    - Không gian mẫu là phép rút ngẫu nhiên đồng thời 2 thẻ từ 10 thẻ:
                    $$n(\\Omega) = C_{10}^2 = \\frac{10 \\times 9}{2} = 45$$
                    - Gọi $A$ là biến cố: "Tích hai số ghi trên hai thẻ rút ra là một số chia hết cho 6".
                </td>
                <td class="col-score">0,5</td>
            </tr>
            <tr>
                <td class="col-sub"></td>
                <td class="col-content">
                    - Phân loại 10 số từ 1 đến 10 theo tính chất chia hết cho 2 và 3:
                    <br>&bull; Nhóm bội của 6: $S_6 = \\{6\\}$ (có 1 số).
                    <br>&bull; Nhóm số chẵn không chia hết cho 6: $S_c = \\{2, 4, 8, 10\\}$ (có 4 số).
                    <br>&bull; Nhóm số lẻ chia hết cho 3: $S_3 = \\{3, 9\\}$ (có 2 số).
                    <br>&bull; Nhóm còn lại (lẻ, không chia hết cho 3): $S_0 = \\{1, 5, 7\\}$ (có 3 số).
                    <br>- Để tích 2 thẻ rút ra chia hết cho 6, ta có 2 trường hợp xung khắc:
                    <br>+ <b>Trường hợp 1:</b> Có rút được thẻ số 6. Rút thẻ số 6 và 1 thẻ bất kỳ trong 9 thẻ còn lại:
                    $$C_1^1 \\times C_9^1 = 1 \\times 9 = 9 \\text{ (cách)}$$
                    + <b>Trường hợp 2:</b> Không rút thẻ số 6. Khi đó để tích chia hết cho 6 thì phải rút được 1 thẻ chẵn từ $S_c$ và 1 thẻ chia hết cho 3 từ $S_3$:
                    $$C_4^1 \\times C_2^1 = 4 \\times 2 = 8 \\text{ (cách)}$$
                </td>
                <td class="col-score">0,5</td>
            </tr>
            <tr>
                <td class="col-sub"></td>
                <td class="col-content">
                    - Số kết quả thuận lợi cho biến cố $A$ là:
                    $$n(A) = 9 + 8 = 17$$
                    - Xác suất để tích hai số ghi trên hai thẻ chia hết cho 6 là:
                    $$P(A) = \\frac{n(A)}{n(\\Omega)} = \\frac{17}{45} \\approx 0.3778$$
                    <i>Kết luận:</i> Xác suất cần tìm là $\\dfrac{17}{45}$ (khoảng $37,78\\%$).
                </td>
                <td class="col-score">0,5</td>
            </tr>

            <!-- Câu 1b -->
            <tr>
                <td rowspan="2"></td>
                <td class="col-sub"><b>b</b><br>(1,0đ)</td>
                <td class="col-content">
                    - Gọi $H_1, H_2, H_3$ lần lượt là biến cố người được chọn thuộc bộ tộc A, B, C.
                    <br>Theo đề bài ta có: $P(H_1) = 0.10; \\quad P(H_2) = 0.15; \\quad P(H_3) = 0.75$.
                    <br><b>Nhận xét:</b> Các biến cố $H_1, H_2, H_3$ đôi một xung khắc và $P(H_1) + P(H_2) + P(H_3) = 0.10 + 0.15 + 0.75 = 1$. Do đó $\\{H_1, H_2, H_3\\}$ lập thành một hệ biến cố đầy đủ.
                    <br>- Gọi $E$ là biến cố: "Người được chọn bị mắc bệnh sốt rét".
                    <br>Các xác suất có điều kiện: $P(E|H_1) = 0.03; \\quad P(E|H_2) = 0.06; \\quad P(E|H_3) = 0.05$.
                </td>
                <td class="col-score">0,5</td>
            </tr>
            <tr>
                <td class="col-sub"></td>
                <td class="col-content">
                    - Áp dụng <b>công thức xác suất đầy đủ</b>:
                    $$P(E) = \\sum_{i=1}^3 P(H_i)P(E|H_i) = P(H_1)P(E|H_1) + P(H_2)P(E|H_2) + P(H_3)P(E|H_3)$$
                    - Thay số ta được:
                    $$P(E) = 0.10 \\times 0.03 + 0.15 \\times 0.06 + 0.75 \\times 0.05$$
                    $$P(E) = 0.0030 + 0.0090 + 0.0375 = 0.0495$$
                    <i>Kết luận:</i> Xác suất để người được chọn bị mắc bệnh sốt rét là $0.0495$ (hay $4,95\\%$).
                </td>
                <td class="col-score">0,5</td>
            </tr>

            <!-- Câu 1c -->
            <tr>
                <td rowspan="3"></td>
                <td class="col-sub"><b>c</b><br>(1,5đ)</td>
                <td class="col-content">
                    - Gọi số có 5 chữ số khác nhau có dạng $\\overline{a_1a_2a_3a_4a_5}$ ($a_i \\in \\{0, 1, 2, 3, 4, 5, 6\\}, a_1 \\neq 0$).
                    <br>&bull; Chọn chữ số $a_1$: có 6 cách chọn (từ $\\{1, 2, 3, 4, 5, 6\\}$).
                    <br>&bull; Chọn 4 chữ số còn lại từ 6 chữ số còn lại và xếp thứ tự: có $A_6^4 = 360$ cách.
                    <br>Số phần tử không gian mẫu:
                    $$n(\\Omega) = 6 \\times A_6^4 = 6 \\times 360 = 2160$$
                    - Gọi $M$ là biến cố: "Số được lập có đúng 2 chữ số lẻ và 2 chữ số lẻ đứng cạnh nhau".
                </td>
                <td class="col-score">0,5</td>
            </tr>
            <tr>
                <td class="col-sub"></td>
                <td class="col-content">
                    - Tập các chữ số lẻ là $L = \\{1, 3, 5\\}$ (3 số). Tập chữ số chẵn là $C = \\{0, 2, 4, 6\\}$ (4 số).
                    <br>Số cần lập có đúng 2 chữ số lẻ $\\Rightarrow$ số đó gồm 2 chữ số lẻ và 3 chữ số chẵn.
                    <br>- Buộc 2 chữ số lẻ đứng cạnh nhau thành 1 khối $K$:
                    <br>Số cách chọn 2 số lẻ và xếp thứ tự tạo khối $K$: $A_3^2 = 3 \\times 2 = 6$ cách.
                    <br>- Ta xét 2 trường hợp chọn 3 chữ số chẵn:
                    <br>+ <b>TH1: Bộ 3 chữ số chẵn không chứa chữ số 0:</b>
                    <br>Chọn 3 chữ số chẵn từ $\\{2, 4, 6\\}$: có $C_3^3 = 1$ cách.
                    <br>Hoán vị khối $K$ và 3 chữ số chẵn (tổng 4 phần tử) vào 4 vị trí: có $4! = 24$ cách.
                    <br>Số các số tạo thành: $1 \\times 6 \\times 24 = 144$ (số).
                    <br>+ <b>TH2: Bộ 3 chữ số chẵn có chứa chữ số 0:</b>
                    <br>Chọn thêm 2 chữ số chẵn khác 0 từ $\\{2, 4, 6\\}$: có $C_3^2 = 3$ cách.
                    <br>Hoán vị 4 phần tử (khối $K$, số 0, và 2 số chẵn khác) sao cho số 0 không đứng đầu:
                    $$4! - 3! = 24 - 6 = 18 \\text{ (cách)}$$
                    Số các số tạo thành: $3 \\times 6 \\times 18 = 324$ (số).
                </td>
                <td class="col-score">0,5</td>
            </tr>
            <tr>
                <td class="col-sub"></td>
                <td class="col-content">
                    - Tổng số kết quả thuận lợi cho biến cố $M$ là:
                    $$n(M) = 144 + 324 = 468$$
                    - Xác suất của biến cố $M$:
                    $$P(M) = \\frac{n(M)}{n(\\Omega)} = \\frac{468}{2160} = \\frac{13}{60} \\approx 0.2167$$
                    <i>Kết luận:</i> Xác suất cần tìm là $\\dfrac{13}{60}$ (hay $21,67\\%$).
                </td>
                <td class="col-score">0,5</td>
            </tr>

            <!-- Câu 2a -->
            <tr>
                <td rowspan="3" class="col-q"><b>Câu 2</b><br>(6,0 điểm)</td>
                <td class="col-sub"><b>a</b><br>(2,0đ)</td>
                <td class="col-content">
                    - Gọi $A_i$ là biến cố "Xạ thủ thứ $i$ bắn trúng bia" ($i = 1, 2, 3$).
                    <br>Theo giả thiết:
                    <br>$P(A_1) = 0.50 \\Rightarrow P(\\overline{A_1}) = 1 - 0.50 = 0.50$
                    <br>$P(A_2) = 0.75 \\Rightarrow P(\\overline{A_2}) = 1 - 0.75 = 0.25$
                    <br>$P(A_3) = 0.30 \\Rightarrow P(\\overline{A_3}) = 1 - 0.30 = 0.70$
                    <br><b>Nhận xét:</b> $A_1, A_2, A_3$ là các biến cố độc lập trong toàn thể.
                    <br>- Gọi $B$ là biến cố: "Có đúng 1 phát trúng bia".
                    <br>Biểu diễn $B$: $B = A_1\\overline{A_2}\\overline{A_3} + \\overline{A_1}A_2\\overline{A_3} + \\overline{A_1}\\overline{A_2}A_3$.
                </td>
                <td class="col-score">0,5</td>
            </tr>
            <tr>
                <td class="col-sub"></td>
                <td class="col-content">
                    - Vì các biến cố tích đôi một xung khắc, theo công thức cộng và nhân xác suất biến cố độc lập:
                    $$P(B) = P(A_1)P(\\overline{A_2})P(\\overline{A_3}) + P(\\overline{A_1})P(A_2)P(\\overline{A_3}) + P(\\overline{A_1})P(\\overline{A_2})P(A_3)$$
                    Thay số:
                    $$P(B) = 0.50 \\times 0.25 \\times 0.70 + 0.50 \\times 0.75 \\times 0.70 + 0.50 \\times 0.25 \\times 0.30$$
                    $$P(B) = 0.0875 + 0.2625 + 0.0375 = 0.3875$$
                </td>
                <td class="col-score">0,5</td>
            </tr>
            <tr>
                <td class="col-sub"></td>
                <td class="col-content">
                    - Biến cố "phát trúng đích là của người 1" trong điều kiện có đúng 1 phát trúng bia là $A_1|B$.
                    <br>Ta có: $A_1 \\cap B = A_1\\overline{A_2}\\overline{A_3}$.
                    $$P(A_1 \\cap B) = P(A_1)P(\\overline{A_2})P(\\overline{A_3}) = 0.50 \\times 0.25 \\times 0.70 = 0.0875$$
                    - Theo <b>công thức xác suất có điều kiện (Bayes)</b>:
                    $$P(A_1|B) = \\frac{P(A_1 \\cap B)}{P(B)} = \\frac{0.0875}{0.3875} = \\frac{875}{3875} = \\frac{7}{31} \\approx 0.2258$$
                    <i>Kết luận:</i> Xác suất để phát trúng đích là của người 1 là $\\dfrac{7}{31} \\approx 0.2258$ ($22,58\\%$).
                </td>
                <td class="col-score">1,0</td>
            </tr>

            <!-- Câu 2b -->
            <tr>
                <td rowspan="3"></td>
                <td class="col-sub"><b>b</b><br>(2,0đ)</td>
                <td class="col-content">
                    - Điều kiện để hàm $f(x)$ là hàm mật độ xác suất:
                    <br>1) $f(x) \\ge 0, \\forall x \\Rightarrow ax^3 \\ge 0, \\forall x \\in [0; 2] \\Leftrightarrow a \\ge 0$.
                    <br>2) Tích phân chuẩn hóa bằng 1: $\\displaystyle\\int_{-\\infty}^{+\\infty} f(x)dx = 1$.
                    <br>Ta có:
                    $$\\int_{-\\infty}^{+\\infty} f(x)dx = \\int_0^2 ax^3dx = a \\left[ \\frac{x^4}{4} \\right]_0^2 = a \\cdot \\frac{16}{4} = 4a$$
                    Do đó: $4a = 1 \\Leftrightarrow a = \\dfrac{1}{4}$ (thỏa mãn $a \\ge 0$).
                    <br>Vậy: $f(x) = \\begin{cases} \\dfrac{1}{4}x^3 & \\text{khi } x \\in [0; 2] \\\\ 0 & \\text{khi } x \\notin [0; 2] \\end{cases}$
                </td>
                <td class="col-score">1,0</td>
            </tr>
            <tr>
                <td class="col-sub"></td>
                <td class="col-content">
                    - Xét bất phương trình biến cố $X^3 > X$:
                    $$X^3 - X > 0 \\Leftrightarrow X(X - 1)(X + 1) > 0$$
                    Vì đại lượng ngẫu nhiên $X$ chỉ nhận giá trị trên đoạn $[0; 2]$:
                    <br>&bull; Với $x \\in [0; 2]$ thì $x \\ge 0$ và $x + 1 > 0$.
                    <br>&bull; Do đó: $X(X - 1)(X + 1) > 0 \\Leftrightarrow X - 1 > 0 \\Leftrightarrow X > 1$.
                    <br>Vậy biến cố $\\{X^3 > X\\}$ tương đương với $\\{1 < X \\le 2\\}$.
                </td>
                <td class="col-score">0,5</td>
            </tr>
            <tr>
                <td class="col-sub"></td>
                <td class="col-content">
                    - Xác suất cần tìm là:
                    $$P(X^3 > X) = P(1 < X \\le 2) = \\int_1^2 f(x)dx = \\int_1^2 \\frac{1}{4}x^3 dx$$
                    $$= \\frac{1}{4} \\left[ \\frac{x^4}{4} \\right]_1^2 = \\frac{1}{16}(2^4 - 1^4) = \\frac{16 - 1}{16} = \\frac{15}{16} = 0.9375$$
                    <i>Kết luận:</i> $a = \\dfrac{1}{4}$ và $P(X^3 > X) = \\dfrac{15}{16} = 0.9375$.
                </td>
                <td class="col-score">0,5</td>
            </tr>

            <!-- Câu 2c -->
            <tr>
                <td rowspan="3"></td>
                <td class="col-sub"><b>c</b><br>(2,0đ)</td>
                <td class="col-content">
                    - Gọi $T$ là biến cố: "Sản phẩm được kiểm tra là chính phẩm (tốt)".
                    <br>- Gọi $H$ là biến cố: "Sản phẩm được kiểm tra là phế phẩm (hỏng)".
                    <br>Theo đề bài: $P(H) = 0.03 \\Rightarrow P(T) = 1 - 0.03 = 0.97$.
                    <br><b>Nhận xét:</b> $\\{T, H\\}$ tạo thành một hệ biến cố đầy đủ.
                    <br>- Gọi $K$ là biến cố: "Thiết bị kết luận sản phẩm là tốt (cho vào kho)".
                    <br>Khi đó $\\overline{K}$ là biến cố: "Thiết bị kết luận sản phẩm là hỏng (bị trả lại)".
                    <br>Theo đề bài:
                    <br>&bull; Độ chính xác phát hiện chính phẩm là 98%: $P(K|T) = 0.98 \\Rightarrow P(\\overline{K}|T) = 0.02$.
                    <br>&bull; Độ chính xác phát hiện phế phẩm là 95%: $P(\\overline{K}|H) = 0.95 \\Rightarrow P(K|H) = 0.05$.
                </td>
                <td class="col-score">0,5</td>
            </tr>
            <tr>
                <td class="col-sub"></td>
                <td class="col-content">
                    - <b>Tính $P(A)$ (biến cố một sản phẩm bị trả lại):</b>
                    <br>Biến cố sản phẩm bị trả lại chính là biến cố thiết bị kết luận sản phẩm hỏng, tức $A = \\overline{K}$.
                    <br>Áp dụng công thức xác suất đầy đủ:
                    $$P(A) = P(\\overline{K}) = P(T)P(\\overline{K}|T) + P(H)P(\\overline{K}|H)$$
                    Thay số:
                    $$P(A) = 0.97 \\times 0.02 + 0.03 \\times 0.95 = 0.0194 + 0.0285 = 0.0479$$
                    Vậy xác suất sản phẩm bị trả lại là $P(A) = 0.0479$ ($4,79\\%$).
                </td>
                <td class="col-score">0,75</td>
            </tr>
            <tr>
                <td class="col-sub"></td>
                <td class="col-content">
                    - <b>Tính $P(B)$ (biến cố một sản phẩm hỏng được chấp nhận vào kho):</b>
                    <br>Sản phẩm hỏng được chấp nhận vào kho nghĩa là: sản phẩm thực tế là phế phẩm ($H$), nhưng thiết bị lại kết luận là tốt ($K$).
                    <br>Do đó: $B = H \\cap K$.
                    <br>Áp dụng công thức nhân xác suất:
                    $$P(B) = P(H) \\times P(K|H) = 0.03 \\times 0.05 = 0.0015$$
                    <i>Kết luận:</i> $P(A) = 0.0479$ và $P(B) = 0.0015$ ($0,15\\%$).
                </td>
                <td class="col-score">0,75</td>
            </tr>
        </tbody>
    </table>

    <!-- ==================== ĐỀ SỐ 02 ==================== -->
    <div class="page-break"></div>
    <div class="section-header">
        <h2 class="section-title">III. ĐÁP ÁN CHI TIẾT & BAREM ĐIỂM &bull; ĐỀ SỐ 02</h2>
        <span class="section-tag">Thời gian: 45 phút &bull; Tham chiếu: de2.png</span>
    </div>

    <!-- Đề bài gốc Đề 2 -->
    <div class="exam-problem-box">
        <div class="problem-title">NỘI DUNG ĐỀ THI SỐ 02 (NGUYÊN BẢN)</div>
        <div class="problem-content">
            <b>Câu 1:</b>
            <br>1) Có 3 máy cùng sản xuất một loại sản phẩm. Theo đánh giá tỉ lệ sản phẩm loại A của 3 máy là 60%; 70%; 80%. Khi giao xuống công ty do quên đánh dấu và 3 máy giống hệt nhau nên ta không thể phân biệt. Chọn ngẫu nhiên một máy sau đó cho máy sản xuất một sản phẩm.
            <ol type="a">
                <li>Tính xác suất sản phẩm loại A?</li>
                <li>Giả sử máy đã sản xuất được sản phẩm loại A. Tính xác suất sản xuất tiếp 100 sản phẩm nữa cũng từ máy này thì có từ 60 đến 90 sản phẩm loại A?</li>
            </ol>
            2) Từ các số $\{0; 1; 2; 3; 4; 5; 6\}$, lập ngẫu nhiên một số có 5 chữ số khác nhau, tính xác suất để số được lập ra có đúng 2 chữ số lẻ và 2 chữ số lẻ đó đứng cạnh nhau.
            <br><br>
            <b>Câu 2:</b>
            <ol type="a">
                <li>Ba xạ thủ cùng bắn mỗi người một phát vào một tấm bia. Xác suất bắn trúng một viên của mỗi người lần lượt là: 0,55; 0,7; 0,4. Biết rằng có đúng 2 phát trúng bia. Tính xác suất để có đúng một viên đạn trúng đích là của người 1.</li>
                <li>Cho hàm số:
                $$f(x, y) = \\begin{cases} a(x^2 + y^2) & \\text{nếu } x, y \\in [0; 1] \\\\ 0 & \\text{nếu } x, y \\notin [0; 1] \\end{cases}$$
                Tìm $a$ để $f(x, y)$ là hàm mật độ đồng thời của biến ngẫu nhiên 2 chiều nào đó, tính hàm mật độ của $X$.</li>
                <li>Tỷ lệ phế phẩm của các sản phẩm do một dây chuyền sản xuất là 3%. Người ta đặt ở cuối dây chuyền một thiết bị kiểm tra chất lượng sản phẩm của nhà máy. Thiết bị này phát hiện chính phẩm với độ chính xác 98%, phát hiện phế phẩm với xác suất 95%. Sản phẩm tốt (theo kiểm định của thiết bị) được đưa vào kho; phế phẩm bị trả lại để sửa chữa. Gọi A là biến cố một sản phẩm bị trả lại, B là biến cố một sản phẩm hỏng được chấp nhận vào kho. Tính $P(A)$ và $P(B)$.</li>
            </ol>
        </div>
    </div>

    <!-- Bảng barem chấm điểm chi tiết Đề 2 -->
    <table class="grading-table">
        <thead>
            <tr>
                <th class="col-q">Câu</th>
                <th class="col-sub">Ý</th>
                <th class="col-content">Nội dung trình bày tự luận theo barem chuẩn</th>
                <th class="col-score">Điểm</th>
            </tr>
        </thead>
        <tbody>
            <!-- Câu 1.1a -->
            <tr>
                <td rowspan="4" class="col-q"><b>Câu 1</b><br>(4,0 điểm)</td>
                <td class="col-sub"><b>1.1a</b><br>(1,0đ)</td>
                <td class="col-content">
                    - Gọi $M_i$ là biến cố "Chọn được máy thứ $i$" ($i = 1, 2, 3$).
                    <br>Vì chọn ngẫu nhiên 1 trong 3 máy nên:
                    $$P(M_1) = P(M_2) = P(M_3) = \\frac{1}{3}$$
                    <b>Nhận xét:</b> $\\{M_1, M_2, M_3\\}$ là một hệ biến cố đầy đủ.
                    <br>- Gọi $A$ là biến cố: "Sản phẩm sản xuất ra là sản phẩm loại A".
                    <br>Xác suất có điều kiện: $P(A|M_1) = 0.60; \\quad P(A|M_2) = 0.70; \\quad P(A|M_3) = 0.80$.
                </td>
                <td class="col-score">0,5</td>
            </tr>
            <tr>
                <td class="col-sub"></td>
                <td class="col-content">
                    - Theo <b>công thức xác suất đầy đủ</b>:
                    $$P(A) = \\sum_{i=1}^3 P(M_i)P(A|M_i) = \\frac{1}{3}(0.60 + 0.70 + 0.80) = \\frac{1}{3} \\times 2.10 = 0.70$$
                    <i>Kết luận:</i> Xác suất sản phẩm sản xuất ra là loại A là $P(A) = 0.70$ ($70\\%$).
                </td>
                <td class="col-score">0,5</td>
            </tr>

            <!-- Câu 1.1b -->
            <tr>
                <td class="col-sub"><b>1.1b</b><br>(1,5đ)</td>
                <td class="col-content">
                    - Biết sản phẩm đầu là loại A, theo <b>công thức Bayes</b> xác suất máy đó là máy $M_i$:
                    $$P(M_i|A) = \\frac{P(M_i)P(A|M_i)}{P(A)}$$
                    $$P(M_1|A) = \\frac{\\frac{1}{3} \\times 0.60}{0.70} = \\frac{0.6}{2.1} = \\frac{6}{21} = \\frac{2}{7}$$
                    $$P(M_2|A) = \\frac{\\frac{1}{3} \\times 0.70}{0.70} = \\frac{0.7}{2.1} = \\frac{7}{21} = \\frac{1}{3}$$
                    $$P(M_3|A) = \\frac{\\frac{1}{3} \\times 0.80}{0.70} = \\frac{0.8}{2.1} = \\frac{8}{21}$$
                    - Cho máy đó sản xuất tiếp $n = 100$ sản phẩm. Gọi $Y$ là số sản phẩm loại A trong 100 sản phẩm.
                    <br>Nếu máy được chọn là máy $i$, $Y \\sim B(100, p_i)$. Vì $n = 100$ lớn, $np_i \\ge 5, nq_i \\ge 5$, áp dụng <b>công thức tích phân Moivre - Laplace</b>:
                    $$P(k_1 \\le Y \\le k_2) \\approx \\Phi_0(x_2) - \\Phi_0(x_1) \\quad \\text{với } x_1 = \\frac{k_1 - np}{\\sqrt{npq}}, x_2 = \\frac{k_2 - np}{\\sqrt{npq}}$$
                </td>
                <td class="col-score">0,75</td>
            </tr>
            <tr>
                <td class="col-sub"></td>
                <td class="col-content">
                    - Gọi $E$ là biến cố "Trong 100 sản phẩm tiếp theo có từ 60 đến 90 sản phẩm loại A":
                    <br>&bull; Với máy 1 ($p=0.6, q=0.4$): $np=60, \\sqrt{npq}=\\sqrt{24} \\approx 4.899$.
                    $$x_1 = \\frac{60-60}{4.899} = 0; \\quad x_2 = \\frac{90-60}{4.899} \\approx 6.12 \\Rightarrow P(E|M_1) \\approx \\Phi_0(6.12) - \\Phi_0(0) \\approx 0.5000$$
                    &bull; Với máy 2 ($p=0.7, q=0.3$): $np=70, \\sqrt{npq}=\\sqrt{21} \\approx 4.583$.
                    $$x_1 = \\frac{60-70}{4.583} \\approx -2.18; \\quad x_2 = \\frac{90-70}{4.583} \\approx 4.36$$
                    $$P(E|M_2) \\approx \\Phi_0(4.36) - \\Phi_0(-2.18) = \\Phi_0(4.36) + \\Phi_0(2.18) \\approx 0.5000 + 0.4854 = 0.9854$$
                    &bull; Với máy 3 ($p=0.8, q=0.2$): $np=80, \\sqrt{npq}=\\sqrt{16} = 4$.
                    $$x_1 = \\frac{60-80}{4} = -5.00; \\quad x_2 = \\frac{90-80}{4} = 2.50$$
                    $$P(E|M_3) \\approx \\Phi_0(2.50) - \\Phi_0(-5.00) = \\Phi_0(2.50) + \\Phi_0(5.00) \\approx 0.4938 + 0.5000 = 0.9938$$
                    - Theo công thức xác suất đầy đủ với điều kiện biến cố $A$:
                    $$P(E|A) = \\sum_{i=1}^3 P(M_i|A)P(E|M_i) = \\frac{6}{21}(0.5000) + \\frac{7}{21}(0.9854) + \\frac{8}{21}(0.9938)$$
                    $$P(E|A) = \\frac{3.0000 + 6.8978 + 7.9504}{21} = \\frac{17.8482}{21} \\approx 0.8499$$
                    <i>Kết luận:</i> Xác suất cần tìm xấp xỉ $0.8499$ (hay $84,99\\%$).
                </td>
                <td class="col-score">0,75</td>
            </tr>

            <!-- Câu 1.2 -->
            <tr>
                <td class="col-q"></td>
                <td class="col-sub"><b>1.2</b><br>(1,5đ)</td>
                <td class="col-content">
                    <i>(Bài toán lập số 5 chữ số từ $\{0, 1, 2, 3, 4, 5, 6\}$ có đúng 2 chữ số lẻ đứng cạnh nhau - hoàn toàn tương tự Câu 1c Đề 01)</i>:
                    <br>&bull; Không gian mẫu: Số các số có 5 chữ số khác nhau lập từ tập 7 chữ số:
                    $$n(\\Omega) = 6 \\times A_6^4 = 6 \\times 360 = 2160$$
                    &bull; Buộc 2 chữ số lẻ đứng cạnh nhau thành khối $K$: có $A_3^2 = 6$ cách.
                    <br>&bull; Số thuận lợi gồm 2 trường hợp:
                    <br>- TH1 (không có số 0): $C_3^3 \\times 6 \\times 4! = 1 \\times 6 \\times 24 = 144$ số.
                    <br>- TH2 (có số 0 đứng cùng): $C_3^2 \\times 6 \\times (4! - 3!) = 3 \\times 6 \\times 18 = 324$ số.
                    <br>&bull; Tổng số thuận lợi: $n(E) = 144 + 324 = 468$.
                    $$P(E) = \\frac{468}{2160} = \\frac{13}{60} \\approx 0.2167$$
                </td>
                <td class="col-score">1,5</td>
            </tr>

            <!-- Câu 2a -->
            <tr>
                <td rowspan="3" class="col-q"><b>Câu 2</b><br>(6,0 điểm)</td>
                <td class="col-sub"><b>a</b><br>(2,0đ)</td>
                <td class="col-content">
                    - Gọi $A_i$ là biến cố "Xạ thủ thứ $i$ bắn trúng bia" ($i = 1, 2, 3$).
                    <br>Theo đề bài: $P(A_1) = 0.55 \\Rightarrow P(\\overline{A_1}) = 0.45$;
                    <br>$P(A_2) = 0.70 \\Rightarrow P(\\overline{A_2}) = 0.30$;
                    <br>$P(A_3) = 0.40 \\Rightarrow P(\\overline{A_3}) = 0.60$.
                    <br><b>Nhận xét:</b> Các biến cố $A_1, A_2, A_3$ độc lập trong toàn thể.
                    <br>- Gọi $B$ là biến cố: "Có đúng 2 phát trúng bia".
                    <br>Biểu diễn $B$: $B = A_1 A_2 \\overline{A_3} + A_1 \\overline{A_2} A_3 + \\overline{A_1} A_2 A_3$.
                </td>
                <td class="col-score">0,5</td>
            </tr>
            <tr>
                <td class="col-sub"></td>
                <td class="col-content">
                    - Tính xác suất của $B$:
                    $$P(B) = P(A_1)P(A_2)P(\\overline{A_3}) + P(A_1)P(\\overline{A_2})P(A_3) + P(\\overline{A_1})P(A_2)P(A_3)$$
                    $$P(B) = 0.55 \\times 0.70 \\times 0.60 + 0.55 \\times 0.30 \\times 0.40 + 0.45 \\times 0.70 \\times 0.40$$
                    $$P(B) = 0.2310 + 0.0660 + 0.1260 = 0.4230$$
                </td>
                <td class="col-score">0,5</td>
            </tr>
            <tr>
                <td class="col-sub"></td>
                <td class="col-content">
                    - Biến cố "người 1 trúng đích" trong điều kiện có đúng 2 phát trúng bia:
                    <br>Vì mỗi xạ thủ bắn đúng 1 phát, nên "có đúng 1 viên trúng đích là của người 1" tương đương với việc người 1 bắn trúng trong số 2 người trúng:
                    $$A_1 \\cap B = A_1 A_2 \\overline{A_3} + A_1 \\overline{A_2} A_3$$
                    $$P(A_1 \\cap B) = 0.2310 + 0.0660 = 0.2970$$
                    - Áp dụng công thức Bayes / xác suất có điều kiện:
                    $$P(A_1|B) = \\frac{P(A_1 \\cap B)}{P(B)} = \\frac{0.2970}{0.4230} = \\frac{297}{423} = \\frac{33}{47} \\approx 0.7021$$
                    <i>Kết luận:</i> Xác suất cần tìm là $\\dfrac{33}{47} \\approx 0.7021$ ($70,21\\%$).
                </td>
                <td class="col-score">1,0</td>
            </tr>

            <!-- Câu 2b -->
            <tr>
                <td rowspan="2"></td>
                <td class="col-sub"><b>b</b><br>(2,0đ)</td>
                <td class="col-content">
                    - Điều kiện để $f(x, y)$ là hàm mật độ đồng thời của biến ngẫu nhiên 2 chiều $(X, Y)$:
                    <br>1) $f(x, y) \\ge 0, \\forall (x, y) \\Rightarrow a \\ge 0$.
                    <br>2) $\\displaystyle\\int_{-\\infty}^{+\\infty} \\int_{-\\infty}^{+\\infty} f(x, y)dxdy = 1$.
                    <br>Ta tính tích phân:
                    $$\\int_0^1 \\int_0^1 a(x^2 + y^2)dxdy = a \\int_0^1 \\left[ x^2 y + \\frac{y^3}{3} \\right]_0^1 dx = a \\int_0^1 \\left( x^2 + \\frac{1}{3} \\right) dx$$
                    $$= a \\left[ \\frac{x^3}{3} + \\frac{x}{3} \\right]_0^1 = a \\left( \\frac{1}{3} + \\frac{1}{3} \\right) = \\frac{2}{3}a$$
                    Để là hàm mật độ thì $\\dfrac{2}{3}a = 1 \\Leftrightarrow a = \\dfrac{3}{2}$ (thỏa mãn $a \\ge 0$).
                </td>
                <td class="col-score">1,0</td>
            </tr>
            <tr>
                <td class="col-sub"></td>
                <td class="col-content">
                    - Tìm hàm mật độ xác suất thành phần của $X$:
                    <br>Theo định nghĩa hàm mật độ biên: $f_X(x) = \\displaystyle\\int_{-\\infty}^{+\\infty} f(x, y)dy$.
                    <br>&bull; Nếu $x \\notin [0; 1]$: $f_X(x) = 0$.
                    <br>&bull; Nếu $x \\in [0; 1]$:
                    $$f_X(x) = \\int_0^1 \\frac{3}{2}(x^2 + y^2)dy = \\frac{3}{2} \\left[ x^2 y + \\frac{y^3}{3} \\right]_0^1 = \\frac{3}{2} \\left( x^2 + \\frac{1}{3} \\right) = \\frac{3}{2}x^2 + \\frac{1}{2}$$
                    <i>Kết luận:</i> $a = \\dfrac{3}{2}$ và hàm mật độ của $X$ là:
                    $$f_X(x) = \\begin{cases} \\dfrac{3}{2}x^2 + \\dfrac{1}{2} & \\text{nếu } x \\in [0; 1] \\\\ 0 & \\text{nếu } x \\notin [0; 1] \\end{cases}$$
                </td>
                <td class="col-score">1,0</td>
            </tr>

            <!-- Câu 2c -->
            <tr>
                <td class="col-q"></td>
                <td class="col-sub"><b>c</b><br>(2,0đ)</td>
                <td class="col-content">
                    <i>(Tương tự Câu 2c Đề 01)</i>:
                    <br>- Đặt $T$: chính phẩm ($P(T)=0.97$), $H$: phế phẩm ($P(H)=0.03$).
                    <br>- Đặt $K$: máy kết luận tốt, $\\overline{K}$: máy kết luận hỏng.
                    <br>Theo đề: $P(\\overline{K}|T) = 0.02; \\quad P(\\overline{K}|H) = 0.95; \\quad P(K|H) = 0.05$.
                    <br>&bull; <b>Xác suất $P(A)$ (sản phẩm bị trả lại):</b>
                    $$P(A) = P(\\overline{K}) = P(T)P(\\overline{K}|T) + P(H)P(\\overline{K}|H) = 0.97 \\times 0.02 + 0.03 \\times 0.95 = 0.0479$$
                    &bull; <b>Xác suất $P(B)$ (sản phẩm hỏng lọt vào kho):</b>
                    $$P(B) = P(H \\cap K) = P(H)P(K|H) = 0.03 \\times 0.05 = 0.0015$$
                </td>
                <td class="col-score">2,0</td>
            </tr>
        </tbody>
    </table>

    <!-- ==================== ĐỀ SỐ 03 ==================== -->
    <div class="page-break"></div>
    <div class="section-header">
        <h2 class="section-title">IV. ĐÁP ÁN CHI TIẾT & BAREM ĐIỂM &bull; ĐỀ SỐ 03</h2>
        <span class="section-tag">Thời gian: 45 phút &bull; Tham chiếu: d3.png</span>
    </div>

    <!-- Đề bài gốc Đề 3 -->
    <div class="exam-problem-box">
        <div class="problem-title">NỘI DUNG ĐỀ THI SỐ 03 (NGUYÊN BẢN)</div>
        <div class="problem-content">
            <b>Câu 1:</b>
            <ol type="a">
                <li>Cho một hòm đựng 10 thẻ được đánh số từ 5 đến 14. Rút ngẫu nhiên đồng thời 2 thẻ. Tính xác suất để tích hai số ghi trên hai thẻ rút ra là một số chia hết cho 6.</li>
                <li>Cho 3 bộ tộc A, B, C sống trên một hòn đảo với tỉ lệ dân số tương ứng là 30%, 35%, 35%. Tỉ lệ mắc bệnh sốt rét của từng bộ tộc tương ứng là 1%, 6%, 3%. Chọn ngẫu nhiên một người trên đảo, tính xác suất để người đó bị mắc bệnh sốt rét.</li>
                <li>Từ các số $\{0; 1; 2; 3; 4; 5; 6\}$, lập ngẫu nhiên một số có 5 chữ số khác nhau, tính xác suất để số được lập ra có đúng 2 chữ số lẻ và 2 chữ số lẻ đó đứng cạnh nhau.</li>
            </ol>
            <b>Câu 2:</b>
            <ol type="a">
                <li>Ba xạ thủ cùng bắn mỗi người một phát vào một tấm bia. Xác suất bắn trúng một viên của mỗi người lần lượt là: 0,4; 0,65; 0,3. Biết rằng có đúng 1 phát trúng bia. Tính xác suất để phát trúng đích là của người 1.</li>
                <li>Cho đại lượng ngẫu nhiên liên tục $X$ có hàm mật độ xác suất:
                $$f(x) = \\begin{cases} ax^4 & \\text{nếu } x \\in [0; 2] \\\\ 0 & \\text{nếu } x \\notin [0; 2] \\end{cases}$$
                Tìm $a$ để $f(x)$ là hàm mật độ xác suất. Tính xác suất $P(X^3 > X)$.</li>
                <li>Tỷ lệ phế phẩm của các sản phẩm do một dây chuyền sản xuất là 3%. Người ta đặt ở cuối dây chuyền một thiết bị kiểm tra chất lượng sản phẩm của nhà máy. Thiết bị này phát hiện chính phẩm với độ chính xác 98%, phát hiện phế phẩm với xác suất 95%. Sản phẩm tốt (theo kiểm định của thiết bị) được đưa vào kho; phế phẩm bị trả lại để sửa chữa. Gọi A là biến cố một sản phẩm bị trả lại, B là biến cố một sản phẩm hỏng được chấp nhận vào kho. Tính $P(A)$ và $P(B)$.</li>
            </ol>
        </div>
    </div>

    <!-- Bảng barem chấm điểm chi tiết Đề 3 -->
    <table class="grading-table">
        <thead>
            <tr>
                <th class="col-q">Câu</th>
                <th class="col-sub">Ý</th>
                <th class="col-content">Nội dung trình bày tự luận theo barem chuẩn</th>
                <th class="col-score">Điểm</th>
            </tr>
        </thead>
        <tbody>
            <!-- Câu 1a -->
            <tr>
                <td rowspan="3" class="col-q"><b>Câu 1</b><br>(4,0 điểm)</td>
                <td class="col-sub"><b>a</b><br>(1,5đ)</td>
                <td class="col-content">
                    - Không gian mẫu rút ngẫu nhiên đồng thời 2 thẻ từ 10 thẻ mang số từ 5 đến 14:
                    $$n(\\Omega) = C_{10}^2 = \\frac{10 \\times 9}{2} = 45$$
                    - Gọi $A$ là biến cố: "Tích hai số ghi trên hai thẻ rút ra là một số chia hết cho 6".
                </td>
                <td class="col-score">0,5</td>
            </tr>
            <tr>
                <td class="col-sub"></td>
                <td class="col-content">
                    - Tập hợp 10 thẻ là: $S = \\{5, 6, 7, 8, 9, 10, 11, 12, 13, 14\\}$. Phân nhóm:
                    <br>&bull; Nhóm bội của 6: $S_6 = \\{6, 12\\}$ (có 2 số).
                    <br>&bull; Nhóm số chẵn không chia hết cho 6: $S_c = \\{8, 10, 14\\}$ (có 3 số).
                    <br>&bull; Nhóm số lẻ chia hết cho 3: $S_3 = \\{9\\}$ (có 1 số).
                    <br>&bull; Nhóm còn lại (lẻ, không chia hết cho 3): $S_0 = \\{5, 7, 11, 13\\}$ (có 4 số).
                    <br>- Để tích chia hết cho 6, ta có 2 trường hợp xung khắc:
                    <br>+ <b>Trường hợp 1: Có rút ít nhất một thẻ từ nhóm $S_6$:</b>
                    <br>&bull; Rút 1 thẻ thuộc $S_6$ và 1 thẻ thuộc các nhóm còn lại (8 thẻ): $C_2^1 \\times C_8^1 = 2 \\times 8 = 16$ cách.
                    <br>&bull; Rút cả 2 thẻ đều thuộc $S_6$: $C_2^2 = 1$ cách.
                    <br>$\\Rightarrow$ Số cách ở TH1: $16 + 1 = 17$ cách.
                    <br>+ <b>Trường hợp 2: Không rút thẻ nào từ nhóm $S_6$:</b>
                    <br>Để tích chia hết cho 6 thì phải rút 1 thẻ chẵn từ $S_c$ và 1 thẻ chia hết cho 3 từ $S_3$:
                    $$C_3^1 \\times C_1^1 = 3 \\times 1 = 3 \\text{ cách}$$
                </td>
                <td class="col-score">0,5</td>
            </tr>
            <tr>
                <td class="col-sub"></td>
                <td class="col-content">
                    - Số kết quả thuận lợi cho biến cố $A$ là:
                    $$n(A) = 17 + 3 = 20$$
                    - Xác suất biến cố $A$:
                    $$P(A) = \\frac{n(A)}{n(\\Omega)} = \\frac{20}{45} = \\frac{4}{9} \\approx 0.4444$$
                    <i>Kết luận:</i> Xác suất cần tìm là $\\dfrac{4}{9} \\approx 0.4444$ ($44,44\\%$).
                </td>
                <td class="col-score">0,5</td>
            </tr>

            <!-- Câu 1b -->
            <tr>
                <td rowspan="2"></td>
                <td class="col-sub"><b>b</b><br>(1,0đ)</td>
                <td class="col-content">
                    - Gọi $H_1, H_2, H_3$ lần lượt là biến cố người được chọn thuộc bộ tộc A, B, C.
                    <br>Ta có: $P(H_1) = 0.30; \\quad P(H_2) = 0.35; \\quad P(H_3) = 0.35$.
                    <br><b>Nhận xét:</b> Các biến cố $H_1, H_2, H_3$ đôi một xung khắc và $P(H_1) + P(H_2) + P(H_3) = 0.30 + 0.35 + 0.35 = 1$. Do đó $\\{H_1, H_2, H_3\\}$ lập thành một hệ biến cố đầy đủ.
                    <br>- Gọi $E$ là biến cố: "Người được chọn bị mắc bệnh sốt rét".
                    <br>Ta có: $P(E|H_1) = 0.01; \\quad P(E|H_2) = 0.06; \\quad P(E|H_3) = 0.03$.
                </td>
                <td class="col-score">0,5</td>
            </tr>
            <tr>
                <td class="col-sub"></td>
                <td class="col-content">
                    - Theo <b>công thức xác suất đầy đủ</b>:
                    $$P(E) = P(H_1)P(E|H_1) + P(H_2)P(E|H_2) + P(H_3)P(E|H_3)$$
                    $$P(E) = 0.30 \\times 0.01 + 0.35 \\times 0.06 + 0.35 \\times 0.03$$
                    $$P(E) = 0.0030 + 0.0210 + 0.0105 = 0.0345$$
                    <i>Kết luận:</i> Xác suất người được chọn mắc bệnh sốt rét là $0.0345$ ($3,45\\%$).
                </td>
                <td class="col-score">0,5</td>
            </tr>

            <!-- Câu 1c -->
            <tr>
                <td class="col-q"></td>
                <td class="col-sub"><b>c</b><br>(1,5đ)</td>
                <td class="col-content">
                    <i>(Hoàn toàn giống Câu 1c Đề 01)</i>:
                    <br>&bull; Số phần tử không gian mẫu: $n(\\Omega) = 6 \\times A_6^4 = 2160$.
                    <br>&bull; Số thuận lợi (2 lẻ cạnh nhau, 3 chẵn): $n(M) = 144 + 324 = 468$.
                    <br>&bull; Xác suất: $P(M) = \\dfrac{468}{2160} = \\dfrac{13}{60} \\approx 0.2167$.
                </td>
                <td class="col-score">1,5</td>
            </tr>

            <!-- Câu 2a -->
            <tr>
                <td rowspan="3" class="col-q"><b>Câu 2</b><br>(6,0 điểm)</td>
                <td class="col-sub"><b>a</b><br>(2,0đ)</td>
                <td class="col-content">
                    - Gọi $A_i$ là biến cố "Xạ thủ thứ $i$ bắn trúng bia" ($i = 1, 2, 3$).
                    <br>Theo đề bài:
                    <br>$P(A_1) = 0.40 \\Rightarrow P(\\overline{A_1}) = 0.60$
                    <br>$P(A_2) = 0.65 \\Rightarrow P(\\overline{A_2}) = 0.35$
                    <br>$P(A_3) = 0.30 \\Rightarrow P(\\overline{A_3}) = 0.70$
                    <br><b>Nhận xét:</b> $A_1, A_2, A_3$ độc lập trong toàn thể.
                    <br>- Gọi $B$ là biến cố: "Có đúng 1 phát trúng bia".
                    <br>Biểu diễn $B$: $B = A_1\\overline{A_2}\\overline{A_3} + \\overline{A_1}A_2\\overline{A_3} + \\overline{A_1}\\overline{A_2}A_3$.
                </td>
                <td class="col-score">0,5</td>
            </tr>
            <tr>
                <td class="col-sub"></td>
                <td class="col-content">
                    - Tính $P(B)$:
                    $$P(B) = P(A_1)P(\\overline{A_2})P(\\overline{A_3}) + P(\\overline{A_1})P(A_2)P(\\overline{A_3}) + P(\\overline{A_1})P(\\overline{A_2})P(A_3)$$
                    $$P(B) = 0.40 \\times 0.35 \\times 0.70 + 0.60 \\times 0.65 \\times 0.70 + 0.60 \\times 0.35 \\times 0.30$$
                    $$P(B) = 0.0980 + 0.2730 + 0.0630 = 0.4340$$
                </td>
                <td class="col-score">0,5</td>
            </tr>
            <tr>
                <td class="col-sub"></td>
                <td class="col-content">
                    - Biến cố phát trúng đích là của người 1 trong điều kiện có đúng 1 phát trúng:
                    $$P(A_1 \\cap B) = P(A_1\\overline{A_2}\\overline{A_3}) = 0.40 \\times 0.35 \\times 0.70 = 0.0980$$
                    - Áp dụng <b>công thức Bayes</b>:
                    $$P(A_1|B) = \\frac{P(A_1 \\cap B)}{P(B)} = \\frac{0.0980}{0.4340} = \\frac{98}{434} = \\frac{7}{31} \\approx 0.2258$$
                    <i>Kết luận:</i> Xác suất để phát trúng đích là của người 1 là $\\dfrac{7}{31} \\approx 0.2258$ ($22,58\\%$).
                </td>
                <td class="col-score">1,0</td>
            </tr>

            <!-- Câu 2b -->
            <tr>
                <td rowspan="3"></td>
                <td class="col-sub"><b>b</b><br>(2,0đ)</td>
                <td class="col-content">
                    - Điều kiện để hàm $f(x)$ là hàm mật độ xác suất:
                    <br>1) $f(x) \\ge 0, \\forall x \\Rightarrow ax^4 \\ge 0 \\Leftrightarrow a \\ge 0$.
                    <br>2) $\\displaystyle\\int_{-\\infty}^{+\\infty} f(x)dx = 1$.
                    <br>Ta có:
                    $$\\int_{-\\infty}^{+\\infty} f(x)dx = \\int_0^2 ax^4dx = a \\left[ \\frac{x^5}{5} \\right]_0^2 = a \\cdot \\frac{32}{5} = \\frac{32}{5}a$$
                    Do đó: $\\dfrac{32}{5}a = 1 \\Leftrightarrow a = \\dfrac{5}{32}$ (thỏa mãn $a \\ge 0$).
                    <br>Vậy hàm mật độ: $f(x) = \\begin{cases} \\dfrac{5}{32}x^4 & \\text{khi } x \\in [0; 2] \\\\ 0 & \\text{khi } x \\notin [0; 2] \\end{cases}$
                </td>
                <td class="col-score">1,0</td>
            </tr>
            <tr>
                <td class="col-sub"></td>
                <td class="col-content">
                    - Xét bất phương trình $X^3 > X$:
                    $$X(X - 1)(X + 1) > 0$$
                    Vì biến ngẫu nhiên $X$ chỉ nhận giá trị trong $[0; 2]$, với $x \\in [0; 2]$ ta có $x \\ge 0$ và $x+1 > 0$.
                    <br>Do đó: $X(X-1)(X+1) > 0 \\Leftrightarrow X > 1$.
                    <br>Biến cố tương đương: $\\{1 < X \\le 2\\}$.
                </td>
                <td class="col-score">0,5</td>
            </tr>
            <tr>
                <td class="col-sub"></td>
                <td class="col-content">
                    - Xác suất cần tìm:
                    $$P(X^3 > X) = \\int_1^2 f(x)dx = \\int_1^2 \\frac{5}{32}x^4 dx = \\frac{5}{32} \\left[ \\frac{x^5}{5} \\right]_1^2$$
                    $$= \\frac{1}{32}(2^5 - 1^5) = \\frac{32 - 1}{32} = \\frac{31}{32} = 0.96875$$
                    <i>Kết luận:</i> $a = \\dfrac{5}{32}$ và $P(X^3 > X) = \\dfrac{31}{32} = 0.96875$.
                </td>
                <td class="col-score">0,5</td>
            </tr>

            <!-- Câu 2c -->
            <tr>
                <td class="col-q"></td>
                <td class="col-sub"><b>c</b><br>(2,0đ)</td>
                <td class="col-content">
                    <i>(Hoàn toàn giống Câu 2c Đề 01 và Đề 02)</i>:
                    <br>&bull; $P(A) = P(T)P(\\overline{K}|T) + P(H)P(\\overline{K}|H) = 0.97 \\times 0.02 + 0.03 \\times 0.95 = 0.0479$.
                    <br>&bull; $P(B) = P(H \\cap K) = P(H)P(K|H) = 0.03 \\times 0.05 = 0.0015$.
                </td>
                <td class="col-score">2,0</td>
            </tr>
        </tbody>
    </table>

    <!-- ==================== ĐỀ SỐ 04 ==================== -->
    <div class="page-break"></div>
    <div class="section-header">
        <h2 class="section-title">V. ĐÁP ÁN CHI TIẾT & BAREM ĐIỂM &bull; ĐỀ SỐ 04</h2>
        <span class="section-tag">Thời gian: 45 phút &bull; Tham chiếu: de5.png</span>
    </div>

    <!-- Đề bài gốc Đề 4 -->
    <div class="exam-problem-box">
        <div class="problem-title">NỘI DUNG ĐỀ THI SỐ 04 (NGUYÊN BẢN)</div>
        <div class="problem-content">
            <b>Câu 1:</b>
            <br>1) Có 3 máy cùng sản xuất một loại sản phẩm. Theo đánh giá tỉ lệ sản phẩm loại A của 3 máy là 60%; 75%; 80%. Khi giao xuống công ty do quên đánh dấu và 3 máy giống hệt nhau nên ta không thể phân biệt. Chọn ngẫu nhiên một máy sau đó cho máy sản xuất một sản phẩm.
            <ol type="a">
                <li>Tính xác suất sản phẩm loại A?</li>
                <li>Giả sử máy đã sản xuất được sản phẩm loại A. Tính xác suất sản xuất tiếp 100 sản phẩm nữa cũng từ máy này thì có từ 60 đến 90 sản phẩm loại A?</li>
            </ol>
            2) Từ các số $\{0; 1; 2; 3; 4; 5; 6\}$, lập ngẫu nhiên một số có 5 chữ số khác nhau, tính xác suất để số được lập ra có đúng 2 chữ số lẻ và 2 chữ số lẻ đó đứng cạnh nhau.
            <br><br>
            <b>Câu 2:</b>
            <ol type="a">
                <li>Ba xạ thủ cùng bắn mỗi người một phát vào một tấm bia. Xác suất bắn trúng một viên của mỗi người lần lượt là: 0,55; 0,7; 0,4. Biết rằng có đúng 2 phát trúng bia. Tính xác suất để có đúng một viên đạn trúng đích là của người 1.</li>
                <li>Cho hàm số:
                $$f(x, y) = \\begin{cases} ax^2 y & \\text{nếu } x, y \\in [0; 1] \\\\ 0 & \\text{nếu } x, y \\notin [0; 1] \\end{cases}$$
                Tìm $a$ để $f(x, y)$ là hàm mật độ đồng thời của biến ngẫu nhiên 2 chiều nào đó, tính hàm mật độ của $X$.</li>
                <li>Tỷ lệ phế phẩm của các sản phẩm do một dây chuyền sản xuất là 3%. Người ta đặt ở cuối dây chuyền một thiết bị kiểm tra chất lượng sản phẩm của nhà máy. Thiết bị này phát hiện chính phẩm với độ chính xác 98%, phát hiện phế phẩm với xác suất 95%. Sản phẩm tốt (theo kiểm định của thiết bị) được đưa vào kho; phế phẩm bị trả lại để sửa chữa. Gọi A là biến cố một sản phẩm bị trả lại, B là biến cố một sản phẩm hỏng được chấp nhận vào kho. Tính $P(A)$ và $P(B)$.</li>
            </ol>
        </div>
    </div>

    <!-- Bảng barem chấm điểm chi tiết Đề 4 -->
    <table class="grading-table">
        <thead>
            <tr>
                <th class="col-q">Câu</th>
                <th class="col-sub">Ý</th>
                <th class="col-content">Nội dung trình bày tự luận theo barem chuẩn</th>
                <th class="col-score">Điểm</th>
            </tr>
        </thead>
        <tbody>
            <!-- Câu 1.1a -->
            <tr>
                <td rowspan="4" class="col-q"><b>Câu 1</b><br>(4,0 điểm)</td>
                <td class="col-sub"><b>1.1a</b><br>(1,0đ)</td>
                <td class="col-content">
                    - Gọi $M_i$ là biến cố "Chọn được máy thứ $i$" ($i = 1, 2, 3$).
                    <br>Vì chọn ngẫu nhiên 1 trong 3 máy nên: $P(M_1) = P(M_2) = P(M_3) = \\dfrac{1}{3}$.
                    <br><b>Nhận xét:</b> $\\{M_1, M_2, M_3\\}$ là một hệ biến cố đầy đủ.
                    <br>- Gọi $A$ là biến cố: "Sản phẩm sản xuất ra là sản phẩm loại A".
                    <br>Tỉ lệ sản phẩm loại A của từng máy: $P(A|M_1) = 0.60; \\quad P(A|M_2) = 0.75; \\quad P(A|M_3) = 0.80$.
                </td>
                <td class="col-score">0,5</td>
            </tr>
            <tr>
                <td class="col-sub"></td>
                <td class="col-content">
                    - Áp dụng <b>công thức xác suất đầy đủ</b>:
                    $$P(A) = \\sum_{i=1}^3 P(M_i)P(A|M_i) = \\frac{1}{3}(0.60 + 0.75 + 0.80) = \\frac{1}{3} \\times 2.15 = \\frac{2.15}{3} = \\frac{43}{60} \\approx 0.7167$$
                    <i>Kết luận:</i> Xác suất sản phẩm sản xuất ra là loại A là $\\dfrac{43}{60} \\approx 0.7167$ ($71,67\\%$).
                </td>
                <td class="col-score">0,5</td>
            </tr>

            <!-- Câu 1.1b -->
            <tr>
                <td class="col-sub"><b>1.1b</b><br>(1,5đ)</td>
                <td class="col-content">
                    - Giả sử máy đã sản xuất được sản phẩm loại A. Theo <b>công thức Bayes</b>:
                    $$P(M_i|A) = \\frac{P(M_i)P(A|M_i)}{P(A)}$$
                    $$P(M_1|A) = \\frac{\\frac{1}{3} \\times 0.60}{\\frac{1}{3} \\times 2.15} = \\frac{0.60}{2.15} = \\frac{60}{215} = \\frac{12}{43}$$
                    $$P(M_2|A) = \\frac{\\frac{1}{3} \\times 0.75}{\\frac{1}{3} \\times 2.15} = \\frac{0.75}{2.15} = \\frac{75}{215} = \\frac{15}{43}$$
                    $$P(M_3|A) = \\frac{\\frac{1}{3} \\times 0.80}{\\frac{1}{3} \\times 2.15} = \\frac{0.80}{2.15} = \\frac{80}{215} = \\frac{16}{43}$$
                    - Cho máy đó sản xuất tiếp $n = 100$ sản phẩm. Gọi $Y$ là số sản phẩm loại A trong 100 sản phẩm.
                    <br>Áp dụng <b>công thức tích phân Moivre - Laplace</b>: $P(60 \\le Y \\le 90) \\approx \\Phi_0(x_2) - \\Phi_0(x_1)$.
                </td>
                <td class="col-score">0,75</td>
            </tr>
            <tr>
                <td class="col-sub"></td>
                <td class="col-content">
                    - Gọi $E$ là biến cố "Trong 100 sản phẩm tiếp theo có từ 60 đến 90 sản phẩm loại A":
                    <br>&bull; Với máy 1 ($p=0.60, q=0.40$): $np=60, \\sqrt{npq} = \\sqrt{24} \\approx 4.899$.
                    $$x_1 = \\frac{60-60}{4.899} = 0; \\quad x_2 = \\frac{90-60}{4.899} \\approx 6.12 \\Rightarrow P(E|M_1) \\approx \\Phi_0(6.12) - \\Phi_0(0) \\approx 0.5000$$
                    &bull; Với máy 2 ($p=0.75, q=0.25$): $np=75, \\sqrt{npq} = \\sqrt{18.75} \\approx 4.330$.
                    $$x_1 = \\frac{60-75}{4.330} \\approx -3.46; \\quad x_2 = \\frac{90-75}{4.330} \\approx 3.46$$
                    $$P(E|M_2) \\approx \\Phi_0(3.46) - \\Phi_0(-3.46) = 2\\Phi_0(3.46) \\approx 2 \\times 0.4997 = 0.9994$$
                    &bull; Với máy 3 ($p=0.80, q=0.20$): $np=80, \\sqrt{npq} = 4$.
                    $$x_1 = \\frac{60-80}{4} = -5.00; \\quad x_2 = \\frac{90-80}{4} = 2.50$$
                    $$P(E|M_3) \\approx \\Phi_0(2.50) - \\Phi_0(-5.00) = \\Phi_0(2.50) + \\Phi_0(5.00) \\approx 0.4938 + 0.5000 = 0.9938$$
                    - Theo công thức xác suất đầy đủ với điều kiện biến cố $A$:
                    $$P(E|A) = \\frac{12}{43}(0.5000) + \\frac{15}{43}(0.9994) + \\frac{16}{43}(0.9938)$$
                    $$P(E|A) = \\frac{6.0000 + 14.9910 + 15.9008}{43} = \\frac{36.8918}{43} \\approx 0.8579$$
                    <i>Kết luận:</i> Xác suất cần tìm xấp xỉ $0.8579$ (hay $85,79\\%$).
                </td>
                <td class="col-score">0,75</td>
            </tr>

            <!-- Câu 1.2 -->
            <tr>
                <td class="col-q"></td>
                <td class="col-sub"><b>1.2</b><br>(1,5đ)</td>
                <td class="col-content">
                    <i>(Hoàn toàn tương tự Câu 1c Đề 01)</i>:
                    <br>&bull; Không gian mẫu: $n(\\Omega) = 6 \\times A_6^4 = 2160$.
                    <br>&bull; Số thuận lợi: $n(E) = 144 + 324 = 468$.
                    <br>&bull; Xác suất: $P(E) = \\dfrac{468}{2160} = \\dfrac{13}{60} \\approx 0.2167$.
                </td>
                <td class="col-score">1,5</td>
            </tr>

            <!-- Câu 2a -->
            <tr>
                <td class="col-q"><b>Câu 2</b><br>(6,0 điểm)</td>
                <td class="col-sub"><b>a</b><br>(2,0đ)</td>
                <td class="col-content">
                    <i>(Hoàn toàn giống Câu 2a Đề 02)</i>:
                    <br>&bull; Xác suất trúng: $p_1 = 0.55, p_2 = 0.70, p_3 = 0.40$.
                    <br>&bull; Biến cố $B$ có đúng 2 phát trúng bia:
                    $$P(B) = 0.55 \\times 0.70 \\times 0.60 + 0.55 \\times 0.30 \\times 0.40 + 0.45 \\times 0.70 \\times 0.40 = 0.4230$$
                    &bull; Biến cố người 1 trúng đích trong số 2 phát trúng:
                    $$P(A_1 \\cap B) = 0.2310 + 0.0660 = 0.2970$$
                    &bull; Xác suất điều kiện: $P(A_1|B) = \\dfrac{0.2970}{0.4230} = \\dfrac{33}{47} \\approx 0.7021$.
                </td>
                <td class="col-score">2,0</td>
            </tr>

            <!-- Câu 2b -->
            <tr>
                <td rowspan="2"></td>
                <td class="col-sub"><b>b</b><br>(2,0đ)</td>
                <td class="col-content">
                    - Điều kiện để $f(x, y)$ là hàm mật độ đồng thời của biến ngẫu nhiên 2 chiều:
                    <br>1) $f(x, y) \\ge 0, \\forall x, y \\in [0; 1] \\Rightarrow a \\ge 0$.
                    <br>2) $\\displaystyle\\int_{-\\infty}^{+\\infty} \\int_{-\\infty}^{+\\infty} f(x, y)dxdy = 1$.
                    <br>Ta có:
                    $$\\int_0^1 \\int_0^1 ax^2 y dxdy = a \\left( \\int_0^1 x^2 dx \\right) \\left( \\int_0^1 y dy \\right) = a \\left[ \\frac{x^3}{3} \\right]_0^1 \\cdot \\left[ \\frac{y^2}{2} \\right]_0^1 = a \\cdot \\frac{1}{3} \\cdot \\frac{1}{2} = \\frac{a}{6}$$
                    Để là hàm mật độ thì $\\dfrac{a}{6} = 1 \\Leftrightarrow a = 6$ (thỏa mãn $a \\ge 0$).
                </td>
                <td class="col-score">1,0</td>
            </tr>
            <tr>
                <td class="col-sub"></td>
                <td class="col-content">
                    - Tìm hàm mật độ xác suất của $X$:
                    <br>Theo công thức hàm mật độ biên: $f_X(x) = \\displaystyle\\int_{-\\infty}^{+\\infty} f(x, y)dy$.
                    <br>&bull; Nếu $x \\notin [0; 1]$: $f_X(x) = 0$.
                    <br>&bull; Nếu $x \\in [0; 1]$:
                    $$f_X(x) = \\int_0^1 6x^2 y dy = 6x^2 \\left[ \\frac{y^2}{2} \\right]_0^1 = 6x^2 \\cdot \\frac{1}{2} = 3x^2$$
                    <i>Kết luận:</i> $a = 6$ và hàm mật độ biên của $X$ là:
                    $$f_X(x) = \\begin{cases} 3x^2 & \\text{nếu } x \\in [0; 1] \\\\ 0 & \\text{nếu } x \\notin [0; 1] \\end{cases}$$
                </td>
                <td class="col-score">1,0</td>
            </tr>

            <!-- Câu 2c -->
            <tr>
                <td class="col-q"></td>
                <td class="col-sub"><b>c</b><br>(2,0đ)</td>
                <td class="col-content">
                    <i>(Hoàn toàn giống Câu 2c Đề 01, 02, 03)</i>:
                    <br>&bull; $P(A) = 0.97 \\times 0.02 + 0.03 \\times 0.95 = 0.0479$.
                    <br>&bull; $P(B) = 0.03 \\times 0.05 = 0.0015$.
                </td>
                <td class="col-score">2,0</td>
            </tr>
        </tbody>
    </table>

    <!-- ==================== ĐỀ SỐ 05 (ĐỀ 7 AT13) ==================== -->
    <div class="page-break"></div>
    <div class="section-header">
        <h2 class="section-title">VI. ĐÁP ÁN CHI TIẾT & BAREM ĐIỂM &bull; ĐỀ SỐ 05 (LỚP AT13 - ĐỀ SỐ 7)</h2>
        <span class="section-tag">Thời gian: 45 phút &bull; Tham chiếu: de4.png</span>
    </div>

    <!-- Đề bài gốc Đề 5 -->
    <div class="exam-problem-box">
        <div class="problem-title">NỘI DUNG ĐỀ THI SỐ 05 (ĐỀ SỐ 7 - LỚP AT13 NGUYÊN BẢN)</div>
        <div class="problem-content">
            <b>Câu 1:</b> Một cơ quan có 3 chiếc xe ô tô. Khả năng sự cố của mỗi xe tương ứng là 5%; 20%; 10%. Tìm khả năng xảy ra các tình huống sau:
            <ol type="a">
                <li>Cả 3 xe ô tô cùng hoạt động tốt.</li>
                <li>Có không quá 2 xe bị sự cố.</li>
                <li>Có đúng một xe bị sự cố.</li>
            </ol>
            <b>Câu 2:</b> Ta có 10 hộp bi, trong đó 4 hộp loại I, mỗi hộp có 5 bi trắng và 3 bi đỏ; 3 hộp loại II, mỗi hộp có 5 bi trắng, 4 bi đỏ; 3 hộp loại III, mỗi hộp có 7 bi trắng, 3 bi đỏ.
            <ol type="a">
                <li>Rút hú họa ra một hộp, rồi từ đó lấy ngẫu nhiên ra một bi. Tìm xác suất để được bi trắng.</li>
                <li>Rút hú họa một hộp và từ đó lấy ra một bi, ta được bi đỏ. Tìm xác suất để viên bi đó rút ra từ hộp loại I.</li>
            </ol>
            <b>Câu 3:</b> Cho 2 biến ngẫu nhiên $X, Y$ độc lập với nhau và có bảng phân phối xác suất tương ứng là:
            <table style="width: 60%; border-collapse: collapse; margin: 8px 0; font-size: 12px; text-align: center;">
                <tr style="border: 1px solid #cbd5e0;"><th style="padding: 4px; border: 1px solid #cbd5e0; background: #edf2f7;">X</th><td style="padding: 4px; border: 1px solid #cbd5e0;">0</td><td style="padding: 4px; border: 1px solid #cbd5e0;">1</td><td style="padding: 4px; border: 1px solid #cbd5e0;">2</td><td style="padding: 4px; border: 1px solid #cbd5e0;">3</td></tr>
                <tr style="border: 1px solid #cbd5e0;"><th style="padding: 4px; border: 1px solid #cbd5e0; background: #edf2f7;">P</th><td style="padding: 4px; border: 1px solid #cbd5e0;">0,3</td><td style="padding: 4px; border: 1px solid #cbd5e0;">0,2</td><td style="padding: 4px; border: 1px solid #cbd5e0;">0,2</td><td style="padding: 4px; border: 1px solid #cbd5e0;">0,3</td></tr>
            </table>
            <table style="width: 50%; border-collapse: collapse; margin: 8px 0; font-size: 12px; text-align: center;">
                <tr style="border: 1px solid #cbd5e0;"><th style="padding: 4px; border: 1px solid #cbd5e0; background: #edf2f7;">Y</th><td style="padding: 4px; border: 1px solid #cbd5e0;">-1</td><td style="padding: 4px; border: 1px solid #cbd5e0;">0</td><td style="padding: 4px; border: 1px solid #cbd5e0;">1</td></tr>
                <tr style="border: 1px solid #cbd5e0;"><th style="padding: 4px; border: 1px solid #cbd5e0; background: #edf2f7;">P</th><td style="padding: 4px; border: 1px solid #cbd5e0;">0,25</td><td style="padding: 4px; border: 1px solid #cbd5e0;">0,4</td><td style="padding: 4px; border: 1px solid #cbd5e0;">0,35</td></tr>
            </table>
            <ol type="a">
                <li>Hãy tính kỳ vọng của biến ngẫu nhiên $X$ và $Y$.</li>
                <li>Lập bảng phân phối xác suất của biến ngẫu nhiên $X + Y$, $XY$.</li>
            </ol>
            <b>Câu 4:</b> Cho $X$ là đại lượng ngẫu nhiên liên tục với hàm mật độ:
            $$f(x) = \\begin{cases} \\dfrac{k}{\\sqrt{4 - x^2}} & -2 < x < 2 \\\\ 0 & \\text{nếu trái lại} \\end{cases}$$
            <ol type="a">
                <li>Tìm hằng số $k$.</li>
                <li>Tìm hàm phân bố của $X$.</li>
                <li>Tính $P\\{-1 \\le X \\le 1\\}$.</li>
            </ol>
        </div>
    </div>

    <!-- Bảng barem chấm điểm chi tiết Đề 5 -->
    <table class="grading-table">
        <thead>
            <tr>
                <th class="col-q">Câu</th>
                <th class="col-sub">Ý</th>
                <th class="col-content">Nội dung trình bày tự luận theo barem chuẩn</th>
                <th class="col-score">Điểm</th>
            </tr>
        </thead>
        <tbody>
            <!-- Câu 1 -->
            <tr>
                <td rowspan="3" class="col-q"><b>Câu 1</b><br>(2,0 điểm)</td>
                <td class="col-sub"><b>a</b><br>(0,75đ)</td>
                <td class="col-content">
                    - Gọi $A_i$ là biến cố "Chiếc xe thứ $i$ bị sự cố" ($i = 1, 2, 3$).
                    <br>Theo bài ra: $P(A_1) = 0.05; \\quad P(A_2) = 0.20; \\quad P(A_3) = 0.10$.
                    <br>$\\Rightarrow$ Khả năng xe hoạt động tốt:
                    <br>$P(\\overline{A_1}) = 1 - 0.05 = 0.95; \\quad P(\\overline{A_2}) = 1 - 0.20 = 0.80; \\quad P(\\overline{A_3}) = 1 - 0.10 = 0.90$.
                    <br><b>Nhận xét:</b> $A_1, A_2, A_3$ là các biến cố độc lập trong toàn thể.
                    <br>- Gọi $E_1$ là biến cố: "Cả 3 xe ô tô cùng hoạt động tốt".
                    <br>Ta có: $E_1 = \\overline{A_1}\\overline{A_2}\\overline{A_3}$.
                    <br>Theo quy tắc nhân biến cố độc lập:
                    $$P(E_1) = P(\\overline{A_1})P(\\overline{A_2})P(\\overline{A_3}) = 0.95 \\times 0.80 \\times 0.90 = 0.6840$$
                    <i>Kết luận:</i> Xác suất cả 3 xe cùng hoạt động tốt là $0.6840$ ($68,4\\%$).
                </td>
                <td class="col-score">0,75</td>
            </tr>
            <tr>
                <td class="col-sub"><b>b</b><br>(0,5đ)</td>
                <td class="col-content">
                    - Gọi $E_2$ là biến cố: "Có không quá 2 xe bị sự cố".
                    <br>Biến cố đối của $E_2$ là $\\overline{E_2}$: "Cả 3 xe đều bị sự cố", tức $\\overline{E_2} = A_1 A_2 A_3$.
                    <br>Theo công thức nhân xác suất:
                    $$P(\\overline{E_2}) = P(A_1)P(A_2)P(A_3) = 0.05 \\times 0.20 \\times 0.10 = 0.0010$$
                    - Xác suất biến cố $E_2$:
                    $$P(E_2) = 1 - P(\\overline{E_2}) = 1 - 0.0010 = 0.9990$$
                    <i>Kết luận:</i> Xác suất có không quá 2 xe bị sự cố là $0.9990$ ($99,9\\%$).
                </td>
                <td class="col-score">0,5</td>
            </tr>
            <tr>
                <td class="col-sub"><b>c</b><br>(0,75đ)</td>
                <td class="col-content">
                    - Gọi $E_3$ là biến cố: "Có đúng 1 xe bị sự cố".
                    <br>Biểu diễn $E_3$: $E_3 = A_1\\overline{A_2}\\overline{A_3} + \\overline{A_1}A_2\\overline{A_3} + \\overline{A_1}\\overline{A_2}A_3$.
                    <br>Vì các biến cố thành phần đôi một xung khắc:
                    $$P(E_3) = P(A_1)P(\\overline{A_2})P(\\overline{A_3}) + P(\\overline{A_1})P(A_2)P(\\overline{A_3}) + P(\\overline{A_1})P(\\overline{A_2})P(A_3)$$
                    $$P(E_3) = 0.05 \\times 0.80 \\times 0.90 + 0.95 \\times 0.20 \\times 0.90 + 0.95 \\times 0.80 \\times 0.10$$
                    $$P(E_3) = 0.0360 + 0.1710 + 0.0760 = 0.2830$$
                    <i>Kết luận:</i> Xác suất có đúng 1 xe bị sự cố là $0.2830$ ($28,3\\%$).
                </td>
                <td class="col-score">0,75</td>
            </tr>

            <!-- Câu 2 -->
            <tr>
                <td rowspan="2" class="col-q"><b>Câu 2</b><br>(2,5 điểm)</td>
                <td class="col-sub"><b>a</b><br>(1,5đ)</td>
                <td class="col-content">
                    - Có tổng số 10 hộp bi: 4 hộp loại I, 3 hộp loại II, 3 hộp loại III.
                    <br>Gọi $H_1, H_2, H_3$ lần lượt là biến cố rút được hộp loại I, II, III.
                    <br>$$P(H_1) = \\frac{4}{10} = 0.4; \\quad P(H_2) = \\frac{3}{10} = 0.3; \\quad P(H_3) = \\frac{3}{10} = 0.3$$
                    <b>Nhận xét:</b> $\\{H_1, H_2, H_3\\}$ là một hệ biến cố đầy đủ.
                    <br>- Gọi $T$ là biến cố: "Lấy ra được viên bi màu trắng".
                    <br>&bull; Hộp loại I (5 trắng, 3 đỏ, tổng 8 bi): $P(T|H_1) = \\dfrac{5}{8}$.
                    <br>&bull; Hộp loại II (5 trắng, 4 đỏ, tổng 9 bi): $P(T|H_2) = \\dfrac{5}{9}$.
                    <br>&bull; Hộp loại III (7 trắng, 3 đỏ, tổng 10 bi): $P(T|H_3) = \\dfrac{7}{10}$.
                    <br>- Theo <b>công thức xác suất đầy đủ</b>:
                    $$P(T) = P(H_1)P(T|H_1) + P(H_2)P(T|H_2) + P(H_3)P(T|H_3)$$
                    $$P(T) = \\frac{4}{10} \\times \\frac{5}{8} + \\frac{3}{10} \\times \\frac{5}{9} + \\frac{3}{10} \\times \\frac{7}{10} = \\frac{1}{4} + \\frac{1}{6} + \\frac{21}{100} = \\frac{75 + 50 + 63}{300} = \\frac{188}{300} = \\frac{47}{75} \\approx 0.6267$$
                    <i>Kết luận:</i> Xác suất lấy được bi trắng là $\\dfrac{47}{75} \\approx 0.6267$ ($62,67\\%$).
                </td>
                <td class="col-score">1,5</td>
            </tr>
            <tr>
                <td class="col-sub"><b>b</b><br>(1,0đ)</td>
                <td class="col-content">
                    - Gọi $D$ là biến cố lấy ra được viên bi màu đỏ. Vì bi lấy ra chỉ có thể trắng hoặc đỏ nên $D = \\overline{T}$.
                    $$P(D) = 1 - P(T) = 1 - \\frac{47}{75} = \\frac{28}{75} \\approx 0.3733$$
                    <i>(Hoặc tính theo công thức xác suất đầy đủ: $P(D) = 0.4 \\times \\frac{3}{8} + 0.3 \\times \\frac{4}{9} + 0.3 \\times \\frac{3}{10} = 0.15 + \\frac{2}{15} + 0.09 = \\frac{28}{75}$)</i>.
                    <br>- Biết bi lấy ra là bi đỏ, xác suất viên bi đó rút từ hộp loại I theo <b>công thức Bayes</b>:
                    $$P(H_1|D) = \\frac{P(H_1)P(D|H_1)}{P(D)} = \\frac{\\frac{4}{10} \\times \\frac{3}{8}}{\\frac{28}{75}} = \\frac{\\frac{3}{20}}{\\frac{28}{75}} = \\frac{3}{20} \\times \\frac{75}{28} = \\frac{3 \\times 15}{4 \\times 28} = \\frac{45}{112} \\approx 0.4018$$
                    <i>Kết luận:</i> Xác suất viên bi đỏ rút ra từ hộp loại I là $\\dfrac{45}{112} \\approx 0.4018$ ($40,18\\%$).
                </td>
                <td class="col-score">1,0</td>
            </tr>

            <!-- Câu 3 -->
            <tr>
                <td rowspan="3" class="col-q"><b>Câu 3</b><br>(2,5 điểm)</td>
                <td class="col-sub"><b>a</b><br>(1,0đ)</td>
                <td class="col-content">
                    - Tính kỳ vọng của biến ngẫu nhiên rời rạc $X$:
                    $$E(X) = \\sum x_i p_i = 0 \\times 0.3 + 1 \\times 0.2 + 2 \\times 0.2 + 3 \\times 0.3$$
                    $$E(X) = 0 + 0.2 + 0.4 + 0.9 = 1.5$$
                    - Tính kỳ vọng của biến ngẫu nhiên rời rạc $Y$:
                    $$E(Y) = \\sum y_j q_j = (-1) \\times 0.25 + 0 \\times 0.4 + 1 \\times 0.35$$
                    $$E(Y) = -0.25 + 0 + 0.35 = 0.1$$
                    <i>Kết luận:</i> $E(X) = 1.5$ và $E(Y) = 0.1$.
                </td>
                <td class="col-score">1,0</td>
            </tr>
            <tr>
                <td class="col-sub"><b>b1</b><br>(0,75đ)</td>
                <td class="col-content">
                    - <b>Bảng phân phối xác suất của biến ngẫu nhiên $S = X + Y$:</b>
                    <br>Do $X, Y$ độc lập nên $P(X = x, Y = y) = P(X = x) \\times P(Y = y)$.
                    <br>Tập các giá trị có thể có của $X + Y$ là: $\\{-1, 0, 1, 2, 3, 4\\}$.
                    <br>&bull; $P(X+Y = -1) = P(X=0, Y=-1) = 0.3 \\times 0.25 = 0.075$.
                    <br>&bull; $P(X+Y = 0) = P(X=0, Y=0) + P(X=1, Y=-1) = 0.3 \\times 0.4 + 0.2 \\times 0.25 = 0.12 + 0.05 = 0.170$.
                    <br>&bull; $P(X+Y = 1) = P(X=0, Y=1) + P(X=1, Y=0) + P(X=2, Y=-1) = 0.3 \\times 0.35 + 0.2 \\times 0.4 + 0.2 \\times 0.25 = 0.105 + 0.08 + 0.05 = 0.235$.
                    <br>&bull; $P(X+Y = 2) = P(X=1, Y=1) + P(X=2, Y=0) + P(X=3, Y=-1) = 0.2 \\times 0.35 + 0.2 \\times 0.4 + 0.3 \\times 0.25 = 0.07 + 0.08 + 0.075 = 0.225$.
                    <br>&bull; $P(X+Y = 3) = P(X=2, Y=1) + P(X=3, Y=0) = 0.2 \\times 0.35 + 0.3 \\times 0.4 = 0.07 + 0.12 = 0.190$.
                    <br>&bull; $P(X+Y = 4) = P(X=3, Y=1) = 0.3 \\times 0.35 = 0.105$.
                    <br><b>Bảng phân phối xác suất của $X + Y$:</b>
                    <table style="width: 100%; border-collapse: collapse; margin-top: 5px; text-align: center;">
                        <tr style="border: 1px solid #cbd5e0;"><th style="padding: 4px; border: 1px solid #cbd5e0; background: #edf2f7;">X + Y</th><td>-1</td><td>0</td><td>1</td><td>2</td><td>3</td><td>4</td></tr>
                        <tr style="border: 1px solid #cbd5e0;"><th style="padding: 4px; border: 1px solid #cbd5e0; background: #edf2f7;">P</th><td>0,075</td><td>0,170</td><td>0,235</td><td>0,225</td><td>0,190</td><td>0,105</td></tr>
                    </table>
                </td>
                <td class="col-score">0,75</td>
            </tr>
            <tr>
                <td class="col-sub"><b>b2</b><br>(0,75đ)</td>
                <td class="col-content">
                    - <b>Bảng phân phối xác suất của biến ngẫu nhiên $Z = XY$:</b>
                    <br>Tập các giá trị có thể có của $XY$ là: $\\{-3, -2, -1, 0, 1, 2, 3\\}$.
                    <br>&bull; $P(XY = -3) = P(X=3, Y=-1) = 0.3 \\times 0.25 = 0.075$.
                    <br>&bull; $P(XY = -2) = P(X=2, Y=-1) = 0.2 \\times 0.25 = 0.050$.
                    <br>&bull; $P(XY = -1) = P(X=1, Y=-1) = 0.2 \\times 0.25 = 0.050$.
                    <br>&bull; $P(XY = 0) = P(X=0) + P(Y=0) - P(X=0, Y=0) = 0.3 + 0.4 - (0.3 \\times 0.4) = 0.7 - 0.12 = 0.580$.
                    <br>&bull; $P(XY = 1) = P(X=1, Y=1) = 0.2 \\times 0.35 = 0.070$.
                    <br>&bull; $P(XY = 2) = P(X=2, Y=1) = 0.2 \\times 0.35 = 0.070$.
                    <br>&bull; $P(XY = 3) = P(X=3, Y=1) = 0.3 \\times 0.35 = 0.105$.
                    <br><i>(Kiểm tra tổng: $0.075 + 0.050 + 0.050 + 0.580 + 0.070 + 0.070 + 0.105 = 1.000$)</i>.
                    <br><b>Bảng phân phối xác suất của $XY$:</b>
                    <table style="width: 100%; border-collapse: collapse; margin-top: 5px; text-align: center;">
                        <tr style="border: 1px solid #cbd5e0;"><th style="padding: 4px; border: 1px solid #cbd5e0; background: #edf2f7;">XY</th><td>-3</td><td>-2</td><td>-1</td><td>0</td><td>1</td><td>2</td><td>3</td></tr>
                        <tr style="border: 1px solid #cbd5e0;"><th style="padding: 4px; border: 1px solid #cbd5e0; background: #edf2f7;">P</th><td>0,075</td><td>0,050</td><td>0,050</td><td>0,580</td><td>0,070</td><td>0,070</td><td>0,105</td></tr>
                    </table>
                </td>
                <td class="col-score">0,75</td>
            </tr>

            <!-- Câu 4 -->
            <tr>
                <td rowspan="3" class="col-q"><b>Câu 4</b><br>(3,0 điểm)</td>
                <td class="col-sub"><b>a</b><br>(1,0đ)</td>
                <td class="col-content">
                    - Điều kiện để hàm $f(x)$ là hàm mật độ xác suất:
                    <br>1) $f(x) \\ge 0, \\forall x \\in (-2; 2) \\Rightarrow k \\ge 0$.
                    <br>2) $\\displaystyle\\int_{-\\infty}^{+\\infty} f(x)dx = 1$.
                    <br>Ta có:
                    $$\\int_{-\\infty}^{+\\infty} f(x)dx = \\int_{-2}^2 \\frac{k}{\\sqrt{4 - x^2}}dx$$
                    Đặt $x = 2\\sin t \\Rightarrow dx = 2\\cos t dt$. Đổi cận: $x = -2 \\Rightarrow t = -\\dfrac{\\pi}{2}$; $x = 2 \\Rightarrow t = \\dfrac{\\pi}{2}$.
                    $$= k \\left[ \\arcsin\\left(\\frac{x}{2}\\right) \\right]_{-2}^2 = k \\left( \\arcsin(1) - \\arcsin(-1) \\right) = k \\left( \\frac{\\pi}{2} - \\left(-\\frac{\\pi}{2}\\right) \\right) = k\\pi$$
                    Do đó: $k\\pi = 1 \\Leftrightarrow k = \\dfrac{1}{\\pi}$ (thỏa mãn $k \\ge 0$).
                </td>
                <td class="col-score">1,0</td>
            </tr>
            <tr>
                <td class="col-sub"><b>b</b><br>(1,0đ)</td>
                <td class="col-content">
                    - Tìm hàm phân bố xác suất $F(x) = P(X < x) = \\displaystyle\\int_{-\\infty}^x f(t)dt$:
                    <br>&bull; Nếu $x \\le -2$: $f(t) = 0 \\Rightarrow F(x) = 0$.
                    <br>&bull; Nếu $-2 < x < 2$:
                    $$F(x) = \\int_{-2}^x \\frac{1}{\\pi\\sqrt{4 - t^2}}dt = \\frac{1}{\\pi} \\left[ \\arcsin\\left(\\frac{t}{2}\\right) \\right]_{-2}^x = \\frac{1}{\\pi} \\left( \\arcsin\\left(\\frac{x}{2}\\right) - \\arcsin(-1) \\right)$$
                    $$= \\frac{1}{\\pi} \\left( \\arcsin\\left(\\frac{x}{2}\\right) + \\frac{\\pi}{2} \\right) = \\frac{1}{2} + \\frac{1}{\\pi}\\arcsin\\left(\\frac{x}{2}\\right)$$
                    &bull; Nếu $x \\ge 2$: $F(x) = 1$.
                    <br><i>Kết luận:</i>
                    $$F(x) = \\begin{cases} 0 & \\text{khi } x \\le -2 \\\\ \\dfrac{1}{2} + \\dfrac{1}{\\pi}\\arcsin\\left(\\dfrac{x}{2}\\right) & \\text{khi } -2 < x < 2 \\\\ 1 & \\text{khi } x \\ge 2 \\end{cases}$$
                </td>
                <td class="col-score">1,0</td>
            </tr>
            <tr>
                <td class="col-sub"><b>c</b><br>(1,0đ)</td>
                <td class="col-content">
                    - Tính xác suất $P(-1 \\le X \\le 1)$:
                    <br>Áp dụng công thức liên hệ giữa xác suất và hàm phân bố:
                    $$P(-1 \\le X \\le 1) = F(1) - F(-1)$$
                    Thay giá trị $x = 1$ và $x = -1$ vào hàm $F(x)$:
                    $$F(1) = \\frac{1}{2} + \\frac{1}{\\pi}\\arcsin\\left(\\frac{1}{2}\\right) = \\frac{1}{2} + \\frac{1}{\\pi} \\cdot \\frac{\\pi}{6} = \\frac{1}{2} + \\frac{1}{6} = \\frac{2}{3}$$
                    $$F(-1) = \\frac{1}{2} + \\frac{1}{\\pi}\\arcsin\\left(-\\frac{1}{2}\\right) = \\frac{1}{2} - \\frac{1}{6} = \\frac{1}{3}$$
                    Do đó:
                    $$P(-1 \\le X \\le 1) = \\frac{2}{3} - \\frac{1}{3} = \\frac{1}{3} \\approx 0.3333$$
                    <i>(Hoặc tính tích phân trực tiếp: $\\int_{-1}^1 \\frac{1}{\\pi\\sqrt{4-x^2}}dx = \\frac{1}{\\pi}\\left[\\arcsin(1/2) - \\arcsin(-1/2)\\right] = \\frac{1}{\\pi}\\cdot\\frac{\\pi}{3} = \\frac{1}{3}$).</i>
                    <br><i>Kết luận:</i> $P(-1 \\le X \\le 1) = \\dfrac{1}{3}$.
                </td>
                <td class="col-score">1,0</td>
            </tr>
        </tbody>
    </table>

</body>
</html>
"""

# Ghi file HTML ra disk
html_file_path = os.path.abspath("generate_pdf/exam_solutions.html")
with open(html_file_path, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"HTML saved to: {html_file_path}")

pdf_output_path = os.path.abspath("GIAI_DE_KIEM_TRA_XAC_SUAT.pdf")
print(f"Rendering PDF to: {pdf_output_path}...")

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto(f"file://{html_file_path}", wait_until="networkidle")
    # Wait for KaTeX rendering
    page.wait_for_timeout(2000)
    page.evaluate("() => document.fonts.ready")
    
    page.pdf(
        path=pdf_output_path,
        format="A4",
        margin={
            "top": "12mm",
            "bottom": "14mm",
            "left": "12mm",
            "right": "12mm"
        },
        print_background=True,
        display_header_footer=True,
        header_template='<div style="font-size: 8px; width: 100%; text-align: right; padding-right: 15mm; color: #a0aec0; font-family: sans-serif;">HỌC VIỆN KỸ THUẬT MẬT MÃ &bull; BỘ ĐỀ KIỂM TRA XÁC SUẤT THỐNG KÊ</div>',
        footer_template='<div style="font-size: 8.5px; width: 100%; text-align: center; color: #718096; font-family: sans-serif;">Đáp án tự luận chuẩn &bull; Trang <span class="pageNumber"></span> / <span class="totalPages"></span></div>'
    )
    browser.close()

print(f"PDF successfully generated at: {pdf_output_path}")
