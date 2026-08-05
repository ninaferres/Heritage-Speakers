import { LogoMark } from './Logo';

export function Hero({ onOpenAssessment }: { onOpenAssessment: () => void }) {
  return (
    <header className="hero">
      <div className="wrap hero-inner">
        <div className="logo-pill">
          <LogoMark variant="bone" width={80} height={55} />
          <span>Heritage Speakers</span>
        </div>

        <h1>Reclaim the language you grew up with</h1>
        <p className="hero-subtitle">Where childhood memories meet adult mastery</p>
        <p className="hero-description">
          You grew up understanding it. Now strengthen it, skill by skill. Spanish learning designed
          specifically for heritage speakers ready to own their inheritance.
        </p>
        <div className="cta-row">
          <a href="#levels" className="btn btn-gold">Start now</a>
          <button
            onClick={onOpenAssessment}
            className="btn btn-outline"
            style={{ background: 'transparent', border: '1.5px solid rgba(250,247,243,.4)', color: 'var(--bone)' }}
          >
            Determine your level
          </button>
        </div>
      </div>
    </header>
  );
}
