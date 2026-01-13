import { getValidClassNames } from "~/libs/helpers/helpers";
import { useCallback, useTranslation } from "~/libs/hooks/hooks";
import { Language, useLanguageSwitcher } from "~/libs/modules/localization/localization";

import styles from "./styles.module.css";

const getLanguageLabel = (language: Language): string => {
	const labels: Record<Language, string> = {
		[Language.EN]: "EN",
		[Language.ES]: "ES",
		[Language.UK]: "УКР",
	};

	return labels[language];
};

type LanguageButtonProperties = {
	isActive: boolean;
	language: Language;
	onClick: (language: Language) => void;
};

const LanguageButton: React.FC<LanguageButtonProperties> = ({ isActive, language, onClick }) => {
	const { t } = useTranslation();

	const handleOnClick = useCallback((): void => {
		onClick(language);
	}, [onClick, language]);

	const switchToLabels: Record<Language, string> = {
		[Language.EN]: t("common.localization.switchTo.en"),
		[Language.ES]: t("common.localization.switchTo.es"),
		[Language.UK]: t("common.localization.switchTo.uk"),
	};

	return (
		<button
			aria-current={isActive ? "true" : undefined}
			aria-label={switchToLabels[language]}
			className={getValidClassNames(
				styles["language-switcher__button"],
				isActive && styles["language-switcher__button--active"]
			)}
			onClick={handleOnClick}
			type="button"
		>
			{getLanguageLabel(language)}
		</button>
	);
};

const LanguageSwitcher: React.FC = () => {
	const { availableLanguages, changeLanguage, currentLanguage } = useLanguageSwitcher();

	const handleLanguageChange = useCallback(
		(language: Language): void => {
			void changeLanguage(language);
		},
		[changeLanguage]
	);

	return (
		<div className={styles["language-switcher"]}>
			{availableLanguages.map((language) => (
				<LanguageButton
					isActive={currentLanguage === language}
					key={language}
					language={language}
					onClick={handleLanguageChange}
				/>
			))}
		</div>
	);
};

export { LanguageSwitcher };
