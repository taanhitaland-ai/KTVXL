import re

# ==============================================================================
# COMPREHENSIVE SOLVER FOR PART 2 & PART 3 (72 Questions Total)
# Topic: Kiến trúc CPU, Đơn vị điều khiển (CU/EU), Hệ thống Bus & Quản lý Bộ nhớ
# ==============================================================================

PART_2_DATA = {
    4: {
        "ans_letter": "B",
        "ans_kw": "cpu cấp địa chỉ, cấp tín hiệu điều khiển chọn bộ nhớ, cấp tín hiệu yêu cầu đọc bộ nhớ và nhận dữ liệu từ data bus vào",
        "exp": "Khi CPU thực hiện thao tác ĐỌC dữ liệu từ bộ nhớ: (1) CPU phát địa chỉ ô nhớ cần đọc lên Address Bus, (2) Phát tín hiệu điều khiển chọn chip bộ nhớ (/CS hoặc /CE), (3) Phát xung điều khiển cho phép đọc (/RD hoặc /OE), và (4) Nhận byte dữ liệu trả về từ Data Bus vào thanh ghi nội.",
        "meth": "Quy trình chu kỳ đọc bộ nhớ (Memory Read Cycle): Địa chỉ -> Chọn chip -> Tín hiệu Đọc (/RD) -> Nhận dữ liệu vào Data Bus.",
        "tips": "Nhớ thứ tự chuẩn: Cấp địa chỉ -> Cấp điều khiển chọn -> Yêu cầu ĐỌC -> Nhận dữ liệu từ Data Bus."
    },
    5: {
        "ans_letter": "A",
        "ans_kw": "thanh ghi",
        "exp": "Thanh ghi (Registers) là bộ nhớ nội nằm ngay bên trong CPU có tốc độ truy cập nhanh nhất, được dùng làm nơi lưu trữ tạm thời các toán hạng, địa chỉ và dữ liệu trung gian trong suốt quá trình CPU giải mã và thực thi lệnh.",
        "meth": "Phân loại lưu trữ: Nhanh nhất và tạm thời trong CPU khi thực hiện lệnh = Thanh ghi (Registers).",
        "tips": "Từ khóa: 'Chứa dữ liệu tạm thời khi thực hiện lệnh' -> Thanh ghi."
    },
    6: {
        "ans_letter": "A",
        "ans_kw": "trong bộ nhớ chính",
        "exp": "Theo nguyên lý kiến trúc máy tính Von Neumann, trước khi được CPU thực thi, toàn bộ chương trình và dữ liệu bắt buộc phải được nạp và lưu trữ sẵn trong bộ nhớ chính (Main Memory - ROM hoặc RAM).",
        "meth": "Nguyên lý Von Neumann: Mọi chương trình muốn chạy đều phải thường trú trong Bộ nhớ chính.",
        "tips": "CPU không lưu toàn bộ chương trình, chương trình luôn nằm trong 'Bộ nhớ chính'."
    },
    7: {
        "ans_letter": "D",
        "ans_kw": "xác định các chế độ hoạt động của hệ thống vi xử lý",
        "exp": "Bus điều khiển (Control Bus) mang các đường tín hiệu điều khiển và trạng thái (như /RD, /WR, ALE, PSEN, RESET, INT, HOLD, HLDA) nhằm đồng bộ hóa và xác định chính xác chế độ hoạt động của các thành phần trong toàn hệ thống vi xử lý.",
        "meth": "Chức năng hệ thống Bus: Bus địa chỉ (định vị), Bus dữ liệu (mang dữ liệu), Bus điều khiển (đồng bộ & xác định chế độ hoạt động).",
        "tips": "Control Bus = Định hình và điều phối chế độ hoạt động của hệ thống."
    },
    8: {
        "ans_letter": "D",
        "ans_kw": "các phép toán logic và số học",
        "exp": "Khối ALU (Arithmetic Logic Unit - Đơn vị số học và logic) là thành phần cốt lõi của CPU chịu trách nhiệm thực thi toàn bộ các phép tính toán số học (cộng, trừ, nhân, chia) và các phép toán logic (AND, OR, XOR, đảo bit NOT, quay/dịch bit).",
        "meth": "Định nghĩa ALU: ALU = Arithmetic (Số học) + Logic (Logic).",
        "tips": "ALU luôn thực hiện cả 2 chức năng: 'Phép toán số học và logic'."
    },
    9: {
        "ans_letter": "A",
        "ans_kw": "điều khiển, dữ liệu, địa chỉ",
        "exp": "Hệ thống Bus liên kết trong máy tính bao gồm 3 loại bus cơ bản: Bus địa chỉ (Address Bus), Bus dữ liệu (Data Bus), và Bus điều khiển (Control Bus).",
        "meth": "Bộ ba Bus kinh điển: Address Bus + Data Bus + Control Bus.",
        "tips": "Mẹo nhớ: 'Địa chỉ - Dữ liệu - Điều khiển'."
    },
    10: {
        "ans_letter": "A",
        "ans_kw": "xác định vị trí của dữ liệu trong bộ nhớ",
        "exp": "Bus địa chỉ (Address Bus) mang tín hiệu địa chỉ do CPU phát ra nhằm xác định duy nhất vị trí ô nhớ trong không gian nhớ hoặc địa chỉ của cổng vào ra (I/O) mà CPU cần giao tiếp.",
        "meth": "Vai trò Address Bus: Cung cấp địa chỉ xác định vị trí dữ liệu cần đọc/ghi.",
        "tips": "Bus địa chỉ = 'Định vị vị trí dữ liệu'."
    },
    11: {
        "ans_letter": "B",
        "ans_kw": "bus hệ thống",
        "exp": "Bộ vi xử lý (CPU) bên trong cấu tạo gồm 3 thành phần chính: Khối điều khiển (CU), Khối tính toán số học logic (ALU), và Tập thanh ghi (Registers). Bus hệ thống (System Bus) là đường dây liên kết bên ngoài nối CPU với bộ nhớ và thiết bị ngoại vi, không nằm bên trong CPU.",
        "meth": "Cấu trúc vi xử lý MPU = CU + ALU + Registers. Bus hệ thống nằm bên ngoài.",
        "tips": "Thành phần NGOÀI CPU = Bus hệ thống."
    },
    12: {
        "ans_letter": "A",
        "ans_kw": "alu",
        "exp": "ALU (Arithmetic Logic Unit) là đơn vị phần cứng bên trong CPU thực thi các phép toán số học (+, -, *, /) và các phép tính logic (AND, OR, NOT, XOR).",
        "meth": "Nhận diện từ viết tắt: ALU = Arithmetic and Logic Unit.",
        "tips": "Phép tính số học và logic -> ALU."
    },
    13: {
        "ans_letter": "D",
        "ans_kw": "định vị ví trí sẽ truyền dữ liệu với cpu",
        "exp": "Bus địa chỉ được CPU sử dụng để truyền đi mã địa chỉ của ô nhớ hoặc thiết bị ngoại vi, qua đó định vị chính xác vị trí ô nhớ/cổng giao tiếp sẽ trao đổi dữ liệu với CPU trên Data Bus.",
        "meth": "Công dụng Address Bus: Định vị vị trí giao tiếp dữ liệu.",
        "tips": "Address Bus -> Định vị vị trí."
    },
    14: {
        "ans_letter": "C",
        "ans_kw": "hai chiều",
        "exp": "Bus dữ liệu (Data Bus) là bus hai chiều (bidirectional) vì CPU vừa có thể đọc dữ liệu từ bộ nhớ/ngoại vi vào (Input), vừa có thể ghi xuất dữ liệu từ CPU ra bộ nhớ/ngoại vi (Output).",
        "meth": "Phân biệt chiều của Bus: Address Bus là 1 chiều (ra từ CPU); Data Bus là 2 chiều; Control Bus gồm các đường 1 chiều hoặc 2 chiều.",
        "tips": "Bus 2 chiều duy nhất kết nối CPU = Bus dữ liệu."
    },
    15: {
        "ans_letter": "C",
        "ans_kw": "truyền tải dữ liệu giữa cpu và các thiết bị ngoại vi",
        "exp": "Bus dữ liệu có chức năng vận chuyển các byte/từ dữ liệu giữa CPU với các ô nhớ hoặc giữa CPU với các thiết bị ngoại vi thông qua cổng I/O.",
        "meth": "Chức năng Data Bus: Vận chuyển dữ liệu giữa CPU, bộ nhớ và ngoại vi.",
        "tips": "Data Bus -> Truyền tải dữ liệu."
    },
    16: {
        "ans_letter": "A",
        "ans_kw": "cổng vào ra",
        "exp": "Thiết bị ngoại vi (bàn phím, màn hình, cảm biến, động cơ...) không nối trực tiếp vào lõi CPU mà luôn được ghép nối thông qua các cổng vào ra (I/O Ports / I/O Interfaces).",
        "meth": "Ghép nối ngoại vi: CPU <-> Bus hệ thống <-> Cổng vào ra (I/O Ports) <-> Ngoại vi.",
        "tips": "Ngoại vi nối tới CPU qua 'Cổng vào ra' (I/O ports)."
    },
    17: {
        "ans_letter": "C",
        "ans_kw": "cả hai đáp án a và b đều đúng",
        "exp": "Vì là bus hai chiều nên chiều di chuyển của dữ liệu trên Data Bus có thể đi từ CPU đến bộ nhớ/ngoại vi (khi ghi - Write) hoặc từ bộ nhớ/ngoại vi đến CPU (khi đọc - Read). Do đó cả hai đáp án A và B đều đúng.",
        "meth": "Tính hai chiều của Data Bus: CPU -> Memory/IO (Ghi) và Memory/IO -> CPU (Đọc).",
        "tips": "Data bus 2 chiều: Đi cả 2 hướng CPU <-> Ngoại vi/Bộ nhớ."
    },
    18: {
        "ans_letter": "B",
        "ans_kw": "độ rộng bus địa chỉ",
        "exp": "Khả năng quản lý (định địa chỉ) bộ nhớ tối đa của một hệ vi xử lý phụ thuộc trực tiếp vào độ rộng của Bus địa chỉ theo công thức Dung lượng = 2^N (với N là số đường địa chỉ). Ví dụ: 16 đường -> 64 KB; 20 đường -> 1 MB; 32 đường -> 4 GB.",
        "meth": "Công thức quản lý bộ nhớ: Size = 2^(độ rộng Address Bus).",
        "tips": "Quản lý dung lượng bộ nhớ -> Phụ thuộc Độ rộng Bus địa chỉ."
    },
    19: {
        "ans_letter": "D",
        "ans_kw": "điều khiển các chế độ hoạt động của hệ thống",
        "exp": "Bus điều khiển mang các tín hiệu điều khiển phân thời và trạng thái, chịu trách nhiệm điều khiển toàn bộ các chế độ hoạt động (đọc, ghi, ngắt, treo bus...) của hệ thống vi xử lý.",
        "meth": "Chức năng Control Bus: Điều khiển các chế độ hoạt động.",
        "tips": "Control Bus -> Điều khiển chế độ hoạt động."
    },
    20: {
        "ans_letter": "B",
        "ans_kw": "cpu đến bộ nhớ và thiết bị ngoại vi",
        "exp": "Bus địa chỉ là bus một chiều (unidirectional), tín hiệu địa chỉ luôn do CPU (hoặc bộ điều khiển DMA) phát ra và truyền đi từ CPU đến bộ nhớ và các thiết bị ngoại vi để lựa chọn ô nhớ/cổng giao tiếp.",
        "meth": "Chiều Bus địa chỉ: 1 chiều duy nhất từ CPU -> Bộ nhớ và thiết bị ngoại vi.",
        "tips": "Address Bus: Chiều duy nhất CPU -> Bộ nhớ & Thiết bị ngoại vi."
    },
    21: {
        "ans_letter": "B",
        "ans_kw": "nhóm đường tín hiệu có cùng chức năng trong hệ thống vi xử lý",
        "exp": "Định nghĩa chuẩn: Bus là tập hợp một nhóm các đường dây dẫn điện (đường truyền tín hiệu song song) có cùng chức năng dùng để trao đổi thông tin giữa các khối chức năng trong hệ thống máy tính/vi xử lý.",
        "meth": "Khái niệm Bus: Nhóm đường tín hiệu có cùng chức năng.",
        "tips": "Bus = 'Nhóm đường tín hiệu có cùng chức năng'."
    },
    22: {
        "ans_letter": "A",
        "ans_kw": "bus dữ liệu",
        "exp": "Trong 3 loại bus hệ thống, chỉ có Bus dữ liệu (Data Bus) là bus truyền tin hai chiều (CPU vừa xuất vừa nhập dữ liệu). Bus địa chỉ là một chiều từ CPU phát ra, còn bus điều khiển gồm các đường đơn hướng độc lập.",
        "meth": "Loại bus 2 chiều: Duy nhất Bus dữ liệu.",
        "tips": "Bus 2 chiều = Bus dữ liệu."
    },
    23: {
        "ans_letter": "C",
        "ans_kw": "bộ nhớ nhỏ, tốc độ truy cập nhanh, dùng để lưu trữ dữ liệu tạm thời trong quá trình xử lý",
        "exp": "Thanh ghi (Register) là loại bộ nhớ dung lượng nhỏ tích hợp trực tiếp trên chip CPU, có tốc độ truy xuất cực nhanh ngang bằng tốc độ xung nhịp CPU, được dùng để lưu trữ dữ liệu tạm thời, địa chỉ hoặc trạng thái trong quá trình xử lý lệnh.",
        "meth": "Đặc tính thanh ghi: Dung lượng nhỏ, tốc độ cao nhất, chứa dữ liệu tạm thời bên trong CPU.",
        "tips": "Thanh ghi: Nhỏ + Cực nhanh + Lưu trữ tạm thời."
    },
    24: {
        "ans_letter": "C",
        "ans_kw": "từ cpu đến bộ nhớ và thiết bị ngoại vi",
        "exp": "Bus địa chỉ có chiều di chuyển tín hiệu một chiều từ CPU đến bộ nhớ và thiết bị ngoại vi (đáp án A trong nội dung câu hỏi, ký hiệu đáp án C trên giao diện chọn).",
        "meth": "Chiều Address Bus: Từ CPU đến bộ nhớ và ngoại vi.",
        "tips": "CPU luôn là nguồn phát tín hiệu địa chỉ."
    },
    25: {
        "ans_letter": "C",
        "ans_kw": "3",
        "exp": "Các thành phần trong hệ thống vi xử lý (CPU, ROM, RAM, I/O) được liên kết vật lý với nhau thông qua đúng 3 loại bus chính: Bus địa chỉ, Bus dữ liệu, và Bus điều khiển.",
        "meth": "Số lượng bus liên kết: 3 bus (Address, Data, Control).",
        "tips": "Hệ thống có 3 loại bus."
    },
    26: {
        "ans_letter": "C",
        "ans_kw": "ngõ ra của vi xử lý",
        "exp": "Do CPU là thiết bị chủ động phát sinh địa chỉ để truy xuất bộ nhớ và thiết bị ngoại vi, các chân đường truyền của Bus địa chỉ đóng vai trò là các ngõ ra (Outputs) của bộ vi xử lý.",
        "meth": "Đặc điểm Address Bus: Là các chân ngõ ra của CPU.",
        "tips": "Bus địa chỉ = Các ngõ ra của vi xử lý."
    },
    27: {
        "ans_letter": "D",
        "ans_kw": "alu, cu và các thanh ghi",
        "exp": "Khối EU (Execution Unit - Đơn vị thực thi) của bộ vi xử lý chịu trách nhiệm thực thi lệnh, bao gồm: Khối xử lý số học và logic (ALU), Khối điều khiển (CU) và Tập các thanh ghi đa năng / thanh ghi tạm thời.",
        "meth": "Cấu tạo khối EU: ALU + CU + Các thanh ghi.",
        "tips": "EU = ALU + CU + Thanh ghi."
    }
}

PART_3_DATA = {
    4: {
        "ans_letter": "A",
        "ans_kw": "a0... a13",
        "exp": "Dung lượng bộ nhớ ngoại vi là 16 KB = 16 x 1024 Byte = 16,384 Byte = 2^14 Byte. Do đó cần 14 đường địa chỉ chạy từ A0 đến A13 (từ 0 đến 13 có đúng 14 đường).",
        "meth": "Công thức tính số đường địa chỉ: Dung lượng = 2^N Byte. Với 16 KB -> N = 14 đường -> A0 đến A13.",
        "tips": "Casio 580VNX: log2(16 x 1024) = 14 -> 14 đường là A0 đến A13."
    },
    5: {
        "ans_letter": "C",
        "ans_kw": "khối eu",
        "exp": "Trong cấu trúc vi xử lý, khối thực thi EU (Execution Unit) chứa mạch giải mã lệnh (Instruction Decoder) và mạch điều khiển để phân tích mã Opcode và điều khiển thực hiện lệnh.",
        "meth": "Nhiệm vụ giải mã lệnh: Thuộc khối EU (Execution Unit).",
        "tips": "Giải mã và thực thi lệnh -> Khối EU."
    },
    6: {
        "ans_letter": "C",
        "ans_kw": "512 kbit",
        "exp": "Mã số chip nhớ bán dẫn 62512 (chuỗi RAM tĩnh SRAM họ 62xxx) có đuôi số là 512, chỉ định dung lượng chuẩn của IC là 512 Kilobit (tương đương 512 Kbit / 8 = 64 Kilobyte).",
        "meth": "Quy ước mã hiệu IC nhớ: Số đuôi chỉ dung lượng theo Kilobit (Kbit). 62512 -> 512 Kbit.",
        "tips": "Đuôi 512 = 512 Kbit (chú ý đơn vị bit, chia 8 mới ra 64 KB)."
    },
    7: {
        "ans_letter": "C",
        "ans_kw": "điều hành hoạt động của toàn hệ thống theo ý định của người sử dụng thông qua chương trình điều khiển và thi hành chương trình theo một chu kỳ được gọi là chu kỳ lệnh",
        "exp": "Nhiệm vụ đầy đủ nhất của CPU là điều hành hoạt động của toàn hệ thống máy tính theo ý định của người sử dụng thông qua chương trình điều khiển và thi hành chương trình liên tục theo từng chu kỳ lệnh (Fetch - Decode - Execute).",
        "meth": "Định nghĩa chức năng CPU: Lựa chọn phương án bao quát và đầy đủ nhất.",
        "tips": "Nhiệm vụ CPU: Điều hành hệ thống + Thi hành chương trình theo chu kỳ lệnh."
    },
    8: {
        "ans_letter": "C",
        "ans_kw": "thanh ghi ir",
        "exp": "Sau khi CPU đọc mã thao tác (Opcode) từ bộ nhớ chương trình vào trong chu kỳ tìm nạp lệnh (Fetch), mã lệnh này sẽ được lưu ngay vào Thanh ghi lệnh IR (Instruction Register) để khối giải mã phân tích.",
        "meth": "Đường đi của mã lệnh: ROM -> Data Bus -> Thanh ghi IR -> Khối giải mã lệnh.",
        "tips": "Mã lệnh đọc vào luôn chứa tại Thanh ghi IR (Instruction Register)."
    },
    9: {
        "ans_letter": "C",
        "ans_kw": "32 mb",
        "exp": "Đường địa chỉ từ A24 đến A0 có tổng cộng N = 24 - 0 + 1 = 25 đường địa chỉ. Không gian địa chỉ tối đa CPU quản lý được là 2^25 Byte = 2^5 x 2^20 Byte = 32 Megabyte (32 MB).",
        "meth": "Công thức: Số đường N = Max - Min + 1 = 25. Không gian = 2^25 B = 32 MB.",
        "tips": "Casio 580VNX: 2^(25 - 20) = 2^5 = 32 MB."
    },
    10: {
        "ans_letter": "A",
        "ans_kw": "tất cả các yếu tố",
        "exp": "Tốc độ xử lý của CPU phụ thuộc vào: Tần số xung nhịp (Clock speed), Kiến trúc CPU (pipeline, số nhân, tập lệnh RISC/CISC) và Số lượng bóng bán dẫn tích hợp trên chip. Do đó tất cả các yếu tố đều ảnh hưởng.",
        "meth": "Các yếu tố quyết định tốc độ CPU: Xung nhịp, vi kiến trúc, độ rộng bus, công nghệ bán dẫn.",
        "tips": "Tất cả các yếu tố (Kiến trúc + Bóng bán dẫn + Xung nhịp)."
    },
    11: {
        "ans_letter": "A",
        "ans_kw": "thanh ghi",
        "exp": "Bên trong CPU, tập thanh ghi (Registers) là nơi trực tiếp lưu trữ các dữ liệu và mã lệnh đang được giải mã và xử lý tại thời điểm hiện hành.",
        "meth": "Nơi lưu trữ dữ liệu/lệnh ĐANG ĐƯỢC XỬ LÝ ngay tức thời = Thanh ghi.",
        "tips": "Lệnh/dữ liệu đang được xử lý trong CPU -> Thanh ghi."
    },
    12: {
        "ans_letter": "B",
        "ans_kw": "cả ba đáp án",
        "exp": "Nguyên tắc hoạt động của CPU bao gồm: (1) Thực hiện các lệnh liên tục và tuần tự, (2) Mỗi lệnh được mã hóa bằng mã máy nhị phân (Opcode), và (3) Trao đổi thông tin với toàn hệ thống thông qua bus. Cả 3 đáp án đều đúng.",
        "meth": "Nguyên tắc CPU: Tuần tự, mã máy nhị phân, kết nối qua bus.",
        "tips": "Cả ba đáp án đều đúng."
    },
    13: {
        "ans_letter": "C",
        "ans_kw": "nhận lệnh→giải mã lệnh→nhận dữ liệu → xử lý dữ liệu→ ghi dữ liệu",
        "exp": "Thứ tự các công đoạn chuẩn trong một chu kỳ xử lý lệnh của CPU là: Nhận lệnh (Fetch) -> Giải mã lệnh (Decode) -> Nhận toán hạng/dữ liệu (Operand Fetch) -> Xử lý dữ liệu (Execute) -> Ghi kết quả (Write Back).",
        "meth": "Trình tự chu kỳ lệnh: Lấy lệnh -> Giải mã -> Lấy dữ liệu -> Xử lý -> Ghi kết quả.",
        "tips": "Bắt đầu bằng: Nhận lệnh -> Giải mã lệnh -> ..."
    },
    14: {
        "ans_letter": "B",
        "ans_kw": "8 chân",
        "exp": "Bộ nhớ ROM 8 bit (mã số 2716, 2K x 8 bit) tổ chức theo từng byte 8 bit dữ liệu (D0 - D7), do đó chip này có đúng 8 chân dữ liệu.",
        "meth": "Quy tắc: Bộ nhớ X bit thì luôn có X chân dữ liệu. ROM 8 bit -> 8 chân dữ liệu (D0-D7).",
        "tips": "Bộ nhớ 8 bit = 8 chân dữ liệu."
    },
    15: {
        "ans_letter": "D",
        "ans_kw": "16 gb",
        "exp": "Đường địa chỉ từ A33 đến A0 có tổng cộng N = 33 - 0 + 1 = 34 đường. Không gian địa chỉ tối đa = 2^34 Byte = 2^4 x 2^30 Byte = 16 Gigabyte (16 GB).",
        "meth": "Công thức: N = 34 đường. Dung lượng = 2^34 Byte = 16 GB.",
        "tips": "Casio 580VNX: 2^(34 - 30) = 2^4 = 16 GB."
    },
    16: {
        "ans_letter": "B",
        "ans_kw": "4kb",
        "exp": "Với 12 đường địa chỉ (A0 đến A11), dung lượng bộ nhớ cho phép truy cập tối đa là 2^12 Byte = 4096 Byte = 4 KB.",
        "meth": "Công thức: 2^12 Byte = 4 x 1024 Byte = 4 KB.",
        "tips": "Casio 580VNX: 2^(12 - 10) = 2^2 = 4 KB."
    },
    17: {
        "ans_letter": "A",
        "ans_kw": "cho phép đọc dữ liệu từ ram, cho phép ghi dữ liệu vào ram, mất dữ liệu khi mất nguồn điện",
        "exp": "RAM (Random Access Memory) là bộ nhớ khả biến (volatile): Cho phép cả thao tác Đọc và Ghi dữ liệu, tuy nhiên sẽ bị mất toàn bộ dữ liệu khi ngắt nguồn điện cung cấp.",
        "meth": "Đặc tính RAM: Đọc được + Ghi được + Mất dữ liệu khi mất điện.",
        "tips": "RAM = Đọc + Ghi + Mất điện là mất dữ liệu."
    },
    18: {
        "ans_letter": "C",
        "ans_kw": "cpu cấp địa chỉ, cấp tín hiệu điều khiển chọn bộ nhớ, cấp tín hiệu yêu cầu ghi bộ nhớ và cấp dữ liệu ra data bus",
        "exp": "Khi GHI dữ liệu ra bộ nhớ, CPU cần thực hiện: (1) Cấp địa chỉ ô nhớ cần ghi lên Address Bus, (2) Cấp tín hiệu điều khiển chọn bộ nhớ (/CS), (3) Cấp tín hiệu yêu cầu ghi (/WR), và (4) Đặt byte dữ liệu cần ghi ra Data Bus.",
        "meth": "Chu kỳ Ghi bộ nhớ: Cấp địa chỉ -> Chọn chip -> Tín hiệu Ghi (/WR) -> Cấp dữ liệu ra Data Bus.",
        "tips": "Ghi ra bộ nhớ: CPU chủ động 'Cấp dữ liệu ra data bus'."
    },
    19: {
        "ans_letter": "B",
        "ans_kw": "64 gb",
        "exp": "Bộ vi xử lý có 36 đường địa chỉ sẽ quản lý không gian nhớ tối đa là 2^36 Byte = 2^6 x 2^30 Byte = 64 Gigabyte (64 GB).",
        "meth": "Công thức: 2^36 Byte = 64 GB (vì 2^30 Byte = 1 GB).",
        "tips": "Casio 580VNX: 2^(36 - 30) = 2^6 = 64 GB."
    },
    20: {
        "ans_letter": "C",
        "ans_kw": "thanh ghi pc",
        "exp": "Bộ đếm chương trình PC (Program Counter) là thanh ghi chuyên dụng dùng để lưu trữ địa chỉ của lệnh kế tiếp trong bộ nhớ chương trình mà CPU sẽ tìm nạp để thực thi.",
        "meth": "Chức năng thanh ghi PC: Lưu trữ địa chỉ của lệnh kế tiếp cần thực hiện.",
        "tips": "Địa chỉ lệnh kế tiếp -> Luôn nằm trong thanh ghi PC (Program Counter)."
    },
    21: {
        "ans_letter": "B",
        "ans_kw": "a0… a12",
        "exp": "Thiết bị ngoại vi có dung lượng 8 KB = 8 x 1024 Byte = 8192 Byte = 2^13 Byte. Cần 13 đường địa chỉ, tương ứng từ A0 đến A12 (tổng cộng 13 đường).",
        "meth": "Số đường địa chỉ = log2(8 x 1024) = 13 đường -> A0 đến A12.",
        "tips": "Casio 580VNX: log2(8192) = 13 đường (A0...A12)."
    },
    22: {
        "ans_letter": "B",
        "ans_kw": "64kb",
        "exp": "Với 16 đường địa chỉ, dung lượng bộ nhớ tối đa vi xử lý truy cập được là 2^16 Byte = 65,536 Byte = 64 KB.",
        "meth": "Công thức: 2^16 B = 64 KB.",
        "tips": "16 đường địa chỉ = 64 KB (chuẩn vi điều khiển 8051)."
    },
    23: {
        "ans_letter": "D",
        "ans_kw": "256 kbit",
        "exp": "Mã số chip nhớ 62256 (hoặc 27256) có đuôi số là 256, chỉ định dung lượng chuẩn của IC là 256 Kilobit (256 Kbit = 32 Kilobyte).",
        "meth": "Mã IC: Đuôi số 256 biểu diễn 256 Kbit.",
        "tips": "Mã 256 -> 256 Kbit."
    },
    24: {
        "ans_letter": "D",
        "ans_kw": "thanh ghi chứa lệnh sắp thực hiện",
        "exp": "Bộ đếm chương trình PC (Program Counter) chứa ĐỊA CHỈ của lệnh sắp thực hiện, chứ KHÔNG chứa bản thân mã lệnh. Thanh ghi chứa mã lệnh là thanh ghi IR (Instruction Register). Do đó phát biểu 'PC là thanh ghi chứa lệnh sắp thực hiện' là SAI.",
        "meth": "Phân biệt PC và IR: PC chứa ĐỊA CHỈ lệnh; IR chứa BẢN THÂN MÃ LỆNH.",
        "tips": "PC chứa địa chỉ lệnh, KHÔNG chứa lệnh!"
    },
    25: {
        "ans_letter": "D",
        "ans_kw": "15 chân",
        "exp": "Chip nhớ RAM 8 bit mã số 61256 có dung lượng 256 Kbit = 256 / 8 = 32 KByte = 32,768 Byte = 2^15 Byte. Do đó chip này có đúng 15 chân địa chỉ (A0 đến A14).",
        "meth": "Dung lượng Byte = 256 Kbit / 8 = 32 KB = 2^15 Byte -> Cần 15 chân địa chỉ.",
        "tips": "Casio 580VNX: log2(32 x 1024) = 15 chân."
    },
    26: {
        "ans_letter": "C",
        "ans_kw": "dram",
        "exp": "DRAM (Dynamic RAM) lưu trữ dữ liệu bằng điện tích trong các tụ điện ký sinh của transistor MOS. Điện tích này bị rò rỉ theo thời gian nên bắt buộc phải có chu kỳ 'làm tươi' (Refresh Cycle) định kỳ sau vài mili-giây để duy trì dữ liệu.",
        "meth": "Đặc trưng bộ nhớ động DRAM: Phải làm tươi liên tục để tránh mất dữ liệu.",
        "tips": "Làm tươi dữ liệu (Refresh) -> Chọn ngay DRAM."
    },
    27: {
        "ans_letter": "C",
        "ans_kw": "điều khiển và phối hợp hoạt động của các thành phần trong cpu",
        "exp": "Khối điều khiển CU (Control Unit) đóng vai trò là bộ não chỉ huy của CPU, có nhiệm vụ giải mã các lệnh nạp từ bộ nhớ và phát ra các xung nhịp điều khiển để điều phối hoạt động nhịp nhàng giữa ALU, các thanh ghi và hệ thống bus.",
        "meth": "Nhiệm vụ CU: Điều khiển và phối hợp nhịp nhàng các thành phần trong CPU.",
        "tips": "Control Unit = Điều khiển và phối hợp hoạt động."
    },
    28: {
        "ans_letter": "D",
        "ans_kw": "thanh ghi",
        "exp": "Trong hệ vi xử lý, tập thanh ghi (Registers) bên trong CPU là nơi trực tiếp lưu trữ các dữ liệu và lệnh đang được xử lý trong chu kỳ lệnh hiện tại.",
        "meth": "Nơi lưu trữ tức thời lệnh và dữ liệu đang xử lý: Thanh ghi.",
        "tips": "Đang được xử lý -> Thanh ghi."
    },
    29: {
        "ans_letter": "D",
        "ans_kw": "lấy lệnh – giải mã lệnh – thực thi",
        "exp": "Chu kỳ xử lý cơ bản của CPU (Instruction Cycle) gồm 3 bước lặp lại liên tục: (1) Lấy lệnh (Fetch) từ bộ nhớ, (2) Giải mã lệnh (Decode) trong CU/EU, và (3) Thực thi lệnh (Execute) với ALU và các thanh ghi.",
        "meth": "Chu kỳ lệnh kinh điển: Lấy lệnh -> Giải mã lệnh -> Thực thi (Fetch - Decode - Execute).",
        "tips": "Quy trình chuẩn: Lấy lệnh -> Giải mã lệnh -> Thực thi."
    },
    30: {
        "ans_letter": "D",
        "ans_kw": "cpu cấp địa chỉ từ pc, cấp tín hiệu chọn bộ nhớ, cấp tín hiệu đọc bộ nhớ và lấy mã lệnh từ data bus",
        "exp": "Để đọc mã lệnh từ bộ nhớ chương trình, CPU thực hiện: (1) Cấp địa chỉ lệnh từ thanh ghi PC lên Address Bus, (2) Cấp tín hiệu chọn chip bộ nhớ ROM, (3) Cấp tín hiệu điều khiển đọc bộ nhớ (/RD hoặc /PSEN), và (4) Lấy byte mã lệnh từ Data Bus vào thanh ghi IR.",
        "meth": "Chu kỳ đọc mã lệnh: Địa chỉ từ PC -> Chọn chip -> Tín hiệu Đọc -> Lấy mã lệnh từ Data Bus.",
        "tips": "Đọc lệnh: Luôn cấp địa chỉ từ PC và lấy mã lệnh từ Data Bus."
    },
    31: {
        "ans_letter": "D",
        "ans_kw": "64 kb",
        "exp": "Chip nhớ ROM 8 bit mã hiệu 27512 có dung lượng là 512 Kilobit. Quy đổi sang byte: 512 Kbit / 8 = 64 Kilobyte (64 KB).",
        "meth": "Công thức đổi Kbit sang KB: 512 / 8 = 64 KB.",
        "tips": "27512 -> 512 / 8 = 64 KB."
    },
    32: {
        "ans_letter": "C",
        "ans_kw": "13 chân",
        "exp": "Chip nhớ ROM 8 bit 2764 có dung lượng là 64 Kbit = 64 / 8 = 8 KByte = 8192 Byte = 2^13 Byte. Do đó IC 2764 có đúng 13 chân địa chỉ (A0 đến A12).",
        "meth": "Số chân địa chỉ: 8 KB = 2^13 -> 13 chân địa chỉ.",
        "tips": "IC 2764: 64/8 = 8 KB = 2^13 -> 13 chân địa chỉ."
    },
    33: {
        "ans_letter": "A",
        "ans_kw": "8 chân",
        "exp": "IC nhớ ROM 8 bit mã số 2732 tổ chức dữ liệu theo từng byte 8 bit, do đó có đúng 8 chân dữ liệu (D0 đến D7).",
        "meth": "Bộ nhớ 8 bit luôn có 8 chân dữ liệu (D0 - D7).",
        "tips": "8 bit = 8 chân dữ liệu."
    },
    34: {
        "ans_letter": "A",
        "ans_kw": "a0… a11",
        "exp": "Dung lượng 4 KB = 4 x 1024 Byte = 4096 Byte = 2^12 Byte. Cần 12 đường địa chỉ: Từ A0 đến A11 (tổng cộng 12 đường).",
        "meth": "Số đường địa chỉ: 4 KB = 2^12 -> 12 đường địa chỉ (A0 đến A11).",
        "tips": "Casio 580VNX: log2(4096) = 12 -> A0 đến A11."
    },
    35: {
        "ans_letter": "A",
        "ans_kw": "a0… a10",
        "exp": "Dung lượng 2 KB = 2 x 1024 Byte = 2048 Byte = 2^11 Byte. Cần 11 đường địa chỉ: Từ A0 đến A10 (tổng cộng 11 đường).",
        "meth": "Số đường địa chỉ: 2 KB = 2^11 -> 11 đường địa chỉ (A0 đến A10).",
        "tips": "Casio 580VNX: log2(2048) = 11 -> A0 đến A10."
    },
    36: {
        "ans_letter": "B",
        "ans_kw": "rom",
        "exp": "Chương trình ứng dụng nhúng của vi điều khiển cần được lưu trữ cố định không bị mất khi mất nguồn điện, do đó bắt buộc phải được nạp và lưu trữ trong bộ nhớ ROM (Flash ROM / EPROM).",
        "meth": "Lưu trữ chương trình vi điều khiển: Luôn nằm trong ROM (Bộ nhớ chương trình).",
        "tips": "Chương trình vi điều khiển lưu ở ROM (Flash)."
    },
    37: {
        "ans_letter": "D",
        "ans_kw": "256kb",
        "exp": "Với 18 đường địa chỉ, không gian bộ nhớ CPU có thể truy cập tối đa là 2^18 Byte = 2^8 x 2^10 Byte = 256 Kilobyte (256 KB).",
        "meth": "Công thức: 2^18 Byte = 256 KB.",
        "tips": "Casio 580VNX: 2^(18 - 10) = 2^8 = 256 KB."
    },
    38: {
        "ans_letter": "B",
        "ans_kw": "13 chân",
        "exp": "IC RAM 8 bit mã số 6264 có dung lượng là 64 Kbit = 8 KByte = 2^13 Byte. Do đó chip này có đúng 13 chân địa chỉ (A0 đến A12).",
        "meth": "RAM 6264: 64 Kbit / 8 = 8 KB = 2^13 Byte -> 13 chân địa chỉ.",
        "tips": "6264 (8KB) -> 13 chân địa chỉ."
    },
    39: {
        "ans_letter": "B",
        "ans_kw": "ram",
        "exp": "RAM (Random Access Memory - Bộ nhớ truy cập ngẫu nhiên) cho phép CPU truy xuất đọc/ghi đến bất kỳ ô nhớ nào trong không gian nhớ với thời gian truy cập là bằng nhau, độc lập với vị trí vật lý của ô nhớ.",
        "meth": "Định nghĩa RAM: Random Access Memory (Bộ nhớ truy cập ngẫu nhiên).",
        "tips": "Truy cập ngẫu nhiên = RAM."
    },
    40: {
        "ans_letter": "A",
        "ans_kw": "11 chân",
        "exp": "Chip nhớ RAM 8 bit mã số 6116 có dung lượng 16 Kbit = 16 / 8 = 2 KByte = 2^11 Byte. Do đó chip 6116 có đúng 11 chân địa chỉ (A0 đến A10).",
        "meth": "RAM 6116: 16 Kbit / 8 = 2 KB = 2^11 Byte -> 11 chân địa chỉ.",
        "tips": "6116 (2KB) -> 11 chân địa chỉ."
    },
    41: {
        "ans_letter": "A",
        "ans_kw": "cấp địa chỉ, cấp tín hiệu điều khiển đọc bộ nhớ, nhận dữ liệu",
        "exp": "Khi thực hiện chu kỳ đọc bộ nhớ, CPU thực hiện các công việc: (1) Cấp địa chỉ ô nhớ cần đọc lên Address Bus, (2) Cấp tín hiệu điều khiển đọc bộ nhớ (/RD), và (3) Nhận dữ liệu do chip nhớ đưa lên Data Bus.",
        "meth": "Chu kỳ đọc: Cấp địa chỉ -> Cấp tín hiệu Đọc -> Nhận dữ liệu.",
        "tips": "Đọc = Cấp địa chỉ + Cấp tín hiệu đọc + Nhận dữ liệu."
    },
    42: {
        "ans_letter": "A",
        "ans_kw": "dram",
        "exp": "DRAM (Dynamic RAM) lưu trữ điện tích trong tụ điện của tế bào nhớ. Do tụ bị rò rỉ điện tự nhiên, nếu không được mạch làm tươi (Refresh) định kỳ liên tục, dữ liệu sẽ bị mất dần ngay cả khi nguồn điện cung cấp vẫn đang bật bình thường.",
        "meth": "Đặc tính DRAM: Mất dữ liệu khi đang cấp điện nếu không được làm tươi.",
        "tips": "Mất dữ liệu dù vẫn có điện -> DRAM (do thiếu làm tươi)."
    },
    43: {
        "ans_letter": "A",
        "ans_kw": "1 mb",
        "exp": "Một bộ vi xử lý có 20 đường dây địa chỉ (như họ 8086/8088) có khả năng truy xuất không gian bộ nhớ tối đa là 2^20 Byte = 1,048,576 Byte = 1 Megabyte (1 MB).",
        "meth": "Công thức: 2^20 Byte = 1 MB.",
        "tips": "20 đường địa chỉ = 1 MB (2^20 Byte)."
    },
    44: {
        "ans_letter": "C",
        "ans_kw": "1mb",
        "exp": "Với 20 đường địa chỉ, dung lượng bộ nhớ cho phép truy cập là 2^20 Byte = 1 Megabyte (1 MB).",
        "meth": "Công thức: 2^20 Byte = 1 MB.",
        "tips": "20 đường địa chỉ = 1 MB."
    },
    45: {
        "ans_letter": "A",
        "ans_kw": "14 chân",
        "exp": "Chip nhớ RAM 8 bit mã hiệu 61128 có dung lượng là 128 Kbit = 128 / 8 = 16 KByte = 2^14 Byte. Do đó chip này có đúng 14 chân địa chỉ (A0 đến A13).",
        "meth": "RAM 61128: 128 Kbit / 8 = 16 KB = 2^14 Byte -> 14 chân địa chỉ.",
        "tips": "61128 (16KB) -> 14 chân địa chỉ."
    },
    46: {
        "ans_letter": "A",
        "ans_kw": "thanh ghi ir",
        "exp": "Mã lệnh từ bộ nhớ chương trình sau khi được CPU đọc vào trong pha tìm nạp (Fetch) sẽ được chứa tại Thanh ghi lệnh IR (Instruction Register) trước khi đưa vào khối giải mã lệnh.",
        "meth": "Nơi chứa mã lệnh được đọc vào CPU: Thanh ghi IR.",
        "tips": "Mã lệnh đọc vào -> Thanh ghi IR."
    },
    47: {
        "ans_letter": "C",
        "ans_kw": "32 kb",
        "exp": "Chip nhớ ROM 8 bit mã số 27256 có dung lượng là 256 Kilobit. Quy đổi ra dung lượng byte: 256 Kbit / 8 = 32 Kilobyte (32 KB).",
        "meth": "Quy đổi: 256 / 8 = 32 KB.",
        "tips": "27256 -> 256 / 8 = 32 KB."
    },
    48: {
        "ans_letter": "A",
        "ans_kw": "128 kbit",
        "exp": "Mã số chip nhớ bán dẫn 62128 có đuôi 128 biểu thị dung lượng chuẩn của IC là 128 Kilobit (128 Kbit, tương đương 16 Kilobyte).",
        "meth": "Mã hiệu IC: Đuôi số 128 biểu thị 128 Kbit.",
        "tips": "Mã 62128 -> Dung lượng 128 Kbit."
    },
    49: {
        "ans_letter": "D",
        "ans_kw": "cho phép đọc dữ liệu từ rom, không cho phép ghi dữ liệu vào rom, không mất dữ liệu khi mất nguồn điện",
        "exp": "ROM (Read Only Memory) là bộ nhớ bất biến (non-volatile): Chỉ cho phép thao tác ĐỌC dữ liệu trong quá trình hoạt động thông thường của CPU, không cho phép ghi đè, và giữ nguyên dữ liệu vĩnh viễn không bị mất khi mất nguồn điện.",
        "meth": "Đặc tính chuẩn ROM: Chỉ đọc + Không ghi + Không mất dữ liệu khi mất điện.",
        "tips": "ROM = Chỉ đọc + Không mất dữ liệu khi cúp điện."
    },
    50: {
        "ans_letter": "D",
        "ans_kw": "nạp lệnh",
        "exp": "Giai đoạn đầu tiên trong mọi chu kỳ lệnh của CPU là giai đoạn Nạp lệnh (Instruction Fetch) - CPU phát địa chỉ từ PC để đọc mã lệnh từ bộ nhớ vào thanh ghi IR.",
        "meth": "Thứ tự chu kỳ lệnh: 1. Nạp lệnh (Fetch) -> 2. Giải mã lệnh (Decode) -> 3. Thực thi (Execute).",
        "tips": "Giai đoạn đầu tiên luôn là 'Nạp lệnh' (Fetch)."
    },
    51: {
        "ans_letter": "A",
        "ans_kw": "16 kb",
        "exp": "Chip nhớ ROM 8 bit mã số 27128 có dung lượng là 128 Kilobit. Đổi sang dung lượng byte: 128 Kbit / 8 = 16 Kilobyte (16 KB).",
        "meth": "Quy đổi: 128 / 8 = 16 KB.",
        "tips": "27128 -> 128 / 8 = 16 KB."
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

def solve_p2_question(q):
    num = q['num']
    meta = PART_2_DATA.get(num)
    if not meta:
        return None
    
    options = q.get('options', [])
    ans_letter = _match_opt(options, meta['ans_kw'], meta['ans_letter'])
            
    return {
        'id': q['id'],
        'source': q['source'],
        'exam_id': q.get('exam_id', 'PART_02'),
        'exam_title': 'Chuyên Đề Part 2: Cấu Trúc CPU & Hệ Thống Bus',
        'num': num,
        'title': f"Part 2 - Câu {num}",
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
        'topic_name': 'Cấu trúc CPU, Đơn vị điều khiển & Hệ thống Bus',
        'images': q.get('images', [])
    }

def solve_p3_question(q):
    num = q['num']
    meta = PART_3_DATA.get(num)
    if not meta:
        return None
        
    options = q.get('options', [])
    ans_letter = _match_opt(options, meta['ans_kw'], meta['ans_letter'])
            
    return {
        'id': q['id'],
        'source': q['source'],
        'exam_id': q.get('exam_id', 'PART_03'),
        'exam_title': 'Chuyên Đề Part 3: Tổ Chức Bộ Nhớ & Không Gian Địa Chỉ',
        'num': num,
        'title': f"Part 3 - Câu {num}",
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
        'level': 'TH',
        'topic_name': 'Tổ chức bộ nhớ ROM/RAM, Chu kỳ lệnh & Quản lý địa chỉ',
        'images': q.get('images', [])
    }

