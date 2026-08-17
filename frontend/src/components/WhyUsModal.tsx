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

const EXPANSIONS: { es: { title: string; body: string }; en: { title: string; body: string } }[] = [
  {
    es: {
      title: 'Por qué un solo nivel no te representa',
      body: 'La mayoría de plataformas te ponen en "nivel intermedio" y ya está, como si hablar, leer, escuchar y escribir fueran la misma habilidad. Para un hablante de herencia casi nunca es así: entiendes conversaciones complejas de tus abuelos sin esfuerzo, pero un correo formal te cuesta el triple. Por eso cada destreza tiene su propio nivel CEFR, independiente de las demás, y tu práctica se ajusta a cada una por separado, sin que una te frene o infle a las otras.',
    },
    en: {
      title: 'Why one level doesn\'t represent you',
      body: 'Most platforms put you in "intermediate" and call it done, as if speaking, reading, listening, and writing were the same skill. For a heritage speaker that\'s almost never true: you might understand your grandparents\' complex conversations effortlessly, while a formal email takes three times the effort. That\'s why every skill gets its own CEFR level, independent of the others, and your practice adjusts to each one separately, with no skill dragging down or inflating the rest.',
    },
  },
  {
    es: {
      title: 'Contenido pensado para tus errores, no para los de un principiante',
      body: 'Un principiante confunde el vocabulario básico. Un hablante de herencia normalmente no: sus errores suelen ser calcos del otro idioma, huecos en el registro formal, o faltas de ortografía en palabras que pronuncia perfectamente. La corrección de tus ejercicios está calibrada para detectar justo ese tipo de error, no para explicarte qué es un verbo.',
    },
    en: {
      title: 'Content built for your mistakes, not a beginner\'s',
      body: 'A beginner mixes up basic vocabulary. A heritage speaker usually doesn\'t: their mistakes tend to be calques from the other language, gaps in formal register, or spelling errors in words they pronounce perfectly. The feedback on your exercises is calibrated to catch exactly that kind of mistake, not to explain what a verb is.',
    },
  },
  {
    es: {
      title: 'Un acento real, no uno genérico',
      body: 'El español peninsular y el ruso que escuchas en Heritage Speakers son voces de esa región concreta, no una mezcla neutra pensada para sonar "internacional". Si tu familia habla de una forma concreta, queremos que lo que practiques suene parecido a eso, no a un audio de manual.',
    },
    en: {
      title: 'A real accent, not a generic one',
      body: 'The Peninsular Spanish and Russian you hear on Heritage Speakers are voices from that specific region, not a neutral blend built to sound "international." If your family speaks a certain way, we want what you practice with to sound like that, not like a textbook recording.',
    },
  },
  {
    es: {
      title: 'Dos formas de avanzar, un mismo objetivo',
      body: 'Practica un poco cada día sin presión, destreza por destreza, o pon a prueba tu nivel real con un examen riguroso por CEFR cuando quieras medir dónde estás de verdad, por ejemplo, para poner tu nivel de idioma en el currículum con honestidad. Las dos rutas usan el mismo motor y avanzan juntas.',
    },
    en: {
      title: 'Two ways to progress, one goal',
      body: 'Practice a little each day with no pressure, skill by skill, or put your real level to the test with a rigorous CEFR exam whenever you want to know exactly where you stand, for example, to honestly list your language level on your CV. Both paths run on the same engine and move together.',
    },
  },
];

export function WhyUsModal({ onClose }: { onClose: () => void }) {
  const { uiLanguage } = useLanguage();

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'var(--bone)', zIndex: 1000, overflow: 'auto' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 2rem', minHeight: '100vh' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <span className="eyebrow">{uiLanguage === 'es' ? 'Por qué Heritage Speakers' : 'Why Heritage Speakers'}</span>
          <button
            onClick={onClose}
            aria-label={uiLanguage === 'es' ? 'Cerrar' : 'Close'}
            style={{ background: 'none', border: 'none', fontSize: '1.6rem', cursor: 'pointer', color: 'var(--wine)', fontWeight: 'bold', padding: '.3rem', lineHeight: 1 }}
          >
            ✕
          </button>
        </div>

        <h1 style={{ color: 'var(--wine-ink)', margin: '0 0 1.2rem', fontSize: 'clamp(1.9rem,4vw,2.6rem)', maxWidth: '18ch' }}>
          {uiLanguage === 'es' ? 'No es otra app de idiomas para principiantes' : "This isn't another beginner language app"}
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '1.08rem', lineHeight: 1.7, maxWidth: '65ch', marginBottom: '2.6rem' }}>
          {uiLanguage === 'es'
            ? 'Las plataformas generales están hechas para alguien que empieza de cero. Tú no partes de cero: creciste oyendo el idioma, y lo que necesitas es distinto, más específico y bastante menos habitual de lo que ofrece un curso genérico.'
            : "General-purpose platforms are built for someone starting from zero. You're not starting from zero: you grew up hearing the language, and what you need is different, more specific, and quite a bit less common than what a generic course offers."}
        </p>

        <div className="compare-table" style={{ marginBottom: '3.2rem' }}>
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.2rem', marginBottom: '2.8rem' }}>
          {EXPANSIONS.map((section, i) => (
            <div key={i}>
              <h3 style={{ color: 'var(--wine-ink)', fontSize: '1.2rem', marginBottom: '.6rem' }}>{section[uiLanguage].title}</h3>
              <p style={{ color: 'var(--charcoal)', lineHeight: 1.75, fontSize: '1rem' }}>{section[uiLanguage].body}</p>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="btn btn-wine"
        >
          {uiLanguage === 'es' ? 'Cerrar' : 'Close'}
        </button>
      </div>
    </div>
  );
}
