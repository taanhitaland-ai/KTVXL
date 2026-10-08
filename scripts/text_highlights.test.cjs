const { test } = require('node:test');
const assert = require('node:assert/strict');
const S = require('../web/text_highlights_store.js');
const text = 'Nhớ kiến trúc ARM và tập lệnh Thumb.';
const root = S.key('ktvxl', 'practice', 'first', 'prompt');
const item = { id: 'first-highlight', root, ...S.anchor(text, 5, 17), color: 'yellow' };
const serialize = rows => JSON.stringify({ version: 1, highlights: rows });
test('highlight scopes separate subjects, questions, answers and knowledge chapters', () => {
  assert.equal(new Set([root, S.key('tthcm', 'practice', 'first', 'prompt'), S.key('ktvxl', 'practice', 'second', 'prompt'), S.key('ktvxl', 'practice', 'first', 'option-a'), S.key('ktvxl', 'knowledge', 'first')]).size, 5);
  assert.equal(S.parse(serialize([item])).size, 1);
});
test('untrusted IDs, colors, offsets and malformed storage are rejected', () => {
  for (const changes of [{ id: '<script>' }, { root: '__proto__' }, { root: S.key('__proto__', 'practice', 'first') }, { color: 'red;url(javascript:alert(1))' }, { start: -1 }, { end: Infinity }, { end: 9000000 }, { quote: {} }, { quote: '' }, { start: '5' }]) assert.equal(S.normalize({ ...item, ...changes }), null);
  for (const value of ['{broken', 'null', '[]', '{"version":2,"highlights":[]}', 'a'.repeat(6000001)]) assert.equal(S.parse(value).size, 0);
});
test('quotes stay literal strings with no executable or CSS fields', () => {
  const quote = '<img src=x onerror=alert(1)>', raw = { ...item, start: 0, end: quote.length, quote, onclick: 'alert(1)', style: 'color:red' };
  const normalized = S.normalize(raw);
  assert.equal(normalized.quote, quote); assert.equal(normalized.onclick, undefined); assert.equal(normalized.style, undefined);
  assert.equal({}.polluted, undefined);
});
test('all six colors round trip and duplicate IDs cannot inject extra marks', () => {
  assert.equal(S.parse(serialize(S.COLORS.map((color, i) => ({ ...item, color, id: 'color-' + i })))).size, 6);
  assert.equal(S.parse(serialize([item, item])).size, 1);
});
test('anchors survive a shifted passage and refuse changed or ambiguous prose', () => {
  assert.deepEqual(S.resolve(text, item), { start: 5, end: 17 });
  assert.deepEqual(S.resolve('Tiêu đề mới. ' + text, item), { start: 18, end: 30 });
  assert.equal(S.resolve('Nội dung đã được thay thế.', item), null);
  const ambiguous = { ...item, quote: 'ARM', start: 0, end: 3, prefix: '', suffix: '' };
  assert.equal(S.resolve('x ARM y ARM z', ambiguous), null);
  const contextual = { ...ambiguous, prefix: 'y ', suffix: ' z' };
  assert.deepEqual(S.resolve('x ARM y ARM z', contextual), { start: 8, end: 11 });
});
test('new highlights replace overlaps, preserving unrelated scopes and passages', () => {
  const unrelated = { ...item, id: 'unrelated', root: S.key('tthcm', 'practice', 'first', 'prompt') };
  const second = { ...item, id: 'second', ...S.anchor(text, 20, 28), color: 'blue' };
  const items = new Map([[item.id, item], [unrelated.id, unrelated], [second.id, second]]);
  const replacement = { ...item, id: 'replacement', ...S.anchor(text, 8, 19), color: 'pink' };
  const next = S.upsert(items, replacement, text);
  assert.equal(items.size, 3); assert.equal(next.has(item.id), false);
  assert.equal(next.has(unrelated.id), true); assert.equal(next.has(second.id), true); assert.equal(next.has(replacement.id), true);
  assert.throws(() => S.upsert(next, replacement, 'Đã thay đổi'), /Đoạn chữ đã thay đổi/);
});
test('storage and per-document limits prevent oversized highlight lists', () => {
  const rows = Array.from({ length: 1200 }, (_, i) => ({ ...item, id: 'id-' + i, root: S.key('ktvxl', 'practice', 'question-' + i, 'prompt') }));
  assert.equal(S.parse(serialize(rows)).size, S.MAX_ITEMS);
  assert.equal(S.parse(serialize(rows.map(row => ({ ...row, root })))).size, S.MAX_PER_ROOT);
  const items = new Map(rows.slice(0, S.MAX_PER_ROOT).map((row, i) => [row.id, { ...row, root, ...S.anchor('x'.repeat(300), i * 2, i * 2 + 1) }]));
  assert.throws(() => S.upsert(items, { ...item, ...S.anchor('x'.repeat(300), 290, 291) }, 'x'.repeat(300)), /giới hạn/);
});
