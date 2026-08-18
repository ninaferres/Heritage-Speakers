import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  fetchProfile,
  fetchMyLeagues,
  fetchLeaderboard,
  createLeague,
  joinLeague,
  ProfileData,
  League,
  LeaderboardEntry,
} from '../api/client';

const SKILL_LABEL: Record<string, { es: string; en: string }> = {
  listening: { es: 'Escucha', en: 'Listening' },
  reading: { es: 'Lectura', en: 'Reading' },
  grammar_syntax: { es: 'Gramática y sintaxis', en: 'Grammar & Syntax' },
  vocabulary: { es: 'Vocabulario', en: 'Vocabulary' },
  speaking: { es: 'Habla', en: 'Speaking' },
  writing: { es: 'Escritura', en: 'Writing' },
};

export function ProfilePanel({ onClose }: { onClose: () => void }) {
  const { uiLanguage } = useLanguage();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState(true);

  const [view, setView] = useState<'overview' | 'create' | 'join' | 'league'>('overview');
  const [activeLeague, setActiveLeague] = useState<League | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[] | null>(null);

  const [nameInput, setNameInput] = useState('');
  const [displayNameInput, setDisplayNameInput] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([fetchProfile(), fetchMyLeagues()])
      .then(([p, l]) => {
        if (!cancelled) {
          setProfile(p);
          setLeagues(l);
        }
      })
      .catch(() => {
        // Profile/leagues are supplementary — the modal still shows a friendly empty state below.
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function openLeague(league: League) {
    setActiveLeague(league);
    setView('league');
    setLeaderboard(null);
    fetchLeaderboard(league.id)
      .then(setLeaderboard)
      .catch(() => setLeaderboard([]));
  }

  async function handleCreate() {
    setFormError(null);
    if (!nameInput.trim() || !displayNameInput.trim()) return;
    setSubmitting(true);
    try {
      const league = await createLeague(nameInput.trim(), displayNameInput.trim());
      setLeagues((prev) => [...prev, league]);
      setNameInput('');
      openLeague(league);
    } catch (e) {
      setFormError(e instanceof Error ? e.message : (uiLanguage === 'es' ? 'No se pudo crear la liga.' : 'Could not create the league.'));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleJoin() {
    setFormError(null);
    if (!nameInput.trim() || !displayNameInput.trim()) return;
    setSubmitting(true);
    try {
      const league = await joinLeague(nameInput.trim(), displayNameInput.trim());
      setLeagues((prev) => (prev.some((l) => l.id === league.id) ? prev : [...prev, league]));
      setNameInput('');
      openLeague(league);
    } catch (e) {
      setFormError(e instanceof Error ? e.message : (uiLanguage === 'es' ? 'No se encontró esa liga.' : 'Could not find that league.'));
    } finally {
      setSubmitting(false);
    }
  }

  function copyCode(code: string) {
    navigator.clipboard?.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  }

  const level = profile?.level ?? 1;
  const totalPoints = profile?.totalPoints ?? 0;
  const pointsForCurrentLevel = profile?.pointsForCurrentLevel ?? 0;
  const pointsForNextLevel = profile?.pointsForNextLevel ?? null;
  const levelProgressPct = pointsForNextLevel
    ? Math.min(100, Math.round(((totalPoints - pointsForCurrentLevel) / (pointsForNextLevel - pointsForCurrentLevel)) * 100))
    : 100;

  const activeStreaks = profile ? Object.entries(profile.streaks).filter(([, s]) => s.current > 0) : [];

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'var(--bone)', zIndex: 1000, overflow: 'auto' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '3rem 2rem', minHeight: '100vh' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.6rem' }}>
          <span className="eyebrow">{uiLanguage === 'es' ? 'Tu perfil' : 'Your profile'}</span>
          <button
            onClick={onClose}
            aria-label={uiLanguage === 'es' ? 'Cerrar' : 'Close'}
            style={{ background: 'none', border: 'none', fontSize: '1.6rem', cursor: 'pointer', color: 'var(--wine)', fontWeight: 'bold', padding: '.3rem', lineHeight: 1 }}
          >
            ✕
          </button>
        </div>

        {loading ? (
          <p style={{ color: 'var(--muted)' }}>{uiLanguage === 'es' ? 'Cargando…' : 'Loading…'}</p>
        ) : (
          <>
            {/* Level card */}
            <div className="exercise-block" style={{ marginBottom: '1.6rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '.6rem' }}>
                <h2 style={{ margin: 0, color: 'var(--wine-ink)' }}>
                  {uiLanguage === 'es' ? `Nivel ${level}` : `Level ${level}`}
                </h2>
                <span style={{ color: 'var(--muted)', fontSize: '.9rem' }}>
                  {totalPoints} {uiLanguage === 'es' ? 'puntos' : 'points'}
                </span>
              </div>
              <div style={{ height: '10px', background: 'var(--line)', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${levelProgressPct}%`, background: 'var(--gold)', transition: 'width .4s ease' }} />
              </div>
              {pointsForNextLevel && (
                <p style={{ color: 'var(--muted)', fontSize: '.85rem', margin: '.5rem 0 0' }}>
                  {uiLanguage === 'es'
                    ? `${pointsForNextLevel - totalPoints} puntos para el nivel ${level + 1}`
                    : `${pointsForNextLevel - totalPoints} points to level ${level + 1}`}
                </p>
              )}
            </div>

            {/* Streaks */}
            {activeStreaks.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1rem', color: 'var(--wine-ink)', marginBottom: '.8rem' }}>
                  {uiLanguage === 'es' ? 'Rachas activas' : 'Active streaks'}
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.6rem' }}>
                  {activeStreaks.map(([skill, s]) => (
                    <span
                      key={skill}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '.35rem',
                        padding: '.4rem .8rem', borderRadius: '999px', border: '1px solid var(--line)',
                        background: 'var(--card)', fontSize: '.88rem', fontWeight: 600, color: 'var(--wine-ink)',
                      }}
                    >
                      🔥 {s.current} · {SKILL_LABEL[skill]?.[uiLanguage] ?? skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Leagues */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.9rem' }}>
                <h3 style={{ fontSize: '1rem', color: 'var(--wine-ink)', margin: 0 }}>
                  {uiLanguage === 'es' ? 'Ligas con amigos' : 'Friend leagues'}
                </h3>
                {view === 'overview' && (
                  <div style={{ display: 'flex', gap: '.5rem' }}>
                    <button className="btn btn-ghost btn-small" onClick={() => { setView('join'); setFormError(null); }}>
                      {uiLanguage === 'es' ? 'Unirme' : 'Join'}
                    </button>
                    <button className="btn btn-gold btn-small" onClick={() => { setView('create'); setFormError(null); }}>
                      {uiLanguage === 'es' ? 'Crear liga' : 'Create league'}
                    </button>
                  </div>
                )}
              </div>

              {view === 'overview' && (
                leagues.length === 0 ? (
                  <p style={{ color: 'var(--muted)', fontSize: '.92rem' }}>
                    {uiLanguage === 'es'
                      ? 'Todavía no estás en ninguna liga. Crea una y comparte el código con tus amigos, o únete con un código que te hayan pasado.'
                      : "You're not in any league yet. Create one and share the code with friends, or join one with a code someone gave you."}
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
                    {leagues.map((l) => (
                      <button
                        key={l.id}
                        onClick={() => openLeague(l)}
                        className="exercise-block"
                        style={{ textAlign: 'left', cursor: 'pointer', border: '1px solid var(--line)', background: 'var(--card)' }}
                      >
                        <strong style={{ color: 'var(--wine-ink)' }}>{l.name}</strong>
                        <span style={{ display: 'block', color: 'var(--muted)', fontSize: '.85rem', marginTop: '.2rem' }}>
                          {uiLanguage === 'es' ? 'Código' : 'Code'}: {l.code}
                        </span>
                      </button>
                    ))}
                  </div>
                )
              )}

              {(view === 'create' || view === 'join') && (
                <div className="exercise-block">
                  <p style={{ margin: '0 0 .8rem', fontWeight: 600, color: 'var(--wine-ink)' }}>
                    {view === 'create'
                      ? (uiLanguage === 'es' ? 'Crear una liga nueva' : 'Create a new league')
                      : (uiLanguage === 'es' ? 'Unirte con un código' : 'Join with a code')}
                  </p>
                  <input
                    type="text"
                    placeholder={view === 'create' ? (uiLanguage === 'es' ? 'Nombre de la liga' : 'League name') : (uiLanguage === 'es' ? 'Código de la liga' : 'League code')}
                    value={nameInput}
                    onChange={(e) => setNameInput(view === 'join' ? e.target.value.toUpperCase() : e.target.value)}
                    style={{ width: '100%', padding: '.7rem .9rem', borderRadius: '10px', border: '1.5px solid var(--line)', marginBottom: '.7rem', fontFamily: 'inherit', fontSize: '.95rem' }}
                  />
                  <input
                    type="text"
                    placeholder={uiLanguage === 'es' ? 'Tu nombre para el ranking' : 'Your name on the leaderboard'}
                    value={displayNameInput}
                    onChange={(e) => setDisplayNameInput(e.target.value)}
                    style={{ width: '100%', padding: '.7rem .9rem', borderRadius: '10px', border: '1.5px solid var(--line)', marginBottom: '.9rem', fontFamily: 'inherit', fontSize: '.95rem' }}
                  />
                  {formError && <p style={{ color: '#b3261e', fontSize: '.85rem', margin: '0 0 .8rem' }}>{formError}</p>}
                  <div style={{ display: 'flex', gap: '.6rem' }}>
                    <button className="btn btn-ghost btn-small" onClick={() => setView('overview')}>
                      {uiLanguage === 'es' ? 'Cancelar' : 'Cancel'}
                    </button>
                    <button
                      className="btn btn-gold btn-small"
                      disabled={submitting || !nameInput.trim() || !displayNameInput.trim()}
                      onClick={view === 'create' ? handleCreate : handleJoin}
                    >
                      {submitting
                        ? (uiLanguage === 'es' ? 'Un momento…' : 'One moment…')
                        : view === 'create'
                          ? (uiLanguage === 'es' ? 'Crear' : 'Create')
                          : (uiLanguage === 'es' ? 'Unirme' : 'Join')}
                    </button>
                  </div>
                </div>
              )}

              {view === 'league' && activeLeague && (
                <div>
                  <button className="btn-linklike" onClick={() => setView('overview')} style={{ background: 'none', border: 0, color: 'var(--wine)', fontWeight: 600, cursor: 'pointer', padding: 0, marginBottom: '1rem', fontSize: '.9rem' }}>
                    {uiLanguage === 'es' ? '← Volver a mis ligas' : '← Back to my leagues'}
                  </button>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                    <h4 style={{ margin: 0, color: 'var(--wine-ink)' }}>{activeLeague.name}</h4>
                    <button className="btn btn-ghost btn-small" onClick={() => copyCode(activeLeague.code)}>
                      {copied ? (uiLanguage === 'es' ? '¡Copiado!' : 'Copied!') : `${uiLanguage === 'es' ? 'Código' : 'Code'}: ${activeLeague.code}`}
                    </button>
                  </div>

                  {leaderboard === null ? (
                    <p style={{ color: 'var(--muted)' }}>{uiLanguage === 'es' ? 'Cargando clasificación…' : 'Loading leaderboard…'}</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
                      {leaderboard.map((entry, i) => (
                        <div
                          key={entry.userId}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '.8rem',
                            padding: '.7rem .9rem', borderRadius: '10px',
                            background: entry.isMe ? 'rgba(184,147,90,.12)' : 'var(--card)',
                            border: `1px solid ${entry.isMe ? 'var(--gold)' : 'var(--line)'}`,
                          }}
                        >
                          <span style={{ width: '1.6rem', fontWeight: 700, color: 'var(--wine)' }}>{i + 1}</span>
                          <span style={{ flex: 1, fontWeight: entry.isMe ? 700 : 500, color: 'var(--wine-ink)' }}>
                            {entry.displayName} {entry.isMe && (uiLanguage === 'es' ? '(tú)' : '(you)')}
                          </span>
                          <span style={{ fontSize: '.8rem', color: 'var(--muted)' }}>
                            {uiLanguage === 'es' ? `Nv. ${entry.level}` : `Lv. ${entry.level}`}
                          </span>
                          <strong style={{ color: 'var(--wine-ink)' }}>{entry.weeklyPoints}</strong>
                        </div>
                      ))}
                    </div>
                  )}
                  <p style={{ color: 'var(--muted)', fontSize: '.82rem', marginTop: '1rem' }}>
                    {uiLanguage === 'es' ? 'Puntos de esta semana. El ranking se reinicia cada lunes.' : "This week's points. The ranking resets every Monday."}
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
