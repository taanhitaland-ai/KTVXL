(() => {
  'use strict';
  const config = window.KMA_CLOUD_CONFIG;
  const preview = window.KMA_GARDEN_PREVIEW === true && config?.url === 'https://fixture.invalid' &&
    ['localhost', '127.0.0.1'].includes(location.hostname);
  const production = config?.gardenEnabled === true && config.url === 'https://htcnflcncbihhlqoeqsy.supabase.co' &&
    location.protocol === 'https:' && location.hostname === 'taanhitaland-ai.github.io' &&
    (location.pathname === '/KTVXL' || location.pathname.startsWith('/KTVXL/'));
  if (!preview && !production) return;
  const M = window.KMA_GARDEN_MODEL;
  if (!M) return;
  let root, state, storeKey, signature = '', streak = 0, demoStreak = 0, message;
  let plantDialog, plantChoices, plotIndex = -1, chosenSeed, publicDialog, publicBody, publicRequest=0;
  let harvestDialog, harvestBody, collectionDialog, inventory, showcase, collectionCount, score, saveButton, stashButton;
  let draft = null, selectedItem = null, selectedSource = -1, filter = 'all', lastTrigger;
  let chain = Promise.resolve(), loaded=false, revision=0, request=null, draftBase=null, ownProfileHost=null;
  const day = () => window.KMA_STREAK_MODEL.dayKey();
  const identity = () => window.KMA_ACCOUNT?.getLearningIdentity?.() || { user: null, access: 'guest' };
  const ready = () => identity().access === 'ready' && loaded;
  const el = (tag, cls, text) => {
    const node = document.createElement(tag); if (cls) node.className = cls;
    if (text !== undefined) node.textContent = text; return node;
  };
  function button(text, cls, click) {
    const node = el('button', cls, text); node.type = 'button';
    if (click) node.addEventListener('click', click); return node;
  }
  function art(name, alt, cls = '') {
    const isGlowing = name.endsWith('_glowing');
    const baseName = name.replace(/_glowing$/, '');
    const glowingCls = isGlowing ? ' garden-art-glowing' : '';
    const img = el('img', 'garden-art ' + cls + glowingCls);
    img.src = 'garden_assets/' + baseName + '.svg';
    img.alt = alt; img.width = 128; img.height = 128; img.draggable = false; return img;
  }
  function say(text) { if (message.textContent !== text) message.textContent = text; }
  function read(key = storeKey) {
    const raw = localStorage.getItem(key);
    if (raw === null) return M.empty();
    if (raw.length > 120000) return M.empty();
    try { return M.normalize(JSON.parse(raw)); } catch (_) { return M.empty(); }
  }
  function syncIdentity() {
    const nextKey = (preview ? config.storageNamespace || 'kma_preview_garden:' : 'kma_garden_v1:') + 'garden:' + (identity().user || 'guest');
    if (nextKey !== storeKey) { storeKey = nextKey; state = read(); signature = ''; loaded=false;revision=0;request=null; }
    const logs = localStorage.getItem('kma_study_logs_v1');
    try { streak = window.KMA_STREAK_MODEL.build(JSON.parse(logs || '{}')).streak; } catch (_) { streak = 0; }
    streak = Math.max(streak, demoStreak);
    render();
    if(identity().access==='ready'&&!loaded)refresh().catch(()=>{});
  }
  function accept(data,key=storeKey) {
    if(key!==storeKey||!data?.state||Number(data.revision)<revision)return;
    const before=M.assetValue(state);state=M.normalize(data.state);revision=Number(data.revision)||0;loaded=true;
    try{const serialized=JSON.stringify(state);if(localStorage.getItem(key)!==serialized)localStorage.setItem(key,serialized);}catch(_){}
    render();renderOwnProfile();
    if(M.assetValue(state)!==before)window.KMA_ACCOUNT.refreshRanking();
    window.dispatchEvent(new CustomEvent('kma:garden-updated'));
  }
  async function refresh() {
    if(identity().access!=='ready')return;
    if(request)return request;
    const key=storeKey;
    const current=window.KMA_ACCOUNT.gardenRequest('snapshot').then(data=>accept(data,key));request=current;
    try{await current;}catch(error){if(key===storeKey)say('Chưa tải được vườn tài khoản. Mở lại khi kết nối ổn định.');throw error;}
    finally{if(request===current)request=null;}
  }
  async function transaction(action,args={}) {
    const expectedKey = storeKey;
    const work = async () => {
      if (!ready() || expectedKey !== storeKey) throw new Error('Đăng nhập để chăm vườn theo thời gian học.');
      if (action === 'demo' && !preview) throw new Error('Dữ liệu mẫu chỉ dùng trong bản thử.');
      const result=action==='demo'?await window.KMA_GARDEN_DEMO(args):await window.KMA_ACCOUNT.gardenRequest(action,args);
      accept(result,expectedKey);return result;
    };
    const next = chain.catch(() => {}).then(work); chain = next;
    return next.catch(async error => { say(error.message || 'Chưa lưu được vườn. Hãy thử lại.');await refresh().catch(()=>{});throw error; });
  }
  function act(fn) { return () => Promise.resolve().then(fn).catch(() => {}); }
  function meter(value, label, color) {
    const bar = el('div', 'garden-meter'); bar.setAttribute('role', 'progressbar');
    bar.setAttribute('aria-label', label); bar.setAttribute('aria-valuemin', '0'); bar.setAttribute('aria-valuemax', '100');
    const percent = Math.max(0, Math.min(100, value)); bar.setAttribute('aria-valuenow', String(Math.round(percent)));
    const fill = el('span'); fill.style.width = percent + '%'; if (color) fill.style.backgroundColor = color;
    bar.append(fill); return bar;
  }
  function render() {
    if (!root || !state) return;
    const visible = document.visibilityState === 'visible' && document.getElementById('side-planner-drawer')?.classList.contains('open') &&
      document.getElementById('side-tab-pomo')?.classList.contains('active');
    if(!visible){if(collectionDialog?.open)renderCollection();return;}
    const nextSignature = JSON.stringify([state.totalSeconds, state.continuous.seconds, state.seeds, state.plots,
      state.items, state.layout, state.daily[day()], state.misses, state.unlocked, streak, ready()]);
    if (signature === nextSignature) return;
    signature = nextSignature;
    const activePlot = document.activeElement?.dataset.gardenPlot;
    const focusedText = root.contains(document.activeElement) && document.activeElement?.tagName === 'BUTTON' ? document.activeElement.textContent : null;
    const rulesOpen = root.querySelector('.garden-rules')?.open;
    const simulatorOpen = root.querySelector('.garden-simulator')?.open;
    const main = el('div', 'garden-content');
    const head = el('div', 'garden-heading'), title = el('h3', '', 'Vườn học tập');
    head.append(title, el('span', 'garden-day-chip', `Hôm nay +${state.daily[day()] || 0} hạt`)); main.append(head);
    if (preview || !ready()) main.append(el('p', 'garden-demo-label', ready() ? 'BẢN THỬ · Có sẵn cây và vật phẩm mẫu' : identity().access === 'ready' ? 'Đang tải vườn của bạn…' : 'Đăng nhập để chăm vườn theo thời gian học.'));
    const progress = el('div', 'garden-progress-card'), top = el('div', 'garden-between');
    const remainder = state.totalSeconds % 1500;
    top.append(el('strong', '', 'Hạt tiếp theo'), el('strong', 'garden-progress-time', `${Math.floor(remainder / 60)}:${String(remainder % 60).padStart(2,'0')} / 25:00`));
    progress.append(top, meter(remainder / 1500 * 100, 'Tiến độ nhận hạt thường'), el('p', '', 'Đủ 25 phút học nhận 1 hạt thường. Cả 4 môn cùng nuôi vườn.'));
    main.append(progress);
    const seedHeading = el('div', 'garden-between garden-section-heading'); seedHeading.append(el('h4', '', 'Hạt của bạn'), el('span', '', 'Viền = độ hiếm')); main.append(seedHeading);
    const rack = el('div', 'garden-seeds');
    for (const seed of M.seeds) {
      const cell = button('', 'garden-seed', () => {
        chosenSeed = seed.id;
        const empty = state.plots.findIndex((p, i) => !p && (i < 5 || state.unlocked || streak >= 7));
        if (empty < 0) { say('Vườn đã đầy. Thu hoạch một cây trước khi gieo tiếp.'); return; }
        openPlant(empty, seed.id);
      });
      cell.dataset.seed = seed.id; cell.dataset.tier = seed.tier;
      cell.title = `${seed.name} · ${M.tiers.find(t => t.id === seed.tier).name} · cần ${seed.minutes} phút học để chín`;
      cell.disabled = !ready() || !state.seeds[seed.id];
      cell.append(art('seed-' + seed.id, ''), el('strong', '', '×' + state.seeds[seed.id]), el('span', '', seed.name)); rack.append(cell);
    }
    main.append(rack);
    const plotHeading = el('div', 'garden-between garden-section-heading'); plotHeading.append(el('h4', '', 'Mảnh vườn'), el('span', '', 'Lớn nhờ phút học')); main.append(plotHeading);
    const grid = el('div', 'garden-plots');
    for (let i = 0; i < 6; i++) {
      const plot = state.plots[i], locked = i === 5 && !state.unlocked && streak < 7;
      if (!plot) {
        const cell = button('', 'garden-plot garden-empty' + (locked ? ' garden-locked' : ''), () => openPlant(i));
        cell.dataset.gardenPlot = String(i); cell.disabled = locked || !ready();
        cell.append(locked ? art('lock', '', 'garden-lock-icon') : el('span', 'garden-empty-symbol', '+'), el('strong', '', locked ? 'Ô khóa' : 'Ô trống'), el('span', '', locked ? 'Mở khi chuỗi đạt 7 ngày' : 'Chọn một hạt để gieo'));
        grid.append(cell); continue;
      }
      const seed = M.seedById(plot.seed), fraction = plot.seconds / (seed.minutes * 60), mature = fraction >= 1;
      const isGlowing = plot.glowing === true;
      const cell = el('article', 'garden-plot' + (mature ? ' garden-ripe' : '') + (isGlowing ? ' garden-plot-glowing' : '')); cell.dataset.plot = String(i);
      if (isGlowing) cell.append(el('span', 'garden-glowing-badge', '✨ Cây phát sáng'));
      cell.append(art(`tree-${seed.id}-${mature ? 3 : Math.min(2, Math.floor(fraction * 3))}`, seed.tree, isGlowing ? 'garden-tree-glowing' : ''), el('h5', '', seed.tree + (isGlowing ? ' ✨' : '')));
      cell.append(el('span', mature ? (isGlowing ? 'garden-ripe-label garden-ripe-glowing' : 'garden-ripe-label') : 'garden-muted', mature ? (isGlowing ? '✨ Chín rồi (Phát sáng)!' : 'Chín rồi!') : `Cần thêm ${Math.ceil((seed.minutes * 60 - plot.seconds) / 60)} phút`), meter(fraction * 100, 'Độ lớn của ' + seed.tree, isGlowing ? '#ffd700' : seed.color));
      if (mature) {
        const harvest = button(isGlowing ? '✨ Thu hoạch' : 'Thu hoạch', 'garden-button garden-primary' + (isGlowing ? ' garden-button-glowing' : ''), act(async () => {
          harvest.disabled = true;
          try {
            const result = await transaction('harvest',{p_plot:i,p_created_at:plot.createdAt||0});
            say('Đã thu hoạch ' + M.itemById(result.reward.item).name + '.'); openHarvest(result.reward);
          } finally { if (harvest.isConnected) harvest.disabled = false; }
        }));
        harvest.dataset.gardenHarvest = String(i); harvest.disabled = !ready(); cell.append(harvest);
      }
      grid.append(cell);
    }
    main.append(grid);
    const collectionButton = button('▦ Bộ sưu tập & trưng bày', 'garden-button garden-collection-link', () => openCollection());
    collectionButton.disabled = !ready(); main.append(collectionButton);
    main.append(el('p', 'garden-storage-note', 'Vườn và bố cục được lưu theo tài khoản. Biệt danh, bộ sưu tập và tổng giá trị được công khai.' + (preview ? ' Bản thử dùng database riêng.' : '')));
    const rules = el('details', 'garden-rules'), summary = el('summary', '', 'Luật vườn & tỉ lệ'); rules.open = !!rulesOpen; rules.append(summary);
    rules.append(el('p', '', 'Mỗi 25 phút học: 1 hạt thường. Trong mỗi lượt liên tục, mốc 60 phút thêm 1 hạt hiếm; mốc 120 phút thêm 1 hạt sử thi. Đổi môn không ngắt lượt; nghỉ từ 15 phút sẽ bắt đầu lượt thưởng mới.'));
    rules.append(el('p', '', 'Tất cả cây đã gieo cùng lớn theo số phút học được xác nhận. Chờ ngoài bài học và bấm gieo/thu hoạch không làm cây lớn. Ô thứ 6 mở ở chuỗi 7 ngày và được giữ mở.'));
    rules.append(el('p', 'garden-glowing-note', '✨ Cây phát sáng (20% khi gieo): Tăng tỉ lệ ra vật phẩm Hiếm/Sử thi/Huyền thoại và có 50% cơ hội rơi vật phẩm phát sáng (giá trị gấp 2.5 lần)!'));
    rules.append(el('p', '', 'Sau 9 lần liên tiếp không có Sử thi/Huyền thoại, lần thứ 10 bảo đảm Sử thi trở lên. Gặp Sử thi/Huyền thoại sẽ reset bảo hiểm.'));
    for (const tier of ['common','rare','epic']) {
      const norm = M.rates[tier].map((n,i)=>`${M.tiers[i].name} ${n}%`).join(' · ');
      const glow = M.glowingRates[tier].map((n,i)=>`${M.tiers[i].name} ${n}%`).join(' · ');
      rules.append(el('p', '', `Hạt ${M.tiers.find(t => t.id === tier).name}: ${norm}`));
      rules.append(el('p', 'garden-glowing-subrule', `✨ Cây ${M.tiers.find(t => t.id === tier).name} phát sáng: ${glow}`));
    }
    main.append(rules);
    if (preview) {
    const demo = el('details', 'garden-simulator'), demoTitle = el('summary', '', 'Thử giao diện bằng dữ liệu mẫu'); demo.open = !!simulatorOpen; demo.append(demoTitle);
    demo.append(el('p', '', 'Các nút này chỉ thay đổi vườn mẫu. Không cộng giờ học, lịch sử hoặc BXH.'));
    const controls = el('div', 'garden-demo-controls');
    for (const minutes of [25,60,120]) controls.append(button(`Mẫu: +${minutes} phút`, 'garden-button garden-small', act(async () => {
      await transaction('demo',{action:'credit',minutes});
      say(`Đã thử thêm ${minutes} phút trong vườn mẫu; BXH giữ nguyên.`);
    })));
    controls.append(button('Mẫu: chuỗi 7 ngày', 'garden-button garden-small', act(async () => {
      demoStreak = 7; streak = 7; await transaction('demo',{action:'unlock'}); say('Đã mở ô thứ 6 trong vườn mẫu.');
    })));
    controls.append(button('Đặt lại vườn mẫu', 'garden-button garden-small', act(async () => {
      if (!confirm('Đặt lại riêng vườn mẫu, gồm cây, kho và trưng bày? Giờ học và BXH không thay đổi.')) return;
      await transaction('demo',{action:'reset'}); demoStreak = 0; syncIdentity(); say('Đã đặt lại vườn mẫu.');
    })));
    for (const b of controls.children) b.disabled = !ready();
    demo.append(controls); main.append(demo);
    }
    const content = root.querySelector('.garden-content'); if (content) content.replaceWith(main); else root.prepend(main);
    if (activePlot !== undefined) root.querySelector(`[data-garden-plot="${activePlot}"]`)?.focus({preventScroll:true});
    else if(focusedText) [...root.querySelectorAll('button')].find(b=>b.textContent===focusedText)?.focus({preventScroll:true});
    if (collectionDialog?.open) renderCollection();
  }
  function makeDialog(id, title, cls) {
    const dialog = el('dialog', 'garden-dialog ' + cls); dialog.id = id;
    dialog.setAttribute('aria-labelledby', id + '-title');
    const head = el('header', 'garden-modal-head'), heading = el('h2', '', title); heading.id = id + '-title';
    const close = button('×', 'garden-close', () => requestClose(dialog)); close.setAttribute('aria-label', 'Đóng ' + title.toLowerCase());
    head.append(heading, close); dialog.append(head); document.body.append(dialog);
    dialog.addEventListener('click', event => { if (event.target === dialog) {
      const r = dialog.getBoundingClientRect();
      if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom) requestClose(dialog);
    }});
    dialog.addEventListener('cancel', event => { if (!mayClose(dialog)) event.preventDefault(); });
    dialog.addEventListener('close', () => { if (dialog === collectionDialog) { draft = null; selectedItem = null; selectedSource = -1; } if (lastTrigger?.isConnected) lastTrigger.focus({preventScroll:true}); });
    return dialog;
  }
  function mayClose(dialog) { return dialog !== collectionDialog || !draft || JSON.stringify(draft) === JSON.stringify(state.layout) || confirm('Bố cục chưa lưu. Đóng và bỏ thay đổi?'); }
  function requestClose(dialog) { if (mayClose(dialog)) dialog.close(); }
  function show(dialog) { lastTrigger = document.activeElement; if (!dialog.open) dialog.showModal(); }
  function openPlant(index, preferred) {
    if (!ready()) return;
    plotIndex = index; chosenSeed = preferred || M.seeds.find(s => state.seeds[s.id])?.id;
    plantChoices.replaceChildren();
    for (const seed of M.seeds) {
      const cell = button('', 'garden-plant-choice', () => {
        chosenSeed = seed.id;
        for (const node of plantChoices.children) node.setAttribute('aria-pressed', String(node.dataset.seed === chosenSeed));
      });
      cell.dataset.seed = seed.id; cell.dataset.tier = seed.tier; cell.setAttribute('aria-pressed', String(seed.id === chosenSeed)); cell.disabled = !state.seeds[seed.id];
      cell.append(art('seed-' + seed.id, ''), el('strong','',seed.name), el('span','',`${state.seeds[seed.id]} hạt · ${seed.minutes} phút học`)); plantChoices.append(cell);
    }
    show(plantDialog);
  }
  function openHarvest(reward) {
    const item = M.itemById(reward.item), seed = M.seedById(reward.seed), tier = M.tiers.find(t => t.id === item.tier);
    harvestBody.replaceChildren();
    const captionText = reward.treeGlowing ? `✨ ${seed.tree} phát sáng · thu hoạch lần ${reward.harvest}` : `${seed.tree} · thu hoạch lần ${reward.harvest}`;
    harvestBody.append(el('span','garden-harvest-caption' + (reward.treeGlowing ? ' garden-caption-glowing' : ''), captionText));
    const spotlight = el('div','garden-spotlight' + (item.glowing ? ' is-glowing-spotlight' : '')), rays = el('div','garden-rays' + (item.glowing ? ' garden-rays-glowing' : ''));
    rays.setAttribute('aria-hidden','true');
    spotlight.append(rays, art('ore-' + item.id, item.name, item.glowing ? 'garden-art-glowing' : ''));
    harvestBody.append(spotlight);
    const ribbonText = item.glowing ? `✨ ${tier.name.toUpperCase()} PHÁT SÁNG ✨` : tier.name.toUpperCase();
    const ribbon = el('span','garden-rarity-ribbon' + (item.glowing ? ' garden-ribbon-glowing' : ''), ribbonText);
    ribbon.style.backgroundColor = item.glowing ? '#ffd700' : tier.color;
    harvestBody.append(ribbon, el('h3','garden-reward-name' + (item.glowing ? ' garden-reward-glowing' : ''), item.name));
    let subText = `${reward.isNew ? 'Vật phẩm mới!' : 'Đã thêm vào bộ sưu tập'} · Đang có ×${state.items[item.id]}`;
    if (item.glowing) subText += ` · ✨ Giá trị gấp 2.5 lần (${item.points}đ)!`;
    harvestBody.append(el('p','garden-muted', subText));
    const odds = el('section','garden-drop-rates');
    const oddsTitle = reward.treeGlowing
      ? `Tỉ lệ cây phát sáng (${seed.name.replace(/^Hạt /,'')} · ${M.tiers.find(t => t.id === seed.tier).name}) ✨`
      : `Tỉ lệ hạt ${seed.name.replace(/^Hạt /,'')} (${M.tiers.find(t => t.id === seed.tier).name})`;
    odds.append(el('h4','', oddsTitle));
    const rateTable = reward.treeGlowing ? M.glowingRates[seed.tier] : M.rates[seed.tier];
    const bar = el('div','garden-drop-bar'), labels = el('div','garden-drop-labels');
    rateTable.forEach((n,i)=>{
      const part=el('span'); part.style.width=n+'%'; part.style.backgroundColor=M.tiers[i].color; if(M.tiers[i].id===item.tier)part.classList.add('is-result'); bar.append(part);
      const label=el('span','',`${M.tiers[i].name} ${n}%`); const dot=el('i');dot.style.backgroundColor=M.tiers[i].color;label.prepend(dot);labels.append(label);
    });
    odds.append(bar,labels);
    if (reward.treeGlowing) {
      odds.append(el('p','garden-glowing-note','✨ Cây phát sáng: tăng mạnh tỉ lệ đồ Hiếm / Sử thi / Huyền thoại + 50% cơ hội rơi vật phẩm phát sáng!'));
    }
    if(reward.guaranteed)odds.append(el('p','garden-guarantee','Lượt này kích hoạt bảo hiểm: chỉ Sử thi/Huyền thoại, theo tỉ lệ tương đối của hai hạng này.'));
    harvestBody.append(odds,el('p','garden-pity',`Bảo hiểm: còn ${10-state.misses} lần nữa chắc chắn Sử thi trở lên.`));
    const actions=el('div','garden-modal-actions');
    actions.append(button('Đặt vào trưng bày','garden-button garden-primary',()=>{harvestDialog.close();openCollection(item.id);}),button('Về vườn','garden-button',()=>harvestDialog.close()));harvestBody.append(actions);show(harvestDialog);
  }
  const available = id => Math.max(0, state.items[id] - (draft || []).filter(i=>i===id).length);
  function selectItem(id, source=-1) {
    if(!M.itemById(id)||!state.items[id]||(source<0&&!available(id)))return;
    selectedItem=id;selectedSource=source;renderCollection();
  }
  function place(index) {
    if(!selectedItem) { if(draft[index])selectItem(draft[index],index);return; }
    if(selectedSource>=0) { const displaced=draft[index]; draft[index]=selectedItem;draft[selectedSource]=displaced; }
    else if(available(selectedItem)>0)draft[index]=selectedItem;
    else return;
    selectedItem=null;selectedSource=-1;renderCollection();showcase.children[index]?.focus({preventScroll:true});
  }
  function openCollection(preferred) {
    draft=state.layout.slice();draftBase=state.layout.slice();selectedItem=null;selectedSource=-1;filter='all';
    if(preferred&&available(preferred)>0)selectedItem=preferred;
    renderCollection();show(collectionDialog);
  }
  function renderCollection() {
    if(!draft)return;
    const baseCount = M.items.filter(i=>state.items[i.id]).length;
    const glowCount = M.items.filter(i=>state.items[i.id + '_glowing']).length;
    collectionCount.textContent = `${baseCount}/10 thường` + (glowCount ? ` · ${glowCount}/10 ✨` : '');
    score.textContent=M.score(draft).toLocaleString('vi-VN')+' điểm bày';
    collectionDialog.querySelector('.garden-total-value').textContent='Tổng giá trị bộ sưu tập: '+M.assetValue(state).toLocaleString('vi-VN')+' điểm';
    for(const btn of collectionDialog.querySelectorAll('[data-garden-filter]')) { const active=filter===btn.dataset.gardenFilter;btn.setAttribute('aria-pressed',String(active)); }
    inventory.replaceChildren();
    const allCollectionItems = M.allItems || M.items.flatMap(i => [M.itemById(i.id), M.itemById(i.id + '_glowing')]);
    const filteredItems = allCollectionItems.filter(item => {
      if (filter === 'all') return true;
      if (filter === 'glowing') return item.glowing;
      return item.tier === filter;
    });
    for(const item of filteredItems) {
      const owned=(state.items[item.id] || 0)>0,tier=M.tiers.find(t=>t.id===item.tier);
      const cell=button('','garden-collect-item'+(owned?'':' garden-unknown') + (item.glowing ? ' is-glowing-item' : ''),()=>selectItem(item.id));
      cell.dataset.item=item.id;cell.dataset.tier=item.tier;
      if (item.glowing) cell.dataset.glowing = 'true';
      cell.disabled=!owned||!available(item.id);
      cell.setAttribute('aria-pressed',String(selectedItem===item.id));
      cell.title=owned?`${item.name} · ${tier.name} (${item.points}đ) · có ${state.items[item.id]}, còn ${available(item.id)} trong kho`:(item.glowing?'Chưa khám phá ✨ · ':'Chưa khám phá · ')+tier.name;
      cell.append(
        art('ore-'+item.id,owned?item.name:'Vật phẩm chưa khám phá', item.glowing ? 'garden-art-glowing' : ''),
        el('strong','',owned?item.name:(item.glowing?'??? ✨':'???')),
        el('span','',tier.name+(owned?' · ×'+state.items[item.id]:'') + (item.glowing ? ' (2.5×)' : ''))
      );
      cell.draggable=owned&&available(item.id)>0;
      cell.addEventListener('dragstart',event=>{if(!owned||!available(item.id)){event.preventDefault();return;}selectedItem=item.id;selectedSource=-1;event.dataTransfer.setData('text/plain',item.id);event.dataTransfer.effectAllowed='copy';collectionDialog.classList.add('garden-dragging');});
      inventory.append(cell);
    }
    showcase.replaceChildren();
    const defaultTarget=draft.findIndex(id=>!id);
    draft.forEach((id,index)=>{
      const it=id?M.itemById(id):null;
      const cell=button('','garden-showcase-slot' + (it?.glowing ? ' is-glowing-slot' : ''),()=>place(index));cell.dataset.gardenSlot=String(index);
      cell.setAttribute('aria-label',`Ô ${index+1}: ${it?it.name:'trống'}`);
      if(id)cell.append(art('ore-'+id,it.name,it?.glowing?'garden-art-glowing':''));
      else cell.append(el('span','garden-slot-placeholder',selectedItem?'+':''));
      cell.classList.toggle('is-target',!!selectedItem&&index===defaultTarget);
      cell.classList.toggle('is-source',selectedSource===index);
      cell.draggable=!!id;
      cell.addEventListener('dragstart',event=>{if(!id){event.preventDefault();return;}selectedItem=id;selectedSource=index;event.dataTransfer.setData('text/plain',id);event.dataTransfer.effectAllowed='move';collectionDialog.classList.add('garden-dragging');});
      cell.addEventListener('dragover',event=>{if(!selectedItem)return;event.preventDefault();showcase.querySelectorAll('.is-target').forEach(n=>n.classList.remove('is-target'));cell.classList.add('is-over');});
      cell.addEventListener('dragleave',()=>cell.classList.remove('is-over'));
      cell.addEventListener('drop',event=>{event.preventDefault();cell.classList.remove('is-over');collectionDialog.classList.remove('garden-dragging');if(selectedItem&&event.dataTransfer.getData('text/plain')===selectedItem)place(index);});
      showcase.append(cell);
    });
    collectionDialog.querySelector('.garden-display-hint').textContent=selectedItem?`Đang cầm ${M.itemById(selectedItem).name} · chọn một ô để đặt.`:'Chọn vật phẩm rồi chạm một ô để bày. Máy tính hỗ trợ kéo-thả.';
    saveButton.disabled=JSON.stringify(draft)===JSON.stringify(state.layout);
    stashButton.disabled=selectedSource<0;
  }
  function initDialogs() {
    plantDialog=makeDialog('garden-plant-dialog','Gieo một hạt','garden-plant-dialog');
    const body=el('div','garden-modal-body');body.append(el('p','garden-muted','Cây chỉ lớn theo thời gian học của cả 4 môn.'));
    plantChoices=el('div','garden-plant-choices');body.append(plantChoices);
    const submit=button('Gieo hạt','garden-button garden-primary',act(async()=>{
      submit.disabled=true;try {await transaction('plant',{p_plot:plotIndex,p_seed:chosenSeed});plantDialog.close();say('Đã gieo hạt. Học tiếp để cây lớn.');}finally{submit.disabled=false;}
    }));body.append(submit);plantDialog.append(body);
    harvestDialog=makeDialog('garden-harvest-dialog','Thu hoạch','garden-harvest-dialog');harvestBody=el('div','garden-modal-body garden-harvest-body');harvestDialog.append(harvestBody);
    collectionDialog=makeDialog('garden-collection-dialog','Sưu tầm & trưng bày','garden-collection-dialog');
    const columns=el('div','garden-collection-columns'),left=el('section','garden-inventory'),right=el('section','garden-display');
    const leftHead=el('div','garden-between');collectionCount=el('span','garden-muted');leftHead.append(el('h3','','Bộ sưu tập'),collectionCount);left.append(leftHead,el('p','garden-total-value'));
    const filters=el('div','garden-filters');
    for(const tier of [{id:'all',name:'Tất cả'},...M.tiers,{id:'glowing',name:'✨ Phát sáng'}]) {const btn=button(tier.name,'garden-filter',()=>{filter=tier.id;renderCollection();});btn.dataset.gardenFilter=tier.id;btn.dataset.tier=tier.id;filters.append(btn);}left.append(filters);
    inventory=el('div','garden-inventory-grid');left.append(inventory);
    const rightHead=el('div','garden-between');score=el('strong','garden-score');rightHead.append(el('h3','','Hộp trưng bày'),score);right.append(rightHead,el('p','garden-display-hint'));
    showcase=el('div','garden-showcase');showcase.setAttribute('aria-label','Hộp trưng bày 5 cột, 3 hàng');right.append(showcase);
    const actions=el('div','garden-modal-actions');
    stashButton=button('Cất vào kho','garden-button',()=>{if(selectedSource<0)return;draft[selectedSource]=null;selectedItem=null;selectedSource=-1;renderCollection();});
    saveButton=button('Lưu bố cục','garden-button garden-primary',act(async()=>{saveButton.disabled=true;try{await transaction('layout',{p_layout:draft,p_previous:draftBase});draftBase=state.layout.slice();say('Đã lưu bố cục vào hồ sơ.');}finally{renderCollection();}}));
    actions.append(stashButton,saveButton);right.append(actions);
    right.append(button('Dọn hộp trưng bày','garden-text-button',()=>{if(confirm('Cất tất cả vật phẩm về kho trong bố cục đang sửa?')){draft=Array(15).fill(null);selectedItem=null;selectedSource=-1;renderCollection();}}));
    right.append(el('p','garden-muted garden-points-note','Điểm mỗi ô: Rác 10 · Thường 30 · Hiếm 80 · Sử thi 180 · Huyền thoại 400. Bản phát sáng x2.5 điểm.'));
    columns.append(left,right);collectionDialog.append(columns);
    collectionDialog.addEventListener('dragend',()=>{collectionDialog.classList.remove('garden-dragging');collectionDialog.querySelectorAll('.is-over').forEach(n=>n.classList.remove('is-over'));});
    publicDialog=makeDialog('garden-public-dialog','Trưng bày của người học','garden-public-dialog');
    publicBody=el('div','garden-modal-body');publicDialog.append(publicBody);
  }
  function readOnlyCollection(host,raw,{owned=false}={}) {
    const view=M.normalize(raw),value=M.assetValue(view);
    host.replaceChildren();
    const metrics=el('div','garden-profile-metrics');
    const baseDiscovered = M.items.filter(i=>view.items[i.id]).length;
    const glowDiscovered = M.items.filter(i=>view.items[i.id + '_glowing']).length;
    const discLabel = `${baseDiscovered}/10` + (glowDiscovered ? ` (+${glowDiscovered}✨)` : '');
    for(const [n,label] of [[value,'Tổng giá trị'],[discLabel,'Đã khám phá'],[M.score(view.layout),'Điểm trưng bày']]){
      const item=el('div');item.append(el('strong','',typeof n==='number'?n.toLocaleString('vi-VN'):n),el('span','',label));metrics.append(item);
    }
    host.append(metrics,el('h3','garden-profile-heading','Hộp trưng bày'));
    const grid=el('div','garden-showcase garden-readonly-showcase');grid.setAttribute('aria-label','Trưng bày 5 cột, 3 hàng');
    for(const id of view.layout){
      const it=id?M.itemById(id):null;
      const slot=el('div','garden-showcase-slot' + (it?.glowing ? ' is-glowing-slot' : ''));
      if(id){slot.title=it.name;slot.append(art('ore-'+id,it.name,it?.glowing?'garden-art-glowing':''));}
      else slot.setAttribute('aria-label','Ô trống');
      grid.append(slot);
    }
    host.append(grid);
    if(owned)host.append(button('Sắp xếp trưng bày','garden-button garden-primary garden-profile-edit',()=>openCollection()));
    const section=el('section','garden-profile-inventory');section.append(el('h3','garden-profile-heading','Bộ sưu tập'));
    const items=el('div','garden-inventory-grid');
    const allCollectionItems = M.allItems || M.items.flatMap(i => [M.itemById(i.id), M.itemById(i.id + '_glowing')]);
    for(const item of allCollectionItems){
      const count=view.items[item.id] || 0,cell=el('div','garden-collect-item'+(count?'':' garden-unknown') + (item.glowing ? ' is-glowing-item' : ''));
      cell.dataset.tier=item.tier;
      if (item.glowing) cell.dataset.glowing = 'true';
      cell.append(
        art('ore-'+item.id,count?item.name:'Vật phẩm chưa khám phá', item.glowing ? 'garden-art-glowing' : ''),
        el('strong','',count?item.name:(item.glowing?'??? ✨':'???')),
        el('span','',M.tiers.find(t=>t.id===item.tier).name+(count?' · ×'+count:'') + (item.glowing ? ' (2.5×)' : ''))
      );
      items.append(cell);
    }
    section.append(items);host.append(section,el('p','garden-points-note garden-muted','Giá trị tính tất cả vật phẩm trong kho, kể cả vật phẩm chưa trưng bày. Bản phát sáng x2.5 điểm. Rác 10 · Thường 30 · Hiếm 80 · Sử thi 180 · Huyền thoại 400.'));
  }
  function renderOwnProfile() {
    if(!ownProfileHost?.isConnected||!document.getElementById('sync-account-dialog')?.open||ownProfileHost.hidden)return;
    if(!ready()){ownProfileHost.replaceChildren(el('p','garden-muted','Đang tải bộ sưu tập tài khoản…'));return;}
    const next=JSON.stringify([state.items,state.layout]);if(ownProfileHost.dataset.signature===next)return;
    ownProfileHost.dataset.signature=next;readOnlyCollection(ownProfileHost,state,{owned:true});
  }
  function mountOwnProfile(container) {
    if(!container||container.querySelector('.garden-profile-tabs'))return;
    const lead=container.firstElementChild,progress=el('section','garden-profile-progress');progress.id='garden-profile-progress';
    for(const child of [...container.children].slice(1))progress.append(child);
    ownProfileHost=el('section','garden-profile-exhibition garden-dialog');ownProfileHost.id='garden-profile-exhibition';ownProfileHost.hidden=true;
    const toolbar=el('div','garden-profile-toolbar'),tabs=el('div','garden-profile-tabs');tabs.setAttribute('role','tablist');tabs.setAttribute('aria-label','Nội dung hồ sơ');
    const choose=index=>{progress.hidden=index!==0;ownProfileHost.hidden=index!==1;
      [...tabs.children].forEach((b,i)=>{b.setAttribute('aria-selected',String(i===index));b.tabIndex=i===index?0:-1;});
      if(index===1){renderOwnProfile();refresh().catch(()=>{});}
    };
    ['Tiến trình','Trưng bày'].forEach((label,index)=>{const tab=button(label,'garden-profile-tab',()=>choose(index));tab.setAttribute('role','tab');tab.id='garden-profile-tab-'+index;
      tab.setAttribute('aria-controls',index===0?progress.id:ownProfileHost.id);tabs.append(tab);});
    tabs.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();
      const index=event.key==='Home'?0:event.key==='End'?1:1-[...tabs.children].indexOf(document.activeElement);choose(index);tabs.children[index].focus();});
    [progress,ownProfileHost].forEach((panel,index)=>{panel.setAttribute('role','tabpanel');panel.setAttribute('aria-labelledby','garden-profile-tab-'+index);});
    const intro=lead?.querySelector('p');if(intro)toolbar.append(intro);toolbar.append(tabs);container.append(toolbar,progress,ownProfileHost);choose(0);
    refresh().catch(()=>{});
  }
  async function openPublic(id) {
    if(!/^[0-9a-f-]{36}$/i.test(id))return;
    const token=++publicRequest;publicBody.replaceChildren(el('p','garden-muted','Đang tải bộ sưu tập…'));publicBody.setAttribute('aria-busy','true');show(publicDialog);
    try{
      const data=await window.KMA_ACCOUNT.gardenRequest('public',{p_user:id});
      if(token!==publicRequest||!publicDialog.open)return;
      if(!data){publicBody.replaceChildren(el('p','garden-muted','Chưa có hồ sơ người học này.'));return;}
      publicDialog.querySelector('h2').textContent='Trưng bày · '+String(data.nickname||'Người học').normalize('NFC').slice(0,32);
      readOnlyCollection(publicBody,{v:1,items:data.items,layout:data.layout});
    }catch(_){if(token===publicRequest)publicBody.replaceChildren(el('p','garden-muted','Chưa tải được bộ sưu tập. Đóng và mở lại để thử.'));}
    finally{if(token===publicRequest)publicBody.removeAttribute('aria-busy');}
  }
  function init() {
    const container=document.getElementById('side-tab-pomo');if(!container)return;
    root=el('section','study-garden');root.id='study-garden';root.setAttribute('aria-label','Vườn học tập');
    message=el('p','garden-status');message.setAttribute('role','status');message.setAttribute('aria-live','polite');root.append(message);container.append(root);
    initDialogs();syncIdentity();
    const visibilityObserver=new MutationObserver(render);
    for(const id of ['side-planner-drawer','side-tab-pomo'])visibilityObserver.observe(document.getElementById(id),{attributes:true,attributeFilter:['class']});
    document.addEventListener('visibilitychange',()=>{render();if(document.visibilityState==='visible')refresh().catch(()=>{});});
    window.addEventListener('kma:cloud-updated',syncIdentity);
    // Cache notifications never start another RPC, so two tabs cannot bounce requests.
    window.addEventListener('storage',event=>{if(event.key===storeKey){state=read();render();renderOwnProfile();}});
    window.addEventListener('kma:study-confirmed',event=>{
      if(!ready())return;
      refresh().catch(()=>{});
    });
    window.addEventListener('kma:profile-rendered',event=>mountOwnProfile(event.detail.container));
    window.KMA_STUDY_GARDEN={getState:()=>M.normalize(state),openCollection,openPublic,refresh,openHarvest:()=>{if(state.lastReward)openHarvest(state.lastReward);}};
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
