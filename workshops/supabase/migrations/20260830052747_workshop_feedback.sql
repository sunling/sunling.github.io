create table if not exists public.workshop_feedback (
  id uuid primary key default gen_random_uuid(),
  cohort text not null default 'second-2026-08'
    check (cohort = 'second-2026-08'),
  feedback_version smallint not null default 1
    check (feedback_version = 1),
  attendance_modes text[] not null,
  incomplete_reasons text[] not null default '{}',
  incomplete_other text,
  expectation_score smallint
    check (expectation_score between 1 and 5),
  expectation_detail text,
  outcomes text[] not null,
  learning text,
  friction text,
  next_iteration text,
  follow_up boolean not null default false,
  contact text,
  quote_permission text not null default 'no'
    check (quote_permission in ('no', 'anonymous')),
  source text not null default 'bysunling.com/workshop-feedback.html'
    check (source = 'bysunling.com/workshop-feedback.html'),
  created_at timestamptz not null default now(),
  constraint workshop_feedback_attendance_values check (
    cardinality(attendance_modes) between 1 and 4
    and attendance_modes <@ array[
      'live_upper', 'live_lower', 'replay_upper', 'replay_lower', 'none'
    ]::text[]
    and (not ('none' = any(attendance_modes)) or cardinality(attendance_modes) = 1)
  ),
  constraint workshop_feedback_incomplete_reason_values check (
    incomplete_reasons <@ array[
      'time_conflict', 'forgot_or_interrupted', 'tool_threshold',
      'setup_incomplete', 'planned_replay', 'motivation_dropped', 'other'
    ]::text[]
  ),
  constraint workshop_feedback_outcome_values check (
    cardinality(outcomes) between 1 and 8
    and outcomes <@ array[
      'started_recording', 'connected_chatgpt_github',
      'connected_doubao_feishu', 'completed_review',
      'created_schedule', 'tried_bubble_breaker',
      'tried_personal_expression', 'understood_only', 'no_change'
    ]::text[]
    and (not ('no_change' = any(outcomes)) or cardinality(outcomes) = 1)
  ),
  constraint workshop_feedback_text_lengths check (
    coalesce(char_length(incomplete_other), 0) <= 1000
    and coalesce(char_length(expectation_detail), 0) <= 1500
    and coalesce(char_length(learning), 0) <= 2000
    and coalesce(char_length(friction), 0) <= 2000
    and coalesce(char_length(next_iteration), 0) <= 2000
    and coalesce(char_length(contact), 0) <= 200
  ),
  constraint workshop_feedback_has_reflection check (
    coalesce(char_length(btrim(learning)), 0)
      + coalesce(char_length(btrim(friction)), 0)
      + coalesce(char_length(btrim(next_iteration)), 0) > 0
  ),
  constraint workshop_feedback_follow_up_contact check (
    not follow_up or coalesce(char_length(btrim(contact)), 0) > 0
  )
);

alter table public.workshop_feedback enable row level security;

revoke all on table public.workshop_feedback from anon, authenticated;
grant insert on table public.workshop_feedback to anon;
grant all on table public.workshop_feedback to service_role;

drop policy if exists "workshop_feedback_insert_anon" on public.workshop_feedback;
create policy "workshop_feedback_insert_anon"
  on public.workshop_feedback
  for insert
  to anon
  with check (
    cohort = 'second-2026-08'
    and feedback_version = 1
    and source = 'bysunling.com/workshop-feedback.html'
  );

create index if not exists idx_workshop_feedback_cohort_created_at
  on public.workshop_feedback (cohort, created_at desc);
