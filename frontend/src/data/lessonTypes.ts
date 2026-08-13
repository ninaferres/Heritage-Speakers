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
