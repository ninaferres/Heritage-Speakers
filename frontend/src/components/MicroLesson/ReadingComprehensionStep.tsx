import { useState } from 'react';
import { ReadingComprehensionContent } from '../../data/microLessonTypes';

export function ReadingComprehensionStep({
  content,
  uiLanguage,
  onComplete,
}: {
  content: ReadingComprehensionContent;
  uiLanguage: 'en' | 'es';
  onComplete: (correct: boolean) => void;
}) {
  const [answers, setAnswers] = useState<(string | null)[]>(content.questions.map(() => null));
  const [checked, setChecked] = useState(false);

  const allAnswered = answers.every((a) => a !== null);

  function select(qIdx: number, option: string) {
    if (checked) return;
    setAnswers((prev) => prev.map((a, i) => (i === qIdx ? option : a)));
  }

  const allCorrect = checked && content.questions.every((q, i) => answers[i] === q.answer);

  return (
    <div className="exercise-question">
      <div className="exercise-block">
        <h4>{uiLanguage === 'es' ? 'Lectura' : 'Reading'}</h4>
        <p style={{ lineHeight: 1.75 }}>{content.passage}</p>
      </div>

      {content.questions.map((q, qIdx) => (
        <div key={qIdx} style={{ marginTop: '1.2rem' }}>
          <p style={{ fontWeight: 600, marginBottom: '.6rem' }}>{q.question}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
            {q.options.map((option) => {
              const isCorrect = option === q.answer;
              const isSelected = option === answers[qIdx];
              let borderColor = 'var(--line)';
              let background = 'transparent';
              if (checked) {
                if (isCorrect) {
                  borderColor = '#2e7d32';
                  background = 'rgba(46,125,50,.08)';
                } else if (isSelected) {
                  borderColor = '#b3261e';
                  background = 'rgba(179,38,30,.08)';
                }
              } else if (isSelected) {
                borderColor = 'var(--gold)';
                background = 'rgba(184,147,90,.1)';
              }
              return (
                <button
                  key={option}
                  onClick={() => select(qIdx, option)}
                  disabled={checked}
                  style={{
                    textAlign: 'left',
                    padding: '.75rem 1rem',
                    borderRadius: '10px',
                    border: `1.5px solid ${borderColor}`,
                    background,
                    cursor: checked ? 'default' : 'pointer',
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: '.95rem',
                    color: 'var(--ink)',
                  }}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {!checked ? (
        <button className="btn btn-gold" style={{ marginTop: '1.4rem' }} disabled={!allAnswered} onClick={() => setChecked(true)}>
          {uiLanguage === 'es' ? 'Comprobar respuestas' : 'Check answers'}
        </button>
      ) : (
        <button className="btn btn-wine" style={{ marginTop: '1.4rem' }} onClick={() => onComplete(allCorrect)}>
          {uiLanguage === 'es' ? 'Continuar' : 'Continue'}
        </button>
      )}
    </div>
  );
}
