import { z } from "zod";

import { buildLocalizedSchema } from "~/libs/modules/localization/localization";
import { buildImageFileSchema } from "~/libs/validation-schemas/image-file.schema";

import { MAX_IMAGE_MEGABYTES, titleString, VALIDATION_MESSAGES } from "./base.validation-schema";
import { IMAGE_FILE_MESSAGES } from "./image-file-messages";

const MIN_TEXT_LENGTH = 1;
const MAX_TEXT_LENGTH = 2000;

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

export { type TextLevelFormInput, type TextLevelFormValues, textLevelValidationSchema };
