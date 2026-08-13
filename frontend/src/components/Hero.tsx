import { LogoMark } from './Logo';
import { useLanguage } from '../context/LanguageContext';
import { useLessonGate } from '../context/LessonGateContext';
import { getString } from '../i18n/strings';

export function Hero({ onOpenAssessment }: { onOpenAssessment: () => void }) {
  const { uiLanguage } = useLanguage();
  const { requestLesson } = useLessonGate();

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
        <p style={{ color: 'rgba(250,247,243,.75)', fontSize: '.95rem', marginBottom: '.9rem' }}>
          {uiLanguage === 'es'
            ? '¿Nunca lo has estudiado? Empieza por una clase guiada, sin examen.'
            : "Never studied it before? Start with a guided class, no test involved."}
        </p>
        <div className="cta-row">
          <button onClick={requestLesson} className="btn btn-gold">
            {uiLanguage === 'es' ? 'Prueba una clase' : 'Try a class'}
          </button>
          <a href="#language-selector" className="btn btn-outline" style={{ background: 'transparent', border: '1.5px solid rgba(250,247,243,.4)', color: 'var(--bone)' }}>
            {uiLanguage === 'es' ? 'Comenzar ahora' : 'Start now'}
          </a>
          <button
            onClick={onOpenAssessment}
            className="btn btn-outline"
            style={{ background: 'transparent', border: '1.5px solid rgba(250,247,243,.4)', color: 'var(--bone)' }}
          >
            {uiLanguage === 'es' ? 'Determina tu nivel' : 'Determine your level'}
          </button>
        </div>
      </div>
    </header>
  );
}
