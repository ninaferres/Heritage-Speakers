import { generateStructuredJSON, GradingNotConfiguredError } from './aiClient.js';
import { microLessonSchema } from '../schemas/microLessonSchema.js';
import { microLessonSystemPrompt, MicroLessonLanguage, UiLanguage } from '../prompts/microLessonPrompts.js';

interface GrammarTipContent {
  title: string;
  explanation: string;
  example: string;
  exampleTranslation: string;
}
interface VocabMatchContent {
  pairs: { term: string; match: string }[];
}
interface SyntaxWord {
  text: string;
  pos: 'verb' | 'noun' | 'other';
}
interface SyntaxReorderContent {
  instruction: string;
  words: SyntaxWord[];
  translation: string;
}
interface ErrorDetectionContent {
  words: string[];
  incorrectWordIndex: number;
  correction: string;
  explanation: string;
}
interface ClozeContent {
  before: string;
  after: string;
  options: string[];
  answer: string;
}

export type LessonStep =
  | { id: string; type: 'grammar_tip'; content: GrammarTipContent }
  | { id: string; type: 'vocab_match'; content: VocabMatchContent }
  | { id: string; type: 'syntax_reorder'; content: SyntaxReorderContent }
  | { id: string; type: 'error_detection'; content: ErrorDetectionContent }
  | { id: string; type: 'cloze'; content: ClozeContent };

export interface MicroLesson {
  id: string;
  title: string;
  estimatedMinutes: number;
  grammarConcept: string;
  steps: LessonStep[];
}

interface RawMicroLesson {
  title: string;
  grammarConcept: string;
  grammarTip: GrammarTipContent;
  vocabMatch: VocabMatchContent;
  syntaxReorder1: SyntaxReorderContent;
  syntaxReorder2: SyntaxReorderContent;
  errorDetection1: ErrorDetectionContent;
  errorDetection2: ErrorDetectionContent;
  cloze1: ClozeContent;
  cloze2: ClozeContent;
}

// Same daily in-memory cache pattern as the other generators: one fresh micro-lesson
// per learning-language/interface-language pair per day, no database needed.
const cache = new Map<string, MicroLesson>();

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

// Fixed pedagogical order: explain the concept and its vocabulary first, only then
// test it — mirrors the "never test without context first" rule from the prompt.
function assembleSteps(raw: RawMicroLesson): LessonStep[] {
  return [
    { id: 'grammar_tip', type: 'grammar_tip', content: raw.grammarTip },
    { id: 'vocab_match', type: 'vocab_match', content: raw.vocabMatch },
    { id: 'syntax_reorder_1', type: 'syntax_reorder', content: raw.syntaxReorder1 },
    { id: 'syntax_reorder_2', type: 'syntax_reorder', content: raw.syntaxReorder2 },
    { id: 'error_detection_1', type: 'error_detection', content: raw.errorDetection1 },
    { id: 'error_detection_2', type: 'error_detection', content: raw.errorDetection2 },
    { id: 'cloze_1', type: 'cloze', content: raw.cloze1 },
    { id: 'cloze_2', type: 'cloze', content: raw.cloze2 },
  ];
}

export async function getDailyMicroLesson(learningLanguage: MicroLessonLanguage, uiLanguage: UiLanguage): Promise<MicroLesson> {
  const key = `${todayKey()}:${learningLanguage}:${uiLanguage}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const system = microLessonSystemPrompt(learningLanguage, uiLanguage);
  const user = `Generate today's (${todayKey()}) daily practice micro-lesson.`;
  const raw = await generateStructuredJSON<RawMicroLesson>({ system, user, schema: microLessonSchema, schemaName: 'micro_lesson' });

  const lesson: MicroLesson = {
    id: key,
    title: raw.title,
    estimatedMinutes: 12,
    grammarConcept: raw.grammarConcept,
    steps: assembleSteps(raw),
  };

  cache.set(key, lesson);
  return lesson;
}

export { GradingNotConfiguredError as MicroLessonGenerationNotConfiguredError };
