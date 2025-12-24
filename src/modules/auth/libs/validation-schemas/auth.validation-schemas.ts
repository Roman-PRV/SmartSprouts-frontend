import { z } from "zod";

import { VALIDATION_RULES } from "~/libs/constants/constants";
import { emailSchema, passwordSchema } from "~/libs/validation-schemas/validation-schemas";

const loginSchema = z.object({
	email: emailSchema,
	password: passwordSchema,
});

const registerSchema = z
	.object({
		email: emailSchema,
		name: z.string().trim().min(VALIDATION_RULES.MIN_NAME_LENGTH, "Name is required"),
		password: passwordSchema,
		password_confirmation: z.string(),
	})
	.refine((data) => data.password === data.password_confirmation, {
		message: "Passwords do not match",
		path: ["password_confirmation"],
	});

export { loginSchema, registerSchema };
