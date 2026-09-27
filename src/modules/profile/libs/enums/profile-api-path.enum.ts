const ProfileApiPath = {
	CONSENTS: "/consents",
	CONSENTS_DECLINE: "/consents/decline",
	DELETION_CODE: "/deletion-code",
	// eslint-disable-next-line sonarjs/no-hardcoded-passwords
	PASSWORD: "/password",
	ROOT: "/",
} as const;

export { ProfileApiPath };
