import { LogoBadge } from './Logo';
import { useLanguage } from '../context/LanguageContext';
import { getUILanguage } from '../i18n/languages';
import { getString } from '../i18n/strings';

export function Footer() {
  const { uiLanguage } = useLanguage();
  const ui = getUILanguage(uiLanguage);
  return (
    <footer>
      <div className="wrap">
        <span className="brand">
          <LogoBadge width={50} height={35} />
          <span className="brand-name">Heritage Speakers</span>
        </span>
        <span className="langs">{ui?.label}</span>
        <span className="copy">
          {getString('footer.copyright', uiLanguage)}
          <a href="https://www.instagram.com/heritagespeakers" target="_blank" rel="noopener noreferrer" className="footer-instagram">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4.2" />
              <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
            </svg>
            @heritagespeakers
          </a>
        </span>
      </div>
    </footer>
  );
}
