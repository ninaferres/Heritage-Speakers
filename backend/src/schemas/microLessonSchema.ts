/**
 * JSON Schema for the daily "Practica diaria" micro-lesson. Providers used here
 * (Groq json_object mode especially) don't reliably validate polymorphic unions,
 * so the AI fills in one fixed shape with a slot per step type; the generator
 * service assembles those slots into the ordered LessonStep[] the frontend consumes.
 */

const grammarTipSchema = {
  type: 'object',
  properties: {
    title: { type: 'string', description: 'Short name of the grammar/syntax point (e.g. "Verb-subject order").' },
    explanation: { type: 'string', description: 'One or two plain-language sentences explaining the point. No linguistics jargon.' },
    example: { type: 'string', description: 'One short example sentence in the target language illustrating the point.' },
    exampleTranslation: { type: 'string', description: 'Translation of the example sentence into the interface language.' },
  },
  required: ['title', 'explanation', 'example', 'exampleTranslation'],
  additionalProperties: false,
};

const vocabMatchSchema = {
  type: 'object',
  properties: {
    pairs: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          term: { type: 'string', description: 'A word in the target language.' },
          match: { type: 'string', description: 'Its translation into the interface language.' },
        },
        required: ['term', 'match'],
        additionalProperties: false,
      },
      minItems: 5,
      maxItems: 6,
    },
  },
  required: ['pairs'],
  additionalProperties: false,
};

const syntaxWordSchema = {
  type: 'object',
  properties: {
    text: { type: 'string' },
    pos: { type: 'string', enum: ['verb', 'noun', 'other'], description: 'Part of speech, for color-coding: verb, noun, or other.' },
  },
  required: ['text', 'pos'],
  additionalProperties: false,
};

const syntaxReorderSchema = {
  type: 'object',
  properties: {
    instruction: { type: 'string', description: 'Short instruction, e.g. "Order the words into a correct sentence."' },
    words: { type: 'array', items: syntaxWordSchema, minItems: 3, maxItems: 8, description: 'The words of one correct target-language sentence, IN CORRECT ORDER (the frontend shuffles them for display).' },
    translation: { type: 'string', description: 'Translation of the full correct sentence.' },
  },
  required: ['instruction', 'words', 'translation'],
  additionalProperties: false,
};

const errorDetectionSchema = {
  type: 'object',
  properties: {
    words: { type: 'array', items: { type: 'string' }, minItems: 4, maxItems: 10, description: 'The sentence tokenized into words/punctuation, containing exactly one grammatical error.' },
    incorrectWordIndex: { type: 'integer', description: 'Index into "words" of the incorrect word.' },
    correction: { type: 'string', description: 'The correct replacement for that word.' },
    explanation: { type: 'string', description: 'One short sentence explaining why it was wrong.' },
  },
  required: ['words', 'incorrectWordIndex', 'correction', 'explanation'],
  additionalProperties: false,
};

const clozeSchema = {
  type: 'object',
  properties: {
    before: { type: 'string', description: 'The sentence text before the blank.' },
    after: { type: 'string', description: 'The sentence text after the blank.' },
    options: { type: 'array', items: { type: 'string' }, minItems: 4, maxItems: 4, description: 'Four options to fill the blank, exactly one correct.' },
    answer: { type: 'string', description: 'The correct option, verbatim matching one of "options".' },
  },
  required: ['before', 'after', 'options', 'answer'],
  additionalProperties: false,
};

export const microLessonSchema = {
  type: 'object',
  properties: {
    title: { type: 'string', description: 'Short lesson title (2-5 words), in the interface language.' },
    grammarConcept: { type: 'string', description: 'Short name of the single grammar/syntax concept this whole lesson focuses on.' },
    grammarTip: grammarTipSchema,
    vocabMatch: vocabMatchSchema,
    syntaxReorder1: syntaxReorderSchema,
    syntaxReorder2: syntaxReorderSchema,
    errorDetection1: errorDetectionSchema,
    errorDetection2: errorDetectionSchema,
    cloze1: clozeSchema,
    cloze2: clozeSchema,
  },
  required: ['title', 'grammarConcept', 'grammarTip', 'vocabMatch', 'syntaxReorder1', 'syntaxReorder2', 'errorDetection1', 'errorDetection2', 'cloze1', 'cloze2'],
  additionalProperties: false,
};
