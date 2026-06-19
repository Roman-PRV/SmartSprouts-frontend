import { z } from "zod";

import { buildLocalizedSchema } from "~/libs/modules/localization/localization";

import { MAX_IMAGE_MEGABYTES, MAX_TITLE_LENGTH } from "./create-level.validation-schema";
import { buildImageFileSchema } from "./image-file.schema";

const MIN_TITLE_LENGTH = 1;

const VALIDATION_MESSAGES = {
	REQUIRED: "admin.findTheWrong.create.validation.required",
	TOO_LONG: "admin.findTheWrong.create.validation.tooLong",
} as const;

const titleString = z
	.string()
	.trim()
	.min(MIN_TITLE_LENGTH, VALIDATION_MESSAGES.REQUIRED)
	.max(MAX_TITLE_LENGTH, VALIDATION_MESSAGES.TOO_LONG);

const localizedString = buildLocalizedSchema(titleString);

const updateLevelValidationSchema = z.object({
	image: buildImageFileSchema(MAX_IMAGE_MEGABYTES),
	title: localizedString,
});

type UpdateLevelFormInput = z.input<typeof updateLevelValidationSchema>;
type UpdateLevelFormValues = z.output<typeof updateLevelValidationSchema>;

export {
	type UpdateLevelFormInput,
	type UpdateLevelFormValues,
	updateLevelValidationSchema,
};
