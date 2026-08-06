import { FormEvent, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getString } from '../i18n/strings';
import { AuthModal } from './AuthModal';

export function FinalCtaSection() {
  const { user } = useAuth();
  const { uiLanguage } = useLanguage();
  const [showAuth, setShowAuth] = useState(false);
  const [done, setDone] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (user) {
      setDone(true);
      return;
    }
    setShowAuth(true);
  }

  return (
    <section className="final" id="signup">
      <div className="wrap">
        <h2>{getString('finalCta.title', uiLanguage)}</h2>
        <p>{getString('finalCta.description', uiLanguage)}</p>

        {user || done ? (
          <p style={{ color: 'var(--bone)', fontWeight: 600 }}>{getString('finalCta.successMessage', uiLanguage)}</p>
        ) : (
          <form className="signup" onSubmit={handleSubmit}>
            <button className="btn btn-gold" type="submit">{getString('finalCta.buttonLabel', uiLanguage)}</button>
          </form>
        )}
      </div>

      {showAuth && (
        <AuthModal onClose={() => setShowAuth(false)} onAuthenticated={() => { setShowAuth(false); setDone(true); }} />
      )}
    </section>
  );
}
