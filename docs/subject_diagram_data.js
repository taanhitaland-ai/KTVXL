// Authored relationships for the other subjects, tied to their chapter sources.
// Edge styles mean relationships, methods and conditions; they are not CPU buses.
(function (root, factory) {
  const data=factory();
  if (typeof module==='object'&&module.exports) module.exports=data;
  else root.KMA_SUBJECT_DIAGRAM_DATA=data;
})(typeof window==='undefined'?globalThis:window,function () {
  const n=(id,label,subtitle,refs,text)=>({id,label,subtitle,refs,text:[text]});
  const e=(from,to,label,type='data',extra={})=>({from,to,label,type,...extra});
  const f=(...indices)=>indices.map(index=>[1,index]);
  // Each row is a stage or a set of related peers. Routes avoid the actual boxes.
  function v(id,title,description,rows,edges) {
    const nodes=rows.flatMap((row,r)=>row.map((node,c)=>({...node,
      x:row.length===1?405:row.length===2?160+c*490:55+c*350,
      y:65+r*165,width:250,height:92})));
    return {id,title,description,width:1060,height:rows.length*165+80,groups:[],nodes,edges};
  }
  const subject=(label,icon,legend,chapters)=>({label,icon,legend,chapters,
    incoming:'Liên hệ từ',outgoing:'Liên hệ đến',context:'SƠ ĐỒ LIÊN KẾT'});
  return {
    tthcm:subject('Tư tưởng Hồ Chí Minh','📕',['Liên hệ nội dung','Tiến trình / vận dụng','Nguyên tắc'],{
      tthcm_chap1:{views:[v('study','Nghiên cứu và vận dụng',
        'Từ khái niệm đến đối tượng, nhiệm vụ và phương pháp nghiên cứu. Lý luận và thực tiễn có quan hệ hai chiều.',[
        [n('concept','Tư tưởng Hồ Chí Minh','Hệ thống quan điểm',[[0,0],[0,1],[0,2]],'Khái niệm được khẳng định, làm rõ qua các Đại hội VII, IX và XI. Nội dung là hệ thống quan điểm về cách mạng Việt Nam, hình thành từ sự vận dụng sáng tạo chủ nghĩa Mác – Lênin, truyền thống dân tộc và tinh hoa văn hóa nhân loại.')],
        [n('object','Đối tượng nghiên cứu','Quan điểm và sự hiện thực hóa',[[1,0]],'Nghiên cứu hệ thống quan điểm của Hồ Chí Minh và quá trình vận dụng các quan điểm ấy trong thực tiễn cách mạng.'),
         n('tasks','Nhiệm vụ nghiên cứu','Nguồn gốc • Nội dung • Vai trò',[[1,1]],'Làm rõ cơ sở hình thành, các giai đoạn phát triển, luận điểm cơ bản và vai trò chỉ đạo thực tiễn; xem xét sự vận dụng và phát triển sáng tạo.')],
        [n('history','Lịch sử – cụ thể','Đặt trong hoàn cảnh ra đời',[[2,2]],'Đặt từng luận điểm trong thời gian, không gian và điều kiện lịch sử cụ thể. Phương pháp này giúp tránh tách câu nói khỏi bối cảnh.'),
         n('system','Toàn diện và hệ thống','Xem các luận điểm trong chỉnh thể',[[2,3]],'Xem các luận điểm trong quan hệ với nhau, thay vì chỉ ghi nhớ từng ý rời rạc.'),
         n('science','Tính Đảng và khoa học','Lập trường và tính khách quan',[[2,0]],'Thống nhất lập trường giai cấp công nhân với việc phản ánh khách quan, chính xác sự thật lịch sử.')],
        [n('theory','Lý luận','Khái quát từ thực tiễn',[[2,1]],'Lý luận bắt nguồn từ thực tiễn. Khi nghiên cứu, cần làm rõ cách thực tiễn đặt ra vấn đề và cách quan điểm được hình thành.'),
         n('practice','Thực tiễn','Vận dụng và kiểm nghiệm',[[2,1],[1,1]],'Lý luận trở lại chỉ đạo thực tiễn; kết quả thực tiễn cung cấp cơ sở để kiểm nghiệm, bổ sung và phát triển nhận thức.')]
      ],[e('concept','object','Xác định phạm vi'),e('object','tasks','Đặt nhiệm vụ'),
        e('tasks','history','Nghiên cứu theo bối cảnh','control'),e('tasks','system','Xem quan hệ toàn diện','control'),e('tasks','science','Bảo đảm nguyên tắc','control'),
        e('history','theory','Giải thích sự hình thành'),e('system','theory','Liên kết các luận điểm'),e('science','theory','Bảo đảm nhận thức','control'),
        e('theory','practice','Chỉ đạo, vận dụng','address'),e('practice','theory','Kiểm nghiệm, bổ sung','address',{fromPort:'bottom',toPort:'bottom'})])]},
      tthcm_chap2:{views:[
        v('origins','Các cơ sở hình thành','Các cơ sở cùng tác động đến sự hình thành tư tưởng; chủ nghĩa Mác – Lênin giữ vai trò quyết định về thế giới quan và phương pháp luận.',[
          [n('vietnam','Thực tiễn Việt Nam','Yêu cầu tìm đường cứu nước',[[0,0]],'Xã hội thuộc địa nửa phong kiến và sự thất bại của các khuynh hướng cứu nước trước đó đặt ra yêu cầu tìm một đường lối phù hợp.'),
           n('world','Thực tiễn thế giới','Biến đổi của thời đại',[[0,1]],'Chủ nghĩa đế quốc, Cách mạng Tháng Mười Nga năm 1917 và Quốc tế Cộng sản tạo nên bối cảnh quốc tế của quá trình tìm đường cứu nước.')],
          [n('tradition','Truyền thống dân tộc','Yêu nước • Đoàn kết • Nhân ái',[[1,0]],'Chủ nghĩa yêu nước là động lực tinh thần chủ yếu; các giá trị đoàn kết, nhân ái, tự lực và tự cường được kế thừa.'),
           n('culture','Văn hóa nhân loại','Chọn lọc tinh hoa Đông – Tây',[[1,1]],'Tiếp thu có chọn lọc những giá trị tích cực của văn hóa phương Đông và các tư tưởng nhân văn, tự do, bình đẳng, dân chủ của phương Tây.'),
           n('marx','Chủ nghĩa Mác – Lênin','Thế giới quan và phương pháp luận',[[1,2]],'Là cơ sở lý luận quyết định, tạo bước ngoặt trong tư duy và việc lựa chọn con đường cách mạng.')],
          [n('formation','Hình thành tư tưởng','Tiếp thu và vận dụng sáng tạo',[[1,0],[1,1],[1,2]],'Các cơ sở được tiếp thu, chọn lọc và vận dụng vào điều kiện Việt Nam, tạo nên hệ thống quan điểm của Hồ Chí Minh.')]
        ],[e('vietnam','formation','Yêu cầu thực tiễn'),e('world','formation','Bối cảnh thời đại'),e('tradition','formation','Kế thừa giá trị'),e('culture','formation','Tiếp thu tinh hoa'),e('marx','formation','Cơ sở quyết định','control')]),
        v('history','Năm thời kỳ phát triển','Mũi tên biểu thị thứ tự lịch sử và sự phát triển, không phải quan hệ nguyên nhân duy nhất.',[
          [n('early','1890–1911','Yêu nước và chí hướng cách mạng',[[2,0]],'Tiếp thu truyền thống gia đình, quê hương và dân tộc. Ngày 5/6/1911 ra đi tìm đường cứu nước.'),
           n('search','1911–1920','Khảo sát và tìm đường',[[2,1]],'Khảo sát thực tiễn nhiều nước, gửi Yêu sách năm 1919; đến với chủ nghĩa Mác – Lênin và lựa chọn con đường cách mạng vô sản năm 1920.')],
          [n('challenge','1930–1941','Giữ vững đường lối',[[2,3]],'Vượt qua thử thách, kiên trì quan điểm giải phóng dân tộc; về nước năm 1941 và đặt nhiệm vụ giải phóng dân tộc lên hàng đầu.'),
           n('foundation','1920–1930','Hình thành cơ bản tư tưởng',[[2,2]],'Hoạt động lý luận và tổ chức: Bản án chế độ thực dân Pháp, Hội Việt Nam Cách mạng Thanh niên, Đường Kách mệnh và thành lập Đảng năm 1930.')],
          [n('mature','1941–1969','Phát triển và chỉ đạo thực tiễn',[[2,4]],'Tư tưởng tiếp tục phát triển qua cách mạng, kháng chiến và xây dựng đất nước; các mốc tiêu biểu là năm 1945, 1954 và Di chúc năm 1969.')]
        ],[e('early','search','Ra đi năm 1911','address'),e('search','foundation','Bước ngoặt năm 1920','address'),e('foundation','challenge','Thành lập Đảng năm 1930','address'),e('challenge','mature','Trở về nước năm 1941','address')])]},
      tthcm_chap3:{views:[v('independence','Độc lập và con đường phát triển','Liên kết mục tiêu độc lập dân tộc, lực lượng và phương pháp cách mạng với chủ nghĩa xã hội và hạnh phúc nhân dân.',[
        [n('leadership','Đảng và lực lượng','Lãnh đạo • Liên minh công nông',[[1,1]],'Đảng của giai cấp công nhân lãnh đạo; liên minh công nông là nền tảng của lực lượng cách mạng.'),
         n('path','Con đường cách mạng vô sản','Chủ động và sáng tạo',[[1,0],[1,2]],'Cách mạng giải phóng dân tộc đi theo con đường cách mạng vô sản; có thể giành thắng lợi trước cách mạng ở chính quốc, không thụ động chờ đợi.'),
         n('methods','Phương pháp cách mạng','Chính trị kết hợp vũ trang',[[1,3]],'Bạo lực cách mạng kết hợp đấu tranh chính trị với đấu tranh vũ trang theo điều kiện cụ thể.')],
        [n('independence','Độc lập dân tộc','Thật sự • Toàn diện • Thống nhất',[[0,0],[0,1],[0,3]],'Độc lập là quyền thiêng liêng; phải thật sự và triệt để về chính trị, quân sự, kinh tế, ngoại giao, gắn với thống nhất và toàn vẹn lãnh thổ.'),
         n('transition','Thời kỳ quá độ','Xuất phát từ điều kiện Việt Nam',[[2,3]],'Đặc điểm cơ bản là từ một nước nông nghiệp lạc hậu tiến lên chủ nghĩa xã hội không kinh qua giai đoạn phát triển tư bản chủ nghĩa.')],
        [n('socialism','Chủ nghĩa xã hội','Nhân dân làm chủ',[[2,0],[2,1]],'Xã hội do nhân dân lao động làm chủ; phát triển kinh tế, khoa học, văn hóa; mục tiêu là nâng cao đời sống vật chất và tinh thần.'),
         n('motivation','Động lực và lực cản','Con người • Đoàn kết • Chống tiêu cực',[[2,2]],'Phát huy con người, đoàn kết, kinh tế và văn hóa; chống chủ nghĩa cá nhân, tham ô, lãng phí, quan liêu làm suy yếu các động lực.')],
        [n('people','Tự do và hạnh phúc nhân dân','Mục tiêu xuyên suốt',[[0,2],[2,1]],'Độc lập phải đem lại tự do, cuộc sống ấm no và hạnh phúc. Đây cũng là mục tiêu của xây dựng chủ nghĩa xã hội.')]
      ],[e('leadership','path','Tổ chức và lãnh đạo','control'),e('methods','path','Phương pháp thực hiện','control'),e('path','independence','Giải phóng dân tộc','address'),e('independence','transition','Tiền đề phát triển'),e('transition','socialism','Xây dựng xã hội mới','address'),e('motivation','socialism','Phát huy, khắc phục','control'),e('independence','people','Đem lại tự do'),e('socialism','people','Nâng cao đời sống'),e('people','motivation','Con người là động lực')])]},
      tthcm_chap4:{views:[v('party-state','Đảng, Nhà nước và nhân dân','Đảng lãnh đạo; nhân dân làm chủ, lập nên và giám sát Nhà nước; Nhà nước phục vụ nhân dân bằng pháp luật và bộ máy trong sạch.',[
        [n('origins','Ba yếu tố ra đời của Đảng','Mác – Lênin • Công nhân • Yêu nước',[[0,0]],'Đảng Cộng sản Việt Nam ra đời từ sự kết hợp chủ nghĩa Mác – Lênin, phong trào công nhân và phong trào yêu nước.'),
         n('organization','Tổ chức và cán bộ','Nguyên tắc • Công tác cán bộ',[[0,2],[0,3]],'Tập trung dân chủ, tập thể lãnh đạo và cá nhân phụ trách, tự phê bình, kỷ luật và đoàn kết bảo đảm tổ chức; cán bộ là gốc của công việc.')],
        [n('party','Đảng Cộng sản Việt Nam','Bản chất giai cấp công nhân',[[0,1]],'Mang bản chất giai cấp công nhân; đại diện lợi ích của giai cấp công nhân, nhân dân lao động và dân tộc.'),
         n('people','Nhân dân','Dân là chủ và dân làm chủ',[[1,0],[1,1]],'Mọi quyền lực thuộc về nhân dân. Nhân dân bầu ra, nuôi dưỡng, ủng hộ và giám sát Nhà nước; có quyền bãi miễn khi không hoàn thành trọng trách.')],
        [n('state','Nhà nước của, do, vì dân','Quyền lực và mục đích phục vụ',[[1,0],[1,1],[1,2],[1,3]],'Của dân: quyền lực thuộc về dân. Do dân: do dân lập nên và giám sát. Vì dân: phục vụ lợi ích chính đáng của dân; thống nhất bản chất giai cấp với tính nhân dân và dân tộc.'),
         n('law','Hiến pháp và pháp luật','Quản lý bằng pháp luật',[[1,4]],'Nhà nước pháp quyền có hiệu lực pháp lý mạnh mẽ, quản lý xã hội bằng Hiến pháp và pháp luật; các bản Hiến pháp được nêu trong chương là 1946 và 1959.')],
        [n('integrity','Bộ máy trong sạch','Chống tham ô, lãng phí, quan liêu',[[1,5]],'Phòng chống tiêu cực để bộ máy thực hiện đúng trách nhiệm phục vụ nhân dân, không có đặc quyền, đặc lợi.')]
      ],[e('origins','party','Kết hợp thành Đảng'),e('organization','party','Xây dựng tổ chức','control'),e('party','state','Lãnh đạo','control'),e('people','state','Bầu, ủng hộ, giám sát','control'),e('state','people','Phục vụ lợi ích'),e('law','state','Cơ sở quản lý','control'),e('state','integrity','Yêu cầu xây dựng','address'),e('integrity','people','Bảo vệ lợi ích')])]},
      tthcm_chap5:{views:[v('unity','Sức mạnh đoàn kết','Các lực lượng tập hợp qua Mặt trận; sức mạnh dân tộc kết hợp sức mạnh thời đại trên cơ sở độc lập, tự chủ.',[
        [n('people','Toàn thể nhân dân','Không phân biệt giai tầng, tôn giáo',[[0,1]],'Tập hợp mọi người Việt Nam có lòng yêu nước, thương nòi; đoàn kết rộng rãi, tôn trọng khác biệt và lợi ích chính đáng.'),
         n('alliance','Liên minh công – nông – trí thức','Nền tảng, dưới sự lãnh đạo của Đảng',[[0,2]],'Liên minh công nhân, nông dân và trí thức làm nền tảng cho khối đại đoàn kết toàn dân tộc, dưới sự lãnh đạo của Đảng.'),
         n('international','Các lực lượng quốc tế','Công nhân • Giải phóng • Tiến bộ',[[1,1]],'Đoàn kết với phong trào cộng sản và công nhân, các phong trào giải phóng dân tộc, hòa bình, dân chủ và tiến bộ xã hội.')],
        [n('front','Mặt trận dân tộc thống nhất','Hình thức tổ chức đoàn kết',[[0,3],[0,4]],'Mặt trận tập hợp các lực lượng; hoạt động bằng hiệp thương dân chủ, đoàn kết chân thành và tôn trọng lợi ích chính đáng của thành viên.'),
         n('principles','Độc lập, tự chủ','Có lý, có tình • Tự lực, tự cường',[[1,2]],'Đoàn kết quốc tế trên cơ sở mục tiêu, lợi ích thống nhất; giữ độc lập, tự chủ, tự lực, tự cường và ứng xử có lý, có tình.')],
        [n('national','Sức mạnh dân tộc','Đoàn kết là chiến lược lâu dài',[[0,0],[0,2]],'Đại đoàn kết là vấn đề chiến lược nhất quán, lâu dài, vừa là mục tiêu vừa là nhiệm vụ hàng đầu của cách mạng.'),
         n('era','Sức mạnh thời đại','Hợp tác và đoàn kết quốc tế',[[1,0],[1,1]],'Đoàn kết quốc tế giúp kết hợp các nguồn lực và sự ủng hộ của các lực lượng tiến bộ với sức mạnh dân tộc.')],
        [n('combined','Sức mạnh tổng hợp','Kết hợp dân tộc và thời đại',[[1,0]],'Sức mạnh dân tộc và sức mạnh thời đại được kết hợp để thực hiện mục tiêu cách mạng; đoàn kết quốc tế gắn với phát huy nội lực.')]
      ],[e('people','front','Tập hợp lực lượng'),e('alliance','front','Nền tảng','control'),e('front','national','Tổ chức đại đoàn kết','address'),e('international','era','Đoàn kết quốc tế'),e('principles','era','Bảo đảm nguyên tắc','control'),e('national','combined','Phát huy nội lực'),e('era','combined','Kết hợp nguồn lực')])]},
      tthcm_chap6:{views:[v('people','Văn hóa, đạo đức và con người','Văn hóa và đạo đức cùng xây dựng con người; con người vừa là mục tiêu vừa là động lực của sự phát triển.',[
        [n('culture','Văn hóa','Trong kinh tế và chính trị',[[0,0],[0,1]],'Văn hóa là tổng hợp những phương thức sinh hoạt đáp ứng nhu cầu sống; có quan hệ với kinh tế và chính trị, soi đường cho hoạt động xã hội.'),
         n('qualities','Dân tộc • Khoa học • Đại chúng','Tính chất văn hóa mới',[[0,2]],'Ba tính chất định hướng xây dựng nền văn hóa mới, gắn với dân tộc, nhận thức khoa học và đông đảo nhân dân.')],
        [n('education','Chức năng văn hóa','Tư tưởng • Dân trí • Lối sống',[[0,3]],'Bồi dưỡng tư tưởng và tình cảm, mở rộng hiểu biết, nâng cao dân trí, hình thành phẩm chất và lối sống tốt đẹp.'),
         n('ethics','Đạo đức cách mạng','Gốc của người cách mạng',[[1,0]],'Đạo đức là nền tảng; năng lực cần gắn với đạo đức để phục vụ nhân dân và thực hiện trách nhiệm.')],
        [n('standards','Bốn chuẩn mực','Trung, hiếu • Cần, kiệm • Nhân ái • Quốc tế',[[1,1]],'Trung với nước, hiếu với dân; cần, kiệm, liêm, chính, chí công vô tư; yêu thương con người; tinh thần quốc tế trong sáng.'),
         n('training','Ba nguyên tắc rèn luyện','Nêu gương • Xây và chống • Suốt đời',[[1,2]],'Nói đi đôi với làm và nêu gương; xây đi đôi với chống; tu dưỡng đạo đức suốt đời, gắn với hành động thực tế.')],
        [n('newpeople','Con người: mục tiêu và động lực','Giáo dục toàn diện đức và tài',[[2,0],[2,1],[2,2]],'Chiến lược trồng người chú trọng thế hệ sau, giáo dục toàn diện đức và tài, trong đó đức là gốc. Con người là mục tiêu đồng thời tạo ra sức mạnh phát triển.')]
      ],[e('qualities','culture','Định hướng xây dựng','control'),e('culture','education','Thực hiện chức năng'),e('education','newpeople','Bồi dưỡng con người','address'),e('standards','ethics','Nội dung chuẩn mực'),e('training','ethics','Hình thành bằng rèn luyện','address'),e('ethics','newpeople','Nền tảng đạo đức'),e('newpeople','culture','Sáng tạo và phát triển văn hóa')]) ]}
    }),
    vldc:subject('Vật lý đại cương','⚛️',['Quan hệ đại lượng','Suy ra / tính','Điều kiện'],{
      1:{views:[v('lc','Mạch LC và sóng điện từ','Theo dõi sự trao đổi năng lượng giữa tụ và cuộn cảm, điều kiện lý tưởng, tổn hao và liên hệ tần số – bước sóng.',[
        [n('parameters','L, C và trạng thái ban đầu','Xác định nhịp dao động',f(0,2),'Với mạch LC lý tưởng: $\\omega=1/\\sqrt{LC}$, $T=2\\pi\\sqrt{LC}$. Điều kiện ban đầu quyết định pha; khi $q(0)=Q_0$ và $i(0)=0$ thì $q=Q_0\\cos\\omega t$.'),
         n('resistance','Điện trở R','Tổn hao của mạch thực',f(3),'Điện trở làm năng lượng chuyển thành nhiệt. Với RLC nối tiếp ở chế độ dao động tắt dần, bao biên điện tích giảm như $Q_0e^{-Rt/(2L)}$.')],
        [n('capacitor','Tụ điện C','Điện tích và điện trường',f(0,2),'Điện tích $q$ tạo điện áp $u=q/C$. Năng lượng điện trường trong tụ là $W_C=q^2/(2C)$.'),
         n('inductor','Cuộn cảm L','Dòng điện và từ trường',f(2),'Dòng điện trong cuộn cảm tạo từ trường và năng lượng $W_L=Li^2/2$. Quan hệ biên độ trong mạch lý tưởng: $I_0=U_0\\sqrt{C/L}$.')],
        [n('energy','Năng lượng LC','Bảo toàn khi không tổn hao',f(1,2),'Trong mạch lý tưởng $W_C+W_L$ không đổi. Hai dạng năng lượng trao đổi tuần hoàn; mỗi dạng lặp lại sau $T/2$ do phụ thuộc bình phương q hoặc i.'),
         n('wave','Sóng điện từ','Truyền năng lượng trong không gian',f(4),'Đối với sóng điện từ trong chân không, $\\lambda=c/f=cT$. Mạch dao động và ăng-ten có thể tạo sóng; LC lý tưởng kín chỉ minh họa sự trao đổi năng lượng của mạch.')]
      ],[e('parameters','capacitor','Điều kiện và tần số','control'),e('capacitor','inductor','Dòng điện khi phóng điện'),e('inductor','capacitor','Cảm ứng nạp lại','data',{fromPort:'bottom',toPort:'bottom'}),e('capacitor','energy','Năng lượng điện'),e('inductor','energy','Năng lượng từ'),e('resistance','energy','Làm giảm năng lượng','control'),e('parameters','wave','Dùng f để tính λ','address')])]},
      2:{views:[
        v('interference','Giao thoa ánh sáng','Độ lệch pha và hiệu quang lộ quyết định sáng – tối. Young, nêm và Newton là các cấu hình khác nhau của giao thoa.',[
          [n('source','Nguồn sáng kết hợp','Cùng tần số, lệch pha ổn định',f(0),'Hai sóng kết hợp chồng chất tạo hệ vân ổn định. Với khe Young trong gần đúng góc nhỏ, hiệu quang lộ là $\\Delta L=ax/D$.'),
           n('changes','Thay đổi quang lộ','Bản mỏng hoặc dịch nguồn',f(3,4),'Bản mỏng trước một khe làm tăng quang lộ và dịch hệ vân về phía khe đó. Dịch nguồn làm thay đổi pha ban đầu giữa hai khe và dịch hệ vân ngược chiều dịch nguồn.')],
          [n('phase','Hiệu quang lộ và pha','So sánh hai sóng tại điểm quan sát',f(0,1),'Nếu hai nguồn cùng pha, $\\Delta L=k\\lambda$ cho vân sáng; $\\Delta L=(k+1/2)\\lambda$ cho vân tối. Khi phản xạ cần tính cả sự đổi pha.'),
           n('film','Lớp mỏng và phản xạ','Đổi pha tại mặt phân cách',f(5,6),'Nêm không khí và lớp không khí của vân Newton có thêm độ lệch pha do một phản xạ đổi pha. Với lớp có bề dày bằng không ở chỗ tiếp xúc, tâm/cạnh phản xạ là tối trong điều kiện của bài học.')],
          [n('young','Hệ vân Young','Vị trí và khoảng vân',f(1,2,3,4),'Từ điều kiện sáng – tối suy ra $x_s=k\\lambda D/a$, $x_t=(k+1/2)\\lambda D/a$ và khoảng vân $i=\\lambda D/a$.'),
           n('thinfilm','Nêm và vân Newton','Bề dày biến thiên tạo hình vân',f(5,6),'Nêm có bề dày tăng theo vị trí nên tạo vân gần thẳng; lớp không khí dưới thấu kính cong tạo vân tròn Newton. Công thức trong chương áp dụng cho ánh sáng phản xạ.')]
        ],[e('source','phase','Chồng chất hai sóng'),e('changes','phase','Thay đổi độ lệch','control'),e('film','phase','Tính cả đổi pha','control'),e('phase','young','Áp dụng hình học Young','address'),e('phase','thinfilm','Áp dụng lớp mỏng','address')]),
        v('fresnel','Fresnel, lỗ và đĩa tròn','Phân chia mặt sóng thành các đới; các phần sóng truyền tới điểm quan sát và giao thoa với nhau.',[
          [n('geometry','Nguồn và điểm quan sát','Khoảng cách a, b và bước sóng',f(7,8),'Hình học nguồn–màn–điểm quan sát xác định bán kính các đới Fresnel: $r_k\\approx\\sqrt{kab\\lambda/(a+b)}$. Diện tích các đới gần bằng nhau trong gần đúng của chương.')],
          [n('zones','Đới Fresnel','Các đới liên tiếp lệch pha',f(7,8),'Chia mặt sóng theo các khoảng chênh quang lộ $\\lambda/2$. Sóng từ các đới liên tiếp tới điểm quan sát có pha gần đối nhau.'),
           n('aperture','Lỗ tròn','Cho một số đới truyền qua',f(9),'Bán kính lỗ quyết định số đới được mở. Tại trục, số đới lẻ hoặc chẵn cho tăng cường hoặc triệt giảm theo gần đúng đới Fresnel.')],
          [n('disk','Đĩa tròn chắn sáng','Các đới bên ngoài vẫn đóng góp',f(10),'Đĩa che các đới trung tâm; sóng từ vùng quanh đĩa vẫn truyền tới trục và tạo điểm sáng Arago trong cấu hình đối xứng.'),
           n('observation','Cường độ tại tâm','Cộng các biên độ có pha',f(9,10),'Tổng biên độ tại điểm quan sát quyết định cường độ. Không chỉ đếm tia sáng hình học: các đóng góp nhiễu xạ phải được chồng chất.')]
        ],[e('geometry','zones','Chia đới theo quang lộ','address'),e('zones','aperture','Xác định số đới mở','address'),e('zones','disk','Xác định đới bị che','address'),e('aperture','observation','Tổng phần sóng truyền qua'),e('disk','observation','Sóng quanh mép chắn')]),
        v('fraunhofer','Khe hẹp và cách tử','Cộng sóng từ các phần của khe hoặc nhiều khe để suy ra hướng cực tiểu và cực đại.',[
          [n('wave','Sóng tới','Bước sóng λ',f(11,12),'Trong nhiễu xạ Fraunhofer, dùng chùm tới gần song song và xét các hướng quan sát ở xa hoặc tại mặt phẳng tiêu của thấu kính.')],
          [n('slit','Một khe hẹp','Bề rộng b',f(11),'Sóng từ các phần khác nhau trong khe giao thoa. Cực tiểu thỏa $b\\sin\\varphi=k\\lambda$, với k là số nguyên khác 0.'),
           n('grating','Cách tử nhiều khe','Chu kỳ d',f(12),'Sóng từ các khe cộng pha ở các hướng $d\\sin\\varphi=k\\lambda$, tạo cực đại chính; d là khoảng cách giữa hai khe kế tiếp.')],
          [n('minima','Cực tiểu và cực đại giữa','Mẫu nhiễu xạ khe đơn',f(11),'Hai cực tiểu đầu k = ±1 giới hạn cực đại giữa. Trên mặt phẳng tiêu, gần đúng góc nhỏ cho bề rộng $2f\\lambda/b$.'),
           n('orders','Bậc cực đại cách tử','Giới hạn bởi |sin φ| ≤ 1',f(12),'Các bậc có thể có phải thỏa $|k|\\le d/\\lambda$. Cường độ thực còn chịu bao nhiễu xạ khe đơn; bậc thỏa điều kiện hình học có thể bị khuyết.')]
        ],[e('wave','slit','Chiếu sáng khe'),e('wave','grating','Chiếu sáng cách tử'),e('slit','minima','Cộng sóng trong khe','address'),e('grating','orders','Cộng pha giữa các khe','address'),e('minima','orders','Bao nhiễu xạ, bậc khuyết','control')]),
        v('polarization','Phân cực và cường độ','Theo dõi ánh sáng qua hai kính phân cực; Brewster là một cách tạo phân cực bằng phản xạ.',[
          [n('natural','Ánh sáng tự nhiên','Cường độ Iₜₙ',f(15,16),'Hướng dao động điện trường phân bố trong mặt phẳng vuông góc phương truyền. Qua kính phân cực lý tưởng đầu tiên, cường độ giảm còn một nửa.'),
           n('brewster','Phản xạ Brewster','Góc iB và chiết suất',f(14),'Với môi trường điện môi trong điều kiện của bài học, $\\tan i_B=n_2/n_1$. Tia phản xạ phân cực thẳng và vuông góc tia khúc xạ.'),
           n('birefringence','Lưỡng chiết','Tia thường và tia bất thường',[[2,13]],'Tinh thể lưỡng chiết có thể tách chùm tới thành tia thường và tia bất thường. Hai tia có tính chất phân cực khác nhau; không đồng nhất hiện tượng này với việc giảm cường độ qua kính phân tích.')],
          [n('polarizer','Kính phân cực thứ nhất','Tạo ánh sáng phân cực thẳng',f(15),'Giữ thành phần điện trường theo quang trục. Với ánh sáng tự nhiên tới: $I_1=I_{\\mathrm{tn}}/2$.'),
           n('polarized','Chùm phân cực thẳng','Hướng dao động xác định',f(13,14),'Cường độ I₀ của chùm phân cực đi vào kính phân tích là đại lượng đầu vào của định luật Malus; cần phân biệt với cường độ ánh sáng tự nhiên ban đầu.')],
          [n('analyzer','Kính phân tích','Quang trục lệch góc α',f(13,16),'Kính thứ hai chọn thành phần theo quang trục của nó. Góc α là góc giữa hướng phân cực tới và trục kính phân tích.'),
           n('intensity','Cường độ truyền qua','Định luật Malus',f(13,16),'$I=I_0\\cos^2\\alpha$. Với hệ hai kính và ánh sáng tự nhiên đầu vào: $I=(I_{\\mathrm{tn}}/2)\\cos^2\\alpha$. Hai trục vuông góc cho I = 0 trong mô hình lý tưởng.')]
        ],[e('natural','polarizer','Truyền qua kính 1'),e('polarizer','polarized','I₁ = Iₜₙ / 2'),e('brewster','polarized','Tia phản xạ phân cực'),e('birefringence','polarized','Tạo các tia phân cực'),e('polarized','analyzer','Đưa vào kính 2'),e('analyzer','intensity','Chiếu theo trục','address')])]},
      3:{views:[
        v('thermal','Bức xạ nhiệt và lượng tử','Nhiệt độ chi phối công suất và vị trí đỉnh phổ của vật đen; năng lượng bức xạ được trao đổi theo lượng tử.',[
          [n('temperature','Nhiệt độ tuyệt đối T','Đơn vị kelvin',f(0,1),'Dùng nhiệt độ tuyệt đối trong các định luật bức xạ vật đen. Tăng T làm tăng phát xạ toàn phần và chuyển đỉnh phổ về bước sóng ngắn hơn.')],
          [n('power','Phát xạ toàn phần','Stefan – Boltzmann',f(0),'Vật đen lý tưởng có suất phát xạ $R=\\sigma T^4$. R là công suất phát trên một đơn vị diện tích, không phải bước sóng đỉnh.'),
           n('peak','Đỉnh phổ bức xạ','Định luật Wien',f(1),'Bước sóng tại đỉnh phổ theo bước sóng thỏa $\\lambda_m T=b$. Nhiệt độ tăng k lần thì bước sóng đỉnh giảm k lần.')],
          [n('photon','Photon','Năng lượng và động lượng',f(2),'Một photon có $\\varepsilon=h\\nu=hc/\\lambda$ và $p=h/\\lambda$. Bước sóng ngắn hơn tương ứng năng lượng mỗi photon lớn hơn.')]
        ],[e('temperature','power','Tính tổng phát xạ','address'),e('temperature','peak','Tìm bước sóng đỉnh','address'),e('peak','photon','Năng lượng photon tại λₘ','address')]),
        v('photon','Quang điện và Compton','Photon truyền năng lượng trong quang điện; trong Compton, photon tán xạ truyền cả năng lượng và động lượng cho electron.',[
          [n('incident','Photon tới','ε = hν, p = h/λ',f(2),'Năng lượng và động lượng của photon là dữ liệu chung cho hai hiện tượng, nhưng cơ chế tương tác khác nhau.')],
          [n('metal','Quang điện ngoài','Kim loại có công thoát A',f(3),'Electron hấp thụ photon. Điều kiện phát electron là $h\\nu\\ge A$; phần năng lượng vượt công thoát thành động năng cực đại.'),
           n('collision','Tán xạ Compton','Photon và electron',f(4,5),'Tương tác với electron gần tự do được xét bằng bảo toàn năng lượng và động lượng. Photon đổi hướng và tăng bước sóng.')],
          [n('photoelectron','Electron quang điện','Kmax và hiệu điện thế hãm',f(3),'$K_{\\max}=h\\nu-A=eU_h$. Hiệu điện thế hãm xác định động năng cực đại; tần số và công thoát quyết định giá trị này.'),
           n('scattered','Photon tán xạ','λ′ phụ thuộc góc θ',f(4),'$\\lambda^{\\prime}-\\lambda=\\lambda_c(1-\\cos\\theta)$. Độ tăng lớn nhất là $2\\lambda_c$ khi θ = 180°.'),
           n('recoil','Electron giật lùi','Nhận năng lượng từ photon',f(5),'Trong mô hình electron ban đầu đứng yên, $K_e=hc(1/\\lambda-1/\\lambda^{\\prime})$. Năng lượng photon giảm được chuyển cho electron.')]
        ],[e('incident','metal','Hấp thụ photon'),e('incident','collision','Tương tác tán xạ'),e('metal','photoelectron','Trừ công thoát','address'),e('collision','scattered','Bảo toàn, đổi hướng','address'),e('collision','recoil','Truyền năng lượng'),e('scattered','recoil','Suy ra phần năng lượng giảm','address')])]},
      4:{views:[v('quantum','Hàm sóng và giếng thế','Điều kiện biên của giếng xác định trạng thái lượng tử; hàm sóng cho mật độ và xác suất tìm hạt.',[
        [n('momentum','Động lượng hạt','Lưỡng tính sóng – hạt',f(0),'Sóng De Broglie có $\\lambda=h/p$. Công thức $p=mv$ hoặc $p=\\sqrt{2mK}$ chỉ dùng trong chế độ phi tương đối tính.'),
         n('well','Giếng thế vô hạn','Bề rộng a và điều kiện biên',f(2,3),'Hạt bị giới hạn trong 0 đến a; hàm sóng bằng 0 tại hai thành giếng và ngoài giếng. Điều kiện biên chỉ cho các trạng thái nhất định.')],
        [n('state','Trạng thái n','n = 1, 2, 3, …',f(2,3),'Trong giếng một chiều, $E_n=n^2h^2/(8ma^2)$ và $\\psi_n=\\sqrt{2/a}\\sin(n\\pi x/a)$. Năng lượng và hàm sóng cùng thuộc một trạng thái.'),
         n('uncertainty','Bất định vị trí – động lượng','Δx Δpₓ ≥ ℏ/2',f(1),'Độ phân tán vị trí và động lượng của trạng thái không thể đồng thời nhỏ tùy ý. Đây không chỉ là sai số của thiết bị đo.')],
        [n('density','Mật độ xác suất','|ψ(x)|²',f(4),'Bình phương độ lớn hàm sóng là mật độ xác suất. Hàm sóng chuẩn hóa cho tổng xác suất trên toàn miền bằng 1.'),
         n('probability','Xác suất trong khoảng','Tích phân trên vùng xét',f(4),'Xác suất tìm hạt trong [x₁,x₂] là $\\int_{x_1}^{x_2}|\\psi(x)|^2dx$. Mật độ tại một điểm khác với xác suất trong một khoảng.')]
      ],[e('momentum','state','Liên hệ tính chất sóng'),e('well','state','Chọn nghiệm theo biên','control'),e('state','density','Lấy bình phương độ lớn','address'),e('density','probability','Tích phân theo vị trí','address'),e('uncertainty','state','Ràng buộc các phân tán','control')])]},
      5:{views:[v('hydrogen','Chuyển mức và quang phổ Hydro','Chọn mức đầu và mức cuối, lấy độ chênh năng lượng rồi suy ra photon và dãy quang phổ.',[
        [n('levels','Mức năng lượng Hydro','En = −13,6 / n² eV',f(0),'Mẫu Bo cho các mức liên kết n = 1, 2, 3,…; mức càng cao càng gần 0. Năng lượng liên kết âm, còn năng lượng photon là độ chênh dương.'),
         n('transition','Chuyển mức n → m','Phát xạ khi n > m',f(0,1),'Khi electron chuyển xuống mức thấp hơn, nguyên tử phát photon. Chuyển lên mức cao hơn cần hấp thụ năng lượng thích hợp.')],
        [n('photon','Photon phát ra','ε = En − Em = hc/λ',f(1),'Độ chênh năng lượng giữa hai mức xác định tần số và bước sóng phát xạ. Với n > m: $1/\\lambda=R_H(1/m^2-1/n^2)$.')],
        [n('lyman','Lyman','Mức cuối m = 1',f(1),'Các chuyển mức về n = 1 thuộc dãy Lyman, ở vùng tử ngoại.'),
         n('balmer','Balmer','Mức cuối m = 2',f(1),'Các chuyển mức về n = 2 thuộc dãy Balmer. Các vạch đầu nằm trong vùng khả kiến; giới hạn dãy ở tử ngoại gần.'),
         n('paschen','Paschen','Mức cuối m = 3',f(1),'Các chuyển mức về n = 3 thuộc dãy Paschen, ở vùng hồng ngoại.')]
      ],[e('levels','transition','Chọn hai mức','address'),e('transition','photon','Độ chênh năng lượng','address'),e('photon','lyman','m = 1','control'),e('photon','balmer','m = 2','control'),e('photon','paschen','m = 3','control')])]},
      6:{views:[v('nucleus','Liên kết và phóng xạ','Khối lượng cho năng lượng liên kết; số hạt chưa phân rã và hằng số phân rã cho hoạt độ theo thời gian.',[
        [n('composition','Thành phần hạt nhân','Z proton, A − Z neutron',f(0),'So sánh khối lượng các nucleon tự do với khối lượng hạt nhân. Khi dùng khối lượng nguyên tử phải xử lý nhất quán phần electron.'),
         n('initial','Mẫu phóng xạ ban đầu','N₀ và hằng số λ',f(1),'N₀ là số hạt chưa phân rã ban đầu. λ là xác suất phân rã trên một đơn vị thời gian trong mô hình phân rã mũ.')],
        [n('defect','Độ hụt khối Δm','Nucleon tự do − hạt nhân',f(0),'$\\Delta m=Zm_p+(A-Z)m_n-m_X$. Khối lượng liên kết nhỏ hơn tổng khối lượng các nucleon tự do.'),
         n('remaining','Số hạt còn lại N(t)','N₀ exp(−λt)',f(1),'$N(t)=N_0e^{-\\lambda t}=N_0 2^{-t/T}$, với $T=\\ln 2/\\lambda$. T là chu kỳ bán rã, không phải thời gian tất cả các hạt phân rã.')],
        [n('binding','Năng lượng liên kết','Elk = Δm c²',f(0),'Năng lượng cần để tách hạt nhân thành các nucleon tự do; năng lượng liên kết riêng $E_{\\mathrm{lk}}/A$ dùng để so sánh mức liên kết trên một nucleon.'),
         n('activity','Hoạt độ H(t)','Số phân rã mỗi giây',f(1),'$H(t)=\\lambda N(t)$. Hoạt độ giảm cùng quy luật mũ với N khi λ không đổi; đơn vị Bq tương ứng một phân rã mỗi giây.')]
      ],[e('composition','defect','So sánh khối lượng','address'),e('defect','binding','Nhân c²','address'),e('initial','remaining','Áp dụng phân rã mũ','address'),e('remaining','activity','Nhân λ','address'),e('composition','initial','Hạt nhân của mẫu')])]} 
    }),
    xstk:subject('Xác suất thống kê','📊',['Dữ liệu / kết quả','Phương pháp','Điều kiện'],{
      chap1:{views:[v('events','Từ phép thử đến xác suất','Xác định không gian mẫu và biến cố, kiểm tra mô hình rồi chọn cách đếm hoặc độ đo phù hợp.',[
        [n('experiment','Phép thử ngẫu nhiên','Một lần thực hiện phép thử',[[0,0]],'Phép thử có các kết quả chưa biết trước. Phải xác định rõ đối tượng, cách chọn và một kết quả sơ cấp là gì.')],
        [n('omega','Không gian mẫu Ω','Tập tất cả kết quả',f(1),'Không gian mẫu gồm các kết quả có thể xảy ra. Trong mô hình hữu hạn cổ điển, các kết quả sơ cấp phải đồng khả năng.'),
         n('event','Biến cố A','Tập kết quả thuận lợi',f(2),'Biến cố là tập con của Ω. Biến cố đối lập gồm những kết quả ngoài A; hai biến cố xung khắc không thể cùng xảy ra.')],
        [n('count','Đếm kết quả','Hoán vị • Chỉnh hợp • Tổ hợp',f(0),'Có thứ tự hay không, có lặp hay không quyết định cách đếm. $P_n=n!$, $A_n^k=n!/(n-k)!$, $C_n^k=n!/[k!(n-k)!]$ áp dụng với điều kiện tương ứng.'),
         n('measure','Độ đo hình học','Độ dài • Diện tích • Thể tích',f(3),'Dùng tỉ số độ đo khi lựa chọn đều theo độ dài, diện tích hoặc thể tích. Không áp dụng chỉ vì bài có hình vẽ.'),
         n('frequency','Tần suất qua nhiều lần thử','Số lần A xảy ra / số lần thử',[[0,0]],'Tần suất quan sát dùng để ước lượng xác suất qua nhiều lần thử. Một tần suất của mẫu hữu hạn không nhất thiết bằng xác suất lý thuyết.')],
        [n('probability','Xác suất P(A)','Đo mức độ xảy ra biến cố',f(1,2,3),'Hữu hạn đồng khả năng: $P(A)=|A|/|\\Omega|$. Hình học đều: tỉ số độ đo vùng thuận lợi và vùng có thể. Biến cố đối lập: $P(\\overline A)=1-P(A)$.')]
      ],[e('experiment','omega','Xác định kết quả'),e('omega','event','Chọn tập thuận lợi'),e('omega','count','Hữu hạn, đồng khả năng','control'),e('event','count','Đếm số thuận lợi','address'),e('omega','measure','Lựa chọn đều hình học','control'),e('event','measure','Xác định vùng thuận lợi','address'),e('event','frequency','Quan sát lặp lại','address'),e('count','probability','Lấy tỉ số số lượng','address'),e('measure','probability','Lấy tỉ số độ đo','address'),e('frequency','probability','Ước lượng từ dữ liệu','address')])]},
      chap2:{views:[
        v('bayes','Điều kiện, xác suất đầy đủ và Bayes','Hệ đầy đủ chia bài toán thành các nguồn; xác suất đầy đủ tính biến cố, Bayes dùng biến cố đã quan sát để suy ngược nguồn.',[
          [n('partition','Hệ đầy đủ H₁,…,Hₖ','Rời nhau và phủ Ω',f(2,3),'Các Hᵢ đôi một xung khắc và hợp lại thành Ω. Mỗi Hᵢ biểu thị một nguồn, nhóm hoặc trường hợp của bài toán.'),
           n('conditional','Xác suất có điều kiện','P(A | Hᵢ)',f(1),'Xác suất A khi biết nguồn Hᵢ; cần P(Hᵢ) > 0. Công thức nhân cho $P(A\\cap H_i)=P(H_i)P(A|H_i)$.')],
          [n('joint','Xác suất đồng thời','P(A ∩ Hᵢ)',f(1),'Nhân xác suất chọn nguồn với xác suất A trong nguồn đó. Không tự thay P(A|Hᵢ) bằng P(A) khi chưa có độc lập.'),
           n('union','Công thức cộng','Hợp các biến cố',f(0),'$P(A\\cup B)=P(A)+P(B)-P(A\\cap B)$. Nếu xung khắc, phần giao bằng 0; đây là cơ sở cộng các nhánh trong hệ đầy đủ.')],
          [n('total','Xác suất đầy đủ P(A)','Cộng các nhánh nguồn',f(2),'$P(A)=\\sum_i P(H_i)P(A|H_i)$. Các nhánh A ∩ Hᵢ rời nhau nên có thể cộng xác suất của chúng.')],
          [n('posterior','Bayes: P(Hᵢ | A)','Suy nguồn khi đã biết A',f(3),'Khi P(A) > 0, $P(H_i|A)=P(H_i)P(A|H_i)/P(A)$. Tử số là nhánh i; mẫu số là tổng tất cả nhánh tạo ra A.')]
        ],[e('partition','joint','Xác suất nguồn'),e('conditional','joint','Nhân theo điều kiện','address'),e('joint','total','Cộng các nhánh','address'),e('union','total','Nhánh rời nhau','control'),e('joint','posterior','Tử số nhánh i'),e('total','posterior','Chuẩn hóa bằng P(A)','address')]),
        v('bernoulli','Dãy phép thử Bernoulli','Các điều kiện tạo nên mô hình nhị thức; đếm số cách bố trí thành công rồi nhân xác suất mỗi cách.',[
          [n('trial','Một phép thử','Thành công p, thất bại 1 − p',f(4),'Mỗi phép thử có hai kết quả được quy về thành công hoặc thất bại.'),
           n('conditions','Điều kiện của dãy','Độc lập • Cùng p • n cố định',f(4),'Mô hình Bernoulli lặp yêu cầu n phép thử độc lập và xác suất thành công p không đổi. Lấy không hoàn lại từ tập hữu hạn thường không thỏa điều kiện này.')],
          [n('count','X: số lần thành công','X = 0,…,n',f(4),'X đếm số lần thành công trong n phép thử. Một cấu hình có k thành công có xác suất $p^k(1-p)^{n-k}$.'),
           n('ways','Số cách bố trí k thành công','Chọn k vị trí trong n',f(4),'Có $C_n^k$ cách chọn vị trí cho k thành công; các cấu hình này rời nhau nên cộng được xác suất.')],
          [n('binomial','P(X = k)','Công thức Bernoulli',f(4),'$P(X=k)=C_n^k p^k(1-p)^{n-k}$. X có phân phối nhị thức B(n,p), với kỳ vọng np và phương sai np(1−p).')]
        ],[e('trial','count','Lặp và đếm'),e('conditions','count','Cho phép mô hình','control'),e('count','binomial','Xác suất một cấu hình'),e('ways','binomial','Nhân số cấu hình','address')])]},
      chap3:{views:[v('discrete','Mô hình rời rạc và đặc trưng','Điều kiện lấy mẫu quyết định phân phối; bảng xác suất của mô hình cho phép tính kỳ vọng và phương sai.',[
        [n('situation','Tình huống và đại lượng X','Đếm số lần hoặc số phần tử',[[0,0]],'X gán giá trị số cho kết quả ngẫu nhiên. Trước khi chọn phân phối, xác định cách thử/lấy mẫu và ý nghĩa của X.')],
        [n('binomial','Nhị thức B(n,p)','n phép thử độc lập, cùng p',f(1),'Đếm số thành công trong n phép thử Bernoulli. $E(X)=np$, $V(X)=np(1-p)$. Phân phối 0–1 là trường hợp n = 1.'),
         n('hyper','Siêu bội H(N,M,n)','Lấy không hoàn lại',f(3),'Lấy n phần tử từ N phần tử, trong đó M mang dấu hiệu. $P(X=k)=C_M^k C_{N-M}^{n-k}/C_N^n$. Các lần lấy không độc lập.'),
         n('poisson','Poisson P(λ)','Đếm sự kiện theo mô hình Poisson',f(2),'$P(X=k)=\\lambda^k e^{-\\lambda}/k!$, $E(X)=V(X)=\\lambda$. Dùng khi cơ chế sự kiện phù hợp; xấp xỉ nhị thức khi n lớn, p nhỏ và λ = np.')],
        [n('table','Bảng xác suất (xᵢ,pᵢ)','pᵢ ≥ 0, tổng pᵢ = 1',f(0),'Liệt kê các giá trị và xác suất của X hoặc tính chúng từ mô hình. Bảng hợp lệ phải có xác suất không âm và tổng bằng 1.'),
         n('cdf','Hàm phân phối F(x)','Cộng xác suất tới x',[[0,0]],'$F(x)=P(X\\le x)=\\sum_{x_i\\le x}p_i$. Với X rời rạc, F là hàm bậc thang; điểm nhảy mang xác suất tại giá trị đó.')],
        [n('moments','Kỳ vọng, phương sai, độ lệch chuẩn','Trung tâm và mức phân tán',f(0),'$E(X)=\\sum x_ip_i$, $V(X)=\\sum x_i^2p_i-[E(X)]^2$ và $\\sigma=\\sqrt{V(X)}$. Phương sai không âm khi bảng xác suất hợp lệ.')]
      ],[e('situation','binomial','Độc lập và cùng p','control'),e('situation','hyper','Không hoàn lại','control'),e('situation','poisson','Cơ chế đếm phù hợp','control'),e('binomial','table','Tính các xác suất','address'),e('hyper','table','Tính các xác suất','address'),e('poisson','table','Tính các xác suất','address'),e('table','cdf','Cộng tích lũy','address'),e('table','moments','Tính tổng có trọng số','address')])]},
      chap4:{views:[v('continuous','Mật độ, phân phối và chuẩn hóa','Mô hình cho hàm mật độ; tích phân cho hàm phân phối, xác suất trong khoảng và các đặc trưng.',[
        [n('model','Chọn mô hình liên tục','Đều • Mũ • Chuẩn',f(2,4),'Đều dùng mật độ hằng trên một khoảng; mũ mô tả thời gian chờ theo mô hình phù hợp; chuẩn có dạng chuông đối xứng quanh μ.')],
        [n('density','Mật độ f(x)','Không âm, tích phân bằng 1',f(0),'f(x) là mật độ, không phải xác suất tại điểm. Với X liên tục, P(X=c)=0; xác suất của một vùng là diện tích dưới mật độ.'),
         n('standard','Chuẩn hóa Z','Z = (X − μ) / σ',f(2,3),'Nếu X có phân phối chuẩn N(μ,σ²) thì Z có phân phối chuẩn tắc N(0,1). Cần dùng độ lệch chuẩn σ, không đưa σ² vào mẫu số.')],
        [n('cdf','Hàm phân phối F(x)','Tích phân từ −∞ tới x',f(0),'$F(x)=\\int_{-\\infty}^{x}f(t)dt$. Tại điểm khả vi, f = F′. F tăng và có giá trị từ 0 đến 1.'),
         n('moments','Kỳ vọng và phương sai','Tích phân có trọng số',f(1,4),'$E(X)=\\int xf(x)dx$ và $V(X)=\\int x^2f(x)dx-[E(X)]^2$, khi các tích phân tồn tại. Đối xứng không tự bảo đảm có duy nhất một mốt.')],
        [n('interval','Xác suất trong khoảng','F(b) − F(a)',f(0,2,3),'$P(a\\le X\\le b)=F(b)-F(a)$. Với chuẩn, quy về Φ((b−μ)/σ)−Φ((a−μ)/σ), trong đó Φ ở sơ đồ này là CDF chuẩn tắc. Quy tắc 3σ cho khoảng 99,73% chỉ áp dụng cho phân phối chuẩn.')]
      ],[e('model','density','Xác định f','address'),e('model','standard','Nếu mô hình chuẩn','control'),e('density','cdf','Tích phân tích lũy','address'),e('density','moments','Tích phân đặc trưng','address'),e('cdf','interval','Lấy hiệu tại hai cận','address'),e('standard','interval','Tra Φ hoặc tính CDF','address')])]},
      chap5:{views:[v('joint','Phân phối hai chiều','Từ bảng đồng thời suy ra biên, điều kiện, tính độc lập và mức tương quan tuyến tính.',[
        [n('joint','Bảng đồng thời pᵢⱼ','P(X = xᵢ, Y = yⱼ)',f(0),'Mỗi ô là xác suất cặp giá trị. Tổng tất cả ô bằng 1; xác suất biên nhận được bằng cộng theo hàng hoặc cột.')],
        [n('marginal','Phân phối biên','pᵢ = Σⱼpᵢⱼ, qⱼ = Σᵢpᵢⱼ',f(0),'Cộng các ô tương ứng để lấy phân phối của X hoặc Y riêng lẻ. Từ biên có thể tính kỳ vọng và phương sai từng biến.'),
         n('conditional','Phân phối điều kiện','Chia cho xác suất đã biết',[[0,0]],'Ví dụ $P(X=x_i|Y=y_j)=p_{ij}/q_j$ khi qⱼ > 0. Trong phân phối điều kiện, tổng xác suất của các giá trị có thể vẫn bằng 1.')],
        [n('independent','Kiểm tra độc lập','pᵢⱼ = pᵢqⱼ với mọi ô',f(1),'Một ô không bằng tích xác suất biên đủ để kết luận phụ thuộc. Muốn kết luận độc lập phải thỏa với mọi ô, không chỉ một ô.'),
         n('covariance','Hiệp phương sai','Cov = E(XY) − E(X)E(Y)',f(2),'Tính E(XY) từ bảng đồng thời và E(X), E(Y) từ biên. Độc lập kéo theo Cov = 0 khi các moment tồn tại; chiều ngược lại không đúng nói chung.')],
        [n('correlation','Tương quan tuyến tính ρ','Chuẩn hóa hiệp phương sai',f(3),'$\\rho=\\operatorname{Cov}(X,Y)/(\\sigma_X\\sigma_Y)$ khi hai độ lệch chuẩn dương. ρ = 0 là không tương quan tuyến tính, không tự chứng minh độc lập.')]
      ],[e('joint','marginal','Cộng hàng / cột','address'),e('joint','conditional','Lấy xác suất ô'),e('marginal','conditional','Mẫu số điều kiện','address'),e('joint','independent','Đối chiếu tất cả ô','address'),e('marginal','independent','Tích các biên','address'),e('joint','covariance','Tính E(XY)','address'),e('marginal','covariance','Tính E(X), E(Y)','address'),e('covariance','correlation','Chia độ lệch chuẩn','address'),e('independent','covariance','Độc lập ⇒ Cov = 0','control')])]},
      chap6:{views:[v('sample','Từ tổng thể đến thống kê mẫu','Lấy mẫu, lập dữ liệu và tính thống kê. Phân phối của thống kê cần giả định về tổng thể hoặc xấp xỉ mẫu lớn.',[
        [n('population','Tổng thể','Tham số μ, σ², p',[[0,0]],'Tổng thể là đối tượng cần suy luận. Các tham số chưa biết được nghiên cứu thông qua mẫu ngẫu nhiên phù hợp.'),
         n('assumptions','Giả định lấy mẫu','Độc lập và điều kiện phân phối',f(3),'Các kết quả chuẩn/t chính xác cho trung bình dựa trên mẫu độc lập từ tổng thể chuẩn. Với tổng thể khác, có thể dùng xấp xỉ khi điều kiện định lý giới hạn trung tâm phù hợp.')],
        [n('sample','Mẫu và bảng tần số','n = Σ nᵢ',f(0,1),'Dữ liệu có thể ở dạng từng quan sát hoặc bảng giá trị xᵢ, tần số nᵢ. Với khoảng lớp, dùng trung điểm làm đại diện là phép gần đúng.')],
        [n('mean','Trung bình mẫu x̄','Σ nᵢxᵢ / n',f(0),'Trung bình mẫu mô tả vị trí trung tâm và là ước lượng điểm của μ trong mô hình lấy mẫu độc lập cùng phân phối.'),
         n('variance','Phương sai hiệu chỉnh s*²','Chia cho n − 1, n > 1',f(0,1),'$s_*^2=\\sum n_i(x_i-\\bar x)^2/(n-1)$. Phân biệt với s² chia cho n; $s_*^2=n s^2/(n-1)$.'),
         n('proportion','Tỷ lệ mẫu f','m / n',f(2),'Đếm m quan sát mang dấu hiệu A trong n quan sát. Với các chỉ báo Bernoulli độc lập, E(F)=p và V(F)=p(1−p)/n.')],
        [n('distribution','Phân phối thống kê mẫu','Chuẩn, t và các phân phối liên quan',f(3),'Dưới giả định tổng thể chuẩn: biết σ dùng Z; chưa biết σ dùng t với n−1 bậc tự do. Phân phối χ² cho phương sai và F cho tỷ số phương sai cũng cần giả định thích hợp.')]
      ],[e('population','sample','Lấy mẫu ngẫu nhiên','address'),e('sample','mean','Tính trung bình','address'),e('sample','variance','Tính phân tán','address'),e('sample','proportion','Đếm dấu hiệu','address'),e('mean','distribution','Chuẩn hóa thống kê','address'),e('variance','distribution','Ước lượng độ phân tán'),e('proportion','distribution','Mô hình tỷ lệ'),e('assumptions','distribution','Bảo đảm hoặc xấp xỉ','control')])]},
      chap7:{views:[v('estimation','Xây dựng khoảng tin cậy','Tham số cần ước lượng và thông tin về độ phân tán quyết định sai số chuẩn; độ tin cậy quyết định giá trị tới hạn.',[
        [n('target','Tham số cần ước lượng','Trung bình μ • Tỷ lệ p • Phương sai σ²',[[0,0]],'Xác định đúng đại lượng cần suy luận và giả định lấy mẫu trước khi chọn công thức khoảng tin cậy.'),
         n('confidence','Độ tin cậy 1 − α','Chọn giá trị tới hạn',f(0,1,2,3),'Khoảng hai phía dùng giá trị tới hạn có phần đuôi α/2. Độ tin cậy 95% cho giá trị chuẩn khoảng 1,96; 99% khoảng 2,576.')],
        [n('known','Trung bình: σ đã biết','SE = σ / √n',f(0),'Dùng phân vị chuẩn khi tổng thể chuẩn; với tổng thể không chuẩn cần điều kiện xấp xỉ mẫu lớn phù hợp.'),
         n('unknown','Trung bình: σ chưa biết','SE ước lượng = s* / √n',f(1,2),'Với mẫu độc lập từ tổng thể chuẩn, dùng t(n−1), kể cả khi n lớn. Khi n lớn, t gần chuẩn nên công thức chuẩn với s* là phép xấp xỉ thường dùng.'),
         n('proportion','Tỷ lệ: f = m/n','SE ≈ √[f(1−f)/n]',f(3),'Khoảng chuẩn cho tỷ lệ là xấp xỉ; cần đủ số thành công và thất bại. Khi điều kiện không phù hợp, không tự dùng công thức chuẩn.')],
        [n('margin','Độ chính xác ε','Giá trị tới hạn × sai số chuẩn',f(0,1,2,3),'Bán kính khoảng bằng giá trị tới hạn nhân sai số chuẩn. Cỡ mẫu tăng làm khoảng hẹp hơn khi các yếu tố khác giữ nguyên.'),
         n('size','Cỡ mẫu dự kiến','Suy n từ ε mong muốn',f(4),'Biến đổi công thức ε để tìm n rồi làm tròn lên. Với tỷ lệ chưa có ước lượng p, dùng p(1−p) ≤ 1/4 để lập kế hoạch thận trọng.')],
        [n('interval','Khoảng cho μ hoặc p','Ước lượng điểm ± ε',f(0,1,2,3),'Khoảng được xây dựng quanh x̄ hoặc f. Độ tin cậy mô tả tần suất bao phủ của quy trình qua nhiều mẫu, không phải xác suất của tham số cố định sau khi đã có mẫu.'),
         n('variance','Khoảng cho phương sai σ²','Dùng phân phối χ²',[[0,0]],'Với mẫu độc lập từ tổng thể chuẩn, $(n-1)S_*^2/\\sigma^2$ có phân phối $\\chi^2_{n-1}$. Suy khoảng phương sai từ hai phân vị χ²; khoảng thường không đối xứng quanh s*².')]
      ],[e('target','known','Ước lượng μ, biết σ','control'),e('target','unknown','Ước lượng μ, chưa biết σ','control'),e('target','proportion','Ước lượng p','control'),e('known','margin','Sai số chuẩn'),e('unknown','margin','Sai số chuẩn ước lượng'),e('proportion','margin','Sai số chuẩn xấp xỉ'),e('confidence','margin','Phân vị tới hạn','control'),e('margin','interval','Tạo hai cận','address'),e('margin','size','Giải theo n','address'),e('target','variance','Ước lượng σ²','control'),e('confidence','variance','Hai phân vị χ²','control')])]},
      chap8:{views:[v('testing','Quy trình kiểm định giả thuyết','Chọn giả thuyết và mức ý nghĩa trước, tính thống kê phù hợp, so sánh rồi kết luận trong phạm vi bằng chứng.',[
        [n('hypotheses','Giả thuyết H₀ và H₁','H₁ quyết định một / hai phía',f(0,1,2),'H₀ đặt giá trị μ₀ hoặc p₀; H₁ thể hiện khác, lớn hơn hoặc nhỏ hơn. Chọn phía kiểm định từ câu hỏi nghiên cứu trước khi nhìn kết quả mẫu.'),
         n('alpha','Mức ý nghĩa α','Kiểm soát sai lầm loại I',[[0,0]],'Loại I là bác bỏ H₀ khi H₀ đúng; loại II là chưa bác bỏ H₀ khi H₀ sai. α xác định ngưỡng quyết định theo quy trình kiểm định.')],
        [n('data','Dữ liệu mẫu và điều kiện','x̄, s*, n hoặc f',f(0,1,2),'Kiểm tra cách lấy mẫu, thông tin σ và điều kiện chuẩn/t hoặc xấp xỉ tỷ lệ. Với kiểm định tỷ lệ, sai số chuẩn dưới H₀ dùng p₀, không dùng f.'),
         n('threshold','Miền bác bỏ hoặc p-value','Ngưỡng tương ứng với H₁',f(0,1,2,3),'Kiểm định hai phía dùng hai đuôi; một phía dùng một đuôi đúng hướng. p-value đo mức cực đoan của dữ liệu dưới H₀, không phải xác suất H₀ đúng.')],
        [n('statistic','Thống kê quan sát Z hoặc T','Độ lệch / sai số chuẩn',f(0,1,2),'Biết σ: $Z=(\\bar x-\\mu_0)/(\\sigma/\\sqrt n)$. Chưa biết σ và tổng thể chuẩn: dùng T với s* và n−1 bậc tự do. Tỷ lệ: $Z=(f-p_0)/\\sqrt{p_0(1-p_0)/n}$.'),
         n('two-means','So sánh hai trung bình','Mẫu độc lập hay ghép cặp?',[[0,0]],'Hai mẫu độc lập có thể dùng kiểm định t hai mẫu với giả định tương ứng; mẫu ghép cặp kiểm định trên các hiệu. Không dùng nguyên công thức một mẫu hoặc tự giả định hai phương sai bằng nhau.')],
        [n('reject','Bác bỏ H₀','Khi thuộc miền bác bỏ',f(3),'Nếu thống kê rơi vào miền bác bỏ, hoặc p-value < α theo quy ước của chương, bác bỏ H₀ và có bằng chứng ủng hộ hướng của H₁.'),
         n('retain','Chưa đủ cơ sở bác bỏ H₀','Không khẳng định H₀ đúng',f(3),'Nếu thống kê không thuộc miền bác bỏ, chưa đủ bằng chứng bác bỏ H₀ ở mức ý nghĩa đã chọn. Kết quả không chứng minh H₀ đúng.')]
      ],[e('hypotheses','threshold','Chọn phía kiểm định','control'),e('alpha','threshold','Chọn ngưỡng','control'),e('data','statistic','Tính thống kê','address'),e('hypotheses','statistic','Giá trị giả thuyết μ₀, p₀'),e('data','two-means','Nếu so sánh hai tổng thể','control'),e('two-means','threshold','Phân phối kiểm định phù hợp','address'),e('threshold','reject','So sánh và bác bỏ','control'),e('threshold','retain','So sánh, chưa bác bỏ','control'),e('statistic','reject','Giá trị quan sát'),e('statistic','retain','Giá trị quan sát')])]} 
    })
  };
});
