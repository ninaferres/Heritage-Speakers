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

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Plain text fed straight to Neural2 tends to come out clipped and sing-songy — it has no cues
// for where a real speaker would pause. Inserting short breaks at line breaks (speaker turns in
// dialogues), sentence ends, and commas gives it a more natural, less robotic cadence.
function toSsml(text: string): string {
  const body = escapeXml(text)
    .replace(/\n+/g, '<break time="450ms"/> ')
    .replace(/([.!?])(\s+|$)/g, '$1<break time="350ms"/> ')
    .replace(/,(\s+)/g, ',<break time="150ms"/> ');
  return `<speak>${body}</speak>`;
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
      input: { ssml: toSsml(text) },
      voice: { languageCode: languageCodeFromVoice(voiceName), name: voiceName },
      // Slightly slower than default (1.0) reads as calmer and more natural on Neural2 —
      // at normal speed it tends to rush and over-emphasize pitch swings.
      audioConfig: { audioEncoding: 'MP3', speakingRate: 0.93 },
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
