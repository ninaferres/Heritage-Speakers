import { useRef, useState, useEffect } from 'react';
import { ListeningExercise, CefrLevel, AccentId } from '../../data/types';
import { evaluateListening, synthesizeSpeechTTS } from '../../api/client';
import { ComprehensionEvaluation } from '../../data/feedback';
import { ComprehensionFeedback } from './FeedbackPanel';
import { ACCENTS } from '../../data/accents';

export function ListeningRunner({ exercise, level, learningLanguage }: { exercise: ListeningExercise; level: CefrLevel; learningLanguage?: string }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [accent, setAccent] = useState<AccentId | undefined>(() => {
    if (learningLanguage === 'ru') return 'ru-RU';
    return exercise.defaultAccent;
  });

  useEffect(() => {
    if (learningLanguage === 'ru') {
      setAccent('ru-RU');
    } else if (learningLanguage === 'es') {
      setAccent(exercise.defaultAccent || 'es-ES');
    }
  }, [learningLanguage, exercise.defaultAccent]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [answers, setAnswers] = useState<string[]>(exercise.questions.map(() => ''));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ComprehensionEvaluation | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentQuestion = exercise.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === exercise.questions.length - 1;
  const currentAnswered = answers[currentQuestionIndex]?.trim().length > 0;

  async function playAudio() {
    if (!accent) {
      setError('Audio playback is not available for this exercise language.');
      return;
    }
    setIsPlaying(true);
    setError(null);
    try {
      const audioBlob = await synthesizeSpeechTTS({ text: exercise.transcript, accent });
      if (!audioBlob) {
        setError('Failed to generate audio. Please try again.');
        setIsPlaying(false);
        return;
      }

      const audioUrl = URL.createObjectURL(audioBlob);
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }
      audioRef.current.src = audioUrl;
      audioRef.current.play();

      audioRef.current.onended = () => {
        setIsPlaying(false);
      };

      audioRef.current.onerror = () => {
        setError('Error playing audio. Please try again.');
        setIsPlaying(false);
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error playing audio');
      setIsPlaying(false);
    }
  }

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
      const res = await evaluateListening({ level, transcript: exercise.transcript, questions: exercise.questions, answers });
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong evaluating your answers.');
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    return (
      <>
        <ComprehensionFeedback result={result} />
        <div className="exercise-block" style={{ marginTop: '1.2rem' }}>
          <h4>Transcript</h4>
          <p style={{ whiteSpace: 'pre-line' }}>{exercise.transcript}</p>
        </div>
      </>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Progress indicator */}
      <div style={{ marginBottom: '1.5rem', color: 'var(--muted)', fontSize: '.9rem' }}>
        Question {currentQuestionIndex + 1} of {exercise.questions.length}
      </div>

      {/* Audio player (shown on first question only) */}
      {currentQuestionIndex === 0 && (
        <div className="exercise-block" style={{ borderLeftColor: 'var(--wine)', marginBottom: '2rem' }}>
          <h4>Audio</h4>
          <div style={{ display: 'flex', gap: '.8rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <select className="accent-select" value={accent} onChange={(e) => setAccent(e.target.value as AccentId)}>
              {ACCENTS.filter((a) => {
                const isRussian = learningLanguage === 'ru';
                return isRussian ? a.id.startsWith('ru') : a.id.startsWith('es');
              }).map((a) => (
                <option key={a.id} value={a.id}>{a.label}</option>
              ))}
            </select>
            <button className="btn btn-gold btn-small" onClick={playAudio} disabled={isPlaying}>
              {isPlaying ? 'Playing…' : 'Play audio'}
            </button>
          </div>
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
          <span className="spinner" /> Checking listening accuracy…
        </div>
      )}
    </div>
  );
}
