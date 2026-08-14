import { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { fetchDailyMicroLesson } from '../../api/client';
import { MicroLesson } from '../../data/microLessonTypes';
import { AnalyzingMessages } from '../ExerciseRunner/AnalyzingMessages';
import { GrammarTipStep } from './GrammarTipStep';
import { VocabMatchStep } from './VocabMatchStep';
import { SyntaxReorderStep } from './SyntaxReorderStep';
import { ErrorDetectionStep } from './ErrorDetectionStep';
import { ClozeStep } from './ClozeStep';

export function MicroLessonRunner({ onClose, onRequestExam }: { onClose: () => void; onRequestExam: () => void }) {
  const { uiLanguage, learningLanguage, setLearningLanguage, availableLearningLanguages } = useLanguage();
  const [lesson, setLesson] = useState<MicroLesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);
  const [startedAt] = useState(() => Date.now());
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (!learningLanguage) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchDailyMicroLesson(learningLanguage, uiLanguage)
      .then((l) => {
        if (!cancelled) setLesson(l);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : (uiLanguage === 'es' ? 'No se pudo cargar la práctica de hoy.' : "Couldn't load today's practice."));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [learningLanguage, uiLanguage]);

  function handleContinue() {
    if (!lesson) return;
    if (stepIndex + 1 < lesson.steps.length) {
      setStepIndex((i) => i + 1);
    } else {
      setFinished(true);
    }
  }

  function handleGradedComplete(correct: boolean) {
    setResults((r) => [...r, correct]);
    handleContinue();
  }

  function restart() {
    setStepIndex(0);
    setResults([]);
    setFinished(false);
  }

  if (!learningLanguage) {
    const activeLanguages = availableLearningLanguages.filter((l) => l.status === 'active');
    return (
      <div className="exercise-overlay">
        <div className="exercise-card" style={{ maxWidth: '600px' }}>
          <button className="modal-close" aria-label="Close" onClick={onClose}>✕</button>
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--wine-ink)' }}>
            {uiLanguage === 'es' ? 'Elige primero qué idioma quieres aprender' : 'Choose a language to learn first'}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {activeLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLearningLanguage(lang.code)}
                style={{ padding: '1.2rem', border: '2px solid var(--wine)', borderRadius: '12px', background: 'transparent', color: 'var(--wine-ink)', fontWeight: '700', fontSize: '1.1rem', cursor: 'pointer' }}
              >
                {lang.nativeLabel}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const gradedTotal = lesson ? lesson.steps.filter((s) => s.type !== 'grammar_tip').length : 0;
  const accuracy = results.length > 0 ? Math.round((results.filter(Boolean).length / results.length) * 100) : 0;
  const minutesSpent = Math.max(1, Math.round((Date.now() - startedAt) / 60000));

  return (
    <div className="exercise-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="exercise-card" role="dialog" aria-modal="true">
        <button className="modal-close" aria-label="Close daily practice" onClick={onClose}>✕</button>

        {loading && (
          <>
            <span className="exercise-head-eyebrow">{uiLanguage === 'es' ? 'Práctica diaria' : 'Daily practice'}</span>
            <div className="loading-inline" style={{ marginTop: '2rem' }}>
              <span className="spinner" />
              <AnalyzingMessages
                messages={
                  uiLanguage === 'es'
                    ? ['Preparando tu práctica de hoy…', 'Eligiendo el punto de gramática…', 'Casi listo…']
                    : ["Preparing today's practice…", 'Picking a grammar point…', 'Almost ready…']
                }
              />
            </div>
          </>
        )}

        {!loading && error && (
          <>
            <span className="exercise-head-eyebrow">{uiLanguage === 'es' ? 'Práctica diaria' : 'Daily practice'}</span>
            <h2>{uiLanguage === 'es' ? 'No se pudo cargar' : 'Unavailable'}</h2>
            <p className="exercise-meta">{error}</p>
          </>
        )}

        {!loading && !error && lesson && !finished && (
          <>
            <span className="exercise-head-eyebrow">{lesson.grammarConcept}</span>
            <h2 style={{ marginBottom: '.6rem' }}>{lesson.title}</h2>

            <div style={{ display: 'flex', gap: '.4rem', alignItems: 'center', marginBottom: '1.6rem' }}>
              {lesson.steps.map((s, i) => (
                <span
                  key={s.id}
                  className={`micro-step-progress-dot ${i < stepIndex ? 'done' : ''} ${i === stepIndex ? 'current' : ''}`}
                />
              ))}
            </div>

            {(() => {
              const step = lesson.steps[stepIndex];
              switch (step.type) {
                case 'grammar_tip':
                  return <GrammarTipStep content={step.content} uiLanguage={uiLanguage} onContinue={handleContinue} />;
                case 'vocab_match':
                  return <VocabMatchStep content={step.content} uiLanguage={uiLanguage} onComplete={handleGradedComplete} />;
                case 'syntax_reorder':
                  return <SyntaxReorderStep content={step.content} uiLanguage={uiLanguage} onComplete={handleGradedComplete} />;
                case 'error_detection':
                  return <ErrorDetectionStep content={step.content} uiLanguage={uiLanguage} onComplete={handleGradedComplete} />;
                case 'cloze':
                  return <ClozeStep content={step.content} uiLanguage={uiLanguage} onComplete={handleGradedComplete} />;
              }
            })()}
          </>
        )}

        {!loading && !error && lesson && finished && (
          <>
            <span className="exercise-head-eyebrow">{uiLanguage === 'es' ? '¡Práctica completada!' : 'Practice complete!'}</span>
            <h2 style={{ marginBottom: '1rem' }}>{lesson.title}</h2>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <div className="exercise-block" style={{ flex: '1 1 140px' }}>
                <h4>{uiLanguage === 'es' ? 'Precisión' : 'Accuracy'}</h4>
                <p style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--wine-ink)', margin: 0 }}>{accuracy}%</p>
                <p style={{ color: 'var(--muted)', margin: 0 }}>
                  {results.filter(Boolean).length}/{gradedTotal} {uiLanguage === 'es' ? 'correctas' : 'correct'}
                </p>
              </div>
              <div className="exercise-block" style={{ flex: '1 1 140px' }}>
                <h4>{uiLanguage === 'es' ? 'Tiempo' : 'Time'}</h4>
                <p style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--wine-ink)', margin: 0 }}>
                  {minutesSpent} {uiLanguage === 'es' ? 'min' : 'min'}
                </p>
              </div>
            </div>

            <p className="exercise-meta">
              {uiLanguage === 'es'
                ? `Hoy trabajaste: ${lesson.grammarConcept}. Repite la práctica cuando quieras para reforzarlo.`
                : `Today's focus: ${lesson.grammarConcept}. Repeat the practice anytime to reinforce it.`}
            </p>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              <button className="btn btn-wine" style={{ flex: '1 1 160px' }} onClick={restart}>
                {uiLanguage === 'es' ? 'Repetir práctica' : 'Repeat practice'}
              </button>
              <button className="btn btn-gold" style={{ flex: '1 1 160px' }} onClick={onRequestExam}>
                {uiLanguage === 'es' ? 'Probar el modo examen' : 'Try the exam version'}
              </button>
              <button className="btn btn-outline" style={{ flex: '1 1 160px' }} onClick={onClose}>
                {uiLanguage === 'es' ? 'Cerrar' : 'Close'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
