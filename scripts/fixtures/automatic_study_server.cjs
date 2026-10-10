// Loopback-only test backend: runs real migrations on an ephemeral database.
const {PGlite}=require('@electric-sql/pglite');
const fs=require('node:fs'), path=require('node:path'), http=require('node:http');
const uid='11111111-1111-4111-8111-111111111111';
const port=Number(process.env.KMA_STUDY_FIXTURE_PORT || 8768);
const garden=process.env.KMA_GARDEN_FIXTURE==='1';
const M=require('../../web/study_garden_model.js');
if(!Number.isInteger(port)||port<1024||port>65535)throw new Error('Invalid loopback fixture port');
const db=new PGlite();
const names={study_snapshot:[],study_sync:['p_operations'],study_set_profile:['p_nickname','p_joined'],study_focus_current:[],study_leaderboard:['p_period','p_subject'],study_activity_pulse:['p_client','p_subject','p_idle_seconds','p_sequence','p_claim','p_stop']};
if(garden)Object.assign(names,{study_garden_snapshot:[],study_garden_plant:['p_plot','p_seed'],study_garden_harvest:['p_plot','p_created_at'],study_garden_layout:['p_layout','p_previous'],study_garden_public:['p_user']});
let queue=Promise.resolve();
async function reset(){
  await db.exec('reset role;drop schema if exists public cascade;create schema public;grant usage on schema public to anon,authenticated;');
  for(const name of ['202610080001_study_sync.sql','202610080002_focus_reliability.sql','202610090001_automatic_study_time.sql']) await db.exec(fs.readFileSync(path.join(__dirname,'../../supabase/migrations',name),'utf8'));
  if(garden)await db.exec(fs.readFileSync(path.join(__dirname,'../../supabase/migrations/202610100001_study_garden.sql'),'utf8'));
  await db.exec('set role authenticated');await db.query("select set_config('request.jwt.claim.sub',$1,false)",[uid]);
  await db.query("select public.study_set_profile('Bạn thử',true)");
  if(garden){
    await db.exec('reset role');
    const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Ho_Chi_Minh',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
    for(const [id,name,minutes] of [[uid,'Bạn thử',87],['22222222-2222-4222-8222-222222222222','Linh chăm học',75],['33333333-3333-4333-8333-333333333333','Khoai ôn bài',55]]){
      await db.query('insert into auth.users values($1) on conflict do nothing',[id]);
      await db.query("insert into public.study_profiles(user_id,nickname,leaderboard_opt_in) values($1,$2,true) on conflict(user_id) do update set nickname=excluded.nickname",[id,name]);
      const sample=M.demo(today);if(id!==uid){sample.items.cosmos=id.startsWith('2')?2:1;sample.layout[3]='cosmos';}
      await db.query('insert into public.study_gardens(user_id,state) values($1,$2)',[id,JSON.stringify(sample)]);
      await db.query("insert into public.focus_sessions(user_id,subject,duration_minutes,state,elapsed_seconds,credited_minutes,started_at,ended_at) values($1,'ktvxl',$2,'completed',$2*60,$2,clock_timestamp()-make_interval(mins=>$2),clock_timestamp())",[id,minutes]);
    }
  }
}
(async()=>{
  await db.exec(`create role anon;create role authenticated;create schema auth;create table auth.users(id uuid primary key);
    create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
    create function auth.jwt() returns jsonb language sql stable as $$select '{}'::jsonb$$;
    grant usage on schema auth to anon,authenticated;insert into auth.users values('${uid}');`);
  await reset();
  const server=http.createServer((req,res)=>{
    res.setHeader('Access-Control-Allow-Origin','http://127.0.0.1:8767');res.setHeader('Access-Control-Allow-Headers','Content-Type');
    if(req.method==='OPTIONS'){res.writeHead(204);res.end();return;}
    if(req.method!=='POST'){res.writeHead(405);res.end();return;}
    let body='';req.on('data',chunk=>{body+=chunk;if(body.length>2000000)req.destroy();});
    req.on('end',()=>{
      const next=queue.catch(()=>{}).then(async()=>{
        const input=JSON.parse(body),args=input.args||{};
        if(req.url==='/reset'){await reset();return {data:true};}
        if(req.url==='/shift'){
          const seconds=Number(input.seconds);if(!Number.isFinite(seconds)||seconds<0||seconds>86400)throw new Error('Invalid fixture shift');
          await db.exec('reset role');await db.query("update public.study_activity_windows set cursor_at=cursor_at-make_interval(secs=>$1),active_until=active_until-make_interval(secs=>$1)",[seconds]);return {data:true};
        }
        if(garden&&input.name==='garden_demo'){
          if(input.guest)throw new Error('Authentication required');
          await db.exec('reset role');
          let current=(await db.query('select state from public.study_gardens where user_id=$1',[uid])).rows[0].state;
          if(args.action==='reset')current=M.demo(new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Ho_Chi_Minh',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date()));
          else if(args.action==='unlock')current.unlocked=true;
          else if(args.action==='credit'&&[25,60,120].includes(args.minutes)){
            const end=Math.max(Date.now(),current.continuous.endMs)+args.minutes*60000;
            current=M.credit(current,{sessionId:crypto.randomUUID(),subject:'ktvxl',seconds:args.minutes*60,endMs:end,day:new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Ho_Chi_Minh',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())}).state;current.continuous.endMs=Date.now();
          }else throw new Error('Invalid demo action');
          await db.query('update public.study_gardens set state=$2,revision=revision+1 where user_id=$1',[uid,JSON.stringify(current)]);
          return {data:(await db.query('select public.study_garden_payload($1) data',[uid])).rows[0].data};
        }
        const name=input.name;if(!names[name])throw new Error('Unknown fixture RPC');
        await db.exec('reset role;set role '+(input.guest?'anon':'authenticated'));
        await db.query("select set_config('request.jwt.claim.sub',$1,false)",[input.guest?'':uid]);
        const values=names[name].map(k=>typeof args[k]==='object'?JSON.stringify(args[k]):args[k]);
        return {data:(await db.query('select public.'+name+'('+values.map((_,i)=>'$'+(i+1)).join(',')+') data',values)).rows[0].data};
      });queue=next;
      next.then(data=>{res.setHeader('Content-Type','application/json');res.end(JSON.stringify(data));},error=>{res.setHeader('Content-Type','application/json');res.end(JSON.stringify({error:{message:error.message}}));});
    });
  });
  server.listen(port,'127.0.0.1',()=>console.log('Isolated automatic study fixture ready on 127.0.0.1:'+port));
})().catch(e=>{console.error(e);process.exitCode=1;});
