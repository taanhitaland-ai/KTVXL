async(page)=>{
  const browser=page.context().browser(),root="C:/Users/Admin'/Documents/Codex/2026-10-07/s/outputs/KTVXL";
  const assert=(ok,msg)=>{if(!ok)throw new Error(msg);};
  for(const [width,theme] of [[1280,'light'],[1280,'dark'],[390,'light'],[390,'dark']]){
    const context=await browser.newContext({viewport:{width,height:900},isMobile:width===390,hasTouch:width===390});
    const tab=await context.newPage();
    try {
      await context.route('**/cloud_config.js*',r=>r.fulfill({contentType:'text/javascript',body:'window.KMA_CLOUD_CONFIG={url:"https://fixture.invalid",publishableKey:"fixture-only"};'}));
      await context.route('**/vendor/supabase/supabase.js*',r=>r.fulfill({contentType:'text/javascript',body:'window.supabase={createClient:()=>({auth:{getSession:async()=>({data:{session:null}}),onAuthStateChange:()=>({})}})};'}));
      await tab.goto('http://127.0.0.1:8766/KTVXL/web/index.html?theme='+theme);
      await tab.locator('#sync-account-button').click();
      const footer=tab.locator('.sync-welcome-footer');await footer.waitFor({state:'visible'});
      const later=await footer.locator('button').boundingBox(),privacy=await footer.locator('a').boundingBox();
      assert(privacy.x>=later.x+later.width+16 || privacy.y>=later.y+later.height+7,'footer links touch '+width+theme);
      assert(privacy.x>=0&&privacy.x+privacy.width<=width,'privacy link overflow');
      await tab.screenshot({path:root+'/output/playwright/login-footer-'+width+'-'+theme+'.png'});
      const policy=await context.newPage();await policy.goto('http://127.0.0.1:8766/KTVXL/web/privacy.html');
      assert((await policy.locator('main').innerText()).length<1900,'policy too long');
      assert(await policy.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'policy mobile overflow');
    }finally{await context.close();}
  }
}
