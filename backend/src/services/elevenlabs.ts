import { env, isTtsConfigured } from '../env.js';

export class TtsNotConfiguredError extends Error {
  constructor(detail?: string) {
    super(detail ?? 'Text-to-speech is not configured on the server yet (missing ELEVENLABS_API_KEY or a voice ID for this accent).');
    this.name = 'TtsNotConfiguredError';
  }
}

/** Synthesizes Spanish audio in a specific regional accent via ElevenLabs, for Listening exercises. */
export async function synthesizeSpeech(text: string, accent: string): Promise<Buffer> {
  if (!isTtsConfigured) throw new TtsNotConfiguredError();

  const voiceId = env.elevenLabsVoices[accent];
  if (!voiceId) {
    throw new TtsNotConfiguredError(`No ElevenLabs voice ID configured for accent "${accent}". Set the matching ELEVENLABS_VOICE_* env var.`);
  }

  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      accept: 'audio/mpeg',
      'xi-api-key': env.elevenLabsApiKey!,
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: { stability: 0.45, similarity_boost: 0.8 },
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    console.error(`ElevenLabs TTS failed for accent "${accent}" with voice ID "${voiceId}":`, {
      status: res.status,
      statusText: res.statusText,
      detail,
    });
    throw new Error(`ElevenLabs TTS request failed (${res.status}): ${detail}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
