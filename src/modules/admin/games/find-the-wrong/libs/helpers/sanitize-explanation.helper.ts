import { AVAILABLE_LANGUAGES } from "~/libs/modules/localization/localization";

import { type LocalizedString } from "../types/types";

const EMPTY_ENTRIES_COUNT = 0;

type LocalizedExplanationInput = Partial<Record<keyof LocalizedString, string | undefined>>;

const sanitizeExplanation = (
	explanation: LocalizedExplanationInput
): Partial<LocalizedString> | undefined => {
	const entries = AVAILABLE_LANGUAGES.map(
		(lang) => [lang, explanation[lang]?.trim() ?? ""] as const
	).filter(([, value]) => value.length > EMPTY_ENTRIES_COUNT);

	if (entries.length === EMPTY_ENTRIES_COUNT) {
		return undefined;
	}

	return Object.fromEntries(entries) as Partial<LocalizedString>;
};

export { sanitizeExplanation };
