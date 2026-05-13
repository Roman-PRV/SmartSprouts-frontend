import { type ThunkErrorPayload } from "~/libs/types/types";

const isThunkErrorPayload = (error: unknown): error is ThunkErrorPayload => {
	return (
		typeof error === "object" &&
		error !== null &&
		"errors" in error &&
		typeof (error as ThunkErrorPayload).errors === "object"
	);
};

export { isThunkErrorPayload };
