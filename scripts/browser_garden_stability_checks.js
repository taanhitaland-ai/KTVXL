// Playwright CLI run-code. Separate garden fixture 8772; UI samples never write production.
async(page)=>{
  const ctx=await page.context().browser().newContext({viewport:{width:1280,height:900}});
  ctx.setDefaultTimeout(10000);const errors=[];let loads=0;
  await page.request.post('http://127.0.0.1:8772/reset',{data:{}});
  await ctx.route('http://127.0.0.1:8771/rpc',async r=>{const response=await r.fetch({url:'http://127.0.0.1:8772/rpc'});await r.fulfill({response});});
  const assert=(ok,msg)=>{if(!ok)throw new Error(msg);};
  const open=async()=>{
    const tab=await ctx.newPage();tab.on('pageerror',e=>errors.push(e.message));tab.on('framenavigated',f=>{if(f===tab.mainFrame())loads++;});
    await tab.goto('http://127.0.0.1:8767/demo-study-garden.html?theme=dark&view=timer');
    await tab.waitForFunction(()=>window.KMA_ACCOUNT?.getLearningAccess()==='ready'&&document.querySelector('[data-garden-harvest="0"]'),null,{timeout:10000});
    return tab;
  };
  try{
    const a=await open(),b=await open();
    for(const tab of [a,b])await tab.evaluate(()=>window.__ripeButton=document.querySelector('[data-garden-harvest="0"]'));
    await Promise.all([a.evaluate(()=>window.__ripeButton.click()),b.evaluate(()=>window.__ripeButton.click())]);
    for(const tab of [a,b])await tab.waitForFunction(()=>window.KMA_STUDY_GARDEN.getState().harvests===1,null,{timeout:5000});
    const data=await a.evaluate(()=>window.KMA_STUDY_GARDEN.getState());
    assert(data.harvests===1&&data.plots[0]===null,'two tabs harvested twice');
    for(const tab of [a,b])await tab.evaluate(()=>document.getElementById('garden-harvest-dialog').close());
    await b.close();await a.bringToFront();
    const countsBefore=await a.evaluate(()=>window.KMA_STUDY_GARDEN.getState().totalSeconds);
    await a.evaluate(()=>{
      window.__gardenPerf={added:0,longTasks:0};window.__gardenNode=document.querySelector('.garden-content');
      new MutationObserver(ms=>window.__gardenPerf.added+=ms.reduce((n,m)=>n+m.addedNodes.length,0)).observe(document.getElementById('study-garden'),{childList:true,subtree:true});
      new PerformanceObserver(list=>window.__gardenPerf.longTasks+=list.getEntries().length).observe({type:'longtask'});
    });
    await a.waitForTimeout(32000);
    const perf=await a.evaluate(()=>({...window.__gardenPerf,sameNode:window.__gardenNode===document.querySelector('.garden-content'),seconds:window.KMA_STUDY_GARDEN.getState().totalSeconds}));
    assert(perf.added===0&&perf.sameNode,'waiting/snapshot sync rebuilt garden');
    assert(perf.seconds===countsBefore,'waiting outside study grew plants');
    assert(loads===2,'preview tabs reloaded repeatedly');
    await a.evaluate(()=>window.KMA_SCHEDULE_POMODORO.toggleSideDrawer(false));
    const node=await a.evaluateHandle(()=>document.querySelector('.garden-content'));
    await a.evaluate(()=>window.dispatchEvent(new CustomEvent('kma:study-confirmed',{detail:{sessionId:'22222222-2222-4222-8222-222222222222',subject:'vldc',seconds:60,endMs:Date.now()}})));
    await a.evaluate(()=>window.KMA_STUDY_GARDEN.refresh());
    assert((await a.evaluate(()=>window.KMA_STUDY_GARDEN.getState())).totalSeconds===countsBefore,'synthetic client credit forged assets');
    await page.request.post('http://127.0.0.1:8772/rpc',{data:{name:'garden_demo',args:{action:'credit',minutes:25}}});
    await a.evaluate(()=>window.KMA_STUDY_GARDEN.refresh());
    await a.waitForFunction(before=>window.KMA_STUDY_GARDEN.getState().totalSeconds===before+1500,countsBefore);
    assert(await a.evaluate(el=>el===document.querySelector('.garden-content'),node),'hidden garden unnecessarily repainted');
    await a.evaluate(()=>window.KMA_SCHEDULE_POMODORO.toggleSideDrawer(true));
    await a.waitForFunction(el=>el!==document.querySelector('.garden-content'),node);
    // Guest preview cannot start a garden transaction, even with a synthetic credit signal.
    const guestCtx=await page.context().browser().newContext();
    try{
      await guestCtx.addInitScript(()=>localStorage.setItem('ktvxl_garden_preview_login','guest'));
      const guest=await guestCtx.newPage();await guest.goto('http://127.0.0.1:8767/demo-study-garden.html?view=timer');
      await guest.waitForFunction(()=>window.KMA_ACCOUNT?.getLearningAccess()==='guest'&&window.KMA_STUDY_GARDEN);
      await guest.evaluate(()=>window.dispatchEvent(new CustomEvent('kma:study-confirmed',{detail:{sessionId:'33333333-3333-4333-8333-333333333333',subject:'ktvxl',seconds:3600,endMs:Date.now()}})));
      assert((await guest.evaluate(()=>window.KMA_STUDY_GARDEN.getState())).totalSeconds===0,'guest credit bypass');
    }finally{await guestCtx.close();}
    assert(errors.length===0,'browser errors: '+errors.join(';'));
    return {pass:true,loads,perf,checks:'multi-tab harvest lock; 32s no idle repaint/growth; hidden garden deferred render; guest gate'};
  }finally{await ctx.close();}
}
