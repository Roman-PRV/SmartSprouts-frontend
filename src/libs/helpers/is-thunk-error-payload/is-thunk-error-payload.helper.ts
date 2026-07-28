import { type ThunkErrorPayload } from "~/libs/types/types";

/**
 * Narrows an unknown rejection to a normalized error payload. Only `message`
 * is required; `errors`/`status`/`sessionExpired` are optional, so the minimal
 * valid payload is `{ message }`.
 */
const isThunkErrorPayload = (error: unknown): error is ThunkErrorPayload => {
	return (
		typeof error === "object" &&
		error !== null &&
		"message" in error &&
		typeof (error as ThunkErrorPayload).message === "string"
	);
};

export { isThunkErrorPayload };
