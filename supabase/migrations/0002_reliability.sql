-- Fix locked capsule reads and make capsule creation transactional.
create or replace function public.get_capsule(capsule_uuid uuid)
returns table (id uuid, title text, status public.capsule_status, created_at timestamptz, unlock_at timestamptz, opened_at timestamptz, message text, project_name text, website_url text, github_url text, additional_notes text)
language sql security definer set search_path = public as $$
  select c.id, c.title,
    case when c.unlock_at <= now() and c.status = 'sealed' then 'ready'::public.capsule_status else c.status end,
    c.created_at, c.unlock_at, c.opened_at,
    case when c.unlock_at <= now() then x.message end,
    case when c.unlock_at <= now() then x.project_name end,
    case when c.unlock_at <= now() then x.website_url end,
    case when c.unlock_at <= now() then x.github_url end,
    case when c.unlock_at <= now() then x.additional_notes end
  from public.capsules c join public.capsule_contents x on x.capsule_id = c.id
  where c.id = capsule_uuid and c.user_id = auth.uid() and c.deleted_at is null;
$$;

create or replace function public.create_capsule(p_title text, p_message text, p_unlock_at timestamptz, p_project_name text default null, p_website_url text default null, p_github_url text default null, p_additional_notes text default null)
returns uuid language plpgsql security invoker set search_path = public as $$
declare new_id uuid;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  insert into public.capsules(user_id, title, unlock_at) values (auth.uid(), trim(p_title), p_unlock_at) returning id into new_id;
  insert into public.capsule_contents(capsule_id, user_id, message, project_name, website_url, github_url, additional_notes) values (new_id, auth.uid(), trim(p_message), p_project_name, p_website_url, p_github_url, p_additional_notes);
  return new_id;
end;
$$;

revoke all on function public.get_capsule(uuid) from public;
grant execute on function public.get_capsule(uuid) to authenticated;
grant execute on function public.create_capsule(text, text, timestamptz, text, text, text, text) to authenticated;
