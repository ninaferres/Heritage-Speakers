import { useState } from 'react';
import { BrandLockup } from './Logo';
import { LANGUAGES } from '../i18n/languages';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { AuthModal } from './AuthModal';
import { COPY } from '../i18n/copy';

export function Header() {
  const [navOpen, setNavOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | null>(null);
  const { language, setLanguageCode } = useLanguage();
  const { user, signOut } = useAuth();

  return (
    <>
      <header className="site-header">
        <div className="wrap">
          <BrandLockup variant="wine" />

          <div className="nav-actions">
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
              <div className="nav-section-label">Learning language</div>
              <select
                className="lang-select"
                value={language.code}
                onChange={(e) => setLanguageCode(e.target.value)}
                aria-label="Choose learning language"
              >
                {LANGUAGES.map((opt) => (
                  <option key={opt.code} value={opt.code} disabled={opt.status !== 'active'}>
                    {opt.uiNativeLabel} {opt.status !== 'active' ? '— coming soon' : ''}
                  </option>
                ))}
              </select>
              <p className="lang-hint">More heritage languages, including Mandarin, are on the way.</p>
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
