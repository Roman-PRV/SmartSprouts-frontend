import { z } from "zod";

import { VALIDATION_MESSAGES, VALIDATION_RULES } from "~/libs/constants/constants";

const newPasswordSchema = z
	.string()
	.min(VALIDATION_RULES.MIN_PASSWORD_LENGTH, VALIDATION_MESSAGES.MIN_PW_LENGTH)
	.regex(/[a-z]/, VALIDATION_MESSAGES.PW_CONTAINS_LETTER)
	.regex(/[A-Z]/, VALIDATION_MESSAGES.PW_CONTAINS_LETTER)
	.regex(/\d/, VALIDATION_MESSAGES.PW_CONTAINS_NUMBER);

const updatePasswordValidationSchema = z
	.object({
		current_password: z.string().min(VALIDATION_RULES.MIN_STRING_LENGTH, "validation.password.required"),
		new_password: newPasswordSchema,
		new_password_confirmation: newPasswordSchema,
	})
	.refine((data) => data.new_password === data.new_password_confirmation, {
		message: VALIDATION_MESSAGES.PW_DO_NOT_MATCH,
		path: ["new_password_confirmation"],
	});

export { updatePasswordValidationSchema };
