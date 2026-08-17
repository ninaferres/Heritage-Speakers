import { NextFunction, Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import { env, isAuthConfigured } from '../env.js';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      userId?: string;
      userEmail?: string;
      accessToken?: string;
    }
  }
}

const supabase = isAuthConfigured ? createClient(env.supabaseUrl!, env.supabaseAnonKey!) : null;

/**
 * Verifies the Supabase-issued access token sent by the frontend as
 * `Authorization: Bearer <token>`. We delegate verification to Supabase's
 * own /auth/v1/user endpoint (via supabase-js `getUser`) rather than
 * decoding the JWT ourselves, so key rotation and revocation are handled
 * for free.
 */
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!isAuthConfigured || !supabase) {
    res.status(503).json({ error: 'Authentication is not configured on the server yet (missing SUPABASE_URL / SUPABASE_ANON_KEY).' });
    return;
  }

  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    res.status(401).json({ error: 'Missing bearer token.' });
    return;
  }

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    res.status(401).json({ error: 'Invalid or expired session.' });
    return;
  }

  req.userId = data.user.id;
  req.userEmail = data.user.email ?? undefined;
  req.accessToken = token;
  next();
}
