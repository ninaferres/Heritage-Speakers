import { useRef, useState } from 'react';
import { ListeningExercise, CefrLevel, AccentId } from '../../data/types';
import { evaluateListening, synthesizeSpeechTTS } from '../../api/client';
import { ComprehensionEvaluation } from '../../data/feedback';
import { ComprehensionFeedback } from './FeedbackPanel';
import { useLanguage } from '../../context/LanguageContext';
import { getString } from '../../i18n/strings';
import { AnalyzingMessages } from './AnalyzingMessages';

export function ListeningRunner({ exercise, level, learningLanguage }: { exercise: ListeningExercise; level: CefrLevel; learningLanguage?: string | null }) {
  const { uiLanguage } = useLanguage();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const accent: AccentId = learningLanguage === 'ru' ? 'ru-RU' : 'es-ES';
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
    setIsPlaying(true);
    setError(null);
    try {
      const audioBlob = await synthesizeSpeechTTS({ text: exercise.transcript, accent });

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
      setError(err instanceof Error ? err.message : 'Failed to generate audio. Please try again.');
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
      const res = await evaluateListening({ level, transcript: exercise.transcript, questions: exercise.questions, answers, learningLanguage });
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
          <h4>{getString('listening.transcript', uiLanguage)}</h4>
          <p style={{ whiteSpace: 'pre-line' }}>{exercise.transcript}</p>
        </div>
      </>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Progress indicator */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ color: 'var(--muted)', fontSize: '.9rem', marginBottom: '.4rem' }}>
          {getString('listening.question', uiLanguage)} {currentQuestionIndex + 1} {getString('listening.of', uiLanguage)} {exercise.questions.length}
        </div>
        <div style={{ height: '6px', backgroundColor: 'var(--line)', borderRadius: '3px', overflow: 'hidden' }}>
          <div
            className="progress-shimmer"
            style={{
              height: '100%',
              backgroundColor: 'var(--gold)',
              width: `${((currentQuestionIndex + 1) / exercise.questions.length) * 100}%`,
              transition: 'width .3s ease',
            }}
          />
        </div>
      </div>

      {/* Audio player (shown on first question only) */}
      {currentQuestionIndex === 0 && (
        <div className="exercise-block" style={{ borderLeftColor: 'var(--wine)', marginBottom: '2rem' }}>
          <h4>{getString('listening.audio', uiLanguage)}</h4>
          <div style={{ display: 'flex', gap: '.8rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-gold btn-small" onClick={playAudio} disabled={isPlaying}>
              {isPlaying ? getString('listening.playing', uiLanguage) : getString('listening.play', uiLanguage)}
            </button>
          </div>
        </div>
      )}

      {/* Current question */}
      <div key={currentQuestionIndex} className="exercise-question" style={{ flex: 1 }}>
        <h4>{currentQuestion.question}</h4>
        {currentQuestion.type === 'open' && (
          <>
            <textarea
              className="exercise-textarea"
              style={{ minHeight: 120 }}
              placeholder={getString('listening.placeholder', uiLanguage)}
              value={answers[currentQuestionIndex]}
              disabled={Boolean(result)}
              onChange={(e) => setAnswers((a) => a.map((v, idx) => (idx === currentQuestionIndex ? e.target.value : v)))}
              autoFocus
            />
            {currentQuestion.hint && <p style={{ color: 'var(--muted)', fontSize: '.85rem', marginTop: '.4rem' }}>{getString('listening.hint', uiLanguage)} {currentQuestion.hint}</p>}
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
          {getString('listening.previous', uiLanguage)}
        </button>
        <button
          className="btn btn-wine"
          style={{ flex: 1 }}
          disabled={loading || !currentAnswered}
          onClick={handleNext}
        >
          {loading ? getString('listening.evaluating', uiLanguage) : isLastQuestion ? getString('listening.finish', uiLanguage) : getString('listening.next', uiLanguage)}
        </button>
      </div>

      {loading && (
        <div className="loading-inline" style={{ marginTop: '1rem' }}>
          <span className="spinner" />
          <AnalyzingMessages
            messages={[
              getString('listening.checking', uiLanguage),
              getString('loading.msg1', uiLanguage),
              getString('loading.msg2', uiLanguage),
              getString('loading.msg3', uiLanguage),
            ]}
          />
        </div>
      )}
    </div>
  );
}
