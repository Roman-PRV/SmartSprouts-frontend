import { z } from "zod";

import { buildLocalizedSchema } from "~/libs/modules/localization/localization";

import { VALIDATION_MESSAGES } from "./base.validation-schema";

const MIN_STATEMENT_LENGTH = 1;
const MAX_STATEMENT_LENGTH = 500;

const statementText = z
	.string()
	.trim()
	.min(MIN_STATEMENT_LENGTH, VALIDATION_MESSAGES.REQUIRED)
	.max(MAX_STATEMENT_LENGTH, VALIDATION_MESSAGES.TOO_LONG);

// Explanation is optional and per-locale independent: empty strings are allowed
// and simply leave that locale blank on the backend.
const explanationText = z.string().trim().max(MAX_STATEMENT_LENGTH, VALIDATION_MESSAGES.TOO_LONG);

const statementValidationSchema = z.object({
	explanation: buildLocalizedSchema(explanationText),
	is_true: z.boolean(),
	statement: buildLocalizedSchema(statementText),
});

type StatementFormInput = z.input<typeof statementValidationSchema>;
type StatementFormValues = z.output<typeof statementValidationSchema>;

export { type StatementFormInput, type StatementFormValues, statementValidationSchema };
