import { useCallback, useMemo, useTranslation } from "~/libs/hooks/hooks";
import {
	type Language,
	LANGUAGE_TO_LABEL,
	useLanguageSwitcher,
} from "~/libs/modules/localization/localization";

import { Dropdown } from "../components";

const LanguageSwitcher: React.FC = () => {
	const { t } = useTranslation();
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

	return (
		<Dropdown
			onSelect={handleLanguageChange}
			options={options}
			toggleAriaLabel={t("common.localization.selectLanguage")}
			value={currentLanguage}
		/>
	);
};

export { LanguageSwitcher };
