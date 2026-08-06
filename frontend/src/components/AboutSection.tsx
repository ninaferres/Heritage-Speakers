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
