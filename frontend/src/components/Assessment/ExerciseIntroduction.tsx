import { useState, useRef, useEffect } from 'react';
import { ExerciseIntro } from '../../data/exerciseIntros';

interface Props {
  intro: ExerciseIntro;
  onStartExercise: () => void;
}

export function ExerciseIntroduction({ intro, onStartExercise }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSubtitleEs, setCurrentSubtitleEs] = useState('');
  const [currentSubtitleEn, setCurrentSubtitleEn] = useState('');
  const [displayedText, setDisplayedText] = useState('');
  const [progress, setProgress] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);

  const synth = useRef<SpeechSynthesisUtterance | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  function updateSubtitles(elapsed: number) {
    let foundEs = '';
    let foundEn = '';

    for (let i = 0; i < intro.subtitles.length; i++) {
      const current = intro.subtitles[i];
      const next = intro.subtitles[i + 1];

      if (current.time <= elapsed && (!next || elapsed < next.time)) {
        foundEs = current.es;
        foundEn = current.en;
        break;
      }
    }

    setCurrentSubtitleEs(foundEs);
    setCurrentSubtitleEn(foundEn);
  }

  function playIntroduction() {
    window.speechSynthesis.cancel();
    if (timerRef.current) clearInterval(timerRef.current);

    const fullText = `${intro.explanationEs} ${intro.example || ''}`;
    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.lang = 'es-ES';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    startTimeRef.current = Date.now();
    setIsPlaying(true);
    setCurrentSubtitleEs('');
    setCurrentSubtitleEn('');
    setProgress(0);
    setDisplayedText(intro.topic);

    utterance.onstart = () => {
      timerRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        setProgress(elapsed);
        updateSubtitles(elapsed);

        const visibleText = Math.floor(elapsed / 0.05);
        const chars = fullText.split('');
        setDisplayedText(chars.slice(0, visibleText).join(''));
      }, 50);
    };

    utterance.onend = () => {
      if (timerRef.current) clearInterval(timerRef.current);
      setIsPlaying(false);
      setDisplayedText(fullText);
      setProgress((Date.now() - startTimeRef.current) / 1000);
    };

    synth.current = utterance;
    window.speechSynthesis.speak(utterance);
  }

  function stopPlayback() {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setCurrentSubtitleEs('');
    setCurrentSubtitleEn('');
    setDisplayedText('');
  }

  return (
    <div className="exercise-overlay">
      <div className="exercise-card" style={{ display: 'flex', flexDirection: 'column', maxWidth: '900px', height: '90vh', overflow: 'hidden' }}>
        <button className="modal-close" aria-label="Close" onClick={onStartExercise}>✕</button>

        {/* Video Area */}
        <div
          style={{
            flex: 1,
            background: 'linear-gradient(135deg, rgba(107,31,46,.1) 0%, rgba(184,147,90,.05) 100%)',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            padding: '3rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            minHeight: '400px',
          }}
        >
          {/* Animated Icon */}
          <div
            style={{
              fontSize: '5rem',
              marginBottom: '2rem',
              animation: isPlaying ? 'pulse 2s ease-in-out infinite' : 'none',
              textShadow: '0 4px 8px rgba(107,31,46,.2)',
            }}
          >
            {intro.icon}
          </div>

          {/* Title */}
          <h1
            style={{
              color: 'var(--wine-ink)',
              fontSize: '2rem',
              marginBottom: '2rem',
              textAlign: 'center',
              opacity: isPlaying ? 0.8 : 1,
            }}
          >
            {intro.topic}
          </h1>

          {/* Main Content - Animated Text */}
          {isPlaying && (
            <div
              style={{
                color: 'var(--charcoal)',
                fontSize: '1.1rem',
                lineHeight: 1.8,
                textAlign: 'center',
                maxWidth: '100%',
                minHeight: '60px',
                animation: 'fadeIn 0.3s ease-in',
              }}
            >
              {displayedText}
            </div>
          )}

          {!isPlaying && displayedText === '' && (
            <p style={{ color: 'var(--muted)', fontSize: '1rem', textAlign: 'center' }}>
              Presiona el botón de abajo para comenzar la introducción
            </p>
          )}

          <style>{`
            @keyframes pulse {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.1); }
            }
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
          `}</style>
        </div>

        {/* Subtitles Section */}
        <div
          style={{
            background: 'var(--bone)',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            borderLeft: '4px solid var(--gold)',
            minHeight: '100px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--wine-ink)', marginBottom: '1rem', textTransform: 'uppercase' }}>
            📝 Subtítulos
          </div>

          {isPlaying && (currentSubtitleEs || currentSubtitleEn) ? (
            <div>
              <p
                style={{
                  color: 'var(--wine-ink)',
                  fontSize: '1.15rem',
                  fontWeight: '600',
                  margin: '0.5rem 0',
                  lineHeight: 1.5,
                  minHeight: '40px',
                }}
              >
                {currentSubtitleEs}
              </p>
              <p
                style={{
                  color: 'var(--muted)',
                  fontSize: '1rem',
                  fontStyle: 'italic',
                  margin: '0.5rem 0',
                  lineHeight: 1.5,
                  minHeight: '35px',
                }}
              >
                {currentSubtitleEn}
              </p>
            </div>
          ) : isPlaying ? (
            <p style={{ color: 'var(--muted)', fontSize: '0.95rem', margin: 0 }}>
              Escuchando... los subtítulos aparecerán en breve
            </p>
          ) : (
            <p style={{ color: 'var(--muted)', fontSize: '0.95rem', margin: 0, textAlign: 'center' }}>
              Presiona "Ver Vídeo" para ver la introducción con subtítulos sincronizados en español e inglés
            </p>
          )}
        </div>

        {/* Progress Bar */}
        {isPlaying && (
          <div style={{ marginBottom: '1rem' }}>
            <div
              style={{
                height: '6px',
                backgroundColor: 'var(--line)',
                borderRadius: '3px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  backgroundColor: 'var(--gold)',
                  width: `${(progress / (totalDuration || progress + 5)) * 100}%`,
                  transition: 'width 0.1s linear',
                }}
              />
            </div>
          </div>
        )}

        {/* Control Buttons */}
        <div style={{ display: 'flex', gap: '1rem' }}>
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
              ▶️ Ver Vídeo
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
      </div>
    </div>
  );
}
