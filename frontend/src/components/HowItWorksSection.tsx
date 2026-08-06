import { useLanguage } from '../context/LanguageContext';
import { getString } from '../i18n/strings';

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
    titleKey: 'howItWorks.step1Title',
    bodyKey: 'howItWorks.step1Body',
  },
  {
    icon: IconTarget2,
    titleKey: 'howItWorks.step2Title',
    bodyKey: 'howItWorks.step2Body',
  },
  {
    icon: IconLayers,
    titleKey: 'howItWorks.step3Title',
    bodyKey: 'howItWorks.step3Body',
  },
];

export function HowItWorksSection() {
  const { uiLanguage } = useLanguage();

  return (
    <section className="block how" id="how">
      <div className="wrap">
        <div className="head">
          <span className="eyebrow">{getString('howItWorks.eyebrow', uiLanguage)}</span>
          <h2>{getString('howItWorks.title', uiLanguage)}</h2>
        </div>
        <div className="steps">
          {STEPS.map((s) => (
            <div className="step" key={s.titleKey}>
              <div className="s-icon"><s.icon /></div>
              <h3>{getString(s.titleKey as any, uiLanguage)}</h3>
              <p>{getString(s.bodyKey as any, uiLanguage)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
