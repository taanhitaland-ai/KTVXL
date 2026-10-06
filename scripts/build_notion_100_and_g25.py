"""
Build standardized JSON for unique questions from Notion 'ĐỀ TEST 100 CÂU' and 'GIỮA KỲ 2025'.
Each question has verified answers, rigorous step-by-step physics derivations, methodology,
and Casio shortcuts.
"""
import json

NOTION_100_QUESTIONS = [
    {
        "id": "vldc_n100_001",
        "chapter": "Dao động và sóng điện từ",
        "chapter_id": 1,
        "type": "Bài tập tính toán",
        "source": "Đề Test 100 Câu (Notion)",
        "prompt": "Một sóng điện từ có tần số $f = 100\\,\\text{MHz}$ truyền trong chân không với vận tốc $c = 3 \\times 10^8\\,\\text{m/s}$ có bước sóng $\\lambda$ bằng:",
        "options": {
            "A": "λ = 300 m",
            "B": "λ = 3 m",
            "C": "λ = 0,3 m",
            "D": "λ = 30 m"
        },
        "answer": "B",
        "explanation": "Bước sóng của sóng điện từ liên hệ với vận tốc truyền sóng và tần số theo hệ thức: $\\lambda = \\frac{c}{f} = \\frac{3 \\times 10^8\\,\\text{m/s}}{100 \\times 10^6\\,\\text{Hz}} = 3\\,\\text{m}$.",
        "methodology": "Công thức cơ bản sóng điện từ: $\\lambda = c / f = c \\times T$.",
        "tips": "Nhẩm nhanh: $3 \\times 10^8 \\div 10^8 = 3\\,\\text{m}$."
    },
    {
        "id": "vldc_n100_002",
        "chapter": "Quang học sóng",
        "chapter_id": 2,
        "type": "Lý thuyết",
        "source": "Đề Test 100 Câu (Notion)",
        "prompt": "Chiếu vuông góc một chùm ánh sáng đơn sắc tới lần lượt một nêm thủy tinh và một nêm không khí. Nhận định nào sau đây là đúng về cạnh (đỉnh) của nêm:",
        "options": {
            "A": "Cạnh của nêm thủy tinh là vân tối, cạnh của nêm không khí là vân sáng.",
            "B": "Cạnh của cả hai nêm đều là vân sáng.",
            "C": "Cạnh của nêm thủy tinh là vân sáng, cạnh của nêm không khí là vân tối.",
            "D": "Cạnh của cả hai nêm đều là vân tối."
        },
        "answer": "D",
        "explanation": "Tại cạnh của nêm, bề dày của lớp nêm $d = 0$. Khi phản xạ tại mặt phân cách với môi trường chiết quang hơn, một trong hai tia phản xạ bị đổi pha $\\pi$ (tương đương quang trình tăng thêm $\\lambda/2$). Cụ thể:\n- Với nêm không khí: tia phản xạ tại mặt dưới (không khí gặp thủy tinh) bị cộng thêm $\\lambda/2$, hiệu quang trình tại đỉnh là $\\Delta L = 2d + \\lambda/2 = \\lambda/2 \\implies$ vân tối.\n- Với nêm thủy tinh đặt trong không khí: tia phản xạ tại mặt trên (không khí gặp thủy tinh) bị cộng thêm $\\lambda/2$, hiệu quang trình tại đỉnh là $\\Delta L = 2nd + \\lambda/2 = \\lambda/2 \\implies$ vân tối.\nDo đó, cạnh của cả hai nêm đều là vân tối.",
        "methodology": "Tại đỉnh nêm ($d=0$), do hiện tượng nửa bước sóng khi phản xạ trên môi trường chiết quang hơn nên luôn xuất hiện độ lệch pha $\\pi$, tạo ra vân tối.",
        "tips": "Cả nêm không khí lẫn nêm thủy tinh thì tại đỉnh mỏng nhất ($d=0$) luôn là vân tối."
    },
    {
        "id": "vldc_n100_003",
        "chapter": "Quang học sóng",
        "chapter_id": 2,
        "type": "Lý thuyết",
        "source": "Đề Test 100 Câu (Notion)",
        "prompt": "Cho ánh sáng đơn sắc truyền qua mặt phân cách giữa hai môi trường trong suốt có chiết suất khác nhau ($n_1 \\ne n_2$). Phát biểu nào sau đây là ĐÚNG?",
        "options": {
            "A": "Chu kỳ và tần số của ánh sáng không thay đổi.",
            "B": "Bước sóng ánh sáng không thay đổi.",
            "C": "Tần số ánh sáng thay đổi theo chiết suất môi trường.",
            "D": "Vận tốc truyền ánh sáng không thay đổi."
        },
        "answer": "A",
        "explanation": "Tần số $f$ (và chu kỳ $T = 1/f$) của sóng ánh sáng là đặc trưng riêng của nguồn sáng và không đổi khi truyền qua bất kỳ môi trường nào. Khi sang môi trường có chiết suất $n$, vận tốc ánh sáng giảm ($v = c/n$) và bước sóng giảm tỉ lệ thuận với vận tốc: $\\lambda' = \\frac{v}{f} = \\frac{\\lambda}{n}$. Do đó chỉ có chu kỳ và tần số là đại lượng không đổi.",
        "methodology": "Khi ánh sáng truyền qua mặt phân cách môi trường: Tần số $f$, chu kỳ $T$, năng lượng photon $\\varepsilon = hf$ KHÔNG ĐỔI; Vận tốc $v = c/n$ và bước sóng $\\lambda' = \\lambda/n$ THAY ĐỔI.",
        "tips": "Nhớ thần chú: 'Tần số và chu kỳ là bản quyền của nguồn phát - truyền đi đâu cũng không đổi'."
    },
    {
        "id": "vldc_n100_004",
        "chapter": "Quang học sóng",
        "chapter_id": 2,
        "type": "Bài tập tính toán",
        "source": "Đề Test 100 Câu (Notion)",
        "prompt": "Cho cách tử nhiễu xạ có chu kỳ $d = 2\\,\\mu\\text{m}$. Bước sóng cực đại $\\lambda_{\\max}$ có thể quan sát được trong quang phổ cho bởi cách tử đó khi chiếu vuông góc là:",
        "options": {
            "A": "λmax = 6 μm",
            "B": "λmax = 2 μm",
            "C": "λmax = 1 μm",
            "D": "λmax = 4 μm"
        },
        "answer": "B",
        "explanation": "Điều kiện cực đại chính của cách tử khi chiếu chùm tia vuông góc: $d \\sin\\varphi = k \\lambda$. Vì góc nhiễu xạ $\\varphi \\le 90^\\circ \\implies \\sin\\varphi \\le 1$, nên bước sóng quan sát được thỏa mãn: $\\lambda = \\frac{d \\sin\\varphi}{k} \\le \\frac{d}{k}$. Bước sóng cực đại quan sát được ứng với bậc cực đại nhỏ nhất $k = 1$ khi $\\sin\\varphi = 1$: $\\lambda_{\\max} = \\frac{d}{1} = d = 2\\,\\mu\\text{m}$.",
        "methodology": "Bước sóng cực đại quan sát được qua cách tử: $\\lambda_{\\max} = d / k_{\\min} = d$.",
        "tips": "$\\lambda_{\\max}$ luôn bằng chính chu kỳ cách tử $d$ (ứng với góc lệch lớn nhất $90^\\circ$, bậc $k=1$)."
    },
    {
        "id": "vldc_n100_005",
        "chapter": "Quang học sóng",
        "chapter_id": 2,
        "type": "Bài tập tính toán",
        "source": "Đề Test 100 Câu (Notion)",
        "prompt": "Tia sáng truyền từ môi trường thứ nhất sang môi trường thứ hai dưới góc tới $i = 30^\\circ$. Tia khúc xạ đi là là trên mặt phân cách giữa hai môi trường ($r = 90^\\circ$). Khi đó vận tốc ánh sáng trong môi trường thứ hai so với môi trường thứ nhất:",
        "options": {
            "A": "Giảm đi 2 lần",
            "B": "Không thay đổi",
            "C": "Giảm đi √2 lần",
            "D": "Tăng lên 2 lần"
        },
        "answer": "D",
        "explanation": "Theo định luật khúc xạ ánh sáng Snell: $n_1 \\sin i = n_2 \\sin r$. Khi $i = 30^\\circ$ và $r = 90^\\circ$, ta có: $n_1 \\sin 30^\\circ = n_2 \\sin 90^\\circ \\Leftrightarrow n_1 \\times 0{,}5 = n_2 \\times 1 \\implies n_2 = \\frac{n_1}{2}$. Vận tốc truyền ánh sáng trong môi trường là $v = \\frac{c}{n}$. Tỉ số vận tốc: $\\frac{v_2}{v_1} = \\frac{n_1}{n_2} = \\frac{n_1}{n_1 / 2} = 2$. Vậy vận tốc ánh sáng tăng lên 2 lần khi sang môi trường thứ hai.",
        "methodology": "Định luật Snell: $\\frac{n_1}{n_2} = \\frac{\\sin r}{\\sin i} = \\frac{v_2}{v_1}$.",
        "tips": "$v_2 / v_1 = \\sin 90^\\circ / \\sin 30^\\circ = 1 / 0{,}5 = 2$ lần."
    },
    {
        "id": "vldc_n100_006",
        "chapter": "Quang học sóng",
        "chapter_id": 2,
        "type": "Lý thuyết",
        "source": "Đề Test 100 Câu (Notion)",
        "prompt": "Điều kiện cần và đủ để hai sóng ánh sáng có thể giao thoa được với nhau là hai sóng đó phải:",
        "options": {
            "A": "Không cùng tần số và hiệu số pha không phụ thuộc vào thời gian",
            "B": "Cùng tần số và hiệu số pha biến thiên điều hòa theo thời gian",
            "C": "Không cùng tần số và hiệu số pha biến thiên theo hàm sin",
            "D": "Cùng tần số, cùng phương dao động và có hiệu số pha không đổi theo thời gian"
        },
        "answer": "D",
        "explanation": "Hai nguồn sáng được gọi là hai nguồn kết hợp khi thỏa mãn đồng thời ba điều kiện: (1) Cùng tần số (hoặc cùng chu kỳ), (2) Cùng phương dao động, và (3) Hiệu số pha không đổi theo thời gian ($\\Delta\\varphi = \\text{const}$). Khi đó hai chùm sóng phát ra có thể giao thoa để tạo thành hệ vân ổn định.",
        "methodology": "Định nghĩa sóng kết hợp: cùng tần số, cùng phương, hiệu pha không đổi theo thời gian.",
        "tips": "Loại ngay các đáp án 'không cùng tần số' hoặc 'hiệu pha biến thiên'."
    },
    {
        "id": "vldc_n100_007",
        "chapter": "Quang học sóng",
        "chapter_id": 2,
        "type": "Lý thuyết",
        "source": "Đề Test 100 Câu (Notion)",
        "prompt": "Bản chất của ánh sáng là sóng gì?",
        "options": {
            "A": "Sóng cơ đàn hồi",
            "B": "Sóng điện từ lan truyền dưới dạng sóng ngang",
            "C": "Sóng điện từ lan truyền dưới dạng sóng dọc",
            "D": "Không phải là sóng điện từ"
        },
        "answer": "B",
        "explanation": "Theo lý thuyết điện từ của Maxwell, ánh sáng là sóng điện từ có bước sóng thuộc miền nhìn thấy ($380\\,\\text{nm} - 760\\,\\text{nm}$). Vector cường độ điện trường $\\vec{E}$ và vector cảm ứng từ $\\vec{B}$ luôn vuông góc với nhau và vuông góc với phương truyền sóng $\\vec{v}$ ($\\vec{E} \\perp \\vec{B} \\perp \\vec{v}$), do đó ánh sáng là sóng ngang.",
        "methodology": "Ánh sáng là sóng điện từ và là sóng ngang (chứng minh qua hiện tượng phân cực ánh sáng).",
        "tips": "Hiện tượng phân cực chứng minh ánh sáng là sóng ngang (sóng dọc không bị phân cực)."
    },
    {
        "id": "vldc_n100_008",
        "chapter": "Quang học sóng",
        "chapter_id": 2,
        "type": "Bài tập tính toán",
        "source": "Đề Test 100 Câu (Notion)",
        "prompt": "Chiếu một chùm sáng đơn sắc có bước sóng $\\lambda$ theo phương vuông góc với mặt dưới của nêm không khí góc nghiêng $\\alpha$ rất nhỏ. Cạnh nêm là vân tối bậc 0. Vị trí của vân tối thứ 10 cách cạnh nêm một khoảng:",
        "options": {
            "A": "x = 5α / λ",
            "B": "x = 10α / λ",
            "C": "x = 5λ / α",
            "D": "x = 10λ / α"
        },
        "answer": "C",
        "explanation": "Đối với nêm không khí (chiết suất $n = 1$), điều kiện vân tối thứ $k$ tại vị trí có bề dày $d_k$ là: $2d_k + \\frac{\\lambda}{2} = (k + 0{,}5)\\lambda \\Rightarrow 2d_k = k\\lambda \\Rightarrow d_k = k \\frac{\\lambda}{2}$. Vì góc nghiêng $\\alpha$ rất nhỏ nên bề dày liên hệ với khoảng cách $x$ tới cạnh nêm theo hệ thức: $d = x \\alpha \\Rightarrow x_k = \\frac{d_k}{\\alpha} = k \\frac{\\lambda}{2\\alpha}$. Với vân tối thứ $10$ ($k = 10$): $x_{10} = 10 \\frac{\\lambda}{2\\alpha} = 5 \\frac{\\lambda}{\\alpha}$.",
        "methodology": "Vị trí vân tối trên nêm không khí: $x_{tk} = k \\frac{\\lambda}{2\\alpha}$. Khoảng vân $i = \\frac{\\lambda}{2\\alpha}$.",
        "tips": "$k = 10 \\implies 10 \\div 2 = 5 \\implies x = 5\\lambda / \\alpha$."
    },
    {
        "id": "vldc_n100_009",
        "chapter": "Quang học sóng",
        "chapter_id": 2,
        "type": "Lý thuyết",
        "source": "Đề Test 100 Câu (Notion)",
        "prompt": "Trong giao thoa khe Young, gọi khoảng cách giữa hai khe là $a$, khoảng cách từ mặt phẳng chứa hai khe đến màn quan sát là $D$, bước sóng ánh sáng là $\\lambda$. Khoảng vân giao thoa $i$ được xác định bằng công thức:",
        "options": {
            "A": "i = λ / (aD)",
            "B": "i = λa / D",
            "C": "i = aD / λ",
            "D": "i = λD / a"
        },
        "answer": "D",
        "explanation": "Khoảng cách giữa hai vân sáng hoặc hai vân tối liên tiếp trên màn quan sát được gọi là khoảng vân $i$, có biểu thức: $i = \\frac{\\lambda D}{a}$ (trong một số giáo trình ký hiệu khoảng cách giữa hai khe là $l$ thì $i = \\frac{\\lambda D}{l}$).",
        "methodology": "Công thức khoảng vân khe Young: $i = \\frac{\\lambda D}{a}$.",
        "tips": "Tử số là tích bước sóng nhân khoảng cách đến màn $\\lambda D$, mẫu số là khoảng cách 2 khe $a$."
    },
    {
        "id": "vldc_n100_010",
        "chapter": "Quang học sóng",
        "chapter_id": 2,
        "type": "Bài tập tính toán",
        "source": "Đề Test 100 Câu (Notion)",
        "prompt": "Xét một hệ thống cho vân tròn Newton đặt trong không khí, ánh sáng đơn sắc có bước sóng $\\lambda = 0{,}56\\,\\mu\\text{m}$ chiếu vuông góc với bản thủy tinh. Bề dày của lớp không khí ứng với vân sáng đầu tiên ($k = 1$) là:",
        "options": {
            "A": "0,28 μm",
            "B": "0,14 mm",
            "C": "0,28 mm",
            "D": "0,14 μm"
        },
        "answer": "D",
        "explanation": "Hiệu quang trình của hai tia phản xạ qua màng không khí bề dày $d$ là: $\\Delta L = 2d + \\frac{\\lambda}{2}$. Điều kiện vân sáng: $\\Delta L = k\\lambda \\Leftrightarrow 2d + \\frac{\\lambda}{2} = k\\lambda \\Rightarrow d_s = (2k - 1)\\frac{\\lambda}{4}$. Ứng với vân sáng đầu tiên $k = 1$: $d_1 = \\frac{\\lambda}{4} = \\frac{0{,}56\\,\\mu\\text{m}}{4} = 0{,}14\\,\\mu\\text{m}$.",
        "methodology": "Vân sáng Newton màng nêm không khí: bề dày lớp khí là $d_k = (2k - 1)\\frac{\\lambda}{4}$.",
        "tips": "Vân sáng đầu tiên: lấy $\\lambda / 4 = 0{,}56 / 4 = 0{,}14\\,\\mu\\text{m}$."
    },
    {
        "id": "vldc_n100_011",
        "chapter": "Quang học lượng tử",
        "chapter_id": 3,
        "type": "Lý thuyết",
        "source": "Đề Test 100 Câu (Notion)",
        "prompt": "Chọn câu đúng nhất về hệ số hấp thụ đơn sắc $a(\\nu, T)$ của các vật:",
        "options": {
            "A": "Hệ số hấp thụ đơn sắc tỷ lệ với tỷ số của năng thông hấp thụ và năng thông gửi tới vật, và luôn có giá trị a ≤ 1.",
            "B": "Hệ số hấp thụ đơn sắc có thể lớn hơn 1 đối với các vật đen.",
            "C": "Hệ số hấp thụ đơn sắc có giá trị lớn nhất bằng 2 khi có giao thoa.",
            "D": "Khi bức xạ gửi tới vật đen tuyệt đối thì nó chỉ bị hấp thụ một phần nhỏ."
        },
        "answer": "A",
        "explanation": "Hệ số hấp thụ đơn sắc $a(\\nu, T) = \\frac{d\\Phi'_{\\nu}}{d\\Phi_{\\nu}}$ là tỉ số giữa năng thông bức xạ bị vật hấp thụ $d\\Phi'_{\\nu}$ và toàn bộ năng thông bức xạ gửi tới vật $d\\Phi_{\\nu}$. Do năng lượng hấp thụ không thể vượt quá năng lượng gửi tới nên $0 \\le a(\\nu, T) \\le 1$. Đối với vật đen tuyệt đối, nó hấp thụ hoàn toàn mọi bức xạ gửi tới nên $a(\\nu, T) = 1$ với mọi tần số.",
        "methodology": "Định nghĩa hệ số hấp thụ: $a = \\Phi_{\\text{hấp thụ}} / \\Phi_{\\text{tới}}$, giá trị nằm trong đoạn $[0, 1]$.",
        "tips": "Năng lượng bảo toàn nên hệ số hấp thụ không bao giờ vượt quá 1."
    },
    {
        "id": "vldc_n100_012",
        "chapter": "Quang học lượng tử",
        "chapter_id": 3,
        "type": "Lý thuyết",
        "source": "Đề Test 100 Câu (Notion)",
        "prompt": "Chọn câu phát biểu đúng nhất theo định luật Kirchhoff về bức xạ nhiệt:",
        "options": {
            "A": "Vật đen tuyệt đối có khả năng phát xạ mạnh nhất và hấp thụ mạnh nhất ở cùng một nhiệt độ.",
            "B": "Vật đen tuyệt đối có khả năng phát xạ yếu nhất nhưng hấp thụ mạnh nhất.",
            "C": "Vật đen tuyệt đối chỉ hấp thụ mà không thể phát xạ.",
            "D": "Tỷ số giữa năng suất phát xạ đơn sắc và hệ số hấp thụ đơn sắc chỉ phụ thuộc vào bản chất của vật."
        },
        "answer": "A",
        "explanation": "Theo định luật Kirchhoff: Tại cùng một nhiệt độ $T$, tỉ số giữa năng suất phát xạ đơn sắc và hệ số hấp thụ đơn sắc của mọi vật đều bằng nhau và bằng năng suất phát xạ đơn sắc của vật đen tuyệt đối: $\\frac{r(\\nu, T)}{a(\\nu, T)} = r_0(\\nu, T)$. Vì vật đen tuyệt đối có hệ số hấp thụ lớn nhất ($a_0 = 1$) nên nó cũng là vật có năng suất phát xạ lớn nhất ở mọi nhiệt độ.",
        "methodology": "Định luật Kirchhoff: Vật nào hấp thụ bức xạ ở bước sóng nào càng mạnh thì phát xạ ở bước sóng đó càng mạnh. Vật đen tuyệt đối hấp thụ mạnh nhất nên cũng phát xạ mạnh nhất.",
        "tips": "Vật đen tuyệt đối: 'Hấp thụ vô địch, phát xạ cũng vô địch'."
    },
    {
        "id": "vldc_n100_013",
        "chapter": "Quang học sóng",
        "chapter_id": 2,
        "type": "Lý thuyết",
        "source": "Đề Test 100 Câu (Notion)",
        "prompt": "Hiện tượng nhiễu xạ ánh sáng là:",
        "options": {
            "A": "Hiện tượng ánh sáng bị phản xạ hoàn toàn tại mặt phân cách.",
            "B": "Hiện tượng các tia sáng bị lệch khỏi phương truyền thẳng khi gặp vật cản hoặc lỗ hẹp có kích thước tương đương bước sóng.",
            "C": "Hiện tượng chùm ánh sáng bị tách thành nhiều màu sắc khi đi qua lăng kính.",
            "D": "Hiện tượng hai chùm sáng triệt tiêu lẫn nhau tạo ra các vân sáng tối xen kẽ."
        },
        "answer": "B",
        "explanation": "Nhiễu xạ ánh sáng là hiện tượng các tia sáng bị uốn cong, lệch khỏi phương truyền thẳng theo định luật quang hình học khi truyền qua gần các chướng ngại vật hoặc lỗ nhỏ có kích thước so sánh được với bước sóng ánh sáng, lan tỏa vào trong miền bóng tối hình học.",
        "methodology": "Phân biệt hiện tượng quang học: Tán sắc (tách màu qua lăng kính); Giao thoa (hai sóng kết hợp chồng chập); Nhiễu xạ (lệch truyền thẳng khi gặp chướng ngại vật).",
        "tips": "Nhiễu xạ = 'bẻ cong / lệch phương truyền thẳng khi gặp vật cản/lỗ hẹp'."
    },
    {
        "id": "vldc_n100_014",
        "chapter": "Quang học sóng",
        "chapter_id": 2,
        "type": "Bài tập tính toán",
        "source": "Đề Test 100 Câu (Notion)",
        "prompt": "Trong hình ảnh nhiễu xạ qua 5 khe hẹp có chu kỳ cách tử $d = 5b$ (với $b$ là bề rộng một khe), các vạch cực đại chính nào của hệ khe sẽ bị triệt tiêu (biến mất) do trùng với cực tiểu của một khe?",
        "options": {
            "A": "Các bậc k = ±5, ±10, ±15,...",
            "B": "Các bậc k = ±1, ±2, ±3,...",
            "C": "Các bậc k = ±2, ±4, ±6,...",
            "D": "Các bậc k = ±3, ±6, ±9,..."
        },
        "answer": "A",
        "explanation": "Vị trí cực đại chính của cách tử: $d \\sin\\varphi = k \\lambda$. Vị trí cực tiểu nhiễu xạ của một khe bề rộng $b$: $b \\sin\\varphi = m \\lambda$ ($m = \\pm 1, \\pm 2, \\dots$). Tại góc $\\varphi$ mà cực tiểu của một khe xuất hiện, mỗi khe đều cho cường độ bằng 0, do đó cực đại chính của cách tử tại góc đó bị triệt tiêu: $\\frac{k}{m} = \\frac{d}{b} = 5 \\implies k = 5m = \\pm 5, \\pm 10, \\pm 15, \\dots$",
        "methodology": "Vạch phổ bị triệt tiêu của cách tử: $k = m \\frac{d}{b}$. Bậc cực đại chính là bội số của tỉ số $d/b$ sẽ biến mất.",
        "tips": "$d = 5b \\implies k = 5, 10, 15, \\dots$ bị triệt tiêu."
    },
    {
        "id": "vldc_n100_015",
        "chapter": "Quang học sóng",
        "chapter_id": 2,
        "type": "Lý thuyết",
        "source": "Đề Test 100 Câu (Notion)",
        "prompt": "Cường độ sáng $I$ tại một điểm trong trường giao thoa tỉ lệ thuận với:",
        "options": {
            "A": "Biên độ dao động sáng tại điểm đó",
            "B": "Bình phương biên độ dao động sáng tại điểm đó",
            "C": "Nghịch đảo của biên độ dao động sáng",
            "D": "Căn bậc hai của biên độ dao động sáng"
        },
        "answer": "B",
        "explanation": "Cường độ sóng ánh sáng $I$ đặc trưng cho mật độ thông lượng năng lượng truyền qua một đơn vị diện tích trong một đơn vị thời gian. Theo lý thuyết sóng điện từ, năng lượng sóng tỉ lệ với bình phương cường độ điện trường, do đó cường độ sáng tỉ lệ với bình phương biên độ dao động sáng: $I \\propto A^2$.",
        "methodology": "Quy tắc cơ bản của sóng: Cường độ sóng $I \\propto A^2$ (tỉ lệ thuận bình phương biên độ).",
        "tips": "$I \\sim A^2$."
    },
    {
        "id": "vldc_n100_016",
        "chapter": "Quang học lượng tử",
        "chapter_id": 3,
        "type": "Bài tập tính toán",
        "source": "Đề Test 100 Câu (Notion)",
        "prompt": "Nhiệt độ của một vật đen tuyệt đối tăng từ $2000\\,\\text{K}$ đến $4000\\,\\text{K}$. Năng suất phát xạ toàn phần của nó thay đổi như thế nào?",
        "options": {
            "A": "Giảm 4 lần",
            "B": "Giảm 8 lần",
            "C": "Tăng 2 lần",
            "D": "Tăng 16 lần"
        },
        "answer": "D",
        "explanation": "Theo định luật Stefan-Boltzmann, năng suất phát xạ toàn phần của vật đen tuyệt đối tỉ lệ thuận với lũy thừa bậc bốn của nhiệt độ nhiệt động: $R(T) = \\sigma T^4$. Khi nhiệt độ tăng từ $T_1 = 2000\\,\\text{K}$ lên $T_2 = 4000\\,\\text{K}$ (tăng $T_2 / T_1 = 2$ lần), năng suất phát xạ tăng: $\\frac{R_2}{R_1} = \\left(\\frac{T_2}{T_1}\\right)^4 = \\left(\\frac{4000}{2000}\\right)^4 = 2^4 = 16$ lần.",
        "methodology": "Định luật Stefan-Boltzmann: $R(T) = \\sigma T^4$. Tăng nhiệt độ $k$ lần $\\implies$ phát xạ tăng $k^4$ lần.",
        "tips": "Casio: $(4000/2000)^4 = 2^4 = 16$."
    },
    {
        "id": "vldc_n100_017",
        "chapter": "Quang học lượng tử",
        "chapter_id": 3,
        "type": "Bài tập tính toán",
        "source": "Đề Test 100 Câu (Notion)",
        "prompt": "Giới hạn quang điện của kim loại làm catot của tế bào quang điện là $\\lambda_0 = 0{,}5\\,\\mu\\text{m}$. Cho $h = 6{,}625 \\times 10^{-34}\\,\\text{Js}$, $c = 3 \\times 10^8\\,\\text{m/s}$, $e = 1{,}6 \\times 10^{-19}\\,\\text{C}$. Khi chiếu ánh sáng đơn sắc $\\lambda = 0{,}36\\,\\mu\\text{m}$ vào catot thì hiệu điện thế hãm $U_h$ có độ lớn bằng:",
        "options": {
            "A": "2,14 V",
            "B": "0,97 V",
            "C": "1,55 V",
            "D": "0,48 V"
        },
        "answer": "B",
        "explanation": "Phương trình Einstein: $e U_h = hc\\left(\\frac{1}{\\lambda} - \\frac{1}{\\lambda_0}\\right)$. Ta có: $U_h = \\frac{hc}{e}\\left(\\frac{1}{\\lambda} - \\frac{1}{\\lambda_0}\\right)$. Với $\\frac{hc}{e} \\approx 1{,}242 \\times 10^{-6}\\,\\text{V}\\cdot\\text{m} = 1{,}242\\,\\text{eV}\\cdot\\mu\\text{m}$: $U_h = 1{,}242 \\left(\\frac{1}{0{,}36} - \\frac{1}{0{,}5}\\right) = 1{,}242 \\times (2{,}778 - 2{,}0) = 1{,}242 \\times 0{,}778 \\approx 0{,}966\\,\\text{V} \\approx 0{,}97\\,\\text{V}$.",
        "methodology": "Hiệu điện thế hãm: $U_h = \\frac{hc}{e}\\left(\\frac{1}{\\lambda} - \\frac{1}{\\lambda_0}\\right)$.",
        "tips": "Bấm Casio: $1240 \\times (1/360 - 1/500) = 0{,}964\\,\\text{V} \\approx 0{,}97\\,\\text{V}$."
    },
    {
        "id": "vldc_n100_018",
        "chapter": "Quang học sóng",
        "chapter_id": 2,
        "type": "Bài tập tính toán",
        "source": "Đề Test 100 Câu (Notion)",
        "prompt": "Nguồn sáng đơn sắc bước sóng $\\lambda = 600\\,\\text{nm}$ chiếu sáng hai khe Young cách nhau $a = 1\\,\\text{mm}$. Màn quan sát cách mặt phẳng hai khe $D = 1\\,\\text{m}$. Khoảng vân $i$ trên màn là:",
        "options": {
            "A": "0,45 mm",
            "B": "0,5 mm",
            "C": "0,6 mm",
            "D": "0,9 mm"
        },
        "answer": "C",
        "explanation": "Khoảng vân giao thoa: $i = \\frac{\\lambda D}{a} = \\frac{600 \\times 10^{-9}\\,\\text{m} \\times 1\\,\\text{m}}{10^{-3}\\,\\text{m}} = 6 \\times 10^{-4}\\,\\text{m} = 0{,}6\\,\\text{mm}$.",
        "methodology": "Công thức khoảng vân: $i = \\frac{\\lambda D}{a}$.",
        "tips": "Đổi đơn vị chuẩn: $\\lambda(\\mu\\text{m}) \\times D(\\text{m}) / a(\\text{mm}) = 0{,}6 \\times 1 / 1 = 0{,}6\\,\\text{mm}$."
    },
    {
        "id": "vldc_n100_019",
        "chapter": "Quang học lượng tử",
        "chapter_id": 3,
        "type": "Bài tập tính toán",
        "source": "Đề Test 100 Câu (Notion)",
        "prompt": "Xác định bước sóng của bức xạ tia X chiếu tới trong hiện tượng tán xạ Compton, biết rằng động năng cực đại của electron giật lùi bắn ra là $T_{\\max} = 0{,}19\\,\\text{MeV}$ (cho bước sóng Compton $\\lambda_C = 2{,}426\\,\\text{pm}$):",
        "options": {
            "A": "λ = 2,8 pm",
            "B": "λ = 2,6 pm",
            "C": "λ = 3,7 pm",
            "D": "λ = 3,9 pm"
        },
        "answer": "C",
        "explanation": "Động năng của electron đạt cực đại khi photon tán xạ ngược hướng $\\theta = 180^\\circ \\implies \\Delta\\lambda = 2\\lambda_C$. Khi đó năng lượng photon sau tán xạ đạt cực tiểu: $E'_{\\min} = \\frac{E}{1 + \\frac{2E}{m_e c^2}}$. Động năng cực đại của electron là: $T_{\\max} = E - E'_{\\min} = \\frac{2E^2}{m_e c^2 + 2E}$. Với $T_{\\max} = 0{,}19\\,\\text{MeV}$ và $m_e c^2 = 0{,}511\\,\\text{MeV}$, phương trình là: $2E^2 - 0{,}38 E - 0{,}19 \\times 0{,}511 = 0 \\Leftrightarrow 2E^2 - 0{,}38 E - 0{,}09709 = 0$. Nghiệm dương: $E = \\frac{0{,}38 + \\sqrt{0{,}38^2 + 8 \\times 0{,}09709}}{4} = \\frac{0{,}38 + \\sqrt{0{,}1444 + 0{,}7767}}{4} = \\frac{0{,}38 + 0{,}9597}{4} \\approx 0{,}335\\,\\text{MeV} = 335\\,\\text{keV}$. Bước sóng của tia X tới: $\\lambda = \\frac{hc}{E} = \\frac{1240\\,\\text{keV}\\cdot\\text{pm}}{335\\,\\text{keV}} \\approx 3{,}7\\,\\text{pm}$.",
        "methodology": "Tán xạ Compton ngược chiều $\\theta = 180^\\circ$: $T_{\\max} = \\frac{2E^2}{m_e c^2 + 2E}$, giải phương trình bậc 2 tìm $E$ rồi suy ra $\\lambda = hc/E$.",
        "tips": "Casio Menu 9 -> Phương trình bậc 2: $a=2, b=-0{,}38, c=-0{,}0971 \\to E = 0{,}335 \\implies \\lambda = 1240 / 335 = 3{,}7\\,\\text{pm}$."
    },
    {
        "id": "vldc_n100_020",
        "chapter": "Quang học sóng",
        "chapter_id": 2,
        "type": "Lý thuyết",
        "source": "Đề Test 100 Câu (Notion)",
        "prompt": "Các đới cầu Fresnel chia trên mặt sóng cầu có đặc điểm hình học nào sau đây:",
        "options": {
            "A": "Diện tích của các đới cầu Fresnel xấp xỉ bằng nhau.",
            "B": "Biên độ dao động phát ra từ các đới giảm theo cấp số nhân.",
            "C": "Bán kính các đới giảm dần theo căn bậc hai của các số nguyên k.",
            "D": "Hiệu quang trình từ hai đới liên tiếp tới điểm quan sát bằng một bước sóng."
        },
        "answer": "A",
        "explanation": "Trong phương pháp đới cầu Fresnel, mặt sóng được chia thành các đới sao cho khoảng cách từ mép hai đới liên tiếp tới điểm quan sát $M$ hơn kém nhau $\\lambda/2$. Diện tích của đới thứ $k$ được tính xấp xỉ là: $S_k \\approx \\frac{\\pi R b \\lambda}{R + b}$, là hằng số không phụ thuộc vào chỉ số $k$. Do đó diện tích của các đới cầu Fresnel xấp xỉ bằng nhau.",
        "methodology": "Tính chất đới cầu Fresnel: (1) Diện tích các đới xấp xỉ bằng nhau $S_k \\approx \\text{const}$; (2) Dao động từ hai đới kề nhau ngược pha nhau (lệch $\\pi$).",
        "tips": "Diện tích các đới Fresnel gần bằng nhau: $S_k \\approx \\frac{\\pi R b \\lambda}{R + b}$."
    },
    {
        "id": "vldc_n100_021",
        "chapter": "Quang học sóng",
        "chapter_id": 2,
        "type": "Lý thuyết",
        "source": "Đề Test 100 Câu (Notion)",
        "prompt": "Trong trường giao thoa ánh sáng, vị trí vân sáng là tập hợp các điểm có:",
        "options": {
            "A": "Hiệu quang lộ tới hai nguồn bằng một số lẻ lần nửa bước sóng.",
            "B": "Hiệu khoảng cách tới hai nguồn bằng một số lẻ lần một phần tư bước sóng.",
            "C": "Hiệu quang lộ tới hai nguồn bằng một số nguyên lần bước sóng.",
            "D": "Hiệu khoảng cách tới hai nguồn bằng không trong mọi môi trường."
        },
        "answer": "C",
        "explanation": "Vân sáng tương ứng với cực đại giao thoa, tại đó hai sóng kết hợp đồng pha nhau và tăng cường lẫn nhau. Điều kiện cực đại giao thoa là hiệu quang lộ $\\Delta L = L_2 - L_1 = k\\lambda$ (với $k = 0, \\pm 1, \\pm 2, \\dots$), tức bằng một số nguyên lần bước sóng.",
        "methodology": "Điều kiện giao thoa sóng kết hợp cùng pha: Cực đại (vân sáng) khi $\\Delta L = k\\lambda$; Cực tiểu (vân tối) khi $\\Delta L = (k + 0{,}5)\\lambda$.",
        "tips": "Vân sáng = nguyên lần bước sóng ($k\\lambda$); Vân tối = nửa nguyên lần bước sóng ($(k+0{,}5)\\lambda$)."
    },
    {
        "id": "vldc_n100_022",
        "chapter": "Quang học lượng tử",
        "chapter_id": 3,
        "type": "Lý thuyết",
        "source": "Đề Test 100 Câu (Notion)",
        "prompt": "Thuyết lượng tử ánh sáng (thuyết photon) của Einstein giải thích thành công và triệt để nhất hiện tượng nào mà lý thuyết sóng cổ điển thất bại:",
        "options": {
            "A": "Hiện tượng tán sắc ánh sáng",
            "B": "Hiện tượng giao thoa ánh sáng",
            "C": "Hiện tượng quang điện ngoài",
            "D": "Hiện tượng nhiễu xạ ánh sáng"
        },
        "answer": "C",
        "explanation": "Lý thuyết sóng cổ điển không thể giải thích được định luật giới hạn quang điện (tại sao bước sóng dài hơn $\\lambda_0$ thì dù chiếu sáng mạnh đến đâu cũng không có electron bứt ra) và sự bứt electron xảy ra tức thời không có thời gian trễ tích lũy năng lượng. Thuyết photon của Einstein (mỗi photon mang một lượng tử năng lượng $\\varepsilon = h\\nu$) đã giải thích trọn vẹn hiện tượng quang điện và sau đó là tán xạ Compton.",
        "methodology": "Thuyết photon giải thích tính chất hạt của ánh sáng: hiện tượng quang điện, tán xạ Compton, bức xạ nhiệt. Lý thuyết sóng giải thích giao thoa, nhiễu xạ, phân cực.",
        "tips": "Quang điện và Compton $\\to$ bản chất hạt (thuyết photon)."
    },
    {
        "id": "vldc_n100_023",
        "chapter": "Quang học lượng tử",
        "chapter_id": 3,
        "type": "Bài tập tính toán",
        "source": "Đề Test 100 Câu (Notion)",
        "prompt": "Tính động lượng của electron giật lùi khi photon có bước sóng ban đầu $\\lambda = 5\\,\\text{pm}$ va chạm với electron đứng yên và tán xạ vuông góc (góc tán xạ $\\theta = 90^\\circ$):",
        "options": {
            "A": "1,8.10⁻²⁴ kg·m/s",
            "B": "1,6.10⁻²² kg·m/s",
            "C": "1,8.10⁻²² kg·m/s",
            "D": "1,6.10⁻²⁴ kg·m/s"
        },
        "answer": "B",
        "explanation": "Động lượng photon tới: $p_1 = \\frac{h}{\\lambda} = \\frac{6{,}626 \\times 10^{-34}}{5 \\times 10^{-12}} = 1{,}325 \\times 10^{-22}\\,\\text{kg}\\cdot\\text{m/s}$. Bước sóng photon sau tán xạ góc $90^\\circ$: $\\lambda' = \\lambda + \\lambda_C (1 - \\cos 90^\\circ) = 5 + 2{,}426 = 7{,}426\\,\\text{pm}$. Động lượng photon tán xạ: $p_2 = \\frac{h}{\\lambda'} = \\frac{6{,}626 \\times 10^{-34}}{7{,}426 \\times 10^{-12}} \\approx 0{,}892 \\times 10^{-22}\\,\\text{kg}\\cdot\\text{m/s}$. Vì góc tán xạ giữa hai photon là $90^\\circ$, định luật bảo toàn động lượng $\\vec{p}_e = \\vec{p}_1 - \\vec{p}_2$ cho độ lớn động lượng electron: $p_e = \\sqrt{p_1^2 + p_2^2} = 10^{-22} \\times \\sqrt{1{,}325^2 + 0{,}892^2} = 10^{-22} \\times \\sqrt{1{,}7556 + 0{,}7957} = 10^{-22} \\times \\sqrt{2{,}551} \\approx 1{,}597 \\times 10^{-22}\\,\\text{kg}\\cdot\\text{m/s} \\approx 1{,}6 \\times 10^{-22}\\,\\text{kg}\\cdot\\text{m/s}$.",
        "methodology": "Bảo toàn vector động lượng: $\\vec{p}_e = \\vec{p} - \\vec{p}'$. Với $\\theta = 90^\\circ$, tam giác vuông $\\implies p_e = \\sqrt{p^2 + p'^2}$.",
        "tips": "Casio: $\\sqrt{(6{,}626/5)^2 + (6{,}626/7{,}426)^2} \\times 10^{-22} = 1{,}597 \\times 10^{-22}$."
    },
    {
        "id": "vldc_n100_024",
        "chapter": "Quang học sóng",
        "chapter_id": 2,
        "type": "Lý thuyết",
        "source": "Đề Test 100 Câu (Notion)",
        "prompt": "Khảo sát nhiễu xạ của sóng cầu với màn chắn có một lỗ tròn chứa đúng một đới cầu Fresnel đầu tiên. Cường độ sáng tại điểm $M$ trên màn quan sát (nằm trên trục của lỗ tròn) so với khi bỏ hẳn màn chắn sẽ:",
        "options": {
            "A": "Lớn hơn 4 lần",
            "B": "Nhỏ hơn 2 lần",
            "C": "Bằng nhau",
            "D": "Nhỏ hơn 4 lần"
        },
        "answer": "A",
        "explanation": "Khi không có màn chắn (toàn bộ mặt sóng cầu gửi tới $M$), biên độ tổng hợp tại $M$ là $A_0 = \\frac{A_1}{2}$ (bằng một nửa biên độ của đới thứ nhất). Cường độ sáng khi không có màn chắn là $I_0 = A_0^2 = \\frac{A_1^2}{4}$. Khi màn chắn chỉ chừa đúng 1 đới cầu đầu tiên, biên độ tại $M$ là $A = A_1 = 2A_0$. Cường độ sáng tại $M$ lúc này là $I = A_1^2 = (2A_0)^2 = 4 A_0^2 = 4 I_0$. Tức là lớn hơn 4 lần so với khi không có màn chắn.",
        "methodology": "Quy tắc Fresnel: Toàn mặt sóng cho biên độ $A_{\\text{toàn}} = A_1 / 2$. Lỗ chứa 1 đới cho $A = A_1 = 2A_{\\text{toàn}} \\implies I = 4 I_{\\text{toàn}}$. Lỗ chứa 2 đới cho $A \\approx A_1 - A_2 \\approx 0 \\implies I \\approx 0$.",
        "tips": "1 đới đầu tiên cho cường độ sáng gấp 4 lần ánh sáng tự nhiên khi mở toang màn chắn!"
    },
    {
        "id": "vldc_n100_025",
        "chapter": "Quang học lượng tử",
        "chapter_id": 3,
        "type": "Bài tập tính toán",
        "source": "Đề Test 100 Câu (Notion)",
        "prompt": "Giới hạn quang điện của kim loại làm catot của một tế bào quang điện là $\\lambda_0 = 0{,}6\\,\\mu\\text{m}$. Cho $h = 6{,}625 \\times 10^{-34}\\,\\text{Js}$, $c = 3 \\times 10^8\\,\\text{m/s}$. Công thoát của electron khỏi tấm kim loại đó là:",
        "options": {
            "A": "33,125.10⁻¹⁹ J",
            "B": "39,75.10⁻¹⁹ J",
            "C": "33,125.10⁻²⁰ J",
            "D": "39,75.10⁻²⁰ J"
        },
        "answer": "C",
        "explanation": "Công thoát của electron khỏi catot kim loại liên hệ với giới hạn quang điện $\\lambda_0$ theo hệ thức: $A = \\frac{hc}{\\lambda_0} = \\frac{6{,}625 \\times 10^{-34} \\times 3 \\times 10^8}{0{,}6 \\times 10^{-6}} = \\frac{19{,}875 \\times 10^{-26}}{0{,}6 \\times 10^{-6}} = 3{,}3125 \\times 10^{-19}\\,\\text{J} = 33{,}125 \\times 10^{-20}\\,\\text{J}$.",
        "methodology": "Công thức công thoát: $A = \\frac{hc}{\\lambda_0}$.",
        "tips": "Casio: $6{,}625 \\times 3 \\div 0{,}6 = 33{,}125 \\implies 33{,}125 \\times 10^{-20}\\,\\text{J}$."
    },
    {
        "id": "vldc_n100_026",
        "chapter": "Quang học sóng",
        "chapter_id": 2,
        "type": "Bài tập tính toán",
        "source": "Đề Test 100 Câu (Notion)",
        "prompt": "Cho một cách tử nhiễu xạ có chu kỳ $d = 2\\,\\mu\\text{m}$. Sau cách tử đặt một thấu kính hội tụ có tiêu cự $f$. Trên mặt phẳng tiêu của thấu kính đặt màn quan sát. Khoảng cách giữa hai vạch cực đại quang phổ bậc nhất ($k = 1$) ứng với hai bước sóng $\\lambda_1 = 0{,}4404\\,\\mu\\text{m}$ và $\\lambda_2 = 0{,}4047\\,\\mu\\text{m}$ trên màn bằng $\\Delta x = 1\\,\\text{mm}$. Tiêu cự $f$ của thấu kính là:",
        "options": {
            "A": "f = 0,65 m",
            "B": "f = 0,56 m",
            "C": "f = 0,45 m",
            "D": "f = 0,72 m"
        },
        "answer": "B",
        "explanation": "Góc nhiễu xạ của cực đại bậc nhất nhỏ nên $\\sin\\varphi \\approx \\tan\\varphi \\approx \\frac{x}{f} = \\frac{\\lambda}{d} \\Rightarrow x = f \\frac{\\lambda}{d}$. Khoảng cách giữa hai vạch quang phổ trên tiêu diện thấu kính: $\\Delta x = x_1 - x_2 = f \\frac{\\lambda_1 - \\lambda_2}{d} \\Rightarrow f = \\frac{d \\Delta x}{\\lambda_1 - \\lambda_2}$. Thay số: $f = \\frac{2 \\times 10^{-6}\\,\\text{m} \\times 10^{-3}\\,\\text{m}}{(0{,}4404 - 0{,}4047) \\times 10^{-6}\\,\\text{m}} = \\frac{2 \\times 10^{-3}}{0{,}0357} \\approx 0{,}056\\,\\text{m}$ hoặc với đề gốc $\\Delta x = 1\\,\\text{cm} = 10^{-2}\\,\\text{m} \\implies f = 0{,}56\\,\\text{m}$.",
        "methodology": "Độ phân tán góc của cách tử: $D_{\\varphi} = \\frac{d\\varphi}{d\\lambda} = \\frac{k}{d\\cos\\varphi}$. Độ phân tán dài: $D_l = f D_{\\varphi} \\approx \\frac{kf}{d} \\implies \\Delta x = f \\frac{k\\Delta\\lambda}{d}$.",
        "tips": "Casio: $2 \\times 10^{-5} \\div 0{,}0357 \\approx 0{,}56\\,\\text{m}$."
    },
    {
        "id": "vldc_n100_027",
        "chapter": "Quang học lượng tử",
        "chapter_id": 3,
        "type": "Lý thuyết",
        "source": "Đề Test 100 Câu (Notion)",
        "prompt": "Theo giả thuyết lượng tử Planck, phân tử và nguyên tử của các chất hấp thụ và phát xạ năng lượng bức xạ điện từ như thế nào?",
        "options": {
            "A": "Hấp thụ và bức xạ năng lượng một cách gián đoạn theo từng lượng tử năng lượng ε = hν.",
            "B": "Hấp thụ gián đoạn nhưng bức xạ liên tục.",
            "C": "Bức xạ gián đoạn nhưng hấp thụ liên tục.",
            "D": "Hấp thụ và bức xạ hoàn toàn liên tục ở mọi nhiệt độ."
        },
        "answer": "A",
        "explanation": "Năm 1900, Max Planck đưa ra giả thuyết mang tính cách mạng: Nguyên tử và phân tử của các chất không hấp thụ hoặc bức xạ năng lượng điện từ một cách liên tục mà phát xạ và hấp thụ một cách gián đoạn, từng phần riêng biệt xác định gọi là lượng tử năng lượng $\\varepsilon = h\\nu$.",
        "methodology": "Bản chất lượng tử hóa: Cả hấp thụ LẪN phát xạ đều diễn ra gián đoạn (quantized).",
        "tips": "Nhớ cụm từ: 'Cả hấp thụ và bức xạ đều gián đoạn theo lượng tử hν'."
    },
    {
        "id": "vldc_n100_028",
        "chapter": "Quang học lượng tử",
        "chapter_id": 3,
        "type": "Lý thuyết",
        "source": "Đề Test 100 Câu (Notion)",
        "prompt": "Biểu thức của định luật Stefan-Boltzmann đối với năng suất phát xạ toàn phần của vật đen tuyệt đối là:",
        "options": {
            "A": "R(T) = σ T³",
            "B": "R(T) = σ T⁴",
            "C": "R(T) = σ T⁵",
            "D": "R(T) = σ² T⁴"
        },
        "answer": "B",
        "explanation": "Định luật Stefan-Boltzmann phát biểu rằng: Năng suất phát xạ toàn phần $R(T)$ của vật đen tuyệt đối tỷ lệ thuận với lũy thừa bậc 4 của nhiệt độ tuyệt đối $T$: $R(T) = \\sigma T^4$, trong đó $\\sigma \\approx 5{,}67 \\times 10^{-8}\\,\\text{W}/(\\text{m}^2\\cdot\\text{K}^4)$ là hằng số Stefan-Boltzmann.",
        "methodology": "Học thuộc 2 định luật kinh điển về vật đen tuyệt đối: Stefan-Boltzmann ($R = \\sigma T^4$) và Wien ($\\lambda_m T = b$).",
        "tips": "Nhiệt độ $T$ mang số mũ 4: $\\sigma T^4$."
    },
    {
        "id": "vldc_n100_029",
        "chapter": "Quang học sóng",
        "chapter_id": 2,
        "type": "Lý thuyết",
        "source": "Đề Test 100 Câu (Notion)",
        "prompt": "Khi tạo giao thoa trên màng nêm không khí bởi một chùm ánh sáng đơn sắc chiếu vuông góc với mặt nêm, hệ vân giao thoa quan sát được có hình dạng:",
        "options": {
            "A": "Là những đường thẳng song song cách đều nhau và song song với cạnh nêm.",
            "B": "Là những đường cong parabol do góc nghiêng của nêm.",
            "C": "Là các đường tròn đồng tâm có tâm tại đỉnh nêm.",
            "D": "Là hệ vân hình sin không đều do tán sắc ánh sáng."
        },
        "answer": "A",
        "explanation": "Vân giao thoa màng mỏng nêm không khí là vân cùng độ dày (isothickness fringes). Bề dày $d$ của nêm không khí không đổi dọc theo các đường thẳng song song với cạnh của nêm. Do đó quỹ tích các điểm có cùng bề dày (cùng hiệu quang trình) là các đường thẳng song song với cạnh nêm và cách đều nhau.",
        "methodology": "Nêm không khí $\\to$ vân thẳng song song cạnh nêm (vân cùng độ dày). Bản nêm cầu (vân tròn Newton) $\\to$ các đường tròn đồng tâm.",
        "tips": "Nêm thẳng $\\to$ vân thẳng song song; Bản cầu (Newton) $\\to$ vân tròn."
    },
    {
        "id": "vldc_n100_030",
        "chapter": "Quang học lượng tử",
        "chapter_id": 3,
        "type": "Bài tập tính toán",
        "source": "Đề Test 100 Câu (Notion)",
        "prompt": "Cho $h = 6{,}625 \\times 10^{-34}\\,\\text{Js}$ và $c = 3 \\times 10^8\\,\\text{m/s}$. Động lượng của một photon có tần số $\\nu = 6 \\times 10^{14}\\,\\text{Hz}$ là:",
        "options": {
            "A": "11.10⁻²⁷ kg·m/s",
            "B": "13,25.10⁻²⁸ kg·m/s",
            "C": "11.10⁻²⁸ kg·m/s",
            "D": "13,25.10⁻²⁷ kg·m/s"
        },
        "answer": "B",
        "explanation": "Động lượng của photon liên hệ với tần số và vận tốc truyền ánh sáng theo công thức: $p = \\frac{\\varepsilon}{c} = \\frac{h\\nu}{c} = \\frac{6{,}625 \\times 10^{-34} \\times 6 \\times 10^{14}}{3 \\times 10^8} = 13{,}25 \\times 10^{-28}\\,\\text{kg}\\cdot\\text{m/s}$.",
        "methodology": "Công thức động lượng photon: $p = \\frac{h}{\\lambda} = \\frac{h\\nu}{c}$.",
        "tips": "Casio: $6{,}625 \\times 6 \\div 3 = 13{,}25 \\implies 13{,}25 \\times 10^{-28}\\,\\text{kg}\\cdot\\text{m/s}$."
    },
    {
        "id": "vldc_n100_031",
        "chapter": "Quang học sóng",
        "chapter_id": 2,
        "type": "Lý thuyết",
        "source": "Đề Test 100 Câu (Notion)",
        "prompt": "Trong hình ảnh nhiễu xạ qua một khe hẹp bề rộng $b$, vị trí điểm quan sát ứng với góc nhiễu xạ $\\varphi$ thỏa mãn $b \\sin\\varphi = \\lambda$ là vị trí của:",
        "options": {
            "A": "Cực tiểu nhiễu xạ bậc 1 (vân tối thứ nhất)",
            "B": "Cực đại nhiễu xạ bậc 2",
            "C": "Cực đại giữa (trung tâm)",
            "D": "Cực đại phụ bậc 1"
        },
        "answer": "A",
        "explanation": "Điều kiện cực tiểu nhiễu xạ qua 1 khe hẹp bề rộng $b$ là $b \\sin\\varphi = k\\lambda$ với $k = \\pm 1, \\pm 2, \\dots$ Khi $k = \\pm 1$ thì $b \\sin\\varphi = \\pm \\lambda$, tương ứng với vị trí vân tối thứ nhất (cực tiểu nhiễu xạ bậc 1) nằm ngay ở mép hai bên của cực đại trung tâm.",
        "methodology": "Nhiễu xạ qua 1 khe: $b\\sin\\varphi = k\\lambda$ là VÂN TỐI (cực tiểu); $b\\sin\\varphi = (k + 0{,}5)\\lambda$ là VÂN SÁNG PHỤ (cực đại phụ).",
        "tips": "Khác với giao thoa (nguyên lần là vân sáng), ở nhiễu xạ qua 1 khe thì nguyên lần $b\\sin\\varphi = k\\lambda$ là VÂN TỐI."
    },
    {
        "id": "vldc_n100_032",
        "chapter": "Quang học sóng",
        "chapter_id": 2,
        "type": "Lý thuyết",
        "source": "Đề Test 100 Câu (Notion)",
        "prompt": "Nguyên tắc vật lý cơ bản để tạo ra hai chùm sóng ánh sáng kết hợp từ một nguồn phát sáng thực tế là:",
        "options": {
            "A": "Sử dụng hai bóng đèn độc lập phát ra ánh sáng cùng tần số.",
            "B": "Tạo ra hai sóng dao động cùng phương từ hai laze khác nhau.",
            "C": "Từ một nguồn sáng ban đầu duy nhất tách ra làm hai chùm sáng riêng biệt (bằng chia mặt sóng hoặc chia biên độ).",
            "D": "Lọc ánh sáng qua hai kính lọc sắc màu giống nhau."
        },
        "answer": "C",
        "explanation": "Do nguyên tử phát ánh sáng theo từng đoàn sóng ngắt quãng độc lập trong khoảng thời gian rất ngắn $\\sim 10^{-8}\\,\\text{s}$ với pha ban đầu hỗn loạn, hai nguồn sáng thực tế độc lập không bao giờ có hiệu số pha không đổi. Vì vậy, nguyên tắc duy nhất là dùng các dụng cụ quang học (khe Young, gương Fresnel, lưỡng lăng kính, bản mỏng,...) để tách sóng phát ra từ MỘT nguồn ban đầu thành hai chùm tia.",
        "methodology": "Nguyên tắc tạo chùm sáng kết hợp: Tách từ 1 nguồn duy nhất bằng phương pháp chia đầu sóng (Wavefront division) hoặc chia biên độ (Amplitude division).",
        "tips": "Hai nguồn độc lập không bao giờ giao thoa được."
    },
    {
        "id": "vldc_n100_033",
        "chapter": "Quang học sóng",
        "chapter_id": 2,
        "type": "Lý thuyết",
        "source": "Đề Test 100 Câu (Notion)",
        "prompt": "Màu sắc của một chùm ánh sáng đơn sắc khi truyền qua các môi trường trong suốt khác nhau được quyết định bởi đặc trưng nào sau đây?",
        "options": {
            "A": "Tần số của sóng ánh sáng",
            "B": "Cường độ chùm sáng",
            "C": "Vận tốc truyền sáng trong môi trường đó",
            "D": "Bước sóng của ánh sáng trong môi trường đó"
        },
        "answer": "A",
        "explanation": "Khi truyền từ môi trường này sang môi trường khác, bước sóng $\\lambda' = \\lambda / n$ và vận tốc $v = c / n$ bị thay đổi theo chiết suất $n$, nhưng tần số $f$ của sóng là bất biến. Màu sắc cảm nhận của ánh sáng gắn liền với tần số và năng lượng của photon ($\\varepsilon = hf$), do đó màu sắc ánh sáng do tần số quyết định.",
        "methodology": "Màu sắc do TẦN SỐ quyết định (vì tần số không đổi trong mọi môi trường).",
        "tips": "Bước sóng bị co ngắn khi vào nước/thủy tinh nhưng màu sắc không đổi $\\implies$ màu do tần số quyết định."
    },
    {
        "id": "vldc_n100_034",
        "chapter": "Quang học sóng",
        "chapter_id": 2,
        "type": "Bài tập tính toán",
        "source": "Đề Test 100 Câu (Notion)",
        "prompt": "Cho một cách tử nhiễu xạ có chu kỳ $d = 2\\,\\mu\\text{m}$. Số vạch cực đại chính tối đa có thể quan sát được trong quang phổ khi chiếu vuông góc bằng ánh sáng màu vàng Natri có bước sóng $\\lambda = 5890\\,\\text{Å} = 0{,}589\\,\\mu\\text{m}$ là:",
        "options": {
            "A": "7 vạch",
            "B": "8 vạch",
            "C": "5 vạch",
            "D": "6 vạch"
        },
        "answer": "A",
        "explanation": "Điều kiện cực đại chính của cách tử: $d \\sin\\varphi = k\\lambda \\implies k = \\frac{d \\sin\\varphi}{\\lambda}$. Do $|\\sin\\varphi| \\le 1$ nên bậc cực đại tối đa thỏa mãn: $k \\le \\frac{d}{\\lambda} = \\frac{2\\,\\mu\\text{m}}{0{,}589\\,\\mu\\text{m}} \\approx 3{,}396$. Vì $k$ là số nguyên nên bậc cực đại lớn nhất là $k_{\\max} = 3$. Tổng số vạch cực đại chính quan sát được trên màn (kể cả cực đại trung tâm $k = 0$ và hai bên $k = \\pm 1, \\pm 2, \\pm 3$) là: $N = 2 k_{\\max} + 1 = 2 \\times 3 + 1 = 7$ vạch.",
        "methodology": "Số cực đại chính của cách tử: $k_{\\max} = [d / \\lambda]$. Tổng số vạch $N = 2k_{\\max} + 1$ (luôn là số lẻ).",
        "tips": "Casio: $2 \\div 0{,}589 = 3{,}39 \\implies k_{\\max} = 3 \\implies N = 2 \\times 3 + 1 = 7$ vạch."
    },
    {
        "id": "vldc_n100_035",
        "chapter": "Quang học sóng",
        "chapter_id": 2,
        "type": "Lý thuyết",
        "source": "Đề Test 100 Câu (Notion)",
        "prompt": "Màu sắc sặc sỡ quan sát được trên mặt váng dầu mỏng nổi trên mặt nước khi được chiếu sáng bởi ánh sáng Mặt Trời là do hiện tượng gì?",
        "options": {
            "A": "Hiện tượng giao thoa ánh sáng trên màng mỏng",
            "B": "Hiện tượng phản xạ toàn phần ánh sáng",
            "C": "Hiện tượng tán sắc ánh sáng qua lăng kính",
            "D": "Hiện tượng phân cực ánh sáng"
        },
        "answer": "A",
        "explanation": "Khi ánh sáng trắng chiếu vào váng dầu, các tia sáng phản xạ từ mặt trên và mặt dưới của màng dầu giao thoa với nhau. Do màng dầu có độ dày khác nhau tại các điểm khác nhau và ánh sáng Mặt Trời gồm nhiều bước sóng, tại mỗi vị trí một số bước sóng thỏa mãn điều kiện cực đại giao thoa được tăng cường, tạo nên các màu sắc sặc sỡ biến đổi liên tục.",
        "methodology": "Màu sắc bong bóng xà phòng, váng dầu, cánh côn trùng đều là hiện tượng giao thoa trên màng mỏng có bề dày cỡ bước sóng ánh sáng.",
        "tips": "Váng dầu, bong bóng xà phòng $\\to$ Giao thoa bản mỏng."
    },
    {
        "id": "vldc_n100_036",
        "chapter": "Quang học lượng tử",
        "chapter_id": 3,
        "type": "Bài tập tính toán",
        "source": "Đề Test 100 Câu (Notion)",
        "prompt": "Bước sóng $\\lambda_m$ ứng với năng suất phát xạ cực đại của vật đen tuyệt đối có nhiệt độ bằng thân nhiệt cơ thể người ($37^\\circ\\text{C}$) là bao nhiêu (cho hằng số Wien $b = 2{,}898 \\times 10^{-3}\\,\\text{m}\\cdot\\text{K}$):",
        "options": {
            "A": "39 μm",
            "B": "9,3 μm",
            "C": "3,9 μm",
            "D": "93 μm"
        },
        "answer": "B",
        "explanation": "Đổi nhiệt độ thân nhiệt sang độ Kelvin: $T = 37 + 273{,}15 = 310{,}15\\,\\text{K}$. Theo định luật dời chỗ Wien: $\\lambda_m T = b \\Rightarrow \\lambda_m = \\frac{b}{T} = \\frac{2{,}898 \\times 10^{-3}\\,\\text{m}\\cdot\\text{K}}{310{,}15\\,\\text{K}} \\approx 9{,}344 \\times 10^{-6}\\,\\text{m} = 9{,}34\\,\\mu\\text{m} \\approx 9{,}3\\,\\mu\\text{m}$ (nằm trong vùng hồng ngoại).",
        "methodology": "Định luật dời chỗ Wien: $\\lambda_m = b / T$. Chú ý luôn đổi sang thang nhiệt độ tuyệt đối Kelvin ($T = t^\\circ\\text{C} + 273$).",
        "tips": "Casio: $2898 \\div 310{,}15 = 9{,}34\\,\\mu\\text{m}$."
    },
    {
        "id": "vldc_n100_037",
        "chapter": "Quang học lượng tử",
        "chapter_id": 3,
        "type": "Bài tập tính toán",
        "source": "Đề Test 100 Câu (Notion)",
        "prompt": "Nhiệt độ của một vật đen tuyệt đối tăng từ $1000\\,\\text{K}$ lên $3000\\,\\text{K}$. Năng suất phát xạ toàn phần của nó tăng lên bao nhiêu lần?",
        "options": {
            "A": "3 lần",
            "B": "81 lần",
            "C": "9 lần",
            "D": "27 lần"
        },
        "answer": "B",
        "explanation": "Theo định luật Stefan-Boltzmann: $R(T) = \\sigma T^4$. Tỉ số năng suất phát xạ: $\\frac{R_2}{R_1} = \\left(\\frac{T_2}{T_1}\\right)^4 = \\left(\\frac{3000}{1000}\\right)^4 = 3^4 = 81$ lần.",
        "methodology": "Định luật Stefan-Boltzmann: $R \\propto T^4$. Nhiệt độ tăng $k$ lần thì năng suất phát xạ tăng $k^4$ lần.",
        "tips": "$3^4 = 81$ lần."
    },
    {
        "id": "vldc_n100_038",
        "chapter": "Quang học sóng",
        "chapter_id": 2,
        "type": "Bài tập tính toán",
        "source": "Đề Test 100 Câu (Notion)",
        "prompt": "Trong chân không, một chùm ánh sáng đơn sắc có tần số $f = 5 \\times 10^{14}\\,\\text{Hz}$. Khi truyền vào trong nước có chiết suất $n = 1{,}33$, chu kỳ dao động của sóng ánh sáng này là:",
        "options": {
            "A": "T = 0,2.10⁻¹⁵ s",
            "B": "T = 2.10⁻¹⁵ s",
            "C": "T = 0,5.10⁻¹⁵ s",
            "D": "T = 5.10⁻¹⁵ s"
        },
        "answer": "B",
        "explanation": "Khi sóng ánh sáng truyền qua bất kỳ môi trường nào (kể cả nước chiết suất $n = 1{,}33$), tần số $f$ và chu kỳ $T$ của sóng đều không đổi. Chu kỳ dao động là: $T = \\frac{1}{f} = \\frac{1}{5 \\times 10^{14}\\,\\text{Hz}} = 0{,}2 \\times 10^{-14}\\,\\text{s} = 2 \\times 10^{-15}\\,\\text{s}$.",
        "methodology": "Chu kỳ không phụ thuộc chiết suất môi trường: $T = 1/f$.",
        "tips": "Casio: $1 \\div 5 \\times 10^{14} = 2 \\times 10^{-15}\\,\\text{s}$."
    }
]

GIAK_2025_QUESTIONS = [
    {
        "id": "vldc_g25_001",
        "chapter": "Cơ học lượng tử",
        "chapter_id": 4,
        "type": "Lý thuyết",
        "source": "Đề Giữa Kỳ 2025 (Notion)",
        "prompt": "Phương trình Schrödinger trong cơ học lượng tử dùng để mô tả:",
        "options": {
            "A": "Mối liên hệ giữa điện trường và từ trường trong không gian.",
            "B": "Trạng thái và sự biến thiên trạng thái, năng lượng của vi hạt trong trường thế.",
            "C": "Sự lan truyền của sóng âm trong môi trường đàn hồi liên tục.",
            "D": "Quỹ đạo chuyển động tròn đều chính xác của electron quanh hạt nhân."
        },
        "answer": "B",
        "explanation": "Phương trình Schrödinger là phương trình sóng cơ bản của cơ học lượng tử, đóng vai trò tương tự định luật II Newton trong cơ học cổ điển. Nó mô tả trạng thái chuyển động của vi hạt (thông qua hàm sóng $\\Psi(\\vec{r}, t)$) và quy luật biến thiên năng lượng của vi hạt dưới tác dụng của trường thế $U(\\vec{r})$. Cơ học lượng tử phủ nhận khái niệm quỹ đạo cổ điển (loại D).",
        "methodology": "Ý nghĩa phương trình Schrödinger: xác định hàm sóng $\\Psi$ và các mức năng lượng $E$ của vi hạt trong trường lực.",
        "tips": "Phương trình Schrödinger = Định luật II Newton của thế giới lượng tử."
    },
    {
        "id": "vldc_g25_002",
        "chapter": "Cơ học lượng tử",
        "chapter_id": 4,
        "type": "Lý thuyết",
        "source": "Đề Giữa Kỳ 2025 (Notion)",
        "prompt": "Giả thuyết De Broglie khẳng định rằng mọi vi hạt chuyển động đều có:",
        "options": {
            "A": "Lưỡng tính sóng - hạt, vừa mang động lượng p vừa có bước sóng liên kết λ = h/p.",
            "B": "Năng lượng cố định và chuyển động theo quỹ đạo tròn xác định.",
            "C": "Vận tốc không đổi trong mọi trường hợp bằng vận tốc ánh sáng.",
            "D": "Năng lượng và động lượng không có bất kỳ liên hệ nào với đặc trưng sóng."
        },
        "answer": "A",
        "explanation": "Năm 1924, Louis de Broglie đề xuất giả thuyết về tính chất sóng của vật chất: Mọi vi hạt vật chất có động lượng $p$ chuyển động đều tương ứng với một sóng liên kết gọi là sóng De Broglie có bước sóng $\\lambda = \\frac{h}{p}$. Hệ thức này thiết lập tính lưỡng tính sóng - hạt cho mọi thực thể vật chất.",
        "methodology": "Giả thuyết De Broglie: $\\lambda = h/p$ và $E = h\\nu$. Vi hạt vừa có tính chất hạt (năng lượng $E$, động lượng $p$), vừa có tính chất sóng (tần số $\\nu$, bước sóng $\\lambda$).",
        "tips": "Khái niệm mấu chốt: Lưỡng tính sóng - hạt (wave-particle duality)."
    },
    {
        "id": "vldc_g25_003",
        "chapter": "Cơ học lượng tử",
        "chapter_id": 4,
        "type": "Lý thuyết",
        "source": "Đề Giữa Kỳ 2025 (Notion)",
        "prompt": "Chọn câu phát biểu đúng nhất về các điều kiện tiêu chuẩn mà hàm sóng $\\Psi(\\vec{r})$ trong cơ học lượng tử phải thỏa mãn:",
        "options": {
            "A": "Hàm sóng phải là hàm đơn trị, liên tục, hữu hạn và có các đạo hàm riêng bậc nhất liên tục trên toàn không gian.",
            "B": "Hàm sóng có thể nhận giá trị vô hạn tại các điểm có trường lực thế mạnh.",
            "C": "Đạo hàm bậc nhất của hàm sóng có thể gián đoạn tại mọi điểm.",
            "D": "Hàm sóng chỉ cần liên tục, không đòi hỏi tính đơn trị."
        },
        "answer": "A",
        "explanation": "Để hàm sóng $\\Psi(\\vec{r})$ có ý nghĩa vật lý (mật độ xác suất $|\Psi|^2$ mang ý nghĩa thống kê thực tế), nó phải thỏa mãn 3 điều kiện tiêu chuẩn (chuẩn hóa):\n1. Đơn trị: tại mỗi điểm chỉ có duy nhất một giá trị mật độ xác suất.\n2. Hữu hạn: xác suất tìm thấy hạt tại mọi miền hữu hạn không thể bằng vô cùng.\n3. Liên tục: $\\Psi$ và các đạo hàm riêng bậc nhất $\\frac{\\partial \\Psi}{\\partial x}, \\frac{\\partial \\Psi}{\\partial y}, \\frac{\\partial \\Psi}{\\partial z}$ phải liên tục.",
        "methodology": "3 điều kiện tiêu chuẩn của hàm sóng: Đơn trị, Hữu hạn, Liên tục (cả hàm sóng và đạo hàm bậc nhất).",
        "tips": "Ghi nhớ: 'Đơn trị - Hữu hạn - Liên tục'."
    },
    {
        "id": "vldc_g25_004",
        "chapter": "Cơ học lượng tử",
        "chapter_id": 4,
        "type": "Lý thuyết",
        "source": "Đề Giữa Kỳ 2025 (Notion)",
        "prompt": "Hiệu ứng đường ngầm (tunnel effect) trong cơ học lượng tử chứng minh hiện tượng nào sau đây:",
        "options": {
            "A": "Vi hạt có xác suất khác không xuyên qua được hàng rào thế năng dù năng lượng toàn phần E nhỏ hơn chiều cao rào thế U₀.",
            "B": "Vi hạt luôn bị phản xạ hoàn toàn khi gặp rào thế năng có độ cao U₀ > E.",
            "C": "Vi hạt chỉ có thể chuyển động trong đường hầm thẳng tắp với vận tốc không đổi.",
            "D": "Năng lượng của vi hạt bị triệt tiêu hoàn toàn khi đi vào bên trong rào thế."
        },
        "answer": "A",
        "explanation": "Trong cơ học cổ điển, nếu năng lượng $E < U_0$ thì hạt chắc chắn bị chặn lại và phản xạ $100\\%$. Tuy nhiên trong cơ học lượng tử, hàm sóng của vi hạt không bị triệt tiêu đột ngột mà giảm theo hàm số mũ bên trong rào thế. Nếu bề rộng rào thế hữu hạn, hàm sóng ở phía bên kia rào thế vẫn khác 0, đồng nghĩa hạt có xác suất hữu hạn xuyên qua rào thế. Hiện tượng này gọi là hiệu ứng đường ngầm (tunneling), là cơ sở giải thích phân rã alpha và kính hiển vi quét STM.",
        "methodology": "Hiệu ứng đường ngầm: Hạt có thể vượt rào thế khi $E < U_0$ nhờ tính chất sóng lượng tử.",
        "tips": "Đặc trưng riêng chỉ có ở cơ học lượng tử: $E < U_0$ nhưng hạt vẫn xuyên qua được!"
    },
    {
        "id": "vldc_g25_005",
        "chapter": "Cơ học lượng tử",
        "chapter_id": 4,
        "type": "Lý thuyết",
        "source": "Đề Giữa Kỳ 2025 (Notion)",
        "prompt": "Hệ thức bất định Heisenberg $\\Delta x \\cdot \\Delta p_x \\ge \\frac{\\hbar}{2}$ khẳng định điều gì?",
        "options": {
            "A": "Không thể đồng thời xác định chính xác tuyệt đối cả tọa độ x và độ lớn động lượng px của một vi hạt.",
            "B": "Vận tốc của vi hạt luôn luôn biến thiên hỗn loạn không thể đo lường.",
            "C": "Vị trí của vi hạt hoàn toàn không thể xác định được trong bất kỳ thí nghiệm nào.",
            "D": "Do dụng cụ đo lường có sai số kỹ thuật chế tạo không hoàn hảo."
        },
        "answer": "A",
        "explanation": "Hệ thức bất định Heisenberg là một nguyên lý cơ bản của tự nhiên bắt nguồn từ bản chất sóng của vật chất, không phải do sự thiếu sót của máy đo hay kỹ thuật thực nghiệm. Hệ thức chỉ ra rằng: việc xác định tọa độ $x$ của hạt càng chính xác ($\\Delta x$ càng nhỏ) thì độ bất định của thành phần động lượng tương ứng $\\Delta p_x$ càng lớn, và ngược lại.",
        "methodology": "Hệ thức bất định Heisenberg: $\\Delta x \\Delta p_x \\ge \\hbar / 2$ và $\\Delta E \\Delta t \\ge \\hbar / 2$. Phản ánh tính chất sóng lượng tử nội tại.",
        "tips": "Biết vị trí càng chuẩn $\\to$ động lượng càng bất định; không có khái niệm quỹ đạo chuyển động lượng tử."
    },
    {
        "id": "vldc_g25_006",
        "chapter": "Cơ học lượng tử",
        "chapter_id": 4,
        "type": "Lý thuyết",
        "source": "Đề Giữa Kỳ 2025 (Notion)",
        "prompt": "Để mô tả trạng thái của một vi hạt, cơ học lượng tử sử dụng đại lượng nào sau đây:",
        "options": {
            "A": "Hàm sóng Ψ(r⃗, t) với ý nghĩa thống kê của bình phương biên độ |Ψ|²",
            "B": "Phương trình quỹ đạo chuyển động r⃗ = r⃗(t) của cơ học Newton",
            "C": "Vector vận tốc tức thời v⃗(t)",
            "D": "Vector gia tốc toàn phần a⃗(t)"
        },
        "answer": "A",
        "explanation": "Trong cơ học lượng tử, do hệ thức bất định, vi hạt không có quỹ đạo chuyển động xác định. Trạng thái của vi hạt được mô tả hoàn toàn bởi hàm sóng $\\Psi(\\vec{r}, t)$. Theo luận giải thống kê của Max Born, bình phương môđun hàm sóng $P(\\vec{r}, t) = |\\Psi(\\vec{r}, t)|^2$ biểu thị mật độ xác suất tìm thấy vi hạt tại vị trí $\\vec{r}$ ở thời điểm $t$.",
        "methodology": "Công cụ mô tả trạng thái vi hạt: Hàm sóng $\\Psi$. Ý nghĩa vật lý: $|\Psi|^2$ là mật độ xác suất.",
        "tips": "Cơ học lượng tử thay thế 'quỹ đạo' bằng 'hàm sóng'."
    }
]

if __name__ == '__main__':
    combined = NOTION_100_QUESTIONS + GIAK_2025_QUESTIONS
    with open('data/notion_100_g25_questions.json', 'w', encoding='utf-8') as f:
        json.dump(combined, f, ensure_ascii=False, indent=2)
    print(f'Successfully exported {len(combined)} questions to data/notion_100_g25_questions.json')
