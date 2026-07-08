import { z } from "zod";

import { AppEnvironment } from "~/libs/enums/enums";

const REQUIRED_STRING_MIN_LENGTH = 1;

const environmentValidationSchema = z.object({
	API: z.object({
		ORIGIN_URL: z.string().min(REQUIRED_STRING_MIN_LENGTH),
	}),
	APP: z.object({
		ENVIRONMENT: z.enum(AppEnvironment),
	}),
});

export { environmentValidationSchema };
