import { LogoMark } from './Logo';
import { useLanguage } from '../context/LanguageContext';
import { useMicroLessonGate } from '../context/MicroLessonGateContext';
import { getString } from '../i18n/strings';

export function Hero() {
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

        <div className="path-cards">
          <div className="path-card">
            <span className="path-card-eyebrow">{uiLanguage === 'es' ? 'Sin compromiso · 10-15 min' : 'No commitment · 10-15 min'}</span>
            <h3>{uiLanguage === 'es' ? 'Práctica diaria' : 'Daily practice'}</h3>
            <p>
              {uiLanguage === 'es'
                ? 'Una sesión corta y guiada centrada en una sola destreza: escucha, lectura, gramática y sintaxis, o vocabulario. Ideal para practicar un poco cada día.'
                : 'A short, guided session focused on a single skill: listening, reading, grammar & syntax, or vocabulary. Perfect for a little practice every day.'}
            </p>
            <button onClick={requestMicroLesson} className="btn btn-gold">
              {uiLanguage === 'es' ? 'Empezar práctica diaria' : 'Start daily practice'}
            </button>
          </div>

          <div className="path-card">
            <span className="path-card-eyebrow">{uiLanguage === 'es' ? 'Riguroso · Nivel CEFR (A1–C2)' : 'Rigorous · CEFR level (A1–C2)'}</span>
            <h3>{uiLanguage === 'es' ? 'Modo examen' : 'Exam mode'}</h3>
            <p>
              {uiLanguage === 'es'
                ? 'Elige una destreza (habla, lectura, escucha o escritura) y tu nivel CEFR exacto, del A1 al C2. ¿No sabes tu nivel? Hay un test rápido por destreza.'
                : 'Choose a skill (speaking, reading, listening, or writing) and your exact CEFR level, from A1 to C2. Not sure of your level? There\'s a quick per-skill test.'}
            </p>
            <a href="#levels" className="btn btn-outline" style={{ background: 'transparent', border: '1.5px solid rgba(250,247,243,.4)', color: 'var(--bone)' }}>
              {uiLanguage === 'es' ? 'Ir al modo examen' : 'Go to exam mode'}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
