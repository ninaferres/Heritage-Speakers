import { ComprehensionEvaluation, ProductionEvaluation } from '../../data/feedback';

const CATEGORY_LABEL: Record<string, string> = {
  grammar: 'Grammar',
  syntax: 'Syntax',
  orthography: 'Orthography',
  vocabulary: 'Word choice',
  'verb-tense-mood': 'Verb tense / mood',
  preposition: 'Preposition',
  pronunciation: 'Pronunciation',
  other: 'Note',
};

export function ProductionFeedback({ result }: { result: ProductionEvaluation }) {
  return (
    <div className="feedback-panel">
      <div className="feedback-score">
        <span className="num">{result.score}</span>
        <span className="scale">/ 100 · CEFR estimate: {result.cefrEstimate}</span>
      </div>
      <p style={{ marginBottom: '1rem', color: 'var(--charcoal)', lineHeight: 1.65 }}>{result.summary}</p>

      {result.transcript && (
        <div className="exercise-block" style={{ marginBottom: '1.2rem' }}>
          <h4>Transcript</h4>
          <p>{result.transcript}</p>
        </div>
      )}

      {result.errors.length > 0 && (
        <>
          <h4 style={{ color: 'var(--wine-ink)', marginBottom: '.6rem', fontSize: '.95rem' }}>Detailed corrections</h4>
          <ul className="feedback-list">
            {result.errors.map((err, i) => (
              <li key={i}>
                <span className="err-label">{CATEGORY_LABEL[err.category] ?? err.category}</span>
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
          <h4 style={{ color: 'var(--wine-ink)', margin: '1.2rem 0 .6rem', fontSize: '.95rem' }}>Pronunciation & accent</h4>
          <ul className="feedback-list">
            {result.pronunciationNotes.map((note, i) => (
              <li key={i}>{note}</li>
            ))}
          </ul>
        </>
      )}

      {result.nativeReformulation && (
        <div className="exercise-block" style={{ marginTop: '1.2rem' }}>
          <h4>Native-level reformulation</h4>
          <p>{result.nativeReformulation}</p>
        </div>
      )}
    </div>
  );
}

export function ComprehensionFeedback({ result }: { result: ComprehensionEvaluation }) {
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
            <span className="err-label">{q.correct ? '✓ Correct' : '✗ Needs work'} — {q.question}</span>
            {q.feedback}
            {!q.correct && (
              <>
                <br />
                <em>Model answer: {q.idealAnswer}</em>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
