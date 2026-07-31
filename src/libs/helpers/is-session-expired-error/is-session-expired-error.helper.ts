import { isThunkErrorPayload } from "../is-thunk-error-payload/is-thunk-error-payload.helper";

/**
 * Whether a rejection is an expired authenticated session (a 401 the API layer
 * flagged). Such failures are handled globally (token cleared, redirect to
 * login), so local catch sites should stay silent instead of showing an error.
 */
const isSessionExpiredError = (error: unknown): boolean => {
	return isThunkErrorPayload(error) && error.sessionExpired === true;
};

export { isSessionExpiredError };
