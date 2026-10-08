-- Apply once to the KTVXL Supabase project. No secrets belong in this migration.
begin;

create table public.study_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  nickname text not null default 'Người học' check (char_length(nickname) between 1 and 32),
  leaderboard_opt_in boolean not null default false,
  updated_at timestamptz not null default now()
);

-- One row per question/note/star or personal study day. NULL value is a tombstone.
-- Keeping tombstones prevents a stale device from importing a deleted note again.
create table public.study_records (
  user_id uuid not null references auth.users(id) on delete cascade,
  record_key text not null,
  kind text not null check (kind in ('answer','star','note','study')),
  subject text not null check (subject in ('ktvxl','tthcm','vldc','xstk','gdtc','other')),
  record_id text not null check (record_id ~ '^[A-Za-z0-9_.-]{1,100}$'),
  value jsonb,
  version bigint not null default 1,
  updated_at timestamptz not null default now(),
  primary key(user_id,record_key),
  check (record_key = kind || '|' || subject || '|' || record_id)
);

create table public.study_sync_receipts (
  user_id uuid not null references auth.users(id) on delete cascade,
  operation_id uuid not null,
  request jsonb not null,
  created_at timestamptz not null default now(),
  primary key(user_id,operation_id)
);

-- Minutes eligible for the public board come exclusively from this server ledger.
-- Personal imported/manual study_records never enter it.
create table public.focus_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject text not null check (subject in ('ktvxl','tthcm','vldc','xstk','gdtc','other')),
  duration_minutes integer not null check (duration_minutes between 1 and 180),
  state text not null default 'running' check (state in ('running','paused','completed','cancelled')),
  started_at timestamptz not null default now(),
  resumed_at timestamptz,
  elapsed_seconds numeric not null default 0 check (elapsed_seconds >= 0),
  ended_at timestamptz,
  credited_minutes integer not null default 0,
  check (credited_minutes between 0 and duration_minutes)
);
create unique index focus_one_active_per_user on public.focus_sessions(user_id) where state in ('running','paused');
create index focus_completed_period on public.focus_sessions(ended_at,user_id,subject) where state='completed';

alter table public.study_profiles enable row level security;
alter table public.study_records enable row level security;
alter table public.study_sync_receipts enable row level security;
alter table public.focus_sessions enable row level security;
revoke all on public.study_profiles,public.study_records,public.study_sync_receipts,public.focus_sessions from public,anon,authenticated;
grant select on public.study_profiles,public.study_records,public.focus_sessions to authenticated;
create policy profile_owner_read on public.study_profiles for select to authenticated using ((select auth.uid())=user_id);
create policy record_owner_read on public.study_records for select to authenticated using ((select auth.uid())=user_id);
create policy focus_owner_read on public.focus_sessions for select to authenticated using ((select auth.uid())=user_id);

create function public.study_snapshot() returns jsonb
language plpgsql security definer set search_path='' as $$
declare uid uuid:=auth.uid(); records jsonb; profile jsonb;
begin
  if uid is null then raise exception 'Authentication required' using errcode='42501'; end if;
  insert into public.study_profiles(user_id) values(uid) on conflict do nothing;
  select to_jsonb(p)-'user_id' into profile from public.study_profiles p where p.user_id=uid;
  select coalesce(jsonb_object_agg(r.record_key,jsonb_build_object('kind',r.kind,'subject',r.subject,'id',r.record_id,'value',r.value,'version',r.version)),'{}'::jsonb)
    into records from public.study_records r where r.user_id=uid;
  return jsonb_build_object('records',records,'profile',profile);
end $$;

create function public.study_sync(p_operations jsonb) returns jsonb
language plpgsql security definer set search_path='' as $$
declare
  uid uuid:=auth.uid(); op jsonb; op_id uuid; rkey text; k text; subj text; qid text; val jsonb;
  base bigint; previous public.study_records; receipt jsonb; accepted jsonb:='[]'; conflicts jsonb:='[]'; delta numeric;
begin
  if uid is null then raise exception 'Authentication required' using errcode='42501'; end if;
  if jsonb_typeof(p_operations) is distinct from 'array' or jsonb_array_length(p_operations)>200 or octet_length(p_operations::text)>2000000 then
    raise exception 'Invalid operation batch';
  end if;
  -- Serialize writes from all devices of one account, including imports.
  perform pg_advisory_xact_lock(hashtextextended(uid::text,0));
  for op in select * from jsonb_array_elements(p_operations) loop
    if jsonb_typeof(op) is distinct from 'object' then raise exception 'Invalid operation'; end if;
    op_id:=(op->>'opId')::uuid; k:=op->>'kind';subj:=op->>'subject';qid:=op->>'id';rkey:=op->>'rid';
    base:=(op->>'baseVersion')::bigint;
    if op_id is null or k is null or k not in ('answer','star','note','study') or subj is null or subj not in ('ktvxl','tthcm','vldc','xstk','gdtc','other')
      or (k<>'study' and subj in ('gdtc','other')) or qid is null or qid !~ '^[A-Za-z0-9_.-]{1,100}$'
      or qid in ('__proto__','prototype','constructor') or rkey is distinct from k||'|'||subj||'|'||qid or base is null or base<0 then
      raise exception 'Invalid record identity';
    end if;
    select request into receipt from public.study_sync_receipts where user_id=uid and operation_id=op_id;
    if found then
      if receipt is distinct from op then raise exception 'An acknowledged operation cannot be changed'; end if;
      accepted:=accepted||jsonb_build_array(op->>'opId');continue;
    end if;
    select * into previous from public.study_records where user_id=uid and record_key=rkey for update;
    val:=nullif(op->'value','null'::jsonb);
    if k='note' and val is not null then
      if jsonb_typeof(val) is distinct from 'object' or jsonb_typeof(val->'text') is distinct from 'string'
        or char_length(val->>'text') not between 1 and 2000 or btrim(val->>'text')=''
        or (val->>'color') is null or val->>'color' not in ('yellow','orange','pink','green','blue','purple') then raise exception 'Invalid note'; end if;
      val:=jsonb_build_object('subject',subj,'questionId',qid,'text',normalize(val->>'text',NFC),'color',val->>'color',
        'updatedAt',floor(extract(epoch from clock_timestamp())*1000)::bigint);
    elsif k='answer' and val is not null then
      if jsonb_typeof(val) is distinct from 'object' or jsonb_typeof(val->'isCorrect') is distinct from 'boolean'
        or (val ? 'answer' and jsonb_typeof(val->'answer') not in ('number','string'))
        or char_length(coalesce(val->>'answer',''))>100 or char_length(coalesce(val->>'inputVal',''))>2000 then raise exception 'Invalid answer'; end if;
      val:=jsonb_build_object('isCorrect',val->'isCorrect')||case when val ? 'answer' then jsonb_build_object('answer',val->'answer') else '{}'::jsonb end
        ||case when val ? 'inputVal' then jsonb_build_object('inputVal',normalize(val->>'inputVal',NFC)) else '{}'::jsonb end;
    elsif k='star' and val is not null and val<>'true'::jsonb then raise exception 'Invalid star';
    elsif k='study' then
      if qid !~ '^\d{4}-\d{2}-\d{2}$' or qid::date<'2000-01-01'::date or qid::date>(clock_timestamp() at time zone 'Asia/Ho_Chi_Minh')::date+1
        or jsonb_typeof(op->'delta') is distinct from 'number' then raise exception 'Invalid study day'; end if;
      delta:=(op->>'delta')::numeric;
      if abs(delta)>100000 then raise exception 'Invalid study increment'; end if;
      val:=to_jsonb(greatest(0,least(100000,coalesce((previous.value#>>'{}')::numeric,0)+delta)));
    end if;
    -- Content equality ignores the client timestamp. Notes use optimistic concurrency.
    if k='note' and coalesce(previous.version,0)<>base and
      (coalesce(previous.value-'updatedAt','null'::jsonb) is distinct from coalesce(val-'updatedAt','null'::jsonb)) then
      conflicts:=conflicts||jsonb_build_array(jsonb_build_object('op',op,'remote',case when previous.record_key is null then null else
        jsonb_build_object('kind',k,'subject',subj,'id',qid,'value',previous.value,'version',previous.version) end));continue;
    end if;
    if previous.record_key is null and (select count(*) from public.study_records where user_id=uid)>=25000 then raise exception 'Record limit reached'; end if;
    insert into public.study_records(user_id,record_key,kind,subject,record_id,value,version)
      values(uid,rkey,k,subj,qid,val,coalesce(previous.version,0)+1)
      on conflict(user_id,record_key) do update set value=excluded.value,version=excluded.version,updated_at=clock_timestamp();
    insert into public.study_sync_receipts(user_id,operation_id,request) values(uid,op_id,op);
    accepted:=accepted||jsonb_build_array(op->>'opId');
  end loop;
  return public.study_snapshot()||jsonb_build_object('accepted',accepted,'conflicts',conflicts);
end $$;

create function public.study_set_profile(p_nickname text,p_joined boolean) returns jsonb
language plpgsql security definer set search_path='' as $$
declare uid uuid:=auth.uid(); name text:=normalize(btrim(p_nickname),NFC); result jsonb;
begin
  if uid is null then raise exception 'Authentication required' using errcode='42501'; end if;
  if name is null or char_length(name) not between 1 and 32 or name ~ '[[:cntrl:]]' or p_joined is null then raise exception 'Invalid profile'; end if;
  insert into public.study_profiles(user_id,nickname,leaderboard_opt_in) values(uid,name,p_joined)
    on conflict(user_id) do update set nickname=excluded.nickname,leaderboard_opt_in=excluded.leaderboard_opt_in,updated_at=clock_timestamp();
  select to_jsonb(p)-'user_id' into result from public.study_profiles p where user_id=uid;return result;
end $$;

create function public.study_focus_start(p_subject text,p_minutes integer) returns jsonb
language plpgsql security definer set search_path='' as $$
declare uid uuid:=auth.uid(); session public.focus_sessions;
begin
  if uid is null then raise exception 'Authentication required' using errcode='42501'; end if;
  if p_subject is null or p_subject not in ('ktvxl','tthcm','vldc','xstk','gdtc','other') or p_minutes is null or p_minutes not between 1 and 180 then raise exception 'Invalid focus session'; end if;
  perform pg_advisory_xact_lock(hashtextextended(uid::text,0));
  -- Expired abandoned sessions stop blocking a future session; they receive no credit.
  update public.focus_sessions set state='cancelled',ended_at=clock_timestamp() where user_id=uid and state in ('running','paused') and started_at<clock_timestamp()-interval '24 hours';
  if exists(select 1 from public.focus_sessions where user_id=uid and state in ('running','paused')) then raise exception 'A focus session is already active'; end if;
  insert into public.focus_sessions(user_id,subject,duration_minutes,resumed_at) values(uid,p_subject,p_minutes,clock_timestamp()) returning * into session;
  return to_jsonb(session)-'user_id';
end $$;

create function public.study_focus_action(p_id uuid,p_action text) returns jsonb
language plpgsql security definer set search_path='' as $$
declare uid uuid:=auth.uid(); session public.focus_sessions; elapsed numeric;
begin
  if uid is null then raise exception 'Authentication required' using errcode='42501'; end if;
  if p_action is null or p_action not in ('pause','resume','cancel','finish') then raise exception 'Invalid action'; end if;
  select * into session from public.focus_sessions where id=p_id and user_id=uid for update;
  if not found then raise exception 'Session not found' using errcode='42501'; end if;
  if session.state in ('completed','cancelled') then return to_jsonb(session)-'user_id'; end if;
  elapsed:=session.elapsed_seconds+case when session.state='running' then greatest(0,extract(epoch from clock_timestamp()-session.resumed_at)) else 0 end;
  if p_action='finish' then
    if elapsed<session.duration_minutes*60 then raise exception 'Focus time has not elapsed'; end if;
    update public.focus_sessions set state='completed',elapsed_seconds=elapsed,ended_at=clock_timestamp(),credited_minutes=duration_minutes,resumed_at=null where id=p_id returning * into session;
  elsif p_action='cancel' then
    update public.focus_sessions set state='cancelled',elapsed_seconds=elapsed,ended_at=clock_timestamp(),resumed_at=null where id=p_id returning * into session;
  elsif p_action='pause' and session.state='running' then
    update public.focus_sessions set state='paused',elapsed_seconds=elapsed,resumed_at=null where id=p_id returning * into session;
  elsif p_action='resume' and session.state='paused' then
    update public.focus_sessions set state='running',resumed_at=clock_timestamp() where id=p_id returning * into session;
  end if;
  return to_jsonb(session)-'user_id';
end $$;

create function public.study_leaderboard(p_period text default 'week',p_subject text default 'all') returns jsonb
language plpgsql security definer set search_path='' as $$
declare today date:=(clock_timestamp() at time zone 'Asia/Ho_Chi_Minh')::date; first_day date; ranking jsonb; mine jsonb;
begin
  if p_period is null or p_period not in ('today','week','month') or p_subject is null or p_subject not in ('all','ktvxl','tthcm','vldc','xstk','gdtc','other') then raise exception 'Invalid leaderboard filter'; end if;
  first_day:=case p_period when 'today' then today when 'week' then date_trunc('week',today)::date else date_trunc('month',today)::date end;
  with totals as (
    select s.user_id,sum(s.credited_minutes)::bigint minutes,count(*)::integer sessions from public.focus_sessions s
    where s.state='completed' and s.ended_at>=first_day::timestamp at time zone 'Asia/Ho_Chi_Minh'
      and s.ended_at<(today+1)::timestamp at time zone 'Asia/Ho_Chi_Minh' and (p_subject='all' or s.subject=p_subject) group by s.user_id
  ), ranked as (
    select p.user_id,p.nickname,t.minutes,t.sessions,rank() over(order by t.minutes desc)::integer rank
    from totals t join public.study_profiles p on p.user_id=t.user_id where p.leaderboard_opt_in and t.minutes>0
  ) select coalesce(jsonb_agg(jsonb_build_object('id',r.user_id,'nickname',r.nickname,'icon',upper(left(r.nickname,1)),
    'minutes',r.minutes,'sessions',r.sessions,'rank',r.rank) order by r.minutes desc,r.user_id),'[]'::jsonb)
    into ranking from (select * from ranked order by minutes desc,user_id limit 100) r;
  select jsonb_build_object('id',p.user_id,'nickname',p.nickname,'joined',p.leaderboard_opt_in,
    'minutes',coalesce(sum(s.credited_minutes),0),'sessions',count(s.id),'rank',null) into mine
    from public.study_profiles p left join public.focus_sessions s on s.user_id=p.user_id and s.state='completed'
      and s.ended_at>=first_day::timestamp at time zone 'Asia/Ho_Chi_Minh' and s.ended_at<(today+1)::timestamp at time zone 'Asia/Ho_Chi_Minh'
      and (p_subject='all' or s.subject=p_subject) where p.user_id=auth.uid() group by p.user_id;
  if mine is not null and (mine->>'joined')::boolean and (mine->>'minutes')::bigint>0 then
    mine:=mine||jsonb_build_object('rank',1+(select count(*) from (
      select s.user_id from public.focus_sessions s join public.study_profiles p on p.user_id=s.user_id
      where p.leaderboard_opt_in and s.state='completed' and s.ended_at>=first_day::timestamp at time zone 'Asia/Ho_Chi_Minh'
        and s.ended_at<(today+1)::timestamp at time zone 'Asia/Ho_Chi_Minh' and (p_subject='all' or s.subject=p_subject)
      group by s.user_id having sum(s.credited_minutes)>(mine->>'minutes')::bigint) better));
  end if;
  return jsonb_build_object('rows',ranking,'me',mine,'remote',true);
end $$;

revoke all on function public.study_snapshot(),public.study_sync(jsonb),public.study_set_profile(text,boolean),public.study_focus_start(text,integer),public.study_focus_action(uuid,text),public.study_leaderboard(text,text) from public,anon,authenticated;
grant execute on function public.study_snapshot(),public.study_sync(jsonb),public.study_set_profile(text,boolean),public.study_focus_start(text,integer),public.study_focus_action(uuid,text) to authenticated;
grant execute on function public.study_leaderboard(text,text) to anon,authenticated;
commit;
