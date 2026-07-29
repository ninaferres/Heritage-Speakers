import { supabase } from '../lib/supabaseClient';
import { CefrLevel, ExerciseQuestion, AccentId } from '../data/types';
import { ComprehensionEvaluation, ProductionEvaluation } from '../data/feedback';

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) || '/api';

async function authHeaders(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
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
}): Promise<ProductionEvaluation> {
  return postJson('/evaluate/writing', params);
}

export async function evaluateReading(params: {
  level: CefrLevel;
  passage: string;
  questions: ExerciseQuestion[];
  answers: string[];
}): Promise<ComprehensionEvaluation> {
  return postJson('/evaluate/reading', params);
}

export async function evaluateListening(params: {
  level: CefrLevel;
  transcript: string;
  questions: ExerciseQuestion[];
  answers: string[];
}): Promise<ComprehensionEvaluation> {
  return postJson('/evaluate/listening', params);
}

export async function evaluateSpeaking(params: {
  level: CefrLevel;
  prompt: string;
  audioBlob: Blob;
}): Promise<ProductionEvaluation> {
  const form = new FormData();
  form.append('level', params.level);
  form.append('prompt', params.prompt);
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

export async function synthesizeSpeech(params: { text: string; accent: AccentId }): Promise<Blob> {
  const res = await fetch(`${API_BASE}/tts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(await authHeaders()) },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const detail = await res.json().catch(() => ({}));
    throw new Error(detail.error || `TTS request failed (${res.status})`);
  }
  return res.blob();
}
