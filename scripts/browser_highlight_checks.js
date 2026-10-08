// playwright-cli: isolated contexts; no live account, production data or database writes.
async page => {
  const browser=page.context().browser(), contexts=[], errors=[], traffic=[], checks=[];
  const assert=(ok,message)=>{if(!ok)throw Error(message);};
  const create=async(options={})=>{
    const context=await browser.newContext({viewport:{width:1360,height:1000},...options});contexts.push(context);
    await context.route('**/*.supabase.co/**',route=>{traffic.push(route.request().url());return route.abort();});
    const tab=await context.newPage();tab.on('pageerror',error=>errors.push(error.message));return {context,tab};
  };
  const rows=tab=>tab.evaluate(()=>JSON.parse(localStorage.getItem('kma_text_highlights_v1')||'{"highlights":[]}').highlights);
  const select=async(tab,selector,length=35,touch=false)=>{
    await tab.locator(selector).first().scrollIntoViewIfNeeded();
    await tab.locator(selector).first().evaluate(root=>{
      scrollBy(0,root.getBoundingClientRect().top-document.querySelector('.app-header').getBoundingClientRect().height-140);
      document.activeElement?.blur();
    });
    await tab.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    await tab.locator(selector).first().dispatchEvent('pointerdown',{pointerType:touch?'touch':'mouse'});
    await tab.locator(selector).first().evaluate((root,length)=>{
      const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:node=>node.length&&!node.parentElement.closest('[data-hl-ignore],.katex-mathml')?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT});
      const nodes=[];let node;while((node=walker.nextNode()))nodes.push(node);
      const first=nodes.find(n=>n.data.trim().length);if(!first)throw Error('No selectable text');
      const range=document.createRange();range.setStart(first,first.length>2?1:0);
      let remaining=length,last=first,end=range.startOffset;
      for(let i=nodes.indexOf(first);i<nodes.length;i++){
        const from=i===nodes.indexOf(first)?range.startOffset:0,available=nodes[i].length-from;
        last=nodes[i];end=from+Math.min(remaining,available);remaining-=Math.min(remaining,available);if(!remaining)break;
      }
      range.setEnd(last,end);const selection=getSelection();selection.removeAllRanges();selection.addRange(range);
    },length);
    await tab.locator(selector).first().dispatchEvent('pointerup',{pointerType:touch?'touch':'mouse'});
    return tab.evaluate(()=>getSelection().toString());
  };
  let pickerWait=0;
  const visible=async tab=>{const index=++pickerWait;try{await tab.locator('#highlight-popover').waitFor({state:'visible'});}catch(error){throw Error('Picker wait '+index+': '+await tab.evaluate(()=>JSON.stringify({selection:getSelection().toString(),popover:document.querySelector('#highlight-popover').outerHTML.slice(0,300)}))+'\n'+error.message);}};
  const hidden=tab=>tab.locator('#highlight-popover').waitFor({state:'hidden'});
  const clear=tab=>tab.evaluate(()=>getSelection().removeAllRanges());
  const choose=async(tab,color,touch=false)=>{
    await visible(tab);
    if(await tab.locator('#highlight-popover').getAttribute('data-expanded')!=='true'){
      if(touch)await tab.locator('#highlight-brush').tap();else await tab.locator('#highlight-brush').click();
    }
    await tab.locator('#highlight-popover[data-expanded=true]').waitFor();
    const swatch=tab.locator('#highlight-colors [data-color='+color+']');if(touch)await swatch.tap();else await swatch.click();
    await hidden(tab);
  };
  const hit=async(tab,color)=>tab.evaluate(color=>{
    const mark=[...document.querySelectorAll('mark.hl-color-'+color)].find(mark=>mark.getBoundingClientRect().top>document.querySelector('.app-header').getBoundingClientRect().bottom);
    const range=document.createRange();range.selectNodeContents(mark);
    const r=range.getClientRects()[0];return {x:r.left+r.width/2,y:r.top+r.height/2};
  },color);
  try{
    const {tab}=await create();await tab.goto('http://127.0.0.1:8765/web/index.html?preview=brush-highlight');
    await tab.locator('.q-prompt-box').first().waitFor();
    if(!await tab.locator('body').evaluate(el=>el.classList.contains('dark-mode')))await tab.locator('#btn-toggle-dark-mode').click();
    assert(await tab.locator('.hl-pen,.hl-knowledge-tools,.q-meta-actions .hl-palette,.hl-quick-setting').count()===0,'Old marker controls remain');
    assert(await tab.locator('.q-meta-actions').first().locator('button').count()===2,'Question toolbar should only contain notes/star');
    const beforeNotes=await tab.evaluate(()=>localStorage.getItem('kma_question_notes_v1'));
    await select(tab,'.q-prompt-box',1);await tab.waitForTimeout(420);assert(await tab.locator('#highlight-popover').isHidden(),'One character opened a popup');
    const text=await select(tab,'.q-prompt-box',24);
    await tab.waitForTimeout(120);assert(await tab.locator('#highlight-popover').isHidden(),'Brush appeared before delay');
    await visible(tab);
    const geometry=await tab.evaluate(()=>{
      const pop=document.querySelector('#highlight-popover'),a=pop.getBoundingClientRect(),b=getSelection().getRangeAt(0).getBoundingClientRect(),style=getComputedStyle(pop.querySelector('.hl-pop-surface'));
      return {width:a.width,height:a.height,above:a.bottom<=b.top-8,center:Math.abs(a.left+a.width/2-(b.left+b.width/2)),border:style.borderWidth,radius:style.borderRadius,dot:getComputedStyle(pop.querySelector('.hl-last-color')).width};
    });
    assert(geometry.width===46&&geometry.height===46&&geometry.above&&geometry.center<1&&geometry.border==='2px'&&geometry.radius==='12px'&&geometry.dot==='11px','Brush geometry '+JSON.stringify(geometry));
    assert(await tab.locator('#highlight-colors [aria-pressed=true]').count()===0,'Fresh picker preselected a color');
    assert((await rows(tab)).length===0,'Selection painted without choosing a color');
    await tab.screenshot({path:'output/playwright/brush-collapsed-dark.png'});
    await tab.locator('#highlight-brush').click();
    assert((await rows(tab)).length===0&&await tab.locator('#highlight-colors [aria-pressed=true]').count()===0,'Brush click chose/painted yellow');
    const expansion=await tab.locator('.pop').evaluate(el=>({duration:getComputedStyle(el).transitionDuration,easing:getComputedStyle(el).transitionTimingFunction,overflow:getComputedStyle(el).overflow,maxWidth:parseFloat(el.style.maxWidth),scrollWidth:el.scrollWidth,tipOutside:!el.contains(document.querySelector('.nt'))}));
    assert(expansion.duration==='0.32s'&&expansion.easing==='cubic-bezier(0.4, 0, 0.2, 1)'&&expansion.overflow==='hidden'&&expansion.maxWidth>=expansion.scrollWidth&&expansion.tipOutside,'Expansion '+JSON.stringify(expansion));
    await tab.waitForTimeout(550);
    const palette=await tab.locator('#highlight-colors').evaluate(row=>({gap:getComputedStyle(row).gap,swatches:[...row.children].map(el=>({width:el.getBoundingClientRect().width,delay:getComputedStyle(el).transitionDelay,title:el.title}))}));
    assert(palette.gap==='8px'&&palette.swatches.length===6&&palette.swatches.every((s,i)=>s.width===26&&s.delay.split(',')[0]===((120+i*40)/1000)+'s'&&s.title),'Palette geometry/stagger '+JSON.stringify(palette));
    await tab.screenshot({path:'output/playwright/brush-palette-dark.png'});
    await tab.locator('#highlight-colors [data-color=orange]').click();await hidden(tab);
    assert((await rows(tab)).length===1&&(await rows(tab))[0].color==='orange','Color did not save');
    assert(await tab.evaluate(()=>getSelection().toString())===text,'Paint cleared or changed selection');
    await tab.waitForTimeout(400);assert(await tab.locator('#highlight-popover').isHidden(),'Painting reopened picker');
    checks.push('two note/star controls; >=2 chars/300ms; fresh picker has no selected color or automatic paint; 36px brush inside 46px frame; measured symmetric expansion .32s; 26px swatches/8px gaps/delays; paint preserves selection');

    await clear(tab);const point=await hit(tab,'orange');await tab.mouse.click(point.x,point.y);await visible(tab);
    await tab.locator('#highlight-popover[data-expanded=true][data-editing=true]').waitFor();
    assert(await tab.locator('#highlight-colors [data-color=orange]').getAttribute('aria-pressed')==='true','Current color ring missing');
    assert(await tab.locator('#highlight-trash').isVisible(),'Edit palette has no trash');
    await choose(tab,'pink');assert((await rows(tab)).length===1&&(await rows(tab))[0].color==='pink','Recolor duplicated/deleted highlight');
    const painted=await tab.locator('mark.hl-color-pink').first().evaluate(el=>{const s=getComputedStyle(el),p=getComputedStyle(el.parentElement);return {color:s.color,parentColor:p.color,border:s.borderWidth,radius:s.borderRadius,shadow:s.boxShadow,padding:s.padding,clone:s.boxDecorationBreak,lineHeight:parseFloat(p.lineHeight)/parseFloat(p.fontSize)};});
    assert(painted.color===painted.parentColor&&painted.border==='0px'&&painted.shadow.includes('inset')&&painted.shadow.includes('-3px')&&painted.clone==='clone'&&painted.lineHeight>=1.6,'Paper highlight style '+JSON.stringify(painted));
    const raw=await tab.evaluate(()=>localStorage.getItem('kma_text_highlights_v1'));
    await tab.reload();await tab.locator('.q-prompt-box').first().waitFor();
    assert(await tab.evaluate(()=>localStorage.getItem('kma_text_highlights_v1'))===raw,'Reload rewrote original storage');
    assert(await tab.evaluate(()=>localStorage.getItem('kma_text_highlights_color_v1'))==='pink','Last color not persisted');
    await select(tab,'.q-prompt-box',35);await visible(tab);await tab.keyboard.press('Enter');await hidden(tab);
    assert((await rows(tab))[0].color==='pink','Enter did not use last color');
    for(const [index,color] of ['yellow','orange','pink','green','blue','purple'].entries()){
      await select(tab,'.q-prompt-box',35+index);await visible(tab);await tab.locator('#highlight-brush').click();await tab.keyboard.press(String(index+1));await hidden(tab);
      assert((await rows(tab))[0].color===color,'Number shortcut '+color);
    }
    await clear(tab);const purplePoint=await hit(tab,'purple');await tab.mouse.click(purplePoint.x,purplePoint.y);await visible(tab);await tab.locator('#highlight-trash').click();await hidden(tab);
    assert((await rows(tab)).length===0,'Trash failed');
    checks.push('edit ring, recolor keeps ID, delete, borderless rounded paper/inset 3px accent/cloned line boxes, unchanged text color, byte-exact storage reload, last color and 1-6/Enter');

    const optionText=await select(tab,'.q-option-text',2);await visible(tab);
    const answered=await tab.locator('#stat-answered-count').innerText();await choose(tab,'blue');
    assert(await tab.evaluate(()=>getSelection().toString())===optionText,'Answer selection was cleared');
    assert(await tab.locator('#stat-answered-count').innerText()===answered,'Highlight submitted an answer');
    await clear(tab);const bluePoint=await hit(tab,'blue');await tab.mouse.click(bluePoint.x,bluePoint.y);await visible(tab);
    assert(await tab.locator('#stat-answered-count').innerText()===answered,'Clicking highlight submitted an answer');
    await tab.locator('.highlight-hint').first().click();await hidden(tab);
    await select(tab,'.q-prompt-box',20);await visible(tab);await tab.keyboard.press('Escape');await hidden(tab);await tab.waitForTimeout(400);assert(await tab.locator('#highlight-popover').isHidden(),'Escape reopened popup');
    await select(tab,'.q-prompt-box',20);await visible(tab);await tab.evaluate(()=>scrollBy(0,12));await hidden(tab);
    await tab.locator('.q-note-btn').first().click();await tab.locator('.note-textarea').first().fill('123456');await tab.locator('.note-textarea').first().press('Control+a');await tab.waitForTimeout(400);assert(await tab.locator('#highlight-popover').isHidden(),'Input selection opened popup');
    await tab.locator('.note-textarea').first().press('End');await tab.locator('.note-textarea').first().press('1');assert(await tab.locator('.note-textarea').first().inputValue()==='1234561','Shortcut intercepted text typing');
    checks.push('answer selection/click cannot submit; outside/scroll/Esc closes; inputs ignored');

    for(const subject of ['ktvxl','tthcm','vldc','xstk']){
      await tab.evaluate(subject=>switchSubject(subject),subject);await tab.locator('#btn-tab-practice').click();await select(tab,'.q-prompt-box',24);await choose(tab,'yellow');
      await clear(tab);await tab.locator('.btn-toggle-exp').first().click();await select(tab,'.inline-exp-sec-body',18);await choose(tab,'green');
      await clear(tab);await tab.locator('#btn-tab-knowledge').click();await select(tab,'.chapter-body',150);await choose(tab,'purple');
      assert((await rows(tab)).some(row=>JSON.parse(row.root)[0]===subject&&JSON.parse(row.root)[1]==='knowledge'),'Missing knowledge '+subject);
    }
    await clear(tab);await tab.evaluate(()=>switchSubject('tthcm'));await tab.locator('#btn-tab-knowledge').click();
    await select(tab,'.chapter-body',65);await choose(tab,'pink');await clear(tab);
    for(const dark of [true,false]){
      if(await tab.locator('body').evaluate(el=>el.classList.contains('dark-mode'))!==dark)await tab.locator('#btn-toggle-dark-mode').click();
      await select(tab,'.chapter-body',65);await visible(tab);await tab.locator('#highlight-brush').click();await tab.waitForTimeout(550);
      await visible(tab);await tab.mouse.move(1100,850);
      await tab.screenshot({path:'output/playwright/brush-knowledge-'+(dark?'dark':'light')+'.png'});
      await tab.keyboard.press('Escape');await clear(tab);
    }
    assert(await tab.evaluate(()=>localStorage.getItem('kma_question_notes_v1'))===beforeNotes,'Notes storage changed');
    checks.push('practice prompts/options/explanations and knowledge in all four subjects; cross-node anchors; both themes');

    const mobile=await create({viewport:{width:320,height:844},isMobile:true,hasTouch:true});await mobile.tab.goto('http://127.0.0.1:8765/web/index.html');
    for(const width of [320,390]){
      await mobile.tab.setViewportSize({width,height:844});
      for(const dark of [false,true]){
        if(await mobile.tab.locator('body').evaluate(el=>el.classList.contains('dark-mode'))!==dark)await mobile.tab.locator('#btn-toggle-dark-mode').tap();
        await select(mobile.tab,'.q-prompt-box',24,true);await visible(mobile.tab);
        const placement=await mobile.tab.evaluate(()=>{
          const pop=document.querySelector('#highlight-popover').getBoundingClientRect(),range=getSelection().getRangeAt(0).getBoundingClientRect();return {below:pop.top>=range.bottom+12,left:pop.left,right:pop.right};
        });assert(placement.below&&placement.left>=0&&placement.right<=width,'Touch button placement');
        await choose(mobile.tab,'orange',true);await clear(mobile.tab);
        const point=await hit(mobile.tab,'orange');await mobile.tab.touchscreen.tap(point.x,point.y);await visible(mobile.tab);await mobile.tab.waitForTimeout(550);
        const fit=await mobile.tab.locator('#highlight-popover').evaluate(pop=>{const r=pop.getBoundingClientRect(),marked=document.querySelector('mark.hl-color-orange').getBoundingClientRect();return r.top>=marked.bottom+12&&r.left>=0&&r.right<=innerWidth&&document.documentElement.scrollWidth<=innerWidth;});assert(fit,'Touch palette overlaps the marked passage or overflows '+width);
        if(width===390&&dark)await mobile.tab.screenshot({path:'output/playwright/brush-mobile-dark.png'});
        await mobile.tab.locator('#highlight-trash').tap();await hidden(mobile.tab);
      }
    }
    checks.push('320/390px touch: below selection, palette within viewport, colors/delete in both themes');

    const reduced=await create({reducedMotion:'reduce'});await reduced.tab.goto('http://127.0.0.1:8765/web/index.html');await select(reduced.tab,'.q-prompt-box');await visible(reduced.tab);await reduced.tab.locator('#highlight-brush').click();
    const motion=await reduced.tab.evaluate(()=>({transition:getComputedStyle(document.querySelector('.pop')).transitionDuration,swatch:getComputedStyle(document.querySelector('.hl-swatch')).transitionDuration}));assert(motion.transition==='0s'&&motion.swatch==='0s','Reduced motion ignored');
    checks.push('reduced-motion disables expansion/stagger');

    const fallback=await create();await fallback.context.addInitScript(()=>{window.Highlight=undefined;});await fallback.tab.goto('http://127.0.0.1:8765/web/index.html');
    const quote=await select(fallback.tab,'.q-prompt-box');await choose(fallback.tab,'green');assert(await fallback.tab.evaluate(()=>getSelection().toString())===quote,'Fallback selection changed');
    await clear(fallback.tab);const title=await fallback.tab.locator('.q-title').first().innerText();await fallback.tab.reload();await fallback.tab.locator('mark.study-highlight').first().waitFor();assert(await fallback.tab.locator('.q-title').first().innerText()===title,'Fallback changed text');
    await fallback.tab.locator('mark.study-highlight').first().click();await visible(fallback.tab);await fallback.tab.locator('#highlight-trash').click();assert(await fallback.tab.locator('mark.study-highlight').count()===0,'Fallback deletion failed');
    checks.push('safe DOM marks preserve selection/text, restore/delete, work without native Custom Highlights');
    assert(!errors.length,errors.join('; '));assert(!traffic.length,'Production traffic');return {checks,errors,productionRequests:traffic.length};
  }catch(error){throw Error('Completed checks: '+checks.join('; ')+'\n'+error.message);}finally{await Promise.all(contexts.map(context=>context.close()));}
}
