export function MultipleChoiceQuestion({
  question,
  options,
  selected,
  onSelect,
  disabled,
}: {
  question: string;
  options: string[];
  selected: string | null;
  onSelect: (option: string) => void;
  disabled: boolean;
}) {
  return (
    <div>
      <h4 style={{ marginBottom: '1.5rem', color: 'var(--wine-ink)' }}>{question}</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {options.map((option, i) => (
          <label
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.8rem',
              padding: '1rem',
              border: selected === option ? '2px solid var(--gold)' : '2px solid var(--line)',
              borderRadius: '12px',
              cursor: disabled ? 'not-allowed' : 'pointer',
              backgroundColor: selected === option ? 'rgba(184,147,90,.1)' : 'transparent',
              transition: 'all .2s ease',
            }}
          >
            <input
              type="radio"
              name={`mc-${question}`}
              value={option}
              checked={selected === option}
              onChange={() => !disabled && onSelect(option)}
              disabled={disabled}
              style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
            />
            <span style={{ flex: 1 }}>{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
