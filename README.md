# Hệ thống ôn luyện và thi thử KMA

Ứng dụng HTML/CSS/JavaScript với luyện tập, thi thử, tra cứu kiến thức, mô phỏng và tải tài liệu PDF. Bốn môn hiện có:

| Môn | Số câu trong ngân hàng | Thời gian thi thử |
| --- | ---: | ---: |
| Kỹ thuật Vi xử lý | 984 | 60 phút |
| Tư tưởng Hồ Chí Minh | 885 | 40 phút |
| Vật lý đại cương | 142 | 45 phút |
| Xác suất thống kê | 139 | 60 phút |

Trang đã công bố: [GitHub Pages](https://taanhitaland-ai.github.io/KTVXL/). Nội dung ở đó chỉ thay đổi sau khi đưa bản sửa lên GitHub.

## Chạy trên máy

Mở `web/index.html` hoặc `docs/index.html` bằng Chrome/Edge. Dữ liệu câu hỏi và thư viện hiển thị công thức đều nằm trong dự án, nên không cần máy chủ hay CDN để luyện tập. Tiêu đề câu hỏi dùng Be Vietnam Pro được đóng gói tại máy, có đầy đủ dấu tiếng Việt. Dữ liệu hiển thị được chuẩn hóa NFC; các phông chữ Google còn lại là tùy chọn và có phông chữ dự phòng.

Để kiểm tra đường dẫn và tải PDF qua HTTP, chạy từ thư mục dự án với Python 3.10 trở lên:

```sh
python -m http.server 8765 --bind 127.0.0.1
```

Mở [bản nguồn](http://127.0.0.1:8765/web/index.html) hoặc [bản GitHub Pages cục bộ](http://127.0.0.1:8765/docs/index.html).

## Rà soát ngân hàng Vi xử lý Part 9–18

546 câu trong Part 9–18 (gồm hai bộ Part 9) đã được giải và rà soát lại; toàn bộ dùng 4 phương án, một đáp án đúng. 191 câu dạng điền đã chuyển sang chọn đáp án. 438 câu ngoài phạm vi này và cơ cấu 5 đề chính thức giữ nguyên. [Nhật ký từng câu và nguồn đối chiếu](data/reviews/README.md) ghi các sửa đổi, giả định và giới hạn; PDF cũ chưa cập nhật. Kiểm tra đáp án bằng `python scripts/verify_vixuly_review.py`.

## Cách chọn đề

- Đề có nguồn cụ thể giữ thứ tự câu hỏi và chỉ dùng nguồn đã chọn. Mỗi thẻ hiển thị số câu thực tế; nút bắt đầu ghi tên đề đang chọn.
- Vi xử lý có 5 đề chính thức, mỗi đề 35 trắc nghiệm và 5 điền kết quả. Đề ngẫu nhiên lấy cùng cơ cấu từ ngân hàng.
- Tư tưởng HCM lấy 40 câu đầu của Full A, mã 132 hoặc đề cương. Đề mẫu 651 giữ đủ 48 câu. Đề ngẫu nhiên lấy 40 câu theo các chương hiện có.
- Vật lý giữ 38/35/6/5 câu của bốn nguồn Notion. Ngân hàng bài tập lấy 40 câu đầu trong 58 câu; hai chuyên đề trộn tối đa 30 câu; đề tổng hợp trộn 40 câu.
- Xác suất thống kê có 5 bản trích đề giữa kỳ với 7/4/4/4/6 câu. Chuyên đề Xác suất trộn 40 câu chương 1–5; chuyên đề Thống kê dùng 32 câu hiện có ở chương 6–8. Đề tổng hợp trộn 40 câu.
- Đáp án điền kết quả trong bài thi tự ghi nhận khi nhập. Sau khi nộp hoặc hết giờ, bài làm được khóa; có thể xem lại lời giải hoặc chọn đề khác.

Lịch sử luyện tập và câu đánh dấu được lưu theo từng môn trên trình duyệt. Bài thi đang làm được cảnh báo khi thoát hoặc tải lại trang; bài thi chưa nộp không được khôi phục sau khi đóng trang.

## Ghi chú cá nhân và thông báo cập nhật

Ở **Luyện tập**, nhấn **✎** cạnh nút gắn sao của câu hỏi để viết ghi chú. Thẻ ghi chú nằm ngay dưới câu hỏi trên máy tính và điện thoại. Bấm vào thẻ hoặc nút bút để chuyển chính thẻ đó thành ô nhập; cột phải chỉ hiển thị phương pháp và mẹo nhớ. Chọn một trong sáu màu, nhấn **Lưu ghi chú** hoặc **Ctrl/⌘ + Enter**. Nội dung đã lưu hiện thành một thẻ màu dưới đáp án, thu gọn sau ba dòng với nút **Xem thêm**. Câu chưa có note chỉ hiện nút bút; màu giấy nhớ thay đổi theo giao diện sáng/tối. Thông báo **✓ Đã lưu** tự ẩn sau hai giây. Nút Lưu chỉ bật khi có thay đổi. Xóa yêu cầu xác nhận và có thể hoàn tác; thao tác **Làm lại từ đầu** chỉ xóa lịch sử trả lời, giữ ghi chú.

Ghi chú dùng nguyên schema theo môn và ID câu hỏi (`kma_question_notes_v1`). Khi chưa đăng nhập, dữ liệu chỉ lưu trong trình duyệt; khi đăng nhập Google, dữ liệu lưu theo tài khoản và tự đồng bộ với Supabase. Không tự khôi phục bản nháp chưa lưu sau khi đóng trang. Chỉ hiển thị văn bản thuần, giới hạn 2.000 ký tự; màu, ID và dữ liệu lưu được kiểm tra trước khi sử dụng. Khi không lưu được, ô nhập giữ nguyên nội dung và báo lỗi.

Nút chuông **Cập nhật** mở lịch sử tính năng mới và sửa lỗi. Trạng thái đã đọc lưu riêng trên trình duyệt. Để thêm một bản cập nhật, thêm mục mới vào đầu `web/site_updates_data.js` với `id` mới, ngày, tiêu đề và các danh sách `added` / `fixed`; giữ nguyên ID các bản cũ rồi chạy bước đồng bộ bên dưới.

## Đăng nhập, đồng bộ và bảng xếp hạng

**Đăng nhập → Tiếp tục với Google** dùng Supabase Auth (PKCE). Google xác thực danh tính; database Supabase lưu dữ liệu học. Cùng tài khoản ở điện thoại và máy tính sẽ nhận câu đã trả lời, dấu sao, ghi chú và lịch sử học sau khi đồng bộ. Bài thi đang làm, theme, nhạc và trạng thái đã đọc cập nhật không đồng bộ.

Trang chính yêu cầu đăng nhập trước khi chọn đáp án hoặc bắt đầu thi thử. Sau đăng nhập, tài khoản chưa có tên hoặc dùng tên mặc định **Người học/Anonymous** cần chọn biệt danh riêng (2–32 ký tự). Tên riêng hợp lệ đã có được giữ. Biệt danh không phải tên đăng nhập duy nhất; dữ liệu vẫn thuộc UUID tài khoản. Việc lưu tên dùng RPC/cột hồ sơ hiện có, không cần migration và không sửa dữ liệu tiến trình hay phút Pomodoro. Script `scripts/browser_account_access_checks.js` thử luồng khách → đăng nhập → chọn tên, tên cũ, lỗi lưu, đồng bộ chạy nền và bảo toàn dữ liệu trong context fixture độc lập.

Lần đầu đăng nhập, ứng dụng hỏi có mang dữ liệu khách vào tài khoản hay không. Chỉ nhập những bản ghi chưa có trên tài khoản, giữ bản khách tại máy và tôn trọng ghi chú đã xóa. Mỗi tài khoản có vùng nhớ đệm và hàng đợi riêng. Khi chưa gửi được, thay đổi được giữ tại máy để thử lại; trạng thái **Đã đồng bộ** xác nhận lượt trao đổi đã thành công. Hai bản sửa khác nhau của cùng ghi chú được giữ để người dùng chọn hoặc gộp, không tự ghi đè.

Thời gian học tự động bắt đầu từ thao tác thật trong luyện tập, thi thử đang chạy hoặc kiến thức (bấm, gõ, cuộn). Mở trang, đăng nhập và thao tác tổng hợp không tự bắt đầu. Sau 15 phút không tương tác thì dừng, thao tác tiếp tạo lượt mới. Đổi môn dừng lượt cũ và dùng môn của trang đang học. Rời phần học hoặc đóng trang gửi yêu cầu dừng; nếu mất yêu cầu, máy chủ vẫn giới hạn ở mốc không hoạt động 15 phút. Tải lại cần thao tác học mới.

Phút được đo trên máy chủ và hiện lên BXH trong lúc học, không cần đặt giờ/kết thúc phiên. Bảng lọc Hôm nay/Tuần này/Tháng này theo giờ Việt Nam; tuần bắt đầu thứ Hai. Phút thủ công chỉ vào lịch sử riêng. Cùng số phút có cùng hạng. Phút Pomodoro đã ghi nhận trước đây vẫn giữ nguyên. Bảng thật không chèn dữ liệu mẫu.

Nút ngọn lửa trên thanh trạng thái hiện số ngày của chuỗi học hiện tại, ẩn khi chưa có chuỗi. Bấm nút để mở riêng bản đồ nhiệt của tháng hiện tại. Mỗi môn có màu riêng; bấm ngày để xem số phút từng môn và giờ thi đã có trong lịch. Năm cấp chuỗi đạt ở 1, 2, 3, 5 và 7 ngày học liên tiếp. Ngày thi không tự tạo phút học hay tăng chuỗi.

Máy chủ chỉ giữ một cửa sổ tính giờ cho mỗi tài khoản: tương tác mới nhất có thể chuyển sang tab/thiết bị khác; heartbeat cũ không giành lại lượt hoặc cộng trùng. Mỗi 30 giây trình duyệt xác nhận hoạt động, không gọi riêng sau từng đáp án. Phút tự động được cộng vào schema nhật ký học hiện có và phân ngày theo Việt Nam. Thẻ đồng hồ chỉ hiện thời gian, môn và Đang học/Nghỉ ngơi; giải thích về mốc 15 phút và lỗi kết nối nằm trong tooltip trạng thái. Khi mất kết nối, chỉ khoảng thời gian máy chủ xác nhận trong giới hạn mới được tính. Cơ chế này không chứng minh mức độ chú ý và không phải hệ thống chống gian lận chuyên biệt.

Migration mới: `supabase/migrations/202610090001_automatic_study_time.sql`, chạy sau 001 và 002 trước khi publish frontend. Bản preview dùng PostgreSQL WASM riêng tại loopback, không kết nối database production. Fixture mặc định chạy cổng 8768. Khi kiểm tra bằng Playwright, đặt `$env:KMA_STUDY_FIXTURE_PORT='8769'` rồi chạy `node scripts/fixtures/automatic_study_server.cjs` trong PowerShell riêng; dùng CLI `run-code --filename scripts/browser_automatic_study_checks.js` hoặc `scripts/browser_study_stability_checks.js`. Database kiểm tra ở cổng 8769 không xóa dữ liệu bản preview ở cổng 8768. Các tài khoản mô phỏng có namespace riêng để tránh hai bản preview làm nhau tải lại trang; namespace tài khoản thật giữ nguyên.

Đăng nhập cần trang HTTP/HTTPS và URL được cho phép, không dùng `file://`. Chi tiết cấu hình, migration và kiểm tra phân quyền nằm trong [supabase/README.md](supabase/README.md). [Quyền riêng tư](https://taanhitaland-ai.github.io/KTVXL/privacy.html) mô tả dữ liệu lưu và phạm vi công khai.

## Preview vườn học tập

Vườn được nạp trên trang chính, dưới đồng hồ học; database production lưu theo tài khoản và bắt đầu với kho trống. `demo-study-garden.html` tại loopback dùng database thử riêng. Bản thử có sẵn cây, hạt và 9/10 vật phẩm để kiểm tra giao diện sáng/tối. Dữ liệu vườn lưu theo UUID tài khoản trong database thử riêng; trình duyệt chỉ giữ cache. Mở context mới với cùng tài khoản thử sẽ nhận lại kho và bố cục. Các nút mô phỏng nằm trong mục **Thử giao diện bằng dữ liệu mẫu**, chỉ thay đổi tài sản mẫu, không cộng phút hoặc sửa thứ tự BXH theo thời gian học. Không nhập dữ liệu mẫu/local vào database production.

Thời gian máy chủ xác nhận của cả bốn môn cùng nuôi cây. Mỗi 25 phút tích lũy nhận một hạt thường; trong một lượt học liên tục, mốc 60 phút nhận thêm một hạt hiếm và mốc 120 phút nhận thêm một hạt sử thi. Đổi môn giữ lượt thưởng, nghỉ từ 15 phút bắt đầu lượt mới. Cây chỉ lớn từ phần thời gian được xác nhận sau khi gieo, không lớn nhờ chờ ngoài bài học hoặc bấm thu hoạch. Ô thứ sáu mở khi chuỗi đạt 7 ngày và được giữ mở.

| Hạt | Phút học để cây chín | Rác / Thường / Hiếm / Sử thi / Huyền thoại |
| --- | ---: | --- |
| Sồi, Phong (Thường) | 60 / 120 | 45% / 35% / 16% / 3% / 1% |
| Anh đào, Tre (Hiếm) | 60 / 120 | 20% / 35% / 28% / 12% / 5% |
| Thiên hà (Sử thi) | 180 | 5% / 20% / 35% / 28% / 12% |

Bảo hiểm dùng chung cho các loại hạt: sau 9 lần liên tiếp không có Sử thi/Huyền thoại, lần thứ 10 chỉ rơi hai hạng này theo tỉ lệ tương đối của bảng hạt. Nhận một trong hai hạng sẽ đặt lại bảo hiểm. Tỉ lệ đang là thông số thử nghiệm. Bộ sưu tập có 10 vật phẩm gốc, hộp trưng bày 15 ô; kéo-thả trên máy tính hoặc chọn vật phẩm rồi chạm ô trên điện thoại. Bố cục chỉ lưu sau khi bấm **Lưu bố cục**. Modal được căn giữa viewport. Hồ sơ có hai tab **Tiến trình / Trưng bày**; tổng giá trị tính toàn bộ số lượng vật phẩm đang sở hữu (Rác 10, Thường 30, Hiếm 80, Sử thi 180, Huyền thoại 400), không phụ thuộc số vật phẩm đã bày. Điểm trưng bày chỉ tính các ô trong hộp. BXH vẫn xếp theo phút học và kèm tổng giá trị tài sản; bấm tên mở bộ sưu tập công khai chỉ đọc, không kèm email, câu trả lời hay ghi chú.

`scripts/generate_garden_art.py` tạo 36 SVG cây/hạt/khoáng gốc. `scripts/prepare_garden_preview.py` tạo HTML/fixture ngoài thư mục xuất bản, dùng fixture automatic-study đã có ở thư mục cha. Chạy máy chủ HTTP từ thư mục cha ở cổng 8767 và fixture với `$env:KMA_STUDY_FIXTURE_PORT='8771'; $env:KMA_GARDEN_FIXTURE='1'` để mở [bản thử vườn](http://127.0.0.1:8767/demo-study-garden.html?view=timer&theme=dark). Cổng 8771 dành cho vườn tương tác; kiểm tra trình duyệt của vườn dùng fixture riêng tại 8772 với cùng cờ garden để không đặt lại dữ liệu người đang thử. Database fixture nằm trong bộ nhớ, không tồn tại sau khi máy chủ thử bị đóng.

Migration `202610100001_study_garden.sql` (áp dụng production trước khi publish) lưu kho, gieo/thu hoạch, quay vật phẩm và thưởng từ đồng hồ trên máy chủ; client không gửi số dư hoặc thời gian để tăng tài sản. RLS chỉ cho đọc trạng thái riêng, không cho sửa trực tiếp; RPC public chỉ trả biệt danh, vật phẩm, bố cục và tổng giá trị. Gieo/thu hoạch dùng khóa theo tài khoản; lưu bố cục kiểm tra bản gốc để không ghi đè thay đổi trên thiết bị khác. Không thưởng ngược từ giờ học cũ hoặc lịch sử nhập tay. Bắt đầu vườn mới ở production là kho trống, không có cây/vật phẩm mẫu.

`scripts/garden_model.test.cjs` kiểm tra thưởng, tăng trưởng, bảo hiểm, dữ liệu đầu vào và bố cục; `scripts/garden_database.test.cjs` kiểm tra migration, quyền sở hữu, RPC công khai, giá trị tài sản và giao dịch trên PostgreSQL. `scripts/browser_garden_checks.js` kiểm tra các luồng với database fixture thật, bốn môn, chuột/cảm ứng và 320–390px; `scripts/browser_garden_profile_checks.js` kiểm tra hồ sơ, BXH, dữ liệu trên context mới và căn giữa. `scripts/browser_garden_stability_checks.js` kiểm tra hai tab cùng thu hoạch, không tải lại/vẽ lại khi chờ, cập nhật khi thanh bên đóng, không nhận thời gian giả từ client và tài khoản khách. Trang chính dùng `gardenEnabled` trên đúng HTTPS host production; bản loopback chỉ bật qua cờ preview và fixture riêng.

## Sơ đồ Vi xử lý

Trong **Vi xử lý → Kiến thức trọng tâm**, mỗi chương và sổ tay Casio có nút **Xem đồ thị**, dùng được cả khi nội dung chương đang thu gọn. Có 11 sơ đồ chức năng cho 6 chương và phụ lục:

- Chương 1: các khối trong CPU, hệ thống MPU/MCU và pipeline ARM7TDMI.
- Chương 2: phần cứng 89C51 và các đường truy cập ROM/RAM ngoài.
- Chương 3: nạp, giải mã, lấy toán hạng, thực thi và cập nhật PC/cờ.
- Chương 4: nguồn xung, điều kiện chạy, tràn/tự nạp lại Timer và cách tính TH/TL.
- Chương 5: hai đường phát/nhận UART, bộ đệm SBUF và nguồn baud.
- Chương 6: nguồn ngắt, IE/IP, vector, stack và RETI.
- Sổ tay Casio: đổi hệ, tính giá trị nạp và kiểm tra kết quả/cờ.

Chọn một khối để đọc chức năng và làm nổi các đường nối. **Nhận từ / Gửi đến** cho phép đi theo luồng sang khối khác; mục kiến thức liên quan mở nội dung gốc của chương. Dùng **+ / −**, cuộn/vuốt và **Toàn sơ đồ** để điều chỉnh góc nhìn. Các khối CPU nằm trong khung CPU; đường dữ liệu, địa chỉ và điều khiển dùng kiểu nét riêng. Đây là mô hình chức năng theo bài học; cách nối chân mạch thực tế cần đối chiếu datasheet của linh kiện đang dùng.

[Mở ví dụ CPU và ALU tại máy](http://127.0.0.1:8765/web/index.html?diagram=chap1&view=cpu&node=alu). Các model và tham chiếu kiến thức nằm trong `web/chapter_diagram_data.js`; thêm hay sửa model phải chạy kiểm tra để giữ đường nối hợp lệ và đủ tham chiếu nội dung chương.

Nút **Toàn màn hình** mở sơ đồ trên toàn bộ vùng xem, dùng Fullscreen API khi trình duyệt hỗ trợ; nếu không, giao diện vẫn mở rộng trong trang. Bấm **Thu nhỏ** để trở lại; Escape thoát chế độ mở rộng trước rồi mới đóng sơ đồ. Trong chế độ này, một ngón hoặc chuột kéo sơ đồ, hai ngón chụm để phóng to/thu nhỏ. **Toàn sơ đồ** thu gọn bảng kiến thức và đưa tất cả các khối vào khung nhìn.

Bấm một khối mới mở kiến thức: bảng bên phải trên máy tính, bảng từ đáy lên trên điện thoại. **Mở rộng / Thu nhỏ** hoặc kéo tay cầm thay đổi chiều cao bảng trên điện thoại; **Thu gọn** trả lại diện tích sơ đồ và giữ khối đang chọn. Nút hình quyển sách mở lại kiến thức; **Cả chương** trở về nội dung tổng quan. Các điều khiển và kiến thức giữ màu của chương.

[Demo mở rộng chương 2](http://127.0.0.1:8765/web/index.html?diagram=chap2&fullscreen=1). Tham số `fullscreen=1` mở sẵn giao diện mở rộng; fullscreen của hệ điều hành cần thao tác bấm của người dùng.

Sơ đồ Timer minh họa 89C51 cổ điển 12T; sơ đồ UART minh họa cấu hình Mode 1 dùng Timer 1 Mode 2. Cách dùng Timer 1 và thời điểm đặt TI được đối chiếu với [8051 Hardware Manual](https://ww1.microchip.com/downloads/aemDocuments/documents/OTH/ProductDocuments/UserGuides/doc4316.pdf) và [ví dụ UART của Keil](https://www.keil.com/support/docs/685.htm).

## Sơ đồ ba môn còn lại

Mỗi chương trong **Tư tưởng Hồ Chí Minh**, **Vật lý đại cương** và **Xác suất thống kê** cũng có nút **Xem đồ thị**. Có 26 sơ đồ bổ sung cho 20 chương, dùng chung thao tác chọn thành phần, làm nổi mũi tên, đi theo liên kết, xem kiến thức gốc và phóng to.

- Tư tưởng Hồ Chí Minh: 7 sơ đồ cho 6 chương, gồm quan hệ lý luận–thực tiễn, các cơ sở hình thành và năm thời kỳ lịch sử, độc lập–CNXH, Đảng–Nhà nước–nhân dân, đoàn kết, văn hóa–đạo đức–con người.
- Vật lý: 10 sơ đồ cho 6 chương. Chương quang học sóng tách thành giao thoa, Fresnel, khe/cách tử và phân cực; quang học lượng tử tách bức xạ nhiệt và tương tác photon. Các chương còn lại liên kết đại lượng và điều kiện của mô hình.
- Xác suất thống kê: 9 sơ đồ cho 8 chương. Phân biệt xác suất có điều kiện/Bayes và Bernoulli; liên kết phân phối, đặc trưng, lấy mẫu, ước lượng và kiểm định. Mũi tên biểu thị dữ liệu, phương pháp hoặc điều kiện áp dụng.

Màu sơ đồ lấy từ thẻ chương. Chú giải và phần giải thích thay đổi theo môn, còn sơ đồ CPU giữ nguyên. `web/subject_diagram_data.js` chứa các quan hệ mới; `web/diagram_knowledge.js` chuyển chương dạng công thức thành các mục đọc trong sơ đồ mà không sửa cấu trúc nguồn. Mỗi môn có không gian ID riêng để chương `chap1` của XSTK không trùng với Vi xử lý.

Nút **Đọc kiến thức** có nền theo màu chương, biểu tượng sách và số mục. Mũi tên caret hướng sang phải khi đóng, xoay xuống khi mở; vòng bao chuyển từ viền sáng sang đen. Nội dung đọc nằm trong khung riêng, chia theo tiêu đề nguồn và có đường phân cách giữa các đoạn. Trên điện thoại, mở kiến thức sẽ tăng diện tích phần đọc; công thức dài có thể cuộn ngang trong mục. Nút dùng được bằng Enter/Space và tôn trọng thiết lập giảm chuyển động của thiết bị.

Ví dụ: [Nhà nước và nhân dân](http://127.0.0.1:8765/web/index.html?subject=tthcm&diagram=tthcm_chap4&view=party-state&node=people), [phân cực ánh sáng](http://127.0.0.1:8765/web/index.html?subject=vldc&diagram=2&view=polarization&node=intensity), [Bayes](http://127.0.0.1:8765/web/index.html?subject=xstk&diagram=chap2&view=bayes&node=posterior). Bỏ `subject` trong liên kết cũ vẫn mở Vi xử lý.

Nội dung mới gắn với kiến thức chương sẵn có. Quan hệ năng lượng LC và phân cực được đối chiếu với [OpenStax về LC](https://openstax.org/books/university-physics-volume-2/pages/14-5-oscillations-in-an-lc-circuit) và [phân cực](https://openstax.org/books/university-physics-volume-3/pages/1-7-polarization). Giải thích khoảng tin cậy, kiểm định và các giả định được đối chiếu với [NIST về trung bình](https://www.itl.nist.gov/div898/handbook/eda/section3/eda352.htm), [phương sai](https://www.itl.nist.gov/div898/handbook/eda/section3/eda358.htm) và [hai mẫu](https://www.itl.nist.gov/div898/handbook/eda/section3/eda353.htm). Các mô tả XSTK liên quan đã được sửa để không coi “chưa bác bỏ H₀” là chứng minh H₀ đúng và để nêu điều kiện của phân phối chuẩn/t.

## Cấu trúc và cập nhật

- `web/`: giao diện nguồn, dữ liệu trình duyệt, 6 mô phỏng Vật lý và 4 mô phỏng Xác suất thống kê.
- `docs/`: bản triển khai GitHub Pages, đồng bộ byte với `web/`.
- `data/`: dữ liệu câu hỏi chuẩn trong `*_questions_db.json`, cùng dữ liệu kiến thức Vật lý.
- `web/exam_config.js`: tên môn, thời gian, danh sách đề và quy tắc chọn câu dùng chung cho ứng dụng và kiểm thử.
- `scripts/`: công cụ nhập dữ liệu, chuẩn hóa, đồng bộ và kiểm tra.
- `web/vendor/katex/`: KaTeX 0.16.9 và giấy phép của thư viện.
- `XSTK/`, các thư mục tài liệu và PDF: tài liệu đã biên soạn. Các PDF có quy trình sinh riêng; sửa ngân hàng web không tự cập nhật nội dung PDF.

Sau khi sửa giao diện hoặc dữ liệu trong `web/`, đồng bộ bản triển khai:

```sh
python scripts/sync_site.py
```

Lệnh đồng bộ cập nhật mã phiên bản cho các tệp CSS/JavaScript theo nội dung, giúp trình duyệt tải bản vừa sửa. Mã này ổn định giữa xuống dòng LF và CRLF. Chế độ `--check` chỉ đọc và báo lỗi nếu mã phiên bản hoặc bản `docs/` đã cũ.

Các bộ nhập dữ liệu TTHCM, VLDC và XSTK đã gọi bước chuẩn hóa để giữ mã câu hỏi riêng biệt, định dạng công thức và nhãn chương thống nhất. Với dữ liệu hiện có, có thể chạy lại:

```sh
python scripts/normalize_data.py
python scripts/normalize_statistics.py
python scripts/sync_site.py
```

Không dùng thứ tự mã câu hỏi để suy ra chương: mã cũ được giữ để lịch sử học tập tiếp tục hoạt động; hãy đọc `chapter_id`.

## Kiểm tra

Cần Node.js 22 trở lên và Python 3.10 trở lên. PGlite là phụ thuộc chỉ dành cho kiểm thử, để kiểm tra migration PostgreSQL và RLS:

```sh
npm ci
npm test
python scripts/sync_site.py --check
python scripts/audit_site_content.py
```

Các kiểm tra xác nhận mã câu hỏi, khóa đáp án, nguồn/thứ tự/số câu của từng đề, cú pháp công thức, đường dẫn tài nguyên, mã phần tử giao diện và đồng bộ `web/`–`docs/`. GitHub Actions chạy các bước này trên push/PR. Kiểm tra cấu trúc và cú pháp không thay thế việc đối chiếu tính đúng đắn học thuật với đề gốc.

Kiểm tra thao tác trên trình duyệt bằng Playwright CLI đã cài và máy chủ cục bộ đang chạy. Dùng một phiên mới cho mỗi lần chạy bộ kiểm tra chính:

```sh
playwright-cli -s=kma-review open http://127.0.0.1:8765/web/index.html
playwright-cli -s=kma-review run-code --filename scripts/browser_checks.js
playwright-cli -s=kma-review eval "window.__KMA_BROWSER_REPORT"
playwright-cli -s=kma-review run-code --filename scripts/browser_extra_checks.js
playwright-cli -s=kma-review eval "window.__KMA_EXTRA_REPORT"
```

Bộ kiểm tra sơ đồ dùng phiên riêng:

```sh
playwright-cli -s=kma-diagram open http://127.0.0.1:8765/web/index.html
playwright-cli -s=kma-diagram run-code --filename scripts/browser_diagram_checks.js
playwright-cli -s=kma-diagram eval "window.__KMA_DIAGRAM_REPORT"
```

Báo cáo hoàn tất khi `complete: true`. Bộ này kiểm tra 11 sơ đồ Vi xử lý, điều khiển bằng bàn phím, phóng to, chuyển môn, màn hình điện thoại dọc/ngang, bản Pages và luồng thi thử hiện có. Các kiểm tra Node còn xác nhận hướng liên kết quan trọng, tham chiếu kiến thức và đường nối tránh các khối.

Bộ kiểm tra ba môn bổ sung:

```sh
playwright-cli -s=kma-diagram run-code --filename scripts/browser_subject_diagram_checks.js
playwright-cli -s=kma-diagram eval "window.__KMA_SUBJECT_DIAGRAM_REPORT"
```

Bộ này kiểm tra mọi thành phần và mũi tên trong 26 sơ đồ, nguồn kiến thức, công thức KaTeX, màu chương, điện thoại 320/390 px và màn hình ngang, liên kết trực tiếp trên `web/` và `docs/`, cùng việc giữ các liên kết CPU cũ.

Kiểm tra chế độ toàn màn hình dùng Chromium:

```powershell
playwright-cli -s=kma-fullscreen open http://127.0.0.1:8765/web/index.html
playwright-cli -s=kma-fullscreen run-code --filename scripts/browser_fullscreen_checks.js
```

Bộ này kiểm tra fullscreen thật và trường hợp API không khả dụng, thoát bằng Escape, bảng kiến thức theo thiết bị, thao tác kéo/chụm hai ngón, chọn liên kết không bị bảng che, đọc tới đoạn cuối, ba kích thước điện thoại, cả bốn môn và bản `docs/`. Kết quả đạt khi `complete: true`.

Kết quả chỉ hoàn tất khi báo cáo có `complete: true`. CLI có thể trả lại trạng thái hộp thoại trước khi bộ kiểm tra chạy xong; chờ báo cáo cuối, không chạy bước kế tiếp khi bước chính còn hoạt động. Bộ chính kiểm tra 27 lựa chọn đề, nhập/xóa đáp án, điểm, khóa bài, thoát/chuyển môn và tự nộp khi hết giờ. Bộ bổ sung kiểm tra lưu tiến độ, đánh dấu, kiến thức, PDF, mô phỏng, dữ liệu lưu hỏng và màn hình 390px. Ảnh kiểm tra nằm trong `output/playwright/`, không ghi đè tài nguyên triển khai.

Các kiểm tra Python/Node cũ vẫn có trong `scripts/` để tham khảo và cần Playwright tương ứng. Bộ CLI và các lệnh kiểm tra cơ bản ở trên là luồng kiểm tra hiện tại.

`scripts/browser_cloud_sync_checks.js` kiểm tra đồng bộ bằng tài khoản giả và xác nhận phản hồi không dựng lại câu hỏi vừa trả lời. `scripts/browser_focus_reliability_checks.js` dùng fixture riêng để kiểm tra phiên 60 phút, tải lại, kết thúc sớm, mất phản hồi khi bắt đầu/hoàn tất, bộ lọc BXH và điện thoại; chạy bằng `run-code --filename` trên máy chủ 8765. Cả hai tạo context độc lập, không đăng nhập Google hay ghi database thật.

## Highlight tài liệu

Tô màu tài liệu: bôi chọn từ 2 ký tự trong Luyện tập tự do (đề bài, đáp án, lời giải, phương pháp/mẹo) hoặc Kiến thức trọng tâm; sau 300ms hiện cây cọ nổi, bấm chỉ mở 6 màu giấy nhớ, không tự tô hoặc chọn sẵn màu vàng khi chưa có màu gần nhất. Phím `1–6` chọn màu, `Enter` dùng màu gần nhất (chưa chọn màu lần nào thì mở bảng), `Esc` đóng. Tô xong đóng dải và giữ vùng chọn; màu gần nhất lưu riêng ở `kma_text_highlights_color_v1`. Bấm đoạn đã tô để đổi màu hoặc xóa, màu đang dùng có vòng viền; đoạn tô là giấy nhớ bo mềm không viền, padding theo cỡ chữ, nét nhấn inset 3px và box-decoration-break clone. Khung cây cọ 46px chứa nút 36px; dải nở đối xứng bằng max-width đo từ scrollWidth trong 320ms, các màu xuất hiện lần lượt từ 120ms, cách nhau 40ms; mũi nhọn nằm ngoài khung; khi đóng bỏ delay và thu lại trong 180ms. Light mode dùng nền pastel, dark mode nền trong suốt 38–45% và giữ màu chữ gốc. Trên cảm ứng cây cọ nằm lệch dưới vùng chọn; reduced-motion bỏ hiệu ứng nở và xuất hiện lần lượt. Dữ liệu highlight giữ nguyên khóa/định dạng `kma_text_highlights_v1`, lưu riêng trên trình duyệt; không đổi các khóa ghi chú/tiến trình và chưa đồng bộ tài khoản. Anchor lưu chữ/ngữ cảnh, nội dung thay đổi hoặc mơ hồ không tô nhầm sang đoạn khác. Dữ liệu không diễn giải thành HTML; ID, màu và giới hạn được kiểm tra khi đọc. `scripts/browser_highlight_checks.js` kiểm tra các luồng trong context riêng, không ghi database thật.

## Đóng góp

Tạo nhánh riêng, sửa dữ liệu hoặc giao diện, đồng bộ `docs/` và chạy các kiểm tra trước khi tạo Pull Request. Khi sửa đáp án học thuật, ghi rõ nguồn đối chiếu; không thay khóa đáp án chỉ để khớp lời giải sinh tự động. Dự án phục vụ học tập cộng đồng.
