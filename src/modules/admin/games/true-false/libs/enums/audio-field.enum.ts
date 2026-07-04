/**
 * Backend audio-URL field names used for TTS regeneration and per-locale audio
 * status maps. Single source of truth: forms and the audio hook reference these
 * instead of loose string literals, so a rename can't silently desync.
 */
const AudioField = {
	EXPLANATION: "explanation_audio_url",
	STATEMENT: "statement_audio_url",
	TEXT: "text_audio_url",
	TITLE: "title_audio_url",
} as const;

export { AudioField };
