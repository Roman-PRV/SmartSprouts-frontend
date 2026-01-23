import { useCallback } from "~/libs/hooks/hooks";
import { Language, useLanguageSwitcher } from "~/libs/modules/localization/localization";

import { Dropdown } from "../components";

const getLanguageLabel = (language: Language): string => {
	const labels: Record<Language, string> = {
		[Language.EN]: "EN",
		[Language.ES]: "ES",
		[Language.UK]: "УКР",
	};

	return labels[language];
};

const LanguageSwitcher: React.FC = () => {
	const { availableLanguages, changeLanguage, currentLanguage } = useLanguageSwitcher();

	const handleLanguageChange = useCallback(
		(language: Language): void => {
			void changeLanguage(language);
		},
		[changeLanguage]
	);

	const options = availableLanguages.map((language) => ({
		label: getLanguageLabel(language),
		value: language,
	}));

	return <Dropdown onSelect={handleLanguageChange} options={options} value={currentLanguage} />;
};

export { LanguageSwitcher };
