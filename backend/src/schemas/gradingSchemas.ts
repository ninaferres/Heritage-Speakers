/**
 * JSON Schemas shared by both AI providers to force structured, hallucination-resistant
 * output: Anthropic via tool-use (input_schema) and OpenAI via response_format
 * json_schema. Keep these in lockstep with the frontend's src/data/feedback.ts types.
 */

const errorItemSchema = {
  type: 'object',
  properties: {
    category: {
      type: 'string',
      enum: ['grammar', 'syntax', 'orthography', 'vocabulary', 'verb-tense-mood', 'preposition', 'pronunciation', 'other'],
    },
    original: { type: 'string', description: 'The exact erroneous fragment as written/said by the student.' },
    correction: { type: 'string', description: 'The corrected version of that fragment.' },
    explanation: { type: 'string', description: 'A short, clear linguistic explanation of why it is an error.' },
  },
  required: ['category', 'original', 'correction', 'explanation'],
  additionalProperties: false,
};

export const productionEvaluationSchema = {
  type: 'object',
  properties: {
    cefrEstimate: { type: 'string', enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] },
    score: { type: 'integer', minimum: 0, maximum: 100 },
    summary: { type: 'string', description: 'A concise, academic 2-3 sentence overview of performance.' },
    errors: { type: 'array', items: errorItemSchema },
    nativeReformulation: { type: 'string', description: 'A natural, native-level rewrite of the submission.' },
    pronunciationNotes: {
      type: 'array',
      items: { type: 'string' },
      description: 'Notes on pronunciation, accent, stress and phonetic accuracy. Empty array if not applicable (text-only submissions).',
    },
  },
  required: ['cefrEstimate', 'score', 'summary', 'errors', 'nativeReformulation', 'pronunciationNotes'],
  additionalProperties: false,
};

export const comprehensionEvaluationSchema = {
  type: 'object',
  properties: {
    overallScore: { type: 'integer', minimum: 0, maximum: 100 },
    summary: { type: 'string', description: 'A concise, academic overview of comprehension performance.' },
    perQuestion: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          question: { type: 'string' },
          correct: { type: 'boolean' },
          feedback: { type: 'string', description: 'Explanation referencing syntax, cohesion, false friends or contextual vocabulary as relevant.' },
          idealAnswer: { type: 'string' },
        },
        required: ['question', 'correct', 'feedback', 'idealAnswer'],
        additionalProperties: false,
      },
    },
  },
  required: ['overallScore', 'summary', 'perQuestion'],
  additionalProperties: false,
};
