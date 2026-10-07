window.XSTK_KNOWLEDGE_DATA = {
  "subject": "Xác Suất Thống Kê",
  "code": "XSTK_KMA",
  "chapters": [
    {
      "id": "chap1",
      "num": 1,
      "clo": "CHƯƠNG 1",
      "title": "Chương 1: Biến Cố Ngẫu Nhiên & Định Nghĩa Xác Suất",
      "summary": "Nghiên cứu phép thử ngẫu nhiên, không gian mẫu Ω, các loại biến cố (chắc chắn, không thể, đối lập, xung khắc, độc lập) và các định nghĩa xác suất cổ điển, hình học, thống kê cùng các công thức giải tích tổ hợp cơ bản (Quy tắc cộng, nhân, Hoán vị, Chỉnh hợp, Tổ hợp).",
      "core_formulas": [
        {
          "name": "Hoán vị, Chỉnh hợp, Tổ hợp",
          "formula": "$P_n=n!;\\quad A_n^k=\\frac{n!}{(n-k)!};\\quad C_n^k=\\frac{n!}{k!(n-k)!}$",
          "desc": "Hoán vị sắp xếp n phần tử. Chỉnh hợp chọn k từ n có xếp thứ tự. Tổ hợp chọn k từ n không phân biệt thứ tự."
        },
        {
          "name": "Định nghĩa xác suất cổ điển",
          "formula": "$P(A)=\\frac mn=\\frac{|A|}{|\\Omega|}$",
          "desc": "Trong đó n = |Ω| là tổng số biến cố đồng khả năng, m = |A| là số biến cố thuận lợi cho A. 0 ≤ P(A) ≤ 1."
        },
        {
          "name": "Biến cố đối lập & Xung khắc",
          "formula": "$P(\\overline A)=1-P(A)$. Nếu $A,B$ xung khắc: $P(A\\cup B)=P(A)+P(B)$",
          "desc": "A và A_bar không bao giờ cùng xảy ra nhưng một trong hai chắc chắn xảy ra: A ∪ A_bar = Ω, A ∩ A_bar = ∅."
        },
        {
          "name": "Xác suất hình học",
          "formula": "$P(A)=\\frac{\\operatorname{Mes}(g)}{\\operatorname{Mes}(G)}$",
          "desc": "Mes là độ đo (độ dài L, diện tích S, thể tích V). Thường gặp ở bài toán gặp gỡ, chọn ngẫu nhiên 2 số trên đoạn [0, T]."
        }
      ],
      "magic_rules": [
        "Cụm từ 'ít nhất 1 lần': Luôn dùng biến cố đối lập: P(ít nhất 1) = 1 - P(không có lần nào).",
        "Chọn đồng thời k vật từ n vật không phân biệt thứ tự: Luôn dùng Tổ hợp C(k, n).",
        "Chọn k vật có thứ tự hoặc phân công chức vụ: Dùng Chỉnh hợp A(k, n).",
        "Hai biến cố xung khắc (A ∩ B = ∅) thì không thể độc lập nếu cả hai có P > 0."
      ],
      "casio_shortcuts": [
        "Tính Tổ hợp C(k, n): Nhập [n] -> SHIFT -> [÷] (nCr) -> [k] -> [=]",
        "Tính Chỉnh hợp A(k, n): Nhập [n] -> SHIFT -> [×] (nPr) -> [k] -> [=]",
        "Tính Giai thừa n!: Nhập [n] -> SHIFT -> [x⁻¹] (x!) -> [=]"
      ]
    },
    {
      "id": "chap2",
      "num": 2,
      "clo": "CHƯƠNG 2",
      "title": "Chương 2: Các Quy Tắc Tính Xác Suất Cơ Bản",
      "summary": "Nghiên cứu các định lý xác suất quan trọng nhất: công thức cộng xác suất (cho biến cố bất kỳ và xung khắc), xác suất có điều kiện P(A|B), công thức nhân xác suất, hệ đầy đủ các biến cố, công thức xác suất đầy đủ, công thức Bayes đảo ngược xác suất, và lược đồ dãy phép thử Bernoulli.",
      "core_formulas": [
        {
          "name": "Công thức cộng xác suất tổng quát",
          "formula": "$P(A\\cup B)=P(A)+P(B)-P(AB)$",
          "desc": "Cho 3 biến cố: P(A∪B∪C) = P(A)+P(B)+P(C) - P(AB)-P(BC)-P(CA) + P(ABC)."
        },
        {
          "name": "Xác suất có điều kiện & Công thức nhân",
          "formula": "$P(A\\mid B)=\\frac{P(AB)}{P(B)}\\ \\Rightarrow\\ P(AB)=P(B)P(A\\mid B)$",
          "desc": "Nếu A và B độc lập: P(A|B) = P(A) và P(AB) = P(A) * P(B)."
        },
        {
          "name": "Công thức xác suất đầy đủ",
          "formula": "$P(A)=\\sum_i P(H_i)P(A\\mid H_i)$ với $\\{H_i\\}$ là hệ đầy đủ",
          "desc": "Hệ {Hi} xung khắc từng đôi và có tổng bằng không gian mẫu: Σ P(Hi) = 1."
        },
        {
          "name": "Công thức Bayes (xác suất hậu nghiệm)",
          "formula": "$P(H_k\\mid A)=\\frac{P(H_k)P(A\\mid H_k)}{P(A)}=\\frac{P(H_k)P(A\\mid H_k)}{\\sum_i P(H_i)P(A\\mid H_i)}$",
          "desc": "Dùng để đánh giá lại xác suất của nguyên nhân Hk khi biết kết quả biến cố A đã xảy ra."
        },
        {
          "name": "Công thức Bernoulli",
          "formula": "$P_n(k)=C_n^k p^k q^{n-k}$ với $q=1-p$",
          "desc": "Xác suất trong n phép thử độc lập có đúng k lần biến cố A xuất hiện với xác suất mỗi lần là p. Số có khả năng nhất k0 thỏa: np - q ≤ k0 ≤ np + p."
        }
      ],
      "magic_rules": [
        "Đề bài cho nguồn hàng/phân xưởng/hộp rồi hỏi xác suất lấy được phế phẩm/sản phẩm loại 1: Nhận diện ngay CÔNG THỨC XÁC SUẤT ĐẦY ĐỦ.",
        "Đề bài cho biết 'sản phẩm lấy ra là phế phẩm, tính xác suất nó do máy 1 sản xuất': Nhận diện ngay CÔNG THỨC BAYES.",
        "Thực hiện n lần độc lập, mỗi lần xác suất thành công không đổi p: Áp dụng LƯỢC ĐỒ BERNOULLI.",
        "Số có khả năng xảy ra nhất k0: np - q ≤ k0 ≤ np + p. Nếu khoảng chứa 2 số nguyên thì cả 2 đều là số có khả năng nhất."
      ],
      "casio_shortcuts": [
        "Bấm Bayes: Lưu P(A) vào biến [A] bằng cách bấm biểu thức mẫu số -> [STO] -> [A]. Sau đó bấm Tử số / [ALPHA] [A].",
        "Tính nhanh Bernoulli P(X = k): MENU -> 7 -> Cuộn xuống -> Chọn 4: Binomial PD -> Chọn 2: Variable -> Nhập k, N, p -> [=]"
      ]
    },
    {
      "id": "chap3",
      "num": 3,
      "clo": "CHƯƠNG 3",
      "title": "Chương 3: Đại Lượng Ngẫu Nhiên Rời Rạc & Các Quy Luật Phân Phối",
      "summary": "Nghiên cứu biến ngẫu nhiên rời rạc, bảng phân phối xác suất, hàm phân phối tích lũy F(x), các tham số đặc trưng (Kỳ vọng toán E(X), Phương sai V(X), Độ lệch chuẩn σ(X), Mốt Mod(X)), và các phân phối rời rạc kinh điển: Không - Một A(p), Nhị thức B(n, p), Siêu bội H(N, M, n), Poisson P(λ).",
      "core_formulas": [
        {
          "name": "Kỳ vọng & Phương sai rời rạc",
          "formula": "$E(X)=\\sum_i x_i p_i;\\quad V(X)=E(X^2)-[E(X)]^2=\\sum_i x_i^2p_i-[E(X)]^2$",
          "desc": "Độ lệch chuẩn: σ(X) = √V(X). Tính chất: E(aX + b) = aE(X) + b; V(aX + b) = a^2 * V(X). Nếu X, Y độc lập: V(X ± Y) = V(X) + V(Y)."
        },
        {
          "name": "Phân phối Nhị thức B(n, p)",
          "formula": "$P(X=k)=C_n^k p^k(1-p)^{n-k};\\quad E(X)=np;\\quad V(X)=np(1-p)$",
          "desc": "Số lần thành công trong n phép thử Bernoulli độc lập."
        },
        {
          "name": "Phân phối Poisson P(λ)",
          "formula": "$P(X=k)=\\frac{\\lambda^k e^{-\\lambda}}{k!};\\quad E(X)=V(X)=\\lambda$",
          "desc": "Mô hình hóa số sự kiện hiếm xảy ra trong khoảng thời gian hoặc không gian nhất định. Nhị thức xấp xỉ Poisson khi n lớn, p nhỏ: λ = n*p."
        },
        {
          "name": "Phân phối Siêu bội H(N, M, n)",
          "formula": "$P(X=k)=\\frac{C_M^k C_{N-M}^{n-k}}{C_N^n};\\quad E(X)=n\\frac MN$",
          "desc": "Lấy không hoàn lại n phần tử từ tập N phần tử có chứa M phần tử mang dấu hiệu A."
        }
      ],
      "magic_rules": [
        "Luôn kiểm tra tổng xác suất trong bảng: Σ pi = 1. Nếu tìm tham số k thì k = 1 - Σ(còn lại).",
        "Tính nhanh V(X): Tính E(X) và E(X^2) riêng biệt rồi lấy V(X) = E(X^2) - [E(X)]^2. Phương sai không bao giờ âm!",
        "Phân phối Poisson có một đặc tính vàng độc nhất: Kỳ vọng luôn BẰNG Phương sai (E(X) = V(X) = λ).",
        "Lấy không hoàn lại: Dùng Siêu bội H(N, M, n). Lấy có hoàn lại: Dùng Nhị thức B(n, p) với p = M/N."
      ],
      "casio_shortcuts": [
        "Tính E(X), V(X) bảng PPXS: MENU -> 6 (Statistics) -> 1 (1-Variable). Nếu chưa có cột FREQ: SHIFT MENU -> Cuộn xuống -> 3 (Statistics) -> 1 (ON). Nhập xi vào cột X, pi vào cột FREQ. Bấm OPTN -> 3 (1-Variable Calc). Màn hình hiện x̄ = E(X), σx = độ lệch chuẩn, σ²x = V(X)!",
        "Tính xác suất Poisson: MENU -> 7 -> Cuộn xuống 2 lần -> 2 (Poisson PD) -> Chọn Variable -> Nhập x, λ -> [=]"
      ]
    },
    {
      "id": "chap4",
      "num": 4,
      "clo": "CHƯƠNG 4",
      "title": "Chương 4: Đại Lượng Ngẫu Nhiên Liên Tục & Các Quy Luật Phân Phối",
      "summary": "Nghiên cứu biến ngẫu nhiên liên tục, hàm mật độ xác suất f(x), hàm phân phối tích lũy F(x), tích phân tính xác suất P(a ≤ X ≤ b), kỳ vọng E(X), phương sai V(X), phân phối Đều U(a, b), phân phối Mũ Exp(λ), và đặc biệt là phân phối Chuẩn Gauss N(μ, σ²) cùng hàm Laplace Φ(x).",
      "core_formulas": [
        {
          "name": "Mối quan hệ f(x) và F(x)",
          "formula": "$F(x)=\\int_{-\\infty}^x f(t)\\,dt;\\quad f(x)=F'(x);\\quad \\int_{-\\infty}^{+\\infty}f(x)\\,dx=1$",
          "desc": "Xác suất rơi vào khoảng: P(a ≤ X ≤ b) = F(b) - F(a) = ∫(a đến b) f(x) dx. Với biến liên tục: P(X = c) = 0."
        },
        {
          "name": "Kỳ vọng & Phương sai liên tục",
          "formula": "$E(X)=\\int_{-\\infty}^{+\\infty}xf(x)\\,dx;\\quad V(X)=\\int_{-\\infty}^{+\\infty}x^2f(x)\\,dx-[E(X)]^2$",
          "desc": "Nếu mật độ đối xứng qua x = c và kỳ vọng tồn tại thì E(X) = c; c là một trung vị. Mốt không nhất thiết bằng c, trừ khi có thêm điều kiện về dạng mật độ."
        },
        {
          "name": "Phân phối Chuẩn N(μ, σ²)",
          "formula": "$f(x)=\\frac1{\\sigma\\sqrt{2\\pi}}e^{-(x-\\mu)^2/(2\\sigma^2)};\\quad E(X)=\\mu;\\quad V(X)=\\sigma^2$",
          "desc": "Quy chuẩn hóa Z = (X - μ) / σ ~ N(0, 1). P(a ≤ X ≤ b) = Φ((b - μ)/σ) - Φ((a - μ)/σ)."
        },
        {
          "name": "Quy tắc 3-Sigma (3σ)",
          "formula": "$P(|X-\\mu|<3\\sigma)=2\\Phi(3)-1\\approx0.9973\\ (99.73\\%)$",
          "desc": "Hầu như toàn bộ giá trị của phân phối chuẩn đều nằm trong khoảng (μ - 3σ, μ + 3σ)."
        },
        {
          "name": "Phân phối Đều U(a, b) & Phân phối Mũ Exp(λ)",
          "formula": "$U(a,b):\\ E(X)=\\frac{a+b}2,\\ V(X)=\\frac{(b-a)^2}{12}$. $\\operatorname{Exp}(\\lambda):\\ f(x)=\\lambda e^{-\\lambda x},\\ E(X)=\\frac1\\lambda,\\ V(X)=\\frac1{\\lambda^2}$",
          "desc": "Phân phối mũ có tính chất 'không nhớ': P(X > s + t | X > s) = P(X > t)."
        }
      ],
      "magic_rules": [
        "Xác suất tại 1 điểm riêng lẻ của biến ngẫu nhiên liên tục luôn bằng 0: P(X = c) = 0. Do đó P(a ≤ X ≤ b) = P(a < X < b).",
        "Tìm hằng số chuẩn hóa k: Cho ∫ f(x) dx = 1 trên toàn miền xác định.",
        "Tính xác suất phân phối chuẩn: Chuẩn hóa Z = (X - μ) / σ rồi tra hàm Laplace hoặc bấm trực tiếp máy tính Casio fx-580VNX.",
        "Độ lệch tuyệt đối: P(|X - μ| < ε) = 2 * Φ(ε / σ) - 1."
      ],
      "casio_shortcuts": [
        "Bấm phân phối Chuẩn trực tiếp: MENU -> 7 -> 2 (Normal CD). Nhập Lower, Upper, σ, μ -> [=]. Casio tự tích phân và xuất xác suất chính xác đến 9 chữ số thập phân!",
        "Ví dụ tính P(X < 5) với X ~ N(3, 4): dùng Lower = -1*10^9 để xấp xỉ -∞, Upper = 5, σ = 2, μ = 3 -> Kết quả ≈ 0.84134."
      ]
    },
    {
      "id": "chap5",
      "num": 5,
      "clo": "CHƯƠNG 5",
      "title": "Chương 5: Đại Lượng Ngẫu Nhiên Hai Chiều",
      "summary": "Nghiên cứu vector ngẫu nhiên hai chiều (X, Y) rời rạc, bảng phân phối xác suất đồng thời pij = P(X = xi, Y = yj), các phân phối xác suất biên pi và qj, phân phối điều kiện, kỳ vọng điều kiện, hiệp phương sai Cov(X, Y), hệ số tương quan tuyến tính ρXY, và điều kiện độc lập của hai biến ngẫu nhiên.",
      "core_formulas": [
        {
          "name": "Phân phối xác suất biên",
          "formula": "$P(X=x_i)=p_i=\\sum_j p_{ij};\\quad P(Y=y_j)=q_j=\\sum_i p_{ij};\\quad \\sum_i\\sum_j p_{ij}=1$",
          "desc": "Tính xác suất lề bằng cách cộng các phần tử theo hàng hoặc theo cột của bảng phân phối đồng thời."
        },
        {
          "name": "Điều kiện độc lập của X và Y",
          "formula": "$P(X=x_i,Y=y_j)=P(X=x_i)P(Y=y_j)$ với mọi $i,j$",
          "desc": "Nếu chỉ cần 1 ô không thỏa mãn tích xác suất lề thì X và Y phụ thuộc ngẫu nhiên."
        },
        {
          "name": "Hiệp phương sai Cov(X, Y)",
          "formula": "$\\operatorname{Cov}(X,Y)=E(XY)-E(X)E(Y)=\\sum_i\\sum_j x_i y_j p_{ij}-E(X)E(Y)$",
          "desc": "Nếu X, Y độc lập thì Cov(X, Y) = 0 (chiều ngược lại chưa chắc đúng). Cov(X, X) = V(X)."
        },
        {
          "name": "Hệ số tương quan ρXY (hoặc rXY)",
          "formula": "$\\rho_{XY}=\\frac{\\operatorname{Cov}(X,Y)}{\\sigma(X)\\sigma(Y)};\\quad -1\\le\\rho_{XY}\\le1$",
          "desc": "|ρXY| đo lường mức độ liên hệ tuyến tính. |ρXY| = 1: quan hệ tuyến tính hoàn toàn Y = aX + b. ρXY = 0: không tương quan tuyến tính."
        }
      ],
      "magic_rules": [
        "Muốn kiểm tra X và Y độc lập: Chọn ngay ô có xác suất khác 0, kiểm tra pij có bằng pi * qj hay không. Chỉ cần 1 ô sai là kết luận phụ thuộc ngay!",
        "Nếu X và Y độc lập: Cov(X, Y) = 0 và ρXY = 0, đồng thời V(X + Y) = V(X) + V(Y) và E(XY) = E(X)*E(Y).",
        "Hiệp phương sai âm (Cov < 0): X tăng thì Y có xu hướng giảm (tương quan nghịch).",
        "Hiệp phương sai dương (Cov > 0): X tăng thì Y có xu hướng tăng (tương quan thuận)."
      ],
      "casio_shortcuts": [
        "Bấm Hồi quy tuyến tính & Tương quan 2 biến: MENU -> 6 -> 2 (y = a + bx) -> Nhập cột X, Y và tần số FREQ -> OPTN -> 3 (2-Variable Calc) -> Màn hình trả về x̄, ȳ, sx, sy, và r (hệ số tương quan ρXY)!"
      ]
    },
    {
      "id": "chap6",
      "num": 6,
      "clo": "CHƯƠNG 6",
      "title": "Chương 6: Thống Kê Mô Tả & Lý Thuyết Mẫu",
      "summary": "Nghiên cứu mẫu ngẫu nhiên W = (X1, X2, ..., Xn), kích thước mẫu n, các đặc trưng mẫu: trung bình mẫu X_bar, phương sai mẫu S^2, phương sai mẫu hiệu chỉnh S*^2, độ lệch chuẩn mẫu s và s*, tỷ lệ mẫu F = m/n, và các phân phối xác suất quan trọng trong thống kê: phân phối Student t(n-1), phân phối Chi-bình phương χ²(n-1), và phân phối Fisher F(k1, k2).",
      "core_formulas": [
        {
          "name": "Trung bình mẫu & Phương sai mẫu hiệu chỉnh",
          "formula": "$\\bar x=\\frac1n\\sum_i n_ix_i;\\quad s_*^2=\\frac1{n-1}\\sum_i n_i(x_i-\\bar x)^2=\\frac n{n-1}s^2$",
          "desc": "s*^2 là ước lượng không chệch của phương sai tổng thể σ^2. Khi n lớn (n ≥ 30), s*^2 xấp xỉ s^2."
        },
        {
          "name": "Công thức tính nhanh phương sai mẫu",
          "formula": "$s^2=\\frac1n\\sum_i n_ix_i^2-\\bar x^2;\\quad s_*^2=\\frac n{n-1}\\left(\\frac1n\\sum_i n_ix_i^2-\\bar x^2\\right)$",
          "desc": "Công thức rút gọn kinh điển dùng khi tính toán thủ công hoặc bấm máy Casio."
        },
        {
          "name": "Tỷ lệ mẫu F (hoặc p̂)",
          "formula": "$f=\\frac mn$",
          "desc": "m là số phần tử trong mẫu mang dấu hiệu A, n là kích thước mẫu. E(F) = p, V(F) = p*(1 - p)/n."
        },
        {
          "name": "Các định lý giới hạn trung tâm",
          "formula": "Nếu $\\sigma$ đã biết: $Z=\\frac{\\bar X-\\mu}{\\sigma/\\sqrt n}\\sim N(0,1)$. Nếu $\\sigma$ chưa biết: $T=\\frac{\\bar X-\\mu}{S_*/\\sqrt n}\\sim t_{n-1}$",
          "desc": "Với mẫu độc lập từ tổng thể chuẩn, Z và T có đúng các phân phối trên. Với tổng thể không chuẩn, chuẩn hóa trung bình dùng xấp xỉ theo định lý giới hạn trung tâm khi các điều kiện phù hợp; T không tự có phân phối Student chỉ vì σ chưa biết."
        }
      ],
      "magic_rules": [
        "Phân biệt độ lệch chuẩn s (chia cho n khi tính s²) và s* hiệu chỉnh (chia cho n-1 khi tính s*²). Đọc đúng yêu cầu đề; các công thức suy luận dùng s* khi thay thế σ chưa biết.",
        "Trong Casio fx-580VNX: σx là độ lệch chuẩn chia cho n, còn sx là độ lệch chuẩn hiệu chỉnh chia cho n-1. Chọn theo đại lượng mà bài yêu cầu.",
        "Khoảng biến thiên: R = xmax - xmin.",
        "Nếu khoảng lớp cho dạng [a, b): Lấy giá trị đại diện là trung điểm xi = (a + b) / 2."
      ],
      "casio_shortcuts": [
        "Bấm bảng số liệu mẫu (xi, ni): MENU -> 6 -> 1 (1-Variable). Bật cột FREQ nếu chưa có. Nhập xi vào cột X, ni vào cột FREQ. Bấm OPTN -> 3 -> Lấy kết quả: x̄ (trung bình), sx (s* hiệu chỉnh), sx² = (s*)², n = tổng cỡ mẫu!"
      ]
    },
    {
      "id": "chap7",
      "num": 7,
      "clo": "CHƯƠNG 7",
      "title": "Chương 7: Ước Lượng Tham Số",
      "summary": "Nghiên cứu bài toán ước lượng điểm (không chệch, hiệu quả, vững) và ước lượng khoảng tin cậy với độ tin cậy 1 - α (90%, 95%, 99%): ước lượng kỳ vọng toán μ (trường hợp đã biết σ², chưa biết σ² với n < 30 dùng Student t, và n ≥ 30 dùng chuẩn Laplace), ước lượng tỷ lệ p, và ước lượng phương sai σ².",
      "core_formulas": [
        {
          "name": "Ước lượng kỳ vọng μ (Đã biết σ²)",
          "formula": "$\\mu\\in(\\bar x-\\varepsilon,\\bar x+\\varepsilon)$ với $\\varepsilon=u_{\\alpha/2}\\frac\\sigma{\\sqrt n}$",
          "desc": "u_(α/2) là giá trị tới hạn chuẩn. Với độ tin cậy 95% (α = 0.05): u_0.025 = 1.96. Với 99%: u_0.005 = 2.58."
        },
        {
          "name": "Ước lượng kỳ vọng μ (Chưa biết σ², n < 30)",
          "formula": "$\\mu\\in(\\bar x-\\varepsilon,\\bar x+\\varepsilon)$ với $\\varepsilon=t_{\\alpha/2}^{n-1}\\frac{s_*}{\\sqrt n}$",
          "desc": "Dùng với mẫu độc lập từ tổng thể chuẩn; t_(α/2)^(n-1) tra bảng Student với n - 1 bậc tự do. Mẫu nhỏ không chuẩn không tự bảo đảm công thức này đúng."
        },
        {
          "name": "Ước lượng kỳ vọng μ (Chưa biết σ², n ≥ 30)",
          "formula": "$\\mu\\in(\\bar x-\\varepsilon,\\bar x+\\varepsilon)$ với $\\varepsilon=u_{\\alpha/2}\\frac{s_*}{\\sqrt n}$",
          "desc": "Khi mẫu lớn n ≥ 30, phân phối Student xấp xỉ phân phối chuẩn N(0, 1)."
        },
        {
          "name": "Ước lượng tỷ lệ p của tổng thể",
          "formula": "$p\\in(f-\\varepsilon,f+\\varepsilon)$ với $\\varepsilon=u_{\\alpha/2}\\sqrt{\\frac{f(1-f)}n}$",
          "desc": "f = m/n là tỷ lệ mẫu. Điều kiện áp dụng: n ≥ 30, n*f ≥ 5 và n*(1 - f) ≥ 5."
        },
        {
          "name": "Xác định kích thước mẫu tối thiểu n",
          "formula": "Cho kỳ vọng: $n\\ge\\left(\\frac{u_{\\alpha/2}s_*}\\varepsilon\\right)^2$. Cho tỷ lệ: $n\\ge\\frac{u_{\\alpha/2}^2 f(1-f)}{\\varepsilon^2}$",
          "desc": "Nếu chưa biết f thì lấy f*(1 - f) đạt cực đại tại f = 0.5 (f*(1-f) = 0.25). Làm tròn lên số nguyên kế tiếp."
        }
      ],
      "magic_rules": [
        "Độ tin cậy 95% (1 - α = 0.95 => α = 0.05): Giá trị tới hạn chuẩn u_(α/2) = 1.96 (hoặc u_0.025 = 1.96).",
        "Độ tin cậy 99% (1 - α = 0.99 => α = 0.01): u_(α/2) = 2.575 (thường lấy 2.58).",
        "Độ tin cậy 90% (1 - α = 0.90 => α = 0.10): u_(α/2) = 1.645 (thường lấy 1.65).",
        "Độ dài khoảng tin cậy: L = 2 * ε. Độ chính xác ước lượng là bán kính ε."
      ],
      "casio_shortcuts": [
        "Bấm nhanh độ chính xác ε: Nhập u_(α/2) * sx / √(n) -> Bấm [=]. Sau đó bấm Ans để tính x̄ - Ans và x̄ + Ans -> Ra ngay khoảng tin cậy!"
      ]
    },
    {
      "id": "chap8",
      "num": 8,
      "clo": "CHƯƠNG 8",
      "title": "Chương 8: Kiểm Định Giả Thuyết Thống Kê",
      "summary": "Nghiên cứu bài toán kiểm định giả thuyết thống kê: giả thuyết không H0 và đối thuyết H1, mức ý nghĩa α, sai lầm loại 1 (bác bỏ H0 đúng) và sai lầm loại 2 (chấp nhận H0 sai), tiêu chuẩn kiểm định và miền bác bỏ Wα cho: kiểm định kỳ vọng μ (1 phía và 2 phía), kiểm định tỷ lệ p, và so sánh 2 kỳ vọng toán.",
      "core_formulas": [
        {
          "name": "Kiểm định giả thuyết về kỳ vọng μ (σ đã biết)",
          "formula": "$Z_{\\mathrm{qs}}=\\frac{\\bar x-\\mu_0}{\\sigma/\\sqrt n};\\quad H_1:\\mu\\ne\\mu_0\\ \\Rightarrow\\ W_\\alpha=\\{|Z|>u_{\\alpha/2}\\}$",
          "desc": "Đối thuyết 1 phía: H1: μ > μ0 => Wα = {Z > uα};  H1: μ < μ0 => Wα = {Z < -uα}."
        },
        {
          "name": "Kiểm định giả thuyết về kỳ vọng μ (σ chưa biết, n < 30)",
          "formula": "$T_{\\mathrm{qs}}=\\frac{\\bar x-\\mu_0}{s_*/\\sqrt n};\\quad H_1:\\mu\\ne\\mu_0\\ \\Rightarrow\\ W_\\alpha=\\{|T|>t_{\\alpha/2}^{n-1}\\}$",
          "desc": "Đối thuyết 1 phía: H1: μ > μ0 => Wα = {T > t_α^(n - 1)};  H1: μ < μ0 => Wα = {T < -t_α^(n - 1)}."
        },
        {
          "name": "Kiểm định giả thuyết về tỷ lệ p",
          "formula": "$Z_{\\mathrm{qs}}=\\frac{f-p_0}{\\sqrt{p_0(1-p_0)/n}};\\quad H_1:p\\ne p_0\\ \\Rightarrow\\ W_\\alpha=\\{|Z|>u_{\\alpha/2}\\}$",
          "desc": "Chú ý dưới dấu căn mẫu số là p0 * (1 - p0) chứ không phải f * (1 - f)."
        },
        {
          "name": "Quy tắc ra quyết định kiểm định",
          "formula": "Nếu tiêu chuẩn quan sát $\\in W_\\alpha$: BÁC BỎ $H_0$. Nếu tiêu chuẩn quan sát $\\notin W_\\alpha$: CHƯA ĐỦ CƠ SỞ BÁC BỎ $H_0$.",
          "desc": "Nếu dùng p-value theo quy ước của chương: p-value < α thì bác bỏ H0; p-value ≥ α thì chưa đủ cơ sở bác bỏ H0. Không bác bỏ không chứng minh H0 đúng."
        }
      ],
      "magic_rules": [
        "H0 luôn luôn mang dấu BẰNG (=). Ví dụ H0: μ = μ0 hoặc H0: p = p0.",
        "Đọc đề bài để chọn H1: Nếu hỏi 'có thay đổi/khác không' -> H1: ≠ (Kiểm định 2 phía, tra u_(α/2)). Nếu hỏi 'có tăng lên/cao hơn không' -> H1: > (Kiểm định phía phải, tra u_α). Nếu hỏi 'có giảm đi/thấp hơn không' -> H1: < (Kiểm định phía trái, tra -u_α).",
        "Sai lầm loại 1: Bác bỏ H0 khi H0 đúng. Xác suất mắc sai lầm loại 1 chính là mức ý nghĩa α.",
        "Sai lầm loại 2: Không bác bỏ H0 khi H0 sai. Ký hiệu là β. Lực kiểm định là 1 - β."
      ],
      "casio_shortcuts": [
        "Bấm giá trị kiểm định quan sát Z_qs: (x̄ - μ0) / (σ / √n). Lưu ý đóng ngoặc mẫu số hoặc dùng phím phân số [■/□] để tránh lỗi thứ tự phép tính!"
      ]
    }
  ],
  "casio_handbook": [
    {
      "name": "Nhập dữ liệu 1 biến & bảng tần số",
      "shortcut": "MENU -> 6 -> 1 -> SHIFT MENU -> 3 (Stats) -> 1 (ON)",
      "value": "Bật cột tần số FREQ để nhập (xi, ni) hoặc bảng phân phối xác suất (xi, pi)"
    },
    {
      "name": "Xuất kết quả thống kê mẫu",
      "shortcut": "OPTN -> 3 (1-Variable Calc)",
      "value": "x̄ (Trung bình mẫu), sx (Độ lệch chuẩn hiệu chỉnh s*), sx² (Phương sai hiệu chỉnh s*²)"
    },
    {
      "name": "Tích phân phân phối Chuẩn Normal CD",
      "shortcut": "MENU -> 7 -> 2 (Normal CD)",
      "value": "Nhập Lower, Upper, σ, μ -> Tính chính xác xác suất P(a ≤ X ≤ b)"
    },
    {
      "name": "Phân phối Nhị thức Binomial PD",
      "shortcut": "MENU -> 7 -> Cuộn xuống -> 4 -> 2 (Variable)",
      "value": "Nhập k, N, p -> Tính xác suất P(X = k) trong lược đồ Bernoulli"
    },
    {
      "name": "Phân phối Poisson PD",
      "shortcut": "MENU -> 7 -> Cuộn xuống 2 lần -> 2 -> 2 (Variable)",
      "value": "Nhập x, λ -> Tính xác suất biến ngẫu nhiên Poisson P(X = k)"
    },
    {
      "name": "Hồi quy tuyến tính & Tương quan 2 biến",
      "shortcut": "MENU -> 6 -> 2 (y = a + bx) -> OPTN -> 3",
      "value": "Tính a, b, hệ số tương quan r (ρXY), cov và trung bình mẫu 2 chiều"
    },
    {
      "name": "Tổ hợp nCr (Chọn k từ n không thứ tự)",
      "shortcut": "n -> SHIFT -> [÷] (nCr) -> k -> [=]",
      "value": "C(k, n) = n! / [k! * (n - k)!]"
    },
    {
      "name": "Chỉnh hợp nPr (Chọn k từ n có thứ tự)",
      "shortcut": "n -> SHIFT -> [×] (nPr) -> k -> [=]",
      "value": "A(k, n) = n! / (n - k)!"
    },
    {
      "name": "Giá trị tới hạn chuẩn u_(0.025) (Độ tin cậy 95%)",
      "shortcut": "Tra bảng chuẩn / Bấm Casio",
      "value": "u_(0.025) = 1.960"
    },
    {
      "name": "Giá trị tới hạn chuẩn u_(0.005) (Độ tin cậy 99%)",
      "shortcut": "Tra bảng chuẩn / Bấm Casio",
      "value": "u_(0.005) = 2.576 ≈ 2.58"
    },
    {
      "name": "Giá trị tới hạn chuẩn u_(0.05) (Kiểm định 1 phía 5%)",
      "shortcut": "Tra bảng chuẩn / Bấm Casio",
      "value": "u_(0.05) = 1.645 ≈ 1.65"
    }
  ]
};
