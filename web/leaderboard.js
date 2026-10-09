(function () {
  "use strict";
  const L = window.KMA_LEADERBOARD_MODEL;
  const subjects = {
    all: "Tất cả môn",
    ktvxl: "Vi xử lý",
    tthcm: "Tư tưởng Hồ Chí Minh",
    vldc: "Vật lý đại cương",
    xstk: "Xác suất thống kê",
    gdtc: "Giáo dục thể chất",
    other: "Tự học / môn khác",
  };
  let dialog,
    podium,
    listTitle,
    list,
    personal,
    caption,
    teaser,
    lastTrigger,
    periods,
    select,
    demoButton,
    demoChip;
  let period = "week",
    subject = "all",
    completing = false;
  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  };
  const button = (text, cls, fn) => {
    const n = el("button", cls, text);
    n.type = "button";
    if (fn) n.addEventListener("click", fn);
    return n;
  };
  const localPreview = {
    isDemo: false,
    getState: () => ({ user: null, authenticated: false }),
    getRankingSnapshot: () => ({
      remote: true, localOnly: true, rows: [], me: null,
    }),
    openAccount: () => location.assign("https://taanhitaland-ai.github.io/KTVXL/"),
  };
  const api = () => window.KMA_ACCOUNT || window.KMA_SYNC_PREVIEW || localPreview;
  function current() {
    return L.build(
      api().getRankingSnapshot(period, subject),
      period,
      subject,
      Date.now(),
    );
  }
  function signIn() {
    dialog.close();
    api().openAccount();
  }
  function open(trigger) {
    lastTrigger =
      trigger instanceof HTMLElement
        ? trigger
        : document.getElementById("leaderboard-trigger");
    render();
    if (!dialog.open) dialog.showModal();
  }
  const initial = (name) =>
    Array.from(name.trim().normalize("NFC"))[0]?.toLocaleUpperCase("vi") || "?";
  const accents = [
    "#FFD400",
    "#FF8A3D",
    "#FF5C9A",
    "#2FBF71",
    "#3D8BFF",
    "#8B5CF6",
  ];
  function avatarColor(name) {
    let hash = 0;
    for (const character of name.normalize("NFC"))
      hash = (Math.imul(hash, 31) + character.codePointAt(0)) >>> 0;
    return accents[hash % accents.length];
  }
  function crown() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 40 32");
    svg.setAttribute("aria-hidden", "true");
    svg.classList.add("lb-crown");
    const path = document.createElementNS(svg.namespaceURI, "path");
    path.setAttribute("d", "M5 9l8 7L20 4l7 12 8-7-4 18H9L5 9z M10 27h20");
    path.setAttribute("fill", "#FFD400");
    path.setAttribute("stroke", "#111");
    path.setAttribute("stroke-width", "2.5");
    path.setAttribute("stroke-linejoin", "round");
    svg.append(path);
    return svg;
  }
  function row(member, bestMinutes) {
    const item = el("li", "lb-row");
    item.dataset.member = member.id;
    if (member.id === api().getState().user) item.classList.add("lb-is-me");
    const rank = el("span", "lb-rank", String(member.rank));
    rank.setAttribute("aria-label", "Hạng " + member.rank);
    const avatar = el("span", "lb-avatar", initial(member.nickname));
    avatar.setAttribute("aria-hidden", "true");
    avatar.style.setProperty("--avatar-color", avatarColor(member.nickname));
    const identity = el("div", "lb-identity");
    identity.append(el("strong", "", member.nickname));
    if (member.id === api().getState().user)
      identity.append(el("span", "lb-you", "Bạn"));
    const score = el("div", "lb-score");
    score.append(
      el("strong", "", L.formatMinutes(member.minutes)),
      el("span", "", member.sessions + " phiên"),
    );
    const progress = el("div", "lb-progress");
    progress.setAttribute("aria-hidden", "true");
    const fill = el("span", "");
    fill.style.width =
      Math.max(0, Math.min(100, (member.minutes / bestMinutes) * 100)) + "%";
    fill.style.background = avatarColor(member.nickname);
    progress.append(fill);
    identity.append(progress);
    item.append(rank, avatar, identity, score);
    return item;
  }
  let lastRanking = "";
  function render() {
    if (!dialog) return;
    const data = current();
    const signature = JSON.stringify([data, period, subject, completing]);
    if (signature === lastRanking) return;
    lastRanking = signature;
    podium.replaceChildren();
    list.replaceChildren();
    personal.replaceChildren();
    caption.textContent = "Giờ Việt Nam";
    const isDemo = api().isDemo !== false;
    demoChip.hidden = !isDemo;
    demoButton.parentElement.hidden =
      !isDemo || typeof api().completeDemoFocus !== "function";
    periods
      .querySelectorAll("button")
      .forEach((btn) =>
        btn.setAttribute("aria-pressed", String(btn.dataset.period === period)),
      );
    podium.hidden = !data.rows.length;
    for (const index of [1, 0, 2]) {
      const member = data.rows[index],
        card = el("div", "lb-podium-card");
      card.dataset.place = String(index + 1);
      if (!member) {
        card.classList.add("lb-podium-empty");
        card.append(el("span", "", "Chưa có ai"));
        podium.append(card);
        continue;
      }
      card.dataset.member = member.id;
      if (index === 0) card.append(crown());
      const avatar = el("span", "lb-podium-avatar", initial(member.nickname));
      avatar.style.setProperty("--avatar-color", avatarColor(member.nickname));
      card.append(
        el("span", "lb-podium-rank", "#" + member.rank),
        avatar,
        el("strong", "lb-podium-name", member.nickname),
        el("span", "lb-podium-time", L.formatMinutes(member.minutes)),
      );
      podium.append(card);
    }
    const bestMinutes = data.rows[0]?.minutes || 60;
    const listRows = data.rows.slice(3, 10);
    listRows.forEach((member) => list.append(row(member, bestMinutes)));
    if (listTitle) listTitle.hidden = !listRows.length;
    list.hidden = data.rows.length > 0 && !listRows.length;
    if (!data.rows.length) {
      if (listTitle) listTitle.hidden = true;
      list.append(
        el(
          "li",
          "lb-empty",
          data.localOnly
            ? "Bảng xếp hạng thật chỉ hiển thị trên trang chính."
            : data.loading
              ? "Đang tải bảng xếp hạng…"
              : data.failed
                ? "Chưa tải được dữ liệu. Hãy bấm làm mới."
                : "Chưa có phiên học trong khoảng thời gian này.",
        ),
      );
    }
    if (!data.me) {
      const copy = el("div", "lb-personal-copy");
      copy.append(
        el("strong", "", data.localOnly
          ? "Bản thử trên máy" : "Đăng nhập để có tên trên bảng"),
        el("p", "", data.localOnly
          ? "Tiến trình học thử chỉ lưu trong trình duyệt này."
          : "Hạng của bạn sẽ hiện ở đây."),
      );
      personal.append(
        copy,
        button(data.localOnly ? "Mở trang chính" : "Đăng nhập Google",
          "sync-btn sync-primary", signIn),
      );
    } else {
      const rank = el(
        "strong",
        "lb-personal-rank",
        data.me.rank ? "#" + data.me.rank : "—",
      );
      rank.setAttribute(
        "aria-label",
        data.me.rank ? "Hạng của bạn: " + data.me.rank : "Bạn chưa có hạng",
      );
      const avatar = el("span", "lb-avatar", initial(data.me.nickname));
      avatar.setAttribute("aria-hidden", "true");
      avatar.style.setProperty("--avatar-color", avatarColor(data.me.nickname));
      const copy = el("div", "lb-personal-copy");
      copy.append(
        el("strong", "", "Bạn"),
        el("p", "", "DÒNG CỦA BẠN · " + data.me.sessions + " phiên"),
      );
      personal.append(
        rank,
        avatar,
        copy,
        el("strong", "lb-personal-time", L.formatMinutes(data.me.minutes)),
      );
    }
    personal.classList.toggle("lb-personal-signed-in", !!data.me);
    demoButton.disabled = !data.me || completing;
    demoButton.textContent = completing
      ? "Đang ghi nhận…"
      : "Thử hoàn thành phiên 25 phút";
    if (teaser) {
      const top = L.build(
        api().getRankingSnapshot("today", "all"),
        "today",
        "all",
        Date.now(),
      ).rows[0];
      teaser.textContent = top
        ? top.nickname + " · " + L.formatMinutes(top.minutes) + " hôm nay"
        : "Bắt đầu một phiên để giữ nhịp học.";
    }
  }
  async function completeDemo() {
    if (!api().getState().user || completing) return;
    completing = true;
    render();
    await new Promise((resolve) => setTimeout(resolve, 450));
    api().completeDemoFocus(subject === "all" ? "ktvxl" : subject);
    completing = false;
    render();
  }
  function init() {
    if (!api()) return;
    dialog = el("dialog", "lb-dialog");
    dialog.id = "leaderboard-dialog";
    dialog.setAttribute("aria-labelledby", "lb-title");
    const top = el("div", "lb-top"),
      hero = el("div", "lb-hero"),
      lead = el("div", "lb-hero-copy");
    lead.append(el("h2", "", "Bảng xếp hạng tập trung"));
    lead.querySelector("h2").id = "lb-title";
    demoChip = el("span", "lb-eyebrow", "DỮ LIỆU MẪU");
    lead.append(demoChip);
    const close = button("✕", "lb-close", () => dialog.close());
    close.setAttribute("aria-label", "Đóng bảng xếp hạng");
    hero.append(lead, close);
    top.append(hero);
    const main = el("div", "lb-body"),
      filters = el("div", "lb-filters");
    periods = el("div", "lb-periods");
    periods.setAttribute("role", "group");
    periods.setAttribute("aria-label", "Khoảng thời gian");
    for (const [id, label] of [
      ["today", "Hôm nay"],
      ["week", "Tuần này"],
      ["month", "Tháng này"],
    ]) {
      const b = button(label, "lb-period", () => {
        period = id;
        render();
      });
      b.dataset.period = id;
      periods.append(b);
    }
    const label = el("label", "lb-subject-label");
    label.htmlFor = "lb-subject";
    const labelText = el("span", "lb-sr-only", "Môn học");
    label.append(labelText);
    select = el("select", "lb-subject");
    select.id = "lb-subject";
    for (const [id, name] of Object.entries(subjects)) {
      const option = el("option", "", name);
      option.value = id;
      select.append(option);
    }
    select.addEventListener("change", () => {
      subject = select.value;
      render();
    });
    const selectWrap = el("span", "lb-select-wrap");
    const arrow = el("span", "lb-select-arrow");
    const chevron = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg",
    );
    chevron.setAttribute("viewBox", "0 0 16 16");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M4 6l4 4 4-4");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "currentColor");
    path.setAttribute("stroke-width", "2");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    chevron.append(path);
    arrow.append(chevron);
    arrow.setAttribute("aria-hidden", "true");
    selectWrap.append(select, arrow);
    label.append(selectWrap);
    filters.append(periods, label);
    caption = el("p", "lb-caption");
    podium = el("div", "lb-podium");
    listTitle = el("div", "lb-list-title", "🎖️ Hạng 4 — 10 Bảng Xếp Hạng");
    list = el("ol", "lb-list");
    list.setAttribute("aria-label", "Thứ hạng người học");
    personal = el("div", "lb-personal");
    const rules = el("details", "lb-rules");
    rules.append(
      el("summary", "", "Cách tính xếp hạng"),
      el(
        "p",
        "",
        "Tự động tính số phút tập trung thực tế khi bạn kết thúc hoặc dừng phiên Pomodoro, kể cả kết thúc sớm. Không tính giờ nghỉ và phút cộng thủ công. Người có cùng số phút giữ cùng thứ hạng.",
      ),
    );
    const demo = el("div", "lb-demo-controls");
    demoButton = button(
      "Thử hoàn thành phiên 25 phút",
      "lb-demo-button",
      completeDemo,
    );
    demoButton.id = "lb-demo-complete";
    demo.append(
      el("span", "", "Dữ liệu mẫu · nút dưới đây chỉ dùng để thử preview"),
      demoButton,
    );
    const filterBar = el("div", "lb-filter-bar");
    filterBar.append(filters);
    top.append(filterBar);
    main.append(caption, podium, listTitle, list, rules, demo);
    dialog.append(top, main, personal);
    document.body.append(dialog);
    dialog.addEventListener("close", () =>
      (lastTrigger?.getClientRects().length && !lastTrigger.closest('[inert]') ? lastTrigger : document.getElementById('study-tools-toggle'))?.focus({ preventScroll: true }),
    );
    dialog.addEventListener("click", (event) => {
      if (event.target !== dialog) return;
      const b = dialog.getBoundingClientRect();
      if (
        event.clientX < b.left ||
        event.clientX > b.right ||
        event.clientY < b.top ||
        event.clientY > b.bottom
      )
        dialog.close();
    });
    let trigger = document.getElementById("leaderboard-trigger");
    if (!trigger) {
      trigger = button("🏆 Xếp hạng", "lb-trigger neo-floating-leaderboard-trigger", (event) =>
        open(event.currentTarget),
      );
      trigger.id = "leaderboard-trigger";
      document.body.append(trigger);
    } else {
      trigger.classList.add("lb-trigger");
      trigger.addEventListener("click", (event) => open(event.currentTarget));
    }
    trigger.setAttribute("aria-haspopup", "dialog");
    trigger.setAttribute("aria-controls", "leaderboard-dialog");
    const promo = el("section", "lb-promo");
    promo.setAttribute("aria-label", "Bảng xếp hạng Pomodoro");
    const copy = el("div", "lb-promo-copy");
    copy.append(el("strong", "", "🏆 Cùng nhau giữ nhịp học"));
    teaser = el("p", "");
    copy.append(teaser);
    promo.append(
      copy,
      button("Xem bảng xếp hạng", "sync-btn sync-primary", (event) =>
        open(event.currentTarget),
      ),
    );
    document.querySelector("#tab-schedule .schedule-hero").after(promo);
    render();
    if (new URLSearchParams(location.search).get("panel") === "leaderboard")
      open(trigger);
  }
  const refreshVisible = () => {
    if (dialog?.open) render();
  };
  window.addEventListener("kma:cloud-updated", refreshVisible);
  window.addEventListener("kma:ranking-updated", refreshVisible);
  window.KMA_LEADERBOARD_PREVIEW = { open, refresh: render };
  document.addEventListener("DOMContentLoaded", () => setTimeout(init, 0));
})();
