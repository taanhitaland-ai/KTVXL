-- ADMIN ONLY: run in Supabase SQL Editor, never from the browser app.
-- Set a day's TOTAL for ONE subject, not an increment. Reruns do not add twice.
-- Find your UUID in Authentication > Users, then replace the zero UUID below.
-- Replace the example date, subject and minutes with your actual study history.
-- Subject: ktvxl / tthcm / vldc / xstk / gdtc / other.
-- Before applying, sync all your devices and pause the active Pomodoro.
-- This changes PRIVATE history + streak only. It does not change focus_sessions
-- or the public leaderboard. Leave sync receipts intact.
-- First run uses ROLLBACK for review. Replace only the LAST line with COMMIT
-- when the returned row is correct. No Git commit or redeploy is needed.
begin;
create temporary table personal_study_correction(
  target_user uuid, study_day date, study_subject text, total_minutes integer
) on commit drop;
insert into personal_study_correction values(
  '00000000-0000-0000-0000-000000000000', -- your user UUID
  '2026-10-07', -- example, replace
  'ktvxl',
  90 -- example TOTAL for this subject on this day
);
do $$
declare
  correction record;
begin
  select * into strict correction from pg_temp.personal_study_correction;
  if not exists(select 1 from auth.users where id=correction.target_user) then
    raise exception 'Replace target_user with your Authentication user UUID';
  end if;
  if correction.study_day is null or correction.study_subject is null or correction.total_minutes is null
    or correction.study_day < '2000-01-01'::date or correction.study_day > (clock_timestamp() at time zone 'Asia/Ho_Chi_Minh')::date
    or correction.study_subject not in ('ktvxl','tthcm','vldc','xstk','gdtc','other')
    or correction.total_minutes not between 0 and 1440 then
    raise exception 'Invalid personal study correction';
  end if;
  perform pg_advisory_xact_lock(hashtextextended(correction.target_user::text,0));
  insert into public.study_records(user_id,record_key,kind,subject,record_id,value)
    values(correction.target_user,'study|'||correction.study_subject||'|'||correction.study_day::text,'study',correction.study_subject,correction.study_day::text,to_jsonb(correction.total_minutes))
    on conflict(user_id,record_key) do update
      set value=excluded.value,version=study_records.version+1,updated_at=clock_timestamp()
      where study_records.value is distinct from excluded.value;
end $$;
-- Review only the intended user's day and subject.
select r.user_id,r.subject,r.record_id as day,r.value as total_minutes,r.version,r.updated_at
  from public.study_records r join pg_temp.personal_study_correction c
    on r.user_id=c.target_user and r.record_key='study|'||c.study_subject||'|'||c.study_day::text;
rollback;
