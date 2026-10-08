(function (root, factory) {
  const data = factory();
  if (typeof module === "object" && module.exports) module.exports = data;
  else root.KMA_STUDY_SCHEDULE = data;
})(typeof window === "object" ? window : globalThis, function () {
  "use strict";
  const EXAM_SCHEDULE = [
    {
      id: "ktvxl",
      dateKey: "2026-10-13",
      name: "Kỹ thuật vi xử lý",
      shortName: "Vi xử lý",
      subjectKey: "ktvxl",
      dateStr: "Thứ Ba, 13/10/2026",
      timeStr: "13h00, 14h00",
      targetDate: new Date(2026, 9, 13, 13, 0, 0),
      icon: "⚡",
      badgeBg: "#FFE600",
      badgeColor: "#000",
      themeBorder: "#F59E0B",
      duration: "60 phút (40 câu trắc nghiệm)",
      format: "Trắc nghiệm máy tính chuẩn Học viện KMA",
      notes:
        "Trọng tâm: Họ 8051/89C51, Thanh ghi SFR, Timer TMOD/TCON, Cổng P0-P3, UART SCON/SBUF, Lệnh Assembly và Sơ đồ giải mã 74LS138.",
      hasSystemSubject: true,
    },
    {
      id: "tthcm",
      dateKey: "2026-10-19",
      name: "Tư tưởng Hồ Chí Minh",
      shortName: "Tư tưởng HCM",
      subjectKey: "tthcm",
      dateStr: "Thứ Hai, 19/10/2026",
      timeStr: "13h00, 15h00",
      targetDate: new Date(2026, 9, 19, 13, 0, 0),
      icon: "📕",
      badgeBg: "#EF4444",
      badgeColor: "#FFF",
      themeBorder: "#DC2626",
      duration: "90 - 120 phút",
      format: "Trắc nghiệm lý luận chính trị chuẩn KMA",
      notes:
        "Trọng tâm: Cơ sở hình thành tư tưởng, Vấn đề dân tộc & cách mạng giải phóng dân tộc, CNXH và con đường quá độ, Đại đoàn kết, Đạo đức cách mạng.",
      hasSystemSubject: true,
    },
    {
      id: "vldc",
      dateKey: "2026-10-21",
      name: "Vật lý đại cương 2",
      shortName: "Vật lý ĐC 2",
      subjectKey: "vldc",
      dateStr: "Thứ Tư, 21/10/2026",
      timeStr: "7h00, 8h00, 9h00",
      targetDate: new Date(2026, 9, 21, 7, 0, 0),
      icon: "⚛️",
      badgeBg: "#3B82F6",
      badgeColor: "#FFF",
      themeBorder: "#2563EB",
      duration: "60 phút (40 câu)",
      format: "Trắc nghiệm Quang học sóng & Vật lý lượng tử",
      notes:
        "Trọng tâm: Giao thoa 2 khe Young & bản mỏng chắn khe, Giao thoa nêm không khí / vân tròn Newton, Nhiễu xạ Fraunhofer & cách tử, Hiệu ứng quang điện ngoài, Tán xạ Compton, Hạt trong giếng thế 1D, Định luật Malus.",
      hasSystemSubject: true,
    },
    {
      id: "gdtc",
      dateKey: "2026-10-22",
      name: "Giáo dục thể chất 3",
      shortName: "GDTC 3",
      subjectKey: "gdtc",
      dateStr: "Thứ Năm, 22/10/2026",
      timeStr: "7h00 sáng",
      targetDate: new Date(2026, 9, 22, 7, 0, 0),
      icon: "🏃",
      badgeBg: "#10B981",
      badgeColor: "#FFF",
      themeBorder: "#059669",
      duration: "Theo ca thi thực hành",
      format: "Kiểm tra thể lực & kỹ thuật thực hành",
      notes:
        "Chuẩn bị trang phục thể thao nghiêm túc, giày chạy đạt chuẩn, mang theo thẻ sinh viên và khởi động kỹ 15 phút trước giờ thi.",
      hasSystemSubject: false,
    },
    {
      id: "xstk",
      dateKey: "2026-10-23",
      name: "Toán xác suất thống kê",
      shortName: "Xác suất thống kê",
      subjectKey: "xstk",
      dateStr: "Thứ Sáu, 23/10/2026",
      timeStr: "13h00, 15h00",
      targetDate: new Date(2026, 9, 23, 13, 0, 0),
      icon: "🎲",
      badgeBg: "#059669",
      badgeColor: "#FFF",
      themeBorder: "#047857",
      duration: "90 phút (Làm bài Tự luận trên giấy thi)",
      format: "TỰ LUẬN (Được sử dụng Casio fx-580VNX & bảng tra thống kê)",
      notes:
        "HÌNH THỨC: TỰ LUẬN. Được mang máy tính Casio fx-580VNX, bảng tra phân phối chuẩn Φ(u) & phân phối Student. Trọng tâm: Công thức xác suất đầy đủ - Bayes, Bernoulli, Biến ngẫu nhiên rời rạc & liên tục, Ước lượng khoảng tin cậy, Bài toán kiểm định giả thuyết thống kê.",
      hasSystemSubject: true,
    },
  ];

  // Shared subject palette for the timer and monthly calendar.
  const STUDY_SUBJECTS = [
    {
      key: "ktvxl",
      name: "Kỹ thuật vi xử lý",
      icon: "⚡",
      color: "#FFE600",
      textColor: "#000",
    },
    {
      key: "tthcm",
      name: "Tư tưởng Hồ Chí Minh",
      icon: "📕",
      color: "#EF4444",
      textColor: "#FFF",
    },
    {
      key: "vldc",
      name: "Vật lý đại cương 2",
      icon: "⚛️",
      color: "#3B82F6",
      textColor: "#FFF",
    },
    {
      key: "xstk",
      name: "Toán xác suất thống kê",
      icon: "🎲",
      color: "#8B5CF6",
      textColor: "#FFF",
    },
    {
      key: "gdtc",
      name: "Giáo dục thể chất 3",
      icon: "🏃",
      color: "#10B981",
      textColor: "#FFF",
    },
    {
      key: "other",
      name: "Môn khác & Tự học",
      icon: "📚",
      color: "#FF8A3D",
      textColor: "#000",
    },
  ];

  return Object.freeze({
    exams: Object.freeze(EXAM_SCHEDULE.map(Object.freeze)),
    subjects: Object.freeze(STUDY_SUBJECTS.map(Object.freeze)),
  });
});
