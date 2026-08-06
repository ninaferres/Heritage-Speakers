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

// Use Web Speech API for text-to-speech (free, no server required)
export function synthesizeSpeech(params: { text: string; accent: AccentId; lang?: 'es' | 'ru' }): { play: () => void; stop: () => void; isSupported: boolean } {
  const isSupported = 'speechSynthesis' in window;

  // Determine language from accent if not explicitly provided
  const language = params.lang || (params.accent.startsWith('ru') ? 'ru' : 'es');
  const langCode = language === 'ru' ? 'ru-RU' : 'es-ES';

  return {
    isSupported,
    play() {
      if (!isSupported) {
        console.error('Speech Synthesis API not supported in this browser');
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(params.text);
      utterance.lang = langCode;
      utterance.rate = 0.9;
      utterance.pitch = 1;

      // Select voice based on accent (best-effort fallback)
      const voices = window.speechSynthesis.getVoices();
      const accentMap: Record<AccentId, string[]> = {
        'es-ES': ['Spanish', 'Castilian'],
        'es-MX': ['Mexican', 'Spanish - Mexico'],
        'es-AR': ['Argentinian', 'Spanish - Argentina'],
        'es-CO': ['Colombian', 'Spanish - Colombia'],
        'ru-RU': ['Russian', 'Russkiy'],
        'ru-Moscow': ['Russian', 'Russkiy', 'Moscow'],
      };

      const preferredVoiceNames = accentMap[params.accent] || (language === 'ru' ? ['Russian'] : ['Spanish']);
      const langPrefix = language === 'ru' ? 'ru' : 'es';
      const voice = voices.find((v) => preferredVoiceNames.some((name) => v.name.includes(name))) || voices.find((v) => v.lang.startsWith(langPrefix));
      if (voice) utterance.voice = voice;

      window.speechSynthesis.speak(utterance);
    },
    stop() {
      if (isSupported) window.speechSynthesis.cancel();
    },
  };
}
