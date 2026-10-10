const test = require('node:test');
const assert = require('node:assert/strict');
const P = require('../web/account_policy.js');

test('nicknames normalize Vietnamese accents and ordinary spaces without dropping unsafe characters', () => {
  assert.equal(P.normalizeNickname('  Tiếng   Việt  '), 'Tiếng Việt');
  assert.equal(P.nicknameError('  Tiếng   Việt  '), '');
  for (const name of ['h3n1s3', 'ashv4ni', 'Linh chăm học', 'Sinh_vien-01', '中文'])
    assert.equal(P.nicknameError(name), '', name);
});

test('empty, placeholder, anonymous and meaningless nicknames require a personal name', () => {
  for (const name of [null, {}, '', ' ', 'a', 'Người học', ' NGƯỜI  HỌC ', 'Nguoi_hoc', 'anonymous', 'Anonymous', 'anon', 'Guest', '---', '__'])
    assert.ok(P.nicknameError(name), String(name));
  assert.equal(P.nicknameError('Người học A'), '');
});

test('names reject HTML, controls, invisible characters and overlong values', () => {
  for (const name of ['<img src=x onerror=alert(1)>', '<script>', 'AB\nCD', 'AB\0CD', 'AB\tCD', 'AB\u200bCD', 'AB\u202eCD', 'a'.repeat(33)])
    assert.ok(P.nicknameError(name), name);
  assert.equal(P.nicknameError('a'.repeat(32)), '');
});

test('persisted ownership, unresolved auth, failed profile fetch and anonymous sessions cannot record answers', () => {
  const state = {authResolved:true, authenticated:true, user:'known-user', profileReady:true, nickname:'henise'};
  assert.equal(P.accessState(state), 'ready');
  assert.equal(P.accessState({...state, authResolved:false}), 'checking');
  assert.equal(P.accessState({...state, profileReady:false}), 'checking');
  assert.equal(P.accessState({...state, authenticated:false}), 'guest');
  assert.equal(P.accessState({...state, user:null}), 'guest');
  assert.equal(P.accessState({...state, anonymous:true}), 'guest');
  for (const nickname of ['', null, 'Người học', 'Anonymous'])
    assert.equal(P.accessState({...state, nickname}), 'username');
});
