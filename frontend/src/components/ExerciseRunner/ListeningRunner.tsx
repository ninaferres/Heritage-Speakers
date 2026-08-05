import { useRef, useState } from 'react';
import { ListeningExercise, CefrLevel, AccentId } from '../../data/types';
import { evaluateListening, synthesizeSpeech } from '../../api/client';
import { ComprehensionEvaluation } from '../../data/feedback';
import { ComprehensionFeedback } from './FeedbackPanel';
import { ACCENTS } from '../../data/accents';

export function ListeningRunner({ exercise, level }: { exercise: ListeningExercise; level: CefrLevel }) {
  const [accent, setAccent] = useState<AccentId>(exercise.defaultAccent);
  const [isPlaying, setIsPlaying] = useState(false);
  const [answers, setAnswers] = useState<string[]>(exercise.questions.map(() => ''));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ComprehensionEvaluation | null>(null);
  const ttsRef = useRef<ReturnType<typeof synthesizeSpeech> | null>(null);

  const allAnswered = answers.every((a) => a.trim().length > 0);

  function playAudio() {
    ttsRef.current = synthesizeSpeech({ text: exercise.transcript, accent });
    if (!ttsRef.current.isSupported) {
      setError('Speech synthesis is not supported in your browser. Please use Chrome, Firefox, Safari, or Edge.');
      return;
    }
    setIsPlaying(true);
    ttsRef.current.play();
    setTimeout(() => setIsPlaying(false), 2000);
  }

  async function submit() {
    setLoading(true);
    setError(null);
    try {
      const res = await evaluateListening({ level, transcript: exercise.transcript, questions: exercise.questions, answers });
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong evaluating your answers.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="exercise-block" style={{ borderLeftColor: 'var(--wine)' }}>
        <h4>Audio</h4>
        <div style={{ display: 'flex', gap: '.8rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '0.9rem' }}>
          <select className="accent-select" value={accent} onChange={(e) => setAccent(e.target.value as AccentId)}>
            {ACCENTS.map((a) => (
              <option key={a.id} value={a.id}>{a.label}</option>
            ))}
          </select>
          <button className="btn btn-gold btn-small" onClick={playAudio} disabled={isPlaying}>
            {isPlaying ? 'Playing…' : 'Play audio'}
          </button>
        </div>
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
          <span className="spinner" /> Checking listening accuracy and contextual nuance…
        </div>
      )}

      {result && (
        <>
          <ComprehensionFeedback result={result} />
          <div className="exercise-block" style={{ marginTop: '1.2rem' }}>
            <h4>Transcript</h4>
            <p style={{ whiteSpace: 'pre-line' }}>{exercise.transcript}</p>
          </div>
        </>
      )}
    </div>
  );
}
