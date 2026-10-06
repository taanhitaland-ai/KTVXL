import re

# ==============================================================================
# COMPREHENSIVE SOLVER FOR PART 9 & PART 10 (182 Questions Total)
# Topic: Tập Lệnh Hợp Ngữ 8051: Số Học, Logic, Truyền Dữ Liệu, Xử Lý Bit & Rẽ Nhánh
# ==============================================================================

PART_10_DATA = {
    4: {
        "ans_letter": "A",
        "ans_kw": "mov 7fh, #7fh",
        "exp": "Cú pháp hợp ngữ di chuyển hằng số tức thời 7FH (có tiền tố '#') vào ô nhớ trực tiếp 7FH trong RAM nội là `MOV 7FH, #7FH`.",
        "meth": "Định vị toán hạng: Toán hạng nguồn là giá trị tức thời -> bắt buộc có dấu '#'; toán hạng đích là địa chỉ ô nhớ 7FH.",
        "tips": "Di chuyển giá trị tức thời -> Phải có dấu '#': MOV 7FH, #7FH."
    },
    5: {
        "ans_letter": "A",
        "ans_kw": "mov a, r0",
        "exp": "Lệnh sao chép nội dung từ thanh ghi R0 vào thanh ghi tích lũy A có cú pháp chuẩn là `MOV A, R0` (toán hạng đích là A đứng trước, toán hạng nguồn là R0 đứng sau).",
        "meth": "Quy tắc cú pháp 8051: MOV đích, nguồn. Chuyển R0 vào A -> MOV A, R0.",
        "tips": "Đích đứng trước, nguồn đứng sau: MOV A, R0."
    },
    6: {
        "ans_letter": "A",
        "ans_kw": "cjne r0, #00h, rel",
        "exp": "Lệnh so sánh và nhảy nếu không bằng (Compare and Jump if Not Equal) giữa thanh ghi Rn với một số tức thời có cú pháp chuẩn: `CJNE Rn, #data, rel`. Ở đây so sánh R0 với hằng số 00H: `CJNE R0, #00H, rel`.",
        "meth": "Cú pháp CJNE: CJNE Rn, #data, rel.",
        "tips": "So sánh với hằng số -> Dấu '#' trước số 00H: CJNE R0, #00H, rel."
    },
    7: {
        "ans_letter": "B",
        "ans_kw": "cjne a, #200, prom1",
        "exp": "So sánh thanh ghi A với hằng số 200 (hệ thập phân, không có chữ H) và nhảy đến nhãn PROM1 nếu không bằng: `CJNE A, #200, PROM1`.",
        "meth": "Hằng số thập phân trong Assembly không có hậu tố H. Toán hạng đích là A.",
        "tips": "Hằng số 200 viết dạng tức thời: #200 -> CJNE A, #200, PROM1."
    },
    8: {
        "ans_letter": "D",
        "ans_kw": "dec dptr",
        "exp": "Trong tập lệnh của họ 8051, con trỏ dữ liệu DPTR 16-bit chỉ có duy nhất lệnh tăng `INC DPTR`, hoàn toàn KHÔNG CÓ lệnh giảm `DEC DPTR`. Muốn giảm DPTR lập trình viên phải cộng bù 2 hoặc trừ thủ công.",
        "meth": "Quy tắc kinh điển 8051: DPTR chỉ có INC DPTR, không có DEC DPTR.",
        "tips": "Lệnh SAI kinh điển = DEC DPTR."
    },
    9: {
        "ans_letter": "B",
        "ans_kw": "ljmp",
        "exp": "Lệnh nhảy dài `LJMP addr16` (Long Jump) sử dụng địa chỉ đích 16-bit, cho phép nhảy không điều kiện đến bất kỳ vị trí nào trong toàn bộ không gian 64KB bộ nhớ chương trình.",
        "meth": "Phân biệt lệnh nhảy: SJMP (-128..+127B), AJMP (trong khối 2KB), LJMP (toàn bộ 64KB).",
        "tips": "Nhảy trong không gian 64KB -> LJMP (Long Jump)."
    },
    10: {
        "ans_letter": "D",
        "ans_kw": "mov a, #ff0h",
        "exp": "Thanh ghi tích lũy A là thanh ghi 8-bit, chỉ có khả năng lưu trữ giá trị hằng số tức thời tối đa là 8-bit (00H đến 0FFH, hoặc 0 đến 255). Giá trị #FF0H là số 12-bit (vượt quá 8-bit), do đó lệnh `MOV A, #FF0H` là lệnh SAI cú pháp.",
        "meth": "Kiểm tra kích thước toán hạng: Thanh ghi 8-bit chỉ nhận giá trị từ 00H đến 0FFH.",
        "tips": "FF0H vượt quá 8-bit của thanh ghi A -> Lệnh SAI."
    },
    11: {
        "ans_letter": "A",
        "ans_kw": "mov a, acc",
        "exp": "Trong tập lệnh 8051, thanh ghi tích lũy A và ACC là một. Tập lệnh không hỗ trợ lệnh `MOV A, ACC` (vừa định địa chỉ thanh ghi vừa định địa chỉ trực tiếp cho cùng một thanh ghi), lệnh này là dư thừa và không hợp lệ.",
        "meth": "Các lệnh hợp lệ: MOV A, PSW; MOV A, SBUF; MOV A, TH0. Lệnh SAI: MOV A, ACC.",
        "tips": "MOV A, ACC là lệnh SAI."
    },
    12: {
        "ans_letter": "B",
        "ans_kw": "jz rel",
        "exp": "Lệnh `JZ rel` (Jump if Zero) kiểm tra nội dung thanh ghi tích lũy A, nếu A = 00H thì thực hiện nhảy tương đối đến nhãn rel.",
        "meth": "Lệnh nhảy kiểm tra A: JZ (A = 0); JNZ (A khác 0).",
        "tips": "A bằng 0 -> JZ (Jump if Zero)."
    },
    13: {
        "ans_letter": "B",
        "ans_kw": "ajmp",
        "exp": "Lệnh nhảy tuyệt đối `AJMP addr11` (Absolute Jump) mã hóa địa chỉ đích bằng 11-bit, cho phép nhảy đến bất kỳ địa chỉ nào nằm trong cùng khối trang 2KB (2^11 Byte = 2048 Byte) của bộ nhớ chương trình.",
        "meth": "Tầm nhảy 2KB: AJMP (11-bit address).",
        "tips": "Trong cùng khối 2KB -> AJMP."
    },
    14: {
        "ans_letter": "D",
        "ans_kw": "swap",
        "exp": "Lệnh `SWAP A` hoán chuyển nội dung giữa nibble thấp (bit D0-D3) và nibble cao (bit D4-D7) của thanh ghi A (ví dụ: A đang chứa 12H thì sau SWAP A sẽ là 21H).",
        "meth": "Đổi chỗ 2 nibble (4-bit) của A: Lệnh SWAP A.",
        "tips": "Hoán chuyển 2 nibble -> Lệnh SWAP."
    },
    15: {
        "ans_letter": "D",
        "ans_kw": "anl r0, #7fh",
        "fib_val": "ANL R0, #7FH",
        "exp": "Giá trị 7FH có biểu diễn nhị phân là 0111_1111b (bit cao nhất D7 bằng 0, tất cả các bit còn lại bằng 1). Khi thực hiện phép AND logic với 7FH, bit D7 của R0 chắc chắn bị xóa về 0 trong khi các bit khác giữ nguyên.",
        "meth": "Muốn xóa bit nào về 0: Dùng lệnh AND (ANL) với mặt nạ có bit đó bằng 0. 7FH = 0111_1111b xóa bit 7.",
        "tips": "Đưa bit cao nhất về 0 -> ANL với #7FH."
    },
    16: {
        "ans_letter": "A",
        "ans_kw": "nạp giá trị 10h vào thanh ghi dph và 00h vào thanh ghi dpl",
        "fib_val": "Nạp giá trị 10H vào thanh ghi DPH và 00H vào thanh ghi DPL",
        "exp": "Thanh ghi con trỏ dữ liệu DPTR 16-bit gồm 2 byte: DPH (byte cao) và DPL (byte thấp). Lệnh `MOV DPTR, #1000H` nạp byte cao 10H vào DPH và byte thấp 00H vào DPL.",
        "meth": "Cơ chế nạp DPTR: 1000H -> DPH = 10H, DPL = 00H.",
        "tips": "1000H: Byte cao 10H vào DPH, byte thấp 00H vào DPL."
    },
    17: {
        "ans_letter": "D",
        "ans_kw": "jnz rel",
        "exp": "Lệnh `JNZ rel` (Jump if Not Zero) kiểm tra thanh ghi tích lũy A, nếu A khác 0 (A != 00H) thì thực hiện nhảy tương đối đến nhãn rel.",
        "meth": "Nhảy nếu A khác 0: JNZ rel.",
        "tips": "Khác 0 -> JNZ (Jump if Not Zero)."
    },
    18: {
        "ans_letter": "A",
        "ans_kw": "xrl a, #data",
        "exp": "Phép toán XOR logic trong hợp ngữ 8051 sử dụng mã gợi nhớ XRL. Khi thực hiện giữa thanh ghi A và một hằng số tức thời (#data), cú pháp là `XRL A, #data`.",
        "meth": "XOR logic tức thời: XRL A, #data.",
        "tips": "XOR = XRL; Số tức thời = #data -> XRL A, #data."
    },
    19: {
        "ans_letter": "B",
        "ans_kw": "thanh ghi tích luỹ a",
        "fib_val": "Thanh ghi tích luỹ A",
        "exp": "Lệnh `INC A` (Increment Accumulator) thực hiện tăng nội dung thanh ghi tích lũy A lên 1 đơn vị: A = A + 1.",
        "meth": "Toán hạng của INC A: Thanh ghi tích lũy A.",
        "tips": "INC A -> Tăng thanh ghi tích lũy A."
    },
    20: {
        "ans_letter": "D",
        "ans_kw": "ret",
        "exp": "Lệnh `RET` (Return from Subroutine) là lệnh trở về từ một chương trình con thông thường được gọi bởi ACALL hoặc LCALL, bằng cách lấy 2 byte địa chỉ trở về từ đỉnh ngăn xếp nạp lại vào thanh ghi PC.",
        "meth": "Trở về từ chương trình con: RET. (RETI là trở về từ chương trình phục vụ ngắt).",
        "tips": "Chương trình con -> RET; Chương trình ngắt -> RETI."
    },
    21: {
        "ans_letter": "A",
        "ans_kw": "giảm nội dung trong r0 đi 1",
        "fib_val": "Giảm nội dung trong R0 đi 1",
        "exp": "Lệnh `DEC R0` (Decrement R0) giảm nội dung của thanh ghi R0 đi 1 đơn vị: R0 = R0 - 1.",
        "meth": "DEC R0: Giảm R0 đi 1.",
        "tips": "DEC = Decrement (Giảm đi 1)."
    },
    22: {
        "ans_letter": "C",
        "ans_kw": "mov #0b0h, a",
        "exp": "Trong kiến trúc tập lệnh vi xử lý, toán hạng đích (đứng trước dấu phẩy) là nơi lưu trữ kết quả, bắt buộc phải là thanh ghi hoặc ô nhớ. Một hằng số tức thời (#0B0H) là giá trị cố định, không thể làm nơi lưu dữ liệu. Do đó `MOV #0B0H, A` là lệnh SAI cú pháp.",
        "meth": "Quy tắc cú pháp: Toán hạng đích KHÔNG BAO GIỜ có dấu '#'.",
        "tips": "Đích có dấu '#' là sai ngay lập tức!"
    },
    23: {
        "ans_letter": "B",
        "ans_kw": "jnc prom1",
        "exp": "Lệnh `JNC PROM1` (Jump if Not Carry) kiểm tra cờ nhớ CY trong thanh ghi PSW. Nếu CY = 0 (không có cờ nhớ) thì nhảy đến nhãn PROM1.",
        "meth": "Nhảy nếu CY = 0: JNC (Jump if No Carry).",
        "tips": "CY = 0 -> JNC."
    },
    24: {
        "ans_letter": "D",
        "ans_kw": "jnc rel",
        "exp": "Lệnh nhảy đến địa chỉ rel nếu cờ nhớ bằng 0 (CY = 0) là lệnh `JNC rel` (Jump if Not Carry).",
        "meth": "CY = 0 -> JNC rel.",
        "tips": "Cờ nhớ bằng 0 -> JNC."
    },
    25: {
        "ans_letter": "B",
        "ans_kw": "setb 90h",
        "fib_val": "SETB 90H",
        "exp": "Cổng P1 có địa chỉ SFR là 90H. Chân P1.0 (bit thấp nhất) có địa chỉ định vị bit trực tiếp là 90H. Do đó lệnh `SETB 90H` đặt bit P1.0 lên mức logic 1.",
        "meth": "Địa chỉ bit của P1.0: 90H. Đặt lên 1: SETB 90H.",
        "tips": "Bit thấp nhất của P1 (P1.0) = bit 90H -> SETB 90H."
    },
    26: {
        "ans_letter": "C",
        "ans_kw": "jnz rel",
        "exp": "Cờ Zero (cờ 0) bằng 0 tương ứng với trạng thái kết quả khác 0 (A != 00H). Lệnh nhảy khi A khác 0 là `JNZ rel` (Jump if Not Zero).",
        "meth": "Zero flag = 0 -> Kết quả khác 0 -> JNZ.",
        "tips": "Cờ zero = 0 -> JNZ rel."
    },
    27: {
        "ans_letter": "D",
        "ans_kw": "mov a, 85h",
        "exp": "Để sao chép nội dung từ một ô nhớ RAM nội hoặc thanh ghi SFR trực tiếp (địa chỉ 85H, chính là DPH) vào thanh ghi tích lũy A, ta dùng lệnh `MOV A, 85H` (định địa chỉ trực tiếp).",
        "meth": "Sao chép ô nhớ direct vào A: MOV A, direct -> MOV A, 85H.",
        "tips": "Từ ô nhớ 85H vào A: MOV A, 85H (không có dấu #)."
    },
    28: {
        "ans_letter": "D",
        "ans_kw": "cjne r0, #00h, rel",
        "exp": "Ở chế độ mặc định sau Reset (Bank 0), ô nhớ RAM nội địa chỉ 00H chính là thanh ghi R0. Lệnh so sánh nội dung thanh ghi R0 với hằng số 00H và nhảy nếu khác nhau là `CJNE R0, #00H, rel`.",
        "meth": "Bank 0: Ô nhớ 00H = R0. So sánh với hằng số #00H: CJNE R0, #00H, rel.",
        "tips": "Ô nhớ 00H là R0 -> CJNE R0, #00H, rel."
    },
    29: {
        "ans_letter": "B",
        "ans_kw": "lcall",
        "exp": "Khi thực thi lệnh gọi chương trình con `LCALL`, CPU tự động cất địa chỉ trở về 16-bit của lệnh kế tiếp vào ngăn xếp (2 thao tác PUSH liên tiếp), làm cho giá trị của con trỏ ngăn xếp SP tăng lên 2: SP = SP + 2. Các lệnh LJMP, ADD, MOVC không làm thay đổi SP.",
        "meth": "Lệnh thay đổi SP: PUSH, POP, ACALL, LCALL, RET, RETI.",
        "tips": "Gọi chương trình con (LCALL) cất PC vào ngăn xếp -> Thay đổi SP."
    },
    30: {
        "ans_letter": "C",
        "ans_kw": "lcall 1000h",
        "exp": "Để gọi chương trình con tại địa chỉ 16-bit bất kỳ trong không gian bộ nhớ (như 1000H), ta dùng lệnh gọi dài `LCALL 1000H` (Long Call).",
        "meth": "Gọi chương trình con: Dùng CALL (LCALL hoặc ACALL). LCALL hỗ trợ địa chỉ 16-bit toàn dải.",
        "tips": "Gọi chương trình con tới 1000H: LCALL 1000H."
    },
    31: {
        "ans_letter": "D",
        "ans_kw": "sao chép nội dung trong thanh ghi b vào thanh ghi a",
        "fib_val": "Sao chép nội dung trong thanh ghi B vào thanh ghi A",
        "exp": "Lệnh `MOV A, B` sao chép (copy) giá trị hiện tại trong thanh ghi B (toán hạng nguồn) đưa vào thanh ghi tích lũy A (toán hạng đích), nội dung thanh ghi B không bị thay đổi.",
        "meth": "MOV A, B: Sao chép từ B vào A.",
        "tips": "Nguồn B -> Đích A: Sao chép nội dung thanh ghi B vào thanh ghi A."
    },
    32: {
        "ans_letter": "C",
        "ans_kw": "movx a, @dptr",
        "fib_val": "MOVX A, @DPTR",
        "exp": "Lệnh đọc dữ liệu từ bộ nhớ RAM ngoài vào thanh ghi tích lũy A thông qua con trỏ dữ liệu DPTR 16-bit là lệnh `MOVX A, @DPTR`.",
        "meth": "Đọc RAM ngoài: MOVX A, @DPTR (chữ 'X' là eXternal).",
        "tips": "Đọc RAM ngoài -> MOVX A, @DPTR."
    },
    33: {
        "ans_letter": "D",
        "ans_kw": "pop a",
        "exp": "Trong tập lệnh 8051, lệnh POP chỉ hỗ trợ chế độ định địa chỉ trực tiếp: `POP direct`. Thanh ghi tích lũy A không thể dùng tên gợi nhớ 'A' trong lệnh POP mà bắt buộc phải dùng địa chỉ trực tiếp của nó là `POP 0E0H` hoặc `POP ACC`. Vì vậy `POP A` là lệnh SAI cú pháp.",
        "meth": "Lỗi cú pháp kinh điển: Không có lệnh PUSH A hay POP A, chỉ có PUSH ACC / POP ACC.",
        "tips": "POP A là lệnh SAI (phải viết là POP ACC)."
    },
    34: {
        "ans_letter": "B",
        "ans_kw": "sjmp",
        "exp": "Lệnh nhảy ngắn `SJMP rel` (Short Jump) sử dụng độ dời tương đối 8-bit có dấu (khoảng giá trị từ -128 đến +127 byte so với địa chỉ của lệnh kế tiếp).",
        "meth": "Tầm nhảy 8-bit có dấu (-128 đến +127 byte): SJMP.",
        "tips": "Tầm nhảy -128 đến +127 byte -> SJMP (Short Jump)."
    },
    35: {
        "ans_letter": "D",
        "ans_kw": "movx @dptr, a",
        "exp": "Lệnh ghi dữ liệu từ thanh ghi tích lũy A ra bộ nhớ dữ liệu bên ngoài (RAM ngoài) tại địa chỉ do con trỏ DPTR chỉ định là `MOVX @DPTR, A`.",
        "meth": "Ghi ra RAM ngoài: MOVX @DPTR, A.",
        "tips": "Ghi ra RAM ngoài -> MOVX @DPTR, A."
    },
    36: {
        "ans_letter": "A",
        "ans_kw": "djnz r0, rel",
        "exp": "Lệnh giảm nội dung thanh ghi Rn đi 1 và nhảy đến địa chỉ tương đối nếu giá trị sau khi giảm khác 0 có cú pháp là `DJNZ Rn, rel`. Với thanh ghi R0: `DJNZ R0, rel`.",
        "meth": "DJNZ = Decrement and Jump if Not Zero. Cú pháp: DJNZ R0, rel.",
        "tips": "Giảm và nhảy nếu khác 0 -> DJNZ R0, rel."
    },
    37: {
        "ans_letter": "C",
        "ans_kw": "mov #255, a",
        "exp": "Toán hạng đích (đứng trước) không thể là một hằng số tức thời (#255). Do đó lệnh `MOV #255, A` là lệnh SAI cú pháp.",
        "meth": "Toán hạng đích không thể chứa tiền tố '#'.",
        "tips": "Đích mang dấu '#' -> Lệnh SAI."
    },
    38: {
        "ans_letter": "D",
        "ans_kw": "push",
        "exp": "Lệnh cất (lưu trữ) dữ liệu từ một ô nhớ/thanh ghi vào vùng nhớ ngăn xếp trong 8051 là lệnh `PUSH direct`.",
        "meth": "Cất vào ngăn xếp: PUSH; Lấy ra: POP.",
        "tips": "Cất vào ngăn xếp -> Lệnh PUSH."
    },
    39: {
        "ans_letter": "D",
        "ans_kw": "jbc prom1",
        "exp": "Lệnh `JBC bit, rel` (Jump if Bit is set and Clear bit) kiểm tra bit chỉ định: Nếu bit = 1 thì xóa bit về 0 và thực hiện nhảy đến nhãn đích PROM1.",
        "meth": "JBC = Jump if Bit set and Clear bit.",
        "tips": "Kiểm tra bit = 1, xóa bit và nhảy -> JBC."
    },
    40: {
        "ans_letter": "D",
        "ans_kw": "mov a, @r0",
        "exp": "Để chuyển dữ liệu từ ô nhớ RAM nội được trỏ bởi thanh ghi R0 vào thanh ghi A, ta sử dụng chế độ định địa chỉ gián tiếp qua con trỏ với cú pháp `MOV A, @R0`.",
        "meth": "Chuyển dữ liệu RAM nội qua con trỏ: MOV A, @R0 (hoặc @R1).",
        "tips": "Trỏ qua thanh ghi R0 -> Dùng ký hiệu '@': MOV A, @R0."
    },
    41: {
        "ans_letter": "D",
        "ans_kw": "jz rel",
        "exp": "Cờ Zero (cờ 0) bằng 1 khi kết quả trong thanh ghi A bằng 0. Lệnh nhảy tương ứng là `JZ rel` (Jump if Zero).",
        "meth": "Cờ 0 = 1 -> A = 0 -> JZ rel.",
        "tips": "Cờ 0 bằng 1 -> JZ rel."
    },
    42: {
        "ans_letter": "B",
        "ans_kw": "djnz 40h, prom1",
        "exp": "Lệnh `DJNZ direct, rel` giảm nội dung ô nhớ trực tiếp direct đi 1 và nhảy nếu khác 0. Với ô nhớ 40H: `DJNZ 40H, PROM1`.",
        "meth": "Giảm ô nhớ 40H và nhảy nếu khác 0: DJNZ 40H, PROM1.",
        "tips": "DJNZ ô nhớ 40H -> DJNZ 40H, PROM1."
    },
    43: {
        "ans_letter": "A",
        "ans_kw": "jc rel",
        "exp": "Lệnh nhảy đến địa chỉ rel nếu cờ nhớ khác 0 (CY = 1) là lệnh `JC rel` (Jump if Carry).",
        "meth": "CY = 1 -> JC rel.",
        "tips": "Cờ nhớ khác 0 (CY=1) -> JC rel."
    },
    44: {
        "ans_letter": "C",
        "ans_kw": "pop",
        "exp": "Lệnh lấy dữ liệu ra khỏi vùng nhớ ngăn xếp (Stack) và chuyển vào một ô nhớ trực tiếp là lệnh `POP direct`.",
        "meth": "Lấy ra từ ngăn xếp: Lệnh POP.",
        "tips": "Lấy dữ liệu ra khỏi ngăn xếp -> POP."
    },
    45: {
        "ans_letter": "A",
        "ans_kw": "cjne a, 3fh, rel",
        "exp": "Cú pháp so sánh nội dung thanh ghi A với ô nhớ trực tiếp 3FH và nhảy nếu không bằng là: `CJNE A, direct, rel` -> `CJNE A, 3FH, rel`.",
        "meth": "So sánh A với ô nhớ 3FH: CJNE A, 3FH, rel (không có dấu # vì so sánh với nội dung ô nhớ).",
        "tips": "Nội dung ô nhớ 3FH -> Không có dấu #: CJNE A, 3FH, rel."
    }
}

def solve_p9_question(q):
    p = q['prompt'].lower()
    opts = q.get('options', [])
    q_type = q.get('type', 'mcq')
    fib_ans = q.get('fib_answer', '').strip()
    num = q['num']
    
    ans = "A"
    acceptable = ["A"]
    exp = ""
    meth = ""
    tips = ""
    
    # 1. Directives & Assembly Syntax
    if 'gán giá trị' in p or 'equ' in p or 'my_const' in p:
        ans_kw = 'equ'
        exp = "Chỉ thị hợp ngữ EQU (Equate) được dùng để định nghĩa một tên hằng số hoặc gán một giá trị cố định cho một ký hiệu (ví dụ: MY_CONST EQU 0AH)."
        meth = "Khai báo hằng số trong Assembly 8051: Sử dụng chỉ thị EQU."
        tips = "Gán hằng số -> Dùng chỉ thị EQU."
    elif 'định nghĩa một từ' in p or 'từ dữ liệu' in p:
        ans_kw = 'dw'
        exp = "Chỉ thị DW (Define Word) dùng để định nghĩa một từ dữ liệu 16-bit (2 byte) trong bộ nhớ chương trình."
        meth = "DW = Define Word (định nghĩa từ 16-bit); DB = Define Byte (định nghĩa byte 8-bit)."
        tips = "Một từ dữ liệu (16-bit) -> Dùng chỉ thị DW."
    elif 'định nghĩa một byte' in p or 'byte dữ liệu' in p:
        ans_kw = 'db'
        exp = "Chỉ thị DB (Define Byte) dùng để định nghĩa một byte dữ liệu 8-bit hoặc một chuỗi ký tự trong bộ nhớ chương trình."
        meth = "DB = Define Byte (định nghĩa byte 8-bit)."
        tips = "Byte dữ liệu -> Dùng chỉ thị DB."
    elif 'hằng số ký tự' in p:
        ans_kw = "'"
        exp = "Trong hợp ngữ 8051, một hằng số ký tự ASCII được đặt trong cặp dấu nháy đơn ' (ví dụ: 'A', '1')."
        meth = "Biểu diễn ký tự: Đặt trong dấu nháy đơn ' '."
        tips = "Hằng số ký tự -> Dấu nháy đơn ' ."
    elif 'hằng số thập lục phân' in p or 'hex' in p:
        ans_kw = 'h'
        exp = "Hằng số thập lục phân (Hexadecimal) trong Assembly 8051 được biểu thị bằng hậu tố chữ H ở cuối số (ví dụ: 0FFH, 12H)."
        meth = "Hậu tố Hex: Chữ H."
        tips = "Thập lục phân (Hex) -> Ký tự H ở cuối."
    elif 'hằng số nhị phân' in p:
        ans_kw = 'b'
        exp = "Hằng số nhị phân (Binary) trong Assembly 8051 được nhận biết bởi hậu tố chữ B ở cuối chuỗi bit (ví dụ: 10101010B)."
        meth = "Hậu tố nhị phân: Chữ B."
        tips = "Nhị phân -> Ký tự B ở cuối."
    elif 'hằng số thập phân' in p:
        ans_kw = 'd'
        exp = "Hằng số thập phân (Decimal) có thể thêm hậu tố chữ D hoặc không cần hậu tố (ví dụ: 100 hoặc 100D)."
        meth = "Hậu tố thập phân: Chữ D."
        tips = "Thập phân -> Ký tự D."
    elif 'chú thích' in p:
        ans_kw = ';'
        exp = "Trong ngôn ngữ hợp ngữ Assembly của họ 8051, một dòng chú thích (comment) luôn bắt đầu bằng dấu chấm phẩy ';' và kéo dài đến hết dòng."
        meth = "Dấu chú thích chuẩn: Dấu chấm phẩy ';'."
        tips = "Dòng chú thích bắt đầu bằng dấu chấm phẩy ';'."
    elif 'rel dùng để' in p:
        ans_kw = 'địa chỉ tương đối'
        exp = "Toán hạng rel (relative) dùng để biểu diễn một địa chỉ tương đối 8-bit có dấu, có phạm vi nhảy từ -128 byte đến +127 byte so với lệnh kế tiếp."
        meth = "rel = Relative offset (địa chỉ tương đối 8-bit)."
        tips = "rel -> Địa chỉ tương đối."
    elif 'addr11 dùng để' in p:
        ans_kw = '2k'
        exp = "addr11 dùng để biểu diễn địa chỉ tuyệt đối 11-bit, chỉ có thể nhảy trong phạm vi cùng trang khối 2KB của bộ nhớ chương trình."
        meth = "addr11: Địa chỉ 11-bit trong cùng khối 2KB."
        tips = "addr11 -> Khối 2KB."
    elif 'addr16 dùng để' in p:
        ans_kw = '16bit'
        exp = "addr16 biểu diễn địa chỉ tuyệt đối 16-bit, cho phép truy xuất đến bất kỳ địa chỉ nào trong toàn bộ không gian 64KB của bộ nhớ chương trình."
        meth = "addr16: Địa chỉ tuyệt đối 16-bit trong 64KB."
        tips = "addr16 -> Địa chỉ tuyệt đối 16 bit."
    elif 'direct dùng để' in p:
        ans_kw = 'địa chỉ'
        exp = "direct trong cú pháp lệnh 8051 biểu diễn địa chỉ trực tiếp 8-bit của ô nhớ RAM nội (00H - 7FH) hoặc thanh ghi SFR (80H - FFH)."
        meth = "direct: Địa chỉ trực tiếp 8-bit."
        tips = "direct -> Địa chỉ trực tiếp."
    elif 'trình biên dịch' in p:
        ans_kw = 'mã máy'
        exp = "Trình biên dịch/hợp dịch (Assembler) có chức năng dịch mã nguồn ngôn ngữ Assembly thành mã máy nhị phân (Machine Code) để CPU có thể nạp và thực thi."
        meth = "Chức năng Assembler: Dịch Hợp ngữ thành Mã máy."
        tips = "Trình biên dịch ASM -> Tạo mã máy nhị phân."
    elif 'truy xuất của một toán hạng' in p:
        ans_kw = 'chế độ định địa chỉ'
        exp = "Phương pháp xác định cách thức CPU tìm nạp và truy xuất toán hạng của một câu lệnh được gọi là Chế độ định địa chỉ (Addressing Mode)."
        meth = "Khái niệm Chế độ định địa chỉ: Phương pháp xác định toán hạng."
        tips = "Cách truy xuất toán hạng -> Chế độ định địa chỉ."
    elif 'thanh ghi nào có thể được sử dụng làm con trỏ' in p or 'con trỏ' in p:
        ans_kw = 'r0'
        exp = "Trong 8051, chỉ có hai thanh ghi R0 và R1 (cùng với DPTR cho bộ nhớ ngoài) được phép sử dụng làm con trỏ định địa chỉ gián tiếp (ký hiệu @R0, @R1)."
        meth = "Thanh ghi con trỏ định địa chỉ gián tiếp: R0 và R1."
        tips = "Con trỏ gián tiếp RAM nội = R0 và R1."
    elif 'lệnh đầy đủ' in p and 'thứ tự' in p:
        ans_kw = 'nhãn lệnh, mã lệnh, toán hạng và ghi chú'
        exp = "Một dòng lệnh Assembly chuẩn gồm 4 trường theo thứ tự: Nhãn lệnh (Label:) -> Mã thao tác (Opcode) -> Các toán hạng (Operands) -> Ghi chú (;Comment)."
        meth = "Cấu trúc dòng lệnh ASM: [Nhãn:] [Mã lệnh] [Toán hạng] [;Ghi chú]."
        tips = "Thứ tự: Nhãn lệnh -> Mã lệnh -> Toán hạng -> Ghi chú."
        
    # 2. Instruction Groups
    elif any(x in p for x in ['lệnh add', 'lệnh addc', 'lệnh subb', 'lệnh inc', 'lệnh dec', 'lệnh mul', 'lệnh div', 'lệnh da']):
        ans_kw = 'số học'
        exp = "Lệnh này thực hiện phép tính cộng, trừ, nhân, chia, tăng, giảm hoặc hiệu chỉnh số học, do đó thuộc nhóm Lệnh Số học (Arithmetic Instructions)."
        meth = "Nhóm lệnh số học 8051: ADD, ADDC, SUBB, INC, DEC, MUL, DIV, DA A."
        tips = "ADD/ADDC/SUBB/INC/DEC/MUL/DIV -> Lệnh số học."
    elif any(x in p for x in ['ajmp', 'ljmp', 'sjmp', 'djnz', 'cjne', 'acall', 'lcall', 'lệnh ret', 'lệnh jmp', 'lệnh jz', 'lệnh jnz']):
        ans_kw = 'điều khiển chương trình'
        exp = "Lệnh này thay đổi tuần tự thực thi của thanh ghi PC (nhảy, gọi hàm, rẽ nhánh, lặp), do đó thuộc nhóm Lệnh Điều khiển chương trình (Program Control / Branching)."
        meth = "Nhóm lệnh điều khiển: JMP, CALL, RET, JZ, JNZ, CJNE, DJNZ."
        tips = "Nhảy / Gọi chương trình con -> Lệnh điều khiển chương trình."
    elif any(x in p for x in ['anl', 'orl', 'xrl', 'clr a', 'cpl a', 'lệnh rl', 'lệnh rr', 'rlc', 'rrc', 'swap']):
        ans_kw = 'logic'
        exp = "Lệnh này thực hiện các phép toán logic từng bit (AND, OR, XOR, đảo, xóa, quay/dịch bit, hoán chuyển nibble), do đó thuộc nhóm Lệnh Logic và Dịch bit."
        meth = "Nhóm lệnh logic: ANL, ORL, XRL, CPL A, CLR A, RL, RLC, RR, RRC, SWAP."
        tips = "ANL/ORL/XRL/RL/RR/SWAP -> Lệnh logic và dịch bit."
    elif any(x in p for x in ['clr p', 'setb', 'cpl c', 'cpl p', 'clp', 'jbc', 'jnb', 'lệnh jb']):
        ans_kw = 'xử lý bit'
        exp = "Lệnh này thao tác trực tiếp trên các bit cờ đơn lẻ (đặt bit, xóa bit, đảo bit, kiểm tra rẽ nhánh theo bit), do đó thuộc nhóm Lệnh Xử lý Bit (Boolean Variable Manipulation)."
        meth = "Nhóm lệnh xử lý bit: SETB, CLR bit, CPL bit, JB, JNB, JBC."
        tips = "Thao tác trên bit đơn lẻ -> Lệnh xử lý bit."
    elif any(x in p for x in ['mov', 'movx', 'movc', 'push', 'pop', 'xch', 'xchd']):
        ans_kw = 'truyền dữ liệu'
        exp = "Lệnh này sao chép, di chuyển dữ liệu giữa các thanh ghi, ô nhớ RAM nội, RAM ngoại, ROM và ngăn xếp mà không làm thay đổi giá trị số học, do đó thuộc nhóm Lệnh Truyền dữ liệu (Data Transfer)."
        meth = "Nhóm lệnh truyền dữ liệu: MOV, MOVX, MOVC, PUSH, POP, XCH, XCHD."
        tips = "MOV/MOVX/MOVC/PUSH/POP/XCH -> Lệnh truyền dữ liệu."
    else:
        ans_kw = 'số học'
        exp = "Phân tích cú pháp và chức năng của câu lệnh theo chuẩn tập lệnh họ vi điều khiển 8051."
        meth = "Xác định mã thao tác Opcode và tra cứu nhóm lệnh tương ứng."
        tips = "Phân biệt 5 nhóm lệnh: Số học, Logic, Truyền dữ liệu, Xử lý bit, Điều khiển chương trình."

    # Match answer letter among options if MCQ
    if opts:
        for idx, o in enumerate(opts):
            o_clean = re.sub(r'^[A-D][\.:]\s*', '', o).strip().lower()
            if ans_kw in o_clean:
                ans = chr(65 + idx)
                break
        acceptable = [ans]
    else:
        # FIB question
        ans = ans_kw
        acceptable = [ans_kw, ans_kw.upper(), ans_kw.capitalize(), "A", "B", "C", "D"]

    return {
        'id': q['id'],
        'source': q['source'],
        'exam_id': q.get('exam_id', 'PART_09'),
        'exam_title': 'Chuyên Đề Part 9: Tập Lệnh Hợp Ngữ 8051 & Khai Báo ASM',
        'num': num,
        'title': f"Part 9 - Câu {num}",
        'prompt': q['prompt'],
        'extra_lines': q.get('extra_lines', []),
        'options': opts,
        'type': q_type,
        'answer': ans,
        'acceptable_answers': acceptable,
        'explanation': exp,
        'methodology': meth,
        'tips_casio': tips,
        'clo': 'CLO2',
        'level': 'TH',
        'topic_name': 'Tập lệnh hợp ngữ 8051 & Các chế độ định địa chỉ',
        'images': q.get('images', [])
    }

def solve_p10_question(q):
    num = q['num']
    meta = PART_10_DATA.get(num)
    if not meta:
        return None
    opts = q.get('options', [])
    q_type = q.get('type', 'mcq')
    
    if 'fib_val' in meta and (q_type == 'fib' or not opts):
        ans = meta['fib_val']
        acceptable = [meta['fib_val'], meta['ans_letter']]
        q_type = 'fib'
    else:
        ans = meta['ans_letter']
        if opts:
            kw = meta['ans_kw'].lower()
            for idx, o in enumerate(opts):
                o_clean = re.sub(r'^[A-D][\.:]\s*', '', o).strip().lower()
                if kw in o_clean:
                    ans = chr(65 + idx)
                    break
        acceptable = [ans]

    return {
        'id': q['id'],
        'source': q['source'],
        'exam_id': q.get('exam_id', 'PART_10'),
        'exam_title': 'Chuyên Đề Part 10: Lệnh Số Học, Logic & Điều Khiển Rẽ Nhánh',
        'num': num,
        'title': f"Part 10 - Câu {num}",
        'prompt': q['prompt'],
        'extra_lines': q.get('extra_lines', []),
        'options': opts,
        'type': q_type,
        'answer': ans,
        'acceptable_answers': acceptable,
        'explanation': meta['exp'],
        'methodology': meta['meth'],
        'tips_casio': meta['tips'],
        'clo': 'CLO2',
        'level': 'TH',
        'topic_name': 'Chức năng các lệnh hợp ngữ 8051 & Rẽ nhánh',
        'images': q.get('images', [])
    }
