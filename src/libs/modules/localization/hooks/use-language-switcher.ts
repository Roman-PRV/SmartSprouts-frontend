import { useTranslation } from "~/libs/hooks/hooks";

import { Language } from "../enums/language.enum";
import { type LanguageSwitcher } from "../types/localization.types";

const useLanguageSwitcher = (): LanguageSwitcher => {
	const { i18n } = useTranslation();

	const changeLanguage = async (language: Language): Promise<void> => {
		await i18n.changeLanguage(language);
	};

	return {
		availableLanguages: [Language.ES, Language.EN, Language.UK],
		changeLanguage,
		currentLanguage: i18n.language as Language,
	};
};

export { useLanguageSwitcher };
