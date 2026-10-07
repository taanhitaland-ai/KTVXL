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

Mở `web/index.html` hoặc `docs/index.html` bằng Chrome/Edge. Dữ liệu câu hỏi và thư viện hiển thị công thức đều nằm trong dự án, nên không cần máy chủ hay CDN để luyện tập. Phông chữ Google là tùy chọn, có phông chữ dự phòng.

Để kiểm tra đường dẫn và tải PDF qua HTTP, chạy từ thư mục dự án với Python 3.10 trở lên:

```sh
python -m http.server 8765 --bind 127.0.0.1
```

Mở [bản nguồn](http://127.0.0.1:8765/web/index.html) hoặc [bản GitHub Pages cục bộ](http://127.0.0.1:8765/docs/index.html).

## Cách chọn đề

- Đề có nguồn cụ thể giữ thứ tự câu hỏi và chỉ dùng nguồn đã chọn. Mỗi thẻ hiển thị số câu thực tế; nút bắt đầu ghi tên đề đang chọn.
- Vi xử lý có 5 đề chính thức, mỗi đề 35 trắc nghiệm và 5 điền kết quả. Đề ngẫu nhiên lấy cùng cơ cấu từ ngân hàng.
- Tư tưởng HCM lấy 40 câu đầu của Full A, mã 132 hoặc đề cương. Đề mẫu 651 giữ đủ 48 câu. Đề ngẫu nhiên lấy 40 câu theo các chương hiện có.
- Vật lý giữ 38/35/6/5 câu của bốn nguồn Notion. Ngân hàng bài tập lấy 40 câu đầu trong 58 câu; hai chuyên đề trộn tối đa 30 câu; đề tổng hợp trộn 40 câu.
- Xác suất thống kê có 5 bản trích đề giữa kỳ với 7/4/4/4/6 câu. Chuyên đề Xác suất trộn 40 câu chương 1–5; chuyên đề Thống kê dùng 32 câu hiện có ở chương 6–8. Đề tổng hợp trộn 40 câu.
- Đáp án điền kết quả trong bài thi tự ghi nhận khi nhập. Sau khi nộp hoặc hết giờ, bài làm được khóa; có thể xem lại lời giải hoặc chọn đề khác.

Lịch sử luyện tập và câu đánh dấu được lưu theo từng môn trên trình duyệt. Bài thi đang làm được cảnh báo khi thoát hoặc tải lại trang; bài thi chưa nộp không được khôi phục sau khi đóng trang.

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

Cần Node.js 22 trở lên và Python 3.10 trở lên. Bộ kiểm tra cơ bản không cần cài gói npm:

```sh
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

Kết quả chỉ hoàn tất khi báo cáo có `complete: true`. CLI có thể trả lại trạng thái hộp thoại trước khi bộ kiểm tra chạy xong; chờ báo cáo cuối, không chạy bước kế tiếp khi bước chính còn hoạt động. Bộ chính kiểm tra 27 lựa chọn đề, nhập/xóa đáp án, điểm, khóa bài, thoát/chuyển môn và tự nộp khi hết giờ. Bộ bổ sung kiểm tra lưu tiến độ, đánh dấu, kiến thức, PDF, mô phỏng, dữ liệu lưu hỏng và màn hình 390px. Ảnh kiểm tra nằm trong `output/playwright/`, không ghi đè tài nguyên triển khai.

Các kiểm tra Python/Node cũ vẫn có trong `scripts/` để tham khảo và cần Playwright tương ứng. Bộ CLI và các lệnh kiểm tra cơ bản ở trên là luồng kiểm tra hiện tại.

## Đóng góp

Tạo nhánh riêng, sửa dữ liệu hoặc giao diện, đồng bộ `docs/` và chạy các kiểm tra trước khi tạo Pull Request. Khi sửa đáp án học thuật, ghi rõ nguồn đối chiếu; không thay khóa đáp án chỉ để khớp lời giải sinh tự động. Dự án phục vụ học tập cộng đồng.
