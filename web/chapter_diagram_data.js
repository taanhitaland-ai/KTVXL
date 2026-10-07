// Curated functional models. `refs` point into the chapter's existing knowledge.
(function (root, factory) {
  const data = factory();
  if (typeof module === 'object' && module.exports) module.exports = data;
  else root.KMA_DIAGRAM_DATA = data;
})(typeof window === 'undefined' ? globalThis : window, function () {
  const n = (id, label, subtitle, x, y, refs, text, extra = {}) => ({
    id, label, subtitle, x, y, width:220, height:76, refs:refs || [], text:[text], ...extra
  });
  const e = (from, to, label, type = 'data', extra = {}) => ({from, to, label, type, ...extra});
  const g = (label, x, y, width, height) => ({label,x,y,width,height});
  const v = (id,title,description,width,height,groups,nodes,edges,extra={}) => ({id,title,description,width,height,groups,nodes,edges,...extra});
  return {
    chap1: { views:[
      v('cpu','Bên trong CPU','Theo dõi một vòng nạp lệnh, giải mã và thực thi. Mũi tên chỉ hướng truyền; nét đứt là tín hiệu điều khiển.',1040,740,
        [g('CPU • BỘ XỬ LÝ TRUNG TÂM',90,150,850,530)], [
          n('program','Bộ nhớ chương trình','ROM / Flash',60,30,[[1,2],[2,0]],'Chứa mã máy của chương trình. CPU đưa địa chỉ lên bus địa chỉ để đọc mã lệnh từ bộ nhớ này.',{width:260}),
          n('clock','Clock','Xung nhịp',650,30,[[1,1]],'Tạo nhịp phối hợp các bước nạp, giải mã và thực thi trong CPU.',{width:260}),
          n('ir','IR','Thanh ghi lệnh',230,195,[[1,1],[1,2]],'Giữ mã lệnh vừa được nạp. Khối điều khiển đọc mã này để xác định thao tác cần thực hiện.',{width:260}),
          n('cu','CU','Đơn vị điều khiển',230,325,[[0,0],[1,1]],'Giải mã lệnh và phát tín hiệu điều khiển ALU, thanh ghi và bộ đếm chương trình. CU phối hợp các khối để thực hiện đúng lệnh.',{width:260}),
          n('alu','ALU','Số học & logic',120,460,[[0,0],[1,1]],'Thực hiện cộng, trừ, AND, OR, so sánh và các phép xử lý dữ liệu. ALU nhận toán hạng từ thanh ghi và trả kết quả về thanh ghi.',{width:250}),
          n('pc','PC','Bộ đếm chương trình',660,460,[[1,1]],'Giữ địa chỉ dùng để lấy lệnh tiếp theo. PC được cập nhật khi đi tuần tự hoặc khi thực hiện lệnh rẽ nhánh.',{width:250}),
          n('registers','Thanh ghi dữ liệu','Toán hạng & kết quả',270,585,[[0,0],[1,1]],'Giữ toán hạng và kết quả tạm thời ngay trong CPU. Đường đi hai chiều giữa thanh ghi và ALU giúp CPU xử lý rồi lưu kết quả.',{width:280})
        ],[
          e('program','ir','Mã lệnh','data',{fromPort:'bottom',toPort:'top'}), e('ir','cu','Lệnh cần giải mã'),
          e('clock','cu','Đồng bộ','control',{fromPort:'bottom',toPort:'right'}),
          e('cu','alu','Điều khiển xử lý','control',{fromPort:'left',toPort:'top'}),
          e('cu','pc','Cập nhật PC','control',{fromPort:'right',toPort:'top'}),
          e('cu','registers','Đọc / ghi','control',{fromPort:'bottom',toPort:'right'}),
          e('registers','alu','Đưa toán hạng','data',{fromPort:['top',.25],toPort:['bottom',.25]}),
          e('alu','registers','Trả kết quả','data',{fromPort:['bottom',.75],toPort:['top',.75]}),
          e('pc','program','Địa chỉ lệnh','address',{fromPort:'right',toPort:'left',via:[[980,498],[980,700],[25,700],[25,68]]})
        ]),
      v('system','MPU, MCU & bộ nhớ','MPU ghép với bộ nhớ và I/O bên ngoài; MCU tích hợp các khối này trên cùng chip. Bus nối CPU với các khối.',1120,720,
        [g('HỆ THỐNG DÙNG MPU',30,35,490,625),g('MCU • CÁC KHỐI TRÊN CÙNG CHIP',560,35,520,625)], [
          n('mpu','MPU','CPU trên một chip',160,95,[[0,0],[0,2]],'MPU chứa khối xử lý. Hệ thống cần ghép thêm bộ nhớ và ngoại vi để hoạt động.'),
          n('mpubus','Bus hệ thống','Địa chỉ • Dữ liệu • Điều khiển',160,245,[[1,0]],'Bus địa chỉ chọn ô nhớ; bus dữ liệu truyền nội dung; bus điều khiển phối hợp việc đọc và ghi.'),
          n('mpurom','ROM / Flash ngoài','Lưu chương trình',65,415,[[2,0]],'Lưu chương trình và giữ nội dung khi mất điện. ROM, PROM, EPROM, EEPROM và Flash khác nhau ở cách lập trình hoặc xóa.',{width:190}),
          n('mpuram','RAM ngoài','SRAM / DRAM',290,415,[[2,1]],'Giữ dữ liệu tạm và mất nội dung khi mất điện. SRAM không cần làm tươi; DRAM cần làm tươi định kỳ.',{width:190}),
          n('mpuio','I/O ngoài','Ghép ngoại vi',160,555,[[0,2]],'Kết nối hệ thống dùng MPU với thiết bị vào và ra.'),
          n('mcucpu','CPU của MCU','Xử lý & điều khiển',700,95,[[0,1],[0,2]],'MCU kết hợp CPU, bộ nhớ và ngoại vi trong một chip, phù hợp với các hệ thống điều khiển nhúng.'),
          n('mcubus','Bus nội','Kết nối trên chip',700,245,[[1,0]],'Liên kết CPU với bộ nhớ và các khối ngoại vi tích hợp.'),
          n('mcurom','ROM / Flash','Bộ nhớ chương trình',595,415,[[2,0]],'Chứa chương trình của MCU.',{width:200}),
          n('mcuram','RAM','Bộ nhớ dữ liệu',845,415,[[2,1]],'Giữ biến, bộ đệm và dữ liệu tạm khi chương trình đang chạy.',{width:200}),
          n('mcuio','I/O • Timer • UART','Ngoại vi tích hợp',700,555,[[0,1]],'Các khối vào/ra, định thời và truyền thông trao đổi dữ liệu với CPU qua bus nội.')
        ],[
          e('mpu','mpubus','Truy cập bus'),e('mpubus','mpurom','Đọc lệnh'),e('mpubus','mpuram','Đọc / ghi'),e('mpubus','mpuio','Trao đổi I/O'),
          e('mcucpu','mcubus','Truy cập bus'),e('mcubus','mcurom','Đọc lệnh'),e('mcubus','mcuram','Đọc / ghi'),e('mcubus','mcuio','Điều khiển ngoại vi')
        ],{independentNetworks:2}),
      v('arm','ARM7TDMI & pipeline','Ba tầng Fetch → Decode → Execute xử lý gối đầu các lệnh. ARM và Thumb dùng chung lõi xử lý.',1060,660,
        [g('LÕI ARM7TDMI • PIPELINE 3 TẦNG',50,210,960,220)], [
          n('code','Bộ nhớ chương trình','Mã lệnh',80,60,[[1,2]],'Cung cấp mã lệnh tại địa chỉ do PC chỉ ra.'),
          n('pc','PC / R15','Địa chỉ lệnh',740,60,[[3,1]],'Chỉ địa chỉ lệnh trong luồng thực thi. Rẽ nhánh làm thay đổi địa chỉ nạp lệnh.'),
          n('fetch','Fetch','Nạp lệnh',90,290,[[3,1]],'Tầng đầu lấy mã lệnh từ bộ nhớ chương trình.'),
          n('decode','Decode','Giải mã',420,290,[[3,0],[3,1]],'Tầng giải mã nhận diện lệnh và chuẩn bị các toán hạng cần dùng.'),
          n('execute','Execute','Thực thi',750,290,[[3,0],[3,1]],'Tầng thực thi thực hiện phép tính, truy cập dữ liệu hoặc rẽ nhánh theo lệnh.'),
          n('state','ARM / Thumb','Lệnh 32 bit / 16 bit',250,525,[[3,2]],'Trạng thái ARM dùng lệnh 32 bit; Thumb dùng lệnh 16 bit để tăng mật độ mã. Đây là độ dài lệnh, không phải hai CPU khác nhau.'),
          n('status','CPSR / SPSR','Cờ & trạng thái',640,525,[[3,3]],'CPSR giữ cờ điều kiện và trạng thái xử lý. SPSR dùng để giữ trạng thái cũ trong các chế độ ngoại lệ có SPSR.')
        ],[
          e('pc','code','Địa chỉ','address',{fromPort:'left',toPort:'right'}),e('code','fetch','Mã lệnh'),e('fetch','decode','Lệnh đã nạp'),e('decode','execute','Thao tác & toán hạng'),
          e('state','decode','Chọn tập lệnh','control'),e('execute','status','Cập nhật trạng thái'),e('status','execute','Kiểm tra điều kiện','control',{fromPort:'right',toPort:'right'}),
          e('execute','pc','Rẽ nhánh / tuần tự','control',{fromPort:'top',toPort:'bottom'})
        ])
    ]},
    chap2:{views:[
      v('chip','Các khối trong 89C51','CPU giao tiếp với bộ nhớ và ngoại vi nội qua bus. Các chân cổng đưa tín hiệu ra ngoài chip.',1080,760,
        [g('89C51 • VI ĐIỀU KHIỂN',45,160,990,560)], [
          n('clock','XTAL & Reset','Clock • RST',80,40,[[0,0],[0,1]],'Dao động tạo xung nhịp; reset đưa bộ điều khiển về trạng thái khởi đầu. 89C51 cổ điển dùng chu kỳ máy 12 xung dao động.'),
          n('cpu','CPU 8051','ALU • CU • Thanh ghi',420,225,[[0,0]],'Lõi CPU nạp lệnh từ Flash, xử lý dữ liệu và truy cập các thanh ghi điều khiển ngoại vi.'),
          n('flash','Flash nội 4 KB','Chương trình',75,385,[[0,1]],'Chứa chương trình nội. Mức tại chân EA quyết định cách sử dụng bộ nhớ chương trình nội và ngoài.'),
          n('ram','RAM nội 128 byte','00H–7FH',430,385,[[1,0],[1,1],[1,2]],'RAM gồm vùng các bank R0–R7, vùng định địa chỉ bit và vùng đa dụng/ngăn xếp. SP quản lý vị trí ngăn xếp.'),
          n('sfr','SFR • PSW • SP • DPTR','Thanh ghi chức năng',780,385,[[2,0],[2,1],[2,2],[2,3]],'CPU truy cập SFR để đọc trạng thái và cấu hình phần cứng. PSW chứa cờ kết quả và bit chọn bank thanh ghi.'),
          n('ports','Cổng P0–P3','32 đường I/O',170,600,[[0,2]],'Các cổng kết nối chân I/O. P0 cần trở kéo lên khi dùng làm I/O thông thường; P0/P2 còn tham gia bus bộ nhớ ngoài.'),
          n('peripheral','Timer • UART • Ngắt','Ngoại vi nội',650,600,[[0,2]],'Ngoại vi được cấu hình qua SFR; Timer, UART và ngắt ngoài dùng các chức năng phụ ở P3.')
        ],[
          e('clock','cpu','Nhịp / khởi tạo','control'),e('flash','cpu','Mã lệnh'),e('cpu','ram','Dữ liệu / stack'),e('cpu','sfr','Đọc / ghi thanh ghi'),
          e('sfr','ports','Cấu hình I/O','control'),e('sfr','peripheral','Cấu hình ngoại vi','control'),e('ports','peripheral','Chức năng phụ P3'),e('peripheral','cpu','Yêu cầu ngắt','control',{fromPort:'right',toPort:'right'})
        ]),
      v('external','Mở rộng ROM / RAM ngoài','P0 ghép địa chỉ thấp và dữ liệu; ALE chốt địa chỉ. P2 và mạch giải mã chọn dải nhớ.',1120,840,
        [g('TÍN HIỆU TỪ 89C51',30,30,320,790),g('BUS & BỘ NHỚ NGOÀI',390,30,690,770)], [
          n('p0','P0 / AD0–AD7','Địa chỉ thấp & dữ liệu',75,95,[[0,2],[3,0]],'P0 dùng chung đường chân cho byte địa chỉ thấp và dữ liệu khi truy cập bộ nhớ ngoài.'),
          n('ale','ALE','Xung chốt địa chỉ',75,255,[[0,1]],'ALE điều khiển latch để giữ byte địa chỉ thấp khi P0 chuyển sang truyền dữ liệu.'),
          n('p2','P2 / A8–A15','Địa chỉ cao',75,420,[[0,2],[3,0]],'P2 phát byte địa chỉ cao trong truy cập bộ nhớ ngoài dùng địa chỉ 16 bit.'),
          n('control','PSEN • RD • WR','Điều khiển đọc / ghi',75,590,[[0,1],[0,2]],'PSEN cho phép đọc bộ nhớ chương trình ngoài. RD và WR điều khiển đọc/ghi bộ nhớ dữ liệu ngoài.'),
          n('latch','74LS373','Giữ A0–A7',435,180,[[0,1]],'Latch tách địa chỉ thấp ra khỏi bus AD0–AD7, giúp bộ nhớ nhận địa chỉ ổn định.'),
          n('decode','Giải mã / 74LS138','Tạo tín hiệu chọn chip',435,440,[[3,1],[3,2]],'Các bit địa chỉ cao được giải mã để chọn đúng chip nhớ. Các bit còn lại chọn ô bên trong chip.'),
          n('rom','ROM ngoài','Bộ nhớ chương trình',810,190,[[3,0],[3,1]],'Nhận địa chỉ, tín hiệu chọn chip và PSEN để trả mã lệnh. Chip có k đường địa chỉ chứa 2^k byte nếu mỗi địa chỉ chọn một byte.'),
          n('ram','RAM ngoài','Bộ nhớ dữ liệu',810,585,[[3,0],[3,1],[3,2]],'Nhận địa chỉ, chọn chip, RD/WR và bus dữ liệu để lưu hoặc trả dữ liệu.'),
          n('ea','EA • ROM nội/ngoại','Chọn nguồn chương trình',75,730,[[0,1]],'EA ở mức thấp dùng chương trình ngoài; mức cao cho phép dùng Flash nội trước. EA là chân chọn bộ nhớ, khác bit EA trong thanh ghi IE.')
        ],[
          e('p0','latch','Địa chỉ thấp','address'),e('ale','latch','Chốt địa chỉ','control'),e('latch','rom','A0–A7','address'),e('latch','ram','A0–A7','address'),
          e('p2','decode','Bit địa chỉ cao','address'),e('p2','rom','A8–A15','address'),e('p2','ram','A8–A15','address'),e('decode','rom','Chọn ROM','control'),e('decode','ram','Chọn RAM','control'),
          e('control','rom','PSEN → OE','control'),e('control','ram','RD / WR','control'),e('rom','p0','Mã lệnh qua P0'),e('ram','p0','Dữ liệu đọc'),e('p0','ram','Dữ liệu ghi'),e('ea','rom','Chọn chương trình ngoài','control')
        ])
    ]},
    chap3:{views:[
      v('execute','Luồng thực thi lệnh 8051','Lệnh quyết định nguồn toán hạng, phép xử lý, nơi ghi kết quả và cách cập nhật PC.',1120,820,
        [g('CPU 8051 • THỰC THI LỆNH',40,150,1040,620)], [
          n('code','ROM chương trình','Opcode',70,35,[[0,4]],'Mã máy được nạp từ bộ nhớ chương trình. MOVC cũng đọc bảng hằng trong bộ nhớ chương trình.'),
          n('ir','IR / Giải mã','Nhận diện lệnh',380,205,[[1,0],[1,1],[2,0],[2,1]],'Khối giải mã nhận diện lệnh chuyển dữ liệu, số học, logic, xử lý bit hoặc rẽ nhánh, rồi phối hợp các khối tương ứng.'),
          n('addressing','Chế độ định địa chỉ','Xác định toán hạng',70,370,[[0,0],[0,1],[0,2],[0,3],[0,4]],'Chế độ định địa chỉ cho biết toán hạng là hằng tức thời, thanh ghi, ô nhớ trực tiếp, ô nhớ qua con trỏ hay phần tử bảng ROM.'),
          n('registers','A • B • R0–R7','Toán hạng & kết quả',380,370,[[1,0],[1,1]],'Các thanh ghi cung cấp dữ liệu cho phép xử lý và nhận kết quả. Ví dụ MUL AB trả byte thấp về A và byte cao về B.'),
          n('alu','ALU & xử lý bit','ADD • SUBB • ANL…',690,370,[[1,1],[2,0]],'Khối xử lý thực hiện số học, logic và thao tác bit theo lệnh. Một số lệnh còn thay đổi các cờ trong PSW.'),
          n('memory','RAM / SFR / RAM ngoài','Nguồn hoặc đích dữ liệu',70,570,[[0,1],[0,2],[1,0]],'MOV truy cập RAM nội/SFR theo dạng lệnh; MOVX truy cập RAM ngoài; MOVC đọc bộ nhớ chương trình. Phải phân biệt ba loại truy cập này.'),
          n('flags','PSW / CY / OV / P','Trạng thái sau xử lý',690,570,[[1,1],[2,1]],'Các cờ phản ánh kết quả theo từng lệnh. SUBB dùng thêm CY làm mượn; các lệnh so sánh và nhảy có điều kiện dùng điều kiện phù hợp.'),
          n('pc','PC / Rẽ nhánh','SJMP • LJMP • CJNE • DJNZ',380,675,[[2,1]],'Đi tuần tự hoặc chuyển đến đích nhảy. PC mới quyết định lệnh sẽ được nạp trong vòng tiếp theo.')
        ],[
          e('code','ir','Mã lệnh'),e('ir','addressing','Chọn cách lấy dữ liệu','control'),e('addressing','registers','Toán hạng'),e('memory','registers','Dữ liệu đọc'),
          e('registers','memory','Ghi dữ liệu','data',{fromPort:'left',toPort:'top'}),e('registers','alu','Đưa toán hạng'),e('alu','registers','Trả kết quả','data',{fromPort:'bottom',toPort:'bottom'}),
          e('alu','flags','Cập nhật cờ'),e('flags','pc','Điều kiện nhảy','control'),e('ir','pc','Loại lệnh / đích nhảy','control'),e('pc','code','Địa chỉ lệnh kế','address',{fromPort:'left',toPort:'left'})
        ])
    ]},
    chap4:{views:[
      v('timer','Timer / Counter 0 & 1','Mô hình 89C51 cổ điển: nguồn xung đi qua lựa chọn Timer/Counter và điều kiện chạy, rồi tăng bộ đếm.',1120,760,
        [g('KHỐI TIMER / COUNTER',350,145,730,560)], [
          n('osc','Thạch anh / 12','Xung nội • Timer',60,65,[[0,0],[1,0]],'Ở chế độ Timer của 89C51 12T, một lần tăng bộ đếm tương ứng một chu kỳ máy: Tcm = 12 / Fosc.'),
          n('pin','Chân T0 / T1','Xung ngoài • Counter',60,270,[[0,0]],'Ở chế độ Counter, phần cứng đếm các chuyển mức 1 → 0 trên chân T0 hoặc T1.'),
          n('tmod','TMOD','C/T • GATE • M1:M0',60,480,[[0,1]],'C/T chọn nguồn xung; GATE chọn điều kiện chạy; M1:M0 chọn Mode 0, 1, 2 hoặc 3.'),
          n('source','Chọn nguồn xung','Timer hoặc Counter',405,215,[[0,0],[0,1]],'Nguồn xung được chọn theo bit C/T trong TMOD.'),
          n('gate','Điều kiện chạy','TRx • GATE • INTx',405,440,[[0,1],[0,2]],'TRx cho phép chạy. Nếu GATE = 1, chân INTx cũng phải ở mức 1 để bộ đếm được phép hoạt động.'),
          n('counter','THx : TLx','Bộ đếm theo mode',805,215,[[0,0],[0,1]],'THx/TLx giữ giá trị đếm. Độ rộng và cách nạp lại phụ thuộc mode; Mode 1 dùng 16 bit, Mode 2 dùng TLx 8 bit.'),
          n('overflow','TFx / Tràn','Cờ trong TCON',805,440,[[0,2]],'Khi bộ đếm tràn, cờ TFx được đặt. Phần mềm có thể kiểm tra cờ hoặc dùng ngắt Timer nếu đã cho phép.'),
          n('reload','THx → TLx','Tự nạp lại ở Mode 2',405,610,[[0,1],[1,3]],'Trong Mode 2, THx giữ giá trị nạp lại. Khi TLx tràn, phần cứng nạp giá trị THx vào TLx.'),
          n('cpu','CPU / Ngắt Timer','Phản ứng với cờ tràn',805,610,[[0,2]],'CPU xử lý cờ tràn bằng kiểm tra phần mềm hoặc chương trình phục vụ ngắt đã được cấu hình.')
        ],[
          e('osc','source','Xung chu kỳ máy'),e('pin','source','Cạnh xuống'),e('tmod','source','Chọn C/T','control'),e('tmod','gate','Chọn GATE','control'),
          e('source','counter','Xung đếm'),e('gate','counter','Cho phép chạy','control'),e('tmod','counter','Chọn mode','control'),e('counter','overflow','Bộ đếm tràn'),
          e('overflow','reload','Kích hoạt nạp lại','control'),e('reload','counter','Nạp TLx','data',{fromPort:'left',toPort:'bottom'}),e('overflow','cpu','TFx / yêu cầu ngắt','control')
        ]),
      v('preload','Từ thời gian trễ đến TH / TL','Chọn mode để chuyển số xung cần đếm thành giá trị nạp cho bộ đếm.',1080,700,
        [g('TÍNH GIÁ TRỊ NẠP',35,170,1010,320)], [
          n('delay','Thời gian cần tạo','Tdelay',85,40,[[1,1]],'Thời gian trễ mục tiêu dùng để tính số lần bộ đếm cần tăng.'),
          n('cycle','Chu kỳ máy','Tcm = 12 / Fosc',755,40,[[1,0]],'Với 89C51 12T và Fosc = 12 MHz, Tcm = 1 µs.'),
          n('ticks','Số xung N','N = Tdelay / Tcm',420,230,[[1,1]],'N phải nằm trong khả năng đếm của mode được chọn; thời gian thực tế còn chịu ảnh hưởng của mã lệnh điều khiển.'),
          n('mode1','Mode 1 • 16 bit','Giá trị nạp = 65536 − N',85,385,[[1,2]],'Tính giá trị nạp 16 bit, đổi sang Hex rồi tách byte cao TH và byte thấp TL.'),
          n('mode2','Mode 2 • 8 bit','Giá trị nạp = 256 − N',755,385,[[1,3]],'TH giữ giá trị tự nạp lại. TL dùng để đếm trong mỗi chu kỳ; cấu hình ban đầu phải đặt giá trị phù hợp.'),
          n('thtl','TH / TL','Ghi giá trị nạp',420,565,[[1,2],[1,3]],'CPU ghi các thanh ghi trước khi bật TRx. Bộ đếm tăng từ giá trị nạp đến tràn để tạo khoảng thời gian mong muốn.')
        ],[
          e('delay','ticks','Thời gian mục tiêu'),e('cycle','ticks','Độ dài mỗi xung'),e('ticks','mode1','Chọn Mode 1','control'),e('ticks','mode2','Chọn Mode 2','control'),
          e('mode1','thtl','Tách byte cao / thấp'),e('mode2','thtl','Giá trị 8 bit')
        ])
    ]},
    chap5:{views:[
      v('uart','UART: truyền, nhận & baud','Minh họa UART Mode 1, baud lấy từ Timer 1 Mode 2. Hai bộ đệm SBUF có cùng địa chỉ nhưng khác đường truyền và nhận.',1120,850,
        [g('UART TRONG 89C51',330,200,750,570)], [
          n('timer','Timer 1 • TH1','Nguồn baud',80,40,[[1,0],[1,2]],'Cấu hình thường dùng là Timer 1 Mode 2 để tạo baud cho UART Mode 1/3. Giá trị TH1 quyết định tần số tràn của Timer 1.'),
          n('baud','Bộ tạo baud • PCON','SMOD',430,40,[[1,1],[1,2]],'SMOD và tốc độ tràn Timer 1 quyết định baud trong cấu hình minh họa. Hai phía UART cần dùng baud tương thích.'),
          n('scon','SCON','Mode • REN • TI • RI',805,40,[[0,2]],'SCON chọn mode, cho phép nhận bằng REN và chứa các cờ truyền/nhận. RI/TI phải được xử lý và xóa bằng phần mềm.'),
          n('cpu','CPU / A','Ghi truyền • Đọc nhận',65,390,[[0,1],[1,3]],'Ghi SBUF để bắt đầu phát; đọc SBUF để lấy byte vừa nhận. CPU phối hợp với TI/RI để biết khi nào cần xử lý.'),
          n('txbuf','SBUF phát','Ghi tại 99H',375,265,[[0,1]],'Thanh ghi đệm phát nhận byte do CPU ghi vào SBUF.'),
          n('tx','Bộ dịch phát','Dữ liệu → TxD / P3.1',795,265,[[0,0],[0,2]],'Phát khung UART ra TxD theo baud đã chọn. Mode 1 dùng 8 bit dữ liệu cùng start và stop.'),
          n('rx','Bộ dịch nhận','RxD / P3.0 → Dữ liệu',795,555,[[0,0],[0,2]],'Nhận khung từ RxD khi bộ nhận được cho phép, rồi chuyển byte vào bộ đệm nhận.'),
          n('rxbuf','SBUF nhận','Đọc tại 99H',375,555,[[0,1]],'Thanh ghi đệm nhận lưu byte nhận được. Dù cùng địa chỉ với SBUF phát, đây là thanh ghi vật lý riêng.'),
          n('flags','TI / RI → Ngắt UART','Vector 0023H nếu được phép',565,720,[[0,2]],'TI báo trạng thái truyền, RI báo trạng thái nhận. Hai cờ dùng chung nguồn ngắt nối tiếp; chương trình xác định cờ nào cần xử lý.')
        ],[
          e('timer','baud','Xung tràn Timer 1'),e('baud','tx','Nhịp phát','control'),e('baud','rx','Nhịp nhận','control'),e('scon','tx','Chọn mode','control'),e('scon','rx','Mode / REN','control'),
          e('cpu','txbuf','Ghi SBUF'),e('txbuf','tx','Byte cần phát'),e('rx','rxbuf','Byte đã nhận'),e('rxbuf','cpu','Đọc SBUF'),
          e('tx','flags','TI','control'),e('rx','flags','RI','control'),e('flags','cpu','Cờ / yêu cầu ngắt','control')
        ])
    ]},
    chap6:{views:[
      v('interrupt','Từ yêu cầu ngắt đến RETI','Nguồn ngắt qua điều kiện cho phép và ưu tiên; CPU lưu địa chỉ trở về, chạy ISR rồi tiếp tục chương trình.',1180,870,
        [g('NGUỒN NGẮT',25,25,285,730),g('CPU • CHỌN VÀ PHỤC VỤ NGẮT',345,25,790,730)], [
          n('int0','INT0','P3.2 • Vector 0003H',60,90,[[0,0]],'Ngắt ngoài 0 phát yêu cầu theo cấu hình ngắt ngoài.'),
          n('timer0','Timer 0 / TF0','Vector 000BH',60,235,[[0,0]],'Cờ tràn Timer 0 là nguồn yêu cầu ngắt Timer 0.'),
          n('int1','INT1','P3.3 • Vector 0013H',60,380,[[0,0]],'Ngắt ngoài 1 là nguồn ngắt độc lập với INT0.'),
          n('timer1','Timer 1 / TF1','Vector 001BH',60,525,[[0,0]],'Cờ tràn Timer 1 là nguồn yêu cầu ngắt Timer 1.'),
          n('uart','UART / TI hoặc RI','Vector 0023H',60,670,[[0,0]],'Cờ truyền và nhận dùng chung nguồn ngắt nối tiếp.'),
          n('ie','IE • EA & từng nguồn','Cho phép ngắt',390,270,[[0,2],[1,0]],'EA trong IE mở ngắt toàn cục; EX0, ET0, EX1, ET1 và ES mở từng nguồn. Đây không phải chân EA chọn bộ nhớ chương trình.'),
          n('ip','IP / Mức ưu tiên','Chọn yêu cầu được phục vụ',780,270,[[0,2],[1,1]],'IP đặt mức ưu tiên cao hoặc thấp. Ngắt cao có thể chen ngang ISR thấp; ngắt cùng cấp chưa được phục vụ khi ISR cùng cấp đang chạy.'),
          n('vector','Vector / PC','Nhảy tới mã ISR',780,485,[[0,0],[0,1]],'Nguồn được chấp nhận quyết định địa chỉ vector. PC chuyển tới mã phục vụ ngắt tương ứng.'),
          n('stack','Stack / SP','Lưu địa chỉ trở về',390,485,[[1,2]],'Phần cứng lưu địa chỉ trở về trên stack khi nhận ngắt. Nếu ISR sửa các thanh ghi cần giữ, chương trình phải tự lưu và phục hồi chúng.'),
          n('isr','ISR → RETI','Xử lý & kết thúc ngắt',780,680,[[1,2]],'ISR xử lý sự kiện. RETI phục hồi địa chỉ trở về và báo kết thúc phục vụ ngắt, cho phép luồng chính tiếp tục.'),
          n('main','Chương trình chính','Tiếp tục sau ngắt',390,780,[[1,2]],'Sau RETI, CPU tiếp tục từ địa chỉ đã lưu; việc phục hồi đúng thanh ghi giúp chương trình chính giữ trạng thái.')
        ],[
          ...['int0','timer0','int1','timer1','uart'].map(id=>e(id,'ie','Yêu cầu ngắt','control')),
          e('ie','ip','Nguồn được cho phép','control'),e('ip','vector','Chấp nhận ngắt','control'),e('ip','stack','Lưu khi nhận ngắt','control'),e('vector','isr','Địa chỉ ISR','address'),
          e('main','stack','PC trở về'),e('isr','stack','RETI','control'),e('stack','main','Phục hồi PC','address',{fromPort:'left',toPort:'left'})
        ])
    ]},
    casio_guide:{views:[
      v('calculator','Từ bài toán đến giá trị thanh ghi','Các phép đổi hệ và tính toán hỗ trợ đọc kết quả ALU, kiểm tra cờ và chọn giá trị nạp cho Timer/UART.',1120,730,
        [g('CÔNG CỤ TÍNH & CHUYỂN HỆ',330,130,470,530)], [
          n('alu','Kết quả ALU / Hex','Phép toán & toán hạng',60,65,[[0,2]],'Nhập phép tính đúng với toán hạng và cờ mượn/nhớ của lệnh đang xét.'),
          n('delay','Thời gian / Fosc','Bài toán Timer',60,295,[[1,0],[1,1]],'Tính N từ thời gian cần tạo và chu kỳ máy trước khi chọn giá trị nạp.'),
          n('baud','Baud mục tiêu','Bài toán UART',60,550,[[2,0]],'Trong cấu hình Fosc = 11.0592 MHz, SMOD = 0, dùng TH1 = −28800 / Baud để tìm giá trị nạp.'),
          n('basen','Casio Base-N','DEC ↔ HEX ↔ BIN',410,210,[[0,0],[0,1]],'Chế độ Base-N chuyển giữa các hệ đếm, giúp đọc và kiểm tra giá trị thanh ghi.'),
          n('preload','65536 − N / 256 − N','Mode 1 / Mode 2',410,450,[[1,0],[1,1],[2,0]],'Tính giá trị nạp theo mode; đổi kết quả sang Hex để ghi TH/TL hoặc TH1.'),
          n('flags','BIN → Đếm bit 1','Kiểm tra cờ P',860,65,[[0,3]],'Đổi kết quả trong A sang nhị phân rồi đếm bit 1. Với 8051, số bit 1 lẻ làm P = 1.'),
          n('registers','TH / TL / TH1','Giá trị đưa vào phần cứng',860,360,[[1,0],[1,1],[2,0]],'Tách byte hoặc lấy giá trị 8 bit phù hợp để ghi thanh ghi Timer.'),
          n('assembly','Kiểm tra lệnh 8051','Toán hạng hợp lệ',860,590,[[2,1]],'Đối chiếu dạng toán hạng của lệnh. MOV direct, direct hợp lệ; gián tiếp RAM nội chỉ dùng @R0 hoặc @R1.')
        ],[
          e('alu','basen','Kết quả cần đổi hệ'),e('basen','flags','Hiển thị BIN'),e('delay','preload','N cần đếm'),e('baud','preload','Giá trị TH1'),
          e('preload','basen','Đổi sang HEX'),e('basen','registers','Đọc byte Hex'),e('registers','assembly','Viết lệnh nạp')
        ])
    ]}
  };
});
