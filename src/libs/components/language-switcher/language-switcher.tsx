import { getValidClassNames } from "~/libs/helpers/helpers";
import { useCallback, useMemo, useTranslation } from "~/libs/hooks/hooks";
import {
	type Language,
	LANGUAGE_TO_LABEL,
	useLanguageSwitcher,
} from "~/libs/modules/localization/localization";
import { type ValueOf } from "~/libs/types/types";

import { Dropdown } from "../components";
import { type LanguageSwitcherVariant } from "./language-switcher-variant.enum";
import styles from "./styles.module.css";

type Properties = {
	variant: ValueOf<typeof LanguageSwitcherVariant>;
};

const LanguageSwitcher: React.FC<Properties> = ({ variant }) => {
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
			className={getValidClassNames(styles[variant])}
			onSelect={handleLanguageChange}
			options={options}
			toggleAriaLabel={t("common.localization.selectLanguage")}
			value={currentLanguage}
		/>
	);
};

export { LanguageSwitcher };
