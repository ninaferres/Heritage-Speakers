import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { fetchDailyLesson, synthesizeSpeechTTS } from '../../api/client';
import { Lesson } from '../../data/lessonTypes';
import { AccentId } from '../../data/types';
import { AnalyzingMessages } from '../ExerciseRunner/AnalyzingMessages';

type Phase = 'vocab' | 'quiz' | 'results';

export function LessonRunner({ onClose }: { onClose: () => void }) {
  const { uiLanguage, learningLanguage, setLearningLanguage, availableLearningLanguages } = useLanguage();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>('vocab');
  const [quizIndex, setQuizIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [playingWord, setPlayingWord] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!learningLanguage) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchDailyLesson(learningLanguage, uiLanguage)
      .then((l) => {
        if (!cancelled) setLesson(l);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : (uiLanguage === 'es' ? 'No se pudo cargar la clase de hoy.' : "Couldn't load today's class."));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [learningLanguage, uiLanguage]);

  async function playWord(text: string) {
    const accent: AccentId = learningLanguage === 'ru' ? 'ru-RU' : 'es-ES';
    setPlayingWord(text);
    try {
      const blob = await synthesizeSpeechTTS({ text, accent });
      const url = URL.createObjectURL(blob);
      if (!audioRef.current) audioRef.current = new Audio();
      audioRef.current.src = url;
      audioRef.current.onended = () => setPlayingWord(null);
      audioRef.current.onerror = () => setPlayingWord(null);
      await audioRef.current.play();
    } catch {
      setPlayingWord(null);
    }
  }

  function selectAnswer(option: string) {
    if (selected || !lesson) return;
    setSelected(option);
    if (option === lesson.quiz[quizIndex].answer) setScore((s) => s + 1);
  }

  function nextQuestion() {
    if (!lesson) return;
    if (quizIndex + 1 < lesson.quiz.length) {
      setQuizIndex((i) => i + 1);
      setSelected(null);
    } else {
      setPhase('results');
    }
  }

  function restart() {
    setPhase('vocab');
    setQuizIndex(0);
    setSelected(null);
    setScore(0);
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
                style={{
                  padding: '1.2rem',
                  border: '2px solid var(--wine)',
                  borderRadius: '12px',
                  background: 'transparent',
                  color: 'var(--wine-ink)',
                  fontWeight: '700',
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                }}
              >
                {lang.nativeLabel}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="exercise-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="exercise-card" role="dialog" aria-modal="true">
        <button className="modal-close" aria-label="Close lesson" onClick={onClose}>✕</button>

        {loading && (
          <>
            <span className="exercise-head-eyebrow">{uiLanguage === 'es' ? 'Clase de hoy' : "Today's class"}</span>
            <div className="loading-inline" style={{ marginTop: '2rem' }}>
              <span className="spinner" />
              <AnalyzingMessages
                messages={
                  uiLanguage === 'es'
                    ? ['Preparando tu clase de hoy…', 'Eligiendo las palabras…', 'Casi listo…']
                    : ["Preparing today's class…", 'Picking the words…', 'Almost ready…']
                }
              />
            </div>
          </>
        )}

        {!loading && error && (
          <>
            <span className="exercise-head-eyebrow">{uiLanguage === 'es' ? 'Clase de hoy' : "Today's class"}</span>
            <h2>{uiLanguage === 'es' ? 'No se pudo cargar la clase' : 'Class unavailable'}</h2>
            <p className="exercise-meta">{error}</p>
          </>
        )}

        {!loading && !error && lesson && phase === 'vocab' && (
          <>
            <span className="exercise-head-eyebrow">{uiLanguage === 'es' ? 'Clase de hoy' : "Today's class"}</span>
            <h2>{lesson.title}</h2>
            <p className="exercise-meta">
              {uiLanguage === 'es' ? 'Escucha y lee cada palabra antes de pasar al repaso.' : 'Listen and read each word before moving on to the quiz.'}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {lesson.vocabulary.map((item, i) => (
                <div key={i} className="exercise-block">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                    <div>
                      <h4 style={{ marginBottom: '.3rem' }}>{item.word}</h4>
                      <p style={{ color: 'var(--muted)', margin: 0 }}>{item.translation}</p>
                    </div>
                    <button
                      className="btn btn-gold btn-small"
                      onClick={() => playWord(item.word)}
                      disabled={playingWord === item.word}
                    >
                      {playingWord === item.word
                        ? (uiLanguage === 'es' ? 'Reproduciendo…' : 'Playing…')
                        : (uiLanguage === 'es' ? 'Escuchar' : 'Listen')}
                    </button>
                  </div>
                  <p style={{ marginTop: '.9rem', fontStyle: 'italic' }}>{item.example}</p>
                  <p style={{ color: 'var(--muted)', margin: 0 }}>{item.exampleTranslation}</p>
                </div>
              ))}
            </div>

            <button className="btn btn-wine" style={{ marginTop: '1.5rem' }} onClick={() => setPhase('quiz')}>
              {uiLanguage === 'es' ? 'Pasar al repaso' : 'Move to the quiz'}
            </button>
          </>
        )}

        {!loading && !error && lesson && phase === 'quiz' && (
          <>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ color: 'var(--muted)', fontSize: '.9rem', marginBottom: '.4rem' }}>
                {uiLanguage === 'es' ? 'Pregunta' : 'Question'} {quizIndex + 1} {uiLanguage === 'es' ? 'de' : 'of'} {lesson.quiz.length}
              </div>
              <div style={{ height: '6px', backgroundColor: 'var(--line)', borderRadius: '3px', overflow: 'hidden' }}>
                <div
                  className="progress-shimmer"
                  style={{
                    height: '100%',
                    backgroundColor: 'var(--gold)',
                    width: `${((quizIndex + 1) / lesson.quiz.length) * 100}%`,
                    transition: 'width .3s ease',
                  }}
                />
              </div>
            </div>

            <div key={quizIndex} className="exercise-question">
              <h4>{lesson.quiz[quizIndex].question}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.7rem', marginTop: '1rem' }}>
                {lesson.quiz[quizIndex].options.map((option) => {
                  const isCorrect = option === lesson.quiz[quizIndex].answer;
                  const isSelected = option === selected;
                  let borderColor = 'var(--line)';
                  let background = 'transparent';
                  if (selected) {
                    if (isCorrect) {
                      borderColor = '#2e7d32';
                      background = 'rgba(46,125,50,.08)';
                    } else if (isSelected) {
                      borderColor = '#b3261e';
                      background = 'rgba(179,38,30,.08)';
                    }
                  }
                  return (
                    <button
                      key={option}
                      onClick={() => selectAnswer(option)}
                      disabled={Boolean(selected)}
                      style={{
                        textAlign: 'left',
                        padding: '.9rem 1.1rem',
                        borderRadius: '10px',
                        border: `1.5px solid ${borderColor}`,
                        background,
                        cursor: selected ? 'default' : 'pointer',
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: '1rem',
                        color: 'var(--ink)',
                      }}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>

            {selected && (
              <button className="btn btn-wine" style={{ marginTop: '1.5rem' }} onClick={nextQuestion}>
                {quizIndex + 1 < lesson.quiz.length
                  ? (uiLanguage === 'es' ? 'Siguiente' : 'Next')
                  : (uiLanguage === 'es' ? 'Ver resultado' : 'See result')}
              </button>
            )}
          </>
        )}

        {!loading && !error && lesson && phase === 'results' && (
          <>
            <span className="exercise-head-eyebrow">{uiLanguage === 'es' ? 'Clase de hoy' : "Today's class"}</span>
            <h2>
              {score}/{lesson.quiz.length} {uiLanguage === 'es' ? 'correctas' : 'correct'}
            </h2>
            <p className="exercise-meta">
              {uiLanguage === 'es'
                ? 'Repite la clase tantas veces como quieras hasta que te las sepas de memoria.'
                : 'Repeat the class as many times as you like until you know them by heart.'}
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button className="btn btn-wine" style={{ flex: 1 }} onClick={restart}>
                {uiLanguage === 'es' ? 'Repetir clase' : 'Repeat class'}
              </button>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={onClose}>
                {uiLanguage === 'es' ? 'Cerrar' : 'Close'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
