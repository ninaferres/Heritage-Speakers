import { CefrLevel, SkillId } from '../data/types';

const STORAGE_KEY = 'hs.pendingExercise';

export interface PendingExercise {
  skill: SkillId;
  level: CefrLevel;
}

/**
 * Persists the exercise a signed-out visitor clicked on, across a full page
 * redirect (needed for Google OAuth, which navigates away and back) so we
 * can drop them straight back into it once authenticated.
 */
export const pendingExerciseStore = {
  save(entry: PendingExercise) {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(entry));
  },
  take(): PendingExercise | null {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    window.sessionStorage.removeItem(STORAGE_KEY);
    try {
      return JSON.parse(raw) as PendingExercise;
    } catch {
      return null;
    }
  },
  clear() {
    window.sessionStorage.removeItem(STORAGE_KEY);
  },
};
