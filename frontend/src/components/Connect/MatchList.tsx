import { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { fetchConnectMatches, ConnectMatch, ConnectAvailabilityBlock } from '../../api/client';
import { BookSessionModal } from './BookSessionModal';

const BLOCK_LABEL: Record<ConnectAvailabilityBlock, { es: string; en: string }> = {
  morning: { es: 'mañana', en: 'morning' },
  afternoon: { es: 'tarde', en: 'afternoon' },
  evening: { es: 'noche', en: 'evening' },
};

function describeAvailability(match: ConnectMatch, uiLanguage: 'en' | 'es'): string {
  const weekday = match.availability.weekday.map((b) => BLOCK_LABEL[b][uiLanguage]).join(', ');
  const weekend = match.availability.weekend.map((b) => BLOCK_LABEL[b][uiLanguage]).join(', ');
  const parts: string[] = [];
  if (weekday) parts.push(`${uiLanguage === 'es' ? 'entre semana' : 'weekdays'}: ${weekday}`);
  if (weekend) parts.push(`${uiLanguage === 'es' ? 'fin de semana' : 'weekends'}: ${weekend}`);
  if (parts.length === 0) return uiLanguage === 'es' ? 'Sin disponibilidad indicada' : 'No availability set yet';
  return parts.join(' · ');
}

export function MatchList({ learningLanguages }: { learningLanguages: ('es' | 'ru')[] }) {
  const { uiLanguage } = useLanguage();
  const [language, setLanguage] = useState<'es' | 'ru' | null>(learningLanguages[0] ?? null);
  const [matches, setMatches] = useState<ConnectMatch[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState<ConnectMatch | null>(null);
  const [justBookedId, setJustBookedId] = useState<string | null>(null);

  useEffect(() => {
    if (!language) return;
    setMatches(null);
    setError(null);
    fetchConnectMatches(language)
      .then(setMatches)
      .catch((e) => setError(e instanceof Error ? e.message : (uiLanguage === 'es' ? 'No se pudo cargar la lista.' : 'Could not load the list.')));
  }, [language, uiLanguage]);

  if (learningLanguages.length === 0) {
    return (
      <p style={{ color: 'var(--muted)' }}>
        {uiLanguage === 'es'
          ? 'Primero elige en tu perfil qué idioma quieres practicar.'
          : 'First pick which language you want to practice, in your profile tab.'}
      </p>
    );
  }

  return (
    <div>
      {learningLanguages.length > 1 && (
        <div style={{ display: 'flex', gap: '.6rem', marginBottom: '1.2rem' }}>
          {learningLanguages.map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={language === lang ? 'btn btn-wine btn-small' : 'btn btn-ghost btn-small'}
            >
              {lang === 'es' ? 'Español' : 'Ruso'}
            </button>
          ))}
        </div>
      )}

      {error && <div className="modal-error">{error}</div>}

      {matches === null && !error ? (
        <p style={{ color: 'var(--muted)' }}>{uiLanguage === 'es' ? 'Buscando…' : 'Searching…'}</p>
      ) : matches && matches.length === 0 ? (
        <p style={{ color: 'var(--muted)' }}>
          {uiLanguage === 'es'
            ? 'Todavía no hay nadie disponible para este idioma. Vuelve a comprobarlo pronto.'
            : "No one's available for this language yet. Check back soon."}
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.8rem' }}>
          {matches?.map((m) => (
            <div key={m.userId} className="exercise-block" style={{ borderLeftColor: 'var(--wine)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '.4rem' }}>
                <strong style={{ color: 'var(--wine-ink)' }}>
                  {m.reliabilityPct === null
                    ? (uiLanguage === 'es' ? 'Nuevo/a en Connect' : 'New to Connect')
                    : `${m.reliabilityPct}% ${uiLanguage === 'es' ? 'de asistencia' : 'attendance'}`}
                </strong>
              </div>
              {m.bio && <p style={{ margin: '0 0 .5rem', color: 'var(--charcoal)' }}>{m.bio}</p>}
              <p style={{ margin: '0 0 .8rem', color: 'var(--muted)', fontSize: '.85rem' }}>
                {describeAvailability(m, uiLanguage)} {m.timezone ? `(${m.timezone})` : ''}
              </p>
              <button
                className="btn btn-gold btn-small"
                onClick={() => setBooking(m)}
                disabled={justBookedId === m.userId}
              >
                {justBookedId === m.userId
                  ? (uiLanguage === 'es' ? 'Reservado' : 'Booked')
                  : (uiLanguage === 'es' ? 'Reservar' : 'Book')}
              </button>
            </div>
          ))}
        </div>
      )}

      {booking && language && (
        <BookSessionModal
          match={booking}
          language={language}
          onClose={() => setBooking(null)}
          onBooked={() => setJustBookedId(booking.userId)}
        />
      )}
    </div>
  );
}
