export type ClassSkill = 'listening' | 'reading' | 'grammar_syntax' | 'vocabulary' | 'speaking';

export interface GrammarTipContent {
  title: string;
  explanation: string;
  example: string;
  exampleTranslation: string;
}
export interface VocabMatchContent {
  pairs: { term: string; match: string }[];
}
export interface SyntaxWord {
  text: string;
  pos: 'verb' | 'noun' | 'other';
}
export interface SyntaxReorderContent {
  instruction: string;
  words: SyntaxWord[];
  translation: string;
}
export interface ErrorDetectionContent {
  words: string[];
  incorrectWordIndex: number;
  correction: string;
  explanation: string;
}
export interface ClozeContent {
  before: string;
  after: string;
  options: string[];
  answer: string;
}
export interface ComprehensionQuestion {
  question: string;
  options: string[];
  answer: string;
}
export interface ReadingComprehensionContent {
  passage: string;
  questions: ComprehensionQuestion[];
}
export interface ListeningComprehensionContent {
  transcript: string;
  questions: ComprehensionQuestion[];
}
export interface SpeakingPromptContent {
  prompt: string;
  promptTranslation: string;
  modelAnswer: string;
  modelAnswerTranslation: string;
}

export type LessonStep =
  | { id: string; type: 'grammar_tip'; content: GrammarTipContent }
  | { id: string; type: 'vocab_match'; content: VocabMatchContent }
  | { id: string; type: 'syntax_reorder'; content: SyntaxReorderContent }
  | { id: string; type: 'error_detection'; content: ErrorDetectionContent }
  | { id: string; type: 'cloze'; content: ClozeContent }
  | { id: string; type: 'reading_comprehension'; content: ReadingComprehensionContent }
  | { id: string; type: 'listening_comprehension'; content: ListeningComprehensionContent }
  | { id: string; type: 'speaking_practice'; content: SpeakingPromptContent };

export interface MicroLesson {
  id: string;
  skill: ClassSkill;
  title: string;
  estimatedMinutes: number;
  grammarConcept: string;
  steps: LessonStep[];
}
