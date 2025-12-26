import { type ZodType } from "zod";

/**
 * Validates data against a Zod schema and returns formatted error messages and transformed data.
 *
 * @template Output - The type of the transformed output data (after Zod transformations like trim, toLowerCase, etc.).
 * @template Input - The type of the input data to validate.
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
 * // TypeScript correctly infers that data.email is lowercase and trimmed
 * ```
 */
const validateFormData = <Output = unknown, Input = Output>(
	data: Input,
	schema: ZodType<Output, Input>
): { data: null; errors: Record<string, string> } | { data: Output; errors: null } => {
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
		errors,
	};
};

export { validateFormData };
