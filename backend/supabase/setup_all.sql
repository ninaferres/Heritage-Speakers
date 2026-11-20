-- ============================================================================
-- Heritage Speakers — full database setup, in one script.
--
-- HOW TO RUN: Supabase dashboard -> SQL Editor -> New query -> paste all of
-- this -> Run. Do it on the project backing SUPABASE_URL.
--
-- This is the concatenation of practice_streaks.sql, leagues.sql, feedback.sql
-- and connect.sql, in dependency order (leagues reads practice_completions, so
-- that table has to exist first). Every statement is idempotent, so running
-- the whole thing again is safe and changes nothing — including re-running it
-- after it already included an earlier subset of these files.
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 1/3 — Practice streaks
-- One row per (user, skill, day) they completed a practice session.
-- ----------------------------------------------------------------------------

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


-- ----------------------------------------------------------------------------
-- 2/3 — Friend leagues
-- Join-by-code groups with a weekly leaderboard, built on top of the points
-- recorded in practice_completions above.
-- ----------------------------------------------------------------------------

create table if not exists public.leagues (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  owner_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.league_members (
  league_id uuid not null references public.leagues(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  display_name text not null,
  joined_at timestamptz not null default now(),
  primary key (league_id, user_id)
);

alter table public.leagues enable row level security;
alter table public.league_members enable row level security;

-- Direct table access covers the simple, always-safe cases (see your own memberships, see the
-- leagues those memberships point to). Creating a league, joining by code, and reading the
-- leaderboard all go through the SECURITY DEFINER functions below instead, since those need to
-- either write two tables atomically or read rows belonging to other members.

drop policy if exists "Members can read their leagues" on public.leagues;
create policy "Members can read their leagues"
  on public.leagues for select
  using (exists (select 1 from public.league_members m where m.league_id = leagues.id and m.user_id = auth.uid()));

drop policy if exists "Members can read their memberships" on public.league_members;
create policy "Members can read their memberships"
  on public.league_members for select
  using (
    user_id = auth.uid()
    or exists (select 1 from public.league_members mine where mine.league_id = league_members.league_id and mine.user_id = auth.uid())
  );

-- Generates a short, human-shareable join code, e.g. "K3F9QZ".
create or replace function public.generate_league_code()
returns text
language sql
volatile
as $$
  select upper(substr(md5(random()::text || clock_timestamp()::text), 1, 6));
$$;

create or replace function public.create_league(p_name text, p_display_name text)
returns table (league_id uuid, code text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_code text := public.generate_league_code();
begin
  insert into public.leagues (code, name, owner_id) values (v_code, p_name, auth.uid()) returning id into v_id;
  insert into public.league_members (league_id, user_id, display_name) values (v_id, auth.uid(), p_display_name);
  return query select v_id, v_code;
end;
$$;

create or replace function public.join_league_by_code(p_code text, p_display_name text)
returns table (league_id uuid, league_name text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_name text;
begin
  select id, name into v_id, v_name from public.leagues where code = upper(p_code);
  if v_id is null then
    raise exception 'League not found for code %', p_code;
  end if;

  insert into public.league_members (league_id, user_id, display_name)
  values (v_id, auth.uid(), p_display_name)
  on conflict (league_id, user_id) do update set display_name = excluded.display_name;

  return query select v_id, v_name;
end;
$$;

-- Weekly points reset "for free": rather than a cron job that zeroes a counter, this just sums
-- practice_completions.points from the current UTC week onward, so the leaderboard is always live.
create or replace function public.get_league_leaderboard(p_league_id uuid)
returns table (user_id uuid, display_name text, weekly_points bigint, total_points bigint)
language sql
security definer
set search_path = public
as $$
  select
    m.user_id,
    m.display_name,
    coalesce(sum(pc.points) filter (
      where pc.completed_on >= date_trunc('week', now() at time zone 'utc')::date
    ), 0) as weekly_points,
    coalesce((select sum(points) from public.practice_completions t where t.user_id = m.user_id), 0) as total_points
  from public.league_members m
  left join public.practice_completions pc on pc.user_id = m.user_id
  where m.league_id = p_league_id
    and exists (select 1 from public.league_members me where me.league_id = p_league_id and me.user_id = auth.uid())
  group by m.user_id, m.display_name
  order by weekly_points desc, total_points desc;
$$;


-- ----------------------------------------------------------------------------
-- 3/3 — Feedback mailbox
-- Durable replacement for the local JSON file the server used to write to
-- (which was wiped on every redeploy, since Render's disk is ephemeral).
-- ----------------------------------------------------------------------------

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


-- ============================================================================
-- Connect — native-speaker <-> learner conversation exchange (credits, no money).
-- Concatenation of connect.sql, appended here so this stays the one script to run.
-- ============================================================================

-- Connect: native-speaker <-> learner conversation exchange, paid for in credits (never money).
-- Run this once in the Supabase SQL editor, after setup_all.sql. Safe to re-run: every
-- statement is idempotent.
--
-- This creates the FULL schema (all tables) up front so later phases never need risky ALTERs
-- on tables already holding data. Phase 1 wired up connect_profiles, connect_credit_transactions
-- and connect_referrals. Phase 2 (this update) adds native-language verification and
-- matching/booking. Still to come: the session room (Jitsi + text chat), no-show handling,
-- flags/reports/blocks enforcement, and analytics.

-- ----------------------------------------------------------------------------
-- 1. Profiles — bio, which languages someone teaches/learns here, availability + timezone.
-- ----------------------------------------------------------------------------

create table if not exists public.connect_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  bio text,
  -- CEFR-agnostic on purpose: Connect is about conversation, not graded exercises.
  native_languages text[] not null default '{}',
  learning_languages text[] not null default '{}',
  -- IANA zone (e.g. "Europe/Madrid"), captured from the browser — never store/display raw UTC
  -- or the viewer's own zone for someone else's availability.
  timezone text,
  -- {"mon": [9, 14], "tue": [...], ...} — a recurring weekly template, one entry per day of
  -- week, each value an hour (0-23) marking the start of an available 1-hour slot in the
  -- user's OWN timezone (the one stored above). 1 hour is the minimum granularity on purpose.
  availability jsonb not null default '{"mon": [], "tue": [], "wed": [], "thu": [], "fri": [], "sat": [], "sun": []}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.connect_profiles enable row level security;

drop policy if exists "Users can read their own connect profile" on public.connect_profiles;
create policy "Users can read their own connect profile"
  on public.connect_profiles for select
  using (auth.uid() = user_id);

drop policy if exists "Users can upsert their own connect profile" on public.connect_profiles;
create policy "Users can upsert their own connect profile"
  on public.connect_profiles for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own connect profile" on public.connect_profiles;
create policy "Users can update their own connect profile"
  on public.connect_profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- ----------------------------------------------------------------------------
-- 2. Sessions — the core booking record. Created here (schema only) so later tables can
-- reference it; booking/matching logic itself comes in a later phase.
-- ----------------------------------------------------------------------------

create table if not exists public.connect_sessions (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references auth.users(id) on delete cascade,
  native_speaker_id uuid not null references auth.users(id) on delete cascade,
  language text not null,
  mode text not null default 'audio' check (mode in ('audio', 'text')),
  scheduled_at timestamptz not null,
  duration_minutes_planned integer not null default 15,
  status text not null default 'scheduled'
    check (status in ('scheduled', 'completed', 'abandoned_early', 'no_show_learner', 'no_show_native', 'cancelled')),
  started_at timestamptz,
  ended_at timestamptz,
  actual_duration_seconds integer,
  extension_count integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists connect_sessions_learner_idx on public.connect_sessions (learner_id, scheduled_at);
create index if not exists connect_sessions_native_idx on public.connect_sessions (native_speaker_id, scheduled_at);

alter table public.connect_sessions enable row level security;

drop policy if exists "Participants can read their sessions" on public.connect_sessions;
create policy "Participants can read their sessions"
  on public.connect_sessions for select
  using (auth.uid() = learner_id or auth.uid() = native_speaker_id);


-- ----------------------------------------------------------------------------
-- 3. Credits — append-only ledger (same spirit as practice_completions.points: every earn/spend
-- is stored permanently, balance is just the sum, nothing is ever clawed back by rewriting history).
-- No direct insert policy for the plain authenticated role: crediting only happens through
-- trusted server-side paths (a future SECURITY DEFINER booking/completion function), never by a
-- user writing their own row, which would let anyone grant themselves credits.
-- ----------------------------------------------------------------------------

create table if not exists public.connect_credit_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount integer not null,
  reason text not null check (reason in ('taught_session', 'booked_session', 'referral_bonus', 'admin_adjustment')),
  session_id uuid references public.connect_sessions(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists connect_credit_transactions_user_idx on public.connect_credit_transactions (user_id);

alter table public.connect_credit_transactions enable row level security;

drop policy if exists "Users can read their own credit history" on public.connect_credit_transactions;
create policy "Users can read their own credit history"
  on public.connect_credit_transactions for select
  using (auth.uid() = user_id);


-- ----------------------------------------------------------------------------
-- 4. Native-language verification — a short recorded clip + a (for now mocked) automatic
-- language-identification result, as a first filter before anyone can list a language as native.
-- ----------------------------------------------------------------------------

create table if not exists public.connect_language_verifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  language text not null,
  audio_path text,
  lid_result jsonb,
  status text not null default 'pending' check (status in ('pending', 'verified', 'rejected', 'flagged_for_review')),
  flag_count integer not null default 0,
  created_at timestamptz not null default now(),
  unique (user_id, language)
);

alter table public.connect_language_verifications enable row level security;

drop policy if exists "Users can read their own verifications" on public.connect_language_verifications;
create policy "Users can read their own verifications"
  on public.connect_language_verifications for select
  using (auth.uid() = user_id);

drop policy if exists "Users can submit their own verifications" on public.connect_language_verifications;
create policy "Users can submit their own verifications"
  on public.connect_language_verifications for insert
  with check (auth.uid() = user_id);


-- ----------------------------------------------------------------------------
-- 5. Post-session quality flags — soft signal, only ever leads to flagging for manual review,
-- never an automatic sanction.
-- ----------------------------------------------------------------------------

create table if not exists public.connect_session_flags (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.connect_sessions(id) on delete cascade,
  flagged_by uuid not null references auth.users(id) on delete cascade,
  flagged_user_id uuid not null references auth.users(id) on delete cascade,
  reason text not null check (reason in ('not_native', 'not_helpful', 'other')),
  note text,
  created_at timestamptz not null default now()
);

alter table public.connect_session_flags enable row level security;

drop policy if exists "Users can read flags they filed" on public.connect_session_flags;
create policy "Users can read flags they filed"
  on public.connect_session_flags for select
  using (auth.uid() = flagged_by);

drop policy if exists "Users can file flags on their sessions" on public.connect_session_flags;
create policy "Users can file flags on their sessions"
  on public.connect_session_flags for insert
  with check (
    auth.uid() = flagged_by
    and exists (
      select 1 from public.connect_sessions s
      where s.id = session_id and (s.learner_id = auth.uid() or s.native_speaker_id = auth.uid())
    )
  );


-- ----------------------------------------------------------------------------
-- 6. Moderation reports — data capture only for now, no review panel yet. Not publicly
-- readable (own report history stays visible to the reporter; reviewing everyone's reports
-- will go through a service-role-key admin path later, same pattern as the feedback mailbox).
-- ----------------------------------------------------------------------------

create table if not exists public.connect_reports (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.connect_sessions(id) on delete set null,
  reporter_id uuid not null references auth.users(id) on delete cascade,
  reported_user_id uuid not null references auth.users(id) on delete cascade,
  reason text not null,
  details text,
  status text not null default 'open' check (status in ('open', 'reviewed')),
  created_at timestamptz not null default now()
);

alter table public.connect_reports enable row level security;

drop policy if exists "Users can read reports they filed" on public.connect_reports;
create policy "Users can read reports they filed"
  on public.connect_reports for select
  using (auth.uid() = reporter_id);

drop policy if exists "Users can file reports" on public.connect_reports;
create policy "Users can file reports"
  on public.connect_reports for insert
  with check (auth.uid() = reporter_id);


-- ----------------------------------------------------------------------------
-- 7. Blocks — one-way; matching/booking logic (later phase) must check both directions.
-- ----------------------------------------------------------------------------

create table if not exists public.connect_blocks (
  user_id uuid not null references auth.users(id) on delete cascade,
  blocked_user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, blocked_user_id)
);

alter table public.connect_blocks enable row level security;

drop policy if exists "Users can read their own blocks" on public.connect_blocks;
create policy "Users can read their own blocks"
  on public.connect_blocks for select
  using (auth.uid() = user_id);

drop policy if exists "Users can create their own blocks" on public.connect_blocks;
create policy "Users can create their own blocks"
  on public.connect_blocks for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can remove their own blocks" on public.connect_blocks;
create policy "Users can remove their own blocks"
  on public.connect_blocks for delete
  using (auth.uid() = user_id);


-- ----------------------------------------------------------------------------
-- 8. Suspensions — Connect-only penalty, never touches the rest of the app. A user is
-- currently suspended if any row has now() between starts_at and ends_at, or ends_at is null
-- (permanent). Written only by trusted server-side logic (no insert policy for plain users).
-- ----------------------------------------------------------------------------

create table if not exists public.connect_suspensions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  reason text not null check (reason in ('no_show_pattern', 'report', 'manual')),
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists connect_suspensions_user_idx on public.connect_suspensions (user_id);

alter table public.connect_suspensions enable row level security;

drop policy if exists "Users can read their own suspensions" on public.connect_suspensions;
create policy "Users can read their own suspensions"
  on public.connect_suspensions for select
  using (auth.uid() = user_id);


-- ----------------------------------------------------------------------------
-- 9. Referrals — invite-a-friend. One row per invite; reward_granted_at is set once, the first
-- time the invitee completes any Connect session, by a trusted server-side path (not directly
-- user-writable).
-- ----------------------------------------------------------------------------

create table if not exists public.connect_referrals (
  id uuid primary key default gen_random_uuid(),
  inviter_id uuid not null references auth.users(id) on delete cascade,
  code text not null unique,
  invitee_id uuid references auth.users(id) on delete set null,
  reward_granted_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.connect_referrals enable row level security;

drop policy if exists "Users can read their own referral rows" on public.connect_referrals;
create policy "Users can read their own referral rows"
  on public.connect_referrals for select
  using (auth.uid() = inviter_id or auth.uid() = invitee_id);

-- Generates a short, human-shareable invite code, e.g. "7F3KQZ91".
create or replace function public.generate_connect_referral_code()
returns text
language sql
volatile
as $$
  select upper(substr(md5(random()::text || clock_timestamp()::text), 1, 8));
$$;

-- Returns the caller's existing referral code, creating one first if they don't have it yet.
-- SECURITY DEFINER only to make the "create if missing" race-free in one atomic call; it still
-- only ever acts as auth.uid(), never on anyone else's behalf.
create or replace function public.get_or_create_connect_referral_code()
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_code text;
begin
  select code into v_code from public.connect_referrals where inviter_id = auth.uid() limit 1;
  if v_code is not null then
    return v_code;
  end if;

  v_code := public.generate_connect_referral_code();
  insert into public.connect_referrals (inviter_id, code) values (auth.uid(), v_code);
  return v_code;
end;
$$;


-- ----------------------------------------------------------------------------
-- 10. Messages — the lighter text-chat alternative to an audio/video call, for a given session.
-- ----------------------------------------------------------------------------

create table if not exists public.connect_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.connect_sessions(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists connect_messages_session_idx on public.connect_messages (session_id, created_at);

alter table public.connect_messages enable row level security;

drop policy if exists "Participants can read session messages" on public.connect_messages;
create policy "Participants can read session messages"
  on public.connect_messages for select
  using (
    exists (
      select 1 from public.connect_sessions s
      where s.id = session_id and (s.learner_id = auth.uid() or s.native_speaker_id = auth.uid())
    )
  );

drop policy if exists "Participants can send session messages" on public.connect_messages;
create policy "Participants can send session messages"
  on public.connect_messages for insert
  with check (
    auth.uid() = sender_id
    and exists (
      select 1 from public.connect_sessions s
      where s.id = session_id and (s.learner_id = auth.uid() or s.native_speaker_id = auth.uid())
    )
  );


-- ----------------------------------------------------------------------------
-- 11. Phase 2 — native-language verification storage + matching/booking.
-- ----------------------------------------------------------------------------

-- Private bucket for the 15-20s native-speaker verification clips. Each file lives under
-- "<user_id>/...", and the policies below only let a user read/write their own folder.
insert into storage.buckets (id, name, public)
values ('connect-verification-clips', 'connect-verification-clips', false)
on conflict (id) do nothing;

drop policy if exists "Users can upload their own verification clips" on storage.objects;
create policy "Users can upload their own verification clips"
  on storage.objects for insert
  with check (
    bucket_id = 'connect-verification-clips'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can read their own verification clips" on storage.objects;
create policy "Users can read their own verification clips"
  on storage.objects for select
  using (
    bucket_id = 'connect-verification-clips'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Widen the credit ledger's allowed reasons to cover a booking being cancelled (refunds the
-- learner's spent credit as a new row, never by rewriting the original debit).
alter table public.connect_credit_transactions drop constraint if exists connect_credit_transactions_reason_check;
alter table public.connect_credit_transactions add constraint connect_credit_transactions_reason_check
  check (reason in ('taught_session', 'booked_session', 'referral_bonus', 'admin_adjustment', 'session_cancelled'));

-- Attendance reliability: % of this user's past sessions (as either learner or native speaker)
-- where they actually showed up, counting only sessions that have actually run their course
-- (scheduled/cancelled sessions don't count either way yet). Null with sessions_count = 0 means
-- "no history yet" — the frontend shows that as "new to Connect", never a fabricated 100%.
create or replace function public.get_connect_reliability(p_user_id uuid)
returns table (reliability_pct numeric, sessions_count bigint)
language sql
stable
security definer
set search_path = public
as $$
  with mine as (
    select
      case
        when learner_id = p_user_id then status <> 'no_show_learner'
        else status <> 'no_show_native'
      end as showed_up
    from public.connect_sessions
    where (learner_id = p_user_id or native_speaker_id = p_user_id)
      and status in ('completed', 'abandoned_early', 'no_show_learner', 'no_show_native')
  )
  select
    case when count(*) = 0 then null else round(100.0 * count(*) filter (where showed_up) / count(*), 0) end,
    count(*)
  from mine;
$$;

-- Candidate native speakers for a language the caller wants to practice: excludes the caller
-- themselves, anyone blocked in either direction, and anyone currently suspended from Connect.
-- SECURITY DEFINER because connect_profiles' own RLS only lets a user read their own row —
-- browsing other people's profiles has to go through a controlled, filtered path like this one
-- rather than a broadened blanket SELECT policy.
create or replace function public.get_connect_matches(p_language text)
returns table (
  user_id uuid,
  bio text,
  timezone text,
  availability jsonb,
  reliability_pct numeric,
  sessions_count bigint
)
language sql
stable
security definer
set search_path = public
as $$
  select p.user_id, p.bio, p.timezone, p.availability, r.reliability_pct, r.sessions_count
  from public.connect_profiles p
  cross join lateral public.get_connect_reliability(p.user_id) r
  where p.user_id <> auth.uid()
    and p_language = any(p.native_languages)
    and not exists (
      select 1 from public.connect_blocks b
      where (b.user_id = p.user_id and b.blocked_user_id = auth.uid())
         or (b.user_id = auth.uid() and b.blocked_user_id = p.user_id)
    )
    and not exists (
      select 1 from public.connect_suspensions s
      where s.user_id = p.user_id and s.starts_at <= now() and (s.ends_at is null or s.ends_at > now())
    )
  order by r.reliability_pct desc nulls last;
$$;

-- Books a session atomically: checks the learner has enough credits for the chosen duration,
-- neither side has blocked the other, and the native speaker isn't suspended — then creates the
-- session and debits the learner in the same transaction. Pricing is 1 credit per 10 minutes
-- (10 min = 1 credit, 20 min = 2, 30 min = 3 — the hard cap, so a default booking never reads as
-- "an hour" to either side). The native speaker is credited the same amount later, when the
-- session is actually marked completed (a later phase), never at booking time.
create or replace function public.book_connect_session(
  p_native_speaker_id uuid,
  p_language text,
  p_scheduled_at timestamptz,
  p_mode text default 'audio',
  p_duration_minutes integer default 10
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_balance integer;
  v_credits_needed integer;
  v_session_id uuid;
begin
  if p_duration_minutes not in (10, 20, 30) then
    raise exception 'Duration must be 10, 20 or 30 minutes.';
  end if;
  v_credits_needed := p_duration_minutes / 10;

  if p_native_speaker_id = auth.uid() then
    raise exception 'You cannot book a session with yourself.';
  end if;

  select coalesce(sum(amount), 0) into v_balance from public.connect_credit_transactions where user_id = auth.uid();
  if v_balance < v_credits_needed then
    raise exception 'Not enough credits for a % minute session (needs %, you have %).', p_duration_minutes, v_credits_needed, v_balance;
  end if;

  if exists (
    select 1 from public.connect_blocks
    where (user_id = auth.uid() and blocked_user_id = p_native_speaker_id)
       or (user_id = p_native_speaker_id and blocked_user_id = auth.uid())
  ) then
    raise exception 'Booking is not available between these two users.';
  end if;

  if exists (
    select 1 from public.connect_suspensions
    where user_id = p_native_speaker_id and starts_at <= now() and (ends_at is null or ends_at > now())
  ) then
    raise exception 'This native speaker is currently unavailable on Connect.';
  end if;

  insert into public.connect_sessions (learner_id, native_speaker_id, language, mode, scheduled_at, duration_minutes_planned)
  values (auth.uid(), p_native_speaker_id, p_language, p_mode, p_scheduled_at, p_duration_minutes)
  returning id into v_session_id;

  insert into public.connect_credit_transactions (user_id, amount, reason, session_id)
  values (auth.uid(), -v_credits_needed, 'booked_session', v_session_id);

  return v_session_id;
end;
$$;

-- Cancels a still-scheduled session (either party may do it) and refunds the learner the exact
-- amount originally debited for it (read back from the ledger, never assumed to be a flat 1 —
-- pricing is duration-dependent).
create or replace function public.cancel_connect_session(p_session_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_learner_id uuid;
  v_status text;
  v_is_participant boolean;
  v_spent integer;
begin
  select learner_id, status, (learner_id = auth.uid() or native_speaker_id = auth.uid())
    into v_learner_id, v_status, v_is_participant
    from public.connect_sessions where id = p_session_id;

  if v_learner_id is null then
    raise exception 'Session not found.';
  end if;
  if not v_is_participant then
    raise exception 'Not your session.';
  end if;
  if v_status <> 'scheduled' then
    raise exception 'Only a scheduled session can be cancelled.';
  end if;

  select coalesce(-sum(amount), 0) into v_spent
    from public.connect_credit_transactions
    where session_id = p_session_id and reason = 'booked_session';

  update public.connect_sessions set status = 'cancelled' where id = p_session_id;

  insert into public.connect_credit_transactions (user_id, amount, reason, session_id)
  values (v_learner_id, v_spent, 'session_cancelled', p_session_id);
end;
$$;


-- ----------------------------------------------------------------------------
-- 12. Redeeming a friend's invite code — the other half of "invite a friend", alongside
-- get_or_create_connect_referral_code() above. The actual +1 credit for the inviter is granted
-- later, when the invitee completes their first Connect session (a later phase); this just
-- records the link so that future check can find it.
-- ----------------------------------------------------------------------------

create or replace function public.redeem_connect_referral_code(p_code text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_inviter_id uuid;
  v_row_id uuid;
begin
  select id, inviter_id into v_row_id, v_inviter_id
    from public.connect_referrals
    where code = upper(p_code) and invitee_id is null
    limit 1;

  if v_row_id is null then
    raise exception 'Invalid or already-used invite code.';
  end if;

  if v_inviter_id = auth.uid() then
    raise exception 'You cannot use your own invite code.';
  end if;

  if exists (select 1 from public.connect_referrals where invitee_id = auth.uid()) then
    raise exception 'You have already used an invite code.';
  end if;

  update public.connect_referrals set invitee_id = auth.uid() where id = v_row_id;
end;
$$;
