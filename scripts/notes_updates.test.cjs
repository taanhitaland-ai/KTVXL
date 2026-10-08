const { test } = require('node:test');
const assert = require('node:assert/strict');
const S = require('../web/question_notes_store.js');
const known = (subject, id) => ['ktvxl', 'tthcm'].includes(subject) && ['same-id', 'second'].includes(id);
const valid = { subject: 'ktvxl', questionId: 'same-id', text: 'Nhớ đáp án A.\n32 bit.', color: 'blue', updatedAt: 1000 };
const serialize = notes => JSON.stringify({ version: 1, notes });
test('same question ID in different subjects has independent notes', () => {
  const result = S.parse(serialize([valid, { ...valid, subject: 'tthcm', text: 'Một ghi chú khác' }]), known);
  assert.equal(result.size, 2);
  assert.equal(result.get(S.key('ktvxl', 'same-id')).text, valid.text);
  assert.equal(result.get(S.key('tthcm', 'same-id')).text, 'Một ghi chú khác');
});
test('stored HTML stays plain text while color and all extra fields are untrusted', () => {
  const text = '<img src=x onerror=alert(1)><script>alert(1)</script> $x^2$';
  const note = S.normalize({ ...valid, text, color: 'blue; background:url(javascript:alert(1))', onclick: 'alert(1)', style: 'color:red' }, known);
  assert.equal(note.text, text); assert.equal(note.color, 'yellow');
  assert.deepEqual(Object.keys(note).sort(), ['subject', 'questionId', 'text', 'color', 'updatedAt'].sort());
});
test('unknown subjects, IDs, object IDs and non-string note contents are rejected', () => {
  for (const changed of [{ subject: '__proto__' }, { subject: 'constructor' }, { questionId: 'unknown' }, { questionId: '__proto__' }, { questionId: {} }, { text: {} }, { text: true }]) assert.equal(S.normalize({ ...valid, ...changed }, known), null);
  assert.equal(S.normalize(valid), null); assert.equal(S.normalize(null, known), null);
});
test('prototype-shaped storage never modifies object prototypes', () => {
  const input = '{"version":1,"__proto__":{"polluted":true},"notes":[{"subject":"__proto__","questionId":"same-id","text":"x"}]}';
  assert.equal(S.parse(input, known).size, 0); assert.equal({}.polluted, undefined);
});
test('malformed storage preserves valid entries and safely ignores unknown formats', () => {
  for (const input of ['{broken', 'null', '[]', '{"version":2,"notes":[]}', 'x'.repeat(6000001)]) assert.equal(S.parse(input, known).size, 0);
  assert.equal(S.parse(serialize([null, valid, { ...valid, questionId: 'unknown' }]), known).size, 1);
});
test('text length, line endings, control characters and timestamps are bounded', () => {
  assert.equal(S.normalize({ ...valid, text: 'a'.repeat(3000) }, known).text.length, S.MAX_TEXT);
  assert.equal(S.normalize({ ...valid, text: 'a\r\nb\0\u0007' }, known).text, 'a\nb');
  assert.equal(S.normalize({ ...valid, text: ' \n\t ' }, known), null);
  for (const updatedAt of ['yesterday', Infinity, -1, 999999999999999]) assert.equal(S.normalize({ ...valid, updatedAt }, known).updatedAt, 0);
});
test('six whitelisted colors include orange and preserve existing saved colors', () => {
  assert.deepEqual(S.COLORS, ['yellow', 'orange', 'pink', 'green', 'blue', 'purple']);
  for (const color of S.COLORS) assert.equal(S.normalize({ ...valid, color }, known).color, color);
  for (const color of [null, {}, '#ffffff', 'constructor']) assert.equal(S.normalize({ ...valid, color }, known).color, 'yellow');
});
test('read status only accepts known release IDs and new releases remain unread', () => {
  const ids = new Set(['old', 'new']);
  const seen = S.readUpdates('["old","old","__proto__",42,null,{}]', ids);
  assert.deepEqual([...seen], ['old']); assert.equal(seen.has('new'), false);
  for (const raw of ['{}', 'null', '{oops', 'x'.repeat(20001)]) assert.equal(S.readUpdates(raw, ids).size, 0);
});
