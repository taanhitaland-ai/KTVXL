/* Add a new stable ID for each release; never reuse IDs already marked as read. */
window.KMA_SITE_UPDATES = [
  { id: '2026-10-08-streak-focus-reliability', date: '08/10/2026', title: 'Chuỗi học theo môn & Pomodoro ổn định hơn',
    added: ['Chuỗi học có 5 cấp ở mốc 1, 2, 3, 5 và 7 ngày liên tiếp; bấm ngọn lửa trên thanh trạng thái để mở cửa sổ chuỗi riêng, chưa có chuỗi thì nút ẩn.', 'Bản đồ nhiệt trong tháng có màu riêng từng môn, đánh dấu ngày thi; bấm ngày để xem thời gian từng môn và lịch thi.', 'Tự động có tên trên bảng xếp hạng khi tài khoản có phút Pomodoro; thêm nút làm mới bảng.'],
    fixed: ['Phản hồi đồng bộ không dựng lại câu hỏi khi tiến trình không thay đổi.', 'Đồng hồ tính thời gian thực khi tab chạy nền; tải lại trang tiếp tục phiên đang học.', 'Kết thúc sớm ghi nhận số phút thực tế; giữ yêu cầu hoàn tất để thử lại khi mất mạng và tránh cộng đôi.'] },
  { id: '2026-10-08-google-sync-leaderboard', date: '08/10/2026', title: 'Đăng nhập Google, đồng bộ & bảng xếp hạng tập trung',
    added: ['Đăng nhập Google để mang câu đã làm, dấu sao, ghi chú và lịch sử học sang thiết bị khác.', 'Chọn mang theo dữ liệu trước khi đăng nhập; giữ bản khách và xử lý ghi chú đổi ở hai nơi.', 'Bảng xếp hạng Pomodoro thật theo ngày, tuần, tháng và môn học; tự chọn tham gia bằng biệt danh.'],
    fixed: ['Thiết kế lại bảng xếp hạng sáng/tối, bục vàng/bạc/đồng, thanh tiến độ và dòng của bạn cố định.', 'Chỉ tính phiên tập trung đủ thời gian trên máy chủ, chống cộng lại khi gửi lại yêu cầu.', 'Đồng bộ tiến trình giữ bộ lọc và không làm gián đoạn bài thi đang làm.'] },
  { id: '2026-10-08-notes-updates', date: '08/10/2026', title: 'Ghi chú câu hỏi & thông báo cập nhật',
    added: ['Ghi chú riêng cho từng câu hỏi ở cả bốn môn, với sáu màu có nhãn và giao diện giấy nhớ sáng/tối.', 'Lưu, sửa, xóa và hoàn tác xóa ghi chú; sửa ngay tại thẻ dưới câu hỏi trên máy tính và điện thoại.', 'Nút chuông để xem tính năng mới, lỗi đã sửa và đánh dấu cập nhật đã đọc.'],
    fixed: ['Kiểm tra dữ liệu ghi chú để tránh nội dung lỗi ảnh hưởng trang học.', 'Sửa bộ lọc bị tràn ngang trên điện thoại.', 'Bấm thẻ để sửa, Xem thêm ghi chú dài, thông báo lưu tự ẩn; xác nhận trước khi xóa.', 'Cải thiện dấu tiếng Việt ở đề bài bằng Be Vietnam Pro và chuẩn hóa NFC.'] },
  { id: '2026-10-08-inline-answers', date: '08/10/2026', title: 'Đọc lời giải ngay trong câu hỏi',
    added: ['Lời giải hiển thị trực tiếp dưới câu hỏi sau khi chọn đáp án trên máy tính và điện thoại.', 'Góc xả stress với xúc xắc 3D, âm thanh và lời chúc ôn thi.'],
    fixed: ['Giữ lời giải bên phải đồng bộ với câu hỏi đang làm.'] },
  { id: '2026-10-07-halloween-music', date: '07/10/2026', title: 'Góc học đêm Halloween',
    added: ['Giao diện tối tím sâu và vàng ấm, thêm trăng, bí ngô và ngôi nhà Halloween.', 'Danh sách nhạc cá nhân trong Pomodoro: thêm, sửa, xóa, tìm kiếm, chuyển bài, lặp và nhập/xuất danh sách.'],
    fixed: ['Đồng bộ màu của nội dung đọc, các nút và sơ đồ; giữ hình dạng các node.'] },
  { id: '2026-10-07-diagrams-exams', date: '07/10/2026', title: 'Sơ đồ kiến thức & thi thử',
    added: ['Sơ đồ có liên kết giữa các thành phần cho Vi xử lý, Tư tưởng Hồ Chí Minh, Vật lý và Xác suất thống kê.', 'Mở rộng sơ đồ toàn màn hình và xem kiến thức khi chọn node.'],
    fixed: ['Chọn đúng đề thi đã chọn thay vì chuyển sang đề ngẫu nhiên.', 'Chuẩn hóa cách hiển thị công thức và cải thiện bộ lọc nguồn đề.'] }
];
