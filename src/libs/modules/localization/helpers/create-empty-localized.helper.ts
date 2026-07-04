import { AVAILABLE_LANGUAGES, type Language } from "../enums/language.enum";

/**
 * An empty per-locale string record keyed by every supported language. Used for
 * form defaults so adding a locale is picked up automatically, instead of being
 * hand-listed as `{ en: "", es: "", uk: "" }` in each form.
 */
const createEmptyLocalized = (): Record<Language, string> =>
	Object.fromEntries(AVAILABLE_LANGUAGES.map((language) => [language, ""])) as Record<
		Language,
		string
	>;

export { createEmptyLocalized };
