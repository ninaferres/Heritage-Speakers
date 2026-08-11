import { CefrLevel, SkillId } from '../../data/types';
import { useLanguage } from '../../context/LanguageContext';
import { getExercise } from '../../data/exercises.es';
import { useCountdown } from '../../hooks/useCountdown';
import { getString, StringKey } from '../../i18n/strings';
import { WritingRunner } from './WritingRunner';
import { ReadingRunner } from './ReadingRunner';
import { ListeningRunner } from './ListeningRunner';
import { SpeakingRunner } from './SpeakingRunner';

// Missions are short by design (max 5 minutes) so they fit into a quick daily habit
// instead of feeling like a 15-minute academic session.
const SESSION_SECONDS = 5 * 60;

export function ExerciseRunner({ skill, level, onClose }: { skill: SkillId; level: CefrLevel; onClose: () => void }) {
  const { learningLanguage, uiLanguage } = useLanguage();
  const exercise = learningLanguage ? getExercise(learningLanguage, skill, level) : null;
  const { secondsLeft, label: timerLabel, color: timerColor } = useCountdown(SESSION_SECONDS);
  const timeProgress = Math.max(0, Math.min(100, (secondsLeft / SESSION_SECONDS) * 100));

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
            <div style={{ height: '6px', backgroundColor: 'var(--line)', borderRadius: '3px', overflow: 'hidden', marginBottom: '1.2rem' }}>
              <div
                style={{
                  height: '100%',
                  width: `${timeProgress}%`,
                  backgroundColor: timerColor,
                  transition: 'width 1s linear, background-color .3s ease',
                }}
              />
            </div>

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
