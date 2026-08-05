import { useState, useRef, useEffect } from 'react';
import { ExerciseIntro } from '../../data/exerciseIntros';

interface Props {
  intro: ExerciseIntro;
  onStartExercise: () => void;
}

export function ExerciseIntroduction({ intro, onStartExercise }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSubtitleIndex, setCurrentSubtitleIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const synth = useRef<SpeechSynthesisUtterance | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  function playIntroduction() {
    window.speechSynthesis.cancel();
    if (timerRef.current) clearInterval(timerRef.current);

    const fullText = `${intro.explanationEs} ${intro.example || ''}`;
    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.lang = 'es-ES';
    utterance.rate = 0.85;

    startTimeRef.current = Date.now();
    setIsPlaying(true);
    setCurrentSubtitleIndex(0);
    setProgress(0);

    utterance.onstart = () => {
      timerRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        setProgress(elapsed);

        let subtitleIdx = 0;
        for (let i = intro.subtitles.length - 1; i >= 0; i--) {
          if (intro.subtitles[i].time <= elapsed) {
            subtitleIdx = i;
            break;
          }
        }
        setCurrentSubtitleIndex(subtitleIdx);
      }, 100);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      if (timerRef.current) clearInterval(timerRef.current);
      setCurrentSubtitleIndex(0);
      setProgress(0);
    };

    synth.current = utterance;
    window.speechSynthesis.speak(utterance);
  }

  function stopPlayback() {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }

  const currentSubtitle = intro.subtitles[currentSubtitleIndex];

  return (
    <div className="exercise-overlay">
      <div className="exercise-card" style={{ display: 'flex', flexDirection: 'column', maxWidth: '800px' }}>
        <button className="modal-close" aria-label="Close" onClick={onStartExercise}>✕</button>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{intro.icon}</div>
          <h2 style={{ color: 'var(--wine-ink)', marginBottom: '0.5rem', fontSize: '1.8rem' }}>
            {intro.topic}
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Introducción al ejercicio</p>
        </div>

        <div
          style={{
            flex: 1,
            padding: '2rem',
            backgroundColor: 'rgba(107,31,46,.05)',
            borderRadius: '12px',
            marginBottom: '2rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <p style={{ color: 'var(--charcoal)', lineHeight: 1.8, marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              {intro.explanationEs}
            </p>

            {intro.example && (
              <div
                style={{
                  padding: '1rem',
                  backgroundColor: 'rgba(184,147,90,.1)',
                  borderLeft: '4px solid var(--gold)',
                  borderRadius: '4px',
                  marginBottom: '1.5rem',
                }}
              >
                <p style={{ color: 'var(--wine-ink)', fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  Ejemplo:
                </p>
                <p style={{ color: 'var(--charcoal)', fontStyle: 'italic', margin: 0, fontSize: '0.9rem' }}>
                  {intro.example}
                </p>
              </div>
            )}
          </div>

          <div
            style={{
              minHeight: '120px',
              padding: '1.5rem',
              backgroundColor: 'var(--bone)',
              borderRadius: '8px',
              borderLeft: '4px solid var(--gold)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--wine-ink)', marginBottom: '1rem', textTransform: 'uppercase' }}>
              📝 Subtítulos
            </div>
            {isPlaying ? (
              currentSubtitle ? (
                <div>
                  <p style={{ color: 'var(--wine-ink)', margin: '0.5rem 0', fontSize: '1.1rem', fontWeight: '600', lineHeight: 1.4 }}>
                    {currentSubtitle.es}
                  </p>
                  <p style={{ color: 'var(--muted)', margin: '0.5rem 0', fontSize: '1rem', fontStyle: 'italic', lineHeight: 1.4 }}>
                    {currentSubtitle.en}
                  </p>
                </div>
              ) : (
                <p style={{ color: 'var(--muted)', margin: 0, fontSize: '0.95rem' }}>
                  Cargando...
                </p>
              )
            ) : (
              <p style={{ color: 'var(--muted)', margin: 0, fontSize: '0.95rem', textAlign: 'center', padding: '1rem 0' }}>
                Presiona "Escuchar Explicación" para ver los subtítulos en español e inglés sincronizados
              </p>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          {!isPlaying ? (
            <button
              onClick={playIntroduction}
              style={{
                flex: 1,
                padding: '1rem',
                fontSize: '1rem',
                borderRadius: '8px',
                border: '2px solid var(--wine)',
                background: 'var(--wine)',
                color: 'var(--bone)',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all .2s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(107,31,46,.9)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'var(--wine)';
              }}
            >
              🔊 Escuchar Explicación
            </button>
          ) : (
            <button
              onClick={stopPlayback}
              style={{
                flex: 1,
                padding: '1rem',
                fontSize: '1rem',
                borderRadius: '8px',
                border: 'none',
                background: '#d32f2f',
                color: 'white',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all .2s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = '#b71c1c';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = '#d32f2f';
              }}
            >
              ⏹️ Detener
            </button>
          )}

          <button
            onClick={onStartExercise}
            style={{
              flex: 1,
              padding: '1rem',
              fontSize: '1rem',
              borderRadius: '8px',
              border: '2px solid var(--gold)',
              background: 'transparent',
              color: 'var(--gold)',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all .2s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(184,147,90,.1)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
            }}
          >
            Empezar Ejercicio →
          </button>
        </div>

        {isPlaying && (
          <div style={{ marginBottom: '1rem' }}>
            <div
              style={{
                height: '4px',
                backgroundColor: 'var(--line)',
                borderRadius: '2px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  backgroundColor: 'var(--gold)',
                  width: `${progress * 10}%`,
                  transition: 'width .1s linear',
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
