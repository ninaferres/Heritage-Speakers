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
  const { user, loading } = useAuth();
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
