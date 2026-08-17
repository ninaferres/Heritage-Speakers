import { useLanguage } from '../context/LanguageContext';

export function PathsSection() {
  const { uiLanguage } = useLanguage();

  return (
    <section className="block paths" id="paths">
      <div className="wrap">
        <div className="head">
          <span className="eyebrow">{uiLanguage === 'es' ? 'Dos maneras de avanzar' : 'Two ways to move forward'}</span>
          <h2>{uiLanguage === 'es' ? 'Elige tu camino' : 'Choose your path'}</h2>
        </div>

        <div className="path-cards-light">
          <div className="path-card-light gold-accent">
            <span className="path-card-eyebrow">{uiLanguage === 'es' ? 'Sin compromiso · 10-15 min' : 'No commitment · 10-15 min'}</span>
            <h3>{uiLanguage === 'es' ? 'Práctica diaria' : 'Daily practice'}</h3>
            <p>
              {uiLanguage === 'es'
                ? 'Una sesión corta y guiada centrada en una sola destreza: escucha, lectura, gramática y sintaxis, o vocabulario. Ideal para practicar un poco cada día.'
                : 'A short, guided session focused on a single skill: listening, reading, grammar & syntax, or vocabulary. Perfect for a little practice every day.'}
            </p>
            <a href="?practice=daily" target="_blank" rel="noopener noreferrer" className="btn btn-gold">
              {uiLanguage === 'es' ? 'Empezar práctica diaria' : 'Start daily practice'}
            </a>
          </div>

          <div className="path-card-light wine-accent">
            <span className="path-card-eyebrow">{uiLanguage === 'es' ? 'Riguroso · Nivel CEFR (A1–C2)' : 'Rigorous · CEFR level (A1–C2)'}</span>
            <h3>{uiLanguage === 'es' ? 'Modo examen' : 'Exam mode'}</h3>
            <p>
              {uiLanguage === 'es'
                ? 'Elige una destreza (habla, lectura, escucha o escritura) y tu nivel CEFR exacto, del A1 al C2. ¿No sabes tu nivel? Hay un test rápido por destreza.'
                : 'Choose a skill (speaking, reading, listening, or writing) and your exact CEFR level, from A1 to C2. Not sure of your level? There\'s a quick per-skill test.'}
            </p>
            <a href="#levels" className="btn btn-wine">
              {uiLanguage === 'es' ? 'Ir al modo examen' : 'Go to exam mode'}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
