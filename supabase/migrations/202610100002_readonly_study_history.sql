-- Study history is now server-owned. Preserve previous records and admin corrections.
-- Acknowledge and discard old clients' minute edits so notes/answers in the same
-- batch can still sync. The previous writer must not be callable by clients.
begin;
alter function public.study_sync(jsonb) rename to study_sync_before_readonly_history;
revoke all on function public.study_sync_before_readonly_history(jsonb) from public,anon,authenticated;

create function public.study_sync(p_operations jsonb) returns jsonb
language plpgsql security definer set search_path='' as $$
declare op jsonb; allowed jsonb:='[]'; ignored jsonb:='[]'; result jsonb; op_id uuid;
begin
  if auth.uid() is null then raise exception 'Authentication required' using errcode='42501'; end if;
  if jsonb_typeof(p_operations) is distinct from 'array' or jsonb_array_length(p_operations)>200
    or octet_length(p_operations::text)>2000000 then raise exception 'Invalid operation batch'; end if;
  for op in select value from jsonb_array_elements(p_operations) loop
    if jsonb_typeof(op) is distinct from 'object' then raise exception 'Invalid operation'; end if;
    if op->>'kind'='study' then
      op_id:=(op->>'opId')::uuid;
      if op_id is null then raise exception 'Invalid operation identity'; end if;
      ignored:=ignored||jsonb_build_array(op->>'opId');
    else allowed:=allowed||jsonb_build_array(op); end if;
  end loop;
  result:=public.study_sync_before_readonly_history(allowed);
  return result||jsonb_build_object('accepted',coalesce(result->'accepted','[]'::jsonb)||ignored,'ignored',ignored);
end $$;
revoke all on function public.study_sync(jsonb) from public,anon,authenticated;
grant execute on function public.study_sync(jsonb) to authenticated;
commit;
