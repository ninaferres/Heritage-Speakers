import { useState } from 'react';
import { VocabMatchContent } from '../../data/microLessonTypes';

function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function VocabMatchStep({
  content,
  uiLanguage,
  onComplete,
}: {
  content: VocabMatchContent;
  uiLanguage: 'en' | 'es';
  onComplete: (correct: boolean) => void;
}) {
  const [terms] = useState(() => shuffle(content.pairs.map((p, i) => ({ id: i, text: p.term }))));
  const [matches] = useState(() => shuffle(content.pairs.map((p, i) => ({ id: i, text: p.match }))));
  const [selectedTerm, setSelectedTerm] = useState<number | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<number | null>(null);
  const [matchedIds, setMatchedIds] = useState<Set<number>>(new Set());
  const [wrongFlash, setWrongFlash] = useState<{ term: number | null; match: number | null }>({ term: null, match: null });
  const [hadMistake, setHadMistake] = useState(false);

  function checkPair(termId: number, matchId: number) {
    if (termId === matchId) {
      const next = new Set(matchedIds);
      next.add(termId);
      setMatchedIds(next);
      setSelectedTerm(null);
      setSelectedMatch(null);
      if (next.size === content.pairs.length) {
        setTimeout(() => onComplete(!hadMistake), 500);
      }
    } else {
      setHadMistake(true);
      setWrongFlash({ term: termId, match: matchId });
      setTimeout(() => {
        setWrongFlash({ term: null, match: null });
        setSelectedTerm(null);
        setSelectedMatch(null);
      }, 450);
    }
  }

  function pickTerm(id: number) {
    if (matchedIds.has(id) || wrongFlash.term !== null) return;
    setSelectedTerm(id);
    if (selectedMatch !== null) checkPair(id, selectedMatch);
  }
  function pickMatch(id: number) {
    if (matchedIds.has(id) || wrongFlash.match !== null) return;
    setSelectedMatch(id);
    if (selectedTerm !== null) checkPair(selectedTerm, id);
  }

  return (
    <div className="exercise-question">
      <h4>{uiLanguage === 'es' ? 'Empareja cada palabra con su significado' : 'Match each word with its meaning'}</h4>
      <div className="match-columns" style={{ marginTop: '1rem' }}>
        <div>
          {terms.map((t) => (
            <button
              key={t.id}
              className={`match-item ${matchedIds.has(t.id) ? 'matched' : ''} ${selectedTerm === t.id ? 'selected' : ''} ${wrongFlash.term === t.id ? 'step-flash-wrong' : ''}`}
              disabled={matchedIds.has(t.id)}
              onClick={() => pickTerm(t.id)}
            >
              {t.text}
            </button>
          ))}
        </div>
        <div>
          {matches.map((m) => (
            <button
              key={m.id}
              className={`match-item ${matchedIds.has(m.id) ? 'matched' : ''} ${selectedMatch === m.id ? 'selected' : ''} ${wrongFlash.match === m.id ? 'step-flash-wrong' : ''}`}
              disabled={matchedIds.has(m.id)}
              onClick={() => pickMatch(m.id)}
            >
              {m.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
