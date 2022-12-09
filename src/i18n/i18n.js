import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import pl from './locales/pl.json';


// const DETECTION_OPTIONS = {
//     order: ['navigator']
// };

const resources = {
    en: {
        translation: en
    },
    pl: {
        translation: pl
    }
};
i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        // detection: DETECTION_OPTIONS,
        resources,
        // lng: "pl",
        fallbackLng: "en",
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;