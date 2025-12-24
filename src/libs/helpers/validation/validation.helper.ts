import { type ZodType } from "zod";

import { FIRST_INDEX } from "~/libs/constants/constants";

const getFormValidationErrors = <T>(data: T, schema: ZodType<T>): null | Record<string, string> => {
	const validationResult = schema.safeParse(data);

	if (validationResult.success) {
		return null;
	}

	const errors: Record<string, string> = {};

	for (const issue of validationResult.error.issues) {
		const path = issue.path[FIRST_INDEX];

		if (path) {
			errors[String(path)] = issue.message;
		}
	}

	return errors;
};

export { getFormValidationErrors };
