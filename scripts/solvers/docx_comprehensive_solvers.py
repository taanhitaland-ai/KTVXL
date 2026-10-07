import re

# ==============================================================================
# COMPREHENSIVE SOLVER FOR ALL 5 DOCX EXAMS (DE_001 TO DE_005, 200 QUESTIONS TOTAL)
# 100% Individual Mapping according to Official KMA Exam Matrices & Schematics
# With Clean LaTeX Formula Formatting ($ ... $)
# ==============================================================================

# --- DE_001 (40 Questions) ---
DE_001_DATA = {
    1: {
        "clo": "CLO1", "level": "NB", "topic": "Kiến trúc CPU ARM & Thumb", "ans": "A",
        "meth": "Đặc tính kiến trúc ARM: Trạng thái ARM thực thi lệnh 32-bit; trạng thái Thumb thực thi tập lệnh nén 16-bit.",
        "tips": "ARM = 32-bit, Thumb = 16-bit.",
        "exp": "ARM7TDMI có hai trạng thái hoạt động: Trạng thái ARM thực thi các lệnh $32\\,\\text{bit}$ với dữ liệu $32\\,\\text{bit}$ mang lại hiệu năng cao nhất; Trạng thái Thumb thực thi tập lệnh nén $16\\,\\text{bit}$ giúp tiết kiệm không gian bộ nhớ mã nguồn và tối ưu hóa hệ thống nhúng."
    },
    2: {
        "clo": "CLO1", "level": "NB", "topic": "Nguyên lý máy tính Von Neumann", "ans": "A",
        "meth": "Nguyên lý Von Neumann: Toàn bộ chương trình và dữ liệu phải được nạp vào Bộ nhớ chính trước khi CPU thực thi.",
        "tips": "Trước khi chạy chương trình luôn nằm trong 'Bộ nhớ chính'.",
        "exp": "Theo nguyên lý kiến trúc máy tính Von Neumann, trước khi được CPU tìm nạp và thực hiện, toàn bộ chương trình và dữ liệu bắt buộc phải được lưu trữ sẵn trong bộ nhớ chính (Main Memory - ROM/RAM)."
    },
    3: {
        "clo": "CLO1", "level": "NB", "topic": "Nguyên tắc hoạt động của CPU", "ans": "D",
        "meth": "Đặc tính hoạt động của CPU: Thực hiện lệnh tuần tự, biểu diễn bằng mã máy nhị phân, kết nối qua bus hệ thống.",
        "tips": "Cả 3 đáp án trên đều đúng.",
        "exp": "CPU làm việc theo nguyên tắc: Thực hiện các lệnh liên tục và tuần tự theo chu kỳ lệnh; mỗi lệnh được biểu diễn bằng mã máy nhị phân (Opcode + Toán hạng); và CPU giao tiếp trao đổi dữ liệu với các khối khác trong hệ thống thông qua hệ thống Bus. Cả 3 phát biểu đều hoàn toàn chính xác."
    },
    4: {
        "clo": "CLO1", "level": "TH", "topic": "Không gian địa chỉ của bộ vi xử lý", "ans": "A",
        "meth": "Công thức: Số đường địa chỉ $N = (\\text{Chỉ số cao} - \\text{Chỉ số thấp} + 1)$. Dung lượng $= 2^N\\,\\text{Byte}$.",
        "tips": "Casio 580VNX: Bấm $2^{N - 20}\\,\\text{MB}$ hoặc $2^{N - 30}\\,\\text{GB}$.",
        "exp": "Số đường địa chỉ của CPU quyết định dung lượng bộ nhớ tối đa CPU có thể quản lý theo công thức $2^N\\,\\text{Byte}$. Với 25 đường địa chỉ ($A_{24} - A_0$): $2^{25}\\,\\text{Byte} = 32\\,\\text{MB}$; Với 34 đường địa chỉ ($A_{33} - A_0$): $2^{34}\\,\\text{Byte} = 16\\,\\text{GB}$."
    },
    5: {
        "clo": "CLO1", "level": "NB", "topic": "Dung lượng bộ nhớ chương trình ngoài tối đa 89C51", "ans": "A",
        "meth": "Bus địa chỉ 16 bit ($A_0 - A_{15}$) quản lý tối đa $2^{16} = 64\\,\\text{KB}$.",
        "tips": "16 bit = 64 KB.",
        "exp": "Vi điều khiển 89C51 có thanh ghi bộ đếm chương trình PC $16\\,\\text{bit}$ và bus địa chỉ $16\\,\\text{bit}$ (ghép từ cổng P0 và P2), cho phép truy xuất không gian bộ nhớ chương trình ngoài tối đa là $2^{16}\\,\\text{Byte} = 65{,}536\\,\\text{Byte} = 64\\,\\text{KB}$."
    },
    6: {
        "clo": "CLO1", "level": "TH", "topic": "Chức năng chân điều khiển EA", "ans": "A",
        "meth": "Chân $\\overline{\\text{EA}}$ (External Access): Mức cao (+5V) chạy ROM nội trước, ROM ngoại sau; Mức thấp (0V) chỉ chạy ROM ngoại.",
        "tips": "EA mức cao -> Giao tiếp cả ROM nội và ROM ngoại.",
        "exp": "Khi chân tín hiệu $\\overline{\\text{EA}}$ (External Access) của vi điều khiển 89C51 được đặt ở mức điện thế cao (+5V), CPU sẽ ưu tiên thực thi chương trình trong ROM nội ($0000\\text{H} - 0\\text{FFFH}$), và khi vượt quá $4\\,\\text{KB}$ sẽ tự động chuyển sang giao tiếp với bộ nhớ ROM ngoại."
    },
    7: {
        "clo": "CLO2", "level": "TH", "topic": "Định địa chỉ bit trong thanh ghi SFR", "ans": "A",
        "meth": "Quy tắc: Thanh ghi SFR có địa chỉ tận cùng là $0\\text{H}$ hoặc $8\\text{H}$ thì định địa chỉ theo từng bit được.",
        "tips": "Các thanh ghi định địa chỉ bit: ACC (E0H), B (F0H), PSW (D0H), P0-P3, IP, TCON, SCON, IE.",
        "exp": "Trong kiến trúc 8051, một thanh ghi chức năng đặc biệt SFR có thể định địa chỉ bit khi và chỉ khi địa chỉ của nó có chữ số tận cùng là 0 hoặc 8 (chia hết cho 8). Nhóm ACC ($E0\\text{H}$), B ($F0\\text{H}$), PSW ($D0\\text{H}$) đều thỏa mãn quy tắc này."
    },
    8: {
        "clo": "CLO2", "level": "NB", "topic": "Cấu trúc thanh ghi cờ trạng thái PSW", "ans": "A",
        "meth": "Thứ tự 8 bit trong PSW: CY(7) - AC(6) - F0(5) - RS1(4) - RS0(3) - OV(2) - Dự trữ(1) - P(0).",
        "tips": "Bit 0 = Cờ P (Parity); Bit 6 = Cờ AC; Bit 7 = Cờ CY; Bit 2 = Cờ OV.",
        "exp": "Thanh ghi trạng thái chương trình PSW gồm 8 bit: bit 7 là CY (cờ nhớ), bit 6 là AC (cờ nhớ phụ), bit 2 là OV (cờ tràn) và bit 0 là P (cờ Parity kiểm tra tính chẵn lẻ của thanh ghi A)."
    },
    9: {
        "clo": "CLO2", "level": "TH", "topic": "Dung lượng bộ nhớ mở rộng trên sơ đồ", "ans": "8",
        "meth": "Đếm số chân địa chỉ nối vào chip nhớ: $N$ chân địa chỉ $\\implies$ Dung lượng $= 2^N\\,\\text{Byte}$.",
        "tips": "Casio 580VNX: $2^{13-10} = 8\\,\\text{KB}$ (IC 2764/6264). Điền số: 8.",
        "exp": "Trên sơ đồ mạch mở rộng, chip nhớ có 13 đường địa chỉ ($A_0 - A_{12}$). Dung lượng chip nhớ mở rộng là $2^{13}\\,\\text{Byte} = 8{,}192\\,\\text{Byte} = 8\\,\\text{KB}$."
    },
    10: {
        "clo": "CLO2", "level": "TH", "topic": "Thông số chip nhớ chuẩn trên sơ đồ", "ans": "A",
        "meth": "Đọc mã hiệu IC: 2764 / 6264 có dung lượng là $64\\,\\text{Kbit} = 8\\text{K} \\times 8\\,\\text{bit}$ ($8\\,\\text{KB}$).",
        "tips": "2764 / 6264 -> 8K x 8 bit.",
        "exp": "Mạch mở rộng sử dụng vi mạch nhớ chuẩn 2764 / 6264 có dung lượng chuẩn là $64\\,\\text{Kilobit} = 8\\,\\text{Kilobyte}$, tương ứng tổ chức $8\\text{K} \\times 8\\,\\text{bit}$."
    },
    11: {
        "clo": "CLO2", "level": "TH", "topic": "Kết nối các đường địa chỉ cho bộ nhớ mở rộng", "ans": "A",
        "meth": "Phân chia bus địa chỉ: P0 đảm nhiệm 8 bit thấp $A_0-A_7$, cổng P2 đảm nhiệm các bit cao còn lại.",
        "tips": "4KB cần 12 đường -> P0.0-P0.7 và P2.0-P2.3; 8KB cần 13 đường -> P0.0-P0.7 và P2.0-P2.4.",
        "exp": "Để mở rộng bộ nhớ $4\\,\\text{KB}$ ($2^{12}\\,\\text{Byte}$), vi điều khiển cần 12 đường địa chỉ: 8 đường byte thấp P0.0–P0.7 và 4 đường byte cao P2.0–P2.3."
    },
    12: {
        "clo": "CLO2", "level": "VD", "topic": "Tính địa chỉ cao nhất của chip nhớ", "ans": "7FFF",
        "meth": "Địa chỉ cao nhất đạt được khi các bit địa chỉ nội đều bằng 1 và các bit chọn chip ở mức tích cực.",
        "tips": "Casio 580VNX: Ghép các bit nhị phân rồi bấm phím HEX.",
        "exp": "Với P2.7=0 và IC2 có 15 bit địa chỉ ($A_0 - A_{14}$), địa chỉ cao nhất đạt được khi toàn bộ 15 bit đều bằng 1: $0111\\,1111\\,1111\\,1111_2 = 7\\text{FFFH}$."
    },
    13: {
        "clo": "CLO2", "level": "NB", "topic": "Chế độ định địa chỉ tức thời", "ans": "A",
        "meth": "Dấu hiệu nhận biết: Tiền tố '#' trước toán hạng hằng số.",
        "tips": "Thấy dấu '#' -> Chế độ định địa chỉ tức thời (Immediate Addressing).",
        "exp": "Trong chế độ định địa chỉ tức thời (Immediate Addressing), toán hạng nguồn là một giá trị hằng số cố định nằm ngay sau mã thao tác Opcode, được nhận biết bởi ký tự tiền tố '#' (ví dụ: `MOV A, #55H`)."
    },
    14: {
        "clo": "CLO2", "level": "NB", "topic": "Cú pháp hợp ngữ 8051", "ans": "A",
        "meth": "Quy tắc cú pháp: Nhãn dòng lệnh (Label) luôn kết thúc bằng dấu hai chấm ':'.",
        "tips": "Dấu hai chấm ':' kết thúc tên nhãn.",
        "exp": "Trong ngôn ngữ hợp ngữ Assembly 8051, một nhãn dòng lệnh (Label) luôn kết thúc bằng dấu hai chấm ':' (ví dụ `START:`, `LOOP:`) để phân biệt nhãn với mã thao tác lệnh."
    },
    15: {
        "clo": "CLO2", "level": "NB", "topic": "Phân loại tập lệnh 8051", "ans": "A",
        "meth": "XRL thực hiện phép XOR từng bit -> Thuộc nhóm lệnh tính toán logic.",
        "tips": "XRL = Exclusive OR Logic -> Lệnh logic.",
        "exp": "Lệnh `XRL` (Exclusive OR Logic) thực hiện phép toán XOR từng bit giữa hai toán hạng, do đó thuộc nhóm Lệnh tính toán logic và dịch bit của vi điều khiển 8051."
    },
    16: {
        "clo": "CLO2", "level": "TH", "topic": "Tính hợp lệ của lệnh Assembly 8051", "ans": "A",
        "meth": "Quy tắc: Toán hạng đích không thể là hằng số tức thời mang dấu '#'.",
        "tips": "Đích có dấu '#' -> Lệnh SAI cú pháp.",
        "exp": "Lệnh `MOV #0B0H, A` là lệnh SAI cú pháp vì toán hạng đích đứng trước phải là thanh ghi hoặc ô nhớ hợp lệ, không thể là hằng số tức thời có tiền tố '#'!"
    },
    17: {
        "clo": "CLO2", "level": "TH", "topic": "Lệnh điều khiển vòng lặp DJNZ", "ans": "A",
        "meth": "DJNZ = Giảm 1 (Decrement) và Nhảy nếu khác 0 (Jump if Not Zero).",
        "tips": "DJNZ R0, rel: Giảm R0 đi 1, nếu khác 0 thì nhảy tới rel.",
        "exp": "Lệnh `DJNZ R0, rel` (Decrement and Jump if Not Zero) giảm nội dung thanh ghi R0 đi 1 đơn vị; nếu kết quả khác 0 thì nhảy đến nhãn tương đối rel, nếu bằng 0 thì chuyển sang thực hiện lệnh kế tiếp."
    },
    18: {
        "clo": "CLO2", "level": "VD", "topic": "Thực hiện lệnh hoán đổi XCH", "ans": "40",
        "meth": "Lệnh `XCH A, Rn` hoán đổi trực tiếp dữ liệu giữa thanh ghi A và thanh ghi Rn.",
        "tips": "Trước: A=5BH, R1=40H -> Sau lệnh XCH A, R1 thì A=40H, R1=5BH. Điền: 40.",
        "exp": "Lệnh `XCH A, R1` hoán đổi trực tiếp nội dung giữa thanh ghi A ($5B\\text{H}$) và thanh ghi R1 ($40\\text{H}$). Do đó sau khi thực thi lệnh, nội dung trong thanh ghi A nhận giá trị của R1 là $40\\text{H}$."
    },
    19: {
        "clo": "CLO2", "level": "TH", "topic": "Trạng thái cờ sau lệnh trừ SUBB", "ans": "A",
        "meth": "Lệnh SUBB: $A = A - \\text{src} - CY$. $CY = 1$ nếu phép trừ bị mượn; $OV = 0$ nếu không tràn số có dấu.",
        "tips": "Casio 580VNX (MENU 3): Phép trừ $89\\text{H} - FE\\text{H} - 1 = 8A\\text{H}$, bị mượn nên CY=1, OV=0.",
        "exp": "Thực hiện phép trừ: $A = 89\\text{H} - FE\\text{H} - 1 = 8A\\text{H}$. Do số bị trừ $89\\text{H}$ nhỏ hơn số trừ nên phép tính sinh ra mượn, làm cho $CY = 1$. Ở biểu diễn có dấu: $-119 - (-2) - 1 = -118$, nằm trong khoảng $[-128, +127]$ nên không tràn ($OV = 0$). Vậy $CY=1, OV=0$."
    },
    20: {
        "clo": "CLO3", "level": "VD", "topic": "Theo dõi nội dung thanh ghi sau đoạn lệnh", "ans": "7E",
        "meth": "Lần vết tuần tự từng lệnh: `MOV R0, #7FH; DEC @R0; DEC R0; DEC @R0`.",
        "tips": "R0 ban đầu là 7FH, sau lệnh DEC R0 thì R0 = 7EH. Điền số: 7E.",
        "exp": "Lần vết thực thi: Lệnh `MOV R0, #7FH` nạp $7F\\text{H}$ vào R0. Sau đó thực hiện giảm ô nhớ @R0, rồi thực hiện `DEC R0` làm cho giá trị trong thanh ghi R0 giảm từ $7F\\text{H}$ xuống $7E\\text{H}$."
    },
    21: {
        "clo": "CLO3", "level": "TH", "topic": "Giá trị thanh ghi sau đoạn lệnh", "ans": "A",
        "meth": "Lần vết lệnh: `MOV A, #0FFH; ADD A, #1` $\\implies A = 00\\text{H}, CY=1$. JNZ không nhảy, tiếp tục `ADDC A, #02H` $\\implies A = 0 + 2 + 1 = 3$.",
        "tips": "0FFH + 1 = 00H (CY=1), ADDC A, #02H -> A = 0 + 2 + 1 = 03H.",
        "exp": "Lệnh `ADD A, #1` với $A = 0FF\\text{H}$ cho kết quả $A = 00\\text{H}$ và $CY = 1$. Do $A = 00\\text{H}$, điều kiện nhảy `JNZ SKIP` không thỏa mãn nên chương trình đi tiếp xuống lệnh `ADDC A, #02H` tính $A = 00\\text{H} + 02\\text{H} + CY (1) = 03\\text{H}$."
    },
    22: {
        "clo": "CLO3", "level": "TH", "topic": "Nhận diện chức năng chương trình con", "ans": "A",
        "meth": "Tính thời gian trễ vòng lặp: $2 \\times 250 \\times 2\\,\\mu\\text{s} \\approx 1 - 2\\,\\text{ms}$.",
        "tips": "MOV R6, #02 và R1, #250 -> Tạo trễ thời gian 2ms.",
        "exp": "Chương trình con sử dụng hai vòng lặp lồng nhau với thanh ghi R6 nạp 2 và R1 nạp 250. Mỗi chu kỳ lệnh DJNZ tiêu tốn 2 chu kỳ máy ($2\\,\\mu\\text{s}$ với thạch anh $12\\,\\text{MHz}$), tổng thời gian tạo trễ xấp xỉ $2 \\times 250 \\times 2\\,\\mu\\text{s} \\approx 2\\,\\text{ms}$."
    },
    23: {
        "clo": "CLO3", "level": "VD", "topic": "Hoàn thiện giá trị vào chỗ trống", "ans": "58",
        "meth": "Tính giá trị cần nạp bằng cách đảo ngược phép toán logic.",
        "tips": "Điền số Hex: 58.",
        "exp": "Thực hiện phép tính toán logic ngược: Để sau phép toán `ANL A, #9BH` thanh ghi A có kết quả $91\\text{H}$, giá trị ban đầu cần nạp là $58\\text{H}$."
    },
    24: {
        "clo": "CLO3", "level": "VD", "topic": "Dịch bit và tính toán số học qua vòng lặp", "ans": "A",
        "meth": "Lệnh RR A quay phải 1 bit không qua cờ nhớ. Lặp 5 lần với $A = 3B\\text{H} = 0011\\,1011_2$.",
        "tips": "Quay phải 5 lần tương đương quay trái 3 lần: 3BH -> D9H.",
        "exp": "Với $A = 3B\\text{H} = 0011\\,1011_2$, sau khi thực hiện 5 lần lệnh quay phải `RR A` trong vòng lặp DJNZ, các bit dịch chuyển tuần hoàn cho kết quả là $1101\\,1001_2 = D9\\text{H}$."
    },
    25: {
        "clo": "CLO3", "level": "VD", "topic": "Nhận diện luồng thực thi", "ans": "A",
        "meth": "Kiểm tra bit: P1 = 0CAH = 1100_1010b -> bit P1.2 = 0. JB P1.2 không nhảy, đi tiếp xuống JNB AC3, L2 -> nhảy tới L2.",
        "tips": "P1.2 = 0 -> không nhảy L1; JNB kiểm tra bit 0 -> nhảy tới L2.",
        "exp": "Với $P1 = 0CA\\text{H} = 1100\\,1010_2$, bit P1.2 bằng 0 nên lệnh `JB P1.2, L1` không thỏa mãn. Chương trình đi tiếp tới lệnh `JNB AC3, L2` có điều kiện thỏa mãn và chuyển luồng thực thi tới nhãn L2."
    },
    26: {
        "clo": "CLO3", "level": "TH", "topic": "Xóa cờ tràn Timer 0", "ans": "A",
        "meth": "Cờ tràn TF0 trong thanh ghi TCON được xóa bằng lệnh phần mềm CLR TF0.",
        "tips": "Xóa cờ tràn Timer 0 -> CLR TF0.",
        "exp": "Để xóa cờ báo tràn của Timer 0 sau khi Timer đếm tràn, lập trình viên cần thực hiện lệnh xóa bit bằng phần mềm: `CLR TF0` (xóa bit TF0 trong thanh ghi TCON)."
    },
    27: {
        "clo": "CLO3", "level": "TH", "topic": "Kỹ thuật định thời nhỏ hơn 10µs", "ans": "A",
        "meth": "Với khoảng thời gian cực ngắn (< 10µs), thời gian cấu hình và bật tắt Timer đã chiếm vài µs nên tối ưu nhất là dùng điều chỉnh bằng phần mềm (lệnh NOP hoặc vòng lặp ngắn).",
        "tips": "Định thời < 10µs -> Điều chỉnh bằng phần mềm.",
        "exp": "Trên vi điều khiển 89C51 với thạch anh $12\\,\\text{MHz}$, mỗi chu kỳ máy là $1\\,\\mu\\text{s}$. Các thao tác khởi tạo và điều khiển Timer chiếm từ 3–5 chu kỳ máy, do đó với khoảng thời gian cực ngắn dưới $10\\,\\mu\\text{s}$, giải pháp chuẩn xác nhất là điều chỉnh bằng phần mềm (dùng các lệnh `NOP`)."
    },
    28: {
        "clo": "CLO3", "level": "TH", "topic": "Thời gian định thời tối đa", "ans": "A",
        "meth": "Chế độ 1 sử dụng bộ đếm 16-bit: $2^{16} = 65{,}536$ xung. Với $T_{\\text{ckm}} = 1\\,\\mu\\text{s} \\implies 65{,}536\\,\\mu\\text{s} \\approx 65{,}536\\,\\text{ms}$.",
        "tips": "Mode 1 16-bit -> 65536.",
        "exp": "Trong Chế độ 1 của bộ định thời 8051, bộ đếm sử dụng trọn vẹn $16\\,\\text{bit}$ ghép từ TH và TL, số xung đếm tối đa từ $0000\\text{H}$ đến khi tràn là $2^{16} = 65{,}536$ xung. Với thạch anh $12\\,\\text{MHz}$ ($T_{\\text{ckm}} = 1\\,\\mu\\text{s}$), thời gian định thời tối đa là $65{,}536\\,\\mu\\text{s}$ (tương ứng câu hỏi trắc nghiệm ghi $65536\\,\\text{ms}$)."
    },
    29: {
        "clo": "CLO3", "level": "VD", "topic": "Tính giá trị nạp cho Timer", "ans": "A",
        "meth": "Công thức nạp: $T_{\\text{ckm}} = \\frac{12}{6\\,\\text{MHz}} = 2\\,\\mu\\text{s}$. Số xung $N = \\frac{100\\,\\mu\\text{s}}{2\\,\\mu\\text{s}} = 50$ xung. Giá trị nạp $= 256 - 50 = 206 = CE\\text{H}$.",
        "tips": "Casio 580VNX: 256 - 50 = 206 -> HEX: CE. Chọn TH1 = CEH.",
        "exp": "Với thạch anh $6\\,\\text{MHz}$, chu kỳ máy là $T_{\\text{ckm}} = \\frac{12}{6\\,\\text{MHz}} = 2\\,\\mu\\text{s}$. Để tạo độ trễ $100\\,\\mu\\text{s}$, số xung đếm cần thiết là $N = \\frac{100}{2} = 50$ xung. Timer 1 ở Chế độ 2 (8-bit tự nạp lại) nên giá trị nạp vào TH1 là $256 - 50 = 206 = CE\\text{H}$."
    },
    30: {
        "clo": "CLO3", "level": "VD", "topic": "Lập trình Timer tạo sóng vuông", "ans": "A",
        "meth": "Giá trị nạp FE0CH -> Số xung đếm $N = 65536 - 65036 = 500$ xung $= 500\\,\\mu\\text{s}$. Chu kỳ sóng $T = 2 \\times 500\\,\\mu\\text{s} = 1000\\,\\mu\\text{s}$.",
        "tips": "Nửa chu kỳ 500µs -> Chu kỳ toàn phần 1000µs.",
        "exp": "Timer 0 Mode 1 nạp giá trị $FE0C\\text{H} = 65{,}036$. Số xung trước khi tràn là $65{,}536 - 65{,}036 = 500$ xung. Với thạch anh $12\\,\\text{MHz}$ ($T_{\\text{ckm}} = 1\\,\\mu\\text{s}$), thời gian trễ nửa chu kỳ là $500\\,\\mu\\text{s}$. Kết hợp lệnh đảo trạng thái `CPL P1.0`, chu kỳ toàn phần của dạng sóng vuông là $T = 2 \\times 500\\,\\mu\\text{s} = 1000\\,\\mu\\text{s}$."
    },
    31: {
        "clo": "CLO3", "level": "NB", "topic": "Kiểm tra nhận dữ liệu qua UART", "ans": "A",
        "meth": "Kiểm tra cờ RI trong thanh ghi SCON: Khi nhận xong một byte thì RI = 1.",
        "tips": "Kiểm tra cờ RI (Receive Interrupt) trong SCON.",
        "exp": "Để kiểm tra xem một byte dữ liệu đã được nhận hoàn chỉnh qua cổng nối tiếp UART hay chưa, chương trình kiểm tra trạng thái cờ ngắt nhận RI (bit SCON.0): khi nhận xong bit Stop, phần cứng tự động đặt cờ RI lên 1."
    },
    32: {
        "clo": "CLO3", "level": "TH", "topic": "Cấu hình thanh ghi SCON Chế độ 0", "ans": "A",
        "meth": "Chế độ 0: SM0 = 0, SM1 = 0. Cho phép nhận REN = 1 -> SCON = 0001_0000b = 10H.",
        "tips": "Chế độ 0 UART: SCON = 10H.",
        "exp": "Để cấu hình cổng nối tiếp hoạt động ở Chế độ 0 (thanh ghi dịch 8-bit đồng bộ, tốc độ cố định $f_{\\text{osc}}/12$) với chức năng cho phép nhận (REN = 1), ta cần nạp giá trị $0001\\_0000_2 = 10\\text{H}$ vào thanh ghi SCON."
    },
    33: {
        "clo": "CLO3", "level": "VD", "topic": "Tính tốc độ Baud với thạch anh 11.0592 MHz", "ans": "A",
        "meth": "Công thức Baud chuẩn: $\\text{Baud} = \\frac{28800}{256 - \\text{TH1}} = \\frac{28800}{|-3|} = 9600\\,\\text{bps}$.",
        "tips": "TH1 = -3: 9600 bps; TH1 = -6: 4800 bps; TH1 = -12: 2400 bps.",
        "exp": "Với tần số thạch anh chuẩn $11.0592\\,\\text{MHz}$ và Timer 1 hoạt động ở Chế độ 2: Tốc độ Baud được tính theo công thức $\\text{Baud} = \\frac{28800}{256 - \\text{TH1}}$. Với giá trị nạp $\\text{TH1} = -3$ ($FD\\text{H}$), tốc độ truyền đạt được là $\\frac{28800}{3} = 9600\\,\\text{bps}$."
    },
    34: {
        "clo": "CLO3", "level": "TH", "topic": "Quy trình truyền thông nối tiếp UART", "ans": "A",
        "meth": "Trình tự truyền: Nạp TH1 -> Bật TR1 -> Cấu hình SCON=50H -> Ghi SBUF -> Chờ TI=1 -> Xóa TI.",
        "tips": "Ghi ký tự vào SBUF và chờ cờ TI = 1.",
        "exp": "Chương trình chuẩn khởi tạo Timer 1 Mode 2 tạo tốc độ Baud, cấu hình $SCON = 50\\text{H}$, nạp mã ký tự vào thanh ghi đệm SBUF và dùng lệnh `JNB TI, HERE` (nhảy tại chỗ) chờ cờ TI bật lên 1 báo truyền xong, sau đó xóa TI bằng lệnh `CLR TI`."
    },
    35: {
        "clo": "CLO3", "level": "NB", "topic": "Điều kiện xảy ra ngắt Timer 0", "ans": "A",
        "meth": "Ngắt Timer 0 xảy ra khi bộ đếm tràn (TF0 = 1) và ngắt Timer 0 được cho phép (ET0 = 1, EA = 1).",
        "tips": "TF0 được set và bit ET0 được bật.",
        "exp": "Yêu cầu ngắt Timer 0 sẽ được phần cứng vi điều khiển kích hoạt khi bộ đếm Timer 0 đếm tràn từ giá trị cực đại về $0000\\text{H}$, làm cờ tràn TF0 trong thanh ghi TCON bật lên mức 1, đồng thời bit cho phép ngắt Timer 0 (ET0) và bit cho phép ngắt toàn cục (EA) phải được bật."
    },
    36: {
        "clo": "CLO3", "level": "NB", "topic": "Địa chỉ Vector ngắt ngoại vi 0 (INT0)", "ans": "A",
        "meth": "Bảng Vector ngắt 8051: Reset = 0000H; INT0 = 0003H; Timer 0 = 000BH; INT1 = 0013H; Timer 1 = 001BH; Serial = 0023H.",
        "tips": "INT0 -> Vector 0003H.",
        "exp": "Trong bảng vector ngắt cố định của vi điều khiển 89C51, ngắt ngoài 0 (INT0) có địa chỉ vector phục vụ ngắt cố định nằm tại địa chỉ $0003\\text{H}$ trong bộ nhớ chương trình ROM."
    },
    37: {
        "clo": "CLO3", "level": "TH", "topic": "Thanh ghi ưu tiên ngắt IP", "ans": "A",
        "meth": "Tra cứu các bit trong thanh ghi IP: bit 0: PX0, bit 1: PT0, bit 2: PX1, bit 3: PT1, bit 4: PS.",
        "tips": "IP = 0AH = 0000_1010b -> Bit 3 (PT1) và Bit 1 (PT0) được đặt lên 1.",
        "exp": "Thanh ghi ưu tiên ngắt IP có giá trị $0A\\text{H} = 0000\\_1010_2$: Bit 1 (PT0 - ưu tiên Timer 0) và Bit 3 (PT1 - ưu tiên Timer 1) được đặt lên 1, do đó hai nguồn ngắt Timer 0 và Timer 1 có mức ưu tiên cao nhất."
    },
    38: {
        "clo": "CLO3", "level": "VD", "topic": "Chu kỳ xung vuông ngắt Timer", "ans": "C",
        "meth": "Giá trị nạp FE0CH -> Số xung đếm $N = 65536 - 65036 = 500$ xung. Nửa chu kỳ trễ = $500\\,\\mu\\text{s}$ -> Chu kỳ toàn phần $T = 1\\,\\text{ms}$ (tần số $1\\,\\text{kHz}$).",
        "tips": "Casio 580VNX: FE0CH = 65036. 65536 - 65036 = 500 µs -> Chu kỳ sóng T = 2 x 500 µs = 1 ms.",
        "exp": "Chương trình nạp giá trị $FE0C\\text{H}$ ($65{,}036$ thập phân) vào Timer 0 Mode 1. Số xung đếm trước khi tràn là $65{,}536 - 65{,}036 = 500$ xung. Với thạch anh $12\\,\\text{MHz}$ ($T_{\\text{ckm}} = 1\\,\\mu\\text{s}$), thời gian nửa chu kỳ là $500\\,\\mu\\text{s}$. Chu kỳ toàn phần của sóng vuông là $T = 2 \\times 500\\,\\mu\\text{s} = 1000\\,\\mu\\text{s} = 1\\,\\text{ms}$ (tần số $f = 1\\,\\text{kHz}$)."
    },
    39: {
        "clo": "CLO3", "level": "TH", "topic": "Chương trình phục vụ ngắt ngoài", "ans": "A",
        "meth": "Vector 0013H là địa chỉ ngắt ngoài 1 (INT1). Điều khiển chân P1.3.",
        "tips": "Vector 0013H -> Ngắt ngoài 1 (INT1).",
        "exp": "Địa chỉ vector ngắt $0013\\text{H}$ trong chương trình là địa chỉ phục vụ ngắt ngoài 1 (INT1). Đoạn mã thực hiện bật và tắt chân P1.3 khi có tín hiệu kích hoạt ngắt ngoài 1."
    },
    40: {
        "clo": "CLO3", "level": "NB", "topic": "Xử lý ký tự ASCII qua UART", "ans": "A",
        "meth": "Mã ASCII chuẩn: Ký tự 'A' = 65 (41H), 'B' = 66 (42H).",
        "tips": "Mã 66 = Chữ cái 'B' in hoa.",
        "exp": "Theo bảng mã chuẩn ASCII quốc tế, giá trị số thập phân 66 (tương ứng mã Hex $42\\text{H}$) biểu diễn ký tự chữ cái 'B' in hoa. Chương trình truyền ký tự 'B' qua UART và đưa trạng thái ra cổng P1.4."
    }
}

# --- DE_002 (40 Questions) ---
DE_002_DATA = {
    1: {
        "clo": "CLO1", "level": "NB", "topic": "Chu kỳ đọc vào ra của CPU", "ans": "A",
        "meth": "Trình tự đọc I/O: CPU cấp địa chỉ cổng -> cấp tín hiệu chọn thiết bị -> phát xung yêu cầu đọc (IOR) -> nhận dữ liệu từ Data Bus.",
        "tips": "CPU luôn là bên chủ động cấp địa chỉ và tín hiệu điều khiển.",
        "exp": "Để đọc dữ liệu từ một cổng vào ra (I/O port), CPU đóng vai trò chủ động: Cấp địa chỉ của cổng lên bus địa chỉ, phát tín hiệu điều khiển chọn thiết bị ngoại vi, cấp tín hiệu yêu cầu đọc vào ra ($\\overline{\\text{IOR}}$), và sau đó thu nhận dữ liệu từ bus dữ liệu đưa vào các thanh ghi nội của CPU."
    },
    2: {
        "clo": "CLO1", "level": "NB", "topic": "Chu kỳ đọc bộ nhớ của CPU", "ans": "A",
        "meth": "Trình tự đọc bộ nhớ: CPU cấp địa chỉ ô nhớ -> phát tín hiệu chọn chip và đọc (RD) -> nhận dữ liệu từ Data Bus.",
        "tips": "Cấp địa chỉ -> Cấp điều khiển đọc -> Nhận dữ liệu từ data bus.",
        "exp": "Để đọc dữ liệu từ bộ nhớ, CPU phải thực hiện tuần tự: Cấp địa chỉ ô nhớ cần truy xuất lên bus địa chỉ, cấp tín hiệu điều khiển chọn bộ nhớ và phát tín hiệu yêu cầu đọc bộ nhớ ($\\overline{\\text{MEMR}}$/$\\overline{\\text{RD}}$), sau đó nhận byte dữ liệu được bộ nhớ đẩy lên bus dữ liệu vào thanh ghi tích lũy."
    },
    3: {
        "clo": "CLO1", "level": "NB", "topic": "Các thành phần lưu trữ trong CPU", "ans": "D",
        "meth": "Thanh ghi (Registers) nằm trực tiếp bên trong CPU, có tốc độ truy xuất nhanh nhất, dùng lưu lệnh và dữ liệu đang xử lý.",
        "tips": "Đang được xử lý ngay lập tức -> Nằm trong các 'Thanh ghi' (Registers).",
        "exp": "Trong kiến trúc hệ vi xử lý, tập thanh ghi (Registers) nằm ngay bên trong nhân CPU có tốc độ truy xuất nhanh nhất trong hệ thống phân cấp bộ nhớ, có nhiệm vụ lưu trữ các lệnh (Instruction Register) và dữ liệu (General Purpose Registers) đang được CPU trực tiếp xử lý tại chu kỳ lệnh hiện tại."
    },
    4: {
        "clo": "CLO1", "level": "TH", "topic": "Không gian địa chỉ 36 đường", "ans": "A",
        "meth": "Công thức dung lượng: $2^N\\,\\text{Byte}$. Với $N = 36$: $2^{36} = 2^6 \\times 2^{30}\\,\\text{Byte} = 64\\,\\text{GB}$.",
        "tips": "Casio 580VNX: $2^{36 - 30} = 2^6 = 64\\,\\text{GB}$.",
        "exp": "Với $N = 36$ đường bus địa chỉ, không gian địa chỉ tối đa mà bộ vi xử lý có khả năng quản lý là: $2^{36}\\,\\text{Byte} = 2^6 \\times 2^{30}\\,\\text{Byte} = 64\\,\\text{Gigabyte} = 64\\,\\text{GB}$."
    },
    5: {
        "clo": "CLO1", "level": "NB", "topic": "Số lượng Timer trong vi điều khiển 89C51", "ans": "A",
        "meth": "89C51 tích hợp 2 bộ Timer/Counter 16-bit độc lập: Timer 0 và Timer 1.",
        "tips": "89C51 có đúng 2 bộ Timer: Timer 0 và Timer 1.",
        "exp": "Chip vi điều khiển chuẩn 89C51 tích hợp sẵn 2 bộ đếm/định thời (Timer/Counter) $16\\,\\text{bit}$ độc lập, được ký hiệu là Timer 0 và Timer 1 (được điều khiển thông qua hai thanh ghi TMOD và TCON)."
    },
    6: {
        "clo": "CLO1", "level": "NB", "topic": "Chức năng chân XTAL1 và XTAL2", "ans": "A",
        "meth": "Hai chân XTAL1 (chân 19) và XTAL2 (chân 18) kết nối với mạch dao động thạch anh bên ngoài.",
        "tips": "XTAL = Crystal (Thạch anh dao động) -> Nối với bộ dao động ngoài.",
        "exp": "Hai chân XTAL1 và XTAL2 của 89C51 là ngõ vào và ngõ ra của mạch khuếch đại đảo bên trong chip, được dùng để kết nối với bộ dao động thạch anh bên ngoài (thường là $11.0592\\,\\text{MHz}$ hoặc $12\\,\\text{MHz}$) cùng hai tụ gốm $30\\,\\text{pF}$ nhằm cung cấp xung nhịp hệ thống cho vi điều khiển."
    },
    7: {
        "clo": "CLO2", "level": "TH", "topic": "Định địa chỉ bit trong SFR", "ans": "A",
        "meth": "Các thanh ghi có địa chỉ kết thúc là 0H hoặc 8H có thể định địa chỉ bit: P0(80H), P1(90H), P2(A0H), P3(B0H), IP(B8H), TCON(88H).",
        "tips": "P0~P3, IP, TCON đều chia hết cho 8 -> Định địa chỉ bit được.",
        "exp": "Các cổng vào ra P0 ($80\\text{H}$), P1 ($90\\text{H}$), P2 ($A0\\text{H}$), P3 ($B0\\text{H}$) cùng các thanh ghi điều khiển IP ($B8\\text{H}$) và TCON ($88\\text{H}$) đều có địa chỉ chia hết cho 8 (tận cùng bằng $0\\text{H}$ hoặc $8\\text{H}$), do đó tất cả các bit của chúng đều có thể được định địa chỉ độc lập từng bit (Bit Addressable)."
    },
    8: {
        "clo": "CLO2", "level": "NB", "topic": "Vị trí cờ nhớ CY trong 89C51", "ans": "A",
        "meth": "Cờ nhớ CY (Carry Flag) là bit 7 của thanh ghi trạng thái chương trình PSW (địa chỉ D7H).",
        "tips": "Cờ nhớ CY nằm ở bit PSW.7 của thanh ghi PSW.",
        "exp": "Trên vi điều khiển 89C51, cờ nhớ CY (Carry Flag) được bố trí tại bit cao nhất (bit 7) của thanh ghi trạng thái chương trình PSW (Program Status Word, địa chỉ $D0\\text{H}$)."
    },
    9: {
        "clo": "CLO2", "level": "TH", "topic": "Dung lượng RAM mở rộng trên sơ đồ", "ans": "8",
        "meth": "Sơ đồ gồm 2 IC nhớ (U3 và U4), mỗi IC có 12 đường địa chỉ A0-A11 -> Mỗi IC là $2^{12} = 4\\,\\text{KB}$. Tổng dung lượng $= 4\\,\\text{KB} + 4\\,\\text{KB} = 8\\,\\text{KB}$.",
        "tips": "2 chip x 4KB = 8 KB. Điền số: 8.",
        "exp": "Trên sơ đồ mạch, cả hai chip nhớ RAM U3 và U4 đều có 12 đường địa chỉ ($A_0 - A_{11}$), tương ứng dung lượng mỗi chip là $2^{12}\\,\\text{Byte} = 4\\,\\text{KB}$. Hai chip được giải mã bằng đường P2.4 qua cổng đảo, tổng không gian địa chỉ RAM mở rộng là $4\\,\\text{KB} + 4\\,\\text{KB} = 8\\,\\text{KB}$."
    },
    10: {
        "clo": "CLO2", "level": "VD", "topic": "Giải mã địa chỉ bộ nhớ ROM mở rộng", "ans": "A",
        "meth": "Chip U3 có 11 đường địa chỉ A0-A10 (độ dài 2KB = 800H). Các bit cao $A_{15}..A_{11} = 01011_2 = 58\\text{H} \\implies 5800\\text{H} - 5\\text{FFFH}$.",
        "tips": "Ghép các bit P2: 0101 1000 = 58H -> Bắt đầu từ 5800H đến 5FFFH.",
        "exp": "Chip nhớ ROM U3 có 11 đường địa chỉ ($A_0 - A_{10}$), dung lượng $2^{11} = 2048\\,\\text{Byte} = 800\\text{H}$. Với các bit chọn chip: $\\text{P2.7}=0, \\text{P2.6}=1, \\text{P2.5}=0, \\text{P2.4}=1, \\text{P2.3}=1$, 5 bit cao của địa chỉ ($A_{15}-A_{11}$) cố định là $01011_2$. Địa chỉ bắt đầu: $0101\\,1000\\,0000\\,0000_2 = 5800\\text{H}$; Địa chỉ kết thúc: $0101\\,1111\\,1111\\,1111_2 = 5\\text{FFFH}$. Vậy dải địa chỉ là $5800\\text{H} – 5\\text{FFFH}$."
    },
    11: {
        "clo": "CLO2", "level": "TH", "topic": "Kết nối bus địa chỉ cho RAM 2Kx8bit", "ans": "A",
        "meth": "Bộ nhớ 2KB ($2^{11}\\,\\text{Byte}$) cần đúng 11 đường địa chỉ: 8 đường byte thấp P0.0-P0.7 và 3 đường byte cao P2.0-P2.2.",
        "tips": "2KB = 2^11 Byte -> 11 đường: 8 đường P0 + 3 đường P2 (P2.0..P2.2).",
        "exp": "Bộ nhớ RAM $2\\text{K} \\times 8\\,\\text{bit}$ có dung lượng $2048\\,\\text{Byte} = 2^{11}\\,\\text{Byte}$, do đó cần đúng 11 đường địa chỉ. Cổng P0 (qua IC chốt $74\\text{HC}573$) cung cấp 8 đường địa chỉ byte thấp $A_0 - A_7$ (P0.0–P0.7), và cổng P2 cung cấp 3 đường địa chỉ byte cao $A_8 - A_{10}$ (P2.0–P2.2)."
    },
    12: {
        "clo": "CLO2", "level": "VD", "topic": "Địa chỉ cao nhất của chip nhớ IC4", "ans": "5FFF",
        "meth": "IC4 chọn bởi ngõ ra Y2 của 74LS139: E=0 (P2.7=0), B=1 (P2.6=1), A=0 (P2.5=0) -> A15..A13 = 010_2. 13 bit địa chỉ nội A0-A12 đều bằng 1 -> 0101_1111_1111_1111b = 5FFFH.",
        "tips": "Ghép bit: 0101 1111 1111 1111 -> HEX: 5FFF. Điền số: 5FFF.",
        "exp": "Trên sơ đồ giải mã sử dụng $74\\text{LS}139$, IC4 được kích hoạt khi ngõ ra $Y_2$ ở mức thấp ($0$). Điều kiện giải mã là chân cho phép $\\overline{E}=0$ (tức $\\text{P2.7}=0$) và ngõ vào chọn kênh $BA = 10_2$ (tức $\\text{P2.6}=1, \\text{P2.5}=0$). Ba bit cao của địa chỉ cố định là $A_{15}A_{14}A_{13} = 010_2$. IC4 có 13 đường địa chỉ nội ($A_0 - A_{12}$), khi toàn bộ 13 bit này đạt mức 1 ta được địa chỉ cao nhất: $010\\,1\\,1111\\,1111\\,1111_2 = 5\\text{FFFH}$."
    },
    13: {
        "clo": "CLO2", "level": "NB", "topic": "Chế độ định địa chỉ tức thời", "ans": "A",
        "meth": "Toán hạng nguồn mang tiền tố '#' (#3AH) -> Định địa chỉ tức thời.",
        "tips": "Có dấu '#' là định địa chỉ tức thời.",
        "exp": "Trong câu lệnh `MOV A, #3AH`, toán hạng nguồn là một giá trị hằng số cố định được đặt ngay sau mã lệnh và nhận biết qua tiền tố '#', do đó chế độ định địa chỉ được sử dụng là Chế độ định địa chỉ tức thời (Immediate Addressing)."
    },
    14: {
        "clo": "CLO2", "level": "NB", "topic": "Cấu trúc một dòng lệnh Assembly", "ans": "A",
        "meth": "Cấu trúc tuần tự 4 trường: [Nhãn] -> Mã lệnh -> [Toán hạng] -> [Ghi chú].",
        "tips": "Nhãn lệnh, mã lệnh, toán hạng và ghi chú.",
        "exp": "Một câu lệnh hợp ngữ đầy đủ trong chuẩn Assembly 8051 gồm 4 thành phần theo đúng thứ tự từ trái sang phải: Nhãn lệnh (Label), Mã lệnh (Mnemonic/Opcode), Toán hạng (Operands), và Ghi chú/chú thích (Comments)."
    },
    15: {
        "clo": "CLO2", "level": "NB", "topic": "Phân loại lệnh DIV", "ans": "A",
        "meth": "DIV thực hiện phép chia 8-bit giữa thanh ghi A và B -> Thuộc nhóm lệnh số học.",
        "tips": "DIV = Divide (phép chia) -> Lệnh số học.",
        "exp": "Lệnh `DIV AB` thực hiện phép chia số nguyên không dấu giữa nội dung thanh ghi tích lũy A cho thanh ghi B (thương số lưu trong A, phần dư lưu trong B), do đó thuộc nhóm Lệnh số học (Arithmetic instructions)."
    },
    16: {
        "clo": "CLO2", "level": "NB", "topic": "Chức năng lệnh MOV A, B", "ans": "A",
        "meth": "MOV đích, nguồn: Sao chép dữ liệu từ toán hạng nguồn (B) sang toán hạng đích (A).",
        "tips": "MOV A, B: Sao chép từ B vào A.",
        "exp": "Lệnh `MOV A, B` sao chép nội dung hiện có trong thanh ghi B (toán hạng nguồn) và chuyển vào thanh ghi tích lũy A (toán hạng đích). Sau lệnh, giá trị trong thanh ghi B vẫn được giữ nguyên."
    },
    17: {
        "clo": "CLO2", "level": "TH", "topic": "Lệnh kiểm tra bit và xóa bit JBC", "ans": "A",
        "meth": "JBC bit, rel: Nhảy nếu bit bằng 1 và tự động xóa bit về 0.",
        "tips": "JBC = Jump if Bit set and Clear bit.",
        "exp": "Lệnh `JBC bit, rel` (Jump if Bit is set and Clear bit) thực hiện kiểm tra trạng thái của bit chỉ định: Nếu bit bằng 1 (khác 0), phần cứng sẽ tự động xóa bit đó về 0 và chuyển hướng luồng chương trình nhảy tới nhãn tương đối rel (`JBC PROM1`)."
    },
    18: {
        "clo": "CLO2", "level": "VD", "topic": "Tính giá trị thanh ghi PSW sau SUBB", "ans": "85",
        "meth": "A=5BH, 40H=C3H, PSW ban đầu=81H (CY=1). SUBB: A = 5BH - C3H - 1 = 97H. CY=1 (mượn), OV=1 (tràn có dấu), P=1 (97H có 5 bit 1). Ghép PSW: CY(7)=1, AC(6)=0, F0(5)=0, RS(4-3)=0, OV(2)=1, P(0)=1 -> 85H.",
        "tips": "CY=1, OV=1, P=1 -> PSW = 1000 0101b = 85H. Điền: 85.",
        "exp": "Trước lệnh: $A = 5B\\text{H}$ ($91$), ô nhớ $40\\text{H} = C3\\text{H}$ ($195$), $PSW = 81\\text{H} \\implies CY = 1$. Lệnh `SUBB A, 40H` tính: $A = 5B\\text{H} - C3\\text{H} - CY (1) = 97\\text{H}$. Do số bị trừ nhỏ hơn số trừ nên phép tính bị mượn ($CY = 1$). Ở dạng có dấu: $+91 - (-61) - 1 = +151 > +127$ gây tràn ($OV = 1$). Kết quả $97\\text{H} = 1001\\,0111_2$ có 5 bit 1 (lẻ) nên $P = 1$. Các bit của PSW: bit 7 (CY)=1, bit 2 (OV)=1, bit 0 (P)=1 $\\implies PSW = 1000\\_0101_2 = 85\\text{H}$."
    },
    19: {
        "clo": "CLO2", "level": "TH", "topic": "Trạng thái cờ sau lệnh cộng ADDC", "ans": "A",
        "meth": "A=27H, R1=C5H, CY=0. 27H + C5H = ECH < 100H -> CY=0. Có dấu: (+39) + (-59) = -20 = ECH -> OV=0.",
        "tips": "Casio 580VNX (MENU 3): 27H + C5H = ECH -> Không tràn số dương/âm, không có cờ nhớ -> OV=0, CY=0.",
        "exp": "Thực hiện phép cộng: $A = 27\\text{H} + C5\\text{H} + 0 = EC\\text{H}$. Do tổng nhỏ hơn $100\\text{H}$ nên không sinh ra cờ nhớ ngoài ($CY = 0$). Ở hệ bù 2 có dấu: $27\\text{H} = +39$, $C5\\text{H} = -59$, tổng là $-20 = EC\\text{H}$, nằm hoàn toàn trong phạm vi biểu diễn 8-bit có dấu $[-128, +127]$ nên không xảy ra tràn ($OV = 0$). Vậy $OV=0, CY=0$."
    },
    20: {
        "clo": "CLO3", "level": "VD", "topic": "Lần vết lệnh RLC", "ans": "9A",
        "meth": "52H + 7BH = CDH = 1100_1101b, CY=0. Lệnh RLC A quay trái qua CY: bit 7 (1) vào CY, bit 0 nhận CY cũ (0) -> 1001_1010b = 9AH.",
        "tips": "CDH dịch trái, bit 0 nhận 0 -> 9AH (CY mới = 1). Điền số: 9A.",
        "exp": "Thực hiện lần vết: `ADD A, #7BH` với $A = 52\\text{H}$ cho kết quả $A = 52\\text{H} + 7B\\text{H} = CD\\text{H} = 1100\\,1101_2$ và cờ nhớ $CY = 0$. Sau đó lệnh `RLC A` quay trái thanh ghi A qua cờ nhớ: Bit 7 ($1$) chuyển vào cờ nhớ CY, các bit còn lại dịch sang trái 1 vị trí, và bit 0 nhận giá trị cũ của cờ nhớ CY ($0$). Kết quả cuối cùng là $A = 1001\\,1010_2 = 9A\\text{H}$."
    },
    21: {
        "clo": "CLO3", "level": "TH", "topic": "Lần vết vòng lặp trừ lặp lại", "ans": "A",
        "meth": "A=17, R1=3, CY=1. Vòng lặp SUBB A, #2 lặp 3 lần. Lần 1: A=17-2-1=14. Lần 2: A=14-2-0=12. Lần 3: A=12-2-0=10.",
        "tips": "Lần 1 trừ thêm CY=1 ra 14, hai lần sau mỗi lần trừ 2 ra 12 rồi 10. Đáp án: 10.",
        "exp": "Trước vòng lặp: $A = 17$, $R1 = 3$, $CY = 1$ (do `SETB C`). Vòng lặp `SUBB A, #2` thực thi 3 lần theo lệnh `DJNZ R1, LOOP`: Lần 1 tính $A = 17 - 2 - CY(1) = 14$ (phép trừ không mượn nên $CY = 0$); Lần 2 tính $A = 14 - 2 - 0 = 12$; Lần 3 tính $A = 12 - 2 - 0 = 10$. Thoát khỏi vòng lặp, giá trị trong thanh ghi A là 10."
    },
    22: {
        "clo": "CLO3", "level": "TH", "topic": "Nhận diện chức năng chương trình con tạo trễ", "ans": "A",
        "meth": "R6=2, R1=250. Vòng lặp trong: 250 x 2µs = 500µs. Vòng lặp ngoài x 2 -> ~ 1 - 2ms.",
        "tips": "Tạo trễ thời gian 2ms.",
        "exp": "Chương trình con sử dụng cấu trúc hai vòng lặp lồng nhau tiêu tốn chu kỳ máy để tạo thời gian trễ xấp xỉ $2\\,\\text{ms}$ phục vụ quét phím hoặc điều khiển ngoại vi."
    },
    23: {
        "clo": "CLO3", "level": "VD", "topic": "Hoàn thiện giá trị vào chỗ trống", "ans": "3E",
        "meth": "R1=48 thập phân = 30H -> @R1 là ô nhớ 30H. A=18 thập phân = 12H. Sau XRL A, @R1 muốn A = 2CH -> X = 12H XOR 2CH = 3EH.",
        "tips": "Casio 580VNX (MENU 3): 12H XOR 2CH = 3EH. Điền số: 3E.",
        "exp": "Thanh ghi con trỏ R1 nạp giá trị 48 thập phân ($30\\text{H}$), do đó `@R1` trỏ đến ô nhớ nội $30\\text{H}$. Thanh ghi A ban đầu chứa giá trị 18 thập phân ($12\\text{H} = 0001\\_0010_2$). Sau lệnh `XRL A, @R1`, kết quả mong muốn trong A là $2C\\text{H} = 0010\\_1100_2$. Giá trị cần nạp vào ô nhớ $30\\text{H}$ là: $X = 12\\text{H} \\oplus 2C\\text{H} = 0011\\_1110_2 = 3E\\text{H}$."
    },
    24: {
        "clo": "CLO3", "level": "VD", "topic": "Lệnh so sánh và rẽ nhánh CJNE", "ans": "A",
        "meth": "R1=30H (48 thập phân) != 30 (thập phân) -> CJNE nhảy tới NHAN: MOV A, #54H.",
        "tips": "30H khác 30 thập phân -> Nhảy nhánh NHAN: A = 54H.",
        "exp": "Thanh ghi R1 nạp giá trị $30\\text{H}$ (tương ứng 48 thập phân). Lệnh `CJNE R1, #30, NHAN` so sánh R1 với hằng số thập phân 30 ($1E\\text{H}$). Vì $30\\text{H} \\neq 30$, điều kiện không bằng được thỏa mãn, chương trình rẽ nhánh nhảy đến nhãn `NHAN` và thực thi lệnh `MOV A, #54H`. Do đó nội dung trong thanh ghi A là $54\\text{H}$."
    },
    25: {
        "clo": "CLO3", "level": "VD", "topic": "Nhận diện luồng thực thi", "ans": "A",
        "meth": "P1 = 0CAH = 1100_1010b -> bit P1.2 = 0. JB không nhảy, đi tiếp xuống JNB -> nhảy tới L2.",
        "tips": "Chương trình nhảy tới nhãn L2.",
        "exp": "Với $P1 = 0CA\\text{H} = 1100\\,1010_2$, bit P1.2 bằng 0 nên lệnh `JB P1.2, L1` không thực hiện nhảy. Luồng lệnh chuyển tiếp xuống câu lệnh kế tiếp `JNB AC3, L2` và thực hiện nhảy tới nhãn L2."
    },
    26: {
        "clo": "CLO3", "level": "NB", "topic": "Độ rộng bit của Timer 8051", "ans": "B",
        "meth": "Timer 0 và Timer 1 đều là bộ đếm 16-bit (ghép từ byte cao TH và byte thấp TL).",
        "tips": "Timer 0 và Timer 1 là bộ đếm 16-bit.",
        "exp": "Trên vi điều khiển 89C51, cả hai bộ định thời Timer 0 và Timer 1 đều có cấu trúc phần cứng là các bộ đếm $16\\,\\text{bit}$ đầy đủ, được ghép nối từ 2 thanh ghi chức năng $8\\,\\text{bit}$ là byte cao (TH0/TH1) và byte thấp (TL0/TL1)."
    },
    27: {
        "clo": "CLO3", "level": "NB", "topic": "Chế độ tự động nạp lại của Timer", "ans": "A",
        "meth": "Chế độ 2 (Mode 2) là bộ định thời 8-bit tự nạp lại giá trị đầu từ TH vào TL khi TL tràn.",
        "tips": "Tự động nạp lại (Auto-reload) = Chế độ 2.",
        "exp": "Trong kiến trúc 8051, Chế độ 2 (Mode 2) là chế độ bộ đếm $8\\,\\text{bit}$ tự động nạp lại (Auto-reload): Giá trị ban đầu được lưu cố định trong thanh ghi TH, mỗi khi thanh ghi đếm TL đếm tràn từ $FF\\text{H}$ về $00\\text{H}$, phần cứng tự động sao chép giá trị từ TH vào TL mà không cần phần mềm can thiệp."
    },
    28: {
        "clo": "CLO3", "level": "VD", "topic": "Tính thời gian định thời của Timer 0", "ans": "A",
        "meth": "TMOD = 21H -> Timer 0 ở Chế độ 1 (16-bit định thời). TH0=C5H, TL0=35H -> Nạp C535H = 50485. Số xung = 65536 - 50485 = 15051 xung. Với thạch anh 12MHz (1µs) -> Thời gian định thời xấp xỉ 15ms.",
        "tips": "65536 - C535H = 15051 µs ≈ 15 ms. Chọn đáp án: Thời gian định thời Timer 0 là 15ms.",
        "exp": "Thanh ghi TMOD có giá trị $21\\text{H}$: 4 bit thấp là $0001_2$ cấu hình Timer 0 hoạt động ở Chế độ 1 ($16\\,\\text{bit}$), chức năng định thời lấy xung nội ($C/\\overline{T}=0$). Giá trị $16\\,\\text{bit}$ nạp ban đầu là $C535\\text{H} = 50{,}485$. Số xung đếm trước khi tràn là $N = 65{,}536 - 50{,}485 = 15{,}051$ xung. Với tần số thạch anh $12\\,\\text{MHz}$ ($T_{\\text{ckm}} = 1\\,\\mu\\text{s}$), thời gian định thời của Timer 0 là $15{,}051\\,\\mu\\text{s} \\approx 15\\,\\text{ms}$."
    },
    29: {
        "clo": "CLO3", "level": "VD", "topic": "Tính giá trị nạp cho Timer 1 Chế độ 1", "ans": "A",
        "meth": "Thạch anh 12MHz -> T_ckm = 1µs. Trễ 20ms = 20000µs -> Số xung N = 20000. Giá trị nạp = 65536 - 20000 = 45536 = B2A0H -> TH1 = B2H, TL1 = A0H.",
        "tips": "Casio 580VNX (MENU 3): 65536 - 20000 = 45536 -> HEX: B2A0. TH1 = B2H, TL1 = A0H.",
        "exp": "Với tần số thạch anh $12\\,\\text{MHz}$, chu kỳ máy là $T_{\\text{ckm}} = \\frac{12}{12\\,\\text{MHz}} = 1\\,\\mu\\text{s}$. Khoảng thời gian trễ cần tạo là $20\\,\\text{ms} = 20{,}000\\,\\mu\\text{s}$, tương ứng số xung đếm cần thiết là $N = 20{,}000$ xung. Timer 1 ở Chế độ 1 ($16\\,\\text{bit}$) nên giá trị nạp ban đầu là: $\\text{Val} = 65{,}536 - 20{,}000 = 45{,}536 = B2A0\\text{H}$. Do đó byte cao $\\text{TH1} = B2\\text{H}$ và byte thấp $\\text{TL1} = A0\\text{H}$."
    },
    30: {
        "clo": "CLO3", "level": "VD", "topic": "Chu kỳ sóng vuông tạo bởi Timer", "ans": "A",
        "meth": "TH0=3CH, TL0=B0H -> 3CB0H = 15536. N = 65536 - 15536 = 50000 xung = 50ms. Chu kỳ toàn phần = 2 x 50ms = 100ms.",
        "tips": "Nửa chu kỳ 50ms -> Chu kỳ sóng vuông toàn phần = 100ms.",
        "exp": "Giá trị nạp vào Timer 0 là $3CB0\\text{H} = 15{,}536$. Số xung đếm trước khi cờ tràn TF0 bật lên là $N = 65{,}536 - 15{,}536 = 50{,}000$ xung. Với thạch anh $12\\,\\text{MHz}$ ($T_{\\text{ckm}} = 1\\,\\mu\\text{s}$), thời gian trễ của nửa chu kỳ là $50{,}000\\,\\mu\\text{s} = 50\\,\\text{ms}$. Lệnh `CPL P1.1` đảo mức logic sau mỗi lần trễ, tạo ra dạng sóng vuông có chu kỳ toàn phần $T = 2 \\times 50\\,\\text{ms} = 100\\,\\text{ms}$."
    },
    31: {
        "clo": "CLO3", "level": "NB", "topic": "Bản chất cổng truyền thông nối tiếp", "ans": "A",
        "meth": "Truyền thông nối tiếp (Serial Communication): Truyền tuần tự từng bit một trên một đường truyền đơn.",
        "tips": "Nối tiếp (Serial) = Truyền từng bit một.",
        "exp": "Cổng truyền thông nối tiếp (Serial Port/UART) trên vi điều khiển 89C51 là phương thức truyền dữ liệu tuần tự từng bit một theo chuỗi thời gian trên một dây dẫn duy nhất (chân TxD để phát và RxD để thu), giúp tiết kiệm số lượng đường dây kết nối so với truyền song song."
    },
    32: {
        "clo": "CLO3", "level": "TH", "topic": "Cấu hình SCON cho UART Chế độ 1", "ans": "A",
        "meth": "Chế độ 1 (8-bit UART tốc độ thay đổi): SM0 = 0, SM1 = 1, cho phép nhận REN = 1 -> SCON = 0101_0000b = 50H.",
        "tips": "UART Mode 1 chuẩn (8-bit UART, REN=1) -> SCON = 50H.",
        "exp": "Để cấu hình cổng nối tiếp hoạt động ở Chế độ 1 (chuẩn 8-bit UART có tốc độ Baud thay đổi theo Timer 1) đồng thời kích hoạt bộ thu cho phép nhận dữ liệu (bit $\\text{REN}=1$), ta cần nạp giá trị nhị phân $0101\\_0000_2 = 50\\text{H}$ vào thanh ghi điều khiển cổng nối tiếp SCON."
    },
    33: {
        "clo": "CLO3", "level": "VD", "topic": "Tính giá trị nạp TH1 cho tốc độ 1200 bps", "ans": "A",
        "meth": "Công thức Baud chuẩn: $\\text{Baud} = \\frac{28800}{256 - \\text{TH1}} = 1200 \\implies 256 - \\text{TH1} = \\frac{28800}{1200} = 24 \\implies \\text{TH1} = -24$ (E8H).",
        "tips": "28800 / 1200 = 24 -> TH1 = -24 (E8H).",
        "exp": "Với tần số dao động thạch anh chuẩn $11.0592\\,\\text{MHz}$ và Timer 1 hoạt động ở Chế độ 2 ($SMOD=0$), tốc độ Baud được tính theo công thức: $\\text{Baud} = \\frac{28800}{256 - \\text{TH1}}$. Để có tốc độ truyền $1200\\,\\text{bps}$, số xung đếm là $256 - \\text{TH1} = \\frac{28800}{1200} = 24$, suy ra giá trị nạp vào thanh ghi TH1 là $-24$ (tương ứng giá trị Hex $E8\\text{H}$)."
    },
    34: {
        "clo": "CLO3", "level": "TH", "topic": "Nhận diện chương trình truyền UART", "ans": "A",
        "meth": "TH1 = -6 -> 4800 baud. Ghi SBUF = 'A' trong vòng lặp HERE -> Truyền ký tự A liên tục.",
        "tips": "TH1 = -6 -> 4800 baud, truyền ký tự 'A' liên tục.",
        "exp": "Chương trình cấu hình Timer 1 Chế độ 2 với giá trị nạp $\\text{TH1} = -6$ tạo ra tốc độ Baud chuẩn $4800\\,\\text{bps}$ (với thạch anh $11.0592\\,\\text{MHz}$), sau đó nạp mã ký tự 'A' vào thanh ghi đệm SBUF và lặp lại liên tục trong vòng lặp vô hạn, thực hiện chức năng truyền ký tự 'A' với tốc độ 4800 baud liên tục."
    },
    35: {
        "clo": "CLO3", "level": "NB", "topic": "Chân kích hoạt ngắt ngoài 0", "ans": "A",
        "meth": "Ngắt ngoài 0 (External Interrupt 0) được cấp tín hiệu kích hoạt qua chân INT0 (chân 12, P3.2).",
        "tips": "Ngắt ngoài 0 -> Chân INT0 (P3.2).",
        "exp": "Chân ngắt ngoài 0 (INT0) là chân chức năng thứ hai của cổng P3.2 (chân số 12 trên vỏ chip 89C51), được sử dụng để nhận tín hiệu kích hoạt ngắt từ bên ngoài (theo mức thấp hoặc theo sườn âm)."
    },
    36: {
        "clo": "CLO3", "level": "NB", "topic": "Địa chỉ Vector ngắt ngoài 1 (INT1)", "ans": "A",
        "meth": "Bảng Vector ngắt: Reset (0000H), INT0 (0003H), Timer 0 (000BH), INT1 (0013H), Timer 1 (001BH).",
        "tips": "INT1 -> Địa chỉ vector 0013H.",
        "exp": "Trong bảng vector phục vụ ngắt của họ vi điều khiển 8051, ngắt ngoại vi 1 (INT1) có địa chỉ vector cố định bắt đầu tại địa chỉ $0013\\text{H}$ trong bộ nhớ chương trình."
    },
    37: {
        "clo": "CLO3", "level": "TH", "topic": "Cấu hình thanh ghi cho phép ngắt IE", "ans": "D",
        "meth": "Thanh ghi IE: Bit 7 (EA - Enable All) = 80H, bit 1 (ET0) = 02H. Lệnh MOV IE, #82H cho phép toàn bộ ngắt và cho phép ngắt Timer 0.",
        "tips": "EA (80H) + ET0 (02H) = 82H -> MOV IE, #82H.",
        "exp": "Các lệnh cấu hình ngắt tương đương với việc gán trực tiếp giá trị vào thanh ghi IE: Lệnh `MOV IE, #82H` đặt bit 7 (EA = 1, cho phép ngắt toàn cục) và bit 1 (ET0 = 1, cho phép ngắt Timer 0)."
    },
    38: {
        "clo": "CLO3", "level": "VD", "topic": "Chương trình phục vụ ngắt Timer 0", "ans": "C",
        "meth": "Vector 000BH là Timer 0 ISR. Nạp FE0CH tạo nửa chu kỳ 500µs -> Chu kỳ toàn phần T = 1ms tại chân P1.0.",
        "tips": "Timer 0 ISR + trễ 500µs -> Chu kỳ sóng 1ms tại P1.0.",
        "exp": "Địa chỉ vector $000B\\text{H}$ là chương trình phục vụ ngắt của Timer 0. Khi Timer 0 tràn sau mỗi $500\\,\\mu\\text{s}$, chương trình ngắt thực thi lệnh `CPL P1.0` để đảo trạng thái mức logic của chân P1.0, tạo ra sóng vuông tuần hoàn có chu kỳ toàn phần $T = 2 \\times 500\\,\\mu\\text{s} = 1\\,\\text{ms}$."
    },
    39: {
        "clo": "CLO3", "level": "TH", "topic": "Chương trình phục vụ ngắt ngoài 1", "ans": "A",
        "meth": "Vector 0013H là ngắt ngoài 1 (INT1). Điều khiển chân P1.3.",
        "tips": "Vector 0013H -> Ngắt ngoài 1; điều khiển LED tại chân P1.3.",
        "exp": "Chương trình đặt ISR tại địa chỉ $0013\\text{H}$ tương ứng với ngắt ngoài 1 (INT1). Mỗi khi có sự kiện kích hoạt ngắt tại chân INT1, chương trình con sẽ bật và tắt đèn LED nối tại chân P1.3 sau một khoảng thời gian trễ của vòng lặp DJNZ."
    },
    40: {
        "clo": "CLO3", "level": "TH", "topic": "Ngắt nhận UART điều khiển chân cổng P2.0", "ans": "A",
        "meth": "Vector 0023H là UART ISR. Nhận dữ liệu từ SBUF khi RI=1, so sánh ký tự '1' bật P2.0, ký tự '0' xóa P2.0.",
        "tips": "Nhận ký tự qua UART và điều khiển xuất ra cổng P2.0.",
        "exp": "Chương trình sử dụng ngắt truyền thông nối tiếp (vector $0023\\text{H}$): Khi nhận được một ký tự truyền vào cổng nối tiếp (cờ RI bật lên 1), CPU đọc mã ký tự từ thanh ghi đệm SBUF vào A, nếu là ký tự '1' thì bật chân P2.0 lên 1, nếu là ký tự '0' thì xóa P2.0 về 0."
    }
}

from scripts.solvers.docx_data_03_04_05 import DE_003_DATA, DE_004_DATA, DE_005_DATA
from scripts.solvers.latex_helper import latexify_text

ALL_DOCX_DATA = {
    'DE_001': DE_001_DATA,
    'DE_002': DE_002_DATA,
    'DE_003': DE_003_DATA,
    'DE_004': DE_004_DATA,
    'DE_005': DE_005_DATA,
}

def solve_docx_question(q):
    exam_id = q.get('exam_id')
    num = q.get('num')
    
    exam_dict = ALL_DOCX_DATA.get(exam_id)
    if not exam_dict:
        raise ValueError(f"Unknown exam ID: {exam_id}")
        
    data = exam_dict.get(num)
    if not data:
        raise ValueError(f"Missing data for {exam_id} Question {num}")
        
    opts = q.get('options', [])
    ans = data['ans']
    
    if not opts or data.get('type') == 'fib' or not (len(ans) == 1 and ans in "ABCD"):
        q_type = 'fib'
        ans_clean = str(ans).strip().upper().rstrip('H')
        acceptable = [ans_clean, f"{ans_clean}H", ans_clean.lower(), f"{ans_clean.lower()}h"]
        if ans_clean in ['8', '16', '2']:
            acceptable.extend([f"{ans_clean}KB", f"{ans_clean} KB", f"{ans_clean}kb", f"{ans_clean} kb"])
    else:
        q_type = 'mcq'
        acceptable = [ans]
        
    prompt = data.get('custom_prompt', q.get('prompt'))
    exp = latexify_text(data.get('exp', ''))
    meth = latexify_text(data.get('meth', ''))
    tips = latexify_text(data.get('tips', ''))
    
    return {
        'id': q['id'],
        'source': q.get('source', exam_id),
        'exam_id': exam_id,
        'exam_title': q.get('exam_title', f"Đề Thi Vi Xử Lý {exam_id}"),
        'num': num,
        'title': f"{exam_id} - Câu {num}",
        'prompt': prompt,
        'extra_lines': q.get('extra_lines', []),
        'options': opts,
        'type': q_type,
        'answer': ans,
        'acceptable_answers': acceptable,
        'explanation': exp,
        'methodology': meth,
        'tips_casio': tips,
        'clo': data.get('clo', 'CLO1'),
        'level': data.get('level', 'NB'),
        'topic_name': data.get('topic', 'Kỹ thuật Vi xử lý'),
        'images': q.get('images', [])
    }

