/* Plain-text anchors remain unchanged; presentation uses safe inline paper marks. */
(function() {
  'use strict';
  const S = window.KMA_HIGHLIGHTS_STORE, STORAGE = 'kma_text_highlights_v1';
  if (!S) return;
  const names = { yellow: 'Cần nhớ', orange: 'Hay nhầm', pink: 'Khó',
    green: 'Đã hiểu', blue: 'Cần hỏi', purple: 'Mẹo hay' };
  const bindings = new Map(), COLOR_PREF = 'kma_text_highlights_color_v1';
  let items = read(), lastColor = readColor(), target = null, dismissed = '';
  let popover, surface, brush, swatches, trash, tip, tooltip, live, errorToast, selectionTimer, closingTimer, errorTimer;
  let pointerDown = false, pointerType = 'mouse';
  function readColor() { try { const value = localStorage.getItem(COLOR_PREF); return S.COLORS.includes(value) ? value : null; } catch { return null; } }
  function read() { try { return S.parse(localStorage.getItem(STORAGE)); } catch { return new Map(); } }
  function el(tag, className, text) {
    const node = document.createElement(tag); node.className = className || '';
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function button(className, text, label) {
    const node = el('button', className, text); node.type = 'button';
    if (label) { node.setAttribute('aria-label', label); node.title = label; }
    return node;
  }
  function collect(root) {
    const nodes = [], walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        return !node.length || !parent || parent.closest('[data-hl-root]') !== root ||
          parent.closest('script,style,input,textarea,select,option,.katex-mathml,[data-hl-ignore]') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
      }
    });
    let node, text = '';
    while ((node = walker.nextNode())) {
      nodes.push({ node, start: text.length, end: text.length + node.length }); text += node.data;
      if (text.length > S.MAX_DOCUMENT) return { nodes: [], text: '' };
    }
    return { nodes, text };
  }
  function rangeFor(binding, span) {
    const first = binding.nodes.find(row => row.end > span.start), last = [...binding.nodes].reverse().find(row => row.start < span.end);
    if (!first || !last) return null;
    const range = document.createRange();
    range.setStart(first.node, span.start - first.start); range.setEnd(last.node, span.end - last.start);
    return range;
  }
  function unwrap(root) {
    root.querySelectorAll('mark.study-highlight').forEach(mark => mark.replaceWith(...mark.childNodes)); root.normalize();
  }
  function paint(binding) {
    // CSS Custom Highlights cannot paint rounded padding or an inset shadow.
    // Assemble marks only from existing text nodes; never interpret stored text as HTML.
    const slices = [];
    for (const entry of binding.highlights) {
      for (const row of binding.nodes) {
        const start = Math.max(row.start, entry.span.start), end = Math.min(row.end, entry.span.end);
        if (start < end) slices.push({ node: row.node, start: start - row.start, end: end - row.start, item: entry.item });
      }
    }
    slices.reverse().forEach(slice => {
      const tail = slice.node.splitText(slice.end), text = slice.node.splitText(slice.start);
      const mark = el('mark', 'hl study-highlight hl-color-' + slice.item.color);
      mark.dataset.highlightId = slice.item.id; text.replaceWith(mark); mark.append(text);
      // Keep the tail in place; splitting never interprets selected text as HTML.
      void tail;
    });
    Object.assign(binding, collect(binding.root));
    binding.highlights.forEach(entry => { entry.range = rangeFor(binding, entry.span); });
  }
  function mount(targetRoot = document) {
    if (target && !target.root.isConnected) close();
    for (const root of bindings.keys()) if (!root.isConnected) bindings.delete(root);
    const roots = [...targetRoot.querySelectorAll('[data-hl-root]')];
    if (targetRoot.matches?.('[data-hl-root]')) roots.unshift(targetRoot);
    for (const root of roots) {
      if (!S.validRoot(root.dataset.hlRoot)) continue;
      unwrap(root);
      const binding = { root, ...collect(root), highlights: [] };
      for (const item of items.values()) {
        if (item.root !== root.dataset.hlRoot) continue;
        const span = S.resolve(binding.text, item);
        if (span) binding.highlights.push({ item, span, range: rangeFor(binding, span) });
      }
      binding.highlights.sort((a, b) => a.span.start - b.span.start);
      binding.highlights = binding.highlights.filter((entry, i, all) => !i || entry.span.start >= all[i - 1].span.end);
      paint(binding);
      bindings.set(root, binding);
    }
  }
  function repaint(rootKey) {
    [...bindings.keys()].filter(root => root.isConnected && root.dataset.hlRoot === rootKey).forEach(root => mount(root));
  }
  function announce(text, error = false) {
    live.textContent = text;
    if (error) {
      errorToast.textContent = text; errorToast.hidden = false; clearTimeout(errorTimer);
      errorTimer = setTimeout(() => { errorToast.hidden = true; }, 5000);
    }
  }
  function icon(kind) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24'); svg.setAttribute('aria-hidden', 'true');
    const path = document.createElementNS(svg.namespaceURI, 'path');
    path.setAttribute('d', kind === 'brush' ? 'M9.1 11.9l8-8a2.85 2.85 0 1 1 4 4L13 16M7.1 14.9c-1.7 0-3 1.4-3 3 0 1.3-2.5 1.5-2 2 1.1 1.1 2.5 2 4 2 2.2 0 4-1.8 4-4a3 3 0 0 0-3-3Z' : 'M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 11v6M14 11v6');
    path.setAttribute('fill', 'none'); path.setAttribute('stroke', 'currentColor');
    path.setAttribute('stroke-width', '2.4'); path.setAttribute('stroke-linecap', 'round'); path.setAttribute('stroke-linejoin', 'round');
    svg.append(path); return svg;
  }
  function signature(value) { return value ? JSON.stringify([value.root.dataset.hlRoot, value.start, value.end, value.quote]) : ''; }
  function selectionValue() {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || selection.rangeCount !== 1 || document.activeElement?.closest('input,textarea,select,[contenteditable]')) return null;
    const range = selection.getRangeAt(0), parent = node => node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
    const root = parent(range.startContainer)?.closest('[data-hl-root]');
    if (!root || root !== parent(range.endContainer)?.closest('[data-hl-root]') || !root.getClientRects().length || parent(range.startContainer)?.closest('[data-hl-ignore],.katex-mathml,input,textarea,select,[contenteditable]')) return null;
    const binding = bindings.get(root); if (!binding) return null;
    let start = null, end = null;
    for (const row of binding.nodes) {
      if (!range.intersectsNode(row.node)) continue;
      const from = range.startContainer === row.node ? range.startOffset : 0, to = range.endContainer === row.node ? range.endOffset : row.node.length;
      if (to <= from) continue;
      if (start === null) start = row.start + from;
      end = row.start + to;
    }
    if (start === null || end === null) return null;
    const selectedSpan = { start, end }, quote = binding.text.slice(start, end), trimmed = quote.trim();
    if (!trimmed || trimmed.length > S.MAX_QUOTE) return null;
    start += quote.length - quote.trimStart().length; end = start + trimmed.length;
    const existing = binding.highlights.find(entry => entry.span.start === start && entry.span.end === end);
    return { root, start, end, quote: trimmed, id: existing?.item.id, selectedSpan, range: range.cloneRange(), rect: range.getBoundingClientRect() };
  }
  function restoreSelection(value) {
    if (!value?.root.isConnected) return;
    const binding = bindings.get(value.root);
    const range = binding && value.selectedSpan ? rangeFor(binding, value.selectedSpan) : null;
    if (!range) return;
    const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
  }
  function close(blockSelection = true, immediate = false) {
    clearTimeout(selectionTimer); clearTimeout(closingTimer);
    if (blockSelection) dismissed = signature(selectionValue());
    if (popover) {
      tooltip.hidden = true; brush.setAttribute('aria-expanded', 'false');
      popover.setAttribute('aria-hidden', 'true'); popover.dataset.expanded = 'false';
      surface.classList.remove('open'); surface.style.maxWidth = '46px';
      if (immediate || popover.hidden || matchMedia('(prefers-reduced-motion: reduce)').matches) popover.hidden = true;
      else closingTimer = setTimeout(() => { popover.hidden = true; }, 180);
    }
    target = null;
  }
  function touch() { return pointerType === 'touch' || matchMedia('(hover: none) and (pointer: coarse)').matches; }
  function position() {
    if (!target || !target.root.isConnected) { close(); return; }
    const viewport = window.visualViewport, left = viewport?.offsetLeft || 0, top = viewport?.offsetTop || 0;
    const right = left + (viewport?.width || innerWidth), bottom = top + (viewport?.height || innerHeight);
    const expanded = popover.dataset.expanded === 'true';
    const border = 4, available = right - left - 16;
    const width = expanded ? Math.min(surface.scrollWidth + border, available) : 46, height = 46;
    surface.style.maxWidth = width + 'px';
    const rect = target.rect, center = rect.left + rect.width / 2;
    const x = Math.max(left + width / 2 + 8, Math.min(center + (touch() ? 24 : 0), right - width / 2 - 8));
    const header = document.querySelector('.app-header')?.getBoundingClientRect().bottom || 0;
    const gap = touch() ? 18 : 10;
    const above = rect.top - height - gap, below = touch() || above < Math.max(top + 8, header + 8);
    const y = below ? rect.bottom + gap : above;
    if (y < top || y + height > bottom - 4) { close(); return; }
    popover.dataset.side = below ? 'below' : 'above';
    popover.style.left = x + 'px'; popover.style.top = (below ? rect.bottom : rect.top) + 'px';
    popover.style.setProperty('--hl-gap', gap + 'px');
    popover.style.setProperty('--hl-tip-x', Math.max(-width / 2 + 12, Math.min(width / 2 - 12, center - x)) + 'px');
  }
  function paintPalette() {
    brush.className = 'hl-brush' + (lastColor ? ' hl-color-' + lastColor : '');
    brush.title = (lastColor ? 'Màu gần nhất: ' + names[lastColor] + ' · Enter để tô' : 'Chọn màu tô') + ' · Lưu trên trình duyệt này';
    for (const swatch of swatches.children) {
      swatch.setAttribute('aria-pressed', String(swatch.dataset.color === (target?.currentColor || lastColor)));
      swatch.tabIndex = popover.dataset.expanded === 'true' ? 0 : -1;
    }
    trash.hidden = !target?.editing; trash.tabIndex = target?.editing ? 0 : -1;
  }
  function expand() {
    if (!target || popover.dataset.expanded === 'true') return;
    popover.dataset.expanded = 'true'; brush.setAttribute('aria-expanded', 'true');
    surface.classList.add('open');
    paintPalette(); position();
  }
  function show(value, expanded = false) {
    close(false, true); target = value; popover.hidden = false; popover.setAttribute('aria-hidden', 'false');
    popover.dataset.expanded = 'false'; popover.dataset.editing = String(!!value.editing);
    paintPalette(); position();
    // Establish the collapsed width before changing max-width in the next frame.
    void surface.offsetWidth;
    if (expanded && target) requestAnimationFrame(expand);
  }
  function queueSelection() {
    clearTimeout(selectionTimer);
    if (pointerDown) return;
    const value = selectionValue(), sig = signature(value);
    if (!value || Array.from(value.quote).length < 2) { if (!target?.editing) close(false); return; }
    if (sig === dismissed || (target && !target.editing && signature(target) === sig)) return;
    close(false);
    selectionTimer = setTimeout(() => {
      const current = selectionValue();
      if (!pointerDown && current && signature(current) === sig && sig !== dismissed) show(current);
    }, 300);
  }
  function save(selectedColor) {
    if (!S.COLORS.includes(selectedColor) || !target?.root.isConnected) return;
    const value = target, selected = selectionValue(), binding = bindings.get(value.root);
    if (!binding || binding.text.slice(value.start, value.end) !== value.quote) { announce('Đoạn chữ đã đổi. Hãy chọn lại.', true); close(); return; }
    try {
      const item = { id: value.id || crypto.randomUUID(), root: value.root.dataset.hlRoot, ...S.anchor(binding.text, value.start, value.end), color: selectedColor };
      const next = S.upsert(read(), item, binding.text);
      localStorage.setItem(STORAGE, JSON.stringify({ version: 1, highlights: [...next.values()] })); items = next;
      lastColor = selectedColor;
      try { localStorage.setItem(COLOR_PREF, lastColor); } catch { /* The highlight is already saved; a preference must not undo it. */ }
      repaint(item.root); restoreSelection(selected); close(); paintPalette();
      announce('Đã tô màu · ' + names[selectedColor]);
    } catch (error) { announce(error.message?.startsWith('Đã đạt') ? error.message : 'Chưa lưu được. Hãy thử lại hoặc kiểm tra dung lượng trình duyệt.', true); }
  }
  function erase() {
    if (!target?.editing || !target.root.isConnected) return;
    const value = target, selected = selectionValue();
    try {
      const next = read(); next.delete(value.id);
      localStorage.setItem(STORAGE, JSON.stringify({ version: 1, highlights: [...next.values()] })); items = next;
      repaint(value.root.dataset.hlRoot); restoreSelection(selected); close(); announce('Đã xóa màu tô.');
    } catch { announce('Chưa xóa được. Hãy thử lại.', true); }
  }
  function inspect(event) {
    if (popover.contains(event.target)) return;
    if (selectionValue()) { queueSelection(); return; }
    const root = event.target.closest?.('[data-hl-root]'), binding = bindings.get(root);
    const entry = binding?.highlights.find(row => row.range && [...row.range.getClientRects()].some(rect =>
      event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom));
    if (!entry) { close(); return; }
    event.preventDefault(); event.stopPropagation();
    const rect = entry.range.getBoundingClientRect();
    show({ root, ...entry.span, quote: entry.item.quote, id: entry.item.id, currentColor: entry.item.color, editing: true, rect }, true);
  }
  function init() {
    live = el('span', 'hl-live'); live.setAttribute('role', 'status'); live.setAttribute('aria-live', 'polite');
    errorToast = el('div', 'hl-error'); errorToast.hidden = true;
    popover = el('div', 'pw hl-popover'); popover.id = 'highlight-popover'; popover.hidden = true;
    surface = el('div', 'pop hl-pop-surface'); surface.setAttribute('role', 'toolbar'); surface.setAttribute('aria-label', 'Tô màu đoạn chữ');
    brush = button('hl-brush', '', 'Tô màu đoạn chọn'); brush.id = 'highlight-brush'; brush.append(icon('brush'), el('span', 'hl-last-color'));
    brush.setAttribute('aria-expanded', 'false'); brush.setAttribute('aria-controls', 'highlight-colors'); brush.addEventListener('click', expand);
    swatches = el('div', 'hl-palette'); swatches.id = 'highlight-colors'; swatches.setAttribute('role', 'group'); swatches.setAttribute('aria-label', 'Màu giấy nhớ');
    S.COLORS.forEach((color, index) => {
      const swatch = button('hl-swatch hl-color-' + color, '', names[color]); swatch.dataset.color = color;
      swatch.dataset.tooltip = names[color] + ' · ' + (index + 1); swatch.style.setProperty('--hl-delay', (120 + index * 40) + 'ms');
      const showTooltip = () => {
        if (!target || popover.dataset.expanded !== 'true' || touch()) return;
        tooltip.textContent = swatch.dataset.tooltip; tooltip.hidden = false;
        const rect = swatch.getBoundingClientRect(), box = surface.getBoundingClientRect();
        const width = tooltip.getBoundingClientRect().width;
        const x = Math.max(width / 2 + 8, Math.min(rect.left + rect.width / 2, innerWidth - width / 2 - 8));
        tooltip.style.left = x + 'px'; tooltip.style.top = (popover.dataset.side === 'below' ? box.bottom + 8 : box.top - tooltip.offsetHeight - 8) + 'px';
      };
      swatch.addEventListener('mouseenter', showTooltip); swatch.addEventListener('focus', showTooltip);
      swatch.addEventListener('mouseleave', () => { tooltip.hidden = true; }); swatch.addEventListener('blur', () => { tooltip.hidden = true; });
      swatch.addEventListener('click', () => save(color)); swatches.append(swatch);
    });
    trash = button('hl-trash', '', 'Xóa màu tô'); trash.id = 'highlight-trash'; trash.append(icon('trash')); trash.addEventListener('click', erase);
    tip = el('span', 'nt'); tip.setAttribute('aria-hidden', 'true');
    tooltip = el('span', 'hl-tooltip'); tooltip.hidden = true; tooltip.setAttribute('role', 'tooltip');
    surface.append(brush, swatches, trash); popover.append(surface, tip); document.body.append(live, errorToast, popover, tooltip);
    popover.addEventListener('pointerdown', event => event.preventDefault());
    document.addEventListener('pointerdown', event => {
      if (popover.contains(event.target)) return;
      pointerDown = true; pointerType = event.pointerType || 'mouse'; dismissed = ''; close(false);
    }, true);
    document.addEventListener('pointerup', event => {
      pointerDown = false;
      if (popover.contains(event.target)) return;
      if (event.target.closest?.('[data-hl-root]')) queueSelection(); else close();
    });
    document.addEventListener('pointercancel', () => { pointerDown = false; queueSelection(); });
    document.addEventListener('selectionchange', queueSelection);
    document.addEventListener('focusin', event => { if (event.target.closest?.('input,textarea,select,[contenteditable]')) close(); });
    document.addEventListener('click', inspect, true);
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') { close(); return; }
      if (popover.hidden || !target || event.ctrlKey || event.metaKey || event.altKey || event.target.closest?.('input,textarea,select,[contenteditable]')) return;
      if (/^[1-6]$/.test(event.key)) { event.preventDefault(); event.stopPropagation(); save(S.COLORS[Number(event.key) - 1]); }
      else if (event.key === 'Enter' && (!popover.contains(event.target) || event.target === brush)) { event.preventDefault(); event.stopPropagation(); if (lastColor) save(lastColor); else expand(); }
    }, true);
    window.addEventListener('resize', () => close());
    document.addEventListener('scroll', () => close(), true);
    window.visualViewport?.addEventListener('resize', () => close());
    window.visualViewport?.addEventListener('scroll', () => close());
    window.addEventListener('storage', event => {
      if (event.key === COLOR_PREF) { lastColor = readColor(); paintPalette(); }
      if (event.key === STORAGE || event.key === null) { items = read(); close(); mount(); }
    });
    mount(); paintPalette();
  }
  window.KMA_TEXT_HIGHLIGHTS = { mount };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
