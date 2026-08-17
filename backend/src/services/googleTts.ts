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

// Chirp 3 HD is a fully generative voice model — unlike the older Neural2/Wavenet voices, it
// already paces and pauses like a real speaker on its own, and it only supports a small subset
// of SSML (<p>, <s>, <say-as>, <phoneme>, <sub> — notably not <break>). So instead of manually
// injecting <break> pauses, we just mark paragraph and sentence boundaries with <p>/<s> and let
// the model handle the actual rhythm.
function toSsml(text: string): string {
  const paragraphs = escapeXml(text)
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const body = paragraphs
    .map((para) => {
      const sentences = para
        .split(/(?<=[.!?])\s+/)
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => `<s>${s}</s>`)
        .join('');
      return `<p>${sentences}</p>`;
    })
    .join('');

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
      // Slightly slower than default (1.0) reads as calmer and more deliberate, matching a
      // teacher speaking clearly rather than a fast native pace.
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
