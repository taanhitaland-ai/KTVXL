// Run in a separate Playwright CLI session against the local development site.
// All auth/RPC responses below are fixtures; this never signs into Google or writes live data.
async (page) => {
  const context = await page.context().browser().newContext();
  const tab = await context.newPage();
  const user = "11111111-1111-4111-8111-111111111111";
  const prefix = "kma_cloud_v1:" + user;
  const key = "kma_question_notes_v1";
  const rid = "note|ktvxl|DE001_Q01";
  const errors = [],
    calls = [],
    receipts = new Map();
  let records = {},
    hold,
    started,
    failAfterWrite = false;
  const clone = (x) => JSON.parse(JSON.stringify(x));
  const profile = { nickname: "Người thử", leaderboard_opt_in: false };
  const snapshot = () => ({
    records: Object.fromEntries(
      Object.entries(clone(records)).sort(([a], [b]) => a.localeCompare(b)),
    ),
    profile,
  });
  const assert = (ok, text) => {
    if (!ok) throw new Error(text);
  };
  const note = (text) => ({
    subject: "ktvxl",
    questionId: "DE001_Q01",
    text,
    color: "blue",
    updatedAt: 1,
  });
  const encoded = (text) => JSON.stringify({ version: 1, notes: [note(text)] });
  try {
    await context.exposeFunction("__kmaTestRpc", async (name, args) => {
      calls.push(name);
      if (name === "study_snapshot") return { data: snapshot() };
      if (name === "study_activity_pulse") return { data: {owned: true, active: true, elapsed_seconds: 0} };
      if (name === "study_leaderboard")
        return {
          data: {
            remote: true,
            rows: [],
            me: {
              id: user,
              nickname: profile.nickname,
              joined: false,
              minutes: 0,
              sessions: 0,
            },
          },
        };
      if (name === "study_sync") {
        if (hold) {
          started();
          await hold;
        }
        const accepted = [],
          conflicts = [];
        for (const op of args.p_operations) {
          if (op.kind === "study") {
            accepted.push(op.opId);
            continue;
          }
          if (receipts.has(op.opId)) {
            assert(
              receipts.get(op.opId) === JSON.stringify(op),
              "Retry mutated an operation",
            );
            accepted.push(op.opId);
            continue;
          }
          const previous = records[op.rid];
          const same =
            previous?.value?.text === op.value?.text &&
            previous?.value?.color === op.value?.color;
          if (
            op.kind === "note" &&
            (previous?.version || 0) !== op.baseVersion &&
            !same
          ) {
            conflicts.push({ op, remote: previous || null });
            continue;
          }
          records[op.rid] = {
            kind: op.kind,
            subject: op.subject,
            id: op.id,
            value: op.value,
            version: (previous?.version || 0) + 1,
          };
          receipts.set(op.opId, JSON.stringify(op));
          accepted.push(op.opId);
        }
        if (failAfterWrite) {
          failAfterWrite = false;
          return { error: { message: "Lost response" } };
        }
        return { data: { ...snapshot(), accepted, conflicts } };
      }
      if (name === "study_focus_start")
        return {
          data: {
            id: "22222222-2222-4222-8222-222222222222",
            state: "running",
          },
        };
      if (name === "study_focus_action")
        return {
          data: {
            state:
              args.p_action === "finish"
                ? "completed"
                : args.p_action === "cancel"
                  ? "cancelled"
                  : "paused",
          },
        };
      throw new Error("Unexpected RPC: " + name);
    });
    await context.route("**/cloud_config.js*", (route) =>
      route.fulfill({
        contentType: "text/javascript",
        body: 'window.KMA_CLOUD_CONFIG={url:"https://fixture.invalid",publishableKey:"fixture-only"};',
      }),
    );
    await context.route("**/vendor/supabase/supabase.js*", (route) =>
      route.fulfill({
        contentType: "text/javascript",
        body: `
      window.supabase={createClient:()=>({rpc:(name,args)=>window.__kmaTestRpc(name,args),auth:{
        getSession:async()=>({data:{session:{user:{id:'${user}'}}}}),
        onAuthStateChange:callback=>{window.__kmaTestAuth=callback;return {data:{subscription:{unsubscribe(){}}}};}
      }})};`,
      }),
    );
    await context.addInitScript(
      ({ user, prefix, key }) => {
        localStorage.setItem("kma_cloud_v1:owner", user);
        localStorage.setItem(prefix + ":guest-decision", "skip");
        localStorage.setItem(
          key,
          JSON.stringify({
            version: 1,
            notes: [
              {
                subject: "ktvxl",
                questionId: "DE001_Q02",
                text: "Bản khách nguyên vẹn",
                color: "yellow",
                updatedAt: 1,
              },
            ],
          }),
        );
      },
      { user, prefix, key },
    );
    tab.on("pageerror", (e) => errors.push(e.message));
    await tab.goto("http://127.0.0.1:8765/web/index.html");
    await tab.waitForFunction(() => KMA_ACCOUNT?.getState().authenticated);
    assert(
      await tab.evaluate(
        () =>
          JSON.parse(localStorage.getItem("kma_question_notes_v1")).notes
            .length === 0,
      ),
      "Guest note leaked into account",
    );
    assert(
      await tab.evaluate(
        (key) =>
          JSON.parse(localStorage[key]).notes[0].text ===
          "Bản khách nguyên vẹn",
        key,
      ),
      "Guest storage changed",
    );

    let release;
    const firstStarted = new Promise((resolve) => {
      started = resolve;
    });
    hold = new Promise((resolve) => {
      release = resolve;
    });
    await tab.evaluate(({ key, raw }) => localStorage.setItem(key, raw), {
      key,
      raw: encoded("Bản đầu"),
    });
    const inFlight = tab.evaluate(() => KMA_ACCOUNT.sync());
    await firstStarted;
    await tab.evaluate(({ key, raw }) => localStorage.setItem(key, raw), {
      key,
      raw: encoded("Sửa khi đang gửi"),
    });
    hold = null;
    release();
    await inFlight;
    assert(
      (await tab.evaluate(() => KMA_ACCOUNT.getState().queue)) === 1,
      "In-flight acknowledgment lost the newer edit",
    );
    assert(
      (await tab.evaluate(
        () =>
          JSON.parse(localStorage.getItem("kma_question_notes_v1")).notes[0]
            .text,
      )) === "Sửa khi đang gửi",
      "Remote snapshot overwrote pending edit",
    );
    await tab.evaluate(() => KMA_ACCOUNT.sync());
    assert(
      records[rid].value.text === "Sửa khi đang gửi" &&
        records[rid].version === 2,
      "Chained edit did not reach server",
    );

    failAfterWrite = true;
    await tab.evaluate(({key, raw}) => localStorage.setItem(key, raw), {
      key, raw: encoded("Ghi chú khi mất phản hồi"),
    });
    await tab.evaluate(() => KMA_ACCOUNT.sync());
    assert(
      (await tab.evaluate(() => KMA_ACCOUNT.getState().queue)) === 1,
      "Failure discarded outbox",
    );
    await tab.evaluate(() => KMA_ACCOUNT.sync());
    assert(
      records[rid].value.text === "Ghi chú khi mất phản hồi" && records[rid].version === 3,
      "Lost response retry duplicated the note update",
    );
    await tab.evaluate(() => {
      localStorage.setItem(
        "kma_user_answers_ktvxl_v2",
        JSON.stringify({
          DE001_Q02: { answer: "B", isCorrect: false },
          DE001_Q01: { answer: "A", isCorrect: true },
        }),
      );
      window.refreshSavedProgress();
      window.__ackCard = document.querySelector("#q-card-DE001_Q01");
      const refresh = window.refreshSavedProgress;
      window.__ackRepaints = 0;
      window.refreshSavedProgress = () => {
        window.__ackRepaints++;
        refresh();
      };
    });
    await tab.evaluate(() => KMA_ACCOUNT.sync());
    assert(
      await tab.evaluate(
        () =>
          window.__ackRepaints === 0 &&
          window.__ackCard === document.querySelector("#q-card-DE001_Q01"),
      ),
      "Sync ACK repainted equivalent answers",
    );
    await tab.locator('#q-card-DE001_Q01 .option-btn[data-letter="B"]').click();
    await tab.evaluate(() => KMA_ACCOUNT.sync());
    assert(
      await tab.evaluate(
        () =>
          window.__ackRepaints === 0 &&
          window.__ackCard === document.querySelector("#q-card-DE001_Q01"),
      ),
      "Answering a question replaced the current card after sync",
    );

    records[rid] = {
      ...records[rid],
      value: note("Bản ở thiết bị khác"),
      version: 4,
    };
    await tab.evaluate(({ key, raw }) => localStorage.setItem(key, raw), {
      key,
      raw: encoded("Bản tại máy"),
    });
    await tab.evaluate(() => KMA_ACCOUNT.sync());
    assert(
      (await tab.evaluate(() => KMA_ACCOUNT.getState().conflicts)) === 1,
      "Note conflict disappeared",
    );
    await tab.locator("#sync-account-button").click();
    assert(
      (await tab.locator("#sync-account-dialog").innerText()).includes(
        "Bản ở thiết bị khác",
      ),
      "Remote copy missing from conflict UI",
    );
    assert(
      (await tab.locator("#sync-account-dialog").innerText()).includes(
        "Bản tại máy",
      ),
      "Local copy missing from conflict UI",
    );
    await tab
      .getByRole("button", { name: "Dùng bản này", exact: true })
      .first()
      .click();
    await tab.waitForFunction(
      () =>
        KMA_ACCOUNT.getState().conflicts === 0 &&
        KMA_ACCOUNT.getState().queue === 0,
    );
    assert(
      records[rid].value.text === "Bản tại máy",
      "Conflict resolution failed",
    );
    await tab
      .getByRole("button", { name: "Đóng tài khoản", exact: true })
      .click();

    await tab.locator("#filter-source").selectOption("DE_002");
    await tab.locator("#search-input").fill("PSW");
    await tab.locator("#search-input").blur();
    records["answer|ktvxl|DE001_Q01"] = {
      kind: "answer",
      subject: "ktvxl",
      id: "DE001_Q01",
      value: { answer: "A", isCorrect: true },
      version: 1,
    };
    await tab.evaluate(() => KMA_ACCOUNT.sync());
    assert(
      (await tab.locator("#filter-source").inputValue()) === "DE_002" &&
        (await tab.locator("#search-input").inputValue()) === "PSW",
      "Sync reset filters",
    );
    let dialogs = 0;
    tab.on("dialog", async (d) => {
      dialogs++;
      await d.dismiss();
    });
    await tab.locator("#btn-tab-exam").click();
    await tab.locator("#btn-start-exam").click();
    await tab.locator("#exam-active-view").waitFor({ state: "visible" });
    records["star|ktvxl|DE001_Q02"] = {
      kind: "star",
      subject: "ktvxl",
      id: "DE001_Q02",
      value: true,
      version: 1,
    };
    await tab.evaluate(() => KMA_ACCOUNT.sync());
    assert(
      (await tab.locator("#exam-active-view").isVisible()) && dialogs === 0,
      "Sync interrupted active exam",
    );

    await tab.locator("#btn-tab-practice").click();
    await tab.locator("#filter-source").selectOption("DE_001");
    await tab.locator("#search-input").fill("");
    await tab.locator("#search-input").blur();
    const other = await context.newPage();
    await other.goto("http://127.0.0.1:8765/web/index.html");
    await other.waitForFunction(() => KMA_ACCOUNT?.getState().authenticated);
    await other.evaluate(({ key, raw }) => localStorage.setItem(key, raw), {
      key,
      raw: encoded("Sửa ở tab khác"),
    });
    await tab.waitForFunction(() =>
      document
        .querySelector("#q-card-DE001_Q01 .q-note-preview")
        ?.textContent.includes("Sửa ở tab khác"),
    );
    assert(
      await tab
        .locator("#exam-active-view")
        .evaluate((e) => e.style.display === "block"),
      "Same-origin tab update reset exam",
    );
    assert(!errors.length, "Page errors: " + errors.join(", "));
    return {
      complete: true,
      checks: [
        "guest isolation",
        "in-flight edits",
        "lost response retry",
        "conflict UI",
        "filters",
        "active exam",
        "cross-tab cache",
        "stable cards after answer and reordered sync acknowledgment",
      ],
      errors,
    };
  } finally {
    await context.close();
  }
}
