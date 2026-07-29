/**
 * Learning-language catalog. This selector controls which exercise track the
 * whole app is scoped to (Speaking/Reading/Listening/Writing content, TTS
 * accents, grading prompts), not the UI display language — the UI copy stays
 * in English, matching the existing brand voice.
 *
 * To add a new track later (e.g. Mandarin) once content/prompts exist for
 * it: add an entry here with status 'active', then add its exercise bank
 * under src/data/exercises.<code>.ts and its accent list in
 * data/accents.ts. Everything downstream (Header selector, LevelsSection,
 * exercise runner, backend grading prompts) reads from this catalog and
 * needs no other changes.
 */
export type LanguageStatus = 'active' | 'coming-soon';

export interface LanguageOption {
  code: string;
  label: string;
  nativeLabel: string;
  status: LanguageStatus;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'es', label: 'Spanish', nativeLabel: 'Español', status: 'active' },
  { code: 'zh', label: 'Chinese (Mandarin)', nativeLabel: '中文 (普通话)', status: 'coming-soon' },
];

export const DEFAULT_LANGUAGE_CODE = 'es';

export function getLanguage(code: string): LanguageOption {
  return LANGUAGES.find((l) => l.code === code) ?? LANGUAGES.find((l) => l.code === DEFAULT_LANGUAGE_CODE)!;
}
