import { useRef, useState } from 'react';
import { SpeakingExercise, CefrLevel } from '../../data/types';
import { evaluateSpeaking } from '../../api/client';
import { ProductionEvaluation } from '../../data/feedback';
import { ProductionFeedback } from './FeedbackPanel';

export function SpeakingRunner({ exercise, level }: { exercise: SpeakingExercise; level: CefrLevel }) {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [micError, setMicError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ProductionEvaluation | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  async function startRecording() {
    setMicError(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setMicError('Your browser does not support microphone recording.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setRecording(true);
    } catch {
      setMicError('Microphone access was denied. Please allow microphone access to record your answer.');
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  }

  async function submit() {
    if (!audioBlob) return;
    setLoading(true);
    setError(null);
    try {
      const res = await evaluateSpeaking({ level, prompt: exercise.prompt, audioBlob });
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong evaluating your recording.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="exercise-block">
        <h4>Prompt</h4>
        <p>{exercise.prompt}</p>
        <p style={{ marginTop: '.6rem', color: 'var(--muted)', fontSize: '.9rem' }}>Suggested length: {exercise.suggestedDuration}</p>
      </div>

      {micError && <div className="error-box" style={{ marginBottom: '1rem' }}>{micError}</div>}

      {!result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
          <button className={`record-btn ${recording ? 'recording' : ''}`} onClick={recording ? stopRecording : startRecording}>
            {recording ? '⏺ Stop recording' : '🎤 Start recording'}
          </button>
          {audioUrl && !recording && (
            <audio controls src={audioUrl} style={{ width: '100%' }} />
          )}
        </div>
      )}

      {error && <div className="error-box" style={{ marginTop: '1rem' }}>{error}</div>}

      {!result && audioBlob && !recording && (
        <button className="btn btn-wine" style={{ marginTop: '1rem' }} disabled={loading} onClick={submit}>
          {loading ? 'Evaluating…' : 'Submit recording for evaluation'}
        </button>
      )}

      {loading && (
        <div className="loading-inline">
          <span className="spinner" /> Transcribing and analyzing pronunciation, grammar and vocabulary…
        </div>
      )}

      {result && <ProductionFeedback result={result} />}
    </div>
  );
}
