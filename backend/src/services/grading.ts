import { generateStructuredJSON } from './aiClient.js';
import { comprehensionEvaluationSchema, productionEvaluationSchema } from '../schemas/gradingSchemas.js';
import { listeningSystemPrompt, readingSystemPrompt, speakingSystemPrompt, writingSystemPrompt } from '../prompts/systemPrompts.js';
import { transcribeAudio } from './whisper.js';

export interface ProductionEvaluation {
  cefrEstimate: string;
  score: number;
  summary: string;
  errors: Array<{ category: string; original: string; correction: string; explanation: string }>;
  nativeReformulation: string;
  pronunciationNotes: string[];
  transcript?: string;
}

export interface ComprehensionEvaluation {
  overallScore: number;
  summary: string;
  perQuestion: Array<{ question: string; correct: boolean; feedback: string; idealAnswer: string }>;
}

export async function gradeWriting(level: string, prompt: string, text: string): Promise<ProductionEvaluation> {
  return generateStructuredJSON<ProductionEvaluation>({
    system: writingSystemPrompt(level),
    user: `Writing prompt given to the student:\n"""${prompt}"""\n\nStudent's submission:\n"""${text}"""`,
    schema: productionEvaluationSchema,
    schemaName: 'writing_evaluation',
  });
}

export async function gradeSpeaking(
  level: string,
  prompt: string,
  audioBuffer: Buffer,
  filename: string,
  mimeType: string
): Promise<ProductionEvaluation> {
  const transcript = await transcribeAudio(audioBuffer, filename, mimeType);
  const result = await generateStructuredJSON<ProductionEvaluation>({
    system: speakingSystemPrompt(level),
    user: `Speaking prompt given to the student:\n"""${prompt}"""\n\nWhisper transcript of the student's recorded answer:\n"""${transcript}"""`,
    schema: productionEvaluationSchema,
    schemaName: 'speaking_evaluation',
  });
  return { ...result, transcript };
}

interface QuestionInput {
  question: string;
  hint?: string;
}

function formatQnA(questions: QuestionInput[], answers: string[]): string {
  return questions.map((q, i) => `Q${i + 1}: ${q.question}\nStudent answer: ${answers[i] ?? ''}`).join('\n\n');
}

export async function gradeReading(level: string, passage: string, questions: QuestionInput[], answers: string[]): Promise<ComprehensionEvaluation> {
  return generateStructuredJSON<ComprehensionEvaluation>({
    system: readingSystemPrompt(level),
    user: `Passage:\n"""${passage}"""\n\nQuestions and student answers:\n${formatQnA(questions, answers)}`,
    schema: comprehensionEvaluationSchema,
    schemaName: 'reading_evaluation',
  });
}

export async function gradeListening(level: string, transcript: string, questions: QuestionInput[], answers: string[]): Promise<ComprehensionEvaluation> {
  return generateStructuredJSON<ComprehensionEvaluation>({
    system: listeningSystemPrompt(level),
    user: `Audio transcript:\n"""${transcript}"""\n\nQuestions and student answers:\n${formatQnA(questions, answers)}`,
    schema: comprehensionEvaluationSchema,
    schemaName: 'listening_evaluation',
  });
}
