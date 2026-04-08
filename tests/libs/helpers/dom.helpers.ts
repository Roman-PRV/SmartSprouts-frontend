/**
 * Escapes special regex characters in a string.
 * @param text The string to escape
 */
const escapeRegExp = (text: string): string => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Creates a regular expression to match a field label that might contain an optional asterisk.
 *
 * This is useful in tests when using `getByLabelText` to match labels of required fields,
 * which typically append an asterisk (e.g., "Email *").
 *
 * It handles:
 * 1. Accurately matching the full text of the label (anchored start and end).
 * 2. Optional whitespace followed by an optional asterisk at the end.
 * 3. Case-insensitivity.
 * 4. Escaping special regex characters in the input text to prevent matching errors.
 *
 * @param text The exact translation string or label text to match
 * @returns A RegExp object for matching the label
 */
export const getLabelWithAsterisk = (text: string): RegExp =>
	new RegExp(`^${escapeRegExp(text)}(\\s*\\*)?$`, "i");
