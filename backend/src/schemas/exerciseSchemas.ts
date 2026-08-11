/**
 * JSON Schemas for daily-generated exercises, matching the frontend's src/data/types.ts
 * shapes (minus `skill` and `defaultAccent`, which the backend sets programmatically).
 */

const openQuestionSchema = {
  type: 'object',
  properties: {
    question: { type: 'string' },
    hint: { type: 'string', description: 'A short hint for the student. Empty string if not needed.' },
  },
  required: ['question', 'hint'],
  additionalProperties: false,
};

export const writingExerciseSchema = {
  type: 'object',
  properties: {
    title: { type: 'string', description: 'Short, concrete exercise title (2-4 words).' },
    prompt: { type: 'string', description: 'The writing prompt/instructions given to the student.' },
    minWords: { type: 'integer' },
    maxWords: { type: 'integer' },
  },
  required: ['title', 'prompt', 'minWords', 'maxWords'],
  additionalProperties: false,
};

export const speakingExerciseSchema = {
  type: 'object',
  properties: {
    title: { type: 'string', description: 'Short, concrete exercise title (2-4 words).' },
    prompt: { type: 'string', description: 'The speaking prompt/instructions given to the student.' },
    suggestedDuration: { type: 'string', description: 'A short duration range in the exercise language, e.g. "3-4 minutos".' },
  },
  required: ['title', 'prompt', 'suggestedDuration'],
  additionalProperties: false,
};

export const readingExerciseSchema = {
  type: 'object',
  properties: {
    title: { type: 'string', description: 'Short, concrete exercise title (2-4 words).' },
    passage: { type: 'string', description: 'The reading passage text, in the target language.' },
    questions: { type: 'array', items: openQuestionSchema, minItems: 2, maxItems: 3 },
  },
  required: ['title', 'passage', 'questions'],
  additionalProperties: false,
};

export const listeningExerciseSchema = {
  type: 'object',
  properties: {
    title: { type: 'string', description: 'Short, concrete exercise title (2-4 words).' },
    transcript: { type: 'string', description: 'The dialogue or monologue transcript, in the target language, to be synthesized as audio.' },
    questions: { type: 'array', items: openQuestionSchema, minItems: 2, maxItems: 2 },
  },
  required: ['title', 'transcript', 'questions'],
  additionalProperties: false,
};
