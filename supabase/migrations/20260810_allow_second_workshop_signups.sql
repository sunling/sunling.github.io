drop policy if exists "input_output_workshop_signups_insert_anon"
  on public.input_output_workshop_signups;

create policy "input_output_workshop_signups_insert_anon"
  on public.input_output_workshop_signups
  for insert
  to anon
  with check (
    cohort in ('pilot-2026-07', 'second-2026-08')
    and payment_status = 'pending'
    and status = 'submitted'
  );
