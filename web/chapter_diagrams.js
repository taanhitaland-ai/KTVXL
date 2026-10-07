// Interactive component diagrams, with separate data and control paths.
(function () {
  'use strict';
  const dialog = document.getElementById('chapter-diagram-dialog');
  if (!dialog || !window.KMA_DIAGRAM_DATA || !window.KMA_DIAGRAM_GEOMETRY) return;
  const viewport = dialog.querySelector('.diagram-viewport');
  const surface = dialog.querySelector('.diagram-surface');
  const detailText = dialog.querySelector('.diagram-detail-text');
  const tabs = dialog.querySelector('.diagram-view-tabs');
  const shell = dialog.querySelector('.diagram-shell');
  const detail = dialog.querySelector('.diagram-detail');
  const fullscreenButton = dialog.querySelector('[data-diagram-action="fullscreen"]');
  const detailsButton = dialog.querySelector('[data-diagram-action="details"]');
  const svgNS = 'http://www.w3.org/2000/svg';
  let chapter, options, model, world, trigger, subject, chapterModels, sourceSections;
  function subjectModels(key) {
    if (key === 'ktvxl') return {label:'Vi xử lý',icon:'⚡',chapters:window.KMA_DIAGRAM_DATA,
      legend:['Dữ liệu','Địa chỉ','Điều khiển'],incoming:'Nhận từ',outgoing:'Gửi đến',context:'SƠ ĐỒ CHỨC NĂNG'};
    const registry=window.KMA_SUBJECT_DIAGRAM_DATA;
    return registry&&Object.hasOwn(registry,key) ? registry[key] : null;
  }
  function has(key,id) {
    const data=subjectModels(key);
    return !!data&&Object.hasOwn(data.chapters,id);
  }
  let selected = null, zoom = 1, fitOnResize = true, frame = 0;
  let compact = false;
  let expanded = false, detailsOpen = false, sheetExpanded = false, fullscreenRequest = 0;
  const svgElement = (tag, attributes = {}) => {
    const element = document.createElementNS(svgNS, tag);
    for (const [key,value] of Object.entries(attributes)) element.setAttribute(key, String(value));
    return element;
  };
  const overlap = (a,b) => a.x < b.x+b.width && a.x+a.width > b.x && a.y < b.y+b.height && a.y+a.height > b.y;

  function paragraph(text, parent) {
    const p = document.createElement('p');
    if (options.formatText) p.innerHTML = options.formatText(text);
    else p.textContent = text;
    parent.appendChild(p);
  }
  function relatedKnowledge(refs, parent, all) {
    const details = document.createElement('details');
    details.className = 'diagram-knowledge-reference';
    const summary = document.createElement('summary');
    const references = all ? sourceSections.flatMap((section,s) => section.content.map((_,p)=>[s,p])) : refs;
    const icon = document.createElement('span');
    icon.className = 'diagram-knowledge-icon';
    icon.setAttribute('aria-hidden','true');
    icon.textContent = '📖';
    const copy = document.createElement('span');
    copy.className = 'diagram-knowledge-label';
    const label = document.createElement('strong');
    label.textContent = all ? 'Đọc kiến thức cả chương' : 'Đọc kiến thức liên quan';
    const hint = document.createElement('small');
    hint.textContent = references.length+' mục '+(all ? 'trong chương' : 'gắn với thành phần này');
    copy.append(label,hint);
    const caret = document.createElement('span');
    caret.className = 'diagram-knowledge-caret';
    caret.setAttribute('aria-hidden','true');
    const arrow = svgElement('svg',{viewBox:'0 0 24 24',focusable:'false'});
    arrow.appendChild(svgElement('path',{d:'M9 5 L16 12 L9 19'}));
    caret.appendChild(arrow);
    summary.append(icon,copy,caret);
    details.appendChild(summary);
    const content = document.createElement('div');
    content.className = 'diagram-knowledge-content';
    const groups = new Map();
    for (const [sectionIndex,paragraphIndex] of references) {
      const section = sourceSections[sectionIndex];
      if (!section || !section.content[paragraphIndex]) continue;
      if (!groups.has(sectionIndex)) groups.set(sectionIndex,[]);
      groups.get(sectionIndex).push(section.content[paragraphIndex]);
    }
    for (const [sectionIndex,paragraphs] of groups) {
      const section = document.createElement('section');
      section.className = 'diagram-reading-section';
      const heading = document.createElement('h4');
      heading.textContent = sourceSections[sectionIndex].title;
      const body = document.createElement('div');
      paragraphs.forEach(text=>paragraph(text,body));
      section.append(heading,body);
      content.appendChild(section);
    }
    details.appendChild(content);
    parent.appendChild(details);
  }
  function showRelations(component, direction) {
    const edges = model.edges.map((edge,index)=>({...edge,index})).filter(edge => direction==='in' ? edge.to===component.id : edge.from===component.id);
    if (!edges.length) return;
    const group = document.createElement('div');
    group.className = 'diagram-relations';
    const heading = document.createElement('h4');
    heading.textContent = direction==='in' ? subject.incoming : subject.outgoing;
    group.appendChild(heading);
    for (const edge of edges) {
      const other = model.nodes.find(node=>node.id === (direction==='in'?edge.from:edge.to));
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'diagram-related-button';
      const badge = document.createElement('span');
      badge.className = 'diagram-link-number';
      badge.textContent = String(edge.index+1);
      const text = document.createElement('span');
      text.textContent = other.label + ' • ' + edge.label;
      button.append(badge,text);
      button.addEventListener('click', () => {
        selectNode(other.id);
        const target = world.querySelector('[data-node-key="'+other.id+'"]');
        target.focus({preventScroll:true});
        if(!expanded) target.scrollIntoView({block:'nearest',inline:'nearest',behavior:'smooth'});
      });
      group.appendChild(button);
    }
    detailText.appendChild(group);
  }
  function selectNode(key) {
    selected = key;
    const component = model.nodes.find(node=>node.id===key);
    const neighbors = new Set([key]);
    if (key) for (const edge of model.edges) {
      if (edge.from===key || edge.to===key) { neighbors.add(edge.from); neighbors.add(edge.to); }
    }
    world.querySelectorAll('.diagram-component').forEach(button => {
      button.setAttribute('aria-pressed',String(button.dataset.nodeKey===key));
      button.classList.toggle('diagram-muted',!!key&&!neighbors.has(button.dataset.nodeKey));
    });
    world.querySelectorAll('.diagram-edge').forEach(group => {
      const connected = group.dataset.from===key || group.dataset.to===key;
      group.classList.toggle('diagram-muted',!!key&&!connected);
      group.classList.toggle('diagram-edge-active',!!key&&connected);
    });
    dialog.querySelector('.diagram-detail-title').textContent = component ? component.label : model.title;
    dialog.querySelector('.diagram-detail-context').textContent = component ? component.subtitle : subject.context;
    detailText.replaceChildren();
    if (component) {
      component.text.forEach(text=>paragraph(text,detailText));
      showRelations(component,'in');
      showRelations(component,'out');
      if (component.refs.length) relatedKnowledge(component.refs,detailText,false);
    } else {
      paragraph(model.description,detailText);
      paragraph('Chọn một thành phần để xem giải thích. Các mũi tên liên quan sẽ nổi bật; bấm các liên kết bên dưới để đi sang thành phần khác.',detailText);
      relatedKnowledge([],detailText,true);
    }
    if (options.renderMath) options.renderMath(detailText);
    detailText.scrollTop = 0;
    if (expanded) {
      setDetails(!!component, false);
      if (component) requestAnimationFrame(keepSelectedVisible);
    }
  }

  function labelPosition(points, width, height, used, otherRoutes) {
    const segments=[];
    for(let index=1;index<points.length;index++) {
      const a=points[index-1],b=points[index];
      const horizontal=a[1]===b[1];
      const length=Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1]);
      if(length>=(horizontal?width:height)+10) segments.push({a,b,length,horizontal});
    }
    segments.sort((a,b)=>(b.horizontal?10000:0)+b.length-(a.horizontal?10000:0)-a.length);
    for (const {a,b} of segments) for (const ratio of [.5,.35,.65,.2,.8]) {
      const x=a[0]+(b[0]-a[0])*ratio-width/2, y=a[1]+(b[1]-a[1])*ratio-height/2;
      const rect={x,y,width,height};
      if(x<4||y<4||x+width>model.width-4||y+height>model.height-4) continue;
      if(model.nodes.some(node=>overlap(rect,window.KMA_DIAGRAM_GEOMETRY.box(node,4))) || used.some(other=>overlap(rect,{x:other.x-3,y:other.y-3,width:other.width+6,height:other.height+6}))) continue;
      if(otherRoutes.some(route=>route.some((point,index)=>index&&window.KMA_DIAGRAM_GEOMETRY.intersects(route[index-1],point,rect)))) continue;
      used.push(rect);
      return rect;
    }
    return null;
  }
  function buildEdges() {
    const svg=svgElement('svg',{viewBox:'0 0 '+model.width+' '+model.height,'aria-hidden':'true'});
    svg.classList.add('diagram-edges');
    const definitions=svgElement('defs');
    for (const type of ['data','address','control']) {
      const marker=svgElement('marker',{id:'diagram-arrow-'+type,viewBox:'0 0 10 10',refX:9,refY:5,markerWidth:7,markerHeight:7,orient:'auto-start-reverse'});
      marker.classList.add('diagram-marker-'+type);
      marker.appendChild(svgElement('path',{d:'M 0 0 L 10 5 L 0 10 z'}));
      definitions.appendChild(marker);
    }
    svg.appendChild(definitions);
    const used=[];
    const routes=[];
    for(const edge of model.edges) routes.push(window.KMA_DIAGRAM_GEOMETRY.route(edge,model,routes));
    const context=document.createElement('canvas').getContext('2d');
    context.font='700 12px '+getComputedStyle(dialog).fontFamily;
    model.edges.forEach((edge,index)=>{
      const points=routes[index];
      const group=svgElement('g');
      group.classList.add('diagram-edge','diagram-edge-'+edge.type);
      group.dataset.from=edge.from; group.dataset.to=edge.to;
      group.addEventListener('click',()=>selectNode(edge.from));
      const title=svgElement('title');
      title.textContent=edge.label;
      const path=svgElement('path',{d:points.map((point,index)=>(index?'L ':'M ')+point.join(' ')).join(' '),'marker-end':'url(#diagram-arrow-'+edge.type+')'});
      path.classList.add('diagram-wire');
      group.append(title,path);
      let text=edge.label;
      const width=Math.ceil(context.measureText(text).width)+18;
      const otherRoutes=routes.filter((_,routeIndex)=>routeIndex!==index);
      let position=labelPosition(points,width,26,used,otherRoutes);
      if(!position) { text=String(index+1); position=labelPosition(points,26,24,used,otherRoutes); }
      if(position) {
        const rect=svgElement('rect',{x:position.x,y:position.y,width:position.width,height:position.height,rx:7});
        rect.classList.add('diagram-wire-label-bg');
        const label=svgElement('text',{x:position.x+position.width/2,y:position.y+position.height/2+4,'text-anchor':'middle'});
        label.classList.add('diagram-wire-label');
        label.textContent=text;
        group.append(rect,label);
      }
      svg.appendChild(group);
    });
    world.appendChild(svg);
  }
  function selectView(index) {
    model=chapterModels.views[index];
    tabs.querySelectorAll('[role="tab"]').forEach((button,i)=>{
      button.setAttribute('aria-selected',String(i===index));
      button.tabIndex=i===index?0:-1;
    });
    world=document.createElement('div');
    world.className='diagram-world';
    world.style.width=model.width+'px';
    world.style.height=model.height+'px';
    model.groups.forEach(group=>{
      const frame=document.createElement('div');
      frame.className='diagram-block-group';
      Object.assign(frame.style,{left:group.x+'px',top:group.y+'px',width:group.width+'px',height:group.height+'px'});
      const title=document.createElement('span'); title.textContent=group.label; frame.appendChild(title);
      world.appendChild(frame);
    });
    buildEdges();
    model.nodes.forEach(component=>{
      const button=document.createElement('button');
      button.type='button'; button.className='diagram-component'; button.dataset.nodeKey=component.id;
      button.setAttribute('aria-pressed','false');
      Object.assign(button.style,{left:component.x+'px',top:component.y+'px',width:component.width+'px',height:component.height+'px'});
      const label=document.createElement('strong'); label.textContent=component.label;
      const subtitle=document.createElement('span'); subtitle.textContent=component.subtitle;
      button.append(label,subtitle);
      button.addEventListener('click',()=>selectNode(component.id));
      world.appendChild(button);
    });
    surface.replaceChildren(world);
    dialog.querySelector('.diagram-map-count').textContent=model.nodes.length+' khối • '+model.edges.length+' liên kết';
    selected=null; selectNode(null);
    zoom=1; fitOnResize=true;
    scheduleLayout();
  }
  function buildTabs() {
    tabs.replaceChildren();
    chapterModels.views.forEach((view,index)=>{
      const button=document.createElement('button');
      button.type='button'; button.className='diagram-view-tab'; button.setAttribute('role','tab');
      button.textContent=view.title; button.dataset.view=view.id;
      button.addEventListener('click',()=>selectView(index));
      button.addEventListener('keydown',event=>{
        const total=tabs.children.length;
        let target=index;
        if(event.key==='ArrowRight') target=(index+1)%total;
        else if(event.key==='ArrowLeft') target=(index+total-1)%total;
        else if(event.key==='Home') target=0;
        else if(event.key==='End') target=total-1;
        else return;
        event.preventDefault(); selectView(target); tabs.children[target].focus();
      });
      tabs.appendChild(button);
    });
  }
  function applyZoom(value,center) {
    const middleX=(viewport.scrollLeft+viewport.clientWidth/2)/zoom;
    const middleY=(viewport.scrollTop+viewport.clientHeight/2)/zoom;
    const maximum=expanded?2.4:1.6;
    zoom=Math.max(.2,Math.min(maximum,value));
    world.style.transform='scale('+zoom+')';
    surface.style.width=Math.ceil(model.width*zoom)+'px';
    surface.style.height=Math.ceil(model.height*zoom)+'px';
    dialog.querySelector('.diagram-zoom-value').textContent=Math.round(zoom*100)+'%';
    dialog.querySelector('[data-diagram-action="out"]').disabled=zoom<=.2;
    dialog.querySelector('[data-diagram-action="in"]').disabled=zoom>=maximum;
    if(center) {
      viewport.scrollLeft=middleX*zoom-viewport.clientWidth/2;
      viewport.scrollTop=middleY*zoom-viewport.clientHeight/2;
    }
  }
  function fit(readable) {
    let value=Math.min(1,(viewport.clientWidth-28)/model.width,(viewport.clientHeight-28)/model.height);
    if(readable) value=Math.max(expanded?(compact?1:.9):(compact?.65:.55),value);
    applyZoom(value,false);
    viewport.scrollLeft=(compact||expanded)&&readable?Math.max(0,(model.width*zoom-viewport.clientWidth)/2):0;
    viewport.scrollTop=expanded&&readable?Math.max(0,(model.height*zoom-viewport.clientHeight)/2):0;
    fitOnResize=true;
  }
  function layout() {
    if(!dialog.open||!world) return;
    const nextCompact=matchMedia('(max-width:760px)').matches;
    const changed=compact!==nextCompact; compact=nextCompact;
    if(fitOnResize||changed) fit(true);
    if(expanded&&detailsOpen) keepSelectedVisible();
  }
  function scheduleLayout() { cancelAnimationFrame(frame); frame=requestAnimationFrame(layout); }
  function focusSelected() {
    const target=selected&&world?.querySelector('[data-node-key="'+selected+'"]');
    (target||detailsButton).focus({preventScroll:true});
  }
  function setDetails(open, restoreFocus) {
    detailsOpen=!!open;
    dialog.classList.toggle('diagram-details-open',detailsOpen);
    detailsButton.setAttribute('aria-expanded',String(detailsOpen));
    detailsButton.setAttribute('aria-label',detailsOpen?'Thu gọn kiến thức đang chọn':'Mở kiến thức đang chọn');
    detailsButton.title=detailsButton.getAttribute('aria-label');
    detail.inert=expanded&&!detailsOpen;
    if (!open) setSheet(false);
    if (restoreFocus) focusSelected();
  }
  function setSheet(open) {
    sheetExpanded=!!open;
    dialog.classList.toggle('diagram-sheet-expanded',sheetExpanded);
    const toggle=dialog.querySelector('[data-diagram-action="sheet"]');
    toggle.setAttribute('aria-expanded',String(sheetExpanded));
    toggle.setAttribute('aria-label',sheetExpanded?'Thu nhỏ bảng kiến thức':'Mở rộng bảng kiến thức');
    toggle.querySelector('.diagram-sheet-toggle-label').textContent=sheetExpanded?'Thu nhỏ':'Mở rộng';
  }
  function keepSelectedVisible() {
    if(!expanded||!selected||!world) return;
    const target=world.querySelector('[data-node-key="'+selected+'"]');
    const bounds=viewport.getBoundingClientRect(),box=target.getBoundingClientRect();
    const panel=detail.getBoundingClientRect();
    const right=detailsOpen&&!compact?Math.min(bounds.right,panel.left-16):bounds.right;
    const bottom=detailsOpen&&compact?Math.min(bounds.bottom,panel.top-12):bounds.bottom;
    const x=box.left+box.width/2, y=box.top+box.height/2;
    if(box.left<bounds.left+12||box.right>right-12) viewport.scrollLeft+=x-(bounds.left+right)/2;
    if(box.top<bounds.top+12||box.bottom>bottom-12) viewport.scrollTop+=y-(bounds.top+bottom)/2;
  }
  function setExpanded(value) {
    expanded=!!value;
    dialog.classList.toggle('diagram-expanded',expanded);
    fullscreenButton.setAttribute('aria-pressed',String(expanded));
    fullscreenButton.setAttribute('aria-label',expanded?'Thoát chế độ toàn màn hình':'Mở sơ đồ toàn màn hình');
    fullscreenButton.querySelector('span').textContent=expanded?'Thu nhỏ':'Toàn màn hình';
    setDetails(false,false);
    detail.inert=expanded;
    dialog.querySelector('.diagram-scroll-hint').textContent=expanded
      ?'Kéo để di chuyển • Chụm hai ngón hoặc + / − để phóng to • Bấm một khối để mở kiến thức'
      :'Cuộn hoặc vuốt để di chuyển • + / − để phóng to • Toàn sơ đồ để xem tổng thể';
    fitOnResize=true;
    scheduleLayout();
  }
  function exitExpanded() {
    fullscreenRequest++;
    if(document.fullscreenElement===shell) document.exitFullscreen().catch(()=>{});
    setExpanded(false);
  }
  async function toggleFullscreen() {
    if(expanded) { exitExpanded(); return; }
    setExpanded(true);
    const request=++fullscreenRequest;
    // Cover the browser viewport even where native fullscreen is unavailable.
    if(shell.requestFullscreen&&document.fullscreenEnabled) {
      try {
        await shell.requestFullscreen();
        if(request!==fullscreenRequest||!dialog.open) {
          if(document.fullscreenElement===shell) await document.exitFullscreen();
        }
      } catch (_) { /* The expanded layout is the fallback, including iOS. */ }
    }
  }
  document.addEventListener('fullscreenchange',()=>{
    if(document.fullscreenElement===shell) dialog.dataset.nativeFullscreen='true';
    else if(dialog.dataset.nativeFullscreen==='true') {
      delete dialog.dataset.nativeFullscreen;
      if(expanded) setExpanded(false);
    }
    scheduleLayout();
  });
  dialog.addEventListener('cancel',event=>{
    if(expanded) { event.preventDefault(); exitExpanded(); }
  });
  detail.addEventListener('toggle',event=>{
    if(expanded&&compact&&event.target.matches('.diagram-knowledge-reference[open]')) setSheet(true);
  },true);

  // In the expanded canvas, one finger pans and two fingers zoom the diagram.
  const pointers=new Map();
  let pan=null,pinch=null,suppressClickUntil=0;
  const midpoint=()=>{
    const [a,b]=[...pointers.values()];
    return {x:(a.x+b.x)/2,y:(a.y+b.y)/2,distance:Math.hypot(a.x-b.x,a.y-b.y)};
  };
  function beginGesture() {
    pan=pinch=null;
    if(pointers.size===1) {
      const point=pointers.values().next().value;
      pan={...point,left:viewport.scrollLeft,top:viewport.scrollTop};
    } else if(pointers.size===2) {
      const middle=midpoint(),bounds=world.getBoundingClientRect();
      pinch={distance:middle.distance,zoom,x:(middle.x-bounds.left)/zoom,y:(middle.y-bounds.top)/zoom};
    }
  }
  viewport.addEventListener('pointerdown',event=>{
    if(!expanded||event.button!==0) return;
    pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});
    beginGesture();
  });
  viewport.addEventListener('pointermove',event=>{
    if(!expanded||!pointers.has(event.pointerId)) return;
    pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});
    if(pointers.size===2&&pinch) {
      const middle=midpoint();
      if(pinch.distance<1) return;
      applyZoom(pinch.zoom*middle.distance/pinch.distance,false);
      const bounds=world.getBoundingClientRect();
      viewport.scrollLeft+=bounds.left+pinch.x*zoom-middle.x;
      viewport.scrollTop+=bounds.top+pinch.y*zoom-middle.y;
    } else if(pointers.size===1&&pan) {
      const dx=event.clientX-pan.x,dy=event.clientY-pan.y;
      if(Math.hypot(dx,dy)<6) return;
      viewport.scrollLeft=pan.left-dx;
      viewport.scrollTop=pan.top-dy;
    } else return;
    fitOnResize=false;
    suppressClickUntil=performance.now()+350;
    viewport.classList.add('diagram-dragging');
    viewport.setPointerCapture(event.pointerId);
    event.preventDefault();
  });
  function endGesture(event) {
    pointers.delete(event.pointerId);
    if(viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
    if(!pointers.size) viewport.classList.remove('diagram-dragging');
    beginGesture();
  }
  viewport.addEventListener('pointerup',endGesture);
  viewport.addEventListener('pointercancel',endGesture);
  viewport.addEventListener('pointerleave',event=>{
    if(!viewport.hasPointerCapture(event.pointerId)) endGesture(event);
  });
  viewport.addEventListener('click',event=>{
    if(performance.now()<suppressClickUntil&&event.detail) { event.preventDefault(); event.stopPropagation(); }
  },true);
  let sheetStart=null;
  const sheetControls=dialog.querySelector('.diagram-detail-controls');
  sheetControls.addEventListener('pointerdown',event=>{
    if(!expanded||!compact||event.button!==0||event.target.closest('[data-diagram-action="dismiss-details"]')) return;
    sheetStart={id:event.pointerId,y:event.clientY};
  });
  sheetControls.addEventListener('pointermove',event=>{
    if(sheetStart?.id===event.pointerId&&Math.abs(event.clientY-sheetStart.y)>6) sheetControls.setPointerCapture(event.pointerId);
  });
  sheetControls.addEventListener('pointerup',event=>{
    if(!sheetStart||sheetStart.id!==event.pointerId) return;
    const distance=event.clientY-sheetStart.y;
    sheetStart=null;
    if(Math.abs(distance)<40) return;
    suppressClickUntil=performance.now()+350;
    if(distance<0) setSheet(true);
    else if(sheetExpanded) setSheet(false);
    else setDetails(false,true);
  });
  sheetControls.addEventListener('pointercancel',()=>{sheetStart=null;});
  sheetControls.addEventListener('click',event=>{
    if(performance.now()<suppressClickUntil&&event.detail) {event.preventDefault();event.stopPropagation();}
  },true);
  let viewportSize='';
  const observer=typeof ResizeObserver!=='undefined'?new ResizeObserver(()=>{
    const size=viewport.clientWidth+'x'+viewport.clientHeight;
    if(size!==viewportSize) { viewportSize=size; scheduleLayout(); }
  }):null;
  window.addEventListener('resize',scheduleLayout);
  dialog.addEventListener('keydown',event=>{
    if(event.key!=='Tab') return;
    const controls=[...dialog.querySelectorAll('button, [tabindex], summary, a[href]')].filter(element=>element.tabIndex>=0&&!element.disabled&&element.getClientRects().length);
    if(!controls.length) return;
    const first=controls[0],last=controls.at(-1),active=document.activeElement;
    if(event.shiftKey&&(active===first||!dialog.contains(active))) { event.preventDefault(); last.focus(); }
    else if(!event.shiftKey&&(active===last||!dialog.contains(active))) { event.preventDefault(); first.focus(); }
  });
  dialog.addEventListener('click',event=>{
    const button=event.target.closest('[data-diagram-action]');
    if(button) {
      const action=button.dataset.diagramAction;
      if(action==='close') close();
      else if(action==='fit') { if(expanded) setDetails(false,false); fit(false); fitOnResize=false; }
      else if(action==='overview') selectNode(null);
      else if(action==='fullscreen') toggleFullscreen();
      else if(action==='details') { setDetails(!detailsOpen,false); if(detailsOpen) requestAnimationFrame(keepSelectedVisible); }
      else if(action==='dismiss-details') setDetails(false,true);
      else if(action==='chapter') { selectNode(null); setDetails(true,false); }
      else if(action==='sheet') setSheet(!sheetExpanded);
      else if(action==='in'||action==='out') { fitOnResize=false; applyZoom(zoom*(action==='in'?1.25:.8),true); }
    } else if(event.target===dialog) {
      const b=dialog.getBoundingClientRect();
      if(event.clientX<b.left||event.clientX>b.right||event.clientY<b.top||event.clientY>b.bottom) close();
    }
  });
  dialog.addEventListener('close',()=>{
    if(dialog.open) return;
    exitExpanded();
    pointers.clear(); pan=pinch=sheetStart=null;
    viewport.classList.remove('diagram-dragging');
    document.body.classList.remove('chapter-diagram-open');
    if(observer) observer.disconnect();
    cancelAnimationFrame(frame);
    if(trigger&&trigger.isConnected) trigger.focus({preventScroll:true});
  });
  function open(nextChapter,nextOptions) {
    const subjectKey=nextOptions?.subject||'ktvxl';
    if(!nextChapter||!has(subjectKey,nextChapter.id)) return;
    if(dialog.open) dialog.close();
    chapter=nextChapter; options=nextOptions||{}; trigger=options.trigger||document.activeElement;
    subject=subjectModels(subjectKey); chapterModels=subject.chapters[chapter.id];
    sourceSections=window.KMA_DIAGRAM_KNOWLEDGE(chapter);
    dialog.dataset.subject=subjectKey;
    const header=trigger?.closest('.chapter-card')?.querySelector('.chapter-header');
    dialog.style.setProperty('--diagram-accent',header ? getComputedStyle(header).backgroundColor : 'var(--neo-yellow)');
    dialog.querySelector('.diagram-heading-badge').textContent=subject.icon+' SƠ ĐỒ KIẾN THỨC • '+subject.label.toUpperCase();
    dialog.querySelector('#chapter-diagram-help').textContent='Bấm một thành phần để xem giải thích và các liên kết.';
    ['data','address','control'].forEach((type,index)=>{
      dialog.querySelector('.legend-'+type).textContent=subject.legend[index];
    });
    document.getElementById('chapter-diagram-title').textContent=chapter.title;
    dialog.dataset.chapter=String(chapter.id);
    buildTabs();
    dialog.showModal();
    document.body.classList.add('chapter-diagram-open');
    selectView(0);
    setExpanded(false);
    if(observer) observer.observe(viewport);
    if(document.fonts) document.fonts.ready.then(scheduleLayout);
  }
  function close() { if(dialog.open) { exitExpanded(); dialog.close(); } }
  window.KMA_CHAPTER_DIAGRAMS={open,close,has};
  // A review link can open a chapter without changing the normal landing page.
  function openReviewLink() {
    const query=new URLSearchParams(location.search);
    const id=query.get('diagram');
    const subjectKey=query.get('subject')||'ktvxl';
    if(!has(subjectKey,id)) return;
    requestAnimationFrame(()=>{
      document.getElementById('btn-subj-'+subjectKey).click();
      document.getElementById('btn-tab-knowledge').click();
      const button=document.querySelector('.chapter-card[data-chapter-id="'+id+'"] .chapter-diagram-button');
      if(!button) return;
      button.click();
      const index=chapterModels.views.findIndex(view=>view.id===query.get('view'));
      if(index>=0) selectView(index);
      if(query.get('fullscreen')==='1') setExpanded(true);
      if(model.nodes.some(node=>node.id===query.get('node'))) selectNode(query.get('node'));
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',openReviewLink);
  else openReviewLink();
})();
