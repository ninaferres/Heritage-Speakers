-- Practice streaks: one row per (user, skill, day) they completed a practice session.
-- Run this once in the Supabase SQL editor (Project -> SQL Editor -> New query) for the
-- project backing SUPABASE_URL. Safe to re-run: every statement is idempotent.

create table if not exists public.practice_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  skill text not null,
  source text not null check (source in ('daily_practice', 'exam_mode')),
  completed_on date not null default (now() at time zone 'utc')::date,
  -- Points earned by this one completion (10 base + 2 per day of that skill's streak at the
  -- time), stored permanently so a later broken streak never claws back points already earned.
  points integer not null default 10,
  created_at timestamptz not null default now(),
  unique (user_id, skill, completed_on)
);

alter table public.practice_completions add column if not exists points integer not null default 10;

create index if not exists practice_completions_user_skill_idx
  on public.practice_completions (user_id, skill, completed_on);

alter table public.practice_completions enable row level security;

drop policy if exists "Users can insert their own completions" on public.practice_completions;
create policy "Users can insert their own completions"
  on public.practice_completions for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can read their own completions" on public.practice_completions;
create policy "Users can read their own completions"
  on public.practice_completions for select
  using (auth.uid() = user_id);
