// Isolated browser contexts: no real Google account or live database write.
async (page) => {
  const browser = page.context().browser();
  const contexts = [], errors = [], requests = [], checks = [];
  const assert = (ok, message) => { if (!ok) throw Error(message); };
  const create = async () => {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    contexts.push(context);
    context.on("request", request => {
      if (/supabase\.co|accounts\.google/.test(request.url())) requests.push(request.url());
    });
    // A failed isolation check still cannot contact the production service.
    await context.route("**/*.supabase.co/**", route => route.abort());
    const tab = await context.newPage();
    tab.on("pageerror", error => errors.push(error.message));
    tab.on("dialog", dialog => dialog.accept());
    return { context, tab };
  };
  try {
    const { context, tab } = await create();
    await context.addInitScript(() => {
      const owner = "11111111-1111-4111-8111-111111111111";
      localStorage.setItem("kma_cloud_v1:owner", owner);
      localStorage.setItem("kma_cloud_v1:" + owner + ":data:kma_study_logs_v1", '{"2026-10-07":{"ktvxl":80}}');
      localStorage.setItem("sb-htcnflcncbihhlqoeqsy-auth-token", '{"access_token":"preview-only"}');
      const now = Date.now.bind(Date);
      let offset = 0;
      Date.now = () => now() + offset;
      window.__advancePreviewMinute = () => { offset += 61000; };
    });
    await tab.goto("http://127.0.0.1:8765/web/index.html");
    await tab.locator(".question-card").first().waitFor();
    assert(await tab.evaluate(() => KMA_CLOUD_CONFIG === null && !window.KMA_ACCOUNT), "Local preview enabled production cloud");
    await tab.locator(".question-card").first().locator(".option-btn").first().click();
    assert((await tab.locator("#stat-answered-count").innerText()).trim() === "1", "Local answer not recorded");
    await tab.locator("#btn-floating-planner").click();
    await tab.locator("#drawer-btn-pomo-start").click();
    await tab.evaluate(() => window.__advancePreviewMinute());
    await tab.locator("#drawer-btn-pomo-skip").click();
    assert(await tab.evaluate(() => Object.values(JSON.parse(localStorage.getItem("kma_study_logs_v1") || "{}")).some(day => day.ktvxl >= 1)), "Local study time not recorded");
    assert(await tab.evaluate(() => localStorage.getItem("kma_cloud_v1:11111111-1111-4111-8111-111111111111:data:kma_study_logs_v1") === '{"2026-10-07":{"ktvxl":80}}'), "Existing account cache changed");
    await tab.locator("#btn-close-side-drawer").click();
    await tab.locator("#leaderboard-trigger").click();
    assert((await tab.locator(".lb-row").count()) === 0, "Local study appeared in leaderboard");
    assert((await tab.locator("#leaderboard-dialog").innerText()).includes("Bản thử trên máy"), "Local preview state is unclear");
    await tab.screenshot({path:"output/playwright/leaderboard-local-only.png"});
    checks.push("local answers and Pomodoro stay in local storage with no cloud account, even with an old session/cache");

    const remote = await create();
    let count = 3;
    await remote.context.exposeFunction("__rankingFixture", async (name, args) => {
      assert(name === "study_leaderboard", "Unexpected fixture RPC " + name);
      const total = args.p_subject !== "all" ? Math.min(count, 1) : args.p_period === "today" ? Math.min(count, 2) : count;
      return {data: {remote:true, rows:Array.from({length:total}, (_,i)=>({id:"real-member-"+i,nickname:"Người thật "+(i+1),minutes:120-i*5,sessions:2,rank:i+1})),me:null},error:null};
    });
    await remote.context.route("**/cloud_config.js*", route => route.fulfill({contentType:"text/javascript",body:'window.KMA_CLOUD_CONFIG={url:"https://fixture.invalid",publishableKey:"fixture-only"};'}));
    await remote.context.route("**/vendor/supabase/supabase.js*", route => route.fulfill({contentType:"text/javascript",body:'window.supabase={createClient:()=>({rpc:(name,args)=>window.__rankingFixture(name,args),auth:{getSession:async()=>({data:{session:null}}),onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}})}})};'}));
    await remote.tab.goto("http://127.0.0.1:8765/web/index.html");
    await remote.tab.locator("#leaderboard-trigger").click();
    for (const size of [3,4,10,1,0]) {
      count = size;
      await remote.tab.evaluate(() => KMA_ACCOUNT.refreshRanking());
      await remote.tab.waitForFunction(expected => {
        const top = document.querySelectorAll(".lb-podium-card[data-member]").length;
        const rows = document.querySelectorAll(".lb-row").length;
        return top === Math.min(expected,3) && rows === Math.max(0,Math.min(expected,10)-3) && !document.querySelector(".lb-empty")?.textContent.includes("Đang tải");
      }, size);
      assert((await remote.tab.locator('[data-member^="sample-"]').count()) === 0, "Fabricated sample member rendered");
      assert(await remote.tab.locator(".lb-list-title").isHidden() === (size <= 3), "Empty lower ranks section shown");
      checks.push(size + " real participants render exactly their own rows");
    }
    count = 10;
    await remote.tab.evaluate(() => KMA_ACCOUNT.refreshRanking());
    await remote.tab.locator("#lb-subject").selectOption("ktvxl");
    await remote.tab.waitForFunction(() => document.querySelectorAll(".lb-podium-card[data-member]").length === 1 && document.querySelectorAll(".lb-row").length === 0);
    await remote.tab.locator("#lb-subject").selectOption("all");
    await remote.tab.getByRole("button",{name:"Hôm nay",exact:true}).click();
    await remote.tab.waitForFunction(() => document.querySelectorAll(".lb-podium-card[data-member]").length === 2 && document.querySelectorAll(".lb-row").length === 0);
    checks.push("subject and period filters do not fill missing ranks with sample users");
    assert(!requests.length, "Production traffic from isolated test: " + requests.join(", "));
    assert(!errors.length, errors.join("; "));
    return {checks,productionRequests:requests.length,errors};
  } finally {
    await Promise.all(contexts.map(context => context.close()));
  }
}
