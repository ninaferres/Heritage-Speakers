import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
import { synthesizeSpeech } from '../services/elevenlabs.js';

const ttsSchema = z.object({
  text: z.string().min(1).max(4000),
  accent: z.enum(['es-ES', 'es-MX', 'es-AR', 'es-CO', 'ru-RU', 'ru-Moscow']),
});

export const ttsRouter = Router();
ttsRouter.use(requireAuth);

ttsRouter.post('/', async (req, res) => {
  const parsed = ttsSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid request body', details: parsed.error.flatten() });
    return;
  }
  try {
    const audio = await synthesizeSpeech(parsed.data.text, parsed.data.accent);
    res.setHeader('Content-Type', 'audio/mpeg');
    res.send(audio);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error generating audio.';
    const notConfigured = err instanceof Error && err.name === 'TtsNotConfiguredError';
    res.status(notConfigured ? 503 : 502).json({ error: message });
  }
});
