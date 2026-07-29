import { LogoMark } from './Logo';

export function Hero() {
  return (
    <header className="hero">
      <div className="ambient">
        <svg width="320" height="205" style={{ top: -30, left: -60 }}>
          <path d="M29.64 107.75 C81.64 28.01 133.64 28.01 185.64 107.75" fill="none" stroke="#6b1f2e" strokeWidth={18.2} strokeLinecap="round" />
          <path d="M58.24 107.75 C91.17 62.68 124.10 62.68 157.04 107.75" fill="none" stroke="#b8935a" strokeWidth={13} strokeLinecap="round" />
        </svg>
        <svg width="240" height="154" style={{ bottom: -20, right: -40 }}>
          <path d="M29.64 107.75 C81.64 28.01 133.64 28.01 185.64 107.75" fill="none" stroke="#6b1f2e" strokeWidth={18.2} strokeLinecap="round" />
          <path d="M58.24 107.75 C91.17 62.68 124.10 62.68 157.04 107.75" fill="none" stroke="#b8935a" strokeWidth={13} strokeLinecap="round" />
        </svg>
      </div>
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
          <a href="#how" className="btn btn-outline">See how it works</a>
        </div>
      </div>
    </header>
  );
}
