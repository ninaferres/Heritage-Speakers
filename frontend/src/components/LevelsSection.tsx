import { useState } from 'react';
import { CEFR_LEVELS, SKILLS } from '../data/skills';
import { CefrLevel, SkillId } from '../data/types';
import { SpeakingIcon, ReadingIcon, ListeningIcon, WritingIcon } from './icons/SkillIcons';
import { useExerciseGate } from '../context/ExerciseGateContext';
import { useLanguage } from '../context/LanguageContext';

const ICONS: Record<SkillId, () => JSX.Element> = {
  Speaking: SpeakingIcon,
  Reading: ReadingIcon,
  Listening: ListeningIcon,
  Writing: WritingIcon,
};

function SkillCard({ id, sub, uiLanguage }: { id: SkillId; sub: string; uiLanguage: 'en' | 'es' }) {
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
    <div className="skill-card">
      <div className="skill-icon"><Icon /></div>
      <h3>{skillNames[id][uiLanguage]}</h3>
      <div className="sub">{sub}</div>
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
        {isMaintain ? <span className="maintain">{uiLanguage === 'es' ? 'Manteniendo C2 ✓' : 'Maintaining C2 ✓'}</span> : `${uiLanguage === 'es' ? 'Sube de nivel desde ' : 'Level up from '}${level} →`}
      </span>
      <button className="btn btn-gold btn-small" style={{ marginTop: '1.25rem' }} onClick={() => requestExercise(id, level)}>
        {uiLanguage === 'es' ? `Intenta un ejercicio ${level}` : `Try a ${level} exercise`}
      </button>
    </div>
  );
}

export function LevelsSection() {
  const { learningLanguage, uiLanguage } = useLanguage();
  return (
    <section className="block levels" id="levels">
      <div className="wrap">
        <div className="head">
          <span className="eyebrow">Your own level in every language</span>
          <h2>You're not one level, you're four</h2>
          <p>
            Define your level for Speaking, Reading, Listening, and Writing on the CEFR scale (A1–C2). Each skill
            progresses on its own. Listening C1 but writing B1? That's the point.
          </p>
        </div>

        {learningLanguage ? (
          <div className="level-grid">
            {SKILLS.map((s) => (
              <SkillCard key={s.id} id={s.id} sub={s.sub} uiLanguage={uiLanguage} />
            ))}
          </div>
        ) : (
          <p className="footnote">Please select a language to learn from the menu to start practicing.</p>
        )}

        <p className="footnote">
          When you reach <b>C2</b> in any skill, the system switches to <b>Maintain</b> instead of level up.
        </p>
      </div>
    </section>
  );
}
