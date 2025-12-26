import { type ZodType } from "zod";

import { EMPTY_ARRAY_LENGTH } from "~/libs/constants/empty-array-length";

/**
 * Validates data against a Zod schema and returns formatted error messages and transformed data.
 *
 * @template T - The type of the data to validate.
 * @param data - The data to be validated.
 * @param schema - The Zod schema to validate against.
 * @returns An object containing:
 * - `errors`: An object with field names as keys and the first error message as value,
 *   or `null` if validation is successful.
 * - `data`: The transformed data from Zod if validation is successful, or `null`.
 *
 * @example
 * ```ts
 * const { errors, data } = validateFormData(
 *   { email: "  User@Example.Com  " },
 *   loginSchema
 * );
 * // If successful: errors is null, data is { email: "user@example.com" }
 * ```
 */
const validateFormData = <T>(
	data: T,
	schema: ZodType<T>
): { data: null | T; errors: null | Record<string, string> } => {
	const validationResult = schema.safeParse(data);

	if (validationResult.success) {
		return {
			data: validationResult.data,
			errors: null,
		};
	}

	const errors: Record<string, string> = {};

	for (const issue of validationResult.error.issues) {
		const pathKey = issue.path.join(".");

		if (!errors[pathKey]) {
			errors[pathKey] = issue.message;
		}
	}

	return {
		data: null,
		errors: Object.keys(errors).length > EMPTY_ARRAY_LENGTH ? errors : null,
	};
};

export { validateFormData };
