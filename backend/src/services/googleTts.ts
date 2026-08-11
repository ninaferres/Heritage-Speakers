import { env, isTtsConfigured } from '../env.js';

export class TtsNotConfiguredError extends Error {
  constructor(detail?: string) {
    super(detail ?? 'Text-to-speech is not configured on the server yet (missing GOOGLE_TTS_API_KEY or a voice for this accent).');
    this.name = 'TtsNotConfiguredError';
  }
}

/** Derives the Google TTS languageCode from a voice name, e.g. "es-ES-Neural2-A" -> "es-ES". */
function languageCodeFromVoice(voiceName: string): string {
  const parts = voiceName.split('-');
  return parts.slice(0, 2).join('-');
}

/** Synthesizes speech via Google Cloud Text-to-Speech, for Listening exercises. */
export async function synthesizeSpeech(text: string, accent: string): Promise<Buffer> {
  if (!isTtsConfigured) throw new TtsNotConfiguredError();

  const voiceName = env.googleTtsVoices[accent];
  if (!voiceName) {
    throw new TtsNotConfiguredError(`No Google TTS voice configured for accent "${accent}". Set the matching GOOGLE_TTS_VOICE_* env var.`);
  }

  const res = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${env.googleTtsApiKey}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      input: { text },
      voice: { languageCode: languageCodeFromVoice(voiceName), name: voiceName },
      audioConfig: { audioEncoding: 'MP3' },
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    console.error(`Google TTS failed for accent "${accent}" with voice "${voiceName}":`, { status: res.status, detail });
    throw new Error(`Google TTS request failed (${res.status}): ${detail}`);
  }

  const data = (await res.json()) as { audioContent: string };
  return Buffer.from(data.audioContent, 'base64');
}
