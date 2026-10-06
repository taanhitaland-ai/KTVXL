import re

# ==============================================================================
# COMPREHENSIVE SOLVER FOR PART 7 (41 Questions Total)
# Topic: Ghép Nối Mở Rộng Bộ Nhớ ROM/RAM Ngoài & Giải Mã Địa Chỉ 74LS138
# ==============================================================================

PART_7_DATA = {
    4: {
        "ans_letter": "B",
        "ans_kw": "p0.0 – p0.7 và p2.0 – p2.3",
        "exp": "Để mở rộng bộ nhớ RAM 4K x 8bit (4096 Byte = 2^12 Byte), vi điều khiển cần 12 đường địa chỉ. Cổng P0 cung cấp 8 đường địa chỉ byte thấp A0 - A7 (P0.0 – P0.7), và cổng P2 cung cấp 4 đường địa chỉ byte cao A8 - A11 (P2.0 – P2.3).",
        "meth": "Tính số đường địa chỉ: 4KB = 2^12 -> Cần 12 đường. P0 đảm nhiệm 8 đường thấp (A0-A7), P2 đảm nhiệm các đường cao còn lại (P2.0-P2.3).",
        "tips": "4KB cần 12 đường: 8 đường P0 + 4 đường P2 (P2.0-P2.3)."
    },
    5: {
        "ans_letter": "D",
        "ans_kw": "08h – 7fh",
        "exp": "Sau khi Reset, con trỏ ngăn xếp SP tự động nhận giá trị 07H. Thao tác PUSH đầu tiên sẽ lưu dữ liệu vào ô nhớ 08H. Dung lượng RAM nội là 128 byte (đến 7FH). Do đó phạm vi lớn nhất có thể dùng cho ngăn xếp trong RAM nội là từ 08H đến 7FH.",
        "meth": "Phạm vi ngăn xếp tối đa sau Reset: Từ (SP_mặc định + 1) đến giới hạn RAM nội: 08H – 7FH.",
        "tips": "Phạm vi ngăn xếp lớn nhất = 08H – 7FH."
    },
    6: {
        "ans_letter": "C",
        "ans_kw": "cả ba đáp án a, b, c đều đúng",
        "exp": "Bộ nhớ RAM trên chip 89C51 (128 byte) được chia thành 3 vùng rõ rệt: (1) 4 băng thanh ghi R0-R7 (00H - 1FH), (2) Vùng RAM định địa chỉ theo từng bit (20H - 2FH), và (3) Vùng RAM đa năng cho người dùng (30H - 7FH). Do đó cả 3 đáp án đều đúng.",
        "meth": "3 phân vùng RAM nội: Băng thanh ghi (00H-1FH), RAM định địa chỉ bit (20H-2FH), RAM đa chức năng (30H-7FH).",
        "tips": "Cả ba đáp án A, B, C đều đúng."
    },
    7: {
        "ans_letter": "D",
        "ans_kw": "bộ nhớ dữ liệu bên trong",
        "exp": "Con trỏ ngăn xếp SP của 89C51 chỉ có độ rộng 8-bit và lệnh PUSH/POP chỉ thao tác trực tiếp với các ô nhớ RAM nội (địa chỉ 00H đến 7FH). Do đó vùng nhớ ngăn xếp luôn được lưu giữ trong Bộ nhớ dữ liệu bên trong (RAM nội).",
        "meth": "Vị trí ngăn xếp: Luôn nằm trong RAM nội của vi điều khiển.",
        "tips": "Ngăn xếp (Stack) lưu trong Bộ nhớ dữ liệu bên trong."
    },
    8: {
        "ans_letter": "C",
        "ans_kw": "p0.0 – p0.7 và p2.0 – p2.7",
        "exp": "Để mở rộng bộ nhớ ROM chương trình tối đa 64K x 8bit (65,536 Byte = 2^16 Byte), vi điều khiển cần toàn bộ 16 đường địa chỉ: 8 đường byte thấp P0.0 – P0.7 (A0-A7) và 8 đường byte cao P2.0 – P2.7 (A8-A15).",
        "meth": "64KB = 2^16 Byte -> Cần đủ 16 đường địa chỉ: Toàn bộ P0 và toàn bộ P2.",
        "tips": "64KB = P0.0-P0.7 kết hợp P2.0-P2.7."
    },
    9: {
        "ans_letter": "B",
        "ans_kw": "16, 64",
        "exp": "Bộ đếm chương trình PC của 89C51 là thanh ghi 16-bit, do đó vi điều khiển có khả năng định địa chỉ mở rộng không gian bộ nhớ chương trình lên tới 2^16 Byte = 64 KByte.",
        "meth": "Độ rộng PC = 16 bit -> Không gian địa chỉ = 64 KB.",
        "tips": "PC là 16 bit, mở rộng tối đa 64 K."
    },
    10: {
        "ans_letter": "C",
        "ans_kw": "20h – 2fh",
        "exp": "Vùng nhớ RAM nội có thể định địa chỉ theo từng bit độc lập gồm 16 byte, nằm trong dải địa chỉ byte từ 20H đến 2FH (tương ứng với 128 bit địa chỉ từ 00H đến 7FH).",
        "meth": "Vùng RAM định địa chỉ bit: 20H đến 2FH.",
        "tips": "Định địa chỉ bit trong RAM = 20H – 2FH."
    },
    11: {
        "ans_letter": "A",
        "ans_kw": "0000h – 0fffh",
        "exp": "Dung lượng ROM nội 4KB tương ứng với 4096 byte (từ 0 đến 4095). Đổi sang mã Hex: 4095 = 0FFFH. Vì vậy dải địa chỉ của ROM nội 89C51 là 0000H – 0FFFH.",
        "meth": "Địa chỉ 4KB ROM nội: Bắt đầu từ 0000H đến 0000H + 4096 - 1 = 0FFFH.",
        "tips": "Casio 580VNX: 4096 - 1 = 4095 đổi sang HEX là 0FFF -> 0000H – 0FFFH."
    },
    12: {
        "ans_letter": "A",
        "ans_kw": "rom ngoại, 0000h",
        "exp": "Khi chân EA được nối mức thấp (0V), CPU 89C51 bị vô hiệu hóa bộ nhớ ROM nội và chỉ tìm nạp lệnh từ bộ nhớ chương trình bên ngoài (ROM ngoại), bắt đầu từ địa chỉ 0000H.",
        "meth": "EA = 0: Lấy lệnh từ ROM ngoại, bắt đầu từ 0000H.",
        "tips": "EA mức thấp -> ROM ngoại, bắt đầu từ 0000H."
    },
    13: {
        "ans_letter": "B",
        "ans_kw": "p0.0 – p0.7 và p2.0 – p2.6",
        "exp": "Bộ nhớ 32K x 8bit (32,768 Byte = 2^15 Byte) cần đúng 15 đường địa chỉ. Cổng P0 chiếm 8 đường thấp A0-A7 (P0.0-P0.7), cổng P2 chiếm 7 đường cao A8-A14 (P2.0-P2.6).",
        "meth": "32KB = 2^15 -> 15 đường: 8 đường P0 (P0.0-P0.7) + 7 đường P2 (P2.0-P2.6).",
        "tips": "32KB cần 15 đường -> P0.0-P0.7 và P2.0-P2.6."
    },
    14: {
        "ans_letter": "A",
        "ans_kw": "8kx8bit",
        "exp": "Quan sát sơ đồ mạch với IC EPROM 2764: Ký hiệu số '64' chỉ dung lượng 64 Kilobit = 64 / 8 = 8 Kilobyte = 8K x 8 bit (gồm 13 đường địa chỉ A0 - A12).",
        "meth": "Mã IC EPROM 2764: 64 Kbit = 8K x 8 bit.",
        "tips": "IC 2764 -> 8K x 8 bit."
    },
    15: {
        "ans_letter": "C",
        "ans_kw": "4kb",
        "exp": "Dung lượng bộ nhớ chương trình Flash ROM tích hợp sẵn trên chip vi điều khiển chuẩn 89C51 là 4 Kilobyte (4KB).",
        "meth": "Thông số ROM nội chuẩn 89C51 = 4 KB.",
        "tips": "89C51 = 4 KB Flash ROM."
    },
    16: {
        "ans_letter": "A",
        "ans_kw": "7fh",
        "exp": "Vì bộ nhớ RAM nội của vi điều khiển 89C51 có dung lượng 128 byte (từ 00H đến 7FH), địa chỉ kết thúc tối đa của vùng nhớ ngăn xếp trong RAM nội là 7FH.",
        "meth": "Địa chỉ kết thúc của RAM nội 89C51 là 7FH.",
        "tips": "Địa chỉ kết thúc ngăn xếp trong RAM nội = 7FH."
    },
    17: {
        "ans_letter": "D",
        "ans_kw": "128",
        "exp": "Bộ nhớ dữ liệu RAM nội tích hợp của vi điều khiển chuẩn 89C51 có dung lượng là 128 Byte (chiếm dải địa chỉ từ 00H đến 7FH).",
        "meth": "Dung lượng RAM nội 89C51 = 128 Byte.",
        "tips": "RAM 89C51 = 128 Byte."
    },
    18: {
        "ans_letter": "B",
        "ans_kw": "30h –7fh",
        "exp": "Vùng không gian địa chỉ từ 30H đến 7FH (gồm 80 byte) trong RAM nội là vùng RAM đa chức năng (General Purpose RAM) tự do dành cho người dùng lưu biến và dữ liệu chương trình.",
        "meth": "Phân chia RAM: 00H-1FH (Bank), 20H-2FH (Bit-addressable), 30H-7FH (Đa chức năng/Người dùng).",
        "tips": "RAM đa chức năng = 30H – 7FH."
    },
    19: {
        "ans_letter": "A",
        "ans_kw": "p0.0 – p0.7 và p2.0 – p2.7",
        "exp": "Mở rộng RAM ngoài lên 64K x 8bit (64 KB = 2^16 Byte) cần trọn vẹn 16 đường địa chỉ từ A0 đến A15, tương ứng với P0.0 – P0.7 và P2.0 – P2.7.",
        "meth": "64KB RAM ngoài: Cần 16 đường địa chỉ P0.0-P0.7 và P2.0-P2.7.",
        "tips": "64KB = P0.0-P0.7 và P2.0-P2.7."
    },
    20: {
        "ans_letter": "A",
        "ans_kw": "p0.0 – p0.7 và p2.0 – p2.3",
        "exp": "Mở rộng ROM ngoài 4K x 8bit (4096 Byte = 2^12 Byte) cần 12 đường địa chỉ: 8 đường P0.0 – P0.7 và 4 đường P2.0 – P2.3.",
        "meth": "4KB = 2^12 Byte -> 12 đường địa chỉ: P0.0-P0.7 và P2.0-P2.3.",
        "tips": "4KB cần 12 đường -> P0.0-P0.7 và P2.0-P2.3."
    },
    21: {
        "ans_letter": "C",
        "ans_kw": "2kx8bit",
        "exp": "Quan sát sơ đồ mạch mở rộng bộ nhớ: IC nhớ sử dụng là 2716 có dung lượng 16 Kilobit = 16 / 8 = 2 Kilobyte = 2K x 8 bit (gồm 11 đường địa chỉ A0 - A10).",
        "meth": "IC 2716: 16 Kbit / 8 = 2K x 8 bit.",
        "tips": "IC 2716 -> 2K x 8 bit."
    },
    22: {
        "ans_letter": "B",
        "ans_kw": "câu trả lời đúng: 2",
        "fib_val": "2",
        "exp": "Trên sơ đồ mạch sử dụng chip nhớ EPROM 2716 có 11 đường địa chỉ (A0 - A10). Không gian địa chỉ bộ nhớ ROM mở rộng là 2^11 Byte = 2048 Byte = 2 KB. Điền giá trị hệ thập phân: 2.",
        "meth": "Dung lượng chip 2716: 2^11 Byte = 2 KB. Nhập số nguyên: 2.",
        "tips": "Sơ đồ IC 2716 -> Điền số: 2."
    },
    23: {
        "ans_letter": "B",
        "ans_kw": "20h",
        "exp": "Ô nhớ RAM có địa chỉ byte 20H vừa có thể định địa chỉ theo byte (ô nhớ 20H) vừa có thể định địa chỉ theo bit (các bit 00H đến 07H thuộc ô nhớ 20H).",
        "meth": "Vùng định địa chỉ bit 20H-2FH: Ô nhớ 20H chứa 8 bit đầu tiên từ bit 00H đến 07H.",
        "tips": "Vừa định địa chỉ bit vừa định địa chỉ ô nhớ = 20H."
    },
    24: {
        "ans_letter": "A",
        "ans_kw": "ram ngoài",
        "exp": "Thanh ghi con trỏ dữ liệu DPTR (16-bit) được sử dụng chủ yếu trong lệnh MOVX (@DPTR) để trỏ đến địa chỉ của ô nhớ cần đọc hoặc ghi trong bộ nhớ dữ liệu bên ngoài (RAM ngoài).",
        "meth": "DPTR kết hợp lệnh MOVX: Truy xuất RAM ngoài.",
        "tips": "DPTR dùng để truy xuất ô nhớ RAM ngoài."
    },
    25: {
        "ans_letter": "D",
        "ans_kw": "p0.0 – p0.7 và p2.0 – p2.4",
        "exp": "Mở rộng RAM 8K x 8bit (8192 Byte = 2^13 Byte) cần 13 đường địa chỉ: 8 đường P0.0 – P0.7 (A0-A7) và 5 đường P2.0 – P2.4 (A8-A12).",
        "meth": "8KB = 2^13 Byte -> 13 đường: P0.0-P0.7 và P2.0-P2.4.",
        "tips": "8KB cần 13 đường: P0.0-P0.7 và P2.0-P2.4."
    },
    26: {
        "ans_letter": "A",
        "ans_kw": "00h – 07h",
        "exp": "Khi reset vi điều khiển 89C51, PSW được xóa về 00H (RS1=0, RS0=0), do đó băng thanh ghi mặc định được chọn là Bank 0 có phạm vi địa chỉ từ 00H đến 07H (tương ứng các thanh ghi R0 đến R7).",
        "meth": "Bank 0 mặc định sau Reset: 00H – 07H.",
        "tips": "Băng mặc định sau reset: 00H – 07H."
    },
    27: {
        "ans_letter": "C",
        "ans_kw": "mức thấp (0v)",
        "exp": "Khi muốn hệ thống vi điều khiển thực thi chương trình hoàn toàn từ bộ nhớ ROM mở rộng bên ngoài (bỏ qua ROM nội), chân EA (External Access) bắt buộc phải được nối xuống mức thấp (0V / GND).",
        "meth": "Thực thi từ ROM ngoài: Chân EA nối mức thấp (0V).",
        "tips": "Thực thi từ ROM mở rộng -> Chân EA mắc Mức thấp (0V)."
    },
    28: {
        "ans_letter": "A",
        "ans_kw": "20h – 2fh",
        "exp": "Trong RAM nội của 89C51, không gian thực hiện định địa chỉ theo bit gồm 16 byte từ địa chỉ byte 20H đến 2FH (chứa 128 bit độc lập từ bit 00H đến 7FH).",
        "meth": "Không gian định địa chỉ bit: 20H – 2FH.",
        "tips": "Định địa chỉ bit trong RAM: 20H – 2FH."
    },
    29: {
        "ans_letter": "C",
        "ans_kw": "p0.0 – p0.7 và p2.0 – p2.2",
        "exp": "Mở rộng ROM ngoài 2K x 8bit (2048 Byte = 2^11 Byte) cần 11 đường địa chỉ: 8 đường P0.0 – P0.7 (A0-A7) và 3 đường P2.0 – P2.2 (A8-A10).",
        "meth": "2KB = 2^11 Byte -> 11 đường: P0.0-P0.7 và P2.0-P2.2.",
        "tips": "2KB cần 11 đường -> P0.0-P0.7 và P2.0-P2.2."
    },
    30: {
        "ans_letter": "B",
        "ans_kw": "64kb",
        "exp": "Với bus địa chỉ 16-bit và chân điều khiển PSEN, dung lượng bộ nhớ chương trình ngoài của 89C51 có thể mở rộng tối đa lên tới 2^16 Byte = 64 KB.",
        "meth": "Giới hạn mở rộng ROM: 64 KB.",
        "tips": "Bộ nhớ chương trình mở rộng tối đa = 64 KB."
    },
    31: {
        "ans_letter": "A",
        "ans_kw": "mạch tạo xung chọn chip (cs), xác định vùng địa chỉ bộ nhớ hay ngoại vi tronghệ vi xử lý",
        "exp": "Mạch giải mã địa chỉ (sử dụng IC như 74LS138) có chức năng nhận các đường địa chỉ byte cao để tạo ra các tín hiệu chọn chip /CS (Chip Select), qua đó xác định vùng địa chỉ không gian bộ nhớ hoặc thiết bị ngoại vi trong hệ vi xử lý.",
        "meth": "Chức năng mạch giải mã địa chỉ: Tạo tín hiệu chọn chip /CS phân định vùng địa chỉ.",
        "tips": "Giải mã địa chỉ -> Tạo xung chọn chip (CS)."
    },
    32: {
        "ans_letter": "B",
        "ans_kw": "câu trả lời đúng: 8",
        "fib_val": "8",
        "exp": "Trên sơ đồ mạch sử dụng IC EPROM 2764 có 13 đường địa chỉ (A0 - A12). Không gian địa chỉ bộ nhớ ROM mở rộng là 2^13 Byte = 8192 Byte = 8 KB. Điền số nguyên: 8.",
        "meth": "Dung lượng IC 2764: 2^13 Byte = 8 KB. Điền giá trị: 8.",
        "tips": "Sơ đồ IC 2764 -> Điền số: 8."
    },
    33: {
        "ans_letter": "D",
        "ans_kw": "các đường của p0, p2",
        "exp": "Các tín hiệu vào của mạch giải mã địa chỉ trong hệ ghép nối 8051 được lấy từ các đường bus địa chỉ phát ra từ cổng P0 (qua chốt) và cổng P2.",
        "meth": "Tín hiệu giải mã địa chỉ: Lấy từ bus địa chỉ P0, P2.",
        "tips": "Tín hiệu vào giải mã địa chỉ = Các đường của P0, P2."
    },
    34: {
        "ans_letter": "D",
        "ans_kw": "cho phép ghi thông tin vào bộ nhớ dữ liệu ngoài",
        "exp": "Tín hiệu /WR (Write Strobe, chân P3.6 của 89C51) là tín hiệu điều khiển tích cực mức thấp cho phép ghi dữ liệu từ CPU vào bộ nhớ dữ liệu bên ngoài (RAM ngoài).",
        "meth": "WR (P3.6): Cho phép GHI vào RAM ngoài.",
        "tips": "WR -> Cho phép ghi thông tin vào bộ nhớ dữ liệu ngoài."
    },
    35: {
        "ans_letter": "D",
        "ans_kw": "cho phép đọc thông tin từ bộ nhớ dữ liệu ngoài",
        "exp": "Tín hiệu /RD (Read Strobe, chân P3.7 của 89C51) là tín hiệu điều khiển tích cực mức thấp cho phép CPU đọc dữ liệu từ bộ nhớ dữ liệu bên ngoài (RAM ngoài) vào.",
        "meth": "RD (P3.7): Cho phép ĐỌC từ RAM ngoài.",
        "tips": "RD -> Cho phép đọc thông tin từ bộ nhớ dữ liệu ngoài."
    },
    36: {
        "ans_letter": "D",
        "ans_kw": "00h – 1fh",
        "exp": "4 băng thanh ghi của 89C51 chiếm 32 byte đầu tiên trong không gian RAM nội, tương ứng với dải địa chỉ từ 00H đến 1FH.",
        "meth": "Địa chỉ 4 băng thanh ghi: 00H – 1FH.",
        "tips": "Băng thanh ghi: 00H – 1FH."
    },
    37: {
        "ans_letter": "D",
        "ans_kw": "p0.0 – p0.7 và p2.0 – p2.2",
        "exp": "Mở rộng RAM 2K x 8bit (2048 Byte = 2^11 Byte) cần 11 đường địa chỉ: 8 đường P0.0 – P0.7 và 3 đường P2.0 – P2.2.",
        "meth": "2KB = 2^11 Byte -> 11 đường: P0.0-P0.7 và P2.0-P2.2.",
        "tips": "2KB cần 11 đường -> P0.0-P0.7 và P2.0-P2.2."
    },
    38: {
        "ans_letter": "C",
        "ans_kw": "80h – ffh",
        "exp": "Các thanh ghi chức năng đặc biệt SFR (như ACC, B, PSW, SP, DPTR, P0-P3, TCON, TMOD...) phân bố trong nửa trên của không gian RAM nội, từ địa chỉ 80H đến FFH.",
        "meth": "Địa chỉ vùng SFR: 80H – FFH.",
        "tips": "Vùng SFR = 80H – FFH."
    },
    39: {
        "ans_letter": "B",
        "ans_kw": "câu trả lời đúng: 16",
        "fib_val": "16",
        "exp": "Trên sơ đồ mạch sử dụng IC nhớ 27128 (128 Kbit) có 14 đường địa chỉ (A0 - A13). Dung lượng không gian nhớ ROM mở rộng là 2^14 Byte = 16,384 Byte = 16 KB. Điền giá trị: 16.",
        "meth": "IC 27128: 128 Kbit / 8 = 16 KB. Điền số nguyên: 16.",
        "tips": "Sơ đồ IC 27128 -> Điền số: 16."
    },
    40: {
        "ans_letter": "B",
        "ans_kw": "p0.0 – p0.7 và p2.0 – p2.6",
        "exp": "Mở rộng RAM 32K x 8bit (32,768 Byte = 2^15 Byte) cần 15 đường địa chỉ: 8 đường P0.0 – P0.7 (A0-A7) và 7 đường P2.0 – P2.6 (A8-A14).",
        "meth": "32KB = 2^15 -> 15 đường: P0.0-P0.7 và P2.0-P2.6.",
        "tips": "32KB cần 15 đường: P0.0-P0.7 và P2.0-P2.6."
    },
    41: {
        "ans_letter": "D",
        "ans_kw": "c000h – dfffh",
        "exp": "Phân tích mạch giải mã địa chỉ: Với P2.7 = 1, P2.6 = 1, P2.5 = 0, tổ hợp 3 bit địa chỉ cao nhất A15 A14 A13 là 110b = C (Hex). Địa chỉ bắt đầu của khối nhớ là C000H. Chip nhớ có dung lượng 8KB (13 đường địa chỉ A0 - A12 chạy từ 0000H đến 1FFFH). Do đó địa chỉ kết thúc là C000H + 1FFFH = DFFFH. Dải địa chỉ là C000H – DFFFH.",
        "meth": "Xác định 3 bit chọn chip: P2.7=1, P2.6=1, P2.5=0 -> 110b = C -> Bắt đầu C000H. Chip 8KB (độ rộng 1FFFH) -> Kết thúc DFFFH.",
        "tips": "Casio 580VNX: Ghép 1100 0000 0000 0000 -> HEX: C000. C000H + 1FFFH = DFFFH."
    },
    42: {
        "ans_letter": "C",
        "ans_kw": "p0.0 – p0.7 và p2.0 – p2.4",
        "exp": "Mở rộng ROM 8K x 8bit (8192 Byte = 2^13 Byte) cần 13 đường địa chỉ: 8 đường P0.0 – P0.7 và 5 đường P2.0 – P2.4.",
        "meth": "8KB = 2^13 Byte -> 13 đường: P0.0-P0.7 và P2.0-P2.4.",
        "tips": "8KB cần 13 đường -> P0.0-P0.7 và P2.0-P2.4."
    },
    43: {
        "ans_letter": "D",
        "ans_kw": "các đường của p0, p2",
        "exp": "Tín hiệu vào của mạch giải mã địa chỉ trong hệ thống mở rộng 8051 được lấy từ các đường của cổng P0 và cổng P2.",
        "meth": "Tín hiệu giải mã: Bus địa chỉ P0, P2.",
        "tips": "Các đường của P0, P2."
    },
    44: {
        "ans_letter": "C",
        "ans_kw": "2000h – 3fffh",
        "exp": "Phân tích mạch giải mã địa chỉ: Với P2.7 = 0, P2.6 = 0, P2.5 = 1, tổ hợp 3 bit địa chỉ cao nhất A15 A14 A13 là 001b = 2 (Hex). Địa chỉ bắt đầu của khối nhớ là 2000H. Với chip nhớ 8KB (độ rộng 1FFFH), địa chỉ kết thúc là 2000H + 1FFFH = 3FFFH. Dải địa chỉ của bộ nhớ mở rộng là 2000H – 3FFFH.",
        "meth": "Xác định 3 bit chọn chip: P2.7=0, P2.6=0, P2.5=1 -> 001b = 2 -> Bắt đầu 2000H. Chip 8KB (+1FFFH) -> Kết thúc 3FFFH.",
        "tips": "001b = 2 -> Bắt đầu 2000H -> Dải là 2000H – 3FFFH."
    }
}

def _match_opt(options, kw, default_letter):
    cleaned = [re.sub(r'^[A-D][\.:]\s*', '', o).strip().lower() for o in options]
    kw = kw.strip().lower()
    
    for idx, c in enumerate(cleaned):
        if c == kw or c == kw + '.':
            return chr(65 + idx)
            
    sub_matches = [idx for idx, c in enumerate(cleaned) if kw in c]
    if len(sub_matches) == 1:
        return chr(65 + sub_matches[0])
        
    pattern = r'(?<![0-9a-z_à-ỹ])' + re.escape(kw) + r'(?![0-9a-z_à-ỹ])'
    wb_matches = [idx for idx, c in enumerate(cleaned) if re.search(pattern, c)]
    if len(wb_matches) == 1:
        return chr(65 + wb_matches[0])
        
    return default_letter

def solve_p7_question(q):
    num = q['num']
    meta = PART_7_DATA.get(num)
    if not meta:
        return None
    options = q.get('options', [])
    q_type = q.get('type', 'mcq')
    
    if num in (22, 32, 39):
        # Fill-in-the-blank question
        val = meta.get('fib_val', '2')
        ans = val
        acceptable = [val, f"{val} KB", f"{val}KB", f"{val}kb", "B"]
        q_type = 'fib'
    else:
        ans = _match_opt(options, meta['ans_kw'], meta['ans_letter'])
        acceptable = [ans]
        
    return {
        'id': q['id'],
        'source': q['source'],
        'exam_id': q.get('exam_id', 'PART_07'),
        'exam_title': 'Chuyên Đề Part 7: Ghép Nối Mở Rộng Bộ Nhớ Ngoài',
        'num': num,
        'title': f"Part 7 - Câu {num}",
        'prompt': q['prompt'],
        'extra_lines': q.get('extra_lines', []),
        'options': options,
        'type': q_type,
        'answer': ans,
        'acceptable_answers': acceptable,
        'explanation': meta['exp'],
        'methodology': meta['meth'],
        'tips_casio': meta['tips'],
        'clo': 'CLO2',
        'level': 'TH',
        'topic_name': 'Ghép nối mở rộng bộ nhớ ROM/RAM và giải mã địa chỉ',
        'images': q.get('images', [])
    }
