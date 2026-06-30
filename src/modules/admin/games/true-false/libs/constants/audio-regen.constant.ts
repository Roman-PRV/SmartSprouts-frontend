/**
 * After a regenerate request, the level is re-fetched up to
 * AUDIO_REGEN_MAX_POLL_ATTEMPTS times, AUDIO_REGEN_POLL_BACKOFF_MS apart, until
 * the backend flips `is_stale` to false. Tunable in one place.
 */
const AUDIO_REGEN_MAX_POLL_ATTEMPTS = 5;
const AUDIO_REGEN_POLL_BACKOFF_MS = 1500;

export { AUDIO_REGEN_MAX_POLL_ATTEMPTS, AUDIO_REGEN_POLL_BACKOFF_MS };
