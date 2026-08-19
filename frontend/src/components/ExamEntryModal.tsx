import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useExerciseGate } from '../context/ExerciseGateContext';
import { CEFR_LEVELS, SKILLS } from '../data/skills';
import { SkillId } from '../data/types';
import { AssessmentModal } from './Assessment/AssessmentModal';

const SKILL_NAME: Record<SkillId, { es: string; en: string }> = {
  Speaking: { es: 'Habla', en: 'Speaking' },
  Reading: { es: 'Lectura', en: 'Reading' },
  Listening: { es: 'Escucha', en: 'Listening' },
  Writing: { es: 'Escritura', en: 'Writing' },
};

/** Same skill-then-level picker flow as Daily Practice, but for exam mode: picking a level hands
 * off to the existing exercise gate (auth-checked, opens ExerciseRunner directly). */
export function ExamEntryModal({ onClose }: { onClose: () => void }) {
  const { uiLanguage } = useLanguage();
  const { requestExercise } = useExerciseGate();
  const [skill, setSkill] = useState<SkillId | null>(null);
  const [assessmentOpen, setAssessmentOpen] = useState(false);

  if (!skill) {
    return (
      <div className="exercise-overlay">
        <div className="exercise-card" role="dialog" aria-modal="true">
          <button className="modal-close" aria-label="Close" onClick={onClose}>✕</button>
          <div>
            <h2 style={{ marginBottom: '.6rem', color: 'var(--wine-ink)' }}>
              {uiLanguage === 'es' ? '¿Qué destreza quieres examinar?' : 'Which skill do you want to test?'}
            </h2>
            <p style={{ marginBottom: '1.8rem', color: 'var(--muted)' }}>
              {uiLanguage === 'es' ? 'Modo examen, riguroso por nivel CEFR.' : 'Exam mode, rigorous by CEFR level.'}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
              {SKILLS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSkill(s.id)}
                  style={{ padding: '1.5rem', border: '2px solid var(--wine)', borderRadius: '12px', background: 'transparent', color: 'var(--wine-ink)', fontWeight: '600', cursor: 'pointer', fontSize: '1.05rem' }}
                >
                  {SKILL_NAME[s.id][uiLanguage]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="exercise-overlay">
        <div className="exercise-card" role="dialog" aria-modal="true">
          <button className="modal-close" aria-label="Close" onClick={onClose}>✕</button>
          <div>
            <span className="exercise-head-eyebrow">{SKILL_NAME[skill][uiLanguage]}</span>
            <h2 style={{ marginBottom: '.6rem', color: 'var(--wine-ink)' }}>
              {uiLanguage === 'es' ? '¿Cuál es tu nivel aproximado?' : "What's your approximate level?"}
            </h2>
            <p style={{ marginBottom: '1.8rem', color: 'var(--muted)' }}>
              {uiLanguage === 'es'
                ? 'Elige el nivel CEFR que quieres poner a prueba. Puedes cambiarlo cuando quieras.'
                : "Choose the CEFR level you want to test. You can change it any time."}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem', marginBottom: '1.4rem' }}>
              {CEFR_LEVELS.map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => {
                    requestExercise(skill, lvl);
                    onClose();
                  }}
                  style={{ padding: '1.2rem', border: '2px solid var(--wine)', borderRadius: '12px', background: 'transparent', color: 'var(--wine-ink)', fontWeight: '700', cursor: 'pointer', fontSize: '1.1rem' }}
                >
                  {lvl}
                </button>
              ))}
            </div>
            <p style={{ marginBottom: '1.4rem' }}>
              <button
                type="button"
                className="btn-linklike"
                onClick={() => setAssessmentOpen(true)}
                style={{ background: 'none', border: 0, color: 'var(--wine)', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', font: 'inherit' }}
              >
                {uiLanguage === 'es' ? '¿No sabes tu nivel? Haz un test rápido' : "Don't know your level? Take a quick test"}
              </button>
            </p>
            <button
              type="button"
              className="btn-linklike"
              onClick={() => setSkill(null)}
              style={{ background: 'none', border: 0, color: 'var(--wine)', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', font: 'inherit' }}
            >
              {uiLanguage === 'es' ? '← Cambiar destreza' : '← Change skill'}
            </button>
          </div>
        </div>
      </div>
      {assessmentOpen && <AssessmentModal onClose={() => setAssessmentOpen(false)} />}
    </>
  );
}
