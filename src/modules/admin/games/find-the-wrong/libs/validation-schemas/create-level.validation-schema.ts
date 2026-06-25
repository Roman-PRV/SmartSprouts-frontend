import { z } from "zod";

import { buildLocalizedSchema } from "~/libs/modules/localization/localization";

import { buildImageFileSchema } from "./image-file.schema";

const MAX_TITLE_LENGTH = 255;
const MIN_TITLE_LENGTH = 1;
const MAX_IMAGE_MEGABYTES = 5;

const VALIDATION_MESSAGES = {
	IMAGE_REQUIRED: "admin.findTheWrong.create.validation.imageRequired",
	REQUIRED: "admin.findTheWrong.create.validation.required",
	TOO_LONG: "admin.findTheWrong.create.validation.tooLong",
} as const;

const titleString = z
	.string()
	.trim()
	.min(MIN_TITLE_LENGTH, VALIDATION_MESSAGES.REQUIRED)
	.max(MAX_TITLE_LENGTH, VALIDATION_MESSAGES.TOO_LONG);

const localizedString = buildLocalizedSchema(titleString);

const imageFile = buildImageFileSchema(MAX_IMAGE_MEGABYTES).transform((file, context) => {
	if (file === undefined) {
		context.addIssue({ code: "custom", message: VALIDATION_MESSAGES.IMAGE_REQUIRED });

		return z.NEVER;
	}

	return file;
});

const createLevelValidationSchema = z.object({
	image: imageFile,
	title: localizedString,
});

type CreateLevelFormInput = z.input<typeof createLevelValidationSchema>;
type CreateLevelFormValues = z.output<typeof createLevelValidationSchema>;

export { ALLOWED_IMAGE_TYPES } from "./image-file.schema";
export {
	type CreateLevelFormInput,
	type CreateLevelFormValues,
	createLevelValidationSchema,
	MAX_IMAGE_MEGABYTES,
	MAX_TITLE_LENGTH,
};
