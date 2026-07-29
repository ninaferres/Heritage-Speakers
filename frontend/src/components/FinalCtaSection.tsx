import { FormEvent, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AuthModal } from './AuthModal';

export function FinalCtaSection() {
  const { user } = useAuth();
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
        <h2>Your heritage language is waiting</h2>
        <p>Sign up and we'll set up your four skill tracks.</p>

        {user || done ? (
          <p style={{ color: 'var(--bone)', fontWeight: 600 }}>You're all set — scroll up to pick a skill and level to get started.</p>
        ) : (
          <form className="signup" onSubmit={handleSubmit}>
            <button className="btn btn-gold" type="submit">Start now →</button>
          </form>
        )}
      </div>

      {showAuth && (
        <AuthModal onClose={() => setShowAuth(false)} onAuthenticated={() => { setShowAuth(false); setDone(true); }} />
      )}
    </section>
  );
}
