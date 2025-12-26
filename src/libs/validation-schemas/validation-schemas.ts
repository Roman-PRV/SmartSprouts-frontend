import { z } from "zod";

import { VALIDATION_MESSAGES, VALIDATION_RULES } from "~/libs/constants/constants";

/**
 * Schema for email validation.
 * Rules:
 * - Trims whitespace
 * - Validates email format
 * - Converts to lowercase
 */
const emailSchema = z
	.string()
	.trim()
	.pipe(z.email(VALIDATION_MESSAGES.INVALID_EMAIL_FORMAT).toLowerCase());

/**
 * Schema for name validation.
 * Rules:
 * - Trims whitespace
 * - Minimum length: {@link VALIDATION_RULES.MIN_NAME_LENGTH}
 */
const nameSchema = z
	.string()
	.trim()
	.min(VALIDATION_RULES.MIN_NAME_LENGTH, VALIDATION_MESSAGES.MIN_NAME_LENGTH);

/**
 * Schema for password validation.
 * Rules:
 * - Minimum length: {@link VALIDATION_RULES.MIN_PASSWORD_LENGTH}
 * - Must contain at least one digit
 */
const passwordSchema = z
	.string()
	.min(VALIDATION_RULES.MIN_PASSWORD_LENGTH, VALIDATION_MESSAGES.MIN_PW_LENGTH)
	.regex(/\d/, VALIDATION_MESSAGES.PW_CONTAINS_NUMBER);

export { emailSchema, nameSchema, passwordSchema };
