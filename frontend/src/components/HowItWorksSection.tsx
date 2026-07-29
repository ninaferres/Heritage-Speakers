function IconClock() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}
function IconTarget2() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}
function IconLayers() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10 12 5 2 10l10 5 10-5z" />
      <path d="M6 12v5c0 1 2.5 3 6 3s6-2 6-3v-5" />
    </svg>
  );
}

const STEPS = [
  {
    icon: IconClock,
    title: 'Set your starting levels',
    body: 'Tell us where each skill sits today. Four honest starting points, no guessing one single level.',
  },
  {
    icon: IconTarget2,
    title: 'Practice with guided sessions',
    body: 'Each session targets one skill at one CEFR level. Always at the right edge: never too easy, never overwhelming.',
  },
  {
    icon: IconLayers,
    title: 'Level up or maintain',
    body: 'Move up one skill at a time. Reach C2 and switch to Maintain to keep it sharp.',
  },
];

export function HowItWorksSection() {
  return (
    <section className="block how" id="how">
      <div className="wrap">
        <div className="head">
          <span className="eyebrow">How it works</span>
          <h2>Three steps, then you're moving</h2>
        </div>
        <div className="steps">
          {STEPS.map((s) => (
            <div className="step" key={s.title}>
              <div className="s-icon"><s.icon /></div>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
