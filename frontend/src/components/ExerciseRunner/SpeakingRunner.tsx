import { useRef, useState } from 'react';
import { SpeakingExercise, CefrLevel } from '../../data/types';
import { evaluateSpeaking } from '../../api/client';
import { ProductionEvaluation } from '../../data/feedback';
import { ProductionFeedback } from './FeedbackPanel';
import { useLanguage } from '../../context/LanguageContext';
import { getString } from '../../i18n/strings';
import { AnalyzingMessages } from './AnalyzingMessages';

export function SpeakingRunner({ exercise, level }: { exercise: SpeakingExercise; level: CefrLevel }) {
  const { uiLanguage, learningLanguage } = useLanguage();
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [micError, setMicError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ProductionEvaluation | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showGuidance, setShowGuidance] = useState(true);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function startRecording() {
    setMicError(null);
    setRecordingTime(0);
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
        if (timerRef.current) clearInterval(timerRef.current);
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setRecording(true);
      setShowGuidance(false);

      timerRef.current = setInterval(() => {
        setRecordingTime((t) => t + 1);
      }, 1000);
    } catch {
      setMicError(getString('speaking.micDenied', uiLanguage));
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    setRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }

  async function submit() {
    if (!audioBlob) return;
    setLoading(true);
    setError(null);
    try {
      const res = await evaluateSpeaking({ level, prompt: exercise.prompt, audioBlob, learningLanguage });
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong evaluating your recording.');
    } finally {
      setLoading(false);
    }
  }

  function retake() {
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingTime(0);
    setShowGuidance(true);
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      <div className="exercise-block" style={{ background: 'linear-gradient(135deg, rgba(107,31,46,.05) 0%, rgba(184,147,90,.05) 100%)', borderLeftColor: 'var(--wine)' }}>
        <h4 style={{ color: 'var(--wine)' }}>{getString('speaking.header', uiLanguage)}</h4>
        <p style={{ fontSize: '1.05rem', fontWeight: '500', lineHeight: '1.8', marginBottom: '1rem' }}>{exercise.prompt}</p>
        <p style={{ marginTop: '1rem', color: 'var(--muted)', fontSize: '.9rem' }}>
          {getString('speaking.suggestedLength', uiLanguage)} {exercise.suggestedDuration}
        </p>
      </div>

      {showGuidance && !recording && !audioUrl && (
        <div style={{
          background: 'rgba(184,147,90,.08)',
          padding: '1.5rem',
          borderRadius: '10px',
          marginBottom: '1.5rem',
          borderLeft: '4px solid var(--gold)',
        }}>
          <p style={{ margin: '0 0 0.8rem 0', fontWeight: '600', color: 'var(--wine)' }}>{getString('speaking.tipsTitle', uiLanguage)}</p>
          <ul style={{ margin: '0', paddingLeft: '1.5rem', color: 'var(--ink)', fontSize: '.95rem', lineHeight: '1.8' }}>
            <li>{getString('speaking.tipsClear', uiLanguage)}</li>
            <li>{getString('speaking.tipsTime', uiLanguage)}</li>
            <li>{getString('speaking.tipsFocus', uiLanguage)}</li>
            <li>{getString('speaking.tipsPauses', uiLanguage)}</li>
          </ul>
        </div>
      )}

      {micError && <div className="error-box" style={{ marginBottom: '1rem' }}>{micError}</div>}

      {!result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              className={`record-btn ${recording ? 'recording' : ''}`}
              onClick={recording ? stopRecording : startRecording}
              style={{
                flex: 1,
                padding: '1rem',
                fontSize: '1.1rem',
                fontWeight: '700',
              }}
            >
              {recording ? `⏹️ ${getString('speaking.stopRecording', uiLanguage)} (${formatTime(recordingTime)})` : getString('speaking.startRecording', uiLanguage)}
            </button>
          </div>

          {audioUrl && !recording && (
            <div style={{
              background: 'rgba(107,31,46,.05)',
              padding: '1.2rem',
              borderRadius: '10px',
              borderLeft: '4px solid var(--wine)',
            }}>
              <p style={{ margin: '0 0 0.8rem 0', fontSize: '.9rem', fontWeight: '700', color: 'var(--wine)', textTransform: 'uppercase' }}>
                {getString('speaking.yourRecording', uiLanguage)} ({formatTime(recordingTime)})
              </p>
              <audio controls src={audioUrl} style={{ width: '100%', borderRadius: '6px' }} />
            </div>
          )}
        </div>
      )}

      {error && <div className="error-box" style={{ marginTop: '1rem' }}>{error}</div>}

      {!result && audioBlob && !recording && (
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <button className="btn btn-wine" style={{ flex: 1 }} disabled={loading} onClick={submit}>
            {loading ? getString('speaking.evaluating', uiLanguage) : getString('speaking.submit', uiLanguage)}
          </button>
          <button className="btn btn-outline" style={{ flex: 1 }} onClick={retake} disabled={loading}>
            {getString('speaking.retake', uiLanguage)}
          </button>
        </div>
      )}

      {loading && (
        <div className="loading-inline" style={{ marginTop: '1.5rem' }}>
          <span className="spinner" />
          <AnalyzingMessages
            messages={[
              getString('speaking.analyzing', uiLanguage),
              getString('loading.msg1', uiLanguage),
              getString('loading.msg2', uiLanguage),
              getString('loading.msg3', uiLanguage),
            ]}
          />
        </div>
      )}

      {result && <ProductionFeedback result={result} />}
    </div>
  );
}
