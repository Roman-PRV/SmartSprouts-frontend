import { z } from "zod";

import { buildLocalizedSchema } from "~/libs/modules/localization/localization";
import { buildImageFileSchema } from "~/libs/validation-schemas/image-file.schema";

import { IMAGE_FILE_MESSAGES } from "./image-file-messages";

const MAX_TITLE_LENGTH = 255;
const MIN_TITLE_LENGTH = 1;
const MIN_TEXT_LENGTH = 1;
const MAX_TEXT_LENGTH = 2000;
const MAX_IMAGE_MEGABYTES = 10;

const VALIDATION_MESSAGES = {
	REQUIRED: "admin.trueFalse.validation.required",
	TOO_LONG: "admin.trueFalse.validation.tooLong",
} as const;

const titleString = z
	.string()
	.trim()
	.min(MIN_TITLE_LENGTH, VALIDATION_MESSAGES.REQUIRED)
	.max(MAX_TITLE_LENGTH, VALIDATION_MESSAGES.TOO_LONG);

const bodyString = z
	.string()
	.trim()
	.min(MIN_TEXT_LENGTH, VALIDATION_MESSAGES.REQUIRED)
	.max(MAX_TEXT_LENGTH, VALIDATION_MESSAGES.TOO_LONG);

const textLevelValidationSchema = z.object({
	// Image is optional for the text game (the statement is the focus).
	image: buildImageFileSchema(MAX_IMAGE_MEGABYTES, IMAGE_FILE_MESSAGES),
	text: buildLocalizedSchema(bodyString),
	title: buildLocalizedSchema(titleString),
});

type TextLevelFormInput = z.input<typeof textLevelValidationSchema>;
type TextLevelFormValues = z.output<typeof textLevelValidationSchema>;

export {
	type TextLevelFormInput,
	type TextLevelFormValues,
	MAX_IMAGE_MEGABYTES,
	textLevelValidationSchema,
};
