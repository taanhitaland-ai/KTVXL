(function (root, factory) {
  const model = factory();
  if (typeof module === "object" && module.exports) module.exports = model;
  else root.KMA_LEADERBOARD_MODEL = model;
})(typeof window === "object" ? window : globalThis, function () {
  "use strict";
  const subjects = ["ktvxl", "tthcm", "vldc", "xstk", "gdtc", "other"];
  const fixtures = []; // Sample participants exist only in the isolated demo.
  function dayKey(time) {
    return new Date(time + 7 * 3600000).toISOString().slice(0, 10);
  }
  function startKey(period, now) {
    const today = dayKey(now);
    if (period === "month") return today.slice(0, 7) + "-01";
    if (period === "week") {
      const d = new Date(today + "T00:00:00Z");
      d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
      return d.toISOString().slice(0, 10);
    }
    return today;
  }
  function sumSessions(sessions, period, subject, now) {
    const seen = new Set(),
      start = startKey(period, now),
      end = dayKey(now);
    let total = 0,
      count = 0;
    for (const session of Array.isArray(sessions)
      ? sessions.slice(-5000)
      : []) {
      if (
        !session ||
        typeof session.id !== "string" ||
        seen.has(session.id) ||
        !Number.isFinite(session.endedAt) ||
        session.endedAt < 0 ||
        session.endedAt > now ||
        !Number.isInteger(session.minutes) ||
        session.minutes < 1 ||
        session.minutes > 180 ||
        !subjects.includes(session.subject)
      )
        continue;
      seen.add(session.id);
      const day = dayKey(session.endedAt);
      if (
        day < start ||
        day > end ||
        (subject !== "all" && session.subject !== subject)
      )
        continue;
      total += session.minutes;
      count++;
    }
    return { minutes: total, sessions: count };
  }
  function rank(rows) {
    const sorted = rows
      .filter((row) => Number.isFinite(row.minutes) && row.minutes > 0)
      .map((row) => ({ ...row }))
      .sort((a, b) => b.minutes - a.minutes || a.id.localeCompare(b.id));
    let previous = null,
      position = 0;
    sorted.forEach((row, index) => {
      if (row.minutes !== previous) position = index + 1;
      row.rank = position;
      previous = row.minutes;
    });
    return sorted;
  }
  function build(snapshot, period, subject, now) {
    if (snapshot.remote) return snapshot;
    period = ["today", "week", "month"].includes(period) ? period : "week";
    subject = subjects.includes(subject) ? subject : "all";
    now = Number.isFinite(now) ? now : Date.now();
    const rows = fixtures.map((member) => {
      const minutes =
        subject === "all"
          ? member[period]
          : member.subject === subject
            ? Math.round(member[period] * 0.65)
            : Math.round(member[period] * 0.07);
      return {
        id: member.id,
        nickname: member.nickname,
        icon: member.icon,
        minutes,
        sessions: Math.max(1, Math.round(minutes / 25)),
        sample: true,
      };
    });
    for (const member of snapshot.participants || []) {
      if (
        !member ||
        typeof member.id !== "string" ||
        typeof member.nickname !== "string"
      )
        continue;
      const stats = sumSessions(member.sessions, period, subject, now);
      rows.push({
        id: member.id,
        nickname: member.nickname.normalize("NFC").slice(0, 32),
        icon: member.nickname.trim().slice(0, 1).toLocaleUpperCase("vi"),
        ...stats,
        sample: false,
      });
    }
    const sorted = rank(rows),
      ownStats = snapshot.me
        ? sumSessions(snapshot.me.sessions, period, subject, now)
        : null;
    return {
      rows: sorted,
      me: snapshot.me
        ? {
            ...snapshot.me,
            ...ownStats,
            rank: sorted.find((row) => row.id === snapshot.me.id)?.rank || null,
          }
        : null,
    };
  }
  function formatMinutes(minutes) {
    const value = Math.max(0, Math.round(minutes));
    return value >= 60
      ? Math.floor(value / 60) +
          "h " +
          String(value % 60).padStart(2, "0") +
          "p"
      : value + " phút";
  }
  return { dayKey, startKey, sumSessions, rank, build, formatMinutes };
});
