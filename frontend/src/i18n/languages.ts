/**
 * Paired language tracks: UI language + Learning language
 * When user selects "Español" interface → learns Russian
 * When user selects "English" interface → learns Spanish
 */
export type LanguageStatus = 'active' | 'coming-soon';

export interface LanguageOption {
  code: string;                    // Unique code for this pair
  uiLabel: string;                 // UI language display name (in English)
  uiNativeLabel: string;           // UI language display name (native)
  learningCode: string;            // Learning language code
  learningLabel: string;           // Learning language name
  learningNativeLabel: string;     // Learning language name (native)
  status: LanguageStatus;
}

export const LANGUAGES: LanguageOption[] = [
  {
    code: 'en-es',
    uiLabel: 'English',
    uiNativeLabel: 'English',
    learningCode: 'es',
    learningLabel: 'Spanish',
    learningNativeLabel: 'Español',
    status: 'active',
  },
  {
    code: 'es-ru',
    uiLabel: 'Spanish',
    uiNativeLabel: 'Español',
    learningCode: 'ru',
    learningLabel: 'Russian',
    learningNativeLabel: 'Русский',
    status: 'active',
  },
  {
    code: 'en-zh',
    uiLabel: 'English',
    uiNativeLabel: 'English',
    learningCode: 'zh',
    learningLabel: 'Chinese (Mandarin)',
    learningNativeLabel: '中文 (普通话)',
    status: 'coming-soon',
  },
];

export const DEFAULT_LANGUAGE_CODE = 'en-es'; // Default: English UI, learn Spanish

export function getLanguage(code: string): LanguageOption {
  return LANGUAGES.find((l) => l.code === code) ?? LANGUAGES.find((l) => l.code === DEFAULT_LANGUAGE_CODE)!;
}

export function getLanguagesByUI(uiCode: string): LanguageOption[] {
  return LANGUAGES.filter((l) => {
    const uiPart = l.code.split('-')[0];
    return uiPart === uiCode;
  });
}
