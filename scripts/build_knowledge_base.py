import json
import os

os.makedirs('data', exist_ok=True)

kb = {
    'title': 'TỔNG HỢP KIẾN THỨC TRỌNG TÂM KỸ THUẬT VI XỬ LÝ',
    'subtitle': 'Học viện Kỹ thuật Mật mã • Vi điều khiển 8051 & Kiến trúc ARM',
    'chapters': [
        {
            'id': 'chap1',
            'num': 1,
            'title': 'Chương 1: Tổng Quan Vi Xử Lý, Vi Điều Khiển & Kiến Trúc ARM',
            'clo': 'CLO1',
            'summary': 'Nắm vững khái niệm bộ vi xử lý (MPU), vi điều khiển (MCU), cấu trúc bus, không gian bộ nhớ, kiến trúc ARM7TDMI, pipeline và chế độ 32-bit ARM / 16-bit Thumb.',
            'sections': [
                {
                    'title': '1. Khái niệm cơ bản & Phân biệt Vi xử lý - Vi điều khiển',
                    'content': [
                        '**Bộ vi xử lý (MPU - Microprocessor Unit)**: Là khối xử lý trung tâm (CPU) được chế tạo tích hợp trên một vi mạch bán dẫn đơn (chíp IC). MPU chỉ chứa các khối tính toán và điều khiển (ALU, CU, Registers), chưa có bộ nhớ RAM/ROM và các cổng I/O trên chip; muốn hoạt động phải ghép nối với các linh kiện bên ngoài thông qua hệ thống bus.',
                        '**Vi điều khiển (MCU - Microcontroller Unit)**: Là một hệ thống máy tính hoàn chỉnh thu nhỏ được tích hợp trên một chíp đơn (Computer on a chip), bao gồm: CPU, bộ nhớ RAM, bộ nhớ ROM (Flash), các bộ định thời (Timers), các cổng vào/ra (I/O ports) và mạch truyền thông nối tiếp (UART/SPI/I2C).',
                        '**So sánh cốt lõi**:\n- MPU: Tối ưu cho xử lý dữ liệu phức tạp, tốc độ cao (máy tính, máy chủ), chi phí cao, cần mạch ngoại vi ngoài.\n- MCU: Tối ưu cho điều khiển nhúng, đo lường tự động, giá thành thấp, tiêu thụ ít điện năng, thiết kế mạch đơn giản.'
                    ]
                },
                {
                    'title': '2. Cấu trúc Bus & Nguyên lý hoạt động của CPU',
                    'content': [
                        '**Hệ thống Bus**:\n- **Bus địa chỉ (Address Bus)**: Bus 1 chiều (Unidirectional) đi từ CPU ra bộ nhớ và ngoại vi. Số đường địa chỉ n quyết định không gian địa chỉ tối đa 2^n Byte (Ví dụ: 16 đường A15-A0 -> 2^16 = 64 KB; 24 đường A23-A0 -> 2^24 = 16 MB; 25 đường A24-A0 -> 2^25 = 32 MB).\n- **Bus dữ liệu (Data Bus)**: Bus 2 chiều (Bidirectional) truyền dữ liệu giữa CPU với bộ nhớ/vào-ra.\n- **Bus điều khiển (Control Bus)**: Truyền các tín hiệu đồng bộ và điều khiển đọc/ghi (RD, WR, PSEN, ALE...).',
                        '**Nguyên lý hoạt động của CPU**: Hoạt động theo chu kỳ lệnh liên tục và tuần tự:\n- Bước 1: Nạp lệnh (Fetch) từ bộ nhớ chương trình vào thanh ghi lệnh thông qua bus dữ liệu.\n- Bước 2: Giải mã lệnh (Decode) bởi khối giải mã lệnh trong CPU (CU - Control Unit).\n- Bước 3: Thực thi lệnh (Execute) bởi khối ALU (xử lý số học và logic) hoặc khối rẽ nhánh.',
                        'Tập lệnh và chương trình được lưu trong bộ nhớ chương trình dưới dạng **Mã máy / Mã nhị phân (Opcode)**.'
                    ]
                },
                {
                    'title': '3. Cấu trúc bộ nhớ bán dẫn',
                    'content': [
                        '**Bộ nhớ ROM (Read-Only Memory)**: Bộ nhớ không khả biến (Non-volatile), không mất dữ liệu khi mất điện. Thường dùng lưu chương trình nạp sẵn (Firmware/BIOS):\n- Mask ROM: Ghi cứng từ nhà sản xuất.\n- PROM: Lập trình một lần bằng thiết bị chuyên dụng.\n- EPROM: Xóa bằng tia cực tím qua cửa sổ thạch anh.\n- EEPROM & Flash ROM: Xóa và ghi lại bằng tín hiệu điện nhanh chóng.',
                        '**Bộ nhớ RAM (Random Access Memory)**: Bộ nhớ khả biến (Volatile), mất dữ liệu khi mất điện. Dùng lưu trữ dữ liệu tạm thời trong quá trình thực hiện lệnh:\n- **SRAM (Static RAM)**: Cấu tạo từ flip-flop transistor, tốc độ rất cao, không cần làm tươi dữ liệu, dùng làm Cache, RAM nội.\n- **DRAM (Dynamic RAM)**: Cấu tạo từ tụ điện và transistor, dung lượng rất lớn, giá rẻ nhưng tụ bị rò điện nên **bắt buộc phải có quá trình làm tươi dữ liệu (Memory Refresh)** định kỳ.'
                    ]
                },
                {
                    'title': '4. Kiến trúc vi xử lý ARM & Pipeline',
                    'content': [
                        'Kiến trúc ARM thuộc hệ **RISC (Reduced Instruction Set Computer)**: Tập lệnh thu gọn, thời gian thực thi lệnh đồng đều (đa số 1 chu kỳ máy), cấu trúc phần cứng tối ưu năng lượng.',
                        '**Kỹ thuật Pipeline (Đường ống dẫn lệnh)**: Phân chia quá trình thực thi lệnh thành các công đoạn gối đầu nhau (Ví dụ ARM7TDMI có pipeline 3 tầng: Fetch - Decode - Execute). Mục đích chính của pipeline là **tăng tốc độ thực thi lệnh** (Throughput) mà không cần tăng tần số xung nhịp.',
                        '**Hai trạng thái hoạt động của ARM7TDMI**:\n- **Trạng thái ARM**: Thực thi tập lệnh chuẩn với độ dài lệnh và dữ liệu là **32 bit**.\n- **Trạng thái Thumb**: Thực thi tập lệnh thu gọn với độ dài lệnh là **16 bit**, giúp tăng mật độ mã và tiết kiệm 30-40% bộ nhớ ROM.',
                        '**Thanh ghi trạng thái CPSR / SPSR**: CPSR (Current Program Status Register) chứa cờ điều kiện (N, Z, C, V), bit chọn chế độ làm việc và bit cấm ngắt (I, F).'
                    ]
                }
            ]
        },
        {
            'id': 'chap2',
            'num': 2,
            'title': 'Chương 2: Phần Cứng 89C51, Bộ Nhớ & Mạch Mở Rộng',
            'clo': 'CLO2',
            'summary': 'Cấu tạo chân, chức năng các cổng P0-P3, tổ chức RAM 128 Byte, vùng SFR, mạch mở rộng ROM/RAM ngoài bằng 74LS373 và 74LS138.',
            'sections': [
                {
                    'title': '1. Cấu trúc chân & Các cổng vào/ra (P0 - P3)',
                    'content': [
                        'Vi điều khiển 89C51 (họ MCS-51) có 40 chân DIP, cấp nguồn VCC = 5V (chân 40), VSS = GND (chân 20).',
                        '**Chân điều khiển quan trọng**:\n- **EA/VPP (External Access)**: Nối mức 1 (VCC) để thực thi ROM nội (0000H-0FFFH, 4KB), nếu vượt quá 4KB sẽ tự sang ROM ngoại. Nối mức 0 (GND) để chỉ dùng ROM ngoại (bắt đầu từ 0000H).\n- **ALE (Address Latch Enable)**: Phát xung điều khiển vi mạch chốt 74LS373 để tách bus địa chỉ A0-A7 từ bus ghép AD0-AD7 trên cổng P0. Tần số xung f_ALE = F_osc / 6.\n- **PSEN (Program Store Enable)**: Tín hiệu cho phép đọc bộ nhớ chương trình ROM ngoại (tích cực mức thấp 0), nối chân OE của chip nhớ.\n- **RST (Reset)**: Tích cực mức cao (mức 1 ít nhất 2 chu kỳ máy). Sau reset: PC = 0000H, SP = 07H, P0-P3 = FFH, các thanh ghi khác = 00H.',
                        '**4 cổng I/O (8 bit mỗi cổng)**:\n- **Cổng P0**: Chân cực thu để hở (Open Drain), khi làm cổng I/O thông thường **bắt buộc phải gắn thêm điện trở kéo lên bên ngoài** (khoảng 4.7kΩ - 10kΩ). Khi mở rộng bus, P0 làm bus đa hợp Địa chỉ/Dữ liệu (AD0-AD7). Trước khi đọc dữ liệu từ chân cổng, phải ghi bit 1 ra chân đó!\n- **Cổng P1**: Cổng I/O đa dụng, có sẵn trở kéo lên nội.\n- **Cổng P2**: Cổng I/O có trở kéo lên nội. Khi mở rộng bus, đóng vai trò bus địa chỉ byte cao (A8-A15).\n- **Cổng P3**: Cổng I/O kiêm các chức năng phụ đặc biệt: P3.0 (RxD), P3.1 (TxD), P3.2 (INT0), P3.3 (INT1), P3.4 (T0), P3.5 (T1), P3.6 (WR), P3.7 (RD).'
                    ]
                },
                {
                    'title': '2. Tổ chức bộ nhớ RAM nội (128 Byte: 00H - 7FH)',
                    'content': [
                        '**Vùng 00H - 1FH (32 byte)**: 4 Bank thanh ghi đa năng (Bank 0, 1, 2, 3), mỗi bank gồm 8 thanh ghi R0 - R7. Chọn bank thông qua 2 bit RS1, RS0 trong thanh ghi PSW. Sau khi reset mặc định chọn **Bank 0** (địa chỉ 00H - 07H).',
                        '**Vùng 20H - 2FH (16 byte = 128 bit)**: Vùng RAM có khả năng **định địa chỉ theo từng bit**, đánh số từ bit 00H đến 7FH (Ví dụ bit 0 của ô nhớ 20H có địa chỉ bit là 00H; bit 7 của ô nhớ 2FH có địa chỉ bit là 7FH).',
                        '**Vùng 30H - 7FH (80 byte)**: Vùng RAM đa dụng (Scratch pad) và ngăn xếp (Stack). Sau reset, con trỏ ngăn xếp **SP = 07H**, lệnh PUSH đầu tiên sẽ đẩy dữ liệu vào ô nhớ **08H** (bắt đầu vùng Bank 1).'
                    ]
                },
                {
                    'title': '3. Thanh ghi chức năng đặc biệt SFR & Thanh ghi PSW',
                    'content': [
                        'Vùng SFR (Special Function Registers) nằm ở không gian địa chỉ **80H - FFH**.',
                        '**Quy tắc nhớ nhanh SFR có định địa chỉ bit**: Chỉ những thanh ghi có địa chỉ tận cùng là **0 hoặc 8** mới có thể định địa chỉ bit! Gồm: ACC (E0H), B (F0H), PSW (D0H), IP (B8H), P3 (B0H), IE (A8H), P2 (A0H), SCON (98H), P1 (90H), TCON (88H), P0 (80H).',
                        'Các thanh ghi KHÔNG định địa chỉ bit: SP (81H), DPL (82H), DPH (83H), PCON (87H), TMOD (89H), TL0 (8AH), TL1 (8BH), TH0 (8CH), TH1 (8DH), SBUF (99H).',
                        '**Thanh ghi trạng thái PSW (D0H)**:\n- PSW.7 (CY): Cờ nhớ (Carry).\n- PSW.6 (AC): Cờ nhớ phụ nửa byte thấp sang nửa byte cao (Auxiliary Carry).\n- PSW.5 (F0): Cờ người dùng định nghĩa.\n- PSW.4 (RS1), PSW.3 (RS0): Chọn Bank thanh ghi (00: Bank 0, 01: Bank 1, 10: Bank 2, 11: Bank 3).\n- PSW.2 (OV): Cờ tràn phép tính số học bù 2 có dấu.\n- PSW.1: Dự trữ.\n- PSW.0 (P): Cờ chẵn lẻ (Parity), tự động bằng 1 khi số bit 1 trong thanh ghi A là số lẻ.'
                    ]
                },
                {
                    'title': '4. Phương pháp tính Dung lượng & Mở rộng RAM/ROM ngoài',
                    'content': [
                        '**Dung lượng tối đa**: 89C51 có 16 đường địa chỉ A0 - A15 -> không gian tối đa là 2^16 = 64 KB ROM ngoài và 64 KB RAM ngoài.',
                        '**Công thức tính dung lượng chip nhớ**: Chip có k đường địa chỉ -> Dung lượng = 2^k Byte. (Ví dụ: RAM 6264 có 13 đường địa chỉ A0 - A12 -> 2^13 = 8 KB; RAM 62256 có 15 đường A0 - A14 -> 2^15 = 32 KB).',
                        '**Nguyên lý giải mã địa chỉ (74LS138 / Cổng Logic)**:\n- Các đường địa chỉ thấp A0 - A(k-1) nối trực tiếp vào các chân địa chỉ của IC nhớ.\n- Các đường địa chỉ cao từ vi điều khiển nối vào mạch giải mã để tạo tín hiệu chọn chip CS (tích cực mức 0).\n- Để xác định dải địa chỉ Hex: Viết chuỗi 16 bit nhị phân từ A15 đến A0. Các bit giải mã cố định theo chân kích hoạt; các bit chạy biến thiên từ toàn 0 đến toàn 1. Chuyển từng cụm 4 bit sang số Hex.'
                    ]
                }
            ]
        },
        {
            'id': 'chap3',
            'num': 3,
            'title': 'Chương 3: Tập Lệnh Hợp Ngữ 8051 & Các Chế Độ Định Địa Chỉ',
            'clo': 'CLO2 & CLO3',
            'summary': '5 chế độ định địa chỉ, 5 nhóm lệnh cốt lõi (chuyển dữ liệu, số học, logic, xử lý bit, rẽ nhánh), cách xác định trạng thái thanh ghi và cờ.',
            'sections': [
                {
                    'title': '1. 5 Chế độ định địa chỉ cốt lõi',
                    'content': [
                        '**Tức thời (Immediate Addressing)**: Dữ liệu là hằng số nằm ngay sau mã lệnh, có dấu `#` trước giá trị. Ví dụ: `MOV A, #25H` (nạp giá trị 25H vào A), `MOV DPTR, #1234H`.',
                        '**Trực tiếp (Direct Addressing)**: Toán hạng là địa chỉ ô nhớ RAM nội (00H-7FH) hoặc thanh ghi SFR (80H-FFH). Ví dụ: `MOV A, 30H` (lấy dữ liệu từ ô nhớ 30H nạp vào A).',
                        '**Gián tiếp qua thanh ghi (Indirect Addressing)**: Toán hạng là con trỏ địa chỉ chứa trong thanh ghi R0, R1 (với RAM nội) hoặc DPTR (với RAM ngoài), có ký tự `@`. Ví dụ: `MOV A, @R0` (lấy dữ liệu tại ô nhớ có địa chỉ lưu trong R0 nạp vào A).',
                        '**Thanh ghi (Register Addressing)**: Toán hạng là các thanh ghi R0 - R7 của Bank hiện hành. Ví dụ: `MOV A, R3`.',
                        '**Chỉ số (Indexed Addressing)**: Dùng truy xuất bảng trong ROM, địa chỉ ô nhớ bằng tổng nội dung thanh ghi cơ sở và thanh ghi A. Ví dụ: `MOVC A, @A+DPTR`, `MOVC A, @A+PC`.'
                    ]
                },
                {
                    'title': '2. Lệnh Chuyển dữ liệu & Lệnh Số học',
                    'content': [
                        '**Lệnh chuyển dữ liệu**:\n- `MOV dest, src`: Sao chép nội dung.\n- `MOVX dest, src`: Truy xuất bộ nhớ RAM ngoài (Ví dụ: `MOVX A, @DPTR`, `MOVX @DPTR, A`).\n- `MOVC A, @A+DPTR`: Đọc hằng số từ bộ nhớ chương trình ROM.\n- `PUSH direct` / `POP direct`: Cất vào / lấy ra từ ngăn xếp (Lưu ý: PUSH tăng SP trước rồi mới ghi; POP đọc dữ liệu rồi giảm SP).\n- `SWAP A`: Đổi 4 bit cao và 4 bit thấp của thanh ghi A (Ví dụ: A = 58H -> SWAP A -> A = 85H).',
                        '**Lệnh số học**:\n- `ADD A, src`: Cộng thường. `ADDC A, src`: Cộng có cờ nhớ (A = A + src + CY).\n- `SUBB A, src`: Trừ có mượn (A = A - src - CY). **Lưu ý**: Trước khi trừ phải chú ý cờ CY, nếu CY=1 thì sẽ trừ thêm 1!\n- `MUL AB`: Nhân không dấu 8-bit x 8-bit. Tích 16-bit lưu: Byte thấp vào A, Byte cao vào B. Cờ OV=1 nếu kết quả > 255 (B != 0).\n- `DIV AB`: Chia không dấu A cho B. Thương vào A, số dư vào B. Cờ OV=1 nếu chia cho 0 (B=0).\n- `DA A`: Hiệu chỉnh thập phân BCD cho thanh ghi A sau phép cộng.'
                    ]
                },
                {
                    'title': '3. Lệnh Logic, Xử lý bit & Điều khiển rẽ nhánh',
                    'content': [
                        '**Lệnh logic**:\n- `ANL` (AND bit), `ORL` (OR bit), `XRL` (XOR bit).\n- `CLR A` (xóa A về 0), `CPL A` (đảo tất cả bit của A, lấy bù 1).\n- `RL A` (quay trái 1 bit), `RLC A` (quay trái qua cờ CY), `RR A` (quay phải), `RRC A` (quay phải qua CY).',
                        '**Lệnh điều khiển rẽ nhánh**:\n- `SJMP rel`: Nhảy ngắn trong phạm vi [-128, +127] byte.\n- `LJMP addr16`: Nhảy dài tới địa chỉ 16-bit bất kỳ trong 64KB ROM.\n- `JZ rel` / `JNZ rel`: Nhảy nếu A = 0 / Nhảy nếu A khác 0.\n- `CJNE dest, src, rel`: So sánh nếu khác nhau thì nhảy. Nếu dest < src thì tự động set cờ CY = 1, ngược lại CY = 0.\n- `DJNZ Rn, rel`: Giảm thanh ghi đi 1, nếu khác 0 thì nhảy tiếp (vòng lặp cực kỳ thông dụng).'
                    ]
                }
            ]
        },
        {
            'id': 'chap4',
            'num': 4,
            'title': 'Chương 4: Bộ Định Thời / Bộ Đếm (Timer / Counter 0 & 1)',
            'clo': 'CLO3',
            'summary': 'Nguyên lý Timer/Counter, cấu hình thanh ghi TMOD, TCON, 4 chế độ hoạt động, công thức tính số xung đếm và giá trị nạp TH/TL.',
            'sections': [
                {
                    'title': '1. Nguyên lý hoạt động & Thanh ghi TMOD, TCON',
                    'content': [
                        '89C51 có 2 bộ định thời/bộ đếm 16-bit: **Timer 0** (TL0, TH0) và **Timer 1** (TL1, TH1).\n- Khi làm **Bộ định thời (Timer)**: Đếm xung nhịp nội từ dao động thạch anh qua bộ chia 12: T_cm = 12 / F_osc.\n- Khi làm **Bộ đếm (Counter)**: Đếm xung sườn âm (1 xuống 0) từ chân ngoài T0 (P3.4) hoặc T1 (P3.5).',
                        '**Thanh ghi TMOD (89H - Không định địa chỉ bit)**:\n- 4 bit cao: Timer 1 (GATE | C/T | M1 | M0)\n- 4 bit thấp: Timer 0 (GATE | C/T | M1 | M0)\n- Bit GATE: = 0 (khởi động bằng phần mềm qua bit TR); = 1 (khởi động kết hợp: cần chân INTx ở mức 1 VÀ bit TR=1).\n- Bit C/T: = 0 (chế độ Định thời - Timer); = 1 (chế độ Đếm sự kiện - Counter).\n- 2 bit M1, M0 chọn chế độ:\n  + `00` (Mode 0): 13 bit (TL 5 bit, TH 8 bit, đếm tối đa 8192 xung).\n  + `01` (Mode 1): **16 bit** (TL 8 bit, TH 8 bit, đếm tối đa 65536 xung).\n  + `10` (Mode 2): **8 bit tự nạp lại (Auto-reload)**: Giá trị trong TH tự động nạp vào TL khi TL tràn về 0. Đếm tối đa 256 xung. Rất hay dùng cho baud UART!\n  + `11` (Mode 3): Bộ định thời chia tách (Split Timer cho Timer 0).',
                        '**Thanh ghi TCON (88H - Có định địa chỉ bit)**:\n- TF1, TF0: Cờ báo tràn Timer 1, Timer 0 (bật lên 1 khi bộ đếm tràn).\n- TR1, TR0: Bit điều khiển chạy Timer (= 1 cho phép chạy, = 0 dừng đếm).'
                    ]
                },
                {
                    'title': '2. Công thức tính thời gian trễ & Giá trị nạp TH, TL',
                    'content': [
                        '**Chu kỳ máy (T_cm)**:\n- Với F_osc = 12 MHz -> T_cm = 12 / 12 MHz = 1 µs.\n- Với F_osc = 11.0592 MHz -> T_cm = 12 / 11.0592 MHz ≈ 1.085 µs.',
                        '**Số xung đếm (N)**: N = T_delay / T_cm.',
                        '**Giá trị nạp ban đầu (Mode 1 - 16 bit)**:\n- Giá trị nạp = 65536 - N.\n- TH = int(Giá trị nạp / 256) (đổi sang Hex lấy 2 chữ số đầu).\n- TL = Giá trị nạp % 256 (đổi sang Hex lấy 2 chữ số cuối).',
                        '**Giá trị nạp ban đầu (Mode 2 - 8 bit)**:\n- Giá trị nạp = 256 - N (viết dạng bù: `MOV THx, #-N`).'
                    ]
                }
            ]
        },
        {
            'id': 'chap5',
            'num': 5,
            'title': 'Chương 5: Truyền Thông Nối Tiếp UART & Tốc Độ Baud',
            'clo': 'CLO3',
            'summary': 'Khung truyền UART, thanh ghi SCON, SBUF, PCON, công thức tính tốc độ Baud với thạch anh 11.0592 MHz và giá trị nạp TH1.',
            'sections': [
                {
                    'title': '1. Nguyên lý truyền thông & Thanh ghi SCON, SBUF',
                    'content': [
                        'Giao tiếp UART trên 89C51 truyền không đồng bộ, song công toàn phần (Full Duplex) qua 2 chân **RxD (P3.0)** và **TxD (P3.1)**.',
                        '**Thanh ghi đệm SBUF (99H)**: Gồm 2 thanh ghi vật lý riêng biệt cùng tên: ghi vào SBUF là phát dữ liệu qua TxD; đọc từ SBUF là nhận dữ liệu từ RxD.',
                        '**Thanh ghi điều khiển SCON (98H - Có định địa chỉ bit)**:\n- SM0, SM1: Chọn chế độ truyền (Mode 0: thanh ghi dịch 8 bit; **Mode 1: UART 8 bit baud thay đổi**; Mode 2: UART 9 bit baud cố định; Mode 3: UART 9 bit baud thay đổi).\n- REN (bit 4): Cho phép nhận dữ liệu (= 1 cho phép nhận, = 0 cấm nhận).\n- TI (bit 1): Cờ ngắt truyền, vi điều khiển tự set lên 1 khi truyền xong Stop bit. **Phải xóa bằng phần mềm: `CLR TI`**.\n- RI (bit 0): Cờ ngắt nhận, tự set lên 1 khi nhận xong Stop bit. **Phải xóa bằng phần mềm: `CLR RI`**.'
                    ]
                },
                {
                    'title': '2. Công thức tính Tốc độ Baud & Bảng giá trị TH1 chuẩn',
                    'content': [
                        'Để tạo tốc độ Baud chuẩn, **Timer 1 luôn được cấu hình ở Chế độ 2 (8 bit auto-reload)**: `MOV TMOD, #20H`.',
                        '**Công thức Baud Rate**:\nBaud = (2^SMOD * F_osc) / (384 * (256 - TH1))\nTrong đó bit SMOD nằm trong thanh ghi PCON (mặc định SMOD = 0).',
                        '**Bảng tra cứu tốc độ Baud chuẩn (F_osc = 11.0592 MHz, SMOD = 0)**:\n- **9600 Baud**: 256 - TH1 = 3 -> TH1 = -3 = FDH\n- **4800 Baud**: 256 - TH1 = 6 -> TH1 = -6 = FAH\n- **2400 Baud**: 256 - TH1 = 12 -> TH1 = -12 = F4H\n- **1200 Baud**: 256 - TH1 = 24 -> TH1 = -24 = E8H',
                        '**Quy trình truyền ký tự**:\n1. Khởi tạo Timer 1 Mode 2: `MOV TMOD, #20H`\n2. Nạp tốc độ Baud: `MOV TH1, #-3` (cho 9600 baud)\n3. Cấu hình UART: `MOV SCON, #50H` (Mode 1, REN=1)\n4. Bật Timer 1: `SETB TR1`\n5. Ghi ký tự vào SBUF: `MOV SBUF, A`\n6. Chờ truyền xong: `JNB TI, $`\n7. Xóa cờ truyền: `CLR TI`'
                    ]
                }
            ]
        },
        {
            'id': 'chap6',
            'num': 6,
            'title': 'Chương 6: Hệ Thống Ngắt (Interrupts) & Lập Trình Ngắt',
            'clo': 'CLO3',
            'summary': '5 nguồn ngắt chuẩn, bảng vector ngắt, cấu hình thanh ghi IE và IP, lập trình ngắt Timer, ngắt ngoài và ngắt UART.',
            'sections': [
                {
                    'title': '1. Bảng Vector Ngắt & Điều kiện xảy ra ngắt',
                    'content': [
                        '89C51 hỗ trợ 5 nguồn ngắt chuẩn (+ Reset hệ thống):\n- **Reset**: Địa chỉ vector 0000H (Ưu tiên tuyệt đối)\n- **Ngắt ngoài 0 (INT0)**: Địa chỉ vector 0003H\n- **Ngắt Timer 0 (TF0)**: Địa chỉ vector 000BH\n- **Ngắt ngoài 1 (INT1)**: Địa chỉ vector 0013H\n- **Ngắt Timer 1 (TF1)**: Địa chỉ vector 001BH\n- **Ngắt nối tiếp UART (TI/RI)**: Địa chỉ vector 0023H',
                        '**Mẹo nhớ vector**: Mỗi vector cách nhau đúng 8 byte (03H -> 0BH -> 13H -> 1BH -> 23H).',
                        '**Điều kiện ngắt được thực thi**:\n1. Bit cho phép ngắt toàn cục EA = 1 (trong thanh ghi IE).\n2. Bit cho phép ngắt tương ứng được bật lên 1 (EX0, ET0, EX1, ET1, ES = 1).\n3. Cờ yêu cầu ngắt tương ứng tích cực.\n4. Không có ngắt cùng cấp hoặc ưu tiên cao hơn đang được phục vụ.'
                    ]
                },
                {
                    'title': '2. Thanh ghi cho phép ngắt IE & Ưu tiên ngắt IP',
                    'content': [
                        '**Thanh ghi IE (A8H - Có định địa chỉ bit)**:\n- IE.7 (EA): Cho phép toàn bộ ngắt (= 1 mở, = 0 đóng toàn bộ).\n- IE.4 (ES): Cho phép ngắt cổng nối tiếp UART.\n- IE.3 (ET1): Cho phép ngắt Timer 1.\n- IE.2 (EX1): Cho phép ngắt ngoài 1.\n- IE.1 (ET0): Cho phép ngắt Timer 0.\n- IE.0 (EX0): Cho phép ngắt ngoài 0.\n- Ví dụ: Cho phép ngắt Timer 0 và Timer 1 -> IE = 10001010b = 8AH.',
                        '**Thanh ghi IP (B8H - Có định địa chỉ bit)**:\n- Đặt mức ưu tiên cho từng ngắt: Bit = 1 là mức ưu tiên cao (High), Bit = 0 là mức ưu tiên thấp (Low).\n- Ngắt ưu tiên cao có thể ngắt (chen ngang) chương trình phục vụ ngắt ưu tiên thấp.',
                        '**Lệnh RETI**: Chương trình phục vụ ngắt (ISR) bắt buộc phải kết thúc bằng lệnh `RETI`. Lệnh này vừa phục hồi con trỏ lệnh PC từ ngăn xếp, vừa báo cho phần cứng xóa cờ trạng thái ngắt đang phục vụ.'
                    ]
                }
            ]
        },
        {
            'id': 'casio_guide',
            'num': 7,
            'title': 'Phụ Lục: Sổ Tay Bấm Máy Casio fx-580VNX & Mẹo Nhớ Siêu Tốc',
            'clo': 'TẤT CẢ DẠNG BÀI',
            'summary': 'Tổng hợp các thao tác bấm máy tính Casio fx-580VNX / fx-570VN Plus và các quy tắc mẹo nhẩm nhanh cho kỳ thi trắc nghiệm.',
            'sections': [
                {
                    'title': '1. Mẹo bấm máy Casio Mode Base-N (Chuyển đổi Hex/Dec/Bin)',
                    'content': [
                        '**Vào chế độ hệ cơ số**: Bấm `MENU 3` (fx-580VNX) hoặc `MODE 4` (fx-570VN Plus).',
                        '**Các phím chọn hệ**:\n- `x²` : Hệ Thập phân (DEC)\n- `xⁿ` : Hệ Thập lục phân (HEX - các chữ cái A, B, C, D, E, F nằm trên các phím (-), °\'\", sin, cos, tan)\n- `log` : Hệ Bát phân (OCT)\n- `ln` : Hệ Nhị phân (BIN)',
                        '**Tính kết quả phép toán trừ/cộng Hex**: Đang ở chế độ HEX, gõ trực tiếp `45 - AD - 1` (khi cờ CY=1) -> Máy hiện ngay kết quả `97H`.',
                        '**Đếm số bit 1 để xác định cờ Parity P**:\n- Sau khi tính ra kết quả Hex, bấm phím `BIN` -> màn hình hiển thị toàn bộ chuỗi nhị phân -> đếm số chữ số 1: Nếu lẻ thì P = 1, nếu chẵn thì P = 0.'
                    ]
                },
                {
                    'title': '2. Mẹo tính nhanh giá trị nạp Timer TH/TL (Mode 1 & Mode 2)',
                    'content': [
                        '**Timer Mode 1 (16 bit)**:\n- Bước 1: Tính số xung N = T_delay / T_cm (với thạch anh 12MHz thì N = T_delay in µs).\n- Bước 2: Bấm `65536 - N` trên Casio -> Bấm chuyển sang `HEX`.\n- Bước 3: Đọc 4 ký tự Hex: 2 ký tự đầu là TH, 2 ký tự sau là TL.\n- *Ví dụ*: Cần tạo trễ 1ms (1000 µs) với XTAL 12MHz -> 65536 - 1000 = 64536 -> đổi sang HEX là FC18H -> TH = FCH, TL = 18H.',
                        '**Timer Mode 2 (8 bit)**:\n- Bấm `256 - N` -> đổi sang HEX -> đó chính là giá trị của TH.'
                    ]
                },
                {
                    'title': '3. Mẹo nhớ nhanh Tốc độ Baud & Mẹo loại trừ trắc nghiệm',
                    'content': [
                        '**Tốc độ Baud (với thạch anh 11.0592 MHz)**: Nhớ công thức TH1 = -28800 / Baud:\n- 9600 -> -3 = FDH\n- 4800 -> -6 = FAH\n- 2400 -> -12 = F4H\n- 1200 -> -24 = E8H',
                        '**Mẹo kiểm tra lệnh Hợp ngữ**:\n- 8051 hỗ trợ `MOV direct, direct`: `MOV 30H, 40H` hợp lệ, sao chép nội dung địa chỉ 40H vào địa chỉ 30H. Không cần đi qua A.\n- Không có lệnh `MOV @R2, A` (chỉ dùng `@R0` và `@R1`).\n- Không có lệnh `INC DPTR` byte thấp đơn lẻ, chỉ có `INC DPTR` cả 16 bit.\n- Không có lệnh `MOV DPTR, A` (chỉ có `MOV DPTR, #data16`).'
                    ]
                }
            ]
        }
    ]
}

with open('data/knowledge_base.json', 'w', encoding='utf-8') as f:
    json.dump(kb, f, ensure_ascii=False, indent=2)

print('Successfully created data/knowledge_base.json!')
