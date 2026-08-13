/**
 * JSON Schema for the daily beginner "class" lesson: a short vocabulary
 * teaching block followed by a quiz that tests only what was just taught.
 */

const vocabItemSchema = {
  type: 'object',
  properties: {
    word: { type: 'string', description: 'A single word or very short everyday phrase in the target language.' },
    translation: { type: 'string', description: 'Its translation into the interface language.' },
    example: { type: 'string', description: 'A short, simple example sentence in the target language showing the word in natural use.' },
    exampleTranslation: { type: 'string', description: 'Translation of the example sentence.' },
  },
  required: ['word', 'translation', 'example', 'exampleTranslation'],
  additionalProperties: false,
};

const quizQuestionSchema = {
  type: 'object',
  properties: {
    question: { type: 'string', description: 'A question testing recognition of one of the taught vocabulary words.' },
    options: { type: 'array', items: { type: 'string' }, minItems: 4, maxItems: 4, description: 'Four answer choices, exactly one of which is correct.' },
    answer: { type: 'string', description: 'The correct option, verbatim matching one of the options.' },
  },
  required: ['question', 'options', 'answer'],
  additionalProperties: false,
};

export const lessonSchema = {
  type: 'object',
  properties: {
    title: { type: 'string', description: 'Short lesson topic title (2-4 words), in the interface language.' },
    vocabulary: { type: 'array', items: vocabItemSchema, minItems: 6, maxItems: 8 },
    quiz: { type: 'array', items: quizQuestionSchema, minItems: 5, maxItems: 6 },
  },
  required: ['title', 'vocabulary', 'quiz'],
  additionalProperties: false,
};
