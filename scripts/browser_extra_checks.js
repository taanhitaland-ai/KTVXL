// Run after browser_checks.js in the same local preview session.
async (page) => {
  const base = page.url().split('/').slice(0,3).join('/');
  const checks = [];
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const assert = (value, message) => { if (!value) throw new Error(message); };
  const slider = (id, value) => page.locator('#'+id).evaluate((el,value) => {
    el.value = value;
    el.dispatchEvent(new Event('input', { bubbles:true }));
  }, String(value));
  try {
    await page.goto(base+'/web/index.html');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.locator('#btn-subj-tthcm').click();
    await page.locator('#btn-tab-practice').click();
    await page.locator('#filter-source').selectOption('TTHCM_FULL_A');
    const prompts = [
      ['Kiên trì con đường Hồ Chí Minh đã lựa chọn', 'TTHCM_FA_094'],
      ['Điều mong muốn cuối cùng của Hồ Chí Minh', 'TTHCM_FA_094_2']
    ];
    for(const [prompt,id] of prompts) {
      await page.locator('#search-input').fill(prompt);
      await page.locator('#q-card-'+id).waitFor();
      await page.locator('#q-card-'+id+' .option-btn[data-letter="A"]').click();
    }
    assert(await page.locator('#stat-answered-count').textContent() === '2', 'Former duplicate IDs still overwrite each other');
    await page.locator('#q-card-TTHCM_FA_094_2 .q-star-btn').click();
    await page.reload();
    assert(await page.locator('#stat-answered-count').textContent() === '2', 'Practice answers did not survive reload');
    await page.locator('[data-status="STARRED"]').click();
    assert(await page.locator('#q-card-TTHCM_FA_094_2').count() === 1, 'Saved stars did not survive reload');
    await page.locator('#btn-subj-vldc').click();
    assert(await page.locator('#search-input').inputValue() === '', 'Search leaked into another subject');
    assert(await page.locator('[data-status="ALL"]').getAttribute('class').then(x=>x.includes('active')), 'Status leaked into another subject');
    checks.push('separate answer IDs, persistence, stars, filter reset');

    await page.locator('#btn-tab-knowledge').click();
    assert(await page.locator('.chapter-title').count() === 7, 'Physics chapters or Casio guide missing');
    assert(await page.locator('#knowledge-chapters-container .katex').count() >= 30, 'Core formulas are not rendered');
    assert(!(await page.locator('#knowledge-chapters-container').textContent()).includes('undefined'), 'Undefined chapter labels');
    const firstHeader = page.locator('.chapter-header').first();
    await firstHeader.click();
    assert(await firstHeader.getAttribute('aria-expanded') === 'false', 'Chapter collapse failed');
    await firstHeader.press('Enter');
    assert(await firstHeader.getAttribute('aria-expanded') === 'true', 'Chapter keyboard expand failed');
    checks.push('knowledge formulas, Casio guide, keyboard chapter controls');

    await page.locator('#btn-tab-download').click();
    assert(await page.locator('.download-card').count() === 6, 'Incomplete download catalog');
    const files = await page.locator('#tab-download a[download]').evaluateAll(links => links.map(link=>link.href));
    const downloads = await page.evaluate(async files => Promise.all(files.map(async url => {
      const response = await fetch(url);
      const bytes = new Uint8Array(await response.arrayBuffer());
      return {url, ok:response.ok, signature:String.fromCharCode(...bytes.slice(0,5))};
    })), files);
    assert(downloads.every(file=>file.ok&&file.signature==='%PDF-'), 'Missing or invalid PDF download');
    checks.push('all six PDF downloads return valid PDF files');

    await page.locator('#btn-tab-visualize').click();
    for(const [module, canvas] of [['young','cv-young'],['diffraction','cv-diffraction'],['photoelectric','cv-photoelectric'],['compton','cv-compton'],['quantum','cv-quantum'],['polarization','cv-polarization']]) {
      await page.locator('.sim-nav-btn[data-sim="'+module+'"]').click();
      await page.waitForTimeout(150);
      const drawn = await page.locator('#'+canvas).evaluate(canvas => canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height).data.some((value,index)=>index%4===3&&value>0));
      assert(drawn, 'Blank simulation canvas: '+module);
    }
    await slider('sl-polar-alpha',90);
    assert(await page.locator('#out-polar-ratio').textContent() === '0.0% I₀','Crossed polarizers should extinguish light');
    await page.locator('#chk-polar-mid').check();
    assert(await page.locator('#out-polar-ratio').textContent() === '12.5% I₀','Middle polarizer result incorrect');
    await page.locator('.sim-nav-btn[data-sim="diffraction"]').click();
    await page.locator('input[name="diff-mode"][value="grating"]').check();
    assert((await page.locator('#out-diff-phi').textContent()).includes('k_max = 5'), 'Grating readout failed at an exact integer boundary');
    await slider('sl-diff-d',5);
    assert((await page.locator('#out-diff-phi').textContent()).includes('k_max = 10'), 'Grating slider did not update result');
    await page.locator('.sim-nav-btn[data-sim="quantum"]').click();
    await slider('sl-quantum-n',3);
    assert(await page.locator('#out-quantum-en').textContent() === '3.384 eV', 'Quantum control did not update energy');
    checks.push('six nonblank simulations; polarizer, grating and quantum controls');

    await page.evaluate(() => {localStorage.setItem('kma_active_subject','invalid');localStorage.setItem('kma_user_answers_ktvxl_v2','null');localStorage.setItem('kma_starred_questions_ktvxl_v2','{}');});
    await page.reload();
    assert(await page.locator('#app-brand-badge').textContent() === '⚡ KTVXL','Invalid saved subject not recovered');
    assert(await page.locator('#questions-container .question-card').count() === 100,'Malformed saved state stopped the app');
    await page.addInitScript(() => {
      if(location.search.includes('storage=blocked')) Object.defineProperty(window,'localStorage',{get(){throw new Error('storage blocked');}});
    });
    await page.goto(base+'/web/index.html?storage=blocked');
    await page.locator('#questions-container .option-btn').first().click();
    assert(await page.locator('#stat-answered-count').textContent() === '1','Practice unusable without storage');
    checks.push('invalid, malformed and unavailable storage recovery');

    await page.route('https://**', route => route.abort());
    await page.goto(base+'/docs/index.html');
    await page.locator('#btn-subj-vldc').click();
    assert(await page.locator('#questions-container .katex').count() > 100,'Local formulas need an external CDN');
    await page.locator('#btn-tab-exam').click();
    await page.locator('.exam-card-choice[data-exam-code="NOTION_DE_CUOI"]').click();
    assert((await page.locator('#exam-setup-title').textContent()).includes('VẬT LÝ'), 'Deployed copy has wrong subject');
    checks.push('GitHub Pages copy and formulas work with external requests blocked');
    await page.setViewportSize({width:390,height:844});
    for(const tab of ['practice','exam','knowledge','download','visualize']) {
      await page.locator('#btn-tab-'+tab).click();
      const size = await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));
      assert(size.scroll <= size.width+2,'Mobile overflow in '+tab+': '+JSON.stringify(size));
    }
    await page.locator('#btn-tab-exam').click();
    await page.screenshot({path:'../outputs/thi-thu-vat-ly-mobile.png',fullPage:true,animations:'disabled'});
    await page.setViewportSize({width:1440,height:1000});
    await page.screenshot({path:'../outputs/thi-thu-vat-ly.png',fullPage:true,animations:'disabled'});
    checks.push('five tabs fit a 390px mobile viewport');
    assert(errors.length===0,'Browser errors: '+errors.join('; '));
    const report = {complete:true,checks,browserErrors:errors};
    await page.evaluate(report=>window.__KMA_EXTRA_REPORT=report,report);
    return report;
  } catch(error) {
    await page.evaluate(report=>window.__KMA_EXTRA_REPORT=report,{complete:false,checks,error:error.message});
    throw error;
  }
}
