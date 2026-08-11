import 'dotenv/config';

function optional(name: string): string | undefined {
  const v = process.env[name];
  return v && v.length > 0 ? v : undefined;
}

export const env = {
  port: Number(optional('PORT') ?? 8787),
  corsOrigin: optional('CORS_ORIGIN') ?? 'http://localhost:5173',

  supabaseUrl: optional('SUPABASE_URL'),
  supabaseAnonKey: optional('SUPABASE_ANON_KEY'),

  aiProvider: (optional('AI_PROVIDER') ?? 'groq') as 'anthropic' | 'openai' | 'groq',
  anthropicApiKey: optional('ANTHROPIC_API_KEY'),
  anthropicModel: optional('ANTHROPIC_MODEL') ?? 'claude-sonnet-5',
  openaiApiKey: optional('OPENAI_API_KEY'),
  openaiModel: optional('OPENAI_MODEL') ?? 'gpt-4o',
  groqApiKey: optional('GROQ_API_KEY'),
  groqModel: optional('GROQ_MODEL') ?? 'llama-3.3-70b-versatile',

  googleTtsApiKey: optional('GOOGLE_TTS_API_KEY'),
  googleTtsVoices: {
    // Defaults use Google's Chirp3-HD tier (still within the free monthly quota, same bucket
    // as Neural2/Studio) for a noticeably less robotic, more natural sound than Neural2/Wavenet.
    // Google doesn't offer distinct per-country Latin American Spanish voices the way ElevenLabs
    // did, so MX/AR/CO share the same generic es-US voice by default until region-specific ones
    // are confirmed and set via env vars.
    'es-ES': optional('GOOGLE_TTS_VOICE_ES') ?? 'es-ES-Chirp3-HD-Kore',
    'es-MX': optional('GOOGLE_TTS_VOICE_MX') ?? 'es-US-Chirp3-HD-Aoede',
    'es-AR': optional('GOOGLE_TTS_VOICE_AR') ?? 'es-US-Chirp3-HD-Aoede',
    'es-CO': optional('GOOGLE_TTS_VOICE_CO') ?? 'es-US-Chirp3-HD-Aoede',
    'ru-RU': optional('GOOGLE_TTS_VOICE_RU') ?? 'ru-RU-Chirp3-HD-Charon',
    'ru-Moscow': optional('GOOGLE_TTS_VOICE_RU_MOSCOW') ?? 'ru-RU-Chirp3-HD-Kore',
  } as Record<string, string | undefined>,
};

export const isAuthConfigured = Boolean(env.supabaseUrl && env.supabaseAnonKey);
export const isGradingConfigured =
  env.aiProvider === 'anthropic'
    ? Boolean(env.anthropicApiKey)
    : env.aiProvider === 'openai'
      ? Boolean(env.openaiApiKey)
      : Boolean(env.groqApiKey);
export const isSttConfigured = Boolean(env.groqApiKey || env.openaiApiKey);
export const isTtsConfigured = Boolean(env.googleTtsApiKey);
