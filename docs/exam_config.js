// Shared exam definitions for the static application and its regression checks.
(function(root) {
  'use strict';

  const subjects = {
    ktvxl: { name: 'Kỹ thuật Vi xử lý', minutes: 60 },
    tthcm: { name: 'Tư tưởng Hồ Chí Minh', minutes: 40 },
    vldc: { name: 'Vật lý đại cương', minutes: 45 }
  };

  const sources = {
    tthcm: [
      ['TTHCM_FULL_A', 'ĐỀ GỐC', 'Ngân hàng đề gốc (Full ĐA A)', 40],
      ['TTHCM_DE_132', 'MÃ ĐỀ 132', 'Bộ câu hỏi mã đề 132', 40],
      ['TTHCM_DE_651', 'MÃ ĐỀ 651', 'Đề thi mẫu 651 KTMM'],
      ['TTHCM_DE_CUONG', 'ĐỀ CƯƠNG', 'Đề cương ATTT KMA 2019', 40]
    ],
    vldc: [
      ['NOTION_DE_CUOI', 'ĐỀ TEST CUỐI', 'Đề Test Cuối (Notion)'],
      ['NOTION_TEST_100', 'TEST 100 CÂU', 'Đề Test 100 Câu (bản trích)'],
      ['NOTION_GIAK_2025', 'GIỮA KỲ 2025', 'Đề giữa kỳ 2025'],
      ['NOTION_DE_CUONG', 'ĐỀ CƯƠNG A2', 'Đề cương ôn tập A2'],
      ['VLDC_STANDARD', 'NGÂN HÀNG', 'Ngân hàng bài tập Vật lý', 40]
    ]
  };

  function shuffle(items, random = Math.random) {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  function chapterOf(q) {
    return Number(q.chapter_id || q.chapter) || 1;
  }

  // Round-robin sampling covers every available chapter without repeating IDs.
  function sampleChapters(items, count, random = Math.random) {
    const groups = new Map();
    for (const q of items) {
      const chapter = chapterOf(q);
      if (!groups.has(chapter)) groups.set(chapter, []);
      groups.get(chapter).push(q);
    }
    const buckets = [...groups.values()].map(group => shuffle(group, random));
    const result = [];
    while (result.length < count && buckets.some(bucket => bucket.length)) {
      for (const bucket of buckets) {
        if (bucket.length && result.length < count) result.push(bucket.pop());
      }
    }
    return shuffle(result, random);
  }

  function sourceQuestions(subject, questions, code) {
    return questions.filter(q => subject === 'ktvxl'
      ? q.exam_id === `DE_${code.padStart(3, '0')}`
      : q.source === code).sort((a, b) => Number(a.num) - Number(b.num));
  }

  function catalog(subject, questions) {
    if (!subjects[subject]) return [];
    const definitions = subject === 'ktvxl'
      ? [1, 2, 3, 4, 5].map(n => [String(n), `ĐỀ ${String(n).padStart(3, '0')}`, `Đề kiểm tra ${String(n).padStart(3, '0')}`])
      : sources[subject];
    const exams = definitions.map(([code, badge, title, limit]) => {
      const available = sourceQuestions(subject, questions, code).length;
      const count = Math.min(limit || available, available);
      return {
        code, badge, title, count, available,
        description: available > count
          ? `${count} câu đầu trong nguồn ${available} câu • Giữ nguyên thứ tự`
          : `${count} câu trong dữ liệu hiện có • Giữ nguyên thứ tự`
      };
    });
    if (subject === 'vldc') {
      for (const [code, title, chapters] of [
        ['VLDC_OPTICS', 'Chuyên đề Dao động & Quang học sóng', [1, 2]],
        ['VLDC_QUANTUM', 'Chuyên đề Lượng tử, Nguyên tử & Hạt nhân', [3, 4, 5, 6]]
      ]) {
        const available = questions.filter(q => chapters.includes(chapterOf(q))).length;
        exams.push({ code, badge: 'CHUYÊN ĐỀ', title, available, count: Math.min(30, available), description: `Trộn tối đa 30 câu từ chương ${chapters.join(', ')}` });
      }
    }
    exams.push({
      code: 'RANDOM', badge: 'NGẪU NHIÊN', title: 'Đề thi tổng hợp ngẫu nhiên',
      count: Math.min(40, questions.length), available: questions.length,
      description: subject === 'ktvxl'
        ? 'Trộn 40 câu: 35 trắc nghiệm + 5 điền kết quả'
        : 'Trộn 40 câu, phân bổ theo các chương có trong ngân hàng'
    });
    return exams;
  }

  function select(subject, questions, code, random = Math.random) {
    const entry = catalog(subject, questions).find(exam => exam.code === code);
    if (!entry || !entry.count) return [];
    if (code === 'RANDOM') {
      if (subject === 'ktvxl') {
        const mcq = shuffle(questions.filter(q => q.type === 'mcq'), random).slice(0, 35);
        const fib = shuffle(questions.filter(q => q.type === 'fib'), random).slice(0, 5);
        return shuffle([...mcq, ...fib], random);
      }
      return sampleChapters(questions, 40, random);
    }
    if (code === 'VLDC_OPTICS' || code === 'VLDC_QUANTUM') {
      const chapters = code === 'VLDC_OPTICS' ? [1, 2] : [3, 4, 5, 6];
      return sampleChapters(questions.filter(q => chapters.includes(chapterOf(q))), 30, random);
    }
    return sourceQuestions(subject, questions, code).slice(0, entry.count);
  }

  const api = { subjects, catalog, select, chapterOf };
  root.KMA_EXAMS = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
