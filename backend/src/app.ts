import express from 'express';
import cors from 'cors';
import { env, isAuthConfigured, isGradingConfigured, isSttConfigured, isTtsConfigured } from './env.js';
import { evaluateRouter } from './routes/evaluate.js';
import { ttsRouter } from './routes/tts.js';
import { exerciseRouter } from './routes/exercise.js';

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
app.use('/api/exercise', exerciseRouter);

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

export default app;
