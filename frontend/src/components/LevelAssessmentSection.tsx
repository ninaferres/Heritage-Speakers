import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { AssessmentModal } from './Assessment/AssessmentModal';

export function LevelAssessmentSection() {
  const { uiLanguage } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <section className="block level-assessment">
      <div className="wrap">
        <span className="eyebrow">{uiLanguage === 'es' ? 'Descubre tu punto de partida' : 'Find your starting point'}</span>
        <h2>{uiLanguage === 'es' ? '¿No sabes tu nivel CEFR?' : "Don't know your CEFR level?"}</h2>
        <p>
          {uiLanguage === 'es'
            ? 'Elige una destreza, habla, lectura, escucha o escritura, y haz un test corto y guiado. En unos minutos sabrás exactamente en qué nivel CEFR estás para esa destreza.'
            : 'Choose a skill, speaking, reading, listening, or writing, and take a short guided test. In a few minutes you\'ll know exactly which CEFR level you\'re at for that skill.'}
        </p>
        <button className="btn btn-gold" onClick={() => setOpen(true)}>
          {uiLanguage === 'es' ? 'Hacer el test de nivel' : 'Take the level test'}
        </button>
      </div>
      {open && <AssessmentModal onClose={() => setOpen(false)} />}
    </section>
  );
}
