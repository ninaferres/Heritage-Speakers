import { useState } from 'react';
import { SyntaxReorderContent } from '../../data/microLessonTypes';

function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function SyntaxReorderStep({
  content,
  uiLanguage,
  onComplete,
}: {
  content: SyntaxReorderContent;
  uiLanguage: 'en' | 'es';
  onComplete: (correct: boolean) => void;
}) {
  const [bankOrder] = useState(() => shuffle(content.words.map((w, i) => ({ ...w, origIndex: i }))));
  const [placedIndices, setPlacedIndices] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [hadMistake, setHadMistake] = useState(false);
  const [shake, setShake] = useState(false);

  const locked = checked && isCorrect;

  function place(origIndex: number) {
    if (locked) return;
    setPlacedIndices((p) => [...p, origIndex]);
    setChecked(false);
  }
  function unplace(origIndex: number) {
    if (locked) return;
    setPlacedIndices((p) => p.filter((i) => i !== origIndex));
    setChecked(false);
  }
  function check() {
    const correct = placedIndices.length === content.words.length && placedIndices.every((idx, i) => idx === i);
    setChecked(true);
    setIsCorrect(correct);
    if (!correct) {
      setHadMistake(true);
      setShake(true);
      setTimeout(() => setShake(false), 400);
    }
  }

  const bankRemaining = bankOrder.filter((w) => !placedIndices.includes(w.origIndex));

  return (
    <div className="exercise-question">
      <h4>{content.instruction}</h4>

      <div className={`sentence-slot ${shake ? 'step-flash-wrong' : ''} ${locked ? 'step-flash-correct' : ''}`}>
        {placedIndices.length === 0 && (
          <span style={{ color: 'var(--muted)', fontSize: '.9rem' }}>
            {uiLanguage === 'es' ? 'Toca las palabras en orden…' : 'Tap the words in order…'}
          </span>
        )}
        {placedIndices.map((origIndex) => {
          const word = content.words[origIndex];
          return (
            <button key={origIndex} className={`word-chip placed pos-${word.pos}`} onClick={() => unplace(origIndex)} disabled={locked}>
              {word.text}
            </button>
          );
        })}
      </div>

      <div className="word-bank">
        {bankRemaining.map((w) => (
          <button key={w.origIndex} className={`word-chip pos-${w.pos}`} onClick={() => place(w.origIndex)} disabled={locked}>
            {w.text}
          </button>
        ))}
      </div>

      {checked && !isCorrect && (
        <p style={{ color: '#b3261e', marginTop: '1rem', fontWeight: 600 }}>
          {uiLanguage === 'es' ? 'Todavía no — reordena las palabras e inténtalo de nuevo.' : 'Not quite — rearrange the words and try again.'}
        </p>
      )}

      {locked ? (
        <>
          <div className="exercise-block" style={{ marginTop: '1.2rem' }}>
            <p style={{ color: 'var(--muted)', margin: 0 }}>{content.translation}</p>
          </div>
          <button className="btn btn-wine" style={{ marginTop: '1rem' }} onClick={() => onComplete(!hadMistake)}>
            {uiLanguage === 'es' ? 'Continuar' : 'Continue'}
          </button>
        </>
      ) : (
        <button className="btn btn-gold" style={{ marginTop: '1.2rem' }} disabled={placedIndices.length !== content.words.length} onClick={check}>
          {uiLanguage === 'es' ? 'Comprobar' : 'Check'}
        </button>
      )}
    </div>
  );
}
