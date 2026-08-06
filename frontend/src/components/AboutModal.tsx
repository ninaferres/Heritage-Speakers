import { useLanguage } from '../context/LanguageContext';
import { getString } from '../i18n/strings';

export function AboutModal({ onClose }: { onClose: () => void }) {
  const { uiLanguage } = useLanguage();

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem',
    }}>
      <div style={{
        background: 'var(--bone)',
        borderRadius: '16px',
        padding: '2rem',
        maxWidth: '600px',
        maxHeight: '80vh',
        overflowY: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ color: 'var(--wine)', margin: 0, fontSize: '1.5rem' }}>
            {getString('about.title', uiLanguage)}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: 'var(--wine)',
              fontWeight: 'bold',
            }}
          >
            ✕
          </button>
        </div>

        <div style={{
          lineHeight: '1.8',
          color: 'var(--ink)',
          fontSize: '0.95rem',
        }}>
          <p style={{ marginBottom: '1.5rem' }}>
            {getString('about.ninaStory', uiLanguage)}
          </p>

          <p style={{ marginBottom: '1.5rem' }}>
            {getString('about.ninaVision', uiLanguage)}
          </p>

          <div style={{
            background: 'rgba(107,31,46,0.08)',
            padding: '1.5rem',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            borderLeft: '4px solid var(--wine)',
          }}>
            <h4 style={{ color: 'var(--wine)', marginTop: 0 }}>
              {uiLanguage === 'es' ? '¿Por qué el Rosa?' : 'Why Rosa?'}
            </h4>
            <p style={{ margin: 0 }}>
              {getString('about.ninaWhyRosa', uiLanguage)}
            </p>
          </div>

          <p style={{
            fontSize: '1.05rem',
            fontStyle: 'italic',
            color: 'var(--wine)',
            fontWeight: '600',
            marginBottom: 0,
          }}>
            {getString('about.ninaCall', uiLanguage)}
          </p>
        </div>

        <button
          onClick={onClose}
          style={{
            width: '100%',
            marginTop: '1.5rem',
            padding: '0.75rem',
            background: 'var(--wine)',
            color: 'var(--bone)',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          {uiLanguage === 'es' ? 'Cerrar' : 'Close'}
        </button>
      </div>
    </div>
  );
}
