import { type Language } from "../enums/language.enum";

type LanguageSwitcher = {
	availableLanguages: Language[];
	changeLanguage: (language: Language) => Promise<void>;
	currentLanguage: Language;
};

export { type LanguageSwitcher };
