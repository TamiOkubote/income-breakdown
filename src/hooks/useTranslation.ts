import { useState, useEffect } from 'react';
import { getTranslation, Language, TranslationKey } from '@/lib/translations';

export const useTranslation = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');

  useEffect(() => {
    // Get language from saved settings
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        if (settings.language) {
          setCurrentLanguage(settings.language);
        }
      } catch (error) {
        console.error('Error parsing saved settings:', error);
      }
    }
  }, []);

  const t = (key: TranslationKey): string => {
    return getTranslation(key, currentLanguage);
  };

  const updateLanguage = (language: Language) => {
    setCurrentLanguage(language);
  };

  return { t, currentLanguage, updateLanguage };
};