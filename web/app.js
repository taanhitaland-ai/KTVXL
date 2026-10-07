// KTVXL & TTHCM PRO MASTER MULTI-SUBJECT APPLICATION LOGIC
(function() {
  'use strict';

  const examConfig = window.KMA_EXAMS;
  function readLocal(key) {
    try { return localStorage.getItem(key); } catch (_) { return null; }
  }
  function writeLocal(key, value) {
    try { localStorage.setItem(key, value); } catch (_) { /* Practice remains usable without storage. */ }
  }
  const savedSubject = readLocal('kma_active_subject');
  let currentSubject = examConfig.subjects[savedSubject] ? savedSubject : 'ktvxl';
  const selectedExamCodes = { ktvxl: '1', tthcm: 'TTHCM_FULL_A', vldc: 'NOTION_DE_CUOI', xstk: 'RANDOM' };

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
  let currentExamCode = '1';
  let examDurationSeconds = 3600;
  let examDeadline = 0;

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
    userAnswers = {};
    starredQuestions = new Set();
    const ids = new Set(questions.map(q => q.id));
    try {
      const saved = JSON.parse(readLocal(getStorageKeyAnswers()) || '{}');
      if (saved && !Array.isArray(saved) && typeof saved === 'object') {
        for (const [id, answer] of Object.entries(saved)) {
          if (ids.has(id) && answer && typeof answer === 'object' && typeof answer.isCorrect === 'boolean') {
            userAnswers[id] = answer;
          }
        }
      }
    } catch (_) { /* Ignore malformed saved answers. */ }
    try {
      const saved = JSON.parse(readLocal(getStorageKeyStars()) || '[]');
      if (Array.isArray(saved)) starredQuestions = new Set(saved.filter(id => ids.has(id)));
    } catch (_) { /* Ignore malformed saved stars. */ }
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
    writeLocal('kma_active_subject', subject);

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

    loadSavedState();
    currentExamCode = selectedExamCodes[subject];
    const subjectData = { ktvxl: window.KTVXL_QUESTIONS, tthcm: window.TTHCM_QUESTIONS_DATA, vldc: window.VLDC_QUESTIONS_DATA, xstk: window.XSTK_QUESTIONS_DATA };
    const subjectLabels = { ktvxl: '⚡ VI XỬ LÝ', tthcm: '📕 TƯ TƯỞNG HCM', vldc: '⚛️ VẬT LÝ ĐẠI CƯƠNG', xstk: '🎲 XÁC SUẤT THỐNG KÊ' };
    for (const [key, label] of Object.entries(subjectLabels)) {
      const btn = document.getElementById('btn-subj-' + key);
      if (btn) btn.textContent = label + ' (' + (subjectData[key] || []).length + ' câu)';
    }
    document.title = examConfig.subjects[subject].name + ' • Ôn luyện KMA';

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
    const hasLab = subject === 'vldc' || subject === 'xstk';
    btnLab.hidden = !hasLab;
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
        if (labXstk) labXstk.style.display = 'none';
      }
    }
    if (!hasLab && document.getElementById('tab-visualize').classList.contains('active')) {
      document.getElementById('btn-tab-practice').click();
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
    if (examActive && !confirm('Bạn đang trong bài thi. Chuyển môn học sẽ hủy bài thi hiện tại. Tiếp tục?')) return;
    if (window.KMA_CHAPTER_DIAGRAMS) window.KMA_CHAPTER_DIAGRAMS.close();
    resetExamView();
    currentStatus = 'ALL';
    searchKeyword = '';
    const search = document.getElementById('search-input');
    if (search) search.value = '';
    document.querySelectorAll('[data-status]').forEach(btn => btn.classList.toggle('active', btn.dataset.status === 'ALL'));
    loadSubjectData(subject);
    practiceDisplayLimit = 100;
    renderPracticeQuestions();
    setupKnowledgeHub();
    updateStatsBar();
    document.getElementById('panel-q-title').textContent = '💡 CHỌN CÂU HỎI ĐỂ XEM LỜI GIẢI';
    document.getElementById('panel-q-badge').textContent = 'Đang xem';
    document.getElementById('panel-content').innerHTML = '<div class="panel-placeholder"><p>📚 ' + escapeHtml(examConfig.subjects[subject].name) + '</p><p>Bấm vào câu hỏi để xem lời giải và mẹo nhớ.</p></div>';
  }

  function updateFilterUI() {
    const sourceSelect = document.getElementById('filter-source');
    if (!sourceSelect) return;
    sourceSelect.innerHTML = '';
    function group(label, entries) {
      const optgroup = document.createElement('optgroup');
      optgroup.label = label;
      for (const [value, text] of entries) {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = text;
        optgroup.appendChild(option);
      }
      sourceSelect.appendChild(optgroup);
    }
    if (currentSubject === 'ktvxl') {
      const official = questions.filter(q => (q.exam_id || '').startsWith('DE_'));
      group('Đề thi chính thức KMA', [['ALL_EXAMS', '⭐ Tất cả 5 đề thi (' + official.length + ' câu)'],
        ...[1,2,3,4,5].map(n => {
          const code = 'DE_' + String(n).padStart(3, '0');
          return [code, 'Đề kiểm tra ' + String(n).padStart(3, '0') + ' (' + questions.filter(q => q.exam_id === code).length + ' câu)'];
        })]);
      group('Toàn bộ ngân hàng', [['ALL', '🌟 Toàn bộ ngân hàng (' + questions.length + ' câu)']]);
      const parts = [...new Set(questions.map(q => q.exam_id).filter(code => code && code.startsWith('PART_')))];
      group('Chuyên đề bài tập', parts.map(code => [code, questions.find(q => q.exam_id === code).exam_title + ' (' + questions.filter(q => q.exam_id === code).length + ' câu)']));
      currentSource = 'ALL_EXAMS';
    } else {
      group('Toàn bộ ngân hàng', [['ALL', '🌟 Toàn bộ ngân hàng (' + questions.length + ' câu)']]);
      const codes = [...new Set(questions.map(q => q.source))];
      const exams = examConfig.catalog(currentSubject, questions);
      group('Nguồn đề thi & đề cương', codes.map(code => {
        const exam = exams.find(item => item.code === code);
        const question = questions.find(q => q.source === code);
        return [code, (exam ? exam.title : question.source_title || code) + ' (' + questions.filter(q => q.source === code).length + ' câu)'];
      }));
      const chapterCount = currentSubject === 'xstk' ? 8 : 6;
      group('Lọc theo chương', Array.from({ length: chapterCount }, (_, i) => i + 1).map(chapter => {
        const inChapter = questions.filter(q => q.chapter === chapter);
        return ['CHAP_' + chapter, (inChapter[0] ? inChapter[0].chapter_title : 'Chương ' + chapter) + ' (' + inChapter.length + ' câu)'];
      }));
      currentSource = 'ALL';
    }
    sourceSelect.value = currentSource;
    const search = document.getElementById('search-input');
    if (search) search.placeholder = currentSubject === 'ktvxl' ? '🔍 Tìm TMOD, Baud, PSW, tập lệnh...' : '🔍 Tìm từ khóa trong câu hỏi và đáp án...';
    const btnGroup = document.querySelector('.filter-btn-group');
    const byChapter = currentSubject !== 'ktvxl';
    if (btnGroup) {
      btnGroup.previousElementSibling.textContent = byChapter ? 'Chương:' : 'Chuẩn đầu ra:';
      const entries = byChapter ? Array.from({ length: currentSubject === 'xstk' ? 8 : 6 }, (_, i) => [String(i + 1), 'Chương ' + (i + 1)]) : [['CLO1','CLO1: Tổng quan'],['CLO2','CLO2: Phần cứng & Tập lệnh'],['CLO3','CLO3: Lập trình & Ứng dụng']];
      btnGroup.innerHTML = [['ALL', 'Tất cả'], ...entries].map(([code, text]) => '<button class="neo-filter-btn' + (code === 'ALL' ? ' active' : '') + '" data-clo="' + code + '">' + text + '</button>').join('');
      currentClo = 'ALL';
      btnGroup.querySelectorAll('[data-clo]').forEach(btn => btn.addEventListener('click', () => {
        btnGroup.querySelectorAll('[data-clo]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentClo = btn.dataset.clo;
        practiceDisplayLimit = 100;
        renderPracticeQuestions();
      }));
    }
  }

  function updateStartExamButton() {
    const btnStart = document.getElementById('btn-start-exam');
    if (!btnStart) return;
    const exam = examConfig.catalog(currentSubject, questions).find(item => item.code === currentExamCode);
    const timeMins = examConfig.subjects[currentSubject].minutes;
    btnStart.textContent = exam ? '🚀 BẮT ĐẦU: ' + exam.title + ' (' + timeMins + ':00)' : 'Chưa có đề thi';
  }

  function updateExamSetupUI() {
    const examGrid = document.getElementById('exam-select-grid');
    const exams = examConfig.catalog(currentSubject, questions);
    if (!examGrid) return;
    if (!exams.some(exam => exam.code === currentExamCode && exam.count)) {
      currentExamCode = (exams.find(exam => exam.count) || {}).code;
    }
    selectedExamCodes[currentSubject] = currentExamCode;
    document.getElementById('exam-setup-title').textContent = 'PHÒNG THI THỬ • ' + examConfig.subjects[currentSubject].name.toUpperCase();
    document.getElementById('btn-tab-exam').textContent = '⏱️ Thi Thử ' + examConfig.subjects[currentSubject].minutes + ' Phút';
    examGrid.innerHTML = '';
    for (const exam of exams) {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'exam-card-choice';
      card.dataset.examCode = exam.code;
      card.disabled = exam.count === 0;
      card.innerHTML = '<span class="exam-code-badge neo-badge ' + (exam.code === 'RANDOM' ? 'badge-clo3' : 'badge-exam') + '">' + escapeHtml(exam.badge) + '</span><span class="exam-title-choice">' + escapeHtml(exam.title) + '</span><span class="exam-desc-choice">' + escapeHtml(exam.description) + '</span>';
      examGrid.appendChild(card);
    }
    updateExamSummary();
  }

  function updateExamSummary() {
    document.querySelectorAll('.exam-card-choice').forEach(card => {
      const selected = card.dataset.examCode === currentExamCode;
      card.classList.toggle('selected', selected);
      card.setAttribute('aria-pressed', String(selected));
    });
    const exam = examConfig.catalog(currentSubject, questions).find(item => item.code === currentExamCode);
    const minutes = examConfig.subjects[currentSubject].minutes;
    document.getElementById('exam-setup-description').textContent = exam ? exam.title + ' • ' + exam.count + ' câu • ' + minutes + ' phút. ' + exam.description + '.' : 'Chưa có câu hỏi cho môn học này.';
    const start = document.getElementById('btn-start-exam');
    updateStartExamButton();
    start.disabled = !exam || !exam.count;
  }

  function resetExamView() {
    clearInterval(examTimerInterval);
    examActive = false;
    examQuestions = [];
    examUserAnswers = {};
    document.getElementById('exam-active-view').style.display = 'none';
    document.getElementById('exam-setup-view').style.display = 'block';
    document.getElementById('exam-result-modal').classList.remove('active');
    document.getElementById('exam-questions-list').innerHTML = '';
    document.getElementById('btn-submit-exam').disabled = false;
    document.getElementById('btn-back-exam').hidden = true;
    document.getElementById('btn-exit-exam').hidden = false;
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
          practiceDisplayLimit = 100;
          renderPracticeQuestions();
        }, 200);
      });
    }

    const btnReset = document.getElementById('btn-reset-progress');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        if (confirm(`Bạn có chắc muốn xóa lịch sử làm bài môn ${examConfig.subjects[currentSubject].name} không?`)) {
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
    card.id = `${isExamMode ? 'exam-' : ''}q-card-${q.id}`;
    card.dataset.questionId = q.id;

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
        starBtn.title = starredQuestions.has(q.id) ? 'Bỏ đánh dấu' : 'Gắn sao câu hỏi này';
        if (currentStatus === 'STARRED') renderPracticeQuestions();
      });
      metaHeader.appendChild(starBtn);
    }

    card.appendChild(metaHeader);

    // Prompt Box
    const promptBox = document.createElement('div');
    promptBox.className = 'q-prompt-box';

    const promptTitle = document.createElement('div');
    promptTitle.className = 'q-title';
    promptTitle.innerHTML = `<strong>Câu ${displayIndex}.</strong> ${formatMarkdownText(q.prompt)}`;
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
    const images = [...new Set([...(q.images || []), ...(q.image ? [q.image] : [])])];
    if (images.length > 0) {
      images.forEach(imgSrc => {
        const imgWrap = document.createElement('div');
        imgWrap.className = 'q-image-container';
        const imgEl = document.createElement('img');
        imgEl.src = imgSrc;
        imgEl.alt = 'Sơ đồ mạch minh họa';
        imgEl.loading = 'lazy';
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
          <span style="flex: 1;">${formatMarkdownText(cleanOptText)}</span>
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
      checkBtn.textContent = isExamMode ? 'Ghi nhận' : 'Kiểm tra';

      const feedback = document.createElement('span');
      feedback.className = 'fib-feedback';

      if (userState) {
        feedback.className = `fib-feedback ${userState.isCorrect ? 'correct' : 'wrong'}`;
        feedback.textContent = userState.isCorrect ? 'ĐÚNG ✅' : `SAI ❌ (Đ.Á: ${q.answer})`;
      }

      const triggerCheck = () => {
        const val = input.value.trim();
        if (!val && !isExamMode) return;
        handleCheckFIB(q, val, feedback, card, isExamMode);
      };

      if (isExamMode) input.addEventListener('input', triggerCheck);
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
      if (!e.target.closest('button, input, img')) {
        openSideDetails(q);
        highlightActiveCard(card);
      }
    });

    return card;
  }

  function highlightActiveCard(card) {
    card.parentElement.querySelectorAll('.question-card').forEach(c => c.classList.remove('active-selected'));
    card.classList.add('active-selected');
    if (card.id.startsWith('exam-')) {
      document.querySelectorAll('.palette-btn').forEach(btn => btn.classList.toggle('current', btn.id === 'palette-btn-' + card.dataset.questionId));
    }
  }

  // Handle MCQ selection
  function handleSelectMCQ(q, letter, card, optsGrid, isExamMode) {
    if (isExamMode && !examActive) return;
    const isCorrect = (letter.toUpperCase() === String(q.answer).toUpperCase());

    if (isExamMode) {
      examUserAnswers[q.id] = { answer: letter, isCorrect };
      optsGrid.querySelectorAll('.option-btn').forEach(btn => {
        btn.classList.remove('selected-exam');
        if (btn.getAttribute('data-letter') === letter) {
          btn.classList.add('selected-exam');
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
    if (currentStatus !== 'ALL') renderPracticeQuestions();
  }

  // Handle FIB input
  function handleCheckFIB(q, val, feedbackEl, card, isExamMode) {
    if (isExamMode && !examActive) return;
    const norm = val.trim().toUpperCase().replace(/H$/, '');
    let isCorrect = false;

    if (q.acceptable_answers && q.acceptable_answers.length > 0) {
      isCorrect = q.acceptable_answers.some(ans => {
        const aNorm = String(ans).trim().toUpperCase().replace(/H$/, '');
        return norm === aNorm;
      });
    } else {
      isCorrect = norm === String(q.answer).trim().toUpperCase().replace(/H$/, '');
    }

    if (isExamMode) {
      if (val) examUserAnswers[q.id] = { inputVal: val, isCorrect };
      else delete examUserAnswers[q.id];
      feedbackEl.className = 'fib-feedback';
      feedbackEl.textContent = val ? 'ĐÃ GHI NHẬN ✍️' : '';
      updateExamProgress();
      return;
    }

    userAnswers[q.id] = { inputVal: val, isCorrect };
    saveState();

    feedbackEl.className = `fib-feedback ${isCorrect ? 'correct' : 'wrong'}`;
    feedbackEl.textContent = isCorrect ? 'ĐÚNG ✅' : `SAI ❌ (Đ.Á: ${q.answer})`;

    openSideDetails(q);
    highlightActiveCard(card);
    if (currentStatus !== 'ALL') renderPracticeQuestions();
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
          <p>${formatMarkdownText(q.explanation || 'Chưa có lời giải chi tiết.')}</p>
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
            <p>${formatMarkdownText(q.methodology)}</p>
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
            <p>${formatMarkdownText(tipContent)}</p>
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
    if (!container) return;
    container.innerHTML = '';
    if (!knowledge || !knowledge.chapters) return;
    document.querySelector('#tab-knowledge .knowledge-hero h1').textContent = 'KIẾN THỨC TRỌNG TÂM • ' + examConfig.subjects[currentSubject].name.toUpperCase();
    document.querySelector('#tab-knowledge .knowledge-hero p').textContent = 'Tổng hợp theo các chương trong ngân hàng câu hỏi, kèm công thức, phương pháp và mẹo ôn tập.';

    const chapters = [...knowledge.chapters];
    if (knowledge.casio_guide) {
      chapters.push({ id: 'casio_guide', clo: 'CASIO', title: 'Sổ tay Casio', sections: knowledge.casio_guide.map(item => ({ title: item.title, content: item.steps })) });
    }
    chapters.forEach(chap => {
      const card = document.createElement('div');
      card.className = 'chapter-card';
      card.dataset.chapterId = String(chap.id);

      const header = document.createElement('div');
      const chapterTheme = Number.isInteger(chap.num) ? 'chap' + chap.num : typeof chap.id === 'number' ? 'chap' + chap.id : chap.id;
      header.className = `chapter-header ${chapterTheme}`;
      header.innerHTML = `
        <div>
          <span class="neo-badge" style="background:#000; color:#fff; font-size: 0.75rem; margin-bottom: 4px;">${chap.clo || `CHƯƠNG ${chap.num || chap.id}`}</span>
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

      if (chap.magic_keywords && chap.magic_keywords.length) {
        const keywords = document.createElement('div');
        keywords.className = 'section-item';
        keywords.innerHTML = '<h4 class="section-title">⚡ Từ khóa & Mẹo nhận diện</h4>' + chap.magic_keywords.map(item => '<p><strong>' + escapeHtml(item.kw) + '</strong>: ' + formatMarkdownText(item.meaning) + '</p>').join('');
        body.appendChild(keywords);
      }

      card.appendChild(header);
      if (window.KMA_CHAPTER_DIAGRAMS?.has(currentSubject, chap.id)) {
        const actions = document.createElement('div');
        actions.className = 'chapter-diagram-actions';
        const hint = document.createElement('span');
        hint.textContent = currentSubject === 'ktvxl' ? 'Khám phá các khối và luồng hoạt động' : 'Khám phá các nội dung và mối liên hệ';
        const diagramButton = document.createElement('button');
        diagramButton.type = 'button';
        diagramButton.className = 'neo-btn neo-btn-sm chapter-diagram-button';
        diagramButton.textContent = '🧩 Xem đồ thị';
        diagramButton.setAttribute('aria-label', 'Xem đồ thị: ' + chap.title);
        diagramButton.setAttribute('aria-haspopup', 'dialog');
        diagramButton.addEventListener('click', () => window.KMA_CHAPTER_DIAGRAMS.open(chap, {
          subject: currentSubject, trigger: diagramButton, formatText: formatMarkdownText, renderMath
        }));
        actions.append(hint, diagramButton);
        card.appendChild(actions);
      }
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
    container.querySelectorAll('.chapter-header').forEach(header => {
      const body = header.closest('.chapter-card').querySelector('.chapter-body');
      if (!body) return;
      header.setAttribute('role', 'button');
      header.tabIndex = 0;
      header.setAttribute('aria-expanded', 'true');
      const toggle = () => {
        body.hidden = !body.hidden;
        header.setAttribute('aria-expanded', String(!body.hidden));
      };
      header.addEventListener('click', toggle);
      header.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggle(); }
      });
    });
    renderMath(container);
  }

  // Exam Simulator Logic
  function setupExamSimulator() {
    document.getElementById('exam-select-grid').addEventListener('click', event => {
      const card = event.target.closest('.exam-card-choice');
      if (!card || card.disabled) return;
      currentExamCode = card.dataset.examCode;
      selectedExamCodes[currentSubject] = currentExamCode;
      updateExamSummary();
    });
    document.getElementById('btn-exit-exam').addEventListener('click', () => {
      if (examActive && !confirm('Thoát bài thi hiện tại để chọn đề khác? Bài làm này sẽ bị hủy.')) return;
      resetExamView();
    });
    document.getElementById('btn-start-exam').addEventListener('click', startExam);
    document.getElementById('btn-submit-exam').addEventListener('click', () => {
      if (!examActive) return;
      const answeredCount = Object.keys(examUserAnswers).length;
      if (answeredCount < examQuestions.length && !confirm('Bạn mới làm ' + answeredCount + ' / ' + examQuestions.length + ' câu. Nộp bài thi ngay?')) return;
      finishExam();
    });
    document.getElementById('btn-close-modal').addEventListener('click', resetExamView);
    document.getElementById('btn-back-exam').addEventListener('click', resetExamView);
    document.getElementById('btn-review-exam').addEventListener('click', () => {
      document.getElementById('exam-result-modal').classList.remove('active');
      reviewExamQuestions();
    });
    window.addEventListener('beforeunload', event => {
      if (examActive) { event.preventDefault(); event.returnValue = ''; }
    });
  }

  function startExam() {
    if (examActive) return;
    const selected = examConfig.select(currentSubject, questions, currentExamCode);
    if (!selected.length) { alert('Đề đã chọn chưa có câu hỏi. Vui lòng chọn đề khác.'); return; }
    examQuestions = selected;
    examUserAnswers = {};
    examActive = true;
    examDurationSeconds = examConfig.subjects[currentSubject].minutes * 60;
    examTimeRemaining = examDurationSeconds;
    examDeadline = Date.now() + examDurationSeconds * 1000;
    document.getElementById('exam-setup-view').style.display = 'none';
    document.getElementById('exam-active-view').style.display = 'block';
    document.getElementById('btn-submit-exam').disabled = false;
    document.getElementById('btn-back-exam').hidden = true;
    const exam = examConfig.catalog(currentSubject, questions).find(item => item.code === currentExamCode);
    document.getElementById('exam-current-name').textContent = exam.title;
    document.getElementById('exam-palette-title').textContent = 'BẢNG CÂU HỎI (1 - ' + examQuestions.length + ')';
    renderExamQuestions();
    renderExamPalette();
    updateExamProgress();
    startExamTimer();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function startExamTimer() {
    clearInterval(examTimerInterval);
    const timerDisplay = document.getElementById('exam-timer-display');
    function tick() {
      examTimeRemaining = Math.max(0, Math.ceil((examDeadline - Date.now()) / 1000));
      const mins = Math.floor(examTimeRemaining / 60);
      const secs = examTimeRemaining % 60;
      timerDisplay.textContent = String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
      timerDisplay.classList.toggle('urgent', examTimeRemaining <= 300);
      if (examTimeRemaining === 0 && examActive) {
        finishExam();
        alert('Hết giờ làm bài! Hệ thống đã tự động thu bài thi của bạn.');
      }
    }
    tick();
    examTimerInterval = setInterval(tick, 1000);
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
        const targetCard = document.getElementById(`exam-q-card-${q.id}`);
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
    document.getElementById('exam-progress-text').textContent = answered + '/' + total;
    const bar = document.getElementById('exam-progress-bar');
    bar.style.width = (total ? Math.round(answered / total * 100) : 0) + '%';
    for (const q of examQuestions) {
      const button = document.getElementById('palette-btn-' + q.id);
      if (button) button.classList.toggle('answered', !!examUserAnswers[q.id]);
    }
  }

  function finishExam() {
    if (!examActive) return;
    clearInterval(examTimerInterval);
    examTimeRemaining = Math.max(0, Math.ceil((examDeadline - Date.now()) / 1000));
    examActive = false;
    document.getElementById('btn-submit-exam').disabled = true;
    document.getElementById('btn-back-exam').hidden = false;
    document.getElementById('btn-exit-exam').hidden = true;
    document.querySelectorAll('#exam-questions-list button, #exam-questions-list input').forEach(el => el.disabled = true);

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
      const minsSpent = Math.floor((examDurationSeconds - examTimeRemaining) / 60);
      const secsSpent = (examDurationSeconds - examTimeRemaining) % 60;
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

        clo1Stat.previousElementSibling.textContent = 'Chương 1 & 2: Dao động, Sóng & Quang học sóng';
        clo1Stat.textContent = `${corr12}/${c12.length} câu`;
        clo1Bar.style.width = c12.length > 0 ? `${(corr12/c12.length)*100}%` : '0%';

        clo2Stat.previousElementSibling.textContent = 'Chương 3 & 4: Quang học lượng tử & Cơ học lượng tử';
        clo2Stat.textContent = `${corr34}/${c34.length} câu`;
        clo2Bar.style.width = c34.length > 0 ? `${(corr34/c34.length)*100}%` : '0%';

        clo3Stat.previousElementSibling.textContent = 'Chương 5 & 6: Vật lý nguyên tử & Hạt nhân';
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
    if (!examQuestions.length) return;
    examQuestions.forEach(q => {
      const card = document.getElementById(`exam-q-card-${q.id}`);
      if (!card) return;

      const userAns = examUserAnswers[q.id];

      if (q.type === 'mcq') {
        const optBtns = card.querySelectorAll('.option-btn');
        optBtns.forEach(btn => {
          btn.classList.remove('selected-exam', 'selected-correct', 'selected-wrong', 'highlight-correct');
          const letter = btn.getAttribute('data-letter');
          if (userAns && userAns.answer === letter) {
            btn.classList.add(userAns.isCorrect ? 'selected-correct' : 'selected-wrong');
          }
          if (q.answer === letter) {
            btn.classList.add('highlight-correct');
          }
        });
      } else {
        const feedback = card.querySelector('.fib-feedback');
        if (feedback) {
          feedback.className = 'fib-feedback ' + (userAns && userAns.isCorrect ? 'correct' : 'wrong');
          feedback.textContent = !userAns ? 'CHƯA TRẢ LỜI' : userAns.isCorrect ? 'ĐÚNG ✅' : 'SAI ❌';
        }
      }

      // Add review explanation row
      let revRow = card.querySelector('.exam-review-row');
      if (!revRow) {
        revRow = document.createElement('div');
        revRow.className = 'exam-review-row';
        revRow.style.cssText = 'margin-top: 12px; padding: 12px; background: #FFFDF9; border: 2px solid #000; border-radius: 6px;';
        revRow.innerHTML = `
          <div style="font-weight: 700; margin-bottom: 4px;">Bài làm: ${escapeHtml(userAns ? userAns.answer || userAns.inputVal : 'Chưa trả lời')}</div>
          <div style="font-weight: 800; color: #065F46; margin-bottom: 4px;">✅ Đáp án đúng: ${escapeHtml(q.answer)}</div>
          <div style="font-size: 0.9rem; margin-bottom: 6px;"><strong>💡 Lời giải:</strong> ${formatMarkdownText(q.explanation)}</div>
          ${(q.tips_casio || q.tips) ? `<div style="font-size: 0.85rem; color: #92400E; background: #FEF3C7; padding: 4px 8px; border: 1px dashed #B45309;">⚡ Mẹo: ${formatMarkdownText(q.tips_casio || q.tips)}</div>` : ''}
        `;
        card.appendChild(revRow);
      }
    });

    const firstCard = document.getElementById(`exam-q-card-${examQuestions[0].id}`);
    if (firstCard) firstCard.scrollIntoView({ behavior: 'smooth' });

    const list = document.getElementById('exam-questions-list');
    if (list) renderMath(list);
  }

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function formatMarkdownText(str) {
    if (str === null || str === undefined) return '';
    // Keep math intact: Markdown's emphasis markers must not split formulas.
    const math = [];
    let text = String(str).replace(/\$\$[\s\S]*?\$\$|\$[^$\n]+?\$|\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]/g, value => {
      math.push(escapeHtml(value));
      return '\u0000MATH' + (math.length - 1) + '\u0000';
    });
    text = escapeHtml(text).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br/>');
    return text.replace(/\u0000MATH(\d+)\u0000/g, (_, index) => math[index]);
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
