import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
import { recordCompletion, getStreaks } from '../services/practiceStreaks.js';

const bodySchema = z.object({
  skill: z.string().min(1),
  source: z.enum(['daily_practice', 'exam_mode']),
});

export const practiceCompletionsRouter = Router();
practiceCompletionsRouter.use(requireAuth);

practiceCompletionsRouter.post('/', async (req, res) => {
  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid request body', details: parsed.error.flatten() });
    return;
  }
  try {
    await recordCompletion(req.accessToken!, req.userId!, parsed.data.skill.toLowerCase(), parsed.data.source);
    res.status(204).end();
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error recording practice completion.';
    const notConfigured = err instanceof Error && err.name === 'StreaksNotConfiguredError';
    res.status(notConfigured ? 503 : 502).json({ error: message });
  }
});

practiceCompletionsRouter.get('/streaks', async (req, res) => {
  try {
    const streaks = await getStreaks(req.accessToken!, req.userId!);
    res.json(streaks);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error loading streaks.';
    const notConfigured = err instanceof Error && err.name === 'StreaksNotConfiguredError';
    res.status(notConfigured ? 503 : 502).json({ error: message });
  }
});
