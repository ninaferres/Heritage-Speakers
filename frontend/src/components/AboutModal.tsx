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
      background: 'var(--bone)',
      zIndex: 1000,
      overflow: 'auto',
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '3rem 2rem',
        minHeight: '100vh',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ color: 'var(--wine)', margin: '0 0 1.5rem 0', fontSize: '2.5rem' }}>
              {getString('about.title', uiLanguage)}
            </h1>
            <img
              src="/images/nina.jpg"
              alt="Nina"
              style={{
                width: '200px',
                height: '200px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '4px solid var(--wine)',
                marginBottom: '1.5rem',
              }}
            />
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '2rem',
              cursor: 'pointer',
              color: 'var(--wine)',
              fontWeight: 'bold',
              padding: '0.5rem',
            }}
          >
            ✕
          </button>
        </div>

        <div style={{
          lineHeight: '1.9',
          color: 'var(--ink)',
          fontSize: '1.1rem',
        }}>
          <p style={{ marginBottom: '2rem' }}>
            {getString('about.ninaStory', uiLanguage)}
          </p>

          <p style={{ marginBottom: '2rem' }}>
            {getString('about.ninaVision', uiLanguage)}
          </p>

          <div style={{
            background: 'rgba(107,31,46,0.08)',
            padding: '2rem',
            borderRadius: '12px',
            marginBottom: '2rem',
            borderLeft: '6px solid var(--wine)',
          }}>
            <p style={{ margin: 0, fontSize: '1.05rem' }}>
              {getString('about.ninaWhyRosa', uiLanguage)}
            </p>
          </div>

          <p style={{
            fontSize: '1.15rem',
            color: 'var(--wine)',
            fontWeight: '600',
            marginBottom: '3rem',
            lineHeight: '1.9',
          }}>
            {getString('about.ninaCall', uiLanguage)}
          </p>
        </div>

        <button
          onClick={onClose}
          style={{
            padding: '1rem 2rem',
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
