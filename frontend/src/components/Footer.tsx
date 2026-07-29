import { LogoBadge } from './Logo';
import { useLanguage } from '../context/LanguageContext';

export function Footer() {
  const { language } = useLanguage();
  return (
    <footer>
      <div className="wrap">
        <span className="brand">
          <LogoBadge width={50} height={35} />
          <span className="brand-name">Heritage Speakers</span>
        </span>
        <span className="langs">{language.label}</span>
        <span className="copy">© 2026 Heritage Speakers</span>
      </div>
    </footer>
  );
}
