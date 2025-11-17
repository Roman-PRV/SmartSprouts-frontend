import { HTTPError } from "~/libs/modules/http/http.js";
import { type ThunkErrorPayload } from "~/libs/types/types.js";

const normalizeError = (error: unknown): ThunkErrorPayload => {
	if (error instanceof HTTPError) {
		const payload: ThunkErrorPayload = { message: error.message, status: error.status };

		return payload;
	}

	if (error instanceof Error) {
		return { message: error.message };
	}

	if (typeof error === "object" && error !== null) {
		const r = error as Record<string, unknown>;

		if (typeof r["message"] === "string") {
			const payload: ThunkErrorPayload = { message: r["message"] };

			if (typeof r["status"] === "number") {
				payload.status = r["status"];
			}

			return payload;
		}
	}

	return { message: "Unexpected error" };
};

export { normalizeError };
