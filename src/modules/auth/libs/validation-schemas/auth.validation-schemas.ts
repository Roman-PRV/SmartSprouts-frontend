import { z } from "zod";

import { VALIDATION_MESSAGES } from "~/libs/constants/constants";
import {
	basicPasswordSchema,
	emailSchema,
	nameSchema,
	passwordSchema,
} from "~/libs/validation-schemas/validation-schemas";

/**
 * Schema for login form validation.
 * Includes:
 * - email: {@link emailSchema}
 * - password: {@link basicPasswordSchema}
 */
const loginSchema = z.object({
	email: emailSchema,
	password: basicPasswordSchema,
});

/** Must be `true`: the 18+/guardian affirmation plus acceptance of the legal documents. */
const acceptedTermsSchema = z.boolean().refine((value) => value, {
	message: VALIDATION_MESSAGES.TERMS_MUST_BE_ACCEPTED,
});

/**
 * Schema for registration form validation.
 * Includes:
 * - accepted_terms: must be true (18+/guardian affirmation + legal documents)
 * - email: {@link emailSchema}
 * - name: {@link nameSchema}
 * - password: {@link passwordSchema}
 * - password_confirmation: {@link basicPasswordSchema}
 *
 * Additional checks:
 * - Ensures password and password_confirmation match.
 */
const registerSchema = z
	.object({
		accepted_terms: acceptedTermsSchema,
		email: emailSchema,
		name: nameSchema,
		password: passwordSchema,
		password_confirmation: basicPasswordSchema,
	})
	.refine((data) => data.password === data.password_confirmation, {
		message: VALIDATION_MESSAGES.PW_DO_NOT_MATCH,
		path: ["password_confirmation"],
	});

/**
 * Schema for the blocking consent gate (re-consent / repair of accounts
 * created without consent).
 */
const consentGateSchema = z.object({
	accepted_terms: acceptedTermsSchema,
});

type ConsentGateFormValues = z.infer<typeof consentGateSchema>;

export { type ConsentGateFormValues, consentGateSchema, loginSchema, registerSchema };
