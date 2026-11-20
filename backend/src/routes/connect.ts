import { Router } from 'express';
import multer from 'multer';
import { requireAuth } from '../middleware/auth.js';
import { connectProfileInputSchema, connectLanguageSchema, bookConnectSessionSchema } from '../schemas/connectSchemas.js';
import {
  getConnectProfile,
  upsertConnectProfile,
  getConnectCredits,
  getConnectReferralCode,
  submitLanguageVerification,
  getLanguageVerifications,
  getConnectMatches,
  bookConnectSession,
  getMyConnectSessions,
  cancelConnectSession,
} from '../services/connect.js';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024 } });

export const connectRouter = Router();
connectRouter.use(requireAuth);

function handleError(err: unknown, res: Parameters<import('express').RequestHandler>[1]) {
  const message = err instanceof Error ? err.message : 'Unexpected error.';
  const notConfigured = err instanceof Error && err.name === 'ConnectNotConfiguredError';
  res.status(notConfigured ? 503 : 502).json({ error: message });
}

connectRouter.get('/profile', async (req, res) => {
  try {
    res.json(await getConnectProfile(req.accessToken!, req.userId!));
  } catch (err) {
    handleError(err, res);
  }
});

connectRouter.put('/profile', async (req, res) => {
  const parsed = connectProfileInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid request body', details: parsed.error.flatten() });
    return;
  }
  try {
    res.json(await upsertConnectProfile(req.accessToken!, req.userId!, parsed.data));
  } catch (err) {
    handleError(err, res);
  }
});

connectRouter.get('/credits', async (req, res) => {
  try {
    res.json({ credits: await getConnectCredits(req.accessToken!, req.userId!) });
  } catch (err) {
    handleError(err, res);
  }
});

connectRouter.get('/referral-code', async (req, res) => {
  try {
    res.json({ code: await getConnectReferralCode(req.accessToken!) });
  } catch (err) {
    handleError(err, res);
  }
});

connectRouter.post('/verify-language', upload.single('audio'), async (req, res) => {
  const language = connectLanguageSchema.safeParse(req.body.language);
  if (!language.success || !req.file) {
    res.status(400).json({ error: 'A language and an audio file are required.' });
    return;
  }
  try {
    const result = await submitLanguageVerification(req.accessToken!, req.userId!, language.data, req.file.buffer, req.file.mimetype);
    res.json(result);
  } catch (err) {
    handleError(err, res);
  }
});

connectRouter.get('/verifications', async (req, res) => {
  try {
    res.json(await getLanguageVerifications(req.accessToken!, req.userId!));
  } catch (err) {
    handleError(err, res);
  }
});

connectRouter.get('/matches', async (req, res) => {
  const language = connectLanguageSchema.safeParse(req.query.language);
  if (!language.success) {
    res.status(400).json({ error: 'A valid "language" query param (es|ru) is required.' });
    return;
  }
  try {
    res.json(await getConnectMatches(req.accessToken!, language.data));
  } catch (err) {
    handleError(err, res);
  }
});

connectRouter.get('/sessions', async (req, res) => {
  try {
    res.json(await getMyConnectSessions(req.accessToken!, req.userId!));
  } catch (err) {
    handleError(err, res);
  }
});

connectRouter.post('/sessions', async (req, res) => {
  const parsed = bookConnectSessionSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid request body', details: parsed.error.flatten() });
    return;
  }
  try {
    res.status(201).json(await bookConnectSession(req.accessToken!, parsed.data));
  } catch (err) {
    handleError(err, res);
  }
});

connectRouter.post('/sessions/:id/cancel', async (req, res) => {
  try {
    await cancelConnectSession(req.accessToken!, req.params.id);
    res.status(204).end();
  } catch (err) {
    handleError(err, res);
  }
});
