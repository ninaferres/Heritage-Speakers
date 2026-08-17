import express from 'express';
import cors from 'cors';
import { env, isAuthConfigured, isGradingConfigured, isSttConfigured, isTtsConfigured, isResendConfigured } from './env.js';
import { evaluateRouter } from './routes/evaluate.js';
import { ttsRouter } from './routes/tts.js';
import { exerciseRouter } from './routes/exercise.js';
import { microLessonRouter } from './routes/microLesson.js';
import { feedbackRouter } from './routes/feedback.js';
import { welcomeEmailRouter } from './routes/welcomeEmail.js';

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
    resend: isResendConfigured,
  });
});

app.use('/api/evaluate', evaluateRouter);
app.use('/api/tts', ttsRouter);
app.use('/api/exercise', exerciseRouter);
app.use('/api/micro-lesson', microLessonRouter);
app.use('/api/feedback', feedbackRouter);
app.use('/api/welcome-email', welcomeEmailRouter);

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

export default app;
