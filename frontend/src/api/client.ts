import { supabase } from '../lib/supabaseClient';
import { CefrLevel, ExerciseQuestion, AccentId, Exercise, SkillId } from '../data/types';
import { ComprehensionEvaluation, ProductionEvaluation } from '../data/feedback';
import { MicroLesson, ClassSkill } from '../data/microLessonTypes';

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) || '/api';

async function authHeaders(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function normalizeLearningLanguage(lang?: string | null): 'es' | 'ru' | 'en' {
  if (lang === 'ru') return 'ru';
  if (lang === 'en') return 'en';
  return 'es';
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(await authHeaders()) },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const detail = await res.json().catch(() => ({}));
    throw new Error(detail.error || `Request to ${path} failed (${res.status})`);
  }
  return res.json();
}

async function putJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...(await authHeaders()) },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const detail = await res.json().catch(() => ({}));
    throw new Error(detail.error || `Request to ${path} failed (${res.status})`);
  }
  return res.json();
}

export async function evaluateWriting(params: {
  level: CefrLevel;
  prompt: string;
  text: string;
  learningLanguage?: string | null;
}): Promise<ProductionEvaluation> {
  return postJson('/evaluate/writing', { ...params, learningLanguage: normalizeLearningLanguage(params.learningLanguage) });
}

export async function evaluateReading(params: {
  level: CefrLevel;
  passage: string;
  questions: ExerciseQuestion[];
  answers: string[];
  learningLanguage?: string | null;
}): Promise<ComprehensionEvaluation> {
  return postJson('/evaluate/reading', { ...params, learningLanguage: normalizeLearningLanguage(params.learningLanguage) });
}

export async function evaluateListening(params: {
  level: CefrLevel;
  transcript: string;
  questions: ExerciseQuestion[];
  answers: string[];
  learningLanguage?: string | null;
}): Promise<ComprehensionEvaluation> {
  return postJson('/evaluate/listening', { ...params, learningLanguage: normalizeLearningLanguage(params.learningLanguage) });
}

export async function evaluateSpeaking(params: {
  level: CefrLevel;
  prompt: string;
  audioBlob: Blob;
  learningLanguage?: string | null;
}): Promise<ProductionEvaluation> {
  const form = new FormData();
  form.append('level', params.level);
  form.append('prompt', params.prompt);
  form.append('learningLanguage', normalizeLearningLanguage(params.learningLanguage));
  form.append('audio', params.audioBlob, 'recording.webm');

  const res = await fetch(`${API_BASE}/evaluate/speaking`, {
    method: 'POST',
    headers: await authHeaders(),
    body: form,
  });
  if (!res.ok) {
    const detail = await res.json().catch(() => ({}));
    throw new Error(detail.error || `Speaking evaluation failed (${res.status})`);
  }
  return res.json();
}

// Fetches (or triggers server-side generation of) today's exercise for this skill/level/language.
// Callers should fall back to the static local exercise bank if this rejects.
export async function fetchDailyExercise(skill: SkillId, level: CefrLevel, language: string): Promise<Exercise> {
  const query = new URLSearchParams({ skill, level, language: language === 'ru' ? 'ru' : 'es' });
  const res = await fetch(`${API_BASE}/exercise?${query.toString()}`, {
    headers: await authHeaders(),
  });
  if (!res.ok) {
    const detail = await res.json().catch(() => ({}));
    throw new Error(detail.error || `Request to /exercise failed (${res.status})`);
  }
  return res.json();
}

// Fetches (or triggers server-side generation of) today's "Daily Practice" micro-lesson for
// one skill — an explicit tip + interactive drills, all built around one concept.
export async function fetchDailyMicroLesson(skill: ClassSkill, learningLanguage: string, uiLanguage: string, level: CefrLevel): Promise<MicroLesson> {
  const query = new URLSearchParams({
    skill,
    learningLanguage: learningLanguage === 'ru' ? 'ru' : 'es',
    uiLanguage: uiLanguage === 'es' ? 'es' : 'en',
    level,
  });
  const res = await fetch(`${API_BASE}/micro-lesson?${query.toString()}`, {
    headers: await authHeaders(),
  });
  if (!res.ok) {
    const detail = await res.json().catch(() => ({}));
    throw new Error(detail.error || `Request to /micro-lesson failed (${res.status})`);
  }
  return res.json();
}

// Best-effort — a failed welcome email should never block the sign-up flow itself.
export async function sendWelcomeEmail(uiLanguage: string): Promise<void> {
  await postJson('/welcome-email', { uiLanguage: uiLanguage === 'es' ? 'es' : 'en' });
}

export async function submitFeedback(params: {
  category: 'bug' | 'idea' | 'other';
  firstName: string;
  lastName: string;
  message: string;
  contactEmail: string;
  contactPhone: string;
  uiLanguage?: string;
  learningLanguage?: string | null;
  page?: string;
}): Promise<void> {
  await postJson('/feedback', {
    ...params,
    learningLanguage: params.learningLanguage ? normalizeLearningLanguage(params.learningLanguage) : undefined,
  });
}

export interface SkillStreak {
  current: number;
  longest: number;
  lastCompletedOn: string | null;
}

export interface ProfileData {
  level: number;
  totalPoints: number;
  pointsForCurrentLevel: number;
  pointsForNextLevel: number | null;
  streaks: Record<string, SkillStreak>;
}

export interface League {
  id: string;
  code: string;
  name: string;
}

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  weeklyPoints: number;
  totalPoints: number;
  level: number;
  isMe: boolean;
}

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { headers: await authHeaders() });
  if (!res.ok) {
    const detail = await res.json().catch(() => ({}));
    throw new Error(detail.error || `Request to ${path} failed (${res.status})`);
  }
  return res.json();
}

export async function fetchProfile(): Promise<ProfileData> {
  return getJson('/profile');
}

export async function fetchMyLeagues(): Promise<League[]> {
  return getJson('/leagues');
}

export async function createLeague(name: string, displayName: string): Promise<League> {
  return postJson('/leagues', { name, displayName });
}

export async function joinLeague(code: string, displayName: string): Promise<League> {
  return postJson('/leagues/join', { code, displayName });
}

export async function fetchLeaderboard(leagueId: string): Promise<LeaderboardEntry[]> {
  return getJson(`/leagues/${leagueId}/leaderboard`);
}

export async function recordPracticeCompletion(skill: string, source: 'daily_practice' | 'exam_mode'): Promise<void> {
  await postJson('/practice-completions', { skill, source });
}

export async function fetchStreaks(): Promise<Record<string, SkillStreak>> {
  return getJson('/practice-completions/streaks');
}

// Uses Google Cloud TTS via the backend. `level` lets the backend slow down for beginners and run
// closer to natural native pace for advanced levels, instead of one flat rate for everyone.
export async function synthesizeSpeechTTS(params: { text: string; accent: AccentId; level?: CefrLevel }): Promise<Blob> {
  try {
    const response = await fetch(`${API_BASE}/tts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(await authHeaders()) },
      body: JSON.stringify(params),
    });
    if (!response.ok) {
      const detail = await response.json().catch(() => ({}));
      const errorMsg = detail.error || `TTS request failed (${response.status})`;
      throw new Error(errorMsg);
    }
    return await response.blob();
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to generate audio';
    console.error('TTS Error:', message);
    throw new Error(message);
  }
}

export type ConnectDayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';
// A recurring weekly template: available hours (0-23, each a 1-hour slot) per day of week, in
// the user's own timezone. 1 hour is the minimum granularity on purpose.
export type ConnectAvailability = Record<ConnectDayKey, number[]>;

export type ConnectLanguage = 'es' | 'ru' | 'en';

export interface ConnectProfile {
  bio: string | null;
  nativeLanguages: ConnectLanguage[];
  learningLanguages: ConnectLanguage[];
  timezone: string | null;
  availability: ConnectAvailability;
}

export interface ConnectProfileInput {
  bio?: string;
  nativeLanguages?: ConnectLanguage[];
  learningLanguages?: ConnectLanguage[];
  timezone?: string;
  availability?: ConnectAvailability;
}

export async function fetchConnectProfile(): Promise<ConnectProfile> {
  return getJson('/connect/profile');
}

export async function saveConnectProfile(input: ConnectProfileInput): Promise<ConnectProfile> {
  return putJson('/connect/profile', input);
}

export async function fetchConnectCredits(): Promise<number> {
  const { credits } = await getJson<{ credits: number }>('/connect/credits');
  return credits;
}

export async function fetchConnectReferralCode(): Promise<{ code: string; redeemedByMe: boolean }> {
  return getJson('/connect/referral-code');
}

export async function redeemConnectReferralCode(code: string): Promise<void> {
  await postJson('/connect/redeem-referral', { code });
}

export type ConnectVerificationStatus = 'pending' | 'verified' | 'rejected' | 'flagged_for_review';
export interface ConnectLanguageVerification {
  language: ConnectLanguage;
  status: ConnectVerificationStatus;
}

export async function submitLanguageVerification(language: ConnectLanguage, audioBlob: Blob): Promise<ConnectLanguageVerification> {
  const form = new FormData();
  form.append('language', language);
  form.append('audio', audioBlob, 'verification.webm');

  const res = await fetch(`${API_BASE}/connect/verify-language`, {
    method: 'POST',
    headers: await authHeaders(),
    body: form,
  });
  if (!res.ok) {
    const detail = await res.json().catch(() => ({}));
    throw new Error(detail.error || `Verification upload failed (${res.status})`);
  }
  return res.json();
}

export async function fetchLanguageVerifications(): Promise<ConnectLanguageVerification[]> {
  return getJson('/connect/verifications');
}

export interface ConnectMatch {
  userId: string;
  bio: string | null;
  timezone: string | null;
  availability: ConnectAvailability;
  reliabilityPct: number | null;
  sessionsCount: number;
}

export async function fetchConnectMatches(language: ConnectLanguage): Promise<ConnectMatch[]> {
  return getJson(`/connect/matches?language=${language}`);
}

export interface ConnectSession {
  id: string;
  learnerId: string;
  nativeSpeakerId: string;
  language: ConnectLanguage;
  mode: 'audio' | 'text';
  scheduledAt: string;
  durationMinutesPlanned: number;
  status: string;
}

export interface BookConnectSessionInput {
  nativeSpeakerId: string;
  language: ConnectLanguage;
  scheduledAt: string;
  mode?: 'audio' | 'text';
  /** 10, 20 or 30 minutes — 1 credit per 10 minutes, 30 is the hard cap. */
  durationMinutes?: 10 | 20 | 30;
}

export async function bookConnectSession(input: BookConnectSessionInput): Promise<ConnectSession> {
  return postJson('/connect/sessions', input);
}

export async function fetchMyConnectSessions(): Promise<ConnectSession[]> {
  return getJson('/connect/sessions');
}

export async function cancelConnectSession(sessionId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/connect/sessions/${sessionId}/cancel`, {
    method: 'POST',
    headers: await authHeaders(),
  });
  if (!res.ok) {
    const detail = await res.json().catch(() => ({}));
    throw new Error(detail.error || `Request failed (${res.status})`);
  }
}

