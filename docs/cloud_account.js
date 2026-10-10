(function () {
  "use strict";
  const M = window.KMA_SYNC_MODEL,
    P = window.KMA_ACCOUNT_POLICY,
    config = window.KMA_CLOUD_CONFIG;
  if (!M || !P || !config || !window.supabase) return;
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
  // Separate simulated accounts so opening another demo cannot reload this page.
  // Real accounts keep their existing storage namespace.
  const previewNamespace = config.url === "https://fixture.invalid" &&
    ["localhost", "127.0.0.1"].includes(location.hostname) &&
    /^kma_preview_[a-z_-]+:$/.test(config.storageNamespace || "");
  const ns = previewNamespace ? config.storageNamespace : "kma_cloud_v1:",
    ownerKey = ns + "owner";
  const nativeGet = Storage.prototype.getItem,
    nativeSet = Storage.prototype.setItem,
    nativeRemove = Storage.prototype.removeItem;
  const get = (key) => nativeGet.call(localStorage, key),
    set = (key, value) => nativeSet.call(localStorage, key, String(value)),
    remove = (key) => nativeRemove.call(localStorage, key);
  let user = /^[0-9a-f-]{36}$/.test(get(ownerKey) || "") ? get(ownerKey) : null;
  let authenticated = false,
    activityToken = null,
    authResolved = false,
    profileReady = false,
    profileRevision = 0,
    answerRequested = false,
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
  let historySource = null, historyJSON = "{}";
  function confirmedHistory() {
    if (historySource !== remote) {
      historySource = remote;
      historyJSON = M.project(remote, []).kma_study_logs_v1;
    }
    return historyJSON;
  }
  function queue() {
    if (!user) return [];
    const result = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key.startsWith(outboxPrefix())) continue;
      const op = M.parse(get(key), null);
      if (op && op.opId && op.rid && op.kind !== "study") result.push(op);
    }
    return result.sort(
      (a, b) => a.createdAt - b.createdAt || a.opId.localeCompare(b.opId),
    );
  }
  function records(prefix = bucket()) {
    const all = {};
    for (const key of M.keys) {
      if (key === "kma_study_logs_v1") continue;
      Object.assign(all, M.flatten(key, get(prefix + key)));
    }
    if (user && prefix === bucket()) Object.assign(all, M.flatten("kma_study_logs_v1", confirmedHistory()));
    return all;
  }
  function addOperations(operations) {
    operations = operations.filter(op => op.kind !== "study");
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
    if (user && appKey(key) && key !== "kma_study_logs_v1")
      addOperations(M.diff(key, before, after, versions));
  }
  // Preserve the existing app's storage schemas. Only synced keys become account-scoped;
  // guest data keeps its original keys, and theme/music/preferences remain on this device.
  Storage.prototype.getItem = function (key) {
    if (this === localStorage && key === "kma_study_logs_v1") return confirmedHistory();
    return this === localStorage && appKey(key)
      ? get(bucket() + key)
      : nativeGet.call(this, key);
  };
  Storage.prototype.setItem = function (key, value) {
    if (this !== localStorage || !appKey(key))
      return nativeSet.call(this, key, value);
    if (key === "kma_study_logs_v1") return;
    const previous = get(bucket() + key);
    set(bucket() + key, value);
    capture(key, previous, String(value));
    if (key === "kma_study_logs_v1") renderStreakTrigger();
  };
  Storage.prototype.removeItem = function (key) {
    if (this !== localStorage || !appKey(key))
      return nativeRemove.call(this, key);
    if (key === "kma_study_logs_v1") return;
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
    const syncingProfileRevision = profileRevision;
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
      if (result.profile && syncingProfileRevision === profileRevision) {
        profile = result.profile;
        profileReady = true;
      }
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
      reconcileAccess();
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
  function accessState() {
    return P.accessState({ authResolved, authenticated, user, profileReady, nickname: profile.nickname });
  }
  function requireLearningAccount() {
    if (accessState() === "ready") return true;
    answerRequested = true;
    if (ready) openAccount();
    return false;
  }
  function reconcileAccess() {
    if (!ready) return;
    if (accessState() === "username") {
      // Never rebuild an in-progress name form during a background sync.
      if (dialog.dataset.view !== "username") showUsername();
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open && dialog.dataset.view === "checking") {
      if (accessState() === "guest") showWelcome();
      else if (accessState() === "ready") dialog.close();
    } else if (dialog.open && dialog.dataset.view === "username" && accessState() === "ready" &&
               !modalBody.querySelector('[aria-busy="true"]')) {
      // Another device may have supplied the missing name while this form was open.
      dialog.close();
      offerImport();
    }
  }
  function showCheckingAccount() {
    dialog.dataset.view = "checking";
    heading("TÀI KHOẢN CỦA BẠN", "Đang kiểm tra tài khoản", "Vui lòng chờ xác nhận đăng nhập và tên của bạn trước khi chọn đáp án.");
    const status = el("p", "sync-info", error ? "Chưa tải được tài khoản. Tiến trình đã lưu vẫn được giữ nguyên." : "Đang tải thông tin tài khoản…");
    status.setAttribute("role", "status");
    const retry = button("Thử lại", "sync-btn", async () => {
      retry.disabled = true;
      try {
        const { data, error: failure } = await client.auth.getSession();
        if (failure) throw failure;
        await resumeAuth(data.session);
        if (accessState() === "checking") throw new Error();
      } catch (_) {
        status.textContent = "Chưa tải được tài khoản. Hãy thử lại khi kết nối ổn định.";
      } finally { retry.disabled = false; }
    });
    modalBody.append(status, retry);
  }
  function openAccount() {
    if (accessState() === "checking") showCheckingAccount();
    else if (accessState() === "username") showUsername();
    else if (conflicts.length) showConflicts();
    else if (user) showProfile();
    else showWelcome();
    if (!dialog.open) dialog.showModal();
  }
  function showWelcome() {
    dialog.dataset.view = "welcome";
    heading(
      "MỘT TÀI KHOẢN · MỌI THIẾT BỊ",
      answerRequested ? "Đăng nhập để bảo vệ tiến trình" : "Góc học đi cùng bạn",
      "Đăng nhập Google để chọn đáp án và lưu tiến trình theo tài khoản trên máy tính hoặc điện thoại.",
    );
    const list = el("ul", "sync-benefits");
    for (const text of [
      "Câu đã làm và câu gắn sao theo tài khoản",
      "Ghi chú đủ màu, giữ nguyên trên thiết bị khác",
      "Lịch sử học, chuỗi học và bảng xếp hạng",
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
    modalBody.append(login);
    const footer = el("div", "sync-welcome-footer");
    footer.append(button("Để sau", "sync-text-button", () => dialog.close()));
    const privacy = el(
      "a",
      "sync-text-button sync-privacy-link",
      "Quyền riêng tư và dữ liệu học tập",
    );
    privacy.href = "privacy.html";
    privacy.target = "_blank";
    privacy.rel = "noopener";
    footer.append(privacy);
    modalBody.append(footer);
  }
  async function saveNickname(value) {
    const validation = P.nicknameError(value);
    if (validation) throw new Error(validation);
    const savingUser = user;
    const saved = await rpc("study_set_profile", {
      p_nickname: P.normalizeNickname(value), p_joined: true,
    });
    if (savingUser !== user || !authenticated) throw new Error("Tài khoản đã thay đổi. Hãy đăng nhập lại.");
    if (P.nicknameError(saved?.nickname)) throw new Error("Chưa xác nhận được tên đã lưu. Hãy thử lại.");
    profileRevision++;
    profile = saved;
    profileReady = true;
    rankingCache.clear();
    refreshRanking();
    renderStatus();
    window.dispatchEvent(new CustomEvent("kma:cloud-updated"));
  }
  function signOut() {
    const activity = window.KMA_STUDY_ACTIVITY?.getState();
    if (activity?.started) window.KMA_STUDY_ACTIVITY.stop();
    return client.auth.signOut({ scope: "local" });
  }
  function showUsername() {
    dialog.dataset.view = "username";
    heading("MỘT TÊN RIÊNG · CÙNG NHAU HỌC", "Chọn tên của bạn", "Chọn một biệt danh để mọi người nhận ra bạn trên bảng xếp hạng.");
    const form = el("form", "sync-profile-form sync-username-form");
    form.noValidate = true;
    const label = el("label", "", "Tên trên bảng xếp hạng");
    label.htmlFor = "sync-username";
    const input = el("input", "sync-input");
    input.id = "sync-username";
    input.name = "nickname";
    input.autocomplete = "nickname";
    input.maxLength = 32;
    input.required = true;
    input.placeholder = "Ví dụ: Linh chăm học";
    input.setAttribute("aria-describedby", "sync-username-hint sync-username-error");
    const hint = el("p", "sync-info", "2–32 ký tự. Dùng chữ, số, dấu cách, dấu chấm, gạch ngang hoặc gạch dưới.");
    hint.id = "sync-username-hint";
    const feedback = el("p", "sync-form-error");
    feedback.id = "sync-username-error";
    feedback.setAttribute("role", "alert");
    const save = button("Lưu tên và tiếp tục", "sync-btn sync-primary");
    save.type = "submit";
    save.disabled = true;
    let saving = false;
    const validate = () => {
      const problem = P.nicknameError(input.value);
      save.disabled = saving || !!problem;
      feedback.textContent = input.value ? problem : "";
      input.setAttribute("aria-invalid", String(!!input.value && !!problem));
    };
    input.addEventListener("input", validate);
    form.addEventListener("submit", async event => {
      event.preventDefault();
      if (saving) return;
      validate();
      if (save.disabled) { input.focus(); return; }
      saving = true;
      save.disabled = true;
      input.readOnly = true;
      form.setAttribute("aria-busy", "true");
      try {
        await saveNickname(input.value);
        dialog.close();
        notify("Đã lưu tên của bạn");
        await offerImport();
      } catch (failure) {
        feedback.textContent = failure?.message || "Chưa lưu được tên. Hãy thử lại.";
      } finally {
        saving = false;
        input.readOnly = false;
        form.removeAttribute("aria-busy");
        save.disabled = !!P.nicknameError(input.value);
      }
    });
    form.append(label, input, hint, feedback, el("p", "sync-info", "Có phút học tự động là bạn tự động có tên trên bảng. Tiến trình và ghi chú vẫn riêng tư."), save);
    const logout = button("Đăng xuất", "sync-text-button sync-sign-out", async () => {
      if (saving) return;
      logout.disabled = true;
      const { error: failure } = await signOut();
      if (failure) { logout.disabled = false; feedback.textContent = "Chưa đăng xuất được. Hãy thử lại."; }
    });
    modalBody.append(form, logout);
    // showModal must run before focusing an element inside the dialog.
    requestAnimationFrame(() => { if (dialog.open && dialog.dataset.view === "username") input.focus(); });
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
    dialog.dataset.view = "profile";
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
    input.setAttribute("aria-describedby", "sync-profile-error");
    const feedback = el("p", "sync-form-error");
    feedback.id = "sync-profile-error";
    feedback.setAttribute("role", "alert");
    const save = button("Lưu hồ sơ", "sync-btn sync-secondary");
    save.type = "submit";
    save.disabled = true;
    const changed = () => {
      const problem = P.nicknameError(input.value);
      save.disabled = !!problem || P.normalizeNickname(input.value) === profile.nickname;
      feedback.textContent = problem;
      input.setAttribute("aria-invalid", String(!!problem));
    };
    input.addEventListener("input", changed);
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      changed();
      if (save.disabled) return;
      save.disabled = true;
      input.readOnly = true;
      try {
        await saveNickname(input.value);
        input.value = profile.nickname;
        notify("Đã lưu hồ sơ");
      } catch (_) {
        feedback.textContent = "Chưa lưu được hồ sơ. Hãy thử lại.";
      } finally {
        input.readOnly = false;
        save.disabled = !!P.nicknameError(input.value) || P.normalizeNickname(input.value) === profile.nickname;
      }
    });
    form.append(
      label,
      input,
      feedback,
      el(
        "p",
        "sync-info",
        (window.KMA_GARDEN_PREVIEW || config.gardenEnabled) ? "Có thời gian học là bạn có tên trên BXH. Biệt danh, thời gian học, bộ sưu tập và giá trị được công khai; tiến trình và ghi chú vẫn riêng tư." : "Có thời gian học tự động là bạn tự động có tên trên bảng xếp hạng. Chỉ biệt danh và thời gian học được công khai; tiến trình và ghi chú vẫn riêng tư.",
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
        const { error: failure } = await signOut();
        if (failure) notify("Chưa đăng xuất được. Hãy thử lại.");
      }),
    );
    modalBody.append(actions);
    window.dispatchEvent(new CustomEvent("kma:profile-rendered", {detail:{container:modalBody}}));
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
    if (accessState() !== "ready" || get(ns + user + ":guest-decision")) return;
    const guest = records(""),
      counts = M.counts(guest);
    if (!Object.values(counts).some(Boolean)) {
      set(ns + user + ":guest-decision", "skip");
      return;
    }
    dialog.dataset.view = "import";
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
    dialog.dataset.view = "conflicts";
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
          notify("Chưa tải được bảng xếp hạng. Thử mở lại khi kết nối ổn định.");
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
  let activitySequence = 0;
  async function activityPulse({ clientId, subject, idleSeconds, claim, stop }) {
    if (accessState() !== "ready") throw new Error("Learning account required");
    const data = await rpc("study_activity_pulse", {
      p_client: clientId,
      p_subject: subject,
      p_idle_seconds: idleSeconds,
      p_sequence: ++activitySequence,
      p_claim: claim,
      p_stop: stop,
    });
    if (data?.credited) {
      scheduleSync();
      refreshRanking();
    }
    return data;
  }
  function activityLeave(clientId, subject) {
    if (!activityToken || accessState() !== "ready") return;
    // Keep the final stop request alive when navigating away. Credentials stay in memory.
    fetch(config.url + "/rest/v1/rpc/study_activity_pulse", {
      method: "POST", keepalive: true,
      headers: { apikey: config.publishableKey, Authorization: "Bearer " + activityToken, "Content-Type": "application/json" },
      body: JSON.stringify({ p_client: clientId, p_subject: subject, p_idle_seconds: 900, p_sequence: ++activitySequence, p_claim: false, p_stop: true }),
    }).catch(() => {});
  }
  async function resumeAuth(session) {
    // Supabase anonymous sessions do not satisfy the Google account requirement.
    const next = session?.user?.is_anonymous ? null : session?.user?.id || null;
    authResolved = true;
    authenticated = !!next;
    activityToken = authenticated ? session.access_token || null : null;
    if (next !== user) {
      if (next) set(ownerKey, next);
      else remove(ownerKey);
      location.reload();
      return;
    }
    if (!next) {
      profileReady = false;
      renderStatus();
      reconcileAccess();
      return;
    }
    await sync();
    if (!profileReady) return;
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
    const headerGroup = document.querySelector(".header-utility-group") || document.querySelector(".stats-bar");
    if (headerGroup) {
      headerGroup.prepend(streakButton);
      headerGroup.append(authButton);
    }
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
    dialog.addEventListener("cancel", event => {
      if (accessState() === "username") event.preventDefault();
    });
    dialog.addEventListener("click", (e) => {
      if (e.target !== dialog) return;
      if (accessState() === "username") return;
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
      el("strong", "", "Đăng nhập để bảo vệ tiến trình"),
      el("p", "", "Chọn đáp án sau khi đăng nhập. Tiến trình được lưu theo tài khoản trên mọi thiết bị."),
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
    if (answerRequested) openAccount();
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
      activityToken = session?.user?.is_anonymous ? null : session?.access_token || null;
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
    activityPulse,
    activityLeave,
    refreshRanking,
    gardenRequest: (action, args = {}) => {
      const names = {snapshot:"study_garden_snapshot",plant:"study_garden_plant",harvest:"study_garden_harvest",layout:"study_garden_layout",public:"study_garden_public"};
      if (!names[action]) return Promise.reject(new Error("Thao tác vườn không hợp lệ."));
      return rpc(names[action], args);
    },
    openAccount,
    requireLearningAccount,
    getLearningAccess: accessState, // Hot path: no scan of the sync outbox.
    getLearningIdentity: () => ({ user, access: accessState() }),
    getConfirmedStudyLogs: () => M.parse(confirmedHistory(), {}),
    openStreak: showStreak,
    sync,
    getRankingSnapshot,
    setRankingParticipation,
    getState: () => ({
      user,
      authenticated,
      access: accessState(),
      nickname: profile.nickname,
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
