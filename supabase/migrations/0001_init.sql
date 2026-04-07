-- 0001_init.sql
-- Foundation migration. Multi-tenant from day one.
-- Every table has tenant_id. RLS enabled. Policies enforce tenant isolation
-- via app.tenant_id, which is set per-request from the authenticated context.

create extension if not exists "pgcrypto";

-- =============================================================================
-- tenants
-- =============================================================================
create table tenants (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  name text not null,
  created_at timestamptz not null default now()
);

alter table tenants enable row level security;

create policy tenants_select on tenants
  for select
  using (tenant_id = current_setting('app.tenant_id')::uuid);

create policy tenants_insert on tenants
  for insert
  with check (tenant_id = current_setting('app.tenant_id')::uuid);

create policy tenants_update on tenants
  for update
  using (tenant_id = current_setting('app.tenant_id')::uuid)
  with check (tenant_id = current_setting('app.tenant_id')::uuid);

create policy tenants_delete on tenants
  for delete
  using (tenant_id = current_setting('app.tenant_id')::uuid);

-- =============================================================================
-- roadmap_items
-- =============================================================================
create table roadmap_items (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  title text not null,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

alter table roadmap_items enable row level security;

create policy roadmap_items_select on roadmap_items
  for select
  using (tenant_id = current_setting('app.tenant_id')::uuid);

create policy roadmap_items_insert on roadmap_items
  for insert
  with check (tenant_id = current_setting('app.tenant_id')::uuid);

create policy roadmap_items_update on roadmap_items
  for update
  using (tenant_id = current_setting('app.tenant_id')::uuid)
  with check (tenant_id = current_setting('app.tenant_id')::uuid);

create policy roadmap_items_delete on roadmap_items
  for delete
  using (tenant_id = current_setting('app.tenant_id')::uuid);
