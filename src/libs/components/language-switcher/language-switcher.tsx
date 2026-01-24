import { useCallback, useMemo } from "~/libs/hooks/hooks";
import {
	type Language,
	LANGUAGE_TO_LABEL,
	useLanguageSwitcher,
} from "~/libs/modules/localization/localization";

import { Dropdown } from "../components";

const LanguageSwitcher: React.FC = () => {
	const { availableLanguages, changeLanguage, currentLanguage } = useLanguageSwitcher();

	const handleLanguageChange = useCallback(
		(language: Language): void => {
			void changeLanguage(language);
		},
		[changeLanguage]
	);

	const options = useMemo(
		() =>
			availableLanguages.map((language) => ({
				label: LANGUAGE_TO_LABEL[language],
				value: language,
			})),
		[availableLanguages]
	);

	return <Dropdown onSelect={handleLanguageChange} options={options} value={currentLanguage} />;
};

export { LanguageSwitcher };
