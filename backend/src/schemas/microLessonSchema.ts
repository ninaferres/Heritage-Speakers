/**
 * JSON Schemas for the daily "Práctica diaria" micro-lesson, one shape per skill.
 * Providers used here (Groq json_object mode especially) don't reliably validate
 * polymorphic unions, so each skill's schema is a fixed object with one slot per
 * interactive block; the generator service assembles those slots into the ordered
 * LessonStep[] the frontend consumes.
 */

const grammarTipSchema = {
  type: 'object',
  properties: {
    title: { type: 'string', description: 'Short name of the concept being taught.' },
    explanation: { type: 'string', description: 'One or two plain-language sentences explaining it. No linguistics jargon.' },
    example: { type: 'string', description: 'One short example sentence in the target language illustrating it.' },
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
    words: { type: 'array', items: { type: 'string' }, minItems: 4, maxItems: 10, description: 'The sentence tokenized into words/punctuation, containing exactly one error.' },
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

const comprehensionQuestionSchema = {
  type: 'object',
  properties: {
    question: { type: 'string' },
    options: { type: 'array', items: { type: 'string' }, minItems: 4, maxItems: 4 },
    answer: { type: 'string', description: 'The correct option, verbatim matching one of "options".' },
  },
  required: ['question', 'options', 'answer'],
  additionalProperties: false,
};

const readingComprehensionSchema = {
  type: 'object',
  properties: {
    passage: { type: 'string', description: 'A short passage (60-100 words) in the target language.' },
    questions: { type: 'array', items: comprehensionQuestionSchema, minItems: 2, maxItems: 2 },
  },
  required: ['passage', 'questions'],
  additionalProperties: false,
};

const listeningComprehensionSchema = {
  type: 'object',
  properties: {
    transcript: { type: 'string', description: 'A short dialogue or monologue (written exactly as it should be read aloud) in the target language.' },
    questions: { type: 'array', items: comprehensionQuestionSchema, minItems: 2, maxItems: 2 },
  },
  required: ['transcript', 'questions'],
  additionalProperties: false,
};

const speakingPromptSchema = {
  type: 'object',
  properties: {
    prompt: { type: 'string', description: 'A short, simple question or instruction, easy enough for a nervous beginner to answer in one or two sentences. MUST be written in the target language\'s native script (e.g. Cyrillic for Russian) — never romanized/transliterated.' },
    promptPhonetic: { type: 'string', description: 'A Latin-alphabet phonetic transliteration of "prompt", to help pronunciation. For a target language that already uses the Latin alphabet (e.g. Spanish), just repeat "prompt" verbatim here.' },
    promptTranslation: { type: 'string', description: 'Translation of the prompt into the interface language.' },
    modelAnswer: { type: 'string', description: 'A short, natural example answer a learner could say. MUST be written in the target language\'s native script (e.g. Cyrillic for Russian) — never romanized/transliterated.' },
    modelAnswerPhonetic: { type: 'string', description: 'A Latin-alphabet phonetic transliteration of "modelAnswer", to help pronunciation. For a target language that already uses the Latin alphabet (e.g. Spanish), just repeat "modelAnswer" verbatim here.' },
    modelAnswerTranslation: { type: 'string', description: 'Translation of the model answer into the interface language.' },
  },
  required: ['prompt', 'promptPhonetic', 'promptTranslation', 'modelAnswer', 'modelAnswerPhonetic', 'modelAnswerTranslation'],
  additionalProperties: false,
};

export const speakingLessonSchema = {
  type: 'object',
  properties: {
    title: { type: 'string', description: 'Short lesson title (2-5 words), in the interface language.' },
    grammarConcept: { type: 'string', description: 'The conversational theme this lesson centers on (e.g. introducing yourself, ordering food, asking for directions).' },
    grammarTip: grammarTipSchema,
    speakingPrompt1: speakingPromptSchema,
    speakingPrompt2: speakingPromptSchema,
    speakingPrompt3: speakingPromptSchema,
    speakingPrompt4: speakingPromptSchema,
  },
  required: ['title', 'grammarConcept', 'grammarTip', 'speakingPrompt1', 'speakingPrompt2', 'speakingPrompt3', 'speakingPrompt4'],
  additionalProperties: false,
};

const writingPromptSchema = {
  type: 'object',
  properties: {
    scenario: { type: 'string', description: 'The situation the learner is writing in response to, in the interface language (e.g. what message they received, or what they need to write).' },
    register: { type: 'string', enum: ['casual', 'professional'], description: 'Whether this should be written in a casual/informal register (like a text message) or a professional one (like a work email).' },
    instructions: { type: 'string', description: 'One sentence, in the interface language, on what the response should cover.' },
    minWords: { type: 'integer', description: 'Minimum word count for this level and task.' },
    maxWords: { type: 'integer', description: 'Maximum word count for this level and task.' },
  },
  required: ['scenario', 'register', 'instructions', 'minWords', 'maxWords'],
  additionalProperties: false,
};

export const writingLessonSchema = {
  type: 'object',
  properties: {
    title: { type: 'string', description: 'Short lesson title (2-5 words), in the interface language.' },
    grammarConcept: { type: 'string', description: 'The everyday writing theme this lesson centers on (e.g. replying to a friend, a short work email).' },
    grammarTip: grammarTipSchema,
    writingPrompt1: writingPromptSchema,
    writingPrompt2: writingPromptSchema,
    writingPrompt3: writingPromptSchema,
    writingPrompt4: writingPromptSchema,
  },
  required: ['title', 'grammarConcept', 'grammarTip', 'writingPrompt1', 'writingPrompt2', 'writingPrompt3', 'writingPrompt4'],
  additionalProperties: false,
};

export const grammarSyntaxLessonSchema = {
  type: 'object',
  properties: {
    title: { type: 'string', description: 'Short lesson title (2-5 words), in the interface language.' },
    grammarConcept: { type: 'string', description: 'The single grammar/syntax concept this lesson focuses on.' },
    grammarTip: grammarTipSchema,
    syntaxReorder1: syntaxReorderSchema,
    syntaxReorder2: syntaxReorderSchema,
    syntaxReorder3: syntaxReorderSchema,
    errorDetection1: errorDetectionSchema,
    errorDetection2: errorDetectionSchema,
    errorDetection3: errorDetectionSchema,
    cloze1: clozeSchema,
    cloze2: clozeSchema,
    cloze3: clozeSchema,
  },
  required: ['title', 'grammarConcept', 'grammarTip', 'syntaxReorder1', 'syntaxReorder2', 'syntaxReorder3', 'errorDetection1', 'errorDetection2', 'errorDetection3', 'cloze1', 'cloze2', 'cloze3'],
  additionalProperties: false,
};

export const vocabularyLessonSchema = {
  type: 'object',
  properties: {
    title: { type: 'string', description: 'Short lesson title (2-5 words), in the interface language.' },
    grammarConcept: { type: 'string', description: 'The vocabulary theme/word family this lesson focuses on.' },
    grammarTip: grammarTipSchema,
    vocabMatch1: vocabMatchSchema,
    vocabMatch2: vocabMatchSchema,
    cloze1: clozeSchema,
    cloze2: clozeSchema,
    cloze3: clozeSchema,
    cloze4: clozeSchema,
    cloze5: clozeSchema,
    errorDetection1: errorDetectionSchema,
    errorDetection2: errorDetectionSchema,
  },
  required: ['title', 'grammarConcept', 'grammarTip', 'vocabMatch1', 'vocabMatch2', 'cloze1', 'cloze2', 'cloze3', 'cloze4', 'cloze5', 'errorDetection1', 'errorDetection2'],
  additionalProperties: false,
};

export const readingLessonSchema = {
  type: 'object',
  properties: {
    title: { type: 'string', description: 'Short lesson title (2-5 words), in the interface language.' },
    grammarConcept: { type: 'string', description: 'The reading strategy or connector-word focus this lesson centers on.' },
    grammarTip: grammarTipSchema,
    reading1: readingComprehensionSchema,
    reading2: readingComprehensionSchema,
    reading3: readingComprehensionSchema,
    reading4: readingComprehensionSchema,
    reading5: readingComprehensionSchema,
  },
  required: ['title', 'grammarConcept', 'grammarTip', 'reading1', 'reading2', 'reading3', 'reading4', 'reading5'],
  additionalProperties: false,
};

export const listeningLessonSchema = {
  type: 'object',
  properties: {
    title: { type: 'string', description: 'Short lesson title (2-5 words), in the interface language.' },
    grammarConcept: { type: 'string', description: 'The listening strategy or connector-word focus this lesson centers on.' },
    grammarTip: grammarTipSchema,
    listening1: listeningComprehensionSchema,
    listening2: listeningComprehensionSchema,
    listening3: listeningComprehensionSchema,
    listening4: listeningComprehensionSchema,
    listening5: listeningComprehensionSchema,
  },
  required: ['title', 'grammarConcept', 'grammarTip', 'listening1', 'listening2', 'listening3', 'listening4', 'listening5'],
  additionalProperties: false,
};
