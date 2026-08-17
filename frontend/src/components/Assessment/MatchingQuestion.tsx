import { useState, useEffect } from 'react';

export function MatchingQuestion({
  question,
  pairs,
  selected,
  onSelect,
  disabled,
  uiLanguage = 'es',
}: {
  question: string;
  pairs: { left: string; right: string }[];
  selected: Record<number, number>;
  onSelect: (leftIndex: number, rightIndex: number) => void;
  disabled: boolean;
  uiLanguage?: 'en' | 'es';
}) {
  const [shuffledRight, setShuffledRight] = useState<{ right: string; originalIndex: number }[]>([]);
  const [pendingLeft, setPendingLeft] = useState<number | null>(null);

  useEffect(() => {
    const shuffled = pairs
      .map((p, i) => ({ right: p.right, originalIndex: i }))
      .sort(() => Math.random() - 0.5);
    setShuffledRight(shuffled);
  }, []);

  const matchedRightIndexes = new Set(Object.values(selected));

  function pickLeft(i: number) {
    if (disabled || i.toString() in selected) return;
    setPendingLeft((prev) => (prev === i ? null : i));
  }

  function pickRight(originalIndex: number) {
    if (disabled || matchedRightIndexes.has(originalIndex) || pendingLeft === null) return;
    onSelect(pendingLeft, originalIndex);
    setPendingLeft(null);
  }

  return (
    <div>
      <h4 style={{ marginBottom: '1.5rem', color: 'var(--wine-ink)' }}>{question}</h4>
      <div className="match-columns">
        <div>
          {pairs.map((pair, i) => {
            const isMatched = i.toString() in selected;
            return (
              <button
                key={i}
                type="button"
                className={`match-item ${isMatched ? 'matched' : ''} ${pendingLeft === i ? 'selected' : ''}`}
                disabled={disabled || isMatched}
                onClick={() => pickLeft(i)}
              >
                {pair.left}
              </button>
            );
          })}
        </div>
        <div>
          {shuffledRight.map((item) => {
            const isMatched = matchedRightIndexes.has(item.originalIndex);
            return (
              <button
                key={item.originalIndex}
                type="button"
                className={`match-item ${isMatched ? 'matched' : ''}`}
                disabled={disabled || isMatched || pendingLeft === null}
                onClick={() => pickRight(item.originalIndex)}
              >
                {item.right}
              </button>
            );
          })}
        </div>
      </div>

      <p style={{ marginTop: '1rem', color: 'var(--muted)', fontSize: '.88rem' }}>
        {pendingLeft === null
          ? (uiLanguage === 'es' ? 'Elige un elemento de la izquierda, luego su pareja de la derecha.' : 'Pick an item on the left, then its match on the right.')
          : (uiLanguage === 'es' ? 'Ahora elige su pareja de la derecha.' : "Now pick its match on the right.")}
      </p>

      {Object.keys(selected).length > 0 && (
        <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: 'var(--bone)', borderRadius: '12px' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>
            {uiLanguage === 'es' ? 'Parejas emparejadas:' : 'Matched pairs:'}
          </p>
          {Object.entries(selected).map(([leftIdx, rightIdx]) => (
            <div key={leftIdx} style={{ fontSize: '0.9rem' }}>
              {pairs[Number(leftIdx)].left} → {pairs[rightIdx].right}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
