// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// Get the saved language preference or default to browser language
const savedLanguage = localStorage.getItem('preferredLanguage');

i18n
  // Load translation using http -> see /public/locales
  .use(Backend)
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // init i18next
  .init({
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    // Language detection options
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'preferredLanguage',
      caches: ['localStorage'],
    },
    
    // Language to use if detection fails
    lng: savedLanguage || undefined,
    
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    
    // IMPORTANT: Change this path for HashRouter
    backend: {
      loadPath: './locales/{{lng}}/{{ns}}.json', // Use relative path with ./ instead of /
    },
    
    // Default namespace
    ns: ['common'],
    defaultNS: 'common',
    
    // Use react's Suspense
    react: {
      useSuspense: true,
    },
  });

export default i18n;