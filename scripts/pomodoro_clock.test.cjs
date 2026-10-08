const test = require("node:test");
const assert = require("node:assert/strict");
const C = require("../web/pomodoro_clock.js");
test("one delayed tick after a background hour catches up without counting intervals", () => {
  const state = {
    totalSeconds: 3600,
    elapsedSecondsInSession: 0,
    runningSince: 1000,
    isRunning: true,
  };
  assert.deepEqual(C.sample(state, 3601000), {
    elapsed: 3600,
    remaining: 0,
    minutes: 60,
  });
  assert.equal(
    C.sample(state, 36010000).minutes,
    60,
    "cannot exceed planned duration",
  );
});
test("pause excludes idle time and a resumed timer keeps fractional seconds", () => {
  const paused = {
    totalSeconds: 3600,
    elapsedSecondsInSession: 61.5,
    runningSince: null,
    isRunning: false,
  };
  assert.equal(C.sample(paused, 900000).elapsed, 61.5);
  const resumed = { ...paused, runningSince: 900000, isRunning: true };
  assert.deepEqual(C.sample(resumed, 918500), {
    elapsed: 80,
    remaining: 3520,
    minutes: 1,
  });
  assert.equal(
    C.sample(resumed, 800000).elapsed,
    61.5,
    "clock reversal must not create credit",
  );
});
test("stored timer restores only bounded, known subject data", () => {
  const saved = {
    mode: "focus",
    selectedSubject: "ktvxl",
    totalSeconds: 3600,
    elapsedSecondsInSession: 20,
    loggedMinutes: 0,
    isRunning: true,
    runningSince: Date.now() - 10000,
  };
  assert.equal(C.restore(saved).durationMinutes, 60);
  for (const invalid of [
    null,
    { ...saved, totalSeconds: Infinity },
    { ...saved, loggedMinutes: -1 },
    { ...saved, selectedSubject: "<script>" },
    { ...saved, runningSince: Date.now() + 100000 },
  ])
    assert.equal(C.restore(invalid), null);
});
