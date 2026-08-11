import { generateStructuredJSON } from './aiClient.js';
import { GradingNotConfiguredError } from './aiClient.js';
import { writingExerciseSchema, speakingExerciseSchema, readingExerciseSchema, listeningExerciseSchema } from '../schemas/exerciseSchemas.js';
import { exerciseSystemPrompt, SkillId, CefrLevel, ExerciseLanguage } from '../prompts/exercisePrompts.js';

interface GeneratedExerciseBase {
  title: string;
}
interface GeneratedWriting extends GeneratedExerciseBase {
  prompt: string;
  minWords: number;
  maxWords: number;
}
interface GeneratedSpeaking extends GeneratedExerciseBase {
  prompt: string;
  suggestedDuration: string;
}
interface GeneratedQuestion {
  question: string;
  hint: string;
}
interface GeneratedReading extends GeneratedExerciseBase {
  passage: string;
  questions: GeneratedQuestion[];
}
interface GeneratedListening extends GeneratedExerciseBase {
  transcript: string;
  questions: GeneratedQuestion[];
}

export type GeneratedExercise =
  | ({ skill: 'Writing' } & GeneratedWriting)
  | ({ skill: 'Speaking' } & GeneratedSpeaking)
  | ({ skill: 'Reading' } & GeneratedReading)
  | ({ skill: 'Listening'; defaultAccent: string } & GeneratedListening);

// Rotates which regional accent a Listening exercise uses by level, mirroring the
// curated static content's rotation, so the AI writes authentic regional flavor
// (voseo for Argentina, jitomate/pesos for Mexico, etc.) instead of generic Spanish.
const SPANISH_ACCENT_BY_LEVEL: Record<CefrLevel, string> = {
  A1: 'es-ES', A2: 'es-MX', B1: 'es-AR', B2: 'es-CO', C1: 'es-ES', C2: 'es-MX',
};
const RUSSIAN_ACCENT_BY_LEVEL: Record<CefrLevel, string> = {
  A1: 'ru-RU', A2: 'ru-Moscow', B1: 'ru-RU', B2: 'ru-Moscow', C1: 'ru-RU', C2: 'ru-Moscow',
};

function accentForLevel(language: ExerciseLanguage, level: CefrLevel): string {
  return language === 'ru' ? RUSSIAN_ACCENT_BY_LEVEL[level] : SPANISH_ACCENT_BY_LEVEL[level];
}

// In-memory cache keyed by day, so every learner sees the same freshly-generated
// exercise for a given skill/level/language on a given day, without needing a database.
// Resets on server restart (Render's free tier spins down when idle) — that's fine,
// it just means an occasional regeneration, not a correctness issue.
const cache = new Map<string, GeneratedExercise>();

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function cacheKey(skill: SkillId, level: CefrLevel, language: ExerciseLanguage): string {
  return `${todayKey()}:${language}:${skill}:${level}`;
}

export async function getDailyExercise(skill: SkillId, level: CefrLevel, language: ExerciseLanguage): Promise<GeneratedExercise> {
  const key = cacheKey(skill, level, language);
  const cached = cache.get(key);
  if (cached) return cached;

  const accent = skill === 'Listening' ? accentForLevel(language, level) : undefined;
  const system = exerciseSystemPrompt(skill, level, language, accent);
  const user = `Generate today's (${todayKey()}) ${skill} exercise for CEFR level ${level}. Make it fresh and different from a typical textbook example.`;

  let generated: GeneratedExercise;
  if (skill === 'Writing') {
    const result = await generateStructuredJSON<GeneratedWriting>({ system, user, schema: writingExerciseSchema, schemaName: 'writing_exercise' });
    generated = { skill: 'Writing', ...result };
  } else if (skill === 'Speaking') {
    const result = await generateStructuredJSON<GeneratedSpeaking>({ system, user, schema: speakingExerciseSchema, schemaName: 'speaking_exercise' });
    generated = { skill: 'Speaking', ...result };
  } else if (skill === 'Reading') {
    const result = await generateStructuredJSON<GeneratedReading>({ system, user, schema: readingExerciseSchema, schemaName: 'reading_exercise' });
    generated = { skill: 'Reading', ...result };
  } else {
    const result = await generateStructuredJSON<GeneratedListening>({ system, user, schema: listeningExerciseSchema, schemaName: 'listening_exercise' });
    generated = { skill: 'Listening', defaultAccent: accent!, ...result };
  }

  cache.set(key, generated);
  return generated;
}

export { GradingNotConfiguredError as ExerciseGenerationNotConfiguredError };
