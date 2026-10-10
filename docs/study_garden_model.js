(function (root, factory) {
  const model = factory();
  if (typeof module === 'object' && module.exports) module.exports = model;
  else root.KMA_GARDEN_MODEL = model;
})(typeof window === 'object' ? window : globalThis, () => {
  'use strict';
  const tiers = [
    { id: 'scrap', name: 'Rác', color: '#9ca3af', points: 10 },
    { id: 'common', name: 'Thường', color: '#73ce68', points: 30 },
    { id: 'rare', name: 'Hiếm', color: '#4c8dff', points: 80 },
    { id: 'epic', name: 'Sử thi', color: '#af72ff', points: 180 },
    { id: 'legendary', name: 'Huyền thoại', color: '#ffb522', points: 400 }
  ];
  const seeds = [
    { id: 'oak', name: 'Hạt sồi', tree: 'Cây sồi', tier: 'common', color: '#66b85d', minutes: 60 },
    { id: 'maple', name: 'Hạt phong', tree: 'Cây phong', tier: 'common', color: '#ff903d', minutes: 120 },
    { id: 'cherry', name: 'Hạt anh đào', tree: 'Cây anh đào', tier: 'rare', color: '#ff91b9', minutes: 60 },
    { id: 'bamboo', name: 'Hạt tre', tree: 'Cây tre', tier: 'rare', color: '#a7cc5f', minutes: 120 },
    { id: 'galaxy', name: 'Hạt thiên hà', tree: 'Cây thiên hà', tier: 'epic', color: '#aa81f4', minutes: 180 }
  ];
  const items = [
    { id: 'coal', name: 'Mảnh than', tier: 'scrap', color: '#333841' },
    { id: 'stone', name: 'Đá vụn', tier: 'scrap', color: '#e7e2d5' },
    { id: 'copper', name: 'Mạch đồng', tier: 'common', color: '#ed9565' },
    { id: 'tin', name: 'Thiếc rừng', tier: 'common', color: '#c4dacd' },
    { id: 'azure', name: 'Lam tinh ngọc', tier: 'rare', color: '#518cff' },
    { id: 'rose', name: 'Hồng khoáng', tier: 'rare', color: '#fc657d' },
    { id: 'sun', name: 'Nắng kết tinh', tier: 'epic', color: '#ffe451' },
    { id: 'moss', name: 'Ngọc rêu', tier: 'epic', color: '#52df9b' },
    { id: 'frost', name: 'Tinh thể sương', tier: 'legendary', color: '#7ce7ec' },
    { id: 'cosmos', name: 'Lõi thiên hà', tier: 'legendary', color: '#bf8dff' }
  ];
  const rates = { common: [45, 35, 16, 3, 1], rare: [20, 35, 28, 12, 5], epic: [5, 20, 35, 28, 12] };
  const sessionPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const number = (n, max = 1e9) => Number.isFinite(n) ? Math.min(max, Math.max(0, Math.floor(n))) : 0;
  const seedById = id => seeds.find(s => s.id === id);
  const itemById = id => items.find(s => s.id === id);
  const empty = () => ({ v: 1, totalSeconds: 0, continuous: { seconds: 0, endMs: 0, rare: false, epic: false },
    seeds: Object.fromEntries(seeds.map(s => [s.id, 0])), plots: Array(6).fill(null),
    items: Object.fromEntries(items.map(i => [i.id, 0])), layout: Array(15).fill(null),
    misses: 0, harvests: 0, rareAwards: 0, unlocked: false, daily: {}, cursors: {}, lastReward: null });
  function normalize(raw) {
    const out = empty();
    if (!raw || typeof raw !== 'object' || raw.v !== 1) return out;
    out.totalSeconds = number(raw.totalSeconds);
    const c = raw.continuous || {};
    out.continuous = { seconds: number(c.seconds), endMs: number(c.endMs, 1e14), rare: c.rare === true, epic: c.epic === true };
    for (const seed of seeds) out.seeds[seed.id] = number(raw.seeds?.[seed.id], 9999);
    for (const item of items) out.items[item.id] = number(raw.items?.[item.id], 9999);
    out.unlocked = raw.unlocked === true;
    out.plots = out.plots.map((_, i) => {
      const plot = raw.plots?.[i], seed = seedById(plot?.seed);
      return seed && (i < 5 || out.unlocked) ? { seed: seed.id, seconds: number(plot.seconds, seed.minutes * 60), createdAt: number(plot.createdAt, 1e14) } : null;
    });
    out.misses = number(raw.misses, 9); out.harvests = number(raw.harvests); out.rareAwards = number(raw.rareAwards);
    const placed = {};
    out.layout = out.layout.map((_, i) => {
      const id = raw.layout?.[i];
      if (!itemById(id) || (placed[id] || 0) >= out.items[id]) return null;
      placed[id] = (placed[id] || 0) + 1; return id;
    });
    for (const [day, count] of Object.entries(raw.daily || {}).slice(-64)) {
      if (/^\d{4}-\d{2}-\d{2}$/.test(day)) out.daily[day] = number(count, 9999);
    }
    for (const [id, cursor] of Object.entries(raw.cursors || {}).slice(-128)) {
      if (sessionPattern.test(id)) out.cursors[id] = { seconds: number(cursor.seconds), endMs: number(cursor.endMs, 1e14) };
    }
    if (itemById(raw.lastReward?.item) && seedById(raw.lastReward?.seed)) out.lastReward = {
      item: raw.lastReward.item, seed: raw.lastReward.seed, guaranteed: raw.lastReward.guaranteed === true,
      harvest: number(raw.lastReward.harvest), isNew: raw.lastReward.isNew === true
    };
    return out;
  }
  // Delta comes only from accepted activity windows, never wall-clock waiting.
  // Repeated/out-of-order observations of one window cannot grant more time.
  function credit(raw, event) {
    const out = normalize(raw), awards = [];
    if (!event || !['ktvxl', 'tthcm', 'vldc', 'xstk'].includes(event.subject) ||
        !sessionPattern.test(event.sessionId || '') ||
        !Number.isFinite(event.seconds) || event.seconds < 0 || event.seconds > 604800 ||
        !Number.isFinite(event.endMs) || event.endMs < 0) return { state: out, delta: 0, awards };
    const seconds = number(event.seconds), previous = out.cursors[event.sessionId];
    const delta = Math.max(0, seconds - (previous?.seconds || 0));
    if (!delta && previous) return { state: out, delta, awards };
    const endMs = number(event.endMs, 1e14);
    const startMs = endMs - delta * 1000;
    // Keep the same confirmed window even if its final response arrives much later.
    if (!previous && out.continuous.endMs && startMs - out.continuous.endMs >= 900000)
      out.continuous = { seconds: 0, endMs: 0, rare: false, epic: false };
    out.cursors[event.sessionId] = { seconds, endMs };
    if (Object.keys(out.cursors).length > 128) delete out.cursors[Object.keys(out.cursors)[0]];
    const before = out.totalSeconds;
    out.totalSeconds += delta;
    out.continuous.seconds += delta;
    out.continuous.endMs = Math.max(endMs, out.continuous.endMs);
    for (let i = Math.floor(before / 1500); i < Math.floor(out.totalSeconds / 1500); i++) awards.push(i % 2 ? 'maple' : 'oak');
    if (!out.continuous.rare && out.continuous.seconds >= 3600) {
      out.continuous.rare = true; awards.push(out.rareAwards++ % 2 ? 'bamboo' : 'cherry');
    }
    if (!out.continuous.epic && out.continuous.seconds >= 7200) { out.continuous.epic = true; awards.push('galaxy'); }
    for (const id of awards) out.seeds[id]++;
    if (/^\d{4}-\d{2}-\d{2}$/.test(event.day || '')) out.daily[event.day] = (out.daily[event.day] || 0) + awards.length;
    for (const plot of out.plots) if (plot) {
      const overlap = plot.createdAt ? Math.min(delta, Math.max(0, Math.floor((endMs - plot.createdAt) / 1000))) : delta;
      plot.seconds = Math.min(seedById(plot.seed).minutes * 60, plot.seconds + overlap);
    }
    return { state: out, delta, awards };
  }
  function plant(raw, index, seedId, streak = 0, createdAt = 0) {
    const out = normalize(raw), seed = seedById(seedId);
    if (streak >= 7) out.unlocked = true;
    if (!Number.isInteger(index) || index < 0 || index > 5 || (index === 5 && !out.unlocked) || out.plots[index] || !seed || !out.seeds[seed.id]) throw new Error('Chọn ô trống và một hạt đang có.');
    out.seeds[seed.id]--; out.plots[index] = { seed: seed.id, seconds: 0, createdAt: number(createdAt, 1e14) }; return out;
  }
  function harvest(raw, index, random) {
    const out = normalize(raw), plot = out.plots[index], seed = seedById(plot?.seed);
    if (!Number.isInteger(index) || !seed || plot.seconds < seed.minutes * 60) throw new Error('Cây chưa chín. Học thêm để cây lớn.');
    const guaranteed = out.misses >= 9;
    const weights = rates[seed.tier].map((n, i) => guaranteed && i < 3 ? 0 : n);
    const total = weights.reduce((a, b) => a + b, 0);
    const roll = Number(random());
    if (!Number.isFinite(roll) || roll < 0 || roll >= 1) throw new Error('Không tạo được lượt thu hoạch. Hãy thử lại.');
    let target = roll * total, rank = 0;
    for (; rank < weights.length - 1; rank++) { if (target < weights[rank]) break; target -= weights[rank]; }
    const candidates = items.filter(i => i.tier === tiers[rank].id);
    const pick = Number(random());
    if (!Number.isFinite(pick) || pick < 0 || pick >= 1) throw new Error('Không tạo được vật phẩm. Hãy thử lại.');
    const item = candidates[Math.floor(pick * candidates.length)];
    const isNew = !out.items[item.id]; out.items[item.id]++;
    out.misses = rank >= 3 ? 0 : out.misses + 1;
    out.harvests++; out.plots[index] = null;
    out.lastReward = { item: item.id, seed: seed.id, guaranteed, harvest: out.harvests, isNew };
    return { state: out, reward: out.lastReward };
  }
  function saveLayout(raw, layout) {
    if (!Array.isArray(layout) || layout.length !== 15) throw new Error('Hộp trưng bày có 15 ô.');
    const out = normalize(raw), counts = {};
    for (const id of layout) {
      if (id === null) continue;
      if (!itemById(id)) throw new Error('Vật phẩm không hợp lệ.');
      counts[id] = (counts[id] || 0) + 1;
      if (counts[id] > out.items[id]) throw new Error('Không đủ vật phẩm trong kho.');
    }
    out.layout = layout.slice(); return out;
  }
  function score(layout) { return (layout || []).reduce((sum, id) => sum + (tiers.find(t => t.id === itemById(id)?.tier)?.points || 0), 0); }
  function assetValue(raw) { const state=normalize(raw);return items.reduce((sum,item)=>sum+state.items[item.id]*tiers.find(t=>t.id===item.tier).points,0); }
  function demo(day) {
    const out = empty();
    out.totalSeconds = 7 * 1500 + 1122;
    out.continuous = { seconds: 1122, endMs: 0, rare: false, epic: false };
    out.seeds = { oak: 3, maple: 2, cherry: 1, bamboo: 0, galaxy: 0 };
    out.plots = [{ seed: 'oak', seconds: 3600 }, { seed: 'cherry', seconds: 2040 }, { seed: 'bamboo', seconds: 3240 }, { seed: 'maple', seconds: 1320 }, null, null];
    out.items = { coal: 7, stone: 5, copper: 4, tin: 3, azure: 2, rose: 2, sun: 1, moss: 1, frost: 1, cosmos: 0 };
    out.layout = ['coal', 'copper', 'sun', null, 'azure', 'stone', null, 'frost', 'tin', 'rose', null, null, 'moss', 'coal', 'copper'];
    out.misses = 4; out.rareAwards = 1; if (/^\d{4}-\d{2}-\d{2}$/.test(day)) out.daily[day] = 2;
    return out;
  }
  return Object.freeze({ tiers, seeds, items, rates, seedById, itemById, empty, normalize, credit, plant, harvest, saveLayout, score, assetValue, demo });
});
