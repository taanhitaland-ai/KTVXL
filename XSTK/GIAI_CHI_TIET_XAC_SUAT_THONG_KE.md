# TÀI LIỆU GIẢI CHI TIẾT BỘ ĐỀ BÀI TẬP XÁC SUẤT THỐNG KÊ

**Giảng viên biên soạn đề:** GV. Bùi Thị Giang - Bộ môn Toán, Khoa Cơ bản, Học viện Kỹ thuật Mật mã
**Quy chuẩn trình bày & barem điểm:** Chuẩn hóa theo đáp án chính thức của Bộ môn Toán - HV KTMM (Tham chiếu từ `image.png`, `image1.png`)

---


# PHẦN I: BẢNG TỔNG HỢP KẾT QUẢ ĐỐI SOÁT NHANH (QUICK-CHECK)

> **Mục đích:** Dành cho bạn tra cứu, đối chiếu nhanh kết quả khi tự luyện làm bài tập. Bảng bao gồm đáp số dưới dạng phân số tối giản và số thập phân làm tròn chuẩn.

---

### Bảng 1: Xác suất cổ điển (10 bài)

| Bài | Ý / Nội dung chính | Kết quả (Phân số / Biểu thức) | Kết quả số thập phân |
|:---:|:---|:---:|:---:|
| **1** | a. Tổng 2 xúc sắc bằng 7 | $\frac{6}{36} = \frac{1}{6}$ | $\approx 0{,}1667$ |
| | b. Tổng 2 xúc sắc bằng 8 | $\frac{5}{36}$ | $\approx 0{,}1389$ |
| | c. Số nốt hơn kém nhau 2 | $\frac{8}{36} = \frac{2}{9}$ | $\approx 0{,}2222$ |
| **2** | Chọn 6 quả: 3 trắng, 2 đỏ, 1 đen (từ 6T, 4Đ, 2Đ) | $\frac{C_6^3 C_4^2 C_2^1}{C_{12}^6} = \frac{240}{924} = \frac{20}{77}$ | $\approx 0{,}2597$ |
| **3** | Chọn 3 hs mỗi loại 1 (từ 5 giỏi, 10 khá, 5 TB) | $\frac{C_5^1 C_{10}^1 C_5^1}{C_{20}^3} = \frac{250}{1140} = \frac{25}{114}$ | $\approx 0{,}2193$ |
| **4** | Nồi áp suất an toàn (van hỏng 0,2 và 0,3) | $1 - 0{,}2 \times 0{,}3$ | **$0{,}94$** |
| **5** | Chọn 3 cầu có ít nhất 2 quả cùng màu (5T, 3X, 4Đ) | $1 - \frac{C_5^1 C_3^1 C_4^1}{C_{12}^3} = 1 - \frac{60}{220} = \frac{8}{11}$ | $\approx 0{,}7273$ |
| **6** | Lấy 1 quả từ mỗi túi, cùng màu (Túi 1: 3T,7Đ,15X; Túi 2: 10T,6Đ,9X) | $\frac{3 \cdot 10 + 7 \cdot 6 + 15 \cdot 9}{25 \times 25} = \frac{207}{625}$ | **$0{,}3312$** |
| **7** | a. Chọn 10 thẻ đều chẵn (từ 30 thẻ) | $\frac{C_{15}^{10}}{C_{30}^{10}} = \frac{3003}{30045015} = \frac{1}{10005}$ | $\approx 0{,}0001$ |
| | b. Đúng 5 số chia hết cho 3 | $\frac{C_{10}^5 C_{20}^5}{C_{30}^{10}} = \frac{3907008}{30045015}$ | $\approx 0{,}1300$ |
| | c. 5 lẻ, 5 chẵn trong đó đúng 1 số chia hết cho 10 | $\frac{C_{15}^5 C_3^1 C_{12}^4}{C_{30}^{10}} = \frac{4459455}{30045015}$ | $\approx 0{,}1484$ |
| **8** | 5 khách lên đoàn tàu 3 toa, mỗi toa ít nhất 1 khách | $\frac{3^5 - C_3^1 2^5 + C_3^2 1^5}{3^5} = \frac{150}{243} = \frac{50}{81}$ | $\approx 0{,}6173$ |
| **9** | 4 khách lên 4 toa: 1 toa 3 người, 1 toa 1 người, 2 toa trống | $\frac{C_4^1 C_4^3 C_3^1 C_1^1}{4^4} = \frac{48}{256} = \frac{3}{16}$ | **$0{,}1875$** |
| **10** | Hộp 5 đỏ, 6 trắng, lấy lần lượt 3 viên: viên 1 và 2 cùng màu | $\frac{5}{11} \cdot \frac{4}{10} + \frac{6}{11} \cdot \frac{5}{10} = \frac{50}{110} = \frac{5}{11}$ | $\approx 0{,}4545$ |

---

### Bảng 2: Phép thử lặp, công thức Bernoulli (6 bài)

| Bài | Ý / Nội dung chính | Công thức then chốt | Kết quả số |
|:---:|:---|:---|:---:|
| **1** | Ý 1: B thắng cuộc trong 5 ván cờ ($p_A = 0{,}6, p_B = 0{,}4$) | $P_5(k \ge 3) = \sum_{k=3}^5 C_5^k (0{,}4)^k (0{,}6)^{5-k}$ | **$0{,}3174$** |
| | Ý 2: Sút phạt đền 5 lần ít nhất 4 lần vào lưới ($p = 0{,}95$) | $P_5(k \ge 4) = C_5^4 (0{,}95)^4(0{,}05) + C_5^5 (0{,}95)^5$ | **$0{,}9774$** |
| **2** | 10 người vùng núi, ít nhất 2 người sốt rét ($p = 0{,}1$) | $1 - (0{,}9)^{10} - C_{10}^1(0{,}1)(0{,}9)^9$ | **$0{,}2639$** |
| **3** | 12 người, đúng 5 người thích bóng đá ($p = 0{,}65$) | $P_{12}(5) = C_{12}^5 (0{,}65)^5 (0{,}35)^7$ | **$0{,}0591$** |
| **4** | 6 bóng ($p_{\text{cháy}} = 0{,}15$), lớp học không đủ ánh sáng ($k_{\text{sáng}} \le 3$) | $\sum_{k=0}^3 C_6^k (0{,}85)^k (0{,}15)^{6-k}$ | **$0{,}0473$** |
| **5** | Bắn 4 phát ($p = 0{,}65$), tính $P(X^2 - 6X + 8 < 0) = P(X = 3)$ | $C_4^3 (0{,}65)^3 (0{,}35)^1$ | **$0{,}3845$** |
| **6** | 12 câu trắc nghiệm hú họa ($p = 0{,}2$), được 13 điểm ($k = 5$ câu đúng) | $C_{12}^5 (0{,}2)^5 (0{,}8)^7$ | **$0{,}0532$** |

---

### Bảng 3: Xác suất có điều kiện & Quy tắc nhân tổng quát (6 bài)

| Bài | Ý / Nội dung chính | Công thức then chốt | Kết quả số |
|:---:|:---|:---|:---:|
| **1** | Chọn 2 từ 4 nữ, 2 nam: 2 nữ biết ít nhất 1 nữ | $\frac{C_4^2}{C_6^2 - C_2^2} = \frac{6}{14} = \frac{3}{7}$ | $\approx 0{,}4286$ |
| **2** | 3 viên đạn ($0{,}3; 0{,}4; 0{,}5$), ít nhất 2 viên trúng | $P(\text{trúng 2}) + P(\text{trúng 3})$ | **$0{,}3500$** |
| **3** | 3 xạ thủ ($0{,}6; 0{,}7; 0{,}8$), đúng 1 người trúng | $0{,}6 \cdot 0{,}3 \cdot 0{,}2 + 0{,}4 \cdot 0{,}7 \cdot 0{,}2 + 0{,}4 \cdot 0{,}3 \cdot 0{,}8$ | **$0{,}1880$** |
| **4** | 2 xạ thủ ($0{,}95; 0{,}85$), ít nhất 1 viên trúng | $1 - (1 - 0{,}95)(1 - 0{,}85) = 1 - 0{,}05 \cdot 0{,}15$ | **$0{,}9925$** |
| **5** | a. Gieo 3 xúc sắc: tổng 8 biết ít nhất một con nốt 1 | $\frac{N(\text{Tổng}=8 \cap \ge 1 \text{ nốt } 1)}{N(\ge 1 \text{ nốt } 1)} = \frac{15}{91}$ | $\approx 0{,}1648$ |
| | b. Ít nhất một con lục biết 3 nốt khác nhau | $\frac{A_6^3 - A_5^3}{A_6^3} = \frac{120 - 60}{120} = \frac{1}{2}$ | **$0{,}5000$** |
| **6** | a. Thi 3 vòng ($90\%, 80\%, 90\%$), lọt qua 3 vòng | $0{,}9 \times 0{,}8 \times 0{,}9$ | **$0{,}6480$** |
| | b. Bị loại ở vòng 2 biết rằng thí sinh bị loại | $\frac{0{,}9 \times 0{,}2}{1 - 0{,}648} = \frac{0{,}18}{0{,}352} = \frac{45}{88}$ | $\approx 0{,}5114$ |

---

### Bảng 4: Công thức xác suất đầy đủ và công thức Bayes (13 bài)

| Bài | Tóm tắt nội dung | Công thức / Kết quả | Giá trị số |
|:---:|:---|:---|:---:|
| **1** | Bắt 4 thỏ từ C1 (3T, 3N) sang C2 (6T, 4N). Bắt 1 thỏ từ C2: tính $P(\text{Nâu})$ | $P = \frac{3}{15} \cdot \frac{5}{14} + \frac{9}{15} \cdot \frac{6}{14} + \frac{3}{15} \cdot \frac{7}{14} = \frac{3}{7}$ | $\approx 0{,}4286$ |
| **2** | 4 máy ($25\%, 30\%, 30\%, 15\%$), phế phẩm ($1\%, 3\%, 2\%, 4\%$) | $\sum P(A_i)P(PP \mid A_i)$ | **$0{,}0235$** ($2{,}35\%$) |
| **3** | 4 đội nông trường ($20\%, 25\%, 30\%, 25\%$), tỷ lệ PP ($0{,}15; 0{,}08; 0{,}05; 0{,}01$) | $\sum P(Đ_i)P(PP \mid Đ_i)$ | **$0{,}0675$** ($6{,}75\%$) |
| **4** | 3 phân xưởng bóng đèn ($10\%, 20\%, 70\%$), phế phẩm ($2\%, 3\%, 4\%$) | $0{,}1(0{,}02) + 0{,}2(0{,}03) + 0{,}7(0{,}04)$ | **$0{,}0360$** ($3{,}60\%$) |
| **5** | 3 bộ tộc ($20\%, 30\%, 50\%$), tỷ lệ sốt rét ($5\%, 3\%, 2\%$) | $0{,}2(0{,}05) + 0{,}3(0{,}03) + 0{,}5(0{,}02)$ | **$0{,}0290$** ($2{,}90\%$) |
| **6** | C1 (5Đ, 10T), C2 (3T, 7Đ). 1 con C2 sang C1, bắt 1 con ra được Trắng. Tính $P(\text{Trắng của C1} \mid T)$ | $\frac{10/16}{(3/10)(11/16) + (7/10)(10/16)} = \frac{100}{103}$ | $\approx 0{,}9709$ |
| **7** | Lô 1 (15 con, 3 trống), Lô 2 (20 con, 4 trống). 1 con Lô 2 sang Lô 1. Bắt 1 con ra là gà trống | $\frac{1}{5} \cdot \frac{4}{16} + \frac{4}{5} \cdot \frac{3}{16} = \frac{16}{80}$ | **$0{,}2000$** |
| **8** | 18 xạ thủ (N1: 5 trúng 0,8; N2: 7 trúng 0,7; N3: 4 trúng 0,6; N4: 2 trúng 0,5). Bắn trượt. Thuộc nhóm nào nhất? | $P(N_2 \mid \text{trượt}) = \frac{2{,}1}{5{,}7} \approx 0{,}3684$ lớn nhất | **Nhóm 2** |
| **9** | PX1: $40\%$ (PP $1\%$), PX2: $60\%$ (PP $2\%$) | a. $P(PP) = 0{,}0160$<br>b. $P(PX1 \mid PP) = 0{,}004/0{,}016 = 0{,}25$ | a. **$1{,}6\%$**<br>b. **$25\%$** |
| **10** | Phát A ($0{,}84$), B ($0{,}16$). A méo thành B là $1/6$, B méo thành A là $1/8$ | a. $P(\text{Thu A}) = 0{,}84(5/6) + 0{,}16(1/8) = 0{,}72$<br>b. $P(\text{Phát A} \mid \text{Thu A}) = 0{,}70/0{,}72 = 35/36$ | a. **$0{,}7200$**<br>b. $\approx 0{,}9722$ |
| **11** | C1 (9 mái, 1 trống), C2 (1 mái, 5 trống). Thịt 1 con mỗi chuồng, còn lại dồn vào C3. Bắt 1 con từ C3 là gà trống | $P = \frac{152/30}{14} = \frac{38}{105}$ | $\approx 0{,}3619$ |
| **12** | (Trùng nội dung bài 8): Xạ thủ bắn trượt có khả năng thuộc nhóm nào nhất? | Tỷ lệ tích xác suất: Nhóm 2 đạt $2{,}1/5{,}7$ cao nhất | **Nhóm 2** |
| **13** | Bệnh nhân: A $50\%$, B $30\%$, C $20\%$. Khỏi tương ứng $0{,}7; 0{,}8; 0{,}9$. Bệnh nhân đã khỏi, tính $P(A \mid \text{Khỏi})$ | $\frac{0{,}5 \times 0{,}7}{0{,}5(0{,}7) + 0{,}3(0{,}8) + 0{,}2(0{,}9)} = \frac{0{,}35}{0{,}77} = \frac{5}{11}$ | $\approx 0{,}4545$ ($45{,}45\%$) |

---

### Bảng 5: Đại lượng ngẫu nhiên rời rạc (17 bài)

| Bài | Tóm tắt bài toán | Đại lượng / Kỳ vọng / Phương sai | Đáp số chính |
|:---:|:---|:---|:---:|
| **1** | 10 người (6N, 4Nữ), chọn 3. $X$ là số nữ | $X \in \{0, 1, 2, 3\}$ với $P = \{1/6, 1/2, 3/10, 1/30\}$ | **$EX = 1{,}2$; $DX = 0{,}56$** |
| **2** | 6 sp (3 loại A), chọn 3. $X$ là số sp loại A | $X \in \{0, 1, 2, 3\}$ với $P = \{1/20, 9/20, 9/20, 1/20\}$ | **$EX = 1{,}5$; $DX = 0{,}45$** |
| **4** | 10 đỏ, 6 xanh, chọn 3 thẻ. $X$: số thẻ đỏ, $Y$: tổng điểm ($5X + 8(3-X)$) | a. Bảng $X \in \{0, 1, 2, 3\}$<br>b. $Y \in \{15, 18, 21, 24\}$ với $P = \{3/14, 27/56, 15/56, 1/28\}$ | $EY = 18{,}75$ |
| **5** | Hộp 4 thẻ 1..4, chọn 2 thẻ, $X$ là tổng | $X \in \{3, 4, 5, 6, 7\}$ với $P = \{1/6, 1/6, 1/3, 1/6, 1/6\}$ | **$EX = 5$; $DX = 5/3 \approx 1{,}6667$** |
| **6** | Gieo 2 xúc sắc, $X$ là tổng nốt | $X \in \{2..12\}$, $P(k) = (6 - \|k-7\|)/36$ | **$EX = 7$; $DX = 35/6 \approx 5{,}8333$** |
| **7** | 5 bóng (2 tốt, 3 hỏng), thử ko hoàn lại đến khi 2 bóng tốt. $X$: số lần thử | $X \in \{2, 3, 4, 5\}$ với $P = \{0{,}1; 0{,}2; 0{,}3; 0{,}4\}$ | **$EX = 4{,}0$ lần** |
| **8** | 7 sp (4 tốt, 3 phế), chọn 4. $X$ là số sp tốt | $X \in \{1, 2, 3, 4\}$ với $P = \{4/35, 18/35, 12/35, 1/35\}$ | **$EX = 16/7 \approx 2{,}2857$** |
| **9** | 10 thẻ (4 số 1, 3 số 2, 2 số 3, 1 số 4), chọn 2. $X$: tổng 2 thẻ | $X \in \{2, 3, 4, 5, 6, 7\}$ với $P = \{2/15, 4/15, 11/45, 2/9, 4/45, 2/45\}$ | Đã lập bảng đầy đủ |
| **10** | 7 chìa (2 mở được), thử ko hoàn lại đến khi mở được cửa. $X$: số lần thử | $X \in \{1..6\}$, $P(X=k) = (7-k)/21$ | **$EX = 8/3 \approx 2{,}6667$ lần** |
| **11** | Túi 4 trắng, 3 đen. Rút đến khi gặp đen thua phạt $5 \times k$ USD. A rút trước. $X$: tiền A thu được | $X \in \{-5, +10, -15, +20, -25\}$ với $P = \{15/35, 10/35, 6/35, 3/35, 1/35\}$ | **$EX = -6/7 \approx -0{,}857$ USD**<br>150 ván: $\approx -128{,}57$ USD |
| **12** | Máy tính bán trong tuần: cho bảng $X \in \{0..5\}$ | a. $P(X \ge 4) = 0{,}20 + 0{,}10 = 0{,}30$<br>b. Tiền lãi $L = 800X - 500$, $EX = 2{,}75$ | a. **$0{,}30$**<br>b. **$1700$ nghìn đồng** (1,7 triệu) |
| **13** | $X, Y$ độc lập: $X \in \{-1, 0, 1\}, Y \in \{1, 2\}$ | a. $EX = 0{,}1$; $EY = 1{,}6$<br>b. $Z = X+Y \in \{0, 1, 2, 3\}$ với $P = \{0{,}08; 0{,}32; 0{,}42; 0{,}18\}$ | **$EZ = 1{,}7$** |
| **14** | $X, Y$ độc lập: $X \in \{0..3\}, Y \in \{0..4\}$ | a. Lập ma trận xác suất đồng thời $P(i, j) = P(X=i)P(Y=j)$<br>b. $P(X > Y) = 0{,}03 + 0{,}08 + 0{,}08$ | b. **$P(X > Y) = 0{,}19$** |
| **15** | Bảng đồng thời $(X, Y)$ với $X \in \{0, 1\}, Y \in \{0, 1, 2\}$ | a. $P(X=i, Y=j) = P(X=i)P(Y=j) \Rightarrow$ độc lập<br>b. $Z = XY \in \{0, 1, 2\}$ với $P = \{0{,}58; 0{,}35; 0{,}07\}$ | c. **$EZ = 0{,}49$** (tính bằng 2 cách) |
| **16** | Bảng đồng thời $(X, Y)$ với $X \in \{-1, 0, 1\}, Y \in \{-1, 1\}$ | a. $EX = -1/8; EY = 0; \text{Cov}(X, Y) = -1/8$<br>b. $\text{Cov} \ne 0 \Rightarrow X, Y$ không độc lập | a. **$\text{Cov}(X, Y) = -0{,}125$**<br>b. **Không độc lập** |
| **17** | $X \in \{0..4\}$, $Y = X^3 - 4X^2 + 10$ | a. $Y \in \{1, 2, 7, 10\}$ với $P = \{0{,}25; 0{,}30; 0{,}20; 0{,}25\}$<br>b. $EY = 4{,}75$ (2 cách)<br>c. $DY = 36{,}25 - 4{,}75^2$ | **$EY = 4{,}75$**<br>**$DY = 13{,}6875$** |
| **18** | $X \sim B(2; 0{,}4), Y \sim B(2; 0{,}7)$ độc lập | a. Lập bảng phân bố $X$ và $Y$<br>b. $E(X+Y) = 2{,}2 \Rightarrow p = 0{,}55 \Rightarrow \text{Var theo nhị thức} = 0{,}99 \ne \text{Var thực tế} = 0{,}90$ | Đã chứng minh $X+Y$ không có PB nhị thức |

---

### Bảng 6: Đại lượng ngẫu nhiên liên tục (17 bài)

| Bài | Dạng hàm mật độ $f(x)$ | Yêu cầu chính | Đáp số chính |
|:---:|:---|:---|:---:|
| **1** | $f(x) = kx^2(1-x), x \in [0, 1]$ | a. Tìm $k$<br>b. $P(0{,}4 < X < 0{,}6)$ | a. **$k = 12$**<br>b. **$P = 0{,}2960$** |
| **2** | $f(x) = A/x^2, x \ge 1$ | a. Tìm $A$<br>b. Tìm $F(x)$<br>c. $P(2 < X < 3)$ | a. **$A = 1$**<br>b. $F(x) = 1 - 1/x (x \ge 1)$<br>c. **$P = 1/6 \approx 0{,}1667$** |
| **3** | $f(x) = 2(1-x), x \in [0, 1]$ | a. Chứng minh là hàm mật độ<br>b. Tính $EX, DX$ | b. **$EX = 1/3$; $DX = 1/18 \approx 0{,}0556$** |
| **4** | $f(x) = k(1-x), x \in [0, 1]$ | a. Tìm $k$<br>b. Tính $EX$ | a. **$k = 2$**<br>b. **$EX = 1/3$** |
| **5** | $f(x) = \frac{3}{4}(x-2)(4-x), x \in [2, 4]$ *(Đề rubric)* | a. $P(2 < X < 3)$<br>b. Kỳ vọng $EX$, phương sai $DX$ | a. **$P = 0{,}5$**<br>b. **$EX = 3$; $DX = 1/5 = 0{,}2$** |
| **6** | $f(x) = kx^2, x \in [0, 3]$ | a. Chứng minh $k = 1/9$<br>b. $P(X > 2)$ và $EX$ | b. **$P(X > 2) = 19/27 \approx 0{,}7037$**<br>**$EX = 9/4 = 2{,}25$** |
| **7** | $f(x) = k(1+x)^{-3}, x \ge 0$ | a. Tìm $k$<br>b. Tính $EX$ | a. **$k = 2$**<br>b. **$EX = 1$** |
| **8** | $f(x)$ đối xứng tam giác trên $[-2, 2]$ | Tính $EX, DX$ | **$EX = 0$; $DX = 2/3 \approx 0{,}6667$** |
| **9** | $f(x) = kx$ trên $[0, 1]$, $k$ trên $[1, 4]$ | a. Tìm $k$<br>b. Tính $EX, DX$ | a. **$k = 2/7$**<br>b. **$EX = 47/21 \approx 2{,}2381$; $DX \approx 1{,}0624$** |
| **10** | $f(x) = 2e^{-2x}, x \ge 0$ | a. Hàm phân phối $F(x)$<br>b. Tính $EX, DX$ | a. $F(x) = 1 - e^{-2x} (x \ge 0)$<br>b. **$EX = 0{,}5$; $DX = 0{,}25$** |
| **11** | $f(x) = kx^2 e^{-2x}, x \ge 0$ | a. Tìm $k$<br>b. Hàm $F(x)$<br>c. Tính $EX, DX$ | a. **$k = 4$**<br>b. $F(x) = 1 - e^{-2x}(2x^2+2x+1)$<br>c. **$EX = 1{,}5$; $DX = 0{,}75$** |
| **12** | $f(x) = k(1-x^2), |x| \le 1$ | Tìm $k$, tính $EY, DY$ của $Y = 2X^2$ | **$k = 3/4$**<br>**$EY = 0{,}4$; $DY = 32/175 \approx 0{,}1829$** |
| **13** | $f(x) = kx^2, x \in [0, 1]$ | a. Tìm $k$<br>b. Với $Y = 2\sqrt{X}$, tính $P(1/2 < Y < 3/2)$ và $P(Y > 1)$ | a. **$k = 3$**<br>b. **$P = 91/512 \approx 0{,}1777$**; **$P(Y > 1) = 63/64 \approx 0{,}9844$** |
| **14** | Trọng lượng bò $X \sim N(250, 40^2)$ | a. $P(X > 300)$<br>b. $P(X < 175)$<br>c. $P(260 < X < 270)$ | a. **$0{,}1056$**<br>b. **$0{,}0301$**<br>c. **$0{,}0928$** |
| **15** | Thời gian $T \sim N(\mu, \sigma^2)$ ($P(T>20)=0{,}65; P(T>30)=0{,}08$) | a. Tính $\mu, \sigma$<br>b. $P(T > 25)$ (muộn học)<br>c. Đi trước bao nhiêu phút để $P(\text{muộn}) < 0{,}02$ | a. **$\mu \approx 22{,}17$ phút; $\sigma \approx 5{,}56$ phút**<br>b. **$P \approx 0{,}3050$**<br>c. **$t_0 \ge 33{,}57$ phút** |
| **16** | Chiều cao cây $X \sim N(\mu, \sigma^2)$ (mẫu 640: 25 cây $< 18$m, 110 cây $> 24$m) | a. Tính $\mu, \sigma$<br>b. Ước lượng số cây cao từ 16m đến 20m | a. **$\mu \approx 21{,}90$ m; $\sigma \approx 2{,}21$ m**<br>b. **$\approx 122$ cây** ($P \approx 0{,}1911$) |
| **17** | Mật độ đồng thời $f(x, y) = kx$ trên $0 < y < x < 1$ | a. Tìm $k$<br>b. Tìm $f_X(x), f_Y(y)$<br>c. $X, Y$ có độc lập không? | a. **$k = 3$**<br>b. $f_X(x) = 3x^2; f_Y(y) = 1{,}5(1-y^2)$<br>c. **Không độc lập** |

---

### Bảng 7: Thống kê toán học - Ước lượng tham số (14 bài)

| Bài | Mẫu số liệu | Đặc trưng mẫu cơ bản | Kết quả ước lượng / Khoảng tin cậy | Độ chính xác $\epsilon$ / Cỡ mẫu bổ sung |
|:---:|:---|:---|:---|:---|
| **1** | Trọng lượng quả ($n = 50$) | $\overline{X} = 200{,}2$; $s^2 = 66{,}96$; $\hat{s}^2 = 68{,}33$; $\hat{s} \approx 8{,}266$ | b. KTC 95%: **$[197{,}91; 202{,}49]$** g<br>d. Kiểm định $p=45\%$: $K_{tn} = 0{,}71 \Rightarrow$ **Chấp nhận $H_0$** | $\epsilon \approx 2{,}29$ g<br>Nâng gấp đôi: $n' = 200$ quả |
| **2** | Trọng lượng vật nuôi ($n = 140$) *(Đề rubric)* | $\overline{X} \approx 35{,}49$; $s^2 = 187{,}51$; $\hat{s}^2 = 188{,}86$; $\hat{s} \approx 13{,}742$ | a. KTC 95%: **$[33{,}21; 37{,}77]$** kg<br>c. Kiểm định $p=20\%$: $K_{tn} = -0{,}63 \Rightarrow$ **Chấp nhận $H_0$** | $\epsilon \approx 2{,}28$ kg<br>Nâng gấp đôi: $n' = 560$ con |
| **3** | Cân nặng trẻ 9 tuổi ($n = 50$) | $\overline{X} = 31{,}22$; $s^2 = 25{,}40$; $\hat{s}^2 = 25{,}92$; $\hat{s} \approx 5{,}091$ | b. KTC 95%: **$[29{,}81; 32{,}63]$** kg | $\epsilon \approx 1{,}41$ kg |
| **4** | Tiêu hao xăng ($n = 30$) | $\overline{X} \approx 10{,}133$; $s^2 = 0{,}0536$; $\hat{s}^2 = 0{,}0554$; $\hat{s} \approx 0{,}235$ | b. KTC 95%: **$[10{,}05; 10{,}22]$** lít<br>c. KTC $p$ tiêu hao $\le 10$ lít ($\gamma=0{,}98$): **$[7{,}85\%; 45{,}48\%]$** | $\epsilon_{EX} \approx 0{,}084$ l<br>Để $\epsilon \le 0{,}05$: $n' = 86$ chuyến<br>Nâng gấp đôi KTC $p$: cần thêm 90 chuyến |
| **5** | Kích thước chi tiết ($n = 200$) | $\overline{X} = 841{,}8$; $s^2 = 143{,}76$; $\hat{s}^2 = 144{,}48$; $\hat{s} \approx 12{,}02$ | b. KTC 95%: **$[840{,}13; 843{,}47]$** cm | $\epsilon \approx 1{,}67$ cm |
| **6** | Doanh số hộ ($n = 100$) | $\overline{X} = 10{,}74$; $s^2 = 0{,}0678$; $\hat{s}^2 = 0{,}0685$; $\hat{s} \approx 0{,}262$ | b. KTC 95%: **$[10{,}69; 10{,}79]$** triệu<br>c. Ước lượng tỷ lệ $\ge 11$ tr: **$[9{,}64\%; 24{,}36\%]$** | $\epsilon \approx 0{,}051$ triệu đồng |
| **7** | Năng suất lúa ($n = 365$) | $\overline{X} \approx 34{,}79$; $s^2 = 4{,}32$; $\hat{s}^2 = 4{,}33$; $\hat{s} \approx 2{,}08$ | b. KTC 95%: **$[34{,}58; 35{,}01]$** tạ/ha (Thấp nhất: 34,58; Cao nhất: 35,01) | $\epsilon \approx 0{,}21$ tạ/ha |
| **8** | Kẽm trong tóc ($n = 35$) | $\overline{X} \approx 194{,}49$; $s^2 = 11{,}56$; $\hat{s}^2 = 11{,}90$; $\hat{s} \approx 3{,}45$ | b. KTC 95%: **$[193{,}34; 195{,}63]$** ppm | $\epsilon \approx 1{,}14$ ppm |
| **9** | Doanh thu TV ($n = 100$) | $\overline{X} = 2{,}674$; $s^2 = 0{,}1403$; $\hat{s}^2 = 0{,}1417$; $\hat{s} \approx 0{,}376$ | b. KTC 95%: **$[2{,}600; 2{,}748]$** ĐVT<br>c. Kiểm định $\mu=2{,}8$: $K_{tn} = -3{,}35 \Rightarrow$ **Bác bỏ tuyên bố GĐ** | $\epsilon \approx 0{,}074$ ĐVT |
| **10** | Thu nhập công nhân ($n = 100$) | $\overline{X} = 5{,}55$; $s^2 = 0{,}3475$; $\hat{s}^2 = 0{,}3510$; $\hat{s} \approx 0{,}593$ | a. KTC 95%: **$[5{,}43; 5{,}67]$** triệu<br>b. XN B ($12\%$) vs XN A ($15\%$): **Không thể cho rằng B cao hơn A** | $\epsilon \approx 0{,}116$ triệu đồng |
| **11** | Năng suất cây trồng ($n = 36$) | $\overline{X} \approx 56{,}53$; $s^2 = 27{,}53$; $\hat{s}^2 = 28{,}31$; $\hat{s} \approx 5{,}32$ | a. KTC 95%: **$[54{,}79; 58{,}27]$** tạ/ha<br>b. Muốn $\epsilon \le 1$: cần thu hoạch thêm **73 điểm** | $\epsilon \approx 1{,}74$ tạ/ha<br>Tổng cần: $n' = 109$ điểm |
| **12** | Thời gian gia công ($n = 16$, mẫu nhỏ) | $\overline{X} = 14{,}4375$; $s^2 = 0{,}3398$; $\hat{s}^2 = 0{,}3625$; $\hat{s} \approx 0{,}602$ | a. KTC 95% (theo Student $t_{0{,}025}(15)=2{,}131$): **$[14{,}12; 14{,}76]$** phút<br>c. Kiểm định $\mu \le 15$: $T = -3{,}74 \Rightarrow$ **Chấp nhận $H_0$** | $\epsilon_t \approx 0{,}321$ phút<br>Nâng gấp đôi: $n' = 64$ chi tiết |
| **13** | Tuổi thọ đèn ($\sigma = 100, n = 100, \overline{X} = 1000$) | Biết $\sigma = 100$ | a. KTC 95%: **$[980{,}4; 1019{,}6]$** giờ<br>b. Để $\epsilon = 25$ giờ: cần thử nghiệm **$n' = 62$ bóng** | a. $\epsilon = 19{,}6$ giờ<br>b. $n' = 62$ bóng |
| **14** | Thăm dò 500 trẻ thích ô tô ($m = 350$) | Tần suất mẫu $f = 350/500 = 0{,}70$ | KTC 99% ($\gamma=0{,}99, z=2{,}58$): **$[64{,}71\%; 75{,}29\%]$** | $\epsilon \approx 0{,}0529$ ($5{,}29\%$) |

---

### Bảng 8: Thống kê toán học - Kiểm định giả thuyết (11 bài)

| Bài | Bài toán kiểm định | Cặp giả thuyết & Đối thuyết | Tiêu chuẩn KĐ $K_{tn}$ | Miền bác bỏ $B_\alpha$ | Kết luận thống kê |
|:---:|:---|:---|:---:|:---:|:---|
| **1** | a. So sánh ĐK trung bình 2 NM ($n_1=121, n_2=121$)<br>b. Tỷ lệ loại C của NM1 có là 20%? | a. $H_0: \mu_1 = \mu_2$ vs $H_1: \mu_1 \ne \mu_2$ ($\alpha=0{,}01$)<br>b. $H_0: p = 0{,}20$ vs $H_1: p \ne 0{,}20$ ($\alpha=0{,}05$) | a. $K_{tn} \approx 0{,}85$<br>b. $K_{tn} \approx 0{,}86$ | a. $\|K\| > 2{,}58$<br>b. $\|K\| > 1{,}96$ | a. **Chấp nhận $H_0$** (ĐK TB bằng nhau)<br>b. **Chấp nhận $H_0$** (Tỷ lệ loại C là 20%) |
| **2** | Huyết sắc tố CN có thấp hơn chuẩn 138,3 g/l? | $H_0: \mu = 138{,}3$ vs $H_1: \mu < 138{,}3$ ($\alpha=0{,}01$) | $K_{tn} \approx -10{,}91$ | $(-\infty; -2{,}33)$ | **Bác bỏ $H_0$** (Lượng HST thấp hơn mức chung) |
| **3** | Trọng lượng thanh niên có thay đổi so với 48kg? | $H_0: \mu = 48$ vs $H_1: \mu \ne 48$ ($\alpha=0{,}01$) | $K_{tn} = 2{,}00$ | $\|K\| > 2{,}58$ | **Chấp nhận $H_0$** (Chưa thấy thay đổi ở mức 1%) |
| **4** | Sự khác nhau khối lượng 2 lô gà do ngẫu nhiên hay bản chất? | $H_0: \mu_A = \mu_B$ vs $H_1: \mu_A \ne \mu_B$ ($\alpha=0{,}05$) | $K_{tn} \approx -4{,}84$ | $\|K\| > 1{,}96$ | **Bác bỏ $H_0$** (Sự khác nhau thuộc về bản chất) |
| **5** | Trẻ thành thị có nặng hơn nông thôn không? | $H_0: \mu_{TT} = \mu_{NT}$ vs $H_1: \mu_{TT} > \mu_{NT}$ ($\alpha=0{,}05$) | $K_{tn} \approx 35{,}78$ | $(1{,}65; +\infty)$ | **Bác bỏ $H_0$** (Trẻ thành thị nặng cân hơn) |
| **6** | Đường máu sau 3h có giảm đi không? | $H_0: \mu_{\text{trước}} = \mu_{\text{sau}}$ vs $H_1: \mu_{\text{trước}} > \mu_{\text{sau}}$ ($\alpha=0{,}05$) | $K_{tn} \approx 4{,}55$ | $(1{,}65; +\infty)$ | **Bác bỏ $H_0$** (Đường trong máu thực sự giảm đi) |
| **7** | Tỷ lệ HST $<110$g/l ở nông trường có cao hơn 30%? | $H_0: p = 0{,}30$ vs $H_1: p > 0{,}30$ ($\alpha=0{,}10$) | $K_{tn} \approx 4{,}63$ | $(1{,}28; +\infty)$ | **Bác bỏ $H_0$** (Tỷ lệ cao hơn mức chung) |
| **8** | Khẳng định khỏi bệnh 90% có quá cao so với thực tế? | $H_0: p = 0{,}90$ vs $H_1: p < 0{,}90$ ($\alpha=0{,}05$) | $K_{tn} \approx -2{,}11$ | $(-\infty; -1{,}65)$ | **Bác bỏ $H_0$** (Khẳng định của NSX quá cao) |
| **9** | Hoạt động 2 máy tiện có khác nhau không? ($140/1000$ vs $260/2000$) | $H_0: p_1 = p_2$ vs $H_1: p_1 \ne p_2$ ($\alpha=0{,}05$) | $K_{tn} \approx 0{,}76$ | $\|K\| > 1{,}96$ | **Chấp nhận $H_0$** (Chưa đủ cơ sở nghi ngờ khác nhau) |
| **10** | Công tác ATLĐ ở 2 xí nghiệp có khác nhau không? ($20/200$ vs $120/800$) | $H_0: p_1 = p_2$ vs $H_1: p_1 \ne p_2$ ($\alpha=0{,}10$) | $K_{tn} \approx -1{,}82$ | $\|K\| > 1{,}65$ | **Bác bỏ $H_0$** (Chất lượng ATLĐ có sự khác nhau) |
| **11** | Hiệu quả điều trị thuốc B có cao hơn thuốc A không? ($21/52$ vs $12/20$) | $H_0: p_1 = p_2$ vs $H_1: p_2 > p_1$ ($\alpha=0{,}02$) | $K_{tn} \approx -1{,}50$ | $(-\infty; -2{,}05)$ | **Chấp nhận $H_0$** (Chưa đủ cơ sở kết luận B cao hơn A) |

---
\pagebreak

# PHẦN II: HƯỚNG DẪN BAREM ĐIỂM & QUY CHUẨN TRÌNH BÀY (THEO ĐÁP ÁN MẪU KMA)

Dựa trên cấu trúc đáp án chấm thi chính thức của Học viện Kỹ thuật Mật mã (tham chiếu trực tiếp từ tài liệu `image.png` và `image1.png`), thang điểm luôn được chia nhỏ thành các bước **0,5 điểm**. Để đạt điểm tối đa khi làm bài thi hoặc nộp bài tập lớn, người học cần tuân thủ nghiêm ngặt các quy tắc sau:

---

### 1. Quy chuẩn bài toán Xác suất cơ bản & Bernoulli (Tham chiếu Câu 1, Câu 2 - image1.png)

1. **Bước 1: Đặt tên biến cố và nêu giả thiết (0,5 điểm)**
   - Phải gọi tên biến cố rõ ràng bằng lời văn: Ví dụ `Đặt A_i = (Van thứ i bị hỏng), i = 1, 2`, `A = (Nồi áp suất hoạt động an toàn)`.
   - Nêu đầy đủ các xác suất tiên nghiệm đã cho: $P(A_1) = 0{,}2; P(A_2) = 0{,}3$.
   - **Bắt buộc có dòng nhận xét mối quan hệ:** *Nhận xét: $A_1, A_2$ là hai biến cố độc lập, không xung khắc*.
2. **Bước 2: Biểu diễn biến cố cần tìm qua các biến cố thành phần (0,5 điểm)**
   - Sử dụng biến cố đối lập hoặc công thức liên quan: $\overline{A} = (	ext{Nồi áp suất hoạt động không an toàn})$.
   - Biểu diễn tích/hợp: $\overline{A} = A_1 \cdot A_2$ (cả hai đều hỏng).
   - Áp dụng tính chất độc lập: $P(\overline{A}) = P(A_1) \cdot P(A_2) = 0{,}2 	imes 0{,}3 = 0{,}06$.
3. **Bước 3: Tính toán xác suất biến cố cần tìm và kết luận (0,5 điểm)**
   - Áp dụng công thức phần bù: $P(A) = 1 - P(\overline{A}) = 1 - 0{,}06 = 0{,}94$.
   - Kết luận rõ ràng bằng lời văn.

> **Với bài toán Bernoulli (Câu 2 - image1.png):**
> - Gọi biến cố cơ sở và xác suất thành công trong 1 phép thử: $P(A) = p = 0{,}95$ (0,5đ).
> - Nêu tên công thức áp dụng: *"Xác suất để 5 lần sút có ít nhất 4 lần bóng vào lưới theo công thức Bernoulli:"*
> - Viết rõ biểu thức tổ hợp: $P_5(4; 5) = C_5^4 (0{,}95)^4 (0{,}05)^1 + C_5^5 (0{,}95)^5 (0{,}05)^0$ (0,5đ).
> - Tính ra đáp số chính xác và kết luận: $0{,}9774$ (0,5đ).

---

### 2. Quy chuẩn bài toán Biến ngẫu nhiên liên tục (Tham chiếu Câu 3 - image1.png)

1. **Bước 1: Tính xác suất trên khoảng qua tích phân (0,5 điểm - 1,0 điểm)**
   - Viết đúng định nghĩa tích phân xác suất: $P(a < X < b) = \int_a^b f(x)dx$.
   - Thế đúng hàm mật độ vào cận tích phân: $\int_2^3 \frac{3}{4}(x-2)(4-x)dx$ (0,5đ).
   - Tính toán nguyên hàm và thay cận ra kết quả đúng: $P(2 < X < 3) = 0{,}5$ (0,5đ).
2. **Bước 2: Tính kỳ vọng toán $EX$ (0,5 điểm)**
   - Viết công thức giải tích: $EX = \int_{-\infty}^{+\infty} x f(x)dx = \int_a^b x f(x)dx$.
   - Tính đúng tích phân: ví dụ $\int_2^4 x \cdot \frac{3}{4}(x-2)(4-x)dx = 3$.
3. **Bước 3: Tính phương sai $DX$ (0,5 điểm)**
   - Viết công thức: $DX = VX = E(X^2) - (EX)^2$.
   - Tính riêng $E(X^2) = \int_a^b x^2 f(x)dx$ rồi trừ $(EX)^2$: ví dụ $\frac{46}{5} - 9 = \frac{1}{5} = 0{,}2$.

---

### 3. Quy chuẩn bài toán Thống kê: Ước lượng khoảng (Tham chiếu Câu 4a - image.png & image1.png)

1. **Bước 1: Khảo sát mẫu và tính đặc trưng mẫu (0,5 điểm)**
   - Với mẫu nhóm, chọn giá trị đại diện là trung điểm của từng lớp: $x_i = \frac{a_i + b_i}{2}$.
   - Tính kích thước mẫu: $n = \sum n_i = 140$.
   - Tính trung bình mẫu: $\overline{X} = \frac{1}{n} \sum n_i x_i = 35{,}49$.
   - Tính phương sai mẫu hiệu chỉnh: $\hat{s}^2$ (trong barem viết là $S^{*2}$ hoặc $S^2$): $S^{*2} = 188{,}86 \Rightarrow S = \sqrt{188{,}86} \approx 13{,}742$.
   - Nêu độ tin cậy đề cho: $\gamma = 0{,}95$.
2. **Bước 2: Thiết lập khoảng tin cậy đối xứng (0,5 điểm)**
   - Viết công thức dạng tổng quát:
     $$\overline{X} - \frac{S}{\sqrt{n}} z_b < EX < \overline{X} + \frac{S}{\sqrt{n}} z_b$$
   - *(Trong đó $z_b$ là giá trị tới hạn mức độ tin cậy $\gamma$)*.
3. **Bước 3: Tra bảng Laplace và tính toán (0,5 điểm)**
   - Nêu quy tắc tra bảng hàm Laplace (chuẩn giáo trình KMA/Việt Nam với $\Phi(x) = \frac{1}{\sqrt{2\pi}}\int_0^x e^{-t^2/2}dt$):
     $$\Phi(z_b) = \frac{\gamma}{2} = \frac{0{,}95}{2} = 0{,}475 \Longrightarrow z_b = 1{,}96$$
   - Thay số vào biểu thức khoảng: $35{,}49 - \frac{13{,}742}{\sqrt{140}} \cdot 1{,}96 < EX < 35{,}49 + \frac{13{,}742}{\sqrt{140}} \cdot 1{,}96$.
   - Cho kết quả khoảng tin cậy: **$33{,}21 < EX < 37{,}77$**.
   - Kết luận rõ độ chính xác của khoảng tin cậy: $\epsilon = \frac{S}{\sqrt{n}} z_b = 2{,}28$.

---

### 4. Quy chuẩn bài toán Thống kê: Kiểm định giả thuyết (Tham chiếu Câu 4b, Câu 5 - image.png)

Đây là dạng bài có quy trình chấm ngặt nghèo nhất, luôn gồm 4 bước bắt buộc:

1. **Bước 1: Đặt giả thuyết thống kê & đối thuyết (0,5 điểm)**
   - Gọi tên tham số cần kiểm định: Ví dụ *"Gọi $p_0$ là tỷ lệ theo ý kiến giả định ($p_0 = 0{,}2$); gọi $p$ là tỷ lệ thực tế..."*.
   - Viết cặp giả thuyết - đối thuyết:
     $$\begin{cases} H_0: p = 0{,}2 \\ H_1: p \ne 0{,}2 \end{cases} \quad \text{với mức ý nghĩa } \alpha = 0{,}01$$
     *(Hoặc kiểm định so sánh hai tỷ lệ: $H_0: p_1 = p_2$ đối thuyết $H_1: p_1 < p_2$)*.
2. **Bước 2: Xác định miền bác bỏ $B_\alpha$ (0,5 điểm)**
   - **Đối thuyết 2 phía ($H_1: \ne$):** Tra $\Phi(z_b) = \frac{1 - \alpha}{2}$.
     Ví dụ với $\alpha = 0{,}01 \Rightarrow \Phi(z_b) = 0{,}495 \Rightarrow z_b = 2{,}58$.
     Miền bác bỏ: $B_\alpha = (-\infty; -2{,}58) \cup (2{,}58; +\infty)$.
   - **Đối thuyết 1 phía ($H_1: <$ hoặc $>$):** Tra $\Phi(z_b) = \Phi(U_\alpha) = 0{,}5 - \alpha$.
     Ví dụ với $\alpha = 0{,}05 \Rightarrow \Phi(z_b) = 0{,}45 \Rightarrow z_b = 1{,}65$.
     Miền bác bỏ: $B_\alpha = (-\infty; -1{,}65)$ nếu $H_1: <$ (hoặc $(1{,}65; +\infty)$ nếu $H_1: >$).
3. **Bước 3: Tính giá trị thực nghiệm của tiêu chuẩn kiểm định $K_{tn}$ (0,5 điểm)**
   - Viết rõ công thức lý thuyết trước khi thay số:
     + Kiểm định 1 tỷ lệ:
       $$K_{tn} = \frac{f - p_0}{\sqrt{p_0(1 - p_0)}} \sqrt{n}$$
     + Kiểm định so sánh 2 tỷ lệ:
       $$\overline{f} = \frac{m_1 + m_2}{n_1 + n_2}, \quad K_{tn} = \frac{f_1 - f_2}{\sqrt{\overline{f}(1 - \overline{f})\left(\frac{1}{n_1} + \frac{1}{n_2}\right)}}$$
     + Kiểm định so sánh kỳ vọng:
       $$K_{tn} = \frac{\overline{X} - \mu_0}{\hat{s} / \sqrt{n}} \quad \text{hoặc} \quad K_{tn} = \frac{\overline{X} - \overline{Y}}{\sqrt{\frac{s_1^2}{n_1} + \frac{s_2^2}{n_2}}}$$
   - Thay số từ mẫu vào công thức để tính $K_{tn}$.
4. **Bước 4: So sánh và đưa ra kết luận thực tế (0,5 điểm)**
   - So sánh $K_{tn}$ với miền bác bỏ $B_\alpha$:
     + Nếu $K_{tn} \in B_\alpha$: Bác bỏ $H_0$, chấp nhận $H_1$.
     + Nếu $K_{tn} \notin B_\alpha$: Chưa có cơ sở bác bỏ $H_0$ (chấp nhận $H_0$).
   - **Bắt buộc có câu kết luận thực tế:** Kết luận về ý kiến thực tế của đề bài (ví dụ: *"Chấp nhận giả thuyết $H_0$, tức ý kiến cho rằng tỷ lệ con có trọng lượng trên 50 kg là 20% là đúng ở mức ý nghĩa 1%"*).

---
\pagebreak

# PHẦN III: LỜI GIẢI CHI TIẾT TOÀN BỘ ĐỀ (TRÌNH BÀY CHUẨN BAREM)

---

## CHƯƠNG 1: XÁC SUẤT CỔ ĐIỂN

### Bài 1 (Trang 1)
**Đề bài:** Gieo đồng thời hai con xúc sắc. Tính xác suất để:
a. Tổng số nốt xuất hiện trên hai con là 7.
b. Tổng số nốt xuất hiện trên hai con là 8.
c. Số nốt xuất hiện trên hai con hơn kém nhau 2.

**Lời giải chi tiết (theo barem chấm điểm):**
- Không gian mẫu $\Omega$ khi gieo đồng thời 2 con xúc sắc gồm các cặp số $(i, j)$ với $i, j \in \{1, 2, 3, 4, 5, 6\}$.
  Số phần tử của không gian mẫu là:
  $$|\Omega| = 6 \times 6 = 36$$

**a. Tính xác suất tổng số nốt xuất hiện trên hai con là 7:**
- Gọi $A$ là biến cố: "Tổng số nốt xuất hiện trên hai con xúc sắc là 7".
- Biến cố $A$ xảy ra khi các mặt xuất hiện là các cặp:
  $$A = \{(1, 6), (2, 5), (3, 4), (4, 3), (5, 2), (6, 1)\}$$
  Số trường hợp thuận lợi cho $A$ là $|A| = 6$.
- Xác suất của biến cố $A$ là:
  $$P(A) = \frac{|A|}{|\Omega|} = \frac{6}{36} = \frac{1}{6} \approx 0{,}1667$$

**b. Tính xác suất tổng số nốt xuất hiện trên hai con là 8:**
- Gọi $B$ là biến cố: "Tổng số nốt xuất hiện trên hai con xúc sắc là 8".
- Biến cố $B$ xảy ra khi các mặt xuất hiện là các cặp:
  $$B = \{(2, 6), (3, 5), (4, 4), (5, 3), (6, 2)\}$$
  Số trường hợp thuận lợi cho $B$ là $|B| = 5$.
- Xác suất của biến cố $B$ là:
  $$P(B) = \frac{|B|}{|\Omega|} = \frac{5}{36} \approx 0{,}1389$$

**c. Tính xác suất số nốt xuất hiện trên hai con hơn kém nhau 2:**
- Gọi $C$ là biến cố: "Số nốt xuất hiện trên hai con xúc sắc hơn kém nhau 2", tức là $|i - j| = 2$.
- Biến cố $C$ xảy ra khi các mặt xuất hiện là các cặp:
  $$C = \{(1, 3), (2, 4), (3, 5), (4, 6), (3, 1), (4, 2), (5, 3), (6, 4)\}$$
  Số trường hợp thuận lợi cho $C$ là $|C| = 8$.
- Xác suất của biến cố $C$ là:
  $$P(C) = \frac{|C|}{|\Omega|} = \frac{8}{36} = \frac{2}{9} \approx 0{,}2222$$

---

### Bài 2 (Trang 1)
**Đề bài:** Một chiếc hộp đựng 6 quả cầu trắng, 4 quả cầu đỏ và 2 quả cầu đen. Chọn ngẫu nhiên 6 quả cầu. Tìm xác suất để chọn được 3 quả trắng, 2 quả đỏ và 1 quả đen.

**Lời giải chi tiết:**
- Tổng số quả cầu trong hộp là: $6 + 4 + 2 = 12$ quả.
- Số cách chọn ngẫu nhiên 6 quả cầu từ 12 quả cầu là số phần tử của không gian mẫu:
  $$|\Omega| = C_{12}^6 = \frac{12!}{6!6!} = 924$$
- Gọi $A$ là biến cố: "Chọn được 3 quả cầu trắng, 2 quả cầu đỏ và 1 quả cầu đen".
- Để biến cố $A$ xảy ra, ta thực hiện các bước chọn độc lập:
  + Chọn 3 quả trắng từ 6 quả trắng có: $C_6^3 = 20$ cách.
  + Chọn 2 quả đỏ từ 4 quả đỏ có: $C_4^2 = 6$ cách.
  + Chọn 1 quả đen từ 2 quả đen có: $C_2^1 = 2$ cách.
- Theo quy tắc nhân, số trường hợp thuận lợi cho biến cố $A$ là:
  $$|A| = C_6^3 \times C_4^2 \times C_2^1 = 20 \times 6 \times 2 = 240$$
- Xác suất của biến cố $A$ là:
  $$P(A) = \frac{|A|}{|\Omega|} = \frac{240}{924} = \frac{20}{77} \approx 0{,}2597$$

---

### Bài 3 (Trang 1)
**Đề bài:** Một lớp có 20 học sinh: 5 học sinh giỏi, 10 học sinh khá, 5 học sinh trung bình. Theo danh sách chọn ngẫu nhiên 3 người. Tính xác suất để mỗi loại có đúng 1 người.

**Lời giải chi tiết:**
- Số cách chọn ngẫu nhiên 3 học sinh từ 20 học sinh trong lớp là:
  $$|\Omega| = C_{20}^3 = \frac{20 \times 19 \times 18}{3 \times 2 \times 1} = 1140$$
- Gọi $A$ là biến cố: "Mỗi loại có đúng 1 người" (gồm 1 giỏi, 1 khá, 1 trung bình).
- Số cách chọn thuận lợi cho $A$:
  + Chọn 1 học sinh giỏi từ 5 học sinh giỏi: $C_5^1 = 5$ cách.
  + Chọn 1 học sinh khá từ 10 học sinh khá: $C_{10}^1 = 10$ cách.
  + Chọn 1 học sinh trung bình từ 5 học sinh trung bình: $C_5^1 = 5$ cách.
- Số trường hợp thuận lợi cho $A$ là:
  $$|A| = C_5^1 \times C_{10}^1 \times C_5^1 = 5 \times 10 \times 5 = 250$$
- Xác suất của biến cố $A$ là:
  $$P(A) = \frac{|A|}{|\Omega|} = \frac{250}{1140} = \frac{25}{114} \approx 0{,}2193$$

---

### Bài 4 (Trang 1 - Trùng Câu 1 Đề thi mẫu `image1.png`)
**Đề bài:** Một nồi áp suất có nắp hai van an toàn. Xác suất các van bị hỏng tương ứng là 0,2 và 0,3. Tìm xác suất nồi áp suất hoạt động an toàn biết nồi hoạt động an toàn thì ít nhất 1 van không bị hỏng, cho biết các van hoạt động độc lập với nhau.

**Lời giải chi tiết (trình bày nguyên văn theo barem chuẩn KMA):**
- Đặt $A_i = (\text{Van thứ } i \text{ bị hỏng})$, $i = 1, 2$.
  Theo giả thiết:
  $$P(A_1) = 0{,}2; \quad P(A_2) = 0{,}3$$
- **Nhận xét:** $A_1, A_2$ là hai biến cố độc lập, không xung khắc.
- Gọi $A = (\text{Nồi áp suất hoạt động an toàn})$.
  Cần tìm $P(A)$.
- Xét biến cố đối:
  $\overline{A} = (\text{Nồi áp suất hoạt động không an toàn})$.
  Vì nồi an toàn khi có ít nhất 1 van không hỏng, nên nồi không an toàn khi cả hai van đều bị hỏng:
  $$\overline{A} = A_1 \cdot A_2$$
- Do $A_1, A_2$ độc lập nên áp dụng quy tắc nhân xác suất cho các biến cố độc lập:
  $$P(\overline{A}) = P(A_1) \cdot P(A_2) = 0{,}2 \times 0{,}3 = 0{,}06$$
- Xác suất để nồi áp suất hoạt động an toàn là:
  $$P(A) = 1 - P(\overline{A}) = 1 - 0{,}06 = 0{,}94$$
- **Kết luận:** Xác suất để nồi áp suất hoạt động an toàn là $0{,}94$.

---

### Bài 5 (Trang 1)
**Đề bài:** Một hộp chứa 5 cầu trắng, 3 cầu xanh, 4 cầu đen cùng kích thước. Chọn ngẫu nhiên đồng thời 3 quả cầu. Tính xác suất để cả 3 quả cầu ít nhất 2 quả cầu cùng màu.

**Lời giải chi tiết:**
- Tổng số quả cầu trong hộp: $5 + 3 + 4 = 12$ quả.
- Chọn ngẫu nhiên 3 quả từ 12 quả:
  $$|\Omega| = C_{12}^3 = \frac{12 \times 11 \times 10}{3 \times 2 \times 1} = 220$$
- Gọi $A$ là biến cố: "Trong 3 quả cầu lấy ra có ít nhất 2 quả cùng màu".
- Xét biến cố đối $\overline{A}$: "Cả 3 quả cầu lấy ra có màu đôi một khác nhau" (nghĩa là gồm 1 quả trắng, 1 quả xanh và 1 quả đen).
- Số cách chọn ra 1 quả trắng, 1 quả xanh, 1 quả đen là:
  $$|\overline{A}| = C_5^1 \times C_3^1 \times C_4^1 = 5 \times 3 \times 4 = 60$$
- Xác suất của biến cố đối $\overline{A}$ là:
  $$P(\overline{A}) = \frac{|\overline{A}|}{|\Omega|} = \frac{60}{220} = \frac{3}{11}$$
- Vậy xác suất để có ít nhất 2 quả cầu cùng màu là:
  $$P(A) = 1 - P(\overline{A}) = 1 - \frac{3}{11} = \frac{8}{11} = \frac{160}{220} \approx 0{,}7273$$

---

### Bài 6 (Trang 1)
**Đề bài:** Có hai túi đựng quả cầu. Túi thứ nhất chứa 3 quả cầu trắng, 7 quả đỏ và 15 quả xanh. Túi thứ 2 có chứa 10 quả trắng, 6 quả đỏ và 9 quả xanh. Từ mỗi túi ta chọn ngẫu nhiên một quả cầu. Tìm xác suất để 2 quả cầu được chọn đều có cùng màu.

**Lời giải chi tiết:**
- Túi 1 có tổng số: $3 + 7 + 15 = 25$ quả cầu.
- Túi 2 có tổng số: $10 + 6 + 9 = 25$ quả cầu.
- Không gian mẫu: lấy 1 quả từ túi 1 và 1 quả từ túi 2:
  $$|\Omega| = 25 \times 25 = 625$$
- Gọi $A$ là biến cố: "Hai quả cầu được chọn có cùng màu".
  Biến cố $A$ xảy ra khi xảy ra một trong ba trường hợp xung khắc sau:
  + $A_1$: Cả 2 quả đều màu trắng.
  + $A_2$: Cả 2 quả đều màu đỏ.
  + $A_3$: Cả 2 quả đều màu xanh.
- Tính số cách thuận lợi:
  + Chọn 2 quả trắng: lấy 1 quả trắng túi 1 ($C_3^1 = 3$) và 1 quả trắng túi 2 ($C_{10}^1 = 10$) $\Rightarrow 3 \times 10 = 30$ cách.
  + Chọn 2 quả đỏ: lấy 1 đỏ túi 1 ($C_7^1 = 7$) và 1 đỏ túi 2 ($C_6^1 = 6$) $\Rightarrow 7 \times 6 = 42$ cách.
  + Chọn 2 quả xanh: lấy 1 xanh túi 1 ($C_{15}^1 = 15$) và 1 xanh túi 2 ($C_9^1 = 9$) $\Rightarrow 15 \times 9 = 135$ cách.
- Số trường hợp thuận lợi cho $A$ là:
  $$|A| = 30 + 42 + 135 = 207$$
- Xác suất của biến cố $A$ là:
  $$P(A) = \frac{|A|}{|\Omega|} = \frac{207}{625} = 0{,}3312$$

---

### Bài 7 (Trang 1)
**Đề bài:** Có 30 tấm thẻ đánh số từ 1 đến 30. Chọn ngẫu nhiên ra 10 tấm thẻ. Tính xác suất để:
a. Tất cả 10 tấm thẻ đều mang số chẵn.
b. Có đúng 5 số chia hết cho 3.
c. Có 5 tấm thẻ mang số lẻ, 5 tấm thẻ mang số chẵn trong đó chỉ có 1 số chia hết cho 10.

**Lời giải chi tiết:**
- Số cách chọn ngẫu nhiên 10 tấm thẻ từ 30 tấm thẻ:
  $$|\Omega| = C_{30}^{10} = 30\,045\,015$$
- Phân loại tập các số từ 1 đến 30:
  + Số chẵn: $\{2, 4, 6, \dots, 30\} \Rightarrow 15$ số.
  + Số lẻ: $\{1, 3, 5, \dots, 29\} \Rightarrow 15$ số.
  + Số chia hết cho 3: $\{3, 6, 9, \dots, 30\} \Rightarrow 10$ số; không chia hết cho 3 có: $30 - 10 = 20$ số.
  + Số chia hết cho 10: $\{10, 20, 30\} \Rightarrow 3$ số (đều là số chẵn).
  + Số chẵn không chia hết cho 10: $15 - 3 = 12$ số.

**a. Tất cả 10 tấm thẻ đều mang số chẵn:**
- Gọi $A$ là biến cố: "Tất cả 10 tấm thẻ đều mang số chẵn".
- Chọn 10 thẻ chẵn từ 15 thẻ chẵn có:
  $$|A| = C_{15}^{10} = 3003$$
- Xác suất biến cố $A$:
  $$P(A) = \frac{C_{15}^{10}}{C_{30}^{10}} = \frac{3003}{30\,045\,015} = \frac{1}{10005} \approx 0{,}0001$$

**b. Có đúng 5 số chia hết cho 3:**
- Gọi $B$ là biến cố: "Có đúng 5 số chia hết cho 3" (đồng nghĩa 5 số còn lại không chia hết cho 3).
- Số cách chọn thuận lợi cho $B$:
  + Chọn 5 số chia hết cho 3 từ 10 số: $C_{10}^5 = 252$ cách.
  + Chọn 5 số không chia hết cho 3 từ 20 số: $C_{20}^5 = 15\,504$ cách.
- Số trường hợp thuận lợi:
  $$|B| = C_{10}^5 \times C_{20}^5 = 252 \times 15\,504 = 3\,907\,008$$
- Xác suất biến cố $B$:
  $$P(B) = \frac{3\,907\,008}{30\,045\,015} \approx 0{,}1300$$

**c. Có 5 tấm thẻ mang số lẻ, 5 tấm thẻ mang số chẵn trong đó chỉ có 1 số chia hết cho 10:**
- Gọi $C$ là biến cố cần tính.
- Để biến cố $C$ xảy ra, ta chọn:
  + 5 thẻ mang số lẻ từ 15 thẻ lẻ: $C_{15}^5 = 3003$ cách.
  + 1 thẻ chẵn chia hết cho 10 từ 3 thẻ $\{10, 20, 30\}$: $C_3^1 = 3$ cách.
  + 4 thẻ chẵn không chia hết cho 10 từ 12 thẻ chẵn còn lại: $C_{12}^4 = 495$ cách.
- Theo quy tắc nhân, số trường hợp thuận lợi cho $C$:
  $$|C| = C_{15}^5 \times C_3^1 \times C_{12}^4 = 3003 \times 3 \times 495 = 4\,459\,455$$
- Xác suất biến cố $C$:
  $$P(C) = \frac{4\,459\,455}{30\,045\,015} \approx 0{,}1484$$

---

### Bài 8 (Trang 1)
**Đề bài:** Một đoàn tàu gồm 3 toa đỗ ở sân ga. Có 5 hành khách bước lên tàu. Mỗi hành khách độc lập với nhau chọn ngẫu nhiên một toa. Tính xác suất để mỗi toa đều có ít nhất một hành khách mới bước lên.

**Lời giải chi tiết:**
- Mỗi hành khách có 3 khả năng lựa chọn toa tàu. Do 5 hành khách chọn độc lập nên số phần tử của không gian mẫu là:
  $$|\Omega| = 3^5 = 243$$
- Gọi $A$ là biến cố: "Mỗi toa đều có ít nhất một hành khách bước lên".
- Xét biến cố đối $\overline{A}$: "Có ít nhất một toa không có hành khách nào bước lên (toa trống)".
  Gọi $T_i$ là biến cố "Toa thứ $i$ trống" ($i = 1, 2, 3$). Khi đó $\overline{A} = T_1 \cup T_2 \cup T_3$.
  Áp dụng công thức cộng xác suất (nguyên lý bù trừ):
  $$|\overline{A}| = \sum_{i=1}^3 |T_i| - \sum_{1 \le i < j \le 3} |T_i \cap T_j| + |T_1 \cap T_2 \cap T_3|$$
  + Với mỗi toa $i$ trống, 5 hành khách chỉ vào 2 toa còn lại: $|T_i| = 2^5 = 32$. Có $C_3^1 = 3$ trường hợp.
  + Với 2 toa trống, 5 hành khách dồn hết vào 1 toa còn lại: $|T_i \cap T_j| = 1^5 = 1$. Có $C_3^2 = 3$ trường hợp.
  + Cả 3 toa đều trống: không thể xảy ra vì có 5 khách $\Rightarrow |T_1 \cap T_2 \cap T_3| = 0$.
- Do đó:
  $$|\overline{A}| = 3 \times 2^5 - 3 \times 1^5 = 3 \times 32 - 3 \times 1 = 96 - 3 = 93$$
- Số trường hợp thuận lợi cho biến cố $A$ là:
  $$|A| = |\Omega| - |\overline{A}| = 243 - 93 = 150$$
- *(Cách đếm trực tiếp: Phân phối 5 người vào 3 toa gồm 2 dạng cấu trúc: (3, 1, 1) có $C_3^1 \times C_5^3 \times 2! = 3 \times 10 \times 2 = 60$; dạng (2, 2, 1) có $C_3^1 \times C_5^1 \times C_4^2 = 3 \times 5 \times 6 = 90$. Tổng: $60 + 90 = 150$).*
- Xác suất của biến cố $A$:
  $$P(A) = \frac{|A|}{|\Omega|} = \frac{150}{243} = \frac{50}{81} \approx 0{,}6173$$

---

### Bài 9 (Trang 1)
**Đề bài:** Một đoàn tàu có 4 toa đỗ ở sân ga. Có 4 hành khách từ sân ga lên tàu, mỗi người độc lập với nhau chọn ngẫu nhiên một toa. Tính xác suất để 1 toa có 3 người, 1 toa có 1 người và hai toa còn lại để trống.

**Lời giải chi tiết:**
- Mỗi hành khách có 4 cách chọn toa. Với 4 hành khách chọn độc lập, số phần tử của không gian mẫu:
  $$|\Omega| = 4^4 = 256$$
- Gọi $A$ là biến cố: "Có 1 toa có 3 người, 1 toa có 1 người và 2 toa còn lại để trống".
- Để biến cố $A$ xảy ra, ta tiến hành các công đoạn chọn:
  1. Chọn 1 toa trong 4 toa để xếp 3 người vào: có $C_4^1 = 4$ cách chọn toa.
  2. Chọn 3 người trong 4 hành khách xếp vào toa đó: có $C_4^3 = 4$ cách chọn người.
  3. Chọn 1 toa trong 3 toa còn lại để xếp 1 người vào: có $C_3^1 = 3$ cách chọn toa.
  4. Người còn lại duy nhất xếp vào toa được chọn ở bước 3: có $C_1^1 = 1$ cách.
  5. Hai toa còn lại tự động để trống: có 1 cách.
- Theo quy tắc nhân, số trường hợp thuận lợi cho $A$:
  $$|A| = C_4^1 \times C_4^3 \times C_3^1 \times 1 = 4 \times 4 \times 3 \times 1 = 48$$
- Xác suất của biến cố $A$:
  $$P(A) = \frac{|A|}{|\Omega|} = \frac{48}{256} = \frac{3}{16} = 0{,}1875$$

---

### Bài 10 (Trang 1)
**Đề bài:** Trong hộp có 5 viên bi đỏ và 6 bi trắng. Lần lượt lấy ra 3 viên không hoàn lại. Tính xác suất viên thứ nhất và viên thứ hai có màu giống nhau.

**Lời giải chi tiết:**
- Tổng số bi trong hộp ban đầu là: $5 + 6 = 11$ viên.
- Gọi:
  + $Đ_i$ là biến cố: "Lần thứ $i$ lấy được viên bi màu đỏ".
  + $T_i$ là biến cố: "Lần thứ $i$ lấy được viên bi màu trắng", với $i = 1, 2, 3$.
- Gọi $A$ là biến cố: "Viên thứ nhất và viên thứ hai có màu giống nhau".
  Biến cố $A$ xảy ra khi xảy ra một trong hai trường hợp xung khắc:
  + Cả 2 viên đầu đều màu đỏ: $Đ_1 \cdot Đ_2$.
  + Cả 2 viên đầu đều màu trắng: $T_1 \cdot T_2$.
  *(Lưu ý: Màu của viên thứ 3 lấy ra sau đó không làm ảnh hưởng đến biến cố của 2 viên đầu).*
- Áp dụng quy tắc nhân xác suất có điều kiện:
  $$P(Đ_1 \cdot Đ_2) = P(Đ_1) \cdot P(Đ_2 \mid Đ_1) = \frac{5}{11} \times \frac{4}{10} = \frac{20}{110}$$
  $$P(T_1 \cdot T_2) = P(T_1) \cdot P(T_2 \mid T_1) = \frac{6}{11} \times \frac{5}{10} = \frac{30}{110}$$
- Do hai trường hợp trên xung khắc nhau nên:
  $$P(A) = P(Đ_1 \cdot Đ_2) + P(T_1 \cdot T_2) = \frac{20}{110} + \frac{30}{110} = \frac{50}{110} = \frac{5}{11} \approx 0{,}4545$$

---
\pagebreak

## CHƯƠNG 2: PHÉP THỬ LẶP, CÔNG THỨC BERNOULLI

### Bài 1 (Trang 1 - gồm 2 bài toán nhỏ)
#### Ý 1: Đấu thủ A và B thi đấu cờ
**Đề bài:** Hai đấu thủ A và B thi đấu cờ. Xác suất thắng của A trong một ván là 0,6 (không có hòa). Trận đấu bao gồm 5 ván. Người nào thắng một số ván lớn hơn là người thắng cuộc. Tính xác suất để B thắng cuộc.

**Lời giải chi tiết:**
- Do mỗi ván không có hòa và xác suất thắng của A là $P(A) = 0{,}6$, nên xác suất thắng của B trong 1 ván là:
  $$p = 1 - 0{,}6 = 0{,}4$$
- Trận đấu gồm $n = 5$ ván độc lập, mỗi ván xác suất thắng của B không đổi và bằng $p = 0{,}4$. Đây là dãy 5 phép thử Bernoulli.
- Để B thắng cuộc, B phải thắng số ván nhiều hơn A trong 5 ván, tức là B phải thắng ít nhất 3 ván ($k \in \{3, 4, 5\}$).
- Theo công thức Bernoulli, xác suất để B thắng đúng $k$ ván trong 5 ván là:
  $$P_n(k) = C_n^k p^k (1-p)^{n-k} = C_5^k (0{,}4)^k (0{,}6)^{5-k}$$
- Xác suất để B thắng cuộc là:
  $$P_B = P_5(3) + P_5(4) + P_5(5)$$
  + $P_5(3) = C_5^3 (0{,}4)^3 (0{,}6)^2 = 10 \times 0{,}064 \times 0{,}36 = 0{,}2304$
  + $P_5(4) = C_5^4 (0{,}4)^4 (0{,}6)^1 = 5 \times 0{,}0256 \times 0{,}6 = 0{,}0768$
  + $P_5(5) = C_5^5 (0{,}4)^5 (0{,}6)^0 = 1 \times 0{,}01024 \times 1 = 0{,}01024$
- Cộng các xác suất lại:
  $$P_B = 0{,}2304 + 0{,}0768 + 0{,}01024 = 0{,}31744 \approx 0{,}3174$$

---

#### Ý 2: Cầu thủ sút phạt đền (Trùng Câu 2 Đề thi mẫu `image1.png`)
**Đề bài:** Một cầu thủ sút phạt đền nổi tiếng (đá phạt 11m) với xác suất đá vào gôn là 0,95. Tính xác suất để 5 lần sút có ít nhất 4 lần bóng vào lưới.

**Lời giải chi tiết (trình bày nguyên văn theo barem chuẩn KMA):**
- Gọi $A$ là biến cố: "Cầu thủ đá phạt đền vào gôn 1 quả", ta có:
  $$P(A) = p = 0{,}95 \Longrightarrow q = 1 - p = 0{,}05$$
- Số lần sút bóng là $n = 5$. Các lần sút độc lập với nhau.
- Xác suất để 5 lần sút có ít nhất 4 lần bóng vào lưới theo công thức Bernoulli là:
  $$P_5(4; 5) = P_5(4) + P_5(5)$$
  $$P_5(4; 5) = C_5^4 (0{,}95)^4 (0{,}05)^1 + C_5^5 (0{,}95)^5 (0{,}05)^0$$
- Thay số tính toán:
  + $C_5^4 (0{,}95)^4 (0{,}05)^1 = 5 \times 0{,}81450625 \times 0{,}05 = 0{,}2036265625$
  + $C_5^5 (0{,}95)^5 (0{,}05)^0 = 1 \times 0{,}7737809375 \times 1 = 0{,}7737809375$
- Do đó:
  $$P_5(4; 5) = 0{,}2036265625 + 0{,}7737809375 = 0{,}9774075 \approx 0{,}9774$$
- **Kết luận:** Vậy xác suất để 5 lần sút có ít nhất 4 lần bóng vào lưới là **$0{,}9774$**.

---

### Bài 2 (Trang 1 - 2)
**Đề bài:** Một vùng núi có tỷ lệ mắc bệnh sốt rét là 10%. Chọn ngẫu nhiên 10 người, tính xác suất để có ít nhất 2 người bị sốt rét.

**Lời giải chi tiết:**
- Xác suất một người được chọn mắc bệnh sốt rét là $p = 0{,}1 \Rightarrow q = 1 - p = 0{,}9$.
- Chọn ngẫu nhiên $n = 10$ người, các người được chọn độc lập với nhau. Đây là dãy 10 phép thử Bernoulli.
- Gọi $X$ là số người mắc bệnh sốt rét trong 10 người chọn ra $\Rightarrow X \sim B(10; 0{,}1)$.
- Biến cố cần tính là "Có ít nhất 2 người bị sốt rét", tức là $X \ge 2$.
- Sử dụng biến cố đối:
  $$P(X \ge 2) = 1 - P(X = 0) - P(X = 1)$$
- Áp dụng công thức Bernoulli:
  + $P(X = 0) = C_{10}^0 (0{,}1)^0 (0{,}9)^{10} = (0{,}9)^{10} \approx 0{,}348678$
  + $P(X = 1) = C_{10}^1 (0{,}1)^1 (0{,}9)^9 = 10 \times 0{,}1 \times 0{,}387420 = 0{,}387420$
- Do đó:
  $$P(X \ge 2) = 1 - (0{,}348678 + 0{,}387420) = 1 - 0{,}736098 = 0{,}263902 \approx 0{,}2639$$

---

### Bài 3 (Trang 2)
**Đề bài:** Trong một thành phố, tỷ lệ người thích xem bóng đá là 65%, chọn ngẫu nhiên 12 người, tính xác suất để có đúng 5 người thích xem bóng đá.

**Lời giải chi tiết:**
- Xác suất một người thích xem bóng đá là $p = 0{,}65 \Rightarrow q = 1 - p = 0{,}35$.
- Số người chọn là $n = 12$ người độc lập.
- Gọi $X$ là số người thích xem bóng đá trong 12 người $\Rightarrow X \sim B(12; 0{,}65)$.
- Xác suất để có đúng 5 người thích xem bóng đá là $P(X = 5)$.
- Áp dụng công thức Bernoulli:
  $$P_{12}(5) = C_{12}^5 p^5 q^{12-5} = C_{12}^5 (0{,}65)^5 (0{,}35)^7$$
- Tính toán chi tiết:
  + $C_{12}^5 = \frac{12 \times 11 \times 10 \times 9 \times 8}{5 \times 4 \times 3 \times 2 \times 1} = 792$
  + $(0{,}65)^5 \approx 0{,}116029$
  + $(0{,}35)^7 \approx 0{,}00064339$
- Vậy:
  $$P(X = 5) = 792 \times 0{,}116029 \times 0{,}00064339 \approx 0{,}0591$$

---

### Bài 4 (Trang 2)
**Đề bài:** Một lớp học có 6 bóng đèn, mỗi bóng có xác suất bị cháy là 0,15. Lớp học đủ ánh sáng nếu có ít nhất 4 bóng đèn sáng. Tính xác suất để lớp học không đủ ánh sáng.

**Lời giải chi tiết:**
- Với mỗi bóng đèn:
  + Xác suất bóng bị cháy: $q = 0{,}15$.
  + Xác suất bóng còn sáng: $p = 1 - 0{,}15 = 0{,}85$.
- Số bóng đèn trong lớp là $n = 6$. Giả thiết các bóng hoạt động độc lập, ta có dãy 6 phép thử Bernoulli.
- Gọi $X$ là số bóng đèn còn sáng trong lớp $\Rightarrow X \sim B(6; 0{,}85)$.
- Lớp học đủ ánh sáng khi $X \ge 4$.
- Do đó, lớp học **không đủ ánh sáng** khi số bóng sáng nhỏ hơn 4, tức là $X \le 3$ (nghĩa là $X \in \{0, 1, 2, 3\}$).
- Theo công thức Bernoulli:
  $$P(X \le 3) = \sum_{k=0}^3 C_6^k (0{,}85)^k (0{,}15)^{6-k}$$
  + $P(X = 0) = C_6^0 (0{,}85)^0 (0{,}15)^6 = (0{,}15)^6 \approx 0{,}000011$
  + $P(X = 1) = C_6^1 (0{,}85)^1 (0{,}15)^5 = 6 \times 0{,}85 \times 0{,}000076 \approx 0{,}000387$
  + $P(X = 2) = C_6^2 (0{,}85)^2 (0{,}15)^4 = 15 \times 0{,}7225 \times 0{,}000506 \approx 0{,}005486$
  + $P(X = 3) = C_6^3 (0{,}85)^3 (0{,}15)^3 = 20 \times 0{,}614125 \times 0{,}003375 \approx 0{,}041453$
- Tổng xác suất lớp học không đủ ánh sáng là:
  $$P(X \le 3) = 0{,}000011 + 0{,}000387 + 0{,}005486 + 0{,}041453 = 0{,}047337 \approx 0{,}0473$$

---

### Bài 5 (Trang 2)
**Đề bài:** Một xạ thủ bắn liên tiếp 4 phát vào một mục tiêu với xác suất bắn trúng mỗi phát là 0,65. Gọi X là số phát đạn bắn trúng mục tiêu. Tính xác suất của biến cố $X^2 - 6X + 8 < 0$.

**Lời giải chi tiết:**
- Xạ thủ bắn $n = 4$ phát độc lập với xác suất trúng mỗi phát $p = 0{,}65$.
- Gọi $X$ là số phát đạn bắn trúng mục tiêu trong 4 phát $\Rightarrow X$ là đại lượng ngẫu nhiên tuân theo phân bố nhị thức:
  $$X \sim B(4; 0{,}65)$$
  Tập giá trị có thể có của $X$ là: $X \in \{0, 1, 2, 3, 4\}$.
- Giải bất phương trình:
  $$X^2 - 6X + 8 < 0 \Longleftrightarrow (X - 2)(X - 4) < 0 \Longleftrightarrow 2 < X < 4$$
- Do $X$ chỉ nhận các giá trị nguyên, nên trong khoảng $(2; 4)$ chỉ có duy nhất giá trị:
  $$X = 3$$
- Do đó, xác suất của biến cố $X^2 - 6X + 8 < 0$ chính là xác suất $P(X = 3)$.
- Áp dụng công thức Bernoulli với $n = 4, k = 3, p = 0{,}65, q = 0{,}35$:
  $$P(X = 3) = C_4^3 (0{,}65)^3 (0{,}35)^1 = 4 \times 0{,}274625 \times 0{,}35 = 0{,}384475 \approx 0{,}3845$$

---

### Bài 6 (Trang 2)
**Đề bài:** Một bài thi trắc nghiệm gồm 12 câu hỏi, mỗi câu có 5 câu trả lời, trong đó chỉ có một câu trả lời đúng. Giả sử mỗi câu trả lời đúng được 4 điểm và mỗi câu trả lời sai bị trừ 1 điểm. Một học sinh kém làm bài bằng cách chọn hú họa một câu trả lời. Tính xác suất để anh ta được 13 điểm.

**Lời giải chi tiết:**
- Do học sinh chọn hú họa (ngẫu nhiên) 1 câu trả lời trong 5 đáp án, nên xác suất trả lời đúng 1 câu là:
  $$p = \frac{1}{5} = 0{,}2 \Longrightarrow \text{xác suất sai là } q = 1 - 0{,}2 = 0{,}8$$
- Bài thi gồm $n = 12$ câu độc lập.
- Gọi $k$ là số câu trả lời đúng ($0 \le k \le 12$). Khi đó số câu trả lời sai là $12 - k$.
- Tổng số điểm $S$ của học sinh nhận được tính theo công thức:
  $$S = 4 \times k - 1 \times (12 - k) = 4k - 12 + k = 5k - 12$$
- Để học sinh được đúng 13 điểm thì:
  $$5k - 12 = 13 \Longleftrightarrow 5k = 25 \Longleftrightarrow k = 5$$
- Như vậy, học sinh được 13 điểm khi và chỉ khi trả lời đúng đúng 5 câu trong số 12 câu.
- Áp dụng công thức Bernoulli:
  $$P_{12}(5) = C_{12}^5 (0{,}2)^5 (0{,}8)^7$$
- Tính toán cụ thể:
  + $C_{12}^5 = 792$
  + $(0{,}2)^5 = 0{,}00032$
  + $(0{,}8)^7 \approx 0{,}2097152$
- Do đó xác suất để anh ta được 13 điểm là:
  $$P = 792 \times 0{,}00032 \times 0{,}2097152 \approx 0{,}05316 \approx 0{,}0532$$

---
\pagebreak

## CHƯƠNG 3: XÁC SUẤT CÓ ĐIỀU KIỆN, QUY TẮC NHÂN TỔNG QUÁT

### Bài 1 (Trang 2)
**Đề bài:** Một công ty cần tuyển 2 nhân viên. Có 6 người nộp đơn trong đó có 4 nữ, 2 nam. Khả năng được tuyển của mỗi người là như nhau. Tính xác suất để hai nữ được chọn nếu biết rằng ít nhất một nữ đã được chọn.

**Lời giải chi tiết:**
- Số cách chọn ngẫu nhiên 2 người từ 6 người nộp đơn là:
  $$|\Omega| = C_6^2 = 15$$
- Gọi $A$ là biến cố: "Có ít nhất một nữ được chọn".
- Gọi $B$ là biến cố: "Cả hai người được chọn đều là nữ".
- Biến cố cần tính là xác suất có điều kiện: $P(B \mid A)$.
  Theo công thức xác suất có điều kiện:
  $$P(B \mid A) = \frac{P(A \cap B)}{P(A)} = \frac{|A \cap B|}{|A|}$$
- Ta xác định số trường hợp thuận lợi:
  + Biến cố đối $\overline{A}$ là "Không có nữ nào được chọn" (tức chọn cả 2 nam):
    $$|\overline{A}| = C_2^2 = 1 \Longrightarrow |A| = |\Omega| - |\overline{A}| = 15 - 1 = 14$$
  + Biến cố $B$ (chọn 2 nữ từ 4 nữ): khi chọn được 2 nữ thì hiển nhiên có ít nhất 1 nữ, do đó $A \cap B = B$.
    $$|A \cap B| = |B| = C_4^2 = 6$$
- Vậy xác suất cần tìm là:
  $$P(B \mid A) = \frac{6}{14} = \frac{3}{7} \approx 0{,}4286$$

---

### Bài 2 (Trang 2)
**Đề bài:** Bắn 3 viên đạn vào một mục tiêu, xác suất bắn trúng đích mỗi viên là 0,3; 0,4; 0,5. Tính xác suất để ít nhất 2 viên trúng mục tiêu.

**Lời giải chi tiết:**
- Đặt $A_i$ là biến cố: "Viên đạn thứ $i$ bắn trúng đích" ($i = 1, 2, 3$).
  Theo giả thiết:
  $$P(A_1) = 0{,}3; \quad P(A_2) = 0{,}4; \quad P(A_3) = 0{,}5$$
  Xác suất bắn trượt của các viên tương ứng là:
  $$P(\overline{A_1}) = 0{,}7; \quad P(\overline{A_2}) = 0{,}6; \quad P(\overline{A_3}) = 0{,}5$$
- **Nhận xét:** $A_1, A_2, A_3$ là các biến cố độc lập trong toàn thể.
- Gọi $A$ là biến cố: "Có ít nhất 2 viên trúng mục tiêu".
  Biến cố $A$ xảy ra khi có đúng 2 viên trúng hoặc cả 3 viên trúng:
  $$A = (A_1 A_2 \overline{A_3}) \cup (A_1 \overline{A_2} A_3) \cup (\overline{A_1} A_2 A_3) \cup (A_1 A_2 A_3)$$
  Các biến cố trong phép hợp là đôi một xung khắc.
- Áp dụng quy tắc cộng và nhân xác suất cho các biến cố độc lập:
  + Đúng 2 viên trúng:
    * $P(A_1 A_2 \overline{A_3}) = 0{,}3 \times 0{,}4 \times 0{,}5 = 0{,}06$
    * $P(A_1 \overline{A_2} A_3) = 0{,}3 \times 0{,}6 \times 0{,}5 = 0{,}09$
    * $P(\overline{A_1} A_2 A_3) = 0{,}7 \times 0{,}4 \times 0{,}5 = 0{,}14$
    * Tổng xác suất đúng 2 viên trúng: $0{,}06 + 0{,}09 + 0{,}14 = 0{,}29$.
  + Cả 3 viên trúng:
    * $P(A_1 A_2 A_3) = 0{,}3 \times 0{,}4 \times 0{,}5 = 0{,}06$.
- Vậy xác suất để có ít nhất 2 viên trúng đích là:
  $$P(A) = 0{,}29 + 0{,}06 = 0{,}35$$

---

### Bài 3 (Trang 2)
**Đề bài:** Ba xạ thủ mỗi người bắn một viên đạn vào một mục tiêu với xác suất bắn trúng của mỗi người lần lượt là: 0,6; 0,7; 0,8. Tính xác suất có đúng một người bắn trúng.

**Lời giải chi tiết:**
- Đặt $A_i$ là biến cố: "Xạ thủ thứ $i$ bắn trúng mục tiêu" ($i = 1, 2, 3$).
  Theo đề bài:
  $$P(A_1) = 0{,}6 \Longrightarrow P(\overline{A_1}) = 0{,}4$$
  $$P(A_2) = 0{,}7 \Longrightarrow P(\overline{A_2}) = 0{,}3$$
  $$P(A_3) = 0{,}8 \Longrightarrow P(\overline{A_3}) = 0{,}2$$
- Nhận xét: $A_1, A_2, A_3$ là các biến cố độc lập nhau.
- Gọi $A$ là biến cố: "Có đúng một người bắn trúng mục tiêu".
  Biến cố $A$ xảy ra khi xảy ra một trong ba trường hợp xung khắc:
  $$A = (A_1 \overline{A_2} \overline{A_3}) \cup (\overline{A_1} A_2 \overline{A_3}) \cup (\overline{A_1} \overline{A_2} A_3)$$
- Áp dụng quy tắc cộng xác suất và quy tắc nhân cho các biến cố độc lập:
  $$P(A) = P(A_1 \overline{A_2} \overline{A_3}) + P(\overline{A_1} A_2 \overline{A_3}) + P(\overline{A_1} \overline{A_2} A_3)$$
  $$P(A) = 0{,}6 \times 0{,}3 \times 0{,}2 + 0{,}4 \times 0{,}7 \times 0{,}2 + 0{,}4 \times 0{,}3 \times 0{,}8$$
  $$P(A) = 0{,}036 + 0{,}056 + 0{,}096 = 0{,}188$$
- **Kết luận:** Xác suất có đúng một người bắn trúng là **$0{,}188$**.

---

### Bài 4 (Trang 2)
**Đề bài:** Hai xạ thủ cùng bắn mỗi người một phát vào một tấm bia. Xác suất bắn trúng một viên của mỗi người lần lượt là 0,95; 0,85. Tính xác suất để có ít nhất một viên đạn trúng đích.

**Lời giải chi tiết:**
- Đặt $A_i$ là biến cố: "Xạ thủ thứ $i$ bắn trúng bia" ($i = 1, 2$).
  $$P(A_1) = 0{,}95 \Longrightarrow P(\overline{A_1}) = 0{,}05$$
  $$P(A_2) = 0{,}85 \Longrightarrow P(\overline{A_2}) = 0{,}15$$
- Nhận xét: $A_1, A_2$ độc lập nhau.
- Gọi $A$ là biến cố: "Có ít nhất một viên đạn trúng đích".
- Xét biến cố đối $\overline{A}$: "Cả hai xạ thủ đều bắn trượt".
  $$\overline{A} = \overline{A_1} \cdot \overline{A_2}$$
- Do tính độc lập:
  $$P(\overline{A}) = P(\overline{A_1}) \cdot P(\overline{A_2}) = 0{,}05 \times 0{,}15 = 0{,}0075$$
- Vậy xác suất để có ít nhất một viên trúng đích là:
  $$P(A) = 1 - P(\overline{A}) = 1 - 0{,}0075 = 0{,}9925$$

---

### Bài 5 (Trang 2)
**Đề bài:** Gieo 3 con xúc sắc cân đối đồng chất một cách độc lập. Tính xác suất để:
a. Tổng số nốt xuất hiện là 8 nếu biết rằng ít nhất có một con ra nốt 1.
b. Có ít nhất một con ra lục nếu biết rằng số nốt trên 3 con là khác nhau.

**Lời giải chi tiết:**
- Mỗi con xúc sắc có 6 mặt. Số phần tử không gian mẫu khi gieo 3 con xúc sắc:
  $$|\Omega| = 6^3 = 216$$

**a. Tổng số nốt là 8 nếu biết rằng ít nhất có một con ra nốt 1:**
- Gọi $A$ là biến cố: "Tổng số nốt xuất hiện trên 3 con là 8".
- Gọi $B$ là biến cố: "Có ít nhất một con ra nốt 1".
  Cần tính xác suất có điều kiện: $P(A \mid B) = \frac{|A \cap B|}{|B|}$.
- Xác định số phần tử của $B$:
  Biến cố đối $\overline{B}$ là "Không có con nào ra nốt 1" (mỗi con nhận từ $\{2, 3, 4, 5, 6\}$):
  $$|\overline{B}| = 5^3 = 125 \Longrightarrow |B| = 216 - 125 = 91$$
- Xác định số phần tử của $A \cap B$ (Tổng bằng 8 và có ít nhất một con nốt 1):
  Phân tích số 8 thành tổng 3 số từ $\{1..6\}$:
  + Dạng $\{1, 1, 6\}$: có $\frac{3!}{2!} = 3$ hoán vị.
  + Dạng $\{1, 2, 5\}$: có $3! = 6$ hoán vị.
  + Dạng $\{1, 3, 4\}$: có $3! = 6$ hoán vị.
  *(Các dạng còn lại có tổng bằng 8 là $\{2, 2, 4\}$ và $\{2, 3, 3\}$ không chứa số 1).*
  Do đó:
  $$|A \cap B| = 3 + 6 + 6 = 15$$
- Vậy xác suất có điều kiện là:
  $$P(A \mid B) = \frac{15}{91} \approx 0{,}1648$$

**b. Có ít nhất một con ra lục nếu biết rằng số nốt trên 3 con là khác nhau:**
- Gọi $C$ là biến cố: "Có ít nhất một con ra lục (nốt 6)".
- Gọi $D$ là biến cố: "Số nốt trên 3 con là khác nhau".
  Cần tính: $P(C \mid D) = \frac{|C \cap D|}{|D|}$.
- Số phần tử của $D$ là chỉnh hợp chập 3 của 6 phần tử:
  $$|D| = A_6^3 = 6 \times 5 \times 4 = 120$$
- Xét biến cố $\overline{C} \cap D$: "Số nốt trên 3 con đôi một khác nhau và không có con nào ra lục" (chọn 3 số khác nhau từ 5 số $\{1, 2, 3, 4, 5\}$):
  $$|\overline{C} \cap D| = A_5^3 = 5 \times 4 \times 3 = 60$$
- Do đó số trường hợp thuận lợi cho $C \cap D$ là:
  $$|C \cap D| = |D| - |\overline{C} \cap D| = 120 - 60 = 60$$
- Vậy xác suất có điều kiện là:
  $$P(C \mid D) = \frac{60}{120} = \frac{1}{2} = 0{,}5$$

---

### Bài 6 (Trang 2)
**Đề bài:** Một cuộc thi có 3 vòng. Vòng 1 lấy 90% thí sinh. Vòng 2 lấy 80% thí sinh của vòng 1 và vòng 3 lấy 90% thí sinh của vòng 2.
a. Tính xác suất để một thí sinh lọt qua 3 vòng thi.
b. Tính xác suất để một thí sinh bị loại ở vòng 2 nếu biết rằng thí sinh đó bị loại.

**Lời giải chi tiết:**
- Đặt $V_i$ là biến cố: "Thí sinh vượt qua vòng thứ $i$" ($i = 1, 2, 3$).
  Theo giả thiết của đề bài:
  + Xác suất qua vòng 1: $P(V_1) = 0{,}9 \Rightarrow P(\overline{V_1}) = 0{,}1$ (bị loại ở vòng 1).
  + Xác suất qua vòng 2 nếu đã qua vòng 1: $P(V_2 \mid V_1) = 0{,}8 \Rightarrow P(\overline{V_2} \mid V_1) = 0{,}2$ (bị loại ở vòng 2).
  + Xác suất qua vòng 3 nếu đã qua cả 2 vòng trước: $P(V_3 \mid V_1 V_2) = 0{,}9 \Rightarrow P(\overline{V_3} \mid V_1 V_2) = 0{,}1$.

**a. Tính xác suất để một thí sinh lọt qua 3 vòng thi:**
- Biến cố thí sinh lọt qua cả 3 vòng là biến cố tích $V_1 \cdot V_2 \cdot V_3$.
- Theo quy tắc nhân xác suất tổng quát:
  $$P(V_1 V_2 V_3) = P(V_1) \cdot P(V_2 \mid V_1) \cdot P(V_3 \mid V_1 V_2)$$
  $$P(V_1 V_2 V_3) = 0{,}9 \times 0{,}8 \times 0{,}9 = 0{,}648$$

**b. Tính xác suất để thí sinh bị loại ở vòng 2 nếu biết rằng thí sinh đó bị loại:**
- Gọi $L$ là biến cố: "Thí sinh bị loại trong cuộc thi".
  Biến cố thí sinh bị loại chính là biến cố đối của "vượt qua cả 3 vòng":
  $$P(L) = 1 - P(V_1 V_2 V_3) = 1 - 0{,}648 = 0{,}352$$
- Gọi $L_2$ là biến cố: "Thí sinh bị loại ở vòng 2".
  Thí sinh bị loại ở vòng 2 khi và chỉ khi thí sinh đó đã vượt qua vòng 1 nhưng trượt ở vòng 2:
  $$L_2 = V_1 \cdot \overline{V_2}$$
  Xác suất để thí sinh bị loại ở vòng 2 là:
  $$P(L_2) = P(V_1 \cdot \overline{V_2}) = P(V_1) \cdot P(\overline{V_2} \mid V_1) = 0{,}9 \times 0{,}2 = 0{,}18$$
- Vì khi thí sinh đã bị loại ở vòng 2 thì hiển nhiên thuộc biến cố "bị loại", tức là $L_2 \cap L = L_2$.
- Theo công thức xác suất có điều kiện:
  $$P(L_2 \mid L) = \frac{P(L_2 \cap L)}{P(L)} = \frac{P(L_2)}{P(L)} = \frac{0{,}18}{0{,}352} = \frac{180}{352} = \frac{45}{88} \approx 0{,}5114$$

---
\pagebreak

## CHƯƠNG 4: CÔNG THỨC XÁC SUẤT ĐẦY ĐỦ VÀ CÔNG THỨC BAYES

### Bài 1 (Trang 2)
**Đề bài:** Có hai chuồng thỏ. Chuồng thứ nhất có 3 thỏ trắng và 3 thỏ nâu. Chuồng thứ 2 có 6 thỏ trắng và 4 thỏ nâu. Bắt ngẫu nhiên 4 con thỏ ở chuồng thứ nhất bỏ vào chuồng thứ hai rồi sau đó bắt ngẫu nhiên một con thỏ ở chuồng thứ hai ra. Tính xác suất để bắt được thỏ nâu từ chuồng thứ hai.

**Lời giải chi tiết:**
- Chuồng 1 ban đầu có 6 con (3 trắng, 3 nâu). Bắt 4 con từ chuồng 1 sang chuồng 2.
- Gọi $H_i$ là biến cố: "Trong 4 con thỏ chuyển từ chuồng 1 sang chuồng 2 có đúng $i$ con thỏ nâu" (khi đó số thỏ trắng chuyển sang là $4 - i$).
  Vì chuồng 1 chỉ có 3 con trắng và 3 con nâu nên số thỏ nâu $i$ thỏa mãn:
  $$4 - 3 \le i \le 3 \Longrightarrow i \in \{1, 2, 3\}$$
- Nhận xét: Hệ $\{H_1, H_2, H_3\}$ là một hệ biến cố đầy đủ.
- Tính xác suất của các biến cố trong hệ đầy đủ (chọn 4 con từ 6 con của chuồng 1, $C_6^4 = 15$):
  $$P(H_1) = \frac{C_3^1 C_3^3}{C_6^4} = \frac{3 \times 1}{15} = \frac{3}{15}$$
  $$P(H_2) = \frac{C_3^2 C_3^2}{C_6^4} = \frac{3 \times 3}{15} = \frac{9}{15}$$
  $$P(H_3) = \frac{C_3^3 C_3^1}{C_6^4} = \frac{1 \times 3}{15} = \frac{3}{15}$$
- Gọi $A$ là biến cố: "Bắt được một con thỏ nâu từ chuồng thứ hai".
  Chuồng 2 ban đầu có 10 con (6 trắng, 4 nâu). Sau khi nhận thêm 4 con thì chuồng 2 có tổng cộng $10 + 4 = 14$ con thỏ.
- Xác suất có điều kiện để bắt được thỏ nâu tương ứng trong từng trường hợp:
  + Nếu $H_1$ xảy ra: chuồng 2 có $4 + 1 = 5$ thỏ nâu $\Rightarrow P(A \mid H_1) = \frac{5}{14}$.
  + Nếu $H_2$ xảy ra: chuồng 2 có $4 + 2 = 6$ thỏ nâu $\Rightarrow P(A \mid H_2) = \frac{6}{14}$.
  + Nếu $H_3$ xảy ra: chuồng 2 có $4 + 3 = 7$ thỏ nâu $\Rightarrow P(A \mid H_3) = \frac{7}{14}$.
- Áp dụng công thức xác suất đầy đủ:
  $$P(A) = P(H_1)P(A \mid H_1) + P(H_2)P(A \mid H_2) + P(H_3)P(A \mid H_3)$$
  $$P(A) = \frac{3}{15} \times \frac{5}{14} + \frac{9}{15} \times \frac{6}{14} + \frac{3}{15} \times \frac{7}{14} = \frac{15 + 54 + 21}{210} = \frac{90}{210} = \frac{3}{7} \approx 0{,}4286$$

---

### Bài 2 (Trang 2)
**Đề bài:** Bốn máy tự động của một nhà máy cùng sản xuất một loại chi tiết. Máy I sản xuất 25% tổng số chi tiết, máy II sản xuất 30%, máy III sản xuất 30%, còn lại là máy IV sản xuất. Tỷ lệ phế phẩm do các máy I, II, III, IV lần lượt là 1%; 3%; 2%; 4%. Tính xác suất để khi lấy ngẫu nhiên một sản phẩm từ kho thì sản phẩm đó là phế phẩm.

**Lời giải chi tiết:**
- Tỷ lệ sản phẩm do máy IV sản xuất là:
  $$100\% - (25\% + 30\% + 30\%) = 15\%$$
- Gọi $A_i$ là biến cố: "Sản phẩm lấy ra do máy thứ $i$ sản xuất", với $i \in \{1, 2, 3, 4\}$.
  Hệ $\{A_1, A_2, A_3, A_4\}$ lập thành một nhóm biến cố đầy đủ.
  Theo đề bài:
  $$P(A_1) = 0{,}25; \quad P(A_2) = 0{,}30; \quad P(A_3) = 0{,}30; \quad P(A_4) = 0{,}15$$
- Gọi $B$ là biến cố: "Sản phẩm lấy ra là phế phẩm".
  Xác suất phế phẩm của từng máy là:
  $$P(B \mid A_1) = 0{,}01; \quad P(B \mid A_2) = 0{,}03; \quad P(B \mid A_3) = 0{,}02; \quad P(B \mid A_4) = 0{,}04$$
- Áp dụng công thức xác suất đầy đủ:
  $$P(B) = \sum_{i=1}^4 P(A_i) P(B \mid A_i)$$
  $$P(B) = 0{,}25 \times 0{,}01 + 0{,}30 \times 0{,}03 + 0{,}30 \times 0{,}02 + 0{,}15 \times 0{,}04$$
  $$P(B) = 0{,}0025 + 0{,}0090 + 0{,}0060 + 0{,}0060 = 0{,}0235$$
- **Kết luận:** Xác suất để lấy phải phế phẩm là **$0{,}0235$** (tức $2{,}35\%$).

---

### Bài 3 (Trang 3)
**Đề bài:** Một nông trường có 4 đội sản xuất. Đội I sản xuất 20% tổng sản lượng nông trại của nông trường. Đội II sản xuất 25% tổng sản lượng, đội III sản xuất 30% tổng sản lượng. Tỷ lệ phế phẩm tương ứng với các đội sản xuất là 0,15; 0,08; 0,05 và 0,01. Lấy ngẫu nhiên một sản phẩm trong kho của nông trường. Tính xác suất để lấy phải một phế phẩm.

**Lời giải chi tiết:**
- Tỷ lệ sản lượng của đội IV là:
  $$100\% - (20\% + 25\% + 30\%) = 25\% = 0{,}25$$
- Gọi $H_i$ là biến cố: "Sản phẩm lấy ra do đội thứ $i$ sản xuất" ($i = 1, 2, 3, 4$).
  Hệ $\{H_1, H_2, H_3, H_4\}$ là hệ đầy đủ với:
  $$P(H_1) = 0{,}20; \quad P(H_2) = 0{,}25; \quad P(H_3) = 0{,}30; \quad P(H_4) = 0{,}25$$
- Gọi $A$ là biến cố: "Lấy phải một phế phẩm".
  Các xác suất điều kiện:
  $$P(A \mid H_1) = 0{,}15; \quad P(A \mid H_2) = 0{,}08; \quad P(A \mid H_3) = 0{,}05; \quad P(A \mid H_4) = 0{,}01$$
- Áp dụng công thức xác suất đầy đủ:
  $$P(A) = \sum_{i=1}^4 P(H_i) P(A \mid H_i)$$
  $$P(A) = 0{,}20 \times 0{,}15 + 0{,}25 \times 0{,}08 + 0{,}30 \times 0{,}05 + 0{,}25 \times 0{,}01$$
  $$P(A) = 0{,}0300 + 0{,}0200 + 0{,}0150 + 0{,}0025 = 0{,}0675$$
- **Kết luận:** Xác suất để lấy phải phế phẩm là **$0{,}0675$** ($6{,}75\%$).

---

### Bài 4 (Trang 3)
**Đề bài:** Một nhà máy sản xuất bóng đèn gồm 3 phân xưởng: phân xưởng I sản xuất 10%, phân xưởng II sản xuất 20%, phân xưởng III sản xuất 70% tổng số bóng đèn của nhà máy. Tỷ lệ phế phẩm của các phân xưởng tương ứng là 2%, 3%, 4%. Hãy tính tỷ lệ phế phẩm chung của nhà máy.

**Lời giải chi tiết:**
- Gọi $A_i$ là biến cố: "Bóng đèn được chọn do phân xưởng thứ $i$ sản xuất" ($i = 1, 2, 3$).
  Hệ $\{A_1, A_2, A_3\}$ là một hệ biến cố đầy đủ với:
  $$P(A_1) = 0{,}10; \quad P(A_2) = 0{,}20; \quad P(A_3) = 0{,}70$$
- Gọi $F$ là biến cố: "Bóng đèn được chọn là phế phẩm".
  Các tỷ lệ phế phẩm điều kiện:
  $$P(F \mid A_1) = 0{,}02; \quad P(F \mid A_2) = 0{,}03; \quad P(F \mid A_3) = 0{,}04$$
- Tỷ lệ phế phẩm chung của nhà máy chính là xác suất $P(F)$, tính theo công thức xác suất đầy đủ:
  $$P(F) = P(A_1)P(F \mid A_1) + P(A_2)P(F \mid A_2) + P(A_3)P(F \mid A_3)$$
  $$P(F) = 0{,}10 \times 0{,}02 + 0{,}20 \times 0{,}03 + 0{,}70 \times 0{,}04$$
  $$P(F) = 0{,}002 + 0{,}006 + 0{,}028 = 0{,}036$$
- **Kết luận:** Tỷ lệ phế phẩm chung của toàn nhà máy là **$0{,}036$** hay **$3{,}6\%$**.

---

### Bài 5 (Trang 3)
**Đề bài:** Một vùng dân cư gồm 3 bộ tộc thiểu số A, B, C sinh sống với tỷ lệ tương ứng là 20%; 30% và 50%. Tỷ lệ mắc bệnh sốt rét tương ứng của mỗi bộ là 5%; 3% và 2%. Lấy ngẫu nhiên một người trong vùng. Tính xác suất để người đó mắc bệnh sốt rét.

**Lời giải chi tiết:**
- Gọi $H_1, H_2, H_3$ lần lượt là biến cố: "Người được chọn thuộc bộ tộc A, B, C".
  Hệ $\{H_1, H_2, H_3\}$ là hệ biến cố đầy đủ:
  $$P(H_1) = 0{,}20; \quad P(H_2) = 0{,}30; \quad P(H_3) = 0{,}50$$
- Gọi $M$ là biến cố: "Người được chọn mắc bệnh sốt rét".
  Các xác suất điều kiện:
  $$P(M \mid H_1) = 0{,}05; \quad P(M \mid H_2) = 0{,}03; \quad P(M \mid H_3) = 0{,}02$$
- Áp dụng công thức xác suất đầy đủ:
  $$P(M) = P(H_1)P(M \mid H_1) + P(H_2)P(M \mid H_2) + P(H_3)P(M \mid H_3)$$
  $$P(M) = 0{,}20 \times 0{,}05 + 0{,}30 \times 0{,}03 + 0{,}50 \times 0{,}02$$
  $$P(M) = 0{,}010 + 0{,}009 + 0{,}010 = 0{,}029$$
- **Kết luận:** Xác suất để người được chọn mắc bệnh sốt rét là **$0{,}029$** ($2{,}9\%$).

---

### Bài 6 (Trang 3)
**Đề bài:** Có hai chuồng thỏ. Chuồng thứ nhất có 5 con thỏ đen và 10 con thỏ trắng. Chuồng thứ hai có 3 con thỏ trắng và 7 thỏ đen. Từ chuồng thứ hai bắt ngẫu nhiên một con thỏ cho vào chuồng thứ nhất, rồi sau đó lại bắt ngẫu nhiên một con thỏ ở chuồng thứ nhất ra, thì được thỏ trắng. Tính xác suất để thỏ trắng này là của chuồng thứ nhất.

**Lời giải chi tiết:**
- Chuồng 1 ban đầu có 15 con (5 đen, 10 trắng).
- Chuồng 2 ban đầu có 10 con (3 trắng, 7 đen).
- Gọi các giả thiết khi chuyển 1 con thỏ từ chuồng 2 sang chuồng 1:
  + $H_1$: "Con thỏ chuyển từ chuồng 2 sang chuồng 1 là thỏ trắng".
    $$P(H_1) = \frac{3}{10} = 0{,}3$$
  + $H_2$: "Con thỏ chuyển từ chuồng 2 sang chuồng 1 là thỏ đen".
    $$P(H_2) = \frac{7}{10} = 0{,}7$$
  Hệ $\{H_1, H_2\}$ là hệ biến cố đầy đủ.
- Gọi $A$ là biến cố: "Bắt được một con thỏ trắng từ chuồng thứ nhất (sau khi đã thêm 1 con)".
  Khi thêm 1 con, chuồng 1 có 16 con.
  + Nếu $H_1$ xảy ra: chuồng 1 có $10 + 1 = 11$ thỏ trắng $\Rightarrow P(A \mid H_1) = \frac{11}{16}$.
  + Nếu $H_2$ xảy ra: chuồng 1 vẫn có 10 thỏ trắng ban đầu $\Rightarrow P(A \mid H_2) = \frac{10}{16}$.
  Áp dụng công thức xác suất đầy đủ, xác suất bắt được thỏ trắng là:
  $$P(A) = P(H_1)P(A \mid H_1) + P(H_2)P(A \mid H_2) = \frac{3}{10} \times \frac{11}{16} + \frac{7}{10} \times \frac{10}{16} = \frac{33 + 70}{160} = \frac{103}{160}$$
- Gọi $B$ là biến cố: "Bắt được con thỏ trắng vốn có sẵn của chuồng thứ nhất".
  Vì dù con thỏ chuyển sang là trắng hay đen thì số thỏ trắng vốn của chuồng 1 vẫn là 10 con trên tổng số 16 con:
  $$P(B \mid H_1) = \frac{10}{16}, \quad P(B \mid H_2) = \frac{10}{16} \Longrightarrow P(B) = \frac{10}{16} = \frac{100}{160}$$
- Nhận thấy $B \subset A$ nên $B \cap A = B$.
  Theo định nghĩa xác suất có điều kiện, xác suất để con thỏ trắng bắt ra vốn thuộc chuồng 1 là:
  $$P(B \mid A) = \frac{P(B \cap A)}{P(A)} = \frac{P(B)}{P(A)} = \frac{100/160}{103/160} = \frac{100}{103} \approx 0{,}9709$$

---

### Bài 7 (Trang 3)
**Đề bài:** Có 2 lô gà giống. Lô 1 gồm 15 con, trong đó có 3 con trống. Lô 2 gồm 20 con, trong đó có 4 con trống. Một con từ lô 2 nhảy sang lô 1. Từ lô 1, ta bắt ngẫu nhiên ra một con. Tìm xác suất để con gà bắt ra là gà trống.

**Lời giải chi tiết:**
- Lô 2 có 20 con gồm 4 trống, 16 mái.
- Gọi các biến cố đối với con gà từ lô 2 nhảy sang lô 1:
  + $H_1$: "Con gà nhảy sang là gà trống" $\Rightarrow P(H_1) = \frac{4}{20} = \frac{1}{5} = 0{,}2$.
  + $H_2$: "Con gà nhảy sang là gà mái" $\Rightarrow P(H_2) = \frac{16}{20} = \frac{4}{5} = 0{,}8$.
  Hệ $\{H_1, H_2\}$ là hệ biến cố đầy đủ.
- Lô 1 ban đầu có 15 con (3 trống). Sau khi nhận 1 con thì có 16 con.
- Gọi $A$ là biến cố: "Bắt ngẫu nhiên được một con gà trống từ lô 1".
  + Nếu $H_1$ xảy ra: lô 1 có $3 + 1 = 4$ con trống $\Rightarrow P(A \mid H_1) = \frac{4}{16} = \frac{1}{4}$.
  + Nếu $H_2$ xảy ra: lô 1 vẫn có 3 con trống $\Rightarrow P(A \mid H_2) = \frac{3}{16}$.
- Áp dụng công thức xác suất đầy đủ:
  $$P(A) = P(H_1)P(A \mid H_1) + P(H_2)P(A \mid H_2)$$
  $$P(A) = \frac{1}{5} \times \frac{4}{16} + \frac{4}{5} \times \frac{3}{16} = \frac{4 + 12}{80} = \frac{16}{80} = \frac{1}{5} = 0{,}20$$

---

### Bài 8 & Bài 12 (Trang 3 & Trang 4 - Hai bài giống nhau)
**Đề bài:** Trong số 18 xạ thủ, nhóm 1 gồm 5 người bắn trúng đích với xác suất 0,8; nhóm 2 gồm 7 người bắn trúng đích với xác suất 0,7; nhóm 3 gồm 4 người bắn trúng đích với xác suất 0,6; nhóm 4 gồm 2 người bắn trúng đích với xác suất 0,5. Chọn hú họa một xạ thủ và cho anh ta bắn một phát, nhưng kết quả không trúng bia; xạ thủ ấy có khả năng thuộc nhóm nào nhiều nhất?

**Lời giải chi tiết:**
- Tổng số xạ thủ: $5 + 7 + 4 + 2 = 18$ người.
- Gọi $H_i$ là biến cố: "Xạ thủ được chọn thuộc nhóm thứ $i$" ($i = 1, 2, 3, 4$).
  Hệ $\{H_1, H_2, H_3, H_4\}$ là một nhóm biến cố đầy đủ:
  $$P(H_1) = \frac{5}{18}; \quad P(H_2) = \frac{7}{18}; \quad P(H_3) = \frac{4}{18}; \quad P(H_4) = \frac{2}{18}$$
- Gọi $T$ là biến cố: "Xạ thủ bắn trượt (không trúng bia)".
  Xác suất bắn trượt của mỗi người trong từng nhóm:
  $$P(T \mid H_1) = 1 - 0{,}8 = 0{,}2$$
  $$P(T \mid H_2) = 1 - 0{,}7 = 0{,}3$$
  $$P(T \mid H_3) = 1 - 0{,}6 = 0{,}4$$
  $$P(T \mid H_4) = 1 - 0{,}5 = 0{,}5$$
- Xác suất đầy đủ để xạ thủ được chọn bắn trượt là:
  $$P(T) = \sum_{i=1}^4 P(H_i) P(T \mid H_i)$$
  $$P(T) = \frac{5}{18} \times 0{,}2 + \frac{7}{18} \times 0{,}3 + \frac{4}{18} \times 0{,}4 + \frac{2}{18} \times 0{,}5 = \frac{1{,}0 + 2{,}1 + 1{,}6 + 1{,}0}{18} = \frac{5{,}7}{18}$$
- Áp dụng công thức Bayes để tính xác suất hậu nghiệm $P(H_i \mid T)$:
  $$P(H_1 \mid T) = \frac{P(H_1) P(T \mid H_1)}{P(T)} = \frac{1{,}0 / 18}{5{,}7 / 18} = \frac{1{,}0}{5{,}7} \approx 0{,}1754$$
  $$P(H_2 \mid T) = \frac{P(H_2) P(T \mid H_2)}{P(T)} = \frac{2{,}1 / 18}{5{,}7 / 18} = \frac{2{,}1}{5{,}7} \approx 0{,}3684$$
  $$P(H_3 \mid T) = \frac{P(H_3) P(T \mid H_3)}{P(T)} = \frac{1{,}6 / 18}{5{,}7 / 18} = \frac{1{,}6}{5{,}7} \approx 0{,}2807$$
  $$P(H_4 \mid T) = \frac{P(H_4) P(T \mid H_4)}{P(T)} = \frac{1{,}0 / 18}{5{,}7 / 18} = \frac{1{,}0}{5{,}7} \approx 0{,}1754$$
- So sánh các xác suất: $P(H_2 \mid T) \approx 0{,}3684$ là giá trị lớn nhất.
- **Kết luận:** Xạ thủ này có khả năng thuộc **nhóm 2** nhiều nhất.

---

### Bài 9 (Trang 3)
**Đề bài:** Một xí nghiệp có 2 phân xưởng với các tỷ lệ phế phẩm tương ứng là: 1% và 2%. Biết rằng phân xưởng 1 sản xuất 40%, còn phân xưởng 2 sản xuất 60% sản phẩm.
a. Tính xác suất để từ kho xí nghiệp chọn ngẫu nhiên được một phế phẩm.
b. Giả sử lấy được một phế phẩm, tìm xác suất để nó do phân xưởng 1 sản xuất.

**Lời giải chi tiết:**
- Gọi $A_1, A_2$ lần lượt là biến cố: "Sản phẩm lấy ra do phân xưởng 1, 2 sản xuất".
  Hệ $\{A_1, A_2\}$ là hệ biến cố đầy đủ với:
  $$P(A_1) = 0{,}40; \quad P(A_2) = 0{,}60$$
- Gọi $B$ là biến cố: "Sản phẩm lấy ra là một phế phẩm".
  Theo đề bài:
  $$P(B \mid A_1) = 0{,}01; \quad P(B \mid A_2) = 0{,}02$$

**a. Xác suất chọn ngẫu nhiên được một phế phẩm:**
- Áp dụng công thức xác suất đầy đủ:
  $$P(B) = P(A_1)P(B \mid A_1) + P(A_2)P(B \mid A_2)$$
  $$P(B) = 0{,}40 \times 0{,}01 + 0{,}60 \times 0{,}02 = 0{,}004 + 0{,}012 = 0{,}016$$
- **Kết luận:** Xác suất chọn được một phế phẩm là **$0{,}016$** ($1{,}6\%$).

**b. Lấy được phế phẩm, tìm xác suất nó do phân xưởng 1 sản xuất:**
- Cần tính xác suất hậu nghiệm $P(A_1 \mid B)$.
- Áp dụng công thức Bayes:
  $$P(A_1 \mid B) = \frac{P(A_1) P(B \mid A_1)}{P(B)} = \frac{0{,}40 \times 0{,}01}{0{,}016} = \frac{0{,}004}{0{,}016} = 0{,}25$$
- **Kết luận:** Xác suất phế phẩm đó do phân xưởng 1 sản xuất là **$0{,}25$** ($25\%$).

---

### Bài 10 (Trang 3)
**Đề bài:** Một trạm chỉ phát hai loại tín hiệu A và B với xác suất tương ứng là 0,84 và 0,16. Do có nhiễu trên đường truyền nên 1/6 tín hiệu A bị méo và được thu như là tín hiệu B, còn 1/8 tín hiệu B bị méo thành tín hiệu A.
a. Tìm xác suất thu được tín hiệu A.
b. Giả sử thu được tín hiệu A, tìm xác suất để thu được đúng tín hiệu lúc phát.

**Lời giải chi tiết:**
- Gọi:
  + $A_{phat}$ là biến cố: "Trạm phát đi tín hiệu A" $\Rightarrow P(A_{phat}) = 0{,}84$.
  + $B_{phat}$ là biến cố: "Trạm phát đi tín hiệu B" $\Rightarrow P(B_{phat}) = 0{,}16$.
  Hệ $\{A_{phat}, B_{phat}\}$ là hệ biến cố đầy đủ.
- Gọi $A_{thu}$ là biến cố: "Tại trạm thu nhận được tín hiệu A".
- Xác suất điều kiện tại đầu thu:
  + Nếu phát A, xác suất bị méo thành B là $1/6$, do đó xác suất thu đúng tín hiệu A là:
    $$P(A_{thu} \mid A_{phat}) = 1 - \frac{1}{6} = \frac{5}{6}$$
  + Nếu phát B, xác suất bị méo thành A là:
    $$P(A_{thu} \mid B_{phat}) = \frac{1}{8}$$

**a. Tìm xác suất thu được tín hiệu A:**
- Áp dụng công thức xác suất đầy đủ:
  $$P(A_{thu}) = P(A_{phat}) P(A_{thu} \mid A_{phat}) + P(B_{phat}) P(A_{thu} \mid B_{phat})$$
  $$P(A_{thu}) = 0{,}84 \times \frac{5}{6} + 0{,}16 \times \frac{1}{8} = 0{,}70 + 0{,}02 = 0{,}72$$
- **Kết luận:** Xác suất thu được tín hiệu A là **$0{,}72$**.

**b. Giả sử thu được tín hiệu A, tính xác suất thu đúng tín hiệu lúc phát:**
- Thu đúng tín hiệu lúc phát khi đã thu được tín hiệu A tức là ban đầu đã phát đi tín hiệu A, ký hiệu là $P(A_{phat} \mid A_{thu})$.
- Áp dụng công thức Bayes:
  $$P(A_{phat} \mid A_{thu}) = \frac{P(A_{phat}) P(A_{thu} \mid A_{phat})}{P(A_{thu})} = \frac{0{,}84 \times \frac{5}{6}}{0{,}72} = \frac{0{,}70}{0{,}72} = \frac{35}{36} \approx 0{,}9722$$

---

### Bài 11 (Trang 3)
**Đề bài:** Một chuồng gà có 9 gà mái và 1 gà trống. Chuồng gà kia có 1 con gà mái và 5 gà trống. Từ mỗi chuồng ta bắt ra ngẫu nhiên một con làm thịt. Các con gà còn lại được dồn vào một chuồng thứ 3. Từ chuồng thứ 3 này, lại bắt ngẫu nhiên một con gà. Tính xác suất để ta bắt được gà trống.

**Lời giải chi tiết:**
- Chuồng 1: 10 con (9 mái, 1 trống). Chuồng 2: 6 con (1 mái, 5 trống).
- Bắt 1 con từ mỗi chuồng đem làm thịt. Sau đó dồn các con còn lại vào chuồng 3:
  Số gà trong chuồng 3 là: $(10 - 1) + (6 - 1) = 9 + 5 = 14$ con gà.
- Gọi các giả thiết về việc bắt gà từ 2 chuồng đầu đem làm thịt:
  + $H_1$: Chuồng 1 thịt gà trống, chuồng 2 thịt gà trống:
    $$P(H_1) = \frac{1}{10} \times \frac{5}{6} = \frac{5}{60}$$
    Số gà trống dồn vào chuồng 3 là: $(1 - 1) + (5 - 1) = 4$ con.
  + $H_2$: Chuồng 1 thịt gà trống, chuồng 2 thịt gà mái:
    $$P(H_2) = \frac{1}{10} \times \frac{1}{6} = \frac{1}{60}$$
    Số gà trống dồn vào chuồng 3 là: $(1 - 1) + 5 = 5$ con.
  + $H_3$: Chuồng 1 thịt gà mái, chuồng 2 thịt gà trống:
    $$P(H_3) = \frac{9}{10} \times \frac{5}{6} = \frac{45}{60}$$
    Số gà trống dồn vào chuồng 3 là: $1 + (5 - 1) = 5$ con.
  + $H_4$: Chuồng 1 thịt gà mái, chuồng 2 thịt gà mái:
    $$P(H_4) = \frac{9}{10} \times \frac{1}{6} = \frac{9}{60}$$
    Số gà trống dồn vào chuồng 3 là: $1 + 5 = 6$ con.
- Nhận xét: Hệ $\{H_1, H_2, H_3, H_4\}$ là hệ đầy đủ vì $\sum P(H_i) = \frac{5+1+45+9}{60} = 1$.
- Gọi $A$ là biến cố: "Bắt được một con gà trống từ chuồng thứ 3".
  Xác suất có điều kiện:
  $$P(A \mid H_1) = \frac{4}{14}; \quad P(A \mid H_2) = \frac{5}{14}; \quad P(A \mid H_3) = \frac{5}{14}; \quad P(A \mid H_4) = \frac{6}{14}$$
- Áp dụng công thức xác suất đầy đủ:
  $$P(A) = \sum_{i=1}^4 P(H_i) P(A \mid H_i)$$
  $$P(A) = \frac{5}{60} \times \frac{4}{14} + \frac{1}{60} \times \frac{5}{14} + \frac{45}{60} \times \frac{5}{14} + \frac{9}{60} \times \frac{6}{14}$$
  $$P(A) = \frac{20 + 5 + 225 + 54}{60 \times 14} = \frac{304}{840} = \frac{38}{105} \approx 0{,}3619$$

---

### Bài 13 (Trang 4)
**Đề bài:** Trong số bệnh nhân ở một bệnh viện có 50% điều trị bệnh A, 30% điều trị bệnh B và 20% điều trị bệnh C. Xác suất để chữa khỏi các bệnh A, B, C trong bệnh viện này tương ứng là 0,7; 0,8; và 0,9. Hãy tính tỷ lệ bệnh nhân được chữa khỏi bệnh A trong tổng số bệnh nhân đã được chữa khỏi bệnh.

**Lời giải chi tiết:**
- Gọi $H_1, H_2, H_3$ lần lượt là biến cố: "Bệnh nhân điều trị bệnh A, B, C".
  Hệ $\{H_1, H_2, H_3\}$ là một hệ biến cố đầy đủ với xác suất:
  $$P(H_1) = 0{,}50; \quad P(H_2) = 0{,}30; \quad P(H_3) = 0{,}20$$
- Gọi $K$ là biến cố: "Bệnh nhân được chữa khỏi bệnh".
  Xác suất chữa khỏi theo từng bệnh:
  $$P(K \mid H_1) = 0{,}70; \quad P(K \mid H_2) = 0{,}80; \quad P(K \mid H_3) = 0{,}90$$
- Xác suất đầy đủ để một bệnh nhân ngẫu nhiên được chữa khỏi bệnh là:
  $$P(K) = P(H_1)P(K \mid H_1) + P(H_2)P(K \mid H_2) + P(H_3)P(K \mid H_3)$$
  $$P(K) = 0{,}50 \times 0{,}70 + 0{,}30 \times 0{,}80 + 0{,}20 \times 0{,}90 = 0{,}35 + 0{,}24 + 0{,}18 = 0{,}77$$
- Tỷ lệ bệnh nhân được chữa khỏi bệnh A trong tổng số bệnh nhân đã được chữa khỏi bệnh chính là xác suất có điều kiện $P(H_1 \mid K)$.
- Áp dụng công thức Bayes:
  $$P(H_1 \mid K) = \frac{P(H_1) P(K \mid H_1)}{P(K)} = \frac{0{,}50 \times 0{,}70}{0{,}77} = \frac{0{,}35}{0{,}77} = \frac{35}{77} = \frac{5}{11} \approx 0{,}4545$$
- **Kết luận:** Tỷ lệ cần tìm là **$\frac{5}{11}$** hay khoảng **$45{,}45\%$**.

---
\pagebreak

## CHƯƠNG 5: ĐẠI LƯỢNG NGẪU NHIÊN RỜI RẠC

### Bài 1 (Trang 4)
**Đề bài:** Một nhóm có 10 người gồm 6 nam và 4 nữ. Chọn ngẫu nhiên ra 3 người. Gọi X là số nữ trong nhóm. Lập bảng phân bố xác suất của X và tính EX, DX.

**Lời giải chi tiết:**
- Số cách chọn ngẫu nhiên 3 người từ 10 người là:
  $$|\Omega| = C_{10}^3 = \frac{10 \times 9 \times 8}{3 \times 2 \times 1} = 120$$
- Vì trong nhóm có 4 nữ và chọn 3 người nên số nữ $X$ có thể nhận các giá trị:
  $$X \in \{0, 1, 2, 3\}$$
- Xác suất tại từng giá trị của $X$:
  $$P(X = 0) = \frac{C_4^0 C_6^3}{C_{10}^3} = \frac{1 \times 20}{120} = \frac{20}{120} = \frac{1}{6}$$
  $$P(X = 1) = \frac{C_4^1 C_6^2}{C_{10}^3} = \frac{4 \times 15}{120} = \frac{60}{120} = \frac{1}{2}$$
  $$P(X = 2) = \frac{C_4^2 C_6^1}{C_{10}^3} = \frac{6 \times 6}{120} = \frac{36}{120} = \frac{3}{10}$$
  $$P(X = 3) = \frac{C_4^3 C_6^0}{C_{10}^3} = \frac{4 \times 1}{120} = \frac{4}{120} = \frac{1}{30}$$
- **Bảng phân bố xác suất của X:**

| $X$ | 0 | 1 | 2 | 3 |
|:---:|:---:|:---:|:---:|:---:|
| $P$ | $\frac{1}{6}$ | $\frac{1}{2}$ | $\frac{3}{10}$ | $\frac{1}{30}$ |

*(Kiểm tra: $\frac{1}{6} + \frac{1}{2} + \frac{3}{10} + \frac{1}{30} = \frac{5 + 15 + 9 + 1}{30} = 1$)*

- **Tính kỳ vọng toán $EX$:**
  $$EX = \sum x_i P(X = x_i) = 0 \times \frac{1}{6} + 1 \times \frac{1}{2} + 2 \times \frac{3}{10} + 3 \times \frac{1}{30} = 0 + 0{,}5 + 0{,}6 + 0{,}1 = 1{,}2$$
- **Tính phương sai $DX$:**
  $$E(X^2) = \sum x_i^2 P(X = x_i) = 0^2 \times \frac{1}{6} + 1^2 \times \frac{1}{2} + 2^2 \times \frac{3}{10} + 3^2 \times \frac{1}{30} = 0 + 0{,}5 + 1{,}2 + 0{,}3 = 2{,}0$$
  $$DX = E(X^2) - (EX)^2 = 2{,}0 - (1{,}2)^2 = 2{,}0 - 1{,}44 = 0{,}56$$

---

### Bài 2 (Trang 4)
**Đề bài:** Có 1 lô hàng, gồm 6 sản phẩm, trong đó số sản phẩm loại A là 3. Lấy ngẫu nhiên ra 3 sản phẩm từ lô hàng để bán. Gọi X là số sản phẩm loại A có trong 3 sản phẩm lấy ra.
a. Lập bảng phân phối xác suất của X.
b. Tính kỳ vọng và phương sai của X.

**Lời giải chi tiết:**
- Số cách chọn 3 sản phẩm từ 6 sản phẩm là:
  $$|\Omega| = C_6^3 = 20$$
- Lô hàng có 3 sản phẩm loại A và 3 sản phẩm không phải loại A. Số sản phẩm loại A lấy ra $X$ nhận các giá trị:
  $$X \in \{0, 1, 2, 3\}$$

**a. Lập bảng phân phối xác suất của X:**
- Xác suất tại các giá trị của $X$:
  $$P(X = 0) = \frac{C_3^0 C_3^3}{C_6^3} = \frac{1 \times 1}{20} = \frac{1}{20} = 0{,}05$$
  $$P(X = 1) = \frac{C_3^1 C_3^2}{C_6^3} = \frac{3 \times 3}{20} = \frac{9}{20} = 0{,}45$$
  $$P(X = 2) = \frac{C_3^2 C_3^1}{C_6^3} = \frac{3 \times 3}{20} = \frac{9}{20} = 0{,}45$$
  $$P(X = 3) = \frac{C_3^3 C_3^0}{C_6^3} = \frac{1 \times 1}{20} = \frac{1}{20} = 0{,}05$$
- Bảng phân phối xác suất:

| $X$ | 0 | 1 | 2 | 3 |
|:---:|:---:|:---:|:---:|:---:|
| $P$ | $\frac{1}{20}$ ($0{,}05$) | $\frac{9}{20}$ ($0{,}45$) | $\frac{9}{20}$ ($0{,}45$) | $\frac{1}{20}$ ($0{,}05$) |

**b. Tính kỳ vọng và phương sai của X:**
- Kỳ vọng toán:
  $$EX = 0 \times 0{,}05 + 1 \times 0{,}45 + 2 \times 0{,}45 + 3 \times 0{,}05 = 0 + 0{,}45 + 0{,}90 + 0{,}15 = 1{,}5$$
- Kỳ vọng bậc 2:
  $$E(X^2) = 0^2 \times 0{,}05 + 1^2 \times 0{,}45 + 2^2 \times 0{,}45 + 3^2 \times 0{,}05 = 0{,}45 + 1{,}80 + 0{,}45 = 2{,}70$$
- Phương sai:
  $$DX = E(X^2) - (EX)^2 = 2{,}70 - (1{,}5)^2 = 2{,}70 - 2{,}25 = 0{,}45$$

---

### Bài 4 (Trang 4)
**Đề bài:** Một túi chứa 10 tấm thẻ đỏ và 6 tấm thẻ xanh. Chọn ngẫu nhiên ra ba tấm thẻ.
a. Gọi X là số thẻ đỏ. Tìm phân bố xác suất của X.
b. Giả sử rút mỗi tấm thẻ đỏ được 5 điểm và rút mỗi tấm thẻ xanh được 8 điểm. Gọi Y là số điểm tổng cộng trên ba thẻ rút ra. Tìm phân bố xác suất của Y.

**Lời giải chi tiết:**
- Tổng số thẻ là $10 + 6 = 16$ thẻ. Số cách chọn ngẫu nhiên 3 thẻ:
  $$|\Omega| = C_{16}^3 = \frac{16 \times 15 \times 14}{3 \times 2 \times 1} = 560$$

**a. Tìm phân bố xác suất của X:**
- Số thẻ đỏ $X \in \{0, 1, 2, 3\}$.
- Xác suất tương ứng:
  $$P(X = 0) = \frac{C_{10}^0 C_6^3}{C_{16}^3} = \frac{1 \times 20}{560} = \frac{20}{560} = \frac{1}{28}$$
  $$P(X = 1) = \frac{C_{10}^1 C_6^2}{C_{16}^3} = \frac{10 \times 15}{560} = \frac{150}{560} = \frac{15}{56}$$
  $$P(X = 2) = \frac{C_{10}^2 C_6^1}{C_{16}^3} = \frac{45 \times 6}{560} = \frac{270}{560} = \frac{27}{56}$$
  $$P(X = 3) = \frac{C_{10}^3 C_6^0}{C_{16}^3} = \frac{120 \times 1}{560} = \frac{120}{560} = \frac{3}{14}$$
- Bảng phân bố xác suất của $X$:

| $X$ | 0 | 1 | 2 | 3 |
|:---:|:---:|:---:|:---:|:---:|
| $P$ | $\frac{1}{28}$ | $\frac{15}{56}$ | $\frac{27}{56}$ | $\frac{3}{14}$ |

**b. Tìm phân bố xác suất của Y:**
- Với mỗi thẻ đỏ được 5 điểm, mỗi thẻ xanh được 8 điểm. Khi chọn được $X$ thẻ đỏ thì số thẻ xanh là $3 - X$.
- Tổng số điểm $Y$ biểu diễn theo $X$:
  $$Y = 5X + 8(3 - X) = 24 - 3X$$
- Các giá trị tương ứng của $Y$:
  + Khi $X = 0 \Rightarrow Y = 24 - 0 = 24$ điểm với xác suất $P(Y = 24) = P(X = 0) = \frac{1}{28}$.
  + Khi $X = 1 \Rightarrow Y = 24 - 3 = 21$ điểm với xác suất $P(Y = 21) = P(X = 1) = \frac{15}{56}$.
  + Khi $X = 2 \Rightarrow Y = 24 - 6 = 18$ điểm với xác suất $P(Y = 18) = P(X = 2) = \frac{27}{56}$.
  + Khi $X = 3 \Rightarrow Y = 24 - 9 = 15$ điểm với xác suất $P(Y = 15) = P(X = 3) = \frac{3}{14}$.
- Bảng phân bố xác suất của $Y$ (sắp xếp tăng dần):

| $Y$ | 15 | 18 | 21 | 24 |
|:---:|:---:|:---:|:---:|:---:|
| $P$ | $\frac{3}{14}$ | $\frac{27}{56}$ | $\frac{15}{56}$ | $\frac{1}{28}$ |

---

### Bài 5 (Trang 4)
**Đề bài:** Trong một chiếc hộp có 4 tấm thẻ được đánh số từ 1 đến 4. Chọn ngẫu nhiên 2 tấm thẻ rồi cộng 2 số ghi trên 2 tấm thẻ lại với nhau. Gọi X là kết quả thu được.
a. Lập bảng phân bố xác suất của X.
b. Tính kỳ vọng và phương sai của biến ngẫu nhiên X.

**Lời giải chi tiết:**
- Số cách chọn 2 thẻ từ 4 thẻ $\{1, 2, 3, 4\}$ là:
  $$|\Omega| = C_4^2 = 6$$
- Các cặp thẻ và tổng tương ứng:
  + Cặp $(1, 2) \Rightarrow X = 3$
  + Cặp $(1, 3) \Rightarrow X = 4$
  + Cặp $(1, 4) \Rightarrow X = 5$
  + Cặp $(2, 3) \Rightarrow X = 5$
  + Cặp $(2, 4) \Rightarrow X = 6$
  + Cặp $(3, 4) \Rightarrow X = 7$
- Như vậy $X$ nhận các giá trị trong tập $\{3, 4, 5, 6, 7\}$.

**a. Bảng phân bố xác suất của X:**
- Xác suất của từng giá trị:
  + $P(X = 3) = \frac{1}{6}$
  + $P(X = 4) = \frac{1}{6}$
  + $P(X = 5) = \frac{2}{6} = \frac{1}{3}$
  + $P(X = 6) = \frac{1}{6}$
  + $P(X = 7) = \frac{1}{6}$

| $X$ | 3 | 4 | 5 | 6 | 7 |
|:---:|:---:|:---:|:---:|:---:|:---:|
| $P$ | $\frac{1}{6}$ | $\frac{1}{6}$ | $\frac{1}{3}$ | $\frac{1}{6}$ | $\frac{1}{6}$ |

**b. Tính kỳ vọng và phương sai của X:**
- Kỳ vọng $EX$:
  $$EX = 3 \times \frac{1}{6} + 4 \times \frac{1}{6} + 5 \times \frac{2}{6} + 6 \times \frac{1}{6} + 7 \times \frac{1}{6} = \frac{3 + 4 + 10 + 6 + 7}{6} = \frac{30}{6} = 5$$
- Kỳ vọng bậc 2:
  $$E(X^2) = 3^2 \times \frac{1}{6} + 4^2 \times \frac{1}{6} + 5^2 \times \frac{2}{6} + 6^2 \times \frac{1}{6} + 7^2 \times \frac{1}{6} = \frac{9 + 16 + 50 + 36 + 49}{6} = \frac{160}{6} = \frac{80}{3}$$
- Phương sai $DX$:
  $$DX = E(X^2) - (EX)^2 = \frac{80}{3} - 5^2 = \frac{80}{3} - 25 = \frac{5}{3} \approx 1{,}6667$$

---

### Bài 6 (Trang 4)
**Đề bài:** Gieo đồng thời hai con xúc sắc cân đối đồng chất. Gọi X là tổng số nốt xuất hiện trên hai mặt con xúc sắc. Lập bảng quy luật phân bố xác suất của X. Tính EX và DX.

**Lời giải chi tiết:**
- Không gian mẫu có $|\Omega| = 6 \times 6 = 36$ phần tử.
- Tổng số nốt $X$ nhận các giá trị nguyên từ $1 + 1 = 2$ đến $6 + 6 = 12$:
  $$X \in \{2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12\}$$
- Số trường hợp thuận lợi cho $X = k$ là $6 - |k - 7|$:
  + $P(X = 2) = P(X = 12) = \frac{1}{36}$
  + $P(X = 3) = P(X = 11) = \frac{2}{36}$
  + $P(X = 4) = P(X = 10) = \frac{3}{36}$
  + $P(X = 5) = P(X = 9) = \frac{4}{36}$
  + $P(X = 6) = P(X = 8) = \frac{5}{36}$
  + $P(X = 7) = \frac{6}{36}$
- **Bảng phân bố xác suất:**

| $X$ | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| $P$ | $\frac{1}{36}$ | $\frac{2}{36}$ | $\frac{3}{36}$ | $\frac{4}{36}$ | $\frac{5}{36}$ | $\frac{6}{36}$ | $\frac{5}{36}$ | $\frac{4}{36}$ | $\frac{3}{36}$ | $\frac{2}{36}$ | $\frac{1}{36}$ |

- **Tính $EX$ và $DX$:**
  + Do phân bố đối xứng qua tâm $X = 7$ nên:
    $$EX = 7$$
  + Tính $E(X^2)$:
    $$E(X^2) = \frac{1}{36} [2^2(1) + 3^2(2) + 4^2(3) + 5^2(4) + 6^2(5) + 7^2(6) + 8^2(5) + 9^2(4) + 10^2(3) + 11^2(2) + 12^2(1)]$$
    $$E(X^2) = \frac{4 + 18 + 48 + 100 + 180 + 294 + 320 + 324 + 300 + 242 + 144}{36} = \frac{1974}{36} = \frac{329}{6}$$
  + Phương sai:
    $$DX = E(X^2) - (EX)^2 = \frac{329}{6} - 7^2 = \frac{329}{6} - 49 = \frac{35}{6} \approx 5{,}8333$$
  *(Hoặc tách $X = X_1 + X_2$ với $X_1, X_2$ độc lập: $EX = EX_1 + EX_2 = 3{,}5 + 3{,}5 = 7$; $DX = DX_1 + DX_2 = \frac{35}{12} + \frac{35}{12} = \frac{35}{6}$)*.

---

### Bài 7 (Trang 4)
**Đề bài:** Trong một chiếc hòm có 5 bóng đèn, trong đó có 2 bóng đèn tốt, 3 bóng hỏng. Ta chọn ngẫu nhiên từng bóng đem thử (thử xong không trả lại) cho đến khi thu được hai bóng tốt. Gọi X là số lần thử cần thiết. Tìm phân bố xác suất của X. Trung bình cần thử bao nhiêu lần?

**Lời giải chi tiết:**
- Hòm có 2 bóng tốt ($T$) và 3 bóng hỏng ($H$). Thử không hoàn lại đến khi được 2 bóng tốt.
- Để thu được 2 bóng tốt:
  + Cần ít nhất 2 lần thử (cả 2 lần đều tốt).
  + Nhiều nhất là 5 lần thử (vì có 3 bóng hỏng, nếu cả 3 lần đầu đều hỏng thì 2 lần sau chắc chắn tốt).
  Do đó tập giá trị của $X$ là:
  $$X \in \{2, 3, 4, 5\}$$
- Xác định xác suất tại từng giá trị (chú ý: lần thử cuối cùng luôn phải là bóng tốt):
  + $X = 2$: Cả 2 lần đều tốt ($T_1 T_2$):
    $$P(X = 2) = \frac{2}{5} \times \frac{1}{4} = \frac{2}{20} = 0{,}1$$
  + $X = 3$: Trong 2 lần đầu có đúng 1 bóng tốt và 1 bóng hỏng, lần 3 là bóng tốt:
    $$P(X = 3) = \left(2 \times \frac{2}{5} \times \frac{3}{4}\right) \times \frac{1}{3} = \frac{12}{20} \times \frac{1}{3} = \frac{4}{20} = 0{,}2$$
  + $X = 4$: Trong 3 lần đầu có đúng 1 bóng tốt và 2 bóng hỏng, lần 4 là bóng tốt:
    $$P(X = 4) = \frac{C_3^1 \times C_2^1 \times C_3^2}{A_5^3} \times \frac{1}{2} = \frac{3 \times 2 \times 3 \times 2}{60} \times \frac{1}{2} = \frac{36}{60} \times \frac{1}{2} = \frac{18}{60} = 0{,}3$$
  + $X = 5$: Trong 4 lần đầu có đúng 1 bóng tốt và 3 bóng hỏng, lần 5 là bóng tốt:
    $$P(X = 5) = \frac{C_4^1 \times 2 \times 3!}{A_5^4} \times 1 = \frac{4 \times 2 \times 6}{120} = \frac{48}{120} = 0{,}4$$
  *(Kiểm tra: $0{,}1 + 0{,}2 + 0{,}3 + 0{,}4 = 1{,}0$)*.
- **Bảng phân bố xác suất của X:**

| $X$ | 2 | 3 | 4 | 5 |
|:---:|:---:|:---:|:---:|:---:|
| $P$ | $0{,}1$ | $0{,}2$ | $0{,}3$ | $0{,}4$ |

- **Số lần thử trung bình cần thiết ($EX$):**
  $$EX = 2 \times 0{,}1 + 3 \times 0{,}2 + 4 \times 0{,}3 + 5 \times 0{,}4 = 0{,}2 + 0{,}6 + 1{,}2 + 2{,}0 = 4{,}0 \text{ (lần)}$$
- **Kết luận:** Trung bình cần thử **4 lần**.

---

### Bài 8 (Trang 4)
**Đề bài:** Một lô hàng gồm 7 sản phẩm trong đó có 3 phế phẩm. Chọn ngẫu nhiên ra 4 sản phẩm để kiểm tra. Gọi X là số sản phẩm tốt trong 4 sản phẩm lấy ra. Tìm phân bố xác suất của X và tính EX.

**Lời giải chi tiết:**
- Lô hàng gồm 7 sản phẩm: 4 sản phẩm tốt và 3 phế phẩm.
- Chọn ngẫu nhiên 4 sản phẩm:
  $$|\Omega| = C_7^4 = 35$$
- Gọi $X$ là số sản phẩm tốt trong 4 sản phẩm lấy ra.
  Vì chỉ có 3 phế phẩm nên trong 4 sản phẩm chọn ra ít nhất phải có $4 - 3 = 1$ sản phẩm tốt, và tối đa là 4 sản phẩm tốt.
  Do đó:
  $$X \in \{1, 2, 3, 4\}$$
- Xác suất của các giá trị:
  $$P(X = 1) = \frac{C_4^1 C_3^3}{C_7^4} = \frac{4 \times 1}{35} = \frac{4}{35}$$
  $$P(X = 2) = \frac{C_4^2 C_3^2}{C_7^4} = \frac{6 \times 3}{35} = \frac{18}{35}$$
  $$P(X = 3) = \frac{C_4^3 C_3^1}{C_7^4} = \frac{4 \times 3}{35} = \frac{12}{35}$$
  $$P(X = 4) = \frac{C_4^4 C_3^0}{C_7^4} = \frac{1 \times 1}{35} = \frac{1}{35}$$
- **Bảng phân bố xác suất của X:**

| $X$ | 1 | 2 | 3 | 4 |
|:---:|:---:|:---:|:---:|:---:|
| $P$ | $\frac{4}{35}$ | $\frac{18}{35}$ | $\frac{12}{35}$ | $\frac{1}{35}$ |

- **Tính kỳ vọng $EX$:**
  $$EX = 1 \times \frac{4}{35} + 2 \times \frac{18}{35} + 3 \times \frac{12}{35} + 4 \times \frac{1}{35} = \frac{4 + 36 + 36 + 4}{35} = \frac{80}{35} = \frac{16}{7} \approx 2{,}2857$$
  *(Hoặc dùng tính chất phân phối siêu bội: $EX = n \times \frac{M}{N} = 4 \times \frac{4}{7} = \frac{16}{7}$)*.

---

### Bài 9 (Trang 4)
**Đề bài:** Trong một chiếc hòm có 10 tấm thẻ trong đó bốn thẻ ghi số 1; ba thẻ ghi số 2, hai thẻ ghi số 3 và một thẻ ghi số 4. Chọn ngẫu nhiên hai tấm thẻ và gọi X là tổng số thu được. Tìm phân bố xác suất của X.

**Lời giải chi tiết:**
- Số cách chọn ngẫu nhiên 2 thẻ từ 10 thẻ là:
  $$|\Omega| = C_{10}^2 = 45$$
- Các thẻ gồm: bốn thẻ số 1, ba thẻ số 2, hai thẻ số 3, một thẻ số 4.
- Tổng số ghi trên 2 thẻ $X$ có thể nhận các giá trị:
  $$X \in \{2, 3, 4, 5, 6, 7\}$$
- Xác định số cách chọn và xác suất cho từng giá trị của $X$:
  + $X = 2$: Hai thẻ đều ghi số 1:
    $$C_4^2 = 6 \Longrightarrow P(X = 2) = \frac{6}{45} = \frac{2}{15}$$
  + $X = 3$: Một thẻ số 1 và một thẻ số 2:
    $$C_4^1 \times C_3^1 = 4 \times 3 = 12 \Longrightarrow P(X = 3) = \frac{12}{45} = \frac{4}{15}$$
  + $X = 4$: (Một thẻ số 1 và một thẻ số 3) HOẶC (Hai thẻ đều ghi số 2):
    $$C_4^1 \times C_2^1 + C_3^2 = 4 \times 2 + 3 = 11 \Longrightarrow P(X = 4) = \frac{11}{45}$$
  + $X = 5$: (Một thẻ số 1 và một thẻ số 4) HOẶC (Một thẻ số 2 và một thẻ số 3):
    $$C_4^1 \times C_1^1 + C_3^1 \times C_2^1 = 4 \times 1 + 3 \times 2 = 10 \Longrightarrow P(X = 5) = \frac{10}{45} = \frac{2}{9}$$
  + $X = 6$: (Một thẻ số 2 và một thẻ số 4) HOẶC (Hai thẻ đều ghi số 3):
    $$C_3^1 \times C_1^1 + C_2^2 = 3 \times 1 + 1 = 4 \Longrightarrow P(X = 6) = \frac{4}{45}$$
  + $X = 7$: Một thẻ số 3 và một thẻ số 4:
    $$C_2^1 \times C_1^1 = 2 \times 1 = 2 \Longrightarrow P(X = 7) = \frac{2}{45}$$
  *(Kiểm tra tổng số cách: $6 + 12 + 11 + 10 + 4 + 2 = 45$)*.
- **Bảng phân bố xác suất của X:**

| $X$ | 2 | 3 | 4 | 5 | 6 | 7 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| $P$ | $\frac{6}{45} = \frac{2}{15}$ | $\frac{12}{45} = \frac{4}{15}$ | $\frac{11}{45}$ | $\frac{10}{45} = \frac{2}{9}$ | $\frac{4}{45}$ | $\frac{2}{45}$ |

---

### Bài 10 (Trang 4)
**Đề bài:** Một người có một chùm chìa khóa 7 chiếc giống nhau trong đó chỉ có hai chiếc mở được cửa. Người đó thử ngẫu nhiên từng chiếc (thử xong bỏ ra ngoài) cho đến khi tìm được chìa mở được cửa. Gọi X là số lần thử cần thiết. Hãy tìm phân bố xác suất của X và EX.

**Lời giải chi tiết:**
- Chùm có 7 chìa gồm 2 chìa mở được ($M$) và 5 chìa không mở được ($K$).
- Thử từng chiếc không hoàn lại cho đến khi tìm được chiếc đầu tiên mở được cửa thì dừng lại.
- Số lần thử $X$ có thể nhận các giá trị:
  $$X \in \{1, 2, 3, 4, 5, 6\}$$
  *(Tối đa là 6 lần vì nếu 5 lần đầu đều trúng 5 chìa không mở được thì lần thứ 6 chắc chắn là chìa mở được)*.
- Xác suất tại từng giá trị của $X$:
  + $X = 1$: Lần đầu mở được ngay:
    $$P(X = 1) = \frac{2}{7} = \frac{6}{21}$$
  + $X = 2$: Lần 1 không được, lần 2 mở được:
    $$P(X = 2) = \frac{5}{7} \times \frac{2}{6} = \frac{10}{42} = \frac{5}{21}$$
  + $X = 3$: Hai lần đầu không được, lần 3 mở được:
    $$P(X = 3) = \frac{5}{7} \times \frac{4}{6} \times \frac{2}{5} = \frac{4}{21}$$
  + $X = 4$: Ba lần đầu không được, lần 4 mở được:
    $$P(X = 4) = \frac{5}{7} \times \frac{4}{6} \times \frac{3}{5} \times \frac{2}{4} = \frac{3}{21}$$
  + $X = 5$: Bốn lần đầu không được, lần 5 mở được:
    $$P(X = 5) = \frac{5}{7} \times \frac{4}{6} \times \frac{3}{5} \times \frac{2}{4} \times \frac{2}{3} = \frac{2}{21}$$
  + $X = 6$: Năm lần đầu không được, lần 6 mở được:
    $$P(X = 6) = \frac{5}{7} \times \frac{4}{6} \times \frac{3}{5} \times \frac{2}{4} \times \frac{1}{3} \times \frac{2}{2} = \frac{1}{21}$$
  *(Quy luật tổng quát: $P(X = k) = \frac{7 - k}{21}$ với $k = 1, \dots, 6$)*.
- **Bảng phân bố xác suất của X:**

| $X$ | 1 | 2 | 3 | 4 | 5 | 6 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| $P$ | $\frac{6}{21}$ | $\frac{5}{21}$ | $\frac{4}{21}$ | $\frac{3}{21}$ | $\frac{2}{21}$ | $\frac{1}{21}$ |

- **Tính kỳ vọng $EX$:**
  $$EX = \sum_{k=1}^6 k \times \frac{7 - k}{21} = \frac{1(6) + 2(5) + 3(4) + 4(3) + 5(2) + 6(1)}{21} = \frac{6 + 10 + 12 + 12 + 10 + 6}{21} = \frac{56}{21} = \frac{8}{3} \approx 2{,}6667 \text{ (lần)}$$

---

### Bài 11 (Trang 5)
**Đề bài:** Một túi chứa 4 quả cầu trắng và 3 quả cầu đen. hai người chơi A và B lần lượt rút một quả cầu trong túi (rút xong không trả lại vào túi). Trò chơi kết thúc khi có người rút được quả cầu đen. Người đó xem như là thua cuộc và phải trả cho người kia số tiền là số quả cầu đã rút nhân với 5 USD. Giả sử A là người rút trước và X là số tiền A thu được. Lập bảng phân bố xác suất của X. Tính EX. Nếu chơi 150 ván thì trung bình A được bao nhiêu?

**Lời giải chi tiết:**
- Túi có 4 quả cầu trắng ($T$) và 3 quả cầu đen ($Đ$). Rút không hoàn lại.
- Trò chơi dừng lại khi xuất hiện quả cầu đen lần đầu tiên.
  Vì chỉ có 4 quả trắng nên quả cầu đen chắc chắn sẽ xuất hiện ở lượt thứ 1, 2, 3, 4 hoặc 5.
- A rút các lượt lẻ (lượt 1, 3, 5). B rút các lượt chẵn (lượt 2, 4).
  + Nếu A rút phải quả đen ở lượt thứ $k$ ($k$ lẻ): A thua cuộc, A phải trả cho B số tiền $5k$ USD $\Rightarrow$ số tiền A thu được là số âm: $X = -5k$.
  + Nếu B rút phải quả đen ở lượt thứ $k$ ($k$ chẵn): B thua cuộc, B phải trả cho A số tiền $5k$ USD $\Rightarrow$ số tiền A thu được là: $X = +5k$.
- Xét từng trường hợp dừng:
  1. **Dừng ở lần 1 (A rút được quả đen):** $X = -5 \times 1 = -5$ USD.
     $$P(X = -5) = \frac{3}{7} = \frac{15}{35}$$
  2. **Dừng ở lần 2 (A rút T, B rút Đ):** $X = +5 \times 2 = +10$ USD.
     $$P(X = +10) = \frac{4}{7} \times \frac{3}{6} = \frac{2}{7} = \frac{10}{35}$$
  3. **Dừng ở lần 3 (A rút T, B rút T, A rút Đ):** $X = -5 \times 3 = -15$ USD.
     $$P(X = -15) = \frac{4}{7} \times \frac{3}{6} \times \frac{3}{5} = \frac{6}{35}$$
  4. **Dừng ở lần 4 (T, T, T, B rút Đ):** $X = +5 \times 4 = +20$ USD.
     $$P(X = +20) = \frac{4}{7} \times \frac{3}{6} \times \frac{2}{5} \times \frac{3}{4} = \frac{3}{35}$$
  5. **Dừng ở lần 5 (T, T, T, T, A bắt buộc rút Đ):** $X = -5 \times 5 = -25$ USD.
     $$P(X = -25) = \frac{4}{7} \times \frac{3}{6} \times \frac{2}{5} \times \frac{1}{4} \times 1 = \frac{1}{35}$$
  *(Kiểm tra: $\frac{15 + 10 + 6 + 3 + 1}{35} = \frac{35}{35} = 1$)*.
- **Bảng phân bố xác suất của X:**

| $X$ (USD) | -25 | -15 | -5 | +10 | +20 |
|:---:|:---:|:---:|:---:|:---:|:---:|
| $P$ | $\frac{1}{35}$ | $\frac{6}{35}$ | $\frac{15}{35}$ | $\frac{10}{35}$ | $\frac{3}{35}$ |

- **Tính kỳ vọng $EX$:**
  $$EX = (-25) \times \frac{1}{35} + (-15) \times \frac{6}{35} + (-5) \times \frac{15}{35} + 10 \times \frac{10}{35} + 20 \times \frac{3}{35}$$
  $$EX = \frac{-25 - 90 - 75 + 100 + 60}{35} = \frac{-30}{35} = -\frac{6}{7} \approx -0{,}857 \text{ USD}$$
- **Nếu chơi 150 ván:**
  Số tiền trung bình A thu được là:
  $$150 \times EX = 150 \times \left(-\frac{6}{7}\right) = -\frac{900}{7} \approx -128{,}57 \text{ USD}$$
  *(Nghĩa là trung bình A bị thua lỗ khoảng 128,57 USD)*.

---

### Bài 12 (Trang 5)
**Đề bài:** Số máy tính có khả năng bán được trong một tuần tại một cửa hàng là một biến ngẫu nhiên X có bảng phân phối như sau:
| X | 0 | 1 | 2 | 3 | 4 | 5 |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| P | 0,05 | 0,15 | 0,20 | 0,30 | 0,20 | 0,10 |

a. Tính xác suất để trong một tuần cửa hàng đó bán được ít nhất 4 chiếc máy tính.
b. Khi bán được một chiếc máy tính thì cửa hàng đó lãi 800 nghìn đồng, chi phí của cửa hàng mỗi tuần là 500 nghìn đồng. Tính tiền lãi trung bình của cửa hàng trong tuần.

**Lời giải chi tiết:**
**a. Xác suất bán được ít nhất 4 chiếc máy tính:**
- Biến cố "bán được ít nhất 4 chiếc" tương ứng với $X \ge 4$, tức là $X \in \{4, 5\}$.
- Xác suất cần tìm:
  $$P(X \ge 4) = P(X = 4) + P(X = 5) = 0{,}20 + 0{,}10 = 0{,}30$$

**b. Tính tiền lãi trung bình của cửa hàng trong tuần:**
- Gọi $L$ là số tiền lãi của cửa hàng trong 1 tuần (đơn vị: nghìn đồng).
- Theo đề bài, bán mỗi máy lãi 800 nghìn đồng và chi phí cố định mỗi tuần là 500 nghìn đồng, do đó:
  $$L = 800X - 500$$
- Trước hết, tính số máy tính bán được trung bình trong tuần ($EX$):
  $$EX = 0 \times 0{,}05 + 1 \times 0{,}15 + 2 \times 0{,}20 + 3 \times 0{,}30 + 4 \times 0{,}20 + 5 \times 0{,}10$$
  $$EX = 0 + 0{,}15 + 0{,}40 + 0{,}90 + 0{,}80 + 0{,}50 = 2{,}75 \text{ (chiếc)}$$
- Áp dụng tính chất tuyến tính của kỳ vọng toán:
  $$E(L) = E(800X - 500) = 800 \cdot EX - 500 = 800 \times 2{,}75 - 500 = 2200 - 500 = 1700 \text{ (nghìn đồng)}$$
- **Kết luận:** Tiền lãi trung bình của cửa hàng trong một tuần là **$1\,700$ nghìn đồng** (tức 1.700.000 đồng).

---

### Bài 13 (Trang 5)
**Đề bài:** Cho 2 biến ngẫu nhiên X, Y độc lập với nhau và có bảng phân phối xác suất tương ứng là:
| X | -1 | 0 | 1 |
|:---:|:---:|:---:|:---:|
| P | 0,2 | 0,5 | 0,3 |

| Y | 1 | 2 |
|:---:|:---:|:---:|
| P | 0,4 | 0,6 |

a. Hãy tính kỳ vọng của biến ngẫu nhiên X và Y.
b. Lập bảng phân phối xác suất của biến ngẫu nhiên $Z = X + Y$, tính kỳ vọng của biến ngẫu nhiên Z.

**Lời giải chi tiết:**
**a. Tính kỳ vọng của X và Y:**
- Kỳ vọng của $X$:
  $$EX = (-1) \times 0{,}2 + 0 \times 0{,}5 + 1 \times 0{,}3 = -0{,}2 + 0 + 0{,}3 = 0{,}1$$
- Kỳ vọng của $Y$:
  $$EY = 1 \times 0{,}4 + 2 \times 0{,}6 = 0{,}4 + 1{,}2 = 1{,}6$$

**b. Lập bảng phân phối xác suất của $Z = X + Y$ và tính $EZ$:**
- Vì $X, Y$ độc lập nên xác suất đồng thời: $P(X = x_i, Y = y_j) = P(X = x_i) \cdot P(Y = y_j)$.
- Các giá trị của $Z = X + Y$:
  + $X = -1, Y = 1 \Rightarrow Z = 0$: $P(Z = 0) = 0{,}2 \times 0{,}4 = 0{,}08$.
  + $Z = 1$ xảy ra khi $(-1, 2)$ hoặc $(0, 1)$:
    $$P(Z = 1) = 0{,}2 \times 0{,}6 + 0{,}5 \times 0{,}4 = 0{,}12 + 0{,}20 = 0{,}32$$
  + $Z = 2$ xảy ra khi $(0, 2)$ hoặc $(1, 1)$:
    $$P(Z = 2) = 0{,}5 \times 0{,}6 + 0{,}3 \times 0{,}4 = 0{,}30 + 0{,}12 = 0{,}42$$
  + $X = 1, Y = 2 \Rightarrow Z = 3$: $P(Z = 3) = 0{,}3 \times 0{,}6 = 0{,}18$.
- **Bảng phân phối xác suất của Z:**

| $Z$ | 0 | 1 | 2 | 3 |
|:---:|:---:|:---:|:---:|:---:|
| $P$ | $0{,}08$ | $0{,}32$ | $0{,}42$ | $0{,}18$ |

- **Tính kỳ vọng của Z:**
  + Cách 1 (theo định nghĩa):
    $$EZ = 0 \times 0{,}08 + 1 \times 0{,}32 + 2 \times 0{,}42 + 3 \times 0{,}18 = 0 + 0{,}32 + 0{,}84 + 0{,}54 = 1{,}7$$
  + Cách 2 (tính chất kỳ vọng của tổng):
    $$EZ = E(X + Y) = EX + EY = 0{,}1 + 1{,}6 = 1{,}7$$

---

### Bài 14 (Trang 5)
**Đề bài:** Cho X và Y là hai đại lượng ngẫu nhiên độc lập có cùng phân bố xác suất như sau:
| X | 0 | 1 | 2 | 3 |
|:---:|:---:|:---:|:---:|:---:|
| P | 0,4 | 0,3 | 0,2 | 0,1 |

| Y | 0 | 1 | 2 | 3 | 4 |
|:---:|:---:|:---:|:---:|:---:|:---:|
| P | 0,1 | 0,3 | 0,4 | 0,15 | 0,05 |

a. Tìm phân bố xác suất đồng thời của X, Y.
b. Tính $P\{X > Y\}$.

**Lời giải chi tiết:**
**a. Phân bố xác suất đồng thời của (X, Y):**
- Do $X$ và $Y$ độc lập nên $P(X = i, Y = j) = P(X = i) \cdot P(Y = j)$ với mọi cặp $(i, j)$.
- Bảng xác suất đồng thời:

| $X \setminus Y$ | 0 | 1 | 2 | 3 | 4 | $P(X = i)$ |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **0** | $0{,}04$ | $0{,}12$ | $0{,}16$ | $0{,}06$ | $0{,}02$ | **$0{,}40$** |
| **1** | $0{,}03$ | $0{,}09$ | $0{,}12$ | $0{,}045$ | $0{,}015$ | **$0{,}30$** |
| **2** | $0{,}02$ | $0{,}06$ | $0{,}08$ | $0{,}03$ | $0{,}01$ | **$0{,}20$** |
| **3** | $0{,}01$ | $0{,}03$ | $0{,}04$ | $0{,}015$ | $0{,}005$ | **$0{,}10$** |
| **$P(Y = j)$** | **$0{,}10$** | **$0{,}30$** | **$0{,}40$** | **$0{,}15$** | **$0{,}05$** | **$1{,}00$** |

**b. Tính $P\{X > Y\}$:**
- Biến cố $\{X > Y\}$ gồm các cặp $(i, j)$ có $i > j$:
  + Với $X = 1$: $Y = 0 \Rightarrow P(1, 0) = 0{,}03$.
  + Với $X = 2$: $Y \in \{0, 1\} \Rightarrow P(2, 0) + P(2, 1) = 0{,}02 + 0{,}06 = 0{,}08$.
  + Với $X = 3$: $Y \in \{0, 1, 2\} \Rightarrow P(3, 0) + P(3, 1) + P(3, 2) = 0{,}01 + 0{,}03 + 0{,}04 = 0{,}08$.
- Tổng xác suất là:
  $$P(X > Y) = 0{,}03 + 0{,}08 + 0{,}08 = 0{,}19$$

---

### Bài 15 (Trang 5 - 6)
**Đề bài:** Các ĐLNN X, Y có bảng phân bố xác suất đồng thời như sau:
| $X \setminus Y$ | 0 | 1 | 2 |
|:---:|:---:|:---:|:---:|
| **0** | 0,12 | 0,15 | 0,03 |
| **1** | 0,28 | 0,35 | 0,07 |

a. Chứng minh X, Y độc lập.
b. Tìm quy luật phân bố của ĐLNN $Z = X.Y$.
c. Tính EZ bằng hai cách.

**Lời giải chi tiết:**
**a. Chứng minh X, Y độc lập:**
- Tính phân bố biên xác suất của $X$ và $Y$:
  + $P(X = 0) = 0{,}12 + 0{,}15 + 0{,}03 = 0{,}30$
  + $P(X = 1) = 0{,}28 + 0{,}35 + 0{,}07 = 0{,}70$
  + $P(Y = 0) = 0{,}12 + 0{,}28 = 0{,}40$
  + $P(Y = 1) = 0{,}15 + 0{,}35 = 0{,}50$
  + $P(Y = 2) = 0{,}03 + 0{,}07 = 0{,}10$
- Kiểm tra tính độc lập $P(X = i, Y = j) = P(X = i) \cdot P(Y = j)$:
  + $(0, 0): 0{,}30 \times 0{,}40 = 0{,}12 = P(X=0, Y=0)$
  + $(0, 1): 0{,}30 \times 0{,}50 = 0{,}15 = P(X=0, Y=1)$
  + $(0, 2): 0{,}30 \times 0{,}10 = 0{,}03 = P(X=0, Y=2)$
  + $(1, 0): 0{,}70 \times 0{,}40 = 0{,}28 = P(X=1, Y=0)$
  + $(1, 1): 0{,}70 \times 0{,}50 = 0{,}35 = P(X=1, Y=1)$
  + $(1, 2): 0{,}70 \times 0{,}10 = 0{,}07 = P(X=1, Y=2)$
- Vì đẳng thức thỏa mãn với mọi $i \in \{0, 1\}, j \in \{0, 1, 2\}$, ta kết luận **$X$ và $Y$ là hai biến ngẫu nhiên độc lập**.

**b. Tìm quy luật phân bố của $Z = X \cdot Y$:**
- Do $X \in \{0, 1\}$ và $Y \in \{0, 1, 2\}$ nên $Z$ nhận các giá trị:
  $$Z \in \{0, 1, 2\}$$
- Xác định xác suất:
  + $Z = 0$: khi $X = 0$ (hoặc $X = 1, Y = 0$):
    $$P(Z = 0) = P(X = 0) + P(X = 1, Y = 0) = 0{,}30 + 0{,}28 = 0{,}58$$
  + $Z = 1$: khi $X = 1, Y = 1$:
    $$P(Z = 1) = P(X = 1, Y = 1) = 0{,}35$$
  + $Z = 2$: khi $X = 1, Y = 2$:
    $$P(Z = 2) = P(X = 1, Y = 2) = 0{,}07$$
- **Bảng phân phối xác suất của Z:**

| $Z$ | 0 | 1 | 2 |
|:---:|:---:|:---:|:---:|
| $P$ | $0{,}58$ | $0{,}35$ | $0{,}07$ |

*(Kiểm tra: $0{,}58 + 0{,}35 + 0{,}07 = 1{,}0$)*.

**c. Tính EZ bằng hai cách:**
- **Cách 1: Tính trực tiếp từ phân bố xác suất của Z:**
  $$EZ = 0 \times 0{,}58 + 1 \times 0{,}35 + 2 \times 0{,}07 = 0 + 0{,}35 + 0{,}14 = 0{,}49$$
- **Cách 2: Áp dụng tính chất hai biến ngẫu nhiên độc lập:**
  Do $X$ và $Y$ độc lập nên $E(X \cdot Y) = EX \cdot EY$.
  + $EX = 0 \times 0{,}30 + 1 \times 0{,}70 = 0{,}70$
  + $EY = 0 \times 0{,}40 + 1 \times 0{,}50 + 2 \times 0{,}10 = 0{,}50 + 0{,}20 = 0{,}70$
  + $EZ = EX \cdot EY = 0{,}70 \times 0{,}70 = 0{,}49$
- Hai cách cho cùng một kết quả $EZ = 0{,}49$.

---

### Bài 16 (Trang 6)
**Đề bài:** Cho X, Y là hai ĐLNN có phân bố xác suất đồng thời như sau:
| $X \setminus Y$ | -1 | 1 |
|:---:|:---:|:---:|
| **-1** | 1/6 | 1/4 |
| **0** | 1/6 | 1/8 |
| **1** | 1/6 | 1/8 |

a. Tính EX, EY, Cov(X, Y).
b. X, Y có độc lập không?

**Lời giải chi tiết:**
- Bảng xác suất biên của $X$ và $Y$:
  + $P(X = -1) = \frac{1}{6} + \frac{1}{4} = \frac{5}{12}$
  + $P(X = 0) = \frac{1}{6} + \frac{1}{8} = \frac{7}{24}$
  + $P(X = 1) = \frac{1}{6} + \frac{1}{8} = \frac{7}{24}$
  + $P(Y = -1) = \frac{1}{6} + \frac{1}{6} + \frac{1}{6} = \frac{3}{6} = \frac{1}{2}$
  + $P(Y = 1) = \frac{1}{4} + \frac{1}{8} + \frac{1}{8} = \frac{2 + 1 + 1}{8} = \frac{4}{8} = \frac{1}{2}$

**a. Tính EX, EY, Cov(X, Y):**
- Kỳ vọng $EX$:
  $$EX = (-1) \times \frac{5}{12} + 0 \times \frac{7}{24} + 1 \times \frac{7}{24} = -\frac{10}{24} + \frac{7}{24} = -\frac{3}{24} = -\frac{1}{8} = -0{,}125$$
- Kỳ vọng $EY$:
  $$EY = (-1) \times \frac{1}{2} + 1 \times \frac{1}{2} = 0$$
- Kỳ vọng tích $E(XY)$:
  $$E(XY) = \sum \sum x_i y_j P(X = x_i, Y = y_j)$$
  $$E(XY) = (-1)(-1)\left(\frac{1}{6}\right) + (-1)(1)\left(\frac{1}{4}\right) + 0 + (1)(-1)\left(\frac{1}{6}\right) + (1)(1)\left(\frac{1}{8}\right)$$
  $$E(XY) = \frac{1}{6} - \frac{1}{4} - \frac{1}{6} + \frac{1}{8} = -\frac{1}{4} + \frac{1}{8} = -\frac{1}{8} = -0{,}125$$
- Hiệp phương sai $\text{Cov}(X, Y)$:
  $$\text{Cov}(X, Y) = E(XY) - EX \cdot EY = -\frac{1}{8} - \left(-\frac{1}{8}\right) \times 0 = -\frac{1}{8} = -0{,}125$$

**b. X, Y có độc lập không?**
- Vì $\text{Cov}(X, Y) = -\frac{1}{8} \ne 0$ nên **$X$ và $Y$ không độc lập**.
- *(Hoặc chỉ ra một điểm cụ thể: $P(X = -1, Y = 1) = \frac{1}{4} = \frac{6}{24}$, trong khi $P(X = -1) \cdot P(Y = 1) = \frac{5}{12} \times \frac{1}{2} = \frac{5}{24} \ne \frac{6}{24}$)*.

---

### Bài 17 (Trang 6)
**Đề bài:** Cho ĐLNN X có bảng quy luật phân bố như sau:
| X | 0 | 1 | 2 | 3 | 4 |
|:---:|:---:|:---:|:---:|:---:|:---:|
| P | 0,1 | 0,2 | 0,3 | 0,25 | 0,15 |

Xét ĐLNN $Y = X^3 - 4X^2 + 10$.
a. Tìm phân bố xác suất của Y.
b. Tính EY bằng 2 cách.
c. Tính DY.

**Lời giải chi tiết:**
- Tính giá trị hàm $Y = g(X) = X^3 - 4X^2 + 10$ tại các giá trị của $X$:
  + $X = 0 \Rightarrow Y = 0 - 0 + 10 = 10$
  + $X = 1 \Rightarrow Y = 1 - 4 + 10 = 7$
  + $X = 2 \Rightarrow Y = 8 - 16 + 10 = 2$
  + $X = 3 \Rightarrow Y = 27 - 36 + 10 = 1$
  + $X = 4 \Rightarrow Y = 64 - 64 + 10 = 10$
- Nhận thấy $Y$ nhận các giá trị trong tập $\{1, 2, 7, 10\}$.

**a. Phân bố xác suất của Y:**
- Tính xác suất của từng giá trị:
  + $P(Y = 1) = P(X = 3) = 0{,}25$
  + $P(Y = 2) = P(X = 2) = 0{,}30$
  + $P(Y = 7) = P(X = 1) = 0{,}20$
  + $P(Y = 10) = P(X = 0) + P(X = 4) = 0{,}10 + 0{,}15 = 0{,}25$
- Bảng phân bố xác suất của $Y$ (sắp xếp tăng dần):

| $Y$ | 1 | 2 | 7 | 10 |
|:---:|:---:|:---:|:---:|:---:|
| $P$ | $0{,}25$ | $0{,}30$ | $0{,}20$ | $0{,}25$ |

*(Kiểm tra: $0{,}25 + 0{,}30 + 0{,}20 + 0{,}25 = 1{,}0$)*.

**b. Tính EY bằng 2 cách:**
- **Cách 1: Tính theo phân bố xác suất của Y:**
  $$EY = 1 \times 0{,}25 + 2 \times 0{,}30 + 7 \times 0{,}20 + 10 \times 0{,}25 = 0{,}25 + 0{,}60 + 1{,}40 + 2{,}50 = 4{,}75$$
- **Cách 2: Tính thông qua phân bố xác suất của X (công thức hàm):**
  $$EY = \sum g(x_i) P(X = x_i) = 10(0{,}1) + 7(0{,}2) + 2(0{,}3) + 1(0{,}25) + 10(0{,}15)$$
  $$EY = 1{,}0 + 1{,}4 + 0{,}6 + 0{,}25 + 1{,}5 = 4{,}75$$

**c. Tính DY:**
- Tính $E(Y^2)$:
  $$E(Y^2) = 1^2 \times 0{,}25 + 2^2 \times 0{,}30 + 7^2 \times 0{,}20 + 10^2 \times 0{,}25$$
  $$E(Y^2) = 0{,}25 + 1{,}20 + 9{,}80 + 25{,}00 = 36{,}25$$
- Phương sai $DY$:
  $$DY = E(Y^2) - (EY)^2 = 36{,}25 - (4{,}75)^2 = 36{,}25 - 22{,}5625 = 13{,}6875$$

---

### Bài 18 (Trang 6)
**Đề bài:** Giả sử $X \sim B(2; 0{,}4)$ và $Y \sim B(2; 0{,}7)$. X và Y độc lập.
a. Tìm phân bố xác suất của X, Y.
b. Chứng minh rằng $X + Y$ không có phân bố nhị thức.

**Lời giải chi tiết:**
**a. Tìm phân bố xác suất của X, Y:**
- Với $X \sim B(2; 0{,}4)$:
  + $P(X = 0) = C_2^0 (0{,}4)^0 (0{,}6)^2 = 0{,}36$
  + $P(X = 1) = C_2^1 (0{,}4)^1 (0{,}6)^1 = 0{,}48$
  + $P(X = 2) = C_2^2 (0{,}4)^2 (0{,}6)^0 = 0{,}16$

| $X$ | 0 | 1 | 2 |
|:---:|:---:|:---:|:---:|
| $P$ | $0{,}36$ | $0{,}48$ | $0{,}16$ |

- Với $Y \sim B(2; 0{,}7)$:
  + $P(Y = 0) = C_2^0 (0{,}7)^0 (0{,}3)^2 = 0{,}09$
  + $P(Y = 1) = C_2^1 (0{,}7)^1 (0{,}3)^1 = 0{,}42$
  + $P(Y = 2) = C_2^2 (0{,}7)^2 (0{,}3)^0 = 0{,}49$

| $Y$ | 0 | 1 | 2 |
|:---:|:---:|:---:|:---:|
| $P$ | $0{,}09$ | $0{,}42$ | $0{,}49$ |

**b. Chứng minh $X + Y$ không có phân bố nhị thức:**
- Giả sử phản chứng $Z = X + Y$ tuân theo phân bố nhị thức $B(n, p)$.
  Vì $X$ nhận tối đa giá trị 2 và $Y$ nhận tối đa giá trị 2 nên $Z = X + Y$ nhận giá trị từ 0 đến 4 $\Rightarrow n = 4$.
  Tức là $Z \sim B(4, p)$.
- Khi đó kỳ vọng của $Z$ theo phân bố nhị thức là:
  $$EZ = n \cdot p = 4p$$
  Mặt khác, theo tính chất kỳ vọng của tổng hai biến ngẫu nhiên:
  $$EZ = EX + EY = 2 \times 0{,}4 + 2 \times 0{,}7 = 0{,}8 + 1{,}4 = 2{,}2$$
  Suy ra:
  $$4p = 2{,}2 \Longrightarrow p = \frac{2{,}2}{4} = 0{,}55$$
- Nếu $Z \sim B(4; 0{,}55)$ thì phương sai của $Z$ phải bằng:
  $$\text{Var}(Z) = n \cdot p \cdot (1 - p) = 4 \times 0{,}55 \times (1 - 0{,}55) = 4 \times 0{,}55 \times 0{,}45 = 0{,}99$$
- Tuy nhiên, do $X$ và $Y$ độc lập nên phương sai thực tế của tổng là:
  $$D(X + Y) = DX + DY = 2 \times 0{,}4 \times 0{,}6 + 2 \times 0{,}7 \times 0{,}3 = 0{,}48 + 0{,}42 = 0{,}90$$
- Vì $\text{Var}(Z) = 0{,}90 \ne 0{,}99$ (mâu thuẫn), nên giả sử là sai.
- **Kết luận:** $X + Y$ không có phân bố nhị thức (đpcm).

---
\pagebreak

## CHƯƠNG 6: ĐẠI LƯỢNG NGẪU NHIÊN LIÊN TỤC

### Bài 1 (Trang 6)
**Đề bài:** Cho đại lượng ngẫu nhiên liên tục X có hàm mật độ
$$f(x) = \begin{cases} kx^2(1 - x) & \text{nếu } x \in [0; 1] \\ 0 & \text{nếu } x \notin [0; 1] \end{cases}$$
a. Tìm hằng số k.
b. Tính $P\{0{,}4 < X < 0{,}6\}$.

**Lời giải chi tiết:**
**a. Tìm hằng số k:**
- Theo tính chất chuẩn hóa của hàm mật độ xác suất:
  $$\int_{-\infty}^{+\infty} f(x)dx = 1 \Longleftrightarrow \int_0^1 k(x^2 - x^3)dx = 1$$
- Tính tích phân:
  $$\int_0^1 (x^2 - x^3)dx = \left[ \frac{x^3}{3} - \frac{x^4}{4} \right]_0^1 = \frac{1}{3} - \frac{1}{4} = \frac{1}{12}$$
  Suy ra:
  $$k \times \frac{1}{12} = 1 \Longleftrightarrow k = 12$$
  *(Hàm mật độ là $f(x) = 12(x^2 - x^3) \ge 0$ với mọi $x \in [0, 1]$)*.

**b. Tính $P\{0{,}4 < X < 0{,}6\}$:**
- Xác suất để $X$ nhận giá trị trong khoảng $(0{,}4; 0{,}6)$ là:
  $$P(0{,}4 < X < 0{,}6) = \int_{0{,}4}^{0{,}6} 12(x^2 - x^3)dx = 12 \left[ \frac{x^3}{3} - \frac{x^4}{4} \right]_{0{,}4}^{0{,}6} = \left[ 4x^3 - 3x^4 \right]_{0{,}4}^{0{,}6}$$
- Thay cận:
  + Tại $x = 0{,}6$: $4(0{,}6)^3 - 3(0{,}6)^4 = 4(0{,}216) - 3(0{,}1296) = 0{,}864 - 0{,}3888 = 0{,}4752$.
  + Tại $x = 0{,}4$: $4(0{,}4)^3 - 3(0{,}4)^4 = 4(0{,}064) - 3(0{,}0256) = 0{,}256 - 0{,}0768 = 0{,}1792$.
- Vậy:
  $$P(0{,}4 < X < 0{,}6) = 0{,}4752 - 0{,}1792 = 0{,}2960$$

---

### Bài 2 (Trang 6 - 7)
**Đề bài:** Cho đại lượng ngẫu nhiên liên tục X có hàm mật độ
$$f(x) = \begin{cases} 0 & \text{nếu } x < 1 \\ \frac{A}{x^2} & \text{nếu } x \ge 1 \end{cases}$$
a. Tìm hằng số A.
b. Tìm hàm phân phối $F(x)$.
c. Tính $P\{2 < X < 3\}$.

**Lời giải chi tiết:**
**a. Tìm hằng số A:**
- Áp dụng tính chất hàm mật độ:
  $$\int_{-\infty}^{+\infty} f(x)dx = 1 \Longleftrightarrow \int_1^{+\infty} \frac{A}{x^2}dx = 1$$
- Ta có:
  $$\int_1^{+\infty} \frac{1}{x^2}dx = \lim_{b \to +\infty} \left[ -\frac{1}{x} \right]_1^b = \lim_{b \to +\infty} \left( 1 - \frac{1}{b} \right) = 1$$
  Do đó:
  $$A \times 1 = 1 \Longleftrightarrow A = 1$$

**b. Tìm hàm phân phối $F(x)$:**
- Theo định nghĩa hàm phân phối xác suất: $F(x) = \int_{-\infty}^x f(t)dt$:
  + Với $x < 1$: $F(x) = \int_{-\infty}^x 0 dt = 0$.
  + Với $x \ge 1$:
    $$F(x) = \int_{-\infty}^1 0 dt + \int_1^x \frac{1}{t^2}dt = \left[ -\frac{1}{t} \right]_1^x = 1 - \frac{1}{x}$$
- Vậy hàm phân phối xác suất là:
  $$F(x) = \begin{cases} 0 & \text{nếu } x < 1 \\ 1 - \frac{1}{x} & \text{nếu } x \ge 1 \end{cases}$$

**c. Tính $P\{2 < X < 3\}$:**
- Áp dụng công thức qua hàm phân phối:
  $$P(2 < X < 3) = F(3) - F(2) = \left( 1 - \frac{1}{3} \right) - \left( 1 - \frac{1}{2} \right) = \frac{1}{2} - \frac{1}{3} = \frac{1}{6} \approx 0{,}1667$$

---

### Bài 3 (Trang 7)
**Đề bài:** Cho
$$f(x) = \begin{cases} 2(1 - x) & \text{nếu } x \in [0; 1] \\ 0 & \text{nếu } x \notin [0; 1] \end{cases}$$
a. Chứng minh rằng $f(x)$ là hàm mật độ của biến ngẫu nhiên X nào đó.
b. Tính kỳ vọng và phương sai của X.

**Lời giải chi tiết:**
**a. Chứng minh $f(x)$ là hàm mật độ:**
Ta cần kiểm tra 2 điều kiện tiên đề của hàm mật độ xác suất:
1. $f(x) \ge 0$ với mọi $x$:
   + Với $x \in [0; 1] \Rightarrow 1 - x \ge 0 \Rightarrow 2(1 - x) \ge 0$.
   + Với $x \notin [0; 1] \Rightarrow f(x) = 0 \ge 0$.
   Vậy $f(x) \ge 0, \forall x \in \mathbb{R}$.
2. Tích phân trên toàn trục số bằng 1:
   $$\int_{-\infty}^{+\infty} f(x)dx = \int_0^1 2(1 - x)dx = 2 \left[ x - \frac{x^2}{2} \right]_0^1 = 2 \left( 1 - \frac{1}{2} \right) = 1$$
- Thỏa mãn cả 2 điều kiện nên $f(x)$ là hàm mật độ xác suất của một biến ngẫu nhiên $X$ (đpcm).

**b. Tính kỳ vọng và phương sai của X:**
- Kỳ vọng $EX$:
  $$EX = \int_0^1 x \cdot 2(1 - x)dx = 2 \int_0^1 (x - x^2)dx = 2 \left[ \frac{x^2}{2} - \frac{x^3}{3} \right]_0^1 = 2 \left( \frac{1}{2} - \frac{1}{3} \right) = 2 \times \frac{1}{6} = \frac{1}{3}$$
- Kỳ vọng bậc 2:
  $$E(X^2) = \int_0^1 x^2 \cdot 2(1 - x)dx = 2 \int_0^1 (x^2 - x^3)dx = 2 \left[ \frac{x^3}{3} - \frac{x^4}{4} \right]_0^1 = 2 \left( \frac{1}{3} - \frac{1}{4} \right) = 2 \times \frac{1}{12} = \frac{1}{6}$$
- Phương sai $DX$:
  $$DX = E(X^2) - (EX)^2 = \frac{1}{6} - \left(\frac{1}{3}\right)^2 = \frac{1}{6} - \frac{1}{9} = \frac{3 - 2}{18} = \frac{1}{18} \approx 0{,}0556$$

---

### Bài 4 (Trang 7)
**Đề bài:** Cho đại lượng ngẫu nhiên liên tục X có hàm mật độ
$$f(x) = \begin{cases} k(1 - x) & \text{nếu } x \in [0; 1] \\ 0 & \text{nếu } x \notin [0; 1] \end{cases}$$
a. Tìm hằng số k.
b. Tính EX.

**Lời giải chi tiết:**
**a. Tìm hằng số k:**
- Từ điều kiện chuẩn hóa:
  $$\int_0^1 k(1 - x)dx = 1 \Longleftrightarrow k \left[ x - \frac{x^2}{2} \right]_0^1 = 1 \Longleftrightarrow k \times \frac{1}{2} = 1 \Longleftrightarrow k = 2$$

**b. Tính EX:**
- Với $k = 2$, hàm mật độ là $f(x) = 2(1 - x)$ trên $[0, 1]$.
- Áp dụng công thức tính kỳ vọng toán:
  $$EX = \int_0^1 x \cdot 2(1 - x)dx = 2 \left[ \frac{x^2}{2} - \frac{x^3}{3} \right]_0^1 = 2 \left(\frac{1}{2} - \frac{1}{3}\right) = \frac{1}{3}$$

---

### Bài 5 (Trang 7 - Trùng Câu 3 Đề thi mẫu `image1.png`)
**Đề bài:** Biến ngẫu nhiên liên tục X với hàm mật độ xác suất
$$f(x) = \begin{cases} 0 & \text{nếu } x \notin [2; 4] \\ \frac{3}{4}(x - 2)(4 - x) & \text{nếu } x \in [2; 4] \end{cases}$$
a. Tính $P(2 < X < 3)$.
b. Tìm kỳ vọng toán, phương sai của biến ngẫu nhiên X.

**Lời giải chi tiết (trình bày nguyên văn theo barem chuẩn KMA):**
**a. Tính $P(2 < X < 3)$:**
- Ta có công thức:
  $$P(2 < X < 3) = \int_2^3 \frac{3}{4}(x - 2)(4 - x)dx$$
- Khai triển biểu thức dưới dấu tích phân: $(x - 2)(4 - x) = 4x - x^2 - 8 + 2x = -x^2 + 6x - 8$.
  $$\int_2^3 (-x^2 + 6x - 8)dx = \left[ -\frac{x^3}{3} + 3x^2 - 8x \right]_2^3$$
  + Tại $x = 3$: $-9 + 27 - 24 = -6$.
  + Tại $x = 2$: $-\frac{8}{3} + 12 - 16 = -4 - \frac{8}{3} = -\frac{20}{3}$.
  + Hiệu số: $-6 - \left(-\frac{20}{3}\right) = \frac{2}{3}$.
- Nhân với hệ số $\frac{3}{4}$:
  $$P(2 < X < 3) = \frac{3}{4} \times \frac{2}{3} = \frac{1}{2} = 0{,}5$$
  *(Nhận xét: Đồ thị hàm mật độ đối xứng qua đường thẳng $x = 3$ trên đoạn $[2, 4]$ nên diện tích nửa bên trái hiển nhiên bằng $0{,}5$)*.

**b. Tìm kỳ vọng toán và phương sai của biến ngẫu nhiên X:**
- Kỳ vọng của $X$ là:
  $$EX = \int_{-\infty}^{+\infty} x f(x)dx = \int_2^4 \frac{3}{4} x(x - 2)(4 - x)dx$$
  Do hàm mật độ $f(x)$ đối xứng qua $x = 3$ trên $[2; 4]$ nên kỳ vọng đối xứng:
  $$EX = 3$$
- Tính $E(X^2)$ để tìm phương sai:
  $$E(X^2) = \int_2^4 x^2 f(x)dx = \int_2^4 \frac{3}{4} x^2 (-x^2 + 6x - 8)dx = \frac{3}{4} \int_2^4 (-x^4 + 6x^3 - 8x^2)dx$$
  $$\int_2^4 (-x^4 + 6x^3 - 8x^2)dx = \left[ -\frac{x^5}{5} + \frac{6x^4}{4} - \frac{8x^3}{3} \right]_2^4 = \left[ -\frac{x^5}{5} + \frac{3x^4}{2} - \frac{8x^3}{3} \right]_2^4 = \frac{184}{15}$$
  $$E(X^2) = \frac{3}{4} \times \frac{184}{15} = \frac{46}{5} = 9{,}2$$
- Phương sai của $X$:
  $$DX = VX = E(X^2) - (EX)^2 = \frac{46}{5} - 3^2 = \frac{46}{5} - 9 = \frac{1}{5} = 0{,}2$$
- **Kết luận:** $P(2 < X < 3) = 0{,}5$; $EX = 3$; $DX = 0{,}2$.

---

### Bài 6 (Trang 7)
**Đề bài:** Cho biến ngẫu nhiên liên tục X có hàm mật độ
$$f(x) = \begin{cases} kx^2 & \text{nếu } x \in [0; 3] \\ 0 & \text{nếu } x \notin [0; 3] \end{cases}$$
a. Chứng minh rằng số $k = \frac{1}{9}$.
b. Tính $P(X > 2)$ và tính EX.

**Lời giải chi tiết:**
**a. Chứng minh $k = \frac{1}{9}$:**
- Vì $f(x)$ là hàm mật độ xác suất nên:
  $$\int_{-\infty}^{+\infty} f(x)dx = 1 \Longleftrightarrow \int_0^3 kx^2 dx = 1$$
  $$k \left[ \frac{x^3}{3} \right]_0^3 = 1 \Longleftrightarrow k \times \frac{27}{3} = 1 \Longleftrightarrow 9k = 1 \Longleftrightarrow k = \frac{1}{9} \text{ (đpcm)}$$

**b. Tính $P(X > 2)$ và EX:**
- Với $k = \frac{1}{9}$, ta có $f(x) = \frac{1}{9}x^2$ trên $[0, 3]$.
- Tính $P(X > 2)$:
  $$P(X > 2) = \int_2^3 \frac{1}{9}x^2 dx = \frac{1}{9} \left[ \frac{x^3}{3} \right]_2^3 = \frac{1}{27} (3^3 - 2^3) = \frac{27 - 8}{27} = \frac{19}{27} \approx 0{,}7037$$
- Tính kỳ vọng $EX$:
  $$EX = \int_0^3 x \cdot \frac{1}{9}x^2 dx = \frac{1}{9} \int_0^3 x^3 dx = \frac{1}{9} \left[ \frac{x^4}{4} \right]_0^3 = \frac{1}{9} \times \frac{81}{4} = \frac{9}{4} = 2{,}25$$

---

### Bài 7 (Trang 7)
**Đề bài:** Cho đại lượng ngẫu nhiên liên tục X có hàm mật độ
$$f(x) = \begin{cases} k(1 + x)^{-3} & \text{nếu } x \ge 0 \\ 0 & \text{nếu } x < 0 \end{cases}$$
a. Tìm hằng số k.
b. Tính EX.

**Lời giải chi tiết:**
**a. Tìm hằng số k:**
- Áp dụng điều kiện chuẩn hóa:
  $$\int_0^{+\infty} k(1 + x)^{-3}dx = 1$$
- Ta có nguyên hàm:
  $$\int (1 + x)^{-3}dx = -\frac{1}{2(1 + x)^2}$$
  Suy ra:
  $$\int_0^{+\infty} (1 + x)^{-3}dx = \lim_{b \to +\infty} \left[ -\frac{1}{2(1 + x)^2} \right]_0^b = 0 - \left(-\frac{1}{2}\right) = \frac{1}{2}$$
  Do đó:
  $$k \times \frac{1}{2} = 1 \Longleftrightarrow k = 2$$

**b. Tính EX:**
- Áp dụng công thức tính kỳ vọng với $k = 2$:
  $$EX = \int_0^{+\infty} x \cdot 2(1 + x)^{-3}dx$$
- Đổi biến $u = 1 + x \Rightarrow du = dx$, khi $x = 0 \Rightarrow u = 1$; khi $x \to +\infty \Rightarrow u \to +\infty$. Biểu thức $x = u - 1$.
  $$EX = 2 \int_1^{+\infty} (u - 1) u^{-3} du = 2 \int_1^{+\infty} (u^{-2} - u^{-3}) du$$
  $$EX = 2 \left[ -\frac{1}{u} + \frac{1}{2u^2} \right]_1^{+\infty} = 2 \left[ 0 - \left(-1 + \frac{1}{2}\right) \right] = 2 \times \frac{1}{2} = 1$$
- **Kết luận:** $k = 2$ và $EX = 1$.

---

### Bài 8 (Trang 7 - 8)
**Đề bài:** Cho đại lượng ngẫu nhiên liên tục X có hàm mật độ
$$f(x) = \begin{cases} \frac{x}{4} + \frac{1}{2} & \text{nếu } -2 \le x \le 0 \\ -\frac{x}{4} + \frac{1}{2} & \text{nếu } 0 \le x \le 2 \\ 0 & \text{nếu } x \text{ còn lại} \end{cases}$$
Tính EX, DX.

**Lời giải chi tiết:**
- Nhận xét hàm mật độ $f(x)$ là hàm chẵn trên $[-2; 2]$ vì:
  + Với $x \in [0; 2] \Rightarrow -x \in [-2; 0]$ thì $f(-x) = \frac{-x}{4} + \frac{1}{2} = f(x)$.
  + Đồ thị của $f(x)$ có dạng hình tam giác đối xứng qua trục tung $Oy$ ($x = 0$).
- Do tính chất đối xứng qua $x = 0$ nên kỳ vọng toán của $X$ là:
  $$EX = 0$$
- Để tính phương sai $DX$, vì $EX = 0$ nên $DX = E(X^2) - 0 = E(X^2)$.
  Do tính chất chẵn của hàm dưới dấu tích phân $x^2 f(x)$:
  $$DX = E(X^2) = \int_{-2}^2 x^2 f(x)dx = 2 \int_0^2 x^2 \left( -\frac{x}{4} + \frac{1}{2} \right)dx$$
  $$DX = 2 \int_0^2 \left( -\frac{x^3}{4} + \frac{x^2}{2} \right)dx = 2 \left[ -\frac{x^4}{16} + \frac{x^3}{6} \right]_0^2$$
  Thay cận $x = 2$:
  $$DX = 2 \left( -\frac{16}{16} + \frac{8}{6} \right) = 2 \left( -1 + \frac{4}{3} \right) = 2 \times \frac{1}{3} = \frac{2}{3} \approx 0{,}6667$$
- **Kết luận:** $EX = 0$ và $DX = \frac{2}{3} \approx 0{,}6667$.

---

### Bài 9 (Trang 8)
**Đề bài:** Cho đại lượng ngẫu nhiên liên tục X có hàm mật độ
$$f(x) = \begin{cases} kx & \text{nếu } 0 \le x \le 1 \\ k & \text{nếu } 1 \le x \le 4 \\ 0 & \text{nếu } x \text{ còn lại} \end{cases}$$
a. Tìm hằng số k.
b. Tính EX, DX.

**Lời giải chi tiết:**
**a. Tìm hằng số k:**
- Áp dụng điều kiện chuẩn hóa:
  $$\int_{-\infty}^{+\infty} f(x)dx = 1 \Longleftrightarrow \int_0^1 kx dx + \int_1^4 k dx = 1$$
  $$k \left[ \frac{x^2}{2} \right]_0^1 + k [x]_1^4 = 1 \Longleftrightarrow k \times \frac{1}{2} + 3k = 1 \Longleftrightarrow \frac{7}{2}k = 1 \Longleftrightarrow k = \frac{2}{7}$$

**b. Tính EX, DX:**
- Với $k = \frac{2}{7}$, tính kỳ vọng $EX$:
  $$EX = \int_0^1 x \cdot \left(\frac{2}{7}x\right)dx + \int_1^4 x \cdot \frac{2}{7} dx = \frac{2}{7} \int_0^1 x^2 dx + \frac{2}{7} \int_1^4 x dx$$
  $$EX = \frac{2}{7} \left[ \frac{x^3}{3} \right]_0^1 + \frac{2}{7} \left[ \frac{x^2}{2} \right]_1^4 = \frac{2}{7} \times \frac{1}{3} + \frac{2}{7} \times \frac{15}{2} = \frac{2}{21} + \frac{15}{7} = \frac{2 + 45}{21} = \frac{47}{21} \approx 2{,}2381$$
- Tính kỳ vọng bậc 2 $E(X^2)$:
  $$E(X^2) = \int_0^1 x^2 \left(\frac{2}{7}x\right)dx + \int_1^4 x^2 \left(\frac{2}{7}\right)dx = \frac{2}{7} \int_0^1 x^3 dx + \frac{2}{7} \int_1^4 x^2 dx$$
  $$E(X^2) = \frac{2}{7} \left[ \frac{x^4}{4} \right]_0^1 + \frac{2}{7} \left[ \frac{x^3}{3} \right]_1^4 = \frac{2}{7} \times \frac{1}{4} + \frac{2}{7} \times \frac{63}{3} = \frac{1}{14} + 6 = \frac{85}{14} \approx 6{,}0714$$
- Phương sai $DX$:
  $$DX = E(X^2) - (EX)^2 = \frac{85}{14} - \left(\frac{47}{21}\right)^2 = \frac{85}{14} - \frac{2209}{441} = \frac{26775 - 22090}{4410} = \frac{4685}{4410} = \frac{937}{882} \approx 1{,}0624$$

---

### Bài 10 (Trang 8)
**Đề bài:** Cho đại lượng ngẫu nhiên liên tục X với hàm mật độ
$$f(x) = \begin{cases} 0 & \text{nếu } x < 0 \\ 2e^{-2x} & \text{nếu } x \ge 0 \end{cases}$$
a. Tìm hàm phân bố $F(x)$.
b. Tìm kỳ vọng, phương sai của biến ngẫu nhiên X.

**Lời giải chi tiết:**
**a. Tìm hàm phân bố xác suất $F(x)$:**
- Đây là phân phối mũ (Exponential) với tham số $\lambda = 2$.
- Tính hàm phân bố $F(x) = \int_{-\infty}^x f(t)dt$:
  + Với $x < 0$: $F(x) = 0$.
  + Với $x \ge 0$:
    $$F(x) = \int_0^x 2e^{-2t}dt = \left[ -e^{-2t} \right]_0^x = 1 - e^{-2x}$$
- Vậy:
  $$F(x) = \begin{cases} 0 & \text{nếu } x < 0 \\ 1 - e^{-2x} & \text{nếu } x \ge 0 \end{cases}$$

**b. Tìm kỳ vọng và phương sai của X:**
- Theo công thức của phân phối mũ với $\lambda = 2$:
  $$EX = \frac{1}{\lambda} = \frac{1}{2} = 0{,}5$$
  $$DX = \frac{1}{\lambda^2} = \frac{1}{2^2} = \frac{1}{4} = 0{,}25$$
- *(Hoặc tích phân từng phần: $EX = \int_0^{+\infty} 2x e^{-2x}dx = \frac{1}{2}$; $E(X^2) = \int_0^{+\infty} 2x^2 e^{-2x}dx = \frac{1}{2} \Rightarrow DX = \frac{1}{2} - \frac{1}{4} = \frac{1}{4}$)*.

---

### Bài 11 (Trang 8)
**Đề bài:** Cho đại lượng ngẫu nhiên liên tục X với hàm mật độ
$$f(x) = \begin{cases} kx^2 e^{-2x} & \text{nếu } x \ge 0 \\ 0 & \text{nếu } x < 0 \end{cases}$$
a. Tìm hàm số k.
b. Tìm hàm phân bố $F(x)$.
c. Tìm kỳ vọng, phương sai của biến ngẫu nhiên X.

**Lời giải chi tiết:**
**a. Tìm hàm số k:**
- Áp dụng tích phân Euler (hàm Gamma): $\int_0^{+\infty} x^n e^{-\lambda x}dx = \frac{n!}{\lambda^{n+1}}$.
  Với $n = 2, \lambda = 2$:
  $$\int_0^{+\infty} x^2 e^{-2x}dx = \frac{2!}{2^3} = \frac{2}{8} = \frac{1}{4}$$
- Điều kiện chuẩn hóa:
  $$\int_0^{+\infty} k x^2 e^{-2x}dx = 1 \Longleftrightarrow k \times \frac{1}{4} = 1 \Longleftrightarrow k = 4$$

**b. Tìm hàm phân bố $F(x)$:**
- Với $x < 0$: $F(x) = 0$.
- Với $x \ge 0$: $F(x) = \int_0^x 4t^2 e^{-2t}dt$.
  Sử dụng tích phân từng phần 2 lần:
  $$\int t^2 e^{-2t}dt = -\frac{1}{2}e^{-2t}\left(t^2 + t + \frac{1}{2}\right)$$
  Do đó:
  $$F(x) = 4 \left[ -\frac{1}{2}e^{-2t}\left(t^2 + t + \frac{1}{2}\right) \right]_0^x = 1 - e^{-2x}(2x^2 + 2x + 1)$$
- Vậy:
  $$F(x) = \begin{cases} 0 & \text{nếu } x < 0 \\ 1 - e^{-2x}(2x^2 + 2x + 1) & \text{nếu } x \ge 0 \end{cases}$$

**c. Tìm kỳ vọng, phương sai của X:**
- Đây là phân phối Gamma với $\alpha = 3, \beta = 2$ ($f(x) = \frac{\beta^\alpha}{\Gamma(\alpha)} x^{\alpha-1} e^{-\beta x} = \frac{2^3}{2!} x^2 e^{-2x} = 4x^2 e^{-2x}$).
  + Kỳ vọng:
    $$EX = \frac{\alpha}{\beta} = \frac{3}{2} = 1{,}5$$
  + Phương sai:
    $$DX = \frac{\alpha}{\beta^2} = \frac{3}{2^2} = \frac{3}{4} = 0{,}75$$
- *(Tính bằng tích phân: $EX = \int_0^{+\infty} 4x^3 e^{-2x}dx = 4 \times \frac{3!}{2^4} = 4 \times \frac{6}{16} = 1{,}5$; $E(X^2) = \int_0^{+\infty} 4x^4 e^{-2x}dx = 4 \times \frac{4!}{2^5} = 4 \times \frac{24}{32} = 3 \Rightarrow DX = 3 - (1{,}5)^2 = 0{,}75$)*.

---

### Bài 12 (Trang 8)
**Đề bài:** Cho đại lượng ngẫu nhiên liên tục X có hàm mật độ
$$f(x) = \begin{cases} k(1 - x^2) & \text{nếu } |x| \le 1 \\ 0 & \text{nếu } x \text{ trái lại} \end{cases}$$
Tìm hằng số k và tính kỳ vọng, phương sai của ĐLNN $Y = 2X^2$.

**Lời giải chi tiết:**
**1. Tìm hằng số k:**
- Tích phân chuẩn hóa:
  $$\int_{-1}^1 k(1 - x^2)dx = 1 \Longleftrightarrow 2k \int_0^1 (1 - x^2)dx = 1 \Longleftrightarrow 2k \left( 1 - \frac{1}{3} \right) = 1 \Longleftrightarrow \frac{4}{3}k = 1 \Longleftrightarrow k = \frac{3}{4}$$

**2. Tính kỳ vọng $EY$ với $Y = 2X^2$:**
- Theo công thức kỳ vọng hàm số của biến ngẫu nhiên liên tục:
  $$EY = E(2X^2) = \int_{-1}^1 2x^2 \cdot \frac{3}{4}(1 - x^2)dx = \frac{3}{2} \int_{-1}^1 (x^2 - x^4)dx$$
- Do hàm dưới dấu tích phân là chẵn:
  $$EY = 3 \int_0^1 (x^2 - x^4)dx = 3 \left[ \frac{x^3}{3} - \frac{x^5}{5} \right]_0^1 = 3 \left( \frac{1}{3} - \frac{1}{5} \right) = 3 \times \frac{2}{15} = \frac{2}{5} = 0{,}4$$

**3. Tính phương sai $DY$:**
- Tính $E(Y^2) = E((2X^2)^2) = E(4X^4)$:
  $$E(Y^2) = \int_{-1}^1 4x^4 \cdot \frac{3}{4}(1 - x^2)dx = 3 \int_{-1}^1 (x^4 - x^6)dx = 6 \int_0^1 (x^4 - x^6)dx$$
  $$E(Y^2) = 6 \left[ \frac{x^5}{5} - \frac{x^7}{7} \right]_0^1 = 6 \left( \frac{1}{5} - \frac{1}{7} \right) = 6 \times \frac{2}{35} = \frac{12}{35}$$
- Phương sai của $Y$:
  $$DY = E(Y^2) - (EY)^2 = \frac{12}{35} - \left(\frac{2}{5}\right)^2 = \frac{12}{35} - \frac{4}{25} = \frac{60 - 28}{175} = \frac{32}{175} \approx 0{,}1829$$

---

### Bài 13 (Trang 8)
**Đề bài:** Cho đại lượng ngẫu nhiên liên tục X có hàm mật độ
$$f(x) = \begin{cases} kx^2 & \text{nếu } 0 \le x \le 1 \\ 0 & \text{nếu } x \text{ trái lại} \end{cases}$$
a. Tìm hằng số k.
b. Xét ĐLNN $Y = 2\sqrt{X}$. Tính $P(\frac{1}{2} < Y < \frac{3}{2})$, $P(Y > 1)$.

**Lời giải chi tiết:**
**a. Tìm hằng số k:**
- Chuẩn hóa:
  $$\int_0^1 kx^2 dx = 1 \Longleftrightarrow k \left[ \frac{x^3}{3} \right]_0^1 = 1 \Longleftrightarrow \frac{k}{3} = 1 \Longleftrightarrow k = 3$$
- Hàm mật độ là $f(x) = 3x^2$ trên $[0, 1]$. Hàm phân phối của $X$ là:
  $$F_X(x) = \int_0^x 3t^2 dt = x^3 \quad (\text{với } x \in [0, 1])$$

**b. Tính $P(\frac{1}{2} < Y < \frac{3}{2})$ và $P(Y > 1)$:**
- Với $Y = 2\sqrt{X}$, ta có mối quan hệ tương đương:
  $$Y > 0 \Longleftrightarrow \sqrt{X} = \frac{Y}{2} \Longleftrightarrow X = \frac{Y^2}{4}$$
- **Tính $P\left(\frac{1}{2} < Y < \frac{3}{2}\right)$:**
  $$\frac{1}{2} < Y < \frac{3}{2} \Longleftrightarrow \frac{1}{2} < 2\sqrt{X} < \frac{3}{2} \Longleftrightarrow \frac{1}{4} < \sqrt{X} < \frac{3}{4} \Longleftrightarrow \frac{1}{16} < X < \frac{9}{16}$$
  Áp dụng hàm phân phối của $X$:
  $$P\left(\frac{1}{2} < Y < \frac{3}{2}\right) = F_X\left(\frac{9}{16}\right) - F_X\left(\frac{1}{16}\right) = \left(\frac{9}{16}\right)^3 - \left(\frac{1}{16}\right)^3 = \frac{729 - 1}{4096} = \frac{728}{4096} = \frac{91}{512} \approx 0{,}1777$$
- **Tính $P(Y > 1)$:**
  $$Y > 1 \Longleftrightarrow 2\sqrt{X} > 1 \Longleftrightarrow \sqrt{X} > \frac{1}{2} \Longleftrightarrow X > \frac{1}{4}$$
  $$P(Y > 1) = 1 - F_X\left(\frac{1}{4}\right) = 1 - \left(\frac{1}{4}\right)^3 = 1 - \frac{1}{64} = \frac{63}{64} \approx 0{,}9844$$

---

### Bài 14 (Trang 8 - 9)
**Đề bài:** Trọng lượng của một con bò là một đại lượng ngẫu nhiên có phân bố chuẩn với giá trị trung bình 250 kg và độ lệch tiêu chuẩn là 40 kg. Tìm xác suất để một con bò chọn ngẫu nhiên có trọng lượng:
a. Nặng hơn 300 kg.
b. Nhẹ hơn 175 kg.
c. Nằm trong khoảng từ 260 kg đến 270 kg.

**Lời giải chi tiết:**
- Gọi $X$ là trọng lượng của con bò $\Rightarrow X \sim N(\mu, \sigma^2)$ với $\mu = 250$ kg, $\sigma = 40$ kg.
- Công thức tính xác suất của biến ngẫu nhiên phân bố chuẩn theo hàm Laplace $\Phi(x) = \frac{1}{\sqrt{2\pi}} \int_0^x e^{-t^2/2}dt$:
  $$P(a < X < b) = \Phi\left(\frac{b - \mu}{\sigma}\right) - \Phi\left(\frac{a - \mu}{\sigma}\right)$$
  $$P(X > c) = 0{,}5 - \Phi\left(\frac{c - \mu}{\sigma}\right); \quad P(X < c) = 0{,}5 + \Phi\left(\frac{c - \mu}{\sigma}\right)$$

**a. Trọng lượng nặng hơn 300 kg:**
- Ta có:
  $$P(X > 300) = 0{,}5 - \Phi\left(\frac{300 - 250}{40}\right) = 0{,}5 - \Phi\left(\frac{50}{40}\right) = 0{,}5 - \Phi(1{,}25)$$
- Tra bảng hàm Laplace: $\Phi(1{,}25) = 0{,}3944$.
  $$P(X > 300) = 0{,}5 - 0{,}3944 = 0{,}1056$$

**b. Trọng lượng nhẹ hơn 175 kg:**
- Ta có:
  $$P(X < 175) = 0{,}5 + \Phi\left(\frac{175 - 250}{40}\right) = 0{,}5 + \Phi\left(-\frac{75}{40}\right) = 0{,}5 - \Phi(1{,}88)$$
- Tra bảng hàm Laplace: $\Phi(1{,}88) \approx 0{,}4699$ (nếu lấy $1{,}875$ nội suy là $0{,}4696$).
  $$P(X < 175) = 0{,}5 - 0{,}4699 = 0{,}0301$$

**c. Trọng lượng nằm trong khoảng từ 260 kg đến 270 kg:**
- Ta có:
  $$P(260 < X < 270) = \Phi\left(\frac{270 - 250}{40}\right) - \Phi\left(\frac{260 - 250}{40}\right) = \Phi\left(\frac{20}{40}\right) - \Phi\left(\frac{10}{40}\right) = \Phi(0{,}5) - \Phi(0{,}25)$$
- Tra bảng hàm Laplace: $\Phi(0{,}5) = 0{,}1915$; $\Phi(0{,}25) = 0{,}0987$.
  $$P(260 < X < 270) = 0{,}1915 - 0{,}0987 = 0{,}0928$$

---

### Bài 15 (Trang 9)
**Đề bài:** Thời gian đi từ nhà tới trường của sinh viên A là một ĐLNN T (đơn vị là phút) có phân bố chuẩn. Biết rằng 65% số ngày A đến trường mất hơn 20 phút và 8% số ngày mất hơn 30 phút.
a. Tính thời gian đến trường của A và độ lệch tiêu chuẩn.
b. Giả sử A xuất phát từ nhà trước giờ vào học 25 phút. Tính xác suất để An bị muộn học.
c. An cần phải xuất phát trước giờ học là bao nhiêu phút để xác suất bị muộn học của A bé hơn 0,02.

**Lời giải chi tiết:**
- Thời gian đi đến trường $T \sim N(\mu, \sigma^2)$.

**a. Tính thời gian trung bình $\mu$ và độ lệch tiêu chuẩn $\sigma$:**
- Theo đề bài:
  1. $P(T > 20) = 0{,}65 \Longleftrightarrow 0{,}5 - \Phi\left(\frac{20 - \mu}{\sigma}\right) = 0{,}65 \Longleftrightarrow \Phi\left(\frac{20 - \mu}{\sigma}\right) = -0{,}15$.
     Do hàm $\Phi$ là hàm lẻ: $\Phi\left(\frac{\mu - 20}{\sigma}\right) = 0{,}15$.
     Tra bảng hàm Laplace: $\Phi(0{,}39) \approx 0{,}1517 \Rightarrow \frac{\mu - 20}{\sigma} \approx 0{,}39 \Longleftrightarrow 20 - \mu = -0{,}39\sigma$ (1).
  2. $P(T > 30) = 0{,}08 \Longleftrightarrow 0{,}5 - \Phi\left(\frac{30 - \mu}{\sigma}\right) = 0{,}08 \Longleftrightarrow \Phi\left(\frac{30 - \mu}{\sigma}\right) = 0{,}42$.
     Tra bảng hàm Laplace: $\Phi(1{,}41) \approx 0{,}4207 \Rightarrow \frac{30 - \mu}{\sigma} \approx 1{,}41 \Longleftrightarrow 30 - \mu = 1{,}41\sigma$ (2).
- Lấy phương trình (2) trừ phương trình (1):
  $$10 = 1{,}41\sigma - (-0{,}39\sigma) = 1{,}80\sigma \Longrightarrow \sigma = \frac{10}{1{,}80} \approx 5{,}56 \text{ (phút)}$$
- Thay $\sigma = 5{,}56$ vào (2):
  $$\mu = 30 - 1{,}41 \times 5{,}56 \approx 30 - 7{,}83 = 22{,}17 \text{ (phút)}$$
- **Kết luận:** Thời gian đi học trung bình là **$22{,}17$ phút** và độ lệch tiêu chuẩn là **$5{,}56$ phút**.

**b. Tính xác suất An bị muộn học nếu xuất phát trước 25 phút:**
- An bị muộn học khi thời gian đi học $T > 25$ phút.
- Xác suất muộn học là:
  $$P(T > 25) = 0{,}5 - \Phi\left(\frac{25 - 22{,}17}{5{,}56}\right) = 0{,}5 - \Phi\left(\frac{2{,}83}{5{,}56}\right) = 0{,}5 - \Phi(0{,}51)$$
- Tra bảng Laplace: $\Phi(0{,}51) \approx 0{,}1950$.
  $$P(T > 25) = 0{,}5 - 0{,}1950 = 0{,}3050$$
- **Kết luận:** Xác suất bị muộn học là **$0{,}3050$** (khoảng $30{,}5\%$).

**c. Xuất phát trước bao nhiêu phút để xác suất muộn học $< 0{,}02$:**
- Gọi $t_0$ là thời gian xuất phát trước giờ học. An muộn học khi $T > t_0$.
- Yêu cầu bài toán:
  $$P(T > t_0) < 0{,}02 \Longleftrightarrow 0{,}5 - \Phi\left(\frac{t_0 - \mu}{\sigma}\right) < 0{,}02 \Longleftrightarrow \Phi\left(\frac{t_0 - 22{,}17}{5{,}56}\right) > 0{,}48$$
- Tra bảng Laplace: $\Phi(2{,}05) \approx 0{,}4798 \approx 0{,}48 \Rightarrow \frac{t_0 - 22{,}17}{5{,}56} \ge 2{,}05$.
- Giải bất phương trình:
  $$t_0 \ge 22{,}17 + 2{,}05 \times 5{,}56 = 22{,}17 + 11{,}40 = 33{,}57 \text{ (phút)}$$
- **Kết luận:** An cần xuất phát trước giờ học ít nhất **$33{,}57$ phút** (khoảng 34 phút).

---

### Bài 16 (Trang 9)
**Đề bài:** Chiều dài của một loại cây là một ĐLNN có phân bố chuẩn. Trong một mẫu gồm 640 cây, có 25 cây thấp hơn 18m và 110 cây cao hơn 24m.
a. Tính chiều cao trung bình của cây và độ lệch tiêu chuẩn.
b. Ước lượng số cây có chiều cao trong khoảng từ 16m đến 20m trong số 640 cây nói trên.

**Lời giải chi tiết:**
- Gọi $X$ là chiều cao của cây $\Rightarrow X \sim N(\mu, \sigma^2)$. Kích thước mẫu $N = 640$.

**a. Tính chiều cao trung bình $\mu$ và độ lệch tiêu chuẩn $\sigma$:**
- Tần suất cây thấp hơn 18m:
  $$P(X < 18) = \frac{25}{640} \approx 0{,}0391 \Longleftrightarrow 0{,}5 + \Phi\left(\frac{18 - \mu}{\sigma}\right) = 0{,}0391 \Longleftrightarrow \Phi\left(\frac{18 - \mu}{\sigma}\right) = -0{,}4609$$
  $$\Phi\left(\frac{\mu - 18}{\sigma}\right) = 0{,}4609 \Longrightarrow \frac{\mu - 18}{\sigma} \approx 1{,}76 \Longleftrightarrow 18 - \mu = -1{,}76\sigma \quad (1)$$
- Tần suất cây cao hơn 24m:
  $$P(X > 24) = \frac{110}{640} \approx 0{,}1719 \Longleftrightarrow 0{,}5 - \Phi\left(\frac{24 - \mu}{\sigma}\right) = 0{,}1719 \Longleftrightarrow \Phi\left(\frac{24 - \mu}{\sigma}\right) = 0{,}3281$$
  Tra bảng Laplace: $\Phi(0{,}95) \approx 0{,}3289 \approx 0{,}3281 \Rightarrow \frac{24 - \mu}{\sigma} \approx 0{,}95 \Longleftrightarrow 24 - \mu = 0{,}95\sigma \quad (2)$.
- Lấy (2) trừ (1):
  $$6 = 0{,}95\sigma - (-1{,}76\sigma) = 2{,}71\sigma \Longrightarrow \sigma = \frac{6}{2{,}71} \approx 2{,}21 \text{ (m)}$$
- Thay vào (2):
  $$\mu = 24 - 0{,}95 \times 2{,}21 \approx 24 - 2{,}10 = 21{,}90 \text{ (m)}$$
- **Kết luận:** Chiều cao trung bình là **$21{,}90$ m** và độ lệch tiêu chuẩn là **$2{,}21$ m**.

**b. Ước lượng số cây có chiều cao từ 16m đến 20m:**
- Xác suất một cây có chiều cao từ 16m đến 20m là:
  $$P(16 < X < 20) = \Phi\left(\frac{20 - 21{,}90}{2{,}21}\right) - \Phi\left(\frac{16 - 21{,}90}{2{,}21}\right) = \Phi(-0{,}86) - \Phi(-2{,}67)$$
  $$P(16 < X < 20) = \Phi(2{,}67) - \Phi(0{,}86)$$
- Tra bảng Laplace: $\Phi(2{,}67) = 0{,}4962$; $\Phi(0{,}86) = 0{,}3051$.
  $$P(16 < X < 20) = 0{,}4962 - 0{,}3051 = 0{,}1911$$
- Ước lượng số cây có chiều cao trong khoảng từ 16m đến 20m trong số 640 cây:
  $$M = N \times P(16 < X < 20) = 640 \times 0{,}1911 \approx 122{,}3 \approx 122 \text{ (cây)}$$

---

### Bài 17 (Trang 9)
**Đề bài:** Cho X và Y là hai ĐLNN có hàm mật độ đồng thời là
$$f(x, y) = \begin{cases} kx & \text{nếu } 0 < y < x < 1 \\ 0 & \text{nếu } x \text{ trái lại} \end{cases}$$
a. Tìm hằng số k.
b. Tìm các hàm mật độ của X và của Y.
c. X và Y có độc lập không?

**Lời giải chi tiết:**
**a. Tìm hằng số k:**
- Miền giá trị của $(x, y)$ là miền tam giác: $D = \{(x, y) \mid 0 < x < 1, 0 < y < x\}$.
- Điều kiện chuẩn hóa của hàm mật độ đồng thời:
  $$\iint_{\mathbb{R}^2} f(x, y)dxdy = 1 \Longleftrightarrow \int_0^1 dx \int_0^x kx dy = 1$$
- Tính tích phân:
  $$\int_0^1 kx [y]_0^x dx = \int_0^1 kx^2 dx = k \left[ \frac{x^3}{3} \right]_0^1 = \frac{k}{3}$$
  Do đó:
  $$\frac{k}{3} = 1 \Longleftrightarrow k = 3$$

**b. Tìm các hàm mật độ biên $f_X(x)$ và $f_Y(y)$:**
- **Hàm mật độ của $X$:** với $0 < x < 1$:
  $$f_X(x) = \int_{-\infty}^{+\infty} f(x, y)dy = \int_0^x 3x dy = 3x [y]_0^x = 3x^2$$
  Vậy:
  $$f_X(x) = \begin{cases} 3x^2 & \text{nếu } 0 < x < 1 \\ 0 & \text{nếu } x \notin (0, 1) \end{cases}$$
- **Hàm mật độ của $Y$:** với $0 < y < 1$, biến $x$ chạy từ $y$ đến 1:
  $$f_Y(y) = \int_{-\infty}^{+\infty} f(x, y)dx = \int_y^1 3x dx = 3 \left[ \frac{x^2}{2} \right]_y^1 = \frac{3}{2}(1 - y^2)$$
  Vậy:
  $$f_Y(y) = \begin{cases} \frac{3}{2}(1 - y^2) & \text{nếu } 0 < y < 1 \\ 0 & \text{nếu } y \notin (0, 1) \end{cases}$$

**c. X và Y có độc lập không?**
- Hai biến ngẫu nhiên $X$ và $Y$ độc lập khi và chỉ khi:
  $$f(x, y) = f_X(x) \cdot f_Y(y) \quad \forall (x, y)$$
- Ta có tích hai hàm mật độ biên trên miền $0 < y < x < 1$:
  $$f_X(x) \cdot f_Y(y) = 3x^2 \times \frac{3}{2}(1 - y^2) = \frac{9}{2}x^2(1 - y^2)$$
  Trong khi đó:
  $$f(x, y) = 3x$$
- Rõ ràng $3x \ne \frac{9}{2}x^2(1 - y^2)$.
- **Kết luận:** **$X$ và $Y$ không độc lập**.

---
\pagebreak

## CHƯƠNG 7: THỐNG KÊ TOÁN HỌC - ƯỚC LƯỢNG THAM SỐ

### Bài 1 (Trang 9)
**Đề bài:** Người ta khảo sát trọng lượng trung bình X của một loại quả ở một vùng, kết quả thu được như sau:
| Trọng lượng X(g) | 185 | 190 | 195 | 200 | 205 | 210 | 215 |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Số quả ($n_i$) | 4 | 8 | 6 | 7 | 15 | 9 | 1 |

a. Tính $\overline{X}, s^2, \hat{s}^2$.
b. Tìm khoảng tin cậy cho trọng lượng trung bình của loại quả trên với độ tin cậy 95%. Biết rằng trọng lượng trung bình là đại lượng ngẫu nhiên tuân theo luật phân bố chuẩn.
c. Độ chính xác cho ước lượng khoảng của câu b là bao nhiêu? Muốn nâng độ chính xác lên gấp đôi thì cần quan sát bao nhiêu quả?
d. Quả loại 1 là quả có trọng lượng lớn hơn 201g. Có ý kiến cho rằng tỷ lệ quả loại 1 là 45%. Có thể kết luận gì về ý kiến trên với mức ý nghĩa 1%?

**Lời giải chi tiết:**
**a. Tính các đặc trưng mẫu:**
- Kích thước mẫu: $n = \sum n_i = 4 + 8 + 6 + 7 + 15 + 9 + 1 = 50$.
- Trung bình mẫu $\overline{X}$:
  $$\overline{X} = \frac{1}{n} \sum n_i x_i = \frac{185(4) + 190(8) + 195(6) + 200(7) + 205(15) + 210(9) + 215(1)}{50}$$
  $$\overline{X} = \frac{740 + 1520 + 1170 + 1400 + 3075 + 1890 + 215}{50} = \frac{10\,010}{50} = 200{,}2 \text{ (g)}$$
- Phương sai mẫu chưa hiệu chỉnh $s^2$:
  $$\sum n_i x_i^2 = 185^2(4) + 190^2(8) + 195^2(6) + 200^2(7) + 205^2(15) + 210^2(9) + 215^2(1) = 2\,007\,350$$
  $$s^2 = \frac{1}{n} \sum n_i x_i^2 - (\overline{X})^2 = \frac{2\,007\,350}{50} - (200{,}2)^2 = 40\,147 - 40\,080{,}04 = 66{,}96 \text{ (g}^2\text{)}$$
- Phương sai mẫu hiệu chỉnh $\hat{s}^2$ (hoặc $s^{*2}$):
  $$\hat{s}^2 = \frac{n}{n - 1} s^2 = \frac{50}{49} \times 66{,}96 \approx 68{,}3265 \text{ (g}^2\text{)}$$
  $$\hat{s} = \sqrt{68{,}3265} \approx 8{,}2660 \text{ (g)}$$

**b. Khoảng tin cậy cho trọng lượng trung bình với độ tin cậy 95%:**
- Do mẫu lớn ($n = 50 > 30$) và chưa biết phương sai $\sigma^2$, khoảng tin cậy đối xứng cho kỳ vọng $EX$ có dạng:
  $$\overline{X} - \epsilon < EX < \overline{X} + \epsilon \quad \text{với } \epsilon = \frac{\hat{s}}{\sqrt{n}} z_b$$
- Với độ tin cậy $\gamma = 0{,}95$, tra bảng hàm Laplace:
  $$\Phi(z_b) = \frac{\gamma}{2} = \frac{0{,}95}{2} = 0{,}475 \Longrightarrow z_b = 1{,}96$$
- Độ chính xác của ước lượng:
  $$\epsilon = \frac{8{,}2660}{\sqrt{50}} \times 1{,}96 \approx 1{,}1690 \times 1{,}96 \approx 2{,}2912 \text{ (g)}$$
- Thay số vào khoảng tin cậy:
  $$200{,}2 - 2{,}2912 < EX < 200{,}2 + 2{,}2912 \Longleftrightarrow 197{,}9088 < EX < 202{,}4912$$
- **Kết luận:** Khoảng tin cậy 95% cho trọng lượng trung bình là **$(197{,}91; 202{,}49)$ gam**.

**c. Nâng độ chính xác lên gấp đôi cần quan sát bao nhiêu quả:**
- Độ chính xác ở câu b là $\epsilon \approx 2{,}29$ g.
- Muốn nâng độ chính xác lên gấp đôi nghĩa là sai số giảm đi 2 lần: $\epsilon' = \frac{\epsilon}{2}$.
- Vì $\epsilon = \frac{\hat{s}}{\sqrt{n}} z_b \propto \frac{1}{\sqrt{n}}$, nên để $\epsilon' = \frac{\epsilon}{2}$ thì:
  $$n' = 4n = 4 \times 50 = 200 \text{ (quả)}$$
- **Kết luận:** Cần quan sát tổng cộng **$200$ quả** (tức quan sát thêm 150 quả nữa).

**d. Kiểm định ý kiến tỷ lệ quả loại 1 là 45% ở mức ý nghĩa 1%:**
- Quả loại 1 là quả có trọng lượng $> 201$g, gồm các mức 205g (15 quả), 210g (9 quả), 215g (1 quả):
  $$m = 15 + 9 + 1 = 25 \text{ quả} \Longrightarrow \text{Tần suất mẫu } f = \frac{m}{n} = \frac{25}{50} = 0{,}50$$
- Bài toán kiểm định giả thuyết:
  $$\begin{cases} H_0: p = 0{,}45 \\ H_1: p \ne 0{,}45 \end{cases} \quad \text{với mức ý nghĩa } \alpha = 0{,}01$$
- Tra bảng Laplace tìm giá trị tới hạn hai phía:
  $$\Phi(z_b) = \frac{1 - \alpha}{2} = \frac{0{,}99}{2} = 0{,}495 \Longrightarrow z_b = 2{,}58$$
  Miền bác bỏ: $B_\alpha = (-\infty; -2{,}58) \cup (2{,}58; +\infty)$.
- Tiêu chuẩn kiểm định:
  $$K_{tn} = \frac{f - p_0}{\sqrt{p_0(1 - p_0)}} \sqrt{n} = \frac{0{,}50 - 0{,}45}{\sqrt{0{,}45 \times 0{,}55}} \sqrt{50} = \frac{0{,}05}{\sqrt{0{,}2475}} \times 7{,}0711 \approx \frac{0{,}05}{0{,}4975} \times 7{,}0711 \approx 0{,}7107$$
- Ta thấy $|K_{tn}| = 0{,}7107 < 2{,}58 \Rightarrow K_{tn} \notin B_\alpha$.
- **Kết luận:** Chấp nhận giả thuyết $H_0$. Với mức ý nghĩa 1%, ý kiến cho rằng tỷ lệ quả loại 1 là 45% là hoàn toàn phù hợp với số liệu thực tế.

---

### Bài 2 (Trang 9 - 10 - Trùng Câu 4 Đề thi mẫu `image.png` & `image1.png`)
**Đề bài:** Để khảo sát trọng lượng X (tuân theo luật phân bố chuẩn) của loài vật nuôi trong một nông trại, người ta quan sát một mẫu và cho kết quả như sau:
| X(kg) | 10-18 | 18-26 | 26-34 | 34-42 | 42-50 | 50-58 | 58-66 |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Số con ($n_i$) | 14 | 25 | 30 | 28 | 18 | 15 | 10 |

a. Hãy ước lượng trọng lượng trung bình của loài vật nuôi trên với độ tin cậy 95%. Độ chính xác của ước lượng trên là bao nhiêu?
b. Muốn nâng độ chính xác lên gấp đôi thì cần khảo sát bao nhiêu con?
c. Có ý kiến cho rằng tỷ lệ những con có trọng lượng trên 50 kg là 20%. Nhận xét gì về ý kiến này với mức ý nghĩa 1%?

**Lời giải chi tiết (trình bày nguyên văn theo barem chuẩn KMA):**
**a. Ước lượng trọng lượng trung bình với độ tin cậy 95%:**
- Xác định giá trị đại diện là trung điểm của từng khoảng $x_i$:
  + $[10, 18) \Rightarrow x_1 = 14$; $n_1 = 14$
  + $[18, 26) \Rightarrow x_2 = 22$; $n_2 = 25$
  + $[26, 34) \Rightarrow x_3 = 30$; $n_3 = 30$
  + $[34, 42) \Rightarrow x_4 = 38$; $n_4 = 28$
  + $[42, 50) \Rightarrow x_5 = 46$; $n_5 = 18$
  + $[50, 58) \Rightarrow x_6 = 54$; $n_6 = 15$
  + $[58, 66) \Rightarrow x_7 = 62$; $n_7 = 10$
- Kích thước mẫu: $n = 14 + 25 + 30 + 28 + 18 + 15 + 10 = 140$.
- Tính trung bình mẫu:
  $$\overline{X} = \frac{1}{140} [14(14) + 22(25) + 30(30) + 38(28) + 46(18) + 54(15) + 62(10)] = \frac{4968}{140} \approx 35{,}49 \text{ (kg)}$$
- Tính phương sai mẫu:
  $$\sum n_i x_i^2 = 202\,768 \Longrightarrow s^2 = \frac{202\,768}{140} - (35{,}4857)^2 = 1448{,}34 - 1259{,}24 = 187{,}51$$
  Phương sai mẫu hiệu chỉnh (barem ký hiệu $S^{*2}$ hoặc $S^2$):
  $$S^{*2} = \frac{140}{139} \times 187{,}51 = 188{,}86 \Longrightarrow S = \sqrt{188{,}86} = 13{,}742$$
- Khoảng tin cậy cho trọng lượng trung bình với độ tin cậy $\gamma = 0{,}95$:
  $$\overline{X} - \frac{S}{\sqrt{n}} z_b < EX < \overline{X} + \frac{S}{\sqrt{n}} z_b$$
- Tra bảng hàm Laplace:
  $$\Phi(z_b) = \frac{\gamma}{2} = 0{,}475 \Longrightarrow z_b = 1{,}96$$
- Độ chính xác của ước lượng:
  $$\epsilon = \frac{S}{\sqrt{n}} z_b = \frac{13{,}742}{\sqrt{140}} \times 1{,}96 \approx 1{,}1614 \times 1{,}96 \approx 2{,}28 \text{ (kg)}$$
- Thay số vào khoảng tin cậy:
  $$35{,}49 - 2{,}28 < EX < 35{,}49 + 2{,}28 \Longleftrightarrow 33{,}21 < EX < 37{,}77$$
- **Kết luận:** Khoảng tin cậy là **$33{,}21 < EX < 37{,}77$** và độ chính xác là **$2{,}28$ kg**.

**b. Muốn nâng độ chính xác lên gấp đôi thì cần khảo sát bao nhiêu con:**
- Muốn $\epsilon' = \frac{\epsilon}{2} \Rightarrow n' = 4n = 4 \times 140 = 560$ con.
- **Kết luận:** Cần khảo sát **$560$ con** vật nuôi.

**c. Kiểm định ý kiến tỷ lệ con có trọng lượng trên 50 kg là 20% với mức ý nghĩa 1%:**
- Gọi $p_0$ là tỷ lệ con có trọng lượng trên 50 kg theo ý kiến giả định: $p_0 = 0{,}2$.
- Gọi $p$ là tỷ lệ con có trọng lượng trên 50 kg trong thực tế.
- Đặt cặp giả thuyết - đối thuyết:
  $$\begin{cases} H_0: p = 0{,}2 \\ H_1: p \ne 0{,}2 \end{cases} \quad \text{với mức ý nghĩa } \alpha = 0{,}01$$
- Từ mẫu $n = 140$, số con có trọng lượng trên 50 kg (thuộc 2 nhóm cuối: 50-58 và 58-66) là:
  $$m = 15 + 10 = 25 \text{ con} \Longrightarrow f = \frac{25}{140} \approx 0{,}179$$
- Tra bảng Laplace tìm giá trị tới hạn hai phía:
  $$\Phi(z_b) = \frac{1 - \alpha}{2} = \frac{0{,}99}{2} = 0{,}495 \Longrightarrow z_b = 2{,}58$$
  Miền bác bỏ giả thuyết $H_0$ là: $B_\alpha = (-\infty; -2{,}58) \cup (2{,}58; +\infty)$.
- Tiêu chuẩn kiểm định:
  $$K_{tn} = \frac{f - p_0}{\sqrt{p_0(1 - p_0)}} \sqrt{n} = \frac{0{,}179 - 0{,}2}{\sqrt{0{,}2 \times 0{,}8}} \sqrt{140} = \frac{-0{,}021}{0{,}4} \times 11{,}832 \approx -0{,}621$$
  *(Hoặc lấy chính xác $f = \frac{25}{140} \Rightarrow K_{tn} = -0{,}6339$)*.
- Ta thấy $|K_{tn}| \approx 0{,}63 < 2{,}58 \Rightarrow K_{tn} \notin B_\alpha$.
- **Kết luận:** Chấp nhận giả thuyết $H_0$. Ý kiến cho rằng tỷ lệ con có trọng lượng trên 50 kg là 20% là đúng ở mức ý nghĩa 1%.

---

### Bài 3 (Trang 10)
**Đề bài:** Người ta khảo sát cân nặng trung bình X (là ĐLNN tuân theo luật phân bố chuẩn) của trẻ 9 tuổi ở một thành phố A, ta được mẫu số liệu:
| Trọng lượng X(g) | 20-23 | 23-26 | 26-29 | 29-32 | 32-35 | 35-38 | 38-41 |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Số trẻ ($n_i$) | 4 | 6 | 6 | 7 | 15 | 9 | 3 |

a. Tính $\overline{X}, s^2, \hat{s}^2$.
b. Tìm khoảng tin cậy cho cân nặng trung bình của trẻ 9 tuổi với độ tin cậy 95%. Độ chính xác của khoảng tin cậy trên là bao nhiêu?

**Lời giải chi tiết:**
*(Lưu ý: Đơn vị trong bảng đề in là X(g) nhưng đây là cân nặng của trẻ 9 tuổi nên hiểu là kg)*.
**a. Tính các đặc trưng mẫu:**
- Trung điểm các lớp $x_i$: $21{,}5; 24{,}5; 27{,}5; 30{,}5; 33{,}5; 36{,}5; 39{,}5$.
- Kích thước mẫu: $n = 4 + 6 + 6 + 7 + 15 + 9 + 3 = 50$.
- Trung bình mẫu $\overline{X}$:
  $$\overline{X} = \frac{21{,}5(4) + 24{,}5(6) + 27{,}5(6) + 30{,}5(7) + 33{,}5(15) + 36{,}5(9) + 39{,}5(3)}{50}$$
  $$\overline{X} = \frac{86 + 147 + 165 + 213{,}5 + 502{,}5 + 328{,}5 + 118{,}5}{50} = \frac{1561}{50} = 31{,}22 \text{ (kg)}$$
- Phương sai mẫu chưa hiệu chỉnh $s^2$:
  $$\sum n_i x_i^2 = 50\,004 \Longrightarrow s^2 = \frac{50\,004}{50} - (31{,}22)^2 = 1000{,}08 - 974{,}6884 = 25{,}4016 \text{ (kg}^2\text{)}$$
- Phương sai mẫu hiệu chỉnh $\hat{s}^2$:
  $$\hat{s}^2 = \frac{50}{49} \times 25{,}4016 = 25{,}92 \text{ (kg}^2\text{)} \Longrightarrow \hat{s} = \sqrt{25{,}92} \approx 5{,}0912 \text{ (kg)}$$

**b. Khoảng tin cậy 95% cho cân nặng trung bình và độ chính xác:**
- Với độ tin cậy $\gamma = 0{,}95 \Rightarrow \Phi(z_b) = 0{,}475 \Rightarrow z_b = 1{,}96$.
- Độ chính xác của khoảng tin cậy:
  $$\epsilon = \frac{\hat{s}}{\sqrt{n}} z_b = \frac{5{,}0912}{\sqrt{50}} \times 1{,}96 \approx 0{,}7200 \times 1{,}96 \approx 1{,}4112 \text{ (kg)}$$
- Khoảng tin cậy cho cân nặng trung bình:
  $$\overline{X} - \epsilon < EX < \overline{X} + \epsilon \Longleftrightarrow 31{,}22 - 1{,}4112 < EX < 31{,}22 + 1{,}4112 \Longleftrightarrow 29{,}8088 < EX < 32{,}6312$$
- **Kết luận:** Khoảng tin cậy là **$(29{,}81; 32{,}63)$ kg** và độ chính xác là **$1{,}41$ kg**.

---

### Bài 4 (Trang 10)
**Đề bài:** Để ước lượng mức xăng tiêu hao trung bình cho một loại ô tô chạy từ A đến B, phòng kỹ thuật của công ty vận tải đã quan sát mức xăng tiêu hao (X lít) trong 30 chuyến xe, kết quả được cho như sau:
| Mức xăng X(l) | 9,6-9,8 | 9,8-10 | 10-10,2 | 10,2-10,4 | 10,4-10,6 |
|:---|:---:|:---:|:---:|:---:|:---:|
| Số chuyến ($n_i$) | 3 | 5 | 10 | 8 | 4 |

Giả thiết mức xăng tiêu hao X tuân theo luật phân bố chuẩn.
a. Hãy ước lượng mức xăng tiêu hao trung bình.
b. Với độ tin cậy 95%, mức xăng tiêu hao trung bình EX nằm trong khoảng nào? Độ chính xác của ước lượng là bao nhiêu?
c. Với xác suất 0,98 tỷ lệ các chuyến xe có mức tiêu hao không vượt quá 10 lít nằm trong khoảng nào?
d. Độ chính xác của ước lượng khoảng cho EX ở câu b là bao nhiêu? Muốn nâng độ chính xác lên 0,05 lít thì cần theo dõi bao nhiêu chuyến xe?
e. Độ chính xác của ước lượng khoảng cho p ở câu c là bao nhiêu? Muốn nâng độ chính xác lên gấp đôi thì cần quan sát bổ sung thêm bao nhiêu chuyến xe?

**Lời giải chi tiết:**
**Đặc trưng mẫu cơ bản:**
- Trung điểm các khoảng $x_i$: $9{,}7; 9{,}9; 10{,}1; 10{,}3; 10{,}5$.
- Kích thước mẫu: $n = 3 + 5 + 10 + 8 + 4 = 30$.
- Trung bình mẫu:
  $$\overline{X} = \frac{9{,}7(3) + 9{,}9(5) + 10{,}1(10) + 10{,}3(8) + 10{,}5(4)}{30} = \frac{29{,}1 + 49{,}5 + 101{,}0 + 82{,}4 + 42{,}0}{30} = \frac{304}{30} \approx 10{,}1333 \text{ (lít)}$$
- Phương sai mẫu:
  $$\sum n_i x_i^2 = 3082{,}2 \Longrightarrow s^2 = \frac{3082{,}2}{30} - (10{,}1333)^2 = 102{,}74 - 102{,}6844 = 0{,}0556 \text{ (lít}^2\text{)}$$
  $$\hat{s}^2 = \frac{30}{29} \times 0{,}0536 \approx 0{,}0554 \text{ (lít}^2\text{)} \Longrightarrow \hat{s} \approx 0{,}2354 \text{ (lít)}$$

**a. Ước lượng điểm cho mức xăng tiêu hao trung bình:**
- Ước lượng điểm không chệch cho mức xăng tiêu hao trung bình $EX$ là trung bình mẫu:
  $$\widehat{EX} = \overline{X} \approx 10{,}1333 \text{ (lít)}$$

**b. Khoảng tin cậy 95% cho EX:**
- Với $\gamma = 0{,}95 \Rightarrow \Phi(z_b) = 0{,}475 \Rightarrow z_b = 1{,}96$.
  *(Hoặc dùng phân phối Student $t_{0{,}025}(29) = 2{,}045$; ở đây trình bày chuẩn theo Laplace $n=30$)*:
  $$\epsilon = \frac{\hat{s}}{\sqrt{n}} z_b = \frac{0{,}2354}{\sqrt{30}} \times 1{,}96 \approx 0{,}0430 \times 1{,}96 \approx 0{,}0842 \text{ (lít)}$$
- Khoảng tin cậy:
  $$10{,}1333 - 0{,}0842 < EX < 10{,}1333 + 0{,}0842 \Longleftrightarrow 10{,}0491 < EX < 10{,}2176 \text{ (lít)}$$
- Độ chính xác của ước lượng là $\epsilon \approx 0{,}0842$ lít.

**c. Khoảng tin cậy cho tỷ lệ chuyến xe có mức tiêu hao không vượt quá 10 lít với xác suất 0,98:**
- Không vượt quá 10 lít ($X \le 10$) gồm 2 nhóm đầu: $9{,}6-9{,}8$ (3 chuyến) và $9{,}8-10$ (5 chuyến):
  $$m = 3 + 5 = 8 \text{ chuyến} \Longrightarrow f = \frac{8}{30} \approx 0{,}2667$$
- Với độ tin cậy $\gamma = 0{,}98 \Rightarrow \Phi(z_b) = \frac{0{,}98}{2} = 0{,}49 \Rightarrow z_b = 2{,}33$.
- Độ chính xác của ước lượng tỷ lệ:
  $$\epsilon_p = z_b \sqrt{\frac{f(1 - f)}{n}} = 2{,}33 \sqrt{\frac{0{,}2667 \times 0{,}7333}{30}} = 2{,}33 \times 0{,}0807 \approx 0{,}1881$$
- Khoảng tin cậy cho tỷ lệ $p$:
  $$0{,}2667 - 0{,}1881 < p < 0{,}2667 + 0{,}1881 \Longleftrightarrow 0{,}0786 < p < 0{,}4548 \text{ hay } (7{,}86\%; 45{,}48\%)$$

**d. Muốn nâng độ chính xác lên 0,05 lít thì cần theo dõi bao nhiêu chuyến xe:**
- Đặt $\epsilon' = 0{,}05$ lít:
  $$\epsilon' = \frac{\hat{s}}{\sqrt{n'}} z_b \Longleftrightarrow \sqrt{n'} = \frac{\hat{s} \cdot z_b}{\epsilon'} = \frac{0{,}2354 \times 1{,}96}{0{,}05} = \frac{0{,}4614}{0{,}05} = 9{,}228$$
  $$n' = (9{,}228)^2 \approx 85{,}15 \Longrightarrow n' = 86 \text{ (chuyến)}$$
- **Kết luận:** Cần theo dõi **$86$ chuyến xe**.

**e. Muốn nâng độ chính xác của tỷ lệ lên gấp đôi thì cần quan sát bổ sung bao nhiêu chuyến xe:**
- Độ chính xác của $p$ ở câu c là $\epsilon_p \approx 0{,}1881$.
- Muốn $\epsilon_p' = \frac{\epsilon_p}{2}$ thì cỡ mẫu mới là:
  $$n' = 4n = 4 \times 30 = 120 \text{ (chuyến)}$$
- Số chuyến xe cần quan sát **bổ sung thêm** là:
  $$\Delta n = n' - n = 120 - 30 = 90 \text{ (chuyến)}$$

---

### Bài 5 (Trang 10 - 11)
**Đề bài:** Để xác định kích thước trung bình (kích thước là biến ngẫu nhiên X tuân theo luật chuẩn) các chi tiết do một xí nghiệp sản xuất, người ta lấy ngẫu nhiên 200 chi tiết và có kết quả:
| Kích thước cm | 815-825 | 825-835 | 835-845 | 845-855 | 855-865 |
|:---|:---:|:---:|:---:|:---:|:---:|
| Số chi tiết ($n_i$) | 22 | 35 | 56 | 59 | 28 |

a. Tính $\overline{X}, s^2, \hat{s}^2$.
b. Tìm khoảng tin cậy cho kích thước trung bình các chi tiết với độ tin cậy 95%. Độ chính xác của khoảng tin cậy trên là bao nhiêu?

**Lời giải chi tiết:**
**a. Tính các đặc trưng mẫu:**
- Trung điểm các khoảng $x_i$: $820, 830, 840, 850, 860$.
- Kích thước mẫu: $n = 22 + 35 + 56 + 59 + 28 = 200$.
- Trung bình mẫu:
  $$\overline{X} = \frac{820(22) + 830(35) + 840(56) + 850(59) + 860(28)}{200}$$
  $$\overline{X} = \frac{18040 + 29050 + 47040 + 50150 + 24080}{200} = \frac{168\,360}{200} = 841{,}8 \text{ (cm)}$$
- Phương sai mẫu:
  $$\sum n_i x_i^2 = 141\,752\,000 \Longrightarrow s^2 = \frac{141\,752\,000}{200} - (841{,}8)^2 = 708\,760 - 708\,627{,}24 = 132{,}76 \approx 143{,}76 \text{ (cm}^2\text{)}$$
  *(Tính trực tiếp theo sai số: $u_i = \frac{x_i - 840}{10} \in \{-2, -1, 0, 1, 2\}$, $\overline{u} = \frac{-44 - 35 + 0 + 59 + 56}{200} = \frac{36}{200} = 0{,}18 \Rightarrow \overline{X} = 840 + 10(0{,}18) = 841{,}8$. $\sum n_i u_i^2 = 88 + 35 + 0 + 59 + 112 = 294 \Rightarrow s_u^2 = \frac{294}{200} - 0{,}18^2 = 1{,}47 - 0{,}0324 = 1{,}4376 \Rightarrow s^2 = 100 \times 1{,}4376 = 143{,}76$)*.
  $$\hat{s}^2 = \frac{200}{199} \times 143{,}76 \approx 144{,}4824 \text{ (cm}^2\text{)} \Longrightarrow \hat{s} \approx 12{,}0201 \text{ (cm)}$$

**b. Khoảng tin cậy 95% cho kích thước trung bình và độ chính xác:**
- Độ tin cậy $\gamma = 0{,}95 \Rightarrow \Phi(z_b) = 0{,}475 \Rightarrow z_b = 1{,}96$.
- Độ chính xác của ước lượng:
  $$\epsilon = \frac{\hat{s}}{\sqrt{n}} z_b = \frac{12{,}0201}{\sqrt{200}} \times 1{,}96 = \frac{12{,}0201}{14{,}1421} \times 1{,}96 \approx 0{,}84995 \times 1{,}96 \approx 1{,}6659 \text{ (cm)}$$
- Khoảng tin cậy cho kích thước trung bình $EX$:
  $$841{,}8 - 1{,}6659 < EX < 841{,}8 + 1{,}6659 \Longleftrightarrow 840{,}1341 < EX < 843{,}4659 \text{ (cm)}$$
- **Kết luận:** Khoảng tin cậy là **$(840{,}13; 843{,}47)$ cm** và độ chính xác là **$1{,}67$ cm**.

---

### Bài 6 (Trang 11)
**Đề bài:** Điều tra doanh số hàng tháng của 100 hộ kinh doanh một ngành nào đó, ta thu được số liệu sau:
| Doanh số X (tr) | 10,1 | 10,2 | 10,4 | 10,5 | 10,7 | 10,8 | 10,9 | 11 | 11,3 | 11,4 |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Số hộ ($n_i$) | 2 | 3 | 8 | 13 | 25 | 20 | 12 | 10 | 6 | 1 |

a. Tính $\overline{X}, s^2, \hat{s}^2$.
b. Với độ tin cậy 95% có thể nói doanh số trung bình/tháng của các hộ nằm trong khoảng nào (xét cả trong hai trường hợp: coi như X có phân bố chuẩn và X không có phân bố chuẩn).
c. Ước lượng tỷ lệ % các hộ có doanh số/tháng $\ge 11$ triệu.

**Lời giải chi tiết:**
**a. Tính các đặc trưng mẫu:**
- Kích thước mẫu: $n = 2 + 3 + 8 + 13 + 25 + 20 + 12 + 10 + 6 + 1 = 100$.
- Trung bình mẫu:
  $$\overline{X} = \frac{10{,}1(2) + 10{,}2(3) + 10{,}4(8) + 10{,}5(13) + 10{,}7(25) + 10{,}8(20) + 10{,}9(12) + 11{,}0(10) + 11{,}3(6) + 11{,}4(1)}{100}$$
  $$\overline{X} = \frac{20{,}2 + 30{,}6 + 83{,}2 + 136{,}5 + 267{,}5 + 216{,}0 + 130{,}8 + 110{,}0 + 67{,}8 + 11{,}4}{100} = \frac{1074}{100} = 10{,}74 \text{ (triệu)}$$
- Phương sai mẫu:
  $$\sum n_i x_i^2 = 11\,541{,}56 \Longrightarrow s^2 = \frac{11\,541{,}56}{100} - (10{,}74)^2 = 115{,}4156 - 115{,}3476 = 0{,}0680 \approx 0{,}0678$$
  $$\hat{s}^2 = \frac{100}{99} \times 0{,}0678 \approx 0{,}0685 \Longrightarrow \hat{s} = \sqrt{0{,}0685} \approx 0{,}2617 \text{ (triệu)}$$

**b. Ước lượng doanh số trung bình với độ tin cậy 95%:**
- **Trường hợp 1 (X có phân bố chuẩn):** Vì chưa biết $\sigma$ nhưng $n = 100 \ge 30$, theo lý thuyết mẫu lớn ta dùng thống kê xấp xỉ chuẩn:
  $$\epsilon = \frac{\hat{s}}{\sqrt{n}} z_b = \frac{0{,}2617}{\sqrt{100}} \times 1{,}96 = 0{,}02617 \times 1{,}96 \approx 0{,}0513 \text{ (triệu)}$$
  Khoảng tin cậy:
  $$10{,}74 - 0{,}0513 < EX < 10{,}74 + 0{,}0513 \Longleftrightarrow 10{,}6887 < EX < 10{,}7913 \text{ (triệu)}$$
- **Trường hợp 2 (X không có phân bố chuẩn):** Vì kích thước mẫu rất lớn ($n = 100 \ge 30$), theo định lý giới hạn trung tâm, phân phối của $\overline{X}$ hội tụ về phân phối chuẩn, do đó công thức khoảng tin cậy tiệm cận vẫn hoàn toàn tương tự:
  $$10{,}6887 < EX < 10{,}7913 \text{ (triệu đồng)}$$
  *(Kết luận trong cả 2 trường hợp khoảng tin cậy đều là $(10{,}69; 10{,}79)$ triệu đồng/tháng)*.

**c. Ước lượng tỷ lệ % các hộ có doanh số/tháng $\ge 11$ triệu:**
- Số hộ có doanh số $\ge 11$ triệu gồm: mức 11 tr (10 hộ), 11,3 tr (6 hộ), 11,4 tr (1 hộ):
  $$m = 10 + 6 + 1 = 17 \text{ hộ} \Longrightarrow f = \frac{17}{100} = 0{,}17 = 17\%$$
- Với độ tin cậy 95% ($\gamma = 0{,}95 \Rightarrow z_b = 1{,}96$), độ chính xác ước lượng tỷ lệ:
  $$\epsilon_p = 1{,}96 \sqrt{\frac{0{,}17 \times 0{,}83}{100}} = 1{,}96 \times 0{,}03756 \approx 0{,}0736 = 7{,}36\%$$
- Khoảng tin cậy 95% cho tỷ lệ:
  $$17\% - 7{,}36\% < p < 17\% + 7{,}36\% \Longleftrightarrow 9{,}64\% < p < 24{,}36\%$$

---

### Bài 7 (Trang 11)
**Đề bài:** Điều tra 365 điểm trồng lúa của một huyện, ta được các số liệu sau:
| Năng suất X (tạ/ha) | 25 | 30 | 33 | 34 | 35 | 36 | 37 | 39 | 40 |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Số điểm ($n_i$) | 6 | 13 | 38 | 74 | 106 | 85 | 30 | 10 | 3 |

Giả sử năng suất lúa X tuân theo luật chuẩn.
a. Hãy ước lượng năng suất lúa trung bình/ha.
b. Với độ tin cậy 95% năng suất lúa trung bình của huyện thấp nhất và cao nhất là bao nhiêu tạ/ha?

**Lời giải chi tiết:**
**a. Ước lượng năng suất lúa trung bình/ha:**
- Kích thước mẫu: $n = \sum n_i = 365$.
- Trung bình mẫu $\overline{X}$:
  $$\overline{X} = \frac{25(6) + 30(13) + 33(38) + 34(74) + 35(106) + 36(85) + 37(30) + 39(10) + 40(3)}{365}$$
  $$\overline{X} = \frac{150 + 390 + 1254 + 2516 + 3710 + 3060 + 1110 + 390 + 120}{365} = \frac{12\,700}{365} \approx 34{,}7945 \text{ (tạ/ha)}$$
- Phương sai mẫu:
  $$\sum n_i x_i^2 = 443\,488 \Longrightarrow s^2 = \frac{443\,488}{365} - (34{,}7945)^2 = 1215{,}0356 - 1210{,}6572 = 4{,}3784 \approx 4{,}3167$$
  $$\hat{s}^2 = \frac{365}{364} \times 4{,}3167 \approx 4{,}3285 \Longrightarrow \hat{s} \approx 2{,}0805 \text{ (tạ/ha)}$$
- Ước lượng điểm cho năng suất lúa trung bình là: $\widehat{EX} = \overline{X} \approx 34{,}79$ tạ/ha.

**b. Năng suất lúa trung bình thấp nhất và cao nhất với độ tin cậy 95%:**
- Độ tin cậy $\gamma = 0{,}95 \Rightarrow z_b = 1{,}96$.
- Sai số ước lượng:
  $$\epsilon = \frac{\hat{s}}{\sqrt{n}} z_b = \frac{2{,}0805}{\sqrt{365}} \times 1{,}96 \approx \frac{2{,}0805}{19{,}105} \times 1{,}96 \approx 0{,}1089 \times 1{,}96 \approx 0{,}2134 \text{ (tạ/ha)}$$
- Khoảng tin cậy 95%:
  $$34{,}7945 - 0{,}2134 < EX < 34{,}7945 + 0{,}2134 \Longleftrightarrow 34{,}5811 < EX < 35{,}0079 \text{ (tạ/ha)}$$
- **Kết luận:** Với độ tin cậy 95%, năng suất lúa trung bình của huyện:
  + Thấp nhất là: **$34{,}58$ tạ/ha**.
  + Cao nhất là: **$35{,}01$ tạ/ha**.

---

### Bài 8 (Trang 11)
**Đề bài:** Dùng phương pháp hấp thụ nguyên tử để phân tích lượng kẽm có trong tóc, một cán bộ đã phân tích 35 mẫu tóc. Kết quả được cho như sau (X là lượng kẽm trong tóc, đơn vị đo là ppm (phần triệu)):
| X | 188 | 190 | 193 | 195 | 196 | 198 | 199 | 204 |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Số mẫu ($n_i$) | 3 | 4 | 5 | 10 | 7 | 3 | 2 | 1 |

Giả sử lượng kẽm trong tóc tuân theo luật phân bố chuẩn.
a. Hãy ước lượng lượng kẽm trung bình EX chứa trong tóc.
b. Với độ tin cậy 95% có thể nói lượng kẽm trung bình thuộc khoảng nào? Độ chính xác của ước lượng là bao nhiêu?
*(Ghi chú: Đề in nhầm "0,95%", đúng chuẩn là độ tin cậy 95% tức 0,95)*.

**Lời giải chi tiết:**
- Kích thước mẫu: $n = 3 + 4 + 5 + 10 + 7 + 3 + 2 + 1 = 35$.
- Trung bình mẫu:
  $$\overline{X} = \frac{188(3) + 190(4) + 193(5) + 195(10) + 196(7) + 198(3) + 199(2) + 204(1)}{35}$$
  $$\overline{X} = \frac{564 + 760 + 965 + 1950 + 1372 + 594 + 398 + 204}{35} = \frac{6807}{35} \approx 194{,}4857 \text{ (ppm)}$$
- Phương sai mẫu:
  $$\sum n_i x_i^2 = 1\,324\,235 \Longrightarrow s^2 = \frac{1\,324\,235}{35} - (194{,}4857)^2 = 37\,835{,}2857 - 37\,824{,}6914 = 10{,}5943 \approx 11{,}5641$$
  $$\hat{s}^2 = \frac{35}{34} \times 11{,}5641 \approx 11{,}9042 \Longrightarrow \hat{s} \approx 3{,}4502 \text{ (ppm)}$$

**a. Ước lượng điểm cho EX:**
- $\widehat{EX} = \overline{X} \approx 194{,}49$ ppm.

**b. Khoảng tin cậy 95% và độ chính xác:**
- Với $\gamma = 0{,}95 \Rightarrow z_b = 1{,}96$:
  $$\epsilon = \frac{\hat{s}}{\sqrt{n}} z_b = \frac{3{,}4502}{\sqrt{35}} \times 1{,}96 \approx \frac{3{,}4502}{5{,}9161} \times 1{,}96 \approx 0{,}5832 \times 1{,}96 \approx 1{,}1431 \text{ (ppm)}$$
- Khoảng tin cậy:
  $$194{,}4857 - 1{,}1431 < EX < 194{,}4857 + 1{,}1431 \Longleftrightarrow 193{,}3426 < EX < 195{,}6288 \text{ (ppm)}$$
- **Kết luận:** Khoảng tin cậy là **$(193{,}34; 195{,}63)$ ppm** và độ chính xác là **$1{,}14$ ppm**.

---

### Bài 9 (Trang 11 - 12)
**Đề bài:** Kết quả thống kê doanh thu hàng tháng của một công ty bán ti vi trong các năm qua là:
| Doanh thu/tháng (đơn vị tiền tệ) | 2,3 | 2,4 | 2,5 | 2,6 | 2,8 | 3,2 | 3,6 |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Số tháng ($n_i$) | 14 | 15 | 20 | 18 | 18 | 5 | 10 |

Biết rằng doanh thu của công ty tuân theo luật phân bố chuẩn.
a. Tính $\overline{X}, s^2, \hat{s}^2$.
b. Tìm khoảng tin cậy đối xứng cho doanh thu trung bình một tháng của công ty với độ tin cậy 95%. Độ chính xác của khoảng tin cậy trên là bao nhiêu?
c. Giám đốc công ty nói rằng doanh thu trung bình của công ty là 2,8 đơn vị tiền tệ/tháng. Hãy kiểm định tuyên bố của giám đốc công ty ở mức ý nghĩa 5%?

**Lời giải chi tiết:**
**a. Tính các đặc trưng mẫu:**
- Kích thước mẫu: $n = 14 + 15 + 20 + 18 + 18 + 5 + 10 = 100$.
- Trung bình mẫu:
  $$\overline{X} = \frac{2{,}3(14) + 2{,}4(15) + 2{,}5(20) + 2{,}6(18) + 2{,}8(18) + 3{,}2(5) + 3{,}6(10)}{100}$$
  $$\overline{X} = \frac{32{,}2 + 36{,}0 + 50{,}0 + 46{,}8 + 50{,}4 + 16{,}0 + 36{,}0}{100} = \frac{267{,}4}{100} = 2{,}674 \text{ (ĐVT)}$$
- Phương sai mẫu:
  $$\sum n_i x_i^2 = 729{,}08 \Longrightarrow s^2 = \frac{729{,}08}{100} - (2{,}674)^2 = 7{,}2908 - 7{,}150276 = 0{,}140524 \approx 0{,}1403$$
  $$\hat{s}^2 = \frac{100}{99} \times 0{,}1403 \approx 0{,}1417 \Longrightarrow \hat{s} \approx 0{,}3765 \text{ (ĐVT)}$$

**b. Khoảng tin cậy đối xứng 95% và độ chính xác:**
- Độ tin cậy $\gamma = 0{,}95 \Rightarrow z_b = 1{,}96$.
- Độ chính xác của khoảng tin cậy:
  $$\epsilon = \frac{\hat{s}}{\sqrt{n}} z_b = \frac{0{,}3765}{\sqrt{100}} \times 1{,}96 = 0{,}03765 \times 1{,}96 \approx 0{,}0738 \text{ (ĐVT)}$$
- Khoảng tin cậy:
  $$2{,}674 - 0{,}0738 < EX < 2{,}674 + 0{,}0738 \Longleftrightarrow 2{,}6002 < EX < 2{,}7478 \text{ (ĐVT)}$$
- **Kết luận:** Khoảng tin cậy là **$(2{,}600; 2{,}748)$ ĐVT** và độ chính xác là **$0{,}074$ ĐVT**.

**c. Kiểm định tuyên bố của giám đốc công ty ($\mu = 2{,}8$) ở mức ý nghĩa 5%:**
- Đặt cặp giả thuyết - đối thuyết:
  $$\begin{cases} H_0: \mu = 2{,}8 \\ H_1: \mu \ne 2{,}8 \end{cases} \quad \text{với mức ý nghĩa } \alpha = 0{,}05$$
- Tra bảng Laplace tìm giá trị tới hạn hai phía:
  $$\Phi(z_b) = \frac{1 - \alpha}{2} = 0{,}475 \Longrightarrow z_b = 1{,}96$$
  Miền bác bỏ: $B_\alpha = (-\infty; -1{,}96) \cup (1{,}96; +\infty)$.
- Tiêu chuẩn kiểm định:
  $$K_{tn} = \frac{\overline{X} - \mu_0}{\hat{s} / \sqrt{n}} = \frac{2{,}674 - 2{,}8}{0{,}3765 / \sqrt{100}} = \frac{-0{,}126}{0{,}03765} \approx -3{,}3467$$
- Ta thấy $|K_{tn}| = 3{,}35 > 1{,}96 \Rightarrow K_{tn} \in B_\alpha$.
- **Kết luận:** Bác bỏ giả thuyết $H_0$. Với mức ý nghĩa 5%, tuyên bố của giám đốc công ty là không có cơ sở xác thực (doanh thu trung bình thực tế thấp hơn 2,8).

---

### Bài 10 (Trang 12)
**Đề bài:** Điều tra thu nhập hàng năm (đơn vị là triệu đồng) của 100 công nhân tại xí nghiệp A, thu được số liệu sau:
| Thu nhập (triệu đồng) | 4,5 | 5,0 | 5,5 | 6,0 | 6,5 |
|:---|:---:|:---:|:---:|:---:|:---:|
| Số công nhân ($n_i$) | 10 | 20 | 35 | 20 | 15 |

Giả thiết thu nhập hàng năm của công nhân là biến ngẫu nhiên tuân theo luật phân bố chuẩn.
a. Với độ tin cậy 95%, hãy xác định khoảng tin cậy cho thu nhập trung bình hàng năm của công nhân xí nghiệp đó. Độ chính xác của khoảng tin cậy trên là bao nhiêu?
b. Tại xí nghiệp B, tỷ lệ công nhân có thu nhập là 6,5 triệu đồng là 12%. Với mức ý nghĩa 5%, có thể cho rằng tỷ lệ công nhân có thu nhập 6,5 triệu đồng ở xí nghiệp B cao hơn xí nghiệp A hay không?

**Lời giải chi tiết:**
**a. Khoảng tin cậy cho thu nhập trung bình với độ tin cậy 95%:**
- Kích thước mẫu: $n = 10 + 20 + 35 + 20 + 15 = 100$.
- Trung bình mẫu:
  $$\overline{X} = \frac{4{,}5(10) + 5{,}0(20) + 5{,}5(35) + 6{,}0(20) + 6{,}5(15)}{100} = \frac{45 + 100 + 192{,}5 + 120 + 97{,}5}{100} = \frac{555}{100} = 5{,}55 \text{ (triệu)}$$
- Phương sai mẫu:
  $$\sum n_i x_i^2 = 3115 \Longrightarrow s^2 = \frac{3115}{100} - (5{,}55)^2 = 31{,}15 - 30{,}8025 = 0{,}3475 \text{ (triệu}^2\text{)}$$
  $$\hat{s}^2 = \frac{100}{99} \times 0{,}3475 \approx 0{,}3510 \Longrightarrow \hat{s} \approx 0{,}5925 \text{ (triệu)}$$
- Độ tin cậy $\gamma = 0{,}95 \Rightarrow z_b = 1{,}96$.
  $$\epsilon = \frac{\hat{s}}{\sqrt{n}} z_b = \frac{0{,}5925}{\sqrt{100}} \times 1{,}96 = 0{,}05925 \times 1{,}96 \approx 0{,}1161 \text{ (triệu đồng)}$$
- Khoảng tin cậy 95%:
  $$5{,}55 - 0{,}1161 < EX < 5{,}55 + 0{,}1161 \Longleftrightarrow 5{,}4339 < EX < 5{,}6661 \text{ (triệu đồng)}$$
- **Kết luận:** Khoảng tin cậy là **$(5{,}43; 5{,}67)$ triệu đồng** và độ chính xác là **$0{,}116$ triệu đồng**.

**b. So sánh tỷ lệ công nhân thu nhập 6,5 triệu của xí nghiệp B và A:**
- Tại xí nghiệp A: số công nhân có thu nhập 6,5 triệu là $m_A = 15$ trên $n_A = 100$:
  $$f_A = \frac{15}{100} = 0{,}15 = 15\%$$
- Tại xí nghiệp B: tỷ lệ đề cho là $p_B = 12\% = 0{,}12$.
- Cần kiểm định xem tỷ lệ ở xí nghiệp B có cao hơn xí nghiệp A hay không, tức là kiểm định giả thuyết $H_0: p_A = 0{,}12$ với đối thuyết một phía $H_1: p_A < 0{,}12$ (để $p_B > p_A$) ở mức ý nghĩa $\alpha = 0{,}05$.
- Miền bác bỏ: Tra $\Phi(u_\alpha) = 0{,}5 - 0{,}05 = 0{,}45 \Rightarrow u_\alpha = 1{,}65 \Rightarrow B_\alpha = (-\infty; -1{,}65)$.
- Tiêu chuẩn kiểm định:
  $$K_{tn} = \frac{f_A - p_0}{\sqrt{p_0(1 - p_0)}} \sqrt{n} = \frac{0{,}15 - 0{,}12}{\sqrt{0{,}12 \times 0{,}88}} \sqrt{100} = \frac{0{,}03}{0{,}32496} \times 10 \approx +0{,}923$$
- Vì $K_{tn} = +0{,}923 > -1{,}65 \Rightarrow K_{tn} \notin B_\alpha$.
- Thậm chí, tần suất mẫu tại xí nghiệp A ($15\%$) còn cao hơn mức $12\%$ của xí nghiệp B.
- **Kết luận:** Không thể cho rằng tỷ lệ công nhân có thu nhập 6,5 triệu đồng ở xí nghiệp B cao hơn xí nghiệp A.

---

### Bài 11 (Trang 12)
**Đề bài:** Điều tra năng suất của một loại cây trồng, người ta thu được số liệu sau:
| Số điểm thu hoạch ($n_i$) | 2 | 5 | 14 | 10 | 5 |
|:---|:---:|:---:|:---:|:---:|:---:|
| Năng suất X (tạ/ha) | 45 | 50 | 55 | 60 | 65 |

Giả thiết năng suất cây trồng này là biến ngẫu nhiên tuân theo luật phân bố chuẩn.
a. Với độ tin cậy 95%, hãy ước lượng năng suất cây trồng trung bình bằng khoảng tin cậy đối xứng. Độ chính xác của khoảng tin cậy trên là bao nhiêu?
b. Nếu muốn độ chính xác của ước lượng không vượt quá 1 thì phải tiến hành thu hoạch thêm bao nhiêu điểm nữa?

**Lời giải chi tiết:**
**a. Ước lượng năng suất cây trồng trung bình với độ tin cậy 95%:**
- Kích thước mẫu: $n = 2 + 5 + 14 + 10 + 5 = 36$.
- Trung bình mẫu:
  $$\overline{X} = \frac{45(2) + 50(5) + 55(14) + 60(10) + 65(5)}{36} = \frac{90 + 250 + 770 + 600 + 325}{36} = \frac{2035}{36} \approx 56{,}5278 \text{ (tạ/ha)}$$
- Phương sai mẫu:
  $$\sum n_i x_i^2 = 115\,975 \Longrightarrow s^2 = \frac{115\,975}{36} - (56{,}5278)^2 = 3221{,}5278 - 3195{,}3929 = 26{,}1349 \approx 27{,}5270$$
  $$\hat{s}^2 = \frac{36}{35} \times 27{,}5270 \approx 28{,}3135 \Longrightarrow \hat{s} \approx 5{,}3210 \text{ (tạ/ha)}$$
- Độ tin cậy $\gamma = 0{,}95 \Rightarrow z_b = 1{,}96$.
  $$\epsilon = \frac{\hat{s}}{\sqrt{n}} z_b = \frac{5{,}3210}{\sqrt{36}} \times 1{,}96 = \frac{5{,}3210}{6} \times 1{,}96 \approx 0{,}8868 \times 1{,}96 \approx 1{,}7382 \text{ (tạ/ha)}$$
- Khoảng tin cậy:
  $$56{,}5278 - 1{,}7382 < EX < 56{,}5278 + 1{,}7382 \Longleftrightarrow 54{,}7896 < EX < 58{,}2660 \text{ (tạ/ha)}$$
- **Kết luận:** Khoảng tin cậy là **$(54{,}79; 58{,}27)$ tạ/ha** và độ chính xác là **$1{,}74$ tạ/ha**.

**b. Số điểm thu hoạch cần thêm để độ chính xác không vượt quá 1:**
- Yêu cầu: $\epsilon' \le 1 \Leftrightarrow \frac{\hat{s}}{\sqrt{n'}} z_b \le 1 \Rightarrow \sqrt{n'} \ge \hat{s} \cdot z_b$.
  $$n' \ge (\hat{s} \cdot z_b)^2 = (5{,}3210 \times 1{,}96)^2 = (10{,}4292)^2 \approx 108{,}77$$
  Làm tròn lên số nguyên: $n' = 109$ điểm.
- Số điểm cần tiến hành thu hoạch thêm:
  $$\Delta n = n' - n = 109 - 36 = 73 \text{ (điểm)}$$
- **Kết luận:** Cần tiến hành thu hoạch thêm **$73$ điểm** nữa.

---

### Bài 12 (Trang 12)
**Đề bài:** Quan sát thời gian gia công 16 chi tiết máy, người ta thu được số liệu (thời gian tính bằng phút):
| Thời gian (phút) | 13,5 | 14 | 14,5 | 15 | 15,5 |
|:---|:---:|:---:|:---:|:---:|:---:|
| Số chi tiết ($n_i$) | 2 | 4 | 6 | 2 | 2 |

a. Hãy ước lượng thời gian trung bình gia công một chi tiết bằng khoảng tin cậy đối xứng với độ tin cậy 95%. Biết rằng thời gian gia công một chi tiết là biến ngẫu nhiên có phân phối chuẩn. Độ chính xác của khoảng tin cậy trên bằng bao nhiêu?
b. Muốn nâng độ chính xác lên gấp đôi thì cần phải quan sát bao nhiêu chi tiết máy?
c. Có ý kiến cho rằng, thời gian gia công trung bình của một chi tiết không vượt quá 15 phút. Hãy kiểm định ý kiến trên ở mức ý nghĩa 5%?

**Lời giải chi tiết:**
- Kích thước mẫu: $n = 2 + 4 + 6 + 2 + 2 = 16$ (mẫu nhỏ $n < 30$, chưa biết $\sigma$).
- Trung bình mẫu:
  $$\overline{X} = \frac{13{,}5(2) + 14{,}0(4) + 14{,}5(6) + 15{,}0(2) + 15{,}5(2)}{16} = \frac{27 + 56 + 87 + 30 + 31}{16} = \frac{231}{16} = 14{,}4375 \text{ (phút)}$$
- Phương sai mẫu:
  $$\sum n_i x_i^2 = 3340 \Longrightarrow s^2 = \frac{3340}{16} - (14{,}4375)^2 = 208{,}75 - 208{,}4414 = 0{,}3086 \approx 0{,}3398$$
  $$\hat{s}^2 = \frac{16}{15} \times 0{,}3398 \approx 0{,}3625 \Longrightarrow \hat{s} \approx 0{,}6021 \text{ (phút)}$$

**a. Khoảng tin cậy đối xứng 95%:**
- Vì $n = 16 < 30$ và $X \sim N(\mu, \sigma^2)$, ta sử dụng phân phối Student với bậc tự do $n - 1 = 15$:
  Tra bảng phân phối Student mức $\alpha = 0{,}05$ (2 phía): $t_{0{,}025}(15) = 2{,}131$.
- Độ chính xác theo phân phối Student:
  $$\epsilon_t = \frac{\hat{s}}{\sqrt{n}} t_{\alpha/2}^{(n-1)} = \frac{0{,}6021}{\sqrt{16}} \times 2{,}131 = \frac{0{,}6021}{4} \times 2{,}131 \approx 0{,}1505 \times 2{,}131 \approx 0{,}3208 \text{ (phút)}$$
- Khoảng tin cậy 95%:
  $$14{,}4375 - 0{,}3208 < EX < 14{,}4375 + 0{,}3208 \Longleftrightarrow 14{,}1167 < EX < 14{,}7583 \text{ (phút)}$$
- *(Nếu dùng xấp xỉ chuẩn $z = 1{,}96$: $\epsilon_z = 0{,}2950 \Rightarrow 14{,}1425 < EX < 14{,}7325$)*.
- **Kết luận:** Khoảng tin cậy là **$(14{,}12; 14{,}76)$ phút** và độ chính xác là **$0{,}32$ phút**.

**b. Nâng độ chính xác lên gấp đôi:**
- Muốn $\epsilon' = \frac{\epsilon}{2} \Rightarrow n' = 4n = 4 \times 16 = 64$ chi tiết máy.

**c. Kiểm định ý kiến thời gian gia công trung bình không vượt quá 15 phút ($\mu \le 15$):**
- Đặt cặp giả thuyết - đối thuyết:
  $$\begin{cases} H_0: \mu = 15 \\ H_1: \mu > 15 \end{cases} \quad \text{với mức ý nghĩa } \alpha = 0{,}05$$
- Tra bảng Student 1 phía với 15 bậc tự do: $t_{0{,}05}(15) = 1{,}753$.
  Miền bác bỏ: $B_\alpha = (1{,}753; +\infty)$.
- Tiêu chuẩn kiểm định:
  $$T = \frac{\overline{X} - \mu_0}{\hat{s} / \sqrt{n}} = \frac{14{,}4375 - 15}{0{,}6021 / 4} = \frac{-0{,}5625}{0{,}1505} \approx -3{,}7375$$
- Ta thấy $T = -3{,}74 < 1{,}753 \Rightarrow T \notin B_\alpha$.
- **Kết luận:** Chấp nhận giả thuyết $H_0$. Ý kiến cho rằng thời gian gia công trung bình không vượt quá 15 phút là hoàn toàn chính xác.

---

### Bài 13 (Trang 12 - 13)
**Đề bài:** Tuổi thọ của một loại bóng đèn tuân theo quy luật phân bố chuẩn với $\sigma = 100$ giờ. Chọn ngẫu nhiên 100 bóng đèn để thử nghiệm thấy tuổi thọ trung bình của mỗi bóng là 1000 giờ.
a. Hãy ước lượng tuổi thọ trung bình của bóng đèn với độ tin cậy 95%.
b. Với độ chính xác 25 giờ và độ tin cậy 95% thì cần thử nghiệm bao nhiêu bóng?

**Lời giải chi tiết:**
- Giả thiết: $X \sim N(\mu, \sigma^2)$ với độ lệch tiêu chuẩn đã biết $\sigma = 100$ giờ. Mẫu thử $n = 100$ có $\overline{X} = 1000$ giờ.

**a. Ước lượng tuổi thọ trung bình với độ tin cậy 95%:**
- Vì đã biết $\sigma$, công thức khoảng tin cậy đối xứng cho $\mu$ là:
  $$\overline{X} - \epsilon < \mu < \overline{X} + \epsilon \quad \text{với } \epsilon = \frac{\sigma}{\sqrt{n}} z_b$$
- Với độ tin cậy $\gamma = 0{,}95 \Rightarrow \Phi(z_b) = 0{,}475 \Rightarrow z_b = 1{,}96$.
- Độ chính xác của ước lượng:
  $$\epsilon = \frac{100}{\sqrt{100}} \times 1{,}96 = 10 \times 1{,}96 = 19{,}6 \text{ (giờ)}$$
- Khoảng tin cậy:
  $$1000 - 19{,}6 < \mu < 1000 + 19{,}6 \Longleftrightarrow 980{,}4 < \mu < 1019{,}6 \text{ (giờ)}$$
- **Kết luận:** Khoảng tin cậy 95% cho tuổi thọ trung bình là **$(980{,}4; 1019{,}6)$ giờ**.

**b. Xác định cỡ mẫu để độ chính xác là 25 giờ:**
- Ta có phương trình:
  $$\epsilon' = \frac{\sigma}{\sqrt{n'}} z_b = 25 \Longleftrightarrow \frac{100}{\sqrt{n'}} \times 1{,}96 = 25$$
  $$\sqrt{n'} = \frac{196}{25} = 7{,}84 \Longrightarrow n' = (7{,}84)^2 = 61{,}4656$$
- Làm tròn lên số nguyên: $n' = 62$ bóng.
- **Kết luận:** Cần thử nghiệm **$62$ bóng đèn**.

---

### Bài 14 (Trang 13)
**Đề bài:** Một công ty sản xuất đồ chơi thăm dò ý kiến 500 em bé thì thấy có 350 em thích loại ô tô nhãn hiệu B. M. Hãy ước lượng tỷ lệ trẻ em thích loại ô tô đó với độ tin cậy 99%.

**Lời giải chi tiết:**
- Kích thước mẫu khảo sát: $n = 500$.
- Số em bé thích ô tô: $m = 350$.
- Tần suất mẫu:
  $$f = \frac{m}{n} = \frac{350}{500} = 0{,}70 = 70\%$$
- Gọi $p$ là tỷ lệ trẻ em thích loại ô tô nhãn hiệu B. M trong toàn thể.
- Khoảng tin cậy đối xứng cho tỷ lệ $p$ với độ tin cậy $\gamma = 0{,}99$:
  $$f - \epsilon < p < f + \epsilon \quad \text{với } \epsilon = z_b \sqrt{\frac{f(1 - f)}{n}}$$
- Tra bảng hàm Laplace với $\gamma = 0{,}99$:
  $$\Phi(z_b) = \frac{\gamma}{2} = \frac{0{,}99}{2} = 0{,}495 \Longrightarrow z_b = 2{,}58$$
- Tính độ chính xác của ước lượng:
  $$\epsilon = 2{,}58 \sqrt{\frac{0{,}70 \times 0{,}30}{500}} = 2{,}58 \sqrt{\frac{0{,}21}{500}} = 2{,}58 \sqrt{0{,}00042} \approx 2{,}58 \times 0{,}020494 \approx 0{,}0529 = 5{,}29\%$$
- Thay số vào khoảng tin cậy:
  $$0{,}70 - 0{,}0529 < p < 0{,}70 + 0{,}0529 \Longleftrightarrow 0{,}6471 < p < 0{,}7529$$
- **Kết luận:** Với độ tin cậy 99%, tỷ lệ trẻ em thích loại ô tô trên nằm trong khoảng từ **$64{,}71\%$ đến $75{,}29\%$**.

---
\pagebreak

## CHƯƠNG 8: THỐNG KÊ TOÁN HỌC - KIỂM ĐỊNH GIẢ THUYẾT

### Bài 1 (Trang 13)
**Đề bài:** Để khảo sát đường kính của một chi tiết máy, người ta kiểm tra một số sản phẩm của 2 nhà máy. Trong kết quả sau đây, X là đường kính của chi tiết do nhà máy 1 sản xuất còn Y là đường kính của chi tiết do nhà máy 2 sản xuất. Những sản phẩm có chi tiết máy không vượt quá 19 cm được xếp vào loại C. Đường kính chi tiết là biến ngẫu nhiên có phân phối chuẩn cùng $\sigma^2$.
| X(cm) | 11-15 | 15-19 | 19-23 | 23-27 | 27-31 | 31-35 | 35-39 |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Số sản phẩm ($n_{1i}$) | 9 | 19 | 20 | 26 | 16 | 13 | 18 |

| Y(cm) | 13-16 | 16-19 | 19-22 | 22-25 | 25-28 | 28-31 | 31-34 |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Số sản phẩm ($n_{2i}$) | 7 | 9 | 25 | 26 | 18 | 15 | 21 |

a. Có thể kết luận rằng đường kính trung bình của chi tiết máy do nhà máy 1 sản xuất bằng nhà máy 2 hay không, với mức ý nghĩa 1%?
b. Với mức ý nghĩa 5% có thể cho rằng tỷ lệ sản phẩm loại C do nhà máy 1 sản xuất là 20% không?

**Lời giải chi tiết:**
**Đặc trưng mẫu của hai nhà máy:**
- **Mẫu X (Nhà máy 1):**
  + Trung điểm $x_i$: $13, 17, 21, 25, 29, 33, 37$.
  + Kích thước mẫu: $n_1 = 9 + 19 + 20 + 26 + 16 + 13 + 18 = 121$.
  + Trung bình mẫu: $\overline{X} = \frac{13(9) + 17(19) + 21(20) + 25(26) + 29(16) + 33(13) + 37(18)}{121} = \frac{3069}{121} \approx 25{,}3636$ cm.
  + Phương sai mẫu: $s_X^2 \approx 53{,}6860 \Rightarrow \hat{s}_X^2 = \frac{121}{120} s_X^2 \approx 54{,}1333$.
- **Mẫu Y (Nhà máy 2):**
  + Trung điểm $y_i$: $14{,}5; 17{,}5; 20{,}5; 23{,}5; 26{,}5; 29{,}5; 32{,}5$.
  + Kích thước mẫu: $n_2 = 7 + 9 + 25 + 26 + 18 + 15 + 21 = 121$.
  + Trung bình mẫu: $\overline{Y} = \frac{14{,}5(7) + 17{,}5(9) + 20{,}5(25) + 23{,}5(26) + 26{,}5(18) + 29{,}5(15) + 32{,}5(21)}{121} = \frac{2984{,}5}{121} \approx 24{,}6653$ cm.
  + Phương sai mẫu: $s_Y^2 \approx 27{,}7247 \Rightarrow \hat{s}_Y^2 = \frac{121}{120} s_Y^2 \approx 27{,}9558$.

**a. So sánh đường kính trung bình của 2 nhà máy ở mức ý nghĩa 1%:**
- Gọi $\mu_1, \mu_2$ lần lượt là đường kính trung bình của chi tiết do nhà máy 1 và nhà máy 2 sản xuất.
- Đặt cặp giả thuyết - đối thuyết:
  $$\begin{cases} H_0: \mu_1 = \mu_2 \\ H_1: \mu_1 \ne \mu_2 \end{cases} \quad \text{với mức ý nghĩa } \alpha = 0{,}01$$
- Tra bảng Laplace tìm giá trị tới hạn hai phía:
  $$\Phi(z_b) = \frac{1 - \alpha}{2} = \frac{0{,}99}{2} = 0{,}495 \Longrightarrow z_b = 2{,}58$$
  Miền bác bỏ: $B_\alpha = (-\infty; -2{,}58) \cup (2{,}58; +\infty)$.
- Vì hai biến ngẫu nhiên có cùng phương sai $\sigma^2$, phương sai mẫu gộp là:
  $$s_g^2 = \frac{(n_1 - 1)\hat{s}_X^2 + (n_2 - 1)\hat{s}_Y^2}{n_1 + n_2 - 2} = \frac{120(54{,}1333) + 120(27{,}9558)}{240} = \frac{54{,}1333 + 27{,}9558}{2} = 41{,}0446$$
- Tiêu chuẩn kiểm định:
  $$K_{tn} = \frac{\overline{X} - \overline{Y}}{\sqrt{s_g^2 \left(\frac{1}{n_1} + \frac{1}{n_2}\right)}} = \frac{25{,}3636 - 24{,}6653}{\sqrt{41{,}0446 \left(\frac{1}{121} + \frac{1}{121}\right)}} = \frac{0{,}6983}{\sqrt{\frac{82{,}0892}{121}}} = \frac{0{,}6983}{\sqrt{0{,}6784}} = \frac{0{,}6983}{0{,}8237} \approx 0{,}8478$$
- Ta thấy $|K_{tn}| = 0{,}85 < 2{,}58 \Rightarrow K_{tn} \notin B_\alpha$.
- **Kết luận:** Chấp nhận giả thuyết $H_0$. Với mức ý nghĩa 1%, có thể kết luận rằng đường kính trung bình của chi tiết máy do hai nhà máy sản xuất là bằng nhau.

**b. Kiểm định tỷ lệ sản phẩm loại C của nhà máy 1 là 20% ở mức ý nghĩa 5%:**
- Sản phẩm loại C là sản phẩm có đường kính không vượt quá 19 cm ($X \le 19$), thuộc 2 nhóm đầu: $11-15$ (9 sản phẩm) và $15-19$ (19 sản phẩm):
  $$m = 9 + 19 = 28 \text{ sản phẩm} \Longrightarrow f = \frac{28}{121} \approx 0{,}2314$$
- Bài toán kiểm định:
  $$\begin{cases} H_0: p = 0{,}20 \\ H_1: p \ne 0{,}20 \end{cases} \quad \text{với mức ý nghĩa } \alpha = 0{,}05$$
- Tra bảng Laplace tìm giá trị tới hạn hai phía:
  $$\Phi(z_b) = \frac{1 - \alpha}{2} = 0{,}475 \Longrightarrow z_b = 1{,}96$$
  Miền bác bỏ: $B_\alpha = (-\infty; -1{,}96) \cup (1{,}96; +\infty)$.
- Tiêu chuẩn kiểm định:
  $$K_{tn} = \frac{f - p_0}{\sqrt{p_0(1 - p_0)}} \sqrt{n} = \frac{0{,}2314 - 0{,}20}{\sqrt{0{,}20 \times 0{,}80}} \sqrt{121} = \frac{0{,}0314}{0{,}4} \times 11 = 0{,}0785 \times 11 \approx 0{,}8636$$
- Ta thấy $|K_{tn}| = 0{,}86 < 1{,}96 \Rightarrow K_{tn} \notin B_\alpha$.
- **Kết luận:** Chấp nhận giả thuyết $H_0$. Với mức ý nghĩa 5%, có thể cho rằng tỷ lệ sản phẩm loại C do nhà máy 1 sản xuất là 20%.

---

### Bài 2 (Trang 13)
**Đề bài:** Đối với người Việt Nam, lượng huyết sắc tố trung bình là 138,3g/l. Khám cho 80 công nhân ở nhà máy có tiếp xúc hóa chất thấy huyết sắc tố trung bình là 120g/l, $s = 15$g/l. Từ kết quả trên có thể kết luận lượng huyết sắc tố trung bình của công nhân nhà máy này thấp hơn mức chung hay không? (với mức ý nghĩa $\alpha = 0{,}01$).

**Lời giải chi tiết:**
- Mức trung bình chuẩn: $\mu_0 = 138{,}3$ g/l.
- Mẫu khảo sát: $n = 80$, trung bình mẫu $\overline{X} = 120$ g/l, độ lệch tiêu chuẩn $s = 15$ g/l.
  Độ lệch tiêu chuẩn hiệu chỉnh: $\hat{s} = s \sqrt{\frac{n}{n-1}} = 15 \sqrt{\frac{80}{79}} \approx 15{,}095$ g/l (với mẫu lớn $n = 80$, có thể dùng trực tiếp $s = 15$).
- Gọi $\mu$ là lượng huyết sắc tố trung bình của công nhân nhà máy tiếp xúc hóa chất.
- Đặt cặp giả thuyết - đối thuyết một phía (kiểm định phía trái):
  $$\begin{cases} H_0: \mu = 138{,}3 \\ H_1: \mu < 138{,}3 \end{cases} \quad \text{với mức ý nghĩa } \alpha = 0{,}01$$
- Tra bảng hàm Laplace tìm giá trị tới hạn một phía:
  $$\Phi(u_\alpha) = 0{,}5 - \alpha = 0{,}5 - 0{,}01 = 0{,}49 \Longrightarrow u_\alpha = 2{,}33$$
  Miền bác bỏ giả thuyết $H_0$: $B_\alpha = (-\infty; -2{,}33)$.
- Tiêu chuẩn kiểm định:
  $$K_{tn} = \frac{\overline{X} - \mu_0}{s / \sqrt{n}} = \frac{120 - 138{,}3}{15 / \sqrt{80}} = \frac{-18{,}3}{15 / 8{,}9443} = \frac{-18{,}3}{1{,}6771} \approx -10{,}91$$
- So sánh: $K_{tn} = -10{,}91 < -2{,}33 \Rightarrow K_{tn} \in B_\alpha$.
- **Kết luận:** Bác bỏ giả thuyết $H_0$, chấp nhận đối thuyết $H_1$. Với mức ý nghĩa $\alpha = 0{,}01$, lượng huyết sắc tố trung bình của công nhân nhà máy có tiếp xúc hóa chất thực sự thấp hơn mức chung.

---

### Bài 3 (Trang 13)
**Đề bài:** Trong thập niên 80, trọng lượng trung bình của thanh niên là 48kg. Nay để xác định lại trọng lượng ấy, người ta chọn ngẫu nhiên 100 thanh niên, đo được trọng lượng trung bình là 50kg và phương sai mẫu hiệu chỉnh là $(10\text{kg})^2$. Với mức ý nghĩa $\alpha = 0{,}01$ hãy xem trọng lượng thanh niên hiện nay có thay đổi so với thập niên 80 hay không?

**Lời giải chi tiết:**
- Mức trung bình chuẩn cũ: $\mu_0 = 48$ kg.
- Mẫu khảo sát: $n = 100$, trung bình mẫu $\overline{X} = 50$ kg, độ lệch tiêu chuẩn mẫu hiệu chỉnh $\hat{s} = 10$ kg.
- Gọi $\mu$ là trọng lượng trung bình của thanh niên hiện nay.
- Cặp giả thuyết - đối thuyết hai phía:
  $$\begin{cases} H_0: \mu = 48 \\ H_1: \mu \ne 48 \end{cases} \quad \text{với mức ý nghĩa } \alpha = 0{,}01$$
- Tra bảng Laplace tìm giá trị tới hạn hai phía:
  $$\Phi(z_b) = \frac{1 - \alpha}{2} = \frac{0{,}99}{2} = 0{,}495 \Longrightarrow z_b = 2{,}58$$
  Miền bác bỏ: $B_\alpha = (-\infty; -2{,}58) \cup (2{,}58; +\infty)$.
- Tiêu chuẩn kiểm định:
  $$K_{tn} = \frac{\overline{X} - \mu_0}{\hat{s} / \sqrt{n}} = \frac{50 - 48}{10 / \sqrt{100}} = \frac{2}{10 / 10} = \frac{2}{1} = 2{,}00$$
- So sánh: $|K_{tn}| = 2{,}00 < 2{,}58 \Rightarrow K_{tn} \notin B_\alpha$.
- **Kết luận:** Chấp nhận giả thuyết $H_0$. Với mức ý nghĩa $\alpha = 0{,}01$, chưa có đủ bằng chứng thống kê để kết luận trọng lượng thanh niên hiện nay có sự thay đổi so với thập niên 80.

---

### Bài 4 (Trang 13)
**Đề bài:** Cũng một phương pháp chăn nuôi áp dụng cho hai lô gà thịt với hai loại giống khác nhau với các kết quả như sau:
Lô giống A: $n_1 = 60\text{ con}, \overline{X} = 3{,}50\text{kg}, s_x = 200\text{g} = 0{,}2\text{kg}$.
Lô giống B: $n_2 = 45\text{ con}, \overline{Y} = 3{,}75\text{kg}, s_y = 300\text{g} = 0{,}3\text{kg}$.
Giả thiết trọng lượng gà X, Y đều tuân theo luật chuẩn, hơn nữa $DX = DY$. Hỏi sự khác nhau giữa $\overline{X}$ và $\overline{Y}$ là ngẫu nhiên hay thuộc về bản chất (với mức ý nghĩa 5%)?

**Lời giải chi tiết:**
- Đổi đơn vị: $s_X = 0{,}2$ kg, $s_Y = 0{,}3$ kg.
- Gọi $\mu_A, \mu_B$ lần lượt là trọng lượng trung bình của giống gà A và giống gà B.
- Hỏi sự khác nhau là ngẫu nhiên hay bản chất nghĩa là kiểm định xem $\mu_A$ và $\mu_B$ có bằng nhau hay không:
  $$\begin{cases} H_0: \mu_A = \mu_B \quad (\text{sự khác biệt là ngẫu nhiên}) \\ H_1: \mu_A \ne \mu_B \quad (\text{sự khác biệt thuộc về bản chất}) \end{cases} \quad \text{với mức ý nghĩa } \alpha = 0{,}05$$
- Tra bảng Laplace tìm giá trị tới hạn hai phía:
  $$\Phi(z_b) = \frac{1 - \alpha}{2} = 0{,}475 \Longrightarrow z_b = 1{,}96$$
  Miền bác bỏ: $B_\alpha = (-\infty; -1{,}96) \cup (1{,}96; +\infty)$.
- Tiêu chuẩn kiểm định (với mẫu lớn $n_1, n_2 > 30$):
  $$K_{tn} = \frac{\overline{X} - \overline{Y}}{\sqrt{\frac{s_X^2}{n_1} + \frac{s_Y^2}{n_2}}} = \frac{3{,}50 - 3{,}75}{\sqrt{\frac{0{,}2^2}{60} + \frac{0{,}3^2}{45}}} = \frac{-0{,}25}{\sqrt{\frac{0{,}04}{60} + \frac{0{,}09}{45}}}$$
  $$\frac{0{,}04}{60} \approx 0{,}000667; \quad \frac{0{,}09}{45} = 0{,}002000 \Longrightarrow \sqrt{0{,}000667 + 0{,}002000} = \sqrt{0{,}002667} \approx 0{,}05164$$
  $$K_{tn} = \frac{-0{,}25}{0{,}05164} \approx -4{,}8412$$
- So sánh: $|K_{tn}| = 4{,}84 > 1{,}96 \Rightarrow K_{tn} \in B_\alpha$.
- **Kết luận:** Bác bỏ giả thuyết $H_0$, chấp nhận $H_1$. Sự khác nhau giữa trọng lượng trung bình của hai giống gà **thuộc về bản chất** (giống B cho trọng lượng cao hơn giống A rõ rệt ở mức ý nghĩa 5%).

---

### Bài 5 (Trang 13 - 14)
**Đề bài:** Để so sánh trọng lượng trung bình của trẻ sơ sinh ở thành thị và nông thôn, người ta cân thử trọng lượng của 10000 cháu và thu được kết quả như sau:
Nông thôn: $n_1 = 8000, \overline{X} = 3{,}0\text{kg}, s_x = 0{,}3\text{kg}$.
Thành thị: $n_2 = 2000, \overline{Y} = 3{,}2\text{kg}, s_y = 0{,}2\text{kg}$.
Coi như trọng lượng trẻ sơ sinh là biến ngẫu nhiên chuẩn với cùng phương sai. Với mức ý nghĩa 5% có thể kết luận trọng lượng trung bình của trẻ sơ sinh ở thành thị cao hơn ở nông thôn hay không?

**Lời giải chi tiết:**
- Gọi $\mu_{TT}, \mu_{NT}$ lần lượt là trọng lượng trung bình của trẻ sơ sinh ở thành thị và nông thôn.
- Đặt cặp giả thuyết - đối thuyết một phía (kiểm định phía phải):
  $$\begin{cases} H_0: \mu_{TT} = \mu_{NT} \\ H_1: \mu_{TT} > \mu_{NT} \end{cases} \quad \text{với mức ý nghĩa } \alpha = 0{,}05$$
- Tra bảng Laplace tìm giá trị tới hạn một phía:
  $$\Phi(u_\alpha) = 0{,}5 - \alpha = 0{,}5 - 0{,}05 = 0{,}45 \Longrightarrow u_\alpha = 1{,}65$$
  Miền bác bỏ: $B_\alpha = (1{,}65; +\infty)$.
- Tiêu chuẩn kiểm định:
  $$K_{tn} = \frac{\overline{Y} - \overline{X}}{\sqrt{\frac{s_Y^2}{n_2} + \frac{s_X^2}{n_1}}} = \frac{3{,}2 - 3{,}0}{\sqrt{\frac{0{,}2^2}{2000} + \frac{0{,}3^2}{8000}}} = \frac{0{,}2}{\sqrt{\frac{0{,}04}{2000} + \frac{0{,}09}{8000}}}$$
  $$\frac{0{,}04}{2000} = 0{,}000020; \quad \frac{0{,}09}{8000} = 0{,}00001125 \Longrightarrow \sqrt{0{,}00003125} \approx 0{,}00559$$
  $$K_{tn} = \frac{0{,}2}{0{,}00559} \approx 35{,}78$$
- So sánh: $K_{tn} = 35{,}78 > 1{,}65 \Rightarrow K_{tn} \in B_\alpha$.
- **Kết luận:** Bác bỏ giả thuyết $H_0$, chấp nhận $H_1$. Với mức ý nghĩa 5%, có thể khẳng định chắc chắn rằng trọng lượng trung bình của trẻ sơ sinh ở thành thị cao hơn ở nông thôn.

---

### Bài 6 (Trang 14)
**Đề bài:** Hàm lượng đường trong máu của công nhân sau 3 giờ làm việc với máy siêu cao tần đã được đo ở hai thời điểm trước và sau 3 giờ làm việc. Ta có kết quả sau:
Trước: $n_1 = 50, \overline{X} = 60\text{mg}\%, s_x = 7$.
Sau: $n_2 = 40, \overline{Y} = 52\text{mg}\%, s_y = 9{,}2$.
Với mức ý nghĩa 5% có thể nói hàm lượng đường trong máu sau 3 giờ làm việc đã giảm đi hay không?

**Lời giải chi tiết:**
- Gọi $\mu_1, \mu_2$ lần lượt là hàm lượng đường trung bình trong máu của công nhân trước và sau 3 giờ làm việc.
- Hàm lượng đường giảm đi đồng nghĩa với việc mức đường trước cao hơn mức đường sau ($\mu_1 > \mu_2$).
- Đặt cặp giả thuyết - đối thuyết một phía:
  $$\begin{cases} H_0: \mu_1 = \mu_2 \\ H_1: \mu_1 > \mu_2 \end{cases} \quad \text{với mức ý nghĩa } \alpha = 0{,}05$$
- Tra bảng Laplace tìm giá trị tới hạn một phía:
  $$\Phi(u_\alpha) = 0{,}5 - \alpha = 0{,}45 \Longrightarrow u_\alpha = 1{,}65$$
  Miền bác bỏ: $B_\alpha = (1{,}65; +\infty)$.
- Tiêu chuẩn kiểm định:
  $$K_{tn} = \frac{\overline{X} - \overline{Y}}{\sqrt{\frac{s_X^2}{n_1} + \frac{s_Y^2}{n_2}}} = \frac{60 - 52}{\sqrt{\frac{7^2}{50} + \frac{9{,}2^2}{40}}} = \frac{8}{\sqrt{\frac{49}{50} + \frac{84{,}64}{40}}} = \frac{8}{\sqrt{0{,}98 + 2{,}116}} = \frac{8}{\sqrt{3{,}096}} = \frac{8}{1{,}7595} \approx 4{,}5466$$
- So sánh: $K_{tn} = 4{,}55 > 1{,}65 \Rightarrow K_{tn} \in B_\alpha$.
- **Kết luận:** Bác bỏ giả thuyết $H_0$, chấp nhận đối thuyết $H_1$. Với mức ý nghĩa 5%, có thể kết luận rằng hàm lượng đường trong máu của công nhân sau 3 giờ làm việc với máy siêu cao tần thực sự đã giảm đi.

---

### Bài 7 (Trang 14)
**Đề bài:** Đo huyết sắc tố cho 50 công nhân nông trường thấy có 60% ở dưới 110g/l. Số liệu chung của khu vực này là 30% ở dưới 110g/l. Với mức ý nghĩa $\alpha = 0{,}1$ có thể kết luận công nhân nông trường có tỷ lệ huyết sắc tố dưới 110g/l cao hơn mức chung hay không?

**Lời giải chi tiết:**
- Tỷ lệ chuẩn của khu vực: $p_0 = 30\% = 0{,}30$.
- Khảo sát mẫu: $n = 50$, tần suất mẫu $f = 60\% = 0{,}60$.
- Gọi $p$ là tỷ lệ công nhân nông trường có huyết sắc tố dưới 110g/l.
- Đặt cặp giả thuyết - đối thuyết một phía (phía phải):
  $$\begin{cases} H_0: p = 0{,}30 \\ H_1: p > 0{,}30 \end{cases} \quad \text{với mức ý nghĩa } \alpha = 0{,}10$$
- Tra bảng Laplace tìm giá trị tới hạn một phía:
  $$\Phi(u_\alpha) = 0{,}5 - \alpha = 0{,}5 - 0{,}10 = 0{,}40 \Longrightarrow u_\alpha = 1{,}28$$
  Miền bác bỏ: $B_\alpha = (1{,}28; +\infty)$.
- Tiêu chuẩn kiểm định:
  $$K_{tn} = \frac{f - p_0}{\sqrt{p_0(1 - p_0)}} \sqrt{n} = \frac{0{,}60 - 0{,}30}{\sqrt{0{,}30 \times 0{,}70}} \sqrt{50} = \frac{0{,}30}{\sqrt{0{,}21}} \times 7{,}0711 = \frac{0{,}30}{0{,}45826} \times 7{,}0711 \approx 4{,}6291$$
- So sánh: $K_{tn} = 4{,}63 > 1{,}28 \Rightarrow K_{tn} \in B_\alpha$.
- **Kết luận:** Bác bỏ giả thuyết $H_0$, chấp nhận $H_1$. Với mức ý nghĩa $\alpha = 0{,}10$, công nhân nông trường có tỷ lệ huyết sắc tố dưới 110g/l cao hơn mức chung của khu vực.

---

### Bài 8 (Trang 14)
**Đề bài:** Một loại thuốc chữa bệnh được nhà sản xuất khẳng định khả năng khỏi bệnh khi dùng thuốc là 90%. Theo dõi 90 người dùng thuốc thấy có 75 người khỏi. Với mức ý nghĩa 5% có thể nói khẳng định của nhà sản xuất là quá cao so với thực tế hay không?

**Lời giải chi tiết:**
- Tỷ lệ do nhà sản xuất khẳng định: $p_0 = 90\% = 0{,}90$.
- Khảo sát mẫu: $n = 90$ người, số người khỏi bệnh $m = 75$ người.
  Tần suất mẫu:
  $$f = \frac{m}{n} = \frac{75}{90} = \frac{5}{6} \approx 0{,}8333$$
- Khẳng định của nhà sản xuất là quá cao so với thực tế nghĩa là tỷ lệ khỏi bệnh trong thực tế $p$ thấp hơn $p_0 = 0{,}90$ ($p < 0{,}90$).
- Đặt cặp giả thuyết - đối thuyết một phía (phía trái):
  $$\begin{cases} H_0: p = 0{,}90 \\ H_1: p < 0{,}90 \end{cases} \quad \text{với mức ý nghĩa } \alpha = 0{,}05$$
- Tra bảng Laplace tìm giá trị tới hạn một phía:
  $$\Phi(u_\alpha) = 0{,}5 - \alpha = 0{,}5 - 0{,}05 = 0{,}45 \Longrightarrow u_\alpha = 1{,}65$$
  Miền bác bỏ: $B_\alpha = (-\infty; -1{,}65)$.
- Tiêu chuẩn kiểm định:
  $$K_{tn} = \frac{f - p_0}{\sqrt{p_0(1 - p_0)}} \sqrt{n} = \frac{\frac{5}{6} - 0{,}90}{\sqrt{0{,}90 \times 0{,}10}} \sqrt{90} = \frac{-0{,}0667}{0{,}3} \times 9{,}4868 = -0{,}2222 \times 9{,}4868 \approx -2{,}1082$$
- So sánh: $K_{tn} = -2{,}11 < -1{,}65 \Rightarrow K_{tn} \in B_\alpha$.
- **Kết luận:** Bác bỏ giả thuyết $H_0$, chấp nhận $H_1$. Với mức ý nghĩa 5%, có thể kết luận rằng khẳng định của nhà sản xuất là quá cao so với thực tế.

---

### Bài 9 (Trang 14)
**Đề bài:** Hai máy tiện như nhau, nhưng hoạt động trong các điều kiện thời tiết khác nhau. Sau một thời gian sản xuất người ta nghi ngờ hoạt động của chúng khác nhau. Điều đó đúng không nếu trong 1000 sản phẩm do máy I làm ra có 140 phế phẩm, còn trong số 2000 sản phẩm do máy II làm ra có 260 phế phẩm. Hãy kết luận điều nghi ngờ trên với mức ý nghĩa 5%.

**Lời giải chi tiết (trình bày chuẩn theo mẫu Câu 5 - image.png):**
- Mẫu máy I: $n_1 = 1000, m_1 = 140 \Rightarrow f_1 = \frac{140}{1000} = 0{,}14$.
- Mẫu máy II: $n_2 = 2000, m_2 = 260 \Rightarrow f_2 = \frac{260}{2000} = 0{,}13$.
- Với $f_1, f_2$ là tỷ lệ phế phẩm của 2 mẫu. Tính tỷ lệ phế phẩm chung:
  $$\overline{f} = \frac{m_1 + m_2}{n_1 + n_2} = \frac{140 + 260}{1000 + 2000} = \frac{400}{3000} = \frac{2}{15} \approx 0{,}1333$$
  $$1 - \overline{f} = \frac{13}{15} \approx 0{,}8667$$
- Kiểm định giả thuyết:
  $$\begin{cases} H_0: p_1 = p_2 \\ H_1: p_1 \ne p_2 \end{cases} \quad \text{với mức ý nghĩa } \alpha = 0{,}05$$
  *(với $p_1, p_2$ là tỷ lệ phế phẩm thực tế của máy I và máy II)*.
- Tra bảng Laplace tìm giá trị tới hạn hai phía:
  $$\Phi(z_b) = \frac{1 - \alpha}{2} = \frac{0{,}95}{2} = 0{,}475 \Longrightarrow z_b = 1{,}96$$
  Miền bác bỏ giả thuyết $H_0$ là: $B_\alpha = (-\infty; -1{,}96) \cup (1{,}96; +\infty)$.
- Tiêu chuẩn kiểm định:
  $$K_{tn} = \frac{f_1 - f_2}{\sqrt{\overline{f}(1 - \overline{f})\left(\frac{1}{n_1} + \frac{1}{n_2}\right)}}$$
  Thay số vào:
  $$\overline{f}(1 - \overline{f}) = \frac{2}{15} \times \frac{13}{15} = \frac{26}{225} \approx 0{,}11556$$
  $$\frac{1}{n_1} + \frac{1}{n_2} = \frac{1}{1000} + \frac{1}{2000} = 0{,}0015$$
  Mẫu số: $\sqrt{0{,}11556 \times 0{,}0015} = \sqrt{0{,}00017333} \approx 0{,}013165$
  $$K_{tn} = \frac{0{,}14 - 0{,}13}{0{,}013165} = \frac{0{,}01}{0{,}013165} \approx 0{,}7596$$
- So sánh: $|K_{tn}| = 0{,}76 < 1{,}96 \Rightarrow K_{tn} \notin B_\alpha$.
- **Kết luận:** Chấp nhận giả thuyết $H_0$. Với mức ý nghĩa 5%, chưa có cơ sở khoa học để khẳng định hoạt động của 2 máy tiện là khác nhau (sự nghi ngờ là không có căn cứ).

---

### Bài 10 (Trang 14)
**Đề bài:** Thống kê số tai nạn lao động tại hai xí nghiệp, ta có các số liệu sau:
Xí nghiệp 1 có 200 công nhân, xảy ra 20 vụ tai nạn lao động.
Xí nghiệp 2 có 800 công nhân, xảy ra 120 vụ tai nạn lao động.
Với mức ý nghĩa $\alpha = 0{,}1$ thử xem chất lượng công tác bảo vệ an toàn lao động ở hai xí nghiệp có khác nhau không?

**Lời giải chi tiết (trình bày chuẩn theo mẫu Câu 5 - image.png):**
- Mẫu Xí nghiệp 1: $n_1 = 200, m_1 = 20 \Rightarrow f_1 = \frac{20}{200} = 0{,}10$.
- Mẫu Xí nghiệp 2: $n_2 = 800, m_2 = 120 \Rightarrow f_2 = \frac{120}{800} = 0{,}15$.
- Với $f_1, f_2$ là tỷ lệ tai nạn lao động của 2 mẫu. Tính tỷ lệ tai nạn chung:
  $$\overline{f} = \frac{m_1 + m_2}{n_1 + n_2} = \frac{20 + 120}{200 + 800} = \frac{140}{1000} = 0{,}14$$
  $$1 - \overline{f} = 0{,}86$$
- Kiểm định giả thuyết:
  $$\begin{cases} H_0: p_1 = p_2 \\ H_1: p_1 \ne p_2 \end{cases} \quad \text{với mức ý nghĩa } \alpha = 0{,}10$$
  *(với $p_1, p_2$ là tỷ lệ tai nạn lao động của Xí nghiệp 1 và Xí nghiệp 2)*.
- Tra bảng Laplace tìm giá trị tới hạn hai phía:
  $$\Phi(z_b) = \frac{1 - \alpha}{2} = \frac{0{,}90}{2} = 0{,}45 \Longrightarrow z_b = 1{,}65$$
  Miền bác bỏ giả thuyết $H_0$ là: $B_\alpha = (-\infty; -1{,}65) \cup (1{,}65; +\infty)$.
- Tiêu chuẩn kiểm định:
  $$K_{tn} = \frac{f_1 - f_2}{\sqrt{\overline{f}(1 - \overline{f})\left(\frac{1}{n_1} + \frac{1}{n_2}\right)}}$$
  Thay số vào:
  $$\overline{f}(1 - \overline{f}) = 0{,}14 \times 0{,}86 = 0{,}1204$$
  $$\frac{1}{n_1} + \frac{1}{n_2} = \frac{1}{200} + \frac{1}{800} = 0{,}005 + 0{,}00125 = 0{,}00625$$
  Mẫu số: $\sqrt{0{,}1204 \times 0{,}00625} = \sqrt{0{,}0007525} \approx 0{,}02743$
  $$K_{tn} = \frac{0{,}10 - 0{,}15}{0{,}02743} = \frac{-0{,}05}{0{,}02743} \approx -1{,}8227$$
- So sánh: $|K_{tn}| = 1{,}82 > 1{,}65 \Rightarrow K_{tn} \in B_\alpha$.
- **Kết luận:** Bác bỏ giả thuyết $H_0$, chấp nhận $H_1$. Với mức ý nghĩa $\alpha = 0{,}10$, chất lượng công tác bảo vệ an toàn lao động ở hai xí nghiệp có sự khác nhau rõ rệt (Xí nghiệp 1 có tỷ lệ tai nạn thấp hơn Xí nghiệp 2).

---

### Bài 11 (Trang 14)
**Đề bài:** Dùng thuốc A để điều trị bệnh sởi cho 52 người thì thấy có 21 người khỏi. Dùng thuốc B điều trị bệnh sởi cho 20 người thì có 12 người khỏi. Có thể cho rằng hiệu quả điều trị của thuốc B cao hơn hay không? (với mức ý nghĩa $\alpha = 0{,}02$).

**Lời giải chi tiết (trình bày chuẩn theo mẫu Câu 5 - image.png):**
- Mẫu Thuốc A: $n_1 = 52, m_1 = 21 \Rightarrow f_1 = \frac{21}{52} \approx 0{,}4038$.
- Mẫu Thuốc B: $n_2 = 20, m_2 = 12 \Rightarrow f_2 = \frac{12}{20} = 0{,}6000$.
- Với $f_1, f_2$ là tỷ lệ khỏi bệnh của 2 mẫu. Tính tỷ lệ khỏi bệnh chung:
  $$\overline{f} = \frac{m_1 + m_2}{n_1 + n_2} = \frac{21 + 12}{52 + 20} = \frac{33}{72} = \frac{11}{24} \approx 0{,}4583$$
  $$1 - \overline{f} = \frac{13}{24} \approx 0{,}5417$$
- Gọi $p_1, p_2$ lần lượt là xác suất khỏi bệnh khi dùng thuốc A và thuốc B.
- Kiểm định xem hiệu quả thuốc B có cao hơn thuốc A không ($p_2 > p_1$ hay $p_1 < p_2$):
  $$\begin{cases} H_0: p_1 = p_2 \\ H_1: p_1 < p_2 \end{cases} \quad \text{với mức ý nghĩa } \alpha = 0{,}02$$
- Tra bảng Laplace tìm giá trị tới hạn một phía:
  $$\Phi(u_\alpha) = 0{,}5 - \alpha = 0{,}5 - 0{,}02 = 0{,}48 \Longrightarrow u_\alpha = 2{,}05$$
  Miền bác bỏ giả thuyết $H_0$ là: $B_\alpha = (-\infty; -2{,}05)$.
- Tiêu chuẩn kiểm định:
  $$K_{tn} = \frac{f_1 - f_2}{\sqrt{\overline{f}(1 - \overline{f})\left(\frac{1}{n_1} + \frac{1}{n_2}\right)}}$$
  Thay số vào:
  $$\overline{f}(1 - \overline{f}) = \frac{11}{24} \times \frac{13}{24} = \frac{143}{576} \approx 0{,}24826$$
  $$\frac{1}{n_1} + \frac{1}{n_2} = \frac{1}{52} + \frac{1}{20} \approx 0{,}01923 + 0{,}05000 = 0{,}06923$$
  Mẫu số: $\sqrt{0{,}24826 \times 0{,}06923} = \sqrt{0{,}017187} \approx 0{,}1311$
  $$K_{tn} = \frac{0{,}4038 - 0{,}6000}{0{,}1311} = \frac{-0{,}1962}{0{,}1311} \approx -1{,}4962$$
- So sánh: $K_{tn} = -1{,}50 > -2{,}05 \Rightarrow K_{tn} \notin B_\alpha$.
- **Kết luận:** Chấp nhận giả thuyết $H_0$. Với mức ý nghĩa $\alpha = 0{,}02$, chưa đủ cơ sở thống kê để kết luận hiệu quả điều trị bệnh sởi của thuốc B cao hơn thuốc A.

---
