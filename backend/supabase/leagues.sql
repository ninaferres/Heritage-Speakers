-- Friend leagues: join-by-code groups with a weekly leaderboard, built on top of the points
-- already recorded in practice_completions (see practice_streaks.sql, run that one first).
-- Run this once in the Supabase SQL editor. Safe to re-run: every statement is idempotent.

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
