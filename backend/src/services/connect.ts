import { createClient } from '@supabase/supabase-js';
import { env, isAuthConfigured } from '../env.js';

export class ConnectNotConfiguredError extends Error {
  constructor() {
    super('Connect is not configured on the server yet (missing SUPABASE_URL / SUPABASE_ANON_KEY).');
    this.name = 'ConnectNotConfiguredError';
  }
}

// Every request builds its own client carrying the caller's JWT, so row-level security
// (auth.uid() = user_id) enforces per-user isolation — no service-role key needed, same pattern
// as practiceStreaks.ts and gamification.ts.
function userClient(token: string) {
  if (!isAuthConfigured) throw new ConnectNotConfiguredError();
  return createClient(env.supabaseUrl!, env.supabaseAnonKey!, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
}

export type ConnectAvailabilityBlock = 'morning' | 'afternoon' | 'evening';
export interface ConnectAvailability {
  weekday: ConnectAvailabilityBlock[];
  weekend: ConnectAvailabilityBlock[];
}

export interface ConnectProfile {
  bio: string | null;
  nativeLanguages: string[];
  learningLanguages: string[];
  timezone: string | null;
  availability: ConnectAvailability;
}

const EMPTY_AVAILABILITY: ConnectAvailability = { weekday: [], weekend: [] };

function fromRow(row: any): ConnectProfile {
  return {
    bio: row?.bio ?? null,
    nativeLanguages: row?.native_languages ?? [],
    learningLanguages: row?.learning_languages ?? [],
    timezone: row?.timezone ?? null,
    availability: row?.availability ?? EMPTY_AVAILABILITY,
  };
}

/** Returns this user's Connect profile, or sensible empty defaults if they haven't set one up yet. */
export async function getConnectProfile(token: string, userId: string): Promise<ConnectProfile> {
  const client = userClient(token);
  const { data, error } = await client.from('connect_profiles').select('*').eq('user_id', userId).maybeSingle();
  if (error) throw new Error(`Failed to load Connect profile: ${error.message}`);
  return fromRow(data);
}

export interface ConnectProfileInput {
  bio?: string;
  nativeLanguages?: string[];
  learningLanguages?: string[];
  timezone?: string;
  availability?: ConnectAvailability;
}

/** Creates or updates this user's Connect profile. Only the fields provided are changed. */
export async function upsertConnectProfile(token: string, userId: string, input: ConnectProfileInput): Promise<ConnectProfile> {
  const client = userClient(token);
  const patch: Record<string, unknown> = { user_id: userId, updated_at: new Date().toISOString() };
  if (input.bio !== undefined) patch.bio = input.bio;
  if (input.nativeLanguages !== undefined) patch.native_languages = input.nativeLanguages;
  if (input.learningLanguages !== undefined) patch.learning_languages = input.learningLanguages;
  if (input.timezone !== undefined) patch.timezone = input.timezone;
  if (input.availability !== undefined) patch.availability = input.availability;

  const { data, error } = await client.from('connect_profiles').upsert(patch, { onConflict: 'user_id' }).select().single();
  if (error) throw new Error(`Failed to save Connect profile: ${error.message}`);
  return fromRow(data);
}

/** Sum of this user's Connect credit ledger — earn/spend rows are permanent, never rewritten. */
export async function getConnectCredits(token: string, userId: string): Promise<number> {
  const client = userClient(token);
  const { data, error } = await client.from('connect_credit_transactions').select('amount').eq('user_id', userId);
  if (error) throw new Error(`Failed to load Connect credits: ${error.message}`);
  return (data ?? []).reduce((sum, row) => sum + (row.amount as number), 0);
}

/** This user's shareable invite code, generating one on first use. */
export async function getConnectReferralCode(token: string): Promise<string> {
  const client = userClient(token);
  const { data, error } = await client.rpc('get_or_create_connect_referral_code');
  if (error) throw new Error(`Failed to load referral code: ${error.message}`);
  return data as string;
}
