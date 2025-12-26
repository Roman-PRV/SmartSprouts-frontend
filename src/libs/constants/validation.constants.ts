const VALIDATION_RULES = {
	MIN_NAME_LENGTH: 1,
	MIN_PASSWORD_LENGTH: 6,
} as const;

const VALIDATION_MESSAGES = {
	INVALID_EMAIL_FORMAT: "Invalid email format",
	MIN_NAME_LENGTH: "Name is required",
	MIN_PW_LENGTH: "Password must be at least 6 characters",
	PW_CONTAINS_NUMBER: "Password must contain at least one number",
	PW_DO_NOT_MATCH: "Passwords do not match",
} as const;

export { VALIDATION_MESSAGES, VALIDATION_RULES };
