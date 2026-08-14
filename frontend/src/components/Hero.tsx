import { LogoMark } from './Logo';
import { useLanguage } from '../context/LanguageContext';
import { useMicroLessonGate } from '../context/MicroLessonGateContext';
import { getString } from '../i18n/strings';

export function Hero({ onOpenAssessment }: { onOpenAssessment: () => void }) {
  const { uiLanguage } = useLanguage();
  const { requestMicroLesson } = useMicroLessonGate();

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
            ? 'Dos formas de avanzar: una práctica diaria de 10-15 minutos, o un examen riguroso por destreza.'
            : 'Two ways to progress: a 10-15 minute daily practice, or a rigorous skill-by-skill exam.'}
        </p>
        <div className="cta-row">
          <button onClick={requestMicroLesson} className="btn btn-gold">
            {uiLanguage === 'es' ? 'Práctica diaria' : 'Daily practice'}
          </button>
          <button
            onClick={onOpenAssessment}
            className="btn btn-outline"
            style={{ background: 'transparent', border: '1.5px solid rgba(250,247,243,.4)', color: 'var(--bone)' }}
          >
            {uiLanguage === 'es' ? 'Modo examen' : 'Exam mode'}
          </button>
          <a href="#language-selector" className="btn btn-outline" style={{ background: 'transparent', border: '1.5px solid rgba(250,247,243,.4)', color: 'var(--bone)' }}>
            {uiLanguage === 'es' ? 'Explorar niveles' : 'Explore levels'}
          </a>
        </div>
      </div>
    </header>
  );
}
