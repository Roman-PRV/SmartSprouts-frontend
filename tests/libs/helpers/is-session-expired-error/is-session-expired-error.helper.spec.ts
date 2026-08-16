import { describe, expect, it } from "vitest";

import { isSessionExpiredError } from "~/libs/helpers/is-session-expired-error/is-session-expired-error.helper";

describe("isSessionExpiredError", () => {
	it("returns true for a payload flagged sessionExpired", () => {
		expect(isSessionExpiredError({ message: "Unauthenticated.", sessionExpired: true })).toBe(true);
	});

	it("returns false when sessionExpired is absent or false", () => {
		expect(isSessionExpiredError({ message: "Bad request" })).toBe(false);
		expect(isSessionExpiredError({ message: "x", sessionExpired: false })).toBe(false);
	});

	it("returns false for values that are not error payloads", () => {
		expect(isSessionExpiredError(null)).toBe(false);
		expect(isSessionExpiredError("nope")).toBe(false);
		// No message → not a ThunkErrorPayload, even with the flag.
		expect(isSessionExpiredError({ sessionExpired: true })).toBe(false);
	});
});
