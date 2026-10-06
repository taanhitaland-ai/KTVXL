// VLDC Questions Database (Auto-generated)
window.VLDC_QUESTIONS_DATA = [
  {
    "id": "VLDC_001",
    "chapter": "Chương 1: Quang Học Sóng - Giao Thoa Ánh Sáng",
    "chapter_id": 1,
    "type": "mcq",
    "prompt": "Trong thí nghiệm giao thoa khe Young, khoảng cách hai khe là a = 1 mm, khoảng cách từ hai khe tới màn quan sát là D = 3 m. Khi đặt trong không khí, đo được khoảng cách giữa 5 vân sáng liên tiếp là 7.2 mm. Bước sóng ánh sáng sử dụng bằng bao nhiêu?",
    "options": [
      "A. 0.60 µm",
      "B. 0.48 µm",
      "C. 0.50 µm",
      "D. 0.72 µm"
    ],
    "correct_answer": "A",
    "correct_answer_text": "0.60 µm",
    "explanation": "Khoảng cách giữa 5 vân sáng liên tiếp tương ứng với 4 khoảng vân (4i):\n4i = 7.2 mm ⇒ i = 7.2 / 4 = 1.8 mm = 1.8 × 10⁻³ m.\nTheo công thức khoảng vân giao thoa:\ni = (λ * D) / a ⇒ λ = (i * a) / D = (1.8 × 10⁻³ m * 10⁻³ m) / 3 m = 0.6 × 10⁻⁶ m = 0.60 µm.",
    "methodology": "Công thức cốt lõi: N vân sáng liên tiếp có (N - 1) khoảng vân. Khoảng vân i = (λ * D) / a.",
    "tips": "Mẹo Casio: Đổi mm sang m, bấm (7.2 / 4 * 1) / 3 = 0.6 µm."
  },
  {
    "id": "VLDC_002",
    "chapter": "Chương 1: Quang Học Sóng - Giao Thoa Ánh Sáng",
    "chapter_id": 1,
    "type": "mcq",
    "prompt": "Để đo bề dày e của một bản mỏng trong suốt (chiết suất n = 1.5), người ta đặt bản mỏng trước một trong hai khe của máy giao thoa Young. Ánh sáng chiếu vào có bước sóng λ = 0.6 µm. Khi đặt bản mỏng vào, hệ vân bị dịch chuyển một đoạn bằng 10 khoảng vân. Bề dày e của bản mỏng là:",
    "options": [
      "A. 12.0 µm",
      "B. 6.0 µm",
      "C. 15.0 µm",
      "D. 9.0 µm"
    ],
    "correct_answer": "A",
    "correct_answer_text": "12.0 µm",
    "explanation": "Khi đặt bản mỏng bề dày e, chiết suất n trước một khe, hiệu quang lộ tăng thêm một lượng ΔL = (n - 1)e.\nĐộ dịch chuyển của hệ vân trên màn là: Δx = (D / a) * (n - 1)e.\nMà khoảng vân i = (λ * D) / a, nên: Δx = (n - 1)e * (i / λ).\nTheo đề bài, hệ vân dịch chuyển 10 khoảng vân (Δx = 10i):\n10i = (n - 1)e * (i / λ) ⇒ (n - 1)e = 10λ ⇒ e = (10 * λ) / (n - 1) = (10 * 0.6 µm) / (1.5 - 1) = 6 / 0.5 = 12.0 µm.",
    "methodology": "Công thức đo bề dày bản mỏng bằng giao thoa khe Young: e = (k * λ) / (n - 1) khi hệ vân dịch chuyển k khoảng vân.",
    "tips": "Mẹo nhớ: Mỗi lần vân dịch 1 khoảng vân, quang lộ tăng đúng 1 bước sóng λ: (n - 1)e = k*λ."
  },
  {
    "id": "VLDC_003",
    "chapter": "Chương 1: Quang Học Sóng - Giao Thoa Ánh Sáng",
    "chapter_id": 1,
    "type": "mcq",
    "prompt": "Chiếu chùm ánh sáng đơn sắc có bước sóng λ = 0.6 µm vuông góc với một nêm không khí. Quan sát trong ánh sáng phản xạ, người ta thấy trên 1 cm chiều dài của mặt nêm có 20 khoảng vân. Góc nghiêng α giữa hai mặt nêm bằng bao nhiêu?",
    "options": [
      "A. 6 × 10⁻⁴ rad",
      "B. 3 × 10⁻⁴ rad",
      "C. 1.2 × 10⁻³ rad",
      "D. 1.5 × 10⁻⁴ rad"
    ],
    "correct_answer": "A",
    "correct_answer_text": "6 × 10⁻⁴ rad",
    "explanation": "Trên 1 cm (0.01 m) có 20 khoảng vân ⇒ khoảng vân trên nêm: i = 1 cm / 20 = 0.05 cm = 5 × 10⁻⁴ m.\nCông thức khoảng vân của nêm không khí: i = λ / (2 * α) (với α tính bằng radian).\nSuy ra góc nghiêng α của nêm:\nα = λ / (2 * i) = (0.6 × 10⁻⁶ m) / (2 * 5 × 10⁻⁴ m) = 0.6 × 10⁻⁶ / 10⁻³ = 6 × 10⁻⁴ rad.",
    "methodology": "Khoảng vân của nêm góc nghiêng α: i = λ / (2*n*α). Với nêm không khí n = 1 nên i = λ / (2α).",
    "tips": "Nhớ công thức: α = λ / (2*i). Góc nêm tỉ lệ nghịch với khoảng vân (nêm càng dốc thì vân càng sít nhau)."
  },
  {
    "id": "VLDC_004",
    "chapter": "Chương 1: Quang Học Sóng - Giao Thoa Ánh Sáng",
    "chapter_id": 1,
    "type": "mcq",
    "prompt": "Trong thí nghiệm vân tròn Newton tạo bởi thấu kính phẳng - lồi đặt trên bản thủy tinh phẳng, bán kính mặt cong thấu kính là R = 10 m, chiếu ánh sáng bước sóng λ = 0.5 µm. Bán kính của vân tối thứ 4 trong chùm tia phản xạ bằng bao nhiêu?",
    "options": [
      "A. 4.47 mm",
      "B. 3.16 mm",
      "C. 2.00 mm",
      "D. 5.25 mm"
    ],
    "correct_answer": "A",
    "correct_answer_text": "4.47 mm",
    "explanation": "Trong ánh sáng phản xạ, bán kính vân tối thứ k của vân tròn Newton được tính bởi công thức:\nrk = √(k * R * λ).\nVới k = 4, R = 10 m, λ = 0.5 µm = 0.5 × 10⁻⁶ m:\nr4 = √(4 * 10 * 0.5 × 10⁻⁶) = √(20 × 10⁻⁶) = √(2 × 10⁻⁵) ≈ 4.472 × 10⁻³ m = 4.47 mm.",
    "methodology": "Vân tròn Newton phản xạ: Vân tối rk = √(k*R*λ), Vân sáng rk = √((k - 0.5)*R*λ). Tâm hệ vân k = 0 luôn là điểm tối.",
    "tips": "Bấm Casio: √(4 * 10 * 0.5 * 10^-6) = 4.47*10^-3 m = 4.47 mm."
  },
  {
    "id": "VLDC_005",
    "chapter": "Chương 1: Quang Học Sóng - Giao Thoa Ánh Sáng",
    "chapter_id": 1,
    "type": "mcq",
    "prompt": "Tại sao cạnh của nêm không khí và tâm của hệ vân tròn Newton quan sát trong ánh sáng phản xạ luôn luôn là vân tối?",
    "options": [
      "A. Do khi phản xạ tại bề mặt môi trường chiết quang hơn, sóng ánh sáng bị mất nửa bước sóng (đổi pha π)",
      "B. Do năng lượng ánh sáng tại mép nêm và tâm tiếp xúc bị hấp thụ hoàn toàn",
      "C. Do hiệu đường đi hình học tại đó bằng đúng một bước sóng",
      "D. Do chiết suất của lớp không khí tại đó bằng 0"
    ],
    "correct_answer": "A",
    "correct_answer_text": "Do khi phản xạ tại bề mặt môi trường chiết quang hơn, sóng ánh sáng bị mất nửa bước sóng (đổi pha π)",
    "explanation": "Tại cạnh nêm (bề dày d = 0) và tâm tiếp xúc của vân tròn Newton (d = 0), hiệu đường đi hình học bằng 0.\nTuy nhiên, tia sáng phản xạ tại mặt dưới của nêm (phản xạ trên mặt thủy tinh chiết quang hơn không khí, n_tt > n_kk) bị đổi pha π, tương đương quang lộ tăng thêm λ/2.\nDo đó hiệu quang lộ thực tế là: ΔL = 2d + λ/2 = 0 + λ/2 = λ/2.\nHiệu quang lộ bằng nửa bước sóng tương ứng với điều kiện cực tiểu giao thoa, do đó tại đó luôn là VÂN TỐI.",
    "methodology": "Nguyên lý phản xạ sóng: Sóng phản xạ từ môi trường chiết quang kém sang môi trường chiết quang hơn bị đảo pha π (cộng thêm λ/2 vào quang lộ).",
    "tips": "Quy tắc vàng: Phản xạ trên mặt chiết quang hơn ⇒ Mất nửa bước sóng (λ/2) ⇒ Tâm tiếp xúc d = 0 luôn TỐI."
  },
  {
    "id": "VLDC_006",
    "chapter": "Chương 2: Quang Học Sóng - Nhiễu Xạ Ánh Sáng",
    "chapter_id": 2,
    "type": "mcq",
    "prompt": "Chiếu ánh sáng đơn sắc bước sóng λ = 0.5 µm từ một nguồn điểm đặt cách lỗ tròn 2 m. Sau lỗ tròn 2 m đặt một màn quan sát. Bán kính của lỗ tròn bằng bao nhiêu để tâm màn quan sát đạt độ sáng cực đại đầu tiên?",
    "options": [
      "A. 0.707 mm",
      "B. 1.000 mm",
      "C. 0.500 mm",
      "D. 1.414 mm"
    ],
    "correct_answer": "A",
    "correct_answer_text": "0.707 mm",
    "explanation": "Độ sáng tại tâm đạt cực đại đầu tiên khi lỗ tròn chứa đúng 1 đới cầu Fresnel (m = 1, đới lẻ).\nCông thức bán kính đới cầu Fresnel thứ m:\nrm = √((m * a * b * λ) / (a + b)).\nVới a = 2 m, b = 2 m, λ = 0.5 µm = 0.5 × 10⁻⁶ m, m = 1:\nr1 = √((1 * 2 * 2 * 0.5 × 10⁻⁶) / (2 + 2)) = √(2 × 10⁻⁶ / 4) = √(0.5 × 10⁻⁶) = √(5 × 10⁻⁷) ≈ 0.707 × 10⁻³ m = 0.707 mm.",
    "methodology": "Lỗ tròn: m lẻ ⇒ tâm sáng; m chẵn ⇒ tâm tối. Cực đại đầu tiên tương ứng m = 1.",
    "tips": "Bấm Casio: √( (2*2*0.5*10^-6) / 4 ) = 7.071*10^-4 m = 0.707 mm."
  },
  {
    "id": "VLDC_007",
    "chapter": "Chương 2: Quang Học Sóng - Nhiễu Xạ Ánh Sáng",
    "chapter_id": 2,
    "type": "mcq",
    "prompt": "Một chùm tia sáng đơn sắc song song bước sóng λ = 0.5 µm chiếu vuông góc vào một khe hẹp có bề rộng b = 0.1 mm. Đặt thấu kính hội tụ tiêu cự f = 1 m ngay sau khe để thu ảnh nhiễu xạ trên màn. Bề rộng của vân cực đại giữa bằng bao nhiêu?",
    "options": [
      "A. 10 mm",
      "B. 5 mm",
      "C. 20 mm",
      "D. 2 mm"
    ],
    "correct_answer": "A",
    "correct_answer_text": "10 mm",
    "explanation": "Điều kiện cực tiểu nhiễu xạ qua 1 khe hẹp: b * sin(φ) = k * λ.\nCực đại giữa nằm giữa hai cực tiểu thứ nhất k = ±1:\nsin(φ1) ≈ φ1 = λ / b.\nVị trí của cực tiểu thứ nhất trên màn đặt tại tiêu diện thấu kính (D = f):\nx1 = f * tan(φ1) ≈ f * φ1 = (f * λ) / b.\nBề rộng của cực đại giữa bằng khoảng cách giữa hai cực tiểu bậc 1 hai bên:\nΔx0 = 2 * x1 = 2 * (f * λ) / b = 2 * (1 m * 0.5 × 10⁻⁶ m) / (0.1 × 10⁻³ m) = 10⁻⁶ / 10⁻⁴ = 10⁻² m = 10 mm.",
    "methodology": "Nhiễu xạ qua khe hẹp: Bề rộng cực đại giữa rộng gấp đôi khoảng cách giữa hai cực tiểu liên tiếp: Δx0 = 2 * (f*λ / b).",
    "tips": "Quy tắc: Cực đại giữa khe hẹp rộng GẤP ĐÔI các cực đại phụ: Δx0 = 2*f*λ/b."
  },
  {
    "id": "VLDC_008",
    "chapter": "Chương 2: Quang Học Sóng - Nhiễu Xạ Ánh Sáng",
    "chapter_id": 2,
    "type": "mcq",
    "prompt": "Một cách tử nhiễu xạ phẳng có chu kỳ d = 2 µm. Chiếu vuông góc vào cách tử chùm sáng đơn sắc bước sóng λ = 0.5 µm. Tổng số cực đại chính quan sát được trên màn là:",
    "options": [
      "A. 9",
      "B. 8",
      "C. 7",
      "D. 4"
    ],
    "correct_answer": "A",
    "correct_answer_text": "9",
    "explanation": "Điều kiện cực đại chính của cách tử: d * sin(φ) = k * λ.\nVì |sin(φ)| ≤ 1 nên bậc cực đại thỏa mãn:\n|k| ≤ d / λ = 2 µm / 0.5 µm = 4.\nVậy k nhận các giá trị nguyên: k = 0, ±1, ±2, ±3, ±4.\nTổng số cực đại chính quan sát được là:\nN = 2 * k_max + 1 = 2 * 4 + 1 = 9 cực đại chính.",
    "methodology": "Số cực đại chính của cách tử: k_max = phần nguyên của [d/λ]. Tổng số = 2*k_max + 1.",
    "tips": "Nhớ cộng thêm 1 cho cực đại trung tâm k = 0: 2 * 4 + 1 = 9."
  },
  {
    "id": "VLDC_009",
    "chapter": "Chương 2: Quang Học Sóng - Nhiễu Xạ Ánh Sáng",
    "chapter_id": 2,
    "type": "mcq",
    "prompt": "Hiện tượng 'Điểm sáng Arago' (Poisson spot) trong quang học sóng là hiện tượng gì?",
    "options": [
      "A. Khi chiếu sáng một đĩa tròn chắn sáng nhỏ, ở chính giữa bóng tối của đĩa trên màn quan sát xuất hiện một điểm sáng",
      "B. Khi chiếu ánh sáng qua một lỗ tròn, tâm của lỗ tròn luôn luôn sáng bất kể bán kính",
      "C. Khi chiếu ánh sáng qua lăng kính, ánh sáng bị tách thành 7 màu cầu vồng",
      "D. Khi chiếu ánh sáng vào giọt nước, tia sáng bị phản xạ toàn phần tạo thành cầu vồng"
    ],
    "correct_answer": "A",
    "correct_answer_text": "Khi chiếu sáng một đĩa tròn chắn sáng nhỏ, ở chính giữa bóng tối của đĩa trên màn quan sát xuất hiện một điểm sáng",
    "explanation": "Theo phương pháp đới cầu Fresnel, đĩa tròn chắn mất k đới cầu đầu tiên (từ đới 1 đến k).\nCác đới cầu còn lại (từ k+1 trở đi) gửi dao động đến tâm M của bóng tối. Biên độ tổng hợp tại M là:\nA = A_{k+1} / 2 > 0 (không triệt tiêu).\nVì vậy tại chính tâm của bóng hình học đĩa tròn luôn luôn có một điểm sáng. Đây là bằng chứng thực nghiệm đanh thép khẳng định bản chất sóng của ánh sáng.",
    "methodology": "Nhiễu xạ đĩa tròn: Đĩa chắn k đới đầu, biên độ tại tâm A = A_{k+1}/2 > 0 nên tâm bóng tối luôn sáng.",
    "tips": "Điểm Arago = Đĩa tròn chắn sáng nhưng tâm bóng tối lại SÁNG."
  },
  {
    "id": "VLDC_010",
    "chapter": "Chương 3: Quang Học Sóng - Phân Cực Ánh Sáng",
    "chapter_id": 3,
    "type": "mcq",
    "prompt": "Chiếu chùm ánh sáng tự nhiên có cường độ I_tn qua hệ thống gồm hai kính phân cực phẳng có quang trục hợp với nhau một góc α = 60°. Bỏ qua sự hấp thụ ánh sáng của bản kính. Cường độ chùm sáng sau khi đi qua hai kính bằng:",
    "options": [
      "A. 0.125 I_tn",
      "B. 0.250 I_tn",
      "C. 0.500 I_tn",
      "D. 0.0625 I_tn"
    ],
    "correct_answer": "A",
    "correct_answer_text": "0.125 I_tn",
    "explanation": "1. Khi ánh sáng tự nhiên đi qua kính phân cực thứ nhất, cường độ giảm một nửa:\nI1 = I_tn / 2.\n2. Khi chùm ánh sáng phân cực này tiếp tục đi qua kính phân tích thứ hai nghiêng góc α = 60°, theo định luật Malus:\nI2 = I1 * cos²(α) = (I_tn / 2) * cos²(60°).\nVì cos(60°) = 0.5 nên cos²(60°) = 0.25.\nDo đó: I2 = (I_tn / 2) * 0.25 = 0.125 I_tn = (1/8) I_tn.",
    "methodology": "Định luật Malus: I = I0 * cos²(α). Ánh sáng tự nhiên qua kính 1 giảm 1/2.",
    "tips": "Bấm Casio: 0.5 * cos(60)² = 0.125 = 1/8."
  },
  {
    "id": "VLDC_011",
    "chapter": "Chương 3: Quang Học Sóng - Phân Cực Ánh Sáng",
    "chapter_id": 3,
    "type": "mcq",
    "prompt": "Tia sáng truyền từ không khí vào một bản thủy tinh có chiết suất n = √3. Để tia phản xạ là ánh sáng phân cực toàn phần thì góc tới i phải bằng bao nhiêu?",
    "options": [
      "A. 60°",
      "B. 30°",
      "C. 45°",
      "D. 53°"
    ],
    "correct_answer": "A",
    "correct_answer_text": "60°",
    "explanation": "Theo định luật Brewster, tia phản xạ là ánh sáng phân cực thẳng hoàn toàn khi góc tới i bằng góc Brewster iB thỏa mãn:\ntan(iB) = n2 / n1.\nỞ đây n1 = 1 (không khí), n2 = √3 (thủy tinh):\ntan(iB) = √3 / 1 = √3 ⇒ iB = arctan(√3) = 60°.",
    "methodology": "Định luật Brewster: tan(iB) = n2 / n1. Khi đó iB + r = 90°.",
    "tips": "Nhớ nhanh: tan(60°) = √3 ≈ 1.732; tan(45°) = 1; tan(30°) = 1/√3."
  },
  {
    "id": "VLDC_012",
    "chapter": "Chương 4: Quang Lượng Tử - Bức Xạ Nhiệt & Lượng Tử Ánh Sáng",
    "chapter_id": 4,
    "type": "mcq",
    "prompt": "Nhiệt độ tuyệt đối của một vật đen tuyệt đối tăng từ T1 = 1000 K lên T2 = 2000 K. Năng suất phát xạ toàn phần R của vật đó tăng lên bao nhiêu lần?",
    "options": [
      "A. 16 lần",
      "B. 4 lần",
      "C. 8 lần",
      "D. 2 lần"
    ],
    "correct_answer": "A",
    "correct_answer_text": "16 lần",
    "explanation": "Theo định luật Stefan - Boltzmann, năng suất phát xạ toàn phần của vật đen tuyệt đối tỉ lệ thuận với lũy thừa 4 của nhiệt độ tuyệt đối:\nR = σ * T⁴.\nDo đó tỉ số năng suất phát xạ khi nhiệt độ tăng từ T1 lên T2 là:\nR2 / R1 = (T2 / T1)⁴ = (2000 / 1000)⁴ = 2⁴ = 16 lần.",
    "methodology": "Định luật Stefan-Boltzmann: R ∝ T⁴. Nhiệt độ tăng k lần thì năng suất phát xạ tăng k⁴ lần.",
    "tips": "Bấm máy: 2^4 = 16 lần."
  },
  {
    "id": "VLDC_013",
    "chapter": "Chương 4: Quang Lượng Tử - Bức Xạ Nhiệt & Lượng Tử Ánh Sáng",
    "chapter_id": 4,
    "type": "mcq",
    "prompt": "Bước sóng ứng với năng suất phát xạ cực đại của Mặt Trời là λm = 0.50 µm. Coi Mặt Trời phát xạ như vật đen tuyệt đối. Biết hằng số Wien b = 2.898 × 10⁻³ m·K. Nhiệt độ bề mặt Mặt Trời xấp xỉ bằng:",
    "options": [
      "A. 5796 K",
      "B. 6200 K",
      "C. 5400 K",
      "D. 4800 K"
    ],
    "correct_answer": "A",
    "correct_answer_text": "5796 K",
    "explanation": "Theo định luật dịch chuyển Wien:\nλm * T = b ⇒ T = b / λm.\nVới b = 2.898 × 10⁻³ m·K, λm = 0.50 µm = 0.50 × 10⁻⁶ m:\nT = (2.898 × 10⁻³) / (0.50 × 10⁻⁶) = 5796 K.",
    "methodology": "Định luật dịch chuyển Wien: T = b / λm.",
    "tips": "Bấm Casio: 2.898*10^-3 / (0.5*10^-6) = 5796 K."
  },
  {
    "id": "VLDC_014",
    "chapter": "Chương 4: Quang Lượng Tử - Bức Xạ Nhiệt & Lượng Tử Ánh Sáng",
    "chapter_id": 4,
    "type": "mcq",
    "prompt": "Chiếu chùm bức xạ có bước sóng λ = 0.2 µm vào tấm kim loại có công thoát electron A = 3.2 eV. Cho h = 6.625 × 10⁻³⁴ J·s, c = 3 × 10⁸ m/s, 1 eV = 1.6 × 10⁻¹⁹ J. Hiệu điện thế hãm Uh để triệt tiêu dòng quang điện bằng:",
    "options": [
      "A. 3.01 V",
      "B. 4.25 V",
      "C. 1.85 V",
      "D. 6.21 V"
    ],
    "correct_answer": "A",
    "correct_answer_text": "3.01 V",
    "explanation": "Năng lượng của photon chiếu tới:\nε = (h * c) / λ = (6.625 × 10⁻³⁴ * 3 × 10⁸) / (0.2 × 10⁻⁶) = 9.9375 × 10⁻¹⁹ J.\nĐổi sang eV:\nε = (9.9375 × 10⁻¹⁹) / (1.6 × 10⁻¹⁹) ≈ 6.21 eV.\nTheo phương trình Einstein:\nε = A + e * Uh ⇒ e * Uh = ε - A = 6.21 eV - 3.2 eV = 3.01 eV.\nDo đó hiệu điện thế hãm Uh = 3.01 V.",
    "methodology": "Công thức Einstein: e*Uh = hc/λ - A. Chuyển hết sang eV để tính Uh = ε(eV) - A(eV).",
    "tips": "Mẹo siêu nhanh: ε(eV) = 1.242 / λ(µm). Với λ = 0.2 µm ⇒ ε = 1.242 / 0.2 = 6.21 eV. Uh = 6.21 - 3.2 = 3.01 V."
  },
  {
    "id": "VLDC_015",
    "chapter": "Chương 4: Quang Lượng Tử - Bức Xạ Nhiệt & Lượng Tử Ánh Sáng",
    "chapter_id": 4,
    "type": "mcq",
    "prompt": "Trong hiện tượng tán xạ Compton, photon tới tán xạ trên electron tự do đứng yên và bay lệch đi một góc θ = 90°. Bước sóng Compton của electron là λc = 0.0243 Å. Độ tăng bước sóng Δλ của photon tán xạ bằng:",
    "options": [
      "A. 0.0243 Å",
      "B. 0.0486 Å",
      "C. 0.0121 Å",
      "D. 0.0364 Å"
    ],
    "correct_answer": "A",
    "correct_answer_text": "0.0243 Å",
    "explanation": "Công thức tính độ tăng bước sóng Compton:\nΔλ = λc * (1 - cos θ).\nVới θ = 90° ⇒ cos(90°) = 0:\nΔλ = λc * (1 - 0) = λc = 0.0243 Å = 2.43 × 10⁻¹² m.",
    "methodology": "Công thức Compton: Δλ = λc * (1 - cos θ) = 2*λc * sin²(θ/2). Khi θ = 90° thì Δλ = λc. Khi θ = 180° thì Δλ = 2*λc.",
    "tips": "Nhớ mốc góc: θ = 60° ⇒ Δλ = 0.5*λc; θ = 90° ⇒ Δλ = λc; θ = 180° ⇒ Δλ = 2*λc."
  },
  {
    "id": "VLDC_016",
    "chapter": "Chương 5: Cơ Học Lượng Tử - Sóng De Broglie & Giếng Thế",
    "chapter_id": 5,
    "type": "mcq",
    "prompt": "Hạt electron không vận tốc đầu được gia tốc qua hiệu điện thế U = 100 V. Bước sóng De Broglie của electron sau khi gia tốc xấp xỉ bằng:",
    "options": [
      "A. 1.23 Å",
      "B. 0.123 Å",
      "C. 12.27 Å",
      "D. 2.45 Å"
    ],
    "correct_answer": "A",
    "correct_answer_text": "1.23 Å",
    "explanation": "Động năng của electron thu được khi gia tốc qua hiệu điện thế U:\nWđ = e * U.\nĐộng lượng: p = √(2 * m * Wđ) = √(2 * m * e * U).\nBước sóng De Broglie:\nλ = h / p = h / √(2 * m * e * U).\nCông thức tính nhanh cho electron: λ (Å) = 12.27 / √U (với U tính bằng Vôn).\nVới U = 100 V:\nλ = 12.27 / √100 = 12.27 / 10 = 1.227 Å ≈ 1.23 Å = 1.23 × 10⁻¹⁰ m.",
    "methodology": "Công thức De Broglie cho electron phi tương đối tính: λ = 12.27 / √U (Å).",
    "tips": "Mẹo Casio siêu tốc: Gõ 12.27 / √100 = 1.227 Å."
  },
  {
    "id": "VLDC_017",
    "chapter": "Chương 5: Cơ Học Lượng Tử - Sóng De Broglie & Giếng Thế",
    "chapter_id": 5,
    "type": "mcq",
    "prompt": "Một hạt vi mô chuyển động trong giếng thế năng một chiều sâu vô hạn có bề rộng a. Năng lượng ở trạng thái cơ bản là E1 = 2 eV. Năng lượng cần cung cấp để hạt nhảy từ trạng thái cơ bản (n = 1) lên trạng thái kích thích thứ nhất (n = 2) là:",
    "options": [
      "A. 6 eV",
      "B. 8 eV",
      "C. 4 eV",
      "D. 12 eV"
    ],
    "correct_answer": "A",
    "correct_answer_text": "6 eV",
    "explanation": "Mức năng lượng của hạt trong giếng thế 1 chiều sâu vô hạn tỉ lệ với n²:\nEn = n² * E1 (với n = 1, 2, 3...).\nTrạng thái cơ bản: n = 1 ⇒ E1 = 2 eV.\nTrạng thái kích thích thứ nhất ứng với n = 2:\nE2 = 2² * E1 = 4 * 2 eV = 8 eV.\nNăng lượng cần cung cấp để kích thích hạt là:\nΔE = E2 - E1 = 8 eV - 2 eV = 6 eV (hoặc ΔE = (2² - 1²)*E1 = 3 * 2 = 6 eV).",
    "methodology": "Mức năng lượng giếng thế: En = n² * E1. Năng lượng kích thích: ΔE = (n2² - n1²)*E1.",
    "tips": "Mẹo tính: (2² - 1²) * 2 = 3 * 2 = 6 eV."
  },
  {
    "id": "VLDC_018",
    "chapter": "Chương 5: Cơ Học Lượng Tử - Sóng De Broglie & Giếng Thế",
    "chapter_id": 5,
    "type": "mcq",
    "prompt": "Hạt chuyển động trong giếng thế một chiều sâu vô hạn bề rộng a ở trạng thái cơ bản (n = 1). Mật độ xác suất tìm thấy hạt đạt giá trị lớn nhất tại vị trí nào trong giếng?",
    "options": [
      "A. Chính giữa giếng (x = a / 2)",
      "B. Tại hai mép thành giếng (x = 0 và x = a)",
      "C. Mật độ xác suất bằng nhau ở mọi điểm trong giếng",
      "D. Tại x = a / 4 và x = 3a / 4"
    ],
    "correct_answer": "A",
    "correct_answer_text": "Chính giữa giếng (x = a / 2)",
    "explanation": "Hàm sóng của hạt ở trạng thái n = 1:\nψ1(x) = √(2/a) * sin(π * x / a).\nMật độ xác suất tìm hạt là:\n|ψ1(x)|² = (2/a) * sin²(π * x / a).\nHàm sin²(π*x/a) đạt giá trị cực đại bằng 1 khi:\nπ*x/a = π/2 ⇒ x = a / 2 (chính giữa giếng).\nTại hai thành giếng x = 0 và x = a, sin = 0 nên mật độ xác suất bằng 0.",
    "methodology": "Mật độ xác suất |ψn(x)|² tỉ lệ với sin²(n*π*x/a). Với n = 1, cực đại duy nhất tại x = a/2.",
    "tips": "Nắm bản chất: Ở n = 1, hạt có xu hướng tập trung nhiều nhất ở trung tâm x = a/2."
  },
  {
    "id": "VLDC_019",
    "chapter": "Chương 6: Vật Lý Nguyên Tử & Hạt Nhân",
    "chapter_id": 6,
    "type": "mcq",
    "prompt": "Theo mẫu nguyên tử Bo của nguyên tử Hydro, electron chuyển từ quỹ đạo có mức năng lượng n = 3 về quỹ đạo n = 2 thì phát ra bức xạ thuộc dãy nào và ở vùng ánh sáng nào?",
    "options": [
      "A. Dãy Balmer, vùng ánh sáng nhìn thấy (khả kiến)",
      "B. Dãy Lyman, vùng tử ngoại",
      "C. Dãy Paschen, vùng hồng ngoại",
      "D. Dãy Brackett, vùng hồng ngoại xa"
    ],
    "correct_answer": "A",
    "correct_answer_text": "Dãy Balmer, vùng ánh sáng nhìn thấy (khả kiến)",
    "explanation": "Quy tắc các dãy quang phổ của nguyên tử Hydro:\n- Chuyển về n = 1: Dãy Lyman (vùng tử ngoại).\n- Chuyển về n = 2: Dãy Balmer (vùng ánh sáng nhìn thấy / khả kiến, vạch đỏ Hα ứng với chuyển từ 3 về 2).\n- Chuyển về n = 3: Dãy Paschen (vùng hồng ngoại).\n- Chuyển về n = 4: Dãy Brackett (hồng ngoại xa).\nVậy electron chuyển từ n = 3 về n = 2 phát ra vạch Hα thuộc dãy Balmer trong vùng ánh sáng nhìn thấy.",
    "methodology": "Ghi nhớ quy ước dãy quang phổ: Về 1 = Lyman (Tử ngoại), Về 2 = Balmer (Khả kiến), Về 3 = Paschen (Hồng ngoại).",
    "tips": "Câu thần chú: '1 Ly Tử - 2 Ban Nhìn - 3 Pát Hồng'."
  },
  {
    "id": "VLDC_020",
    "chapter": "Chương 6: Vật Lý Nguyên Tử & Hạt Nhân",
    "chapter_id": 6,
    "type": "mcq",
    "prompt": "Chất phóng xạ Poloni ²¹⁰Po có chu kỳ bán rã T = 138 ngày. Ban đầu có m0 = 10 g Poloni. Sau thời gian t = 414 ngày, khối lượng Poloni còn lại chưa bị phân rã là:",
    "options": [
      "A. 1.25 g",
      "B. 2.50 g",
      "C. 0.625 g",
      "D. 5.00 g"
    ],
    "correct_answer": "A",
    "correct_answer_text": "1.25 g",
    "explanation": "Số chu kỳ bán rã đã trôi qua:\nk = t / T = 414 / 138 = 3 chu kỳ.\nTheo định luật phân rã phóng xạ, khối lượng chất phóng xạ còn lại sau k chu kỳ là:\nm(t) = m0 * 2^(-k) = m0 / 2^k = 10 g / 2³ = 10 / 8 = 1.25 g.",
    "methodology": "Định luật phóng xạ: m = m0 / 2^(t/T).",
    "tips": "Bấm Casio: 10 / (2^3) = 1.25 g."
  },
  {
    "id": "VLDC_021",
    "chapter": "Chương 1: Quang Học Sóng - Giao Thoa Ánh Sáng",
    "chapter_id": 1,
    "type": "fill",
    "prompt": "Trong thí nghiệm khe Young, cho khoảng cách hai khe a = 2 mm, khoảng cách đến màn D = 2 m. Chiếu ánh sáng có bước sóng λ = 0.5 µm. Tính khoảng vân giao thoa i (nhập giá trị theo đơn vị mm, chỉ điền số):",
    "options": [],
    "correct_answer": "0.5",
    "correct_answer_text": "0.5 mm",
    "explanation": "Khoảng vân giao thoa: i = (λ * D) / a = (0.5 × 10⁻⁶ m * 2 m) / (2 × 10⁻³ m) = 0.5 × 10⁻³ m = 0.5 mm.",
    "methodology": "Công thức: i = λ * D / a. Đổi tất cả về cùng đơn vị m hoặc dùng trực tiếp: i(mm) = λ(µm) * D(m) / a(mm).",
    "tips": "Mẹo tính nhẩm: i = 0.5 * 2 / 2 = 0.5 mm."
  },
  {
    "id": "VLDC_022",
    "chapter": "Chương 4: Quang Lượng Tử - Bức Xạ Nhiệt & Lượng Tử Ánh Sáng",
    "chapter_id": 4,
    "type": "fill",
    "prompt": "Cho công thoát của kim loại Natri là A = 2.484 eV. Cho h = 6.625 × 10⁻³⁴ J·s, c = 3 × 10⁸ m/s, 1 eV = 1.6 × 10⁻¹⁹ J. Tính giới hạn quang điện λ0 của Natri (nhập giá trị theo đơn vị µm, làm tròn 2 chữ số thập phân):",
    "options": [],
    "correct_answer": "0.5",
    "correct_answer_text": "0.50 µm",
    "explanation": "Giới hạn quang điện: λ0 = (h * c) / A.\nA = 2.484 * 1.6 × 10⁻¹⁹ J ≈ 3.9744 × 10⁻¹⁹ J.\nλ0 = (6.625 × 10⁻³⁴ * 3 × 10⁸) / (3.9744 × 10⁻¹⁹) = 0.500 × 10⁻⁶ m = 0.50 µm.",
    "methodology": "Công thức: λ0 = hc / A. Mẹo: λ0 (µm) = 1.242 / A(eV).",
    "tips": "Bấm nhanh: 1.242 / 2.484 = 0.5 µm."
  },
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
  },
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
];
