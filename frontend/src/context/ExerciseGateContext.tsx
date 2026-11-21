import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useLanguage } from './LanguageContext';
import { AuthModal } from '../components/AuthModal';
import { LanguagePicker } from '../components/LanguagePicker';
import { ExerciseRunner } from '../components/ExerciseRunner/ExerciseRunner';
import { ExamEntryModal } from '../components/ExamEntryModal';
import { CefrLevel, SkillId } from '../data/types';
import { pendingExerciseStore, PendingExercise } from '../hooks/usePendingExercise';

interface ExerciseGateContextValue {
  /** Call this from any "try this exercise" control. Handles the auth gate transparently. */
  requestExercise: (skill: SkillId, level: CefrLevel) => void;
  /** Opens the skill-then-level picker (same shape as Daily Practice's), which hands off to requestExercise. */
  requestExamEntry: () => void;
}

const ExerciseGateContext = createContext<ExerciseGateContextValue | undefined>(undefined);

export function ExerciseGateProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { availableLearningLanguages, setLearningLanguage } = useLanguage();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [pendingLanguagePick, setPendingLanguagePick] = useState<PendingExercise | null>(null);
  const [active, setActive] = useState<PendingExercise | null>(null);
  const [entryOpen, setEntryOpen] = useState(false);
  const wasSignedIn = useRef(Boolean(user));

  // Shows the shared language picker before starting, unless there's genuinely only one
  // active learning language to pick from — then there's nothing to choose.
  function proceedToLanguagePick(pending: PendingExercise) {
    const activeLanguages = availableLearningLanguages.filter((l) => l.status === 'active');
    if (activeLanguages.length <= 1) {
      if (activeLanguages[0]) setLearningLanguage(activeLanguages[0].code);
      setActive(pending);
    } else {
      setPendingLanguagePick(pending);
    }
  }

  // Covers both same-tab email/password login and the full-page redirect
  // that Google OAuth performs: whenever the user transitions from signed
  // out to signed in, resume whatever exercise they originally clicked.
  useEffect(() => {
    const justSignedIn = !wasSignedIn.current && Boolean(user);
    wasSignedIn.current = Boolean(user);
    if (justSignedIn) {
      const resumed = pendingExerciseStore.take();
      if (resumed) {
        proceedToLanguagePick(resumed);
        setAuthModalOpen(false);
      }
    }
  }, [user]);

  // Lets "Modo examen" open a fresh tab and land straight on the skill/level picker, instead of
  // just opening the homepage — mirrors MicroLessonGateContext's ?practice=daily handling.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('exam') !== '1') return;
    params.delete('exam');
    const newSearch = params.toString();
    window.history.replaceState({}, '', window.location.pathname + (newSearch ? `?${newSearch}` : '') + window.location.hash);
    setEntryOpen(true);
  }, []);

  function requestExercise(skill: SkillId, level: CefrLevel) {
    if (user) {
      proceedToLanguagePick({ skill, level });
    } else {
      pendingExerciseStore.save({ skill, level });
      setAuthModalOpen(true);
    }
  }

  function handleAuthenticated() {
    setAuthModalOpen(false);
    const resumed = pendingExerciseStore.take();
    if (resumed) proceedToLanguagePick(resumed);
  }

  return (
    <ExerciseGateContext.Provider value={{ requestExercise, requestExamEntry: () => setEntryOpen(true) }}>
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
      {entryOpen && <ExamEntryModal onClose={() => setEntryOpen(false)} />}
      {pendingLanguagePick && (
        <div className="exercise-overlay" onClick={(e) => e.target === e.currentTarget && setPendingLanguagePick(null)}>
          <div className="exercise-card" role="dialog" aria-modal="true">
            <button className="modal-close" aria-label="Close" onClick={() => setPendingLanguagePick(null)}>✕</button>
            <LanguagePicker
              onSelect={() => {
                setActive(pendingLanguagePick);
                setPendingLanguagePick(null);
              }}
            />
          </div>
        </div>
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
