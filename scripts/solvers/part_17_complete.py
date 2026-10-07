import re
from scripts.solvers.latex_helper import latexify_text

# ==============================================================================
# SPECIALIZED SOLVER FOR PART 17 (43 QUESTIONS, Q04 TO Q46)
# Topic: Truyền Thông Nối Tiếp UART (SCON, SBUF, PCON, Chế Độ 0-3, Baudrate)
# Fully Separated Prompts & Options with High Quality KaTeX Math Formatting
# ==============================================================================

PART_17_DATA = {
    4: {
        "prompt": "Trên vi điều khiển 89C51, bit RI trong thanh ghi SCON biểu thị điều gì?",
        "options": ["A. Quá trình nhận dữ liệu đang bắt đầu", "B. Quá trình nhận dữ liệu đã hoàn thành", "C. Lỗi trong quá trình nhận dữ liệu", "D. Cần phải truyền thêm dữ liệu"],
        "ans": "B",
        "topic": "Chức năng cờ ngắt nhận dữ liệu RI",
        "meth": "Bit RI (Receive Interrupt Flag) được phần cứng tự động bật lên mức 1 khi nhận xong bit Stop của khung truyền.",
        "tips": "RI = Receive Interrupt -> Báo nhận xong byte dữ liệu vào SBUF.",
        "exp": "Bit RI (Receive Interrupt Flag) nằm tại bit 0 của thanh ghi điều khiển cổng nối tiếp SCON. Khi một byte dữ liệu được thu nhận hoàn chỉnh vào thanh ghi đệm SBUF (tại điểm giữa của bit Stop), phần cứng vi điều khiển sẽ tự động đặt bit RI lên 1 để báo cho CPU biết quá trình nhận dữ liệu đã hoàn thành."
    },
    5: {
        "prompt": "Chân TXD trên vi điều khiển 89C51 có chức năng gì?",
        "options": ["A. Nhận dữ liệu", "B. Truyền dữ liệu", "C. Cấp nguồn cho vi điều khiển", "D. Đặt lại vi điều khiển"],
        "ans": "B",
        "topic": "Chức năng chân truyền dữ liệu TXD",
        "meth": "TXD (Transmit Data) là chân số 11 (P3.1), dùng xuất dòng bit dữ liệu nối tiếp ra ngoài.",
        "tips": "TXD = Transmit Data -> Chân truyền dữ liệu.",
        "exp": "Chân TXD (Transmit Data) là chức năng thứ hai của cổng P3.1 (chân số 11 trên vỏ chip vi điều khiển 89C51), được sử dụng để xuất các bit dữ liệu nối tiếp từ bộ đệm truyền ra ngoài cho thiết bị ngoại vi hoặc máy tính."
    },
    6: {
        "prompt": "Bit SM2 trong thanh ghi SCON trên vi điều khiển 89C51 dùng để làm gì?",
        "options": ["A. Bật hoặc tắt bộ Timer", "B. Điều khiển chế độ nghỉ", "C. Kích hoạt chế độ truyền nhận đa nhiệm", "D. Thiết lập tốc độ baud"],
        "ans": "C",
        "topic": "Chức năng bit SM2 - Truyền thông đa xử lý",
        "meth": "Bit SM2 cho phép truyền thông đa xử lý (Multiprocessor Communication / đa nhiệm hệ thống) trong Chế độ 2 và 3.",
        "tips": "SM2 dùng cho truyền thông đa xử lý (Multiprocessor).",
        "exp": "Bit SM2 (Serial Mode 2 bit) trong thanh ghi SCON được sử dụng để kích hoạt chế độ truyền thông đa xử lý / đa nhiệm (Multiprocessor Communication). Trong Chế độ 2 hoặc Chế độ 3, nếu SM2 = 1 thì cờ RI sẽ không được bật nếu bit thứ 9 (RB8) nhận được bằng 0, giúp các vi điều khiển tớ lọc địa chỉ hiệu quả."
    },
    7: {
        "prompt": "Trên vi điều khiển 89C51, để tăng tốc độ baud trong chế độ 1, ta điều chỉnh thông số nào?",
        "options": ["A. Điều chỉnh thanh ghi SCON", "B. Giảm tần số thạch anh", "C. Tăng tần số thạch anh hoặc điều chỉnh Timer 0", "D. Tăng tần số thạch anh hoặc điều chỉnh Timer 1"],
        "ans": "D",
        "topic": "Phương pháp điều chỉnh tốc độ Baud Chế độ 1",
        "meth": "Công thức tốc độ Baud: $\\text{Baud} = \\frac{2^{\\text{SMOD}}}{32} \\times \\frac{f_{\\text{osc}} / 12}{256 - \\text{TH1}}$. Tăng tốc độ Baud bằng cách tăng $f_{\\text{osc}}$ hoặc tăng giá trị nạp TH1 của Timer 1.",
        "tips": "Baud phụ thuộc vào thạch anh và Timer 1.",
        "exp": "Trong Chế độ 1 của cổng nối tiếp 89C51, tốc độ Baud được tạo bởi bộ tràn Timer 1 theo công thức: $\\text{Baud} = \\frac{2^{\\text{SMOD}}}{32} \\times \\frac{f_{\\text{osc}} / 12}{256 - \\text{TH1}}$. Để tăng tốc độ Baud, ta có thể tăng tần số dao động thạch anh $f_{\\text{osc}}$ hoặc điều chỉnh giá trị nạp của Timer 1 (tăng TH1)."
    },
    8: {
        "prompt": "Chân RXD trên vi điều khiển 89C51 có chức năng gì?",
        "options": ["A. Đặt lại vi điều khiển", "B. Nhận dữ liệu", "C. Truyền dữ liệu", "D. Cấp nguồn cho vi điều khiển"],
        "ans": "B",
        "topic": "Chức năng chân nhận dữ liệu RXD",
        "meth": "RXD (Receive Data) là chân số 10 (P3.0), dùng thu nhận dòng bit nối tiếp từ bên ngoài.",
        "tips": "RXD = Receive Data -> Chân nhận dữ liệu.",
        "exp": "Chân RXD (Receive Data) là chức năng thứ hai của chân cổng P3.0 (chân số 10 trên chip 89C51), có chức năng tiếp nhận các bit dữ liệu nối tiếp truyền từ bên ngoài vào thanh ghi đệm nhận của vi điều khiển."
    },
    9: {
        "prompt": "Trên vi điều khiển 89C51, khi cổng nối tiếp hoạt động ở chế độ 1, dữ liệu truyền đi có độ dài bao nhiêu bit?",
        "options": ["A. 11 bit", "B. 10 bit", "C. 8 bit", "D. 9 bit"],
        "ans": "C",
        "topic": "Số bit dữ liệu trong khung truyền Chế độ 1",
        "meth": "Chế độ 1 là chế độ UART chuẩn $8\\,\\text{bit}$ dữ liệu (cùng 1 bit Start và 1 bit Stop).",
        "tips": "Chế độ 1 truyền 8 bit dữ liệu.",
        "exp": "Ở Chế độ 1 của cổng nối tiếp 89C51, mỗi khung truyền bao gồm đúng $8\\,\\text{bit}$ dữ liệu (Data bits) lấy từ thanh ghi SBUF, kèm theo $1\\,\\text{bit}$ Start ở đầu và $1\\,\\text{bit}$ Stop ở cuối (tổng độ dài toàn khung truyền trên đường truyền là 10 bit)."
    },
    10: {
        "prompt": "Chân nào trên vi điều khiển 89C51 được sử dụng để truyền dữ liệu nối tiếp đồng bộ?",
        "options": ["A. INT0", "B. RXD", "C. TXD", "D. INT1"],
        "ans": "C",
        "topic": "Chân truyền dữ liệu trong chế độ đồng bộ",
        "meth": "Trong Chế độ 0 (chế độ đồng bộ), TXD xuất xung nhịp đồng bộ (Clock) và RXD truyền/nhận dữ liệu.",
        "tips": "Cổng nối tiếp sử dụng chân RXD và TXD.",
        "exp": "Trong hoạt động truyền thông nối tiếp của 89C51, chân TXD (P3.1) và RXD (P3.0) đảm nhiệm chức năng giao tiếp nối tiếp. Trong chế độ truyền đồng bộ Chế độ 0, chân TXD đóng vai trò phát xung nhịp đồng bộ dịch dữ liệu."
    },
    11: {
        "prompt": "Khi bit TI trong thanh ghi SCON được đặt lên mức 1, điều này có nghĩa là gì?",
        "options": ["A. Bắt đầu quá trình truyền dữ liệu", "B. Lỗi trong quá trình truyền", "C. Cần thiết lập lại cổng truyền thông", "D. Quá trình truyền dữ liệu đã hoàn thành"],
        "ans": "D",
        "topic": "Chức năng cờ ngắt truyền dữ liệu TI",
        "meth": "Bit TI (Transmit Interrupt Flag) được phần cứng tự động bật lên 1 khi truyền xong bit Stop của ký tự.",
        "tips": "TI = Transmit Interrupt -> Quá trình truyền dữ liệu đã hoàn thành.",
        "exp": "Bit TI (Transmit Interrupt Flag) trong thanh ghi SCON được phần cứng vi điều khiển tự động bật lên mức logic 1 ngay khi byte dữ liệu trong bộ đệm truyền đã được phát đi hoàn tất (khi bắt đầu truyền bit Stop), báo hiệu cho CPU sẵn sàng nạp byte tiếp theo vào SBUF."
    },
    12: {
        "prompt": "Chế độ 2 của cổng nối tiếp trên 89C51 hoạt động với tốc độ baud cố định hay thay đổi?",
        "options": ["A. Tuỳ chọn", "B. Cố định", "C. Thay đổi", "D. Không xác định"],
        "ans": "B",
        "topic": "Tốc độ Baud trong Chế độ 2",
        "meth": "Tốc độ Baud Chế độ 2 là cố định: $\\text{Baud} = \\frac{f_{\\text{osc}}}{64}$ (nếu SMOD=0) hoặc $\\frac{f_{\\text{osc}}}{32}$ (nếu SMOD=1).",
        "tips": "Chế độ 2 có tốc độ Baud cố định (không phụ thuộc Timer 1).",
        "exp": "Trong Chế độ 2 (truyền nối tiếp $9\\,\\text{bit}$), tốc độ Baud được cố định theo tần số thạch anh dao động của hệ thống: $\\text{Baud} = \\frac{2^{\\text{SMOD}}}{64} \\times f_{\\text{osc}}$, do đó có tốc độ cố định mà không cần sử dụng bộ định thời Timer 1."
    },
    13: {
        "prompt": "Bit TI được thiết lập bằng cách nào?",
        "options": ["A. Tự động khi kết thúc quá trình truyền dữ liệu", "B. Tự động khi có lỗi trong quá trình truyền", "C. Tự động khi bắt đầu quá trình truyền", "D. Tự động khi có lỗi trong quá trình nhận"],
        "ans": "A",
        "topic": "Cơ chế thiết lập cờ TI bằng phần cứng",
        "meth": "Phần cứng vi điều khiển tự động bật cờ TI lên 1 khi truyền xong toàn bộ byte dữ liệu.",
        "tips": "TI được set tự động khi kết thúc quá trình truyền.",
        "exp": "Cờ TI được phần cứng vi điều khiển tự động thiết lập lên mức 1 khi hoàn tất việc truyền khung dữ liệu ra chân TXD. Lập trình viên phải dùng phần mềm để xóa cờ này về 0 bằng lệnh `CLR TI` trước khi truyền byte tiếp theo."
    },
    14: {
        "prompt": "Quá trình truyền dữ liệu qua cổng nối tiếp trên vi điều khiển 89C51 diễn ra như thế nào?",
        "options": ["A. Từng bit một", "B. Từng khối dữ liệu", "C. Từng gói dữ liệu", "D. Từng byte một"],
        "ans": "A",
        "topic": "Đặc tính truyền thông nối tiếp Serial",
        "meth": "Truyền thông nối tiếp (Serial Communication) chuyển dịch tuần tự từng bit một trên 1 đường dây.",
        "tips": "Truyền nối tiếp = Từng bit một (tuần tự theo chu kỳ xung nhịp).",
        "exp": "Khác với truyền dữ liệu song song (truyền đồng thời cả 8 bit trên 8 đường dây bus), cổng truyền thông nối tiếp thực hiện chuyển đổi byte dữ liệu song song từ thanh ghi SBUF thành một chuỗi xung tuần tự từng bit một (Serial bit stream) để truyền trên một dây dẫn duy nhất."
    },
    15: {
        "prompt": "Trên vi điều khiển 89C51, cổng truyền thông nối tiếp dùng thanh ghi nào để lưu dữ liệu cần truyền và nhận?",
        "options": ["A. SBUF", "B. TMOD", "C. P1", "D. P0"],
        "ans": "A",
        "topic": "Thanh ghi đệm dữ liệu nối tiếp SBUF",
        "meth": "SBUF (Serial Data Buffer, địa chỉ 99H) dùng chung tên cho 2 thanh ghi đệm vật lý độc lập (truyền và nhận).",
        "tips": "SBUF = Serial Buffer -> Chứa dữ liệu truyền/nhận.",
        "exp": "Thanh ghi SBUF (Serial Data Buffer, địa chỉ $99\\text{H}$) là thanh ghi chức năng đặc biệt dùng để chứa dữ liệu truyền và nhận. Trên thực tế phần cứng gồm hai thanh ghi vật lý riêng biệt: ghi vào SBUF là ghi vào bộ đệm phát, đọc từ SBUF là đọc từ bộ đệm thu."
    },
    16: {
        "prompt": "Trên vi điều khiển 89C51, cổng nối tiếp có bao nhiêu chế độ hoạt động?",
        "options": ["A. 4", "B. 3", "C. 2", "D. 5"],
        "ans": "A",
        "topic": "Số chế độ hoạt động của cổng UART",
        "meth": "Cổng nối tiếp 89C51 có đúng 4 chế độ hoạt động: Mode 0, Mode 1, Mode 2, Mode 3.",
        "tips": "4 chế độ: Chế độ 0 (thanh ghi dịch), Chế độ 1 (8-bit UART), Chế độ 2 & 3 (9-bit UART).",
        "exp": "Cổng nối tiếp của họ 8051 có 4 chế độ hoạt động được lựa chọn thông qua 2 bit SM0 và SM1 trong thanh ghi SCON: Chế độ 0 (thanh ghi dịch 8 bit), Chế độ 1 (UART 8 bit tốc độ thay đổi), Chế độ 2 (UART 9 bit tốc độ cố định) và Chế độ 3 (UART 9 bit tốc độ thay đổi)."
    },
    17: {
        "prompt": "Trên vi điều khiển 89C51, bit SM0 và SM1 trong thanh ghi SCON dùng để làm gì?",
        "options": ["A. Bật hoặc tắt truyền thông", "B. Thiết lập chế độ truyền nhận", "C. Điều khiển chế độ nghỉ", "D. Thiết lập tốc độ baud"],
        "ans": "B",
        "topic": "Chức năng hai bit chọn chế độ SM0, SM1",
        "meth": "Tổ hợp 2 bit SM0, SM1 xác định 4 chế độ hoạt động của cổng nối tiếp.",
        "tips": "SM0 và SM1 -> Thiết lập chế độ truyền nhận của cổng nối tiếp.",
        "exp": "Hai bit SM0 (bit 7) và SM1 (bit 6) trong thanh ghi điều khiển SCON là các bit lựa chọn chế độ hoạt động (Serial Mode Select bits), quyết định số bit dữ liệu trong khung truyền và phương thức định thời tốc độ Baud."
    },
    18: {
        "prompt": "Khi cần truyền nhận dữ liệu 9 bit, ta sử dụng chế độ nào của cổng nối tiếp trên 89C51?",
        "options": ["A. Chế độ 3", "B. Chế độ 1", "C. Chế độ 2", "D. Chế độ 0"],
        "ans": "A",
        "topic": "Chế độ truyền nhận dữ liệu 9-bit",
        "meth": "Chế độ 2 và Chế độ 3 hỗ trợ truyền khung dữ liệu $9\\,\\text{bit}$ (với bit thứ 9 trong TB8/RB8).",
        "tips": "Chế độ 3 (hoặc Chế độ 2) là chế độ 9-bit UART.",
        "exp": "Khi hệ thống yêu cầu truyền nhận dữ liệu $9\\,\\text{bit}$ (thường dùng trong mạng truyền thông đa xử lý hoặc thêm bit kiểm tra chẵn lẻ Parity phần mềm), ta sử dụng Chế độ 3 (tốc độ Baud biến đổi do Timer 1 điều khiển) hoặc Chế độ 2."
    },
    19: {
        "prompt": "Làm thế nào để cấu hình tốc độ Baud cho cổng nối tiếp trên vi điều khiển 89C51?",
        "options": ["A. Sử dụng thanh ghi TCON", "B. Sử dụng thanh ghi PCON", "C. Sử dụng thanh ghi SBUF", "D. Sử dụng thanh ghi TH1"],
        "ans": "D",
        "topic": "Cấu hình tốc độ Baud bằng Timer 1",
        "meth": "Nạp giá trị chu kỳ đếm vào thanh ghi TH1 của Timer 1 hoạt động ở Chế độ 2 ($8\\,\\text{bit}$ tự nạp lại).",
        "tips": "Nạp giá trị đếm vào thanh ghi TH1 của Timer 1.",
        "exp": "Để thiết lập tốc độ Baud chuẩn (như 9600, 4800, 2400 bps) cho cổng nối tiếp ở Chế độ 1 và Chế độ 3, lập trình viên cấu hình Timer 1 hoạt động ở Chế độ 2 ($8\\,\\text{bit}$ tự nạp lại) và nạp giá trị thích hợp vào thanh ghi byte cao TH1."
    },
    20: {
        "prompt": "Cổng truyền thông nối tiếp của 89C51 sử dụng chân nào để truyền dữ liệu?",
        "options": ["A. P0.0", "B. P3.0", "C. RXD", "D. TXD"],
        "ans": "D",
        "topic": "Chân xuất tín hiệu truyền UART",
        "meth": "Chân xuất dữ liệu truyền là chân TXD (Transmit Data - chân P3.1).",
        "tips": "TXD là chân truyền dữ liệu.",
        "exp": "Cổng nối tiếp của vi điều khiển 89C51 sử dụng chân TXD (chân P3.1) để xuất các tín hiệu nhị phân truyền nối tiếp ra môi trường bên ngoài."
    },
    21: {
        "prompt": "Cổng nối tiếp trên 89C51 có bao nhiêu thanh ghi chính dùng để điều khiển và quản lý việc truyền nhận dữ liệu?",
        "options": ["A. 1 (SCON)", "B. 4 (SCON, SBUF, IE)", "C. 2 (SCON và SBUF)", "D. 3 (SCON, SBUF, TCON)"],
        "ans": "C",
        "topic": "Các thanh ghi chuyên dụng của cổng nối tiếp",
        "meth": "Hai thanh ghi cốt lõi trực tiếp của cổng nối tiếp là SCON (điều khiển) và SBUF (bộ đệm dữ liệu).",
        "tips": "2 thanh ghi: SCON và SBUF.",
        "exp": "Cổng nối tiếp của 89C51 được quản lý trực tiếp bởi hai thanh ghi chức năng đặc biệt chính: thanh ghi điều khiển cổng nối tiếp SCON (quản lý chế độ hoạt động, cờ TI/RI) và thanh ghi đệm dữ liệu SBUF (lưu trữ byte dữ liệu phát và thu)."
    },
    22: {
        "prompt": "Số bit dữ liệu truyền trong chế độ 1 của cổng nối tiếp 89C51 là bao nhiêu?",
        "options": ["A. 8 bit dữ liệu và 1 bit stop", "B. 9 bit dữ liệu và 1 bit stop", "C. 7 bit dữ liệu và 1 bit stop", "D. 10 bit dữ liệu và 2 bit stop"],
        "ans": "A",
        "topic": "Định dạng khung truyền Chế độ 1",
        "meth": "Khung Chế độ 1 có 8 bit dữ liệu, 1 bit Start và 1 bit Stop.",
        "tips": "8 bit dữ liệu và 1 bit stop.",
        "exp": "Trong Chế độ 1, định dạng khung truyền gồm 10 bit: 1 bit Start (mức 0), 8 bit dữ liệu (truyền bit LSB trước) và 1 bit Stop (mức 1). Vậy số bit dữ liệu truyền là $8\\,\\text{bit}$ dữ liệu và $1\\,\\text{bit}$ Stop."
    },
    23: {
        "prompt": "Trên vi điều khiển 89C51, để sử dụng cổng nối tiếp trong chế độ 0, ta cần thiết lập SM0 và SM1 như thế nào?",
        "options": ["A. SM0 = 1, SM1 = 0", "B. SM0 = 0, SM1 = 0", "C. SM0 = 0, SM1 = 1", "D. SM0 = 1, SM1 = 1"],
        "ans": "B",
        "topic": "Cấu hình bit SM0, SM1 cho Chế độ 0",
        "meth": "Bảng mã chế độ: Mode 0: SM0=0, SM1=0; Mode 1: SM0=0, SM1=1; Mode 2: SM0=1, SM1=0; Mode 3: SM0=1, SM1=1.",
        "tips": "Chế độ 0: SM0 = 0, SM1 = 0.",
        "exp": "Theo bảng mã chọn chế độ nối tiếp trong thanh ghi SCON: Chế độ 0 (chế độ thanh ghi dịch $8\\,\\text{bit}$) được kích hoạt khi cả hai bit $\\text{SM0} = 0$ và $\\text{SM1} = 0$."
    },
    24: {
        "prompt": "Thanh ghi nào chứa các cờ trạng thái của quá trình truyền nhận dữ liệu nối tiếp?",
        "options": ["A. PCON", "B. SCON", "C. TCON", "D. P3"],
        "ans": "B",
        "topic": "Thanh ghi lưu trữ cờ trạng thái UART SCON",
        "meth": "SCON chứa cờ ngắt truyền TI (bit 1) và cờ ngắt nhận RI (bit 0).",
        "tips": "SCON chứa các cờ TI và RI.",
        "exp": "Thanh ghi SCON (Serial Port Control Register) lưu trữ các cờ trạng thái phản ánh quá trình truyền nhận dữ liệu: cờ TI (truyền xong) và cờ RI (nhận xong)."
    },
    25: {
        "prompt": "Trên vi điều khiển 89C51, chế độ 0 của cổng nối tiếp sử dụng bao nhiêu bit dữ liệu để truyền nhận?",
        "options": ["A. 9 bit", "B. 10 bit", "C. 11 bit", "D. 8 bit"],
        "ans": "D",
        "topic": "Số bit dữ liệu trong Chế độ 0",
        "meth": "Chế độ 0 hoạt động như thanh ghi dịch 8-bit (Shift Register).",
        "tips": "Chế độ 0: 8 bit dữ liệu.",
        "exp": "Chế độ 0 là chế độ thanh ghi dịch đồng bộ, truyền hoặc nhận đúng $8\\,\\text{bit}$ dữ liệu qua chân RXD với xung nhịp đồng bộ cấp ra ở chân TXD, không có bit Start hay Stop."
    },
    26: {
        "prompt": "Khi sử dụng chế độ 3, tốc độ baud được điều chỉnh bởi khối chức năng nào?",
        "options": ["A. Thanh ghi PCON", "B. Bộ Timer 0", "C. Bộ Timer 1", "D. Thanh ghi TCON"],
        "ans": "C",
        "topic": "Nguồn tạo xung nhịp Baud cho Chế độ 3",
        "meth": "Chế độ 3 sử dụng tốc độ tràn của Timer 1 (hoặc Timer 2 trên 8052) để xác định tốc độ Baud.",
        "tips": "Chế độ 1 và Chế độ 3 dùng Timer 1 để tạo tốc độ Baud.",
        "exp": "Trong Chế độ 3 của cổng nối tiếp 89C51, tốc độ Baud có thể lập trình thay đổi được và được xác định bởi tốc độ tràn của bộ định thời Timer 1 (khi hoạt động ở Chế độ 2 tự động nạp lại)."
    },
    27: {
        "prompt": "Chế độ nào cho phép truyền và nhận dữ liệu không đồng bộ trên cổng nối tiếp của 89C51?",
        "options": ["A. Chế độ 0", "B. Chế độ 2", "C. Chế độ 3", "D. Chế độ 1"],
        "ans": "D",
        "topic": "Chế độ truyền không đồng bộ phổ biến",
        "meth": "Chế độ 1 là chế độ truyền thông nối tiếp không đồng bộ tiêu chuẩn (UART Asynchronous) $8\\,\\text{bit}$.",
        "tips": "Chế độ 1 (và cả Chế độ 2, 3) là chế độ không đồng bộ; Chế độ 0 là đồng bộ.",
        "exp": "Chế độ 1 là chế độ truyền thông không đồng bộ (Asynchronous UART) $8\\,\\text{bit}$ dữ liệu phổ biến nhất trên họ 8051, sử dụng xung nhịp nội độc lập giữa bên truyền và bên nhận mà không cần dây truyền xung Clock đồng bộ."
    },
    28: {
        "prompt": "Chế độ 3 của cổng nối tiếp trên vi điều khiển 89C51 cho phép truyền dữ liệu bao nhiêu bit?",
        "options": ["A. 9 bit", "B. 10 bit", "C. 7 bit", "D. 8 bit"],
        "ans": "A",
        "topic": "Độ dài dữ liệu trong Chế độ 3",
        "meth": "Chế độ 3 là chế độ UART $9\\,\\text{bit}$ dữ liệu với tốc độ Baud thay đổi.",
        "tips": "Chế độ 3 là 9 bit dữ liệu.",
        "exp": "Chế độ 3 của cổng nối tiếp 89C51 có cấu trúc khung truyền tương tự Chế độ 2 gồm $9\\,\\text{bit}$ dữ liệu (8 bit dữ liệu chuẩn cộng thêm bit thứ 9 TB8/RB8), điểm khác biệt là tốc độ Baud thay đổi được do Timer 1 điều khiển."
    },
    29: {
        "prompt": "Trên vi điều khiển 89C51, khi sử dụng chế độ 1, bit nào được set để biểu thị dữ liệu đã được nhận?",
        "options": ["A. RI", "B. SM1", "C. TI", "D. SM2"],
        "ans": "A",
        "topic": "Cờ nhận dữ liệu RI trong Chế độ 1",
        "meth": "Bit RI (Receive Interrupt) được bật lên 1 khi nhận xong byte dữ liệu vào SBUF.",
        "tips": "Cờ RI báo nhận dữ liệu xong.",
        "exp": "Khi cổng nối tiếp ở Chế độ 1 thu nhận hoàn tất khung truyền $8\\,\\text{bit}$ dữ liệu cùng bit Stop hợp lệ, phần cứng sẽ tự động bật cờ RI (Receive Interrupt) trong thanh ghi SCON lên mức 1."
    },
    30: {
        "prompt": "Trên vi điều khiển 89C51, tốc độ baud trong chế độ 1 của cổng nối tiếp được tính toán dựa trên các thông số nào?",
        "options": ["A. Timer 1 và PCON", "B. Tần số thạch anh và Timer 0", "C. Tần số thạch anh và Timer 1", "D. Tần số thạch anh và Timer 2"],
        "ans": "C",
        "topic": "Các đại lượng quyết định tốc độ Baud Chế độ 1",
        "meth": "Tốc độ Baud tính theo công thức: $\\text{Baud} = \\frac{2^{\\text{SMOD}}}{32} \\times \\frac{f_{\\text{osc}} / 12}{256 - \\text{TH1}}$, phụ thuộc trực tiếp vào tần số thạch anh và chu kỳ tràn của Timer 1.",
        "tips": "Tần số thạch anh và Timer 1.",
        "exp": "Tốc độ Baud của cổng nối tiếp ở Chế độ 1 phụ thuộc vào hai yếu tố chính: tần số xung nhịp dao động của thạch anh $f_{\\text{osc}}$ và giá trị nạp vào bộ đếm định thời Timer 1."
    },
    31: {
        "prompt": "Trên vi điều khiển 89C51 tốc độ baud trong chế độ 1 của cổng nối tiếp phụ thuộc vào bộ định thời nào?",
        "options": ["A. Timer 0", "B. Timer 2", "C. Timer 1", "D. Thanh ghi PCON"],
        "ans": "C",
        "topic": "Bộ định thời tạo tốc độ Baud UART",
        "meth": "Timer 1 được vi điều khiển chuẩn 89C51 phân công chuyên trách làm bộ tạo xung nhịp Baud.",
        "tips": "Timer 1 tạo Baudrate.",
        "exp": "Bộ định thời Timer 1 (khi cấu hình hoạt động ở Chế độ 2 tự động nạp lại $8\\,\\text{bit}$) là bộ đếm chịu trách nhiệm trực tiếp quyết định tốc độ truyền thông Baud của cổng nối tiếp trong Chế độ 1 và Chế độ 3."
    },
    32: {
        "prompt": "Trên vi điều khiển 89C51, để biết toàn bộ ký tự đã được nhận hay chưa, ta sử dụng lệnh kiểm tra nào dưới đây?",
        "options": ["A. JBC TF1, label", "B. JNB TI, label", "C. JBC TF0, label", "D. JNB RI, label"],
        "ans": "D",
        "topic": "Lệnh chờ ký tự nhận xong qua cờ RI",
        "meth": "Sử dụng lệnh kiểm tra bit `JNB RI, label` (Jump if Bit Not Set): lặp lại chờ đến khi bit RI được phần cứng bật lên 1.",
        "tips": "JNB RI, label -> Chờ cờ nhận RI bật lên 1.",
        "exp": "Để kiểm tra việc nhận dữ liệu nối tiếp bằng phương pháp hỏi vòng (polling), chương trình sử dụng lệnh `JNB RI, label` để lặp lại chờ đợi tại chỗ cho đến khi cờ RI được phần cứng bật lên 1 (báo hiệu toàn bộ ký tự đã nhận xong)."
    },
    33: {
        "prompt": "Chế độ 0 của cổng nối tiếp trên 89C51 sử dụng loại truyền dữ liệu nào?",
        "options": ["A. Truyền dữ liệu song song", "B. Truyền dữ liệu đồng bộ", "C. Truyền dữ liệu nối tiếp không đồng bộ", "D. Truyền dữ liệu không dây"],
        "ans": "B",
        "topic": "Phương thức truyền của Chế độ 0",
        "meth": "Chế độ 0 là truyền dữ liệu nối tiếp đồng bộ (Synchronous Serial), có xung Clock xuất tại chân TXD.",
        "tips": "Chế độ 0 là truyền đồng bộ (Synchronous).",
        "exp": "Chế độ 0 của cổng nối tiếp 89C51 là chế độ truyền dữ liệu nối tiếp đồng bộ: chân TXD luôn phát xung nhịp đồng bộ cố định có tần số bằng $\\frac{f_{\\text{osc}}}{12}$, và dữ liệu $8\\,\\text{bit}$ được truyền hoặc nhận đồng bộ qua chân RXD."
    },
    34: {
        "prompt": "Trên vi điều khiển 89C51, để thiết lập chế độ hoạt động của cổng nối tiếp, ta sử dụng thanh ghi nào?",
        "options": ["A. SCON", "B. TMOD", "C. TCON", "D. PCON"],
        "ans": "A",
        "topic": "Thanh ghi cấu hình chế độ UART SCON",
        "meth": "Thanh ghi SCON (Serial Port Control) chứa các bit SM0, SM1, SM2, REN dùng thiết lập hoạt động cổng nối tiếp.",
        "tips": "SCON thiết lập chế độ cổng nối tiếp.",
        "exp": "Thanh ghi điều khiển cổng nối tiếp SCON (địa chỉ $98\\text{H}$) chứa hai bit cấu hình chế độ SM0 và SM1, bit cho phép nhận REN và các bit điều khiển trạng thái, được sử dụng để thiết lập chế độ hoạt động cho cổng UART."
    },
    35: {
        "prompt": "Sự khác biệt giữa chế độ 1 và chế độ 2 của cổng nối tiếp trên vi điều khiển 89C51 là gì?",
        "options": ["A. Chế độ 1 là 8-bit, chế độ 2 là 9-bit", "B. Chế độ 1 là đồng bộ, chế độ 2 là không đồng bộ", "C. Chế độ 1 là 9-bit, chế độ 2 là 8-bit", "D. Chế độ 1 là không đồng bộ, chế độ 2 là đồng bộ"],
        "ans": "A",
        "topic": "So sánh Chế độ 1 và Chế độ 2",
        "meth": "Chế độ 1 truyền $8\\,\\text{bit}$ dữ liệu (Baud thay đổi); Chế độ 2 truyền $9\\,\\text{bit}$ dữ liệu (Baud cố định).",
        "tips": "Chế độ 1 là 8-bit, Chế độ 2 là 9-bit.",
        "exp": "Điểm khác biệt cốt lõi giữa hai chế độ: Chế độ 1 truyền khung dữ liệu gồm $8\\,\\text{bit}$ dữ liệu với tốc độ Baud thay đổi do Timer 1 quy định, trong khi Chế độ 2 truyền khung dữ liệu gồm $9\\,\\text{bit}$ dữ liệu với tốc độ Baud cố định phụ thuộc trực tiếp vào tần số thạch anh."
    },
    36: {
        "prompt": "Cổng truyền thông nối tiếp trên vi điều khiển 89C51 là gì?",
        "options": ["A. Một phương thức truyền dữ liệu từng byte một", "B. Một phương thức truyền dữ liệu song song", "C. Một phương thức truyền dữ liệu không dây", "D. Một phương thức truyền dữ liệu từng bit một"],
        "ans": "D",
        "topic": "Bản chất truyền thông nối tiếp Serial",
        "meth": "Truyền thông nối tiếp gửi lần lượt từng bit dữ liệu trên một đường truyền duy nhất.",
        "tips": "Truyền dữ liệu từng bit một.",
        "exp": "Cổng truyền thông nối tiếp (Serial Port) là giao diện truyền thông thực hiện phương thức truyền dữ liệu tuần tự từng bit một theo thời gian trên một kênh truyền tín hiệu, giúp tiết kiệm tối đa số lượng đường dây kết nối giữa các hệ thống."
    },
    37: {
        "prompt": "Trên vi điều khiển 89C51, thanh ghi nào lưu cấu hình tốc độ baud khi cổng nối tiếp hoạt động ở chế độ 2?",
        "options": ["A. PCON", "B. SCON", "C. TMOD", "D. TH1"],
        "ans": "A",
        "topic": "Thanh ghi PCON và bit nhân đôi tốc độ Baud SMOD",
        "meth": "Thanh ghi PCON chứa bit SMOD (bit 7): khi SMOD = 1, tốc độ Baud Chế độ 2 được nhân đôi từ $\\frac{f_{\\text{osc}}}{64}$ lên $\\frac{f_{\\text{osc}}}{32}$.",
        "tips": "PCON chứa bit SMOD điều chỉnh tốc độ Baud ở Chế độ 2.",
        "exp": "Ở Chế độ 2, tốc độ Baud không do Timer 1 điều khiển mà được quyết định bởi tần số dao động thạch anh và bit SMOD (Serial Baud Rate Double bit) nằm tại bit 7 của thanh ghi điều khiển công suất PCON (địa chỉ $87\\text{H}$)."
    },
    38: {
        "prompt": "Chân nào trên vi điều khiển 89C51 được sử dụng để nhận dữ liệu nối tiếp đồng bộ?",
        "options": ["A. SBUF", "B. TXD", "C. RXD", "D. INT1"],
        "ans": "C",
        "topic": "Chân nhận dữ liệu Chế độ 0 RXD",
        "meth": "Ở Chế độ 0 (đồng bộ), chân RXD (P3.0) là đường truyền/nhận dữ liệu hai chiều.",
        "tips": "RXD là chân nhận dữ liệu.",
        "exp": "Trong Chế độ 0 (chế độ truyền thông đồng bộ bằng thanh ghi dịch), chân RXD (chân số 10, P3.0) được sử dụng làm đường dẫn vào cho dữ liệu nối tiếp được nhận đồng bộ theo các xung nhịp cấp từ chân TXD."
    },
    39: {
        "prompt": "Trên vi điều khiển 89C51, chế độ 2 cho phép truyền dữ liệu với tốc độ baud cố định và độ dài bao nhiêu bit dữ liệu?",
        "options": ["A. 10 bit", "B. 8 bit", "C. 11 bit", "D. 9 bit"],
        "ans": "D",
        "topic": "Độ dài dữ liệu trong Chế độ 2",
        "meth": "Chế độ 2 truyền khung $9\\,\\text{bit}$ dữ liệu (cùng 1 bit Start và 1 bit Stop).",
        "tips": "Chế độ 2 truyền 9 bit dữ liệu.",
        "exp": "Chế độ 2 của cổng nối tiếp 89C51 cho phép truyền dữ liệu với tốc độ Baud cố định và độ dài phần dữ liệu là đúng $9\\,\\text{bit}$ (8 bit dữ liệu từ SBUF kết hợp bit thứ 9 được nạp từ bit TB8 trong thanh ghi SCON)."
    },
    40: {
        "prompt": "Chức năng của thanh ghi SBUF trên vi điều khiển 89C51 là gì?",
        "options": ["A. Đếm số bit truyền đi", "B. Cấu hình tốc độ baud", "C. Lưu trữ dữ liệu truyền và nhận", "D. Điều khiển ngắt"],
        "ans": "C",
        "topic": "Chức năng của bộ đệm dữ liệu UART SBUF",
        "meth": "SBUF lưu trữ byte dữ liệu đang chờ phát ra hoặc vừa mới thu nhận được.",
        "tips": "SBUF = Lưu trữ dữ liệu truyền và nhận.",
        "exp": "Thanh ghi SBUF đóng vai trò là bộ đệm dữ liệu (Serial Buffer): khi vi điều khiển cần gửi dữ liệu, ta ghi byte cần truyền vào SBUF; khi nhận được dữ liệu từ cổng nối tiếp, dữ liệu thu được sẽ được đọc ra từ SBUF."
    },
    41: {
        "prompt": "Làm thế nào để thiết lập cổng nối tiếp trên vi điều khiển 89C51 để truyền dữ liệu 8-bit không đồng bộ?",
        "options": ["A. Cấu hình bit TI và RI trong thanh ghi SCON", "B. Cấu hình bit TB8 trong thanh ghi SCON", "C. Cấu hình bit REN trong thanh ghi SCON", "D. Cấu hình bit SM0 và SM1 trong thanh ghi SCON"],
        "ans": "D",
        "topic": "Cấu hình cổng UART truyền dữ liệu 8-bit",
        "meth": "Để chọn Chế độ 1 ($8\\,\\text{bit}$ không đồng bộ), ta cấu hình $\\text{SM0} = 0$ và $\\text{SM1} = 1$ trong thanh ghi SCON.",
        "tips": "Cấu hình bit SM0 và SM1 trong thanh ghi SCON.",
        "exp": "Để thiết lập cổng nối tiếp hoạt động ở chế độ truyền nhận $8\\,\\text{bit}$ không đồng bộ (Chế độ 1), ta cần cấu hình hai bit chọn chế độ SM0 và SM1 trong thanh ghi SCON theo giá trị $\\text{SM0} = 0, \\text{SM1} = 1$."
    },
    42: {
        "prompt": "Chức năng của thanh ghi SCON trên vi điều khiển 89C51 là gì?",
        "options": ["A. Lưu trữ dữ liệu nhận được", "B. Cấu hình cổng nối tiếp", "C. Điều khiển tốc độ baud", "D. Đếm số bit truyền đi"],
        "ans": "B",
        "topic": "Chức năng tổng quát của thanh ghi SCON",
        "meth": "SCON (Serial Control) là thanh ghi chuyên dụng điều khiển và cấu hình toàn bộ hoạt động của cổng nối tiếp.",
        "tips": "SCON = Cấu hình và điều khiển cổng nối tiếp.",
        "exp": "Thanh ghi SCON (Serial Control Register) có chức năng chính là cấu hình chế độ làm việc cho cổng nối tiếp (chế độ 0, 1, 2, 3), cho phép hoặc cấm thu nhận dữ liệu (bit REN), lưu trữ bit dữ liệu thứ 9 (TB8/RB8) và quản lý các cờ ngắt truyền nhận TI và RI."
    },
    43: {
        "prompt": "Trên vi điều khiển 89C51, để báo ký tự truyền đã được hoàn tất hay chưa, ta sử dụng lệnh kiểm tra nào dưới đây?",
        "options": ["A. JBC TF1, label", "B. JNB RI, label", "C. JBC TF0, label", "D. JNB TI, label"],
        "ans": "D",
        "topic": "Lệnh kiểm tra cờ truyền dữ liệu TI",
        "meth": "Sử dụng lệnh `JNB TI, label` để lặp lại kiểm tra cờ TI: nếu TI chưa bằng 1 thì tiếp tục nhảy tới label để chờ.",
        "tips": "JNB TI, label -> Chờ cờ TI bật lên 1 báo truyền xong.",
        "exp": "Để kiểm tra xem việc truyền một byte dữ liệu nối tiếp đã hoàn thành hay chưa, vi điều khiển sử dụng lệnh rẽ nhánh `JNB TI, label` (Jump if Not Bit): chương trình sẽ dừng tại vòng lặp chờ cho đến khi cờ TI được phần cứng bật lên 1."
    },
    44: {
        "prompt": "Dữ liệu truyền và nhận qua cổng nối tiếp của 89C51 được lưu trữ tạm thời ở thanh ghi nào?",
        "options": ["A. SBUF", "B. PCON", "C. TMOD", "D. TCON"],
        "ans": "A",
        "topic": "Thanh ghi lưu trữ tạm thời SBUF",
        "meth": "SBUF là thanh ghi đệm lưu trữ tạm thời byte dữ liệu trong quá trình truyền và nhận.",
        "tips": "SBUF lưu trữ dữ liệu truyền nhận.",
        "exp": "Mọi byte dữ liệu truyền và nhận qua cổng truyền thông nối tiếp của 89C51 đều được lưu trữ tạm thời tại thanh ghi đệm dữ liệu nối tiếp SBUF (địa chỉ $99\\text{H}$)."
    },
    45: {
        "prompt": "Làm thế nào để kiểm tra xem dữ liệu đã được nhận qua cổng nối tiếp trên vi điều khiển 89C51?",
        "options": ["A. Kiểm tra bit SM0 trong thanh ghi SCON", "B. Kiểm tra bit SM1 trong thanh ghi SCON", "C. Kiểm tra bit RI trong thanh ghi SCON", "D. Kiểm tra bit TI trong thanh ghi SCON"],
        "ans": "C",
        "topic": "Kiểm tra trạng thái nhận qua bit RI",
        "meth": "Kiểm tra bit RI trong thanh ghi SCON: khi RI = 1 báo hiệu byte dữ liệu đã được nhận hoàn tất vào SBUF.",
        "tips": "Kiểm tra bit RI trong thanh ghi SCON.",
        "exp": "Để nhận biết dữ liệu đã được nhận hoàn tất qua cổng nối tiếp, chương trình thực hiện kiểm tra trạng thái của bit cờ ngắt nhận RI (Receive Interrupt) trong thanh ghi SCON: khi $\\text{RI} = 1$ có nghĩa là một byte dữ liệu hợp lệ đã sẵn sàng trong thanh ghi SBUF."
    },
    46: {
        "prompt": "Trên vi điều khiển 89C51, chế độ 1 cho phép truyền và nhận dữ liệu không đồng bộ với độ dài dữ liệu là bao nhiêu bit?",
        "options": ["A. 9 bit", "B. 7 bit", "C. 10 bit", "D. 8 bit"],
        "ans": "D",
        "topic": "Độ dài dữ liệu trong Chế độ 1",
        "meth": "Chế độ 1 có độ dài dữ liệu là 8 bit.",
        "tips": "Chế độ 1 là 8 bit dữ liệu.",
        "exp": "Chế độ 1 của cổng nối tiếp họ 8051 cho phép truyền và nhận dữ liệu không đồng bộ với độ dài trường dữ liệu hữu ích chính xác là $8\\,\\text{bit}$ (1 byte)."
    }
}

def solve_p17_question(q):
    num = q['num']
    data = PART_17_DATA.get(num)
    if not data:
        raise ValueError(f"Missing Part 17 data for question {num}")

    ans = data['ans']
    prompt = data['prompt']
    opts = data['options']

    exp = latexify_text(data['exp'])
    meth = latexify_text(data['meth'])
    tips = latexify_text(data['tips'])

    return {
        'id': q['id'],
        'source': q['source'],
        'exam_id': 'PART_17',
        'exam_title': 'Chuyên Đề Part 17: Truyền Thông Nối Tiếp UART & Baudrate 8051',
        'num': num,
        'title': f"Part 17 - Câu {num}",
        'prompt': prompt,
        'extra_lines': q.get('extra_lines', []),
        'options': opts,
        'type': 'mcq',
        'answer': ans,
        'acceptable_answers': [ans],
        'explanation': exp,
        'methodology': meth,
        'tips_casio': tips,
        'clo': 'CLO3',
        'level': 'NB' if num in [4, 5, 8, 14, 15, 16, 20, 24, 38, 40, 42, 44] else 'TH',
        'topic_name': data['topic'],
        'images': q.get('images', [])
    }
