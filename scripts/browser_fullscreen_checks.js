async (page) => {
  const assert=(value,message)=>{if(!value)throw new Error(message);};
  const errors=[],checks=[];
  page.on('pageerror',error=>errors.push(error.message));
  const base='http://127.0.0.1:8765';
  const dialog=page.locator('#chapter-diagram-dialog'),viewport=dialog.locator('.diagram-viewport');
  const action=name=>dialog.locator('[data-diagram-action="'+name+'"]');
  const settle=()=>page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  const load=async(width,height,query)=>{
    await page.setViewportSize({width,height});
    await page.goto(base+'/web/index.html?'+query);
    await dialog.locator('.diagram-component').first().waitFor();
    await settle();
  };
  try {
    await load(1440,980,'diagram=chap2');
    await action('fullscreen').click(); await settle();
    assert(await dialog.evaluate(el=>el.classList.contains('diagram-expanded')),'Expand button failed');
    const native=await page.evaluate(()=>!!document.fullscreenElement);
    assert(await dialog.locator('.diagram-detail').isHidden(),'Knowledge should not occupy the initial expanded canvas');
    const panel=await dialog.locator('.diagram-map-panel').boundingBox();
    assert(panel.width>1390&&panel.height>700,'Expanded desktop map did not grow');
    await page.screenshot({path:'output/playwright/fullscreen-desktop-map.png',animations:'disabled'});
    await dialog.locator('.diagram-component[data-node-key="sfr"]').click();await settle();
    assert(await dialog.locator('.diagram-detail').isVisible(),'Node did not open desktop knowledge');
    assert(await dialog.locator('.diagram-detail-title').textContent()==='SFR • PSW • SP • DPTR','Wrong node detail');
    await page.screenshot({path:'output/playwright/fullscreen-desktop-node.png',animations:'disabled'});
    await action('dismiss-details').click();
    assert(await dialog.locator('.diagram-detail').isHidden(),'Dismiss did not give the map back');
    assert(await dialog.locator('.diagram-component[data-node-key="sfr"]').getAttribute('aria-pressed')==='true','Dismiss cleared selected node');
    await action('details').click(); await settle();
    await action('chapter').click();
    assert(await dialog.locator('.diagram-knowledge-reference summary').textContent().then(text=>text.includes('cả chương')),'Whole chapter lost');
    await page.keyboard.press('Escape');await settle();
    assert(await dialog.evaluate(el=>el.open&&!el.classList.contains('diagram-expanded')),'First Escape should restore normal diagram');
    assert(await page.evaluate(()=>!document.fullscreenElement),'Native fullscreen did not exit');
    await page.keyboard.press('Escape');
    assert(await dialog.evaluate(el=>!el.open),'Second Escape should close the diagram');
    checks.push('desktop expansion, native='+native+', node sidebar, collapse preserving selection, chapter reading and Escape');

    for(const [width,height] of [[390,844],[320,640],[844,390]]) {
      await load(width,height,'diagram=chap2&fullscreen=1');
      assert(await action('fullscreen').getAttribute('aria-pressed')==='true','Deep link did not expand');
      assert(await dialog.locator('.diagram-detail').isHidden(),'Initial mobile knowledge is visible');
      const canvas=await viewport.boundingBox();
      assert(canvas.width>=width-32&&canvas.height>=height*.45,'Too little map area '+width);
      assert(parseInt(await dialog.locator('.diagram-zoom-value').textContent(),10)>=90,'Unreadable initial expanded scale');
      assert(await dialog.evaluate(el=>el.scrollWidth<=el.clientWidth+1),'Horizontal control overflow '+width);
      let scale=await dialog.locator('.diagram-zoom-value').textContent();
      const bounds=await viewport.boundingBox();
      const start={x:bounds.x+bounds.width*.7,y:bounds.y+bounds.height*.55};
      const before=await viewport.evaluate(el=>({x:el.scrollLeft,y:el.scrollTop}));
      await page.mouse.move(start.x,start.y);await page.mouse.down();
      await page.mouse.move(start.x-95,start.y-95,{steps:8});await page.mouse.up();
      const after=await viewport.evaluate(el=>({x:el.scrollLeft,y:el.scrollTop}));
      assert(after.x>before.x+40||after.y>before.y+40,'Drag did not pan '+width);
      // A completed drag must not accidentally select the node under the finger.
      assert(await dialog.locator('.diagram-detail').isHidden(),'Drag accidentally opened a node');
      if(width<=760) {
        const client=await page.context().newCDPSession(page);
        const x=bounds.x+bounds.width/2,y=bounds.y+bounds.height*.45;
        await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:x-35,y,id:1},{x:x+35,y,id:2}]});
        await client.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x-65,y,id:1},{x:x+65,y,id:2}]});
        await client.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
        await client.detach();
        assert(parseInt(await dialog.locator('.diagram-zoom-value').textContent(),10)>parseInt(scale,10)+20,'Two-finger pinch failed '+width);
        // Restore a comfortable scale before testing the node sheet.
        await action('out').click();await action('out').click();await settle();
        scale=await dialog.locator('.diagram-zoom-value').textContent();
      }
      await page.waitForTimeout(360);
      const node=dialog.locator('.diagram-component[data-node-key="sfr"]');
      await node.click();await settle();
      assert(await dialog.locator('.diagram-detail').isVisible(),'Node details missing '+width);
      assert(await dialog.locator('.diagram-zoom-value').textContent()===scale,'Node click reset the scale '+width);
      if(width<=760) {
        const sheet=await dialog.locator('.diagram-detail').boundingBox(),map=await viewport.boundingBox(),selected=await node.boundingBox();
        assert(sheet.y>map.y+80&&Math.abs(sheet.x)<=1,'Knowledge is not a bottom sheet '+width);
        assert(selected.y+selected.height<=sheet.y+2,'Selected node is obscured by the sheet '+width);
        await action('sheet').click();await settle();
        assert(await action('sheet').getAttribute('aria-expanded')==='true','Sheet expand failed '+width);
        await dialog.locator('.diagram-knowledge-reference summary').click();await settle();
        const paragraphs=dialog.locator('.diagram-reading-section p');
        await paragraphs.last().scrollIntoViewIfNeeded();
        assert(await paragraphs.last().isVisible(),'Knowledge end is unreadable '+width);
        await action('sheet').click();await settle();
        assert(await action('sheet').getAttribute('aria-expanded')==='false','Sheet collapse failed '+width);
        const grip=await action('sheet').boundingBox();
        await page.mouse.move(grip.x+15,grip.y+15);await page.mouse.down();
        await page.mouse.move(grip.x+15,grip.y-70,{steps:8});await page.mouse.up();await settle();
        assert(await action('sheet').getAttribute('aria-expanded')==='true','Swipe-up did not expand the sheet '+width);
        await page.waitForTimeout(360);
        await action('sheet').click();await settle();
      }
      if(width===390) {
        await dialog.locator('.diagram-knowledge-reference').evaluate(el=>el.open=false);
        await dialog.locator('.diagram-detail-text').evaluate(el=>el.scrollTop=0);
        await page.screenshot({path:'output/playwright/fullscreen-mobile-node.png',animations:'disabled'});
      }
      await dialog.locator('.diagram-related-button').first().click();await settle();
      assert(await dialog.locator('.diagram-component[aria-pressed="true"]').getAttribute('data-node-key')!=='sfr','Relation did not select its neighbor '+width);
      const linked=await dialog.locator('.diagram-component[aria-pressed="true"]').boundingBox(),knowledge=await dialog.locator('.diagram-detail').boundingBox();
      if(width<=760) assert(linked.y+linked.height<=knowledge.y+2,'Linked node is obscured '+width);
      else assert(linked.x+linked.width<=knowledge.x+2,'Linked node is behind the sidebar '+width);
      await action('dismiss-details').click();
      assert(await dialog.locator('.diagram-detail').isHidden(),'Sheet dismiss failed '+width);
      if(width===390) await page.screenshot({path:'output/playwright/fullscreen-mobile-map.png',animations:'disabled'});
      await action('fullscreen').click();await settle();
      assert(await action('fullscreen').getAttribute('aria-pressed')==='false','Exit fullscreen failed '+width);
      assert(await dialog.locator('.diagram-detail').isVisible(),'Normal knowledge panel not restored '+width);
      await action('fullscreen').click();await settle();
      await action('close').click();
      assert(await dialog.evaluate(el=>!el.open),'Close failed from fullscreen '+width);
      await page.waitForFunction(()=>!document.fullscreenElement);
      checks.push(width+'×'+height+': readable map, pan, node detail, reading, sheet controls and fullscreen exit');
    }
    // The shared viewer must work for every subject and the Pages copy.
    for(const [subject,chapter,view,node] of [
      ['tthcm','tthcm_chap4','party-state','people'],['vldc','2','polarization','intensity'],['xstk','chap2','bayes','posterior']
    ]) {
      await load(390,844,'subject='+subject+'&diagram='+chapter+'&view='+view+'&fullscreen=1');
      await dialog.locator('.diagram-component[data-node-key="'+node+'"]').click();await settle();
      assert(await dialog.locator('.diagram-detail').isVisible(),'Missing fullscreen knowledge '+subject);
      const colors=await dialog.evaluate(el=>[getComputedStyle(el.querySelector('.diagram-heading')).backgroundColor,getComputedStyle(el.querySelector('.diagram-detail-heading')).backgroundColor]);
      assert(colors[0]===colors[1],'Theme changed in the fullscreen knowledge '+subject);
      await action('dismiss-details').click();
      await action('details').click();
      assert(await dialog.locator('.diagram-detail-title').textContent(),'Reopen missing node title '+subject);
      checks.push(subject+': expanded viewer, node knowledge, theme and reopen');
    }
    await page.goto(base+'/docs/index.html?diagram=chap2&fullscreen=1');
    await dialog.locator('.diagram-component').first().waitFor();await settle();
    assert(await action('fullscreen').getAttribute('aria-pressed')==='true','Pages copy does not expand');
    await page.keyboard.press('Escape');await page.keyboard.press('Escape');
    assert(await dialog.evaluate(el=>!el.open),'Fallback Escape did not close');
    await load(390,844,'diagram=chap2');
    await dialog.locator('.diagram-shell').evaluate(el=>el.requestFullscreen=()=>Promise.reject(new DOMException('Unavailable','NotSupportedError')));
    await action('fullscreen').click();await settle();
    assert(await action('fullscreen').getAttribute('aria-pressed')==='true','Unavailable native API broke expanded layout');
    assert(await page.evaluate(()=>!document.fullscreenElement),'Mocked API should use the viewport fallback');
    await action('close').click();
    checks.push('native API rejection uses expanded fallback and closes normally');
    assert(errors.length===0,errors.join('; '));
    return {complete:true,checks,browserErrors:errors};
  } catch(error) { return {complete:false,checks,error:error.message,browserErrors:errors}; }
}
