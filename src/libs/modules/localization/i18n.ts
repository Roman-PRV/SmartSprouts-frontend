import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import { Language } from "./enums/language.enum";
import { en } from "./locales/en";
import { es } from "./locales/es";
import { uk } from "./locales/uk";

void i18n
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		debug: import.meta.env.DEV,
		fallbackLng: Language.ES,
		interpolation: {
			escapeValue: false,
		},
		resources: {
			en: { translation: en },
			es: { translation: es },
			uk: { translation: uk },
		},
	});

export { default as i18n } from "i18next";
