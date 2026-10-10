// Playwright CLI run-code. Start the fixture with KMA_STUDY_FIXTURE_PORT=8769.
// This separate test database never resets the interactive preview on port 8768.
async (page) => {
  const root = "C:/Users/Admin'/Documents/Codex/2026-10-07/s/outputs/KTVXL";
  const browser=page.context().browser(),uid='11111111-1111-4111-8111-111111111111';
  const assert=(ok,msg)=>{if(!ok)throw new Error(msg);};
  const contexts=[],errors=[],calls=[];
  let queue=Promise.resolve(),offline=false;
  const serial=fn=>{const next=queue.catch(()=>{}).then(fn);queue=next;return next;};
  const backend=async(endpoint,body)=>{const response=await page.request.post('http://127.0.0.1:8769'+endpoint,{data:body});return response.json();};
  await backend('/reset',{});
  async function fixture({mobile=false,guest=false,theme='dark'}={}) {
    const ctx=await browser.newContext({viewport:{width:mobile?390:1280,height:900},isMobile:mobile,hasTouch:mobile});contexts.push(ctx);
    const tab=await ctx.newPage();tab.on('pageerror',e=>errors.push(e.message));
    await ctx.exposeBinding('__studyRpc',async(_,name,args={})=>serial(async()=>{
      calls.push({name,args});if(offline)return {error:{message:'Fixture offline'}};
      return backend('/rpc',{name,args,guest});
    }));
    await ctx.route('**/*.supabase.co/**',r=>r.abort());
    await ctx.route('**/cloud_config.js*',r=>r.fulfill({contentType:'text/javascript',body:'window.KMA_CLOUD_CONFIG={url:"https://fixture.invalid",publishableKey:"fixture-only"};'}));
    await ctx.route('**/vendor/supabase/supabase.js*',r=>r.fulfill({contentType:'text/javascript',body:`window.supabase={createClient:()=>({rpc:(name,args)=>window.__studyRpc(name,args),auth:{getSession:async()=>({data:{session:${guest?'null':`{user:{id:'${uid}'}}`}}}),onAuthStateChange:()=>({}),signOut:async()=>({error:null})}})};` }));
    await ctx.addInitScript(({uid,guest})=>{
      if(!guest) {localStorage.setItem('kma_cloud_v1:owner',uid);localStorage.setItem('kma_cloud_v1:'+uid+':guest-decision','skip');}
    },{uid,guest});
    await tab.goto('http://127.0.0.1:8766/KTVXL/web/index.html?preview=automatic-study&theme='+theme);
    await tab.waitForFunction(()=>window.KMA_ACCOUNT?.getState().access=== 'ready' || window.KMA_ACCOUNT?.getState().access==='guest');
    await tab.clock.install();
    return tab;
  }
  const shift=seconds=>serial(()=>backend('/shift',{seconds}));
  const board=async()=>(await backend('/rpc',{name:'study_leaderboard',args:{p_period:'today',p_subject:'all'}})).data;
  async function wait(tab, fn, label) {
    try { await tab.waitForFunction(fn, null, {timeout:5000}); }
    catch(e) { throw new Error(label+' '+JSON.stringify({state:await tab.evaluate(()=>window.KMA_STUDY_ACTIVITY.getState()),calls:calls.filter(c=>c.name==='study_activity_pulse').slice(-4)})); }
  }
  try {
    const g=await fixture({guest:true,mobile:true});
    await g.locator('#questions-container .option-btn').first().click();
    assert(!(await g.evaluate(()=>window.KMA_STUDY_ACTIVITY.getState())).started,'guest earned time');
    assert(await g.locator('#sync-account-dialog').isVisible(),'guest login gate lost');
    await g.context().close();
    const a=await fixture();
    assert(!(await a.evaluate(()=>window.KMA_STUDY_ACTIVITY.getState())).started,'login/page load auto-started');
    await a.evaluate(()=>document.querySelector('#questions-container .option-btn').click());
    assert(!(await a.evaluate(()=>window.KMA_STUDY_ACTIVITY.getState())).started,'synthetic click earned time');
    await a.locator('#questions-container .option-btn').nth(1).click();
    await a.waitForFunction(()=>window.KMA_STUDY_ACTIVITY.getState().active);
    await queue;await shift(61);
    await a.clock.fastForward(61000);await queue;
    await a.waitForFunction(()=>!window.KMA_STUDY_ACTIVITY.getState().failed);
    assert((await board()).rows[0].minutes===1,'minute not credited during active study');
    await a.clock.fastForward(1000);await queue;
    const pulseCount=calls.filter(c=>c.name==='study_activity_pulse').length;
    for(let i=0;i<5;i++)await a.locator('#questions-container .option-btn').nth(i%4).click();
    assert(calls.filter(c=>c.name==='study_activity_pulse').length<=pulseCount+1,'every answer made a network call: '+JSON.stringify({before:pulseCount,after:calls.filter(c=>c.name==='study_activity_pulse').length,state:await a.evaluate(()=>window.KMA_STUDY_ACTIVITY.getState()),calls:calls.filter(c=>c.name==='study_activity_pulse').map(c=>c.args)}));
    await a.locator('#study-tools-toggle').click(); // Toggle may collapse; planner still works from evaluate for UI preview only.
    await a.evaluate(()=>window.KMA_SCHEDULE_POMODORO.toggleSideDrawer(true));
    await a.waitForFunction(()=>Math.abs(document.getElementById('side-planner-drawer').getBoundingClientRect().right-innerWidth)<1);
    assert(await a.locator('.pomo-preset-btn').count()===0,'countdown presets still visible');
    await a.screenshot({path:root+'/output/playwright/automatic-study-dark.png'});
    await a.locator('#btn-close-side-drawer').click();
    const b=await fixture({theme:'light'});
    await b.locator('#questions-container .option-btn').first().click();await queue;
    await a.clock.fastForward(30000);await queue;
    await wait(a,()=>!window.KMA_STUDY_ACTIVITY.getState().owned,'two-tab ownership');
    assert((await board()).rows[0].minutes===1,'two tabs minted duplicate minutes');
    await b.locator('#btn-subj-vldc').click();await queue;
    assert(!(await b.evaluate(()=>window.KMA_STUDY_ACTIVITY.getState())).started,'subject menu click starts learning');
    await b.locator('#btn-tab-knowledge').click();
    await b.locator('#tab-knowledge h1').click();await queue;
    assert((await b.evaluate(()=>window.KMA_STUDY_ACTIVITY.getState())).subject==='vldc','wrong subject tracked');
    await shift(960);
    await b.clock.fastForward(960000);await queue;
    await wait(b,()=>!window.KMA_STUDY_ACTIVITY.getState().active,'idle stop');
    await b.bringToFront();
    await b.waitForFunction(()=>document.querySelector('[data-study-activity-status]').textContent==='Nghỉ ngơi',null,{timeout:3000,polling:100});
    assert((await board()).rows[0].minutes===16,'idle timeout exceeded 15 minutes');
    await b.clock.fastForward(3600000);await queue;
    assert((await board()).rows[0].minutes===16,'idle continued earning time');
    await b.locator('#tab-knowledge h1').click();await queue;
    await wait(b,()=>window.KMA_STUDY_ACTIVITY.getState().active,'idle resume');
    await b.waitForFunction(()=>document.querySelector('[data-study-activity-status]').textContent==='Đang học',null,{timeout:3000,polling:100});
    offline=true;await b.clock.fastForward(31000);
    await wait(b,()=>window.KMA_STUDY_ACTIVITY.getState().failed,'offline failure');
    offline=false;await b.evaluate(()=>window.dispatchEvent(new Event('online')));await queue;
    await wait(b,()=>!window.KMA_STUDY_ACTIVITY.getState().failed,'reconnect');
    const m=await fixture({mobile:true});
    await m.locator('#questions-container .option-btn').first().click();await queue;
    await m.locator('#study-tools-toggle').click();await m.locator('#btn-floating-planner').click();
    await m.waitForFunction(()=>Math.abs(document.getElementById('side-planner-drawer').getBoundingClientRect().right-innerWidth)<1);
    assert(await m.locator('#side-planner-drawer').evaluate(e=>e.getBoundingClientRect().width)<=390,'mobile drawer overflow');
    assert(await m.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'mobile page overflow');
    await m.screenshot({path:root+'/output/playwright/automatic-study-mobile.png'});
    await b.evaluate(()=>window.KMA_SCHEDULE_POMODORO.toggleSideDrawer(true));
    await b.waitForFunction(()=>Math.abs(document.getElementById('side-planner-drawer').getBoundingClientRect().right-innerWidth)<1);
    await b.screenshot({path:root+'/output/playwright/automatic-study-light.png'});
    const scrolling=await fixture();
    await scrolling.evaluate(()=>window.scrollTo(0,180));
    assert(!(await scrolling.evaluate(()=>window.KMA_STUDY_ACTIVITY.getState())).started,'programmatic scroll starts learning');
    await scrolling.mouse.move(250,600);await scrolling.mouse.wheel(0,320);
    await wait(scrolling,()=>window.KMA_STUDY_ACTIVITY.getState().active,'manual scroll begins learning');
    await scrolling.locator('#btn-tab-exam').click();
    await wait(scrolling,()=>!window.KMA_STUDY_ACTIVITY.getState().started,'leaving study pauses time');
    await scrolling.clock.fastForward(31000);await queue;
    assert(!(await scrolling.evaluate(()=>window.KMA_STUDY_ACTIVITY.getState())).started,'queued activity restarted time outside study');
    const keyboard=await fixture();
    await keyboard.keyboard.press('PageDown');
    await wait(keyboard,()=>window.KMA_STUDY_ACTIVITY.getState().active,'keyboard reading begins learning');
    assert(errors.length===0,'page errors: '+errors.join(';'));
    return 'PASS automatic study: real SQL, guests, trusted interactions, RPC throttling, active ranking, idle stop/resume, subjects, two tabs, reconnect, mobile and themes.';
  } finally { for(const ctx of contexts)await ctx.close().catch(()=>{}); }
}
