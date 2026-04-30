import { z } from "zod";

import { VALIDATION_MESSAGES, VALIDATION_RULES } from "~/libs/constants/constants";
import { passwordSchema } from "~/libs/validation-schemas/validation-schemas";

const updatePasswordValidationSchema = z
	.object({
		current_password: z
			.string()
			.min(VALIDATION_RULES.MIN_STRING_LENGTH, "validation.password.required"),
		new_password: passwordSchema,
		new_password_confirmation: z
			.string()
			.min(VALIDATION_RULES.MIN_STRING_LENGTH, "validation.passwordConfirmation.required"),
	})
	.refine((data) => data.new_password === data.new_password_confirmation, {
		message: VALIDATION_MESSAGES.PW_DO_NOT_MATCH,
		path: ["new_password_confirmation"],
	})
	.refine((data) => data.current_password !== data.new_password, {
		message: VALIDATION_MESSAGES.PW_MUST_BE_NEW,
		path: ["new_password"],
	});

export { updatePasswordValidationSchema };
