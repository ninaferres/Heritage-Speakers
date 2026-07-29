import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { AuthModal } from '../components/AuthModal';
import { ExerciseRunner } from '../components/ExerciseRunner/ExerciseRunner';
import { CefrLevel, SkillId } from '../data/types';
import { pendingExerciseStore, PendingExercise } from '../hooks/usePendingExercise';

interface ExerciseGateContextValue {
  /** Call this from any "try this exercise" control. Handles the auth gate transparently. */
  requestExercise: (skill: SkillId, level: CefrLevel) => void;
}

const ExerciseGateContext = createContext<ExerciseGateContextValue | undefined>(undefined);

export function ExerciseGateProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [active, setActive] = useState<PendingExercise | null>(null);
  const wasSignedIn = useRef(Boolean(user));

  // Covers both same-tab email/password login and the full-page redirect
  // that Google OAuth performs: whenever the user transitions from signed
  // out to signed in, resume whatever exercise they originally clicked.
  useEffect(() => {
    const justSignedIn = !wasSignedIn.current && Boolean(user);
    wasSignedIn.current = Boolean(user);
    if (justSignedIn) {
      const resumed = pendingExerciseStore.take();
      if (resumed) {
        setActive(resumed);
        setAuthModalOpen(false);
      }
    }
  }, [user]);

  function requestExercise(skill: SkillId, level: CefrLevel) {
    if (user) {
      setActive({ skill, level });
    } else {
      pendingExerciseStore.save({ skill, level });
      setAuthModalOpen(true);
    }
  }

  function handleAuthenticated() {
    setAuthModalOpen(false);
    const resumed = pendingExerciseStore.take();
    if (resumed) setActive(resumed);
  }

  return (
    <ExerciseGateContext.Provider value={{ requestExercise }}>
      {children}
      {authModalOpen && (
        <AuthModal
          onClose={() => {
            setAuthModalOpen(false);
            pendingExerciseStore.clear();
          }}
          onAuthenticated={handleAuthenticated}
        />
      )}
      {active && <ExerciseRunner skill={active.skill} level={active.level} onClose={() => setActive(null)} />}
    </ExerciseGateContext.Provider>
  );
}

export function useExerciseGate() {
  const ctx = useContext(ExerciseGateContext);
  if (!ctx) throw new Error('useExerciseGate must be used within an ExerciseGateProvider');
  return ctx;
}
