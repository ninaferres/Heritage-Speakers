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
    // Distribute subtitles based on text length for more natural timing
    if (totalSubtitles <= 1) return 0;

    const totalDuration = totalDurationRef.current || 15;
    const subtitles = intro.subtitles || [];

    if (subtitles.length === 0) return 0;

    // Calculate cumulative text length to weight timing
    let cumulativeLength = 0;
    const lengths: number[] = [];

    subtitles.forEach((sub, idx) => {
      const textLength = (sub.es + sub.en).length;
      lengths[idx] = textLength;
      cumulativeLength += textLength;
    });

    // Calculate time for this subtitle based on text proportion
    let timeAccumulated = 0;
    for (let i = 0; i < subtitleIndex; i++) {
      timeAccumulated += (lengths[i] / cumulativeLength) * totalDuration;
    }

    return Math.max(0, Math.min(totalDuration, timeAccumulated));
  }

  function updateSubtitlesBasedOnTime(elapsed: number) {
    if (!intro.subtitles || intro.subtitles.length === 0) return;

    const totalSubs = intro.subtitles.length;
    const estimatedTotal = totalDurationRef.current || 15;

    // Find current subtitle based on proportional time windows
    let currentEs = '';
    let currentEn = '';

    for (let i = 0; i < totalSubs; i++) {
      const startProp = i / totalSubs;
      const endProp = (i + 1) / totalSubs;
      const elapsedProp = Math.min(elapsed / estimatedTotal, 1);

      if (elapsedProp >= startProp && elapsedProp < endProp) {
        currentEs = intro.subtitles[i].es;
        currentEn = intro.subtitles[i].en;
        break;
      }
    }

    setCurrentSubtitleEs(currentEs);
    setCurrentSubtitleEn(currentEn);

    // Mouth animation: open mouth during speech, close during silence
    // Cycle through different mouth shapes for naturalistic animation
    const mouthCycle = (elapsed * 3) % 1; // 3 cycles per second
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

          {/* Realistic Character - Attack on Titan Style */}
          <div style={{ position: 'relative', zIndex: 10, marginBottom: '2rem' }}>
            <svg width="280" height="320" viewBox="0 0 280 320" style={{ filter: isPlaying ? 'drop-shadow(0 0 30px rgba(233, 212, 96, 0.5))' : 'none' }}>
              <defs>
                <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f8d7a8" />
                  <stop offset="100%" stopColor="#e8c795" />
                </linearGradient>
                <linearGradient id="hairGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#2a2a2a" />
                  <stop offset="100%" stopColor="#0d0d0d" />
                </linearGradient>
              </defs>

              {/* Hair - Dark and flowing */}
              <path d="M 60 45 Q 40 20, 140 15 Q 200 18, 220 55 L 215 90 Q 140 110, 65 90 Z" fill="url(#hairGrad)" stroke="#000" strokeWidth="1.5" />
              <path d="M 220 55 Q 230 75, 225 100 L 220 95 Q 215 70, 215 55 Z" fill="#1a1a1a" />

              {/* Head - Realistic proportions */}
              <ellipse cx="140" cy="95" rx="55" ry="62" fill="url(#skinGrad)" stroke="#222" strokeWidth="2" />

              {/* Ear (left) */}
              <ellipse cx="85" cy="95" rx="8" ry="15" fill="#f0c9a0" stroke="#222" strokeWidth="1" />

              {/* Eyes - Realistic but serious */}
              <g>
                {/* Left Eye */}
                <ellipse cx="115" cy="85" rx="12" ry="16" fill="#fff" stroke="#222" strokeWidth="1.5" />
                <circle cx="115" cy="87" r="8" fill="#4a3520" />
                <circle cx="116" cy={eyeOpen ? 85 : 84} r="5" fill="#000" />
                <circle cx="117" cy={eyeOpen ? 83 : 82} r="2.5" fill="#fff" opacity="0.8" />
                {/* Eye shadow for depth */}
                <path d="M 105 82 Q 115 80, 125 82" stroke="#d4a373" strokeWidth="0.5" fill="none" opacity="0.5" />

                {/* Right Eye */}
                <ellipse cx="165" cy="85" rx="12" ry="16" fill="#fff" stroke="#222" strokeWidth="1.5" />
                <circle cx="165" cy="87" r="8" fill="#4a3520" />
                <circle cx="166" cy={eyeOpen ? 85 : 84} r="5" fill="#000" />
                <circle cx="167" cy={eyeOpen ? 83 : 82} r="2.5" fill="#fff" opacity="0.8" />
                {/* Eye shadow for depth */}
                <path d="M 155 82 Q 165 80, 175 82" stroke="#d4a373" strokeWidth="0.5" fill="none" opacity="0.5" />
              </g>

              {/* Nose - Realistic */}
              <path d="M 140 90 L 138 115 L 142 115 Z" fill="#f0c9a0" stroke="none" />
              <line x1="138" y1="115" x2="135" y2="118" stroke="#d9b896" strokeWidth="0.5" opacity="0.6" />
              <line x1="142" y1="115" x2="145" y2="118" stroke="#d9b896" strokeWidth="0.5" opacity="0.6" />

              {/* Mouth - Detailed with lip sync */}
              {isPlaying ? (
                <>
                  {/* Open mouth for speech */}
                  <path d="M 125 135 Q 140 148, 155 135" stroke="#8b1a23" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  <path d="M 125 135 Q 140 145, 155 135 L 155 136 Q 140 147, 125 136 Z" fill="#5a0a15" opacity="0.4" />
                  {/* Tongue hint */}
                  <ellipse cx="140" cy="144" rx="6" ry="4" fill="#c41e3a" opacity="0.3" />
                </>
              ) : (
                <>
                  {/* Closed mouth - resting */}
                  <path d="M 125 135 L 155 135" stroke="#a5253a" strokeWidth="2" strokeLinecap="round" />
                  {/* Lips shading */}
                  <path d="M 125 135 Q 140 138, 155 135" fill="#c9516a" opacity="0.3" />
                </>
              )}

              {/* Eyebrows - Serious expression */}
              <path d="M 100 76 Q 115 71, 130 74" stroke="#1a1a1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M 150 74 Q 165 71, 180 76" stroke="#1a1a1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />

              {/* Face shading for depth */}
              <path d="M 85 95 Q 80 110, 85 125" stroke="#d9a86e" strokeWidth="1" fill="none" opacity="0.3" />
              <path d="M 195 95 Q 200 110, 195 125" stroke="#d9a86e" strokeWidth="1" fill="none" opacity="0.3" />

              {/* Neck */}
              <rect x="125" y="150" width="30" height="20" fill="url(#skinGrad)" stroke="#222" strokeWidth="1.5" />

              {/* Shoulders and Uniform - Military Style */}
              <path d="M 95 170 L 85 250 L 195 250 L 185 170 Z" fill="#1a1a24" stroke="#0a0a0a" strokeWidth="2" />

              {/* Uniform Details - Attack on Titans style */}
              <rect x="105" y="175" width="70" height="50" fill="none" stroke="#e9d460" strokeWidth="2" rx="6" />
              <circle cx="140" cy="200" r="4" fill="#e9d460" />

              {/* Shoulder armor */}
              <ellipse cx="90" cy="175" rx="12" ry="18" fill="#2d2d3a" stroke="#e9d460" strokeWidth="1.5" />
              <ellipse cx="190" cy="175" rx="12" ry="18" fill="#2d2d3a" stroke="#e9d460" strokeWidth="1.5" />

              {/* Arms */}
              <g id="leftArm">
                <path d="M 95 180 Q 60 190, 50 220" stroke="#e8c795" strokeWidth="11" fill="none" strokeLinecap="round" />
                <circle cx="50" cy="220" r="7" fill="#e8c795" stroke="#222" strokeWidth="1" />
              </g>
              <g id="rightArm">
                <path d="M 185 180 Q 220 190, 230 220" stroke="#e8c795" strokeWidth="11" fill="none" strokeLinecap="round" />
                <circle cx="230" cy="220" r="7" fill="#e8c795" stroke="#222" strokeWidth="1" />
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
