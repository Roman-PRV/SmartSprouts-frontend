import { type Language } from "../enums/language.enum";

type LanguageSwitcher = {
	availableLanguages: Language[];
	changeLanguage: (language: Language) => Promise<void>;
	currentLanguage: Language;
};

type TranslationNamespace = "auth" | "common" | "games" | "home" | "validation";

export { type LanguageSwitcher, type TranslationNamespace };
