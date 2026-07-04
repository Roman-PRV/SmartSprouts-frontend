import { type AudioStatus } from "../types/types";

/**
 * The four states the regenerate control can be in for one (field, locale):
 * `missing` (no audio yet or a failed/absent url) and `stale` are both
 * regeneratable; `fresh` and `generating` are not.
 */
type AudioState = "fresh" | "generating" | "missing" | "stale";

/**
 * Derives the single audio state from the backend status. An absent entry or a
 * null url means the audio was never produced (e.g. a failed TTS job) and must
 * stay regeneratable — treating `undefined` as fresh would strand the admin.
 */
const deriveAudioState = (
	status: AudioStatus | undefined,
	isGenerating: boolean
): AudioState => {
	if (isGenerating) {
		return "generating";
	}

	if (status === undefined || status.url === null) {
		return "missing";
	}

	return status.is_stale ? "stale" : "fresh";
};

export { type AudioState, deriveAudioState };
