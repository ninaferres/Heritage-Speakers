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

  // Azure Speech has genuine per-country neural Spanish voices (unlike Google, whose only
  // Latin American option is one generic es-US voice shared across every country), so MX/AR/CO
  // actually sound Mexican/Argentine/Colombian instead of all sharing one neutral accent.
  azureSpeechKey: optional('AZURE_SPEECH_KEY'),
  azureSpeechRegion: optional('AZURE_SPEECH_REGION') ?? 'eastus',
  // Simple shared-secret gate for reading submitted feedback (GET /api/feedback) — there's no
  // admin role in the app yet, so this is the lightweight phase-1 stand-in.
  feedbackAdminKey: optional('FEEDBACK_ADMIN_KEY'),

  resendApiKey: optional('RESEND_API_KEY'),
  resendFromEmail: optional('RESEND_FROM_EMAIL') ?? 'Heritage Speakers <onboarding@resend.dev>',

  azureVoices: {
    'es-ES': optional('AZURE_VOICE_ES') ?? 'es-ES-ElviraNeural',
    'es-MX': optional('AZURE_VOICE_MX') ?? 'es-MX-DaliaNeural',
    'es-AR': optional('AZURE_VOICE_AR') ?? 'es-AR-ElenaNeural',
    'es-CO': optional('AZURE_VOICE_CO') ?? 'es-CO-SalomeNeural',
    'ru-RU': optional('AZURE_VOICE_RU') ?? 'ru-RU-SvetlanaNeural',
    'ru-Moscow': optional('AZURE_VOICE_RU_MOSCOW') ?? 'ru-RU-DmitryNeural',
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
export const isTtsConfigured = Boolean(env.azureSpeechKey);
export const isResendConfigured = Boolean(env.resendApiKey);
