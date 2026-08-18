import { Router } from 'express';
import { feedbackSchema } from '../schemas/feedbackSchema.js';
import { saveFeedback, listFeedback } from '../services/feedbackStore.js';
import { env } from '../env.js';

export const feedbackRouter = Router();

function handleError(err: unknown, res: Parameters<import('express').RequestHandler>[1]) {
  const message = err instanceof Error ? err.message : 'Unexpected error.';
  const notConfigured = err instanceof Error && err.name === 'FeedbackNotConfiguredError';
  res.status(notConfigured ? 503 : 502).json({ error: message });
}

// Open to everyone (logged in or not) — this is a suggestion box, not a gated feature.
feedbackRouter.post('/', async (req, res) => {
  const parsed = feedbackSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid feedback', details: parsed.error.flatten() });
    return;
  }
  try {
    const entry = await saveFeedback(parsed.data);
    res.status(201).json({ ok: true, id: entry.id });
  } catch (err) {
    handleError(err, res);
  }
});

// Lightweight shared-secret gate — there's no admin role yet, so this is the phase-1 stand-in.
feedbackRouter.get('/', async (req, res) => {
  if (!env.feedbackAdminKey) {
    res.status(503).json({ error: 'Feedback reading is not configured (missing FEEDBACK_ADMIN_KEY).' });
    return;
  }
  if (req.header('x-admin-key') !== env.feedbackAdminKey) {
    res.status(401).json({ error: 'Invalid admin key.' });
    return;
  }
  try {
    res.json(await listFeedback());
  } catch (err) {
    handleError(err, res);
  }
});
