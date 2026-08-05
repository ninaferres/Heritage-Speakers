import { useState } from 'react';
import { CefrLevel, SkillId } from '../../data/types';
import { useLanguage } from '../../context/LanguageContext';
import { getExercise } from '../../data/exercises.es';
import { useCountdown } from '../../hooks/useCountdown';
import { WritingRunner } from './WritingRunner';
import { ReadingRunner } from './ReadingRunner';
import { ListeningRunner } from './ListeningRunner';
import { SpeakingRunner } from './SpeakingRunner';
import { ExerciseIntroduction } from '../Assessment/ExerciseIntroduction';
import { exerciseIntros } from '../../data/exerciseIntros';
import { exerciseIntrosRu, getExerciseIntroRu } from '../../data/exerciseIntros.ru';

const SESSION_SECONDS = 15 * 60;

export function ExerciseRunner({ skill, level, onClose }: { skill: SkillId; level: CefrLevel; onClose: () => void }) {
  const { learningLanguage } = useLanguage();
  const exercise = learningLanguage ? getExercise(learningLanguage, skill, level) : null;
  const { label: timerLabel, color: timerColor } = useCountdown(SESSION_SECONDS);
  const [showIntro, setShowIntro] = useState(true);

  if (showIntro && exercise && learningLanguage) {
    const skillLower = skill.toLowerCase();
    let intro = null;

    if (learningLanguage === 'ru') {
      intro = getExerciseIntroRu(skillLower, level);
    } else if (learningLanguage === 'es') {
      const skillKey = skillLower as keyof typeof exerciseIntros;
      intro = exerciseIntros[skillKey]?.[level];
    }

    if (intro) {
      return (
        <ExerciseIntroduction
          intro={intro}
          onStartExercise={() => setShowIntro(false)}
        />
      );
    }
  }

  return (
    <div className="exercise-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="exercise-card" role="dialog" aria-modal="true">
        <span className="exercise-timer" style={{ color: timerColor }}>
          ⏱<br />{timerLabel}
        </span>
        <button className="modal-close" aria-label="Close exercise" onClick={onClose}>✕</button>

        {!exercise ? (
          <>
            <span className="exercise-head-eyebrow">{skill} · {level}</span>
            <h2>Exercise not available yet</h2>
            <p className="exercise-meta">We're still building out content for this combination. Try a different level for now.</p>
          </>
        ) : (
          <>
            <span className="exercise-head-eyebrow">{skill} · {level}</span>
            <h2>{exercise.title}</h2>
            <p className="exercise-meta">CEFR {level} · 15-minute session</p>

            {exercise.skill === 'Writing' && <WritingRunner exercise={exercise} level={level} />}
            {exercise.skill === 'Reading' && <ReadingRunner exercise={exercise} level={level} />}
            {exercise.skill === 'Listening' && <ListeningRunner exercise={exercise} level={level} />}
            {exercise.skill === 'Speaking' && <SpeakingRunner exercise={exercise} level={level} />}
          </>
        )}
      </div>
    </div>
  );
}
