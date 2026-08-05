import { useState } from 'react';
import { ReadingExercise, CefrLevel } from '../../data/types';
import { evaluateReading } from '../../api/client';
import { ComprehensionEvaluation } from '../../data/feedback';
import { ComprehensionFeedback } from './FeedbackPanel';

export function ReadingRunner({ exercise, level }: { exercise: ReadingExercise; level: CefrLevel }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>(exercise.questions.map(() => ''));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ComprehensionEvaluation | null>(null);

  const currentQuestion = exercise.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === exercise.questions.length - 1;
  const currentAnswered = answers[currentQuestionIndex]?.trim().length > 0;

  async function handleNext() {
    if (isLastQuestion) {
      submit();
    } else {
      setCurrentQuestionIndex((i) => i + 1);
      setError(null);
    }
  }

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

  if (result) {
    return <ComprehensionFeedback result={result} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Progress indicator */}
      <div style={{ marginBottom: '1.5rem', color: 'var(--muted)', fontSize: '.9rem' }}>
        Question {currentQuestionIndex + 1} of {exercise.questions.length}
      </div>

      {/* Text (shown once at top) */}
      {currentQuestionIndex === 0 && (
        <div className="exercise-block" style={{ marginBottom: '2rem' }}>
          <h4>Text</h4>
          <p>{exercise.passage}</p>
        </div>
      )}

      {/* Current question */}
      <div className="exercise-question" style={{ flex: 1 }}>
        <h4>{currentQuestion.question}</h4>
        {currentQuestion.type === 'open' && (
          <>
            <textarea
              className="exercise-textarea"
              style={{ minHeight: 120 }}
              placeholder="Write your answer here..."
              value={answers[currentQuestionIndex]}
              disabled={Boolean(result)}
              onChange={(e) => setAnswers((a) => a.map((v, idx) => (idx === currentQuestionIndex ? e.target.value : v)))}
              autoFocus
            />
            {currentQuestion.hint && <p style={{ color: 'var(--muted)', fontSize: '.85rem', marginTop: '.4rem' }}>Hint: {currentQuestion.hint}</p>}
          </>
        )}
      </div>

      {error && <div className="error-box" style={{ marginTop: '1rem', marginBottom: '1rem' }}>{error}</div>}

      {/* Navigation buttons */}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
        <button
          className="btn btn-outline"
          disabled={currentQuestionIndex === 0 || loading}
          onClick={() => setCurrentQuestionIndex((i) => i - 1)}
        >
          ← Previous
        </button>
        <button
          className="btn btn-wine"
          style={{ flex: 1 }}
          disabled={loading || !currentAnswered}
          onClick={handleNext}
        >
          {loading ? 'Evaluating…' : isLastQuestion ? 'Finish & Review' : 'Next →'}
        </button>
      </div>

      {loading && (
        <div className="loading-inline" style={{ marginTop: '1rem' }}>
          <span className="spinner" /> Checking comprehension…
        </div>
      )}
    </div>
  );
}
