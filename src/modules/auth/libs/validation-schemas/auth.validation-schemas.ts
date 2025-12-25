import { z } from "zod";

import { VALIDATION_MESSAGES } from "~/libs/constants/validation.constants";
import {
	emailSchema,
	nameSchema,
	passwordSchema,
} from "~/libs/validation-schemas/validation-schemas";

const loginSchema = z.object({
	email: emailSchema,
	password: passwordSchema,
});

const registerSchema = z
	.object({
		email: emailSchema,
		name: nameSchema,
		password: passwordSchema,
		password_confirmation: passwordSchema,
	})
	.refine((data) => data.password === data.password_confirmation, {
		message: VALIDATION_MESSAGES.PW_DO_NOT_MATCH,
		path: ["password_confirmation"],
	});

export { loginSchema, registerSchema };
