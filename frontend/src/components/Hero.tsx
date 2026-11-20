import { LogoMark } from './Logo';
import { useLanguage } from '../context/LanguageContext';
import { getString } from '../i18n/strings';

const LEARNING_LANGUAGE_NAME: Record<'es' | 'ru', { es: string; en: string }> = {
  es: { es: 'español', en: 'Spanish' },
  ru: { es: 'ruso', en: 'Russian' },
};

export function Hero() {
  const { uiLanguage, learningLanguage } = useLanguage();
  // Defaults keep the hero readable even before a learning language is chosen (e.g. on first
  // load before LanguageContext's auto-select effect runs).
  const target = LEARNING_LANGUAGE_NAME[learningLanguage === 'ru' ? 'ru' : 'es'];

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
      </div>
    </header>
  );
}
