import { useTranslation } from "~/libs/hooks/hooks";

import { AVAILABLE_LANGUAGES, Language } from "../enums/language.enum";
import { type LanguageSwitcher } from "../types/localization.types";

const useLanguageSwitcher = (): LanguageSwitcher => {
	const { i18n } = useTranslation();

	const changeLanguage = async (language: Language): Promise<void> => {
		await i18n.changeLanguage(language);
	};

	const isSupportedLanguage = AVAILABLE_LANGUAGES.includes(i18n.language as Language);

	return {
		availableLanguages: AVAILABLE_LANGUAGES,
		changeLanguage,
		currentLanguage: isSupportedLanguage ? (i18n.language as Language) : Language.EN,
	};
};

export { useLanguageSwitcher };
