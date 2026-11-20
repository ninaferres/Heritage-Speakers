import { createClient } from '@supabase/supabase-js';
import { env, isAuthConfigured } from '../env.js';
import { identifyLanguage } from './languageIdMock.js';

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

export type ConnectDayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';
// A recurring weekly template: available hours (0-23, each a 1-hour slot) per day of week, in
// the user's own timezone. 1 hour is the minimum granularity on purpose.
export type ConnectAvailability = Record<ConnectDayKey, number[]>;

export interface ConnectProfile {
  bio: string | null;
  nativeLanguages: string[];
  learningLanguages: string[];
  timezone: string | null;
  availability: ConnectAvailability;
}

const EMPTY_AVAILABILITY: ConnectAvailability = { mon: [], tue: [], wed: [], thu: [], fri: [], sat: [], sun: [] };

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

// ----------------------------------------------------------------------------
// Phase 2 — native-language verification + matching/booking.
// ----------------------------------------------------------------------------

export type VerificationStatus = 'pending' | 'verified' | 'rejected' | 'flagged_for_review';
export interface LanguageVerification {
  language: string;
  status: VerificationStatus;
}

const VERIFICATION_BUCKET = 'connect-verification-clips';
const LID_CONFIDENCE_THRESHOLD = 0.6;

/**
 * Uploads the recorded clip to private storage, runs it through the (mocked) language
 * identifier, and records the resulting status. Re-submitting for the same language replaces
 * the previous attempt (onConflict upsert) rather than accumulating duplicate rows.
 */
export async function submitLanguageVerification(
  token: string,
  userId: string,
  language: string,
  audioBuffer: Buffer,
  mimeType: string
): Promise<LanguageVerification> {
  const client = userClient(token);
  const path = `${userId}/${language}-${Date.now()}.webm`;

  const { error: uploadError } = await client.storage.from(VERIFICATION_BUCKET).upload(path, audioBuffer, { contentType: mimeType, upsert: true });
  if (uploadError) throw new Error(`Failed to upload verification clip: ${uploadError.message}`);

  const lid = await identifyLanguage(audioBuffer, language);
  const status: VerificationStatus = lid.detectedLanguage === language && lid.confidence >= LID_CONFIDENCE_THRESHOLD ? 'verified' : 'rejected';

  const { data, error } = await client
    .from('connect_language_verifications')
    .upsert({ user_id: userId, language, audio_path: path, lid_result: lid, status, flag_count: 0 }, { onConflict: 'user_id,language' })
    .select('language, status')
    .single();
  if (error) throw new Error(`Failed to save verification: ${error.message}`);
  return { language: data.language, status: data.status };
}

export async function getLanguageVerifications(token: string, userId: string): Promise<LanguageVerification[]> {
  const client = userClient(token);
  const { data, error } = await client.from('connect_language_verifications').select('language, status').eq('user_id', userId);
  if (error) throw new Error(`Failed to load verifications: ${error.message}`);
  return data ?? [];
}

export interface ConnectMatch {
  userId: string;
  bio: string | null;
  timezone: string | null;
  availability: ConnectAvailability;
  reliabilityPct: number | null;
  sessionsCount: number;
}

/** Candidate native speakers for a language, via the get_connect_matches SECURITY DEFINER RPC
 * (connect_profiles' own RLS only lets a user read their own row, so browsing goes through this
 * controlled, filtered path instead of a broadened SELECT policy). */
export async function getConnectMatches(token: string, language: string): Promise<ConnectMatch[]> {
  const client = userClient(token);
  const { data, error } = await client.rpc('get_connect_matches', { p_language: language });
  if (error) throw new Error(`Failed to load matches: ${error.message}`);
  return (data ?? []).map((row: any) => ({
    userId: row.user_id,
    bio: row.bio,
    timezone: row.timezone,
    availability: row.availability ?? EMPTY_AVAILABILITY,
    reliabilityPct: row.reliability_pct === null ? null : Number(row.reliability_pct),
    sessionsCount: Number(row.sessions_count),
  }));
}

export interface ConnectSession {
  id: string;
  learnerId: string;
  nativeSpeakerId: string;
  language: string;
  mode: 'audio' | 'text';
  scheduledAt: string;
  durationMinutesPlanned: number;
  status: string;
}

function sessionFromRow(row: any): ConnectSession {
  return {
    id: row.id,
    learnerId: row.learner_id,
    nativeSpeakerId: row.native_speaker_id,
    language: row.language,
    mode: row.mode,
    scheduledAt: row.scheduled_at,
    durationMinutesPlanned: row.duration_minutes_planned,
    status: row.status,
  };
}

export interface BookSessionInput {
  nativeSpeakerId: string;
  language: string;
  scheduledAt: string;
  mode?: 'audio' | 'text';
  /** 10, 20 or 30 — 1 credit per 10 minutes, 30 is the hard cap. */
  durationMinutes?: number;
}

/** Books a session (atomic credit check + debit) via the book_connect_session RPC. */
export async function bookConnectSession(token: string, input: BookSessionInput): Promise<ConnectSession> {
  const client = userClient(token);
  const { data: sessionId, error: rpcError } = await client.rpc('book_connect_session', {
    p_native_speaker_id: input.nativeSpeakerId,
    p_language: input.language,
    p_scheduled_at: input.scheduledAt,
    p_mode: input.mode ?? 'audio',
    p_duration_minutes: input.durationMinutes ?? 10,
  });
  if (rpcError) throw new Error(rpcError.message);

  const { data, error } = await client.from('connect_sessions').select('*').eq('id', sessionId).single();
  if (error) throw new Error(`Booked, but failed to load the session: ${error.message}`);
  return sessionFromRow(data);
}

/** This user's sessions (as learner or native speaker), most imminent first. */
export async function getMyConnectSessions(token: string, userId: string): Promise<ConnectSession[]> {
  const client = userClient(token);
  const { data, error } = await client
    .from('connect_sessions')
    .select('*')
    .or(`learner_id.eq.${userId},native_speaker_id.eq.${userId}`)
    .order('scheduled_at', { ascending: true });
  if (error) throw new Error(`Failed to load sessions: ${error.message}`);
  return (data ?? []).map(sessionFromRow);
}

/** Cancels a still-scheduled session and refunds the learner's credit, via the
 * cancel_connect_session RPC. */
export async function cancelConnectSession(token: string, sessionId: string): Promise<void> {
  const client = userClient(token);
  const { error } = await client.rpc('cancel_connect_session', { p_session_id: sessionId });
  if (error) throw new Error(error.message);
}
