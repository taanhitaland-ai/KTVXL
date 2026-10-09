// Playwright CLI run-code. Requires a separate fixture on port 8769.
// Tests DOM churn, countdown node identity, preview isolation, themes and touch widths.
async (page) => {
  const root="C:/Users/Admin'/Documents/Codex/2026-10-07/s/outputs/KTVXL";
  const ctx=await page.context().browser().newContext({viewport:{width:1280,height:900}});
  ctx.setDefaultTimeout(10000);
  const calls=[],errors=[];let reloads=0;
  const assert=(ok,msg)=>{if(!ok)throw new Error(msg);};
  await page.request.post('http://127.0.0.1:8769/reset',{data:{}});
  // The interactive demo on 8768 remains untouched.
  await ctx.route('http://127.0.0.1:8768/rpc',async route=>{
    calls.push(route.request().postDataJSON().name);
    const response=await route.fetch({url:'http://127.0.0.1:8769/rpc'});
    await route.fulfill({response});
  });
  const tab=await ctx.newPage();
  tab.on('pageerror',error=>errors.push(error.message));
  tab.on('framenavigated',frame=>{if(frame===tab.mainFrame())reloads++;});
  try {
    await tab.goto('http://127.0.0.1:8767/demo-auto-study.html?theme=light',{waitUntil:'domcontentloaded'});
    await tab.waitForFunction(()=>window.KMA_ACCOUNT?.getLearningAccess()==='ready',null,{timeout:10000});
    await tab.locator('#questions-container .option-btn').first().click();
    await tab.waitForFunction(()=>window.KMA_STUDY_ACTIVITY.getState().active,null,{timeout:5000});
    await tab.evaluate(()=>window.KMA_SCHEDULE_POMODORO.toggleSideDrawer(true));
    await tab.waitForFunction(()=>Math.abs(document.getElementById('side-planner-drawer').getBoundingClientRect().right-innerWidth)<1);
    const card=tab.locator('#side-tab-pomo .auto-study-display');
    assert(await card.locator('p, button').count()===0,'extra help/buttons in timer');
    assert(await card.locator('[data-study-activity-status]').textContent()==='Đang học','active status label');
    const light=await card.evaluate(e=>({bg:getComputedStyle(e).backgroundColor,color:getComputedStyle(e.querySelector('.pomo-timer-digits')).color,height:e.getBoundingClientRect().height}));
    assert(light.height<230,'timer card too tall');
    await card.screenshot({path:root+'/output/playwright/study-compact-light.png'});
    await tab.evaluate(()=>window.KMA_SCHEDULE_POMODORO.toggleDarkMode());
    const dark=await card.evaluate(e=>({bg:getComputedStyle(e).backgroundColor,color:getComputedStyle(e.querySelector('.pomo-timer-digits')).color}));
    assert(light.bg!==dark.bg&&light.color!==dark.color,'theme colors did not change');
    await card.screenshot({path:root+'/output/playwright/study-compact-dark.png'});
    await tab.evaluate(()=>window.KMA_SCHEDULE_POMODORO.toggleSideDrawer(false));
    // Reading the learning gate never scans hundreds/thousands of saved records.
    assert(await tab.evaluate(()=>{
      const key=Storage.prototype.key;let scans=0;
      Storage.prototype.key=function(...args){scans++;return key.apply(this,args);};
      for(let i=0;i<1000;i++)window.KMA_ACCOUNT.getLearningAccess();
      Storage.prototype.key=key;return scans===0;
    }),'learning gate scanned local storage');
    await tab.evaluate(()=>{
      window.__stable={mutations:0,added:0,cards:0,longTasks:0};
      window.__question=document.querySelector('#questions-container .question-card');
      new MutationObserver(ms=>{for(const m of ms){window.__stable.mutations++;window.__stable.added+=m.addedNodes.length;for(const n of m.addedNodes)if(n.nodeType===1&&(n.matches('.question-card')||n.querySelector('.question-card')))window.__stable.cards++;}}).observe(document.body,{childList:true,subtree:true});
      new PerformanceObserver(list=>window.__stable.longTasks+=list.getEntries().length).observe({type:'longtask'});
    });
    // Two different simulated accounts must not reload each other's tabs.
    const other=await ctx.newPage();
    await other.goto('http://127.0.0.1:8767/demo-login-username.html',{waitUntil:'domcontentloaded'});
    await other.waitForFunction(()=>window.KMA_ACCOUNT?.getLearningAccess()==='guest',null,{timeout:10000});
    await tab.bringToFront();
    await tab.waitForTimeout(2000);
    assert(reloads===1,'other preview reloaded the study page');
    const cdp=await ctx.newCDPSession(tab);await cdp.send('Performance.enable');
    const metric=(list,name)=>list.find(m=>m.name===name)?.value;
    const before=(await cdp.send('Performance.getMetrics')).metrics;
    // 45 seconds exercises 3 snapshot intervals and a study heartbeat.
    await tab.waitForTimeout(45000);
    const after=(await cdp.send('Performance.getMetrics')).metrics;
    const stable=await tab.evaluate(()=>({...window.__stable,sameQuestion:window.__question===document.querySelector('#questions-container .question-card')}));
    assert(reloads===1,'unexpected repeated page loads');
    assert(stable.added<500&&stable.mutations<500,'excessive idle DOM changes: '+JSON.stringify(stable));
    assert(stable.cards===0&&stable.sameQuestion,'background sync rebuilt practice cards');
    assert(calls.filter(name=>name==='study_activity_pulse').length<=3,'heartbeat request storm');
    assert(calls.filter(name=>name==='study_snapshot').length<=8,'snapshot request storm');
    // Visible calendars keep their nodes while the seconds change.
    await tab.evaluate(()=>window.KMA_SCHEDULE_POMODORO.toggleSideDrawer(true));
    await tab.locator('[data-drawer-tab="side-tab-schedule"]').click();
    await tab.evaluate(()=>window.__countdown=document.querySelector('[id^="drawer-exam-cd-"]'));
    await tab.waitForTimeout(2100);
    assert(await tab.evaluate(()=>window.__countdown===document.querySelector('[id^="drawer-exam-cd-"]')&&document.getElementById('ticker-countdown-val').isConnected),'countdown nodes replaced/detached');
    await tab.locator('[data-drawer-tab="side-tab-pomo"]').click();
    for(const width of [390,320]) {
      await tab.setViewportSize({width,height:844});
      await tab.waitForTimeout(400);
      assert(await tab.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'page overflows at '+width);
      assert(await card.evaluate(e=>{const r=e.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth;}),'timer overflows at '+width);
      await card.screenshot({path:root+'/output/playwright/study-compact-mobile-'+width+'.png'});
    }
    assert(errors.length===0,'browser errors: '+errors.join(';'));
    return {pass:true,reloads,calls,stable,taskSeconds:metric(after,'TaskDuration')-metric(before,'TaskDuration'),light,dark};
  } finally {await ctx.close();}
}
