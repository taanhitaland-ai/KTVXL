const test = require("node:test");
const assert = require("node:assert/strict");
const M = require("../web/cloud_sync_model.js");
const key = "kma_question_notes_v1";
const note = (text) => ({
  subject: "ktvxl",
  questionId: "DE001_Q01",
  text,
  color: "yellow",
  updatedAt: 1,
});
const encode = (notes) => JSON.stringify({ version: 1, notes });
const id = M.rid("note", "ktvxl", "DE001_Q01");
test("keeps the existing note schema and normalizes NFC", () => {
  const parsed = M.flatten(key, encode([note("Tiếng Việt")]));
  assert.equal(parsed[id].value.text, "Tiếng Việt");
  const payload = M.project(parsed, []);
  assert.equal(JSON.parse(payload[key]).version, 1);
  assert.equal(JSON.parse(payload[key]).notes[0].questionId, "DE001_Q01");
});
test("rejects malformed input, unknown subjects, colors and prototype ids", () => {
  assert.deepEqual(M.flatten(key, "bad"), {});
  assert.deepEqual(
    M.flatten(key, encode([{ ...note("x"), subject: "bad" }])),
    {},
  );
  assert.equal(
    M.flatten(key, encode([{ ...note("x"), color: "url(x)" }]))[id].value.color,
    "yellow",
  );
  assert.deepEqual(
    M.flatten("kma_user_answers_ktvxl_v2", '{"__proto__":{"isCorrect":true}}'),
    {},
  );
});
test("adding one note queues only that note", () => {
  const ops = M.diff(key, encode([]), encode([note("new")]), {});
  assert.equal(ops.length, 1);
  assert.equal(ops[0].baseVersion, 0);
});
test("editing different notes merges rather than replacing a whole bank", () => {
  const before = M.flatten(key, encode([note("one")]));
  before[id].version = 1;
  const second = { ...note("two"), questionId: "DE001_Q02" };
  const result = M.reconcile(
    before,
    M.diff(key, encode([note("one")]), encode([note("one"), second]), {
      [id]: 1,
    }),
    1,
  );
  assert.equal(Object.keys(result.records).length, 2);
  assert.equal(result.records[id].value.text, "one");
});
test("two offline edits to same note preserve local and remote copies", () => {
  const record = {
    ...M.flatten(key, encode([note("remote")]))[id],
    version: 2,
  };
  const op = M.diff(key, encode([note("base")]), encode([note("local")]), {
    [id]: 1,
  })[0];
  const result = M.reconcile({ [id]: record }, [op], 2);
  assert.equal(result.conflicts.length, 1);
  assert.equal(result.accepted.length, 0);
  assert.equal(result.conflicts[0].op.value.text, "local");
  assert.equal(result.records[id].value.text, "remote");
});
test("offline queue replacement preserves original base version", () => {
  const op = M.diff(key, encode([note("base")]), encode([note("first")]), {
    [id]: 1,
  })[0];
  const later = M.diff(key, encode([note("first")]), encode([note("last")]), {
    [id]: 2,
  })[0];
  const queue = M.queueMerge([op], [later]);
  assert.equal(queue.length, 1);
  assert.equal(queue[0].baseVersion, 1);
  assert.equal(queue[0].value.text, "last");
});
test("tombstone prevents old offline note from silently returning", () => {
  const tomb = {
    ...M.flatten(key, encode([note("base")]))[id],
    value: null,
    version: 4,
  };
  const op = M.diff(key, encode([note("base")]), encode([note("old device")]), {
    [id]: 1,
  })[0];
  const result = M.reconcile({ [id]: tomb }, [op], 4);
  assert.equal(result.conflicts.length, 1);
  assert.equal(JSON.parse(M.project(result.records, [])[key]).notes.length, 0);
});
test("deletion sync projects empty notes while preserving other records", () => {
  const before = M.flatten(key, encode([note("remove")]));
  before[id].version = 2;
  const result = M.reconcile(
    before,
    M.diff(key, encode([note("remove")]), encode([]), { [id]: 2 }),
    2,
  );
  assert.equal(result.records[id].value, null);
  assert.equal(result.records[id].version, 3);
  assert.deepEqual(JSON.parse(M.project(result.records, [])[key]), {
    version: 1,
    notes: [],
  });
});
test("study minutes from two devices add once each", () => {
  const study = "kma_study_logs_v1";
  const a = M.diff(study, "{}", '{"2026-10-08":{"ktvxl":25}}', {});
  const one = M.reconcile({}, a, 0);
  const b = M.diff(study, "{}", '{"2026-10-08":{"ktvxl":25}}', {});
  const two = M.reconcile(one.records, b, one.revision, one.acknowledged);
  assert.equal(M.counts(two.records).minutes, 50);
  assert.equal(two.accepted.length, 1);
});
test("retrying the same Pomodoro operation does not add minutes twice", () => {
  const a = M.diff(
    "kma_study_logs_v1",
    "{}",
    '{"2026-10-08":{"ktvxl":25}}',
    {},
  );
  const one = M.reconcile({}, a, 0);
  const two = M.reconcile(one.records, a, one.revision, one.acknowledged);
  assert.equal(M.counts(two.records).minutes, 25);
  assert.equal(two.revision, one.revision);
});
test("multiple queued Pomodoro increments combine as deltas", () => {
  const k = "kma_study_logs_v1",
    base = '{"2026-10-08":{"ktvxl":25}}',
    more = '{"2026-10-08":{"ktvxl":26}}';
  const q = M.queueMerge(M.diff(k, "{}", base, {}), M.diff(k, base, more, {}));
  assert.equal(q.length, 1);
  assert.equal(q[0].delta, 26);
});
test("pending notes overlay downloaded data until conflict is resolved", () => {
  const records = M.flatten(key, encode([note("remote")]));
  const q = M.diff(key, encode([note("remote")]), encode([note("local")]), {});
  assert.equal(JSON.parse(M.project(records, q)[key]).notes[0].text, "local");
});
test("HTML in notes remains literal data and never becomes markup", () => {
  const text = "<img src=x onerror=alert(1)><script>alert(1)</script>";
  assert.equal(
    JSON.parse(M.project(M.flatten(key, encode([note(text)])), [])[key])
      .notes[0].text,
    text,
  );
});

test("equivalent payloads ignore JSON property order, star order and unchanged note timestamps", () => {
  assert.equal(
    M.samePayload(
      "kma_user_answers_ktvxl_v2",
      '{"a":{"answer":"A","isCorrect":true},"b":{"answer":"B","isCorrect":false}}',
      '{"b":{"isCorrect":false,"answer":"B"},"a":{"isCorrect":true,"answer":"A"}}',
    ),
    true,
  );
  assert.equal(
    M.samePayload("kma_starred_questions_ktvxl_v2", '["a","b"]', '["b","a"]'),
    true,
  );
  assert.equal(
    M.samePayload(
      key,
      encode([note("same")]),
      encode([{ ...note("same"), updatedAt: 42 }]),
    ),
    true,
  );
  assert.equal(
    M.samePayload(
      "kma_user_answers_ktvxl_v2",
      '{"a":{"answer":"A","isCorrect":true}}',
      '{"a":{"answer":"B","isCorrect":false}}',
    ),
    false,
  );
});
