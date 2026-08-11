import { useState } from 'react';
import { SkillId, CefrLevel } from '../../data/types';
import { getAssessmentQuestions } from '../../data/assessment.es';
import { getAssessmentQuestionsRu } from '../../data/assessment.ru';
import { useLanguage } from '../../context/LanguageContext';
import { getString, StringKey } from '../../i18n/strings';
import { evaluateSpeaking } from '../../api/client';
import { MultipleChoiceQuestion } from './MultipleChoiceQuestion';
import { MatchingQuestion } from './MatchingQuestion';
import { SpeakingAssessmentQuestionRunner } from './SpeakingAssessmentQuestionRunner';
import { ListeningAssessmentQuestionRunner } from './ListeningAssessmentQuestionRunner';

const SKILLS: SkillId[] = ['Speaking', 'Reading', 'Listening', 'Writing'];
const LEVELS: CefrLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
// A level only counts as "passed" once the learner clears this share of that level's questions —
// this gates progression so guessing at higher levels can't offset failing the basics.
const PASS_THRESHOLD = 0.7;

interface SpeakingResult {
  cefrEstimate: CefrLevel;
  score: number;
}

type StoredAnswer = string | Record<number, number> | SpeakingResult;

function isSpeakingResult(answer: StoredAnswer | undefined): answer is SpeakingResult {
  return typeof answer === 'object' && answer !== null && 'cefrEstimate' in answer;
}

export function AssessmentModal({ onClose }: { onClose: () => void }) {
  const { learningLanguage, uiLanguage, setLearningLanguage, availableLearningLanguages } = useLanguage();
  const [stage, setStage] = useState<'skill-select' | 'intro' | 'test' | 'result'>('skill-select');
  const [selectedSkill, setSelectedSkill] = useState<SkillId | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, StoredAnswer>>({});
  const [detectedLevel, setDetectedLevel] = useState<CefrLevel | null>(null);
  const [isGradingSpeaking, setIsGradingSpeaking] = useState(false);
  const [speakingError, setSpeakingError] = useState<string | null>(null);

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

  async function handleSpeakingAnswered(audioBlob: Blob) {
    setSpeakingError(null);
    setIsGradingSpeaking(true);
    try {
      const result = await evaluateSpeaking({
        level: currentQuestion.level,
        prompt: ('prompt' in currentQuestion && currentQuestion.prompt) || currentQuestion.question,
        audioBlob,
        learningLanguage,
      });
      setAnswers((prev) => ({ ...prev, [currentQuestionIndex]: { cefrEstimate: result.cefrEstimate, score: result.score } }));
    } catch (e) {
      setSpeakingError(e instanceof Error ? e.message : 'Something went wrong grading your recording.');
    } finally {
      setIsGradingSpeaking(false);
    }
  }

  function handleNext() {
    if (isLastQuestion) {
      calculateLevel();
    } else {
      setCurrentQuestionIndex((i) => i + 1);
    }
  }

  // Placement logic: a level only "counts" once the learner clears PASS_THRESHOLD of ITS
  // questions. We walk the levels in order (A1 -> C2) and stop at the first one that isn't
  // cleared, so a beginner guessing lucky answers at higher levels can never leapfrog a failed
  // foundation — the detected level is always the highest level passed in an unbroken streak.
  function calculateLevel() {
    let highestPassed: CefrLevel = 'A1';

    for (const level of LEVELS) {
      const levelEntries = questions
        .map((q, idx) => ({ q, idx }))
        .filter(({ q }) => q.level === level);

      if (levelEntries.length === 0) continue;

      let correctUnits = 0;
      let totalUnits = 0;

      levelEntries.forEach(({ q, idx }) => {
        const userAnswer = answers[idx];

        if (q.type === 'mc' || q.type === 'listening-assessment') {
          totalUnits += 1;
          if (userAnswer === q.answer) correctUnits += 1;
        } else if (q.type === 'matching') {
          const pairs = q.pairs || [];
          totalUnits += pairs.length;
          const userMatches = userAnswer && typeof userAnswer === 'object' && !isSpeakingResult(userAnswer) ? (userAnswer as Record<number, number>) : {};
          correctUnits += Object.entries(userMatches).filter(([leftIdx, rightIdx]) => rightIdx === Number(leftIdx)).length;
        } else if (q.type === 'speaking-assessment') {
          totalUnits += 1;
          if (isSpeakingResult(userAnswer) && LEVELS.indexOf(userAnswer.cefrEstimate) >= LEVELS.indexOf(level)) {
            correctUnits += 1;
          }
        }
      });

      const levelScore = totalUnits > 0 ? correctUnits / totalUnits : 0;
      if (levelScore >= PASS_THRESHOLD) {
        highestPassed = level;
      } else {
        break;
      }
    }

    setDetectedLevel(highestPassed);
    setStage('result');
  }

  if (!learningLanguage) {
    const activeLanguages = availableLearningLanguages.filter((l) => l.status === 'active');
    return (
      <div className="exercise-overlay">
        <div className="exercise-card" style={{ maxWidth: '600px' }}>
          <button className="modal-close" aria-label="Close" onClick={onClose}>✕</button>
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--wine-ink)' }}>
            {getString('assessment.selectLanguageFirstTitle', uiLanguage)}
          </h2>
          <p style={{ marginBottom: '2rem', color: 'var(--muted)', lineHeight: 1.6 }}>
            {getString('assessment.selectLanguageFirstBody', uiLanguage)}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {activeLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLearningLanguage(lang.code)}
                style={{
                  padding: '1.2rem',
                  border: '2px solid var(--wine)',
                  borderRadius: '12px',
                  background: 'transparent',
                  color: 'var(--wine-ink)',
                  fontWeight: '700',
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  transition: 'all .2s ease',
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
                {lang.nativeLabel}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
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
                {getString(`skill.${skill}` as StringKey, uiLanguage)}
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
            {getString(`skill.${selectedSkill}` as StringKey, uiLanguage)} · CEFR {detectedLevel}
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
              {getString('assessment.basedOnAnswers', uiLanguage)} {getString(`skill.${selectedSkill}` as StringKey, uiLanguage).toLowerCase()} {getString('assessment.yourLevelIs', uiLanguage)} <strong>{detectedLevel}</strong>.
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
              {getString('assessment.testAnother', uiLanguage)}
            </button>
            <button
              className="btn btn-wine"
              onClick={onClose}
              style={{ flex: 1 }}
            >
              {getString('assessment.startExercises', uiLanguage)}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return null;
  }

  const currentAnswer = answers[currentQuestionIndex];
  const isAnswered = currentAnswer !== undefined;

  return (
    <div className="exercise-overlay">
      <div className="exercise-card" style={{ display: 'flex', flexDirection: 'column' }}>
        <button className="modal-close" aria-label="Close" onClick={onClose}>✕</button>

        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--muted)', marginBottom: '1rem' }}>
            {getString('assessment.question', uiLanguage)} {currentQuestionIndex + 1} {getString('assessment.of', uiLanguage)} {totalQuestions} · {getString(`skill.${selectedSkill}` as StringKey, uiLanguage)} · {currentQuestion.level}
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
              selected={typeof currentAnswer === 'string' ? currentAnswer : null}
              onSelect={handleSelectOption}
              disabled={false}
            />
          )}

          {currentQuestion.type === 'matching' && 'pairs' in currentQuestion && (
            <MatchingQuestion
              question={currentQuestion.question}
              pairs={currentQuestion.pairs!}
              selected={currentAnswer && typeof currentAnswer === 'object' && !isSpeakingResult(currentAnswer) ? (currentAnswer as Record<number, number>) : {}}
              onSelect={handleMatchPair}
              disabled={false}
            />
          )}

          {currentQuestion.type === 'speaking-assessment' && 'maxDuration' in currentQuestion && (
            <>
              <SpeakingAssessmentQuestionRunner
                question={currentQuestion as any}
                onAnswered={handleSpeakingAnswered}
                disabled={isGradingSpeaking}
              />
              {isGradingSpeaking && (
                <div className="loading-inline" style={{ marginTop: '1rem' }}>
                  <span className="spinner" /> {getString('speaking.analyzing', uiLanguage)}
                </div>
              )}
              {speakingError && <div className="error-box" style={{ marginTop: '1rem' }}>{speakingError}</div>}
            </>
          )}

          {currentQuestion.type === 'listening-assessment' && 'audioText' in currentQuestion && (
            <ListeningAssessmentQuestionRunner
              question={currentQuestion as any}
              selected={typeof currentAnswer === 'string' ? currentAnswer : null}
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
            disabled={!isAnswered || isGradingSpeaking}
            onClick={handleNext}
          >
            {isLastQuestion ? getString('assessment.finishAndSeeResult', uiLanguage) : getString('assessment.next', uiLanguage)}
          </button>
        </div>
      </div>
    </div>
  );
}
