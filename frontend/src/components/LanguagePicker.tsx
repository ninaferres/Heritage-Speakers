import { useLanguage } from '../context/LanguageContext';
import { LearningLanguageCode } from '../i18n/languages';

/** Shared language-choice step, used before entering any exercise module (Daily Practice,
 * Exam mode, the level assessment) so the available learning languages are never fixed per
 * module — they always come from LanguageContext's availableLearningLanguages for the
 * current UI language. */
export function LanguagePicker({ onSelect }: { onSelect: (code: LearningLanguageCode) => void }) {
  const { uiLanguage, availableLearningLanguages, setLearningLanguage } = useLanguage();

  function handlePick(code: LearningLanguageCode) {
    setLearningLanguage(code);
    onSelect(code);
  }

  return (
    <div>
      <h2 style={{ marginBottom: '.6rem', color: 'var(--wine-ink)' }}>
        {uiLanguage === 'es' ? '¿Qué idioma quieres practicar?' : 'Which language do you want to practice?'}
      </h2>
      <p style={{ marginBottom: '1.8rem', color: 'var(--muted)' }}>
        {uiLanguage === 'es' ? 'Puedes cambiarlo cuando quieras desde el menú.' : 'You can change it any time from the menu.'}
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
        {availableLearningLanguages.map((lang) => (
          <button
            key={lang.code}
            type="button"
            disabled={lang.status !== 'active'}
            onClick={() => handlePick(lang.code)}
            style={{
              padding: '1.5rem',
              border: '2px solid var(--wine)',
              borderRadius: '12px',
              background: 'transparent',
              color: 'var(--wine-ink)',
              fontWeight: 600,
              cursor: lang.status === 'active' ? 'pointer' : 'not-allowed',
              fontSize: '1.05rem',
              opacity: lang.status === 'active' ? 1 : 0.5,
            }}
          >
            {lang.nativeLabel}
            {lang.status !== 'active' && (
              <span style={{ display: 'block', fontSize: '.75rem', marginTop: '.3rem', color: 'var(--muted)', fontWeight: 400 }}>
                {uiLanguage === 'es' ? 'Próximamente' : 'Coming soon'}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
