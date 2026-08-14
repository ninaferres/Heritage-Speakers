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
