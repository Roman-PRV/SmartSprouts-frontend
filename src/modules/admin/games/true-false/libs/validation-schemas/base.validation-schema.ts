import { z } from "zod";

/**
 * Shared building blocks for the true/false admin form schemas (level image +
 * text, statement). Single source of truth for the limits and message keys that
 * were previously copied across image-level / text-level / statement schemas.
 */

const MAX_TITLE_LENGTH = 255;
const MIN_TITLE_LENGTH = 1;
const MAX_IMAGE_MEGABYTES = 10;

const VALIDATION_MESSAGES = {
	IMAGE_REQUIRED: "admin.trueFalse.validation.imageRequired",
	REQUIRED: "admin.trueFalse.validation.required",
	TOO_LONG: "admin.trueFalse.validation.tooLong",
} as const;

const titleString = z
	.string()
	.trim()
	.min(MIN_TITLE_LENGTH, VALIDATION_MESSAGES.REQUIRED)
	.max(MAX_TITLE_LENGTH, VALIDATION_MESSAGES.TOO_LONG);

export { MAX_IMAGE_MEGABYTES, titleString, VALIDATION_MESSAGES };
