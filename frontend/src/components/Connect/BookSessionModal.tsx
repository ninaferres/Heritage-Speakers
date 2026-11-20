import { useMemo, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { bookConnectSession, ConnectMatch, ConnectAvailabilityBlock } from '../../api/client';
import { BLOCK_HOUR, dayTypeOf, upcomingDates, zonedTimeToUtcIso, formatInZone, detectTimezone } from '../../utils/connectSchedule';

const BLOCK_LABEL: Record<ConnectAvailabilityBlock, { es: string; en: string }> = {
  morning: { es: 'Mañana', en: 'Morning' },
  afternoon: { es: 'Tarde', en: 'Afternoon' },
  evening: { es: 'Noche', en: 'Evening' },
};

export function BookSessionModal({
  match,
  language,
  onClose,
  onBooked,
}: {
  match: ConnectMatch;
  language: 'es' | 'ru';
  onClose: () => void;
  onBooked: () => void;
}) {
  const { uiLanguage } = useLanguage();
  const locale = uiLanguage === 'es' ? 'es-ES' : 'en-US';
  const nativeTz = match.timezone || 'UTC';
  const myTz = useMemo(() => detectTimezone(), []);

  const dates = useMemo(() => upcomingDates(14), []);
  const [selectedDate, setSelectedDate] = useState(dates[0]);
  const dayType = dayTypeOf(selectedDate);
  const availableBlocks = match.availability[dayType];

  const [selectedBlock, setSelectedBlock] = useState<ConnectAvailabilityBlock | null>(availableBlocks[0] ?? null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function handleDateChange(date: string) {
    setSelectedDate(date);
    const blocks = match.availability[dayTypeOf(date)];
    setSelectedBlock(blocks[0] ?? null);
  }

  const scheduledAtIso = selectedBlock ? zonedTimeToUtcIso(selectedDate, BLOCK_HOUR[selectedBlock], nativeTz) : null;

  async function handleConfirm() {
    if (!scheduledAtIso) return;
    setSubmitting(true);
    setError(null);
    try {
      await bookConnectSession({ nativeSpeakerId: match.userId, language, scheduledAt: scheduledAtIso });
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
        <p className="modal-copy">
          {uiLanguage === 'es' ? 'Esto gastará 1 de tus créditos.' : 'This will spend 1 of your credits.'}
        </p>

        <label className="field-label" htmlFor="book-date">{uiLanguage === 'es' ? 'Fecha' : 'Date'}</label>
        <select id="book-date" className="field-input" value={selectedDate} onChange={(e) => handleDateChange(e.target.value)}>
          {dates.map((d) => (
            <option key={d} value={d}>
              {new Intl.DateTimeFormat(locale, { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date(`${d}T12:00:00Z`))}
            </option>
          ))}
        </select>

        <label className="field-label">{uiLanguage === 'es' ? 'Franja horaria' : 'Time block'}</label>
        {availableBlocks.length === 0 ? (
          <p style={{ color: 'var(--muted)', fontSize: '.88rem', marginBottom: '1rem' }}>
            {uiLanguage === 'es' ? 'Esta persona no tiene disponibilidad ese día. Prueba otra fecha.' : "This person isn't available that day. Try another date."}
          </p>
        ) : (
          <div style={{ display: 'flex', gap: '.6rem', marginBottom: '1rem' }}>
            {availableBlocks.map((block) => (
              <button
                key={block}
                onClick={() => setSelectedBlock(block)}
                className={selectedBlock === block ? 'btn btn-wine btn-small' : 'btn btn-ghost btn-small'}
              >
                {BLOCK_LABEL[block][uiLanguage]}
              </button>
            ))}
          </div>
        )}

        {scheduledAtIso && (
          <p style={{ color: 'var(--muted)', fontSize: '.85rem', marginBottom: '1.2rem' }}>
            {uiLanguage === 'es'
              ? `${formatInZone(scheduledAtIso, nativeTz, locale)} (su hora) · ${formatInZone(scheduledAtIso, myTz, locale)} (tu hora)`
              : `${formatInZone(scheduledAtIso, nativeTz, locale)} (their time) · ${formatInZone(scheduledAtIso, myTz, locale)} (your time)`}
          </p>
        )}

        {error && <div className="modal-error">{error}</div>}

        <button className="btn btn-gold" style={{ width: '100%' }} disabled={!scheduledAtIso || submitting} onClick={handleConfirm}>
          {submitting ? (uiLanguage === 'es' ? 'Reservando…' : 'Booking…') : (uiLanguage === 'es' ? 'Confirmar reserva' : 'Confirm booking')}
        </button>
      </div>
    </div>
  );
}
