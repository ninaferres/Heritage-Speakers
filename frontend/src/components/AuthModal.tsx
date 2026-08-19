import { FormEvent, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getCopy } from '../i18n/copy';
import { useLanguage } from '../context/LanguageContext';

type Mode = 'signup' | 'login';

// Apple sign-in needs the Apple provider turned on in the Supabase dashboard first (requires an
// Apple Developer account + Services ID/key — see README). Flip this back on once that's done;
// signInWithApple() and its button below are already fully wired and don't need any other change.
const APPLE_SIGN_IN_ENABLED = false;

export function AuthModal({
  onClose,
  onAuthenticated,
  initialMode = 'signup',
}: {
  onClose: () => void;
  onAuthenticated: () => void;
  initialMode?: Mode;
}) {
  const { signInWithPassword, signUpWithPassword, signInWithGoogle, signInWithApple, isConfigured } = useAuth();
  const { uiLanguage } = useLanguage();
  const COPY = getCopy(uiLanguage);
  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!isConfigured) {
      setError(COPY.authNotConfigured);
      return;
    }

    setSubmitting(true);
    const result = mode === 'signup' ? await signUpWithPassword(email, password) : await signInWithPassword(email, password);
    setSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }
    // Welcome email fires from AuthContext once a real session exists (immediately here if no
    // email confirmation is required, or later when the learner confirms and signs in).
    onAuthenticated();
  }

  async function handleGoogle() {
    setError(null);
    if (!isConfigured) {
      setError(COPY.authNotConfigured);
      return;
    }
    const result = await signInWithGoogle();
    // Supabase redirects the browser for OAuth; onAuthenticated() runs after
    // the redirect back, driven by AuthContext's session listener elsewhere.
    if (result.error) setError(result.error);
  }

  async function handleApple() {
    setError(null);
    if (!isConfigured) {
      setError(COPY.authNotConfigured);
      return;
    }
    const result = await signInWithApple();
    if (result.error) setError(result.error);
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
        <button className="modal-close" aria-label="Close" onClick={onClose}>✕</button>

        <h3 id="auth-modal-title">{COPY.authGateTitle}</h3>
        <p className="modal-copy">{COPY.authGateBody}</p>

        <div className="modal-tabs" role="tablist">
          <button type="button" role="tab" className={`modal-tab ${mode === 'signup' ? 'active' : ''}`} onClick={() => setMode('signup')}>
            {COPY.signUp}
          </button>
          <button type="button" role="tab" className={`modal-tab ${mode === 'login' ? 'active' : ''}`} onClick={() => setMode('login')}>
            {COPY.logIn}
          </button>
        </div>

        {error && <div className="modal-error">{error}</div>}

        <button type="button" className="btn btn-google" onClick={handleGoogle}>
          <GoogleIcon /> {COPY.continueWithGoogle}
        </button>

        {APPLE_SIGN_IN_ENABLED && (
          <button type="button" className="btn btn-apple" onClick={handleApple}>
            <AppleIcon /> {COPY.continueWithApple}
          </button>
        )}

        <div className="modal-divider">{COPY.or}</div>

        <form onSubmit={handleSubmit}>
          <label className="field-label" htmlFor="auth-email">{COPY.emailLabel}</label>
          <input
            id="auth-email"
            className="field-input"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label className="field-label" htmlFor="auth-password">{COPY.passwordLabel}</label>
          <input
            id="auth-password"
            className="field-input"
            type="password"
            required
            minLength={8}
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="btn btn-wine" type="submit" disabled={submitting}>
            {submitting ? COPY.pleaseWait : mode === 'signup' ? COPY.signUpAction : COPY.logInAction}
          </button>
        </form>

        <p className="modal-note">
          <button type="button" className="btn-linklike" onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')} style={linkStyle}>
            {mode === 'signup' ? COPY.switchToLogIn : COPY.switchToSignUp}
          </button>
        </p>
        <p className="modal-note">{COPY.legalNote}</p>
      </div>
    </div>
  );
}

const linkStyle: React.CSSProperties = {
  background: 'none',
  border: 0,
  color: 'var(--wine)',
  fontWeight: 600,
  cursor: 'pointer',
  textDecoration: 'underline',
  fontSize: '.88rem',
};

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.3 35.4 26.8 36 24 36c-5.3 0-9.7-3.1-11.3-7.6l-6.5 5C9.6 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.1 5.8l6.3 5.3C40.8 36 44 30.9 44 24c0-1.3-.1-2.7-.4-3.5z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M17.05 12.5c-.03-2.6 2.12-3.85 2.22-3.91-1.21-1.77-3.09-2.01-3.76-2.04-1.6-.16-3.13.94-3.94.94-.82 0-2.06-.92-3.4-.9-1.75.03-3.37 1.02-4.27 2.59-1.82 3.16-.47 7.83 1.31 10.4.87 1.25 1.9 2.66 3.26 2.61 1.31-.05 1.8-.85 3.38-.85s2.03.85 3.41.82c1.42-.02 2.31-1.28 3.17-2.54.99-1.46 1.4-2.87 1.42-2.94-.03-.02-2.75-1.06-2.78-4.18h-.02z" />
      <path d="M14.68 4.79c.72-.87 1.2-2.08 1.07-3.29-1.03.04-2.29.68-3.03 1.55-.67.77-1.25 2-1.09 3.18 1.16.09 2.34-.58 3.05-1.44z" />
    </svg>
  );
}
