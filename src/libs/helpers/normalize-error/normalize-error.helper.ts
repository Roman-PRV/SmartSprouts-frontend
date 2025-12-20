import { EMPTY_ARRAY_LENGTH } from "~/libs/constants/constants";
import { HTTPError } from "~/libs/modules/http/http.js";
import { type ThunkErrorPayload } from "~/libs/types/types.js";

const isErrorRecord = (value: unknown): value is Record<string, string[]> => {
	if (typeof value !== "object" || value === null || Array.isArray(value)) {
		return false;
	}

	if (Object.keys(value).length === EMPTY_ARRAY_LENGTH) {
		return false;
	}

	return Object.values(value).every(
		(value_) => Array.isArray(value_) && value_.every((v) => typeof v === "string")
	);
};

const normalizeError = (error: unknown): ThunkErrorPayload => {
	if (error instanceof HTTPError) {
		const payload: ThunkErrorPayload = {
			message: error.message,
			status: error.status,
		};

		if (isErrorRecord(error.errors)) {
			payload.errors = error.errors;
		}

		return payload;
	}

	if (error instanceof Error) {
		return { message: error.message };
	}

	if (typeof error !== "object" || error === null) {
		return { message: "Unexpected error" };
	}

	const r = error as Record<string, unknown>;

	if (typeof r["message"] !== "string") {
		return { message: "Unexpected error" };
	}

	const payload: ThunkErrorPayload = {
		message: r["message"],
	};

	if (typeof r["status"] === "number") {
		payload.status = r["status"];
	}

	if (isErrorRecord(r["errors"])) {
		payload.errors = r["errors"];
	}

	return payload;
};

export { normalizeError };
