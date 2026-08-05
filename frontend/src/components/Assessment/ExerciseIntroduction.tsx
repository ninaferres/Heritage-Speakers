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
  const [mouthOpen, setMouthOpen] = useState(false);

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

  function updateSubtitlesBasedOnTime(elapsed: number) {
    if (!intro.subtitles || intro.subtitles.length === 0) return;

    // Use the actual time values from subtitle data
    let currentEs = '';
    let currentEn = '';
    let foundSubtitle = false;

    for (let i = 0; i < intro.subtitles.length; i++) {
      const subtitle = intro.subtitles[i];
      const nextSubtitle = intro.subtitles[i + 1];

      // Check if current elapsed time falls within this subtitle's window
      const nextTime = nextSubtitle ? nextSubtitle.time : totalDurationRef.current + 5;

      if (elapsed >= subtitle.time && elapsed < nextTime) {
        currentEs = subtitle.es;
        currentEn = subtitle.en;
        foundSubtitle = true;
        break;
      }
    }

    // If we went past all subtitles, show the last one
    if (!foundSubtitle && intro.subtitles.length > 0) {
      const lastIdx = intro.subtitles.length - 1;
      if (elapsed >= intro.subtitles[lastIdx].time) {
        currentEs = intro.subtitles[lastIdx].es;
        currentEn = intro.subtitles[lastIdx].en;
      }
    }

    setCurrentSubtitleEs(currentEs);
    setCurrentSubtitleEn(currentEn);

    // Mouth animation: open/close in cycles while speaking
    const mouthCycle = Math.sin(elapsed * 4) > 0.3;
    setMouthOpen(mouthCycle);
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

    // Estimate duration: 150 words per minute for Spanish
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
      <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '1200px', height: '95vh', overflow: 'hidden', background: 'var(--bone)', borderRadius: '16px', boxShadow: '0 20px 60px rgba(107,31,46,.3)' }}>
        <button className="modal-close" aria-label="Close" onClick={onStartExercise} style={{ zIndex: 100 }}>✕</button>

        {/* Main Video Section - Website Color Scheme */}
        <div style={{ flex: 1, background: 'linear-gradient(135deg, var(--bone) 0%, var(--bone-dim) 50%, rgba(184,147,90,.1) 100%)', padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
          {/* Background Effects */}
          {isPlaying && (
            <>
              <div style={{ position: 'absolute', width: '200%', height: '200%', top: '-50%', left: '-50%', background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(184,147,90,.05) 10px, rgba(184,147,90,.05) 20px)', animation: 'scan 8s linear infinite' }} />
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    width: `${150 + i * 50}px`,
                    height: `${150 + i * 50}px`,
                    border: `2px solid rgba(184,147,90, ${0.15 - i * 0.05})`,
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

          {/* Realistic Attack on Titan Character */}
          <div style={{ position: 'relative', zIndex: 10, marginBottom: '2rem' }}>
            <svg width="300" height="360" viewBox="0 0 300 360" style={{ filter: isPlaying ? 'drop-shadow(0 0 25px rgba(184,147,90,.4))' : 'none' }}>
              <defs>
                <linearGradient id="darkHair" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#1a1410" />
                  <stop offset="100%" stopColor="#0a0805" />
                </linearGradient>
                <linearGradient id="skin" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#e8d4bf" />
                  <stop offset="100%" stopColor="#d4b8a0" />
                </linearGradient>
                <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
                </filter>
              </defs>

              {/* Dark Hair - Attack on Titan style (dark, slicked back) */}
              <path d="M 50 60 Q 30 35, 150 25 Q 270 35, 250 80 L 245 120 Q 150 145, 55 120 Z" fill="url(#darkHair)" stroke="#0a0805" strokeWidth="1" filter="url(#shadow)" />
              {/* Hair detail - bangs */}
              <path d="M 120 60 Q 130 50, 150 48 Q 170 50, 180 60" fill="#0a0805" opacity="0.6" />

              {/* Head - Realistic proportions */}
              <ellipse cx="150" cy="115" rx="62" ry="75" fill="url(#skin)" stroke="#3a2f28" strokeWidth="1.5" filter="url(#shadow)" />

              {/* Ears */}
              <ellipse cx="88" cy="115" rx="9" ry="18" fill="#dcc0a5" stroke="#3a2f28" strokeWidth="0.5" />
              <ellipse cx="212" cy="115" rx="9" ry="18" fill="#dcc0a5" stroke="#3a2f28" strokeWidth="0.5" />

              {/* Eyes - Intense, serious expression */}
              <g>
                {/* Left Eye */}
                <ellipse cx="120" cy="100" rx="14" ry="20" fill="#f5f5f5" stroke="#3a2f28" strokeWidth="1.5" />
                <circle cx="120" cy="103" r="10" fill="#3a4a4a" />
                <circle cx="120" cy="103" r="7" fill="#0a0a0a" />
                <circle cx="122" cy={mouthOpen ? 100 : 99} r="3.5" fill="#fff" opacity="0.9" />
                {/* Upper eyelid shadow for serious look */}
                <path d="M 108 95 Q 120 91, 132 95" stroke="#c9a68f" strokeWidth="1.2" fill="none" opacity="0.7" />
                {/* Lower eyelid definition */}
                <path d="M 108 115 Q 120 122, 132 115" stroke="#c9a68f" strokeWidth="0.8" fill="none" opacity="0.5" />

                {/* Right Eye */}
                <ellipse cx="180" cy="100" rx="14" ry="20" fill="#f5f5f5" stroke="#3a2f28" strokeWidth="1.5" />
                <circle cx="180" cy="103" r="10" fill="#3a4a4a" />
                <circle cx="180" cy="103" r="7" fill="#0a0a0a" />
                <circle cx="182" cy={mouthOpen ? 100 : 99} r="3.5" fill="#fff" opacity="0.9" />
                {/* Upper eyelid shadow */}
                <path d="M 168 95 Q 180 91, 192 95" stroke="#c9a68f" strokeWidth="1.2" fill="none" opacity="0.7" />
                {/* Lower eyelid definition */}
                <path d="M 168 115 Q 180 122, 192 115" stroke="#c9a68f" strokeWidth="0.8" fill="none" opacity="0.5" />
              </g>

              {/* Nose - Realistic */}
              <path d="M 150 105 L 147 145 L 153 145 Z" fill="#dcc0a5" stroke="none" />
              <line x1="147" y1="145" x2="142" y2="150" stroke="#c9a68f" strokeWidth="0.6" opacity="0.6" />
              <line x1="153" y1="145" x2="158" y2="150" stroke="#c9a68f" strokeWidth="0.6" opacity="0.6" />

              {/* Mouth - Determined expression, animates with speech */}
              {mouthOpen ? (
                <>
                  {/* Open/speaking mouth */}
                  <path d="M 130 165 Q 150 180, 170 165" stroke="#7a2835" strokeWidth="2" fill="none" strokeLinecap="round" />
                  <path d="M 130 165 Q 150 175, 170 165 L 170 167 Q 150 177, 130 167 Z" fill="#4a1420" opacity="0.5" />
                  <ellipse cx="150" cy="172" rx="8" ry="5" fill="#8b4452" opacity="0.4" />
                </>
              ) : (
                <>
                  {/* Closed/neutral mouth - determined expression */}
                  <path d="M 130 165 L 170 165" stroke="#8b4452" strokeWidth="2" strokeLinecap="round" />
                  <path d="M 130 165 Q 150 168, 170 165" fill="#b8776b" opacity="0.2" />
                </>
              )}

              {/* Eyebrows - Strong, serious, determined expression */}
              <path d="M 105 88 Q 120 82, 135 86" stroke="#0a0805" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M 165 86 Q 180 82, 195 88" stroke="#0a0805" strokeWidth="2.5" fill="none" strokeLinecap="round" />

              {/* Cheekbones - Facial definition */}
              <path d="M 88 120 Q 85 135, 88 150" stroke="#c9a68f" strokeWidth="1" fill="none" opacity="0.3" />
              <path d="M 212 120 Q 215 135, 212 150" stroke="#c9a68f" strokeWidth="1" fill="none" opacity="0.3" />

              {/* Neck */}
              <rect x="135" y="185" width="30" height="25" fill="url(#skin)" stroke="#3a2f28" strokeWidth="1" />

              {/* Shoulders and Military Uniform */}
              <path d="M 100 210 L 85 310 L 215 310 L 200 210 Z" fill="#2a1a14" stroke="#0a0805" strokeWidth="2" />

              {/* Uniform - Attack on Titan Corps emblem area */}
              <circle cx="150" cy="235" r="25" fill="none" stroke="var(--wine)" strokeWidth="2" />
              <path d="M 140 235 L 150 225 L 160 235" fill="var(--wine)" opacity="0.3" />

              {/* Gold trim on uniform (wing insignia style) */}
              <ellipse cx="120" cy="240" rx="8" ry="12" fill="none" stroke="var(--gold)" strokeWidth="1.5" transform="rotate(-30 120 240)" />
              <ellipse cx="180" cy="240" rx="8" ry="12" fill="none" stroke="var(--gold)" strokeWidth="1.5" transform="rotate(30 180 240)" />

              {/* Arms - Military uniform sleeves */}
              <g id="leftArm">
                <path d="M 100 220 Q 65 235, 50 280" stroke="#3a2417" strokeWidth="13" fill="none" strokeLinecap="round" />
                <circle cx="50" cy="280" r="8" fill="url(#skin)" stroke="#3a2f28" strokeWidth="1" />
              </g>
              <g id="rightArm">
                <path d="M 200 220 Q 235 235, 250 280" stroke="#3a2417" strokeWidth="13" fill="none" strokeLinecap="round" />
                <circle cx="250" cy="280" r="8" fill="url(#skin)" stroke="#3a2f28" strokeWidth="1" />
              </g>

              {/* Uniform sleeves detail */}
              <ellipse cx="50" cy="260" rx="7" ry="15" fill="none" stroke="var(--wine)" strokeWidth="0.8" opacity="0.5" />
              <ellipse cx="250" cy="260" rx="7" ry="15" fill="none" stroke="var(--wine)" strokeWidth="0.8" opacity="0.5" />
            </svg>
          </div>

          {/* Title */}
          <h1
            style={{
              color: 'var(--wine)',
              fontSize: '2.8rem',
              marginBottom: '1rem',
              textAlign: 'center',
              animation: isPlaying ? 'slideDown 0.8s ease-out' : 'none',
              zIndex: 10,
              textShadow: '2px 2px 4px rgba(58,15,25,.1)',
              fontWeight: 'bold',
              letterSpacing: '1px',
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

        {/* Subtitles - Synced to actual timeline data */}
        <div style={{ background: 'linear-gradient(90deg, rgba(107,31,46,.08) 0%, rgba(184,147,90,.05) 100%)', padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', minHeight: '200px', borderTop: `4px solid var(--wine)` }}>
          {/* Spanish Subtitles */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--wine)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
              🇪🇸 ESPAÑOL
            </div>
            <div
              style={{
                color: 'var(--ink)',
                fontSize: '1.25rem',
                fontWeight: '600',
                lineHeight: 1.8,
                minHeight: '120px',
                padding: '1.2rem',
                background: 'rgba(184,147,90,.08)',
                borderRadius: '8px',
                border: `3px solid ${currentSubtitleEs ? 'var(--wine)' : 'rgba(107,31,46,.2)'}`,
                transition: 'all 0.25s ease',
                animation: currentSubtitleEs && isPlaying ? 'textAppear 0.3s ease' : 'none',
              }}
            >
              {currentSubtitleEs || ' '}
            </div>
          </div>

          {/* English Subtitles */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--wine)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
              🇬🇧 ENGLISH
            </div>
            <div
              style={{
                color: 'var(--ink)',
                fontSize: '1.25rem',
                fontWeight: '600',
                lineHeight: 1.8,
                minHeight: '120px',
                padding: '1.2rem',
                background: 'rgba(184,147,90,.08)',
                borderRadius: '8px',
                border: `3px solid ${currentSubtitleEn ? 'var(--wine)' : 'rgba(107,31,46,.2)'}`,
                transition: 'all 0.25s ease',
                animation: currentSubtitleEn && isPlaying ? 'textAppear 0.3s ease' : 'none',
              }}
            >
              {currentSubtitleEn || ' '}
            </div>
          </div>

          <style>{`
            @keyframes textAppear {
              0% { opacity: 0.6; }
              100% { opacity: 1; }
            }
          `}</style>
        </div>

        {/* Progress Bar */}
        {isPlaying && (
          <div style={{ height: '12px', background: 'rgba(107,31,46,.1)', position: 'relative', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, var(--wine) 0%, var(--gold) 100%)',
                width: `${totalDuration > 0 ? (progress / totalDuration) * 100 : 0}%`,
                transition: 'width 0.1s linear',
                boxShadow: '0 0 15px rgba(107,31,46,.5)',
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
                borderRadius: '8px',
                border: 'none',
                background: 'var(--wine)',
                color: 'var(--bone)',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 6px 20px rgba(107,31,46,.3)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-3px)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 10px 30px rgba(107,31,46,.5)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 20px rgba(107,31,46,.3)';
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
                borderRadius: '8px',
                border: 'none',
                background: 'var(--wine)',
                color: 'var(--bone)',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 6px 20px rgba(107,31,46,.3)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-3px)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 10px 30px rgba(107,31,46,.5)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 20px rgba(107,31,46,.3)';
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
              borderRadius: '8px',
              border: `2px solid var(--wine)`,
              background: 'transparent',
              color: 'var(--wine)',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'var(--wine)';
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--bone)';
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-3px)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--wine)';
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
