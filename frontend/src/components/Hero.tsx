import { LogoMark } from './Logo';
import { useLanguage } from '../context/LanguageContext';
import { getString } from '../i18n/strings';

export function Hero() {
  const { uiLanguage } = useLanguage();

  return (
    <header className="hero">
      <div className="wrap hero-inner">
        <div className="logo-pill">
          <LogoMark variant="bone" width={80} height={55} />
          <span>Heritage Speakers</span>
        </div>

        <h1>{getString('hero.tagline', uiLanguage)}</h1>
        <p className="hero-subtitle">{getString('hero.subtitle', uiLanguage)}</p>
        <p className="hero-description">
          {uiLanguage === 'es'
            ? 'Creciste entendiéndolo. Ahora fortalécelo, habilidad por habilidad. Aprendizaje de ruso diseñado específicamente para hablantes de herencia listos para reclamar su legado.'
            : 'You grew up understanding it. Now strengthen it, skill by skill. Spanish learning designed specifically for heritage speakers ready to own their inheritance.'}
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
