// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// Get the saved language preference or default to browser language
const savedLanguage = localStorage.getItem('preferredLanguage');

// Function to convert regional codes to base language
const getBaseLanguage = (lng) => {
  if (!lng) return 'en';
  return lng.split('-')[0]; // Convert 'en-GB' to 'en'
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    // Language detection options
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'preferredLanguage',
      caches: ['localStorage'],
    },
    
    // Force base language - this is the key fix!
    lng: getBaseLanguage(savedLanguage),
    
    interpolation: {
      escapeValue: false,
    },
    
    // Load path
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    
    // Handle language variants
    load: 'languageOnly',
    supportedLngs: ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ar', 'fa', 'tr', 'ur', 'sv', 'pl'],
    nonExplicitSupportedLngs: true,
    
    // Default namespace
    ns: ['common'],
    defaultNS: 'common',
    
    react: {
      useSuspense: true,
    },
    
    // Better error handling
    parseMissingKeyHandler: (key) => {
      console.warn(`Missing translation: ${key}`);
      return key;
    }
  });

// Override the language change to always use base language
i18n.on('languageChanged', (lng) => {
  const baseLng = getBaseLanguage(lng);
  if (lng !== baseLng) {
    i18n.changeLanguage(baseLng);
  }
});

export default i18n;