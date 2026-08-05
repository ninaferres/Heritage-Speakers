import { useState, useEffect } from 'react';

export function MatchingQuestion({
  question,
  pairs,
  selected,
  onSelect,
  disabled,
}: {
  question: string;
  pairs: { left: string; right: string }[];
  selected: Record<number, number>;
  onSelect: (leftIndex: number, rightIndex: number) => void;
  disabled: boolean;
}) {
  const [shuffledRight, setShuffledRight] = useState<{ right: string; originalIndex: number }[]>([]);

  useEffect(() => {
    const shuffled = pairs
      .map((p, i) => ({ right: p.right, originalIndex: i }))
      .sort(() => Math.random() - 0.5);
    setShuffledRight(shuffled);
  }, []);

  return (
    <div>
      <h4 style={{ marginBottom: '1.5rem', color: 'var(--wine-ink)' }}>{question}</h4>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {pairs.map((pair, i) => (
            <div
              key={i}
              style={{
                padding: '1rem',
                border: '2px solid var(--line)',
                borderRadius: '12px',
                backgroundColor: 'var(--bone)',
              }}
            >
              {pair.left}
            </div>
          ))}
        </div>

        {/* Right column (clickable) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {shuffledRight.map((item, displayIndex) => {
            const isSelected = Object.values(selected).includes(item.originalIndex);
            return (
              <button
                key={displayIndex}
                onClick={() => {
                  // Find which left item is being clicked (simple: just pick first unmatched)
                  for (let i = 0; i < pairs.length; i++) {
                    if (!Object.keys(selected).includes(i.toString())) {
                      onSelect(i, item.originalIndex);
                      break;
                    }
                  }
                }}
                disabled={disabled || isSelected}
                style={{
                  padding: '1rem',
                  border: isSelected ? '2px solid var(--gold)' : '2px solid var(--line)',
                  borderRadius: '12px',
                  backgroundColor: isSelected ? 'rgba(184,147,90,.1)' : 'transparent',
                  cursor: disabled || isSelected ? 'not-allowed' : 'pointer',
                  transition: 'all .2s ease',
                  textAlign: 'left',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  color: 'inherit',
                }}
              >
                {item.right}
              </button>
            );
          })}
        </div>
      </div>

      {Object.keys(selected).length > 0 && (
        <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: 'var(--bone)', borderRadius: '12px' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>Matched pairs:</p>
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
