import { useLanguage } from '../context/LanguageContext';
import { getString } from '../i18n/strings';

export function LanguageSelector() {
  const { uiLanguage, learningLanguage, setLearningLanguage } = useLanguage();

  return (
    <div style={{
      textAlign: 'center',
      padding: '2rem 0',
    }}>
      <h3 style={{
        color: 'var(--wine)',
        marginBottom: '1.5rem',
        fontSize: '1.2rem',
        fontWeight: '700',
      }}>
        {uiLanguage === 'es' ? '¿Qué idioma quieres aprender?' : 'What language do you want to learn?'}
      </h3>

      <button
        onClick={() => setLearningLanguage('ru')}
        style={{
          display: 'inline-block',
          padding: '1rem 2.5rem',
          fontSize: '1.1rem',
          border: `3px solid ${learningLanguage === 'ru' ? 'var(--gold)' : 'var(--wine)'}`,
          borderRadius: '50px',
          background: learningLanguage === 'ru' ? 'var(--gold)' : 'transparent',
          color: learningLanguage === 'ru' ? 'var(--ink)' : 'var(--wine)',
          fontWeight: '700',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          fontSize: '1rem',
        }}
      >
        {uiLanguage === 'es' ? 'Ruso' : 'Russian'}
      </button>

      {learningLanguage && (
        <p style={{
          marginTop: '1.5rem',
          fontSize: '0.95rem',
          color: 'var(--wine)',
          fontWeight: '600',
        }}>
          ✓ {uiLanguage === 'es' ? '¡Listo para aprender! Selecciona una habilidad abajo para comenzar.' : 'Ready to learn! Select a skill below to start.'}
        </p>
      )}
    </div>
  );
}
