import { type Language } from "~/libs/modules/localization/localization";

/**
 * Example level titles shown as input placeholders, keyed by content language.
 * They do not depend on the UI locale, so they live here once instead of being
 * copied into every locale file.
 */
const TITLE_PLACEHOLDER_EXAMPLES: Record<Language, string> = {
	en: "Find the wrong object",
	es: "Encuentra el objeto incorrecto",
	uk: "Знайди хибне",
};

export { TITLE_PLACEHOLDER_EXAMPLES };
