import { useLanguage } from '../context/LanguageContext';
import { getString } from '../i18n/strings';

export function LanguageSelector() {
  const { uiLanguage, learningLanguage, setLearningLanguage } = useLanguage();

  const languageToLearn = uiLanguage === 'es' ? 'ru' : 'es';
  const languageName = uiLanguage === 'es' ? 'Ruso' : 'Spanish';

  return (
    <div id="language-selector" style={{
      textAlign: 'center',
      padding: '2rem 1rem',
      background: 'rgba(107,31,46,0.05)',
      borderRadius: '12px',
      border: '2px solid var(--wine)',
      animation: 'pulse 2s infinite',
    }}>
      <style>{`
        @keyframes pulse {
          0%, 100% { border-color: var(--wine); background: rgba(107,31,46,0.05); }
          50% { border-color: var(--gold); background: rgba(184,147,90,0.1); }
        }
      `}</style>
      <p style={{
        color: 'var(--wine)',
        marginBottom: '0.5rem',
        fontSize: '0.85rem',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '1px',
      }}>
        {uiLanguage === 'es' ? '👇 Haz clic aquí para comenzar' : '👇 Click here to start'}
      </p>
      <p style={{
        color: 'var(--wine)',
        marginBottom: '1.5rem',
        fontSize: '1.05rem',
        fontWeight: '600',
      }}>
        {uiLanguage === 'es' ? '¿Qué idioma quieres aprender?' : 'What language do you want to learn?'}
      </p>

      <button
        onClick={() => setLearningLanguage(languageToLearn as any)}
        style={{
          display: 'inline-block',
          padding: '0.75rem 2rem',
          fontSize: '1rem',
          border: `2px solid ${learningLanguage === languageToLearn ? 'var(--gold)' : 'var(--wine)'}`,
          borderRadius: '50px',
          background: learningLanguage === languageToLearn ? 'var(--gold)' : 'transparent',
          color: learningLanguage === languageToLearn ? 'var(--ink)' : 'var(--wine)',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        }}
      >
        {languageName}
      </button>

      {learningLanguage && (
        <p style={{
          marginTop: '1rem',
          fontSize: '0.85rem',
          color: 'var(--wine)',
          fontWeight: '600',
        }}>
          ✓ {uiLanguage === 'es' ? '¡Listo para aprender! Selecciona una habilidad abajo para comenzar.' : 'Ready to learn! Select a skill below to start.'}
        </p>
      )}
    </div>
  );
}
