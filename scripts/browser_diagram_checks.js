async (page) => {
  const base=page.url().split('/').slice(0,3).join('/');
  const errors=[],checks=[];
  let viewsChecked=0,componentsChecked=0,connectionsChecked=0;
  page.on('pageerror',error=>errors.push(error.message));
  const assert=(value,message)=>{if(!value)throw new Error(message);};
  const dialog=page.locator('#chapter-diagram-dialog');
  const waitLayout=()=>page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  const open=async id=>{
    await page.locator('.chapter-card[data-chapter-id="'+id+'"] .chapter-diagram-button').click();
    await waitLayout();
  };
  const close=async()=>{
    await dialog.locator('[data-diagram-action="close"]').click();
    await page.waitForFunction(()=>!document.querySelector('#chapter-diagram-dialog').open&&!document.body.classList.contains('chapter-diagram-open'));
  };
  try {
    await page.setViewportSize({width:1440,height:980});
    await page.goto(base+'/web/index.html');
    await page.locator('#btn-subj-ktvxl').click();
    await page.locator('#btn-tab-knowledge').click();
    const source=await page.evaluate(()=>({knowledge:window.KTVXL_KNOWLEDGE,diagrams:window.KMA_DIAGRAM_DATA}));
    assert(await page.locator('.chapter-diagram-button').count()===7,'Missing chapter map button');
    for(const chapter of source.knowledge.chapters) {
      const card=page.locator('.chapter-card[data-chapter-id="'+chapter.id+'"]');
      await card.locator('.chapter-header').click();
      assert(await card.locator('.chapter-body').isHidden(),'Chapter did not collapse');
      await open(chapter.id);
      assert(await dialog.locator('#chapter-diagram-title').textContent()===chapter.title,'Incorrect chapter title');
      for(const view of source.diagrams[chapter.id].views) {
        await dialog.locator('.diagram-view-tab[data-view="'+view.id+'"]').click();
        await waitLayout();
        assert(await dialog.locator('.diagram-component').count()===view.nodes.length,'Missing component in '+view.id);
        assert(await dialog.locator('.diagram-wire').count()===view.edges.length,'Missing relation in '+view.id);
        for(const node of view.nodes) {
          const button=dialog.locator('.diagram-component[data-node-key="'+node.id+'"]');
          await button.click();
          assert(await dialog.locator('.diagram-detail-title').textContent()===node.label,'Incorrect selected component');
          assert(await dialog.locator('.diagram-detail-text > p').first().textContent()===node.text[0],'Component function missing');
          assert(await button.getAttribute('aria-pressed')==='true','Selected state not announced');
          const relations=view.edges.filter(edge=>edge.from===node.id||edge.to===node.id);
          assert(await dialog.locator('.diagram-related-button').count()===relations.length,'Missing incoming/outgoing relation');
          assert(await dialog.locator('.diagram-edge-active').count()===relations.length,'Relations not highlighted');
          if(node.refs.length) {
            await dialog.locator('.diagram-knowledge-reference summary').click();
            assert(await dialog.locator('.diagram-knowledge-reference div > p').count()===node.refs.length,'Incomplete source knowledge');
          }
          componentsChecked++;
        }
        await dialog.locator('[data-diagram-action="overview"]').click();
        assert(await dialog.locator('.diagram-muted').count()===0,'Overview keeps components dimmed');
        await dialog.locator('[data-diagram-action="fit"]').click();
        await page.screenshot({path:'output/playwright/components-'+chapter.id+'-'+view.id+'.png',animations:'disabled'});
        viewsChecked++; connectionsChecked+=view.edges.length;
      }
      const colors=await page.evaluate(id=>({
        card:getComputedStyle(document.querySelector('.chapter-card[data-chapter-id="'+id+'"] .chapter-header')).backgroundColor,
        diagram:getComputedStyle(document.querySelector('.diagram-heading')).backgroundColor
      }),chapter.id);
      assert(colors.card===colors.diagram,'Chapter theme color changed');
      await close();
      assert(await card.locator('.chapter-body').isHidden(),'Opening diagram changed collapsed state');
      assert(await card.locator('.chapter-diagram-button').evaluate(el=>el===document.activeElement),'Focus not restored');
      checks.push(chapter.id+': all functional views, components, connections, descriptions and source notes');
    }
    await open('chap1');
    await dialog.locator('.diagram-view-tab').first().focus();
    await page.keyboard.press('ArrowRight');
    assert(await dialog.locator('.diagram-view-tab[data-view="system"]').getAttribute('aria-selected')==='true','Keyboard tab switching failed');
    await page.keyboard.press('Home');
    await dialog.locator('.diagram-component[data-node-key="alu"]').focus();
    await page.keyboard.press('Enter');
    assert(await dialog.locator('.diagram-detail-title').textContent()==='ALU','Keyboard selection failed');
    await dialog.locator('.diagram-related-button').filter({hasText:'CU'}).click();
    assert(await dialog.locator('.diagram-detail-title').textContent()==='CU','Following incoming edge failed');
    const before=Number((await dialog.locator('.diagram-zoom-value').textContent()).replace('%',''));
    await dialog.locator('[data-diagram-action="in"]').click();
    assert(Number((await dialog.locator('.diagram-zoom-value').textContent()).replace('%',''))>before,'Zoom failed');
    await dialog.locator('[data-diagram-action="out"]').click();
    await dialog.locator('[data-diagram-action="fit"]').click();
    await dialog.locator('[data-diagram-action="close"]').focus();
    await page.keyboard.press('Shift+Tab');
    assert(await dialog.evaluate(el=>el.contains(document.activeElement)),'Focus escaped modal');
    await page.keyboard.press('Escape');
    await page.waitForFunction(()=>!document.querySelector('#chapter-diagram-dialog').open);
    await open('chap1');
    await page.mouse.click(5,5);
    await page.waitForFunction(()=>!document.querySelector('#chapter-diagram-dialog').open);
    checks.push('keyboard tabs, ALU selection, follow relation, zoom, focus trap, Escape and backdrop close');

    for(const [width,height] of [[390,844],[320,640],[844,390]]) {
      await page.setViewportSize({width,height});
      for(const chapter of source.knowledge.chapters) {
        await open(chapter.id);
        const bounds=await dialog.boundingBox();
        assert(bounds.x>=0&&bounds.y>=0&&bounds.x+bounds.width<=width+1&&bounds.y+bounds.height<=height+1,'Dialog outside viewport');
        assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Page overflow on mobile');
        await dialog.locator('.diagram-view-tab').last().click();
        await waitLayout();
        await dialog.locator('.diagram-component').last().click();
        assert(await dialog.locator('.diagram-detail-text > p').first().textContent(),'Last component unreachable');
        await dialog.locator('[data-diagram-action="in"]').click();
        await dialog.locator('[data-diagram-action="fit"]').click();
        await close();
      }
      checks.push('all seven chapters usable at '+width+'×'+height);
    }
    await page.setViewportSize({width:1440,height:980});
    for(const subject of ['tthcm','vldc','xstk']) {
      await page.locator('#btn-subj-'+subject).click();
      await page.locator('#btn-tab-knowledge').click();
      const count=subject==='xstk'?8:6;
      assert(await page.locator('.chapter-diagram-button').count()===count,'Missing diagrams in '+subject);
      const header=page.locator('.chapter-header').first();
      await header.click();
      assert(await header.getAttribute('aria-expanded')==='false','Other chapter collapse changed');
      await header.press('Enter');
      assert(await header.getAttribute('aria-expanded')==='true','Other chapter keyboard control changed');
      await page.locator('.chapter-diagram-button').first().click();
      assert(await dialog.getAttribute('data-subject')===subject,'Opened another subject diagram');
      await close();
    }
    await page.locator('#btn-subj-ktvxl').click();
    await page.locator('#btn-tab-exam').click();
    await page.locator('.exam-card-choice[data-exam-code="3"]').click();
    await page.locator('#btn-start-exam').click();
    assert(await page.locator('#exam-questions-list .question-card').count()===40,'Mock exam flow changed');
    page.once('dialog',modal=>modal.accept());
    await page.locator('#btn-exit-exam').click();
    checks.push('other subjects and existing selected mock exam remain usable');

    await page.goto(base+'/docs/index.html?diagram=chap1&view=cpu&node=alu');
    await dialog.locator('.diagram-component[aria-pressed="true"]').waitFor();
    assert(await dialog.locator('.diagram-detail-title').textContent()==='ALU','Review link or Pages copy failed');
    await dialog.locator('[data-diagram-action="fit"]').click();
    await page.screenshot({path:'output/playwright/cpu-final-desktop.png',animations:'disabled'});
    await page.setViewportSize({width:390,height:844});
    await waitLayout();
    await dialog.locator('.diagram-component[data-node-key="alu"]').click();
    await page.screenshot({path:'output/playwright/cpu-final-mobile.png',animations:'disabled'});
    await close();
    checks.push('deep link opens CPU and ALU on the GitHub Pages copy');
    assert(errors.length===0,'Browser errors: '+errors.join('; '));
    const report={complete:true,chapters:7,viewsChecked,componentsChecked,connectionsChecked,checks,browserErrors:errors};
    await page.evaluate(report=>{window.__KMA_DIAGRAM_REPORT=report;},report);
    return report;
  } catch(error) {
    const report={complete:false,viewsChecked,componentsChecked,connectionsChecked,checks,error:error.message,browserErrors:errors};
    await page.evaluate(report=>{window.__KMA_DIAGRAM_REPORT=report;},report).catch(()=>{});
    return report;
  }
}
