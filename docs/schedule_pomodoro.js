/**
 * SCHEDULE, COUNTDOWN, POMODORO & DAILY STUDY TIME TRACKER
 * Học viện Kỹ thuật Mật mã (KMA) - Khóa ôn thi học kỳ 2026
 * Developed by ashv4ni
 */

(function () {
  'use strict';

  // 1. DỮ LIỆU LỊCH THI CÁC MÔN (THEO YÊU CẦU CỦA NGƯỜI DÙNG)
  // Kỹ thuật vi xử lý: 13h, 14h T3 13/10/2026
  // Tư tưởng Hồ Chí Minh: 13h, 15h T2 19/10/2026
  // Vật lý đại cương 2: 7h, 8h, 9h T4 21/10/2026
  // Giáo dục thể chất 3: 7h T5 22/10/2026
  // Toán xác suất thống kê: 13h, 15h T6 23/10/2026
  const EXAM_SCHEDULE = [
    {
      id: 'ktvxl',
      name: 'Kỹ thuật vi xử lý',
      shortName: 'Vi xử lý',
      subjectKey: 'ktvxl',
      dateStr: 'Thứ Ba, 13/10/2026',
      timeStr: '13h00, 14h00',
      // Tháng trong JS Date: 0 = Tháng 1, 9 = Tháng 10
      targetDate: new Date(2026, 9, 13, 13, 0, 0),
      icon: '⚡',
      badgeBg: '#FFE600',
      badgeColor: '#000',
      themeBorder: '#F59E0B',
      duration: '60 phút (40 câu trắc nghiệm)',
      format: 'Trắc nghiệm máy tính chuẩn Học viện KMA',
      notes: 'Trọng tâm: Họ 8051/89C51, Thanh ghi SFR, Timer TMOD/TCON, Cổng P0-P3, UART SCON/SBUF, Lệnh Assembly và Sơ đồ giải mã 74LS138.',
      hasSystemSubject: true
    },
    {
      id: 'tthcm',
      name: 'Tư tưởng Hồ Chí Minh',
      shortName: 'Tư tưởng HCM',
      subjectKey: 'tthcm',
      dateStr: 'Thứ Hai, 19/10/2026',
      timeStr: '13h00, 15h00',
      targetDate: new Date(2026, 9, 19, 13, 0, 0),
      icon: '📕',
      badgeBg: '#EF4444',
      badgeColor: '#FFF',
      themeBorder: '#DC2626',
      duration: '90 - 120 phút',
      format: 'Trắc nghiệm lý luận chính trị chuẩn KMA',
      notes: 'Trọng tâm: Cơ sở hình thành tư tưởng, Vấn đề dân tộc & cách mạng giải phóng dân tộc, CNXH và con đường quá độ, Đại đoàn kết, Đạo đức cách mạng.',
      hasSystemSubject: true
    },
    {
      id: 'vldc',
      name: 'Vật lý đại cương 2',
      shortName: 'Vật lý ĐC 2',
      subjectKey: 'vldc',
      dateStr: 'Thứ Tư, 21/10/2026',
      timeStr: '7h00, 8h00, 9h00',
      targetDate: new Date(2026, 9, 21, 7, 0, 0),
      icon: '⚛️',
      badgeBg: '#3B82F6',
      badgeColor: '#FFF',
      themeBorder: '#2563EB',
      duration: '60 phút (40 câu)',
      format: 'Trắc nghiệm Quang học sóng & Vật lý lượng tử',
      notes: 'Trọng tâm: Giao thoa 2 khe Young & bản mỏng chắn khe, Giao thoa nêm không khí / vân tròn Newton, Nhiễu xạ Fraunhofer & cách tử, Hiệu ứng quang điện ngoài, Tán xạ Compton, Hạt trong giếng thế 1D, Định luật Malus.',
      hasSystemSubject: true
    },
    {
      id: 'gdtc',
      name: 'Giáo dục thể chất 3',
      shortName: 'GDTC 3',
      subjectKey: 'gdtc',
      dateStr: 'Thứ Năm, 22/10/2026',
      timeStr: '7h00 sáng',
      targetDate: new Date(2026, 9, 22, 7, 0, 0),
      icon: '🏃',
      badgeBg: '#10B981',
      badgeColor: '#FFF',
      themeBorder: '#059669',
      duration: 'Theo ca thi thực hành',
      format: 'Kiểm tra thể lực & kỹ thuật thực hành',
      notes: 'Chuẩn bị trang phục thể thao nghiêm túc, giày chạy đạt chuẩn, mang theo thẻ sinh viên và khởi động kỹ 15 phút trước giờ thi.',
      hasSystemSubject: false
    },
    {
      id: 'xstk',
      name: 'Toán xác suất thống kê',
      shortName: 'Xác suất thống kê',
      subjectKey: 'xstk',
      dateStr: 'Thứ Sáu, 23/10/2026',
      timeStr: '13h00, 15h00',
      targetDate: new Date(2026, 9, 23, 13, 0, 0),
      icon: '🎲',
      badgeBg: '#059669',
      badgeColor: '#FFF',
      themeBorder: '#047857',
      duration: '60 phút (40 câu)',
      format: 'Trắc nghiệm tính toán kết hợp phím bấm Casio fx-580VNX',
      notes: 'Trọng tâm: Xác suất điều kiện, Công thức nhân & cộng, Công thức xác suất đầy đủ & Bayes, Công thức Bernoulli, Bảng phân phối rời rạc, Phân phối chuẩn N(μ, σ²), Ước lượng kỳ vọng / tỷ lệ, Kiểm định giả thuyết u / t.',
      hasSystemSubject: true
    }
  ];

  // 2. MÔN HỌC QUẢN LÝ THỜI GIAN
  const STUDY_SUBJECTS = [
    { key: 'ktvxl', name: 'Kỹ thuật vi xử lý', icon: '⚡', color: '#FFE600', textColor: '#000' },
    { key: 'tthcm', name: 'Tư tưởng Hồ Chí Minh', icon: '📕', color: '#EF4444', textColor: '#FFF' },
    { key: 'vldc', name: 'Vật lý đại cương 2', icon: '⚛️', color: '#3B82F6', textColor: '#FFF' },
    { key: 'xstk', name: 'Toán xác suất thống kê', icon: '🎲', color: '#059669', textColor: '#FFF' },
    { key: 'gdtc', name: 'Giáo dục thể chất 3', icon: '🏃', color: '#10B981', textColor: '#FFF' },
    { key: 'other', name: 'Môn khác & Tự học', icon: '📚', color: '#8B5CF6', textColor: '#FFF' }
  ];

  // 3. STORAGE KEYS
  const STORAGE_KEY_STUDY_LOGS = 'kma_study_logs_v1';
  const STORAGE_KEY_POMODORO_CONF = 'kma_pomodoro_config_v1';

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
    elapsedSecondsInSession: 0
  };

  // 5. HELPER FORMAT TIME
  function getTodayKey() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
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

  function recordStudyTime(subjectKey, minutesToAdd) {
    if (!subjectKey || minutesToAdd <= 0) return;
    const logs = getStudyLogs();
    const today = getTodayKey();
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

  // 7. WEB AUDIO API CHIME (CHUÔNG BÁO HOÀN THÀNH POMODORO)
  function playCompletionChime() {
    if (!pomodoroState.soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Phát 3 nốt nhạc du dương liên tiếp: C6 (1046Hz), E6 (1318Hz), G6 (1568Hz)
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
      const cardEl = document.getElementById(`exam-card-${exam.id}`);
      const cdEl = document.getElementById(`exam-cd-${exam.id}`);
      const badgeEl = document.getElementById(`exam-badge-${exam.id}`);
      const barEl = document.getElementById(`exam-bar-${exam.id}`);

      if (diffMs > 0) {
        if (diffMs < minDiffMs) {
          minDiffMs = diffMs;
          closestExam = exam;
        }

        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
        const mins = Math.floor((diffMs / (1000 * 60)) % 60);
        const secs = Math.floor((diffMs / 1000) % 60);

        if (cdEl) {
          cdEl.innerHTML = `
            <div class="cd-digit-box"><span class="cd-num">${String(days).padStart(2, '0')}</span><span class="cd-label">NGÀY</span></div>
            <div class="cd-colon">:</div>
            <div class="cd-digit-box"><span class="cd-num">${String(hours).padStart(2, '0')}</span><span class="cd-label">GIỜ</span></div>
            <div class="cd-colon">:</div>
            <div class="cd-digit-box"><span class="cd-num">${String(mins).padStart(2, '0')}</span><span class="cd-label">PHÚT</span></div>
            <div class="cd-colon">:</div>
            <div class="cd-digit-box"><span class="cd-num">${String(secs).padStart(2, '0')}</span><span class="cd-label">GIÂY</span></div>
          `;
        }

        if (badgeEl) {
          if (days <= 5) {
            badgeEl.className = 'neo-badge badge-exam-urgent';
            badgeEl.innerHTML = `🔥 CÒN ${days} NGÀY (GẤP)`;
          } else if (days <= 10) {
            badgeEl.className = 'neo-badge badge-exam-warning';
            badgeEl.innerHTML = `⚡ CÒN ${days} NGÀY`;
          } else {
            badgeEl.className = 'neo-badge badge-exam-info';
            badgeEl.innerHTML = `⏳ CÒN ${days} NGÀY`;
          }
        }

        // Tính % thanh tiến độ (giả sử đếm ngược từ 30 ngày trước kỳ thi)
        if (barEl) {
          const totalWindow = 30 * 24 * 3600 * 1000;
          const passed = Math.max(0, totalWindow - diffMs);
          const pct = Math.min(100, Math.max(5, (passed / totalWindow) * 100));
          barEl.style.width = `${pct}%`;
        }
      } else {
        // Đã qua thời gian thi
        if (cdEl) {
          cdEl.innerHTML = `<div class="cd-finished-msg">✅ ĐÃ HOÀN THÀNH KỲ THI</div>`;
        }
        if (badgeEl) {
          badgeEl.className = 'neo-badge badge-exam-done';
          badgeEl.innerHTML = `🏁 ĐÃ THI XONG`;
        }
        if (barEl) barEl.style.width = '100%';
      }
    });

    // Cập nhật Global Exam Alert Ticker Bar ở đầu trang
    updateGlobalTicker(closestExam, now);
  }

  function updateGlobalTicker(closestExam, now) {
    const tickerVal = document.getElementById('ticker-countdown-val');
    const tickerInfo = document.getElementById('ticker-exam-info');
    if (!tickerVal || !tickerInfo) return;

    if (!closestExam) {
      tickerInfo.innerHTML = `🎉 Tất cả các môn đã hoàn thành kỳ thi! Chúc bạn đạt kết quả xuất sắc!`;
      tickerVal.innerHTML = ``;
      return;
    }

    const diffMs = closestExam.targetDate - now;
    if (diffMs > 0) {
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diffMs / (1000 * 60)) % 60);
      const secs = Math.floor((diffMs / 1000) % 60);

      tickerInfo.innerHTML = `Môn gần nhất: <strong>${closestExam.name}</strong> (${closestExam.timeStr} ${closestExam.dateStr}) — `;
      tickerVal.innerHTML = `<span style="color: #DC2626; font-weight: 900;">${days} ngày ${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}</span>`;
    }
  }

  // 9. POMODORO CONTROLS & LOGIC
  function initPomodoroUI() {
    renderPomodoroDisplay();
    renderSubjectSelector();
    renderStudyStats();
  }

  function renderPomodoroDisplay() {
    const timeDisplay = document.getElementById('pomodoro-time-display');
    const progressFill = document.getElementById('pomodoro-progress-bar');
    const modeBadge = document.getElementById('pomodoro-mode-badge');
    const btnStart = document.getElementById('btn-pomodoro-start');
    const sessionCount = document.getElementById('pomodoro-session-count');

    if (!timeDisplay) return;

    const mins = Math.floor(pomodoroState.remainingSeconds / 60);
    const secs = pomodoroState.remainingSeconds % 60;
    timeDisplay.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    // Document Title Update khi đang chạy
    if (pomodoroState.isRunning) {
      document.title = `(${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}) Pomodoro - KTVXL KMA`;
    }

    if (progressFill && pomodoroState.totalSeconds > 0) {
      const pct = ((pomodoroState.totalSeconds - pomodoroState.remainingSeconds) / pomodoroState.totalSeconds) * 100;
      progressFill.style.width = `${Math.min(100, Math.max(0, pct))}%`;
    }

    if (modeBadge) {
      if (pomodoroState.mode === 'focus') {
        modeBadge.textContent = '🍅 TẬP TRUNG CAO ĐỘ';
        modeBadge.style.background = '#EF4444';
        modeBadge.style.color = '#FFF';
      } else if (pomodoroState.mode === 'shortBreak') {
        modeBadge.textContent = '☕ NGHỈ NGẮN (5P)';
        modeBadge.style.background = '#10B981';
        modeBadge.style.color = '#FFF';
      } else {
        modeBadge.textContent = '🏖️ NGHỈ DÀI (15P)';
        modeBadge.style.background = '#3B82F6';
        modeBadge.style.color = '#FFF';
      }
    }

    if (btnStart) {
      if (pomodoroState.isRunning) {
        btnStart.innerHTML = '⏸️ TẠM DỪNG';
        btnStart.className = 'neo-btn neo-btn-yellow';
      } else {
        btnStart.innerHTML = '▶️ BẮT ĐẦU';
        btnStart.className = 'neo-btn neo-btn-green';
      }
    }

    if (sessionCount) {
      sessionCount.textContent = `${pomodoroState.completedSessions} phiên`;
    }
  }

  function renderSubjectSelector() {
    const container = document.getElementById('pomodoro-subject-chips');
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
        container.querySelectorAll('.pomo-subj-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        pomodoroState.selectedSubject = btn.getAttribute('data-subj');
        updatePomodoroSelectedSubjectLabel();
      });
    });

    updatePomodoroSelectedSubjectLabel();
  }

  function updatePomodoroSelectedSubjectLabel() {
    const label = document.getElementById('pomodoro-current-subject-label');
    if (label) {
      const subj = STUDY_SUBJECTS.find(s => s.key === pomodoroState.selectedSubject);
      if (subj) {
        label.innerHTML = `Đang học môn: <strong style="color: #000; background: ${subj.color}; padding: 2px 8px; border-radius: 4px; border: 1.5px solid #000;">${subj.icon} ${subj.name}</strong>`;
      }
    }
  }

  function startPomodoro() {
    if (pomodoroState.isRunning) {
      pausePomodoro();
      return;
    }

    pomodoroState.isRunning = true;
    renderPomodoroDisplay();

    if (pomodoroState.intervalId) clearInterval(pomodoroState.intervalId);

    pomodoroState.intervalId = setInterval(() => {
      if (pomodoroState.remainingSeconds > 0) {
        pomodoroState.remainingSeconds--;
        pomodoroState.elapsedSecondsInSession++;

        // Cứ mỗi 60 giây trôi qua trong chế độ 'focus', tự động cộng 1 phút vào nhật ký học tập
        if (pomodoroState.mode === 'focus' && pomodoroState.elapsedSecondsInSession % 60 === 0) {
          recordStudyTime(pomodoroState.selectedSubject, 1);
        }

        renderPomodoroDisplay();
      } else {
        // Hết giờ!
        finishPomodoroSession();
      }
    }, 1000);
  }

  function pausePomodoro() {
    pomodoroState.isRunning = false;
    if (pomodoroState.intervalId) {
      clearInterval(pomodoroState.intervalId);
      pomodoroState.intervalId = null;
    }
    document.title = 'KTVXL by ashv4ni';
    renderPomodoroDisplay();
  }

  function resetPomodoro() {
    pausePomodoro();
    pomodoroState.remainingSeconds = pomodoroState.totalSeconds;
    pomodoroState.elapsedSecondsInSession = 0;
    renderPomodoroDisplay();
  }

  function setPomodoroDuration(minutes, mode = 'focus') {
    pausePomodoro();
    pomodoroState.mode = mode;
    pomodoroState.durationMinutes = minutes;
    pomodoroState.totalSeconds = minutes * 60;
    pomodoroState.remainingSeconds = minutes * 60;
    pomodoroState.elapsedSecondsInSession = 0;
    renderPomodoroDisplay();
  }

  function finishPomodoroSession() {
    pausePomodoro();
    playCompletionChime();

    if (pomodoroState.mode === 'focus') {
      pomodoroState.completedSessions++;
      const subj = STUDY_SUBJECTS.find(s => s.key === pomodoroState.selectedSubject);
      const subjName = subj ? subj.name : 'Môn học';

      // Thông báo hoàn thành
      showToastNotification(`🎉 Tuyệt vời! Bạn vừa hoàn thành 1 phiên Pomodoro môn "${subjName}"! Nghỉ ngơi một chút nhé.`);

      // Gợi ý chuyển sang nghỉ ngắn
      setPomodoroDuration(5, 'shortBreak');
    } else {
      showToastNotification(`☕ Đã hết giờ nghỉ ngơi! Sẵn sàng bước vào phiên tập trung mới nào!`);
      setPomodoroDuration(25, 'focus');
    }
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
    const totalEl = document.getElementById('stat-today-total-time');
    const sessionsEl = document.getElementById('stat-today-sessions');
    const topSubjEl = document.getElementById('stat-today-top-subject');
    const breakdownContainer = document.getElementById('study-subject-breakdown-list');

    if (totalEl) totalEl.textContent = formatMinutes(stats.totalMinutes);
    if (sessionsEl) sessionsEl.textContent = `${pomodoroState.completedSessions} phiên`;

    // Tìm môn học nhiều nhất hôm nay
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

    if (breakdownContainer) {
      breakdownContainer.innerHTML = STUDY_SUBJECTS.map(subj => {
        const mins = stats.breakdown[subj.key] || 0;
        const pct = stats.totalMinutes > 0 ? Math.round((mins / stats.totalMinutes) * 100) : 0;
        return `
          <div class="study-stat-row">
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

      // Gắn sự kiện cho các nút cộng nhanh
      breakdownContainer.querySelectorAll('.stat-add-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const sKey = btn.getAttribute('data-subj');
          const addM = parseInt(btn.getAttribute('data-add'), 10);
          recordStudyTime(sKey, addM);
          showToastNotification(`Đã ghi nhận +${addM} phút học môn "${STUDY_SUBJECTS.find(s => s.key === sKey)?.name}"!`);
        });
      });
    }

    // Render bảng nhật ký các ngày gần đây
    renderRecentHistoryTable();
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

  // 12. SETUP CÁC NÚT ĐIỀU KHIỂN & SỰ KIỆN
  function setupEventListeners() {
    // Nút Start / Pause
    const btnStart = document.getElementById('btn-pomodoro-start');
    if (btnStart) {
      btnStart.addEventListener('click', startPomodoro);
    }

    // Nút Reset
    const btnReset = document.getElementById('btn-pomodoro-reset');
    if (btnReset) {
      btnReset.addEventListener('click', resetPomodoro);
    }

    // Nút Kết thúc phiên sớm & ghi nhận
    const btnSkip = document.getElementById('btn-pomodoro-skip');
    if (btnSkip) {
      btnSkip.addEventListener('click', () => {
        if (confirm('Bạn muốn kết thúc phiên và ghi nhận kết quả ngay?')) {
          finishPomodoroSession();
        }
      });
    }

    // Các nút Presets thời gian
    document.querySelectorAll('.pomo-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.pomo-preset-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const mins = parseInt(btn.getAttribute('data-minutes'), 10);
        const mode = btn.getAttribute('data-mode') || 'focus';
        setPomodoroDuration(mins, mode);
      });
    });

    // Nút Set Custom Time
    const btnApplyCustom = document.getElementById('btn-apply-custom-pomodoro');
    const inputCustom = document.getElementById('input-custom-pomodoro');
    if (btnApplyCustom && inputCustom) {
      btnApplyCustom.addEventListener('click', () => {
        const val = parseInt(inputCustom.value, 10);
        if (isNaN(val) || val < 1 || val > 300) {
          alert('Vui lòng nhập số phút hợp lệ (từ 1 đến 300 phút)!');
          return;
        }
        document.querySelectorAll('.pomo-preset-btn').forEach(b => b.classList.remove('active'));
        setPomodoroDuration(val, 'focus');
        showToastNotification(`Đã thiết lập Pomodoro: ${val} phút tập trung!`);
      });
    }

    // Toggle Âm thanh
    const btnToggleSound = document.getElementById('btn-toggle-pomo-sound');
    if (btnToggleSound) {
      btnToggleSound.addEventListener('click', () => {
        pomodoroState.soundEnabled = !pomodoroState.soundEnabled;
        btnToggleSound.innerHTML = pomodoroState.soundEnabled ? '🔔 Chuông: Bật' : '🔕 Chuông: Tắt';
        btnToggleSound.classList.toggle('active', pomodoroState.soundEnabled);
      });
    }

    // Nút Reset toàn bộ Study Logs
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

    // Gắn sự kiện nút "🎯 Ôn tập ngay" từ Exam Cards
    document.querySelectorAll('.btn-jump-subject-practice').forEach(btn => {
      btn.addEventListener('click', () => {
        const subj = btn.getAttribute('data-subject');
        jumpToSubjectPractice(subj);
      });
    });

    // Gắn sự kiện nút "🍅 Bấm giờ môn này" từ Exam Cards
    document.querySelectorAll('.btn-jump-subject-pomo').forEach(btn => {
      btn.addEventListener('click', () => {
        const subj = btn.getAttribute('data-subject');
        pomodoroState.selectedSubject = subj;
        renderSubjectSelector();
        const pomoBox = document.getElementById('pomodoro-main-box');
        if (pomoBox) {
          pomoBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        showToastNotification(`Đã chọn môn "${STUDY_SUBJECTS.find(s => s.key === subj)?.name}" cho Pomodoro!`);
      });
    });
  }

  // Chuyển nhanh môn học và tab luyện tập
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

  // 13. KHỞI CHẠY (INITIALIZATION)
  function init() {
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

  // Export to window for external integration if needed
  window.KMA_SCHEDULE_POMODORO = {
    recordStudyTime,
    getTodayStats,
    setPomodoroDuration,
    startPomodoro,
    pausePomodoro,
    resetPomodoro,
    jumpToSubjectPractice
  };

})();
