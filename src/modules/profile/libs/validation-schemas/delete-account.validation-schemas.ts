import { z } from "zod";

import { VALIDATION_MESSAGES } from "~/libs/constants/constants";
import { basicPasswordSchema } from "~/libs/validation-schemas/validation-schemas";

/**
 * Schema confirming account deletion with the current password
 * (accounts that have one).
 */
const deleteAccountWithPasswordValidationSchema = z.object({
	password: basicPasswordSchema,
});

/**
 * Schema confirming account deletion with the one-time emailed code
 * (password-less Google-only accounts). The backend issues 6-digit codes.
 */
const deleteAccountWithCodeValidationSchema = z.object({
	code: z.string().regex(/^\d{6}$/, VALIDATION_MESSAGES.DELETION_CODE_FORMAT),
});

export { deleteAccountWithCodeValidationSchema, deleteAccountWithPasswordValidationSchema };
