type ThunkErrorPayload = {
	errors?: Record<string, string[]> | undefined;
	message: string;
	/** True only for an authenticated request rejected with 401 (session expired). */
	sessionExpired?: boolean | undefined;
	status?: number | undefined;
};

export { type ThunkErrorPayload };
