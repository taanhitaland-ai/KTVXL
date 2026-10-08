# Supabase: tiến trình, ghi chú và Pomodoro

Trang tĩnh vẫn triển khai bằng GitHub Pages (`master/docs`). Database và Google OAuth cấu hình riêng; push Git không tự chạy SQL hoặc đổi cấu hình Google.

## Khởi tạo dự án mới

1. Tạo Supabase project thuộc tài khoản chủ dự án. Chạy `migrations/202610080001_study_sync.sql` một lần trong SQL Editor, sau đó `migrations/202610080002_focus_reliability.sql`. Migration 001 tạo bảng, RLS và RPC; không chạy lại trên schema đã có. Với project hiện tại, chỉ cần migration 002 trước khi triển khai frontend mới.
2. Trong Google Auth Platform tạo Web OAuth client. Authorized origins là origin của Pages và các máy chủ thử. Redirect URI là `https://PROJECT_REF.supabase.co/auth/v1/callback`.
3. Trong Supabase Auth → Google bật provider, nhập Client ID và Client Secret trực tiếp trong dashboard. Không đưa Client Secret, mật khẩu database, `service_role` hoặc secret API key vào mã nguồn.
4. Auth → URL Configuration: Site URL là URL Pages; Redirect URLs chứa chính xác URL index của Pages và từng bản HTTP cục bộ cần thử. Đổi cổng hoặc đường dẫn thì cập nhật danh sách.
5. `web/cloud_config.js` chỉ chứa project URL và **publishable key**. Khóa này công khai được vì quyền dữ liệu do JWT, RLS và RPC quyết định. Chạy `python scripts/sync_site.py`.
6. Google Audience ở Testing chỉ cho phép test users. Muốn các thành viên khác đăng nhập, hoàn thiện Branding/home page/privacy policy, rồi chủ dự án chuyển sang Production trong Audience. Không yêu cầu Gmail, Drive hay scopes nhạy cảm.

## Schema và quyền

- `study_profiles`: biệt danh; mặc định có tên trên bảng khi có phút Pomodoro (migration 002).
- `study_records`: bản ghi theo `kind|subject|id` cho đáp án, dấu sao, ghi chú và nhật ký phút học; version phục vụ xử lý xung đột. Giá trị `null` là dấu xóa.
- `study_sync_receipts`: ID thao tác và nội dung yêu cầu, để gửi lại không gây cộng/lưu trùng. Dùng lại cùng ID với nội dung khác bị từ chối.
- `focus_sessions`: phiên tập trung với thời điểm, trạng thái và số phút được máy chủ ghi nhận.

RLS bật ở cả bốn bảng. Người đăng nhập chỉ đọc dữ liệu của mình; client không có quyền ghi bảng trực tiếp. Các RPC riêng kiểm tra `auth.uid()`, nội dung, giới hạn và quyền sở hữu; dùng search path cố định. `study_leaderboard` là RPC công khai, chỉ trả dữ liệu xếp hạng của người có phút Pomodoro và dòng riêng khi có phiên đăng nhập. Không trả email, đáp án hay nội dung ghi chú.

Giới hạn: ghi chú 2.000 ký tự, biệt danh 32 ký tự, 25.000 bản ghi/tài khoản, 200 thao tác/request, phiên xếp hạng 1–300 phút (migration 002). Chỉ một phiên active/tài khoản. Phiên active quá 24 giờ được hủy trước khi mở phiên mới.

## Lưu tại máy

Giữ nguyên các khóa/schema khách. Adapter chỉ chuyển các khóa dữ liệu học vào namespace `kma_cloud_v1:USER_ID:data:` khi có tài khoản, giữ phiên/outbox và version riêng. Mỗi thao tác có UUID độc lập và bất biến sau khi xếp hàng. Bản mới phát sinh trong lúc gửi được giữ để gửi tiếp. Không dùng cả snapshot của một môn để ghi đè database.

Ghi chú xung đột chặn các thao tác tiếp của chính ghi chú đó đến khi người dùng chọn bản hoặc gộp. Xóa dùng tombstone, nên dữ liệu cũ trên thiết bị khác không tự làm ghi chú quay lại. Nhập dữ liệu khách không đè bản đã có hoặc dấu xóa trên cloud.

Đăng xuất chỉ kết thúc phiên tại trình duyệt đó, không xóa database hoặc cache. Xóa dữ liệu trình duyệt trên máy dùng chung. Export/xóa toàn bộ tài khoản hiện cần chủ dự án thao tác trong dashboard; chưa có RPC xóa tài khoản ở giao diện.

## Kiểm tra

`npm ci && npm test` bao gồm kiểm tra chuẩn hóa/phép chiếu dữ liệu và chạy migration trên PostgreSQL WASM (PGlite) với hai tài khoản để kiểm tra phân quyền, idempotency, xung đột, timer, thời gian thực, ghi nhận phiên sớm và tham gia tự động. `scripts/browser_cloud_sync_checks.js` chạy trên một context thử độc lập, mock RPC, để kiểm tra hàng đợi khi đang gửi, mất kết nối, xung đột, nhiều tab và bảo toàn bài thi. Không dùng context Google thật cho script này.

Migration cần được kiểm tra trên PostgreSQL/Supabase riêng với ít nhất hai users: anon không đọc bảng/RPC riêng; A không đọc/ghi dữ liệu B; retry không cộng đôi; sửa ghi chú lỗi version giữ hai bản; timer chỉ cộng phút thực tế máy chủ đo được; phút thủ công không vào bảng; tài khoản có phút tự động có hạng.

Kiểm tra tích hợp thực tế: đăng nhập cùng Google ở hai origin có vùng lưu riêng, sửa note/answer/star ở hai chiều, chạy đủ một phiên Pomodoro và đối chiếu bảng. Không thay đồng hồ browser để giả lập thời gian máy chủ.

Tài liệu chính thức: [Google Auth](https://supabase.com/docs/guides/auth/social-login/auth-google), [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), [Functions](https://supabase.com/docs/guides/database/functions), [API keys](https://supabase.com/docs/guides/getting-started/api-keys).
