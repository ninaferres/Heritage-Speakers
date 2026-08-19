-- ============================================================================
-- Heritage Speakers — full database setup, in one script.
--
-- HOW TO RUN: Supabase dashboard -> SQL Editor -> New query -> paste all of
-- this -> Run. Do it on the project backing SUPABASE_URL.
--
-- This is the concatenation of practice_streaks.sql, leagues.sql and
-- feedback.sql, in dependency order (leagues reads practice_completions, so
-- that table has to exist first). Every statement is idempotent, so running
-- the whole thing again is safe and changes nothing.
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
