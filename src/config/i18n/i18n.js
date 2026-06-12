import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector'; // 1. استيراد المكتشف

// استيراد ملفات الترجمة
import enTranslation from '../../locals/en/translation.json';
import arTranslation from '../../locals/ar/translation.json';

i18n
  .use(LanguageDetector) // 2. تفعيل المكتشف
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      ar: { translation: arTranslation }
    },
    // lng: 'en', // 3. قم بحذف هذا السطر نهائياً
    fallbackLng: 'en',
    detection: {
      // إعدادات الحفظ في المتصفح
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'], 
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;