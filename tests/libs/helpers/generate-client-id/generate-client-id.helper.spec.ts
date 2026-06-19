import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { generateClientId } from "~/libs/helpers/generate-client-id/generate-client-id.helper";

describe("generateClientId", () => {
	describe("with crypto.getRandomValues available", () => {
		it("returns a non-empty string", () => {
			expect(generateClientId().length).toBeGreaterThan(0);
		});

		it("returns a different value on each call", () => {
			const ids = new Set([generateClientId(), generateClientId(), generateClientId()]);

			expect(ids.size).toBe(3);
		});

		it("uses base36 alphanumeric characters", () => {
			expect(generateClientId()).toMatch(/^[\da-z]+$/);
		});
	});

	describe("without crypto.getRandomValues", () => {
		const originalGetRandomValues = crypto.getRandomValues.bind(crypto);

		beforeEach(() => {
			Object.defineProperty(crypto, "getRandomValues", {
				configurable: true,
				value: undefined,
			});
		});

		afterEach(() => {
			Object.defineProperty(crypto, "getRandomValues", {
				configurable: true,
				value: originalGetRandomValues,
			});
		});

		it("falls back to a timestamp + counter format when crypto is missing", () => {
			expect(generateClientId()).toMatch(/^[\da-z]+-[\da-z]+$/);
		});

		it("generates unique fallback ids across rapid sequential calls", () => {
			const ids = new Set(Array.from({ length: 10 }, () => generateClientId()));

			expect(ids.size).toBe(10);
		});
	});
});
