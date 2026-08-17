import { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { fetchDailyMicroLesson } from '../../api/client';
import { MicroLesson, LessonStep, ClassSkill } from '../../data/microLessonTypes';
import { SkillId, CefrLevel } from '../../data/types';
import { CEFR_LEVELS } from '../../data/skills';
import { AnalyzingMessages } from '../ExerciseRunner/AnalyzingMessages';
import { GrammarTipStep } from './GrammarTipStep';
import { VocabMatchStep } from './VocabMatchStep';
import { SyntaxReorderStep } from './SyntaxReorderStep';
import { ErrorDetectionStep } from './ErrorDetectionStep';
import { ClozeStep } from './ClozeStep';
import { ReadingComprehensionStep } from './ReadingComprehensionStep';
import { ListeningComprehensionStep } from './ListeningComprehensionStep';
import { SpeakingPracticeStep } from './SpeakingPracticeStep';
import { WritingPracticeStep } from './WritingPracticeStep';

const CLASS_SKILLS: ClassSkill[] = ['listening', 'reading', 'grammar_syntax', 'vocabulary', 'speaking', 'writing'];

const SKILL_LABEL: Record<ClassSkill, { es: string; en: string }> = {
  listening: { es: 'Escucha', en: 'Listening' },
  reading: { es: 'Lectura', en: 'Reading' },
  grammar_syntax: { es: 'Gramática y sintaxis', en: 'Grammar & Syntax' },
  vocabulary: { es: 'Vocabulario', en: 'Vocabulary' },
  speaking: { es: 'Habla', en: 'Speaking' },
  writing: { es: 'Escritura', en: 'Writing' },
};

// The exam side keeps its own established skill set (Speaking/Reading/Listening/Writing) —
// this bridges the daily-practice skill taxonomy to the closest matching exam skill card.
function mapToExamSkill(skill: ClassSkill): SkillId {
  switch (skill) {
    case 'listening':
      return 'Listening';
    case 'reading':
      return 'Reading';
    case 'vocabulary':
      return 'Reading';
    case 'grammar_syntax':
      return 'Writing';
    case 'speaking':
      return 'Speaking';
    case 'writing':
      return 'Writing';
  }
}

type Phase = 'skill_select' | 'level_select' | 'loading' | 'running' | 'review' | 'results';

export function MicroLessonRunner({ onClose }: { onClose: () => void }) {
  const { uiLanguage, learningLanguage, setLearningLanguage, availableLearningLanguages } = useLanguage();
  const [skill, setSkill] = useState<ClassSkill | null>(null);
  const [level, setLevel] = useState<CefrLevel | null>(null);
  const [lesson, setLesson] = useState<MicroLesson | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>('skill_select');
  const [stepIndex, setStepIndex] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);
  const [missedSteps, setMissedSteps] = useState<LessonStep[]>([]);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [reviewResults, setReviewResults] = useState<boolean[]>([]);
  const [startedAt] = useState(() => Date.now());

  useEffect(() => {
    if (!skill || !level || !learningLanguage) return;
    let cancelled = false;
    setPhase('loading');
    setError(null);
    fetchDailyMicroLesson(skill, learningLanguage, uiLanguage, level)
      .then((l) => {
        if (!cancelled) {
          setLesson(l);
          setPhase('running');
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : (uiLanguage === 'es' ? 'No se pudo cargar la práctica de hoy.' : "Couldn't load today's practice."));
          setPhase('running');
        }
      });
    return () => {
      cancelled = true;
    };
  }, [skill, level, learningLanguage, uiLanguage]);

  function advanceMain(step: LessonStep, correct?: boolean) {
    if (correct !== undefined) {
      setResults((r) => [...r, correct]);
      if (!correct) setMissedSteps((m) => [...m, step]);
    }
    if (!lesson) return;
    if (stepIndex + 1 < lesson.steps.length) {
      setStepIndex((i) => i + 1);
    } else if (missedSteps.length + (correct === false ? 1 : 0) > 0) {
      setPhase('review');
    } else {
      setPhase('results');
    }
  }

  function advanceReview(correct: boolean) {
    setReviewResults((r) => [...r, correct]);
    if (reviewIndex + 1 < missedSteps.length) {
      setReviewIndex((i) => i + 1);
    } else {
      setPhase('results');
    }
  }

  function restart() {
    setSkill(null);
    setLevel(null);
    setLesson(null);
    setError(null);
    setPhase('skill_select');
    setStepIndex(0);
    setResults([]);
    setMissedSteps([]);
    setReviewIndex(0);
    setReviewResults([]);
  }

  function goToExam() {
    if (!lesson) return;
    const examSkill = mapToExamSkill(lesson.skill);
    onClose();
    requestAnimationFrame(() => {
      document.getElementById(`skill-card-${examSkill}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  if (!learningLanguage) {
    const activeLanguages = availableLearningLanguages.filter((l) => l.status === 'active');
    return (
      <div className="exercise-overlay">
        <div className="exercise-card" style={{ maxWidth: '600px' }}>
          <button className="modal-close" aria-label="Close" onClick={onClose}>✕</button>
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--wine-ink)' }}>
            {uiLanguage === 'es' ? 'Elige primero qué idioma quieres aprender' : 'Choose a language to learn first'}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {activeLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLearningLanguage(lang.code)}
                style={{ padding: '1.2rem', border: '2px solid var(--wine)', borderRadius: '12px', background: 'transparent', color: 'var(--wine-ink)', fontWeight: '700', fontSize: '1.1rem', cursor: 'pointer' }}
              >
                {lang.nativeLabel}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'skill_select') {
    return (
      <div className="exercise-overlay">
        <div className="exercise-card" style={{ maxWidth: '600px' }}>
          <button className="modal-close" aria-label="Close" onClick={onClose}>✕</button>
          <h2 style={{ marginBottom: '.6rem', color: 'var(--wine-ink)' }}>
            {uiLanguage === 'es' ? '¿Qué quieres practicar hoy?' : 'What do you want to practice today?'}
          </h2>
          <p style={{ marginBottom: '1.8rem', color: 'var(--muted)' }}>
            {uiLanguage === 'es' ? 'Una práctica corta (10-15 min) centrada solo en esa destreza.' : 'A short (10-15 min) practice focused only on that skill.'}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
            {CLASS_SKILLS.map((s) => (
              <button
                key={s}
                onClick={() => { setSkill(s); setPhase('level_select'); }}
                style={{ padding: '1.5rem', border: '2px solid var(--wine)', borderRadius: '12px', background: 'transparent', color: 'var(--wine-ink)', fontWeight: '600', cursor: 'pointer', fontSize: '1.05rem' }}
              >
                {SKILL_LABEL[s][uiLanguage]}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'level_select') {
    return (
      <div className="exercise-overlay">
        <div className="exercise-card" style={{ maxWidth: '600px' }}>
          <button className="modal-close" aria-label="Close" onClick={onClose}>✕</button>
          <span className="exercise-head-eyebrow">{skill && SKILL_LABEL[skill][uiLanguage]}</span>
          <h2 style={{ marginBottom: '.6rem', color: 'var(--wine-ink)' }}>
            {uiLanguage === 'es' ? '¿Cuál es tu nivel aproximado?' : "What's your approximate level?"}
          </h2>
          <p style={{ marginBottom: '1.8rem', color: 'var(--muted)' }}>
            {uiLanguage === 'es'
              ? 'Así la práctica no repite lo que ya dominas ni te salta cosas que aún no has visto.'
              : "This way the practice won't repeat what you already know or skip ahead of what you haven't seen yet."}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem', marginBottom: '1.4rem' }}>
            {CEFR_LEVELS.map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLevel(lvl)}
                style={{ padding: '1.2rem', border: '2px solid var(--wine)', borderRadius: '12px', background: 'transparent', color: 'var(--wine-ink)', fontWeight: '700', cursor: 'pointer', fontSize: '1.1rem' }}
              >
                {lvl}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="btn-linklike"
            onClick={() => setPhase('skill_select')}
            style={{ background: 'none', border: 0, color: 'var(--wine)', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', font: 'inherit' }}
          >
            {uiLanguage === 'es' ? '← Elegir otra destreza' : '← Choose a different skill'}
          </button>
        </div>
      </div>
    );
  }

  const gradedTotal = lesson ? lesson.steps.filter((s) => s.type !== 'grammar_tip').length : 0;
  const accuracy = results.length > 0 ? Math.round((results.filter(Boolean).length / results.length) * 100) : 0;
  const minutesSpent = Math.max(1, Math.round((Date.now() - startedAt) / 60000));

  function renderStep(step: LessonStep, onComplete: (correct: boolean) => void, onContinue: () => void) {
    switch (step.type) {
      case 'grammar_tip':
        return <GrammarTipStep key={step.id} content={step.content} uiLanguage={uiLanguage} onContinue={onContinue} />;
      case 'vocab_match':
        return <VocabMatchStep key={step.id} content={step.content} uiLanguage={uiLanguage} onComplete={onComplete} />;
      case 'syntax_reorder':
        return <SyntaxReorderStep key={step.id} content={step.content} uiLanguage={uiLanguage} onComplete={onComplete} />;
      case 'error_detection':
        return <ErrorDetectionStep key={step.id} content={step.content} uiLanguage={uiLanguage} onComplete={onComplete} />;
      case 'cloze':
        return <ClozeStep key={step.id} content={step.content} uiLanguage={uiLanguage} onComplete={onComplete} />;
      case 'reading_comprehension':
        return <ReadingComprehensionStep key={step.id} content={step.content} uiLanguage={uiLanguage} onComplete={onComplete} />;
      case 'listening_comprehension':
        return <ListeningComprehensionStep key={step.id} content={step.content} uiLanguage={uiLanguage} learningLanguage={learningLanguage} onComplete={onComplete} />;
      case 'speaking_practice':
        return <SpeakingPracticeStep key={step.id} content={step.content} uiLanguage={uiLanguage} learningLanguage={learningLanguage} level={level!} onComplete={onComplete} />;
      case 'writing_practice':
        return <WritingPracticeStep key={step.id} content={step.content} uiLanguage={uiLanguage} learningLanguage={learningLanguage} level={level!} onComplete={onComplete} />;
    }
  }

  return (
    <div className="exercise-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="exercise-card" role="dialog" aria-modal="true">
        <button className="modal-close" aria-label="Close daily practice" onClick={onClose}>✕</button>

        {phase === 'loading' && (
          <>
            <span className="exercise-head-eyebrow">{skill && SKILL_LABEL[skill][uiLanguage]} · {level}</span>
            <div className="loading-inline" style={{ marginTop: '2rem' }}>
              <span className="spinner" />
              <AnalyzingMessages
                messages={
                  uiLanguage === 'es'
                    ? ['Preparando tu práctica de hoy…', 'Eligiendo el enfoque de hoy…', 'Casi listo…']
                    : ["Preparing today's practice…", "Picking today's focus…", 'Almost ready…']
                }
              />
            </div>
          </>
        )}

        {phase !== 'loading' && error && (
          <>
            <span className="exercise-head-eyebrow">{skill && SKILL_LABEL[skill][uiLanguage]}</span>
            <h2>{uiLanguage === 'es' ? 'No se pudo cargar' : 'Unavailable'}</h2>
            <p className="exercise-meta">{error}</p>
          </>
        )}

        {phase === 'running' && !error && lesson && (
          <>
            <span className="exercise-head-eyebrow">{lesson.grammarConcept}</span>
            <h2 style={{ marginBottom: '.6rem' }}>{lesson.title}</h2>

            <div style={{ display: 'flex', gap: '.4rem', alignItems: 'center', marginBottom: '1.6rem', flexWrap: 'wrap' }}>
              {lesson.steps.map((s, i) => (
                <span key={s.id} className={`micro-step-progress-dot ${i < stepIndex ? 'done' : ''} ${i === stepIndex ? 'current' : ''}`} />
              ))}
            </div>

            {renderStep(
              lesson.steps[stepIndex],
              (correct) => advanceMain(lesson.steps[stepIndex], correct),
              () => advanceMain(lesson.steps[stepIndex])
            )}
          </>
        )}

        {phase === 'review' && !error && lesson && (
          <>
            <span className="exercise-head-eyebrow">{uiLanguage === 'es' ? 'Repaso rápido' : 'Quick review'}</span>
            <h2 style={{ marginBottom: '.4rem' }}>
              {uiLanguage === 'es' ? 'Repasemos lo que fallaste' : "Let's review what you missed"}
            </h2>
            <p className="exercise-meta">
              {reviewIndex + 1} {uiLanguage === 'es' ? 'de' : 'of'} {missedSteps.length}
            </p>
            {renderStep(
              missedSteps[reviewIndex],
              (correct) => advanceReview(correct),
              () => advanceReview(true)
            )}
          </>
        )}

        {phase === 'results' && !error && lesson && (
          <>
            <span className="exercise-head-eyebrow">{uiLanguage === 'es' ? '¡Práctica completada!' : 'Practice complete!'}</span>
            <h2 style={{ marginBottom: '1rem' }}>{lesson.title}</h2>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <div className="exercise-block" style={{ flex: '1 1 140px' }}>
                <h4>{uiLanguage === 'es' ? 'Precisión' : 'Accuracy'}</h4>
                <p style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--wine-ink)', margin: 0 }}>{accuracy}%</p>
                <p style={{ color: 'var(--muted)', margin: 0 }}>
                  {results.filter(Boolean).length}/{gradedTotal} {uiLanguage === 'es' ? 'correctas' : 'correct'}
                </p>
              </div>
              <div className="exercise-block" style={{ flex: '1 1 140px' }}>
                <h4>{uiLanguage === 'es' ? 'Tiempo' : 'Time'}</h4>
                <p style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--wine-ink)', margin: 0 }}>{minutesSpent} min</p>
              </div>
              {reviewResults.length > 0 && (
                <div className="exercise-block" style={{ flex: '1 1 140px' }}>
                  <h4>{uiLanguage === 'es' ? 'Repaso' : 'Review'}</h4>
                  <p style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--wine-ink)', margin: 0 }}>
                    {reviewResults.filter(Boolean).length}/{reviewResults.length}
                  </p>
                </div>
              )}
            </div>

            <p className="exercise-meta">
              {uiLanguage === 'es'
                ? `Hoy trabajaste: ${lesson.grammarConcept}. Repite la práctica cuando quieras para reforzarlo.`
                : `Today's focus: ${lesson.grammarConcept}. Repeat the practice anytime to reinforce it.`}
            </p>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              <button className="btn btn-wine" style={{ flex: '1 1 160px' }} onClick={restart}>
                {uiLanguage === 'es' ? 'Elegir otra destreza' : 'Choose another skill'}
              </button>
              <button className="btn btn-gold" style={{ flex: '1 1 160px' }} onClick={goToExam}>
                {uiLanguage === 'es' ? `Probar el examen de ${SKILL_LABEL[lesson.skill][uiLanguage]}` : `Try the ${SKILL_LABEL[lesson.skill][uiLanguage]} exam`}
              </button>
              <button className="btn btn-outline" style={{ flex: '1 1 160px' }} onClick={onClose}>
                {uiLanguage === 'es' ? 'Cerrar' : 'Close'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
