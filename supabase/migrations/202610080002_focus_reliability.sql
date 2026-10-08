-- Apply after 202610080001. No private answer/note data is published.
begin;
alter table public.study_profiles alter column leaderboard_opt_in set default true;
update public.study_profiles set leaderboard_opt_in=true where not leaderboard_opt_in;
alter table public.focus_sessions drop constraint if exists focus_sessions_duration_minutes_check;
alter table public.focus_sessions add constraint focus_sessions_duration_minutes_check check (duration_minutes between 1 and 300);
-- Recover only whole minutes that the server actually measured in old cancelled sessions.
update public.focus_sessions set credited_minutes=least(duration_minutes,greatest(0,floor(elapsed_seconds/60)::integer))
where state='cancelled' and credited_minutes=0 and elapsed_seconds>=60;
create index if not exists focus_credited_period on public.focus_sessions(ended_at,user_id,subject)
where state in ('completed','cancelled') and credited_minutes>0;

create or replace function public.study_focus_payload(s public.focus_sessions) returns jsonb
language sql stable set search_path='' as $$
  select (to_jsonb(s)-'user_id') || jsonb_build_object('server_elapsed',least(s.duration_minutes*60,
    s.elapsed_seconds+case when s.state='running' then greatest(0,extract(epoch from clock_timestamp()-s.resumed_at)) else 0 end));
$$;
revoke all on function public.study_focus_payload(public.focus_sessions) from public,anon,authenticated;

create or replace function public.study_focus_current() returns jsonb
language plpgsql security definer set search_path='' as $$
declare uid uuid:=auth.uid(); s public.focus_sessions;
begin
  if uid is null then raise exception 'Authentication required' using errcode='42501'; end if;
  select * into s from public.focus_sessions where user_id=uid and state in ('running','paused');
  if not found then return null; end if;
  return public.study_focus_payload(s);
end $$;
revoke all on function public.study_focus_current() from public,anon,authenticated;
grant execute on function public.study_focus_current() to authenticated;
create or replace function public.study_set_profile(p_nickname text,p_joined boolean) returns jsonb
language plpgsql security definer set search_path='' as $$
declare uid uuid:=auth.uid(); name text:=normalize(btrim(p_nickname),NFC); result jsonb;
begin
  if uid is null then raise exception 'Authentication required' using errcode='42501'; end if;
  if name is null or char_length(name) not between 1 and 32 or name ~ '[[:cntrl:]]' or p_joined is null then raise exception 'Invalid profile'; end if;
  insert into public.study_profiles(user_id,nickname,leaderboard_opt_in) values(uid,name,true)
    on conflict(user_id) do update set nickname=excluded.nickname,leaderboard_opt_in=true,updated_at=clock_timestamp();
  select to_jsonb(p)-'user_id' into result from public.study_profiles p where user_id=uid;return result;
end $$;

create or replace function public.study_focus_start(p_subject text,p_minutes integer) returns jsonb
language plpgsql security definer set search_path='' as $$
declare uid uuid:=auth.uid(); session public.focus_sessions;
begin
  if uid is null then raise exception 'Authentication required' using errcode='42501'; end if;
  if p_subject is null or p_subject not in ('ktvxl','tthcm','vldc','xstk','gdtc','other') or p_minutes is null or p_minutes not between 1 and 300 then raise exception 'Invalid focus session'; end if;
  perform pg_advisory_xact_lock(hashtextextended(uid::text,0));
  insert into public.study_profiles(user_id) values(uid) on conflict do nothing;
  -- Expired abandoned sessions stop blocking a future session; they receive no credit.
  update public.focus_sessions set state='cancelled',ended_at=clock_timestamp() where user_id=uid and state in ('running','paused') and started_at<clock_timestamp()-interval '24 hours';
  select * into session from public.focus_sessions where user_id=uid and state in ('running','paused');
  if found then
    if session.subject=p_subject and session.duration_minutes=p_minutes then
      if session.state='paused' then
        update public.focus_sessions set state='running',resumed_at=clock_timestamp() where id=session.id returning * into session;
      end if;
      return public.study_focus_payload(session);
    end if;
    raise exception 'A focus session is already active';
  end if;
  insert into public.focus_sessions(user_id,subject,duration_minutes,resumed_at) values(uid,p_subject,p_minutes,clock_timestamp()) returning * into session;
  return public.study_focus_payload(session);
end $$;

create or replace function public.study_focus_action(p_id uuid,p_action text) returns jsonb
language plpgsql security definer set search_path='' as $$
declare uid uuid:=auth.uid(); session public.focus_sessions; elapsed numeric;
begin
  if uid is null then raise exception 'Authentication required' using errcode='42501'; end if;
  if p_action is null or p_action not in ('pause','resume','cancel','finish') then raise exception 'Invalid action'; end if;
  select * into session from public.focus_sessions where id=p_id and user_id=uid for update;
  if not found then raise exception 'Session not found' using errcode='42501'; end if;
  if session.state in ('completed','cancelled') then return public.study_focus_payload(session); end if;
  elapsed:=session.elapsed_seconds+case when session.state='running' then greatest(0,extract(epoch from clock_timestamp()-session.resumed_at)) else 0 end;
  if p_action='finish' then

    update public.focus_sessions set state='completed',elapsed_seconds=elapsed,ended_at=clock_timestamp(),credited_minutes=least(duration_minutes,greatest(0,floor(elapsed/60)::integer)),resumed_at=null where id=p_id returning * into session;
  elsif p_action='cancel' then
    update public.focus_sessions set state='cancelled',elapsed_seconds=elapsed,ended_at=clock_timestamp(),resumed_at=null,credited_minutes=least(duration_minutes,greatest(0,floor(elapsed/60)::integer)) where id=p_id returning * into session;
  elsif p_action='pause' and session.state='running' then
    update public.focus_sessions set state='paused',elapsed_seconds=elapsed,resumed_at=null where id=p_id returning * into session;
  elsif p_action='resume' and session.state='paused' then
    update public.focus_sessions set state='running',resumed_at=clock_timestamp() where id=p_id returning * into session;
  end if;
  return public.study_focus_payload(session);
end $$;

create or replace function public.study_leaderboard(p_period text default 'week',p_subject text default 'all') returns jsonb
language plpgsql security definer set search_path='' as $$
declare today date:=(clock_timestamp() at time zone 'Asia/Ho_Chi_Minh')::date; first_day date; ranking jsonb; mine jsonb;
begin
  if p_period is null or p_period not in ('today','week','month') or p_subject is null or p_subject not in ('all','ktvxl','tthcm','vldc','xstk','gdtc','other') then raise exception 'Invalid leaderboard filter'; end if;
  first_day:=case p_period when 'today' then today when 'week' then date_trunc('week',today)::date else date_trunc('month',today)::date end;
  with totals as (
    select s.user_id,sum(s.credited_minutes)::bigint minutes,count(*)::integer sessions from public.focus_sessions s
    where s.state in ('completed','cancelled') and s.credited_minutes>0 and s.ended_at>=first_day::timestamp at time zone 'Asia/Ho_Chi_Minh'
      and s.ended_at<(today+1)::timestamp at time zone 'Asia/Ho_Chi_Minh' and (p_subject='all' or s.subject=p_subject) group by s.user_id
  ), ranked as (
    select p.user_id,p.nickname,t.minutes,t.sessions,rank() over(order by t.minutes desc)::integer rank
    from totals t join public.study_profiles p on p.user_id=t.user_id where t.minutes>0
  ) select coalesce(jsonb_agg(jsonb_build_object('id',r.user_id,'nickname',r.nickname,'icon',upper(left(r.nickname,1)),
    'minutes',r.minutes,'sessions',r.sessions,'rank',r.rank) order by r.minutes desc,r.user_id),'[]'::jsonb)
    into ranking from (select * from ranked order by minutes desc,user_id limit 100) r;
  select jsonb_build_object('id',p.user_id,'nickname',p.nickname,'joined',true,
    'minutes',coalesce(sum(s.credited_minutes),0),'sessions',count(s.id),'rank',null) into mine
    from public.study_profiles p left join public.focus_sessions s on s.user_id=p.user_id and s.state in ('completed','cancelled') and s.credited_minutes>0
      and s.ended_at>=first_day::timestamp at time zone 'Asia/Ho_Chi_Minh' and s.ended_at<(today+1)::timestamp at time zone 'Asia/Ho_Chi_Minh'
      and (p_subject='all' or s.subject=p_subject) where p.user_id=auth.uid() group by p.user_id;
  if mine is not null and (mine->>'joined')::boolean and (mine->>'minutes')::bigint>0 then
    mine:=mine||jsonb_build_object('rank',1+(select count(*) from (
      select s.user_id from public.focus_sessions s join public.study_profiles p on p.user_id=s.user_id
      where s.state in ('completed','cancelled') and s.credited_minutes>0 and s.ended_at>=first_day::timestamp at time zone 'Asia/Ho_Chi_Minh'
        and s.ended_at<(today+1)::timestamp at time zone 'Asia/Ho_Chi_Minh' and (p_subject='all' or s.subject=p_subject)
      group by s.user_id having sum(s.credited_minutes)>(mine->>'minutes')::bigint) better));
  end if;
  return jsonb_build_object('rows',ranking,'me',mine,'remote',true);
end $$;

commit;
