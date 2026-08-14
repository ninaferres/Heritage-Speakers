import { useState } from 'react';
import { ErrorDetectionContent } from '../../data/microLessonTypes';

export function ErrorDetectionStep({
  content,
  uiLanguage,
  onComplete,
}: {
  content: ErrorDetectionContent;
  uiLanguage: 'en' | 'es';
  onComplete: (correct: boolean) => void;
}) {
  const [triedWrong, setTriedWrong] = useState<Set<number>>(new Set());
  const [solved, setSolved] = useState(false);
  const [hadMistake, setHadMistake] = useState(false);
  const [flashIndex, setFlashIndex] = useState<number | null>(null);

  function tap(idx: number) {
    if (solved || triedWrong.has(idx)) return;
    if (idx === content.incorrectWordIndex) {
      setSolved(true);
    } else {
      setHadMistake(true);
      setTriedWrong((prev) => new Set(prev).add(idx));
      setFlashIndex(idx);
      setTimeout(() => setFlashIndex(null), 400);
    }
  }

  return (
    <div className="exercise-question">
      <h4>{uiLanguage === 'es' ? 'Toca la palabra que está mal' : 'Tap the word that is wrong'}</h4>

      <div className="word-bank" style={{ marginTop: '1rem' }}>
        {content.words.map((word, idx) => {
          const isTheError = idx === content.incorrectWordIndex;
          let className = 'word-chip pos-other';
          if (solved && isTheError) className = 'word-chip pos-other step-flash-correct';
          else if (flashIndex === idx) className = 'word-chip pos-other step-flash-wrong';
          return (
            <button
              key={idx}
              className={className}
              onClick={() => tap(idx)}
              disabled={solved || triedWrong.has(idx)}
              style={{
                textDecoration: solved && isTheError ? 'line-through' : 'none',
                borderColor: solved && isTheError ? '#2e7d32' : triedWrong.has(idx) ? '#b3261e' : undefined,
              }}
            >
              {word}
            </button>
          );
        })}
      </div>

      {solved && (
        <>
          <div className="exercise-block" style={{ marginTop: '1.2rem' }}>
            <p style={{ margin: 0 }}>
              <strong style={{ color: '#2e7d32' }}>{content.correction}</strong>
            </p>
            <p style={{ color: 'var(--muted)', marginTop: '.4rem', marginBottom: 0 }}>{content.explanation}</p>
          </div>
          <button className="btn btn-wine" style={{ marginTop: '1rem' }} onClick={() => onComplete(!hadMistake)}>
            {uiLanguage === 'es' ? 'Continuar' : 'Continue'}
          </button>
        </>
      )}
    </div>
  );
}
