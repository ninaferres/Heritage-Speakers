import { createContext, useContext, useMemo, useState, ReactNode } from 'react';
import { DEFAULT_UI_LANGUAGE, UILanguageCode, LearningLanguageCode, getLearningLanguages } from '../i18n/languages';

const UI_LANGUAGE_STORAGE_KEY = 'hs.uiLanguage';
const LEARNING_LANGUAGE_STORAGE_KEY = 'hs.learningLanguage';

interface LanguageContextValue {
  uiLanguage: UILanguageCode;
  setUILanguage: (code: UILanguageCode) => void;
  learningLanguage: LearningLanguageCode | null;
  setLearningLanguage: (code: LearningLanguageCode) => void;
  availableLearningLanguages: ReturnType<typeof getLearningLanguages>;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [uiLanguage, setUILanguageState] = useState<UILanguageCode>(() => {
    if (typeof window === 'undefined') return DEFAULT_UI_LANGUAGE;
    const saved = window.localStorage.getItem(UI_LANGUAGE_STORAGE_KEY) as UILanguageCode | null;
    if (saved === 'en' || saved === 'es') return saved;

    // Auto-detect from browser language
    const browserLang = navigator.language || navigator.languages?.[0] || '';
    if (browserLang.startsWith('es')) return 'es';
    return DEFAULT_UI_LANGUAGE;
  });

  const [learningLanguage, setLearningLanguageState] = useState<LearningLanguageCode | null>(() => {
    if (typeof window === 'undefined') return null;
    const saved = window.localStorage.getItem(LEARNING_LANGUAGE_STORAGE_KEY) as LearningLanguageCode | null;
    return saved || null;
  });

  const availableLearningLanguages = useMemo(() => getLearningLanguages(uiLanguage), [uiLanguage]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      uiLanguage,
      setUILanguage: (next: UILanguageCode) => {
        setUILanguageState(next);
        window.localStorage.setItem(UI_LANGUAGE_STORAGE_KEY, next);
        // Reset learning language when UI language changes
        setLearningLanguageState(null);
        window.localStorage.removeItem(LEARNING_LANGUAGE_STORAGE_KEY);
      },
      learningLanguage,
      setLearningLanguage: (next: LearningLanguageCode) => {
        // Verify that this learning language is available for current UI language
        const available = getLearningLanguages(uiLanguage);
        if (available.find((l) => l.code === next && l.status === 'active')) {
          setLearningLanguageState(next);
          window.localStorage.setItem(LEARNING_LANGUAGE_STORAGE_KEY, next);
        }
      },
      availableLearningLanguages,
    }),
    [uiLanguage, learningLanguage, availableLearningLanguages]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
}
