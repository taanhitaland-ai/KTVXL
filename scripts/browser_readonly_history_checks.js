// CLI run-code. Only the independent ephemeral database on 8772 is touched.
async page=>{
  const ctx=await page.context().browser().newContext({viewport:{width:1280,height:900}});
  const uid='11111111-1111-4111-8111-111111111111',ns='kma_preview_study-garden:',errors=[],sent=[];
  const assert=(ok,msg)=>{if(!ok)throw new Error(msg);};
  await page.request.post('http://127.0.0.1:8772/reset',{data:{}});
  await ctx.addInitScript(({uid,ns})=>{
    const day=new Date(Date.now()+7*3600000).toISOString().slice(0,10),opId=crypto.randomUUID();
    localStorage.setItem(ns+'owner',uid);
    localStorage.setItem(ns+uid+':data:kma_study_logs_v1',JSON.stringify({[day]:{ktvxl:99999}}));
    localStorage.setItem(ns+uid+':op:'+opId,JSON.stringify({kind:'study',subject:'ktvxl',id:day,rid:'study|ktvxl|'+day,delta:99999,value:99999,opId,baseVersion:0,createdAt:0}));
  },{uid,ns});
  await ctx.route('http://127.0.0.1:8771/rpc',async route=>{
    sent.push(route.request().postDataJSON());
    const response=await route.fetch({url:'http://127.0.0.1:8772/rpc'});await route.fulfill({response});
  });
  const tab=await ctx.newPage();tab.on('pageerror',e=>errors.push(e.message));
  try{
    await tab.goto('http://127.0.0.1:8767/demo-study-garden.html?theme=dark&view=timer');
    await tab.waitForFunction(()=>window.KMA_ACCOUNT?.getLearningAccess()==='ready'&&document.querySelector('.garden-collection-link:not(:disabled)'));
    await tab.locator('[data-drawer-tab="side-tab-tracker"]').click();
    assert(await tab.locator('.stat-add-btn,.btn-clear-day,#btn-reset-all-study-stats').count()===0,'manual time controls present');
    const before=await tab.evaluate(()=>({logs:localStorage.getItem('kma_study_logs_v1'),stats:window.KMA_SCHEDULE_POMODORO.getTodayStats(),streak:window.KMA_STREAK_MODEL.build(JSON.parse(localStorage.getItem('kma_study_logs_v1'))).streak}));
    assert(!before.logs.includes('99999'),'tampered cache used instead of server');
    const result=await tab.evaluate(({uid,ns})=>{
      const api=window.KMA_SCHEDULE_POMODORO,rejected=api.recordStudyTime('ktvxl',15);
      const forged=JSON.stringify({[window.KMA_STREAK_MODEL.dayKey()]:{ktvxl:99999}});
      localStorage.setItem('kma_study_logs_v1',forged);localStorage.removeItem('kma_study_logs_v1');
      // Bypass the ordinary API and edit the raw cache key, as a stale tab might.
      localStorage.setItem(ns+uid+':data:kma_study_logs_v1',forged);
      api.renderStudyStats();
      return {rejected,logs:localStorage.getItem('kma_study_logs_v1'),stats:api.getTodayStats(),streak:window.KMA_STREAK_MODEL.build(JSON.parse(localStorage.getItem('kma_study_logs_v1'))).streak};
    },{uid,ns});
    assert(result.rejected===false,'legacy public API added minutes');
    assert(JSON.stringify(result.stats)===JSON.stringify(before.stats)&&result.logs===before.logs&&result.streak===before.streak,'cache manipulation changed history or streak');
    await tab.evaluate(()=>{
      localStorage.setItem('kma_question_notes_v1',JSON.stringify({version:1,notes:[{subject:'ktvxl',questionId:'1',text:'Ghi chú vẫn đồng bộ',color:'blue',updatedAt:Date.now()}]}));
    });
    await tab.waitForFunction(()=>window.KMA_ACCOUNT.getState().queue===0);
    const snapshot=(await page.request.post('http://127.0.0.1:8772/rpc',{data:{name:'study_snapshot',args:{}}})).json();
    assert((await snapshot).data.records['note|ktvxl|1'].value.text==='Ghi chú vẫn đồng bộ','history protection blocked notes');
    assert(!sent.some(x=>x.name==='study_sync'&&x.args.p_operations.some(op=>op.kind==='study')),'legacy study outbox was uploaded');
    for(const [theme,width] of [['light',320],['dark',390]]){
      await tab.setViewportSize({width,height:900});
      await tab.evaluate(theme=>document.body.classList.toggle('dark-mode',theme==='dark'),theme);
      assert(await tab.locator('#side-planner-drawer').evaluate(n=>n.scrollWidth<=n.clientWidth+1),'mobile history overflow');
      await tab.locator('#side-tab-tracker').screenshot({path:"C:/Users/Admin'/Documents/Codex/2026-10-07/s/outputs/KTVXL/output/playwright/readonly-history-"+theme+'.png'});
    }
    assert(!errors.length,errors.join('; '));return {pass:true,checks:'no add/delete controls; forged cache/outbox/public API ignored; streak unchanged; notes still sync; light/dark mobile'};
  }finally{await ctx.close();}
}
