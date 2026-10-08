/* Personal plain-text notes. Never pass note contents to HTML or math renderers. */
(function() {
  'use strict';
  const S = window.KMA_NOTES_STORE, STORAGE = 'kma_question_notes_v1';
  if (!S) return;
  const registry = new Map(Object.entries({ ktvxl: window.KTVXL_QUESTIONS, tthcm: window.TTHCM_QUESTIONS_DATA,
    vldc: window.VLDC_QUESTIONS_DATA, xstk: window.XSTK_QUESTIONS_DATA }).map(([subject, rows]) => [subject, new Set((rows || []).map(q => String(q.id)))]));
  const known = (subject, id) => registry.get(subject)?.has(String(id)) === true;
  const colors = { yellow: ['Vàng', 'Cần nhớ'], orange: ['Cam', 'Hay nhầm'], pink: ['Hồng', 'Khó'],
    green: ['Xanh lá', 'Đã hiểu'], blue: ['Xanh dương', 'Cần hỏi'], purple: ['Tím', 'Mẹo hay'] };
  const bindings = new Set(), drafts = new Map(), deleted = new Map(), editing = new Set(), feedback = new Map();
  let notes = read(), sequence = 0;
  const header = document.querySelector('.app-header');
  if (header && typeof ResizeObserver === 'function') {
    new ResizeObserver(() => document.documentElement.style.setProperty('--study-header-height', header.getBoundingClientRect().height + 'px')).observe(header);
  }
  const sizeObserver = typeof ResizeObserver === 'function' ? new ResizeObserver(entries => {
    for (const entry of entries) updateClamp(entry.target._noteBinding);
  }) : null;
  function read() { try { return S.parse(localStorage.getItem(STORAGE), known); } catch { return new Map(); } }
  function el(tag, className, text) {
    const node = document.createElement(tag); if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function button(className, text) { const node = el('button', className, text); node.type = 'button'; return node; }
  function draft(context) {
    if (!drafts.has(context.key)) {
      const saved = notes.get(context.key);
      drafts.set(context.key, { text: saved?.text || '', color: saved?.color || 'yellow', dirty: false });
    }
    if (!drafts.get(context.key).dirty) {
      const saved = notes.get(context.key);
      Object.assign(drafts.get(context.key), { text: saved?.text || '', color: saved?.color || 'yellow' });
    }
    return drafts.get(context.key);
  }
  function changed(context, value) {
    const saved = notes.get(context.key);
    return value.text !== (saved?.text || '') || value.color !== (saved?.color || 'yellow');
  }
  function persist(context, value) {
    try {
      // Re-read immediately before writing so unrelated edits in other tabs survive.
      const next = S.parse(localStorage.getItem(STORAGE), known);
      if (value) next.set(context.key, value); else next.delete(context.key);
      if (next.size > S.MAX_NOTES) throw new Error('Danh sách ghi chú đã đầy.');
      localStorage.setItem(STORAGE, JSON.stringify({ version: 1, notes: [...next.values()] }));
      notes = next;
      return true;
    } catch {
      message(context.key, 'Chưa lưu được trên máy. Giữ ô này mở và sao chép nội dung trước khi rời trang.', true);
      return false;
    }
  }
  function message(key, text, error = false, duration = 0, canUndo = false) {
    clearTimeout(feedback.get(key)?.timer);
    if (!text) feedback.delete(key);
    else {
      const value = { text, error, canUndo };
      if (duration) value.timer = setTimeout(() => { feedback.delete(key); paintFeedback(key); }, duration);
      feedback.set(key, value);
    }
    paintFeedback(key);
  }
  function paintFeedback(key) {
    for (const binding of bindings) {
      if (binding.context.key !== key || !binding.card.isConnected) continue;
      const value = feedback.get(key);
      binding.status.replaceChildren(); binding.status.hidden = !value;
      binding.status.dataset.error = String(!!value?.error);
      if (!value) continue;
      binding.status.appendChild(el('span', '', value.text));
      if (value.canUndo && deleted.has(key)) {
        const restore = button('note-undo', '↶ Hoàn tác');
        restore.addEventListener('click', () => undo(binding)); binding.status.appendChild(restore);
      }
    }
  }
  function updateEditor(binding) {
    const editor = binding.editor; if (!editor) return;
    const value = draft(binding.context);
    if (editor.input.value !== value.text) editor.input.value = value.text;
    binding.root.className = 'q-note-card note-editor note-color-' + value.color;
    editor.count.textContent = value.text.length + ' / ' + S.MAX_TEXT + ' ký tự';
    editor.radios.forEach(radio => { radio.checked = radio.value === value.color; });
    editor.save.disabled = !changed(binding.context, value) || !value.text.trim();
    editor.remove.disabled = !notes.has(binding.context.key);
  }
  function updateClamp(binding) {
    if (!binding || binding.editor || !binding.previewText?.isConnected || binding.root.hidden) return;
    const lines = parseFloat(getComputedStyle(binding.previewText).lineHeight) * 3;
    binding.more.hidden = binding.previewText.scrollHeight <= lines + 1;
  }
  function refresh() {
    for (const binding of bindings) {
      if (!binding.card.isConnected) {
        sizeObserver?.unobserve(binding.root); bindings.delete(binding); continue;
      }
      paint(binding);
    }
  }
  function undo(binding) {
    const before = deleted.get(binding.context.key);
    if (!before || !persist(binding.context, { ...before, updatedAt: Date.now() })) return;
    deleted.delete(binding.context.key); drafts.delete(binding.context.key); editing.delete(binding.context.key);
    message(binding.context.key, '✓ Đã khôi phục', false, 2000); refresh();
  }
  function paint(binding) {
    const key = binding.context.key, note = notes.get(key), isEditing = editing.has(key);
    binding.noteButton.className = 'q-note-btn' + (note ? ' has-note note-color-' + note.color : '');
    binding.noteButton.setAttribute('aria-label', (note ? 'Sửa ghi chú' : 'Thêm ghi chú') + ' câu ' + binding.context.number);
    binding.noteButton.title = note ? colors[note.color].join(' · ') + ' · Bấm để sửa' : 'Thêm ghi chú';
    binding.noteButton.setAttribute('aria-expanded', String(isEditing));
    binding.root.hidden = !note && !isEditing;
    binding.root.tabIndex = note && !isEditing ? 0 : -1;
    binding.root.setAttribute('aria-label', isEditing ? 'Soạn ghi chú câu ' + binding.context.number : 'Ghi chú câu ' + binding.context.number + '. Bấm hoặc nhấn Enter để sửa.');
    paintFeedback(key);
    if (isEditing) {
      if (!binding.editor) makeEditor(binding);
      updateEditor(binding); return;
    }
    binding.editor = null;
    binding.root.className = 'q-note-card q-note-preview note-color-' + (note?.color || 'yellow');
    binding.root.replaceChildren();
    if (!note) return;
    const heading = el('div', 'q-note-preview-heading');
    heading.append(el('strong', 'q-note-label', colors[note.color][1]), el('span', 'q-note-question', 'Câu ' + binding.context.number));
    const body = el('div', 'q-note-body'), text = el('p', 'q-note-text' + (binding.expanded ? ' is-expanded' : ''), note.text);
    text.id = binding.root.id + '-text';
    const more = button('note-more', binding.expanded ? 'Thu gọn' : 'Xem thêm'); more.hidden = true;
    more.setAttribute('aria-expanded', String(!!binding.expanded)); more.setAttribute('aria-controls', text.id);
    more.addEventListener('click', event => {
      event.stopPropagation(); binding.expanded = !binding.expanded;
      text.classList.toggle('is-expanded', binding.expanded); more.textContent = binding.expanded ? 'Thu gọn' : 'Xem thêm';
      more.setAttribute('aria-expanded', String(binding.expanded)); updateClamp(binding);
    });
    body.append(text, more); binding.root.append(heading, body); binding.previewText = text; binding.more = more;
    requestAnimationFrame(() => updateClamp(binding));
  }
  function makeEditor(binding) {
    const context = binding.context, root = binding.root;
    root.replaceChildren(); binding.previewText = null;
    const header = el('div', 'note-editor-heading'); header.appendChild(el('h4', '', '✎ Ghi chú của bạn'));
    const close = button('note-close', 'Đóng'); close.setAttribute('aria-label', 'Đóng ô ghi chú, giữ bản nháp');
    close.addEventListener('click', () => { editing.delete(context.key); message(context.key, ''); paint(binding); binding.noteButton.focus({ preventScroll: true }); });
    header.appendChild(close); root.appendChild(header);
    const body = el('div', 'q-note-body');
    body.appendChild(el('p', 'note-caption', 'Câu ' + context.number + ' · Lưu riêng trên máy này'));
    const input = el('textarea', 'note-textarea'); input.maxLength = S.MAX_TEXT; input.rows = 4;
    input.setAttribute('aria-label', 'Ghi chú câu ' + context.number);
    input.placeholder = 'Đáp án cần nhớ, cách giải, hoặc điều bạn hay nhầm…'; input.autocomplete = 'off'; body.appendChild(input);
    const footer = el('div', 'note-input-footer'), count = el('span', 'note-counter');
    footer.append(el('span', '', 'Ctrl / ⌘ + Enter để lưu'), count); body.appendChild(footer);
    const palette = el('fieldset', 'note-colors'); palette.appendChild(el('legend', '', 'Màu giấy nhớ'));
    const radios = [], radioName = 'note-color-' + ++sequence;
    for (const [color, names] of Object.entries(colors)) {
      const choice = el('label', 'note-color-choice note-color-' + color), radio = document.createElement('input');
      radio.type = 'radio'; radio.name = radioName; radio.value = color; radio.setAttribute('aria-label', names.join(' · '));
      const swatch = el('span', 'note-swatch'); swatch.setAttribute('aria-hidden', 'true');
      const caption = el('span', 'note-color-name', names[1]);
      choice.title = names.join(' · '); choice.append(radio, swatch, caption); palette.appendChild(choice); radios.push(radio);
      radio.addEventListener('change', () => { const value = draft(context); value.color = color; value.dirty = changed(context, value); updateEditor(binding); message(context.key, ''); });
    }
    body.appendChild(palette);
    const actions = el('div', 'note-actions'), save = button('note-save', 'Lưu ghi chú'), remove = button('note-delete', 'Xóa ghi chú');
    actions.append(save, remove); body.appendChild(actions); root.appendChild(body);
    binding.editor = { input, radios, count, save, remove };
    input.addEventListener('input', () => {
      const value = draft(context); value.text = input.value.slice(0, S.MAX_TEXT); value.dirty = changed(context, value);
      updateEditor(binding); message(context.key, '');
    });
    function submit() {
      if (save.disabled) return;
      const value = S.normalize({ subject: context.subject, questionId: context.id, ...draft(context), updatedAt: Date.now() }, known);
      // Clearing text cannot bypass the explicit delete confirmation.
      if (!value || !persist(context, value)) return;
      deleted.delete(context.key); drafts.delete(context.key); editing.delete(context.key); binding.expanded = false;
      message(context.key, '✓ Đã lưu', false, 2000); refresh(); binding.root.focus({ preventScroll: true });
    }
    save.addEventListener('click', submit);
    input.addEventListener('keydown', event => { if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') { event.preventDefault(); submit(); } });
    remove.addEventListener('click', () => {
      const before = notes.get(context.key);
      if (!before || !window.confirm('Xóa ghi chú của câu ' + context.number + '?')) return;
      if (!persist(context, null)) return;
      deleted.set(context.key, before); drafts.delete(context.key); editing.delete(context.key);
      message(context.key, 'Đã xóa ghi chú.', false, 6000, true); refresh(); binding.noteButton.focus({ preventScroll: true });
    });
  }
  function open(binding) {
    binding.openDetails(); message(binding.context.key, ''); editing.add(binding.context.key); paint(binding);
    binding.editor.input.focus({ preventScroll: true });
    binding.root.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  function attach(card, subject, question, openDetails) {
    if (!known(subject, question.id)) return null;
    const id = String(question.id), context = { subject, id, key: S.key(subject, id), number: String(question.num || id) };
    const noteButton = button('q-note-btn', '✎'), root = el('section', 'q-note-card'), status = el('p', 'note-status');
    root.id = 'note-card-' + ++sequence; root.setAttribute('role', 'group');
    status.setAttribute('role', 'status'); status.setAttribute('aria-live', 'polite'); status.hidden = true;
    noteButton.setAttribute('aria-controls', root.id);
    const binding = { card, context, noteButton, root, status, openDetails, expanded: false };
    root._noteBinding = binding; sizeObserver?.observe(root);
    root.addEventListener('click', event => {
      event.stopPropagation();
      if (!editing.has(context.key) && notes.has(context.key) && !event.target.closest('button') && !window.getSelection()?.toString()) open(binding);
    });
    root.addEventListener('keydown', event => {
      if (event.target === root && !editing.has(context.key) && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); open(binding); }
    });
    const actionRow = card.querySelector('.q-action-row'); card.insertBefore(root, actionRow); card.insertBefore(status, actionRow);
    bindings.add(binding); paint(binding);
    noteButton.addEventListener('click', event => { event.stopPropagation(); open(binding); });
    return noteButton;
  }
  window.addEventListener('storage', event => {
    if (event.key !== STORAGE && event.key !== null) return;
    const before = notes; notes = read();
    for (const binding of bindings) {
      const key = binding.context.key, value = drafts.get(key);
      const old = before.get(key), saved = notes.get(key);
      if (value?.dirty && changed(binding.context, value) && (old?.text !== saved?.text || old?.color !== saved?.color)) message(key, 'Ghi chú đã thay đổi ở tab khác. Bản đang nhập vẫn được giữ; nhấn Lưu để dùng bản này.');
    }
    refresh();
  });
  window.KMA_QUESTION_NOTES = { attach };
})();
