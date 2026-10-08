(function () {
  "use strict";
  const M = window.KMA_STREAK_MODEL;
  let serial = 0;
  function el(tag, cls, text) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined) node.textContent = String(text);
    return node;
  }
  function flame(tier, className = "") {
    const ns = "http://www.w3.org/2000/svg",
      id = "streak-flame-" + ++serial;
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 96 112");
    svg.setAttribute("class", "streak-flame " + className);
    svg.setAttribute("aria-hidden", "true");
    const defs = document.createElementNS(ns, "defs"),
      gradient = document.createElementNS(ns, "linearGradient");
    gradient.id = id;
    gradient.setAttribute("x1", "0");
    gradient.setAttribute("y1", "0");
    gradient.setAttribute("x2", "0.25");
    gradient.setAttribute("y2", "1");
    for (const [offset, color] of [
      ["0%", tier.from],
      ["100%", tier.to],
    ]) {
      const stop = document.createElementNS(ns, "stop");
      stop.setAttribute("offset", offset);
      stop.setAttribute("stop-color", color);
      gradient.append(stop);
    }
    defs.append(gradient);
    svg.append(defs);
    const outer = document.createElementNS(ns, "path");
    outer.setAttribute(
      "d",
      "M53 3C62 24 63 39 57 54C71 47 76 37 75 29C90 44 96 61 93 77C90 96 75 108 49 109C25 109 9 96 6 77C2 59 11 42 26 28C22 43 25 53 33 60C44 48 39 26 53 3Z",
    );
    outer.setAttribute("fill", "url(#" + id + ")");
    const inner = document.createElementNS(ns, "path");
    inner.setAttribute(
      "d",
      "M51 64C54 76 54 82 48 88C56 87 61 81 62 76C72 84 76 91 72 98C67 109 49 111 37 105C23 98 31 81 51 64Z",
    );
    inner.setAttribute("fill", tier.core);
    svg.append(outer, inner);
    return svg;
  }
  function render(logs, options = {}) {
    const data = M.build(logs, options.now),
      root = el("section", "study-streak");
    root.setAttribute("aria-label", "Chuỗi học của bạn");
    const { tier } = data;
    root.dataset.tier = tier.key;
    root.style.setProperty("--streak-accent", tier.to);
    root.style.setProperty("--streak-heat", tier.from);
    const hero = el("div", "streak-hero"),
      art = el("div", "streak-emblem");
    art.append(flame(tier));
    const copy = el("div", "streak-hero-copy");
    const badge = el(
      "span",
      "streak-rank",
      (data.streak ? `Cấp ${M.tiers.indexOf(tier) + 1} · ` : "") + tier.name,
    );
    copy.append(badge);
    const count = el("p", "streak-count");
    count.append(
      el("strong", "", data.streak),
      el("span", "", "ngày liên tiếp"),
    );
    copy.append(
      count,
      el(
        "p",
        "streak-status",
        data.todayDone
          ? "Đã giữ lửa hôm nay"
          : data.streak
            ? "Học thêm hôm nay để giữ chuỗi nhé"
            : "Bắt đầu một buổi học để thắp lửa",
      ),
    );
    hero.append(art, copy);
    root.append(hero);
    const progress = el("div", "streak-progress-card");
    const label = el("div", "streak-progress-label");
    label.append(
      el(
        "strong",
        "",
        data.next
          ? `Còn ${data.next.days - data.streak} ngày tới ${data.next.name.toLocaleLowerCase("vi")}`
          : "Bạn đã đạt mốc lửa tím",
      ),
      el("span", "", data.next ? `${data.streak} / ${data.next.days}` : "7+"),
    );
    const track = el("div", "streak-progress");
    track.setAttribute("role", "progressbar");
    track.setAttribute("aria-label", "Tiến độ tới mốc chuỗi tiếp theo");
    track.setAttribute("aria-valuemin", "0");
    track.setAttribute("aria-valuemax", String(data.next?.days || 7));
    track.setAttribute(
      "aria-valuenow",
      String(Math.min(data.streak, data.next?.days || 7)),
    );
    const fill = el("span");
    fill.style.width = `${Math.round(data.progress * 100)}%`;
    track.append(fill);
    progress.append(label, track);
    root.append(progress);
    const ranks = el("div", "streak-ranks");
    for (const rank of M.tiers) {
      const item = el("div", "streak-tier");
      item.dataset.reached = String(data.streak >= rank.days);
      item.dataset.active = String(rank.key === tier.key);
      item.style.setProperty("--rank-color", rank.to);
      item.title = `${rank.name} · ${rank.days} ngày`;
      item.append(
        flame(rank),
        el("strong", "", rank.days),
        el("span", "", "ngày"),
      );
      if (rank.key === tier.key) {
        const tag = el("span", "streak-tier-current", "Hiện tại");
        item.append(tag);
      }
      ranks.append(item);
    }
    root.append(ranks);
    const stats = el("div", "streak-month-stats");
    for (const [value, caption] of [
      [data.activeDays, "Ngày đã học"],
      [data.best, "Chuỗi tốt nhất tháng"],
      [formatMinutes(data.minutes), "Thời gian tháng này"],
    ]) {
      const item = el("div");
      item.append(el("strong", "", value), el("span", "", caption));
      stats.append(item);
    }
    const calendar = el("div", "streak-calendar"),
      heading = el("div", "streak-calendar-heading");
    heading.append(
      el(
        "h3",
        "",
        "Nhịp học tháng " +
          Number(data.month.slice(5)) +
          "/" +
          data.month.slice(0, 4),
      ),
      el("span", "", "Giờ Việt Nam"),
    );
    const grid = el("div", "streak-calendar-grid");
    for (const label of ["T2", "T3", "T4", "T5", "T6", "T7", "CN"])
      grid.append(el("span", "streak-weekday", label));
    for (let i = 0; i < data.offset; i++) {
      const blank = el("span", "streak-day-blank");
      blank.setAttribute("aria-hidden", "true");
      grid.append(blank);
    }
    const detail = el("div", "streak-day-detail");
    detail.setAttribute("aria-live", "polite");
    const showDay = (day) => {
      grid
        .querySelectorAll(".streak-day")
        .forEach((cell) =>
          cell.setAttribute(
            "aria-pressed",
            String(cell.dataset.date === day.key),
          ),
        );
      detail.replaceChildren(
        el(
          "strong",
          "streak-detail-date",
          day.key.split("-").reverse().join("/") +
            " · " +
            formatMinutes(day.minutes),
        ),
      );
      for (const subject of day.subjects) {
        const row = el("div", "streak-detail-row"),
          dot = el("i", "streak-subject-dot");
        dot.style.background = subject.color;
        row.append(
          dot,
          el("span", "", subject.name),
          el("strong", "", formatMinutes(subject.minutes)),
        );
        detail.append(row);
      }
      if (!day.minutes)
        detail.append(
          el(
            "p",
            "",
            day.future ? "Chưa tới ngày học." : "Chưa ghi nhận thời gian học.",
          ),
        );
      for (const exam of day.exams) {
        const row = el("div", "streak-exam-detail");
        const color = M.subjects.find((s) => s.key === exam.subjectKey).color;
        row.style.setProperty("--subject-color", color);
        row.append(
          el("strong", "", "◇ Thi " + exam.name),
          el("span", "", exam.timeStr + " · " + exam.duration),
        );
        detail.append(row);
      }
    };
    for (const day of data.days) {
      const cell = el("button", "streak-day", day.day);
      cell.type = "button";
      cell.dataset.date = day.key;
      cell.dataset.level = day.level;
      cell.dataset.future = String(day.future);
      cell.setAttribute("aria-pressed", "false");
      const dominant = [...day.subjects].sort(
        (a, b) => b.minutes - a.minutes,
      )[0];
      if (dominant) {
        cell.style.setProperty("--subject-color", dominant.color);
        const bars = el("span", "streak-day-subjects");
        bars.setAttribute("aria-hidden", "true");
        for (const subject of day.subjects) {
          const bar = el("i");
          bar.style.background = subject.color;
          bar.style.flexGrow = subject.minutes;
          bars.append(bar);
        }
        cell.append(bars);
      }
      if (day.exams.length) {
        cell.dataset.exam = "true";
        const marker = el("span", "streak-exam-marker", "◇");
        marker.setAttribute("aria-hidden", "true");
        cell.append(marker);
      }
      const label =
        day.key.split("-").reverse().join("/") +
        " · " +
        (day.future
          ? "Chưa tới ngày"
          : day.minutes
            ? formatMinutes(day.minutes) + " đã học"
            : "Chưa ghi nhận thời gian học") +
        (day.subjects.length
          ? " · " +
            day.subjects
              .map((s) => s.name + ": " + formatMinutes(s.minutes))
              .join(", ")
          : "") +
        (day.exams.length
          ? " · Thi: " +
            day.exams.map((e) => e.name + " (" + e.timeStr + ")").join(", ")
          : "");
      cell.setAttribute("aria-label", label);
      cell.title = label;
      if (day.today) {
        cell.dataset.today = "true";
        cell.setAttribute("aria-current", "date");
      }
      cell.addEventListener("click", () => showDay(day));
      grid.append(cell);
    }
    const legend = el("div", "streak-legend");
    for (const subject of M.subjects) {
      const chip = el("span", "streak-subject-key"),
        dot = el("i", "streak-subject-dot");
      dot.style.background = subject.color;
      chip.append(
        dot,
        el(
          "span",
          "",
          subject.key === "other"
            ? "Tự học"
            : window.KMA_STUDY_SCHEDULE.exams.find(
                (e) => e.subjectKey === subject.key,
              )?.shortName || subject.name,
        ),
      );
      legend.append(chip);
    }
    calendar.append(
      heading,
      grid,
      legend,
      el(
        "p",
        "streak-calendar-hint",
        "Đậm hơn = học nhiều hơn · Dải màu chia thời gian theo môn · ◇ Ngày thi",
      ),
      detail,
    );
    showDay(
      data.days.find((d) => d.key === options.selectedDay) ||
        data.days.find((d) => d.today),
    );
    root.append(stats, calendar);
    root.append(
      el(
        "p",
        "streak-rule",
        "Mỗi ngày có từ 1 phút trong lịch sử học được tính vào chuỗi. Nếu hôm nay chưa học, chuỗi của hôm qua vẫn được giữ tới hết ngày. Chuỗi là thông tin riêng trong tài khoản; bảng nhiệt chỉ hiện tháng này.",
      ),
    );
    if (options.demo)
      root.append(el("p", "streak-demo-label", "BẢN THỬ · DỮ LIỆU MẪU"));
    return root;
  }
  function formatMinutes(minutes) {
    const hours = Math.floor(minutes / 60),
      rest = minutes % 60;
    return hours
      ? `${hours}h${rest ? " " + rest + "p" : ""}`
      : `${minutes} phút`;
  }
  window.KMA_STREAK = Object.freeze({ render, flame });
})();
