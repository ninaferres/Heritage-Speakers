import { useState } from 'react';
import { WritingExercise, CefrLevel } from '../../data/types';
import { evaluateWriting } from '../../api/client';
import { ProductionEvaluation } from '../../data/feedback';
import { ProductionFeedback } from './FeedbackPanel';

export function WritingRunner({ exercise, level }: { exercise: WritingExercise; level: CefrLevel }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ProductionEvaluation | null>(null);

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  async function submit() {
    setLoading(true);
    setError(null);
    try {
      const res = await evaluateWriting({ level, prompt: exercise.prompt, text });
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong evaluating your writing.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="exercise-block">
        <h4>Prompt</h4>
        <p>{exercise.prompt}</p>
      </div>

      <textarea
        className="exercise-textarea"
        placeholder="Escribe tu respuesta aquí..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={Boolean(result)}
      />
      <p style={{ color: 'var(--muted)', fontSize: '.85rem', marginTop: '.5rem' }}>
        {wordCount} words (target: {exercise.minWords}–{exercise.maxWords})
      </p>

      {error && <div className="error-box" style={{ marginTop: '1rem' }}>{error}</div>}

      {!result && (
        <button className="btn btn-wine" style={{ marginTop: '1rem' }} disabled={loading || wordCount === 0} onClick={submit}>
          {loading ? 'Evaluating…' : 'Submit for evaluation'}
        </button>
      )}

      {loading && (
        <div className="loading-inline">
          <span className="spinner" /> Analyzing grammar, syntax and word choice…
        </div>
      )}

      {result && <ProductionFeedback result={result} />}
    </div>
  );
}
