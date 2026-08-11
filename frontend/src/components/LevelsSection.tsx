import { useState } from 'react';
import { CEFR_LEVELS, SKILLS } from '../data/skills';
import { CefrLevel, SkillId } from '../data/types';
import { SpeakingIcon, ReadingIcon, ListeningIcon, WritingIcon } from './icons/SkillIcons';
import { useExerciseGate } from '../context/ExerciseGateContext';
import { useLanguage } from '../context/LanguageContext';
import { getString } from '../i18n/strings';

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
  return (
    <section className="block levels" id="levels">
      <div className="wrap">
        <div className="head">
          <span className="eyebrow">{getString('levels.eyebrow', uiLanguage)}</span>
          <h2>{getString('levels.title', uiLanguage)}</h2>
          <p>
            {getString('levels.description', uiLanguage)}
          </p>
        </div>

        {learningLanguage ? (
          <div className="level-grid">
            {SKILLS.map((s) => (
              <SkillCard key={s.id} id={s.id} sub={s.sub} uiLanguage={uiLanguage} />
            ))}
          </div>
        ) : (
          <p className="footnote">{getString('levels.selectLanguage', uiLanguage)}</p>
        )}

        <p className="footnote">
          {uiLanguage === 'es'
            ? 'Cuando alcances C2 en cualquier habilidad, el sistema cambia a Mantener en lugar de subir de nivel.'
            : 'When you reach C2 in any skill, the system switches to Maintain instead of level up.'}
        </p>
      </div>
    </section>
  );
}
