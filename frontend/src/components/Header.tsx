import { useState } from 'react';
import { BrandLockup } from './Logo';
import { UI_LANGUAGES, UILanguageCode } from '../i18n/languages';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { AuthModal } from './AuthModal';
import { COPY } from '../i18n/copy';

export function Header() {
  const [navOpen, setNavOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | null>(null);
  const { uiLanguage, setUILanguage, learningLanguage, setLearningLanguage, availableLearningLanguages } = useLanguage();
  const { user, signOut } = useAuth();

  return (
    <>
      <header className="site-header">
        <div className="wrap">
          <BrandLockup variant="wine" />

          <div className="nav-actions">
            <select
              className="lang-select"
              value={uiLanguage}
              onChange={(e) => setUILanguage(e.target.value as UILanguageCode)}
              aria-label="Select interface language"
              style={{
                padding: '0.5rem 0.75rem',
                fontSize: '0.9rem',
                border: '2px solid var(--wine)',
                borderRadius: '6px',
                background: 'var(--bone)',
                color: 'var(--ink)',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              {UI_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.nativeLabel}
                </option>
              ))}
            </select>
            <button
              className={`hamburger-btn ${navOpen ? 'open' : ''}`}
              aria-label={navOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={navOpen}
              onClick={() => setNavOpen((v) => !v)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      {navOpen && (
        <>
          <div className="nav-overlay" onClick={() => setNavOpen(false)} />
          <nav className="nav-panel" aria-label="Main menu">
            <div className="nav-panel-head">
              <BrandLockup variant="wine" />
              <button className="nav-panel-close" aria-label="Close menu" onClick={() => setNavOpen(false)}>✕</button>
            </div>

            <div>
              <div className="nav-section-label">Interface Language</div>
              <select
                className="lang-select"
                value={uiLanguage}
                onChange={(e) => setUILanguage(e.target.value as UILanguageCode)}
                aria-label="Choose interface language"
              >
                {UI_LANGUAGES.map((opt) => (
                  <option key={opt.code} value={opt.code}>
                    {opt.nativeLabel}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="nav-section-label">Learn a Language</div>
              <select
                className="lang-select"
                value={learningLanguage || ''}
                onChange={(e) => e.target.value && setLearningLanguage(e.target.value as any)}
                aria-label="Choose language to learn"
              >
                <option value="">Select a language...</option>
                {availableLearningLanguages.map((opt) => (
                  <option key={opt.code} value={opt.code} disabled={opt.status !== 'active'}>
                    {opt.nativeLabel} {opt.status !== 'active' ? '— coming soon' : ''}
                  </option>
                ))}
              </select>
              <p className="lang-hint">More heritage languages are on the way.</p>
            </div>

            <div>
              <div className="nav-section-label">Account</div>
              {user ? (
                <div className="nav-user-chip">
                  <span className="email" title={user.email ?? ''}>{user.email}</span>
                  <button className="btn btn-ghost btn-small" onClick={() => signOut()}>Log out</button>
                </div>
              ) : (
                <div className="nav-auth-actions">
                  <button className="btn btn-wine" onClick={() => { setAuthMode('login'); setNavOpen(false); }}>
                    {COPY.logIn}
                  </button>
                  <button className="btn btn-gold" onClick={() => { setAuthMode('signup'); setNavOpen(false); }}>
                    {COPY.signUp}
                  </button>
                </div>
              )}
            </div>
          </nav>
        </>
      )}

      {authMode && (
        <AuthModal initialMode={authMode} onClose={() => setAuthMode(null)} onAuthenticated={() => setAuthMode(null)} />
      )}
    </>
  );
}
