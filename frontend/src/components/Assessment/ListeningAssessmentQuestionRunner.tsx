import { useState, useRef, useEffect } from 'react';
import { ListeningAssessmentQuestion, AccentId } from '../../data/types';
import { synthesizeSpeechTTS } from '../../api/client';
import { useLanguage } from '../../context/LanguageContext';
import { getString } from '../../i18n/strings';

interface Props {
  question: ListeningAssessmentQuestion;
  selected: string | null;
  onSelect: (option: string) => void;
  disabled: boolean;
}

export function ListeningAssessmentQuestionRunner({ question, selected, onSelect, disabled }: Props) {
  const { uiLanguage, learningLanguage } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [playCount, setPlayCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  async function playAudio() {
    setError(null);
    setIsLoading(true);
    try {
      const accent: AccentId = learningLanguage === 'ru' ? 'ru-RU' : 'es-ES';
      const audioBlob = await synthesizeSpeechTTS({ text: question.audioText, accent });
      const audioUrl = URL.createObjectURL(audioBlob);
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }
      audioRef.current.src = audioUrl;
      audioRef.current.onended = () => {
        setIsPlaying(false);
        setPlayCount((prev) => prev + 1);
      };
      audioRef.current.onerror = () => {
        setError('Error playing audio. Please try again.');
        setIsPlaying(false);
      };
      setIsLoading(false);
      setIsPlaying(true);
      audioRef.current.play();
    } catch (err) {
      setIsLoading(false);
      setError(err instanceof Error ? err.message : 'Failed to generate audio. Please try again.');
    }
  }

  function stopAudio() {
    audioRef.current?.pause();
    setIsPlaying(false);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h3 style={{ color: 'var(--wine-ink)', marginBottom: '1rem' }}>{question.question}</h3>
      </div>

      <div
        style={{
          padding: '1.5rem',
          backgroundColor: 'rgba(107,31,46,.08)',
          borderRadius: '12px',
          textAlign: 'center',
        }}
      >
        {!isPlaying ? (
          <button
            onClick={playAudio}
            disabled={disabled || isLoading}
            style={{
              padding: '1rem 2rem',
              fontSize: '1rem',
              borderRadius: '8px',
              border: '2px solid var(--wine)',
              background: 'var(--wine)',
              color: 'var(--bone)',
              fontWeight: '600',
              cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
              transition: 'all .2s ease',
              opacity: disabled || isLoading ? 0.5 : 1,
            }}
            onMouseEnter={(e) => {
              if (!disabled) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(107,31,46,.9)';
            }}
            onMouseLeave={(e) => {
              if (!disabled) (e.currentTarget as HTMLButtonElement).style.background = 'var(--wine)';
            }}
          >
            {isLoading
              ? getString('assessListening.generating', uiLanguage)
              : `${getString('assessListening.play', uiLanguage)} (${playCount > 0 ? `${playCount} ${getString('assessListening.replays', uiLanguage)}` : getString('assessListening.listen', uiLanguage)})`}
          </button>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
            <div style={{ fontSize: '1.5rem', color: 'var(--wine)', fontWeight: 'bold' }}>
              {getString('assessListening.playing', uiLanguage)}
            </div>
            <button
              onClick={stopAudio}
              style={{
                padding: '0.75rem 1.5rem',
                fontSize: '0.95rem',
                borderRadius: '8px',
                border: 'none',
                background: '#d32f2f',
                color: 'white',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              {getString('assessListening.stop', uiLanguage)}
            </button>
          </div>
        )}

        {error && <p style={{ color: '#d32f2f', marginTop: '1rem', fontSize: '.9rem' }}>{error}</p>}
      </div>

      <div>
        <p style={{ color: 'var(--muted)', marginBottom: '1rem', fontSize: '0.9rem' }}>
          {getString('assessListening.selectAnswer', uiLanguage)}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {question.options.map((option) => (
            <label
              key={option}
              style={{
                padding: '1rem',
                border: `2px solid ${selected === option ? 'var(--gold)' : 'var(--line)'}`,
                borderRadius: '8px',
                backgroundColor: selected === option ? 'rgba(184,147,90,.1)' : 'transparent',
                cursor: disabled ? 'not-allowed' : 'pointer',
                transition: 'all .2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                opacity: disabled ? 0.7 : 1,
              }}
              onMouseEnter={(e) => {
                if (!disabled && selected !== option) {
                  (e.currentTarget as HTMLLabelElement).style.borderColor = 'var(--wine)';
                }
              }}
              onMouseLeave={(e) => {
                if (!disabled && selected !== option) {
                  (e.currentTarget as HTMLLabelElement).style.borderColor = 'var(--line)';
                }
              }}
            >
              <input
                type="radio"
                name="answer"
                value={option}
                checked={selected === option}
                onChange={() => onSelect(option)}
                disabled={disabled}
                style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
              />
              <span style={{ color: 'var(--charcoal)', flex: 1, textAlign: 'left' }}>{option}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
