// Playwright CLI run-code. Requires the isolated garden fixture on port 8772.
// Never resets the interactive garden preview on 8771 or production data.
async (page) => {
  const root="C:/Users/Admin'/Documents/Codex/2026-10-07/s/outputs/KTVXL";
  const browser=page.context().browser(),contexts=[],errors=[],badAssets=[];
  const assert=(ok,msg)=>{if(!ok)throw new Error(msg);};
  const backend=async(path,body={})=>(await page.request.post('http://127.0.0.1:8772'+path,{data:body})).json();
  let step='load';
  await backend('/reset');
  async function fixture(theme,width=1280){
    const ctx=await browser.newContext({viewport:{width,height:960},isMobile:width<760,hasTouch:width<760});contexts.push(ctx);ctx.setDefaultTimeout(10000);
    await ctx.route('**/*.supabase.co/**',r=>r.abort());
    await ctx.route('http://127.0.0.1:8771/rpc',async route=>{const response=await route.fetch({url:'http://127.0.0.1:8772/rpc'});await route.fulfill({response});});
    const tab=await ctx.newPage();tab.on('pageerror',e=>errors.push(e.message));
    tab.on('response',r=>{if(r.status()>=400&&r.url().includes('garden_assets'))badAssets.push(r.url());});
    await tab.goto('http://127.0.0.1:8767/demo-study-garden.html?view=timer&theme='+theme);
    await tab.waitForFunction(()=>window.KMA_STUDY_GARDEN&&document.querySelector('.garden-collection-link:not(:disabled)'),null,{timeout:10000});
    await tab.waitForFunction(()=>Math.abs(document.getElementById('side-planner-drawer').getBoundingClientRect().right-innerWidth)<1);
    return tab;
  }
  const state=tab=>tab.evaluate(()=>window.KMA_STUDY_GARDEN.getState());
  try{
    const a=await fixture('dark');
    step='collection, placement and drag';
    assert(await a.locator('#study-garden .garden-plot').count()===6,'garden slot count');
    assert(await a.locator('#study-garden .garden-seed').count()===5,'seed rack count');
    await a.locator('#study-garden .garden-collection-link').click();
    assert(await a.locator('.garden-unknown').count()===1,'unknown item silhouette');
    assert(await a.locator('.garden-showcase-slot').count()===15,'showcase dimensions');
    const board=a.locator('#garden-collection-dialog');
    await board.locator('[data-item="coal"]').click();
    assert(await board.locator('.garden-showcase-slot.is-target').count()===1,'more than one default drop target');
    await board.screenshot({path:root+'/output/playwright/garden-collection-dark.png'});
    await board.locator('[data-garden-slot="3"]').click();
    await board.getByRole('button',{name:'Lưu bố cục',exact:true}).click();
    await a.waitForFunction(()=>window.KMA_STUDY_GARDEN.getState().layout[3]==='coal');
    await board.locator('[data-garden-slot="3"]').click();
    await board.getByRole('button',{name:'Cất vào kho',exact:true}).click();
    await board.getByRole('button',{name:'Lưu bố cục',exact:true}).click();
    await a.waitForFunction(()=>window.KMA_STUDY_GARDEN.getState().layout[3]===null);
    await board.locator('[data-item="azure"]').dragTo(board.locator('[data-garden-slot="6"]'));
    await board.getByRole('button',{name:'Lưu bố cục',exact:true}).click();
    await a.waitForFunction(()=>window.KMA_STUDY_GARDEN.getState().layout[6]==='azure');
    await board.locator('.garden-close').click();
    step='harvest and plant';
    const beforeHarvest=await state(a);
    await a.locator('[data-garden-harvest="0"]').click();
    await a.waitForSelector('#garden-harvest-dialog[open]');
    const reward=await state(a);
    assert(reward.harvests===beforeHarvest.harvests+1&&reward.plots[0]===null,'harvest duplicated/failed');
    assert(reward.lastReward.item&&reward.items[reward.lastReward.item]===beforeHarvest.items[reward.lastReward.item]+1,'server reward not added once');
    await a.locator('#garden-harvest-dialog').screenshot({path:root+'/output/playwright/garden-harvest-dark.png'});
    await a.locator('#garden-harvest-dialog').getByRole('button',{name:'Về vườn',exact:true}).click();
    assert(await a.locator('.garden-rays').evaluate(e=>getComputedStyle(e).animationName)==='none','closed harvest animation still running');
    await a.locator('[data-garden-plot="4"]').click();
    await a.locator('#garden-plant-dialog [data-seed="oak"]').click();
    await a.locator('#garden-plant-dialog').getByRole('button',{name:'Gieo hạt',exact:true}).click();
    await a.waitForFunction(()=>window.KMA_STUDY_GARDEN.getState().plots[4]?.seed==='oak');
    assert((await state(a)).seeds.oak===beforeHarvest.seeds.oak-1,'plant did not spend a seed');
    assert((await state(a)).plots[4].seconds===0,'click grew plant without study');
    const persisted=await state(a);
    step='reload and simulator';
    await a.reload();
    await a.waitForFunction(()=>window.KMA_STUDY_GARDEN&&document.querySelector('.garden-collection-link:not(:disabled)'));
    assert(JSON.stringify(await state(a))===JSON.stringify(persisted),'garden/layout not restored');
    await a.locator('#study-garden .garden-simulator summary').click();
    const boardBefore=await backend('/rpc',{name:'study_leaderboard',args:{p_period:'today',p_subject:'all'}});
    await a.getByRole('button',{name:'Mẫu: +60 phút',exact:true}).click();
    await a.waitForFunction(()=>{const s=window.KMA_STUDY_GARDEN.getState().seeds;return s.cherry+s.bamboo>1;});
    const boardAfter=await backend('/rpc',{name:'study_leaderboard',args:{p_period:'today',p_subject:'all'}});
    assert(JSON.stringify(boardAfter.data.rows.map(({id,minutes,sessions})=>({id,minutes,sessions})))===JSON.stringify(boardBefore.data.rows.map(({id,minutes,sessions})=>({id,minutes,sessions}))),'preview simulator changed study ranking');
    await a.getByRole('button',{name:'Mẫu: chuỗi 7 ngày',exact:true}).click();
    await a.waitForFunction(()=>window.KMA_STUDY_GARDEN.getState().unlocked);
    assert(!(await a.locator('[data-garden-plot="5"]').isDisabled()),'streak did not unlock sixth plot');
    await a.context().close();
    step='live confirmed time';
    const live=await fixture('light');
    const before=(await state(live)).totalSeconds;
    await live.evaluate(()=>window.KMA_SCHEDULE_POMODORO.toggleSideDrawer(false));
    await live.clock.install();
    for(const subject of ['ktvxl','tthcm','vldc','xstk']){
      step='live confirmed time '+subject;
      await live.locator('#btn-subj-'+subject).click();
      await live.locator('#btn-tab-practice').click();
      await live.locator('#questions-container .option-btn').first().click();
      await live.waitForFunction(()=>window.KMA_STUDY_ACTIVITY.getState().active,null,{timeout:5000});
      const old=(await state(live)).totalSeconds;
      await backend('/shift',{seconds:61});
      await live.clock.fastForward(61000);
      await live.evaluate(()=>window.dispatchEvent(new Event('online')));
      await live.waitForFunction(old=>window.KMA_STUDY_GARDEN.getState().totalSeconds>=old+60,old,{timeout:5000});
    }
    const after=(await state(live)).totalSeconds;
    assert(after>=before+240,'not all four subjects credited garden');
    const snapshot=(await backend('/rpc',{name:'study_snapshot'})).data;
    for(const subject of ['ktvxl','tthcm','vldc','xstk'])assert(Object.values(snapshot.records).some(r=>r.kind==='study'&&r.subject===subject&&r.value>=1),'missing confirmed subject '+subject);
    await live.context().close();
    for(const [theme,width] of [['dark',390],['light',320]]){
      await backend('/reset');
      step='mobile '+theme+' '+width;
      const mobile=await fixture(theme,width);
      assert(await mobile.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'mobile page overflow '+width);
      assert(await mobile.locator('#study-garden').evaluate(e=>{const r=e.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth;}),'garden overflow '+width);
      await mobile.locator('#study-garden .garden-collection-link').tap();
      const modal=mobile.locator('#garden-collection-dialog');
      assert(await modal.evaluate(e=>e.scrollWidth<=e.clientWidth),'mobile collection overflow '+width);
      await modal.locator('[data-item="coal"]').tap();
      await modal.locator('[data-garden-slot="3"]').tap();
      await modal.getByRole('button',{name:'Lưu bố cục',exact:true}).tap();
      await mobile.waitForFunction(()=>window.KMA_STUDY_GARDEN.getState().layout[3]==='coal');
      await modal.screenshot({path:root+'/output/playwright/garden-collection-mobile-'+theme+'.png'});
      await modal.locator('.garden-close').tap();
      await mobile.locator('[data-garden-harvest="0"]').tap();
      const harvest=mobile.locator('#garden-harvest-dialog');
      assert(await harvest.evaluate(e=>e.scrollWidth<=e.clientWidth),'mobile harvest overflow '+width);
      await harvest.getByRole('button',{name:'Về vườn',exact:true}).tap();
      await mobile.context().close();
    }
    assert(errors.length===0,'page errors: '+errors.join(';'));assert(badAssets.length===0,'missing garden artwork');
    return {pass:true,checks:'6 plots; seeds; mature-only harvest; pity; plant; mouse drag; touch placement; save/reload; streak; confirmed time across all 4 subjects; isolated simulator; light/dark; 320/390px',confirmedSeconds:after-before};
  }catch(error){throw new Error(step+': '+error.message);}finally{for(const ctx of contexts)await ctx.close().catch(()=>{});}
}
