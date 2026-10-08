// Isolated demo only. No Google account or Supabase request is used here.
(function () {
  "use strict";
  const user = "77777777-7777-4777-8777-777777777777",
    key = "ktvxl_focus_demo_backend";
  const nativeNow = Date.now.bind(Date);
  let offset = 0,
    failFinish = false,
    failStart = false;
  Date.now = () => nativeNow() + offset;
  let data;
  try {
    data = JSON.parse(localStorage.getItem(key));
  } catch (_) {}
  if (!data)
    data = {
      profile: { nickname: "Bạn thử", leaderboard_opt_in: true },
      records: {},
      receipts: {},
      sessions: [],
    };
  offset = data.clockOffset || 0;
  localStorage.setItem("kma_cloud_v1:owner", user);
  localStorage.setItem("kma_cloud_v1:" + user + ":guest-decision", "skip");
  const save = () => {
    data.clockOffset = offset;
    localStorage.setItem(key, JSON.stringify(data));
  };
  const snapshot = () => ({
    profile: data.profile,
    records: Object.fromEntries(
      Object.entries(data.records).sort(([a], [b]) => a.localeCompare(b)),
    ),
  });
  const elapsed = (s) =>
    Math.min(
      s.duration_minutes * 60,
      s.elapsed_seconds +
        (s.state === "running"
          ? Math.max(0, (Date.now() - s.anchor) / 1000)
          : 0),
    );
  const payload = (s) => ({ ...s, server_elapsed: elapsed(s) });
  function board(args) {
    const L = window.KMA_LEADERBOARD_MODEL,
      now = Date.now();
    const sessions = data.sessions
      .filter((s) => s.credited_minutes > 0)
      .map((s) => ({
        id: s.id,
        subject: s.subject,
        minutes: s.credited_minutes,
        endedAt: s.endedAt,
      }));
    const stats = L.sumSessions(sessions, args.p_period, args.p_subject, now);
    const members = [
      {
        id: "sample-a",
        nickname: "Linh chăm học",
        minutes: 45,
        sessions: 2,
        rank: 1,
      },
      {
        id: "sample-b",
        nickname: "Khoai ôn bài",
        minutes: 30,
        sessions: 1,
        rank: 2,
      },
    ];
    if (stats.minutes)
      members.push({ id: user, nickname: data.profile.nickname, ...stats });
    const rows = L.rank(members);
    return {
      remote: true,
      rows,
      me: {
        id: user,
        nickname: data.profile.nickname,
        joined: true,
        ...stats,
        rank: rows.find((r) => r.id === user)?.rank || null,
      },
    };
  }
  async function rpc(name, args = {}) {
    try {
      let result;
      if (name === "study_snapshot") result = snapshot();
      else if (name === "study_sync") {
        const accepted = [];
        for (const op of args.p_operations) {
          if (!data.receipts[op.opId]) {
            const old = data.records[op.rid];
            data.records[op.rid] = {
              kind: op.kind,
              subject: op.subject,
              id: op.id,
              value:
                op.kind === "study" ? (old?.value || 0) + op.delta : op.value,
              version: (old?.version || 0) + 1,
            };
            data.receipts[op.opId] = true;
          }
          accepted.push(op.opId);
        }
        result = { ...snapshot(), accepted, conflicts: [] };
      } else if (name === "study_set_profile") {
        data.profile = { nickname: args.p_nickname, leaderboard_opt_in: true };
        result = data.profile;
      } else if (name === "study_leaderboard") result = board(args);
      else if (name === "study_focus_current") {
        const s = data.sessions.find((s) =>
          ["running", "paused"].includes(s.state),
        );
        result = s ? payload(s) : null;
      } else if (name === "study_focus_start") {
        let s = data.sessions.find((s) =>
          ["running", "paused"].includes(s.state),
        );
        if (
          s &&
          (s.subject !== args.p_subject ||
            s.duration_minutes !== args.p_minutes)
        )
          throw Error("A focus session is already active");
        if (!s) {
          s = {
            id: crypto.randomUUID(),
            subject: args.p_subject,
            duration_minutes: args.p_minutes,
            state: "running",
            elapsed_seconds: 0,
            anchor: Date.now(),
            credited_minutes: 0,
          };
          data.sessions.push(s);
        } else if (s.state === "paused") {
          s.state = "running";
          s.anchor = Date.now();
        }
        result = payload(s);
        save();
        if (failStart) {
          failStart = false;
          throw Error("Lost start response (demo)");
        }
      } else if (name === "study_focus_action") {
        const s = data.sessions.find((s) => s.id === args.p_id);
        if (!s) throw Error("Missing session");
        if (!["completed", "cancelled"].includes(s.state)) {
          if (["finish", "cancel", "pause"].includes(args.p_action)) {
            s.elapsed_seconds = elapsed(s);
            s.state =
              args.p_action === "pause"
                ? "paused"
                : args.p_action === "finish"
                  ? "completed"
                  : "cancelled";
            if (s.state !== "paused") {
              s.credited_minutes = Math.floor(s.elapsed_seconds / 60);
              s.endedAt = Date.now();
            }
          } else if (args.p_action === "resume" && s.state === "paused") {
            s.state = "running";
            s.anchor = Date.now();
          }
        }
        result = payload(s);
        save();
        if (args.p_action === "finish" && failFinish) {
          failFinish = false;
          throw Error("Lost finish response (demo)");
        }
      } else throw Error("Unknown fixture RPC: " + name);
      save();
      return { data: JSON.parse(JSON.stringify(result)), error: null };
    } catch (error) {
      return { data: null, error: { message: error.message } };
    }
  }
  window.supabase = {
    createClient: () => ({
      rpc,
      auth: {
        getSession: async () => ({ data: { session: { user: { id: user } } } }),
        onAuthStateChange: () => ({
          data: { subscription: { unsubscribe() {} } },
        }),
      },
    }),
  };
  window.KMA_FOCUS_DEMO = Object.freeze({
    advance: (seconds) => {
      offset += seconds * 1000;
      save();
    },
    loseNextFinish: () => {
      failFinish = true;
    },
    loseNextStart: () => {
      failStart = true;
    },
    snapshot: () => JSON.parse(JSON.stringify(data)),
  });
  document.addEventListener("DOMContentLoaded", () => {
    const bar = document.createElement("aside");
    bar.className = "focus-demo-bar";
    const label = document.createElement("strong");
    label.textContent = "BẢN THỬ · Dữ liệu mẫu";
    bar.append(label);
    const make = (text, fn) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = text;
      b.onclick = fn;
      bar.append(b);
    };
    make("Mô phỏng 60 phút", () => {
      offset += 3600000;
      save();
    });
    make("Mô phỏng 2 phút", () => {
      offset += 120000;
      save();
    });
    make("Xem chuỗi", () => {
      window.KMA_ACCOUNT.openStreak();
    });
    document.body.append(bar);
    // Real leaderboard UI must show the demo marker for this isolated page.
    setTimeout(() => {
      window.KMA_ACCOUNT.isDemo = true;
    }, 0);
  });
})();
