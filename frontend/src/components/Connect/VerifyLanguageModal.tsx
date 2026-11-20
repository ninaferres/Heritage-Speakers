import { useRef, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { submitLanguageVerification, ConnectVerificationStatus, ConnectLanguage } from '../../api/client';

const LANGUAGE_LABEL: Record<ConnectLanguage, { es: string; en: string }> = {
  es: { es: 'español', en: 'Spanish' },
  ru: { es: 'ruso', en: 'Russian' },
  en: { es: 'inglés', en: 'English' },
};

const PROMPT: Record<ConnectLanguage, string> = {
  es: 'Háblanos un poco de ti: de dónde eres, a qué te dedicas y qué es lo que más te gusta de tu idioma. También puedes simplemente leer esta frase en voz alta.',
  ru: 'Расскажите немного о себе: откуда вы, чем занимаетесь и что вам больше всего нравится в вашем языке. Также вы можете просто прочитать это предложение вслух.',
  en: "Tell us a bit about yourself: where you're from, what you do, and what you like most about your language. You can also just read this sentence out loud.",
};

/** Records a 15-20s clip and submits it for (mocked, for now) automatic native-language
 * identification — the first filter before a language can be listed as native, per the app's
 * "no heavy ID-document verification" approach. Mirrors the MediaRecorder pattern already used
 * in SpeakingPracticeStep. */
export function VerifyLanguageModal({
  language,
  onClose,
  onVerified,
}: {
  language: ConnectLanguage;
  onClose: () => void;
  onVerified: (status: ConnectVerificationStatus) => void;
}) {
  const { uiLanguage } = useLanguage();
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [micError, setMicError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ConnectVerificationStatus | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
      setElapsed(0);
      timerRef.current = setInterval(() => {
        setElapsed((prev) => {
          const next = prev + 1;
          if (next >= 20) stopRecording();
          return next;
        });
      }, 1000);
    } catch {
      setMicError(uiLanguage === 'es' ? 'Se denegó el acceso al micrófono.' : 'Microphone access was denied.');
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    setRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }

  function retake() {
    setAudioBlob(null);
    setAudioUrl(null);
    setError(null);
  }

  async function submit() {
    if (!audioBlob) return;
    setSubmitting(true);
    setError(null);
    try {
      const { status } = await submitLanguageVerification(language, audioBlob);
      setResult(status);
    } catch (e) {
      setError(e instanceof Error ? e.message : (uiLanguage === 'es' ? 'No se pudo enviar la grabación.' : 'Could not submit the recording.'));
    } finally {
      setSubmitting(false);
    }
  }

  function finish() {
    if (result) onVerified(result);
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-card" role="dialog" aria-modal="true">
        <button className="modal-close" aria-label="Close" onClick={onClose}>✕</button>

        <h3>
          {uiLanguage === 'es'
            ? `Confirma que hablas ${LANGUAGE_LABEL[language].es} nativamente`
            : `Confirm you're a native ${LANGUAGE_LABEL[language].en} speaker`}
        </h3>

        {!result ? (
          <>
            <p className="modal-copy">
              {uiLanguage === 'es'
                ? 'Graba un clip de 15 a 20 segundos. Es solo un primer filtro automático, no un examen.'
                : "Record a 15-20 second clip. It's just an automatic first filter, not a test."}
            </p>
            <div className="exercise-block" style={{ marginBottom: '1.2rem' }}>
              <p style={{ margin: 0 }}>{PROMPT[language]}</p>
            </div>

            {micError && <div className="modal-error">{micError}</div>}

            {!audioBlob && (
              <button
                className={`record-btn ${recording ? 'recording' : ''}`}
                style={{ width: '100%', padding: '1rem', fontSize: '1.05rem', fontWeight: 700 }}
                onClick={recording ? stopRecording : startRecording}
              >
                {recording
                  ? `${uiLanguage === 'es' ? 'Detener' : 'Stop'} (${elapsed}s)`
                  : (uiLanguage === 'es' ? 'Grabar' : 'Record')}
              </button>
            )}

            {audioUrl && !recording && (
              <div style={{ background: 'rgba(107,31,46,.05)', padding: '1.1rem', borderRadius: '10px', borderLeft: '4px solid var(--wine)', marginBottom: '1rem' }}>
                <audio controls src={audioUrl} style={{ width: '100%' }} />
              </div>
            )}

            {error && <div className="modal-error">{error}</div>}

            {audioBlob && !recording && (
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn btn-wine" style={{ flex: 1 }} disabled={submitting} onClick={submit}>
                  {submitting ? (uiLanguage === 'es' ? 'Enviando…' : 'Submitting…') : (uiLanguage === 'es' ? 'Enviar' : 'Submit')}
                </button>
                <button className="btn btn-outline" style={{ flex: 1 }} onClick={retake} disabled={submitting}>
                  {uiLanguage === 'es' ? 'Regrabar' : 'Retake'}
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <p className="modal-copy">
              {result === 'verified'
                ? (uiLanguage === 'es' ? '¡Listo! Ya puedes dar clases en este idioma.' : "All set! You can now teach this language.")
                : (uiLanguage === 'es'
                    ? 'No hemos podido confirmarlo con este clip. Puedes intentarlo de nuevo cuando quieras.'
                    : "We couldn't confirm it from this clip. You can try again any time.")}
            </p>
            <button className="btn btn-gold" style={{ width: '100%' }} onClick={finish}>
              {uiLanguage === 'es' ? 'Entendido' : 'Got it'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
