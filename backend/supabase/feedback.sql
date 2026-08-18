-- Feedback mailbox: durable replacement for the local JSON file the server used to write to
-- (which was wiped on every redeploy, since Render's disk is ephemeral). Run this once in the
-- Supabase SQL editor. Safe to re-run: every statement is idempotent.

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('bug', 'idea', 'other')),
  first_name text not null,
  last_name text not null,
  message text not null,
  contact_email text not null,
  contact_phone text not null,
  ui_language text,
  learning_language text,
  page text,
  created_at timestamptz not null default now()
);

alter table public.feedback enable row level security;

-- The form is open to everyone, logged in or not, so inserts aren't scoped to a user. Reading is
-- NOT exposed here on purpose — the feedback contains contact info (email/phone), and the anon
-- key is public/embeddable, so a public select policy would leak it to anyone. The admin listing
-- (GET /api/feedback) reads via the service-role key instead, gated by FEEDBACK_ADMIN_KEY at the
-- Express route level.
drop policy if exists "Anyone can submit feedback" on public.feedback;
create policy "Anyone can submit feedback"
  on public.feedback for insert
  with check (true);
