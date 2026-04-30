const VALIDATION_RULES = {
	MIN_NAME_LENGTH: 1,
	MIN_PASSWORD_LENGTH: 8,
	MIN_STRING_LENGTH: 1,
} as const;

const VALIDATION_MESSAGES = {
	INVALID_EMAIL_FORMAT: "validation.email.invalid",
	MIN_NAME_LENGTH: "validation.name.required",
	MIN_PW_LENGTH: "validation.password.minLength",
	PW_CONTAINS_LETTER: "validation.password.mustContainLetter",
	PW_CONTAINS_LOWERCASE: "validation.password.mustContainLowercase",
	PW_CONTAINS_NUMBER: "validation.password.mustContainNumber",
	PW_CONTAINS_UPPERCASE: "validation.password.mustContainUppercase",
	PW_DO_NOT_MATCH: "validation.passwordConfirmation.mustMatch",
	PW_MUST_BE_NEW: "validation.password.mustBeNew",
} as const;

export { VALIDATION_MESSAGES, VALIDATION_RULES };
