import { z } from "zod";

import { VALIDATION_MESSAGES } from "~/libs/constants/constants";
import { basicPasswordSchema, passwordSchema } from "~/libs/validation-schemas/validation-schemas";

const updatePasswordValidationSchema = z
	.object({
		current_password: basicPasswordSchema,
		new_password: passwordSchema,
		new_password_confirmation: basicPasswordSchema,
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
