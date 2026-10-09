// CLI run-code; separate ephemeral garden database at 8772, never production/interactive.
async(page)=>{
  const browser=page.context().browser(),contexts=[],errors=[],assert=(ok,msg)=>{if(!ok)throw new Error(msg);};
  const backend=async(name,args={})=>(await page.request.post('http://127.0.0.1:8772/rpc',{data:{name,args}})).json();
  await page.request.post('http://127.0.0.1:8772/reset',{data:{}});
  async function load(theme,width=1280){
    const ctx=await browser.newContext({viewport:{width,height:1000},isMobile:width<760,hasTouch:width<760});contexts.push(ctx);ctx.setDefaultTimeout(12000);
    await ctx.route('http://127.0.0.1:8771/rpc',async route=>{const response=await route.fetch({url:'http://127.0.0.1:8772/rpc'});await route.fulfill({response});});
    const p=await ctx.newPage();p.on('pageerror',e=>errors.push(e.message));
    await p.goto('http://127.0.0.1:8767/demo-study-garden.html?view=timer&theme='+theme+'&preview=profile-showcase');
    await p.waitForFunction(()=>window.KMA_STUDY_GARDEN&&document.querySelector('.garden-collection-link:not(:disabled)'));
    await p.waitForFunction(()=>Math.abs(document.getElementById('side-planner-drawer').getBoundingClientRect().right-innerWidth)<1);
    return p;
  }
  let stage='load';
  try{
    const a=await load('dark');
    stage='centered editor';await a.locator('.garden-collection-link').click();
    const position=await a.locator('#garden-collection-dialog').evaluate(n=>{const r=n.getBoundingClientRect();return {center:(r.left+r.right)/2,width:r.width,scroll:n.scrollWidth,client:n.clientWidth};});
    assert(Math.abs(position.center-640)<2,'editor not centered');assert(position.scroll<=position.client+1,'editor overflow');
    await a.locator('#garden-collection-dialog [data-garden-slot="0"]').click();await a.locator('#garden-collection-dialog [data-garden-slot="3"]').click();
    await a.getByRole('button',{name:'Lưu bố cục',exact:true}).click();
    await a.waitForFunction(()=>document.querySelector('#garden-collection-dialog button.garden-primary').disabled);
    const saved=(await backend('study_garden_snapshot')).data;assert(saved.state.layout[3]==='coal','layout not saved in database');assert(saved.asset_value===1410,'asset value used display value');
    await a.locator('#garden-collection-dialog .garden-close').click();
    stage='account tabs';await a.evaluate(()=>window.KMA_ACCOUNT.openAccount());
    await a.getByRole('tab',{name:'Trưng bày',exact:true}).click();await a.waitForFunction(()=>document.querySelector('#garden-profile-exhibition .garden-showcase-slot'));
    assert(await a.locator('#garden-profile-exhibition .garden-showcase-slot').count()===15,'account display missing');assert(await a.locator('#garden-profile-progress').isHidden(),'progress and display visible together');
    assert((await a.locator('#garden-profile-exhibition').innerText()).includes('1.410'),'account total value wrong');
    assert(await a.getByRole('tab',{name:'Trưng bày',exact:true}).evaluate(n=>getComputedStyle(n).backgroundColor)==='rgb(243, 223, 120)','dark active tab not highlighted');
    await a.locator('#sync-account-dialog').screenshot({path:"C:/Users/Admin'/Documents/Codex/2026-10-07/s/outputs/KTVXL/output/playwright/garden-profile-dark.png"});
    await a.getByRole('tab',{name:'Tiến trình',exact:true}).click();assert(await a.locator('.sync-summary').isVisible(),'progress lost');
    await a.locator('#sync-account-dialog .sync-dialog-close').click();
    stage='leaderboard';await a.evaluate(()=>window.KMA_LEADERBOARD_PREVIEW.open());
    await a.waitForFunction(()=>document.querySelectorAll('#leaderboard-dialog .lb-asset-value').length>=3);
    assert((await a.locator('#leaderboard-dialog .lb-podium-card[data-place="1"]').innerText()).includes('Bạn thử'),'assets changed study-time ranking');
    await a.locator('#leaderboard-dialog').screenshot({path:"C:/Users/Admin'/Documents/Codex/2026-10-07/s/outputs/KTVXL/output/playwright/garden-leaderboard-dark.png"});
    await a.getByRole('button',{name:'Xem bộ sưu tập của Linh chăm học',exact:true}).click();await a.waitForFunction(()=>document.querySelector('#garden-public-dialog .garden-showcase-slot'));
    assert((await a.locator('#garden-public-dialog').innerText()).includes('2.210'),'other collection not loaded');assert(await a.locator('#garden-public-dialog .garden-showcase-slot').count()===15,'other display missing');
    assert(await a.locator('#garden-public-dialog .garden-profile-edit').count()===0,'public edit control exposed');
    await a.locator('#garden-public-dialog').screenshot({path:"C:/Users/Admin'/Documents/Codex/2026-10-07/s/outputs/KTVXL/output/playwright/garden-public-dark.png"});
    await a.locator('#garden-public-dialog .garden-close').click();await a.locator('#leaderboard-dialog .lb-close').click();
    stage='fresh device';const b=await load('light');const second=await b.evaluate(()=>window.KMA_STUDY_GARDEN.getState());assert(JSON.stringify(second.layout)===JSON.stringify(saved.state.layout),'fresh device did not restore showcase');
    await b.evaluate(()=>window.KMA_ACCOUNT.openAccount());await b.getByRole('tab',{name:'Trưng bày',exact:true}).click();
    await b.locator('#sync-account-dialog').screenshot({path:"C:/Users/Admin'/Documents/Codex/2026-10-07/s/outputs/KTVXL/output/playwright/garden-profile-light.png"});await b.locator('#sync-account-dialog .sync-dialog-close').click();
    stage='concurrent harvest';const first=a.locator('[data-garden-harvest="0"]'),secondButton=b.locator('[data-garden-harvest="0"]');await Promise.all([first.click(),secondButton.click()]);
    await a.waitForFunction(()=>window.KMA_STUDY_GARDEN.getState().harvests===1);await b.waitForFunction(()=>window.KMA_STUDY_GARDEN.getState().harvests===1);
    assert((await backend('study_garden_snapshot')).data.state.harvests===1,'double harvest in separate browsers');
    for(const [theme,width] of [['dark',390],['light',320]]){
      stage='mobile '+theme;const p=await load(theme,width);await p.evaluate(()=>window.KMA_ACCOUNT.openAccount());await p.getByRole('tab',{name:'Trưng bày',exact:true}).click();
      await p.waitForFunction(()=>document.querySelector('#garden-profile-exhibition .garden-showcase-slot'));
      assert(await p.locator('#sync-account-dialog').evaluate(n=>n.scrollWidth<=n.clientWidth+1),'mobile profile overflow');
      await p.locator('#sync-account-dialog').screenshot({path:"C:/Users/Admin'/Documents/Codex/2026-10-07/s/outputs/KTVXL/output/playwright/garden-profile-mobile-"+theme+'.png'});
      await p.locator('#sync-account-dialog .sync-dialog-close').click();await p.locator('.garden-collection-link').click();
      const box=await p.locator('#garden-collection-dialog').evaluate(n=>{const r=n.getBoundingClientRect();return {center:(r.left+r.right)/2,width:innerWidth,scroll:n.scrollWidth,client:n.clientWidth};});
      assert(Math.abs(box.center-box.width/2)<2&&box.scroll<=box.client+1,'mobile editor alignment/overflow');
    }
    assert(!errors.length,errors.join('; '));return {pass:true,checks:'centered modal; account tabs; lifetime assets; server saved layout restored on fresh device; public collection privacy; study ranks unchanged; concurrent harvest; light/dark 320/390px'};
  }catch(error){throw new Error(stage+': '+error.message);}finally{for(const ctx of contexts)await ctx.close();}
}
