import { LogoBadge } from './Logo';
import { useLanguage } from '../context/LanguageContext';
import { getUILanguage } from '../i18n/languages';

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
        <span className="copy">© 2026 Heritage Speakers</span>
      </div>
    </footer>
  );
}
