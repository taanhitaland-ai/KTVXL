const { test } = require('node:test');
const assert = require('node:assert/strict');
const M = require('../web/study_activity_model.js');
test('reading time is continuous until exactly 15 minutes after the last activity', () => {
  const s = { started:true, owned:true, seconds:0, anchor:0, lastActivity:0 };
  assert.deepEqual(M.sample(s, 899999), {active:true,seconds:899.999,idleSeconds:899});
  assert.equal(M.sample(s,900000).active,false);
  assert.equal(M.sample(s,3600000).seconds,900,'a throttled/background tab cannot keep earning time');
  s.lastActivity=600000;
  assert.equal(M.sample(s,1499999).active,true);
  assert.equal(M.sample(s,1800000).seconds,1500);
});
test('another device, paused window and monotonic rollback cannot add elapsed seconds', () => {
  const s = { started:true, owned:false, seconds:120, anchor:10000, lastActivity:10000 };
  assert.equal(M.sample(s,800000).seconds,120);
  s.owned=true; s.started=false;
  assert.equal(M.sample(s,800000).seconds,120);
  s.started=true;
  assert.equal(M.sample(s,9000).seconds,120);
  assert.equal(M.format(3620),'1:00:20');
});
