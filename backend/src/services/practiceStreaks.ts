import { createClient } from '@supabase/supabase-js';
import { env, isAuthConfigured } from '../env.js';

export class StreaksNotConfiguredError extends Error {
  constructor() {
    super('Streak tracking is not configured on the server yet (missing SUPABASE_URL / SUPABASE_ANON_KEY).');
    this.name = 'StreaksNotConfiguredError';
  }
}

export type CompletionSource = 'daily_practice' | 'exam_mode';

export interface SkillStreak {
  current: number;
  longest: number;
  lastCompletedOn: string | null;
}

// Every request builds its own client carrying the caller's JWT, so row-level security
// (auth.uid() = user_id) enforces per-user isolation — no service-role key needed.
function userClient(token: string) {
  if (!isAuthConfigured) throw new StreaksNotConfiguredError();
  return createClient(env.supabaseUrl!, env.supabaseAnonKey!, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
}

const BASE_POINTS = 10;
const POINTS_PER_STREAK_DAY = 2;

/**
 * Records that this user completed a practice session for this skill today (no-op if already
 * recorded today). Awards points now, permanently, based on the streak this completion extends —
 * so a streak broken later never claws back points already earned for it.
 */
export async function recordCompletion(token: string, userId: string, skill: string, source: CompletionSource): Promise<void> {
  const client = userClient(token);
  const todayStr = new Date().toISOString().slice(0, 10);

  const { data: recent, error: recentError } = await client
    .from('practice_completions')
    .select('completed_on')
    .eq('user_id', userId)
    .eq('skill', skill)
    .order('completed_on', { ascending: false })
    .limit(1);
  if (recentError) throw new Error(`Failed to check existing streak: ${recentError.message}`);

  const lastCompletedOn = recent?.[0]?.completed_on as string | undefined;
  const continuesStreak = lastCompletedOn ? daysBetween(lastCompletedOn, todayStr) === 1 : false;
  // We don't know the streak length before today without a second query, but 1 (fresh) vs.
  // "continuing" is what matters for the bonus shape — a flat per-day bonus recomputed from
  // getStreaks() would double-count, so this awards a fixed continuation bonus per completion.
  const points = BASE_POINTS + (continuesStreak ? POINTS_PER_STREAK_DAY : 0);

  const { error } = await client
    .from('practice_completions')
    .upsert({ user_id: userId, skill, source, completed_on: todayStr, points }, { onConflict: 'user_id,skill,completed_on', ignoreDuplicates: true });
  if (error) throw new Error(`Failed to record practice completion: ${error.message}`);
}

function computeStreak(datesAsc: string[]): SkillStreak {
  if (datesAsc.length === 0) return { current: 0, longest: 0, lastCompletedOn: null };

  let longest = 1;
  let run = 1;
  for (let i = 1; i < datesAsc.length; i++) {
    const diffDays = daysBetween(datesAsc[i - 1], datesAsc[i]);
    run = diffDays === 1 ? run + 1 : 1;
    longest = Math.max(longest, run);
  }

  const lastCompletedOn = datesAsc[datesAsc.length - 1];
  const todayStr = new Date().toISOString().slice(0, 10);
  const diffFromToday = daysBetween(lastCompletedOn, todayStr);

  // Streak is still "alive" if the last completion was today or yesterday — otherwise it's broken.
  let current = 0;
  if (diffFromToday <= 1) {
    current = 1;
    for (let i = datesAsc.length - 1; i > 0; i--) {
      if (daysBetween(datesAsc[i - 1], datesAsc[i]) === 1) current += 1;
      else break;
    }
  }

  return { current, longest, lastCompletedOn };
}

function daysBetween(fromIso: string, toIso: string): number {
  const from = new Date(`${fromIso}T00:00:00Z`).getTime();
  const to = new Date(`${toIso}T00:00:00Z`).getTime();
  return Math.round((to - from) / 86_400_000);
}

/** Returns each skill's current/longest streak for this user, keyed by skill name. */
export async function getStreaks(token: string, userId: string): Promise<Record<string, SkillStreak>> {
  const client = userClient(token);
  const { data, error } = await client
    .from('practice_completions')
    .select('skill, completed_on')
    .eq('user_id', userId)
    .order('completed_on', { ascending: true });
  if (error) throw new Error(`Failed to load streaks: ${error.message}`);

  const bySkill = new Map<string, string[]>();
  for (const row of data ?? []) {
    const dates = bySkill.get(row.skill) ?? [];
    dates.push(row.completed_on as string);
    bySkill.set(row.skill, dates);
  }

  const result: Record<string, SkillStreak> = {};
  for (const [skill, dates] of bySkill) {
    result[skill] = computeStreak(dates);
  }
  return result;
}
