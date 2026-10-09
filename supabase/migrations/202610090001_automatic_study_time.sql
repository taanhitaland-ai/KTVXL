-- Automatic study time. Existing Pomodoro credit and private study records remain intact.
begin;
create table public.study_activity_windows (
  user_id uuid primary key references auth.users(id) on delete cascade,
  client_id uuid not null,
  session_id uuid not null default gen_random_uuid(),
  subject text not null check(subject in ('ktvxl','tthcm','vldc','xstk')),
  cursor_at timestamptz not null,
  active_until timestamptz not null,
  last_activity_at timestamptz not null,
  elapsed_seconds numeric not null default 0 check(elapsed_seconds>=0)
);
create table public.study_activity_credit (
  user_id uuid not null references auth.users(id) on delete cascade,
  session_id uuid not null,
  day date not null,
  subject text not null check(subject in ('ktvxl','tthcm','vldc','xstk')),
  seconds numeric not null check(seconds>=0),
  primary key(user_id,session_id,day,subject)
);
create table public.study_activity_clients (
  user_id uuid not null references auth.users(id) on delete cascade,
  client_id uuid not null,
  sequence bigint not null check(sequence>0),
  primary key(user_id,client_id)
);
alter table public.study_activity_windows enable row level security;
alter table public.study_activity_credit enable row level security;
alter table public.study_activity_clients enable row level security;
revoke all on public.study_activity_windows,public.study_activity_credit,public.study_activity_clients from public,anon,authenticated;
grant select on public.study_activity_credit to authenticated;
create policy activity_credit_owner_read on public.study_activity_credit for select to authenticated using((select auth.uid())=user_id);

-- Internal helper: the server measures elapsed time, caps it at the last activity + 15m,
-- splits midnight in Vietnam, and adds only newly earned whole minutes to private history.
create function public.study_activity_settle(p_uid uuid) returns boolean
language plpgsql security definer set search_path='' as $$
declare w public.study_activity_windows; end_at timestamptz; at_time timestamptz; edge timestamptz;
  d date; amount numeric; before_minutes bigint; after_minutes bigint; changed boolean:=false;
begin
  perform pg_advisory_xact_lock(hashtextextended(p_uid::text,0));
  select * into w from public.study_activity_windows where user_id=p_uid for update;
  if not found then return false; end if;
  end_at:=least(clock_timestamp(),w.active_until);
  at_time:=w.cursor_at;
  while at_time<end_at loop
    d:=(at_time at time zone 'Asia/Ho_Chi_Minh')::date;
    edge:=least(end_at,(d+1)::timestamp at time zone 'Asia/Ho_Chi_Minh');
    amount:=extract(epoch from edge-at_time);
    select floor(coalesce(sum(seconds),0)/60)::bigint into before_minutes from public.study_activity_credit where user_id=p_uid and day=d and subject=w.subject;
    insert into public.study_activity_credit(user_id,session_id,day,subject,seconds) values(p_uid,w.session_id,d,w.subject,amount)
      on conflict(user_id,session_id,day,subject) do update set seconds=public.study_activity_credit.seconds+excluded.seconds;
    select floor(sum(seconds)/60)::bigint into after_minutes from public.study_activity_credit where user_id=p_uid and day=d and subject=w.subject;
    if after_minutes>before_minutes then
      insert into public.study_records(user_id,record_key,kind,subject,record_id,value)
        values(p_uid,'study|'||w.subject||'|'||d,'study',w.subject,d::text,to_jsonb(after_minutes-before_minutes))
        on conflict(user_id,record_key) do update set value=to_jsonb(coalesce((public.study_records.value#>>'{}')::numeric,0)+after_minutes-before_minutes),
          version=public.study_records.version+1,updated_at=clock_timestamp();
      changed:=true;
    end if;
    at_time:=edge;
  end loop;
  if end_at>w.cursor_at then
    update public.study_activity_windows set cursor_at=end_at,elapsed_seconds=elapsed_seconds+extract(epoch from end_at-w.cursor_at) where user_id=p_uid;
  end if;
  return changed;
end $$;
revoke all on function public.study_activity_settle(uuid) from public,anon,authenticated;

-- p_idle_seconds is time since an interaction, never a client-supplied study duration.
-- A heartbeat cannot claim another device's window; a fresh interaction can take over.
create function public.study_activity_pulse(p_client uuid,p_subject text,p_idle_seconds integer,p_sequence bigint,p_claim boolean default false,p_stop boolean default false) returns jsonb
language plpgsql security definer set search_path='' as $$
declare uid uuid:=auth.uid(); w public.study_activity_windows; t timestamptz; activity_at timestamptz; changed boolean; expired boolean; last_sequence bigint;
begin
  if uid is null or coalesce((auth.jwt()->>'is_anonymous')::boolean,false) then raise exception 'Authentication required' using errcode='42501'; end if;
  if p_client is null or p_subject is null or p_subject not in ('ktvxl','tthcm','vldc','xstk') or p_idle_seconds is null or p_idle_seconds not between 0 and 900 or p_sequence is null or p_sequence not between 1 and 2147483647 or p_claim is null or p_stop is null then raise exception 'Invalid study activity'; end if;
  if not exists(select 1 from public.study_profiles where user_id=uid and char_length(btrim(nickname))>=2 and lower(btrim(nickname)) not in ('người học','anonymous','anon','guest')) then raise exception 'Choose a username first' using errcode='42501'; end if;
  perform pg_advisory_xact_lock(hashtextextended(uid::text,0));
  changed:=public.study_activity_settle(uid);
  t:=clock_timestamp();
  activity_at:=t-make_interval(secs=>p_idle_seconds);
  select * into w from public.study_activity_windows where user_id=uid;
  expired:=not found or w.active_until<=t;
  select sequence into last_sequence from public.study_activity_clients where user_id=uid and client_id=p_client;
  if p_sequence<=coalesce(last_sequence,0) then
    null; -- Lost/out-of-order responses never reopen a stopped window.
  elsif p_stop then
    if w.client_id=p_client then update public.study_activity_windows set active_until=least(active_until,t) where user_id=uid; end if;
  elsif p_idle_seconds<900 and ((p_claim and (w.client_id is null or w.client_id=p_client or activity_at>w.last_activity_at)) or (w.client_id=p_client and not expired)) then
    if expired or w.client_id is distinct from p_client or w.subject<>p_subject then
      -- An old countdown cannot run alongside the automatic clock.
      update public.focus_sessions set state='cancelled',ended_at=t,resumed_at=null,
        credited_minutes=least(duration_minutes,floor((elapsed_seconds+case when state='running' then greatest(0,extract(epoch from t-resumed_at)) else 0 end)/60)::integer)
        where user_id=uid and state in ('running','paused');
      insert into public.study_activity_windows(user_id,client_id,subject,cursor_at,active_until,last_activity_at) values(uid,p_client,p_subject,t,activity_at+interval '15 minutes',activity_at)
        on conflict(user_id) do update set client_id=excluded.client_id,session_id=gen_random_uuid(),subject=excluded.subject,cursor_at=t,active_until=excluded.active_until,last_activity_at=activity_at,elapsed_seconds=0;
    else
      update public.study_activity_windows set active_until=activity_at+interval '15 minutes',last_activity_at=activity_at where user_id=uid;
    end if;
  end if;
  insert into public.study_activity_clients(user_id,client_id,sequence) values(uid,p_client,p_sequence)
    on conflict(user_id,client_id) do update set sequence=greatest(public.study_activity_clients.sequence,excluded.sequence);
  select * into w from public.study_activity_windows where user_id=uid;
  return jsonb_build_object('owned',coalesce(w.client_id=p_client,false),'active',coalesce(w.active_until>t,false),
    'session_id',w.session_id,'subject',w.subject,'elapsed_seconds',coalesce(w.elapsed_seconds,0),'confirmed_until',w.cursor_at,'credited',changed);
end $$;
revoke all on function public.study_activity_pulse(uuid,text,integer,bigint,boolean,boolean) from public,anon,authenticated;
grant execute on function public.study_activity_pulse(uuid,text,integer,bigint,boolean,boolean) to authenticated;

-- Fetching an account also settles abandoned windows; no browser has to remain open.
create or replace function public.study_snapshot() returns jsonb
language plpgsql security definer set search_path='' as $$
declare uid uuid:=auth.uid(); records jsonb; profile jsonb;
begin
  if uid is null then raise exception 'Authentication required' using errcode='42501'; end if;
  perform public.study_activity_settle(uid);
  insert into public.study_profiles(user_id) values(uid) on conflict do nothing;
  select to_jsonb(p)-'user_id' into profile from public.study_profiles p where p.user_id=uid;
  select coalesce(jsonb_object_agg(r.record_key,jsonb_build_object('kind',r.kind,'subject',r.subject,'id',r.record_id,'value',r.value,'version',r.version)),'{}'::jsonb)
    into records from public.study_records r where r.user_id=uid;
  return jsonb_build_object('records',records,'profile',profile);
end $$;

-- Private view includes the bounded, as-yet-unsettled tail so the board updates live.
create view public.study_rank_daily as
with activity as (
  select user_id,session_id,day,subject,seconds from public.study_activity_credit
  union all
  select w.user_id,w.session_id,d::date,w.subject,extract(epoch from least(w.active_until,clock_timestamp(),(d+interval '1 day') at time zone 'Asia/Ho_Chi_Minh')-greatest(w.cursor_at,d at time zone 'Asia/Ho_Chi_Minh'))
  from public.study_activity_windows w cross join lateral generate_series(
    date_trunc('day',w.cursor_at at time zone 'Asia/Ho_Chi_Minh'),date_trunc('day',least(w.active_until,clock_timestamp()) at time zone 'Asia/Ho_Chi_Minh'),interval '1 day') d
  where w.cursor_at<least(w.active_until,clock_timestamp())
), auto_totals as (
  select user_id,day,subject,floor(sum(seconds)/60)::bigint minutes,count(distinct session_id)::integer sessions
  from activity where seconds>0 group by user_id,day,subject
)
select * from auto_totals where minutes>0
union all
select user_id,(ended_at at time zone 'Asia/Ho_Chi_Minh')::date,subject,sum(credited_minutes)::bigint,count(*)::integer
from public.focus_sessions where state in ('completed','cancelled') and credited_minutes>0 group by user_id,(ended_at at time zone 'Asia/Ho_Chi_Minh')::date,subject;
revoke all on public.study_rank_daily from public,anon,authenticated;

create or replace function public.study_leaderboard(p_period text default 'week',p_subject text default 'all') returns jsonb
language plpgsql security definer set search_path='' as $$
declare today date:=(clock_timestamp() at time zone 'Asia/Ho_Chi_Minh')::date; first_day date; result jsonb;
begin
  if p_period is null or p_period not in ('today','week','month') or p_subject is null or p_subject not in ('all','ktvxl','tthcm','vldc','xstk','gdtc','other') then raise exception 'Invalid leaderboard filter'; end if;
  first_day:=case p_period when 'today' then today when 'week' then date_trunc('week',today)::date else date_trunc('month',today)::date end;
  with totals as (
    select user_id,sum(minutes)::bigint minutes,sum(sessions)::integer sessions from public.study_rank_daily
    where day between first_day and today and (p_subject='all' or subject=p_subject) group by user_id
  ), ranked as (
    select p.user_id,p.nickname,t.minutes,t.sessions,rank() over(order by t.minutes desc)::integer rank from totals t join public.study_profiles p using(user_id) where t.minutes>0
  ) select jsonb_build_object('remote',true,'rows',coalesce((select jsonb_agg(jsonb_build_object('id',r.user_id,'nickname',r.nickname,'icon',upper(left(r.nickname,1)),'minutes',r.minutes,'sessions',r.sessions,'rank',r.rank) order by r.minutes desc,r.user_id) from (select * from ranked order by minutes desc,user_id limit 100) r),'[]'::jsonb),
    'me',(select jsonb_build_object('id',p.user_id,'nickname',p.nickname,'joined',true,'minutes',coalesce(r.minutes,0),'sessions',coalesce(r.sessions,0),'rank',r.rank) from public.study_profiles p left join ranked r using(user_id) where p.user_id=auth.uid())) into result;
  return result;
end $$;

create or replace function public.study_focus_start(p_subject text,p_minutes integer) returns jsonb
language plpgsql security definer set search_path='' as $$
begin raise exception 'The countdown was replaced. Reload the page to use automatic study time.'; end $$;
commit;
