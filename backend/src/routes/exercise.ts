import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
import { getDailyExercise } from '../services/exerciseGenerator.js';

const querySchema = z.object({
  skill: z.enum(['Speaking', 'Reading', 'Listening', 'Writing']),
  level: z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']),
  language: z.enum(['es', 'ru']),
});

export const exerciseRouter = Router();
exerciseRouter.use(requireAuth);

exerciseRouter.get('/', async (req, res) => {
  const parsed = querySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid query params', details: parsed.error.flatten() });
    return;
  }
  try {
    const exercise = await getDailyExercise(parsed.data.skill, parsed.data.level, parsed.data.language);
    res.json(exercise);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error generating exercise.';
    const notConfigured = err instanceof Error && err.name.endsWith('NotConfiguredError');
    res.status(notConfigured ? 503 : 502).json({ error: message });
  }
});
