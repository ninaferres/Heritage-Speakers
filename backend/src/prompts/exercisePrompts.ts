export type SkillId = 'Speaking' | 'Reading' | 'Listening' | 'Writing';
export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
export type ExerciseLanguage = 'es' | 'ru';

const LANGUAGE_NAME: Record<ExerciseLanguage, string> = { es: 'Spanish', ru: 'Russian' };

const REGIONAL_GUIDANCE: Record<string, string> = {
  'es-ES': 'Write in Peninsular Spanish ONLY: use "vosotros" verb forms when addressing a group (never "ustedes" for that), "vale" as a filler word, and Spain-specific vocabulary (camarero not mesero, móvil not celular, ordenador not computadora, coche not carro, zumo not jugo, patatas not papas). Currency: euros. Do NOT use any Latin American vocabulary, diminutives in -ito/-ita as filler, or "ustedes" as the only plural you-form — this must sound like someone from Spain, not Latin America.',
  'ru-RU': 'Write in standard Russian (Moscow/central) with a neutral, clear register.',
};

export function levelGuidance(level: CefrLevel): string {
  switch (level) {
    case 'A1':
      return 'Extremely simple vocabulary and short sentences. Present tense mostly. Everyday survival topics (greetings, family, food, numbers, daily routine).';
    case 'A2':
      return 'Simple vocabulary, short sentences, basic past/future tenses. Everyday topics (shopping, travel basics, describing people/places, simple plans).';
    case 'B1':
      return 'Moderate complexity, connected sentences with common connectors (aunque, por lo tanto, sin embargo / хотя, поэтому, однако). Everyday topics with some opinion/narration (travel stories, hobbies, work, simple opinions with reasons).';
    case 'B2':
      return 'More complex sentence structures, wider vocabulary, ability to discuss abstract-but-everyday topics (technology, social issues, workplace) with nuance and some formal register.';
    case 'C1':
      return 'Sophisticated vocabulary and structures, professional/formal register when appropriate, nuanced argumentation. Real-world professional or civic topics (housing, remote work, negotiations, formal complaints) — NOT academic theory.';
    case 'C2':
      return 'Near-native command: idiomatic expressions, subtle tone, sophisticated but natural discourse. Real-world sophisticated topics (opinion pieces, business/economic analysis, nuanced negotiation) — NOT academic philosophy, literary theory, or linguistics jargon.';
  }
}

const BASE_RULES = `You write CEFR-leveled exercise content for heritage speakers (people who grew up hearing the language at home but need to strengthen specific skills). Follow these rules strictly:
- Content must be practical and grounded in everyday, real-world situations (family, work, shopping, travel, services, social media, current events). NEVER use academic, literary-theory, philosophical, or linguistics jargon (no discussion of literary movements, epistemology, ontology, semiotics, deconstruction, etc.), even at the highest levels — sophistication should come from real-world nuance and vocabulary, not academic abstraction.
- Any number that appears in the text (times, quantities, prices, days, years) must be spelled out as words, never as digits.
- Never use emojis anywhere in the output.
- Output must strictly conform to the provided JSON schema. Do not include any text outside the structured output.
- Do not repeat the exact scenario or wording from prior well-known textbook examples — invent a fresh, specific, concrete situation each time.`;

export function exerciseSystemPrompt(skill: SkillId, level: CefrLevel, language: ExerciseLanguage, accent?: string): string {
  const langName = LANGUAGE_NAME[language];
  const regional = accent ? REGIONAL_GUIDANCE[accent] : undefined;
  const parts = [
    BASE_RULES,
    `Target language: ${langName}.`,
    ...(regional ? [`REGIONAL VARIETY (critical, re-check your draft against this before finalizing): ${regional}`] : []),
    `CEFR level ${level}: ${levelGuidance(level)}`,
  ];

  if (skill === 'Writing') {
    parts.push('Task: create a WRITING exercise — a short prompt asking the student to produce a piece of writing (a message, email, description, opinion, story, etc. appropriate to the level), plus a realistic minWords/maxWords range for that level and prompt.');
  } else if (skill === 'Speaking') {
    parts.push('Task: create a SPEAKING exercise — a short prompt asking the student to speak about something (introduce themselves, describe something, give an opinion, negotiate, present, etc. appropriate to the level), plus a realistic suggestedDuration for that level.');
  } else if (skill === 'Reading') {
    parts.push('Task: create a READING exercise — a short passage (appropriate length and complexity for the level) followed by 2-3 open-ended comprehension questions that can be answered directly from the passage.');
  } else if (skill === 'Listening') {
    parts.push('Task: create a LISTENING exercise — a transcript of a short dialogue or monologue (appropriate length and complexity for the level, written exactly as it should be read aloud) followed by exactly 2 open-ended comprehension questions that can be answered directly from the transcript.');
  }

  if (regional) {
    parts.push(`Before you finalize your answer, re-read the transcript/passage/prompt you wrote and verify every word choice matches this regional variety: ${regional}`);
  }

  return parts.join('\n\n');
}
