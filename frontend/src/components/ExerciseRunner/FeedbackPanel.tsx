import { useEffect, useState } from 'react';
import { ComprehensionEvaluation, ProductionEvaluation } from '../../data/feedback';
import { useLanguage } from '../../context/LanguageContext';
import { getString, StringKey } from '../../i18n/strings';

const CATEGORY_KEY: Record<string, StringKey> = {
  grammar: 'feedback.category.grammar',
  syntax: 'feedback.category.syntax',
  orthography: 'feedback.category.orthography',
  vocabulary: 'feedback.category.vocabulary',
  'verb-tense-mood': 'feedback.category.verbTenseMood',
  preposition: 'feedback.category.preposition',
  pronunciation: 'feedback.category.pronunciation',
  other: 'feedback.category.other',
};

function scoreTier(score: number): { key: StringKey; color: string } {
  if (score >= 85) return { key: 'feedback.tier.excellent', color: '#2e7d32' };
  if (score >= 70) return { key: 'feedback.tier.great', color: 'var(--gold)' };
  if (score >= 50) return { key: 'feedback.tier.good', color: '#b8860b' };
  return { key: 'feedback.tier.keepPracticing', color: 'var(--wine)' };
}

const CONFETTI_EMOJIS = ['🎉', '✨', '⭐', '🎊', '💫', '🔥'];

function ScoreReveal({ score }: { score: number }) {
  const { uiLanguage } = useLanguage();
  const [displayScore, setDisplayScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const tier = scoreTier(score);
  const clamped = Math.max(0, Math.min(100, score));

  useEffect(() => {
    setDisplayScore(0);
    setShowConfetti(false);
    const duration = 900;
    const start = performance.now();
    let raf: number;
    function tick(now: number) {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(eased * clamped));
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      } else if (clamped >= 70) {
        setShowConfetti(true);
      }
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clamped]);

  const confettiParticles = showConfetti
    ? Array.from({ length: 14 }).map((_, i) => {
        const tx = (Math.random() - 0.5) * 220;
        const ty = -70 - Math.random() * 110;
        return { id: i, tx, ty, emoji: CONFETTI_EMOJIS[i % CONFETTI_EMOJIS.length], left: 8 + Math.random() * 84, size: 1 + Math.random() * 0.9, delay: Math.random() * 0.18, dur: 0.9 + Math.random() * 0.6 };
      })
    : [];

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '.6rem 0 1.2rem' }}>
      {confettiParticles.map((p) => (
        <span
          key={p.id}
          style={
            {
              position: 'absolute',
              left: `${p.left}%`,
              top: '38%',
              fontSize: `${p.size}rem`,
              pointerEvents: 'none',
              '--tx': `${p.tx}px`,
              '--ty': `${p.ty}px`,
              animation: `feedbackConfetti ${p.dur}s ease-out forwards`,
              animationDelay: `${p.delay}s`,
            } as React.CSSProperties
          }
        >
          {p.emoji}
        </span>
      ))}

      <div
        style={{
          width: '128px',
          height: '128px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `conic-gradient(${tier.color} ${displayScore * 3.6}deg, var(--line) ${displayScore * 3.6}deg)`,
          transition: 'background .15s linear',
          animation: 'feedbackScorePop .5s cubic-bezier(.34,1.56,.64,1)',
          boxShadow: clamped >= 70 ? `0 0 24px ${tier.color}55` : 'none',
        }}
      >
        <div
          style={{
            width: '102px',
            height: '102px',
            borderRadius: '50%',
            background: 'var(--bone)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ fontFamily: "'Fraunces', serif", fontSize: '2.1rem', fontWeight: 800, color: tier.color, lineHeight: 1 }}>{displayScore}</span>
          <span style={{ fontSize: '.68rem', color: 'var(--muted)', fontWeight: 600 }}>/ 100</span>
        </div>
      </div>

      <span
        style={{
          marginTop: '.9rem',
          fontWeight: 800,
          fontSize: '1.2rem',
          color: tier.color,
          animation: 'feedbackTierPop .45s ease .45s both',
        }}
      >
        {getString(tier.key, uiLanguage)}
      </span>

      <style>{`
        @keyframes feedbackScorePop {
          0% { transform: scale(.4); opacity: 0; }
          60% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); }
        }
        @keyframes feedbackTierPop {
          0% { transform: scale(.7) translateY(8px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes feedbackConfetti {
          0% { transform: translate(0,0) scale(.4) rotate(0deg); opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) scale(1.3) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export function ProductionFeedback({ result }: { result: ProductionEvaluation }) {
  const { uiLanguage } = useLanguage();
  return (
    <div className="feedback-panel">
      <ScoreReveal score={result.score} />
      <p style={{ textAlign: 'center', marginBottom: '.4rem', color: 'var(--muted)', fontSize: '.9rem' }}>
        {getString('feedback.cefrEstimate', uiLanguage)} <strong style={{ color: 'var(--wine-ink)' }}>{result.cefrEstimate}</strong>
      </p>
      <p style={{ marginBottom: '1rem', color: 'var(--charcoal)', lineHeight: 1.65 }}>{result.summary}</p>

      {result.transcript && (
        <div className="exercise-block" style={{ marginBottom: '1.2rem' }}>
          <h4>{getString('feedback.transcript', uiLanguage)}</h4>
          <p>{result.transcript}</p>
        </div>
      )}

      {result.errors.length > 0 && (
        <>
          <h4 style={{ color: 'var(--wine-ink)', marginBottom: '.6rem', fontSize: '.95rem' }}>{getString('feedback.detailedCorrections', uiLanguage)}</h4>
          <ul className="feedback-list">
            {result.errors.map((err, i) => (
              <li key={i}>
                <span className="err-label">{getString(CATEGORY_KEY[err.category] ?? 'feedback.category.other', uiLanguage)}</span>
                <span style={{ textDecoration: 'line-through', color: '#b3261e' }}>{err.original}</span>
                {' → '}
                <span style={{ fontWeight: 600 }}>{err.correction}</span>
                <br />
                {err.explanation}
              </li>
            ))}
          </ul>
        </>
      )}

      {result.pronunciationNotes.length > 0 && (
        <>
          <h4 style={{ color: 'var(--wine-ink)', margin: '1.2rem 0 .6rem', fontSize: '.95rem' }}>{getString('feedback.pronunciationAccent', uiLanguage)}</h4>
          <ul className="feedback-list">
            {result.pronunciationNotes.map((note, i) => (
              <li key={i}>{note}</li>
            ))}
          </ul>
        </>
      )}

      {result.nativeReformulation && (
        <div className="exercise-block" style={{ marginTop: '1.2rem' }}>
          <h4>{getString('feedback.nativeReformulation', uiLanguage)}</h4>
          <p>{result.nativeReformulation}</p>
        </div>
      )}
    </div>
  );
}

export function ComprehensionFeedback({ result }: { result: ComprehensionEvaluation }) {
  const { uiLanguage } = useLanguage();
  return (
    <div className="feedback-panel">
      <ScoreReveal score={result.overallScore} />
      <p style={{ marginBottom: '1rem', color: 'var(--charcoal)', lineHeight: 1.65 }}>{result.summary}</p>
      <ul className="feedback-list">
        {result.perQuestion.map((q, i) => (
          <li
            key={i}
            style={{
              borderLeftColor: q.correct ? '#2e7d32' : '#b3261e',
              animation: `feedbackItemIn .35s ease ${i * 0.08}s both`,
            }}
          >
            <span className="err-label">{q.correct ? getString('feedback.correct', uiLanguage) : getString('feedback.needsWork', uiLanguage)} — {q.question}</span>
            {q.feedback}
            {!q.correct && (
              <>
                <br />
                <em>{getString('feedback.modelAnswer', uiLanguage)} {q.idealAnswer}</em>
              </>
            )}
          </li>
        ))}
      </ul>
      <style>{`
        @keyframes feedbackItemIn {
          0% { opacity: 0; transform: translateX(-8px); }
          100% { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
