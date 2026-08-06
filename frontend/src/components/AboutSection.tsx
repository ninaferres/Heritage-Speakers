import { useLanguage } from '../context/LanguageContext';
import { getString } from '../i18n/strings';

export function AboutSection() {
  const { uiLanguage } = useLanguage();

  return (
    <section className="block about">
      <div className="wrap">
        <div className="head">
          <span className="eyebrow">{getString('about.eyebrow', uiLanguage)}</span>
          <h2>{getString('about.title', uiLanguage)}</h2>
        </div>

        <div className="about-content">
          <div className="about-card">
            <div className="about-avatar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
              </svg>
            </div>
            <h3>Nina</h3>
          </div>

          <div className="about-story">
            <p className="story-paragraph">
              {getString('about.ninaStory', uiLanguage)}
            </p>

            <p className="story-paragraph">
              {getString('about.ninaVision', uiLanguage)}
            </p>

            <div className="rosa-section">
              <h4>Why Rosa?</h4>
              <p>
                {getString('about.ninaWhyRosa', uiLanguage)}
              </p>
            </div>

            <p className="story-call">
              {getString('about.ninaCall', uiLanguage)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
