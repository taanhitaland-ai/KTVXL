// KTVXL PRO MASTER APPLICATION LOGIC
(function() {
  'use strict';

  // State Management
  let questions = [];
  let knowledge = null;
  let userAnswers = {}; // { [qId]: { answer, isCorrect, inputVal } }
  let starredQuestions = new Set();
  
  // Filter state
  let currentSource = 'ALL_EXAMS';
  let currentClo = 'ALL';
  let currentStatus = 'ALL';
  let searchKeyword = '';
  
  // Exam simulator state
  let examActive = false;
  let examQuestions = [];
  let examTimeRemaining = 60 * 60; // 60 minutes in seconds
  let examTimerInterval = null;
  let examUserAnswers = {};
  let currentExamCode = '1';

  // Storage Keys
  const STORAGE_KEY_ANSWERS = 'ktvxl_user_answers_v1';
  const STORAGE_KEY_STARS = 'ktvxl_starred_questions_v1';

  // Initialize App
  function init() {
    loadSavedState();
    
    // Check if data is already loaded in window
    if (window.KTVXL_QUESTIONS && window.KTVXL_KNOWLEDGE) {
      questions = window.KTVXL_QUESTIONS;
      knowledge = window.KTVXL_KNOWLEDGE;
      setupApp();
    } else {
      // Fallback: fetch JSON files
      Promise.all([
        fetch('data/questions_db.json').then(r => r.json()),
        fetch('data/knowledge_base.json').then(r => r.json())
      ]).then(([qData, kData]) => {
        questions = qData;
        knowledge = kData;
        setupApp();
      }).catch(err => {
        console.error('Failed to load data:', err);
      });
    }
  }

  function loadSavedState() {
    try {
      const savedAns = localStorage.getItem(STORAGE_KEY_ANSWERS);
      if (savedAns) userAnswers = JSON.parse(savedAns);
      const savedStars = localStorage.getItem(STORAGE_KEY_STARS);
      if (savedStars) starredQuestions = new Set(JSON.parse(savedStars));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY_ANSWERS, JSON.stringify(userAnswers));
      localStorage.setItem(STORAGE_KEY_STARS, JSON.stringify([...starredQuestions]));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
    updateStatsBar();
  }

  function setupApp() {
    setupTabNavigation();
    setupFilters();
    setupKnowledgeHub();
    setupExamSimulator();
    renderPracticeQuestions();
    updateStatsBar();
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
        renderPracticeQuestions();
      });
    }

    const cloBtns = document.querySelectorAll('[data-clo]');
    cloBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        cloBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentClo = btn.getAttribute('data-clo');
        renderPracticeQuestions();
      });
    });

    const statusBtns = document.querySelectorAll('[data-status]');
    statusBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        statusBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentStatus = btn.getAttribute('data-status');
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
        if (confirm('Bạn có chắc muốn xóa lịch sử bài làm để luyện tập lại từ đầu không?')) {
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
      if (currentSource === 'ALL_EXAMS') {
        if (!q.exam_id || !q.exam_id.startsWith('DE_')) return false;
      } else if (currentSource !== 'ALL') {
        if (q.exam_id !== currentSource) return false;
      }

      // CLO filter
      if (currentClo !== 'ALL') {
        if (q.clo !== currentClo) return false;
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
        const fullContent = (q.prompt + ' ' + (q.extra_lines || []).join(' ') + ' ' + (q.options || []).join(' ') + ' ' + (q.topic_name || '')).toLowerCase();
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

    container.innerHTML = `
      <div style="font-weight: 800; font-size: 0.95rem; margin-bottom: 4px; display: flex; justify-content: space-between; align-items: center;">
        <span>Hiển thị <strong>${filtered.length}</strong> câu hỏi</span>
        <span class="neo-badge badge-exam">${currentSource === 'ALL_EXAMS' ? '5 Đề Thi Chính Thức' : currentSource}</span>
      </div>
    `;

    // Limit initial DOM render to first 100 for optimal performance if large
    const displayList = filtered.slice(0, 100);

    displayList.forEach((q, idx) => {
      const card = createQuestionCard(q, idx + 1);
      container.appendChild(card);
    });

    if (filtered.length > 100) {
      const moreNotice = document.createElement('div');
      moreNotice.className = 'neo-box';
      moreNotice.style.cssText = 'padding: 16px; text-align: center; font-weight: 800; background: var(--neo-yellow);';
      moreNotice.innerHTML = `Đang hiển thị 100 / ${filtered.length} câu. Hãy lọc theo Đề hoặc Chuyên đề để làm từng phần chuyên sâu!`;
      container.appendChild(moreNotice);
    }
  }

  // Question Card Factory
  function createQuestionCard(q, displayIndex, isExamMode = false) {
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
    sourceBadge.textContent = q.exam_title ? `${q.exam_title} • Câu ${q.num}` : `${q.source} • Câu ${q.num}`;
    badges.appendChild(sourceBadge);

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

    // Extra lines / Assembly Code
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
        imgEl.alt = 'Sơ đồ mạch / Mã lệnh minh họa';
        imgEl.loading = 'lazy';
        imgWrap.appendChild(imgEl);
        promptBox.appendChild(imgWrap);
      });
    }

    card.appendChild(promptBox);

    // MCQ vs FIB Answering Area
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
      showExpBtn.innerHTML = '💡 Xem Lời Giải & Mẹo Casio';
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
      // Update UI in exam mode
      optsGrid.querySelectorAll('.option-btn').forEach(btn => {
        btn.classList.remove('selected-correct', 'selected-wrong');
        if (btn.getAttribute('data-letter') === letter) {
          btn.classList.add('selected-correct'); // In exam just mark selected
        }
      });
      updateExamProgress();
      return;
    }

    // Practice Mode: Instant evaluation
    userAnswers[q.id] = { answer: letter, isCorrect };
    saveState();

    optsGrid.querySelectorAll('.option-btn').forEach(btn => {
      btn.classList.remove('selected-correct', 'selected-wrong', 'highlight-correct');
      const btnLetter = btn.getAttribute('data-letter');
      if (btnLetter === letter) {
        btn.classList.add(isCorrect ? 'selected-correct' : 'selected-wrong');
      } else if (!isCorrect && btnLetter === q.answer) {
        btn.classList.add('highlight-correct');
      }
    });

    // Auto-open side drawer with explanation & Casio
    openSideDetails(q);
    highlightActiveCard(card);
  }

  // Handle FIB checking
  function handleCheckFIB(q, val, feedbackEl, card, isExamMode) {
    const norm = val.trim().toUpperCase().replace(/H$/, '');
    let isCorrect = false;

    // Check against accepted variants
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

    // Practice Mode: Instant evaluation
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
    badgeEl.textContent = q.exam_title || q.source || 'Chi Tiết';

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

    if (q.tips_casio) {
      html += `
        <div class="panel-section sec-casio">
          <div class="panel-section-title">
            <span>⚡ Mẹo Nhớ & Mẹo Bấm Máy Casio fx-580VNX</span>
          </div>
          <div class="panel-text">
            <p>${escapeHtml(q.tips_casio)}</p>
          </div>
        </div>
      `;
    }

    contentEl.innerHTML = html;
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
          <span class="neo-badge" style="background:#000; color:#fff; font-size: 0.75rem; margin-bottom: 4px;">${chap.clo}</span>
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

      card.appendChild(header);
      card.appendChild(body);
      container.appendChild(card);
    });
  }

  // Exam Simulator Logic
  function setupExamSimulator() {
    const examCards = document.querySelectorAll('.exam-card-choice');
    examCards.forEach(card => {
      card.addEventListener('click', () => {
        examCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        currentExamCode = card.getAttribute('data-exam-code');
      });
    });

    const btnStart = document.getElementById('btn-start-exam');
    if (btnStart) {
      btnStart.addEventListener('click', startExam);
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
      });
    }

    const btnReviewExam = document.getElementById('btn-review-exam');
    if (btnReviewExam) {
      btnReviewExam.addEventListener('click', () => {
        document.getElementById('exam-result-modal').classList.remove('active');
        // Stay in active view and reveal correct answers
        reviewExamQuestions();
      });
    }
  }

  function startExam() {
    examUserAnswers = {};
    examActive = true;
    examTimeRemaining = 60 * 60; // 60 minutes

    // Select questions
    if (currentExamCode === 'RANDOM') {
      // Pick 40 random questions from database
      const shuffled = [...questions].sort(() => 0.5 - Math.random());
      examQuestions = shuffled.slice(0, 40);
    } else {
      const deNum = parseInt(currentExamCode, 10);
      examQuestions = questions.filter(q => q.de_num === deNum && q.exam_id && q.exam_id.startsWith('DE_'));
      if (examQuestions.length === 0) {
        examQuestions = questions.slice(0, 40);
      }
    }

    document.getElementById('exam-setup-view').style.display = 'none';
    document.getElementById('exam-active-view').style.display = 'block';

    const examTitleEl = document.getElementById('exam-current-name');
    if (examTitleEl) {
      examTitleEl.textContent = currentExamCode === 'RANDOM' ? 'ĐỀ THI NGẪU NHIÊN' : `ĐỀ KIỂM TRA 00${currentExamCode}`;
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
        const card = document.getElementById(`q-card-${q.id}`);
        if (card) {
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          grid.querySelectorAll('.palette-btn').forEach(b => b.classList.remove('current'));
          btn.classList.add('current');
        }
      });

      grid.appendChild(btn);
    });
  }

  function updateExamProgress() {
    const answeredCount = Object.keys(examUserAnswers).length;
    const progressText = document.getElementById('exam-progress-text');
    if (progressText) {
      progressText.textContent = `${answeredCount}/${examQuestions.length}`;
    }

    // Update palette button colors
    examQuestions.forEach(q => {
      const btn = document.getElementById(`palette-btn-${q.id}`);
      if (btn) {
        if (examUserAnswers[q.id]) {
          btn.classList.add('answered');
        } else {
          btn.classList.remove('answered');
        }
      }
    });
  }

  function finishExam() {
    clearInterval(examTimerInterval);
    examActive = false;

    let correctCount = 0;
    let cloCounts = {
      CLO1: { total: 0, correct: 0 },
      CLO2: { total: 0, correct: 0 },
      CLO3: { total: 0, correct: 0 }
    };

    examQuestions.forEach(q => {
      const clo = q.clo || 'CLO2';
      if (!cloCounts[clo]) cloCounts[clo] = { total: 0, correct: 0 };
      cloCounts[clo].total++;

      const uAns = examUserAnswers[q.id];
      if (uAns && uAns.isCorrect) {
        correctCount++;
        cloCounts[clo].correct++;
      }
    });

    const score = ((correctCount / examQuestions.length) * 10).toFixed(2);
    const timeSpent = (60 * 60) - examTimeRemaining;
    const timeSpentStr = `${Math.floor(timeSpent / 60)} phút ${timeSpent % 60} giây`;

    // Populate modal
    document.getElementById('modal-score-val').textContent = score;
    document.getElementById('modal-score-detail').textContent = `Đúng ${correctCount} / ${examQuestions.length} câu • Thời gian: ${timeSpentStr}`;

    // CLO Stats
    ['CLO1', 'CLO2', 'CLO3'].forEach(cloKey => {
      const c = cloCounts[cloKey] || { total: 1, correct: 0 };
      const percent = c.total > 0 ? Math.round((c.correct / c.total) * 100) : 0;
      const statEl = document.getElementById(`${cloKey.toLowerCase()}-result-stat`);
      const barEl = document.getElementById(`${cloKey.toLowerCase()}-progress-bar`);
      if (statEl) statEl.textContent = `${c.correct}/${c.total} câu (${percent}%)`;
      if (barEl) barEl.style.width = `${percent}%`;
    });

    document.getElementById('exam-result-modal').classList.add('active');
  }

  function reviewExamQuestions() {
    // Re-render questions in review mode with answers and explanations revealed
    const list = document.getElementById('exam-questions-list');
    if (!list) return;
    list.innerHTML = '';

    examQuestions.forEach((q, idx) => {
      const card = createQuestionCard(q, idx + 1, false); // use normal practice mode rendering
      list.appendChild(card);
    });
  }

  // Helpers
  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&#039;');
  }

  function formatMarkdownText(text) {
    if (!text) return '';
    return escapeHtml(text)
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="mono">$1</code>')
      .replace(/\n/g, '<br/>');
  }

  // Bootstrap when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
