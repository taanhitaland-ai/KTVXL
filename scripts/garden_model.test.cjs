const {test}=require('node:test'),assert=require('node:assert/strict'),M=require('../web/study_garden_model.js');
const id=n=>`00000000-0000-4000-8000-${String(n).padStart(12,'0')}`;
const event=(session,seconds,endMs,subject='ktvxl')=>({sessionId:id(session),seconds,endMs,subject,day:'2026-10-10'});
test('garden credits all four subjects once, adds regular/bonus seeds, idle resets bonuses',()=>{
  let s=M.empty();const t=1800000000000;
  for(let i=0;i<4;i++)s=M.credit(s,event(i+1,1800,t+(i+1)*1800000,['ktvxl','tthcm','vldc','xstk'][i])).state;
  assert.equal(s.totalSeconds,7200);assert.equal(s.seeds.oak+s.seeds.maple,4);assert.equal(s.seeds.cherry+s.seeds.bamboo,1);assert.equal(s.seeds.galaxy,1);
  assert.deepEqual(M.credit(s,event(4,720,t+7200000)).state,s,'old/out-of-order observation mutated state');
  assert.equal(M.credit(s,event(4,1800,t+7200000)).delta,0,'duplicate earned credit');
  const next=M.credit(s,event(5,3600,t+7200000+900000+3600000));s=next.state;
  assert.equal(s.continuous.seconds,3600);assert.equal(s.seeds.cherry+s.seeds.bamboo,2);assert.equal(s.seeds.galaxy,1);
  assert.equal(M.credit(s,event(6,7200,t,'other')).delta,0);
  assert.equal(M.credit(s,{...event(7,900,t),sessionId:'__proto__'}).delta,0);
  assert.equal(M.credit(s,event(7,1e12,t)).delta,0,'unbounded malformed window was processed');
});
test('plant spends a seed, all planted trees grow only by confirmed seconds, mature harvest consumes one tree',()=>{
  let s=M.empty();s.seeds.oak=2;s.seeds.cherry=1;
  s=M.plant(s,0,'oak');s=M.plant(s,1,'cherry');
  assert.equal(s.seeds.oak,1);assert.equal(s.plots[0].seconds,0);
  assert.throws(()=>M.harvest(s,0,()=>0));assert.throws(()=>M.plant(s,0,'oak'));assert.throws(()=>M.plant(s,5,'oak',6));
  s=M.credit(s,event(1,3600,1800003600000)).state;
  assert.equal(s.plots[0].seconds,3600);assert.equal(s.plots[1].seconds,3600);
  const reward=M.harvest(s,0,()=>0);s=reward.state;
  assert.equal(s.plots[0],null);assert.equal(s.items.coal,1);assert.throws(()=>M.harvest(s,0,()=>0));
  s=M.plant(s,5,'oak',7);assert.equal(s.unlocked,true);assert.equal(s.plots[5].seed,'oak');
  const late=M.empty();late.seeds.oak=1;
  const planted=M.plant(late,0,'oak',0,1800000020000);
  const confirmed=M.credit(planted,event(2,30,1800000030000)).state;
  assert.equal(confirmed.plots[0].seconds,10,'time before planting grew new tree');
});
test('drop tables sum to 100, pity guarantees on tenth miss and resets after epic/legendary',()=>{
  for(const rate of Object.values(M.rates))assert.equal(rate.reduce((a,b)=>a+b,0),100);
  for(const seed of M.seeds){
    let s=M.empty();
    for(let i=0;i<10;i++){
      s.plots[0]={seed:seed.id,seconds:seed.minutes*60};
      const result=M.harvest(s,0,()=>0);s=result.state;
      assert.equal(result.reward.guaranteed,i===9);
      assert.equal(M.itemById(result.reward.item).tier,i===9?'epic':'scrap');
    }
    assert.equal(s.misses,0);
    s.plots[0]={seed:seed.id,seconds:seed.minutes*60};
    s=M.harvest(s,0,()=>.999999).state;assert.equal(s.misses,0);assert.equal(s.items.cosmos,1);
  }
});
test('collection validates slots/counts, malicious data is discarded, preview has 9/10 types',()=>{
  let s=M.demo('2026-10-10');assert.equal(M.items.filter(i=>s.items[i.id]).length,9);
  assert.equal(M.assetValue(s),1410);assert.equal(M.assetValue({...s,layout:Array(15).fill(null)}),1410,'unplaced assets disappeared from total value');
  assert.ok(M.score(s.layout)>0);
  const invalid=Array(15).fill('frost');assert.throws(()=>M.saveLayout(s,invalid));
  assert.throws(()=>M.saveLayout(s,Array(15).fill('<script>')));assert.throws(()=>M.saveLayout(s,[]));
  const normalized=M.normalize({...s,seeds:{oak:-5,galaxy:Infinity},plots:[{seed:'<img>',seconds:Infinity}],items:{coal:1},layout:Array(15).fill('coal'),cursors:{constructor:{seconds:9999}}});
  assert.equal(normalized.seeds.oak,0);assert.equal(normalized.seeds.galaxy,0);assert.equal(normalized.plots[0],null);
  assert.equal(normalized.layout.filter(Boolean).length,1);assert.equal(Object.keys(normalized.cursors).length,0);
  assert.throws(()=>M.harvest(s,0,()=>NaN));assert.equal(s.plots[0].seed,'oak','failed draw mutated original');
});

test('garden initialization isolates production from local and unrelated hosts',()=>{
  const vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
  const code=fs.readFileSync(path.join(__dirname,'../web/study_garden.js'),'utf8');
  function enabled(host,protocol,pathname,config,preview=false){
    let initialized=false;
    vm.runInNewContext(code,{window:{KMA_CLOUD_CONFIG:config,KMA_GARDEN_PREVIEW:preview,KMA_GARDEN_MODEL:{}},location:{hostname:host,protocol,pathname},document:{readyState:'loading',addEventListener:()=>{initialized=true;}}});
    return initialized;
  }
  const production={url:'https://htcnflcncbihhlqoeqsy.supabase.co',gardenEnabled:true};
  assert.equal(enabled('taanhitaland-ai.github.io','https:','/KTVXL/',production),true);
  for(const host of ['localhost','127.0.0.1','evil.example'])assert.equal(enabled(host,'https:','/KTVXL/',production),false);
  assert.equal(enabled('taanhitaland-ai.github.io','http:','/KTVXL/',production),false);
  assert.equal(enabled('taanhitaland-ai.github.io','https:','/other/',production),false);
  assert.equal(enabled('127.0.0.1','http:','/demo.html',{url:'https://fixture.invalid'},true),true);
  assert.equal(enabled('taanhitaland-ai.github.io','https:','/KTVXL/',{url:'https://fixture.invalid'},true),false);
});

test('glowing tree planting rate, glowing drop tables, glowing item drop chance, and 2.5x point multipliers',()=>{
  for(const rate of Object.values(M.glowingRates))assert.equal(rate.reduce((a,b)=>a+b,0),100);
  let s=M.empty();s.seeds.oak=10;
  // Planting with roll < 0.20 produces glowing tree
  s=M.plant(s,0,'oak',0,0,()=>0.15);
  assert.equal(s.plots[0].glowing,true);
  // Planting with roll >= 0.20 produces normal tree
  s=M.plant(s,1,'oak',0,0,()=>0.50);
  assert.equal(s.plots[1].glowing,false);
  // Default without roll is normal
  s=M.plant(s,2,'oak',0,0);
  assert.equal(s.plots[2].glowing,false);

  // Mature plot 0 (glowing tree)
  s.plots[0].seconds=3600;
  // Harvest glowing tree with glowRoll < 0.50 yields glowing item
  // RNG sequence: 1) tier roll = 0.999 (legendary in glowing rates), 2) candidate pick = 0 (frost), 3) glowRoll = 0.25 (<0.50 -> glowing)
  const seq=[0.999, 0, 0.25]; let idx=0;
  const harvestGlowing=M.harvest(s,0,()=>seq[idx++]);
  assert.equal(harvestGlowing.reward.glowing,true);
  assert.equal(harvestGlowing.reward.treeGlowing,true);
  assert.equal(harvestGlowing.reward.item,'frost_glowing');
  assert.equal(harvestGlowing.state.items.frost_glowing,1);

  // Mature plot 1 (normal tree) - cannot yield glowing item even if random is 0
  s.plots[1].seconds=3600;
  const harvestNormal=M.harvest(s,1,()=>0);
  assert.equal(harvestNormal.reward.glowing,false);
  assert.equal(harvestNormal.reward.treeGlowing,false);
  assert.equal(harvestNormal.reward.item,'coal');

  // Verify itemById and 2.5x point multipliers
  const baseAzure=M.itemById('azure');
  const glowAzure=M.itemById('azure_glowing');
  assert.equal(baseAzure.points,80);
  assert.equal(glowAzure.points,200);
  assert.equal(glowAzure.glowing,true);
  assert.ok(glowAzure.name.includes('✨'));

  assert.equal(M.itemById('coal_glowing').points,25);
  assert.equal(M.itemById('copper_glowing').points,75);
  assert.equal(M.itemById('sun_glowing').points,450);
  assert.equal(M.itemById('frost_glowing').points,1000);

  // Verify showcase score and total asset value
  const testLayout=Array(15).fill(null);
  testLayout[0]='frost_glowing';
  testLayout[1]='azure';
  assert.equal(M.score(testLayout),1000+80);

  const customState={v:1,items:{frost_glowing:1,azure:2,coal_glowing:3}};
  assert.equal(M.assetValue(customState),1000*1 + 80*2 + 25*3);
});
