alter table public.workshop_feedback
  alter column source set default 'workshops.bysunling.com/workshop-feedback.html';

alter table public.workshop_feedback
  drop constraint if exists workshop_feedback_source_check;

alter table public.workshop_feedback
  add constraint workshop_feedback_source_check check (
    source in (
      'bysunling.com/workshop-feedback.html',
      'workshops.bysunling.com/workshop-feedback.html'
    )
  );

drop policy if exists "workshop_feedback_insert_anon" on public.workshop_feedback;
create policy "workshop_feedback_insert_anon"
  on public.workshop_feedback
  for insert
  to anon
  with check (
    cohort = 'second-2026-08'
    and feedback_version = 1
    and source in (
      'bysunling.com/workshop-feedback.html',
      'workshops.bysunling.com/workshop-feedback.html'
    )
  );
