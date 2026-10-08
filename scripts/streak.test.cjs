const test = require("node:test");
const assert = require("node:assert/strict");
const M = require("../web/study_streak_model.js");
const time = "2026-10-08T10:00:00Z";
test("Vietnam midnight determines the study day independent of device timezone", () => {
  assert.equal(M.dayKey("2026-10-07T17:00:00Z"), "2026-10-08");
  assert.equal(M.dayKey("2026-10-07T16:59:59Z"), "2026-10-07");
});
test("yesterday's chain remains available until today ends", () => {
  const logs = {
    "2026-10-05": { ktvxl: 1 },
    "2026-10-06": { tthcm: 20 },
    "2026-10-07": { other: 4 },
  };
  const before = JSON.stringify(logs),
    data = M.build(logs, time);
  assert.equal(data.streak, 3);
  assert.equal(data.todayDone, false);
  assert.equal(data.tier.key, "coral");
  logs["2026-10-08"] = { xstk: 25 };
  assert.equal(M.build(logs, time).streak, 4);
  delete logs["2026-10-08"];
  assert.equal(JSON.stringify(logs), before);
  assert.equal(M.build(logs, "2026-10-09T01:00:00Z").streak, 0);
});
test("month heatmap stops at the month boundary while the chain crosses it", () => {
  const data = M.build(
    {
      "2026-09-29": { ktvxl: 25 },
      "2026-09-30": { ktvxl: 25 },
      "2026-10-01": { ktvxl: 25 },
    },
    "2026-10-01T10:00:00Z",
  );
  assert.equal(data.streak, 3);
  assert.equal(data.days.length, 31);
  assert.equal(data.offset, 3);
  assert.equal(data.minutes, 25);
  assert.equal(data.activeDays, 1);
  assert.equal(data.best, 1);
  assert.ok(data.days.every((day) => day.key.startsWith("2026-10-")));
});
test("ignores invalid and future data and combines subjects once per day", () => {
  const data = M.build(
    {
      "2026-02-30": { ktvxl: 100 },
      "2026-10-09": { ktvxl: 100 },
      "2026-10-08": {
        ktvxl: 60,
        tthcm: 60,
        xstk: "500",
        other: -25,
        vldc: Infinity,
        bad: 100,
      },
    },
    time,
  );
  assert.equal(data.streak, 1);
  assert.equal(data.minutes, 120);
  assert.equal(data.days[7].level, 4);
  assert.equal(data.activeDays, 1);
  assert.equal(data.days[8].future, true);
  assert.equal(M.build(null, time).streak, 0);
  assert.equal(M.build([], time).minutes, 0);
});
test("leap-year February produces exactly 29 cells and no prior-month day", () => {
  const data = M.build({ "2024-02-29": { ktvxl: 25 } }, "2024-02-29T12:00:00Z");
  assert.equal(data.days.length, 29);
  assert.equal(data.days.at(-1).day, 29);
  assert.equal(data.todayDone, true);
});
test("tiers unlock only at their exact consecutive-day milestones", () => {
  for (const [count, key] of [
    [0, "idle"],
    [1, "gold"],
    [2, "orange"],
    [3, "coral"],
    [4, "coral"],
    [5, "pink"],
    [6, "pink"],
    [7, "violet"],
    [8, "violet"],
  ]) {
    const logs = {};
    for (let i = 0; i < count; i++)
      logs[
        new Date(Date.parse("2026-10-08T00:00:00Z") - i * 86400000)
          .toISOString()
          .slice(0, 10)
      ] = { ktvxl: 25 };
    const data = M.build(logs, time);
    assert.equal(data.streak, count);
    assert.equal(data.tier.key, key);
  }
});

test("each day preserves the subject split and all fixed exams, including future exams", () => {
  const data = M.build(
    { "2026-10-08": { ktvxl: 35, tthcm: 25, vldc: 12 } },
    time,
  );
  assert.deepEqual(
    data.days[7].subjects.map((s) => [s.key, s.minutes]),
    [
      ["ktvxl", 35],
      ["tthcm", 25],
      ["vldc", 12],
    ],
  );
  assert.equal(new Set(M.subjects.map((s) => s.color)).size, 6);
  assert.deepEqual(
    data.days
      .filter((d) => d.exams.length)
      .map((d) => [d.key, d.exams[0].subjectKey]),
    [
      ["2026-10-13", "ktvxl"],
      ["2026-10-19", "tthcm"],
      ["2026-10-21", "vldc"],
      ["2026-10-22", "gdtc"],
      ["2026-10-23", "xstk"],
    ],
  );
  assert.equal(data.days[12].future, true);
  assert.equal(
    data.days[12].minutes,
    0,
    "exam date must not create study credit",
  );
});
