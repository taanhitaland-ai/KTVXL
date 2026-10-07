# ==============================================================================
# DOCX EXAM DATA FOR DE_003, DE_004, AND DE_005 (120 QUESTIONS TOTAL)
# 100% Individual Mapping based on Official KMA Questions & Schematics
# ==============================================================================

DE_003_DATA = {
    1: {
        "clo": "CLO1", "level": "NB", "topic": "Khái niệm bộ vi xử lý", "ans": "A",
        "meth": "Định nghĩa vi xử lý: Một vi mạch số hoạt động hoàn toàn theo chương trình.",
        "tips": "Vi xử lý là một vi mạch số hoạt động theo chương trình.",
        "exp": "Bộ vi xử lý (Microprocessor) là một vi mạch tích hợp cỡ lớn (LSI/VLSI) hoạt động hoàn toàn theo chương trình nạp sẵn, thực hiện các chức năng tìm nạp lệnh, giải mã lệnh và điều khiển thực thi toàn bộ hệ thống máy tính."
    },
    2: {
        "clo": "CLO1", "level": "NB", "topic": "Bus địa chỉ hệ thống", "ans": "A",
        "meth": "Bus địa chỉ là bus một chiều: tín hiệu địa chỉ luôn đi từ CPU đến bộ nhớ và các thiết bị ngoại vi.",
        "tips": "Bus địa chỉ: Đi từ CPU đến bộ nhớ và thiết bị ngoại vi.",
        "exp": "Trong cấu trúc hệ thống máy tính, bus địa chỉ (Address Bus) là bus một chiều xuất phát từ CPU truyền đến các khối bộ nhớ và thiết bị ngoại vi để xác định vị trí ô nhớ hoặc cổng I/O cần trao đổi dữ liệu."
    },
    3: {
        "clo": "CLO1", "level": "NB", "topic": "Khối EU và chức năng giải mã lệnh", "ans": "A",
        "meth": "Khối EU (Execution Unit - Đơn vị thực thi) chứa bộ giải mã lệnh (Instruction Decoder) để giải mã mã máy.",
        "tips": "Giải mã lệnh -> Khối EU (Execution Unit).",
        "exp": "Trong kiến trúc bộ vi xử lý, khối EU (Execution Unit - Đơn vị thực thi) đảm nhiệm vai trò giải mã các mã máy lấy từ hàng đợi lệnh và phát ra các xung điều khiển vi lệnh cho ALU cùng các thanh ghi để thực thi lệnh."
    },
    4: {
        "clo": "CLO1", "level": "NB", "topic": "Lưu trữ chương trình ứng dụng vi điều khiển", "ans": "A",
        "meth": "Chương trình ứng dụng của vi điều khiển là dữ liệu cố định không mất khi mất điện, luôn được lưu trữ trong ROM.",
        "tips": "Chương trình ứng dụng -> Luôn lưu trong ROM (Flash ROM).",
        "exp": "Chương trình ứng dụng (firmware) điều khiển hoạt động của vi điều khiển cần được lưu giữ vĩnh viễn ngay cả khi ngắt nguồn cấp, do đó luôn được nạp và lưu trữ tại bộ nhớ chỉ đọc ROM (hoặc bộ nhớ Flash ROM nội trên chip)."
    },
    5: {
        "clo": "CLO1", "level": "NB", "topic": "Cấu tạo phần cứng vi điều khiển 89C51", "ans": "A",
        "meth": "Thông số chuẩn 89C51: 128 byte RAM nội, 4KB Flash ROM nội, 2 Timer 16-bit, 1 cổng nối tiếp UART, và 4 cổng I/O 8-bit.",
        "tips": "128 byte RAM, 4K byte ROM, 2 Timer, 1 UART, 4 cổng 8-bit.",
        "exp": "Vi điều khiển tiêu chuẩn 89C51 tích hợp sẵn bên trong: $128\\,\\text{Byte}$ RAM dữ liệu, $4\\,\\text{KB}$ Flash ROM chương trình, hai bộ đếm/định thời $16\\,\\text{bit}$ (Timer 0 và Timer 1), một cổng truyền thông nối tiếp UART và 4 cổng song song $8\\,\\text{bit}$ vào ra (P0, P1, P2, P3)."
    },
    6: {
        "clo": "CLO1", "level": "TH", "topic": "Dung lượng mở rộng ROM khi EA=1", "ans": "A",
        "meth": "Khi $\\overline{\\text{EA}} = 1$, CPU chạy $4\\,\\text{KB}$ ROM nội trước. Tổng không gian là $64\\,\\text{KB} \\implies$ mở rộng ngoài tối đa $64\\,\\text{KB} - 4\\,\\text{KB} = 60\\,\\text{KB}$.",
        "tips": "EA = 1: ROM ngoại tối đa = 64KB - 4KB nội = 60KB.",
        "exp": "Khi chân tín hiệu $\\overline{\\text{EA}} = 1$ (+5V), vi điều khiển 89C51 sẽ thực thi chương trình trong $4\\,\\text{KB}$ ROM nội ($0000\\text{H} - 0\\text{FFFH}$). Khi địa chỉ vượt quá $4\\,\\text{KB}$ ($1000\\text{H} - \\text{FFFFH}$), CPU tự động chuyển sang đọc ROM ngoại, tương ứng không gian mở rộng bên ngoài là $64\\,\\text{KB} - 4\\,\\text{KB} = 60\\,\\text{KB}$."
    },
    7: {
        "clo": "CLO2", "level": "TH", "topic": "Định địa chỉ bit trong các thanh ghi SFR", "ans": "A",
        "meth": "Thanh ghi có địa chỉ tận cùng $0\\text{H}$ hoặc $8\\text{H}$ định địa chỉ bit được: P0(80H), P1(90H), P2(A0H), P3(B0H), IP(B8H), TCON(88H).",
        "tips": "P0~P3, IP, TCON đều chia hết cho 8 -> Định địa chỉ bit được.",
        "exp": "Các thanh ghi chức năng đặc biệt SFR có thể định địa chỉ theo từng bit khi và chỉ khi địa chỉ của chúng chia hết cho 8 (kết thúc bằng $0\\text{H}$ hoặc $8\\text{H}$). Nhóm P0~P3, IP, TCON đều thỏa mãn điều kiện này."
    },
    8: {
        "clo": "CLO2", "level": "NB", "topic": "Cờ báo tràn thanh ghi A trong PSW", "ans": "A",
        "meth": "Cờ tràn OV (Overflow Flag, bit PSW.2) báo tràn số học khi thực hiện phép toán số bù hai có dấu trên thanh ghi A.",
        "tips": "Cờ tràn của thanh ghi A -> Cờ OV (Overflow).",
        "exp": "Trên vi điều khiển 89C51, cờ báo tràn OV (Overflow Flag, nằm tại bit 2 của thanh ghi PSW) được CPU tự động bật lên 1 khi kết quả phép toán số học có dấu vượt ra ngoài phạm vi biểu diễn của số nguyên có dấu $8\\,\\text{bit}$ ($-128$ đến $+127$)."
    },
    9: {
        "clo": "CLO2", "level": "TH", "topic": "Dung lượng bộ nhớ ROM mở rộng trên sơ đồ", "ans": "2",
        "meth": "Đếm số đường địa chỉ nối vào chip ROM U3: có 11 đường địa chỉ ($A_0 - A_{10}$) $\\implies 2^{11} = 2048\\,\\text{Byte} = 2\\,\\text{KB}$.",
        "tips": "Casio 580VNX: 2^11 Byte = 2 KB. Điền số: 2.",
        "exp": "Trên sơ đồ mạch mở rộng, chip nhớ ROM U3 kết nối với 11 đường địa chỉ ($A_0 - A_{10}$), tương ứng dung lượng bộ nhớ ROM mở rộng là $2^{11}\\,\\text{Byte} = 2048\\,\\text{Byte} = 2\\,\\text{KB}$."
    },
    10: {
        "clo": "CLO2", "level": "VD", "topic": "Dải địa chỉ của bộ nhớ RAM mở rộng U5", "ans": "A",
        "meth": "U5 có 13 đường địa chỉ $A_0 - A_{12}$ (dung lượng 8KB = 2000H). Các bit cao $A_{15}A_{14}A_{13} = 111_2 \\implies \\text{E}000\\text{H} - \\text{FFFFH}$.",
        "tips": "Dung lượng 8KB (2000H) -> Dải địa chỉ E000H - FFFFH.",
        "exp": "Chip nhớ RAM U5 có 13 đường địa chỉ ($A_0 - A_{12}$), tương ứng dung lượng là $2^{13}\\,\\text{Byte} = 8\\,\\text{KB}$ ($2000\\text{H}$). Dải địa chỉ tương ứng của U5 khi giải mã mức cao là $\\text{E}000\\text{H} - \\text{FFFFH}$."
    },
    11: {
        "clo": "CLO2", "level": "NB", "topic": "Cấu trúc bộ nhớ RAM nội 89C51", "ans": "D",
        "meth": "RAM nội gồm: 4 băng thanh ghi (00H-1FH), RAM định địa chỉ bit (20H-2FH), và RAM đa chức năng (30H-7FH).",
        "tips": "Cả ba đáp án A, B, C đều đúng.",
        "exp": "Bộ nhớ RAM nội $128\\,\\text{Byte}$ của 89C51 được chia thành 3 phân vùng: 4 băng thanh ghi R0-R7 (địa chỉ $00\\text{H} - 1\\text{FH}$), vùng RAM định địa chỉ từng bit ($20\\text{H} - 2\\text{FH}$) và vùng RAM đa chức năng / ngăn xếp Stack ($30\\text{H} - 7\\text{FH}$). Cả 3 đáp án đều đúng."
    },
    12: {
        "clo": "CLO2", "level": "VD", "topic": "Tính địa chỉ cao nhất của chip nhớ IC1", "ans": "DFFF",
        "custom_prompt": "Cho sơ đồ mở rộng bộ nhớ chương trình ROM và bộ nhớ dữ liệu RAM của vi điều khiển 89C51 như hình vẽ dưới đây: Nếu P2.7=1 thì địa chỉ cao nhất của IC1 là____H?",
        "meth": "IC1 có 13 đường địa chỉ $A_0 - A_{12}$, kích hoạt khi P2.5=0. Khi P2.7=1, P2.6=1, P2.5=0 $\\implies A_{15}..A_{13} = 110_2$. Toàn bộ 13 bit nội bằng 1 $\\implies 1101\\,1111\\,1111\\,1111_2 = \\text{DFFFH}$.",
        "tips": "Ghép bit: 1101 1111 1111 1111 -> DFFFH. Điền: DFFF.",
        "exp": "Chip IC1 có 13 đường địa chỉ nội ($A_0 - A_{12}$). Điều kiện chọn chip là $\\text{P2.5}=0$. Với $\\text{P2.7}=1, \\text{P2.6}=1$, 3 bit cao của địa chỉ cố định là $A_{15}A_{14}A_{13} = 110_2$. Địa chỉ cao nhất đạt được khi 13 bit địa chỉ nội đều đạt mức 1: $1101\\,1111\\,1111\\,1111_2 = \\text{DFFFH}$."
    },
    13: {
        "clo": "CLO2", "level": "NB", "topic": "Chế độ định địa chỉ thanh ghi", "ans": "A",
        "meth": "Trong lệnh `MOV R0, A`, toán hạng nguồn là thanh ghi A -> Chế độ định địa chỉ thanh ghi.",
        "tips": "Nguồn là thanh ghi A -> Định địa chỉ thanh ghi.",
        "exp": "Trong câu lệnh `MOV R0, A`, toán hạng nguồn là thanh ghi tích lũy A, dữ liệu được lấy trực tiếp từ thanh ghi của CPU, do đó chế độ định địa chỉ của toán hạng nguồn là Chế độ định địa chỉ thanh ghi (Register Addressing)."
    },
    14: {
        "clo": "CLO2", "level": "NB", "topic": "Thanh ghi con trỏ địa chỉ gián tiếp RAM nội", "ans": "A",
        "meth": "Chỉ có hai thanh ghi R0 và R1 được phép sử dụng làm con trỏ địa chỉ gián tiếp cho RAM nội (@R0, @R1).",
        "tips": "Chỉ có R0 và R1 được dùng làm con trỏ @.",
        "exp": "Trong tập lệnh vi điều khiển 8051, chỉ có hai thanh ghi R0 và R1 thuộc băng thanh ghi hiện hành mới có thể đóng vai trò làm thanh ghi con trỏ định địa chỉ gián tiếp (sử dụng toán hạng `@R0` hoặc `@R1`) để truy xuất không gian bộ nhớ RAM nội."
    },
    15: {
        "clo": "CLO2", "level": "NB", "topic": "Phân loại lệnh - Lệnh nhân MUL", "ans": "A",
        "meth": "Lệnh `MUL AB` thực hiện phép nhân số học giữa hai thanh ghi A và B -> Lệnh số học.",
        "tips": "MUL = Multiply (phép nhân) -> Lệnh số học.",
        "exp": "Lệnh `MUL AB` thực hiện phép nhân số nguyên không dấu $8\\,\\text{bit}$ giữa nội dung thanh ghi A và thanh ghi B, kết quả $16\\,\\text{bit}$ được lưu trong cặp thanh ghi BA, do đó thuộc nhóm Lệnh số học (Arithmetic Instructions)."
    },
    16: {
        "clo": "CLO2", "level": "NB", "topic": "Cú pháp hợp ngữ 8051 - Lệnh sai", "ans": "A",
        "meth": "`MOV A, ACC` là lệnh sai vì A và ACC là cùng một thanh ghi tích lũy, không có mã thao tác chuyển dữ liệu giữa thanh ghi với chính nó.",
        "tips": "MOV A, ACC là lệnh sai cú pháp.",
        "exp": "Trong tập lệnh 8051, `A` và `ACC` cùng chỉ thanh ghi tích lũy. Tập lệnh không hỗ trợ cú pháp `MOV A, ACC` vì gây xung đột định danh thanh ghi, do đó lệnh này là lệnh SAI cú pháp."
    },
    17: {
        "clo": "CLO2", "level": "NB", "topic": "Lệnh rẽ nhánh có điều kiện DJNZ", "ans": "A",
        "meth": "Cú pháp `DJNZ R0, rel`: giảm thanh ghi R0 đi 1 đơn vị, nếu khác 0 thì nhảy tới rel.",
        "tips": "DJNZ R0, rel: Giảm R0 và nhảy nếu khác 0.",
        "exp": "Lệnh `DJNZ R0, rel` (Decrement and Jump if Not Zero) có chức năng tự động giảm nội dung thanh ghi R0 đi 1 đơn vị, sau đó kiểm tra nếu nội dung R0 khác 0 thì thực hiện bước nhảy tương đối đến nhãn địa chỉ `rel`."
    },
    18: {
        "clo": "CLO2", "level": "VD", "topic": "Phép toán trừ SUBB và giá trị thanh ghi PSW", "ans": "41",
        "meth": "$A - 30\\text{H} - \\text{CY} = 94\\text{H} - 8\\text{D}\\text{H} - 0 = 07\\text{H}$. Nibble thấp $4 < \\text{D} \\implies \\text{AC} = 1$. Số có dấu $(-108) - (-115) = +7 \\implies \\text{OV} = 0$. $\\text{CY} = 0$. $07\\text{H} = 0000\\,0111_2$ có 3 bit 1 $\\implies \\text{P} = 1$. $\\text{PSW} = 0100\\,0001_2 = 41\\text{H}$.",
        "tips": "Casio 580VNX: 94H - 8DH = 07H. Cờ AC=1, OV=0, CY=0, P=1 -> PSW = 41H. Điền: 41.",
        "exp": "Thực hiện phép trừ `SUBB A, 30H`: $94\\text{H} - 8\\text{D}\\text{H} = 07\\text{H}$. Do chữ số Hex thấp $4 < \\text{D}$ nên có mượn ở nibble thấp $\\implies \\text{AC} = 1$; số trừ có dấu không tràn $\\implies \\text{OV} = 0$; số bị trừ lớn hơn số trừ nên không mượn byte cao $\\implies \\text{CY} = 0$; kết quả $07\\text{H}$ chứa 3 bit 1 nên cờ chẵn lẻ $\\text{P} = 1$. Ghép các bit trong thanh ghi $\\text{PSW} = \\text{CY}(0)\\,\\text{AC}(1)\\,\\text{F0}(0)\\,\\text{RS1}(0)\\,\\text{RS0}(0)\\,\\text{OV}(0)\\,\\text{UD}(0)\\,\\text{P}(1) = 0100\\,0001_2 = 41\\text{H}$."
    },
    19: {
        "clo": "CLO2", "level": "VD", "topic": "Phép cộng ADD và xác định trạng thái cờ AC, OV", "ans": "A",
        "meth": "$8\\text{B}\\text{H} + \\text{B}4\\text{H} = 13\\text{F}\\text{H}$. Nibble thấp $\\text{B} + 4 = 15 = \\text{F} \\implies \\text{AC} = 0$. Số có dấu $(-117) + (-76) = -193 < -128 \\implies \\text{OV} = 1$.",
        "tips": "AC = 0, OV = 1.",
        "exp": "Thực hiện phép cộng $A + R0 = 8\\text{B}\\text{H} + \\text{B}4\\text{H} = 13\\text{F}\\text{H}$: Ở 4 bit thấp, $\\text{B} + 4 = 15$ không có nhớ sang bit 4, do đó cờ nhớ phụ $\\text{AC} = 0$. Đối với số bù hai có dấu, cộng hai số âm ra kết quả vượt ngưỡng $-128$ gây tràn dấu, do đó cờ tràn $\\text{OV} = 1$. Kết quả: $\\text{AC} = 0, \\text{OV} = 1$."
    },
    20: {
        "clo": "CLO2", "level": "VD", "topic": "Nội dung ô nhớ RAM nội sau các thao tác logic", "ans": "55",
        "meth": "Đoạn mã nạp $7\\text{EH} = 55\\text{H}$ và $7\\text{FH} = 4\\text{FH}$. Các lệnh sau chỉ ghi vào A và R0, hoàn toàn không có lệnh ghi đè ô nhớ 7EH $\\implies$ 7EH vẫn là 55H.",
        "tips": "Ô nhớ 7EH không bị lệnh nào ghi đè -> Giữ nguyên 55H. Điền: 55.",
        "exp": "Đoạn chương trình khởi tạo ô nhớ $7\\text{EH}$ có giá trị $55\\text{H}$. Các lệnh tiếp theo (`INC R0`, `MOV A, 7EH`, `ORL A, @R0`, `MOV R0, A`, `ORL A, 7EH`) chỉ thực hiện thao tác tính toán và ghi dữ liệu vào thanh ghi A và thanh ghi R0, không có lệnh nào ghi lại vào ô nhớ $7\\text{EH}$. Do đó nội dung của ô nhớ $7\\text{EH}$ vẫn giữ nguyên giá trị ban đầu là $55\\text{H}$."
    },
    21: {
        "clo": "CLO2", "level": "VD", "topic": "Vòng lặp trừ có mượn SUBB với cờ Carry", "ans": "A",
        "meth": "Khởi tạo $A = 17$, $C = 1$. Vòng lặp 3 lần `SUBB A, #2`: Lần 1: $17 - 2 - 1 = 14$ ($C=0$); Lần 2: $14 - 2 - 0 = 12$; Lần 3: $12 - 2 - 0 = 10$.",
        "tips": "17 - 2 - 1 = 14 -> 12 -> 10. Đáp án: 10.",
        "exp": "Ban đầu thanh ghi A có giá trị 17 và cờ nhớ $C = 1$. Vòng lặp thực hiện 3 lần: Ở lần 1, lệnh `SUBB A, #2` trừ cả cờ nhớ: $17 - 2 - 1 = 14$, cờ Carry xóa về 0; Ở lần 2: $14 - 2 - 0 = 12$; Ở lần 3: $12 - 2 - 0 = 10$. Kết thúc vòng lặp DJNZ, nội dung trong thanh ghi A là 10."
    },
    22: {
        "clo": "CLO3", "level": "VD", "topic": "Timer tạo xung vuông tuần hoàn 25Hz", "ans": "A",
        "meth": "$f_{\\text{osc}} = 6\\,\\text{MHz}$ ($T_{\\text{cm}} = 2\\,\\mu\\text{s}$). Nạp $\\text{B1E0H} = 45{,}536 \\implies$ đếm 20,000 xung $= 40{,}000\\,\\mu\\text{s} = 40\\,\\text{ms}$ nửa chu kỳ $\\implies T = 80\\,\\text{ms}$ (hoặc tần số 25Hz).",
        "tips": "Tạo xung vuông có tần số 25Hz xuất từ cổng P1.5.",
        "exp": "Với thạch anh $6\\,\\text{MHz}$ (chu kỳ máy $T_{\\text{cm}} = 2\\,\\mu\\text{s}$), Timer 1 hoạt động ở Chế độ 1 nạp giá trị $\\text{B1E0H}$. Số xung đếm nửa chu kỳ trễ kết hợp lệnh đảo `CPL P1.5` tạo ra dạng sóng vuông tuần hoàn có tần số $25\\,\\text{Hz}$ xuất ra tại chân P1.5."
    },
    23: {
        "clo": "CLO2", "level": "TH", "topic": "Thiết lập các bit cổng P3 bằng lệnh ORL", "ans": "98",
        "meth": "Bật bit 3, 4, 7 lên 1: $2^3 + 2^4 + 2^7 = 8 + 16 + 128 = 152$ thập phân $= 98\\text{H}$. Lệnh là `ORL P3, #98H`.",
        "tips": "Casio 580VNX: 80H + 10H + 08H = 98H. Điền: 98.",
        "exp": "Để bật các bit thứ 3, 4, và 7 của cổng lên 1 và giữ nguyên trạng thái các bit khác, ta thực hiện phép toán logic OR với mặt nạ nhị phân có các bit 1 tại vị trí tương ứng: $1001\\,1000_2 = 98\\text{H}$."
    },
    24: {
        "clo": "CLO2", "level": "VD", "topic": "So sánh CJNE bằng nhau không rẽ nhánh", "ans": "A",
        "meth": "$3\\text{B}\\text{H} + \\text{B}3\\text{H} = \\text{EEH}$. So sánh `CJNE A, #EEH, NHAN` thấy bằng nhau nên KHÔNG nhảy. Thực hiện `MOV 30H, #23` ($23 = 17\\text{H}$).",
        "tips": "A = EEH -> Không nhảy -> 30H nhận 23 thập phân = 17H. Đáp án: 17H.",
        "exp": "Lệnh `ADD A, R0` cho kết quả $3\\text{B}\\text{H} + \\text{B}3\\text{H} = \\text{EEH}$. Lệnh tiếp theo `CJNE A, #EEH, NHAN` so sánh hai giá trị bằng nhau nên không thực hiện bước nhảy sang nhãn `NHAN`, CPU tiếp tục thực hiện lệnh tuần tự `MOV 30H, #23`. Giá trị hằng số 23 thập phân đổi sang hệ Hex là $17\\text{H}$, do đó nội dung ô nhớ $30\\text{H}$ là $17\\text{H}$."
    },
    25: {
        "clo": "CLO2", "level": "TH", "topic": "Thuật toán đảo số nhị phân 16-bit", "ans": "A",
        "meth": "Đọc dữ liệu từ R1, R0, thực hiện đảo bit `CPL A` và cộng nhớ tạo số bù hai 16-bit lưu tại R3, R2.",
        "tips": "Tính đảo các số nhị phân 16 bit đặt tại R1, R0 và lưu tại R3, R2.",
        "exp": "Đoạn chương trình đọc các byte dữ liệu $16\\,\\text{bit}$ lưu tại cặp thanh ghi R1 (byte cao) và R0 (byte thấp), sau đó thực hiện lệnh đảo bit `CPL A` và hiệu chỉnh cộng số bù, thực hiện chức năng: Tính đảo các số nhị phân $16\\,\\text{bit}$ đặt tại R1, R0 và lưu kết quả vào cặp thanh ghi R3, R2."
    },
    26: {
        "clo": "CLO3", "level": "NB", "topic": "Chức năng cờ tràn TF0 trong thanh ghi TCON", "ans": "A",
        "meth": "TF0 (Timer 0 Overflow Flag) là cờ báo tràn của bộ đếm định thời Timer 0.",
        "tips": "TF0 = Cờ tràn của Timer 0.",
        "exp": "Bit TF0 (Timer 0 Overflow Flag, nằm tại bit 5 của thanh ghi TCON) là cờ báo tràn của Timer 0, được phần cứng tự động bật lên 1 khi Timer 0 đếm tràn từ giá trị cực đại về 0."
    },
    27: {
        "clo": "CLO3", "level": "TH", "topic": "Kỹ thuật định thời ngắn với Timer Chế độ 2", "ans": "A",
        "meth": "Khoảng định thời $10 - 256\\,\\mu\\text{s}$ phù hợp nhất với bộ đếm 8-bit tự động nạp lại (Timer Chế độ 2).",
        "tips": "Định thời ngắn <= 256µs -> Dùng Timer 8 bit tự động nạp lại (Chế độ 2).",
        "exp": "Khi lập trình định thời các khoảng thời gian ngắn từ $10 - 256\\,\\mu\\text{s}$ (với thạch anh $12\\,\\text{MHz}$), giải pháp tối ưu là sử dụng Timer ở Chế độ 2 ($8\\,\\text{bit}$ tự động nạp lại giá trị đầu) vì không bị trễ thời gian nạp lại bằng phần mềm."
    },
    28: {
        "clo": "CLO3", "level": "VD", "topic": "Giá trị khởi tạo Timer Chế độ 0 (13-bit)", "ans": "A",
        "meth": "Chế độ 0 dùng 13-bit: 5 bit thấp của TL0 ($18\\text{H} = 24$) và 8 bit của TH0 ($63\\text{H} = 99$). $X = (99 \\times 32) + 24 = 3168 + 24 = 3192$.",
        "tips": "Casio 580VNX: 99 x 32 + 24 = 3192. Đáp án: X = 3192.",
        "exp": "Bộ định thời ở Chế độ 0 sử dụng bộ đếm $13\\,\\text{bit}$ ghép từ 5 bit thấp của TL0 ($18\\text{H} = 0001\\,1000_2 \\implies 24$) và 8 bit của TH0 ($63\\text{H} = 99$). Giá trị nạp ban đầu là $X = (\\text{TH0} \\times 32) + (\\text{TL0} \\ \\& \\ 1\\text{FH}) = (99 \\times 32) + 24 = 3168 + 24 = 3192$."
    },
    29: {
        "clo": "CLO3", "level": "VD", "topic": "Giá trị nạp TH1 cho Timer 1 Chế độ 2", "ans": "A",
        "meth": "Timer 1 ở Chế độ 2 tự nạp lại. Giá trị nạp vào thanh ghi TH1 là $12\\text{H}$.",
        "tips": "TH1 = 12H.",
        "exp": "Giá trị nạp vào thanh ghi TH1 của bộ định thời Timer 1 khi hoạt động ở Chế độ 2 theo bài toán chuẩn là $\\text{TH1} = 12\\text{H}$."
    },
    30: {
        "clo": "CLO3", "level": "VD", "topic": "Timer 0 Mode 2 tạo sóng vuông chu kỳ 100µs", "ans": "A",
        "meth": "Nạp $\\text{TH0} = \\text{CEH} = 206$. Số xung đếm nửa chu kỳ là $256 - 206 = 50$ xung $= 50\\,\\mu\\text{s}$. Toàn chu kỳ $T = 2 \\times 50\\,\\mu\\text{s} = 100\\,\\mu\\text{s}$.",
        "tips": "256 - 206 = 50µs nửa chu kỳ -> Cả chu kỳ = 100µs.",
        "exp": "Với thạch anh $12\\,\\text{MHz}$ ($1\\,\\mu\\text{s}$/chu kỳ máy), Timer 0 ở Chế độ 2 nạp $\\text{TH0} = \\text{CEH} = 206$ đếm $256 - 206 = 50$ xung, tạo khoảng trễ nửa chu kỳ là $50\\,\\mu\\text{s}$. Lệnh `CPL P1.0` tạo ra dạng sóng vuông tuần hoàn có chu kỳ toàn phần $T = 2 \\times 50\\,\\mu\\text{s} = 100\\,\\mu\\text{s}$ trên chân P1.0."
    },
    31: {
        "clo": "CLO3", "level": "NB", "topic": "Cấu trúc khung truyền Chế độ 1 cổng nối tiếp", "ans": "A",
        "meth": "Chế độ 1 của cổng nối tiếp 89C51 truyền 8 bit dữ liệu và 1 bit Stop.",
        "tips": "8 bit dữ liệu và 1 bit stop.",
        "exp": "Trong Chế độ 1 của cổng nối tiếp họ 8051, định dạng khung truyền gồm 10 bit: 1 bit Start, 8 bit dữ liệu (Data bits) và 1 bit Stop."
    },
    32: {
        "clo": "CLO3", "level": "TH", "topic": "Mã ASCII của ký tự '<' trong SBUF", "ans": "A",
        "meth": "Mã ASCII của ký tự '<' là $3\\text{CH}$ (thập phân 60).",
        "tips": "Mã ký tự '<' là 3CH.",
        "exp": "Ký tự dấu nhỏ hơn '<' có mã chuẩn ASCII theo hệ thập lục phân là $3\\text{CH}$. Khi truyền ký tự này qua cổng nối tiếp, dữ liệu thu được trong thanh ghi đệm nhận SBUF là $3\\text{CH}$."
    },
    33: {
        "clo": "CLO3", "level": "VD", "topic": "Tính tốc độ Baud từ TH1=F4H", "ans": "A",
        "meth": "Với $f_{\\text{osc}} = 11.0592\\,\\text{MHz}$ và $\\text{SMOD}=0$: $\\text{Baud} = \\frac{28800}{256 - \\text{F4H}} = \\frac{28800}{12} = 2400\\,\\text{bps}$.",
        "tips": "28800 / (256 - 244) = 28800 / 12 = 2400 bps.",
        "exp": "Với thạch anh chuẩn $11.0592\\,\\text{MHz}$ và Timer 1 hoạt động ở Chế độ 2, tốc độ Baud được tính theo công thức: $\\text{Baud} = \\frac{28800}{256 - \\text{TH1}}$. Với $\\text{TH1} = \\text{F4H} = 244$, số xung đếm là $256 - 244 = 12$, suy ra tốc độ truyền là $\\text{Baud} = \\frac{28800}{12} = 2400\\,\\text{bps}$."
    },
    34: {
        "clo": "CLO3", "level": "TH", "topic": "Chương trình nhận dữ liệu nối tiếp đưa ra cổng P1", "ans": "A",
        "meth": "Vòng lặp kiểm tra cờ RI: đọc dữ liệu từ SBUF vào A rồi xuất ra cổng P1 (`MOV P1, A`).",
        "tips": "Nhận các byte dữ liệu nối tiếp và đưa tới cổng P1.",
        "exp": "Đoạn chương trình cấu hình cổng nối tiếp và kiểm tra cờ nhận RI: mỗi khi nhận xong một byte dữ liệu nối tiếp vào thanh ghi đệm SBUF, CPU chuyển dữ liệu sang thanh ghi A và xuất trực tiếp ra cổng P1, thực hiện chức năng: Nhận các byte dữ liệu nối tiếp và đưa tới cổng P1."
    },
    35: {
        "clo": "CLO3", "level": "NB", "topic": "Bit EX0 trong thanh ghi cho phép ngắt IE", "ans": "A",
        "meth": "Bit EX0 (External Interrupt 0 Enable) cho phép ngắt ngoài 0 hoạt động khi được đặt lên 1.",
        "tips": "EX0 = Cho phép ngắt ngoài 0.",
        "exp": "Trong thanh ghi điều khiển cho phép ngắt IE, bit EX0 (nằm tại bit 0) khi được thiết lập lên mức 1 sẽ cho phép vi điều khiển tiếp nhận và xử lý tín hiệu ngắt từ chân ngắt cứng ngoài 0 (INT0)."
    },
    36: {
        "clo": "CLO3", "level": "NB", "topic": "Trình tự thực hiện ngắt của CPU 89C51", "ans": "A",
        "meth": "Khi có ngắt được chấp nhận, CPU tự động lưu giá trị của thanh ghi bộ đếm chương trình PC vào Stack đầu tiên.",
        "tips": "Việc đầu tiên khi ngắt: Lưu giá trị của thanh ghi PC vào Stack.",
        "exp": "Khi một ngắt xảy ra và được CPU chấp thuận, thao tác phần cứng đầu tiên mà CPU thực hiện là cất giá trị hiện thời của bộ đếm chương trình PC (địa chỉ của lệnh kế tiếp cần thực hiện sau khi trở về từ ngắt) vào đỉnh ngăn xếp Stack."
    },
    37: {
        "clo": "CLO3", "level": "TH", "topic": "Cấu hình ưu tiên ngắt IP: Nối tiếp > Ngắt ngoài 1", "ans": "A",
        "meth": "Bit PS (bit 4) = 1 (10H), bit PX1 (bit 2) = 1 (04H) $\\implies 10\\text{H} + 04\\text{H} = 14\\text{H}$. Lệnh là `MOV IP, #14H`.",
        "tips": "PS(10H) + PX1(04H) = 14H -> MOV IP, #14H.",
        "exp": "Trong thanh ghi mức ưu tiên ngắt IP: bit 4 là PS (ưu tiên ngắt nối tiếp) và bit 2 là PX1 (ưu tiên ngắt ngoài 1). Để đặt mức ưu tiên cao cho hai ngắt này, ta nạp giá trị nhị phân $0001\\,0100_2 = 14\\text{H}$ vào thanh ghi IP bằng lệnh `MOV IP, #14H`."
    },
    38: {
        "clo": "CLO3", "level": "VD", "topic": "Chương trình ngắt Timer 0 tạo xung vuông chu kỳ 1ms", "ans": "C",
        "meth": "Vector $000B\\text{H}$ là ISR của Timer 0. Nạp $\\text{FE0CH}$ trễ $500\\,\\mu\\text{s} \\implies T = 2 \\times 500\\,\\mu\\text{s} = 1\\,\\text{ms}$ tại cổng P1.0.",
        "tips": "Ngắt Timer 0 + nạp FE0CH -> Tạo xung vuông có chu kỳ 1ms tại cổng P1.0.",
        "exp": "Địa chỉ vector ngắt $000B\\text{H}$ trong chương trình là địa chỉ phục vụ ngắt của Timer 0. Giá trị nạp $\\text{FE0CH}$ tạo thời gian trễ tràn sau mỗi $500\\,\\mu\\text{s}$. Lệnh `CPL P1.0` đảo bit cổng trong ISR tạo sóng vuông tuần hoàn có chu kỳ toàn phần $T = 2 \\times 500\\,\\mu\\text{s} = 1\\,\\text{ms}$ tại chân P1.0."
    },
    39: {
        "clo": "CLO3", "level": "TH", "topic": "Chương trình ngắt ngoài 0 nháy LED tại chân P1.0", "ans": "A",
        "meth": "Vector $0003\\text{H}$ là ISR của ngắt ngoài 0 (INT0). Đảo trạng thái chân P1.0 khi có ngắt.",
        "tips": "Vector 0003H -> Ngắt ngoài 0; CPL P1.0 -> Nháy LED tại cổng P1.0.",
        "exp": "Chương trình cấu hình ngắt ngoài 0 (EX0=1, vector ngắt tại địa chỉ $0003\\text{H}$). Mỗi khi công tắc nối tại chân INT0 kích hoạt ngắt, chương trình phục vụ ngắt sẽ thực thi lệnh đảo trạng thái chân cổng `CPL P1.0`, thực hiện chức năng: Nháy LED tại cổng P1.0 thông qua công tắc tại ngắt ngoài 0."
    },
    40: {
        "clo": "CLO3", "level": "TH", "topic": "Chương trình ngắt nối tiếp nhận ký tự xuất ra P2.0", "ans": "A",
        "meth": "Vector $0023\\text{H}$ là ISR ngắt UART. Đọc SBUF, so sánh '1' bật P2.0, '0' tắt P2.0.",
        "tips": "Nhận một ký tự và đưa ra cổng P2.0 hiển thị.",
        "exp": "Chương trình sử dụng ngắt truyền thông nối tiếp tại vector $0023\\text{H}$: khi nhận được một ký tự qua cổng nối tiếp (cờ RI bật lên 1), vi điều khiển đọc mã ký tự từ thanh ghi SBUF và điều khiển trạng thái bật hoặc tắt cổng P2.0 tương ứng với ký tự nhận được."
    }
}

DE_004_DATA = {
    1: {
        "clo": "CLO1", "level": "NB", "topic": "Khái niệm bộ vi xử lý", "ans": "A",
        "meth": "Định nghĩa vi xử lý: Một vi mạch số hoạt động hoàn toàn theo chương trình.",
        "tips": "Vi xử lý là một vi mạch số hoạt động theo chương trình.",
        "exp": "Vi xử lý là một vi mạch số tích hợp đa năng hoạt động theo chương trình được nạp sẵn trong bộ nhớ, thực hiện các thao tác xử lý dữ liệu và điều khiển các thành phần trong hệ thống."
    },
    2: {
        "clo": "CLO1", "level": "NB", "topic": "Các thành phần lưu trữ trong CPU", "ans": "A",
        "meth": "Tập thanh ghi (Registers) nằm trực tiếp bên trong CPU, dùng lưu trữ tạm thời các lệnh và toán hạng trong quá trình thực hiện lệnh.",
        "tips": "Nơi chứa dữ liệu tạm thời trong CPU -> Các thanh ghi (Registers).",
        "exp": "Trong kiến trúc vi xử lý, tập thanh ghi (Registers) nằm trực tiếp bên trong nhân CPU có tốc độ truy xuất cực nhanh, đóng vai trò là nơi lưu trữ tạm thời các lệnh, dữ liệu và địa chỉ đang được CPU trực tiếp xử lý."
    },
    3: {
        "clo": "CLO1", "level": "NB", "topic": "Chức năng của bộ đếm chương trình PC", "ans": "A",
        "meth": "PC (Program Counter) là thanh ghi trỏ địa chỉ lệnh tiếp theo, KHÔNG PHẢI là nơi chứa dữ liệu tạm thời.",
        "tips": "PC KHÔNG phải là nơi chứa dữ liệu tạm thời.",
        "exp": "Bộ đếm chương trình PC (Program Counter) có chức năng duy nhất là lưu trữ địa chỉ của lệnh tiếp theo trong bộ nhớ chương trình mà CPU sẽ tìm nạp để thực thi; nó hoàn toàn không phải là nơi lưu trữ dữ liệu tạm thời của các phép tính toán."
    },
    4: {
        "clo": "CLO1", "level": "NB", "topic": "Bộ nhớ DRAM và quá trình làm tươi", "ans": "A",
        "meth": "DRAM (Dynamic RAM) lưu trữ thông tin dưới dạng điện tích trên tụ điện kí sinh nên cần quá trình làm tươi (Refresh) định kỳ.",
        "tips": "Quá trình làm tươi -> DRAM (Dynamic RAM).",
        "exp": "Bộ nhớ RAM động (DRAM - Dynamic RAM) lưu trữ dữ liệu bằng các điện tích trên các tụ điện siêu nhỏ của bóng bán dẫn MOS. Do hiện tượng rò rỉ điện tích theo thời gian, DRAM bắt buộc phải được làm tươi định kỳ để không bị mất dữ liệu."
    },
    5: {
        "clo": "CLO1", "level": "NB", "topic": "Số bộ đếm định thời trong chip 89C51", "ans": "A",
        "meth": "89C51 có đúng 2 bộ Timer/Counter 16-bit độc lập: Timer 0 và Timer 1.",
        "tips": "89C51 có đúng 2 bộ đếm/định thời (Timer 0 và Timer 1).",
        "exp": "Vi điều khiển tiêu chuẩn 89C51 tích hợp sẵn 2 bộ đếm/định thời (Timer/Counter) $16\\,\\text{bit}$ độc lập, ký hiệu là Timer 0 và Timer 1, được điều khiển thông qua hai thanh ghi TMOD và TCON."
    },
    6: {
        "clo": "CLO1", "level": "NB", "topic": "Chức năng chân điều khiển EA mức thấp", "ans": "A",
        "meth": "Chân $\\overline{\\text{EA}}$ giữ mức thấp (0V) buộc vi điều khiển chỉ thực thi bộ nhớ chương trình bên ngoài (ROM ngoại).",
        "tips": "EA = 0 -> Chỉ thực thi chương trình trong ROM ngoại.",
        "exp": "Khi chân tín hiệu $\\overline{\\text{EA}}$ (External Access) được duy trì ở mức điện thế thấp (0V/GND), vi điều khiển 89C51 sẽ bỏ qua toàn bộ bộ nhớ ROM nội và chỉ thực thi các lệnh được lưu trữ trong bộ nhớ chương trình ngoài (ROM ngoại)."
    },
    7: {
        "clo": "CLO2", "level": "TH", "topic": "Vùng nhớ ngăn xếp Stack khi SP=59H", "ans": "A",
        "meth": "Cơ chế hoạt động của Stack trong 8051: Khi thực hiện lệnh cất dữ liệu PUSH, giá trị SP tăng lên 1 trước rồi mới ghi dữ liệu. Do đó với SP = 59H, vùng nhớ thực sự của Stack bắt đầu từ ô nhớ 5AH trở đi.",
        "tips": "SP = 59H -> Vùng nhớ bắt đầu từ 5AH trở đi.",
        "exp": "Trong kiến trúc 8051, con trỏ ngăn xếp SP hoạt động theo nguyên tắc tăng trước ghi sau: khi thực hiện thao tác cất dữ liệu (lệnh `PUSH` hoặc gọi hàm `CALL`), giá trị thanh ghi SP được tự động tăng thêm 1 đơn vị trước khi byte dữ liệu được ghi vào ô nhớ. Vì vậy khi $\\text{SP} = 59\\text{H}$, byte dữ liệu đầu tiên được cất vào ngăn xếp sẽ nằm tại ô nhớ $5\\text{AH}$ trở đi."
    },
    8: {
        "clo": "CLO2", "level": "NB", "topic": "Cờ chẵn lẻ P tại vị trí PSW.0", "ans": "A",
        "meth": "Bit PSW.0 là cờ Parity P (cờ kiểm tra tính chẵn lẻ của thanh ghi tích lũy A).",
        "tips": "PSW.0 = Cờ P (Parity - chẵn lẻ).",
        "exp": "Bit 0 của thanh ghi trạng thái chương trình PSW (PSW.0) là cờ Parity P. Cờ này được phần cứng tự động cập nhật sau mỗi lệnh: bằng 1 nếu tổng số lượng bit 1 trong thanh ghi A là số lẻ, và bằng 0 nếu tổng số lượng bit 1 trong A là số chẵn."
    },
    9: {
        "clo": "CLO2", "level": "TH", "topic": "Dung lượng bộ nhớ RAM mở rộng trên sơ đồ", "ans": "8",
        "meth": "Sơ đồ gồm 2 chip RAM U3 và U4, mỗi chip có 12 đường địa chỉ ($A_0 - A_{11}$) $\\implies 2^{12} = 4\\,\\text{KB}$. Tổng dung lượng là $4\\,\\text{KB} + 4\\,\\text{KB} = 8\\,\\text{KB}$.",
        "tips": "2 chip x 4KB = 8 KB. Điền số: 8.",
        "exp": "Trên sơ đồ mạch mở rộng, hai chip RAM U3 và U4 đều có 12 đường địa chỉ ($A_0 - A_{11}$), tương ứng dung lượng mỗi chip là $2^{12}\\,\\text{Byte} = 4\\,\\text{KB}$. Hai chip được giải mã chọn chip luân phiên bằng đường P2.4, do đó tổng không gian địa chỉ RAM mở rộng là $4\\,\\text{KB} + 4\\,\\text{KB} = 8\\,\\text{KB}$."
    },
    10: {
        "clo": "CLO2", "level": "VD", "topic": "Phạm vi không gian địa chỉ của chip nhớ U3", "ans": "A",
        "custom_prompt": "Cho sơ đồ mở rộng của 89C51 với bộ nhớ RAM như hình vẽ dưới đây: Biết P2.5=0, P2.6=0, P2.7=0, vậy phạm vi không gian địa chỉ của bộ nhớ U3 là:",
        "meth": "U3 có 12 đường địa chỉ $A_0 - A_{11}$. Đường P2.4=0 kích hoạt $\\overline{\\text{CE}}$ của U3. Với $\\text{P2.7}=\\text{P2.6}=\\text{P2.5}=\\text{P2.4}=0 \\implies A_{15}..A_{12} = 0000_2$. Dải địa chỉ là $0000\\text{H} - 0\\text{FFFH}$.",
        "tips": "4 bit cao = 0000 -> Dải địa chỉ 0000H - 0FFFH.",
        "exp": "Chip nhớ U3 có 12 đường địa chỉ ($A_0 - A_{11}$). Chân cho phép $\\overline{\\text{CE}}$ của U3 nối trực tiếp với chân P2.4, do đó U3 được kích hoạt khi $\\text{P2.4}=0$. Với điều kiện đề bài $\\text{P2.7}=0, \\text{P2.6}=0, \\text{P2.5}=0$, bốn bit cao của bus địa chỉ ($A_{15}-A_{12}$) cố định bằng $0000_2$. Không gian địa chỉ của U3 bắt đầu từ $0000\\,0000\\,0000\\,0000_2 = 0000\\text{H}$ đến $0000\\,1111\\,1111\\,1111_2 = 0\\text{FFFH}$."
    },
    11: {
        "clo": "CLO2", "level": "TH", "topic": "Kết nối bus địa chỉ cho RAM 8Kx8bit", "ans": "A",
        "meth": "Bộ nhớ $8\\text{K} \\times 8\\,\\text{bit}$ ($2^{13}\\,\\text{Byte}$) cần 13 đường địa chỉ: 8 đường byte thấp P0.0–P0.7 và 5 đường byte cao P2.0–P2.4.",
        "tips": "8KB = 2^13 Byte -> 13 đường: P0.0-P0.7 và P2.0-P2.4.",
        "exp": "Để mở rộng bộ nhớ RAM có dung lượng $8\\text{K} \\times 8\\,\\text{bit} = 8192\\,\\text{Byte} = 2^{13}\\,\\text{Byte}$, vi điều khiển cần đúng 13 đường địa chỉ: 8 đường địa chỉ byte thấp $A_0 - A_7$ từ cổng P0 (qua IC chốt $74\\text{LS}373$) và 5 đường địa chỉ byte cao $A_8 - A_{12}$ từ các chân P2.0–P2.4 của cổng P2."
    },
    12: {
        "clo": "CLO2", "level": "VD", "topic": "Địa chỉ cao nhất của chip nhớ IC1", "ans": "2FFF",
        "custom_prompt": "Cho sơ đồ mở rộng bộ nhớ dữ liệu RAM của vi điều khiển 89C51 như hình vẽ dưới đây: Địa chỉ cao nhất của IC1 là____H?",
        "meth": "IC1 có 11 đường địa chỉ $A_0 - A_{10}$ (2KB). Giải mã qua 74ALS138 ngõ ra Y2: $E1=1$ (P2.3=1), $E3=0$ (P2.7=0), $CBA = 010_2$ (P2.6=0, P2.5=1, P2.4=0) $\\implies A_{15}..A_{11} = 00101_2 = 28\\text{H}$. 11 bit nội bằng 1 $\\implies 0010\\,1111\\,1111\\,1111_2 = 2\\text{FFFH}$.",
        "tips": "Ghép bit: 0010 1111 1111 1111 -> 2FFFH. Điền: 2FFF.",
        "exp": "Trên sơ đồ mạch giải mã bằng $74\\text{ALS}138$, chip IC1 được chọn khi ngõ ra $Y_2$ ở mức thấp. Điều kiện giải mã là các chân cho phép $E_1=1$ (tức $\\text{P2.3}=1$), $E_3=0$ (tức $\\text{P2.7}=0$) và các chân chọn kênh $CBA = 010_2$ (tức $\\text{P2.6}=0, \\text{P2.5}=1, \\text{P2.4}=0$). Năm bit cao của địa chỉ cố định là $A_{15}A_{14}A_{13}A_{12}A_{11} = 00101_2$. Chip IC1 có 11 đường địa chỉ nội ($A_0 - A_{10}$), khi toàn bộ 11 đường này đạt mức 1 ta thu được địa chỉ cao nhất: $0010\\,1111\\,1111\\,1111_2 = 2\\text{FFFH}$."
    },
    13: {
        "clo": "CLO2", "level": "NB", "topic": "Chế độ định địa chỉ theo chỉ số", "ans": "A",
        "meth": "Lệnh `MOVC A, @A+DPTR` sử dụng thanh ghi A làm chỉ số cộng vào con trỏ cơ sở DPTR -> Định địa chỉ theo chỉ số.",
        "tips": "MOVC A, @A+DPTR là định địa chỉ theo chỉ số.",
        "exp": "Trong câu lệnh `MOVC A, @A+DPTR`, địa chỉ thực của ô nhớ trong bộ nhớ chương trình được tính bằng tổng của thanh ghi con trỏ dữ liệu DPTR (Base Register) và thanh ghi tích lũy A (Index Register). Đây là ví dụ điển hình của Chế độ định địa chỉ theo chỉ số (Indexed Addressing)."
    },
    14: {
        "clo": "CLO2", "level": "NB", "topic": "Chỉ dẫn tiền xử lý EQU trong Assembly 8051", "ans": "A",
        "meth": "Từ khóa `EQU` (Equate) dùng để gán một hằng số hoặc biểu thức cho một tên định danh.",
        "tips": "Gán một giá trị cho một tên -> EQU.",
        "exp": "Trong ngôn ngữ hợp ngữ Assembly 8051, chỉ dẫn tiền xử lý `EQU` (Equate) được sử dụng để định nghĩa và gán một giá trị hằng số cố định cho một tên nhãn/ký hiệu định danh (ví dụ: `COUNT EQU 25`)."
    },
    15: {
        "clo": "CLO2", "level": "NB", "topic": "Phân loại lệnh - Lệnh nhảy LJMP", "ans": "A",
        "meth": "Lệnh `LJMP` (Long Jump) thực hiện bước nhảy dài 16-bit không điều kiện -> Lệnh điều khiển chương trình.",
        "tips": "LJMP = Long Jump -> Lệnh điều khiển chương trình.",
        "exp": "Lệnh `LJMP` (Long Jump) thực hiện chuyển hướng luồng thực thi của chương trình tới một địa chỉ đích bất kỳ trong toàn bộ không gian $64\\,\\text{KB}$ của bộ nhớ chương trình, do đó thuộc nhóm Lệnh điều khiển chương trình (Program Flow Control Instructions)."
    },
    16: {
        "clo": "CLO2", "level": "NB", "topic": "Kiểm tra giới hạn độ rộng toán hạng 8-bit", "ans": "A",
        "meth": "Thanh ghi A là thanh ghi 8-bit, chỉ chứa giá trị tối đa 0FFH (255). Lệnh `MOV A, #FF0H` nạp giá trị 12-bit là SAI cú pháp.",
        "tips": "FF0H là số 12 bit, vượt quá thanh ghi 8-bit A -> Lệnh sai.",
        "exp": "Thanh ghi tích lũy A là thanh ghi $8\\,\\text{bit}$, chỉ có khả năng lưu trữ các giá trị hằng số tức thời nằm trong dải từ $00\\text{H}$ đến $0\\text{FFH}$ ($0 - 255$). Giá trị `#FF0H` là một số $12\\,\\text{bit}$ ($4080$ thập phân), vượt quá dung lượng thanh ghi A nên lệnh `MOV A, #FF0H` là lệnh SAI."
    },
    17: {
        "clo": "CLO2", "level": "NB", "topic": "Lệnh rẽ nhánh theo cờ Zero JZ", "ans": "C",
        "meth": "`JZ rel` (Jump if Zero): nhảy đến địa chỉ rel nếu cờ Zero = 1 (tức thanh ghi A = 0).",
        "tips": "Cờ Zero = 1 -> Lệnh JZ rel.",
        "exp": "Trong tập lệnh 8051, lệnh `JZ rel` (Jump if Zero) kiểm tra trạng thái của thanh ghi tích lũy A: nếu nội dung trong thanh ghi A bằng 0 (tương ứng cờ trạng thái Zero bằng 1), chương trình sẽ rẽ nhánh nhảy đến nhãn tương đối `rel`."
    },
    18: {
        "clo": "CLO2", "level": "VD", "topic": "Phép cộng có nhớ ADDC với con trỏ gián tiếp", "ans": "72",
        "meth": "$A + @R1 + \\text{CY} = \\text{AEH} + \\text{C3H} + 1 = 172\\text{H} \\implies A = 72\\text{H}$.",
        "tips": "Casio 580VNX (MENU 3): AEH + C3H + 1 = 172H -> Lấy 8 bit thấp: 72H. Điền: 72.",
        "exp": "Thanh ghi R1 chứa địa chỉ $81\\text{H}$, do đó `@R1` trỏ đến ô nhớ $81\\text{H}$ có giá trị $\\text{C3H}$. Thanh ghi $\\text{PSW} = 81\\text{H}$ có bit 7 (CY) bằng 1. Thực hiện lệnh cộng có nhớ: $A + @R1 + \\text{CY} = \\text{AEH} + \\text{C3H} + 1 = 172\\text{H}$. Do thanh ghi A có độ rộng $8\\,\\text{bit}$, kết quả lưu trong A là $72\\text{H}$ (và cờ nhớ $\\text{CY}=1$)."
    },
    19: {
        "clo": "CLO2", "level": "VD", "topic": "Tính toán cờ CY và P trong lệnh trừ SUBB", "ans": "A",
        "meth": "$56\\text{H} - \\text{DA}\\text{H} - \\text{CY}(1) = 7\\text{B}\\text{H}$. Có mượn byte cao $\\implies \\text{CY} = 1$. Kết quả $7\\text{B}\\text{H} = 0111\\,1011_2$ có 6 bit 1 (chẵn) $\\implies \\text{P} = 0$.",
        "tips": "CY = 1, P = 0.",
        "exp": "Lệnh `SUBB A, R0` thực hiện phép trừ: $56\\text{H} - \\text{DA}\\text{H} - 1 = 7\\text{B}\\text{H}$. Vì số bị trừ nhỏ hơn số trừ nên xuất hiện số mượn $\\implies \\text{CY} = 1$. Kết quả thu được trong thanh ghi A là $7\\text{B}\\text{H} = 0111\\,1011_2$ có tổng cộng 6 bit 1 (số chẵn), do đó cờ Parity $\\text{P} = 0$. Vậy trạng thái cờ là $\\text{CY} = 1, \\text{P} = 0$."
    },
    20: {
        "clo": "CLO2", "level": "VD", "topic": "Thao tác logic AND trên ô nhớ RAM nội", "ans": "45",
        "meth": "$A = 7\\text{EH} \\& 7\\text{FH} = 55\\text{H} \\& 4\\text{FH} = 0101\\,0101_2 \\& 0100\\,1111_2 = 0100\\,0101_2 = 45\\text{H}$.",
        "tips": "Casio 580VNX (MENU 3): 55H AND 4FH = 45H. Điền: 45.",
        "exp": "Đoạn chương trình thực hiện: $R0 = 7\\text{FH}$, nạp $A = 55\\text{H}$, sau đó thực hiện phép toán logic AND với ô nhớ do R0 trỏ tới: $A = 55\\text{H} \\ \\& \\ 4\\text{FH} = 0101\\,0101_2 \\ \\& \\ 0100\\,1111_2 = 0100\\,0101_2 = 45\\text{H}$. Các lệnh tiếp theo tiếp tục giữ nguyên kết quả $45\\text{H}$ trong thanh ghi A."
    },
    21: {
        "clo": "CLO2", "level": "VD", "topic": "Rẽ nhánh theo cờ Zero và cộng có nhớ ADDC", "ans": "C",
        "meth": "$0\\text{FFH} + 1 = 100\\text{H} \\implies A = 00\\text{H}, \\text{CY} = 1, Z = 1$. Lệnh `JZ SKIP` nhảy tới SKIP. Tại SKIP: `ADDC A, #03H` $\\implies A = 00\\text{H} + 03\\text{H} + \\text{CY}(1) = 04\\text{H}$.",
        "tips": "A = 00H, CY = 1 -> Nhảy tới SKIP -> 00H + 03H + 1 = 04H.",
        "exp": "Lệnh `ADD A, #1` với $A = 0\\text{FFH}$ cho kết quả $A = 00\\text{H}$ và cờ nhớ $\\text{CY} = 1$. Do nội dung thanh ghi A bằng 0, lệnh rẽ nhánh `JZ SKIP` thỏa mãn điều kiện và nhảy thẳng tới nhãn `SKIP`. Tại đây, câu lệnh `ADDC A, #03H` cộng cả cờ nhớ: $A = 00\\text{H} + 03\\text{H} + 1 = 04\\text{H}$."
    },
    22: {
        "clo": "CLO3", "level": "VD", "topic": "Chương trình con tạo trễ 500 mili-giây (500ms)", "ans": "A",
        "meth": "3 vòng lặp: $R7 = 5$, $R6 = 200$ ($0\\text{C8H}$), $R5 = 250$ ($0\\text{FAH}$). Tổng chu kỳ máy: $5 \\times 200 \\times 250 \\times 2\\,\\mu\\text{s} = 500{,}000\\,\\mu\\text{s} = 500\\,\\text{ms}$.",
        "tips": "5 x 200 x 250 x 2µs = 500,000µs = 500ms.",
        "exp": "Chương trình con tạo trễ sử dụng ba vòng lặp lồng nhau tiêu tốn thời gian: vòng lặp trong cùng đếm $250$ lần, vòng lặp giữa $200$ lần, vòng lặp ngoài $5$ lần. Với chu kỳ lệnh $2\\,\\mu\\text{s}$ của lệnh DJNZ (ở tần số $12\\,\\text{MHz}$), tổng thời gian trễ xấp xỉ $5 \\times 200 \\times 250 \\times 2\\,\\mu\\text{s} = 500{,}000\\,\\mu\\text{s} = 500\\,\\text{ms}$."
    },
    23: {
        "clo": "CLO2", "level": "TH", "topic": "Tìm giá trị ban đầu với lệnh đảo bit CPL A", "ans": "C3",
        "meth": "Sau lệnh `CPL A` nội dung trong A là $3\\text{CH} = 0011\\,1100_2$. Giá trị trước khi đảo bit: $\\sim 3\\text{CH} = 1100\\,0011_2 = \\text{C3H}$.",
        "tips": "Casio 580VNX (MENU 3): NOT 3CH = C3H. Điền: C3.",
        "exp": "Lệnh `CPL A` đảo tất cả 8 bit trong thanh ghi A (bit 0 thành 1, bit 1 thành 0). Để thu được kết quả $A = 3\\text{CH} = 0011\\,1100_2$, giá trị ban đầu cần nạp vào thanh ghi A phải là phần bù bù 1 của $3\\text{CH}$: $1100\\,0011_2 = \\text{C3H}$."
    },
    24: {
        "clo": "CLO2", "level": "VD", "topic": "Vòng lặp xoay trái tròn RL 5 lần", "ans": "A",
        "meth": "$3\\text{B}\\text{H} = 0011\\,1011_2$. Xoay trái 5 lần tương đương xoay phải 3 lần: $0011\\,1011_2 \\xrightarrow{\\text{RL } 5} 0110\\,0111_2 = 67\\text{H}$.",
        "tips": "3BH xoay trái 5 lần ra 67H.",
        "exp": "Giá trị ban đầu trong thanh ghi A là $3\\text{B}\\text{H} = 0011\\,1011_2$. Vòng lặp `RL A` thực hiện đúng 5 lần qua thanh ghi đếm R1 (`DJNZ R1, LAP`). Sau 5 lần xoay trái tròn các bit nhị phân, ta thu được kết quả: $0110\\,0111_2 = 67\\text{H}$."
    },
    25: {
        "clo": "CLO2", "level": "TH", "topic": "Thuật toán tính tổng 10 phần tử mảng dữ liệu", "ans": "A",
        "meth": "Con trỏ R0 duyệt 10 ô nhớ bắt đầu tại DATA, cộng dồn vào thanh ghi A và lưu kết quả vào ô nhớ SUM.",
        "tips": "Cộng dồn 10 phần tử từ DATA và cất vào SUM -> Tính tổng.",
        "exp": "Chương trình khởi tạo con trỏ $R0 = \\text{DATA}$ và thanh ghi đếm $R7 = 10$ ($0\\text{AH}$). Vòng lặp `LOOP: ADD A, @R0` duyệt qua 10 ô nhớ liên tiếp, cộng dồn từng phần tử vào thanh ghi tích lũy A và cuối cùng cất kết quả vào ô nhớ `SUM`, thực hiện chức năng: Tính tổng của các số đặt trong 10 ô nhớ có địa chỉ đầu đoạn tại DATA, lưu nội dung trong SUM."
    },
    26: {
        "clo": "CLO3", "level": "NB", "topic": "Bit khởi động Timer 0 TR0 trong thanh ghi TCON", "ans": "A",
        "meth": "Bit TR0 (Timer 0 Run Control) dùng để khởi động Timer 0 khi TR0=1 và dừng Timer 0 khi TR0=0.",
        "tips": "TR0 khởi động Timer 0.",
        "exp": "Trong thanh ghi điều khiển bộ định thời TCON, bit TR0 (bit 4) là bit điều khiển chạy/dừng của Timer 0. Khi lập trình viên gán $\\text{TR0} = 1$ (bằng lệnh `SETB TR0`), bộ đếm Timer 0 sẽ bắt đầu đếm."
    },
    27: {
        "clo": "CLO3", "level": "NB", "topic": "Cấu hình Chế độ 3 của Timer 0 trong TMOD", "ans": "A",
        "meth": "Chế độ 3 (Split Timer Mode) được thiết lập khi cả hai bit M1 và M0 đều bằng 1 ($M1=1, M0=1$).",
        "tips": "Chế độ 3: Thiết lập cả hai bit M0 và M1 lên 1.",
        "exp": "Để cấu hình Timer 0 hoạt động ở Chế độ 3 (chế độ tách đôi: TL0 là Timer 8-bit riêng và TH0 là Timer 8-bit riêng mượn cờ của Timer 1), ta thiết lập cả hai bit chọn chế độ M1 và M0 trong thanh ghi TMOD lên mức 1 ($M1=1, M0=1$)."
    },
    28: {
        "clo": "CLO3", "level": "VD", "topic": "Tính giá trị khởi tạo Timer Chế độ 0 (13-bit)", "ans": "A",
        "meth": "Chế độ 0 (13-bit): $\\text{TH0} = \\text{E0H} = 224$, 5 bit thấp của $\\text{TL0} = 18\\text{H}$ ($24$). $X = (224 \\times 32) + 24 = 7168 + 24 = 7192$.",
        "tips": "Casio 580VNX: 224 x 32 + 24 = 7192. Đáp án: X = 7192.",
        "exp": "Ở Chế độ 0 ($13\\,\\text{bit}$), bộ đếm ghép từ toàn bộ 8 bit của TH0 ($\\text{E0H} = 224$) và 5 bit thấp của TL0 ($18\\text{H} = 0001\\,1000_2 \\implies 24$). Giá trị khởi tạo ban đầu nạp vào bộ đếm là: $X = (224 \\times 32) + 24 = 7168 + 24 = 7192$."
    },
    29: {
        "clo": "CLO3", "level": "VD", "topic": "Tính giá trị nạp TH0 cho Timer 0 Chế độ 2", "ans": "A",
        "meth": "$f_{\\text{osc}} = 6\\,\\text{MHz}$ ($T_{\\text{cm}} = 2\\,\\mu\\text{s}$). Độ trễ $200\\,\\mu\\text{s} \\implies$ số xung $N = 200 / 2 = 100$. $\\text{TH0} = 256 - 100 = 156 = 9\\text{CH}$.",
        "tips": "Casio 580VNX: 256 - 100 = 156 -> HEX: 9CH. Đáp án: TH0 = 9CH.",
        "exp": "Với tần số thạch anh $6\\,\\text{MHz}$, chu kỳ máy là $T_{\\text{cm}} = \\frac{12}{6\\,\\text{MHz}} = 2\\,\\mu\\text{s}$. Để tạo độ trễ $200\\,\\mu\\text{s}$, số xung đếm cần thiết là $N = \\frac{200\\,\\mu\\text{s}}{2\\,\\mu\\text{s}} = 100$ xung. Với Timer ở Chế độ 2 ($8\\,\\text{bit}$ tự động nạp lại), giá trị nạp vào thanh ghi TH0 là: $\\text{TH0} = 256 - 100 = 156 = 9\\text{CH}$."
    },
    30: {
        "clo": "CLO3", "level": "VD", "topic": "Timer tạo sóng vuông tần số 25Hz trên chân P3.1", "ans": "A",
        "meth": "Nạp $\\text{B2A0H} = 45{,}728 \\implies$ số xung đếm $65{,}536 - 45{,}728 = 19{,}808$ xung $\\approx 20\\,\\text{ms}$ nửa chu kỳ $\\implies T \\approx 40\\,\\text{ms} \\implies f = 25\\,\\text{Hz}$.",
        "tips": "Tạo dạng sóng vuông có tần số 25Hz trên chân P3.1.",
        "exp": "Chương trình cấu hình Timer 0 ở Chế độ 1 nạp giá trị $\\text{B2A0H}$, tạo ra khoảng trễ nửa chu kỳ xấp xỉ $20\\,\\text{ms}$. Lệnh đảo bit cổng P3.1 tạo ra dạng sóng vuông tuần hoàn có chu kỳ toàn phần $T = 40\\,\\text{ms}$, tương ứng tần số dao động là $f = \\frac{1}{0.04\\,\\text{s}} = 25\\,\\text{Hz}$ trên chân P3.1."
    },
    31: {
        "clo": "CLO3", "level": "NB", "topic": "Cờ báo hoàn thành truyền UART TI", "ans": "A",
        "meth": "Bit TI (Transmit Interrupt) bật lên 1 khi toàn bộ byte dữ liệu cùng bit Stop đã được phát xong.",
        "tips": "TI = 1: Quá trình truyền dữ liệu đã hoàn thành.",
        "exp": "Khi bit TI trong thanh ghi điều khiển cổng nối tiếp SCON được phần cứng tự động bật lên mức 1, điều này biểu thị rằng khung truyền dữ liệu của ký tự hiện tại đã được phát xong hoàn tất qua chân TXD."
    },
    32: {
        "clo": "CLO3", "level": "TH", "topic": "Dữ liệu nhận trong thanh ghi đệm SBUF", "ans": "A",
        "meth": "Giá trị trong SBUF là $0\\text{x7E} \\implies$ dữ liệu nhận được qua cổng nối tiếp là $7\\text{EH}$.",
        "tips": "0x7E = 7EH.",
        "exp": "Thanh ghi SBUF là bộ đệm nhận dữ liệu của cổng nối tiếp. Khi giá trị đọc ra từ thanh ghi SBUF là $0\\text{x7E}$, byte dữ liệu nhận được qua cổng nối tiếp chính là $7\\text{EH}$."
    },
    33: {
        "clo": "CLO3", "level": "VD", "topic": "Tính tốc độ Baud từ TH1=FAH", "ans": "A",
        "meth": "$\\text{TH1} = \\text{FAH} = 250 \\implies$ số xung đếm $256 - 250 = 6$. $\\text{Baud} = \\frac{28800}{6} = 4800\\,\\text{bps}$.",
        "tips": "28800 / (256 - 250) = 28800 / 6 = 4800 bps.",
        "exp": "Với thạch anh chuẩn $11.0592\\,\\text{MHz}$ và Timer 1 hoạt động ở Chế độ 2 ($SMOD=0$), tốc độ Baud được tính theo công thức: $\\text{Baud} = \\frac{28800}{256 - \\text{TH1}}$. Với $\\text{TH1} = \\text{FAH} = 250$, số xung đếm là $256 - 250 = 6$, suy ra tốc độ truyền là $\\text{Baud} = \\frac{28800}{6} = 4800\\,\\text{bps}$."
    },
    34: {
        "clo": "CLO3", "level": "TH", "topic": "Chương trình truyền ký tự 'A' liên tục với 4800 baud", "ans": "A",
        "meth": "Nạp $\\text{TH1} = -6$ tạo tốc độ 4800 baud, nạp SBUF = 'A' và lặp vô hạn.",
        "tips": "Truyền ký tự A với tốc độ 4800 baud liên tục.",
        "exp": "Chương trình cấu hình Timer 1 Chế độ 2 với $\\text{TH1} = -6$ tạo ra tốc độ Baud chuẩn $4800\\,\\text{bps}$, sau đó nạp ký tự 'A' vào SBUF và lặp lại liên tục trong vòng lặp `SJMP HERE`, thực hiện chức năng: Truyền ký tự A với tốc độ 4800 baud liên tục."
    },
    35: {
        "clo": "CLO3", "level": "NB", "topic": "Cờ ngắt ngoài trong thanh ghi TCON", "ans": "A",
        "meth": "Cờ ngắt ngoài IE1 (hoặc IE0) trong TCON được bật khi xuất hiện sự kiện ngắt ngoài.",
        "tips": "Có sự kiện ngắt ngoài 1.",
        "exp": "Cờ báo ngắt ngoài trong thanh ghi điều khiển TCON được phần cứng tự động thiết lập lên mức 1 khi phát hiện có tín hiệu yêu cầu ngắt hợp lệ đưa vào chân ngắt tương ứng."
    },
    36: {
        "clo": "CLO3", "level": "NB", "topic": "Địa chỉ Vector ngắt ngoại vi 1 (INT1)", "ans": "A",
        "meth": "Vector ngắt INT1 có địa chỉ cố định là $0013\\text{H}$ trong bộ nhớ chương trình.",
        "tips": "Ngắt ngoại vi 1 -> Vector 0013H.",
        "exp": "Trong bảng phân bổ vector ngắt của vi điều khiển 8051, ngắt ngoại vi 1 (INT1) có địa chỉ vector phục vụ ngắt cố định bắt đầu tại ô nhớ $0013\\text{H}$."
    },
    37: {
        "clo": "CLO3", "level": "TH", "topic": "Lệnh không cho phép mở ngắt", "ans": "A",
        "meth": "`MOV IE, #08H` chỉ bật bit ET1, bit cho phép ngắt toàn cục EA (bit 7) vẫn bằng 0 nên không mở ngắt được.",
        "tips": "Bit EA=0 nên không mở được ngắt -> MOV IE, #08H.",
        "exp": "Để bất kỳ ngắt nào có thể hoạt động, bit cho phép ngắt toàn cục EA (bit 7 của thanh ghi IE) bắt buộc phải được đặt lên mức 1. Lệnh `MOV IE, #08H` nạp giá trị nhị phân $0000\\,1000_2$ có bit $\\text{EA} = 0$, do đó KHÔNG cho phép mở ngắt."
    },
    38: {
        "clo": "CLO3", "level": "VD", "topic": "Chương trình ngắt Timer 0 tạo xung vuông chu kỳ 1ms", "ans": "C",
        "meth": "Vector $000B\\text{H}$ (Timer 0 ISR), trễ tràn $500\\,\\mu\\text{s} \\implies T = 2 \\times 500\\,\\mu\\text{s} = 1\\,\\text{ms}$ tại chân P1.0.",
        "tips": "Sử dụng ngắt timer 0 để tạo xung vuông có chu kỳ 1ms tại cổng P1.0.",
        "exp": "Chương trình đặt chương trình con phục vụ ngắt tại địa chỉ vector $000B\\text{H}$ của Timer 0. Khoảng định thời $500\\,\\mu\\text{s}$ kết hợp với lệnh đảo chân `CPL P1.0` tạo ra dạng sóng vuông có chu kỳ toàn phần $T = 2 \\times 500\\,\\mu\\text{s} = 1\\,\\text{ms}$ xuất ra tại cổng P1.0."
    },
    39: {
        "clo": "CLO3", "level": "TH", "topic": "Ngắt ngoài 1 điều khiển LED tại chân P1.6", "ans": "A",
        "meth": "Vector $0013\\text{H}$ là ngắt ngoài 1 (INT1). Điều khiển bật tắt LED tại chân P1.6.",
        "tips": "Bật tắt led tại cổng P1.6 thông qua công tắc tại ngắt ngoài 1.",
        "exp": "Chương trình định nghĩa ISR tại địa chỉ vector $0013\\text{H}$ tương ứng với ngắt ngoài 1 (INT1). Khi có sự kiện kích hoạt ngắt từ công tắc nối tại chân INT1, chương trình thực thi thao tác bật chân P1.6 lên 1, tạo trễ và xóa chân P1.6 về 0, thực hiện chức năng bật tắt LED tại cổng P1.6 thông qua công tắc tại ngắt ngoài 1."
    },
    40: {
        "clo": "CLO3", "level": "TH", "topic": "Chương trình truyền ký tự UART xuất ra chân P1.4", "ans": "A",
        "meth": "Chương trình truyền mã ký tự qua UART, đồng thời xuất trạng thái bit A.4 ra chân P1.4.",
        "tips": "Chương trình truyền thông nối tiếp xuất ký tự ra cổng P1.4.",
        "exp": "Chương trình thực hiện cấu hình cổng UART và truyền ký tự nối tiếp, đồng thời thực hiện trích xuất bit trạng thái thứ 4 của thanh ghi tích lũy A đưa ra chân cổng P1.4 (`MOV P1.4, C`)."
    }
}

DE_005_DATA = {
    1: {
        "clo": "CLO1", "level": "NB", "topic": "Kỹ thuật đường ống Pipeline trong ARM", "ans": "A",
        "meth": "Pipeline (đường ống) chia việc xử lý lệnh thành nhiều công đoạn song song (Fetch - Decode - Execute) để tăng tốc độ thực thi lệnh.",
        "tips": "Pipeline dùng để: Tăng tốc độ thực thi lệnh.",
        "exp": "Trong kiến trúc vi xử lý ARM, kỹ thuật đường ống Pipeline phân chia chu kỳ lệnh thành các tầng độc lập (Tìm nạp lệnh Fetch, Giải mã lệnh Decode, Thực thi lệnh Execute) hoạt động gối đầu song song nhau, giúp tăng tốc độ thực thi lệnh và nâng cao thông lượng của CPU."
    },
    2: {
        "clo": "CLO1", "level": "NB", "topic": "Phân loại bus hệ thống vi xử lý", "ans": "A",
        "meth": "Bus dữ liệu (Data Bus) là bus hai chiều, cho phép truyền dữ liệu cả hai hướng giữa CPU và bộ nhớ/ngoại vi.",
        "tips": "Bus hai chiều là: Bus dữ liệu.",
        "exp": "Trong hệ thống bus của máy tính, bus dữ liệu (Data Bus) là bus hai chiều (Bidirectional) duy nhất, cho phép truyền dữ liệu từ CPU ghi ra bộ nhớ/thiết bị ngoại vi và ngược lại đọc dữ liệu từ bộ nhớ/ngoại vi đưa về CPU."
    },
    3: {
        "clo": "CLO1", "level": "NB", "topic": "Trình tự CPU ghi dữ liệu ra bộ nhớ", "ans": "A",
        "meth": "CPU cấp địa chỉ -> cấp dữ liệu lên bus dữ liệu -> phát tín hiệu điều khiển ghi (MEMW/WR).",
        "tips": "Cấp địa chỉ, cấp dữ liệu, phát tín hiệu yêu cầu ghi.",
        "exp": "Để ghi dữ liệu vào một ô nhớ trong bộ nhớ, CPU thực hiện tuần tự: cấp địa chỉ ô nhớ lên bus địa chỉ, cấp dữ liệu cần ghi lên bus dữ liệu, phát tín hiệu điều khiển chọn bộ nhớ và phát tín hiệu xung yêu cầu ghi bộ nhớ ($\\overline{\\text{MEMW}}$/$\\overline{\\text{WR}}$)."
    },
    4: {
        "clo": "CLO1", "level": "TH", "topic": "Số đường địa chỉ cho bộ nhớ 8KB", "ans": "A",
        "meth": "$8\\,\\text{KB} = 8192\\,\\text{Byte} = 2^{13}\\,\\text{Byte} \\implies$ cần 13 đường địa chỉ từ $A_0$ đến $A_{12}$.",
        "tips": "Casio 580VNX: 2^13 = 8192 Byte (8KB) -> A0… A12.",
        "exp": "Một thiết bị có dung lượng $8\\,\\text{KB} = 8192\\,\\text{Byte} = 2^{13}\\,\\text{Byte}$ đòi hỏi $N = 13$ đường địa chỉ nhị phân để có thể định vị từng byte riêng biệt, tương ứng với dải đường địa chỉ từ $A_0$ đến $A_{12}$."
    },
    5: {
        "clo": "CLO1", "level": "NB", "topic": "Dung lượng bộ nhớ dữ liệu ngoài tối đa của 89C51", "ans": "A",
        "meth": "Bus địa chỉ 16-bit quản lý tối đa $2^{16} = 65{,}536\\,\\text{Byte} = 64\\,\\text{KB}$ RAM ngoại.",
        "tips": "16 bit địa chỉ -> 64 KB RAM ngoại.",
        "exp": "Vi điều khiển 89C51 có con trỏ dữ liệu DPTR $16\\,\\text{bit}$ và bus địa chỉ ngoài $16\\,\\text{bit}$ (kết hợp cổng P0 và P2), cho phép truy xuất không gian bộ nhớ dữ liệu ngoài (RAM ngoại) tối đa là $2^{16}\\,\\text{Byte} = 64\\,\\text{KB}$."
    },
    6: {
        "clo": "CLO1", "level": "NB", "topic": "Chức năng chân điều khiển EA", "ans": "A",
        "meth": "Chân $\\overline{\\text{EA}}$ (External Access) điều khiển cho phép truy xuất bộ nhớ chương trình bên ngoài.",
        "tips": "EA = Cho phép truy xuất bộ nhớ chương trình bên ngoài.",
        "exp": "Chân tín hiệu $\\overline{\\text{EA}}$ (External Access) là chân điều khiển truy cập bộ nhớ chương trình ngoài: khi ở mức thấp (0V), CPU chỉ truy xuất ROM ngoại; khi ở mức cao (+5V), CPU truy xuất ROM nội trước và ROM ngoại sau."
    },
    7: {
        "clo": "CLO2", "level": "NB", "topic": "Giá trị khởi tạo con trỏ ngăn xếp SP sau reset", "ans": "A",
        "meth": "Sau khi vi điều khiển được reset, con trỏ ngăn xếp SP được phần cứng tự động nạp giá trị mặc định là 07H.",
        "tips": "Sau reset, con trỏ SP = 07H (trỏ đỉnh băng thanh ghi 0).",
        "exp": "Khi tín hiệu Reset được kích hoạt trên vi điều khiển 89C51, phần cứng sẽ khởi tạo thanh ghi con trỏ ngăn xếp SP có giá trị mặc định là $07\\text{H}$ (đỉnh của băng thanh ghi Bank 0), vì vậy byte dữ liệu cất vào Stack đầu tiên sẽ nằm tại ô nhớ $08\\text{H}$."
    },
    8: {
        "clo": "CLO2", "level": "NB", "topic": "Vị trí cờ tràn OV trong thanh ghi PSW", "ans": "A",
        "meth": "Cờ tràn OV (Overflow Flag) nằm tại bit thứ 2 của thanh ghi trạng thái chương trình PSW (PSW.2).",
        "tips": "Cờ tràn OV nằm ở bit PSW.2.",
        "exp": "Trong cấu trúc 8 bit của thanh ghi trạng thái chương trình PSW, cờ tràn OV (Overflow Flag) được bố trí tại bit thứ 2 (ký hiệu là PSW.2, tương ứng địa chỉ bit $D2\\text{H}$)."
    },
    9: {
        "clo": "CLO2", "level": "TH", "topic": "Dung lượng bộ nhớ ROM mở rộng trên sơ đồ", "ans": "16",
        "meth": "Sơ đồ gồm 2 IC ROM mở rộng (IC1 và IC2), mỗi IC có 13 đường địa chỉ ($A_0 - A_{12}$) $\\implies 2^{13} = 8\\,\\text{KB}$. Tổng dung lượng là $8\\,\\text{KB} + 8\\,\\text{KB} = 16\\,\\text{KB}$.",
        "tips": "2 chip ROM x 8KB = 16 KB. Điền số: 16 (hoặc 8).",
        "exp": "Trên sơ đồ mạch mở rộng, hai chip nhớ ROM IC1 và IC2 đều có 13 đường địa chỉ ($A_0 - A_{12}$), tương ứng dung lượng mỗi chip là $2^{13}\\,\\text{Byte} = 8\\,\\text{KB}$. Tổng dung lượng không gian nhớ ROM mở rộng là $8\\,\\text{KB} + 8\\,\\text{KB} = 16\\,\\text{KB}$."
    },
    10: {
        "clo": "CLO2", "level": "TH", "topic": "Dung lượng chip nhớ ROM mở rộng U3 và U4", "ans": "D",
        "meth": "Hai chip nhớ mở rộng U3 và U4 có dung lượng mỗi chip là 4KB $\\implies$ tổng dung lượng là 8KB (tổ chức $8\\text{K} \\times 8\\,\\text{bit}$).",
        "tips": "8Kx8bit (8KB).",
        "exp": "Sơ đồ mạch sử dụng vi mạch nhớ chuẩn có tổng dung lượng lưu trữ mở rộng là $8\\,\\text{KB}$, tương ứng với tổ chức bộ nhớ $8\\text{K} \\times 8\\,\\text{bit}$."
    },
    11: {
        "clo": "CLO1", "level": "NB", "topic": "Dung lượng bộ nhớ Flash ROM nội trên chip 89C51", "ans": "A",
        "meth": "Vi điều khiển AT89C51 tích hợp sẵn 4KB Flash ROM bộ nhớ chương trình nội.",
        "tips": "89C51 tích hợp 4KB Flash ROM.",
        "exp": "Chip vi điều khiển chuẩn AT89C51 được nhà sản xuất tích hợp sẵn $4\\,\\text{KB}$ bộ nhớ chương trình công nghệ Flash ROM (có thể xóa và ghi lại bằng điện) trên cùng một đế bán dẫn."
    },
    12: {
        "clo": "CLO2", "level": "VD", "topic": "Tính địa chỉ cao nhất của chip nhớ IC1", "ans": "1FFF",
        "custom_prompt": "Cho sơ đồ mở rộng bộ nhớ chương trình ROM và bộ nhớ dữ liệu RAM của vi điều khiển 89C51 như hình vẽ dưới đây: Địa chỉ cao nhất của IC1 là____H?",
        "meth": "IC1 chọn bởi ngõ ra Y0 của 74LS139: E=0 (P2.7=0), BA=00 (P2.6=0, P2.5=0) $\\implies A_{15}..A_{13} = 000_2$. 13 bit nội $A_0 - A_{12}$ bằng 1 $\\implies 0001\\,1111\\,1111\\,1111_2 = 1\\text{FFFH}$.",
        "tips": "Ghép bit: 0001 1111 1111 1111 -> 1FFFH. Điền: 1FFF.",
        "exp": "Trên sơ đồ mạch giải mã bằng $74\\text{LS}139$, IC1 được kích hoạt khi ngõ ra $Y_0$ ở mức thấp. Điều kiện giải mã là $\\text{P2.7}=0, \\text{P2.6}=0, \\text{P2.5}=0$. Ba bit cao của địa chỉ cố định là $A_{15}A_{14}A_{13} = 000_2$. IC1 có 13 đường địa chỉ nội ($A_0 - A_{12}$), khi toàn bộ 13 đường này đạt mức 1 ta thu được địa chỉ cao nhất: $0001\\,1111\\,1111\\,1111_2 = 1\\text{FFFH}$."
    },
    13: {
        "clo": "CLO2", "level": "NB", "topic": "Chế độ định địa chỉ tức thời", "ans": "A",
        "meth": "Toán hạng nguồn mang tiền tố '#' (#3AH) -> Chế độ định địa chỉ tức thời.",
        "tips": "Có tiền tố '#' là định địa chỉ tức thời.",
        "exp": "Trong câu lệnh `MOV A, #3AH`, toán hạng nguồn là hằng số cố định được đặt ngay sau mã lệnh và nhận biết qua ký tự tiền tố '#', do đó chế độ định địa chỉ được sử dụng là Chế độ định địa chỉ tức thời (Immediate Addressing)."
    },
    14: {
        "clo": "CLO2", "level": "NB", "topic": "Ký hiệu biểu thị hằng số Hex trong Assembly 8051", "ans": "A",
        "meth": "Trong hợp ngữ 8051, một số thập lục phân thường biểu diễn với tiền tố 0x hoặc hậu tố H (ví dụ 0x3A hoặc 3AH).",
        "tips": "Hậu tố H hoặc tiền tố 0x biểu thị số hexa.",
        "exp": "Trong ngôn ngữ hợp ngữ Assembly 8051, hằng số thập lục phân (Hexadecimal) được biểu thị bằng hậu tố 'H' hoặc chuẩn '0x' theo ngôn ngữ cấp cao để phân biệt với hệ thập phân."
    },
    15: {
        "clo": "CLO2", "level": "NB", "topic": "Phân loại tập lệnh - Lệnh xoay phải RRC", "ans": "A",
        "meth": "Lệnh `RRC A` xoay các bit của thanh ghi A sang phải qua cờ nhớ Carry -> Lệnh tính toán logic và dịch bit.",
        "tips": "RRC = Rotate Right through Carry -> Lệnh logic và dịch bit.",
        "exp": "Lệnh `RRC A` (Rotate Right through Carry) thực hiện thao tác xoay vòng 9 bit gồm thanh ghi A và cờ nhớ CY sang phải một vị trí bit, do đó thuộc nhóm Lệnh tính toán logic và dịch bit của vi điều khiển 8051."
    },
    16: {
        "clo": "CLO2", "level": "NB", "topic": "Chuyển dữ liệu từ ô nhớ RAM nội vào thanh ghi A", "ans": "A",
        "meth": "Lệnh `MOV A, @R0` sử dụng con trỏ R0 để chuyển byte dữ liệu từ ô nhớ RAM nội vào thanh ghi tích lũy A.",
        "tips": "MOV A, @R0: Đọc RAM nội gián tiếp vào A.",
        "exp": "Để đọc dữ liệu từ một ô nhớ bất kỳ trong bộ nhớ RAM nội vào thanh ghi tích lũy A, vi điều khiển sử dụng chế độ định địa chỉ gián tiếp qua thanh ghi con trỏ R0 thông qua câu lệnh hợp ngữ: `MOV A, @R0`."
    },
    17: {
        "clo": "CLO2", "level": "NB", "topic": "Cú pháp lệnh so sánh rẽ nhánh CJNE", "ans": "D",
        "meth": "Cú pháp chuẩn của lệnh CJNE với địa chỉ trực tiếp: `CJNE A, direct, rel` (ví dụ `CJNE A, 3FH, rel`).",
        "tips": "Cú pháp chuẩn: CJNE A, 3FH, rel.",
        "exp": "Cú pháp hợp lệ của lệnh so sánh nội dung thanh ghi A với một ô nhớ trực tiếp trong tập lệnh 8051 là `CJNE A, direct, rel` (ở đây là `CJNE A, 3FH, rel`): so sánh nội dung thanh ghi A với ô nhớ địa chỉ $3\\text{FH}$, nếu không bằng nhau thì rẽ nhánh tới nhãn `rel`."
    },
    18: {
        "clo": "CLO2", "level": "VD", "topic": "Phép cộng ADD và cập nhật thanh ghi PSW", "ans": "D1",
        "meth": "$A + 90\\text{H} = 94\\text{H} + 6\\text{D}\\text{H} = 101\\text{H} \\implies A = 01\\text{H}, \\text{CY} = 1$. Nibble thấp $4 + \\text{D} = 17 \\implies \\text{AC} = 1$. Dấu $(-108) + (+109) = +1 \\implies \\text{OV} = 0$. $A = 01\\text{H}$ có 1 bit 1 $\\implies \\text{P} = 1$. $\\text{PSW} = 1101\\,0001_2 = \\text{D1H}$.",
        "tips": "Casio 580VNX: 94H + 6DH = 101H -> A = 01H. CY=1, AC=1, RS1=1, P=1 -> PSW = D1H. Điền: D1.",
        "exp": "Thực hiện phép cộng `ADD A, 90H`: $94\\text{H} + 6\\text{D}\\text{H} = 101\\text{H}$. Kết quả byte thấp trong A là $01\\text{H}$ và có nhớ ra ngoài $\\implies \\text{CY} = 1$; chữ số Hex thấp $4 + \\text{D} = 17$ có nhớ sang bit 4 $\\implies \\text{AC} = 1$; phép cộng số bù hai có dấu không gây tràn $\\implies \\text{OV} = 0$; kết quả $01\\text{H}$ chứa đúng 1 bit 1 nên cờ chẵn lẻ $\\text{P} = 1$. Với các bit chọn bank thanh ghi giữ nguyên từ giá trị cũ $55\\text{H}$, thanh ghi trạng thái chương trình sau lệnh là $\\text{PSW} = \\text{D1H}$."
    },
    19: {
        "clo": "CLO2", "level": "VD", "topic": "Tính trạng thái cờ trong lệnh trừ SUBB", "ans": "A",
        "meth": "$45\\text{H} - \\text{ADH} - \\text{CY}(1) = 97\\text{H}$. Có mượn $\\implies \\text{CY} = 1$. $97\\text{H} = 1001\\,0111_2$ có 5 bit 1 (lẻ) $\\implies \\text{P} = 1$.",
        "tips": "CY = 1, P = 1.",
        "exp": "Lệnh `SUBB A, R0` thực hiện: $45\\text{H} - \\text{ADH} - 1 = 97\\text{H}$. Vì số bị trừ $45\\text{H}$ nhỏ hơn số trừ $\\text{ADH}$ nên xuất hiện số mượn $\\implies \\text{CY} = 1$. Kết quả trong A là $97\\text{H} = 1001\\,0111_2$ có tổng cộng 5 bit 1 (số lượng lẻ), do đó cờ Parity được đặt bằng 1 ($\\text{P} = 1$). Kết quả: $\\text{CY} = 1, \\text{P} = 1$."
    },
    20: {
        "clo": "CLO2", "level": "VD", "topic": "Thao tác bit trên thanh ghi cổng P2", "ans": "DA",
        "meth": "$P2 = 5\\text{BH} = 0101\\,1011_2$. Lệnh `CPL P2.0` đổi bit 0 từ 1 sang 0 $\\implies 0101\\,1010_2 = 5\\text{AH}$. Lệnh `SETB P2.7` đặt bit 7 lên 1 $\\implies 1101\\,1010_2 = \\text{DAH}$.",
        "tips": "Casio 580VNX: 5BH -> đảo bit 0 -> 5AH -> bật bit 7 -> DAH. Điền: DA.",
        "exp": "Cổng P2 ban đầu được nạp giá trị $5\\text{BH} = 0101\\,1011_2$. Lệnh `CPL P2.0` đảo bit 0 từ 1 về 0, giá trị trở thành $0101\\,1010_2 = 5\\text{AH}$. Tiếp theo lệnh `SETB P2.7` đặt bit cao nhất lên mức 1, giá trị trở thành $1101\\,1010_2 = \\text{DAH}$."
    },
    21: {
        "clo": "CLO2", "level": "VD", "topic": "Vòng lặp giảm DEC A đến khi bằng 0", "ans": "A",
        "meth": "Lệnh `DEC A` giảm A liên tục cho đến khi $A = 0$ thì lệnh `JNZ LOOP` ngừng nhảy. Kết quả cuối cùng trong A là $00\\text{H}$.",
        "tips": "Vòng lặp giảm tới khi A = 0 thì dừng -> A = 00H.",
        "exp": "Vòng lặp `LOOP: DEC A; JNZ LOOP` liên tục giảm nội dung thanh ghi A đi 1 đơn vị và kiểm tra: nếu A khác 0 thì tiếp tục lặp lại. Vòng lặp chỉ kết thúc khi nội dung thanh ghi A đạt giá trị $00\\text{H}$, do đó sau khi kết thúc chương trình, nội dung trong thanh ghi A là $00\\text{H}$."
    },
    22: {
        "clo": "CLO2", "level": "TH", "topic": "Tra cứu dữ liệu từ bảng tra MOVC A, @A+PC", "ans": "A",
        "meth": "Sử dụng lệnh `MOVC A, @A+PC` để đọc phần tử tương ứng trong bảng số liệu `TAB` được định nghĩa bằng chỉ dẫn `DB`.",
        "tips": "Dùng MOVC tra bảng hằng số -> Tìm giá trị đặt tại bảng tra tương ứng.",
        "exp": "Chương trình con sử dụng chỉ số trong thanh ghi A kết hợp với lệnh đọc bộ nhớ chương trình `MOVC A, @A+PC` để truy xuất vào bảng hằng số `TAB` (bảng bình phương các số từ 0 đến 9), thực hiện chức năng: Tìm giá trị đặt tại bảng tra tương ứng."
    },
    23: {
        "clo": "CLO2", "level": "TH", "topic": "Lệnh đảo 4-bit nibble SWAP A", "ans": "04",
        "meth": "Sau lệnh `SWAP A` giá trị A là $40\\text{H}$. Giá trị ban đầu trước khi tráo nibble là $04\\text{H}$.",
        "tips": "Đảo 4 bit của 40H ra 04H. Điền: 04.",
        "exp": "Lệnh `SWAP A` hoán đổi vị trí của hai chữ số thập lục phân (4 bit cao và 4 bit thấp) trong thanh ghi A. Để thu được kết quả $A = 40\\text{H}$, giá trị ban đầu cần nạp vào thanh ghi A trước khi thực hiện lệnh SWAP là $04\\text{H}$."
    },
    24: {
        "clo": "CLO2", "level": "VD", "topic": "Vòng lặp cộng dồn liên tiếp 10 lần số 2", "ans": "A",
        "meth": "$A = 20 + 10 \\times 2 = 40$ (thập phân). Đổi 40 sang Hex: $40 = 28\\text{H}$.",
        "tips": "20 + 10 x 2 = 40 thập phân = 28H.",
        "exp": "Thanh ghi A được khởi tạo giá trị 20 (thập phân). Vòng lặp `ADD A, #2` được thực hiện đúng 10 lần thông qua thanh ghi đếm R1 (`DJNZ R1, LAP`). Sau 10 lần lặp, nội dung thanh ghi A là $20 + (10 \\times 2) = 40$ thập phân. Đổi sang hệ thập lục phân ta được $28\\text{H}$."
    },
    25: {
        "clo": "CLO2", "level": "TH", "topic": "Thuật toán chuyển đổi nhị phân sang số BCD", "ans": "A",
        "meth": "Chia 100 lấy hàng trăm, chia 10 lấy hàng chục và hàng đơn vị để chuyển số nhị phân 8-bit thành BCD 3 chữ số.",
        "tips": "Chuyển số 8 bit không dấu thành số BCD 3 bit (3 chữ số).",
        "exp": "Đoạn chương trình thực hiện lấy số nguyên không dấu $8\\,\\text{bit}$ tại ô nhớ $20\\text{H}$, chia cho 100 bằng lệnh `DIV AB` để tách chữ số hàng trăm, sau đó tiếp tục chia cho 10 để tách chữ số hàng chục và hàng đơn vị, thực hiện chức năng: Chuyển số $8\\,\\text{bit}$ không dấu đặt tại ô nhớ $20\\text{H}$ thành số BCD 3 chữ số."
    },
    26: {
        "clo": "CLO3", "level": "NB", "topic": "Điều khiển dừng Timer bằng bit TR", "ans": "A",
        "meth": "Để dừng Timer, lập trình viên xóa bit điều khiển chạy TR về 0 (TR = 0).",
        "tips": "Dừng Timer -> Thiết lập bit TR = 0.",
        "exp": "Để điều khiển dừng bộ đếm/định thời Timer trên vi điều khiển 89C51, lập trình viên cần xóa bit điều khiển chạy tương ứng trong thanh ghi TCON về mức 0 (bằng lệnh `CLR TR0` đối với Timer 0 hoặc `CLR TR1` đối với Timer 1, tức $\\text{TR} = 0$)."
    },
    27: {
        "clo": "CLO3", "level": "NB", "topic": "Cấu hình Chế độ 2 cho Timer 1 trong TMOD", "ans": "A",
        "meth": "Chế độ 2 ($8\\,\\text{bit}$ tự động nạp lại) được thiết lập khi bit M1=1 và bit M0=0.",
        "tips": "Chế độ 2: Thiết lập bit M1 và xóa bit M0.",
        "exp": "Để thiết lập bộ định thời Timer 1 hoạt động ở Chế độ 2 (Chế độ tự động nạp lại giá trị ban đầu $8\\,\\text{bit}$), ta cần cấu hình hai bit chọn chế độ của Timer 1 trong thanh ghi TMOD theo tổ hợp: thiết lập bit $\\text{M1} = 1$ và xóa bit $\\text{M0} = 0$."
    },
    28: {
        "clo": "CLO3", "level": "TH", "topic": "Thời gian định thời tối đa Chế độ 0 (13-bit)", "ans": "C",
        "meth": "Chế độ 0 sử dụng 13-bit $\\implies$ đếm tối đa $2^{13} = 8192$ xung. Với $f_{\\text{osc}} = 12\\,\\text{MHz}$ ($1\\,\\mu\\text{s}$/xung) $\\implies T_{\\max} = 8192\\,\\mu\\text{s}$ (hoặc 8192ms theo các phương án đề thi).",
        "tips": "2^13 = 8192 xung -> 8192ms.",
        "exp": "Trong Chế độ 0, Timer hoạt động như một bộ đếm $13\\,\\text{bit}$, số xung đếm tối đa từ $0000\\text{H}$ đến khi tràn là $2^{13} = 8192$ xung nhịp. Giá trị cực đại tương ứng theo phương án đề thi là $8192\\,\\text{ms}$."
    },
    29: {
        "clo": "CLO3", "level": "VD", "topic": "Tính giá trị nạp Timer 1 Chế độ 0", "ans": "A",
        "meth": "Với $f_{\\text{osc}} = 6\\,\\text{MHz}$ ($T_{\\text{cm}} = 2\\,\\mu\\text{s}$), trễ $1\\,\\text{ms} = 1000\\,\\mu\\text{s} \\implies 500$ xung. Giá trị đếm: $8192 - 500 = 7692 = 1\\text{E}0\\text{CH} \\implies \\text{TH1} = 1\\text{EH}, \\text{TL1} = 0\\text{CH}$.",
        "tips": "8192 - 500 = 7692 -> TH1 = 1EH, TL1 = 0CH.",
        "exp": "Với thạch anh $6\\,\\text{MHz}$, chu kỳ máy là $2\\,\\mu\\text{s}$. Để tạo độ trễ $1\\,\\text{ms} = 1000\\,\\mu\\text{s}$, số xung đếm là $N = \\frac{1000}{2} = 500$ xung. Bộ đếm Chế độ 0 có dung lượng cực đại là $8192$, giá trị nạp ban đầu là $8192 - 500 = 7692$. Biểu diễn dạng $13\\,\\text{bit}$: $8$ bit cao nạp vào thanh ghi TH1 là $1\\text{EH}$ và $5$ bit thấp nạp vào TL1 là $0\\text{CH}$."
    },
    30: {
        "clo": "CLO3", "level": "VD", "topic": "Timer tạo sóng vuông chu kỳ 200µs trên chân P1.1", "ans": "A",
        "meth": "$\\text{TH0} = -100 \\implies$ đếm 100 xung $= 100\\,\\mu\\text{s}$ nửa chu kỳ $\\implies$ chu kỳ toàn phần $T = 2 \\times 100\\,\\mu\\text{s} = 200\\,\\mu\\text{s}$.",
        "tips": "Nửa chu kỳ 100µs -> Cả chu kỳ 200µs trên chân P1.1.",
        "exp": "Với thạch anh $12\\,\\text{MHz}$ ($1\\,\\mu\\text{s}$/chu kỳ máy), Timer 0 nạp giá trị $\\text{TH0} = -100$ đếm đúng 100 xung thì tràn, tạo khoảng thời gian trễ nửa chu kỳ là $100\\,\\mu\\text{s}$. Lệnh `CPL P1.1` đảo trạng thái chân cổng tạo ra dạng sóng vuông tuần hoàn có chu kỳ toàn phần $T = 2 \\times 100\\,\\mu\\text{s} = 200\\,\\mu\\text{s}$ trên chân P1.1."
    },
    31: {
        "clo": "CLO3", "level": "NB", "topic": "Thanh ghi đệm dữ liệu nối tiếp SBUF", "ans": "A",
        "meth": "SBUF (Serial Data Buffer) là thanh ghi chuyên dụng lưu dữ liệu cần truyền và dữ liệu nhận được.",
        "tips": "SBUF lưu dữ liệu truyền nhận UART.",
        "exp": "Trên vi điều khiển 89C51, cổng truyền thông nối tiếp sử dụng thanh ghi đệm nối tiếp SBUF (Serial Buffer, địa chỉ $99\\text{H}$) để lưu trữ byte dữ liệu cần truyền đi cũng như byte dữ liệu nhận về."
    },
    32: {
        "clo": "CLO3", "level": "TH", "topic": "Dữ liệu nhận trong thanh ghi SBUF", "ans": "A",
        "meth": "Giá trị trong SBUF là $0\\text{x3E} \\implies$ dữ liệu nhận được qua cổng nối tiếp là $3\\text{EH}$.",
        "tips": "0x3E = 3EH.",
        "exp": "Thanh ghi SBUF lưu giữ byte dữ liệu vừa thu nhận hoàn tất từ đường truyền nối tiếp. Với giá trị đọc ra là $0\\text{x3E}$, dữ liệu nhận được là $3\\text{EH}$."
    },
    33: {
        "clo": "CLO3", "level": "VD", "topic": "Tính tốc độ Baud từ TH1=FAH", "ans": "A",
        "meth": "Với $f_{\\text{osc}} = 11.0592\\,\\text{MHz}$ và $\\text{SMOD}=0$: $\\text{Baud} = \\frac{28800}{256 - \\text{FAH}} = \\frac{28800}{6} = 4800\\,\\text{bps}$.",
        "tips": "28800 / 6 = 4800 bps.",
        "exp": "Với tần số thạch anh $11.0592\\,\\text{MHz}$ và Timer 1 hoạt động ở Chế độ 2 ($SMOD=0$), giá trị nạp $\\text{TH1} = \\text{FAH} = 250$ tạo ra số xung đếm là $256 - 250 = 6$, suy ra tốc độ truyền Baud là $\\text{Baud} = \\frac{28800}{6} = 4800\\,\\text{bps}$."
    },
    34: {
        "clo": "CLO3", "level": "VD", "topic": "Chương trình truyền chuỗi 'KMA' nối tiếp liên tục", "ans": "A",
        "meth": "Mã ASCII: 'K' = 4BH, 'M' = 4DH, 'A' = 41H. Chỉ có phương án A nạp đúng các giá trị này vào SBUF.",
        "tips": "Mã 'K'=4BH, 'M'=4DH, 'A'=41H -> Chọn phương án A.",
        "exp": "Để truyền chuỗi ký tự 'KMA' qua cổng nối tiếp, chương trình phải lần lượt nạp các mã ASCII tương ứng của từng ký tự vào thanh ghi đệm SBUF: ký tự 'K' có mã Hex là $4\\text{BH}$, ký tự 'M' là $4\\text{DH}$, và ký tự 'A' là $41\\text{H}$. Phương án A là chương trình thực hiện chính xác trình tự này."
    },
    35: {
        "clo": "CLO3", "level": "NB", "topic": "Chức năng cờ ngắt nhận dữ liệu RI", "ans": "A",
        "meth": "Cờ RI (Receive Interrupt Flag) trong SCON báo hiệu kết thúc quá trình nhận dữ liệu nối tiếp.",
        "tips": "Cờ RI = Báo hiệu kết thúc quá trình nhận dữ liệu nối tiếp.",
        "exp": "Cờ ngắt RI (Receive Interrupt Flag) nằm tại bit 0 của thanh ghi điều khiển SCON có chức năng báo hiệu kết thúc quá trình nhận dữ liệu nối tiếp: nó được phần cứng tự động bật lên mức 1 ngay khi bit Stop của byte dữ liệu nhận được tiếp nhận hoàn tất."
    },
    36: {
        "clo": "CLO1", "level": "NB", "topic": "Mức ưu tiên cao nhất của tín hiệu Reset", "ans": "A",
        "meth": "Ngắt Reset có mức ưu tiên cao nhất để đảm bảo hệ thống luôn có thể khởi động lại đúng cách và về trạng thái an toàn.",
        "tips": "Đảm bảo hệ thống khởi động lại đúng cách.",
        "exp": "Tín hiệu ngắt Reset được gán mức ưu tiên cao nhất trong toàn bộ hệ thống vi điều khiển để đảm bảo rằng khi hệ thống gặp sự cố treo máy, lỗi phần mềm hoặc khi bắt đầu cấp nguồn, vi điều khiển luôn có thể khởi tạo lại toàn bộ phần cứng về trạng thái an toàn và xác định."
    },
    37: {
        "clo": "CLO3", "level": "TH", "topic": "Thanh ghi mức ưu tiên ngắt IP = 04H", "ans": "B",
        "meth": "$\\text{IP} = 04\\text{H} = 0000\\,0100_2 \\implies$ bit 2 bằng 1. Bit IP.2 là PX1 (ưu tiên ngắt ngoại vi 1).",
        "tips": "IP = 04H -> Bit 2 bật -> Ngắt ngoại vi 1.",
        "exp": "Thanh ghi mức ưu tiên ngắt IP có cấu trúc các bit: bit 0 là PX0 (ngắt ngoài 0), bit 1 là PT0 (ngắt Timer 0), bit 2 là PX1 (ngắt ngoài 1), bit 3 là PT1 (ngắt Timer 1) và bit 4 là PS (ngắt nối tiếp). Khi $\\text{IP} = 04\\text{H} = 0000\\,0100_2$, chỉ có bit 2 (PX1) được bật lên 1, do đó ngắt ngoại vi 1 có mức ưu tiên cao nhất."
    },
    38: {
        "clo": "CLO3", "level": "VD", "topic": "Chương trình ngắt Timer 0 tạo xung vuông chu kỳ 1ms", "ans": "C",
        "meth": "Vector $000B\\text{H}$ phục vụ ngắt Timer 0. Nạp $\\text{FE0CH}$ trễ $500\\,\\mu\\text{s} \\implies T = 2 \\times 500\\,\\mu\\text{s} = 1\\,\\text{ms}$ tại chân P1.0.",
        "tips": "Sử dụng ngắt timer 0 để tạo xung vuông có chu kỳ 1ms tại cổng P1.0.",
        "exp": "Địa chỉ vector $000B\\text{H}$ phục vụ cho ngắt Timer 0. Giá trị nạp $\\text{FE0CH}$ tạo thời gian trễ $500\\,\\mu\\text{s}$, kết hợp lệnh đảo bit `CPL P1.0` tạo ra sóng vuông có chu kỳ toàn phần $T = 2 \\times 500\\,\\mu\\text{s} = 1\\,\\text{ms}$ xuất ra tại cổng P1.0."
    },
    39: {
        "clo": "CLO3", "level": "TH", "topic": "Ngắt ngoài 0 điều khiển nháy LED tại chân P2.0", "ans": "A",
        "meth": "Vector $0003\\text{H}$ là ngắt ngoài 0 (INT0). `SETB IT0` cấu hình kích hoạt theo sườn. CPL P2.0 nháy LED.",
        "tips": "Nháy led tại cổng P2.0 thông qua ngắt ngoài 0 tích cực theo sườn.",
        "exp": "Chương trình cấu hình ngắt ngoài 0 với ISR tại vector $0003\\text{H}$. Lệnh `SETB IT0` thiết lập ngắt cứng ngoài tại chân INT0 kích hoạt theo sườn âm. Mỗi khi có ngắt, chương trình thực hiện đảo trạng thái chân cổng `CPL P2.0` để nháy đèn LED nối tại cổng P2.0."
    },
    40: {
        "clo": "CLO3", "level": "TH", "topic": "Chương trình ngắt UART truyền ký tự 'B' xuất ra P2.0", "ans": "A",
        "meth": "Nạp SBUF = 66 ('B'), xuất A.4 ra P2.0 hiển thị.",
        "tips": "Chương trình ngắt truyền thông để truyền ký tự “B” và đưa ký tự đó ra cổng P2.0 hiển thị.",
        "exp": "Chương trình thực hiện truyền ký tự qua cổng UART với mã số thập phân 66 (tương ứng ký tự chữ cái 'B' in hoa) và đưa trạng thái bit dữ liệu ra chân cổng P2.0 để hiển thị."
    }
}
