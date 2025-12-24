import { z } from "zod";

import { VALIDATION_RULES } from "~/libs/constants/constants";

const emailSchema = z
	.email("Invalid email format")
	.trim()
	.min(VALIDATION_RULES.MIN_NAME_LENGTH, "Email is required");

const passwordSchema = z
	.string()
	.trim()
	.min(
		VALIDATION_RULES.MIN_PASSWORD_LENGTH,
		`Password must be at least ${String(VALIDATION_RULES.MIN_PASSWORD_LENGTH)} characters`
	)
	.regex(/\d/, "Password must contain at least one number");

export { emailSchema, passwordSchema };
