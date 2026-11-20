import { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  fetchConnectProfile,
  saveConnectProfile,
  fetchConnectCredits,
  fetchConnectReferralCode,
  fetchLanguageVerifications,
  ConnectProfile,
  ConnectAvailability,
  ConnectDayKey,
  ConnectLanguageVerification,
  ConnectVerificationStatus,
} from '../../api/client';
import { detectTimezone, DAY_KEYS, DAY_LABEL } from '../../utils/connectSchedule';
import { VerifyLanguageModal } from './VerifyLanguageModal';
import { MatchList } from './MatchList';
import { MySessions } from './MySessions';

const LANGUAGE_LABEL: Record<'es' | 'ru', { es: string; en: string }> = {
  es: { es: 'Español', en: 'Spanish' },
  ru: { es: 'Ruso', en: 'Russian' },
};

const VERIFICATION_LABEL: Record<ConnectVerificationStatus, { es: string; en: string }> = {
  pending: { es: 'pendiente de revisión', en: 'pending review' },
  verified: { es: 'verificado', en: 'verified' },
  rejected: { es: 'no confirmado', en: 'not confirmed' },
  flagged_for_review: { es: 'en revisión', en: 'under review' },
};

const EMPTY_AVAILABILITY: ConnectAvailability = { mon: [], tue: [], wed: [], thu: [], fri: [], sat: [], sun: [] };
const HOURS = Array.from({ length: 24 }, (_, i) => i);

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

type Tab = 'profile' | 'find' | 'sessions';

export function ConnectPanel({ onClose }: { onClose: () => void }) {
  const { uiLanguage } = useLanguage();
  const [tab, setTab] = useState<Tab>('profile');

  const [profile, setProfile] = useState<ConnectProfile | null>(null);
  const [credits, setCredits] = useState<number | null>(null);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [verifications, setVerifications] = useState<ConnectLanguageVerification[]>([]);
  const [loading, setLoading] = useState(true);

  const [bio, setBio] = useState('');
  const [nativeLanguages, setNativeLanguages] = useState<('es' | 'ru')[]>([]);
  const [learningLanguages, setLearningLanguages] = useState<('es' | 'ru')[]>([]);
  const [availability, setAvailability] = useState<ConnectAvailability>(EMPTY_AVAILABILITY);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [verifyingLanguage, setVerifyingLanguage] = useState<'es' | 'ru' | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([fetchConnectProfile(), fetchConnectCredits(), fetchConnectReferralCode(), fetchLanguageVerifications()])
      .then(([p, c, code, v]) => {
        if (cancelled) return;
        setProfile(p);
        setCredits(c);
        setReferralCode(code);
        setVerifications(v);
        setBio(p.bio ?? '');
        setNativeLanguages(p.nativeLanguages);
        setLearningLanguages(p.learningLanguages);
        setAvailability(p.availability);
      })
      .catch(() => {
        // Connect is a supplementary section — the panel still shows a usable empty form below.
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function handleToggleNative(lang: 'es' | 'ru') {
    const next = toggle(nativeLanguages, lang);
    setNativeLanguages(next);
    const hasVerification = verifications.some((v) => v.language === lang);
    if (next.includes(lang) && !hasVerification) {
      setVerifyingLanguage(lang);
    }
  }

  function handleVerified(lang: 'es' | 'ru', status: ConnectVerificationStatus) {
    setVerifications((prev) => [...prev.filter((v) => v.language !== lang), { language: lang, status }]);
  }

  function toggleHour(day: ConnectDayKey, hour: number) {
    setAvailability((prev) => ({ ...prev, [day]: toggle(prev[day], hour) }));
  }

  async function handleSave() {
    setError(null);
    setSaving(true);
    try {
      const updated = await saveConnectProfile({
        bio,
        nativeLanguages,
        learningLanguages,
        timezone: profile?.timezone ?? detectTimezone(),
        availability,
      });
      setProfile(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    } catch (e) {
      setError(e instanceof Error ? e.message : (uiLanguage === 'es' ? 'No se pudo guardar.' : 'Could not save.'));
    } finally {
      setSaving(false);
    }
  }

  function copyReferralCode() {
    if (!referralCode) return;
    navigator.clipboard?.writeText(referralCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'var(--bone)', zIndex: 1000, overflow: 'auto' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '3rem 2rem', minHeight: '100vh' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.6rem' }}>
          <span className="eyebrow">Connect</span>
          <button
            onClick={onClose}
            aria-label={uiLanguage === 'es' ? 'Cerrar' : 'Close'}
            style={{ background: 'none', border: 'none', fontSize: '1.6rem', cursor: 'pointer', color: 'var(--wine)', fontWeight: 'bold', padding: '.3rem', lineHeight: 1 }}
          >
            ✕
          </button>
        </div>

        <h2 style={{ marginBottom: '.4rem', color: 'var(--wine-ink)' }}>
          {uiLanguage === 'es' ? 'Practica conversación con otra persona' : 'Practice conversation with someone else'}
        </h2>
        <p style={{ color: 'var(--muted)', marginBottom: '1.6rem' }}>
          {uiLanguage === 'es'
            ? 'Da una clase corta en tu idioma nativo y gana créditos. Gasta créditos para reservar una clase y practicar el idioma que estás aprendiendo. Todo gratis, sin dinero de por medio.'
            : "Give a short lesson in your native language and earn credits. Spend credits to book a lesson and practice the language you're learning. All free — no money involved."}
        </p>

        <div className="modal-tabs" role="tablist" style={{ marginBottom: '1.6rem' }}>
          <button type="button" role="tab" className={`modal-tab ${tab === 'profile' ? 'active' : ''}`} onClick={() => setTab('profile')}>
            {uiLanguage === 'es' ? 'Mi perfil' : 'My profile'}
          </button>
          <button type="button" role="tab" className={`modal-tab ${tab === 'find' ? 'active' : ''}`} onClick={() => setTab('find')}>
            {uiLanguage === 'es' ? 'Buscar' : 'Find a partner'}
          </button>
          <button type="button" role="tab" className={`modal-tab ${tab === 'sessions' ? 'active' : ''}`} onClick={() => setTab('sessions')}>
            {uiLanguage === 'es' ? 'Mis sesiones' : 'My sessions'}
          </button>
        </div>

        {loading ? (
          <p style={{ color: 'var(--muted)' }}>{uiLanguage === 'es' ? 'Cargando…' : 'Loading…'}</p>
        ) : tab === 'find' ? (
          <MatchList learningLanguages={learningLanguages} />
        ) : tab === 'sessions' ? (
          <MySessions />
        ) : (
          <>
            {/* Credits card — deliberately the most visually prominent thing on this tab */}
            <div
              style={{
                marginBottom: '1.8rem',
                padding: '1.5rem',
                borderRadius: '16px',
                border: '2px solid var(--gold)',
                background: 'rgba(184,147,90,.1)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.8rem' }}>
                <h4 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--wine-ink)' }}>
                  {uiLanguage === 'es' ? 'TUS CRÉDITOS' : 'YOUR CREDITS'}
                </h4>
                <span style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--wine-ink)', lineHeight: 1 }}>{credits ?? 0}</span>
              </div>
              <p style={{ margin: 0, color: 'var(--charcoal)', fontSize: '.88rem', lineHeight: 1.5 }}>
                {uiLanguage === 'es'
                  ? 'Ganas créditos dando clases en tu idioma nativo, según su duración, y los gastas al reservar una clase para practicar.'
                  : 'You earn credits by teaching your native language, based on duration, and spend them to book a lesson to practice.'}
              </p>
              <div style={{ marginTop: '.8rem', paddingTop: '.8rem', borderTop: '1px solid rgba(184,147,90,.35)', fontSize: '.85rem', color: 'var(--wine-ink)', fontWeight: 600 }}>
                10 min = 1 {uiLanguage === 'es' ? 'crédito' : 'credit'} · 20 min = 2 {uiLanguage === 'es' ? 'créditos' : 'credits'} · 30 min = 3{' '}
                {uiLanguage === 'es' ? 'créditos (máximo)' : 'credits (max)'}
              </div>
            </div>

            {/* Languages */}
            <div style={{ marginBottom: '1.8rem' }}>
              <h3 style={{ fontSize: '1rem', color: 'var(--wine-ink)', marginBottom: '.8rem' }}>
                {uiLanguage === 'es' ? 'Tus idiomas' : 'Your languages'}
              </h3>
              <p style={{ color: 'var(--muted)', fontSize: '.85rem', marginBottom: '.6rem' }}>
                {uiLanguage === 'es' ? 'Hablo nativamente' : 'I natively speak'}
              </p>
              <div style={{ display: 'flex', gap: '.6rem', marginBottom: '.5rem', flexWrap: 'wrap' }}>
                {(['es', 'ru'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleToggleNative(lang)}
                    className={nativeLanguages.includes(lang) ? 'btn btn-wine btn-small' : 'btn btn-ghost btn-small'}
                  >
                    {LANGUAGE_LABEL[lang][uiLanguage]}
                  </button>
                ))}
              </div>
              {nativeLanguages.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '.2rem', marginBottom: '1rem' }}>
                  {nativeLanguages.map((lang) => {
                    const v = verifications.find((x) => x.language === lang);
                    return (
                      <p key={lang} style={{ margin: 0, fontSize: '.82rem', color: 'var(--muted)' }}>
                        {LANGUAGE_LABEL[lang][uiLanguage]}:{' '}
                        {v ? (
                          VERIFICATION_LABEL[v.status][uiLanguage]
                        ) : (
                          <button type="button" className="btn-linklike" onClick={() => setVerifyingLanguage(lang)} style={{ background: 'none', border: 0, color: 'var(--wine)', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', font: 'inherit' }}>
                            {uiLanguage === 'es' ? 'verificar ahora' : 'verify now'}
                          </button>
                        )}
                        {v?.status === 'rejected' && (
                          <>
                            {' · '}
                            <button type="button" className="btn-linklike" onClick={() => setVerifyingLanguage(lang)} style={{ background: 'none', border: 0, color: 'var(--wine)', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', font: 'inherit' }}>
                              {uiLanguage === 'es' ? 'reintentar' : 'try again'}
                            </button>
                          </>
                        )}
                      </p>
                    );
                  })}
                </div>
              )}

              <p style={{ color: 'var(--muted)', fontSize: '.85rem', marginBottom: '.6rem' }}>
                {uiLanguage === 'es' ? 'Quiero practicar' : 'I want to practice'}
              </p>
              <div style={{ display: 'flex', gap: '.6rem' }}>
                {(['es', 'ru'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLearningLanguages((prev) => toggle(prev, lang))}
                    className={learningLanguages.includes(lang) ? 'btn btn-gold btn-small' : 'btn btn-ghost btn-small'}
                  >
                    {LANGUAGE_LABEL[lang][uiLanguage]}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div style={{ marginBottom: '1.8rem' }}>
              <h3 style={{ fontSize: '1rem', color: 'var(--wine-ink)', marginBottom: '.3rem' }}>
                {uiLanguage === 'es' ? 'Disponibilidad' : 'Availability'}
              </h3>
              <p style={{ color: 'var(--muted)', fontSize: '.82rem', marginBottom: '.4rem' }}>
                {uiLanguage === 'es' ? `Zona horaria detectada: ${profile?.timezone ?? detectTimezone()}` : `Detected timezone: ${profile?.timezone ?? detectTimezone()}`}
              </p>
              <p style={{ color: 'var(--muted)', fontSize: '.82rem', marginBottom: '1rem' }}>
                {uiLanguage === 'es' ? 'Toca las horas en las que puedes dar clase (mínimo 1 hora por franja).' : 'Tap the hours you can teach (1 hour minimum per slot).'}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
                {DAY_KEYS.map((day) => (
                  <div key={day}>
                    <p style={{ fontWeight: 600, color: 'var(--wine-ink)', fontSize: '.85rem', marginBottom: '.3rem' }}>
                      {DAY_LABEL[day][uiLanguage]}
                    </p>
                    <div style={{ display: 'flex', gap: '.3rem', overflowX: 'auto', paddingBottom: '.2rem' }}>
                      {HOURS.map((hour) => {
                        const active = availability[day].includes(hour);
                        return (
                          <button
                            key={hour}
                            onClick={() => toggleHour(day, hour)}
                            style={{
                              flexShrink: 0,
                              width: '2.4rem',
                              padding: '.4rem 0',
                              borderRadius: '8px',
                              border: `1.5px solid ${active ? 'var(--wine)' : 'var(--line)'}`,
                              background: active ? 'var(--wine)' : 'transparent',
                              color: active ? '#fff' : 'var(--wine-ink)',
                              fontWeight: 600,
                              fontSize: '.78rem',
                              cursor: 'pointer',
                            }}
                          >
                            {String(hour).padStart(2, '0')}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bio */}
            <div style={{ marginBottom: '1.8rem' }}>
              <label className="field-label" htmlFor="connect-bio">
                {uiLanguage === 'es' ? 'Sobre ti (opcional)' : 'About you (optional)'}
              </label>
              <textarea
                id="connect-bio"
                className="field-input"
                rows={3}
                maxLength={500}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                style={{ resize: 'vertical', fontFamily: 'inherit' }}
              />
            </div>

            {error && <div className="modal-error">{error}</div>}

            <button className="btn btn-gold" onClick={handleSave} disabled={saving} style={{ marginBottom: '2rem' }}>
              {saving
                ? (uiLanguage === 'es' ? 'Guardando…' : 'Saving…')
                : saved
                  ? (uiLanguage === 'es' ? '¡Guardado!' : 'Saved!')
                  : (uiLanguage === 'es' ? 'Guardar' : 'Save')}
            </button>

            {/* Referral */}
            <div className="exercise-block">
              <h4 style={{ marginBottom: '.4rem' }}>{uiLanguage === 'es' ? 'Invita a un amigo' : 'Invite a friend'}</h4>
              <p style={{ color: 'var(--muted)', fontSize: '.85rem', marginBottom: '.8rem' }}>
                {uiLanguage === 'es'
                  ? 'Cuando complete su primera sesión en Connect, ganas 1 crédito extra.'
                  : 'When they complete their first Connect session, you earn 1 extra credit.'}
              </p>
              <button className="btn btn-ghost btn-small" onClick={copyReferralCode}>
                {copied
                  ? (uiLanguage === 'es' ? '¡Copiado!' : 'Copied!')
                  : `${uiLanguage === 'es' ? 'Código' : 'Code'}: ${referralCode ?? '…'}`}
              </button>
            </div>
          </>
        )}
      </div>

      {verifyingLanguage && (
        <VerifyLanguageModal
          language={verifyingLanguage}
          onClose={() => setVerifyingLanguage(null)}
          onVerified={(status) => handleVerified(verifyingLanguage, status)}
        />
      )}
    </div>
  );
}
