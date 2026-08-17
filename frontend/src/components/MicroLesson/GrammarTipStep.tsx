import { GrammarTipContent } from '../../data/microLessonTypes';

export function GrammarTipStep({
  content,
  uiLanguage,
  onContinue,
}: {
  content: GrammarTipContent;
  uiLanguage: 'en' | 'es';
  onContinue: () => void;
}) {
  return (
    <div className="exercise-question">
      <span style={{ color: 'var(--gold)', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', fontSize: '.72rem' }}>
        {uiLanguage === 'es' ? 'Punto de gramática' : 'Grammar point'}
      </span>
      <h4 style={{ marginTop: '.5rem', fontSize: '1.15rem' }}>{content.title}</h4>
      <p style={{ lineHeight: 1.7, marginTop: '.6rem' }}>{content.explanation}</p>
      <div className="exercise-block" style={{ marginTop: '1rem' }}>
        <p style={{ fontWeight: 600 }}>{content.example}</p>
        {content.examplePhonetic && content.examplePhonetic !== content.example && (
          <p style={{ fontStyle: 'italic', color: 'var(--gold)', margin: '.2rem 0' }}>{content.examplePhonetic}</p>
        )}
        <p style={{ color: 'var(--muted)', margin: 0 }}>{content.exampleTranslation}</p>
      </div>
      <button className="btn btn-wine" style={{ marginTop: '1.4rem' }} onClick={onContinue}>
        {uiLanguage === 'es' ? 'Entendido, continuar' : 'Got it, continue'}
      </button>
    </div>
  );
}
