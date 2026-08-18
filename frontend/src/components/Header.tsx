import { useState } from 'react';
import { BrandLockup } from './Logo';
import { useLanguage } from '../context/LanguageContext';
import { getString } from '../i18n/strings';
import { useAuth } from '../context/AuthContext';
import { AuthModal } from './AuthModal';
import { AboutModal } from './AboutModal';
import { WhyUsModal } from './WhyUsModal';
import { ProfilePanel } from './ProfilePanel';
import { getCopy } from '../i18n/copy';
import { useMicroLessonGate } from '../context/MicroLessonGateContext';

export function Header() {
  const [navOpen, setNavOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | null>(null);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [whyUsOpen, setWhyUsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { uiLanguage, setUILanguage, learningLanguage, setLearningLanguage, availableLearningLanguages } = useLanguage();
  const { user, signOut } = useAuth();
  const { requestMicroLesson } = useMicroLessonGate();
  const COPY = getCopy(uiLanguage);

  const handleOpenAbout = () => {
    setAboutOpen(true);
    setNavOpen(false);
  };

  const handleOpenWhyUs = () => {
    setWhyUsOpen(true);
    setNavOpen(false);
  };

  const handleStartDailyPractice = () => {
    setNavOpen(false);
    requestMicroLesson();
  };

  const handleGoToExamMode = () => {
    setNavOpen(false);
    window.open(`${window.location.origin}${window.location.pathname}?exam=1`, '_blank', 'noopener,noreferrer');
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
              <div className="nav-section-label">{uiLanguage === 'es' ? 'Practicar' : 'Practice'}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
                <button className="btn btn-gold" style={{ width: '100%' }} onClick={handleStartDailyPractice}>
                  {uiLanguage === 'es' ? 'Práctica diaria' : 'Daily practice'}
                </button>
                <button className="nav-btn-outline" onClick={handleGoToExamMode}>
                  {uiLanguage === 'es' ? 'Modo examen' : 'Exam mode'}
                </button>
              </div>
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
                    {opt.nativeLabel} {opt.status !== 'active' ? (uiLanguage === 'es' ? '— próximamente' : '— coming soon') : ''}
                  </option>
                ))}
              </select>
              <p className="lang-hint">{uiLanguage === 'es' ? 'Más idiomas de herencia en camino.' : 'More heritage languages are on the way.'}</p>
            </div>

            <div>
              <div className="nav-section-label">{uiLanguage === 'es' ? 'Acerca de' : 'About'}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
                <button className="nav-btn-outline" onClick={handleOpenAbout}>
                  {getString('about.title', uiLanguage)}
                </button>
                <button className="nav-btn-outline" onClick={handleOpenWhyUs}>
                  {uiLanguage === 'es' ? 'Por qué Heritage Speakers' : 'Why Heritage Speakers'}
                </button>
              </div>
            </div>

            <div>
              <div className="nav-section-label">{uiLanguage === 'es' ? 'Cuenta' : 'Account'}</div>
              {user ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
                  <button
                    className="nav-btn-outline"
                    onClick={() => { setProfileOpen(true); setNavOpen(false); }}
                  >
                    {uiLanguage === 'es' ? 'Ver perfil' : 'View profile'}
                  </button>
                  <div className="nav-user-chip">
                    <span className="email" title={user.email ?? ''}>{user.email}</span>
                    <button className="btn btn-ghost btn-small" onClick={() => signOut()}>{uiLanguage === 'es' ? 'Cerrar sesión' : 'Log out'}</button>
                  </div>
                </div>
              ) : (
                <div className="nav-auth-actions">
                  <button className="nav-btn-outline" onClick={() => { setAuthMode('login'); setNavOpen(false); }}>
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

      {aboutOpen && (
        <AboutModal onClose={() => setAboutOpen(false)} />
      )}

      {whyUsOpen && (
        <WhyUsModal onClose={() => setWhyUsOpen(false)} />
      )}

      {profileOpen && (
        <ProfilePanel onClose={() => setProfileOpen(false)} />
      )}
    </>
  );
}
