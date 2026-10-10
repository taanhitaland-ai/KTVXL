// Playwright CLI run-code; serve outputs/ on loopback port 8767.
// Uses only a simulated account, never the production database.
async (page) => {
  const browser = page.context().browser(), contexts = [], errors = [];
  const uid = '11111111-1111-4111-8111-111111111111', base = 'kma_cloud_v1:' + uid + ':data:';
  const day = new Date(Date.now() + 7 * 3600000).toISOString().slice(0, 10);
  const assert = (ok, message) => { if (!ok) throw new Error(message); };
  let minutes = 87, fail = false, hold;
  const snapshot = () => ({ profile: { nickname: 'Học viên', leaderboard_opt_in: true }, records: {
    ['study|ktvxl|' + day]: { kind: 'study', subject: 'ktvxl', id: day, value: minutes, version: 1 },
    ['study|vldc|' + day]: { kind: 'study', subject: 'vldc', id: day, value: 15, version: 1 }
  }});
  async function fixture(mobile = false) {
    const ctx = await browser.newContext({ viewport: { width: mobile ? 390 : 1280, height: 900 } }); contexts.push(ctx);
    const tab = await ctx.newPage(); tab.on('pageerror', e => errors.push(e.message));
    await ctx.exposeBinding('__historyRpc', async (_, name) => {
      if (hold) await hold;
      if (fail) return { error: { message: 'Isolated test failure' } };
      if (['study_snapshot', 'study_sync'].includes(name)) return { data: snapshot() };
      if (name === 'study_focus_current') return { data: null };
      return { data: {} };
    });
    await ctx.route('**/*.supabase.co/**', r => r.abort());
    await ctx.route('**/cloud_config.js*', r => r.fulfill({ contentType: 'text/javascript', body: 'window.KMA_CLOUD_CONFIG={url:"https://fixture.invalid",publishableKey:"fixture-only"};' }));
    await ctx.route('**/vendor/supabase/supabase.js*', r => r.fulfill({ contentType: 'text/javascript', body: `window.supabase={createClient:()=>({rpc:(name,args)=>window.__historyRpc(name,args),auth:{getSession:async()=>({data:{session:{user:{id:'${uid}'}}}}),onAuthStateChange:()=>({}),signOut:async()=>({error:null})}})};` }));
    await ctx.addInitScript(({uid, base, day}) => {
      localStorage.setItem('kma_cloud_v1:owner', uid);
      localStorage.setItem('kma_cloud_v1:' + uid + ':guest-decision', 'skip');
      localStorage.setItem(base + 'kma_study_logs_v1', JSON.stringify({[day]: {ktvxl: 87, vldc: 15}}));
    }, {uid, base, day});
    await tab.goto('http://127.0.0.1:8767/KTVXL/web/index.html?theme=' + (mobile ? 'light' : 'dark'));
    return tab;
  }
  try {
    const a = await fixture();
    await a.waitForFunction(() => window.KMA_ACCOUNT?.getLearningAccess() === 'ready');
    const total = await a.locator('#drawer-stat-today-total').textContent();
    assert(total === '1 giờ 42 phút', 'Initial server snapshot matched cache but UI remained: ' + total);
    for (let n = 0; n < 2; n++) {
      await a.reload(); await a.waitForFunction(() => window.KMA_ACCOUNT?.getLearningAccess() === 'ready');
      assert(await a.locator('#drawer-stat-today-total').textContent() === '1 giờ 42 phút', 'Reload lost confirmed history');
    }
    minutes = 88; await a.evaluate(() => window.KMA_ACCOUNT.sync());
    assert(await a.locator('#drawer-stat-today-total').textContent() === '1 giờ 43 phút', 'Fresh credit was not shown');
    await a.evaluate(({base,day}) => {
      localStorage[base + 'kma_study_logs_v1'] = JSON.stringify({[day]:{ktvxl:6000}});
      window.KMA_SCHEDULE_POMODORO.recordStudyTime('ktvxl', 15);
      window.KMA_SCHEDULE_POMODORO.renderStudyStats();
    }, {base,day});
    assert(await a.locator('#drawer-stat-today-total').textContent() === '1 giờ 43 phút', 'Tampered cache entered UI');
    fail = true; await a.evaluate(() => window.KMA_ACCOUNT.sync());
    assert(await a.locator('#drawer-stat-today-total').textContent() === '1 giờ 43 phút', 'Failed refresh erased confirmed history');
    fail = false; await a.reload(); await a.waitForFunction(() => window.KMA_ACCOUNT?.getLearningAccess() === 'ready');
    assert(await a.locator('#drawer-stat-today-total').textContent() === '1 giờ 43 phút', 'Reload after poisoned cache lost history');
    let release; hold = new Promise(resolve => { release = resolve; });
    const b = await fixture(true);
    assert(await b.locator('#drawer-stat-today-total').textContent() !== '0 phút', 'Loading account reported zero as real history');
    assert(await b.locator('#drawer-stat-today-total').textContent() !== '1 giờ 42 phút', 'Unconfirmed cache displayed while loading');
    release(); hold = null;
    await b.waitForFunction(() => window.KMA_ACCOUNT?.getLearningAccess() === 'ready');
    assert(await b.locator('#drawer-stat-today-total').textContent() === '1 giờ 43 phút', 'Second device did not load confirmed total');
    await b.locator('#study-tools-toggle').click();
    await b.locator('#btn-floating-planner').click();
    await b.locator('[data-drawer-tab="side-tab-tracker"]').click();
    await b.screenshot({path:'output/playwright/study-history-consistent-mobile.png'});
    fail = true;
    const unavailable = await fixture();
    await unavailable.waitForFunction(() => window.KMA_ACCOUNT?.getStudyHistoryStatus() === 'error');
    assert(await unavailable.locator('#drawer-stat-today-total').textContent() === 'Chưa tải được lịch sử', 'Initial request failure was presented as zero');
    fail = false; await unavailable.evaluate(() => window.KMA_ACCOUNT.sync());
    assert(await unavailable.locator('#drawer-stat-today-total').textContent() === '1 giờ 43 phút', 'Retry failed to restore history');
    assert(errors.length === 0, 'Browser errors: ' + errors.join(';'));
    return 'PASS history: matching cache, repeated reload, new credit, forged cache, failed sync, loading, second device/mobile.';
  } finally { for (const ctx of contexts) await ctx.close(); }
}
