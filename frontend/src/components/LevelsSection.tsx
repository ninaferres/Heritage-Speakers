import { useState } from 'react';
import { CEFR_LEVELS, SKILLS } from '../data/skills';
import { CefrLevel, SkillId } from '../data/types';
import { SpeakingIcon, ReadingIcon, ListeningIcon, WritingIcon } from './icons/SkillIcons';
import { useExerciseGate } from '../context/ExerciseGateContext';
import { useLanguage } from '../context/LanguageContext';
import { getString } from '../i18n/strings';
import { AssessmentModal } from './Assessment/AssessmentModal';

const ICONS: Record<SkillId, () => JSX.Element> = {
  Speaking: SpeakingIcon,
  Reading: ReadingIcon,
  Listening: ListeningIcon,
  Writing: WritingIcon,
};

const CEFR_GUIDE: { level: CefrLevel; es: { label: string; body: string }; en: { label: string; body: string } }[] = [
  { level: 'A1', es: { label: 'Principiante', body: 'Entiendes y usas expresiones cotidianas muy básicas.' }, en: { label: 'Beginner', body: 'You understand and use very basic everyday expressions.' } },
  { level: 'A2', es: { label: 'Elemental', body: 'Te comunicas en tareas simples sobre temas familiares.' }, en: { label: 'Elementary', body: 'You communicate in simple, routine tasks on familiar topics.' } },
  { level: 'B1', es: { label: 'Intermedio', body: 'Te desenvuelves en la mayoría de situaciones y explicas experiencias.' }, en: { label: 'Intermediate', body: 'You handle most everyday situations and describe experiences.' } },
  { level: 'B2', es: { label: 'Intermedio alto', body: 'Entiendes textos complejos e interactúas con fluidez.' }, en: { label: 'Upper intermediate', body: 'You understand complex text and interact with fluency.' } },
  { level: 'C1', es: { label: 'Avanzado', body: 'Te expresas con fluidez y espontaneidad en contextos exigentes.' }, en: { label: 'Advanced', body: 'You express yourself fluently and spontaneously in demanding contexts.' } },
  { level: 'C2', es: { label: 'Dominio', body: 'Entiendes prácticamente todo y te expresas con precisión nativa.' }, en: { label: 'Proficient', body: 'You understand virtually everything and express yourself with native-like precision.' } },
];

function CefrGuide({ uiLanguage }: { uiLanguage: 'en' | 'es' }) {
  return (
    <div className="cefr-guide">
      <h3 className="cefr-guide-title">
        {uiLanguage === 'es' ? 'Guía de niveles CEFR' : 'CEFR level guide'}
      </h3>
      <p className="cefr-guide-sub">
        {uiLanguage === 'es'
          ? 'El marco europeo (A1–C2) que usamos para medir cada destreza por separado.'
          : 'The European framework (A1–C2) we use to measure each skill separately.'}
      </p>
      <div className="cefr-guide-grid">
        {CEFR_GUIDE.map((g) => (
          <div className="cefr-guide-card" key={g.level}>
            <span className="cefr-guide-level">{g.level}</span>
            <span className="cefr-guide-label">{g[uiLanguage].label}</span>
            <p>{g[uiLanguage].body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SkillCard({ id, sub, uiLanguage }: { id: SkillId; sub: { es: string; en: string }; uiLanguage: 'en' | 'es' }) {
  const [level, setLevel] = useState<CefrLevel>('A1');
  const { requestExercise } = useExerciseGate();
  const Icon = ICONS[id];
  const isMaintain = level === 'C2';

  const skillNames: Record<SkillId, { es: string; en: string }> = {
    Speaking: { es: 'Habla', en: 'Speaking' },
    Reading: { es: 'Lectura', en: 'Reading' },
    Listening: { es: 'Escucha', en: 'Listening' },
    Writing: { es: 'Escritura', en: 'Writing' },
  };

  return (
    <div className="skill-card" id={`skill-card-${id}`}>
      <div className="skill-icon"><Icon /></div>
      <h3>{skillNames[id][uiLanguage]}</h3>
      <div className="sub">{sub[uiLanguage]}</div>
      <div className="chips">
        {CEFR_LEVELS.map((lvl) => (
          <button
            key={lvl}
            className={`chip ${level === lvl ? 'active' : ''} ${level === lvl && lvl === 'C2' ? 'gold' : ''}`}
            onClick={() => setLevel(lvl)}
          >
            {lvl}
          </button>
        ))}
      </div>
      <span className="level-up">
        {isMaintain ? <span className="maintain">{uiLanguage === 'es' ? 'Manteniendo C2' : 'Maintaining C2'}</span> : `${uiLanguage === 'es' ? 'Sube de nivel desde ' : 'Level up from '}${level} →`}
      </span>
      <button className="btn btn-gold btn-small" style={{ marginTop: '1.25rem' }} onClick={() => requestExercise(id, level)}>
        {uiLanguage === 'es' ? `Intenta un ejercicio ${level}` : `Try a ${level} exercise`}
      </button>
    </div>
  );
}

export function LevelsSection() {
  const { learningLanguage, uiLanguage } = useLanguage();
  const [assessmentOpen, setAssessmentOpen] = useState(false);
  return (
    <section className="block levels" id="levels">
      <div className="wrap">
        <div className="head">
          <h2>{getString('levels.title', uiLanguage)}</h2>
          <p>
            {getString('levels.description', uiLanguage)}
          </p>
        </div>

        <CefrGuide uiLanguage={uiLanguage} />

        {learningLanguage ? (
          <>
            <span className="eyebrow" style={{ display: 'block', textAlign: 'center', marginBottom: '1.2rem' }}>
              {uiLanguage === 'es' ? 'Modo examen' : 'Exam mode'}
            </span>
            <div className="level-grid">
              {SKILLS.map((s) => (
                <SkillCard key={s.id} id={s.id} sub={s.sub} uiLanguage={uiLanguage} />
              ))}
            </div>
            <p className="footnote">
              <button type="button" className="btn-linklike" onClick={() => setAssessmentOpen(true)} style={{ background: 'none', border: 0, color: 'var(--wine)', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', font: 'inherit' }}>
                {uiLanguage === 'es' ? '¿No sabes tu nivel en una destreza? Haz un test rápido, elige habla, lectura, escucha o escritura' : "Don't know your level in a skill? Take a quick test, choose speaking, reading, listening, or writing"}
              </button>
            </p>
          </>
        ) : (
          <p className="footnote">{getString('levels.selectLanguage', uiLanguage)}</p>
        )}

        <p className="footnote">
          {uiLanguage === 'es'
            ? 'Cuando alcances C2 en cualquier habilidad, el sistema cambia a Mantener en lugar de subir de nivel.'
            : 'When you reach C2 in any skill, the system switches to Maintain instead of level up.'}
        </p>
      </div>
      {assessmentOpen && <AssessmentModal onClose={() => setAssessmentOpen(false)} />}
    </section>
  );
}
