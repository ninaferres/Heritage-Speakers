import { UI_LANGUAGES, UILanguageCode, getLearningLanguages } from '../i18n/languages';
import { useLanguage } from '../context/LanguageContext';

export function LanguageSelector() {
  const { uiLanguage, setUILanguage, learningLanguage, setLearningLanguage, availableLearningLanguages } = useLanguage();

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(107,31,46,.08) 0%, rgba(184,147,90,.05) 100%)',
      padding: '2.5rem',
      marginBottom: '2rem',
      borderRadius: '12px',
      border: '1px solid rgba(107,31,46,.15)',
    }}>
      <h3 style={{ color: 'var(--wine)', marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: '700' }}>
        Choose Your Learning Path
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Interface Language */}
        <div>
          <label style={{
            display: 'block',
            marginBottom: '0.75rem',
            fontSize: '0.85rem',
            fontWeight: '600',
            color: 'var(--wine)',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Interface Language
          </label>
          <select
            value={uiLanguage}
            onChange={(e) => setUILanguage(e.target.value as UILanguageCode)}
            style={{
              width: '100%',
              padding: '0.75rem',
              fontSize: '1rem',
              border: '2px solid var(--wine)',
              borderRadius: '8px',
              background: 'var(--bone)',
              color: 'var(--ink)',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            {UI_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.nativeLabel}
              </option>
            ))}
          </select>
        </div>

        {/* Learning Language */}
        <div>
          <label style={{
            display: 'block',
            marginBottom: '0.75rem',
            fontSize: '0.85rem',
            fontWeight: '600',
            color: 'var(--wine)',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Learn a Language
          </label>
          <select
            value={learningLanguage || ''}
            onChange={(e) => e.target.value && setLearningLanguage(e.target.value as any)}
            style={{
              width: '100%',
              padding: '0.75rem',
              fontSize: '1rem',
              border: `2px solid ${learningLanguage ? 'var(--gold)' : 'var(--wine)'}`,
              borderRadius: '8px',
              background: 'var(--bone)',
              color: learningLanguage ? 'var(--wine)' : 'var(--muted)',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            <option value="">Select a language to learn...</option>
            {availableLearningLanguages.map((lang) => (
              <option key={lang.code} value={lang.code} disabled={lang.status !== 'active'}>
                {lang.nativeLabel} {lang.status !== 'active' ? '— coming soon' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {learningLanguage && (
        <p style={{
          marginTop: '1rem',
          fontSize: '0.9rem',
          color: 'var(--wine)',
          fontWeight: '600',
        }}>
          ✓ Ready to learn! Select a skill below to start.
        </p>
      )}
    </div>
  );
}
