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
  const [armPosition, setArmPosition] = useState(0);

  const synth = useRef<SpeechSynthesisUtterance | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  function updateSubtitlesAndAnimations(elapsed: number) {
    if (!intro.subtitles || intro.subtitles.length === 0) return;

    let foundEs = '';
    let foundEn = '';

    // Buscar el subtítulo correcto según el tiempo
    for (let i = intro.subtitles.length - 1; i >= 0; i--) {
      if (intro.subtitles[i].time <= elapsed) {
        foundEs = intro.subtitles[i].es;
        foundEn = intro.subtitles[i].en;
        break;
      }
    }

    setCurrentSubtitleEs(foundEs);
    setCurrentSubtitleEn(foundEn);

    // Animaciones sincronizadas con el audio
    setMouthOpen(Math.sin(elapsed * 8) > 0.2);
    setArmPosition(Math.sin(elapsed * 2) * 15);
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
        updateSubtitlesAndAnimations(elapsed);
      }, 50); // Actualizar cada 50ms para sincronización perfecta
    };

    utterance.onend = () => {
      if (timerRef.current) clearInterval(timerRef.current);
      setIsPlaying(false);
      setMouthOpen(false);
      setArmPosition(0);
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
    setArmPosition(0);
  }

  return (
    <div className="exercise-overlay">
      <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '1100px', height: '95vh', overflow: 'hidden', background: 'var(--bone)', borderRadius: '16px', boxShadow: '0 20px 60px rgba(107,31,46,.3)' }}>
        <button className="modal-close" aria-label="Close" onClick={onStartExercise} style={{ zIndex: 100 }}>✕</button>

        {/* Main Video Section */}
        <div style={{ flex: 1, background: 'linear-gradient(135deg, #6b1f2e 0%, #2a1620 50%, #1a0d12 100%)', padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
          {/* Animated Background */}
          {isPlaying && (
            <>
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    width: `${40 + i * 25}px`,
                    height: `${40 + i * 25}px`,
                    background: `radial-gradient(circle, rgba(184,147,90,${0.2 - i * 0.03}) 0%, transparent 70%)`,
                    borderRadius: '50%',
                    animation: `float ${4 + i * 0.5}s ease-in-out infinite`,
                    left: `${5 + i * 12}%`,
                    top: `${15 + i * 8}%`,
                  }}
                />
              ))}
            </>
          )}

          {/* Animated Person */}
          <div style={{ position: 'relative', zIndex: 10, marginBottom: '1.5rem', textAlign: 'center', width: '200px', height: '320px' }}>
            {/* Head */}
            <div
              style={{
                width: '140px',
                height: '160px',
                background: 'linear-gradient(135deg, #f5d4a8 0%, #e6b890 100%)',
                borderRadius: '50% 50% 48% 52% / 44% 44% 56% 56%',
                margin: '0 auto 1rem',
                position: 'relative',
                animation: isPlaying ? 'headBob 0.4s ease-in-out infinite' : 'none',
                boxShadow: '0 12px 30px rgba(107,31,46,.5)',
              }}
            >
              {/* Hair */}
              <div
                style={{
                  position: 'absolute',
                  top: '-15px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '160px',
                  height: '40px',
                  background: 'linear-gradient(180deg, #3d2817 0%, #4a3428 100%)',
                  borderRadius: '50% 50% 0 0',
                }}
              />

              {/* Eyes */}
              <div style={{ position: 'absolute', top: '40%', left: '28%', width: '20px', height: '26px', background: '#fff', borderRadius: '50%', overflow: 'hidden', boxShadow: 'inset 0 2px 4px rgba(0,0,0,.2)' }}>
                <div style={{ position: 'absolute', width: '12px', height: '12px', background: '#333', borderRadius: '50%', top: isPlaying ? '50%' : '40%', left: '50%', transform: 'translate(-50%, -50%)', animation: isPlaying ? 'pupilMove 3s ease-in-out infinite' : 'none' }} />
              </div>
              <div style={{ position: 'absolute', top: '40%', right: '28%', width: '20px', height: '26px', background: '#fff', borderRadius: '50%', overflow: 'hidden', boxShadow: 'inset 0 2px 4px rgba(0,0,0,.2)' }}>
                <div style={{ position: 'absolute', width: '12px', height: '12px', background: '#333', borderRadius: '50%', top: isPlaying ? '50%' : '40%', left: '50%', transform: 'translate(-50%, -50%)', animation: isPlaying ? 'pupilMove 3s ease-in-out infinite 0.2s' : 'none' }} />
              </div>

              {/* Mouth */}
              <div style={{ position: 'absolute', bottom: '20%', left: '50%', transform: 'translateX(-50%)', width: '45px', height: mouthOpen && isPlaying ? '30px' : '12px', background: mouthOpen && isPlaying ? '#d4445e' : '#c41e3a', borderRadius: '0 0 22px 22px', transition: 'all 0.05s ease', boxShadow: mouthOpen && isPlaying ? '0 4px 8px rgba(212,68,94,.4)' : 'none' }} />

              {/* Nose */}
              <div style={{ position: 'absolute', top: '55%', left: '50%', transform: 'translateX(-50%)', width: '10px', height: '12px', background: 'linear-gradient(to right, transparent 0%, #d4a574 50%, transparent 100%)', borderRadius: '50%' }} />

              {/* Eyebrows */}
              <div style={{ position: 'absolute', top: '32%', left: '22%', width: '30px', height: '6px', background: '#3d2817', borderRadius: '3px', transform: 'rotate(-15deg)' }} />
              <div style={{ position: 'absolute', top: '32%', right: '22%', width: '30px', height: '6px', background: '#3d2817', borderRadius: '3px', transform: 'rotate(15deg)' }} />
            </div>

            {/* Neck */}
            <div style={{ width: '50px', height: '25px', background: 'linear-gradient(180deg, #f5d4a8 0%, #e6b890 100%)', margin: '0 auto', position: 'relative' }} />

            {/* Body */}
            <div
              style={{
                width: '90px',
                height: '100px',
                background: 'linear-gradient(135deg, #4a90e2 0%, #357abd 100%)',
                margin: '0 auto',
                borderRadius: '20px 20px 0 0',
                position: 'relative',
                boxShadow: '0 8px 20px rgba(74,144,226,.3)',
              }}
            >
              {/* Left Arm */}
              <div
                style={{
                  position: 'absolute',
                  left: '-50px',
                  top: '15px',
                  width: '50px',
                  height: '20px',
                  background: 'linear-gradient(90deg, #f5d4a8 0%, #e6b890 100%)',
                  borderRadius: '10px',
                  transform: `rotate(${armPosition}deg)`,
                  transformOrigin: 'right center',
                  transition: 'transform 0.05s ease',
                  boxShadow: '0 4px 8px rgba(0,0,0,.2)',
                }}
              />

              {/* Right Arm */}
              <div
                style={{
                  position: 'absolute',
                  right: '-50px',
                  top: '15px',
                  width: '50px',
                  height: '20px',
                  background: 'linear-gradient(90deg, #f5d4a8 0%, #e6b890 100%)',
                  borderRadius: '10px',
                  transform: `rotate(${-armPosition}deg)`,
                  transformOrigin: 'left center',
                  transition: 'transform 0.05s ease',
                  boxShadow: '0 4px 8px rgba(0,0,0,.2)',
                }}
              />
            </div>
          </div>

          {/* Title */}
          <h1
            style={{
              color: 'var(--bone)',
              fontSize: '2.5rem',
              marginBottom: '1.5rem',
              textAlign: 'center',
              animation: isPlaying ? 'slideDown 0.8s ease-out' : 'none',
              zIndex: 10,
              textShadow: '2px 2px 4px rgba(26,13,18,.5)',
              fontWeight: 'bold',
            }}
          >
            {intro.topic}
          </h1>

          {/* Styles */}
          <style>{`
            @keyframes headBob {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-12px); }
            }
            @keyframes pupilMove {
              0%, 100% { top: 40%; left: 50%; }
              25% { top: 35%; left: 45%; }
              50% { top: 50%; left: 50%; }
              75% { top: 45%; left: 55%; }
            }
            @keyframes slideDown {
              from { transform: translateY(-40px); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
            @keyframes float {
              0%, 100% { transform: translateY(0px) translateX(0px); }
              50% { transform: translateY(-40px) translateX(30px); }
            }
          `}</style>
        </div>

        {/* Subtitles - Perfectly Synced */}
        <div style={{ background: 'linear-gradient(90deg, rgba(107,31,46,.95) 0%, rgba(107,31,46,.9) 100%)', padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', minHeight: '200px', borderTop: '3px solid var(--gold)' }}>
          {/* Spanish */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--gold)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
              🇪🇸 ESPAÑOL
            </div>
            <div
              style={{
                color: 'var(--bone)',
                fontSize: '1.3rem',
                fontWeight: '600',
                lineHeight: 1.9,
                minHeight: '110px',
                padding: '1.2rem',
                background: 'rgba(250,247,243,.12)',
                borderRadius: '10px',
                border: `3px solid ${currentSubtitleEs ? 'var(--gold)' : 'rgba(184,147,90,.3)'}`,
                transition: 'all 0.2s ease',
                animation: currentSubtitleEs && isPlaying ? 'subtitleChange 0.3s ease' : 'none',
              }}
            >
              {currentSubtitleEs && isPlaying ? currentSubtitleEs : '—'}
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
                fontSize: '1.3rem',
                fontWeight: '600',
                lineHeight: 1.9,
                minHeight: '110px',
                padding: '1.2rem',
                background: 'rgba(250,247,243,.12)',
                borderRadius: '10px',
                border: `3px solid ${currentSubtitleEn ? 'var(--gold)' : 'rgba(184,147,90,.3)'}`,
                transition: 'all 0.2s ease',
                animation: currentSubtitleEn && isPlaying ? 'subtitleChange 0.3s ease' : 'none',
              }}
            >
              {currentSubtitleEn && isPlaying ? currentSubtitleEn : '—'}
            </div>
          </div>

          <style>{`
            @keyframes subtitleChange {
              0% { opacity: 0.6; transform: scale(0.98); }
              100% { opacity: 1; transform: scale(1); }
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
                width: `${progress * 3}%`,
                transition: 'width 0.05s linear',
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
