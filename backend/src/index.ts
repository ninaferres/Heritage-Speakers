import express from 'express';
import cors from 'cors';
import { env, isAuthConfigured, isGradingConfigured, isSttConfigured, isTtsConfigured } from './env.js';
import { evaluateRouter } from './routes/evaluate.js';
import { ttsRouter } from './routes/tts.js';

const app = express();
app.use(cors({ origin: env.corsOrigin }));
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    auth: isAuthConfigured,
    grading: isGradingConfigured,
    stt: isSttConfigured,
    tts: isTtsConfigured,
  });
});

app.use('/api/evaluate', evaluateRouter);
app.use('/api/tts', ttsRouter);

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(env.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Heritage Speakers API listening on port ${env.port}`);
  if (!isAuthConfigured) console.warn('⚠ Supabase auth not configured — protected routes will return 503.');
  if (!isGradingConfigured) console.warn('⚠ AI grading not configured — evaluation routes will return 503.');
  if (!isSttConfigured) console.warn('⚠ Whisper STT not configured — speaking evaluation will return 503.');
  if (!isTtsConfigured) console.warn('⚠ ElevenLabs TTS not configured — listening audio will return 503.');
});
