-- Account-owned garden. No client can upload balances, growth, RNG or study time.
begin;
create table public.study_gardens (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null default '{"v":1,"totalSeconds":0,"continuous":{"seconds":0,"endMs":0,"rare":false,"epic":false},"seeds":{"oak":0,"maple":0,"cherry":0,"bamboo":0,"galaxy":0},"plots":[null,null,null,null,null,null],"items":{"coal":0,"stone":0,"copper":0,"tin":0,"azure":0,"rose":0,"sun":0,"moss":0,"frost":0,"cosmos":0},"layout":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],"misses":0,"harvests":0,"rareAwards":0,"unlocked":false,"daily":{},"cursors":{},"lastReward":null}'::jsonb,
  revision bigint not null default 1,
  updated_at timestamptz not null default clock_timestamp()
);
create table public.study_garden_credit (
  user_id uuid not null references auth.users(id) on delete cascade,
  session_id uuid not null,
  seconds bigint not null check(seconds>=0),
  primary key(user_id,session_id)
);
alter table public.study_gardens enable row level security;
alter table public.study_garden_credit enable row level security;
revoke all on public.study_gardens,public.study_garden_credit from public,anon,authenticated;
grant select on public.study_gardens to authenticated;
create policy garden_owner_read on public.study_gardens for select to authenticated using((select auth.uid())=user_id);

create function public.study_garden_item_value(p_id text) returns integer
language sql immutable set search_path='' as $$
  select case p_id
    when 'coal' then 10 when 'stone' then 10 when 'copper' then 30 when 'tin' then 30
    when 'azure' then 80 when 'rose' then 80 when 'sun' then 180 when 'moss' then 180
    when 'frost' then 400 when 'cosmos' then 400
    when 'coal_glowing' then 25 when 'stone_glowing' then 25 when 'copper_glowing' then 75 when 'tin_glowing' then 75
    when 'azure_glowing' then 200 when 'rose_glowing' then 200 when 'sun_glowing' then 450 when 'moss_glowing' then 450
    when 'frost_glowing' then 1000 when 'cosmos_glowing' then 1000
    else 0 end
$$;
create function public.study_garden_value(p_items jsonb) returns bigint
language sql immutable set search_path='' as $$
  select coalesce(sum(public.study_garden_item_value(key)*(value#>>'{}')::bigint),0)::bigint from jsonb_each(p_items)
$$;
create function public.study_garden_duration(p_seed text) returns integer
language sql immutable set search_path='' as $$select case p_seed when 'oak' then 3600 when 'cherry' then 3600 when 'maple' then 7200 when 'bamboo' then 7200 when 'galaxy' then 10800 else 0 end$$;
create function public.study_garden_require_user() returns uuid
language plpgsql security definer set search_path='' as $$
declare uid uuid:=auth.uid();
begin
  if uid is null or coalesce((auth.jwt()->>'is_anonymous')::boolean,false) then raise exception 'Authentication required' using errcode='42501';end if;
  if not exists(select 1 from public.study_profiles where user_id=uid and char_length(btrim(nickname))>=2 and lower(btrim(nickname)) not in ('người học','anonymous','anon','guest')) then raise exception 'Choose a username first' using errcode='42501';end if;
  perform pg_advisory_xact_lock(hashtextextended(uid::text,0));return uid;
end $$;
create function public.study_garden_payload(p_uid uuid) returns jsonb
language sql stable security definer set search_path='' as $$
  select jsonb_build_object('state',state,'revision',revision,'asset_value',public.study_garden_value(state->'items'),
    'display_value',(select coalesce(sum(public.study_garden_item_value(value#>>'{}')),0) from jsonb_array_elements(state->'layout')))
  from public.study_gardens where user_id=p_uid
$$;

-- Only invoked by the existing server clock, including final settlement before subject changes.
create function public.study_garden_credit_window(p_uid uuid) returns void
language plpgsql security definer set search_path='' as $$
declare w public.study_activity_windows;s jsonb;previous bigint;delta bigint;secs bigint;before_secs bigint;continuous bigint;end_ms bigint;start_ms bigint;
  awards text[]:='{}';seed text;plot jsonb;growth bigint;day text;i integer;d integer;
begin
  select state into s from public.study_gardens where user_id=p_uid for update;if not found then return;end if;
  select * into w from public.study_activity_windows where user_id=p_uid;if not found then return;end if;
  secs:=floor(w.elapsed_seconds)::bigint;
  select seconds into previous from public.study_garden_credit where user_id=p_uid and session_id=w.session_id;
  delta:=greatest(0,secs-coalesce(previous,0));if delta=0 then return;end if;
  end_ms:=floor(extract(epoch from w.cursor_at)*1000)::bigint;start_ms:=end_ms-delta*1000;
  if previous is null and (s#>>'{continuous,endMs}')::bigint>0 and start_ms-(s#>>'{continuous,endMs}')::bigint>=900000 then
    s:=jsonb_set(s,'{continuous}','{"seconds":0,"endMs":0,"rare":false,"epic":false}');
  end if;
  before_secs:=(s->>'totalSeconds')::bigint;continuous:=(s#>>'{continuous,seconds}')::bigint+delta;
  s:=jsonb_set(s,'{totalSeconds}',to_jsonb(before_secs+delta));s:=jsonb_set(s,'{continuous,seconds}',to_jsonb(continuous));
  s:=jsonb_set(s,'{continuous,endMs}',to_jsonb(greatest(end_ms,(s#>>'{continuous,endMs}')::bigint)));
  for i in (before_secs/1500)::integer..((before_secs+delta)/1500-1)::integer loop
    awards:=array_append(awards,case when i%2=0 then 'oak' else 'maple' end);
  end loop;
  if continuous>=3600 and not (s#>>'{continuous,rare}')::boolean then
    awards:=array_append(awards,case when (s->>'rareAwards')::integer%2=0 then 'cherry' else 'bamboo' end);
    s:=jsonb_set(s,'{rareAwards}',to_jsonb((s->>'rareAwards')::integer+1));s:=jsonb_set(s,'{continuous,rare}','true');
  end if;
  if continuous>=7200 and not (s#>>'{continuous,epic}')::boolean then awards:=array_append(awards,'galaxy');s:=jsonb_set(s,'{continuous,epic}','true');end if;
  foreach seed in array awards loop s:=jsonb_set(s,array['seeds',seed],to_jsonb(least(9999,(s#>>array['seeds',seed])::integer+1)));end loop;
  day:=(w.cursor_at at time zone 'Asia/Ho_Chi_Minh')::date::text;
  s:=jsonb_set(s,array['daily',day],to_jsonb(coalesce((s#>>array['daily',day])::integer,0)+cardinality(awards)));
  for i in 0..5 loop
    plot:=s#>array['plots',i::text];
    if plot<>'null'::jsonb then
      d:=public.study_garden_duration(plot->>'seed');growth:=least(delta,greatest(0,(end_ms-coalesce((plot->>'createdAt')::bigint,0))/1000));
      s:=jsonb_set(s,array['plots',i::text,'seconds'],to_jsonb(least(d,(plot->>'seconds')::bigint+growth)));
    end if;
  end loop;
  insert into public.study_garden_credit values(p_uid,w.session_id,secs) on conflict(user_id,session_id) do update set seconds=excluded.seconds;
  update public.study_gardens set state=s,revision=revision+1,updated_at=clock_timestamp() where user_id=p_uid;
end $$;

alter function public.study_activity_settle(uuid) rename to study_activity_settle_before_garden;
revoke all on function public.study_activity_settle_before_garden(uuid) from public,anon,authenticated;
create function public.study_activity_settle(p_uid uuid) returns boolean
language plpgsql security definer set search_path='' as $$
declare changed boolean;
begin changed:=public.study_activity_settle_before_garden(p_uid);perform public.study_garden_credit_window(p_uid);return changed;end $$;

create function public.study_garden_snapshot() returns jsonb
language plpgsql security definer set search_path='' as $$
declare uid uuid:=public.study_garden_require_user();inserted integer;w public.study_activity_windows;d date:=(clock_timestamp() at time zone 'Asia/Ho_Chi_Minh')::date;
begin
  perform public.study_activity_settle(uid);
  insert into public.study_gardens(user_id) values(uid) on conflict do nothing;get diagnostics inserted=row_count;
  -- The feature starts now; do not turn pre-feature or manually imported study history into assets.
  if inserted>0 then
    select * into w from public.study_activity_windows where user_id=uid;
    if found then insert into public.study_garden_credit values(uid,w.session_id,floor(w.elapsed_seconds)::bigint) on conflict do nothing;end if;
  end if;
  -- A seven-day streak ending yesterday remains eligible before today's first study.
  select coalesce(max(record_id)::date,d) into d from public.study_records where user_id=uid and kind='study' and record_id between (d-1)::text and d::text and (value#>>'{}')::numeric>0;
  if (select count(distinct record_id) from public.study_records where user_id=uid and kind='study' and record_id between (d-6)::text and d::text and (value#>>'{}')::numeric>0)=7 then
    update public.study_gardens set state=jsonb_set(state,'{unlocked}','true') where user_id=uid;
  end if;
  return public.study_garden_payload(uid);
end $$;

create function public.study_garden_plant(p_plot integer,p_seed text) returns jsonb
language plpgsql security definer set search_path='' as $$
declare uid uuid:=public.study_garden_require_user();s jsonb;
begin
  perform public.study_garden_snapshot();select state into s from public.study_gardens where user_id=uid for update;
  if p_plot is null or p_plot not between 0 and 5 or public.study_garden_duration(p_seed)=0 or
    (p_plot=5 and not (s->>'unlocked')::boolean) or s#>array['plots',p_plot::text]<>'null'::jsonb or (s#>>array['seeds',p_seed])::integer<1 then raise exception 'Chọn ô trống và một hạt đang có.';end if;
  s:=jsonb_set(s,array['seeds',p_seed],to_jsonb((s#>>array['seeds',p_seed])::integer-1));
  s:=jsonb_set(s,array['plots',p_plot::text],jsonb_build_object('seed',p_seed,'seconds',0,'createdAt',floor(extract(epoch from clock_timestamp())*1000)::bigint,'glowing',random()<0.2));
  update public.study_gardens set state=s,revision=revision+1,updated_at=clock_timestamp() where user_id=uid;return public.study_garden_payload(uid);
end $$;

create function public.study_garden_harvest(p_plot integer,p_created_at bigint) returns jsonb
language plpgsql security definer set search_path='' as $$
declare uid uuid:=public.study_garden_require_user();s jsonb;plot jsonb;seed text;weights integer[];target double precision;picked_rank integer:=4;item text;guaranteed boolean;reward jsonb;
  catalog text[]:=array['coal','stone','copper','tin','azure','rose','sun','moss','frost','cosmos'];
  is_glowing boolean;item_is_glowing boolean;
begin
  perform public.study_garden_snapshot();select state into s from public.study_gardens where user_id=uid for update;
  if p_plot is null or p_plot not between 0 and 5 then raise exception 'Invalid plot';end if;
  plot:=s#>array['plots',p_plot::text];seed:=plot->>'seed';
  if plot is null or plot='null'::jsonb or p_created_at is null or coalesce((plot->>'createdAt')::bigint,0)<>p_created_at or (plot->>'seconds')::bigint<public.study_garden_duration(seed) then raise exception 'Cây chưa chín hoặc đã được thu hoạch.';end if;
  is_glowing:=coalesce((plot->>'glowing')::boolean,false);
  if is_glowing then
    weights:=case when seed in ('oak','maple') then array[15,25,35,18,7] when seed in ('cherry','bamboo') then array[5,15,35,30,15] else array[0,10,25,40,25] end;
  else
    weights:=case when seed in ('oak','maple') then array[45,35,16,3,1] when seed in ('cherry','bamboo') then array[20,35,28,12,5] else array[5,20,35,28,12] end;
  end if;
  guaranteed:=(s->>'misses')::integer>=9;if guaranteed then weights[1]:=0;weights[2]:=0;weights[3]:=0;end if;
  target:=random()*(select sum(n) from unnest(weights)n);
  for rank in 0..4 loop if target<weights[rank+1] then picked_rank:=rank;exit;end if;target:=target-weights[rank+1];end loop;
  item:=catalog[picked_rank*2+1+floor(random()*2)::integer];
  item_is_glowing:=is_glowing and (random()<0.5);
  if item_is_glowing then item:=item||'_glowing';end if;
  reward:=jsonb_build_object('item',item,'seed',seed,'guaranteed',guaranteed,'harvest',(s->>'harvests')::bigint+1,'isNew',coalesce((s#>>array['items',item])::integer,0)=0,'glowing',item_is_glowing,'treeGlowing',is_glowing);
  if coalesce((s#>>array['items',item])::integer,0)>=9999 then raise exception 'Kho vật phẩm đã đầy.';end if;
  s:=jsonb_set(s,array['items',item],to_jsonb(coalesce((s#>>array['items',item])::integer,0)+1));s:=jsonb_set(s,array['plots',p_plot::text],'null');
  s:=jsonb_set(s,'{misses}',to_jsonb(case when picked_rank>=3 then 0 else (s->>'misses')::integer+1 end));
  s:=jsonb_set(s,'{harvests}',reward->'harvest');s:=jsonb_set(s,'{lastReward}',reward);
  update public.study_gardens set state=s,revision=revision+1,updated_at=clock_timestamp() where user_id=uid;
  return public.study_garden_payload(uid)||jsonb_build_object('reward',reward);
end $$;

create function public.study_garden_layout(p_layout jsonb,p_previous jsonb) returns jsonb
language plpgsql security definer set search_path='' as $$
declare uid uuid:=public.study_garden_require_user();s jsonb;id text;counted integer;
begin
  perform public.study_garden_snapshot();select state into s from public.study_gardens where user_id=uid for update;
  if p_layout is null or jsonb_typeof(p_layout)<>'array' or jsonb_array_length(p_layout)<>15 then raise exception 'Hộp trưng bày có 15 ô.';end if;
  if p_previous is distinct from s->'layout' then raise exception 'Bố cục đã thay đổi trên thiết bị khác. Mở lại để xem bản mới.';end if;
  for id,counted in select value#>>'{}',count(*)::integer from jsonb_array_elements(p_layout) where value<>'null'::jsonb group by value loop
    if public.study_garden_item_value(id)=0 or counted>coalesce((s#>>array['items',id])::integer,0) then raise exception 'Không đủ vật phẩm hoặc vật phẩm không hợp lệ.';end if;
  end loop;
  update public.study_gardens set state=jsonb_set(s,'{layout}',p_layout),revision=revision+1,updated_at=clock_timestamp() where user_id=uid;
  return public.study_garden_payload(uid);
end $$;

-- Explicit public projection: no answers, notes, email, seeds, growth or reward ledger.
create function public.study_garden_public(p_user uuid) returns jsonb
language sql stable security definer set search_path='' as $$
  select jsonb_build_object('id',p.user_id,'nickname',p.nickname,'items',coalesce(g.state->'items','{}'::jsonb),
    'layout',coalesce(g.state->'layout','[]'::jsonb),'asset_value',coalesce(public.study_garden_value(g.state->'items'),0))
  from public.study_profiles p left join public.study_gardens g using(user_id) where p.user_id=p_user
$$;

-- Preserve period/subject filters and study-time ranks; attach lifetime asset values.
alter function public.study_leaderboard(text,text) rename to study_leaderboard_before_garden;
revoke all on function public.study_leaderboard_before_garden(text,text) from public,anon,authenticated;
create function public.study_leaderboard(p_period text default 'week',p_subject text default 'all') returns jsonb
language plpgsql security definer set search_path='' as $$
declare result jsonb;rows jsonb;me jsonb;
begin
  result:=public.study_leaderboard_before_garden(p_period,p_subject);
  select coalesce(jsonb_agg(r.value||jsonb_build_object('asset_value',coalesce(public.study_garden_value(g.state->'items'),0)) order by r.ordinality),'[]'::jsonb)
    into rows from jsonb_array_elements(result->'rows') with ordinality r(value,ordinality) left join public.study_gardens g on g.user_id=(r.value->>'id')::uuid;
  me:=result->'me';if me<>'null'::jsonb then me:=me||jsonb_build_object('asset_value',coalesce((select public.study_garden_value(state->'items') from public.study_gardens where user_id=auth.uid()),0));end if;
  return result||jsonb_build_object('rows',rows,'me',me);
end $$;

revoke all on function public.study_garden_item_value(text),public.study_garden_value(jsonb),public.study_garden_duration(text),public.study_garden_require_user(),public.study_garden_payload(uuid),public.study_garden_credit_window(uuid),public.study_activity_settle(uuid),public.study_garden_snapshot(),public.study_garden_plant(integer,text),public.study_garden_harvest(integer,bigint),public.study_garden_layout(jsonb,jsonb),public.study_garden_public(uuid),public.study_leaderboard(text,text) from public,anon,authenticated;
grant execute on function public.study_garden_snapshot(),public.study_garden_plant(integer,text),public.study_garden_harvest(integer,bigint),public.study_garden_layout(jsonb,jsonb) to authenticated;
grant execute on function public.study_garden_public(uuid),public.study_leaderboard(text,text) to anon,authenticated;
commit;
