import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
import { getDailyMicroLesson } from '../services/microLessonGenerator.js';

const querySchema = z.object({
  skill: z.enum(['listening', 'reading', 'grammar_syntax', 'vocabulary']),
  learningLanguage: z.enum(['es', 'ru']),
  uiLanguage: z.enum(['en', 'es']),
});

export const microLessonRouter = Router();
microLessonRouter.use(requireAuth);

microLessonRouter.get('/', async (req, res) => {
  const parsed = querySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid query params', details: parsed.error.flatten() });
    return;
  }
  try {
    const lesson = await getDailyMicroLesson(parsed.data.skill, parsed.data.learningLanguage, parsed.data.uiLanguage);
    res.json(lesson);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error generating lesson.';
    const notConfigured = err instanceof Error && err.name.endsWith('NotConfiguredError');
    res.status(notConfigured ? 503 : 502).json({ error: message });
  }
});
