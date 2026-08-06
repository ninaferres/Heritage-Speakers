import { useLanguage } from '../context/LanguageContext';
import { getString } from '../i18n/strings';

export function LanguageSelector() {
  const { uiLanguage, learningLanguage, setLearningLanguage } = useLanguage();

  return (
    <div style={{
      textAlign: 'center',
      padding: '1rem 0',
    }}>
      <p style={{
        color: 'var(--wine)',
        marginBottom: '1rem',
        fontSize: '0.95rem',
        fontWeight: '600',
      }}>
        {uiLanguage === 'es' ? '¿Qué idioma quieres aprender?' : 'What language do you want to learn?'}
      </p>

      <button
        onClick={() => setLearningLanguage('ru')}
        style={{
          display: 'inline-block',
          padding: '0.75rem 2rem',
          fontSize: '1rem',
          border: `2px solid ${learningLanguage === 'ru' ? 'var(--gold)' : 'var(--wine)'}`,
          borderRadius: '50px',
          background: learningLanguage === 'ru' ? 'var(--gold)' : 'transparent',
          color: learningLanguage === 'ru' ? 'var(--ink)' : 'var(--wine)',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        }}
      >
        {uiLanguage === 'es' ? 'Ruso' : 'Russian'}
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
