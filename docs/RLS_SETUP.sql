-- RLS para tabelas do app
-- Ajuste conforme necessário antes de executar em produção.

-- Restaurants
DO $$ BEGIN
  IF to_regclass('public.restaurants') IS NOT NULL THEN
    EXECUTE 'alter table public.restaurants enable row level security';
    EXECUTE 'drop policy if exists "restaurants_select" on public.restaurants';
    EXECUTE 'drop policy if exists "restaurants_insert" on public.restaurants';
    EXECUTE 'drop policy if exists "restaurants_update" on public.restaurants';
    EXECUTE 'drop policy if exists "restaurants_delete" on public.restaurants';

    EXECUTE 'create policy "restaurants_select" on public.restaurants for select using (true)';
    EXECUTE 'create policy "restaurants_insert" on public.restaurants for insert to authenticated with check (true)';
    EXECUTE 'create policy "restaurants_update" on public.restaurants for update to authenticated using (true) with check (true)';
    EXECUTE 'create policy "restaurants_delete" on public.restaurants for delete to authenticated using (true)';
  END IF;
END $$;

-- Reservations
DO $$ BEGIN
  IF to_regclass('public.reservations') IS NOT NULL THEN
    EXECUTE 'alter table public.reservations enable row level security';
    EXECUTE 'drop policy if exists "reservations_select" on public.reservations';
    EXECUTE 'drop policy if exists "reservations_insert" on public.reservations';
    EXECUTE 'drop policy if exists "reservations_update" on public.reservations';
    EXECUTE 'drop policy if exists "reservations_delete" on public.reservations';

    EXECUTE 'create policy "reservations_select" on public.reservations for select using (true)';
    EXECUTE 'create policy "reservations_insert" on public.reservations for insert to authenticated with check (true)';
    EXECUTE 'create policy "reservations_update" on public.reservations for update to authenticated using (true) with check (true)';
    EXECUTE 'create policy "reservations_delete" on public.reservations for delete to authenticated using (true)';
  END IF;
END $$;

-- Availability
DO $$ BEGIN
  IF to_regclass('public.availability') IS NOT NULL THEN
    EXECUTE 'alter table public.availability enable row level security';
    EXECUTE 'drop policy if exists "availability_select" on public.availability';
    EXECUTE 'drop policy if exists "availability_insert" on public.availability';
    EXECUTE 'drop policy if exists "availability_update" on public.availability';
    EXECUTE 'drop policy if exists "availability_delete" on public.availability';

    EXECUTE 'create policy "availability_select" on public.availability for select using (true)';
    EXECUTE 'create policy "availability_insert" on public.availability for insert to authenticated with check (true)';
    EXECUTE 'create policy "availability_update" on public.availability for update to authenticated using (true) with check (true)';
    EXECUTE 'create policy "availability_delete" on public.availability for delete to authenticated using (true)';
  END IF;
END $$;

-- Users
DO $$ BEGIN
  IF to_regclass('public.users') IS NOT NULL THEN
    EXECUTE 'alter table public.users enable row level security';
    EXECUTE 'drop policy if exists "users_select" on public.users';
    EXECUTE 'drop policy if exists "users_insert" on public.users';
    EXECUTE 'drop policy if exists "users_update" on public.users';
    EXECUTE 'drop policy if exists "users_delete" on public.users';

    EXECUTE 'create policy "users_select" on public.users for select using (true)';
    EXECUTE 'create policy "users_insert" on public.users for insert to authenticated with check (true)';
    EXECUTE 'create policy "users_update" on public.users for update to authenticated using (true) with check (true)';
    EXECUTE 'create policy "users_delete" on public.users for delete to authenticated using (true)';
  END IF;
END $$;

-- Storage (bucket: fotos-capa-unidades)
-- A tabela storage.objects normalmente é owned por supabase_storage_admin.
-- Se o SQL Editor acusar "must be owner of table objects", aplique estas
-- policies na UI do Supabase: Storage > Policies > New Policy (SQL).
--
-- As policies abaixo permitem upload via anon (frontend sem auth) e leitura pública.
-- Cole cada policy na UI (ou execute via SQL Editor com o owner correto).
--
-- alter table storage.objects enable row level security;
--
-- drop policy if exists "storage_read_public_fotos_capa" on storage.objects;
-- create policy "storage_read_public_fotos_capa" on storage.objects
-- for select
-- using (bucket_id = 'fotos-capa-unidades');
--
-- drop policy if exists "storage_insert_anon_fotos_capa" on storage.objects;
-- create policy "storage_insert_anon_fotos_capa" on storage.objects
-- for insert to anon
-- with check (bucket_id = 'fotos-capa-unidades');
--
-- drop policy if exists "storage_update_anon_fotos_capa" on storage.objects;
-- create policy "storage_update_anon_fotos_capa" on storage.objects
-- for update to anon
-- using (bucket_id = 'fotos-capa-unidades')
-- with check (bucket_id = 'fotos-capa-unidades');
--
-- drop policy if exists "storage_delete_anon_fotos_capa" on storage.objects;
-- create policy "storage_delete_anon_fotos_capa" on storage.objects
-- for delete to anon
-- using (bucket_id = 'fotos-capa-unidades');
