import { useRef, useState } from 'react';
import { ListeningComprehensionContent } from '../../data/microLessonTypes';
import { synthesizeSpeechTTS } from '../../api/client';
import { AccentId } from '../../data/types';

export function ListeningComprehensionStep({
  content,
  uiLanguage,
  learningLanguage,
  onComplete,
}: {
  content: ListeningComprehensionContent;
  uiLanguage: 'en' | 'es';
  learningLanguage: string | null;
  onComplete: (correct: boolean) => void;
}) {
  const [answers, setAnswers] = useState<(string | null)[]>(content.questions.map(() => null));
  const [checked, setChecked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playError, setPlayError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const allAnswered = answers.every((a) => a !== null);
  const allCorrect = checked && content.questions.every((q, i) => answers[i] === q.answer);

  async function playAudio() {
    const accent: AccentId = learningLanguage === 'ru' ? 'ru-RU' : 'es-ES';
    setIsPlaying(true);
    setPlayError(null);
    try {
      const blob = await synthesizeSpeechTTS({ text: content.transcript, accent });
      const url = URL.createObjectURL(blob);
      if (!audioRef.current) audioRef.current = new Audio();
      audioRef.current.src = url;
      audioRef.current.onended = () => setIsPlaying(false);
      audioRef.current.onerror = () => setIsPlaying(false);
      await audioRef.current.play();
    } catch (e) {
      setPlayError(e instanceof Error ? e.message : (uiLanguage === 'es' ? 'No se pudo reproducir el audio.' : 'Could not play the audio.'));
      setIsPlaying(false);
    }
  }

  function select(qIdx: number, option: string) {
    if (checked) return;
    setAnswers((prev) => prev.map((a, i) => (i === qIdx ? option : a)));
  }

  return (
    <div className="exercise-question">
      <div className="exercise-block" style={{ borderLeftColor: 'var(--wine)' }}>
        <h4>{uiLanguage === 'es' ? 'Audio' : 'Audio'}</h4>
        <button className="btn btn-gold btn-small" onClick={playAudio} disabled={isPlaying}>
          {isPlaying ? (uiLanguage === 'es' ? 'Reproduciendo…' : 'Playing…') : (uiLanguage === 'es' ? 'Escuchar' : 'Listen')}
        </button>
        {playError && <p style={{ color: '#b3261e', marginTop: '.6rem', marginBottom: 0 }}>{playError}</p>}
        {checked && (
          <p style={{ marginTop: '1rem', color: 'var(--muted)', lineHeight: 1.7 }}>{content.transcript}</p>
        )}
      </div>

      {content.questions.map((q, qIdx) => (
        <div key={qIdx} style={{ marginTop: '1.2rem' }}>
          <p style={{ fontWeight: 600, marginBottom: '.6rem' }}>{q.question}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
            {q.options.map((option) => {
              const isCorrect = option === q.answer;
              const isSelected = option === answers[qIdx];
              let borderColor = 'var(--line)';
              let background = 'transparent';
              if (checked) {
                if (isCorrect) {
                  borderColor = '#2e7d32';
                  background = 'rgba(46,125,50,.08)';
                } else if (isSelected) {
                  borderColor = '#b3261e';
                  background = 'rgba(179,38,30,.08)';
                }
              } else if (isSelected) {
                borderColor = 'var(--gold)';
                background = 'rgba(184,147,90,.1)';
              }
              return (
                <button
                  key={option}
                  onClick={() => select(qIdx, option)}
                  disabled={checked}
                  style={{
                    textAlign: 'left',
                    padding: '.75rem 1rem',
                    borderRadius: '10px',
                    border: `1.5px solid ${borderColor}`,
                    background,
                    cursor: checked ? 'default' : 'pointer',
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: '.95rem',
                    color: 'var(--ink)',
                  }}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {!checked ? (
        <button className="btn btn-gold" style={{ marginTop: '1.4rem' }} disabled={!allAnswered} onClick={() => setChecked(true)}>
          {uiLanguage === 'es' ? 'Comprobar respuestas' : 'Check answers'}
        </button>
      ) : (
        <button className="btn btn-wine" style={{ marginTop: '1.4rem' }} onClick={() => onComplete(allCorrect)}>
          {uiLanguage === 'es' ? 'Continuar' : 'Continue'}
        </button>
      )}
    </div>
  );
}
