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
  groqModel: optional('GROQ_MODEL') ?? 'openai/gpt-oss-120b',

  // Simple shared-secret gate for reading submitted feedback (GET /api/feedback) — there's no
  // admin role in the app yet, so this is the lightweight phase-1 stand-in.
  feedbackAdminKey: optional('FEEDBACK_ADMIN_KEY'),

  resendApiKey: optional('RESEND_API_KEY'),
  resendFromEmail: optional('RESEND_FROM_EMAIL') ?? 'Heritage Speakers <onboarding@resend.dev>',

  // Only two voices needed: Peninsular Spanish and one Russian voice — no per-country Latin
  // American rotation, since Google doesn't offer distinct MX/AR/CO voices (they'd all share
  // the same generic es-US model), so we don't pretend otherwise.
  googleTtsApiKey: optional('GOOGLE_TTS_API_KEY'),
  googleTtsVoices: {
    'es-ES': optional('GOOGLE_TTS_VOICE_ES') ?? 'es-ES-Neural2-A',
    'ru-RU': optional('GOOGLE_TTS_VOICE_RU') ?? 'ru-RU-Wavenet-A',
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
export const isResendConfigured = Boolean(env.resendApiKey);
