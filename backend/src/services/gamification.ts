import { createClient } from '@supabase/supabase-js';
import { env, isAuthConfigured } from '../env.js';

export class GamificationNotConfiguredError extends Error {
  constructor() {
    super('Profile/leagues are not configured on the server yet (missing SUPABASE_URL / SUPABASE_ANON_KEY).');
    this.name = 'GamificationNotConfiguredError';
  }
}

function userClient(token: string) {
  if (!isAuthConfigured) throw new GamificationNotConfiguredError();
  return createClient(env.supabaseUrl!, env.supabaseAnonKey!, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
}

// Points needed to REACH each level (index 0 = level 1, always 0). Gaps widen so early levels
// come quickly (positive feedback while the habit is forming) and later ones take real commitment.
const LEVEL_THRESHOLDS = [0, 60, 150, 300, 500, 800, 1200, 1700, 2400, 3300, 4500, 6000];
const LEVEL_STEP_BEYOND_LAST = 2000;

export interface LevelProgress {
  level: number;
  totalPoints: number;
  pointsForCurrentLevel: number;
  pointsForNextLevel: number | null;
}

export function computeLevelProgress(totalPoints: number): LevelProgress {
  let level = 1;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (totalPoints >= LEVEL_THRESHOLDS[i]) level = i + 1;
    else break;
  }

  const pointsForCurrentLevel = level <= LEVEL_THRESHOLDS.length ? LEVEL_THRESHOLDS[level - 1] : LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1] + (level - LEVEL_THRESHOLDS.length) * LEVEL_STEP_BEYOND_LAST;
  const pointsForNextLevel = level < LEVEL_THRESHOLDS.length ? LEVEL_THRESHOLDS[level] : pointsForCurrentLevel + LEVEL_STEP_BEYOND_LAST;

  return { level, totalPoints, pointsForCurrentLevel, pointsForNextLevel };
}

export async function getTotalPoints(token: string, userId: string): Promise<number> {
  const client = userClient(token);
  const { data, error } = await client.from('practice_completions').select('points').eq('user_id', userId);
  if (error) throw new Error(`Failed to load points: ${error.message}`);
  return (data ?? []).reduce((sum, row) => sum + (row.points as number), 0);
}

export interface League {
  id: string;
  code: string;
  name: string;
}

export async function createLeague(token: string, name: string, displayName: string): Promise<League> {
  const client = userClient(token);
  const { data, error } = await client.rpc('create_league', { p_name: name, p_display_name: displayName });
  if (error) throw new Error(`Failed to create league: ${error.message}`);
  const row = data?.[0];
  if (!row) throw new Error('League creation returned no data.');
  return { id: row.league_id, code: row.code, name };
}

export async function joinLeague(token: string, code: string, displayName: string): Promise<League> {
  const client = userClient(token);
  const { data, error } = await client.rpc('join_league_by_code', { p_code: code, p_display_name: displayName });
  if (error) throw new Error(`Failed to join league: ${error.message}`);
  const row = data?.[0];
  if (!row) throw new Error('League not found for that code.');
  return { id: row.league_id, code: code.toUpperCase(), name: row.league_name };
}

export async function getMyLeagues(token: string, userId: string): Promise<League[]> {
  const client = userClient(token);
  const { data, error } = await client
    .from('league_members')
    .select('league_id, leagues(id, code, name)')
    .eq('user_id', userId);
  if (error) throw new Error(`Failed to load leagues: ${error.message}`);
  return (data ?? [])
    .map((row: any) => row.leagues)
    .filter(Boolean)
    .map((l: any) => ({ id: l.id, code: l.code, name: l.name }));
}

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  weeklyPoints: number;
  totalPoints: number;
  level: number;
}

export async function getLeaderboard(token: string, leagueId: string): Promise<LeaderboardEntry[]> {
  const client = userClient(token);
  const { data, error } = await client.rpc('get_league_leaderboard', { p_league_id: leagueId });
  if (error) throw new Error(`Failed to load leaderboard: ${error.message}`);
  return (data ?? []).map((row: any) => ({
    userId: row.user_id,
    displayName: row.display_name,
    weeklyPoints: Number(row.weekly_points),
    totalPoints: Number(row.total_points),
    level: computeLevelProgress(Number(row.total_points)).level,
  }));
}
