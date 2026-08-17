import { useRef, useState } from 'react';
import { SpeakingPromptContent } from '../../data/microLessonTypes';
import { AccentId, CefrLevel } from '../../data/types';
import { evaluateSpeaking, synthesizeSpeechTTS } from '../../api/client';
import { ProductionEvaluation } from '../../data/feedback';
import { ProductionFeedback } from '../ExerciseRunner/FeedbackPanel';

// Daily-practice speaking prompts aren't tied to a CEFR level, so we grade against a
// forgiving baseline — the point is encouragement and concrete pointers, not a gate.
const PRACTICE_LEVEL: CefrLevel = 'A2';
const PASS_SCORE = 55;

export function SpeakingPracticeStep({
  content,
  uiLanguage,
  learningLanguage,
  onComplete,
}: {
  content: SpeakingPromptContent;
  uiLanguage: 'en' | 'es';
  learningLanguage: string | null;
  onComplete: (correct: boolean) => void;
}) {
  const accent: AccentId = learningLanguage === 'ru' ? 'ru-RU' : 'es-ES';
  const [showModel, setShowModel] = useState(false);
  const [playingWhich, setPlayingWhich] = useState<'prompt' | 'model' | null>(null);
  const [playError, setPlayError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [micError, setMicError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ProductionEvaluation | null>(null);

  async function play(which: 'prompt' | 'model', text: string) {
    setPlayError(null);
    setPlayingWhich(which);
    try {
      const blob = await synthesizeSpeechTTS({ text, accent });
      const url = URL.createObjectURL(blob);
      if (!audioRef.current) audioRef.current = new Audio();
      audioRef.current.src = url;
      audioRef.current.onended = () => setPlayingWhich(null);
      audioRef.current.onerror = () => setPlayingWhich(null);
      await audioRef.current.play();
    } catch (e) {
      setPlayError(e instanceof Error ? e.message : (uiLanguage === 'es' ? 'No se pudo reproducir el audio.' : 'Could not play the audio.'));
      setPlayingWhich(null);
    }
  }

  async function startRecording() {
    setMicError(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setMicError(uiLanguage === 'es' ? 'Tu navegador no soporta grabación de audio.' : 'Your browser does not support audio recording.');
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
      setMicError(uiLanguage === 'es' ? 'Se denegó el acceso al micrófono.' : 'Microphone access was denied.');
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  }

  function retake() {
    setAudioBlob(null);
    setAudioUrl(null);
  }

  async function submit() {
    if (!audioBlob) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await evaluateSpeaking({ level: PRACTICE_LEVEL, prompt: content.prompt, audioBlob, learningLanguage });
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : (uiLanguage === 'es' ? 'No se pudo evaluar la grabación.' : 'Could not evaluate the recording.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="exercise-question">
      <div className="exercise-block" style={{ borderLeftColor: 'var(--wine)' }}>
        <h4>{uiLanguage === 'es' ? 'Responde en voz alta' : 'Answer out loud'}</h4>
        <p style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '.3rem' }}>{content.prompt}</p>
        <p style={{ color: 'var(--muted)', margin: 0 }}>{content.promptTranslation}</p>
        <button className="btn btn-gold btn-small" style={{ marginTop: '1rem' }} onClick={() => play('prompt', content.prompt)} disabled={playingWhich !== null}>
          {playingWhich === 'prompt' ? (uiLanguage === 'es' ? 'Reproduciendo…' : 'Playing…') : (uiLanguage === 'es' ? 'Escuchar pregunta' : 'Listen to the question')}
        </button>
      </div>

      {!showModel ? (
        <button
          type="button"
          className="btn-linklike"
          onClick={() => setShowModel(true)}
          style={{ background: 'none', border: 0, color: 'var(--wine)', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', font: 'inherit', marginBottom: '1.2rem' }}
        >
          {uiLanguage === 'es' ? '¿No sabes qué decir? Escucha un ejemplo' : "Not sure what to say? Hear an example"}
        </button>
      ) : (
        <div className="exercise-block" style={{ borderLeftColor: 'var(--gold)', marginBottom: '1.2rem' }}>
          <h4>{uiLanguage === 'es' ? 'Respuesta modelo' : 'Model answer'}</h4>
          <p style={{ fontWeight: 600, marginBottom: '.3rem' }}>{content.modelAnswer}</p>
          <p style={{ color: 'var(--muted)', margin: 0 }}>{content.modelAnswerTranslation}</p>
          <button className="btn btn-gold btn-small" style={{ marginTop: '1rem' }} onClick={() => play('model', content.modelAnswer)} disabled={playingWhich !== null}>
            {playingWhich === 'model' ? (uiLanguage === 'es' ? 'Reproduciendo…' : 'Playing…') : (uiLanguage === 'es' ? 'Escuchar respuesta modelo' : 'Listen to the model answer')}
          </button>
        </div>
      )}

      {playError && <p style={{ color: '#b3261e' }}>{playError}</p>}
      {micError && <div className="error-box" style={{ marginBottom: '1rem' }}>{micError}</div>}

      {!result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button
            className={`record-btn ${recording ? 'recording' : ''}`}
            onClick={recording ? stopRecording : startRecording}
            style={{ padding: '1rem', fontSize: '1.05rem', fontWeight: 700 }}
          >
            {recording
              ? (uiLanguage === 'es' ? 'Detener grabación' : 'Stop recording')
              : (uiLanguage === 'es' ? 'Grabar tu respuesta' : 'Record your answer')}
          </button>

          {audioUrl && !recording && (
            <div style={{ background: 'rgba(107,31,46,.05)', padding: '1.1rem', borderRadius: '10px', borderLeft: '4px solid var(--wine)' }}>
              <p style={{ margin: '0 0 .7rem 0', fontSize: '.85rem', fontWeight: 700, color: 'var(--wine)', textTransform: 'uppercase' }}>
                {uiLanguage === 'es' ? 'Tu grabación' : 'Your recording'}
              </p>
              <audio controls src={audioUrl} style={{ width: '100%' }} />
            </div>
          )}
        </div>
      )}

      {error && <div className="error-box" style={{ marginTop: '1rem' }}>{error}</div>}

      {!result && audioBlob && !recording && (
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.4rem' }}>
          <button className="btn btn-wine" style={{ flex: 1 }} disabled={submitting} onClick={submit}>
            {submitting ? (uiLanguage === 'es' ? 'Evaluando…' : 'Evaluating…') : (uiLanguage === 'es' ? 'Enviar' : 'Submit')}
          </button>
          <button className="btn btn-outline" style={{ flex: 1 }} onClick={retake} disabled={submitting}>
            {uiLanguage === 'es' ? 'Regrabar' : 'Retake'}
          </button>
        </div>
      )}

      {result && (
        <>
          <ProductionFeedback result={result} />
          <button className="btn btn-wine" style={{ marginTop: '1.4rem' }} onClick={() => onComplete(result.score >= PASS_SCORE)}>
            {uiLanguage === 'es' ? 'Continuar' : 'Continue'}
          </button>
        </>
      )}
    </div>
  );
}
