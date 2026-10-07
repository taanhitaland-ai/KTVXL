import re
from scripts.solvers.latex_helper import latexify_text

# ==============================================================================
# SPECIALIZED SOLVER FOR PART 13 (40 QUESTIONS, Q04 TO Q43)
# Topic: Chương Trình Con, Vòng Lặp Trễ Delay, Phép Toán Số Học/Logic & Timer
# Mapped 100% to Official Exam & Grading Solutions with LaTeX Formula Typography
# ==============================================================================

PART_13_DATA = {
    4: {
        "type": "fib", "ans": "28",
        "topic": "Hoàn thiện giá trị phép toán nhân số học MUL AB",
        "meth": "Tích của A và B: $B \\times 256 + A = 2 \\times 256 + 58\\text{H} = 512 + 88 = 600$ (thập phân $0258\\text{H}$). Với $A = 15$ ($0\\text{F}\\text{H}$), giá trị cần nạp là $B = 600 / 15 = 40$ (tương ứng $28\\text{H}$).",
        "tips": "Casio 580VNX (MENU 3 Base-N): Bấm $(2 \\times 256 + 58\\text{H}) / 15$, đổi sang HEX được 28H. Điền số: 28.",
        "exp": "Sau lệnh `MUL AB`, thanh ghi B chứa byte cao và A chứa byte thấp của tích $16\\,\\text{bit}$. Ở đây $(B)=02\\text{H}$ và $(A)=58\\text{H}$, tức giá trị tích là $0258\\text{H} = 600$. Với thừa số $A = 15$ thập phân ($0\\text{F}\\text{H}$), thừa số còn lại là $B = 600 / 15 = 40 = 28\\text{H}$."
    },
    5: {
        "type": "mcq", "ans": "B",
        "topic": "Hàm con tạo thời gian trễ 2 vòng lặp lồng nhau",
        "meth": "Thời gian trễ $T_{\\text{delay}} = R6 \\times R5 \\times 2\\,\\mu\\text{s} = 10 \\times 250 \\times 2\\,\\mu\\text{s} = 5000\\,\\mu\\text{s}$.",
        "tips": "Vòng lặp trong 250 x 2µs = 500µs; lặp lại 10 lần -> 5000µs.",
        "exp": "Chương trình con sử dụng hai vòng lặp lồng nhau: vòng lặp trong với thanh ghi R5 đếm 250 lần tiêu tốn khoảng $500\\,\\mu\\text{s}$, vòng lặp ngoài với thanh ghi R6 lặp 10 lần. Tổng thời gian trễ do chương trình con tạo ra là $10 \\times 500\\,\\mu\\text{s} = 5000\\,\\mu\\text{s}$."
    },
    6: {
        "type": "mcq", "ans": "A",
        "topic": "Timer 0 tạo xung lệch đối xứng (Duty Cycle)",
        "meth": "Nạp TH0 tạo mức cao $200\\,\\mu\\text{s}$ và mức thấp $40\\,\\mu\\text{s}$ trên chân cổng P1.6.",
        "tips": "Thời gian mức cao 200µs và mức thấp 40µs.",
        "exp": "Chương trình cấu hình Timer 0 với hai khoảng định thời khác nhau: nạp giá trị đếm tương ứng $200\\,\\mu\\text{s}$ khi chân P1.6 ở mức cao và $40\\,\\mu\\text{s}$ khi P1.6 ở mức thấp, tạo ra sóng vuông không đối xứng có xung cao $200\\,\\mu\\text{s}$ và xung thấp $40\\,\\mu\\text{s}$ trên chân P1.6."
    },
    7: {
        "type": "fib", "ans": "3B",
        "topic": "Phép toán logic XRL tìm toán hạng ban đầu",
        "meth": "Phép toán $A \\oplus 0\\text{F}\\text{H} = 34\\text{H} \\implies A = 34\\text{H} \\oplus 0\\text{F}\\text{H} = 0011\\,0100_2 \\oplus 0000\\,1111_2 = 0011\\,1011_2 = 3\\text{B}\\text{H}$.",
        "tips": "Casio 580VNX (MENU 3): Bấm 34H XOR 0FH = 3BH. Điền: 3B.",
        "exp": "Để sau lệnh `XRL A, #0FH` nội dung thanh ghi A có giá trị $34\\text{H}$, do tính chất hai chiều của phép XOR ($X \\oplus Y = Z \\iff X = Z \\oplus Y$), giá trị cần hoàn thiện là $34\\text{H} \\oplus 0\\text{F}\\text{H} = 3\\text{B}\\text{H}$."
    },
    8: {
        "type": "fib", "ans": "32",
        "topic": "Phép xoay bit phải RR A tìm giá trị ban đầu",
        "meth": "Thao tác xoay phải: bit 0 chuyển sang bit 7. Nghịch đảo của xoay phải là xoay trái (RL). $19\\text{H} = 0001\\,1001_2 \\xrightarrow{\\text{RL}} 0011\\,0010_2 = 32\\text{H}$.",
        "tips": "Xoay ngược lại (xoay trái 1 bit): 19H x 2 = 32H. Điền: 32.",
        "exp": "Để thanh ghi A đạt giá trị $19\\text{H}$ ($0001\\,1001_2$) sau khi thực hiện lệnh xoay phải `RR A`, giá trị ban đầu của thanh ghi A trước khi xoay phải là kết quả của phép xoay trái một bit: $0011\\,0010_2 = 32\\text{H}$."
    },
    9: {
        "type": "mcq", "ans": "C",
        "topic": "Lệnh so sánh rẽ nhánh CJNE với số thập phân",
        "meth": "R1 được nạp $30\\text{H}$ ($48$ thập phân). So sánh `CJNE R1, #30, NHAN`: vì $48 \\neq 30$, điều kiện nhảy thỏa mãn, CPU nhảy tới nhãn `NHAN` và gán $A = 54\\text{H}$.",
        "tips": "#30 không có chữ H là số thập phân (30 = 1EH != 30H) -> Nhảy tới NHAN -> A = 54H.",
        "exp": "Thanh ghi R1 mang giá trị Hex $30\\text{H}$ (tương ứng 48 thập phân). Lệnh `CJNE R1, #30, NHAN` so sánh R1 với hằng số thập phân 30 ($1\\text{E}\\text{H}$): vì $48 \\neq 30$, nhánh nhảy được thực hiện tới nhãn `NHAN: MOV A, #54H`, kết quả trong A là $54\\text{H}$."
    },
    10: {
        "type": "mcq", "ans": "D",
        "topic": "Vòng lặp xoay trái tròn 8 lần chu kỳ đầy đủ",
        "meth": "Một byte gồm 8 bit, thực hiện lệnh `RL A` đủ 8 lần trong vòng lặp DJNZ sẽ đưa các bit trở về đúng vị trí xuất phát ban đầu: $A = 3\\text{B}\\text{H}$.",
        "tips": "Xoay trái đủ 8 lần một byte 8 bit -> Giá trị giữ nguyên không đổi là 3BH.",
        "exp": "Đoạn chương trình nạp $A = 3\\text{B}\\text{H}$ và thiết lập vòng lặp xoay trái `RL A` lặp lại đúng 8 lần bằng thanh ghi R1 (`DJNZ R1, LAP`). Sau 8 lần xoay vòng tròn một byte $8\\,\\text{bit}$, toàn bộ các bit trở về vị trí ban đầu, nội dung thanh ghi A vẫn là $3\\text{B}\\text{H}$."
    },
    11: {
        "type": "mcq", "ans": "B",
        "topic": "Thuật toán đếm độ dài khối dữ liệu kết thúc bằng ký tự đặc biệt",
        "meth": "Khởi tạo con trỏ $R0 = 40\\text{H}$, đọc và tăng con trỏ, kiểm tra kết thúc khối dữ liệu.",
        "tips": "Khởi tạo con trỏ R0 tại 40H -> Đếm độ dài khối từ địa chỉ 40H.",
        "exp": "Chương trình nạp con trỏ địa chỉ gián tiếp $R0 = 40\\text{H}$, duyệt tuần tự từng ô nhớ trong bộ nhớ RAM nội và so sánh với ký tự đánh dấu kết thúc (như $00\\text{H}$ hoặc $\\text{FFH}$), thực hiện chức năng: Đếm độ dài của khối dữ liệu có địa chỉ bắt đầu từ địa chỉ $40\\text{H}$."
    },
    12: {
        "type": "fib", "ans": "04",
        "topic": "Lệnh đảo 4-bit nibble SWAP A",
        "meth": "Lệnh SWAP tráo đổi 4 bit cao và 4 bit thấp. Kết quả $40\\text{H} \\implies$ ban đầu là $04\\text{H}$.",
        "tips": "Đảo vị trí 2 chữ số hexa của 40H -> 04H. Điền: 04.",
        "exp": "Lệnh `SWAP A` hoán đổi vị trí của 4 bit cao và 4 bit thấp trong thanh ghi tích lũy A. Để thu được kết quả $A = 40\\text{H}$ ($0100\\,0000_2$), giá trị ban đầu trong thanh ghi A phải là $04\\text{H}$ ($0000\\,0100_2$)."
    },
    13: {
        "type": "fib", "ans": "40",
        "topic": "Hoàn thiện toán hạng nhân số học MUL AB",
        "meth": "Kết quả: $B = 05\\text{H}$, $A = 40\\text{H} \\implies 0540\\text{H} = 1344$ (thập phân). Với $A = 15\\text{H} = 21$, suy ra $B = 1344 / 21 = 64 = 40\\text{H}$.",
        "tips": "Casio 580VNX: 0540H / 15H = 40H. Điền: 40.",
        "exp": "Sau khi thực hiện phép nhân `MUL AB`, tích số $16\\,\\text{bit}$ lưu trong cặp thanh ghi BA có giá trị $0540\\text{H} = 1344$. Thừa số thứ nhất trong thanh ghi A là $15\\text{H} = 21$, do đó thừa số thứ hai trong thanh ghi B là $1344 / 21 = 64 = 40\\text{H}$."
    },
    14: {
        "type": "fib", "ans": "26",
        "topic": "Bật các bit độc lập của cổng P0 bằng lệnh ORL",
        "meth": "Mặt nạ bật bit 1, 2, 5: $2^1 + 2^2 + 2^5 = 2 + 4 + 32 = 38$ thập phân $= 26\\text{H}$.",
        "tips": "Casio 580VNX: 2^1 + 2^2 + 2^5 = 38 -> Đổi sang Hex: 26H. Điền: 26.",
        "exp": "Để bật các bit thứ 1, 2 và 5 của cổng P0 lên mức 1 mà không làm thay đổi các bit khác, ta thực hiện phép logic OR với mặt nạ nhị phân có các bit 1 tại vị trí 1, 2, 5: $0010\\,0110_2 = 26\\text{H}$."
    },
    15: {
        "type": "mcq", "ans": "D",
        "topic": "Vòng lặp khởi tạo mảng bộ nhớ RAM ngoại",
        "meth": "Con trỏ DPTR chạy từ $1000\\text{H}$ đến $1050\\text{H}$, ghi dữ liệu $00\\text{H}$ vào từng ô nhớ.",
        "tips": "Ghi 0 vào dải địa chỉ 1000H đến 1050H.",
        "exp": "Chương trình khởi tạo con trỏ địa chỉ ngoài $\\text{DPTR} = 1000\\text{H}$, sử dụng lệnh `MOVX @DPTR, A` với $A = 0$ và tăng dần DPTR đến địa chỉ $1050\\text{H}$, thực hiện chức năng: Xóa nội dung trong ô nhớ từ $1000\\text{H}$ đến $1050\\text{H}$ về 0."
    },
    16: {
        "type": "fib", "ans": "31",
        "topic": "Phép nhân MUL AB tìm giá trị nạp vào B",
        "meth": "Tích $0\\text{D}35\\text{H} = 3381$. Thừa số ban đầu trong ô nhớ $30\\text{H} = 45\\text{H} = 69$. Suy ra giá trị của B là $3381 / 69 = 49 = 31\\text{H}$.",
        "tips": "Casio 580VNX: 0D35H / 45H = 31H. Điền: 31.",
        "exp": "Kết quả phép nhân lưu trong cặp thanh ghi BA là $0\\text{D}35\\text{H} = 3381$. Biết toán hạng trong thanh ghi A trước khi nhân là $45\\text{H} = 69$, giá trị toán hạng trong thanh ghi B là $3381 / 69 = 49 = 31\\text{H}$."
    },
    17: {
        "type": "mcq", "ans": "B",
        "topic": "Chương trình con tạo trễ 1 giây (1s)",
        "meth": "Sử dụng 3 vòng lặp lồng nhau với số lần lặp tổng cộng xấp xỉ $500{,}000$ chu kỳ máy $\\implies T = 1\\,\\text{s}$.",
        "tips": "3 vòng lặp lồng nhau (R7=4, R6=250, R5=250) -> Tạo trễ thời gian 1s.",
        "exp": "Chương trình con sử dụng cấu trúc ba vòng lặp lồng nhau tiêu tốn xấp xỉ $1{,}000{,}000\\,\\mu\\text{s}$ (với thạch anh $12\\,\\text{MHz}$), thực hiện chức năng tạo khoảng thời gian trễ chuẩn là $1\\,\\text{s}$ ($1000\\,\\text{ms}$)."
    },
    18: {
        "type": "fib", "ans": "60",
        "topic": "Hoàn thiện địa chỉ con trỏ RAM nội R1",
        "meth": "Lệnh `ANL A, @R1` thực hiện phép AND giữa A với ô nhớ do R1 trỏ tới để A đạt $1\\text{C}\\text{H}$. Con trỏ $R1 = 60\\text{H}$.",
        "tips": "Con trỏ R1 nạp địa chỉ 60H. Điền: 60.",
        "exp": "Để lệnh gián tiếp `ANL A, @R1` đọc đúng byte dữ liệu từ ô nhớ RAM nội tương ứng nhằm cho kết quả $A = 1\\text{C}\\text{H}$, thanh ghi con trỏ R1 cần được nạp giá trị địa chỉ ô nhớ là $60\\text{H}$."
    },
    19: {
        "type": "fib", "ans": "4E",
        "topic": "Nạp giá trị tức thời vào thanh ghi R1",
        "meth": "Lệnh `MOV R1, #4EH` trực tiếp nạp giá trị $4\\text{E}\\text{H}$ vào thanh ghi R1.",
        "tips": "Điền trực tiếp: 4E.",
        "exp": "Để thanh ghi R1 có nội dung là $4\\text{E}\\text{H}$, giá trị hằng số tức thời cần hoàn thiện vào sau tiền tố '#' là $4\\text{E}\\text{H}$."
    },
    20: {
        "type": "fib", "ans": "40",
        "topic": "Địa chỉ ô nhớ con trỏ R0 cập nhật thanh ghi A",
        "meth": "Nạp địa chỉ $40\\text{H}$ vào con trỏ R0 để truy xuất dữ liệu ô nhớ chứa giá trị $27\\text{H}$.",
        "tips": "Con trỏ nạp địa chỉ 40H. Điền: 40.",
        "exp": "Để chương trình truy xuất đúng ô nhớ chứa dữ liệu cần thiết đưa vào thanh ghi tích lũy A đạt giá trị $27\\text{H}$, giá trị địa chỉ nạp vào thanh ghi con trỏ là $40\\text{H}$."
    },
    21: {
        "type": "fib", "ans": "40",
        "topic": "Hoàn thiện giá trị địa chỉ cho ô nhớ 20H",
        "meth": "Thực hiện gán giá trị thông qua con trỏ địa chỉ gián tiếp để ô nhớ $20\\text{H}$ nhận giá trị $13\\text{H}$.",
        "tips": "Điền số: 40.",
        "exp": "Để ô nhớ tại địa chỉ $20\\text{H}$ có nội dung là $13\\text{H}$, giá trị tham số cần điền vào chỗ trống trong đoạn chương trình là $40\\text{H}$."
    },
    22: {
        "type": "mcq", "ans": "C",
        "topic": "Chương trình con tạo trễ 1 mili-giây (1ms)",
        "meth": "Hai vòng lặp lồng nhau tiêu tốn xấp xỉ 500 chu kỳ máy $\\implies T = 500 \\times 2\\,\\mu\\text{s} = 1000\\,\\mu\\text{s} = 1\\,\\text{ms}$.",
        "tips": "Tổng chu kỳ tiêu tốn ~ 1000µs -> Tạo trễ thời gian 1ms.",
        "exp": "Chương trình con sử dụng hai vòng lặp với các giá trị thanh ghi đếm được thiết lập để tiêu tốn đúng khoảng thời gian $1000\\,\\mu\\text{s}$ (chu kỳ máy $2\\,\\mu\\text{s}$ với thạch anh $6\\,\\text{MHz}$), thực hiện chức năng: Tạo trễ thời gian $1\\,\\text{ms}$."
    },
    23: {
        "type": "mcq", "ans": "B",
        "topic": "Lệnh so sánh rẽ nhánh CJNE bằng nhau không nhảy",
        "meth": "R1 được nạp $2\\text{B}\\text{H}$. Lệnh `CJNE R1, #2BH, NHAN`: hai toán hạng bằng nhau ($2\\text{B}\\text{H} == 2\\text{B}\\text{H}$), KHÔNG rẽ nhánh, thực hiện lệnh tuần tự `MOV A, #4BH`.",
        "tips": "CJNE với cùng giá trị 2BH -> Không nhảy -> A = 4BH.",
        "exp": "Thanh ghi R1 mang giá trị $2\\text{B}\\text{H}$. Lệnh `CJNE R1, #2BH, NHAN` so sánh hai giá trị bằng nhau nên không thực hiện bước nhảy sang nhãn `NHAN`, CPU tiếp tục thực hiện câu lệnh kế tiếp là `MOV A, #4BH` rồi kết thúc. Giá trị trong A là $4\\text{B}\\text{H}$."
    },
    24: {
        "type": "fib", "ans": "40",
        "topic": "Phép toán dịch/xoay bit để A đạt 80H",
        "meth": "Hoàn thiện giá trị nạp $40\\text{H}$ ($0100\\,0000_2$), sau lệnh dịch trái hoặc nhân đôi ta được $A = 80\\text{H}$ ($1000\\,0000_2$).",
        "tips": "80H chia 2 = 40H. Điền: 40.",
        "exp": "Để thanh ghi tích lũy A đạt giá trị $80\\text{H}$ sau khi thực hiện thao tác xoay trái `RL A`, giá trị ban đầu cần nạp vào thanh ghi A là $80\\text{H} / 2 = 40\\text{H}$."
    },
    25: {
        "type": "mcq", "ans": "C",
        "topic": "Timer 0 tạo xung chu kỳ với xung cao 40µs và xung thấp 200µs",
        "meth": "Nạp hai giá trị định thời vào Timer 0: khoảng thời gian mức cao là $40\\,\\mu\\text{s}$ và khoảng thời gian mức thấp là $200\\,\\mu\\text{s}$ trên chân P1.6.",
        "tips": "Xung cao 40µs và xung thấp 200µs trên chân P1.6.",
        "exp": "Chương trình sử dụng Timer 0 ở Chế độ 1 với hai lần nạp giá trị khác nhau giữa hai trạng thái bật và tắt chân P1.6: thời gian xung ở mức cao duy trì trong $40\\,\\mu\\text{s}$ và thời gian xung ở mức thấp duy trì trong $200\\,\\mu\\text{s}$."
    },
    26: {
        "type": "fib", "ans": "2D",
        "topic": "Nghịch đảo phép xoay trái RL A để A đạt 5AH",
        "meth": "Sau lệnh xoay trái `RL A`, $A = 5\\text{A}\\text{H} = 0101\\,1010_2$. Nghịch đảo xoay trái là xoay phải: $0010\\,1101_2 = 2\\text{D}\\text{H}$.",
        "tips": "5AH chia 2 = 2DH. Điền: 2D.",
        "exp": "Để sau lệnh xoay trái `RL A` nội dung trong thanh ghi A là $5\\text{A}\\text{H}$ ($0101\\,1010_2$), giá trị ban đầu trước khi xoay trái phải là kết quả của phép xoay phải một bit: $0010\\,1101_2 = 2\\text{D}\\text{H}$."
    },
    27: {
        "type": "mcq", "ans": "C",
        "topic": "Thuật toán tìm giá trị nhỏ nhất (Min) của mảng số",
        "meth": "Khởi tạo A bằng phần tử đầu, duyệt mảng với `SUBB A, @R1`, nếu có mượn (CY=1) tức phần tử mới nhỏ hơn A thì cập nhật lại A.",
        "tips": "Dùng SUBB kiểm tra cờ mượn để cập nhật giá trị nhỏ hơn -> Tìm giá trị nhỏ nhất.",
        "exp": "Chương trình thực hiện so sánh nội dung thanh ghi A với từng phần tử trong dãy số bộ nhớ thông qua lệnh trừ có mượn `SUBB`. Khi phát hiện phần tử mới nhỏ hơn giá trị hiện tại của A (cờ nhớ CY xuất hiện), chương trình cập nhật giá trị mới vào A, thực hiện thuật toán tìm giá trị nhỏ nhất."
    },
    28: {
        "type": "fib", "ans": "4B",
        "topic": "Hoàn thiện giá trị để thanh ghi A đạt 7CH",
        "meth": "Phép toán cộng số học để tổng trong thanh ghi A đạt giá trị mục tiêu $7\\text{C}\\text{H}$. Giá trị nạp là $4\\text{B}\\text{H}$.",
        "tips": "Điền: 4B.",
        "exp": "Để sau các lệnh cộng và hiệu chỉnh thanh ghi A có kết quả là $7\\text{C}\\text{H}$, giá trị tham số cần hoàn thiện vào câu lệnh nạp tức thời là $4\\text{B}\\text{H}$."
    },
    29: {
        "type": "fib", "ans": "3E",
        "topic": "Hoàn thiện giá trị để thanh ghi A đạt 2CH",
        "meth": "Phép toán số học để nội dung thanh ghi A đạt $2\\text{C}\\text{H}$. Giá trị nạp là $3\\text{E}\\text{H}$.",
        "tips": "Điền: 3E.",
        "exp": "Giá trị cần nạp vào thanh ghi để sau khi thực thi đoạn mã đạt kết quả mong muốn $A = 2\\text{C}\\text{H}$ là $3\\text{E}\\text{H}$."
    },
    30: {
        "type": "mcq", "ans": "B",
        "topic": "Hàm con tạo thời gian trễ 500 mili-giây (500ms)",
        "meth": "Ba vòng lặp lồng nhau tiêu tốn xấp xỉ $500{,}000$ chu kỳ máy (với $T_{\\text{cm}} = 1\\,\\mu\\text{s}$) $\\implies T = 500\\,\\text{ms}$.",
        "tips": "R7=5, R6=200, R5=250 -> 5 x 200 x 250 x 2 = 500,000µs = 500ms.",
        "exp": "Chương trình con sử dụng ba vòng lặp lồng nhau với tích các số đếm $5 \\times 200 \\times 250$ tiêu tốn khoảng $500{,}000$ chu kỳ máy, tương đương khoảng thời gian trễ chuẩn là $500\\,\\text{ms}$."
    },
    31: {
        "type": "fib", "ans": "58",
        "topic": "Phép toán logic ANL để thanh ghi A đạt 91H",
        "meth": "Hoàn thiện giá trị nạp vào để sau phép AND logic với dữ liệu có sẵn thu được kết quả $A = 91\\text{H}$. Giá trị là $58\\text{H}$.",
        "tips": "Điền: 58.",
        "exp": "Giá trị số Hex cần hoàn thiện vào chỗ trống của câu lệnh để thanh ghi A đạt kết quả mong muốn $91\\text{H}$ sau các thao tác xử lý logic là $58\\text{H}$."
    },
    32: {
        "type": "mcq", "ans": "D",
        "topic": "Vòng lặp giảm liên tiếp 10 lần từ giá trị 100",
        "meth": "$A = 100$ (thập phân), lặp 10 lần `DEC A` $\\implies A = 100 - 10 = 90$ (thập phân). Đổi 90 sang Hex: $90 = 5 \\times 16 + 10 = 5\\text{A}\\text{H}$.",
        "tips": "100 - 10 = 90 (thập phân) -> HEX: 5AH.",
        "exp": "Thanh ghi A được khởi tạo giá trị thập phân 100. Vòng lặp `DEC A` lặp 10 lần qua lệnh `DJNZ R1, LAP` (với R1 nạp bằng 10). Giá trị còn lại trong A là $100 - 10 = 90$ thập phân. Đổi sang hệ thập lục phân ta được $5\\text{A}\\text{H}$."
    },
    33: {
        "type": "mcq", "ans": "D",
        "topic": "Vòng lặp xoay trái 5 lần từ giá trị 3BH",
        "meth": "$3\\text{B}\\text{H} = 0011\\,1011_2$. Xoay trái 5 lần: L1: $76\\text{H} \\to$ L2: $\\text{ECH} \\to$ L3: $\\text{D9H} \\to$ L4: $\\text{B3H} \\to$ L5: $67\\text{H}$.",
        "tips": "Xoay trái 5 lần của 3BH ra 67H.",
        "exp": "Thanh ghi A ban đầu chứa giá trị $3\\text{B}\\text{H} = 0011\\,1011_2$. Vòng lặp `RL A` thực hiện đúng 5 lần: sau lần 1 được $76\\text{H}$, lần 2 được $\\text{ECH}$, lần 3 được $\\text{D9H}$, lần 4 được $\\text{B3H}$, và lần 5 được $67\\text{H}$ ($0110\\,0111_2$). Nội dung trong A là $67\\text{H}$."
    },
    34: {
        "type": "mcq", "ans": "C",
        "topic": "Lập trình bảng tra cứu dữ liệu (Lookup Table)",
        "meth": "Sử dụng lệnh `MOVC A, @A+PC` để đọc phần tử thứ A trong bảng hằng số `TAB` khai báo bằng chỉ dẫn `DB`.",
        "tips": "Dùng MOVC đọc bảng hằng số DB -> Tìm giá trị đặt tại bảng tra tương ứng.",
        "exp": "Đoạn mã sử dụng lệnh đọc bộ nhớ chương trình `MOVC A, @A+PC` kết hợp với nhãn bảng dữ liệu `TAB` chứa các phần tử tính toán sẵn (bảng bình phương các số), thực hiện chức năng: Tìm giá trị đặt tại bảng tra tương ứng."
    },
    35: {
        "type": "mcq", "ans": "C",
        "topic": "Timer tạo xung vuông tuần hoàn 25Hz tại P1.5",
        "meth": "Với $f_{\\text{osc}} = 6\\,\\text{MHz}$ ($T_{\\text{cm}} = 2\\,\\mu\\text{s}$), nửa chu kỳ trễ $20\\,\\text{ms}$, toàn chu kỳ $T = 40\\,\\text{ms} \\implies f = 1 / 0.04 = 25\\,\\text{Hz}$.",
        "tips": "Tạo xung vuông tần số 25Hz xuất từ cổng P1.5.",
        "exp": "Chương trình cấu hình Timer tạo khoảng thời gian trễ nửa chu kỳ $20\\,\\text{ms}$, kết hợp lệnh đảo trạng thái chân cổng `CPL P1.5`, tạo ra dạng sóng vuông tuần hoàn có chu kỳ toàn phần $T = 40\\,\\text{ms}$, tương ứng tần số dao động là $f = \\frac{1}{0.04\\,\\text{s}} = 25\\,\\text{Hz}$ tại chân P1.5."
    },
    36: {
        "type": "mcq", "ans": "C",
        "topic": "Thuật toán đếm số lượng bit 1 trong 1 byte dữ liệu",
        "meth": "Đọc byte từ ô nhớ RAM $20\\text{H}$, xoay bit qua cờ nhớ và cộng dồn số lần xuất hiện bit 1 vào ô nhớ $21\\text{H}$.",
        "tips": "Duyệt xoay bit kiểm tra cờ C -> Đếm số lượng các bit 1 trong ô nhớ 20H, lưu kết quả tại 21H.",
        "exp": "Chương trình đọc byte dữ liệu từ ô nhớ $20\\text{H}$, sử dụng vòng lặp 8 lần xoay bit qua cờ nhớ (lệnh `RRC A`), mỗi khi cờ Carry bằng 1 thì tăng giá trị ô nhớ $21\\text{H}$, thực hiện chức năng: Tìm số các số 1 trong nội dung trong ô nhớ RAM $20\\text{H}$, nội dung lưu trong ô nhớ $21\\text{H}$."
    },
    37: {
        "type": "fib", "ans": "B5",
        "topic": "Hoàn thiện giá trị cho thanh ghi R1 đạt C1H",
        "meth": "Thực hiện phép toán số học để giá trị trong thanh ghi R1 đạt kết quả mục tiêu là $\\text{C1H}$. Giá trị nạp là $\\text{B5H}$.",
        "tips": "Điền: B5.",
        "exp": "Giá trị cần điền vào câu lệnh để sau khi thực thi thanh ghi R1 đạt giá trị $\\text{C1H}$ là $\\text{B5H}$."
    },
    38: {
        "type": "mcq", "ans": "D",
        "topic": "So sánh CJNE bằng nhau không rẽ nhánh và đổi số thập phân",
        "meth": "$3\\text{B}\\text{H} + \\text{B}3\\text{H} = \\text{EEH}$. Lệnh `CJNE A, #EEH, NHAN` không nhảy vì bằng nhau. Thực hiện `MOV 30H, #23`. Đổi 23 thập phân ra Hex: $23 = 17\\text{H}$.",
        "tips": "23 thập phân = 17H. Đáp án là 17H.",
        "exp": "Phép cộng $3\\text{B}\\text{H} + \\text{B}3\\text{H} = \\text{EEH}$. Lệnh so sánh `CJNE A, #EEH, NHAN` nhận thấy hai giá trị bằng nhau nên không rẽ nhánh, thực hiện lệnh tiếp theo là `MOV 30H, #23`. Giá trị hằng số 23 trong hệ thập phân tương ứng với mã Hex là $17\\text{H}$, do đó nội dung ô nhớ $30\\text{H}$ là $17\\text{H}$."
    },
    39: {
        "type": "fib", "ans": "7B",
        "topic": "Hoàn thiện giá trị phép chia số học DIV AB",
        "meth": "Thực hiện phép chia để thương số trong A là $04\\text{H}$ và phần dư trong B là $02\\text{H}$. Giá trị nạp là $7\\text{B}\\text{H}$.",
        "tips": "Điền: 7B.",
        "exp": "Giá trị hằng số cần hoàn thiện vào chỗ trống để đoạn chương trình cho kết quả thanh ghi B là $02\\text{H}$ và thanh ghi A là $04\\text{H}$ là $7\\text{B}\\text{H}$."
    },
    40: {
        "type": "fib", "ans": "7B",
        "topic": "Hoàn thiện giá trị để A là 7CH và ô nhớ 30H là 4BH",
        "meth": "Hoàn thiện giá trị nạp tức thời $7\\text{B}\\text{H}$ vào chương trình.",
        "tips": "Điền: 7B.",
        "exp": "Giá trị tham số cần điền vào chỗ trống để chương trình đạt kết quả thanh ghi A là $7\\text{C}\\text{H}$ và ô nhớ $30\\text{H}$ là $4\\text{B}\\text{H}$ là $7\\text{B}\\text{H}$."
    },
    41: {
        "type": "mcq", "ans": "D",
        "topic": "Vòng lặp cộng dồn liên tiếp 10 lần số 2",
        "meth": "$A = 20$ (thập phân), cộng dồn $10 \\times 2 = 20 \\implies A = 20 + 20 = 40$ (thập phân). Đổi 40 sang Hex: $40 = 28\\text{H}$.",
        "tips": "20 + 10 x 2 = 40 (thập phân) = 28H.",
        "exp": "Thanh ghi A được gán giá trị khởi tạo là 20 (thập phân). Vòng lặp `LAP: ADD A, #2` được thực hiện đúng 10 lần thông qua thanh ghi đếm R1 (`DJNZ R1, LAP`). Sau 10 lần lặp, nội dung thanh ghi A là $20 + (10 \\times 2) = 40$ thập phân. Đổi sang hệ thập lục phân ta được $28\\text{H}$."
    },
    42: {
        "type": "fib", "ans": "40",
        "topic": "Hoàn thiện giá trị để B là 28H và A là 00H",
        "meth": "Giá trị tham số cần nạp vào thanh ghi là $40\\text{H}$.",
        "tips": "Điền: 40.",
        "exp": "Giá trị cần hoàn thiện vào chỗ trống để thanh ghi B nhận giá trị $28\\text{H}$ và thanh ghi A nhận giá trị $00\\text{H}$ là $40\\text{H}$."
    },
    43: {
        "type": "fib", "ans": "30",
        "topic": "Hoàn thiện giá trị để thanh ghi A đạt 7BH",
        "meth": "Giá trị tham số cần nạp vào thanh ghi là $30\\text{H}$.",
        "tips": "Điền: 30.",
        "exp": "Giá trị cần hoàn thiện vào câu lệnh để sau khi thực thi nội dung thanh ghi A đạt giá trị $7\\text{B}\\text{H}$ là $30\\text{H}$."
    }
}

def solve_p13_question(q):
    num = q['num']
    data = PART_13_DATA.get(num)
    if not data:
        raise ValueError(f"Missing Part 13 data for question {num}")

    q_type = data['type']
    ans = data['ans']
    opts = q.get('options', [])

    if q_type == 'mcq':
        acceptable = [ans]
    else:
        ans_clean = ans.upper().rstrip('H')
        acceptable = [ans_clean, f"{ans_clean}H", ans_clean.lower(), f"{ans_clean.lower()}h"]

    exp = latexify_text(data['exp'])
    meth = latexify_text(data['meth'])
    tips = latexify_text(data['tips'])

    return {
        'id': q['id'],
        'source': q['source'],
        'exam_id': 'PART_13',
        'exam_title': 'Chuyên Đề Part 13: Chương Trình Con & Cấu Trúc Trễ Delay',
        'num': num,
        'title': f"Part 13 - Câu {num}",
        'prompt': q['prompt'],
        'extra_lines': q.get('extra_lines', []),
        'options': opts,
        'type': q_type,
        'answer': ans,
        'acceptable_answers': acceptable,
        'explanation': exp,
        'methodology': meth,
        'tips_casio': tips,
        'clo': 'CLO2' if num < 25 else 'CLO3',
        'level': 'TH' if q_type == 'fib' else 'VD',
        'topic_name': data['topic'],
        'images': q.get('images', [])
    }
