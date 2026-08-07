import { useState } from 'react';
import { SkillId, CefrLevel } from '../../data/types';
import { getAssessmentQuestions } from '../../data/assessment.es';
import { getAssessmentQuestionsRu } from '../../data/assessment.ru';
import { useLanguage } from '../../context/LanguageContext';
import { getString } from '../../i18n/strings';
import { MultipleChoiceQuestion } from './MultipleChoiceQuestion';
import { MatchingQuestion } from './MatchingQuestion';
import { SpeakingAssessmentQuestionRunner } from './SpeakingAssessmentQuestionRunner';
import { ListeningAssessmentQuestionRunner } from './ListeningAssessmentQuestionRunner';
import { ExerciseIntroduction } from './ExerciseIntroduction';
import { exerciseIntros } from '../../data/exerciseIntros';
import { exerciseIntrosRu, getExerciseIntroRu } from '../../data/exerciseIntros.ru';

const SKILLS: SkillId[] = ['Speaking', 'Reading', 'Listening', 'Writing'];
const LEVELS: CefrLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export function AssessmentModal({ onClose }: { onClose: () => void }) {
  const { learningLanguage, uiLanguage } = useLanguage();
  const [stage, setStage] = useState<'skill-select' | 'intro' | 'test' | 'result'>('skill-select');
  const [selectedSkill, setSelectedSkill] = useState<SkillId | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | Record<number, number>>>({});
  const [detectedLevel, setDetectedLevel] = useState<CefrLevel | null>(null);
  const [shownIntroTypes, setShownIntroTypes] = useState<Set<string>>(new Set());

  const getQuestionsFunc = !learningLanguage ? () => [] : (learningLanguage === 'ru' ? getAssessmentQuestionsRu : getAssessmentQuestions);

  const questions = selectedSkill ? LEVELS.flatMap((level, levelIdx) => {
    const qs = getQuestionsFunc(selectedSkill, level);
    return qs.map((q, qIdx) => ({
      ...q,
      level,
      levelIdx,
      id: `${level}-${qIdx}`,
    }));
  }) : [];

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  function handleSelectOption(option: string) {
    setAnswers((prev) => ({ ...prev, [currentQuestionIndex]: option }));
  }

  function handleMatchPair(leftIdx: number, rightIdx: number) {
    setAnswers((prev) => {
      const current = (prev[currentQuestionIndex] || {}) as Record<number, number>;
      return {
        ...prev,
        [currentQuestionIndex]: { ...current, [leftIdx]: rightIdx },
      };
    });
  }

  function handleSpeakingAnswered(audioBlob: Blob) {
    setAnswers((prev) => ({ ...prev, [currentQuestionIndex]: 'recorded' }));
  }

  function shouldShowIntro(): boolean {
    if (!currentQuestion || stage !== 'test') return false;
    // Only show intros for assessment question types that have intros defined
    if (currentQuestion.type !== 'speaking-assessment' && currentQuestion.type !== 'listening-assessment') {
      return false;
    }
    const introKey = `${currentQuestion.type}-${currentQuestion.level}`;
    return !shownIntroTypes.has(introKey);
  }

  function handleIntroComplete() {
    if (!currentQuestion) return;
    const introKey = `${currentQuestion.type}-${currentQuestion.level}`;
    setShownIntroTypes((prev) => new Set([...prev, introKey]));
  }

  function handleNext() {
    if (isLastQuestion) {
      calculateLevel();
    } else {
      setCurrentQuestionIndex((i) => i + 1);
    }
  }

  function calculateLevel() {
    let score = 0;
    let totalCorrect = 0;

    questions.forEach((q, idx) => {
      const userAnswer = answers[idx];
      if (!userAnswer) return;

      if (q.type === 'mc') {
        if (userAnswer === q.answer) {
          totalCorrect++;
        }
      } else if (q.type === 'matching') {
        const userMatches = userAnswer as Record<number, number>;
        const correctPairs = q.pairs ? q.pairs.length : 0;
        const matchedCorrectly = Object.entries(userMatches).filter(([leftIdx, rightIdx]) => {
          return rightIdx === Number(leftIdx);
        }).length;
        totalCorrect += matchedCorrectly;
      } else if (q.type === 'speaking-assessment') {
        if (userAnswer === 'recorded') {
          totalCorrect++;
        }
      } else if (q.type === 'listening-assessment') {
        if (userAnswer === q.answer) {
          totalCorrect++;
        }
      }
    });

    score = Math.round((totalCorrect / questions.length) * 100);

    // Determine level based on score and performance across levels
    let level: CefrLevel = 'A1';
    if (score >= 80) {
      level = 'C2';
    } else if (score >= 70) {
      level = 'C1';
    } else if (score >= 60) {
      level = 'B2';
    } else if (score >= 50) {
      level = 'B1';
    } else if (score >= 40) {
      level = 'A2';
    } else {
      level = 'A1';
    }

    setDetectedLevel(level);
    setStage('result');
  }

  if (!selectedSkill) {
    return (
      <div className="exercise-overlay">
        <div className="exercise-card" style={{ maxWidth: '600px' }}>
          <button className="modal-close" aria-label="Close" onClick={onClose}>✕</button>
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--wine-ink)' }}>
            {getString('assessment.determineLevel', uiLanguage)}
          </h2>
          <p style={{ marginBottom: '2rem', color: 'var(--muted)', lineHeight: 1.6 }}>
            {getString('assessment.choose', uiLanguage)}. {getString('assessment.takes5Minutes', uiLanguage)}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {SKILLS.map((skill) => (
              <button
                key={skill}
                onClick={() => {
                  setSelectedSkill(skill);
                  setStage('test');
                  setCurrentQuestionIndex(0);
                  setAnswers({});
                }}
                style={{
                  padding: '1.5rem',
                  border: '2px solid var(--wine)',
                  borderRadius: '12px',
                  background: 'transparent',
                  color: 'var(--wine-ink)',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all .2s ease',
                  fontSize: '1.05rem',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(107,31,46,.05)';
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--gold)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--wine)';
                }}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'result' && detectedLevel) {
    return (
      <div className="exercise-overlay">
        <div className="exercise-card" style={{ maxWidth: '600px' }}>
          <button className="modal-close" aria-label="Close" onClick={onClose}>✕</button>
          <h2 style={{ marginBottom: '1rem', color: 'var(--wine-ink)', textAlign: 'center' }}>
            {getString('assessment.yourLevel', uiLanguage)}: <span style={{ color: 'var(--gold)', fontSize: '1.4em' }}>{detectedLevel}</span>
          </h2>
          <p style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--muted)' }}>
            {selectedSkill} · CEFR Level {detectedLevel}
          </p>

          <div style={{
            padding: '1.5rem',
            backgroundColor: 'rgba(184,147,90,.1)',
            borderRadius: '12px',
            marginBottom: '2rem',
            borderLeft: '4px solid var(--gold)',
          }}>
            <p style={{ marginBottom: '0.5rem', fontWeight: '600', color: 'var(--wine-ink)' }}>
              📊 {getString('assessment.complete', uiLanguage)}
            </p>
            <p style={{ color: 'var(--charcoal)', lineHeight: 1.6 }}>
              {getString('assessment.basedOnAnswers', uiLanguage)} {selectedSkill.toLowerCase()} {uiLanguage === 'es' ? 'es' : 'level is'} <strong>{detectedLevel}</strong>.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              className="btn btn-outline"
              onClick={() => {
                setStage('skill-select');
                setSelectedSkill(null);
                setCurrentQuestionIndex(0);
                setAnswers({});
                setDetectedLevel(null);
              }}
              style={{ flex: 1 }}
            >
              Test Another Skill
            </button>
            <button
              className="btn btn-wine"
              onClick={onClose}
              style={{ flex: 1 }}
            >
              Start Exercises
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return null;
  }

  if (shouldShowIntro()) {
    const introType = currentQuestion.type;
    const introLevel = currentQuestion.level;
    let intro = null;

    if (learningLanguage === 'ru') {
      intro = getExerciseIntroRu(introType, introLevel);
    } else if (learningLanguage === 'es') {
      const introKey = introType as keyof typeof exerciseIntros;
      intro = exerciseIntros[introKey]?.[introLevel];
    }

    if (intro) {
      return (
        <ExerciseIntroduction
          intro={intro}
          onStartExercise={handleIntroComplete}
        />
      );
    }
  }

  const currentAnswer = answers[currentQuestionIndex];
  const isAnswered = currentAnswer !== undefined;

  return (
    <div className="exercise-overlay">
      <div className="exercise-card" style={{ display: 'flex', flexDirection: 'column' }}>
        <button className="modal-close" aria-label="Close" onClick={onClose}>✕</button>

        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--muted)', marginBottom: '1rem' }}>
            {getString('assessment.question', uiLanguage)} {currentQuestionIndex + 1} {getString('assessment.of', uiLanguage)} {totalQuestions} · {selectedSkill} · {currentQuestion.level}
          </div>
          <div style={{
            height: '6px',
            backgroundColor: 'var(--line)',
            borderRadius: '3px',
            overflow: 'hidden',
          }}>
            <div
              style={{
                height: '100%',
                backgroundColor: 'var(--gold)',
                width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`,
                transition: 'width .3s ease',
              }}
            />
          </div>
        </div>

        <div style={{ flex: 1, marginBottom: '2rem', overflowY: 'auto' }}>
          {currentQuestion.type === 'mc' && 'options' in currentQuestion && (
            <MultipleChoiceQuestion
              question={currentQuestion.question}
              options={currentQuestion.options!}
              selected={(currentAnswer as string) || null}
              onSelect={handleSelectOption}
              disabled={false}
            />
          )}

          {currentQuestion.type === 'matching' && 'pairs' in currentQuestion && (
            <MatchingQuestion
              question={currentQuestion.question}
              pairs={currentQuestion.pairs!}
              selected={(currentAnswer as Record<number, number>) || {}}
              onSelect={handleMatchPair}
              disabled={false}
            />
          )}

          {currentQuestion.type === 'speaking-assessment' && 'maxDuration' in currentQuestion && (
            <SpeakingAssessmentQuestionRunner
              question={currentQuestion as any}
              onAnswered={handleSpeakingAnswered}
              disabled={false}
            />
          )}

          {currentQuestion.type === 'listening-assessment' && 'audioText' in currentQuestion && (
            <ListeningAssessmentQuestionRunner
              question={currentQuestion as any}
              selected={(currentAnswer as string) || null}
              onSelect={handleSelectOption}
              disabled={false}
            />
          )}
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            className="btn btn-outline"
            disabled={currentQuestionIndex === 0}
            onClick={() => setCurrentQuestionIndex((i) => i - 1)}
          >
            {getString('assessment.previous', uiLanguage)}
          </button>
          <button
            className="btn btn-wine"
            style={{ flex: 1 }}
            disabled={!isAnswered}
            onClick={handleNext}
          >
            {isLastQuestion ? getString('assessment.finishAndSeeResult', uiLanguage) : getString('assessment.next', uiLanguage)}
          </button>
        </div>
      </div>
    </div>
  );
}
