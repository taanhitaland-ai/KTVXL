import re

# Comprehensive Solver for Part 1 (30 questions: Q4 to Q33)
# Based on verified submission (Score 28/30 + solved Q20, Q31)

PART_1_DATA = {
    4: {
        "ans_letter": "D",
        "ans_kw": "linh kiện điện tử được chế tạo từ các tranzito",
        "exp": "Vi xử lý (Microprocessor - MPU) là một linh kiện bán dẫn điện tử được chế tạo từ hàng triệu đến hàng tỷ tranzito thu nhỏ tích hợp trên một vi mạch (chíp) đơn, đóng vai trò là bộ xử lý trung tâm (CPU) thực hiện các phép tính và điều khiển toàn hệ thống.",
        "meth": "Định nghĩa chuẩn về vi xử lý: Chú ý từ khóa 'tranzito thu nhỏ tích hợp trên một vi mạch đơn'. Phân biệt với vi điều khiển (là máy tính tích hợp hoàn chỉnh gồm CPU, RAM, ROM, I/O).",
        "tips": "Từ khóa cốt lõi: 'Vi xử lý = linh kiện điện tử từ tranzito thu nhỏ trên một IC đơn'."
    },
    5: {
        "ans_letter": "D",
        "ans_kw": "risc",
        "exp": "Kiến trúc ARM (Advanced RISC Machine) là kiến trúc tập lệnh rút gọn điển hình thuộc loại RISC (Reduced Instruction Set Computer), tập trung vào các lệnh đơn giản có độ dài cố định thực thi trong 1 chu kỳ máy.",
        "meth": "Nhận biết kiến trúc ARM: ARM luôn đi liền với RISC (Advanced RISC Machine).",
        "tips": "Nhớ nhanh: Tên viết tắt của ARM chứa chữ R = RISC."
    },
    6: {
        "ans_letter": "A",
        "ans_kw": "tăng tốc độ thực thi",
        "exp": "Kỹ thuật đường ống (Pipeline) trong vi xử lý chia chu kỳ lệnh thành nhiều công đoạn (Fetch, Decode, Execute...) hoạt động gối đầu song song nhằm tăng thông lượng (throughput) và tăng tốc độ thực thi chương trình của CPU.",
        "meth": "Mục đích cốt lõi của Pipeline: Tăng tốc độ thực thi lệnh bằng cách xử lý đồng thời nhiều công đoạn lệnh.",
        "tips": "Từ khóa: Pipeline -> Tăng tốc độ thực thi lệnh."
    },
    7: {
        "ans_letter": "B",
        "ans_kw": "mã nhị phân",
        "exp": "Trong hệ thống vi xử lý, toàn bộ mã lệnh, dữ liệu và chương trình trong bộ nhớ đều được lưu trữ và mã hóa dưới dạng chuỗi bit nhị phân (0 và 1) để mạch số có thể giải mã.",
        "meth": "Bản chất máy tính số: Mọi thông tin (lệnh, dữ liệu) trong bộ nhớ đều là chuỗi bit nhị phân (Binary Code).",
        "tips": "Máy tính chỉ hiểu duy nhất hệ nhị phân (bit 0 và 1)."
    },
    8: {
        "ans_letter": "A",
        "ans_kw": "mã máy",
        "exp": "Chương trình lưu trong bộ nhớ để CPU trực tiếp nạp và thực thi bắt buộc phải ở dạng ngôn ngữ máy (Machine Language) gồm các mã thao tác (Opcode) và địa chỉ nhị phân, các ngôn ngữ bậc cao (C, Assembly) đều phải qua trình biên dịch/hợp dịch về mã máy.",
        "meth": "Phân cấp ngôn ngữ: Ngôn ngữ bậc cao -> Hợp ngữ (Assembly) -> Mã máy (Machine Code). CPU chỉ thực thi trực tiếp mã máy.",
        "tips": "CPU chỉ thực thi trực tiếp 'Mã máy' (Machine language)."
    },
    9: {
        "ans_letter": "A",
        "ans_kw": "hiệu suất hoạt động cao",
        "exp": "Vi xử lý ARM được ứng dụng trong hầu hết các thiết bị di động (smartphone, tablet) vì cân bằng tuyệt vời giữa hiệu suất hoạt động cao trên mỗi watt điện năng và mức tiêu thụ năng lượng cực thấp.",
        "meth": "Ưu điểm kiến trúc ARM: Hiệu suất cao, tiết kiệm pin, kích thước nhỏ gọn.",
        "tips": "ARM thống trị thiết bị di động nhờ: Tiêu thụ năng lượng thấp + Hiệu suất cao."
    },
    10: {
        "ans_letter": "D",
        "ans_kw": "thực hiện đồng thời nhiều lệnh",
        "exp": "Cấu trúc đường ống (Pipelining) là kỹ thuật cho phép CPU thực hiện đồng thời nhiều công đoạn của các lệnh kế tiếp nhau trong cùng một chu kỳ xung nhịp (ví dụ: khi đang thực thi lệnh N thì đồng thời giải mã lệnh N+1 và nạp lệnh N+2).",
        "meth": "Định nghĩa Pipeline: Thực hiện đồng thời các công đoạn của nhiều lệnh trong cùng một thời điểm.",
        "tips": "Pipeline = 'Dây chuyền sản xuất công nghiệp' gối đầu nhau."
    },
    11: {
        "ans_letter": "B",
        "ans_kw": "giảm độ phức tạp của lệnh",
        "exp": "Triết lý của kiến trúc RISC là giảm độ phức tạp của các câu lệnh, đưa về tập lệnh đơn giản, chiều dài cố định, đa số thực hiện trong 1 chu kỳ xung nhịp, giúp phần cứng đơn giản và chạy ở tần số cao hơn.",
        "meth": "Phân biệt RISC và CISC: RISC giảm độ phức tạp của lệnh; CISC tăng độ phức tạp của lệnh để thực hiện nhiều chức năng.",
        "tips": "RISC (Reduced) = Giảm độ phức tạp của tập lệnh."
    },
    12: {
        "ans_letter": "C",
        "ans_kw": "cortex-a: thiết bị di động; cortex-m: hệ thống nhúng",
        "exp": "Phân nhánh ARM Cortex:\n- Cortex-A (Application): Dành cho thiết bị di động, hệ điều hành phức tạp (Android, Linux).\n- Cortex-R (Real-time): Dành cho hệ thống thời gian thực yêu cầu độ trễ cực thấp (phanh ABS, viễn thông).\n- Cortex-M (Microcontroller): Dành cho vi điều khiển nhúng giá rẻ, tiết kiệm năng lượng.",
        "meth": "Mẹo nhớ 3 chữ cái Cortex: A = Application (ứng dụng cao cấp), R = Real-time (thời gian thực), M = Microcontroller (nhúng vi điều khiển).",
        "tips": "A: Di động/Smartphone; R: Thời gian thực; M: Vi điều khiển nhúng."
    },
    13: {
        "ans_letter": "B",
        "ans_kw": "32",
        "exp": "Kiến trúc ARM7TDMI ở trạng thái ARM thực thi tập lệnh 32-bit với độ rộng thanh ghi và bus dữ liệu là 32 bit. Khi chuyển sang trạng thái Thumb, lệnh được nén thành 16 bit.",
        "meth": "Trạng thái ARM7TDMI: ARM mode = 32 bit; Thumb mode = 16 bit.",
        "tips": "Trạng thái ARM -> 32 bit. Trạng thái Thumb -> 16 bit."
    },
    14: {
        "ans_letter": "C",
        "ans_kw": "cả 3 đáp án",
        "exp": "Sự khác biệt cốt lõi giữa vi xử lý (MPU) và vi điều khiển (MCU):\n1. MCU tích hợp sẵn RAM, ROM, I/O trên một chip; MPU cần ghép nối linh kiện ngoài.\n2. MPU tối ưu xử lý tính toán tốc độ cao; MCU tối ưu điều khiển thời gian thực.\n3. MCU giá thành thấp và tiêu thụ năng lượng ít hơn nhiều so với MPU. Do đó cả 3 đáp án đều đúng.",
        "meth": "Câu hỏi tổng hợp sự khác biệt MPU vs MCU: Đọc lướt thấy cả 3 ý đều đúng -> Chọn 'Cả 3 đáp án'.",
        "tips": "MPU chỉ có CPU; MCU = MPU + RAM + ROM + I/O + Timer trên 1 chip."
    },
    15: {
        "ans_letter": "B",
        "ans_kw": "máy tính được tích hợp trên một chíp",
        "exp": "Vi điều khiển (Microcontroller) là một hệ thống máy tính hoàn chỉnh được tích hợp trên một chíp đơn (Computer on a chip), thường được sử dụng trong các hệ thống nhúng để giám sát và điều khiển các thiết bị điện tử.",
        "meth": "Định nghĩa vi điều khiển: 'Một máy tính tích hợp trên một chip duy nhất'.",
        "tips": "Vi điều khiển = Computer on a chip (Máy tính trên một vi mạch)."
    },
    16: {
        "ans_letter": "C",
        "ans_kw": "cortex-a tối ưu hiệu suất cao, cortex-m tối ưu tiêu thụ năng lượng",
        "exp": "Cortex-A tập trung tối ưu hiệu năng tính toán cao chạy hệ điều hành lớn (Android, Linux); Cortex-R tối ưu độ tin cậy và phản hồi thời gian thực tức thì; Cortex-M tối ưu kích thước siêu nhỏ, giá thành thấp và tiêu thụ năng lượng siêu tiết kiệm.",
        "meth": "So sánh họ Cortex: A (Hiệu suất cao), R (Thời gian thực), M (Tiết kiệm điện và chi phí).",
        "tips": "Cortex-A = Hiệu năng cao; Cortex-M = Tiết kiệm năng lượng tối đa."
    },
    17: {
        "ans_letter": "A",
        "ans_kw": "tập lệnh đơn giản",
        "exp": "Kiến trúc ARM xây dựng trên nền tảng RISC, do đó sử dụng tập lệnh đơn giản (Reduced/Simple instructions), độ dài đồng nhất, tạo điều kiện cho mạch giải mã phần cứng tối giản và xử lý tốc độ cao.",
        "meth": "Đặc trưng tập lệnh ARM: Tập lệnh đơn giản, định dạng cố định, chủ yếu là các lệnh thao tác thanh ghi (Load/Store architecture).",
        "tips": "ARM = RISC = Tập lệnh đơn giản."
    },
    18: {
        "ans_letter": "B",
        "ans_kw": "arm cấp phép thiết kế cho các hãng",
        "exp": "Mô hình kinh doanh đặc thù của tập đoàn ARM Holdings: ARM không trực tiếp gia công sản xuất chíp vật lý, mà bán bản quyền thiết kế lõi IP (Intellectual Property) cho các hãng bán dẫn lớn (như Apple, Qualcomm, Samsung, MediaTek, NXP, STMicroelectronics) tự sản xuất và tùy biến.",
        "meth": "Mô hình kinh doanh ARM: Cấp phép bản quyền sở hữu trí tuệ (IP licensing).",
        "tips": "ARM không có nhà máy đúc chíp, ARM chỉ bán bản quyền thiết kế."
    },
    19: {
        "ans_letter": "A",
        "ans_kw": "chuỗi các bit 0 và 1",
        "exp": "Đối với vi xử lý, một câu lệnh ở mức vật lý là một chuỗi các bit nhị phân 0 và 1 (mã máy / Opcode) đưa vào thanh ghi lệnh IR để bộ giải mã lệnh (Instruction Decoder) tạo ra các vi thao tác điều khiển phần cứng.",
        "meth": "Bản chất lệnh vi xử lý: Chuỗi các bit 0 và 1 (Mã máy nhị phân).",
        "tips": "Lệnh dưới góc nhìn CPU = Chuỗi bit 0 và 1 cung cấp để thực thi."
    },
    20: {
        "ans_letter": "D",
        "ans_kw": "nhận dữ liệu từ data bus vào",
        "exp": "Khi CPU thực hiện thao tác ĐỌC dữ liệu từ thiết bị vào/ra (I/O Read):\n1. CPU phát địa chỉ cổng lên Address Bus.\n2. Cấp tín hiệu điều khiển chọn thiết bị ngoại vi (Chip Select).\n3. Cấp tín hiệu yêu cầu đọc (I/O Read).\n4. Thiết bị ngoại vi đặt dữ liệu lên Data Bus và CPU NHẬN dữ liệu từ Data Bus vào thanh ghi.",
        "meth": "Quy trình Đọc: CPU cấp địa chỉ, cấp lệnh đọc -> Dữ liệu đi TỪ ngoài VÀO CPU (Nhận dữ liệu từ Data Bus). Phương án có 'cấp dữ liệu ra' là ghi, không phải đọc.",
        "tips": "Đọc dữ liệu = CPU NHẬN dữ liệu từ Data Bus vào."
    },
    21: {
        "ans_letter": "D",
        "ans_kw": "mã nhị phân",
        "exp": "Bên trong bộ vi xử lý, tất cả thanh ghi, đường bus và mạch logic đều hoạt động trên cơ sở tín hiệu điện áp mức cao (bit 1) và mức thấp (bit 0), nghĩa là toàn bộ thông tin được lưu trữ và truyền đi dưới dạng mã nhị phân.",
        "meth": "Bản chất thông tin trong VXL: Luôn luôn là dạng mã nhị phân (Binary code).",
        "tips": "Thông tin trong VXL = Mã nhị phân."
    },
    22: {
        "ans_letter": "B",
        "ans_kw": "điều khiển",
        "exp": "Để thông báo cho thiết bị vào/ra biết CPU muốn Đọc (RD) hay Ghi (WR), hay chọn thiết bị, CPU sử dụng các đường tín hiệu của Bus điều khiển (Control Bus). Bus địa chỉ chỉ chỉ định vị trí, bus dữ liệu chỉ mang dữ liệu.",
        "meth": "Chức năng từng Bus: Bus điều khiển phát các tín hiệu RD, WR, ALE, INT... để điều phối các thao tác.",
        "tips": "Thông báo thao tác đọc/ghi -> Tín hiệu BUS Điều khiển."
    },
    23: {
        "ans_letter": "A",
        "ans_kw": "khi cpu cấp đúng địa chỉ",
        "exp": "Mỗi cổng vào/ra (I/O port) có một địa chỉ duy nhất. Mạch giải mã địa chỉ chỉ kích hoạt mở cổng cho phép truyền nhận dữ liệu khi và chỉ khi CPU phát đúng địa chỉ của cổng đó trên Bus địa chỉ.",
        "meth": "Nguyên tắc chọn cổng I/O: CPU phải cấp đúng địa chỉ cổng trên Bus địa chỉ.",
        "tips": "Cổng mở khi: CPU cấp ĐÚNG địa chỉ cổng."
    },
    24: {
        "ans_letter": "D",
        "ans_kw": "advanced risc machine",
        "exp": "ARM là từ viết tắt của 'Advanced RISC Machine' (trước đây ban đầu khi thành lập bởi hãng Acorn Computers có tên là Acorn RISC Machine).",
        "meth": "Tên viết tắt chuẩn hiện đại: Advanced RISC Machine.",
        "tips": "ARM = Advanced RISC Machine."
    },
    25: {
        "ans_letter": "A",
        "ans_kw": "cisc thường hỗ trợ nhiều chức năng phức tạp",
        "exp": "Ưu điểm của kiến trúc CISC (Complex Instruction Set Computer) là mỗi câu lệnh hỗ trợ nhiều chức năng phức tạp và chế độ định địa chỉ linh hoạt, cho phép một lệnh thực hiện chuỗi thao tác (vừa nạp, tính toán, ghi kết quả), giúp chương trình ngắn hơn về số dòng lệnh.",
        "meth": "So sánh CISC vs RISC: CISC mạnh về khả năng thực hiện lệnh phức tạp, tiết kiệm bộ nhớ ROM mã nguồn.",
        "tips": "CISC = Hỗ trợ nhiều chức năng phức tạp trên một câu lệnh."
    },
    26: {
        "ans_letter": "C",
        "ans_kw": "cả ba câu đều đúng",
        "exp": "Sự khác biệt giữa RISC và CISC:\n- RISC: Tập lệnh đơn giản, định dạng cố định, thực thi nhanh 1 chu kỳ, phần cứng gọn.\n- CISC: Tập lệnh đa dạng, độ dài thay đổi, lệnh phức tạp tốn nhiều chu kỳ, phần cứng giải mã phức tạp.\nCả 3 phương án mô tả các mặt khác nhau đều đúng.",
        "meth": "Dạng câu 'Cả ba câu đều đúng': Các phát biểu về lệnh, phần cứng và chu kỳ đều chính xác.",
        "tips": "Chọn 'Cả ba câu đều đúng'."
    },
    27: {
        "ans_letter": "A",
        "ans_kw": "cả ba đáp án đều đúng",
        "exp": "Trong kiến trúc CISC: một lệnh có thể thực hiện nhiều thao tác truy xuất ô nhớ và tính toán; giúp giảm số lượng dòng lệnh trong chương trình; nhưng bù lại phần cứng giải mã lệnh bên trong CPU trở nên phức tạp hơn rất nhiều. Cả 3 ý đều hoàn toàn đúng.",
        "meth": "Đặc tính kiến trúc CISC: Lệnh đa năng, giảm dung lượng code, phần cứng phức tạp.",
        "tips": "Chọn 'Cả ba đáp án đều đúng'."
    },
    28: {
        "ans_letter": "D",
        "ans_kw": "tiêu thụ năng lượng thấp",
        "exp": "Điểm mạnh mang tính quyết định đưa kiến trúc ARM thống trị toàn cầu (đặc biệt trong thiết bị di động và nhúng) là khả năng tối ưu điện năng cực tốt, tiêu thụ năng lượng rất thấp (Low Power Consumption) giúp kéo dài thời lượng pin.",
        "meth": "Ưu điểm số 1 của vi xử lý ARM: Tiêu thụ năng lượng cực thấp.",
        "tips": "Nhắc đến ARM -> Tiêu thụ năng lượng thấp."
    },
    29: {
        "ans_letter": "B",
        "ans_kw": "một vi mạch số hoạt động theo chương trình",
        "exp": "Bản chất vi xử lý là một vi mạch số tích hợp quy mô lớn (VLSI) hoạt động hoàn toàn theo chương trình được nạp sẵn trong bộ nhớ để tiếp nhận dữ liệu, tính toán số học - logic và điều khiển hoạt động của hệ thống.",
        "meth": "Định nghĩa tổng quát: Vi xử lý = Vi mạch số hoạt động theo chương trình nạp sẵn.",
        "tips": "Từ khóa: 'Một vi mạch số hoạt động theo chương trình'."
    },
    30: {
        "ans_letter": "B",
        "ans_kw": "thiết bị di động",
        "exp": "Dòng lõi ARM Cortex-A (Application) được thiết kế đặc thù cho các thiết bị di động thông minh (Smartphones, Tablets), Smart TV và máy tính bảng đòi hỏi hiệu năng tính toán cao và chạy hệ điều hành hoàn chỉnh.",
        "meth": "Ứng dụng họ Cortex-A: Thiết bị di động (Smartphone, Tablet).",
        "tips": "Cortex-A = Thiết bị di động (Applications)."
    },
    31: {
        "ans_letter": "A",
        "ans_kw": "cấp dữ liệu ra data bus",
        "exp": "Khi CPU thực hiện thao tác GHI dữ liệu ra thiết bị vào/ra (I/O Write):\n1. CPU phát địa chỉ cổng lên Address Bus.\n2. Phát tín hiệu chọn thiết bị.\n3. Phát tín hiệu điều khiển yêu cầu cho phép Ghi (I/O Write).\n4. CPU CẤP DỮ LIỆU ra Data Bus để cổng ngoại vi chốt dữ liệu vào mạch.",
        "meth": "Quy trình Ghi: Dữ liệu đi TỪ CPU RA ngoài -> CPU CẤP dữ liệu ra Data Bus. (Khác với đọc là CPU nhận dữ liệu vào).",
        "tips": "Ghi dữ liệu = CPU CẤP dữ liệu ra Data Bus."
    },
    32: {
        "ans_letter": "C",
        "ans_kw": "tập hợp các lệnh sắp xếp theo một thuật toán",
        "exp": "Chương trình (Program) trong hệ thống vi xử lý là một tập hợp tuần tự các câu lệnh được người lập trình sắp xếp theo một thuật toán xác định nhằm giải quyết một bài toán hoặc thực hiện một nhiệm vụ cụ thể.",
        "meth": "Định nghĩa chương trình máy tính: Tập hợp các lệnh sắp xếp theo thuật toán.",
        "tips": "Chương trình = Tập hợp các lệnh sắp xếp theo thuật toán."
    },
    33: {
        "ans_letter": "C",
        "ans_kw": "tập lệnh đơn giản",
        "exp": "Để tối ưu hóa hiệu suất tính toán và giảm thiểu năng lượng tiêu thụ, vi xử lý ARM áp dụng tập lệnh đơn giản (RISC), cấu trúc giải mã lệnh đồng nhất giúp rút ngắn thời gian xử lý và giảm số lượng bóng bán dẫn trên chip.",
        "meth": "Bản chất tối ưu của ARM: Sử dụng tập lệnh đơn giản (RISC).",
        "tips": "ARM tối ưu hóa bằng: Tập lệnh đơn giản."
    }
}

def solve_p1_question(q):
    num = q['num']
    meta = PART_1_DATA.get(num)
    if not meta:
        return None
    
    # Match exact option letter
    options = q.get('options', [])
    ans_letter = meta['ans_letter']
    kw = meta['ans_kw'].lower()
    
    for idx, opt in enumerate(options):
        opt_clean = re.sub(r'^[A-D][\.:]\s*', '', opt).strip().lower()
        if kw in opt_clean:
            ans_letter = chr(65 + idx)
            break
            
    return {
        'id': q['id'],
        'source': q['source'],
        'exam_id': q.get('exam_id', 'PART_01'),
        'exam_title': 'Chuyên Đề Part 1: Tổng Quan Vi Xử Lý & ARM',
        'num': num,
        'title': f"Part 1 - Câu {num}",
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
        'topic_name': 'Tổng quan vi xử lý, kiến trúc ARM & RISC/CISC',
        'images': q.get('images', [])
    }
