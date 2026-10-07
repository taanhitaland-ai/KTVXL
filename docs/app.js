// KTVXL & TTHCM PRO MASTER MULTI-SUBJECT APPLICATION LOGIC
(function() {
  'use strict';

  // Active Subject: 'ktvxl' or 'tthcm'
  let currentSubject = localStorage.getItem('kma_active_subject') || 'ktvxl';

  // State Management
  let questions = [];
  let knowledge = null;
  let userAnswers = {}; // { [qId]: { answer, isCorrect, inputVal } }
  let starredQuestions = new Set();
  
  // Filter state
  let currentSource = 'ALL';
  let currentClo = 'ALL';
  let currentStatus = 'ALL';
  let searchKeyword = '';
  
  // Exam simulator state
  let examActive = false;
  let examQuestions = [];
  let examTimeRemaining = 60 * 60; // seconds
  let examTimerInterval = null;
  let examUserAnswers = {};
  let currentExamCode = 'RANDOM';

  let practiceDisplayLimit = 100;

  // Initialize App
  function init() {
    setupSubjectSwitcher();
    loadSubjectData(currentSubject);
    setupApp();
  }

  function getStorageKeyAnswers() {
    return `kma_user_answers_${currentSubject}_v2`;
  }

  function getStorageKeyStars() {
    return `kma_starred_questions_${currentSubject}_v2`;
  }

  function loadSavedState() {
    try {
      userAnswers = {};
      starredQuestions = new Set();
      const savedAns = localStorage.getItem(getStorageKeyAnswers());
      if (savedAns) userAnswers = JSON.parse(savedAns);
      const savedStars = localStorage.getItem(getStorageKeyStars());
      if (savedStars) starredQuestions = new Set(JSON.parse(savedStars));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }

  function saveState() {
    try {
      localStorage.setItem(getStorageKeyAnswers(), JSON.stringify(userAnswers));
      localStorage.setItem(getStorageKeyStars(), JSON.stringify([...starredQuestions]));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
    updateStatsBar();
  }

  function loadSubjectData(subject) {
    currentSubject = subject;
    localStorage.setItem('kma_active_subject', subject);
    loadSavedState();

    if (subject === 'xstk') {
      questions = (window.XSTK_QUESTIONS_DATA || []).map((q, idx) => ({
        ...q,
        num: q.num || (idx + 1),
        answer: q.answer || q.correct_answer,
        chapter: q.chapter_id || (typeof q.chapter === 'number' ? q.chapter : parseInt(String(q.chapter).replace(/\D+/g, ''), 10)) || 1,
        source_title: q.source_title || 'XSTK Chuẩn',
        source: q.source || 'KMA_STANDARD'
      }));
      knowledge = window.XSTK_KNOWLEDGE_DATA || null;
      currentSource = 'ALL';
      currentExamCode = 'RANDOM';
    } else if (subject === 'vldc') {
      questions = (window.VLDC_QUESTIONS_DATA || []).map((q, idx) => ({
        ...q,
        num: q.num || (idx + 1),
        answer: q.answer || q.correct_answer,
        chapter: q.chapter_id || (typeof q.chapter === 'number' ? q.chapter : parseInt(String(q.chapter).replace(/\D+/g, ''), 10)) || 1,
        source_title: q.source_title || 'VLDC Chuẩn',
        source: q.source || 'VLDC_STANDARD'
      }));
      knowledge = window.VLDC_KNOWLEDGE_DATA || null;
      currentSource = 'ALL';
      currentExamCode = 'RANDOM';
    } else if (subject === 'tthcm') {
      questions = window.TTHCM_QUESTIONS_DATA || [];
      knowledge = window.TTHCM_KNOWLEDGE_DATA || null;
      currentSource = 'ALL';
      currentExamCode = 'RANDOM';
    } else {
      questions = window.KTVXL_QUESTIONS || window.QUESTIONS_DATABASE || [];
      knowledge = window.KTVXL_KNOWLEDGE || null;
      currentSource = 'ALL_EXAMS';
      currentExamCode = '1';
    }

    // Update Header Brand
    const brandBadge = document.getElementById('app-brand-badge');
    const brandTitle = document.getElementById('app-brand-title');
    if (brandBadge && brandTitle) {
      if (subject === 'xstk') {
        brandBadge.textContent = '🎲 XSTK';
        brandBadge.style.background = '#059669';
        brandBadge.style.color = '#FFF';
        brandTitle.textContent = 'XÁC SUẤT THỐNG KÊ';
      } else if (subject === 'vldc') {
        brandBadge.textContent = '⚛️ VLDC';
        brandBadge.style.background = '#2563EB';
        brandBadge.style.color = '#FFF';
        brandTitle.textContent = 'VẬT LÝ ĐẠI CƯƠNG';
      } else if (subject === 'tthcm') {
        brandBadge.textContent = '📕 TTHCM';
        brandBadge.style.background = '#EF4444';
        brandBadge.style.color = '#FFF';
        brandTitle.textContent = 'TƯ TƯỞNG HCM';
      } else {
        brandBadge.textContent = '⚡ KTVXL';
        brandBadge.style.background = '#000';
        brandBadge.style.color = 'var(--neo-yellow)';
        brandTitle.textContent = 'VI XỬ LÝ';
      }
    }

    // Update Subject Toggle Buttons
    const btnKtvxl = document.getElementById('btn-subj-ktvxl');
    const btnTthcm = document.getElementById('btn-subj-tthcm');
    const btnVldc = document.getElementById('btn-subj-vldc');
    const btnXstk = document.getElementById('btn-subj-xstk');
    if (btnKtvxl) btnKtvxl.classList.toggle('active', subject === 'ktvxl');
    if (btnTthcm) btnTthcm.classList.toggle('active', subject === 'tthcm');
    if (btnVldc) btnVldc.classList.toggle('active', subject === 'vldc');
    if (btnXstk) btnXstk.classList.toggle('active', subject === 'xstk');

    // Update Lab Tab button and Lab containers
    const btnLab = document.getElementById('btn-tab-visualize');
    const labVldc = document.getElementById('lab-container-vldc');
    const labXstk = document.getElementById('lab-container-xstk');
    if (btnLab) {
      if (subject === 'xstk') {
        btnLab.innerHTML = '🎲 Mô Phỏng Xác Suất (Lab) <span style="background: #FFE600; color: #000; padding: 1px 6px; border: 1.5px solid #000; border-radius: 4px; font-size: 0.7rem; font-weight: 900; margin-left: 4px;">HOT</span>';
        if (labVldc) labVldc.style.display = 'none';
        if (labXstk) labXstk.style.display = 'block';
        if (window.initXstkLab) window.initXstkLab();
      } else if (subject === 'vldc') {
        btnLab.innerHTML = '🔬 Mô Phỏng Vật Lý (Lab) <span style="background: #FFE600; color: #000; padding: 1px 6px; border: 1.5px solid #000; border-radius: 4px; font-size: 0.7rem; font-weight: 900; margin-left: 4px;">HOT</span>';
        if (labVldc) labVldc.style.display = 'block';
        if (labXstk) labXstk.style.display = 'none';
        if (window.initPhysicsLab) window.initPhysicsLab();
      } else {
        btnLab.textContent = '🔬 Mô Phỏng Trực Quan';
        if (labVldc) labVldc.style.display = 'none';
        if (labXstk) labXstk.style.display = 'block';
      }
    }

    updateFilterUI();
    updateExamSetupUI();
  }

  function setupSubjectSwitcher() {
    const btnKtvxl = document.getElementById('btn-subj-ktvxl');
    const btnTthcm = document.getElementById('btn-subj-tthcm');
    const btnVldc = document.getElementById('btn-subj-vldc');
    const btnXstk = document.getElementById('btn-subj-xstk');

    if (btnKtvxl) {
      btnKtvxl.addEventListener('click', () => {
        if (currentSubject !== 'ktvxl') {
          switchSubject('ktvxl');
        }
      });
    }

    if (btnTthcm) {
      btnTthcm.addEventListener('click', () => {
        if (currentSubject !== 'tthcm') {
          switchSubject('tthcm');
        }
      });
    }

    if (btnVldc) {
      btnVldc.addEventListener('click', () => {
        if (currentSubject !== 'vldc') {
          switchSubject('vldc');
        }
      });
    }

    if (btnXstk) {
      btnXstk.addEventListener('click', () => {
        if (currentSubject !== 'xstk') {
          switchSubject('xstk');
        }
      });
    }
  }

  function switchSubject(subject) {
    if (examActive) {
      if (!confirm('Bạn đang trong bài thi. Chuyển môn học sẽ hủy bài thi hiện tại. Tiếp tục?')) {
        return;
      }
      clearInterval(examTimerInterval);
      examActive = false;
      const actView = document.getElementById('exam-active-view');
      const setView = document.getElementById('exam-setup-view');
      if (actView && setView) {
        actView.style.display = 'none';
        setView.style.display = 'block';
      }
    }

    loadSubjectData(subject);
    practiceDisplayLimit = 100;
    renderPracticeQuestions();
    setupKnowledgeHub();
    updateStatsBar();

    // Reset side panel
    const panelTitle = document.getElementById('panel-q-title');
    const panelContent = document.getElementById('panel-content');
    if (panelTitle && panelContent) {
      panelTitle.textContent = '💡 CHỌN CÂU HỎI ĐỂ XEM LỜI GIẢI';
      const subjName = subject === 'xstk' ? 'Xác Suất Thống Kê' : (subject === 'vldc' ? 'Vật Lý Đại Cương 2' : (subject === 'tthcm' ? 'Tư Tưởng Hồ Chí Minh' : 'Kỹ Thuật Vi Xử Lý'));
      panelContent.innerHTML = `
        <div class="panel-placeholder">
          <p style="font-size: 2.2rem; margin-bottom: 12px;">📚</p>
          <p style="font-weight: 800; font-size: 1rem;">Đã chuyển sang môn ${subjName}</p>
          <p style="font-size: 0.85rem; color: #666; margin-top: 6px;">
            Bấm vào bất kỳ câu hỏi nào để xem phân tích chi tiết, phương pháp làm bài và mẹo nhớ!
          </p>
        </div>
      `;
    }
  }

  function updateFilterUI() {
    const sourceSelect = document.getElementById('filter-source');
    if (!sourceSelect) return;

    if (currentSubject === 'xstk') {
      sourceSelect.innerHTML = `
        <optgroup label="Toàn Bộ Ngân Hàng">
          <option value="ALL">🌟 Toàn Bộ Ngân Hàng XSTK (139 câu)</option>
        </optgroup>
        <optgroup label="5 Đề Kiểm Tra Giữa Kỳ KMA">
          <option value="KMA_EXAM_01">📝 Đề Kiểm Tra Giữa Kỳ 01 (7 câu)</option>
          <option value="KMA_EXAM_02">📝 Đề Kiểm Tra Giữa Kỳ 02 (4 câu)</option>
          <option value="KMA_EXAM_03">📝 Đề Kiểm Tra Giữa Kỳ 03 (4 câu)</option>
          <option value="KMA_EXAM_04">📝 Đề Kiểm Tra Giữa Kỳ 04 (4 câu)</option>
          <option value="KMA_EXAM_05">📝 Đề Kiểm Tra Giữa Kỳ 05 (6 câu)</option>
        </optgroup>
        <optgroup label="Chuyên Đề & Bài Tập Chuẩn">
          <option value="KMA_STANDARD">📚 Ngân Hàng Bài Tập Chuẩn KMA (108 câu)</option>
          <option value="ATTT_CHUYEN_DE">🛡️ Chuyên Đề An Toàn Thông Tin (6 câu)</option>
        </optgroup>
        <optgroup label="Lọc Theo 8 Chương Giáo Trình">
          <option value="CHAP_1">Chương 1: Biến cố ngẫu nhiên & Định nghĩa xác suất (18 câu)</option>
          <option value="CHAP_2">Chương 2: Các quy tắc tính xác suất cơ bản (11 câu)</option>
          <option value="CHAP_3">Chương 3: Đại lượng ngẫu nhiên rời rạc & Phân phối (14 câu)</option>
          <option value="CHAP_4">Chương 4: Đại lượng ngẫu nhiên liên tục & Phân phối (22 câu)</option>
          <option value="CHAP_5">Chương 5: Đại lượng ngẫu nhiên hai chiều (19 câu)</option>
          <option value="CHAP_6">Chương 6: Thống kê mô tả & Lý thuyết mẫu (23 câu)</option>
          <option value="CHAP_7">Chương 7: Ước lượng tham số (15 câu)</option>
          <option value="CHAP_8">Chương 8: Kiểm định giả thuyết thống kê (17 câu)</option>
        </optgroup>
      `;
      currentSource = 'ALL';
    } else if (currentSubject === 'vldc') {
      sourceSelect.innerHTML = `
        <optgroup label="Toàn Bộ Ngân Hàng">
          <option value="ALL">🌟 Toàn Bộ Ngân Hàng VLDC (142 câu)</option>
        </optgroup>
        <optgroup label="4 Nguồn Đề Thi & Đề Cương Notion">
          <option value="NOTION_DE_CUOI">⭐ Đề Test Cuối (Notion - 38 câu)</option>
          <option value="NOTION_TEST_100">📝 Đề Test 100 Câu (Notion - 35 câu)</option>
          <option value="NOTION_GIAK_2025">🎯 Đề Giữa Kỳ 2025 (Notion - 6 câu)</option>
          <option value="NOTION_DE_CUONG">📑 Đề Cương Ôn Tập A2 (Notion - 5 câu)</option>
          <option value="VLDC_STANDARD">📚 Ngân Hàng Đề Cương & Bài Tập ĐHBK (58 câu)</option>
        </optgroup>
        <optgroup label="Lọc Theo 6 Chương Giáo Trình">
          <option value="CHAP_1">Chương 1: Dao động & Sóng điện từ (16 câu)</option>
          <option value="CHAP_2">Chương 2: Quang học sóng - Giao thoa & Nhiễu xạ (48 câu)</option>
          <option value="CHAP_3">Chương 3: Quang học lượng tử - Bức xạ nhiệt & Compton (26 câu)</option>
          <option value="CHAP_4">Chương 4: Cơ học lượng tử - De Broglie & Schrödinger (21 câu)</option>
          <option value="CHAP_5">Chương 5: Vật lý nguyên tử - Quang phổ & Spin (19 câu)</option>
          <option value="CHAP_6">Chương 6: Vật lý hạt nhân - Năng lượng liên kết & Phóng xạ (12 câu)</option>
        </optgroup>
      `;
      currentSource = 'ALL';
    } else if (currentSubject === 'tthcm') {
      sourceSelect.innerHTML = `
        <optgroup label="Tất Cả">
          <option value="ALL">🌟 Toàn Bộ Ngân Hàng TTHCM (885 câu)</option>
        </optgroup>
        <optgroup label="4 Nguồn Đề Thi & Đề Cương">
          <option value="TTHCM_FULL_A">⭐ Ngân Hàng Đề Gốc Full ĐA A (281 câu)</option>
          <option value="TTHCM_DE_132">📝 Mã Đề Thi 132 (298 câu)</option>
          <option value="TTHCM_DE_651">🎯 Đề Thi Mẫu 651 (48 câu)</option>
          <option value="TTHCM_DE_CUONG">📑 Đề Cương ATTT KMA 2019 (258 câu)</option>
        </optgroup>
        <optgroup label="Lọc Theo 6 Chương Giáo Trình">
          <option value="CHAP_1">Chương 1: Khái niệm & Đối tượng nghiên cứu</option>
          <option value="CHAP_2">Chương 2: Cơ sở, quá trình hình thành & phát triển</option>
          <option value="CHAP_3">Chương 3: Độc lập dân tộc & CNXH</option>
          <option value="CHAP_4">Chương 4: Đảng & Nhà nước của nhân dân</option>
          <option value="CHAP_5">Chương 5: Đại đoàn kết dân tộc & Quốc tế</option>
          <option value="CHAP_6">Chương 6: Văn hóa, đạo đức & Con người</option>
        </optgroup>
      `;
      currentSource = 'ALL';
    } else {
      sourceSelect.innerHTML = `
        <optgroup label="5 Đề Thi Chính Thức KMA (Chuẩn 40 câu)">
          <option value="ALL_EXAMS">⭐ Tất cả 5 Đề Thi (Đề 001 - 005)</option>
          <option value="DE_001">Đề Kiểm Tra 001 (40 câu)</option>
          <option value="DE_002">Đề Kiểm Tra 002 (40 câu)</option>
          <option value="DE_003">Đề Kiểm Tra 003 (40 câu)</option>
          <option value="DE_004">Đề Kiểm Tra 004 (40 câu)</option>
          <option value="DE_005">Đề Kiểm Tra 005 (40 câu)</option>
        </optgroup>
        <optgroup label="Toàn Bộ Ngân Hàng">
          <option value="ALL">🌟 Toàn Bộ Ngân Hàng (984 câu)</option>
        </optgroup>
        <optgroup label="Chuyên Đề Bài Tập (Part 1 - Part 18)">
          <option value="PART_01">Part 1: Tổng quan Vi xử lý & ARM</option>
          <option value="PART_02">Part 2: Kiến trúc CPU, ALU, Bus</option>
          <option value="PART_03">Part 3: Giải mã lệnh & Bộ nhớ</option>
          <option value="PART_04">Part 4: Hệ thống Bus vi điều khiển</option>
          <option value="PART_05">Part 5: Cấu trúc chân & Cổng P0-P3</option>
          <option value="PART_06">Part 6: Các thanh ghi SFR 89C51</option>
          <option value="PART_07">Part 7: Không gian bộ nhớ RAM/ROM</option>
          <option value="PART_09">Part 9: Tập lệnh ASM & Khai báo</option>
          <option value="PART_10">Part 10: Chức năng lệnh 8051</option>
          <option value="PART_11">Part 11: Thanh ghi & Cờ trạng thái</option>
          <option value="PART_12">Part 12: Đọc hiểu đoạn lệnh</option>
          <option value="PART_13">Part 13: Chương trình con & Tra bảng</option>
          <option value="PART_14">Part 14: Lập trình Timer & Chức năng</option>
          <option value="PART_15">Part 15: Chế độ đếm & Định thời TMOD</option>
          <option value="PART_16">Part 16: Lập trình Timer tạo trễ</option>
          <option value="PART_17">Part 17: Truyền thông nối tiếp UART</option>
          <option value="PART_18">Part 18: Tốc độ Baud & SCON</option>
        </optgroup>
      `;
      currentSource = 'ALL_EXAMS';
    }

    // Sub-filter button group (CLO vs Chương)
    const btnGroup = document.querySelector('.filter-btn-group');
    const filterLabel = btnGroup ? btnGroup.previousElementSibling : null;
    if (btnGroup) {
      if (currentSubject === 'xstk') {
        if (filterLabel) filterLabel.textContent = 'Chương:';
        btnGroup.innerHTML = `
          <button class="neo-filter-btn active" data-clo="ALL">Tất cả</button>
          <button class="neo-filter-btn" data-clo="1">Chương 1</button>
          <button class="neo-filter-btn" data-clo="2">Chương 2</button>
          <button class="neo-filter-btn" data-clo="3">Chương 3</button>
          <button class="neo-filter-btn" data-clo="4">Chương 4</button>
          <button class="neo-filter-btn" data-clo="5">Chương 5</button>
          <button class="neo-filter-btn" data-clo="6">Chương 6</button>
          <button class="neo-filter-btn" data-clo="7">Chương 7</button>
          <button class="neo-filter-btn" data-clo="8">Chương 8</button>
        `;
      } else if (currentSubject === 'vldc' || currentSubject === 'tthcm') {
        if (filterLabel) filterLabel.textContent = 'Chương:';
        btnGroup.innerHTML = `
          <button class="neo-filter-btn active" data-clo="ALL">Tất cả</button>
          <button class="neo-filter-btn" data-clo="1">Chương 1</button>
          <button class="neo-filter-btn" data-clo="2">Chương 2</button>
          <button class="neo-filter-btn" data-clo="3">Chương 3</button>
          <button class="neo-filter-btn" data-clo="4">Chương 4</button>
          <button class="neo-filter-btn" data-clo="5">Chương 5</button>
          <button class="neo-filter-btn" data-clo="6">Chương 6</button>
        `;
      } else {
        if (filterLabel) filterLabel.textContent = 'Chuẩn đầu ra:';
        btnGroup.innerHTML = `
          <button class="neo-filter-btn active" data-clo="ALL">Tất cả</button>
          <button class="neo-filter-btn" data-clo="CLO1">CLO1: Tổng quan</button>
          <button class="neo-filter-btn" data-clo="CLO2">CLO2: Phần cứng & Tập lệnh</button>
          <button class="neo-filter-btn" data-clo="CLO3">CLO3: Lập trình & Ứng dụng</button>
        `;
      }
      currentClo = 'ALL';

      btnGroup.querySelectorAll('[data-clo]').forEach(btn => {
        btn.addEventListener('click', () => {
          btnGroup.querySelectorAll('[data-clo]').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          currentClo = btn.getAttribute('data-clo');
          practiceDisplayLimit = 100;
          renderPracticeQuestions();
        });
      });
    }
  }

  function updateStartExamButton() {
    const btnStart = document.getElementById('btn-start-exam');
    if (!btnStart) return;
    const timeMins = (currentSubject === 'xstk' ? 60 : (currentSubject === 'vldc' ? 45 : (currentSubject === 'tthcm' ? 40 : 60)));
    const activeCard = document.querySelector('.exam-card-choice.selected');
    const badgeText = activeCard?.querySelector('.exam-code-badge, .neo-badge')?.textContent?.trim() || '';
    const titleText = activeCard?.querySelector('.exam-title-choice, h3')?.textContent?.trim() || currentExamCode;
    const displayName = badgeText ? `${badgeText} - ${titleText}` : titleText;
    btnStart.innerHTML = `🚀 BẮT ĐẦU: <strong>${escapeHtml(displayName)}</strong> (${timeMins}:00)`;
  }

  function updateExamSetupUI() {
    const examGrid = document.getElementById('exam-select-grid') || document.querySelector('.exam-select-grid') || document.querySelector('.exam-grid-choices');
    if (!examGrid) return;

    const setupTitle = document.getElementById('exam-setup-title') || document.querySelector('#exam-setup-view h2');
    const setupDesc = document.getElementById('exam-setup-desc') || document.querySelector('#exam-setup-view p');
    const setupBadge = document.getElementById('exam-setup-badge') || document.querySelector('#exam-setup-view .badge-exam');

    if (currentSubject === 'xstk') {
      if (setupTitle) setupTitle.textContent = 'PHÒNG THI THỬ TRẮC NGHIỆM XÁC SUẤT VÀ THỐNG KÊ';
      if (setupDesc) setupDesc.innerHTML = 'Đề thi gồm đúng <strong>40 câu hỏi</strong> phủ khắp 8 chương giáo trình KMA kèm đề kiểm tra giữa kỳ. Thời gian làm bài <strong>60 phút</strong>.';
      if (setupBadge) setupBadge.textContent = '⏱️ CHUẨN MA TRẬN ĐỀ THI KMA • 60 PHÚT';
      const validXstk = ['RANDOM', 'KMA_EXAM_01', 'KMA_EXAM_02', 'XSTK_PROB', 'XSTK_STAT'];
      if (!validXstk.includes(currentExamCode)) currentExamCode = 'RANDOM';

      examGrid.innerHTML = `
        <div class="exam-card-choice ${currentExamCode === 'RANDOM' ? 'selected' : ''}" data-exam-code="RANDOM">
          <div class="exam-code-badge" style="background: #059669; color: #FFF;">CHUẨN MA TRẬN</div>
          <h3 class="exam-title-choice">Đề Thi Tổng Hợp 40 Câu (XSTK)</h3>
          <p class="exam-desc-choice">Trộn chuẩn 40 câu ngẫu nhiên phủ khắp 8 chương giáo trình Xác suất và Thống kê học viện KMA.</p>
        </div>
        <div class="exam-card-choice ${currentExamCode === 'KMA_EXAM_01' ? 'selected' : ''}" data-exam-code="KMA_EXAM_01">
          <div class="exam-code-badge" style="background: #2563EB; color: #FFF;">ĐỀ GIỮA KỲ 01</div>
          <h3 class="exam-title-choice">Đề Kiểm Tra Giữa Kỳ 01 (KMA)</h3>
          <p class="exam-desc-choice">Đề thi giữa kỳ chính thức số 01 kèm bài tập bổ trợ tổ hợp, Bayes, Poisson và phân phối chuẩn.</p>
        </div>
        <div class="exam-card-choice ${currentExamCode === 'KMA_EXAM_02' ? 'selected' : ''}" data-exam-code="KMA_EXAM_02">
          <div class="exam-code-badge" style="background: #E11D48; color: #FFF;">ĐỀ GIỮA KỲ 02</div>
          <h3 class="exam-title-choice">Đề Kiểm Tra Giữa Kỳ 02 (KMA)</h3>
          <p class="exam-desc-choice">Bộ đề thi trắc nghiệm & tự luận giữa kỳ số 02 kèm bảng tra Laplace và Student.</p>
        </div>
        <div class="exam-card-choice ${currentExamCode === 'XSTK_PROB' ? 'selected' : ''}" data-exam-code="XSTK_PROB">
          <div class="exam-code-badge" style="background: #F59E0B; color: #000;">CHUYÊN ĐỀ XÁC SUẤT</div>
          <h3 class="exam-title-choice">Chuyên Đề Xác Suất (Chương 1 - 5)</h3>
          <p class="exam-desc-choice">40 câu trắc nghiệm chuyên sâu về biến cố, Bayes, biến ngẫu nhiên 1 chiều rời rạc, liên tục và 2 chiều.</p>
        </div>
        <div class="exam-card-choice ${currentExamCode === 'XSTK_STAT' ? 'selected' : ''}" data-exam-code="XSTK_STAT">
          <div class="exam-code-badge" style="background: #8B5CF6; color: #FFF;">CHUYÊN ĐỀ THỐNG KÊ</div>
          <h3 class="exam-title-choice">Chuyên Đề Thống Kê (Chương 6 - 8)</h3>
          <p class="exam-desc-choice">40 câu lý thuyết mẫu, phương sai hiệu chỉnh, khoảng tin cậy kỳ vọng/tỷ lệ và kiểm định giả thuyết.</p>
        </div>
      `;
    } else if (currentSubject === 'vldc') {
      if (setupTitle) setupTitle.textContent = 'PHÒNG THI THỬ TRẮC NGHIỆM VẬT LÝ ĐẠI CƯƠNG 2';
      if (setupDesc) setupDesc.innerHTML = 'Đề thi gồm <strong>30 - 40 câu hỏi</strong> chuẩn từ tài liệu Notion và ngân hàng bài tập KMA. Thời gian làm bài <strong>45 phút</strong>.';
      if (setupBadge) setupBadge.textContent = '⏱️ CHUẨN MA TRẬN ĐỀ THI KMA • 45 PHÚT';
      const validVldc = ['RANDOM', 'NOTION_DE_CUOI', 'NOTION_TEST_100', 'VLDC_OPTICS', 'VLDC_QUANTUM'];
      if (!validVldc.includes(currentExamCode)) currentExamCode = 'RANDOM';

      examGrid.innerHTML = `
        <div class="exam-card-choice ${currentExamCode === 'RANDOM' ? 'selected' : ''}" data-exam-code="RANDOM">
          <div class="exam-code-badge" style="background: #2563EB; color: #FFF;">CHUẨN MA TRẬN</div>
          <h3 class="exam-title-choice">Đề Thi Tổng Hợp 40 Câu</h3>
          <p class="exam-desc-choice">Trộn chuẩn 40 câu từ toàn bộ 6 chương VLDC (Dao động điện từ, Quang sóng, Quang lượng tử, Cơ học LT, Nguyên tử, Hạt nhân).</p>
        </div>
        <div class="exam-card-choice ${currentExamCode === 'NOTION_DE_CUOI' ? 'selected' : ''}" data-exam-code="NOTION_DE_CUOI">
          <div class="exam-code-badge" style="background: #E11D48; color: #FFF;">ĐỀ TEST CUỐI</div>
          <h3 class="exam-title-choice">Đề Test Cuối (Notion - 38 Câu Gốc)</h3>
          <p class="exam-desc-choice">Bộ đề chính thức từ tài liệu Notion Đề Thi với đầy đủ công thức, bài toán tính toán và hướng dẫn Casio.</p>
        </div>
        <div class="exam-card-choice ${currentExamCode === 'NOTION_TEST_100' ? 'selected' : ''}" data-exam-code="NOTION_TEST_100">
          <div class="exam-code-badge" style="background: #F59E0B; color: #000;">TEST 100 CÂU</div>
          <h3 class="exam-title-choice">Đề Test 100 Câu (Notion Google Docs)</h3>
          <p class="exam-desc-choice">Bộ câu hỏi trích lục từ Google Docs Đề Test 100 câu đính kèm trên trang Notion.</p>
        </div>
        <div class="exam-card-choice ${currentExamCode === 'VLDC_OPTICS' ? 'selected' : ''}" data-exam-code="VLDC_OPTICS">
          <div class="exam-code-badge" style="background: #10B981; color: #FFF;">QUANG HỌC SÓNG</div>
          <h3 class="exam-title-choice">Chuyên Đề Quang Sóng (Chương 1 & 2)</h3>
          <p class="exam-desc-choice">30 câu trắc nghiệm chuyên sâu về Sóng điện từ, Giao thoa bản mỏng/Young, Nêm không khí, Vân tròn Newton và Nhiễu xạ.</p>
        </div>
        <div class="exam-card-choice ${currentExamCode === 'VLDC_QUANTUM' ? 'selected' : ''}" data-exam-code="VLDC_QUANTUM">
          <div class="exam-code-badge" style="background: #8B5CF6; color: #FFF;">LƯỢNG TỬ & HẠT NHÂN</div>
          <h3 class="exam-title-choice">Chuyên Đề Lượng Tử (Chương 3 - 6)</h3>
          <p class="exam-desc-choice">30 câu trắc nghiệm & bài tập Compton, Quang điện, Sóng De Broglie, Phương trình Schrödinger, Giếng thế và Hạt nhân.</p>
        </div>
      `;
    } else if (currentSubject === 'tthcm') {
      if (setupTitle) setupTitle.textContent = 'PHÒNG THI THỬ TRẮC NGHIỆM TƯ TƯỞNG HỒ CHÍ MINH';
      if (setupDesc) setupDesc.innerHTML = 'Ngân hàng <strong>885 câu hỏi</strong> trích xuất từ đề thi chính thức các khóa KMA. Thời gian làm bài <strong>40 phút</strong> cho <strong>40 câu</strong>.';
      if (setupBadge) setupBadge.textContent = '⏱️ CHUẨN MA TRẬN ĐỀ THI KMA • 40 PHÚT';
      const validTthcm = ['RANDOM', 'TTHCM_FULL_A', 'TTHCM_DE_132', 'TTHCM_DE_651', 'TTHCM_DE_CUONG'];
      if (!validTthcm.includes(currentExamCode)) currentExamCode = 'RANDOM';

      examGrid.innerHTML = `
        <div class="exam-card-choice ${currentExamCode === 'RANDOM' ? 'selected' : ''}" data-exam-code="RANDOM">
          <div class="exam-code-badge" style="background: #000; color: #FFE600;">TRỘN ĐỀ</div>
          <h3 class="exam-title-choice">Đề Thi Ngẫu Nhiên 40 Câu</h3>
          <p class="exam-desc-choice">Trộn chuẩn từ ngân hàng 885 câu, phân bổ đều 6 chương giáo trình TTHCM.</p>
        </div>
        <div class="exam-card-choice ${currentExamCode === 'TTHCM_FULL_A' ? 'selected' : ''}" data-exam-code="TTHCM_FULL_A">
          <div class="exam-code-badge" style="background: #EF4444; color: #FFF;">ĐỀ GỐC</div>
          <h3 class="exam-title-choice">Bộ Đề Cuối Kỳ (Full A - 281 Câu)</h3>
          <p class="exam-desc-choice">40 câu trích xuất ngẫu nhiên từ bộ đề thi chuẩn cuối kỳ học viện KMA.</p>
        </div>
        <div class="exam-card-choice ${currentExamCode === 'TTHCM_DE_132' ? 'selected' : ''}" data-exam-code="TTHCM_DE_132">
          <div class="exam-code-badge" style="background: #2563EB; color: #FFF;">MÃ ĐỀ 132</div>
          <h3 class="exam-title-choice">Mã Đề Thi 132 Chính Thức</h3>
          <p class="exam-desc-choice">40 câu trắc nghiệm thực chiến theo mã đề 132.</p>
        </div>
        <div class="exam-card-choice ${currentExamCode === 'TTHCM_DE_651' ? 'selected' : ''}" data-exam-code="TTHCM_DE_651">
          <div class="exam-code-badge" style="background: #10B981; color: #FFF;">MÃ ĐỀ 651</div>
          <h3 class="exam-title-choice">Đề Thi Mẫu 651 KTMM</h3>
          <p class="exam-desc-choice">Bộ đề thi trắc nghiệm mẫu 48 câu của Phòng KT&ĐBCLĐT Học viện.</p>
        </div>
        <div class="exam-card-choice ${currentExamCode === 'TTHCM_DE_CUONG' ? 'selected' : ''}" data-exam-code="TTHCM_DE_CUONG">
          <div class="exam-code-badge" style="background: #8B5CF6; color: #FFF;">ĐỀ CƯƠNG</div>
          <h3 class="exam-title-choice">Đề Cương ATTT KMA</h3>
          <p class="exam-desc-choice">40 câu tuyển chọn từ đề cương ôn thi hệ An toàn thông tin.</p>
        </div>
      `;
    } else {
      if (setupTitle) setupTitle.textContent = 'PHÒNG THI THỬ TRẮC NGHIỆM KỸ THUẬT VI XỬ LÝ';
      if (setupDesc) setupDesc.innerHTML = 'Đề thi gồm đúng <strong>40 câu hỏi</strong> (35 câu trắc nghiệm + 5 câu điền khuyết), thời gian làm bài <strong>60 phút</strong>. Bám sát 100% chuẩn đầu ra CLO1, CLO2, CLO3 của Học viện Kỹ thuật Mật mã.';
      if (setupBadge) setupBadge.textContent = '⏱️ CHUẨN MA TRẬN ĐỀ THI KMA • 60 PHÚT';
      const validKtvxl = ['1', '2', '3', '4', '5', 'RANDOM'];
      if (currentExamCode && currentExamCode.startsWith('DE_00')) {
        currentExamCode = currentExamCode.replace('DE_00', '');
      }
      if (!validKtvxl.includes(currentExamCode)) currentExamCode = '1';

      examGrid.innerHTML = `
        <div class="exam-card-choice ${currentExamCode === '1' ? 'selected' : ''}" data-exam-code="1">
          <div class="exam-code-badge">MÃ ĐỀ 001</div>
          <h3 class="exam-title-choice">Đề Kiểm Tra 001</h3>
          <p class="exam-desc-choice">Chuẩn 40 câu: 6 CLO1, 9 CLO2, 25 CLO3 (Có câu hỏi điền kết quả FIB).</p>
        </div>
        <div class="exam-card-choice ${currentExamCode === '2' ? 'selected' : ''}" data-exam-code="2">
          <div class="exam-code-badge">MÃ ĐỀ 002</div>
          <h3 class="exam-title-choice">Đề Kiểm Tra 002</h3>
          <p class="exam-desc-choice">Chuẩn 40 câu: 6 CLO1, 9 CLO2, 25 CLO3 bám sát ma trận đề.</p>
        </div>
        <div class="exam-card-choice ${currentExamCode === '3' ? 'selected' : ''}" data-exam-code="3">
          <div class="exam-code-badge">MÃ ĐỀ 003</div>
          <h3 class="exam-title-choice">Đề Kiểm Tra 003</h3>
          <p class="exam-desc-choice">Chuẩn 40 câu: Trọng tâm lập trình Timer, UART và giải mã địa chỉ.</p>
        </div>
        <div class="exam-card-choice ${currentExamCode === '4' ? 'selected' : ''}" data-exam-code="4">
          <div class="exam-code-badge">MÃ ĐỀ 004</div>
          <h3 class="exam-title-choice">Đề Kiểm Tra 004</h3>
          <p class="exam-desc-choice">Chuẩn 40 câu: Cấu trúc bộ nhớ, thanh ghi SFR và mạch ngoại vi.</p>
        </div>
        <div class="exam-card-choice ${currentExamCode === '5' ? 'selected' : ''}" data-exam-code="5">
          <div class="exam-code-badge">MÃ ĐỀ 005</div>
          <h3 class="exam-title-choice">Đề Kiểm Tra 005</h3>
          <p class="exam-desc-choice">Chuẩn 40 câu: Chuyên đề tính toán Baud rate, Timer Mode 2, cờ ALU.</p>
        </div>
        <div class="exam-card-choice ${currentExamCode === 'RANDOM' ? 'selected' : ''}" data-exam-code="RANDOM">
          <div class="exam-code-badge" style="background: #000; color: #FFE600;">NGẪU NHIÊN</div>
          <h3 class="exam-title-choice">Đề Thi Tổng Hợp (Random)</h3>
          <p class="exam-desc-choice">Hệ thống tự động bốc ngẫu nhiên 40 câu từ toàn bộ ngân hàng 984 câu.</p>
        </div>
      `;
    }

    updateStartExamButton();
  }

  function setupApp() {
    setupTabNavigation();
    setupFilters();
    setupKnowledgeHub();
    setupExamSimulator();
    updateExamSetupUI();
    setupImageLightbox();
    renderPracticeQuestions();
    updateStatsBar();
  }

  function openImageLightbox(src) {
    const modal = document.getElementById('image-lightbox-modal');
    const img = document.getElementById('lightbox-img');
    if (modal && img) {
      img.src = src;
      modal.style.display = 'flex';
    }
  }

  function closeImageLightbox() {
    const modal = document.getElementById('image-lightbox-modal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  function setupImageLightbox() {
    const btnClose = document.getElementById('btn-close-lightbox');
    if (btnClose) {
      btnClose.addEventListener('click', closeImageLightbox);
    }
    const modal = document.getElementById('image-lightbox-modal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeImageLightbox();
      });
    }
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeImageLightbox();
    });
  }

  // Stats Bar
  function updateStatsBar() {
    const answeredCount = Object.keys(userAnswers).length;
    const totalCount = questions.length;
    let correctCount = 0;
    for (const id in userAnswers) {
      if (userAnswers[id].isCorrect) correctCount++;
    }
    const accuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

    const elAns = document.getElementById('stat-answered-count');
    const elTot = document.getElementById('stat-total-count');
    const elAcc = document.getElementById('stat-accuracy');

    if (elAns) elAns.textContent = answeredCount;
    if (elTot) elTot.textContent = totalCount;
    if (elAcc) elAcc.textContent = accuracy + '%';
  }

  // Tab Navigation
  function setupTabNavigation() {
    const tabBtns = document.querySelectorAll('.nav-tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        document.querySelectorAll('.tab-pane').forEach(pane => {
          pane.classList.remove('active');
        });
        const targetPane = document.getElementById(targetTab);
        if (targetPane) targetPane.classList.add('active');

        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }

  // Filter Setup
  function setupFilters() {
    const sourceSelect = document.getElementById('filter-source');
    if (sourceSelect) {
      sourceSelect.addEventListener('change', (e) => {
        currentSource = e.target.value;
        practiceDisplayLimit = 100;
        renderPracticeQuestions();
      });
    }

    const statusBtns = document.querySelectorAll('[data-status]');
    statusBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        statusBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentStatus = btn.getAttribute('data-status');
        practiceDisplayLimit = 100;
        renderPracticeQuestions();
      });
    });

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      let timeout = null;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          searchKeyword = e.target.value.trim().toLowerCase();
          renderPracticeQuestions();
        }, 200);
      });
    }

    const btnReset = document.getElementById('btn-reset-progress');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        if (confirm(`Bạn có chắc muốn xóa lịch sử làm bài môn ${currentSubject === 'tthcm' ? 'Tư Tưởng Hồ Chí Minh' : 'Vi Xử Lý'} không?`)) {
          userAnswers = {};
          saveState();
          renderPracticeQuestions();
        }
      });
    }
  }

  // Filter Logic
  function getFilteredQuestions() {
    return questions.filter(q => {
      // Source filter
      if (currentSubject === 'xstk') {
        if (currentSource !== 'ALL') {
          if (currentSource.startsWith('CHAP_')) {
            const chapNum = parseInt(currentSource.replace('CHAP_', ''), 10);
            if (q.chapter !== chapNum) return false;
          } else {
            if (q.source !== currentSource) return false;
          }
        }
      } else if (currentSubject === 'vldc') {
        if (currentSource !== 'ALL') {
          if (currentSource.startsWith('CHAP_')) {
            const chapNum = parseInt(currentSource.replace('CHAP_', ''), 10);
            if (q.chapter !== chapNum) return false;
          } else {
            if (q.source !== currentSource) return false;
          }
        }
      } else if (currentSubject === 'tthcm') {
        if (currentSource !== 'ALL') {
          if (currentSource.startsWith('CHAP_')) {
            const chapNum = parseInt(currentSource.replace('CHAP_', ''), 10);
            if (q.chapter !== chapNum) return false;
          } else {
            if (q.source !== currentSource) return false;
          }
        }
      } else {
        if (currentSource === 'ALL_EXAMS') {
          if (!q.exam_id || !q.exam_id.startsWith('DE_')) return false;
        } else if (currentSource !== 'ALL') {
          if (q.exam_id !== currentSource) return false;
        }
      }

      // CLO / Chapter filter
      if (currentClo !== 'ALL') {
        if (currentSubject === 'xstk' || currentSubject === 'vldc' || currentSubject === 'tthcm') {
          if (String(q.chapter) !== currentClo) return false;
        } else {
          if (q.clo !== currentClo) return false;
        }
      }

      // Status filter
      const userState = userAnswers[q.id];
      if (currentStatus === 'UNANSWERED') {
        if (userState) return false;
      } else if (currentStatus === 'CORRECT') {
        if (!userState || !userState.isCorrect) return false;
      } else if (currentStatus === 'WRONG') {
        if (!userState || userState.isCorrect) return false;
      } else if (currentStatus === 'STARRED') {
        if (!starredQuestions.has(q.id)) return false;
      }

      // Keyword search
      if (searchKeyword) {
        const fullContent = (q.prompt + ' ' + (q.extra_lines || []).join(' ') + ' ' + (q.options || []).join(' ') + ' ' + (q.topic_name || '') + ' ' + (q.chapter_title || '')).toLowerCase();
        if (!fullContent.includes(searchKeyword)) return false;
      }

      return true;
    });
  }

  // Render Practice Arena Questions
  function renderPracticeQuestions() {
    const container = document.getElementById('questions-container');
    if (!container) return;

    const filtered = getFilteredQuestions();

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="neo-box" style="padding: 40px; text-align: center;">
          <p style="font-size: 2.5rem; margin-bottom: 12px;">🔍</p>
          <h3 style="font-weight: 900; font-size: 1.25rem;">Không tìm thấy câu hỏi phù hợp</h3>
          <p style="color: #666; margin-top: 6px;">Vui lòng thử chọn bộ lọc khác hoặc xóa từ khóa tìm kiếm.</p>
        </div>
      `;
      return;
    }

    let subjName = currentSubject === 'xstk' ? 'Xác Suất Thống Kê' : (currentSubject === 'vldc' ? 'Vật Lý Đại Cương' : (currentSubject === 'tthcm' ? 'Tư Tưởng HCM' : 'Vi Xử Lý'));
    let sourceLabel = currentSource;
    if (currentSource === 'ALL') sourceLabel = `Toàn Bộ Ngân Hàng ${subjName}`;
    else if (currentSource === 'ALL_EXAMS') sourceLabel = '5 Đề Thi Chính Thức KMA';

    container.innerHTML = `
      <div style="font-weight: 800; font-size: 0.95rem; margin-bottom: 4px; display: flex; justify-content: space-between; align-items: center;">
        <span>Hiển thị <strong>${filtered.length}</strong> câu hỏi (${subjName})</span>
        <span class="neo-badge badge-exam">${sourceLabel}</span>
      </div>
    `;

    const displayList = filtered.slice(0, practiceDisplayLimit);

    displayList.forEach((q, idx) => {
      const card = createQuestionCard(q, idx + 1, false);
      container.appendChild(card);
    });

    if (filtered.length > practiceDisplayLimit) {
      const loadMoreBox = document.createElement('div');
      loadMoreBox.style.cssText = 'text-align: center; margin: 24px 0 32px 0;';

      const loadMoreBtn = document.createElement('button');
      loadMoreBtn.className = 'neo-btn neo-btn-yellow';
      loadMoreBtn.style.padding = '12px 28px';
      loadMoreBtn.innerHTML = `⏬ Xem thêm 100 câu tiếp theo (Còn ${filtered.length - practiceDisplayLimit} câu)`;
      loadMoreBtn.addEventListener('click', () => {
        practiceDisplayLimit += 100;
        renderPracticeQuestions();
      });

      loadMoreBox.appendChild(loadMoreBtn);
      container.appendChild(loadMoreBox);
    }

    renderMath(container);
  }

  // Create Question Card DOM
  function createQuestionCard(q, displayIndex, isExamMode) {
    const card = document.createElement('div');
    card.className = 'question-card neo-box';
    card.id = `q-card-${q.id}`;

    const isStarred = starredQuestions.has(q.id);
    const userState = isExamMode ? examUserAnswers[q.id] : userAnswers[q.id];

    // Meta Header
    const metaHeader = document.createElement('div');
    metaHeader.className = 'q-meta-header';

    const badges = document.createElement('div');
    badges.className = 'q-badges';

    const sourceBadge = document.createElement('span');
    sourceBadge.className = 'neo-badge badge-exam';
    sourceBadge.textContent = q.source_title ? `${q.source_title} • Câu ${q.num}` : (q.exam_title ? `${q.exam_title} • Câu ${q.num}` : `${q.source} • Câu ${q.num}`);
    badges.appendChild(sourceBadge);

    if (currentSubject === 'xstk' || currentSubject === 'vldc' || currentSubject === 'tthcm') {
      const chapBadge = document.createElement('span');
      chapBadge.className = `neo-badge badge-chap${q.chapter || 1}`;
      chapBadge.textContent = `Chương ${q.chapter || 1}`;
      badges.appendChild(chapBadge);

      if (q.topic_name) {
        const topicBadge = document.createElement('span');
        topicBadge.className = 'neo-badge';
        topicBadge.style.background = 'var(--neo-gray)';
        topicBadge.textContent = q.topic_name;
        badges.appendChild(topicBadge);
      }
    } else {
      const cloBadge = document.createElement('span');
      cloBadge.className = `neo-badge badge-${q.clo ? q.clo.toLowerCase() : 'clo2'}`;
      cloBadge.textContent = `${q.clo || 'CLO2'} • ${q.level || 'TH'}`;
      badges.appendChild(cloBadge);

      if (q.topic_name) {
        const topicBadge = document.createElement('span');
        topicBadge.className = 'neo-badge';
        topicBadge.style.background = 'var(--neo-gray)';
        topicBadge.textContent = q.topic_name;
        badges.appendChild(topicBadge);
      }
    }

    metaHeader.appendChild(badges);

    if (!isExamMode) {
      const starBtn = document.createElement('button');
      starBtn.className = `q-star-btn ${isStarred ? 'starred' : ''}`;
      starBtn.title = isStarred ? 'Bỏ đánh dấu' : 'Gắn sao câu hỏi này';
      starBtn.innerHTML = isStarred ? '⭐' : '☆';
      starBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (starredQuestions.has(q.id)) {
          starredQuestions.delete(q.id);
          starBtn.classList.remove('starred');
          starBtn.innerHTML = '☆';
        } else {
          starredQuestions.add(q.id);
          starBtn.classList.add('starred');
          starBtn.innerHTML = '⭐';
        }
        saveState();
      });
      metaHeader.appendChild(starBtn);
    }

    card.appendChild(metaHeader);

    // Prompt Box
    const promptBox = document.createElement('div');
    promptBox.className = 'q-prompt-box';

    const promptTitle = document.createElement('div');
    promptTitle.className = 'q-title';
    promptTitle.innerHTML = `<strong>Câu ${displayIndex}.</strong> ${escapeHtml(q.prompt)}`;
    promptBox.appendChild(promptTitle);

    // Extra lines / Code
    if (q.extra_lines && q.extra_lines.length > 0) {
      const hasCode = q.extra_lines.some(l => /^(ORG|MOV|ADD|SUBB|INC|DEC|CPL|SETB|JMP|LJMP|SJMP|AJMP|DJNZ|CJNE|JNZ|JZ|CLR|RET|RETI|DB|DW|EQU|END|TIMER|UART|START|LAP|LOOP|DL|TAB)/i.test(l.trim()));
      
      if (hasCode) {
        const codeBlock = document.createElement('pre');
        codeBlock.className = 'q-extra-code';
        codeBlock.textContent = q.extra_lines.join('\n');
        promptBox.appendChild(codeBlock);
      } else {
        const extraText = document.createElement('div');
        extraText.style.cssText = 'font-weight: 700; font-size: 0.92rem; color: #444; margin: 8px 0;';
        extraText.innerHTML = q.extra_lines.map(l => escapeHtml(l)).join('<br/>');
        promptBox.appendChild(extraText);
      }
    }

    // Images
    if (q.images && q.images.length > 0) {
      q.images.forEach(imgSrc => {
        const imgWrap = document.createElement('div');
        imgWrap.className = 'q-image-container';
        const imgEl = document.createElement('img');
        imgEl.src = imgSrc;
        imgEl.alt = 'Sơ đồ mạch minh họa';
        imgEl.loading = 'eager';
        imgEl.style.cursor = 'zoom-in';
        imgEl.title = 'Click để xem phóng to sơ đồ';
        imgEl.onclick = () => openImageLightbox(imgSrc);
        imgWrap.appendChild(imgEl);
        promptBox.appendChild(imgWrap);
      });
    }

    card.appendChild(promptBox);

    // Options Grid
    if (q.type === 'mcq' && q.options && q.options.length > 0) {
      const optsGrid = document.createElement('div');
      optsGrid.className = 'options-grid';

      q.options.forEach((optStr, optIdx) => {
        const letter = String.fromCharCode(65 + optIdx); // A, B, C, D
        const optBtn = document.createElement('button');
        optBtn.className = 'option-btn';
        optBtn.setAttribute('data-letter', letter);

        let cleanOptText = optStr;
        if (cleanOptText.startsWith(`${letter}.`)) {
          cleanOptText = cleanOptText.substring(2).trim();
        }

        optBtn.innerHTML = `
          <span class="option-letter">${letter}</span>
          <span style="flex: 1;">${escapeHtml(cleanOptText)}</span>
        `;

        // Check if already answered
        if (userState) {
          if (userState.answer === letter) {
            optBtn.classList.add(userState.isCorrect ? 'selected-correct' : 'selected-wrong');
          }
          if (!isExamMode && !userState.isCorrect && q.answer === letter) {
            optBtn.classList.add('highlight-correct');
          }
        }

        optBtn.addEventListener('click', () => {
          handleSelectMCQ(q, letter, card, optsGrid, isExamMode);
        });

        optsGrid.appendChild(optBtn);
      });

      card.appendChild(optsGrid);
    } else {
      // Fill-in-the-blank (FIB)
      const fibBox = document.createElement('div');
      fibBox.className = 'fib-box';

      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'fib-input';
      input.placeholder = 'NHẬP KẾT QUẢ...';

      if (userState && userState.inputVal) {
        input.value = userState.inputVal;
      }

      const checkBtn = document.createElement('button');
      checkBtn.className = 'neo-btn neo-btn-sm';
      checkBtn.textContent = 'Kiểm tra';

      const feedback = document.createElement('span');
      feedback.className = 'fib-feedback';

      if (userState) {
        feedback.className = `fib-feedback ${userState.isCorrect ? 'correct' : 'wrong'}`;
        feedback.textContent = userState.isCorrect ? 'ĐÚNG ✅' : `SAI ❌ (Đ.Á: ${q.answer})`;
      }

      const triggerCheck = () => {
        const val = input.value.trim();
        if (!val) return;
        handleCheckFIB(q, val, feedback, card, isExamMode);
      };

      checkBtn.addEventListener('click', triggerCheck);
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') triggerCheck();
      });

      fibBox.appendChild(input);
      fibBox.appendChild(checkBtn);
      fibBox.appendChild(feedback);
      card.appendChild(fibBox);
    }

    // Action Row
    if (!isExamMode) {
      const actionRow = document.createElement('div');
      actionRow.className = 'q-action-row';

      const showExpBtn = document.createElement('button');
      showExpBtn.className = 'neo-btn neo-btn-white neo-btn-sm';
      showExpBtn.innerHTML = currentSubject === 'tthcm' ? '💡 Xem Lời Giải & Mẹo Nhớ' : '💡 Xem Lời Giải & Mẹo Casio';
      showExpBtn.addEventListener('click', () => {
        openSideDetails(q);
        highlightActiveCard(card);
      });

      actionRow.appendChild(showExpBtn);
      card.appendChild(actionRow);
    }

    // Click card to open side drawer
    card.addEventListener('click', (e) => {
      if (isExamMode) return;
      if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'INPUT') {
        openSideDetails(q);
        highlightActiveCard(card);
      }
    });

    return card;
  }

  function highlightActiveCard(card) {
    document.querySelectorAll('.question-card').forEach(c => c.classList.remove('active-selected'));
    card.classList.add('active-selected');
  }

  // Handle MCQ selection
  function handleSelectMCQ(q, letter, card, optsGrid, isExamMode) {
    const isCorrect = (letter.toUpperCase() === q.answer.toUpperCase());

    if (isExamMode) {
      examUserAnswers[q.id] = { answer: letter, isCorrect };
      optsGrid.querySelectorAll('.option-btn').forEach(btn => {
        btn.classList.remove('selected-correct', 'selected-wrong');
        if (btn.getAttribute('data-letter') === letter) {
          btn.classList.add('selected-correct');
        }
      });
      updateExamProgress();
      return;
    }

    // Practice Mode
    userAnswers[q.id] = { answer: letter, isCorrect };
    saveState();

    optsGrid.querySelectorAll('.option-btn').forEach(btn => {
      btn.classList.remove('selected-correct', 'selected-wrong', 'highlight-correct');
      const bLetter = btn.getAttribute('data-letter');
      if (bLetter === letter) {
        btn.classList.add(isCorrect ? 'selected-correct' : 'selected-wrong');
      }
      if (!isCorrect && bLetter === q.answer) {
        btn.classList.add('highlight-correct');
      }
    });

    openSideDetails(q);
    highlightActiveCard(card);
  }

  // Handle FIB input
  function handleCheckFIB(q, val, feedbackEl, card, isExamMode) {
    const norm = val.trim().toUpperCase().replace(/H$/, '');
    let isCorrect = false;

    if (q.acceptable_answers && q.acceptable_answers.length > 0) {
      isCorrect = q.acceptable_answers.some(ans => {
        const aNorm = ans.trim().toUpperCase().replace(/H$/, '');
        return norm === aNorm || val.trim().toLowerCase() === ans.trim().toLowerCase();
      });
    } else {
      isCorrect = norm === q.answer.trim().toUpperCase().replace(/H$/, '');
    }

    if (isExamMode) {
      examUserAnswers[q.id] = { inputVal: val, isCorrect };
      feedbackEl.className = 'fib-feedback correct';
      feedbackEl.textContent = 'ĐÃ GHI NHẬN ✍️';
      updateExamProgress();
      return;
    }

    userAnswers[q.id] = { inputVal: val, isCorrect };
    saveState();

    feedbackEl.className = `fib-feedback ${isCorrect ? 'correct' : 'wrong'}`;
    feedbackEl.textContent = isCorrect ? 'ĐÚNG ✅' : `SAI ❌ (Đ.Á: ${q.answer})`;

    openSideDetails(q);
    highlightActiveCard(card);
  }

  // Side Drawer Display
  function openSideDetails(q) {
    const titleEl = document.getElementById('panel-q-title');
    const badgeEl = document.getElementById('panel-q-badge');
    const contentEl = document.getElementById('panel-content');

    if (!titleEl || !contentEl) return;

    titleEl.textContent = `💡 LỜI GIẢI • CÂU ${q.num}`;
    badgeEl.textContent = q.source_title || q.exam_title || q.source || 'Chi Tiết';

    let html = `
      <div class="panel-section sec-exp">
        <div class="panel-section-title">
          <span>💡 Lời Giải Chi Tiết</span>
        </div>
        <div class="panel-text">
          <p style="margin-bottom: 8px;"><strong>Đáp án đúng: <span class="neo-badge badge-correct" style="font-size: 0.85rem;">${escapeHtml(q.answer)}</span></strong></p>
          <p>${escapeHtml(q.explanation || 'Chưa có lời giải chi tiết.')}</p>
        </div>
      </div>
    `;

    if (q.methodology) {
      html += `
        <div class="panel-section sec-meth">
          <div class="panel-section-title">
            <span>📐 Phương Pháp Làm Dạng Bài</span>
          </div>
          <div class="panel-text">
            <p>${escapeHtml(q.methodology)}</p>
          </div>
        </div>
      `;
    }

    const tipContent = q.tips_casio || q.tips;
    if (tipContent) {
      const tipHeader = currentSubject === 'tthcm' ? 'Mẹo Nhớ Nhanh & Mốc Năm' : (currentSubject === 'vldc' ? 'Mẹo Casio fx-580VNX & Công Thức Giải Nhanh' : 'Mẹo Nhớ & Mẹo Bấm Máy Casio fx-580VNX');
      html += `
        <div class="panel-section sec-casio">
          <div class="panel-section-title">
            <span>⚡ ${tipHeader}</span>
          </div>
          <div class="panel-text">
            <p>${escapeHtml(tipContent)}</p>
          </div>
        </div>
      `;
    }

    contentEl.innerHTML = html;
    renderMath(contentEl);
  }

  // Setup Knowledge Hub Cards
  function setupKnowledgeHub() {
    const container = document.getElementById('knowledge-chapters-container');
    if (!container || !knowledge || !knowledge.chapters) return;

    container.innerHTML = '';

    knowledge.chapters.forEach(chap => {
      const card = document.createElement('div');
      card.className = 'chapter-card';

      const header = document.createElement('div');
      header.className = `chapter-header ${chap.id}`;
      header.innerHTML = `
        <div>
          <span class="neo-badge" style="background:#000; color:#fff; font-size: 0.75rem; margin-bottom: 4px;">${chap.clo || `CHƯƠNG ${chap.num}`}</span>
          <h3 class="chapter-title">${escapeHtml(chap.title)}</h3>
        </div>
        <span style="font-size: 1.2rem;">▼</span>
      `;

      const body = document.createElement('div');
      body.className = 'chapter-body';

      if (chap.summary) {
        const sumP = document.createElement('p');
        sumP.style.cssText = 'font-weight: 700; margin-bottom: 16px; color: #333; font-size: 0.95rem;';
        sumP.textContent = chap.summary;
        body.appendChild(sumP);
      }

      if (chap.sections && chap.sections.length > 0) {
        chap.sections.forEach(sec => {
          const secDiv = document.createElement('div');
          secDiv.className = 'section-item';

          const secTitle = document.createElement('h4');
          secTitle.className = 'section-title';
          secTitle.textContent = sec.title;
          secDiv.appendChild(secTitle);

          const secContent = document.createElement('div');
          secContent.className = 'section-content';

          if (Array.isArray(sec.content)) {
            sec.content.forEach(pText => {
              const p = document.createElement('p');
              p.innerHTML = formatMarkdownText(pText);
              secContent.appendChild(p);
            });
          } else {
            const p = document.createElement('p');
            p.innerHTML = formatMarkdownText(sec.content);
            secContent.appendChild(p);
          }

          secDiv.appendChild(secContent);
          body.appendChild(secDiv);
        });
      } else {
        // VLDC Chapter structure
        if (chap.core_formulas && chap.core_formulas.length > 0) {
          const secDiv = document.createElement('div');
          secDiv.className = 'section-item';
          const secTitle = document.createElement('h4');
          secTitle.className = 'section-title';
          secTitle.textContent = '📐 Công Thức Cốt Lõi';
          secDiv.appendChild(secTitle);

          const secContent = document.createElement('div');
          secContent.className = 'section-content';
          chap.core_formulas.forEach(cf => {
            const fBox = document.createElement('div');
            fBox.style.cssText = 'background: #F8FAFC; border: 1.5px solid #000; border-radius: 6px; padding: 10px; margin-bottom: 8px;';
            fBox.innerHTML = `
              <div style="font-weight: 800; color: #1E3A8A; margin-bottom: 4px;">${escapeHtml(cf.name)}</div>
              <div style="font-family: monospace; font-size: 1rem; font-weight: 900; background: #FEF08A; padding: 4px 8px; border: 1px solid #000; border-radius: 4px; display: inline-block; margin-bottom: 6px;">${escapeHtml(cf.formula)}</div>
              <div style="font-size: 0.88rem; color: #475569;">${escapeHtml(cf.desc)}</div>
            `;
            secContent.appendChild(fBox);
          });
          secDiv.appendChild(secContent);
          body.appendChild(secDiv);
        }

        if (chap.magic_rules && chap.magic_rules.length > 0) {
          const secDiv = document.createElement('div');
          secDiv.className = 'section-item';
          const secTitle = document.createElement('h4');
          secTitle.className = 'section-title';
          secTitle.textContent = '⚡ Quy Tắc Vàng & Mẹo Nhận Diện';
          secDiv.appendChild(secTitle);

          const secContent = document.createElement('div');
          secContent.className = 'section-content';
          chap.magic_rules.forEach(mr => {
            const p = document.createElement('p');
            p.style.cssText = 'font-weight: 700; margin-bottom: 6px; color: #065F46; font-size: 0.9rem;';
            p.innerHTML = `• ${escapeHtml(mr)}`;
            secContent.appendChild(p);
          });
          secDiv.appendChild(secContent);
          body.appendChild(secDiv);
        }

        if (chap.casio_shortcuts && chap.casio_shortcuts.length > 0) {
          const secDiv = document.createElement('div');
          secDiv.className = 'section-item';
          const secTitle = document.createElement('h4');
          secTitle.className = 'section-title';
          secTitle.textContent = '📟 Bấm Máy Casio fx-580VNX';
          secDiv.appendChild(secTitle);

          const secContent = document.createElement('div');
          secContent.className = 'section-content';
          chap.casio_shortcuts.forEach(cs => {
            const p = document.createElement('p');
            p.style.cssText = 'font-family: monospace; background: #FEF3C7; padding: 6px 10px; border: 1px dashed #B45309; border-radius: 4px; margin-bottom: 6px; font-weight: 800; color: #92400E; font-size: 0.85rem;';
            p.textContent = cs;
            secContent.appendChild(p);
          });
          secDiv.appendChild(secContent);
          body.appendChild(secDiv);
        }
      }

      card.appendChild(header);
      card.appendChild(body);
      container.appendChild(card);
    });

    // If TTHCM, add Timeline & Magic Keywords table cards
    if (currentSubject === 'tthcm' && knowledge.timeline) {
      const timelineCard = document.createElement('div');
      timelineCard.className = 'chapter-card';
      timelineCard.innerHTML = `
        <div class="chapter-header tthcm-timeline">
          <div>
            <span class="neo-badge" style="background:#EF4444; color:#fff; font-size: 0.75rem; margin-bottom: 4px;">BIÊN NIÊN SỬ</span>
            <h3 class="chapter-title">Biên Niên Sử Hoạt Động Cách Mạng (1890 - 1969)</h3>
          </div>
          <span style="font-size: 1.2rem;">▼</span>
        </div>
        <div class="chapter-body">
          <table class="table-custom" style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #FFE600; font-weight: 800;">
                <th style="padding: 8px 10px; border: 2px solid #000; width: 15%;">Mốc Năm</th>
                <th style="padding: 8px 10px; border: 2px solid #000;">Sự Kiện Lịch Sử Trọng Đại</th>
              </tr>
            </thead>
            <tbody>
              ${knowledge.timeline.map(t => `
                <tr>
                  <td style="padding: 8px 10px; border: 1.5px solid #000; font-weight: 800;">${escapeHtml(t.year)}</td>
                  <td style="padding: 8px 10px; border: 1.5px solid #000;">${escapeHtml(t.event)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
      container.appendChild(timelineCard);

      const kwCard = document.createElement('div');
      kwCard.className = 'chapter-card';
      kwCard.innerHTML = `
        <div class="chapter-header tthcm-keywords">
          <div>
            <span class="neo-badge" style="background:#10B981; color:#fff; font-size: 0.75rem; margin-bottom: 4px;">MẸO THI TRẮC NGHIỆM</span>
            <h3 class="chapter-title">Bảng "Từ Khóa Vàng" Làm Trắc Nghiệm Nhanh</h3>
          </div>
          <span style="font-size: 1.2rem;">▼</span>
        </div>
        <div class="chapter-body">
          <table class="table-custom" style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #FFE600; font-weight: 800;">
                <th style="padding: 8px 10px; border: 2px solid #000; width: 50%;">Cụm Từ Khóa Xuất Hiện</th>
                <th style="padding: 8px 10px; border: 2px solid #000;">Đáp Án Khớp Trực Tiếp</th>
              </tr>
            </thead>
            <tbody>
              ${(knowledge.magic_keywords || []).map(mk => `
                <tr>
                  <td style="padding: 8px 10px; border: 1.5px solid #000; font-weight: 700;">${escapeHtml(mk.keyword)}</td>
                  <td style="padding: 8px 10px; border: 1.5px solid #000; color: #065F46; font-weight: 800;">${escapeHtml(mk.match)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
      container.appendChild(kwCard);
    }

    // If VLDC, add Magic Keywords table card
    if (currentSubject === 'vldc' && knowledge.magic_keywords) {
      const kwCard = document.createElement('div');
      kwCard.className = 'chapter-card';
      kwCard.innerHTML = `
        <div class="chapter-header" style="background: #93C5FD;">
          <div>
            <span class="neo-badge" style="background:#1D4ED8; color:#fff; font-size: 0.75rem; margin-bottom: 4px;">TỪ KHÓA & CÔNG THỨC VÀNG</span>
            <h3 class="chapter-title">Bảng "Từ Khóa Vàng" & Công Thức Tính Nhanh VLDC</h3>
          </div>
          <span style="font-size: 1.2rem;">▼</span>
        </div>
        <div class="chapter-body">
          <table class="table-custom" style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #FFE600; font-weight: 800;">
                <th style="padding: 8px 10px; border: 2px solid #000; width: 42%;">Dạng Đề / Hiện Tượng</th>
                <th style="padding: 8px 10px; border: 2px solid #000;">Công Thức Khóa & Chú Ý</th>
              </tr>
            </thead>
            <tbody>
              ${knowledge.magic_keywords.map(mk => `
                <tr>
                  <td style="padding: 8px 10px; border: 1.5px solid #000; font-weight: 700;">${escapeHtml(mk.keyword)}</td>
                  <td style="padding: 8px 10px; border: 1.5px solid #000; color: #1E3A8A; font-weight: 800;">${escapeHtml(mk.match)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
      container.appendChild(kwCard);
    }

    // Casio Handbook table card (VLDC & XSTK)
    if (knowledge && knowledge.casio_handbook) {
      const isXstk = currentSubject === 'xstk';
      const casioCard = document.createElement('div');
      casioCard.className = 'chapter-card';
      casioCard.innerHTML = `
        <div class="chapter-header" style="background: #A7F3D0;">
          <div>
            <span class="neo-badge" style="background:#065F46; color:#fff; font-size: 0.75rem; margin-bottom: 4px;">SỔ TAY CASIO fx-580VNX</span>
            <h3 class="chapter-title">${isXstk ? 'Thủ Thuật Thống Kê, Phân Phối Chuẩn & Phím Bấm Casio fx-580VNX' : 'Tra Cứu Hằng Số & Chuyển Đổi Đơn Vị (CONST & CONV)'}</h3>
          </div>
          <span style="font-size: 1.2rem;">▼</span>
        </div>
        <div class="chapter-body">
          <table class="table-custom" style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #FFE600; font-weight: 800;">
                <th style="padding: 8px 10px; border: 2px solid #000; width: 35%;">${isXstk ? 'Chức Năng Thống Kê' : 'Đại Lượng Vật Lý'}</th>
                <th style="padding: 8px 10px; border: 2px solid #000; width: 32%;">Phím Bấm Casio</th>
                <th style="padding: 8px 10px; border: 2px solid #000;">${isXstk ? 'Ý Nghĩa / Kết Quả' : 'Giá Trị Chuẩn SI'}</th>
              </tr>
            </thead>
            <tbody>
              ${knowledge.casio_handbook.map(c => `
                <tr>
                  <td style="padding: 8px 10px; border: 1.5px solid #000; font-weight: 700;">${escapeHtml(c.name)}</td>
                  <td style="padding: 8px 10px; border: 1.5px solid #000; font-family: monospace; font-weight: 800; color: #991B1B;">${escapeHtml(c.shortcut)}</td>
                  <td style="padding: 8px 10px; border: 1.5px solid #000; font-weight: 700;">${escapeHtml(c.value)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
      container.appendChild(casioCard);
    }
    renderMath(container);
  }

  // Exam Simulator Logic
  function setupExamSimulator() {
    const examGrid = document.getElementById('exam-select-grid') || document.querySelector('.exam-select-grid') || document.querySelector('.exam-grid-choices');
    if (examGrid) {
      examGrid.addEventListener('click', (e) => {
        const card = e.target.closest('.exam-card-choice');
        if (!card) return;
        examGrid.querySelectorAll('.exam-card-choice').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        currentExamCode = card.getAttribute('data-exam-code') || 'RANDOM';
        updateStartExamButton();
      });
    }

    const btnStart = document.getElementById('btn-start-exam');
    if (btnStart) {
      btnStart.addEventListener('click', startExam);
    }

    const btnExit = document.getElementById('btn-exit-exam');
    if (btnExit) {
      btnExit.addEventListener('click', () => {
        if (confirm('Bạn có chắc muốn thoát bài thi hiện tại để chọn đề khác không?')) {
          clearInterval(examTimerInterval);
          examActive = false;
          document.getElementById('exam-active-view').style.display = 'none';
          document.getElementById('exam-setup-view').style.display = 'block';
          updateExamSetupUI();
        }
      });
    }

    const btnSubmit = document.getElementById('btn-submit-exam');
    if (btnSubmit) {
      btnSubmit.addEventListener('click', () => {
        const answeredCount = Object.keys(examUserAnswers).length;
        if (answeredCount < examQuestions.length) {
          if (!confirm(`Bạn mới làm ${answeredCount} / ${examQuestions.length} câu. Bạn có chắc chắn muốn nộp bài thi ngay không?`)) {
            return;
          }
        }
        finishExam();
      });
    }

    const btnCloseModal = document.getElementById('btn-close-modal');
    if (btnCloseModal) {
      btnCloseModal.addEventListener('click', () => {
        document.getElementById('exam-result-modal').classList.remove('active');
        document.getElementById('exam-setup-view').style.display = 'block';
        document.getElementById('exam-active-view').style.display = 'none';
        updateExamSetupUI();
      });
    }

    const btnReviewExam = document.getElementById('btn-review-exam');
    if (btnReviewExam) {
      btnReviewExam.addEventListener('click', () => {
        document.getElementById('exam-result-modal').classList.remove('active');
        reviewExamQuestions();
      });
    }
  }

  function startExam() {
    examUserAnswers = {};
    examActive = true;
    examTimeRemaining = (currentSubject === 'xstk' ? 60 : (currentSubject === 'vldc' ? 45 : (currentSubject === 'tthcm' ? 40 : 60))) * 60;

    if (currentSubject === 'xstk') {
      if (currentExamCode === 'RANDOM') {
        const shuffled = [...questions].sort(() => 0.5 - Math.random());
        examQuestions = shuffled.slice(0, Math.min(40, shuffled.length));
      } else if (currentExamCode === 'XSTK_PROB') {
        const prob = questions.filter(q => (q.chapter_id || q.chapter) <= 5);
        const shuffled = [...prob].sort(() => 0.5 - Math.random());
        examQuestions = shuffled.slice(0, Math.min(40, shuffled.length));
      } else if (currentExamCode === 'XSTK_STAT') {
        const stat = questions.filter(q => (q.chapter_id || q.chapter) >= 6);
        const shuffled = [...stat].sort(() => 0.5 - Math.random());
        examQuestions = shuffled.slice(0, Math.min(40, shuffled.length));
      } else {
        const matched = questions.filter(q => q.source === currentExamCode);
        const others = questions.filter(q => q.source !== currentExamCode).sort(() => 0.5 - Math.random());
        examQuestions = [...matched, ...others].slice(0, Math.min(40, questions.length));
      }
    } else if (currentSubject === 'vldc') {
      if (currentExamCode === 'NOTION_DE_CUOI') {
        const match = questions.filter(q => q.source === 'NOTION_DE_CUOI');
        examQuestions = match.length > 0 ? [...match] : questions.slice(0, 38);
      } else if (currentExamCode === 'NOTION_TEST_100') {
        const match = questions.filter(q => q.source === 'NOTION_TEST_100');
        examQuestions = match.length > 0 ? [...match] : questions.slice(0, 35);
      } else if (currentExamCode === 'VLDC_OPTICS') {
        const optics = questions.filter(q => (q.chapter_id || q.chapter) <= 2);
        const shuffled = [...optics].sort(() => 0.5 - Math.random());
        examQuestions = shuffled.slice(0, Math.min(30, shuffled.length));
      } else if (currentExamCode === 'VLDC_QUANTUM') {
        const quantum = questions.filter(q => (q.chapter_id || q.chapter) >= 3);
        const shuffled = [...quantum].sort(() => 0.5 - Math.random());
        examQuestions = shuffled.slice(0, Math.min(30, shuffled.length));
      } else {
        const shuffled = [...questions].sort(() => 0.5 - Math.random());
        examQuestions = shuffled.slice(0, 40);
      }
    } else if (currentSubject === 'tthcm') {
      if (currentExamCode === 'RANDOM') {
        const shuffled = [...questions].sort(() => 0.5 - Math.random());
        examQuestions = shuffled.slice(0, 40);
      } else {
        const matched = questions.filter(q => q.source === currentExamCode);
        const shuffled = [...matched].sort(() => 0.5 - Math.random());
        examQuestions = shuffled.length >= 40 ? shuffled.slice(0, 40) : shuffled;
      }
    } else {
      // KTVXL
      if (currentExamCode === 'RANDOM') {
        const shuffled = [...questions].sort(() => 0.5 - Math.random());
        examQuestions = shuffled.slice(0, 40);
      } else {
        const targetExamId = currentExamCode.startsWith('DE_')
          ? currentExamCode
          : `DE_${String(currentExamCode).padStart(3, '0')}`;
        const matched = questions.filter(q => q.exam_id === targetExamId);
        if (matched.length > 0) {
          examQuestions = [...matched];
        } else {
          const deNum = parseInt(currentExamCode, 10);
          const matchedNum = questions.filter(q => q.de_num === deNum);
          examQuestions = matchedNum.length > 0 ? matchedNum.slice(0, 40) : questions.slice(0, 40);
        }
      }
    }

    document.getElementById('exam-setup-view').style.display = 'none';
    document.getElementById('exam-active-view').style.display = 'block';

    const examTitleEl = document.getElementById('exam-current-name');
    if (examTitleEl) {
      const activeCard = document.querySelector('.exam-card-choice.selected');
      const cardTitle = activeCard ? activeCard.querySelector('.exam-title-choice, h3')?.textContent : null;
      const subjTag = currentSubject === 'xstk' ? 'XSTK' : (currentSubject === 'vldc' ? 'VLDC' : (currentSubject === 'tthcm' ? 'TTHCM' : 'KTVXL'));
      examTitleEl.textContent = cardTitle ? `${cardTitle} (${subjTag})` : (currentExamCode === 'RANDOM' ? `ĐỀ THI NGẪU NHIÊN (${subjTag})` : `BÀI THI: ${currentExamCode}`);
    }

    const examProgressEl = document.getElementById('exam-progress-text') || document.getElementById('exam-answered-stat');
    if (examProgressEl) {
      examProgressEl.textContent = `0/${examQuestions.length}`;
    }

    const paletteTitleEl = document.getElementById('exam-palette-title') || document.querySelector('.details-panel-container h4');
    if (paletteTitleEl) {
      paletteTitleEl.textContent = `BẢNG CÂU HỎI (1 - ${examQuestions.length})`;
    }

    renderExamQuestions();
    renderExamPalette();
    updateExamProgress();
    startExamTimer();
  }

  function startExamTimer() {
    clearInterval(examTimerInterval);
    const timerDisplay = document.getElementById('exam-timer-display');

    examTimerInterval = setInterval(() => {
      examTimeRemaining--;

      const mins = Math.floor(examTimeRemaining / 60);
      const secs = examTimeRemaining % 60;
      const str = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      if (timerDisplay) {
        timerDisplay.textContent = str;
        if (examTimeRemaining <= 5 * 60) {
          timerDisplay.classList.add('urgent');
        } else {
          timerDisplay.classList.remove('urgent');
        }
      }

      if (examTimeRemaining <= 0) {
        clearInterval(examTimerInterval);
        alert('Hết giờ làm bài! Hệ thống tự động thu bài thi của bạn.');
        finishExam();
      }
    }, 1000);
  }

  function renderExamQuestions() {
    const list = document.getElementById('exam-questions-list');
    if (!list) return;
    list.innerHTML = '';

    examQuestions.forEach((q, idx) => {
      const card = createQuestionCard(q, idx + 1, true);
      list.appendChild(card);
    });

    renderMath(list);
  }

  function renderExamPalette() {
    const grid = document.getElementById('exam-palette-grid');
    if (!grid) return;
    grid.innerHTML = '';

    examQuestions.forEach((q, idx) => {
      const btn = document.createElement('button');
      btn.className = 'palette-btn';
      btn.id = `palette-btn-${q.id}`;
      btn.textContent = idx + 1;
      btn.addEventListener('click', () => {
        const targetCard = document.getElementById(`q-card-${q.id}`);
        if (targetCard) {
          targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
          highlightActiveCard(targetCard);
        }
      });
      grid.appendChild(btn);
    });
  }

  function updateExamProgress() {
    const total = examQuestions.length;
    const answered = Object.keys(examUserAnswers).length;
    const statEl = document.getElementById('exam-progress-text') || document.getElementById('exam-answered-stat');
    const barEl = document.getElementById('exam-progress-bar');

    if (statEl) statEl.textContent = `${answered}/${total}`;
    if (barEl) barEl.style.width = `${Math.round((answered / total) * 100)}%`;

    for (const qId in examUserAnswers) {
      const pBtn = document.getElementById(`palette-btn-${qId}`);
      if (pBtn) pBtn.classList.add('answered');
    }
  }

  function finishExam() {
    clearInterval(examTimerInterval);
    examActive = false;

    let correctCount = 0;
    const total = examQuestions.length;

    examQuestions.forEach(q => {
      const userAns = examUserAnswers[q.id];
      if (userAns && userAns.isCorrect) {
        correctCount++;
      }
    });

    const score = total > 0 ? (correctCount / total) * 10 : 0;
    const scoreFormatted = (Math.round(score * 10) / 10).toFixed(1);

    const modalScore = document.getElementById('modal-score-val');
    const modalDetail = document.getElementById('modal-score-detail');
    if (modalScore) modalScore.textContent = scoreFormatted;
    if (modalDetail) {
      const totalMins = (currentSubject === 'xstk' ? 60 : (currentSubject === 'vldc' ? 45 : (currentSubject === 'tthcm' ? 40 : 60)));
      const minsSpent = Math.floor((totalMins * 60 - examTimeRemaining) / 60);
      const secsSpent = (totalMins * 60 - examTimeRemaining) % 60;
      modalDetail.textContent = `Đúng ${correctCount} / ${total} câu • Thời gian làm bài: ${minsSpent.toString().padStart(2, '0')}:${secsSpent.toString().padStart(2, '0')}`;
    }

    // Modal breakdown
    const clo1Stat = document.getElementById('clo1-result-stat');
    const clo1Bar = document.getElementById('clo1-progress-bar');
    const clo2Stat = document.getElementById('clo2-result-stat');
    const clo2Bar = document.getElementById('clo2-progress-bar');
    const clo3Stat = document.getElementById('clo3-result-stat');
    const clo3Bar = document.getElementById('clo3-progress-bar');

    if (clo1Stat && clo1Bar && clo2Stat && clo2Bar && clo3Stat && clo3Bar) {
      if (currentSubject === 'xstk') {
        const c123 = examQuestions.filter(q => q.chapter <= 3);
        const c45 = examQuestions.filter(q => q.chapter === 4 || q.chapter === 5);
        const c678 = examQuestions.filter(q => q.chapter >= 6);
        
        const corr123 = c123.filter(q => examUserAnswers[q.id] && examUserAnswers[q.id].isCorrect).length;
        const corr45 = c45.filter(q => examUserAnswers[q.id] && examUserAnswers[q.id].isCorrect).length;
        const corr678 = c678.filter(q => examUserAnswers[q.id] && examUserAnswers[q.id].isCorrect).length;

        clo1Stat.previousElementSibling.textContent = 'Chương 1-3: Biến cố, Xác suất & Rời rạc';
        clo1Stat.textContent = `${corr123}/${c123.length} câu`;
        clo1Bar.style.width = c123.length > 0 ? `${(corr123/c123.length)*100}%` : '0%';

        clo2Stat.previousElementSibling.textContent = 'Chương 4-5: Biến liên tục & 2 chiều';
        clo2Stat.textContent = `${corr45}/${c45.length} câu`;
        clo2Bar.style.width = c45.length > 0 ? `${(corr45/c45.length)*100}%` : '0%';

        clo3Stat.previousElementSibling.textContent = 'Chương 6-8: Lý thuyết mẫu, Ước lượng & Kiểm định';
        clo3Stat.textContent = `${corr678}/${c678.length} câu`;
        clo3Bar.style.width = c678.length > 0 ? `${(corr678/c678.length)*100}%` : '0%';
      } else if (currentSubject === 'vldc') {
        const c12 = examQuestions.filter(q => q.chapter === 1 || q.chapter === 2);
        const c34 = examQuestions.filter(q => q.chapter === 3 || q.chapter === 4);
        const c56 = examQuestions.filter(q => q.chapter === 5 || q.chapter === 6);
        
        const corr12 = c12.filter(q => examUserAnswers[q.id] && examUserAnswers[q.id].isCorrect).length;
        const corr34 = c34.filter(q => examUserAnswers[q.id] && examUserAnswers[q.id].isCorrect).length;
        const corr56 = c56.filter(q => examUserAnswers[q.id] && examUserAnswers[q.id].isCorrect).length;

        clo1Stat.previousElementSibling.textContent = 'Chương 1 & 2: Giao thoa & Nhiễu xạ ánh sáng';
        clo1Stat.textContent = `${corr12}/${c12.length} câu`;
        clo1Bar.style.width = c12.length > 0 ? `${(corr12/c12.length)*100}%` : '0%';

        clo2Stat.previousElementSibling.textContent = 'Chương 3 & 4: Phân cực & Thuyết tương đối';
        clo2Stat.textContent = `${corr34}/${c34.length} câu`;
        clo2Bar.style.width = c34.length > 0 ? `${(corr34/c34.length)*100}%` : '0%';

        clo3Stat.previousElementSibling.textContent = 'Chương 5 & 6: Quang lượng tử & Vật lý hạt nhân';
        clo3Stat.textContent = `${corr56}/${c56.length} câu`;
        clo3Bar.style.width = c56.length > 0 ? `${(corr56/c56.length)*100}%` : '0%';
      } else if (currentSubject === 'tthcm') {
        const c12 = examQuestions.filter(q => q.chapter === 1 || q.chapter === 2);
        const c34 = examQuestions.filter(q => q.chapter === 3 || q.chapter === 4);
        const c56 = examQuestions.filter(q => q.chapter === 5 || q.chapter === 6);
        
        const corr12 = c12.filter(q => examUserAnswers[q.id] && examUserAnswers[q.id].isCorrect).length;
        const corr34 = c34.filter(q => examUserAnswers[q.id] && examUserAnswers[q.id].isCorrect).length;
        const corr56 = c56.filter(q => examUserAnswers[q.id] && examUserAnswers[q.id].isCorrect).length;

        clo1Stat.previousElementSibling.textContent = 'Chương 1 & 2: Khái niệm & Cơ sở hình thành';
        clo1Stat.textContent = `${corr12}/${c12.length} câu`;
        clo1Bar.style.width = c12.length > 0 ? `${(corr12/c12.length)*100}%` : '0%';

        clo2Stat.previousElementSibling.textContent = 'Chương 3 & 4: Độc lập dân tộc, Đảng & Nhà nước';
        clo2Stat.textContent = `${corr34}/${c34.length} câu`;
        clo2Bar.style.width = c34.length > 0 ? `${(corr34/c34.length)*100}%` : '0%';

        clo3Stat.previousElementSibling.textContent = 'Chương 5 & 6: Đại đoàn kết, Văn hóa & Đạo đức';
        clo3Stat.textContent = `${corr56}/${c56.length} câu`;
        clo3Bar.style.width = c56.length > 0 ? `${(corr56/c56.length)*100}%` : '0%';
      } else {
        const qClo1 = examQuestions.filter(q => q.clo === 'CLO1');
        const qClo2 = examQuestions.filter(q => q.clo === 'CLO2');
        const qClo3 = examQuestions.filter(q => q.clo === 'CLO3');

        const corrClo1 = qClo1.filter(q => examUserAnswers[q.id] && examUserAnswers[q.id].isCorrect).length;
        const corrClo2 = qClo2.filter(q => examUserAnswers[q.id] && examUserAnswers[q.id].isCorrect).length;
        const corrClo3 = qClo3.filter(q => examUserAnswers[q.id] && examUserAnswers[q.id].isCorrect).length;

        clo1Stat.previousElementSibling.textContent = 'CLO1: Khái niệm & Kiến trúc tổng quan';
        clo1Stat.textContent = `${corrClo1}/${qClo1.length} câu`;
        clo1Bar.style.width = qClo1.length > 0 ? `${(corrClo1/qClo1.length)*100}%` : '0%';

        clo2Stat.previousElementSibling.textContent = 'CLO2: Phần cứng 89C51 & Tập lệnh';
        clo2Stat.textContent = `${corrClo2}/${qClo2.length} câu`;
        clo2Bar.style.width = qClo2.length > 0 ? `${(corrClo2/qClo2.length)*100}%` : '0%';

        clo3Stat.previousElementSibling.textContent = 'CLO3: Lập trình, Timer, UART & Ngắt';
        clo3Stat.textContent = `${corrClo3}/${qClo3.length} câu`;
        clo3Bar.style.width = qClo3.length > 0 ? `${(corrClo3/qClo3.length)*100}%` : '0%';
      }
    }

    const modal = document.getElementById('exam-result-modal');
    if (modal) modal.classList.add('active');
  }

  function reviewExamQuestions() {
    examQuestions.forEach(q => {
      const card = document.getElementById(`q-card-${q.id}`);
      if (!card) return;

      const userAns = examUserAnswers[q.id];

      if (q.type === 'mcq') {
        const optBtns = card.querySelectorAll('.option-btn');
        optBtns.forEach(btn => {
          btn.classList.remove('selected-correct', 'selected-wrong', 'highlight-correct');
          const letter = btn.getAttribute('data-letter');
          if (userAns && userAns.answer === letter) {
            btn.classList.add(userAns.isCorrect ? 'selected-correct' : 'selected-wrong');
          }
          if (q.answer === letter) {
            btn.classList.add('highlight-correct');
          }
        });
      }

      // Add review explanation row
      let revRow = card.querySelector('.exam-review-row');
      if (!revRow) {
        revRow = document.createElement('div');
        revRow.className = 'exam-review-row';
        revRow.style.cssText = 'margin-top: 12px; padding: 12px; background: #FFFDF9; border: 2px solid #000; border-radius: 6px;';
        revRow.innerHTML = `
          <div style="font-weight: 800; color: #065F46; margin-bottom: 4px;">✅ Đáp án đúng: ${escapeHtml(q.answer)}</div>
          <div style="font-size: 0.9rem; margin-bottom: 6px;"><strong>💡 Lời giải:</strong> ${escapeHtml(q.explanation)}</div>
          ${(q.tips_casio || q.tips) ? `<div style="font-size: 0.85rem; color: #92400E; background: #FEF3C7; padding: 4px 8px; border: 1px dashed #B45309;">⚡ Mẹo: ${escapeHtml(q.tips_casio || q.tips)}</div>` : ''}
        `;
        card.appendChild(revRow);
      }
    });

    const firstCard = document.getElementById(`q-card-${examQuestions[0].id}`);
    if (firstCard) firstCard.scrollIntoView({ behavior: 'smooth' });

    const list = document.getElementById('exam-questions-list');
    if (list) renderMath(list);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function formatMarkdownText(str) {
    if (!str) return '';
    let res = escapeHtml(str);
    res = res.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    res = res.replace(/\*(.*?)\*/g, '<em>$1</em>');
    res = res.replace(/`([^`]+)`/g, '<code>$1</code>');
    res = res.replace(/\n/g, '<br/>');
    return res;
  }

  // KaTeX Math Formula Rendering Helper
  function renderMath(container) {
    const target = container || document.body;
    if (typeof renderMathInElement === 'function') {
      try {
        renderMathInElement(target, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false },
            { left: '\\[', right: '\\]', display: true },
            { left: '\\(', right: '\\)', display: false }
          ],
          throwOnError: false,
          ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code']
        });
      } catch (err) {
        console.warn('KaTeX render error:', err);
      }
    }
  }

  window.addEventListener('load', () => {
    setTimeout(() => renderMath(), 80);
  });

  // Start app on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
