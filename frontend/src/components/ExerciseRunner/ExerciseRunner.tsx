import { CefrLevel, SkillId } from '../../data/types';
import { useLanguage } from '../../context/LanguageContext';
import { getExercise } from '../../data/exercises.es';
import { useCountdown } from '../../hooks/useCountdown';
import { getString, StringKey } from '../../i18n/strings';
import { WritingRunner } from './WritingRunner';
import { ReadingRunner } from './ReadingRunner';
import { ListeningRunner } from './ListeningRunner';
import { SpeakingRunner } from './SpeakingRunner';

const SESSION_SECONDS = 15 * 60;

export function ExerciseRunner({ skill, level, onClose }: { skill: SkillId; level: CefrLevel; onClose: () => void }) {
  const { learningLanguage, uiLanguage } = useLanguage();
  const exercise = learningLanguage ? getExercise(learningLanguage, skill, level) : null;
  const { label: timerLabel, color: timerColor } = useCountdown(SESSION_SECONDS);

  return (
    <div className="exercise-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="exercise-card" role="dialog" aria-modal="true">
        <span className="exercise-timer" style={{ color: timerColor }}>
          ⏱<br />{timerLabel}
        </span>
        <button className="modal-close" aria-label="Close exercise" onClick={onClose}>✕</button>

        {!exercise ? (
          <>
            <span className="exercise-head-eyebrow">{getString(`skill.${skill}` as StringKey, uiLanguage)} · {level}</span>
            <h2>{getString('exercise.notAvailable', uiLanguage)}</h2>
            <p className="exercise-meta">{getString('exercise.tryDifferent', uiLanguage)}</p>
          </>
        ) : (
          <>
            <span className="exercise-head-eyebrow">{getString(`skill.${skill}` as StringKey, uiLanguage)} · {level}</span>
            <h2>{exercise.title}</h2>
            <p className="exercise-meta">CEFR {level} · {getString('exercise.sessionLength', uiLanguage)}</p>

            {exercise.skill === 'Writing' && <WritingRunner exercise={exercise} level={level} />}
            {exercise.skill === 'Reading' && <ReadingRunner exercise={exercise} level={level} />}
            {exercise.skill === 'Listening' && <ListeningRunner exercise={exercise} level={level} learningLanguage={learningLanguage} />}
            {exercise.skill === 'Speaking' && <SpeakingRunner exercise={exercise} level={level} />}
          </>
        )}
      </div>
    </div>
  );
}
