import { createContext, useContext, useMemo, useState, ReactNode } from 'react';
import { DEFAULT_LANGUAGE_CODE, getLanguage, LanguageOption } from '../i18n/languages';

const STORAGE_KEY = 'hs.language';

interface LanguageContextValue {
  language: LanguageOption;
  setLanguageCode: (code: string) => void;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [code, setCode] = useState<string>(() => {
    if (typeof window === 'undefined') return DEFAULT_LANGUAGE_CODE;
    return window.localStorage.getItem(STORAGE_KEY) || DEFAULT_LANGUAGE_CODE;
  });

  const value = useMemo<LanguageContextValue>(
    () => ({
      language: getLanguage(code),
      setLanguageCode: (next: string) => {
        const opt = getLanguage(next);
        if (opt.status !== 'active') return; // coming-soon languages can't be selected as the active track yet
        setCode(opt.code);
        window.localStorage.setItem(STORAGE_KEY, opt.code);
      },
    }),
    [code]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
}
