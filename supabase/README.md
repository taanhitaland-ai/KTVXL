# Supabase: tiến trình, ghi chú và thời gian học

Trang tĩnh vẫn triển khai bằng GitHub Pages (`master/docs`). Database và Google OAuth cấu hình riêng; push Git không tự chạy SQL hoặc đổi cấu hình Google.

## Khởi tạo dự án mới

1. Tạo Supabase project thuộc tài khoản chủ dự án. Chạy `migrations/202610080001_study_sync.sql` một lần, tiếp đến `202610080002_focus_reliability.sql` và `202610090001_automatic_study_time.sql` trong SQL Editor. Migration 001 tạo bảng, RLS và RPC; không chạy lại các migration đã áp dụng. Với project hiện tại đã có 001/002, chỉ chạy bản thời gian học tự động mới trước khi publish frontend.
2. Trong Google Auth Platform tạo Web OAuth client. Authorized origins chỉ chứa origin của Pages. Redirect URI là `https://PROJECT_REF.supabase.co/auth/v1/callback`.
3. Trong Supabase Auth → Google bật provider, nhập Client ID và Client Secret trực tiếp trong dashboard. Không đưa Client Secret, mật khẩu database, `service_role` hoặc secret API key vào mã nguồn.
4. Auth → URL Configuration: Site URL và Redirect URLs chỉ chứa trang chính `https://taanhitaland-ai.github.io/KTVXL/` và `/KTVXL/index.html`. Không đưa URL localhost vào project production.
5. `web/cloud_config.js` chỉ bật project URL và **publishable key** tại HTTPS host `taanhitaland-ai.github.io`, đường dẫn `/KTVXL/`. Localhost, file HTML và host khác chỉ lưu tại trình duyệt; không tạo Supabase client. Khóa công khai và điều kiện hostname giúp tránh kết nối nhầm môi trường, còn quyền dữ liệu vẫn do JWT, RLS và RPC quyết định. Chạy `python scripts/sync_site.py`.
6. Google Audience ở Testing chỉ cho phép test users. Muốn các thành viên khác đăng nhập, hoàn thiện Branding/home page/privacy policy, rồi chủ dự án chuyển sang Production trong Audience. Không yêu cầu Gmail, Drive hay scopes nhạy cảm.

## Schema và quyền

- `study_profiles`: biệt danh; mặc định có tên trên bảng khi có phút Pomodoro (migration 002).
- `study_records`: bản ghi theo `kind|subject|id` cho đáp án, dấu sao, ghi chú và nhật ký phút học; version phục vụ xử lý xung đột. Giá trị `null` là dấu xóa.
- `study_sync_receipts`: ID thao tác và nội dung yêu cầu, để gửi lại không gây cộng/lưu trùng. Dùng lại cùng ID với nội dung khác bị từ chối.
- `focus_sessions`: phiên tập trung với thời điểm, trạng thái và số phút được máy chủ ghi nhận.

Các bảng dữ liệu bật RLS. Người đăng nhập chỉ đọc dữ liệu riêng được cho phép; client không có quyền ghi bảng trực tiếp. Các RPC riêng kiểm tra `auth.uid()`, nội dung, giới hạn và quyền sở hữu; dùng search path cố định. `study_leaderboard` là RPC công khai, chỉ trả dữ liệu xếp hạng của người có phút học và dòng riêng khi có phiên đăng nhập. Không trả email, đáp án hay nội dung ghi chú.

Giới hạn: ghi chú 2.000 ký tự, biệt danh 32 ký tự, 25.000 bản ghi/tài khoản, 200 thao tác/request, phiên xếp hạng 1–300 phút (migration 002). Chỉ một phiên active/tài khoản. Phiên active quá 24 giờ được hủy trước khi mở phiên mới.

## Đăng nhập và biệt danh

Trang chính yêu cầu phiên đăng nhập Google đã được xác nhận và biệt danh hợp lệ trước khi ghi nhận đáp án hoặc bắt đầu bài thi. ID tài khoản lưu tại máy không thay thế việc xác nhận phiên; phiên Supabase anonymous không được dùng để vượt bước đăng nhập. Khi hồ sơ chưa tải được, giao diện cho thử lại thay vì xem tài khoản là khách hoặc ghi đè tên có sẵn.

Biệt danh sử dụng cột `study_profiles.nickname` và RPC `study_set_profile` hiện có, không cần migration mới. Tên mặc định trống/Người học/Anonymous yêu cầu chọn lại sau đăng nhập; tên riêng hợp lệ được giữ. Tên là biệt danh hiển thị (2–32 ký tự), không phải định danh đăng nhập duy nhất; dữ liệu tiếp tục gắn với UUID Google/Supabase. Giao diện dùng văn bản thuần, chuẩn hóa NFC, kiểm tra ký tự và không chèn tên qua HTML. Lưu tên chỉ cập nhật hồ sơ, không xóa lịch sử hoặc sửa phút Pomodoro. Local preview vẫn tách biệt khỏi database production; thử auth bằng fixture độc lập.

## Thời gian học tự động (migration 202610090001)

Chạy migration `202610090001_automatic_study_time.sql` sau 001/002 trước khi publish giao diện mới. Không đổi schema dữ liệu học đã lưu; phút Pomodoro cũ vẫn tính trong BXH. `study_focus_start` ngừng tạo countdown mới, RPC kết thúc cũ vẫn xử lý yêu cầu còn chờ.

- `study_activity_windows`: một lượt đang tính cho mỗi tài khoản, chủ tab/thiết bị và hạn hoạt động 15 phút.
- `study_activity_credit`: sổ thời gian do máy chủ đo, chia theo ngày Việt Nam và môn.
- `study_activity_clients`: số thứ tự yêu cầu từng trang, chặn retry/yêu cầu cũ mở lại lượt đã dừng.
- `study_activity_pulse`: xác nhận hoạt động (mỗi 30 giây), đổi chủ từ tương tác mới hơn, dừng và cộng phút mới vào `study_records` hiện có. Không nhận số phút từ client.
- `study_rank_daily`: view riêng kết hợp thời gian tự động đang chạy và Pomodoro cũ; chỉ RPC `study_leaderboard` xuất thông tin xếp hạng.

RLS bật cho các bảng mới, client không có quyền ghi trực tiếp. Pulse yêu cầu tài khoản không anonymous có biệt danh đã chọn. Khi kết nối đứt, máy chủ chỉ tính đến mốc hoạt động cuối +15 phút; không bù toàn bộ thời gian client tự khai. Chủ tài khoản truy xuất snapshot sẽ quyết toán phút còn chưa gửi, kể cả sau đóng trang. Phút cá nhân nhập thủ công vẫn không vào BXH.

Kiểm tra SQL bằng `npm test`; kiểm tra trình duyệt với backend loopback riêng `node scripts/fixtures/automatic_study_server.cjs` và Playwright CLI `run-code --filename scripts/browser_automatic_study_checks.js`. Dịch chuyển đồng hồ trong fixture chỉ dùng cho DB thử biệt lập, không thực hiện trên tài khoản thật.

## Lưu tại máy

Giữ nguyên các khóa/schema khách. Adapter chỉ chuyển các khóa dữ liệu học vào namespace `kma_cloud_v1:USER_ID:data:` khi có tài khoản, giữ phiên/outbox và version riêng. Mỗi thao tác có UUID độc lập và bất biến sau khi xếp hàng. Bản mới phát sinh trong lúc gửi được giữ để gửi tiếp. Không dùng cả snapshot của một môn để ghi đè database.

Ghi chú xung đột chặn các thao tác tiếp của chính ghi chú đó đến khi người dùng chọn bản hoặc gộp. Xóa dùng tombstone, nên dữ liệu cũ trên thiết bị khác không tự làm ghi chú quay lại. Nhập dữ liệu khách không đè bản đã có hoặc dấu xóa trên cloud.

Đăng xuất chỉ kết thúc phiên tại trình duyệt đó, không xóa database hoặc cache. Xóa dữ liệu trình duyệt trên máy dùng chung. Export/xóa toàn bộ tài khoản hiện cần chủ dự án thao tác trong dashboard; chưa có RPC xóa tài khoản ở giao diện.

## Kiểm tra

`npm ci && npm test` bao gồm kiểm tra chuẩn hóa/phép chiếu dữ liệu và chạy migration trên PostgreSQL WASM (PGlite) với hai tài khoản để kiểm tra phân quyền, idempotency, xung đột, timer, thời gian thực, ghi nhận phiên sớm và tham gia tự động. `scripts/browser_cloud_sync_checks.js` chạy trên một context thử độc lập, mock RPC, để kiểm tra hàng đợi khi đang gửi, mất kết nối, xung đột, nhiều tab và bảo toàn bài thi. Không dùng context Google thật cho script này.

Các script thử đồng bộ/Pomodoro thay riêng `cloud_config.js` bằng cấu hình fixture trỏ tới `fixture.invalid`, cùng SDK/RPC giả lập. Không thêm công tắc query để bật database production trên localhost. Nếu cần thử Google và database ngoài trang chính, tạo một Supabase project thử riêng cùng OAuth/redirect riêng. BXH chỉ hiển thị người do nguồn dữ liệu trả về, không tự chèn người mẫu để đủ top 10.

Migration cần được kiểm tra trên PostgreSQL/Supabase riêng với ít nhất hai users: anon không đọc bảng/RPC riêng; A không đọc/ghi dữ liệu B; retry không cộng đôi; sửa ghi chú lỗi version giữ hai bản; timer chỉ cộng phút thực tế máy chủ đo được; phút thủ công không vào bảng; tài khoản có phút tự động có hạng.

Kiểm tra tích hợp thực tế: đăng nhập cùng Google trên hai thiết bị hoặc hai context riêng của trang chính, sửa note/answer/star ở hai chiều, chạy đủ một phiên Pomodoro và đối chiếu bảng. Không thay đồng hồ browser để giả lập thời gian máy chủ.

Tài liệu chính thức: [Google Auth](https://supabase.com/docs/guides/auth/social-login/auth-google), [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), [Functions](https://supabase.com/docs/guides/database/functions), [API keys](https://supabase.com/docs/guides/getting-started/api-keys).
## Vườn và bộ sưu tập theo tài khoản

Migration `202610100001_study_garden.sql` chạy sau automatic study `202610090001_automatic_study_time.sql`. Áp dụng hai migration này trước khi publish frontend. Trang chính nạp vườn với cấu hình production; bản preview vẫn dùng database riêng. `study_gardens` lưu kho/cây/bố cục theo UUID, RLS chỉ cho chủ sở hữu đọc; không cấp quyền insert/update trực tiếp cho client. Sổ `study_garden_credit` chỉ được server ghi từ đồng hồ đã xác nhận, không nhận số phút từ client và không cộng lại giờ học trước khi bật vườn.

RPC `study_garden_snapshot`, `study_garden_plant`, `study_garden_harvest`, `study_garden_layout` xác thực tài khoản có tên, khóa giao dịch theo user, kiểm tra hạt/cây/số lượng và bố cục cũ. Thu hoạch kiểm tra dấu thời gian cây để yêu cầu cũ không thu một cây mới; RNG và bảo hiểm chạy trên server. `study_garden_public` chỉ công khai UUID, biệt danh, kho vật phẩm, bố cục, tổng giá trị. Tiến trình học, ghi chú, email, số hạt và lịch thưởng không có trong RPC này. BXH giữ nguyên bộ lọc và thứ tự phút, thêm `asset_value` suốt đời.

Lưu và đồng bộ garden tách khỏi schema ghi chú/tiến trình cũ. Client chỉ gửi hành động hoặc bố cục 15 ô; không có RPC upload state hay số dư. Trang chính nạp component garden; mô tả quyền riêng tư và thông báo cập nhật bao gồm bộ sưu tập công khai. Database preview ở loopback dùng tài khoản mô phỏng và dữ liệu trong bộ nhớ; tuyệt đối không đưa mẫu vào production. Kiểm tra bằng `node --test scripts/garden_database.test.cjs`.

## Lịch sử thời gian chỉ đọc

`202610100002_readonly_study_history.sql` chạy sau hai migration thời gian/vườn. RPC `study_sync` bỏ qua và xác nhận các thao tác phút học của client cũ để không chặn câu trả lời/ghi chú; helper cũ bị thu quyền gọi. Không thay đổi lịch sử có trước migration hay thao tác chỉnh lịch sử của quản trị viên. Frontend không nhập phút từ dữ liệu khách, không cho sửa/xóa cache giờ học, dùng snapshot máy chủ cho thống kê và chuỗi. Kiểm tra bằng `scripts/readonly_study_history.test.cjs`.
