import json

db_path = 'data/questions_db.json'
progress_path = 'data/audit_progress.json'

with open(db_path, 'r', encoding='utf-8') as f:
    questions = json.load(f)

q_map = {q['id']: q for q in questions}

# 1. DE001_Q23
q = q_map['DE001_Q23']
q['answer'] = 'C.7'
q['explanation'] = (
    "Ban đầu nạp $A = 15\\text{H} = 0001\\,0101_2$. Để sau lệnh ANL A, #9BH ($1001\\,1011_2$) "
    "tích lũy A đạt $91\\text{H} = 1001\\,0001_2$, giá trị của A trước phép AND phải có bit 7 bằng 1 "
    "(tức $95\\text{H} = 1001\\,0101_2$). Để đưa bit 7 của A lên 1, ta dùng lệnh SETB ACC.7. "
    "Chỗ trống sau tiền tố AC cần điền là C.7."
)

# 2. DE001_Q37
q = q_map['DE001_Q37']
q['answer'] = 'B'
q['explanation'] = (
    "Thanh ghi ưu tiên ngắt IP có giá trị $0\\text{AH} = 0000\\,1010_2$: Bit 1 (PT0 - Timer 0) và Bit 3 (PT1 - Timer 1) "
    "cùng được đặt lên 1 (mức ưu tiên cao). Khi hai nguồn ngắt có cùng mức ưu tiên trong thanh ghi IP, "
    "vi điều khiển 8051 sẽ xét thứ tự ưu tiên phần cứng mặc định (polling sequence): "
    "Ngắt ngoài 0 > Timer 0 > Ngắt ngoài 1 > Timer 1 > Cổng nối tiếp. "
    "Vì Timer 0 có thứ tự phần cứng đứng trước Timer 1, nên ngắt có mức ưu tiên cao nhất là Ngắt Timer 0. Chọn đáp án B."
)

# 3. DE002_Q29
q = q_map['DE002_Q29']
q['options'] = ['A. TH1 = B1H, TL1 = E0H', 'B. TH1 = C2H, TL1 = B0H', 'C. TH1 = D0H, TL1 = 50H', 'D. TH1 = A0H, TL1 = 30H']
q['answer'] = 'A'
q['explanation'] = (
    "Với tần số thạch anh $12\\,\\text{MHz}$, chu kỳ máy là $T_{\\text{cm}} = 1\\,\\mu\\text{s}$. "
    "Khoảng thời gian trễ $20\\,\\text{ms} = 20.000\\,\\mu\\text{s} = 20.000$ chu kỳ máy. "
    "Timer 1 chế độ 1 (16 bit) đếm tiến từ giá trị nạp đến khi tràn ($65.536$). "
    "Giá trị nạp $N = 65536 - 20000 = 45536 = \\text{B1E0H}$. "
    "Do đó $\\text{TH1} = \\text{B1H}$ và $\\text{TL1} = \\text{E0H}$. Chọn đáp án A."
)

# 4. DE002_Q37
q = q_map['DE002_Q37']
q['options'] = ['A. MOV IE, #90H', 'B. MOV IE, #95H', 'C. MOV IE, #80H', 'D. MOV IE, #84H']
q['answer'] = 'D'
q['explanation'] = (
    "Lệnh SETB EA cho phép ngắt toàn cục (bit 7 của thanh ghi IE: EA = 1, tương ứng $80\\text{H}$). "
    "Lệnh SETB EX1 cho phép ngắt ngoài 1 (bit 2 của thanh ghi IE: EX1 = 1, tương ứng $04\\text{H}$). "
    "Khi gán trực tiếp vào thanh ghi IE: $\\text{IE} = 80\\text{H} + 04\\text{H} = 84\\text{H}$. "
    "Dòng lệnh tương đương là MOV IE, #84H. Chọn đáp án D."
)

# 5. DE003_Q22
q = q_map['DE003_Q22']
q['prompt'] = 'Cho chương trình con thực hiện bởi vi điều khiển 89C51, biết tần số thạch anh là 12MHz, hãy xác định chức năng của chương trình:'
q['answer'] = 'A'
q['explanation'] = (
    "Với thạch anh $12\\,\\text{MHz}$ (chu kỳ máy $T_{\\text{cm}} = 1\\,\\mu\\text{s}$), "
    "Timer 1 hoạt động ở Chế độ 1 nạp giá trị $\\text{B1E0H} = 45536$. "
    "Số chu kỳ đếm tạo trễ nửa chu kỳ là $65536 - 45536 = 20000\\,\\mu\\text{s} = 20\\,\\text{ms}$. "
    "Lệnh CPL P1.5 đảo trạng thái chân P1.5 sau mỗi nửa chu kỳ, do đó chu kỳ sóng vuông toàn phần là "
    "$T = 2 \\times 20\\,\\text{ms} = 40\\,\\text{ms} = 0{,}04\\,\\text{s}$. Tần số sóng vuông: $f = 1 / 0{,}04 = 25\\,\\text{Hz}$. Chọn đáp án A."
)

# 6. DE004_Q06
q = q_map['DE004_Q06']
q['explanation'] = (
    "Khi chân tín hiệu RST (Reset) của vi điều khiển 89C51 được duy trì ở mức điện thế cao (mức 1) trong ít nhất 2 chu kỳ máy, "
    "mạch reset nội sẽ khởi tạo lại toàn bộ hệ thống, thanh ghi con trỏ lệnh PC được nạp về địa chỉ $0000\\text{H}$ để bắt đầu lại chương trình từ đầu. Chọn đáp án A."
)

with open(db_path, 'w', encoding='utf-8') as f:
    json.dump(questions, f, ensure_ascii=False, indent=2)

with open(progress_path, 'r', encoding='utf-8') as f:
    progress = json.load(f)

if 'ktvxl' not in progress:
    progress['ktvxl'] = {}

for fid in ['DE001_Q23', 'DE001_Q37', 'DE002_Q29', 'DE002_Q37', 'DE003_Q22', 'DE004_Q06']:
    progress['ktvxl'][fid] = {
        'status': 'FIXED',
        'calculated_answer': q_map[fid]['answer'],
        'notes': 'Đã sửa đề / đáp án / lời giải chuẩn xác 100%.',
        'checked_at': '2026-10-07 18:25:00'
    }

for vid in ['DE001_Q34', 'DE001_Q40', 'DE003_Q16', 'DE003_Q29', 'DE003_Q37', 'DE004_Q17']:
    progress['ktvxl'][vid] = {
        'status': 'VERIFIED',
        'calculated_answer': q_map[vid]['answer'],
        'notes': 'Đã kiểm tra đối chiếu barem và giáo trình KMA chuẩn.',
        'checked_at': '2026-10-07 18:25:00'
    }

with open(progress_path, 'w', encoding='utf-8') as f:
    json.dump(progress, f, ensure_ascii=False, indent=2)

print('Clean patch applied successfully!')
