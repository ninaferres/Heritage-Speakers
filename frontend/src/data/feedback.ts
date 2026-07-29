import { CefrLevel } from './types';

export interface LinguisticError {
  category: 'grammar' | 'syntax' | 'orthography' | 'vocabulary' | 'verb-tense-mood' | 'preposition' | 'pronunciation' | 'other';
  original: string;
  correction: string;
  explanation: string;
}

/** Shared shape returned by the Writing and Speaking grading endpoints. */
export interface ProductionEvaluation {
  cefrEstimate: CefrLevel;
  score: number; // 0-100
  summary: string;
  errors: LinguisticError[];
  nativeReformulation: string;
  /** Speaking only: notes on pronunciation/accent/stress, empty for Writing. */
  pronunciationNotes: string[];
  /** Speaking only: the Whisper transcript of what was actually said. */
  transcript?: string;
}

export interface QuestionFeedback {
  question: string;
  correct: boolean;
  feedback: string;
  idealAnswer: string;
}

/** Shared shape returned by the Reading and Listening comprehension endpoints. */
export interface ComprehensionEvaluation {
  overallScore: number; // 0-100
  summary: string;
  perQuestion: QuestionFeedback[];
}
