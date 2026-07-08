import { z } from "zod";

import { buildLocalizedSchema } from "~/libs/modules/localization/localization";
import { buildImageFileSchema } from "~/libs/validation-schemas/image-file.schema";

import { MAX_IMAGE_MEGABYTES, MAX_TITLE_LENGTH } from "./create-level.validation-schema";

const MIN_TITLE_LENGTH = 1;

const VALIDATION_MESSAGES = {
	REQUIRED: "admin.findTheWrong.create.validation.required",
	TOO_LONG: "admin.findTheWrong.create.validation.tooLong",
} as const;

const IMAGE_FILE_MESSAGES = {
	size: "admin.findTheWrong.create.validation.imageSize",
	type: "admin.findTheWrong.create.validation.imageType",
} as const;

const titleString = z
	.string()
	.trim()
	.min(MIN_TITLE_LENGTH, VALIDATION_MESSAGES.REQUIRED)
	.max(MAX_TITLE_LENGTH, VALIDATION_MESSAGES.TOO_LONG);

const localizedString = buildLocalizedSchema(titleString);

const updateLevelValidationSchema = z.object({
	image: buildImageFileSchema(MAX_IMAGE_MEGABYTES, IMAGE_FILE_MESSAGES),
	title: localizedString,
});

type UpdateLevelFormInput = z.input<typeof updateLevelValidationSchema>;
type UpdateLevelFormValues = z.output<typeof updateLevelValidationSchema>;

export { type UpdateLevelFormInput, type UpdateLevelFormValues, updateLevelValidationSchema };
