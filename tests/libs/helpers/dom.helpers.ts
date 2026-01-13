/**
 * Handles labels that might have an optional asterisk (for required fields)
 * and ensures the match is anchored to the start of the string.
 * @param text The translation string to match
 */
export const getLabelWithAsterisk = (text: string): RegExp =>
	new RegExp(`^${text}(\\s*\\*)?$`, "i");
