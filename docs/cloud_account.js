(function () {
  "use strict";
  const M = window.KMA_SYNC_MODEL,
    config = window.KMA_CLOUD_CONFIG;
  if (!M || !config || !window.supabase) return;
  const client = window.supabase.createClient(
    config.url,
    config.publishableKey,
    {
      auth: {
        flowType: "pkce",
        detectSessionInUrl: true,
        persistSession: true,
        autoRefreshToken: true,
      },
    },
  );
  const ns = "kma_cloud_v1:",
    ownerKey = ns + "owner";
  const nativeGet = Storage.prototype.getItem,
    nativeSet = Storage.prototype.setItem,
    nativeRemove = Storage.prototype.removeItem;
  const get = (key) => nativeGet.call(localStorage, key),
    set = (key, value) => nativeSet.call(localStorage, key, String(value)),
    remove = (key) => nativeRemove.call(localStorage, key);
  let user = /^[0-9a-f-]{36}$/.test(get(ownerKey) || "") ? get(ownerKey) : null;
  let authenticated = false,
    busy = false,
    ready = false,
    remote = {},
    profile = { nickname: "Người học", leaderboard_opt_in: false },
    conflicts = [],
    syncTimer,
    lastSync,
    error = false;
  let authButton,
    streakButton,
    streakDialog,
    streakContent,
    streakCache,
    dialog,
    modalBody,
    toast,
    toastTimer,
    guestNotice,
    initializedAccount;
  const bucket = () => (user ? ns + user + ":data:" : "");
  const outboxPrefix = () => ns + user + ":op:";
  let versions = M.parse(get(ns + user + ":versions"), {}),
    rankingCache = new Map(),
    rankingRequests = new Set(),
    rankingTimes = new Map(),
    rankingRevision = 0;
  const appKey = (key) => M.keys.includes(key);
  function queue() {
    if (!user) return [];
    const result = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key.startsWith(outboxPrefix())) continue;
      const op = M.parse(get(key), null);
      if (op && op.opId && op.rid) result.push(op);
    }
    return result.sort(
      (a, b) => a.createdAt - b.createdAt || a.opId.localeCompare(b.opId),
    );
  }
  function records(prefix = bucket()) {
    const all = {};
    for (const key of M.keys)
      Object.assign(all, M.flatten(key, get(prefix + key)));
    return all;
  }
  function addOperations(operations) {
    if (!operations.length) return;
    const pending = queue();
    let sequence = Math.max(
      Date.now(),
      ...pending.map((op) => op.createdAt || 0),
    );
    for (const op of operations) {
      const prev = pending.filter((p) => p.rid === op.rid).at(-1);
      if (prev) op.baseVersion = prev.baseVersion + 1;
      op.createdAt = ++sequence;
      set(outboxPrefix() + op.opId, JSON.stringify(op));
      pending.push(op);
    }
    scheduleSync();
    renderStatus();
  }
  function capture(key, before, after) {
    if (user && appKey(key))
      addOperations(M.diff(key, before, after, versions));
  }
  // Preserve the existing app's storage schemas. Only synced keys become account-scoped;
  // guest data keeps its original keys, and theme/music/preferences remain on this device.
  Storage.prototype.getItem = function (key) {
    return this === localStorage && appKey(key)
      ? get(bucket() + key)
      : nativeGet.call(this, key);
  };
  Storage.prototype.setItem = function (key, value) {
    if (this !== localStorage || !appKey(key))
      return nativeSet.call(this, key, value);
    const previous = get(bucket() + key);
    set(bucket() + key, value);
    capture(key, previous, String(value));
    if (key === "kma_study_logs_v1") renderStreakTrigger();
  };
  Storage.prototype.removeItem = function (key) {
    if (this !== localStorage || !appKey(key))
      return nativeRemove.call(this, key);
    const previous = get(bucket() + key);
    remove(bucket() + key);
    capture(key, previous, null);
    if (key === "kma_study_logs_v1") renderStreakTrigger();
  };
  async function rpc(name, args = {}) {
    const { data, error: failure } = await client.rpc(name, args);
    if (failure) throw failure;
    return data;
  }
  function scheduleSync() {
    clearTimeout(syncTimer);
    if (user && authenticated) syncTimer = setTimeout(sync, 650);
  }
  function apply(data) {
    const payload = M.project(data, queue()),
      changed = [];
    for (const [key, value] of Object.entries(payload)) {
      const before = get(bucket() + key);
      if (M.samePayload(key, before, value)) continue;
      set(bucket() + key, value);
      changed.push([key, before, value]);
    }
    for (const [key, oldValue, newValue] of changed)
      window.dispatchEvent(
        new StorageEvent("storage", {
          key,
          oldValue,
          newValue,
          storageArea: localStorage,
        }),
      );
    if (
      changed.some(([key]) => /kma_(user_answers|starred_questions)_/.test(key))
    )
      window.refreshSavedProgress?.();
    if (changed.some(([key]) => key === "kma_study_logs_v1"))
      window.KMA_SCHEDULE_POMODORO?.renderStudyStats();
  }
  async function sync() {
    if (!user || !authenticated || busy) return;
    busy = true;
    renderStatus();
    const syncingUser = user;
    try {
      // At most one operation per record per request. A conflict blocks later edits to
      // that note until the user resolves it; queued operations never change after send.
      const blocked = new Set(conflicts.map((c) => c.op.rid)),
        picked = new Set();
      const batch = queue()
        .filter((op) => {
          if (blocked.has(op.rid) || picked.has(op.rid)) return false;
          picked.add(op.rid);
          return true;
        })
        .slice(0, 200);
      const result = batch.length
        ? await rpc("study_sync", { p_operations: batch })
        : await rpc("study_snapshot");
      if (user !== syncingUser) return;
      for (const id of result.accepted || []) remove(outboxPrefix() + id);
      remote = result.records || {};
      profile = result.profile || profile;
      for (const [key, value] of Object.entries(remote))
        versions[key] = value.version;
      set(ns + user + ":versions", JSON.stringify(versions));
      conflicts = conflicts.filter((c) =>
        queue().some((op) => op.rid === c.op.rid),
      );
      for (const conflict of result.conflicts || [])
        if (!conflicts.some((c) => c.op.rid === conflict.op.rid))
          conflicts.push(conflict);
      apply(remote);
      lastSync = new Date();
      error = false;
    } catch (_) {
      error = true;
    } finally {
      busy = false;
      renderStatus();
      window.dispatchEvent(new CustomEvent("kma:cloud-updated"));
      if (
        queue().some((op) => !conflicts.some((c) => c.op.rid === op.rid)) &&
        !error
      )
        scheduleSync();
    }
  }
  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  };
  const button = (text, cls, fn) => {
    const n = el("button", cls || "sync-btn", text);
    n.type = "button";
    if (fn) n.addEventListener("click", fn);
    return n;
  };
  function googleIcon() {
    const s = el("span", "sync-google-icon");
    s.setAttribute("aria-hidden", "true");
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    for (const [color, path] of [
      [
        "#4285F4",
        "M22 12.2c0-.7-.1-1.4-.2-2.1H12v4h5.6a4.8 4.8 0 0 1-2.1 3.2v2.6h3.4c2-1.8 3.1-4.5 3.1-7.7z",
      ],
      [
        "#34A853",
        "M12 22c2.8 0 5.1-.9 6.9-2.5l-3.4-2.6c-.9.6-2.1 1-3.5 1-2.7 0-5-1.8-5.8-4.3H2.7v2.7A10.4 10.4 0 0 0 12 22z",
      ],
      [
        "#FBBC05",
        "M6.2 13.6a6.4 6.4 0 0 1 0-3.2V7.7H2.7a10.4 10.4 0 0 0 0 8.6l3.5-2.7z",
      ],
      [
        "#EA4335",
        "M12 6.1c1.5 0 2.9.5 4 1.6l3-3A10 10 0 0 0 12 2a10.4 10.4 0 0 0-9.3 5.7l3.5 2.7C7 7.9 9.3 6.1 12 6.1z",
      ],
    ]) {
      const p = document.createElementNS(svg.namespaceURI, "path");
      p.setAttribute("fill", color);
      p.setAttribute("d", path);
      svg.append(p);
    }
    s.append(svg);
    return s;
  }
  function notify(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => (toast.hidden = true), 3500);
  }
  function stateLabel() {
    return !user
      ? "Chỉ lưu trên máy"
      : !authenticated
        ? "Đang kiểm tra tài khoản…"
        : busy
          ? "Đang đồng bộ…"
          : conflicts.length
            ? "Cần chọn bản ghi chú"
            : error
              ? "Chưa đồng bộ · đã giữ tại máy"
              : queue().length
                ? "Chờ đồng bộ"
                : "Đã đồng bộ";
  }
  function updateNoteCaptions() {
    document.querySelectorAll(".note-caption").forEach((caption) => {
      const label =
        caption.dataset.cloudLabel || caption.textContent.split(" · ")[0];
      caption.dataset.cloudLabel = label;
      const text =
        label +
        " · " +
        (user ? "Theo tài khoản · Tự đồng bộ" : "Lưu riêng trên máy này");
      if (caption.textContent !== text) caption.textContent = text;
    });
  }
  function renderStatus() {
    if (!ready) return;
    updateNoteCaptions();
    const authLabel = (user || "guest") + "|" + profile.nickname;
    if (authButton.dataset.identity !== authLabel) {
      authButton.dataset.identity = authLabel;
      authButton.replaceChildren(
        user
          ? el("span", "sync-avatar", profile.nickname?.slice(0, 1) || "B")
          : googleIcon(),
        el("span", "", user ? "Tài khoản" : "Đăng nhập"),
      );
    }
    renderStreakTrigger();
    const studyCaption = document.getElementById("study-storage-caption");
    const captionText = user
      ? "Lưu theo tài khoản · Tự đồng bộ"
      : "Lưu tự động trong máy";
    if (studyCaption && studyCaption.textContent !== captionText)
      studyCaption.textContent = captionText;
    guestNotice.hidden =
      !!user || get(ns + "guest-notice-dismissed") === "true";
  }
  function heading(kicker, title, copy) {
    modalBody.replaceChildren();
    const lead = el("div", "sync-lead");
    lead.append(
      el("span", "sync-kicker", kicker),
      el("h2", "", title),
      el("p", "", copy),
    );
    lead.querySelector("h2").id = "sync-modal-title";
    modalBody.append(lead);
  }
  function openAccount() {
    if (conflicts.length) showConflicts();
    else if (user) showProfile();
    else showWelcome();
    if (!dialog.open) dialog.showModal();
  }
  function showWelcome() {
    heading(
      "MỘT TÀI KHOẢN · MỌI THIẾT BỊ",
      "Góc học đi cùng bạn",
      "Đăng nhập để tiếp tục tiến trình và ghi chú trên máy tính hoặc điện thoại.",
    );
    const list = el("ul", "sync-benefits");
    for (const text of [
      "Câu đã làm và câu gắn sao theo tài khoản",
      "Ghi chú đủ màu, giữ nguyên trên thiết bị khác",
      "Lịch sử học và bảng xếp hạng Pomodoro",
    ])
      list.append(el("li", "", "✓ " + text));
    modalBody.append(list);
    const login = button(
      "Tiếp tục với Google",
      "sync-btn sync-google-button",
      async () => {
        login.disabled = true;
        try {
          const redirect = new URL(location.pathname, location.origin).href;
          const { error: failure } = await client.auth.signInWithOAuth({
            provider: "google",
            options: {
              redirectTo: redirect,
              queryParams: { prompt: "select_account" },
            },
          });
          if (failure) throw failure;
        } catch (_) {
          login.disabled = false;
          notify("Chưa mở được đăng nhập Google. Hãy thử lại.");
        }
      },
    );
    login.prepend(googleIcon());
    modalBody.append(
      login,
      button("Tiếp tục học trên máy này", "sync-text-button", () =>
        dialog.close(),
      ),
    );
    const privacy = el(
      "a",
      "sync-text-button",
      "Quyền riêng tư và dữ liệu học tập",
    );
    privacy.href = "privacy.html";
    privacy.target = "_blank";
    privacy.rel = "noopener";
    modalBody.append(privacy);
  }
  function summary(counts) {
    const grid = el("div", "sync-summary");
    for (const [value, label] of [
      [counts.answers, "Câu đã làm"],
      [counts.stars, "Câu gắn sao"],
      [counts.notes, "Ghi chú"],
      [Math.round(counts.minutes), "Phút học"],
    ]) {
      const item = el("div", "sync-summary-item");
      item.append(el("strong", "", String(value)), el("span", "", label));
      grid.append(item);
    }
    return grid;
  }
  function showProfile() {
    heading(
      "TÀI KHOẢN CỦA BẠN",
      "Chào " + profile.nickname + " ☾",
      "Tiến trình và ghi chú được lưu riêng theo tài khoản này.",
    );
    modalBody.append(
      el(
        "p",
        "sync-info",
        stateLabel() +
          (lastSync ? " · " + lastSync.toLocaleTimeString("vi-VN") : ""),
      ),
      summary(M.counts(records())),
    );
    const form = el("form", "sync-profile-form"),
      label = el("label", "", "Biệt danh trên bảng xếp hạng");
    label.htmlFor = "sync-nickname";
    const input = el("input", "sync-input");
    input.id = "sync-nickname";
    input.maxLength = 32;
    input.value = profile.nickname;
    const save = button("Lưu hồ sơ", "sync-btn sync-secondary");
    save.type = "submit";
    save.disabled = true;
    const changed = () =>
      (save.disabled =
        !input.value.trim() || input.value.trim() === profile.nickname);
    input.addEventListener("input", changed);
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      save.disabled = true;
      try {
        profile = await rpc("study_set_profile", {
          p_nickname: input.value.trim().normalize("NFC"),
          p_joined: true,
        });
        rankingCache.clear();
        notify("Đã lưu hồ sơ");
        window.dispatchEvent(new CustomEvent("kma:cloud-updated"));
      } catch (_) {
        notify("Chưa lưu được hồ sơ. Hãy thử lại.");
        changed();
      }
    });
    form.append(
      label,
      input,
      el(
        "p",
        "sync-info",
        "Có thời gian Pomodoro là bạn tự động có tên trên bảng xếp hạng. Chỉ biệt danh và thời gian học được công khai; tiến trình và ghi chú vẫn riêng tư.",
      ),
      save,
    );
    modalBody.append(form);
    const actions = el("div", "sync-profile-actions");
    actions.append(
      button("↻ Đồng bộ ngay", "sync-btn sync-primary", async () => {
        await sync();
        if (conflicts.length) showConflicts();
        else showProfile();
      }),
      button("Đăng xuất", "sync-text-button sync-sign-out", async () => {
        if (
          queue().length &&
          !confirm(
            "Còn thay đổi chưa đồng bộ. Bản lưu sẽ giữ riêng tại máy cho lần đăng nhập sau. Đăng xuất?",
          )
        )
          return;
        const { error: failure } = await client.auth.signOut({
          scope: "local",
        });
        if (failure) notify("Chưa đăng xuất được. Hãy thử lại.");
      }),
    );
    modalBody.append(actions);
  }
  function showStreak() {
    if (!streakDialog || !window.KMA_STREAK) return;
    renderStreakContent();
    if (!streakDialog.open) streakDialog.showModal();
  }
  function renderStreakContent() {
    const selectedDay = streakContent.querySelector(
      '.streak-day[aria-pressed="true"]',
    )?.dataset.date;
    const logs = M.parse(localStorage.getItem("kma_study_logs_v1"), {});
    streakContent.replaceChildren(
      window.KMA_STREAK.render(logs, { selectedDay }),
    );
  }
  function renderStreakTrigger() {
    if (!ready || !window.KMA_STREAK || !window.KMA_STREAK_MODEL) return;
    const raw = localStorage.getItem("kma_study_logs_v1");
    const today = window.KMA_STREAK_MODEL.dayKey();
    if (streakCache?.raw === raw && streakCache.today === today) return;
    const data = window.KMA_STREAK_MODEL.build(M.parse(raw, {}));
    streakCache = { raw, today };
    streakButton.hidden = !data.streak;
    const label = data.streak ? `${data.streak} ngày` : "";
    const signature = `${label}|${data.tier.key}`;
    if (streakButton.dataset.signature !== signature) {
      streakButton.dataset.signature = signature;
      streakButton.replaceChildren(
        ...(data.streak
          ? [window.KMA_STREAK.flame(data.tier), el("span", "", label)]
          : []),
      );
      streakButton.setAttribute(
        "aria-label",
        `Xem chuỗi học: ${data.streak} ngày liên tiếp`,
      );
      streakButton.title = data.streak
        ? `${data.tier.name} · ${data.streak} ngày liên tiếp`
        : "";
    }
    if (streakDialog.open) renderStreakContent();
  }
  function initStreakDialog() {
    streakDialog = el("dialog", "sync-account-dialog study-streak-dialog");
    streakDialog.id = "study-streak-dialog";
    streakDialog.setAttribute("aria-labelledby", "study-streak-title");
    const body = el("div", "sync-modal-body"),
      lead = el("div", "sync-lead");
    const title = el("h2", "", "Chuỗi học của bạn");
    title.id = "study-streak-title";
    lead.append(
      el("span", "sync-kicker", "GIỮ NHỊP HỌC MỖI NGÀY"),
      title,
      el("p", "", "Một chút mỗi ngày, tiến thêm một bước."),
    );
    streakContent = el("div", "streak-dialog-content");
    body.append(lead, streakContent);
    const close = button("✕", "sync-dialog-close", () => streakDialog.close());
    close.setAttribute("aria-label", "Đóng chuỗi học");
    streakDialog.append(close, body);
    document.body.append(streakDialog);
    streakDialog.addEventListener("close", () =>
      (streakButton.hidden ? authButton : streakButton).focus({
        preventScroll: true,
      }),
    );
    streakDialog.addEventListener("click", (event) => {
      if (event.target !== streakDialog) return;
      const rect = streakDialog.getBoundingClientRect();
      if (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      )
        streakDialog.close();
    });
  }
  async function offerImport() {
    if (!user || get(ns + user + ":guest-decision")) return;
    const guest = records(""),
      counts = M.counts(guest);
    if (!Object.values(counts).some(Boolean)) {
      set(ns + user + ":guest-decision", "skip");
      return;
    }
    heading(
      "TIẾN TRÌNH TRƯỚC KHI ĐĂNG NHẬP",
      "Mang theo dữ liệu đang có?",
      "Chỉ thêm câu và ghi chú chưa có trong tài khoản. Bản khách vẫn được giữ trên thiết bị này.",
    );
    modalBody.append(summary(counts));
    const applyImport = button(
      "Đưa dữ liệu này vào tài khoản",
      "sync-btn sync-primary",
      async () => {
        applyImport.disabled = true;
        try {
          while (busy) await new Promise((resolve) => setTimeout(resolve, 50));
          await sync();
          if (error) throw new Error();
          const operations = [];
          for (const [rid, entry] of Object.entries(guest)) {
            if (Object.hasOwn(remote, rid)) continue;
            operations.push({
              ...entry,
              rid,
              baseVersion: 0,
              opId: M.operationId(),
              ...(entry.kind === "study" ? { delta: entry.value } : {}),
            });
          }
          addOperations(operations);
          set(ns + user + ":guest-decision", "imported");
          dialog.close();
          await sync();
        } catch (_) {
          notify("Chưa nhập được dữ liệu. Bản khách vẫn còn tại máy.");
          applyImport.disabled = false;
        }
      },
    );
    modalBody.append(
      applyImport,
      button("Dùng dữ liệu tài khoản", "sync-btn sync-secondary", () => {
        set(ns + user + ":guest-decision", "skip");
        dialog.close();
      }),
    );
    if (!dialog.open) dialog.showModal();
  }
  function showConflicts() {
    const c = conflicts[0];
    if (!c) {
      showProfile();
      return;
    }
    const local =
      queue()
        .filter((op) => op.rid === c.op.rid)
        .at(-1) || c.op;
    heading(
      "GIỮ LẠI CẢ HAI BẢN",
      "Ghi chú đã đổi ở hai nơi",
      "Chọn bản muốn giữ; nội dung trên thiết bị này chưa bị ghi đè.",
    );
    for (const [label, value, side] of [
      ["Bản trên thiết bị này", local.value, "local"],
      ["Bản đã đồng bộ", c.remote?.value, "remote"],
    ]) {
      const card = el("div", "sync-conflict-card");
      card.append(
        el("h3", "", label),
        el("p", "sync-conflict-text", value?.text || "Ghi chú đã được xóa."),
        button("Dùng bản này", "sync-btn sync-secondary", () =>
          resolveConflict(side),
        ),
      );
      modalBody.append(card);
    }
    if (
      local.value &&
      c.remote?.value &&
      local.value.text.length + c.remote.value.text.length + 2 <= 2000
    )
      modalBody.append(
        button("Gộp cả hai nội dung", "sync-btn sync-primary", () =>
          resolveConflict("both"),
        ),
      );
  }
  async function resolveConflict(side) {
    const c = conflicts[0];
    if (!c) return;
    try {
      const latest = await rpc("study_snapshot"),
        server = latest.records[c.op.rid] || null;
      if ((server?.version || 0) !== (c.remote?.version || 0)) {
        c.remote = server;
        showConflicts();
        return;
      }
      const pending = queue().filter((op) => op.rid === c.op.rid),
        local = pending.at(-1) || c.op;
      for (const op of pending) remove(outboxPrefix() + op.opId);
      if (side !== "remote") {
        let value = local.value;
        if (side === "both")
          value = { ...value, text: value.text + "\n\n" + server.value.text };
        addOperations([
          {
            ...local,
            value,
            baseVersion: server?.version || 0,
            opId: M.operationId(),
          },
        ]);
      }
      conflicts.shift();
      await sync();
      if (conflicts.length) showConflicts();
      else showProfile();
    } catch (_) {
      notify("Chưa chọn được bản ghi chú. Hãy thử lại.");
    }
  }
  function getRankingSnapshot(period = "week", subject = "all") {
    const key = period + "|" + subject;
    if (
      (!rankingCache.has(key) ||
        Date.now() - (rankingTimes.get(key) || 0) > 15000) &&
      !rankingRequests.has(key)
    ) {
      const revision = rankingRevision;
      rankingRequests.add(key);
      rpc("study_leaderboard", { p_period: period, p_subject: subject })
        .then((data) => {
          if (revision !== rankingRevision) return;
          rankingCache.set(key, data);
          rankingTimes.set(key, Date.now());
          window.dispatchEvent(new CustomEvent("kma:ranking-updated"));
        })
        .catch(() => {
          if (revision !== rankingRevision) return;
          if (!rankingCache.has(key))
            rankingCache.set(key, {
              remote: true,
              rows: [],
              me: user
                ? {
                    id: user,
                    nickname: profile.nickname,
                    joined: true,
                    minutes: 0,
                    sessions: 0,
                    rank: null,
                  }
                : null,
              failed: true,
            });
          rankingTimes.set(key, Date.now());
          window.dispatchEvent(new CustomEvent("kma:ranking-updated"));
          notify("Chưa tải được bảng xếp hạng. Bấm làm mới để thử lại.");
        })
        .finally(() => {
          rankingRequests.delete(key);
          if (revision !== rankingRevision) getRankingSnapshot(period, subject);
        });
    }
    return (
      rankingCache.get(key) || {
        remote: true,
        loading: true,
        rows: [],
        me: user
          ? {
              id: user,
              nickname: profile.nickname,
              joined: profile.leaderboard_opt_in,
              minutes: 0,
              sessions: 0,
              rank: null,
            }
          : null,
      }
    );
  }
  function refreshRanking() {
    rankingRevision++;
    rankingTimes.clear();
    for (const key of rankingCache.keys()) {
      const [period, subject] = key.split("|");
      getRankingSnapshot(period, subject);
    }
    window.dispatchEvent(new CustomEvent("kma:ranking-updated"));
  }
  async function setRankingParticipation(value) {
    if (!user) {
      openAccount();
      return;
    }
    try {
      profile = await rpc("study_set_profile", {
        p_nickname: profile.nickname,
        p_joined: value === true,
      });
      rankingCache.clear();
      window.dispatchEvent(new CustomEvent("kma:cloud-updated"));
    } catch (_) {
      notify("Chưa lưu được lựa chọn.");
    }
  }
  // Persist finalization before sending: a lost response must never turn finish into cancel.
  let focusId = null,
    focusSubject = null,
    focusMinutes = null;
  const focusKey = () => ns + user + ":active-focus";
  const finishKey = () => ns + user + ":pending-focus-finishes";
  const finishIntentKey = () => ns + user + ":focus-finish-intent";
  function rememberFocus(data) {
    focusId = data?.id || null;
    focusSubject = data?.subject || focusSubject;
    focusMinutes = data?.duration_minutes || focusMinutes;
    if (focusId)
      set(
        focusKey(),
        JSON.stringify({
          id: focusId,
          subject: focusSubject,
          minutes: focusMinutes,
        }),
      );
    else remove(focusKey());
  }
  function pendingFinishes() {
    const ids = M.parse(get(finishKey()), []);
    return Array.isArray(ids)
      ? [
          ...new Set(
            ids
              .slice(0, 200)
              .filter(
                (id) => typeof id === "string" && /^[0-9a-f-]{36}$/.test(id),
              ),
          ),
        ]
      : [];
  }
  async function flushFocusFinishes() {
    if (!authenticated) return;
    const intent = M.parse(get(finishIntentKey()), null);
    if (intent) {
      // Recover a start request whose response was lost, before finalizing it.
      const active = await rpc("study_focus_current");
      if (!active) {
        remove(finishIntentKey());
        remove(focusKey());
        notify(
          "Phiên này chưa bắt đầu được trên máy chủ; thời gian vẫn giữ trong lịch sử cá nhân.",
        );
      } else {
        if (
          active.subject !== intent.subject ||
          active.duration_minutes !== intent.minutes
        )
          throw new Error("Different active focus session");
        rememberFocus(active);
        set(
          finishKey(),
          JSON.stringify([...new Set([...pendingFinishes(), active.id])]),
        );
        remove(finishIntentKey());
      }
    }
    for (const id of pendingFinishes()) {
      const data = await rpc("study_focus_action", {
        p_id: id,
        p_action: "finish",
      });
      if (!["completed", "cancelled"].includes(data.state))
        throw new Error("Focus not finished");
      set(
        finishKey(),
        JSON.stringify(pendingFinishes().filter((value) => value !== id)),
      );
      if (id === focusId) rememberFocus(null);
      refreshRanking();
    }
  }
  async function focusStart(subject, minutes) {
    if (!user || !authenticated) return null;
    await flushFocusFinishes();
    if (!Number.isInteger(minutes) || minutes < 1 || minutes > 300)
      throw new Error("Invalid focus duration");
    if (focusId && (focusSubject !== subject || focusMinutes !== minutes))
      await focusAction("cancel");
    if (focusId) {
      const data = await rpc("study_focus_action", {
        p_id: focusId,
        p_action: "resume",
      });
      if (data.state === "running") return data;
      rememberFocus(null);
    }
    focusSubject = subject;
    focusMinutes = minutes;
    set(focusKey(), JSON.stringify({ subject, minutes, pendingStart: true }));
    const data = await rpc("study_focus_start", {
      p_subject: subject,
      p_minutes: minutes,
    });
    focusSubject = subject;
    focusMinutes = minutes;
    rememberFocus(data);
    return data;
  }
  async function focusAction(action) {
    if (!authenticated) return null;
    if (!focusId) {
      if (action === "finish" && focusSubject && focusMinutes) {
        set(
          finishIntentKey(),
          JSON.stringify({ subject: focusSubject, minutes: focusMinutes }),
        );
        await flushFocusFinishes();
        return null;
      }
      if (!focusSubject || !focusMinutes) return null;
      const active = await rpc("study_focus_current");
      if (!active) return null;
      if (
        active.subject !== focusSubject ||
        active.duration_minutes !== focusMinutes
      )
        throw new Error("Different active focus session");
      rememberFocus(active);
    }
    const id = focusId;
    if (action === "finish") {
      set(
        finishKey(),
        JSON.stringify([...new Set([...pendingFinishes(), id])]),
      );
      await flushFocusFinishes();
      return { state: "completed" };
    }
    // A pending finish is immutable; resetting the UI cannot discard it.
    if (pendingFinishes().includes(id)) return null;
    const data = await rpc("study_focus_action", {
      p_id: id,
      p_action: action,
    });
    if (["completed", "cancelled"].includes(data.state)) {
      rememberFocus(null);
      refreshRanking();
    }
    return data;
  }
  async function restoreFocus() {
    const raw = get(focusKey());
    const saved = M.parse(raw, null);
    if (
      saved &&
      ["ktvxl", "tthcm", "vldc", "xstk", "gdtc", "other"].includes(
        saved.subject,
      ) &&
      Number.isInteger(saved.minutes) &&
      saved.minutes >= 1 &&
      saved.minutes <= 300
    ) {
      focusId = saved.id;
      focusSubject = saved.subject;
      focusMinutes = saved.minutes;
    } else if (/^[0-9a-f-]{36}$/.test(raw || "")) focusId = raw;
    await flushFocusFinishes();
    // Restore a timer only on a device that was running it; other tabs stay idle.
    if (!get(timerStorageKey())) return;
    const data = await rpc("study_focus_current");
    if (data) {
      rememberFocus(data);
      window.KMA_SCHEDULE_POMODORO?.restoreCloudFocus(data);
    } else {
      rememberFocus(null);
      remove(timerStorageKey());
    }
  }
  function timerStorageKey() {
    return ns + (user || "guest") + ":timer";
  }
  async function resumeAuth(session) {
    const next = session?.user?.id || null;
    authenticated = !!next;
    if (next !== user) {
      if (next) set(ownerKey, next);
      else remove(ownerKey);
      location.reload();
      return;
    }
    if (!next) {
      renderStatus();
      return;
    }
    await sync();
    if (initializedAccount === next) return;
    initializedAccount = next;
    try {
      await restoreFocus();
    } catch (_) {
      /* Keep the durable pointer until the server is available. */
    }
    await offerImport();
  }
  async function init() {
    authButton = button("", "sync-auth-trigger", openAccount);
    authButton.id = "sync-account-button";
    authButton.setAttribute("aria-haspopup", "dialog");
    streakButton = button("", "streak-trigger", showStreak);
    streakButton.id = "study-streak-trigger";
    streakButton.hidden = true;
    streakButton.setAttribute("aria-haspopup", "dialog");
    streakButton.setAttribute("aria-controls", "study-streak-dialog");
    document.querySelector(".stats-bar").append(authButton, streakButton);
    initStreakDialog();
    dialog = el("dialog", "sync-account-dialog");
    dialog.id = "sync-account-dialog";
    dialog.setAttribute("aria-labelledby", "sync-modal-title");
    modalBody = el("div", "sync-modal-body");
    const close = button("✕", "sync-dialog-close", () => dialog.close());
    close.setAttribute("aria-label", "Đóng tài khoản");
    dialog.append(close, modalBody);
    document.body.append(dialog);
    dialog.addEventListener("close", () =>
      authButton.focus({ preventScroll: true }),
    );
    dialog.addEventListener("click", (e) => {
      if (e.target !== dialog) return;
      const r = dialog.getBoundingClientRect();
      if (
        e.clientX < r.left ||
        e.clientX > r.right ||
        e.clientY < r.top ||
        e.clientY > r.bottom
      )
        dialog.close();
    });
    toast = el("p", "sync-toast");
    toast.hidden = true;
    toast.setAttribute("role", "status");
    document.body.append(toast);
    guestNotice = el("aside", "sync-guest-notice");
    guestNotice.id = "sync-guest-notice";
    const copy = el("div", "sync-guest-copy");
    copy.append(
      el("strong", "", "Mang tiến trình của bạn sang điện thoại"),
      el("p", "", "Đăng nhập để đồng bộ câu đã làm, ghi chú và lịch sử học."),
    );
    const login = button(
      "Đăng nhập Google",
      "sync-btn sync-primary",
      openAccount,
    );
    login.prepend(googleIcon());
    const dismiss = button("✕", "sync-guest-dismiss", () => {
      set(ns + "guest-notice-dismissed", "true");
      renderStatus();
    });
    dismiss.setAttribute("aria-label", "Ẩn lời nhắc đăng nhập");
    guestNotice.append(
      el("span", "sync-guest-symbol", "↗"),
      copy,
      login,
      dismiss,
    );
    document.querySelector(".main-content").prepend(guestNotice);
    ready = true;
    renderStatus();
    new MutationObserver((mutations) => {
      if (
        mutations.some((m) =>
          [...m.addedNodes].some(
            (n) =>
              n.nodeType === 1 &&
              (n.matches?.(".note-caption") ||
                n.querySelector?.(".note-caption")),
          ),
        )
      )
        updateNoteCaptions();
    }).observe(document.body, {
      childList: true,
      subtree: true,
    });
    const { data, error: failure } = await client.auth.getSession();
    if (failure) {
      error = true;
      renderStatus();
    } else await resumeAuth(data.session);
    client.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || event === "SIGNED_IN")
        setTimeout(() => resumeAuth(session), 0);
    });
    setInterval(() => {
      renderStreakTrigger();
      if (document.visibilityState === "visible" && authenticated) sync();
      if (authenticated && (pendingFinishes().length || get(finishIntentKey())))
        focusTask(flushFocusFinishes).catch(() => {});
      if (document.getElementById("leaderboard-dialog")?.open) refreshRanking();
    }, 15000);
  }
  window.addEventListener("online", scheduleSync);
  document.addEventListener("visibilitychange", renderStreakTrigger);
  window.addEventListener("storage", (event) => {
    if (event.key === "kma_study_logs_v1") renderStreakTrigger();
    if (event.key === ownerKey && event.newValue !== user) location.reload();
    if (user && event.key?.startsWith(ns + user + ":op:")) scheduleSync();
    const prefix = bucket();
    if (!user || !event.key?.startsWith(prefix)) return;
    const key = event.key.slice(prefix.length);
    if (!appKey(key)) return;
    window.dispatchEvent(
      new StorageEvent("storage", {
        key,
        oldValue: event.oldValue,
        newValue: event.newValue,
        storageArea: localStorage,
      }),
    );
    if (/kma_(user_answers|starred_questions)_/.test(key))
      window.refreshSavedProgress?.();
    if (key === "kma_study_logs_v1")
      window.KMA_SCHEDULE_POMODORO?.renderStudyStats();
  });
  let focusChain = Promise.resolve();
  const focusTask = (fn) => {
    const next = focusChain.catch(() => {}).then(fn);
    focusChain = next;
    return next;
  };
  window.KMA_ACCOUNT = {
    isDemo: false,
    timerStorageKey,
    refreshRanking,
    openAccount,
    openStreak: showStreak,
    sync,
    getRankingSnapshot,
    setRankingParticipation,
    getState: () => ({
      user,
      authenticated,
      queue: queue().length,
      conflicts: conflicts.length,
    }),
    focusStart: (subject, minutes) =>
      focusTask(() => focusStart(subject, minutes)),
    focusPause: () => focusTask(() => focusAction("pause")),
    focusCancel: () => focusTask(() => focusAction("cancel")),
    focusFinish: () => focusTask(() => focusAction("finish")),
  };
  document.addEventListener("DOMContentLoaded", () => setTimeout(init, 0));
})();
