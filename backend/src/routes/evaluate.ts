import { Router } from 'express';
import multer from 'multer';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
import { gradeListening, gradeReading, gradeSpeaking, gradeWriting } from '../services/grading.js';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024 } });

const cefrLevel = z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']);
const exerciseLanguage = z.enum(['es', 'ru']).default('es');
const question = z.object({ question: z.string(), hint: z.string().optional() }).passthrough();

const writingSchema = z.object({ level: cefrLevel, prompt: z.string(), text: z.string().min(1), learningLanguage: exerciseLanguage });
const comprehensionSchema = z.object({
  level: cefrLevel,
  passage: z.string().optional(),
  transcript: z.string().optional(),
  questions: z.array(question).min(1),
  answers: z.array(z.string()).min(1),
  learningLanguage: exerciseLanguage,
});

export const evaluateRouter = Router();
evaluateRouter.use(requireAuth);

evaluateRouter.post('/writing', async (req, res) => {
  const parsed = writingSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid request body', details: parsed.error.flatten() });
    return;
  }
  try {
    const result = await gradeWriting(parsed.data.level, parsed.data.prompt, parsed.data.text, parsed.data.learningLanguage);
    res.json(result);
  } catch (err) {
    handleGradingError(res, err);
  }
});

evaluateRouter.post('/reading', async (req, res) => {
  const parsed = comprehensionSchema.safeParse(req.body);
  if (!parsed.success || !parsed.data.passage) {
    res.status(400).json({ error: 'Invalid request body: passage is required for reading evaluation.' });
    return;
  }
  try {
    const result = await gradeReading(parsed.data.level, parsed.data.passage, parsed.data.questions, parsed.data.answers, parsed.data.learningLanguage);
    res.json(result);
  } catch (err) {
    handleGradingError(res, err);
  }
});

evaluateRouter.post('/listening', async (req, res) => {
  const parsed = comprehensionSchema.safeParse(req.body);
  if (!parsed.success || !parsed.data.transcript) {
    res.status(400).json({ error: 'Invalid request body: transcript is required for listening evaluation.' });
    return;
  }
  try {
    const result = await gradeListening(parsed.data.level, parsed.data.transcript, parsed.data.questions, parsed.data.answers, parsed.data.learningLanguage);
    res.json(result);
  } catch (err) {
    handleGradingError(res, err);
  }
});

evaluateRouter.post('/speaking', upload.single('audio'), async (req, res) => {
  const level = cefrLevel.safeParse(req.body.level);
  const prompt = typeof req.body.prompt === 'string' ? req.body.prompt : null;
  const learningLanguage = exerciseLanguage.safeParse(req.body.learningLanguage);
  if (!level.success || !prompt || !req.file) {
    res.status(400).json({ error: 'Invalid request: level, prompt and an audio file are required.' });
    return;
  }
  try {
    const result = await gradeSpeaking(level.data, prompt, req.file.buffer, req.file.originalname, req.file.mimetype, learningLanguage.success ? learningLanguage.data : 'es');
    res.json(result);
  } catch (err) {
    handleGradingError(res, err);
  }
});

function handleGradingError(res: import('express').Response, err: unknown) {
  const message = err instanceof Error ? err.message : 'Unexpected error while grading.';
  const notConfigured = err instanceof Error && err.name.endsWith('NotConfiguredError');
  res.status(notConfigured ? 503 : 502).json({ error: message });
}
