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

export function ProductionFeedback({ result }: { result: ProductionEvaluation }) {
  const { uiLanguage } = useLanguage();
  return (
    <div className="feedback-panel">
      <div className="feedback-score">
        <span className="num">{result.score}</span>
        <span className="scale">/ 100 · {getString('feedback.cefrEstimate', uiLanguage)} {result.cefrEstimate}</span>
      </div>
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
