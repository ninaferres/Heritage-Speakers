import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { AuthModal } from '../components/AuthModal';
import { LessonRunner } from '../components/Lesson/LessonRunner';

interface LessonGateContextValue {
  /** Call this from any "start a class" control. Handles the auth gate transparently. */
  requestLesson: () => void;
}

const LessonGateContext = createContext<LessonGateContextValue | undefined>(undefined);

const PENDING_LESSON_KEY = 'hs.pendingLesson';

export function LessonGateProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [active, setActive] = useState(false);
  const wasSignedIn = useRef(Boolean(user));

  useEffect(() => {
    const justSignedIn = !wasSignedIn.current && Boolean(user);
    wasSignedIn.current = Boolean(user);
    if (justSignedIn && window.sessionStorage.getItem(PENDING_LESSON_KEY)) {
      window.sessionStorage.removeItem(PENDING_LESSON_KEY);
      setActive(true);
      setAuthModalOpen(false);
    }
  }, [user]);

  function requestLesson() {
    if (user) {
      setActive(true);
    } else {
      window.sessionStorage.setItem(PENDING_LESSON_KEY, '1');
      setAuthModalOpen(true);
    }
  }

  function handleAuthenticated() {
    setAuthModalOpen(false);
    if (window.sessionStorage.getItem(PENDING_LESSON_KEY)) {
      window.sessionStorage.removeItem(PENDING_LESSON_KEY);
      setActive(true);
    }
  }

  return (
    <LessonGateContext.Provider value={{ requestLesson }}>
      {children}
      {authModalOpen && (
        <AuthModal
          onClose={() => {
            setAuthModalOpen(false);
            window.sessionStorage.removeItem(PENDING_LESSON_KEY);
          }}
          onAuthenticated={handleAuthenticated}
        />
      )}
      {active && <LessonRunner onClose={() => setActive(false)} />}
    </LessonGateContext.Provider>
  );
}

export function useLessonGate() {
  const ctx = useContext(LessonGateContext);
  if (!ctx) throw new Error('useLessonGate must be used within a LessonGateProvider');
  return ctx;
}
