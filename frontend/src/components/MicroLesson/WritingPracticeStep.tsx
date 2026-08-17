import { useState } from 'react';
import { WritingPromptContent } from '../../data/microLessonTypes';
import { CefrLevel } from '../../data/types';
import { evaluateWriting } from '../../api/client';
import { ProductionEvaluation } from '../../data/feedback';
import { ProductionFeedback } from '../ExerciseRunner/FeedbackPanel';

const PASS_SCORE = 55;

const REGISTER_LABEL = {
  casual: { es: 'Informal', en: 'Casual' },
  professional: { es: 'Profesional', en: 'Professional' },
};

export function WritingPracticeStep({
  content,
  uiLanguage,
  learningLanguage,
  level,
  onComplete,
}: {
  content: WritingPromptContent;
  uiLanguage: 'en' | 'es';
  learningLanguage: string | null;
  level: CefrLevel;
  onComplete: (correct: boolean) => void;
}) {
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ProductionEvaluation | null>(null);

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const prompt = `${content.scenario} ${content.instructions}`;

  async function submit() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await evaluateWriting({ level, prompt, text, learningLanguage });
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : (uiLanguage === 'es' ? 'No se pudo evaluar el texto.' : 'Could not evaluate the text.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="exercise-question">
      <div className="exercise-block" style={{ borderLeftColor: content.register === 'casual' ? 'var(--gold)' : 'var(--wine)' }}>
        <span
          style={{
            display: 'inline-block',
            fontSize: '.7rem',
            fontWeight: 700,
            letterSpacing: '.08em',
            textTransform: 'uppercase',
            color: content.register === 'casual' ? 'var(--gold)' : 'var(--wine)',
            marginBottom: '.6rem',
          }}
        >
          {REGISTER_LABEL[content.register][uiLanguage]}
        </span>
        <p style={{ fontSize: '1.02rem', lineHeight: 1.7, marginBottom: '.6rem' }}>{content.scenario}</p>
        <p style={{ color: 'var(--muted)', margin: 0 }}>{content.instructions}</p>
      </div>

      <textarea
        className="exercise-textarea"
        placeholder={uiLanguage === 'es' ? 'Escribe tu respuesta aquí…' : 'Write your answer here…'}
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={Boolean(result)}
      />
      <p style={{ color: 'var(--muted)', fontSize: '.85rem', marginTop: '.5rem' }}>
        {wordCount} {uiLanguage === 'es' ? 'palabras (objetivo:' : 'words (target:'} {content.minWords}–{content.maxWords})
      </p>

      {error && <div className="error-box" style={{ marginTop: '1rem' }}>{error}</div>}

      {!result && (
        <button className="btn btn-wine" style={{ marginTop: '1rem' }} disabled={submitting || wordCount === 0} onClick={submit}>
          {submitting ? (uiLanguage === 'es' ? 'Evaluando…' : 'Evaluating…') : (uiLanguage === 'es' ? 'Enviar' : 'Submit')}
        </button>
      )}

      {result && (
        <>
          <ProductionFeedback result={result} />
          <button className="btn btn-wine" style={{ marginTop: '1.4rem' }} onClick={() => onComplete(result.score >= PASS_SCORE)}>
            {uiLanguage === 'es' ? 'Continuar' : 'Continue'}
          </button>
        </>
      )}
    </div>
  );
}
