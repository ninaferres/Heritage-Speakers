import { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { fetchMyConnectSessions, cancelConnectSession, ConnectSession } from '../../api/client';
import { detectTimezone, formatInZone } from '../../utils/connectSchedule';

export function MySessions() {
  const { uiLanguage } = useLanguage();
  const { user } = useAuth();
  const locale = uiLanguage === 'es' ? 'es-ES' : 'en-US';
  const myTz = detectTimezone();

  const [sessions, setSessions] = useState<ConnectSession[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  function refresh() {
    fetchMyConnectSessions()
      .then(setSessions)
      .catch((e) => setError(e instanceof Error ? e.message : (uiLanguage === 'es' ? 'No se pudieron cargar tus sesiones.' : 'Could not load your sessions.')));
  }

  useEffect(refresh, [uiLanguage]);

  async function handleCancel(id: string) {
    setCancellingId(id);
    try {
      await cancelConnectSession(id);
      refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : (uiLanguage === 'es' ? 'No se pudo cancelar.' : 'Could not cancel.'));
    } finally {
      setCancellingId(null);
    }
  }

  const STATUS_LABEL: Record<string, { es: string; en: string }> = {
    scheduled: { es: 'Programada', en: 'Scheduled' },
    completed: { es: 'Completada', en: 'Completed' },
    abandoned_early: { es: 'Abandonada pronto', en: 'Abandoned early' },
    no_show_learner: { es: 'El alumno no se presentó', en: "Learner didn't show" },
    no_show_native: { es: 'El nativo no se presentó', en: "Native speaker didn't show" },
    cancelled: { es: 'Cancelada', en: 'Cancelled' },
  };

  if (error) return <div className="modal-error">{error}</div>;
  if (sessions === null) return <p style={{ color: 'var(--muted)' }}>{uiLanguage === 'es' ? 'Cargando…' : 'Loading…'}</p>;
  if (sessions.length === 0) {
    return (
      <p style={{ color: 'var(--muted)' }}>
        {uiLanguage === 'es' ? 'Todavía no tienes ninguna sesión reservada.' : "You don't have any sessions booked yet."}
      </p>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '.8rem' }}>
      {sessions.map((s) => {
        const amLearner = s.learnerId === user?.id;
        return (
          <div key={s.id} className="exercise-block" style={{ borderLeftColor: amLearner ? 'var(--wine)' : 'var(--gold)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.4rem' }}>
              <strong style={{ color: 'var(--wine-ink)' }}>
                {amLearner
                  ? (uiLanguage === 'es' ? 'Como alumno/a' : 'As learner')
                  : (uiLanguage === 'es' ? 'Como nativo/a' : 'As native speaker')}
              </strong>
              <span style={{ fontSize: '.8rem', color: 'var(--muted)' }}>{STATUS_LABEL[s.status]?.[uiLanguage] ?? s.status}</span>
            </div>
            <p style={{ margin: '0 0 .6rem' }}>{formatInZone(s.scheduledAt, myTz, locale)} ({uiLanguage === 'es' ? 'tu hora' : 'your time'})</p>
            {s.status === 'scheduled' && (
              <button className="btn btn-ghost btn-small" disabled={cancellingId === s.id} onClick={() => handleCancel(s.id)}>
                {cancellingId === s.id ? (uiLanguage === 'es' ? 'Cancelando…' : 'Cancelling…') : (uiLanguage === 'es' ? 'Cancelar' : 'Cancel')}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
