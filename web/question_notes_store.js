/* Treat browser storage as untrusted input, including IDs and color names. */
(function(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.KMA_NOTES_STORE = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function() {
  'use strict';
  const MAX_TEXT = 2000, MAX_NOTES = 2500;
  const COLORS = ['yellow', 'orange', 'pink', 'green', 'blue', 'purple'];
  const SUBJECTS = new Set(['ktvxl', 'tthcm', 'vldc', 'xstk']);
  function key(subject, questionId) { return JSON.stringify([subject, String(questionId)]); }
  function normalize(raw, isKnown = () => false) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw) || !SUBJECTS.has(raw.subject)) return null;
    if (!['string', 'number'].includes(typeof raw.questionId)) return null;
    const questionId = String(raw.questionId);
    if (!questionId || questionId.length > 120 || !isKnown(raw.subject, questionId)) return null;
    if (typeof raw.text !== 'string') return null;
    const text = raw.text.replace(/\r\n?/g, '\n').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '').slice(0, MAX_TEXT);
    if (!text.trim()) return null;
    const color = COLORS.includes(raw.color) ? raw.color : 'yellow';
    const updatedAt = Number.isSafeInteger(raw.updatedAt) && raw.updatedAt >= 0 && raw.updatedAt <= Date.now() + 86400000 ? raw.updatedAt : 0;
    return { subject: raw.subject, questionId, text, color, updatedAt };
  }
  function parse(value, isKnown) {
    const notes = new Map();
    try {
      if (typeof value !== 'string' || value.length > 6000000) return notes;
      const data = JSON.parse(value);
      if (!data || data.version !== 1 || !Array.isArray(data.notes)) return notes;
      for (const item of data.notes.slice(0, MAX_NOTES)) {
        const note = normalize(item, isKnown);
        if (note) notes.set(key(note.subject, note.questionId), note);
      }
    } catch { /* Corrupt storage cannot prevent studying. */ }
    return notes;
  }
  function readUpdates(value, allowedIds) {
    try {
      if (typeof value !== 'string' || value.length > 20000) return new Set();
      const ids = JSON.parse(value);
      if (!Array.isArray(ids)) return new Set();
      return new Set(ids.slice(0, 100).filter(id => typeof id === 'string' && allowedIds.has(id)));
    } catch { return new Set(); }
  }
  return { MAX_TEXT, MAX_NOTES, COLORS, key, normalize, parse, readUpdates };
});
