import { generateStructuredJSON, GradingNotConfiguredError } from './aiClient.js';
import { grammarSyntaxLessonSchema, vocabularyLessonSchema, readingLessonSchema, listeningLessonSchema, speakingLessonSchema, writingLessonSchema } from '../schemas/microLessonSchema.js';
import { microLessonSystemPrompt, MicroLessonLanguage, UiLanguage, ClassSkill } from '../prompts/microLessonPrompts.js';
import { CefrLevel } from '../prompts/exercisePrompts.js';

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
interface ComprehensionQuestion {
  question: string;
  options: string[];
  answer: string;
}
interface ReadingComprehensionContent {
  passage: string;
  questions: ComprehensionQuestion[];
}
interface ListeningComprehensionContent {
  transcript: string;
  questions: ComprehensionQuestion[];
}
interface SpeakingPromptContent {
  prompt: string;
  promptTranslation: string;
  modelAnswer: string;
  modelAnswerTranslation: string;
}
interface WritingPromptContent {
  scenario: string;
  register: 'casual' | 'professional';
  instructions: string;
  minWords: number;
  maxWords: number;
}

export type LessonStep =
  | { id: string; type: 'grammar_tip'; content: GrammarTipContent }
  | { id: string; type: 'vocab_match'; content: VocabMatchContent }
  | { id: string; type: 'syntax_reorder'; content: SyntaxReorderContent }
  | { id: string; type: 'error_detection'; content: ErrorDetectionContent }
  | { id: string; type: 'cloze'; content: ClozeContent }
  | { id: string; type: 'reading_comprehension'; content: ReadingComprehensionContent }
  | { id: string; type: 'listening_comprehension'; content: ListeningComprehensionContent }
  | { id: string; type: 'speaking_practice'; content: SpeakingPromptContent }
  | { id: string; type: 'writing_practice'; content: WritingPromptContent };

export interface MicroLesson {
  id: string;
  skill: ClassSkill;
  title: string;
  estimatedMinutes: number;
  grammarConcept: string;
  steps: LessonStep[];
}

const cache = new Map<string, MicroLesson>();

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

// Fixed pedagogical order per skill: explain the concept first, only then test it.
function assembleGrammarSyntaxSteps(raw: any): LessonStep[] {
  return [
    { id: 'grammar_tip', type: 'grammar_tip', content: raw.grammarTip },
    { id: 'syntax_reorder_1', type: 'syntax_reorder', content: raw.syntaxReorder1 },
    { id: 'syntax_reorder_2', type: 'syntax_reorder', content: raw.syntaxReorder2 },
    { id: 'syntax_reorder_3', type: 'syntax_reorder', content: raw.syntaxReorder3 },
    { id: 'error_detection_1', type: 'error_detection', content: raw.errorDetection1 },
    { id: 'error_detection_2', type: 'error_detection', content: raw.errorDetection2 },
    { id: 'error_detection_3', type: 'error_detection', content: raw.errorDetection3 },
    { id: 'cloze_1', type: 'cloze', content: raw.cloze1 },
    { id: 'cloze_2', type: 'cloze', content: raw.cloze2 },
    { id: 'cloze_3', type: 'cloze', content: raw.cloze3 },
  ];
}
function assembleVocabularySteps(raw: any): LessonStep[] {
  return [
    { id: 'grammar_tip', type: 'grammar_tip', content: raw.grammarTip },
    { id: 'vocab_match_1', type: 'vocab_match', content: raw.vocabMatch1 },
    { id: 'vocab_match_2', type: 'vocab_match', content: raw.vocabMatch2 },
    { id: 'cloze_1', type: 'cloze', content: raw.cloze1 },
    { id: 'cloze_2', type: 'cloze', content: raw.cloze2 },
    { id: 'cloze_3', type: 'cloze', content: raw.cloze3 },
    { id: 'cloze_4', type: 'cloze', content: raw.cloze4 },
    { id: 'cloze_5', type: 'cloze', content: raw.cloze5 },
    { id: 'error_detection_1', type: 'error_detection', content: raw.errorDetection1 },
    { id: 'error_detection_2', type: 'error_detection', content: raw.errorDetection2 },
  ];
}
function assembleReadingSteps(raw: any): LessonStep[] {
  return [
    { id: 'grammar_tip', type: 'grammar_tip', content: raw.grammarTip },
    { id: 'reading_1', type: 'reading_comprehension', content: raw.reading1 },
    { id: 'reading_2', type: 'reading_comprehension', content: raw.reading2 },
    { id: 'reading_3', type: 'reading_comprehension', content: raw.reading3 },
    { id: 'reading_4', type: 'reading_comprehension', content: raw.reading4 },
    { id: 'reading_5', type: 'reading_comprehension', content: raw.reading5 },
  ];
}
function assembleListeningSteps(raw: any): LessonStep[] {
  return [
    { id: 'grammar_tip', type: 'grammar_tip', content: raw.grammarTip },
    { id: 'listening_1', type: 'listening_comprehension', content: raw.listening1 },
    { id: 'listening_2', type: 'listening_comprehension', content: raw.listening2 },
    { id: 'listening_3', type: 'listening_comprehension', content: raw.listening3 },
    { id: 'listening_4', type: 'listening_comprehension', content: raw.listening4 },
    { id: 'listening_5', type: 'listening_comprehension', content: raw.listening5 },
  ];
}
function assembleSpeakingSteps(raw: any): LessonStep[] {
  return [
    { id: 'grammar_tip', type: 'grammar_tip', content: raw.grammarTip },
    { id: 'speaking_1', type: 'speaking_practice', content: raw.speakingPrompt1 },
    { id: 'speaking_2', type: 'speaking_practice', content: raw.speakingPrompt2 },
    { id: 'speaking_3', type: 'speaking_practice', content: raw.speakingPrompt3 },
    { id: 'speaking_4', type: 'speaking_practice', content: raw.speakingPrompt4 },
  ];
}
function assembleWritingSteps(raw: any): LessonStep[] {
  return [
    { id: 'grammar_tip', type: 'grammar_tip', content: raw.grammarTip },
    { id: 'writing_1', type: 'writing_practice', content: raw.writingPrompt1 },
    { id: 'writing_2', type: 'writing_practice', content: raw.writingPrompt2 },
    { id: 'writing_3', type: 'writing_practice', content: raw.writingPrompt3 },
    { id: 'writing_4', type: 'writing_practice', content: raw.writingPrompt4 },
  ];
}

export async function getDailyMicroLesson(skill: ClassSkill, learningLanguage: MicroLessonLanguage, uiLanguage: UiLanguage, level: CefrLevel): Promise<MicroLesson> {
  const key = `${todayKey()}:${learningLanguage}:${uiLanguage}:${skill}:${level}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const system = microLessonSystemPrompt(skill, learningLanguage, uiLanguage, level);
  const user = `Generate today's (${todayKey()}) daily practice micro-lesson for the ${skill} skill at CEFR level ${level}.`;

  let raw: any;
  let steps: LessonStep[];
  if (skill === 'grammar_syntax') {
    raw = await generateStructuredJSON<any>({ system, user, schema: grammarSyntaxLessonSchema, schemaName: 'grammar_syntax_lesson' });
    steps = assembleGrammarSyntaxSteps(raw);
  } else if (skill === 'vocabulary') {
    raw = await generateStructuredJSON<any>({ system, user, schema: vocabularyLessonSchema, schemaName: 'vocabulary_lesson' });
    steps = assembleVocabularySteps(raw);
  } else if (skill === 'reading') {
    raw = await generateStructuredJSON<any>({ system, user, schema: readingLessonSchema, schemaName: 'reading_lesson' });
    steps = assembleReadingSteps(raw);
  } else if (skill === 'listening') {
    raw = await generateStructuredJSON<any>({ system, user, schema: listeningLessonSchema, schemaName: 'listening_lesson' });
    steps = assembleListeningSteps(raw);
  } else if (skill === 'speaking') {
    raw = await generateStructuredJSON<any>({ system, user, schema: speakingLessonSchema, schemaName: 'speaking_lesson' });
    steps = assembleSpeakingSteps(raw);
  } else {
    raw = await generateStructuredJSON<any>({ system, user, schema: writingLessonSchema, schemaName: 'writing_lesson' });
    steps = assembleWritingSteps(raw);
  }

  const lesson: MicroLesson = {
    id: key,
    skill,
    title: raw.title,
    estimatedMinutes: 12,
    grammarConcept: raw.grammarConcept,
    steps,
  };

  cache.set(key, lesson);
  return lesson;
}

export { GradingNotConfiguredError as MicroLessonGenerationNotConfiguredError };
