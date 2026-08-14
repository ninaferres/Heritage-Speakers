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

function normalizeLearningLanguage(lang?: string | null): 'es' | 'ru' {
  return lang === 'ru' ? 'ru' : 'es';
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
export async function fetchDailyMicroLesson(skill: ClassSkill, learningLanguage: string, uiLanguage: string): Promise<MicroLesson> {
  const query = new URLSearchParams({
    skill,
    learningLanguage: learningLanguage === 'ru' ? 'ru' : 'es',
    uiLanguage: uiLanguage === 'es' ? 'es' : 'en',
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

// Use Azure Speech via backend for high-quality speech synthesis
export async function synthesizeSpeechTTS(params: { text: string; accent: AccentId }): Promise<Blob> {
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

