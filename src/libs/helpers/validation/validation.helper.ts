import { type ZodType } from "zod";

import { EMPTY_ARRAY_LENGTH } from "~/libs/constants/empty-array-length";

/**
 * Validates data against a Zod schema and returns formatted error messages.
 *
 * @template T - The type of the data to validate.
 * @param data - The data to be validated.
 * @param schema - The Zod schema to validate against.
 * @returns An object with field names as keys and the first error message as value,
 * or `null` if validation is successful or if there are no recoverable errors.
 *
 * @example
 * ```ts
 * const errors = getFormValidationErrors(
 *   { email: "invalid-email" },
 *   loginSchema
 * );
 * // Result: { email: "Invalid email format" }
 * ```
 */
const getFormValidationErrors = <T>(data: T, schema: ZodType<T>): null | Record<string, string> => {
	const validationResult = schema.safeParse(data);

	if (validationResult.success) {
		return null;
	}

	const errors: Record<string, string> = {};

	for (const issue of validationResult.error.issues) {
		const pathKey = issue.path.join(".");

		if (!errors[pathKey]) {
			errors[pathKey] = issue.message;
		}
	}

	return Object.keys(errors).length > EMPTY_ARRAY_LENGTH ? errors : null;
};

export { getFormValidationErrors };
