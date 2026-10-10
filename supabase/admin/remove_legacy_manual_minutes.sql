-- Correct ONLY one user's audited +15/+30/+60 button clicks on one day.
-- Server-measured study, previous days, notes, answers, ranking and assets stay intact.
-- Keeps an admin-only before/after backup and all original receipts. Safe to rerun.
-- Before running, set these session settings from the receipt audit:
-- select set_config('ktvxl.repair_user','YOUR_USER_UUID',false);
-- select set_config('ktvxl.repair_day','YYYY-MM-DD',false);
-- select set_config('ktvxl.repair_subject','ktvxl',false);
-- select set_config('ktvxl.repair_cutoff','YYYY-MM-DD HH:MM:SS+00',false);
-- select set_config('ktvxl.repair_edits','AUDITED_EDIT_COUNT',false);
-- select set_config('ktvxl.repair_minutes','AUDITED_MINUTES',false);
begin;
create table if not exists public.study_history_repairs (
  repair_key text not null,
  user_id uuid not null,
  record_key text not null,
  before_value jsonb not null,
  after_value jsonb not null,
  removed_minutes numeric not null,
  repaired_at timestamptz not null default clock_timestamp(),
  primary key(repair_key,user_id,record_key)
);
alter table public.study_history_repairs enable row level security;
revoke all on public.study_history_repairs from public,anon,authenticated;

do $$
declare
  target uuid:=current_setting('ktvxl.repair_user')::uuid;
  target_day date:=current_setting('ktvxl.repair_day')::date;
  target_subject text:=current_setting('ktvxl.repair_subject');
  cutoff timestamptz:=current_setting('ktvxl.repair_cutoff')::timestamptz;
  expected_edits integer:=current_setting('ktvxl.repair_edits')::integer;
  expected_minutes numeric:=current_setting('ktvxl.repair_minutes')::numeric;
  old_value numeric; removed numeric; edits integer;
  correction_key text := target_day::text||'-legacy-manual-buttons';
  target_record text := 'study|'||target_subject||'|'||target_day::text;
begin
  if target is null or target_day is null or cutoff is null or target_subject not in ('ktvxl','tthcm','vldc','xstk','gdtc','other')
    or expected_edits is null or expected_edits<=0 or expected_minutes is null or expected_minutes<=0
    or not exists(select 1 from public.study_profiles where user_id=target) then raise exception 'Invalid audited correction'; end if;
  perform pg_advisory_xact_lock(hashtextextended(target::text,0));
  if exists(select 1 from public.study_history_repairs where repair_key=correction_key and user_id=target and record_key=target_record) then return; end if;
  select count(*),sum((request->>'delta')::numeric) into edits,removed
    from public.study_sync_receipts
    where user_id=target and request->>'kind'='study'
      and request->>'subject'=target_subject and request->>'id'=target_day::text
      and (request->>'delta')::numeric in (15,30,60)
      and created_at<=cutoff;
  if edits<>expected_edits or removed is distinct from expected_minutes then raise exception 'Receipt audit changed; review before repairing'; end if;
  select (value#>>'{}')::numeric into strict old_value from public.study_records
    where user_id=target and record_key=target_record for update;
  if old_value<removed then raise exception 'History already corrected; review before repairing'; end if;
  insert into public.study_history_repairs(repair_key,user_id,record_key,before_value,after_value,removed_minutes)
    values(correction_key,target,target_record,to_jsonb(old_value),to_jsonb(old_value-removed),removed);
  update public.study_records set value=to_jsonb(old_value-removed),version=version+1,updated_at=clock_timestamp()
    where user_id=target and record_key=target_record;
end $$;
select p.nickname,r.record_id as study_day,r.subject,r.value as minutes,b.removed_minutes
  from public.study_history_repairs b join public.study_records r using(user_id,record_key)
  join public.study_profiles p using(user_id)
  where b.user_id=current_setting('ktvxl.repair_user')::uuid
    and b.record_key='study|'||current_setting('ktvxl.repair_subject')||'|'||current_setting('ktvxl.repair_day');
commit;

-- If an administrator needs to undo, under the same account advisory lock ADD
-- removed_minutes to the CURRENT value (not before_value, which would lose later
-- real study), increment version, and keep this backup/repair marker for review.
