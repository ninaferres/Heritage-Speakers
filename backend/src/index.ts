import app from './app.js';
import { env, isAuthConfigured, isGradingConfigured, isSttConfigured, isTtsConfigured } from './env.js';

app.listen(env.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Heritage Speakers API listening on port ${env.port}`);
  if (!isAuthConfigured) console.warn('⚠ Supabase auth not configured — protected routes will return 503.');
  if (!isGradingConfigured) console.warn('⚠ AI grading not configured — evaluation routes will return 503.');
  if (!isSttConfigured) console.warn('⚠ Whisper STT not configured — speaking evaluation will return 503.');
  if (!isTtsConfigured) console.warn('⚠ Google TTS not configured — listening audio will return 503.');
});
