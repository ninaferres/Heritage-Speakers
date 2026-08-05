/**
 * UI Language: controls interface language (English or Español)
 * Learning Language: what you want to learn (depends on UI language)
 *
 * UI = English → Learn Spanish
 * UI = Español → Learn Russian
 */
export type UILanguageCode = 'en' | 'es';
export type LearningLanguageCode = 'es' | 'ru' | 'zh';
export type LanguageStatus = 'active' | 'coming-soon';

export interface UILanguage {
  code: UILanguageCode;
  label: string;
  nativeLabel: string;
}

export interface LearningLanguage {
  code: LearningLanguageCode;
  label: string;
  nativeLabel: string;
  status: LanguageStatus;
}

export const UI_LANGUAGES: UILanguage[] = [
  {
    code: 'en',
    label: 'English',
    nativeLabel: 'English',
  },
  {
    code: 'es',
    label: 'Spanish',
    nativeLabel: 'Español',
  },
];

// Available learning languages for each UI language
export const LEARNING_LANGUAGES_BY_UI: Record<UILanguageCode, LearningLanguage[]> = {
  'en': [
    {
      code: 'es',
      label: 'Spanish',
      nativeLabel: 'Español',
      status: 'active',
    },
    {
      code: 'zh',
      label: 'Chinese (Mandarin)',
      nativeLabel: '中文 (普通话)',
      status: 'coming-soon',
    },
  ],
  'es': [
    {
      code: 'ru',
      label: 'Russian',
      nativeLabel: 'Русский',
      status: 'active',
    },
    {
      code: 'zh',
      label: 'Chinese (Mandarin)',
      nativeLabel: '中文 (普通话)',
      status: 'coming-soon',
    },
  ],
};

export const DEFAULT_UI_LANGUAGE: UILanguageCode = 'en';

export function getUILanguage(code: UILanguageCode): UILanguage | undefined {
  return UI_LANGUAGES.find((l) => l.code === code);
}

export function getLearningLanguages(uiCode: UILanguageCode): LearningLanguage[] {
  return LEARNING_LANGUAGES_BY_UI[uiCode] || [];
}

export function getLearningLanguage(uiCode: UILanguageCode, learningCode: LearningLanguageCode): LearningLanguage | undefined {
  return LEARNING_LANGUAGES_BY_UI[uiCode]?.find((l) => l.code === learningCode);
}
