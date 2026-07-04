import { z } from "zod";

const BYTES_IN_KILOBYTE = 1024;
const KILOBYTES_IN_MEGABYTE = 1024;
const FIRST_FILE = 0;
const EMPTY = 0;

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

type ImageFileMessages = {
	size: string;
	type: string;
};

const isFileList = (value: unknown): value is FileList =>
	typeof FileList !== "undefined" && value instanceof FileList;

/**
 * Builds a zod schema that accepts an optional uploaded image:
 * - missing / empty FileList → undefined
 * - first file with allowed type and within size limit → File
 * - invalid type / oversize → zod issue (i18n key supplied by the caller)
 *
 * Shared across admin game modules; the validation message keys are passed in
 * so each module keeps its own i18n namespace. Callers that need an enforced
 * upload wrap the result with a `required` transform.
 */
const buildImageFileSchema = (
	maxMegabytes: number,
	messages: ImageFileMessages
): z.ZodType<File | undefined> => {
	const maxBytes = maxMegabytes * KILOBYTES_IN_MEGABYTE * BYTES_IN_KILOBYTE;

	return z.unknown().transform((value, context) => {
		if (!isFileList(value) || value.length === EMPTY) {
			return;
		}

		const file = value.item(FIRST_FILE);

		if (!file) {
			return;
		}

		if (!(ALLOWED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
			context.addIssue({ code: "custom", message: messages.type });

			return z.NEVER;
		}

		if (file.size > maxBytes) {
			context.addIssue({ code: "custom", message: messages.size });

			return z.NEVER;
		}

		return file;
	});
};

export { ALLOWED_IMAGE_TYPES, buildImageFileSchema };
