-- Supabase RLS/permission fix for the current no-login app.
-- Run this in Supabase SQL Editor with the project owner/service role.
-- This intentionally allows anon CRUD until authentication is added.

begin;

grant usage on schema public to anon;

do $$
declare
  table_name text;
  table_names text[] := array[
    'stores',
    'inventory_items',
    'cart_items',
    'orders',
    'order_items',
    'special_events',
    'community_posts',
    'coffee_issues'
  ];
begin
  foreach table_name in array table_names loop
    if to_regclass(format('public.%I', table_name)) is null then
      raise notice 'Skipping missing table public.%', table_name;
      continue;
    end if;

    execute format('alter table public.%I enable row level security', table_name);
    execute format('grant select, insert, update, delete on table public.%I to anon', table_name);

    if not exists (
      select 1 from pg_policies
      where schemaname = 'public' and tablename = table_name and policyname = 'anon_select_all'
    ) then
      execute format('create policy anon_select_all on public.%I for select to anon using (true)', table_name);
    end if;

    if not exists (
      select 1 from pg_policies
      where schemaname = 'public' and tablename = table_name and policyname = 'anon_insert_all'
    ) then
      execute format('create policy anon_insert_all on public.%I for insert to anon with check (true)', table_name);
    end if;

    if not exists (
      select 1 from pg_policies
      where schemaname = 'public' and tablename = table_name and policyname = 'anon_update_all'
    ) then
      execute format('create policy anon_update_all on public.%I for update to anon using (true) with check (true)', table_name);
    end if;

    if not exists (
      select 1 from pg_policies
      where schemaname = 'public' and tablename = table_name and policyname = 'anon_delete_all'
    ) then
      execute format('create policy anon_delete_all on public.%I for delete to anon using (true)', table_name);
    end if;
  end loop;
end $$;

grant usage, select on all sequences in schema public to anon;
alter default privileges in schema public grant usage, select on sequences to anon;

commit;

-- Optional verification after running:
-- select schemaname, tablename, policyname, cmd, roles
-- from pg_policies
-- where schemaname = 'public'
--   and tablename in ('stores','inventory_items','cart_items','orders','order_items','special_events','community_posts','coffee_issues')
-- order by tablename, policyname;