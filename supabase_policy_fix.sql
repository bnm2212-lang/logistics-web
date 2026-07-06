-- Supabase MVP no-login policy fix.
-- Run this in Supabase SQL Editor for the project.
-- This intentionally allows anon CRUD until authentication/RLS ownership rules are added.

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

    execute format('drop policy if exists %I on public.%I', 'Allow anon select ' || table_name, table_name);
    execute format(
      'create policy %I on public.%I for select to anon using (true)',
      'Allow anon select ' || table_name,
      table_name
    );

    execute format('drop policy if exists %I on public.%I', 'Allow anon insert ' || table_name, table_name);
    execute format(
      'create policy %I on public.%I for insert to anon with check (true)',
      'Allow anon insert ' || table_name,
      table_name
    );

    execute format('drop policy if exists %I on public.%I', 'Allow anon update ' || table_name, table_name);
    execute format(
      'create policy %I on public.%I for update to anon using (true) with check (true)',
      'Allow anon update ' || table_name,
      table_name
    );

    execute format('drop policy if exists %I on public.%I', 'Allow anon delete ' || table_name, table_name);
    execute format(
      'create policy %I on public.%I for delete to anon using (true)',
      'Allow anon delete ' || table_name,
      table_name
    );
  end loop;
end $$;

grant usage, select on all sequences in schema public to anon;
alter default privileges in schema public grant usage, select on sequences to anon;

commit;
