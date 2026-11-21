import { LogoMark } from './Logo';
import { useLanguage } from '../context/LanguageContext';
import { getString } from '../i18n/strings';

const LEARNING_LANGUAGE_NAME: Record<'es' | 'ru' | 'en', { es: string; en: string }> = {
  es: { es: 'español', en: 'Spanish' },
  ru: { es: 'ruso', en: 'Russian' },
  en: { es: 'inglés', en: 'English' },
};

export function Hero() {
  const { uiLanguage, learningLanguage, availableLearningLanguages } = useLanguage();
  const activeLanguages = availableLearningLanguages.filter((l) => l.status === 'active');
  // The learner may not have picked a learning language yet (it's no longer auto-selected —
  // they choose it via the language picker right before starting an exercise), so the hero
  // copy falls back to the first language available for the current UI language.
  const displayedCode = learningLanguage ?? activeLanguages[0]?.code ?? 'es';
  const target = LEARNING_LANGUAGE_NAME[displayedCode === 'ru' ? 'ru' : displayedCode === 'en' ? 'en' : 'es'];

  return (
    <header className="hero">
      <div className="wrap hero-inner">
        <div className="logo-pill">
          <LogoMark variant="bone" width={80} height={55} />
          <span>Heritage Speakers</span>
        </div>

        <h1>{getString('hero.tagline', uiLanguage)}</h1>
        <p className="hero-subtitle">
          {uiLanguage === 'es' ? `Fortalece tu ${target.es}, habilidad por habilidad` : `Strengthen your ${target.en}, skill by skill`}
        </p>
        <p className="hero-description">
          {uiLanguage === 'es'
            ? `Creciste entendiéndolo. Ahora fortalécelo, habilidad por habilidad. Aprendizaje de ${target.es} diseñado específicamente para hablantes de herencia listos para reclamar su legado.`
            : `You grew up understanding it. Now strengthen it, skill by skill. ${target.en} learning designed specifically for heritage speakers ready to own their inheritance.`}
        </p>

        <div className="cta-row">
          <a href="#paths" className="btn btn-gold">
            {uiLanguage === 'es' ? 'Empezar' : 'Get started'}
          </a>
          <a href="#how" className="btn btn-outline">
            {uiLanguage === 'es' ? 'Ver cómo funciona' : 'See how it works'}
          </a>
        </div>

        {activeLanguages.length > 1 && (
          <div className="hero-languages">
            <span className="hero-languages-label">
              {uiLanguage === 'es' ? 'Disponible para aprender:' : 'Available to learn:'}
            </span>
            <div className="hero-languages-chips">
              {activeLanguages.map((lang) => (
                <span
                  key={lang.code}
                  className={`hero-lang-chip ${lang.code === displayedCode ? 'is-active' : ''}`}
                >
                  {lang.nativeLabel}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
