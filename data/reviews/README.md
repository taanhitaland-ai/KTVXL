# Rà soát Vi xử lý Part 9–18 — 09/10/2026

Đã đọc và giải lại 546 câu, gồm cả hai bộ Part 9. Bản web dùng trắc nghiệm **4 phương án, một đáp án đúng** cho toàn bộ phạm vi này; 191 câu trước đây đang ở dạng điền đã được chuyển đổi. 438 câu còn lại trong ngân hàng Vi xử lý không thay đổi.

Hai tệp `vixuly_parts_09_18_2026_10_09.json` và `.csv` ghi kết quả cho từng ID, trang PDF gốc, đáp án mới, căn cứ và nội dung sửa. Mã nguồn được đọc theo vị trí trang để tránh lỗi thứ tự chữ trong PDF. Các dấu chọn/đánh dấu trong PDF là câu trả lời của người làm, không được coi là khóa đáp án.

Các nhóm lỗi đã sửa:

- Lựa chọn bị dính vào đề, mất phương án, nhãn A/B/C/D bị lặp và nội dung Microsoft Forms lẫn vào câu hỏi.
- Sai phân nhóm lệnh, nhầm trực tiếp/tức thời, nhầm địa chỉ bit/byte, dùng thanh ghi con trỏ không hợp lệ.
- Dạng lệnh không tồn tại (`ANL R0,#data`, `XCHD A,direct`, `MOVX A,R0`, `DEC DPTR`), toán hạng/nhãn bị thiếu và mã bị dính dòng.
- Nhầm RAM gián tiếp 80H–FFH của AT89C51 với SFR. AT89C51 chỉ có 128 byte RAM; các bài cần RAM gián tiếp được sửa sang địa chỉ dưới 80H và ghi trong nhật ký.
- Sai CY/AC/OV/P; thiếu CY ban đầu làm bài ADDC/SUBB không có kết quả duy nhất.
- Nhầm mode 0/1/2, hệ hex/thập phân, byte cao/thấp, đơn vị ms/µs, nửa chu kỳ/chu kỳ và thời gian vượt khả năng một lần tràn.
- Nhầm RXD/TXD ở mode 0, thiếu start bit, nhiều mode UART cùng đúng, sai ASCII B, thiếu SMOD/tần số/nguồn baud.

Ảnh mã lỗi được thay bằng khối mã văn bản có sửa cú pháp. Câu thiếu dữ kiện hoặc không có đáp án đúng được biên soạn lại trong cùng chủ đề; nhật ký ghi rõ các trường hợp đó. Ví dụ Part 16 câu 35 không có chương trình trong PDF nên bản web bổ sung một chương trình timer mode 2 hoàn chỉnh.

Các bài timer giả định lõi **12T**, GATE=0 và bỏ qua thời gian lệnh ngoài khoảng đếm khi đề ghi như vậy. Các bài vòng lặp trễ Part 13 tính đủ MOV, DJNZ và RET, không tính lệnh gọi. Baud lấy Timer 1 mode 2, SMOD=0 khi được nêu. Bài cổng I/O hỏi latch với giả định không bị tải ngoài ép mức.

Nguồn đối chiếu:

- [Keil 8051 Instruction Set / Opcodes](https://www.keil.com/support/man/docs/is51/is51_opcodes.asp).
- [Atmel 8051 Hardware Manual](https://ww1.microchip.com/downloads/aemDocuments/documents/OTH/ProductDocuments/UserGuides/doc4316.pdf).
- [AT89C51 datasheet](https://ww1.microchip.com/downloads/en/DeviceDoc/doc0265.pdf).
- Các PDF Part 9–18 trong `tai_lieu_vi_xu_ly/` (đường dẫn và trang cụ thể trong nhật ký).

Giữ nguyên ID, nguồn và định dạng lưu ghi chú/tiến trình. Không xóa câu đã làm hoặc chấm lại lịch sử cũ: những câu đã đổi đề/phương án nên được làm lại để có kết quả theo ngân hàng mới. Highlight cũ chỉ áp lại khi chữ/ngữ cảnh còn khớp.

PDF gốc và các bản PDF xuất trước đợt này **chưa được sửa**; đây là cập nhật ngân hàng luyện tập trên web, không phải công bố lại đáp án chính thức của giảng viên. Không chạy các bộ solver cũ để ghi đè ngân hàng đã rà soát.

Kiểm tra nội dung: `python scripts/verify_vixuly_review.py`. Kiểm tra bản web: `npm test`, `python scripts/audit_site_content.py`, `python scripts/sync_site.py --check`.
