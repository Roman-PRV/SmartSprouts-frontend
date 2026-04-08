const VALIDATION_RULES = {
	MIN_NAME_LENGTH: 1,
	MIN_PASSWORD_LENGTH: 6,
} as const;

const VALIDATION_MESSAGES = {
	INVALID_EMAIL_FORMAT: "validation.email.invalid",
	MIN_NAME_LENGTH: "validation.name.required",
	MIN_PW_LENGTH: "validation.password.minLength",
	PW_CONTAINS_LETTER: "validation.password.mustContainLetter",
	PW_CONTAINS_NUMBER: "validation.password.mustContainNumber",
	PW_DO_NOT_MATCH: "validation.passwordConfirmation.mustMatch",
} as const;

export { VALIDATION_MESSAGES, VALIDATION_RULES };
