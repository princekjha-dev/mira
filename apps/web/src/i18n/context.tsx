import React, { createContext, useContext, useState, useEffect } from 'react';
import enTranslations from './en.json';
import hiTranslations from './hi.json';

import { Language, SUPPORTED_LANGUAGES, regionalTranslations } from './languages';

export type { Language };
export { SUPPORTED_LANGUAGES };

type Translations = Record<string, string>;

const dictionaries: Record<string, Translations> = {
  en: enTranslations,
  hi: hiTranslations,
  ...regionalTranslations,
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode; initialLanguage?: Language }> = ({
  children,
  initialLanguage = 'en',
}) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('mira_lang') as Language | null;
    return (saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved)) ? saved : initialLanguage;
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('mira_lang', lang);
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    const dict = dictionaries[language] || dictionaries.en;
    if (key in dict) {
      return dict[key];
    }
    // Fallback to English
    if (key in dictionaries.en) {
      return dictionaries.en[key];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
