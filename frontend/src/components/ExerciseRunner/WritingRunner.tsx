import { useState } from 'react';
import { WritingExercise, CefrLevel } from '../../data/types';
import { evaluateWriting } from '../../api/client';
import { ProductionEvaluation } from '../../data/feedback';
import { ProductionFeedback } from './FeedbackPanel';
import { useLanguage } from '../../context/LanguageContext';
import { useStreaks } from '../../context/StreakContext';
import { getString } from '../../i18n/strings';
import { AnalyzingMessages } from './AnalyzingMessages';

export function WritingRunner({ exercise, level }: { exercise: WritingExercise; level: CefrLevel }) {
  const { uiLanguage, learningLanguage } = useLanguage();
  const { recordCompletion } = useStreaks();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ProductionEvaluation | null>(null);

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  async function submit() {
    setLoading(true);
    setError(null);
    try {
      const res = await evaluateWriting({ level, prompt: exercise.prompt, text, learningLanguage });
      setResult(res);
      recordCompletion('writing', 'exam_mode');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong evaluating your writing.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="exercise-block">
        <h4>{getString('writing.prompt', uiLanguage)}</h4>
        <p>{exercise.prompt}</p>
      </div>

      <textarea
        className="exercise-textarea"
        placeholder={getString('writing.placeholder', uiLanguage)}
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={Boolean(result)}
      />
      <p style={{ color: 'var(--muted)', fontSize: '.85rem', marginTop: '.5rem' }}>
        {wordCount} {getString('writing.wordCount', uiLanguage)} {exercise.minWords}–{exercise.maxWords})
      </p>

      {error && <div className="error-box" style={{ marginTop: '1rem' }}>{error}</div>}

      {!result && (
        <button className="btn btn-wine" style={{ marginTop: '1rem' }} disabled={loading || wordCount === 0} onClick={submit}>
          {loading ? getString('writing.evaluating', uiLanguage) : getString('writing.submit', uiLanguage)}
        </button>
      )}

      {loading && (
        <div className="loading-inline">
          <span className="spinner" />
          <AnalyzingMessages
            messages={[
              getString('writing.analyzing', uiLanguage),
              getString('loading.msg1', uiLanguage),
              getString('loading.msg2', uiLanguage),
              getString('loading.msg3', uiLanguage),
            ]}
          />
        </div>
      )}

      {result && <ProductionFeedback result={result} />}
    </div>
  );
}
