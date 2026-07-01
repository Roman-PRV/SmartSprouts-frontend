import { z } from "zod";

import { buildLocalizedSchema } from "~/libs/modules/localization/localization";
import { buildImageFileSchema } from "~/libs/validation-schemas/image-file.schema";

import { MAX_IMAGE_MEGABYTES, titleString, VALIDATION_MESSAGES } from "./base.validation-schema";
import { IMAGE_FILE_MESSAGES } from "./image-file-messages";

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
	
};
export {MAX_IMAGE_MEGABYTES} from "./base.validation-schema";