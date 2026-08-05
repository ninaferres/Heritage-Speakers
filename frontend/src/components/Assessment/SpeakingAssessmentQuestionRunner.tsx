import { useState, useRef, useEffect } from 'react';
import { SpeakingAssessmentQuestion } from '../../data/types';

interface Props {
  question: SpeakingAssessmentQuestion;
  onAnswered: (audioBlob: Blob) => void;
  disabled: boolean;
}

export function SpeakingAssessmentQuestionRunner({ question, onAnswered, disabled }: Props) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasRecording, setHasRecording] = useState(false);
  const [playbackUrl, setPlaybackUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (playbackUrl) URL.revokeObjectURL(playbackUrl);
    };
  }, [playbackUrl]);

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorder.onstart = () => {
        setIsRecording(true);
        setRecordingTime(0);
        timerIntervalRef.current = setInterval(() => {
          setRecordingTime((prev) => {
            if (prev >= question.maxDuration) {
              mediaRecorder.stop();
              return prev;
            }
            return prev + 1;
          });
        }, 1000);
      };

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        setIsRecording(false);
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setPlaybackUrl(url);
        setHasRecording(true);
        onAnswered(audioBlob);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
    } catch (err) {
      console.error('Microphone access denied:', err);
      alert('Please allow microphone access to record your response');
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
  }

  function togglePlayback() {
    if (!audioElementRef.current) return;

    if (isPlaying) {
      audioElementRef.current.pause();
      setIsPlaying(false);
    } else {
      audioElementRef.current.play();
      setIsPlaying(true);
    }
  }

  function reRecord() {
    if (playbackUrl) URL.revokeObjectURL(playbackUrl);
    setPlaybackUrl(null);
    setHasRecording(false);
    setRecordingTime(0);
    audioChunksRef.current = [];
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h3 style={{ color: 'var(--wine-ink)', marginBottom: '0.5rem' }}>{question.question}</h3>
        <p style={{ color: 'var(--muted)', lineHeight: 1.6, fontSize: '0.95rem' }}>{question.prompt}</p>
      </div>

      <div
        style={{
          padding: '1.5rem',
          backgroundColor: 'rgba(107,31,46,.08)',
          borderRadius: '12px',
          textAlign: 'center',
        }}
      >
        {!isRecording && !hasRecording && (
          <button
            onClick={startRecording}
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
            🎙️ Start Recording
          </button>
        )}

        {isRecording && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--wine)' }}>
              {recordingTime}s / {question.maxDuration}s
            </div>
            <button
              onClick={stopRecording}
              style={{
                padding: '0.75rem 1.5rem',
                fontSize: '0.95rem',
                borderRadius: '8px',
                border: 'none',
                background: '#d32f2f',
                color: 'white',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all .2s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = '#b71c1c';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = '#d32f2f';
              }}
            >
              ⏹️ Stop Recording
            </button>
          </div>
        )}

        {hasRecording && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
            <p style={{ color: 'var(--muted)', margin: 0 }}>Recording saved</p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={togglePlayback}
                style={{
                  padding: '0.75rem 1.5rem',
                  fontSize: '0.95rem',
                  borderRadius: '8px',
                  border: '2px solid var(--gold)',
                  background: 'transparent',
                  color: 'var(--gold)',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all .2s ease',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(184,147,90,.1)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                }}
              >
                {isPlaying ? '⏸️ Pause' : '▶️ Play'}
              </button>
              <button
                onClick={reRecord}
                style={{
                  padding: '0.75rem 1.5rem',
                  fontSize: '0.95rem',
                  borderRadius: '8px',
                  border: '2px solid var(--wine)',
                  background: 'transparent',
                  color: 'var(--wine)',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all .2s ease',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(107,31,46,.05)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                }}
              >
                🔄 Re-record
              </button>
            </div>
          </div>
        )}
      </div>

      {playbackUrl && (
        <audio
          ref={audioElementRef}
          src={playbackUrl}
          onEnded={() => setIsPlaying(false)}
          style={{ display: 'none' }}
        />
      )}
    </div>
  );
}
