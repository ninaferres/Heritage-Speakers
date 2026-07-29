function IconTarget() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}
function IconPulse() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12h4l3 8 4-16 3 8h4" />
    </svg>
  );
}
function IconBars() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" />
      <rect x="7" y="12" width="3" height="6" />
      <rect x="12" y="8" width="3" height="10" />
      <rect x="17" y="4" width="3" height="14" />
    </svg>
  );
}

const BENEFITS = [
  {
    icon: IconTarget,
    title: 'Grow each skill at its own pace',
    body: 'Your listening might be years ahead of your writing. We meet each skill exactly where it is, no averaging down.',
  },
  {
    icon: IconPulse,
    title: 'Close the understanding-to-using gap',
    body: 'You already hear it. Half-speak it. We help you read and write with the same confidence you bring to listening.',
  },
  {
    icon: IconBars,
    title: 'Track real CEFR progress',
    body: 'Watch each skill climb the scale, or hold steady at C2. Progress you can point to, skill by skill.',
  },
];

export function BenefitsSection() {
  return (
    <section className="block benefits">
      <div className="wrap">
        <div className="head">
          <span className="eyebrow">What you'll get</span>
          <h2>Three things that change how you show up</h2>
          <p>At work, at home, on paper.</p>
        </div>
        <div className="benefit-grid">
          {BENEFITS.map((b) => (
            <div className="benefit" key={b.title}>
              <div className="b-icon"><b.icon /></div>
              <h3>{b.title}</h3>
              <p>{b.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
