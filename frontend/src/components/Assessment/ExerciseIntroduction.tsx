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
  const [progress, setProgress] = useState(0);
  const [mouthOpen, setMouthOpen] = useState(false);

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
    if (!intro.subtitles || intro.subtitles.length === 0) return;

    let foundEs = '';
    let foundEn = '';

    for (let i = intro.subtitles.length - 1; i >= 0; i--) {
      if (intro.subtitles[i].time <= elapsed) {
        foundEs = intro.subtitles[i].es;
        foundEn = intro.subtitles[i].en;
        break;
      }
    }

    if (foundEs !== currentSubtitleEs) setCurrentSubtitleEs(foundEs);
    if (foundEn !== currentSubtitleEn) setCurrentSubtitleEn(foundEn);

    setMouthOpen(Math.random() > 0.3);
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

    utterance.onstart = () => {
      timerRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        setProgress(elapsed);
        updateSubtitles(elapsed);
      }, 100);
    };

    utterance.onend = () => {
      if (timerRef.current) clearInterval(timerRef.current);
      setIsPlaying(false);
      setMouthOpen(false);
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
    setMouthOpen(false);
  }

  return (
    <div className="exercise-overlay">
      <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '1100px', height: '95vh', overflow: 'hidden', background: 'var(--bone)', borderRadius: '16px', boxShadow: '0 20px 60px rgba(107,31,46,.3)' }}>
        <button className="modal-close" aria-label="Close" onClick={onStartExercise} style={{ zIndex: 100 }}>✕</button>

        {/* Main Video Section */}
        <div style={{ flex: 1, background: 'linear-gradient(135deg, #6b1f2e 0%, #2a1620 50%, #1a0d12 100%)', padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
          {/* Animated Background Particles */}
          {isPlaying && (
            <>
              <div style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, opacity: 0.3 }}>
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      width: `${30 + i * 20}px`,
                      height: `${30 + i * 20}px`,
                      background: `radial-gradient(circle, rgba(184,147,90,${0.3 - i * 0.05}) 0%, transparent 70%)`,
                      borderRadius: '50%',
                      animation: `float ${3 + i}s ease-in-out infinite`,
                      left: `${10 + i * 15}%`,
                      top: `${20 + i * 10}%`,
                    }}
                  />
                ))}
              </div>
            </>
          )}

          {/* Avatar Section */}
          <div style={{ position: 'relative', zIndex: 10, marginBottom: '1.5rem', textAlign: 'center' }}>
            {/* Head */}
            <div
              style={{
                width: '120px',
                height: '140px',
                background: 'linear-gradient(135deg, #f5d4a8 0%, #e6b890 100%)',
                borderRadius: '50% 50% 48% 52% / 44% 44% 56% 56%',
                margin: '0 auto 0.5rem',
                position: 'relative',
                animation: isPlaying ? 'headBob 0.5s ease-in-out infinite' : 'none',
                boxShadow: '0 8px 20px rgba(107,31,46,.4)',
              }}
            >
              {/* Eyes */}
              <div style={{ position: 'absolute', top: '35%', left: '30%', width: '16px', height: '20px', background: '#333', borderRadius: '50%', animation: isPlaying ? 'blink 3s ease-in-out infinite' : 'none' }} />
              <div style={{ position: 'absolute', top: '35%', right: '30%', width: '16px', height: '20px', background: '#333', borderRadius: '50%', animation: isPlaying ? 'blink 3s ease-in-out infinite 0.3s' : 'none' }} />

              {/* Mouth */}
              <div style={{ position: 'absolute', bottom: '25%', left: '50%', transform: 'translateX(-50%)', width: '30px', height: mouthOpen && isPlaying ? '20px' : '8px', background: '#c41e3a', borderRadius: '0 0 15px 15px', transition: 'all 0.1s ease' }} />

              {/* Nose */}
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translateX(-50%)', width: '6px', height: '8px', background: '#d4a574', borderRadius: '50%' }} />
            </div>

            {/* Icon Badge */}
            <div style={{ fontSize: '2rem', animation: isPlaying ? 'pulse 2s ease-in-out infinite' : 'none' }}>
              {intro.icon}
            </div>
          </div>

          {/* Title */}
          <h1
            style={{
              color: 'var(--bone)',
              fontSize: '2.5rem',
              marginBottom: '1rem',
              textAlign: 'center',
              animation: isPlaying ? 'slideDown 0.8s ease-out' : 'none',
              zIndex: 10,
              textShadow: '2px 2px 4px rgba(26,13,18,.5)',
              fontWeight: 'bold',
            }}
          >
            {intro.topic}
          </h1>

          {/* Interactive Info Box */}
          {isPlaying && (
            <div
              style={{
                background: 'rgba(184,147,90,.2)',
                border: '2px solid var(--gold)',
                borderRadius: '12px',
                padding: '1rem 1.5rem',
                maxWidth: '600px',
                textAlign: 'center',
                color: 'var(--bone)',
                fontSize: '1.1rem',
                lineHeight: 1.7,
                zIndex: 10,
                animation: 'fadeInUp 0.6s ease-out',
                backdropFilter: 'blur(4px)',
              }}
            >
              Escucha atentamente el contenido y lee los subtítulos en español e inglés
            </div>
          )}

          {/* Styles */}
          <style>{`
            @keyframes pulse {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.2); }
            }
            @keyframes slideDown {
              from { transform: translateY(-40px); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
            @keyframes fadeInUp {
              from { transform: translateY(30px); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
            @keyframes headBob {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-10px); }
            }
            @keyframes blink {
              0%, 19%, 21%, 100% { height: 20px; }
              20% { height: 2px; }
            }
            @keyframes float {
              0%, 100% { transform: translateY(0px) translateX(0px); }
              50% { transform: translateY(-30px) translateX(20px); }
            }
          `}</style>
        </div>

        {/* Subtitles - FULL WIDTH, SIDE BY SIDE */}
        <div style={{ background: 'linear-gradient(90deg, rgba(107,31,46,.95) 0%, rgba(107,31,46,.9) 100%)', padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', minHeight: '180px', borderTop: '3px solid var(--gold)' }}>
          {/* Spanish */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--gold)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
              🇪🇸 ESPAÑOL
            </div>
            <div
              style={{
                color: 'var(--bone)',
                fontSize: '1.25rem',
                fontWeight: '600',
                lineHeight: 1.8,
                minHeight: '90px',
                padding: '1rem',
                background: 'rgba(250,247,243,.1)',
                borderRadius: '8px',
                border: `2px solid ${currentSubtitleEs ? 'var(--gold)' : 'transparent'}`,
                transition: 'all 0.3s ease',
                animation: currentSubtitleEs ? 'subtitlePulse 0.4s ease' : 'none',
              }}
            >
              {currentSubtitleEs || 'Esperando audio...'}
            </div>
          </div>

          {/* English */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--gold)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
              🇬🇧 ENGLISH
            </div>
            <div
              style={{
                color: 'var(--bone)',
                fontSize: '1.25rem',
                fontWeight: '600',
                lineHeight: 1.8,
                minHeight: '90px',
                padding: '1rem',
                background: 'rgba(250,247,243,.1)',
                borderRadius: '8px',
                border: `2px solid ${currentSubtitleEn ? 'var(--gold)' : 'transparent'}`,
                transition: 'all 0.3s ease',
                animation: currentSubtitleEn ? 'subtitlePulse 0.4s ease' : 'none',
              }}
            >
              {currentSubtitleEn || 'Waiting for audio...'}
            </div>
          </div>

          <style>{`
            @keyframes subtitlePulse {
              0% { transform: scale(0.95); }
              50% { transform: scale(1.02); }
              100% { transform: scale(1); }
            }
          `}</style>
        </div>

        {/* Progress Bar */}
        {isPlaying && (
          <div style={{ height: '12px', background: 'rgba(107,31,46,.3)', position: 'relative', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, var(--gold) 0%, rgba(184,147,90,.8) 100%)',
                width: `${progress * 5}%`,
                transition: 'width 0.1s linear',
                boxShadow: '0 0 15px var(--gold)',
              }}
            />
          </div>
        )}

        {/* Control Buttons */}
        <div style={{ padding: '1.5rem', display: 'flex', gap: '1rem', background: 'var(--bone)' }}>
          {!isPlaying ? (
            <button
              onClick={playIntroduction}
              style={{
                flex: 1,
                padding: '1.2rem',
                fontSize: '1.1rem',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, #d4935f 0%, #b8932a 100%)',
                color: '#1a0d12',
                fontWeight: '800',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 6px 20px rgba(184,147,90,.4)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-4px)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 10px 30px rgba(184,147,90,.6)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 20px rgba(184,147,90,.4)';
              }}
            >
              ▶️ VER VÍDEO
            </button>
          ) : (
            <button
              onClick={stopPlayback}
              style={{
                flex: 1,
                padding: '1.2rem',
                fontSize: '1.1rem',
                borderRadius: '10px',
                border: 'none',
                background: '#d4445e',
                color: 'white',
                fontWeight: '800',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 6px 20px rgba(212,68,94,.4)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-4px)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 10px 30px rgba(212,68,94,.6)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 20px rgba(212,68,94,.4)';
              }}
            >
              ⏹️ DETENER
            </button>
          )}

          <button
            onClick={onStartExercise}
            style={{
              flex: 1,
              padding: '1.2rem',
              fontSize: '1.1rem',
              borderRadius: '10px',
              border: '2px solid #6b1f2e',
              background: 'transparent',
              color: '#6b1f2e',
              fontWeight: '800',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = '#6b1f2e';
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--bone)';
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              (e.currentTarget as HTMLButtonElement).style.color = '#6b1f2e';
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
            }}
          >
            EMPEZAR →
          </button>
        </div>
      </div>
    </div>
  );
}
