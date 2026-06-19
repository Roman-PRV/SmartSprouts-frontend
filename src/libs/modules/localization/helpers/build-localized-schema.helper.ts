import { z } from "zod";

import { AVAILABLE_LANGUAGES, type Language } from "../enums/language.enum";

/**
 * Builds a zod object schema whose keys are all supported `Language` values
 * and whose values are validated by `valueSchema`.
 *
 * `z.object` enforces presence of every key at runtime (unlike `z.record`),
 * and the typed return preserves `{ en, es, uk }` shape so consumers keep
 * exact `Record<Language, …>` inference.
 *
 * Adding a new language to the `Language` enum automatically propagates here.
 */
const buildLocalizedSchema = <TSchema extends z.ZodType>(
	valueSchema: TSchema
): z.ZodObject<Record<Language, TSchema>> => {
	const shape = Object.fromEntries(
		AVAILABLE_LANGUAGES.map((lang) => [lang, valueSchema])
	) as Record<Language, TSchema>;

	return z.object(shape);
};

export { buildLocalizedSchema };
