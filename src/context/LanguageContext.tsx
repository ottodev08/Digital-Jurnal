import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';
import {
  translations,
  LOCALIZED_PROMPTS,
  LOCALIZED_COLLAB_PROMPTS,
  LOCALIZED_MOODS,
  LOCALIZED_STICKERS,
  LOCALIZED_BADGES,
  TranslationDictionary,
} from '../utils/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof TranslationDictionary) => string;
  currentTranslations: TranslationDictionary;
  prompts: { wizard: string[]; demonHunter: string[] };
  collabPrompts: string[];
  getMood: (score: number, fallbackOrTheme?: string) => string;
  getStickerLabel: (stickerId: string, fallback?: string) => string;
  getBadge: (badgeId: string, fallbackName?: string, fallbackDesc?: string) => { name: string; description: string };
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('magic_journal_language') as Language;
      if (saved && (saved === 'id' || saved === 'en' || saved === 'ja')) {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'id';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('magic_journal_language', lang);
      document.documentElement.lang = lang;
    } catch (e) {
      console.warn('Failed to save language', e);
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const currentTranslations = translations[language] || translations.id;
  const prompts = LOCALIZED_PROMPTS[language] || LOCALIZED_PROMPTS.id;
  const collabPrompts = LOCALIZED_COLLAB_PROMPTS[language] || LOCALIZED_COLLAB_PROMPTS.id;

  const t = (key: keyof TranslationDictionary): string => {
    return currentTranslations[key] || translations.id[key] || key;
  };

  const getMood = (score: number, fallbackOrTheme?: string): string => {
    const raw = (fallbackOrTheme || '').toLowerCase();
    const isHunter =
      raw === 'demon_hunter' ||
      raw.includes('pernapasan') ||
      raw.includes('breathing') ||
      raw.includes('呼吸') ||
      raw.includes('kabut kelam') ||
      raw.includes('dark mist') ||
      raw.includes('闇の霞') ||
      raw.includes('heroik') ||
      raw.includes('kuat') ||
      raw.includes('siaga') ||
      raw.includes('gelisah') ||
      raw.includes('terluka');

    const themeKey = isHunter ? 'demonHunter' : 'wizard';
    const localizedThemeMoods = (LOCALIZED_MOODS[language] || LOCALIZED_MOODS.id)[themeKey];
    const found = localizedThemeMoods.find((m) => m.score === score);
    if (found) return found.name;

    const defaultFound = LOCALIZED_MOODS.id[themeKey].find((m) => m.score === score);
    if (defaultFound) return defaultFound.name;

    return fallbackOrTheme || `Mood ${score}`;
  };

  const getStickerLabel = (stickerId: string, fallback?: string): string => {
    const dict = LOCALIZED_STICKERS[language] || LOCALIZED_STICKERS.id;
    return dict[stickerId] || LOCALIZED_STICKERS.id[stickerId] || fallback || stickerId;
  };

  const getBadge = (
    badgeId: string,
    fallbackName?: string,
    fallbackDesc?: string
  ): { name: string; description: string } => {
    const dict = LOCALIZED_BADGES[language] || LOCALIZED_BADGES.id;
    return (
      dict[badgeId] ||
      LOCALIZED_BADGES.id[badgeId] || {
        name: fallbackName || badgeId,
        description: fallbackDesc || '',
      }
    );
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        currentTranslations,
        prompts,
        collabPrompts,
        getMood,
        getStickerLabel,
        getBadge,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
