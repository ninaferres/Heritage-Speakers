import { useState, useEffect } from 'react';
import { ListeningAssessmentQuestion } from '../../data/types';

interface Props {
  question: ListeningAssessmentQuestion;
  selected: string | null;
  onSelect: (option: string) => void;
  disabled: boolean;
}

export function ListeningAssessmentQuestionRunner({ question, selected, onSelect, disabled }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playCount, setPlayCount] = useState(0);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  function playAudio() {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(question.audioText);
    utterance.lang = 'es-ES';
    utterance.rate = 0.9;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => {
      setIsPlaying(false);
      setPlayCount((prev) => prev + 1);
    };

    window.speechSynthesis.speak(utterance);
  }

  function stopAudio() {
    window.speechSynthesis.cancel();
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
            disabled={disabled}
            style={{
              padding: '1rem 2rem',
              fontSize: '1rem',
              borderRadius: '8px',
              border: '2px solid var(--wine)',
              background: 'var(--wine)',
              color: 'var(--bone)',
              fontWeight: '600',
              cursor: disabled ? 'not-allowed' : 'pointer',
              transition: 'all .2s ease',
              opacity: disabled ? 0.5 : 1,
            }}
            onMouseEnter={(e) => {
              if (!disabled) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(107,31,46,.9)';
            }}
            onMouseLeave={(e) => {
              if (!disabled) (e.currentTarget as HTMLButtonElement).style.background = 'var(--wine)';
            }}
          >
            🔊 Play Audio ({playCount > 0 ? `${playCount} replays` : 'listen'})
          </button>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
            <div style={{ fontSize: '1.5rem', color: 'var(--wine)', fontWeight: 'bold' }}>
              🔊 Playing...
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
              Stop
            </button>
          </div>
        )}
      </div>

      <div>
        <p style={{ color: 'var(--muted)', marginBottom: '1rem', fontSize: '0.9rem' }}>
          Select the correct answer
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
