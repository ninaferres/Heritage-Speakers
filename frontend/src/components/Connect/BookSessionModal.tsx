import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { bookConnectSession, fetchConnectCredits, ConnectMatch, ConnectLanguage } from '../../api/client';
import { dayKeyOf, upcomingDates, zonedTimeToUtcIso, formatInZone, detectTimezone } from '../../utils/connectSchedule';

const DURATIONS = [10, 20, 30] as const;
const CREDITS_FOR: Record<number, number> = { 10: 1, 20: 2, 30: 3 };

function formatHour(hour: number): string {
  return `${String(hour).padStart(2, '0')}:00`;
}

export function BookSessionModal({
  match,
  language,
  onClose,
  onBooked,
}: {
  match: ConnectMatch;
  language: ConnectLanguage;
  onClose: () => void;
  onBooked: () => void;
}) {
  const { uiLanguage } = useLanguage();
  const locale = uiLanguage === 'es' ? 'es-ES' : 'en-US';
  const nativeTz = match.timezone || 'UTC';
  const myTz = useMemo(() => detectTimezone(), []);

  // Only offer dates within the next 14 days that this person has actually marked available.
  const dates = useMemo(() => upcomingDates(14).filter((d) => match.availability[dayKeyOf(d)].length > 0), [match]);
  const [selectedDate, setSelectedDate] = useState<string | null>(dates[0] ?? null);
  const availableHours = selectedDate ? [...match.availability[dayKeyOf(selectedDate)]].sort((a, b) => a - b) : [];
  const [selectedHour, setSelectedHour] = useState<number | null>(availableHours[0] ?? null);
  const [duration, setDuration] = useState<10 | 20 | 30>(10);

  const [credits, setCredits] = useState<number | null>(null);
  useEffect(() => {
    fetchConnectCredits().then(setCredits).catch(() => {});
  }, []);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function handleDateChange(date: string) {
    setSelectedDate(date);
    const hours = [...match.availability[dayKeyOf(date)]].sort((a, b) => a - b);
    setSelectedHour(hours[0] ?? null);
  }

  const creditsNeeded = CREDITS_FOR[duration];
  const notEnoughCredits = credits !== null && credits < creditsNeeded;
  const scheduledAtIso = selectedDate && selectedHour !== null ? zonedTimeToUtcIso(selectedDate, selectedHour, nativeTz) : null;

  async function handleConfirm() {
    if (!scheduledAtIso) return;
    setSubmitting(true);
    setError(null);
    try {
      await bookConnectSession({ nativeSpeakerId: match.userId, language, scheduledAt: scheduledAtIso, durationMinutes: duration });
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : (uiLanguage === 'es' ? 'No se pudo reservar la sesión.' : 'Could not book the session.'));
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="modal-card" role="dialog" aria-modal="true">
          <button className="modal-close" aria-label="Close" onClick={onClose}>✕</button>
          <h3>{uiLanguage === 'es' ? '¡Sesión reservada!' : 'Session booked!'}</h3>
          <p className="modal-copy">
            {scheduledAtIso && (uiLanguage === 'es' ? `Quedáis el ${formatInZone(scheduledAtIso, myTz, locale)} (tu hora).` : `You're set for ${formatInZone(scheduledAtIso, myTz, locale)} (your time).`)}
          </p>
          <button
            className="btn btn-gold"
            style={{ width: '100%' }}
            onClick={() => {
              onBooked();
              onClose();
            }}
          >
            {uiLanguage === 'es' ? 'Vale' : 'OK'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-card" role="dialog" aria-modal="true">
        <button className="modal-close" aria-label="Close" onClick={onClose}>✕</button>
        <h3>{uiLanguage === 'es' ? 'Reservar sesión' : 'Book a session'}</h3>

        <label className="field-label">{uiLanguage === 'es' ? 'Duración' : 'Duration'}</label>
        <div style={{ display: 'flex', gap: '.6rem', marginBottom: '1.2rem' }}>
          {DURATIONS.map((d) => (
            <button
              key={d}
              onClick={() => setDuration(d)}
              className={duration === d ? 'btn btn-wine btn-small' : 'btn btn-ghost btn-small'}
              style={{ flex: 1 }}
            >
              {d} min · {CREDITS_FOR[d]} {uiLanguage === 'es' ? (CREDITS_FOR[d] === 1 ? 'crédito' : 'créditos') : (CREDITS_FOR[d] === 1 ? 'credit' : 'credits')}
            </button>
          ))}
        </div>

        {dates.length === 0 ? (
          <p style={{ color: 'var(--muted)', fontSize: '.9rem', marginBottom: '1rem' }}>
            {uiLanguage === 'es' ? 'Esta persona no tiene disponibilidad marcada en los próximos 14 días.' : "This person hasn't marked any availability in the next 14 days."}
          </p>
        ) : (
          <>
            <label className="field-label" htmlFor="book-date">{uiLanguage === 'es' ? 'Fecha' : 'Date'}</label>
            <select id="book-date" className="field-input" value={selectedDate ?? ''} onChange={(e) => handleDateChange(e.target.value)}>
              {dates.map((d) => (
                <option key={d} value={d}>
                  {new Intl.DateTimeFormat(locale, { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date(`${d}T12:00:00Z`))}
                </option>
              ))}
            </select>

            <label className="field-label">{uiLanguage === 'es' ? 'Hora' : 'Time'}</label>
            <div style={{ display: 'flex', gap: '.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              {availableHours.map((hour) => (
                <button
                  key={hour}
                  onClick={() => setSelectedHour(hour)}
                  className={selectedHour === hour ? 'btn btn-wine btn-small' : 'btn btn-ghost btn-small'}
                >
                  {formatHour(hour)}
                </button>
              ))}
            </div>

            {scheduledAtIso && (
              <p style={{ color: 'var(--muted)', fontSize: '.85rem', marginBottom: '1.2rem' }}>
                {uiLanguage === 'es'
                  ? `${formatInZone(scheduledAtIso, nativeTz, locale)} (su hora) · ${formatInZone(scheduledAtIso, myTz, locale)} (tu hora)`
                  : `${formatInZone(scheduledAtIso, nativeTz, locale)} (their time) · ${formatInZone(scheduledAtIso, myTz, locale)} (your time)`}
              </p>
            )}
          </>
        )}

        {notEnoughCredits && (
          <div className="modal-error">
            {uiLanguage === 'es' ? `No tienes suficientes créditos (tienes ${credits}, necesitas ${creditsNeeded}).` : `Not enough credits (you have ${credits}, need ${creditsNeeded}).`}
          </div>
        )}
        {error && <div className="modal-error">{error}</div>}

        <button className="btn btn-gold" style={{ width: '100%' }} disabled={!scheduledAtIso || submitting || notEnoughCredits} onClick={handleConfirm}>
          {submitting
            ? (uiLanguage === 'es' ? 'Reservando…' : 'Booking…')
            : (uiLanguage === 'es' ? `Confirmar (-${creditsNeeded})` : `Confirm (-${creditsNeeded})`)}
        </button>
      </div>
    </div>
  );
}
