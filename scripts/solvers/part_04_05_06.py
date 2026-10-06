import re

# ==============================================================================
# COMPREHENSIVE SOLVER FOR PART 4, PART 5, PART 6 (95 Questions Total)
# Topic: Kiến trúc phần cứng 89C51, Chân vi điều khiển, Cổng I/O, RAM nội & SFR
# ==============================================================================

PART_4_DATA = {
    4: {
        "ans_letter": "B",
        "ans_kw": "4 cổng vào ra p0, p1, p2, p3",
        "exp": "Cấu trúc phần cứng cơ bản của vi điều khiển 89C51 gồm: CPU 8-bit; 4KB bộ nhớ chương trình Flash ROM; 128 byte bộ nhớ dữ liệu RAM nội; 4 cổng vào ra song song 8-bit P0, P1, P2, P3 (tổng cộng 32 chân I/O); 2 bộ đếm/định thời 16-bit Timer 0 & Timer 1; 1 cổng nối tiếp UART; khối điều khiển ngắt với 5 nguồn ngắt (2 ngắt ngoài); và mạch tạo dao động xung nhịp.",
        "meth": "Nắm vững thông số cơ bản 89C51: 4 cổng I/O (P0-P3), 128B RAM, 4KB ROM, 2 Timer, 1 UART, 5 nguồn ngắt.",
        "tips": "Nhớ 4 cổng I/O (P0, P1, P2, P3), loại trừ các đáp án chỉ ghi 2 cổng."
    },
    5: {
        "ans_letter": "D",
        "ans_kw": "bus dữ liệu, bus địa chỉ, bus điều khiển",
        "exp": "Để truyền nhận thông tin giữa CPU, bộ nhớ và các khối ngoại vi, hệ thống bên trong vi điều khiển bao gồm đầy đủ 3 loại bus: Bus dữ liệu (Data bus), Bus địa chỉ (Address bus), và Bus điều khiển (Control bus).",
        "meth": "Bộ ba Bus kinh điển của mọi hệ thống máy tính/vi điều khiển: Địa chỉ - Dữ liệu - Điều khiển.",
        "tips": "Luôn có đủ 3 loại bus: Dữ liệu, Địa chỉ và Điều khiển."
    },
    6: {
        "ans_letter": "D",
        "ans_kw": "64kb",
        "exp": "Thanh ghi con trỏ bộ đếm chương trình PC (Program Counter) của 89C51 có độ dài 16-bit, do đó phạm vi định địa chỉ tối đa cho bộ nhớ chương trình là 2^16 Byte = 65,536 Byte = 64 KB.",
        "meth": "Công thức: Dung lượng = 2^16 Byte = 64 KB.",
        "tips": "PC 16 bit -> Quản lý 64 KB bộ nhớ chương trình."
    },
    7: {
        "ans_letter": "C",
        "ans_kw": "thay đổi nội dung trong thanh ghi con trỏ ngăn xếp, sau đó đưa dữ liệu vào ngăn xếp",
        "exp": "Nguyên lý thao tác ngăn xếp (Stack) trong 8051: Khi thực hiện lệnh cất dữ liệu PUSH, con trỏ ngăn xếp SP được tăng lên 1 trước (SP = SP + 1), sau đó dữ liệu mới được ghi vào ô nhớ do SP trỏ tới. Khi lấy dữ liệu POP, dữ liệu được đọc ra trước rồi SP mới giảm đi 1 (SP = SP - 1).",
        "meth": "Quy tắc PUSH của 8051: Tăng SP trước (Pre-increment) -> Ghi dữ liệu vào RAM nội.",
        "tips": "PUSH = Tăng SP trước rồi mới đưa dữ liệu vào."
    },
    8: {
        "ans_letter": "A",
        "ans_kw": "128, 64",
        "exp": "Họ vi điều khiển 89C51 chuẩn có bộ nhớ dữ liệu tích hợp sẵn trên chip (RAM nội) là 128 byte (địa chỉ 00H - 7FH) và có khả năng mở rộng bộ nhớ dữ liệu ngoài (RAM ngoại) tối đa lên tới 64 KByte nhờ bus địa chỉ 16-bit (P0 và P2).",
        "meth": "Thông số RAM 89C51: RAM nội = 128 Byte; RAM ngoại mở rộng tối đa = 64 KB.",
        "tips": "RAM nội = 128 Byte, RAM ngoại = 64 KB."
    },
    9: {
        "ans_letter": "D",
        "ans_kw": "128 byte ram, 4k byte rom, hai bộ định thời, một cổng nối tiếp và 4 cổng (độ rộng 8 bit) vào ra",
        "exp": "Cấu tạo phần cứng chuẩn của chip 89C51 bao gồm: 128 byte RAM nội, 4KB Flash ROM nội, 2 bộ định thời 16-bit (Timer 0, Timer 1), 1 cổng truyền thông nối tiếp UART và 4 cổng vào ra song song 8-bit (P0, P1, P2, P3).",
        "meth": "Kiểm tra từng thông số: 128 Byte RAM, 4 KB ROM, 2 Timer, 1 UART, 4 cổng 8-bit.",
        "tips": "Chú ý: RAM chỉ có 128 Byte (không phải 128 KB!), 4 cổng đều rộng 8 bit."
    },
    10: {
        "ans_letter": "D",
        "ans_kw": "128 byte",
        "exp": "Dung lượng bộ nhớ dữ liệu RAM tích hợp trực tiếp trên chip vi điều khiển 89C51 là 128 byte, phân bố từ địa chỉ 00H đến 7FH.",
        "meth": "Dung lượng RAM nội chuẩn của 89C51 = 128 Byte.",
        "tips": "RAM nội 89C51 = 128 Byte (89C52 mới là 256 Byte)."
    },
    11: {
        "ans_letter": "D",
        "ans_kw": "64 kb",
        "exp": "Khi sử dụng lệnh MOVX @DPTR, A hoặc MOVX A, @DPTR với con trỏ dữ liệu DPTR 16-bit, chip 89C51 có khả năng truy xuất tối đa 2^16 Byte = 64 KB bộ nhớ dữ liệu ngoài.",
        "meth": "Giới hạn RAM ngoài: 16 đường địa chỉ -> Tối đa 64 KB.",
        "tips": "Bộ nhớ dữ liệu ngoài tối đa = 64 KB."
    },
    12: {
        "ans_letter": "D",
        "ans_kw": "vì chúng thiết kế chương trình để thực hiện nhiệm vụ chuyên dụng",
        "exp": "Vi điều khiển không được gọi là máy tính đa năng (General-Purpose Computer) vì chúng được thiết kế tối ưu hóa phần cứng và phần mềm nhằm thực hiện các nhiệm vụ điều khiển nhúng chuyên dụng (Dedicated/Specific Control Tasks) trong các hệ thống điện tử.",
        "meth": "Phân biệt Vi xử lý đa năng (PC, Laptop) và Vi điều khiển (Thiết bị chuyên dụng).",
        "tips": "Vi điều khiển = Thiết bị điều khiển 'chuyên dụng'."
    },
    13: {
        "ans_letter": "D",
        "ans_kw": "rom",
        "exp": "Các chương trình ứng dụng nhúng của vi điều khiển được lưu trữ trong bộ nhớ chương trình ROM (Flash ROM) để không bị mất đi khi mất nguồn điện và sẵn sàng chạy ngay khi khởi động vi điều khiển.",
        "meth": "Lưu trữ mã chương trình: Luôn luôn trong ROM.",
        "tips": "Chương trình ứng dụng vi điều khiển -> ROM."
    },
    14: {
        "ans_letter": "B",
        "ans_kw": "2",
        "exp": "Vi điều khiển 89C51 có đúng 2 thanh ghi 16-bit là: Bộ đếm chương trình PC (Program Counter) và Con trỏ dữ liệu DPTR (Data Pointer, ghép từ DPH và DPL). Tất cả các thanh ghi còn lại (A, B, PSW, SP, P0-P3, TCON, TMOD...) đều là 8-bit.",
        "meth": "Hai thanh ghi 16-bit duy nhất của 89C51: PC (16 bit) và DPTR (16 bit).",
        "tips": "Số thanh ghi 16-bit = 2 (PC và DPTR)."
    },
    15: {
        "ans_letter": "B",
        "ans_kw": "máy in",
        "exp": "Vi điều khiển tích hợp trên chip gồm: Bộ vi xử lý (CPU/ALU), bộ nhớ RAM/ROM, tập thanh ghi, bộ định thời và các cổng vào ra I/O. Máy in là một thiết bị ngoại vi độc lập bên ngoài, không phải là thành phần cấu tạo nên vi điều khiển.",
        "meth": "Loại trừ thiết bị ngoại vi bên ngoài: Máy in.",
        "tips": "Máy in nằm ngoài vi điều khiển."
    },
    16: {
        "ans_letter": "A",
        "ans_kw": "kiến trúc havard và tập lệnh cisc",
        "exp": "Họ vi điều khiển 8051 sử dụng Kiến trúc Harvard (tách biệt hoàn toàn không gian bộ nhớ chương trình ROM và bộ nhớ dữ liệu RAM với các bus riêng biệt) và Tập lệnh phức CISC (Complex Instruction Set Computer với nhiều chế độ định địa chỉ đa dạng).",
        "meth": "Đặc trưng kiến trúc 8051: Harvard Architecture + CISC.",
        "tips": "8051 = Kiến trúc Harvard + Tập lệnh CISC."
    },
    17: {
        "ans_letter": "B",
        "ans_kw": "12",
        "exp": "Trong kiến trúc kinh điển của vi điều khiển họ 8051, một chu kỳ máy (Machine Cycle) bao gồm đúng 12 chu kỳ dao động xung nhịp (Clock/Oscillator Cycles), tương ứng 6 trạng thái S1 đến S6 (mỗi trạng thái gồm 2 pha P1, P2).",
        "meth": "Định lượng: 1 Chu kỳ máy (Machine Cycle) = 12 chu kỳ xung nhịp (Clock Periods).",
        "tips": "1 chu kỳ máy = 12 chu kỳ xung."
    },
    18: {
        "ans_letter": "A",
        "ans_kw": "2",
        "exp": "Chip vi điều khiển 89C51 có sẵn 2 bộ đếm/định thời 16-bit độc lập trên chip là Timer 0 (gồm TL0, TH0) và Timer 1 (gồm TL1, TH1).",
        "meth": "Số lượng Timer của 89C51: 2 bộ (Timer 0 và Timer 1).",
        "tips": "89C51 có 2 Timer (Timer 0 và Timer 1)."
    },
    19: {
        "ans_letter": "A",
        "ans_kw": "64 kb",
        "exp": "Nhờ thanh ghi PC 16-bit và chân điều khiển PSEN, vi điều khiển 89C51 có khả năng truy xuất tối đa 2^16 Byte = 64 KB bộ nhớ chương trình ngoài.",
        "meth": "Bộ nhớ chương trình ngoài tối đa: 64 KB.",
        "tips": "Bộ nhớ chương trình ngoài tối đa = 64 KB."
    },
    20: {
        "ans_letter": "A",
        "ans_kw": "8, 40",
        "exp": "Vi điều khiển 89C51 là vi điều khiển xử lý 8-bit, được đóng vỏ tiêu chuẩn theo chuẩn 40 chân DIP (Dual Inline Package - hàng chân kép 2 bên).",
        "meth": "Thông số đóng gói: Vi điều khiển 8-bit, vỏ 40 chân DIP.",
        "tips": "8-bit, 40 chân DIP."
    },
    21: {
        "ans_letter": "A",
        "ans_kw": "cpu chỉ có thể làm việc với 8 bit dữ liệu tại một thời điểm",
        "exp": "Một bộ vi xử lý/vi điều khiển được gọi là '8 bit' nghĩa là khối tính toán ALU và các thanh ghi tích lũy dữ liệu chính của nó xử lý các toán hạng có độ rộng 8 bit song song trong một chu kỳ tính toán.",
        "meth": "Khái niệm CPU 8-bit: Độ rộng từ dữ liệu ALU xử lý là 8-bit.",
        "tips": "CPU 8-bit = Làm việc với 8 bit dữ liệu tại một thời điểm."
    },
    22: {
        "ans_letter": "D",
        "ans_kw": "1",
        "exp": "Với tần số thạch anh f_osc = 12 MHz, chu kỳ dao động xung nhịp là T_osc = 1 / 12 MHz = 1/12 µs. Một chu kỳ máy gồm 12 chu kỳ dao động, nên T_cm = 12 x (1/12 µs) = 1 µs.",
        "meth": "Công thức chu kỳ máy: T_cm = 12 / f_osc. Với f = 12 MHz -> T_cm = 12 / 12 = 1 µs.",
        "tips": "Thạch anh 12 MHz -> Chu kỳ máy đúng bằng 1 µs!"
    },
    23: {
        "ans_letter": "A",
        "ans_kw": "cpu, ram, rom, cổng i/o và các bộ đếm/định thời",
        "exp": "Khác với vi xử lý đơn thuần, một chip vi điều khiển tích hợp hoàn chỉnh một hệ thống máy tính thu nhỏ gồm: CPU, bộ nhớ RAM, bộ nhớ ROM, các cổng vào ra I/O và các bộ định thời/bộ đếm.",
        "meth": "Đặc trưng vi điều khiển: Tích hợp đầy đủ CPU, RAM, ROM, I/O và Timer.",
        "tips": "Phương án đầy đủ nhất: CPU, RAM, ROM, cổng I/O và các bộ đếm/định thời."
    },
    24: {
        "ans_letter": "B",
        "ans_kw": "4kb",
        "exp": "Chip vi điều khiển chuẩn AT89C51 của hãng Atmel được tích hợp sẵn 4 Kilobyte (4KB) bộ nhớ Flash ROM trên chip dùng để nạp chương trình.",
        "meth": "Dung lượng ROM nội 89C51: 4 KB Flash ROM.",
        "tips": "89C51 = 4 KB ROM (89C52 là 8 KB ROM)."
    }
}

PART_5_DATA = {
    4: {
        "ans_letter": "D",
        "ans_kw": "vi điều khiển cho phép truy xuất đọc bộ nhớ chương trình bên ngoài",
        "exp": "Chân PSEN (Program Store Enable) là tín hiệu điều khiển tích cực mức thấp (PSEN=0), được kích hoạt trong các chu kỳ đọc lệnh từ bộ nhớ chương trình ROM ngoài để cho phép xuất mã lệnh lên Data Bus.",
        "meth": "Tín hiệu PSEN=0: Cho phép đọc mã lệnh từ ROM ngoài.",
        "tips": "PSEN = 0 -> Đọc bộ nhớ chương trình bên ngoài."
    },
    5: {
        "ans_letter": "C",
        "ans_kw": "cần phải ghi „1‟ vào các cổng p0 – p3",
        "exp": "Các cổng I/O của 89C51 là cổng chuẩn hai chiều bán giả lập (Quasi-bidirectional). Khi muốn sử dụng một chân cổng làm cổng ĐẦU VÀO (Input), lập trình viên bắt buộc phải ghi mức logic '1' vào chốt cổng tương ứng để khóa transistor kéo xuống, cho phép mạch ngoài kéo chân lên hoặc xuống.",
        "meth": "Quy tắc cổng vào ra 8051: Muốn làm đầu vào -> Ghi '1' vào chốt cổng.",
        "tips": "Cổng làm đầu vào -> Bắt buộc GHI '1'."
    },
    6: {
        "ans_letter": "A",
        "ans_kw": "p0",
        "exp": "Cổng P0 có cấu trúc ngõ ra cực máng hở (Open-drain) không có sẵn điện trở kéo lên nội (Pull-up Resistor) như P1, P2, P3. Vì vậy, khi sử dụng P0 làm cổng vào ra thông thường thì bắt buộc phải gắn thêm một mạng điện trở kéo lên (thường là thanh trở 10k) bên ngoài.",
        "meth": "Cổng máng hở cần trở kéo ngoài: Duy nhất cổng P0.",
        "tips": "Cổng cần điện trở kéo lên bên ngoài = P0."
    },
    7: {
        "ans_letter": "B",
        "ans_kw": "cho phép truy xuất (sử dụng) bộ nhớ chương trình bên ngoài",
        "exp": "Chân EA (External Access) là chân điều khiển truy xuất bộ nhớ ngoài: Khi EA=0 (nối GND), CPU chỉ truy xuất mã lệnh từ ROM ngoài; khi EA=1 (nối VCC), CPU thực thi trong ROM nội trước rồi mới ra ROM ngoài.",
        "meth": "Chức năng chân EA: Cho phép truy xuất/lựa chọn bộ nhớ chương trình ngoài.",
        "tips": "EA (External Access) -> Cho phép truy xuất bộ nhớ chương trình ngoài."
    },
    8: {
        "ans_letter": "A",
        "ans_kw": "thiết lập lên 1 cho cổng tương ứng",
        "exp": "Để cấu hình bất kỳ cổng nào (P0, P1, P2, P3) làm đầu vào nhận tín hiệu, thao tác phần mềm bắt buộc là ghi thiết lập bit '1' vào cổng đó (ví dụ: MOV P1, #0FFH).",
        "meth": "Cấu hình đầu vào: Thiết lập bit 1 cho cổng.",
        "tips": "Đầu vào -> Thiết lập lên 1."
    },
    9: {
        "ans_letter": "B",
        "ans_kw": "p3",
        "exp": "Cổng P3 là cổng đa năng đặc biệt: Mỗi chân của P3 đều có chức năng phụ mang tín hiệu điều khiển và giao tiếp (P3.0/RxD, P3.1/TxD, P3.2/INT0, P3.3/INT1, P3.4/T0, P3.5/T1, P3.6/WR, P3.7/RD).",
        "meth": "Cổng có chức năng phụ tín hiệu điều khiển: P3.",
        "tips": "Các tín hiệu điều khiển RD, WR, ngắt... thuộc Port 3 (P3)."
    },
    10: {
        "ans_letter": "A",
        "ans_kw": "cho phép truy xuất (đọc) bộ nhớ chương trình bên ngoài",
        "exp": "PSEN (Program Store Enable) là tín hiệu điều khiển cho phép đọc dữ liệu/mã lệnh từ bộ nhớ chương trình ROM bên ngoài khi ở mức tích cực thấp.",
        "meth": "PSEN = Đọc bộ nhớ chương trình (ROM) ngoài.",
        "tips": "PSEN -> Cho phép đọc ROM ngoài."
    },
    11: {
        "ans_letter": "B",
        "ans_kw": "p0, p1, p2, p3",
        "exp": "Vi điều khiển 89C51 có 4 cổng vào ra song song 8-bit là P0, P1, P2 và P3 (tương ứng 32 chân từ tổng số 40 chân của IC).",
        "meth": "Bốn cổng I/O song song của 89C51: P0, P1, P2, P3.",
        "tips": "Cổng vào ra = P0, P1, P2, P3."
    },
    12: {
        "ans_letter": "B",
        "ans_kw": "p2",
        "exp": "Khi ghép nối mở rộng bộ nhớ ngoài, cổng P2 đóng vai trò là bus địa chỉ byte cao A8 - A15 (chân 21 đến chân 28).",
        "meth": "Phân chia bus địa chỉ ngoài: P0 = Byte thấp A0-A7; P2 = Byte cao A8-A15.",
        "tips": "Bus địa chỉ byte cao = Cổng P2."
    },
    13: {
        "ans_letter": "C",
        "ans_kw": "p0 và p2",
        "exp": "Khi mở rộng bộ nhớ ngoài 16-bit địa chỉ, cổng P0 cung cấp 8 bit địa chỉ thấp (A0-A7) và cổng P2 cung cấp 8 bit địa chỉ cao (A8-A15), ghép lại thành bus địa chỉ 16 bit quản lý 64KB không gian nhớ.",
        "meth": "Bus địa chỉ 16 bit ngoài: Ghép từ P0 và P2.",
        "tips": "16 bit địa chỉ = P0 kết hợp P2."
    },
    14: {
        "ans_letter": "C",
        "ans_kw": "cho phép thiết lập lại chế độ hoạt động cuả chip 89c51",
        "exp": "Chân RST (Reset) là chân ngõ vào khởi động lại chip: Khi đưa tín hiệu mức cao vào chân RST, chip 89C51 sẽ thiết lập lại toàn bộ thanh ghi nội về trạng thái ban đầu mặc định (Reset).",
        "meth": "Chức năng chân RST: Thiết lập lại hoạt động của vi điều khiển.",
        "tips": "RST = Reset -> Thiết lập lại trạng thái ban đầu."
    },
    15: {
        "ans_letter": "C",
        "ans_kw": "vi điều khiển chỉ truy xuất các lệnh trong bộ nhớ chương trình bên ngoài",
        "exp": "Khi chân EA được nối đất (EA = 0), vi điều khiển 89C51 sẽ bỏ qua hoàn toàn bộ nhớ ROM nội và chỉ thực hiện các lệnh nạp từ bộ nhớ chương trình bên ngoài (bắt đầu từ địa chỉ 0000H của ROM ngoại).",
        "meth": "EA = 0: Chỉ truy xuất ROM ngoài.",
        "tips": "EA = 0 -> Chỉ dùng ROM ngoài."
    },
    16: {
        "ans_letter": "C",
        "ans_kw": "12 mhz",
        "exp": "Tần số thạch anh phổ dụng tiêu chuẩn cho các mạch học tập và giảng dạy họ MCS-51 là 12 MHz (cho chu kỳ máy chẵn đúng 1 µs) hoặc 11.0592 MHz (khi cần tạo tốc độ Baud chuẩn cho cổng nối tiếp).",
        "meth": "Tần số thạch anh phổ dụng trong giáo trình: 12 MHz.",
        "tips": "Thạch anh chuẩn học tập = 12 MHz."
    },
    17: {
        "ans_letter": "A",
        "ans_kw": "p1",
        "exp": "Trong 4 cổng I/O của 89C51, cổng P1 là cổng duy nhất chỉ thuần túy làm chức năng vào ra cơ bản (General Purpose I/O), không bị kiêm nhiệm các chức năng bus đa hợp địa chỉ/dữ liệu hay tín hiệu điều khiển như P0, P2, P3.",
        "meth": "Cổng thuần I/O không có chức năng phụ: Cổng P1.",
        "tips": "Cổng vào ra cơ bản thuần túy = P1."
    },
    18: {
        "ans_letter": "C",
        "ans_kw": "cao, 2",
        "exp": "Để thực hiện Reset thành công vi điều khiển 89C51, chân RST phải được đặt ở mức điện áp cao (+5V) trong thời gian tối thiểu là 2 chu kỳ máy liên tiếp.",
        "meth": "Điều kiện Reset 8051: Mức CAO, tối thiểu 2 chu kỳ máy.",
        "tips": "Reset 8051: Mức CAO (High), ít nhất 2 chu kỳ máy."
    },
    19: {
        "ans_letter": "C",
        "ans_kw": "a0..a15",
        "exp": "Các đường tín hiệu bus địa chỉ A0 đến A15 được CPU sử dụng để truyền mã địa chỉ nhằm xác định vị trí của từng ô nhớ trong không gian nhớ 64KB.",
        "meth": "Xác định vị trí ô nhớ: Các đường địa chỉ A0..A15.",
        "tips": "Vị trí ô nhớ -> Đường địa chỉ A0..A15."
    },
    20: {
        "ans_letter": "A",
        "ans_kw": "rst",
        "exp": "Khi chân tín hiệu RST duy trì trạng thái mức cao trong ít nhất 2 chu kỳ máy, vi điều khiển sẽ được reset về trạng thái ban đầu của hệ thống (PC=0000H).",
        "meth": "Tín hiệu Reset: Chân RST.",
        "tips": "Điện thế cao 2 chu kỳ máy để đặt lại -> Chân RST."
    },
    21: {
        "ans_letter": "A",
        "ans_kw": "60kb",
        "exp": "Khi chân EA = 1 (nối VCC), 89C51 sử dụng 4KB ROM nội (từ 0000H đến 0FFFH), phần không gian địa chỉ còn lại của bộ nhớ chương trình từ 1000H đến FFFFH (chiếm 64KB - 4KB = 60KB) có thể mở rộng bằng ROM ngoài.",
        "meth": "Công thức mở rộng khi EA=1: 64KB - 4KB (ROM nội) = 60KB ROM ngoài.",
        "tips": "EA = 1 -> Mở rộng ROM ngoài tối đa 60 KB."
    },
    22: {
        "ans_letter": "B",
        "ans_kw": "đọc tín hiệu địa chỉ thấp từ cổng p0",
        "exp": "Tín hiệu ALE (Address Latch Enable) phát xung dương để kích hoạt chốt 8-bit (như IC 74HC573) tách và giữ lại 8 bit địa chỉ byte thấp (A0-A7) đang xuất hiện trên cổng P0.",
        "meth": "Tác dụng của ALE: Cho phép chốt địa chỉ byte thấp từ cổng P0.",
        "tips": "ALE kích hoạt -> Chốt địa chỉ thấp từ P0."
    },
    23: {
        "ans_letter": "B",
        "ans_kw": "ea",
        "exp": "Khi chân EA ở mức cao (+5V), CPU sẽ thực thi chương trình trong ROM nội trước (0000H-0FFFH), nếu địa chỉ vượt quá 4KB sẽ tự động giao tiếp với ROM ngoại.",
        "meth": "EA mức cao: Giao tiếp cả ROM nội và ROM ngoại.",
        "tips": "Mức cao giao tiếp cả nội và ngoại -> Chân EA."
    },
    24: {
        "ans_letter": "A",
        "ans_kw": "(c) p0[0..7]",
        "exp": "Trong 89C51, cổng P0 là cổng đa hợp (multiplexed bus): Vừa đóng vai trò là bus địa chỉ byte thấp (A0-A7) vừa là bus dữ liệu 8-bit (D0-D7), ký hiệu chung là AD0-AD7.",
        "meth": "Cổng đa hợp phân chia theo thời gian (Multiplex): Cổng P0.",
        "tips": "Cổng đa hợp AD0-AD7 = Cổng P0."
    },
    25: {
        "ans_letter": "A",
        "ans_kw": "2 mhz",
        "exp": "Trong 8051, tần số xung tại chân ALE bằng 1/6 tần số xung dao động của thạch anh: f_ALE = f_osc / 6. Khi f_osc = 12 MHz thì f_ALE = 12 / 6 = 2 MHz.",
        "meth": "Công thức tần số ALE: f_ALE = f_osc / 6. Với 12 MHz -> 12 / 6 = 2 MHz.",
        "tips": "Tần số ALE = f_osc / 6 = 12 / 6 = 2 MHz."
    },
    26: {
        "ans_letter": "C",
        "ans_kw": "cho phép chốt địa chỉ để thực hiện việc giải đa hợp",
        "exp": "ALE (Address Latch Enable - Cho phép chốt địa chỉ) là tín hiệu điều khiển dùng để phát xung chốt địa chỉ byte thấp đưa vào IC chốt 74HC573 nhằm giải đa hợp cổng P0 thành bus địa chỉ A0-A7 riêng và bus dữ liệu D0-D7 riêng.",
        "meth": "Định nghĩa ALE: Tín hiệu cho phép chốt địa chỉ giải đa hợp P0.",
        "tips": "ALE = Address Latch Enable -> Cho phép chốt địa chỉ."
    },
    27: {
        "ans_letter": "C",
        "ans_kw": "p0, p2, p3",
        "exp": "Các cổng P0, P2, P3 đều có 2 công dụng: P0 (I/O và AD0-AD7), P2 (I/O và A8-A15), P3 (I/O và các tín hiệu điều khiển ngắt/timer/nối tiếp). Chỉ có P1 là cổng đơn công dụng.",
        "meth": "Cổng có hai công dụng: P0, P2, P3. Cổng một công dụng: P1.",
        "tips": "3 cổng có 2 công dụng = P0, P2, P3."
    },
    28: {
        "ans_letter": "D",
        "ans_kw": "nối với bộ dao động ngoài",
        "exp": "Hai chân XTAL1 và XTAL2 của vi điều khiển 89C51 được sử dụng để kết nối với bộ dao động thạch anh và hai tụ gốm tạo xung nhịp đồng hồ cho CPU hoạt động.",
        "meth": "Chân XTAL1, XTAL2: Nối với thạch anh / bộ dao động.",
        "tips": "XTAL1, XTAL2 -> Nối bộ dao động ngoài (Crystal)."
    },
    29: {
        "ans_letter": "A",
        "ans_kw": "not(oe)",
        "exp": "Chân PSEN của 89C51 là chân tín hiệu cho phép đọc ROM ngoài, vì vậy nó luôn được nối trực tiếp vào chân /OE (Output Enable - cho phép xuất ngõ ra) của chip EPROM/Flash ROM bên ngoài.",
        "meth": "Ghép nối PSEN: PSEN nối với chân /OE của chip nhớ ROM ngoài.",
        "tips": "PSEN nối với Not(OE) của ROM ngoài."
    },
    30: {
        "ans_letter": "D",
        "ans_kw": "4",
        "exp": "Vi điều khiển 89C51 có đúng 4 cổng vào ra dữ liệu song song 8-bit: P0, P1, P2 và P3.",
        "meth": "Số cổng song song: 4 cổng.",
        "tips": "89C51 có 4 cổng song song (P0-P3)."
    },
    31: {
        "ans_letter": "B",
        "ans_kw": "cổng p0 truyền 8 bit tín hiệu địa chỉ",
        "exp": "Khi chân tín hiệu ALE ở mức cao ('1'), cổng P0 đang xuất 8-bit tín hiệu địa chỉ byte thấp (A0-A7) để đưa vào IC chốt trước khi chuyển sang pha truyền nhận dữ liệu.",
        "meth": "ALE = 1: Cổng P0 làm bus địa chỉ.",
        "tips": "ALE = 1 -> Cổng P0 truyền tín hiệu địa chỉ."
    },
    32: {
        "ans_letter": "C",
        "ans_kw": "xtal1",
        "exp": "Khi sử dụng nguồn xung clock TTL bên ngoài đưa vào chip 89C51, tín hiệu xung clock ngoài bắt buộc phải đưa vào chân XTAL1, trong khi chân XTAL2 để hở (không nối).",
        "meth": "Đưa xung ngoài vào 89C51: Nối xung vào chân XTAL1, bỏ trống XTAL2.",
        "tips": "Nguồn xung ngoài đưa vào chân XTAL1."
    },
    33: {
        "ans_letter": "C",
        "ans_kw": "vi điều khiển sẽ thực hiện chương trình trong bộ nhớ chương trình bên trong",
        "exp": "Khi vi điều khiển thực thi chương trình trong ROM nội, chân PSEN không được tích cực (ở mức cao PSEN=1), báo hiệu không truy xuất ROM ngoại.",
        "meth": "PSEN = 1: Không đọc ROM ngoài, thực thi chương trình nội.",
        "tips": "PSEN = 1 -> Thực hiện chương trình trong ROM nội."
    },
    34: {
        "ans_letter": "A",
        "ans_kw": "p0",
        "exp": "Khi sử dụng bộ nhớ ngoài, cổng P0 đóng vai trò là bus đa hợp địa chỉ byte thấp và bus dữ liệu (AD0 đến AD7).",
        "meth": "Bus AD0..AD7: Cổng P0.",
        "tips": "AD0..AD7 = Cổng P0."
    }
}

PART_6_DATA = {
    4: {
        "ans_letter": "B",
        "ans_kw": "60h",
        "exp": "Thao tác đưa dữ liệu vào ngăn xếp (PUSH) trong 8051 thực hiện tăng SP trước rồi mới ghi dữ liệu: SP = SP + 1. Do đó khi SP đang có giá trị 5FH, byte dữ liệu đầu tiên cất vào ngăn xếp sẽ được lưu tại địa chỉ 5FH + 1 = 60H.",
        "meth": "Quy tắc PUSH: Địa chỉ bắt đầu = SP ban đầu + 1. 5FH + 1 = 60H.",
        "tips": "Ngăn xếp bắt đầu từ: SP + 1 = 5FH + 1 = 60H."
    },
    5: {
        "ans_letter": "C",
        "ans_kw": "0000h",
        "exp": "Sau khi được Reset, thanh ghi bộ đếm chương trình PC của 89C51 tự động được nạp giá trị 0000H. Do đó CPU luôn bắt đầu thực hiện lệnh đầu tiên từ địa chỉ 0000H trong bộ nhớ chương trình.",
        "meth": "Địa chỉ Vector Reset của 8051: 0000H.",
        "tips": "Sau reset, CPU luôn bắt đầu từ 0000H."
    },
    6: {
        "ans_letter": "A",
        "ans_kw": "d0h",
        "exp": "Thanh ghi trạng thái chương trình PSW (Program Status Word) nằm trong vùng nhớ thanh ghi chức năng đặc biệt SFR tại địa chỉ D0H.",
        "meth": "Địa chỉ SFR của PSW: D0H.",
        "tips": "Địa chỉ PSW = D0H."
    },
    7: {
        "ans_letter": "C",
        "ans_kw": "scon, ie, ip",
        "exp": "Trong 8051, một thanh ghi SFR có thể định địa chỉ bit khi địa chỉ của nó chia hết cho 8 (có chữ số tận cùng là 0 hoặc 8). SCON (98H), IE (A8H), IP (B8H) đều có đuôi 8 nên đều định địa chỉ theo từng bit được.",
        "meth": "Quy tắc định địa chỉ bit SFR: Địa chỉ tận cùng là 0H hoặc 8H. SCON (98H), IE (A8H), IP (B8H).",
        "tips": "Nhóm định địa chỉ bit: SCON (98H), IE (A8H), IP (B8H)."
    },
    8: {
        "ans_letter": "B",
        "ans_kw": "rs0=0, rs1=1",
        "exp": "Hai bit RS1 và RS0 trong thanh ghi PSW dùng để chọn băng thanh ghi (Register Bank): Bank 0 (RS1=0, RS0=0); Bank 1 (RS1=0, RS0=1); Bank 2 (RS1=1, RS0=0); Bank 3 (RS1=1, RS0=1). Để chọn Bank 2 thì RS1=1 và RS0=0.",
        "meth": "Bảng chọn Bank: Băng 2 có mã nhị phân 10 (RS1=1, RS0=0).",
        "tips": "Băng 2: RS1 = 1, RS0 = 0."
    },
    9: {
        "ans_letter": "C",
        "ans_kw": "08h",
        "exp": "Sau khi Reset, thanh ghi SP tự động nhận giá trị mặc định là 07H. Khi có thao tác ghi vào ngăn xếp đầu tiên, SP tăng lên 1 (07H + 1 = 08H), vì vậy vùng nhớ thực tế của ngăn xếp bắt đầu từ địa chỉ 08H trong RAM nội.",
        "meth": "Ngăn xếp mặc định: SP khởi tạo = 07H -> Địa chỉ dữ liệu đầu tiên cất vào = 08H.",
        "tips": "Ngăn xếp bắt đầu từ ô nhớ 08H."
    },
    10: {
        "ans_letter": "C",
        "ans_kw": "cờ p_ cờ chẵn lẻ",
        "exp": "Bit PSW.0 (bit thứ 0 của thanh ghi PSW) là cờ Parity P (cờ chẵn lẻ), tự động bằng 1 nếu số bit 1 trong thanh ghi tích lũy A là lẻ và bằng 0 nếu là chẵn.",
        "meth": "Cấu trúc PSW: PSW.0 = P (Parity Flag).",
        "tips": "PSW.0 = Cờ P (Chẵn lẻ)."
    },
    11: {
        "ans_letter": "B",
        "ans_kw": "00h",
        "exp": "Khi vi điều khiển 89C51 bị Reset, toàn bộ các bit trong thanh ghi PSW đều bị xóa về 0, do đó giá trị của PSW sau reset là 00H (chọn Bank 0, các cờ CY=0, AC=0, OV=0).",
        "meth": "Giá trị sau Reset: PSW = 00H.",
        "tips": "Reset -> PSW = 00H."
    },
    12: {
        "ans_letter": "B",
        "ans_kw": "82h",
        "exp": "Con trỏ dữ liệu DPTR 16-bit gồm 2 byte: DPL tại địa chỉ 82H và DPH tại địa chỉ 83H trong vùng SFR. Địa chỉ đại diện byte thấp của DPTR là 82H.",
        "meth": "Địa chỉ DPTR trong SFR: DPL = 82H, DPH = 83H.",
        "tips": "Địa chỉ DPTR: 82H (DPL)."
    },
    13: {
        "ans_letter": "B",
        "ans_kw": "pc có địa chỉ trên vùng ram của các thanh ghi đặc biệt là 90h",
        "exp": "Bộ đếm chương trình PC là một thanh ghi phần cứng độc lập 16-bit, KHÔNG nằm trong không gian địa chỉ SFR của RAM nội. Địa chỉ 90H trong SFR thực tế là địa chỉ của cổng P1. Vì vậy phát biểu 'PC có địa chỉ 90H' là SAI.",
        "meth": "Đặc tính PC: PC không có địa chỉ trong vùng RAM nội/SFR.",
        "tips": "PC hoàn toàn không có địa chỉ SFR!"
    },
    14: {
        "ans_letter": "A",
        "ans_kw": "p0~p3, ip, tcon",
        "exp": "Các thanh ghi có địa chỉ tận cùng là 0 hoặc 8 đều định địa chỉ bit được: P0 (80H), P1 (90H), P2 (A0H), P3 (B0H), IP (B8H), TCON (88H).",
        "meth": "Nhóm định địa chỉ bit: P0-P3, IP, TCON, SCON, IE, PSW, ACC, B.",
        "tips": "P0~P3, IP, TCON đều định địa chỉ bit được."
    },
    15: {
        "ans_letter": "A",
        "ans_kw": "mov sp, #48h",
        "exp": "Vì lệnh PUSH tăng SP trước rồi mới ghi dữ liệu vào ngăn xếp, muốn dữ liệu đầu tiên nằm tại địa chỉ 49H thì giá trị ban đầu nạp vào SP phải là 49H - 1 = 48H: lệnh MOV SP, #48H.",
        "meth": "Công thức nạp SP: Giá trị nạp SP = Địa chỉ mong muốn - 1 = 49H - 1 = 48H.",
        "tips": "Muốn bắt đầu tại 49H -> Nạp SP = 48H."
    },
    16: {
        "ans_letter": "D",
        "ans_kw": "rs0=0, rs1=0",
        "exp": "Băng thanh ghi 0 (Bank 0, chiếm địa chỉ 00H - 07H) được chọn khi cả hai bit chọn băng đều bằng 0: RS1 = 0 và RS0 = 0.",
        "meth": "Băng 0: RS1 = 0, RS0 = 0.",
        "tips": "Băng 0 -> RS1 = 0, RS0 = 0."
    },
    17: {
        "ans_letter": "B",
        "ans_kw": "4, 1",
        "exp": "89C51 gồm 4 cổng I/O song song P0 - P3. Khi muốn cấu hình các chân cổng này làm cổng đầu vào, ta cần ghi giá trị bit '1' vào chân cổng tương ứng.",
        "meth": "Số cổng = 4; Giá trị ghi để làm đầu vào = 1.",
        "tips": "4 cổng, ghi giá trị 1 để làm đầu vào."
    },
    18: {
        "ans_letter": "D",
        "ans_kw": "băng 3",
        "exp": "Giá trị PSW = 18H đổi sang nhị phân là 0001_1000b. Quan sát bit 4 và bit 3 (RS1 và RS0): RS1 = 1, RS0 = 1. Đây là mã chọn Băng 3 (Bank 3, địa chỉ 18H - 1FH).",
        "meth": "Phân tích bit: PSW = 18H -> RS1=1, RS0=1 -> Băng 3.",
        "tips": "PSW = 18H -> Băng 3 (chính là địa chỉ bắt đầu của Băng 3: 18H-1FH)."
    },
    19: {
        "ans_letter": "C",
        "ans_kw": "psw.6",
        "exp": "Cờ nhớ phụ AC (Auxiliary Carry) nằm tại bit thứ 6 của thanh ghi trạng thái chương trình PSW (ký hiệu PSW.6).",
        "meth": "Thứ tự PSW: CY(7) - AC(6) - F0(5) - RS1(4) - RS0(3) - OV(2) - Dự trữ(1) - P(0).",
        "tips": "Cờ AC = PSW.6."
    },
    20: {
        "ans_letter": "C",
        "ans_kw": "3fh",
        "exp": "Để vùng nhớ của ngăn xếp bắt đầu lưu dữ liệu từ ô nhớ 40H, ta cần nạp cho con trỏ ngăn xếp SP giá trị: SP = 40H - 1 = 3FH.",
        "meth": "Công thức: SP = Địa chỉ đầu tiên - 1 = 40H - 1 = 3FH.",
        "tips": "Bắt đầu tại 40H -> SP = 3FH."
    },
    21: {
        "ans_letter": "A",
        "ans_kw": "5ah",
        "exp": "Khi SP đang giữ giá trị 59H, thao tác cất dữ liệu PUSH tiếp theo sẽ tăng SP lên 1: 59H + 1 = 5AH, do đó dữ liệu ngăn xếp sẽ bắt đầu được lưu tại địa chỉ 5AH.",
        "meth": "Địa chỉ bắt đầu = SP + 1 = 59H + 1 = 5AH.",
        "tips": "59H + 1 = 5AH."
    },
    22: {
        "ans_letter": "D",
        "ans_kw": "thanh ghi trạng thái chương trình psw",
        "exp": "Cờ nhớ CY (Carry Flag) là bit cao nhất (bit 7) nằm bên trong Thanh ghi trạng thái chương trình PSW (PSW.7).",
        "meth": "Vị trí cờ CY: Nằm trong thanh ghi PSW.",
        "tips": "Cờ nhớ CY nằm ở thanh ghi PSW."
    },
    23: {
        "ans_letter": "C",
        "ans_kw": "ov_cờ tràn",
        "exp": "Bit PSW.2 là cờ báo tràn số có dấu OV (Overflow Flag), báo hiệu kết quả phép tính số học có dấu vượt quá phạm vi biểu diễn của 8-bit (-128 đến +127).",
        "meth": "PSW.2 = Cờ tràn OV.",
        "tips": "PSW.2 = Cờ OV."
    },
    24: {
        "ans_letter": "C",
        "ans_kw": "psw.2",
        "exp": "Cờ tràn OV tương ứng với bit thứ 2 trong thanh ghi trạng thái chương trình PSW (PSW.2).",
        "meth": "Vị trí cờ OV: PSW.2.",
        "tips": "Cờ tràn OV = PSW.2."
    },
    25: {
        "ans_letter": "D",
        "ans_kw": "băng 1",
        "exp": "Khi RS0 = 1 và RS1 = 0, tổ hợp bit (RS1=0, RS0=1) chọn làm việc với Băng thanh ghi 1 (Bank 1, địa chỉ 08H - 0FH).",
        "meth": "RS1 = 0, RS0 = 1 -> Băng 1.",
        "tips": "RS1=0, RS0=1 -> Băng 1."
    },
    26: {
        "ans_letter": "C",
        "ans_kw": "dùng để lưu giữ thông tin về các trạng thái hoạt động của alu",
        "exp": "Thanh ghi PSW lưu giữ các cờ trạng thái phản ánh kết quả các phép tính toán số học và logic của khối ALU (như cờ nhớ CY, cờ nhớ phụ AC, cờ tràn OV, cờ chẵn lẻ P).",
        "meth": "Chức năng PSW: Lưu giữ trạng thái hoạt động của ALU.",
        "tips": "PSW = Lưu thông tin trạng thái hoạt động của ALU."
    },
    27: {
        "ans_letter": "B",
        "ans_kw": "22h",
        "exp": "Khi SP có giá trị 21H, thao tác PUSH tăng SP lên 1 (21H + 1 = 22H) trước khi ghi dữ liệu. Do đó vùng nhớ ngăn xếp bắt đầu từ địa chỉ 22H.",
        "meth": "Địa chỉ bắt đầu = 21H + 1 = 22H.",
        "tips": "21H + 1 = 22H."
    },
    28: {
        "ans_letter": "A",
        "ans_kw": "16 bit",
        "exp": "Con trỏ dữ liệu DPTR (Data Pointer) là một thanh ghi 16-bit dùng để trỏ địa chỉ trong bộ nhớ ngoài, được cấu thành từ hai thanh ghi 8-bit là DPH (byte cao) và DPL (byte thấp).",
        "meth": "Độ rộng DPTR = 16 bit.",
        "tips": "DPTR là thanh ghi 16 bit."
    },
    29: {
        "ans_letter": "A",
        "ans_kw": "e0h",
        "exp": "Thanh ghi tích lũy ACC (Accumulator) có địa chỉ trực tiếp trong vùng RAM đặc biệt SFR là E0H.",
        "meth": "Địa chỉ SFR của ACC: E0H.",
        "tips": "ACC = E0H (B = F0H)."
    },
    30: {
        "ans_letter": "C",
        "ans_kw": "cy_cờ nhớ",
        "exp": "Bit PSW.7 (bit thứ 7, bit cao nhất của thanh ghi PSW) chính là Cờ nhớ CY (Carry Flag).",
        "meth": "PSW.7 = Cờ CY.",
        "tips": "PSW.7 = Cờ CY (Carry)."
    },
    31: {
        "ans_letter": "C",
        "ans_kw": "acc, b, psw",
        "exp": "ACC (E0H), B (F0H) và PSW (D0H) đều có địa chỉ tận cùng là chữ số 0, thỏa mãn điều kiện định địa chỉ theo từng bit độc lập trong 8051.",
        "meth": "Nhóm định địa chỉ bit: ACC (E0H), B (F0H), PSW (D0H).",
        "tips": "Bộ ba: ACC, B, PSW đều định địa chỉ bit được."
    },
    32: {
        "ans_letter": "A",
        "ans_kw": "psw.0",
        "exp": "Cờ chẵn lẻ P (Parity Flag) là bit thứ 0 (bit thấp nhất) của thanh ghi PSW (PSW.0).",
        "meth": "PSW.0 = Cờ P.",
        "tips": "Cờ P = PSW.0."
    },
    33: {
        "ans_letter": "D",
        "ans_kw": "07h",
        "exp": "Sau khi khởi động hoặc Reset vi điều khiển 89C51, phần cứng tự động nạp giá trị 07H vào thanh ghi con trỏ ngăn xếp SP.",
        "meth": "Giá trị mặc định của SP sau Reset: 07H.",
        "tips": "SP mặc định sau reset = 07H."
    },
    34: {
        "ans_letter": "B",
        "ans_kw": "00h – 1fh",
        "exp": "4 băng thanh ghi của 89C51 (Bank 0, 1, 2, 3), mỗi băng gồm 8 thanh ghi R0 - R7 (8 byte), chiếm tổng cộng 32 byte trong không gian RAM nội từ địa chỉ 00H đến 1FH.",
        "meth": "Phạm vi các băng thanh ghi: 4 băng x 8 byte = 32 byte -> Địa chỉ từ 00H đến 1FH.",
        "tips": "4 Băng thanh ghi = 00H – 1FH."
    },
    35: {
        "ans_letter": "C",
        "ans_kw": "ac_cờ nhớ phụ",
        "exp": "Bit PSW.6 tương ứng với Cờ nhớ phụ AC (Auxiliary Carry Flag), báo tràn từ bit 3 sang bit 4 (nửa byte thấp sang nửa byte cao).",
        "meth": "PSW.6 = Cờ AC.",
        "tips": "PSW.6 = Cờ AC."
    },
    36: {
        "ans_letter": "D",
        "ans_kw": "thanh ghi trạng thái chương trình",
        "exp": "PSW là viết tắt của Program Status Word - Thanh ghi trạng thái chương trình, chứa các cờ trạng thái của ALU và các bit chọn băng thanh ghi.",
        "meth": "Định nghĩa tên viết tắt: PSW = Program Status Word (Thanh ghi trạng thái chương trình).",
        "tips": "PSW = Thanh ghi trạng thái chương trình."
    },
    37: {
        "ans_letter": "C",
        "ans_kw": "pc",
        "exp": "Bộ đếm chương trình PC (Program Counter) là thanh ghi chuyên dụng lưu giữ địa chỉ của câu lệnh tiếp theo đang chờ thực hiện.",
        "meth": "Thanh ghi lưu địa chỉ lệnh kế tiếp: Thanh ghi PC.",
        "tips": "Địa chỉ lệnh kế tiếp -> Thanh ghi PC."
    },
    38: {
        "ans_letter": "B",
        "ans_kw": "psw.7",
        "exp": "Cờ nhớ CY (Carry Flag) tương ứng với bit thứ 7 trong thanh ghi trạng thái chương trình PSW (PSW.7).",
        "meth": "Cờ CY = PSW.7.",
        "tips": "Cờ CY = PSW.7."
    },
    39: {
        "ans_letter": "A",
        "ans_kw": "21",
        "exp": "Vi điều khiển 89C51 chuẩn có đúng 21 thanh ghi chức năng đặc biệt SFR (Special Function Registers) phân bố rời rạc trong dải địa chỉ từ 80H đến FFH.",
        "meth": "Số lượng thanh ghi SFR của 8051 chuẩn: 21 thanh ghi.",
        "tips": "89C51 có đúng 21 thanh ghi SFR."
    },
    40: {
        "ans_letter": "C",
        "ans_kw": "rs0=1, rs1=1",
        "exp": "Để chọn Băng thanh ghi 3 (Bank 3, địa chỉ 18H - 1FH), cả hai bit chọn băng trong PSW phải được đặt lên mức 1: RS1 = 1 và RS0 = 1.",
        "meth": "Băng 3: RS1 = 1, RS0 = 1.",
        "tips": "Băng 3 -> RS1 = 1, RS0 = 1."
    },
    41: {
        "ans_letter": "C",
        "ans_kw": "cờ nhớ phụ ac",
        "exp": "Lệnh hiệu chỉnh thập phân DA A (Decimal Adjust Accumulator) căn cứ vào cờ nhớ phụ AC (Auxiliary Carry, báo nhớ nửa byte thấp) để cộng thêm 06H hiệu chỉnh kết quả phép tính về mã BCD hợp lệ.",
        "meth": "Hiệu chỉnh mã BCD: Căn cứ vào cờ nhớ phụ AC.",
        "tips": "Điều chỉnh mã BCD -> Cờ nhớ phụ AC."
    },
    42: {
        "ans_letter": "C",
        "ans_kw": "128",
        "exp": "Toàn bộ không gian RAM nội của 89C51 gồm 128 ô nhớ (00H - 7FH) đều có thể được sử dụng làm vùng nhớ ngăn xếp (Stack) tùy theo giá trị khởi tạo của con trỏ SP.",
        "meth": "Không gian RAM nội tối đa cho ngăn xếp: 128 ô nhớ.",
        "tips": "Không gian ngăn xếp tối đa = 128 ô nhớ (toàn bộ RAM nội)."
    },
    43: {
        "ans_letter": "B",
        "ans_kw": "rs0=1, rs1=0",
        "exp": "Để chọn Băng thanh ghi 1 (Bank 1, địa chỉ 08H - 0FH), giá trị hai bit tương ứng là: RS1 = 0 và RS0 = 1.",
        "meth": "Băng 1: RS1 = 0, RS0 = 1.",
        "tips": "Băng 1 -> RS1 = 0, RS0 = 1."
    },
    44: {
        "ans_letter": "A",
        "ans_kw": "cờ tràn ov",
        "exp": "Cờ tràn OV (Overflow Flag) trong PSW được sử dụng để báo tình trạng tràn số học khi thực hiện các phép tính số có dấu trên thanh ghi A.",
        "meth": "Báo tràn thanh ghi A trong phép tính có dấu: Cờ tràn OV.",
        "tips": "Báo tràn -> Cờ tràn OV."
    },
    45: {
        "ans_letter": "D",
        "ans_kw": "lưu địa chỉ của câu lệnh chờ thực hiện tiếp theo",
        "exp": "Thanh ghi bộ đếm chương trình PC (Program Counter) có nhiệm vụ duy nhất là lưu giữ địa chỉ của câu lệnh tiếp theo sẽ được CPU tìm nạp và thực hiện.",
        "meth": "Chức năng thanh ghi PC: Lưu địa chỉ của lệnh chờ thực hiện tiếp theo.",
        "tips": "PC -> Lưu địa chỉ câu lệnh chờ thực hiện tiếp theo."
    },
    46: {
        "ans_letter": "B",
        "ans_kw": "4",
        "exp": "Vi điều khiển 89C51 có 4 băng thanh ghi làm việc (Bank 0, Bank 1, Bank 2, Bank 3), mỗi băng gồm 8 thanh ghi từ R0 đến R7.",
        "meth": "Số băng thanh ghi của 89C51: 4 băng.",
        "tips": "89C51 có 4 băng thanh ghi."
    }
}

def _match_opt(options, kw, default_letter):
    cleaned = [re.sub(r'^[A-D][\.:]\s*', '', o).strip().lower() for o in options]
    kw = kw.strip().lower()
    
    # 1. Exact match
    for idx, c in enumerate(cleaned):
        if c == kw or c == kw + '.':
            return chr(65 + idx)
            
    # 2. Substring match if unambiguous
    sub_matches = [idx for idx, c in enumerate(cleaned) if kw in c]
    if len(sub_matches) == 1:
        return chr(65 + sub_matches[0])
        
    # 3. Word boundary regex match
    pattern = r'(?<![0-9a-z_à-ỹ])' + re.escape(kw) + r'(?![0-9a-z_à-ỹ])'
    wb_matches = [idx for idx, c in enumerate(cleaned) if re.search(pattern, c)]
    if len(wb_matches) == 1:
        return chr(65 + wb_matches[0])
        
    return default_letter

def solve_p4_question(q):
    num = q['num']
    meta = PART_4_DATA.get(num)
    if not meta:
        return None
    options = q.get('options', [])
    ans_letter = _match_opt(options, meta['ans_kw'], meta['ans_letter'])
    return {
        'id': q['id'],
        'source': q['source'],
        'exam_id': q.get('exam_id', 'PART_04'),
        'exam_title': 'Chuyên Đề Part 4: Kiến Trúc Vi Điều Khiển 89C51',
        'num': num,
        'title': f"Part 4 - Câu {num}",
        'prompt': q['prompt'],
        'extra_lines': q.get('extra_lines', []),
        'options': options,
        'type': 'mcq',
        'answer': ans_letter,
        'acceptable_answers': [ans_letter],
        'explanation': meta['exp'],
        'methodology': meta['meth'],
        'tips_casio': meta['tips'],
        'clo': 'CLO1',
        'level': 'NB',
        'topic_name': 'Kiến trúc phần cứng vi điều khiển 89C51',
        'images': q.get('images', [])
    }

def solve_p5_question(q):
    num = q['num']
    meta = PART_5_DATA.get(num)
    if not meta:
        return None
    options = q.get('options', [])
    ans_letter = _match_opt(options, meta['ans_kw'], meta['ans_letter'])
    return {
        'id': q['id'],
        'source': q['source'],
        'exam_id': q.get('exam_id', 'PART_05'),
        'exam_title': 'Chuyên Đề Part 5: Khảo Sát Chân & Cổng I/O 89C51',
        'num': num,
        'title': f"Part 5 - Câu {num}",
        'prompt': q['prompt'],
        'extra_lines': q.get('extra_lines', []),
        'options': options,
        'type': 'mcq',
        'answer': ans_letter,
        'acceptable_answers': [ans_letter],
        'explanation': meta['exp'],
        'methodology': meta['meth'],
        'tips_casio': meta['tips'],
        'clo': 'CLO1',
        'level': 'NB',
        'topic_name': 'Chân vi điều khiển, cổng vào ra & tín hiệu điều khiển',
        'images': q.get('images', [])
    }

def solve_p6_question(q):
    num = q['num']
    meta = PART_6_DATA.get(num)
    if not meta:
        return None
    options = q.get('options', [])
    ans_letter = _match_opt(options, meta['ans_kw'], meta['ans_letter'])
    return {
        'id': q['id'],
        'source': q['source'],
        'exam_id': q.get('exam_id', 'PART_06'),
        'exam_title': 'Chuyên Đề Part 6: Tổ Chức RAM Nội & Thanh Ghi SFR',
        'num': num,
        'title': f"Part 6 - Câu {num}",
        'prompt': q['prompt'],
        'extra_lines': q.get('extra_lines', []),
        'options': options,
        'type': 'mcq',
        'answer': ans_letter,
        'acceptable_answers': [ans_letter],
        'explanation': meta['exp'],
        'methodology': meta['meth'],
        'tips_casio': meta['tips'],
        'clo': 'CLO2',
        'level': 'TH',
        'topic_name': 'Tổ chức bộ nhớ RAM nội, Băng thanh ghi, SP & SFR',
        'images': q.get('images', [])
    }
