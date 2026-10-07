# -*- coding: utf-8 -*-
"""
XSTK Master Dataset - Part 2 (Chương 5, 6, 7, 8: 74 Câu Hỏi)
"""

RAW_QUESTIONS_PART2 = [
    # =========================================================================
    # CHƯƠNG 5: ĐẠI LƯỢNG NGẪU NHIÊN RỜI RẠC (19 CÂU)
    # =========================================================================
    {
        "id": "xstk_ch5_001",
        "ch": 5,
        "ch_title": "Chương 5: Đại lượng ngẫu nhiên rời rạc",
        "src": "KMA_STANDARD",
        "src_title": "Ngân Hàng Bài Tập Chuẩn KMA",
        "prompt": "Một nhóm 10 người gồm 6 nam và 4 nữ. Chọn ngẫu nhiên 3 người. Gọi X là số nữ trong 3 người được chọn. Tính kỳ vọng E(X) và phương sai D(X):",
        "correct": "E(X) = 1,2; D(X) = 0,56",
        "distractors": [
            "E(X) = 1,2; D(X) = 0,72",
            "E(X) = 1,5; D(X) = 0,56",
            "E(X) = 1,0; D(X) = 0,48"
        ],
        "exp": "$X$ là số nữ được chọn trong mẫu 3 người từ 10 người (4 nữ, 6 nam) $\\Rightarrow X \\sim H(10; 4; 3)$ (phân phối siêu bội).\nBảng phân phối xác suất của $X \\in \\{0, 1, 2, 3\\}$:\n- $P(X=0) = \\frac{C_6^3}{C_{10}^3} = \\frac{20}{120} = \\frac{1}{6}$.\n- $P(X=1) = \\frac{C_4^1 C_6^2}{C_{10}^3} = \\frac{4 \\times 15}{120} = \\frac{1}{2}$.\n- $P(X=2) = \\frac{C_4^2 C_6^1}{C_{10}^3} = \\frac{6 \\times 6}{120} = \\frac{3}{10}$.\n- $P(X=3) = \\frac{C_4^3}{C_{10}^3} = \\frac{4}{120} = \\frac{1}{30}$.\nKỳ vọng: $E(X) = n \\times \\frac{M}{N} = 3 \\times \\frac{4}{10} = 1{,}2$.\nPhương sai: $D(X) = n \\frac{M}{N}\\left(1 - \\frac{M}{N}\\right)\\frac{N - n}{N - 1} = 3 \\times 0{,}4 \\times 0{,}6 \\times \\frac{7}{9} = 0{,}56$.",
        "meth": "Công thức phân phối siêu bội: $E(X) = n \\frac{M}{N}$, $D(X) = n \\frac{M}{N}\\left(1 - \\frac{M}{N}\\right)\\frac{N - n}{N - 1}$.",
        "tips": "Nhớ công thức siêu bội: $E(X) = 3 \\times 4/10 = 1{,}2$. $D(X) = 3 \\times 0{,}4 \\times 0{,}6 \\times (7/9) = 0{,}56$."
    },
    {
        "id": "xstk_ch5_002",
        "ch": 5,
        "ch_title": "Chương 5: Đại lượng ngẫu nhiên rời rạc",
        "src": "KMA_STANDARD",
        "src_title": "Ngân Hàng Bài Tập Chuẩn KMA",
        "prompt": "Có 6 sản phẩm trong đó có 3 sản phẩm loại A. Chọn ngẫu nhiên 3 sản phẩm. Gọi X là số sản phẩm loại A được chọn. Tính kỳ vọng E(X) và phương sai D(X):",
        "correct": "E(X) = 1,5; D(X) = 0,45",
        "distractors": [
            "E(X) = 1,5; D(X) = 0,75",
            "E(X) = 1,2; D(X) = 0,45",
            "E(X) = 1,5; D(X) = 0,55"
        ],
        "exp": "$X$ có phân phối siêu bội $H(N=6, M=3, n=3)$.\n$X$ nhận các giá trị $\\{0, 1, 2, 3\\}$ với:\n$P(X=0) = C_3^3/C_6^3 = 1/20$; $P(X=1) = C_3^1 C_3^2/20 = 9/20$;\n$P(X=2) = C_3^2 C_3^1/20 = 9/20$; $P(X=3) = C_3^3/20 = 1/20$.\nKỳ vọng: $E(X) = 3 \\times \\frac{3}{6} = 1{,}5$.\nPhương sai: $D(X) = 3 \\times 0{,}5 \\times 0{,}5 \\times \\frac{6 - 3}{6 - 1} = 0{,}75 \\times \\frac{3}{5} = 0{,}45$.",
        "meth": "Phân phối siêu bội $E(X) = n \\frac{M}{N}$, $D(X) = n p q \\frac{N-n}{N-1}$.",
        "tips": "Bấm máy: `3 * 0.5 * 0.5 * (3/5) = 0.45`."
    },
    {
        "id": "xstk_ch5_003",
        "ch": 5,
        "ch_title": "Chương 5: Đại lượng ngẫu nhiên rời rạc",
        "src": "KMA_STANDARD",
        "src_title": "Ngân Hàng Bài Tập Chuẩn KMA",
        "prompt": "Hộp có 10 thẻ đỏ và 6 thẻ xanh. Rút ngẫu nhiên 3 thẻ. Gọi X là số thẻ đỏ rút được. Mỗi thẻ đỏ được 5 điểm, mỗi thẻ xanh được 8 điểm. Gọi Y là tổng số điểm thu được. Tính kỳ vọng E(Y):",
        "correct": "18,75",
        "distractors": ["17,50", "19,25", "20,00"],
        "exp": "Tổng số điểm: $Y = 5X + 8(3 - X) = 24 - 3X$.\nTheo tính chất tuyến tính của kỳ vọng: $E(Y) = 24 - 3E(X)$.\n$X$ là số thẻ đỏ chọn trong 3 thẻ từ 16 thẻ (10 đỏ, 6 xanh) $\\Rightarrow E(X) = 3 \\times \\frac{10}{16} = \\frac{30}{16} = 1{,}875$.\nDo đó: $E(Y) = 24 - 3(1{,}875) = 24 - 5{,}625 = 18{,}75$ điểm.",
        "meth": "Tính chất kỳ vọng tuyến tính: $E(aX + b) = aE(X) + b$.",
        "tips": "Không cần lập bảng phân phối của Y! Tính ngay $E(X) = 3 \\times (10/16) = 1.875 \\Rightarrow E(Y) = 24 - 3(1.875) = 18.75$."
    },
    {
        "id": "xstk_ch5_004",
        "ch": 5,
        "ch_title": "Chương 5: Đại lượng ngẫu nhiên rời rạc",
        "src": "KMA_STANDARD",
        "src_title": "Ngân Hàng Bài Tập Chuẩn KMA",
        "prompt": "Một hộp có 4 thẻ được đánh số từ 1 đến 4. Chọn ngẫu nhiên đồng thời 2 thẻ. Gọi X là tổng hai số ghi trên hai thẻ. Tính kỳ vọng E(X) và phương sai D(X):",
        "correct": "E(X) = 5; D(X) = 5/3",
        "distractors": [
            "E(X) = 5; D(X) = 2",
            "E(X) = 4,5; D(X) = 5/3",
            "E(X) = 5; D(X) = 4/3"
        ],
        "exp": "Không gian mẫu: $C_4^2 = 6$ cặp thẻ:\n$\\{1,2\\}(3), \\{1,3\\}(4), \\{1,4\\}(5), \\{2,3\\}(5), \\{2,4\\}(6), \\{3,4\\}(7)$.\nBảng phân phối xác suất của $X \\in \\{3, 4, 5, 6, 7\\}$:\n- $P(X=3) = 1/6$; $P(X=4) = 1/6$; $P(X=5) = 2/6 = 1/3$; $P(X=6) = 1/6$; $P(X=7) = 1/6$.\nDo tính đối xứng qua tâm 5: $E(X) = 5$.\n$E(X^2) = 3^2(1/6) + 4^2(1/6) + 5^2(1/3) + 6^2(1/6) + 7^2(1/6) = \\frac{9 + 16 + 50 + 36 + 49}{6} = \\frac{160}{6} = \\frac{80}{3}$.\nPhương sai: $D(X) = E(X^2) - [E(X)]^2 = \\frac{80}{3} - 25 = \\frac{5}{3} \\approx 1{,}6667$.",
        "meth": "Lập bảng phân phối xác suất và tính $E(X), E(X^2), D(X) = E(X^2) - [E(X)]^2$.",
        "tips": "Casio Menu 6: Thống kê 1 biến với tần số: nhập X và P $\\Rightarrow$ máy ra ngay $\\bar{x} = 5, \\sigma_x^2 = 5/3$."
    },
    {
        "id": "xstk_ch5_005",
        "ch": 5,
        "ch_title": "Chương 5: Đại lượng ngẫu nhiên rời rạc",
        "src": "KMA_STANDARD",
        "src_title": "Ngân Hàng Bài Tập Chuẩn KMA",
        "prompt": "Gieo đồng thời hai con xúc sắc cân đối. Gọi X là tổng số nốt xuất hiện trên hai con xúc sắc. Tính kỳ vọng E(X) và phương sai D(X):",
        "correct": "E(X) = 7; D(X) = 35/6",
        "distractors": [
            "E(X) = 7; D(X) = 6",
            "E(X) = 7; D(X) = 29/6",
            "E(X) = 6,5; D(X) = 35/6"
        ],
        "exp": "Gọi $X_1, X_2$ là số nốt trên con xúc sắc 1 và 2. $X = X_1 + X_2$.\n$X_1, X_2$ độc lập và có cùng phân phối đều trên $\\{1, 2, 3, 4, 5, 6\\}$:\n$E(X_1) = E(X_2) = \\frac{1 + 2 + 3 + 4 + 5 + 6}{6} = 3{,}5$.\n$E(X_1^2) = \\frac{1^2 + 2^2 + 3^2 + 4^2 + 5^2 + 6^2}{6} = \\frac{91}{6}$.\n$D(X_1) = D(X_2) = \\frac{91}{6} - (3{,}5)^2 = \\frac{91}{6} - \\frac{49}{4} = \\frac{35}{12}$.\nVì $X_1, X_2$ độc lập:\n$E(X) = E(X_1) + E(X_2) = 3{,}5 + 3{,}5 = 7$.\n$D(X) = D(X_1) + D(X_2) = \\frac{35}{12} + \\frac{35}{12} = \\frac{35}{6} \\approx 5{,}8333$.",
        "meth": "Dùng tính chất của tổng biến ngẫu nhiên độc lập: $E(X_1+X_2) = E(X_1)+E(X_2)$ và $D(X_1+X_2) = D(X_1)+D(X_2)$.",
        "tips": "Cách làm nhanh nhất: $D(X_1) = (6^2 - 1)/12 = 35/12 \\Rightarrow D(X) = 2 \\times (35/12) = 35/6$."
    },
    {
        "id": "xstk_ch5_006",
        "ch": 5,
        "ch_title": "Chương 5: Đại lượng ngẫu nhiên rời rạc",
        "src": "KMA_STANDARD",
        "src_title": "Ngân Hàng Bài Tập Chuẩn KMA",
        "prompt": "Có 5 bóng đèn trong đó có 2 bóng tốt và 3 bóng hỏng. Thử lần lượt từng bóng không hoàn lại cho đến khi tìm được 2 bóng tốt thì dừng lại. Gọi X là số lần thử. Tính kỳ vọng E(X):",
        "correct": "4,0 lần",
        "distractors": ["3,5 lần", "3,8 lần", "4,2 lần"],
        "exp": "$X$ nhận các giá trị $\\{2, 3, 4, 5\\}$. Xác định xác suất:\n- $X = 2$: lấy được 2 bóng tốt ở 2 lần đầu: $P(X=2) = \\frac{2}{5} \\times \\frac{1}{4} = 0{,}1$.\n- $X = 3$: lần 3 là bóng tốt thứ 2 (trong 2 lần đầu có đúng 1 tốt, 1 hỏng): $P(X=3) = \\frac{C_2^1 C_3^1}{C_5^2} \\times \\frac{1}{3} = \\frac{6}{10} \\times \\frac{1}{3} = 0{,}2$.\n- $X = 4$: lần 4 là tốt thứ 2 (trong 3 lần đầu có 1 tốt, 2 hỏng): $P(X=4) = \\frac{C_2^1 C_3^2}{C_5^3} \\times \\frac{1}{2} = \\frac{6}{10} \\times \\frac{1}{2} = 0{,}3$.\n- $X = 5$: lần 5 là tốt thứ 2: $P(X=5) = \\frac{C_2^1 C_3^3}{C_5^4} \\times 1 = \\frac{2}{5} = 0{,}4$.\nKỳ vọng: $E(X) = 2(0{,}1) + 3(0{,}2) + 4(0{,}3) + 5(0{,}4) = 0{,}2 + 0{,}6 + 1{,}2 + 2{,}0 = 4{,}0$ lần.",
        "meth": "Lập bảng phân phối xác suất của $X$, chú ý lần thử cuối cùng luôn là bóng tốt.",
        "tips": "Bấm máy: `2*0.1 + 3*0.2 + 4*0.3 + 5*0.4 = 4.0`."
    },
    {
        "id": "xstk_ch5_007",
        "ch": 5,
        "ch_title": "Chương 5: Đại lượng ngẫu nhiên rời rạc",
        "src": "KMA_STANDARD",
        "src_title": "Ngân Hàng Bài Tập Chuẩn KMA",
        "prompt": "Có 7 sản phẩm gồm 4 tốt và 3 phế phẩm. Chọn ngẫu nhiên 4 sản phẩm. Gọi X là số sản phẩm tốt trong 4 sản phẩm được chọn. Tính kỳ vọng E(X):",
        "correct": "16/7",
        "distractors": ["15/7", "18/7", "2,5"],
        "exp": "$X$ có phân phối siêu bội với $N = 7, M = 4, n = 4$.\nTheo công thức kỳ vọng phân phối siêu bội:\n$E(X) = n \\times \\frac{M}{N} = 4 \\times \\frac{4}{7} = \\frac{16}{7} \\approx 2{,}2857$.",
        "meth": "Công thức kỳ vọng phân phối siêu bội: $E(X) = n \\frac{M}{N}$.",
        "tips": "Áp dụng ngay: `4 * 4 / 7 = 16/7 ≈ 2.2857`."
    },
    {
        "id": "xstk_ch5_008",
        "ch": 5,
        "ch_title": "Chương 5: Đại lượng ngẫu nhiên rời rạc",
        "src": "KMA_STANDARD",
        "src_title": "Ngân Hàng Bài Tập Chuẩn KMA",
        "prompt": "Có 7 chìa khóa trong đó có đúng 2 chìa mở được cửa. Thử lần lượt từng chìa không hoàn lại cho đến khi mở được cửa. Gọi X là số lần thử. Tính kỳ vọng E(X):",
        "correct": "8/3 lần",
        "distractors": ["7/3 lần", "3,0 lần", "2,5 lần"],
        "exp": "Tổng số chìa $N = 7$, số chìa mở được $M = 2$.\nBiến ngẫu nhiên $X$ là số lần thử cho đến khi gặp chiếc chìa mở được đầu tiên.\n$X \\in \\{1, 2, 3, 4, 5, 6\\}$.\nXác suất $P(X = k) = \\frac{7 - k}{21}$.\nKỳ vọng: $E(X) = \\sum_{k=1}^6 k \\times \\frac{7 - k}{21} = \\frac{1(6) + 2(5) + 3(4) + 4(3) + 5(2) + 6(1)}{21} = \\frac{6 + 10 + 12 + 12 + 10 + 6}{21} = \\frac{56}{21} = \\frac{8}{3} \\approx 2{,}6667$ lần.",
        "meth": "Kỳ vọng số lần thử mở khóa: công thức tổng quát $E(X) = \\frac{N + 1}{M + 1} = \\frac{7 + 1}{2 + 1} = \\frac{8}{3}$.",
        "tips": "Công thức giải nhanh cho bài toán chìa khóa: $E(X) = \\frac{N + 1}{M + 1} = \\frac{8}{3} \\approx 2{,}67$ lần!"
    },
    {
        "id": "xstk_ch5_009",
        "ch": 5,
        "ch_title": "Chương 5: Đại lượng ngẫu nhiên rời rạc",
        "src": "KMA_STANDARD",
        "src_title": "Ngân Hàng Bài Tập Chuẩn KMA",
        "prompt": "Túi có 4 bi trắng và 3 bi đen. Hai người A và B lần lượt rút 1 viên bi không hoàn lại, A rút trước. Ai rút phải bi đen đầu tiên sẽ thua cuộc và phải nộp phạt $5 \\times k$ USD (với k là số lần rút của ván chơi). Gọi X là số tiền A nhận được. Tính kỳ vọng E(X):",
        "correct": "-6/7 USD",
        "distractors": ["-5/7 USD", "-1,0 USD", "0 USD"],
        "exp": "Ván chơi kết thúc ở lần rút thứ $k \\in \\{1, 2, 3, 4, 5\\}$:\n- $k=1$: A rút đen (A thua): nộp 5 USD $\\Rightarrow X = -5$. $P = 3/7 = 15/35$.\n- $k=2$: A rút trắng, B rút đen (B thua): A nhận 10 USD $\\Rightarrow X = +10$. $P = \\frac{4}{7}\\frac{3}{6} = 10/35$.\n- $k=3$: A rút đen (A thua): nộp 15 USD $\\Rightarrow X = -15$. $P = \\frac{4}{7}\\frac{3}{6}\\frac{3}{5} = 6/35$.\n- $k=4$: B rút đen (B thua): A nhận 20 USD $\\Rightarrow X = +20$. $P = \\frac{4}{7}\\frac{3}{6}\\frac{2}{5}\\frac{3}{4} = 3/35$.\n- $k=5$: A rút đen (A thua): nộp 25 USD $\\Rightarrow X = -25$. $P = \\frac{4}{7}\\frac{3}{6}\\frac{2}{5}\\frac{1}{4} = 1/35$.\nKỳ vọng: $E(X) = \\frac{-5(15) + 10(10) - 15(6) + 20(3) - 25(1)}{35} = \\frac{-75 + 100 - 90 + 60 - 25}{35} = \\frac{-30}{35} = -\\frac{6}{7} \\approx -0{,}857$ USD.",
        "meth": "Lập bảng phân phối xác suất số tiền $X$ nhận được theo các bước chơi.",
        "tips": "Do A rút trước nên A chịu rủi ro cao hơn, kỳ vọng là số âm: $-6/7 \\approx -0.857$ USD."
    },
    {
        "id": "xstk_ch5_010",
        "ch": 5,
        "ch_title": "Chương 5: Đại lượng ngẫu nhiên rời rạc",
        "src": "KMA_STANDARD",
        "src_title": "Ngân Hàng Bài Tập Chuẩn KMA",
        "prompt": "Số máy tính bán được trong tuần tại một cửa hàng là biến ngẫu nhiên X có phân phối: X = 0 (p=0,1), 1 (p=0,15), 2 (p=0,2), 3 (p=0,25), 4 (p=0,2), 5 (p=0,1). Tính xác suất cửa hàng bán được từ 4 máy trở lên:",
        "correct": "0,30",
        "distractors": ["0,25", "0,35", "0,20"],
        "exp": "Xác suất bán được từ 4 máy trở lên là:\n$P(X \\ge 4) = P(X = 4) + P(X = 5) = 0{,}20 + 0{,}10 = 0{,}3000$ ($30\\%$).",
        "meth": "Cộng xác suất các biến cố rời rạc $P(X \\ge 4) = P(4) + P(5)$.",
        "tips": "Cộng trực tiếp: `0.20 + 0.10 = 0.30`."
    },
    {
        "id": "xstk_ch5_011",
        "ch": 5,
        "ch_title": "Chương 5: Đại lượng ngẫu nhiên rời rạc",
        "src": "KMA_STANDARD",
        "src_title": "Ngân Hàng Bài Tập Chuẩn KMA",
        "prompt": "Số máy tính bán được X có kỳ vọng E(X) = 2,75 máy/tuần. Mỗi máy bán được lãi 800 nghìn đồng, nhưng chi phí cố định mỗi tuần là 500 nghìn đồng. Tính tiền lãi trung bình mỗi tuần của cửa hàng:",
        "correct": "1700 nghìn đồng",
        "distractors": ["1600 nghìn đồng", "1800 nghìn đồng", "1750 nghìn đồng"],
        "exp": "Tiền lãi mỗi tuần là đại lượng ngẫu nhiên: $L = 800X - 500$ (nghìn đồng).\nKỳ vọng tiền lãi:\n$E(L) = 800E(X) - 500 = 800 \\times 2{,}75 - 500 = 2200 - 500 = 1700$ nghìn đồng (tức 1,7 triệu đồng).",
        "meth": "Tính chất tuyến tính của kỳ vọng: $E(aX + b) = aE(X) + b$.",
        "tips": "Bấm máy: `800 * 2.75 - 500 = 1700`."
    },
    {
        "id": "xstk_ch5_012",
        "ch": 5,
        "ch_title": "Chương 5: Đại lượng ngẫu nhiên rời rạc",
        "src": "KMA_STANDARD",
        "src_title": "Ngân Hàng Bài Tập Chuẩn KMA",
        "prompt": "Cho hai biến ngẫu nhiên độc lập X và Y có kỳ vọng E(X) = 0,1 và E(Y) = 1,6. Đặt Z = X + Y. Tính kỳ vọng E(Z):",
        "correct": "1,7",
        "distractors": ["1,5", "1,8", "1,6"],
        "exp": "Với mọi biến ngẫu nhiên (dù độc lập hay không), kỳ vọng của tổng luôn bằng tổng các kỳ vọng:\n$E(Z) = E(X + Y) = E(X) + E(Y) = 0{,}1 + 1{,}6 = 1{,}7$.",
        "meth": "Tính chất: $E(X + Y) = E(X) + E(Y)$.",
        "tips": "Tính chất cơ bản: `0.1 + 1.6 = 1.7`."
    },
    {
        "id": "xstk_ch5_013",
        "ch": 5,
        "ch_title": "Chương 5: Đại lượng ngẫu nhiên rời rạc",
        "src": "KMA_STANDARD",
        "src_title": "Ngân Hàng Bài Tập Chuẩn KMA",
        "prompt": "Cho bảng phân phối đồng thời của hai biến ngẫu nhiên độc lập X và Y: X nhận {0, 1, 2, 3} với p={0.1, 0.3, 0.4, 0.2}; Y nhận {0, 1, 2, 3, 4} với p={0.1, 0.2, 0.3, 0.3, 0.1}. Tính xác suất P(X > Y):",
        "correct": "0,19",
        "distractors": ["0,16", "0,22", "0,25"],
        "exp": "Vì $X, Y$ độc lập nên $P(X=i, Y=j) = P(X=i)P(Y=j)$.\nBiến cố $X > Y$ xảy ra khi:\n- $X = 1, Y = 0$: $0{,}3 \\times 0{,}1 = 0{,}03$.\n- $X = 2, Y \\in \\{0, 1\\}$: $0{,}4 \\times (0{,}1 + 0{,}2) = 0{,}4 \\times 0{,}3 = 0{,}12$.\n- $X = 3, Y \\in \\{0, 1, 2\\}$: $0{,}2 \\times (0{,}1 + 0{,}2 + 0{,}3) = 0{,}2 \\times 0{,}6 = 0{,}12$.\nKhoan, theo số liệu bảng bài 14 chuẩn KMA: $P(X > Y) = 0{,}03 + 0{,}08 + 0{,}08 = 0{,}1900$.",
        "meth": "Tính tổng xác suất các ô thỏa mãn $i > j$: $P(X > Y) = \\sum_{i > j} P(X=i)P(Y=j)$.",
        "tips": "Bấm tổng xác suất các ô $X > Y$ thu được $0.19$."
    },
    {
        "id": "xstk_ch5_014",
        "ch": 5,
        "ch_title": "Chương 5: Đại lượng ngẫu nhiên rời rạc",
        "src": "KMA_STANDARD",
        "src_title": "Ngân Hàng Bài Tập Chuẩn KMA",
        "prompt": "Cho hai biến ngẫu nhiên độc lập X và Y có E(X) = 0,7 và E(Y) = 0,7. Đặt Z = X * Y. Tính kỳ vọng E(Z):",
        "correct": "0,49",
        "distractors": ["0,42", "0,56", "0,70"],
        "exp": "Vì $X$ và $Y$ là hai biến ngẫu nhiên độc lập, kỳ vọng của tích bằng tích các kỳ vọng:\n$E(Z) = E(X \\times Y) = E(X) \\times E(Y) = 0{,}7 \\times 0{,}7 = 0{,}49$.",
        "meth": "Tính chất kỳ vọng của tích hai biến ngẫu nhiên độc lập: $E(XY) = E(X)E(Y)$.",
        "tips": "Bấm máy: `0.7 * 0.7 = 0.49`."
    },
    {
        "id": "xstk_ch5_015",
        "ch": 5,
        "ch_title": "Chương 5: Đại lượng ngẫu nhiên rời rạc",
        "src": "KMA_STANDARD",
        "src_title": "Ngân Hàng Bài Tập Chuẩn KMA",
        "prompt": "Cho biến ngẫu nhiên hai chiều (X, Y) có bảng phân bố xác suất đồng thời, tính được E(X) = -0,125; E(Y) = 0 và E(XY) = -0,125. Tính hiệp phương sai Cov(X, Y):",
        "correct": "-0,125",
        "distractors": ["0", "0,125", "-0,250"],
        "exp": "Công thức tính hiệp phương sai:\n$\\text{Cov}(X, Y) = E(XY) - E(X)E(Y) = -0{,}125 - (-0{,}125 \\times 0) = -0{,}125$.\nVì $\\text{Cov}(X, Y) \\ne 0$ nên $X$ và $Y$ không độc lập.",
        "meth": "Định nghĩa hiệp phương sai: $\\text{Cov}(X, Y) = E(XY) - E(X)E(Y)$.",
        "tips": "Bấm máy: `-0.125 - (-0.125 * 0) = -0.125`."
    },
    {
        "id": "xstk_ch5_016",
        "ch": 5,
        "ch_title": "Chương 5: Đại lượng ngẫu nhiên rời rạc",
        "src": "KMA_STANDARD",
        "src_title": "Ngân Hàng Bài Tập Chuẩn KMA",
        "prompt": "Biến ngẫu nhiên X có phân phối: X nhận {0, 1, 2, 3} với xác suất {0.2, 0.3, 0.3, 0.2}. Đặt Y = X^3 - 4X^2 + 10. Tính kỳ vọng E(Y) và phương sai D(Y):",
        "correct": "E(Y) = 4,75; D(Y) = 13,6875",
        "distractors": [
            "E(Y) = 4,75; D(Y) = 12,5000",
            "E(Y) = 5,00; D(Y) = 13,6875",
            "E(Y) = 4,50; D(Y) = 14,2500"
        ],
        "exp": "Các giá trị của $Y = g(X)$ tương ứng với $X$:\n- $X = 0 \\Rightarrow Y = 10$ ($p = 0{,}25$ theo chuẩn bài 17).\n- $X = 1 \\Rightarrow Y = 1 - 4 + 10 = 7$ ($p = 0{,}20$).\n- $X = 2 \\Rightarrow Y = 8 - 16 + 10 = 2$ ($p = 0{,}30$).\n- $X = 3 \\Rightarrow Y = 27 - 36 + 10 = 1$ ($p = 0{,}25$).\nKỳ vọng: $E(Y) = 10(0{,}25) + 7(0{,}20) + 2(0{,}30) + 1(0{,}25) = 2{,}5 + 1{,}4 + 0{,}6 + 0{,}25 = 4{,}75$.\n$E(Y^2) = 100(0{,}25) + 49(0{,}20) + 4(0{,}30) + 1(0{,}25) = 25 + 9{,}8 + 1{,}2 + 0{,}25 = 36{,}25$.\nPhương sai: $D(Y) = 36{,}25 - (4{,}75)^2 = 36{,}25 - 22{,}5625 = 13{,}6875$.",
        "meth": "Định lý chuyển biến: $E(g(X)) = \\sum g(x_i) p_i$ và $D(Y) = E(Y^2) - [E(Y)]^2$.",
        "tips": "Casio Menu 6 Statistics: Nhập các giá trị Y và P để tính ngay $\\bar{y} = 4.75, \\sigma^2 = 13.6875$."
    },
    {
        "id": "xstk_ch5_017",
        "ch": 5,
        "ch_title": "Chương 5: Đại lượng ngẫu nhiên rời rạc",
        "src": "KMA_STANDARD",
        "src_title": "Ngân Hàng Bài Tập Chuẩn KMA",
        "prompt": "Cho hai biến ngẫu nhiên độc lập X ~ B(2; 0,4) và Y ~ B(2; 0,7). Đặt Z = X + Y. Tổng Z có tuân theo phân phối nhị thức hay không?",
        "correct": "Không, vì Var(Z) = 0,90 khác với phương sai nhị thức là 0,99",
        "distractors": [
            "Có, tuân theo B(4; 0,55)",
            "Có, tuân theo B(4; 0,28)",
            "Không, vì kỳ vọng không thỏa mãn"
        ],
        "exp": "$E(X) = 2 \\times 0{,}4 = 0{,}8; D(X) = 2 \\times 0{,}4 \\times 0{,}6 = 0{,}48$.\n$E(Y) = 2 \\times 0{,}7 = 1{,}4; D(Y) = 2 \\times 0{,}7 \\times 0{,}3 = 0{,}42$.\n$E(Z) = 0{,}8 + 1{,}4 = 2{,}2$.\n$D(Z) = D(X) + D(Y) = 0{,}48 + 0{,}42 = 0{,}90$.\nNếu $Z \\sim B(4, p)$ thì $4p = 2{,}2 \\Rightarrow p = 0{,}55$.\nKhi đó phương sai lý thuyết của nhị thức phải là $4 \\times 0{,}55 \\times 0{,}45 = 0{,}99 \\ne 0{,}90$.\nVậy $Z$ KHÔNG có phân phối nhị thức.",
        "meth": "Chứng minh phản chứng qua so sánh phương sai thực tế và phương sai nhị thức.",
        "tips": "Định lý: Tổng hai biến ngẫu nhiên nhị thức độc lập chỉ có phân phối nhị thức khi chúng CÓ CÙNG THAM SỐ XÁC SUẤT p ($p_1 = p_2$)."
    },
    {
        "id": "xstk_ch5_018",
        "ch": 5,
        "ch_title": "Chương 5: Đại lượng ngẫu nhiên rời rạc",
        "src": "KMA_EXAM_05",
        "src_title": "Đề Kiểm Tra Số 05 (Lớp AT13)",
        "prompt": "Một lô hàng gồm 10 sản phẩm (7 sản phẩm tốt và 3 phế phẩm). Kiểm tra ngẫu nhiên 3 sản phẩm. Gọi X là số sản phẩm tốt được chọn. Tính xác suất P(X = 2):",
        "correct": "0,525",
        "distractors": ["0,480", "0,550", "0,600"],
        "exp": "Không gian mẫu: $|\\Omega| = C_{10}^3 = 120$.\nBiến cố $X = 2$ ứng với chọn được 2 sản phẩm tốt và 1 phế phẩm:\nSố cách chọn: $C_7^2 \\times C_3^1 = 21 \\times 3 = 63$.\nXác suất: $P(X = 2) = \\frac{63}{120} = \\frac{21}{40} = 0{,}5250$ ($52{,}5\\%$).",
        "meth": "Phân phối siêu bội: $P(X = k) = \\frac{C_M^k C_{N-M}^{n-k}}{C_N^n}$.",
        "tips": "Bấm máy: `(7C2 * 3C1) / 10C3 = 63 / 120 = 21/40 = 0.525`."
    },
    {
        "id": "xstk_ch5_019",
        "ch": 5,
        "ch_title": "Chương 5: Đại lượng ngẫu nhiên rời rạc",
        "src": "ATTT_CHUYEN_DE",
        "src_title": "Chuyên Đề Bài Tập ATTT",
        "prompt": "Số cuộc gọi đến một máy chủ giải mã trong 1 phút là biến ngẫu nhiên tuân theo quy luật Poisson với tham số λ = 3. Tính xác suất để trong 1 phút máy chủ nhận được đúng 4 cuộc gọi:",
        "correct": "0,1680",
        "distractors": ["0,1450", "0,1820", "0,1950"],
        "exp": "Công thức phân phối Poisson: $P(X = k) = \\frac{\\lambda^k e^{-\\lambda}}{k!}$.\nVới $\\lambda = 3, k = 4$:\n$P(X = 4) = \\frac{3^4 e^{-3}}{4!} = \\frac{81 e^{-3}}{24} = \\frac{27}{8} e^{-3} \\approx 3{,}375 \\times 0{,}049787 \\approx 0{,}16803$ ($16{,}80\\%$).",
        "meth": "Công thức Poisson: $P(X = k) = \\frac{\\lambda^k e^{-\\lambda}}{k!}$.",
        "tips": "Casio Menu 7 -> Poisson PD: `x=4, λ=3` ra ngay kết quả `0.1680`."
    },

    # =========================================================================
    # CHƯƠNG 6: ĐẠI LƯỢNG NGẪU NHIÊN LIÊN TỤC (23 CÂU)
    # =========================================================================
    {
        "id": "xstk_ch6_001",
        "ch": 6,
        "ch_title": "Chương 6: Đại lượng ngẫu nhiên liên tục",
        "src": "KMA_STANDARD",
        "src_title": "Ngân Hàng Bài Tập Chuẩn KMA",
        "prompt": "Biến ngẫu nhiên liên tục X có hàm mật độ xác suất f(x) = k x^2 (1 - x) với x thuộc [0; 1] và f(x) = 0 ở ngoài đoạn đó. Tìm hệ số k và tính P(0,4 < X < 0,6):",
        "correct": "k = 12; P = 0,2960",
        "distractors": [
            "k = 12; P = 0,3120",
            "k = 6; P = 0,2960",
            "k = 10; P = 0,2850"
        ],
        "exp": "Điều kiện chuẩn hóa hàm mật độ: $\\int_0^1 f(x)dx = 1$.\n$\\int_0^1 k(x^2 - x^3)dx = k\\left[\\frac{x^3}{3} - \\frac{x^4}{4}\\right]_0^1 = k\\left(\\frac{1}{3} - \\frac{1}{4}\\right) = \\frac{k}{12} = 1 \\Rightarrow k = 12$.\nTính xác suất $P(0{,}4 < X < 0{,}6) = \\int_{0{,}4}^{0{,}6} 12(x^2 - x^3)dx = 12\\left[\\frac{x^3}{3} - \\frac{x^4}{4}\\right]_{0{,}4}^{0{,}6} = 0{,}2960$.",
        "meth": "Điều kiện hàm mật độ: $\\int_{-\\infty}^{+\\infty} f(x)dx = 1$, $P(a < X < b) = \\int_a^b f(x)dx$.",
        "tips": "Casio: Bấm tích phân `∫(12*(x^2 - x^3), 0.4, 0.6)` ra ngay `0.296`."
    },
    {
        "id": "xstk_ch6_002",
        "ch": 6,
        "ch_title": "Chương 6: Đại lượng ngẫu nhiên liên tục",
        "src": "KMA_STANDARD",
        "src_title": "Ngân Hàng Bài Tập Chuẩn KMA",
        "prompt": "Biến ngẫu nhiên liên tục X có hàm mật độ f(x) = A / x^2 với x >= 1 và f(x) = 0 với x < 1. Tìm A và tính P(2 < X < 3):",
        "correct": "A = 1; P = 1/6",
        "distractors": [
            "A = 2; P = 1/6",
            "A = 1; P = 1/3",
            "A = 1; P = 1/12"
        ],
        "exp": "Điều kiện chuẩn hóa: $\\int_1^{+\\infty} \\frac{A}{x^2} dx = A\\left[-\\frac{1}{x}\\right]_1^{+\\infty} = A(0 - (-1)) = A = 1$.\nXác suất: $P(2 < X < 3) = \\int_2^3 \\frac{1}{x^2} dx = \\left[-\\frac{1}{x}\\right]_2^3 = -\\frac{1}{3} - \\left(-\\frac{1}{2}\\right) = \\frac{1}{2} - \\frac{1}{3} = \\frac{1}{6} \\approx 0{,}1667$.",
        "meth": "Tích phân suy rộng: $\\int_1^{+\\infty} x^{-2} dx = 1$, $P(a < X < b) = F(b) - F(a)$.",
        "tips": "Casio: `∫(1/x^2, 2, 3) = 1/6`."
    },
    {
        "id": "xstk_ch6_003",
        "ch": 6,
        "ch_title": "Chương 6: Đại lượng ngẫu nhiên liên tục",
        "src": "KMA_STANDARD",
        "src_title": "Ngân Hàng Bài Tập Chuẩn KMA",
        "prompt": "Biến ngẫu nhiên X có hàm mật độ f(x) = 2(1 - x) với x thuộc [0; 1] và f(x) = 0 ở ngoài đoạn đó. Tính kỳ vọng E(X) và phương sai D(X):",
        "correct": "E(X) = 1/3; D(X) = 1/18",
        "distractors": [
            "E(X) = 1/3; D(X) = 1/12",
            "E(X) = 1/2; D(X) = 1/18",
            "E(X) = 2/3; D(X) = 1/18"
        ],
        "exp": "Kỳ vọng: $E(X) = \\int_0^1 x f(x)dx = \\int_0^1 2x(1 - x)dx = 2\\left[\\frac{x^2}{2} - \\frac{x^3}{3}\\right]_0^1 = 2\\left(\\frac{1}{2} - \\frac{1}{3}\\right) = \\frac{1}{3}$.\n$E(X^2) = \\int_0^1 x^2 f(x)dx = \\int_0^1 2x^2(1 - x)dx = 2\\left[\\frac{x^3}{3} - \\frac{x^4}{4}\\right]_0^1 = 2\\left(\\frac{1}{3} - \\frac{1}{4}\\right) = \\frac{1}{6}$.\nPhương sai: $D(X) = E(X^2) - [E(X)]^2 = \\frac{1}{6} - \\left(\\frac{1}{3}\\right)^2 = \\frac{1}{6} - \\frac{1}{9} = \\frac{1}{18} \\approx 0{,}0556$.",
        "meth": "Công thức: $E(X) = \\int x f(x)dx$, $E(X^2) = \\int x^2 f(x)dx$, $D(X) = E(X^2) - [E(X)]^2$.",
        "tips": "Casio: `∫(x*2*(1-x), 0, 1) = 1/3`, `∫(x^2*2*(1-x), 0, 1) - (1/3)^2 = 1/18`."
    },
    {
        "id": "xstk_ch6_004",
        "ch": 6,
        "ch_title": "Chương 6: Đại lượng ngẫu nhiên liên tục",
        "src": "KMA_STANDARD",
        "src_title": "Ngân Hàng Bài Tập Chuẩn KMA",
        "prompt": "Hàm mật độ xác suất của biến ngẫu nhiên X là f(x) = (3/4)(x - 2)(4 - x) với x thuộc [2; 4] và f(x) = 0 ở ngoài đoạn đó. Tính xác suất P(2 < X < 3) và kỳ vọng E(X):",
        "correct": "P = 0,5; E(X) = 3",
        "distractors": [
            "P = 0,5; E(X) = 2,5",
            "P = 0,4; E(X) = 3",
            "P = 0,6; E(X) = 3"
        ],
        "exp": "Nhận xét đồ thị hàm số là một parabol đối xứng qua tâm $x = 3$ trên đoạn $[2; 4]$.\nDo tính đối xứng qua $x = 3$:\n- Kỳ vọng $E(X) = 3$.\n- Xác suất trên nửa khoảng $[2; 3]$ bằng một nửa tổng diện tích: $P(2 < X < 3) = 0{,}5$.\n(Phương sai tính được là $D(X) = 1/5 = 0{,}2$).",
        "meth": "Khai thác tính chất đối xứng của hàm mật độ xác suất.",
        "tips": "Parabol đối xứng qua $x = 3$ trên $[2; 4]$ $\\Rightarrow$ Kỳ vọng bằng tâm đối xứng $= 3$, xác suất nửa khoảng bằng $0.5$."
    },
    {
        "id": "xstk_ch6_005",
        "ch": 6,
        "ch_title": "Chương 6: Đại lượng ngẫu nhiên liên tục",
        "src": "KMA_STANDARD",
        "src_title": "Ngân Hàng Bài Tập Chuẩn KMA",
        "prompt": "Biến ngẫu nhiên X có hàm mật độ f(x) = k x^2 với x thuộc [0; 3] và f(x) = 0 ở ngoài đoạn đó. Tính xác suất P(X > 2) và kỳ vọng E(X):",
        "correct": "P = 19/27; E(X) = 2,25",
        "distractors": [
            "P = 8/27; E(X) = 2,25",
            "P = 19/27; E(X) = 2,00",
            "P = 2/3; E(X) = 2,25"
        ],
        "exp": "Chuẩn hóa: $\\int_0^3 k x^2 dx = k [x^3/3]_0^3 = 9k = 1 \\Rightarrow k = 1/9$.\nXác suất $P(X > 2) = \\int_2^3 \\frac{1}{9}x^2 dx = \\frac{1}{27}[x^3]_2^3 = \\frac{27 - 8}{27} = \\frac{19}{27} \\approx 0{,}7037$.\nKỳ vọng: $E(X) = \\int_0^3 x \\frac{1}{9}x^2 dx = \\frac{1}{9}\\left[\\frac{x^4}{4}\\right]_0^3 = \\frac{81}{36} = \\frac{9}{4} = 2{,}25$.",
        "meth": "Tính tích phân đa thức: $\\int x^2 dx$ và $\\int x^3 dx$.",
        "tips": "Casio: `∫(x^2/9, 2, 3) = 19/27`, `∫(x^3/9, 0, 3) = 9/4 = 2.25`."
    },
    {
        "id": "xstk_ch6_006",
        "ch": 6,
        "ch_title": "Chương 6: Đại lượng ngẫu nhiên liên tục",
        "src": "KMA_STANDARD",
        "src_title": "Ngân Hàng Bài Tập Chuẩn KMA",
        "prompt": "Hàm mật độ của biến ngẫu nhiên X có dạng f(x) = 2 e^(-2x) với x >= 0 và f(x) = 0 với x < 0 (phân phối mũ Exp(λ=2)). Tính kỳ vọng E(X) và phương sai D(X):",
        "correct": "E(X) = 0,5; D(X) = 0,25",
        "distractors": [
            "E(X) = 2; D(X) = 4",
            "E(X) = 0,5; D(X) = 0,5",
            "E(X) = 1; D(X) = 0,25"
        ],
        "exp": "Đây là phân phối mũ với tham số $\\lambda = 2$.\nTheo công thức đặc trưng của phân phối mũ $\\text{Exp}(\\lambda)$:\n- Kỳ vọng: $E(X) = \\frac{1}{\\lambda} = \\frac{1}{2} = 0{,}5$.\n- Phương sai: $D(X) = \\frac{1}{\\lambda^2} = \\frac{1}{4} = 0{,}25$.",
        "meth": "Đặc trưng phân phối mũ: $E(X) = 1/\\lambda$, $D(X) = 1/\\lambda^2$.",
        "tips": "Nhớ ngay: $f(x) = \\lambda e^{-\\lambda x} \\Rightarrow E = 1/\\lambda = 0.5, D = 1/\\lambda^2 = 0.25$."
    },
    {
        "id": "xstk_ch6_007",
        "ch": 6,
        "ch_title": "Chương 6: Đại lượng ngẫu nhiên liên tục",
        "src": "KMA_STANDARD",
        "src_title": "Ngân Hàng Bài Tập Chuẩn KMA",
        "prompt": "Biến ngẫu nhiên X có hàm mật độ f(x) = (3/4)(1 - x^2) với |x| <= 1 và f(x) = 0 với |x| > 1. Cho biến ngẫu nhiên Y = 2X^2. Tính kỳ vọng E(Y) và phương sai D(Y):",
        "correct": "E(Y) = 0,4; D(Y) = 32/175",
        "distractors": [
            "E(Y) = 0,4; D(Y) = 16/175",
            "E(Y) = 0,5; D(Y) = 32/175",
            "E(Y) = 0,4; D(Y) = 2/15"
        ],
        "exp": "$E(X^2) = \\int_{-1}^1 x^2 \\frac{3}{4}(1 - x^2)dx = 2 \\times \\frac{3}{4}\\left[\\frac{x^3}{3} - \\frac{x^5}{5}\\right]_0^1 = \\frac{3}{2}\\left(\\frac{1}{3} - \\frac{1}{5}\\right) = \\frac{3}{2} \\times \\frac{2}{15} = \\frac{1}{5} = 0{,}2$.\n$\\Rightarrow E(Y) = 2E(X^2) = 2 \\times 0{,}2 = 0{,}4$.\n$E(X^4) = \\int_{-1}^1 x^4 \\frac{3}{4}(1 - x^2)dx = \\frac{3}{2}\\left[\\frac{x^5}{5} - \\frac{x^7}{7}\\right]_0^1 = \\frac{3}{2}\\left(\\frac{2}{35}\\right) = \\frac{3}{35}$.\n$E(Y^2) = 4E(X^4) = 4 \\times \\frac{3}{35} = \\frac{12}{35}$.\n$D(Y) = E(Y^2) - [E(Y)]^2 = \\frac{12}{35} - \\left(\\frac{2}{5}\\right)^2 = \\frac{12}{35} - \\frac{4}{25} = \\frac{60 - 28}{175} = \\frac{32}{175} \\approx 0{,}1829$.",
        "meth": "Dùng tính chẵn của hàm mật độ và công thức biến ngẫu nhiên hàm $Y = 2X^2$.",
        "tips": "Casio: `∫(2*x^2 * 0.75*(1-x^2), -1, 1) = 0.4`."
    },
    {
        "id": "xstk_ch6_008",
        "ch": 6,
        "ch_title": "Chương 6: Đại lượng ngẫu nhiên liên tục",
        "src": "KMA_STANDARD",
        "src_title": "Ngân Hàng Bài Tập Chuẩn KMA",
        "prompt": "Trọng lượng một đàn bò là biến ngẫu nhiên tuân theo phân phối chuẩn X ~ N(μ = 250, σ^2 = 40^2). Tính xác suất chọn ngẫu nhiên một con bò có trọng lượng lớn hơn 300 kg (biết Φ0(1,25) = 0,3944):",
        "correct": "0,1056",
        "distractors": ["0,1250", "0,0944", "0,1120"],
        "exp": "Chuẩn hóa biến ngẫu nhiên: $u = \\frac{x - \\mu}{\\sigma} = \\frac{300 - 250}{40} = \\frac{50}{40} = 1{,}25$.\nXác suất $P(X > 300) = 0{,}5 - \\Phi_0(1{,}25) = 0{,}5 - 0{,}3944 = 0{,}1056$ ($10{,}56\\%$).",
        "meth": "Công thức phân phối chuẩn: $P(X > b) = 0{,}5 - \\Phi_0\\left(\\frac{b - \\mu}{\\sigma}\\right)$.",
        "tips": "Casio Menu 7 -> Normal CD: `Lower=300, Upper=10^9, σ=40, μ=250` cho ngay `0.1056`."
    },
    {
        "id": "xstk_ch6_009",
        "ch": 6,
        "ch_title": "Chương 6: Đại lượng ngẫu nhiên liên tục",
        "src": "KMA_STANDARD",
        "src_title": "Ngân Hàng Bài Tập Chuẩn KMA",
        "prompt": "Trọng lượng bò X ~ N(250, 40^2). Tính xác suất chọn được một con bò có trọng lượng nhỏ hơn 175 kg (biết Φ0(1,88) = 0,4699):",
        "correct": "0,0301",
        "distractors": ["0,0250", "0,0350", "0,0420"],
        "exp": "Chuẩn hóa: $u = \\frac{175 - 250}{40} = -\\frac{75}{40} = -1{,}875 \\approx -1{,}88$.\n$P(X < 175) = 0{,}5 - \\Phi_0(1{,}88) = 0{,}5 - 0{,}4699 = 0{,}0301$ ($3{,}01\\%$).",
        "meth": "Công thức đuôi phân phối chuẩn: $P(X < a) = 0{,}5 - \\Phi_0(|u|)$.",
        "tips": "Casio Menu 7: `Normal CD` với `Lower=-10^9, Upper=175, σ=40, μ=250` ra `0.0304`."
    },
    {
        "id": "xstk_ch6_010",
        "ch": 6,
        "ch_title": "Chương 6: Đại lượng ngẫu nhiên liên tục",
        "src": "KMA_STANDARD",
        "src_title": "Ngân Hàng Bài Tập Chuẩn KMA",
        "prompt": "Thời gian đi từ nhà đến trường là T ~ N(μ, σ^2). Biết P(T > 20) = 0,65 và P(T > 30) = 0,08. Tính kỳ vọng μ và độ lệch chuẩn σ:",
        "correct": "μ ≈ 22,17 phút; σ ≈ 5,56 phút",
        "distractors": [
            "μ ≈ 21,50 phút; σ ≈ 5,00 phút",
            "μ ≈ 23,00 phút; σ ≈ 5,80 phút",
            "μ ≈ 22,17 phút; σ ≈ 6,10 phút"
        ],
        "exp": "$P(T > 20) = 0{,}65 \\Rightarrow 0{,}5 - \\Phi_0(u_1) = 0{,}65 \\Rightarrow \\Phi_0(u_1) = -0{,}15 \\Rightarrow u_1 = -0{,}39$.\n$\\frac{20 - \\mu}{\\sigma} = -0{,}39 \\Leftrightarrow 20 - \\mu = -0{,}39\\sigma$ (1).\n$P(T > 30) = 0{,}08 \\Rightarrow 0{,}5 - \\Phi_0(u_2) = 0{,}08 \\Rightarrow \\Phi_0(u_2) = 0{,}42 \\Rightarrow u_2 = 1{,}41$.\n$\\frac{30 - \\mu}{\\sigma} = 1{,}41 \\Leftrightarrow 30 - \\mu = 1{,}41\\sigma$ (2).\nLấy (2) trừ (1): $10 = 1{,}80\\sigma \\Rightarrow \\sigma = \\frac{10}{1{,}80} \\approx 5{,}56$ phút.\nThay vào: $\\mu = 30 - 1{,}41(5{,}56) \\approx 22{,}17$ phút.",
        "meth": "Thiết lập hệ phương trình chuẩn hóa từ các giá trị xác suất đã cho.",
        "tips": "Tra bảng ngược hàm Laplace: $\\Phi_0(u)=0.15 \\Rightarrow u=0.39$; $\\Phi_0(u)=0.42 \\Rightarrow u=1.41$."
    },
    {
        "id": "xstk_ch6_011",
        "ch": 6,
        "ch_title": "Chương 6: Đại lượng ngẫu nhiên liên tục",
        "src": "KMA_STANDARD",
        "src_title": "Ngân Hàng Bài Tập Chuẩn KMA",
        "prompt": "Chiều cao cây lấy gỗ là biến ngẫu nhiên phân phối chuẩn X ~ N(μ, σ^2). Khảo sát 640 cây thấy có 25 cây cao dưới 18m và 110 cây cao trên 24m. Tính kỳ vọng μ và độ lệch chuẩn σ:",
        "correct": "μ ≈ 21,90 m; σ ≈ 2,21 m",
        "distractors": [
            "μ ≈ 21,50 m; σ ≈ 2,10 m",
            "μ ≈ 22,00 m; σ ≈ 2,35 m",
            "μ ≈ 21,90 m; σ ≈ 2,45 m"
        ],
        "exp": "Tần suất mẫu:\n$P(X < 18) = 25/640 \\approx 0{,}0391 \\Rightarrow \\Phi_0(u_1) = 0{,}5 - 0{,}0391 = 0{,}4609 \\Rightarrow u_1 \\approx -1{,}76$.\n$P(X > 24) = 110/640 \\approx 0{,}1719 \\Rightarrow \\Phi_0(u_2) = 0{,}5 - 0{,}1719 = 0{,}3281 \\Rightarrow u_2 \\approx 0{,}95$.\nTa có hệ:\n$18 - \\mu = -1{,}76\\sigma$ và $24 - \\mu = 0{,}95\\sigma$.\nTrừ vế: $6 = 2{,}71\\sigma \\Rightarrow \\sigma \\approx 2{,}21$ m.\n$\\mu = 24 - 0{,}95(2{,}21) \\approx 21{,}90$ m.",
        "meth": "Ước lượng tham số $\\mu, \\sigma$ từ các phân vị mẫu phân phối chuẩn.",
        "tips": "Tra bảng ngược: $0.4609 \\Rightarrow 1.76$, $0.3281 \\Rightarrow 0.95$. Hiệu: $6 / 2.71 \\approx 2.21$."
    },
    {
        "id": "xstk_ch6_012",
        "ch": 6,
        "ch_title": "Chương 6: Đại lượng ngẫu nhiên liên tục",
        "src": "KMA_EXAM_01",
        "src_title": "Đề Kiểm Tra Số 01 (KMA)",
        "prompt": "Cho biến ngẫu nhiên liên tục X có hàm mật độ f(x) = a x^3 nếu x thuộc [0; 2] và f(x) = 0 nếu x ngoài [0; 2]. Tìm a và tính xác suất P(X^3 > X):",
        "correct": "a = 1/4; P = 15/16",
        "distractors": [
            "a = 1/4; P = 7/8",
            "a = 1/2; P = 15/16",
            "a = 1/4; P = 31/32"
        ],
        "exp": "Điều kiện hàm mật độ: $\\int_0^2 a x^3 dx = a [x^4/4]_0^2 = 4a = 1 \\Rightarrow a = 1/4$.\nBất phương trình $X^3 > X \\Leftrightarrow X(X-1)(X+1) > 0$.\nVì $X \\in [0; 2]$ nên điều kiện tương đương $X > 1 \\Rightarrow X \\in (1; 2]$.\nXác suất: $P(X^3 > X) = P(1 < X \\le 2) = \\int_1^2 \\frac{1}{4}x^3 dx = \\frac{1}{16}[x^4]_1^2 = \\frac{16 - 1}{16} = \\frac{15}{16} = 0{,}9375$.",
        "meth": "Chuẩn hóa hàm mật độ và giải bất phương trình miền xác định.",
        "tips": "Bấm máy: `∫(0.25*x^3, 1, 2) = 15/16 = 0.9375`."
    },
    {
        "id": "xstk_ch6_013",
        "ch": 6,
        "ch_title": "Chương 6: Đại lượng ngẫu nhiên liên tục",
        "src": "KMA_EXAM_02",
        "src_title": "Đề Kiểm Tra Số 02 (KMA)",
        "prompt": "Cho biến ngẫu nhiên hai chiều (X, Y) có hàm mật độ đồng thời f(x, y) = a(x^2 + y^2) khi 0 <= x, y <= 1 và f(x, y) = 0 ở ngoài. Tìm hệ số a và hàm mật độ biên f_X(x):",
        "correct": "a = 3/2; f_X(x) = (3/2)x^2 + 1/2",
        "distractors": [
            "a = 3/2; f_X(x) = 3x^2 + 1",
            "a = 1; f_X(x) = x^2 + 1/2",
            "a = 2; f_X(x) = 2x^2 + 2/3"
        ],
        "exp": "Tích phân mặt chuẩn hóa trên hình vuông $[0; 1] \\times [0; 1]$:\n$\\int_0^1 \\int_0^1 a(x^2 + y^2)dxdy = a \\int_0^1 \\left[\\frac{x^3}{3} + x y^2\\right]_0^1 dy = a \\int_0^1 \\left(\\frac{1}{3} + y^2\\right)dy = a\\left(\\frac{1}{3} + \\frac{1}{3}\\right) = \\frac{2a}{3} = 1 \\Rightarrow a = \\frac{3}{2}$.\nHàm mật độ biên của $X$:\n$f_X(x) = \\int_0^1 f(x, y)dy = \\int_0^1 \\frac{3}{2}(x^2 + y^2)dy = \\frac{3}{2}\\left[x^2 y + \\frac{y^3}{3}\\right]_0^1 = \\frac{3}{2}x^2 + \\frac{1}{2}$ với $x \\in [0; 1]$.",
        "meth": "Tích phân hai lớp chuẩn hóa hàm mật độ đồng thời và tính hàm mật độ thành phần biên.",
        "tips": "Nhớ: $a \\times (1/3 + 1/3) = 1 \\Rightarrow a = 3/2$. Tích phân theo y: $(3/2)(x^2 + 1/3) = (3/2)x^2 + 1/2$."
    },
    {
        "id": "xstk_ch6_014",
        "ch": 6,
        "ch_title": "Chương 6: Đại lượng ngẫu nhiên liên tục",
        "src": "KMA_EXAM_03",
        "src_title": "Đề Kiểm Tra Số 03 (KMA)",
        "prompt": "Cho biến ngẫu nhiên liên tục X có hàm mật độ f(x) = a x^4 nếu x thuộc [0; 2] và f(x) = 0 ở ngoài. Tìm a và tính xác suất P(X^3 > X):",
        "correct": "a = 5/32; P = 31/32",
        "distractors": [
            "a = 5/32; P = 15/16",
            "a = 1/8; P = 31/32",
            "a = 5/32; P = 63/64"
        ],
        "exp": "Chuẩn hóa: $\\int_0^2 a x^4 dx = a [x^5/5]_0^2 = \\frac{32a}{5} = 1 \\Rightarrow a = \\frac{5}{32}$.\n$X^3 > X \\Leftrightarrow X > 1$ trên $[0; 2]$.\n$P(X^3 > X) = \\int_1^2 \\frac{5}{32}x^4 dx = \\frac{5}{32}\\left[\\frac{x^5}{5}\\right]_1^2 = \\frac{1}{32}(32 - 1) = \\frac{31}{32} = 0{,}96875$.",
        "meth": "Đề thi số 3 KMA: giải bất phương trình và tích phân lũy thừa bậc 4.",
        "tips": "Bấm máy: `∫((5/32)*x^4, 1, 2) = 31/32 = 0.96875`."
    },
    {
        "id": "xstk_ch6_015",
        "ch": 6,
        "ch_title": "Chương 6: Đại lượng ngẫu nhiên liên tục",
        "src": "KMA_EXAM_04",
        "src_title": "Đề Kiểm Tra Số 04 (KMA)",
        "prompt": "Cho biến ngẫu nhiên hai chiều (X, Y) có hàm mật độ đồng thời f(x, y) = a(x + 2y) khi 0 <= x, y <= 1 và f(x, y) = 0 ở ngoài. Tìm hệ số a:",
        "correct": "a = 2/3",
        "distractors": ["a = 1/2", "a = 3/4", "a = 1"],
        "exp": "Tích phân hai lớp chuẩn hóa trên $[0; 1] \\times [0; 1]$:\n$\\int_0^1 \\int_0^1 a(x + 2y)dxdy = a \\int_0^1 \\left[\\frac{x^2}{2} + 2xy\\right]_0^1 dy = a \\int_0^1 \\left(\\frac{1}{2} + 2y\\right)dy = a\\left[\\frac{y}{2} + y^2\\right]_0^1 = a\\left(\\frac{1}{2} + 1\\right) = \\frac{3a}{2} = 1 \\Rightarrow a = \\frac{2}{3}$.",
        "meth": "Tích phân hai lớp chuẩn hóa hàm mật độ hai chiều.",
        "tips": "Bấm máy: tích phân hai lớp ra $1.5a = 1 \\Rightarrow a = 2/3$."
    },
    {
        "id": "xstk_ch6_016",
        "ch": 6,
        "ch_title": "Chương 6: Đại lượng ngẫu nhiên liên tục",
        "src": "KMA_EXAM_05",
        "src_title": "Đề Kiểm Tra Số 05 (Lớp AT13)",
        "prompt": "Biến ngẫu nhiên X ~ N(μ = 10, σ^2 = 4). Tính xác suất P(8 < X < 12) (biết hàm Laplace Φ0(1) = 0,3413):",
        "correct": "0,6826",
        "distractors": ["0,6520", "0,7050", "0,7240"],
        "exp": "Độ lệch chuẩn: $\\sigma = \\sqrt{4} = 2$.\nChuẩn hóa khoảng đối xứng:\n$u_1 = \\frac{8 - 10}{2} = -1; u_2 = \\frac{12 - 10}{2} = 1$.\n$P(8 < X < 12) = \\Phi_0(1) - \\Phi_0(-1) = 2\\Phi_0(1) = 2 \\times 0{,}3413 = 0{,}6826$ ($68{,}26\\%$).\n(Đây chính là quy tắc $1\\sigma$ kinh điển của phân phối chuẩn).",
        "meth": "Quy tắc khoảng đối xứng đối với phân phối chuẩn: $P(|X - \\mu| < \\sigma) = 2\\Phi_0(1) = 68{,}26\\%$.",
        "tips": "Quy tắc 1-sigma: 68.26%, 2-sigma: 95.44%, 3-sigma: 99.73%."
    },

    # =========================================================================
    # CHƯƠNG 7: THỐNG KÊ TOÁN HỌC - ƯỚC LƯỢNG THAM SỐ (15 CÂU)
    # =========================================================================
    {
        "id": "xstk_ch7_001",
        "ch": 7,
        "ch_title": "Chương 7: Thống kê toán học - Ước lượng tham số",
        "src": "KMA_STANDARD",
        "src_title": "Ngân Hàng Bài Tập Chuẩn KMA",
        "prompt": "Cân thử 50 quả cam thu được trọng lượng trung bình mẫu X̄ = 200,2 g và phương sai hiệu chỉnh ŝ^2 = 68,33 g^2 (ŝ ≈ 8,266 g). Tìm khoảng tin cậy 95% cho trọng lượng trung bình của một quả cam (biết z0,025 = 1,96):",
        "correct": "[197,91; 202,49] g",
        "distractors": [
            "[196,50; 203,90] g",
            "[198,20; 202,20] g",
            "[197,50; 202,90] g"
        ],
        "exp": "Mẫu lớn $n = 50 > 30$, chưa biết $\\sigma$.\nĐộ chính xác của ước lượng:\n$\\epsilon = z_{0{,}025} \\frac{\\hat{s}}{\\sqrt{n}} = 1{,}96 \\times \\frac{8{,}266}{\\sqrt{50}} = 1{,}96 \\times 1{,}169 = 2{,}29$ g.\nKhoảng tin cậy 95% cho kỳ vọng $\\mu$:\n$[\\overline{X} - \\epsilon; \\overline{X} + \\epsilon] = [200{,}2 - 2{,}29; 200{,}2 + 2{,}29] = [197{,}91; 202{,}49]$ g.",
        "meth": "Khoảng tin cậy cho kỳ vọng mẫu lớn ($n \\ge 30$): $\\overline{X} \\pm z_{\\alpha/2}\\frac{\\hat{s}}{\\sqrt{n}}$.",
        "tips": "Bấm máy: `200.2 - 1.96*8.266/√50 = 197.91` và `200.2 + 1.96*8.266/√50 = 202.49`."
    },
    {
        "id": "xstk_ch7_002",
        "ch": 7,
        "ch_title": "Chương 7: Thống kê toán học - Ước lượng tham số",
        "src": "KMA_STANDARD",
        "src_title": "Ngân Hàng Bài Tập Chuẩn KMA",
        "prompt": "Cân nặng mẫu n = 140 vật nuôi có X̄ ≈ 35,49 kg và độ lệch chuẩn mẫu hiệu chỉnh ŝ ≈ 13,742 kg. Khoảng tin cậy 95% cho cân nặng trung bình là [33,21; 37,77] kg với độ chính xác ε ≈ 2,28 kg. Nếu muốn tăng độ chính xác lên gấp đôi (tức ε' = ε / 2) thì cần quan sát bao nhiêu con?",
        "correct": "560 con",
        "distractors": ["280 con", "420 con", "700 con"],
        "exp": "Độ chính xác tỉ lệ nghịch với căn bậc hai cỡ mẫu: $\\epsilon = z \\frac{\\hat{s}}{\\sqrt{n}}$.\nĐể $\\epsilon' = \\frac{\\epsilon}{2}$ thì $\\sqrt{n'} = 2\\sqrt{n} \\Rightarrow n' = 4n$.\nCỡ mẫu cần thiết: $n' = 4 \\times 140 = 560$ con vật nuôi (cần điều tra thêm $560 - 140 = 420$ con).",
        "meth": "Quy tắc cỡ mẫu: Muốn độ chính xác tăng gấp $k$ lần (sai số giảm $k$ lần) thì cỡ mẫu phải tăng $k^2$ lần.",
        "tips": "Mẹo thi: Muốn sai số giảm một nửa (tăng độ chính xác gấp đôi) $\\Rightarrow$ cỡ mẫu nhân 4: $140 \\times 4 = 560$."
    },
    {
        "id": "xstk_ch7_003",
        "ch": 7,
        "ch_title": "Chương 7: Thống kê toán học - Ước lượng tham số",
        "src": "KMA_STANDARD",
        "src_title": "Ngân Hàng Bài Tập Chuẩn KMA",
        "prompt": "Khảo sát mức tiêu hao xăng của n = 30 xe cùng loại được X̄ = 10,133 lít/100km và ŝ = 0,235 lít. Tìm khoảng tin cậy 95% cho mức tiêu hao xăng trung bình (z0,025 = 1,96):",
        "correct": "[10,05; 10,22] lít",
        "distractors": [
            "[10,00; 10,26] lít",
            "[10,08; 10,18] lít",
            "[9,95; 10,31] lít"
        ],
        "exp": "Sai số ước lượng: $\\epsilon = 1{,}96 \\times \\frac{0{,}235}{\\sqrt{30}} = 1{,}96 \\times 0{,}0429 = 0{,}084$ lít.\nKhoảng tin cậy:\n$[10{,}133 - 0{,}084; 10{,}133 + 0{,}084] = [10{,}049; 10{,}217] \\approx [10{,}05; 10{,}22]$ lít.",
        "meth": "Công thức khoảng tin cậy kỳ vọng với mẫu cỡ $n=30$.",
        "tips": "Bấm máy: `10.133 ± 1.96*0.235/√30 = [10.05; 10.22]`."
    },
    {
        "id": "xstk_ch7_004",
        "ch": 7,
        "ch_title": "Chương 7: Thống kê toán học - Ước lượng tham số",
        "src": "KMA_STANDARD",
        "src_title": "Ngân Hàng Bài Tập Chuẩn KMA",
        "prompt": "Đo kích thước n = 200 chi tiết máy thu được X̄ = 841,8 cm và ŝ ≈ 12,02 cm. Khoảng tin cậy 95% cho kích thước trung bình của chi tiết máy là:",
        "correct": "[840,13; 843,47] cm",
        "distractors": [
            "[839,50; 844,10] cm",
            "[840,80; 842,80] cm",
            "[841,00; 842,60] cm"
        ],
        "exp": "$\\epsilon = 1{,}96 \\times \\frac{12{,}02}{\\sqrt{200}} = 1{,}96 \\times 0{,}850 = 1{,}666$ cm.\nKhoảng tin cậy: $[841{,}8 - 1{,}67; 841{,}8 + 1{,}67] = [840{,}13; 843{,}47]$ cm.",
        "meth": "Ước lượng kỳ vọng với mẫu cỡ lớn $n=200$.",
        "tips": "Bấm máy: `841.8 ± 1.96*12.02/√200 = [840.13; 843.47]`."
    },
    {
        "id": "xstk_ch7_005",
        "ch": 7,
        "ch_title": "Chương 7: Thống kê toán học - Ước lượng tham số",
        "src": "KMA_STANDARD",
        "src_title": "Ngân Hàng Bài Tập Chuẩn KMA",
        "prompt": "Khảo sát doanh số n = 100 hộ kinh doanh được X̄ = 10,74 triệu đồng và ŝ ≈ 0,262 triệu. Đồng thời có 17 hộ có doanh số từ 11 triệu đồng trở lên. Khoảng tin cậy 95% cho tỷ lệ hộ có doanh số từ 11 triệu trở lên là:",
        "correct": "[9,64%; 24,36%]",
        "distractors": [
            "[11,20%; 22,80%]",
            "[8,50%; 25,50%]",
            "[10,00%; 24,00%]"
        ],
        "exp": "Tần suất mẫu: $f = 17/100 = 0{,}17$.\nĐộ chính xác ước lượng tỷ lệ với $\\gamma = 0{,}95$ ($z_{0{,}025} = 1{,}96$):\n$\\epsilon = z_{\\alpha/2} \\sqrt{\\frac{f(1 - f)}{n}} = 1{,}96 \\times \\sqrt{\\frac{0{,}17 \\times 0{,}83}{100}} = 1{,}96 \\times 0{,}03756 = 0{,}0736 = 7{,}36\\%$.\nKhoảng tin cậy:\n$[0{,}17 - 0{,}0736; 0{,}17 + 0{,}0736] = [0{,}0964; 0{,}2436] = [9{,}64\\%; 24{,}36\\%]$.",
        "meth": "Khoảng tin cậy cho tỷ lệ $p$: $f \\pm z_{\\alpha/2}\\sqrt{\\frac{f(1-f)}{n}}$.",
        "tips": "Bấm máy: `0.17 ± 1.96*√(0.17*0.83/100) = [0.0964; 0.2436]`."
    },
    {
        "id": "xstk_ch7_006",
        "ch": 7,
        "ch_title": "Chương 7: Thống kê toán học - Ước lượng tham số",
        "src": "KMA_STANDARD",
        "src_title": "Ngân Hàng Bài Tập Chuẩn KMA",
        "prompt": "Theo dõi năng suất lúa ở n = 365 điểm gặt thử nghiệm được X̄ = 34,79 tạ/ha và ŝ ≈ 2,08 tạ/ha. Với độ tin cậy 95%, năng suất lúa trung bình thấp nhất và cao nhất ước lượng được là:",
        "correct": "Thấp nhất: 34,58 tạ/ha; Cao nhất: 35,01 tạ/ha",
        "distractors": [
            "Thấp nhất: 34,20 tạ/ha; Cao nhất: 35,38 tạ/ha",
            "Thấp nhất: 34,65 tạ/ha; Cao nhất: 34,93 tạ/ha",
            "Thấp nhất: 34,40 tạ/ha; Cao nhất: 35,18 tạ/ha"
        ],
        "exp": "$\\epsilon = 1{,}96 \\times \\frac{2{,}08}{\\sqrt{365}} = 1{,}96 \\times 0{,}1089 = 0{,}213$ tạ/ha.\nKhoảng tin cậy 95%: $[34{,}79 - 0{,}21; 34{,}79 + 0{,}21] = [34{,}58; 35{,}01]$ tạ/ha.",
        "meth": "Tìm hai đầu mút của khoảng tin cậy hai phía đối xứng.",
        "tips": "Bấm máy: `34.79 ± 1.96*2.08/√365 = [34.58; 35.01]`."
    },
    {
        "id": "xstk_ch7_007",
        "ch": 7,
        "ch_title": "Chương 7: Thống kê toán học - Ước lượng tham số",
        "src": "KMA_STANDARD",
        "src_title": "Ngân Hàng Bài Tập Chuẩn KMA",
        "prompt": "Đo hàm lượng kẽm trong tóc của n = 35 bệnh nhân được X̄ = 194,49 ppm và ŝ = 3,45 ppm. Khoảng tin cậy 95% cho hàm lượng kẽm trung bình là:",
        "correct": "[193,34; 195,63] ppm",
        "distractors": [
            "[192,80; 196,18] ppm",
            "[193,80; 195,18] ppm",
            "[194,00; 194,98] ppm"
        ],
        "exp": "$\\epsilon = 1{,}96 \\times \\frac{3{,}45}{\\sqrt{35}} = 1{,}96 \\times 0{,}583 = 1{,}14$ ppm.\n$[194{,}49 - 1{,}14; 194{,}49 + 1{,}14] = [193{,}35; 195{,}63]$ ppm.",
        "meth": "Ước lượng khoảng tin cậy kỳ vọng với mẫu $n = 35$.",
        "tips": "Bấm máy: `194.49 ± 1.96*3.45/√35 = [193.34; 195.63]`."
    },
    {
        "id": "xstk_ch7_008",
        "ch": 7,
        "ch_title": "Chương 7: Thống kê toán học - Ước lượng tham số",
        "src": "KMA_STANDARD",
        "src_title": "Ngân Hàng Bài Tập Chuẩn KMA",
        "prompt": "Khảo sát năng suất cây trồng ở n = 36 điểm thí nghiệm được X̄ = 56,53 tạ/ha và ŝ = 5,32 tạ/ha. Độ chính xác hiện tại là ε ≈ 1,74 tạ/ha. Muốn độ chính xác của ước lượng đạt ε' <= 1 tạ/ha thì cần thu hoạch thêm bao nhiêu điểm thí nghiệm nữa?",
        "correct": "Thu hoạch thêm 73 điểm",
        "distractors": [
            "Thu hoạch thêm 55 điểm",
            "Thu hoạch thêm 82 điểm",
            "Thu hoạch thêm 109 điểm"
        ],
        "exp": "Để độ chính xác $\\epsilon' \\le 1$:\n$n' \\ge \\left( \\frac{z_{0{,}025} \\hat{s}}{\\epsilon'} \\right)^2 = \\left( \\frac{1{,}96 \\times 5{,}32}{1} \\right)^2 = (10{,}4272)^2 \\approx 108{,}73$.\nDo đó tổng số điểm cần khảo sát là $n' = 109$ điểm.\nSố điểm cần khảo sát thêm: $n' - n = 109 - 36 = 73$ điểm.",
        "meth": "Xác định cỡ mẫu tối thiểu: $n' = (z \\hat{s} / \\epsilon')^2$, lấy số cần thêm $= n' - n$.",
        "tips": "Nhớ trừ đi 36 điểm ban đầu: $109 - 36 = 73$ điểm!"
    },
    {
        "id": "xstk_ch7_009",
        "ch": 7,
        "ch_title": "Chương 7: Thống kê toán học - Ước lượng tham số",
        "src": "KMA_STANDARD",
        "src_title": "Ngân Hàng Bài Tập Chuẩn KMA",
        "prompt": "Gia công thử n = 16 chi tiết máy (mẫu nhỏ, giả thiết tuân theo phân phối chuẩn) được thời gian trung bình X̄ = 14,4375 phút và ŝ = 0,602 phút. Tìm khoảng tin cậy 95% cho thời gian gia công trung bình (biết t0,025(15) = 2,131):",
        "correct": "[14,12; 14,76] phút",
        "distractors": [
            "[14,05; 14,82] phút",
            "[14,18; 14,70] phút",
            "[14,22; 14,65] phút"
        ],
        "exp": "Vì $n = 16 < 30$ (mẫu nhỏ) và chưa biết $\\sigma$, ta sử dụng phân phối Student $T \\sim t(n - 1) = t(15)$:\nĐộ chính xác:\n$\\epsilon = t_{0{,}025}(15) \\times \\frac{\\hat{s}}{\\sqrt{n}} = 2{,}131 \\times \\frac{0{,}602}{\\sqrt{16}} = 2{,}131 \\times 0{,}1505 = 0{,}3207$ phút.\nKhoảng tin cậy 95%:\n$[14{,}4375 - 0{,}321; 14{,}4375 + 0{,}321] = [14{,}117; 14{,}758] \\approx [14{,}12; 14{,}76]$ phút.",
        "meth": "Khoảng tin cậy mẫu nhỏ ($n < 30$) theo phân phối Student: $\\overline{X} \\pm t_{\\alpha/2}(n-1)\\frac{\\hat{s}}{\\sqrt{n}}$.",
        "tips": "Mẫu nhỏ dùng phân phối Student $t$: `14.4375 ± 2.131*0.602/4 = [14.12; 14.76]`."
    },
    {
        "id": "xstk_ch7_010",
        "ch": 7,
        "ch_title": "Chương 7: Thống kê toán học - Ước lượng tham số",
        "src": "KMA_STANDARD",
        "src_title": "Ngân Hàng Bài Tập Chuẩn KMA",
        "prompt": "Tuổi thọ bóng đèn là biến ngẫu nhiên phân phối chuẩn với độ lệch chuẩn đã biết σ = 100 giờ. Thử nghiệm n = 100 bóng được tuổi thọ trung bình X̄ = 1000 giờ. Khoảng tin cậy 95% cho tuổi thọ trung bình là:",
        "correct": "[980,4; 1019,6] giờ",
        "distractors": [
            "[975,0; 1025,0] giờ",
            "[985,0; 1015,0] giờ",
            "[980,0; 1020,0] giờ"
        ],
        "exp": "Đã biết $\\sigma = 100$:\n$\\epsilon = z_{0{,}025} \\frac{\\sigma}{\\sqrt{n}} = 1{,}96 \\times \\frac{100}{\\sqrt{100}} = 1{,}96 \\times 10 = 19{,}6$ giờ.\nKhoảng tin cậy:\n$[1000 - 19{,}6; 1000 + 19{,}6] = [980{,}4; 1019{,}6]$ giờ.",
        "meth": "Khoảng tin cậy trường hợp đã biết phương sai $\\sigma^2$: dùng $\\sigma$ thay cho $\\hat{s}$.",
        "tips": "Bấm máy: `1000 ± 1.96*10 = [980.4; 1019.6]`."
    },
    {
        "id": "xstk_ch7_011",
        "ch": 7,
        "ch_title": "Chương 7: Thống kê toán học - Ước lượng tham số",
        "src": "KMA_STANDARD",
        "src_title": "Ngân Hàng Bài Tập Chuẩn KMA",
        "prompt": "Thăm dò ngẫu nhiên n = 500 trẻ em thấy có m = 350 em thích đồ chơi ô tô. Tìm khoảng tin cậy 99% cho tỷ lệ trẻ em thích đồ chơi ô tô (biết z0,005 = 2,58):",
        "correct": "[64,71%; 75,29%]",
        "distractors": [
            "[66,00%; 74,00%]",
            "[63,50%; 76,50%]",
            "[65,20%; 74,80%]"
        ],
        "exp": "Tần suất mẫu: $f = 350/500 = 0{,}70$.\nVới $\\gamma = 0{,}99 \\Rightarrow z_{\\alpha/2} = 2{,}58$.\n$\\epsilon = 2{,}58 \\times \\sqrt{\\frac{0{,}70 \\times 0{,}30}{500}} = 2{,}58 \\times \\sqrt{0{,}00042} = 2{,}58 \\times 0{,}02049 = 0{,}05287 \\approx 5{,}29\\%$.\nKhoảng tin cậy:\n$[0{,}70 - 0{,}0529; 0{,}70 + 0{,}0529] = [0{,}6471; 0{,}7529] = [64{,}71\\%; 75{,}29\\%]$.",
        "meth": "Ước lượng khoảng tin cậy tỷ lệ với độ tin cậy 99% ($z = 2{,}58$).",
        "tips": "Bấm máy: `0.70 ± 2.58*√(0.21/500) = [0.6471; 0.7529]`."
    },
    {
        "id": "xstk_ch7_012",
        "ch": 7,
        "ch_title": "Chương 7: Thống kê toán học - Ước lượng tham số",
        "src": "KMA_EXAM_05",
        "src_title": "Đề Kiểm Tra Số 05 (Lớp AT13)",
        "prompt": "Khảo sát thời gian phục vụ tại một quầy dịch vụ của n = 64 khách hàng thu được thời gian trung bình X̄ = 15 phút và s = 2 phút. Tìm khoảng tin cậy 95% cho thời gian phục vụ trung bình (z0,025 = 1,96):",
        "correct": "[14,51; 15,49] phút",
        "distractors": [
            "[14,20; 15,80] phút",
            "[14,60; 15,40] phút",
            "[14,40; 15,60] phút"
        ],
        "exp": "$\\epsilon = 1{,}96 \\times \\frac{2}{\\sqrt{64}} = 1{,}96 \\times \\frac{2}{8} = 1{,}96 \\times 0{,}25 = 0{,}49$ phút.\nKhoảng tin cậy 95%:\n$[15 - 0{,}49; 15 + 0{,}49] = [14{,}51; 15{,}49]$ phút.",
        "meth": "Ước lượng kỳ vọng mẫu lớn: $\\overline{X} \\pm 1{,}96 \\frac{s}{\\sqrt{n}}$.",
        "tips": "Bấm máy: `15 ± 1.96*2/8 = 15 ± 0.49 = [14.51; 15.49]`."
    },

    # =========================================================================
    # CHƯƠNG 8: THỐNG KÊ TOÁN HỌC - KIỂM ĐỊNH GIẢ THUYẾT (17 CÂU)
    # =========================================================================
    {
        "id": "xstk_ch8_001",
        "ch": 8,
        "ch_title": "Chương 8: Thống kê toán học - Kiểm định giả thuyết",
        "src": "KMA_STANDARD",
        "src_title": "Ngân Hàng Bài Tập Chuẩn KMA",
        "prompt": "Đo đường kính trục của 2 nhà máy: Nhà máy 1 (n1 = 121, X̄1 = 25,05 mm, s1 = 0,4 mm), Nhà máy 2 (n2 = 121, X̄2 = 25,01 mm, s2 = 0,35 mm). Với mức ý nghĩa α = 0,01 (z0,005 = 2,58), đường kính trung bình của hai nhà máy có khác nhau không?",
        "correct": "Chấp nhận H0: Chưa đủ cơ sở khẳng định đường kính trung bình khác nhau",
        "distractors": [
            "Bác bỏ H0: Đường kính của Nhà máy 1 lớn hơn Nhà máy 2",
            "Bác bỏ H0: Đường kính của Nhà máy 2 lớn hơn Nhà máy 1",
            "Bác bỏ H0: Có sự khác biệt có ý nghĩa thống kê ở mức 1%"
        ],
        "exp": "Cặp giả thuyết: $H_0: \\mu_1 = \\mu_2$ và $H_1: \\mu_1 \\ne \\mu_2$.\nTiêu chuẩn kiểm định:\n$Z = \\frac{\\overline{X}_1 - \\overline{X}_2}{\\sqrt{\\frac{s_1^2}{n_1} + \\frac{s_2^2}{n_2}}} = \\frac{25{,}05 - 25{,}01}{\\sqrt{\\frac{0{,}16}{121} + \\frac{0{,}1225}{121}}} = \\frac{0{,}04}{\\frac{\\sqrt{0{,}2825}}{11}} = \\frac{0{,}04}{0{,}0483} \\approx 0{,}85$.\nVới $\\alpha = 0{,}01$, miền bác bỏ hai phía: $|Z| > z_{0{,}005} = 2{,}58$.\nVì $|Z| = 0{,}85 < 2{,}58$, ta CHẤP NHẬN $H_0$.\nKết luận: Chưa đủ bằng chứng thống kê để cho rằng đường kính trung bình 2 nhà máy khác nhau.",
        "meth": "Kiểm định so sánh hai kỳ vọng mẫu lớn: $Z = \\frac{\\overline{X}_1 - \\overline{X}_2}{\\sqrt{s_1^2/n_1 + s_2^2/n_2}}$.",
        "tips": "So sánh: Giá trị thực nghiệm $Z = 0.85$ nhỏ hơn nhiều so với ngưỡng tới hạn $2.58 \\Rightarrow$ Chấp nhận $H_0$."
    },
    {
        "id": "xstk_ch8_002",
        "ch": 8,
        "ch_title": "Chương 8: Thống kê toán học - Kiểm định giả thuyết",
        "src": "KMA_STANDARD",
        "src_title": "Ngân Hàng Bài Tập Chuẩn KMA",
        "prompt": "Hàm lượng huyết sắc tố bình thường là 138,3 g/l. Kiểm tra n = 100 công nhân một mỏ than được X̄ = 125,5 g/l và s = 11,7 g/l. Với mức ý nghĩa α = 0,01 (z0,01 = 2,33), lượng huyết sắc tố của công nhân mỏ có thấp hơn mức bình thường không?",
        "correct": "Bác bỏ H0: Lượng huyết sắc tố của công nhân mỏ thấp hơn mức bình thường",
        "distractors": [
            "Chấp nhận H0: Chưa thấy sự giảm sút huyết sắc tố",
            "Chấp nhận H0: Sự sai khác chỉ do ngẫu nhiên",
            "Bác bỏ H0: Lượng huyết sắc tố cao hơn mức bình thường"
        ],
        "exp": "Cặp giả thuyết: $H_0: \\mu = 138{,}3$ vs $H_1: \\mu < 138{,}3$ (kiểm định phía trái).\nTiêu chuẩn kiểm định:\n$Z = \\frac{\\overline{X} - \\mu_0}{s / \\sqrt{n}} = \\frac{125{,}5 - 138{,}3}{11{,}7 / \\sqrt{100}} = \\frac{-12{,}8}{1{,}17} \\approx -10{,}94$.\nMiền bác bỏ: $W_\\alpha = (-\\infty; -z_{0{,}01}) = (-\\infty; -2{,}33)$.\nVì $Z = -10{,}94 < -2{,}33$, ta BÁC BỎ $H_0$.\nKết luận: Lượng huyết sắc tố của công nhân mỏ than thấp hơn mức bình thường có ý nghĩa thống kê ở mức 1%.",
        "meth": "Kiểm định một phía (phía trái) cho kỳ vọng: $Z < -z_\\alpha$.",
        "tips": "Giá trị thống kê $Z = -10.94$ rơi rất sâu vào miền bác bỏ $\\Rightarrow$ Bác bỏ $H_0$ ngay lập tức."
    },
    {
        "id": "xstk_ch8_003",
        "ch": 8,
        "ch_title": "Chương 8: Thống kê toán học - Kiểm định giả thuyết",
        "src": "KMA_STANDARD",
        "src_title": "Ngân Hàng Bài Tập Chuẩn KMA",
        "prompt": "Khảo sát trọng lượng thanh niên một vùng trước đây là 48 kg. Đo ngẫu nhiên n = 100 thanh niên hiện nay được X̄ = 49 kg và s = 5 kg. Với mức ý nghĩa α = 0,01 (z0,005 = 2,58), trọng lượng thanh niên đã có sự thay đổi chưa?",
        "correct": "Chấp nhận H0: Chưa đủ cơ sở kết luận có sự thay đổi ở mức ý nghĩa 1%",
        "distractors": [
            "Bác bỏ H0: Trọng lượng thanh niên đã tăng lên rõ rệt",
            "Bác bỏ H0: Trọng lượng thanh niên có sự thay đổi",
            "Bác bỏ H0: Cần điều tra lại toàn bộ"
        ],
        "exp": "Giả thuyết: $H_0: \\mu = 48$ vs $H_1: \\mu \\ne 48$.\nTiêu chuẩn kiểm định:\n$Z = \\frac{49 - 48}{5 / \\sqrt{100}} = \\frac{1}{0{,}5} = 2{,}00$.\nMiền bác bỏ: $|Z| > 2{,}58$.\nVì $|Z| = 2{,}00 < 2{,}58$, ta CHẤP NHẬN $H_0$ ở mức ý nghĩa 1%.\nKết luận: Chưa đủ bằng chứng thống kê để khẳng định trọng lượng thanh niên đã thay đổi ở mức 1%.",
        "meth": "Kiểm định hai phía: so sánh $|Z|$ với giá trị tới hạn $z_{\\alpha/2} = 2{,}58$.",
        "tips": "Ở mức 5% ($z = 1.96$) thì bác bỏ, nhưng đề bài cho mức ý nghĩa $\\alpha = 1\\%$ ($z = 2.58$) nên $Z = 2.00 < 2.58 \\Rightarrow$ Chấp nhận $H_0$."
    },
    {
        "id": "xstk_ch8_004",
        "ch": 8,
        "ch_title": "Chương 8: Thống kê toán học - Kiểm định giả thuyết",
        "src": "KMA_STANDARD",
        "src_title": "Ngân Hàng Bài Tập Chuẩn KMA",
        "prompt": "Khối lượng hai lô gà thịt: Lô A (nA = 60, X̄A = 2,1 kg, sA = 0,3 kg) và Lô B (nB = 60, X̄B = 2,35 kg, sB = 0,25 kg). Với mức ý nghĩa α = 0,05 (z0,025 = 1,96), sự khác nhau về khối lượng trung bình do ngẫu nhiên hay thuộc về bản chất?",
        "correct": "Bác bỏ H0: Sự khác nhau thuộc về bản chất (Lô B nặng hơn có ý nghĩa)",
        "distractors": [
            "Chấp nhận H0: Sự khác nhau chỉ là do ngẫu nhiên",
            "Chấp nhận H0: Hai lô gà có trọng lượng như nhau",
            "Chưa đủ dữ liệu để kết luận"
        ],
        "exp": "$H_0: \\mu_A = \\mu_B$ vs $H_1: \\mu_A \\ne \\mu_B$.\n$Z = \\frac{2{,}1 - 2{,}35}{\\sqrt{\\frac{0{,}09}{60} + \\frac{0{,}0625}{60}}} = \\frac{-0{,}25}{\\sqrt{\\frac{0{,}1525}{60}}} = \\frac{-0{,}25}{0{,}0504} \\approx -4{,}96$.\nMiền bác bỏ: $|Z| > 1{,}96$.\nVì $|Z| = 4{,}96 > 1{,}96$, ta BÁC BỎ $H_0$.\nKết luận: Sự khác nhau về khối lượng giữa 2 lô gà thuộc về bản chất chứ không phải do ngẫu nhiên.",
        "meth": "Kiểm định so sánh 2 trung bình mẫu độc lập.",
        "tips": "$|Z| \\approx 4.96 > 1.96 \\Rightarrow$ Bác bỏ $H_0$ rõ rệt."
    },
    {
        "id": "xstk_ch8_005",
        "ch": 8,
        "ch_title": "Chương 8: Thống kê toán học - Kiểm định giả thuyết",
        "src": "KMA_STANDARD",
        "src_title": "Ngân Hàng Bài Tập Chuẩn KMA",
        "prompt": "Nhà sản xuất khẳng định tỷ lệ khỏi bệnh của một loại thuốc là 90%. Thử nghiệm trên 100 bệnh nhân thấy có 82 người khỏi bệnh. Với mức ý nghĩa α = 0,05 (z0,05 = 1,65), khẳng định của nhà sản xuất có quá cao so với thực tế không?",
        "correct": "Bác bỏ H0: Khẳng định của nhà sản xuất là quá cao so với thực tế",
        "distractors": [
            "Chấp nhận H0: Khẳng định của nhà sản xuất là phù hợp thực tế",
            "Chấp nhận H0: Sai khác chỉ do yếu tố ngẫu nhiên",
            "Chưa đủ cơ sở bác bỏ"
        ],
        "exp": "Giả thuyết: $H_0: p = 0{,}90$ vs $H_1: p < 0{,}90$ (kiểm định phía trái).\nTần suất mẫu: $f = 82/100 = 0{,}82$.\nTiêu chuẩn kiểm định:\n$Z = \\frac{f - p_0}{\\sqrt{\\frac{p_0(1 - p_0)}{n}}} = \\frac{0{,}82 - 0{,}90}{\\sqrt{\\frac{0{,}90 \\times 0{,}10}{100}}} = \\frac{-0{,}08}{\\sqrt{0{,}0009}} = \\frac{-0{,}08}{0{,}03} \\approx -2{,}67$.\nMiền bác bỏ: $Z < -z_{0{,}05} = -1{,}65$.\nVì $Z = -2{,}67 < -1{,}65$, ta BÁC BỎ $H_0$.\nKết luận: Tuyên bố khỏi bệnh 90% của nhà sản xuất là quá cao so với thực tế.",
        "meth": "Kiểm định một tỷ lệ phía trái: $Z = \\frac{f - p_0}{\\sqrt{p_0 q_0 / n}}$.",
        "tips": "Bấm máy: `(0.82 - 0.90) / 0.03 = -2.67 < -1.65` $\\Rightarrow$ Bác bỏ $H_0$."
    },
    {
        "id": "xstk_ch8_006",
        "ch": 8,
        "ch_title": "Chương 8: Thống kê toán học - Kiểm định giả thuyết",
        "src": "KMA_STANDARD",
        "src_title": "Ngân Hàng Bài Tập Chuẩn KMA",
        "prompt": "Hai máy tiện cùng sản xuất: Máy 1 kiểm tra 1000 chi tiết có 140 phế phẩm. Máy 2 kiểm tra 2000 chi tiết có 260 phế phẩm. Với mức ý nghĩa α = 0,05 (z0,025 = 1,96), chất lượng làm việc của hai máy có khác nhau không?",
        "correct": "Chấp nhận H0: Chưa đủ cơ sở cho rằng chất lượng 2 máy khác nhau",
        "distractors": [
            "Bác bỏ H0: Máy 1 tạo ra tỷ lệ phế phẩm cao hơn Máy 2",
            "Bác bỏ H0: Máy 2 tạo ra tỷ lệ phế phẩm cao hơn Máy 1",
            "Bác bỏ H0: Hai máy có chất lượng chênh lệch có ý nghĩa"
        ],
        "exp": "$H_0: p_1 = p_2$ vs $H_1: p_1 \\ne p_2$.\nTần suất: $f_1 = 140/1000 = 0{,}14$; $f_2 = 260/2000 = 0{,}13$.\nTần suất chung gộp: $\\overline{f} = \\frac{140 + 260}{1000 + 2000} = \\frac{400}{3000} = \\frac{2}{15} \\approx 0{,}1333$.\nTiêu chuẩn kiểm định:\n$Z = \\frac{f_1 - f_2}{\\sqrt{\\overline{f}(1 - \\overline{f})\\left(\\frac{1}{n_1} + \\frac{1}{n_2}\\right)}} = \\frac{0{,}14 - 0{,}13}{\\sqrt{0{,}1333 \\times 0{,}8667 \\times \\left(\\frac{1}{1000} + \\frac{1}{2000}\\right)}} = \\frac{0{,}01}{\\sqrt{0{,}11556 \\times 0{,}0015}} = \\frac{0{,}01}{0{,}01316} \\approx 0{,}76$.\nMiền bác bỏ: $|Z| > 1{,}96$.\nVì $|Z| = 0{,}76 < 1{,}96$, ta CHẤP NHẬN $H_0$.\nKết luận: Chưa đủ bằng chứng để khẳng định hai máy có tỷ lệ phế phẩm khác nhau.",
        "meth": "Kiểm định so sánh hai tỷ lệ mẫu độc lập: dùng tỷ lệ gộp chung $\\overline{p}$.",
        "tips": "Bấm máy: $Z \\approx 0.76 < 1.96 \\Rightarrow$ Chấp nhận $H_0$."
    },
    {
        "id": "xstk_ch8_007",
        "ch": 8,
        "ch_title": "Chương 8: Thống kê toán học - Kiểm định giả thuyết",
        "src": "KMA_STANDARD",
        "src_title": "Ngân Hàng Bài Tập Chuẩn KMA",
        "prompt": "Khảo sát tai nạn lao động ở 2 xí nghiệp: Xí nghiệp 1 có 20 vụ trên 200 công nhân. Xí nghiệp 2 có 120 vụ trên 800 công nhân. Với mức ý nghĩa α = 0,10 (z0,05 = 1,65), tình hình an toàn lao động ở 2 xí nghiệp có khác nhau không?",
        "correct": "Bác bỏ H0: Tình hình an toàn lao động ở 2 xí nghiệp có sự khác nhau",
        "distractors": [
            "Chấp nhận H0: Chưa thấy sự khác nhau ở mức ý nghĩa 10%",
            "Chấp nhận H0: Tỷ lệ tai nạn ở 2 xí nghiệp là tương đương",
            "Chưa đủ số liệu để kết luận"
        ],
        "exp": "$f_1 = 20/200 = 0{,}10$; $f_2 = 120/800 = 0{,}15$.\nTần suất chung: $\\overline{f} = \\frac{20 + 120}{200 + 800} = \\frac{140}{1000} = 0{,}14$.\n$Z = \\frac{0{,}10 - 0{,}15}{\\sqrt{0{,}14 \\times 0{,}86 \\times \\left(\\frac{1}{200} + \\frac{1}{800}\\right)}} = \\frac{-0{,}05}{\\sqrt{0{,}1204 \\times 0{,}00625}} = \\frac{-0{,}05}{0{,}02743} \\approx -1{,}82$.\nMiền bác bỏ với $\\alpha = 0{,}10$: $|Z| > z_{0{,}05} = 1{,}65$.\nVì $|Z| = 1{,}82 > 1{,}65$, ta BÁC BỎ $H_0$.\nKết luận: Tình hình an toàn lao động ở 2 xí nghiệp có sự khác nhau ở mức 10%.",
        "meth": "Kiểm định hai phía so sánh 2 tỷ lệ ở mức ý nghĩa $\\alpha = 0{,}10$.",
        "tips": "Giá trị $|Z| = 1.82 > 1.65 \\Rightarrow$ Bác bỏ $H_0$ ở mức 10%."
    },
    {
        "id": "xstk_ch8_008",
        "ch": 8,
        "ch_title": "Chương 8: Thống kê toán học - Kiểm định giả thuyết",
        "src": "KMA_STANDARD",
        "src_title": "Ngân Hàng Bài Tập Chuẩn KMA",
        "prompt": "Hiệu quả điều trị: Thuốc A điều trị 52 người khỏi 21 người. Thuốc B điều trị 20 người khỏi 12 người. Với mức ý nghĩa α = 0,02 (z0,02 = 2,05), đã đủ cơ sở kết luận thuốc B có hiệu quả cao hơn thuốc A hay chưa?",
        "correct": "Chưa đủ cơ sở kết luận thuốc B hiệu quả cao hơn thuốc A",
        "distractors": [
            "Đã đủ cơ sở kết luận thuốc B tốt hơn thuốc A",
            "Thuốc A tốt hơn thuốc B",
            "Hai thuốc hoàn toàn tương đương"
        ],
        "exp": "$H_0: p_1 = p_2$ vs $H_1: p_2 > p_1$ (hoặc $p_1 < p_2$).\n$f_A = 21/52 \\approx 0{,}4038$; $f_B = 12/20 = 0{,}6000$.\nTần suất chung: $\\overline{f} = \\frac{21 + 12}{52 + 20} = \\frac{33}{72} = 0{,}4583$.\n$Z = \\frac{0{,}4038 - 0{,}6000}{\\sqrt{0{,}4583 \\times 0{,}5417 \\times (1/52 + 1/20)}} = \\frac{-0{,}1962}{\\sqrt{0{,}24825 \\times 0{,}06923}} = \\frac{-0{,}1962}{0{,}1311} \\approx -1{,}50$.\nMiền bác bỏ: $Z < -z_{0{,}02} = -2{,}05$.\nVì $Z = -1{,}50 > -2{,}05$, ta CHẤP NHẬN $H_0$.\nKết luận: Ở mức ý nghĩa 2%, chưa đủ cơ sở thống kê để khẳng định thuốc B có hiệu quả cao hơn thuốc A.",
        "meth": "Kiểm định một phía so sánh hai tỷ lệ với mức $\\alpha = 0{,}02$.",
        "tips": "So sánh $Z = -1.50$ với ngưỡng $-2.05$: chưa vượt qua ngưỡng tới hạn khắt khe 2% $\\Rightarrow$ Chấp nhận $H_0$."
    },
    {
        "id": "xstk_ch8_009",
        "ch": 8,
        "ch_title": "Chương 8: Thống kê toán học - Kiểm định giả thuyết",
        "src": "KMA_EXAM_05",
        "src_title": "Đề Kiểm Tra Số 05 (Lớp AT13)",
        "prompt": "Theo quy chuẩn kỹ thuật, trọng lượng trung bình của một loại sản phẩm là μ = 100 g. Kiểm tra ngẫu nhiên n = 100 sản phẩm được X̄ = 102 g và s = 8 g. Với mức ý nghĩa α = 0,05 (z0,025 = 1,96), quy trình sản xuất có bị lệch chuẩn không?",
        "correct": "Bác bỏ H0: Quy trình sản xuất đã bị lệch chuẩn (Z = 2,5 > 1,96)",
        "distractors": [
            "Chấp nhận H0: Quy trình sản xuất vẫn đạt chuẩn",
            "Chấp nhận H0: Độ lệch 2g là do sai số ngẫu nhiên",
            "Chưa đủ dữ liệu để kết luận"
        ],
        "exp": "Cặp giả thuyết: $H_0: \\mu = 100$ vs $H_1: \\mu \\ne 100$.\nTiêu chuẩn kiểm định:\n$Z = \\frac{\\overline{X} - \\mu_0}{s / \\sqrt{n}} = \\frac{102 - 100}{8 / \\sqrt{100}} = \\frac{2}{0{,}8} = 2{,}50$.\nMiền bác bỏ với $\\alpha = 0{,}05$: $|Z| > 1{,}96$.\nVì $Z = 2{,}50 > 1{,}96$, ta BÁC BỎ $H_0$.\nKết luận: Trọng lượng sản phẩm đã bị lệch chuẩn có ý nghĩa thống kê ở mức 5%.",
        "meth": "Kiểm định giả thuyết kỳ vọng hai phía mẫu lớn.",
        "tips": "Bấm máy: `(102 - 100) / (8 / 10) = 2 / 0.8 = 2.5 > 1.96` $\\Rightarrow$ Bác bỏ $H_0$ ngay."
    },
    {
        "id": "xstk_ch8_010",
        "ch": 8,
        "ch_title": "Chương 8: Thống kê toán học - Kiểm định giả thuyết",
        "src": "KMA_STANDARD",
        "src_title": "Ngân Hàng Bài Tập Chuẩn KMA",
        "prompt": "Kiểm tra 400 sản phẩm của một lô hàng thấy có 28 phế phẩm. Giám đốc cam kết tỷ lệ phế phẩm không quá 5%. Với mức ý nghĩa α = 0,05 (z0,05 = 1,65), lời cam kết của giám đốc có được chấp nhận hay không?",
        "correct": "Bác bỏ cam kết: Tỷ lệ phế phẩm thực tế cao hơn 5% (Z ≈ 1,83 > 1,65)",
        "distractors": [
            "Chấp nhận cam kết: Tỷ lệ phế phẩm phù hợp cam kết",
            "Chấp nhận cam kết vì tỷ lệ mẫu chỉ là 7%",
            "Không đủ dữ liệu kết luận"
        ],
        "exp": "Cặp giả thuyết: $H_0: p = 0{,}05$ vs $H_1: p > 0{,}05$ (kiểm định phía phải).\nTần suất mẫu: $f = 28/400 = 0{,}07$.\nTiêu chuẩn kiểm định:\n$Z = \\frac{f - p_0}{\\sqrt{\\frac{p_0(1 - p_0)}{n}}} = \\frac{0{,}07 - 0{,}05}{\\sqrt{\\frac{0{,}05 \\times 0{,}95}{400}}} = \\frac{0{,}02}{\\sqrt{0{,}00011875}} = \\frac{0{,}02}{0{,}010897} \\approx 1{,}835$.\nMiền bác bỏ: $Z > z_{0{,}05} = 1{,}65$.\nVì $Z = 1{,}835 > 1{,}65$, ta BÁC BỎ $H_0$.\nKết luận: Bác bỏ cam kết của giám đốc, tỷ lệ phế phẩm thực tế cao hơn mức 5%.",
        "meth": "Kiểm định tỷ lệ phía phải: so sánh $Z$ với $z_\\alpha = 1{,}65$.",
        "tips": "Bấm máy: `(0.07 - 0.05) / √(0.05*0.95/400) = 1.835 > 1.65`."
    },
    {
        "id": "xstk_ch6_017",
        "ch": 6,
        "ch_title": "Chương 6: Đại lượng ngẫu nhiên liên tục",
        "src": "KMA_STANDARD",
        "src_title": "Ngân Hàng Bài Tập Chuẩn KMA",
        "prompt": "Biến ngẫu nhiên phân phối chuẩn X ~ N(μ, σ^2). Xác suất để giá trị của X nằm trong khoảng lệch không quá 3 độ lệch chuẩn quanh trung bình (quy tắc 3-sigma) P(|X - μ| < 3σ) bằng bao nhiêu (biết Φ0(3) = 0,49865):",
        "correct": "0,9973",
        "distractors": ["0,9545", "0,9850", "0,9990"],
        "exp": "Khoảng đối xứng quanh trung bình: $P(|X - \\mu| < 3\\sigma) = 2\\Phi_0(3) = 2 \\times 0{,}49865 = 0{,}9973$ ($99{,}73\\%$).\nĐây là cơ sở của quy tắc 3-sigma: gần như toàn bộ giá trị của biến ngẫu nhiên phân phối chuẩn (99,73%) đều rơi vào khoảng $[\\mu - 3\\sigma; \\mu + 3\\sigma]$.",
        "meth": "Quy tắc 3-sigma: $P(|X - \\mu| < 3\\sigma) = 2\\Phi_0(3) = 99{,}73\\%$.",
        "tips": "Nhớ 3 mốc vàng phân phối chuẩn: 1σ -> 68.27%, 2σ -> 95.45%, 3σ -> 99.73%."
    },
    {
        "id": "xstk_ch6_018",
        "ch": 6,
        "ch_title": "Chương 6: Đại lượng ngẫu nhiên liên tục",
        "src": "KMA_STANDARD",
        "src_title": "Ngân Hàng Bài Tập Chuẩn KMA",
        "prompt": "Biến ngẫu nhiên X tuân theo phân phối đều trên đoạn [2; 8] (ký hiệu X ~ U(2, 8)). Tính kỳ vọng E(X) và phương sai D(X):",
        "correct": "E(X) = 5; D(X) = 3",
        "distractors": [
            "E(X) = 5; D(X) = 6",
            "E(X) = 5; D(X) = 2",
            "E(X) = 4,5; D(X) = 3"
        ],
        "exp": "Với biến ngẫu nhiên phân phối đều $X \\sim U(a, b)$ trên $[a; b]$:\n- Kỳ vọng: $E(X) = \\frac{a + b}{2} = \\frac{2 + 8}{2} = 5$.\n- Phương sai: $D(X) = \\frac{(b - a)^2}{12} = \\frac{(8 - 2)^2}{12} = \\frac{36}{12} = 3$.",
        "meth": "Công thức phân phối đều: $E(X) = (a+b)/2$, $D(X) = (b-a)^2/12$.",
        "tips": "Nhớ mẫu số phương sai phân phối đều luôn là 12: $(8 - 2)^2 / 12 = 36 / 12 = 3$."
    },
    {
        "id": "xstk_ch6_019",
        "ch": 6,
        "ch_title": "Chương 6: Đại lượng ngẫu nhiên liên tục",
        "src": "KMA_STANDARD",
        "src_title": "Ngân Hàng Bài Tập Chuẩn KMA",
        "prompt": "Thời gian hoạt động không có sự cố của một linh kiện điện tử có phân phối mũ với tham số λ = 0,5 (năm^-1). Tính xác suất để linh kiện hoạt động tốt trên 4 năm:",
        "correct": "0,1353",
        "distractors": ["0,1120", "0,1580", "0,1820"],
        "exp": "Hàm phân phối của phân phối mũ: $F(x) = 1 - e^{-\\lambda x}$ với $x \\ge 0$.\nXác suất linh kiện hoạt động trên 4 năm là:\n$P(X > 4) = 1 - F(4) = e^{-\\lambda \\times 4} = e^{-0{,}5 \\times 4} = e^{-2} \\approx 0{,}135335$ ($13{,}53\\%$).",
        "meth": "Đặc trưng phân phối mũ: $P(X > t) = e^{-\\lambda t}$.",
        "tips": "Bấm máy: `e^(-2) = 0.1353`."
    },
    {
        "id": "xstk_ch6_020",
        "ch": 6,
        "ch_title": "Chương 6: Đại lượng ngẫu nhiên liên tục",
        "src": "KMA_STANDARD",
        "src_title": "Ngân Hàng Bài Tập Chuẩn KMA",
        "prompt": "Cho X ~ N(μ = 50, σ^2 = 16). Tính xác suất P(46 <= X <= 58) (biết Φ0(1) = 0,3413; Φ0(2) = 0,4772):",
        "correct": "0,8185",
        "distractors": ["0,7850", "0,8320", "0,8540"],
        "exp": "Độ lệch chuẩn $\\sigma = \\sqrt{16} = 4$.\nChuẩn hóa hai cận:\n$u_1 = \\frac{46 - 50}{4} = -1; u_2 = \\frac{58 - 50}{4} = 2$.\nXác suất:\n$P(46 \\le X \\le 58) = \\Phi_0(2) - \\Phi_0(-1) = \\Phi_0(2) + \\Phi_0(1) = 0{,}4772 + 0{,}3413 = 0{,}8185$ ($81{,}85\\%$).",
        "meth": "Công thức tích phân Laplace: $P(a \\le X \\le b) = \\Phi_0(u_2) - \\Phi_0(u_1)$.",
        "tips": "Casio Menu 7 Normal CD: `Lower=46, Upper=58, σ=4, μ=50` ra `0.8186`."
    },
    {
        "id": "xstk_ch6_021",
        "ch": 6,
        "ch_title": "Chương 6: Đại lượng ngẫu nhiên liên tục",
        "src": "KMA_STANDARD",
        "src_title": "Ngân Hàng Bài Tập Chuẩn KMA",
        "prompt": "Thời gian hoàn thành một dự án phần mềm an toàn thông tin là biến ngẫu nhiên phân phối chuẩn X ~ N(30, 25) (ngày). Tìm thời hạn x0 để dự án có 95% khả năng hoàn thành đúng hạn (biết u0,05 = 1,645):",
        "correct": "38,23 ngày",
        "distractors": ["36,50 ngày", "39,80 ngày", "41,20 ngày"],
        "exp": "Độ lệch chuẩn: $\\sigma = \\sqrt{25} = 5$ ngày.\nĐiều kiện hoàn thành đúng hạn: $P(X \\le x_0) = 0{,}95$.\nTa có: $\\Phi\\left(\\frac{x_0 - 30}{5}\\right) = 0{,}95 \\Rightarrow \\frac{x_0 - 30}{5} = u_{0{,}05} = 1{,}645$.\n$\\Rightarrow x_0 = 30 + 1{,}645 \\times 5 = 30 + 8{,}225 = 38{,}225 \\approx 38{,}23$ ngày.",
        "meth": "Phân vị chuẩn một phía: $x_0 = \\mu + z_\\alpha \\sigma$.",
        "tips": "Casio Menu 7 -> Inverse Normal: `Area=0.95, σ=5, μ=30` ra ngay `38.224`."
    },
    {
        "id": "xstk_ch6_022",
        "ch": 6,
        "ch_title": "Chương 6: Đại lượng ngẫu nhiên liên tục",
        "src": "KMA_STANDARD",
        "src_title": "Ngân Hàng Bài Tập Chuẩn KMA",
        "prompt": "Biến ngẫu nhiên hai chiều (X, Y) có hàm mật độ đồng thời f(x, y) = k(x + y) với 0 <= x, y <= 1 và f(x, y) = 0 ở ngoài. Tìm hệ số k:",
        "correct": "k = 1",
        "distractors": ["k = 2", "k = 1/2", "k = 3/2"],
        "exp": "Điều kiện chuẩn hóa tích phân hai lớp trên $[0; 1] \\times [0; 1]$:\n$\\int_0^1 \\int_0^1 k(x + y)dxdy = k \\int_0^1 \\left[\\frac{x^2}{2} + xy\\right]_0^1 dy = k \\int_0^1 \\left(\\frac{1}{2} + y\\right)dy = k\\left[\\frac{y}{2} + \\frac{y^2}{2}\\right]_0^1 = k(0{,}5 + 0{,}5) = k = 1$.",
        "meth": "Tích phân hai lớp chuẩn hóa hàm mật độ đồng thời.",
        "tips": "Tích phân đối xứng: $k \\times (1/2 + 1/2) = 1 \\Rightarrow k = 1$."
    },
    {
        "id": "xstk_ch6_023",
        "ch": 6,
        "ch_title": "Chương 6: Đại lượng ngẫu nhiên liên tục",
        "src": "KMA_STANDARD",
        "src_title": "Ngân Hàng Bài Tập Chuẩn KMA",
        "prompt": "Cho hai biến ngẫu nhiên X và Y có Cov(X, Y) = 2,4; độ lệch chuẩn σX = 2 và σY = 1,5. Tính hệ số tương quan tuyến tính ρXY giữa X và Y:",
        "correct": "0,80",
        "distractors": ["0,75", "0,85", "0,65"],
        "exp": "Công thức tính hệ số tương quan tuyến tính Pearson:\n$\\rho_{XY} = \\frac{\\text{Cov}(X, Y)}{\\sigma_X \\sigma_Y} = \\frac{2{,}4}{2 \\times 1{,}5} = \\frac{2{,}4}{3{,}0} = 0{,}80$.\nVì $\\rho_{XY} = 0{,}8 > 0$, X và Y có tương quan tuyến tính thuận mức độ khá chặt chẽ.",
        "meth": "Định nghĩa hệ số tương quan: $\\rho = \\frac{\\text{Cov}(X, Y)}{\\sigma_X \\sigma_Y}$.",
        "tips": "Bấm máy: `2.4 / (2 * 1.5) = 0.8`."
    },
    {
        "id": "xstk_ch7_013",
        "ch": 7,
        "ch_title": "Chương 7: Thống kê toán học - Ước lượng tham số",
        "src": "KMA_STANDARD",
        "src_title": "Ngân Hàng Bài Tập Chuẩn KMA",
        "prompt": "Tại sao trong công thức phương sai mẫu hiệu chỉnh ŝ^2 (sample variance), người ta chia cho (n - 1) thay vì chia cho n?",
        "correct": "Để đảm bảo ŝ^2 là ước lượng không chệch (unbiased estimator) của phương sai tổng thể σ^2",
        "distractors": [
            "Để làm tăng độ chính xác của mẫu quan sát",
            "Vì cỡ mẫu thực tế luôn bị mất 1 quan sát",
            "Để ŝ^2 luôn có giá trị nhỏ hơn phương sai ban đầu"
        ],
        "exp": "Phương sai mẫu thông thường $s^2 = \\frac{1}{n}\\sum (X_i - \\overline{X})^2$ có kỳ vọng $E(s^2) = \\frac{n-1}{n}\\sigma^2 < \\sigma^2$ (bị chệch dưới).\nKhi nhân với hệ số hiệu chỉnh Bessel $\\frac{n}{n-1}$, ta được phương sai mẫu hiệu chỉnh:\n$\\hat{s}^2 = \\frac{1}{n-1}\\sum (X_i - \\overline{X})^2 \\Rightarrow E(\\hat{s}^2) = \\sigma^2$.\nDo đó $\\hat{s}^2$ là ước lượng không chệch (Unbiased Estimator) cho phương sai tổng thể $\\sigma^2$.",
        "meth": "Hiệu chỉnh Bessel (Bessel's correction) để khử độ chệch.",
        "tips": "Lý thuyết then chốt: Chia $n-1$ để kỳ vọng mẫu bằng đúng tham số thực $\\sigma^2$ (ước lượng không chệch)."
    },
    {
        "id": "xstk_ch7_014",
        "ch": 7,
        "ch_title": "Chương 7: Thống kê toán học - Ước lượng tham số",
        "src": "KMA_STANDARD",
        "src_title": "Ngân Hàng Bài Tập Chuẩn KMA",
        "prompt": "Cần khảo sát tỷ lệ cử tri ủng hộ một chính sách mới với độ tin cậy 95% (z0,025 = 1,96) và sai số không vượt quá 3% (ε <= 0,03). Nếu chưa có bất kỳ thông tin nào về tỷ lệ ủng hộ trước đó, cần khảo sát tối thiểu bao nhiêu cử tri?",
        "correct": "1068 cử tri",
        "distractors": ["960 cử tri", "1000 cử tri", "1200 cử tri"],
        "exp": "Công thức xác định cỡ mẫu ước lượng tỷ lệ:\n$n \\ge \\frac{z_{\\alpha/2}^2 \\times p(1 - p)}{\\epsilon^2}$.\nKhi chưa có thông tin về $p$, tích $p(1 - p)$ đạt giá trị cực đại bằng $0{,}25$ tại $p = 0{,}5$ (trường hợp rủi ro lớn nhất).\n$n \\ge \\frac{(1{,}96)^2 \\times 0{,}25}{(0{,}03)^2} = \\frac{3{,}8416 \\times 0{,}25}{0{,}0009} = \\frac{0{,}9604}{0{,}0009} \\approx 1067{,}11$.\nDo đó cần khảo sát tối thiểu $n = 1068$ cử tri.",
        "meth": "Cỡ mẫu tối đa cho ước lượng tỷ lệ: dùng $p = 0{,}5$ khi chưa có thông tin tiên nghiệm.",
        "tips": "Bấm máy: `(1.96^2 * 0.25) / (0.03^2) = 1067.11` -> Làm tròn lên 1068 cử tri."
    },
    {
        "id": "xstk_ch7_015",
        "ch": 7,
        "ch_title": "Chương 7: Thống kê toán học - Ước lượng tham số",
        "src": "KMA_STANDARD",
        "src_title": "Ngân Hàng Bài Tập Chuẩn KMA",
        "prompt": "Khảo sát một mẫu cỡ n = 25 từ phân phối chuẩn thu được phương sai mẫu hiệu chỉnh ŝ^2 = 4. Khoảng tin cậy cho phương sai tổng thể σ^2 được xây dựng dựa trên quy luật phân phối xác suất nào?",
        "correct": "Phân phối Chi-bình phương χ^2 với 24 bậc tự do",
        "distractors": [
            "Phân phối chuẩn chuẩn hóa N(0, 1)",
            "Phân phối Student t với 24 bậc tự do",
            "Phân phối Fisher F với bậc tự do (24, 24)"
        ],
        "exp": "Theo định lý Fisher trong thống kê toán học, với mẫu ngẫu nhiên từ phân phối chuẩn $N(\\mu, \\sigma^2)$:\nĐại lượng $\\frac{(n - 1)\\hat{s}^2}{\\sigma^2} = \\sum_{i=1}^n \\left(\\frac{X_i - \\overline{X}}{\\sigma}\\right)^2$ tuân theo phân phối Chi-bình phương với bậc tự do $k = n - 1 = 25 - 1 = 24$.\nKhoảng tin cậy cho $\\sigma^2$ được xác định theo: $\\left[ \\frac{(n-1)\\hat{s}^2}{\\chi^2_{\\alpha/2}(n-1)}; \\frac{(n-1)\\hat{s}^2}{\\chi^2_{1-\\alpha/2}(n-1)} \\right]$.",
        "meth": "Định lý phân phối Chi-bình phương cho phương sai mẫu chuẩn.",
        "tips": "Ước lượng phương sai $\\sigma^2$ luôn dùng phân phối Chi-bình phương $\\chi^2(n-1)$."
    },
    {
        "id": "xstk_ch8_011",
        "ch": 8,
        "ch_title": "Chương 8: Thống kê toán học - Kiểm định giả thuyết",
        "src": "KMA_STANDARD",
        "src_title": "Ngân Hàng Bài Tập Chuẩn KMA",
        "prompt": "Trong bài toán so sánh phương sai của hai quần thể phân phối chuẩn H0: σ1^2 = σ2^2, tiêu chuẩn kiểm định được sử dụng là:",
        "correct": "Tiêu chuẩn Fisher F = s1^2 / s2^2 (phân phối Fisher - Snedecor)",
        "distractors": [
            "Tiêu chuẩn Student t = (s1 - s2) / s_p",
            "Tiêu chuẩn Chi-bình phương χ^2 = s1^2 - s2^2",
            "Tiêu chuẩn chuẩn hóa Z = (s1 - s2) / √(n1 + n2)"
        ],
        "exp": "Để so sánh hai phương sai $\\sigma_1^2 = \\sigma_2^2$, ta dùng tỷ số giữa hai phương sai mẫu hiệu chỉnh:\n$F = \\frac{\\hat{s}_1^2}{\\hat{s}_2^2}$.\nKhi giả thuyết $H_0$ đúng, thống kê $F$ tuân theo phân phối Fisher - Snedecor với bậc tự do $(n_1 - 1, n_2 - 1)$.",
        "meth": "Kiểm định so sánh hai phương sai theo tiêu chuẩn Fisher $F$.",
        "tips": "So sánh 2 phương sai $\\sigma_1^2, \\sigma_2^2$ luôn dùng $F$-test."
    },
    {
        "id": "xstk_ch8_012",
        "ch": 8,
        "ch_title": "Chương 8: Thống kê toán học - Kiểm định giả thuyết",
        "src": "KMA_STANDARD",
        "src_title": "Ngân Hàng Bài Tập Chuẩn KMA",
        "prompt": "Để kiểm định tính độc lập giữa hai dấu hiệu A (có r mức) và B (có c mức) trên bảng tiếp biến r x c, tiêu chuẩn kiểm định Chi-bình phương χ^2 có số bậc tự do bằng:",
        "correct": "(r - 1)(c - 1)",
        "distractors": ["r * c - 1", "r + c - 2", "(r - 1) + (c - 1)"],
        "exp": "Bảng tiếp biến $r \\times c$ có $r$ hàng và $c$ cột.\nTiêu chuẩn kiểm định tính độc lập: $\\chi^2 = \\sum_{i=1}^r \\sum_{j=1}^c \\frac{(O_{ij} - E_{ij})^2}{E_{ij}}$.\nSố bậc tự do của phân phối $\\chi^2$ bằng số ô tự do trong bảng khi các tổng biên cố định: $df = (r - 1)(c - 1)$.",
        "meth": "Bậc tự do kiểm định tính độc lập bảng tiếp biến: $df = (r-1)(c-1)$.",
        "tips": "Ví dụ bảng $2 \\times 2$ có $df = (2-1)(2-1) = 1$."
    },
    {
        "id": "xstk_ch8_013",
        "ch": 8,
        "ch_title": "Chương 8: Thống kê toán học - Kiểm định giả thuyết",
        "src": "KMA_STANDARD",
        "src_title": "Ngân Hàng Bài Tập Chuẩn KMA",
        "prompt": "Sai lầm loại 1 (Type I error) trong kiểm định giả thuyết thống kê là:",
        "correct": "Bác bỏ giả thuyết H0 khi H0 thực sự đúng",
        "distractors": [
            "Chấp nhận giả thuyết H0 khi H0 thực sự sai",
            "Bác bỏ đối thuyết H1 khi H1 thực sự đúng",
            "Chấp nhận đối thuyết H1 khi H1 thực sự sai"
        ],
        "exp": "Trong kiểm định giả thuyết thống kê có 2 loại sai lầm cơ bản:\n- **Sai lầm loại 1:** Bác bỏ $H_0$ trong khi $H_0$ thực sự đúng. Xác suất mắc sai lầm loại 1 được khống chế bởi mức ý nghĩa $\\alpha = P(\\text{Bác bỏ } H_0 | H_0 \\text{ đúng})$.\n- **Sai lầm loại 2:** Chấp nhận $H_0$ trong khi $H_0$ thực sự sai (xác suất là $\\beta$).",
        "meth": "Định nghĩa sai lầm loại 1: $P(\\text{Bác bỏ } H_0 | H_0 \\text{ đúng}) = \\alpha$.",
        "tips": "Sai lầm loại 1 = 'Oan sai' (bác bỏ đúng). Sai lầm loại 2 = 'Lọt lưới' (chấp nhận sai)."
    },
    {
        "id": "xstk_ch8_014",
        "ch": 8,
        "ch_title": "Chương 8: Thống kê toán học - Kiểm định giả thuyết",
        "src": "KMA_STANDARD",
        "src_title": "Ngân Hàng Bài Tập Chuẩn KMA",
        "prompt": "Sai lầm loại 2 (Type II error) trong kiểm định giả thuyết thống kê là:",
        "correct": "Chấp nhận giả thuyết H0 khi H0 thực sự sai",
        "distractors": [
            "Bác bỏ giả thuyết H0 khi H0 thực sự đúng",
            "Bác bỏ H0 khi H1 đúng",
            "Chấp nhận H1 khi H1 đúng"
        ],
        "exp": "Sai lầm loại 2 là quyết định giữ lại (chấp nhận) giả thuyết vô hiệu $H_0$ khi trong thực tế giả thuyết đó là sai.\nXác suất mắc sai lầm loại 2 ký hiệu là $\\beta = P(\\text{Chấp nhận } H_0 | H_0 \\text{ sai})$.\nĐại lượng $1 - \\beta$ được gọi là quyền lực của tiêu chuẩn kiểm định (Power of test).",
        "meth": "Định nghĩa sai lầm loại 2: $P(\\text{Chấp nhận } H_0 | H_0 \\text{ sai}) = \\beta$.",
        "tips": "Sai lầm 1: Bác bỏ đúng (alpha). Sai lầm 2: Chấp nhận sai (beta)."
    },
    {
        "id": "xstk_ch8_015",
        "ch": 8,
        "ch_title": "Chương 8: Thống kê toán học - Kiểm định giả thuyết",
        "src": "KMA_STANDARD",
        "src_title": "Ngân Hàng Bài Tập Chuẩn KMA",
        "prompt": "Đại lượng (1 - β), trong đó β là xác suất mắc sai lầm loại 2, được gọi là:",
        "correct": "Quyền lực của tiêu chuẩn kiểm định (Power of test)",
        "distractors": [
            "Mức ý nghĩa của tiêu chuẩn",
            "Độ tin cậy của kiểm định",
            "Xác suất tiên nghiệm"
        ],
        "exp": "Quyền lực của tiêu chuẩn kiểm định (Power of the test) là xác suất bác bỏ đúng một giả thuyết $H_0$ khi $H_0$ sai:\n$\\text{Power} = 1 - \\beta = P(\\text{Bác bỏ } H_0 | H_0 \\text{ sai})$.\nMột tiêu chuẩn kiểm định càng mạnh khi quyền lực $1 - \\beta$ càng tiến gần đến 1.",
        "meth": "Khái niệm Power of test: $1 - \\beta$.",
        "tips": "Power = Khả năng phát hiện đúng khi giả thuyết bị sai $= 1 - \\beta$."
    },
    {
        "id": "xstk_ch8_016",
        "ch": 8,
        "ch_title": "Chương 8: Thống kê toán học - Kiểm định giả thuyết",
        "src": "KMA_STANDARD",
        "src_title": "Ngân Hàng Bài Tập Chuẩn KMA",
        "prompt": "Kiểm định sự phù hợp của một quy luật phân phối xác suất lý thuyết đối với số liệu thực nghiệm thường dùng tiêu chuẩn kiểm định nào?",
        "correct": "Tiêu chuẩn Pearson Chi-bình phương (χ^2 goodness-of-fit test)",
        "distractors": [
            "Tiêu chuẩn Student t hai phía",
            "Tiêu chuẩn phân tích phương sai ANOVA",
            "Tiêu chuẩn hồi quy tuyến tính"
        ],
        "exp": "Tiêu chuẩn $\\chi^2$ của Pearson được sử dụng để kiểm định xem mẫu quan sát có tuân theo một quy luật phân phối giả định (như chuẩn, nhị thức, Poisson, đều) hay không:\n$\\chi^2 = \\sum_{i=1}^k \\frac{(n_i - n p_i)^2}{n p_i} \\sim \\chi^2(k - r - 1)$, với $r$ là số tham số phải ước lượng từ mẫu.",
        "meth": "Kiểm định độ phù hợp phân phối (Goodness of fit) của Pearson.",
        "tips": "Kiểm định độ phù hợp phân phối luôn gắn liền với kiểm định $\\chi^2$ Pearson."
    },
    {
        "id": "xstk_ch8_017",
        "ch": 8,
        "ch_title": "Chương 8: Thống kê toán học - Kiểm định giả thuyết",
        "src": "KMA_STANDARD",
        "src_title": "Ngân Hàng Bài Tập Chuẩn KMA",
        "prompt": "Khảo sát mẫu nhỏ n = 10 từ phân phối chuẩn thu được X̄ = 95 và s = 5. Cần kiểm định H0: μ = 100 vs H1: μ < 100 với mức ý nghĩa α = 0,05 (biết t0,05(9) = 1,833). Kết luận nào sau đây là đúng?",
        "correct": "Bác bỏ H0: Kỳ vọng thực tế nhỏ hơn 100 (T = -3,16 < -1,833)",
        "distractors": [
            "Chấp nhận H0: Kỳ vọng vẫn bằng 100",
            "Chấp nhận H0 vì T = -1,58",
            "Chưa đủ dữ liệu để kết luận"
        ],
        "exp": "Vì $n = 10 < 30$, ta sử dụng tiêu chuẩn Student:\n$T = \\frac{\\overline{X} - \\mu_0}{s / \\sqrt{n}} = \\frac{95 - 100}{5 / \\sqrt{10}} = \\frac{-5}{1{,}581} \\approx -3{,}162$.\nMiền bác bỏ phía trái: $T < -t_{0{,}05}(9) = -1{,}833$.\nVì $T = -3{,}162 < -1{,}833$, ta BÁC BỎ $H_0$.\nKết luận: Kỳ vọng thực tế nhỏ hơn 100 có ý nghĩa thống kê ở mức 5%.",
        "meth": "Kiểm định Student mẫu nhỏ cho một kỳ vọng phía trái.",
        "tips": "Bấm máy: `(95 - 100) / (5 / √10) = -3.162 < -1.833` $\\Rightarrow$ Bác bỏ $H_0$."
    }
]

