import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { fetchStreaks, recordPracticeCompletion, SkillStreak } from '../api/client';

interface StreakContextValue {
  streaks: Record<string, SkillStreak>;
  recordCompletion: (skill: string, source: 'daily_practice' | 'exam_mode') => void;
}

const StreakContext = createContext<StreakContextValue | undefined>(undefined);

export function StreakProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [streaks, setStreaks] = useState<Record<string, SkillStreak>>({});

  const refresh = useCallback(async () => {
    if (!user) {
      setStreaks({});
      return;
    }
    try {
      setStreaks(await fetchStreaks());
    } catch {
      // Streaks are a motivational extra, never block the app if this fails.
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const recordCompletion = useCallback(
    (skill: string, source: 'daily_practice' | 'exam_mode') => {
      if (!user) return;
      recordPracticeCompletion(skill, source)
        .then(refresh)
        .catch(() => {
          // Non-blocking — a lost streak update shouldn't interrupt the learner.
        });
    },
    [user, refresh]
  );

  const value = useMemo<StreakContextValue>(() => ({ streaks, recordCompletion }), [streaks, recordCompletion]);
  return <StreakContext.Provider value={value}>{children}</StreakContext.Provider>;
}

export function useStreaks() {
  const ctx = useContext(StreakContext);
  if (!ctx) throw new Error('useStreaks must be used within a StreakProvider');
  return ctx;
}
