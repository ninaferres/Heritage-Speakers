import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { connectProfileInputSchema } from '../schemas/connectSchemas.js';
import { getConnectProfile, upsertConnectProfile, getConnectCredits, getConnectReferralCode } from '../services/connect.js';

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
