import { type SerializedError } from "@reduxjs/toolkit";

import { type ThunkErrorPayload } from "~/libs/types/types";

/**
 * Normalizes a rejected-thunk action into the store's error shape: prefer the
 * server-provided payload, else the serialized message, else null.
 */
const toThunkError = (action: {
	error: SerializedError;
	payload: null | ThunkErrorPayload | undefined;
}): null | ThunkErrorPayload =>
	action.payload ?? (action.error.message ? { message: action.error.message } : null);

export { toThunkError };
