import { env, isTtsConfigured } from '../env.js';

export class TtsNotConfiguredError extends Error {
  constructor(detail?: string) {
    super(detail ?? 'Text-to-speech is not configured on the server yet (missing AZURE_SPEECH_KEY/AZURE_SPEECH_REGION or a voice for this accent).');
    this.name = 'TtsNotConfiguredError';
  }
}

// Azure issues short-lived access tokens from the subscription key; cache it for
// its ~10 minute lifetime instead of round-tripping on every synthesis call.
let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) return cachedToken.token;
  const res = await fetch(`https://${env.azureSpeechRegion}.api.cognitive.microsoft.com/sts/v1.0/issueToken`, {
    method: 'POST',
    headers: { 'Ocp-Apim-Subscription-Key': env.azureSpeechKey! },
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Azure Speech token request failed (${res.status}): ${detail}`);
  }
  const token = await res.text();
  cachedToken = { token, expiresAt: Date.now() + 9 * 60 * 1000 };
  return token;
}

function escapeSsml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function languageCodeFromVoice(voiceName: string): string {
  const parts = voiceName.split('-');
  return parts.slice(0, 2).join('-');
}

export async function synthesizeSpeech(text: string, accent: string): Promise<Buffer> {
  if (!isTtsConfigured) throw new TtsNotConfiguredError();
  const voiceName = env.azureVoices[accent];
  if (!voiceName) {
    throw new TtsNotConfiguredError(`No Azure TTS voice configured for accent "${accent}". Set the matching AZURE_VOICE_* env var.`);
  }
  const token = await getAccessToken();
  const ssml = `<speak version='1.0' xml:lang='${languageCodeFromVoice(voiceName)}'><voice name='${voiceName}'>${escapeSsml(text)}</voice></speak>`;

  const res = await fetch(`https://${env.azureSpeechRegion}.tts.speech.microsoft.com/cognitiveservices/v1`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/ssml+xml',
      'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
      'User-Agent': 'heritage-speakers-app',
    },
    body: ssml,
  });
  if (!res.ok) {
    const detail = await res.text();
    console.error(`Azure TTS failed for accent "${accent}" with voice "${voiceName}":`, { status: res.status, detail });
    throw new Error(`Azure TTS request failed (${res.status}): ${detail}`);
  }
  return Buffer.from(await res.arrayBuffer());
}
