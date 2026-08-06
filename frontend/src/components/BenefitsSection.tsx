import { useLanguage } from '../context/LanguageContext';
import { getString } from '../i18n/strings';

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
    titleKey: 'benefits.benefit1Title',
    bodyKey: 'benefits.benefit1Body',
  },
  {
    icon: IconPulse,
    titleKey: 'benefits.benefit2Title',
    bodyKey: 'benefits.benefit2Body',
  },
  {
    icon: IconBars,
    titleKey: 'benefits.benefit3Title',
    bodyKey: 'benefits.benefit3Body',
  },
];

export function BenefitsSection() {
  const { uiLanguage } = useLanguage();

  return (
    <section className="block benefits">
      <div className="wrap">
        <div className="head">
          <span className="eyebrow">{getString('benefits.eyebrow', uiLanguage)}</span>
          <h2>{getString('benefits.title', uiLanguage)}</h2>
          <p>{getString('benefits.description', uiLanguage)}</p>
        </div>
        <div className="benefit-grid">
          {BENEFITS.map((b) => (
            <div className="benefit" key={b.titleKey}>
              <div className="b-icon"><b.icon /></div>
              <h3>{getString(b.titleKey as any, uiLanguage)}</h3>
              <p>{getString(b.bodyKey as any, uiLanguage)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
