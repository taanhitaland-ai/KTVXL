// Playwright CLI run-code. Auth and RPC are fixtures in isolated contexts; no live account or DB is used.
async (page) => {
  const browser = page.context().browser(), results = [], errors = [];
  const uid = '11111111-1111-4111-8111-111111111111';
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  const clone = data => JSON.parse(JSON.stringify(data));
  async function fixture(name, options = {}) {
    const context = await browser.newContext({viewport:{width:options.mobile ? 390 : 1280,height:900},hasTouch:!!options.mobile,isMobile:!!options.mobile});
    const tab = await context.newPage();
    tab.on('pageerror', error => errors.push(error.message));
    let logged = options.logged !== false, failSave = false, failSnapshot = !!options.failSnapshot;
    let profile = {nickname:name, leaderboard_opt_in:true};
    const records = {
      'answer|ktvxl|DE001_Q02': {kind:'answer',subject:'ktvxl',id:'DE001_Q02',value:{answer:'A',isCorrect:true},version:1},
      'study|ktvxl|2026-10-09': {kind:'study',subject:'ktvxl',id:'2026-10-09',value:60,version:1},
    };
    let heldSnapshot, releaseSnapshot, resolveAuth;
    const authWait = options.holdAuth ? new Promise(resolve => {resolveAuth = resolve;}) : null;
    const snapshot = () => ({profile:clone(profile),records:clone(records)});
    const calls = [];
    await context.exposeFunction('__fixtureSession', async () => {
      if (authWait) await authWait;
      return {data:{session:logged ? {user:{id:uid,is_anonymous:!!options.anonymous,user_metadata:{full_name:'Google account name'}}} : null}};
    });
    await context.exposeFunction('__fixtureLogin', () => {logged=true;return {id:uid};});
    await context.exposeFunction('__fixtureLogout', () => {logged=false;return null;});
    await context.exposeFunction('__fixtureRpc', async (name, args={}) => {
      calls.push({name,args:clone(args)});
      if (name === 'study_snapshot') {
        if (failSnapshot) return {error:{message:'Fixture temporarily unavailable'}};
        const data = snapshot();
        if (heldSnapshot) {heldSnapshot=false; await new Promise(resolve => {releaseSnapshot=resolve;});}
        return {data};
      }
      if (name === 'study_set_profile') {
        if (failSave) {failSave=false;return {error:{message:'Fixture save failed; please retry'}};}
        profile = {nickname:args.p_nickname,leaderboard_opt_in:true};
        return {data:clone(profile)};
      }
      if (name === 'study_focus_current') return {data:null};
      if (name === 'study_leaderboard') return {data:{remote:true,rows:[{id:uid,nickname:profile.nickname,minutes:60,sessions:2,rank:1}],me:logged ? {id:uid,nickname:profile.nickname,minutes:60,sessions:2,rank:1,joined:true} : null}};
      if (name === 'study_sync') {
        for (const op of args.p_operations) records[op.rid]={kind:op.kind,subject:op.subject,id:op.id,value:op.kind==='study' ? (records[op.rid]?.value || 0)+op.delta : op.value,version:(records[op.rid]?.version || 0)+1};
        return {data:{...snapshot(),accepted:args.p_operations.map(op=>op.opId),conflicts:[]}};
      }
      throw new Error('Unexpected fixture RPC '+name);
    });
    await context.route('**/*.supabase.co/**', route => route.abort());
    await context.route('**/cloud_config.js*', route => route.fulfill({contentType:'text/javascript',body:'window.KMA_CLOUD_CONFIG={url:"https://fixture.invalid",publishableKey:"fixture-only"};'}));
    await context.route('**/vendor/supabase/supabase.js*', route => route.fulfill({contentType:'text/javascript',body:`
      window.supabase={createClient:()=>({rpc:(name,args)=>window.__fixtureRpc(name,args),auth:{
        getSession:()=>window.__fixtureSession(),
        onAuthStateChange:callback=>{window.__fixtureAuth=callback;return {data:{subscription:{unsubscribe(){}}}};},
        signInWithOAuth:async()=>{const user=await window.__fixtureLogin();setTimeout(()=>window.__fixtureAuth('SIGNED_IN',{user}),0);return {error:null};},
        signOut:async()=>{await window.__fixtureLogout();setTimeout(()=>window.__fixtureAuth('SIGNED_OUT',null),0);return {error:null};}
      }})};` }));
    await context.addInitScript(({uid,logged,importGuest,owner}) => {
      if (logged || owner) localStorage.setItem('kma_cloud_v1:owner',uid);
      if (!importGuest) localStorage.setItem('kma_cloud_v1:'+uid+':guest-decision','skip');
      if (importGuest) {
        localStorage.setItem('kma_user_answers_ktvxl_v2',JSON.stringify({DE001_Q02:{answer:'B',isCorrect:false},DE001_Q03:{answer:'A',isCorrect:true}}));
      }
    },{uid,logged:logged && !options.anonymous,importGuest:!!options.importGuest,owner:!!options.owner});
    await tab.goto('http://127.0.0.1:8766/KTVXL/web/index.html?preview=login-username&theme=dark');
    await tab.locator('#sync-account-button').waitFor();
    if (!options.holdAuth) await tab.waitForFunction(() => window.KMA_ACCOUNT?.getState().access !== 'checking' || document.querySelector('#sync-guest-notice')?.hidden);
    return {context,tab,records,calls,get profile(){return profile;},failNextSave(){failSave=true;},retrySnapshot(){failSnapshot=false;},holdNextSnapshot(){heldSnapshot=true;},releaseSnapshot(){releaseSnapshot();},releaseAuth(){resolveAuth();}};
  }

  const guest = await fixture('Người học',{logged:false,importGuest:true,mobile:true});
  const {tab:g} = guest;
  await g.waitForFunction(() => window.KMA_ACCOUNT.getState().access==='guest');
  const guestAnswers = await g.evaluate(() => localStorage.getItem('kma_user_answers_ktvxl_v2'));
  for (const subject of ['ktvxl','tthcm','vldc','xstk']) {
    await g.locator('#btn-subj-'+subject).click();
    const card = g.locator('#questions-container .question-card').first();
    await card.locator('.option-btn').first().click();
    await g.locator('#sync-account-dialog').waitFor({state:'visible'});
    assert((await g.locator('#sync-modal-title').innerText()).includes('Đăng nhập để bảo vệ tiến trình'),'No account prompt '+subject);
    assert(await card.locator('.selected-correct,.selected-wrong,.highlight-correct').count()===0,'Guest answer selected '+subject);
    await g.keyboard.press('Escape');
  }
  assert(await g.evaluate(() => localStorage.getItem('kma_user_answers_ktvxl_v2'))===guestAnswers,'Guest progress was modified');
  await g.locator('#btn-tab-exam').click();await g.locator('#btn-start-exam').click();
  assert(await g.locator('#exam-questions-list .question-card').count()===0,'Guest started exam timer');
  await g.keyboard.press('Escape');await g.locator('#btn-tab-practice').click();
  await g.locator('#sync-account-button').click();
  await g.getByRole('button',{name:'Tiếp tục với Google',exact:true}).click();
  await g.locator('#sync-username').waitFor();
  assert(await g.evaluate(() => document.activeElement.id)==='sync-username','Username not focused');
  const save = g.getByRole('button',{name:'Lưu tên và tiếp tục',exact:true});
  assert(await save.isDisabled(),'Empty name accepted');
  await g.keyboard.press('Escape');assert(await g.locator('#sync-account-dialog').isVisible(),'Required form dismissed');
  for (const invalid of ['Người học','Anonymous','<img src=x onerror=alert(1)>']) {
    await g.locator('#sync-username').fill(invalid);assert(await save.isDisabled(),'Invalid name accepted '+invalid);
  }
  assert(await g.locator('#sync-account-dialog img').count()===0,'Username became markup');
  await g.locator('#sync-username').fill('Linh chăm học');
  await g.evaluate(() => window.KMA_ACCOUNT.sync());
  assert(await g.locator('#sync-username').inputValue()==='Linh chăm học','Sync erased draft');
  guest.failNextSave();await save.click();
  await g.locator('#sync-username-error').filter({hasText:'Fixture save failed'}).waitFor();
  assert(await g.locator('#sync-username').inputValue()==='Linh chăm học','Failed save erased draft');
  assert(await g.evaluate(() => window.KMA_ACCOUNT.getState().access)==='username','Failed save allowed answers');
  await save.click();
  await g.getByRole('button',{name:'Đưa dữ liệu này vào tài khoản',exact:true}).waitFor();
  assert(guest.profile.nickname==='Linh chăm học','Profile name was not saved');
  await g.getByRole('button',{name:'Đưa dữ liệu này vào tài khoản',exact:true}).click();
  await g.locator('#sync-account-dialog').waitFor({state:'hidden'});
  await g.waitForFunction(() => window.KMA_ACCOUNT.getState().queue===0);
  assert(guest.records['answer|ktvxl|DE001_Q02'].value.answer==='A','Guest import overwrote cloud progress');
  assert(guest.records['answer|ktvxl|DE001_Q03'].value.answer==='A','Guest progress not imported');
  assert(guest.records['study|ktvxl|2026-10-09'].value===60,'Rename changed study minutes');
  await g.locator('#btn-subj-ktvxl').click();
  await g.locator('#questions-container .question-card').first().locator('.option-btn').first().click();
  await g.waitForFunction(() => window.KMA_ACCOUNT.getState().queue===0);
  assert(guest.records['answer|ktvxl|DE001_Q01']?.value.answer==='A','Signed-in answer was not recorded: '+JSON.stringify(guest.records));
  await g.locator('#study-tools-toggle').tap();await g.locator('#leaderboard-trigger').tap();
  assert((await g.locator('#leaderboard-dialog').innerText()).includes('Linh chăm học'),'Leaderboard kept default name');
  await g.keyboard.press('Escape');
  await g.locator('#sync-account-button').click();
  await g.screenshot({path:'output/playwright/account-profile-mobile-dark.png'});
  await guest.context.close();results.push('Guest gate for four subjects/exam, Google flow, required name, failed save, import, progress and ranking');

  for (const name of ['', 'Người học', 'Anonymous']) {
    const f = await fixture(name,{mobile:name==='Người học'}),p=f.tab;
    await p.locator('#sync-username').waitFor();
    assert(await p.locator('#sync-username').inputValue()==='','Default Google name silently reused');
    await p.locator('#sync-username').fill('Tiếng Việt');
    if (name==='Người học') {
      await p.screenshot({path:'output/playwright/account-username-dark.png'});
      await p.keyboard.press('Escape');
      await p.evaluate(() => document.body.classList.remove('dark-mode'));
      await p.screenshot({path:'output/playwright/account-username-light.png'});
    }
    f.holdNextSnapshot();
    await p.evaluate(() => {window.__pendingSnapshot = window.KMA_ACCOUNT.sync();});
    await p.getByRole('button',{name:'Lưu tên và tiếp tục',exact:true}).click();
    await p.locator('#sync-account-dialog').waitFor({state:'hidden'});
    f.releaseSnapshot();await p.evaluate(() => window.__pendingSnapshot);
    assert(await p.evaluate(() => window.KMA_ACCOUNT.getState().nickname)==='Tiếng Việt','Stale snapshot reverted saved name');
    assert(await p.evaluate(() => window.KMA_ACCOUNT.getState().access)==='ready','Valid name still blocked');
    await p.reload();await p.waitForFunction(() => window.KMA_ACCOUNT?.getState().access==='ready');
    assert(!await p.locator('#sync-account-dialog').isVisible(),'Returning named account asked again');
    await f.context.close();
  }
  results.push('Existing unnamed accounts, Vietnamese NFC, stale sync response and reload');
  const existing = await fixture('henise');
  await existing.tab.waitForFunction(() => window.KMA_ACCOUNT.getState().access==='ready');
  assert(!await existing.tab.locator('#sync-account-dialog').isVisible(),'Existing valid name asked again');
  await existing.tab.locator('#sync-account-button').click();
  await existing.tab.locator('#sync-nickname').fill('Anonymous');
  assert(await existing.tab.getByRole('button',{name:'Lưu hồ sơ',exact:true}).isDisabled(),'Profile edit bypassed name rule');
  await existing.context.close();results.push('Valid existing nickname kept; profile editor validates replacement');

  const pending = await fixture('henise',{holdAuth:true,owner:true});
  await pending.tab.locator('#questions-container .option-btn').first().click();
  assert((await pending.tab.locator('#sync-modal-title').innerText()).includes('Đang kiểm tra'),'Cached owner bypassed auth check');
  pending.releaseAuth();await pending.tab.waitForFunction(() => window.KMA_ACCOUNT.getState().access==='ready');
  await pending.context.close();
  const failed = await fixture('henise',{failSnapshot:true});
  await failed.tab.locator('#questions-container .option-btn').first().click();
  assert(await failed.tab.locator('#sync-username').count()===0,'Fetch failure demanded overwriting existing name');
  failed.retrySnapshot();await failed.tab.getByRole('button',{name:'Thử lại',exact:true}).click();
  await failed.tab.waitForFunction(() => window.KMA_ACCOUNT.getState().access==='ready');
  await failed.context.close();
  const anon = await fixture('Người học',{anonymous:true});
  await anon.tab.waitForFunction(() => window.KMA_ACCOUNT.getState().access==='guest');
  await anon.tab.locator('#questions-container .option-btn').first().click();
  assert((await anon.tab.locator('#sync-modal-title').innerText()).includes('Đăng nhập'),'Anonymous session bypassed Google');
  await anon.context.close();results.push('Unresolved auth, unavailable profile with retry, and anonymous session');
  assert(errors.length===0,errors.join('\n'));
  return {results,errors};
}

