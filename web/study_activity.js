(() => {
  'use strict';
  const M = window.KMA_ACTIVITY_MODEL;
  if (!M) return;
  const clientId = crypto.randomUUID(); // Unique per page, including duplicated tabs.
  const state = { started: false, owned: true, seconds: 0, anchor: 0, lastActivity: 0, subject: 'ktvxl' };
  let lastPulse = -Infinity, pendingClaim = false, pendingStop = false;
  let sending = false, failed = false, ended = false, localMinutes = 0, idleStopped = false;
  let scrollIntent = -Infinity, lastInteraction = -Infinity;
  let clocks = [], statuses = [], planner;
  const now = () => performance.now(); // Wall clock adjustments cannot earn extra minutes.
  const subject = () => {
    const id = localStorage.getItem('kma_active_subject');
    return ['ktvxl', 'tthcm', 'vldc', 'xstk'].includes(id) ? id : 'ktvxl';
  };
  const allowed = () => {
    if (window.KMA_ACCOUNT) return window.KMA_ACCOUNT.getLearningAccess?.() === 'ready';
    return !window.KMA_CLOUD_CONFIG && ['localhost','127.0.0.1',''].includes(location.hostname);
  };
  function studyView() {
    const pane = document.querySelector('.tab-pane.active');
    return ['tab-practice','tab-knowledge'].includes(pane?.id) ||
      (pane?.id === 'tab-exam' && document.getElementById('exam-active-view')?.style.display !== 'none');
  }
  function contentTarget(target) {
    return target instanceof Element && !!target.closest('#tab-practice, #tab-knowledge, #exam-active-view, #details-side-panel, #chapter-diagram-dialog');
  }
  const localKey = () => 'kma_activity_preview_owner';
  function ownsLocal() {
    try { return localStorage.getItem(localKey()) === clientId; } catch (_) { return false; }
  }
  function accrueLocal() {
    if (!state.started || window.KMA_ACCOUNT || !ownsLocal()) return;
    const v = M.sample(state, now());
    const whole = Math.floor(v.seconds / 60);
    if (whole > localMinutes) {
      window.KMA_SCHEDULE_POMODORO?.recordStudyTime(state.subject, whole - localMinutes);
      localMinutes = whole;
    }
  }
  function render() {
    if (document.visibilityState !== 'visible') return;
    const v = M.sample(state, now());
    const active = v.active && allowed();
    const status = active ? 'Đang học' : 'Nghỉ ngơi';
    const hint = !allowed() ? 'Đăng nhập để lưu thời gian học.' : failed ? 'Chưa xác nhận thời gian trên máy chủ; sẽ thử lại khi kết nối ổn định.' :
      !state.owned ? 'Thời gian đang được ghi nhận ở tab hoặc thiết bị khác.' :
      'Tự tính khi học bài. Nghỉ sau 15 phút không thao tác; học tiếp để bắt đầu lượt mới.';
    const digits = M.format(v.seconds);
    for (const el of clocks) {
      if (el.textContent !== digits) el.textContent = digits;
    }
    for (const el of statuses) {
      if (el.textContent !== status) el.textContent = status;
      if (el.dataset.active !== String(active)) el.dataset.active = String(active);
      if (el.title !== hint) el.title = hint;
    }
    const title = status + ' · Mở thời gian học, lịch thi và nhạc';
    if (planner && planner.title !== title) planner.title = title;
    window.KMA_SCHEDULE_POMODORO?.setStudySubject(state.subject);
  }
  async function pulse(claim = false, stop = false) {
    pendingClaim ||= claim;
    pendingStop ||= stop;
    if (sending || !window.KMA_ACCOUNT?.activityPulse || !allowed()) return;
    sending = true;
    const s = pendingStop, c = pendingClaim && !s;
    pendingClaim = s ? pendingClaim : false;
    pendingStop = false;
    const sentSubject = state.subject;
    lastPulse = now();
    try {
      const result = await window.KMA_ACCOUNT.activityPulse({ clientId, subject: sentSubject, idleSeconds: M.sample(state, now()).idleSeconds, claim: c, stop: s });
      failed = false;
      if (result?.owned && result.session_id && Number.isFinite(Number(result.elapsed_seconds))) {
        window.dispatchEvent(new CustomEvent('kma:study-confirmed', { detail: {
          sessionId: result.session_id, subject: result.subject,
          seconds: Number(result.elapsed_seconds),
          endMs: Date.parse(result.confirmed_until) || Date.now()
        }}));
      }
      // A subject change while the request was in flight has its own queued claim.
      if (sentSubject === state.subject && !pendingClaim) {
        const before = M.sample(state, now());
        state.owned = result?.owned === true;
        if (state.owned) {
          state.seconds = Math.max(0, Number(result.elapsed_seconds) || 0);
          state.anchor = now();
        } else { state.seconds = before.seconds; state.anchor = now(); }
      }
    } catch (_) { failed = true; }
    finally {
      sending = false;
      render();
      if ((pendingStop || (pendingClaim && (s || sentSubject !== state.subject))) && !ended) pulse();
    }
  }
  function activity() {
    if (document.visibilityState !== 'visible' || !studyView() || !allowed() || ended) return;
    const t = now();
    // Wheel/touch/scroll can fire hundreds of times per second. Keep the latest
    // activity timestamp, but coalesce storage reads, rendering and network work.
    if (state.started && state.owned && t - lastInteraction < 250) {
      state.lastActivity = t;
      pendingClaim = !!window.KMA_ACCOUNT?.activityPulse;
      return;
    }
    lastInteraction = t;
    const nextSubject = subject(), sampled = M.sample(state, t);
    accrueLocal();
    const fresh = !sampled.active || nextSubject !== state.subject;
    if (fresh) { state.seconds = 0; state.anchor = t; localMinutes = 0; }
    state.subject = nextSubject;
    state.lastActivity = t;
    state.started = true;
    state.owned = true;
    idleStopped = false;
    if (window.KMA_ACCOUNT?.activityPulse) {
      pendingClaim = true;
      if (fresh || t - lastPulse >= 30000) pulse(true);
    }
    else {
      try { localStorage.setItem(localKey(), clientId); } catch (_) {}
    }
    render();
  }
  function onInteraction(event) {
    if (!event.isTrusted || !contentTarget(event.target) || event.target.closest('dialog, .modal, #side-planner-drawer')) return;
    if (event.type === 'keydown' && (event.repeat || ['Shift','Control','Alt','Meta','Escape'].includes(event.key))) return;
    if (event.type === 'keydown' && ['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(event.key)) scrollIntent = now();
    activity();
  }
  function tick() {
    if (!allowed() && state.started) { stop(); return; }
    if (!window.KMA_ACCOUNT && state.started && !ownsLocal()) {
      const v = M.sample(state, now()); state.seconds = v.seconds; state.anchor = now(); state.owned = false;
    }
    accrueLocal();
    const v = M.sample(state, now());
    if (state.started && state.owned && !idleStopped && now() - lastPulse >= 30000) {
      if (!v.active) idleStopped = true;
      pulse(false, !v.active);
    }
    render();
  }
  function stop() {
    if (!state.started) return;
    accrueLocal();
    const v = M.sample(state, now()); state.seconds = v.seconds; state.anchor = now(); state.started = false;
    pendingClaim = false;
    // Preserve the authenticated stop if logout/navigation cancels a normal RPC.
    // Server sequence numbers make the two stop deliveries idempotent.
    window.KMA_ACCOUNT?.activityLeave?.(clientId, state.subject);
    pulse(false, true);
    render();
  }
  function init() {
    clocks = ['pomodoro-time-display', 'drawer-pomo-digits', 'floating-pomo-digits'].map(id => document.getElementById(id)).filter(Boolean);
    statuses = [...document.querySelectorAll('[data-study-activity-status]')];
    planner = document.getElementById('btn-floating-planner');
    state.subject = subject();
    for (const type of ['click','keydown','input']) document.addEventListener(type, onInteraction, { passive: true });
    document.addEventListener('keydown', event => {
      if (event.isTrusted && event.target === document.body && ['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(event.key)) { scrollIntent = now(); activity(); }
    }, { passive: true });
    for (const type of ['wheel','touchmove','pointerdown']) document.addEventListener(type, event => {
      if (event.isTrusted && (contentTarget(event.target) || event.target === document.documentElement)) {
        scrollIntent = now();
        if (type !== 'pointerdown') activity();
      }
    }, { passive: true });
    document.addEventListener('scroll', event => {
      if (event.isTrusted && now() - scrollIntent < 1500) activity();
    }, { passive: true, capture: true });
    window.addEventListener('online', () => { if (state.started) pulse(false, !M.sample(state, now()).active); });
    window.addEventListener('kma:cloud-updated', render);
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') tick(); });
    window.addEventListener('pagehide', () => {
      ended = true;
      accrueLocal();
      if (state.started) window.KMA_ACCOUNT?.activityLeave?.(clientId, state.subject);
    });
    window.addEventListener('pageshow', event => { ended = false; if (event.persisted) { state.started = false; render(); } });
    document.querySelectorAll('[data-study-return]').forEach(btn => btn.addEventListener('click', () => {
      window.KMA_SCHEDULE_POMODORO?.toggleSideDrawer(false);
      document.getElementById('btn-tab-practice')?.click();
    }));
    // Switching menus is not a learning interaction, and pauses time outside study views.
    document.querySelectorAll('.nav-tab-btn').forEach(btn => btn.addEventListener('click', () => { if (!studyView()) stop(); }));
    window.addEventListener('kma:study-subject', () => {
      if (state.started) stop();
      state.subject = subject(); state.seconds = 0; state.anchor = now(); render();
    });
    setInterval(tick, 1000);
    render();
  }
  window.KMA_STUDY_ACTIVITY = { getState: () => ({ ...state, ...M.sample(state, now()), failed }), stop };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
