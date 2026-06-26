create table if not exists public.input_output_workshop_signups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  wechat text not null,
  email text,
  city text,
  role text,
  stage text,
  current_system text,
  main_challenge text not null,
  desired_output text,
  expectation text,
  cohort text not null default 'pilot-2026-07',
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'refunded', 'waived')),
  status text not null default 'submitted' check (status in ('submitted', 'contacted', 'confirmed', 'waitlisted', 'cancelled')),
  source text not null default 'sunling.github.io/zh/input-output-workshop.html',
  user_agent text,
  created_at timestamptz not null default now()
);

alter table public.input_output_workshop_signups enable row level security;

drop policy if exists "input_output_workshop_signups_insert_authenticated" on public.input_output_workshop_signups;
drop policy if exists "input_output_workshop_signups_public_insert" on public.input_output_workshop_signups;
drop policy if exists "input_output_workshop_signups_insert_anon" on public.input_output_workshop_signups;

create policy "input_output_workshop_signups_insert_anon"
  on public.input_output_workshop_signups
  for insert
  to anon
  with check (
    cohort = 'pilot-2026-07'
    and payment_status = 'pending'
    and status = 'submitted'
  );

create index if not exists idx_input_output_workshop_signups_created_at
  on public.input_output_workshop_signups (created_at desc);

create index if not exists idx_input_output_workshop_signups_cohort_status
  on public.input_output_workshop_signups (cohort, status);
