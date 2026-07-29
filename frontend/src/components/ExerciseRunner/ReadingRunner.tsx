import { useState } from 'react';
import { ReadingExercise, CefrLevel } from '../../data/types';
import { evaluateReading } from '../../api/client';
import { ComprehensionEvaluation } from '../../data/feedback';
import { ComprehensionFeedback } from './FeedbackPanel';

export function ReadingRunner({ exercise, level }: { exercise: ReadingExercise; level: CefrLevel }) {
  const [answers, setAnswers] = useState<string[]>(exercise.questions.map(() => ''));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ComprehensionEvaluation | null>(null);

  const allAnswered = answers.every((a) => a.trim().length > 0);

  async function submit() {
    setLoading(true);
    setError(null);
    try {
      const res = await evaluateReading({ level, passage: exercise.passage, questions: exercise.questions, answers });
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong evaluating your answers.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="exercise-block">
        <h4>Text</h4>
        <p>{exercise.passage}</p>
      </div>

      {exercise.questions.map((q, i) => (
        <div className="exercise-question" key={i}>
          <h4>Question {i + 1}: {q.question}</h4>
          {q.type === 'open' && (
            <>
              <textarea
                className="exercise-textarea"
                style={{ minHeight: 90 }}
                value={answers[i]}
                disabled={Boolean(result)}
                onChange={(e) => setAnswers((a) => a.map((v, idx) => (idx === i ? e.target.value : v)))}
              />
              {q.hint && <p style={{ color: 'var(--muted)', fontSize: '.85rem', marginTop: '.4rem' }}>Hint: {q.hint}</p>}
            </>
          )}
        </div>
      ))}

      {error && <div className="error-box" style={{ marginBottom: '1rem' }}>{error}</div>}

      {!result && (
        <button className="btn btn-wine" disabled={loading || !allAnswered} onClick={submit}>
          {loading ? 'Evaluating…' : 'Submit answers'}
        </button>
      )}

      {loading && (
        <div className="loading-inline">
          <span className="spinner" /> Checking comprehension, syntax and vocabulary use…
        </div>
      )}

      {result && <ComprehensionFeedback result={result} />}
    </div>
  );
}
