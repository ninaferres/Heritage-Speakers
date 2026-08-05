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
      <div className="exercise-card" style={{ display: 'flex', flexDirection: 'column', maxWidth: '1000px', height: '95vh', overflow: 'hidden' }}>
        <button className="modal-close" aria-label="Close" onClick={onStartExercise}>✕</button>

        {/* Video Area with Animations */}
        <div
          style={{
            flex: 1,
            background: 'linear-gradient(135deg, rgba(107,31,46,.15) 0%, rgba(184,147,90,.08) 100%)',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            padding: '2.5rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            position: 'relative',
            border: '2px solid rgba(184,147,90,.2)',
          }}
        >
          {/* Animated Background Elements */}
          {isPlaying && (
            <>
              <div
                style={{
                  position: 'absolute',
                  width: '300px',
                  height: '300px',
                  background: 'rgba(184,147,90,.1)',
                  borderRadius: '50%',
                  top: '10%',
                  right: '5%',
                  animation: 'float 6s ease-in-out infinite',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  width: '250px',
                  height: '250px',
                  background: 'rgba(107,31,46,.08)',
                  borderRadius: '50%',
                  bottom: '10%',
                  left: '5%',
                  animation: 'float 8s ease-in-out infinite',
                }}
              />
            </>
          )}

          {/* Animated Icon */}
          <div
            style={{
              fontSize: '6rem',
              marginBottom: '1.5rem',
              animation: isPlaying ? 'pulse 2s ease-in-out infinite, bounce 3s ease-in-out infinite' : 'none',
              textShadow: '0 6px 12px rgba(107,31,46,.25)',
              zIndex: 1,
              position: 'relative',
            }}
          >
            {intro.icon}
          </div>

          {/* Title with Animation */}
          <h1
            style={{
              color: 'var(--wine-ink)',
              fontSize: '2.2rem',
              marginBottom: '1.5rem',
              textAlign: 'center',
              opacity: isPlaying ? 0.95 : 1,
              animation: isPlaying ? 'slideDown 0.8s ease-out' : 'none',
              zIndex: 1,
              position: 'relative',
            }}
          >
            {intro.topic}
          </h1>

          {/* Main Content - Animated Text */}
          {isPlaying && displayedText && (
            <div
              style={{
                color: 'var(--charcoal)',
                fontSize: '1.15rem',
                lineHeight: 1.9,
                textAlign: 'center',
                maxWidth: '95%',
                minHeight: '80px',
                animation: 'fadeInUp 0.6s ease-out',
                zIndex: 1,
                position: 'relative',
                fontWeight: '500',
              }}
            >
              {displayedText}
            </div>
          )}

          {!isPlaying && displayedText === '' && (
            <div
              style={{
                animation: 'fadeIn 0.8s ease-in',
                zIndex: 1,
                position: 'relative',
              }}
            >
              <p style={{ color: 'var(--muted)', fontSize: '1.1rem', textAlign: 'center', fontStyle: 'italic' }}>
                👇 Presiona "Ver Vídeo" para comenzar
              </p>
            </div>
          )}

          <style>{`
            @keyframes pulse {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.15); }
            }
            @keyframes bounce {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-15px); }
            }
            @keyframes slideDown {
              from { transform: translateY(-30px); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
            @keyframes fadeInUp {
              from { transform: translateY(20px); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
            @keyframes float {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(30px); }
            }
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
          `}</style>
        </div>

        {/* Subtitles Section - Side by Side */}
        <div
          style={{
            background: 'var(--bone)',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            border: '2px solid rgba(184,147,90,.3)',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1.5rem',
            minHeight: '120px',
          }}
        >
          {/* Spanish Subtitles */}
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--wine-ink)', marginBottom: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
              🇪🇸 Español
            </div>
            {isPlaying && currentSubtitleEs ? (
              <p
                style={{
                  color: 'var(--wine-ink)',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  margin: 0,
                  lineHeight: 1.6,
                  minHeight: '60px',
                  padding: '0.75rem',
                  backgroundColor: 'rgba(107,31,46,.08)',
                  borderRadius: '6px',
                  animation: 'fadeIn 0.3s ease-in',
                }}
              >
                {currentSubtitleEs}
              </p>
            ) : isPlaying ? (
              <p style={{ color: 'var(--muted)', fontSize: '0.95rem', margin: 0, minHeight: '60px', display: 'flex', alignItems: 'center' }}>
                Escuchando...
              </p>
            ) : (
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', margin: 0, minHeight: '60px', display: 'flex', alignItems: 'center' }}>
                Los subtítulos en español aparecerán aquí
              </p>
            )}
          </div>

          {/* English Subtitles */}
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--wine-ink)', marginBottom: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
              🇬🇧 English
            </div>
            {isPlaying && currentSubtitleEn ? (
              <p
                style={{
                  color: 'var(--wine-ink)',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  margin: 0,
                  lineHeight: 1.6,
                  minHeight: '60px',
                  padding: '0.75rem',
                  backgroundColor: 'rgba(107,31,46,.08)',
                  borderRadius: '6px',
                  animation: 'fadeIn 0.3s ease-in',
                }}
              >
                {currentSubtitleEn}
              </p>
            ) : isPlaying ? (
              <p style={{ color: 'var(--muted)', fontSize: '0.95rem', margin: 0, minHeight: '60px', display: 'flex', alignItems: 'center' }}>
                Listening...
              </p>
            ) : (
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', margin: 0, minHeight: '60px', display: 'flex', alignItems: 'center' }}>
                English subtitles will appear here
              </p>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {isPlaying && (
          <div style={{ marginBottom: '1rem' }}>
            <div
              style={{
                height: '8px',
                backgroundColor: 'var(--line)',
                borderRadius: '4px',
                overflow: 'hidden',
                boxShadow: '0 2px 4px rgba(107,31,46,.15)',
              }}
            >
              <div
                style={{
                  height: '100%',
                  backgroundColor: 'var(--gold)',
                  width: `${(progress / (totalDuration || progress + 5)) * 100}%`,
                  transition: 'width 0.1s linear',
                  boxShadow: '0 0 8px rgba(184,147,90,.5)',
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
                padding: '1.1rem',
                fontSize: '1.05rem',
                borderRadius: '8px',
                border: '2px solid var(--wine)',
                background: 'var(--wine)',
                color: 'var(--bone)',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all .3s ease',
                boxShadow: '0 4px 12px rgba(107,31,46,.2)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(107,31,46,.95)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 16px rgba(107,31,46,.3)';
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'var(--wine)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 12px rgba(107,31,46,.2)';
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
              }}
            >
              ▶️ Ver Vídeo
            </button>
          ) : (
            <button
              onClick={stopPlayback}
              style={{
                flex: 1,
                padding: '1.1rem',
                fontSize: '1.05rem',
                borderRadius: '8px',
                border: 'none',
                background: '#d32f2f',
                color: 'white',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all .3s ease',
                boxShadow: '0 4px 12px rgba(211,47,47,.2)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = '#b71c1c';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 16px rgba(211,47,47,.3)';
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = '#d32f2f';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 12px rgba(211,47,47,.2)';
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
              }}
            >
              ⏹️ Detener
            </button>
          )}

          <button
            onClick={onStartExercise}
            style={{
              flex: 1,
              padding: '1.1rem',
              fontSize: '1.05rem',
              borderRadius: '8px',
              border: '2px solid var(--gold)',
              background: 'transparent',
              color: 'var(--gold)',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all .3s ease',
              boxShadow: '0 2px 8px rgba(184,147,90,.1)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(184,147,90,.15)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 12px rgba(184,147,90,.2)';
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 8px rgba(184,147,90,.1)';
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
            }}
          >
            Empezar Ejercicio →
          </button>
        </div>
      </div>
    </div>
  );
}
