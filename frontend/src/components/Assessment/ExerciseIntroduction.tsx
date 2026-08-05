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

          {/* Realistic Attack on Titan Character - Eren/Mikasa style */}
          <div style={{ position: 'relative', zIndex: 10, marginBottom: '2rem' }}>
            <svg width="340" height="420" viewBox="0 0 340 420" style={{ filter: isPlaying ? 'drop-shadow(0 0 30px rgba(184,147,90,.5))' : 'none' }}>
              <defs>
                <linearGradient id="darkHairGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#0d0a08" />
                  <stop offset="100%" stopColor="#000000" />
                </linearGradient>
                <linearGradient id="skinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f5e6d3" />
                  <stop offset="100%" stopColor="#e8d4bf" />
                </linearGradient>
                <linearGradient id="uniformGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="var(--wine)" />
                  <stop offset="100%" stopColor="#4a1420" />
                </linearGradient>
              </defs>

              {/* Hair - Dark, detailed, Attack on Titan style */}
              <path d="M 50 80 Q 30 45, 170 35 Q 310 45, 290 110 L 285 160 Q 170 190, 55 160 Z" fill="url(#darkHairGrad)" stroke="#000000" strokeWidth="1.5" />
              {/* Hair highlights/shadows */}
              <path d="M 100 60 Q 110 45, 130 50" stroke="#1a1515" strokeWidth="2" fill="none" opacity="0.8" />
              <path d="M 210 50 Q 230 45, 250 60" stroke="#1a1515" strokeWidth="2" fill="none" opacity="0.8" />
              {/* Hair strands texture */}
              <path d="M 70 80 Q 80 100, 75 130" stroke="#0a0805" strokeWidth="1" fill="none" opacity="0.6" />
              <path d="M 270 85 Q 260 105, 265 135" stroke="#0a0805" strokeWidth="1" fill="none" opacity="0.6" />

              {/* Head - Realistic proportions */}
              <ellipse cx="170" cy="155" rx="72" ry="95" fill="url(#skinGrad)" stroke="#3a3028" strokeWidth="2" />

              {/* Ears - Detailed */}
              <path d="M 98 155 Q 85 155, 80 175 Q 85 185, 98 180 Z" fill="#dcc0a5" stroke="#3a3028" strokeWidth="0.8" />
              <path d="M 242 155 Q 255 155, 260 175 Q 255 185, 242 180 Z" fill="#dcc0a5" stroke="#3a3028" strokeWidth="0.8" />
              <ellipse cx="92" cy="170" rx="3" ry="6" fill="#c9a68f" />
              <ellipse cx="248" cy="170" rx="3" ry="6" fill="#c9a68f" />

              {/* Eyes - Large, intense, realistic (Attack on Titan style) */}
              <g>
                {/* Left Eye */}
                <ellipse cx="140" cy="130" rx="16" ry="26" fill="#ffffff" stroke="#2a2015" strokeWidth="2" />
                {/* Iris */}
                <circle cx="140" cy="135" r="12" fill="#6b5a3d" />
                <circle cx="140" cy="135" r="9" fill="#3a2a15" />
                {/* Pupil */}
                <circle cx="140" cy="135" r="6" fill="#000000" />
                {/* Light reflection */}
                <circle cx="142" cy={mouthOpen ? 131 : 130} r="2.5" fill="#ffffff" opacity="0.95" />
                {/* Upper eyelid shadow */}
                <path d="M 128 120 Q 140 115, 152 120" stroke="#c9a68f" strokeWidth="1.5" fill="none" opacity="0.6" />
                {/* Lower eyelid definition */}
                <path d="M 128 150 Q 140 157, 152 150" stroke="#c9a68f" strokeWidth="1" fill="none" opacity="0.4" />
                {/* Eyelashes */}
                <path d="M 130 120 L 128 115" stroke="#1a1410" strokeWidth="1" opacity="0.8" />
                <path d="M 140 115 L 140 110" stroke="#1a1410" strokeWidth="1" opacity="0.8" />
                <path d="M 150 120 L 152 115" stroke="#1a1410" strokeWidth="1" opacity="0.8" />

                {/* Right Eye */}
                <ellipse cx="200" cy="130" rx="16" ry="26" fill="#ffffff" stroke="#2a2015" strokeWidth="2" />
                <circle cx="200" cy="135" r="12" fill="#6b5a3d" />
                <circle cx="200" cy="135" r="9" fill="#3a2a15" />
                <circle cx="200" cy="135" r="6" fill="#000000" />
                <circle cx="202" cy={mouthOpen ? 131 : 130} r="2.5" fill="#ffffff" opacity="0.95" />
                <path d="M 188 120 Q 200 115, 212 120" stroke="#c9a68f" strokeWidth="1.5" fill="none" opacity="0.6" />
                <path d="M 188 150 Q 200 157, 212 150" stroke="#c9a68f" strokeWidth="1" fill="none" opacity="0.4" />
                <path d="M 190 120 L 188 115" stroke="#1a1410" strokeWidth="1" opacity="0.8" />
                <path d="M 200 115 L 200 110" stroke="#1a1410" strokeWidth="1" opacity="0.8" />
                <path d="M 210 120 L 212 115" stroke="#1a1410" strokeWidth="1" opacity="0.8" />
              </g>

              {/* Nose - Realistic, defined */}
              <g>
                <path d="M 170 140 L 166 180 L 174 180 Z" fill="#dcc0a5" stroke="none" />
                <line x1="166" y1="180" x2="160" y2="185" stroke="#c9a68f" strokeWidth="0.8" opacity="0.5" />
                <line x1="174" y1="180" x2="180" y2="185" stroke="#c9a68f" strokeWidth="0.8" opacity="0.5" />
              </g>

              {/* Mouth - Serious, detailed, animates with speech */}
              {mouthOpen ? (
                <>
                  {/* Open/speaking mouth */}
                  <path d="M 150 210 Q 170 230, 190 210" stroke="#6b2835" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  <path d="M 150 210 Q 170 225, 190 210 L 190 212 Q 170 227, 150 212 Z" fill="#3a1420" opacity="0.6" />
                  {/* Tongue hint */}
                  <ellipse cx="170" cy="220" rx="9" ry="6" fill="#9b5465" opacity="0.5" />
                </>
              ) : (
                <>
                  {/* Closed mouth - determined, serious expression */}
                  <path d="M 150 210 L 190 210" stroke="#8b4a5a" strokeWidth="2.5" strokeLinecap="round" />
                  {/* Mouth line definition */}
                  <path d="M 150 210 Q 170 214, 190 210" fill="#c9516a" opacity="0.25" />
                </>
              )}

              {/* Eyebrows - Strong, serious, angled inward (intense expression) */}
              <g>
                {/* Left eyebrow */}
                <path d="M 125 115 Q 140 108, 155 113" stroke="#000000" strokeWidth="3" fill="none" strokeLinecap="round" />
                {/* Right eyebrow */}
                <path d="M 185 113 Q 200 108, 215 115" stroke="#000000" strokeWidth="3" fill="none" strokeLinecap="round" />
              </g>

              {/* Cheekbones - Facial structure definition */}
              <g opacity="0.3">
                <path d="M 100 160 Q 95 180, 105 200" stroke="#c9a68f" strokeWidth="1.5" fill="none" />
                <path d="M 240 160 Q 245 180, 235 200" stroke="#c9a68f" strokeWidth="1.5" fill="none" />
              </g>

              {/* Facial shadows - Realism */}
              <g opacity="0.2">
                <ellipse cx="100" cy="180" rx="15" ry="30" fill="#6b5a4d" />
                <ellipse cx="240" cy="180" rx="15" ry="30" fill="#6b5a4d" />
              </g>

              {/* Neck - Realistic */}
              <rect x="155" y="245" width="30" height="35" fill="url(#skinGrad)" stroke="#3a3028" strokeWidth="1.5" />

              {/* Shoulders and Military Uniform - Wine/Gold colors */}
              <path d="M 110 280 L 90 390 L 250 390 L 230 280 Z" fill="url(#uniformGrad)" stroke="#1a0a0f" strokeWidth="2.5" />

              {/* Uniform - Wing emblem area (cross-looking pattern) */}
              <g>
                <circle cx="170" cy="310" r="30" fill="none" stroke="var(--gold)" strokeWidth="2.5" />
                {/* Cross pattern inside */}
                <line x1="170" y1="285" x2="170" y2="335" stroke="var(--gold)" strokeWidth="1.5" opacity="0.7" />
                <line x1="145" y1="310" x2="195" y2="310" stroke="var(--gold)" strokeWidth="1.5" opacity="0.7" />
              </g>

              {/* Shoulder armor detail - Wine color */}
              <ellipse cx="105" cy="285" rx="18" ry="28" fill="none" stroke="var(--wine)" strokeWidth="2" />
              <ellipse cx="235" cy="285" rx="18" ry="28" fill="none" stroke="var(--wine)" strokeWidth="2" />

              {/* Arms - Muscular, defined uniform sleeves */}
              <g id="leftArm">
                <path d="M 110 295 Q 75 315, 55 360" stroke="#5a3828" strokeWidth="15" fill="none" strokeLinecap="round" />
                <circle cx="55" cy="360" r="9" fill="url(#skinGrad)" stroke="#3a3028" strokeWidth="1.5" />
              </g>
              <g id="rightArm">
                <path d="M 230 295 Q 265 315, 285 360" stroke="#5a3828" strokeWidth="15" fill="none" strokeLinecap="round" />
                <circle cx="285" cy="360" r="9" fill="url(#skinGrad)" stroke="#3a3028" strokeWidth="1.5" />
              </g>

              {/* Uniform sleeve cuffs - Gold trim */}
              <g opacity="0.8">
                <rect x="40" y="355" width="30" height="8" fill="none" stroke="var(--gold)" strokeWidth="1.5" rx="2" />
                <rect x="270" y="355" width="30" height="8" fill="none" stroke="var(--gold)" strokeWidth="1.5" rx="2" />
              </g>
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
                background: 'var(--gold)',
                color: '#1a1410',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 6px 20px rgba(184,147,90,.4)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-3px)';
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
                borderRadius: '8px',
                border: 'none',
                background: 'var(--wine)',
                color: 'var(--bone)',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 6px 20px rgba(107,31,46,.4)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-3px)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 10px 30px rgba(107,31,46,.6)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 20px rgba(107,31,46,.4)';
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
