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

  // Safety net: if the AI's incorrectWordIndex doesn't line up with a real word (or the
  // intended word turns out unguessable), tapping through every option would otherwise leave
  // the learner stuck forever with no way to reach "Continue". Once every word has been tried,
  // reveal the answer and unlock progress instead of soft-locking the exercise.
  const allTried = !solved && triedWrong.size >= content.words.length;
  const revealed = solved || allTried;

  function tap(idx: number) {
    if (revealed || triedWrong.has(idx)) return;
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
          if (revealed && isTheError) className = 'word-chip pos-other step-flash-correct';
          else if (flashIndex === idx) className = 'word-chip pos-other step-flash-wrong';
          return (
            <button
              key={idx}
              className={className}
              onClick={() => tap(idx)}
              disabled={revealed || triedWrong.has(idx)}
              style={{
                textDecoration: revealed && isTheError ? 'line-through' : 'none',
                borderColor: revealed && isTheError ? '#2e7d32' : triedWrong.has(idx) ? '#b3261e' : undefined,
              }}
            >
              {word}
            </button>
          );
        })}
      </div>

      {revealed && (
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
