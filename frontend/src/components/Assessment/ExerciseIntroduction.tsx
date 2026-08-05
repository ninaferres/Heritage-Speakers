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
  const [totalDuration, setTotalDuration] = useState(0);
  const [eyeOpen, setEyeOpen] = useState(true);

  const synth = useRef<SpeechSynthesisUtterance | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const totalDurationRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  function estimateSubtitleTime(subtitleIndex: number, totalSubtitles: number): number {
    // Distribuir los subtítulos uniformemente a lo largo de la duración total estimada
    if (totalSubtitles <= 1) return 0;
    return (subtitleIndex / (totalSubtitles - 1)) * (totalDurationRef.current || 15);
  }

  function updateSubtitlesBasedOnTime(elapsed: number) {
    if (!intro.subtitles || intro.subtitles.length === 0) return;

    let foundEs = '';
    let foundEn = '';
    const totalSubs = intro.subtitles.length;

    // Buscar cuál subtítulo debería mostrarse basándose en el tiempo estimado
    for (let i = 0; i < totalSubs; i++) {
      const estimatedTime = estimateSubtitleTime(i, totalSubs);
      const nextEstimatedTime = estimateSubtitleTime(i + 1, totalSubs);

      if (elapsed >= estimatedTime && elapsed < nextEstimatedTime) {
        foundEs = intro.subtitles[i].es;
        foundEn = intro.subtitles[i].en;
        break;
      }
    }

    // Si estamos en la última parte, mostrar el último subtítulo
    if (elapsed >= estimateSubtitleTime(totalSubs - 1, totalSubs)) {
      foundEs = intro.subtitles[totalSubs - 1].es;
      foundEn = intro.subtitles[totalSubs - 1].en;
    }

    setCurrentSubtitleEs(foundEs);
    setCurrentSubtitleEn(foundEn);

    // Animación de ojos
    setEyeOpen(Math.sin(elapsed * 2) > 0);
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

    // Estimar duración: promedio 150 palabras por minuto
    const wordCount = fullText.split(' ').length;
    const estimatedDuration = (wordCount / 150) * 60;
    totalDurationRef.current = estimatedDuration;
    setTotalDuration(estimatedDuration);

    startTimeRef.current = Date.now();
    setIsPlaying(true);
    setCurrentSubtitleEs('');
    setCurrentSubtitleEn('');
    setProgress(0);

    utterance.onstart = () => {
      timerRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        setProgress(elapsed);
        updateSubtitlesBasedOnTime(elapsed);
      }, 100);
    };

    utterance.onend = () => {
      if (timerRef.current) clearInterval(timerRef.current);
      setIsPlaying(false);
      setEyeOpen(true);
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
    setEyeOpen(true);
  }

  return (
    <div className="exercise-overlay">
      <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '1200px', height: '95vh', overflow: 'hidden', background: 'var(--bone)', borderRadius: '16px', boxShadow: '0 20px 60px rgba(107,31,46,.3)' }}>
        <button className="modal-close" aria-label="Close" onClick={onStartExercise} style={{ zIndex: 100 }}>✕</button>

        {/* Main Video Section - Anime Style */}
        <div style={{ flex: 1, background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
          {/* Background Effects */}
          {isPlaying && (
            <>
              <div style={{ position: 'absolute', width: '200%', height: '200%', top: '-50%', left: '-50%', background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(233, 212, 96, 0.03) 10px, rgba(233, 212, 96, 0.03) 20px)', animation: 'scan 8s linear infinite' }} />
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    width: `${150 + i * 50}px`,
                    height: `${150 + i * 50}px`,
                    border: `2px solid rgba(233, 212, 96, ${0.2 - i * 0.06})`,
                    borderRadius: '50%',
                    animation: `rotate ${10 + i * 2}s linear infinite`,
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                />
              ))}
            </>
          )}

          {/* Anime Character - Attack on Titan Style */}
          <div style={{ position: 'relative', zIndex: 10, marginBottom: '2rem' }}>
            <svg width="220" height="280" viewBox="0 0 220 280" style={{ filter: isPlaying ? 'drop-shadow(0 0 20px rgba(233, 212, 96, 0.4))' : 'none' }}>
              {/* Hair - Long Dark */}
              <path d="M 60 50 Q 50 30, 110 20 Q 170 30, 160 50 L 165 80 Q 110 100, 55 80 Z" fill="#1a1a1a" stroke="#000" strokeWidth="2" />

              {/* Head */}
              <circle cx="110" cy="80" r="45" fill="#f5d5b0" stroke="#000" strokeWidth="2.5" />

              {/* Eyes - Anime Style */}
              <g>
                {/* Left Eye */}
                <ellipse cx="90" cy="70" rx="16" ry="22" fill="#fff" stroke="#000" strokeWidth="2" />
                <path d="M 85 80 Q 90 95, 95 80 Q 90 75, 85 80" fill="#4a4a4a" stroke="none" />
                <circle cx="90" cy={eyeOpen ? 75 : 72} r="8" fill="#000" />
                <circle cx="92" cy={eyeOpen ? 73 : 70} r="3" fill="#fff" />

                {/* Right Eye */}
                <ellipse cx="130" cy="70" rx="16" ry="22" fill="#fff" stroke="#000" strokeWidth="2" />
                <path d="M 125 80 Q 130 95, 135 80 Q 130 75, 125 80" fill="#4a4a4a" stroke="none" />
                <circle cx="130" cy={eyeOpen ? 75 : 72} r="8" fill="#000" />
                <circle cx="132" cy={eyeOpen ? 73 : 70} r="3" fill="#fff" />
              </g>

              {/* Nose */}
              <line x1="110" y1="75" x2="110" y2="95" stroke="#000" strokeWidth="1.5" />

              {/* Mouth */}
              <path d={isPlaying ? 'M 100 105 Q 110 115, 120 105' : 'M 100 105 L 120 105'} stroke="#c41e3a" strokeWidth="2" fill="none" strokeLinecap="round" />

              {/* Eyebrows - Serious */}
              <line x1="75" y1="60" x2="105" y2="55" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="115" y1="55" x2="145" y2="60" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />

              {/* Neck */}
              <rect x="100" y="120" width="20" height="15" fill="#f5d5b0" stroke="#000" strokeWidth="1.5" />

              {/* Uniform - Military Style */}
              <path d="M 70 135 L 65 200 L 155 200 L 150 135 Z" fill="#2d2d44" stroke="#000" strokeWidth="2.5" />

              {/* Chest Armor Detail */}
              <rect x="85" y="140" width="50" height="40" fill="none" stroke="#e9d460" strokeWidth="2" rx="4" />

              {/* Arms */}
              <g id="leftArm">
                <line x1="70" y1="145" x2="45" y2="160" stroke="#f5d5b0" strokeWidth="8" strokeLinecap="round" />
                <circle cx="45" cy="160" r="6" fill="#f5d5b0" stroke="#000" strokeWidth="1.5" />
              </g>
              <g id="rightArm">
                <line x1="150" y1="145" x2="175" y2="160" stroke="#f5d5b0" strokeWidth="8" strokeLinecap="round" />
                <circle cx="175" cy="160" r="6" fill="#f5d5b0" stroke="#000" strokeWidth="1.5" />
              </g>
            </svg>
          </div>

          {/* Title */}
          <h1
            style={{
              color: '#e9d460',
              fontSize: '2.8rem',
              marginBottom: '1rem',
              textAlign: 'center',
              animation: isPlaying ? 'slideDown 0.8s ease-out' : 'none',
              zIndex: 10,
              textShadow: '3px 3px 6px rgba(0,0,0,.6)',
              fontWeight: 'bold',
              letterSpacing: '2px',
            }}
          >
            {intro.topic}
          </h1>

          <style>{`
            @keyframes scan {
              0% { transform: translateY(-100%); }
              100% { transform: translateY(100%); }
            }
            @keyframes rotate {
              0% { transform: translate(-50%, -50%) rotate(0deg); }
              100% { transform: translate(-50%, -50%) rotate(360deg); }
            }
            @keyframes slideDown {
              from { transform: translateY(-40px); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
          `}</style>
        </div>

        {/* Subtitles - PERFECTLY SYNCED */}
        <div style={{ background: 'linear-gradient(90deg, rgba(26,26,46,.98) 0%, rgba(22,33,62,.98) 100%)', padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem', minHeight: '220px', borderTop: '4px solid #e9d460' }}>
          {/* Spanish Subtitles */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: '0.95rem', fontWeight: '900', color: '#e9d460', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '2.5px' }}>
              🇪🇸 ESPAÑOL
            </div>
            <div
              style={{
                color: '#f5d5b0',
                fontSize: '1.35rem',
                fontWeight: '700',
                lineHeight: 2,
                minHeight: '130px',
                padding: '1.5rem',
                background: 'rgba(233, 212, 96, 0.08)',
                borderRadius: '8px',
                border: `3px solid ${currentSubtitleEs ? '#e9d460' : 'rgba(233, 212, 96, 0.2)'}`,
                transition: 'all 0.25s ease',
                animation: currentSubtitleEs && isPlaying ? 'textAppear 0.4s ease' : 'none',
              }}
            >
              {currentSubtitleEs || ' '}
            </div>
          </div>

          {/* English Subtitles */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: '0.95rem', fontWeight: '900', color: '#e9d460', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '2.5px' }}>
              🇬🇧 ENGLISH
            </div>
            <div
              style={{
                color: '#f5d5b0',
                fontSize: '1.35rem',
                fontWeight: '700',
                lineHeight: 2,
                minHeight: '130px',
                padding: '1.5rem',
                background: 'rgba(233, 212, 96, 0.08)',
                borderRadius: '8px',
                border: `3px solid ${currentSubtitleEn ? '#e9d460' : 'rgba(233, 212, 96, 0.2)'}`,
                transition: 'all 0.25s ease',
                animation: currentSubtitleEn && isPlaying ? 'textAppear 0.4s ease' : 'none',
              }}
            >
              {currentSubtitleEn || ' '}
            </div>
          </div>

          <style>{`
            @keyframes textAppear {
              0% { opacity: 0.5; }
              100% { opacity: 1; }
            }
          `}</style>
        </div>

        {/* Progress Bar */}
        {isPlaying && (
          <div style={{ height: '14px', background: 'rgba(26,26,46,.6)', position: 'relative', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #e9d460 0%, rgba(233, 212, 96, 0.7) 100%)',
                width: `${totalDuration > 0 ? (progress / totalDuration) * 100 : 0}%`,
                transition: 'width 0.1s linear',
                boxShadow: '0 0 20px #e9d460',
              }}
            />
          </div>
        )}

        {/* Control Buttons */}
        <div style={{ padding: '1.8rem', display: 'flex', gap: '1.2rem', background: 'var(--bone)' }}>
          {!isPlaying ? (
            <button
              onClick={playIntroduction}
              style={{
                flex: 1,
                padding: '1.3rem',
                fontSize: '1.15rem',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(135deg, #e9d460 0%, #d4af37 100%)',
                color: '#1a1a1a',
                fontWeight: '900',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 25px rgba(233, 212, 96, 0.5)',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-5px)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 12px 35px rgba(233, 212, 96, 0.7)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 25px rgba(233, 212, 96, 0.5)';
              }}
            >
              ▶️ VER VÍDEO
            </button>
          ) : (
            <button
              onClick={stopPlayback}
              style={{
                flex: 1,
                padding: '1.3rem',
                fontSize: '1.15rem',
                borderRadius: '8px',
                border: 'none',
                background: '#c41e3a',
                color: 'white',
                fontWeight: '900',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 25px rgba(196, 30, 58, 0.5)',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-5px)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 12px 35px rgba(196, 30, 58, 0.7)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 25px rgba(196, 30, 58, 0.5)';
              }}
            >
              ⏹️ DETENER
            </button>
          )}

          <button
            onClick={onStartExercise}
            style={{
              flex: 1,
              padding: '1.3rem',
              fontSize: '1.15rem',
              borderRadius: '8px',
              border: '3px solid #1a1a1a',
              background: 'transparent',
              color: '#1a1a1a',
              fontWeight: '900',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = '#1a1a1a';
              (e.currentTarget as HTMLButtonElement).style.color = '#e9d460';
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-5px)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              (e.currentTarget as HTMLButtonElement).style.color = '#1a1a1a';
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
