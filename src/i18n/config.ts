import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import es from './es.json';
import en from './en.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: es },
      en: { translation: en },
    },
    // Detection order: localStorage → browser language → fallback
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'andrew-myer-lang',
    },
    fallbackLng: 'es',  // default Spanish
    supportedLngs: ['es', 'en'],
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
