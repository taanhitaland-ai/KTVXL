#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
append_vldc_questions.py
Tạo 20 câu hỏi bổ sung (VLDC_043 -> VLDC_062) và ghép vào ngân hàng câu hỏi đầy đủ.
"""

import json
import os

def get_additional_questions():
    return [
        {
            "id": "VLDC_043",
            "chapter": "Chương 1: Quang Học Sóng - Giao Thoa Ánh Sáng",
            "chapter_id": 1,
            "type": "mcq",
            "prompt": "Một nêm không khí được tạo bởi hai bản thủy tinh phẳng dài l = 10 cm, một đầu tiếp xúc, đầu kia kẹp một sợi tóc có đường kính d = 20 µm. Chiếu ánh sáng đơn sắc bước sóng λ = 0.5 µm vuông góc với mặt nêm. Khoảng cách giữa hai vân tối liên tiếp trên mặt nêm bằng:",
            "options": [
                "A. 1.25 mm",
                "B. 2.50 mm",
                "C. 0.625 mm",
                "D. 5.00 mm"
            ],
            "correct_answer": "A",
            "correct_answer_text": "1.25 mm",
            "explanation": "Góc nghiêng của nêm: α ≈ d / l = (20 × 10⁻⁶ m) / (0.1 m) = 2 × 10⁻⁴ rad.\nKhoảng vân trên nêm không khí: i = λ / (2 * α) = (0.5 × 10⁻⁶ m) / (2 * 2 × 10⁻⁴ rad) = 0.5 × 10⁻⁶ / 4 × 10⁻⁴ = 1.25 × 10⁻³ m = 1.25 mm.",
            "methodology": "Khoảng vân nêm không khí: i = λ * l / (2d).",
            "tips": "Bấm Casio: 0.5e-6 * 0.1 / (2 * 20e-6) = 1.25e-3 m = 1.25 mm."
        },
        {
            "id": "VLDC_044",
            "chapter": "Chương 1: Quang Học Sóng - Giao Thoa Ánh Sáng",
            "chapter_id": 1,
            "type": "mcq",
            "prompt": "Trong thí nghiệm vân tròn Newton, bán kính vân tối thứ 5 quan sát được trong ánh sáng phản xạ là r5 = 3 mm. Bán kính của vân tối thứ 20 bằng:",
            "options": [
                "A. 6 mm",
                "B. 12 mm",
                "C. 9 mm",
                "D. 4.24 mm"
            ],
            "correct_answer": "A",
            "correct_answer_text": "6 mm",
            "explanation": "Bán kính vân tối thứ k: rk = √(k * R * λ).\nDo đó: r20 / r5 = √(20 / 5) = √4 = 2.\nSuy ra: r20 = 2 * r5 = 2 * 3 mm = 6 mm.",
            "methodology": "Tỉ số bán kính vân tròn Newton: r_m / r_n = √(m / n).",
            "tips": "Mẹo nhẩm: Bậc k tăng 4 lần thì bán kính tăng √4 = 2 lần: 3 * 2 = 6 mm."
        },
        {
            "id": "VLDC_045",
            "chapter": "Chương 2: Quang Học Sóng - Nhiễu Xạ Ánh Sáng",
            "chapter_id": 2,
            "type": "mcq",
            "prompt": "Chiếu đồng thời hai bức xạ đơn sắc λ1 = 0.4 µm và λ2 = 0.6 µm vuông góc vào một cách tử nhiễu xạ. Vạch cực đại bậc mấy của λ1 sẽ trùng với một vạch cực đại của λ2 ở vị trí gần vân trung tâm nhất?",
            "options": [
                "A. Bậc 3 của λ1 trùng với bậc 2 của λ2",
                "B. Bậc 2 của λ1 trùng với bậc 3 của λ2",
                "C. Bậc 4 của λ1 trùng với bậc 3 của λ2",
                "D. Bậc 5 của λ1 trùng với bậc 4 của λ2"
            ],
            "correct_answer": "A",
            "correct_answer_text": "Bậc 3 của λ1 trùng với bậc 2 của λ2",
            "explanation": "Điều kiện trùng nhau giữa hai vạch quang phổ của cách tử:\nd * sin(φ) = k1 * λ1 = k2 * λ2\n⇒ k1 / k2 = λ2 / λ1 = 0.6 / 0.4 = 3 / 2.\nPhân số tối giản 3/2 cho thấy vị trí trùng nhau đầu tiên (gần tâm nhất) ứng với k1 = 3 và k2 = 2.\nTức là cực đại bậc 3 của λ1 trùng với cực đại bậc 2 của λ2.",
            "methodology": "Điều kiện trùng vân: k1*λ1 = k2*λ2 ⇒ k1/k2 = λ2/λ1 (rút gọn về phân số tối giản).",
            "tips": "Mẹo nhẩm: 0.6 / 0.4 = 3 / 2 ⇒ k1 = 3, k2 = 2."
        },
        {
            "id": "VLDC_046",
            "chapter": "Chương 2: Quang Học Sóng - Nhiễu Xạ Ánh Sáng",
            "chapter_id": 2,
            "type": "mcq",
            "prompt": "Chiếu chùm sáng đơn sắc bước sóng λ = 0.5 µm qua một khe hẹp bề rộng b = 0.05 mm. Góc nhiễu xạ ứng với cực tiểu nhiễu xạ thứ hai (k = 2) bằng:",
            "options": [
                "A. 0.02 rad (≈ 1.15°)",
                "B. 0.01 rad (≈ 0.57°)",
                "C. 0.04 rad (≈ 2.30°)",
                "D. 0.005 rad (≈ 0.29°)"
            ],
            "correct_answer": "A",
            "correct_answer_text": "0.02 rad (≈ 1.15°)",
            "explanation": "Điều kiện cực tiểu nhiễu xạ qua 1 khe hẹp: b * sin(φ) = k * λ.\nVới k = 2, b = 0.05 mm = 5 × 10⁻⁵ m, λ = 0.5 µm = 5 × 10⁻⁷ m:\nsin(φ) ≈ φ = (2 * λ) / b = (2 * 5 × 10⁻⁷ m) / (5 × 10⁻⁵ m) = 2 × 10⁻² = 0.02 rad.\nĐổi ra độ: φ = 0.02 * (180 / π) ≈ 1.15°.",
            "methodology": "Góc cực tiểu bậc k khe hẹp: φ ≈ k*λ / b.",
            "tips": "Bấm máy: 2 * 0.5e-6 / 5e-5 = 0.02 rad = 1.146°."
        },
        {
            "id": "VLDC_047",
            "chapter": "Chương 3: Quang Học Sóng - Phân Cực Ánh Sáng",
            "chapter_id": 3,
            "type": "mcq",
            "prompt": "Bản một phần tư bước sóng (λ/4) trong quang học có tác dụng gì?",
            "options": [
                "A. Tạo ra hiệu quang lộ giữa tia thường (o) và tia bất thường (e) đúng bằng λ/4 (hiệu pha π/2), dùng để biến ánh sáng phân cực thẳng thành phân cực tròn hoặc elip",
                "B. Làm giảm cường độ ánh sáng đi 4 lần",
                "C. Quay mặt phẳng dao động của ánh sáng phân cực đi một góc 90°",
                "D. Lọc bỏ 3/4 bước sóng trong quang phổ ánh sáng trắng"
            ],
            "correct_answer": "A",
            "correct_answer_text": "Tạo ra hiệu quang lộ giữa tia thường (o) và tia bất thường (e) đúng bằng λ/4 (hiệu pha π/2), dùng để biến ánh sáng phân cực thẳng thành phân cực tròn hoặc elip",
            "explanation": "Bản một phần tư bước sóng (bản λ/4) là bản tinh thể quang học đơn trục cắt song song với quang trục, có bề dày d thỏa mãn: |no - ne| * d = (k + 1/4) * λ.\nKhi chùm ánh sáng phân cực phẳng truyền qua bản, tia thường và tia bất thường lệch pha nhau Δφ = π/2 (ứng với hiệu quang lộ λ/4).\nSự tổng hợp của hai dao động vuông góc lệch pha π/2 tạo thành ánh sáng phân cực elip (hoặc phân cực tròn khi góc giữa quang trục và phương dao động ban đầu là 45°).",
            "methodology": "Bản λ/4 tạo độ lệch pha Δφ = π/2 ⇒ biến phân cực thẳng thành phân cực tròn/elip. Bản λ/2 tạo độ lệch pha Δφ = π ⇒ quay mặt phẳng phân cực đi góc 2θ.",
            "tips": "Nhớ: Bản λ/4 = lệch pha 90° (π/2) = phân cực TRÒN / ELIP."
        },
        {
            "id": "VLDC_048",
            "chapter": "Chương 3: Quang Học Sóng - Phân Cực Ánh Sáng",
            "chapter_id": 3,
            "type": "mcq",
            "prompt": "Khi chiếu tia sáng từ không khí tới mặt nước (chiết suất n = 1.33) dưới góc tới Brewster iB, góc khúc xạ r trong nước bằng:",
            "options": [
                "A. 36.9°",
                "B. 53.1°",
                "C. 45.0°",
                "D. 30.0°"
            ],
            "correct_answer": "A",
            "correct_answer_text": "36.9°",
            "explanation": "Theo định luật Brewster, khi góc tới là góc Brewster iB thì tia phản xạ vuông góc với tia khúc xạ:\niB + r = 90° ⇒ r = 90° - iB.\nTa có: tan(iB) = n = 1.33 ⇒ iB = arctan(1.33) ≈ 53.06° ≈ 53.1°.\nDo đó góc khúc xạ: r = 90° - 53.1° = 36.9°.",
            "methodology": "Định luật Brewster: iB + r = 90°. tan(iB) = n2 / n1.",
            "tips": "Bấm Casio: iB = arctan(1.33) = 53.06° ⇒ r = 90 - 53.06 = 36.94°."
        },
        {
            "id": "VLDC_049",
            "chapter": "Chương 4: Quang Lượng Tử - Bức Xạ Nhiệt & Lượng Tử Ánh Sáng",
            "chapter_id": 4,
            "type": "mcq",
            "prompt": "Một nguồn sáng đơn sắc phát ra bức xạ bước sóng λ = 0.4 µm với công suất P = 2 W. Số lượng photon do nguồn phát ra trong mỗi giây bằng bao nhiêu?",
            "options": [
                "A. 4.02 × 10¹⁸ photon/s",
                "B. 2.01 × 10¹⁸ photon/s",
                "C. 8.05 × 10¹⁸ photon/s",
                "D. 1.25 × 10¹⁹ photon/s"
            ],
            "correct_answer": "A",
            "correct_answer_text": "4.02 × 10¹⁸ photon/s",
            "explanation": "Năng lượng của mỗi hạt photon:\nε = (h * c) / λ = (6.625 × 10⁻³⁴ * 3 × 10⁸) / (0.4 × 10⁻⁶) = 4.969 × 10⁻¹⁹ J.\nSố lượng photon phát ra trong mỗi giây:\nN = P / ε = 2 W / (4.969 × 10⁻¹⁹ J) ≈ 4.025 × 10¹⁸ photon/s.",
            "methodology": "Số photon phát ra mỗi giây: N = P / ε = (P * λ) / (h * c).",
            "tips": "Bấm Casio: 2 * 0.4e-6 / (6.625e-34 * 3e8) = 4.025*10^18."
        },
        {
            "id": "VLDC_050",
            "chapter": "Chương 4: Quang Lượng Tử - Bức Xạ Nhiệt & Lượng Tử Ánh Sáng",
            "chapter_id": 4,
            "type": "mcq",
            "prompt": "Kim loại Canxi có công thoát electron A = 2.71 eV. Khi chiếu bức xạ có photon mang năng lượng ε = 4.50 eV vào Canxi, vận tốc ban đầu cực đại của electron quang điện bứt ra bằng:",
            "options": [
                "A. 7.93 × 10⁵ m/s",
                "B. 5.62 × 10⁵ m/s",
                "C. 1.25 × 10⁶ m/s",
                "D. 3.45 × 10⁵ m/s"
            ],
            "correct_answer": "A",
            "correct_answer_text": "7.93 × 10⁵ m/s",
            "explanation": "Động năng ban đầu cực đại của electron quang điện:\nW0max = ε - A = 4.50 eV - 2.71 eV = 1.79 eV.\nĐổi sang Joule: W0max = 1.79 * 1.6 × 10⁻¹⁹ J = 2.864 × 10⁻¹⁹ J.\nMặt khác: W0max = 0.5 * me * v0max² (với khối lượng electron me = 9.109 × 10⁻³¹ kg):\nv0max = √(2 * W0max / me) = √(2 * 2.864 × 10⁻¹⁹ / 9.109 × 10⁻³¹) = √(6.288 × 10¹¹) ≈ 7.93 × 10⁵ m/s.",
            "methodology": "Phương trình Einstein: 0.5*m*v0max² = ε - A. v0max = √(2 * (ε - A) / me).",
            "tips": "Bấm Casio: √( 2 * 1.79 * 1.6e-19 / 9.109e-31 ) = 7.93*10^5 m/s."
        },
        {
            "id": "VLDC_051",
            "chapter": "Chương 4: Quang Lượng Tử - Bức Xạ Nhiệt & Lượng Tử Ánh Sáng",
            "chapter_id": 4,
            "type": "mcq",
            "prompt": "Trong hiện tượng tán xạ Compton, photon tán xạ bay lệch góc θ = 60°. Cho bước sóng Compton λc = 0.02426 Å. Độ tăng bước sóng Δλ bằng:",
            "options": [
                "A. 0.01213 Å",
                "B. 0.02426 Å",
                "C. 0.04852 Å",
                "D. 0.01820 Å"
            ],
            "correct_answer": "A",
            "correct_answer_text": "0.01213 Å",
            "explanation": "Công thức Compton: Δλ = λc * (1 - cos θ).\nVới θ = 60°: cos(60°) = 0.5.\nΔλ = λc * (1 - 0.5) = 0.5 * λc = 0.5 * 0.02426 Å = 0.01213 Å = 1.213 × 10⁻¹² m.",
            "methodology": "Công thức Compton: Δλ = λc * (1 - cos θ).",
            "tips": "Góc 60°: (1 - cos 60°) = 0.5 ⇒ độ tăng bằng NỬA bước sóng Compton."
        },
        {
            "id": "VLDC_052",
            "chapter": "Chương 5: Cơ Học Lượng Tử - Sóng De Broglie & Giếng Thế",
            "chapter_id": 5,
            "type": "mcq",
            "prompt": "Tính bước sóng De Broglie của một quả bóng khối lượng m = 0.2 kg đang chuyển động với vận tốc v = 20 m/s. Kết quả này giải thích điều gì về vật lý cổ điển và lượng tử?",
            "options": [
                "A. λ ≈ 1.66 × 10⁻³⁴ m; bước sóng quá nhỏ so với kích thước vật thể vĩ mô nên tính chất sóng không thể hiện trong thế giới đời thường",
                "B. λ ≈ 1.66 × 10⁻¹⁰ m; quả bóng thể hiện rõ hiện tượng giao thoa khi bay qua cửa sổ",
                "C. λ ≈ 6.63 × 10⁻³⁴ m; vận tốc quả bóng biến thiên liên tục dạng sóng",
                "D. λ = 0 m; chỉ các hạt mang điện tích mới có sóng De Broglie"
            ],
            "correct_answer": "A",
            "correct_answer_text": "λ ≈ 1.66 × 10⁻³⁴ m; bước sóng quá nhỏ so với kích thước vật thể vĩ mô nên tính chất sóng không thể hiện trong thế giới đời thường",
            "explanation": "Theo công thức De Broglie:\nλ = h / p = h / (m * v) = (6.625 × 10⁻³⁴ J·s) / (0.2 kg * 20 m/s) = (6.625 × 10⁻³⁴) / 4 = 1.656 × 10⁻³⁴ m.\nGiá trị này vô cùng nhỏ bé (nhỏ hơn kích thước hạt nhân nguyên tử tới 20 bậc độ lớn), vì vậy mọi hiện tượng sóng (giao thoa, nhiễu xạ) của các vật thể vĩ mô hoàn toàn không thể quan sát được. Vật thể vĩ mô hoàn toàn tuân theo cơ học cổ điển Newton.",
            "methodology": "Bước sóng De Broglie cho vật thể vĩ mô: λ = h / (m*v) ~ 10⁻³⁴ m (không quan sát được tính sóng).",
            "tips": "Hiểu bản chất: Vật vĩ mô có khối lượng lớn ⇒ mẫu số m*v lớn ⇒ λ cực nhỏ ⇒ chỉ quan sát thấy tính hạt cổ điển."
        },
        {
            "id": "VLDC_053",
            "chapter": "Chương 5: Cơ Học Lượng Tử - Sóng De Broglie & Giếng Thế",
            "chapter_id": 5,
            "type": "mcq",
            "prompt": "Một electron chuyển động trong giếng thế 1 chiều sâu vô hạn bề rộng a = 1 nm. Năng lượng ở trạng thái cơ bản là E1 = 0.376 eV. Năng lượng ở trạng thái dừng n = 3 bằng:",
            "options": [
                "A. 3.384 eV",
                "B. 1.128 eV",
                "C. 1.504 eV",
                "D. 6.016 eV"
            ],
            "correct_answer": "A",
            "correct_answer_text": "3.384 eV",
            "explanation": "Mức năng lượng của hạt trong giếng thế 1 chiều tỉ lệ thuận với bình phương số lượng tử n:\nEn = n² * E1.\nVới n = 3:\nE3 = 3² * E1 = 9 * 0.376 eV = 3.384 eV.",
            "methodology": "Mức năng lượng giếng thế: En = n² * E1.",
            "tips": "Bấm Casio: 9 * 0.376 = 3.384 eV."
        },
        {
            "id": "VLDC_054",
            "chapter": "Chương 5: Cơ Học Lượng Tử - Sóng De Broglie & Giếng Thế",
            "chapter_id": 5,
            "type": "mcq",
            "prompt": "Trong cơ học lượng tử, hàm sóng ψ(x, y, z, t) của một hạt phải thỏa mãn các điều kiện chuẩn mực nào sau đây?",
            "options": [
                "A. Phải đơn trị, liên tục, hữu hạn trên toàn miền xác định và thỏa mãn điều kiện chuẩn hóa tích phân |ψ|² dV = 1",
                "B. Phải luôn luôn là số thực và đạo hàm bậc hai luôn bằng 0",
                "C. Phải triệt tiêu ở mọi điểm khi t = 0",
                "D. Chỉ cần liên tục tại gốc tọa độ, không cần hữu hạn ở vô cực"
            ],
            "correct_answer": "A",
            "correct_answer_text": "Phải đơn trị, liên tục, hữu hạn trên toàn miền xác định và thỏa mãn điều kiện chuẩn hóa tích phân |ψ|² dV = 1",
            "explanation": "Vì |ψ|² đại diện cho mật độ xác suất tìm thấy hạt nên để có ý nghĩa vật lý, hàm sóng ψ phải:\n1. Đơn trị: Tại mỗi điểm chỉ có một giá trị xác suất duy nhất.\n2. Liên tục: Xác suất không thể nhảy bậc gián đoạn.\n3. Hữu hạn: Xác suất không thể tiến tới vô cực.\n4. Chuẩn hóa: Tích phân toàn không gian ∫ |ψ|² dV = 1 (tổng xác suất tìm hạt trong toàn vũ trụ chắc chắn bằng 100%).",
            "methodology": "4 điều kiện chuẩn mực của hàm sóng: Đơn trị, Liên tục, Hữu hạn, Chuẩn hóa.",
            "tips": "Mẹo nhớ: 'Đơn - Liên - Hữu - Chuẩn'."
        },
        {
            "id": "VLDC_055",
            "chapter": "Chương 6: Vật Lý Nguyên Tử & Hạt Nhân",
            "chapter_id": 6,
            "type": "mcq",
            "prompt": "Bán kính quỹ đạo Bo thứ nhất của nguyên tử Hydro là r0 = 0.53 Å. Khi electron chuyển động trên quỹ đạo dừng M (n = 3), bán kính quỹ đạo dừng r3 bằng:",
            "options": [
                "A. 4.77 Å",
                "B. 1.59 Å",
                "C. 2.12 Å",
                "D. 8.48 Å"
            ],
            "correct_answer": "A",
            "correct_answer_text": "4.77 Å",
            "explanation": "Theo tiên đề Bo, bán kính quỹ đạo dừng của electron trong nguyên tử Hydro tỉ lệ với n²:\nrn = n² * r0.\nCác quỹ đạo theo thứ tự: K (n=1), L (n=2), M (n=3), N (n=4)...\nVới quỹ đạo M ứng với n = 3:\nr3 = 3² * r0 = 9 * 0.53 Å = 4.77 Å = 4.77 × 10⁻¹⁰ m.",
            "methodology": "Bán kính Bo: rn = n² * r0. Thứ tự quỹ đạo: K(1), L(2), M(3), N(4), O(5), P(6).",
            "tips": "Bấm Casio: 9 * 0.53 = 4.77 Å."
        },
        {
            "id": "VLDC_056",
            "chapter": "Chương 6: Vật Lý Nguyên Tử & Hạt Nhân",
            "chapter_id": 6,
            "type": "mcq",
            "prompt": "Nguyên tử Hydro đang ở trạng thái cơ bản (n = 1, E1 = -13.6 eV) hấp thụ một photon và nhảy lên mức năng lượng n = 3. Năng lượng của photon bị hấp thụ bằng:",
            "options": [
                "A. 12.09 eV",
                "B. 10.20 eV",
                "C. 1.51 eV",
                "D. 13.60 eV"
            ],
            "correct_answer": "A",
            "correct_answer_text": "12.09 eV",
            "explanation": "Mức năng lượng ở n = 1: E1 = -13.6 / 1² = -13.6 eV.\nMức năng lượng ở n = 3: E3 = -13.6 / 3² = -13.6 / 9 ≈ -1.511 eV.\nNăng lượng photon hấp thụ bằng hiệu hai mức năng lượng:\nε = E3 - E1 = -1.511 eV - (-13.6 eV) = 13.6 - 1.511 = 12.089 eV ≈ 12.09 eV.",
            "methodology": "Tiên đề hấp thụ/phát xạ photon của Bo: ε = En - Em = 13.6 * (1/m² - 1/n²).",
            "tips": "Bấm Casio: 13.6 * (1 - 1/9) = 13.6 * 8/9 = 12.0888 eV."
        },
        {
            "id": "VLDC_057",
            "chapter": "Chương 6: Vật Lý Nguyên Tử & Hạt Nhân",
            "chapter_id": 6,
            "type": "mcq",
            "prompt": "Hạt nhân Heli ⁴₂He có khối lượng m_He = 4.0015 u. Khối lượng proton mp = 1.00728 u, khối lượng neutron mn = 1.00866 u. Cho 1 u = 931.5 MeV/c². Năng lượng liên kết của hạt nhân Heli xấp xỉ bằng:",
            "options": [
                "A. 28.3 MeV",
                "B. 7.07 MeV",
                "C. 14.1 MeV",
                "D. 56.6 MeV"
            ],
            "correct_answer": "A",
            "correct_answer_text": "28.3 MeV",
            "explanation": "Hạt nhân Heli có Z = 2 proton và A - Z = 2 neutron.\nĐộ hụt khối:\nΔm = [2 * mp + 2 * mn] - m_He = [2 * 1.00728 + 2 * 1.00866] - 4.0015\nΔm = 4.03188 - 4.0015 = 0.03038 u.\nNăng lượng liên kết:\nElk = Δm * 931.5 MeV = 0.03038 * 931.5 ≈ 28.299 MeV ≈ 28.3 MeV.\n(Năng lượng liên kết riêng: ε = 28.3 / 4 ≈ 7.07 MeV/nuclon).",
            "methodology": "Năng lượng liên kết hạt nhân: Elk = Δm * 931.5 MeV với Δm = Z*mp + (A-Z)*mn - m_X.",
            "tips": "Bấm Casio: (2*1.00728 + 2*1.00866 - 4.0015) * 931.5 = 28.2989 MeV."
        },
        {
            "id": "VLDC_058",
            "chapter": "Chương 6: Vật Lý Nguyên Tử & Hạt Nhân",
            "chapter_id": 6,
            "type": "mcq",
            "prompt": "Độ phóng xạ ban đầu của một mẫu chất phóng xạ là H0 = 1000 Bq. Biết chu kỳ bán rã của chất này là T = 10 ngày. Sau thời gian t = 30 ngày, độ phóng xạ của mẫu còn lại bằng:",
            "options": [
                "A. 125 Bq",
                "B. 250 Bq",
                "C. 333 Bq",
                "D. 62.5 Bq"
            ],
            "correct_answer": "A",
            "correct_answer_text": "125 Bq",
            "explanation": "Độ phóng xạ giảm theo thời gian cùng quy luật với số hạt phóng xạ:\nH(t) = H0 * 2^(-t / T).\nVới t = 30 ngày, T = 10 ngày ⇒ số chu kỳ bán rã k = 30 / 10 = 3:\nH(30) = H0 / 2³ = 1000 / 8 = 125 Bq.",
            "methodology": "Quy luật độ phóng xạ: H = H0 / 2^(t/T).",
            "tips": "Bấm Casio: 1000 / (2^3) = 125 Bq."
        },
        {
            "id": "VLDC_059",
            "chapter": "Chương 1: Quang Học Sóng - Giao Thoa Ánh Sáng",
            "chapter_id": 1,
            "type": "fill",
            "prompt": "Trong thí nghiệm khe Young, cho a = 1 mm, D = 1.5 m. Chiếu chùm sáng bước sóng λ = 0.6 µm. Bề rộng trường giao thoa trên màn đo được L = 18 mm. Tính tổng số vân sáng quan sát được trên màn (chỉ điền số nguyên):",
            "options": [],
            "correct_answer": "21",
            "correct_answer_text": "21 vân sáng",
            "explanation": "Khoảng vân giao thoa: i = (λ * D) / a = (0.6 × 10⁻⁶ * 1.5) / 10⁻³ = 0.9 mm.\nSố khoảng vân trên nửa trường giao thoa: N' = (L / 2) / i = 9 mm / 0.9 mm = 10.\nSố vân sáng quan sát được: N = 2 * [L / (2i)] + 1 = 2 * 10 + 1 = 21 vân sáng.",
            "methodology": "Tổng số vân sáng trên trường giao thoa đối xứng bề rộng L: N = 2 * [L / (2i)] + 1.",
            "tips": "Mẹo nhẩm: L / i = 18 / 0.9 = 20 khoảng vân ⇒ có 20 + 1 = 21 vân sáng."
        },
        {
            "id": "VLDC_060",
            "chapter": "Chương 4: Quang Lượng Tử - Bức Xạ Nhiệt & Lượng Tử Ánh Sáng",
            "chapter_id": 4,
            "type": "fill",
            "prompt": "Một vật đen tuyệt đối có bước sóng bức xạ cực đại là λm = 1.449 µm. Biết hằng số Wien b = 2.898 × 10⁻³ m·K. Tính nhiệt độ tuyệt đối T của vật đen đó (nhập giá trị theo Kelvin, chỉ điền số nguyên):",
            "options": [],
            "correct_answer": "2000",
            "correct_answer_text": "2000 K",
            "explanation": "Theo định luật dịch chuyển Wien: λm * T = b ⇒ T = b / λm.\nThay số: T = (2.898 × 10⁻³ m·K) / (1.449 × 10⁻⁶ m) = 2000 K.",
            "methodology": "Định luật Wien: T = b / λm.",
            "tips": "Bấm máy: 2.898e-3 / 1.449e-6 = 2000 K."
        },
        {
            "id": "VLDC_061",
            "chapter": "Chương 5: Cơ Học Lượng Tử - Sóng De Broglie & Giếng Thế",
            "chapter_id": 5,
            "type": "fill",
            "prompt": "Tính bước sóng De Broglie của hạt electron được gia tốc qua hiệu điện thế U = 25 V (nhập giá trị theo đơn vị Ångström, làm tròn đến 2 chữ số thập phân):",
            "options": [],
            "correct_answer": "2.45",
            "correct_answer_text": "2.45 Å",
            "explanation": "Công thức tính nhanh cho electron: λ = 12.27 / √U (Å).\nVới U = 25 V ⇒ √U = 5.\nλ = 12.27 / 5 = 2.454 Å ≈ 2.45 Å.",
            "methodology": "Công thức De Broglie electron: λ(Å) = 12.27 / √U.",
            "tips": "Bấm máy: 12.27 / 5 = 2.454 Å."
        },
        {
            "id": "VLDC_062",
            "chapter": "Chương 3: Quang Học Sóng - Phân Cực Ánh Sáng",
            "chapter_id": 3,
            "type": "fill",
            "prompt": "Chiếu chùm ánh sáng tự nhiên có cường độ I0 = 100 W/m² qua hệ hai kính phân cực lý tưởng có góc giữa hai quang trục là α = 45°. Cường độ chùm sáng sau khi đi qua hai kính bằng bao nhiêu W/m² (nhập số nguyên hoặc thập phân):",
            "options": [],
            "correct_answer": "25",
            "correct_answer_text": "25 W/m²",
            "explanation": "Cường độ sau kính 1: I1 = I0 / 2 = 100 / 2 = 50 W/m².\nCường độ sau kính 2 (theo định luật Malus): I2 = I1 * cos²(45°) = 50 * (√2/2)² = 50 * 0.5 = 25 W/m².",
            "methodology": "Định luật Malus: I = (I0 / 2) * cos²(α).",
            "tips": "Bấm máy: 100 * 0.5 * cos(45)² = 25 W/m²."
        }
    ]

def main():
    with open("data/vldc_questions_db.json", "r", encoding="utf-8") as f:
        existing = json.load(f)
    print(f"Existing questions: {len(existing)}")

    new_q = get_additional_questions()
    existing.extend(new_q)
    print(f"Total after merge: {len(existing)}")

    with open("data/vldc_questions_db.json", "w", encoding="utf-8") as f:
        json.dump(existing, f, ensure_ascii=False, indent=2)

    with open("web/data/vldc_questions.json", "w", encoding="utf-8") as f:
        json.dump(existing, f, ensure_ascii=False, indent=2)

    with open("docs/data/vldc_questions.json", "w", encoding="utf-8") as f:
        json.dump(existing, f, ensure_ascii=False, indent=2)

    js_content = f"// VLDC Questions Database (Auto-generated)\nwindow.VLDC_QUESTIONS_DATA = {json.dumps(existing, ensure_ascii=False, indent=2)};\n"
    with open("web/vldc_data.js", "w", encoding="utf-8") as f:
        f.write(js_content)
    with open("docs/vldc_data.js", "w", encoding="utf-8") as f:
        f.write(js_content)

    print(f"✅ Successfully compiled {len(existing)} VLDC questions into data files and JS assets!")

if __name__ == "__main__":
    main()
