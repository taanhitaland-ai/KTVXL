(function() {
  'use strict';
  const S = window.KMA_NOTES_STORE, records = window.KMA_SITE_UPDATES || [], KEY = 'kma_read_site_updates_v1';
  const trigger = document.getElementById('btn-site-updates'), dialog = document.getElementById('site-updates-dialog');
  if (!trigger || !dialog || !S) return;
  const ids = new Set(records.map(item => item.id));
  function read() { try { return S.readUpdates(localStorage.getItem(KEY), ids); } catch { return new Set(); } }
  let seen = read();
  const list = document.getElementById('site-updates-list'), badge = document.getElementById('site-updates-count');
  function el(tag, className, text) { const node = document.createElement(tag); node.className = className || ''; if (text !== undefined) node.textContent = text; return node; }
  function render() {
    const unread = records.filter(item => !seen.has(item.id)).length;
    badge.hidden = unread === 0; badge.textContent = String(unread);
    trigger.setAttribute('aria-label', 'Xem cập nhật' + (unread ? ', ' + unread + ' bản chưa đọc' : ''));
    document.getElementById('site-updates-read').disabled = unread === 0;
    list.replaceChildren();
    for (const item of records) {
      const entry = el('article', 'update-entry');
      const meta = el('div', 'update-meta'), date = el('span', '', item.date); meta.appendChild(date);
      if (!seen.has(item.id)) meta.appendChild(el('span', 'update-new', 'Mới'));
      entry.append(meta, el('h3', '', item.title));
      if (Array.isArray(item.added) && item.added.length) {
        const bullets = document.createElement('ul');
        for (const text of item.added) bullets.appendChild(el('li', '', text));
        entry.appendChild(bullets);
      }
      list.appendChild(entry);
    }
  }
  trigger.addEventListener('click', () => { render(); dialog.showModal(); trigger.setAttribute('aria-expanded', 'true'); });
  document.getElementById('site-updates-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => { trigger.setAttribute('aria-expanded', 'false'); trigger.focus({ preventScroll: true }); });
  document.getElementById('site-updates-read').addEventListener('click', () => {
    seen = new Set(ids);
    try { localStorage.setItem(KEY, JSON.stringify([...seen])); document.getElementById('site-updates-status').textContent = 'Đã đánh dấu tất cả cập nhật là đã đọc.'; }
    catch { document.getElementById('site-updates-status').textContent = 'Đã đánh dấu trong lượt này. Trình duyệt chưa lưu được trạng thái đã đọc.'; }
    render();
  });
  window.addEventListener('storage', event => { if (event.key === KEY || event.key === null) { seen = read(); render(); } });
  render();
})();
