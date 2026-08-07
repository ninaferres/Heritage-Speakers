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

  elevenLabsApiKey: optional('ELEVENLABS_API_KEY'),
  elevenLabsVoices: {
    'es-ES': optional('ELEVENLABS_VOICE_ES'),
    'es-MX': optional('ELEVENLABS_VOICE_MX'),
    'es-AR': optional('ELEVENLABS_VOICE_AR'),
    'es-CO': optional('ELEVENLABS_VOICE_CO'),
    'ru-RU': optional('ELEVENLABS_VOICE_RU'),
    'ru-Moscow': optional('ELEVENLABS_VOICE_RU_MOSCOW'),
  } as Record<string, string | undefined>,
};

export const isAuthConfigured = Boolean(env.supabaseUrl && env.supabaseAnonKey);
export const isGradingConfigured =
  env.aiProvider === 'anthropic'
    ? Boolean(env.anthropicApiKey)
    : env.aiProvider === 'openai'
      ? Boolean(env.openaiApiKey)
      : Boolean(env.groqApiKey);
export const isSttConfigured = Boolean(env.openaiApiKey);
export const isTtsConfigured = Boolean(env.elevenLabsApiKey);
