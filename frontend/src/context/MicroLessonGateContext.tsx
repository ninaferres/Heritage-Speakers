import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { AuthModal } from '../components/AuthModal';
import { MicroLessonRunner } from '../components/MicroLesson/MicroLessonRunner';

interface MicroLessonGateContextValue {
  /** Call this from any "start daily practice" control. Handles the auth gate transparently. */
  requestMicroLesson: () => void;
}

const MicroLessonGateContext = createContext<MicroLessonGateContextValue | undefined>(undefined);

const PENDING_KEY = 'hs.pendingMicroLesson';

export function MicroLessonGateProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [active, setActive] = useState(false);
  const wasSignedIn = useRef(Boolean(user));

  useEffect(() => {
    const justSignedIn = !wasSignedIn.current && Boolean(user);
    wasSignedIn.current = Boolean(user);
    if (justSignedIn && window.sessionStorage.getItem(PENDING_KEY)) {
      window.sessionStorage.removeItem(PENDING_KEY);
      setActive(true);
      setAuthModalOpen(false);
    }
  }, [user]);

  function requestMicroLesson() {
    if (user) {
      setActive(true);
    } else {
      window.sessionStorage.setItem(PENDING_KEY, '1');
      setAuthModalOpen(true);
    }
  }

  function handleAuthenticated() {
    setAuthModalOpen(false);
    if (window.sessionStorage.getItem(PENDING_KEY)) {
      window.sessionStorage.removeItem(PENDING_KEY);
      setActive(true);
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
      {active && <MicroLessonRunner onClose={() => setActive(false)} />}
    </MicroLessonGateContext.Provider>
  );
}

export function useMicroLessonGate() {
  const ctx = useContext(MicroLessonGateContext);
  if (!ctx) throw new Error('useMicroLessonGate must be used within a MicroLessonGateProvider');
  return ctx;
}
