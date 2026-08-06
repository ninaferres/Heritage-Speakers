import { useState } from 'react';
import { BrandLockup } from './Logo';
import { UI_LANGUAGES, UILanguageCode } from '../i18n/languages';
import { useLanguage } from '../context/LanguageContext';
import { getString } from '../i18n/strings';
import { useAuth } from '../context/AuthContext';
import { AuthModal } from './AuthModal';
import { COPY } from '../i18n/copy';

export function Header() {
  const [navOpen, setNavOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | null>(null);
  const { uiLanguage, setUILanguage, learningLanguage, setLearningLanguage, availableLearningLanguages } = useLanguage();
  const { user, signOut } = useAuth();

  const scrollToAbout = () => {
    const aboutSection = document.querySelector('.about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
      setNavOpen(false);
    }
  };

  return (
    <>
      <header className="site-header">
        <div className="wrap">
          <BrandLockup variant="wine" />

          <div className="nav-actions">
            <div
              className="lang-toggle"
              style={{
                display: 'flex',
                gap: '0.5rem',
                alignItems: 'center',
                color: 'var(--wine)',
                fontWeight: '600',
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              <button
                onClick={() => setUILanguage('es')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: uiLanguage === 'es' ? 'var(--wine)' : 'var(--wine)',
                  fontWeight: uiLanguage === 'es' ? '700' : '600',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  padding: 0,
                }}
              >
                Español
              </button>
              <span>|</span>
              <button
                onClick={() => setUILanguage('en')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: uiLanguage === 'en' ? 'var(--wine)' : 'var(--wine)',
                  fontWeight: uiLanguage === 'en' ? '700' : '600',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  padding: 0,
                }}
              >
                English
              </button>
            </div>
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
              <div className="nav-section-label">{uiLanguage === 'es' ? 'Idiomas' : 'Languages'}</div>
              <select
                className="lang-select"
                value={learningLanguage || ''}
                onChange={(e) => e.target.value && setLearningLanguage(e.target.value as any)}
                aria-label="Choose language to learn"
              >
                <option value="">{uiLanguage === 'es' ? 'Selecciona un idioma...' : 'Select a language...'}</option>
                {availableLearningLanguages.map((opt) => (
                  <option key={opt.code} value={opt.code} disabled={opt.status !== 'active'}>
                    {opt.nativeLabel} {opt.status !== 'active' ? '— coming soon' : ''}
                  </option>
                ))}
              </select>
              <p className="lang-hint">{uiLanguage === 'es' ? 'Más idiomas de herencia en camino.' : 'More heritage languages are on the way.'}</p>
            </div>

            <div>
              <div className="nav-section-label">{uiLanguage === 'es' ? 'Acerca de' : 'About'}</div>
              <button
                onClick={scrollToAbout}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  fontSize: '0.95rem',
                  border: 'none',
                  borderRadius: '8px',
                  background: 'var(--wine)',
                  color: 'var(--bone)',
                  fontWeight: '600',
                  cursor: 'pointer',
                  marginBottom: '0.5rem',
                }}
              >
                {getString('about.title', uiLanguage)}
              </button>
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
