import { useState, useRef, useEffect } from 'react';
import { ExerciseIntro } from '../../data/exerciseIntros';
import { synthesizeSpeechTTS } from '../../api/client';
import { AccentId } from '../../data/types';

interface Props {
  intro: ExerciseIntro;
  onStartExercise: () => void;
  learningLanguage?: string;
}

export function ExerciseIntroduction({ intro, onStartExercise, learningLanguage }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSubtitleEs, setCurrentSubtitleEs] = useState('');
  const [currentSubtitleEn, setCurrentSubtitleEn] = useState('');
  const [progress, setProgress] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [floatingEmojis, setFloatingEmojis] = useState<Array<{ id: number; emoji: string; x: number; y: number }>>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const totalDurationRef = useRef<number>(0);
  const emojiCounterRef = useRef(0);

  useEffect(() => {
    return () => {
      if (audioRef.current) audioRef.current.pause();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  function updateSubtitlesAndEmojis(elapsed: number) {
    if (!intro.subtitles || intro.subtitles.length === 0) return;

    // Find the appropriate subtitle based on elapsed time using actual time values
    let currentSubIdx = -1;
    for (let i = 0; i < intro.subtitles.length; i++) {
      if (elapsed >= intro.subtitles[i].time) {
        currentSubIdx = i;
      } else {
        break;
      }
    }

    setCurrentIdx(Math.max(0, currentSubIdx));

    if (currentSubIdx >= 0 && currentSubIdx < intro.subtitles.length) {
      const subtitle = intro.subtitles[currentSubIdx];
      setCurrentSubtitleEs(subtitle.es);
      setCurrentSubtitleEn(subtitle.en);

      // Add floating emoji every 0.5 seconds with random position
      if (Math.random() < 0.3) {
        const emojis = ['✨', '🎯', '💡', '📚', '🌟', '⭐', '🎊', '🎉'];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        const newEmoji = {
          id: emojiCounterRef.current++,
          emoji: randomEmoji,
          x: Math.random() * 80 + 10,
          y: Math.random() * 60 + 20,
        };
        setFloatingEmojis((prev) => [...prev.slice(-8), newEmoji]);
      }
    }
  }

  async function playIntroduction() {
    if (audioRef.current) audioRef.current.pause();
    if (timerRef.current) clearInterval(timerRef.current);

    setIsLoadingAudio(true);
    const fullText = `${intro.explanationEs} ${intro.example || ''}`;

    // Get accent based on learning language
    const accent: AccentId = learningLanguage === 'ru' ? 'ru-RU' : 'es-ES';

    try {
      const audioBlob = await synthesizeSpeechTTS({ text: fullText, accent });
      if (!audioBlob) {
        console.error('Failed to synthesize speech');
        setIsLoadingAudio(false);
        return;
      }

      const audioUrl = URL.createObjectURL(audioBlob);
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }
      audioRef.current.src = audioUrl;

      // Estimate duration from audio
      audioRef.current.onloadedmetadata = () => {
        const duration = audioRef.current?.duration ?? 10;
        totalDurationRef.current = duration;
        setTotalDuration(duration);
      };

      startTimeRef.current = Date.now();
      setIsPlaying(true);
      setCurrentSubtitleEs('');
      setCurrentSubtitleEn('');
      setProgress(0);
      setFloatingEmojis([]);
      emojiCounterRef.current = 0;
      setCurrentIdx(0);
      setIsLoadingAudio(false);

      audioRef.current.play();

      timerRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        setProgress(elapsed);
        updateSubtitlesAndEmojis(elapsed);
      }, 150);

      audioRef.current.onended = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsPlaying(false);
        setFloatingEmojis([]);
        if (intro.subtitles && intro.subtitles.length > 0) {
          const lastSub = intro.subtitles[intro.subtitles.length - 1];
          setCurrentSubtitleEs(lastSub.es);
          setCurrentSubtitleEn(lastSub.en);
          setCurrentIdx(intro.subtitles.length - 1);
        }
      };
    } catch (error) {
      console.error('Error playing introduction:', error);
      setIsLoadingAudio(false);
      setIsPlaying(false);
    }
  }

  function stopPlayback() {
    if (audioRef.current) audioRef.current.pause();
    setIsPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setCurrentSubtitleEs('');
    setCurrentSubtitleEn('');
    setFloatingEmojis([]);
  }

  return (
    <div className="exercise-overlay">
      <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '1200px', height: '95vh', overflow: 'hidden', background: 'var(--bone)', borderRadius: '16px', boxShadow: '0 20px 60px rgba(107,31,46,.3)' }}>
        <button className="modal-close" aria-label="Close" onClick={onStartExercise} style={{ zIndex: 100 }}>✕</button>

        {/* Main Video Section - Interactive & Visual */}
        <div style={{ flex: 1, background: 'linear-gradient(135deg, var(--bone) 0%, var(--bone-dim) 50%, rgba(184,147,90,.1) 100%)', padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
          {/* Animated background */}
          {isPlaying && (
            <>
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'repeating-linear-gradient(0deg, rgba(184,147,90,.03) 0px, rgba(184,147,90,.03) 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, rgba(184,147,90,.03) 0px, rgba(184,147,90,.03) 1px, transparent 1px, transparent 40px)',
                opacity: 0.5,
              }} />
              {/* Animated color overlay pulse */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle at 50% 50%, rgba(184,147,90,.08) 0%, transparent 100%)',
                animation: 'pulse 4s ease-in-out infinite',
              }} />
            </>
          )}

          {/* Floating animated emojis - DOPAMINE VISUAL */}
          {floatingEmojis.map((item) => (
            <div
              key={item.id}
              style={{
                position: 'absolute',
                left: `${item.x}%`,
                top: `${item.y}%`,
                fontSize: '2.5rem',
                animation: `floatUp ${2 + Math.random() * 1}s ease-out forwards`,
                pointerEvents: 'none',
                zIndex: 5,
              }}
            >
              {item.emoji}
            </div>
          ))}

          {/* Topic Title with icon */}
          <div style={{ position: 'relative', zIndex: 10, marginBottom: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--wine)', marginBottom: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
              {intro.icon} Introducción al Tema
            </div>
            <h1
              style={{
                color: 'var(--wine)',
                fontSize: '3.5rem',
                margin: 0,
                animation: isPlaying ? 'slideDown 0.8s ease-out' : 'none',
                textShadow: '3px 3px 8px rgba(58,15,25,.15)',
                fontWeight: 'bold',
                letterSpacing: '1px',
                lineHeight: 1.2,
              }}
            >
              {intro.topic}
            </h1>
          </div>

          {/* Progress indicator circles */}
          <div style={{
            position: 'relative',
            zIndex: 10,
            marginBottom: '2rem',
            display: 'flex',
            gap: '0.8rem',
            justifyContent: 'center',
          }}>
            {intro.subtitles && intro.subtitles.map((_, idx) => (
              <div
                key={idx}
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: idx <= currentIdx ? 'var(--wine)' : 'rgba(107,31,46,.2)',
                  transition: 'all 0.3s ease',
                  transform: idx <= currentIdx ? 'scale(1.2)' : 'scale(1)',
                }}
              />
            ))}
          </div>

          <style>{`
            @keyframes floatUp {
              0% {
                opacity: 1;
                transform: translateY(0) scale(1) rotate(0deg);
              }
              100% {
                opacity: 0;
                transform: translateY(-100px) scale(0.5) rotate(360deg);
              }
            }
            @keyframes pulse {
              0%, 100% { opacity: 0.3; }
              50% { opacity: 0.6; }
            }
            @keyframes slideDown {
              from { transform: translateY(-40px); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
          `}</style>
        </div>

        {/* Subtitles - SYNCED TO AUDIO */}
        <div style={{ background: 'linear-gradient(90deg, rgba(107,31,46,.08) 0%, rgba(184,147,90,.05) 100%)', padding: '2.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem', minHeight: '220px', borderTop: `4px solid var(--wine)` }}>
          {/* Spanish Subtitles */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: '900', color: 'var(--wine)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
              🇪🇸 ESPAÑOL
            </div>
            <div
              style={{
                color: 'var(--ink)',
                fontSize: '1.35rem',
                fontWeight: '600',
                lineHeight: 1.9,
                minHeight: '140px',
                padding: '1.5rem',
                background: currentSubtitleEs ? 'rgba(184,147,90,.12)' : 'rgba(184,147,90,.05)',
                borderRadius: '10px',
                border: `3px solid ${currentSubtitleEs ? 'var(--wine)' : 'rgba(107,31,46,.15)'}`,
                transition: 'all 0.2s ease',
                animation: currentSubtitleEs && isPlaying ? 'textPulse 0.4s ease' : 'none',
              }}
            >
              {currentSubtitleEs || ' '}
            </div>
          </div>

          {/* English Subtitles */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: '900', color: 'var(--wine)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
              🇬🇧 ENGLISH
            </div>
            <div
              style={{
                color: 'var(--ink)',
                fontSize: '1.35rem',
                fontWeight: '600',
                lineHeight: 1.9,
                minHeight: '140px',
                padding: '1.5rem',
                background: currentSubtitleEn ? 'rgba(184,147,90,.12)' : 'rgba(184,147,90,.05)',
                borderRadius: '10px',
                border: `3px solid ${currentSubtitleEn ? 'var(--wine)' : 'rgba(107,31,46,.15)'}`,
                transition: 'all 0.2s ease',
                animation: currentSubtitleEn && isPlaying ? 'textPulse 0.4s ease' : 'none',
              }}
            >
              {currentSubtitleEn || ' '}
            </div>
          </div>

          <style>{`
            @keyframes textPulse {
              0% { transform: scale(0.98); }
              50% { transform: scale(1.02); }
              100% { transform: scale(1); }
            }
          `}</style>
        </div>

        {/* Progress Bar */}
        {isPlaying && (
          <div style={{ height: '14px', background: 'rgba(107,31,46,.12)', position: 'relative', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, var(--wine) 0%, var(--gold) 50%, var(--wine) 100%)',
                backgroundSize: '200% 100%',
                width: `${totalDuration > 0 ? (progress / totalDuration) * 100 : 0}%`,
                transition: 'width 0.15s linear',
                boxShadow: '0 0 20px rgba(107,31,46,.6)',
                animation: 'shimmer 2s infinite',
              }}
            />
            <style>{`
              @keyframes shimmer {
                0%, 100% { backgroundPosition: '200% 0'; }
                50% { backgroundPosition: '0% 0'; }
              }
            `}</style>
          </div>
        )}

        {/* Control Buttons */}
        <div style={{ padding: '1.8rem', display: 'flex', gap: '1.2rem', background: 'var(--bone)' }}>
          {!isPlaying ? (
            <button
              onClick={playIntroduction}
              disabled={isLoadingAudio}
              style={{
                flex: 1,
                padding: '1.3rem',
                fontSize: '1.15rem',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-soft) 100%)',
                color: '#1a1410',
                fontWeight: '800',
                cursor: isLoadingAudio ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 25px rgba(184,147,90,.4)',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                opacity: isLoadingAudio ? 0.6 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isLoadingAudio) {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-4px)';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 12px 35px rgba(184,147,90,.6)';
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 25px rgba(184,147,90,.4)';
              }}
            >
              {isLoadingAudio ? '⏳ Generando audio...' : '▶️ VER VÍDEO'}
            </button>
          ) : (
            <button
              onClick={stopPlayback}
              style={{
                flex: 1,
                padding: '1.3rem',
                fontSize: '1.15rem',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, var(--wine) 0%, var(--wine-deep) 100%)',
                color: 'var(--bone)',
                fontWeight: '800',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 25px rgba(107,31,46,.4)',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-4px)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 12px 35px rgba(107,31,46,.6)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 25px rgba(107,31,46,.4)';
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
              borderRadius: '10px',
              border: `3px solid var(--wine)`,
              background: 'transparent',
              color: 'var(--wine)',
              fontWeight: '800',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'var(--wine)';
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--bone)';
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-4px)';
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
