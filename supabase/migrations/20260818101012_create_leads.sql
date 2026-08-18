create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 100),
  phone text not null check (char_length(phone) between 10 and 16),
  email text check (email is null or char_length(email) <= 254),
  message text check (message is null or char_length(message) <= 1000),
  project_name text,
  project_slug text,
  source_page text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  referrer text,
  status text not null default 'new'
    check (status in ('new', 'contacted', 'qualified', 'closed', 'spam')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists leads_created_at_idx
  on public.leads (created_at desc);

create index if not exists leads_status_created_at_idx
  on public.leads (status, created_at desc);

create or replace function public.set_leads_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke execute on function public.set_leads_updated_at() from public;

drop trigger if exists set_leads_updated_at on public.leads;
create trigger set_leads_updated_at
before update on public.leads
for each row execute function public.set_leads_updated_at();

alter table public.leads enable row level security;

revoke all on table public.leads from anon, authenticated;
grant insert (
  name,
  phone,
  email,
  message,
  project_name,
  project_slug,
  source_page,
  utm_source,
  utm_medium,
  utm_campaign,
  utm_term,
  utm_content,
  referrer
) on table public.leads to anon, authenticated;
grant all on table public.leads to service_role;

drop policy if exists "Visitors can submit enquiries" on public.leads;
create policy "Visitors can submit enquiries"
on public.leads
for insert
to anon, authenticated
with check (status = 'new');

comment on table public.leads is
  'Property enquiries submitted through the A&G website.';
