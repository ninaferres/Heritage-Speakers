import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
import { getStreaks } from '../services/practiceStreaks.js';
import { computeLevelProgress, getTotalPoints, createLeague, joinLeague, getMyLeagues, getLeaderboard } from '../services/gamification.js';

export const profileRouter = Router();
profileRouter.use(requireAuth);

function handleError(err: unknown, res: Parameters<import('express').RequestHandler>[1]) {
  const message = err instanceof Error ? err.message : 'Unexpected error.';
  const notConfigured = err instanceof Error && err.name === 'GamificationNotConfiguredError';
  res.status(notConfigured ? 503 : 502).json({ error: message });
}

profileRouter.get('/', async (req, res) => {
  try {
    const [totalPoints, streaks] = await Promise.all([
      getTotalPoints(req.accessToken!, req.userId!),
      getStreaks(req.accessToken!, req.userId!),
    ]);
    res.json({ ...computeLevelProgress(totalPoints), streaks });
  } catch (err) {
    handleError(err, res);
  }
});

const createLeagueSchema = z.object({ name: z.string().min(1).max(60), displayName: z.string().min(1).max(40) });
const joinLeagueSchema = z.object({ code: z.string().min(4).max(12), displayName: z.string().min(1).max(40) });

export const leaguesRouter = Router();
leaguesRouter.use(requireAuth);

leaguesRouter.get('/', async (req, res) => {
  try {
    res.json(await getMyLeagues(req.accessToken!, req.userId!));
  } catch (err) {
    handleError(err, res);
  }
});

leaguesRouter.post('/', async (req, res) => {
  const parsed = createLeagueSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid request body', details: parsed.error.flatten() });
    return;
  }
  try {
    res.status(201).json(await createLeague(req.accessToken!, parsed.data.name, parsed.data.displayName));
  } catch (err) {
    handleError(err, res);
  }
});

leaguesRouter.post('/join', async (req, res) => {
  const parsed = joinLeagueSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid request body', details: parsed.error.flatten() });
    return;
  }
  try {
    res.status(200).json(await joinLeague(req.accessToken!, parsed.data.code, parsed.data.displayName));
  } catch (err) {
    handleError(err, res);
  }
});

leaguesRouter.get('/:id/leaderboard', async (req, res) => {
  try {
    const entries = await getLeaderboard(req.accessToken!, req.params.id);
    res.json(entries.map((e) => ({ ...e, isMe: e.userId === req.userId })));
  } catch (err) {
    handleError(err, res);
  }
});
