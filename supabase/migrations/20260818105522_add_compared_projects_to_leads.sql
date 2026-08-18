alter table public.leads
  add column if not exists compared_projects text[];

alter table public.leads
  drop constraint if exists leads_compared_projects_limit;

alter table public.leads
  add constraint leads_compared_projects_limit
  check (compared_projects is null or cardinality(compared_projects) <= 3);

grant insert (compared_projects) on table public.leads to anon, authenticated;

comment on column public.leads.compared_projects is
  'Names of up to three projects selected in the website comparison tool.';
