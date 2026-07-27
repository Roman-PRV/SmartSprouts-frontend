import { type ThunkErrorPayload } from "~/libs/types/types";

const isThunkErrorPayload = (error: unknown): error is ThunkErrorPayload => {
	return (
		typeof error === "object" &&
		error !== null &&
		"message" in error &&
		typeof (error as ThunkErrorPayload).message === "string"
	);
};

export { isThunkErrorPayload };
