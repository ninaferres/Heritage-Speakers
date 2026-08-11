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

function ScoreBar({ score }: { score: number }) {
  const { uiLanguage } = useLanguage();
  const tier = scoreTier(score);
  return (
    <div style={{ marginBottom: '.9rem' }}>
      <div style={{ height: '10px', backgroundColor: 'var(--line)', borderRadius: '5px', overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${Math.max(0, Math.min(100, score))}%`,
            backgroundColor: tier.color,
            transition: 'width .6s ease',
          }}
        />
      </div>
      <span style={{ display: 'inline-block', marginTop: '.4rem', fontWeight: 700, color: tier.color, fontSize: '.9rem' }}>
        {getString(tier.key, uiLanguage)}
      </span>
    </div>
  );
}

export function ProductionFeedback({ result }: { result: ProductionEvaluation }) {
  const { uiLanguage } = useLanguage();
  return (
    <div className="feedback-panel">
      <div className="feedback-score">
        <span className="num">{result.score}</span>
        <span className="scale">/ 100 · {getString('feedback.cefrEstimate', uiLanguage)} {result.cefrEstimate}</span>
      </div>
      <ScoreBar score={result.score} />
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
      <div className="feedback-score">
        <span className="num">{result.overallScore}</span>
        <span className="scale">/ 100</span>
      </div>
      <ScoreBar score={result.overallScore} />
      <p style={{ marginBottom: '1rem', color: 'var(--charcoal)', lineHeight: 1.65 }}>{result.summary}</p>
      <ul className="feedback-list">
        {result.perQuestion.map((q, i) => (
          <li key={i} style={{ borderLeftColor: q.correct ? '#2e7d32' : '#b3261e' }}>
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
    </div>
  );
}
