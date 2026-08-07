import { env, isSttConfigured } from '../env.js';
import { ExerciseLanguage } from '../prompts/systemPrompts.js';

export class SttNotConfiguredError extends Error {
  constructor() {
    super('Speech-to-text is not configured on the server yet (missing GROQ_API_KEY or OPENAI_API_KEY).');
    this.name = 'SttNotConfiguredError';
  }
}

/** Transcribes a recorded answer with Whisper so it can be fed into the grading model. Prefers Groq (free tier) over OpenAI (paid). */
export async function transcribeAudio(buffer: Buffer, filename: string, mimeType: string, language: ExerciseLanguage = 'es'): Promise<string> {
  if (!isSttConfigured) throw new SttNotConfiguredError();
  if (env.groqApiKey) return transcribeWithGroq(buffer, filename, mimeType, language);
  return transcribeWithOpenAI(buffer, filename, mimeType, language);
}

async function transcribeWithGroq(buffer: Buffer, filename: string, mimeType: string, language: ExerciseLanguage): Promise<string> {
  const form = new FormData();
  form.append('file', new Blob([buffer], { type: mimeType }), filename);
  form.append('model', 'whisper-large-v3');
  form.append('language', language);

  const res = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
    method: 'POST',
    headers: { authorization: `Bearer ${env.groqApiKey}` },
    body: form,
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Groq Whisper transcription failed (${res.status}): ${detail}`);
  }

  const data = (await res.json()) as { text: string };
  return data.text;
}

async function transcribeWithOpenAI(buffer: Buffer, filename: string, mimeType: string, language: ExerciseLanguage): Promise<string> {
  const form = new FormData();
  form.append('file', new Blob([buffer], { type: mimeType }), filename);
  form.append('model', 'whisper-1');
  form.append('language', language);

  const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: { authorization: `Bearer ${env.openaiApiKey}` },
    body: form,
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`OpenAI Whisper transcription failed (${res.status}): ${detail}`);
  }

  const data = (await res.json()) as { text: string };
  return data.text;
}
