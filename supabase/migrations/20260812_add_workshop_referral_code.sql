alter table public.input_output_workshop_signups
  add column if not exists referral_code text;

alter table public.input_output_workshop_signups
  drop constraint if exists input_output_workshop_signups_referral_code_format;

alter table public.input_output_workshop_signups
  add constraint input_output_workshop_signups_referral_code_format
  check (
    referral_code is null
    or referral_code ~ '^[a-z0-9][a-z0-9_-]{0,63}$'
  );

create index if not exists idx_input_output_workshop_signups_referral
  on public.input_output_workshop_signups (cohort, referral_code, payment_status)
  where referral_code is not null;
