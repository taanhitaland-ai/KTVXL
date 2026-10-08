/* Quote anchors are plain data. Never interpret stored text, IDs or colors as HTML/CSS. */
(function(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.KMA_HIGHLIGHTS_STORE = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function() {
  'use strict';
  const COLORS = ['yellow', 'orange', 'pink', 'green', 'blue', 'purple'];
  const MAX_ITEMS = 1000, MAX_PER_ROOT = 100, MAX_QUOTE = 5000, MAX_DOCUMENT = 1000000;
  function key(subject, type, id, part = 'body') { return JSON.stringify([subject, type, String(id), part]); }
  function validRoot(value) {
    if (typeof value !== 'string' || value.length > 250) return false;
    try {
      const parts = JSON.parse(value);
      return Array.isArray(parts) && parts.length === 4 && ['ktvxl', 'tthcm', 'vldc', 'xstk'].includes(parts[0]) &&
        ['practice', 'knowledge'].includes(parts[1]) && typeof parts[2] === 'string' && parts[2].length > 0 && parts[2].length <= 120 &&
        typeof parts[3] === 'string' && /^[a-z0-9-]{1,40}$/.test(parts[3]) && key(...parts) === value;
    } catch { return false; }
  }
  function normalize(raw) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw) || !validRoot(raw.root)) return null;
    if (typeof raw.id !== 'string' || !/^[a-z0-9-]{1,80}$/.test(raw.id)) return null;
    if (!Number.isSafeInteger(raw.start) || !Number.isSafeInteger(raw.end) || raw.start < 0 || raw.end <= raw.start || raw.end > MAX_DOCUMENT) return null;
    if (typeof raw.quote !== 'string' || !raw.quote.trim() || raw.quote.length > MAX_QUOTE || raw.end - raw.start !== raw.quote.length) return null;
    if (!COLORS.includes(raw.color)) return null;
    const context = value => typeof value === 'string' ? value.slice(0, 32) : '';
    return { id: raw.id, root: raw.root, start: raw.start, end: raw.end, quote: raw.quote,
      prefix: context(raw.prefix), suffix: context(raw.suffix), color: raw.color };
  }
  function parse(value) {
    const result = new Map(), counts = new Map();
    try {
      if (typeof value !== 'string' || value.length > 6000000) return result;
      const data = JSON.parse(value);
      if (data?.version !== 1 || !Array.isArray(data.highlights)) return result;
      for (const raw of data.highlights.slice(0, MAX_ITEMS)) {
        const item = normalize(raw), count = item ? counts.get(item.root) || 0 : 0;
        if (!item || result.has(item.id) || count >= MAX_PER_ROOT) continue;
        counts.set(item.root, count + 1); result.set(item.id, item);
      }
    } catch { /* Corrupt data must not interrupt study. */ }
    return result;
  }
  function anchor(text, start, end) {
    return { start, end, quote: text.slice(start, end), prefix: text.slice(Math.max(0, start - 32), start), suffix: text.slice(end, end + 32) };
  }
  function resolve(text, item) {
    if (typeof text !== 'string' || text.length > MAX_DOCUMENT) return null;
    const contextMatches = start => (!item.prefix || text.slice(Math.max(0, start - item.prefix.length), start) === item.prefix) &&
      (!item.suffix || text.slice(start + item.quote.length, start + item.quote.length + item.suffix.length) === item.suffix);
    if (text.slice(item.start, item.end) === item.quote && contextMatches(item.start)) return { start: item.start, end: item.end };
    let found = -1, matching = -1, count = 0, matchingCount = 0, from = 0;
    while ((found = text.indexOf(item.quote, from)) !== -1) {
      count++; if (contextMatches(found)) { matching = found; matchingCount++; }
      from = found + Math.max(1, item.quote.length);
      if (count > 1000) return null;
    }
    if (matchingCount === 1) return { start: matching, end: matching + item.quote.length };
    if (count === 1) { const start = text.indexOf(item.quote); return { start, end: start + item.quote.length }; }
    return null; // Ambiguous/changed passages must not highlight unrelated words.
  }
  function upsert(items, item, text) {
    const valid = normalize(item);
    if (!valid || text.slice(valid.start, valid.end) !== valid.quote) throw Error('Đoạn chữ đã thay đổi. Hãy chọn lại.');
    const next = new Map(items);
    for (const old of next.values()) {
      if (old.root !== valid.root) continue;
      const span = resolve(text, old);
      if (old.id === valid.id || (span && span.start < valid.end && span.end > valid.start)) next.delete(old.id);
    }
    next.set(valid.id, valid);
    if (next.size > MAX_ITEMS || [...next.values()].filter(row => row.root === valid.root).length > MAX_PER_ROOT) throw Error('Đã đạt giới hạn tô màu. Hãy xóa bớt một số đoạn.');
    return next;
  }
  return { COLORS, MAX_ITEMS, MAX_PER_ROOT, MAX_QUOTE, MAX_DOCUMENT, key, validRoot, normalize, parse, anchor, resolve, upsert };
});
