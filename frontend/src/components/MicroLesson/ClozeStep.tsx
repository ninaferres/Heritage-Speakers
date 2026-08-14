import { useState } from 'react';
import { ClozeContent } from '../../data/microLessonTypes';

export function ClozeStep({
  content,
  uiLanguage,
  onComplete,
}: {
  content: ClozeContent;
  uiLanguage: 'en' | 'es';
  onComplete: (correct: boolean) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  function select(option: string) {
    if (selected) return;
    setSelected(option);
  }

  return (
    <div className="exercise-question">
      <h4>
        {content.before} <span style={{ display: 'inline-block', minWidth: '70px', borderBottom: '2px solid var(--gold)' }}>&nbsp;</span> {content.after}
      </h4>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '.7rem', marginTop: '1rem' }}>
        {content.options.map((option) => {
          const isCorrect = option === content.answer;
          const isSelected = option === selected;
          let borderColor = 'var(--line)';
          let background = 'transparent';
          if (selected) {
            if (isCorrect) {
              borderColor = '#2e7d32';
              background = 'rgba(46,125,50,.08)';
            } else if (isSelected) {
              borderColor = '#b3261e';
              background = 'rgba(179,38,30,.08)';
            }
          }
          return (
            <button
              key={option}
              onClick={() => select(option)}
              disabled={Boolean(selected)}
              style={{
                textAlign: 'left',
                padding: '.9rem 1.1rem',
                borderRadius: '10px',
                border: `1.5px solid ${borderColor}`,
                background,
                cursor: selected ? 'default' : 'pointer',
                fontFamily: "'Outfit', sans-serif",
                fontSize: '1rem',
                color: 'var(--ink)',
              }}
            >
              {option}
            </button>
          );
        })}
      </div>

      {selected && (
        <button className="btn btn-wine" style={{ marginTop: '1.5rem' }} onClick={() => onComplete(selected === content.answer)}>
          {uiLanguage === 'es' ? 'Continuar' : 'Continue'}
        </button>
      )}
    </div>
  );
}
