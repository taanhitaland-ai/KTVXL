const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {PGlite}=require('@electric-sql/pglite'),M=require('../web/study_garden_model.js');
test('account gardens: server study rewards, ownership, public projection, asset totals, harvest and layout concurrency',async t=>{
  const db=new PGlite();t.after(()=>db.close());
  const a='11111111-1111-4111-8111-111111111111',b='22222222-2222-4222-8222-222222222222',client='33333333-3333-4333-8333-333333333333';
  await db.exec(`create role anon;create role authenticated;create schema auth;create table auth.users(id uuid primary key);
    create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
    create function auth.jwt() returns jsonb language sql stable as $$select coalesce(nullif(current_setting('request.jwt.claims',true),''),'{}')::jsonb$$;
    grant usage on schema auth to anon,authenticated;insert into auth.users values('${a}'),('${b}');`);
  for(const name of ['202610080001_study_sync.sql','202610080002_focus_reliability.sql','202610090001_automatic_study_time.sql'])await db.exec(fs.readFileSync(path.join(__dirname,'../supabase/migrations',name),'utf8'));
  const login=async id=>{await db.exec('reset role;set role authenticated');await db.query("select set_config('request.jwt.claim.sub',$1,false)",[id]);};
  const rpc=async(name,args=[]) => (await db.query('select public.'+name+'('+args.map((_,i)=>'$'+(i+1)).join(',')+') data',args.map(x=>x&&typeof x==='object'?JSON.stringify(x):x))).rows[0].data;
  const admin=async fn=>{await db.exec('reset role');await fn();await login(a);};
  await login(a);await rpc('study_set_profile',['Test A',true]);
  // Warm the old clock's cached helper plan before upgrading an existing project.
  await rpc('study_activity_pulse',[client,'ktvxl',0,1,true,false]);
  await admin(()=>db.exec(fs.readFileSync(path.join(__dirname,'../supabase/migrations/202610100001_study_garden.sql'),'utf8')));
  let garden=await rpc('study_garden_snapshot');assert.equal(garden.asset_value,0);assert.equal(garden.state.totalSeconds,0);
  await login(b);await rpc('study_set_profile',['Test B',true]);await rpc('study_garden_snapshot');await login(a);
  await assert.rejects(()=>rpc('study_garden_payload',[b]));await assert.rejects(()=>db.query('update public.study_gardens set state=$1 where user_id=$2',[JSON.stringify(M.demo('2026-10-10')),a]));
  await assert.rejects(()=>rpc('study_garden_credit_window',[a]));
  assert.equal((await db.query('select * from public.study_gardens where user_id=$1',[b])).rows.length,0);
  let seq=2;
  for(const subject of ['ktvxl','tthcm','vldc','xstk']){
    await rpc('study_activity_pulse',[client,subject,0,seq++,true,false]);
    await admin(()=>db.query("update public.study_activity_windows set cursor_at=clock_timestamp()-interval '1800 seconds',active_until=clock_timestamp()+interval '15 minutes' where user_id=$1",[a]));
    await rpc('study_activity_pulse',[client,subject,0,seq++,true,false]);
  }
  await rpc('study_activity_pulse',[client,'xstk',0,seq++,false,true]);
  garden=await rpc('study_garden_snapshot');assert(garden.state.totalSeconds>=7200);assert.equal(garden.state.seeds.oak+garden.state.seeds.maple,4);assert.equal(garden.state.seeds.cherry+garden.state.seeds.bamboo,1);assert.equal(garden.state.seeds.galaxy,1);
  const earned=garden.state.totalSeconds;assert.equal((await rpc('study_garden_snapshot')).state.totalSeconds,earned,'snapshot double credited');
  garden=await rpc('study_garden_plant',[0,'oak']);assert.equal(garden.state.plots[0].seconds,0);const stamp=garden.state.plots[0].createdAt;
  await assert.rejects(()=>rpc('study_garden_plant',[0,'oak']));await assert.rejects(()=>rpc('study_garden_plant',[5,'oak']));await assert.rejects(()=>rpc('study_garden_plant',[1,'<script>']));await assert.rejects(()=>rpc('study_garden_harvest',[0,stamp]));
  await admin(()=>db.query("update public.study_gardens set state=jsonb_set(jsonb_set(state,'{plots,0,seconds}','3600'),'{misses}','9') where user_id=$1",[a]));
  const harvest=await rpc('study_garden_harvest',[0,stamp]);assert.equal(harvest.reward.guaranteed,true);assert(['epic','legendary'].includes(M.itemById(harvest.reward.item).tier));assert.equal(harvest.state.plots[0],null);assert.equal(harvest.state.misses,0);
  await assert.rejects(()=>rpc('study_garden_harvest',[0,stamp]));assert.equal((await rpc('study_garden_snapshot')).state.harvests,1);
  const layout=Array(15).fill(null);layout[0]=harvest.reward.item;
  garden=await rpc('study_garden_layout',[layout,harvest.state.layout]);assert.equal(garden.asset_value,M.assetValue(garden.state));assert.equal(garden.display_value,M.score(layout));
  const old=Array(15).fill(null);await assert.rejects(()=>rpc('study_garden_layout',[old,old]),/thiết bị khác/);
  await assert.rejects(()=>rpc('study_garden_layout',[Array(15).fill(harvest.reward.item),layout]));await assert.rejects(()=>rpc('study_garden_layout',[Array(15).fill('<img>'),layout]));
  await admin(()=>db.query("insert into public.study_records(user_id,record_key,kind,subject,record_id,value) select $1,'study|ktvxl|'||d::date,'study','ktvxl',d::date::text,'25'::jsonb from generate_series(((clock_timestamp() at time zone 'Asia/Ho_Chi_Minh')::date-7)::timestamp,((clock_timestamp() at time zone 'Asia/Ho_Chi_Minh')::date-1)::timestamp,interval '1 day') d on conflict do nothing",[a]));
  assert.equal((await rpc('study_garden_snapshot')).state.unlocked,true,'seven-day streak did not unlock garden');
  await login(b);const projection=await rpc('study_garden_public',[a]);assert.deepEqual(Object.keys(projection).sort(),['asset_value','id','items','layout','nickname']);assert.equal(projection.asset_value,garden.asset_value);assert.equal((await rpc('study_garden_snapshot')).asset_value,0,'another account received inventory');
  await db.exec('reset role;set role anon');await db.query("select set_config('request.jwt.claim.sub','',false)");assert.equal((await rpc('study_garden_public',[a])).asset_value,garden.asset_value);await assert.rejects(()=>rpc('study_garden_snapshot'));await assert.rejects(()=>rpc('study_garden_layout',[layout,layout]));
  await login(a);const board=await rpc('study_leaderboard',['today','all']);assert.equal(board.me.asset_value,garden.asset_value);assert.equal(board.rows[0].asset_value,garden.asset_value);assert.equal(board.rows[0].minutes,120);
  await db.query("select set_config('request.jwt.claims','{\"is_anonymous\":true}',false)");await assert.rejects(()=>rpc('study_garden_snapshot'));
});
