import { z } from "zod";

import { buildLocalizedSchema } from "~/libs/modules/localization/localization";
import { buildImageFileSchema } from "~/libs/validation-schemas/image-file.schema";

import { IMAGE_FILE_MESSAGES } from "./image-file-messages";

const MAX_TITLE_LENGTH = 255;
const MIN_TITLE_LENGTH = 1;
const MAX_IMAGE_MEGABYTES = 5;

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

const requiredImage = buildImageFileSchema(MAX_IMAGE_MEGABYTES, IMAGE_FILE_MESSAGES).transform(
	(file, context) => {
		if (file === undefined) {
			context.addIssue({ code: "custom", message: VALIDATION_MESSAGES.IMAGE_REQUIRED });

			return z.NEVER;
		}

		return file;
	}
);

const imageLevelValidationSchema = z.object({
	image: requiredImage,
	title: buildLocalizedSchema(titleString),
});

// On edit the image is optional — omitting it keeps the existing cover.
const imageLevelEditValidationSchema = z.object({
	image: buildImageFileSchema(MAX_IMAGE_MEGABYTES, IMAGE_FILE_MESSAGES),
	title: buildLocalizedSchema(titleString),
});

type ImageLevelEditFormInput = z.input<typeof imageLevelEditValidationSchema>;
type ImageLevelEditFormValues = z.output<typeof imageLevelEditValidationSchema>;
type ImageLevelFormInput = z.input<typeof imageLevelValidationSchema>;
type ImageLevelFormValues = z.output<typeof imageLevelValidationSchema>;

export {
	type ImageLevelEditFormInput,
	type ImageLevelEditFormValues,
	type ImageLevelFormInput,
	type ImageLevelFormValues,
	imageLevelEditValidationSchema,
	imageLevelValidationSchema,
	MAX_IMAGE_MEGABYTES,
};
