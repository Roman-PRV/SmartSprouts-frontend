/**
 * After a regenerate request the level is re-fetched on an exponential backoff
 * (starting at INITIAL_MS, doubling by BACKOFF_FACTOR up to MAX_MS) until the
 * backend flips `is_stale` to false or TIMEOUT_MS elapses. This client-side
 * polling is a temporary bridge until TTS completion is pushed over WebSockets.
 */
const AUDIO_REGEN_POLL_INITIAL_MS = 1000;
const AUDIO_REGEN_POLL_MAX_MS = 8000;
const AUDIO_REGEN_POLL_BACKOFF_FACTOR = 2;
const AUDIO_REGEN_TIMEOUT_MS = 180_000;

export {
	AUDIO_REGEN_POLL_BACKOFF_FACTOR,
	AUDIO_REGEN_POLL_INITIAL_MS,
	AUDIO_REGEN_POLL_MAX_MS,
	AUDIO_REGEN_TIMEOUT_MS,
};
