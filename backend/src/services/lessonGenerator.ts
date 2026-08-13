import { generateStructuredJSON, GradingNotConfiguredError } from './aiClient.js';
import { lessonSchema } from '../schemas/lessonSchema.js';
import { lessonSystemPrompt, LessonLanguage, UiLanguage } from '../prompts/lessonPrompts.js';

export interface VocabItem {
  word: string;
  translation: string;
  example: string;
  exampleTranslation: string;
}
export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}
export interface Lesson {
  title: string;
  vocabulary: VocabItem[];
  quiz: QuizQuestion[];
}

// Same daily in-memory cache pattern as the exercise generator: one fresh beginner
// lesson per learning-language/interface-language pair per day, no database needed.
const cache = new Map<string, Lesson>();

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function getDailyLesson(learningLanguage: LessonLanguage, uiLanguage: UiLanguage): Promise<Lesson> {
  const key = `${todayKey()}:${learningLanguage}:${uiLanguage}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const system = lessonSystemPrompt(learningLanguage, uiLanguage);
  const user = `Generate today's (${todayKey()}) beginner lesson.`;
  const lesson = await generateStructuredJSON<Lesson>({ system, user, schema: lessonSchema, schemaName: 'lesson' });

  cache.set(key, lesson);
  return lesson;
}

export { GradingNotConfiguredError as LessonGenerationNotConfiguredError };
