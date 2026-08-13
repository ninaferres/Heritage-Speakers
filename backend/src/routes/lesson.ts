import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
import { getDailyLesson } from '../services/lessonGenerator.js';

const querySchema = z.object({
  learningLanguage: z.enum(['es', 'ru']),
  uiLanguage: z.enum(['en', 'es']),
});

export const lessonRouter = Router();
lessonRouter.use(requireAuth);

lessonRouter.get('/', async (req, res) => {
  const parsed = querySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid query params', details: parsed.error.flatten() });
    return;
  }
  try {
    const lesson = await getDailyLesson(parsed.data.learningLanguage, parsed.data.uiLanguage);
    res.json(lesson);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error generating lesson.';
    const notConfigured = err instanceof Error && err.name.endsWith('NotConfiguredError');
    res.status(notConfigured ? 503 : 502).json({ error: message });
  }
});
