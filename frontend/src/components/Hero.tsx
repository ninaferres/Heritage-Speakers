import { LogoMark } from './Logo';

export function Hero() {
  return (
    <header className="hero" style={{
      background: 'linear-gradient(135deg, rgba(214, 184, 153, 0.15) 0%, rgba(107, 31, 46, 0.08) 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative floating elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '5%',
        fontSize: '4rem',
        opacity: 0.15,
        animation: 'float 6s ease-in-out infinite',
      }}>
        🌟
      </div>
      <div style={{
        position: 'absolute',
        bottom: '15%',
        left: '8%',
        fontSize: '3.5rem',
        opacity: 0.12,
        animation: 'float 8s ease-in-out infinite 1s',
      }}>
        📚
      </div>
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '12%',
        fontSize: '3rem',
        opacity: 0.1,
        animation: 'float 7s ease-in-out infinite 2s',
      }}>
        🎭
      </div>

      <div className="wrap hero-inner" style={{ position: 'relative', zIndex: 1 }}>
        <div className="logo-pill">
          <LogoMark variant="bone" width={80} height={55} />
          <span>Heritage Speakers</span>
        </div>

        <div style={{ marginTop: '2rem', marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '2.8rem', lineHeight: 1.2, marginBottom: '0.5rem' }}>
            Reclaim the language you grew up with
          </h1>
          <p className="hero-subtitle" style={{ fontSize: '1.1rem', color: 'var(--wine)', fontWeight: 600 }}>
            Learning as joyful as childhood memories
          </p>
        </div>

        <p className="hero-description" style={{ maxWidth: '600px', marginBottom: '2rem', lineHeight: 1.6 }}>
          You grew up understanding it. Now <strong>strengthen it skill by skill.</strong> Interactive exercises designed for heritage speakers who want to own their language—no textbook formality, just real progression.
        </p>

        <div className="cta-row" style={{ gap: '1rem' }}>
          <a href="#levels" className="btn btn-gold" style={{ fontSize: '1.05rem', padding: '0.9rem 1.8rem' }}>
            ✨ Start learning
          </a>
          <a href="#how" className="btn btn-outline" style={{ fontSize: '1.05rem' }}>
            See how it works
          </a>
        </div>

        <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--muted)' }}>
          No ads. No subscriptions. Just heritage speakers helping heritage speakers.
        </p>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </header>
  );
}
