async (page) => {
  const base='http://127.0.0.1:8765',errors=[],checks=[];
  let chaptersChecked=0,viewsChecked=0,componentsChecked=0,connectionsChecked=0;
  page.on('pageerror',error=>errors.push(error.message));
  const assert=(value,message)=>{if(!value)throw new Error(message);};
  const dialog=page.locator('#chapter-diagram-dialog');
  const layout=()=>page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  const open=async id=>{
    await page.locator('.chapter-card[data-chapter-id="'+id+'"] .chapter-diagram-button').click();
    await layout();
  };
  const close=async()=>{
    await dialog.locator('[data-diagram-action="close"]').click();
    await page.waitForFunction(()=>!document.querySelector('#chapter-diagram-dialog').open&&!document.body.classList.contains('chapter-diagram-open'));
  };
  const publish=async extra=>{
    const report={complete:false,chaptersChecked,viewsChecked,componentsChecked,connectionsChecked,checks,browserErrors:errors,...extra};
    await page.evaluate(report=>{window.__KMA_SUBJECT_DIAGRAM_REPORT=report;},report);
    return report;
  };
  try {
    await page.setViewportSize({width:1440,height:980});
    await page.goto(base+'/web/index.html');
    const sources=await page.evaluate(()=>Object.fromEntries(['tthcm','vldc','xstk'].map(subject=>[subject,{
      knowledge:window[subject.toUpperCase()+'_KNOWLEDGE_DATA'],models:window.KMA_SUBJECT_DIAGRAM_DATA[subject]
    }])));
    for(const [subject,source] of Object.entries(sources)) {
      await page.locator('#btn-subj-'+subject).click();
      await page.locator('#btn-tab-knowledge').click();
      assert(await page.locator('.chapter-diagram-button').count()===source.knowledge.chapters.length,'Missing chapter buttons in '+subject);
      for(const chapter of source.knowledge.chapters) {
        const card=page.locator('.chapter-card[data-chapter-id="'+chapter.id+'"]');
        await card.locator('.chapter-header').click();
        assert(await card.locator('.chapter-body').isHidden(),'Cannot collapse '+subject+'/'+chapter.id);
        await open(chapter.id);
        assert(await dialog.getAttribute('data-subject')===subject,'Cross-subject ID collision');
        assert((await dialog.locator('.diagram-heading-badge').textContent()).includes(source.models.label.toUpperCase()),'Wrong subject badge');
        assert((await dialog.locator('.diagram-wire-legend').innerText()).replace(/\s+/g,' ').includes(source.models.legend[1]),'Wrong relationship legend');
        for(const view of source.models.chapters[chapter.id].views) {
          await dialog.locator('.diagram-view-tab[data-view="'+view.id+'"]').click();await layout();
          assert(await dialog.locator('.diagram-component').count()===view.nodes.length,'Missing components in '+view.id);
          assert(await dialog.locator('.diagram-wire').count()===view.edges.length,'Missing arrows in '+view.id);
          for(const node of view.nodes) {
            const button=dialog.locator('.diagram-component[data-node-key="'+node.id+'"]');
            await button.click();
            assert(await dialog.locator('.diagram-detail-title').textContent()===node.label,'Wrong selected concept');
            assert(await dialog.locator('.diagram-detail-text > p').first().textContent(),'Missing explanation');
            assert(await dialog.locator('.katex-error').count()===0,'Invalid math in '+subject+'/'+chapter.id+'/'+node.id);
            if(node.text[0].includes('$')) assert(await dialog.locator('.diagram-detail-text > p .katex').count()>0,'Formula not rendered');
            const relations=view.edges.filter(edge=>edge.from===node.id||edge.to===node.id);
            assert(await dialog.locator('.diagram-related-button').count()===relations.length,'Missing relation buttons');
            assert(await dialog.locator('.diagram-edge-active').count()===relations.length,'Relation highlighting failed');
            assert(await button.getAttribute('aria-pressed')==='true','Missing accessible selection');
            if(node.refs.length) {
              await dialog.locator('.diagram-knowledge-reference summary').click();
              assert(await dialog.locator('.diagram-knowledge-reference div > p').count()===node.refs.length,'Incomplete source references');
              assert(await dialog.locator('.katex-error').count()===0,'Invalid source formula');
            }
            componentsChecked++;
          }
          await dialog.locator('[data-diagram-action="overview"]').click();
          await dialog.locator('.diagram-knowledge-reference summary').click();
          const expected=await page.evaluate(chapter=>window.KMA_DIAGRAM_KNOWLEDGE(chapter).reduce((sum,s)=>sum+s.content.length,0),chapter);
          assert(await dialog.locator('.diagram-knowledge-reference div > p').count()===expected,'Incomplete whole-chapter reference');
          assert(await dialog.locator('.diagram-muted').count()===0,'Selection not cleared');
          await dialog.locator('[data-diagram-action="fit"]').click();
          await page.screenshot({path:'output/playwright/'+subject+'-'+chapter.id+'-'+view.id+'.png',animations:'disabled'});
          viewsChecked++;connectionsChecked+=view.edges.length;
        }
        const colors=await page.evaluate(id=>({
          chapter:getComputedStyle(document.querySelector('.chapter-card[data-chapter-id="'+id+'"] .chapter-header')).backgroundColor,
          diagram:getComputedStyle(document.querySelector('.diagram-heading')).backgroundColor
        }),chapter.id);
        assert(colors.chapter===colors.diagram,'Theme mismatch in '+subject+'/'+chapter.id);
        await close();
        assert(await card.locator('.chapter-body').isHidden(),'Map changed chapter collapse');
        assert(await card.locator('.chapter-diagram-button').evaluate(el=>el===document.activeElement),'Focus not restored');
        chaptersChecked++;checks.push(subject+'/'+chapter.id+': all views, nodes, relations, source, math and theme');
        await publish({currentSubject:subject});
      }
    }
    // Every added chapter is usable in small portrait and short landscape screens.
    for(const [width,height] of [[390,844],[320,640],[844,390]]) {
      await page.setViewportSize({width,height});
      for(const [subject,source] of Object.entries(sources)) {
        await page.locator('#btn-subj-'+subject).click();await page.locator('#btn-tab-knowledge').click();
        for(const chapter of source.knowledge.chapters) {
          await open(chapter.id);
          const bounds=await dialog.boundingBox();
          assert(bounds.x>=0&&bounds.y>=0&&bounds.x+bounds.width<=width+1&&bounds.y+bounds.height<=height+1,'Dialog outside '+width+'×'+height);
          assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Page overflow');
          await dialog.locator('.diagram-view-tab').last().click();await layout();
          await dialog.locator('.diagram-component').last().click();
          assert(await dialog.locator('.diagram-detail-text > p').first().textContent(),'Last concept unreachable');
          await dialog.locator('.diagram-related-button').first().click();
          assert(await dialog.locator('.diagram-component[aria-pressed="true"]').count()===1,'Following a relation failed');
          await dialog.locator('[data-diagram-action="in"]').click();
          await dialog.locator('[data-diagram-action="fit"]').click();
          await dialog.locator('[data-diagram-action="close"]').focus();
          await page.keyboard.press('Shift+Tab');
          assert(await dialog.evaluate(el=>el.contains(document.activeElement)),'Focus escaped dialog');
          await close();
        }
      }
      checks.push('all 20 chapters at '+width+'×'+height);await publish({currentViewport:width+'×'+height});
    }
    await page.setViewportSize({width:1440,height:980});
    const examples=[['tthcm','tthcm_chap4','party-state','people'],['vldc','2','polarization','intensity'],['xstk','chap2','bayes','posterior']];
    for(const directory of ['web','docs']) for(const [subject,chapter,view,node] of examples) {
      await page.goto(base+'/'+directory+'/index.html?subject='+subject+'&diagram='+chapter+'&view='+view+'&node='+node);
      await dialog.locator('.diagram-component[aria-pressed="true"]').waitFor();await layout();
      assert(await dialog.getAttribute('data-subject')===subject,'Wrong deep-link subject');
      assert(await dialog.locator('.diagram-component[data-node-key="'+node+'"]').getAttribute('aria-pressed')==='true','Wrong deep-link node');
      assert(await dialog.locator('.diagram-view-tab[data-view="'+view+'"]').getAttribute('aria-selected')==='true','Wrong deep-link view');
      if(directory==='web') {
        await page.screenshot({path:'output/playwright/'+subject+'-final-desktop.png',animations:'disabled'});
        await page.setViewportSize({width:390,height:844});await layout();
        await page.screenshot({path:'output/playwright/'+subject+'-final-mobile.png',animations:'disabled'});
        await page.setViewportSize({width:1440,height:980});
      }
    }
    for(const query of ['subject=__proto__&diagram=chap1','subject=xstk&diagram=__proto__','subject=constructor&diagram=chap1','subject=tthcm&diagram=chap1','subject=vldc&diagram=chap1']) {
      await page.goto(base+'/web/index.html?'+query);
      assert(await dialog.evaluate(el=>!el.open),'Invalid link opened a map');
    }
    // The old review links keep opening the CPU despite the shared chap1 ID.
    await page.goto(base+'/web/index.html?diagram=chap1&view=cpu&node=alu');
    await dialog.locator('.diagram-component[data-node-key="alu"][aria-pressed="true"]').waitFor();
    assert(await dialog.getAttribute('data-subject')==='ktvxl','Legacy CPU link changed');
    await page.keyboard.press('Escape');
    assert(await dialog.evaluate(el=>!el.open),'Escape close failed');
    checks.push('web/docs deep links for all three subjects, invalid IDs ignored, old CPU link preserved');
    assert(errors.length===0,'Browser errors: '+errors.join('; '));
    return await publish({complete:true});
  } catch(error) {return await publish({error:error.message});}
}
