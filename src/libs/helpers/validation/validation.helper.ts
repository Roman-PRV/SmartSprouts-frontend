import { type ZodType } from "zod";

import { EMPTY_ARRAY_LENGTH } from "~/libs/constants/empty-array-length";

const getFormValidationErrors = <T>(
	data: T,
	schema: ZodType<T>
): null | Record<string, string> => {
	const validationResult = schema.safeParse(data);

	if (validationResult.success) {
		return null;
	}

	const errors: Record<string, string> = {};

	for (const issue of validationResult.error.issues) {
		const pathKey = issue.path.join(".");

		if (pathKey && !errors[pathKey]) {
			errors[pathKey] = issue.message;
		}
	}

	return Object.keys(errors).length > EMPTY_ARRAY_LENGTH ? errors : null;
};

export { getFormValidationErrors };