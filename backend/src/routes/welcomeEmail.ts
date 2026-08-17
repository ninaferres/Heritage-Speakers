import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
import { sendWelcomeEmail } from '../services/welcomeEmail.js';

const bodySchema = z.object({
  uiLanguage: z.enum(['en', 'es']),
});

export const welcomeEmailRouter = Router();
welcomeEmailRouter.use(requireAuth);

welcomeEmailRouter.post('/', async (req, res) => {
  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid request body', details: parsed.error.flatten() });
    return;
  }
  if (!req.userEmail) {
    res.status(400).json({ error: 'No email on this account.' });
    return;
  }
  try {
    await sendWelcomeEmail(req.userEmail, parsed.data.uiLanguage);
    res.status(204).end();
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error sending welcome email.';
    const notConfigured = err instanceof Error && err.name === 'WelcomeEmailNotConfiguredError';
    res.status(notConfigured ? 503 : 502).json({ error: message });
  }
});
