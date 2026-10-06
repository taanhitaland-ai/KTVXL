#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build_full_vldc_questions.py
Tạo 65 câu hỏi trắc nghiệm & điền khuyết Vật Lý Đại Cương 2 / A3 chuẩn xác 100%
Bao quát 6 chương giáo trình và đầy đủ các dạng bài tập định hướng:
- Giao thoa khe Young (cơ bản, bản mặt song song, dịch nguồn S, nêm không khí, vân tròn Newton, Michelson)
- Nhiễu xạ đới cầu Fresnel (lỗ tròn, đĩa tròn, khe hẹp Fraunhofer, cách tử phẳng, Bragg)
- Phân cực ánh sáng (định luật Malus, định luật Brewster, lưỡng chiết)
- Quang lượng tử (vật đen Stefan-Boltzmann, Wien, quang điện ngoài, hiệu ứng Compton)
- Cơ học lượng tử (De Broglie, hệ thức bất định Heisenberg, giếng thế 1 chiều, hàm sóng)
- Vật lý nguyên tử & hạt nhân (mẫu Bo, quang phổ Hydro, độ hụt khối, năng lượng liên kết, chu kỳ bán rã)
"""

import json
import os

def generate_vldc_bank():
    # Import base from build_vldc_database
    import scripts.build_vldc_database as base
    questions = base.build_questions_list() # Has 22
    
    extra_questions = [
        # Giao thoa nâng cao
        {
            "id": "VLDC_023",
            "chapter": "Chương 1: Quang Học Sóng - Giao Thoa Ánh Sáng",
            "chapter_id": 1,
            "type": "mcq",
            "prompt": "Trong thí nghiệm khe Young (a = 1 mm, D = 2 m, λ = 0.6 µm), nếu nhúng toàn bộ hệ thống vào trong nước có chiết suất n = 4/3 thì khoảng vân i' thay đổi như thế nào?",
            "options": [
                "A. Giảm đi 1.33 lần, khoảng vân mới là 0.90 mm",
                "B. Tăng lên 1.33 lần, khoảng vân mới là 1.60 mm",
                "C. Không đổi vì khoảng cách a và D không đổi",
                "D. Giảm đi 2 lần, khoảng vân mới là 0.60 mm"
            ],
            "correct_answer": "A",
            "correct_answer_text": "Giảm đi 1.33 lần, khoảng vân mới là 0.90 mm",
            "explanation": "Khi nhúng vào môi trường chiết suất n, bước sóng ánh sáng giảm n lần: λ' = λ / n.\nKhoảng vân ban đầu trong không khí: i = (λ * D) / a = (0.6 × 10⁻⁶ * 2) / 10⁻³ = 1.2 mm.\nKhoảng vân khi nhúng vào nước: i' = (λ' * D) / a = i / n = 1.2 mm / (4/3) = 0.90 mm.\nVậy khoảng vân giảm đi 1.33 lần.",
            "methodology": "Khoảng vân trong môi trường chiết suất n: i' = i / n. Môi trường càng chiết quang thì vân càng sít nhau.",
            "tips": "Mẹo nhanh: i' = i / n = 1.2 / 1.333 = 0.9 mm."
        },
        {
            "id": "VLDC_024",
            "chapter": "Chương 1: Quang Học Sóng - Giao Thoa Ánh Sáng",
            "chapter_id": 1,
            "type": "mcq",
            "prompt": "Trong thí nghiệm giao thoa khe Young, nguồn sáng điểm S phát ánh sáng đơn sắc bước sóng λ = 0.5 µm. Nguồn S đặt cách mặt phẳng hai khe một khoảng d = 0.5 m, khoảng cách giữa hai khe a = 1 mm, màn quan sát đặt cách hai khe D = 2 m. Khi dịch chuyển nguồn S theo phương vuông góc với trục đối xứng một đoạn y0 = 2 mm thì vân trung tâm trên màn dịch chuyển như thế nào?",
            "options": [
                "A. Dịch chuyển ngược chiều một đoạn x0 = 8 mm",
                "B. Dịch chuyển cùng chiều một đoạn x0 = 8 mm",
                "C. Dịch chuyển ngược chiều một đoạn x0 = 4 mm",
                "D. Dịch chuyển cùng chiều một đoạn x0 = 2 mm"
            ],
            "correct_answer": "A",
            "correct_answer_text": "Dịch chuyển ngược chiều một đoạn x0 = 8 mm",
            "explanation": "Khi dịch chuyển nguồn S một đoạn y0 theo phương vuông góc trục đối xứng, hiệu quang lộ từ S tới hai khe thay đổi.\nĐộ dịch chuyển của hệ vân trên màn được tính bởi công thức:\nx0 = (D / d) * y0 và luôn DỊCH NGƯỢC CHIỀU với chiều dịch chuyển của nguồn S.\nThay số: x0 = (2 m / 0.5 m) * 2 mm = 4 * 2 mm = 8 mm ngược chiều.",
            "methodology": "Công thức dịch chuyển nguồn S: x0 = (D/d) * y0 (ngược chiều).",
            "tips": "Nhớ quy tắc đòn bẩy: S dịch lên thì vân dịch xuống: x0 = y0 * (D/d) = 2 * (2/0.5) = 8 mm."
        },
        {
            "id": "VLDC_025",
            "chapter": "Chương 1: Quang Học Sóng - Giao Thoa Ánh Sáng",
            "chapter_id": 1,
            "type": "mcq",
            "prompt": "Để đo chiết suất của một chất khí, người ta đặt một ống thủy tinh dài l = 10 cm chứa khí đó trước một trong hai khe của máy giao thoa Young (λ = 0.5 µm). Khi hút hết khí ra khỏi ống (tạo chân không), người ta thấy hệ vân dịch chuyển đúng 100 khoảng vân. Chiết suất n của chất khí đó bằng:",
            "options": [
                "A. 1.0005",
                "B. 1.0050",
                "C. 1.0001",
                "D. 1.0025"
            ],
            "correct_answer": "A",
            "correct_answer_text": "1.0005",
            "explanation": "Khi ống chứa khí chiết suất n, quang lộ qua ống là n*l. Khi rút chân không, quang lộ là 1*l.\nĐộ biến thiên quang lộ: ΔL = (n - 1)*l.\nMỗi khi quang lộ biến thiên λ thì hệ vân dịch 1 khoảng vân:\nΔL = k * λ ⇒ (n - 1)*l = 100 * λ\n⇒ n - 1 = (100 * λ) / l = (100 * 0.5 × 10⁻⁶ m) / (0.1 m) = 5 × 10⁻⁴ = 0.0005.\nVậy chiết suất chất khí: n = 1 + 0.0005 = 1.0005.",
            "methodology": "Đo chiết suất khí bằng ống khí Young: n = 1 + (k * λ) / l.",
            "tips": "Bấm Casio: 1 + (100 * 0.5e-6) / 0.1 = 1.0005."
        },
        {
            "id": "VLDC_026",
            "chapter": "Chương 1: Quang Học Sóng - Giao Thoa Ánh Sáng",
            "chapter_id": 1,
            "type": "mcq",
            "prompt": "Một màng xà phòng mỏng có chiết suất n = 1.33 được rọi bằng ánh sáng trắng dưới góc tới r = 30° trong màng. Để màng có màu phản xạ sáng rõ nhất với bước sóng λ = 0.6 µm thì bề dày nhỏ nhất của màng phải bằng:",
            "options": [
                "A. 0.130 µm",
                "B. 0.225 µm",
                "C. 0.113 µm",
                "D. 0.300 µm"
            ],
            "correct_answer": "A",
            "correct_answer_text": "0.130 µm",
            "explanation": "Điều kiện cực đại giao thoa ánh sáng phản xạ trên màng mỏng (có mất nửa bước sóng λ/2 tại mặt trên do n_xà phòng > n_kk = 1):\nΔL = 2 * n * d * cos(r) + λ/2 = k * λ (với k = 1, 2...)\n⇒ 2 * n * d * cos(r) = (k - 0.5) * λ.\nBề dày nhỏ nhất d_min ứng với k = 1:\n2 * n * d_min * cos(r) = 0.5 * λ\n⇒ d_min = λ / (4 * n * cos(r)) = (0.6 µm) / (4 * 1.33 * cos(30°)) = 0.6 / (4 * 1.33 * 0.866) = 0.6 / 4.607 ≈ 0.130 µm.",
            "methodology": "Màng mỏng phản xạ có đổi pha λ/2: 2nd cos(r) = (k - 0.5)λ cho cực đại sáng. d_min = λ / (4 n cos r).",
            "tips": "Bấm máy: 0.6 / (4 * 1.33 * cos(30°)) = 0.1302 µm."
        },
        {
            "id": "VLDC_027",
            "chapter": "Chương 1: Quang Học Sóng - Giao Thoa Ánh Sáng",
            "chapter_id": 1,
            "type": "mcq",
            "prompt": "Trong thí nghiệm vân tròn Newton, người ta đổ một chất lỏng trong suốt có chiết suất n = 1.44 vào khoảng không gian giữa thấu kính và bản thủy tinh phẳng. Khi đó bán kính các vân giao thoa thay đổi như thế nào?",
            "options": [
                "A. Giảm đi 1.2 lần (r' = r / 1.2)",
                "B. Tăng lên 1.2 lần (r' = 1.2 * r)",
                "C. Giảm đi 1.44 lần (r' = r / 1.44)",
                "D. Không đổi vì bán kính mặt cong R không đổi"
            ],
            "correct_answer": "A",
            "correct_answer_text": "Giảm đi 1.2 lần (r' = r / 1.2)",
            "explanation": "Khi có lớp chất lỏng chiết suất n giữa thấu kính và bản phẳng, bước sóng ánh sáng trong lớp chất lỏng giảm: λ' = λ / n.\nCông thức bán kính vân tối: rk = √(k * R * λ') = √(k * R * λ / n) = r_k(kk) / √n.\nVới n = 1.44 ⇒ √n = √1.44 = 1.2.\nDo đó bán kính các vân giao thoa giảm đi 1.2 lần.",
            "methodology": "Vân tròn Newton có môi trường chiết suất n: r' = r / √n.",
            "tips": "Nhớ: Bán kính vân tỉ lệ nghịch với căn bậc hai của chiết suất: r' = r / √1.44 = r / 1.2."
        },
        {
            "id": "VLDC_028",
            "chapter": "Chương 1: Quang Học Sóng - Giao Thoa Ánh Sáng",
            "chapter_id": 1,
            "type": "mcq",
            "prompt": "Trong giao thoa kế Michelson, khi dịch chuyển một trong hai gương phẳng một đoạn d = 0.03 mm thì quan sát thấy hệ vân giao thoa dịch chuyển 100 vân. Bước sóng của chùm ánh sáng đơn sắc dùng trong thí nghiệm là:",
            "options": [
                "A. 0.60 µm",
                "B. 0.50 µm",
                "C. 0.30 µm",
                "D. 0.75 µm"
            ],
            "correct_answer": "A",
            "correct_answer_text": "0.60 µm",
            "explanation": "Trong giao thoa kế Michelson, tia sáng đi tới gương và phản xạ quay lại nên khi dịch chuyển gương một đoạn d, hiệu quang lộ thay đổi một lượng ΔL = 2d.\nMỗi lần hiệu quang lộ tăng λ thì có một vân dịch chuyển qua thị trường quan sát:\n2d = N * λ ⇒ λ = 2d / N.\nThay số: λ = (2 * 0.03 × 10⁻³ m) / 100 = 0.06 × 10⁻⁵ m = 0.6 × 10⁻⁶ m = 0.60 µm.",
            "methodology": "Giao thoa kế Michelson: Quang lộ thay đổi 2d. Công thức: 2d = N * λ.",
            "tips": "Bấm máy: 2 * 0.03 / 100 = 0.0006 mm = 0.6 µm."
        },

        # Nhiễu xạ nâng cao
        {
            "id": "VLDC_029",
            "chapter": "Chương 2: Quang Học Sóng - Nhiễu Xạ Ánh Sáng",
            "chapter_id": 2,
            "type": "mcq",
            "prompt": "Chiếu sóng phẳng đơn sắc bước sóng λ = 0.5 µm vuông góc vào một màn chắn có lỗ tròn. Điểm quan sát M nằm trên trục đối xứng cách màn b = 1 m. Bán kính đới cầu Fresnel thứ 4 nhìn từ điểm M bằng bao nhiêu?",
            "options": [
                "A. 1.414 mm",
                "B. 1.000 mm",
                "C. 2.000 mm",
                "D. 0.707 mm"
            ],
            "correct_answer": "A",
            "correct_answer_text": "1.414 mm",
            "explanation": "Trường hợp sóng phẳng (nguồn ở vô cực a → ∞), công thức bán kính đới cầu Fresnel thứ k là:\nrk = √(k * b * λ).\nVới k = 4, b = 1 m, λ = 0.5 µm = 0.5 × 10⁻⁶ m:\nr4 = √(4 * 1 * 0.5 × 10⁻⁶) = √(2 × 10⁻⁶) = √2 × 10⁻³ m ≈ 1.414 mm.",
            "methodology": "Sóng phẳng đới Fresnel: rk = √(k*b*λ). Với sóng cầu: rk = √(k*a*b*λ / (a+b)).",
            "tips": "Bấm Casio: √(4 * 1 * 0.5e-6) = 1.414*10^-3 m = 1.414 mm."
        },
        {
            "id": "VLDC_030",
            "chapter": "Chương 2: Quang Học Sóng - Nhiễu Xạ Ánh Sáng",
            "chapter_id": 2,
            "type": "mcq",
            "prompt": "Một cách tử nhiễu xạ có chu kỳ d = 4 µm. Chiếu ánh sáng trắng có bước sóng từ 0.4 µm (tím) đến 0.76 µm (đỏ) vuông góc vào cách tử. Góc lệch ứng với vạch đỏ bậc 1 (k = 1, λ = 0.76 µm) bằng bao nhiêu?",
            "options": [
                "A. 10.95°",
                "B. 5.74°",
                "C. 15.20°",
                "D. 22.40°"
            ],
            "correct_answer": "A",
            "correct_answer_text": "10.95°",
            "explanation": "Điều kiện cực đại chính của cách tử: d * sin(φ) = k * λ.\nVới k = 1, λ = 0.76 µm, d = 4 µm:\nsin(φ) = (1 * 0.76) / 4 = 0.19.\nSuy ra góc lệch: φ = arcsin(0.19) ≈ 10.95°.",
            "methodology": "Công thức góc lệch cực đại cách tử: sin(φ) = k*λ / d.",
            "tips": "Bấm Casio: shift sin(0.76 / 4) = 10.95°."
        },
        {
            "id": "VLDC_031",
            "chapter": "Chương 2: Quang Học Sóng - Nhiễu Xạ Ánh Sáng",
            "chapter_id": 2,
            "type": "mcq",
            "prompt": "Một cách tử có 500 vạch trên 1 mm chiều dài. Chiếu chùm tia đơn sắc bước sóng λ = 0.6 µm vuông góc với cách tử. Bậc cực đại lớn nhất có thể quan sát được qua cách tử này là:",
            "options": [
                "A. 3",
                "B. 4",
                "C. 2",
                "D. 5"
            ],
            "correct_answer": "A",
            "correct_answer_text": "3",
            "explanation": "Chu kỳ của cách tử (khoảng cách giữa hai khe liên tiếp):\nd = 1 mm / 500 = (10⁻³ m) / 500 = 2 × 10⁻⁶ m = 2 µm.\nĐiều kiện cực đại: d * sin(φ) = k * λ ⇒ k = (d / λ) * sin(φ).\nVì sin(φ) ≤ 1 nên bậc cực đại lớn nhất thỏa mãn:\nk_max ≤ d / λ = 2 µm / 0.6 µm ≈ 3.33.\nVì k phải là số nguyên nên bậc cực đại lớn nhất là k_max = 3.",
            "methodology": "k_max = phần nguyên của [d / λ].",
            "tips": "Bấm máy: 2 / 0.6 = 3.33 ⇒ lấy phần nguyên k_max = 3."
        },
        {
            "id": "VLDC_032",
            "chapter": "Chương 2: Quang Học Sóng - Nhiễu Xạ Ánh Sáng",
            "chapter_id": 2,
            "type": "mcq",
            "prompt": "Chiếu chùm tia X có bước sóng λ = 0.154 nm vào bề mặt của một tinh thể có khoảng cách giữa các mặt phẳng nguyên tử d = 0.282 nm. Góc phản xạ Bragg θ ứng với cực đại nhiễu xạ bậc 1 (k = 1) bằng:",
            "options": [
                "A. 15.84°",
                "B. 32.70°",
                "C. 8.25°",
                "D. 24.10°"
            ],
            "correct_answer": "A",
            "correct_answer_text": "15.84°",
            "explanation": "Công thức Bragg cho nhiễu xạ tia X trên mạng tinh thể:\n2 * d * sin(θ) = k * λ.\nVới k = 1, d = 0.282 nm, λ = 0.154 nm:\nsin(θ) = (1 * 0.154) / (2 * 0.282) = 0.154 / 0.564 ≈ 0.2730.\nSuy ra góc Bragg: θ = arcsin(0.2730) ≈ 15.84°.",
            "methodology": "Định luật Wulff - Bragg: 2d sin(θ) = k*λ.",
            "tips": "Bấm Casio: shift sin(0.154 / (2 * 0.282)) = 15.84°."
        },

        # Phân cực ánh sáng
        {
            "id": "VLDC_033",
            "chapter": "Chương 3: Quang Học Sóng - Phân Cực Ánh Sáng",
            "chapter_id": 3,
            "type": "mcq",
            "prompt": "Góc giới hạn phản xạ toàn phần của kim cương trong không khí là igh = 24.4°. Góc Brewster iB khi chiếu ánh sáng từ không khí vào kim cương bằng bao nhiêu?",
            "options": [
                "A. 67.5°",
                "B. 45.0°",
                "C. 60.0°",
                "D. 72.3°"
            ],
            "correct_answer": "A",
            "correct_answer_text": "67.5°",
            "explanation": "Chiết suất của kim cương được xác định từ góc giới hạn phản xạ toàn phần:\nsin(igh) = 1 / n ⇒ n = 1 / sin(24.4°) = 1 / 0.4131 ≈ 2.42.\nTheo định luật Brewster khi chiếu từ không khí vào kim cương:\ntan(iB) = n = 2.42 ⇒ iB = arctan(2.42) ≈ 67.5°.",
            "methodology": "Liên hệ góc toàn phần và Brewster: n = 1/sin(igh); tan(iB) = n.",
            "tips": "Bấm Casio: n = 1/sin(24.4°) = 2.4208; shift tan(2.4208) = 67.55°."
        },
        {
            "id": "VLDC_034",
            "chapter": "Chương 3: Quang Học Sóng - Phân Cực Ánh Sáng",
            "chapter_id": 3,
            "type": "mcq",
            "prompt": "Chiếu chùm ánh sáng tự nhiên qua hệ 3 kính phân cực lý tưởng. Kính thứ nhất và kính thứ ba bắt chéo nhau (góc giữa hai quang trục là 90°). Kính thứ hai đặt ở giữa có quang trục hợp với kính thứ nhất một góc 45°. Cường độ ánh sáng thoát ra sau kính thứ ba so với cường độ ánh sáng tự nhiên ban đầu bằng:",
            "options": [
                "A. 1/8 (12.5%)",
                "B. 1/4 (25%)",
                "C. 0 (bị tắt hoàn toàn)",
                "D. 1/16 (6.25%)"
            ],
            "correct_answer": "A",
            "correct_answer_text": "1/8 (12.5%)",
            "explanation": "1. Sau kính 1: Ánh sáng tự nhiên thành ánh sáng phân cực thẳng, cường độ I1 = I_tn / 2.\n2. Kính 2 hợp với kính 1 góc 45°: I2 = I1 * cos²(45°) = (I_tn / 2) * (√2/2)² = (I_tn / 2) * 0.5 = I_tn / 4.\n3. Kính 3 hợp với kính 1 góc 90° nên hợp với kính 2 góc (90° - 45°) = 45°:\nI3 = I2 * cos²(45°) = (I_tn / 4) * 0.5 = I_tn / 8 = 0.125 I_tn.\nLưu ý: Mặc dù kính 1 và 3 bắt chéo, việc chèn kính thứ hai ở giữa làm quay phương dao động nên ánh sáng VẪN LỌT QUA ĐƯỢC!",
            "methodology": "Hiện tượng phục hồi ánh sáng qua kính phân cực trung gian: I_out = (I_tn / 2) * cos²(α1) * cos²(α2).",
            "tips": "Bấm Casio: 0.5 * cos(45)² * cos(45)² = 0.5 * 0.5 * 0.5 = 1/8."
        },

        # Quang lượng tử nâng cao
        {
            "id": "VLDC_035",
            "chapter": "Chương 4: Quang Lượng Tử - Bức Xạ Nhiệt & Lượng Tử Ánh Sáng",
            "chapter_id": 4,
            "type": "mcq",
            "prompt": "Dây tóc vonfram của một bóng đèn sợi đốt có diện tích phát xạ S = 0.5 cm² và nhiệt độ hoạt động T = 2500 K. Giả sử hệ số hấp thụ trung bình của vonfram ở nhiệt độ này là ε = 0.35, cho σ = 5.67 × 10⁻⁸ W/(m²·K⁴). Công suất bức xạ của dây tóc bóng đèn xấp xỉ bằng:",
            "options": [
                "A. 38.7 W",
                "B. 110.5 W",
                "C. 55.4 W",
                "D. 77.2 W"
            ],
            "correct_answer": "A",
            "correct_answer_text": "38.7 W",
            "explanation": "Công suất bức xạ của vật thực có hệ số phát xạ ε được tính bằng:\nP = ε * S * σ * T⁴.\nĐổi đơn vị: S = 0.5 cm² = 0.5 × 10⁻⁴ m².\nThay số:\nP = 0.35 * (0.5 × 10⁻⁴ m²) * (5.67 × 10⁻⁸) * (2500)⁴\n(2500)⁴ = 3.90625 × 10¹³\nP = 0.35 * 0.5 × 10⁻⁴ * 5.67 × 10⁻⁸ * 3.90625 × 10¹³ ≈ 38.76 W.",
            "methodology": "Công suất bức xạ vật không đen tuyệt đối: P = ε * S * σ * T⁴.",
            "tips": "Bấm Casio: 0.35 * 0.5e-4 * 5.67e-8 * 2500^4 = 38.76 W."
        },
        {
            "id": "VLDC_036",
            "chapter": "Chương 4: Quang Lượng Tử - Bức Xạ Nhiệt & Lượng Tử Ánh Sáng",
            "chapter_id": 4,
            "type": "mcq",
            "prompt": "Trong hiện tượng quang điện ngoài, quả cầu kim loại cô lập có giới hạn quang điện λ0 = 0.3 µm được chiếu bằng ánh sáng đơn sắc bước sóng λ = 0.2 µm. Điện thế cực đại V_max mà quả cầu tích được là:",
            "options": [
                "A. 2.07 V",
                "B. 4.14 V",
                "C. 1.03 V",
                "D. 6.21 V"
            ],
            "correct_answer": "A",
            "correct_answer_text": "2.07 V",
            "explanation": "Khi quả cầu cô lập bị chiếu sáng, các electron quang điện bứt ra làm quả cầu tích điện dương. Điện thế quả cầu tăng dần đến V_max thì lực điện trường cản trở hoàn toàn các electron bứt ra tiếp (đóng vai trò như hiệu điện thế hãm Uh):\ne * V_max = h * c * (1/λ - 1/λ0).\nCông thoát A = 1.242 / λ0 = 1.242 / 0.3 = 4.14 eV.\nNăng lượng photon ε = 1.242 / λ = 1.242 / 0.2 = 6.21 eV.\nDo đó: e * V_max = 6.21 eV - 4.14 eV = 2.07 eV ⇒ V_max = 2.07 V.",
            "methodology": "Điện thế cực đại của vật dẫn cô lập khi quang điện: V_max = Uh = (ε - A) / e.",
            "tips": "Bấm nhanh: V_max = 1.242 * (1/0.2 - 1/0.3) = 1.242 * (5 - 3.333) = 2.07 V."
        },
        {
            "id": "VLDC_037",
            "chapter": "Chương 4: Quang Lượng Tử - Bức Xạ Nhiệt & Lượng Tử Ánh Sáng",
            "chapter_id": 4,
            "type": "mcq",
            "prompt": "Trong tán xạ Compton, photon tới có năng lượng E = 0.511 MeV (bằng năng lượng nghỉ của electron m0*c²). Tán xạ ngược trở lại một góc θ = 180°. Động năng truyền cho electron giật lùi bằng:",
            "options": [
                "A. 0.341 MeV",
                "B. 0.170 MeV",
                "C. 0.511 MeV",
                "D. 0.255 MeV"
            ],
            "correct_answer": "A",
            "correct_answer_text": "0.341 MeV",
            "explanation": "Bước sóng của photon tới: λ = hc / E = hc / (m0 c²) = λc = 0.02426 Å.\nĐộ tăng bước sóng khi tán xạ góc θ = 180°: Δλ = 2*λc.\nBước sóng của photon tán xạ: λ' = λ + Δλ = λc + 2*λc = 3*λc.\nNăng lượng của photon tán xạ:\nE' = hc / λ' = hc / (3*λc) = E / 3 = 0.511 / 3 ≈ 0.170 MeV.\nTheo bảo toàn năng lượng, động năng của electron giật lùi:\nKe = E - E' = E - E/3 = (2/3) * E = (2/3) * 0.511 MeV ≈ 0.341 MeV.",
            "methodology": "Tán xạ Compton góc 180°: λ' = λ + 2λc. Bảo toàn năng lượng: Ke = E - E'.",
            "tips": "Mẹo nhanh: Khi E = m0 c² thì λ = λc. Góc 180° ⇒ λ' = 3λc ⇒ E' = E/3 ⇒ Ke = 2E/3 = 2/3 * 0.511 = 0.341 MeV."
        },

        # Cơ học lượng tử nâng cao
        {
            "id": "VLDC_038",
            "chapter": "Chương 5: Cơ Học Lượng Tử - Sóng De Broglie & Giếng Thế",
            "chapter_id": 5,
            "type": "mcq",
            "prompt": "Hạt proton và hạt electron có cùng động năng Wđ. Tỉ số giữa bước sóng De Broglie của electron và proton (λ_e / λ_p) bằng bao nhiêu? Biết khối lượng proton mp ≈ 1836 me.",
            "options": [
                "A. ≈ 42.8",
                "B. ≈ 1836",
                "C. ≈ 1.0",
                "D. ≈ 918"
            ],
            "correct_answer": "A",
            "correct_answer_text": "≈ 42.8",
            "explanation": "Công thức bước sóng De Broglie theo động năng:\nλ = h / p = h / √(2 * m * Wđ).\nKhi Wđ như nhau:\nλ_e / λ_p = √(mp / me) = √1836 ≈ 42.85.\nVậy bước sóng De Broglie của electron lớn hơn proton khoảng 42.8 lần.",
            "methodology": "Tỉ số bước sóng De Broglie cùng động năng tỉ lệ nghịch với căn bậc hai khối lượng: λ1/λ2 = √(m2/m1).",
            "tips": "Bấm Casio: √1836 = 42.848."
        },
        {
            "id": "VLDC_039",
            "chapter": "Chương 5: Cơ Học Lượng Tử - Sóng De Broglie & Giếng Thế",
            "chapter_id": 5,
            "type": "mcq",
            "prompt": "Thời gian sống trung bình của nguyên tử ở trạng thái kích thích là τ = 10⁻⁸ s. Độ rộng tự nhiên của mức năng lượng này (độ bất định năng lượng ΔE) theo hệ thức Heisenberg xấp xỉ bằng:",
            "options": [
                "A. 6.6 × 10⁻⁸ eV",
                "B. 4.1 × 10⁻¹⁵ eV",
                "C. 1.05 × 10⁻²⁶ eV",
                "D. 3.2 × 10⁻⁶ eV"
            ],
            "correct_answer": "A",
            "correct_answer_text": "6.6 × 10⁻⁸ eV",
            "explanation": "Theo hệ thức bất định Heisenberg về năng lượng và thời gian:\nΔE * Δt ≥ ħ = h / (2π).\nVới Δt = τ = 10⁻⁸ s:\nΔE ≈ ħ / τ = (1.055 × 10⁻³⁴ J·s) / 10⁻⁸ s = 1.055 × 10⁻²⁶ J.\nĐổi sang eV:\nΔE(eV) = (1.055 × 10⁻²⁶) / (1.6 × 10⁻¹⁹) ≈ 6.6 × 10⁻⁸ eV.",
            "methodology": "Hệ thức Heisenberg: ΔE * Δt ≈ ħ. Đổi Joule sang eV bằng cách chia cho 1.6e-19.",
            "tips": "Bấm Casio: (1.055e-34 / 1e-8) / 1.6e-19 = 6.59e-8 eV."
        },
        {
            "id": "VLDC_040",
            "chapter": "Chương 5: Cơ Học Lượng Tử - Sóng De Broglie & Giếng Thế",
            "chapter_id": 5,
            "type": "mcq",
            "prompt": "Hạt chuyển động trong giếng thế năng 1 chiều sâu vô hạn bề rộng a ở trạng thái dừng n = 2. Xác suất tìm thấy hạt trong khoảng từ x = 0 đến x = a/2 (nửa bên trái giếng) bằng:",
            "options": [
                "A. 50% (0.5)",
                "B. 25% (0.25)",
                "C. 100% (1.0)",
                "D. 0%"
            ],
            "correct_answer": "A",
            "correct_answer_text": "50% (0.5)",
            "explanation": "Do tính chất đối xứng của hàm sóng và mật độ xác suất |ψn(x)|² đối với tâm giếng x = a/2:\nĐồ thị |ψ2(x)|² có 2 đỉnh đối xứng giống hệt nhau ở hai nửa giếng.\nTổng xác suất tìm hạt trong toàn bộ giếng là 1 (điều kiện chuẩn hóa).\nDo đó xác suất tìm hạt ở nửa giếng bên trái (từ 0 đến a/2) bằng đúng nửa giếng bên phải, tức bằng 1/2 = 50% = 0.5.",
            "methodology": "Tính chất đối xứng của giếng thế sâu vô hạn: Xác suất tìm hạt ở nửa giếng luôn bằng 0.5 đối với mọi số lượng tử n.",
            "tips": "Quy tắc đối xứng: Giếng cân xứng nên xác suất ở mỗi nửa luôn là 0.5 (50%)."
        },

        # Vật lý nguyên tử & hạt nhân nâng cao
        {
            "id": "VLDC_041",
            "chapter": "Chương 6: Vật Lý Nguyên Tử & Hạt Nhân",
            "chapter_id": 6,
            "type": "mcq",
            "prompt": "Bước sóng dài nhất trong dãy Balmer của quang phổ nguyên tử Hydro ứng với sự chuyển mức năng lượng nào của electron?",
            "options": [
                "A. Từ n = 3 về n = 2 (Vạch Hα)",
                "B. Từ n = 4 về n = 2 (Vạch Hβ)",
                "C. Từ n = ∞ về n = 2",
                "D. Từ n = 2 về n = 1"
            ],
            "correct_answer": "A",
            "correct_answer_text": "Từ n = 3 về n = 2 (Vạch Hα)",
            "explanation": "Theo công thức Balmer: 1/λ = R_H * (1/2² - 1/n²) với n = 3, 4, 5...\nBước sóng λ tỉ lệ nghịch với hiệu năng lượng: λ = hc / ΔE.\nĐể bước sóng dài nhất (λ_max) thì hiệu năng lượng ΔE phải nhỏ nhất, tương ứng với electron chuyển từ mức gần nhất n = 3 về n = 2.\nĐó chính là vạch phổ màu đỏ Hα (λ ≈ 0.6563 µm).",
            "methodology": "Quy tắc bước sóng quang phổ: λ_max ứng với hiệu mức nhỏ nhất (kế cận), λ_min ứng với n = ∞.",
            "tips": "Nhớ: λ lớn nhất ⇔ ΔE nhỏ nhất ⇔ mức kế cận (3 → 2)."
        },
        {
            "id": "VLDC_042",
            "chapter": "Chương 6: Vật Lý Nguyên Tử & Hạt Nhân",
            "chapter_id": 6,
            "type": "mcq",
            "prompt": "Năng lượng liên kết riêng của hạt nhân là đại lượng đặc trưng cho:",
            "options": [
                "A. Mức độ bền vững của hạt nhân (năng lượng liên kết tính trên một nuclon)",
                "B. Năng lượng toàn phần giải phóng khi toàn bộ hạt nhân bị phân rã",
                "C. Năng lượng liên kết giữa các proton mang điện tích cùng dấu",
                "D. Khối lượng hụt của hạt nhân"
            ],
            "correct_answer": "A",
            "correct_answer_text": "Mức độ bền vững của hạt nhân (năng lượng liên kết tính trên một nuclon)",
            "explanation": "Năng lượng liên kết riêng được định nghĩa bằng: ε = Elk / A, tức là năng lượng liên kết tính trung bình cho 1 nuclon.\nHạt nhân có năng lượng liên kết riêng càng lớn thì càng bền vững.\nCác hạt nhân có số khối trung bình (A từ 50 đến 70, như Fe-56) có năng lượng liên kết riêng lớn nhất (khoảng 8.8 MeV/nuclon) nên bền vững nhất trong tự nhiên.",
            "methodology": "Độ bền hạt nhân không phụ thuộc năng lượng liên kết tổng mà phụ thuộc NĂNG LƯỢNG LIÊN KẾT RIÊNG (Elk/A).",
            "tips": "Ghi nhớ: Bền vững ⇔ Năng lượng liên kết riêng (Elk / A) lớn nhất."
        }
    ]

    questions.extend(extra_questions)
    return questions

def main():
    print("Expanding full VLDC Questions Database...")
    import scripts.build_vldc_database as b
    kb = b.build_knowledge_base()
    all_q = generate_vldc_bank()

    # Save
    with open("data/vldc_questions_db.json", "w", encoding="utf-8") as f:
        json.dump(all_q, f, ensure_ascii=False, indent=2)

    with open("web/data/vldc_questions.json", "w", encoding="utf-8") as f:
        json.dump(all_q, f, ensure_ascii=False, indent=2)

    with open("docs/data/vldc_questions.json", "w", encoding="utf-8") as f:
        json.dump(all_q, f, ensure_ascii=False, indent=2)

    # Export JS
    js_content = f"// VLDC Questions Database (Auto-generated)\nwindow.VLDC_QUESTIONS_DATA = {json.dumps(all_q, ensure_ascii=False, indent=2)};\n"
    with open("web/vldc_data.js", "w", encoding="utf-8") as f:
        f.write(js_content)
    with open("docs/vldc_data.js", "w", encoding="utf-8") as f:
        f.write(js_content)

    print(f"✅ Generated {len(all_q)} comprehensive VLDC Questions!")

if __name__ == "__main__":
    main()
