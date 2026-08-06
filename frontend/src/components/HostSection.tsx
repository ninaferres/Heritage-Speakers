import { useLanguage } from '../context/LanguageContext';
import { getString } from '../i18n/strings';

export function HostSection() {
  const { uiLanguage } = useLanguage();

  return (
    <section className="block host">
      <div className="wrap">
        <div className="host-card">
          <div className="host-avatar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
            </svg>
          </div>
          <div>
            <h3>{getString('host.name', uiLanguage)}</h3>
            <p>
              {getString('host.bio', uiLanguage)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
