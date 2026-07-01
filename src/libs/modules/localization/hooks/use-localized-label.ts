import { useCallback, useTranslation } from "~/libs/hooks/hooks";

import { type Language } from "../enums/language.enum";

/**
 * Returns a per-locale label getter for an i18n key prefix, e.g.
 * `useLocalizedLabel("admin.trueFalse.level.fields.title")(lang)` resolves
 * `t("admin.trueFalse.level.fields.title.uk")`. Replaces the repeated
 * getXLabel useCallback declared in each localized form.
 */
const useLocalizedLabel = (prefix: string): ((language: Language) => string) => {
	const { t } = useTranslation();

	return useCallback((language: Language) => t(`${prefix}.${language}`), [prefix, t]);
};

export { useLocalizedLabel };
