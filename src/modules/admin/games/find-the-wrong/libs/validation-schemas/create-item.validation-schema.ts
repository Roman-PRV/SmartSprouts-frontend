import { z } from "zod";

import { buildLocalizedSchema } from "~/libs/modules/localization/localization";

import { MIN_POLYGON_VERTICES } from "../helpers/polygon-mutations.helper";

const MAX_NAME_LENGTH = 255;
const MIN_NAME_LENGTH = 1;
const MAX_EXPLANATION_LENGTH = 1000;
const COORDINATE_MIN = 0;
const COORDINATE_MAX = 1;

const VALIDATION_MESSAGES = {
	NAME_REQUIRED: "admin.findTheWrong.item.validation.nameRequired",
	POLYGON_MIN_POINTS: "admin.findTheWrong.item.validation.polygonMinPoints",
	TOO_LONG: "admin.findTheWrong.item.validation.tooLong",
} as const;

const requiredName = z
	.string()
	.trim()
	.min(MIN_NAME_LENGTH, VALIDATION_MESSAGES.NAME_REQUIRED)
	.max(MAX_NAME_LENGTH, VALIDATION_MESSAGES.TOO_LONG);

const optionalExplanation = z
	.string()
	.trim()
	.max(MAX_EXPLANATION_LENGTH, VALIDATION_MESSAGES.TOO_LONG)
	.optional();

const localizedName = buildLocalizedSchema(requiredName);
const localizedExplanation = buildLocalizedSchema(optionalExplanation);

const normalizedCoordinate = z.number().min(COORDINATE_MIN).max(COORDINATE_MAX);

const polygonPoints = z
	.array(z.tuple([normalizedCoordinate, normalizedCoordinate]))
	.min(MIN_POLYGON_VERTICES, VALIDATION_MESSAGES.POLYGON_MIN_POINTS);

const createItemValidationSchema = z.object({
	explanation: localizedExplanation,
	name: localizedName,
	polygon: polygonPoints,
});

const editItemValidationSchema = z.object({
	explanation: localizedExplanation,
	name: localizedName,
});

type CreateItemFormInput = z.input<typeof createItemValidationSchema>;
type CreateItemFormValues = z.output<typeof createItemValidationSchema>;
type EditItemFormInput = z.input<typeof editItemValidationSchema>;
type EditItemFormValues = z.output<typeof editItemValidationSchema>;

export {
	type CreateItemFormInput,
	type CreateItemFormValues,
	type EditItemFormInput,
	type EditItemFormValues,
	createItemValidationSchema,
	editItemValidationSchema,
	MAX_EXPLANATION_LENGTH,
	MAX_NAME_LENGTH,
};
