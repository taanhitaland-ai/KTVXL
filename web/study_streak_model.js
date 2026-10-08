(function (root, factory) {
  const model = factory(
    typeof module === "object" && module.exports
      ? require("./study_schedule_data.js")
      : root.KMA_STUDY_SCHEDULE,
  );
  if (typeof module === "object" && module.exports) module.exports = model;
  else root.KMA_STREAK_MODEL = model;
})(typeof window === "object" ? window : globalThis, function (schedule) {
  "use strict";
  const subjects = ["ktvxl", "tthcm", "vldc", "xstk", "gdtc", "other"];
  const tiers = [
    {
      days: 1,
      name: "Lửa vàng",
      key: "gold",
      from: "#FFB800",
      to: "#FFDF4D",
      core: "#FFF2A0",
    },
    {
      days: 2,
      name: "Lửa cam",
      key: "orange",
      from: "#FF5C23",
      to: "#FFAA32",
      core: "#FFE08C",
    },
    {
      days: 3,
      name: "Lửa đỏ hồng",
      key: "coral",
      from: "#FF3868",
      to: "#FF8D73",
      core: "#FFD3B0",
    },
    {
      days: 5,
      name: "Lửa hồng tím",
      key: "pink",
      from: "#D82CCC",
      to: "#FF62BA",
      core: "#FFB9EC",
    },
    {
      days: 7,
      name: "Lửa tím",
      key: "violet",
      from: "#853CFF",
      to: "#C677FF",
      core: "#E1B4FF",
    },
  ];
  const inactive = {
    days: 0,
    name: "Khởi động",
    key: "idle",
    from: "#8C87A3",
    to: "#B5ACC7",
    core: "#E5DFF1",
  };
  const dayMs = 86400000;
  function dayKey(now = Date.now()) {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Ho_Chi_Minh",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(new Date(now));
    const read = (type) => parts.find((p) => p.type === type).value;
    return `${read("year")}-${read("month")}-${read("day")}`;
  }
  function stamp(key) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) return NaN;
    const date = new Date(key + "T00:00:00Z");
    return Number.isFinite(+date) && date.toISOString().slice(0, 10) === key
      ? +date
      : NaN;
  }
  const keyAt = (time) => new Date(time).toISOString().slice(0, 10);
  function build(logs, now = Date.now()) {
    const today = dayKey(now),
      todayTime = stamp(today),
      totals = new Map(),
      byDay = new Map();
    if (logs && typeof logs === "object" && !Array.isArray(logs)) {
      for (const [key, row] of Object.entries(logs)) {
        if (
          !Number.isFinite(stamp(key)) ||
          key > today ||
          !row ||
          typeof row !== "object" ||
          Array.isArray(row)
        )
          continue;
        let minutes = 0;
        const breakdown = [];
        for (const subject of subjects) {
          const value = row[subject];
          if (
            typeof value === "number" &&
            Number.isFinite(value) &&
            value >= 1
          ) {
            const safe = Math.floor(Math.min(100000, value));
            minutes += safe;
            breakdown.push({
              ...schedule.subjects.find((s) => s.key === subject),
              minutes: safe,
            });
          }
        }
        if (minutes >= 1) {
          totals.set(key, minutes);
          byDay.set(key, breakdown);
        }
      }
    }
    let cursor = totals.has(today) ? todayTime : todayTime - dayMs,
      streak = 0;
    while (totals.has(keyAt(cursor))) {
      streak++;
      cursor -= dayMs;
    }
    const month = today.slice(0, 7),
      firstTime = stamp(month + "-01");
    const [year, number] = month.split("-").map(Number);
    const count = new Date(Date.UTC(year, number, 0)).getUTCDate();
    const days = Array.from({ length: count }, (_, index) => {
      const key = keyAt(firstTime + index * dayMs),
        minutes = totals.get(key) || 0;
      return {
        key,
        day: index + 1,
        minutes,
        subjects: byDay.get(key) || [],
        exams: schedule.exams.filter((exam) => exam.dateKey === key),
        future: key > today,
        today: key === today,
        level:
          minutes >= 120
            ? 4
            : minutes >= 60
              ? 3
              : minutes >= 25
                ? 2
                : minutes >= 1
                  ? 1
                  : 0,
      };
    });
    let best = 0,
      run = 0;
    for (const day of days) {
      run = day.minutes ? run + 1 : 0;
      best = Math.max(best, run);
    }
    const tier = tiers.filter((t) => streak >= t.days).at(-1) || inactive;
    const next = tiers.find((t) => t.days > streak) || null;
    return {
      today,
      month,
      streak,
      best,
      tier,
      next,
      todayDone: totals.has(today),
      activeDays: days.filter((d) => d.minutes).length,
      minutes: days.reduce((sum, d) => sum + d.minutes, 0),
      days,
      offset: (new Date(firstTime).getUTCDay() + 6) % 7,
      progress: next ? Math.min(1, streak / next.days) : 1,
    };
  }
  return Object.freeze({ build, dayKey, tiers, subjects: schedule.subjects });
});
