import { useLanguage } from '../context/LanguageContext';

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

const ROWS: { es: { other: string; us: string }; en: { other: string; us: string } }[] = [
  {
    es: { other: 'Empiezan desde cero, como si nunca hubieras oído el idioma.', us: 'Empieza donde ya estás: entiendes de sobra, hay que reforzar el resto.' },
    en: { other: 'Start from zero, as if you\'d never heard the language before.', us: 'Starts where you already are: you understand plenty, the rest needs reinforcing.' },
  },
  {
    es: { other: 'Un solo nivel general para todo: hablar, leer, escuchar, escribir.', us: 'Un nivel CEFR independiente por destreza. Habla en B2, escritura en A2, sin promediar.' },
    en: { other: 'One overall level for everything: speaking, reading, listening, writing.', us: 'An independent CEFR level per skill. Speaking at B2, writing at A2, no averaging.' },
  },
  {
    es: { other: 'Contenido genérico, igual para cualquier perfil de estudiante.', us: 'Pensado para errores típicos de hablantes de herencia: calcos, vocabulario formal, ortografía.' },
    en: { other: 'Generic content, the same for any kind of learner.', us: 'Built for heritage-speaker-specific gaps: calques, formal vocabulary, spelling.' },
  },
  {
    es: { other: 'Acentos neutros o inventados en los audios.', us: 'Acento real: español peninsular o ruso, no una mezcla artificial.' },
    en: { other: 'Neutral or invented accents in the audio.', us: 'A real accent: Peninsular Spanish or Russian, not an artificial blend.' },
  },
  {
    es: { other: 'Solo gamificación, sin forma de certificar tu nivel real.', us: 'Modo examen riguroso por CEFR además de la práctica diaria: sabes de verdad dónde estás.' },
    en: { other: 'Just gamification, no way to certify your real level.', us: 'A rigorous CEFR exam mode alongside daily practice: you actually know where you stand.' },
  },
  {
    es: { other: 'Frases de manual, poco útiles en la vida real.', us: 'Situaciones reales: un mensaje de WhatsApp, un correo de trabajo, una llamada con tu abuela.' },
    en: { other: 'Textbook phrases, not much use in real life.', us: 'Real situations: a WhatsApp message, a work email, a call with your grandmother.' },
  },
];

export function WhyUsSection() {
  const { uiLanguage } = useLanguage();

  return (
    <section className="block whyus">
      <div className="wrap">
        <div className="head">
          <span className="eyebrow">{uiLanguage === 'es' ? 'Por qué Heritage Speakers' : 'Why Heritage Speakers'}</span>
          <h2>{uiLanguage === 'es' ? 'No es otra app de idiomas para principiantes' : "This isn't another beginner language app"}</h2>
          <p>
            {uiLanguage === 'es'
              ? 'Las plataformas generales están hechas para alguien que empieza de cero. Tú no partes de cero.'
              : "General-purpose platforms are built for someone starting from zero. You're not starting from zero."}
          </p>
        </div>

        <div className="compare-table">
          <div className="compare-head">
            <span className="compare-head-label other">{uiLanguage === 'es' ? 'Apps genéricas' : 'Generic apps'}</span>
            <span className="compare-head-label us">Heritage Speakers</span>
          </div>
          {ROWS.map((row, i) => (
            <div className="compare-row" key={i}>
              <div className="compare-cell other">
                <span className="compare-icon"><XIcon /></span>
                <span className="compare-text">{row[uiLanguage].other}</span>
              </div>
              <div className="compare-cell us">
                <span className="compare-icon"><CheckIcon /></span>
                <span className="compare-text">{row[uiLanguage].us}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
