/**
 * SCHEDULE, COUNTDOWN, POMODORO & DAILY STUDY TIME TRACKER
 * Học viện Kỹ thuật Mật mã (KMA) - Khóa ôn thi học kỳ 2026
 * Developed by ashv4ni & henise
 * Features:
 * - Live Exam Countdown (5 subjects, XSTK is TỰ LUẬN)
 * - Fixed Right Side Drawer (Dockable/Pinnable widget accessible on all tabs)
 * - Floating Quick Action Badge
 * - Pomodoro Focus Timer (Presets, Custom minutes, Audio chimes)
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

  // 4. TRẠNG THÁI POMODORO
  const pomodoroState = {
    mode: 'focus', // 'focus' | 'shortBreak' | 'longBreak'
    durationMinutes: 25,
    remainingSeconds: 25 * 60,
    totalSeconds: 25 * 60,
    isRunning: false,
    intervalId: null,
    selectedSubject: 'ktvxl',
    completedSessions: 0,
    soundEnabled: true,
    elapsedSecondsInSession: 0,
    runningSince: null,
    loggedMinutes: 0
  };

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

  // 7. WEB AUDIO API CHIME
  function playCompletionChime() {
    if (!pomodoroState.soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      const notes = [
        { freq: 1046.5, time: 0.0, dur: 0.35 },
        { freq: 1318.5, time: 0.25, dur: 0.35 },
        { freq: 1568.0, time: 0.5, dur: 0.6 }
      ];

      notes.forEach(n => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(n.freq, ctx.currentTime + n.time);

        gain.gain.setValueAtTime(0.001, ctx.currentTime + n.time);
        gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + n.time + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + n.time + n.dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + n.time);
        osc.stop(ctx.currentTime + n.time + n.dur);
      });
    } catch (e) {
      console.log('Không thể phát âm thanh chuông:', e);
    }
  }

  // 8. ĐẾM NGƯỢC LỊCH THI THỜI GIAN THỰC (COUNTDOWN ENGINE)
  function updateExamCountdowns() {
    const now = new Date();
    let closestExam = null;
    let minDiffMs = Infinity;

    EXAM_SCHEDULE.forEach(exam => {
      const diffMs = exam.targetDate - now;
      const cdEl = document.getElementById(`exam-cd-${exam.id}`);
      const badgeEl = document.getElementById(`exam-badge-${exam.id}`);
      const barEl = document.getElementById(`exam-bar-${exam.id}`);

      // Drawer compact elements
      const drawerCdEl = document.getElementById(`drawer-exam-cd-${exam.id}`);
      const drawerBadgeEl = document.getElementById(`drawer-exam-badge-${exam.id}`);

      if (diffMs > 0) {
        if (diffMs < minDiffMs) {
          minDiffMs = diffMs;
          closestExam = exam;
        }

        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
        const mins = Math.floor((diffMs / (1000 * 60)) % 60);
        const secs = Math.floor((diffMs / 1000) % 60);

        const cdHtml = `
          <div class="cd-digit-box"><span class="cd-num">${String(days).padStart(2, '0')}</span><span class="cd-label">NGÀY</span></div>
          <div class="cd-colon">:</div>
          <div class="cd-digit-box"><span class="cd-num">${String(hours).padStart(2, '0')}</span><span class="cd-label">GIỜ</span></div>
          <div class="cd-colon">:</div>
          <div class="cd-digit-box"><span class="cd-num">${String(mins).padStart(2, '0')}</span><span class="cd-label">PHÚT</span></div>
          <div class="cd-colon">:</div>
          <div class="cd-digit-box"><span class="cd-num">${String(secs).padStart(2, '0')}</span><span class="cd-label">GIÂY</span></div>
        `;

        if (cdEl) cdEl.innerHTML = cdHtml;
        if (drawerCdEl) {
          drawerCdEl.innerHTML = `<span style="font-family: monospace; font-weight: 900; color: #DC2626;">${days}d ${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}</span>`;
        }

        const badgeHtml = days <= 5 ? `🔥 CÒN ${days} NGÀY (GẤP)` : (days <= 10 ? `⚡ CÒN ${days} NGÀY` : `⏳ CÒN ${days} NGÀY`);
        const badgeClass = days <= 5 ? 'neo-badge badge-exam-urgent' : (days <= 10 ? 'neo-badge badge-exam-warning' : 'neo-badge badge-exam-info');

        if (badgeEl) {
          badgeEl.className = badgeClass;
          badgeEl.innerHTML = badgeHtml;
        }
        if (drawerBadgeEl) {
          drawerBadgeEl.className = badgeClass;
          drawerBadgeEl.innerHTML = badgeHtml;
        }

        if (barEl) {
          const totalWindow = 30 * 24 * 3600 * 1000;
          const passed = Math.max(0, totalWindow - diffMs);
          const pct = Math.min(100, Math.max(5, (passed / totalWindow) * 100));
          barEl.style.width = `${pct}%`;
        }
      } else {
        if (cdEl) cdEl.innerHTML = `<div class="cd-finished-msg">✅ ĐÃ HOÀN THÀNH KỲ THI</div>`;
        if (drawerCdEl) drawerCdEl.innerHTML = `<span style="color: #10B981; font-weight: 800;">✅ Đã thi</span>`;
        if (badgeEl) {
          badgeEl.className = 'neo-badge badge-exam-done';
          badgeEl.innerHTML = `🏁 ĐÃ THI XONG`;
        }
      }
    });

    // Update Global Ticker & Floating Badge
    updateGlobalTickerAndFloatingBadge(closestExam, now);
  }

  function updateGlobalTickerAndFloatingBadge(closestExam, now) {
    const tickerVal = document.getElementById('ticker-countdown-val');
    const tickerInfo = document.getElementById('ticker-exam-info');
    const floatingExam = document.getElementById('floating-exam-mini');

    if (!closestExam) {
      if (tickerInfo) tickerInfo.innerHTML = `🎉 Tất cả các môn đã hoàn thành kỳ thi! Chúc bạn đạt kết quả xuất sắc!`;
      if (tickerVal) tickerVal.innerHTML = ``;
      if (floatingExam) floatingExam.textContent = `✅ Đã thi xong`;
      return;
    }

    const diffMs = closestExam.targetDate - now;
    if (diffMs > 0) {
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diffMs / (1000 * 60)) % 60);
      const secs = Math.floor((diffMs / 1000) % 60);

      if (tickerInfo) {
        tickerInfo.innerHTML = `Môn gần nhất: <strong>${closestExam.name}</strong> (${closestExam.timeStr} ${closestExam.dateStr}) — `;
      }
      if (tickerVal) {
        tickerVal.innerHTML = `<span style="color: #DC2626; font-weight: 900;">${days} ngày ${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}</span>`;
      }
      if (floatingExam) {
        floatingExam.textContent = `${closestExam.icon} ${days}d ${hours}h`;
      }
    }
  }

  // 9. POMODORO CONTROLS & LOGIC (SYNCS BOTH FULL PAGE & FIXED DRAWER)
  function initPomodoroUI() {
    renderPomodoroDisplay();
    renderSubjectSelector();
    renderDrawerScheduleList();
    renderStudyStats();
  }

  function renderPomodoroDisplay() {
    const mins = Math.floor(pomodoroState.remainingSeconds / 60);
    const secs = pomodoroState.remainingSeconds % 60;
    const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    // Update Main Page Timer
    const timeDisplay = document.getElementById('pomodoro-time-display');
    const progressFill = document.getElementById('pomodoro-progress-bar');
    const modeBadge = document.getElementById('pomodoro-mode-badge');
    const btnStart = document.getElementById('btn-pomodoro-start');
    const sessionCount = document.getElementById('pomodoro-session-count');

    // Update Drawer Timer
    const drawerTimeDisplay = document.getElementById('drawer-pomo-digits');
    const drawerProgressFill = document.getElementById('drawer-pomo-progress-bar');
    const drawerBtnStart = document.getElementById('drawer-btn-pomo-start');
    const floatingTime = document.getElementById('floating-pomo-digits');

    if (timeDisplay) timeDisplay.textContent = timeStr;
    if (drawerTimeDisplay) drawerTimeDisplay.textContent = timeStr;
    if (floatingTime) floatingTime.textContent = timeStr;

    // Document Title Update khi đang chạy
    if (pomodoroState.isRunning) {
      document.title = `(${timeStr}) Pomodoro - KTVXL KMA`;
    }

    const pct = pomodoroState.totalSeconds > 0
      ? ((pomodoroState.totalSeconds - pomodoroState.remainingSeconds) / pomodoroState.totalSeconds) * 100
      : 0;

    if (progressFill) progressFill.style.width = `${Math.min(100, Math.max(0, pct))}%`;
    if (drawerProgressFill) drawerProgressFill.style.width = `${Math.min(100, Math.max(0, pct))}%`;

    const modeText = pomodoroState.mode === 'focus'
      ? '🍅 TẬP TRUNG CAO ĐỘ'
      : (pomodoroState.mode === 'shortBreak' ? '☕ NGHỈ NGẮN (5P)' : '🏖️ NGHỈ DÀI (15P)');
    const modeBg = pomodoroState.mode === 'focus' ? '#EF4444' : (pomodoroState.mode === 'shortBreak' ? '#10B981' : '#3B82F6');

    if (modeBadge) {
      modeBadge.textContent = modeText;
      modeBadge.style.background = modeBg;
      modeBadge.style.color = '#FFF';
    }

    const startBtnHtml = pomodoroState.isRunning ? '⏸️ TẠM DỪNG' : '▶️ BẮT ĐẦU';
    const startBtnClass = pomodoroState.isRunning ? 'neo-btn neo-btn-yellow' : 'neo-btn neo-btn-green';

    if (btnStart) {
      if (btnStart.textContent !== startBtnHtml) btnStart.textContent = startBtnHtml;
      btnStart.className = startBtnClass;
    }
    if (drawerBtnStart) {
      if (drawerBtnStart.textContent !== startBtnHtml) drawerBtnStart.textContent = startBtnHtml;
      drawerBtnStart.className = startBtnClass;
    }

    if (sessionCount) {
      sessionCount.textContent = `${pomodoroState.completedSessions} phiên`;
    }
  }

  function renderSubjectSelector() {
    const containers = [
      document.getElementById('pomodoro-subject-chips'),
      document.getElementById('drawer-pomodoro-subject-chips')
    ];

    containers.forEach(container => {
      if (!container) return;
      container.innerHTML = STUDY_SUBJECTS.map(subj => {
        const isSel = pomodoroState.selectedSubject === subj.key;
        return `
          <button class="pomo-subj-btn ${isSel ? 'active' : ''}" data-subj="${subj.key}">
            <span>${subj.icon}</span>
            <span>${subj.name}</span>
          </button>
        `;
      }).join('');

      container.querySelectorAll('.pomo-subj-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          containers.forEach(c => c && c.querySelectorAll('.pomo-subj-btn').forEach(b => b.classList.remove('active')));
          const sKey = btn.getAttribute('data-subj');
          selectPomodoroSubject(sKey);
          // Mark active on all
          containers.forEach(c => {
            const match = c ? c.querySelector(`.pomo-subj-btn[data-subj="${sKey}"]`) : null;
            if (match) match.classList.add('active');
          });
          updatePomodoroSelectedSubjectLabel();
        });
      });
    });

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
        label.innerHTML = `Đang học môn: <strong style="color: #000; background: ${subj.color}; padding: 2px 8px; border-radius: 4px; border: 1.5px solid #000;">${subj.icon} ${subj.name}</strong>`;
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
        selectPomodoroSubject(sKey);
        renderSubjectSelector();
        // Switch drawer tab to pomodoro
        switchDrawerTab('side-tab-pomo');
        showToastNotification(`Đã chọn môn "${STUDY_SUBJECTS.find(s => s.key === sKey)?.name}" cho Pomodoro!`);
      });
    });
  }

  let startingPomodoro = false, pomodoroGeneration = 0;
  const timerWriter = sessionStorage.getItem('kma_timer_writer') || crypto.randomUUID();
  sessionStorage.setItem('kma_timer_writer', timerWriter);
  function selectPomodoroSubject(subject) {
    if (subject === pomodoroState.selectedSubject) return;
    if (pomodoroState.isRunning || pomodoroState.elapsedSecondsInSession > 0 || startingPomodoro) resetPomodoro();
    pomodoroState.selectedSubject = subject;
  }
  async function startPomodoro() {
    if (startingPomodoro) return;
    if (pomodoroState.isRunning) {
      pausePomodoro();
      return;
    }

    if (pomodoroState.mode === 'focus' && window.KMA_ACCOUNT) {
      const generation = pomodoroGeneration;
      startingPomodoro = true;
      try {
        const data = await window.KMA_ACCOUNT.focusStart(pomodoroState.selectedSubject, Math.ceil(pomodoroState.totalSeconds / 60));
        if (data?.duration_minutes && generation === pomodoroGeneration) {
          const elapsed = serverElapsed(data);
          if (!pomodoroState.elapsedSecondsInSession) pomodoroState.loggedMinutes = Math.floor(elapsed / 60);
          pomodoroState.elapsedSecondsInSession = elapsed;
        }
      } catch (_) {
        showToastNotification('Phiên này vẫn lưu vào lịch sử học tại máy. Chưa ghi nhận được vào bảng xếp hạng; hãy kiểm tra tài khoản.');
      } finally { startingPomodoro = false; }
      if (generation !== pomodoroGeneration) {
        window.KMA_ACCOUNT.focusCancel().catch(() => {});
        return;
      }
    }
    pomodoroState.isRunning = true;
    pomodoroState.runningSince = Date.now();
    persistTimer();
    startTimerInterval();
    renderPomodoroDisplay();
  }

  function persistTimer() {
    const key = window.KMA_ACCOUNT?.timerStorageKey() || 'kma_cloud_v1:guest:timer';
    localStorage.setItem(key, JSON.stringify({ ...pomodoroState, intervalId: null, writer: timerWriter }));
  }
  function reconcileTimer(now = Date.now()) {
    const clock = window.KMA_POMODORO_CLOCK.sample(pomodoroState, now);
    pomodoroState.remainingSeconds = clock.remaining;
    if (pomodoroState.mode === 'focus' && clock.minutes > pomodoroState.loggedMinutes) {
      const byDay = new Map();
      for (let minute = pomodoroState.loggedMinutes + 1; minute <= clock.minutes; minute++) {
        const instant = pomodoroState.runningSince == null ? now :
          Math.min(now, pomodoroState.runningSince + (minute * 60 - pomodoroState.elapsedSecondsInSession) * 1000);
        const key = window.KMA_STREAK_MODEL.dayKey(instant);
        byDay.set(key, (byDay.get(key) || 0) + 1);
      }
      for (const [key, minutes] of byDay) recordStudyTime(pomodoroState.selectedSubject, minutes, key);
      pomodoroState.loggedMinutes = clock.minutes;
      persistTimer();
    }
    return clock;
  }
  function startTimerInterval() {
    if (pomodoroState.intervalId) clearInterval(pomodoroState.intervalId);
    pomodoroState.intervalId = setInterval(() => {
      reconcileTimer();
      renderPomodoroDisplay();
      if (pomodoroState.remainingSeconds === 0) finishPomodoroSession();
    }, 1000);
  }
  function stopTimer() {
    const clock = reconcileTimer();
    pomodoroState.elapsedSecondsInSession = clock.elapsed;
    pomodoroState.runningSince = null;
    pomodoroState.isRunning = false;
    if (pomodoroState.intervalId) clearInterval(pomodoroState.intervalId);
    pomodoroState.intervalId = null;
    persistTimer();
    document.title = 'KTVXL by ashv4ni & henise';
    renderPomodoroDisplay();
  }
  function restoreCloudFocus(data) {
    const key = window.KMA_ACCOUNT.timerStorageKey();
    let saved; try {
      const value = JSON.parse(localStorage.getItem(key));
      if (value.writer !== timerWriter) return;
      saved = window.KMA_POMODORO_CLOCK.restore(value);
    } catch (_) {}
    if (!saved || saved.mode !== 'focus' || saved.selectedSubject !== data.subject || saved.totalSeconds !== data.duration_minutes * 60) return;
    Object.assign(pomodoroState, saved);
    const elapsed = serverElapsed(data);
    pomodoroState.elapsedSecondsInSession = elapsed;
    pomodoroState.isRunning = data.state === 'running';
    pomodoroState.runningSince = pomodoroState.isRunning ? Date.now() : null;
    reconcileTimer();
    renderSubjectSelector();
    renderPomodoroDisplay();
    persistTimer();
    if (pomodoroState.isRunning) startTimerInterval();
  }
  function serverElapsed(data) {
    return Math.min(data.duration_minutes * 60, Math.max(0, Number(data.server_elapsed) ||
      Number(data.elapsed_seconds) + (data.state === 'running' ? Math.max(0, (Date.now() - Date.parse(data.resumed_at)) / 1000) : 0) || 0));
  }
  document.addEventListener('visibilitychange', () => {
    if (!pomodoroState.isRunning) return;
    reconcileTimer();
    persistTimer();
    renderPomodoroDisplay();
    if (pomodoroState.remainingSeconds === 0) finishPomodoroSession();
  });
  window.addEventListener('pagehide', () => { if (pomodoroState.isRunning) { reconcileTimer(); persistTimer(); } });
  window.addEventListener('storage', event => {
    if (event.key !== window.KMA_ACCOUNT?.timerStorageKey() || !pomodoroState.isRunning) return;
    let value; try { value = JSON.parse(event.newValue); } catch (_) { return; }
    if (value?.isRunning && value.writer !== timerWriter) {
      // Another tab took over this same server session. Stop only this display.
      pomodoroState.elapsedSecondsInSession = window.KMA_POMODORO_CLOCK.elapsed(pomodoroState);
      pomodoroState.isRunning = false;
      pomodoroState.runningSince = null;
      clearInterval(pomodoroState.intervalId);
      pomodoroState.intervalId = null;
      renderPomodoroDisplay();
    }
  });

  function pausePomodoro() {
    if (pomodoroState.isRunning && pomodoroState.mode === 'focus') window.KMA_ACCOUNT?.focusPause().catch(() => {});
    stopTimer();
  }

  function resetPomodoro() {
    pomodoroGeneration++;
    pausePomodoro();
    window.KMA_ACCOUNT?.focusCancel().catch(() => {});
    pomodoroState.remainingSeconds = pomodoroState.totalSeconds;
    pomodoroState.elapsedSecondsInSession = 0;
    pomodoroState.loggedMinutes = 0;
    persistTimer();
    renderPomodoroDisplay();
  }

  function setPomodoroDuration(minutes, mode = 'focus', cancel = true) {
    pomodoroGeneration++;
    stopTimer();
    if (cancel) window.KMA_ACCOUNT?.focusCancel().catch(() => {});
    pomodoroState.mode = mode;
    pomodoroState.durationMinutes = minutes;
    pomodoroState.totalSeconds = minutes * 60;
    pomodoroState.remainingSeconds = minutes * 60;
    pomodoroState.elapsedSecondsInSession = 0;
    pomodoroState.loggedMinutes = 0;
    persistTimer();
    renderPomodoroDisplay();
  }

  let finishingPomodoro = false;
  function finishPomodoroSession() {
    if (finishingPomodoro) return;
    finishingPomodoro = true;
    stopTimer();
    playCompletionChime();

    if (pomodoroState.mode === 'focus') {
      window.KMA_ACCOUNT?.focusFinish().catch(() => {
        showToastNotification('Đã giữ phiên học để thử ghi nhận lại khi kết nối ổn định.');
      });
      pomodoroState.completedSessions++;
      const subj = STUDY_SUBJECTS.find(s => s.key === pomodoroState.selectedSubject);
      const subjName = subj ? subj.name : 'Môn học';

      showToastNotification(`🎉 Tuyệt vời! Bạn vừa hoàn thành 1 phiên Pomodoro môn "${subjName}"! Nghỉ ngơi một chút nhé.`);
      setPomodoroDuration(5, 'shortBreak', false);
    } else {
      showToastNotification(`☕ Đã hết giờ nghỉ ngơi! Sẵn sàng bước vào phiên tập trung mới nào!`);
      setPomodoroDuration(25, 'focus', false);
    }
    finishingPomodoro = false;
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
    if (sessionsEl) sessionsEl.textContent = `${pomodoroState.completedSessions} phiên`;

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
      tableBody.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 20px; color: #666;">Chưa có dữ liệu học tập. Bắt đầu phiên Pomodoro để tích lũy thời gian ngay!</td></tr>`;
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

    // Start / Pause (both main and drawer)
    const btnStart = document.getElementById('btn-pomodoro-start');
    if (btnStart) btnStart.addEventListener('click', startPomodoro);

    const drawerBtnStart = document.getElementById('drawer-btn-pomo-start');
    if (drawerBtnStart) drawerBtnStart.addEventListener('click', startPomodoro);

    // Reset (both main and drawer)
    const btnReset = document.getElementById('btn-pomodoro-reset');
    if (btnReset) btnReset.addEventListener('click', resetPomodoro);

    const drawerBtnReset = document.getElementById('drawer-btn-pomo-reset');
    if (drawerBtnReset) drawerBtnReset.addEventListener('click', resetPomodoro);

    // Skip / Finish early
    const btnSkip = document.getElementById('btn-pomodoro-skip');
    if (btnSkip) {
      btnSkip.addEventListener('click', () => {
        if (confirm('Bạn muốn kết thúc phiên và ghi nhận kết quả ngay?')) finishPomodoroSession();
      });
    }

    const drawerBtnSkip = document.getElementById('drawer-btn-pomo-skip');
    if (drawerBtnSkip) {
      drawerBtnSkip.addEventListener('click', () => {
        if (confirm('Bạn muốn kết thúc phiên và ghi nhận kết quả ngay?')) finishPomodoroSession();
      });
    }

    // Presets
    document.querySelectorAll('.pomo-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.pomo-preset-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const mins = parseInt(btn.getAttribute('data-minutes'), 10);
        const mode = btn.getAttribute('data-mode') || 'focus';
        setPomodoroDuration(mins, mode);
      });
    });

    // Custom Time
    const bindCustomInput = (applyBtnId, inputId) => {
      const applyBtn = document.getElementById(applyBtnId);
      const inputEl = document.getElementById(inputId);
      if (applyBtn && inputEl) {
        applyBtn.addEventListener('click', () => {
          const val = parseInt(inputEl.value, 10);
          if (isNaN(val) || val < 1 || val > 300) {
            alert('Vui lòng nhập số phút hợp lệ (từ 1 đến 300 phút)!');
            return;
          }
          document.querySelectorAll('.pomo-preset-btn').forEach(b => b.classList.remove('active'));
          setPomodoroDuration(val, 'focus');
          showToastNotification(`Đã thiết lập Pomodoro: ${val} phút tập trung!`);
        });
      }
    };
    bindCustomInput('btn-apply-custom-pomodoro', 'input-custom-pomodoro');
    bindCustomInput('drawer-btn-apply-custom-pomodoro', 'drawer-input-custom-pomodoro');

    // Toggle Sound
    const btnToggleSound = document.getElementById('btn-toggle-pomo-sound');
    if (btnToggleSound) {
      btnToggleSound.addEventListener('click', () => {
        pomodoroState.soundEnabled = !pomodoroState.soundEnabled;
        btnToggleSound.innerHTML = pomodoroState.soundEnabled ? '🔔 Chuông: Bật' : '🔕 Chuông: Tắt';
        btnToggleSound.classList.toggle('active', pomodoroState.soundEnabled);
      });
    }

    // Reset All Study Stats
    const btnResetAllStats = document.getElementById('btn-reset-all-study-stats');
    if (btnResetAllStats) {
      btnResetAllStats.addEventListener('click', () => {
        if (confirm('Bạn có chắc muốn xóa sạch toàn bộ lịch sử thời gian đã học trên máy này?')) {
          localStorage.removeItem(STORAGE_KEY_STUDY_LOGS);
          pomodoroState.completedSessions = 0;
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
        selectPomodoroSubject(subj);
        renderSubjectSelector();
        // Also open side drawer to Pomodoro tab!
        toggleSideDrawer(true);
        switchDrawerTab('side-tab-pomo');
        showToastNotification(`Đã chọn môn "${STUDY_SUBJECTS.find(s => s.key === subj)?.name}" cho Pomodoro!`);
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
    restoreCloudFocus,
    renderStudyStats,
    getTodayStats,
    setPomodoroDuration,
    startPomodoro,
    pausePomodoro,
    resetPomodoro,
    jumpToSubjectPractice,
    toggleSideDrawer,
    toggleDarkMode
  };

})();
