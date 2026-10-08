// Isolated mock account: no Google login or live database request. Serve repo on port 8765.
async (page) => {
  const context = await page
      .context()
      .browser()
      .newContext({ viewport: { width: 1440, height: 1050 } }),
    tab = await context.newPage();
  const errors = [],
    external = [];
  tab.on("pageerror", (e) => errors.push(e.message));
  tab.on("request", (r) => {
    if (r.url().includes("supabase.co") || r.url().includes("accounts.google"))
      external.push(r.url());
  });
  tab.on("dialog", (d) => d.accept());
  const assert = (value, message) => {
    if (!value) throw Error(message);
  };
  const openPlanner = async () => {
    if (!await tab.locator("#side-planner-drawer").evaluate(e => e.classList.contains("open")))
      await tab.locator("#btn-floating-planner").click();
  };
  const closePlanner = async () => {
    if (await tab.locator("#side-planner-drawer").evaluate(e => e.classList.contains("open")))
      await tab.locator("#btn-close-side-drawer").click();
  };
  try {
    // Keep this one-day scenario away from midnight in Vietnam.
    await context.addInitScript(() => {
      const noon = Date.parse(new Date().toISOString().slice(0, 10) + "T05:00:00Z");
      Date.now = () => noon;
    });
    const fixture = await context.request.get(
      "http://127.0.0.1:8765/scripts/fixtures/focus_cloud.js",
    );
    assert(fixture.ok(), "Missing focus fixture");
    const fixtureBody = await fixture.text();
    await context.route("**/cloud_config.js*", (route) =>
      route.fulfill({
        contentType: "text/javascript",
        body: 'window.KMA_CLOUD_CONFIG={url:"https://fixture.invalid",publishableKey:"fixture-only"};',
      }),
    );
    await context.route("**/vendor/supabase/supabase.js*", (route) =>
      route.fulfill({ contentType: "text/javascript", body: fixtureBody }),
    );
    await tab.goto("http://127.0.0.1:8765/web/index.html");
    await tab.waitForFunction(
      () =>
        window.KMA_ACCOUNT?.getState().authenticated &&
        window.KMA_ACCOUNT.getState().queue === 0,
    );
    assert(await tab.locator("#sync-status-button").count() === 0, "Old sync status trigger still shown");
    assert(await tab.locator("#study-streak-trigger").isHidden(), "Empty streak takes space");
    await tab.locator("#sync-account-button").click();
    assert(
      (await tab.locator("#sync-share-ranking").count()) === 0,
      "Opt-in checkbox still shown",
    );
    assert(
      (await tab.locator("#sync-account-dialog").innerText()).includes(
        "tự động có tên",
      ),
      "Automatic participation missing",
    );
    assert(await tab.locator("#sync-account-dialog .study-streak, #sync-account-dialog .streak-account-link").count() === 0, "Streak still mounted inside account");
    await tab
      .getByRole("button", { name: "Đóng tài khoản", exact: true })
      .click();
    await openPlanner();
    await openPlanner();
    await tab.locator("#drawer-input-custom-pomodoro").fill("60");
    await tab.locator("#drawer-btn-apply-custom-pomodoro").click();
    await tab.locator("#drawer-btn-pomo-start").click();
    await tab.waitForFunction(() =>
      KMA_FOCUS_DEMO.snapshot().sessions.some((s) => s.state === "running"),
    );
    await tab
      .getByRole("button", { name: "Mô phỏng 2 phút", exact: true })
      .click();
    await tab.waitForFunction(
      () =>
        +document
          .querySelector("#drawer-pomo-digits")
          .textContent.split(":")[0] < 60,
    );
    await tab.evaluate(() => KMA_ACCOUNT.sync());
    const before = await tab.evaluate(() =>
      JSON.parse(localStorage.getItem("kma_study_logs_v1")),
    );
    await tab.reload();
    await tab.waitForFunction(() =>
      document
        .querySelector("#drawer-btn-pomo-start")
        ?.textContent.includes("TẠM DỪNG"),
    );
    assert(
      (await tab.locator("#drawer-pomo-digits").innerText()).startsWith(
        "57:",
      ) ||
        (await tab.locator("#drawer-pomo-digits").innerText()).startsWith(
          "58:",
        ),
      "Timer reset after reload",
    );
    const after = await tab.evaluate(() =>
      JSON.parse(localStorage.getItem("kma_study_logs_v1")),
    );
    assert(
      JSON.stringify(before) === JSON.stringify(after),
      "Reload duplicated personal minutes",
    );
    await openPlanner();
    await tab
      .getByRole("button", { name: "Mô phỏng 60 phút", exact: true })
      .click();
    await tab.waitForFunction(
      () => KMA_FOCUS_DEMO.snapshot().sessions[0]?.credited_minutes === 60,
    );
    const streak = tab.locator("#study-streak-trigger");
    assert(await streak.innerText() === "1 ngày", "Header does not show current streak");
    await closePlanner();
    await streak.click();
    assert(await tab.locator("#study-streak-dialog").isVisible(), "Streak does not open directly");
    assert(await tab.locator("#sync-account-dialog").isHidden(), "Account opens with streak");
    assert((await tab.locator("#study-streak-dialog").innerText()).includes("Chuỗi học của bạn"), "Missing streak content");
    assert(await tab.locator("#study-streak-dialog .streak-back").count() === 0, "Streak still links back to account");
    await tab.keyboard.press("Escape");
    assert(await streak.evaluate(e => document.activeElement === e), "Streak close does not return focus");
    await closePlanner();
    await tab.locator("#leaderboard-trigger").click();
    await tab.waitForFunction(
      () =>
        document.querySelector(".lb-personal-time")?.textContent === "1h 00p",
    );
    assert(
      (await tab.locator(".lb-personal-rank").innerText()) === "#1",
      "Completed 60 minutes absent from ranking",
    );
    await tab
      .locator("#leaderboard-dialog")
      .screenshot({ path: "output/playwright/pomodoro-60-ranked.png" });
    await tab
      .getByRole("button", { name: "Đóng bảng xếp hạng", exact: true })
      .click();
    await openPlanner();
    await tab.locator("#drawer-input-custom-pomodoro").fill("60");
    await tab.locator("#drawer-btn-apply-custom-pomodoro").click();
    await tab.locator("#drawer-btn-pomo-start").click();
    await tab
      .getByRole("button", { name: "Mô phỏng 2 phút", exact: true })
      .click();
    await tab.waitForFunction(
      () =>
        document
          .querySelector("#drawer-pomo-digits")
          ?.textContent.startsWith("57:") ||
        document
          .querySelector("#drawer-pomo-digits")
          ?.textContent.startsWith("58:"),
    );
    await tab.locator("#drawer-btn-pomo-start").click();
    await tab.waitForFunction(
      () => KMA_FOCUS_DEMO.snapshot().sessions[1]?.state === "paused",
    );
    await tab.evaluate(() => KMA_FOCUS_DEMO.loseNextFinish());
    await tab.locator("#drawer-btn-pomo-skip").click();
    await tab.waitForFunction(
      () =>
        JSON.parse(
          localStorage.getItem(
            "kma_cloud_v1:77777777-7777-4777-8777-777777777777:pending-focus-finishes",
          ) || "[]",
        ).length === 1,
    );
    const saved = await tab.evaluate(
      () => KMA_FOCUS_DEMO.snapshot().sessions[1],
    );
    assert(
      saved.state === "completed" && saved.credited_minutes === 2,
      "Early finish lost measured minutes",
    );
    await tab.reload();
    await tab.waitForFunction(
      () =>
        JSON.parse(
          localStorage.getItem(
            "kma_cloud_v1:77777777-7777-4777-8777-777777777777:pending-focus-finishes",
          ) || "[]",
        ).length === 0,
    );
    const sessions = await tab.evaluate(
      () => KMA_FOCUS_DEMO.snapshot().sessions,
    );
    assert(
      sessions.length === 2 &&
        sessions.reduce((sum, s) => sum + s.credited_minutes, 0) === 62,
      "Lost response/reload changed the ledger",
    );
    await closePlanner();
    await tab.locator("#leaderboard-trigger").click();
    await tab.waitForFunction(
      () =>
        document.querySelector(".lb-personal-time")?.textContent === "1h 02p",
    );
    await tab.locator("#lb-subject").selectOption("vldc");
    await tab.waitForFunction(
      () =>
        document.querySelector(".lb-personal-time")?.textContent === "0 phút",
    );
    await tab.locator("#lb-subject").selectOption("all");
    await tab.waitForFunction(
      () =>
        document.querySelector(".lb-personal-time")?.textContent === "1h 02p",
    );
    await tab
      .getByRole("button", { name: "Đóng bảng xếp hạng", exact: true })
      .click();
    await openPlanner();
    await openPlanner();
    await tab.locator("#drawer-input-custom-pomodoro").fill("60");
    await tab.locator("#drawer-btn-apply-custom-pomodoro").click();
    await tab.evaluate(() => KMA_FOCUS_DEMO.loseNextStart());
    await tab.locator("#drawer-btn-pomo-start").click();
    await tab.waitForFunction(() =>
      document
        .querySelector("#drawer-btn-pomo-start")
        ?.textContent.includes("TẠM DỪNG"),
    );
    await tab
      .getByRole("button", { name: "Mô phỏng 2 phút", exact: true })
      .click();
    await tab.waitForFunction(
      () =>
        document
          .querySelector("#drawer-pomo-digits")
          ?.textContent.startsWith("57:") ||
        document
          .querySelector("#drawer-pomo-digits")
          ?.textContent.startsWith("58:"),
    );
    await tab.locator("#drawer-btn-pomo-start").click();
    await tab.waitForFunction(
      () => KMA_FOCUS_DEMO.snapshot().sessions[2]?.state === "paused",
    );
    await tab.evaluate(() => KMA_FOCUS_DEMO.advance(120));
    await tab.locator("#drawer-btn-pomo-skip").click();
    await tab.waitForFunction(
      () => KMA_FOCUS_DEMO.snapshot().sessions[2]?.credited_minutes === 2,
    );
    assert(
      (await tab.evaluate(() => KMA_FOCUS_DEMO.snapshot().sessions)).reduce(
        (sum, s) => sum + s.credited_minutes,
        0,
      ) === 64,
      "Lost start response or pause corrupted minutes",
    );
    await closePlanner();
    await tab.locator("#leaderboard-trigger").click();
    await tab.waitForFunction(
      () =>
        document.querySelector(".lb-personal-time")?.textContent === "1h 04p",
    );
    await tab.getByRole("button", {name:"Đóng bảng xếp hạng",exact:true}).click();
    await openPlanner();
    await tab.locator("#drawer-input-custom-pomodoro").fill("60");
    await tab.locator("#drawer-btn-apply-custom-pomodoro").click();
    await tab.evaluate(() => KMA_FOCUS_DEMO.loseNextStart());
    await tab.locator("#drawer-btn-pomo-start").click();
    await tab.getByRole("button", {name:"Mô phỏng 2 phút",exact:true}).click();
    await tab.waitForFunction(() => document.querySelector("#drawer-pomo-digits")?.textContent.startsWith("57:") || document.querySelector("#drawer-pomo-digits")?.textContent.startsWith("58:"));
    await tab.locator("#drawer-btn-pomo-skip").click();
    await tab.waitForFunction(() => KMA_FOCUS_DEMO.snapshot().sessions[3]?.credited_minutes === 2);
    await closePlanner();
    await tab.locator("#leaderboard-trigger").click();
    await tab.waitForFunction(() => document.querySelector(".lb-personal-time")?.textContent === "1h 06p");
    for (const width of [390, 320]) {
      await tab.setViewportSize({ width, height: 900 });
      assert(
        await tab
          .locator("#leaderboard-dialog")
          .evaluate((e) => e.scrollWidth <= e.clientWidth),
        "Ranking overflows on mobile",
      );
    }
    await tab.getByRole("button", {name:"Đóng bảng xếp hạng",exact:true}).click();
    await tab.evaluate(() => {KMA_FOCUS_DEMO.advance(3 * 86400);document.dispatchEvent(new Event("visibilitychange"));});
    assert(await streak.isHidden() && await streak.innerText() === "", "Expired streak stays visible");
    assert(!errors.length, errors.join("; "));
    assert(!external.length, "Demo sent requests to live auth/database");
    return {
      complete: true,
      checks: [
        "automatic profile participation",
        "60-minute credit",
        "wall clock catch-up",
        "reload resume without double personal minutes",
        "partial finish after pause",
        "lost finish ACK retry after reload",
        "ranking refresh and subject filters",
        "lost start response recovery and pause",
        "mobile",
        "streak hidden when empty or expired, direct separate modal, focus return",
      ],
      errors,
      external,
    };
  } finally {
    await context.close();
  }
}
