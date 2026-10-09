/**
 * SCHEDULE, COUNTDOWN, POMODORO & DAILY STUDY TIME TRACKER
 * Học viện Kỹ thuật Mật mã (KMA) - Khóa ôn thi học kỳ 2026
 * Developed by ashv4ni & henise
 * Features:
 * - Live Exam Countdown (5 subjects, XSTK is TỰ LUẬN)
 * - Fixed Right Side Drawer (Dockable/Pinnable widget accessible on all tabs)
 * - Floating Quick Action Badge
 * - Automatic study time with a 15-minute inactivity limit
 * - Daily Study Tracker per subject/day
 * - Neo-brutalism Dark Mode Toggle
 */

(function () {
  'use strict';

  // 1. DỮ LIỆU LỊCH THI CÁC MÔN (THEO YÊU CẦU CỦA NGƯỜI DÙNG)
  // Kỹ thuật vi xử lý: 13h, 14h T3 13/10/2026
  // Tư tưởng Hồ Chí Minh: 13h, 15h T2 19/10/2026
  // Vật lý đại cương 2: 7h, 8h, 9h T4 21/10/2026
  // Giáo dục thể chất 3: 7h T5 22/10/2026
  // Toán xác suất thống kê: 13h, 15h T6 23/10/2026 (HÌNH THỨC: TỰ LUẬN)
  const EXAM_SCHEDULE = window.KMA_STUDY_SCHEDULE.exams;
  const STUDY_SUBJECTS = window.KMA_STUDY_SCHEDULE.subjects;

  // 3. STORAGE KEYS
  const STORAGE_KEY_STUDY_LOGS = 'kma_study_logs_v1';
  const STORAGE_KEY_THEME = 'kma_theme_mode_v1';
  const STORAGE_KEY_DRAWER_PINNED = 'kma_drawer_pinned_v1';

  const pomodoroState = { selectedSubject: 'ktvxl' };

  // 5. HELPER FORMAT TIME
  function getTodayKey() {
    return window.KMA_STREAK_MODEL.dayKey();
  }

  function formatMinutes(mins) {
    if (!mins || mins <= 0) return '0 phút';
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h > 0 && m > 0) return `${h} giờ ${m} phút`;
    if (h > 0) return `${h} giờ`;
    return `${m} phút`;
  }

  // 6. QUẢN LÝ NHẬT KÝ THỜI GIAN HỌC (STUDY LOGS)
  function getStudyLogs() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_STUDY_LOGS);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      console.warn('Lỗi đọc study logs:', e);
      return {};
    }
  }

  function saveStudyLogs(logs) {
    try {
      localStorage.setItem(STORAGE_KEY_STUDY_LOGS, JSON.stringify(logs));
    } catch (e) {
      console.warn('Lỗi ghi study logs:', e);
    }
  }

  function recordStudyTime(subjectKey, minutesToAdd, dateKey = getTodayKey()) {
    if (!subjectKey || minutesToAdd <= 0) return;
    const logs = getStudyLogs();
    const today = dateKey;
    if (!logs[today]) {
      logs[today] = {};
    }
    const cur = logs[today][subjectKey] || 0;
    logs[today][subjectKey] = cur + minutesToAdd;
    saveStudyLogs(logs);
    renderStudyStats();
  }

  function getTodayStats() {
    const logs = getStudyLogs();
    const today = getTodayKey();
    const todayLog = logs[today] || {};
    let totalMinutes = 0;
    const breakdown = {};

    STUDY_SUBJECTS.forEach(s => {
      const mins = todayLog[s.key] || 0;
      breakdown[s.key] = mins;
      totalMinutes += mins;
    });

    return { totalMinutes, breakdown, today };
  }

  // 8. ĐẾM NGƯỢC LỊCH THI THỜI GIAN THỰC (COUNTDOWN ENGINE)
  // Retain countdown nodes. Hidden calendars do not need second-by-second DOM work.
  const countdownNodes = new WeakMap();
  const setText = (node, text) => { if (node && node.textContent !== text) node.textContent = text; };
  const setClass = (node, value) => { if (node && node.className !== value) node.className = value; };
  function calendarCountdown(node, values) {
    if (!node) return;
    let digits = countdownNodes.get(node);
    if (!digits) {
      digits = [];
      const fragment = document.createDocumentFragment();
      ['NGÀY', 'GIỜ', 'PHÚT', 'GIÂY'].forEach((label, i) => {
        if (i) {
          const colon = document.createElement('div'); colon.className = 'cd-colon'; colon.textContent = ':';
          fragment.append(colon);
        }
        const box = document.createElement('div'); box.className = 'cd-digit-box';
        const number = document.createElement('span'); number.className = 'cd-num';
        const caption = document.createElement('span'); caption.className = 'cd-label'; caption.textContent = label;
        box.append(number, caption); fragment.append(box); digits.push(number);
      });
      node.replaceChildren(fragment); countdownNodes.set(node, digits);
    }
    values.forEach((value, i) => setText(digits[i], String(value).padStart(2, '0')));
  }
  function updateExamCountdowns() {
    if (document.visibilityState !== 'visible') return;
    const now = new Date();
    const mainVisible = document.getElementById('tab-schedule')?.classList.contains('active');
    const drawerVisible = document.getElementById('side-planner-drawer')?.classList.contains('open') &&
      document.getElementById('side-tab-schedule')?.classList.contains('active');
    let closestExam = null, minDiffMs = Infinity;
    for (const exam of EXAM_SCHEDULE) {
      const diffMs = exam.targetDate - now;
      if (diffMs > 0 && diffMs < minDiffMs) { minDiffMs = diffMs; closestExam = exam; }
      if (!mainVisible && !drawerVisible) continue;
      const cdEl = mainVisible ? document.getElementById(`exam-cd-${exam.id}`) : null;
      const badgeEl = mainVisible ? document.getElementById(`exam-badge-${exam.id}`) : null;
      const barEl = mainVisible ? document.getElementById(`exam-bar-${exam.id}`) : null;
      const drawerCdEl = drawerVisible ? document.getElementById(`drawer-exam-cd-${exam.id}`) : null;
      const drawerBadgeEl = drawerVisible ? document.getElementById(`drawer-exam-badge-${exam.id}`) : null;
      if (diffMs > 0) {
        const days = Math.floor(diffMs / 86400000), hours = Math.floor(diffMs / 3600000) % 24;
        const mins = Math.floor(diffMs / 60000) % 60, secs = Math.floor(diffMs / 1000) % 60;
        calendarCountdown(cdEl, [days, hours, mins, secs]);
        setText(drawerCdEl, `${days}d ${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`);
        const badge = days <= 5 ? `🔥 CÒN ${days} NGÀY (GẤP)` : days <= 10 ? `⚡ CÒN ${days} NGÀY` : `⏳ CÒN ${days} NGÀY`;
        const cls = 'neo-badge ' + (days <= 5 ? 'badge-exam-urgent' : days <= 10 ? 'badge-exam-warning' : 'badge-exam-info');
        for (const node of [badgeEl, drawerBadgeEl]) { setClass(node, cls); setText(node, badge); }
        if (barEl) {
          const pct = Math.min(100, Math.max(5, (1 - diffMs / (30 * 86400000)) * 100)).toFixed(2) + '%';
          if (barEl.style.width !== pct) barEl.style.width = pct;
        }
      } else {
        if (cdEl && countdownNodes.has(cdEl)) { countdownNodes.delete(cdEl); cdEl.replaceChildren(); }
        setText(cdEl, '✅ ĐÃ HOÀN THÀNH KỲ THI'); setText(drawerCdEl, '✅ Đã thi');
        for (const node of [badgeEl, drawerBadgeEl]) { setClass(node, 'neo-badge badge-exam-done'); setText(node, '🏁 ĐÃ THI XONG'); }
      }
    }
    updateGlobalTickerAndFloatingBadge(closestExam, now);
  }

  function updateGlobalTickerAndFloatingBadge(closestExam, now) {
    const info = document.getElementById('ticker-exam-info');
    const floatingExam = document.getElementById('floating-exam-mini');
    if (!closestExam) {
      setText(info, '🎉 Tất cả các môn đã hoàn thành kỳ thi! Chúc bạn đạt kết quả xuất sắc!');
      setText(floatingExam, '✅ Đã thi xong');
      return;
    }
    // Keep the nested ticker clock attached when its subject label changes.
    let clock = document.getElementById('ticker-countdown-val');
    if (info && info.dataset.exam !== closestExam.id) {
      clock ||= document.createElement('span'); clock.id = 'ticker-countdown-val'; clock.className = 'ticker-countdown';
      const title = document.createElement('strong'); title.textContent = closestExam.name;
      info.replaceChildren('Môn gần nhất: ', title, ` (${closestExam.timeStr} ${closestExam.dateStr}) — `, clock);
      info.dataset.exam = closestExam.id;
    }
    const diffMs = closestExam.targetDate - now;
    const days = Math.floor(diffMs / 86400000), hours = Math.floor(diffMs / 3600000) % 24;
    const mins = Math.floor(diffMs / 60000) % 60, secs = Math.floor(diffMs / 1000) % 60;
    setText(clock, `${days} ngày ${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`);
    setText(floatingExam, `${closestExam.icon} ${days}d ${hours}h`);
  }

  // 9. POMODORO CONTROLS & LOGIC (SYNCS BOTH FULL PAGE & FIXED DRAWER)
  function initPomodoroUI() {
    renderPomodoroDisplay();
    renderSubjectSelector();
    renderDrawerScheduleList();
    renderStudyStats();
  }

  function renderPomodoroDisplay() { updatePomodoroSelectedSubjectLabel(); }
  function renderSubjectSelector() { updatePomodoroSelectedSubjectLabel(); }
  function selectPomodoroSubject(subject) {
    if (subject === pomodoroState.selectedSubject) return;
    pomodoroState.selectedSubject = subject;
    updatePomodoroSelectedSubjectLabel();
  }
  function updatePomodoroSelectedSubjectLabel() {
    const labels = [
      document.getElementById('pomodoro-current-subject-label'),
      document.getElementById('drawer-pomodoro-current-subject-label')
    ];
    const subj = STUDY_SUBJECTS.find(s => s.key === pomodoroState.selectedSubject);
    if (!subj) return;

    labels.forEach(label => {
      if (label) {
        const text = `${subj.icon} ${subj.name}`;
        if (label.textContent !== text) label.textContent = text;
      }
    });
  }

  function renderDrawerScheduleList() {
    const container = document.getElementById('drawer-schedule-list-container');
    if (!container) return;

    container.innerHTML = EXAM_SCHEDULE.map(exam => {
      return `
        <div class="exam-schedule-card compact-drawer-card" id="drawer-exam-card-${exam.id}" style="border-top: 4px solid ${exam.themeBorder}; padding: 12px; margin-bottom: 10px;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="font-size: 1.2rem;">${exam.icon}</span>
              <div>
                <strong style="font-size: 0.92rem; display: block;">${exam.name}</strong>
                <span style="font-size: 0.72rem; color: #64748B;">${exam.dateStr} • ${exam.timeStr}</span>
              </div>
            </div>
            <span class="neo-badge" id="drawer-exam-badge-${exam.id}" style="font-size: 0.7rem; padding: 2px 6px;">Đang tính</span>
          </div>

          <div style="background: #0F172A; color: #FFF; padding: 6px 10px; border-radius: 4px; border: 1.5px solid #000; display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 0.72rem; font-weight: 800; color: #94A3B8;">CÒN LẠI:</span>
            <div id="drawer-exam-cd-${exam.id}"><span style="color: #FFE600; font-family: monospace; font-weight: 900;">...</span></div>
          </div>

          <div style="font-size: 0.74rem; line-height: 1.35; color: #475569; margin-bottom: 8px;">
            ${exam.id === 'xstk' ? '<strong style="color: #DC2626;">📝 HÌNH THỨC: TỰ LUẬN</strong>' : '📝 ' + exam.format}
          </div>

          <div style="display: flex; gap: 6px;">
            ${exam.hasSystemSubject ? `
              <button class="neo-btn neo-btn-sm neo-btn-yellow btn-jump-subject-practice" data-subject="${exam.subjectKey}" style="flex: 1; padding: 4px 8px; font-size: 0.75rem;">
                🎯 Ôn Tập
              </button>
            ` : ''}
            <button class="neo-btn neo-btn-sm neo-btn-white btn-jump-subject-pomo" data-subject="${exam.subjectKey}" style="flex: 1; padding: 4px 8px; font-size: 0.75rem;">
              🍅 Bấm Giờ
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Rebind jumps
    container.querySelectorAll('.btn-jump-subject-practice').forEach(btn => {
      btn.addEventListener('click', () => {
        const sKey = btn.getAttribute('data-subject');
        jumpToSubjectPractice(sKey);
      });
    });

    container.querySelectorAll('.btn-jump-subject-pomo').forEach(btn => {
      btn.addEventListener('click', () => {
        const sKey = btn.getAttribute('data-subject');
        jumpToSubjectPractice(sKey);
        // Switch drawer tab to pomodoro
        switchDrawerTab('side-tab-pomo');
        showToastNotification(`Đang xem môn "${STUDY_SUBJECTS.find(s => s.key === sKey)?.name}" để học!`);
      });
    });
  }

  // 10. TOAST NOTIFICATION VỚI NEOBRUTALISM STYLE
  function showToastNotification(msg) {
    let toast = document.getElementById('kma-pomo-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'kma-pomo-toast';
      toast.className = 'neo-box neo-toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <span style="font-size: 1.5rem;">🍅</span>
        <div style="font-weight: 800; font-size: 0.95rem; line-height: 1.4;">${msg}</div>
      </div>
    `;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 5500);
  }

  // 11. BẢNG THỐNG KÊ THỜI GIAN ĐÃ HỌC / MÔN / NGÀY
  function renderStudyStats() {
    const stats = getTodayStats();

    // Main page elements
    const totalEl = document.getElementById('stat-today-total-time');
    const sessionsEl = document.getElementById('stat-today-sessions');
    const topSubjEl = document.getElementById('stat-today-top-subject');
    const breakdownContainer = document.getElementById('study-subject-breakdown-list');

    // Drawer elements
    const drawerTotalEl = document.getElementById('drawer-stat-today-total');
    const drawerBreakdown = document.getElementById('drawer-study-breakdown-list');

    const totalText = formatMinutes(stats.totalMinutes);
    if (totalEl) totalEl.textContent = totalText;
    if (drawerTotalEl) drawerTotalEl.textContent = totalText;
    if (sessionsEl) sessionsEl.textContent = 'Tự động';

    let topSubjKey = null;
    let maxMins = 0;
    Object.entries(stats.breakdown).forEach(([k, mins]) => {
      if (mins > maxMins) {
        maxMins = mins;
        topSubjKey = k;
      }
    });

    if (topSubjEl) {
      if (topSubjKey && maxMins > 0) {
        const topSubj = STUDY_SUBJECTS.find(s => s.key === topSubjKey);
        topSubjEl.innerHTML = `${topSubj ? topSubj.icon + ' ' + topSubj.name : 'Chưa có'} (${formatMinutes(maxMins)})`;
      } else {
        topSubjEl.textContent = 'Chưa ghi nhận hôm nay';
      }
    }

    const renderBreakdownHtml = (isCompact = false) => {
      return STUDY_SUBJECTS.map(subj => {
        const mins = stats.breakdown[subj.key] || 0;
        const pct = stats.totalMinutes > 0 ? Math.round((mins / stats.totalMinutes) * 100) : 0;
        return `
          <div class="study-stat-row ${isCompact ? 'compact-stat-row' : ''}">
            <div class="stat-row-info">
              <span class="stat-row-icon">${subj.icon}</span>
              <div class="stat-row-names">
                <span class="stat-row-title">${subj.name}</span>
                <span class="stat-row-pct">${pct}% tổng thời gian</span>
              </div>
              <strong class="stat-row-mins">${formatMinutes(mins)}</strong>
            </div>
            <div class="stat-bar-track">
              <div class="stat-bar-fill" style="width: ${pct}%; background: ${subj.color};"></div>
            </div>
            <div class="stat-quick-btns">
              <button class="stat-add-btn" data-subj="${subj.key}" data-add="15">+15p</button>
              <button class="stat-add-btn" data-subj="${subj.key}" data-add="30">+30p</button>
              <button class="stat-add-btn" data-subj="${subj.key}" data-add="60">+1h</button>
            </div>
          </div>
        `;
      }).join('');
    };

    if (breakdownContainer) {
      breakdownContainer.innerHTML = renderBreakdownHtml(false);
      bindStatAddButtons(breakdownContainer);
    }
    if (drawerBreakdown) {
      drawerBreakdown.innerHTML = renderBreakdownHtml(true);
      bindStatAddButtons(drawerBreakdown);
    }

    renderRecentHistoryTable();
  }

  function bindStatAddButtons(container) {
    container.querySelectorAll('.stat-add-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const sKey = btn.getAttribute('data-subj');
        const addM = parseInt(btn.getAttribute('data-add'), 10);
        recordStudyTime(sKey, addM);
        showToastNotification(`Đã ghi nhận +${addM} phút học môn "${STUDY_SUBJECTS.find(s => s.key === sKey)?.name}"!`);
      });
    });
  }

  function renderRecentHistoryTable() {
    const tableBody = document.getElementById('study-history-tbody');
    if (!tableBody) return;

    const logs = getStudyLogs();
    const dates = Object.keys(logs).sort().reverse().slice(0, 7);

    if (dates.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 20px; color: #666;">Chưa có dữ liệu học tập. Làm bài hoặc đọc kiến thức để tự động ghi nhận thời gian học.</td></tr>`;
      return;
    }

    tableBody.innerHTML = dates.map(dt => {
      const dayLog = logs[dt] || {};
      let totalM = 0;
      const details = [];
      STUDY_SUBJECTS.forEach(s => {
        const m = dayLog[s.key] || 0;
        if (m > 0) {
          totalM += m;
          details.push(`${s.icon} ${s.name}: ${formatMinutes(m)}`);
        }
      });

      return `
        <tr>
          <td style="font-weight: 800; font-family: monospace;">${dt === getTodayKey() ? '⭐ Hôm nay (' + dt + ')' : dt}</td>
          <td style="font-weight: 900; color: #166534;">${formatMinutes(totalM)}</td>
          <td style="font-size: 0.88rem; line-height: 1.4;">${details.length > 0 ? details.join(' • ') : 'Không học'}</td>
          <td>
            <button class="neo-btn neo-btn-sm neo-btn-white btn-clear-day" data-date="${dt}" style="padding: 3px 8px; font-size: 0.75rem;">
              ✕ Xóa
            </button>
          </td>
        </tr>
      `;
    }).join('');

    tableBody.querySelectorAll('.btn-clear-day').forEach(btn => {
      btn.addEventListener('click', () => {
        const d = btn.getAttribute('data-date');
        if (confirm(`Bạn có chắc muốn xóa lịch sử học tập ngày ${d}?`)) {
          const l = getStudyLogs();
          delete l[d];
          saveStudyLogs(l);
          renderStudyStats();
        }
      });
    });
  }

  // 12. SIDE DRAWER CONTROLS & PINNING
  function toggleSideDrawer(forceOpen) {
    const drawer = document.getElementById('side-planner-drawer');
    if (!drawer) return;
    if (typeof forceOpen === 'boolean') {
      drawer.classList.toggle('open', forceOpen);
    } else {
      drawer.classList.toggle('open');
    }
    if (drawer.classList.contains('open')) updateExamCountdowns();
  }

  function togglePinSideDrawer() {
    const isPinned = document.body.classList.toggle('planner-pinned');
    localStorage.setItem(STORAGE_KEY_DRAWER_PINNED, isPinned ? 'true' : 'false');
    const pinBtn = document.getElementById('btn-pin-side-drawer');
    if (pinBtn) {
      pinBtn.innerHTML = isPinned ? '📌 Đã ghim' : '📌 Ghim';
      pinBtn.classList.toggle('neo-btn-yellow', isPinned);
      pinBtn.classList.toggle('neo-btn-white', !isPinned);
    }
    if (isPinned) toggleSideDrawer(true);
  }

  function switchDrawerTab(tabId) {
    document.querySelectorAll('.side-nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-drawer-tab') === tabId);
    });
    document.querySelectorAll('.side-tab-content').forEach(pane => {
      pane.classList.toggle('active', pane.id === tabId);
    });
    updateExamCountdowns();
  }

  // 13. DARK MODE TOGGLE & PERSISTENCE
  function toggleDarkMode() {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem(STORAGE_KEY_THEME, isDark ? 'dark' : 'light');
    updateDarkModeBtn();
  }

  function updateDarkModeBtn() {
    const isDark = document.body.classList.contains('dark-mode');
    const btn = document.getElementById('btn-toggle-dark-mode');
    if (btn) {
      btn.innerHTML = isDark ? '☀️ Sáng' : '🌙 Tối';
      btn.title = isDark ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối (Dark Mode)';
    }
  }

  function initTheme() {
    const saved = localStorage.getItem(STORAGE_KEY_THEME);
    const requested = new URLSearchParams(location.search).get('theme');
    if (requested === 'dark' || (requested !== 'light' && saved === 'dark')) {
      document.body.classList.add('dark-mode');
    }
    updateDarkModeBtn();

    const pinned = localStorage.getItem(STORAGE_KEY_DRAWER_PINNED);
    if (pinned === 'true') {
      document.body.classList.add('planner-pinned');
      toggleSideDrawer(true);
      const pinBtn = document.getElementById('btn-pin-side-drawer');
      if (pinBtn) {
        pinBtn.innerHTML = '📌 Đã ghim';
        pinBtn.classList.add('neo-btn-yellow');
        pinBtn.classList.remove('neo-btn-white');
      }
    }
  }

  // 14. SETUP CÁC NÚT ĐIỀU KHIỂN & SỰ KIỆN
  function setupEventListeners() {
    // Dark mode toggle
    const btnTheme = document.getElementById('btn-toggle-dark-mode');
    if (btnTheme) btnTheme.addEventListener('click', toggleDarkMode);

    // Floating trigger & Header drawer button
    const btnFloat = document.getElementById('btn-floating-planner');
    if (btnFloat) btnFloat.addEventListener('click', () => toggleSideDrawer());

    const btnHeaderPomo = document.getElementById('btn-toggle-side-planner');
    if (btnHeaderPomo) btnHeaderPomo.addEventListener('click', () => toggleSideDrawer(true));

    const btnCloseDrawer = document.getElementById('btn-close-side-drawer');
    if (btnCloseDrawer) btnCloseDrawer.addEventListener('click', () => toggleSideDrawer(false));

    const btnPinDrawer = document.getElementById('btn-pin-side-drawer');
    if (btnPinDrawer) btnPinDrawer.addEventListener('click', togglePinSideDrawer);

    // Drawer Tabs
    document.querySelectorAll('.side-nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-drawer-tab');
        switchDrawerTab(target);
      });
    });

    // Reset All Study Stats
    const btnResetAllStats = document.getElementById('btn-reset-all-study-stats');
    if (btnResetAllStats) {
      btnResetAllStats.addEventListener('click', () => {
        if (confirm('Bạn có chắc muốn xóa sạch toàn bộ lịch sử thời gian đã học trên máy này?')) {
          localStorage.removeItem(STORAGE_KEY_STUDY_LOGS);
          renderStudyStats();
          showToastNotification('Đã làm mới dữ liệu thống kê học tập.');
        }
      });
    }

    // Quick Jumps from Main Page Cards
    document.querySelectorAll('.btn-jump-subject-practice').forEach(btn => {
      btn.addEventListener('click', () => {
        const subj = btn.getAttribute('data-subject');
        jumpToSubjectPractice(subj);
      });
    });

    document.querySelectorAll('.btn-jump-subject-pomo').forEach(btn => {
      btn.addEventListener('click', () => {
        const subj = btn.getAttribute('data-subject');
        jumpToSubjectPractice(subj);
        // Also open side drawer to Pomodoro tab!
        toggleSideDrawer(true);
        switchDrawerTab('side-tab-pomo');
        showToastNotification(`Đang xem môn "${STUDY_SUBJECTS.find(s => s.key === subj)?.name}" để học!`);
      });
    });
  }

  function jumpToSubjectPractice(subjKey) {
    if (!subjKey) return;
    if (window.switchSubject) {
      window.switchSubject(subjKey);
    } else {
      const subjBtn = document.getElementById(`btn-subj-${subjKey}`);
      if (subjBtn) subjBtn.click();
    }

    const practiceTabBtn = document.getElementById('btn-tab-practice');
    if (practiceTabBtn) practiceTabBtn.click();

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // 15. INITIALIZATION
  function init() {
    initTheme();
    const preview = new URLSearchParams(location.search);
    if (preview.get('preview') === 'allhallows' && !preview.has('diagram')) {
      const subject = preview.get('subject');
      if (['ktvxl', 'tthcm', 'vldc', 'xstk'].includes(subject)) window.switchSubject(subject);
      const tab = preview.get('tab') || 'knowledge';
      if (['practice', 'exam', 'knowledge', 'download', 'schedule'].includes(tab)) {
        document.getElementById('btn-tab-' + tab)?.click();
      }
    }
    updateExamCountdowns();
    setInterval(updateExamCountdowns, 1000);
    document.addEventListener('visibilitychange', updateExamCountdowns);
    document.getElementById('btn-tab-schedule')?.addEventListener('click', updateExamCountdowns);
    initPomodoroUI();
    setupEventListeners();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.KMA_SCHEDULE_POMODORO = {
    recordStudyTime,
    renderStudyStats,
    getTodayStats,
    setStudySubject: selectPomodoroSubject,
    jumpToSubjectPractice,
    toggleSideDrawer,
    toggleDarkMode
  };

})();
