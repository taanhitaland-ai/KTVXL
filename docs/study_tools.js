(() => {
  'use strict';
  const root = document.getElementById('study-tools');
  const handle = document.getElementById('study-tools-toggle');
  const toggle = handle;
  const body = document.getElementById('study-tools-body');
  if (!root || !handle || !body) return;
  const STORAGE = 'kma_study_tools_position_v1';
  const MOBILE_STORAGE = 'kma_study_tools_mobile_v1';
  const mobileQuery = window.matchMedia('(max-width: 600px), (hover: none) and (pointer: coarse) and (max-width: 1024px)');
  const MARGIN = 12;
  let position = null;
  let dragging = null;
  let draggedPointer = null;
  let handledTouch = null;
  let mobile = mobileQuery.matches;
  let desktopCollapsed = false;
  let mobileCollapsed = true;
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE));
    if (saved && typeof saved === 'object' &&
        Number.isFinite(saved.x) && saved.x >= 0 && saved.x <= 1 &&
        Number.isFinite(saved.y) && saved.y >= 0 && saved.y <= 1 &&
        typeof saved.collapsed === 'boolean') {
      position = { x: saved.x, y: saved.y };
      desktopCollapsed = saved.collapsed;
    }
    const phone = JSON.parse(localStorage.getItem(MOBILE_STORAGE));
    if (phone && typeof phone.collapsed === 'boolean') mobileCollapsed = phone.collapsed;
  } catch (_) { /* Position persistence is optional. */ }
  let collapsed = mobile ? mobileCollapsed : desktopCollapsed;

  function bounds() {
    const rect = root.getBoundingClientRect();
    const viewport = window.visualViewport;
    const left = (viewport?.offsetLeft || 0) + MARGIN;
    const top = (viewport?.offsetTop || 0) + MARGIN;
    return {
      left, top,
      right: Math.max(left, left + (viewport?.width || innerWidth) - rect.width - 2 * MARGIN),
      bottom: Math.max(top, top + (viewport?.height || innerHeight) - rect.height - 2 * MARGIN)
    };
  }
  function place(x, y) {
    const b = bounds();
    x = Math.min(b.right, Math.max(b.left, x));
    y = Math.min(b.bottom, Math.max(b.top, y));
    root.style.right = 'auto';
    root.style.bottom = 'auto';
    root.style.left = `${Math.round(x)}px`;
    root.style.top = `${Math.round(y)}px`;
    position = {
      x: b.right > b.left ? (x - b.left) / (b.right - b.left) : 1,
      y: b.bottom > b.top ? (y - b.top) / (b.bottom - b.top) : 1
    };
  }
  function persist() {
    if (mobile) mobileCollapsed = collapsed;
    else desktopCollapsed = collapsed;
    try {
      if (mobile) localStorage.setItem(MOBILE_STORAGE, JSON.stringify({ collapsed }));
      else localStorage.setItem(STORAGE, JSON.stringify({ ...position, collapsed }));
    }
    catch (_) { /* Moving still works when local storage is unavailable. */ }
  }
  function defaultPosition() {
    if (mobile) return placeMobile();
    const b = bounds();
    const header = document.querySelector('.app-header')?.getBoundingClientRect();
    const y = Math.max(225, (header?.bottom || 0) + 16);
    place(b.right, y);
  }
  function relayout() {
    if (mobile) return placeMobile();
    if (!position) return defaultPosition();
    const saved = { ...position };
    const b = bounds();
    place(b.left + saved.x * (b.right - b.left), b.top + saved.y * (b.bottom - b.top));
  }
  function mobileExtent() {
    return Math.max(0, root.offsetHeight - handle.offsetHeight - 6);
  }
  function placeMobile() {
    root.style.removeProperty('left');
    root.style.removeProperty('right');
    root.style.removeProperty('top');
    root.style.removeProperty('bottom');
    root.style.setProperty('--sheet-offset', `${collapsed ? mobileExtent() : 0}px`);
  }
  function renderCollapsed() {
    root.classList.toggle('is-collapsed', collapsed);
    body.hidden = !mobile && collapsed;
    body.inert = mobile && collapsed;
    body.setAttribute('aria-hidden', String(collapsed));
    toggle.setAttribute('aria-expanded', String(!collapsed));
    const label = collapsed ? 'Mở thanh công cụ' : 'Thu gọn thanh công cụ';
    toggle.setAttribute('aria-label', mobile ? `${label}. Vuốt lên để mở, vuốt xuống để thu gọn.` : `${label}. Kéo hoặc dùng phím mũi tên để di chuyển.`);
    toggle.title = mobile ? 'Vuốt lên để mở, vuốt xuống để thu gọn; có thể bấm tay cầm.' : `${label} bằng cách bấm tay cầm. Kéo để di chuyển; Home để về vị trí ban đầu.`;
  }
  function setCollapsed(next) {
    if (mobile) {
      collapsed = next;
      renderCollapsed();
      placeMobile();
      persist();
      return;
    }
    const old = root.getBoundingClientRect();
    const oldBounds = bounds();
    const atRight = Math.abs(old.right - (oldBounds.right + old.width)) < 3;
    collapsed = next;
    renderCollapsed();
    place(atRight ? bounds().right : old.left, old.top);
    persist();
  }
  // Resize after the pointer gesture finishes; dragging must not toggle the rail.
  toggle.addEventListener('click', event => {
    if (draggedPointer !== null && (event.pointerId === draggedPointer || event.detail > 0)) {
      draggedPointer = null;
      return;
    }
    draggedPointer = null;
    if (!dragging) setCollapsed(!collapsed);
  });
  // Some touch browsers omit click after a swipe. Handle touch on pointerup,
  // then consume that gesture's compatibility click before it can hit a tool
  // that moved underneath the finger as the sheet opened.
  document.addEventListener('pointerdown', () => { handledTouch = null; }, true);
  document.addEventListener('click', event => {
    if (!handledTouch) return;
    const samePointer = event.pointerId === handledTouch.id;
    const legacyClick = event.pointerId === undefined && event.detail > 0 &&
      Date.now() - handledTouch.time < 750 &&
      Math.hypot(event.clientX - handledTouch.x, event.clientY - handledTouch.y) < 24;
    if (samePointer || legacyClick) {
      handledTouch = null;
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);
  handle.addEventListener('pointerdown', event => {
    if (event.button !== 0 || event.isPrimary === false) return;
    event.preventDefault();
    draggedPointer = null;
    handle.focus({ preventScroll: true });
    const rect = root.getBoundingClientRect();
    dragging = { id: event.pointerId, x: event.clientX, y: event.clientY, left: rect.left, top: rect.top, moved: false,
      mobile, collapsed, offset: mobile && collapsed ? mobileExtent() : 0 };
    handle.setPointerCapture(event.pointerId);
  });
  handle.addEventListener('pointermove', event => {
    if (!dragging || event.pointerId !== dragging.id) return;
    const dx = event.clientX - dragging.x, dy = event.clientY - dragging.y;
    if (Math.hypot(dx, dy) > 6) dragging.moved = true;
    if (dragging.moved) {
      root.classList.add('is-dragging');
      if (mobile) {
        const offset = Math.min(mobileExtent(), Math.max(0, dragging.offset + dy));
        root.style.setProperty('--sheet-offset', `${offset}px`);
      } else place(dragging.left + dx, dragging.top + dy);
    }
  });
  function endDrag(event) {
    if (!dragging || event.pointerId !== dragging.id) return;
    const gesture = dragging;
    dragging = null;
    if (handle.hasPointerCapture(event.pointerId)) handle.releasePointerCapture(event.pointerId);
    root.classList.remove('is-dragging');
    draggedPointer = gesture.moved ? event.pointerId : null;
    if (gesture.mobile) {
      if (event.type === 'pointerup' && event.pointerType === 'touch') {
        handledTouch = { id: event.pointerId, x: event.clientX, y: event.clientY, time: Date.now() };
      }
      if (event.type === 'pointerup' && gesture.moved) {
        const dy = event.clientY - gesture.y;
        setCollapsed(gesture.collapsed ? dy > -36 : dy >= 36);
      } else if (event.type === 'pointerup' && event.pointerType === 'touch') {
        setCollapsed(!gesture.collapsed);
      } else placeMobile();
    } else persist();
  }
  handle.addEventListener('pointerup', endDrag);
  handle.addEventListener('pointercancel', endDrag);
  handle.addEventListener('lostpointercapture', () => {
    if (!dragging) return;
    dragging = null;
    root.classList.remove('is-dragging');
    if (mobile) placeMobile();
    persist();
  });
  handle.addEventListener('keydown', event => {
    if (mobile && ['ArrowUp', 'ArrowDown', 'Home'].includes(event.key)) {
      event.preventDefault();
      setCollapsed(event.key !== 'ArrowUp');
      return;
    }
    if (mobile && ['ArrowLeft', 'ArrowRight'].includes(event.key)) {
      event.preventDefault();
      return;
    }
    const deltas = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
    if (event.key === 'Home') {
      event.preventDefault(); defaultPosition(); persist();
    } else if (deltas[event.key]) {
      event.preventDefault();
      const rect = root.getBoundingClientRect();
      const step = event.shiftKey ? 40 : 10;
      const [x, y] = deltas[event.key];
      place(rect.left + x * step, rect.top + y * step); persist();
    }
  });
  // Let the selected tool open normally, with its original event handler.
  body.addEventListener('click', event => {
    if (mobile && event.target.closest('button')) setCollapsed(true);
  }, true);
  root.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !collapsed) {
      event.preventDefault();
      setCollapsed(true);
      toggle.focus({ preventScroll: true });
    }
  });
  function viewportChanged() {
    if (dragging) {
      const id = dragging.id;
      dragging = null;
      if (handle.hasPointerCapture(id)) handle.releasePointerCapture(id);
      root.classList.remove('is-dragging');
    }
    if (mobile !== mobileQuery.matches) {
      mobile = mobileQuery.matches;
      collapsed = mobile ? mobileCollapsed : desktopCollapsed;
      root.style.removeProperty('--sheet-offset');
      renderCollapsed();
    }
    relayout();
  }
  window.addEventListener('resize', viewportChanged);
  mobileQuery.addEventListener('change', viewportChanged);
  window.visualViewport?.addEventListener('resize', viewportChanged);
  window.visualViewport?.addEventListener('scroll', () => { if (!dragging) relayout(); });
  // Keep the handle reachable after orientation changes and font loading.
  new ResizeObserver(() => { if (!dragging) relayout(); }).observe(root);
  renderCollapsed();
  relayout();
})();
