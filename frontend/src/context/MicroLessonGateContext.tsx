import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useLanguage } from './LanguageContext';
import { AuthModal } from '../components/AuthModal';
import { LanguagePicker } from '../components/LanguagePicker';
import { MicroLessonRunner } from '../components/MicroLesson/MicroLessonRunner';

interface MicroLessonGateContextValue {
  /** Call this from any "start daily practice" control. Handles the auth gate transparently. */
  requestMicroLesson: () => void;
}

const MicroLessonGateContext = createContext<MicroLessonGateContextValue | undefined>(undefined);

const PENDING_KEY = 'hs.pendingMicroLesson';

export function MicroLessonGateProvider({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const { availableLearningLanguages, setLearningLanguage } = useLanguage();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [languagePickerOpen, setLanguagePickerOpen] = useState(false);
  const [active, setActive] = useState(false);
  const wasSignedIn = useRef(Boolean(user));

  // Shows the shared language picker before starting, unless there's genuinely only one
  // active learning language to pick from — then there's nothing to choose.
  function proceedToLanguagePick() {
    const activeLanguages = availableLearningLanguages.filter((l) => l.status === 'active');
    if (activeLanguages.length <= 1) {
      if (activeLanguages[0]) setLearningLanguage(activeLanguages[0].code);
      setActive(true);
    } else {
      setLanguagePickerOpen(true);
    }
  }

  useEffect(() => {
    const justSignedIn = !wasSignedIn.current && Boolean(user);
    wasSignedIn.current = Boolean(user);
    if (justSignedIn && window.sessionStorage.getItem(PENDING_KEY)) {
      window.sessionStorage.removeItem(PENDING_KEY);
      proceedToLanguagePick();
      setAuthModalOpen(false);
    }
  }, [user]);

  // Lets the "Start daily practice" link open in a fresh tab and land straight in the
  // skill/level flow, instead of just opening the homepage — the tab's own React app
  // reads ?practice=daily on first mount and requests the lesson right away.
  useEffect(() => {
    if (loading) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('practice') !== 'daily') return;
    params.delete('practice');
    const newSearch = params.toString();
    window.history.replaceState({}, '', window.location.pathname + (newSearch ? `?${newSearch}` : '') + window.location.hash);
    requestMicroLesson();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  function requestMicroLesson() {
    if (user) {
      proceedToLanguagePick();
    } else {
      window.sessionStorage.setItem(PENDING_KEY, '1');
      setAuthModalOpen(true);
    }
  }

  function handleAuthenticated() {
    setAuthModalOpen(false);
    if (window.sessionStorage.getItem(PENDING_KEY)) {
      window.sessionStorage.removeItem(PENDING_KEY);
      proceedToLanguagePick();
    }
  }

  return (
    <MicroLessonGateContext.Provider value={{ requestMicroLesson }}>
      {children}
      {authModalOpen && (
        <AuthModal
          onClose={() => {
            setAuthModalOpen(false);
            window.sessionStorage.removeItem(PENDING_KEY);
          }}
          onAuthenticated={handleAuthenticated}
        />
      )}
      {languagePickerOpen && (
        <div className="exercise-overlay" onClick={(e) => e.target === e.currentTarget && setLanguagePickerOpen(false)}>
          <div className="exercise-card" role="dialog" aria-modal="true">
            <button className="modal-close" aria-label="Close" onClick={() => setLanguagePickerOpen(false)}>✕</button>
            <LanguagePicker
              onSelect={() => {
                setLanguagePickerOpen(false);
                setActive(true);
              }}
            />
          </div>
        </div>
      )}
      {active && <MicroLessonRunner onClose={() => setActive(false)} />}
    </MicroLessonGateContext.Provider>
  );
}

export function useMicroLessonGate() {
  const ctx = useContext(MicroLessonGateContext);
  if (!ctx) throw new Error('useMicroLessonGate must be used within a MicroLessonGateProvider');
  return ctx;
}
