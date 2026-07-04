import { type Language } from "~/libs/modules/localization/localization";

/**
 * Stable key for a single (scope, audio field, locale) triple, used to track
 * per-button generating state in the audio-regen hook. The scope keeps level
 * and per-statement buttons from colliding (e.g. "level" vs "statement:7").
 */
const buildAudioKey = (scope: string, field: string, locale: Language): string =>
	`${scope}:${field}:${locale}`;

export { buildAudioKey };
