import { z } from "zod";

const MAX_TITLE_LENGTH = 255;
const MIN_TITLE_LENGTH = 1;
const MAX_IMAGE_MEGABYTES = 5;
const BYTES_IN_KILOBYTE = 1024;
const KILOBYTES_IN_MEGABYTE = 1024;
const MAX_IMAGE_BYTES = MAX_IMAGE_MEGABYTES * KILOBYTES_IN_MEGABYTE * BYTES_IN_KILOBYTE;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

const VALIDATION_MESSAGES = {
	IMAGE_REQUIRED: "admin.findTheWrong.create.validation.imageRequired",
	IMAGE_SIZE: "admin.findTheWrong.create.validation.imageSize",
	IMAGE_TYPE: "admin.findTheWrong.create.validation.imageType",
	REQUIRED: "admin.findTheWrong.create.validation.required",
	TOO_LONG: "admin.findTheWrong.create.validation.tooLong",
} as const;

const titleString = z
	.string()
	.trim()
	.min(MIN_TITLE_LENGTH, VALIDATION_MESSAGES.REQUIRED)
	.max(MAX_TITLE_LENGTH, VALIDATION_MESSAGES.TOO_LONG);

const localizedString = z.object({
	en: titleString,
	es: titleString,
	uk: titleString,
});

const FIRST_FILE = 0;
const EMPTY = 0;

const isFileList = (value: unknown): value is FileList =>
	typeof FileList !== "undefined" && value instanceof FileList;

const imageFile = z
	.custom<FileList>((value) => isFileList(value), {
		message: VALIDATION_MESSAGES.IMAGE_REQUIRED,
	})
	.refine((list) => list.length > EMPTY, VALIDATION_MESSAGES.IMAGE_REQUIRED)
	.transform((list, context) => {
		const file = list.item(FIRST_FILE);

		if (file === null) {
			context.addIssue({
				code: "custom",
				message: VALIDATION_MESSAGES.IMAGE_REQUIRED,
			});

			return z.NEVER;
		}

		return file;
	})
	.refine(
		(file) => (ALLOWED_IMAGE_TYPES as readonly string[]).includes(file.type),
		VALIDATION_MESSAGES.IMAGE_TYPE
	)
	.refine((file) => file.size <= MAX_IMAGE_BYTES, VALIDATION_MESSAGES.IMAGE_SIZE);

const createLevelValidationSchema = z.object({
	image: imageFile,
	title: localizedString,
});

type CreateLevelFormInput = z.input<typeof createLevelValidationSchema>;
type CreateLevelFormValues = z.output<typeof createLevelValidationSchema>;

export {
	type CreateLevelFormInput,
	type CreateLevelFormValues,
	ALLOWED_IMAGE_TYPES,
	createLevelValidationSchema,
	MAX_IMAGE_MEGABYTES,
	MAX_TITLE_LENGTH,
};
