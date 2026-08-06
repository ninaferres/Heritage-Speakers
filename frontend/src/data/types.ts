export type SkillId = 'Speaking' | 'Reading' | 'Listening' | 'Writing';
export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface OpenQuestion {
  type: 'open';
  question: string;
  hint?: string;
}
export interface MultipleChoiceQuestion {
  type: 'mc';
  question: string;
  options: string[];
  answer: string; // matches one of options verbatim
}
export interface MatchingQuestion {
  type: 'matching';
  question: string;
  pairs: { left: string; right: string }[]; // Shuffled; correct pairing is by index
}
export interface SpeakingAssessmentQuestion {
  type: 'speaking-assessment';
  question: string;
  prompt: string;
  maxDuration: number; // seconds
}
export interface ListeningAssessmentQuestion {
  type: 'listening-assessment';
  question: string;
  audioText: string;
  options: string[];
  answer: string;
}
export type ExerciseQuestion = OpenQuestion | MultipleChoiceQuestion | MatchingQuestion | SpeakingAssessmentQuestion | ListeningAssessmentQuestion;

/** Regional Spanish accent used for Listening TTS audio (advanced levels rotate through these). */
export type AccentId = 'es-ES' | 'es-MX' | 'es-AR' | 'es-CO';

export interface ReadingExercise {
  skill: 'Reading';
  title: string;
  passage: string;
  questions: ExerciseQuestion[];
}
export interface ListeningExercise {
  skill: 'Listening';
  title: string;
  /** Script synthesized via the backend TTS endpoint at runtime — not a static audio file. */
  transcript: string;
  defaultAccent?: AccentId;
  questions: ExerciseQuestion[];
}
export interface WritingExercise {
  skill: 'Writing';
  title: string;
  prompt: string;
  minWords: number;
  maxWords: number;
}
export interface SpeakingExercise {
  skill: 'Speaking';
  title: string;
  prompt: string;
  suggestedDuration: string;
}

export type Exercise = ReadingExercise | ListeningExercise | WritingExercise | SpeakingExercise;
