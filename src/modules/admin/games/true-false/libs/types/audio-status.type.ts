import { type Language } from "~/libs/modules/localization/localization";

/**
 * Per-locale TTS audio status from the admin API. The backend computes
 * staleness (stored-path hash vs current-text hash); the frontend only reads
 * `is_stale` to drive the regenerate button — it never recomputes the hash.
 */
type AudioStatus = {
	is_stale: boolean;
	url: null | string;
};

type AudioStatusMap = Partial<Record<Language, AudioStatus>>;

export type { AudioStatus, AudioStatusMap };
