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
  const [visibleIcons, setVisibleIcons] = useState<number[]>([]);

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

    // Show icons progressively throughout the video
    const progressPercent = totalDurationRef.current > 0 ? (elapsed / totalDurationRef.current) * 100 : 0;
    const iconsToShow = Math.min(Math.floor(progressPercent / 20), 5);
    setVisibleIcons(Array.from({ length: iconsToShow }, (_, i) => i));
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
    setVisibleIcons([]);

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
    setVisibleIcons([]);
  }

  // Icon colors by skill type
  const iconColors: Record<string, string> = {
    'reading': '#6b1f2e',
    'writing': '#b8935a',
    'speaking': '#2a2320',
    'listening': '#6b1f2e',
  };

  const skillLower = (intro.icon || '').toLowerCase();
  const iconColor = Object.values(iconColors)[visibleIcons.length % 4] || '#6b1f2e';

  // Educational icons related to each skill
  const skillIcons: Record<string, string[]> = {
    'reading': ['📖', '📝', '📄', '🔤', '✨'],
    'writing': ['✏️', '📝', '🖊️', '💭', '✨'],
    'speaking': ['🗣️', '🎙️', '💬', '🎯', '✨'],
    'listening': ['👂', '🎧', '🔊', '🎵', '✨'],
  };

  const getSkillIcons = () => {
    const intro_lower = intro.topic.toLowerCase();
    if (intro_lower.includes('lectura') || intro_lower.includes('reading')) return skillIcons.reading;
    if (intro_lower.includes('escrit') || intro_lower.includes('writing')) return skillIcons.writing;
    if (intro_lower.includes('habl') || intro_lower.includes('speaking')) return skillIcons.speaking;
    if (intro_lower.includes('escuch') || intro_lower.includes('listening')) return skillIcons.listening;
    return skillIcons.reading;
  };

  const icons = getSkillIcons();

  return (
    <div className="exercise-overlay">
      <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '1200px', height: '95vh', overflow: 'hidden', background: 'var(--bone)', borderRadius: '16px', boxShadow: '0 20px 60px rgba(107,31,46,.3)' }}>
        <button className="modal-close" aria-label="Close" onClick={onStartExercise} style={{ zIndex: 100 }}>✕</button>

        {/* Main Video Section - Minimalist Design */}
        <div style={{ flex: 1, background: 'linear-gradient(135deg, var(--bone) 0%, var(--bone-dim) 50%, rgba(184,147,90,.1) 100%)', padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
          {/* Animated background grid */}
          {isPlaying && (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'repeating-linear-gradient(0deg, rgba(184,147,90,.03) 0px, rgba(184,147,90,.03) 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, rgba(184,147,90,.03) 0px, rgba(184,147,90,.03) 1px, transparent 1px, transparent 40px)',
              opacity: 0.5,
            }} />
          )}

          {/* Topic Title */}
          <div style={{ position: 'relative', zIndex: 10, marginBottom: '3rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--wine)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
              📚 Introducción
            </div>
            <h1
              style={{
                color: 'var(--wine)',
                fontSize: '3.2rem',
                margin: 0,
                animation: isPlaying ? 'slideDown 0.8s ease-out' : 'none',
                textShadow: '2px 2px 4px rgba(58,15,25,.1)',
                fontWeight: 'bold',
                letterSpacing: '1px',
                lineHeight: 1.2,
              }}
            >
              {intro.topic}
            </h1>
          </div>

          {/* Animated Icons Grid */}
          <div style={{
            position: 'relative',
            zIndex: 10,
            marginBottom: '2rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '2rem',
            maxWidth: '600px',
          }}>
            {icons.map((icon, idx) => (
              <div
                key={idx}
                style={{
                  fontSize: '3.5rem',
                  animation: visibleIcons.includes(idx) ? `popIn ${0.4 + idx * 0.1}s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards` : 'none',
                  opacity: visibleIcons.includes(idx) ? 1 : 0,
                  transform: visibleIcons.includes(idx) ? 'scale(1) rotate(0deg)' : 'scale(0) rotate(-180deg)',
                  transition: 'all 0.3s ease',
                }}
              >
                {icon}
              </div>
            ))}
          </div>

          {/* Key concepts that appear */}
          <div style={{
            position: 'relative',
            zIndex: 10,
            marginBottom: '2rem',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '1rem',
            maxWidth: '800px',
          }}>
            {isPlaying && visibleIcons.length > 2 && (
              <>
                <span style={{
                  display: 'inline-block',
                  padding: '0.6rem 1.2rem',
                  background: 'rgba(107,31,46,.1)',
                  color: 'var(--wine)',
                  borderRadius: '999px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  border: '2px solid var(--wine)',
                  animation: 'fadeIn 0.5s ease',
                }}>
                  {intro.icon} Tema Clave
                </span>
              </>
            )}
            {isPlaying && visibleIcons.length > 3 && (
              <span style={{
                display: 'inline-block',
                padding: '0.6rem 1.2rem',
                background: 'rgba(184,147,90,.1)',
                color: 'var(--gold)',
                borderRadius: '999px',
                fontSize: '1rem',
                fontWeight: '600',
                border: '2px solid var(--gold)',
                animation: 'fadeIn 0.5s ease',
              }}>
                ✨ Aprende Nuevo
              </span>
            )}
            {isPlaying && visibleIcons.length > 4 && (
              <span style={{
                display: 'inline-block',
                padding: '0.6rem 1.2rem',
                background: 'rgba(42,35,32,.1)',
                color: 'var(--charcoal)',
                borderRadius: '999px',
                fontSize: '1rem',
                fontWeight: '600',
                border: '2px solid var(--charcoal)',
                animation: 'fadeIn 0.5s ease',
              }}>
                🎯 Ejercicio
              </span>
            )}
          </div>

          <style>{`
            @keyframes popIn {
              0% {
                opacity: 0;
                transform: scale(0) rotate(-180deg);
              }
              60% {
                transform: scale(1.2) rotate(10deg);
              }
              100% {
                opacity: 1;
                transform: scale(1) rotate(0deg);
              }
            }
            @keyframes slideDown {
              from { transform: translateY(-40px); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </div>

        {/* Subtitles - SYNCED PERFECTLY */}
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
