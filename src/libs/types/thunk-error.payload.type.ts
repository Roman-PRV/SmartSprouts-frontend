type ThunkErrorPayload = {
	errors?: Record<string, string[]> | undefined;
	message: string;
	status?: number | undefined;
};

export { type ThunkErrorPayload };
